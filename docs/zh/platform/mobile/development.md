# Mobile App Development Guide 移动应用开发指南

> **Comprehensive guide for building the Movement Chain AI mobile application**
> **构建 Movement Chain AI 移动应用的综合指南**
>
> **Last Updated 最后更新:** 2025-12-01
> **Target Platforms 目标平台:** iOS, Android (Flutter-based)

---

## 1. Framework Selection & Rationale 框架选择与理由

### 1.1 Why Flutter (Our Choice) 为什么选择Flutter

**Decision 决策**: Flutter 3.x with Dart has been selected as the primary mobile development framework for Movement Chain AI.

Flutter 3.x 与 Dart 已被选为 Movement Chain AI 的主要移动开发框架。

**Performance Benchmarks 性能基准** (Real-time camera + ML + BLE workload 实时相机+机器学习+BLE工作负载):

| Framework 框架 | Frame Rate 帧率 | Memory (Avg) 平均内存 | Frame Drops 丢帧率 | ML Inference Overhead ML推理开销 |
|-----------|------------|--------------|-------------|----------------------|
| **Flutter** ✅ | 60-120 FPS | 450MB | ~30% fewer than RN | +15-20ms vs Native |
| React Native | 60 FPS capable | 520MB | Occasional spikes | +25-30ms vs Native |
| Native (Swift/Kotlin) | 120 FPS | 380MB | Minimal | Baseline (fastest) |

**Key Advantages 核心优势**:

- **70% fewer frame drops 减少70%丢帧** vs React Native during ML workloads 机器学习负载期间
- **Compiled performance 编译性能**: Dart compiles to native ARM code (no JavaScript bridge) Dart编译为原生ARM代码（无JavaScript桥接）
- **40% cost savings 节省40%成本** vs dual native development 相比双原生开发 ($80K Flutter vs $140K Native over 12 months 12个月内)
- **Single codebase 单一代码库**: 90-95% code sharing between iOS and Android iOS与Android之间共享90-95%代码
- **Hot reload 热重载**: Faster iteration cycles for rapid development 更快的迭代周期实现快速开发

### 1.2 React Native Comparison React Native对比

**React Native Strengths React Native优势**:

- Massive ecosystem (npm 2M+ packages) 庞大生态系统（npm超200万包）
- Largest developer talent pool 最大的开发者人才库
- JavaScript/TypeScript (easier hiring) JavaScript/TypeScript（更易招聘）
- Mature tooling (Metro, Flipper) 成熟工具（Metro、Flipper）

**React Native Weaknesses for Movement Chain AI React Native对于Movement Chain AI的劣势**:

- 60 FPS baseline but inconsistent under ML workloads 60 FPS基准但在ML负载下不稳定
- 15% higher memory usage (520MB vs 450MB) 内存使用高15%（520MB对比450MB）
- Frame drop rate 70% higher during pose estimation 姿态估计期间丢帧率高70% (8.2% vs 3.8%)
- GC pauses: 8-15ms (impacts real-time consistency) GC暂停：8-15毫秒（影响实时一致性）

**Verdict 结论**: Frame drops during pose estimation are critical for UX. Flutter's performance edge justifies the Dart learning curve.

姿态估计期间的丢帧对用户体验至关重要。Flutter的性能优势证明学习Dart是值得的。

### 1.3 Native iOS/Android Trade-offs 原生iOS/Android权衡

**Native Development Strengths 原生开发优势**:

- Best performance 最佳性能 (108 FPS iOS, 102 FPS Android)
- Lowest latency 最低延迟 (9.3ms iOS, 9.8ms Android)
- 1.8 Mbps BLE throughput (highest) BLE吞吐量1.8 Mbps（最高）
- Direct hardware access 直接硬件访问 (Metal, CameraX)

**Native Development Weaknesses 原生开发劣势**:

- **2x development cost 2倍开发成本** ($1.2M-1.5M vs $450K-600K Flutter)
- 0% code sharing (separate Swift + Kotlin codebases) 0%代码共享（独立的Swift+Kotlin代码库）
- Slower iteration (no hot reload) 迭代较慢（无热重载）
- 2x maintenance overhead (duplicate bug fixes, features) 2倍维护开销（重复修复bug和功能）

**When to Use Native 何时使用原生**:

- Premium apps justifying 2x cost 证明2倍成本合理的高端应用 (medical devices 医疗设备, professional sports 专业体育)
- Maximum performance is critical 最大性能至关重要 (120+ FPS target 目标120+FPS)
- Platform-specific features heavily used 大量使用平台特定功能

### 1.4 Decision Matrix 决策矩阵

| Application Type 应用类型 | Recommended Framework 推荐框架 | Justification 理由 |
|------------------|----------------------|---------------|
| **Movement Chain AI Production** | **Flutter** ✅ | 98 FPS, 1.35 Mbps BLE, 90% code sharing, best balance 最佳平衡 |
| **Maximum Performance 最大性能** | Native (Swift+Kotlin) | 108 FPS, but 2x dev cost 但2倍开发成本 |
| **React/JS Team** | React Native | 88 FPS acceptable, leverage existing skills 利用现有技能 |
| **iOS-Only Premium 仅iOS高端** | Native (Swift) | 108 FPS, Core ML integration Core ML集成 |
| **Budget Prototype 预算原型** | Flutter ✅ | Fast development, single codebase 快速开发，单一代码库 |
| **Startup MVP** | Flutter ✅ | Fastest time-to-market 最快上市时间 |

**Our Choice 我们的选择: Flutter** - Best cost-to-performance ratio for Movement Chain AI requirements 对于Movement Chain AI需求的最佳性价比。

---

## 2. Pose Estimation on Mobile 移动端姿态估计

### 2.1 Model Selection: MediaPipe vs RTMPose 模型选择：MediaPipe对比RTMPose

**For MVP (Current) MVP阶段（当前）**: **MediaPipe Pose** ✅

- Fastest time to market 最快上市时间
- Cross-platform (iOS/Android) 跨平台
- 3D pose for biomechanics 用于生物力学的3D姿态
- Extensive tutorials/examples 大量教程/示例
- 33 keypoints with visibility scores 33个带可见性评分的关键点

**For Optimization (Month 3-6) 优化阶段（第3-6个月）**: **RTMPose-m** ⏫

- 2-3x faster inference 推理速度快2-3倍 (90+ FPS vs 30-40 FPS)
- Higher accuracy 更高精度 (75.8% AP vs ~72% AP)
- Lower compute costs 更低计算成本
- Better battery life 更好的电池续航

### 2.2 MediaPipe Flutter Integration MediaPipe Flutter集成

**Installation 安装**:

```yaml
# pubspec.yaml
dependencies:
  google_mlkit_pose_detection: ^0.10.0
  camera: ^0.10.5+2
```

**Basic Implementation 基本实现**:

```dart
import 'package:google_mlkit_pose_detection/google_mlkit_pose_detection.dart';
import 'package:camera/camera.dart';

class PoseEstimator {
  late PoseDetector poseDetector;

  Future<void> initialize() async {
    final options = PoseDetectorOptions(
      model: PoseDetectionModel.accurate,  // accurate, base, or heavy
      mode: PoseDetectionMode.stream,      // stream for real-time 实时流式处理
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

### 2.3 On-Device ML Inference 设备端ML推理

**ONNX Runtime Mobile Integration ONNX Runtime移动集成** (ADR-0006):

```yaml
# pubspec.yaml
dependencies:
  onnxruntime_v2: ^1.16.3  # ONNX Runtime Mobile binding
```

**RTMPose Model Deployment RTMPose模型部署**:

```dart
import 'package:onnxruntime_v2/onnxruntime_v2.dart';

class RTMPoseInference {
  late OrtSession session;

  Future<void> loadModel() async {
    // Load RTMPose-m INT8 quantized model (~5MB)
    // 加载RTMPose-m INT8量化模型（约5MB）
    session = OrtSession.fromAsset('assets/rtmpose_m_int8.onnx');
  }

  Future<List<Keypoint>> infer(Uint8List imageBytes) async {
    // Preprocess: Resize to 256x192, normalize
    // 预处理：调整大小为256x192，归一化
    final input = preprocessImage(imageBytes);

    // Run inference (30-50ms on mid-range devices)
    // 运行推理（中端设备上30-50毫秒）
    final inputTensor = OrtValueTensor.createTensorWithDataList(
      input,
      [1, 3, 192, 256],  // [batch, channels, height, width]
    );

    final outputs = await session.run([inputTensor]);

    // Postprocess: Extract 17 COCO keypoints
    // 后处理：提取17个COCO关键点
    return postprocessKeypoints(outputs[0]);
  }
}
```

### 2.4 Performance Optimization (30+ FPS Target) 性能优化（目标30+FPS）

**Target 目标**: Sustained 60 FPS on iPhone 11 / Pixel 5 (mid-range baseline 中端基准)

**Optimization Strategies 优化策略**:

1. **Use Isolates for ML Inference 使用Isolate进行ML推理** (prevent UI jank 防止UI卡顿):

```dart
// Run inference on background isolate
// 在后台isolate上运行推理
final keypoints = await compute(_runInference, cameraFrame);

static List<Keypoint> _runInference(CameraImage image) {
  // Heavy ML computation runs on separate CPU core
  // 重型ML计算在独立CPU核心上运行
  return performInference(image);
}
```

1. **Image Preprocessing on GPU 在GPU上进行图像预处理**:

```dart
// Convert camera frames to ML input format on GPU where possible
// 在可能的情况下在GPU上将相机帧转换为ML输入格式
import 'dart:ui' as ui;

Future<Uint8List> preprocessOnGPU(CameraImage image) async {
  final imageBuffer = await convertYUV420ToRGB(image);  // GPU-accelerated GPU加速
  return imageBuffer;
}
```

1. **Memory Management 内存管理** (reuse buffers 重用缓冲区):

```dart
class FrameProcessor {
  late Uint8List _frameBuffer;

  void initialize(int bufferSize) {
    // Pre-allocate buffer to avoid GC pauses
    // 预分配缓冲区避免GC暂停
    _frameBuffer = Uint8List(bufferSize);
  }

  void processFrame(CameraImage image) {
    // Reuse _frameBuffer instead of allocating new memory
    // 重用_frameBuffer而不是分配新内存
    copyImageToBuffer(image, _frameBuffer);
  }
}
```

1. **Widget Rebuilds Optimization 组件重建优化**:

```dart
// Use RepaintBoundary to isolate animated layers
// 使用RepaintBoundary隔离动画层
RepaintBoundary(
  child: CustomPaint(
    painter: SkeletonOverlayPainter(keypoints),
    child: OverlayArrows(errors),
  ),
);

// Use const constructors
// 使用const构造函数
const PoseVisualization(keypoints: keypoints);
```

### 2.5 Battery Optimization (<15% Drain/Hour) 电池优化（每小时消耗<15%）

**Target 目标**: <15% battery drain per hour during active use 活跃使用期间每小时电池消耗<15%

**Optimization Techniques 优化技术**:

1. **Frame Rate Adaptation 帧率自适应**:

```dart
class BatteryAwareFrameRate {
  int getTargetFPS(double batteryLevel) {
    if (batteryLevel > 0.5) return 60;   // Battery > 50% 电池>50%
    if (batteryLevel > 0.2) return 45;   // Battery 20-50% 电池20-50%
    return 30;                            // Battery < 20% 电池<20%
  }
}
```

1. **Thermal Throttling 温控节流**:

```dart
import 'package:battery_plus/battery_plus.dart';

class ThermalManager {
  void handleThermalState(ThermalState state) {
    switch (state) {
      case ThermalState.nominal:     // < 40°C
        enableFullRendering();
        break;
      case ThermalState.fair:        // 40-45°C
        reduceShadowEffects();       // 减少阴影效果
        simplifyOverlays();          // 简化覆盖层
        break;
      case ThermalState.serious:     // > 45°C
        showWarning();               // 显示警告
        reduceToMinimalRendering();  // 降至最小渲染
        targetFPS = 30;
        break;
    }
  }
}
```

1. **Camera Duty Cycle 相机工作周期**:

```dart
// Only process every Nth frame during low battery
// 低电量时仅处理每第N帧
int frameSkipCount = 0;
final skipInterval = batteryLevel < 0.2 ? 2 : 1;

void onCameraFrame(CameraImage image) {
  frameSkipCount++;
  if (frameSkipCount % skipInterval != 0) return;

  processFrame(image);  // Process every 1st or 2nd frame 处理每第1或第2帧
}
```

### 2.6 Thermal Management Strategies 温控管理策略

**Monitoring Device Temperature 监控设备温度**:

```dart
import 'package:thermal/thermal.dart';

class ThermalMonitor {
  Stream<ThermalState> get thermalStateStream =>
    Thermal().onThermalStateChanged;

  void startMonitoring() {
    thermalStateStream.listen((state) {
      if (state == ThermalState.serious) {
        // Reduce computational load 降低计算负载
        targetFPS = 30;
        disableAdvancedFeatures();   // 禁用高级功能
        showCoolingWarning();        // 显示降温警告
      }
    });
  }
}
```

**Progressive Feature Degradation 渐进式功能降级**:

```
Temperature < 40°C 温度<40°C: Full rendering (60 FPS, all overlays) 全渲染（60 FPS，所有覆盖层）
Temperature 40-45°C 温度40-45°C: Reduced effects (45 FPS, simplified overlays) 降低效果（45 FPS，简化覆盖层）
Temperature > 45°C 温度>45°C: Minimal mode (30 FPS, skeleton only) 最小模式（30 FPS，仅骨架）
```

---

## 3. Mobile-Specific UI/UX 移动端专用界面设计

### 3.1 Screen Size Constraints and Responsive Design 屏幕尺寸限制与响应式设计

**Responsive Scaling Rules 响应式缩放规则**:

| Screen Size 屏幕尺寸 | Skeleton Stroke 骨架线宽 | Arrow Thickness 箭头粗细 | Min Touch Target 最小触控目标 | Font Size 字体大小 |
|-------------|----------------|-----------------|------------------|-----------|
| **Small (<5.5")** | 3px | 5px | 44×44px (Apple) | 14pt |
| **Medium (5.5-6.5")** | 4px | 6px | 44×44px | 16pt |
| **Large (>6.5")** | 5px | 8px | 48×48px | 18pt |

**Dynamic Viewport Adaptation 动态视口适配**:

```dart
double getScaleFactor(BuildContext context) {
  final screenDiagonal = MediaQuery.of(context).size.shortestSide;
  const baseDiagonal = 390.0;  // Base design: iPhone 14 width 基准设计：iPhone 14宽度
  return min(screenDiagonal / baseDiagonal, 1.3);  // Cap at 1.3x 上限1.3倍
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

**Safe Zones 安全区域** (avoid UI overlap 避免UI重叠):

```dart
class SafeZoneLayout extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        CameraPreview(),

        // Top safe zone: 15% reserved for status bar + controls
        // 顶部安全区：为状态栏+控制预留15%
        Positioned(
          top: MediaQuery.of(context).size.height * 0.15,
          child: MetricsBar(),
        ),

        // Bottom safe zone: 20% reserved for controls
        // 底部安全区：为控制预留20%
        Positioned(
          bottom: MediaQuery.of(context).size.height * 0.20,
          child: ControlPanel(),
        ),
      ],
    );
  }
}
```

### 3.2 Touch-Friendly Controls (56×56px FAB Minimum) 触控友好控制（最小56×56px FAB）

**Material FAB Standard Material FAB标准**:

```dart
class ControlPanel extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        // Minimum 56×56px touch target 最小56×56px触控目标
        FloatingActionButton(
          onPressed: toggleOverlay,
          tooltip: 'Toggle Overlay 切换覆盖层',
          child: Icon(Icons.visibility),
        ),

        FloatingActionButton(
          onPressed: toggleArrows,
          tooltip: 'Toggle Arrows 切换箭头',
          child: Icon(Icons.near_me),
        ),

        FloatingActionButton(
          onPressed: showSettings,
          tooltip: 'Settings 设置',
          child: Icon(Icons.settings),
        ),
      ],
    );
  }
}
```

**Haptic Feedback on Tap 触控时的haptic反馈**:

```dart
import 'package:flutter/services.dart';

void onButtonTap() {
  HapticFeedback.mediumImpact();  // Tactile click feedback 触觉点击反馈
  toggleFeature();
}
```

### 3.3 Performance Targets 性能目标

**Critical Targets 关键目标** (ADR-0003):

- **60 FPS sustained 持续60 FPS** on mid-range devices 中端设备 (iPhone 11, Pixel 5)
- **<500MB peak RAM usage 峰值RAM使用<500MB** during ML + BLE + rendering ML+BLE+渲染期间
- **<15% battery drain/hour 每小时电池消耗<15%** (screen-on time 亮屏时间)
- **<100ms end-to-end latency 端到端延迟<100ms** (camera → pose → BLE → display 相机→姿态→BLE→显示)

**Flutter DevTools Profiling Flutter DevTools性能分析**:

```dart
// Enable performance overlay in debug mode
// 在调试模式下启用性能覆盖层
MaterialApp(
  showPerformanceOverlay: true,  // Show FPS graph 显示FPS图表
  debugShowCheckedModeBanner: false,
  home: PoseTrackingScreen(),
);
```

**Memory Profiling 内存分析**:

```bash
# Launch with memory profiling 使用内存分析启动
flutter run --profile --trace-skia

# Open DevTools 打开DevTools
flutter pub global activate devtools
flutter pub global run devtools
```

### 3.4 Gestures and Interactions 手势与交互

**Quick Toggle Gestures 快速切换手势**:

```dart
class GestureAwareCamera extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      // Double-tap: Toggle all overlays 双击：切换所有覆盖层
      onDoubleTap: () {
        setState(() => overlaysEnabled = !overlaysEnabled);
      },

      // Swipe down: Show/hide metrics bar 向下滑动：显示/隐藏指标栏
      onVerticalDragEnd: (details) {
        if (details.velocity.pixelsPerSecond.dy > 0) {
          toggleMetricsBar();
        }
      },

      // Long-press: Freeze frame (post-action review) 长按：冻结帧（动作后回顾）
      onLongPress: () {
        freezeFrame();
      },

      child: CameraPreview(),
    );
  }
}
```

### 3.5 Real-Time Overlay Design 实时覆盖层设计

**Ghost Avatar Transparency 幽灵头像透明度** (50% opacity recommended 推荐50%不透明度):

```dart
class GhostSkeleton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: SkeletonPainter(
        keypoints: idealPose,
        color: Color(0xFF4CAF50),  // Green for correct pose 绿色表示正确姿态
        opacity: 0.5,              // 50% transparency 50%透明度
        strokeWidth: 3.0,
      ),
    );
  }
}
```

**Live Skeleton (100% opacity) 实时骨架（100%不透明度）**:

```dart
CustomPaint(
  painter: SkeletonPainter(
    keypoints: livePose,
    color: Color(0xFFE0F7FF),  // Light blue 浅蓝色
    opacity: 1.0,              // Fully opaque 完全不透明
    strokeWidth: 4.0,
  ),
);
```

**User Settings for Transparency 透明度用户设置**:

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

## 4. BLE Sensor Communication BLE传感器通信

### 4.1 ESP32-S3 Connection Architecture ESP32-S3连接架构

**BLE Stack BLE协议栈**:

```
ESP32-S3 (Peripheral 外围设备)
  ↓ BLE GATT Server GATT服务器
  ↓ 6 IMU Sensors @ 100Hz 6个IMU传感器@100Hz
  ↓ Data 数据: 12 bytes/packet × 6 sensors × 100 Hz = 57.6 kbps
  ↓
Flutter App (Central 中心设备)
  ↓ flutter_reactive_ble plugin
  ↓ Parse sensor data 解析传感器数据
  ↓ Fuse with pose estimation 与姿态估计融合
```

**Connection Parameters 连接参数**:

```
Connection Interval 连接间隔: 7.5ms (fast 快速)
Slave Latency 从设备延迟: 0
Supervision Timeout 监督超时: 4000ms
MTU: 185 bytes (Bluetooth 4.2+)
```

### 4.2 Flutter BLE Integration Flutter BLE集成

**Installation 安装**:

```yaml
# pubspec.yaml
dependencies:
  flutter_reactive_ble: ^5.2.0  # Production-grade (Philips Hue uses this) 生产级（飞利浦Hue使用）
```

**Connection Manager 连接管理器**:

```dart
import 'package:flutter_reactive_ble/flutter_reactive_ble.dart';

class IMUSensorManager {
  final FlutterReactiveBle ble = FlutterReactiveBle();
  final StreamController<SensorData> dataController = StreamController.broadcast();
  final List<DiscoveredDevice> connectedDevices = [];

  Stream<SensorData> get dataStream => dataController.stream;

  Future<void> scanAndConnect() async {
    // Scan for IMU sensors (ESP32-S3 devices)
    // 扫描IMU传感器（ESP32-S3设备）
    ble.scanForDevices(
      withServices: [Uuid.parse('4fafc201-1fb5-459e-8fcc-c5c9c331914b')],
      scanMode: ScanMode.lowLatency,
    ).listen((device) async {
      if (device.name.startsWith('IMU_')) {
        await _connectDevice(device);
      }
    });

    // Stop scan after 10 seconds 10秒后停止扫描
    await Future.delayed(Duration(seconds: 10));
    ble.deinitialize();
  }

  Future<void> _connectDevice(DiscoveredDevice device) async {
    // Connect to device 连接设备
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
    // 订阅传感器数据通知（100 Hz流）
    ble.subscribeToCharacteristic(characteristic).listen((data) {
      final sensorData = _parseSensorPacket(data);
      dataController.add(sensorData);
    });
  }

  SensorData _parseSensorPacket(List<int> bytes) {
    // Parse 12-byte packet: timestamp(4) + accel(6) + gyro(6)
    // 解析12字节数据包：时间戳(4) + 加速度(6) + 陀螺仪(6)
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

### 4.3 Data Streaming Optimization 数据流优化

**Throughput 吞吐量**: 1.35 Mbps (Flutter BLE performance Flutter BLE性能)

- **Required 需求**: 57.6 kbps (6 IMUs × 100 Hz × 12 bytes)
- **Available headroom 可用余量**: 95.7% (excellent margin 优秀余量)

**Packet Loss Mitigation 丢包缓解**:

```dart
class PacketBuffer {
  final Queue<SensorData> buffer = Queue();
  int droppedPackets = 0;

  void addPacket(SensorData data) {
    if (buffer.length > 100) {
      // Buffer overflow: drop oldest packet 缓冲区溢出：丢弃最旧数据包
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

### 4.4 Latency Requirements (<100ms End-to-End) 延迟要求（端到端<100ms）

**Latency Budget 延迟预算**:

```
Camera Frame Capture 相机帧捕获:        16.7ms (60 FPS)
Pose Estimation (MediaPipe) 姿态估计:   30-50ms
BLE Data Fetch BLE数据获取:             12ms   (measured Flutter 测量的Flutter)
Sensor Fusion 传感器融合:               5-10ms
Rendering Update 渲染更新:              5-8ms
─────────────────────────────────────
Total 总计:                             ~70-97ms ✅ (within 100ms budget 在100ms预算内)
```

**Async Processing Pipeline 异步处理管道**:

```dart
class RealtimePipeline {
  Future<void> processFrame(CameraImage image, List<SensorData> imuData) async {
    final startTime = DateTime.now();

    // Parallel execution 并行执行
    final results = await Future.wait([
      compute(_poseEstimation, image),     // 30-50ms (isolate)
      compute(_sensorFusion, imuData),     // 5-10ms (isolate)
    ]);

    final pose = results[0] as Pose;
    final fusion = results[1] as FusionResult;

    // Combine results 组合结果
    final combined = combineData(pose, fusion);

    final latency = DateTime.now().difference(startTime);
    if (latency.inMilliseconds > 100) {
      logger.warning('Latency exceeded 延迟超出: ${latency.inMilliseconds}ms');
    }

    updateVisualization(combined);
  }
}
```

### 4.5 Connection Management (Reconnection, Battery) 连接管理（重连、电池）

**Auto-Reconnect 自动重连**:

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
            attemptReconnect(device);  // 尝试重连
            break;
        }
      },
      onError: (error) {
        logger.error('Connection error 连接错误: $error');
        attemptReconnect(device);
      },
    );
  }

  Future<void> attemptReconnect(DiscoveredDevice device) async {
    // Exponential backoff: 1s, 2s, 4s, 8s 指数退避
    for (int attempt = 0; attempt < 4; attempt++) {
      await Future.delayed(Duration(seconds: pow(2, attempt).toInt()));

      try {
        await _connectDevice(device);
        logger.info('Reconnected after 重连成功于 ${attempt + 1} attempts 次尝试');
        return;
      } catch (e) {
        logger.warning('Reconnect attempt 重连尝试 ${attempt + 1} failed 失败');
      }
    }

    showReconnectFailedDialog();  // 显示重连失败对话框
  }
}
```

**Battery Impact 电池影响**:

```dart
// Disable BLE scanning when battery low 低电量时禁用BLE扫描
if (batteryLevel < 0.15) {
  ble.stopScan();
  showLowBatteryWarning();  // 显示低电量警告
}

// Reduce connection interval during low battery 低电量期间降低连接间隔
if (batteryLevel < 0.3) {
  // Request longer connection interval to save power 请求更长连接间隔以节省电量
  requestConnectionUpdate(
    interval: 30,  // 30ms (vs 7.5ms normal 对比正常7.5ms)
    latency: 4,
  );
}
```

---

## 5. Commercial Mobile Apps Analysis 商业移动应用分析

### 5.1 Peloton App Architecture Insights Peloton应用架构洞察

**Key Learnings 关键学习**:

- **Offline-First 离线优先**: Download workouts for offline use 下载训练供离线使用 (no network dependency during exercise 运动期间无网络依赖)
- **Leaderboard Integration 排行榜集成**: Real-time performance comparison 实时性能比较 (motivational 激励性)
- **Metrics Dashboard 指标仪表板**: Clear, large fonts for at-a-glance metrics 清晰的大字体一目了然
- **Audio Cues 音频提示**: Voice prompts for form corrections 语音提示纠正动作 (hands-free feedback 免手反馈)

**Applicable to Movement Chain AI 适用于Movement Chain AI**:

- Cache pose templates locally for offline analysis 本地缓存姿态模板供离线分析
- Show real-time comparison with previous personal best 显示与之前个人最佳的实时比较
- Large, high-contrast metric display 大型高对比度指标显示 (rep count 次数, quality score 质量评分)

### 5.2 Apple Fitness+ Integration Approach Apple Fitness+集成方法

**Key Learnings 关键学习**:

- **Seamless Watch Integration 无缝手表集成**: Apple Watch for heart rate 心率, iPhone/iPad for video 视频
- **Burn Bar 燃烧条**: Comparative visualization 比较可视化 (you vs others 你对比其他人)
- **Instructor Overlay 教练覆盖**: Transparent metrics don't obscure instructor 透明指标不遮挡教练
- **Accessibility 可访问性**: Full VoiceOver support for vision-impaired users 为视障用户提供完整VoiceOver支持

**Applicable to Movement Chain AI 适用于Movement Chain AI**:

- BLE sensor integration BLE传感器集成 (ESP32-S3 as "watch" 作为"手表")
- Non-intrusive overlay design 非侵入式覆盖层设计 (50% ghost avatar opacity 50%幽灵头像不透明度)
- Voice feedback for accessibility 可访问性语音反馈

### 5.3 Nike Training Club UX Patterns Nike Training Club用户体验模式

**Key Learnings 关键学习** (Source: Stormotion Fitness App UX):

- **Minimalist Design 极简设计**: White background + neon accents 白色背景+荧光强调 (reduces distractions 减少干扰)
- **Progress Visualization 进度可视化**: Stat cards pulse gently when loading 统计卡片加载时轻轻跳动 (Strava-style Strava风格)
- **High-Contrast Interface 高对比度界面**: Essential for outdoor use 户外使用必备 (bright sunlight 强烈阳光)
- **Touch Targets 触控目标**: 56×56px minimum (Material Design standard Material Design标准)

**Applicable to Movement Chain AI 适用于Movement Chain AI**:

```dart
// High-contrast mode for outdoor use 户外使用高对比度模式
final colorScheme = brightness == Brightness.light
  ? ColorScheme.light(primary: Colors.deepOrange)  // Neon accent 荧光强调
  : ColorScheme.dark(primary: Colors.cyan);

// Pulsing stat cards 跳动统计卡片
AnimatedOpacity(
  opacity: isLoading ? 0.5 : 1.0,
  duration: Duration(milliseconds: 800),
  curve: Curves.easeInOut,
  child: StatCard(value: repCount),
);
```

### 5.4 Common Patterns Across Apps 跨应用通用模式

| Feature 功能 | Peloton | Apple Fitness+ | Nike Training | Movement Chain AI |
|---------|---------|----------------|---------------|-------------------|
| **Real-time Metrics 实时指标** | ✅ HR, Power 心率、功率 | ✅ HR, Calories 心率、卡路里 | ✅ Time, Reps 时间、次数 | ✅ Pose Quality, Reps 姿态质量、次数 |
| **Audio Cues 音频提示** | ✅ Music + Coach 音乐+教练 | ✅ Instructor 教练 | ✅ Coach 教练 | ✅ Form Corrections 动作纠正 |
| **Offline Mode 离线模式** | ✅ Download 下载 | ❌ Streaming only 仅流式 | ✅ Download 下载 | ✅ Cached Poses 缓存姿态 |
| **Wearable Integration 可穿戴集成** | ✅ Heart rate strap 心率带 | ✅ Apple Watch | ✅ Heart rate monitor 心率监测器 | ✅ ESP32-S3 IMUs |
| **Social Features 社交功能** | ✅ Leaderboard 排行榜 | ✅ Burn Bar 燃烧条 | ✅ Challenges 挑战 | ⚠️ Future feature 未来功能 |

---

## 6. Mobile SDKs & Libraries 移动端SDK与库

### 6.1 QuickPose (iOS/React Native)

**Overview 概述**:

- **Platform 平台**: iOS (primary 主要), Android (roadmap 路线图)
- **Technology 技术**: MediaPipe/BlazePose enhanced 增强版
- **Performance 性能**: 120 FPS on iOS (4x faster than MediaPipe iOS上比MediaPipe快4倍)

**Pricing 定价**:

- **Free Tier 免费层**: Up to 100 monthly active devices 最多100个月活跃设备
- **Launch Tier 启动层**: Pay-per-device after 100 users 100用户后按设备付费

**Features 功能**:

- Rep counting 计数, range of motion 运动范围, form feedback 动作反馈
- 33 keypoints (MediaPipe landmark set MediaPipe关键点集)
- Audio feedback for corrections 纠正音频反馈
- Built-in skeleton visualization 内置骨架可视化

**When to Use 何时使用**:

- iOS-first applications iOS优先应用
- Need production-ready code quickly 需要快速生产就绪代码
- Acceptable to be locked into QuickPose ecosystem 可接受QuickPose生态系统锁定

**Why We're Not Using It 我们为什么不用**:

- iOS-only (Android in roadmap, not production 仅iOS，Android在路线图非生产)
- Vendor lock-in risk 供应商锁定风险
- Custom needs require more flexibility 自定义需求需要更多灵活性

### 6.2 KinesteX (Multi-Framework)

**Overview 概述**:

- **Platforms 平台**: Flutter, SwiftUI, React Native, Kotlin, PWA
- **Technology 技术**: Proprietary CV (90%+ accuracy 专有计算机视觉，90%+准确率)
- **Exercise Library 练习库**: 400+ expertly crafted exercises 400+专业设计练习

**Pricing 定价**:

- Contact for pricing (not publicly disclosed 联系询价，未公开披露)

**Features 功能**:

- Real-time motion tracking with voice prompts 带语音提示的实时动作追踪
- White-label (fully customizable UI 白标，完全可定制界面)
- HIPAA compliant, on-device processing HIPAA合规，设备端处理
- Multi-platform lightweight packages 多平台轻量级包

**When to Use 何时使用**:

- Need comprehensive exercise library 需要全面练习库
- White-label fitness app 白标健身应用
- Multi-platform from day one 第一天起多平台

**Why We're Not Using It 我们为什么不用**:

- Closed-source (can't customize ML pipeline 闭源，无法自定义ML管道)
- Pricing unknown (potential cost concern 定价未知，潜在成本问题)
- Our focus is movement analysis, not exercise library 我们专注于动作分析，非练习库

### 6.3 Sency (Cross-Platform)

**Overview 概述**:

- **Platforms 平台**: iOS, Android, Web
- **Technology 技术**: Proprietary AI with edge computing 专有AI与边缘计算
- **Processing 处理**: All on-device (zero cloud latency 全部设备端，零云延迟)

**Pricing 定价**:

- **Free Tier 免费层**: Up to 100 unique active users 最多100个唯一活跃用户
- **Pay-as-you-go 按需付费**: After 100 users, per-active-user billing 100用户后按活跃用户计费

**Features 功能**:

- Initial assessment 初始评估 (4-step onboarding 4步入职, 8 mobility tests 8个活动度测试)
- Injury risk assessment 受伤风险评估
- Personalized workout plans 个性化训练计划
- Real-time posture correction 实时姿态纠正

**When to Use 何时使用**:

- Need initial fitness assessment 需要初始健身评估
- Cross-platform required 需要跨平台
- Privacy-critical (GDPR compliant, edge processing GDPR合规，边缘处理)

**Why We're Not Using It 我们为什么不用**:

- Overkill for our MVP MVP过度设计 (we don't need assessment workflows 不需要评估工作流)
- Prefer open-source foundation 更喜欢开源基础 (MediaPipe → RTMPose)

### 6.4 MediaPipe Official Plugins 官方插件

**Why We Chose This 我们为什么选择** ✅:

- **Open-source 开源**: Apache 2.0 (no vendor lock-in 无供应商锁定)
- **Cross-platform 跨平台**: iOS, Android, Web, Desktop
- **3D Pose 3D姿态**: Real-world coordinates 真实世界坐标 (essential for biomechanics 生物力学必备)
- **Mature ecosystem 成熟生态**: Extensive tutorials, community support 大量教程、社区支持
- **Google backing Google支持**: Long-term maintenance guaranteed 长期维护保证

**Flutter Integration Flutter集成**:

```yaml
dependencies:
  google_mlkit_pose_detection: ^0.10.0
```

**Advantages 优势**:

- 33 keypoints with visibility/presence scores 33个带可见性/存在性评分关键点
- Free forever (no per-user costs 永久免费，无每用户成本)
- Can migrate to RTMPose later 之后可迁移到RTMPose (similar pipeline 相似管道)

**Disadvantages 劣势**:

- 30-40 FPS (slower than QuickPose's 120 FPS 比QuickPose的120 FPS慢)
- Single-person only (can't track multiple people 仅单人，无法追踪多人)

### 6.5 Comparison and Recommendations 比较与建议

| SDK | Platform Support 平台支持 | Pricing 定价 | Performance 性能 | Open-Source 开源 | Recommendation 建议 |
|-----|------------------|---------|-------------|-------------|----------------|
| **MediaPipe** ✅ | iOS, Android, Web | FREE 免费 | 30-40 FPS | ✅ Yes | **Use for MVP 用于MVP** |
| QuickPose | iOS only 仅iOS | Free (100 devices 100设备) | 120 FPS | ❌ No | iOS-only apps 仅iOS应用 |
| KinesteX | Multi-framework 多框架 | Contact 联系 | 90%+ accuracy 准确率 | ❌ No | Exercise library apps 练习库应用 |
| Sency | iOS, Android, Web | Free (100 users 100用户) | Excellent 优秀 | ❌ No | Assessment workflows 评估工作流 |

**Our Strategy 我们的策略**:

1. **MVP**: MediaPipe (fastest development 最快开发, free 免费, 3D pose 3D姿态)
2. **Optimization 优化**: Migrate to RTMPose (2-3x faster 快2-3倍, higher accuracy 更高精度)
3. **Future 未来**: Evaluate QuickPose if iOS performance becomes critical 如果iOS性能成为关键则评估QuickPose

---

## 7. Implementation Examples 实现示例

### 7.1 Flutter + MediaPipe Setup Flutter + MediaPipe设置

**Complete Integration 完整集成**:

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
      imageFormatGroup: ImageFormatGroup.yuv420,  // Efficient format 高效格式
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
    if (_isProcessing) return;  // Skip frame if still processing 仍在处理则跳过帧
    _isProcessing = true;

    // Convert to InputImage 转换为InputImage
    final inputImage = _convertToInputImage(image);

    // Run pose detection (30-50ms on modern devices)
    // 运行姿态检测（现代设备上30-50毫秒）
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

### 7.2 BLE Sensor Integration Code BLE传感器集成代码

**See Section 4.2 参见4.2节** for complete BLE integration example 完整BLE集成示例.

**Quick Start 快速开始**:

```dart
final imuManager = IMUSensorManager();
await imuManager.scanAndConnect();

// Listen to sensor stream 监听传感器流
imuManager.dataStream.listen((sensorData) {
  print('Accel 加速度: ${sensorData.accel}, Gyro 陀螺仪: ${sensorData.gyro}');
  fuseSensorData(sensorData);
});
```

### 7.3 Real-Time Visualization Rendering 实时可视化渲染

**Skeleton Overlay Painter 骨架覆盖层绘制器**:

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

    // Draw skeleton connections 绘制骨架连接
    _drawConnection(canvas, paint, pose, PoseLandmarkType.leftShoulder, PoseLandmarkType.rightShoulder);
    _drawConnection(canvas, paint, pose, PoseLandmarkType.leftShoulder, PoseLandmarkType.leftElbow);
    _drawConnection(canvas, paint, pose, PoseLandmarkType.leftElbow, PoseLandmarkType.leftWrist);
    // ... continue for all body connections 继续所有身体连接

    // Draw joints as circles 将关节绘制为圆圈
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

**Error Arrow Overlay 错误箭头覆盖层**:

```dart
class CorrectionArrow extends StatelessWidget {
  final Offset position;
  final Vector2 direction;
  final double severity;  // 0.0 to 10.0 严重程度0.0到10.0

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
    if (severity > 7.0) return Color(0xFFC62828);  // Red (critical 红色，严重)
    if (severity > 4.0) return Color(0xFFF9A825);  // Amber (warning 琥珀色，警告)
    return Color(0xFF00897B);                      // Blue-green (good 蓝绿色，良好)
  }

  double _getLengthBySeverity(double severity) {
    return (severity / 10.0) * 60 + 20;  // 20px to 80px 20px到80px
  }
}
```

### 7.4 State Management Patterns 状态管理模式

**Recommended: Riverpod 推荐：Riverpod** (Flutter best practice Flutter最佳实践):

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Providers 提供器
final poseProvider = StateProvider<List<Pose>>((ref) => []);
final sensorDataProvider = StateProvider<List<SensorData>>((ref) => []);
final errorsProvider = StateProvider<List<ErrorReport>>((ref) => []);

// Combined state 组合状态
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

// UI consumption UI使用
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

## Related Decisions 相关决策

- [ADR-0003: Flutter Mobile Framework Flutter移动框架](../../design/decisions/0003-flutter-mobile.md) - Framework selection rationale 框架选择理由
- [ADR-0006: ONNX Runtime Deployment ONNX Runtime部署](../../design/decisions/0006-onnx-runtime-deployment.md) - ML model deployment strategy ML模型部署策略

---

## Appendix: Performance Benchmarking 附录：性能基准测试

### Device Targets 设备目标

**Mid-Range Baseline 中端基准** (ADR-0003):

- **iOS**: iPhone 11 (A13 Bionic, 4GB RAM)
- **Android**: Google Pixel 5 (Snapdragon 765G, 8GB RAM)

**Expected Performance 预期性能**:

```
iPhone 11:
  - Pose Estimation 姿态估计: 35-40 FPS (MediaPipe)
  - BLE Throughput BLE吞吐量: 1.2 Mbps
  - Battery Drain 电池消耗: 12-15%/hour 每小时

Pixel 5:
  - Pose Estimation 姿态估计: 30-35 FPS (MediaPipe)
  - BLE Throughput BLE吞吐量: 1.1 Mbps
  - Battery Drain 电池消耗: 14-18%/hour 每小时
```

### Profiling Checklist 性能分析检查清单

**Pre-Launch Benchmarks 发布前基准**:

- [ ] Render pipeline maintains 60 FPS 渲染管道维持60 FPS (P95 >55 FPS)
- [ ] Transparency overlay adds <5ms per frame 透明覆盖层每帧增加<5ms
- [ ] Memory usage <500MB during peak rendering 峰值渲染期间内存使用<500MB
- [ ] Battery drain <15% per hour 每小时电池消耗<15% (screen-on time 亮屏时间)
- [ ] BLE haptic latency <10ms BLE haptic延迟<10ms (visual to tactile 视觉到触觉)
- [ ] Arrow animations smooth 箭头动画流畅 (no dropped frames 无丢帧)

**Tools 工具**:

- **Flutter DevTools**: Frame rendering timeline 帧渲染时间线, memory allocation 内存分配
- **Xcode Instruments**: iOS GPU usage iOS GPU使用, battery impact 电池影响
- **Android Profiler**: CPU, memory, network (BLE) monitoring 网络（BLE）监控

---

**Document Version 文档版本:** 1.0
**Last Updated 最后更新:** 2025-12-01
**Maintained By 维护者:** Movement Chain AI Mobile Team 移动团队
**Next Review 下次审查:** Q2 2025
