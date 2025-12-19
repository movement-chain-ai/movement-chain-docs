# 传感器指标映射 Sensor-to-Metric Mapping

> **文档目的**: 定义三模态系统 (Vision + IMU + EMG) 可测量的研究验证指标
> **核心价值**: EMG 提供的肌肉激活检测是独特差异化优势，竞品无法实现
> **最后更新**: 2025-12-18

---

## 1. 系统能力矩阵 Capability Matrix

下表展示了文献验证的高尔夫指标与三模态系统各传感器的对应关系。

| 研究验证指标 | Vision (MediaPipe) | IMU (手腕) | IMU (骨盆 Phase 2) | EMG | 覆盖状态 |
|------------|-------------------|-----------|-------------------|-----|---------|
| **骨盆转角 Pelvis Turn** | ✅ 侧视角 | ❌ | ✅ Phase 2 | ❌ | ✅ 已覆盖 |
| **骨盆角速度 Pelvis Rotation Velocity** | ⚠️ 帧差计算 | ❌ | ✅ Phase 2 | ❌ | Phase 2 |
| **肩部转角 Torso/Shoulder Turn** | ✅ 侧视角 | ❌ | ❌ | ❌ | ✅ 已覆盖 |
| **躯干角速度 Torso Rotation Velocity** | ⚠️ 帧差计算 | ❌ | ❌ | ❌ | ⚠️ 低精度 |
| **X-Factor (肩髋分离角)** | ✅ 直接计算 | ❌ | ❌ | ❌ | ✅ 已覆盖 |
| **X-Factor Stretch (最大分离差)** | ✅ 下挥杆期 | ❌ | ❌ | ❌ | ✅ 已覆盖 |
| **S-Factor (肩部倾斜)** | ✅ 正视角 | ❌ | ❌ | ❌ | ✅ 已覆盖 |
| **O-Factor (骨盆倾斜)** | ✅ 正视角 | ❌ | ❌ | ❌ | ✅ 已覆盖 |
| **躯干侧移/前推/抬升 Torso Sway/Thrust/Lift** | ✅ 3D轨迹 | ❌ | ❌ | ❌ | ✅ 已覆盖 |
| **骨盆侧移/前推/抬升 Pelvis Sway/Thrust/Lift** | ✅ 3D轨迹 | ❌ | ❌ | ❌ | ✅ 已覆盖 |
| **节奏比 Tempo Ratio** | ⚠️ 低频 33ms | ✅ 高频 <10ms | ✅ Phase 2 | ❌ | ✅ 已覆盖 |
| **峰值角速度 Peak Angular Velocity** | ❌ 不支持 | ✅ 直接测量 | ✅ Phase 2 | ❌ | ✅ 已覆盖 |
| **运动链时序 Kinematic Sequence Timing** | ⚠️ 33ms精度 | ✅ <10ms | ✅ Phase 2 | ✅ <5ms | ✅✅ 高精度 |
| **肌肉激活时序 Muscle Activation Timing** | ❌ 不支持 | ❌ 不支持 | ❌ 不支持 | ✅ <5ms | ✅ **UNIQUE** |
| **肌肉激活强度 Muscle Activation Intensity** | ❌ 不支持 | ❌ 不支持 | ❌ 不支持 | ✅ mV信号 | ✅ **UNIQUE** |
| **力链序列 Force Chain Sequence** | ❌ 不支持 | ⚠️ 间接 | ⚠️ 间接 | ✅ 直接验证 | ✅ **UNIQUE** |
| **地面反作用力 Ground Reaction Force** | ❌ 不支持 | ❌ 不支持 | ❌ 不支持 | ❌ 需测力台 | ❌ 未覆盖 |
| **杆头速度 Clubhead Speed** | ❌ 不支持 | ⚠️ 相关性 | ❌ 不支持 | ❌ 不支持 | ⚠️ 间接推断 |

**图例说明**:

- ✅ 已覆盖 = 该传感器可直接测量此指标
- ⚠️ 低精度 = 可测量但精度/采样率不足
- ❌ 不支持 = 该传感器无法测量此指标
- **UNIQUE** = 竞品无法实现的独特能力

---

## 2. 竞品能力对比 Competitor Comparison

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    YOUR SYSTEM vs COMPETITORS                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   OnForm / Sportsbox AI (Vision Only):                                       │
│   ├── ✅ 所有身体角度和位置 (X-Factor, S-Factor, O-Factor, Sway/Lift)          │
│   ├── ❌ 无法精确测量角速度 (受限于 <30fps 采样率)                              │
│   ├── ❌ 无法检测肌肉激活 (无 EMG 传感器)                                       │
│   ├── ❌ 无法检测运动链时序 (精度 ≥33ms, 不足以区分 5-10ms 的激活差异)           │
│   └── ❌ 无法验证力链传递 (只能看到结果，看不到原因)                             │
│                                                                              │
│   K-VEST / GEARS (IMU Only):                                                 │
│   ├── ✅ 角速度测量精确 (1000Hz 采样率)                                        │
│   ├── ✅ 运动链时序检测 (10ms 精度)                                            │
│   ├── ❌ 无法看到全身位置 (需要多个 IMU 才能重建姿态)                            │
│   ├── ❌ 无法检测肌肉激活 (无 EMG 传感器)                                       │
│   └── ❌ 无法验证力链传递 (只能推断，无法直接观测)                               │
│                                                                              │
│   YOUR SYSTEM (Vision + IMU + EMG):                                          │
│   ├── ✅ 所有身体角度 (Vision 提供 33 关键点)                                  │
│   ├── ✅ 角速度测量 (IMU 1666Hz 采样率)                                        │
│   ├── ✅ 运动链时序 (IMU <10ms + EMG <5ms 双重验证)                            │
│   ├── ✅✅ 肌肉激活检测 (EMG) ← UNIQUE DIFFERENTIATOR                         │
│   ├── ✅✅ 力链验证 (EMG sequence analysis) ← NO COMPETITOR HAS THIS          │
│   ├── ✅✅ 疲劳检测 (EMG amplitude decline) ← INJURY PREVENTION               │
│   └── ✅✅ 因果分析 (Why did swing fail? EMG shows muscle timing errors)      │
└─────────────────────────────────────────────────────────────────────────────┘
```

**核心差异化总结**:

| 能力维度 | Vision系统 | IMU系统 | 你的系统 (Vision+IMU+EMG) |
|---------|-----------|---------|--------------------------|
| **看到什么 (What)** | ✅✅ 最强 | ⚠️ 需多传感器 | ✅✅ 最强 |
| **测量速度 (How Fast)** | ❌ 低频 | ✅✅ 最强 | ✅✅ 最强 |
| **解释原因 (Why)** | ❌ 无法解释 | ⚠️ 间接推断 | ✅✅ **直接观测肌肉激活** |

---

## 3. 检测方法详解 Detection Methods

### 3.1 Vision 检测 (MediaPipe 33 landmarks)

**优势**: 直接观测身体姿态，无需复杂校准
**劣势**: 采样率低 (30fps = 33ms)，无法测量高频运动

```python
# X-Factor 计算示例
def calculate_x_factor(landmarks):
    """
    计算肩髋分离角

    Args:
        landmarks: MediaPipe 33关键点 (索引见 https://google.github.io/mediapipe/solutions/pose)

    Returns:
        x_factor: 肩部转角 - 骨盆转角 (度)
    """
    # 肩部连线角度 (landmarks 11=左肩, 12=右肩)
    shoulder_angle = math.atan2(
        landmarks[12].z - landmarks[11].z,
        landmarks[12].x - landmarks[11].x
    )

    # 骨盆连线角度 (landmarks 23=左髋, 24=右髋)
    hip_angle = math.atan2(
        landmarks[24].z - landmarks[23].z,
        landmarks[24].x - landmarks[23].x
    )

    # X-Factor = 肩部转角 - 骨盆转角
    x_factor = math.degrees(abs(shoulder_angle) - abs(hip_angle))

    return x_factor

# S-Factor / O-Factor 计算 (肩部/骨盆倾斜)
def calculate_obliquity(landmarks, is_shoulder=True):
    """
    计算肩部或骨盆倾斜角

    Args:
        landmarks: MediaPipe 33关键点
        is_shoulder: True=S-Factor (肩部), False=O-Factor (骨盆)

    Returns:
        obliquity: 倾斜角 (度, 正值=右高左低)
    """
    if is_shoulder:
        left_idx, right_idx = 11, 12  # 左右肩
    else:
        left_idx, right_idx = 23, 24  # 左右髋

    # 计算垂直方向高度差
    height_diff = landmarks[right_idx].y - landmarks[left_idx].y
    width = abs(landmarks[right_idx].x - landmarks[left_idx].x)

    obliquity = math.degrees(math.atan2(height_diff, width))

    return obliquity
```

**可检测指标**:

- X-Factor, X-Factor Stretch
- S-Factor, O-Factor
- 骨盆/躯干转角
- 侧移/前推/抬升 (Sway/Thrust/Lift)
- 节奏比 (低精度)

---

### 3.2 IMU 检测 (LSM6DSV16X @ 1666Hz)

**优势**: 高频采样，精确测量角速度和加速度
**劣势**: 单个 IMU 只能测量局部运动，需多个传感器才能重建全身姿态

```python
# 峰值角速度检测
def detect_peak_velocity(gyro_data, timestamps):
    """
    检测挥杆过程中的峰值角速度

    Args:
        gyro_data: 陀螺仪数据 (deg/s), shape=(N, 3) for [x, y, z]
        timestamps: 时间戳 (ms)

    Returns:
        peak_velocity: 峰值角速度 (deg/s)
        peak_time: 峰值发生时间 (ms)
    """
    # 计算合成角速度
    angular_velocity = np.sqrt(np.sum(gyro_data**2, axis=1))

    peak_idx = np.argmax(angular_velocity)
    peak_velocity = angular_velocity[peak_idx]
    peak_time = timestamps[peak_idx]

    return peak_velocity, peak_time

# 节奏比计算
def calculate_tempo_ratio(timestamps, event_labels):
    """
    计算上杆/下杆节奏比

    Args:
        timestamps: 时间戳 (ms)
        event_labels: 事件标签 ['address', 'top', 'impact']

    Returns:
        tempo_ratio: 上杆时长 / 下杆时长
    """
    address_time = timestamps[event_labels.index('address')]
    top_time = timestamps[event_labels.index('top')]
    impact_time = timestamps[event_labels.index('impact')]

    backswing_duration = top_time - address_time
    downswing_duration = impact_time - top_time

    tempo_ratio = backswing_duration / downswing_duration

    return tempo_ratio

# 运动链时序检测
def detect_kinematic_sequence(gyro_data, timestamps, threshold=50):
    """
    检测运动链各环节的启动时间

    Args:
        gyro_data: 陀螺仪数据 (deg/s)
        timestamps: 时间戳 (ms)
        threshold: 启动阈值 (deg/s)

    Returns:
        onset_times: 各环节启动时间 (ms)
    """
    # 寻找角速度超过阈值的首次时刻
    onset_idx = np.where(np.abs(gyro_data) > threshold)[0][0]
    onset_time = timestamps[onset_idx]

    return onset_time
```

**可检测指标**:

- 峰值角速度
- 节奏比 (高精度)
- 运动链时序 (<10ms 精度)
- 加速度峰值

---

### 3.3 EMG 检测 (UNIQUE CAPABILITY)

**优势**: 直接观测肌肉激活，解释"为什么"
**劣势**: 需要皮肤接触，受汗水/毛发影响

```python
# 肌肉激活时序检测
def detect_muscle_onset(emg_signal, timestamps, threshold=0.5):
    """
    检测肌肉激活起始时间

    Args:
        emg_signal: EMG 信号 (mV), 已经过滤波和包络提取
        timestamps: 时间戳 (ms)
        threshold: 激活阈值 (mV 或归一化值)

    Returns:
        onset_time: 激活起始时间 (ms)
        onset_intensity: 激活峰值强度 (mV)
    """
    # 寻找信号超过阈值的首次时刻
    onset_idx = np.where(emg_signal > threshold)[0]

    if len(onset_idx) == 0:
        return None, None  # 未检测到激活

    onset_time = timestamps[onset_idx[0]]
    onset_intensity = np.max(emg_signal[onset_idx])

    return onset_time, onset_intensity

# 运动链序列验证 (UNIQUE)
def validate_kinematic_sequence(emg_core, emg_forearm, timestamps, threshold=0.5):
    """
    验证核心肌群是否先于手臂激活 (正确的运动链序列)

    Args:
        emg_core: 核心肌群 EMG 信号 (腹斜肌或竖脊肌)
        emg_forearm: 前臂 EMG 信号 (桡侧腕屈肌或尺侧腕屈肌)
        timestamps: 时间戳 (ms)
        threshold: 激活阈值

    Returns:
        sequence_correct: True=核心先激活, False=手臂先激活
        time_diff: 激活时间差 (ms, 正值=核心先激活)
    """
    core_onset, _ = detect_muscle_onset(emg_core, timestamps, threshold)
    forearm_onset, _ = detect_muscle_onset(emg_forearm, timestamps, threshold)

    if core_onset is None or forearm_onset is None:
        return None, None  # 信号质量不足

    time_diff = forearm_onset - core_onset  # 正值=核心先激活
    sequence_correct = time_diff > 0

    return sequence_correct, time_diff

# 疲劳检测 (UNIQUE)
def detect_muscle_fatigue(emg_signals, swing_indices):
    """
    检测练习过程中的肌肉疲劳

    Args:
        emg_signals: EMG 信号 (mV), shape=(N_samples, N_muscles)
        swing_indices: 每次挥杆的起止索引 [(start1, end1), (start2, end2), ...]

    Returns:
        fatigue_detected: 是否检测到疲劳
        fatigue_ratio: 最后挥杆 / 首次挥杆的激活强度比 (<0.7 表示疲劳)
    """
    # 提取每次挥杆的峰值激活强度
    peak_intensities = []
    for start_idx, end_idx in swing_indices:
        swing_emg = emg_signals[start_idx:end_idx]
        peak = np.max(swing_emg)
        peak_intensities.append(peak)

    # 对比首次和最后挥杆的激活强度
    first_swing_peak = peak_intensities[0]
    last_swing_peak = peak_intensities[-1]

    fatigue_ratio = last_swing_peak / first_swing_peak
    fatigue_detected = fatigue_ratio < 0.7  # 强度下降 >30% 视为疲劳

    return fatigue_detected, fatigue_ratio

# 力链传递验证 (UNIQUE)
def validate_force_chain(emg_signals, muscle_names, timestamps, threshold=0.5):
    """
    验证力链传递序列: 下肢 → 核心 → 躯干 → 手臂

    Args:
        emg_signals: EMG 信号字典 {muscle_name: signal}
        muscle_names: 肌肉分组 ['leg', 'core', 'torso', 'arm']
        timestamps: 时间戳 (ms)
        threshold: 激活阈值

    Returns:
        force_chain_correct: True=力链传递正确
        onset_sequence: 各肌群激活时间 (ms)
    """
    onset_times = {}

    for muscle in muscle_names:
        onset_time, _ = detect_muscle_onset(emg_signals[muscle], timestamps, threshold)
        onset_times[muscle] = onset_time

    # 验证激活顺序
    expected_order = ['leg', 'core', 'torso', 'arm']
    actual_order = sorted(onset_times.keys(), key=lambda m: onset_times[m])

    force_chain_correct = actual_order == expected_order

    return force_chain_correct, onset_times
```

**可检测指标 (竞品无法实现)**:

- 肌肉激活时序 (<5ms 精度)
- 肌肉激活强度 (mV 信号幅值)
- 运动链序列验证 (核心 → 手臂的顺序)
- 疲劳检测 (激活强度衰减)
- 力链传递验证 (下肢 → 核心 → 躯干 → 手臂)

---

## 4. 独特检测能力总结 Your Unique Detection Capabilities

下表展示了你的系统相对于竞品的独特优势。

| 可检测能力 | 检测方法 | 竞品可实现? | 商业价值 |
|-----------|---------|-----------|---------|
| **核心先于手臂激活** | EMG 时序分析 | ❌ 无竞品可实现 | 验证"由内而外"的力链传递原则 |
| **力链断裂点定位** | EMG 序列分析 | ❌ 无竞品可实现 | 精确诊断"为什么挥杆失败" |
| **疲劳累积检测** | EMG 幅值衰减 | ❌ 无竞品可实现 | 伤病预防，优化训练量 |
| **X-Factor Stretch** | Vision 帧分析 | ✅ 部分竞品 (Sportsbox) | 验证"蓄力"动作 |
| **运动链时序 (<10ms)** | IMU + EMG 双重验证 | ⚠️ 部分竞品 (GEARS, 仅 IMU) | 高精度时序分析 |
| **峰值角速度** | IMU 直接测量 | ✅ 部分竞品 (K-VEST) | 爆发力评估 |
| **节奏比** | IMU 高频采样 | ✅ 部分竞品 (Vision + IMU) | 挥杆节奏一致性 |
| **所有身体角度** | Vision 33 关键点 | ✅ 所有 Vision 系统 | 姿态评估基础能力 |

**核心差异化总结**:

1. **EMG 肌肉激活检测** = 你的系统**独有**，无竞品可实现
2. **因果分析能力** = Vision/IMU 只能看到"结果"，EMG 可以解释"原因"
3. **伤病预防** = 疲劳检测可提前发现过度训练风险

---

## 5. 系统融合策略 Sensor Fusion Strategy

三模态传感器的数据融合策略如下:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SENSOR FUSION PIPELINE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Phase 1: 单模态特征提取                                                      │
│   ├── Vision (30fps): 提取 33 关键点 → 计算 X-Factor, S-Factor, Sway/Lift     │
│   ├── IMU (1666Hz): 提取角速度/加速度 → 计算峰值速度, 节奏比                    │
│   └── EMG (1000Hz): 提取激活时序 → 计算肌肉启动时间, 激活强度                   │
│                                                                              │
│   Phase 2: 时间对齐                                                           │
│   ├── 以 IMU 为基准时钟 (最高采样率)                                           │
│   ├── Vision 帧插值到 1666Hz (线性插值)                                        │
│   └── EMG 重采样到 1666Hz (降采样)                                            │
│                                                                              │
│   Phase 3: 特征融合                                                           │
│   ├── 运动链时序 = IMU (身体启动) + EMG (肌肉启动) 双重验证                      │
│   ├── X-Factor Stretch = Vision (角度差) + EMG (核心激活) 相关性分析            │
│   └── 力链验证 = Vision (姿态) + IMU (速度) + EMG (激活序列) 三重验证            │
│                                                                              │
│   Phase 4: 异常检测                                                           │
│   ├── 如果 EMG 显示核心未激活，但 IMU 显示高速转体 → 警告"代偿动作"              │
│   ├── 如果 Vision 显示 X-Factor 正常，但 EMG 显示激活序列错误 → 警告"假性蓄力"   │
│   └── 如果 EMG 显示疲劳，但用户继续练习 → 建议"休息以防受伤"                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

**融合优势**:

- **互补性**: Vision 看不到的 (肌肉激活)，EMG 可以测
- **冗余性**: 运动链时序可用 IMU + EMG 双重验证，提高准确性
- **因果性**: Vision/IMU 提供"现象"，EMG 提供"原因"

---

## 6. EMG 传感器布局规划 EMG Sensor Placement Plan

### 6.1 关键肌群图 Key Muscle Groups

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GOLF SWING EMG SENSOR MAP                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        ┌─────────────┐                                      │
│                        │   背阔肌     │ ← Phase 3: 肩部旋转、拉杆动作        │
│                        │    Lats     │   (Latissimus Dorsi)                 │
│                        └──────┬──────┘                                      │
│                               │                                             │
│                        ┌──────┴──────┐                                      │
│                        │    核心     │ ← Phase 1: 躯干旋转、力量传递中枢 ⭐  │
│                        │    Core    │   (Obliques 腹斜肌)                   │
│                        └──────┬──────┘                                      │
│                               │                                             │
│                        ┌──────┴──────┐                                      │
│                        │    臀肌     │ ← Phase 2: 下杆启动、髋部旋转         │
│                        │   Glutes   │   (Gluteus Maximus 臀大肌)            │
│                        └──────┬──────┘                                      │
│                               │                                             │
│   ┌───────────────────┐       │       ┌───────────────────┐                 │
│   │   三角肌 Deltoids │       │       │   前臂 Forearm    │                 │
│   │   Phase 3         │       │       │   Phase 1 ⭐      │                 │
│   └───────────────────┘       │       │   (Wrist Flexors) │                 │
│                               │       └───────────────────┘                 │
│                        ┌──────┴──────┐                                      │
│                        │  大腿内侧   │ ← Phase 2: 下盘稳定、重心转移         │
│                        │  Adductors │                                       │
│                        └─────────────┘                                      │
│                                                                             │
│   运动链传递顺序 Kinematic Chain:                                            │
│   Glutes → Core → Lats → Forearm                                           │
│   (臀肌 → 核心 → 背阔肌 → 前臂)                                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 分阶段部署计划 Phased Deployment

| Phase | 肌群 | 英文名 | 检测目标 | 传感器数 |
|:-----:|------|--------|----------|:--------:|
| **1 (MVP)** | 核心/腹斜肌 | Core/Obliques | 躯干旋转发力、运动链中枢 | 1 |
| **1 (MVP)** | 前臂屈肌 | Forearm Flexors | 手腕释放时机、握杆力度 | 1 |
| **2** | 臀大肌 | Gluteus Maximus | 下杆启动、髋部旋转 | 1 |
| **2** | 大腿内侧 | Adductors | 下盘稳定、重心转移 | 1 |
| **3** | 背阔肌 | Latissimus Dorsi | 肩部旋转、拉杆动作 | 1 |
| **3** | 三角肌 | Deltoids | 手臂举起、顶点位置 | 1 |

**传感器数量规划**:

- Phase 1 (MVP): **2 通道** — 最小可行，验证核心价值
- Phase 2: **4 通道** — 完整下半身运动链
- Phase 3: **6 通道** — 全身运动链分析

### 6.3 选择依据 Selection Rationale

| 研究来源 | 发现 | 对选型的影响 |
|---------|------|-------------|
| **Cheetham (2008)** | 运动链时序: 骨盆 → 躯干 → 手臂，职业选手间隔更稳定 | Core + Forearm 可检测最关键的"躯干→手臂"时序 |
| **Meister (2011)** | 核心激活与杆头速度相关性 r=0.89 | Core 是必选传感器 |
| **TPI 研究** | 臀肌激活不足 → 早伸 (Early Extension) | Phase 2 加入 Gluteus |
| **PMC4851105** | 8通道EMG分析发现"雪崩效应" | 全通道分析需要 Phase 3 |

### 6.4 MVP 检测能力

仅用 **2 个 EMG 传感器 (Core + Forearm)** 即可检测:

| 检测能力 | 方法 | 阈值 |
|---------|------|------|
| **倒序运动链** | Core onset vs Forearm onset | 时间差 < 0ms = 错误 |
| **过度手臂挥杆** | Forearm RMS / Core RMS | 比值 > 1.3 = 问题 |
| **核心激活不足** | Core RMS / MVC% | < 50% MVC = 不足 |
| **疲劳检测** | 峰值幅度衰减趋势 | 下降 > 30% = 疲劳 |

### 6.5 Mock 数据结构

MVP 阶段使用 Mock 数据时，建议预留 **4 通道** 数据结构，便于后续扩展:

```python
# Mock EMG 数据结构 (为 Phase 2 预留)
mock_emg = {
    # Phase 1 (MVP) - 必须实现
    "core_obliques": {
        "signal": [...],           # 500Hz 采样
        "onset_time_ms": 0,        # 激活起始时间
        "peak_amplitude_mv": 0.0,  # 峰值幅度
        "rms_mv": 0.0,             # RMS 均值
    },
    "forearm_flexors": {
        "signal": [...],
        "onset_time_ms": 0,
        "peak_amplitude_mv": 0.0,
        "rms_mv": 0.0,
    },

    # Phase 2 - 数据结构预留
    "gluteus_maximus": None,       # Phase 2 填充
    "adductors": None,             # Phase 2 填充

    # Phase 3 - 数据结构预留
    "latissimus_dorsi": None,      # Phase 3 填充
    "deltoids": None,              # Phase 3 填充
}

# 计算 Core-Forearm 时序差
def calculate_timing_gap(mock_emg):
    core_onset = mock_emg["core_obliques"]["onset_time_ms"]
    forearm_onset = mock_emg["forearm_flexors"]["onset_time_ms"]
    gap_ms = forearm_onset - core_onset  # 正值 = 核心先激活 (正确)
    return gap_ms

# 计算发力比例
def calculate_activation_ratio(mock_emg):
    core_rms = mock_emg["core_obliques"]["rms_mv"]
    forearm_rms = mock_emg["forearm_flexors"]["rms_mv"]
    ratio = forearm_rms / core_rms  # < 1.3 为正常
    return ratio
```

---

## 7. 相关文档 Related Documents

- [系统设计](../system-design.md): MVP 技术架构和构建顺序
- [挥杆对比分析](../swing-comparison.md): Pro vs Amateur 的生物力学差异
- [生物力学术语表](./biomechanics-glossary.md): 技术术语定义
- [生物力学基准值](./biomechanics-benchmarks.md): 文献验证的正常范围

---

**注意事项**:

1. EMG 信号质量受皮肤阻抗影响，需校准和去噪
2. Vision 的 33ms 采样间隔不足以检测 <10ms 的激活差异，需 IMU/EMG 补充
3. 单个 IMU 无法测量全身姿态，Phase 2 需增加骨盆 IMU
4. 地面反作用力需专用测力台，MVP 阶段不支持
