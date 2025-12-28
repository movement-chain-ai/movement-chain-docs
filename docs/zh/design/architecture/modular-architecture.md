# 模块化架构设计 Modular Architecture

> **文档目的**: 定义 Movement Chain AI 的 LEGO 积木式模块化架构
>
> **核心理念**: 每个组件独立可替换，MVP 快速验证，渐进式升级
>
> **阅读时间**: 25 分钟

---

## 1. LEGO 哲学

### 1.1 LEGO 核心原则

1. **模块独立** — 每个模块是独立的"积木块"，可以单独替换，接口保持稳定
2. **快速验证** — MVP 用最简单的积木快速搭建，验证完整管道和用户价值
3. **延迟决策** — 不提前设计"终态"，根据真实用户数据决定升级方向
4. **数据驱动** — 复杂度来自训练数据，不来自代码 (AI 能写代码，但数据需要积累)
5. **融合优先** — 单传感器准确性不如跨传感器验证重要
6. **六边形架构** — Ports & Adapters 模式，硬件依赖通过接口隔离

### 1.2 技术不确定性管理

我们面临多个技术不确定性:

| 不确定性 | 选项 | MVP 策略 | 升级触发条件 |
|---------|------|---------|-------------|
| **分类器选择** | Simple Rules vs SwingNet vs BiGRU | Simple Rules (IMU 峰值/零交叉) | 需要完整 8 阶段划分时 |
| **姿态估计** | MediaPipe vs RTMPose vs Custom | MediaPipe (最易集成) | 精度不足时升级 |
| **传感器数据** | 真实 vs 模拟 IMU/EMG | 模拟 (验证管道) | 硬件就绪后替换 |
| **融合方法** | Simple vs Rule-based vs ML | Simple Merge | 有足够融合数据后升级 |

!!! tip "解决方案"
    把这些不确定性封装成**可替换的积木块**，通过定义清晰的接口契约，让替换成本最小化。

---

### 1.3 系统架构的阶段与积木块映射

> 📐 **完整 7 阶段架构图**: 见 [系统设计 §1.2](./system-design.md#12-完整系统架构目标态)

| Stage | 层级 | Block 数 | 对应积木块 | 关键输出 |
|-------|------|:--------:|-----------|---------|
| 1 | 用户挥杆 | — | (物理动作，无软件) | 用户开始挥杆 |
| 2 | 数据采集层 | 3 | [CAMERA](#211-camera-block), [SENSOR_HUB](#212-sensor-hub-block) ×N, [BLE](#213-ble-block) | 原始传感器流 |
| 3 | 传感器融合层 | 1 | [TIME_ALIGN](#221-time-align-block) | 统一时间轴数据 |
| 4 | 特征提取层 | 3 | [POSE](#232-pose-block), [IMU](#233-imu-block), [EMG](#234-emg-block) | 12 个结构化指标 |
| 5 | 分析诊断层 | 2 | [CLASSIFIER](#241-classifier-block), [FUSION](#242-fusion-block) | 8阶段 + 6规则诊断 |
| 6 | AI 反馈生成层 | 2 | [PROMPT](#251-prompt-block), [LLM](#252-llm-block) | Kinematic Prompts + 自然语言 |
| 7 | 用户反馈呈现层 | 1 | [OUTPUT](#261-output-block) | UI/TTS/触觉/Ghost |
| | **总计** | **12** | *(SENSOR_HUB 为可复用模块，部署 N 个实例)* | |

#### 接口契约汇总

| Stage | Block | 实例数 | Input 类型 | Output 类型 |
|:-----:|-------|:------:|-----------|------------|
| 2 | CAMERA | 1 | `CameraInput` | `CameraOutput` |
| 2 | SENSOR_HUB | N | `SensorHubInput` | `SensorHubOutput` |
| 2 | BLE | 1 | `BLEInput` | `BLEPacket` |
| 3 | TIME_ALIGN | 1 | `TimeAlignInput` | `TimeAlignOutput` |
| 4 | POSE | 1 | `VideoFrame` | `PoseResult` |
| 4 | IMU | 1 | `RawIMU` | `IMUFeatures` |
| 4 | EMG | 1 | `RawEMG` | `EMGFeatures` |
| 5 | CLASSIFIER | 1 | `ClassifierInput` | `ClassifierResult` |
| 5 | FUSION | 1 | `FusionInput` | `FusionResult` |
| 6 | PROMPT | 1 | `PromptInput` | `PromptOutput` |
| 6 | LLM | 1 | `LLMInput` | `LLMOutput` |
| 7 | OUTPUT | 1 | `OutputInput` | `OutputResult` |

> 💡 **SENSOR_HUB 复用**: 同一套固件代码，通过 `hub_id` 参数区分不同实例。MVP 部署 2 个 (N=2)。

> 📐 **详细定义**: 各 Block 接口契约的完整 Python dataclass 定义见对应章节。

## 2. 各积木块详情 {#2-各积木块详情}

### 2.1 数据采集层 {#21-数据采集层}

Stage 2 负责从多种传感器采集原始数据:
- **CAMERA**: iPhone 本机摄像头，通过 Native SDK 直接访问 (零延迟)
- **SENSOR_HUB**: ESP32 穿戴设备，通过 BLE 5.0 传输到 iPhone

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         数据采集层 DATA COLLECTION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────┐          ┌─────────────────────────────────────┐      │
│   │   CAMERA Block  │          │         SENSOR_HUB Block ×N         │      │
│   │   ─────────────  │          │  ┌───────────┐     ┌───────────┐    │      │
│   │   iPhone 摄像头   │          │  │  Hub #0   │     │  Hub #1   │    │      │
│   │   MediaPipe iOS  │          │  │ (hub_id=0)│ ... │ (hub_id=1)│    │      │
│   │   33 keypoints   │          │  └─────┬─────┘     └─────┬─────┘    │      │
│   └────────┬────────┘          └────────┼─────────────────┼──────────┘      │
│            │                            │                 │                 │
│            │ Native SDK                 │                 │                 │
│            │ (零延迟)                    │                 │                 │
│            │                            ▼                 ▼                 │
│            │                   ┌─────────────────────────────────┐          │
│            │                   │          BLE Block              │          │
│            │                   │   (数据传输 + 时间戳同步)          │          │
│            │                   │   • N 个外设连接                 │          │
│            │                   │   • <30ms 延迟                  │          │
│            │                   └──────────────┬──────────────────┘          │
│            │                                  │                             │
│            └──────────────────┬───────────────┘                             │
│                               ▼                                             │
│                        📱 iPhone App                                        │
│                        (数据汇聚点)                                          │
│                                                                             │
│   💡 SENSOR_HUB: 同一套固件代码，通过 hub_id 参数区分实例                        │
│      MVP: N=2 (上肢 + 下肢)                                                  │
│      扩展: N=4+ (四肢 + 躯干)                                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 2.1.1 CAMERA Block {#211-camera-block}

| 属性 | 规格 |
|------|------|
| **硬件** | iPhone 摄像头 (用户自有) |
| **SDK** | MediaPipe iOS SDK |
| **输出** | 33 个关键点 × 30fps |
| **坐标系** | 归一化 [0,1] 屏幕坐标 |

**接口契约**:

```python
# Input: 物理世界 (无软件输入，由硬件直接采集)
@dataclass
class CameraInput:
    """物理输入: iPhone 摄像头采集的视频帧"""
    video_frame: bytes          # RGB 图像数据
    width: int                  # 帧宽度
    height: int                 # 帧高度
    system_time_ms: int         # iOS 系统时间戳

# Output
@dataclass
class CameraOutput:
    timestamp_ms: int           # 系统时钟时间戳
    keypoints: List[Keypoint]   # 33 个关键点
    confidence: float           # 整体置信度 [0,1]

@dataclass
class Keypoint:
    x: float      # [0,1] 归一化
    y: float      # [0,1] 归一化
    z: float      # 深度估计 (相对值)
    visibility: float  # [0,1]
```

**可替换性**: MediaPipe → RTMPose → 自训练模型 (接口不变)

#### 2.1.2 SENSOR_HUB Block ×N {#212-sensor-hub-block}

> **核心特性**: 可复用固件模块，通过 `hub_id` 参数区分不同实例
>
> **部署灵活性**: 同一套代码可部署于任意身体部位 (手臂、腿部、躯干等)

| 属性 | 规格 |
|------|------|
| **MCU** | ESP32-S3 |
| **IMU** | 2× LSM6DSV16X |
| **EMG** | 1× MyoWare 2.0 — *Elite 版* |
| **采样率** | IMU: 1666Hz, EMG: 1000Hz |
| **实例数** | MVP: N=2, 扩展: N=4+ |

**典型部署配置**:

| hub_id | MVP 位置 | 扩展位置 (可选) |
|:------:|---------|----------------|
| 0 | 上肢 (双前臂) | 左臂 |
| 1 | 下肢 (双大腿) | 右臂 |
| 2 | — | 左腿 |
| 3 | — | 右腿 |
| 4 | — | 躯干/核心 |

**接口契约**:

```python
# Input: 物理传感器信号 (由硬件直接采集)
@dataclass
class SensorHubInput:
    """物理输入: LSM6DSV16X + MyoWare 传感器原始信号"""
    hub_id: int                 # 实例标识 (0, 1, 2, ...)
    imu_registers: bytes        # IMU I2C 寄存器读取
    emg_adc_value: int          # ADC 采样值 (0-4095)
    esp_micros: int             # ESP32 微秒计数器

# Output
@dataclass
class SensorHubOutput:
    hub_id: int                 # 实例标识 (0, 1, 2, ...)
    timestamp_us: int           # ESP32 micros() 时间戳
    imu_1: IMUReading           # 第一个 IMU
    imu_2: IMUReading           # 第二个 IMU
    emg: Optional[EMGReading]   # Elite 版才有

@dataclass
class IMUReading:
    accel: Vector3  # m/s² [-16g, +16g]
    gyro: Vector3   # rad/s [-2000°/s, +2000°/s]

@dataclass
class EMGReading:
    raw_mv: float       # 原始电压 mV
    rectified: float    # 整流后
    envelope: float     # 包络 (RMS 滤波)
```

!!! tip "固件复用优势"

    **同一套固件代码** 部署到所有 SENSOR_HUB 实例:

    - 开发效率: 只需维护一份代码
    - 测试覆盖: 一次测试覆盖所有实例
    - OTA 升级: 统一固件版本管理
    - 扩展性: 添加新 Hub 只需配置 `hub_id`

#### 2.1.3 BLE Block {#213-ble-block}

| 属性 | 规格 |
|------|------|
| **协议** | BLE 5.0 |
| **延迟** | < 30ms |
| **MTU** | 244 bytes |
| **连接** | N 个外设 (SENSOR_HUB ×N) |

**职责**:

1. 接收 ESP32 数据包 (含源端时间戳 + hub_id)
2. 计算传输延迟并补偿
3. 将数据转发到融合层

**接口契约**:

```python
# Input: 来自 ESP32 的 BLE 通知
@dataclass
class BLEInput:
    characteristic_uuid: str    # BLE 特征 UUID
    raw_bytes: bytes            # 原始字节流
    rssi: int                   # 信号强度

# Output
@dataclass
class BLEPacket:
    hub_id: int           # SENSOR_HUB 实例标识 (0, 1, 2, ...)
    esp_timestamp_us: int # ESP32 源端时间戳
    receive_time_ms: int  # iPhone 接收时间
    payload: bytes        # IMU/EMG 数据
    latency_ms: float     # 估算的传输延迟
```

---

### 2.2 传感器融合层 {#22-传感器融合层}

Stage 3 负责将三模态数据对齐到统一时间轴，并执行交叉验证。

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         传感器融合层 SENSOR FUSION                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   来自 Stage 2 的原始数据流:                                                 │
│   ─────────────────────────                                                 │
│   📹 Vision (30fps)  ──┐                                                    │
│   🔄 IMU (1666Hz)    ──┼──→  ⏱️ TIME_ALIGN Block ──→ 统一时间轴数据          │
│   💪 EMG (1000Hz)    ──┘                                                    │
│                                                                             │
│   输出到 Stage 4:                                                            │
│   ────────────────                                                          │
│   • 三模态时间对齐数据 (以 IMU 1666Hz 为主时钟)                               │
│   • 同步精度: 同Hub <10μs, 跨Hub <500μs, 跨设备 <10ms                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 2.2.1 TIME_ALIGN Block {#221-time-align-block}

| 属性 | 规格 |
|------|------|
| **输入** | Vision 30fps + IMU 1666Hz + EMG 1000Hz (各自带时间戳) |
| **输出** | 统一时间轴的三模态数据 |
| **主时钟** | IMU (1666Hz = 0.6ms 分辨率) |
| **同步精度** | < 10ms (跨设备) |

**接口契约**:

```python
@dataclass
class TimeAlignInput:
    vision_frames: List[CameraOutput]       # 30fps, 带时间戳
    hub_readings: List[SensorHubOutput]     # N 个 Hub, 各 1666Hz, 带时间戳 + hub_id
    # EMG 数据包含在 SensorHubOutput 中 (Elite 版)

@dataclass
class TimeAlignOutput:
    aligned_data: List[AlignedSample]   # 统一到 IMU 时间轴
    sync_quality: SyncQuality

@dataclass
class AlignedSample:
    timestamp_us: int                   # IMU 主时钟时间戳
    vision: Optional[Keypoint]          # 插值后的视觉数据
    imu: IMUReading                     # 原始 IMU
    emg: Optional[EMGReading]           # 插值后的 EMG

@dataclass
class SyncQuality:
    max_offset_ms: float                # 最大同步偏移
    is_valid: bool                      # < 10ms 为有效
    impact_aligned: bool                # Impact 事件是否对齐
```

**可替换性**: 简单线性插值 → 三次样条插值 → Kalman 滤波 (接口不变)

#### 2.2.2 时间同步策略 {#222-时间同步策略}

三模态融合的**基础**是精确的时间对齐:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         时间同步策略 TIME SYNCHRONIZATION                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   为什么 IMU 是主时钟 (MASTER CLOCK):                                        │
│   ─────────────────────────────────────                                     │
│   • IMU: 1666Hz = 0.6ms 分辨率 (最高)                                       │
│   • EMG: 1000Hz = 1.0ms 分辨率                                              │
│   • Vision: 30Hz = 33.3ms 分辨率 (最低)                                     │
│                                                                             │
│   对齐策略:                                                                  │
│   ─────────────────────────────────────                                     │
│   • Vision 30fps → 线性插值到 1666Hz (填补帧间空白)                          │
│   • EMG 1000Hz → 三次样条插值上采样到 1666Hz                                 │
│   • IMU 1666Hz → 主参考轴 (不变换)                                          │
│                                                                             │
│   ⚠️ 关键要求:                                                              │
│   ─────────────────────────────────────                                     │
│   • 时间同步误差 MUST < 10ms                                                │
│   • 如果 > 10ms，交叉验证失去意义                                           │
│   • 相位检测时间戳将不可靠                                                   │
│                                                                             │
│   实现方式:                                                                  │
│   ─────────────────────────────────────                                     │
│   • ESP32-S3 使用统一时钟源 (micros())                                      │
│   • BLE 传输包含发送时间戳                                                   │
│   • 手机端计算网络延迟并补偿                                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

!!! tip "🔧 调试工具: Rerun 时间轴验证"

    **问题**: 如何验证三个传感器是否真的对齐到 <10ms?

    **Rerun 解决方案**:
    ```text
    ┌─────────────────────────────────────────────────────────────┐
    │  Rerun 时间轴视图                                           │
    ├─────────────────────────────────────────────────────────────┤
    │  📷 Vision:  [帧45] ─────────────●──────── (Top 检测)       │
    │  🔄 IMU:     ─────────────────●────────── (gyro_z 零交叉)  │
    │  💪 EMG:     ───────────────●──────────── (核心激活起始)    │
    │                             ↑                               │
    │                      如果三个●不在同一垂直线 → 同步有问题    │
    └─────────────────────────────────────────────────────────────┘
    ```

    拖动时间轴到 Impact 时刻，三个传感器的事件点应该对齐。
    偏差 >10ms 说明时间同步需要调整。

    > 详见 [可视化工具评估](../decisions/visualization-tools-evaluation.md)

#### 2.2.3 时间同步实现方案 {#223-时间同步实现方案}

!!! warning "MVP 阶段说明"

    使用 **Mock 数据**时，时间同步自动完成（所有数据由同一代码生成，共享时钟）。
    本节内容适用于**真实硬件集成阶段**。

!!! warning "BLE 传输抖动"
    BLE 连接间隔抖动 ±15-30ms，时间戳必须在 ESP32 源端生成，不受传输延迟影响。

##### 推荐方案: NTP 预同步 + Impact 验证

这是行业标准方法，被大多数运动分析应用采用。代码量约 40-50 行，无需额外硬件。

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    时间同步实现: NTP + IMPACT 验证                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   STEP 1: NTP 预同步 (录制前)                                                 │
│   ────────────────────────────                                              │
│   • 手机自动从 NTP 服务器同步时间 (iOS/Android 内置)                             │
│   • ESP32 通过 BLE 从手机获取当前时间并设置内部时钟                               │
│   • 所有设备共享同一时间基准                                                    │
│   • 精度: ~1-10ms                                                            │
│                                                                             │
│   STEP 2: 传感器端时间戳 (录制中)                                               │
│   ─────────────────────────────                                             │
│   • IMU/EMG: ESP32 使用 micros() 在数据采集时立即打时间戳                        │
│   • Vision: 手机摄像头使用系统时钟 (已 NTP 同步)                                 │
│   • ⚠️ 关键: 时间戳在传感器端生成，BLE 传输延迟不影响时间戳准确性                    │
│                                                                             │
│   STEP 3: Impact 验证 (录制后)                                                │
│   ───────────────────────────                                               │
│   • IMU: 检测峰值角速度 → impact_imu (精度 ±5ms)                               │
│   • Vision: 检测球离开瞬间 → impact_vision                                    │
│   • 计算偏移: offset = impact_imu - impact_vision                            │
│   • 校正: video.timestamps += offset                                        │
│   • 若 |offset| > 20ms → 标记需检查                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

##### 为什么 EMG 不参与时间对齐

```text
肌电机械延迟 (Electromechanical Delay, EMD)
────────────────────────────────────────────

EMG 信号 ─→ 神经指令 ─→ 钙离子释放 ─→ 肌纤维收缩 ─→ 动作发生
            ↑                                        ↑
            EMG 检测                                 IMU/Vision 检测

时间差: 30-100ms

结论: EMG 是诊断数据，不是同步参考。使用 IMU 建立时间轴后，再分析 EMG。
```

##### 替代方案对比

| 方案 | 精度 | 复杂度 | 适用性 | 说明 |
|------|------|--------|--------|------|
| **NTP + Impact 验证** | <10ms | 低 (~50行代码) | ✅ MVP 推荐 | 零额外硬件，手机内置 NTP |
| 硬件 TTL 触发 | <150µs | 高 | ❌ | 需同步盒、有线连接，不便携 |
| BLE 时间戳对交换 | <1ms | 中 | ⏳ V2 | 需固件开发，精度更高 |
| Chrony | <1ms | - | ❌ 不可控 | 移动端无法选择时钟协议 |

!!! warning "注意: NTP 时钟跳变"

    NTP 校正可能导致时钟**向后跳** (例如 100ms → 95ms)。

    **解决方案**: 使用单调时钟计算相对时间:

    ```python
    # Python
    import time
    duration = time.monotonic() - start_monotonic  # 永远非负

    # ESP32
    uint32_t duration = micros() - start_micros;  // 使用差值，避免跳变影响
    ```

##### 参考实现 (硬件集成阶段)

```python
class TimeAlignmentManager:
    """时间对齐管理器 - 硬件集成阶段使用"""

    def find_imu_impact(self, gyro_z: np.ndarray, timestamps: np.ndarray) -> float:
        """从 IMU 陀螺仪数据检测击球时刻"""
        peak_idx = np.argmax(np.abs(gyro_z))
        return timestamps[peak_idx]

    def find_video_impact(self, frames: list, fps: float) -> float:
        """从视频检测击球时刻 (球离开或杆头最低点)"""
        # 简化实现: 使用运动检测找到最大变化帧
        motion_scores = [self._compute_motion(frames[i], frames[i+1])
                        for i in range(len(frames)-1)]
        impact_frame = np.argmax(motion_scores)
        return impact_frame / fps

    def validate_and_correct(self, imu_data: dict, video_data: dict) -> dict:
        """验证并校正时间对齐"""
        imu_impact = self.find_imu_impact(imu_data['gyro_z'], imu_data['timestamps'])
        video_impact = self.find_video_impact(video_data['frames'], video_data['fps'])

        offset = imu_impact - video_impact

        result = {
            'offset_ms': offset * 1000,
            'aligned': abs(offset) <= 0.020,  # <20ms 视为对齐
            'action': 'none' if abs(offset) <= 0.010 else 'corrected'
        }

        if abs(offset) > 0.010:  # >10ms 需要校正
            video_data['timestamps'] = [t + offset for t in video_data['timestamps']]

        return result
```

> **研究来源**:
>
> - [BLE 多通道生物信号同步 (PMC10144216)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10144216/) - 实现 <1ms 精度
> - [Twist-n-Sync 陀螺仪同步 (PMC7795013)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7795013/) - 16µs 精度，Google Research
> - [Golf Swing IMU 分段 (PMC7472298)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7472298/) - Impact 检测精度 ±5-16ms

#### 2.2.4 Sensor Hub 架构 (2025-12 推荐) {#224-sensor-hub-architecture}

!!! success "单一权威来源 — 所有 Sensor Hub 相关文档引用此处"

**核心原则**: 同一身体部位的 IMU + EMG 使用同一个 ESP32 作为 Sensor Hub，共享微秒级时钟，消除 BLE 抖动影响。

##### 完整 3 单元架构 (目标实现)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Sensor Hub 架构 (同一部位共享时钟)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐           │
│   │    ESP32 #1     │   │    ESP32 #2     │   │    ESP32 #3     │           │
│   │   手臂 (Arm)     │   │   核心 (Core)   │   │    腿部 (Leg)    │           │
│   │ ┌─────┬───────┐ │   │ ┌─────┬───────┐ │   │ ┌─────┬───────┐ │           │
│   │ │ IMU │  EMG  │ │   │ │ IMU │  EMG  │ │   │ │ IMU │  EMG  │ │           │
│   │ │(I2C)│ (ADC) │ │   │ │(I2C)│ (ADC) │ │   │ │(I2C)│ (ADC) │ │           │
│   │ └─────┴───────┘ │   │ └─────┴───────┘ │   │ └─────┴───────┘ │           │
│   │ esp_timer_get   │   │ esp_timer_get   │   │ esp_timer_get   │           │
│   │ _time() 微秒 ✅  │   │ _time() 微秒 ✅ │   │ _time() 微秒 ✅  │           │
│   └────────┬────────┘   └────────┬────────┘   └────────┬────────┘           │
│            │                     │                     │                    │
│            └──────────── BLE ────┴──────────── BLE ────┘                    │
│                        (±15-30ms 抖动)                                       │
│                                  ↓                                          │
│                            ┌──────────┐                                     │
│                            │  iPhone  │                                     │
│                            │  Camera  │                                     │
│                            └──────────┘                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

##### 为什么每个单元都必须有 IMU？

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│   🔑 关键洞察: Impact 振动传遍全身，每个 IMU 都能检测到!                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│        [击球瞬间 Impact]                                                     │
│              ↓                                                              │
│        ┌─────────────────────────────────────────┐                          │
│        │           振动传遍身体                    │                          │
│        │  手臂 ←──── 核心 ←──── 腿部               │                          │
│        │   ↓          ↓          ↓               │                          │
│        │  IMU#1     IMU#2      IMU#3             │                          │
│        │  检测到    检测到     检测到               │                          │
│        │  振动峰值   振动峰值   振动峰值             │                          │
│        └─────────────────────────────────────────┘                          │
│                                                                             │
│   每个 IMU 都能检测到同一个 Impact 事件 → 这就是 T=0 参考点!                      │
│                                                                             │
│   ❌ 如果某个单元只有 EMG 没有 IMU → 无法检测 Impact → 无法与其他单元对齐!          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

##### 优势

- ✅ 同一部位传感器共享 ESP32 时钟 → 微秒级同步
- ✅ 每个单元都有 IMU → 可检测 Impact 事件做跨单元同步
- ✅ 不同部位用 Impact 瞬间对齐 → 消除 BLE 抖动 (±15-30ms)
- ✅ 减少 BLE 设备数量 → 更稳定的连接

##### 同步精度

> 📐 **详细时间同步规格**: 见 [数据管道与AI §1.2](./data-pipeline-and-ai.md#sensor-hub-架构-2025-12-推荐)

| 场景 | 目标精度 | 实际可达 | 方法 |
|------|---------|---------|------|
| 同一 ESP32 (IMU+EMG) | <100 μs | <10 μs | esp_timer_get_time() |
| 跨 ESP32 (手臂↔核心) | <1 ms | 69-477 μs | Impact 事件对齐 |
| 跨设备 (ESP32↔Vision) | <10 ms | <5 ms | Impact 帧对齐 |

> **硬件购买清单**: 见 [关键决策 2025-12 §4.3](../decisions/architecture-decisions-2025-12-23.md#43-硬件购买清单)

#### 2.2.5 融合引擎: 三大机制 {#225-融合引擎}

!!! info "融合不是简单叠加，而是三种机制的协同"

##### 机制 1: 互补性 (Complementarity)

每个传感器测量其他传感器**无法测量**的内容:

```text
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│    Vision    │   │     IMU      │   │     EMG      │
├──────────────┤   ├──────────────┤   ├──────────────┤
│ X-Factor   ✅│   │ X-Factor   ❌│   │ X-Factor   ❌│
│ 身体姿态    ✅│   │ 身体姿态    ❌│    │ 身体姿态    ❌│
│ 空间位置    ✅│   │ 空间位置    ❌│    │ 空间位置    ❌│
│              │   │              │    │             │
│ 击球时刻    ❌│   │ 击球时刻    ✅│    │ 击球时刻    ❌│
│ 峰值速度    ❌│   │ 峰值速度    ✅│    │ 峰值速度    ❌│
│ 3D 旋转    ❌│    │ 3D 旋转   ✅│     │ 3D 旋转    ❌│
│             │    │             │     │             │
│ 肌肉激活    ❌│   │ 肌肉激活    ❌│    │ 肌肉激活    ✅│
│ 疲劳检测    ❌│   │ 疲劳检测    ❌│    │ 疲劳检测    ✅│
│ 力链因果    ❌│   │ 力链因果    ❌│    │ 力链因果    ✅│
└──────────────┘   └──────────────┘   └──────────────┘

→ 融合 = 完整画面，不是部分视图
```

##### 机制 2: 双重/三重验证 (Cross-Validation)

同一事件被多个传感器测量 → 捕获错误:

```text
示例: 检测 "Top of Backswing"

  Vision 说: Frame 45 (±2帧 = ±66ms)
  IMU 说:    T = 1.523s (gyro_z 零交叉, ±0.6ms)

  如果 |vision_time - imu_time| > 100ms → 标记为检测错误
  如果两者一致 → 高置信度时间戳

  ┌─────────────────────────────────────────────────────────────┐
  │  Ground Truth = IMU (更精确)                                │
  │  Vision = 完整性检查 (身体是否"看起来"像 Top?)               │
  │  EMG = 因果检查 (肌肉是否正确激活?)                         │
  └─────────────────────────────────────────────────────────────┘
```

!!! tip "🔧 调试工具: 可视化交叉验证"

    **问题**: 如何确认 Vision 和 IMU 的阶段检测是否一致?

    **Rerun 解决方案**:

    | 通道 | 显示内容 | 验证点 |
    |-----|---------|-------|
    | 视频通道 | 骨架叠加 + 阶段标签 | 身体"看起来"像 Top 吗? |
    | IMU 曲线 | gyro_z 波形 + 零交叉标记 | 角速度是否过零? |
    | 置信度曲线 | 融合置信度 0-1 | 不一致时置信度会下降 |

    当 Vision 说 "Top" 但 IMU 还在运动 → 置信度曲线会下降 → 一眼看出问题

##### 机制 3: 异常检测 (Anomaly Detection)

传感器间的**矛盾**揭示隐藏问题:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         异常检测场景 ANOMALY SCENARIOS                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   场景 1: 假性蓄力 (FALSE COIL) — 竞品无法检测!                              │
│   ─────────────────────────────────────────────────────                     │
│   IF: Vision 显示正常 X-Factor (45°)                                        │
│   BUT: EMG 显示核心激活 < 50%                                               │
│   THEN: "假性蓄力" — 看起来对但肌肉没参与                                   │
│   → 用户反馈: "转肩看起来够了，但核心没发力。专注于收紧腹肌。"               │
│                                                                             │
│   场景 2: 代偿动作 (COMPENSATION)                                           │
│   ─────────────────────────────────────────────────────                     │
│   IF: IMU 显示快速旋转 (高角速度)                                           │
│   BUT: EMG 显示核心未激活，前臂先于核心激活                                  │
│   THEN: "代偿" — 速度来自错误的力量源                                       │
│   → 用户反馈: "速度来自手臂，缺乏核心力量。让身体带动，别用手打。"           │
│                                                                             │
│   场景 3: 传感器故障                                                        │
│   ─────────────────────────────────────────────────────                     │
│   IF: Vision 显示大幅运动                                                   │
│   BUT: IMU 显示静止                                                         │
│   THEN: 传感器可能脱落或故障                                                │
│   → 系统反馈: "请检查 IMU 传感器是否正确佩戴"                               │
│                                                                             │
│   ⚡ 关键洞察:                                                              │
│   没有融合，你会认为挥杆基于单一指标是"好的"                                 │
│   有了融合，你能捕获隐藏问题                                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 特征提取层 {#23-特征提取层}

Stage 4 从原始传感器数据中提取结构化特征。每个 Block 负责一种数据源。

#### 2.3.1 积木块接口契约 {#231-积木块接口契约}

每个积木块有明确的输入/输出契约，确保可替换性:

##### POSE Block 接口

```python
# Input
@dataclass
class VideoFrame:
    rgb: np.ndarray           # [H, W, 3] RGB 图像
    timestamp_ms: int         # 帧时间戳

# Output
@dataclass
class PoseResult:
    keypoints: List[Keypoint] # 33 个关键点
    timestamp_ms: int
    features: PoseFeatures

@dataclass
class PoseFeatures:
    x_factor: float           # 肩髋分离角 (度)
    x_factor_stretch: float   # X-Factor 延展
    s_factor: float           # 肩部倾斜角 (度)
    o_factor: float           # 骨盆倾斜角 (度)
    sway: float               # 髋部侧移 (归一化)
    lift: float               # 髋部抬升 (归一化)
```

##### IMU Block 接口

```python
# Input
@dataclass
class RawIMU:
    gyro: Vector3             # [x,y,z] °/s
    accel: Vector3            # [x,y,z] g
    timestamp_us: int         # 微秒时间戳

# Output
@dataclass
class IMUFeatures:
    phase: str                # 当前阶段 (Address/Top/Impact/...)
    phase_confidence: float   # 阶段置信度 [0-1]
    peak_velocity: float      # 峰值角速度 (°/s)
    tempo_ratio: float        # 上杆/下杆时间比
    backswing_duration_ms: int  # 上杆时长
    downswing_duration_ms: int  # 下杆时长
    timestamp_ms: int
```

##### EMG Block 接口

```python
# Input
@dataclass
class RawEMG:
    core_mv: List[float]      # 核心肌群原始信号 (mV)
    forearm_mv: List[float]   # 前臂原始信号 (mV)
    timestamp_ms: int

# Output
@dataclass
class EMGFeatures:
    onset_times: OnsetTimes   # 激活起始时间
    activation_pct: ActivationPct  # 激活百分比 [0-1]
    timing_gap_ms: int        # forearm_onset - core_onset
    fatigue_ratio: float      # 当前/初始激活强度比
    timestamp_ms: int

@dataclass
class OnsetTimes:
    core_ms: int
    forearm_ms: int

@dataclass
class ActivationPct:
    core: float               # [0-1]
    forearm: float            # [0-1]
```

##### CLASSIFIER Block 接口

```python
# Input
@dataclass
class ClassifierInput:
    pose_sequence: List[PoseResult]  # N 帧姿态序列
    imu_features: Optional[IMUFeatures]  # 可选 IMU 辅助

# Output
@dataclass
class ClassifierResult:
    phases: List[PhaseLabel]  # N × {label, confidence}
    phase_boundaries: List[PhaseBoundary]

@dataclass
class PhaseLabel:
    label: int                # 0-7 阶段编号
    confidence: float         # [0-1]

@dataclass
class PhaseBoundary:
    phase: int                # 阶段编号
    start_ms: int
    end_ms: int
```

##### FUSION Block 接口

```python
# Input
@dataclass
class FusionInput:
    pose: List[PoseResult]
    imu: IMUFeatures
    emg: EMGFeatures
    classifier: ClassifierResult

# Output
@dataclass
class FusionResult:
    phases: List[FusedPhase]  # 融合后的阶段
    metrics: SwingMetrics     # 12 个结构化指标
    anomalies: List[Anomaly]  # 异常检测结果
    overall_confidence: float # 整体置信度
    triggered_rules: List[DiagnosticRule]  # 触发的诊断规则

@dataclass
class FusedPhase:
    label: str                # "Address" / "Top" / "Impact" / ...
    start_ms: int
    end_ms: int
    confidence: float

@dataclass
class SwingMetrics:
    # Vision (6)
    x_factor: float
    x_factor_stretch: float
    shoulder_turn: float
    hip_turn: float
    s_factor: float
    sway_lift: float
    # IMU (4)
    peak_velocity: float
    tempo_ratio: float
    backswing_duration: float
    downswing_duration: float
    # EMG (2)
    core_activation: float
    core_forearm_gap: float

@dataclass
class Anomaly:
    type: str                 # "FALSE_COIL" / "COMPENSATION" / ...
    severity: str             # "P0" / "P1" / "P2"
    description: str

@dataclass
class DiagnosticRule:
    rule_id: str              # "ARMS_BEFORE_CORE" / "LOW_X_FACTOR" / ...
    priority: str             # "P0" / "P1" / "P2"
    message_cn: str
    message_en: str
```

#### 2.3.2 POSE Block 实现 {#232-pose-block}

**职责**: 从视频帧提取人体 33 个关键点坐标

**MVP 选择**: MediaPipe BlazePose

| 属性 | 值 |
|-----|-----|
| 精度 | AP 65% |
| 速度 | 30 FPS |
| 训练数据 | 0 (预训练) |
| 平台 | iOS / Android 原生支持 |

**选择理由**:

- 开箱即用，MediaPipeTasksVision iOS SDK 官方支持
- 33 关键点足够计算 X-Factor、肩转、髋转
- 不需要任何训练数据

!!! tip "🔧 调试工具: MediaPipe 骨架可视化"

    Rerun 官方提供 [human_pose_tracking](https://rerun.io/examples/video-image/human_pose_tracking) 示例:

    ```bash
    pip install rerun-sdk
    python -m rerun_demos.human_pose_tracking
    ```

    可验证:

    - 33 关键点是否完整检测
    - 关键点 visibility 是否足够 (遮挡问题)
    - X-Factor 等特征计算是否正确 (叠加角度线)

!!! note "备选方案"

    | 方案 | 精度 | 速度 | 何时考虑 |
    |-----|------|------|---------|
    | RTMPose | AP 75.8% | 25 FPS | 需要更高精度 |
    | ViTPose++ | AP 81% | 15 FPS | 精度优先，速度可接受 |
    | Custom Model | 待定 | 待定 | 积累大量高尔夫数据后 |

##### 可计算的特征

| 特征 | 计算方法 | 关键点 | 用途 |
|-----|---------|--------|------|
| **X-Factor** | 肩部连线角 - 骨盆连线角 | 11,12,23,24 | 蓄力评估 |
| **X-Factor Stretch** | 下杆期最大 X-Factor - Top 时 X-Factor | 同上 | 蓄力质量 |
| **S-Factor** | 肩部倾斜角 | 11,12 | 姿态评估 |
| **O-Factor** | 骨盆倾斜角 | 23,24 | 下盘稳定 |
| **Sway/Lift** | 髋部中心位移 vs Address | 23,24 | 重心控制 |

!!! tip "详细算法实现"
    计算代码见 [传感器指标映射 §3.1](./sensor-data-processing.md#31-vision-数据处理-mediapipe-33-landmarks)

#### 2.3.3 IMU Block 实现 {#233-imu-block}

**职责**: 从惯性测量单元提取角速度、加速度等时序特征

**MVP 选择**: 模拟数据 (Simulated JSON)

| 属性 | 值 |
|-----|-----|
| 数据源 | JSON 文件 (基于研究论文) 或从 Pose 数据生成 |
| 采样率 | 100Hz (模拟) / 1666Hz (真实) |
| 用途 | 开发调试，验证完整管道，无需等待硬件 |

**模拟数据设计**:

- 峰值角速度: 800-1500°/s (职业范围)
- 节奏比: 2.5-3.5:1 (理想范围)
- 噪声模型: 高斯噪声 + 漂移模拟

!!! tip "🔧 调试工具: IMU 曲线与阶段对齐"

    **问题**: 模拟 IMU 数据的峰值/零交叉点是否正确?

    **Rerun 解决方案**:

    ```text
    gyro_z (°/s)
         │
    1200 ┤                    ●─── Impact 峰值
         │                   ╱│
     600 ┤                  ╱ │
         │                 ╱  │
       0 ┤────────────●───╱───┴──── Top (零交叉)
         │   Address   ╲ ╱
    -600 ┤              V
         └────────────────────────────→ time
    ```

    Rerun 曲线视图可以自动检测峰值和零交叉，与视频帧同步验证

##### 模拟 IMU 数据生成

**原理**: 用 MediaPipe 关键点序列**导数**近似 IMU 角速度

| 函数 | 输入 | 输出 |
|-----|------|------|
| `simulate_imu_from_pose()` | MediaPipe 33 关键点序列 | `List[SimulatedIMUFrame]` |

**数据结构**:

```python
@dataclass
class SimulatedIMUFrame:
    timestamp_ms: int        # 时间戳
    gyro_z: float            # 主轴角速度 (°/s)
    gyro_magnitude: float    # 合成角速度
    accel_magnitude: float   # 合成加速度
    phase_hint: str          # 预期阶段 (TOP/IMPACT/...)
```

!!! tip "完整算法实现"
    详细代码和测试场景见 [数据处理与指标计算 §5.1](./sensor-data-processing.md#51-从-pose-数据生成模拟-imu)

!!! note "真实硬件选项 (Phase 2+)"

    **推荐硬件**: Adafruit LSM6DSV16X (ADA-5783) — 45+ 分钟漂移稳定性

    | 方案 | 精度 | 硬件 | 何时引入 |
    |-----|------|------|---------|
    | Single Wrist IMU | ±9-15ms | LSM6DSV16X | 硬件原型完成 |
    | Dual IMU | ±5ms | Wrist + Pelvis | 运动链分析 |
    | Multi-point (4+) | ±2ms | 完整穿戴 | 完整运动链 |

    ⚠️ **WitMotion WT901 警告**: 必须禁用其 BLE，通过 I2C 连接 ESP32 使用

##### 真实 IMU 检测能力

| 特征 | 描述 | 阈值参考 | 用途 |
|-----|------|---------|------|
| **Peak Angular Velocity** | 杆头最大角速度 | Pro: 800-1500°/s | 爆发力评估 |
| **Kinematic Sequence** | 运动链时序 | Pelvis→Torso→Arm→Club | 动力传递验证 |
| **Tempo Ratio** | 上杆/下杆时间比 | 理想: 2.5-3.5:1 | 节奏评估 |
| **Transition Timing** | 转换点精度 | ±0.6ms 可检测 | 力量爆发点 |

!!! tip "详细算法实现"
    峰值检测、运动链验证代码见 [传感器指标映射 §3.2](./sensor-data-processing.md#32-imu-数据处理-lsm6dsv16x--1666hz)

#### 2.3.4 EMG Block 实现 {#234-emg-block}

**职责**: 从肌电传感器提取肌肉激活时序和强度

**MVP 选择**: 模拟数据 (Simulated JSON)

| 属性 | 值 |
|-----|-----|
| 数据源 | JSON 文件 (基于研究论文) 或根据阶段时间戳生成 |
| 通道数 | 2 (Core + Forearm) |
| 采样率 | 500Hz (模拟) / 1000Hz (真实) |

**模拟数据设计**:

- 正确模式: Core 先于 Forearm 激活 (>20ms)
- 错误模式: Forearm 先于 Core (模拟"手臂先动"问题)
- 包络处理: RMS 平滑后归一化到 0-100%

!!! tip "🔧 调试工具: EMG 激活时序可视化"

    **问题**: 如何验证 Core 真的比 Forearm 先激活?

    **Rerun 解决方案**:

    ```text
    EMG 包络 (归一化)
      1.0│      Core (红)     Forearm (蓝)
         │        ┌──╮           ┌──╮
      0.5│       ╱    ╲         ╱    ╲
         │      ╱      ╲       ╱      ╲
      0.0├─────●────────╲─────●────────╲────→ time
              ↑ Core     ╲    ↑ Forearm
              onset       ╲   onset
              (570ms)      ╲  (720ms)
                            ╲
                         gap = 150ms ✓
    ```

    两条 EMG 曲线叠加显示，onset 标记一目了然

##### 模拟 EMG 数据生成

**原理**: 根据已知生物力学时序生成**符合真实模式**的 EMG 信号

| 模式 | 描述 | 时序特征 |
|------|------|---------|
| `CORRECT` | 正确运动链 | Core 先于 Forearm >20ms |
| `ARMS_FIRST` | 错误 — 手臂先动 | Forearm 先于 Core |
| `FALSE_COIL` | 假性蓄力 | 时序正确，Core <50% |
| `FATIGUED` | 疲劳模式 | 整体激活衰减 |

**核心函数**: `simulate_emg_from_phases(phase_timestamps, pattern) → SimulatedEMGResult`

!!! warning "False Coil 是竞争护城河"
    假性蓄力 (False Coil) 是**只有三模态融合才能检测**的问题:

    - Vision 看到: X-Factor = 45° ✅ (正常)
    - IMU 看到: 正常旋转时序 ✅
    - EMG 看到: Core activation = 30% ❌ (过低)

    结论: 球员"装"出了正确的姿势，但核心肌群没有真正参与。
    这是 Vision-only 竞品永远无法检测的问题。

!!! tip "完整算法实现"
    详细代码和测试场景见 [数据处理与指标计算 §5.2](./sensor-data-processing.md#52-从阶段时间戳生成模拟-emg)

!!! note "真实硬件选项 (Phase 2+)"

    🔴 **CRITICAL**: MyoWare 2.0 没有焊孔，只有 Snap 扣。Link Shield (DEV-18425) 是**必需品**！

    **推荐套装** (每个身体部位):
    - 1x MyoWare 2.0 Muscle Sensor (~$40)
    - 1x MyoWare 2.0 Link Shield ($4.50) ← 必需！

    ⚠️ **警告**: DFRobot SEN0240 有线缆噪声问题，仅适用静态测量，不适合高速挥杆。

    | 方案 | 通道 | 肌肉群 | 何时引入 |
    |-----|------|-------|---------|
    | 2-channel | 2 | Core + Forearm | 硬件原型 |
    | 4-channel | 4 | + Gluteus, Adductors | 下肢分析 |
    | 6-channel | 6 | + Lats, Deltoids | 完整上身 |

##### EMG 电极布局规划

MVP 阶段使用 2 通道 (Core + Forearm)，后续渐进扩展：

| 阶段 | 通道 | 肌群覆盖 | 可检测能力 |
|-----|------|---------|-----------|
| **Phase 1** | 2 | 腹直肌 + 前臂屈肌 | False Coil, 核心激活时序 |
| **Phase 2** | 4 | + 臀大肌, 内收肌 | 下肢驱动, 髋部稳定 |
| **Phase 3** | 6 | + 背阔肌, 三角肌 | 完整力链验证 |

!!! tip "详细布局图"
    电极放置位置、选择依据见 [数据处理与指标计算 §3.3.3](./sensor-data-processing.md#333-emg-传感器布局规划)

##### 真实 EMG 检测能力

| 特征 | 描述 | 信号处理 | 用途 |
|-----|------|---------|------|
| **Muscle Onset** | 肌肉激活起始时间 | 阈值检测 (10% MVC) | 运动链时序 |
| **Peak Activation** | 最大肌电幅值 | RMS 包络 | 力量输出评估 |
| **Fatigue Detection** | 肌肉疲劳指标 | 频谱中值下降 | 训练负荷监控 |
| **Co-activation** | 拮抗肌同时激活 | 双通道比较 | 动作效率分析 |

!!! tip "详细算法实现"
    信号处理、特征提取代码见 [传感器指标映射 §3.3](./sensor-data-processing.md#33-emg-数据处理-unique-capability)

### 2.4 分析诊断层 {#24-分析诊断层}

对提取的特征进行智能分析，识别挥杆阶段并融合多模态数据。

#### 2.4.1 CLASSIFIER Block {#241-classifier-block}

**职责**: 根据关键点序列识别挥杆的 8 个阶段

**MVP 选择**: Simple Rules (基于 IMU 信号)

| 属性 | 值 |
|-----|-----|
| 方法 | IMU gyro_z 信号分析 |
| Top 检测 | gyro_z 零交叉点 (方向反转) |
| Impact 检测 | gyro_z 峰值点 (最大角速度) |
| 训练数据 | 0 (纯规则) |
| 精度 | ±0.6ms (IMU 原生精度) |

**选择理由**:

- **无需训练数据** — 纯物理信号分析
- **更高精度** — IMU 1666Hz vs Vision 30Hz
- **可解释性强** — 零交叉和峰值点有明确物理意义
- **调试简单** — Rerun 中一眼可见峰值和零交叉

```text
Phase 检测原理 (Simple Rules):
───────────────────────────────
gyro_z (°/s)
     │
1200 ┤                    ●─── Impact (峰值点)
     │                   ╱│
 600 ┤                  ╱ │
     │                 ╱  │
   0 ┤────────────●───╱───┴──── Top (零交叉点)
     │   Address   ╲ ╱
-600 ┤              V
     └────────────────────────────→ time

Top = gyro_z 从负→正 零交叉 (上杆结束，下杆开始)
Impact = gyro_z 正向峰值 (最大旋转速度)
```

!!! note "备选方案 (Phase 2+)"

    | 方案 | 准确率 | 训练数据 | 速度 | 何时考虑 |
    |-----|-------|---------|------|---------|
    | **SwingNet** | 71.5% | 0 (预训练) | 5ms | 需要完整 8 阶段划分时 |
    | Random Forest | ~65% | ~500 videos | <1ms | 快速 baseline |
    | BiGRU | ~80% | ~1000 videos | 3ms | 积累 1000 视频后 |
    | Transformer | ~88% | ~10000+ | 10ms | 大量数据后 |

    **研究发现 (CaddieSet CVPR 2025)**: 关节特征 + 时序模型 (MSE 8.80) 优于纯视觉 Transformer (MSE 32.32)

#### 2.4.2 FUSION Block {#242-fusion-block}

**职责**: 融合 Vision + IMU + EMG 三模态数据，交叉验证并检测异常

**MVP 选择**: Simple Merge

| 属性 | 值 |
|-----|-----|
| 方法 | 简单合并各传感器特征 |
| 复杂度 | 低 |
| 用途 | 快速验证管道 |

**融合三原则**:

1. **互补性** — Vision (空间姿态) + IMU (精确时序) + EMG (肌肉状态)
2. **交叉验证** — Vision "Top" + IMU zero-crossing → 确认; 不一致 → 降低置信度
3. **异常检测** — 传感器间矛盾 → 标记异常 (穿戴问题/传感器故障)

##### 核心诊断算法

FUSION Block 的核心价值在于**诊断算法** — 这些算法只有三模态融合才能实现。

> **实现代码**: 见 [数据处理与指标计算 §4.5 融合诊断算法](./sensor-data-processing.md#45-融合诊断算法-fusion-diagnostic-algorithms)

| 算法 | 函数名 | 检测内容 | 所需传感器 |
|-----|-------|---------|-----------|
| 运动链序列验证 | `validate_kinematic_sequence()` | Core 是否先于 Forearm 激活 | EMG |
| 假蓄力检测 | `detect_false_coil()` | X-Factor 高但核心肌群未激活 | Vision + EMG |
| 力量链验证 | `verify_force_chain()` | 三模态数据一致性验证 | Vision + IMU + EMG |
| 诊断入口 | `run_fusion_diagnostics()` | 整合所有诊断，返回主要反馈 | All |

!!! tip "🔧 调试工具: 诊断规则验证"

    **问题**: 规则是否在正确的条件下触发?

    **Rerun 调试流程**:

    1. 录制一个 "ARMS_BEFORE_CORE" 问题挥杆
    2. 在 Rerun 中标记:
        - EMG Core onset: 640ms
        - EMG Forearm onset: 580ms
        - 规则触发时刻: 720ms
    3. 验证: `timing_gap = 580 - 640 = -60ms < 0` → 规则应该触发 ✓
    4. 如果规则没触发 → 检查阈值设置

    保存 `.rrd` 文件作为回归测试用例

**诊断严重度分级**:

| 级别 | 含义 | 示例 |
|-----|-----|------|
| P0_CRITICAL | 必须修正，影响挥杆效果 | `ARMS_BEFORE_CORE`, `FALSE_COIL` |
| P1_IMPORTANT | 建议修正，影响一致性 | `LOW_X_FACTOR`, `WEAK_CORE_LEAD` |
| P2_MINOR | 可选优化 | `PHASE_MISMATCH` |
| INFO | 仅供参考 | 正确序列确认 |

##### 诊断规则速查表

| 规则 ID | 严重度 | 触发条件 | 需要的传感器 |
|--------|--------|---------|-------------|
| `ARMS_BEFORE_CORE` | P0 | Forearm 先于 Core 激活 | EMG |
| `FALSE_COIL` | P0 | X-Factor ≥35° 但 Core <50% | Vision + EMG |
| `COMPENSATION_DETECTED` | P0 | 峰值速度高但 Core 激活低 | IMU + EMG |
| `LOW_X_FACTOR` | P1 | X-Factor <35° | Vision |
| `WEAK_CORE_LEAD` | P1 | Core 领先 Forearm <20ms | EMG |
| `PHASE_MISMATCH` | P2 | Vision 和 IMU 阶段不一致 | Vision + IMU |

!!! success "三模态独有能力"
    以上规则中，**P0 级别的三个规则都需要 EMG 数据**。
    这意味着:

    - Vision-only 竞品只能检测 `LOW_X_FACTOR` (P1)
    - Vision+IMU 竞品可以检测 `PHASE_MISMATCH` (P2)
    - **只有 Vision+IMU+EMG 能检测全部 P0 问题**

!!! note "备选融合方法"

    | 方案 | 复杂度 | 何时考虑 |
    |-----|-------|---------|
    | Rule-based | 中 | 明确传感器优先级后 |
    | Weighted Average | 中 | 已知各传感器可靠性 |
    | Kalman Filter | 高 | 需要实时平滑 |
    | ML Fusion | 高 | 有足够融合训练数据 |

#### 2.4.3 置信度计算逻辑 {#243-置信度计算逻辑}

融合提升置信度的核心算法:

| 验证条件 | 置信度变化 | 结果示例 |
|---------|-----------|---------|
| **基准** | 0.5 | 单传感器 |
| Vision-IMU 阶段一致 | +0.25 | 双重验证 |
| Vision-IMU 阶段不一致 | -0.15 | 需人工检查 |
| EMG 序列正确 | +0.25 | 三重验证 |
| EMG 无数据 | +0.0 | 保持 |
| EMG 序列异常 | -0.10 | 标记问题 |

**置信度示例**:

- Vision=Top, IMU=Top, EMG=Correct → **1.0** (最高)
- Vision=Top, IMU=Top, EMG=None → **0.75**
- Vision=Top, IMU=Mid, EMG=None → **0.35** (需检查)

!!! tip "算法实现"
    完整 Python 代码见 [数据处理与指标计算 §4.4](./sensor-data-processing.md#44-融合置信度计算-fusion-confidence)

### 2.5 AI 反馈生成层 (Stage 6) {#25-ai-反馈生成层}

将传感器数据结构化为 LLM 可理解格式，生成教练级自然语言反馈。

#### 2.5.1 PROMPT Block {#251-prompt-block}

**职责**: 将诊断结果转换为 Kinematic Prompts (结构化提示词)

| 属性 | 值 |
|-----|-----|
| 输入 | 触发的规则 + 12 指标 + 置信度 |
| 输出 | 结构化 JSON/Text Prompt |
| 延迟 | <1ms (模板填充) |

**接口契约**:

```python
@dataclass
class PromptInput:
    triggered_rules: List[DiagnosticRule]  # 触发的规则列表
    metrics: Dict[str, float]               # 12 个结构化指标
    confidence: float                       # 融合置信度

@dataclass
class PromptOutput:
    kinematic_prompt: str     # 结构化提示词
    severity: str             # P0/P1/P2/INFO
    focus_metric: str         # 主要关注指标
```

**Kinematic Prompt 示例**:

```text
X-Factor: 42° ✅ (正常范围 35-55°)
Core activation: 30% ⚠️ (低于 50% 阈值)
Timing: 核心先于前臂 150ms ✅
Triggered rule: FALSE_COIL (P0)
```

#### 2.5.2 LLM Block {#252-llm-block}

**职责**: 将 Kinematic Prompts 翻译为教练级自然语言反馈

| 属性 | 值 |
|-----|-----|
| 输入 | Kinematic Prompt |
| 处理 | GPT-4o-mini / Gemini 2.5 Flash |
| 输出 | 自然语言反馈 (中/英文) |
| 延迟 | 200-500ms (Cloud API) |

**接口契约**:

```python
@dataclass
class LLMInput:
    kinematic_prompt: str     # 结构化提示词
    language: str             # "zh" / "en"
    user_level: str           # "beginner" / "intermediate" / "advanced"

@dataclass
class LLMOutput:
    feedback_text: str        # 自然语言反馈
    action_items: List[str]   # 可执行建议列表
    tone: str                 # "encouraging" / "instructive" / "warning"
```

**翻译示例**:

| 输入 | 输出 |
|------|------|
| `FALSE_COIL (P0)` + `X-Factor=42°` + `Core=30%` | "看起来转够了 (42°)，但核心没发力 (30%)。在下杆前收紧腹肌，让身体带动手臂。" |

### 2.6 用户反馈呈现层 {#26-用户反馈呈现层}

将 LLM 生成的反馈通过多种渠道呈现给用户，挥杆后 <500ms 内完成。

#### 2.6.1 OUTPUT Block {#261-output-block}

**职责**: 多渠道反馈呈现 (UI/TTS/触觉/Ghost)

| 渠道 | 组件 | 特点 |
|------|------|------|
| 📱 **App UI** | SwiftUI | 简洁指标 (1-3 个)，颜色编码 🟢🟡🔴 |
| 🔊 **语音 TTS** | AVSpeechSynthesizer | 教练语音，离线可用 |
| 📳 **触觉反馈** | UIFeedbackGenerator | 振动提示，方向指引 |
| 👻 **Ghost Overlay** | ARKit (Phase 2+) | 骨架叠加，动作对比 |

**接口契约**:

```python
# Input
@dataclass
class OutputInput:
    feedback_text: str        # LLM 生成的反馈
    action_items: List[str]   # 可执行建议列表
    severity: str             # P0/P1/P2/INFO
    metrics_summary: Dict     # 关键指标摘要 (最多 3 个)

@dataclass
class OutputConfig:
    enable_tts: bool = True
    enable_haptic: bool = True
    enable_ghost: bool = False  # Phase 2+
    max_metrics_display: int = 3
    language: str = "zh"      # "zh" / "en"

# Output: 用户感知的反馈 (终端呈现，无下游 Block)
@dataclass
class OutputResult:
    """反馈呈现结果，用于日志和分析"""
    tts_played: bool          # TTS 是否播放成功
    tts_duration_ms: int      # TTS 播放时长
    haptic_triggered: bool    # 触觉反馈是否触发
    ui_rendered: bool         # UI 是否渲染成功
    total_latency_ms: int     # 从挥杆结束到反馈呈现的总延迟
    user_dismissed: bool      # 用户是否主动关闭反馈
```

**反馈示例映射**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         反馈呈现示例                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   示例 1: 运动链倒序                                                        │
│   ─────────────────────────────────────────────────────                     │
│   数据: emg_core_forearm_gap = -40ms                                        │
│   规则: ARMS_BEFORE_CORE (P0 严重)                                          │
│   CN: "让身体带动，别用手打"                                                │
│   EN: "Let your body lead, don't swing with your arms"                     │
│                                                                             │
│   示例 2: X-Factor 不足                                                     │
│   ─────────────────────────────────────────────────────                     │
│   数据: x_factor = 22° (低于 35° 阈值)                                      │
│   规则: LOW_X_FACTOR (P1 重要)                                              │
│   CN: "肩膀多转一点，你的背还没拧紧"                                        │
│   EN: "Turn your shoulders more - you haven't coiled your back yet"        │
│                                                                             │
│   示例 3: 假性蓄力 (只有三模态能检测!)                                       │
│   ─────────────────────────────────────────────────────                     │
│   数据: x_factor = 45° (正常) + emg_core_activation = 0.3 (低于 0.5)        │
│   规则: FALSE_COIL (P0 严重)                                                │
│   CN: "看起来转够了，但核心没发力。专注于收紧腹肌再下杆。"                   │
│   EN: "Your turn looks good but your core isn't engaged. Focus on          │
│        tightening your abs before starting the downswing."                 │
│                                                                             │
│   示例 4: 疲劳预警                                                          │
│   ─────────────────────────────────────────────────────                     │
│   数据: emg_fatigue_ratio = 0.65 (低于 0.7 阈值)                            │
│   规则: FATIGUE_WARNING (P1 重要)                                           │
│   CN: "你累了，休息一下再练，避免受伤"                                      │
│   EN: "You're fatigued. Take a break to prevent injury."                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**用户体验保证**:

| 指标 | 要求 |
|------|------|
| 挥杆结束 → 反馈呈现 | <500ms (用户无感知延迟) |
| 语音反馈 | 1-2 句话，可执行 ("收紧腹肌" vs 抽象建议) |
| 视觉反馈 | 最多 3 个指标，避免信息过载 |
| 趋势追踪 | 连续多次挥杆的改进/退步趋势 |

!!! tip "🔧 调试工具: 验证反馈时机"

    **问题**: 反馈是否在正确的时刻触发?

    **Rerun 调试流程**:

    1. 录制一次挥杆到 `.rrd` 文件
    2. 在时间轴上标记:
        - 规则触发时刻 (如 `ARMS_BEFORE_CORE` 在 T=720ms 触发)
        - 对应的 EMG 激活时刻 (Core=640ms, Forearm=580ms)
    3. 验证规则逻辑是否正确
    4. 反复回放同一录制，调优阈值直到反馈时机合理

---

## 3. 积木替换示例 {#3-积木替换示例}

> **核心理念**: 模块化架构的价值在于 — 升级某个模块时，其他模块完全不受影响。
>
> 就像换乐高积木一样：只要接口形状相同，内部用什么颜色/材质都可以。

### 3.1 替换场景示例

| 替换场景 | MVP (现在) | 升级版 (未来) | 要改的 | 不用改的 |
|---------|-----------|--------------|-------|---------|
| **分类器升级** | SwingNet (规则) | BiGRU (深度学习) | 1个模型文件 | 所有其他代码 |
| **IMU 真实化** | JSON 模拟数据 | 真实硬件传感器 | 数据源 | 特征提取逻辑 |
| **融合算法** | 简单合并 | Kalman Filter | 融合模块 | 上下游模块 |

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         积木替换原理 BLOCK REPLACEMENT                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   替换前:                              替换后:                               │
│   ─────────                            ─────────                            │
│                                                                             │
│   ┌─────────┐   ┌─────────┐           ┌─────────┐   ┌─────────┐            │
│   │ Block A │ → │ Block B │           │ Block A │ → │ Block B'│            │
│   └─────────┘   └─────────┘           └─────────┘   └─────────┘            │
│        │             │                     │             │                  │
│        │    旧实现    │                     │    新实现    │                  │
│        │             │                     │             │                  │
│        └──────┬──────┘                     └──────┬──────┘                  │
│               │                                   │                         │
│               ▼                                   ▼                         │
│   ┌─────────────────────┐             ┌─────────────────────┐              │
│   │      Block C        │      =      │      Block C        │              │
│   │     (不变)          │             │     (完全不改)       │              │
│   └─────────────────────┘             └─────────────────────┘              │
│                                                                             │
│   💡 关键: 只要 Block B 和 Block B' 的输出接口相同，Block C 无需任何修改        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 3.2 示例 1: 分类器升级 (CLASSIFIER Block)

**场景**: 从简单规则升级到深度学习模型

```text
MVP 阶段:
┌──────────┐    ┌───────────────┐    ┌──────────┐
│ MediaPipe│ →  │   SwingNet    │ →  │ 8 Phases │
│ 33点骨架  │    │   (规则匹配)   │    │  输出    │
└──────────┘    └───────────────┘    └──────────┘

升级后:
┌──────────┐    ┌───────────────┐    ┌──────────┐
│ MediaPipe│ →  │    BiGRU      │ →  │ 8 Phases │
│ 33点骨架  │    │   (深度学习)   │    │  输出    │
└──────────┘    └───────────────┘    └──────────┘
                      ↑
                   只换这个
```

| 步骤 | 操作 | 工作量 |
|:---:|------|:------:|
| 1 | 收集 ~1000 个标注视频 | 数据准备 |
| 2 | 训练 BiGRU 模型 | ~4小时 |
| 3 | 导出 ONNX 格式 | 1行命令 |
| 4 | 替换 `classifier.onnx` 文件 | 换文件 |
| ✅ | **其他代码零修改** | 0 |

---

### 3.3 示例 2: IMU 真实化 (SENSOR_HUB Block)

**场景**: 从模拟数据切换到真实硬件

```text
MVP 阶段 (模拟):
┌──────────────┐    ┌───────────────┐    ┌──────────┐
│  mock.json   │ →  │  IMU Block    │ →  │ 4 指标   │
│  (模拟数据)   │    │  (特征提取)    │    │  输出    │
└──────────────┘    └───────────────┘    └──────────┘

升级后 (真实):
┌──────────────┐    ┌───────────────┐    ┌──────────┐
│  LSM6DSV16X  │ →  │  IMU Block    │ →  │ 4 指标   │
│  (BLE 传输)   │    │  (特征提取)    │    │  输出    │
└──────────────┘    └───────────────┘    └──────────┘
       ↑                   ↑
    换数据源           逻辑不变
```

| 步骤 | 操作 | 工作量 |
|:---:|------|:------:|
| 1 | 完成硬件原型 (ESP32-S3 + IMU) | 硬件 |
| 2 | 实现 BLE 数据传输 | 通信 |
| 3 | 替换数据源 (JSON → BLE Stream) | 适配器 |
| ✅ | **特征提取逻辑零修改** | 0 |

---

### 3.4 示例 3: 融合算法升级 (FUSION Block)

**场景**: 从简单合并升级到 Kalman Filter

```text
MVP 阶段:
┌─────────┐
│ Vision  │ ──┐
├─────────┤   │    ┌───────────────┐    ┌──────────┐
│  IMU    │ ──┼──→ │ Simple Merge  │ →  │ 融合结果  │
├─────────┤   │    │  (简单合并)    │    │         │
│  EMG    │ ──┘    └───────────────┘    └──────────┘
└─────────┘

升级后:
┌─────────┐
│ Vision  │ ──┐
├─────────┤   │    ┌───────────────┐    ┌──────────┐
│  IMU    │ ──┼──→ │ Kalman Filter │ →  │ 融合结果  │
├─────────┤   │    │  (最优估计)    │    │         │
│  EMG    │ ──┘    └───────────────┘    └──────────┘
└─────────┘              ↑
                      只换这个
```

| 步骤 | 操作 | 工作量 |
|:---:|------|:------:|
| 1 | 确认传感器数据质量 | 分析 |
| 2 | 标定传感器噪声模型 | 测量 |
| 3 | 实现 Kalman Filter | 算法 |
| 4 | 调整融合权重 | 调参 |
| ✅ | **上下游模块零修改** | 0 |

---

### 3.5 为什么能做到"零修改"？

!!! success "接口契约是关键"

    只要保证**输入输出接口不变**，内部实现可以任意替换：

    ```python
    # CLASSIFIER Block 接口契约 (不变)
    class ClassifierInput:
        keypoints: List[Keypoint]   # 输入: 33个关键点

    class ClassifierResult:
        phases: List[SwingPhase]    # 输出: 8个阶段
        confidence: float
    ```

    无论内部是规则匹配还是深度学习，只要遵守这个契约，调用方无需感知变化。

---

## 4. 相关文档 {#4-相关文档}

### 核心文档

| 文档 | 内容 | 关系 |
|------|------|------|
| [系统设计](./system-design.md) | MVP 4 模块架构 | 本文档的父文档 |
| [传感器指标映射](./sensor-data-processing.md) | 算法实现代码 | §3.1-3.3 的详细实现 |
| [挥杆阶段](../specs/swing-phases.md) | 8 阶段检测 | CLASSIFIER Block 输出 |
| [生物力学术语表](../../prerequisites/foundations/biomechanics-glossary.md) | 术语定义 | 高尔夫专业术语 |

### 技术决策 (ADRs)

| 决策 | 内容 | 相关 Block |
|------|------|-----------|
| [ADR-0002](../decisions/0002-lsm6dsv16x-imu.md) | LSM6DSV16X 选型 | IMU Block |
| [ADR-0005](../decisions/0005-esp32-s3-microcontroller.md) | ESP32-S3 选型 | Sensor Hub |
| [ADR-0007](../decisions/0007-swift-ios-native.md) | Swift iOS 开发 | Mobile App |

### 实现指南

| 文档 | 内容 | 适合 |
|------|------|------|
| [ML 基础](../../prerequisites/ml-basics.md) | ML 概念入门 | 无 ML 背景读者 |
| [实时反馈](../specs/real-time-feedback.md) | 反馈系统设计 | OUTPUT Block 实现 |

---

## 5. 版本历史 {#5-版本历史}

| 版本 | 日期 | 修改内容 |
|------|------|----------|
| 2.13 | 2025-12-27 | Rerun 章节迁移 |
| | | • §4 Rerun 调试工具迁移至 data-pipeline-and-ai.md §5 |
| | | • 章节重新编号: §5→§4, §6→§5 |
| 2.12 | 2025-12-27 | 文档聚焦重构 |
| | | • 删除 §3 MVP 策略 (内容移至 system-design.md) |
| | | • 重写 §3 积木替换示例，增加概览表 + 原理图 + 步骤表 |
| | | • 修正 §2.1 数据采集层图: CAMERA 独立于 BLE (Native SDK 零延迟) |
| | | • 章节重新编号: §4→§3, §5→§4, §6→§5, §7→§6 |
| 2.11 | 2025-12-27 | SENSOR_HUB 可复用架构 — 同一固件多实例部署 |
| | | • HUB_A + HUB_B 合并为单一 SENSOR_HUB Block ×N |
| | | • Block 总数: 13 → 12 (消除重复定义) |
| | | • 新增 `hub_id` 字段区分实例 (0, 1, 2, ...) |
| | | • 接口类: HubAInput/HubBOutput → SensorHubInput/SensorHubOutput |
| | | • 新增典型部署配置表 (MVP N=2, 扩展 N=4+) |
| | | • BLE Block 更新: 支持 N 个外设连接 |
| | | • TIME_ALIGN Block 更新: hub_readings 替代分离的 imu/emg 输入 |
| 2.10 | 2025-12-27 | Hub 命名通用化 — 支持多场景部署 |
| | | • ARM_HUB → HUB_A, CORE_HUB → HUB_B (位置无关命名) |
| | | • 接口类重命名: ArmHubInput/Output → HubAInput/Output |
| | | • 字段通用化: left_arm_imu → imu_1, right_arm_imu → imu_2 |
| | | • 新增 "部署位置: 可配置" 说明 |
| 2.9 | 2025-12-27 | 接口契约完善 — 统一 Python dataclass 格式 |
| | | • §1.3: 新增 Block 数列 + 接口契约汇总表，统计 13 个 Block 总计 |
| | | • §2.1.1-2.1.4: 补全 Stage 2 采集层所有 Block 的 Input 接口 |
| | | • §2.3.1: 重写接口契约 (ASCII → Python dataclass)，新增完整类型定义 |
| | | • §2.6.1: 补全 OUTPUT Block 的 Output 接口 (OutputResult) |
| 2.8 | 2025-12-27 | Stage 6-7 拆分为独立层级 |
| | | • §2.5: 新增 AI 反馈生成层 (Stage 6) — PROMPT Block + LLM Block |
| | | • §2.6: 新增用户反馈呈现层 (Stage 7) — OUTPUT Block |
| | | • §1.3: 更新映射表，Stage 6/7 独立显示 |
| | | • 新增 3 个 Block 接口契约 (PromptInput/LLMInput/OutputInput) |
| 2.7 | 2025-12-27 | 章节重构 — 对齐 7 阶段架构 |
| | | • §2.4: 新增分析诊断层 (Stage 5)，合并原 §3 分析层 + §2.4 置信度计算逻辑 |
| | | • §2.5: 用户反馈翻译层重新编号为 (Stage 6-7) |
| | | • §3-§7: 全部章节重新编号 (原 §4-§8) |
| | | • §1.3: 更新 Stage 4/5/6-7 的锚点链接 |
| | | • §5.2: 更新诊断规则调试链接指向 §2.4.2 |
| 2.6 | 2025-12-23 | 硬件与架构更新 (基于 architecture-decisions-2025-12-23.md) |
| | | • §1.3: 新增原则 #6 "六边形架构" — Ports & Adapters 模式 |
| | | • §2.4.1: 新增 BLE 传输抖动警告 (±15-30ms) |
| | | • §2.4.2: 新增 Sensor Hub 架构 — 同一部位传感器共享 ESP32 时钟 |
| | | • §3.2: 更新 IMU 硬件推荐 — Adafruit LSM6DSV16X (ADA-5783) + WitMotion 警告 |
| | | • §3.3: 更新 EMG 硬件推荐 — MyoWare 2.0 + Link Shield 必需品 + DFRobot 警告 |
| | | • §5.5: Phase 3 描述更新 — 架构变更为 Sensor Hub 模式 |

---

**最后更新**: 2025-12-27
**维护者**: Movement Chain AI Team
