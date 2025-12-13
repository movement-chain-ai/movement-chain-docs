# 视觉/摄像头传感器

基于计算机视觉的姿态估计是高尔夫挥杆分析的核心技术之一，通过摄像头捕捉和 AI 模型实现无标记骨骼追踪。

---

## 技术概述

### 我们的选择：分阶段演进

!!! success "项目决策"
    根据开发阶段选择最适合的姿态估计模型，平衡开发速度与精度需求

| 阶段 | 模型 | AP (COCO) | 为什么 |
|------|------|-----------|--------|
| **MVP** | MediaPipe Pose | ~70%* | `pip install mediapipe` 即用，Google 持续维护 (v0.10.26) |
| Phase 2 | RTMPose-m | 75.8% | 精度更高，需配置 mmpose 生态 |
| Phase 3 | ViTPose++ | 81.1% | SOTA，需 GPU 服务器部署 |

> *MediaPipe 使用 33 关键点 vs COCO 的 17 点，AP 不直接可比

### 模型性能对比

| 模型 | 参数量 | AP (COCO) | 延迟 (ms) | 来源 |
|-----|-------|----------|----------|------|
| RTMPose-t | 3.3M | 68.4 | 3.2 | [arXiv:2303.07399][rtmpose-paper] |
| RTMPose-m | 13.6M | 75.8 | 5.4 | [arXiv:2303.07399][rtmpose-paper] |
| RTMPose-l | 27.7M | 76.3 | 8.1 | [arXiv:2303.07399][rtmpose-paper] |
| ViTPose++ (ViT-H) | 632M | 81.1 | GPU only | [NeurIPS'22][vitpose-paper] |
| MoveNet | 2.8M | 64.9 | 6.8 | TensorFlow Hub |
| MediaPipe | ~3M | ~70* | 8-12 | Google AI Edge |

[rtmpose-paper]: https://arxiv.org/abs/2303.07399
[vitpose-paper]: https://arxiv.org/abs/2204.12484

!!! info "为什么精度不同？— 技术深度解析"

    **AP (Average Precision)** 来自 [MS COCO Keypoint Benchmark](https://paperswithcode.com/sota/keypoint-detection-on-coco-test-dev)，评估预测关键点与真实标注的距离。

    | 因素 | MediaPipe | RTMPose | ViTPose++ | 影响 |
    |------|-----------|---------|-----------|------|
    | **Backbone** | MobileNet (分类优化) | CSPNeXt (检测优化) | ViT-Huge (Transformer) | +5-10 AP |
    | **定位方法** | Heatmap→回归 | SimCC (坐标分类) | 简单解码器 | +1-3 AP |
    | **注意力机制** | 无 | GAU (门控注意力) | 全局自注意力 | +2-4 AP |
    | **感受野** | 局部 (卷积核限制) | 中等 | 全局 (整图注意力) | +3-5 AP |
    | **训练策略** | 单阶段 | 两阶段+蒸馏 | 大规模预训练+MAE | +1-3 AP |

    **关键差异**:

    - **SimCC vs Heatmap**: RTMPose 将坐标预测转为分类任务，避免 Heatmap 量化误差
    - **Vision Transformer**: ViTPose 用全局注意力捕捉长距离依赖，CNN 难以做到
    - **Trade-off**: 精度越高 → 计算越重 → 移动端越难部署

### 骨骼关键点

```text
                RTMPose 17 关键点

                    0 (nose)
                      │
            1 ─────── 2 ────── 3
          (L eye)  (R eye)  (L ear)
                      │
                      4 (R ear)
                      │
           5 ─────────┼──────── 6
         (L shoulder) │      (R shoulder)
              │       │           │
              7       │           8
           (L elbow)  │        (R elbow)
              │       │           │
              9       │          10
          (L wrist)   │       (R wrist)
                      │
          11 ─────────┼──────── 12
         (L hip)      │       (R hip)
              │       │           │
             13       │          14
          (L knee)    │       (R knee)
              │       │           │
             15       │          16
         (L ankle)    │       (R ankle)

        共 17 关键点 × 2 坐标 = 34D 特征向量
```

---

## 解决方案对比

### 端侧部署方案

| 方案 | 模型 | 平台 | 特点 | 适用阶段 |
|-----|------|-----|------|---------|
| **MediaPipe** | BlazePose | 跨平台 | 易集成、Google 维护 | ✅ **MVP 推荐** |
| **RTMPose + ONNX** | RTMPose-m | iOS/Android | 高精度、开源 | Phase 2 |
| **MoveNet + TFLite** | MoveNet | iOS/Android | 谷歌生态 | TF 项目 |
| **Apple Vision** | 原生 | iOS only | 系统集成 | iOS 专属 |

### 云端方案

| 方案 | 提供商 | 特点 | 价格 |
|-----|-------|-----|------|
| **Sency AI** | Sency | 运动分析 | 免费层 + 商业 |
| **LightBuzz** | LightBuzz | 健身分析 | $0.01/次 |
| **AWS Rekognition** | Amazon | 通用视觉 | $0.001/图 |

### 专业动捕方案

| 方案 | 价格 | 精度 | 适用场景 |
|-----|------|-----|---------|
| **OptiTrack** | $10,000+ | 亚毫米 | 专业动捕 |
| **Vicon** | $50,000+ | 亚毫米 | 研究/影视 |
| **Xsens** | $5,000+ | 高 | 无标记动捕 |
| **iPhone LiDAR** | $1,000 | 中等 | 消费级 3D |

---

## 数据访问

### MediaPipe (MVP 推荐)

```python
import mediapipe as mp
import cv2

mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

def process_video(video_path):
    cap = cv2.VideoCapture(video_path)

    with mp_pose.Pose(
        static_image_mode=False,
        model_complexity=1,  # 0=Lite, 1=Full, 2=Heavy
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    ) as pose:

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # 转换 BGR -> RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(rgb_frame)

            if results.pose_landmarks:
                # 33 个关键点 (MediaPipe 比 COCO 多)
                landmarks = results.pose_landmarks.landmark

                # 提取高尔夫关键关节
                left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST]
                right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST]
                left_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW]
                right_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW]

                # 绘制骨骼
                mp_drawing.draw_landmarks(
                    frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

            cv2.imshow('Pose', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    cap.release()
```

### RTMPose + ONNX (Phase 2)

```python
import onnxruntime as ort
import cv2
import numpy as np

class PoseEstimator:
    def __init__(self, model_path='rtmpose-m.onnx'):
        self.session = ort.InferenceSession(model_path)
        self.input_name = self.session.get_inputs()[0].name
        self.input_shape = (256, 192)  # RTMPose 输入尺寸

    def preprocess(self, image):
        """图像预处理"""
        img = cv2.resize(image, self.input_shape)
        img = img.astype(np.float32) / 255.0
        img = (img - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
        img = img.transpose(2, 0, 1)
        return np.expand_dims(img, 0)

    def inference(self, image):
        """推理获取关键点"""
        input_data = self.preprocess(image)
        outputs = self.session.run(None, {self.input_name: input_data})

        # 输出: [1, 17, 3] - 17 个关键点, 每个 (x, y, confidence)
        keypoints = outputs[0][0]
        return keypoints

    def get_feature_vector(self, keypoints):
        """转换为 34D 特征向量"""
        # 提取 x, y 坐标, 忽略置信度
        return keypoints[:, :2].flatten()  # shape: (34,)

# 使用示例
estimator = PoseEstimator()
frame = cv2.imread('golf_swing.jpg')
keypoints = estimator.inference(frame)
features = estimator.get_feature_vector(keypoints)
print(f"Feature vector shape: {features.shape}")  # (34,)
```

### Flutter + ONNX Runtime (Phase 2)

```dart
import 'package:onnxruntime/onnxruntime.dart';
import 'package:camera/camera.dart';

class PoseEstimator {
  late OrtSession _session;

  Future<void> initialize() async {
    OrtEnv.instance.init();
    final sessionOptions = OrtSessionOptions();
    final modelPath = 'assets/rtmpose-m.onnx';
    _session = OrtSession.fromAsset(modelPath, sessionOptions);
  }

  Future<List<List<double>>> estimate(CameraImage image) async {
    // 预处理图像
    final inputTensor = _preprocessImage(image);

    // 推理
    final inputs = {'input': inputTensor};
    final outputs = await _session.runAsync(inputs);

    // 解析输出
    final keypoints = outputs['output']!.value as List<List<List<double>>>;
    return keypoints[0];  // 17 x 3
  }

  List<double> getFeatureVector(List<List<double>> keypoints) {
    return keypoints.expand((kp) => [kp[0], kp[1]]).toList();  // 34D
  }
}
```

---

## 高尔夫挥杆应用

### 关键角度测量

| 角度 | 计算方法 | 典型值 | 意义 |
|-----|---------|-------|------|
| **脊柱角度** | 肩-髋连线 vs 垂直 | 25-35° | 身体倾斜 |
| **髋旋转** | 左髋-右髋连线角度 | 0-45° | 转体幅度 |
| **肩旋转** | 左肩-右肩连线角度 | 0-90° | 上身旋转 |
| **手臂角度** | 肩-肘-腕夹角 | 90-180° | 手臂伸展 |
| **膝盖弯曲** | 髋-膝-踝夹角 | 140-170° | 稳定性 |

### 角度计算代码

```python
import numpy as np

def calculate_angle(p1, p2, p3):
    """计算三点夹角 (p2 为顶点)"""
    v1 = np.array(p1) - np.array(p2)
    v2 = np.array(p3) - np.array(p2)

    cos_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
    angle = np.arccos(np.clip(cos_angle, -1, 1))
    return np.degrees(angle)

def calculate_golf_angles(keypoints):
    """计算高尔夫关键角度"""
    # keypoints 索引 (COCO 格式)
    L_SHOULDER, R_SHOULDER = 5, 6
    L_ELBOW, R_ELBOW = 7, 8
    L_WRIST, R_WRIST = 9, 10
    L_HIP, R_HIP = 11, 12
    L_KNEE, R_KNEE = 13, 14
    L_ANKLE, R_ANKLE = 15, 16

    angles = {}

    # 左臂角度 (肩-肘-腕)
    angles['left_arm'] = calculate_angle(
        keypoints[L_SHOULDER], keypoints[L_ELBOW], keypoints[L_WRIST])

    # 右臂角度
    angles['right_arm'] = calculate_angle(
        keypoints[R_SHOULDER], keypoints[R_ELBOW], keypoints[R_WRIST])

    # 左膝角度 (髋-膝-踝)
    angles['left_knee'] = calculate_angle(
        keypoints[L_HIP], keypoints[L_KNEE], keypoints[L_ANKLE])

    # 髋旋转 (需要3D或多视角)
    hip_center = (np.array(keypoints[L_HIP]) + np.array(keypoints[R_HIP])) / 2
    shoulder_center = (np.array(keypoints[L_SHOULDER]) + np.array(keypoints[R_SHOULDER])) / 2

    # 脊柱倾斜角度
    spine_vector = shoulder_center - hip_center
    vertical = np.array([0, -1])  # 图像坐标系，y 向下
    angles['spine_tilt'] = calculate_angle(
        shoulder_center, hip_center, hip_center + vertical * 100)

    return angles
```

### 挥杆阶段检测

```python
class SwingPhaseDetector:
    """基于姿态特征的挥杆阶段检测"""

    PHASES = ['address', 'backswing', 'top', 'downswing', 'impact', 'follow']

    def __init__(self):
        self.prev_wrist_y = None
        self.wrist_velocities = []

    def detect_phase(self, keypoints, timestamp):
        """检测当前挥杆阶段"""
        # 提取关键点
        left_wrist = keypoints[9]
        right_wrist = keypoints[10]
        left_hip = keypoints[11]

        # 计算手腕高度相对于髋部
        wrist_height = (left_wrist[1] + right_wrist[1]) / 2 - left_hip[1]

        # 计算速度
        if self.prev_wrist_y is not None:
            velocity = wrist_height - self.prev_wrist_y
            self.wrist_velocities.append(velocity)

        self.prev_wrist_y = wrist_height

        # 基于规则的阶段判断
        if len(self.wrist_velocities) < 3:
            return 'address'

        avg_velocity = np.mean(self.wrist_velocities[-3:])

        if avg_velocity < -5:  # 向上移动 (图像坐标 y 向下)
            return 'backswing'
        elif avg_velocity > 5:  # 向下移动
            if wrist_height > 0:  # 手腕高于髋部
                return 'downswing'
            else:
                return 'follow'
        else:
            if wrist_height < -50:  # 手腕在最高点
                return 'top'
            elif abs(wrist_height) < 10:
                return 'impact'
            else:
                return 'address'
```

---

## 技术规格

### 硬件要求

| 平台 | 最低配置 | 推荐配置 | 帧率 |
|-----|---------|---------|-----|
| **iOS** | A12 | A14+ | 30+ FPS |
| **Android** | Snapdragon 730 | Snapdragon 870+ | 30+ FPS |
| **桌面** | Core i5 | Core i7 + GPU | 60+ FPS |

### 摄像头规格

| 参数 | 推荐值 | 说明 |
|-----|-------|------|
| **分辨率** | 1080p | 足够姿态估计 |
| **帧率** | 60 FPS | 捕捉快速挥杆 |
| **视角** | 广角 | 全身入镜 |
| **快门** | 全局/高速 | 减少运动模糊 |

### 拍摄建议

```text
┌─────────────────────────────────────────────────────────────┐
│                    高尔夫挥杆拍摄布局                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     视角 1: 正面 (Face-On)                                  │
│     ┌──────────────────────┐                                │
│     │      📷              │  距离: 3-5m                    │
│     │       │              │  高度: 1m (腰部高度)           │
│     │       │              │  用途: 重心转移、髋旋转        │
│     │       ▼              │                                │
│     │      🏌️              │                                │
│     └──────────────────────┘                                │
│                                                             │
│     视角 2: 后方 (Down-the-Line)                            │
│     ┌──────────────────────┐                                │
│     │  🏌️ ←────── 📷       │  距离: 3-5m                    │
│     │                      │  高度: 1m                      │
│     │                      │  用途: 挥杆平面、杆头路径      │
│     └──────────────────────┘                                │
│                                                             │
│     光线: 均匀照明，避免背光                                 │
│     背景: 简洁单色背景最佳                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 供应商信息

### SDK/API 提供商

| 提供商 | 产品 | 价格 | 特点 |
|-------|------|------|-----|
| **MMPose** | RTMPose | 免费开源 | 高精度 |
| **Google** | MediaPipe | 免费 | 跨平台 |
| **Sency AI** | Movement SDK | 免费层 | 运动分析 |
| **LightBuzz** | Pose AI | $0.01/次 | 健身专用 |

### 硬件供应商

| 供应商 | 产品 | 价格 | 用途 |
|-------|------|------|-----|
| **GoPro** | Hero 12 | $400 | 高帧率 |
| **Insta360** | One RS | $300 | 360° |
| **Intel** | RealSense | $200+ | 深度相机 |

详细供应商信息请参见 [视觉方案竞品](../../product/market-landscape/competitors/vision-based.md)

---

## 相关资源

- [姿态估计指南](../vision/software.md)
- [ADR-0006: ONNX Runtime 部署](../../design/decisions/0006-onnx-runtime-deployment.md)
- [视觉方案竞品](../../product/market-landscape/competitors/vision-based.md)

---

**最后更新**: 2025 年 12 月 12 日
