# 传感器数据格式规范

> **文档目的**: 定义 Vision/IMU/EMG 三种传感器的数据格式和访问方式
>
> **阅读对象**: 固件工程师、后端工程师

---

## 传感器数据格式详解

在深入融合策略之前,先了解每种传感器输出的**具体数据格式**:

### Vision/MediaPipe 骨架数据

MediaPipe Pose 输出 33 个身体关键点,每个点包含归一化坐标和可见性:

```python
# MediaPipe Pose 输出格式
# 每个关键点包含:
#   x: 0.0 ~ 1.0 (图像宽度归一化)
#   y: 0.0 ~ 1.0 (图像高度归一化)
#   z: 深度信息 (相对于髋部中心)
#   visibility: 0.0 ~ 1.0 (可见性置信度)

# Python 访问示例:
import mediapipe as mp
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

results = pose.process(rgb_frame)
landmarks = results.pose_landmarks.landmark

# 访问特定关节
left_shoulder = landmarks[11]   # x, y, z, visibility
right_shoulder = landmarks[12]
left_hip = landmarks[23]
right_hip = landmarks[24]
left_wrist = landmarks[15]
right_wrist = landmarks[16]
```

**JSON 存储格式:**

```json
{
  "frame_id": 1,
  "timestamp_ms": 33.3,
  "landmarks": [
    {"id": 0, "name": "nose", "x": 0.512, "y": 0.285, "z": 0.001, "visibility": 0.99},
    {"id": 11, "name": "left_shoulder", "x": 0.421, "y": 0.412, "z": -0.052, "visibility": 0.97},
    {"id": 12, "name": "right_shoulder", "x": 0.589, "y": 0.405, "z": 0.048, "visibility": 0.98}
  ]
}
```

**SDK/API 可用性:** ✅ `pip install mediapipe` 开箱即用,3行代码完成

### IMU 惯性数据

IMU 输出加速度和角速度,采样率通常 100-200Hz:

```json
{
  "timestamp_us": 1234567890,
  "accelerometer": {
    "x": 0.02,
    "y": -9.78,
    "z": 0.15,
    "unit": "m/s²"
  },
  "gyroscope": {
    "x": 1.2,
    "y": -0.5,
    "z": 45.3,
    "unit": "°/s"
  }
}
```

**高尔夫挥杆典型数值范围:**

| 阶段 | 角速度 (gyro_z) | 加速度峰值 |
|-----|----------------|-----------|
| 准备站位 | ~0°/s | ~1g |
| 上杆 | -100 ~ -400°/s | 2-5g |
| 下杆 | 800 ~ 2000°/s | 10-30g |
| 击球瞬间 | 峰值 1500°/s+ | 峰值 20g+ |
| 送杆 | 逐渐归零 | 逐渐归零 |

**SDK/API 可用性:** ✅ 硬件SDK直接输出,ESP32-S3 可用 LSM6DSV16X 驱动

### EMG 肌电数据

EMG 原始信号是微伏级电压,需要处理后才有意义:

```json
{
  "timestamp_us": 1234567890,
  "channels": {
    "forearm_flexor": {
      "raw_uv": 245.3,
      "rms_envelope": 180.2,
      "activation_percent": 72
    },
    "forearm_extensor": {
      "raw_uv": -123.1,
      "rms_envelope": 95.4,
      "activation_percent": 38
    },
    "core_rectus": {
      "raw_uv": 89.7,
      "rms_envelope": 65.1,
      "activation_percent": 26
    }
  }
}
```

**EMG 处理流程:**

```python
# 使用 NeuroKit2 处理 EMG
import neurokit2 as nk

# 清洗原始信号 (去噪、滤波)
emg_cleaned = nk.emg_clean(emg_raw, sampling_rate=200)

# 提取振幅包络
emg_amplitude = nk.emg_amplitude(emg_cleaned)

# 计算激活百分比 (相对于最大自主收缩)
activation_percent = emg_amplitude / mvc_value * 100
```

**SDK/API 可用性:** ✅ `pip install neurokit2` 开箱即用

---

## 相关文档

- [多模态融合算法](fusion-algorithm.md) - 数据时间同步与融合策略
- [规则引擎与分析系统](rule-engine.md) - 使用传感器数据进行挥杆分析

---

**最后更新**: 2025年12月11日
