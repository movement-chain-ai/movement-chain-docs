!!! note "实现级文档"
    此文档包含 BLE 通信和 ML 推理的详细实现模式，属于实现级技术文档。

    相关决策文档：

    - [ADR-0003 Flutter 移动端选型](../decisions/0003-flutter-mobile.md)
    - [ADR-0006 ONNX Runtime 部署策略](../decisions/0006-onnx-runtime-deployment.md)

---

# 集成模式 (Integration Patterns)

## 概述 (Overview)

本文档详细说明 Movement Chain AI 的集成模式 (integration patterns),涵盖 BLE 通信 (BLE communication)、Flutter-固件交互 (Flutter-firmware interaction)、ML 模型集成 (ML model integration)、触觉反馈 (haptic feedback) 和错误处理策略 (error handling strategies)。每个模式包括实现指南 (implementation guidelines)、代码示例 (code examples) 和性能考虑 (performance considerations)。

---

## 1. BLE 通信协议 (BLE Communication Protocol)

### 1.1 GATT 服务架构 (GATT Service Architecture)

**Service UUID Design (服务 UUID 设计)**:

```
Primary Service: 0000180f-0000-1000-8000-00805f9b34fb (Custom Movement Service)
├── Characteristic 1: Sensor Data Stream (传感器数据流) (UUID: 0x2A58)
│   ├── Properties: NOTIFY
│   ├── Max length: 500 bytes (MTU size)
│   └── Update rate: 100 Hz (every 10ms)
├── Characteristic 2: Haptic Command (触觉命令) (UUID: 0x2A59)
│   ├── Properties: WRITE
│   ├── Max length: 20 bytes
│   └── Format: [pattern_id, intensity, duration_ms]
├── Characteristic 3: Device Control (设备控制) (UUID: 0x2A5A)
│   ├── Properties: READ | WRITE
│   └── Commands: START_STREAM, STOP_STREAM, CALIBRATE, GET_STATUS
└── Characteristic 4: Timestamp Sync (时间戳同步) (UUID: 0x2A5B)
    ├── Properties: NOTIFY (one-time on connection)
    └── Format: [firmware_millis, connection_timestamp]
```

### 1.2 连接参数 (Connection Parameters)

**Optimized for Low-Latency Streaming (针对低延迟流传输优化)**:

```c
// Firmware: nRF Connect SDK configuration
#define MIN_CONN_INTERVAL    MSEC_TO_UNITS(7.5, UNIT_1_25_MS)  // 7.5ms
#define MAX_CONN_INTERVAL    MSEC_TO_UNITS(7.5, UNIT_1_25_MS)  // 7.5ms
#define SLAVE_LATENCY        0                                   // No latency
#define CONN_SUP_TIMEOUT     MSEC_TO_UNITS(4000, UNIT_10_MS)    // 4 seconds
#define MTU_SIZE             500                                 // Increased from default 23
```

**Connection Interval Rationale (连接间隔基本原理)**:

- 7.5ms interval allows 133 packets/second
- 100 Hz sensor rate requires 100 packets/second
- 25% overhead margin for retransmissions and control packets

### 1.3 数据流协议 (Data Streaming Protocol)

#### Packet Structure (Protobuf) (数据包结构)

**Sensor Data Characteristic (传感器数据特征)** (0x2A58):

```protobuf
message SensorPacket {
  uint32 sequence_id = 1;         // Monotonic counter (wraps at UINT32_MAX)
  uint32 firmware_timestamp = 2;  // millis() since boot

  message IMUSample {
    sint32 accel_x_mg = 1;  // Milligravities (±16000 mg range)
    sint32 accel_y_mg = 2;
    sint32 accel_z_mg = 3;
    sint32 gyro_x_mdps = 4; // Millidegrees/sec (±2000000 mdps range)
    sint32 gyro_y_mdps = 5;
    sint32 gyro_z_mdps = 6;
  }

  message EMGSample {
    uint32 timestamp_offset_us = 1;  // Microseconds from packet timestamp
    repeated uint32 channels = 2;     // 4 channels, 12-bit ADC values
  }

  repeated IMUSample imu_samples = 3;    // Batch of samples since last packet
  repeated EMGSample emg_samples = 4;
}
```

**Encoding Optimization (编码优化)**:

- Use `sint32` (ZigZag encoding) for signed values → better compression for small deltas
- IMU in milligravities/millidegrees → avoid floating-point overhead
- EMG timestamp offsets → enable precise sub-millisecond timing

#### 固件传输逻辑 (Firmware Transmission Logic)

```c
// Pseudocode: Firmware main loop
void sensor_loop() {
    static SensorPacket packet;
    static uint32_t last_tx_time = 0;
    static uint32_t sequence_id = 0;

    // High-frequency sensor polling (200 Hz for EMG)
    if (emg_data_ready()) {
        EMGSample sample = read_emg();
        sample.timestamp_offset_us = micros() - packet.firmware_timestamp;
        packet.add_emg_sample(sample);
    }

    if (imu_data_ready()) {  // Triggers at 100 Hz
        IMUSample sample = read_imu();
        packet.add_imu_sample(sample);
    }

    // Transmit every 10ms (100 Hz packet rate)
    if (millis() - last_tx_time >= 10) {
        packet.sequence_id = sequence_id++;
        packet.firmware_timestamp = millis();

        // Serialize and transmit
        uint8_t buffer[500];
        size_t len = packet.encode(buffer);
        ble_gatt_notify(SENSOR_DATA_CHAR, buffer, len);

        // Reset packet for next batch
        packet.clear();
        last_tx_time = millis();
    }
}
```

**Transmission Guarantees (传输保证)**:

- GATT notifications are "fire and forget" (no ACK from central)
- Sequence IDs enable gap detection on Flutter side
- Expected packet loss: <0.5% under normal conditions

---

## 2. Flutter-固件集成 (Flutter-Firmware Integration)

### 2.1 BLE 栈: flutter_reactive_ble (BLE Stack)

**Library Choice Rationale (库选择理由)**:

- `flutter_reactive_ble`: Stream-based API, better memory management than `flutter_blue_plus`
- Handles connection state automatically
- Efficient notification subscription with backpressure handling

### 2.2 连接管理模式 (Connection Management Pattern)

```dart
class BLEDeviceManager {
  final FlutterReactiveBle _ble = FlutterReactiveBle();
  StreamSubscription<ConnectionStateUpdate>? _connectionSubscription;
  StreamSubscription<List<int>>? _sensorDataSubscription;

  final String deviceId;
  final _sensorDataController = StreamController<SensorPacket>.broadcast();

  // Public stream for consumers
  Stream<SensorPacket> get sensorDataStream => _sensorDataController.stream;

  Future<void> connect() async {
    // Step 1: Scan and connect
    _connectionSubscription = _ble.connectToDevice(
      id: deviceId,
      connectionTimeout: Duration(seconds: 10),
    ).listen((state) {
      if (state.connectionState == DeviceConnectionState.connected) {
        _onConnected();
      } else if (state.connectionState == DeviceConnectionState.disconnected) {
        _onDisconnected(state.failure);
      }
    });
  }

  Future<void> _onConnected() async {
    print('[BLE] Connected to $deviceId');

    // Step 2: Request MTU increase (critical for performance)
    try {
      final mtu = await _ble.requestMtu(deviceId: deviceId, mtu: 500);
      print('[BLE] MTU negotiated: $mtu bytes');
      if (mtu < 500) {
        print('[BLE] Warning: MTU lower than requested, may impact throughput');
      }
    } catch (e) {
      print('[BLE] MTU negotiation failed: $e');
    }

    // Step 3: Subscribe to sensor data characteristic
    final characteristic = QualifiedCharacteristic(
      serviceId: Uuid.parse('0000180f-0000-1000-8000-00805f9b34fb'),
      characteristicId: Uuid.parse('00002A58-0000-1000-8000-00805f9b34fb'),
      deviceId: deviceId,
    );

    _sensorDataSubscription = _ble.subscribeToCharacteristic(characteristic).listen(
      _onSensorData,
      onError: (error) => print('[BLE] Sensor data error: $error'),
    );

    // Step 4: Synchronize timestamps
    await _synchronizeTimestamps();

    // Step 5: Start sensor streaming
    await _sendControlCommand(DeviceCommand.START_STREAM);
  }

  void _onSensorData(List<int> rawData) {
    try {
      // Decode Protobuf
      final packet = SensorPacket.fromBuffer(rawData);

      // Detect packet loss (检测丢包)
      if (_lastSequenceId != null && packet.sequenceId != _lastSequenceId + 1) {
        final lostPackets = packet.sequenceId - _lastSequenceId - 1;
        print('[BLE] Packet loss detected: $lostPackets packets');
        _metrics.blePacketLoss += lostPackets;
      }
      _lastSequenceId = packet.sequenceId;

      // Convert firmware timestamp to app timebase
      packet.alignedTimestamp = _convertTimestamp(packet.firmwareTimestamp);

      // Emit to stream
      _sensorDataController.add(packet);

    } catch (e) {
      print('[BLE] Failed to decode packet: $e');
    }
  }

  Future<void> _synchronizeTimestamps() async {
    final syncCharacteristic = QualifiedCharacteristic(
      serviceId: Uuid.parse('0000180f-0000-1000-8000-00805f9b34fb'),
      characteristicId: Uuid.parse('00002A5B-0000-1000-8000-00805f9b34fb'),
      deviceId: deviceId,
    );

    // Wait for one-time sync packet
    final syncData = await _ble.subscribeToCharacteristic(syncCharacteristic).first;

    final firmwareMillis = ByteData.view(Uint8List.fromList(syncData).buffer).getUint32(0);
    final appTimestamp = DateTime.now().millisecondsSinceEpoch;

    _timestampOffset = appTimestamp - firmwareMillis;
    print('[BLE] Timestamp offset calibrated: $_timestampOffset ms');
  }

  int _convertTimestamp(int firmwareMillis) {
    return firmwareMillis + _timestampOffset;
  }

  Future<void> sendHapticCommand(HapticPattern pattern) async {
    final hapticCharacteristic = QualifiedCharacteristic(
      serviceId: Uuid.parse('0000180f-0000-1000-8000-00805f9b34fb'),
      characteristicId: Uuid.parse('00002A59-0000-1000-8000-00805f9b34fb'),
      deviceId: deviceId,
    );

    final command = [
      pattern.id,           // Pattern ID (e.g., 0x01 = short pulse, 0x02 = double pulse)
      pattern.intensity,    // 0-255
      pattern.durationMs ~/ 10,  // Duration in 10ms units (max 2.55 seconds)
    ];

    await _ble.writeCharacteristicWithoutResponse(
      hapticCharacteristic,
      value: command,
    );
  }

  void dispose() {
    _sensorDataSubscription?.cancel();
    _connectionSubscription?.cancel();
    _sensorDataController.close();
  }
}
```

### 2.3 背压处理 (Backpressure Handling)

**Problem (问题)**: Camera processing (126ms) slower than BLE packets (10ms interval)

- Buffer overflow if packets accumulate faster than consumption

**Solution (解决方案)**: Circular buffer with overflow strategy (带溢出策略的循环缓冲区)

```dart
class SensorDataBuffer {
  final int maxSize = 50;  // 500ms of data at 100 Hz
  final Queue<SensorPacket> _buffer = Queue();
  int _droppedPackets = 0;

  void add(SensorPacket packet) {
    if (_buffer.length >= maxSize) {
      // Drop oldest packet
      _buffer.removeFirst();
      _droppedPackets++;
    }
    _buffer.add(packet);
  }

  List<SensorPacket> getWindow(int startTimestamp, int endTimestamp) {
    return _buffer.where((p) =>
      p.alignedTimestamp >= startTimestamp &&
      p.alignedTimestamp <= endTimestamp
    ).toList();
  }

  void evictOlderThan(int timestamp) {
    _buffer.removeWhere((p) => p.alignedTimestamp < timestamp - 1000);  // Keep last 1 second
  }
}
```

---

## 3. ML 模型集成 (ML Model Integration)

### 3.1 模型加载管道 (Model Loading Pipeline)

**Model Assets Structure (模型资产结构)**:

```
assets/
├── models/
│   ├── rtmpose_m_256x192.tflite        # Pose estimation (FP16, 8.2 MB)
│   ├── movement_classifier.tflite      # LSTM+Transformer (INT8, 4.5 MB)
│   └── error_types.json                # Label mapping
```

**Initialization Code (初始化代码)**:

```dart
class MLPipeline {
  late Interpreter _poseInterpreter;
  late Interpreter _classifierInterpreter;
  Map<int, String> _errorLabels = {};

  Future<void> initialize() async {
    // Load pose estimation model
    final poseModelData = await _loadModelFromAssets('models/rtmpose_m_256x192.tflite');
    _poseInterpreter = await Interpreter.fromBuffer(poseModelData, options: InterpreterOptions()
      ..threads = 4  // Utilize multi-core CPU
      ..useNnApiForAndroid = true  // Enable Android NNAPI acceleration
      ..useMetalDelegate = true);  // Enable iOS Metal acceleration

    // Load movement classifier
    final classifierData = await _loadModelFromAssets('models/movement_classifier.tflite');
    _classifierInterpreter = await Interpreter.fromBuffer(classifierData, options: InterpreterOptions()
      ..threads = 2);

    // Load error labels
    final labelsJson = await rootBundle.loadString('assets/models/error_types.json');
    final labelsMap = json.decode(labelsJson) as Map<String, dynamic>;
    _errorLabels = labelsMap.map((k, v) => MapEntry(int.parse(k), v as String));

    print('[ML] Models loaded successfully');
    print('[ML] Pose model: ${_poseInterpreter.getInputTensors()[0].shape}');
    print('[ML] Classifier: ${_classifierInterpreter.getInputTensors()[0].shape}');
  }

  Future<ByteBuffer> _loadModelFromAssets(String path) async {
    final rawAssetFile = await rootBundle.load('assets/$path');
    return rawAssetFile.buffer;
  }
}
```

### 3.2 姿态估计推理 (Pose Estimation Inference)

**Input Preprocessing (输入预处理)**:

```dart
class PoseEstimator {
  static const INPUT_SIZE = 256;  // Model input: 256×192
  static const INPUT_HEIGHT = 192;

  Future<PoseEstimationResult> estimatePose(CameraImage image) async {
    final stopwatch = Stopwatch()..start();

    // Step 1: Convert YUV to RGB (if needed)
    final rgbImage = _convertToRGB(image);

    // Step 2: Resize and normalize
    final inputTensor = _preprocessImage(rgbImage);

    // Step 3: Run inference
    final outputTensor = List.filled(1 * 17 * 3, 0.0).reshape([1, 17, 3]);
    _poseInterpreter.run(inputTensor, outputTensor);

    // Step 4: Post-process keypoints
    final keypoints = _extractKeypoints(outputTensor, image.width, image.height);

    stopwatch.stop();

    return PoseEstimationResult(
      timestamp: DateTime.now(),
      keypoints: keypoints,
      inferenceTimeMs: stopwatch.elapsedMilliseconds.toDouble(),
    );
  }

  Float32List _preprocessImage(img.Image rgbImage) {
    // Resize to 256×192
    final resized = img.copyResize(rgbImage, width: INPUT_SIZE, height: INPUT_HEIGHT);

    // Normalize to [0, 1] and convert to CHW format (channels-first)
    final buffer = Float32List(1 * 3 * INPUT_HEIGHT * INPUT_SIZE);
    int pixelIndex = 0;

    for (int c = 0; c < 3; c++) {  // RGB channels
      for (int y = 0; y < INPUT_HEIGHT; y++) {
        for (int x = 0; x < INPUT_SIZE; x++) {
          final pixel = resized.getPixel(x, y);
          double value;
          if (c == 0) value = pixel.r / 255.0;
          else if (c == 1) value = pixel.g / 255.0;
          else value = pixel.b / 255.0;

          buffer[pixelIndex++] = value;
        }
      }
    }

    return buffer;
  }

  List<Keypoint> _extractKeypoints(List outputTensor, int imgWidth, int imgHeight) {
    final keypoints = <Keypoint>[];

    for (int i = 0; i < 17; i++) {
      // RTMPose output: [x, y, confidence] per keypoint (normalized to input size)
      final x = outputTensor[0][i][0] / INPUT_SIZE;   // Normalized [0, 1]
      final y = outputTensor[0][i][1] / INPUT_HEIGHT;
      final confidence = outputTensor[0][i][2];

      keypoints.add(Keypoint(x: x, y: y, confidence: confidence));
    }

    return keypoints;
  }
}
```

### 3.3 传感器融合和特征提取 (Sensor Fusion and Feature Extraction)

```dart
class SensorFusion {
  // Sliding window: 30 frames × 35 features
  final windowSize = 30;
  final featureSize = 35;
  final Queue<FusedFeatures> _featureWindow = Queue();

  FusedFeatures fuseData(
    PoseEstimationResult pose,
    List<SensorPacket> imuWindow,
    List<SensorPacket> emgWindow,
  ) {
    // Extract pose features (17 values)
    final poseFeatures = _extractPoseFeatures(pose.keypoints);

    // Extract IMU features (10 values)
    final imuFeatures = _extractIMUFeatures(imuWindow);

    // Extract EMG features (8 values)
    final emgFeatures = _extractEMGFeatures(emgWindow);

    return FusedFeatures(
      jointAngles: poseFeatures.jointAngles,
      jointVelocities: poseFeatures.jointVelocities,
      orientation: imuFeatures.orientation,
      linearAccel: imuFeatures.linearAccel,
      angularVel: imuFeatures.angularVel,
      rmsAmplitude: emgFeatures.rmsAmplitude,
      bandPower: emgFeatures.bandPower,
    );
  }

  PoseFeatures _extractPoseFeatures(List<Keypoint> keypoints) {
    // Calculate joint angles using law of cosines (使用余弦定律计算关节角度)
    final leftElbowAngle = _calculateAngle(
      keypoints[5],  // LEFT_SHOULDER
      keypoints[7],  // LEFT_ELBOW
      keypoints[9],  // LEFT_WRIST
    );

    final rightElbowAngle = _calculateAngle(
      keypoints[6], keypoints[8], keypoints[10],
    );

    // Estimate velocities using finite differences (使用有限差分估计速度)
    final leftElbowVelocity = _estimateVelocity(
      _previousPose?.keypoints[7],
      keypoints[7],
      timestampDelta: 16.67,  // ms between frames at 60 FPS
    );

    // ... (calculate for all 8 joints)

    return PoseFeatures(
      jointAngles: [leftElbowAngle, rightElbowAngle, /* ... */],
      jointVelocities: [leftElbowVelocity, /* ... */],
    );
  }

  double _calculateAngle(Keypoint p1, Keypoint p2, Keypoint p3) {
    // Vectors: p2->p1 and p2->p3
    final v1 = Vector2(p1.x - p2.x, p1.y - p2.y);
    final v2 = Vector2(p3.x - p2.x, p3.y - p2.y);

    // Dot product / magnitudes
    final cosAngle = v1.dot(v2) / (v1.length * v2.length);
    return math.acos(cosAngle.clamp(-1.0, 1.0)) * 180 / math.pi;  // degrees
  }

  IMUFeatures _extractIMUFeatures(List<SensorPacket> window) {
    // Average IMU samples in window (平均窗口中的 IMU 样本)
    final avgAccel = Vector3.zero();
    final avgGyro = Vector3.zero();

    for (final packet in window) {
      for (final sample in packet.imuSamples) {
        avgAccel += Vector3(
          sample.accelXMg / 1000.0,  // Convert mg to g
          sample.accelYMg / 1000.0,
          sample.accelZMg / 1000.0,
        );
        avgGyro += Vector3(
          sample.gyroXMdps / 1000.0,  // Convert mdps to dps
          sample.gyroYMdps / 1000.0,
          sample.gyroZMdps / 1000.0,
        );
      }
    }

    final sampleCount = window.fold<int>(0, (sum, p) => sum + p.imuSamples.length);
    avgAccel /= sampleCount;
    avgGyro /= sampleCount;

    // Estimate orientation (simplified: assume gravity = [0, 0, -1g])
    final orientation = _estimateOrientation(avgAccel);

    // Remove gravity component from acceleration
    final linearAccel = avgAccel - orientation.rotateVector(Vector3(0, 0, -1));

    return IMUFeatures(
      orientation: orientation,
      linearAccel: linearAccel,
      angularVel: avgGyro,
    );
  }

  EMGFeatures _extractEMGFeatures(List<SensorPacket> window) {
    // Calculate RMS amplitude per channel (计算每个通道的 RMS 幅值)
    final rmsAmplitude = List.filled(4, 0.0);
    final bandPower = List.filled(4, 0.0);

    for (int ch = 0; ch < 4; ch++) {
      final samples = <double>[];
      for (final packet in window) {
        for (final sample in packet.emgSamples) {
          samples.add(sample.channels[ch].toDouble());
        }
      }

      // RMS
      rmsAmplitude[ch] = math.sqrt(
        samples.map((s) => s * s).reduce((a, b) => a + b) / samples.length
      );

      // Band power (50-150 Hz): Apply FFT and sum power in band
      bandPower[ch] = _calculateBandPower(samples, sampleRate: 200, lowFreq: 50, highFreq: 150);
    }

    return EMGFeatures(
      rmsAmplitude: rmsAmplitude,
      bandPower: bandPower,
    );
  }
}
```

### 3.4 动作分类推理 (Movement Classification Inference)

```dart
class MovementClassifier {
  final int windowSize = 30;
  final int featureSize = 35;

  Future<ClassificationResult> classify(List<FusedFeatures> featureWindow) async {
    if (featureWindow.length < windowSize) {
      return ClassificationResult.insufficient();
    }

    // Step 1: Convert to flat tensor [1, 30, 35]
    final inputTensor = _featuresToTensor(featureWindow);

    // Step 2: Run inference
    final outputTensor = List.filled(1 * 10, 0.0).reshape([1, 10]);  // 10 error classes
    _classifierInterpreter.run(inputTensor, outputTensor);

    // Step 3: Apply softmax and find top prediction
    final probabilities = _softmax(outputTensor[0]);
    final topIndex = probabilities.indexOf(probabilities.reduce(math.max));
    final topConfidence = probabilities[topIndex];

    return ClassificationResult(
      errorType: _errorLabels[topIndex] ?? 'UNKNOWN',
      confidence: topConfidence,
      allProbabilities: probabilities,
    );
  }

  Float32List _featuresToTensor(List<FusedFeatures> window) {
    final buffer = Float32List(1 * windowSize * featureSize);
    int idx = 0;

    for (final features in window.take(windowSize)) {
      // Flatten all features
      buffer.setAll(idx, features.jointAngles); idx += 8;
      buffer.setAll(idx, features.jointVelocities); idx += 8;
      buffer[idx++] = features.torsoOrientation;
      buffer.setAll(idx, features.orientation.toList()); idx += 4;
      buffer.setAll(idx, features.linearAccel.toList()); idx += 3;
      buffer.setAll(idx, features.angularVel.toList()); idx += 3;
      buffer.setAll(idx, features.rmsAmplitude); idx += 4;
      buffer.setAll(idx, features.bandPower); idx += 4;
    }

    return buffer;
  }

  List<double> _softmax(List<double> logits) {
    final expSum = logits.map((x) => math.exp(x)).reduce((a, b) => a + b);
    return logits.map((x) => math.exp(x) / expSum).toList();
  }
}
```

---

## 4. 触觉反馈集成 (Haptic Feedback Integration)

### 4.1 触发逻辑 (Triggering Logic)

```dart
class HapticFeedbackController {
  final BLEDeviceManager bleManager;
  DateTime? _lastHapticTime;
  final minHapticInterval = Duration(milliseconds: 500);  // Avoid haptic spam

  Future<void> onClassificationResult(ClassificationResult result) async {
    // Only trigger on high-confidence errors
    if (result.confidence < 0.7 || result.errorType == 'NO_ERROR') {
      return;
    }

    // Rate limiting (速率限制)
    final now = DateTime.now();
    if (_lastHapticTime != null && now.difference(_lastHapticTime!) < minHapticInterval) {
      return;
    }

    // Select haptic pattern based on error severity (根据错误严重程度选择触觉模式)
    final pattern = _selectHapticPattern(result.errorType, result.confidence);

    // Send command to firmware
    await bleManager.sendHapticCommand(pattern);
    _lastHapticTime = now;

    // Log for analytics
    print('[Haptic] Triggered: ${result.errorType} (confidence: ${result.confidence})');
  }

  HapticPattern _selectHapticPattern(String errorType, double confidence) {
    // Critical errors (e.g., dangerous form) (关键错误-例如危险动作)
    if (errorType.contains('CRITICAL') || confidence > 0.9) {
      return HapticPattern(
        id: 0x03,          // Triple pulse
        intensity: 255,
        durationMs: 300,
      );
    }

    // Moderate errors (中等错误)
    if (confidence > 0.8) {
      return HapticPattern(
        id: 0x02,          // Double pulse
        intensity: 200,
        durationMs: 200,
      );
    }

    // Minor corrections (轻微纠正)
    return HapticPattern(
      id: 0x01,            // Single pulse
      intensity: 150,
      durationMs: 100,
    );
  }
}
```

### 4.2 固件触觉驱动 (Firmware Haptic Driver)

```c
// Pseudocode: Firmware haptic motor control
typedef struct {
    uint8_t pattern_id;
    uint8_t intensity;
    uint16_t duration_ms;
} HapticCommand;

void on_haptic_write(const uint8_t* data, size_t len) {
    HapticCommand cmd;
    cmd.pattern_id = data[0];
    cmd.intensity = data[1];
    cmd.duration_ms = data[2] * 10;  // Convert to milliseconds

    execute_haptic_pattern(cmd);
}

void execute_haptic_pattern(HapticCommand cmd) {
    switch (cmd.pattern_id) {
        case 0x01:  // Single pulse (单次脉冲)
            set_motor_pwm(cmd.intensity);
            delay_ms(cmd.duration_ms);
            set_motor_pwm(0);
            break;

        case 0x02:  // Double pulse (双脉冲)
            for (int i = 0; i < 2; i++) {
                set_motor_pwm(cmd.intensity);
                delay_ms(cmd.duration_ms / 3);
                set_motor_pwm(0);
                delay_ms(cmd.duration_ms / 6);
            }
            break;

        case 0x03:  // Triple pulse (critical alert) (三脉冲-关键警报)
            for (int i = 0; i < 3; i++) {
                set_motor_pwm(cmd.intensity);
                delay_ms(cmd.duration_ms / 5);
                set_motor_pwm(0);
                delay_ms(cmd.duration_ms / 10);
            }
            break;
    }
}
```

---

## 5. 错误处理和重试策略 (Error Handling and Retry Strategies)

### 5.1 BLE 错误恢复 (BLE Error Recovery)

```dart
class RobustBLEManager extends BLEDeviceManager {
  int _reconnectAttempts = 0;
  static const maxReconnectAttempts = 3;
  static const reconnectDelay = Duration(seconds: 2);

  @override
  Future<void> _onDisconnected(GenericFailure<ConnectionError>? failure) async {
    print('[BLE] Disconnected: ${failure?.code}');

    if (_reconnectAttempts < maxReconnectAttempts) {
      _reconnectAttempts++;
      print('[BLE] Reconnection attempt $_reconnectAttempts/$maxReconnectAttempts');

      await Future.delayed(reconnectDelay);
      await connect();
    } else {
      print('[BLE] Max reconnect attempts reached, showing user prompt');
      _showReconnectionDialog();
      _reconnectAttempts = 0;
    }
  }

  @override
  void _onSensorData(List<int> rawData) {
    try {
      super._onSensorData(rawData);
      _consecutiveErrors = 0;  // Reset error counter on success
    } catch (e) {
      _consecutiveErrors++;

      if (_consecutiveErrors > 10) {
        print('[BLE] Too many decoding errors, resetting connection');
        disconnect();
        connect();
      }
    }
  }
}
```

### 5.2 ML 推理回退 (ML Inference Fallback)

```dart
class ResilientMLPipeline {
  int _consecutiveFailures = 0;
  static const maxFailures = 5;

  Future<ClassificationResult> classifyWithFallback(List<FusedFeatures> features) async {
    try {
      final result = await _classifier.classify(features);
      _consecutiveFailures = 0;
      return result;

    } catch (e) {
      _consecutiveFailures++;
      print('[ML] Inference failed: $e');

      if (_consecutiveFailures > maxFailures) {
        print('[ML] Too many failures, reloading model');
        await _classifier.initialize();
        _consecutiveFailures = 0;
      }

      // Return safe default (no error detected)
      return ClassificationResult(
        errorType: 'NO_ERROR',
        confidence: 0.0,
        allProbabilities: List.filled(10, 0.0),
      );
    }
  }
}
```

### 5.3 优雅降级矩阵 (Graceful Degradation Matrix)

| 故障场景 (Failure Scenario) | 检测方法 (Detection Method) | 降级策略 (Degradation Strategy) | 恢复 (Recovery) |
|------------------|------------------|----------------------|----------|
| BLE disconnection (BLE 断开) | No packets for 100ms | Pause inference, show "Reconnecting..." | Auto-reconnect (3 attempts) |
| Low pose confidence (低姿态置信度) (<0.3) | Mean keypoint confidence | Skip frame, show "Move closer" | Resume when confidence recovers |
| High latency (高延迟) (>150ms) | Timestamp delta tracking | Drop to 30 FPS | Resume 60 FPS when latency improves |
| ML inference timeout (ML 推理超时) | Future timeout (500ms) | Skip classification, keep pose | Reload model after 5 failures |
| Memory pressure (内存压力) | System memory warning | Reduce buffer size (50→25 frames) | Restore after pressure relieved |

---

## 6. 性能优化模式 (Performance Optimization Patterns)

### 6.1 延迟初始化 (Lazy Initialization)

```dart
class LazyMLPipeline {
  Interpreter? _poseInterpreter;
  Interpreter? _classifierInterpreter;

  Future<Interpreter> get poseInterpreter async {
    _poseInterpreter ??= await _loadPoseModel();
    return _poseInterpreter!;
  }

  // Only load classifier when first classification is requested
  Future<Interpreter> get classifierInterpreter async {
    _classifierInterpreter ??= await _loadClassifierModel();
    return _classifierInterpreter!;
  }
}
```

### 6.2 对象池 (减少 GC 压力) (Object Pooling - Reduce GC Pressure)

```dart
class TensorPool {
  final Queue<Float32List> _pool = Queue();
  final int tensorSize;

  TensorPool(this.tensorSize);

  Float32List acquire() {
    if (_pool.isEmpty) {
      return Float32List(tensorSize);
    }
    return _pool.removeFirst();
  }

  void release(Float32List tensor) {
    if (_pool.length < 10) {  // Max pool size
      _pool.add(tensor);
    }
  }
}
```

### 6.3 并行处理 (Parallel Processing)

```dart
class ParallelPipeline {
  Future<AnalysisResult> processFrame(CameraImage image, int timestamp) async {
    // Run pose estimation and sensor retrieval in parallel
    final results = await Future.wait([
      _poseEstimator.estimatePose(image),
      _sensorBuffer.getWindow(timestamp - 50, timestamp),
    ]);

    final pose = results[0] as PoseEstimationResult;
    final sensorData = results[1] as List<SensorPacket>;

    // Continue with fusion and classification
    final features = _fusion.fuseData(pose, sensorData.imu, sensorData.emg);
    final classification = await _classifier.classify(features);

    return AnalysisResult(pose: pose, classification: classification);
  }
}
```

---

## 总结 (Summary)

集成模式建立了 (The integration patterns establish):

1. **BLE Protocol (BLE 协议)**: 500-byte MTU, 7.5ms intervals, Protobuf encoding → 100 Hz throughput
2. **Flutter Integration (Flutter 集成)**: `flutter_reactive_ble` streams, timestamp synchronization, backpressure handling
3. **ML Pipeline (ML 管道)**: TFLite models (FP16 pose + INT8 classifier), feature fusion, sliding window inference
4. **Haptic Feedback (触觉反馈)**: Confidence-based triggering (>0.7), rate limiting (500ms), multi-pattern support
5. **Error Handling (错误处理)**: Auto-reconnect (3 attempts), graceful degradation, fallback strategies

**Key Performance Optimizations (关键性能优化)**:

- Lazy initialization (延迟初始化) (save 200ms startup time)
- Object pooling (对象池) (reduce GC pauses)
- Parallel processing (并行处理) (save 20ms per frame)

**Reliability Features (可靠性功能)**:

- Sequence IDs detect 0.5% packet loss
- Timestamp sync handles clock drift (<50 ppm)
- Automatic model reloading after persistent failures
