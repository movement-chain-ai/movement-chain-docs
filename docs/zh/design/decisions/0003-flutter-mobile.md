# ADR 0003: Flutter 跨平台移动开发

**日期:** 2025-12-01
**状态:** 已接受

## 背景

Movement Chain AI 需要一个能够实现以下功能的移动应用：

- 最低 60 FPS 的实时相机捕获，用于姿态估计
- 同步设备端 ML 推理（RTMPose-m 模型）
- 用于运动数据导出的蓝牙低功耗 (BLE，Bluetooth Low Energy) 流式传输
- 在密集处理期间响应式 UI 渲染
- 在有限开发资源下跨平台部署（iOS 和 Android）

应用程序必须处理三个并发的高性能操作：相机处理、ML 推理和 BLE 通信，同时保持流畅的 UI 交互。预算限制倾向于单一代码库解决方案，而不是特定平台的原生开发。

## 决策

采用 **Flutter 3.x** 配合 Dart 作为 Movement Chain AI 的主要移动开发框架。

## 理由

### 性能基准

在同时进行相机 + ML + BLE 工作负载下的框架能力对比分析：

| 框架 | 帧率 | 内存（平均）| 掉帧 | ML 推理开销 |
|-----------|------------|--------------|-------------|----------------------|
| **Flutter** | 60-120 FPS | 450MB | 比 RN 少 ~30% | 比原生多 +15-20ms |
| React Native | 60 FPS 可达 | 520MB | 偶尔峰值 | 比原生多 +25-30ms |
| Native (Swift/Kotlin) | 120 FPS | 380MB | 最小 | 基准线（最快）|

在密集 ML 工作负载期间，Flutter 比 React Native 的掉帧减少 **70%**，这对保持实时姿态估计质量至关重要。

### 生态系统验证

所有关键依赖项均已验证生产就绪：

| 包 | 用途 | 验证状态 |
|---------|---------|-------------------|
| **tflite_flutter** | ML 推理（官方插件）| GPU/CoreML/Metal 加速已确认 |
| **flutter_reactive_ble** | BLE 通信 | 生产测试（Philips Hue 使用此插件）|
| **camera** | 相机访问 | 60 FPS 能力已验证 |
| **sensors_plus** | IMU 数据 | 100-200Hz 采样率已确认 |
| **onnxruntime_v2** | ONNX 模型推理 | 跨平台支持已验证 |

### 成本效益分析

- **单一代码库**: 相比双原生开发节省 40% 成本（12 个月内 $80K Flutter vs $140K 原生）
- **开发速度**: 通过热重载实现更快的迭代周期
- **团队效率**: 只需要一种技能（Dart）vs Swift + Kotlin
- **维护**: 统一的错误修复和功能发布

### 技术优势

- **编译性能**: Dart 编译为原生 ARM 代码（无 JavaScript 桥接开销）
- **基于 Widget 的架构**: 对性能关键动画的细粒度 UI 控制
- **平台通道**: 在需要时直接访问原生 API（例如优化的相机缓冲区）
- **不断增长的 ML 生态系统**: 官方 TensorFlow Lite 支持 + 新兴的 ONNX 运行时集成

## 后果

### 积极影响

- **性能**: 在全负载下以 450MB 内存占用实现 60-120 FPS 目标
- **成本效率**: 相比原生方法开发成本降低 40%
- **快速原型设计**: 热重载实现快速 ML 模型迭代和 UI 优化
- **面向未来**: Google 强大支持、大型社区（200 万+ 开发者）、活跃的包生态系统
- **平台一致性**: iOS 和 Android 之间的相同用户体验

### 消极影响

- **学习曲线**: 团队必须学习 Dart（语法类似于 JavaScript/Java，约 2 周学习期）
- **ML 性能差距**: 对于纯 ML 任务，原生代码仍快 70%（通过硬件加速插件缓解）
- **平台特定问题**: 偶尔的 iOS/Android 行为差异需要条件代码
- **二进制大小**: Flutter 应用起始约 20MB（vs 轻量级原生应用的约 5MB）
- **调试复杂性**: 框架级问题可能需要深入引擎源代码

### 缓解策略

- **Dart 培训**: 分配 2 周时间通过 Flutter Codelabs 进行团队入职
- **性能分析**: 使用 Flutter DevTools 及早识别和优化瓶颈
- **原生回退**: 如果 Flutter 性能不足，为关键路径实现平台通道
- **二进制优化**: 启用混淆和 tree-shaking，将 APK/IPA 大小减少 30-40%

## 考虑的替代方案

### React Native

- **性能**: 60 FPS 基准线，但在 ML 工作负载下不一致（观察到帧峰值）
- **内存**: 520MB 平均（比 Flutter 高 15%）
- **生态系统**: 成熟但 ML 支持优化较少（react-native-tflite 维护较少）
- **被拒绝的原因**: 在姿态估计期间掉帧率高 70%，对 UX 至关重要

### 原生开发 (Swift + Kotlin)

- **性能**: 同类最佳（基准线）
- **ML 集成**: 直接 CoreML/ML Kit 访问，推理快 70%
- **成本**: 12 个月内 $140K（由于双代码库，是 Flutter 成本的 2 倍）
- **被拒绝的原因**: 预算限制和维护开销超过 MVP 的性能增益

### Ionic/Capacitor

- **性能**: 30-45 FPS 典型（基于 WebView，不适合实时 ML）
- **ML 支持**: 有限（必须使用基于 web 的 TensorFlow.js，推理较慢）
- **被拒绝的原因**: 无法满足相机 + ML 操作的 60 FPS 要求

### 渐进式 Web 应用 (PWA)

- **相机访问**: iOS 上有限（Safari 限制）
- **BLE 支持**: 实验性（Web Bluetooth 不是普遍可用）
- **被拒绝的原因**: 核心功能的平台 API 访问不足

## 已验证的包/组件

### 核心 ML 基础设施

- **tflite_flutter** (v0.10.4+): 官方 TensorFlow Lite 插件
  - 硬件加速: GPU 委托（Android）、CoreML 委托（iOS）、Metal 委托（iOS）
  - 模型格式: `.tflite` 文件，支持训练后量化
  - 推理速度: 在中端设备上对 RTMPose-m 每帧 30-50ms

- **onnxruntime_v2** (v1.16.3): ONNX Runtime Mobile 绑定
  - 跨平台模型部署（RTMPose-m 的主要选择）
  - 二进制大小: 约 5MB（对于单模型应用比 TFLite 小）
  - 回退策略: 如果 ONNX 模型不可用则使用 TFLite

### 相机与传感器访问

- **camera** (v0.10.5+2): 官方相机插件
  - 流式模式: 在 iPhone 12 Pro 和 Pixel 6 上验证 60 FPS
  - 格式: YUV420/NV21 用于高效 ML 预处理

- **sensors_plus** (v3.0.3): 加速度计/陀螺仪访问
  - 采样率: 100-200Hz（足够运动上下文）

### 蓝牙通信

- **flutter_reactive_ble** (v5.2.0): 生产级 BLE
  - 使用者: Philips Hue、医疗设备应用
  - 功能: GATT 特征流式传输、连接稳定性管理

## 实施指南

### 性能优化

1. **Isolates 用于 ML**: 在后台 isolate 上运行推理以防止 UI 卡顿
2. **图像预处理**: 在可能的情况下在 GPU 上将相机帧转换为 ML 输入格式
3. **内存管理**: 为相机帧重用 Uint8List 缓冲区（避免分配）
4. **Widget 重建**: 为 UI 层使用 `const` 构造函数和 `RepaintBoundary`

### 测试策略

- **性能基准**: 在 iPhone 11 / Pixel 5（中端基准）上目标 60 FPS 持续
- **内存分析**: 使用 Flutter DevTools 监控，保持峰值使用低于 500MB
- **电池影响**: 测量功耗，优化相机/BLE 占空比

### 原生逃生舱

如果 Flutter 性能对特定操作不足：

- **平台通道**: 用于相机缓冲区优化的 Swift/Kotlin 代码
- **方法通道**: 用于非阻塞原生调用的异步通信
- **联合插件**: 为专门的硬件访问创建自定义插件

## 参考资料

- **Flutter 性能最佳实践**: [https://docs.flutter.dev/perf/best-practices](https://docs.flutter.dev/perf/best-practices)
- **TFLite Flutter 插件**: [https://github.com/tensorflow/flutter-tflite](https://github.com/tensorflow/flutter-tflite)
- **Flutter Reactive BLE 生产案例**: Philips Hue 应用（200 万+ 下载）
- **性能基准**: 内部测试（2025-11-28），iPhone 12 Pro / Pixel 6
- **成本分析**: Flutter vs 原生开发估算（2025-11-25）

## 审查计划

- **6 周检查点**: 在集成原型中验证是否达到 60 FPS 目标
- **3 个月审查**: 评估 Dart 采用和团队速度
- **6 个月审查**: 比较实际与预计开发成本
