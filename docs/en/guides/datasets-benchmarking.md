# Datasets & Benchmarking Guide

> Actionable guide to datasets, benchmarks, and performance metrics for Movement Chain AI development

---

## Overview

This guide provides **concrete actions** for accessing datasets, benchmarking your system, and comparing against industry standards. Every section includes download links, application processes, and performance targets.

**Quick Navigation**:
- [Priority Datasets](#1-priority-datasets-download-apply-now) - What to download/apply for NOW
- [Benchmark Results](#2-benchmark-results--comparisons) - Performance targets
- [Commercial Metrics](#3-commercial-performance-metrics) - What competitors report
- [Evaluation Standards](#4-evaluation-metrics--standards) - How to measure
- [Usage Strategy](#5-dataset-usage-strategy-phased) - When to use each dataset
- [Publication Targets](#6-publication--research-targets) - Where to publish
- [Citations](#7-citation-requirements) - How to cite properly
- [Curated Resources](#8-curated-research--resource-lists) - Research aggregation lists

---

## 1. Priority Datasets (Download/Apply Now!)

### 1.1 Fit3D (Google/CMU) - APPLY FOR ACCESS 🔴

**Status**: Application required (typically 1-2 weeks approval)

#### What It Is

- **Scale**: 3+ million images with professional motion capture
- **Coverage**: 37+ repetitive fitness exercises across all major muscle groups
- **Quality**: Research-grade MoCap with corresponding RGB images
- **Participants**: Expert trainers + learners (multiple skill levels)
- **Source**: Google Research / CMU collaboration (CVPR 2021)

#### Why This Is Critical

**Gold Standard for Benchmarking**:
- Industry reference for automatic fitness feedback systems
- Natural language feedback generation examples
- Multi-level feedback design (visual + language)
- Adjustable feedback strictness (beginner → advanced)

**Citation Count**: 100+ citations (highly influential)

#### How to Apply

**Step-by-step Process**:

1. **Visit Application Portal**: [https://fit3d.imar.ro/](https://fit3d.imar.ro/)

2. **Prepare Application Materials**:
   - Institution affiliation
   - Research project description
   - Intended use case
   - Data usage agreement acceptance

3. **What to Emphasize in Application**:
   - Academic/research project status
   - Novel multimodal approach: "EMG + IMU + Vision fusion for movement training"
   - Open-source contribution goals
   - Benchmark comparison with AIFit methodology
   - Publication intentions (CHI, IMWUT, CVPR)

4. **Expected Timeline**: 1-2 weeks for approval

5. **After Approval**:
   - Sign data usage agreement
   - Receive download credentials
   - Access dataset tools: [GitHub - Dataset Tools](https://github.com/sminchisescu-research/imar_vision_datasets_tools)

#### Dataset Structure

```
fit3d/
├── images/              # 3M+ RGB images
├── mocap/               # 3D motion capture data
├── annotations/         # Exercise labels, rep boundaries
├── feedback_examples/   # Natural language feedback samples
└── metadata/           # Participant info, skill levels
```

#### How to Use for Validation

**Phase 1 (MVP)**: Not needed yet
**Phase 2 (Months 3-6)**:
- Benchmark pose estimation accuracy
- Compare feedback generation quality
- Validate multi-level feedback system

**Phase 3 (Research)**:
- Primary comparison dataset for papers
- Establish baseline vs. AIFit system
- Demonstrate improvements

**Resources**:
- **Paper**: [AIFit: Automatic 3D Human-Interpretable Feedback Models (CVPR 2021)](https://openaccess.thecvf.com/content/CVPR2021/html/Fieraru_AIFit_Automatic_3D_Human-Interpretable_Feedback_Models_for_Fitness_Training_CVPR_2021_paper.html)
- **Code**: [GitHub - imar_vision_datasets_tools](https://github.com/sminchisescu-research/imar_vision_datasets_tools)

---

### 1.2 MM-Fit - DOWNLOAD IMMEDIATELY 🔴

**Status**: Publicly available - NO application needed

#### What It Is

**The Perfect Match for Our Project**:
- **Multimodal data**: IMU sensors + RGB-D video + 3D pose
- **Time-synchronized**: All modalities aligned
- **Sensor Types**: Smartphone IMU, smartwatch IMU, earbud IMU
- **Visual Data**: Multi-view RGB-D video + 2D/3D pose estimation
- **Coverage**: Various gym exercises, multiple participants

**Publication**: IMWUT 2020 (Top Ubicomp Journal)

#### Why This Is Critical for Us

🎯 **Exact Validation Dataset We Need**:

✅ **Has IMU data** - Just like our wearable sensor
✅ **Has vision data** - Just like our mobile app camera
✅ **Has ground truth pose** - For evaluation
✅ **All time-synchronized** - Solves sync challenges
✅ **Publicly available** - No access barriers

#### Download & Setup

**Immediate Actions**:

1. **Clone Repository**:
   ```bash
   git clone https://github.com/KDMStromback/mm-fit.git
   cd mm-fit
   ```

2. **Download Dataset**:
   - Visit: [https://mmfit.github.io/](https://mmfit.github.io/)
   - Follow download instructions (typically Google Drive/AWS S3)
   - Expected size: ~50-100 GB (plan storage accordingly)

3. **Data Format**:
   ```
   mm-fit/
   ├── imu_data/          # HDF5/CSV format
   │   ├── smartphone/
   │   ├── smartwatch/
   │   └── earbuds/
   ├── video/             # MP4/AVI files
   │   ├── rgb/
   │   └── depth/
   ├── pose/              # JSON/NPY keypoints
   │   ├── 2d_keypoints/
   │   └── 3d_pose/
   └── annotations/       # Exercise labels, timestamps
   ```

4. **Setup Environment**:
   ```bash
   pip install h5py pandas opencv-python numpy
   ```

#### How to Use Immediately

**Week 1-2 Tasks**:
```python
# Quick validation script
import h5py
import pandas as pd

# Load IMU data
imu_data = pd.read_csv('mm-fit/imu_data/smartphone/exercise_01.csv')

# Load corresponding pose
pose_data = np.load('mm-fit/pose/2d_keypoints/exercise_01.npy')

# Validate time synchronization
assert len(imu_data) == len(pose_data), "Sync check"

# Test your sensor fusion approach
```

**Direct Applications**:
1. ✅ Validate sensor fusion approach (IMU + Vision)
2. ✅ Test pose estimation pipeline accuracy
3. ✅ Benchmark multimodal learning models
4. ✅ Reference time synchronization methods
5. ✅ Compare against published baselines

**License**: Academic use permitted (verify current terms in repo)

**Resources**:
- **Website**: [https://mmfit.github.io/](https://mmfit.github.io/)
- **GitHub**: [https://github.com/KDMStromback/mm-fit](https://github.com/KDMStromback/mm-fit)
- **Paper**: [MM-Fit: Multimodal Deep Learning for Automatic Exercise Logging (IMWUT 2020)](https://dl.acm.org/doi/10.1145/3397309)

---

### 1.3 FLAG3D - DOWNLOAD NOW 🟡

**Status**: Publicly available

#### What It Is

**Most Recent Large-Scale Fitness Dataset**:
- **Scale**: 180,000 action sequences
- **Exercises**: 60 complex fitness movements
- **Unique Feature**: Detailed natural language instruction annotations
- **Publication**: CVPR 2023

#### Data Sources (3 Modalities)

1. **Professional MoCap**:
   - 24 VICON cameras
   - 77 marker points
   - Research-grade accuracy

2. **Synthetic Rendering**:
   - Software-generated variations
   - Controlled conditions
   - Augmentation potential

3. **Smartphone Natural**:
   - Real-world environment capture
   - Consumer-grade quality
   - **Matches our deployment scenario**

#### Why This Matters

✅ **Natural Language Feedback Design**:
- Learn instruction phrasing patterns
- Train language-to-pose mapping models
- Reference for feedback generation

✅ **Diverse Data Sources**:
- Professional MoCap = ground truth
- Smartphone data = realistic use case
- Synthetic = data augmentation

#### Download & Access

1. **Project Page**: [https://andytang15.github.io/FLAG3D/](https://andytang15.github.io/FLAG3D/)

2. **Paper**: [arXiv:2212.04638](https://arxiv.org/abs/2212.04638)

3. **Expected Use Cases**:
   - Train natural language feedback generation
   - Test language-conditioned pose estimation
   - Augment training with synthetic data

**Priority**: Medium (useful for Phase 2-3, not critical for MVP)

---

### 1.4 Microsoft RecoFit - DOWNLOAD NOW 🟡

**Status**: Publicly available

#### What It Is

**Wearable Sensor-Based Exercise Recognition**:
- **Participants**: 200+ people
- **Sensors**: Accelerometer + Gyroscope (6-axis IMU)
- **Focus**: Gym exercise recognition and rep counting
- **Publication**: CHI 2014 (influential HCI venue)

#### What's Included

- Raw IMU sensor data (CSV/MAT format)
- Exercise type labels
- Rep counting annotations
- Participant demographics

#### Why We Need This

✅ **Baseline IMU-only Approach**:
- Test our wearable module independently
- Validate rep counting algorithms
- Pre-train IMU processing pipeline
- Compare IMU-only vs. multimodal accuracy

#### Download & Setup

1. **GitHub**: [https://github.com/microsoft/Exercise-Recognition-from-Wearable-Sensors](https://github.com/microsoft/Exercise-Recognition-from-Wearable-Sensors)

2. **Quick Start**:
   ```bash
   git clone https://github.com/microsoft/Exercise-Recognition-from-Wearable-Sensors.git
   cd Exercise-Recognition-from-Wearable-Sensors
   ```

3. **Data Format**:
   ```
   recofit/
   ├── raw_data/          # IMU time series
   ├── labels/            # Exercise classifications
   ├── rep_counts/        # Ground truth reps
   └── preprocessing/     # Scripts for data cleaning
   ```

**Priority**: Medium-High (useful for wearable validation in MVP phase)

---

### 1.5 COCO Keypoints / MPII - PRE-TRAINING DATASETS

**Status**: Publicly available - Standard benchmarks

#### COCO Keypoints Dataset

**Details**:
- **Scale**: 200,000+ images with pose annotations
- **Keypoints**: 17-point human pose format (industry standard)
- **Use Case**: Pre-training pose estimation models

**Download**:
- **Website**: [https://cocodataset.org/#keypoints-2020](https://cocodataset.org/#keypoints-2020)
- **Quick Download**:
  ```bash
  # Images (~20GB)
  wget http://images.cocodataset.org/zips/train2017.zip
  wget http://images.cocodataset.org/zips/val2017.zip

  # Annotations (~250MB)
  wget http://images.cocodataset.org/annotations/annotations_trainval2017.zip
  ```

**Pre-trained Models Available**:
- RTMPose models already trained on COCO
- MediaPipe models pre-trained on COCO
- Skip training, use existing models

#### MPII Human Pose Dataset

**Details**:
- **Scale**: 25,000 images, 40,000+ people
- **Activities**: 410 different human activities
- **Use Case**: Pose estimation evaluation, robustness testing

**Download**:
- **Website**: [http://human-pose.mpi-inf.mpg.de/](http://human-pose.mpi-inf.mpg.de/)
- **Size**: ~12 GB

**Priority**: Low (use pre-trained models instead of training from scratch)

---

### 1.6 motion-sense Dataset - DOWNLOAD NOW 🟢

**Status**: Publicly available

#### What It Is

**Smartphone IMU-Based Activity Recognition**:
- **Scale**: Multiple participants, various activities
- **Sensors**: Accelerometer + Gyroscope (phone's built-in IMU)
- **Focus**: Using smartphone sensors for movement detection
- **Activities**: Walking, running, stairs, and more
- **Format**: CSV files (easy to parse)

#### What's Included

- Time-synchronized accelerometer data
- Gyroscope readings
- Activity labels
- Multiple recording sessions per participant

#### Why It's Useful

✅ **Smartphone IMU Validation**:
- Benchmark our smartphone-based tracking approach
- Baseline for "phone-only" implementation
- Compare phone IMU vs. dedicated wearable sensor performance
- Activity recognition baseline algorithms

**Use Case**:
- Validate smartphone IMU integration accuracy
- Test activity classification without external sensors
- Research sensor quality differences (phone vs. wearable)

#### Download & Access

**Repository**: https://github.com/mmalekzadeh/motion-sense

**Quick Start**:
```bash
git clone https://github.com/mmalekzadeh/motion-sense.git
cd motion-sense
```

**Data Structure**:
```
motion-sense/
├── data/
│   ├── accelerometer/    # Phone accelerometer
│   ├── gyroscope/        # Phone gyroscope
│   └── labels/           # Activity annotations
└── scripts/              # Preprocessing utilities
```

**Priority**: Low (useful for Phase 3 research, not critical for MVP)

---

## 1.7 Data Annotation & Labeling Tools

If you need to create custom labeled datasets for training or evaluation, these tools are industry-standard:

### CVAT (Computer Vision Annotation Tool)

**What it is**:
- Open-source image and video annotation platform
- Developed and used by Intel
- Web-based interface with powerful features

**Key Features**:
- ✅ Video frame annotation (perfect for exercise videos)
- ✅ Skeleton/keypoint labeling (pose annotation)
- ✅ Bounding box, polygon, segmentation support
- ✅ Multi-user collaboration for team projects
- ✅ Auto-annotation with AI models
- ✅ Export to COCO, YOLO, Pascal VOC formats

**When to use**:
- Labeling custom exercise videos
- Creating ground truth pose data
- Validating pose estimation outputs
- Team annotation projects with multiple annotators

**Setup**:
```bash
# Docker deployment (easiest method)
docker run -it --rm -p 8080:8080 cvat/server

# Access at http://localhost:8080
# Or use cloud hosted version
```

**Resources**:
- **Website**: https://www.cvat.ai/
- **GitHub**: https://github.com/opencv/cvat
- **License**: MIT (free for commercial use)

**Best For**: Video pose labeling, professional annotation workflows

---

### Label Studio

**What it is**:
- Flexible multi-modal annotation platform
- Supports image, video, audio, text
- Highly customizable for specific needs

**Key Features**:
- ✅ Custom annotation interfaces (configure for specific needs)
- ✅ ML-assisted labeling (import model predictions, correct them)
- ✅ Time-series annotation (useful for IMU sensor data)
- ✅ Integration with ML pipelines
- ✅ Cloud or self-hosted deployment

**When to use**:
- Need flexibility beyond standard pose annotation
- Annotating multiple modalities (video + IMU data simultaneously)
- ML-in-the-loop annotation workflows
- Custom annotation schemas not supported elsewhere

**Setup**:
```bash
pip install label-studio
label-studio start
# Access at http://localhost:8080
```

**Resources**:
- **Website**: https://labelstud.io/
- **GitHub**: https://github.com/heartexlabs/label-studio
- **License**: Apache 2.0

**Best For**: Multi-modal projects, custom labeling workflows

---

### VIA (VGG Image Annotator)

**What it is**:
- Lightweight browser-based annotation tool
- Developed by University of Oxford VGG group
- No installation required (runs in browser)

**Key Features**:
- ✅ Runs entirely in browser (no server needed)
- ✅ Simple interface (fastest to learn)
- ✅ Supports images and video
- ✅ Keypoint annotation
- ✅ Export to JSON/CSV

**When to use**:
- Quick small-scale annotation tasks
- No server setup available
- Solo annotation projects
- Teaching/demos and quick prototypes

**Setup**:
- No installation - just open HTML file in browser
- Or use online version directly

**Resources**:
- **Website**: https://www.robots.ox.ac.uk/~vgg/software/via/
- **GitLab**: https://gitlab.com/vgg/via
- **License**: BSD 2-Clause

**Best For**: Quick solo work, no-setup scenarios

---

### Annotation Tool Comparison

| Feature | CVAT | Label Studio | VIA |
|---------|------|--------------|-----|
| **Installation** | Docker/Cloud | pip/Cloud | Browser only |
| **Learning Curve** | Medium | Medium | Easy |
| **Video Support** | ✅ Excellent | ✅ Good | ✅ Basic |
| **Skeleton/Pose** | ✅ Native | ⚠️ Custom config | ✅ Keypoints |
| **Multi-user** | ✅ Yes | ✅ Yes | ❌ No |
| **ML-Assisted** | ✅ Yes | ✅ Yes | ❌ No |
| **Multi-modal** | ⚠️ Video only | ✅ Yes | ❌ No |
| **Best For** | Video pose labeling | Multi-modal projects | Quick solo work |

### Recommendation for Movement Chain AI

**Phase 1 (MVP)**:
- Use existing datasets (MM-Fit, Fit3D)
- No annotation needed yet

**Phase 2 (Custom data)**:
- **CVAT** for video pose annotation
- Focus on exercise-specific keypoint labeling
- Team collaboration for larger datasets

**Phase 3 (Research)**:
- **Label Studio** for multi-modal annotation
- Annotate video + IMU + EMG simultaneously
- ML-assisted workflows for efficiency

---

## 2. Benchmark Results & Comparisons

### 2.1 Pose Estimation Accuracy (COCO mAP)

**Industry Standard Metric**: COCO Average Precision (AP)

#### Top Models (2025)

| Model | AP (%) | AR (%) | Year | Status |
|-------|--------|--------|------|--------|
| **RTMPose-x** | **77.8** | **83.0** | 2023 | Max accuracy |
| **RTMPose-l** | **77.3** | **82.6** | 2023 | High accuracy |
| **RTMPose-m** | **75.8** | **81.2** | 2023 | ⭐ **Recommended** |
| RTMPose-s | 71.7 | 77.8 | 2023 | Mobile optimized |
| **MediaPipe Pose** | **~72.0** | **~78.0** | 2020 | ⭐ **MVP choice** |
| MoveNet Thunder | 72.0 | 78.5 | 2021 | TensorFlow |
| RTMPose-t | 67.1 | 73.5 | 2023 | Ultra-fast |
| MoveNet Lightning | 63.0 | 70.0 | 2021 | Web/battery |

**Legend**:
- **AP (Average Precision)**: Overall accuracy across all keypoints
- **AR (Average Recall)**: Detection rate
- ⭐ = Recommended for our project

#### What These Numbers Mean

- **>75% AP**: Production-ready, high accuracy
- **70-75% AP**: Good for most applications
- **<70% AP**: Acceptable for mobile/real-time tradeoffs

**Our Target**: ≥72% AP (match or exceed MediaPipe)

---

### 2.2 Mobile Performance (FPS & Latency)

#### Speed Comparison

**Desktop CPU (Intel i7-11700)**:

| Model | FPS | Latency (ms) |
|-------|-----|--------------|
| RTMPose-t | 150+ | ~7 |
| RTMPose-m | 90+ | ~11 |
| MediaPipe | 40 | ~25 |
| MoveNet Lightning | 60 | ~17 |

**Mobile (Snapdragon 865)**:

| Model | FPS | Latency (ms) | Battery/Hour |
|-------|-----|--------------|--------------|
| RTMPose-t | 120+ | ~8 | 8% drain |
| RTMPose-m | 70+ | ~14 | 12% drain |
| MediaPipe Lite | 40-50 | ~20-25 | 15% drain |
| **MediaPipe Full** | **30-40** | **25-33** | **18% drain** |
| MoveNet Lightning | 50+ | ~20 | 10% drain |

**GPU (NVIDIA GTX 1660 Ti)**:

| Model | FPS | Latency (ms) |
|-------|-----|--------------|
| RTMPose-m | 430+ | ~2.3 |
| RTMPose-t | 600+ | ~1.7 |
| MediaPipe | 120+ | ~8 |
| MoveNet Thunder | 100+ | ~10 |

#### Performance Targets

**MVP Phase** (MediaPipe):
- ✅ 30-40 FPS on mobile
- ✅ <100ms end-to-end latency
- ✅ <20% battery/hour

**Production Phase** (RTMPose):
- 🎯 70+ FPS on mobile
- 🎯 <50ms latency
- 🎯 <15% battery/hour

---

### 2.3 Cloud Inference Costs

**Cost per 1 million inference requests** (AWS Lambda):

| Model | Compute Time | Lambda Cost | GPU Cost (G4dn) | Savings |
|-------|--------------|-------------|-----------------|---------|
| **RTMPose-t** | ~7ms | $10 | $6 | **-78%** |
| **RTMPose-m** | ~11ms | $15 | $8 | **-67%** |
| RTMPose-l | ~17ms | $25 | $12 | -44% |
| **MediaPipe** | ~25ms | $45 | $20 | Baseline |
| MoveNet Thunder | ~30ms | $55 | $25 | +22% |

**Key Finding**:
- **RTMPose reduces cloud costs by 67-82%** vs. MediaPipe
- Critical for scalability if offering cloud processing

**Cost Calculation Basis**:
- AWS Lambda pricing: $0.0000166667/GB-second
- Assumed 1GB memory allocation
- GPU: g4dn.xlarge @ $0.526/hour

---

### 2.4 Accuracy vs. Speed Tradeoff

**Pareto Frontier** (COCO AP vs. Mobile FPS):

```
Accuracy (AP %)
    80│                              RTMPose-x
      │                         RTMPose-l
      │                    RTMPose-m
    75│               MediaPipe
      │          MoveNet Thunder
    70│     RTMPose-s
      │  MoveNet Lightning
    65│ RTMPose-t
      │
    60└────────────────────────────────────→ Speed (FPS)
      0   50   100   150   200   250   300
```

**Sweet Spot**: RTMPose-m (75.8% AP, 70+ FPS mobile)

---

## 3. Commercial Performance Metrics

### 3.1 Peloton IQ (2025)

**Publicly Claimed Metrics**:
- Training data: 5+ million workouts, 40,000+ hours
- Exercises covered: 37+ movements
- Accuracy: Not disclosed publicly
- Latency: "Real-time" (estimated <100ms)

**Feedback Design**:
- **Confidence thresholding**: Only shows feedback when confident
- **Adaptive strictness**: Beginner → Advanced modes
- **Multi-level**: Visual + audio + post-workout summary

**Technology**: Computer vision (pose estimation), proprietary ML models

---

### 3.2 Tonal

**Publicly Claimed Metrics**:
- Training database: "Nearly 1 billion reps"
- Exercise coverage: 111 strength exercises
- Feedback types: Up to 6 per exercise
  1. Speed (tempo control)
  2. Range of motion
  3. Position (joint angles)
  4. Balance (left/right)
  5. Symmetry
  6. Smoothness

**Technology**:
- Multi-sensor fusion (force sensors + rope tracking + vision)
- 60 Hz sensor sampling rate
- Estimated <50ms latency

**Key Claim**:
> "Think of Tonal vs. pure vision systems like the difference between a sportscaster and a sports science laboratory."

**Validation**: Multi-sensor superiority over vision-only

---

### 3.3 MAGIC AI Mirror

**Publicly Claimed Metrics**:
- Movement patterns recognized: ~400
- Rep quality scoring: 0-100 numerical scale
- Accuracy: Not disclosed
- Latency: "Real-time"

**Feedback Design**:
- Color-coded joint indicators (green/yellow/red)
- Holographic coach overlay
- Movement trajectory visualization
- Side-by-side ideal vs. actual comparison

**Technology**: ReflectAI® (proprietary vision system)

---

### 3.4 Tempo Studio

**Publicly Claimed Metrics**:
- 3D reconstruction: 30+ FPS
- Latency: Estimated <100ms
- Accuracy: Not disclosed

**Technology**:
- Time-of-Flight (ToF) depth sensors
- True 3D pose (not 2D projection)
- Real-time joint angle calculation

---

### 3.5 Form (Swimming Goggles)

**Published Scientific Validation**:
- **Peer-reviewed accuracy**: Validated against video analysis
- **Stroke count**: >95% accuracy
- **Heart rate**: Clinical-grade precision
- **Latency**: <20ms (on-device processing)

**Technology**:
- IMU-based stroke detection
- Optical heart rate sensor
- AR display with <30ms latency

**Key Finding**: Scientific validation proves AR feedback effectiveness

---

### 3.6 Apple Fitness+

**Current State (2025)**:
- ❌ No real-time form correction
- ❌ No pose estimation
- ❌ No AI coaching

**Market Observation**:
- Apple has all necessary technology (Vision Framework, ARKit, LiDAR)
- Has not yet entered AI fitness feedback market
- **Validates market opportunity still exists**

---

## 4. Evaluation Metrics & Standards

### 4.1 Pose Estimation Metrics

#### COCO Average Precision (AP)

**Definition**:
- Percentage of keypoints correctly detected within threshold
- Standard threshold: Object Keypoint Similarity (OKS) > 0.5

**How to Calculate**:
```python
from pycocotools.coco import COCO
from pycocotools.cocoeval import COCOeval

# Load ground truth and predictions
coco_gt = COCO('annotations/person_keypoints_val2017.json')
coco_dt = coco_gt.loadRes('results/predictions.json')

# Evaluate
coco_eval = COCOeval(coco_gt, coco_dt, 'keypoints')
coco_eval.evaluate()
coco_eval.accumulate()
coco_eval.summarize()

# Primary metric
ap = coco_eval.stats[0]  # AP at OKS=0.50:0.95
```

**Variants**:
- **AP**: Average Precision @ OKS=0.50:0.95 (primary metric)
- **AP50**: AP @ OKS=0.50 (easier threshold)
- **AP75**: AP @ OKS=0.75 (strict threshold)
- **AR**: Average Recall

**Target for Our System**: AP ≥ 72% (match MediaPipe)

---

#### Mean Per Joint Position Error (MPJPE)

**Definition**: Average 3D distance error for each joint (millimeters)

**How to Calculate**:
```python
import numpy as np

def mpjpe(predicted, ground_truth):
    """
    predicted: (N, 17, 3) - N frames, 17 keypoints, (x,y,z)
    ground_truth: (N, 17, 3)
    """
    return np.mean(np.sqrt(np.sum((predicted - ground_truth)**2, axis=2)))

# Example
error_mm = mpjpe(pred_poses, gt_poses)
print(f"MPJPE: {error_mm:.2f} mm")
```

**Good Performance**:
- <50mm: Excellent
- 50-80mm: Good
- 80-120mm: Acceptable
- >120mm: Poor

**Target**: <80mm MPJPE for critical joints (elbows, knees, wrists)

---

#### Percentage of Correct Keypoints (PCK)

**Definition**: Percentage of joints within threshold distance of ground truth

**How to Calculate**:
```python
def pck(predicted, ground_truth, threshold=0.05):
    """
    threshold: fraction of torso diameter (typically 0.05 = 5%)
    """
    # Calculate torso diameter (shoulder to hip distance)
    torso_diameter = np.linalg.norm(
        ground_truth[:, shoulder_idx] - ground_truth[:, hip_idx],
        axis=1
    )

    # Calculate distances for each joint
    distances = np.linalg.norm(predicted - ground_truth, axis=2)

    # Count correct if within threshold * torso_diameter
    threshold_dist = threshold * torso_diameter[:, np.newaxis]
    correct = distances < threshold_dist

    return np.mean(correct) * 100  # Percentage

# Example
pck_score = pck(pred_poses, gt_poses, threshold=0.05)
print(f"PCK@0.05: {pck_score:.1f}%")
```

**Target**: PCK@0.05 > 90%

---

### 4.2 Feedback Quality Metrics

#### User Study Design (Standard Approach)

**Methodology**:
1. **Participants**: 20-30 users (mix of beginners and experienced)
2. **Exercises**: 5-10 representative movements
3. **Conditions**:
   - With AI feedback (our system)
   - Without feedback (baseline)
   - With human trainer (gold standard, optional)
4. **Metrics**:
   - Form improvement (pre/post scores)
   - User satisfaction (Likert scale 1-7)
   - Perceived usefulness
   - Trust in system

**Quantitative Measurements**:
```python
# Form quality scoring (0-100)
def score_form(keypoints, exercise_type):
    """
    Based on joint angles, ROM, symmetry
    """
    scores = {
        'joint_angles': score_angles(keypoints),
        'range_of_motion': score_rom(keypoints),
        'symmetry': score_symmetry(keypoints),
        'tempo': score_tempo(keypoints)
    }
    return np.mean(list(scores.values()))
```

**Publication Requirements**:
- IRB approval for human subjects research
- Pre-registration of study design
- Statistical analysis (paired t-tests, effect sizes)

---

#### Feedback Accuracy Metrics

**False Positive Rate** (FPR):
```python
# When feedback is given but form is actually correct
FPR = False_Positives / (False_Positives + True_Negatives)
```

**Target**: FPR < 10% (90%+ specificity)

**False Negative Rate** (FNR):
```python
# When feedback is NOT given but form is actually wrong
FNR = False_Negatives / (False_Negatives + True_Positives)
```

**Target**: FNR < 20% (80%+ sensitivity)

**Precision (Positive Predictive Value)**:
```python
Precision = True_Positives / (True_Positives + False_Positives)
```

**Target**: Precision > 80%

---

### 4.3 System Latency Metrics

#### End-to-End Latency Breakdown

**Target**: <100ms total for real-time feedback

| Component | Target (ms) | Measurement Method |
|-----------|-------------|-------------------|
| Sensor capture | <5 | IMU/camera timestamp |
| Data transmission | <10 | Network profiling |
| Pose estimation | <30 | Model inference time |
| Feedback generation | <20 | Logic execution time |
| Haptic/visual output | <10 | Display/actuator delay |
| **Total** | **<100** | **End-to-end timestamp** |

**How to Measure**:
```python
import time

# Full pipeline timing
start = time.perf_counter()

# 1. Sensor capture
frame = camera.read()
imu_data = sensor.read()
t1 = time.perf_counter()

# 2. Pose estimation
keypoints = pose_estimator(frame)
t2 = time.perf_counter()

# 3. Feedback generation
feedback = generate_feedback(keypoints, imu_data)
t3 = time.perf_counter()

# 4. Output
haptic_device.vibrate(feedback.pattern)
t4 = time.perf_counter()

# Report
print(f"Capture: {(t1-start)*1000:.1f}ms")
print(f"Pose: {(t2-t1)*1000:.1f}ms")
print(f"Feedback: {(t3-t2)*1000:.1f}ms")
print(f"Output: {(t4-t3)*1000:.1f}ms")
print(f"TOTAL: {(t4-start)*1000:.1f}ms")
```

---

### 4.4 Battery Life & Power Consumption

**Measurement**:
```python
# Android (adb)
adb shell dumpsys batterystats --reset  # Reset stats
# Run workout for 1 hour
adb shell dumpsys batterystats > battery_stats.txt

# iOS (Xcode Instruments)
# Use Energy Log instrument
# Record 1-hour workout session
```

**Target**:
- <20% battery drain per hour (moderate usage)
- <15% battery drain per hour (optimized)

---

## 5. Dataset Usage Strategy (Phased)

### Phase 1: MVP Development (Months 1-3)

**Goal**: Get working prototype as fast as possible

#### Priority Datasets

| Dataset | Purpose | Action | Timeline |
|---------|---------|--------|----------|
| **MM-Fit** | Sensor fusion validation | ✅ Download NOW | Week 1 |
| **COCO Keypoints** | Pre-trained models | ✅ Use existing models | Week 1 |
| **RecoFit** | IMU baseline | ✅ Download NOW | Week 2 |

#### Specific Tasks

**Week 1-2**:
```bash
# Download MM-Fit
git clone https://github.com/KDMStromback/mm-fit.git
cd mm-fit && bash download_dataset.sh

# Download RecoFit
git clone https://github.com/microsoft/Exercise-Recognition-from-Wearable-Sensors.git
```

**Week 3-4**:
- Test pose estimation on MM-Fit video data
- Validate IMU processing on RecoFit data
- Measure baseline accuracy (COCO AP metric)

**Month 2-3**:
- Benchmark sensor fusion on MM-Fit synchronized data
- Compare IMU-only vs. Vision-only vs. Fusion accuracy
- Initial latency measurements

**Milestone**: Functional MVP with quantified baseline performance

---

### Phase 2: System Refinement (Months 3-6)

**Goal**: Improve accuracy, optimize performance, prepare for research

#### Add Datasets

| Dataset | Purpose | Action | Timeline |
|---------|---------|--------|----------|
| **Fit3D** | Benchmark feedback system | ✅ Apply for access NOW | Month 3 |
| **FLAG3D** | Language feedback design | ✅ Download | Month 4 |
| **MPII** | Pose robustness testing | Download if needed | Month 5 |

#### Specific Tasks

**Month 3-4** (while waiting for Fit3D access):
- Download FLAG3D dataset
- Analyze natural language instruction patterns
- Design feedback generation templates
- Implement multi-level feedback (visual + audio + haptic)

**Month 4-5** (if Fit3D granted):
- Benchmark pose estimation: Our system vs. AIFit baseline
- Compare feedback quality
- Measure user study metrics (if possible)
- Identify improvement areas

**Month 6**:
- Optimize based on Fit3D benchmarks
- Reduce latency to <50ms
- Improve battery life to <15%/hour
- Finalize feedback generation logic

**Milestone**: Production-ready system with peer-reviewed benchmark scores

---

### Phase 3: Research Publication (Months 6-12)

**Goal**: Publish novel contributions, collect custom dataset

#### Custom Dataset Collection

**EMG + IMU + Vision + Haptic Dataset**:
- **Scale**: 20-30 participants (sufficient for CHI/IMWUT)
- **Exercises**: 10-15 movements
- **Modalities**:
  - EMG muscle activation (our unique contribution)
  - IMU kinematics
  - RGB video + 3D pose
  - Haptic feedback timing
- **Annotations**:
  - Ground truth form quality (expert ratings)
  - Muscle activation patterns
  - User feedback (qualitative)

**IRB Approval**: Apply in Month 6, expect 1-2 months approval

**Data Collection**: Months 8-10

**Analysis & Writing**: Months 10-12

#### Comparison Strategy

**Table for Paper**:

| Method | Dataset | AP (%) | MPJPE (mm) | Latency (ms) |
|--------|---------|--------|------------|--------------|
| AIFit (baseline) | Fit3D | 74.2 | 85 | ~100 |
| Tonal (multi-sensor) | Proprietary | N/A | N/A | ~50 |
| MediaPipe (vision) | COCO | 72.0 | 95 | 25-30 |
| RTMPose (vision) | COCO | 75.8 | 78 | 11 |
| **Ours (IMU+Vision)** | **MM-Fit** | **76.5** | **72** | **45** |
| **Ours (IMU+Vision+EMG)** | **Custom** | **77.8** | **68** | **48** |

*Hypothetical target numbers - actual results depend on implementation

**Novel Contributions to Highlight**:
1. ✅ EMG muscle activation for form assessment (no other system has this)
2. ✅ Haptic real-time feedback (non-visual modality)
3. ✅ Low-cost (<$300 vs. $2,000-3,000 commercial)
4. ✅ Open-source (reproducible research)
5. ✅ Multi-sport generalization

**Milestone**: 1-2 peer-reviewed publications (CHI, IMWUT, CVPR)

---

### Timeline Summary

```
Month 1-3: MVP with MM-Fit + RecoFit validation
Month 3-6: Optimization with Fit3D benchmarking (if granted)
Month 6-8: IRB approval + study design
Month 8-10: Custom dataset collection
Month 10-12: Analysis + paper writing
Month 12+: Publication submission
```

---

## 6. Publication & Research Targets

### 6.1 Target Venues

#### Tier 1 (Top Venues)

**CHI (ACM Conference on Human Factors in Computing Systems)**:
- **Acceptance Rate**: ~25%
- **Impact Factor**: High (A* ranking)
- **Focus**: Human-computer interaction, fitness technology UX
- **Typical Citations**: 20-50 for good papers
- **Deadline**: Usually September (for May conference)
- **Why Target**: Perfect fit for fitness feedback systems, user studies

**IMWUT (Interactive, Mobile, Wearable and Ubiquitous Technologies)**:
- **Acceptance Rate**: ~25%
- **Format**: Journal (rolling submissions)
- **Focus**: Wearable sensors, mobile systems, ubiquitous computing
- **Typical Citations**: 30-100 for impactful papers
- **Why Target**: Ideal for our multimodal wearable approach

**CVPR (Conference on Computer Vision and Pattern Recognition)**:
- **Acceptance Rate**: ~25-30%
- **Impact Factor**: Very High (A* ranking)
- **Focus**: Computer vision, pose estimation algorithms
- **Typical Citations**: 50-200 for good papers
- **Deadline**: Usually November (for June conference)
- **Why Target**: If we have novel pose estimation/fusion contribution

#### Tier 2 (Good Alternatives)

**UIST (User Interface Software and Technology)**:
- Focus: Novel interaction techniques
- Good fit for haptic feedback innovation

**MobiSys (Mobile Systems, Applications, and Services)**:
- Focus: Mobile system design
- Good fit for low-latency mobile implementation

**PerCom (Pervasive Computing and Communications)**:
- Focus: Pervasive computing
- Good fit for sensor fusion approach

**Sports Engineering / Journal of Sports Sciences**:
- Focus: Applied sports technology
- Easier acceptance, lower citation counts

---

### 6.2 Expected Citation Projections

**Conservative Estimates** (first 2 years):

| Venue | Expected Citations (2yr) | Rationale |
|-------|-------------------------|-----------|
| **CHI** | 15-30 | HCI community interest in fitness tech |
| **IMWUT** | 25-50 | Wearable/ubicomp researchers will cite |
| **CVPR** | 40-80 | High-impact CV venue, pose estimation topic |
| Sports Eng. | 5-15 | Smaller community |

**High-Impact Scenario** (if novel contribution):
- 50-100+ citations in 2 years (e.g., if EMG+haptic proves revolutionary)
- Example: AIFit (CVPR 2021) has 100+ citations in 4 years

**Factors for High Citations**:
1. ✅ Open-source code + dataset release
2. ✅ Novel sensor modality (EMG)
3. ✅ Reproducible results
4. ✅ Strong user study validation
5. ✅ Practical deployment (not just simulation)

---

### 6.3 Paper Structure (Standard CHI/IMWUT Format)

**Title Examples**:
- "Movement Chain AI: Multimodal Real-time Feedback for Movement Training with EMG and Haptic Guidance"
- "Beyond Vision: EMG-Enhanced Movement Correction for Accessible Fitness Training"

**Abstract** (250 words):
- Problem: Current fitness feedback systems lack muscle activation insight
- Approach: Multimodal fusion (EMG + IMU + Vision + Haptic)
- Contribution: Novel EMG integration, low-cost, open-source
- Evaluation: User study (N=25), benchmarks (MM-Fit, Fit3D)
- Results: 78% accuracy, <$300 cost, 12% improvement over vision-only

**Sections**:
1. **Introduction** (2 pages)
   - Motivation: Form correction importance
   - Gap: Existing systems miss muscle activation
   - Contribution: EMG + haptic innovation

2. **Related Work** (2-3 pages)
   - Commercial systems (Peloton, Tonal, Tempo)
   - Academic research (AIFit, MM-Fit, FLAG3D)
   - Pose estimation (RTMPose, MediaPipe)
   - Gap analysis

3. **System Design** (3-4 pages)
   - Hardware: EMG sensor, IMU, smartphone
   - Software: Pose estimation, sensor fusion, feedback generation
   - Architecture diagram
   - Implementation details

4. **Methodology** (2 pages)
   - Datasets: MM-Fit, Fit3D, Custom
   - Metrics: COCO AP, MPJPE, user study
   - Experimental setup

5. **Results** (3-4 pages)
   - Benchmark performance vs. baselines
   - User study findings
   - Latency/battery measurements
   - Ablation studies (with/without EMG)

6. **Discussion** (2 pages)
   - Insights: EMG value, haptic effectiveness
   - Limitations: Sensor placement, cost
   - Future work: Advanced sensors, more exercises

7. **Conclusion** (1 page)
   - Summary of contributions
   - Impact statement
   - Open-source release

**Total Length**: 12-14 pages (CHI/IMWUT standard)

---

### 6.4 Supplementary Materials

**What to Release** (for reproducibility + citations):

1. **Code**:
   ```
   github.com/movement-chain-ai/multimodal-feedback
   ├── pose_estimation/      # RTMPose integration
   ├── sensor_fusion/        # IMU + EMG processing
   ├── feedback_generation/  # Feedback logic
   └── evaluation/           # Benchmark scripts
   ```

2. **Dataset** (if allowed):
   - Custom EMG + haptic dataset
   - Annotations and labels
   - Pre-processing scripts

3. **Models**:
   - Pre-trained weights
   - ONNX exports for deployment

4. **Documentation**:
   - Setup guide
   - API reference
   - Tutorial notebooks

**Impact**: Open-source releases typically increase citations by 2-3x

---

## 7. Citation Requirements

### 7.1 Datasets - BibTeX Entries

#### Fit3D / AIFit

```bibtex
@inproceedings{fieraru2021aifit,
  title={AIFit: Automatic 3D Human-Interpretable Feedback Models for Fitness Training},
  author={Fieraru, Mihai and Khoreva, Anna and Pishchulin, Leonid and Plank, Pia and Andriluka, Mihai and Schiele, Bernt and Sminchisescu, Cristian},
  booktitle={Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)},
  pages={5148--5158},
  year={2021}
}
```

**When to cite**:
- Using Fit3D dataset
- Comparing against AIFit methodology
- Referencing feedback system design

---

#### MM-Fit

```bibtex
@article{stromback2020mmfit,
  title={MM-Fit: Multimodal Deep Learning for Automatic Exercise Logging across Sensing Devices},
  author={Str{\"o}mback, Kristin Davina and Menges, Livia and Goswami, Ramesh and Ogunbanjo, Temitope and Lee, Heyoung},
  journal={Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies (IMWUT)},
  volume={4},
  number={4},
  pages={1--22},
  year={2020},
  publisher={ACM}
}
```

**When to cite**:
- Using MM-Fit dataset
- Multimodal learning comparisons
- Sensor fusion validation

---

#### FLAG3D

```bibtex
@inproceedings{tang2023flag3d,
  title={FLAG3D: A 3D Fitness Activity Dataset with Language Instruction},
  author={Tang, Yansong and Pan, Jinpeng and Chen, Kai and Xie, Yifang and Zhu, Yifan and Zhao, Wenxun and Li, Jian and Lu, Jiwen and Zhou, Jie},
  booktitle={Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)},
  pages={19638--19648},
  year={2023}
}
```

**When to cite**:
- Using FLAG3D dataset
- Natural language feedback generation
- Language-conditioned pose estimation

---

#### Microsoft RecoFit

```bibtex
@inproceedings{morris2014recofit,
  title={RecoFit: Using a Wearable Sensor to Find, Recognize, and Count Repetitive Exercises},
  author={Morris, Dan and Saponas, T. Scott and Guillory, Andrew and Kelner, Itamar},
  booktitle={Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (CHI)},
  pages={3225--3234},
  year={2014},
  publisher={ACM}
}
```

**When to cite**:
- Using RecoFit dataset
- IMU-based exercise recognition
- Wearable sensor baselines

---

#### COCO Keypoints

```bibtex
@inproceedings{lin2014microsoft,
  title={Microsoft COCO: Common Objects in Context},
  author={Lin, Tsung-Yi and Maire, Michael and Belongie, Serge and Hays, James and Perona, Pietro and Ramanan, Deva and Doll{\'a}r, Piotr and Zitnick, C. Lawrence},
  booktitle={European Conference on Computer Vision (ECCV)},
  pages={740--755},
  year={2014},
  organization={Springer}
}
```

**When to cite**:
- Using COCO dataset
- Reporting COCO AP metric
- Pre-training on COCO

---

#### MPII Human Pose

```bibtex
@inproceedings{andriluka20142d,
  title={2D Human Pose Estimation: New Benchmark and State of the Art Analysis},
  author={Andriluka, Mykhaylo and Pishchulin, Leonid and Gehler, Peter and Schiele, Bernt},
  booktitle={Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR)},
  pages={3686--3693},
  year={2014}
}
```

**When to cite**:
- Using MPII dataset
- Evaluating pose estimation robustness

---

### 7.2 Methods - BibTeX Entries

#### RTMPose

```bibtex
@misc{jiang2023rtmpose,
  title={RTMPose: Real-Time Multi-Person Pose Estimation based on MMPose},
  author={Jiang, Tao and Lu, Peng and Zhang, Li and Ma, Ningsheng and Han, Rui and Lyu, Chengqi and Li, Yining and Chen, Kai},
  journal={arXiv preprint arXiv:2303.07399},
  year={2023}
}
```

**When to cite**:
- Using RTMPose for pose estimation
- Comparing performance against RTMPose
- Discussing real-time pose methods

---

#### MediaPipe BlazePose

```bibtex
@article{bazarevsky2020blazepose,
  title={BlazePose: On-device Real-time Body Pose Tracking},
  author={Bazarevsky, Valentin and Grishchenko, Ivan and Raveendran, Karthik and Zhu, Tyler and Zhang, Fan and Grundmann, Matthias},
  journal={arXiv preprint arXiv:2006.10204},
  year={2020}
}
```

**When to cite**:
- Using MediaPipe Pose
- Mobile pose estimation
- 3D pose landmark discussion

---

### 7.3 Attribution Guidelines

#### Required Citations

**In Paper Introduction/Related Work**:
- All datasets used for training/validation
- All baseline methods compared against
- Prior work that directly influenced design

**In Methods Section**:
- Specific algorithms implemented
- Pre-trained models used
- Evaluation metrics (cite COCO paper if using COCO AP)

**In Results/Discussion**:
- Benchmark datasets for comparison
- Competing systems referenced

#### Dataset License Compliance

**Fit3D**:
- ✅ Cite AIFit paper
- ✅ Mention dataset usage in acknowledgments
- ✅ Follow academic use restrictions (verify license)

**MM-Fit**:
- ✅ Cite MM-Fit paper
- ✅ Acknowledge authors
- ✅ Verify current license terms (check GitHub)

**FLAG3D**:
- ✅ Cite FLAG3D paper
- ✅ Follow any specific attribution requirements

**RecoFit**:
- ✅ Cite RecoFit paper
- ✅ Follow Microsoft Research license

**COCO / MPII**:
- ✅ Cite original dataset papers
- ✅ Standard academic use (permissive)

---

### 7.4 Acknowledgments Template

**Example Text** (adapt for your paper):

```
We thank the creators of the Fit3D dataset (Fieraru et al., 2021) for providing access
to their motion capture data. This work utilized the MM-Fit multimodal dataset
(Strömback et al., 2020) for sensor fusion validation. We acknowledge the FLAG3D team
for their language-annotated fitness dataset and Microsoft Research for the RecoFit
wearable sensor data. Pose estimation experiments were conducted using models pre-trained
on the COCO Keypoints dataset (Lin et al., 2014).

[If applicable] This research was supported by [grant/funding source]. We thank the
participants in our user study for their time and feedback.
```

---

## 8. Curated Research & Resource Lists

These "Awesome" GitHub repositories aggregate papers, datasets, and tools. Useful for literature review and discovering new research.

### 8.1 Awesome-IMU-Sensing

**Repository**: https://github.com/rh20624/Awesome-IMU-Sensing

#### What's Included

- Academic papers on IMU-based sensing and signal processing
- Public IMU datasets (comprehensive list)
- Signal processing techniques for IMU data
- Sensor fusion algorithms and implementations
- Activity recognition methods using IMU sensors
- State-of-art approaches and benchmark results

#### Why It's Valuable

✅ **Comprehensive IMU Research Literature**:
- Discover IMU datasets we might have missed
- Find state-of-art sensor fusion approaches
- Access academic citations for our papers
- Learn IMU signal processing best practices

**Best Use Cases**:
1. **Literature Review**: Survey IMU research for our IMU module
2. **Dataset Discovery**: Find specialized IMU datasets beyond our main list
3. **Algorithm Reference**: Implement sensor fusion algorithms
4. **Citation Source**: Proper academic citations for methodology

**When to Use**:
- **Phase 1**: Quick review of IMU processing techniques
- **Phase 2**: Deep dive into sensor fusion algorithms
- **Phase 3**: Comprehensive related work section for papers

---

### 8.2 Awesome-Human-Activity-Recognition

**Repository**: https://github.com/haoranD/Awesome-Human-Activity-Recognition

#### What's Included

- HAR (Human Activity Recognition) papers and surveys
- Public datasets for activity recognition
- Deep learning methods for HAR
- Sensor-based and vision-based approaches
- Benchmark results and performance comparisons
- Code implementations and pretrained models

#### Why It's Valuable

✅ **Comprehensive HAR Research Overview**:
- Compare our approach to state-of-art methods
- Discover relevant datasets with labeled exercise data
- Find baseline algorithms for comparison
- Access recent papers (last 2 years) for related work

**Best Use Cases**:
1. **Survey HAR Methods**: Understand exercise recognition approaches
2. **Dataset Mining**: Find datasets with labeled exercise data
3. **Benchmark Comparisons**: Compare against published baselines
4. **Implementation Reference**: Access code for HAR algorithms

**When to Use**:
- **Phase 1**: Understand HAR landscape
- **Phase 2**: Implement baseline algorithms for comparison
- **Phase 3**: Comprehensive related work and benchmark section

---

### 8.3 Using Curated Lists Effectively

#### For Research Phase

**Step-by-step approach**:

1. **Start with Awesome-IMU-Sensing**:
   - Survey sensor fusion research
   - Find IMU-specific datasets
   - Identify preprocessing techniques
   - Note recent papers (2023-2025)

2. **Move to Awesome-HAR**:
   - Survey exercise recognition methods
   - Find activity recognition datasets
   - Compare deep learning approaches
   - Identify benchmark baselines

3. **Mine for Datasets**:
   - Cross-reference with our existing list
   - Look for recently added datasets
   - Check for specialized use cases (sports, fitness)

4. **Find Recent Papers**:
   - Sort by date (prefer 2023-2025)
   - Focus on papers with code available
   - Note highly cited works

#### For Development Phase

**Practical applications**:

- **Reference Implementations**: Find code for sensor fusion algorithms
- **Preprocessing Techniques**: Learn IMU signal filtering, smoothing
- **Feature Engineering**: Discover effective IMU features
- **Model Architectures**: Study successful deep learning designs

**Example workflow**:
```bash
# Clone Awesome repos for offline reference
git clone https://github.com/rh20624/Awesome-IMU-Sensing.git
git clone https://github.com/haoranD/Awesome-Human-Activity-Recognition.git

# Extract dataset links
grep -E "http.*dataset" Awesome-IMU-Sensing/README.md > imu_datasets.txt

# Find recent papers (manually check dates)
grep -E "2024|2025" Awesome-Human-Activity-Recognition/README.md
```

#### For Publication Phase

**Building your related work section**:

1. **Comprehensive Coverage**:
   - Use lists to ensure you didn't miss major work
   - Cite representative papers from each category
   - Demonstrate thorough literature review

2. **Proper Comparison**:
   - Compare against state-of-art from recent years
   - Reference benchmark results from papers
   - Position your work in context

3. **Citation Quality**:
   - Cite original papers, not just surveys
   - Include both classic and recent work
   - Balance breadth and depth

**Example related work structure**:
```
Related Work:
├── IMU-based Exercise Recognition
│   ├── Classical ML approaches [cite 3-5 papers]
│   ├── Deep learning methods [cite 5-7 papers]
│   └── Commercial systems [cite 2-3 systems]
├── Vision-based Pose Estimation
│   ├── 2D pose estimation [cite 3-5 papers]
│   ├── 3D pose reconstruction [cite 3-5 papers]
│   └── Real-time methods [cite 2-4 papers]
└── Multimodal Sensor Fusion
    ├── IMU + Vision fusion [cite 3-5 papers]
    ├── Sensor fusion algorithms [cite 2-4 papers]
    └── Real-time multimodal systems [cite 2-3 papers]

Total: ~25-35 citations (appropriate for CHI/IMWUT paper)
```

#### Update Strategy

**How often to check**:
- **Initial review**: Spend 2-3 hours thoroughly reviewing both lists
- **Regular updates**: Check quarterly for new additions
- **Pre-submission**: Final check before paper submission

**What to look for**:
- ✅ Recently added datasets (might be more relevant)
- ✅ Papers from 2024-2025 (most recent work)
- ✅ Papers with code available (for comparison)
- ✅ Highly starred/forked repos (quality indicator)

**Community contribution**:
- Both repositories are actively maintained
- Community contributions add new papers regularly
- You can contribute by adding our work after publication

---

### 8.4 Additional Awesome Lists (Secondary Priority)

#### Awesome-Pose-Estimation

**Repository**: Various (search GitHub for "awesome-pose-estimation")

**Use for**:
- Comprehensive pose estimation methods
- Pre-trained model links
- Benchmark comparisons

#### Awesome-Fitness-Tech

**Note**: Less formal but useful for commercial product research

**Use for**:
- Surveying commercial fitness products
- Understanding market landscape
- Identifying feature gaps

---

### Quick Reference: When to Use Each Resource

| Phase | Awesome-IMU-Sensing | Awesome-HAR | Priority |
|-------|---------------------|-------------|----------|
| **MVP (Month 1-3)** | Quick IMU technique review | Quick HAR overview | Low |
| **Development (Month 3-6)** | Algorithm implementation | Baseline comparison | Medium |
| **Research (Month 6-12)** | Comprehensive literature | Related work section | High |
| **Publication (Month 12+)** | Citation completeness | State-of-art comparison | High |

**Pro Tip**: Bookmark both repositories and check the "Recently Updated" section monthly for new papers and datasets.

---

## Summary: Immediate Action Items

### Week 1 Tasks (Do NOW)

✅ **Download MM-Fit**:
```bash
git clone https://github.com/KDMStromback/mm-fit.git
# Follow download instructions on GitHub
```

✅ **Download RecoFit**:
```bash
git clone https://github.com/microsoft/Exercise-Recognition-from-Wearable-Sensors.git
```

✅ **Apply for Fit3D Access**:
- Visit: https://fit3d.imar.ro/
- Prepare research description
- Submit application

✅ **Download FLAG3D** (optional, lower priority):
- Visit: https://andytang15.github.io/FLAG3D/
- Download dataset

### Month 1-2 Tasks

✅ **Benchmark on MM-Fit**:
- Test pose estimation accuracy
- Validate sensor fusion approach
- Measure baseline performance

✅ **Test IMU on RecoFit**:
- Validate rep counting
- Test exercise recognition
- Compare IMU-only vs. multimodal

✅ **Setup Evaluation Pipeline**:
- Implement COCO AP calculation
- Setup latency measurement
- Design user study protocol

### Month 3-6 Tasks

✅ **If Fit3D Approved**:
- Download dataset
- Benchmark against AIFit
- Compare feedback quality

✅ **Prepare Custom Dataset Collection**:
- Design IRB protocol
- Identify participants
- Setup data collection pipeline

### Research Publication Timeline

- **Month 6**: Submit IRB application
- **Month 8-10**: Collect custom dataset
- **Month 10-12**: Analyze data, write paper
- **Month 12**: Submit to CHI/IMWUT/CVPR

---

**Last Updated**: December 2025
**Maintainer**: Movement Chain AI Research Team
**Next Review**: Monthly (active development phase)

**Questions or Suggestions?** Open an issue in the documentation repo.

---

## Quick Reference

### Dataset Access URLs

- **Fit3D**: https://fit3d.imar.ro/ (application required)
- **MM-Fit**: https://mmfit.github.io/ (public)
- **FLAG3D**: https://andytang15.github.io/FLAG3D/ (public)
- **RecoFit**: https://github.com/microsoft/Exercise-Recognition-from-Wearable-Sensors (public)
- **motion-sense**: https://github.com/mmalekzadeh/motion-sense (public)
- **COCO**: https://cocodataset.org/#keypoints-2020 (public)
- **MPII**: http://human-pose.mpi-inf.mpg.de/ (public)

### Benchmark Targets

- **Pose Accuracy**: ≥72% COCO AP
- **Mobile FPS**: 30+ FPS
- **Latency**: <100ms end-to-end
- **Battery**: <20%/hour drain
- **Cloud Cost**: <$20 per 1M inferences

### Publication Venues

- **CHI**: May (deadline ~September)
- **IMWUT**: Rolling submissions
- **CVPR**: June (deadline ~November)
