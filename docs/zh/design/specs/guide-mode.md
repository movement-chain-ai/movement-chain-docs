# 引导模式

> **文档目的**: 定义实时引导功能的设计，包括站姿检查和挥杆引导
>
> **核心定位**: 在用户动作过程中提供实时指导，帮助建立正确动作模式
>
---

## 1. ## 1. 背景

在设计引导模式之前，需要理解一个关键的运动分类维度：**动作过程中能否被干预**。

### 1.1 控制性运动 vs 非控制性运动

| 类型 | 定义 | 核心特征 | 典型例子 |
|------|------|----------|----------|
| **控制性运动** | 动作过程中可随时调整或停止 | 慢、稳、神经控制主导 | 慢速深蹲、瑜伽、康复训练、慢动作训练 |
| **非控制性运动** | 动作启动后惯性主导，难以中途干预 | 快、猛、弹性/反射主导 | 跳跃、冲刺、投掷、高尔夫全挥杆、网球发球 |

**反馈干预方式**

| 维度 | 控制性运动 | 非控制性运动 |
|------|-----------|-------------|
| **反馈时机** | ✅ 可实时提示（边做边纠正） | ❌ 只能事后回放分析 |
| **采样率要求** | 中等 (100-200 Hz) | 高 (500+ Hz) |
| **运动链分析重点** | 肌肉激活顺序、稳定性 | 力传导效率、峰值时序 |

**运动训练的逻辑**

```text
高水平表现 = 先掌握控制 → 再释放爆发

训练顺序：
1. 控制性练习 → 建立正确运动链模式
2. 逐步加速 → 测试模式是否保持
3. 非控制性爆发 → 检验最终表现
```

### 1.2 高尔夫训练分析

**两种场景对比**

| 场景 | 运动类型 | 分析能做什么 | 局限性 |
|------|---------|-------------|--------|
| **全速挥杆** | 非控制性 | 事后诊断问题（哪里错了） | 用户无法"边做边改" |
| **引导训练** | 控制性 | 实时纠正 + 建立正确模式 | 不能直接迁移到比赛表现 |

**全速分析的"诊断-修复"困境**

```text
全速挥杆分析 → 发现问题 → 告诉用户"核心发力太晚"
                              ↓
                    用户下一杆还是一样（因为太快来不及调整）
                              ↓
                    反复看到同样的错误 → 用户挫败
```

**引导训练解决这个问题**

```text
引导训练 → 在"下杆启动"阶段实时提示"从核心发力"
                              ↓
              用户可以在那个瞬间体会正确感觉
                              ↓
              重复 50 次 → 建立肌肉记忆
                              ↓
              全速挥杆时自动执行正确模式
```

**产品策略：按用户阶段推荐模式比例**

| 用户阶段 | 推荐模式 | 原因 |
|---------|---------|------|
| **初学者** | 80% 引导训练 + 20% 全速练习 | 先建立正确模式 |
| **中级** | 50% 引导训练 + 50% 全速练习 | 巩固 + 检验迁移 |
| **高级** | 20% 引导训练 + 80% 全速练习 | 微调 + 表现优化 |

**结论：两者必须结合**

| 方案 | 效果 |
|------|------|
| ❌ 只做全速分析 | 能诊断问题，但用户难以改正 |
| ❌ 只做引导训练 | 能建立模式，但不知道全速时是否保持 |
| ✅ **两者结合** | 引导训练建立模式 → 全速分析验证迁移 |

!!! tip "核心洞察"
    非控制性运动（如全速挥杆）虽然可以实时采集和分析数据，但由于动作过快（<1.5秒），用户无法在执行过程中根据反馈进行调整。因此，将非控制性运动分解为若干控制性运动（引导训练），可以实现"边做边纠正"，帮助用户建立正确的运动模式，再逐步加速迁移到全速动作。

### 1.3 引导训练：符合运动的学习路径

引导训练的设计**遵循运动学习的科学规律**。模仿了真人教练的教法，也是经过验证的有效学习方法。

**运动学习的科学基础**

```text
运动技能习得的三阶段理论 (Fitts & Posner, 1967):

1. 认知阶段 → 理解动作要领，需要慢速、有意识地执行
2. 联结阶段 → 减少错误，动作逐渐流畅
3. 自动化阶段 → 动作内化，可以全速无意识执行

关键洞察：必须从阶段 1 开始，不能跳过！
```

**为什么引导训练有效**

| 科学原理 | 解释 | Mode 2 实现 |
|---------|------|------------|
| **动作分解** | 复杂动作拆解为可控单元 | 按 8 阶段分段检测 |
| **即时反馈** | 错误发生时立即纠正，防止错误固化 | 实时语音提示 |
| **刻意练习** | 针对弱点重复，而非盲目重复 | 问题阶段重点引导 |
| **本体感觉** | 慢速时才能"感受"正确位置 | 给用户时间体会 |
| **渐进超载** | 慢 → 中速 → 全速逐步加速 | Mode 2 → Mode 3 过渡 |

**真人教练遵循同样的科学路径**

| 教练行为 | 背后的学习科学 | Movement Chain 对应 |
|---------|--------------|-------------------|
| "慢慢来，我看着你做" | 认知阶段：有意识控制 | 慢挥引导 |
| "停！这里核心要先发力" | 即时反馈：错误纠正 | 实时语音 |
| "对，就是这个感觉" | 正强化：确认正确模式 | 正确确认 |
| "好，快一点试试" | 渐进超载：增加难度 | 加速练习 |
| "正常速度打一个" | 迁移测试：验证自动化 | 全速分析 |

**分析工具 vs AI 教练**

| 维度 | 只有全速分析（分析工具） | 有引导训练（AI 教练） |
|------|----------------------|---------------------|
| **学习阶段** | 跳过认知阶段，直接测试 | 从认知阶段开始，完整路径 |
| **角色** | 像"考官"：只告诉你对错 | 像"教练"：教你怎么做对 |
| **用户体验** | 知道问题但改不了 | 在过程中体会正确感觉 |
| **学习效果** | 被动接受评判 | 主动学习建立模式 |

## 1. 引导模式概述

引导模式与评估模式的核心区别：

| 模式 | 本质 | 时机 | 目的 |
|------|------|------|------|
| **引导模式** | 实时指导 | 动作前/动作中 | 帮助用户"做对" |
| **评估模式** | 事后诊断 | 动作后 | 告诉用户"哪里错了" |

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GUIDE MODE                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  站姿引导 (Setup Guide)                        延迟要求: <300ms                │
│  ─────────────────────────────────────────────────────────────────────────  │
│  用户静止准备 → 实时检测姿势 → 语音/视觉反馈                                      │
│  "肩膀放松一点" / "脚再宽一点"                                                  │
│                                                                             │
│  ⏱️ 用户有 2-5 秒反应时间 → 完全可行                                            │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  慢动作引导 (Slow Motion Guide)                延迟要求: <500ms                │
│  ─────────────────────────────────────────────────────────────────────────  │
│  用户慢速挥杆 (1/4-1/2 速度) → 每阶段检测 → 阶段性反馈                            │
│  "好，继续转肩..." / "现在开始下杆..."                                          │
│                                                                             │
│  ⏱️ 慢动作挥杆 3-5 秒 → 有时间在每阶段给反馈                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 站姿引导

### 2.1 设计原则

用户在挥杆前有 2-5 秒的准备时间，这是**最佳反馈窗口**：

- 用户静止，姿态稳定
- 有时间听取并调整
- 每次挥杆前都可以检查
- 这是教练最常做的事情

### 2.2 检测项目

| 检测项 | 传感器 | 阈值 | 反馈语音 |
|-------|--------|-----|---------|
| 头部位置过高 | Vision | `nose.y < shoulder.y * 0.7` | "下巴收一点" |
| 肩膀耸起 | Vision | `(shoulder.y - ear.y) < threshold` | "放松肩膀" |
| 站距过窄 | Vision | `ankle_dist / shoulder_width < 0.9` | "脚再宽一点" |
| 站距过宽 | Vision | `ankle_dist / shoulder_width > 1.3` | "脚收窄一点" |
| 脊柱太直 | Vision | `spine_angle < 25°` | "上身前倾一些" |
| 脊柱过弯 | Vision | `spine_angle > 45°` | "背挺直一点" |
| 膝盖锁死 | Vision | `knee_angle > 175°` | "膝盖弯一下" |
| 重心偏移 | Vision | `hip_center.x` 偏离中心 | "重心放中间" |

### 2.3 实现代码

```python
class SetupGuide:
    """
    站姿实时引导器

    在用户准备挥杆时持续运行，检测并反馈姿态问题
    """

    def __init__(self, feedback_cooldown_ms=2000):
        self.feedback_cooldown = feedback_cooldown_ms
        self.last_feedback_time = {}

    def check_setup(self, landmarks, current_time):
        """
        检查站姿并返回需要反馈的问题

        Args:
            landmarks: MediaPipe 33 关键点
            current_time: 当前时间戳 (ms)

        Returns:
            issues: list of (issue_name, feedback_text, priority)
        """
        issues = []

        # 1. 检查头部位置
        if self._head_too_high(landmarks):
            issues.append(('head_high', '下巴收一点', 2))

        # 2. 检查肩膀
        if self._shoulders_raised(landmarks):
            issues.append(('shoulders', '放松肩膀', 2))

        # 3. 检查站距
        stance_ratio = self._get_stance_ratio(landmarks)
        if stance_ratio < 0.9:
            issues.append(('stance_narrow', '脚再宽一点', 1))
        elif stance_ratio > 1.3:
            issues.append(('stance_wide', '脚收窄一点', 1))

        # 4. 检查脊柱角度
        spine_angle = self._get_spine_angle(landmarks)
        if spine_angle < 25:
            issues.append(('spine_straight', '上身前倾一些', 1))
        elif spine_angle > 45:
            issues.append(('spine_bent', '背挺直一点', 1))

        # 5. 检查膝盖
        if self._knees_locked(landmarks):
            issues.append(('knees', '膝盖弯一下', 2))

        # 过滤冷却中的反馈
        filtered_issues = []
        for issue_name, text, priority in issues:
            last_time = self.last_feedback_time.get(issue_name, 0)
            if current_time - last_time > self.feedback_cooldown:
                filtered_issues.append((issue_name, text, priority))
                self.last_feedback_time[issue_name] = current_time

        # 按优先级排序，只返回最重要的 1-2 个
        filtered_issues.sort(key=lambda x: x[2])
        return filtered_issues[:2]

    def _get_stance_ratio(self, landmarks):
        """计算站距比例"""
        LEFT_ANKLE, RIGHT_ANKLE = 27, 28
        LEFT_SHOULDER, RIGHT_SHOULDER = 11, 12

        ankle_dist = np.linalg.norm(
            np.array([landmarks[LEFT_ANKLE].x, landmarks[LEFT_ANKLE].y]) -
            np.array([landmarks[RIGHT_ANKLE].x, landmarks[RIGHT_ANKLE].y])
        )
        shoulder_dist = np.linalg.norm(
            np.array([landmarks[LEFT_SHOULDER].x, landmarks[LEFT_SHOULDER].y]) -
            np.array([landmarks[RIGHT_SHOULDER].x, landmarks[RIGHT_SHOULDER].y])
        )

        return ankle_dist / shoulder_dist if shoulder_dist > 0 else 1.0

    def _get_spine_angle(self, landmarks):
        """计算脊柱前倾角度"""
        # 简化: 使用肩膀中点到髋部中点的角度
        LEFT_SHOULDER, RIGHT_SHOULDER = 11, 12
        LEFT_HIP, RIGHT_HIP = 23, 24

        shoulder_center = np.array([
            (landmarks[LEFT_SHOULDER].x + landmarks[RIGHT_SHOULDER].x) / 2,
            (landmarks[LEFT_SHOULDER].y + landmarks[RIGHT_SHOULDER].y) / 2
        ])
        hip_center = np.array([
            (landmarks[LEFT_HIP].x + landmarks[RIGHT_HIP].x) / 2,
            (landmarks[LEFT_HIP].y + landmarks[RIGHT_HIP].y) / 2
        ])

        # 计算与垂直线的夹角
        vertical = np.array([0, -1])
        spine_vec = shoulder_center - hip_center
        spine_vec_norm = spine_vec / np.linalg.norm(spine_vec)

        angle = np.arccos(np.dot(spine_vec_norm, vertical))
        return np.degrees(angle)

    def _head_too_high(self, landmarks):
        """检查头部是否过高"""
        NOSE = 0
        LEFT_SHOULDER, RIGHT_SHOULDER = 11, 12

        nose_y = landmarks[NOSE].y
        shoulder_y = (landmarks[LEFT_SHOULDER].y + landmarks[RIGHT_SHOULDER].y) / 2

        # 在归一化坐标中，y 越小表示越高
        return nose_y < shoulder_y * 0.7

    def _shoulders_raised(self, landmarks):
        """检查肩膀是否耸起"""
        LEFT_EAR, RIGHT_EAR = 7, 8
        LEFT_SHOULDER, RIGHT_SHOULDER = 11, 12

        ear_y = (landmarks[LEFT_EAR].y + landmarks[RIGHT_EAR].y) / 2
        shoulder_y = (landmarks[LEFT_SHOULDER].y + landmarks[RIGHT_SHOULDER].y) / 2

        # 肩膀和耳朵距离太近表示耸肩
        return (shoulder_y - ear_y) < 0.08  # 归一化坐标

    def _knees_locked(self, landmarks):
        """检查膝盖是否锁死"""
        # 简化: 检查膝盖是否几乎完全伸直
        LEFT_HIP, LEFT_KNEE, LEFT_ANKLE = 23, 25, 27

        hip = np.array([landmarks[LEFT_HIP].x, landmarks[LEFT_HIP].y])
        knee = np.array([landmarks[LEFT_KNEE].x, landmarks[LEFT_KNEE].y])
        ankle = np.array([landmarks[LEFT_ANKLE].x, landmarks[LEFT_ANKLE].y])

        # 计算膝盖角度
        vec1 = hip - knee
        vec2 = ankle - knee
        cos_angle = np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
        angle = np.degrees(np.arccos(np.clip(cos_angle, -1, 1)))

        return angle > 175
```

---

## 3. 阶段式挥杆引导

### 3.1 设计原则

让用户以 1/4 或 1/2 速度练习，系统可以在每个阶段给出实时反馈。

```text
正常挥杆:  1.2 秒 (太快，无法实时反馈)
1/2 速度:  2.4 秒 (每阶段约 300ms，可以反馈)
1/4 速度:  4.8 秒 (每阶段约 600ms，充足反馈时间)
```

### 3.2 阶段性反馈设计

| 阶段 | 检测点 | 反馈内容 | 触发条件 |
|-----|-------|---------|---------|
| Address → Toe-Up | 起杆开始 | "好，慢慢起杆" | 检测到运动开始 |
| Toe-Up → Mid-Backswing | 手腕平行 | "继续转肩" | 手腕达到腰部高度 |
| Mid-Backswing → Top | 到顶点 | "转到位了" | 角速度接近零 |
| Top → Mid-Downswing | 下杆启动 | "从核心启动" | 检测到方向反转 |
| Mid-Downswing → Impact | 击球前 | "保持手腕" | 检测到加速 |
| Impact → Finish | 击球后 | "保持平衡" | 检测到击球 |

### 3.3 实现代码

```python
class SlowMotionGuide:
    """
    慢动作引导教练

    在用户慢速挥杆时，每个阶段给出引导反馈
    """

    PHASE_PROMPTS = {
        'address_start': '准备好了，慢慢起杆',
        'toe_up': '好，继续',
        'mid_backswing': '转肩，转肩',
        'top': '到顶了，准备下杆',
        'transition': '从核心启动',
        'mid_downswing': '保持手腕角度',
        'impact': '打到了！',
        'finish': '收杆，保持平衡',
    }

    def __init__(self, phase_detector, audio_player):
        self.phase_detector = phase_detector
        self.audio_player = audio_player
        self.current_phase = None
        self.phases_announced = set()

    def update(self, imu_data, vision_data, current_time):
        """
        每帧更新，检测阶段变化并给出反馈
        """
        # 检测当前阶段
        phases = self.phase_detector.detect_all_phases(imu_data, vision_data)

        new_phase = self._determine_current_phase(phases, current_time)

        if new_phase and new_phase != self.current_phase:
            if new_phase not in self.phases_announced:
                self._announce_phase(new_phase)
                self.phases_announced.add(new_phase)
            self.current_phase = new_phase

    def _announce_phase(self, phase):
        """播放阶段提示音"""
        prompt = self.PHASE_PROMPTS.get(phase)
        if prompt:
            self.audio_player.play(prompt)

    def reset(self):
        """重置状态，准备下一次挥杆"""
        self.current_phase = None
        self.phases_announced.clear()

    def _determine_current_phase(self, phases, current_time):
        """根据检测到的阶段时间确定当前阶段"""
        # 简化逻辑: 根据时间顺序判断
        if phases.get('finish') and current_time > phases['finish']:
            return 'finish'
        if phases.get('impact') and current_time > phases['impact']:
            return 'impact'
        if phases.get('top') and current_time > phases['top']:
            if current_time < phases['top'] + 200:
                return 'transition'
            return 'mid_downswing'
        if phases.get('address', {}).get('end') and current_time > phases['address']['end']:
            return 'mid_backswing'

        return 'address_start'
```

### 3.4 阶段式挥杆引导的核心价值

#### 3.4.1 还原真实高尔夫教学场景

慢动作引导模拟了专业教练教学的核心环节：

| 真实教学场景 | 引导模式实现 |
|------------|------------|
| 教练让你慢慢做，他在旁边看 | 系统实时监测每个阶段 |
| 教练在关键点喊"停，这里要发力" | 阶段性语音提示 |
| 教练说"对，就是这个感觉" | 正确模式确认反馈 |
| 反复练习直到形成肌肉记忆 | 重复训练 + 一致性追踪 |

#### 3.4.2 解决"知道但做不到"的问题

全速分析能告诉用户"核心发力太晚"，但用户下一杆还是一样——因为 1.2 秒的挥杆太快，来不及调整。

慢动作引导把动作拉长到 3-5 秒，用户可以在"下杆启动"的那个瞬间：
- 听到提示"从核心发力"
- 体会正确的发力感觉
- 重复 50 次建立肌肉记忆
- 全速挥杆时自动执行

#### 3.4.3 降低学习门槛

| 场景 | 没有引导模式 | 有引导模式 |
|-----|------------|----------|
| 初学者 | 全速打 → 反复出错 → 挫败放弃 | 慢练 → 逐步掌握 → 有成就感 |
| 技术纠正 | 知道问题但改不了 | 在慢动作中体会正确感觉 |
| 伤后恢复 | 不敢全速打 | 安全地重建动作模式 |

---

## 4. 三种模式的配合

评估、练习、引导三种模式共同构建了**诊断 → 训练 → 内化 → 验证**的完整闭环：

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    完整训练闭环                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐                                                          │
│   │  1. 评估模式  │                                                          │
│   │   全速挥杆    │ ─── 诊断问题 ───▶ "核心发力太晚"                            │
│   └──────────────┘                                                          │
│          ▲                                    │                             │
│          │                                    ▼                             │
│   ┌──────┴───────┐                    ┌──────────────┐                      │
│   │  4. 评估模式  │                    │  2. 练习模式  │                      │
│   │   验证效果    │                    │  针对性 Drill │                      │
│   │ "问题解决了"  │                    │ 骨盆先行练习   │                      │
│   └──────────────┘                    └──────┬───────┘                     │
│          ▲                                   │                             │
│          │                                   ▼                             │
│          │                            ┌──────────────┐                      │
│          │                            │  3. 引导模式  │                      │
│          └─────── 建立肌肉记忆 ─────────│  慢动作内化   │                      │
│                                       │ 实时纠正动作   │                      │
│                                       └──────────────┘                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**四个环节**：

| 环节 | 模式 | 作用 | 说明 |
|-----|------|------|------|
| **1. 诊断** | 评估模式 | 全速挥杆分析 | 发现问题"核心发力太晚" |
| **2. 训练** | 练习模式 | 针对性 Drill | 推荐骨盆先行练习等动作 |
| **3. 内化** | 引导模式 | 慢动作引导 | 实时纠正，建立正确模式 |
| **4. 验证** | 评估模式 | 检验迁移 | 全速挥杆确认问题解决 |

**闭环运转示例**：

1. **评估**：用户全速挥杆 → 系统诊断"核心发力太晚"
2. **练习**：系统推荐"骨盆先行练习"（Pelvis-First Drill）
3. **引导**：用户慢速练习，系统实时提示"从核心启动"
4. **验证**：回到全速挥杆，确认问题是否解决
5. **循环**：如果解决则进入下一个改进点，否则继续练习

---

## 5. 反馈通道

反馈通道是指系统向用户传递信息的**形式**，与引导模式是正交的两个维度。

| 反馈通道 | 延迟 | 适用场景 | 优势 | 局限 |
|---------|------|---------|------|------|
| **语音反馈** | 50-100ms | 所有场景 | 信息量大，无需看屏幕 | 需要安静环境 |
| **视觉反馈** | <20ms | 所有场景 | 精确展示位置/角度 | 用户需看屏幕 |
| **触觉反馈** | <50ms | 挥杆引导 | 唯一能实时干预的方式 | 信息量有限 |

### 5.1 语音反馈

**预录制语音文件**

| 类别 | 文件名 | 文案 | 时长 |
|-----|-------|------|------|
| **核心问题 (P0)** | `core_first.mp3` | "从核心启动" | ~1s |
| | `engage_core.mp3` | "收紧腹部发力" | ~1.2s |
| | `sequence_wrong.mp3` | "发力顺序错了" | ~1s |
| **旋转问题 (P1)** | `more_rotation.mp3` | "肩膀再多转一点" | ~1.2s |
| | `hip_lead.mp3` | "髋部先转开" | ~1s |
| **节奏问题 (P1)** | `slow_backswing.mp3` | "上杆慢一点" | ~1s |
| | `faster_downswing.mp3` | "下杆再快一点" | ~1s |
| | `good_tempo.mp3` | "节奏不错" | ~0.8s |
| **站姿问题** | `shoulders_tense.mp3` | "肩膀有些紧张" | ~1s |
| | `stance_narrow.mp3` | "站距偏窄" | ~0.8s |
| | `knees_straight.mp3` | "膝盖较直" | ~0.8s |
| **正面反馈** | `good_swing.mp3` | "这一杆不错" | ~1s |
| | `great_power.mp3` | "力量很好" | ~0.8s |
| | `perfect.mp3` | "完美！" | ~0.6s |

**TTS 动态生成**

对于需要包含数据的反馈（如具体分数、角度），使用 TTS 动态生成：

```swift
import AVFoundation  // iOS 原生 TTS

class FeedbackSpeaker {
    private let synthesizer = AVSpeechSynthesizer()

    /// 动态生成语音反馈
    /// - Examples:
    ///   - generateFeedback("X因子\(xFactor)度，不够")
    ///   - generateFeedback("速度\(speed)，很不错")
    func generateFeedback(_ text: String, rate: Float = 0.5) {
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "zh-CN")
        utterance.rate = rate
        synthesizer.speak(utterance)
    }
}
```

### 5.2 触觉反馈

触觉反馈 (<50ms 延迟) 是唯一能在挥杆过程中实时干预的方式。

**硬件依赖**

触觉反馈需要**振动输出设备**，不是输入传感器：

| 设备 | 说明 | 优劣 |
|-----|------|------|
| **Apple Watch** | 通过 WatchKit 触发振动 | ✅ 贴近身体，感知明确；❌ 需额外开发 watchOS App |
| **iPhone Taptic Engine** | 通过 Core Haptics 控制 | ⚠️ 用户打球时不握手机，实用性有限 |
| **自定义可穿戴** | 手环/腰带上的振动马达 | ✅ 位置灵活；❌ 需要硬件开发 |

!!! note "MVP 不包含触觉反馈"
    触觉反馈需要额外硬件支持，列入 Post-MVP 阶段。

**振动模式**

| 模式 | 振动时长 | 含义 | 触发条件 |
|-----|---------|-----|---------|
| 短振 (50ms) | 1次 | 轻微提示 | 接近阈值边界 |
| 短振 (50ms) | 2次 | 需要注意 | 超出阈值 |
| 长振 (200ms) | 1次 | 严重问题 | 严重超出阈值 |
| 连续振 | 持续 | 停止动作 | 危险动作 |

**应用场景**

| 场景 | 触发条件 | 振动模式 |
|-----|---------|---------|
| 上杆过快 | 上杆时间 < 500ms | 短振 2次 |
| 上杆顶点不够 | X-Factor < 20° | 短振 1次 |
| 下杆过早释放 | 手腕角度过早变化 | 短振 2次 |
| 疲劳预警 | EMG 激活强度下降 30% | 长振 1次 |

### 5.3 引导模式 × 反馈通道

| 分析模式 | 语音反馈 | 视觉反馈 | 触觉反馈 |
|---------|---------|---------|---------|
| **站姿引导** | ✅ 主要 | ✅ 辅助 | ❌ 不适用 |
| **挥杆引导** | ✅ 主要 | ✅ 辅助 | ✅ 可选 |

---

## 6. 延迟预算

### 6.1 端到端延迟分解

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    END-TO-END LATENCY BREAKDOWN                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  传感器采集         特征提取          规则判断          反馈生成                  │
│  ────────────     ───────────      ──────────       ──────────              │
│                                                                             │
│  Vision: 33ms     MediaPipe: 30ms  规则引擎: <5ms   语音TTS: 50-100ms         │
│  IMU: <10ms       特征计算: <10ms                   视觉叠加: <20ms            │
│  EMG: <5ms        时间同步: <5ms                    触觉振动: <10ms            │
│                                                                             │
│  ────────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  延迟预算:    33 + 30 + 5 + 100 = ~170ms                                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 各场景延迟要求

| 场景 | 延迟要求 | 敏感环节 | 原因 | 优化策略 |
|-----|---------|---------|------|---------|
| 站姿引导 | <300ms | TTS 生成 | 用户静止等待，语音是主要反馈方式，TTS 占总延迟 60% | 预缓存常用语音 |
| 挥杆引导 | <500ms | Vision 帧率 | 需要追踪连续动作，30fps 每帧 33ms 会累积误差 | 提高到 60fps |

---

## 7. 实施路线图

| 阶段 | 内容 | 优先级 | 说明 |
|------|------|--------|------|
| **Post-MVP** | 站姿引导 | 🟡 高 | 需要静态姿态检测 |
| **Post-MVP** | 挥杆引导 | 🟡 高 | 实时处理复杂度高 |
| **Post-MVP** | 触觉振动反馈 | 🟡 中 | 需要 Apple Watch 联动 |

!!! info "为什么 MVP 不包含引导模式?"
    1. **实时约束高** — 需要低延迟实时处理
    2. **依赖完善的阶段检测** — 需要先验证评估模式的阶段检测准确性
    3. **MVP 优先验证核心价值** — 先证明传感器融合分析的价值

---

## 8. 相关文档

| 相关文档 | 内容 | 本文档使用 |
|---------|------|-----------|
| [评估模式](assessment-mode.md) | 全速分析 | 验证学习效果 |
| [八个挥杆阶段](eight-swing-phases.md) | 阶段检测 | 阶段触发点 |
| [传感器映射](../architecture/sensor-data-processing.md) | 传感器能力 | 检测方法选择 |

---

**最后更新**: 2026-01-06
**维护者**: Movement Chain AI Team
