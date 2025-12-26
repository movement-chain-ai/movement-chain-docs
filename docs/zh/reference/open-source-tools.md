# 开源工具与代码库 (Open Source Tools & Repositories)

> 运动分析相关的开源项目、库和工具

---

## 概述 (Overview)

本文档收录可加速 Movement Chain AI 开发的开源资源：

- **高尔夫专用** - 挥杆分析项目
- **姿态估计** - 通用人体姿态检测
- **时序分析** - DTW 和序列比较
- **开发工具** - ML 框架和库

---

## 高尔夫挥杆分析 (Golf Swing Analysis)

### 1. GolfDB / SwingNet

**标准的挥杆相位检测实现。**

| 项目 | 链接 |
|------|------|
| GitHub | [wmcnally/golfdb](https://github.com/wmcnally/golfdb) |
| Stars | ~200 |
| License | MIT |
| 语言 | Python (PyTorch) |

**功能**：

- 8 相位挥杆检测模型
- 预训练权重
- GolfDB 数据集下载脚本
- 训练/评估代码

**使用方式**：

```bash
git clone https://github.com/wmcnally/golfdb.git
cd golfdb
# 下载预训练模型
wget https://github.com/wmcnally/golfdb/releases/download/v1.0/swingnet_1800.pth.tar
```

---

### 2. golf-swing-analysis (HeleenaRobert)

**基于 MediaPipe 的高尔夫挥杆分析。**

| 项目 | 链接 |
|------|------|
| GitHub | [HeleenaRobert/golf-swing-analysis](https://github.com/HeleenaRobert/golf-swing-analysis) |
| Stars | ~50 |
| License | MIT |
| 语言 | Python |

**功能**：

- MediaPipe Pose 集成
- 挥杆角度计算
- 视频处理 pipeline
- 简单的反馈生成

**适用场景**：

- 快速原型验证
- MediaPipe 集成参考
- 角度计算算法参考

---

### 3. golftracker (PyPI)

**命令行高尔夫挥杆分析工具。**

| 项目 | 链接 |
|------|------|
| PyPI | [golftracker](https://pypi.org/project/golftracker/) |
| GitHub | 搜索 golftracker |
| 语言 | Python |

**安装**：

```bash
pip install golftracker
```

**功能**：

- 视频挥杆检测
- 关键帧提取
- 基础统计分析

---

## 姿态估计 (Pose Estimation)

### 4. MediaPipe Pose

**Google 的实时人体姿态检测。**

| 项目 | 链接 |
|------|------|
| 官网 | [mediapipe.dev](https://mediapipe.dev/) |
| GitHub | [google/mediapipe](https://github.com/google/mediapipe) |
| Stars | 26k+ |
| License | Apache 2.0 |

**关键特性**：

- 33 个身体关键点
- 30+ FPS 移动端性能
- Flutter/iOS/Android SDK
- Web 版本可用

**Movement Chain AI 使用**：

```python
import mediapipe as mp

mp_pose = mp.solutions.pose
pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=1,  # 0=lite, 1=full, 2=heavy
    min_detection_confidence=0.5
)

# 处理视频帧
results = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
landmarks = results.pose_landmarks
```

---

### 5. DeepLabCut

**科研级姿态估计框架。**

| 项目 | 链接 |
|------|------|
| GitHub | [DeepLabCut/DeepLabCut](https://github.com/DeepLabCut/DeepLabCut) |
| Stars | 4k+ |
| License | LGPL |
| 文档 | [deeplabcut.github.io](https://deeplabcut.github.io/DeepLabCut/) |

**适用场景**：

- 需要自定义关键点（如球杆、球位置）
- 需要高精度标注
- 学术研究发表

**注意**：计算量大，不适合实时移动端。

---

## 时序分析 (Time Series Analysis)

### 6. dtw-python

**标准 DTW (Dynamic Time Warping) 实现。**

| 项目 | 链接 |
|------|------|
| GitHub | [DynamicTimeWarping/dtw-python](https://github.com/DynamicTimeWarping/dtw-python) |
| PyPI | [dtw-python](https://pypi.org/project/dtw-python/) |
| Stars | 200+ |
| License | MIT |

**安装与使用**：

```bash
pip install dtw-python
```

```python
from dtw import dtw

# 比较两个挥杆的 IMU 序列
alignment = dtw(swing_a, swing_b, keep_internals=True)
distance = alignment.distance
normalized_distance = alignment.normalizedDistance

# 可视化对齐路径
alignment.plot(type="threeway")
```

**Movement Chain AI 应用**：

- 用户挥杆与模板比较
- 挥杆一致性评估
- 相位对齐验证

---

### 7. tslearn

**时间序列机器学习库。**

| 项目 | 链接 |
|------|------|
| GitHub | [tslearn-team/tslearn](https://github.com/tslearn-team/tslearn) |
| 文档 | [tslearn.readthedocs.io](https://tslearn.readthedocs.io/) |
| Stars | 2.5k+ |

**功能**：

- DTW 变体 (soft-DTW, DTW Barycenter)
- 时序聚类
- 时序分类

---

## ML 框架与工具 (ML Frameworks)

### 8. ONNX Runtime

**跨平台 ML 推理引擎。**

| 项目 | 链接 |
|------|------|
| GitHub | [microsoft/onnxruntime](https://github.com/microsoft/onnxruntime) |
| Stars | 13k+ |
| License | MIT |

**Movement Chain AI 使用**：

- MVP1 使用 MediaPipe 内置 TFLite，无需独立 ONNX Runtime
- Phase 2+ 考虑 RTMPose 等自定义模型部署时引入

---

### 9. TensorFlow Lite

**移动端 ML 推理。**

| 项目 | 链接 |
|------|------|
| 官网 | [tensorflow.org/lite](https://www.tensorflow.org/lite) |
| GitHub | [tensorflow/tensorflow](https://github.com/tensorflow/tensorflow) |

**与 ONNX Runtime 对比**：

| 特性 | ONNX Runtime | TF Lite |
|------|-------------|---------|
| 模型来源 | 多框架 | TensorFlow |
| Flutter 支持 | 需封装 | 官方插件 |
| 性能 | 相当 | 相当 |

---

## IMU 处理库 (IMU Processing)

### 10. AHRS (Python)

**姿态估计算法库。**

| 项目 | 链接 |
|------|------|
| GitHub | [Mayitzin/ahrs](https://github.com/Mayitzin/ahrs) |
| PyPI | [ahrs](https://pypi.org/project/ahrs/) |

**功能**：

- Madgwick/Mahony 滤波器
- 四元数运算
- 传感器融合

```python
from ahrs.filters import Madgwick

madgwick = Madgwick()
Q = madgwick.updateIMU(Q_prev, gyr=gyro_data, acc=acc_data)
```

---

### 11. imusensor (ESP32)

**ESP32 IMU 库。**

| 项目 | 链接 |
|------|------|
| GitHub | 搜索 "ESP32 IMU library" |
| 平台 | Arduino/PlatformIO |

**适用**：LSM6DSV16X 数据读取

---

## 工具对比表 (Tool Comparison)

| 工具 | 用途 | Stars | 难度 | 推荐 |
|------|------|-------|------|------|
| **GolfDB/SwingNet** | 相位检测 | 200 | 中 | 必用 |
| **MediaPipe** | 姿态估计 | 26k | 低 | 必用 |
| **dtw-python** | 序列比较 | 200 | 低 | 必用 |
| **DeepLabCut** | 高精度姿态 | 4k | 高 | 可选 |
| **ONNX Runtime** | 模型部署 | 13k | 中 | 推荐 |
| **AHRS** | IMU 融合 | - | 中 | 推荐 |

---

## 快速开始 (Quick Start)

### MVP 必装依赖

```bash
# 创建环境
conda create -n golf-analysis python=3.10
conda activate golf-analysis

# 核心库
pip install mediapipe         # 姿态估计
pip install dtw-python        # 序列比较
pip install onnxruntime      # 模型推理
pip install ahrs             # IMU 处理

# 可选：高尔夫专用
pip install golftracker      # 挥杆分析工具
```

### 克隆参考项目

```bash
# GolfDB - 必读参考
git clone https://github.com/wmcnally/golfdb.git

# 高尔夫分析示例
git clone https://github.com/HeleenaRobert/golf-swing-analysis.git
```

---

## 相关文档

- [高尔夫生物力学研究](golf-research.md) - 学术论文
- [学术数据集](academic-datasets.md) - 通用运动数据
- [SDK 选型](../design/decisions/sdk-selection.md) - 技术选型决策
- [ML 基础](../prerequisites/ml-basics.md) - 机器学习概念

---

**Last Updated**: December 2025
**Maintainer**: Movement Chain AI Team
