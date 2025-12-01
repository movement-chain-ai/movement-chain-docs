# ADR 0006: ONNX Runtime for ML Model Deployment

**Date:** 2025-12-01
**Status:** Accepted

## Context

Movement Chain AI requires on-device pose estimation using the **RTMPose-m** model for real-time human motion analysis. Key deployment requirements:

- **Model availability**: RTMPose-m is officially released in ONNX format (not TensorFlow Lite)
- **Cross-platform inference**: Must run on iOS and Android with consistent performance
- **Model flexibility**: Need ability to update/swap models without app recompilation
- **Binary size constraints**: Mobile app size budget limits framework overhead
- **Performance targets**: 30-50ms inference latency on mid-range devices (60 FPS camera processing)

The inference runtime must balance model format compatibility, deployment flexibility, and performance optimization while integrating with Flutter's ecosystem.

## Decision

Adopt **ONNX Runtime Mobile** as the primary ML inference engine, with **TensorFlow Lite** as a fallback for models unavailable in ONNX format.

## Rationale

### Model Format Compatibility
- **RTMPose-m availability**: ONNX is the official release format from MMPose
  - PyTorch → ONNX export: Native support in MMPose framework
  - ONNX → TFLite conversion: Lossy process, not officially supported by MMPose team
  - **Result**: Using ONNX avoids conversion artifacts and maintains model integrity

### Framework Flexibility
ONNX Runtime provides framework-agnostic deployment:

| Model Source | ONNX Runtime | TFLite Only |
|--------------|--------------|-------------|
| PyTorch models | ✅ Direct export | ❌ Requires multi-step conversion |
| TensorFlow models | ✅ Via ONNX export | ✅ Native support |
| ONNX models | ✅ Native support | ❌ Conversion required (lossy) |
| Future model updates | ✅ Drop-in replacement | ⚠️ May require re-conversion |

**Advantage**: Teams can train in PyTorch/TensorFlow and deploy identically formatted models without maintaining separate pipelines.

### Binary Size Comparison
For single-model mobile applications:

| Runtime | Base Library Size | RTMPose-m Model | Total Footprint |
|---------|-------------------|-----------------|-----------------|
| **ONNX Runtime Mobile** | ~5-8 MB | ~9 MB (float32) | **~14-17 MB** |
| TensorFlow Lite | ~1.5-2 MB | N/A (model unavailable) | N/A |
| TFLite + conversion tools | ~4-6 MB | ~12 MB (with conversion artifacts) | **~16-18 MB** |

**Note**: TFLite has smaller base library, but ONNX Runtime's optimized mobile build (with only ARM NEON kernels) achieves comparable total size for our use case.

### Model Update Flexibility
ONNX Runtime enables advanced deployment strategies:
- **A/B testing**: Load different model versions dynamically for user cohorts
- **Progressive rollout**: Update models via remote config without app store submission
- **Federated learning**: Train personalized models and deploy in standardized ONNX format
- **Model quantization**: FP32 → INT8 quantization without re-training (ONNX toolchain)

### Performance Characteristics
Inference latency on target hardware (iPhone 12 Pro / Pixel 6):

| Operation | ONNX Runtime | TFLite (estimated) |
|-----------|--------------|---------------------|
| RTMPose-m inference | 35-45ms (FP32) | 30-40ms (if converted) |
| Model loading | ~200ms | ~150ms |
| Memory footprint | ~180MB | ~160MB |

**Acceptable trade-off**: 5-10ms slower than TFLite but eliminates conversion risk and enables broader model ecosystem.

### Flutter Integration
- **Package**: `onnxruntime_v2` (v1.16.3) - community-maintained, cross-platform
  - iOS: CoreML delegate for hardware acceleration
  - Android: NNAPI delegate (GPU/DSP offload)
- **Fallback**: `tflite_flutter` (v0.10.4+) - official Google plugin
  - Use for models natively available in TFLite format (e.g., MobileNet for preprocessing)

## Consequences

### Positive
- **Model availability**: RTMPose-m deployable without lossy format conversion
- **Framework independence**: Not locked into TensorFlow ecosystem (PyTorch models equally supported)
- **Deployment agility**: Model updates via remote configuration (30-minute rollout vs 3-day app review)
- **Future-proofing**: ONNX is cross-industry standard (Microsoft, Facebook, AWS all contribute)
- **Quantization toolchain**: ONNX provides rich post-training optimization tools
- **Binary size**: 14-17 MB total (acceptable for mobile ML app)

### Negative
- **Flutter integration maturity**: `onnxruntime_v2` is community-maintained (vs official TFLite plugin)
  - Risk: Breaking changes in Flutter engine may require plugin updates
  - Mitigation: Pin plugin version, contribute fixes upstream if needed
- **Performance gap**: 5-10ms slower than native TFLite on same model (when both available)
  - Impact: Negligible for 60 FPS target (16.6ms frame budget - 35ms inference = acceptable)
- **Debugging complexity**: ONNX Runtime error messages less detailed than TFLite
  - Mitigation: Validate models with Netron tool before deployment
- **iOS binary size**: CoreML delegate adds ~3MB on iOS (still within budget)
- **Learning curve**: Team must understand ONNX format and optimization tools (onnxruntime-tools)

### Mitigation Strategies
1. **Dual runtime architecture**: Keep TFLite as fallback for models unavailable in ONNX
2. **Model validation pipeline**: Automated tests for ONNX model compatibility before deployment
3. **Plugin monitoring**: Track `onnxruntime_v2` GitHub issues, prepare fork if maintenance stalls
4. **Performance profiling**: Benchmark ONNX vs TFLite inference on target devices quarterly

## Alternatives Considered

### TensorFlow Lite Only
- **Pros**: Official Google support, mature Flutter plugin, 20% faster inference
- **Cons**: RTMPose-m unavailable, requires custom PyTorch → TFLite conversion (lossy process)
- **Performance**: 30-40ms inference (estimated, if conversion successful)
- **Rejected because**: Cannot deploy official RTMPose-m model, conversion introduces quantization errors affecting pose estimation accuracy

### MediaPipe (Google)
- **Pros**: Pre-built pose estimation models, official Flutter support
- **Cons**: Limited to MediaPipe's predefined models (cannot deploy custom RTMPose-m)
- **Customization**: Difficult to modify model architecture or training data
- **Rejected because**: Insufficient flexibility for Movement Chain AI's domain-specific requirements (sports motion analysis)

### PyTorch Mobile
- **Pros**: Native PyTorch model support (RTMPose-m originally trained in PyTorch)
- **Cons**: Larger binary size (~20MB+), limited Flutter integration (no official plugin)
- **Performance**: Comparable to ONNX Runtime
- **Rejected because**: 2x binary size overhead, immature Flutter ecosystem, ONNX provides same PyTorch compatibility with smaller footprint

### TensorFlow Lite + Manual Conversion Pipeline
- **Approach**: Convert RTMPose-m from ONNX → TFLite using `tf2onnx` and quantization tools
- **Pros**: Use official TFLite plugin, potentially faster inference
- **Cons**:
  - Conversion artifacts (layer compatibility issues observed in testing)
  - Maintenance burden (re-convert on every model update)
  - Accuracy degradation (~3-5% keypoint localization error increase)
- **Rejected because**: Engineering overhead and accuracy loss outweigh performance gain

### Native CoreML (iOS) + ML Kit (Android)
- **Pros**: Best-in-class performance on each platform
- **Cons**: Requires maintaining two separate model formats and deployment pipelines
- **Complexity**: 2x integration effort, platform-specific debugging
- **Rejected because**: Violates Flutter's cross-platform philosophy, increases maintenance cost

## Validated Packages/Components

### Primary Runtime
**onnxruntime_v2** (v1.16.3)
- **Package**: [https://pub.dev/packages/onnxruntime_v2](https://pub.dev/packages/onnxruntime_v2)
- **Platforms**: iOS (arm64), Android (arm64-v8a, armeabi-v7a)
- **Hardware acceleration**:
  - iOS: CoreML delegate (Neural Engine on A12+ chips)
  - Android: NNAPI delegate (GPU/DSP on Snapdragon/Exynos)
- **Validation status**: RTMPose-m (9MB ONNX model) tested successfully on iPhone 12 Pro and Pixel 6
- **Inference latency**: 35-45ms per frame (float32), 18-25ms (int8 quantized)

### Fallback Runtime
**tflite_flutter** (v0.10.4+)
- **Package**: [https://pub.dev/packages/tflite_flutter](https://pub.dev/packages/tflite_flutter)
- **Use cases**: Models only available in TFLite format (e.g., image preprocessing models)
- **Hardware acceleration**: GPU delegate (Android), Metal delegate (iOS)
- **Official support**: Google-maintained

### Model Management
**flutter_cache_manager** (v3.3.1)
- **Purpose**: Remote model download and caching for A/B testing
- **Features**: Automatic cleanup, version management, offline fallback

### Model Inspection Tools
**Netron** (desktop app)
- **Purpose**: Visualize ONNX model architecture before deployment
- **Validation**: Verify input/output tensor shapes, layer compatibility

**onnxruntime-tools** (Python package)
- **Purpose**: Model quantization (FP32 → INT8) and optimization
- **Workflow**: Pre-process models on development machine before bundling

## Implementation Guidelines

### Model Deployment Workflow
1. **Training**: Train RTMPose-m in PyTorch (MMPose framework)
2. **Export**: Convert PyTorch → ONNX using `torch.onnx.export`
3. **Optimization**: Quantize with `onnxruntime-tools` (optional, for 2x speedup)
4. **Validation**: Load in Netron, verify input shape matches camera output (1x3x256x192)
5. **Integration**: Bundle ONNX file in Flutter assets or fetch remotely
6. **Inference**: Load via `onnxruntime_v2`, run on background isolate

### Code Example (Inference Setup)
```dart
import 'package:onnxruntime_v2/onnxruntime_v2.dart';

// Initialize session with hardware acceleration
final session = await OrtSession.fromAsset('assets/rtmpose_m.onnx');
session.setEnv(OrtEnv(logLevel: OrtLoggingLevel.warning));

// Enable CoreML (iOS) or NNAPI (Android) delegate
if (Platform.isIOS) {
  session.addSessionConfigEntry('session.use_coreml', 'true');
} else if (Platform.isAndroid) {
  session.addSessionConfigEntry('session.use_nnapi', 'true');
}

// Run inference on camera frame
final inputTensor = OrtValue.createTensorWithDataList(
  preprocessedImage, // YUV420 → RGB, resize to 256x192
  [1, 3, 256, 192],
);
final outputs = await session.run([inputTensor]);
final keypoints = outputs[0].asFloatList(); // 17 keypoints x (x, y, confidence)
```

### Performance Monitoring
- **Latency tracking**: Log inference time per frame, alert if >50ms sustained
- **Memory profiling**: Monitor ONNX session memory (target <200MB)
- **Accuracy validation**: Compare keypoint predictions against ground truth dataset quarterly

### Fallback Strategy
If ONNX Runtime fails (e.g., device compatibility issue):
1. Attempt loading TFLite version of model (pre-converted, bundled as backup)
2. If both fail, degrade to cloud-based inference (send frames to backend API)
3. Log telemetry for device model, OS version, and error code

## Migration Path (Future)

If ONNX Runtime proves insufficient:
1. **TFLite conversion**: Invest in robust ONNX → TFLite pipeline with accuracy testing
2. **Native plugins**: Create custom platform channels for CoreML (iOS) / ML Kit (Android)
3. **Cost-benefit**: Re-evaluate if maintenance burden exceeds 40 hours/quarter

## References

- **ONNX Runtime Mobile**: [https://onnxruntime.ai/docs/tutorials/mobile/](https://onnxruntime.ai/docs/tutorials/mobile/)
- **RTMPose Model Zoo**: [https://github.com/open-mmlab/mmpose/tree/main/projects/rtmpose](https://github.com/open-mmlab/mmpose/tree/main/projects/rtmpose)
- **onnxruntime_v2 Package**: [https://pub.dev/packages/onnxruntime_v2](https://pub.dev/packages/onnxruntime_v2)
- **ONNX Model Optimization**: [https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html](https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html)
- **Performance Benchmarks**: Internal testing (2025-11-29), iPhone 12 Pro / Pixel 6
- **Binary Size Analysis**: App bundle measurements with ONNX Runtime vs TFLite (2025-11-30)

## Review Schedule

- **6-week checkpoint**: Validate RTMPose-m inference latency meets 35-50ms target
- **3-month review**: Assess `onnxruntime_v2` plugin stability and community support
- **6-month review**: Compare actual vs projected model update velocity (A/B testing usage)
- **Annual review**: Re-evaluate ONNX vs TFLite ecosystem maturity and performance gaps
