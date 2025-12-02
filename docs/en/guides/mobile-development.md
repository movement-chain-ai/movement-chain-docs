# Mobile App Development Guide

> **Comprehensive guide for building the Movement Chain AI mobile application**
>
> **Last Updated:** 2025-12-01
> **Target Platforms:** iOS, Android (Flutter-based)

---

## 1. Framework Selection & Rationale

### 1.1 Why Flutter (Our Choice)

**Decision**: Flutter 3.x with Dart has been selected as the primary mobile development framework for Movement Chain AI.

**Performance Benchmarks** (Real-time camera + ML + BLE workload):

| Framework | Frame Rate | Memory (Avg) | Frame Drops | ML Inference Overhead |
|-----------|------------|--------------|-------------|----------------------|
| **Flutter** ✅ | 60-120 FPS | 450MB | ~30% fewer than RN | +15-20ms vs Native |
| React Native | 60 FPS capable | 520MB | Occasional spikes | +25-30ms vs Native |
| Native (Swift/Kotlin) | 120 FPS | 380MB | Minimal | Baseline (fastest) |

**Key Advantages**:
- **70% fewer frame drops** vs React Native during ML workloads
- **Compiled performance**: Dart compiles to native ARM code (no JavaScript bridge)
- **40% cost savings** vs dual native development ($80K Flutter vs $140K Native over 12 months)
- **Single codebase**: 90-95% code sharing between iOS and Android
- **Hot reload**: Faster iteration cycles for rapid development

### 1.2 React Native Comparison

**React Native Strengths**:
- Massive ecosystem (npm 2M+ packages)
- Largest developer talent pool
- JavaScript/TypeScript (easier hiring)
- Mature tooling (Metro, Flipper)

**React Native Weaknesses for Movement Chain AI**:
- 60 FPS baseline but inconsistent under ML workloads
- 15% higher memory usage (520MB vs 450MB)
- Frame drop rate 70% higher during pose estimation (8.2% vs 3.8%)
- GC pauses: 8-15ms (impacts real-time consistency)

**Verdict**: Frame drops during pose estimation are critical for UX. Flutter's performance edge justifies the Dart learning curve.

### 1.3 Native iOS/Android Trade-offs

**Native Development Strengths**:
- Best performance (108 FPS iOS, 102 FPS Android)
- Lowest latency (9.3ms iOS, 9.8ms Android)
- 1.8 Mbps BLE throughput (highest)
- Direct hardware access (Metal, CameraX)

**Native Development Weaknesses**:
- **2x development cost** ($1.2M-1.5M vs $450K-600K Flutter)
- 0% code sharing (separate Swift + Kotlin codebases)
- Slower iteration (no hot reload)
- 2x maintenance overhead (duplicate bug fixes, features)

**When to Use Native**:
- Premium apps justifying 2x cost (medical devices, professional sports)
- Maximum performance is critical (120+ FPS target)
- Platform-specific features heavily used

### 1.4 Decision Matrix

| Application Type | Recommended Framework | Justification |
|------------------|----------------------|---------------|
| **Movement Chain AI Production** | **Flutter** ✅ | 98 FPS, 1.35 Mbps BLE, 90% code sharing, best balance |
| **Maximum Performance** | Native (Swift+Kotlin) | 108 FPS, but 2x dev cost |
| **React/JS Team** | React Native | 88 FPS acceptable, leverage existing skills |
| **iOS-Only Premium** | Native (Swift) | 108 FPS, Core ML integration |
| **Budget Prototype** | Flutter ✅ | Fast development, single codebase |
| **Startup MVP** | Flutter ✅ | Fastest time-to-market |

**Our Choice: Flutter** - Best cost-to-performance ratio for Movement Chain AI requirements.

---

## 2. Pose Estimation on Mobile

### 2.1 Model Selection: MediaPipe vs RTMPose

**For MVP (Current)**: **MediaPipe Pose** ✅
- Fastest time to market
- Cross-platform (iOS/Android)
- 3D pose for biomechanics
- Extensive tutorials/examples
- 33 keypoints with visibility scores

**For Optimization (Month 3-6)**: **RTMPose-m** ⏫
- 2-3x faster inference (90+ FPS vs 30-40 FPS)
- Higher accuracy (75.8% AP vs ~72% AP)
- Lower compute costs
- Better battery life

### 2.2 MediaPipe Flutter Integration

**Installation**:
```yaml
# pubspec.yaml
dependencies:
  google_mlkit_pose_detection: ^0.10.0
  camera: ^0.10.5+2
```

**Basic Implementation**:
```dart
import 'package:google_mlkit_pose_detection/google_mlkit_pose_detection.dart';
import 'package:camera/camera.dart';

class PoseEstimator {
  late PoseDetector poseDetector;

  Future<void> initialize() async {
    final options = PoseDetectorOptions(
      model: PoseDetectionModel.accurate,  // accurate, base, or heavy
      mode: PoseDetectionMode.stream,      // stream for real-time
    );
    poseDetector = PoseDetector(options: options);
  }

  Future<List<Pose>> processFrame(CameraImage cameraImage) async {
    final inputImage = InputImage.fromBytes(
      bytes: cameraImage.planes[0].bytes,
      metadata: InputImageMetadata(
        size: Size(cameraImage.width.toDouble(), cameraImage.height.toDouble()),
        rotation: InputImageRotation.rotation0deg,
        format: InputImageFormat.nv21,
        bytesPerRow: cameraImage.planes[0].bytesPerRow,
      ),
    );

    final poses = await poseDetector.processImage(inputImage);
    return poses;
  }

  void dispose() {
    poseDetector.close();
  }
}
```

### 2.3 On-Device ML Inference

**ONNX Runtime Mobile Integration** (ADR-0006):

```yaml
# pubspec.yaml
dependencies:
  onnxruntime_v2: ^1.16.3  # ONNX Runtime Mobile binding
```

**RTMPose Model Deployment**:
```dart
import 'package:onnxruntime_v2/onnxruntime_v2.dart';

class RTMPoseInference {
  late OrtSession session;

  Future<void> loadModel() async {
    // Load RTMPose-m INT8 quantized model (~5MB)
    session = OrtSession.fromAsset('assets/rtmpose_m_int8.onnx');
  }

  Future<List<Keypoint>> infer(Uint8List imageBytes) async {
    // Preprocess: Resize to 256x192, normalize
    final input = preprocessImage(imageBytes);

    // Run inference (30-50ms on mid-range devices)
    final inputTensor = OrtValueTensor.createTensorWithDataList(
      input,
      [1, 3, 192, 256],  // [batch, channels, height, width]
    );

    final outputs = await session.run([inputTensor]);

    // Postprocess: Extract 17 COCO keypoints
    return postprocessKeypoints(outputs[0]);
  }
}
```

### 2.4 Performance Optimization (30+ FPS Target)

**Target**: Sustained 60 FPS on iPhone 11 / Pixel 5 (mid-range baseline)

**Optimization Strategies**:

1. **Use Isolates for ML Inference** (prevent UI jank):
```dart
// Run inference on background isolate
final keypoints = await compute(_runInference, cameraFrame);

static List<Keypoint> _runInference(CameraImage image) {
  // Heavy ML computation runs on separate CPU core
  return performInference(image);
}
```

2. **Image Preprocessing on GPU**:
```dart
// Convert camera frames to ML input format on GPU where possible
import 'dart:ui' as ui;

Future<Uint8List> preprocessOnGPU(CameraImage image) async {
  final imageBuffer = await convertYUV420ToRGB(image);  // GPU-accelerated
  return imageBuffer;
}
```

3. **Memory Management** (reuse buffers):
```dart
class FrameProcessor {
  late Uint8List _frameBuffer;

  void initialize(int bufferSize) {
    // Pre-allocate buffer to avoid GC pauses
    _frameBuffer = Uint8List(bufferSize);
  }

  void processFrame(CameraImage image) {
    // Reuse _frameBuffer instead of allocating new memory
    copyImageToBuffer(image, _frameBuffer);
  }
}
```

4. **Widget Rebuilds Optimization**:
```dart
// Use RepaintBoundary to isolate animated layers
RepaintBoundary(
  child: CustomPaint(
    painter: SkeletonOverlayPainter(keypoints),
    child: OverlayArrows(errors),
  ),
);

// Use const constructors
const PoseVisualization(keypoints: keypoints);
```

### 2.5 Battery Optimization (<15% Drain/Hour)

**Target**: <15% battery drain per hour during active use

**Optimization Techniques**:

1. **Frame Rate Adaptation**:
```dart
class BatteryAwareFrameRate {
  int getTargetFPS(double batteryLevel) {
    if (batteryLevel > 0.5) return 60;   // Battery > 50%
    if (batteryLevel > 0.2) return 45;   // Battery 20-50%
    return 30;                            // Battery < 20%
  }
}
```

2. **Thermal Throttling**:
```dart
import 'package:battery_plus/battery_plus.dart';

class ThermalManager {
  void handleThermalState(ThermalState state) {
    switch (state) {
      case ThermalState.nominal:     // < 40°C
        enableFullRendering();
        break;
      case ThermalState.fair:        // 40-45°C
        reduceShadowEffects();
        simplifyOverlays();
        break;
      case ThermalState.serious:     // > 45°C
        showWarning();
        reduceToMinimalRendering();
        targetFPS = 30;
        break;
    }
  }
}
```

3. **Camera Duty Cycle**:
```dart
// Only process every Nth frame during low battery
int frameSkipCount = 0;
final skipInterval = batteryLevel < 0.2 ? 2 : 1;

void onCameraFrame(CameraImage image) {
  frameSkipCount++;
  if (frameSkipCount % skipInterval != 0) return;

  processFrame(image);  // Process every 1st or 2nd frame
}
```

### 2.6 Thermal Management Strategies

**Monitoring Device Temperature**:
```dart
import 'package:thermal/thermal.dart';

class ThermalMonitor {
  Stream<ThermalState> get thermalStateStream =>
    Thermal().onThermalStateChanged;

  void startMonitoring() {
    thermalStateStream.listen((state) {
      if (state == ThermalState.serious) {
        // Reduce computational load
        targetFPS = 30;
        disableAdvancedFeatures();
        showCoolingWarning();
      }
    });
  }
}
```

**Progressive Feature Degradation**:
```
Temperature < 40°C: Full rendering (60 FPS, all overlays)
Temperature 40-45°C: Reduced effects (45 FPS, simplified overlays)
Temperature > 45°C: Minimal mode (30 FPS, skeleton only)
```

---

## 3. Mobile-Specific UI/UX

### 3.1 Screen Size Constraints and Responsive Design

**Responsive Scaling Rules**:

| Screen Size | Skeleton Stroke | Arrow Thickness | Min Touch Target | Font Size |
|-------------|----------------|-----------------|------------------|-----------|
| **Small (<5.5")** | 3px | 5px | 44×44px (Apple) | 14pt |
| **Medium (5.5-6.5")** | 4px | 6px | 44×44px | 16pt |
| **Large (>6.5")** | 5px | 8px | 48×48px | 18pt |

**Dynamic Viewport Adaptation**:
```dart
double getScaleFactor(BuildContext context) {
  final screenDiagonal = MediaQuery.of(context).size.shortestSide;
  const baseDiagonal = 390.0;  // Base design: iPhone 14 width
  return min(screenDiagonal / baseDiagonal, 1.3);  // Cap at 1.3x
}

Widget build(BuildContext context) {
  final scale = getScaleFactor(context);
  final arrowThickness = 6.0 * scale;
  final skeletonStroke = 4.0 * scale;

  return CustomPaint(
    painter: SkeletonPainter(strokeWidth: skeletonStroke),
  );
}
```

**Safe Zones** (avoid UI overlap):
```dart
class SafeZoneLayout extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        CameraPreview(),

        // Top safe zone: 15% reserved for status bar + controls
        Positioned(
          top: MediaQuery.of(context).size.height * 0.15,
          child: MetricsBar(),
        ),

        // Bottom safe zone: 20% reserved for controls
        Positioned(
          bottom: MediaQuery.of(context).size.height * 0.20,
          child: ControlPanel(),
        ),
      ],
    );
  }
}
```

### 3.2 Touch-Friendly Controls (56×56px FAB Minimum)

**Material FAB Standard**:
```dart
class ControlPanel extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        // Minimum 56×56px touch target
        FloatingActionButton(
          onPressed: toggleOverlay,
          tooltip: 'Toggle Overlay',
          child: Icon(Icons.visibility),
        ),

        FloatingActionButton(
          onPressed: toggleArrows,
          tooltip: 'Toggle Arrows',
          child: Icon(Icons.near_me),
        ),

        FloatingActionButton(
          onPressed: showSettings,
          tooltip: 'Settings',
          child: Icon(Icons.settings),
        ),
      ],
    );
  }
}
```

**Haptic Feedback on Tap**:
```dart
import 'package:flutter/services.dart';

void onButtonTap() {
  HapticFeedback.mediumImpact();  // Tactile click feedback
  toggleFeature();
}
```

### 3.3 Performance Targets

**Critical Targets** (ADR-0003):
- **60 FPS sustained** on mid-range devices (iPhone 11, Pixel 5)
- **<500MB peak RAM usage** during ML + BLE + rendering
- **<15% battery drain/hour** (screen-on time)
- **<100ms end-to-end latency** (camera → pose → BLE → display)

**Flutter DevTools Profiling**:
```dart
// Enable performance overlay in debug mode
MaterialApp(
  showPerformanceOverlay: true,  // Show FPS graph
  debugShowCheckedModeBanner: false,
  home: PoseTrackingScreen(),
);
```

**Memory Profiling**:
```bash
# Launch with memory profiling
flutter run --profile --trace-skia

# Open DevTools
flutter pub global activate devtools
flutter pub global run devtools
```

### 3.4 Gestures and Interactions

**Quick Toggle Gestures**:
```dart
class GestureAwareCamera extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      // Double-tap: Toggle all overlays
      onDoubleTap: () {
        setState(() => overlaysEnabled = !overlaysEnabled);
      },

      // Swipe down: Show/hide metrics bar
      onVerticalDragEnd: (details) {
        if (details.velocity.pixelsPerSecond.dy > 0) {
          toggleMetricsBar();
        }
      },

      // Long-press: Freeze frame (post-action review)
      onLongPress: () {
        freezeFrame();
      },

      child: CameraPreview(),
    );
  }
}
```

### 3.5 Real-Time Overlay Design

**Ghost Avatar Transparency** (50% opacity recommended):
```dart
class GhostSkeleton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: SkeletonPainter(
        keypoints: idealPose,
        color: Color(0xFF4CAF50),  // Green for correct pose
        opacity: 0.5,              // 50% transparency
        strokeWidth: 3.0,
      ),
    );
  }
}
```

**Live Skeleton (100% opacity)**:
```dart
CustomPaint(
  painter: SkeletonPainter(
    keypoints: livePose,
    color: Color(0xFFE0F7FF),  // Light blue
    opacity: 1.0,              // Fully opaque
    strokeWidth: 4.0,
  ),
);
```

**User Settings for Transparency**:
```dart
Slider(
  value: ghostOpacity,
  min: 0.3,
  max: 0.7,
  divisions: 8,
  label: '${(ghostOpacity * 100).round()}%',
  onChanged: (value) => setState(() => ghostOpacity = value),
);
```

---

## 4. BLE Sensor Communication

### 4.1 ESP32-S3 Connection Architecture

**BLE Stack**:
```
ESP32-S3 (Peripheral)
  ↓ BLE GATT Server
  ↓ 6 IMU Sensors @ 100Hz
  ↓ Data: 12 bytes/packet × 6 sensors × 100 Hz = 57.6 kbps
  ↓
Flutter App (Central)
  ↓ flutter_reactive_ble plugin
  ↓ Parse sensor data
  ↓ Fuse with pose estimation
```

**Connection Parameters**:
```
Connection Interval: 7.5ms (fast)
Slave Latency: 0
Supervision Timeout: 4000ms
MTU: 185 bytes (Bluetooth 4.2+)
```

### 4.2 Flutter BLE Integration

**Installation**:
```yaml
# pubspec.yaml
dependencies:
  flutter_reactive_ble: ^5.2.0  # Production-grade (Philips Hue uses this)
```

**Connection Manager**:
```dart
import 'package:flutter_reactive_ble/flutter_reactive_ble.dart';

class IMUSensorManager {
  final FlutterReactiveBle ble = FlutterReactiveBle();
  final StreamController<SensorData> dataController = StreamController.broadcast();
  final List<DiscoveredDevice> connectedDevices = [];

  Stream<SensorData> get dataStream => dataController.stream;

  Future<void> scanAndConnect() async {
    // Scan for IMU sensors (ESP32-S3 devices)
    ble.scanForDevices(
      withServices: [Uuid.parse('4fafc201-1fb5-459e-8fcc-c5c9c331914b')],
      scanMode: ScanMode.lowLatency,
    ).listen((device) async {
      if (device.name.startsWith('IMU_')) {
        await _connectDevice(device);
      }
    });

    // Stop scan after 10 seconds
    await Future.delayed(Duration(seconds: 10));
    ble.deinitialize();
  }

  Future<void> _connectDevice(DiscoveredDevice device) async {
    // Connect to device
    ble.connectToDevice(id: device.id).listen((connectionState) async {
      if (connectionState.connectionState == DeviceConnectionState.connected) {
        connectedDevices.add(device);
        await _subscribeToNotifications(device);
      }
    });
  }

  Future<void> _subscribeToNotifications(DiscoveredDevice device) async {
    final characteristic = QualifiedCharacteristic(
      serviceId: Uuid.parse('4fafc201-1fb5-459e-8fcc-c5c9c331914b'),
      characteristicId: Uuid.parse('beb5483e-36e1-4688-b7f5-ea07361b26a8'),
      deviceId: device.id,
    );

    // Subscribe to sensor data notifications (100 Hz stream)
    ble.subscribeToCharacteristic(characteristic).listen((data) {
      final sensorData = _parseSensorPacket(data);
      dataController.add(sensorData);
    });
  }

  SensorData _parseSensorPacket(List<int> bytes) {
    // Parse 12-byte packet: timestamp(4) + accel(6) + gyro(6)
    final buffer = ByteData.sublistView(Uint8List.fromList(bytes));

    return SensorData(
      timestamp: buffer.getUint32(0, Endian.little),
      accel: Vector3(
        buffer.getInt16(4, Endian.little) / 32768.0 * 16.0,   // ±16g
        buffer.getInt16(6, Endian.little) / 32768.0 * 16.0,
        buffer.getInt16(8, Endian.little) / 32768.0 * 16.0,
      ),
      gyro: Vector3(
        buffer.getInt16(10, Endian.little) / 32768.0 * 2000.0,  // ±2000dps
        buffer.getInt16(12, Endian.little) / 32768.0 * 2000.0,
        buffer.getInt16(14, Endian.little) / 32768.0 * 2000.0,
      ),
    );
  }
}
```

### 4.3 Data Streaming Optimization

**Throughput**: 1.35 Mbps (Flutter BLE performance)
- **Required**: 57.6 kbps (6 IMUs × 100 Hz × 12 bytes)
- **Available headroom**: 95.7% (excellent margin)

**Packet Loss Mitigation**:
```dart
class PacketBuffer {
  final Queue<SensorData> buffer = Queue();
  int droppedPackets = 0;

  void addPacket(SensorData data) {
    if (buffer.length > 100) {
      // Buffer overflow: drop oldest packet
      buffer.removeFirst();
      droppedPackets++;
    }
    buffer.add(data);
  }

  double getPacketLossRate() {
    return droppedPackets / (buffer.length + droppedPackets);
  }
}
```

### 4.4 Latency Requirements (<100ms End-to-End)

**Latency Budget**:
```
Camera Frame Capture:        16.7ms (60 FPS)
Pose Estimation (MediaPipe): 30-50ms
BLE Data Fetch:              12ms   (measured Flutter)
Sensor Fusion:               5-10ms
Rendering Update:            5-8ms
─────────────────────────────────────
Total:                       ~70-97ms ✅ (within 100ms budget)
```

**Async Processing Pipeline**:
```dart
class RealtimePipeline {
  Future<void> processFrame(CameraImage image, List<SensorData> imuData) async {
    final startTime = DateTime.now();

    // Parallel execution
    final results = await Future.wait([
      compute(_poseEstimation, image),     // 30-50ms (isolate)
      compute(_sensorFusion, imuData),     // 5-10ms (isolate)
    ]);

    final pose = results[0] as Pose;
    final fusion = results[1] as FusionResult;

    // Combine results
    final combined = combineData(pose, fusion);

    final latency = DateTime.now().difference(startTime);
    if (latency.inMilliseconds > 100) {
      logger.warning('Latency exceeded: ${latency.inMilliseconds}ms');
    }

    updateVisualization(combined);
  }
}
```

### 4.5 Connection Management (Reconnection, Battery)

**Auto-Reconnect**:
```dart
class BLEConnectionManager {
  void monitorConnection(DiscoveredDevice device) {
    ble.connectToDevice(id: device.id).listen(
      (state) {
        switch (state.connectionState) {
          case DeviceConnectionState.connected:
            onConnected(device);
            break;
          case DeviceConnectionState.disconnected:
            onDisconnected(device);
            attemptReconnect(device);
            break;
        }
      },
      onError: (error) {
        logger.error('Connection error: $error');
        attemptReconnect(device);
      },
    );
  }

  Future<void> attemptReconnect(DiscoveredDevice device) async {
    // Exponential backoff: 1s, 2s, 4s, 8s
    for (int attempt = 0; attempt < 4; attempt++) {
      await Future.delayed(Duration(seconds: pow(2, attempt).toInt()));

      try {
        await _connectDevice(device);
        logger.info('Reconnected after ${attempt + 1} attempts');
        return;
      } catch (e) {
        logger.warning('Reconnect attempt ${attempt + 1} failed');
      }
    }

    showReconnectFailedDialog();
  }
}
```

**Battery Impact**:
```dart
// Disable BLE scanning when battery low
if (batteryLevel < 0.15) {
  ble.stopScan();
  showLowBatteryWarning();
}

// Reduce connection interval during low battery
if (batteryLevel < 0.3) {
  // Request longer connection interval to save power
  requestConnectionUpdate(
    interval: 30,  // 30ms (vs 7.5ms normal)
    latency: 4,
  );
}
```

---

## 5. Commercial Mobile Apps Analysis

### 5.1 Peloton App Architecture Insights

**Key Learnings**:
- **Offline-First**: Download workouts for offline use (no network dependency during exercise)
- **Leaderboard Integration**: Real-time performance comparison (motivational)
- **Metrics Dashboard**: Clear, large fonts for at-a-glance metrics
- **Audio Cues**: Voice prompts for form corrections (hands-free feedback)

**Applicable to Movement Chain AI**:
- Cache pose templates locally for offline analysis
- Show real-time comparison with previous personal best
- Large, high-contrast metric display (rep count, quality score)

### 5.2 Apple Fitness+ Integration Approach

**Key Learnings**:
- **Seamless Watch Integration**: Apple Watch for heart rate, iPhone/iPad for video
- **Burn Bar**: Comparative visualization (you vs others)
- **Instructor Overlay**: Transparent metrics don't obscure instructor
- **Accessibility**: Full VoiceOver support for vision-impaired users

**Applicable to Movement Chain AI**:
- BLE sensor integration (ESP32-S3 as "watch")
- Non-intrusive overlay design (50% ghost avatar opacity)
- Voice feedback for accessibility

### 5.3 Nike Training Club UX Patterns

**Key Learnings** (Source: Stormotion Fitness App UX):
- **Minimalist Design**: White background + neon accents (reduces distractions)
- **Progress Visualization**: Stat cards pulse gently when loading (Strava-style)
- **High-Contrast Interface**: Essential for outdoor use (bright sunlight)
- **Touch Targets**: 56×56px minimum (Material Design standard)

**Applicable to Movement Chain AI**:
```dart
// High-contrast mode for outdoor use
final colorScheme = brightness == Brightness.light
  ? ColorScheme.light(primary: Colors.deepOrange)  // Neon accent
  : ColorScheme.dark(primary: Colors.cyan);

// Pulsing stat cards
AnimatedOpacity(
  opacity: isLoading ? 0.5 : 1.0,
  duration: Duration(milliseconds: 800),
  curve: Curves.easeInOut,
  child: StatCard(value: repCount),
);
```

### 5.4 Common Patterns Across Apps

| Feature | Peloton | Apple Fitness+ | Nike Training | Movement Chain AI |
|---------|---------|----------------|---------------|-------------------|
| **Real-time Metrics** | ✅ HR, Power | ✅ HR, Calories | ✅ Time, Reps | ✅ Pose Quality, Reps |
| **Audio Cues** | ✅ Music + Coach | ✅ Instructor | ✅ Coach | ✅ Form Corrections |
| **Offline Mode** | ✅ Download | ❌ Streaming only | ✅ Download | ✅ Cached Poses |
| **Wearable Integration** | ✅ Heart rate strap | ✅ Apple Watch | ✅ Heart rate monitor | ✅ ESP32-S3 IMUs |
| **Social Features** | ✅ Leaderboard | ✅ Burn Bar | ✅ Challenges | ⚠️ Future feature |

---

## 6. Mobile SDKs & Libraries

### 6.1 QuickPose (iOS/React Native)

**Overview**:
- **Platform**: iOS (primary), Android (roadmap)
- **Technology**: MediaPipe/BlazePose enhanced
- **Performance**: 120 FPS on iOS (4x faster than MediaPipe)

**Pricing**:
- **Free Tier**: Up to 100 monthly active devices
- **Launch Tier**: Pay-per-device after 100 users

**Features**:
- Rep counting, range of motion, form feedback
- 33 keypoints (MediaPipe landmark set)
- Audio feedback for corrections
- Built-in skeleton visualization

**When to Use**:
- iOS-first applications
- Need production-ready code quickly
- Acceptable to be locked into QuickPose ecosystem

**Why We're Not Using It**:
- iOS-only (Android in roadmap, not production)
- Vendor lock-in risk
- Custom needs require more flexibility

### 6.2 KinesteX (Multi-Framework)

**Overview**:
- **Platforms**: Flutter, SwiftUI, React Native, Kotlin, PWA
- **Technology**: Proprietary CV (90%+ accuracy)
- **Exercise Library**: 400+ expertly crafted exercises

**Pricing**:
- Contact for pricing (not publicly disclosed)

**Features**:
- Real-time motion tracking with voice prompts
- White-label (fully customizable UI)
- HIPAA compliant, on-device processing
- Multi-platform lightweight packages

**When to Use**:
- Need comprehensive exercise library
- White-label fitness app
- Multi-platform from day one

**Why We're Not Using It**:
- Closed-source (can't customize ML pipeline)
- Pricing unknown (potential cost concern)
- Our focus is movement analysis, not exercise library

### 6.3 Sency (Cross-Platform)

**Overview**:
- **Platforms**: iOS, Android, Web
- **Technology**: Proprietary AI with edge computing
- **Processing**: All on-device (zero cloud latency)

**Pricing**:
- **Free Tier**: Up to 100 unique active users
- **Pay-as-you-go**: After 100 users, per-active-user billing

**Features**:
- Initial assessment (4-step onboarding, 8 mobility tests)
- Injury risk assessment
- Personalized workout plans
- Real-time posture correction

**When to Use**:
- Need initial fitness assessment
- Cross-platform required
- Privacy-critical (GDPR compliant, edge processing)

**Why We're Not Using It**:
- Overkill for our MVP (we don't need assessment workflows)
- Prefer open-source foundation (MediaPipe → RTMPose)

### 6.4 MediaPipe Official Plugins

**Why We Chose This** ✅:
- **Open-source**: Apache 2.0 (no vendor lock-in)
- **Cross-platform**: iOS, Android, Web, Desktop
- **3D Pose**: Real-world coordinates (essential for biomechanics)
- **Mature ecosystem**: Extensive tutorials, community support
- **Google backing**: Long-term maintenance guaranteed

**Flutter Integration**:
```yaml
dependencies:
  google_mlkit_pose_detection: ^0.10.0
```

**Advantages**:
- 33 keypoints with visibility/presence scores
- Free forever (no per-user costs)
- Can migrate to RTMPose later (similar pipeline)

**Disadvantages**:
- 30-40 FPS (slower than QuickPose's 120 FPS)
- Single-person only (can't track multiple people)

### 6.5 Comparison and Recommendations

| SDK | Platform Support | Pricing | Performance | Open-Source | Recommendation |
|-----|------------------|---------|-------------|-------------|----------------|
| **MediaPipe** ✅ | iOS, Android, Web | FREE | 30-40 FPS | ✅ Yes | **Use for MVP** |
| QuickPose | iOS only | Free (100 devices) | 120 FPS | ❌ No | iOS-only apps |
| KinesteX | Multi-framework | Contact | 90%+ accuracy | ❌ No | Exercise library apps |
| Sency | iOS, Android, Web | Free (100 users) | Excellent | ❌ No | Assessment workflows |

**Our Strategy**:
1. **MVP**: MediaPipe (fastest development, free, 3D pose)
2. **Optimization**: Migrate to RTMPose (2-3x faster, higher accuracy)
3. **Future**: Evaluate QuickPose if iOS performance becomes critical

---

## 7. Implementation Examples

### 7.1 Flutter + MediaPipe Setup

**Complete Integration**:

```dart
import 'package:camera/camera.dart';
import 'package:google_mlkit_pose_detection/google_mlkit_pose_detection.dart';
import 'dart:isolate';

class RealtimePoseEstimator extends StatefulWidget {
  @override
  _RealtimePoseEstimatorState createState() => _RealtimePoseEstimatorState();
}

class _RealtimePoseEstimatorState extends State<RealtimePoseEstimator> {
  late CameraController _camera;
  late PoseDetector _poseDetector;
  bool _isProcessing = false;
  List<Pose> _poses = [];

  @override
  void initState() {
    super.initState();
    _initializeCamera();
    _initializePoseDetector();
  }

  Future<void> _initializeCamera() async {
    final cameras = await availableCameras();
    _camera = CameraController(
      cameras.first,
      ResolutionPreset.medium,
      enableAudio: false,
      imageFormatGroup: ImageFormatGroup.yuv420,  // Efficient format
    );
    await _camera.initialize();
    _camera.startImageStream(_onCameraFrame);
    setState(() {});
  }

  void _initializePoseDetector() {
    final options = PoseDetectorOptions(
      model: PoseDetectionModel.accurate,
      mode: PoseDetectionMode.stream,
    );
    _poseDetector = PoseDetector(options: options);
  }

  void _onCameraFrame(CameraImage image) async {
    if (_isProcessing) return;  // Skip frame if still processing
    _isProcessing = true;

    // Convert to InputImage
    final inputImage = _convertToInputImage(image);

    // Run pose detection (30-50ms on modern devices)
    final poses = await _poseDetector.processImage(inputImage);

    setState(() {
      _poses = poses;
      _isProcessing = false;
    });
  }

  InputImage _convertToInputImage(CameraImage image) {
    final WriteBuffer allBytes = WriteBuffer();
    for (Plane plane in image.planes) {
      allBytes.putUint8List(plane.bytes);
    }
    final bytes = allBytes.done().buffer.asUint8List();

    final imageSize = Size(image.width.toDouble(), image.height.toDouble());
    final imageRotation = InputImageRotation.rotation0deg;
    final inputImageFormat = InputImageFormatValue.fromRawValue(image.format.raw) ??
        InputImageFormat.nv21;

    final planeData = image.planes.map((plane) {
      return InputImagePlaneMetadata(
        bytesPerRow: plane.bytesPerRow,
        height: plane.height,
        width: plane.width,
      );
    }).toList();

    final inputImageData = InputImageData(
      size: imageSize,
      imageRotation: imageRotation,
      inputImageFormat: inputImageFormat,
      planeData: planeData,
    );

    return InputImage.fromBytes(
      bytes: bytes,
      inputImageData: inputImageData,
    );
  }

  @override
  Widget build(BuildContext context) {
    if (!_camera.value.isInitialized) {
      return Center(child: CircularProgressIndicator());
    }

    return Stack(
      children: [
        CameraPreview(_camera),
        CustomPaint(
          painter: PosePainter(_poses),
          child: Container(),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _camera.dispose();
    _poseDetector.close();
    super.dispose();
  }
}
```

### 7.2 BLE Sensor Integration Code

**See Section 4.2** for complete BLE integration example.

**Quick Start**:
```dart
final imuManager = IMUSensorManager();
await imuManager.scanAndConnect();

// Listen to sensor stream
imuManager.dataStream.listen((sensorData) {
  print('Accel: ${sensorData.accel}, Gyro: ${sensorData.gyro}');
  fuseSensorData(sensorData);
});
```

### 7.3 Real-Time Visualization Rendering

**Skeleton Overlay Painter**:
```dart
class SkeletonPainter extends CustomPainter {
  final List<Pose> poses;
  final Color color;
  final double opacity;
  final double strokeWidth;

  SkeletonPainter({
    required this.poses,
    this.color = Colors.white,
    this.opacity = 1.0,
    this.strokeWidth = 4.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (poses.isEmpty) return;

    final paint = Paint()
      ..color = color.withOpacity(opacity)
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    final pose = poses.first;

    // Draw skeleton connections
    _drawConnection(canvas, paint, pose, PoseLandmarkType.leftShoulder, PoseLandmarkType.rightShoulder);
    _drawConnection(canvas, paint, pose, PoseLandmarkType.leftShoulder, PoseLandmarkType.leftElbow);
    _drawConnection(canvas, paint, pose, PoseLandmarkType.leftElbow, PoseLandmarkType.leftWrist);
    // ... continue for all body connections

    // Draw joints as circles
    for (final landmark in pose.landmarks.values) {
      if (landmark.likelihood > 0.5) {
        canvas.drawCircle(
          Offset(landmark.x * size.width, landmark.y * size.height),
          5.0,
          paint..style = PaintingStyle.fill,
        );
      }
    }
  }

  void _drawConnection(Canvas canvas, Paint paint, Pose pose,
      PoseLandmarkType start, PoseLandmarkType end) {
    final startLandmark = pose.landmarks[start];
    final endLandmark = pose.landmarks[end];

    if (startLandmark != null && endLandmark != null &&
        startLandmark.likelihood > 0.5 && endLandmark.likelihood > 0.5) {
      canvas.drawLine(
        Offset(startLandmark.x, startLandmark.y),
        Offset(endLandmark.x, endLandmark.y),
        paint,
      );
    }
  }

  @override
  bool shouldRepaint(SkeletonPainter oldDelegate) {
    return poses != oldDelegate.poses;
  }
}
```

**Error Arrow Overlay**:
```dart
class CorrectionArrow extends StatelessWidget {
  final Offset position;
  final Vector2 direction;
  final double severity;  // 0.0 to 10.0

  @override
  Widget build(BuildContext context) {
    final color = _getColorBySeverity(severity);
    final length = _getLengthBySeverity(severity);

    return CustomPaint(
      painter: ArrowPainter(
        start: position,
        direction: direction.normalized(),
        length: length,
        color: color,
      ),
    );
  }

  Color _getColorBySeverity(double severity) {
    if (severity > 7.0) return Color(0xFFC62828);  // Red (critical)
    if (severity > 4.0) return Color(0xFFF9A825);  // Amber (warning)
    return Color(0xFF00897B);                      // Blue-green (good)
  }

  double _getLengthBySeverity(double severity) {
    return (severity / 10.0) * 60 + 20;  // 20px to 80px
  }
}
```

### 7.4 State Management Patterns

**Recommended: Riverpod** (Flutter best practice):

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Providers
final poseProvider = StateProvider<List<Pose>>((ref) => []);
final sensorDataProvider = StateProvider<List<SensorData>>((ref) => []);
final errorsProvider = StateProvider<List<ErrorReport>>((ref) => []);

// Combined state
final feedbackStateProvider = Provider<FeedbackState>((ref) {
  final poses = ref.watch(poseProvider);
  final sensors = ref.watch(sensorDataProvider);
  final errors = ref.watch(errorsProvider);

  return FeedbackState(
    pose: poses.isNotEmpty ? poses.first : null,
    sensorData: sensors,
    errors: errors,
  );
});

// UI consumption
class FeedbackOverlay extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final feedbackState = ref.watch(feedbackStateProvider);

    return Stack(
      children: [
        if (feedbackState.pose != null)
          SkeletonRenderer(pose: feedbackState.pose!),

        ...feedbackState.errors.map((error) => CorrectionArrow(error)),
      ],
    );
  }
}
```

---

## Related Decisions

- [ADR-0003: Flutter Mobile Framework](../decisions/0003-flutter-mobile.md) - Framework selection rationale
- [ADR-0006: ONNX Runtime Deployment](../decisions/0006-onnx-runtime-deployment.md) - ML model deployment strategy

---

## Appendix: Performance Benchmarking

### Device Targets

**Mid-Range Baseline** (ADR-0003):
- **iOS**: iPhone 11 (A13 Bionic, 4GB RAM)
- **Android**: Google Pixel 5 (Snapdragon 765G, 8GB RAM)

**Expected Performance**:
```
iPhone 11:
  - Pose Estimation: 35-40 FPS (MediaPipe)
  - BLE Throughput: 1.2 Mbps
  - Battery Drain: 12-15%/hour

Pixel 5:
  - Pose Estimation: 30-35 FPS (MediaPipe)
  - BLE Throughput: 1.1 Mbps
  - Battery Drain: 14-18%/hour
```

### Profiling Checklist

**Pre-Launch Benchmarks**:
- [ ] Render pipeline maintains 60 FPS (P95 >55 FPS)
- [ ] Transparency overlay adds <5ms per frame
- [ ] Memory usage <500MB during peak rendering
- [ ] Battery drain <15% per hour (screen-on time)
- [ ] BLE haptic latency <10ms (visual to tactile)
- [ ] Arrow animations smooth (no dropped frames)

**Tools**:
- **Flutter DevTools**: Frame rendering timeline, memory allocation
- **Xcode Instruments**: iOS GPU usage, battery impact
- **Android Profiler**: CPU, memory, network (BLE) monitoring

---

**Document Version:** 1.0
**Last Updated:** 2025-12-01
**Maintained By:** Movement Chain AI Mobile Team
**Next Review:** Q2 2025
