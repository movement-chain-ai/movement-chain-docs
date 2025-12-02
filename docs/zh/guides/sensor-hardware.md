# Sensor Hardware 传感器硬件与嵌入式系统指南

> Movement Chain AI 多传感器架构综合技术指南，强调我们独特的 EMG 优势

**最后更新 Last Updated**: 2025年12月1日

---

## 目录 (Table of Contents)

1. [多传感器架构概述 Multi-Sensor Architecture Overview](#1-多传感器架构概述-multi-sensor-architecture-overview)
2. [IMU 传感器选择与集成 IMU Sensor Selection & Integration](#2-imu-传感器选择与集成-imu-sensor-selection--integration)
3. [EMG 传感器 - 我们的独特优势 EMG Sensors - Our Unique Advantage](#3-emg-传感器---我们的独特优势-emg-sensors---our-unique-advantage)
4. [微控制器平台 Microcontroller Platform](#4-微控制器平台-microcontroller-platform)
5. [商业传感器系统分析 Commercial Sensor Systems Analysis](#5-商业传感器系统分析-commercial-sensor-systems-analysis)
6. [带传感器数据的数据集 Datasets with Sensor Data](#6-带传感器数据的数据集-datasets-with-sensor-data)
7. [实施指南 Implementation Guide](#7-实施指南-implementation-guide)

---

## 1. 多传感器架构概述 (Multi-Sensor Architecture Overview)

### 1.1 为什么传感器优于纯视觉 (Why Sensors Beat Pure Vision)

**Tonal 的行业验证 Industry Validation from Tonal**:
> "将当前基于计算机视觉的产品和 Tonal 想象成体育播音员和体育科学实验室之间的区别。"

**Tonal 的多传感器方法 Tonal's Multi-Sensor Approach**:

- 电磁阻力系统（数字重量高达 200 磅）
- 绳索长度跟踪（60 Hz 采样率）
- 手柄中的力传感器
- 计算机视觉摄像头（Smart View）
- **结果 Result**: 比仅视觉系统更准确

**关键见解 Key Insight**: 结合多种传感器模态提供了仅靠视觉无法实现的真实值：

- 力传感器提供实际负载测量
- 绳索跟踪提供精确的运动范围 (ROM)
- 视觉添加身体位置上下文
- 多传感器融合消除了各个传感器的弱点

### 1.2 我们的方法：IMU + EMG + Vision 融合 (Our Approach: IMU + EMG + Vision Fusion)

**Movement Chain AI 的传感器堆栈 Movement Chain AI's Sensor Stack**:

```
┌─────────────────────────────────────────────────────────┐
│                 移动应用（视觉）Mobile App (Vision)      │
│  ┌──────────────────────────────────────────────────┐  │
│  │ MediaPipe Pose / RTMPose                          │  │
│  │ - 33 关键点 keypoints (2D/3D)                    │  │
│  │ - 30+ FPS 处理 processing                        │  │
│  │ - 关节角度计算 Joint angle calculation          │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↓
                    BLE 5.0 链路 Link
                         ↓
┌─────────────────────────────────────────────────────────┐
│      可穿戴模块（IMU + EMG）Wearable Module              │
│  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │ LSM6DSV16X IMU      │  │ EMG 传感器（2x）        │  │
│  │ - 6轴（加速+陀螺）  │  │ - 干电极 Dry electrodes │  │
│  │ - 100Hz 采样        │  │ - 1kHz 采样             │  │
│  │ - MLC 边缘 AI       │  │ - 肌肉激活              │  │
│  └─────────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**为什么这个架构有效 Why This Architecture Works**:

| 传感器 Sensor | 优势 Strengths | 弱点 Weaknesses | 提供什么 What It Provides |
|--------|-----------|------------|------------------|
| **Vision 视觉** | 全身位置，关节角度 | 遮挡，光照敏感 | 3D 姿态骨架 |
| **IMU** | 精确角速度，加速度 | 无绝对位置 | 运动动力学 |
| **EMG** | 肌肉激活真实值 | 需要皮肤接触 | 补偿检测 |

**传感器融合优势 Sensor Fusion Benefits**:

- Vision + IMU = 遮挡下的稳健姿态
- Vision + EMG = 肌肉激活 + 姿态相关性
- IMU + EMG = 可见姿态崩溃前的疲劳检测
- 三者全部 = 完整的运动质量评估

---

## 2. IMU 传感器选择与集成 (IMU Sensor Selection & Integration)

### 2.1 LSM6DSV16X 规格 (LSM6DSV16X Specifications)

**选定组件 Selected Component**: STMicroelectronics LSM6DSV16X

**为什么选择这个传感器？Why This Sensor?** (参见 [ADR-0002](../decisions/0002-lsm6dsv16x-imu.md) 获取完整理由)

**技术规格 Technical Specifications**:

| 参数 Parameter | 规格 Specification | 备注 Notes |
|-----------|---------------|-------|
| **加速度计范围 Accelerometer Range** | ±2/±4/±8/±16g | 用户可选全量程 |
| **陀螺仪范围 Gyroscope Range** | ±125/±250/±500/±1000/±2000 dps | 用户可选全量程 |
| **输出数据速率 Output Data Rate** | 1.875Hz 到 7680Hz | 推荐 100-200Hz 用于运动分析 |
| **工作电流 Operating Current** | 0.55mA @ 104Hz (加速+陀螺) | 高性能模式 |
| **加速度计噪声 Accelerometer Noise** | 65 μg/√Hz | 专业级噪声性能 |
| **陀螺仪噪声 Gyroscope Noise** | 4.5 mdps/√Hz | 同类最佳角速率噪声 |
| **温度稳定性 Temperature Stability** | ±0.02%/°C | 对户外锻炼至关重要 |
| **接口 Interfaces** | I2C (最高 1MHz), SPI (最高 10MHz) | 双接口灵活性 |
| **工作电压 Operating Voltage** | 1.71V 到 3.6V | 兼容 ESP32 3.3V 逻辑 |
| **机器学习核心 Machine Learning Core** | 是 Yes (MLC) | 决策树分类器 |
| **FIFO 缓冲区 FIFO Buffer** | 9KB | @ 100Hz 约 3 秒 |
| **封装 Package** | 2.5x3.0x0.86mm LGA-14L | 紧凑可穿戴优化占用空间 |

### 2.2 为什么我们选择这个而不是替代品 (Why We Chose This Over Alternatives)

**漂移性能排名 Drift Performance Rankings** (对于 45+ 分钟锻炼至关重要):

1. **LSM6DSV16X** - 45+ 分钟（同类最佳）✅
2. TDK ICM-42688-P - 25-30 分钟
3. Bosch BMI270 - 20-25 分钟
4. Bosch BNO055 - 15-20 分钟（已停产）
5. TDK MPU6050 - 10-15 分钟（传统）

**对比表 Comparison Table**:

| 功能 Feature | LSM6DSV16X ✅ | ICM-42688-P | BMI270 | BNO055 | MPU6050 |
|---------|--------------|-------------|---------|---------|---------|
| **价格 Price (1K units)** | $6-8 | $4-6 | $3-5 | 已停产 Discontinued | $2-3 |
| **漂移重置时间 Drift Reset Time** | 45+ min | 25-30 min | 20-25 min | 15-20 min | 10-15 min |
| **陀螺仪噪声 Gyro Noise** | 3.8 mdps/√Hz | 4.6 mdps/√Hz | 5.1 mdps/√Hz | 7.2 mdps/√Hz | 8.5 mdps/√Hz |
| **功耗（活动）Power (Active)** | 0.55 mA | 0.68 mA | 0.72 mA | 12.3 mA | 3.8 mA |
| **特殊功能 Special Features** | MLC, ISPU | APEX Motion | CRT, OIS | 传感器融合 | 基本 Basic |

**主要优势 Key Advantages**:

1. **延长会话精度 Extended Session Accuracy**: 45+ 分钟漂移稳定性使完整锻炼会话捕获无需校准中断
2. **机器学习核心 (MLC) Machine Learning Core**: 设备上运动分类，无需向 MCU 流式传输原始数据（功耗降低 40-60%）
3. **2025 市场领导 2025 Market Leadership**: STMicroelectronics 旗舰 IMU，保证 10+ 年生产生命周期
4. **专业级数据 Professional-Grade Data**: 精度规格满足区块链验证运动数据的要求

### 2.3 传感器融合算法 (Sensor Fusion Algorithms)

**互补滤波 Complementary Filtering** (轻量级，实时):

```python
# 互补滤波的伪代码
alpha = 0.98  # 短期内更信任陀螺仪

# 积分陀螺仪得到角度
gyro_angle = previous_angle + gyro_rate * dt

# 从加速度计计算角度
accel_angle = atan2(accel_y, accel_z)

# 用互补滤波融合
fused_angle = alpha * gyro_angle + (1 - alpha) * accel_angle
```

**卡尔曼滤波 Kalman Filter** (最优估计):

- 从陀螺仪进行状态预测
- 从加速度计进行测量更新
- 不确定性的协方差估计
- 最优处理传感器噪声
- 推荐用于生产系统

**Movement Chain AI 的推荐方法 Recommended Approach for Movement Chain AI**:

- **开发 Development**: 互补滤波（简单，快速迭代）
- **生产 Production**: 卡尔曼滤波与视觉融合（最优精度）
- **备用 Fallback**: Madgwick 用于方向关键任务

### 2.4 机器学习核心 (MLC) 能力 (Machine Learning Core Capabilities)

**传感器上 AI 处理 On-Sensor AI Processing**:

| 功能 Feature | 规格 Specification |
|---------|---------------|
| **算法类型 Algorithm Type** | 决策树分类器 Decision tree classifiers |
| **程序内存 Program Memory** | 每棵树 256 字节，最多 8 棵树 |
| **特征提取 Feature Extraction** | 内置时间/频域计算 |
| **延迟 Latency** | <1ms 分类时间 |
| **功耗优势 Power Advantage** | 相比连续 MCU 处理减少 90% |

**Movement Chain AI 的使用案例 Use Cases for Movement Chain AI**:

1. **练习识别 Exercise Recognition**: 深蹲、俯卧撑、跑步等（8 个预训练类）
2. **异常检测 Anomaly Detection**: 指示姿态错误的异常运动模式
3. **跌倒检测 Fall Detection**: 老年用户的安全功能
4. **活动跟踪 Activity Tracking**: 步数计数，活动分类

**功耗节省示例 Power Savings Example**:

```
没有 MLC Without MLC:
- MCU @ 240MHz: 25mA
- 连续处理：100% 占空比
- 平均 Average: 25mA

使用 MLC With MLC:
- MCU @ 240MHz: 25mA (仅当 MLC 触发时)
- MLC 自主运行 autonomous: 0.055mA
- MCU 中断唤醒 wake on interrupt: 5% 占空比
- 平均 Average: 1.3mA + 0.055mA = 1.355mA

节省 Savings: 减少 94.6%!
```

---

## 3. EMG 传感器 - 我们的独特优势 (EMG Sensors - Our Unique Advantage)

### 3.1 为什么没有商业产品有 EMG (Why NO Commercial Product Has EMG)

**商业健身产品 Commercial Fitness Products** (2025 分析):

| 产品 Product | 技术 Technology | EMG? |
|---------|-----------|------|
| Peloton IQ | 计算机视觉 Computer Vision | ❌ |
| Tonal | 多传感器（视觉 + 力）Multi-sensor (Vision + Force) | ❌ |
| MAGIC Mirror | 视觉 AI Vision AI | ❌ |
| Tempo Studio | 3D 深度传感器 (ToF) | ❌ |
| Form | IMU + AR 护目镜 | ❌ |
| Apple Fitness+ | 无 None | ❌ |
| **Movement Chain AI** | **IMU + Vision + EMG** | **✅ 独特! Unique!** |

**为什么商业产品避免 EMG Why Commercial Products Avoid EMG**:

1. **信号处理复杂性 Signal Processing Complexity**:
   - 来自电源线的 60 Hz 电气噪声
   - 运动期间的运动伪影
   - 需要复杂的滤波（昂贵的工程）

2. **用户体验摩擦 User Experience Friction**:
   - 传统 EMG 需要凝胶电极
   - 需要皮肤准备（剃须、清洁）
   - 放置精度至关重要
   - 设置时间阻碍日常使用

3. **成本考虑 Cost Considerations**:
   - 医疗级 EMG: 每通道 $1,000+
   - 放大电路增加 BOM 成本
   - 监管问题（如果作为医疗设备销售）

4. **商业模式不匹配 Business Model Mismatch**:
   - 商业产品优先考虑易用性
   - 大众市场想要"打开就走"
   - EMG 设置造成采用障碍

### 3.2 我们的干电极设计 (Our Dry Electrode Design)

**我们如何克服挑战 How We Overcome the Challenges**:

**1. 干电极 Dry Electrodes** (不需要凝胶 No Gel Required):

- 导电织物或金属接触
- 预先放置在可穿戴带中
- 不需要皮肤准备
- 可清洗和可重复使用

**2. 消费级 EMG Consumer-Grade EMG**:

- 不是医疗级精度（我们不需要诊断）
- 专注于相对肌肉激活（不是绝对）
- 足以进行补偿检测
- 更低成本：每通道约 $20-40 vs. $1,000+

**3. 基于 AI 的伪影去除 AI-Based Artifact Removal**:

```python
# 信号处理管道
raw_emg = read_adc()  # 1kHz 采样

# 1. 带通滤波 (20-450 Hz)
filtered = butterworth_filter(raw_emg, low=20, high=450)

# 2. 陷波滤波 (60 Hz + 谐波)
notched = notch_filter(filtered, freq=[60, 120, 180])

# 3. 运动伪影去除（AI 模型）
clean_emg = artifact_removal_model(notched, imu_data)

# 4. 整流和平滑
rectified = abs(clean_emg)
envelope = moving_average(rectified, window=50ms)

# 5. 肌肉激活水平 (0-100%)
activation = normalize(envelope) * 100
```

**4. 目标放置 Targeted Placement** (关键肌肉群):

对于力量训练 For Strength Training:

- **通道 1 Channel 1**: 股四头肌 Quadriceps (大腿前侧)
- **通道 2 Channel 2**: 臀大肌 Gluteus maximus (臀部后侧)

对于高尔夫 For Golf:

- **通道 1 Channel 1**: 背阔肌 Latissimus dorsi (背部)
- **通道 2 Channel 2**: 核心斜肌 Core obliques (侧面)

**硬件规格 Hardware Specification**:

| 组件 Component | 规格 Specification |
|-----------|---------------|
| **电极 Electrodes** | 干导电织物（Ag/AgCl 涂层）Dry conductive fabric |
| **放大器 Amplifier** | INA128 仪表放大器 (G=1000) |
| **ADC** | ESP32-S3 12位 ADC @ 1kHz |
| **通道 Channels** | 2 个差分通道 differential channels |
| **输入阻抗 Input Impedance** | >10 MΩ (干电极的高阻抗) |
| **CMRR** | >80 dB (共模抑制) |
| **带宽 Bandwidth** | 20-450 Hz (肌肉信号范围) |
| **功耗 Power** | 每通道 5mA per channel |

### 3.3 肌肉激活检测能力 (Muscle Activation Detection Capabilities)

**EMG 揭示的内容（视觉无法做到）What EMG Reveals (That Vision Cannot)**:

**1. 肌肉补偿检测 Muscle Compensation Detection**

示例：深蹲分析 Example: Squat Analysis

```
摄像头视图 Camera View:
✓ 深度 Depth: 90° 膝盖角度（良好深度）
✓ 姿态 Posture: 背部挺直
✓ 对齐 Alignment: 膝盖跟踪脚趾

EMG 揭示隐藏的补偿 EMG Reveals Hidden Compensation:
❌ 股四头肌 Quadriceps: 85% 激活（过度工作!）
❌ 臀部 Glutes: 15% 激活（工作不足!）
问题 Problem: 尽管视觉上"姿态良好"，但股四头肌主导的深蹲

反馈 Feedback:
"你的股四头肌在补偿。专注于通过脚后跟驱动。
在上升前感受臀部的参与。"
```

**2. 心肌连接 Mind-Muscle Connection**

初学者问题 Beginner Problem:

- 无法"感受"哪些肌肉应该工作
- 依赖补偿模式
- 运动学习进展缓慢

EMG 解决方案 EMG Solution:

```
用户 User: "我感觉不到我的臀部在工作"

系统（带 EMG）System (with EMG):
"再试一次。通过脚后跟推动...是的!
你的臀部激活刚刚达到 65%。那就是感觉!"

结果 Result: 客观生物反馈加速学习
```

**3. 疲劳检测 Fatigue Detection**

EMG 幅度 vs. 疲劳:

```
组 1 Set 1: EMG = 100% (新鲜 fresh)
组 2 Set 2: EMG = 95% (轻微疲劳 slight fatigue)
组 3 Set 3: EMG = 85% (中度疲劳 moderate fatigue)
组 4 Set 4: EMG = 70% (高疲劳 high fatigue) ← 伤害风险阈值
组 5 Set 5: EMG = 55% (危险 dangerous) ← 姿态崩溃迫在眉睫

警报 Alert: "检测到肌肉疲劳。下一组前休息 90 秒。"
```

**4. 左右不平衡 Left-Right Imbalance**

单侧练习 Unilateral Exercise (例如，弓步 Lunges):

```
左腿 Left Leg:  臀部 EMG = 75%
右腿 Right Leg: 臀部 EMG = 45%

见解 Insight: "你的左侧强 67%。专注于用右臀驱动
以平衡发展。"
```

### 3.4 信号处理管道 (Signal Processing Pipeline)

**实时处理流程 Real-time Processing Flow**:

```
┌─────────────────────────────────────────────────────────┐
│ 步骤 1: 模拟采集 Step 1: Analog Acquisition              │
│  - 干电极捕获皮肤电位                                     │
│  - INA128 放大 1000 倍 (μV → mV 范围)                   │
│  - 差分模式（消除共同噪声）                               │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 步骤 2: 数字采样 Step 2: Digital Sampling                │
│  - ESP32-S3 ADC @ 1kHz (每样本 1ms)                     │
│  - 12位分辨率 (4096 级)                                  │
│  - DMA 用于低延迟传输                                    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 步骤 3: 预处理 Step 3: Preprocessing (ESP32-S3 Core 0)  │
│  - 带通滤波: 20-450 Hz (肌肉信号范围)                    │
│  - 陷波滤波: 60/120/180 Hz (电源线谐波)                 │
│  - 高通: 去除 DC 偏移漂移                                │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│ 步骤 4: 伪影去除 Step 4: Artifact Removal (基于 AI)     │
│  - 输入 Input: EMG + IMU 数据（同步）                   │
│  - TFLite 模型: 运动伪影分类器                          │
│  - 输出 Output: 清洁 EMG 信号                           │
│  - 推理时间 Inference time: <5ms                        │
└─────────────────────────────────────────────────────────┘
```

---

## 4. 微控制器平台 (Microcontroller Platform)

### 4.1 ESP32-S3 选择理由 (ESP32-S3 Selection Rationale)

**选定组件 Selected Component**: Espressif ESP32-S3-WROOM-1-N8R8 模块

**为什么选择这个 MCU？Why This MCU?** (参见 [ADR-0005](../decisions/0005-esp32-s3-microcontroller.md) 获取完整理由)

**与替代品对比 Comparison vs. Alternatives**:

| 功能 Feature | ESP32-S3 ✅ | nRF52840 | STM32WB55 | ESP32-C3 |
|---------|-------------|----------|-----------|----------|
| **价格 Price (1K units)** | $2.50-3.50 | $3.50-4.50 | $4.00-5.50 | $1.50-2.00 |
| **CPU 核心 CPU Core** | Xtensa LX7 (双核 Dual) | ARM Cortex-M4 | ARM Cortex-M4 | RISC-V (单核 Single) |
| **时钟速度 Clock Speed** | 240 MHz | 64 MHz | 64 MHz | 160 MHz |
| **RAM** | 512 KB | 256 KB | 256 KB | 400 KB |
| **Flash 闪存** | 最多 Up to 16 MB | 1 MB | 1 MB | 最多 Up to 4 MB |
| **BLE 版本 BLE Version** | BLE 5.0 | BLE 5.3 | BLE 5.2 | BLE 5.0 |
| **BLE 吞吐量 BLE Throughput** | 1.4 Mbps | 2.0 Mbps | 1.8 Mbps | 1.2 Mbps |
| **WiFi** | 802.11n | ❌ | ❌ | 802.11n |
| **功耗（活动）Power (Active)** | 20-30 mA | 15-20 mA | 18-25 mA | 35-60 mA |
| **AI 加速 AI Acceleration** | 矢量指令 Vector instructions | ❌ | ❌ | ❌ |

**主要优势 Key Advantages**:

1. **双核架构 Dual-Core Architecture**: 传感器处理（核心 0）和通信（核心 1）的清晰分离
2. **BLE 吞吐量 BLE Throughput**: 800-1200 kbps 足以进行 100Hz IMU + 1kHz EMG 流式传输
3. **8MB PSRAM**: 存储 10-15 分钟传感器缓冲区以进行离线优先操作
4. **AI 加速 AI Acceleration**: 15-20ms TFLite 推理用于实时运动质量评分
5. **成本领先 Cost Leadership**: $3-5 vs. Nordic/STM32 替代品的 $8-12

### 4.2 BLE 5.0 通信架构 (BLE 5.0 Communication Architecture)

**BLE GATT 服务结构 BLE GATT Service Structure**:

```
运动服务 Movement Service (自定义 UUID: 0x181A)
├── IMU 数据特性（通知）IMU Data Characteristic (Notify)
│   ├── 加速 X/Y/Z Accel X/Y/Z (3x int16, ±8g)
│   ├── 陀螺 X/Y/Z Gyro X/Y/Z (3x int16, ±2000dps)
│   ├── 时间戳 Timestamp (uint32, 毫秒)
│   └── 数据包 Packet: 14 bytes @ 100Hz = 1.4 KB/s
│
├── EMG 数据特性（通知）EMG Data Characteristic (Notify)
│   ├── 通道 1 激活 Channel 1 Activation (uint8, 0-100%)
│   ├── 通道 2 激活 Channel 2 Activation (uint8, 0-100%)
│   ├── 疲劳标志 Fatigue Flag (uint8, 位字段)
│   ├── 时间戳 Timestamp (uint32, 毫秒)
│   └── 数据包 Packet: 6 bytes @ 100Hz = 0.6 KB/s
│
├── 练习识别（通知）Exercise Recognition (Notify)
│   ├── 练习类型 Exercise Type (uint8, MLC 输出)
│   ├── 置信度 Confidence (uint8, 0-100%)
│   ├── 重复次数 Rep Count (uint16)
│   └── 数据包 Packet: 4 bytes 仅在更改时
│
├── 触觉控制（写入）Haptic Control (Write)
│   ├── 模式 ID Pattern ID (uint8)
│   ├── 强度 Intensity (uint8, 0-100%)
│   └── 持续时间 Duration (uint16, 毫秒)
│
└── 电池状态（读取/通知）Battery Status (Read/Notify)
    ├── 电压 Voltage (uint16, 毫伏)
    ├── 百分比 Percentage (uint8, 0-100%)
    └── 充电状态 Charging State (uint8, 布尔)
```

**吞吐量计算 Throughput Calculation**:

```
IMU 数据 Data:  14 bytes × 100 Hz = 1,400 bytes/sec = 11.2 kbps
EMG 数据 Data:   6 bytes × 100 Hz =   600 bytes/sec =  4.8 kbps
练习 Exercise:   4 bytes × 1 Hz   =     4 bytes/sec =  0.03 kbps
─────────────────────────────────────────────────────────
总计 Total:                         2,004 bytes/sec ≈ 16 kbps

BLE 5.0 吞吐量 Throughput: 800-1200 kbps
利用率 Utilization: 16 kbps / 800 kbps = 2% (98% 余量!)
```

### 4.3 功耗优化策略 (Power Optimization Strategies)

**目标: 8+ 小时活动锻炼运行时间 Target: 8+ Hours Active Workout Runtime**

**功耗预算 Power Budget**:

| 组件 Component | 模式 Mode | 电流 Current | 占空比 Duty Cycle | 平均 Average |
|-----------|------|---------|------------|---------|
| **ESP32-S3** | 活动（双核）Active (dual-core) | 25mA | 100% | 25mA |
| **LSM6DSV16X** | 104Hz 采样 sampling | 0.55mA | 100% | 0.55mA |
| **EMG (2ch)** | 活动 Active | 10mA | 100% | 10mA |
| **BLE 无线电 Radio** | 已连接 Connected | 15mA | 100% | 15mA |
| **触觉 Haptic** | 振动 Vibration | 80mA | 1% | 0.8mA |
| **总活动 Total Active** | | | | **51.35mA** |

**电池寿命计算 Battery Life Calculation**:

```
电池 Battery: 500mAh LiPo
运行时间 Runtime: 500mAh / 51.35mA = 9.7 小时 hours ✓

带显示/LED (添加 5mA): 500mAh / 56.35mA = 8.9 小时 hours ✓
```

---

## 5. 商业传感器系统分析 (Commercial Sensor Systems Analysis)

### 5.1 Tonal - 力传感器 + 视觉融合 (Force Sensors + Vision Fusion)

**技术栈 Technology Stack**:

- 电磁阻力系统（数字重量高达 200 磅）
- **绳索长度跟踪** (60 Hz 采样率) - 精确 ROM 测量
- **手柄中的力传感器** - 真实负载测量
- 计算机视觉摄像头（Smart View）- 身体位置

**姿态反馈覆盖范围 Form Feedback Coverage**:

- 111 种力量训练练习
- 每个练习最多 6 种反馈类型:
  1. 速度 Speed (节奏控制)
  2. 运动范围 Range of Motion
  3. 位置 Position (身体对齐)
  4. 平衡 Balance (左/右不对称)
  5. 对称性 Symmetry
  6. 平滑度 Smoothness

**我们可以学到什么 What We Can Learn**:
✅ **多传感器优越性** - 验证我们的 IMU + Vision + EMG 方法
✅ **全面的反馈类型** - 我们应该跟踪速度、ROM、位置、对称性
✅ **力/负载测量** - 考虑未来添加力传感器

---

### 5.2 Tempo Studio - 3D 飞行时间深度感知

**技术 Technology**: 飞行时间 (ToF) 深度传感器

**优势 Advantages**:

- 真正的 3D 姿态（不是 2D 投影）
- 准确的深度测量
- 更好的遮挡处理
- 精确的关节角度计算

**我们可以学到什么 What We Learn**:
✅ **3D 姿态重要性** - 我们应该使用 MediaPipe 的 3D 输出
✅ **关节角度精度** - 对姿态评估至关重要
⚠️ **深度感知** - 考虑未来添加（手机 LiDAR）

---

## 6. 带传感器数据的数据集 (Datasets with Sensor Data)

### 6.1 MM-Fit - 多模态健身数据集

**为什么这很重要 Why This Matters**: 最接近我们的项目 - 结合可穿戴设备 + 视觉!

**数据集内容 Dataset Contents** (所有时间同步 All Time-Synchronized):

- **智能手机 IMU** (加速度计 + 陀螺仪)
- **智能手表 IMU**
- **耳塞 IMU**
- **多视角 RGB-D 视频**
- **2D 姿态估计标记**
- **3D 姿态重建**

**Movement Chain AI 如何使用这个 How Movement Chain AI Uses This**:

1. **验证传感器融合 Validate Sensor Fusion**: 测试 IMU + Vision 集成
2. **基准性能 Benchmark Performance**: 比较我们的姿态估计管道
3. **时间同步 Time Synchronization**: 参考他们的同步方法
4. **数据集增强 Dataset Augmentation**: 添加我们的 EMG 数据创建 MM-Fit-Plus

**访问 Access**:

- 公开可用 Publicly available
- GitHub: [https://github.com/KDMStromback/mm-fit](https://github.com/KDMStromback/mm-fit)
- 网站 Website: [https://mmfit.github.io/](https://mmfit.github.io/)

---

### 6.2 Microsoft RecoFit - IMU 练习识别

**焦点 Focus**: 基于可穿戴传感器的练习识别

**数据集内容 Dataset Contents**:

- **200+ 参与者**
- 加速度计 + 陀螺仪数据
- 健身房练习录音
- 重复计数标签

**Movement Chain AI 的使用案例 Use Cases for Movement Chain AI**:

1. **基线仅 IMU 识别 Baseline IMU-only recognition**: 测试 LSM6DSV16X 性能
2. **预训练可穿戴模块 Pre-training wearable module**: 引导我们的 IMU 模型
3. **重复计数验证 Rep counting validation**: 算法测试的真实值
4. **泛化测试 Generalization testing**: 多样化用户群体

---

## 7. 实施指南 (Implementation Guide)

### 7.1 硬件集成 (Hardware Integration)

**物料清单 (BOM) Bill of Materials**:

| 组件 Component | 零件号 Part Number | 数量 Qty | 单价 Unit Price | 总计 Total |
|-----------|-------------|-----|------------|-------|
| ESP32-S3 模块 Module | ESP32-S3-WROOM-1-N8R8 | 1 | $3.50 | $3.50 |
| IMU 传感器 Sensor | LSM6DSV16X | 1 | $6.50 | $6.50 |
| EMG 放大器 IC Amplifier IC | INA128 | 2 | $3.00 | $6.00 |
| 干电极 Dry Electrodes | Ag/AgCl 织物 fabric | 4 | $5.00 | $20.00 |
| 触觉电机 Haptic Motors | 振动电机 Vibration motor (ERM) | 2 | $2.50 | $5.00 |
| LiPo 电池 Battery | 500mAh 3.7V | 1 | $4.00 | $4.00 |
| 电池充电器 Battery Charger | MCP73831 | 1 | $0.50 | $0.50 |
| LDO 稳压器 LDO Regulator | TPS73633 (3.3V) | 1 | $1.00 | $1.00 |
| 无源器件 Passives | 电阻、电容等 Resistors, caps, etc. | - | - | $5.00 |
| PCB | 4层，50x70mm 4-layer | 1 | $15.00 | $15.00 |
| 外壳 Enclosure | 3D 打印 3D printed | 1 | $8.00 | $8.00 |
| **总 BOM 成本 Total BOM Cost** | | | | **$74.50** |

### 7.2 校准程序 (Calibration Procedures)

**IMU 校准 IMU Calibration** (6位置方法):

```python
# 校准例程的伪代码
def calibrate_imu():
    """
    用户将设备放置在 6 个方向:
    1. Z-up (平放在桌子上)
    2. Z-down (倒置)
    3. X-up (放在边缘上)
    4. X-down (相反的边缘)
    5. Y-up (放在一侧)
    6. Y-down (相反的一侧)
    """

    positions = []
    for i in range(6):
        print(f"位置 Position {i+1}/6: 放置设备 Place device {ORIENTATION[i]}")
        print("稳定时按按钮 Press button when stable...")
        wait_for_button()

        # 在 100Hz 下收集 100 个样本（1 秒）
        samples = []
        for _ in range(100):
            accel = read_accelerometer()
            gyro = read_gyroscope()
            samples.append((accel, gyro))
            delay(10)  # 10ms

        # 平均以减少噪声
        accel_avg = mean([s[0] for s in samples])
        gyro_avg = mean([s[1] for s in samples])
        positions.append((accel_avg, gyro_avg))

    # 计算校准参数
    accel_offset = calculate_accel_offset(positions)
    accel_scale = calculate_accel_scale(positions)
    gyro_offset = calculate_gyro_offset(positions)

    # 存储在非易失性内存中
    save_calibration(accel_offset, accel_scale, gyro_offset)

    print("校准完成 Calibration complete!")
    return True
```

**EMG 校准 EMG Calibration** (最大自主收缩 Maximum Voluntary Contraction):

```python
def calibrate_emg(muscle_group):
    """
    用户进行最大收缩以建立基线。

    对于深蹲 For squats:
    - 肌肉 1 Muscle 1: 股四头肌（等长墙坐）Quadriceps
    - 肌肉 2 Muscle 2: 臀部（臀桥保持）Glutes
    """

    print(f"校准 Calibrating {muscle_group}...")
    print("进行最大收缩 3 秒 Perform maximal contraction for 3 seconds")
    print("3... 2... 1... 开始 GO!")

    # 在 MVC 期间收集样本
    mvc_samples = []
    for _ in range(300):  # 3 秒 @ 100Hz
        emg_raw = read_emg_channel(muscle_group)
        emg_filtered = process_emg(emg_raw)
        mvc_samples.append(emg_filtered)
        delay(10)  # 10ms

    # 取第 95 百分位（对异常值稳健）
    mvc_value = percentile(mvc_samples, 95)

    # 存储为校准参考
    save_mvc_calibration(muscle_group, mvc_value)

    print(f"MVC 已校准 calibrated: {mvc_value} μV")
    return mvc_value
```

---

## 相关决策 (Related Decisions)

- [ADR-0002: LSM6DSV16X IMU 选择](../decisions/0002-lsm6dsv16x-imu.md)
- [ADR-0005: ESP32-S3 微控制器](../decisions/0005-esp32-s3-microcontroller.md)

## 相关资源 (Related Resources)

- [硬件组件对比 Hardware Component Comparison](../resources/hardware-comparison.md)
- [学术研究数据集 Academic Research Datasets](../archive/research-sources/academic-research-datasets.md)
- [商业健身技术分析 Commercial Fitness Technology Analysis](../archive/research-sources/commercial-fitness-tech.md)

---

**文档维护者 Document Maintained By**: Movement Chain AI 硬件团队 Hardware Team
**最后硬件审查 Last Hardware Review**: 2025年12月
**下次审查 Next Review**: 2026年3月
