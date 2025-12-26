# SDK/库选型指南 SDK Selection Guide

> **文档目的**: 记录 MVP 阶段 SDK 和库的选型理由（Tier 2 决策）
>
> **与 ADR 区别**: ADR 记录难以逆转的架构决策（硬件、框架），本文档记录相对容易更换的库选择（1-5 天工作量）
>
> **硬件/架构决策**: 见 [decisions/](../decisions/index.md)

---

## 高星库快速参考 (一键安装)

!!! success "MVP 核心依赖 - 全部高星开源"

    ```bash
    # 一键安装所有 Python 依赖
    pip install mediapipe neurokit2 scipy numpy imufusion opencv-python
    ```

| 用途 | 库 | Stars | 安装命令 | 文档 |
|-----|-----|-------|---------|------|
| **姿态估计** | MediaPipe | 28k⭐ | `pip install mediapipe` | [官方文档](https://developers.google.com/mediapipe) |
| **EMG 处理** | NeuroKit2 | 1.9k⭐ | `pip install neurokit2` | [EMG 函数](https://neuropsychology.github.io/NeuroKit/functions/emg.html) |
| **IMU 融合** | imufusion | 1.7k⭐ | `pip install imufusion` | [GitHub](https://github.com/xioTechnologies/Fusion) |
| **信号处理** | scipy | 12k⭐ | `pip install scipy` | [signal 模块](https://docs.scipy.org/doc/scipy/reference/signal.html) |
| **数值计算** | numpy | 27k⭐ | `pip install numpy` | [官方文档](https://numpy.org/doc/) |
| **视频处理** | OpenCV | 80k⭐ | `pip install opencv-python` | [官方文档](https://docs.opencv.org/) |

---

## 选型原则

1. **MVP 优先**: 选择开箱即用的方案，避免复杂配置
2. **升级路径**: 确保有更高性能的替代方案可用
3. **社区验证**: 优先选择高 GitHub Stars、活跃维护、生产验证的项目
4. **Mock 兼容**: 支持模拟数据测试，符合"先软件后硬件"策略

---

## 移动端 (Swift iOS)

!!! info "为什么选择 Swift 原生而非 Flutter"
    MediaPipe 没有官方 Dart/Flutter SDK。Flutter 的 `google_mlkit_pose_detection` 需要通过 Platform Channel 桥接，官方文档明确指出存在 "notable latency"。
    详见 [ADR-0007 Swift 原生 iOS 开发](0007-swift-ios-native.md)

### 姿态检测 Pose Detection

| 候选方案 | 关键点数 | 性能 | 评估 |
|---------|---------|------|------|
| **MediaPipeTasksVision** | 33 | 原生速度 | ✅ 选择 |
| Apple Vision | ~19 | 原生速度 | ❌ 手腕信息不足 |
| google_mlkit (Flutter) | 33 | Platform Channel 延迟 | ❌ 不选 |

- **选择**: `MediaPipeTasksVision` (CocoaPods)
- **安装**: `pod 'MediaPipeTasksVision'`
- **理由**: Google 官方 iOS SDK，33 个关键点，无桥接延迟
- **参考**: [MediaPipe iOS 指南](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/ios)

```swift
import MediaPipeTasksVision

let options = PoseLandmarkerOptions()
options.baseOptions.modelAssetPath = "pose_landmarker.task"
options.runningMode = .liveStream
let poseLandmarker = try PoseLandmarker(options: options)
```

### 相机 Camera

| 候选方案 | 特点 | 评估 |
|---------|------|------|
| **AVFoundation** | iOS 原生，零开销 | ✅ 选择 |
| AVKit | 更高级封装 | 备选 |

- **选择**: `AVFoundation` (系统框架)
- **理由**: iOS 原生框架，支持 60/120 FPS 视频捕获，直接访问 CMSampleBuffer
- **用途**: 实时视频流传入 MediaPipe 进行姿态检测

```swift
import AVFoundation

let captureSession = AVCaptureSession()
captureSession.sessionPreset = .high

// 配置 60 FPS
if let format = device.formats.first(where: {
    CMFormatDescriptionGetMediaSubType($0.formatDescription) == kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange
}) {
    try device.lockForConfiguration()
    device.activeFormat = format
    device.activeVideoMinFrameDuration = CMTime(value: 1, timescale: 60)
    device.unlockForConfiguration()
}
```

### 蓝牙 BLE

| 候选方案 | 特点 | 评估 |
|---------|------|------|
| **CoreBluetooth** | iOS 原生，功能完整 | ✅ 选择 |
| RxBluetoothKit | 响应式封装 | 备选 |

- **选择**: `CoreBluetooth` (系统框架)
- **理由**: iOS 原生 BLE 框架，无需第三方依赖
- **用途**: 与 ESP32 传感器通信

```swift
import CoreBluetooth

class BLEManager: NSObject, CBCentralManagerDelegate, CBPeripheralDelegate {
    private var centralManager: CBCentralManager!

    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        if central.state == .poweredOn {
            central.scanForPeripherals(withServices: [sensorServiceUUID])
        }
    }
}
```

### 语音反馈 TTS

| 候选方案 | 离线能力 | 评估 |
|---------|---------|------|
| **AVSpeechSynthesizer** | ✅ 支持 | ✅ 选择 |
| OpenAI TTS | 需联网 | 云端备选 |

- **选择**: `AVSpeechSynthesizer` (系统框架)
- **理由**: iOS 原生 TTS，离线可用，免费
- **用途**: 挥杆完成后语音反馈 ("82分，节奏很好")

```swift
import AVFoundation

let synthesizer = AVSpeechSynthesizer()
let utterance = AVSpeechUtterance(string: "82分，节奏很好")
utterance.voice = AVSpeechSynthesisVoice(language: "zh-CN")
synthesizer.speak(utterance)
```

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

| 候选方案 | Stars | 特点 | 评估 |
|---------|-------|------|------|
| **NeuroKit2** | 1.9k⭐ | EMG 模拟、清洗、振幅检测、激活检测 | ✅ 选择 |
| BioSPPy | 500+⭐ | 类似 API，较老 | 备选 |
| BrainFlow | 556⭐ | 多种生物信号 | 备选 |

- **选择**: `NeuroKit2`
- **理由**: 内置 `emg_simulate()` 支持 Mock 数据，正好匹配"先软件后硬件"策略
- **注意**: Phase 2 需要将处理逻辑移植到移动端 (Swift) 或嵌入式 (C++)

```bash
pip install neurokit2
```

```python
import neurokit2 as nk

# 完整 EMG 处理流程
cleaned = nk.emg_clean(raw_emg, sampling_rate=200)      # 滤波
amplitude = nk.emg_amplitude(cleaned)                    # RMS 包络
activation = nk.emg_activation(cleaned)                  # 激活时刻检测

# 模拟数据 (用于测试)
simulated = nk.emg_simulate(duration=10, sampling_rate=200, burst_number=5)
```

- **参考**: [NeuroKit2 EMG 文档](https://neuropsychology.github.io/NeuroKit/functions/emg.html) | [GitHub](https://github.com/neuropsychology/NeuroKit)

### 传感器融合 Sensor Fusion

| 候选方案 | Stars | 语言 | 特点 | 评估 |
|---------|-------|------|------|------|
| **numpy.interp()** | - | Python | 简单线性插值 | ✅ MVP 选择 |
| **imufusion** | 1.7k⭐ | C/Python | AHRS、Madgwick 算法 | Phase 2 升级 |
| pyIMU | 50+⭐ | Python | 四元数、速度估计 | 参考 |
| SensorFusion (Arduino) | - | C++ | 多种 IMU 支持 | ESP32 端备选 |

- **选择**: `numpy.interp()` (MVP) → `imufusion` (Phase 2)
- **理由**: MVP 只需时间轴对齐，5 行代码足够；高级融合 Phase 2 再考虑
- **升级触发**: 当需要姿态四元数输出或更精确的方向估计时

```bash
# Phase 2 安装
pip install imufusion
```

```python
# Phase 2: 使用 imufusion 获取姿态
import imufusion
ahrs = imufusion.Ahrs()
ahrs.update_no_magnetometer(gyroscope, accelerometer, 1/100)  # 100Hz
euler = ahrs.quaternion.to_euler()  # [roll, pitch, yaw]
```

- **参考**: [x-io Fusion (1.7k⭐)](https://github.com/xioTechnologies/Fusion) | [pyIMU](https://github.com/uutzinger/pyIMU)

### 信号处理 Signal Processing

| 候选方案 | Stars | 用途 | 评估 |
|---------|-------|------|------|
| **scipy.signal** | 12k⭐ | 滤波、峰值检测 | ✅ 选择 |
| numpy | 27k⭐ | 零点交叉、基础计算 | ✅ 选择 |

```python
from scipy.signal import find_peaks, butter, filtfilt
import numpy as np

# 峰值检测 (击球瞬间)
peaks, properties = find_peaks(accel_z, height=5, distance=50)

# 零点交叉 (上杆顶点)
zero_crossings = np.where(np.diff(np.sign(gyro_z)))[0]

# 低通滤波 (去噪)
b, a = butter(4, 10, fs=100, btype='low')  # 10Hz 截止
filtered = filtfilt(b, a, raw_signal)
```

- **参考**: [scipy.signal.find_peaks](https://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.find_peaks.html)

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

| 数据集 | Stars | 内容 | 用途 | 链接 |
|-------|-------|------|-----|------|
| **GolfDB** | 300+⭐ | 1,400 挥杆视频，8 事件标注 | SwingNet 训练，相位检测 | [wmcnally/golfdb](https://github.com/wmcnally/golfdb) |
| AICaddy | 20+⭐ | 6,000+ 球杆头图像 | YOLOv8 球杆追踪 | [oswinkil-git/AICaddy](https://github.com/oswinkil-git/AICaddy-A-Golf-Club-Tracer) |
| golftracker | - | 视频处理工具包 | 挥杆检测 | [PyPI](https://pypi.org/project/golftracker/) |

- **主要数据集**: GolfDB
- **⚠️ 数据缺口**: 无公开数据集包含同步的 IMU + EMG + Video，**需自行录制**

### 开源挥杆分析代码

| 仓库 | Stars | 功能 | 技术栈 |
|-----|-------|------|--------|
| [HeleenaRobert/golf-swing-analysis](https://github.com/HeleenaRobert/golf-swing-analysis) | 50+⭐ | MediaPipe 姿态 + 关节角度计算 | Python |
| [Strojove-uceni/23206-final-pose-estimation](https://github.com/Strojove-uceni/23206-final-pose-estimation-for-swing-improvement) | 10+⭐ | 完整挥杆分析流程 + 反馈生成 | Python |

### 通用姿态

| 数据集 | 规模 | 内容 | 用途 |
|-------|------|------|-----|
| COCO Keypoints | 20万+ 图像 | 17 关节点标注 | 姿态模型评估 |
| Human3.6M | 360万帧 | 3D 人体动作 | 3D 姿态参考 |
| MPII Human Pose | 2.5万图像 | 16 关节点 | 基准测试 |

---

## 开发工具

### MLC 配置 (LSM6DSV16X)

<!-- markdown-link-check-disable -->
| 工具 | 用途 | 链接 |
|-----|------|-----|
| **MEMS Studio** | MLC 决策树训练，UCF 文件生成 | [ST 下载](https://www.st.com/en/embedded-software/mems-studio.html) |
| AN5804 | LSM6DSV16X MLC 应用笔记 | [PDF](https://www.st.com/resource/en/application_note/an5804-lsm6dsv16x-machine-learning-core-stmicroelectronics.pdf) |
<!-- markdown-link-check-enable -->
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
# Python (开发调试阶段)
mediapipe: "0.10.x"
neurokit2: "0.2.x"
opencv-python: "4.8.x"
numpy: "1.24.x"

# Swift iOS (Podfile)
MediaPipeTasksVision: "~> 0.10"  # Google 官方姿态检测 SDK
# 系统框架 (无需版本锁定):
# - AVFoundation (相机)
# - CoreBluetooth (BLE)
# - AVSpeechSynthesizer (TTS)

# Arduino (ESP32)
ESP32 Arduino Core: "2.0.x"
LSM6DSV16X (stm32duino): "latest"
```

---

## 相关文档

- [系统设计](../architecture/system-design.md) - 整体架构和数据流
- [ADR 决策记录](../decisions/index.md) - 架构决策快速参考
- [ADR-0007 Swift 原生 iOS 开发](0007-swift-ios-native.md) - 为什么选择 Swift 而非 Flutter
- [移动开发](../../development/mobile/development.md) - Swift iOS 开发指南

---

**最后更新**: 2025年12月25日
