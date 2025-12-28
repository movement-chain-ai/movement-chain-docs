# 数据处理与指标计算 Sensor Data Processing

> **文档目的**: 定义三模态系统 (Vision + IMU + EMG) 的数据处理流程与可计算指标
> **核心价值**: EMG 提供的肌肉激活检测是独特差异化优势，竞品无法实现
> **最后更新**: 2025-12-28

---

## 1. 指标能力矩阵 {#1-指标能力矩阵-metrics-capability-matrix}

下表展示了文献验证的高尔夫指标与系统数据的对应关系。

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
| **运动链时序 Kinematic Sequence Timing** | ⚠️ 33ms精度 | ✅ <1ms (1666Hz) | ✅ Phase 2 | ✅ <5ms | ✅✅ 高精度 |
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

## 2. 竞品能力对比  {#2-竞品能力对比-competitor-comparison}

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    YOUR SYSTEM vs COMPETITORS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   OnForm / Sportsbox AI (Vision Only):                                      │
│   ├── ✅ 所有身体角度和位置 (X-Factor, S-Factor, O-Factor, Sway/Lift)          │
│   ├── ❌ 无法精确测量角速度 (受限于 <30fps 采样率)                               │
│   ├── ❌ 无法检测肌肉激活 (无 EMG 传感器)                                       │
│   ├── ❌ 无法检测运动链时序 (精度 ≥33ms, 不足以区分 5-10ms 的激活差异)             │
│   └── ❌ 无法验证力链传递 (只能看到结果，看不到原因)                               │
│                                                                             │
│   K-VEST / GEARS (IMU Only):                                                │
│   ├── ✅ 角速度测量精确 (1000Hz 采样率)                                        │
│   ├── ✅ 运动链时序检测 (10ms 精度)                                            │
│   ├── ❌ 无法看到全身位置 (需要多个 IMU 才能重建姿态)                             │
│   ├── ❌ 无法检测肌肉激活 (无 EMG 传感器)                                       │
│   └── ❌ 无法验证力链传递 (只能推断，无法直接观测)                                 │
│                                                                             │
│   YOUR SYSTEM (Vision + IMU + EMG):                                         │
│   ├── ✅ 所有身体角度 (Vision 提供 33 关键点)                                   │
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

## 3. 数据处理与指标计算(单传感器计算) 

### 3.1 Vision 数据处理 {#31-vision-数据处理-mediapipe-33-landmarks}

**优势**: 直接观测身体姿态，无需复杂校准
**劣势**: 采样率低 (30fps = 33ms)，无法测量高频运动

#### 3.1.1 原始数据 {#311-vision-原始数据}

MediaPipe Pose 每帧输出 **33 个关键点**，每个关键点包含 4 个数值：

```text
┌─────────────────────────────────────────────────────────────────┐
│                    Vision 关键点数据结构                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   每个 Landmark 包含 4 个值:                                      │
│   ├── x: 水平位置 (归一化坐标, 0-1)                                │
│   ├── y: 垂直位置 (归一化坐标, 0-1)                                │
│   ├── z: 深度 (相对髋部中点的距离)                                  │
│   └── visibility: 可见度 (0-1, 置信度)                            │
│                                                                 │
│   采样率: 30 fps (每帧间隔 33.3ms)                                │
│   关键点数: 33 个 (全身骨架)                                       │
│   每帧数据量: 33 × 4 = 132 个浮点数                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**归一化坐标系**:

```text
图像坐标系 (左上角为原点):

(0,0) ─────────────────────────────→ x (1,0)
  │
  │         ┌─────────┐
  │         │  0.45   │  ← x=0.45 表示距离左边缘 45%
  │         │    ●    │
  │         │  0.32   │  ← y=0.32 表示距离上边缘 32%
  │         └─────────┘
  │
  ↓
(0,1)                                   (1,1)
```

| 坐标 | 含义 | 范围 | 零点/原点 |
|------|------|------|----------|
| **x** | 水平位置 | [0, 1] | 0 = 图像左边缘 |
| **y** | 垂直位置 | [0, 1] | 0 = 图像上边缘 |
| **z** | 深度 | 相对值 | 0 ≈ 髋部中点 |
| **visibility** | 可见度 | [0, 1] | 0 = 完全遮挡 |

**z 坐标深度说明**:

```text
俯视图 (从上往下看):

        镜头
          │
          ▼
    ┌─────────────┐
    │   手臂      │  ← z < 0 (比髋部更靠近镜头)
    │   髋部 ●    │  ← z ≈ 0 (参考点: 左右髋关节中点)
    │   后背      │  ← z > 0 (比髋部更远离镜头)
    └─────────────┘
```

| z 值 | 含义 | 挥杆中的例子 |
|------|------|-------------|
| **负数** | 比髋部更靠近镜头 | 手臂向前伸、身体前倾 |
| **≈ 0** | 与髋部在同一深度平面 | 髋部本身 |
| **正数** | 比髋部更远离镜头 | 后背、向后摆动的手臂 |

!!! warning "z 坐标的局限性"
    MediaPipe 的 z 是从 2D 图像推断的，精度有限。
    真正的 3D 深度需要双目摄像头或 LiDAR。

**visibility 可见度应用**:

| visibility 值 | 状态 | 处理方式 |
|--------------|------|---------|
| 0.9 - 1.0 | 清晰可见 | ✅ 直接使用 |
| 0.7 - 0.9 | 部分遮挡 | ⚠️ 可用但需谨慎 |
| 0.5 - 0.7 | 严重遮挡 | ⚠️ 建议忽略或插值 |
| < 0.5 | 不可见 | ❌ 不应使用 |

```python
# 可见度过滤示例
def filter_landmarks(landmarks, min_visibility=0.7):
    """过滤低可见度的关键点"""
    return {
        idx: lm for idx, lm in enumerate(landmarks)
        if lm.visibility >= min_visibility
    }
```

!!! tip "为什么需要归一化坐标？"
    - **跨设备一致**: iPhone 12 (1920×1080) 和 iPhone 15 Pro (2556×1179) 输出相同坐标
    - **算法通用**: 不需要针对不同分辨率调整阈值
    - **存储高效**: 不需要记录原始图像尺寸

> 详见 [归一化坐标](../../reference/software-glossary.md#7-归一化坐标-normalized-coordinates) — 完整定义和转换公式

---

#### 3.1.2 计算指标 {#312-vision-计算指标}

**高尔夫挥杆关键点**:

```text
┌─────────────────────────────────────────────────────────────────┐
│                    MediaPipe 33 关键点                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   高尔夫挥杆最常用的关键点 (按运动链分组):                            │
│                                                                 │
│   ┌─ 上肢控制群 (握杆/释放) ───────────────────────────────────┐   │
│   │                                                         │   │
│   │   肩部 (X-Factor, S-Factor):                             │   │
│   │   ├── 11: left_shoulder   (左肩)                         │   │
│   │   └── 12: right_shoulder  (右肩)                         │   │
│   │                                                         │   │
│   │   手肘 (手臂折叠角度):                                     │   │
│   │   ├── 13: left_elbow      (左肘)                         │   │
│   │   └── 14: right_elbow     (右肘)                         │   │
│   │                                                         │   │
│   │   手腕 (握杆位置, 对应 EMG 前臂屈肌/伸肌):                   │   │
│   │   ├── 15: left_wrist      (左手腕)                       │   │
│   │   └── 16: right_wrist     (右手腕)                       │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─ 核心驱动群 (躯干旋转) ────────────────────────────────────┐   │
│   │                                                         │   │
│   │   髋部 (X-Factor, O-Factor):                             │   │
│   │   ├── 23: left_hip        (左髋)                         │   │
│   │   └── 24: right_hip       (右髋)                         │   │
│   │                                                         │   │
│   │   注: 躯干旋转通过 肩膀(11,12) - 髋部(23,24) 角度差计算       │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─ 下肢稳定群 (地面反作用力) ─────────────────────────────────┐   │
│   │                                                         │   │
│   │   膝盖 (下肢稳定性):                                       │   │
│   │   ├── 25: left_knee       (左膝)                         │   │
│   │   └── 26: right_knee      (右膝)                         │   │
│   │                                                         │   │
│   │   脚踝 (站位宽度):                                        │   │
│   │   ├── 27: left_ankle      (左脚踝)                       │   │
│   │   └── 28: right_ankle     (右脚踝)                       │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**高尔夫指标与关键点对应**:

| 指标 | 使用的关键点 | 计算方式 |
|------|-------------|---------|
| **X-Factor** | 11, 12, 23, 24 | 肩膀连线角度 - 髋部连线角度 |
| **S-Factor** | 11, 12 | 肩膀倾斜角度 (左右高度差) |
| **O-Factor** | 23, 24 | 骨盆倾斜角度 (左右高度差) |
| **手臂伸展** | 11/12, 13/14, 15/16 | 肩-肘-腕夹角 |
| **站位宽度** | 27, 28 | 左右脚踝水平距离 |
| **重心转移** | 23, 24, 27, 28 | 髋部中点相对于双脚中点的偏移 |
| **膝盖弯曲** | 23/24, 25/26, 27/28 | 髋-膝-踝夹角 |

基于原始 33 关键点坐标，可计算以下高尔夫挥杆指标：

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

**可计算指标**:

- X-Factor, X-Factor Stretch
- S-Factor, O-Factor
- 骨盆/躯干转角
- 侧移/前推/抬升 (Sway/Thrust/Lift)
- 节奏比 (低精度)

---

### 3.2 IMU 数据处理 {#32-imu-数据处理-lsm6dsv16x--1666hz}

#### 3.2.1 原始数据 {#321-imu-原始数据}

IMU (惯性测量单元) 每次采样输出 **6 个数值**，来自两个传感器：

```text
┌────────────────────────────────────────────────────────────────┐
│                    IMU 6 轴数据结构                              │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   加速度计 (Accelerometer) — 3 轴                                │
│   ├── accel_x: 左右方向的线性加速度 (m/s²)                         │
│   ├── accel_y: 上下方向的线性加速度 (m/s²)                         │
│   └── accel_z: 前后方向的线性加速度 (m/s²)                         │
│                                                                 │
│   陀螺仪 (Gyroscope) — 3 轴                                      │
│   ├── gyro_x: 绕 X 轴旋转的角速度 (°/s) — 俯仰 (Pitch)             │
│   ├── gyro_y: 绕 Y 轴旋转的角速度 (°/s) — 偏航 (Yaw)               │
│   └── gyro_z: 绕 Z 轴旋转的角速度 (°/s) — 翻滚 (Roll)              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**坐标系定义**:

```text
IMU 坐标系 (右手系):

                Y (上)
                    │
                    │   gyro_y: 偏航 (左右转头)
                    │   ↻
                    │
        ────────────┼────────────→ X (右)
                   ╱│
                  ╱ │
                 ╱  │
                ╱   │
               Z (前)

  gyro_x: 俯仰 (点头)    gyro_z: 滚转 (侧身)
```

**原点与零点说明**:

| 数据类型 | 原点 (0 值) | 说明 |
|---------|------------|------|
| **accel_x/y/z** | 传感器静止时 | [静止时只有重力加速度 (accel_y ≈ 9.8 m/s²)](../../reference/engineering-glossary.md#11-加速度计-accelerometer) |
| **gyro_x/y/z** | 无旋转时 | 传感器不转动时，三轴角速度均为 0°/s |

!!! info "什么时候数值为 0？"
    - **加速度计**: 自由落体时 accel ≈ 0（无重力感应）；静止时 accel_y ≈ 9.8
    - **陀螺仪**: 传感器完全静止（不旋转）时，gyro_x = gyro_y = gyro_z = 0°/s
    - **挥杆顶点**: gyro_z 从正值变为负值，瞬间经过 0 = 方向切换点

```text
IMU 贴于手腕背侧在高尔夫挥杆中的应用:

        手腕背侧 IMU 位置
              ↓
    ┌─────────────────┐
    │     前臂         │
    │                 │
    └────────┬────────┘
             │
    ┌────────┼────────┐
    │   [IMU 传感器]   │  ← 手腕背侧
    └────────┼────────┘
             │
        ┌────┴────┐
        │  手掌    │
        └─────────┘


| 轴 | 加速度计 (accel) | 陀螺仪 (gyro) |
|:--:|-----------------|---------------|
| **X** | 手臂左右摆动 | 手腕上下翻转 (俯仰) |
| **Y** | 手臂上下抬起 | 手臂旋转 (内旋/外旋) |
| **Z** | 手臂前后伸展 | 手腕左右旋转 (尺偏/桡偏) |

| 挥杆阶段 | 关键 IMU 轴 | 测量内容 |
|---------|------------|---------|
| **上杆** | gyro_z | 手腕外旋角速度 |
| **顶点** | gyro_z → 0 | 角速度归零 = 方向切换 |
| **下杆** | gyro_z (负值) | 手腕快速内旋 |
| **击球** | gyro_z 峰值 | 峰值角速度 (1000-1500°/s) |
| **髋部旋转** | gyro_y (骨盆 IMU) | 髋部旋转速度 (Phase 2) |

!!! tip "为什么传感器贴在手腕背侧?"
    手腕背侧是高尔夫挥杆分析的**战略要地**，原因有二：

    **1. 动力链末端效应**

    ```text
    地面 → 腿部 → 髋部 → 躯干 → 肩部 → 手臂 → 手腕 → 球杆
      ↑                                           ↑
    能量起点                                    能量终点
    (大质量、慢速度)                           (小质量、快速度)
    ```

    根据动量守恒，能量在动力链中层层放大，手腕作为末端达到**最大角速度**（鞭打效应）。
    如果上游动作正确，手腕 gyro_z 会达到 1200-1500°/s；反之则会明显偏低。

    **2. 一石二鸟的测量位置**

    | gyro 轴 | 测量的动作 | 涉及的身体段 |
    |---------|-----------|-------------|
    | gyro_x | 手腕俯仰（上翻/下扣） | 手腕关节 |
    | gyro_y | 前臂旋转（内旋/外旋） | 前臂 + 手腕 |
    | gyro_z | 手腕翻滚（释放动作） | 手腕 + 间接反映整条手臂 |

    手腕背侧既能测到**手腕本身的精细动作**，又能通过 gyro_y 感知**前臂的旋转**。
    
!!! tip "为什么 gyro_z 最重要?"
    在高尔夫挥杆中，**gyro_z** (手腕的翻滚/旋转) 是最关键的指标：

    - 职业球手击球时 gyro_z 可达 **1200-1500°/s**
    - 业余球手通常只有 **600-800°/s**
    - gyro_z 与杆头速度高度相关 (r > 0.85)

```

---

#### 3.2.2 计算指标 {#322-imu-计算指标}

基于原始 6 轴数据，可计算以下高尔夫挥杆指标：

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

**可计算指标**:

- 峰值角速度
- 节奏比 (高精度)
- 运动链时序 (<10ms 精度)
- 加速度峰值

---

### 3.3 EMG 数据处理 {#33-emg-数据处理-unique-capability}

!!! info "信号处理基础知识"
    理解 EMG 检测算法前，请先阅读:

    - [信号处理入门](../../prerequisites/foundations/signal-processing-101.md) — 基线、激活检测、消抖的基础概念
    - 关键术语: Baseline (基线)、Onset Detection (激活检测)、Debounce (消抖)

#### 3.3.1 原始数据 {#331-emg-原始数据}

EMG (肌电传感器) 测量的是**肌肉收缩时产生的电信号**：

```text
┌─────────────────────────────────────────────────────────────────┐
│                    EMG 单通道数据结构                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   raw_mV: 原始电压信号 (毫伏, mV)                                   │
│           典型范围: -5mV ~ +5mV (皮肤表面 sEMG)                     │
│                                                                  │
│   envelope_mV: 包络信号 (经过滤波和整流)                             │
│                典型范围: 0 ~ 2mV                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Raw Data 详解** (硬件层):

MyoWare 2.0 + ESP32 ADC 输出的原始数据是 **12-bit 整数值 (0-4095)**：

```text
┌─────────────────────────────────────────────────────────────────┐
│                    EMG Raw Data 信号链                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   肌肉电信号        MyoWare 2.0 放大器         ESP32 ADC           │
│   ───────────  →   ─────────────────────  →   ──────────        │
│   ±5 μV ~ ±5 mV    增益 ≈1000x → 0-3.3V       0-4095 (12-bit)    │
│                                                                 │
│   皮肤表面          模拟电压输出 (ENV pin)      数字值              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| 数据层级 | 变量名 | 范围 | 单位 | 说明 |
|---------|-------|------|------|------|
| **ADC 原始值** | `adc_value` | 0 - 4095 | 无 | ESP32 12-bit ADC 直接读取 |
| **电压值** | `voltage` | 0 - 3.3 | V | `adc_value × 3.3 / 4095` |
| **包络电压** | `envelope_mV` | 0 - 2000 | mV | MyoWare ENV 输出 (已整流) |
| **归一化激活** | `activation_%` | 0 - 100 | % | 相对 MVC 的百分比 |

**ADC 原始值参考**:

```text
ADC Value vs 肌肉状态:

4095 ─┬─────────────────────────────────── 传感器饱和 (故障)
      │
3000 ─┼─────────────────────────── 最大自主收缩 (MVC)
      │                           击球瞬间峰值
2000 ─┼─────────────────── 强激活 (下杆发力)
      │
1000 ─┼───────────── 中度激活 (蓄力)
      │
 500 ─┼──────── 轻度激活 (上杆)
      │
 300 ─┼───── 静息基线 + 噪声
      │
 100 ─┼── 理想静息 (罕见)
      │
   0 ─┴─ 信号丢失 / 电极脱落
```

| ADC 范围 | 状态 | 说明 |
|---------|------|------|
| 0 - 50 | ⚠️ 异常 | 电极可能脱落 |
| 100 - 300 | 静息 | 肌肉放松，基线噪声 |
| 300 - 800 | 轻度激活 | 低强度肌肉收缩 |
| 800 - 1500 | 中度激活 | 挥杆蓄力阶段 |
| 1500 - 2500 | 强激活 | 下杆发力阶段 |
| 2500 - 3500 | 最大激活 | 击球瞬间 |
| > 3800 | ⚠️ 饱和 | 增益过高或运动伪影 |

**Raw EMG 波形特征**:

```text
静息状态 (放松):                    激活状态 (收缩):

     ↑ mV                               ↑ mV
 +0.1┤   ~  ~  ~  ~  ~  ~           +2.0┤    ∧    ∧
     │  ~  ~  ~  ~  ~  ~                │   /\  /\  /\
  0  ├─────────────────── t            0├─/──\/──\/──\─ t
     │  ~  ~  ~  ~  ~  ~                │\/          \/
 -0.1┤   ~  ~  ~  ~  ~  ~           -2.0┤    ∨    ∨
     ↓                                  ↓

特征:                               特征:
- 幅度小 (±0.1mV)                   - 幅度大 (±2mV+)
- 随机噪声                          - 高频震荡
- 无规律                            - 频率 20-150Hz
```

!!! tip "为什么用 ADC 值而不是 mV？"
    - **简化计算**: 省略 ADC→电压→mV 的转换
    - **整数运算**: MCU 上整数运算更快
    - **相对比较**: 检测激活只需比较阈值，不需要绝对物理单位
    - **校准补偿**: 每次使用时重新校准基线，消除绝对值误差

**系统设计: 2 通道 EMG** (见 [系统设计](./system-design.md))

```text
┌─────────────────────────────────────────────────────────────────┐
│              Movement Chain AI EMG 通道配置                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   通道 1: Core (核心肌群)                                         │
│   ├── 位置: 腹斜肌 (External Oblique)                             │
│   ├── 作用: 检测躯干旋转发力                                        │
│   └── 硬件: MyoWare 2.0 × 1                                      │
│                                                                 │
│   通道 2: Forearm (前臂)                                          │
│   ├── 位置: 腕屈肌 (Flexor Carpi)                                 │
│   ├── 作用: 检测手腕释放时机                                        │
│   └── 硬件: MyoWare 2.0 × 1                                       │
│                                                                  │
│   核心检测: Core 激活时间 vs Forearm 激活时间                        │
│            → 时间差 > 20ms = 正确运动链                             │
│            → 时间差 < 0ms = "用手打" (倒序运动链)                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

| 阶段 | 通道数 | 肌肉位置 | 用途 |
|:----:|:------:|---------|------|
| **MVP** | 2 | Core + Forearm | 验证核心运动链时序 |
| Phase 2 | 4 | + Gluteus, Adductors | 下肢发力分析 |
| Phase 3 | 6 | + Lats, Deltoids | 全身运动链 |

> 详见 [§3.3.3 传感器布局规划](#333-emg-传感器布局规划)

**信号处理流程**:

```text
原始 EMG 信号 → 带通滤波 → 整流 (取绝对值) → 包络提取 → 归一化
     ↓              ↓           ↓              ↓           ↓
  杂乱波形      去除噪声     全部为正      平滑曲线    0-100%
```

**原点与零点说明**:

| 数据类型 | 零值含义 | 说明 |
|---------|---------|------|
| **raw_mV** | 肌肉完全放松 | 静息时信号接近 0，但有噪声 (±0.05mV) |
| **envelope_mV** | 无激活 | 经过处理后，0 = 肌肉未收缩 |
| **activation_%** | 无激活 | 归一化后，0% = 静息，100% = 最大自主收缩 |

!!! info "什么时候数值为 0？"
    - **完全放松**: 肌肉不收缩时，EMG 信号接近 0
    - **实际情况**: 由于噪声，静息时通常有 0.02-0.1mV 的基线噪声
    - **阈值判断**: 激活 = 信号 > 基线 + 2×标准差

**信号幅度参考**:

| 激活状态 | envelope_mV | activation_% | 挥杆中的例子 |
|---------|-------------|--------------|-------------|
| **静息** | 0 ~ 0.1 | 0 ~ 5% | 站立准备 (Address) |
| **轻度激活** | 0.1 ~ 0.3 | 5 ~ 20% | 上杆初期 |
| **中度激活** | 0.3 ~ 0.8 | 20 ~ 50% | 上杆顶点蓄力 |
| **强激活** | 0.8 ~ 1.5 | 50 ~ 80% | 下杆发力 |
| **最大激活** | 1.5 ~ 2.0+ | 80 ~ 100% | 击球瞬间 |

**高尔夫挥杆中的应用**:

| 肌肉 | 测量内容 | 正常模式 | 异常模式 |
|------|---------|---------|---------|
| **核心 (Core)** | 腹斜肌激活 | 下杆前 30ms 先激活 | 激活晚或不激活 |
| **前臂 (Forearm)** | 腕屈肌激活 | 核心激活后 20ms+ | 先于核心激活 = "用手打" |

```text
正确的运动链时序:

Core EMG:    ____/‾‾‾‾‾‾‾‾‾‾\____    ← 先激活 (t=570ms)
                  ↓
Forearm EMG: _________/‾‾‾‾‾‾\___    ← 后激活 (t=720ms)
                      ↓
             |--------|--------|
             Top    Impact
             (600ms) (850ms)

时间差 = 720 - 570 = 150ms > 20ms ✅ 正确
```

---

#### 3.3.2 计算指标  {#332-emg-计算指标}

基于原始 EMG 信号，可计算以下单通道指标：

```python
# 肌肉激活时序检测
def detect_muscle_onset(emg_signal, timestamps, threshold=0.5):
    """
    检测肌肉激活起始时间 (Onset Detection)

    ⚠️ 前置知识: 理解本算法需要先阅读 signal-processing-101.md
       - 基线 (Baseline): EMG 静息时不是 0，需要先计算基线
       - 阈值方法: SD 法 (2-3 倍标准差) 或 %MVC 法

    Args:
        emg_signal: EMG 信号 (mV), 已经过滤波和包络提取
        timestamps: 时间戳 (ms)
        threshold: 激活阈值 (mV 或归一化值)
                   - 简化实现: 固定阈值 0.5
                   - 推荐实现: baseline_mean + 2*baseline_sd

    Returns:
        onset_time: 激活起始时间 (ms)
        onset_intensity: 激活峰值强度 (mV)

    实现改进方向:
        1. 添加基线窗口计算 (baseline_window_ms: 200-500ms)
        2. 使用 SD 法阈值 (onset_threshold_sd: 2-3)
        3. 添加消抖逻辑 (debounce_ms: 10-20ms)
        详见: signal-processing-101.md §3-§5
    """
    # 寻找信号超过阈值的首次时刻
    onset_idx = np.where(emg_signal > threshold)[0]

    if len(onset_idx) == 0:
        return None, None  # 未检测到激活

    onset_time = timestamps[onset_idx[0]]
    onset_intensity = np.max(emg_signal[onset_idx])

    return onset_time, onset_intensity
```

**单传感器可计算指标**:

- 单通道激活时刻 (onset_time)
- 单通道激活强度 (onset_intensity)
- 包络信号 (envelope_mV)
- 归一化激活百分比 (activation_%)

!!! note "多传感器融合分析"
    以下功能需要**时间对齐后的多传感器数据**，详见 [§4 多传感器融合分析](#4-多传感器融合分析-sensor-fusion-analysis)：

    - 运动链序列验证 (Core vs Forearm 时序)
    - 力链传递验证 (多肌群激活顺序)
    - 疲劳检测 (跨挥杆对比)

---

#### 3.3.3 传感器布局规划 {#333-emg-传感器布局规划}

##### 关键肌群图 Key Muscle Groups

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GOLF SWING EMG SENSOR MAP                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        ┌─────────────┐                                      │
│                        │   背阔肌     │ ← Phase 3: 肩部旋转、拉杆动作           │
│                        │    Lats     │   (Latissimus Dorsi)                 │
│                        └──────┬──────┘                                      │
│                               │                                             │
│                        ┌──────┴──────┐                                      │
│                        │    核心      │ ← Phase 1: 躯干旋转、力量传递中枢 ⭐    │
│                        │    Core     │   (Obliques 腹斜肌)                   │
│                        └──────┬──────┘                                      │
│                               │                                             │
│                        ┌──────┴──────┐                                      │
│                        │    臀肌      │ ← Phase 2: 下杆启动、髋部旋转           │
│                        │   Glutes    │   (Gluteus Maximus 臀大肌)            │
│                        └──────┬──────┘                                      │
│                               │                                             │
│   ┌───────────────────┐       │       ┌───────────────────┐                 │
│   │   三角肌 Deltoids  │       │       │   前臂 Forearm     │                 │
│   │   Phase 3         │       │       │   Phase 1 ⭐      │                 │
│   └───────────────────┘       │       │   (Wrist Flexors) │                 │
│                               │       └───────────────────┘                 │
│                        ┌──────┴──────┐                                      │
│                        │  大腿内侧    │ ← Phase 2: 下盘稳定、重心转移           │
│                        │  Adductors  │                                      │
│                        └─────────────┘                                      │
│                                                                             │
│   运动链传递顺序 Kinematic Chain:                                             │
│   Glutes → Core → Lats → Forearm                                            │
│   (臀肌 → 核心 → 背阔肌 → 前臂)                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

##### 分阶段部署计划 Phased Deployment

| Phase | 肌群 | 英文名 | 检测目标 | 传感器数 |
|:-----:|------|--------|----------|:--------:|
| **1 (MVP)** | 核心/腹斜肌 | Core/Obliques | 躯干旋转发力、运动链中枢 | 1 |
| **1 (MVP)** | 前臂屈肌 | Forearm Flexors | 手腕释放时机、握杆力度 | 1 |
| **2** | 臀大肌 | Gluteus Maximus | 下杆启动、髋部旋转 | 1 |
| **2** | 大腿内侧 | Adductors | 下盘稳定、重心转移 | 1 |
| **3** | 背阔肌 | Latissimus Dorsi | 肩部旋转、拉杆动作 | 1 |
| **3** | 三角肌 | Deltoids | 手臂举起、顶点位置 | 1 |

> 详见：[sEMG 技术研究综述 §5 高尔夫生物力学实战](../../reference/semg-research-2024-2025.md#semg_1) — 肌肉选择、传感器放置、实验室 SOP

**传感器数量规划**:

- Phase 1 (MVP): **2 通道** — 最小可行，验证核心价值
- Phase 2: **4 通道** — 完整下半身运动链
- Phase 3: **6 通道** — 全身运动链分析

##### 选择依据 Selection Rationale

| 研究来源 | 发现 | 对选型的影响 |
|---------|------|-------------|
| **Cheetham (2008)** | 运动链时序: 骨盆 → 躯干 → 手臂，职业选手间隔更稳定 | Core + Forearm 可检测最关键的"躯干→手臂"时序 |
| **Meister (2011)** | 核心激活与杆头速度相关性 r=0.89 | Core 是必选传感器 |
| **TPI 研究** | 臀肌激活不足 → 早伸 (Early Extension) | Phase 2 加入 Gluteus |
| **PMC4851105** | 8通道EMG分析发现"雪崩效应" | 全通道分析需要 Phase 3 |

##### MVP 检测能力

仅用 **2 个 EMG 传感器 (Core + Forearm)** 即可检测:

| 检测能力 | 方法 | 阈值 |
|---------|------|------|
| **倒序运动链** | Core onset vs Forearm onset | 时间差 < 0ms = 错误 |
| **过度手臂挥杆** | Forearm RMS / Core RMS | 比值 > 1.3 = 问题 |
| **核心激活不足** | Core RMS / MVC% | < 50% MVC = 不足 |
| **疲劳检测** | 峰值幅度衰减趋势 | 下降 > 30% = 疲劳 |

##### Mock 数据结构

MVP 阶段使用 Mock 数据时，建议预留 **4 通道** 数据结构，便于后续扩展:

```python
# Mock EMG 数据结构 (为 Phase 2 预留)
mock_emg = {
    # Phase 1 (MVP) - 必须实现
    "core_obliques": {
        "signal": [...],           # 1000Hz 采样 (MyoWare 2.0 推荐配置)
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

## 4. 多传感器融合分析 {#4-多传感器融合分析-sensor-fusion-analysis}

!!! info "本章节内容"
    本章节描述**时间对齐后**的多传感器融合分析，包括：

    - 融合策略与流程
    - 融合后的独特检测能力

---

### 4.1 独特检测能力总结

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

### 4.2 系统融合策略

三模态传感器的数据融合策略如下:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SENSOR FUSION PIPELINE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Phase 1: 单模态特征提取                                                     │
│   ├── Vision (30fps): 提取 33 关键点 → 计算 X-Factor, S-Factor, Sway/Lift      │
│   ├── IMU (1666Hz): 提取角速度/加速度 → 计算峰值速度, 节奏比                      │
│   └── EMG (1000Hz): 提取激活时序 → 计算肌肉启动时间, 激活强度                      │
│                                                                              │
│   Phase 2: 时间对齐 (Sensor Hub 架构)                                          │
│   ├── Sensor Hub: 同部位 IMU/EMG 共享 ESP32 时钟 (硬件级微秒同步)                │
│   ├── 以 IMU 为基准时钟 (最高采样率)                                            │
│   ├── Vision 帧插值到 1666Hz (线性插值)                                        │
│   ├── EMG 重采样到 1666Hz (降采样)                                             │
│   └── 跨设备对齐: 使用 Impact 时刻作为同步锚点                                    │
│                                                                              │
│   Phase 3: 特征融合                                                           │
│   ├── 运动链时序 = IMU (身体启动) + EMG (肌肉启动) 双重验证                       │
│   ├── X-Factor Stretch = Vision (角度差) + EMG (核心激活) 相关性分析             │
│   └── 力链验证 = Vision (姿态) + IMU (速度) + EMG (激活序列) 三重验证             │
│                                                                              │
│   Phase 4: 异常检测                                                           │
│   ├── 如果 EMG 显示核心未激活，但 IMU 显示高速转体 → 警告"代偿动作"                 │
│   ├── 如果 Vision 显示 X-Factor 正常，但 EMG 显示激活序列错误 → 警告"假性蓄力"      │
│   └── 如果 EMG 显示疲劳，但用户继续练习 → 建议"休息以防受伤"                        │
└─────────────────────────────────────────────────────────────────────────────┘

!!! tip "时间对齐实现"
    Phase 2 时间对齐的具体实现方案（NTP 预同步 + Impact 验证）详见
    [模块化架构 §2.2.3](modular-architecture.md#223-时间同步实现方案)。
```

**融合优势**:

- **互补性**: Vision 看不到的 (肌肉激活)，EMG 可以测
- **冗余性**: 运动链时序可用 IMU + EMG 双重验证，提高准确性
- **因果性**: Vision/IMU 提供"现象"，EMG 提供"原因"

---

### 4.3 EMG 多通道时序分析 {#43-emg-多通道时序分析}

以下算法分析多个 EMG 通道之间的时序关系和激活模式：

```python
# 运动链序列验证 (UNIQUE)
def validate_kinematic_sequence(emg_core, emg_forearm, timestamps, threshold=0.5):
    """
    验证核心肌群是否先于手臂激活 (正确的运动链序列)

    ⚠️ 关键参数: 同时激活容差 (Co-activation Tolerance)
       - 如果 |time_diff| < 5ms，视为"同时激活"
       - 这是因为 EMG 采样精度限制 (1000Hz = 1ms)
       - 详见: signal-processing-101.md §3.2

    Args:
        emg_core: 核心肌群 EMG 信号 (腹斜肌或竖脊肌)
        emg_forearm: 前臂 EMG 信号 (桡侧腕屈肌或尺侧腕屈肌)
        timestamps: 时间戳 (ms)
        threshold: 激活阈值

    Returns:
        sequence_correct: True=核心先激活, False=手臂先激活
        time_diff: 激活时间差 (ms, 正值=核心先激活)
                   ±5ms 范围内视为同时激活
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

**可计算指标 (竞品无法实现)**:

- 肌肉激活时序 (<5ms 精度)
- 肌肉激活强度 (mV 信号幅值)
- 运动链序列验证 (核心 → 手臂的顺序)
- 疲劳检测 (激活强度衰减)
- 力链传递验证 (下肢 → 核心 → 躯干 → 手臂)


---

### 4.4 融合置信度计算 {#44-融合置信度计算-fusion-confidence}

三模态融合提升置信度的核心算法:

```python
def calculate_fusion_confidence(
    vision_phase: str,
    imu_phase: str,
    emg_sequence_correct: Optional[bool]
) -> float:
    """
    融合置信度计算

    基准: 0.5 (单传感器)
    双重验证一致: +0.25
    三重验证一致: +0.25
    传感器矛盾: -0.15
    """
    confidence = 0.5  # baseline

    # 双重验证: Vision 和 IMU 一致
    if vision_phase == imu_phase:
        confidence += 0.25  # 提升 25%
    else:
        confidence -= 0.15  # 降低 15%, 需要人工检查

    # 三重验证: EMG 序列正确
    if emg_sequence_correct is True:
        confidence += 0.25  # 提升 25%
    elif emg_sequence_correct is None:
        confidence += 0.0   # 无 EMG 数据, 保持
    else:
        confidence -= 0.10  # EMG 显示异常, 略微降低

    return min(max(confidence, 0.0), 1.0)  # clamp to [0, 1]

# 示例:
# Vision=Top, IMU=Top, EMG=Correct → confidence = 1.0 (最高)
# Vision=Top, IMU=Top, EMG=None    → confidence = 0.75
# Vision=Top, IMU=Mid, EMG=None    → confidence = 0.35 (需检查)
```

---

### 4.5 融合诊断算法 {#45-融合诊断算法-fusion-diagnostic-algorithms}

FUSION Block 的核心价值在于**诊断算法** — 这些算法只有三模态融合才能实现。

#### 4.5.1 基础数据结构

```python
from dataclasses import dataclass
from typing import Optional, List, Tuple
from enum import Enum

class DiagnosticSeverity(Enum):
    """诊断严重程度"""
    P0_CRITICAL = "P0"   # 必须修正，影响挥杆效果
    P1_IMPORTANT = "P1"  # 建议修正，影响一致性
    P2_MINOR = "P2"      # 可选优化
    INFO = "INFO"        # 仅供参考


@dataclass
class DiagnosticResult:
    """诊断结果"""
    rule_id: str
    severity: DiagnosticSeverity
    triggered: bool
    message_cn: str
    message_en: str
    confidence: float
    evidence: dict  # 支持诊断的数据点
```

#### 4.5.2 算法 1: 运动链序列验证

```python
def validate_kinematic_sequence(
    imu_body_rotation_onset_ms: int,
    emg_core_onset_ms: int,
    emg_forearm_onset_ms: int,
    threshold_core_lead_ms: int = 20
) -> DiagnosticResult:
    """
    运动链序列验证

    生物力学原理:
    ──────────────
    正确的力量传递序列: Ground → Core → Torso → Arms → Club

    验证规则:
    ──────────────
    1. Core (核心肌群) 应在身体旋转前 10-30ms 激活
    2. Core 应在 Forearm (前臂) 之前至少 20ms 激活
    3. 如果 Forearm 先于 Core → "用手打球" 错误

    参数:
    ──────────────
    imu_body_rotation_onset_ms: IMU 检测到的身体旋转开始时间
    emg_core_onset_ms: EMG 检测到的核心激活时间
    emg_forearm_onset_ms: EMG 检测到的前臂激活时间
    threshold_core_lead_ms: 核心应领先的最小毫秒数 (默认 20ms)

    返回:
    ──────────────
    DiagnosticResult: 包含诊断结果和反馈信息
    """
    # 计算时序差
    core_to_body_gap = imu_body_rotation_onset_ms - emg_core_onset_ms
    core_to_forearm_gap = emg_forearm_onset_ms - emg_core_onset_ms

    evidence = {
        "core_onset_ms": emg_core_onset_ms,
        "forearm_onset_ms": emg_forearm_onset_ms,
        "body_rotation_onset_ms": imu_body_rotation_onset_ms,
        "core_to_body_gap_ms": core_to_body_gap,
        "core_to_forearm_gap_ms": core_to_forearm_gap
    }

    # 诊断逻辑
    if core_to_forearm_gap < 0:
        # 错误: 前臂先于核心
        return DiagnosticResult(
            rule_id="ARMS_BEFORE_CORE",
            severity=DiagnosticSeverity.P0_CRITICAL,
            triggered=True,
            message_cn="让身体带动，别用手打。前臂比核心早激活了 {}ms。".format(abs(core_to_forearm_gap)),
            message_en="Let your body lead, don't swing with your arms. "
                       "Forearm activated {}ms before core.".format(abs(core_to_forearm_gap)),
            confidence=0.9,
            evidence=evidence
        )

    elif core_to_forearm_gap < threshold_core_lead_ms:
        # 警告: 核心领先不足
        return DiagnosticResult(
            rule_id="WEAK_CORE_LEAD",
            severity=DiagnosticSeverity.P1_IMPORTANT,
            triggered=True,
            message_cn="核心启动稍慢，尝试在下杆前更早收紧腹肌。",
            message_en="Core activation is slightly delayed. "
                       "Try engaging your abs earlier before the downswing.",
            confidence=0.7,
            evidence=evidence
        )

    else:
        # 正确: 运动链序列正确
        return DiagnosticResult(
            rule_id="KINEMATIC_SEQUENCE_OK",
            severity=DiagnosticSeverity.INFO,
            triggered=False,
            message_cn="运动链序列正确 ✓",
            message_en="Kinematic sequence is correct ✓",
            confidence=0.95,
            evidence=evidence
        )
```

#### 4.5.3 算法 2: 假性蓄力检测

```python
def detect_false_coil(
    vision_x_factor_degrees: float,
    emg_core_activation_pct: float,
    x_factor_threshold: float = 35.0,
    core_activation_threshold: float = 0.5
) -> DiagnosticResult:
    """
    假性蓄力检测 — 只有三模态能检测的问题!

    什么是假性蓄力 (False Coil)?
    ────────────────────────────
    球员"装"出了正确的 X-Factor 角度，但核心肌群没有真正参与。
    这导致:
    - 看起来转够了，但没有真正蓄力
    - 力量不是从核心传递出去
    - 击球距离和一致性下降

    为什么只有三模态能检测?
    ────────────────────────────
    - Vision 看到: X-Factor = 45° ✅ (看起来正常)
    - IMU 看到: 正常旋转时序 ✅ (时间正确)
    - EMG 看到: Core activation = 30% ❌ (核心没发力!)

    Vision-only 系统会说: "你的挥杆看起来不错"
    我们的系统会说: "你的转肩看起来够了，但核心没发力"

    参数:
    ──────────────
    vision_x_factor_degrees: Vision 测量的 X-Factor 角度
    emg_core_activation_pct: EMG 测量的核心激活百分比 [0-1]
    x_factor_threshold: X-Factor 正常阈值 (默认 35°)
    core_activation_threshold: 核心激活正常阈值 (默认 50%)

    返回:
    ──────────────
    DiagnosticResult: 包含诊断结果和反馈信息
    """
    evidence = {
        "x_factor_degrees": vision_x_factor_degrees,
        "core_activation_pct": emg_core_activation_pct,
        "x_factor_threshold": x_factor_threshold,
        "core_threshold": core_activation_threshold
    }

    # 假性蓄力条件: X-Factor 正常 + 核心激活不足
    x_factor_looks_ok = vision_x_factor_degrees >= x_factor_threshold
    core_not_engaged = emg_core_activation_pct < core_activation_threshold

    if x_factor_looks_ok and core_not_engaged:
        # 检测到假性蓄力!
        return DiagnosticResult(
            rule_id="FALSE_COIL",
            severity=DiagnosticSeverity.P0_CRITICAL,
            triggered=True,
            message_cn="看起来转够了 ({:.0f}°)，但核心只有 {:.0f}% 激活。"
                       "专注于收紧腹肌再下杆，让核心真正参与蓄力。".format(
                           vision_x_factor_degrees,
                           emg_core_activation_pct * 100
                       ),
            message_en="Your turn looks good ({:.0f}°) but core is only at {:.0f}% activation. "
                       "Focus on tightening your abs before starting the downswing.".format(
                           vision_x_factor_degrees,
                           emg_core_activation_pct * 100
                       ),
            confidence=0.95,
            evidence=evidence
        )

    elif not x_factor_looks_ok:
        # X-Factor 本身就不足，不是假性蓄力问题
        return DiagnosticResult(
            rule_id="LOW_X_FACTOR",
            severity=DiagnosticSeverity.P1_IMPORTANT,
            triggered=True,
            message_cn="肩膀多转一点，X-Factor 只有 {:.0f}° (建议 >35°)。".format(vision_x_factor_degrees),
            message_en="Turn your shoulders more. X-Factor is only {:.0f}° (target >35°).".format(
                vision_x_factor_degrees
            ),
            confidence=0.85,
            evidence=evidence
        )

    else:
        # 正常: X-Factor 足够，核心参与
        return DiagnosticResult(
            rule_id="COIL_OK",
            severity=DiagnosticSeverity.INFO,
            triggered=False,
            message_cn="蓄力正常 ✓ X-Factor {:.0f}°, 核心激活 {:.0f}%".format(
                vision_x_factor_degrees, emg_core_activation_pct * 100
            ),
            message_en="Coil looks good ✓ X-Factor {:.0f}°, core at {:.0f}%".format(
                vision_x_factor_degrees, emg_core_activation_pct * 100
            ),
            confidence=0.9,
            evidence=evidence
        )
```

#### 4.5.4 算法 3: 力链三重验证

```python
def verify_force_chain(
    vision_phase: str,
    imu_phase: str,
    emg_sequence_correct: bool,
    imu_peak_velocity_dps: float,
    emg_core_activation_pct: float
) -> Tuple[float, List[DiagnosticResult]]:
    """
    力链三重验证 — 融合置信度计算 + 异常检测

    验证逻辑:
    ──────────────
    1. Vision-IMU 交叉验证: 阶段检测一致性
    2. EMG 因果验证: 肌肉激活序列正确性
    3. 物理一致性: 高速度应伴随高激活

    参数:
    ──────────────
    vision_phase: Vision 检测的当前阶段
    imu_phase: IMU 检测的当前阶段
    emg_sequence_correct: EMG 显示运动链序列是否正确
    imu_peak_velocity_dps: IMU 峰值角速度 (°/s)
    emg_core_activation_pct: EMG 核心激活百分比 [0-1]

    返回:
    ──────────────
    Tuple[float, List[DiagnosticResult]]:
        - 融合置信度 [0-1]
        - 诊断结果列表
    """
    diagnostics = []
    confidence = 0.5  # 基准置信度

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 验证 1: Vision-IMU 阶段一致性
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    if vision_phase == imu_phase:
        confidence += 0.25  # 双重验证一致
        diagnostics.append(DiagnosticResult(
            rule_id="PHASE_CROSS_VALIDATION_OK",
            severity=DiagnosticSeverity.INFO,
            triggered=False,
            message_cn=f"阶段检测一致: Vision={vision_phase}, IMU={imu_phase} ✓",
            message_en=f"Phase detection consistent: Vision={vision_phase}, IMU={imu_phase} ✓",
            confidence=0.95,
            evidence={"vision_phase": vision_phase, "imu_phase": imu_phase}
        ))
    else:
        confidence -= 0.15  # 不一致，降低置信度
        diagnostics.append(DiagnosticResult(
            rule_id="PHASE_MISMATCH",
            severity=DiagnosticSeverity.P2_MINOR,
            triggered=True,
            message_cn=f"阶段检测不一致: Vision={vision_phase}, IMU={imu_phase}。"
                       f"使用 IMU 结果 (更精确)。",
            message_en=f"Phase detection mismatch: Vision={vision_phase}, IMU={imu_phase}. "
                       f"Using IMU (more precise).",
            confidence=0.6,
            evidence={"vision_phase": vision_phase, "imu_phase": imu_phase}
        ))

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 验证 2: EMG 运动链序列
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    if emg_sequence_correct:
        confidence += 0.25  # 三重验证一致
    else:
        confidence -= 0.10  # EMG 异常

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 验证 3: 物理一致性 (高速度 + 低激活 = 代偿)
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    HIGH_VELOCITY_THRESHOLD = 800  # °/s
    MIN_CORE_FOR_HIGH_VELOCITY = 0.6

    if imu_peak_velocity_dps > HIGH_VELOCITY_THRESHOLD:
        if emg_core_activation_pct < MIN_CORE_FOR_HIGH_VELOCITY:
            # 异常: 高速度但核心激活不足 → 代偿动作
            diagnostics.append(DiagnosticResult(
                rule_id="COMPENSATION_DETECTED",
                severity=DiagnosticSeverity.P0_CRITICAL,
                triggered=True,
                message_cn="速度来自手臂，缺乏核心力量。峰值速度 {:.0f}°/s 但核心只有 {:.0f}%。"
                           "让身体带动，不要靠手打。".format(
                               imu_peak_velocity_dps, emg_core_activation_pct * 100
                           ),
                message_en="Speed is coming from arms, lacking core power. "
                           "Peak velocity {:.0f}°/s but core at only {:.0f}%. "
                           "Let your body lead.".format(
                               imu_peak_velocity_dps, emg_core_activation_pct * 100
                           ),
                confidence=0.85,
                evidence={
                    "peak_velocity_dps": imu_peak_velocity_dps,
                    "core_activation_pct": emg_core_activation_pct
                }
            ))
            confidence -= 0.10  # 代偿动作降低整体置信度

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 最终置信度 (clamp to [0, 1])
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    final_confidence = max(0.0, min(1.0, confidence))

    return final_confidence, diagnostics
```

#### 4.5.5 完整融合流程

```python
def run_fusion_diagnostics(
    vision_data: dict,
    imu_data: dict,
    emg_data: dict
) -> dict:
    """
    运行完整的融合诊断流程

    参数:
    ──────────────
    vision_data: {"phase": str, "x_factor": float, ...}
    imu_data: {"phase": str, "peak_velocity_dps": float, "body_rotation_onset_ms": int}
    emg_data: {"core_onset_ms": int, "forearm_onset_ms": int, "core_activation_pct": float}

    返回:
    ──────────────
    dict: {
        "overall_confidence": float,
        "diagnostics": List[DiagnosticResult],
        "primary_feedback": str
    }
    """
    all_diagnostics = []

    # 1. 运动链序列验证
    kinematic_result = validate_kinematic_sequence(
        imu_body_rotation_onset_ms=imu_data.get("body_rotation_onset_ms", 700),
        emg_core_onset_ms=emg_data.get("core_onset_ms", 570),
        emg_forearm_onset_ms=emg_data.get("forearm_onset_ms", 720)
    )
    all_diagnostics.append(kinematic_result)

    # 2. 假性蓄力检测
    false_coil_result = detect_false_coil(
        vision_x_factor_degrees=vision_data.get("x_factor", 45.0),
        emg_core_activation_pct=emg_data.get("core_activation_pct", 0.8)
    )
    all_diagnostics.append(false_coil_result)

    # 3. 力链三重验证
    emg_sequence_ok = kinematic_result.rule_id == "KINEMATIC_SEQUENCE_OK"
    confidence, chain_diagnostics = verify_force_chain(
        vision_phase=vision_data.get("phase", "TOP"),
        imu_phase=imu_data.get("phase", "TOP"),
        emg_sequence_correct=emg_sequence_ok,
        imu_peak_velocity_dps=imu_data.get("peak_velocity_dps", 1000),
        emg_core_activation_pct=emg_data.get("core_activation_pct", 0.8)
    )
    all_diagnostics.extend(chain_diagnostics)

    # 选择最重要的反馈 (P0 > P1 > P2)
    critical_issues = [d for d in all_diagnostics if d.triggered and d.severity == DiagnosticSeverity.P0_CRITICAL]
    important_issues = [d for d in all_diagnostics if d.triggered and d.severity == DiagnosticSeverity.P1_IMPORTANT]

    if critical_issues:
        primary_feedback = critical_issues[0].message_cn
    elif important_issues:
        primary_feedback = important_issues[0].message_cn
    else:
        primary_feedback = "挥杆看起来不错 ✓"

    return {
        "overall_confidence": confidence,
        "diagnostics": all_diagnostics,
        "primary_feedback": primary_feedback
    }
```

#### 4.5.6 诊断规则速查表

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

---

## 5. 模拟数据生成 {#5-模拟数据生成-simulation-data-generation}

MVP 早期硬件未就绪时，使用模拟数据验证完整管道。

### 5.1 从 Pose 数据生成模拟 IMU {#51-从-pose-数据生成模拟-imu}

核心思路: 用 MediaPipe 的关键点序列**导数**来近似 IMU 角速度

```python
import numpy as np
from dataclasses import dataclass
from typing import List, Optional

@dataclass
class SimulatedIMUFrame:
    """模拟的单帧 IMU 数据"""
    timestamp_ms: int
    gyro_z: float       # 主轴角速度 (°/s)
    gyro_magnitude: float
    accel_magnitude: float
    phase_hint: str     # 用于验证的预期阶段


def simulate_imu_from_pose(
    landmarks_sequence: List[dict],
    fps: int = 30,
    add_noise: bool = True,
    noise_std: float = 5.0
) -> List[SimulatedIMUFrame]:
    """
    从 MediaPipe 姿态关键点序列生成模拟 IMU 数据

    原理:
    ─────
    1. 计算肩膀中心点的 x 位置随时间变化 → 近似上身旋转
    2. 对位置序列求导 → 角速度
    3. 检测零交叉点 → Top of Backswing
    4. 检测峰值 → Impact

    参数:
    ─────
    landmarks_sequence: MediaPipe 33 关键点序列
                       每帧格式: {keypoints: [{x, y, z, visibility}, ...]}
    fps: 视频帧率
    add_noise: 是否添加高斯噪声 (模拟真实传感器)
    noise_std: 噪声标准差

    返回:
    ─────
    List[SimulatedIMUFrame]: 每帧的模拟 IMU 数据
    """
    results = []
    dt = 1.0 / fps  # 帧间时间间隔 (秒)

    # 提取肩膀中心点位置序列 (关键点 11=左肩, 12=右肩)
    shoulder_x_positions = []
    for frame in landmarks_sequence:
        kp = frame['keypoints']
        left_shoulder = kp[11]
        right_shoulder = kp[12]
        shoulder_center_x = (left_shoulder['x'] + right_shoulder['x']) / 2
        shoulder_x_positions.append(shoulder_center_x)

    shoulder_x = np.array(shoulder_x_positions)

    # 计算角速度 (一阶导数)
    # 假设 x 位置变化映射到旋转角度: 0.5 弧度 ≈ 28.6° 全幅旋转
    # 缩放因子将归一化坐标映射到合理的角速度范围
    ROTATION_SCALE = 1500.0  # 将 [0,1] 变化映射到 ~1500°/s 峰值
    angular_velocity = np.gradient(shoulder_x, dt) * ROTATION_SCALE

    # 计算加速度 (二阶导数)
    angular_accel = np.gradient(angular_velocity, dt)

    # 识别关键事件点
    peak_idx = np.argmax(np.abs(angular_velocity))
    zero_crossings = np.where(np.diff(np.sign(angular_velocity)))[0]

    for i, (gyro_z, accel_z) in enumerate(zip(angular_velocity, angular_accel)):
        timestamp_ms = int(i * dt * 1000)

        # 添加传感器噪声
        if add_noise:
            gyro_z += np.random.normal(0, noise_std)
            accel_z += np.random.normal(0, noise_std * 0.1)

        # 推断阶段 (用于验证，不是最终判断)
        if i in zero_crossings and gyro_z < 50:
            phase_hint = "TOP"  # 零交叉 = Top of Backswing
        elif i == peak_idx:
            phase_hint = "IMPACT"  # 峰值 = Impact
        elif i < peak_idx and gyro_z > 0:
            phase_hint = "BACKSWING"
        elif i > peak_idx:
            phase_hint = "FOLLOW_THROUGH"
        else:
            phase_hint = "DOWNSWING"

        results.append(SimulatedIMUFrame(
            timestamp_ms=timestamp_ms,
            gyro_z=float(gyro_z),
            gyro_magnitude=float(np.abs(gyro_z)),
            accel_magnitude=float(np.abs(accel_z)),
            phase_hint=phase_hint
        ))

    return results


# 使用示例
# frames = simulate_imu_from_pose(mediapipe_output, fps=30)
# for f in frames:
#     print(f"{f.timestamp_ms}ms: gyro_z={f.gyro_z:.1f}°/s, phase={f.phase_hint}")
```

### 5.2 从阶段时间戳生成模拟 EMG {#52-从阶段时间戳生成模拟-emg}

核心思路: 根据已知的生物力学时序生成**符合真实模式**的 EMG 信号

```python
import numpy as np
from dataclasses import dataclass
from typing import Dict, List, Tuple
from enum import Enum

class EMGPattern(Enum):
    """EMG 生成模式"""
    CORRECT = "correct"          # 正确: Core 先于 Forearm >20ms
    ARMS_FIRST = "arms_first"    # 错误: Forearm 先于 Core
    FALSE_COIL = "false_coil"    # 假性蓄力: Core 激活过低 (<50%)
    FATIGUED = "fatigued"        # 疲劳: 整体激活衰减


@dataclass
class EMGSimulationConfig:
    """EMG 模拟配置参数"""
    sample_rate_hz: int = 500
    core_onset_offset_ms: int = -30   # 相对于 Top 的偏移 (负=提前)
    forearm_onset_offset_ms: int = 20  # 相对于 Downswing 的偏移
    core_peak_activation: float = 0.8  # 峰值激活 [0-1]
    forearm_peak_activation: float = 0.7
    fatigue_decay: float = 1.0         # 疲劳衰减系数 [0-1]


@dataclass
class SimulatedEMGResult:
    """模拟 EMG 输出"""
    core_onset_ms: int
    forearm_onset_ms: int
    timing_gap_ms: int           # forearm - core (正常应 > 20ms)
    core_activation_pct: float   # 峰值激活百分比
    forearm_activation_pct: float
    is_sequence_correct: bool
    pattern_detected: str        # "CORRECT", "ARMS_FIRST", "FALSE_COIL", etc.
    raw_signal: Dict[str, np.ndarray]  # 原始波形 (用于可视化)


def simulate_emg_from_phases(
    phase_timestamps: Dict[str, int],
    pattern: EMGPattern = EMGPattern.CORRECT,
    config: EMGSimulationConfig = None
) -> SimulatedEMGResult:
    """
    根据已知阶段时间戳生成模拟 EMG 数据

    原理:
    ─────
    1. 根据 TOP 和 DOWNSWING 时间戳确定肌肉激活时机
    2. 生成高斯调制的激活包络
    3. 根据 pattern 参数调整时序和强度

    参数:
    ─────
    phase_timestamps: 阶段时间戳字典
                     e.g., {"TOP": 600, "DOWNSWING": 700, "IMPACT": 850}
    pattern: 生成模式 (正确/手臂先动/假性蓄力/疲劳)
    config: 详细配置参数

    返回:
    ─────
    SimulatedEMGResult: 包含时序、激活强度、诊断结果
    """
    if config is None:
        config = EMGSimulationConfig()

    top_ms = phase_timestamps.get("TOP", 600)
    downswing_ms = phase_timestamps.get("DOWNSWING", 700)
    impact_ms = phase_timestamps.get("IMPACT", 850)

    # 根据模式调整时序和强度
    if pattern == EMGPattern.CORRECT:
        # 正确模式: Core 在 Top 前 30ms 激活, Forearm 在 Downswing 后 20ms
        core_onset = top_ms + config.core_onset_offset_ms  # 负偏移 = 提前
        forearm_onset = downswing_ms + config.forearm_onset_offset_ms
        core_activation = config.core_peak_activation
        forearm_activation = config.forearm_peak_activation

    elif pattern == EMGPattern.ARMS_FIRST:
        # 错误模式: Forearm 先于 Core 激活
        forearm_onset = top_ms - 20   # Forearm 提前
        core_onset = top_ms + 40      # Core 延后
        core_activation = config.core_peak_activation
        forearm_activation = config.forearm_peak_activation

    elif pattern == EMGPattern.FALSE_COIL:
        # 假性蓄力: 时序正确，但 Core 激活不足
        core_onset = top_ms + config.core_onset_offset_ms
        forearm_onset = downswing_ms + config.forearm_onset_offset_ms
        core_activation = 0.3   # 低于 50% 阈值
        forearm_activation = config.forearm_peak_activation

    elif pattern == EMGPattern.FATIGUED:
        # 疲劳模式: 整体激活衰减
        core_onset = top_ms + config.core_onset_offset_ms
        forearm_onset = downswing_ms + config.forearm_onset_offset_ms
        core_activation = config.core_peak_activation * 0.6
        forearm_activation = config.forearm_peak_activation * 0.6

    # 计算时序差
    timing_gap = forearm_onset - core_onset

    # 判断序列是否正确 (Core 应先于 Forearm >20ms)
    is_correct = timing_gap > 20 and core_activation > 0.5

    # 生成原始信号波形 (用于可视化)
    duration_ms = impact_ms + 200
    n_samples = int(duration_ms * config.sample_rate_hz / 1000)
    t = np.linspace(0, duration_ms, n_samples)

    def generate_activation_envelope(onset_ms: int, peak: float, duration_ms: int = 150):
        """生成高斯调制的激活包络"""
        envelope = np.zeros(n_samples)
        onset_idx = int(onset_ms * config.sample_rate_hz / 1000)
        duration_samples = int(duration_ms * config.sample_rate_hz / 1000)

        if 0 <= onset_idx < n_samples:
            # 高斯上升 + 指数衰减
            for i in range(duration_samples):
                if onset_idx + i < n_samples:
                    # 快速上升, 慢速衰减
                    rise = 1 - np.exp(-i / 20)
                    decay = np.exp(-max(0, i - 50) / 100)
                    envelope[onset_idx + i] = peak * rise * decay

        # 添加随机噪声
        noise = np.random.normal(0, 0.05, n_samples)
        return np.clip(envelope + noise, 0, 1)

    core_signal = generate_activation_envelope(core_onset, core_activation)
    forearm_signal = generate_activation_envelope(forearm_onset, forearm_activation)

    # 检测到的模式
    if timing_gap <= 0:
        pattern_detected = "ARMS_BEFORE_CORE"
    elif core_activation < 0.5:
        pattern_detected = "FALSE_COIL"
    elif core_activation < 0.7:
        pattern_detected = "FATIGUE_WARNING"
    else:
        pattern_detected = "CORRECT"

    return SimulatedEMGResult(
        core_onset_ms=int(core_onset),
        forearm_onset_ms=int(forearm_onset),
        timing_gap_ms=int(timing_gap),
        core_activation_pct=float(core_activation),
        forearm_activation_pct=float(forearm_activation),
        is_sequence_correct=is_correct,
        pattern_detected=pattern_detected,
        raw_signal={"core": core_signal, "forearm": forearm_signal}
    )


# 使用示例
# result = simulate_emg_from_phases(
#     {"TOP": 600, "DOWNSWING": 700, "IMPACT": 850},
#     pattern=EMGPattern.ARMS_FIRST
# )
# print(f"Core onset: {result.core_onset_ms}ms")
# print(f"Forearm onset: {result.forearm_onset_ms}ms")
# print(f"Gap: {result.timing_gap_ms}ms → {result.pattern_detected}")
```

### 5.3 预生成的测试场景

#### IMU 测试场景

```json
{
  "scenario": "good_swing",
  "description": "职业级挥杆 - 用于测试正常检测路径",
  "imu_frames": [
    {"t_ms": 0,    "gyro_z": 0,     "phase": "ADDRESS"},
    {"t_ms": 100,  "gyro_z": 200,   "phase": "TAKEAWAY"},
    {"t_ms": 300,  "gyro_z": 400,   "phase": "BACKSWING"},
    {"t_ms": 600,  "gyro_z": 50,    "phase": "TOP"},
    {"t_ms": 700,  "gyro_z": -600,  "phase": "DOWNSWING"},
    {"t_ms": 850,  "gyro_z": -1200, "phase": "IMPACT"},
    {"t_ms": 1000, "gyro_z": -400,  "phase": "FOLLOW_THROUGH"}
  ],
  "expected_metrics": {
    "peak_velocity_dps": 1200,
    "tempo_ratio": 3.0,
    "backswing_duration_ms": 600,
    "downswing_duration_ms": 250
  }
}
```

#### EMG 测试场景

```json
[
  {
    "scenario": "correct_sequence",
    "description": "正确运动链 - Core 先于 Forearm 激活",
    "phase_timestamps": {"TOP": 600, "DOWNSWING": 700, "IMPACT": 850},
    "expected": {
      "core_onset_ms": 570,
      "forearm_onset_ms": 720,
      "timing_gap_ms": 150,
      "pattern": "CORRECT"
    }
  },
  {
    "scenario": "arms_first_error",
    "description": "错误运动链 - 手臂先于核心 (常见业余问题)",
    "phase_timestamps": {"TOP": 600, "DOWNSWING": 700, "IMPACT": 850},
    "expected": {
      "core_onset_ms": 640,
      "forearm_onset_ms": 580,
      "timing_gap_ms": -60,
      "pattern": "ARMS_BEFORE_CORE"
    }
  },
  {
    "scenario": "false_coil",
    "description": "假性蓄力 - X-Factor 正常但核心未激活 (只有三模态能检测!)",
    "phase_timestamps": {"TOP": 600, "DOWNSWING": 700, "IMPACT": 850},
    "expected": {
      "timing_gap_ms": 150,
      "core_activation_pct": 0.3,
      "pattern": "FALSE_COIL"
    },
    "note": "Vision-only 系统会认为这是正确的挥杆"
  }
]
```

## 6. 相关文档 {#6-相关文档-related-documents}

- [系统设计](./system-design.md): MVP 技术架构和构建顺序
- [模块化架构](./modular-architecture.md): LEGO 积木式架构设计
- [关键决策 2025-12](../decisions/architecture-decisions-2025-12-23.md): 传感器选型和 Sensor Hub 同步策略
- [挥杆对比分析](../specs/swing-comparison.md): Pro vs Amateur 的生物力学差异
- [生物力学术语表](../../prerequisites/foundations/biomechanics-glossary.md): 技术术语定义
- [生物力学基准值](../../prerequisites/foundations/biomechanics-benchmarks.md): 文献验证的正常范围

---

**注意事项**:

1. EMG 信号质量受皮肤阻抗影响，需校准和去噪
2. Vision 的 33ms 采样间隔不足以检测 <10ms 的激活差异，需 IMU/EMG 补充
3. 单个 IMU 无法测量全身姿态，Phase 2 需增加骨盆 IMU
4. 地面反作用力需专用测力台，MVP 阶段不支持

---

**最后更新**: 2025-12-19
