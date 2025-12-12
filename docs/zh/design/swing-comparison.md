# 挥杆对比策略 Swing Comparison Strategy

> **核心问题**: 用户挥杆数据应该与什么进行比较？如何量化"好"与"坏"？
>
> **本文档**: 定义全身数据采集方案 + 四种对比方法 + MVP 推荐策略

---

## 全身数据采集 Full-Body Data Collection

### MediaPipe 33 关键点 (按高尔夫相关性)

MediaPipe Pose 输出 33 个 3D 关键点。以下按高尔夫挥杆分析的相关性分组：

| 身体区域 | 关键点索引 | 高尔夫意义 |
|---------|-----------|-----------|
| **躯干核心** | 11-12 (肩), 23-24 (髋) | X-Factor 旋转角度 |
| **手臂** | 13-16 (肘, 腕) | 球杆路径, 释放时机 |
| **手部** | 17-22 (详细手指点) | 握杆, 手腕角度 |
| **腿部** | 25-28 (膝, 踝) | 重心转移, 稳定性 |
| **足部** | 29-32 (脚跟, 脚尖) | 站姿, 轴心旋转 |

**关键计算**:

```python
# X-Factor = 肩膀旋转角度 - 髋部旋转角度
shoulder_angle = angle_between(keypoints[11], keypoints[12])  # 左右肩
hip_angle = angle_between(keypoints[23], keypoints[24])        # 左右髋
x_factor = shoulder_angle - hip_angle  # 职业选手: 45-55°
```

详见: [视觉软件 - 关键点格式](../components/vision/software.md#关键点格式-keypoint-format)

---

### IMU 放置位置 (研究验证)

基于 [PMC 研究](https://pmc.ncbi.nlm.nih.gov/articles/PMC11035581/)，最优传感器放置优先级：

| 优先级 | 位置 | 测量内容 | 采样率建议 |
|-------|------|---------|-----------|
| 1 | **手腕** | 球杆路径, 挥杆速度, 释放时机 | 200 Hz |
| 2 | **骨盆/腰部** | 髋部旋转, 重心转移 | 100 Hz |
| 3 | **头部** | 稳定性, 视线保持 | 100 Hz |
| 4 | **上背部** | 肩膀旋转, 躯干扭转 | 100 Hz |

**MVP 建议**: 从手腕开始 (Priority 1)，Phase 2 添加骨盆

**Mock 数据生成**:

```python
class FullBodyIMUMock:
    LOCATIONS = ['wrist', 'pelvis', 'upper_back']

    def generate_swing(self, location='wrist'):
        # 6轴数据: 3轴加速度 + 3轴角速度
        if location == 'wrist':
            # 手腕: 高峰值角速度 (下杆)
            peak_angular_velocity = 2000  # °/s
        elif location == 'pelvis':
            # 骨盆: 先于手腕启动
            lead_time_ms = 50  # 髋领先手腕 50ms
```

详见: [IMU 硬件规格](../components/imu/hardware.md)

---

### EMG 肌群 (高尔夫力量链)

高尔夫挥杆的正确发力顺序 (Kinetic Chain):

```text
地面 → 双脚 → 腿部 → 髋关节 → 核心 → 肩膀 → 手臂 → 手腕 → 球杆
```

| 肌群 | 高尔夫阶段 | 激活模式 | 问题信号 |
|-----|----------|---------|---------|
| **核心 (腹斜肌)** | 下杆启动 | 早期激活 | 激活弱 = 力量链断裂 |
| **前臂屈肌** | 击球 | 晚期激活 | 早期激活 = 手臂代偿 |
| **臀大肌** | 重心转移 | 持续激活 | 不稳定 = 重心不稳 |
| **背阔肌** | 上杆-下杆过渡 | 峰值在顶点 | 峰值过早 = 力量泄漏 |

**问题检测规则**:

```python
def detect_compensation(emg_data):
    """检测手臂代偿问题"""
    core_activation = emg_data['core_obliques'].peak_time
    forearm_activation = emg_data['forearm_flexors'].peak_time

    # 正常: 核心先于前臂激活
    if forearm_activation < core_activation:
        return "手臂代偿: 前臂在核心之前激活"

    # 正常: 核心激活强度足够
    if emg_data['core_obliques'].amplitude < 0.4:
        return "核心不足: 激活强度过低"

    return "正常发力顺序"
```

详见: [EMG 硬件规格](../components/emg/hardware.md)

---

## 四种对比方法 Four Comparison Approaches

### 方法 A: 职业参考 (Pro Player Reference)

```text
你的挥杆 → DTW 对齐 → 与职业模板比较 → 相似度评分
```

**使用者**: [Sportsbox AI](https://www.sportsbox.ai/), [SWEE AI](https://www.swee.ai/)

**工作原理**:

1. 收集职业球员的姿态序列
2. 按身体比例归一化
3. 使用 DTW 进行时间对齐
4. 计算每个关节的距离

**优点**: 有明确的"金标准"
**缺点**: 职业动作对初学者可能不可达

**数据来源**: [GolfDB](https://github.com/wmcnally/golfdb) - 1400 个标注挥杆视频

---

### 方法 B: 个人最佳 (Personal Best / Self-Reference)

```text
你的挥杆 → 与你的最佳挥杆比较 → 差异分析
```

**使用者**: [18Birdies](https://18birdies.com/aicoach/)

**工作原理**:

1. 系统记录所有挥杆
2. 用户或系统标记"最佳"挥杆
3. 未来挥杆与个人最佳比较

**优点**: 目标现实可达, 跟踪个人进步
**缺点**: 没有外部"理想"指导

**实现**:

```python
class PersonalBestTracker:
    def __init__(self):
        self.swings = []
        self.best_swing = None

    def record_swing(self, swing_data, score=None):
        self.swings.append({
            'data': swing_data,
            'score': score,
            'timestamp': time.now()
        })

        # 自动更新最佳 (基于评分或用户标记)
        if score and (not self.best_swing or score > self.best_swing['score']):
            self.best_swing = self.swings[-1]

    def compare_to_best(self, current_swing):
        if not self.best_swing:
            return None
        return dtw_compare(current_swing, self.best_swing['data'])
```

---

### 方法 C: 统计参考 (Statistical Reference / Poze Method)

```text
~30 个"好"样本 → 计算每个关节的 μ (均值) & σ (方差)
你的挥杆 → 每个关节的 Z-Score → 好/坏分类
```

**使用者**: [Poze Framework](https://arxiv.org/html/2411.05734) (学术, 2024)

**工作原理**:

1. 收集约 30 个"理想"技术示例
2. 计算每个关节的平均距离 (μⱼ) 和方差 (σⱼ)
3. 新挥杆计算 Z-Score: `(distance - μ) / σ`
4. 如果大多数关节 Z-Score 低 → "好"

**优点**: 数据需求少 (~30 样本), 统计上稳健
**缺点**: 需要人工筛选"理想"样本

**实现**:

```python
import numpy as np

class StatisticalReference:
    def __init__(self, ideal_swings):
        """
        ideal_swings: List of (T, 33, 3) pose sequences
        """
        # 计算每个关节的统计量
        self.joint_stats = {}
        for joint_idx in range(33):
            distances = self._compute_pairwise_distances(ideal_swings, joint_idx)
            self.joint_stats[joint_idx] = {
                'mean': np.mean(distances),
                'std': np.std(distances)
            }

    def evaluate(self, user_swing, threshold=2.0):
        """
        返回每个关节的 Z-Score 和整体评估
        """
        scores = {}
        for joint_idx in range(33):
            dist = self._compute_distance_to_mean(user_swing, joint_idx)
            z_score = (dist - self.joint_stats[joint_idx]['mean']) / \
                      self.joint_stats[joint_idx]['std']
            scores[joint_idx] = z_score

        # 整体评估: 超过阈值的关节比例
        bad_joints = sum(1 for z in scores.values() if abs(z) > threshold)
        return {
            'joint_scores': scores,
            'overall': 'good' if bad_joints < 5 else 'needs_work',
            'bad_joint_count': bad_joints
        }
```

---

### 方法 D: 学习嵌入 (Learned Embedding / Neural Network)

```text
你的挥杆 → CNN/Transformer → 潜在空间 → 比较嵌入向量
```

**使用者**: [SwingNet/GolfDB](https://github.com/wmcnally/golfdb), [GolfMate](https://www.researchgate.net/publication/374686675)

**工作原理**:

1. 训练神经网络将挥杆编码到潜在空间
2. "好"挥杆在空间中聚集
3. 你的挥杆嵌入到"好"聚类的距离 = 质量

**优点**: 能捕捉微妙模式
**缺点**: 需要大数据集, 可解释性差

**Phase 3 考虑** - 当收集足够数据后

---

## DTW 对比管道 (核心算法)

所有方法都依赖 DTW (Dynamic Time Warping) 进行时间对齐:

```python
from dtw import dtw
import numpy as np

def compare_swings(user_sequence, reference_sequence):
    """
    比较两个挥杆序列

    Args:
        user_sequence: (T1, 33, 3) - 用户姿态序列
        reference_sequence: (T2, 33, 3) - 参考姿态序列

    Returns:
        similarity_score: 0-100 分
        per_joint_distances: 每个关节的距离
        alignment_path: DTW 对齐路径
    """
    # Step 1: 姿态归一化 (按身体比例)
    user_norm = normalize_pose(user_sequence)
    ref_norm = normalize_pose(reference_sequence)

    # Step 2: DTW 对齐
    user_flat = user_norm.reshape(len(user_norm), -1)  # (T1, 99)
    ref_flat = ref_norm.reshape(len(ref_norm), -1)      # (T2, 99)

    alignment = dtw(user_flat, ref_flat)

    # Step 3: 计算每个关节距离
    per_joint = {}
    for joint_idx in range(33):
        joint_dist = compute_aligned_joint_distance(
            user_norm[:, joint_idx],
            ref_norm[:, joint_idx],
            alignment.path
        )
        per_joint[joint_idx] = joint_dist

    # Step 4: 转换为 0-100 分
    avg_distance = np.mean(list(per_joint.values()))
    score = max(0, 100 - avg_distance * 50)  # 调整缩放因子

    return {
        'score': score,
        'per_joint': per_joint,
        'alignment': alignment.path
    }

def normalize_pose(keypoints):
    """按躯干长度归一化，以髋中点为中心"""
    hip_center = (keypoints[:, 23] + keypoints[:, 24]) / 2
    torso_length = np.linalg.norm(keypoints[:, 11] - keypoints[:, 23], axis=1).mean()
    return (keypoints - hip_center[:, np.newaxis]) / torso_length
```

**DTW 库推荐**:

| 库 | 特点 | 安装 |
|---|------|-----|
| [dtw-python](https://dynamictimewarping.github.io/python/) | 功能完整, 支持多维 | `pip install dtw-python` |
| [fastdtw](https://pypi.org/project/fastdtw/) | 速度快 O(N) vs O(N²) | `pip install fastdtw` |
| [tslearn](https://tslearn.readthedocs.io/) | 时序 ML 集成 | `pip install tslearn` |

详见: [视觉反馈 - DTW 实现](../platform/ml-training/visual-feedback.md#3-通过动态时间规整-dtw-的时间对齐-temporal-alignment-via-dynamic-time-warping)

---

## MVP 推荐策略

### Phase 1: 规则引擎 + 个人最佳

```text
┌─────────────────────────────────────────────────────────────┐
│  MVP 对比策略                                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. 记录用户前 10 次挥杆                                     │
│  2. 用户标记"最佳"挥杆 或 系统选择最高分                     │
│  3. 未来挥杆通过 DTW 与个人最佳比较                          │
│  4. 规则引擎标记具体问题 (X-Factor < 30°, 核心激活弱等)      │
│                                                              │
│  参考数据: 个人最佳 + 规则阈值                               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**为什么选择这个方法?**

- 不需要外部数据集
- 目标可达 (是用户自己的最佳)
- 规则提供可解释反馈
- 可以立即开始

---

### Phase 2: 添加职业参考库

```text
┌─────────────────────────────────────────────────────────────┐
│  Phase 2 增强                                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. 下载 GolfDB 视频                                        │
│  2. 运行 MediaPipe → 提取 33 关键点                         │
│  3. 归一化 + 存储为参考库                                    │
│  4. 用户可切换: 比较"我的最佳" vs "职业平均"                 │
│                                                              │
│  参考数据: 职业库 (GolfDB) + 个人最佳                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Phase 3: 统计/ML 方法

当收集 100+ 用户挥杆后:

- 应用 Poze 方法 (统计参考)
- 或训练 SwingNet 风格的嵌入网络
- 提供更细粒度的反馈

---

## 相关文档

- [系统设计](system-design.md) - 整体 MVP 管道架构
- [视觉反馈](../platform/ml-training/visual-feedback.md) - DTW 实现代码, UI 模式
- [视觉软件](../components/vision/software.md) - 关键点格式, RTMPose vs MediaPipe
- [SDK 选型指南](sdk-selection.md) - dtw-python 等库选择
- [术语表](00-glossary.md) - X-Factor, Kinetic Chain 等定义

---

## 参考来源

- [Poze Framework (2024)](https://arxiv.org/html/2411.05734) - DTW + Z-Score 方法
- [Sportsbox AI](https://www.sportsbox.ai/) - 职业挥杆对比
- [GolfDB/SwingNet](https://github.com/wmcnally/golfdb) - 1400 标注挥杆, 8 阶段检测
- [dtw-python](https://dynamictimewarping.github.io/python/) - DTW 实现
- [PMC IMU 研究](https://pmc.ncbi.nlm.nih.gov/articles/PMC11035581/) - 传感器放置
- [18Birdies](https://18birdies.com/aicoach/) - 个人最佳对比

---

**最后更新**: 2025年12月12日
