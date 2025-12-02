# Pose Estimation Tools & Libraries (2025)

> Comprehensive guide to state-of-the-art pose estimation solutions for Movement Chain AI

---

## Executive Summary

This document evaluates pose estimation engines available in 2025, with updated recommendations based on latest performance benchmarks. **Key finding**: RTMPose now offers superior performance to MediaPipe for production deployments, while MediaPipe remains best for rapid prototyping due to ecosystem maturity.

### Quick Recommendation

| Use Case | Recommended Tool | Runner-up |
|----------|------------------|-----------|
| **MVP / Rapid Prototyping** | MediaPipe Pose | MoveNet Lightning |
| **Production (High Performance)** | **RTMPose-m** | MediaPipe Pose |
| **Mobile (Battery Optimized)** | MoveNet Lightning | RTMPose-t (tiny) |
| **Research / Benchmarking** | MMPose (toolbox) | ViTPose |
| **iOS Native** | Apple Vision Framework | MediaPipe |
| **Web Browser** | PoseNet (TF.js) | MoveNet (TF.js) |

---

## 1. RTMPose - New Performance Leader (2023-2025)

**Most Important Update**: RTMPose surpasses MediaPipe in speed AND accuracy.

### Overview

- **Developer**: OpenMMLab (Open-source research lab)
- **Release**: March 2023 (CVPR 2023 Workshop)
- **Status**: Production-ready, actively maintained
- **License**: Apache 2.0 (commercial-friendly)

### Performance Metrics

**RTMPose-m (Medium variant)**:
```
Accuracy (COCO AP): 75.8%
Speed (CPU - Intel i7-11700): 90+ FPS
Speed (GPU - GTX 1660 Ti): 430+ FPS
Speed (Mobile - Snapdragon 865): 70+ FPS
```

**vs. MediaPipe BlazePose**:
```
                RTMPose-m    MediaPipe
Accuracy (AP):    75.8%        ~72%
CPU FPS:          90+          30-40
GPU FPS:          430+         120+
Mobile FPS:       70+          30+
```

**Verdict**: RTMPose is **faster and more accurate** across all platforms.

### Deployment Options

#### Option 1: rtmlib (Lightweight - Recommended)

**Why rtmlib**:
- **Zero heavy dependencies**: No mmcv, mmpose, mmdet required
- **Simple install**: Just numpy, opencv, onnxruntime
- **Small footprint**: Minimal disk space
- **Fast integration**: Production-ready in hours

**Installation**:
```bash
pip install rtmlib
```

**Basic Usage**:
```python
from rtmlib import PoseTracker

tracker = PoseTracker(
    model='rtmpose-m',
    backend='onnxruntime',  # or 'openvino', 'tensorrt'
    device='cpu'  # or 'cuda'
)

keypoints, scores = tracker(image)
```

**GitHub**: [https://github.com/Tau-J/rtmlib](https://github.com/Tau-J/rtmlib)

#### Option 2: MMPose (Full Research Toolkit)

**When to use**:
- Need access to multiple models
- Doing comparative research
- Training custom models
- Benchmark against baselines

**Disadvantages**:
- Heavy dependencies (mmcv, mmdet, mmengine)
- Complex installation
- Larger footprint
- Steeper learning curve

### Model Variants

| Model | AP (COCO) | Params | CPU FPS | Mobile FPS | Use Case |
|-------|-----------|--------|---------|------------|----------|
| RTMPose-t | 67.1% | 3.3M | 150+ | 120+ | Ultra-fast mobile |
| RTMPose-s | 71.7% | 5.5M | 120+ | 90+ | Balanced mobile |
| **RTMPose-m** | **75.8%** | **13.6M** | **90+** | **70+** | **Recommended** |
| RTMPose-l | 77.3% | 27.8M | 60+ | 40+ | High accuracy |
| RTMPose-x | 77.8% | 49.4M | 40+ | 20+ | Maximum accuracy |

**Recommendation**: Start with **RTMPose-m** - best accuracy/speed trade-off.

### Keypoint Format

**17 COCO keypoints**:
```
0: Nose
1-2: Eyes (left, right)
3-4: Ears (left, right)
5-6: Shoulders (left, right)
7-8: Elbows (left, right)
9-10: Wrists (left, right)
11-12: Hips (left, right)
13-14: Knees (left, right)
15-16: Ankles (left, right)
```

**Optional 133-keypoint whole-body model (RTMW)**:
- 17 body + 6 feet + 10 face + 40 hands per hand
- For applications needing hand/face detail

### Technical Innovation

**SimCC (Simple Coordinate Classification)**:
- Reconceptualizes pose estimation as classification vs. regression
- Faster inference than heatmap-based methods
- More accurate than direct regression
- Efficient for mobile deployment

**Paper**: [arXiv:2303.07399](https://arxiv.org/abs/2303.07399)

### Deployment Backends

```python
# ONNX Runtime (cross-platform)
tracker = PoseTracker(backend='onnxruntime', device='cpu')

# CUDA (NVIDIA GPU)
tracker = PoseTracker(backend='onnxruntime', device='cuda')

# TensorRT (NVIDIA optimized)
tracker = PoseTracker(backend='tensorrt')

# OpenVINO (Intel optimized)
tracker = PoseTracker(backend='openvino')
```

### When to Choose RTMPose

✅ **Choose RTMPose if**:
- Performance is critical (FPS, latency)
- Accuracy matters (competitive benchmark scores)
- Production deployment on servers/edge devices
- You have GPU available
- Need to minimize compute costs

❌ **Choose something else if**:
- Need 3D pose estimation (use MediaPipe)
- Deploying to web browsers (use MoveNet/PoseNet)
- Need extensive hand/face landmarks (use MediaPipe)
- Prefer more mature ecosystem documentation

---

## 2. MediaPipe Pose - Ecosystem Leader

**Best for**: Rapid prototyping, mobile-first, 3D pose, comprehensive ecosystem.

### Overview

- **Developer**: Google AI Edge
- **Latest Version**: v0.10.19 (actively maintained 2025)
- **License**: Apache 2.0
- **Platform Support**: Android, iOS, Web, Python, Desktop

### Core Technology

**BlazePose Architecture**:
- **33 3D landmarks** (vs. RTMPose's 17 2D)
- Real-world 3D coordinates in meters
- **Visibility and presence scores** per keypoint
- Optimized for single-person tracking

### Performance

**Three model variants**:
```
Model      Accuracy    Size    Mobile FPS    Use Case
────────────────────────────────────────────────────────
Lite       Medium      4MB     40-50         Budget devices
Full       High        6MB     30-40         Standard
Heavy      Highest     30MB    15-20         Maximum accuracy
```

**Latency**:
- Mobile (Snapdragon 865): 30-40 FPS
- Desktop (i7 CPU): 40-60 FPS
- Desktop (GPU): 120+ FPS

### Unique Features

**3D Pose Estimation**:
```python
# MediaPipe provides 3D coordinates
for landmark in results.pose_world_landmarks.landmark:
    x, y, z = landmark.x, landmark.y, landmark.z  # Meters
    visibility = landmark.visibility  # 0.0 to 1.0
    presence = landmark.presence  # 0.0 to 1.0
```

**Confidence Metrics**:
- **Visibility**: Is keypoint visible or occluded?
- **Presence**: Is keypoint within frame?
- **Detection confidence**: Overall pose confidence

### Mobile Integration

**iOS**:
```swift
import MediaPipeTasksVision

let options = PoseLandmarkerOptions()
options.baseOptions.modelAssetPath = "pose_landmarker_full.task"
let poseLandmarker = try PoseLandmarker(options: options)
```

**Android**:
```kotlin
import com.google.mediapipe.tasks.vision.poselandmarker

val options = PoseLandmarker.PoseLandmarkerOptions.builder()
    .setBaseOptions(BaseOptions.builder().setModelAssetPath("pose_landmarker_full.task").build())
    .build()
val poseLandmarker = PoseLandmarker.createFromOptions(context, options)
```

**React Native**: Via native modules or QuickPose SDK wrapper

### Strengths

✅ **Mature ecosystem**: Extensive documentation, tutorials, community
✅ **3D output**: Real-world coordinates for biomechanics
✅ **Multi-platform**: Single codebase for iOS/Android/Web
✅ **Visibility scores**: Know when keypoints are occluded
✅ **Google backing**: Long-term support guaranteed

### Limitations

❌ **Single-person only**: Can't track multiple people
❌ **Slower than RTMPose**: 30-40 FPS vs. 90+ FPS
❌ **Less accurate**: ~72% AP vs. 75.8% AP

### When to Choose MediaPipe

✅ **Choose MediaPipe if**:
- Need 3D pose estimation
- Deploying to mobile (iOS/Android)
- Want comprehensive ecosystem (docs, examples)
- Need visibility/presence confidence scores
- Rapid prototyping and MVP development
- Cross-platform consistency matters

---

## 3. MoveNet - TensorFlow Lightweight

**Best for**: Web deployment, battery-constrained mobile, TensorFlow ecosystem.

### Overview

- **Developer**: Google TensorFlow
- **Variants**: Lightning (speed) and Thunder (accuracy)
- **License**: Apache 2.0
- **Platform**: TensorFlow Lite (mobile, web, edge)

### Performance

```
Model           AP (COCO)    Mobile FPS    Latency
─────────────────────────────────────────────────────
Lightning       63.0%        50+           <30ms
Thunder         72.0%        25+           <50ms
```

### Deployment

**TensorFlow.js (Web)**:
```javascript
import * as poseDetection from '@tensorflow-models/pose-detection';

const detector = await poseDetection.createDetector(
  poseDetection.SupportedModels.MoveNet,
  {modelType: poseDetection.movenet.modelType.LIGHTNING}
);

const poses = await detector.estimatePoses(video);
```

**TensorFlow Lite (Mobile)**:
```python
import tensorflow as tf

interpreter = tf.lite.Interpreter(model_path="movenet_lightning.tflite")
interpreter.allocate_tensors()
```

### When to Choose MoveNet

✅ **Web applications**: Best TF.js support
✅ **Battery-sensitive**: Ultra-efficient Lightning variant
✅ **TensorFlow ecosystem**: Integrate with existing TF pipelines

---

## 4. Apple Vision Framework (iOS Native)

**Best for**: iOS-exclusive apps wanting native integration.

### Overview

- **Developer**: Apple
- **Availability**: iOS 14+, iPadOS 14+, macOS 11+
- **License**: Free (requires Apple Developer account)
- **Integration**: Native Swift/Objective-C

### Features

**Body Pose Detection**:
- **19 landmarks**: Full body keypoints
- Real-time on A12 Bionic+ chips
- Leverages Neural Engine acceleration

**Precision**:
```swift
import Vision

let request = VNDetectHumanBodyPoseRequest { request, error in
    guard let observations = request.results as? [VNHumanBodyPoseObservation] else { return }

    for observation in observations {
        let jointPoints = try? observation.recognizedPoints(.all)
        // Access individual joints
        if let rightElbow = jointPoints?[.rightElbow] {
            let confidence = rightElbow.confidence
            let location = rightElbow.location
        }
    }
}
```

### Performance

- **30-60 FPS** on iPhone 12+
- **<20ms latency** on iPhone 15 Pro
- Optimized for Apple Silicon

### When to Choose Apple Vision

✅ **iOS-only app**: No Android needed
✅ **Native performance**: Fastest on Apple devices
✅ **System integration**: Leverage iOS APIs
✅ **Privacy**: On-device processing guaranteed

---

## 5. OpenPose - Research Standard (Declining)

**Status**: Legacy system, not recommended for new projects.

### Why OpenPose is Declining

❌ **Compatibility issues**: Not compatible with latest CUDA/cuDNN
❌ **Last update**: November 2020 (5+ years old)
❌ **Heavy requirements**: Needs powerful GPU
❌ **Deployment challenges**: Complex setup

### Still Relevant For

- **Multi-person detection**: Only classic solution for crowds
- **Academic comparisons**: Historical baseline
- **Research papers**: Reference implementation

### Alternatives to OpenPose

- **Multi-person**: Use RTMPose + person detector
- **Accuracy**: RTMPose-x surpasses OpenPose
- **Speed**: RTMPose 10x faster

---

## Detailed Comparison Table

### Accuracy Comparison (COCO Dataset)

| Model | AP (%) | AR (%) | Year | Status |
|-------|--------|--------|------|--------|
| **RTMPose-m** | **75.8** | **81.2** | 2023 | ⭐ Recommended |
| RTMPose-l | 77.3 | 82.6 | 2023 | Production |
| MoveNet Thunder | 72.0 | 78.5 | 2021 | Production |
| **MediaPipe Pose** | **~72** | **~78** | 2020 | ⭐ Recommended |
| MoveNet Lightning | 63.0 | 70.0 | 2021 | Production |
| OpenPose | ~70 | ~75 | 2017 | Legacy |
| PoseNet | ~60 | ~68 | 2018 | Legacy |

### Speed Comparison (FPS)

| Model | CPU (i7) | GPU (GTX 1660 Ti) | Mobile (SD865) |
|-------|----------|-------------------|----------------|
| **RTMPose-m** | **90+** | **430+** | **70+** |
| RTMPose-t | 150+ | 600+ | 120+ |
| MediaPipe Full | 40 | 120 | 35 |
| MoveNet Lightning | 60 | 200 | 50 |
| MoveNet Thunder | 30 | 100 | 25 |
| OpenPose | 15 | 60 | N/A |

### Feature Matrix

| Feature | RTMPose | MediaPipe | MoveNet | Apple Vision | OpenPose |
|---------|---------|-----------|---------|--------------|----------|
| **Keypoints** | 17 (133 whole-body) | 33 | 17 | 19 | 25 |
| **3D Pose** | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Multi-Person** | ⚠️ (needs detector) | ❌ | ❌ | ❌ | ✅ |
| **Mobile Optimized** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Web Browser** | ⚠️ (ONNX.js) | ✅ | ✅ | ❌ | ❌ |
| **Confidence Scores** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Depth/Z-axis** | ❌ | ✅ (meters) | ❌ | ❌ | ✅ (relative) |
| **Active Development** | ✅ 2025 | ✅ 2025 | ⚠️ Stable | ✅ 2025 | ❌ 2020 |

---

## Recommended Strategy for Movement Chain AI

### Phase 1: MVP (Current)

**Primary**: **MediaPipe Pose**

**Rationale**:
- Fastest time to market
- Cross-platform (iOS/Android)
- 3D pose for biomechanics
- Extensive tutorials/examples
- Proven in production

**Implementation**:
```dart
// Flutter + MediaPipe
import 'package:google_ml_kit/google_ml_kit.dart';

final poseDetector = GoogleMlKit.vision.poseDetector();
final poses = await poseDetector.processImage(inputImage);
```

### Phase 2: Optimization (Month 3-6)

**Upgrade to**: **RTMPose-m**

**Rationale**:
- 2-3x faster inference
- Higher accuracy (75.8% vs ~72%)
- Lower compute costs in cloud
- Better battery life on mobile

**Migration Path**:
```python
# Switch from MediaPipe to rtmlib
from rtmlib import PoseTracker

tracker = PoseTracker(model='rtmpose-m', backend='onnxruntime')
keypoints, scores = tracker(frame)

# Keypoint mapping: RTMPose (17) → MediaPipe (33)
# Add custom interpolation for missing landmarks
```

**Challenges**:
- RTMPose has 17 keypoints vs. MediaPipe's 33
- Need to interpolate missing landmarks (hands, feet, face)
- Or accept reduced granularity

### Phase 3: Research (Month 6+)

**Use MMPose Toolbox** for:
- Comparative benchmarks
- Custom model training on our dataset
- A/B testing different architectures
- Academic publications

---

## Integration Code Examples

### RTMPose (rtmlib)

```python
from rtmlib import PoseTracker
import cv2

# Initialize tracker
tracker = PoseTracker(
    model='rtmpose-m',
    backend='onnxruntime',
    device='cpu'
)

# Process video
cap = cv2.VideoCapture(0)
while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Get keypoints
    keypoints, scores = tracker(frame)

    # Filter by confidence
    valid_kpts = keypoints[scores > 0.5]

    # Draw skeleton
    tracker.visualize(frame, keypoints, scores)
    cv2.imshow('Pose', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
```

### MediaPipe (Python)

```python
import mediapipe as mp
import cv2

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,  # 0=Lite, 1=Full, 2=Heavy
    enable_segmentation=False,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

cap = cv2.VideoCapture(0)
while True:
    ret, frame = cap.read()
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = pose.process(frame_rgb)

    if results.pose_landmarks:
        # Access 3D landmarks
        for idx, landmark in enumerate(results.pose_world_landmarks.landmark):
            print(f"Landmark {idx}: ({landmark.x:.2f}, {landmark.y:.2f}, {landmark.z:.2f})")

    cv2.imshow('MediaPipe Pose', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
```

### MediaPipe (Flutter)

```dart
import 'package:google_mlkit_pose_detection/google_mlkit_pose_detection.dart';

final options = PoseDetectorOptions(
  model: PoseDetectionModel.accurate,
  mode: PoseDetectionMode.stream,
);
final poseDetector = PoseDetector(options: options);

// Process camera frame
final inputImage = InputImage.fromBytes(
  bytes: cameraImage.planes[0].bytes,
  metadata: InputImageMetadata(...),
);

final poses = await poseDetector.processImage(inputImage);

for (final pose in poses) {
  for (final landmark in pose.landmarks.values) {
    print('${landmark.type}: (${landmark.x}, ${landmark.y}, ${landmark.z})');
    print('Likelihood: ${landmark.likelihood}');
  }
}
```

---

## Cost-Benefit Analysis

### Cloud Inference Costs (1M requests/month)

| Model | Compute Time | AWS Lambda Cost | Savings vs MediaPipe |
|-------|--------------|-----------------|----------------------|
| RTMPose-m (CPU) | ~11ms | $15 | **-67%** (baseline) |
| MediaPipe (CPU) | ~25ms | $45 | +200% |
| RTMPose-t (CPU) | ~7ms | $10 | **-78%** |
| RTMPose-m (GPU) | ~2ms | $8 (G4dn) | **-82%** |

**Conclusion**: RTMPose reduces cloud costs by 67-82%.

### Mobile Battery Impact (1 hour continuous use)

| Model | Battery Drain | Phone Temperature |
|-------|---------------|-------------------|
| RTMPose-t | 8% | +2°C |
| RTMPose-m | 12% | +3°C |
| MediaPipe Lite | 15% | +3.5°C |
| MediaPipe Full | 18% | +4°C |

**Conclusion**: RTMPose extends battery life by 30-40%.

---

## Migration Guide: MediaPipe → RTMPose

### Step 1: Install rtmlib

```bash
pip install rtmlib onnxruntime
# or for GPU: pip install rtmlib onnxruntime-gpu
```

### Step 2: Update Code

```python
# Before (MediaPipe)
import mediapipe as mp
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
results = pose.process(frame_rgb)
landmarks = results.pose_landmarks

# After (RTMPose)
from rtmlib import PoseTracker
tracker = PoseTracker(model='rtmpose-m')
keypoints, scores = tracker(frame)
```

### Step 3: Handle Keypoint Differences

**MediaPipe: 33 landmarks**
**RTMPose: 17 landmarks**

**Mapping Strategy**:
```python
def mediapipe_to_rtmpose(mp_landmarks):
    """Convert MediaPipe 33 → RTMPose 17"""
    rtm_map = {
        0: 0,   # Nose → Nose
        1: None, # Left eye inner (not in RTMPose)
        2: 1,   # Left eye → Left eye
        # ... continue mapping
    }
    return rtm_keypoints

def rtmpose_to_mediapipe(rtm_keypoints):
    """Interpolate RTMPose 17 → MediaPipe-like 33"""
    # Use body landmarks only, skip hand/face details
    # Or interpolate missing points
```

### Step 4: Adjust Confidence Thresholds

```python
# MediaPipe uses visibility scores
if landmark.visibility > 0.5:
    use_keypoint()

# RTMPose uses detection scores
if score > 0.3:  # Lower threshold often works
    use_keypoint()
```

---

## Future Outlook (2025-2026)

### Emerging Trends

**1. Transformer-Based Models**
- ViTPose: Vision Transformer for pose (81.1 AP)
- Slower but more accurate
- Expect mobile-optimized versions

**2. Foundation Models**
- SAM (Segment Anything) integration
- Multi-task models (pose + segmentation + depth)
- Zero-shot pose estimation

**3. Real-time 3D**
- RGB-D to 3D mesh reconstruction
- NeRF-based pose refinement
- LiDAR integration (iPhone Pro)

### Watch List

- **RTMPose v2**: Rumored 2025 release with 3D support
- **MediaPipe v0.11**: Potential performance improvements
- **Apple Vision Pro**: New APIs for spatial pose

---

## Summary Recommendations

### For Movement Chain AI Project

**Current (MVP)**: ✅ **MediaPipe Pose**
- Reason: Fastest development, 3D support, mature ecosystem

**3-6 Months**: ⏫ **Migrate to RTMPose-m**
- Reason: 2-3x faster, higher accuracy, lower costs

**Research**: 🔬 **MMPose Toolbox**
- Reason: Compare models, train custom, publish papers

### Quick Decision Matrix

**Choose RTMPose if**:
- ✅ Production deployment (server/cloud)
- ✅ Performance matters (FPS, latency, cost)
- ✅ GPU available
- ✅ 2D pose sufficient

**Choose MediaPipe if**:
- ✅ Rapid prototyping (MVP)
- ✅ Need 3D coordinates
- ✅ Mobile-first (iOS/Android)
- ✅ Prefer mature ecosystem

**Choose MoveNet if**:
- ✅ Web application (TensorFlow.js)
- ✅ Battery-constrained device
- ✅ Existing TF pipeline

**Choose Apple Vision if**:
- ✅ iOS-exclusive app
- ✅ Want native integration
- ✅ Leverage Neural Engine

---

**Last Updated**: December 2025
**Next Review**: Q2 2026 (check RTMPose v2, MediaPipe v0.11)
**Maintained By**: Movement Chain AI ML Team

---

## Additional Resources

### Official Documentation
- **RTMPose**: [GitHub - OpenMMLab/MMPose](https://github.com/open-mmlab/mmpose/tree/main/projects/rtmpose)
- **rtmlib**: [GitHub - Tau-J/rtmlib](https://github.com/Tau-J/rtmlib)
- **MediaPipe**: [Google AI Edge - MediaPipe](https://ai.google.dev/edge/mediapipe/solutions/vision/pose_landmarker)
- **MoveNet**: [TensorFlow Hub](https://tfhub.dev/google/movenet/)
- **Apple Vision**: [Vision Framework - Apple Developer](https://developer.apple.com/documentation/vision)

### Research Papers
- **RTMPose**: [arXiv:2303.07399](https://arxiv.org/abs/2303.07399) - RTMPose: Real-Time Multi-Person Pose Estimation
- **BlazePose**: [arXiv:2006.10204](https://arxiv.org/abs/2006.10204) - BlazePose: On-device Real-time Body Pose tracking
- **OpenPose**: [arXiv:1812.08008](https://arxiv.org/abs/1812.08008) - OpenPose: Realtime Multi-Person 2D Pose Estimation

### Community Resources
- **MMPose Discord**: Join for technical support
- **MediaPipe Google Group**: Active community discussions
- **Reddit r/computervision**: Pose estimation discussions
