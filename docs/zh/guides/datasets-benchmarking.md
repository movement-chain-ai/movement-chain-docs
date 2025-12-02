# Datasets & Benchmarking Guide 数据集与基准测试指南

> Actionable guide to datasets, benchmarks, and performance metrics for Movement Chain AI development
> Movement Chain AI开发的数据集、基准测试和性能指标可操作指南

---

## Overview 概述

This guide provides **concrete actions** for accessing datasets, benchmarking your system, and comparing against industry standards. Every section includes download links, application processes, and performance targets.

本指南提供访问数据集、对系统进行基准测试以及与行业标准比较的**具体行动**。每个部分都包含下载链接、申请流程和性能目标。

**Quick Navigation 快速导航**:

- [Priority Datasets 优先数据集](#1-priority-datasets-download-apply-now-优先数据集-立即下载申请) - What to download/apply for NOW 立即下载/申请的内容
- [Benchmark Results 基准测试结果](#2-benchmark-results--comparisons-基准测试结果与比较) - Performance targets 性能目标
- [Commercial Metrics 商业指标](#3-commercial-performance-metrics-商业性能指标) - What competitors report 竞争对手报告的内容
- [Evaluation Standards 评估标准](#4-evaluation-metrics--standards-评估指标与标准) - How to measure 如何测量
- [Usage Strategy 使用策略](#5-dataset-usage-strategy-phased-数据集使用策略-分阶段) - When to use each dataset 何时使用每个数据集
- [Publication Targets 发表目标](#6-publication--research-targets-发表与研究目标) - Where to publish 在哪里发表
- [Citations 引用](#7-citation-requirements-引用要求) - How to cite properly 如何正确引用
- [Curated Resources 精选资源](#8-curated-research--resource-lists-精选研究与资源列表) - Research aggregation lists 研究汇总列表

---

## 1. Priority Datasets (Download/Apply Now!) 优先数据集（立即下载/申请！）

### 1.1 Fit3D (Google/CMU) - APPLY FOR ACCESS 申请访问权限 🔴

**Status 状态**: Application required (typically 1-2 weeks approval 需要申请，通常1-2周批准)

#### What It Is 简介

- **Scale 规模**: 3+ million images with professional motion capture 300万+图像配专业动作捕捉
- **Coverage 覆盖**: 37+ repetitive fitness exercises across all major muscle groups 37+重复性健身练习涵盖所有主要肌群
- **Quality 质量**: Research-grade MoCap with corresponding RGB images 研究级MoCap配对应RGB图像
- **Participants 参与者**: Expert trainers + learners (multiple skill levels 专家教练+学习者，多技能水平)
- **Source 来源**: Google Research / CMU collaboration (CVPR 2021)

#### Why This Is Critical 为什么这很关键

**Gold Standard for Benchmarking 基准测试黄金标准**:

- Industry reference for automatic fitness feedback systems 自动健身反馈系统的行业参考
- Natural language feedback generation examples 自然语言反馈生成示例
- Multi-level feedback design (visual + language 多级反馈设计，视觉+语言)
- Adjustable feedback strictness (beginner → advanced 可调反馈严格度，初级→高级)

**Citation Count 引用次数**: 100+ citations (highly influential 高度影响力)

#### How to Apply 如何申请

**Step-by-step Process 分步流程**:

1. **Visit Application Portal 访问申请门户**: [https://fit3d.imar.ro/](https://fit3d.imar.ro/)

2. **Prepare Application Materials 准备申请材料**:
   - Institution affiliation 机构隶属关系
   - Research project description 研究项目描述
   - Intended use case 预期用例
   - Data usage agreement acceptance 数据使用协议接受

3. **What to Emphasize in Application 申请中强调的内容**:
   - Academic/research project status 学术/研究项目状态
   - Novel multimodal approach 新颖的多模态方法: "EMG + IMU + Vision fusion for movement training EMG+IMU+视觉融合用于动作训练"
   - Open-source contribution goals 开源贡献目标
   - Benchmark comparison with AIFit methodology 与AIFit方法的基准比较
   - Publication intentions (CHI, IMWUT, CVPR 发表意向)

4. **Expected Timeline 预期时间线**: 1-2 weeks for approval 批准需1-2周

5. **After Approval 批准后**:
   - Sign data usage agreement 签署数据使用协议
   - Receive download credentials 收到下载凭证
   - Access dataset tools 访问数据集工具: [GitHub - Dataset Tools](https://github.com/sminchisescu-research/imar_vision_datasets_tools)

#### Dataset Structure 数据集结构

```
fit3d/
├── images/              # 3M+ RGB images 300万+RGB图像
├── mocap/               # 3D motion capture data 3D动作捕捉数据
├── annotations/         # Exercise labels, rep boundaries 练习标签、次数边界
├── feedback_examples/   # Natural language feedback samples 自然语言反馈样本
└── metadata/           # Participant info, skill levels 参与者信息、技能水平
```

#### How to Use for Validation 如何用于验证

**Phase 1 (MVP) MVP阶段**: Not needed yet 暂不需要
**Phase 2 (Months 3-6) 第3-6个月**:

- Benchmark pose estimation accuracy 基准测试姿态估计精度
- Compare feedback generation quality 比较反馈生成质量
- Validate multi-level feedback system 验证多级反馈系统

**Phase 3 (Research) 研究阶段**:

- Primary comparison dataset for papers 论文的主要比较数据集
- Establish baseline vs. AIFit system 建立与AIFit系统的基准
- Demonstrate improvements 展示改进

**Resources 资源**:

- **Paper 论文**: [AIFit: Automatic 3D Human-Interpretable Feedback Models (CVPR 2021)](https://openaccess.thecvf.com/content/CVPR2021/html/Fieraru_AIFit_Automatic_3D_Human-Interpretable_Feedback_Models_for_Fitness_Training_CVPR_2021_paper.html)
- **Code 代码**: [GitHub - imar_vision_datasets_tools](https://github.com/sminchisescu-research/imar_vision_datasets_tools)

---

### 1.2 MM-Fit - DOWNLOAD IMMEDIATELY 立即下载 🔴

**Status 状态**: Publicly available - NO application needed 公开可用，无需申请

#### What It Is 简介

**The Perfect Match for Our Project 我们项目的完美匹配**:

- **Multimodal data 多模态数据**: IMU sensors + RGB-D video + 3D pose IMU传感器+RGB-D视频+3D姿态
- **Time-synchronized 时间同步**: All modalities aligned 所有模态对齐
- **Sensor Types 传感器类型**: Smartphone IMU 智能手机IMU, smartwatch IMU 智能手表IMU, earbud IMU 耳塞IMU
- **Visual Data 视觉数据**: Multi-view RGB-D video + 2D/3D pose estimation 多视角RGB-D视频+2D/3D姿态估计
- **Coverage 覆盖**: Various gym exercises, multiple participants 各种健身房练习，多位参与者

**Publication 发表**: IMWUT 2020 (Top Ubicomp Journal 顶级泛在计算期刊)

#### Why This Is Critical for Us 为什么这对我们至关重要

🎯 **Exact Validation Dataset We Need 我们需要的确切验证数据集**:

✅ **Has IMU data 有IMU数据** - Just like our wearable sensor 就像我们的可穿戴传感器
✅ **Has vision data 有视觉数据** - Just like our mobile app camera 就像我们的移动应用相机
✅ **Has ground truth pose 有真实姿态** - For evaluation 用于评估
✅ **All time-synchronized 全部时间同步** - Solves sync challenges 解决同步挑战
✅ **Publicly available 公开可用** - No access barriers 无访问障碍

#### Download & Setup 下载与设置

**Immediate Actions 立即行动**:

1. **Clone Repository 克隆仓库**:

   ```bash
   git clone https://github.com/KDMStromback/mm-fit.git
   cd mm-fit
   ```

2. **Download Dataset 下载数据集**:
   - Visit 访问: [https://mmfit.github.io/](https://mmfit.github.io/)
   - Follow download instructions (typically Google Drive/AWS S3 遵循下载说明，通常是Google Drive/AWS S3)
   - Expected size 预期大小: ~50-100 GB (plan storage accordingly 相应规划存储)

3. **Data Format 数据格式**:

   ```
   mm-fit/
   ├── imu_data/          # HDF5/CSV format
   │   ├── smartphone/
   │   ├── smartwatch/
   │   └── earbuds/
   ├── video/             # MP4/AVI files
   │   ├── rgb/
   │   └── depth/
   ├── pose/              # JSON/NPY keypoints 关键点
   │   ├── 2d_keypoints/
   │   └── 3d_pose/
   └── annotations/       # Exercise labels, timestamps 练习标签、时间戳
   ```

4. **Setup Environment 设置环境**:

   ```bash
   pip install h5py pandas opencv-python numpy
   ```

#### How to Use Immediately 如何立即使用

**Week 1-2 Tasks 第1-2周任务**:

```python
# Quick validation script 快速验证脚本
import h5py
import pandas as pd

# Load IMU data 加载IMU数据
imu_data = pd.read_csv('mm-fit/imu_data/smartphone/exercise_01.csv')

# Load corresponding pose 加载对应姿态
pose_data = np.load('mm-fit/pose/2d_keypoints/exercise_01.npy')

# Validate time synchronization 验证时间同步
assert len(imu_data) == len(pose_data), "Sync check 同步检查"

# Test your sensor fusion approach 测试您的传感器融合方法
```

**Direct Applications 直接应用**:

1. ✅ Validate sensor fusion approach 验证传感器融合方法 (IMU + Vision)
2. ✅ Test pose estimation pipeline accuracy 测试姿态估计管道精度
3. ✅ Benchmark multimodal learning models 基准测试多模态学习模型
4. ✅ Reference time synchronization methods 参考时间同步方法
5. ✅ Compare against published baselines 与已发表基线比较

**License 许可**: Academic use permitted (verify current terms in repo 允许学术使用，在仓库中验证当前条款)

**Resources 资源**:

- **Website 网站**: [https://mmfit.github.io/](https://mmfit.github.io/)
- **GitHub**: [https://github.com/KDMStromback/mm-fit](https://github.com/KDMStromback/mm-fit)
- **Paper 论文**: [MM-Fit: Multimodal Deep Learning for Automatic Exercise Logging (IMWUT 2020)](https://dl.acm.org/doi/10.1145/3397309)

---

### 1.3 FLAG3D - DOWNLOAD NOW 立即下载 🟡

**Status 状态**: Publicly available 公开可用

#### What It Is 简介

**Most Recent Large-Scale Fitness Dataset 最新的大规模健身数据集**:

- **Scale 规模**: 180,000 action sequences 18万个动作序列
- **Exercises 练习**: 60 complex fitness movements 60个复杂健身动作
- **Unique Feature 独特功能**: Detailed natural language instruction annotations 详细自然语言指导注释
- **Publication 发表**: CVPR 2023

#### Data Sources (3 Modalities) 数据来源（3种模态）

1. **Professional MoCap 专业MoCap**:
   - 24 VICON cameras VICON相机
   - 77 marker points 标记点
   - Research-grade accuracy 研究级精度

2. **Synthetic Rendering 合成渲染**:
   - Software-generated variations 软件生成变体
   - Controlled conditions 受控条件
   - Augmentation potential 增强潜力

3. **Smartphone Natural 智能手机自然**:
   - Real-world environment capture 真实世界环境捕捉
   - Consumer-grade quality 消费级质量
   - **Matches our deployment scenario 匹配我们的部署场景**

#### Why This Matters 为什么这很重要

✅ **Natural Language Feedback Design 自然语言反馈设计**:

- Learn instruction phrasing patterns 学习指导措辞模式
- Train language-to-pose mapping models 训练语言到姿态映射模型
- Reference for feedback generation 反馈生成参考

✅ **Diverse Data Sources 多样化数据来源**:

- Professional MoCap = ground truth 专业MoCap = 真实值
- Smartphone data = realistic use case 智能手机数据 = 现实用例
- Synthetic = data augmentation 合成 = 数据增强

#### Download & Access 下载与访问

1. **Project Page 项目页面**: [https://andytang15.github.io/FLAG3D/](https://andytang15.github.io/FLAG3D/)

2. **Paper 论文**: [arXiv:2212.04638](https://arxiv.org/abs/2212.04638)

3. **Expected Use Cases 预期用例**:
   - Train natural language feedback generation 训练自然语言反馈生成
   - Test language-conditioned pose estimation 测试语言条件姿态估计
   - Augment training with synthetic data 使用合成数据增强训练

**Priority 优先级**: Medium (useful for Phase 2-3, not critical for MVP 对第2-3阶段有用，对MVP非关键)

---

### 1.4 Microsoft RecoFit - DOWNLOAD NOW 立即下载 🟡

**Status 状态**: Publicly available 公开可用

#### What It Is 简介

**Wearable Sensor-Based Exercise Recognition 基于可穿戴传感器的运动识别**:

- **Participants 参与者**: 200+ people 200+人
- **Sensors 传感器**: Accelerometer + Gyroscope (6-axis IMU 加速度计+陀螺仪，6轴IMU)
- **Focus 重点**: Gym exercise recognition and rep counting 健身房运动识别和次数计数
- **Publication 发表**: CHI 2014 (influential HCI venue 有影响力的HCI会议)

#### What's Included 包含内容

- Raw IMU sensor data (CSV/MAT format 原始IMU传感器数据，CSV/MAT格式)
- Exercise type labels 运动类型标签
- Rep counting annotations 次数计数注释
- Participant demographics 参与者人口统计

#### Why We Need This 为什么我们需要这个

✅ **Baseline IMU-only Approach 基线仅IMU方法**:

- Test our wearable module independently 独立测试我们的可穿戴模块
- Validate rep counting algorithms 验证次数计数算法
- Pre-train IMU processing pipeline 预训练IMU处理管道
- Compare IMU-only vs. multimodal accuracy 比较仅IMU与多模态精度

#### Download & Setup 下载与设置

1. **GitHub**: [https://github.com/microsoft/Exercise-Recognition-from-Wearable-Sensors](https://github.com/microsoft/Exercise-Recognition-from-Wearable-Sensors)

2. **Quick Start 快速开始**:

   ```bash
   git clone https://github.com/microsoft/Exercise-Recognition-from-Wearable-Sensors.git
   cd Exercise-Recognition-from-Wearable-Sensors
   ```

3. **Data Format 数据格式**:

   ```
   recofit/
   ├── raw_data/          # IMU time series IMU时间序列
   ├── labels/            # Exercise classifications 运动分类
   ├── rep_counts/        # Ground truth reps 真实次数
   └── preprocessing/     # Scripts for data cleaning 数据清洗脚本
   ```

**Priority 优先级**: Medium-High (useful for wearable validation in MVP phase 对MVP阶段可穿戴验证有用)

---

### 1.5 COCO Keypoints / MPII - PRE-TRAINING DATASETS 预训练数据集

**Status 状态**: Publicly available - Standard benchmarks 公开可用 - 标准基准

#### COCO Keypoints Dataset COCO关键点数据集

**Details 详情**:

- **Scale 规模**: 200,000+ images with pose annotations 20万+带姿态注释图像
- **Keypoints 关键点**: 17-point human pose format (industry standard 17点人体姿态格式，行业标准)
- **Use Case 用例**: Pre-training pose estimation models 预训练姿态估计模型

**Download 下载**:

- **Website 网站**: [https://cocodataset.org/#keypoints-2020](https://cocodataset.org/#keypoints-2020)
- **Quick Download 快速下载**:

  ```bash
  # Images (~20GB)
  wget http://images.cocodataset.org/zips/train2017.zip
  wget http://images.cocodataset.org/zips/val2017.zip

  # Annotations 注释 (~250MB)
  wget http://images.cocodataset.org/annotations/annotations_trainval2017.zip
  ```

**Pre-trained Models Available 可用的预训练模型**:

- RTMPose models already trained on COCO 已在COCO上训练的RTMPose模型
- MediaPipe models pre-trained on COCO 在COCO上预训练的MediaPipe模型
- Skip training, use existing models 跳过训练，使用现有模型

#### MPII Human Pose Dataset MPII人体姿态数据集

**Details 详情**:

- **Scale 规模**: 25,000 images, 40,000+ people 2.5万图像，4万+人
- **Activities 活动**: 410 different human activities 410种不同人类活动
- **Use Case 用例**: Pose estimation evaluation, robustness testing 姿态估计评估、鲁棒性测试

**Download 下载**:

- **Website 网站**: [http://human-pose.mpi-inf.mpg.de/](http://human-pose.mpi-inf.mpg.de/)
- **Size 大小**: ~12 GB

**Priority 优先级**: Low (use pre-trained models instead of training from scratch 低，使用预训练模型而不是从头训练)

---

### 1.6 motion-sense Dataset - DOWNLOAD NOW 立即下载 🟢

**Status 状态**: Publicly available 公开可用

#### What It Is 简介

**Smartphone IMU-Based Activity Recognition 基于智能手机IMU的活动识别**:

- **Scale 规模**: Multiple participants, various activities 多位参与者，各种活动
- **Sensors 传感器**: Accelerometer + Gyroscope (phone's built-in IMU 手机内置IMU)
- **Focus 重点**: Using smartphone sensors for movement detection 使用智能手机传感器进行运动检测
- **Activities 活动**: Walking 行走, running 跑步, stairs 爬楼梯, and more 等
- **Format 格式**: CSV files (easy to parse 易于解析)

#### What's Included 包含内容

- Time-synchronized accelerometer data 时间同步加速度计数据
- Gyroscope readings 陀螺仪读数
- Activity labels 活动标签
- Multiple recording sessions per participant 每位参与者多个录制会话

#### Why It's Useful 为什么有用

✅ **Smartphone IMU Validation 智能手机IMU验证**:

- Benchmark our smartphone-based tracking approach 基准测试我们基于智能手机的追踪方法
- Baseline for "phone-only" implementation "仅手机"实现的基线
- Compare phone IMU vs. dedicated wearable sensor performance 比较手机IMU与专用可穿戴传感器性能
- Activity recognition baseline algorithms 活动识别基线算法

**Use Case 用例**:

- Validate smartphone IMU integration accuracy 验证智能手机IMU集成精度
- Test activity classification without external sensors 测试无外部传感器的活动分类
- Research sensor quality differences (phone vs. wearable 研究传感器质量差异，手机对比可穿戴)

#### Download & Access 下载与访问

**Repository 仓库**: <https://github.com/mmalekzadeh/motion-sense>

**Quick Start 快速开始**:

```bash
git clone https://github.com/mmalekzadeh/motion-sense.git
cd motion-sense
```

**Data Structure 数据结构**:

```
motion-sense/
├── data/
│   ├── accelerometer/    # Phone accelerometer 手机加速度计
│   ├── gyroscope/        # Phone gyroscope 手机陀螺仪
│   └── labels/           # Activity annotations 活动注释
└── scripts/              # Preprocessing utilities 预处理工具
```

**Priority 优先级**: Low (useful for Phase 3 research, not critical for MVP 对第3阶段研究有用，对MVP非关键)

---

## 1.7 Data Annotation & Labeling Tools 数据注释与标注工具

If you need to create custom labeled datasets for training or evaluation, these tools are industry-standard:

如果您需要为训练或评估创建自定义标注数据集，这些是行业标准工具：

### CVAT (Computer Vision Annotation Tool) 计算机视觉标注工具

**What it is 简介**:

- Open-source image and video annotation platform 开源图像和视频标注平台
- Developed and used by Intel 由Intel开发和使用
- Web-based interface with powerful features 具有强大功能的网络界面

**Key Features 关键功能**:

- ✅ Video frame annotation (perfect for exercise videos 视频帧标注，完美适用于运动视频)
- ✅ Skeleton/keypoint labeling (pose annotation 骨架/关键点标注，姿态注释)
- ✅ Bounding box, polygon, segmentation support 边界框、多边形、分割支持
- ✅ Multi-user collaboration for team projects 团队项目多用户协作
- ✅ Auto-annotation with AI models 使用AI模型自动标注
- ✅ Export to COCO, YOLO, Pascal VOC formats 导出为COCO、YOLO、Pascal VOC格式

**When to use 何时使用**:

- Labeling custom exercise videos 标注自定义运动视频
- Creating ground truth pose data 创建真实姿态数据
- Validating pose estimation outputs 验证姿态估计输出
- Team annotation projects with multiple annotators 多标注员团队标注项目

**Setup 设置**:

```bash
# Docker deployment (easiest method Docker部署，最简单方法)
docker run -it --rm -p 8080:8080 cvat/server

# Access at http://localhost:8080 访问
# Or use cloud hosted version 或使用云托管版本
```

**Resources 资源**:

- **Website 网站**: <https://www.cvat.ai/>
- **GitHub**: <https://github.com/opencv/cvat>
- **License 许可**: MIT (free for commercial use 免费商用)

**Best For 最适合**: Video pose labeling, professional annotation workflows 视频姿态标注、专业标注工作流

---

### Label Studio

**What it is 简介**:

- Flexible multi-modal annotation platform 灵活的多模态标注平台
- Supports image, video, audio, text 支持图像、视频、音频、文本
- Highly customizable for specific needs 高度可定制以满足特定需求

**Key Features 关键功能**:

- ✅ Custom annotation interfaces (configure for specific needs 自定义标注界面，配置特定需求)
- ✅ ML-assisted labeling (import model predictions, correct them ML辅助标注，导入模型预测并纠正)
- ✅ Time-series annotation (useful for IMU sensor data 时间序列标注，对IMU传感器数据有用)
- ✅ Integration with ML pipelines 与ML管道集成
- ✅ Cloud or self-hosted deployment 云或自托管部署

**When to use 何时使用**:

- Need flexibility beyond standard pose annotation 需要超越标准姿态标注的灵活性
- Annotating multiple modalities (video + IMU data simultaneously 标注多模态，视频+IMU数据同时)
- ML-in-the-loop annotation workflows ML在环标注工作流
- Custom annotation schemas not supported elsewhere 其他地方不支持的自定义标注模式

**Setup 设置**:

```bash
pip install label-studio
label-studio start
# Access at http://localhost:8080 访问
```

**Resources 资源**:

- **Website 网站**: <https://labelstud.io/>
- **GitHub**: <https://github.com/heartexlabs/label-studio>
- **License 许可**: Apache 2.0

**Best For 最适合**: Multi-modal projects, custom labeling workflows 多模态项目、自定义标注工作流

---

### VIA (VGG Image Annotator) VGG图像标注器

**What it is 简介**:

- Lightweight browser-based annotation tool 轻量级基于浏览器的标注工具
- Developed by University of Oxford VGG group 由牛津大学VGG小组开发
- No installation required (runs in browser 无需安装，在浏览器中运行)

**Key Features 关键功能**:

- ✅ Runs entirely in browser (no server needed 完全在浏览器中运行，无需服务器)
- ✅ Simple interface (fastest to learn 简单界面，最快学习)
- ✅ Supports images and video 支持图像和视频
- ✅ Keypoint annotation 关键点标注
- ✅ Export to JSON/CSV 导出为JSON/CSV

**When to use 何时使用**:

- Quick small-scale annotation tasks 快速小规模标注任务
- No server setup available 无服务器设置可用
- Solo annotation projects 单人标注项目
- Teaching/demos and quick prototypes 教学/演示和快速原型

**Setup 设置**:

- No installation - just open HTML file in browser 无需安装，只需在浏览器中打开HTML文件
- Or use online version directly 或直接使用在线版本

**Resources 资源**:

- **Website 网站**: <https://www.robots.ox.ac.uk/~vgg/software/via/>
- **GitLab**: <https://gitlab.com/vgg/via>
- **License 许可**: BSD 2-Clause

**Best For 最适合**: Quick solo work, no-setup scenarios 快速单人工作、无设置场景

---

### Annotation Tool Comparison 标注工具比较

| Feature 功能 | CVAT | Label Studio | VIA |
|---------|------|--------------|-----|
| **Installation 安装** | Docker/Cloud | pip/Cloud | Browser only 仅浏览器 |
| **Learning Curve 学习曲线** | Medium 中等 | Medium 中等 | Easy 简单 |
| **Video Support 视频支持** | ✅ Excellent 优秀 | ✅ Good 良好 | ✅ Basic 基础 |
| **Skeleton/Pose 骨架/姿态** | ✅ Native 原生 | ⚠️ Custom config 自定义配置 | ✅ Keypoints 关键点 |
| **Multi-user 多用户** | ✅ Yes | ✅ Yes | ❌ No |
| **ML-Assisted ML辅助** | ✅ Yes | ✅ Yes | ❌ No |
| **Multi-modal 多模态** | ⚠️ Video only 仅视频 | ✅ Yes | ❌ No |
| **Best For 最适合** | Video pose labeling 视频姿态标注 | Multi-modal projects 多模态项目 | Quick solo work 快速单人工作 |

### Recommendation for Movement Chain AI Movement Chain AI建议

**Phase 1 (MVP) MVP阶段**:

- Use existing datasets (MM-Fit, Fit3D 使用现有数据集)
- No annotation needed yet 暂不需要标注

**Phase 2 (Custom data 自定义数据)**:

- **CVAT** for video pose annotation 用于视频姿态标注
- Focus on exercise-specific keypoint labeling 专注于特定运动关键点标注
- Team collaboration for larger datasets 团队协作处理更大数据集

**Phase 3 (Research 研究)**:

- **Label Studio** for multi-modal annotation 用于多模态标注
- Annotate video + IMU + EMG simultaneously 同时标注视频+IMU+EMG
- ML-assisted workflows for efficiency 用于效率的ML辅助工作流

---

## 2. Benchmark Results & Comparisons 基准测试结果与比较

### 2.1 Pose Estimation Accuracy (COCO mAP) 姿态估计精度（COCO mAP）

**Industry Standard Metric 行业标准指标**: COCO Average Precision (AP 平均精度)

#### Top Models (2025) 顶级模型（2025）

| Model 模型 | AP (%) | AR (%) | Year 年份 | Status 状态 |
|-------|--------|--------|------|--------|
| **RTMPose-x** | **77.8** | **83.0** | 2023 | Max accuracy 最高精度 |
| **RTMPose-l** | **77.3** | **82.6** | 2023 | High accuracy 高精度 |
| **RTMPose-m** | **75.8** | **81.2** | 2023 | ⭐ **Recommended 推荐** |
| RTMPose-s | 71.7 | 77.8 | 2023 | Mobile optimized 移动优化 |
| **MediaPipe Pose** | **~72.0** | **~78.0** | 2020 | ⭐ **MVP choice MVP选择** |
| MoveNet Thunder | 72.0 | 78.5 | 2021 | TensorFlow |
| RTMPose-t | 67.1 | 73.5 | 2023 | Ultra-fast 超快 |
| MoveNet Lightning | 63.0 | 70.0 | 2021 | Web/battery 网络/电池 |

**Legend 图例**:

- **AP (Average Precision 平均精度)**: Overall accuracy across all keypoints 所有关键点的总体精度
- **AR (Average Recall 平均召回率)**: Detection rate 检测率
- ⭐ = Recommended for our project 推荐用于我们的项目

#### What These Numbers Mean 这些数字的含义

- **>75% AP**: Production-ready, high accuracy 生产就绪，高精度
- **70-75% AP**: Good for most applications 适用于大多数应用
- **<70% AP**: Acceptable for mobile/real-time tradeoffs 可接受的移动/实时权衡

**Our Target 我们的目标**: ≥72% AP (match or exceed MediaPipe 匹配或超过MediaPipe)

---

### 2.2 Mobile Performance (FPS & Latency) 移动性能（FPS与延迟）

#### Speed Comparison 速度比较

**Desktop CPU (Intel i7-11700) 桌面CPU**:

| Model 模型 | FPS 帧率 | Latency (ms) 延迟（毫秒） |
|-------|-----|--------------|
| RTMPose-t | 150+ | ~7 |
| RTMPose-m | 90+ | ~11 |
| MediaPipe | 40 | ~25 |
| MoveNet Lightning | 60 | ~17 |

**Mobile (Snapdragon 865) 移动端**:

| Model 模型 | FPS 帧率 | Latency (ms) 延迟（毫秒） | Battery/Hour 每小时电池消耗 |
|-------|-----|--------------|--------------|
| RTMPose-t | 120+ | ~8 | 8% drain |
| RTMPose-m | 70+ | ~14 | 12% drain |
| MediaPipe Lite | 40-50 | ~20-25 | 15% drain |
| **MediaPipe Full** | **30-40** | **25-33** | **18% drain** |
| MoveNet Lightning | 50+ | ~20 | 10% drain |

**GPU (NVIDIA GTX 1660 Ti)**:

| Model 模型 | FPS 帧率 | Latency (ms) 延迟（毫秒） |
|-------|-----|--------------|
| RTMPose-m | 430+ | ~2.3 |
| RTMPose-t | 600+ | ~1.7 |
| MediaPipe | 120+ | ~8 |
| MoveNet Thunder | 100+ | ~10 |

#### Performance Targets 性能目标

**MVP Phase MVP阶段** (MediaPipe):

- ✅ 30-40 FPS on mobile 移动端30-40 FPS
- ✅ <100ms end-to-end latency 端到端延迟<100ms
- ✅ <20% battery/hour 每小时电池消耗<20%

**Production Phase 生产阶段** (RTMPose):

- 🎯 70+ FPS on mobile 移动端70+ FPS
- 🎯 <50ms latency 延迟<50ms
- 🎯 <15% battery/hour 每小时电池消耗<15%

---

### 2.3 Cloud Inference Costs 云推理成本

**Cost per 1 million inference requests 每百万推理请求成本** (AWS Lambda):

| Model 模型 | Compute Time 计算时间 | Lambda Cost Lambda成本 | GPU Cost (G4dn) GPU成本 | Savings 节省 |
|-------|--------------|-------------|-----------------|---------|
| **RTMPose-t** | ~7ms | $10 | $6 | **-78%** |
| **RTMPose-m** | ~11ms | $15 | $8 | **-67%** |
| RTMPose-l | ~17ms | $25 | $12 | -44% |
| **MediaPipe** | ~25ms | $45 | $20 | Baseline 基线 |
| MoveNet Thunder | ~30ms | $55 | $25 | +22% |

**Key Finding 关键发现**:

- **RTMPose reduces cloud costs by 67-82% RTMPose降低云成本67-82%** vs. MediaPipe
- Critical for scalability if offering cloud processing 如果提供云处理对可扩展性至关重要

**Cost Calculation Basis 成本计算基础**:

- AWS Lambda pricing AWS Lambda定价: $0.0000166667/GB-second
- Assumed 1GB memory allocation 假设1GB内存分配
- GPU: g4dn.xlarge @ $0.526/hour

---

### 2.4 Accuracy vs. Speed Tradeoff 精度与速度权衡

**Pareto Frontier 帕累托前沿** (COCO AP vs. Mobile FPS):

```
Accuracy 精度 (AP %)
    80│                              RTMPose-x
      │                         RTMPose-l
      │                    RTMPose-m
    75│               MediaPipe
      │          MoveNet Thunder
    70│     RTMPose-s
      │  MoveNet Lightning
    65│ RTMPose-t
      │
    60└────────────────────────────────────→ Speed 速度 (FPS 帧率)
      0   50   100   150   200   250   300
```

**Sweet Spot 最佳平衡点**: RTMPose-m (75.8% AP, 70+ FPS mobile 移动端70+ FPS)

---

## 3. Commercial Performance Metrics 商业性能指标

### 3.1 Peloton IQ (2025)

**Publicly Claimed Metrics 公开声称的指标**:

- Training data 训练数据: 5+ million workouts 500万+训练, 40,000+ hours 4万+小时
- Exercises covered 覆盖练习: 37+ movements 37+动作
- Accuracy 精度: Not disclosed publicly 未公开披露
- Latency 延迟: "Real-time 实时" (estimated <100ms 估计<100ms)

**Feedback Design 反馈设计**:

- **Confidence thresholding 置信度阈值**: Only shows feedback when confident 仅在有信心时显示反馈
- **Adaptive strictness 自适应严格度**: Beginner → Advanced modes 初级→高级模式
- **Multi-level 多级**: Visual + audio + post-workout summary 视觉+音频+训练后摘要

**Technology 技术**: Computer vision (pose estimation 计算机视觉，姿态估计), proprietary ML models 专有ML模型

---

### 3.2 Tonal

**Publicly Claimed Metrics 公开声称的指标**:

- Training database 训练数据库: "Nearly 1 billion reps 近10亿次重复"
- Exercise coverage 练习覆盖: 111 strength exercises 111个力量练习
- Feedback types 反馈类型: Up to 6 per exercise 每个练习最多6种
  1. Speed 速度 (tempo control 节奏控制)
  2. Range of motion 运动范围
  3. Position 位置 (joint angles 关节角度)
  4. Balance 平衡 (left/right 左/右)
  5. Symmetry 对称性
  6. Smoothness 流畅度

**Technology 技术**:

- Multi-sensor fusion 多传感器融合 (force sensors + rope tracking + vision 力传感器+绳索追踪+视觉)
- 60 Hz sensor sampling rate 60 Hz传感器采样率
- Estimated <50ms latency 估计延迟<50ms

**Key Claim 关键声称**:
> "Think of Tonal vs. pure vision systems like the difference between a sportscaster and a sports science laboratory."
> "将Tonal与纯视觉系统比较，就像体育评论员与运动科学实验室之间的区别。"

**Validation 验证**: Multi-sensor superiority over vision-only 多传感器优于仅视觉

---

### 3.3 MAGIC AI Mirror

**Publicly Claimed Metrics 公开声称的指标**:

- Movement patterns recognized 识别的运动模式: ~400
- Rep quality scoring 重复质量评分: 0-100 numerical scale 0-100数值量表
- Accuracy 精度: Not disclosed 未披露
- Latency 延迟: "Real-time 实时"

**Feedback Design 反馈设计**:

- Color-coded joint indicators (green/yellow/red 颜色编码关节指示器，绿/黄/红)
- Holographic coach overlay 全息教练覆盖层
- Movement trajectory visualization 运动轨迹可视化
- Side-by-side ideal vs. actual comparison 理想与实际并排比较

**Technology 技术**: ReflectAI® (proprietary vision system 专有视觉系统)

---

### 3.4 Tempo Studio

**Publicly Claimed Metrics 公开声称的指标**:

- 3D reconstruction 3D重建: 30+ FPS
- Latency 延迟: Estimated <100ms 估计<100ms
- Accuracy 精度: Not disclosed 未披露

**Technology 技术**:

- Time-of-Flight (ToF) depth sensors 飞行时间深度传感器
- True 3D pose (not 2D projection 真实3D姿态，非2D投影)
- Real-time joint angle calculation 实时关节角度计算

---

### 3.5 Form (Swimming Goggles) 游泳护目镜

**Published Scientific Validation 已发表的科学验证**:

- **Peer-reviewed accuracy 同行评审精度**: Validated against video analysis 通过视频分析验证
- **Stroke count 划水次数**: >95% accuracy 精度>95%
- **Heart rate 心率**: Clinical-grade precision 临床级精度
- **Latency 延迟**: <20ms (on-device processing 设备端处理)

**Technology 技术**:

- IMU-based stroke detection 基于IMU的划水检测
- Optical heart rate sensor 光学心率传感器
- AR display with <30ms latency AR显示延迟<30ms

**Key Finding 关键发现**: Scientific validation proves AR feedback effectiveness 科学验证证明AR反馈有效性

---

### 3.6 Apple Fitness+

**Current State (2025) 当前状态（2025）**:

- ❌ No real-time form correction 无实时动作纠正
- ❌ No pose estimation 无姿态估计
- ❌ No AI coaching 无AI教练

**Market Observation 市场观察**:

- Apple has all necessary technology (Vision Framework, ARKit, LiDAR Apple拥有所有必要技术)
- Has not yet entered AI fitness feedback market 尚未进入AI健身反馈市场
- **Validates market opportunity still exists 验证市场机会仍然存在**

---

## 4. Evaluation Metrics & Standards 评估指标与标准

### 4.1 Pose Estimation Metrics 姿态估计指标

#### COCO Average Precision (AP) COCO平均精度

**Definition 定义**:

- Percentage of keypoints correctly detected within threshold 阈值内正确检测的关键点百分比
- Standard threshold 标准阈值: Object Keypoint Similarity (OKS 对象关键点相似性) > 0.5

**How to Calculate 如何计算**:

```python
from pycocotools.coco import COCO
from pycocotools.cocoeval import COCOeval

# Load ground truth and predictions 加载真实值和预测
coco_gt = COCO('annotations/person_keypoints_val2017.json')
coco_dt = coco_gt.loadRes('results/predictions.json')

# Evaluate 评估
coco_eval = COCOeval(coco_gt, coco_dt, 'keypoints')
coco_eval.evaluate()
coco_eval.accumulate()
coco_eval.summarize()

# Primary metric 主要指标
ap = coco_eval.stats[0]  # AP at OKS=0.50:0.95
```

**Variants 变体**:

- **AP**: Average Precision @ OKS=0.50:0.95 (primary metric 主要指标)
- **AP50**: AP @ OKS=0.50 (easier threshold 较易阈值)
- **AP75**: AP @ OKS=0.75 (strict threshold 严格阈值)
- **AR**: Average Recall 平均召回率

**Target for Our System 我们系统的目标**: AP ≥ 72% (match MediaPipe 匹配MediaPipe)

---

#### Mean Per Joint Position Error (MPJPE) 平均每关节位置误差

**Definition 定义**: Average 3D distance error for each joint (millimeters 平均3D距离误差，毫米)

**How to Calculate 如何计算**:

```python
import numpy as np

def mpjpe(predicted, ground_truth):
    """
    predicted: (N, 17, 3) - N frames, 17 keypoints, (x,y,z)
    ground_truth: (N, 17, 3)
    """
    return np.mean(np.sqrt(np.sum((predicted - ground_truth)**2, axis=2)))

# Example 示例
error_mm = mpjpe(pred_poses, gt_poses)
print(f"MPJPE: {error_mm:.2f} mm")
```

**Good Performance 良好性能**:

- <50mm: Excellent 优秀
- 50-80mm: Good 良好
- 80-120mm: Acceptable 可接受
- >120mm: Poor 较差

**Target 目标**: <80mm MPJPE for critical joints 关键关节<80mm (elbows 肘部, knees 膝部, wrists 腕部)

---

#### Percentage of Correct Keypoints (PCK) 正确关键点百分比

**Definition 定义**: Percentage of joints within threshold distance of ground truth 真实值阈值距离内的关节百分比

**How to Calculate 如何计算**:

```python
def pck(predicted, ground_truth, threshold=0.05):
    """
    threshold: fraction of torso diameter (typically 0.05 = 5% 躯干直径的分数)
    """
    # Calculate torso diameter (shoulder to hip distance 计算躯干直径，肩到臀距离)
    torso_diameter = np.linalg.norm(
        ground_truth[:, shoulder_idx] - ground_truth[:, hip_idx],
        axis=1
    )

    # Calculate distances for each joint 计算每个关节的距离
    distances = np.linalg.norm(predicted - ground_truth, axis=2)

    # Count correct if within threshold * torso_diameter 如果在阈值*躯干直径内则计为正确
    threshold_dist = threshold * torso_diameter[:, np.newaxis]
    correct = distances < threshold_dist

    return np.mean(correct) * 100  # Percentage 百分比

# Example 示例
pck_score = pck(pred_poses, gt_poses, threshold=0.05)
print(f"PCK@0.05: {pck_score:.1f}%")
```

**Target 目标**: PCK@0.05 > 90%

---

### 4.2 Feedback Quality Metrics 反馈质量指标

#### User Study Design (Standard Approach) 用户研究设计（标准方法）

**Methodology 方法论**:

1. **Participants 参与者**: 20-30 users (mix of beginners and experienced 初学者和有经验者混合)
2. **Exercises 练习**: 5-10 representative movements 5-10个代表性动作
3. **Conditions 条件**:
   - With AI feedback (our system 使用AI反馈，我们的系统)
   - Without feedback (baseline 无反馈，基线)
   - With human trainer (gold standard, optional 人类教练，黄金标准，可选)
4. **Metrics 指标**:
   - Form improvement (pre/post scores 动作改进，前/后评分)
   - User satisfaction (Likert scale 1-7 用户满意度，李克特量表1-7)
   - Perceived usefulness 感知有用性
   - Trust in system 对系统的信任

**Quantitative Measurements 定量测量**:

```python
# Form quality scoring (0-100) 动作质量评分（0-100）
def score_form(keypoints, exercise_type):
    """
    Based on joint angles, ROM, symmetry
    基于关节角度、运动范围、对称性
    """
    scores = {
        'joint_angles': score_angles(keypoints),
        'range_of_motion': score_rom(keypoints),
        'symmetry': score_symmetry(keypoints),
        'tempo': score_tempo(keypoints)
    }
    return np.mean(list(scores.values()))
```

**Publication Requirements 发表要求**:

- IRB approval for human subjects research 人体受试者研究的IRB批准
- Pre-registration of study design 研究设计预注册
- Statistical analysis (paired t-tests, effect sizes 统计分析，配对t检验、效应量)

---

#### Feedback Accuracy Metrics 反馈精度指标

**False Positive Rate (FPR) 假阳性率**:

```python
# When feedback is given but form is actually correct
# 当给出反馈但动作实际正确时
FPR = False_Positives / (False_Positives + True_Negatives)
```

**Target 目标**: FPR < 10% (90%+ specificity 特异性>90%)

**False Negative Rate (FNR) 假阴性率**:

```python
# When feedback is NOT given but form is actually wrong
# 当未给出反馈但动作实际错误时
FNR = False_Negatives / (False_Negatives + True_Positives)
```

**Target 目标**: FNR < 20% (80%+ sensitivity 敏感性>80%)

**Precision (Positive Predictive Value) 精确度（阳性预测值）**:

```python
Precision = True_Positives / (True_Positives + False_Positives)
```

**Target 目标**: Precision > 80%

---

### 4.3 System Latency Metrics 系统延迟指标

#### End-to-End Latency Breakdown 端到端延迟分解

**Target 目标**: <100ms total for real-time feedback 实时反馈总计<100ms

| Component 组件 | Target (ms) 目标（毫秒） | Measurement Method 测量方法 |
|-----------|-------------|-------------------|
| Sensor capture 传感器捕获 | <5 | IMU/camera timestamp IMU/相机时间戳 |
| Data transmission 数据传输 | <10 | Network profiling 网络性能分析 |
| Pose estimation 姿态估计 | <30 | Model inference time 模型推理时间 |
| Feedback generation 反馈生成 | <20 | Logic execution time 逻辑执行时间 |
| Haptic/visual output Haptic/视觉输出 | <10 | Display/actuator delay 显示/执行器延迟 |
| **Total 总计** | **<100** | **End-to-end timestamp 端到端时间戳** |

**How to Measure 如何测量**:

```python
import time

# Full pipeline timing 完整管道计时
start = time.perf_counter()

# 1. Sensor capture 传感器捕获
frame = camera.read()
imu_data = sensor.read()
t1 = time.perf_counter()

# 2. Pose estimation 姿态估计
keypoints = pose_estimator(frame)
t2 = time.perf_counter()

# 3. Feedback generation 反馈生成
feedback = generate_feedback(keypoints, imu_data)
t3 = time.perf_counter()

# 4. Output 输出
haptic_device.vibrate(feedback.pattern)
t4 = time.perf_counter()

# Report 报告
print(f"Capture 捕获: {(t1-start)*1000:.1f}ms")
print(f"Pose 姿态: {(t2-t1)*1000:.1f}ms")
print(f"Feedback 反馈: {(t3-t2)*1000:.1f}ms")
print(f"Output 输出: {(t4-t3)*1000:.1f}ms")
print(f"TOTAL 总计: {(t4-start)*1000:.1f}ms")
```

---

### 4.4 Battery Life & Power Consumption 电池续航与功耗

**Measurement 测量**:

```python
# Android (adb)
adb shell dumpsys batterystats --reset  # Reset stats 重置统计
# Run workout for 1 hour 运行1小时训练
adb shell dumpsys batterystats > battery_stats.txt

# iOS (Xcode Instruments)
# Use Energy Log instrument 使用能量日志工具
# Record 1-hour workout session 记录1小时训练会话
```

**Target 目标**:

- <20% battery drain per hour (moderate usage 每小时电池消耗<20%，中等使用)
- <15% battery drain per hour (optimized 每小时电池消耗<15%，优化后)

---

## 5. Dataset Usage Strategy (Phased) 数据集使用策略（分阶段）

### Phase 1: MVP Development (Months 1-3) MVP开发（第1-3个月）

**Goal 目标**: Get working prototype as fast as possible 尽快获得工作原型

#### Priority Datasets 优先数据集

| Dataset 数据集 | Purpose 目的 | Action 行动 | Timeline 时间线 |
|---------|---------|--------|----------|
| **MM-Fit** | Sensor fusion validation 传感器融合验证 | ✅ Download NOW 立即下载 | Week 1 第1周 |
| **COCO Keypoints** | Pre-trained models 预训练模型 | ✅ Use existing models 使用现有模型 | Week 1 第1周 |
| **RecoFit** | IMU baseline IMU基线 | ✅ Download NOW 立即下载 | Week 2 第2周 |

#### Specific Tasks 具体任务

**Week 1-2 第1-2周**:

```bash
# Download MM-Fit 下载MM-Fit
git clone https://github.com/KDMStromback/mm-fit.git
cd mm-fit && bash download_dataset.sh

# Download RecoFit 下载RecoFit
git clone https://github.com/microsoft/Exercise-Recognition-from-Wearable-Sensors.git
```

**Week 3-4 第3-4周**:

- Test pose estimation on MM-Fit video data 在MM-Fit视频数据上测试姿态估计
- Validate IMU processing on RecoFit data 在RecoFit数据上验证IMU处理
- Measure baseline accuracy (COCO AP metric 测量基线精度，COCO AP指标)

**Month 2-3 第2-3个月**:

- Benchmark sensor fusion on MM-Fit synchronized data 在MM-Fit同步数据上基准测试传感器融合
- Compare IMU-only vs. Vision-only vs. Fusion accuracy 比较仅IMU、仅视觉与融合精度
- Initial latency measurements 初始延迟测量

**Milestone 里程碑**: Functional MVP with quantified baseline performance 具有量化基线性能的功能MVP

---

### Phase 2: System Refinement (Months 3-6) 系统优化（第3-6个月）

**Goal 目标**: Improve accuracy, optimize performance, prepare for research 提高精度，优化性能，为研究做准备

#### Add Datasets 添加数据集

| Dataset 数据集 | Purpose 目的 | Action 行动 | Timeline 时间线 |
|---------|---------|--------|----------|
| **Fit3D** | Benchmark feedback system 基准测试反馈系统 | ✅ Apply for access NOW 立即申请访问 | Month 3 第3个月 |
| **FLAG3D** | Language feedback design 语言反馈设计 | ✅ Download 下载 | Month 4 第4个月 |
| **MPII** | Pose robustness testing 姿态鲁棒性测试 | Download if needed 如需下载 | Month 5 第5个月 |

#### Specific Tasks 具体任务

**Month 3-4 第3-4个月** (while waiting for Fit3D access 等待Fit3D访问期间):

- Download FLAG3D dataset 下载FLAG3D数据集
- Analyze natural language instruction patterns 分析自然语言指导模式
- Design feedback generation templates 设计反馈生成模板
- Implement multi-level feedback (visual + audio + haptic 实现多级反馈，视觉+音频+haptic)

**Month 4-5 第4-5个月** (if Fit3D granted 如果获得Fit3D):

- Benchmark pose estimation: Our system vs. AIFit baseline 基准测试姿态估计：我们的系统对比AIFit基线
- Compare feedback quality 比较反馈质量
- Measure user study metrics (if possible 测量用户研究指标，如可能)
- Identify improvement areas 识别改进领域

**Month 6 第6个月**:

- Optimize based on Fit3D benchmarks 基于Fit3D基准优化
- Reduce latency to <50ms 将延迟降至<50ms
- Improve battery life to <15%/hour 将电池续航提高至每小时<15%
- Finalize feedback generation logic 最终确定反馈生成逻辑

**Milestone 里程碑**: Production-ready system with peer-reviewed benchmark scores 具有同行评审基准分数的生产就绪系统

---

### Phase 3: Research Publication (Months 6-12) 研究发表（第6-12个月）

**Goal 目标**: Publish novel contributions, collect custom dataset 发表新颖贡献，收集自定义数据集

#### Custom Dataset Collection 自定义数据集收集

**EMG + IMU + Vision + Haptic Dataset**:

- **Scale 规模**: 20-30 participants (sufficient for CHI/IMWUT 参与者，足够用于CHI/IMWUT)
- **Exercises 练习**: 10-15 movements 10-15个动作
- **Modalities 模态**:
  - EMG muscle activation (our unique contribution EMG肌肉激活，我们的独特贡献)
  - IMU kinematics IMU运动学
  - RGB video + 3D pose RGB视频+3D姿态
  - Haptic feedback timing Haptic反馈时间
- **Annotations 注释**:
  - Ground truth form quality (expert ratings 真实动作质量，专家评分)
  - Muscle activation patterns 肌肉激活模式
  - User feedback (qualitative 用户反馈，定性)

**IRB Approval IRB批准**: Apply in Month 6, expect 1-2 months approval 第6个月申请，预计1-2个月批准

**Data Collection 数据收集**: Months 8-10 第8-10个月

**Analysis & Writing 分析与写作**: Months 10-12 第10-12个月

#### Comparison Strategy 比较策略

**Table for Paper 论文表格**:

| Method 方法 | Dataset 数据集 | AP (%) | MPJPE (mm) | Latency (ms) 延迟（毫秒） |
|--------|---------|--------|------------|--------------|
| AIFit (baseline 基线) | Fit3D | 74.2 | 85 | ~100 |
| Tonal (multi-sensor 多传感器) | Proprietary 专有 | N/A | N/A | ~50 |
| MediaPipe (vision 视觉) | COCO | 72.0 | 95 | 25-30 |
| RTMPose (vision 视觉) | COCO | 75.8 | 78 | 11 |
| **Ours (IMU+Vision 我们的，IMU+视觉)** | **MM-Fit** | **76.5** | **72** | **45** |
| **Ours (IMU+Vision+EMG 我们的，IMU+视觉+EMG)** | **Custom 自定义** | **77.8** | **68** | **48** |

*Hypothetical target numbers - actual results depend on implementation
*假设目标数字 - 实际结果取决于实现

**Novel Contributions to Highlight 要强调的新颖贡献**:

1. ✅ EMG muscle activation for form assessment (no other system has this EMG肌肉激活用于动作评估，没有其他系统有此功能)
2. ✅ Haptic real-time feedback (non-visual modality Haptic实时反馈，非视觉模态)
3. ✅ Low-cost (<$300 vs. $2,000-3,000 commercial 低成本，<$300对比商业$2,000-3,000)
4. ✅ Open-source (reproducible research 开源，可重现研究)
5. ✅ Multi-sport generalization 多运动泛化

**Milestone 里程碑**: 1-2 peer-reviewed publications (CHI, IMWUT, CVPR 1-2篇同行评审发表)

---

### Timeline Summary 时间线摘要

```
Month 1-3 第1-3个月: MVP with MM-Fit + RecoFit validation 使用MM-Fit + RecoFit验证的MVP
Month 3-6 第3-6个月: Optimization with Fit3D benchmarking (if granted 使用Fit3D基准优化，如获批)
Month 6-8 第6-8个月: IRB approval + study design IRB批准+研究设计
Month 8-10 第8-10个月: Custom dataset collection 自定义数据集收集
Month 10-12 第10-12个月: Analysis + paper writing 分析+论文写作
Month 12+ 第12个月+: Publication submission 发表提交
```

---

## 6. Publication & Research Targets 发表与研究目标

### 6.1 Target Venues 目标会议/期刊

#### Tier 1 (Top Venues) 一级（顶级会议）

**CHI (ACM Conference on Human Factors in Computing Systems 人机交互研讨会)**:

- **Acceptance Rate 录取率**: ~25%
- **Impact Factor 影响因子**: High (A*ranking A*排名)
- **Focus 重点**: Human-computer interaction, fitness technology UX 人机交互、健身技术用户体验
- **Typical Citations 典型引用**: 20-50 for good papers 好论文20-50
- **Deadline 截止日期**: Usually September (for May conference 通常9月，5月会议)
- **Why Target 为什么瞄准**: Perfect fit for fitness feedback systems, user studies 完美适合健身反馈系统、用户研究

**IMWUT (Interactive, Mobile, Wearable and Ubiquitous Technologies 交互、移动、可穿戴和泛在技术)**:

- **Acceptance Rate 录取率**: ~25%
- **Format 格式**: Journal (rolling submissions 期刊，滚动提交)
- **Focus 重点**: Wearable sensors, mobile systems, ubiquitous computing 可穿戴传感器、移动系统、泛在计算
- **Typical Citations 典型引用**: 30-100 for impactful papers 有影响力论文30-100
- **Why Target 为什么瞄准**: Ideal for our multimodal wearable approach 适合我们的多模态可穿戴方法

**CVPR (Conference on Computer Vision and Pattern Recognition 计算机视觉与模式识别)**:

- **Acceptance Rate 录取率**: ~25-30%
- **Impact Factor 影响因子**: Very High (A*ranking A*排名)
- **Focus 重点**: Computer vision, pose estimation algorithms 计算机视觉、姿态估计算法
- **Typical Citations 典型引用**: 50-200 for good papers 好论文50-200
- **Deadline 截止日期**: Usually November (for June conference 通常11月，6月会议)
- **Why Target 为什么瞄准**: If we have novel pose estimation/fusion contribution 如果我们有新颖的姿态估计/融合贡献

#### Tier 2 (Good Alternatives) 二级（良好替代）

**UIST (User Interface Software and Technology 用户界面软件与技术)**:

- Focus 重点: Novel interaction techniques 新颖交互技术
- Good fit for haptic feedback innovation 适合haptic反馈创新

**MobiSys (Mobile Systems, Applications, and Services 移动系统、应用和服务)**:

- Focus 重点: Mobile system design 移动系统设计
- Good fit for low-latency mobile implementation 适合低延迟移动实现

**PerCom (Pervasive Computing and Communications 泛在计算与通信)**:

- Focus 重点: Pervasive computing 泛在计算
- Good fit for sensor fusion approach 适合传感器融合方法

**Sports Engineering / Journal of Sports Sciences 运动工程/运动科学期刊**:

- Focus 重点: Applied sports technology 应用运动技术
- Easier acceptance, lower citation counts 更易接受，引用次数较低

---

### 6.2 Expected Citation Projections 预期引用预测

**Conservative Estimates 保守估计** (first 2 years 前2年):

| Venue 会议/期刊 | Expected Citations (2yr) 预期引用（2年） | Rationale 理由 |
|-------|-------------------------|-----------|
| **CHI** | 15-30 | HCI community interest in fitness tech HCI社区对健身技术感兴趣 |
| **IMWUT** | 25-50 | Wearable/ubicomp researchers will cite 可穿戴/泛在计算研究者会引用 |
| **CVPR** | 40-80 | High-impact CV venue, pose estimation topic 高影响力CV会议、姿态估计主题 |
| Sports Eng. 运动工程 | 5-15 | Smaller community 较小社区 |

**High-Impact Scenario 高影响场景** (if novel contribution 如果有新颖贡献):

- 50-100+ citations in 2 years 2年内50-100+引用 (e.g., if EMG+haptic proves revolutionary 例如，如果EMG+haptic证明具有革命性)
- Example 例子: AIFit (CVPR 2021) has 100+ citations in 4 years 4年内100+引用

**Factors for High Citations 高引用因素**:

1. ✅ Open-source code + dataset release 开源代码+数据集发布
2. ✅ Novel sensor modality (EMG 新颖传感器模态，EMG)
3. ✅ Reproducible results 可重现结果
4. ✅ Strong user study validation 强大的用户研究验证
5. ✅ Practical deployment (not just simulation 实际部署，不仅仅是模拟)

---

### 6.3 Paper Structure (Standard CHI/IMWUT Format) 论文结构（标准CHI/IMWUT格式）

**Title Examples 标题示例**:

- "Movement Chain AI: Multimodal Real-time Feedback for Movement Training with EMG and Haptic Guidance Movement Chain AI：使用EMG和Haptic引导的运动训练多模态实时反馈"
- "Beyond Vision: EMG-Enhanced Movement Correction for Accessible Fitness Training 超越视觉：用于可访问健身训练的EMG增强运动纠正"

**Abstract 摘要** (250 words 250字):

- Problem 问题: Current fitness feedback systems lack muscle activation insight 当前健身反馈系统缺乏肌肉激活洞察
- Approach 方法: Multimodal fusion (EMG + IMU + Vision + Haptic 多模态融合)
- Contribution 贡献: Novel EMG integration, low-cost, open-source 新颖的EMG集成、低成本、开源
- Evaluation 评估: User study (N=25), benchmarks (MM-Fit, Fit3D 用户研究，基准)
- Results 结果: 78% accuracy, <$300 cost, 12% improvement over vision-only 78%精度，<$300成本，比仅视觉提高12%

**Sections 章节**:

1. **Introduction 引言** (2 pages 2页)
   - Motivation 动机: Form correction importance 动作纠正的重要性
   - Gap 差距: Existing systems miss muscle activation 现有系统缺少肌肉激活
   - Contribution 贡献: EMG + haptic innovation EMG + haptic创新

2. **Related Work 相关工作** (2-3 pages 2-3页)
   - Commercial systems 商业系统 (Peloton, Tonal, Tempo)
   - Academic research 学术研究 (AIFit, MM-Fit, FLAG3D)
   - Pose estimation 姿态估计 (RTMPose, MediaPipe)
   - Gap analysis 差距分析

3. **System Design 系统设计** (3-4 pages 3-4页)
   - Hardware 硬件: EMG sensor, IMU, smartphone EMG传感器、IMU、智能手机
   - Software 软件: Pose estimation, sensor fusion, feedback generation 姿态估计、传感器融合、反馈生成
   - Architecture diagram 架构图
   - Implementation details 实现细节

4. **Methodology 方法论** (2 pages 2页)
   - Datasets 数据集: MM-Fit, Fit3D, Custom 自定义
   - Metrics 指标: COCO AP, MPJPE, user study 用户研究
   - Experimental setup 实验设置

5. **Results 结果** (3-4 pages 3-4页)
   - Benchmark performance vs. baselines 基准性能对比基线
   - User study findings 用户研究发现
   - Latency/battery measurements 延迟/电池测量
   - Ablation studies (with/without EMG 消融研究，有/无EMG)

6. **Discussion 讨论** (2 pages 2页)
   - Insights 洞察: EMG value, haptic effectiveness EMG价值、haptic有效性
   - Limitations 限制: Sensor placement, cost 传感器放置、成本
   - Future work 未来工作: Advanced sensors, more exercises 高级传感器、更多练习

7. **Conclusion 结论** (1 page 1页)
   - Summary of contributions 贡献摘要
   - Impact statement 影响声明
   - Open-source release 开源发布

**Total Length 总长度**: 12-14 pages (CHI/IMWUT standard CHI/IMWUT标准)

---

### 6.4 Supplementary Materials 补充材料

**What to Release 发布内容** (for reproducibility + citations 用于可重现性+引用):

1. **Code 代码**:

   ```
   github.com/movement-chain-ai/multimodal-feedback
   ├── pose_estimation/      # RTMPose integration RTMPose集成
   ├── sensor_fusion/        # IMU + EMG processing IMU + EMG处理
   ├── feedback_generation/  # Feedback logic 反馈逻辑
   └── evaluation/           # Benchmark scripts 基准脚本
   ```

2. **Dataset 数据集** (if allowed 如允许):
   - Custom EMG + haptic dataset 自定义EMG + haptic数据集
   - Annotations and labels 注释和标签
   - Pre-processing scripts 预处理脚本

3. **Models 模型**:
   - Pre-trained weights 预训练权重
   - ONNX exports for deployment 用于部署的ONNX导出

4. **Documentation 文档**:
   - Setup guide 设置指南
   - API reference API参考
   - Tutorial notebooks 教程笔记本

**Impact 影响**: Open-source releases typically increase citations by 2-3x 开源发布通常将引用增加2-3倍

---

## 7. Citation Requirements 引用要求

### 7.1 Datasets - BibTeX Entries 数据集 - BibTeX条目

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

**When to cite 何时引用**:

- Using Fit3D dataset 使用Fit3D数据集
- Comparing against AIFit methodology 与AIFit方法比较
- Referencing feedback system design 参考反馈系统设计

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

**When to cite 何时引用**:

- Using MM-Fit dataset 使用MM-Fit数据集
- Multimodal learning comparisons 多模态学习比较
- Sensor fusion validation 传感器融合验证

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

**When to cite 何时引用**:

- Using FLAG3D dataset 使用FLAG3D数据集
- Natural language feedback generation 自然语言反馈生成
- Language-conditioned pose estimation 语言条件姿态估计

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

**When to cite 何时引用**:

- Using RecoFit dataset 使用RecoFit数据集
- IMU-based exercise recognition 基于IMU的运动识别
- Wearable sensor baselines 可穿戴传感器基线

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

**When to cite 何时引用**:

- Using COCO dataset 使用COCO数据集
- Reporting COCO AP metric 报告COCO AP指标
- Pre-training on COCO 在COCO上预训练

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

**When to cite 何时引用**:

- Using MPII dataset 使用MPII数据集
- Evaluating pose estimation robustness 评估姿态估计鲁棒性

---

### 7.2 Methods - BibTeX Entries 方法 - BibTeX条目

#### RTMPose

```bibtex
@misc{jiang2023rtmpose,
  title={RTMPose: Real-Time Multi-Person Pose Estimation based on MMPose},
  author={Jiang, Tao and Lu, Peng and Zhang, Li and Ma, Ningsheng and Han, Rui and Lyu, Chengqi and Li, Yining and Chen, Kai},
  journal={arXiv preprint arXiv:2303.07399},
  year={2023}
}
```

**When to cite 何时引用**:

- Using RTMPose for pose estimation 使用RTMPose进行姿态估计
- Comparing performance against RTMPose 与RTMPose比较性能
- Discussing real-time pose methods 讨论实时姿态方法

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

**When to cite 何时引用**:

- Using MediaPipe Pose 使用MediaPipe Pose
- Mobile pose estimation 移动姿态估计
- 3D pose landmark discussion 3D姿态关键点讨论

---

### 7.3 Attribution Guidelines 归属指南

#### Required Citations 必需引用

**In Paper Introduction/Related Work 在论文引言/相关工作中**:

- All datasets used for training/validation 所有用于训练/验证的数据集
- All baseline methods compared against 所有比较的基线方法
- Prior work that directly influenced design 直接影响设计的先前工作

**In Methods Section 在方法部分**:

- Specific algorithms implemented 实现的特定算法
- Pre-trained models used 使用的预训练模型
- Evaluation metrics (cite COCO paper if using COCO AP 评估指标，如使用COCO AP则引用COCO论文)

**In Results/Discussion 在结果/讨论中**:

- Benchmark datasets for comparison 用于比较的基准数据集
- Competing systems referenced 参考的竞争系统

#### Dataset License Compliance 数据集许可合规

**Fit3D**:

- ✅ Cite AIFit paper 引用AIFit论文
- ✅ Mention dataset usage in acknowledgments 在致谢中提及数据集使用
- ✅ Follow academic use restrictions (verify license 遵循学术使用限制，验证许可)

**MM-Fit**:

- ✅ Cite MM-Fit paper 引用MM-Fit论文
- ✅ Acknowledge authors 致谢作者
- ✅ Verify current license terms (check GitHub 验证当前许可条款，检查GitHub)

**FLAG3D**:

- ✅ Cite FLAG3D paper 引用FLAG3D论文
- ✅ Follow any specific attribution requirements 遵循任何特定归属要求

**RecoFit**:

- ✅ Cite RecoFit paper 引用RecoFit论文
- ✅ Follow Microsoft Research license 遵循Microsoft Research许可

**COCO / MPII**:

- ✅ Cite original dataset papers 引用原始数据集论文
- ✅ Standard academic use (permissive 标准学术使用，宽松)

---

### 7.4 Acknowledgments Template 致谢模板

**Example Text 示例文本** (adapt for your paper 为您的论文调整):

```
We thank the creators of the Fit3D dataset (Fieraru et al., 2021) for providing access
to their motion capture data. This work utilized the MM-Fit multimodal dataset
(Strömback et al., 2020) for sensor fusion validation. We acknowledge the FLAG3D team
for their language-annotated fitness dataset and Microsoft Research for the RecoFit
wearable sensor data. Pose estimation experiments were conducted using models pre-trained
on the COCO Keypoints dataset (Lin et al., 2014).

我们感谢Fit3D数据集（Fieraru等，2021）的创建者提供对其运动捕捉数据的访问。
本工作利用MM-Fit多模态数据集（Strömback等，2020）进行传感器融合验证。
我们致谢FLAG3D团队提供的语言标注健身数据集和Microsoft Research提供的RecoFit
可穿戴传感器数据。姿态估计实验使用在COCO关键点数据集（Lin等，2014）上预训练的模型进行。

[If applicable 如适用] This research was supported by [grant/funding source 资助/资金来源]. We thank the
participants in our user study for their time and feedback.
本研究得到[资助/资金来源]的支持。我们感谢用户研究参与者的时间和反馈。
```

---

## 8. Curated Research & Resource Lists 精选研究与资源列表

These "Awesome" GitHub repositories aggregate papers, datasets, and tools. Useful for literature review and discovering new research.

这些"Awesome"GitHub仓库汇总了论文、数据集和工具。对文献综述和发现新研究有用。

### 8.1 Awesome-IMU-Sensing

**Repository 仓库**: <https://github.com/rh20624/Awesome-IMU-Sensing>

#### What's Included 包含内容

- Academic papers on IMU-based sensing and signal processing 基于IMU的感知和信号处理学术论文
- Public IMU datasets (comprehensive list 公共IMU数据集，全面列表)
- Signal processing techniques for IMU data IMU数据信号处理技术
- Sensor fusion algorithms and implementations 传感器融合算法和实现
- Activity recognition methods using IMU sensors 使用IMU传感器的活动识别方法
- State-of-art approaches and benchmark results 最先进方法和基准结果

#### Why It's Valuable 为什么有价值

✅ **Comprehensive IMU Research Literature 全面的IMU研究文献**:

- Discover IMU datasets we might have missed 发现我们可能错过的IMU数据集
- Find state-of-art sensor fusion approaches 找到最先进的传感器融合方法
- Access academic citations for our papers 访问我们论文的学术引用
- Learn IMU signal processing best practices 学习IMU信号处理最佳实践

**Best Use Cases 最佳用例**:

1. **Literature Review 文献综述**: Survey IMU research for our IMU module 为我们的IMU模块调查IMU研究
2. **Dataset Discovery 数据集发现**: Find specialized IMU datasets beyond our main list 找到超出我们主列表的专业IMU数据集
3. **Algorithm Reference 算法参考**: Implement sensor fusion algorithms 实现传感器融合算法
4. **Citation Source 引用来源**: Proper academic citations for methodology 方法论的正确学术引用

**When to Use 何时使用**:

- **Phase 1 第1阶段**: Quick review of IMU processing techniques IMU处理技术快速回顾
- **Phase 2 第2阶段**: Deep dive into sensor fusion algorithms 深入传感器融合算法
- **Phase 3 第3阶段**: Comprehensive related work section for papers 论文全面相关工作部分

---

### 8.2 Awesome-Human-Activity-Recognition

**Repository 仓库**: <https://github.com/haoranD/Awesome-Human-Activity-Recognition>

#### What's Included 包含内容

- HAR (Human Activity Recognition 人类活动识别) papers and surveys 论文和综述
- Public datasets for activity recognition 活动识别公共数据集
- Deep learning methods for HAR 用于HAR的深度学习方法
- Sensor-based and vision-based approaches 基于传感器和基于视觉的方法
- Benchmark results and performance comparisons 基准结果和性能比较
- Code implementations and pretrained models 代码实现和预训练模型

#### Why It's Valuable 为什么有价值

✅ **Comprehensive HAR Research Overview 全面的HAR研究概述**:

- Compare our approach to state-of-art methods 将我们的方法与最先进方法比较
- Discover relevant datasets with labeled exercise data 发现带标注运动数据的相关数据集
- Find baseline algorithms for comparison 找到用于比较的基线算法
- Access recent papers (last 2 years) for related work 访问最近论文（过去2年）用于相关工作

**Best Use Cases 最佳用例**:

1. **Survey HAR Methods 调查HAR方法**: Understand exercise recognition approaches 理解运动识别方法
2. **Dataset Mining 数据集挖掘**: Find datasets with labeled exercise data 找到带标注运动数据的数据集
3. **Benchmark Comparisons 基准比较**: Compare against published baselines 与已发表基线比较
4. **Implementation Reference 实现参考**: Access code for HAR algorithms 访问HAR算法代码

**When to Use 何时使用**:

- **Phase 1 第1阶段**: Understand HAR landscape 理解HAR格局
- **Phase 2 第2阶段**: Implement baseline algorithms for comparison 实现基线算法用于比较
- **Phase 3 第3阶段**: Comprehensive related work and benchmark section 全面相关工作和基准部分

---

### 8.3 Using Curated Lists Effectively 有效使用精选列表

#### For Research Phase 研究阶段

**Step-by-step approach 分步方法**:

1. **Start with Awesome-IMU-Sensing 从Awesome-IMU-Sensing开始**:
   - Survey sensor fusion research 调查传感器融合研究
   - Find IMU-specific datasets 找到IMU特定数据集
   - Identify preprocessing techniques 识别预处理技术
   - Note recent papers (2023-2025 注意最近论文，2023-2025)

2. **Move to Awesome-HAR 转到Awesome-HAR**:
   - Survey exercise recognition methods 调查运动识别方法
   - Find activity recognition datasets 找到活动识别数据集
   - Compare deep learning approaches 比较深度学习方法
   - Identify benchmark baselines 识别基准基线

3. **Mine for Datasets 挖掘数据集**:
   - Cross-reference with our existing list 与我们现有列表交叉引用
   - Look for recently added datasets 查找最近添加的数据集
   - Check for specialized use cases (sports, fitness 检查专业用例，体育、健身)

4. **Find Recent Papers 找到最近论文**:
   - Sort by date (prefer 2023-2025 按日期排序，偏好2023-2025)
   - Focus on papers with code available 关注有代码可用的论文
   - Note highly cited works 注意高引用作品

#### For Development Phase 开发阶段

**Practical applications 实际应用**:

- **Reference Implementations 参考实现**: Find code for sensor fusion algorithms 找到传感器融合算法代码
- **Preprocessing Techniques 预处理技术**: Learn IMU signal filtering, smoothing 学习IMU信号过滤、平滑
- **Feature Engineering 特征工程**: Discover effective IMU features 发现有效的IMU特征
- **Model Architectures 模型架构**: Study successful deep learning designs 研究成功的深度学习设计

**Example workflow 示例工作流**:

```bash
# Clone Awesome repos for offline reference 克隆Awesome仓库供离线参考
git clone https://github.com/rh20624/Awesome-IMU-Sensing.git
git clone https://github.com/haoranD/Awesome-Human-Activity-Recognition.git

# Extract dataset links 提取数据集链接
grep -E "http.*dataset" Awesome-IMU-Sensing/README.md > imu_datasets.txt

# Find recent papers (manually check dates 找到最近论文，手动检查日期)
grep -E "2024|2025" Awesome-Human-Activity-Recognition/README.md
```

#### For Publication Phase 发表阶段

**Building your related work section 构建您的相关工作部分**:

1. **Comprehensive Coverage 全面覆盖**:
   - Use lists to ensure you didn't miss major work 使用列表确保您没有错过重要工作
   - Cite representative papers from each category 引用每个类别的代表性论文
   - Demonstrate thorough literature review 展示彻底的文献综述

2. **Proper Comparison 正确比较**:
   - Compare against state-of-art from recent years 与近年来最先进的比较
   - Reference benchmark results from papers 引用论文中的基准结果
   - Position your work in context 将您的工作置于背景中

3. **Citation Quality 引用质量**:
   - Cite original papers, not just surveys 引用原始论文，不仅仅是综述
   - Include both classic and recent work 包括经典和最近的工作
   - Balance breadth and depth 平衡广度和深度

**Example related work structure 示例相关工作结构**:

```
Related Work 相关工作:
├── IMU-based Exercise Recognition 基于IMU的运动识别
│   ├── Classical ML approaches 经典ML方法 [cite 3-5 papers 引用3-5篇论文]
│   ├── Deep learning methods 深度学习方法 [cite 5-7 papers 引用5-7篇论文]
│   └── Commercial systems 商业系统 [cite 2-3 systems 引用2-3个系统]
├── Vision-based Pose Estimation 基于视觉的姿态估计
│   ├── 2D pose estimation 2D姿态估计 [cite 3-5 papers 引用3-5篇论文]
│   ├── 3D pose reconstruction 3D姿态重建 [cite 3-5 papers 引用3-5篇论文]
│   └── Real-time methods 实时方法 [cite 2-4 papers 引用2-4篇论文]
└── Multimodal Sensor Fusion 多模态传感器融合
    ├── IMU + Vision fusion IMU+视觉融合 [cite 3-5 papers 引用3-5篇论文]
    ├── Sensor fusion algorithms 传感器融合算法 [cite 2-4 papers 引用2-4篇论文]
    └── Real-time multimodal systems 实时多模态系统 [cite 2-3 papers 引用2-3篇论文]

Total 总计: ~25-35 citations (appropriate for CHI/IMWUT paper 适合CHI/IMWUT论文)
```

#### Update Strategy 更新策略

**How often to check 检查频率**:

- **Initial review 初步回顾**: Spend 2-3 hours thoroughly reviewing both lists 花2-3小时彻底回顾两个列表
- **Regular updates 定期更新**: Check quarterly for new additions 每季度检查新增内容
- **Pre-submission 提交前**: Final check before paper submission 论文提交前最终检查

**What to look for 查找内容**:

- ✅ Recently added datasets (might be more relevant 最近添加的数据集，可能更相关)
- ✅ Papers from 2024-2025 (most recent work 2024-2025年论文，最新工作)
- ✅ Papers with code available (for comparison 有代码可用的论文，用于比较)
- ✅ Highly starred/forked repos (quality indicator 高星/分叉仓库，质量指标)

**Community contribution 社区贡献**:

- Both repositories are actively maintained 两个仓库都积极维护
- Community contributions add new papers regularly 社区贡献定期添加新论文
- You can contribute by adding our work after publication 发表后您可以通过添加我们的工作做出贡献

---

### 8.4 Additional Awesome Lists (Secondary Priority) 其他Awesome列表（次要优先级）

#### Awesome-Pose-Estimation

**Repository 仓库**: Various (search GitHub for "awesome-pose-estimation" 各种，在GitHub搜索"awesome-pose-estimation")

**Use for 用于**:

- Comprehensive pose estimation methods 全面的姿态估计方法
- Pre-trained model links 预训练模型链接
- Benchmark comparisons 基准比较

#### Awesome-Fitness-Tech

**Note 注意**: Less formal but useful for commercial product research 不太正式但对商业产品研究有用

**Use for 用于**:

- Surveying commercial fitness products 调查商业健身产品
- Understanding market landscape 理解市场格局
- Identifying feature gaps 识别功能差距

---

### Quick Reference: When to Use Each Resource 快速参考：何时使用每个资源

| Phase 阶段 | Awesome-IMU-Sensing | Awesome-HAR | Priority 优先级 |
|-------|---------------------|-------------|----------|
| **MVP (Month 1-3) MVP（第1-3个月）** | Quick IMU technique review 快速IMU技术回顾 | Quick HAR overview 快速HAR概述 | Low 低 |
| **Development (Month 3-6) 开发（第3-6个月）** | Algorithm implementation 算法实现 | Baseline comparison 基线比较 | Medium 中等 |
| **Research (Month 6-12) 研究（第6-12个月）** | Comprehensive literature 全面文献 | Related work section 相关工作部分 | High 高 |
| **Publication (Month 12+) 发表（第12个月+）** | Citation completeness 引用完整性 | State-of-art comparison 最先进比较 | High 高 |

**Pro Tip 专业提示**: Bookmark both repositories and check the "Recently Updated" section monthly for new papers and datasets.

将两个仓库加入书签，每月检查"最近更新"部分获取新论文和数据集。

---

## Summary: Immediate Action Items 摘要：立即行动项

### Week 1 Tasks (Do NOW) 第1周任务（立即执行）

✅ **Download MM-Fit 下载MM-Fit**:

```bash
git clone https://github.com/KDMStromback/mm-fit.git
# Follow download instructions on GitHub 遵循GitHub上的下载说明
```

✅ **Download RecoFit 下载RecoFit**:

```bash
git clone https://github.com/microsoft/Exercise-Recognition-from-Wearable-Sensors.git
```

✅ **Apply for Fit3D Access 申请Fit3D访问权限**:

- Visit 访问: <https://fit3d.imar.ro/>
- Prepare research description 准备研究描述
- Submit application 提交申请

✅ **Download FLAG3D (optional, lower priority 可选，较低优先级)** :

- Visit 访问: <https://andytang15.github.io/FLAG3D/>
- Download dataset 下载数据集

### Month 1-2 Tasks 第1-2个月任务

✅ **Benchmark on MM-Fit 在MM-Fit上基准测试**:

- Test pose estimation accuracy 测试姿态估计精度
- Validate sensor fusion approach 验证传感器融合方法
- Measure baseline performance 测量基线性能

✅ **Test IMU on RecoFit 在RecoFit上测试IMU**:

- Validate rep counting 验证次数计数
- Test exercise recognition 测试运动识别
- Compare IMU-only vs. multimodal 比较仅IMU与多模态

✅ **Setup Evaluation Pipeline 设置评估管道**:

- Implement COCO AP calculation 实现COCO AP计算
- Setup latency measurement 设置延迟测量
- Design user study protocol 设计用户研究协议

### Month 3-6 Tasks 第3-6个月任务

✅ **If Fit3D Approved 如果Fit3D批准**:

- Download dataset 下载数据集
- Benchmark against AIFit 与AIFit基准比较
- Compare feedback quality 比较反馈质量

✅ **Prepare Custom Dataset Collection 准备自定义数据集收集**:

- Design IRB protocol 设计IRB协议
- Identify participants 识别参与者
- Setup data collection pipeline 设置数据收集管道

### Research Publication Timeline 研究发表时间线

- **Month 6 第6个月**: Submit IRB application 提交IRB申请
- **Month 8-10 第8-10个月**: Collect custom dataset 收集自定义数据集
- **Month 10-12 第10-12个月**: Analyze data, write paper 分析数据、撰写论文
- **Month 12 第12个月**: Submit to CHI/IMWUT/CVPR 提交至CHI/IMWUT/CVPR

---

**Last Updated 最后更新**: December 2025
**Maintainer 维护者**: Movement Chain AI Research Team 研究团队
**Next Review 下次审查**: Monthly (active development phase 每月，活跃开发阶段)

**Questions or Suggestions 问题或建议?** Open an issue in the documentation repo. 在文档仓库中提交issue。

---

## Quick Reference 快速参考

### Dataset Access URLs 数据集访问网址

- **Fit3D**: <https://fit3d.imar.ro/> (application required 需要申请)
- **MM-Fit**: <https://mmfit.github.io/> (public 公开)
- **FLAG3D**: <https://andytang15.github.io/FLAG3D/> (public 公开)
- **RecoFit**: <https://github.com/microsoft/Exercise-Recognition-from-Wearable-Sensors> (public 公开)
- **motion-sense**: <https://github.com/mmalekzadeh/motion-sense> (public 公开)
- **COCO**: <https://cocodataset.org/#keypoints-2020> (public 公开)
- **MPII**: <http://human-pose.mpi-inf.mpg.de/> (public 公开)

### Benchmark Targets 基准目标

- **Pose Accuracy 姿态精度**: ≥72% COCO AP
- **Mobile FPS 移动FPS**: 30+ FPS
- **Latency 延迟**: <100ms end-to-end 端到端
- **Battery 电池**: <20%/hour drain 每小时消耗
- **Cloud Cost 云成本**: <$20 per 1M inferences 每100万推理

### Publication Venues 发表会议/期刊

- **CHI**: May (deadline ~September 5月，截止日期约9月)
- **IMWUT**: Rolling submissions 滚动提交
- **CVPR**: June (deadline ~November 6月，截止日期约11月)
