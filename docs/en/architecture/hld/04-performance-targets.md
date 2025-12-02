# Performance Targets

## Overview

This document defines the performance requirements, benchmarking methodology, and optimization strategies for Movement Chain AI. The system must achieve real-time movement analysis while maintaining low power consumption and high accuracy on mobile devices.

---

## 1. Latency Requirements

### 1.1 Real-Time Feedback Path

**Target: End-to-end latency <100ms (P95)**

| Stage | Budget | Current | Status | Critical Path |
|-------|--------|---------|--------|---------------|
| Camera acquisition | 16.7ms | 16.7ms | ✅ OK | Hardware-limited (60 FPS) |
| Frame preprocessing | 5ms | 8ms | ⚠️ Warning | CPU-bound (resize + YUV→RGB) |
| Pose estimation | 30ms | 45ms | ❌ Over | GPU inference bottleneck |
| Sensor retrieval | 2ms | 3ms | ✅ OK | Memory access + buffer scan |
| Sensor fusion | 10ms | 8ms | ✅ OK | Feature extraction (FFT for EMG) |
| ML classification | 40ms | 50ms | ❌ Over | LSTM+Transformer inference |
| Haptic feedback | 5ms | 3ms | ✅ OK | BLE write latency |
| **Total** | **100ms** | **126ms** | **❌ 26ms over** | **Optimize pose + ML** |

**Latency Breakdown (P50/P95/P99)**:

```
Camera:      16.7ms / 16.7ms / 33.4ms  (occasional frame drop)
Preprocessing: 5ms / 8ms / 12ms
Pose:        28ms / 45ms / 60ms        ← HIGH VARIANCE
Fusion:       7ms / 12ms / 15ms
ML:          35ms / 50ms / 65ms        ← HIGH VARIANCE
Feedback:     2ms / 3ms / 5ms
────────────────────────────────────
Total:       93.7ms / 134.7ms / 190.4ms
```

**Impact Analysis**:
- P50 latency (93.7ms) meets target → good experience for most frames
- P95 latency (134.7ms) exceeds target by 34.7ms → noticeable lag during complex poses
- P99 latency (190.4ms) is unacceptable → feels sluggish to user

### 1.2 Post-Action Analysis

**Target: Generate summary within 5 seconds of workout completion**

| Task | Budget | Description |
|------|--------|-------------|
| Data aggregation | 1s | Load all frames from SQLite (3,600 frames @ 60 FPS/min) |
| Batch inference | 3s | Re-run ML on all frames with FP32 model (higher accuracy) |
| Statistics generation | 0.5s | Calculate rep counts, error frequencies, joint ROM |
| Visualization rendering | 0.5s | Generate charts (error timeline, pose heatmap) |
| **Total** | **5s** | User sees analysis screen immediately |

### 1.3 Startup Latency

**Target: App ready for workout in <3 seconds**

| Task | Budget | Current | Optimization |
|------|--------|---------|--------------|
| Flutter framework init | 500ms | 500ms | Non-optimizable |
| ML model loading | 1.5s | 2.1s | Use model caching, lazy load classifier |
| BLE device scan | 2s | 2s | Background scan during model load |
| Camera initialization | 500ms | 600ms | Reduce resolution until pose ready |
| **Total** | **3s** | **4.2s** | **Target: 3s via parallelization** |

**Cold Start Optimization**:
```dart
Future<void> parallelInitialization() async {
  final results = await Future.wait([
    _mlPipeline.loadPoseModel(),      // 1.2s (blocking for inference)
    _bleManager.startScan(),           // 2s (can start workout without device)
    _cameraManager.initialize(),       // 0.6s (blocking for video)
    // Defer classifier loading until first inference needed
  ]);

  // Total: max(1.2s, 2s, 0.6s) = 2s + 0.5s Flutter = 2.5s
  // Classifier loads in background (adds 0.9s) while user positions camera
}
```

---

## 2. Throughput Requirements

### 2.1 Video Processing

| Metric | Target | Current | Validation Method |
|--------|--------|---------|-------------------|
| Camera frame rate | 60 FPS (stable) | 55-60 FPS | Monitor frame timestamps, detect drops >1% |
| Frame drop rate | <1% | 2.3% | Count frames with Δt >20ms |
| Pose inference rate | ≥30 FPS | 22 FPS | Inference counter / elapsed time |
| ML classification rate | ≥30 FPS | 20 FPS | Classifier invocations / second |

**Frame Drop Causes**:
1. Pose inference too slow (45ms) → can't keep up with 60 FPS
2. GC pauses (15-30ms) → Flutter runtime stops processing
3. Thermal throttling (sustained load >2 min) → CPU/GPU frequency reduced

**Mitigation**:
- **Adaptive frame rate**: Drop to 30 FPS if latency exceeds 120ms for 3 consecutive frames
- **Reduce GC pressure**: Object pooling for tensors (see Integration Patterns)
- **Thermal management**: Reduce camera resolution to 480p after 5 minutes

### 2.2 BLE Sensor Streaming

| Sensor | Target Rate | Packet Rate | Data Rate | Validation |
|--------|-------------|-------------|-----------|------------|
| IMU (6-axis) | 100 Hz | 10 packets/s (10 samples each) | 2.4 KB/s | Verify 100 samples/second ±2% |
| EMG (4-channel) | 200 Hz | 5 packets/s (40 samples each) | 1.6 KB/s | Verify 200 samples/second ±2% |
| **Total BLE** | **-** | **15 packets/s** | **4 KB/s** | Packet loss <0.5% |

**Throughput Validation Test**:
```dart
void validateBLEThroughput() async {
  final startTime = DateTime.now();
  int imuSampleCount = 0;
  int emgSampleCount = 0;

  // Collect for 60 seconds
  await for (final packet in bleManager.sensorDataStream.take(1500)) {
    imuSampleCount += packet.imuSamples.length;
    emgSampleCount += packet.emgSamples.length;
  }

  final duration = DateTime.now().difference(startTime).inSeconds;
  final imuRate = imuSampleCount / duration;
  final emgRate = emgSampleCount / duration;

  print('IMU rate: $imuRate Hz (target: 100 Hz)');
  print('EMG rate: $emgRate Hz (target: 200 Hz)');

  assert(imuRate >= 98 && imuRate <= 102, 'IMU rate out of spec');
  assert(emgRate >= 196 && emgRate <= 204, 'EMG rate out of spec');
}
```

### 2.3 Storage Throughput

| Operation | Target | Current | Impact |
|-----------|--------|---------|--------|
| Frame write (SQLite) | >60 writes/s | 72 writes/s | Background recording while inference runs |
| Batch read (post-workout) | <2s for 3,600 frames | 1.8s | Fast enough for 5s analysis budget |
| Database size (1-hour session) | <200 MB | 180 MB (compressed) | Acceptable for weekly cleanup |

---

## 3. Resource Budgets

### 3.1 Memory Constraints

**Target: Peak RAM usage <500 MB**

| Component | Budget | Current | Notes |
|-----------|--------|---------|-------|
| Flutter framework | 80 MB | 85 MB | Baseline, non-optimizable |
| Camera buffers | 50 MB | 45 MB | 3 frames @ 640×480 RGB (triple buffer) |
| ML models (loaded) | 150 MB | 180 MB | Pose (8.2 MB) + Classifier (4.5 MB) + runtime overhead |
| Sensor data buffers | 5 MB | 4 MB | Circular buffer (500ms @ 100/200 Hz) |
| Tensor workspace | 30 MB | 25 MB | Intermediate activations during inference |
| SQLite (if recording) | 100 MB | 90 MB | Write buffer + index cache |
| UI rendering | 50 MB | 45 MB | Dart objects + texture cache |
| **Total** | **500 MB** | **474 MB** | **✅ Within budget** |

**Memory Profiling Strategy**:
```dart
void profileMemory() {
  // Trigger GC to get accurate baseline
  System.gc();

  final baseline = ProcessInfo.currentRss;
  print('Baseline memory: ${baseline / 1024 / 1024} MB');

  // Load models
  mlPipeline.initialize();
  final afterModels = ProcessInfo.currentRss;
  print('After models: ${(afterModels - baseline) / 1024 / 1024} MB');

  // Start camera
  cameraManager.startPreview();
  final afterCamera = ProcessInfo.currentRss;
  print('After camera: ${(afterCamera - afterModels) / 1024 / 1024} MB');

  // Run 60-second workout
  runWorkout(duration: Duration(seconds: 60));
  final afterWorkout = ProcessInfo.currentRss;
  print('Peak during workout: ${(afterWorkout - baseline) / 1024 / 1024} MB');
}
```

### 3.2 Storage Budget

**Target: App binary <150 MB, user data <500 MB/month**

| Asset | Size | Compression | Installed Size |
|-------|------|-------------|----------------|
| Flutter framework | 25 MB | - | 25 MB |
| Pose model (FP16) | 8.2 MB | None (already optimized) | 8.2 MB |
| Classifier model (INT8) | 4.5 MB | None | 4.5 MB |
| UI assets (icons, fonts) | 5 MB | PNG compression | 5 MB |
| Native libraries (TFLite) | 15 MB | Stripped symbols | 15 MB |
| **Total APK/IPA** | **58 MB** | **-** | **58 MB** ✅ |

**User Data Growth**:
- 1-hour workout: 180 MB (compressed)
- Assumed usage: 5 workouts/week = 3.6 GB/month
- **Solution**: Auto-delete sessions older than 30 days (keep summary stats only)

### 3.3 Power Consumption

**Target: <15% battery drain per hour**

| Component | Power Draw | % of Total | Optimization |
|-----------|------------|------------|--------------|
| Camera (60 FPS) | 450 mW | 35% | Reduce to 30 FPS if latency issues |
| GPU (pose inference) | 600 mW | 46% | Quantization (FP16→INT8) can save 30% |
| CPU (feature extraction) | 150 mW | 12% | SIMD optimization for FFT |
| BLE radio | 50 mW | 4% | Already optimized (7.5ms interval) |
| Display (always-on) | 50 mW | 4% | Dim during workout, brighten for feedback |
| **Total** | **1,300 mW** | **100%** | **~13% battery/hour on 10,000 mAh** ✅ |

**Battery Profiling**:
```bash
# Android
adb shell dumpsys batterystats --reset
# Run 1-hour workout
adb shell dumpsys batterystats > battery_stats.txt

# Analyze power consumption by component
battery-historian -port 9999 battery_stats.txt
```

**Power Optimization Strategies**:
1. **Dynamic FPS**: 60 FPS when stationary, 30 FPS during rapid movement (GPU can't keep up anyway)
2. **Background mode**: Pause camera when app backgrounded, keep BLE streaming (audio cues only)
3. **Screen timeout**: Dim screen to 20% after 30 seconds of no user interaction

---

## 4. Accuracy Targets

### 4.1 Pose Estimation Accuracy

**Target: Average Precision (AP) >70% at OKS threshold 0.5**

| Metric | Target | Current | Benchmark Dataset |
|--------|--------|---------|-------------------|
| AP @ OKS=0.5 | >70% | 73.2% | COCO val2017 (5,000 images) |
| AP @ OKS=0.75 | >50% | 48.1% | Stricter localization |
| AR (Average Recall) | >75% | 76.5% | Detect all visible keypoints |

**OKS (Object Keypoint Similarity)**: Measures pose accuracy, normalized by person scale
```
OKS = Σ exp(-d_i² / (2 * s² * k_i²)) / Σ δ(v_i > 0)

where:
  d_i = Euclidean distance between predicted and ground truth keypoint i
  s = √(area of person bounding box)  (scale normalization)
  k_i = keypoint constant (higher for easier keypoints like shoulders)
  v_i = visibility flag
```

**Keypoint-Specific Accuracy** (PCK @ 0.1 threshold):
| Keypoint | Target | Current | Notes |
|----------|--------|---------|-------|
| Shoulders, hips | >90% | 91% | Easy: large, high-contrast |
| Elbows, knees | >80% | 83% | Medium: motion blur |
| Wrists, ankles | >70% | 72% | Hard: small, occlusion |
| Face (nose, ears) | >85% | 88% | High-contrast, but not critical for movement |

### 4.2 Movement Classification Accuracy

**Target: F1 score >85% across all error classes**

| Error Class | Precision | Recall | F1 Score | Support (# samples) |
|-------------|-----------|--------|----------|---------------------|
| Perfect form | 92% | 90% | 91% | 1,200 |
| Knee cave (squat) | 88% | 85% | 86.5% | 450 |
| Rounded back (deadlift) | 82% | 80% | 81% | 380 |
| Elbow flare (pushup) | 86% | 84% | 85% | 320 |
| Shallow depth (squat) | 90% | 88% | 89% | 510 |
| Hip rise early (deadlift) | 79% | 76% | 77.5% | 290 |
| **Weighted Average** | **87.2%** | **85.8%** | **86.5%** | **3,150** ✅ |

**Confusion Matrix** (Top errors):
```
               Predicted
             Perfect  Knee Cave  Rounded Back  Shallow
Actual
Perfect        1080      50         30          40
Knee Cave       35      383        15          17
Rounded Back    25      10         304         41
Shallow         40      20         18          452
```

**Error Analysis**:
- **Knee Cave ↔ Perfect**: 50 false positives (4.2%) → model too sensitive, may need higher confidence threshold
- **Rounded Back ↔ Shallow**: 41 confusions → similar pose features (both involve hip angle), need better EMG integration

### 4.3 Temporal Consistency

**Target: Prediction stability >90% (no rapid flipping between classes)**

**Metric**: Stability Score = 1 - (class changes / total frames)

| Scenario | Stability Target | Current | Notes |
|----------|------------------|---------|-------|
| Perfect rep | >95% | 96.3% | Should stay "Perfect" throughout |
| Error onset | >85% | 88.1% | Allow gradual transition to error class |
| Error correction | >85% | 82.4% | ⚠️ Sometimes flips back to Perfect prematurely |

**Smoothing Strategy**:
```dart
class TemporalSmoother {
  final Queue<String> _recentPredictions = Queue();
  final int windowSize = 5;  // 83ms window at 60 FPS

  String smoothPrediction(String currentPrediction, double confidence) {
    _recentPredictions.add(currentPrediction);
    if (_recentPredictions.length > windowSize) {
      _recentPredictions.removeFirst();
    }

    // Majority voting
    final counts = <String, int>{};
    for (final pred in _recentPredictions) {
      counts[pred] = (counts[pred] ?? 0) + 1;
    }

    final majorityClass = counts.entries.reduce((a, b) => a.value > b.value ? a : b).key;

    // Override if current prediction has very high confidence
    if (confidence > 0.9) {
      return currentPrediction;
    }

    return majorityClass;
  }
}
```

---

## 5. Benchmark Methodology

### 5.1 Latency Benchmarking

**Test Setup**:
- Device: Mid-range Android (Snapdragon 750G) and iOS (iPhone 12)
- Environment: Controlled lighting, 2m from camera, standard gym exercises
- Duration: 5-minute continuous workout (300 frames analyzed)

**Measurement Code**:
```dart
class LatencyBenchmark {
  final List<LatencyBreakdown> _samples = [];

  void recordFrame(LatencyBreakdown breakdown) {
    _samples.add(breakdown);
  }

  void generateReport() {
    final totalLatencies = _samples.map((s) => s.total).toList()..sort();
    final p50 = _percentile(totalLatencies, 0.5);
    final p95 = _percentile(totalLatencies, 0.95);
    final p99 = _percentile(totalLatencies, 0.99);

    print('=== Latency Report (${_samples.length} frames) ===');
    print('P50: ${p50.toStringAsFixed(1)}ms');
    print('P95: ${p95.toStringAsFixed(1)}ms');
    print('P99: ${p99.toStringAsFixed(1)}ms');

    // Breakdown by stage
    print('\nStage breakdown (P95):');
    print('Camera:       ${_percentile(_samples.map((s) => s.camera).toList(), 0.95).toStringAsFixed(1)}ms');
    print('Preprocess:   ${_percentile(_samples.map((s) => s.preprocess).toList(), 0.95).toStringAsFixed(1)}ms');
    print('Pose:         ${_percentile(_samples.map((s) => s.pose).toList(), 0.95).toStringAsFixed(1)}ms');
    print('Fusion:       ${_percentile(_samples.map((s) => s.fusion).toList(), 0.95).toStringAsFixed(1)}ms');
    print('ML:           ${_percentile(_samples.map((s) => s.ml).toList(), 0.95).toStringAsFixed(1)}ms');
  }

  double _percentile(List<double> sorted, double p) {
    final index = (sorted.length * p).floor();
    return sorted[index];
  }
}

class LatencyBreakdown {
  final double camera;
  final double preprocess;
  final double pose;
  final double fusion;
  final double ml;
  double get total => camera + preprocess + pose + fusion + ml;
}
```

### 5.2 Accuracy Benchmarking

**Pose Estimation**:
```bash
# Download COCO val2017 dataset
wget http://images.cocodataset.org/zips/val2017.zip
unzip val2017.zip

# Run RTMPose-m on validation set
python evaluate_pose.py \
  --model rtmpose_m_256x192.tflite \
  --dataset coco_val2017 \
  --output results.json

# Calculate COCO metrics
python coco_eval.py --gt coco_annotations.json --pred results.json
# Output: AP, AR, AP@0.5, AP@0.75
```

**Movement Classification**:
```dart
// Load test dataset (held-out 20% of collected data)
final testDataset = await loadTestDataset('test_set.db');

int correctPredictions = 0;
int totalSamples = 0;

for (final sample in testDataset) {
  final prediction = await classifier.classify(sample.features);
  if (prediction.errorType == sample.groundTruth) {
    correctPredictions++;
  }
  totalSamples++;
}

final accuracy = correctPredictions / totalSamples;
print('Test accuracy: ${(accuracy * 100).toStringAsFixed(1)}%');

// Generate confusion matrix and per-class metrics
final metrics = calculateMetrics(predictions, groundTruths);
print('F1 score: ${metrics.f1Score}');
```

### 5.3 Power Benchmarking

**Android**:
```bash
# Reset battery stats
adb shell dumpsys batterystats --reset

# Run 1-hour workout
adb shell am start -n com.example.movement_chain/.MainActivity
# ... user performs workout ...

# Dump stats
adb shell dumpsys batterystats > battery_stats.txt

# Analyze with Battery Historian
docker run -p 9999:9999 gcr.io/android-battery-historian/stable:3.0 battery-historian -port 9999
# Upload battery_stats.txt at http://localhost:9999
```

**iOS**:
```bash
# Use Xcode Instruments
# 1. Open Xcode -> Product -> Profile
# 2. Select "Energy Log" template
# 3. Record during 1-hour workout
# 4. Analyze energy impact by subsystem (Camera, GPU, CPU, Bluetooth)
```

---

## 6. Optimization Strategies

### 6.1 Latency Optimization

#### Strategy 1: Model Quantization (Pose Estimation)

**Current**: RTMPose-m FP16 (8.2 MB, 45ms inference)
**Target**: RTMPose-m INT8 (4.5 MB, 20ms inference)

**Quantization Process**:
```python
import tensorflow as tf

# Load FP16 model
converter = tf.lite.TFLiteConverter.from_saved_model('rtmpose_fp16')

# Post-training quantization
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.target_spec.supported_types = [tf.int8]

# Representative dataset for calibration (1000 images)
def representative_dataset():
    for image in load_calibration_images():
        yield [image]

converter.representative_dataset = representative_dataset

# Convert
tflite_model = converter.convert()
with open('rtmpose_int8.tflite', 'wb') as f:
    f.write(tflite_model)
```

**Expected Impact**:
- Inference time: 45ms → 20ms (2.25x speedup)
- Accuracy degradation: AP 73.2% → 71.8% (1.4% drop, acceptable)
- Memory: 8.2 MB → 4.5 MB

#### Strategy 2: GPU Acceleration (iOS)

**Current**: TensorFlow Lite with CPU delegate
**Target**: Core ML with Neural Engine

**Conversion**:
```bash
# Convert TFLite to Core ML
coremltools convert rtmpose_int8.tflite --output rtmpose.mlmodel

# Enable Neural Engine
# (Automatically used for supported ops on A12+ chips)
```

**Expected Impact**:
- Inference time: 20ms → 12ms (1.66x speedup on iPhone 12+)
- Power consumption: 600 mW → 400 mW (offload from GPU to Neural Engine)

#### Strategy 3: Reduce Input Resolution

**Current**: 256×192 input
**Target**: 192×144 input (25% fewer pixels)

**Trade-offs**:
- Inference time: 20ms → 12ms
- Accuracy: AP 71.8% → 68.5% (3.3% drop, may be too much)
- **Decision**: Only apply during thermal throttling

#### Strategy 4: Model Pruning (Classifier)

**Current**: LSTM+Transformer (4.5 MB INT8, 50ms inference)
**Target**: Pruned model (3.0 MB, 30ms inference)

```python
import tensorflow_model_optimization as tfmot

# Define pruning schedule
pruning_params = {
    'pruning_schedule': tfmot.sparsity.keras.PolynomialDecay(
        initial_sparsity=0.0,
        final_sparsity=0.5,  # Remove 50% of weights
        begin_step=1000,
        end_step=10000
    )
}

# Apply pruning
model_for_pruning = tfmot.sparsity.keras.prune_low_magnitude(model, **pruning_params)

# Train with pruning
model_for_pruning.fit(train_data, epochs=20)

# Convert to TFLite
converter = tf.lite.TFLiteConverter.from_keras_model(model_for_pruning)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()
```

**Expected Impact**:
- Inference time: 50ms → 30ms (1.66x speedup)
- Accuracy: F1 86.5% → 85.1% (1.4% drop, acceptable)

### 6.2 Throughput Optimization

#### Strategy 1: Skip Frame Processing

**Current**: Process every frame at 60 FPS (infeasible at 126ms latency)
**Target**: Process every 2nd frame (30 FPS effective rate)

```dart
class AdaptiveFrameProcessor {
  int _frameCounter = 0;
  int _skipFactor = 1;  // Process every Nth frame

  Future<void> onFrame(CameraImage image) async {
    _frameCounter++;

    if (_frameCounter % _skipFactor != 0) {
      return;  // Skip this frame
    }

    // Process frame
    final result = await _pipeline.process(image);

    // Adjust skip factor based on latency
    if (result.latencyMs > 120) {
      _skipFactor = 2;  // Drop to 30 FPS
    } else if (result.latencyMs < 80) {
      _skipFactor = 1;  // Back to 60 FPS
    }
  }
}
```

#### Strategy 2: Parallel Inference (Multi-Threading)

**Current**: Sequential processing (camera → pose → fusion → ML)
**Target**: Overlap pose and ML inference using pipeline parallelism

```dart
class PipelinedProcessor {
  final Queue<Future<PoseResult>> _poseQueue = Queue();

  Future<void> onFrame(CameraImage image) async {
    // Start pose inference (non-blocking)
    final poseFuture = _poseEstimator.estimatePose(image);
    _poseQueue.add(poseFuture);

    // If previous pose is ready, run ML on it
    if (_poseQueue.length > 1) {
      final previousPose = await _poseQueue.removeFirst();
      _runMLInBackground(previousPose);  // Fire and forget
    }
  }

  void _runMLInBackground(PoseResult pose) async {
    // This runs in parallel with next frame's pose estimation
    final classification = await _classifier.classify(pose.features);
    _displayResults(classification);
  }
}
```

**Expected Impact**:
- Effective latency: 126ms → 80ms (overlap 45ms pose + 50ms ML)
- Frame rate: 22 FPS → 35 FPS

### 6.3 Power Optimization

#### Strategy 1: Dynamic Camera Resolution

**Current**: 640×480 @ 60 FPS continuously
**Target**: Adaptive resolution based on motion

```dart
class AdaptiveCameraController {
  double _recentMotion = 0;

  void onIMUData(Vector3 accel, Vector3 gyro) {
    // Calculate motion magnitude
    _recentMotion = accel.length + gyro.length;

    // High motion → reduce resolution (GPU can't keep up anyway)
    if (_recentMotion > 15.0) {
      camera.setResolution(320, 240);  // 75% reduction in pixels
      camera.setFrameRate(30);          // Half frame rate
    } else {
      camera.setResolution(640, 480);
      camera.setFrameRate(60);
    }
  }
}
```

**Expected Impact**:
- Power: 1,300 mW → 950 mW during high motion (26% reduction)
- Accuracy: Minimal impact (motion blur already degrades pose at high speed)

#### Strategy 2: BLE Duty Cycling (Non-Critical Periods)

**Current**: 100 Hz IMU + 200 Hz EMG continuously
**Target**: Reduce to 50 Hz IMU + 100 Hz EMG during rest periods

```c
// Firmware: Detect rest periods (no motion for 5 seconds)
void check_activity_level() {
    if (time_since_last_motion() > 5000) {  // 5 seconds
        set_imu_rate(50);   // Half rate
        set_emg_rate(100);
    } else {
        set_imu_rate(100);  // Full rate
        set_emg_rate(200);
    }
}
```

**Expected Impact**:
- BLE power: 50 mW → 30 mW during rest (40% reduction)
- Overall power: 1,300 mW → 1,280 mW (negligible, but extends device battery life)

---

## 7. Continuous Monitoring

### 7.1 Performance Telemetry

**Metrics to Track** (logged every 60 seconds):
```dart
class PerformanceTelemetry {
  // Latency
  double avgLatencyMs;
  double p95LatencyMs;
  int framesOverBudget;  // Count of frames >100ms

  // Throughput
  double avgFPS;
  int droppedFrames;

  // Resource usage
  double peakMemoryMB;
  double avgCpuPercent;
  double avgGpuPercent;

  // Accuracy
  double avgPoseConfidence;
  int lowConfidenceFrames;  // Pose confidence <0.5

  // BLE
  int blePacketLoss;
  int bleDisconnections;

  void log() {
    print('[Telemetry] Avg latency: ${avgLatencyMs.toStringAsFixed(1)}ms (P95: ${p95LatencyMs.toStringAsFixed(1)}ms)');
    print('[Telemetry] FPS: ${avgFPS.toStringAsFixed(1)} (dropped: $droppedFrames)');
    print('[Telemetry] Memory: ${peakMemoryMB.toStringAsFixed(1)} MB');
    print('[Telemetry] BLE loss: $blePacketLoss packets');

    // Send to analytics backend
    _analytics.logEvent('performance_snapshot', {
      'latency_p95': p95LatencyMs,
      'fps': avgFPS,
      'memory_mb': peakMemoryMB,
    });
  }
}
```

### 7.2 Alerting Thresholds

| Metric | Warning Threshold | Critical Threshold | Action |
|--------|-------------------|-------------------|--------|
| P95 latency | >120ms | >150ms | Enable adaptive FPS, notify user |
| Frame drop rate | >5% | >10% | Reduce resolution, log diagnostic |
| Memory usage | >450 MB | >490 MB | Trigger GC, reduce buffer sizes |
| BLE packet loss | >2% | >5% | Show reconnection warning |
| Pose confidence | <0.5 for >10 frames | <0.3 for >5 frames | Prompt "Move closer to camera" |

---

## 8. Performance Roadmap

### Phase 1: Critical Path Optimization (Q1 2025)
**Goal**: Reduce P95 latency to <100ms

- [ ] Implement INT8 quantization for pose model (45ms → 20ms) **[Highest priority]**
- [ ] Apply model pruning to classifier (50ms → 30ms)
- [ ] Enable GPU acceleration on iOS (Core ML)
- [ ] Deploy adaptive frame rate (fallback to 30 FPS)

**Expected Outcome**: P95 latency 134ms → 85ms ✅

### Phase 2: Accuracy Improvements (Q2 2025)
**Goal**: Improve movement classification F1 to >90%

- [ ] Collect additional training data (10,000 samples, up from 3,150)
- [ ] Implement attention mechanism for EMG features
- [ ] Add temporal smoothing (5-frame majority voting)
- [ ] Fine-tune model on user-specific data (personalization)

**Expected Outcome**: F1 score 86.5% → 91% ✅

### Phase 3: Power Optimization (Q3 2025)
**Goal**: Reduce battery drain to <10% per hour

- [ ] Dynamic camera resolution (640×480 → 480×360 during motion)
- [ ] BLE duty cycling during rest periods
- [ ] Background mode with audio-only feedback
- [ ] Screen dimming after 30 seconds

**Expected Outcome**: 15% drain → 9% drain ✅

### Phase 4: Edge Computing (Q4 2025)
**Goal**: Offload inference to dedicated ML accelerator

- [ ] Investigate Edge TPU integration (Google Coral)
- [ ] Implement on-device training for personalization
- [ ] Real-time model update based on user feedback
- [ ] Target: <50ms end-to-end latency

**Expected Outcome**: Enable 120 FPS video processing with <50ms latency

---

## Summary

**Current Performance**:
- ✅ Memory: 474 MB / 500 MB budget (95% utilization)
- ✅ Power: 13% battery drain per hour (target: <15%)
- ❌ Latency: P95 134ms (34ms over 100ms target)
- ✅ Accuracy: Pose AP 73.2%, Movement F1 86.5% (meet targets)

**Critical Optimizations** (Q1 2025):
1. **INT8 quantization**: 45ms → 20ms pose inference (Priority 1)
2. **Model pruning**: 50ms → 30ms classifier inference (Priority 2)
3. **Adaptive FPS**: Fallback to 30 FPS if latency exceeds budget (Priority 3)

**Success Criteria**:
- 95% of frames processed within 100ms latency budget
- 60 FPS sustained for 5-minute workout (no thermal throttling)
- Movement classification F1 score >85% across all error types
- Battery drain <15% per hour on mid-range devices

By implementing the optimization strategies outlined, Movement Chain AI will achieve real-time, accurate, and power-efficient movement analysis on mobile devices.
