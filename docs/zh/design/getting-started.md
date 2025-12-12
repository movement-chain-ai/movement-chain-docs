# 快速开始 Getting Started

> **无需硬件即可测试核心管道**

---

## 5分钟运行原型

### 1. 安装依赖

```bash
pip install mediapipe opencv-python numpy neurokit2
```

### 2. 使用 Mock 数据测试

无需 IMU/EMG 硬件，使用内置模拟器:

```python
from mvp_prototype import IMUMockGenerator, EMGMockGenerator

# 生成模拟挥杆数据
imu = IMUMockGenerator(sample_rate=100, duration_sec=2.0)
emg = EMGMockGenerator(sample_rate=200, duration_sec=2.0)

# 模拟核心不足场景 (常见问题)
imu_data = imu.generate_swing()
emg_data = emg.generate_swing(
    core_activation_level=0.3,    # 核心弱
    forearm_activation_level=0.8  # 手臂代偿
)
```

### 3. 运行分析

```bash
python mvp_prototype.py
# 按 's' 查看详细分析
# 按 'q' 退出
```

完整代码见: [MVP原型代码](../platform/mvp-prototype-code.md)

---

## Mock 数据生成器

| 生成器 | 模拟内容 | 可调参数 |
|-------|---------|---------|
| `IMUMockGenerator` | 挥杆角速度曲线 | sample_rate, duration |
| `EMGMockGenerator` | 肌肉激活模式 | core_level, forearm_level |

### 测试不同问题场景

```python
# 正常挥杆
emg.generate_swing(core=0.6, forearm=0.6)

# 核心不足 (常见)
emg.generate_swing(core=0.3, forearm=0.8)

# 发力过猛
emg.generate_swing(core=0.9, forearm=0.9)
```

---

## 可用数据集

| 数据集 | 内容 | 用途 | 链接 |
|-------|------|-----|------|
| **GolfDB** | 1400个高尔夫挥杆视频 | 动作分类训练 | [GitHub](https://github.com/wmcnally/golfdb) |
| **Fit3D** | 3D健身姿态 | 姿态估计评估 | [fit3d.imar.ro](https://fit3d.imar.ro) |
| **Ego4D** | 3025小时第一人称视频 | 运动场景分析 | [ego4d-data.org](https://ego4d-data.org) |

---

## SDK 速查

### 姿态估计

```python
import mediapipe as mp
pose = mp.solutions.pose.Pose()
results = pose.process(rgb_frame)
# results.pose_landmarks.landmark → 33个关节点
```

### EMG 处理

```python
import neurokit2 as nk
cleaned = nk.emg_clean(raw_emg, sampling_rate=200)
amplitude = nk.emg_amplitude(cleaned)
```

### 时间同步

```python
import numpy as np
synced = np.interp(target_timestamps, source_timestamps, source_data)
```

---

## 下一步

1. **连接真实硬件**: 替换 Mock 为 BLE IMU 数据
2. **调整阈值**: 根据实测数据优化规则
3. **移植 Flutter**: 构建移动端 App ([开发指南](../platform/mobile/development.md))

---

**最后更新**: 2025年12月12日
