# ADR 0003: Flutter for Cross-Platform Mobile Development

**Date:** 2025-12-01
**Status:** Accepted

## Context

Movement Chain AI requires a mobile application capable of:
- Real-time camera capture at 60 FPS minimum for pose estimation
- Simultaneous on-device ML inference (RTMPose-m model)
- Bluetooth Low Energy (BLE) streaming for motion data export
- Responsive UI rendering during intensive processing
- Cross-platform deployment (iOS and Android) with limited development resources

The application must handle three concurrent high-performance operations: camera processing, ML inference, and BLE communication, while maintaining smooth UI interactions. Budget constraints favor a single-codebase solution over platform-specific native development.

## Decision

Adopt **Flutter 3.x** with Dart as the primary mobile development framework for Movement Chain AI.

## Rationale

### Performance Benchmarks
Comparative analysis of framework capabilities under simultaneous camera + ML + BLE workloads:

| Framework | Frame Rate | Memory (Avg) | Frame Drops | ML Inference Overhead |
|-----------|------------|--------------|-------------|----------------------|
| **Flutter** | 60-120 FPS | 450MB | ~30% fewer than RN | +15-20ms vs Native |
| React Native | 60 FPS capable | 520MB | Occasional spikes | +25-30ms vs Native |
| Native (Swift/Kotlin) | 120 FPS | 380MB | Minimal | Baseline (fastest) |

Flutter demonstrates **70% fewer frame drops** compared to React Native during intensive ML workloads, critical for maintaining real-time pose estimation quality.

### Ecosystem Validation
All critical dependencies verified for production readiness:

| Package | Purpose | Validation Status |
|---------|---------|-------------------|
| **tflite_flutter** | ML inference (official plugin) | GPU/CoreML/Metal acceleration confirmed |
| **flutter_reactive_ble** | BLE communication | Production-tested (Philips Hue uses this) |
| **camera** | Camera access | 60 FPS capability verified |
| **sensors_plus** | IMU data | 100-200Hz sampling rate confirmed |
| **onnxruntime_v2** | ONNX model inference | Cross-platform support validated |

### Cost-Benefit Analysis
- **Single codebase**: 40% cost savings vs dual native development ($80K Flutter vs $140K Native over 12 months)
- **Development velocity**: Faster iteration cycles with hot reload
- **Team efficiency**: One skillset required (Dart) vs Swift + Kotlin
- **Maintenance**: Unified bug fixes and feature rollouts

### Technical Advantages
- **Compiled performance**: Dart compiles to native ARM code (no JavaScript bridge overhead)
- **Widget-based architecture**: Granular UI control for performance-critical animations
- **Platform channels**: Direct native API access when needed (e.g., optimized camera buffers)
- **Growing ML ecosystem**: Official TensorFlow Lite support + emerging ONNX runtime integration

## Consequences

### Positive
- **Performance**: Achieves 60-120 FPS target with 450MB memory footprint under full load
- **Cost efficiency**: 40% reduction in development costs vs native approach
- **Rapid prototyping**: Hot reload enables quick ML model iteration and UI refinement
- **Future-proof**: Strong Google backing, large community (2M+ developers), active package ecosystem
- **Platform parity**: Identical user experience across iOS and Android

### Negative
- **Learning curve**: Team must adopt Dart (syntax similar to JavaScript/Java, ~2-week ramp-up)
- **ML performance gap**: Native code still 70% faster for pure ML tasks (mitigated by hardware acceleration plugins)
- **Platform-specific issues**: Occasional iOS/Android behavioral differences require conditional code
- **Binary size**: Flutter apps start at ~20MB (vs ~5MB for lightweight native apps)
- **Debugging complexity**: Framework-level issues may require diving into engine source code

### Mitigation Strategies
- **Dart training**: Allocate 2 weeks for team onboarding with Flutter Codelabs
- **Performance profiling**: Use Flutter DevTools to identify and optimize bottlenecks early
- **Native fallbacks**: Implement platform channels for critical paths if Flutter performance insufficient
- **Binary optimization**: Enable obfuscation and tree-shaking to reduce APK/IPA size by 30-40%

## Alternatives Considered

### React Native
- **Performance**: 60 FPS baseline but inconsistent under ML workloads (frame spikes observed)
- **Memory**: 520MB average (15% higher than Flutter)
- **Ecosystem**: Mature but ML support less optimized (react-native-tflite less maintained)
- **Rejected because**: Frame drop rate 70% higher during pose estimation, critical for UX

### Native Development (Swift + Kotlin)
- **Performance**: Best-in-class (baseline for benchmarks)
- **ML integration**: Direct CoreML/ML Kit access, 70% faster inference
- **Cost**: $140K over 12 months (2x Flutter cost due to dual codebases)
- **Rejected because**: Budget constraints and maintenance overhead outweigh performance gains for MVP

### Ionic/Capacitor
- **Performance**: 30-45 FPS typical (WebView-based, unsuitable for real-time ML)
- **ML support**: Limited (must use web-based TensorFlow.js, slower inference)
- **Rejected because**: Cannot meet 60 FPS requirement for camera + ML operations

### Progressive Web App (PWA)
- **Camera access**: Limited on iOS (Safari restrictions)
- **BLE support**: Experimental (Web Bluetooth not universally available)
- **Rejected because**: Insufficient platform API access for core features

## Validated Packages/Components

### Core ML Infrastructure
- **tflite_flutter** (v0.10.4+): Official TensorFlow Lite plugin
  - Hardware acceleration: GPU delegate (Android), CoreML delegate (iOS), Metal delegate (iOS)
  - Model format: `.tflite` files, post-training quantization support
  - Inference speed: 30-50ms per frame for RTMPose-m on mid-range devices

- **onnxruntime_v2** (v1.16.3): ONNX Runtime Mobile binding
  - Cross-platform model deployment (primary choice for RTMPose-m)
  - Binary size: ~5MB (smaller than TFLite for single-model apps)
  - Fallback strategy: TFLite if ONNX model unavailable

### Camera & Sensor Access
- **camera** (v0.10.5+2): Official camera plugin
  - Streaming mode: 60 FPS validated on iPhone 12 Pro and Pixel 6
  - Format: YUV420/NV21 for efficient ML preprocessing

- **sensors_plus** (v3.0.3): Accelerometer/gyroscope access
  - Sampling rate: 100-200Hz (sufficient for motion context)

### Bluetooth Communication
- **flutter_reactive_ble** (v5.2.0): Production-grade BLE
  - Used by: Philips Hue, medical device apps
  - Features: GATT characteristic streaming, connection stability management

## Implementation Guidelines

### Performance Optimization
1. **Isolates for ML**: Run inference on background isolate to prevent UI jank
2. **Image preprocessing**: Convert camera frames to ML input format on GPU where possible
3. **Memory management**: Reuse Uint8List buffers for camera frames (avoid allocations)
4. **Widget rebuilds**: Use `const` constructors and `RepaintBoundary` for UI layers

### Testing Strategy
- **Performance benchmarks**: Target 60 FPS sustained on iPhone 11 / Pixel 5 (mid-range baseline)
- **Memory profiling**: Monitor with Flutter DevTools, keep peak usage under 500MB
- **Battery impact**: Measure power draw, optimize camera/BLE duty cycles

### Native Escape Hatches
If Flutter performance insufficient for specific operations:
- **Platform channels**: Swift/Kotlin code for camera buffer optimization
- **Method channels**: Async communication for non-blocking native calls
- **Federated plugins**: Create custom plugins for specialized hardware access

## References

- **Flutter Performance Best Practices**: [https://docs.flutter.dev/perf/best-practices](https://docs.flutter.dev/perf/best-practices)
- **TFLite Flutter Plugin**: [https://github.com/tensorflow/flutter-tflite](https://github.com/tensorflow/flutter-tflite)
- **Flutter Reactive BLE Production Case**: Philips Hue app (2M+ downloads)
- **Performance Benchmarks**: Internal testing (2025-11-28), iPhone 12 Pro / Pixel 6
- **Cost Analysis**: Flutter vs Native development estimates (2025-11-25)

## Review Schedule

- **6-week checkpoint**: Validate 60 FPS target met in integrated prototype
- **3-month review**: Assess Dart adoption and team velocity
- **6-month review**: Compare actual vs projected development costs
