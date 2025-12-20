# ML 基础入门

> **适用读者**: 不了解机器学习但需要理解项目技术的团队成员
>
> **核心结论**: 我们大部分传感器数据处理**不需要 ML 训练**，用物理公式和信号处理即可

---

## 什么是 ML？一句话解释

```text
机器学习 = 让电脑从数据中"学习"规律，而不是人工写规则

传统编程: 人写规则 → 电脑执行
机器学习: 电脑看数据 → 自己总结规则
```

---

## 训练 vs 推理

!!! info "最常见的 ML 误区"
    很多人以为"用 ML"就要"训练模型"。实际上，我们可以**用别人训练好的模型**，自己只做推理。

### 类比理解

```text
训练 (Training) = 教小孩认字
├── 一次性的过程（可能几小时到几天）
├── 需要大量数据（比如 1000 个挥杆视频）
├── 需要 GPU 算力
└── 完成后得到一个"模型文件"（几 MB）

推理 (Inference) = 小孩已经会认字了，现在看新的字
├── 实时的过程（毫秒级）
├── 只需要模型文件
├── 手机就能跑
└── 用户每次挥杆都在做推理
```

### 我们的策略

| 层 | 任务 | 是否需要训练 | 说明 |
|----|-----|-------------|------|
| 姿态估计 | 从图像识别骨架 | ❌ 用别人的 | MediaPipe 已训练好 |
| 挥杆阶段 | 识别 8 个阶段 | ⚠️ 可用现成 | GolfDB/SwingNet 有预训练 |
| 动作评估 | 判断对错 | ❌ 用规则 | IF-THEN 规则引擎 |
| NLP 反馈 | 生成建议 | ❌ 调 API | GPT/Claude API |

**结论**: MVP 阶段我们**不需要训练任何模型**。

---

## 五层 ML 应用地图

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    高尔夫挥杆分析 ML 应用地图                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 第1层: 姿态估计 (Pose Estimation)                                  │   │
│  │                                                                   │   │
│  │ 输入: 视频帧 (RGB 图像)                                           │   │
│  │ 输出: 33 个关节点坐标                                             │   │
│  │ 方案: MediaPipe Pose ← 直接用，不需要训练                         │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                                           │
│                              ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 第2层: 3D 提升 (Lifting) - MVP 不做                                │   │
│  │                                                                   │
│  │ OnForm 有，我们用 IMU 替代                                        │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                                           │
│                              ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 第3层: 挥杆阶段检测 (Swing Phase Detection)                        │   │
│  │                                                                   │   │
│  │ 输入: 关节坐标序列 + IMU 数据                                     │   │
│  │ 输出: 8 个阶段分割点                                              │   │
│  │ 方案: IMU 角速度零点检测 (规则) / GolfDB SwingNet (预训练 ML)     │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                                           │
│                              ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 第4层: 动作质量评估 (Form Assessment)                              │   │
│  │                                                                   │   │
│  │ 输入: 各阶段的关节角度 + 速度 + 肌肉数据                          │   │
│  │ 输出: 评分 + 问题诊断                                             │   │
│  │ 方案: 规则引擎 9 条 IF-THEN ← 不需要 ML                           │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                              │                                           │
│                              ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 第5层: 自然语言反馈 (NLP Feedback)                                 │   │
│  │                                                                   │   │
│  │ 输入: 结构化诊断结果                                              │   │
│  │ 输出: 人类可读的建议                                              │   │
│  │ 方案: GPT-4 / Claude API ← 调接口即可                             │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## IMU 数据: 不需要 ML

### 原始数据长什么样

```python
# IMU 每 10ms 输出一次
{
    "timestamp": 0.010,
    "gyro_x": 2.3,       # °/s 左右旋转
    "gyro_y": -1.1,      # °/s 前后俯仰
    "gyro_z": 856.2,     # °/s 手腕翻转 ← 最重要
    "accel_x": 0.2,      # g (重力倍数)
    "accel_y": -0.1,
    "accel_z": 12.5      # 击球冲击力
}
```

### 用物理公式计算特征

| 指标 | 公式 | 说明 |
|-----|------|------|
| **峰值速度** | `max(abs(gyro_z))` | 挥杆最快时刻 |
| **上杆顶点** | gyro_z 过零点 | 速度从负变正的瞬间 |
| **节奏比** | 上杆时间 / 下杆时间 | 理想 3:1 |
| **击球瞬间** | accel_z 突然飙升 | 加速度峰值 |

### Python 代码

```python
import numpy as np

def extract_imu_features(gyro_z, timestamps):
    """纯物理公式，不需要 ML"""

    # 1. 峰值角速度
    peak_velocity = np.max(np.abs(gyro_z))

    # 2. 上杆顶点 (找零点交叉)
    zero_crossings = np.where(np.diff(np.sign(gyro_z)))[0]
    top_of_backswing = timestamps[zero_crossings[0]]

    # 3. 节奏比
    backswing_time = top_of_backswing - timestamps[0]
    peak_time = timestamps[np.argmax(np.abs(gyro_z))]
    downswing_time = peak_time - top_of_backswing
    tempo_ratio = backswing_time / downswing_time

    return {
        'peak_velocity': peak_velocity,  # 理想 > 1200°/s
        'tempo_ratio': tempo_ratio,       # 理想 3:1
    }
```

### 研究验证

> "IMU 与 3D 动捕系统对比，绝对平均差异仅 0.61-1.67 度"
> — [IMU Validation Study (PMC10611231)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10611231/)

---

## EMG 数据: 不需要 ML

### 原始数据长什么样

```python
# EMG 每 5ms 输出一次 (200Hz)
{
    "timestamp": 0.005,
    "forearm": 0.00023,  # 前臂肌肉电压 (μV 级别)
    "core": 0.00015      # 核心肌肉电压
}
```

### 信号处理流程

```text
原始EMG → 滤波 → 整流 → RMS包络 → 归一化 → 特征

1. 带通滤波: 30-500Hz (去噪)
2. 整流: 取绝对值
3. RMS包络: 滑动窗口平均
4. 归一化: 0-100%
```

### Python 代码

```python
import neurokit2 as nk  # pip install neurokit2

def process_emg(raw_emg, sampling_rate=200):
    """信号处理，不是 ML"""

    # 1. 清洁信号 (滤波)
    cleaned = nk.emg_clean(raw_emg, sampling_rate=sampling_rate)

    # 2. 提取包络 (RMS)
    envelope = nk.emg_amplitude(cleaned)

    # 3. 检测激活时刻 (阈值法)
    activation = nk.emg_activation(cleaned)

    return envelope, activation['EMG_Onsets']

def check_activation_sequence(forearm_onset, core_onset):
    """核心应该先于前臂激活"""
    return core_onset < forearm_onset  # True = 正确
```

### 研究依据

> "有效球员呈现一致的'雪崩模式': 右菱形肌先激活，然后右斜方肌..."
> — [EMG Golf Study (PMC4851105)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4851105/)

---

## 开源工具汇总

### 可直接使用 (不需要训练)

!!! success "一键安装所有依赖"
    ```bash
    pip install mediapipe neurokit2 scipy numpy imufusion opencv-python
    ```

| 工具 | Stars | 功能 | 安装 |
|-----|-------|------|------|
| **MediaPipe Pose** | 28k⭐ | 33 关键点姿态估计 | `pip install mediapipe` |
| **NeuroKit2** | 1.9k⭐ | EMG 信号处理 | `pip install neurokit2` |
| **imufusion** | 1.7k⭐ | IMU AHRS 融合 | `pip install imufusion` |
| **scipy** | 12k⭐ | 信号滤波、峰值检测 | `pip install scipy` |
| **NumPy** | 27k⭐ | 零点交叉、基础计算 | `pip install numpy` |
| **OpenCV** | 80k⭐ | 视频处理 | `pip install opencv-python` |

### 有预训练模型 (可选)

| 工具 | Stars | 功能 | 链接 |
|-----|-------|------|------|
| **GolfDB/SwingNet** | 300+⭐ | 8 阶段检测 (71.5% 准确率) | [wmcnally/golfdb](https://github.com/wmcnally/golfdb) |
| **RTMPose** | 35k⭐ | 高精度姿态估计 (AP 75.8%) | [open-mmlab/mmpose](https://github.com/open-mmlab/mmpose) |
| **YOLO11-Pose** | 60k⭐ | 超快姿态估计 (200+ FPS) | [ultralytics/ultralytics](https://github.com/ultralytics/ultralytics) |

### 高尔夫挥杆分析参考仓库

| 仓库 | Stars | 功能 | 技术栈 |
|-----|-------|------|--------|
| [wmcnally/golfdb](https://github.com/wmcnally/golfdb) | 300+⭐ | 1400 视频数据集 + SwingNet | PyTorch |
| [HeleenaRobert/golf-swing-analysis](https://github.com/HeleenaRobert/golf-swing-analysis) | 50+⭐ | MediaPipe + 角度计算 | Python |
| [oswinkil-git/AICaddy](https://github.com/oswinkil-git/AICaddy-A-Golf-Club-Tracer) | 20+⭐ | 6000+ 球杆头图像 + YOLOv8 | Python |
| [Strojove-uceni/23206-final-pose-estimation](https://github.com/Strojove-uceni/23206-final-pose-estimation-for-swing-improvement) | 10+⭐ | 完整挥杆分析 + 反馈 | Python |

---

## MediaPipe vs ONNX

!!! question "常见困惑: MediaPipe 和 ONNX 是什么关系？"

```text
MediaPipe 和 ONNX 不是二选一的关系！

MediaPipe = 一个完整的工具包 (包含模型+推理引擎)
          = 买现成的预制菜，加热就能吃

ONNX = 一个模型格式 (需要配合推理引擎)
     = 买食材，自己选锅来做

我们的策略:
├── 姿态估计 → MediaPipe (现成好用)
├── 挥杆检测 → ONNX (SwingNet 是 PyTorch 的)
└── 两个可以同时用在一个 App 里
```

详细选型理由见: [ADR-0006 ONNX Runtime 部署](../decisions/0006-onnx-runtime-deployment.md)

---

## 我们 vs 竞品的 ML 使用对比

| 层 | OnForm | 我们 | 差异 |
|----|--------|-----|------|
| 姿态估计 | Core ML (自研) | MediaPipe | 他们自己训练，我们用现成 |
| 3D 重建 | Lifting Network | ❌ 不做 | 用 IMU 替代 |
| 阶段检测 | 可能 ML | 规则/SwingNet | 都不需要自己训练 |
| 动作评估 | 未知 | 规则引擎 | 我们完全不用 ML |
| NLP 反馈 | 可能有 | GPT/Claude API | 调接口 |

**结论**: OnForm 需要自己训练姿态估计和 3D 模型；我们**全部借用现成工具**，专注产品体验。

---

## 相关文档

- [系统设计](../architecture/system-design.md) - IMU/EMG 完整处理代码
- [SDK 选型](sdk-selection.md) - MediaPipe、NeuroKit2 等工具
- [ADR-0006 ONNX Runtime](../decisions/0006-onnx-runtime-deployment.md) - 为什么选 ONNX

---

## 研究来源

- [IMU Validation for Golf Swing](https://pmc.ncbi.nlm.nih.gov/articles/PMC10611231/)
- [EMG Golf Swing Activation Patterns](https://pmc.ncbi.nlm.nih.gov/articles/PMC4851105/)
- [Muscle Onset Activation Sequences](https://pmc.ncbi.nlm.nih.gov/articles/PMC4925984/)
- [GolfDB SwingNet Paper](https://github.com/wmcnally/golfdb)

---

**最后更新**: 2025 年 12 月 13 日
