# Visual Feedback Design 视觉反馈设计指南

**版本 Version:** 1.0
**日期 Date:** 2025年12月1日
**状态 Status:** 生产就绪设计规范
**目的 Purpose:** 在运动纠正系统中实施基于研究的视觉反馈模式的综合指南

---

## 1. 基于研究的反馈模式 (Research-Backed Feedback Patterns)

### 1.1 叠加箭头：方向性运动指示器 (Overlay Arrows: Directional Movement Indicators)

#### 研究发现 (Research Findings)

**有效性 Effectiveness:**

- 参考和生成模式之间的持久叠加视觉反馈对"精炼视觉运动学习计划具有促进作用" ([Nature Scientific Reports, 2021](https://www.nature.com/articles/s41598-021-96876-6))
- 有视觉反馈的组表现出"比没有反馈的组更快的学习和更低的最终端点误差" ([ScienceDirect, 2016](https://www.sciencedirect.com/science/article/pii/S0306452216304584))

**定量结果 Quantitative Results:**

- 视觉增强反馈结合语言反馈显示**大效应量 (d = 8.352)**
- 视觉反馈持久性：相比非持久反馈，精度显著提高

**何时使用 When to Use:**

- ✅ 学习复杂运动的早期阶段
- ✅ 需要精确方向纠正的任务
- ✅ 与关于错误的语言反馈结合时
- ✅ 方向性纠正和基于路径的运动（高尔夫挥杆平面、运动轨迹）

**局限性 Limitations:**

- ⚠️ 如果持续提供，有反馈依赖的风险
- ⚠️ 对于没有教练协助的初学者效果较差
- ⚠️ 如果没有逐步撤回，可能无法很好地转化为保留

#### 箭头设计规范 (Arrow Design Specifications)

**视觉属性 Visual Properties:**

- **锚点 Anchor Point:** 附着到受影响的关节中心，而不是身体部分边缘
- **方向 Direction:** 指向纠正位置（3D 投影到 2D 屏幕）
- **长度 Length:** 与错误幅度成比例（最小: 20px, 最大: 80px）
- **粗细 Thickness:** 6-8px 描边宽度（可见但不突兀）
- **颜色 Color:** 基于错误严重性（见颜色调色板部分）

**动画规范 Animation Specifications:**

**状态 1: 出现（检测到错误）Appearance (Error Detected)**

```
动画 Animation: 淡入 + 放大 Fade-in + Scale-up
持续时间 Duration: 200ms
缓动 Easing: cubic-bezier(0.25, 0.1, 0.25, 1)
从 From: opacity 0%, scale 0.8
到 To: opacity 100%, scale 1.0
```

**状态 2: 活动错误（脉冲）Active Error (Pulsing)**

```
动画 Animation: 脉冲（不透明度变化）Pulse (opacity variation)
持续时间 Duration: 1000ms (1 Hz 频率)
缓动 Easing: Ease-in-out sine
从 From: opacity 80%
到 To: opacity 100%
循环 Loop: 错误持续时无限循环
```

**状态 3: 已纠正（退出）Corrected (Exit)**

```
动画 Animation: 淡出 + 缩小 + 对勾 Fade-out + Scale-down + Checkmark
持续时间 Duration: 300ms
缓动 Easing: cubic-bezier(0.42, 0, 0.58, 1)
从 From: opacity 100%, scale 1.0
到 To: opacity 0%, scale 0.7
最终 Final: 显示绿色对勾（150ms），然后淡出
```

---

### 1.2 幽灵虚拟角色：半透明正确姿态叠加 (Ghost Avatar: Semi-Transparent Correct Pose Overlay)

#### 研究发现 (Research Findings)

**有效性 Effectiveness:**

- 虚拟镜像中的**叠加熟练表现**显示出视角依赖的改进 ([Frontiers, 2019](https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2019.00043/full))
  - 前视图：参与者调整深蹲高度
  - 侧视图：参与者调整向后移动
- "虚拟角色手部动作的纠正支持运动技能的学习" ([ResearchGate, 2021](https://www.researchgate.net/publication/351475644_Correction_of_Avatar_Hand_Movements_Supports_Learning_of_a_Motor_Skill))

**最佳使用场景 Optimal Use Cases:**

- ✅ 全身运动学习（深蹲、瑜伽、太极）
- ✅ 第一人称视角训练
- ✅ 需要实时比较的复杂运动模式
- ✅ VR/AR 训练环境

#### 透明度规范 (Transparency Specifications)

**最佳不透明度级别（基于研究）Optimal Opacity Levels (Research-Backed):**

| 虚拟角色类型 Avatar Type | 推荐不透明度 Recommended Opacity | 颜色 Color | 目的 Purpose |
|-------------|-------------------|-------|---------|
| **用户的实时骨架 User's Live Skeleton** | 100% (α = 1.0) | 白色或浅蓝色 White or light blue (#E0F7FF) | 主要参考点 |
| **理想/专家幽灵 Ideal/Expert Ghost** | **50% (α = 0.5)** | 绿色 Green (#4CAF50) | 最佳平衡：可见但不突兀 |
| **之前的尝试 Previous Attempt** | 30% (α = 0.3) | 浅灰色 Light gray (#BDBDBD) | 上下文但不混乱 |

**实现示例 Implementation Example (CSS):**

```css
.ghost-skeleton {
  opacity: 0.5;
  stroke: #4CAF50;
  stroke-width: 3px;
  fill: none;
}

.live-skeleton {
  opacity: 1.0;
  stroke: #E0F7FF;
  stroke-width: 4px;
  fill: none;
}
```

**用户自定义 User Customization:**

- **不透明度滑块 Opacity Slider:** 30% 到 70% (默认 50%)
- **自动调暗 Auto-Dimming:** 在弱光条件下降低不透明度 20%
- **碰撞检测 Collision Detection:** 如果幽灵和实时骨架重叠 >80%，增加幽灵不透明度到 60% 以提高清晰度

---

### 1.3 并排比较：用户 vs. 专家表现 (Side-by-Side Comparison: User vs. Expert Performance)

#### 研究发现 (Research Findings)

**有效性 Effectiveness:**

- 观察两个虚拟角色（自己的 + 熟练表现）的组显示"相比仅观察自己表现的优势" ([Frontiers, 2019](https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2019.00043/full))
- **专家模型** 帮助学习者理解运动性质和形式
- **学习者模型** 促进自我效能

**最佳使用场景 Optimal Use Cases:**

- ✅ 基于视频的学习和表现后分析
- ✅ 当无法立即反馈时
- ✅ **对于高级学习者** 能够识别适当的运动
- ✅ 运动教练和技术改进

**局限性 Limitations:**

- ❌ **新手学习者** "除非由教练协助指出特定技能组件，否则无法使用视频反馈" ([Springer, 2021](https://link.springer.com/article/10.1007/s12662-021-00782-y))
- ❌ 新手无法在没有指导的情况下区分关键与非关键信息
- ❌ 对于复杂任务，不如实时并发反馈有效

#### 实施指南 (Implementation Guidelines)

**对于初学者 For Beginners:**

- 结合语言教练以突出特定技能组件
- 使用简化的比较指标
- 一次专注于一个运动方面
- 最初避免详细的并排比较

**对于高级用户 For Advanced Users:**

- 可以在没有广泛指导的情况下自我分析
- 从详细的运动学比较中受益
- 对微调技术更有效

---

### 1.4 颜色编码：视觉表现指示器 (Color Coding: Visual Performance Indicators)

#### 研究发现 (Research Findings)

**有效性 Effectiveness:**

- **颜色约定 Color conventions:** "红色代表'错误'，绿色代表'正确'"在运动学习中广泛受到尊重 ([Springer, 2012](https://link.springer.com/article/10.3758/s13423-012-0333-8))
- **肌肉激活颜色提示 Muscle activation color cues:** "显著增强了网球发球技能的学习，改善了肌肉协调" ([tandfonline.com, 2025](https://www.tandfonline.com/doi/full/10.1080/02640414.2025.2534276))

**研究中的实施示例 Implementation Examples from Research:**

**关节角度反馈 Joint Angle Feedback:**

- 3D 动画棒人，"生物力学需求在关节处使用连续颜色渐变从绿色 0%，琥珀色 50%，到红色 100% 视觉表示" ([PMC, 2012](https://pmc.ncbi.nlm.nih.gov/articles/PMC3272455/))
- 这种方法"使没有生物力学培训的人能够访问和解释生物力学信息"

**定量结果 Quantitative Results:**

- **康复 Rehabilitation:** 颜色编码关节角度反馈导致中风患者"步长和步行速度显著增加"和"推进冲量的积极变化" ([PubMed, 1987](https://pubmed.ncbi.nlm.nih.gov/2780812/))

#### 颜色规范 (Color Specifications)

**主要色盲安全调色板 Primary Color-Blind Safe Palette:**

| 状态 State | 颜色名称 Color Name | 十六进制代码 Hex Code | RGB | 使用场景 Use Case | 可访问? Accessible? |
|-------|-----------|----------|-----|----------|-------------|
| **严重错误 Critical Error** | 深红色 Dark Red | `#C62828` | (198, 40, 40) | 高优先级错误 | ⚠️ 与图标一起使用 |
| **警告 Warning** | 琥珀色 Amber | `#F9A825` | (249, 168, 37) | 中优先级错误 | ✓ 是 Yes |
| **良好/正确 Good/Correct** | 蓝绿色 Blue-Green | `#00897B` | (0, 137, 123) | 积极反馈 | ✓ 是 Yes |
| **中性 Neutral** | 浅灰色 Light Gray | `#BDBDBD` | (189, 189, 189) | 信息性 | ✓ 是 Yes |

**关节角度的渐变 Gradient for Joint Angles:**

```
完美 Perfect (0% error):      #00897B (蓝绿色 Blue-Green)
轻微 Slight (25% error):      #66BB6A (浅绿色 Light Green)
中等 Moderate (50% error):    #F9A825 (琥珀色 Amber)
显著 Significant (75% error):  #FB8C00 (橙色 Orange)
严重 Critical (100% error):   #C62828 (深红色 Dark Red)
```

---

### 1.5 多模态视觉反馈：组合多种模式 (Multimodal Visual Feedback: Combining Multiple Patterns)

#### 研究发现 (Research Findings)

**卓越有效性 Superior Effectiveness:**

- "**多模态增强反馈似乎是最有效的**，也是在健康和患病人群以及运动员中进行运动学习时给予反馈的适当方式，因为**其刺激被感知得更快，并且往往保留得更久**" ([PMC, 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8681883/))

**最佳组合 Optimal Combinations:**

- **视觉 + 语言反馈 Visual + Verbal feedback:** "处方性和组合反馈技术的组合证明最有效，并且对膝盖、臀部和躯干弯曲角度表现出**大效应量**" ([PMC, 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8681883/))
- **视觉 + 听觉 + 触觉 Visual + Auditory + Haptic:** "结合触觉和听觉提示增强了可用性和运动学习。参与者偏爱这种方法，最初依赖听觉反馈，然后在长期内切换到触觉反馈" ([Springer, 2012](https://link.springer.com/article/10.3758/s13423-012-0333-8))

#### 实施策略 (Implementation Strategy)

**模式组合 Pattern Combinations:**

| 使用场景 Use Case | 主要视觉 Primary Visual | 次要视觉 Secondary Visual | 音频 Audio | 触觉 Haptic |
|----------|---------------|-----------------|-------|--------|
| **初学者培训 Beginner Training** | 颜色编码 Color coding | 叠加箭头 Overlay arrows | 语言提示 Verbal cues | 可选 Optional |
| **中级 Intermediate** | 幽灵虚拟角色 Ghost avatar | 颜色编码 Color coding | 选择性提示 Selective cues | 推荐 Recommended |
| **高级 Advanced** | 并排比较 Side-by-side | 幽灵虚拟角色 Ghost avatar | 最少 Minimal | 仅警报 Alert-only |
| **康复 Rehabilitation** | 颜色编码 Color coding | 叠加箭头 Overlay arrows | 语言 + 音频警报 Verbal + audio alerts | 强 Strong |

---

## 2. 高级研究：虚拟角色叠加与时间对齐 (Advanced Research: Avatar Overlay & Temporal Alignment)

### 2.1 叠加虚拟角色的最佳显示 (Optimal Display of Superimposed Avatars) (2025 研究)

**论文 Paper:** "Towards an Optimal Display of Superimposed Avatars for Motor Feedback"

- **发表 Publication:** SN Computer Science, 2025
- **链接 Link:** <https://link.springer.com/article/10.1007/s42979-025-03904-7>

#### 1. 空间配准 (Spatial Registration)

**问题 Problem:** 用户骨架与参考骨架的正确对齐对于有效反馈至关重要。

**关键原则 Key Principle:**
> 用户和参考骨架之间的错位会导致混淆并导致错误的运动纠正。

**实施要求 Implementation Requirements:**

- 对齐方法必须取决于练习类型
- 不同的练习需要不同的锚点
- 不能在没有空间配准的情况下使用简单的叠加

**特定练习的对齐示例 Exercise-Specific Alignment Examples:**

| 练习类型 Exercise Type | 对齐策略 Alignment Strategy | 锚点 Anchor Point | 原因 Reason |
|---------------|-------------------|--------------|---------|
| **深蹲 Squat** | 对齐脚位置 Align feet positions | 脚/地面接触 Feet/ground contact | 保持站姿宽度一致性 |
| **俯卧撑 Push-up** | 对齐手位置 Align hand positions | 手 Hands | 固定接触点 |
| **二头肌弯举 Bicep curl** | 对齐肩部位置 Align shoulder position | 肩关节 Shoulder joint | 运动源自肩部 |
| **跑步步态 Running gait** | 对齐质心 Align center of mass | 臀部中心 Hip center | 动态运动参考 |

---

#### 2. 通过 PCA 优化视角选择 (Optimal Viewpoint Selection via PCA)

**问题 Problem:** 某些运动从某些摄像机角度难以评估。需要自动化方法来找到最佳视角。

**解决方案：主成分分析 (PCA) Solution: Principal Component Analysis (PCA)**

**方法 Method:**

1. 分析所有关节的 3D 运动轨迹
2. 使用 PCA 计算运动的主要方向
3. 将摄像机定位为垂直于主要运动平面
4. 最大化运动差异的可见性

**数学基础 Mathematical Foundation:**

```python
import numpy as np
from sklearn.decomposition import PCA

def calculate_optimal_viewpoint(movement_trajectory):
    """
    使用 PCA 计算最佳摄像机视角
    Calculate optimal camera viewpoint using PCA

    参数 Args:
        movement_trajectory: numpy 数组，形状为 (frames, joints, 3)
                           随时间变化的 3D 位置

    返回 Returns:
        optimal_camera_position: (x, y, z) 摄像机位置
        camera_target: (x, y, z) 摄像机应该看向的点
    """
    # 将轨迹展平为 (frames * joints, 3)
    flattened = movement_trajectory.reshape(-1, 3)

    # 应用 PCA 找到主要运动方向
    pca = PCA(n_components=3)
    pca.fit(flattened)

    # 主成分代表主要运动方向
    pc1 = pca.components_[0]  # 主要运动方向
    pc2 = pca.components_[1]  # 次要运动方向
    pc3 = pca.components_[2]  # 第三（通常垂直于运动平面）

    # 最佳摄像机位置：垂直于主要运动平面
    camera_offset = pc3 * 3.0  # 3 米远

    # 质心作为摄像机目标
    center_of_mass = np.mean(flattened, axis=0)

    optimal_camera_position = center_of_mass + camera_offset
    camera_target = center_of_mass

    return optimal_camera_position, camera_target
```

---

#### 3. 通过动态时间规整 (DTW) 的时间对齐 (Temporal Alignment via Dynamic Time Warping)

**问题 Problem:** 用户和参考表演者以不同的速度执行相同的运动。直接逐帧比较没有意义。

**解决方案：动态时间规整 (DTW) Solution: Dynamic Time Warping (DTW)**

**DTW 做什么 What DTW Does:**

- 找到两个时间序列之间的最佳对齐
- 尽管速度不同，仍匹配相应的运动阶段
- 自然处理可变速度和时间

**示例场景 Example Scenario:**

```
用户执行深蹲 User performs squat:    [0s--------1s--------2s--------3s--------4s]  (慢，4秒)
参考运动员 Reference athlete:        [0s----1s----2s]                              (快，2秒)

没有 DTW (简单帧匹配) Without DTW:
  帧 0 (用户) → 帧 0 (参考): 开始 START ✓
  帧 20 (用户) → 帧 20 (参考): 越界 OUT OF BOUNDS ✗

使用 DTW 对齐 With DTW alignment:
  用户帧 0 → 参考帧 0   (开始位置)
  用户帧 20 → 参考帧 10  (向下一半)
  用户帧 40 → 参考帧 20  (底部位置)
  用户帧 60 → 参考帧 30  (向上一半)
  用户帧 80 → 参考帧 40  (结束位置)
```

**实现 Implementation:**

```python
from dtaidistance import dtw
import numpy as np

def align_movements_with_dtw(user_trajectory, reference_trajectory):
    """
    使用 DTW 时间对齐用户和参考运动
    Temporally align user and reference movements using DTW

    参数 Args:
        user_trajectory: numpy 数组 (user_frames, joints, 3)
        reference_trajectory: numpy 数组 (ref_frames, joints, 3)

    返回 Returns:
        alignment_path: (user_idx, ref_idx) 元组列表
        distance: DTW 距离度量
        aligned_user: 扭曲以匹配参考时间的用户轨迹
    """
    # 为 DTW 展平关节维度
    user_flat = user_trajectory.reshape(user_trajectory.shape[0], -1)
    ref_flat = reference_trajectory.reshape(reference_trajectory.shape[0], -1)

    # 计算 DTW 距离和对齐路径
    distance, paths = dtw.warping_paths(user_flat, ref_flat)

    # 提取最佳路径
    best_path = dtw.best_path(paths)

    # 创建对齐的用户轨迹（扭曲到参考时间）
    aligned_user = np.zeros_like(reference_trajectory)
    for ref_idx in range(len(reference_trajectory)):
        user_idx = [u for u, r in best_path if r == ref_idx][0]
        aligned_user[ref_idx] = user_trajectory[user_idx]

    return best_path, distance, aligned_user
```

---

## 3. 商业最佳实践 (Commercial Best Practices)

### 3.1 Peloton IQ: 基于置信度的反馈 (Confidence-Based Feedback)

**技术 Technology:** 计算机视觉 + 在 500万+ 锻炼上训练的 AI

**关键创新：置信度阈值 Key Innovation: Confidence Thresholding**
> "Peloton IQ 仅在对评估有信心时才提供反馈。"

**置信度级别 Confidence Levels:**

- **低置信度 (<60%):** 无反馈（避免混淆用户）
- **中等置信度 (60-80%):** 温和建议
- **高置信度 (>80%):** 明确纠正

**实现模式 Implementation Pattern:**

```python
def provide_feedback(detection_confidence, error_severity):
    CONFIDENCE_THRESHOLD_LOW = 0.6
    CONFIDENCE_THRESHOLD_HIGH = 0.8

    if detection_confidence < CONFIDENCE_THRESHOLD_LOW:
        return None  # 无反馈 - 置信度不足

    elif detection_confidence < CONFIDENCE_THRESHOLD_HIGH:
        # 中等置信度 - 温和建议
        return {
            'type': 'suggestion',
            'intensity': 'low',
            'message': f"考虑 Consider {get_correction_hint(error_severity)}"
        }

    else:
        # 高置信度 - 明确纠正
        return {
            'type': 'correction',
            'intensity': 'high',
            'message': get_correction_instruction(error_severity)
        }
```

---

### 3.2 MAGIC Mirror: 每次重复评分 UI (Per-Rep Scoring UI)

**技术 Technology:** ReflectAI® - 隐藏摄像头 + 计算机视觉（~400 种运动模式）

**关键创新：定量每次重复反馈 Key Innovation: Quantitative Per-Rep Feedback**

**实时功能 Real-Time Features:**

1. **重复计数 Rep counting** 带视觉叠加
2. **姿态纠正 Pose correction** 指示器
3. **质量评分 Quality scoring** - 每次重复的数字分数 (0-100)
4. **全息教练 Holographic coach** - 虚拟教练叠加

**评分系统实现 Scoring System Implementation:**

```javascript
// 每次重复质量分数计算示例
function calculateRepQuality(userPose, idealPose) {
    let totalScore = 0;
    let weightedSum = 0;

    // 关节角度精度（40% 权重）
    const angleScore = compareJointAngles(userPose, idealPose);
    weightedSum += angleScore * 0.4;

    // 运动范围（30% 权重）
    const romScore = evaluateRangeOfMotion(userPose);
    weightedSum += romScore * 0.3;

    // 运动平滑度（20% 权重）
    const smoothnessScore = analyzeSmoothness(userPose.trajectory);
    weightedSum += smoothnessScore * 0.2;

    // 时间/节奏（10% 权重）
    const tempoScore = evaluateTempo(userPose.duration);
    weightedSum += tempoScore * 0.1;

    return Math.round(weightedSum * 100); // 返回 0-100 分数
}
```

---

### 3.3 Tempo Studio: 3D 叠加技术 (3D Overlay Techniques)

**技术 Technology:** 3D 飞行时间 (ToF) 深度传感器（Microsoft Azure + Analog Devices）

**技术规格 Technical Specifications:**

- **1 百万像素分辨率** 深度感知
- **40 FPS** 实时跟踪
- **25 个身体关节** 在 3D 空间中分析
- **低延迟:** 片上处理减少系统延迟

**采纳内容 What to Adopt:**

- ✅ 3D 姿态重要性（使用 MediaPipe 的 3D 输出）
- ✅ 关节角度精度用于姿态评估
- ✅ 危险模式的实时安全警报
- ⚠️ 考虑未来版本中使用手机 LiDAR 进行深度

---

## 4. UI/UX 实施指南 (UI/UX Implementation Guidelines)

### 4.1 反馈优先级系统 (Feedback Priority System)

**问题 Problem:** 在单次运动中同时出现多个错误。

**解决方案：优先级层次 Solution: Priority Hierarchy**

| 优先级 Priority | 错误类型 Error Type | 反馈方法 Feedback Method | 示例 Example |
|----------|-----------|----------------|---------|
| **1 - 严重 Critical** | 安全风险，伤害潜力 | 立即停止 + 触觉 + 音频 | 深蹲时膝盖过度内扣 |
| **2 - 高 High** | 主要姿态偏差 | 叠加箭头 + 颜色编码 | 深蹲深度不足 |
| **3 - 中 Medium** | 次要调整 | 颜色编码仅 | 轻微的躯干倾斜 |
| **4 - 低 Low** | 优化 | 后期动作审查 | 节奏调整 |

---

### 4.2 渐进式反馈淡出 (Progressive Feedback Fading)

**研究支持 Research Support:**
减少反馈频率以防止依赖并增强技能保留。

**实施策略 Implementation Strategy:**

**第 1 周 Week 1: 持续反馈 Continuous Feedback (100%)**

```
每次重复：完整反馈
Every rep: Full feedback
```

**第 2-3 周 Weeks 2-3: 渐进淡出 Progressive Fading (50%)**

```
每 2 次重复一次反馈
Feedback every 2 reps
```

**第 4+ 周 Week 4+: 最小反馈 Minimal Feedback (20%)**

```
仅严重错误
Only critical errors
```

---

## 5. 渲染技术与 SDK (Rendering Technologies & SDKs)

### 5.1 原生 iOS - RealityKit (AR 叠加)

**Apple Vision Pro + iPhone AR**

```swift
import RealityKit
import ARKit

class PoseOverlayView: ARView {
    var ghostSkeleton: ModelEntity?
    var userSkeleton: ModelEntity?

    func updateSkeletons(userPose: [CGPoint], idealPose: [CGPoint]) {
        // 更新实时用户骨架（100% 不透明度）
        userSkeleton?.model?.materials = [SimpleMaterial(
            color: .white,
            isMetallic: false
        )]

        // 更新幽灵参考骨架（50% 不透明度）
        var ghostMaterial = SimpleMaterial(color: .green, isMetallic: false)
        ghostMaterial.baseColor.tint = .init(red: 0.3, green: 0.8, blue: 0.3, alpha: 0.5)
        ghostSkeleton?.model?.materials = [ghostMaterial]
    }
}
```

---

### 5.2 Flutter - CustomPainter (跨平台)

```dart
class SkeletonOverlayPainter extends CustomPainter {
  final List<Keypoint> userKeypoints;
  final List<Keypoint> idealKeypoints;

  SkeletonOverlayPainter({
    required this.userKeypoints,
    required this.idealKeypoints,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // 绘制幽灵骨架（50% 不透明度）
    final ghostPaint = Paint()
      ..color = Colors.green.withOpacity(0.5)
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    drawSkeleton(canvas, idealKeypoints, ghostPaint);

    // 绘制实时骨架（100% 不透明度）
    final livePaint = Paint()
      ..color = Colors.white
      ..strokeWidth = 4
      ..style = PaintingStyle.stroke;

    drawSkeleton(canvas, userKeypoints, livePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
```

---

## 6. 触觉反馈集成 (Haptic Feedback Integration)

### 6.1 触觉模式设计 (Haptic Pattern Design)

**iOS 实现 iOS Implementation:**

```swift
import CoreHaptics

class HapticFeedbackEngine {
    var engine: CHHapticEngine?

    func playCorrection(severity: ErrorSeverity) {
        let pattern: CHHapticPattern

        switch severity {
        case .critical:
            // 强脉冲 - 立即注意 Strong pulse - immediate attention
            pattern = CHHapticPattern(events: [
                CHHapticEvent(eventType: .hapticTransient,
                            parameters: [CHHapticEventParameter(parameterID: .hapticIntensity, value: 1.0)],
                            relativeTime: 0)
            ])

        case .moderate:
            // 双脉冲 - 温和纠正 Double pulse - gentle correction
            pattern = CHHapticPattern(events: [
                CHHapticEvent(eventType: .hapticTransient,
                            parameters: [CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.6)],
                            relativeTime: 0),
                CHHapticEvent(eventType: .hapticTransient,
                            parameters: [CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.6)],
                            relativeTime: 0.1)
            ])

        case .correct:
            // 成功叮咚 Success chime
            pattern = CHHapticPattern(events: [
                CHHapticEvent(eventType: .hapticContinuous,
                            parameters: [CHHapticEventParameter(parameterID: .hapticIntensity, value: 0.5)],
                            relativeTime: 0,
                            duration: 0.2)
            ])
        }

        try? engine?.start()
        try? engine?.makePlayer(with: pattern).start(atTime: 0)
    }
}
```

---

## 相关文档 (Related Documentation)

- **姿态估计 Pose Estimation**: [Pose Estimation Guide](pose-estimation.md)
- **传感器硬件 Sensor Hardware**: [Sensor Hardware Guide](sensor-hardware.md)

---

**最后更新 Last Updated**: 2025年12月1日
**维护者 Maintained By**: Movement Chain AI Design Team
