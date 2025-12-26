# ADR 0007: Swift 原生 iOS 开发

**日期:** 2025-12-25
**状态:** 已接受

## 背景

最初考虑使用 Flutter 作为跨平台移动开发框架。然而，在深入研究 SDK 兼容性后，发现了关键的性能问题：

### 发现的问题

**MediaPipe 姿态检测在 Flutter 中的性能瓶颈：**

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    Flutter 姿态检测架构                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Flutter (Dart)                                                        │
│       │                                                                  │
│       ▼                                                                  │
│   google_mlkit_pose_detection (Flutter 插件)                            │
│       │                                                                  │
│       ▼                                                                  │
│   ┌─────────────────────────────────────────┐                           │
│   │      Platform Channel (性能瓶颈)        │  ← 每帧数据序列化/反序列化 │
│   │      - 方法调用开销                      │                           │
│   │      - 图像数据复制                      │                           │
│   │      - 结果回传延迟                      │                           │
│   └─────────────────────────────────────────┘                           │
│       │                                                                  │
│       ▼                                                                  │
│   原生 MediaPipe SDK (Swift/Kotlin)                                     │
│                                                                          │
│   ⚠️ 官方文档明确指出: "notable latency" (显著延迟)                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**关键发现：**

1. **MediaPipe 没有官方 Dart/Flutter SDK** - Google 只提供 iOS (Swift)、Android (Kotlin)、Python、JavaScript SDK
2. **google_mlkit_pose_detection 是社区维护的桥接层** - 通过 Platform Channel 调用原生 SDK
3. **每帧都有桥接开销** - 对于 60 FPS 实时姿态检测，这是不可接受的

### Flutter 方案的问题

| 假设 | 原本理解 | 实际情况 |
|------|-------------------|----------|
| **ML 推理** | tflite_flutter 可满足需求 | 姿态检测需要 MediaPipe，不是通用 TFLite |
| **姿态检测** | Flutter 生态有解决方案 | 只有带 Platform Channel 延迟的桥接方案 |
| **开发成本** | 是主要考量因素 | 用户明确表示**开发成本不是问题** |
| **目标平台** | iOS + Android | **MVP 仅针对 iOS** |

## 决策

采用 **Swift 原生开发**，使用 **MediaPipe iOS SDK (MediaPipeTasksVision)** 进行姿态检测。

### iOS 原生技术栈

```swift
// 完整的 iOS 原生技术栈
import MediaPipeTasksVision  // 姿态检测 (33 关键点)
import CoreBluetooth         // BLE 通信
import AVFoundation          // 相机捕获
import AVSpeechSynthesizer   // 语音反馈 (TTS)
import CoreML                // 未来 ML 模型 (可选)
```

## 理由

### 1. 消除 Platform Channel 延迟

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    Swift 原生姿态检测架构                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Swift App                                                             │
│       │                                                                  │
│       ▼                                                                  │
│   MediaPipeTasksVision (官方 iOS SDK)                                   │
│       │                                                                  │
│       ▼                                                                  │
│   CMSampleBuffer (零拷贝相机帧)                                         │
│       │                                                                  │
│       ▼                                                                  │
│   PoseLandmarkerResult (33 关键点 + 置信度)                             │
│                                                                          │
│   ✅ 无桥接开销                                                         │
│   ✅ 直接内存访问                                                        │
│   ✅ 官方 SDK 支持                                                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. MediaPipe iOS SDK 能力验证

| 能力 | MediaPipe iOS SDK | 说明 |
|------|------------------|------|
| **关键点数量** | 33 个 | 包含手腕细节，适合高尔夫挥杆分析 |
| **安装方式** | CocoaPods / SPM | `pod 'MediaPipeTasksVision'` |
| **性能** | 原生速度 | 无 Platform Channel 开销 |
| **文档** | 官方完整 | [developers.google.com/mediapipe](https://developers.google.com/mediapipe) |

### 3. 完整 SDK 对比

| 功能 | Flutter 方案 | Swift 原生方案 |
|------|-------------|---------------|
| **姿态检测** | google_mlkit_pose_detection (有延迟) | MediaPipeTasksVision (官方) |
| **相机** | camera 插件 | AVFoundation (原生) |
| **BLE** | flutter_reactive_ble | CoreBluetooth (原生) |
| **TTS** | flutter_tts | AVSpeechSynthesizer (原生) |
| **ML 推理** | onnxruntime_v2 (Platform Channel) | CoreML / ONNX Runtime C++ |

### 4. 为什么 MediaPipe 优于 Apple Vision

| 特性 | MediaPipe Pose | Apple Vision |
|------|---------------|--------------|
| **关键点数量** | 33 | ~19 |
| **手腕细节** | ✅ 有 | ❌ 有限 |
| **开源** | ✅ 是 | ❌ 否 |
| **跨平台一致性** | ✅ iOS/Android 相同 | ❌ 仅 Apple |
| **高尔夫适用性** | ✅ 手腕追踪关键 | ⚠️ 手腕信息不足 |

### 5. 代码示例：Swift + MediaPipe

```swift
import MediaPipeTasksVision
import AVFoundation

class PoseDetectionService {
    private var poseLandmarker: PoseLandmarker?

    func setup() throws {
        let options = PoseLandmarkerOptions()
        options.baseOptions.modelAssetPath = "pose_landmarker.task"
        options.runningMode = .liveStream
        options.poseLandmarkerLiveStreamDelegate = self
        options.numPoses = 1

        poseLandmarker = try PoseLandmarker(options: options)
    }

    func processFrame(_ sampleBuffer: CMSampleBuffer, timestamp: Int) {
        guard let image = try? MPImage(sampleBuffer: sampleBuffer) else { return }
        try? poseLandmarker?.detectAsync(image: image, timestampInMilliseconds: timestamp)
    }
}

extension PoseDetectionService: PoseLandmarkerLiveStreamDelegate {
    func poseLandmarker(
        _ poseLandmarker: PoseLandmarker,
        didFinishDetection result: PoseLandmarkerResult?,
        timestampInMilliseconds: Int,
        error: Error?
    ) {
        guard let landmarks = result?.landmarks.first else { return }

        // 33 个关键点，包含高尔夫关键的手腕数据
        let leftWrist = landmarks[15]   // 左手腕
        let rightWrist = landmarks[16]  // 右手腕
        let leftShoulder = landmarks[11] // 左肩
        let rightShoulder = landmarks[12] // 右肩

        // 计算 X-Factor 等指标...
    }
}
```

## 后果

### 积极影响

- **最佳性能**: 消除 Platform Channel 延迟，实现真正的 60+ FPS 姿态检测
- **官方 SDK 支持**: 使用 Google 官方维护的 MediaPipeTasksVision
- **更简单的调试**: 原生 Xcode 工具链，无需跨框架调试
- **完整 33 关键点**: MediaPipe 提供的手腕细节对高尔夫分析至关重要
- **iOS 生态整合**: 直接使用 CoreBluetooth、AVFoundation 等系统框架

### 消极影响

- **仅 iOS**: MVP 阶段不支持 Android（需要后续单独开发 Kotlin 版本）
- **开发成本增加**: 单平台开发，无法复用代码到 Android
- **团队技能**: 需要 Swift/iOS 开发经验

### 成本权衡

用户明确表示**开发成本不是主要考量因素**。在 SDK 兼容性和性能之间，选择性能。

| 方面 | Flutter | Swift 原生 |
|------|---------|-----------|
| **开发成本** | 较低 (单代码库) | 较高 (需单独 Android) |
| **姿态检测性能** | 有延迟 | 最佳 |
| **SDK 官方支持** | 无 | 有 |
| **用户体验** | 可能有卡顿 | 流畅 |
| **长期维护** | 依赖社区桥接 | 官方 SDK 更新 |

## 考虑的替代方案

### 继续使用 Flutter + google_mlkit_pose_detection

- **问题**: Platform Channel 的 "notable latency" 无法消除
- **被拒绝原因**: 性能无法满足实时姿态检测需求

### Flutter + 自定义 Platform Channel 优化

- **问题**: 仍需跨层传输图像数据，瓶颈在架构层面
- **被拒绝原因**: 优化空间有限，不如直接原生开发

### React Native + 原生模块

- **问题**: 同样需要 Bridge，且 React Native 性能更差
- **被拒绝原因**: 比 Flutter 更不适合

### Apple Vision Framework

- **问题**: 只有 ~19 个关键点，缺乏手腕细节
- **被拒绝原因**: 对高尔夫挥杆分析信息不足

## 实施指南

### 项目设置

```bash
# 使用 CocoaPods 安装 MediaPipe
pod init
# 在 Podfile 中添加:
# pod 'MediaPipeTasksVision'
pod install
```

### 关键依赖

| 依赖 | 用途 | 安装方式 |
|------|------|---------|
| MediaPipeTasksVision | 姿态检测 | CocoaPods / SPM |
| CoreBluetooth | BLE 通信 | 系统框架 |
| AVFoundation | 相机访问 | 系统框架 |
| Combine | 响应式编程 | 系统框架 |

### 架构建议

```text
movement-chain-mobile-ios/
├── Sources/
│   ├── App/
│   │   └── MovementChainApp.swift
│   ├── Features/
│   │   ├── PoseDetection/
│   │   │   ├── PoseDetectionService.swift
│   │   │   └── PoseLandmarkMapper.swift
│   │   ├── BLE/
│   │   │   ├── BLEManager.swift
│   │   │   └── IMUDataParser.swift
│   │   └── SwingAnalysis/
│   │       ├── SwingPhaseDetector.swift
│   │       └── XFactorCalculator.swift
│   ├── Core/
│   │   ├── Camera/
│   │   │   └── CameraService.swift
│   │   └── Audio/
│   │       └── TTSService.swift
│   └── Models/
│       ├── PoseLandmark.swift
│       └── SwingMetrics.swift
├── Resources/
│   └── pose_landmarker.task
└── Tests/
```

## 迁移计划

### 代码仓库变更

| 仓库 | 变更 |
|------|------|
| movement-chain-mobile | 重命名为 `movement-chain-mobile-ios`，使用 Swift |
| 未来 Android | 新建 `movement-chain-mobile-android`，使用 Kotlin |

## 参考资料

- **MediaPipe iOS 指南**: [developers.google.com/mediapipe/solutions/vision/pose_landmarker/ios](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/ios)
- **MediaPipe GitHub**: [github.com/google/mediapipe](https://github.com/google/mediapipe)
- **google_mlkit 延迟问题**: [pub.dev/packages/google_mlkit_pose_detection](https://pub.dev/packages/google_mlkit_pose_detection) - 官方文档明确提及 "notable latency"

## 审查计划

- **2 周检查点**: 验证 MediaPipeTasksVision 在 iPhone 上的实际帧率
- **1 个月审查**: 评估 Swift 开发进度和团队适应情况
- **MVP 完成后**: 评估是否需要 Android 版本及开发方式

---

**最后更新**: 2025-12-25
