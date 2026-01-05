# 实时反馈规范 Real-Time Feedback Specification

> **文档目的**: 定义三种反馈模式的延迟要求、触发条件和实现策略
>
> **核心洞察**: "实时"不是一个模式，而是三种不同场景各有不同延迟要求
>
> **最后更新**: 2025-12-17

---

## 0. 高尔夫的训练和实战模式

在设计反馈系统之前，需要理解一个关键的运动分类维度：**动作过程中能否被干预**。

### 0.1 定义

| 类型 | 定义 | 核心特征 |
|------|------|----------|
| **控制性运动** | 动作过程中可随时调整或停止 | 慢、稳、神经控制主导 |
| **非控制性运动** | 动作启动后惯性主导，难以中途干预 | 快、猛、弹性/反射主导 |

### 0.2 典型例子

| 控制性运动 | 非控制性运动 |
|-----------|-------------|
| 慢速深蹲下蹲 | 跳跃起跳 |
| 单腿站立平衡 | 冲刺跑 |
| 瑜伽/普拉提 | 投掷 |
| 康复训练 | 高尔夫全挥杆 |
| 技术动作分段练习 | 网球发球 |

### 0.3 反馈干预方式

| 维度 | 控制性运动 | 非控制性运动 |
|------|-----------|-------------|
| **反馈时机** | ✅ 可实时提示（边做边纠正） | ❌ 只能事后回放分析 |
| **采样率要求** | 中等 (100-200 Hz) | 高 (500+ Hz) |
| **运动链分析重点** | 肌肉激活顺序、稳定性 | 力传导效率、峰值时序 |
| **用户干预方式** | 语音/震动实时提醒 | 视频叠加、数据对比 |

### 0.4 训练逻辑

```text
高水平表现 = 先掌握控制 → 再释放爆发

训练顺序：
1. 控制性练习 → 建立正确运动链模式
2. 逐步加速 → 测试模式是否保持
3. 非控制性爆发 → 检验最终表现
```

### 0.5 高尔夫分析：全速 vs 分段的结合

#### 两种场景对比

| 场景 | 运动类型 | 分析能做什么 | 局限性 |
|------|---------|-------------|--------|
| **全速挥杆** | 非控制性 | 事后诊断问题（哪里错了） | 用户无法"边做边改" |
| **分段慢挥** | 控制性 | 实时纠正 + 建立正确模式 | 不能直接迁移到比赛表现 |

#### 全速分析的"诊断-修复"困境

```text
全速挥杆分析 → 发现问题 → 告诉用户"核心发力太晚"
                              ↓
                    用户下一杆还是一样（因为太快来不及调整）
                              ↓
                    反复看到同样的错误 → 用户挫败
```

#### 分段练习解决这个问题

```text
分段慢挥 → 在"下杆启动"阶段实时提示"从核心发力"
                              ↓
              用户可以在那个瞬间体会正确感觉
                              ↓
              重复 50 次 → 建立肌肉记忆
                              ↓
              全速挥杆时自动执行正确模式
```

#### 产品策略：按用户阶段推荐模式比例

| 用户阶段 | 推荐模式 | 原因 |
|---------|---------|------|
| **初学者** | 80% 分段练习 + 20% 全速 | 先建立正确模式 |
| **中级** | 50% 分段 + 50% 全速 | 巩固 + 检验迁移 |
| **高级** | 20% 分段 + 80% 全速 | 微调 + 表现优化 |

#### 结论：两者必须结合

| 方案 | 效果 |
|------|------|
| ❌ 只做全速分析 | 能诊断问题，但用户难以改正 |
| ❌ 只做分段练习 | 能建立模式，但不知道全速时是否保持 |
| ✅ **两者结合** | 分段练习建立模式 → 全速分析验证迁移 |

!!! tip "核心洞察"
    Mode 2（分段练习）不是"降级版"的分析，而是**真正改变用户动作的关键环节**。

    全速分析告诉你"哪里错了"，分段练习教你"怎么做对"。

### 0.6 分段练习 = 模拟教练教学

分段练习（Mode 2）的实时反馈本质上是**模拟真人教练的现场教学**。

#### 真人教练 vs Movement Chain

| 教练行为 | Movement Chain 实现 | 对应模式 |
|---------|-------------------|---------|
| "站好，肩膀放松" | Setup Check 语音提示 | Mode 1 |
| "慢慢来，我看着你做" | 慢挥引导 + 阶段提示 | Mode 2 |
| "停！这里核心要先发力" | 检测到错误 → 实时语音纠正 | Mode 2 |
| "对，就是这个感觉，再来一次" | 正确模式确认 + 鼓励 | Mode 2 |
| "好，正常速度打一个看看" | 切换到全速分析 | Mode 3 |
| "刚才那杆节奏快了" | 挥杆后即时反馈 | Mode 3 |

#### 教练教学的核心循环

```text
1. 示范 → "看我怎么做"
2. 分解 → "我们一步一步来"
3. 引导 → "慢慢做，我在旁边看"      ← Mode 2 覆盖
4. 纠正 → "停，这里不对，应该..."    ← Mode 2 覆盖
5. 确认 → "对了，记住这个感觉"       ← Mode 2 覆盖
6. 加速 → "好，快一点试试"          ← Mode 2 覆盖
7. 检验 → "正常速度打一个"          ← Mode 3
8. 反馈 → "不错/还需要调整..."       ← Mode 3
```

Mode 2 覆盖了教练教学中**最核心的步骤 2-6**。

#### 分析工具 vs AI 教练

| 维度 | 只有全速分析（分析工具） | 有分段练习（AI 教练） |
|------|----------------------|---------------------|
| **角色** | 像"考官"：只告诉你对错 | 像"教练"：教你怎么做对 |
| **用户体验** | 知道问题但改不了 | 在过程中体会正确感觉 |
| **学习效果** | 被动接受评判 | 主动学习建立模式 |
| **情感** | 容易挫败 | 有成就感 |

!!! warning "产品定位"
    **Movement Chain 不只是"分析工具"，而是"AI 教练"**

    - 分析工具 = 告诉你哪里错了
    - AI 教练 = 教你怎么做对

    Mode 2（分段练习）是把产品从"分析工具"升级为"AI 教练"的关键功能。

---

## 1. 三种反馈模式 Three Feedback Modes

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THREE FEEDBACK MODES                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Mode 1: SETUP CHECK (站姿检查)              延迟要求: <300ms               │
│  ─────────────────────────────────────────────────────────────────────────  │
│  用户静止准备 → 实时检测姿势 → 语音/视觉反馈                                 │
│  "肩膀放松一点" / "脚再宽一点"                                               │
│                                                                              │
│  ⏱️ 用户有 2-5 秒反应时间 → 完全可行                                        │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Mode 2: SLOW MOTION TRAINING (慢动作训练)   延迟要求: <500ms               │
│  ─────────────────────────────────────────────────────────────────────────  │
│  用户慢速挥杆 (1/4-1/2 速度) → 每阶段检测 → 阶段性反馈                       │
│  "好，继续转肩..." / "现在开始下杆..."                                       │
│                                                                              │
│  ⏱️ 慢动作挥杆 3-5 秒 → 有时间在每阶段给反馈                                │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Mode 3: FULL SPEED ANALYSIS (全速分析)      延迟要求: <500ms (挥杆后)      │
│  ─────────────────────────────────────────────────────────────────────────  │
│  正常速度挥杆 → 挥杆后即时分析 → 综合反馈                                    │
│  "这一杆节奏不错，但核心发力可以更早"                                         │
│                                                                              │
│  ⏱️ 挥杆只有 1.2 秒 → 只能事后反馈                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 延迟预算 Latency Budget

### 2.1 端到端延迟分解

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    END-TO-END LATENCY BREAKDOWN                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  传感器采集        特征提取         规则判断         反馈生成                │
│  ────────────     ───────────      ──────────       ──────────              │
│                                                                              │
│  Vision: 33ms     MediaPipe: 30ms  规则引擎: <5ms   语音TTS: 50-100ms       │
│  IMU: <10ms       特征计算: <10ms                   视觉叠加: <20ms         │
│  EMG: <5ms        时间同步: <5ms                    触觉振动: <10ms         │
│                                                                              │
│  ────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  Mode 1 (Setup):    33 + 30 + 5 + 100 = ~170ms    ✅ < 300ms               │
│  Mode 2 (Slow):     33 + 30 + 5 + 100 = ~170ms    ✅ < 500ms               │
│  Mode 3 (Full):     33 + 30 + 5 + 100 = ~170ms    ✅ < 500ms               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 各模式延迟要求

| 模式 | 延迟要求 | 关键瓶颈 | 优化策略 |
|-----|---------|---------|---------|
| Setup Check | <300ms | TTS 生成 | 预缓存常用语音 |
| Slow Motion | <500ms | Vision 帧率 | 提高到 60fps |
| Full Speed | <500ms (挥杆后) | 分析复杂度 | 规则引擎优先 |

---

## 3. Mode 1: Setup Check (站姿检查)

### 3.1 设计原则

用户在挥杆前有 2-5 秒的准备时间，这是**最佳反馈窗口**：

- 用户静止，姿态稳定
- 有时间听取并调整
- 每次挥杆前都可以检查
- 这是教练最常做的事情

### 3.2 检测项目

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

### 3.3 实现代码

```python
class SetupChecker:
    """
    站姿实时检查器

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

## 4. Mode 2: Slow Motion Training (慢动作训练)

### 4.1 设计原则

这是**你的独特创新**：让用户以 1/4 或 1/2 速度练习，系统可以在每个阶段给出实时反馈。

```text
正常挥杆:  1.2 秒 (太快，无法实时反馈)
1/2 速度:  2.4 秒 (每阶段约 300ms，可以反馈)
1/4 速度:  4.8 秒 (每阶段约 600ms，充足反馈时间)
```

### 4.2 阶段性反馈设计

| 阶段 | 检测点 | 反馈内容 | 触发条件 |
|-----|-------|---------|---------|
| Address → Toe-Up | 起杆开始 | "好，慢慢起杆" | 检测到运动开始 |
| Toe-Up → Mid-Backswing | 手腕平行 | "继续转肩" | 手腕达到腰部高度 |
| Mid-Backswing → Top | 到顶点 | "转到位了" | 角速度接近零 |
| Top → Mid-Downswing | 下杆启动 | "从核心启动" | 检测到方向反转 |
| Mid-Downswing → Impact | 击球前 | "保持手腕" | 检测到加速 |
| Impact → Finish | 击球后 | "保持平衡" | 检测到击球 |

### 4.3 实现代码

```python
class SlowMotionCoach:
    """
    慢动作训练教练

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

### 4.4 慢动作模式的价值

| 优势 | 描述 |
|-----|------|
| **肌肉记忆** | 慢速练习帮助建立正确的运动模式 |
| **实时纠正** | 每个阶段都可以得到反馈并调整 |
| **无需等待** | 不用打完再看分析，边做边学 |
| **适合初学者** | 降低学习曲线，减少挫败感 |

---

## 5. Mode 3: Full Speed Analysis (全速分析)

### 5.1 设计原则

正常速度挥杆时，系统只能在**挥杆结束后**提供反馈。但反馈要足够快 (<500ms)，让用户在下一次挥杆前能消化。

### 5.2 反馈优先级

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FEEDBACK PRIORITY (POST-SWING)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  P0 (立即说): 严重问题，影响挥杆质量                                          │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • 发力顺序错误 (EMG: 手臂先于核心) → "从核心启动"                           │
│  • 运动链断裂 (EMG: 核心激活不足) → "收紧腹部发力"                            │
│                                                                              │
│  P1 (其次): 重要问题，影响表现                                                │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • X-Factor 不足 → "肩膀再多转一点"                                          │
│  • 节奏过快 → "上杆慢一点"                                                   │
│  • 速度不足 → "再用力一些"                                                   │
│                                                                              │
│  P2 (最后): 优化建议，锦上添花                                                │
│  ─────────────────────────────────────────────────────────────────────────  │
│  • 收杆平衡问题 → "注意收杆平衡"                                              │
│  • 细节调整 → 可以不说，留待详细分析                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 实现代码

```python
class PostSwingFeedback:
    """
    挥杆后即时反馈生成器

    在挥杆结束后 <500ms 内生成并播放反馈
    """

    def __init__(self, audio_player):
        self.audio_player = audio_player

    def generate_feedback(self, swing_analysis):
        """
        生成优先级排序的反馈

        Args:
            swing_analysis: dict with vision, imu, emg features and scores

        Returns:
            feedback_list: list of (priority, text, audio_file)
        """
        feedbacks = []

        # P0: EMG 独特洞察 (最高优先级)
        if swing_analysis.get('emg'):
            emg = swing_analysis['emg']

            if not emg.get('activation_sequence_correct', True):
                feedbacks.append((
                    0,
                    '发力顺序错了，从核心启动',
                    'core_first.mp3'
                ))

            if emg.get('core_activation', 100) < 50:
                feedbacks.append((
                    0,
                    '核心发力不够，收紧腹部',
                    'engage_core.mp3'
                ))

        # P1: Vision + IMU 分析
        vision = swing_analysis.get('vision', {})
        imu = swing_analysis.get('imu', {})

        if vision.get('x_factor', 100) < 35:
            feedbacks.append((
                1,
                '肩膀转不够，X因子只有{:.0f}度'.format(vision['x_factor']),
                'more_rotation.mp3'
            ))

        if imu.get('tempo_ratio', 3) < 2.5:
            feedbacks.append((
                1,
                '节奏太快，上杆慢一点',
                'slow_backswing.mp3'
            ))
        elif imu.get('tempo_ratio', 3) > 4.0:
            feedbacks.append((
                1,
                '节奏太慢，可以再流畅一些',
                'smoother_tempo.mp3'
            ))

        if imu.get('peak_angular_velocity', 1000) < 800:
            feedbacks.append((
                1,
                '速度不够，再用力一些',
                'more_power.mp3'
            ))

        # P2: 优化建议
        score = swing_analysis.get('score', 100)
        if score >= 80:
            feedbacks.append((
                2,
                '这一杆不错，{:.0f}分'.format(score),
                'good_swing.mp3'
            ))

        # 排序并返回前 2 个
        feedbacks.sort(key=lambda x: x[0])
        return feedbacks[:2]

    def play_feedback(self, feedbacks):
        """播放反馈"""
        for priority, text, audio_file in feedbacks:
            self.audio_player.play(audio_file)
            # 等待播放完成再说下一条
            break  # 只说最重要的一条
```

---

## 6. 语音反馈库 Audio Feedback Library

### 6.1 预录制语音文件

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
| **站姿问题** | `relax_shoulders.mp3` | "放松肩膀" | ~0.8s |
| | `wider_stance.mp3` | "脚再宽一点" | ~1s |
| | `bend_knees.mp3` | "膝盖弯一下" | ~1s |
| **正面反馈** | `good_swing.mp3` | "这一杆不错" | ~1s |
| | `great_power.mp3` | "力量很好" | ~0.8s |
| | `perfect.mp3` | "完美！" | ~0.6s |

### 6.2 TTS 动态生成

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

---

## 7. 触觉反馈 (Phase 2)

### 7.1 设计原则

触觉反馈 (<50ms 延迟) 是唯一能在挥杆过程中实时干预的方式。

### 7.2 振动模式

| 模式 | 振动时长 | 含义 | 触发条件 |
|-----|---------|-----|---------|
| 短振 (50ms) | 1次 | 轻微提示 | 接近阈值边界 |
| 短振 (50ms) | 2次 | 需要注意 | 超出阈值 |
| 长振 (200ms) | 1次 | 严重问题 | 严重超出阈值 |
| 连续振 | 持续 | 停止动作 | 危险动作 |

### 7.3 应用场景

| 场景 | 触发条件 | 振动模式 |
|-----|---------|---------|
| 上杆过快 | 上杆时间 < 500ms | 短振 2次 |
| 上杆顶点不够 | X-Factor < 20° | 短振 1次 |
| 下杆过早释放 | 手腕角度过早变化 | 短振 2次 |
| 疲劳预警 | EMG 激活强度下降 30% | 长振 1次 |

---

## 8. 与其他文档的关系

```mermaid
graph TD
    A[real-time-feedback.md] --> B[system-design.md]
    A --> C[swing-phases.md]
    A --> D[research/biomechanics-benchmarks.md]

    B --> E[规则引擎]
    C --> F[阶段检测]
    D --> G[阈值参考]

    style A fill:#e1f5fe
```

| 相关文档 | 内容 | 本文档使用 |
|---------|------|-----------|
| [系统设计](../architecture/system-design.md) | MVP 管道架构 | 规则引擎阈值 |
| [挥杆 8 阶段](swing-phases.md) | 阶段检测 | 阶段触发点 |
| [生物力学基准](../../prerequisites/foundations/biomechanics-benchmarks.md) | 指标阈值 | 问题判断标准 |
| [传感器映射](../architecture/sensor-data-processing.md) | 传感器能力 | 检测方法选择 |

---

## 9. 实施路线图

| Phase | 内容 | 优先级 |
|-------|------|--------|
| Phase 1 (MVP) | Mode 3: 全速分析 + 挥杆后反馈 | 🔴 必须 |
| Phase 1.5 | Mode 1: 站姿检查 | 🔴 必须 |
| Phase 2 | Mode 2: 慢动作训练 | 🟡 高 |
| Phase 2+ | 触觉振动反馈 | 🟡 高 |
| Phase 3 | LLM 个性化反馈 | 🟢 可选 |

---

**最后更新**: 2026-01-04
**维护者**: Movement Chain AI Team
