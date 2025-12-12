# 术语表 Glossary

> 本文档定义项目中使用的所有技术术语，帮助不同背景的读者理解文档内容。

---

## 传感器术语 Sensor Terms

### IMU (Inertial Measurement Unit)

**中文**: 惯性测量单元

**包含组件**:

- **加速度计 (Accelerometer)**: 测量线性加速度 (m/s²)
- **陀螺仪 (Gyroscope)**: 测量角速度 (°/s)
- **磁力计 (Magnetometer)**: 测量方向/朝向 (可选)

**常见规格**:

- 6 轴: 加速度计 + 陀螺仪
- 9 轴: 加速度计 + 陀螺仪 + 磁力计

**我们研究的产品**:

- LSM6DSV16X (带 MLC 机器学习核心)
- BMI270
- MPU-6050
- WitMotion WT901

详见: [IMU 硬件](../components/imu/hardware.md)

---

### EMG (Electromyography)

**中文**: 肌电图/肌电传感器

**原理**: 测量肌肉收缩时产生的电信号 (μV 级别)

**类型**:

- **表面 EMG (sEMG)**: 贴在皮肤表面，无创
- **针式 EMG**: 插入肌肉，医疗用途

**我们使用**: 表面 EMG

**关键指标**:

- 采样率: 通常 500-2000 Hz
- 信号幅度: 50-5000 μV
- 带通滤波: 通常 20-500 Hz

**我们研究的产品**:

- DFRobot SEN0240 (单通道，入门级)
- OYMotion gForcePro+ (8 通道，专业级)
- Delsys Trigno (研究级)

详见: [EMG 硬件](../components/emg/hardware.md)

---

### FSR (Force Sensing Resistor)

**中文**: 力敏电阻/压力传感器

**原理**: 压力增加时，电阻减小

**特点**:

- 超薄 (<0.5mm)
- 低成本
- 适合柔性应用

**应用**:

- 足底压力检测
- 握力监测
- 触摸检测

**常见产品**:

- Interlink FSR 402/406
- FlexiForce A201

详见: [压力传感器硬件](../components/pressure-sensors/hardware.md)

---

### E-Skin (Electronic Skin)

**中文**: 电子皮肤

**定义**: 可贴合皮肤或弯曲表面的柔性传感器阵列

**四种类型**:

| 类型 | 原理 | 测量内容 | 特点 |
|-----|------|---------|------|
| **应变式** | 形变→电阻变化 | 弯曲/拉伸 | 线性好 |
| **压阻式** | 压力→电阻变化 | 压力分布 | 灵敏度高 |
| **电容式** | 形变→电容变化 | 形变 | 精度高 |
| **压电式** | 形变→电压 | 动态变化 | 响应快 |

**我们研究的产品**:

- StretchSense (电容式)
- BendLabs (电阻式)
- Bebop Sensors
- 国产: 能斯达、纽迪瑞

详见: [柔性传感器硬件](../components/flexible-sensors/hardware.md)

---

## 视觉术语 Vision Terms

### Pose Estimation

**中文**: 姿态估计

**定义**: 从图像/视频中识别人体关键点位置

**方法**:

- **Top-Down**: 先检测人，再检测关键点
- **Bottom-Up**: 先检测所有关键点，再聚合成人

**我们选择**: RTMPose (Top-Down)

---

### Keypoint

**中文**: 关键点

**定义**: 人体骨骼的关键节点 (关节)

**COCO 17 点格式**:

```text
0: 鼻子        1: 左眼       2: 右眼
3: 左耳        4: 右耳       5: 左肩
6: 右肩        7: 左肘       8: 右肘
9: 左腕       10: 右腕      11: 左髋
12: 右髋      13: 左膝      14: 右膝
15: 左踝      16: 右踝
```

---

### RTMPose

**定义**: 来自 OpenMMLab 的实时姿态估计模型

**我们选择的版本**: RTMPose-m

**性能**:

- 精度: 75.8% AP (COCO)
- 速度: 移动端 70+ FPS
- 模型大小: 13.6MB

详见: [视觉软件](../components/vision/software.md)

---

### AP (Average Precision)

**中文**: 平均精度

**定义**: 姿态估计的标准评估指标

**计算**: 在不同 IoU 阈值下的精度平均值

**常见指标**:

- AP@0.5: IoU=0.5 时的精度
- AP@0.75: IoU=0.75 时的精度 (更严格)
- mAP: 多个阈值的平均

---

## 运动分析术语 Motion Analysis Terms

### CoP (Center of Pressure)

**中文**: 压力中心/重心

**定义**: 足底压力分布的几何中心

**计算**:

```text
CoP_x = Σ(pressure_i × x_i) / Σ(pressure_i)
CoP_y = Σ(pressure_i × y_i) / Σ(pressure_i)
```

**应用**: 分析高尔夫挥杆中的重心转移

---

### X-Factor

**中文**: X 因子

**定义**: 肩膀旋转角度 - 髋部旋转角度

**意义**: 衡量躯干扭转程度，与击球力量相关

**典型值**:

- 职业选手: 45-55°
- 业余选手: 25-35°

---

### Kinetic Chain

**中文**: 力量链/动力链

**定义**: 力量在身体各部位之间传递的顺序

**高尔夫力量链**:

```text
地面 → 双脚 → 腿部 → 髋关节 → 核心 → 肩膀 → 手臂 → 手腕 → 球杆
```

**意义**: 正确的力量链顺序能最大化击球力量

---

### Delayed Release

**中文**: 延迟释放

**定义**: 下杆过程中保持手腕角度，直到接近击球点才释放

**意义**:

- 正确: 积蓄能量，击球更远
- 错误 (早释放): 能量提前损失

---

## 硬件术语 Hardware Terms

### MCU (Microcontroller Unit)

**中文**: 微控制器

**我们选择**: ESP32-S3

**关键特性**:

- 双核 240MHz
- 内置 BLE 5.0
- 原生 USB
- 低功耗模式

详见: [MCU 硬件](../components/mcu/hardware.md)

---

### BLE (Bluetooth Low Energy)

**中文**: 蓝牙低功耗

**版本**: BLE 5.0

**关键特性**:

- 传输速率: 最高 2Mbps
- 范围: 约 100m (开放环境)
- 功耗: 极低

**应用**: 传感器数据无线传输到手机

---

### MLC (Machine Learning Core)

**中文**: 机器学习核心

**定义**: IMU 芯片内置的决策树加速器

**优势**:

- 边缘 AI: 在传感器端做简单分类
- 超低功耗
- 减少数据传输

**支持芯片**: LSM6DSV16X

---

### ONNX (Open Neural Network Exchange)

**中文**: 开放神经网络交换格式

**定义**: 机器学习模型的通用格式

**我们的使用**:

- 训练: PyTorch
- 导出: ONNX 格式
- 推理: ONNX Runtime Mobile

---

## 数据融合术语 Data Fusion Terms

### Multi-Modal Fusion

**中文**: 多模态融合

**定义**: 结合多种数据源进行联合分析

**我们的多模态**:

- 视觉 (姿态)
- 压力 (重心)
- EMG (肌肉)
- E-Skin (形变)
- IMU (运动)

---

### Time Synchronization

**中文**: 时间同步

**定义**: 将不同传感器的数据对齐到统一时间轴

**方法**:

- 软件时间戳 (~10ms 精度)
- 硬件触发 (<1ms 精度)
- 事件对齐 (用击球点作为基准)

---

### Feature Engineering

**中文**: 特征工程

**定义**: 从原始传感器数据提取有意义的特征

**示例特征**:

- 视觉: 关节角度、挥杆速度
- 压力: 重心轨迹、重心速度
- EMG: 激活时机、峰值强度

---

## 相关文档

- [系统探索](system-exploration.md) - 我们在探索什么？有哪些选择？
- [组件总览](../components/index.md) - 所有传感器详情

---

**最后更新**: 2025 年 12 月 7 日
