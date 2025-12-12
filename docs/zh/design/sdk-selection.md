# SDK/库选型指南 SDK Selection Guide

> **文档目的**: 记录 MVP 阶段 SDK 和库的选型理由（Tier 2 决策）
>
> **与 ADR 区别**: ADR 记录难以逆转的架构决策（硬件、框架），本文档记录相对容易更换的库选择（1-5 天工作量）
>
> **硬件/架构决策**: 见 [decisions/](decisions/index.md)

---

## 选型原则

1. **MVP 优先**: 选择开箱即用的方案，避免复杂配置
2. **升级路径**: 确保有更高性能的替代方案可用
3. **社区验证**: 优先选择高 GitHub Stars、活跃维护、生产验证的项目
4. **Mock 兼容**: 支持模拟数据测试，符合"先软件后硬件"策略

---

## 移动端 (Flutter)

### 相机 Camera

| 候选方案 | 特点 | 生产验证 | 评估 |
|---------|------|---------|------|
| **camera** | 官方插件，CameraX/Camera2 | Flutter 团队维护 | ✅ 选择 |
| camerawesome | 内置 UI，滤镜，多摄像头 | 社区维护 | 备选 |

- **选择**: `camera` (官方)
- **理由**: 官方维护，CameraX 实现对 Android 设备兼容性更好，支持 60 FPS 视频流
- **升级触发**: 如需内置 UI 或滤镜功能，考虑 `camerawesome`

### 蓝牙 BLE

| 候选方案 | 特点 | 生产验证 | 评估 |
|---------|------|---------|------|
| **flutter_reactive_ble** | 响应式 API，连接稳定 | Philips Hue (200万+下载) | ✅ 选择 |
| flutter_blue_plus | API 简洁，广泛使用 | 社区活跃 | 备选 |
| flutter_splendid_ble | 完整 central 功能 | 较新 | 观望 |

- **选择**: `flutter_reactive_ble`
- **理由**: 响应式模型适合状态管理，Philips Hue 应用生产验证充分
- **升级触发**: 如需后台蓝牙恢复功能，考虑 `flutter_blue_plus`

### 语音反馈 TTS

| 候选方案 | 平台支持 | 离线能力 | 评估 |
|---------|---------|---------|------|
| **flutter_tts** | iOS, Android, Web, macOS, Windows | ✅ 支持 | ✅ 选择 |
| cloud_text_to_speech | Google/Microsoft/Amazon | 需联网 | 云端备选 |

- **选择**: `flutter_tts`
- **理由**: 多平台支持，离线可用，成熟稳定
- **用途**: 挥杆完成后语音反馈 ("82分，节奏很好")

---

## AI/ML 处理

### 姿态估计 Pose Estimation

| 候选方案 | 精度 | 速度 | 部署难度 | 评估 |
|---------|------|------|---------|------|
| **MediaPipe Pose** | ~75% AP | 30+ FPS | `pip install mediapipe` | ✅ MVP 选择 |
| RTMPose | 75.8% AP | 70 FPS 移动端 | 需 mmpose + mmdeploy | Phase 2 升级 |
| YOLO11-Pose | 89.4% mAP | 200+ FPS | Ultralytics | 备选 |
| ViTPose | 81.1% AP (SOTA) | 需 GPU | 服务器部署 | ❌ 移动端过重 |

- **选择**: MediaPipe Pose (MVP) → RTMPose (Phase 2)
- **理由**: 3 行代码开箱即用，33 个关节点输出，适合快速验证
- **升级触发**: 当用户反馈关节检测不准确时，升级到 RTMPose
- **参考**: [RTMPose GitHub](https://github.com/open-mmlab/mmpose/tree/main/projects/rtmpose)

```python
# MVP: 3 行代码即可运行
import mediapipe as mp
pose = mp.solutions.pose.Pose()
results = pose.process(rgb_frame)
```

### EMG 信号处理

| 候选方案 | GitHub Stars | 特点 | 评估 |
|---------|-------------|------|------|
| **NeuroKit2** | 1.9k⭐ | EMG 模拟、清洗、振幅检测 | ✅ 选择 |
| BioSPPy | 500+⭐ | 类似 API，较老 | 备选 |
| PyEMGPipeline | 较新 | EMG 专用 | 观望 |

- **选择**: `NeuroKit2`
- **理由**: 内置 `emg_simulate()` 支持 Mock 数据，正好匹配"先软件后硬件"策略
- **注意**: Phase 2 需要将处理逻辑移植到移动端 (Dart) 或嵌入式 (C++)
- **参考**: [NeuroKit2 EMG 文档](https://neuropsychology.github.io/NeuroKit/functions/emg.html)

```python
import neurokit2 as nk
cleaned = nk.emg_clean(raw_emg, sampling_rate=200)
amplitude = nk.emg_amplitude(cleaned)
```

### 传感器融合 Sensor Fusion

| 候选方案 | 语言 | 特点 | 评估 |
|---------|------|------|------|
| **numpy.interp()** | Python | 简单线性插值 | ✅ MVP 选择 |
| Fusion (x-io) | C/Python | AHRS、Madgwick 算法 | Phase 2 升级 |
| SensorFusion (Arduino) | C++ | 多种 IMU 支持 | ESP32 端备选 |

- **选择**: `numpy.interp()` (MVP) → Fusion (Phase 2)
- **理由**: MVP 只需时间轴对齐，5 行代码足够；高级融合 Phase 2 再考虑
- **升级触发**: 当需要姿态四元数输出或更精确的方向估计时
- **参考**: [x-io Fusion](https://github.com/xioTechnologies/Fusion)

---

## 嵌入式 (ESP32-S3)

### IMU 驱动

| 候选方案 | 特点 | MLC 支持 | 评估 |
|---------|------|---------|------|
| **stm32duino/LSM6DSV16X** | ST 官方，功能完整 | ✅ 支持 | ✅ 选择 |
| SparkFun LSM6DSV16X | 开源硬件配套 | ✅ 支持 | 备选 |
| kriswiner/LSM6DSV | 高级示例 | ✅ 支持 | 参考 |

- **选择**: `stm32duino/LSM6DSV16X`
- **理由**: ST 官方维护，支持 MLC、FSM、FIFO 全部功能
- **参考**: [GitHub](https://github.com/stm32duino/LSM6DSV16X)

### BLE 通信

| 候选方案 | 特点 | 评估 |
|---------|------|------|
| **ESP32 BLE Arduino** | ESP32 核心自带 | ✅ 选择 |
| NimBLE-Arduino | 更小内存占用 | 备选 |
| ESP-IDF BLE | 原生优化 | 生产优化 |

- **选择**: ESP32 BLE Arduino (MVP) → ESP-IDF (生产)
- **理由**: Arduino 开发速度快，生产阶段可迁移到 ESP-IDF 优化
- **参考**: [Random Nerd Tutorials](https://randomnerdtutorials.com/esp32-bluetooth-low-energy-ble-arduino-ide/)

---

## 数据集

### 高尔夫挥杆

| 数据集 | 内容 | 用途 | 链接 |
|-------|------|-----|------|
| **GolfDB** | 1,400 挥杆视频，8 事件标注 | SwingNet 训练，相位检测 | [GitHub](https://github.com/wmcnally/golfdb) |
| AICaddy | 6,000+ 球杆头图像 | YOLOv8 球杆追踪 | [GitHub](https://github.com/oswinkil-git/AICaddy-A-Golf-Club-Tracer) |
| golftracker | 视频处理工具包 | 挥杆检测 | [PyPI](https://pypi.org/project/golftracker/) |

- **主要数据集**: GolfDB
- **⚠️ 数据缺口**: 无公开数据集包含同步的 IMU + EMG + Video，**需自行录制**

### 通用姿态

| 数据集 | 内容 | 用途 |
|-------|------|-----|
| COCO Keypoints | 20万+ 图像，17 关节点 | 姿态模型评估 |
| Human3.6M | 3D 人体动作 | 3D 姿态参考 |

---

## 开发工具

### MLC 配置 (LSM6DSV16X)

| 工具 | 用途 | 链接 |
|-----|------|-----|
| **MEMS Studio** | MLC 决策树训练，UCF 文件生成 | [ST 下载](https://www.st.com/en/embedded-software/mems-studio.html) |
| AN5804 | LSM6DSV16X MLC 应用笔记 | [PDF](https://www.st.com/resource/en/application_note/an5804-lsm6dsv16x-machine-learning-core-stmicroelectronics.pdf) |
| st-mems-mlc | 预训练 MLC 示例 | [GitHub](https://github.com/STMicroelectronics/st-mems-machine-learning-core) |

### 模型工具

| 工具 | 用途 |
|-----|------|
| **Netron** | ONNX 模型可视化验证 |
| onnxruntime-tools | FP32→INT8 量化 |
| MMDeploy | RTMPose ONNX 导出 |

---

## 版本锁定

MVP 阶段锁定以下版本，避免升级导致的兼容性问题：

```yaml
# Python
mediapipe: "0.10.x"
neurokit2: "0.2.x"
opencv-python: "4.8.x"
numpy: "1.24.x"

# Flutter (pubspec.yaml)
camera: "^0.10.5"
flutter_reactive_ble: "^5.2.0"
flutter_tts: "^3.8.0"
onnxruntime_v2: "^1.16.3"
tflite_flutter: "^0.10.4"  # 备选

# Arduino
ESP32 Arduino Core: "2.0.x"
LSM6DSV16X (stm32duino): "latest"
```

---

## 相关文档

- [系统设计](system-design.md) - 整体架构和数据流
- [决策摘要](decisions-summary.md) - ADR 快速参考
- [MVP 原型代码](../platform/mvp-prototype-code.md) - 完整可运行示例
- [快速开始](getting-started.md) - 无需硬件即可测试

---

**最后更新**: 2025年12月12日
