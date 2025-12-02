# 性能目标 (Performance Targets)

## 概述 (Overview)

本文档定义了 Movement Chain AI 的性能要求 (performance requirements)、基准测试方法 (benchmarking methodology) 和优化策略 (optimization strategies)。系统必须在移动设备上实现实时运动分析 (real-time movement analysis),同时保持低功耗 (low power consumption) 和高准确性 (high accuracy)。

---

## 1. 延迟要求 (Latency Requirements)

### 1.1 实时反馈路径 (Real-Time Feedback Path)

**目标 (Target): 端到端延迟 (End-to-end latency) <100ms (P95)**

| 阶段 (Stage) | 预算 (Budget) | 当前 (Current) | 状态 (Status) | 关键路径 (Critical Path) |
|-------|--------|---------|--------|---------------|
| Camera acquisition (摄像头采集) | 16.7ms | 16.7ms | ✅ OK | Hardware-limited (60 FPS) |
| Frame preprocessing (帧预处理) | 5ms | 8ms | ⚠️ Warning | CPU-bound (resize + YUV→RGB) |
| Pose estimation (姿态估计) | 30ms | 45ms | ❌ Over | GPU inference bottleneck |
| Sensor retrieval (传感器检索) | 2ms | 3ms | ✅ OK | Memory access + buffer scan |
| Sensor fusion (传感器融合) | 10ms | 8ms | ✅ OK | Feature extraction (FFT for EMG) |
| ML classification (ML 分类) | 40ms | 50ms | ❌ Over | LSTM+Transformer inference |
| Haptic feedback (触觉反馈) | 5ms | 3ms | ✅ OK | BLE write latency |
| **Total (总计)** | **100ms** | **126ms** | **❌ 26ms over** | **Optimize pose + ML** |

**Latency Breakdown (延迟分解) (P50/P95/P99)**:

```
Camera (摄像头):      16.7ms / 16.7ms / 33.4ms  (occasional frame drop)
Preprocessing (预处理): 5ms / 8ms / 12ms
Pose (姿态):        28ms / 45ms / 60ms        ← HIGH VARIANCE
Fusion (融合):       7ms / 12ms / 15ms
ML:          35ms / 50ms / 65ms        ← HIGH VARIANCE
Feedback (反馈):     2ms / 3ms / 5ms
────────────────────────────────────
Total (总计):       93.7ms / 134.7ms / 190.4ms
```

**Impact Analysis (影响分析)**:

- P50 latency (93.7ms) meets target → good experience for most frames
- P95 latency (134.7ms) exceeds target by 34.7ms → noticeable lag during complex poses
- P99 latency (190.4ms) is unacceptable → feels sluggish to user

### 1.2 动作后分析 (Post-Action Analysis)

**目标 (Target): 训练完成后5秒内生成摘要 (Generate summary within 5 seconds of workout completion)**

| 任务 (Task) | 预算 (Budget) | 说明 (Description) |
|------|--------|-------------|
| Data aggregation (数据聚合) | 1s | Load all frames from SQLite (3,600 frames @ 60 FPS/min) |
| Batch inference (批量推理) | 3s | Re-run ML on all frames with FP32 model (higher accuracy) |
| Statistics generation (统计生成) | 0.5s | Calculate rep counts, error frequencies, joint ROM |
| Visualization rendering (可视化渲染) | 0.5s | Generate charts (error timeline, pose heatmap) |
| **Total (总计)** | **5s** | User sees analysis screen immediately |

### 1.3 启动延迟 (Startup Latency)

**目标 (Target): 应用在3秒内准备好训练 (App ready for workout in <3 seconds)**

| 任务 (Task) | 预算 (Budget) | 当前 (Current) | 优化 (Optimization) |
|------|--------|---------|--------------|
| Flutter framework init (Flutter 框架初始化) | 500ms | 500ms | Non-optimizable |
| ML model loading (ML 模型加载) | 1.5s | 2.1s | Use model caching, lazy load classifier |
| BLE device scan (BLE 设备扫描) | 2s | 2s | Background scan during model load |
| Camera initialization (摄像头初始化) | 500ms | 600ms | Reduce resolution until pose ready |
| **Total (总计)** | **3s** | **4.2s** | **Target: 3s via parallelization** |

**Cold Start Optimization (冷启动优化)**:

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

## 2. 吞吐量要求 (Throughput Requirements)

### 2.1 视频处理 (Video Processing)

| 指标 (Metric) | 目标 (Target) | 当前 (Current) | 验证方法 (Validation Method) |
|--------|--------|---------|-------------------|
| Camera frame rate (摄像头帧率) | 60 FPS (stable) | 55-60 FPS | Monitor frame timestamps, detect drops >1% |
| Frame drop rate (帧丢失率) | <1% | 2.3% | Count frames with Δt >20ms |
| Pose inference rate (姿态推理率) | ≥30 FPS | 22 FPS | Inference counter / elapsed time |
| ML classification rate (ML 分类率) | ≥30 FPS | 20 FPS | Classifier invocations / second |

**Frame Drop Causes (帧丢失原因)**:

1. Pose inference too slow (45ms) → can't keep up with 60 FPS
2. GC pauses (15-30ms) → Flutter runtime stops processing
3. Thermal throttling (sustained load >2 min) → CPU/GPU frequency reduced

**Mitigation (缓解)**:

- **Adaptive frame rate (自适应帧率)**: Drop to 30 FPS if latency exceeds 120ms for 3 consecutive frames
- **Reduce GC pressure (减少 GC 压力)**: Object pooling for tensors (see Integration Patterns)
- **Thermal management (热管理)**: Reduce camera resolution to 480p after 5 minutes

### 2.2 BLE 传感器流传输 (BLE Sensor Streaming)

| 传感器 (Sensor) | 目标速率 (Target Rate) | 数据包速率 (Packet Rate) | 数据速率 (Data Rate) | 验证 (Validation) |
|--------|-------------|-------------|-----------|------------|
| IMU (6-axis) | 100 Hz | 10 packets/s (10 samples each) | 2.4 KB/s | Verify 100 samples/second ±2% |
| EMG (4-channel) | 200 Hz | 5 packets/s (40 samples each) | 1.6 KB/s | Verify 200 samples/second ±2% |
| **Total BLE (BLE 总计)** | **-** | **15 packets/s** | **4 KB/s** | Packet loss <0.5% |

**Throughput Validation Test (吞吐量验证测试)**:

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

### 2.3 存储吞吐量 (Storage Throughput)

| 操作 (Operation) | 目标 (Target) | 当前 (Current) | 影响 (Impact) |
|-----------|--------|---------|--------|
| Frame write (帧写入) (SQLite) | >60 writes/s | 72 writes/s | Background recording while inference runs |
| Batch read (批量读取) (post-workout) | <2s for 3,600 frames | 1.8s | Fast enough for 5s analysis budget |
| Database size (数据库大小) (1-hour session) | <200 MB | 180 MB (compressed) | Acceptable for weekly cleanup |

---

## 3. 资源预算 (Resource Budgets)

### 3.1 内存约束 (Memory Constraints)

**目标 (Target): 峰值 RAM 使用 (Peak RAM usage) <500 MB**

| 组件 (Component) | 预算 (Budget) | 当前 (Current) | 说明 (Notes) |
|-----------|--------|---------|-------|
| Flutter framework (Flutter 框架) | 80 MB | 85 MB | Baseline, non-optimizable |
| Camera buffers (摄像头缓冲区) | 50 MB | 45 MB | 3 frames @ 640×480 RGB (triple buffer) |
| ML models (loaded) (ML 模型-已加载) | 150 MB | 180 MB | Pose (8.2 MB) + Classifier (4.5 MB) + runtime overhead |
| Sensor data buffers (传感器数据缓冲区) | 5 MB | 4 MB | Circular buffer (500ms @ 100/200 Hz) |
| Tensor workspace (张量工作空间) | 30 MB | 25 MB | Intermediate activations during inference |
| SQLite (if recording) (如果记录) | 100 MB | 90 MB | Write buffer + index cache |
| UI rendering (UI 渲染) | 50 MB | 45 MB | Dart objects + texture cache |
| **Total (总计)** | **500 MB** | **474 MB** | **✅ Within budget** |

**Memory Profiling Strategy (内存分析策略)**:

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

### 3.2 存储预算 (Storage Budget)

**目标 (Target): 应用二进制 (App binary) <150 MB, 用户数据 (user data) <500 MB/月 (month)**

| 资产 (Asset) | 大小 (Size) | 压缩 (Compression) | 安装大小 (Installed Size) |
|-------|------|-------------|----------------|
| Flutter framework (Flutter 框架) | 25 MB | - | 25 MB |
| Pose model (姿态模型) (FP16) | 8.2 MB | None (already optimized) | 8.2 MB |
| Classifier model (分类器模型) (INT8) | 4.5 MB | None | 4.5 MB |
| UI assets (UI 资产) (icons, fonts) | 5 MB | PNG compression | 5 MB |
| Native libraries (原生库) (TFLite) | 15 MB | Stripped symbols | 15 MB |
| **Total APK/IPA (APK/IPA 总计)** | **58 MB** | **-** | **58 MB** ✅ |

**User Data Growth (用户数据增长)**:

- 1-hour workout: 180 MB (compressed)
- Assumed usage: 5 workouts/week = 3.6 GB/month
- **Solution (解决方案)**: Auto-delete sessions older than 30 days (keep summary stats only)

### 3.3 功耗 (Power Consumption)

**目标 (Target): 每小时电池消耗 (Battery drain per hour) <15%**

| 组件 (Component) | 功耗 (Power Draw) | 占比 (% of Total) | 优化 (Optimization) |
|-----------|------------|------------|--------------|
| Camera (摄像头) (60 FPS) | 450 mW | 35% | Reduce to 30 FPS if latency issues |
| GPU (pose inference) | 600 mW | 46% | Quantization (FP16→INT8) can save 30% |
| CPU (feature extraction) | 150 mW | 12% | SIMD optimization for FFT |
| BLE radio (BLE 无线电) | 50 mW | 4% | Already optimized (7.5ms interval) |
| Display (显示器) (always-on) | 50 mW | 4% | Dim during workout, brighten for feedback |
| **Total (总计)** | **1,300 mW** | **100%** | **~13% battery/hour on 10,000 mAh** ✅ |

**Battery Profiling (电池分析)**:

```bash
# Android
adb shell dumpsys batterystats --reset
# Run 1-hour workout
adb shell dumpsys batterystats > battery_stats.txt

# Analyze power consumption by component
battery-historian -port 9999 battery_stats.txt
```

**Power Optimization Strategies (功耗优化策略)**:

1. **Dynamic FPS (动态 FPS)**: 60 FPS when stationary, 30 FPS during rapid movement (GPU can't keep up anyway)
2. **Background mode (后台模式)**: Pause camera when app backgrounded, keep BLE streaming (audio cues only)
3. **Screen timeout (屏幕超时)**: Dim screen to 20% after 30 seconds of no user interaction

---

## 4. 准确性目标 (Accuracy Targets)

### 4.1 姿态估计准确性 (Pose Estimation Accuracy)

**目标 (Target): 平均精度 (Average Precision) (AP) >70% at OKS threshold 0.5**

| 指标 (Metric) | 目标 (Target) | 当前 (Current) | 基准数据集 (Benchmark Dataset) |
|--------|--------|---------|-------------------|
| AP @ OKS=0.5 | >70% | 73.2% | COCO val2017 (5,000 images) |
| AP @ OKS=0.75 | >50% | 48.1% | Stricter localization |
| AR (Average Recall) (平均召回率) | >75% | 76.5% | Detect all visible keypoints |

**OKS (Object Keypoint Similarity) (对象关键点相似度)**: Measures pose accuracy, normalized by person scale

```
OKS = Σ exp(-d_i² / (2 * s² * k_i²)) / Σ δ(v_i > 0)

where:
  d_i = Euclidean distance between predicted and ground truth keypoint i
  s = √(area of person bounding box)  (scale normalization)
  k_i = keypoint constant (higher for easier keypoints like shoulders)
  v_i = visibility flag
```

**Keypoint-Specific Accuracy (关键点特定准确性)** (PCK @ 0.1 threshold):

| 关键点 (Keypoint) | 目标 (Target) | 当前 (Current) | 说明 (Notes) |
|----------|--------|---------|-------|
| Shoulders, hips (肩部、髋部) | >90% | 91% | Easy: large, high-contrast |
| Elbows, knees (肘部、膝盖) | >80% | 83% | Medium: motion blur |
| Wrists, ankles (手腕、脚踝) | >70% | 72% | Hard: small, occlusion |
| Face (nose, ears) (面部) | >85% | 88% | High-contrast, but not critical for movement |

### 4.2 动作分类准确性 (Movement Classification Accuracy)

**目标 (Target): 所有错误类别的 F1 分数 (F1 score) >85%**

| 错误类别 (Error Class) | 精确率 (Precision) | 召回率 (Recall) | F1 分数 (F1 Score) | 支持数 (Support) (# samples) |
|-------------|-----------|--------|----------|---------------------|
| Perfect form (完美动作) | 92% | 90% | 91% | 1,200 |
| Knee cave (膝内扣) (squat) | 88% | 85% | 86.5% | 450 |
| Rounded back (圆背) (deadlift) | 82% | 80% | 81% | 380 |
| Elbow flare (肘外展) (pushup) | 86% | 84% | 85% | 320 |
| Shallow depth (深度不足) (squat) | 90% | 88% | 89% | 510 |
| Hip rise early (髋部早起) (deadlift) | 79% | 76% | 77.5% | 290 |
| **Weighted Average (加权平均)** | **87.2%** | **85.8%** | **86.5%** | **3,150** ✅ |

**Confusion Matrix (混淆矩阵)** (Top errors):

```
               Predicted (预测)
             Perfect  Knee Cave  Rounded Back  Shallow
Actual (实际)
Perfect        1080      50         30          40
Knee Cave       35      383        15          17
Rounded Back    25      10         304         41
Shallow         40      20         18          452
```

**Error Analysis (错误分析)**:

- **Knee Cave ↔ Perfect**: 50 false positives (4.2%) → model too sensitive, may need higher confidence threshold
- **Rounded Back ↔ Shallow**: 41 confusions → similar pose features (both involve hip angle), need better EMG integration

### 4.3 时间一致性 (Temporal Consistency)

**目标 (Target): 预测稳定性 (Prediction stability) >90% (no rapid flipping between classes)**

**Metric (指标)**: Stability Score = 1 - (class changes / total frames)

| 场景 (Scenario) | 稳定性目标 (Stability Target) | 当前 (Current) | 说明 (Notes) |
|----------|------------------|---------|-------|
| Perfect rep (完美重复) | >95% | 96.3% | Should stay "Perfect" throughout |
| Error onset (错误开始) | >85% | 88.1% | Allow gradual transition to error class |
| Error correction (错误纠正) | >85% | 82.4% | ⚠️ Sometimes flips back to Perfect prematurely |

**Smoothing Strategy (平滑策略)**:

```dart
class TemporalSmoother {
  final Queue<String> _recentPredictions = Queue();
  final int windowSize = 5;  // 83ms window at 60 FPS

  String smoothPrediction(String currentPrediction, double confidence) {
    _recentPredictions.add(currentPrediction);
    if (_recentPredictions.length > windowSize) {
      _recentPredictions.removeFirst();
    }

    // Majority voting (多数投票)
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

## 5. 基准测试方法 (Benchmark Methodology)

### 5.1 延迟基准测试 (Latency Benchmarking)

**Test Setup (测试设置)**:

- Device (设备): Mid-range Android (Snapdragon 750G) and iOS (iPhone 12)
- Environment (环境): Controlled lighting, 2m from camera, standard gym exercises
- Duration (持续时间): 5-minute continuous workout (300 frames analyzed)

**Measurement Code (测量代码)**:

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

    print('=== Latency Report (延迟报告) (${_samples.length} frames) ===');
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

### 5.2 准确性基准测试 (Accuracy Benchmarking)

**Pose Estimation (姿态估计)**:

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

**Movement Classification (动作分类)**:

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

### 5.3 功耗基准测试 (Power Benchmarking)

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

## 6. 优化策略 (Optimization Strategies)

### 6.1 延迟优化 (Latency Optimization)

#### 策略 1: 模型量化 (姿态估计) (Strategy 1: Model Quantization - Pose Estimation)

**Current (当前)**: RTMPose-m FP16 (8.2 MB, 45ms inference)
**Target (目标)**: RTMPose-m INT8 (4.5 MB, 20ms inference)

**Quantization Process (量化过程)**:

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

**Expected Impact (预期影响)**:

- Inference time (推理时间): 45ms → 20ms (2.25x speedup)
- Accuracy degradation (准确性下降): AP 73.2% → 71.8% (1.4% drop, acceptable)
- Memory (内存): 8.2 MB → 4.5 MB

#### 策略 2: GPU 加速 (iOS) (Strategy 2: GPU Acceleration - iOS)

**Current (当前)**: TensorFlow Lite with CPU delegate
**Target (目标)**: Core ML with Neural Engine

**Conversion (转换)**:

```bash
# Convert TFLite to Core ML
coremltools convert rtmpose_int8.tflite --output rtmpose.mlmodel

# Enable Neural Engine
# (Automatically used for supported ops on A12+ chips)
```

**Expected Impact (预期影响)**:

- Inference time (推理时间): 20ms → 12ms (1.66x speedup on iPhone 12+)
- Power consumption (功耗): 600 mW → 400 mW (offload from GPU to Neural Engine)

#### 策略 3: 降低输入分辨率 (Strategy 3: Reduce Input Resolution)

**Current (当前)**: 256×192 input
**Target (目标)**: 192×144 input (25% fewer pixels)

**Trade-offs (权衡)**:

- Inference time (推理时间): 20ms → 12ms
- Accuracy (准确性): AP 71.8% → 68.5% (3.3% drop, may be too much)
- **Decision (决策)**: Only apply during thermal throttling

#### 策略 4: 模型剪枝 (分类器) (Strategy 4: Model Pruning - Classifier)

**Current (当前)**: LSTM+Transformer (4.5 MB INT8, 50ms inference)
**Target (目标)**: Pruned model (3.0 MB, 30ms inference)

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

**Expected Impact (预期影响)**:

- Inference time (推理时间): 50ms → 30ms (1.66x speedup)
- Accuracy (准确性): F1 86.5% → 85.1% (1.4% drop, acceptable)

### 6.2 吞吐量优化 (Throughput Optimization)

#### 策略 1: 跳帧处理 (Strategy 1: Skip Frame Processing)

**Current (当前)**: Process every frame at 60 FPS (infeasible at 126ms latency)
**Target (目标)**: Process every 2nd frame (30 FPS effective rate)

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

#### 策略 2: 并行推理 (多线程) (Strategy 2: Parallel Inference - Multi-Threading)

**Current (当前)**: Sequential processing (camera → pose → fusion → ML)
**Target (目标)**: Overlap pose and ML inference using pipeline parallelism

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

**Expected Impact (预期影响)**:

- Effective latency (有效延迟): 126ms → 80ms (overlap 45ms pose + 50ms ML)
- Frame rate (帧率): 22 FPS → 35 FPS

### 6.3 功耗优化 (Power Optimization)

#### 策略 1: 动态摄像头分辨率 (Strategy 1: Dynamic Camera Resolution)

**Current (当前)**: 640×480 @ 60 FPS continuously
**Target (目标)**: Adaptive resolution based on motion

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

**Expected Impact (预期影响)**:

- Power (功耗): 1,300 mW → 950 mW during high motion (26% reduction)
- Accuracy (准确性): Minimal impact (motion blur already degrades pose at high speed)

#### 策略 2: BLE 占空比循环 (非关键时段) (Strategy 2: BLE Duty Cycling - Non-Critical Periods)

**Current (当前)**: 100 Hz IMU + 200 Hz EMG continuously
**Target (目标)**: Reduce to 50 Hz IMU + 100 Hz EMG during rest periods

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

**Expected Impact (预期影响)**:

- BLE power (BLE 功耗): 50 mW → 30 mW during rest (40% reduction)
- Overall power (总体功耗): 1,300 mW → 1,280 mW (negligible, but extends device battery life)

---

## 7. 持续监控 (Continuous Monitoring)

### 7.1 性能遥测 (Performance Telemetry)

**Metrics to Track (要追踪的指标)** (logged every 60 seconds):

```dart
class PerformanceTelemetry {
  // Latency (延迟)
  double avgLatencyMs;
  double p95LatencyMs;
  int framesOverBudget;  // Count of frames >100ms

  // Throughput (吞吐量)
  double avgFPS;
  int droppedFrames;

  // Resource usage (资源使用)
  double peakMemoryMB;
  double avgCpuPercent;
  double avgGpuPercent;

  // Accuracy (准确性)
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

### 7.2 警报阈值 (Alerting Thresholds)

| 指标 (Metric) | 警告阈值 (Warning Threshold) | 关键阈值 (Critical Threshold) | 操作 (Action) |
|--------|-------------------|-------------------|--------|
| P95 latency (P95 延迟) | >120ms | >150ms | Enable adaptive FPS, notify user |
| Frame drop rate (帧丢失率) | >5% | >10% | Reduce resolution, log diagnostic |
| Memory usage (内存使用) | >450 MB | >490 MB | Trigger GC, reduce buffer sizes |
| BLE packet loss (BLE 丢包) | >2% | >5% | Show reconnection warning |
| Pose confidence (姿态置信度) | <0.5 for >10 frames | <0.3 for >5 frames | Prompt "Move closer to camera" |

---

## 8. 性能路线图 (Performance Roadmap)

### 第1阶段: 关键路径优化 (Phase 1: Critical Path Optimization) (Q1 2025)

**Goal (目标)**: Reduce P95 latency to <100ms

- [ ] Implement INT8 quantization for pose model (45ms → 20ms) **[Highest priority]**
- [ ] Apply model pruning to classifier (50ms → 30ms)
- [ ] Enable GPU acceleration on iOS (Core ML)
- [ ] Deploy adaptive frame rate (fallback to 30 FPS)

**Expected Outcome (预期结果)**: P95 latency 134ms → 85ms ✅

### 第2阶段: 准确性改进 (Phase 2: Accuracy Improvements) (Q2 2025)

**Goal (目标)**: Improve movement classification F1 to >90%

- [ ] Collect additional training data (10,000 samples, up from 3,150)
- [ ] Implement attention mechanism for EMG features
- [ ] Add temporal smoothing (5-frame majority voting)
- [ ] Fine-tune model on user-specific data (personalization)

**Expected Outcome (预期结果)**: F1 score 86.5% → 91% ✅

### 第3阶段: 功耗优化 (Phase 3: Power Optimization) (Q3 2025)

**Goal (目标)**: Reduce battery drain to <10% per hour

- [ ] Dynamic camera resolution (640×480 → 480×360 during motion)
- [ ] BLE duty cycling during rest periods
- [ ] Background mode with audio-only feedback
- [ ] Screen dimming after 30 seconds

**Expected Outcome (预期结果)**: 15% drain → 9% drain ✅

### 第4阶段: 边缘计算 (Phase 4: Edge Computing) (Q4 2025)

**Goal (目标)**: Offload inference to dedicated ML accelerator

- [ ] Investigate Edge TPU integration (Google Coral)
- [ ] Implement on-device training for personalization
- [ ] Real-time model update based on user feedback
- [ ] Target: <50ms end-to-end latency

**Expected Outcome (预期结果)**: Enable 120 FPS video processing with <50ms latency

---

## 总结 (Summary)

**Current Performance (当前性能)**:

- ✅ Memory (内存): 474 MB / 500 MB budget (95% utilization)
- ✅ Power (功耗): 13% battery drain per hour (target: <15%)
- ❌ Latency (延迟): P95 134ms (34ms over 100ms target)
- ✅ Accuracy (准确性): Pose AP 73.2%, Movement F1 86.5% (meet targets)

**Critical Optimizations (关键优化)** (Q1 2025):

1. **INT8 quantization (INT8 量化)**: 45ms → 20ms pose inference (Priority 1)
2. **Model pruning (模型剪枝)**: 50ms → 30ms classifier inference (Priority 2)
3. **Adaptive FPS (自适应 FPS)**: Fallback to 30 FPS if latency exceeds budget (Priority 3)

**Success Criteria (成功标准)**:

- 95% of frames processed within 100ms latency budget
- 60 FPS sustained for 5-minute workout (no thermal throttling)
- Movement classification F1 score >85% across all error types
- Battery drain <15% per hour on mid-range devices

By implementing the optimization strategies outlined, Movement Chain AI will achieve real-time, accurate, and power-efficient movement analysis on mobile devices.
