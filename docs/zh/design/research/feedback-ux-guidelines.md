# 动作纠正反馈 UI/UX 设计指南 (Movement Correction Feedback UI/UX Design Guidelines)

**文档版本 (Document Version):** 1.0
**日期 (Date):** 2025-12-01
**状态 (Status):** 研究汇编与设计建议 (Research Compilation & Design Recommendations)

---

## 执行摘要 (Executive Summary)

本文档综合了在 Movement Chain AI 系统中显示实时动作纠正反馈的 UI/UX 最佳实践。它结合了以下方面的见解:

- **平台指南 (Platform Guidelines)**: Apple HIG, Material Design motion principles
- **行业案例 (Industry Examples)**: Nike Training Club, Strava, AR fitness applications
- **学术研究 (Academic Research)**: Motor learning studies, augmented feedback effectiveness
- **无障碍标准 (Accessibility Standards)**: WCAG 2.1, color-blind friendly design

**核心设计理念 (Core Design Philosophy):**
> 提供即时、可操作的反馈,增强动作学习,同时不会在动作执行期间让用户感到不知所措或遮挡他们的视野。
>
> Provide immediate, actionable feedback that enhances motor learning without overwhelming the user or obscuring their view during movement execution.

---

## 1. 视觉层级与信息架构 (Visual Hierarchy & Information Architecture)

### 1.1 基于优先级的信息显示 (Priority-Based Information Display)

基于研究表明**多模态反馈在被快速感知和长期保留方面最有效** ([Sigrist et al., 2013](https://link.springer.com/article/10.3758/s13423-012-0333-8)),建立清晰的视觉优先级:

**优先级 1 (Priority Level 1) - 关键错误,需要立即关注 (Critical Errors - Immediate Attention Required)**
- **何时显示 (When to Show)**: 伤害风险错误 (例如,膝内翻、腰椎过度伸展)
- **视觉处理 (Visual Treatment)**:
  - 大型、粗体指示器
  - 高对比度 (见色彩方案部分)
  - 以 1-2 Hz 频率脉动动画
  - 伴随触觉脉冲 (如果启用)
- **屏幕占用 (Screen Real Estate)**: 15-20% 视口
- **示例 (Example)**: 膝关节上的红色圆形高亮,带向下纠正箭头

**优先级 2 (Priority Level 2) - 性能错误,重要但不紧急 (Performance Errors - Important but Non-Urgent)**
- **何时显示 (When to Show)**: 影响性能的技术错误 (例如,挥杆平面偏差)
- **视觉处理 (Visual Treatment)**:
  - 中等尺寸指示器
  - 中等对比度
  - 微妙动画 (仅淡入,无脉动)
  - 可选触觉反馈
- **屏幕占用 (Screen Real Estate)**: 10-15% 视口
- **示例 (Example)**: 黄色弧形叠加层,显示理想与实际球杆路径

**优先级 3 (Priority Level 3) - 信息性,仅上下文 (Informational - Context Only)**
- **何时显示 (When to Show)**: 正面强化、次要指标
- **视觉处理 (Visual Treatment)**:
  - 小型、低对比度指示器
  - 静态或非常微妙的动画
  - 无触觉反馈
- **屏幕占用 (Screen Real Estate)**: 5-10% 视口
- **示例 (Example)**: 正确定位关节上的绿色对勾

### 1.2 防止视觉过载 (Preventing Visual Overload)

**研究发现 (Research Finding)**: 研究表明,忽视用户偏好的反馈设计可能会导致不适并减少运动益处 ([MDPI Healthcare Study](https://www.mdpi.com/2227-9032/11/13/1835))。

**最大同时指示器规则 (Maximum Simultaneous Indicators Rule):**
- **实时模式 (Real-time mode)**: 最多同时显示 2 个错误指示器
- **动作后回顾 (Post-action review)**: 可以显示 3-5 个错误标记 (无运动干扰)

**优先级队列逻辑 (Priority Queue Logic):**
```
IF multiple_errors_detected:
    1. Filter by priority (injury risk > performance > informational)
    2. Show top 2 highest-priority errors
    3. Store remaining errors for post-action review
    4. Display "+N more" subtle badge if errors queued
```

**用户控制 (User Control):**
- 设置切换: "实时反馈密度" (最小化 / 适中 / 详细)
- 按错误类型切换: 允许用户禁用特定错误类型
- "专注模式": 在动作期间仅显示优先级 1 错误

### 1.3 何时使用箭头、颜色、文本 (When to Use Arrows vs. Color vs. Text)

| 反馈类型 Feedback Type | 箭头 Arrow | 颜色 Color | 文本 Text | 使用场景 Use Case |
|---------------|-------|-------|------|----------|
| **关节位置错误 Joint Position Error** | ✓ 主要 Primary | ✓ 次要 Secondary | ✗ | 显示纠正方向 (例如,"伸直肘部") |
| **运动路径偏差 Movement Path Deviation** | ✓ 叠加 Overlay | ✓ 路径颜色 Path color | ✗ | 显示理想与实际轨迹 (高尔夫挥杆平面) |
| **时机错误 Timing Error** | ✗ | ✓ 阶段指示器 Phase indicator | ✓ 小标签 Small label | 显示 "太早/太晚",带彩色编码时间线 |
| **肌肉激活错误 Muscle Activation Error** | ✗ | ✓ 热图 Heatmap | ✓ 标签 Label | EMG 信号可视化 ("核心激活弱") |
| **正面强化 Positive Reinforcement** | ✗ | ✓ 高亮 Highlight | ✓ 简短消息 Brief message | "动作良好!" 关节上的绿色光晕 |

**箭头设计规范 (Arrow Design Specifications):**
- **锚点 (Anchor Point)**: 附着在受影响关节中心,而非身体段边缘
- **方向 (Direction)**: 指向纠正位置 (3D 投影到 2D 屏幕)
- **长度 (Length)**: 与错误幅度成正比 (最小: 20px, 最大: 80px)
- **粗细 (Thickness)**: 6-8px 笔画宽度 (可见但不突兀)
- **动画 (Animation)**: 以 1 Hz 微妙脉动 (见动画部分)

---

## 2. 实时叠加技术 (Real-Time Overlay Techniques)

### 2.1 幽灵形象透明度级别 (Ghost Avatar Transparency Levels)

**基于研究的建议 (Research-Backed Recommendations):**

基于 AR 健身应用分析 ([AR Fitness Applications](https://riseapps.co/fitness-augmented-reality/)) 和透明度设计原则 ([Marvel Design Blog](https://marvelapp.com/blog/using-transparency-in-visual-design/)):

**用户实时骨架 (User's Live Skeleton) - 始终 100% 不透明度 (Always 100% Opacity)**
- **理由 (Rationale)**: 主要参考点,必须完全可见
- **颜色 (Color)**: 白色或浅蓝色 (#E0F7FF)
- **笔画宽度 (Stroke Width)**: 关节 4px, 骨骼 3px

**理想/专家幽灵形象 (Ideal/Expert Ghost Avatar) - 40-60% 不透明度 (40-60% Opacity)**
- **推荐 (Recommended)**: 50% 不透明度 (α = 0.5)
- **理由 (Rationale)**: 清晰可见用于比较,不遮挡用户身体
- **颜色 (Color)**: 绿色 (#4CAF50) 表示正确位置
- **实现 (Implementation)**:
  ```css
  .ghost-skeleton {
    opacity: 0.5;
    stroke: #4CAF50;
    stroke-width: 3px;
    fill: none;
  }
  ```

**先前尝试叠加层 (Previous Attempt Overlay) - 25-35% 不透明度 (25-35% Opacity)**
- **推荐 (Recommended)**: 30% 不透明度 (α = 0.3)
- **理由 (Rationale)**: 提供上下文而不杂乱视图
- **颜色 (Color)**: 浅灰色 (#BDBDBD)
- **使用场景 (Use Case)**: 显示用户之前最佳重复以供比较

**透明度调整 (Transparency Adjustment):**
- **用户设置 (User Setting)**: 滑块从 30% 到 70% (默认 50%)
- **自动变暗 (Auto-Dimming)**: 如果相机检测到低光条件,降低 20% 不透明度
- **碰撞检测 (Collision Detection)**: 如果幽灵和实时骨架重叠 >80%,将幽灵不透明度提高到 60% 以提高清晰度

### 2.2 并排比较的放置策略 (Placement Strategies for Side-by-Side Comparisons)

**全屏叠加模式 (Full-Screen Overlay Mode) - 实时默认 (Default for Real-Time)**
```
┌─────────────────────────────────┐
│  Camera Feed (Live)             │
│                                 │
│      [Live Skeleton]            │
│      [Ghost Overlay 50%]        │
│      [Error Arrows]             │
│                                 │
│  [Quality Score] [Rep Count]    │
└─────────────────────────────────┘
```

**分屏模式 (Split-View Mode) - 动作后回顾 (Post-Action Review)**
```
┌─────────────────┬───────────────┐
│   Your Rep      │  Ideal Form   │
│                 │               │
│   [Replay]      │  [Template]   │
│                 │               │
│   [Arrows on    │  [Clean       │
│    errors]      │   skeleton]   │
└─────────────────┴───────────────┘
     Score: 72/100
```

**防止视图遮挡 (Preventing View Obstruction):**

1. **安全区 (Safe Zones)**: 为 UI 控件保留顶部 15% 和底部 20%
2. **动态重新定位 (Dynamic Repositioning)**: 如果错误箭头与面部检测区域重叠,移至相邻象限
3. **遮挡处理 (Occlusion Handling)**:
   ```
   IF joint_confidence < 0.6:  # Camera can't see joint
       Hide error arrow for that joint
       Show text warning: "Reposition camera"
   ```

### 2.3 60 FPS 渲染优化 (Rendering Optimization for 60 FPS)

基于移动 AR 性能研究 ([Unity Best Practices](https://unity.com/how-to/best-practices-vr-and-mobile-ar-graphics), [NCBI Multi-Resolution Study](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10422453/)):

**细节层次 (Level of Detail - LOD) 策略:**
- **近距离 (Close-up) - 用户 <2m 距相机**: 完整骨架 (17 个关键点),详细错误箭头
- **中距离 (Medium) - 2-4m**: 简化骨架 (11 个关键点: 肩、肘、腕、臀、膝、踝)
- **远距离 (Far) - >4m**: 简化叠加层 (5 个关键点: 肩、臀、膝)

**渲染管线 (Rendering Pipeline):**
```
Camera Frame (60 FPS)
  → Pose Estimation (30-50ms)
    → Skeleton Rendering (GPU, 5-8ms)
      → Error Overlay (CPU, 3-5ms)
        → Composite (GPU, 2-3ms)
          → Display (16.7ms budget for 60 FPS)
```

**优化技术 (Optimization Techniques):**
1. **预计算资源 (Pre-computed Assets)**: 缓存箭头精灵,不在每帧重绘矢量
2. **批处理 (Batching)**: 在单次绘制调用中渲染所有骨架线
3. **早期剔除 (Early Culling)**: 不渲染置信度 <0.4 的关节
4. **Alpha 混合 (Alpha Blending)**: 使用 GPU 加速透明度 (避免基于 CPU 的合成)

**透明度性能 (Transparency Performance):**
- **警告 (Warning)**: 半透明材质具有昂贵的每像素成本 ([Unity VR/AR Guidelines](https://unity.com/how-to/best-practices-vr-and-mobile-ar-graphics))
- **缓解 (Mitigation)**: 使用简单 alpha 混合,避免分层透明度效果
- **目标 (Target)**: 中端设备上透明度开销 <5ms 每帧

---

## 3. 动画与过渡规范 (Animation & Transition Specifications)

### 3.1 箭头动画模式 (Arrow Animation Patterns)

**研究基础 (Research Foundation)**: Material Design 强调动作应该是信息性的、有针对性的和富有表现力的 ([Material Design Motion](https://m3.material.io/styles/motion/overview/how-it-works))。

**纠正箭头状态 (Correction Arrow States):**

**状态 1: 出现 (State 1: Appearance) - 检测到错误 (Error Detected)**
```
Animation: Fade-in + Scale-up
Duration: 200ms
Easing: Ease-out cubic-bezier(0.25, 0.1, 0.25, 1)
From: opacity 0%, scale 0.8
To: opacity 100%, scale 1.0
```

**状态 2: 活动错误 (State 2: Active Error) - 脉动 (Pulsing)**
```
Animation: Pulse (opacity variation)
Duration: 1000ms (1 Hz frequency)
Easing: Ease-in-out sine
From: opacity 80%
To: opacity 100%
Loop: Infinite while error persists
```

**状态 3: 纠正进行中 (State 3: Correction in Progress) - 淡化 (Fading)**
```
Animation: Opacity fade
Duration: 400ms
Easing: Ease-out
From: opacity 100%
To: opacity 40%
Trigger: Error severity reduces by >30%
```

**状态 4: 已纠正 (State 4: Corrected) - 退出 (Exit)**
```
Animation: Fade-out + Scale-down + Checkmark
Duration: 300ms
Easing: Ease-in cubic-bezier(0.42, 0, 0.58, 1)
From: opacity 100%, scale 1.0
To: opacity 0%, scale 0.7
Final: Show green checkmark (150ms), then fade
```

**静态与动画指示器决策矩阵 (Static vs. Animated Indicators Decision Matrix):**

| 错误类型 Error Type | 实时 Real-Time | 动作后 Post-Action | 动画类型 Animation Type |
|------------|-----------|-------------|----------------|
| **高优先级 High Priority** | 脉动 Pulsing (1 Hz) | 带高亮的静态 Static with highlight | 引起注意 Attention-grabbing |
| **中优先级 Medium Priority** | 仅淡入 Fade-in only | 静态 Static | 不分散注意力 Non-distracting |
| **低优先级 Low Priority** | 静态 Static | 静态 Static | 最小认知负荷 Minimal cognitive load |

### 3.2 正确/错误状态转换 (Correct/Incorrect State Transitions)

**颜色转换时机 (Color Transition Timing):**
```
Error Detected → Yellow (Warning)
  → 200ms ease-out transition

Yellow (Warning) → Red (Critical)
  → 400ms ease-in transition if error worsens

Red (Critical) → Yellow (Improving)
  → 300ms ease-out transition

Yellow (Improving) → Green (Corrected)
  → 250ms ease-out transition
  → Hold green for 1000ms
  → Fade out over 300ms
```

**状态机滞后 (State Machine Hysteresis):**
```python
def update_error_state(current_severity, previous_severity):
    # Prevent rapid flickering between states
    HYSTERESIS_THRESHOLD = 1.0  # Severity units

    if abs(current_severity - previous_severity) < HYSTERESIS_THRESHOLD:
        return previous_state  # Don't change state

    if current_severity > 7.0:
        return "RED_CRITICAL"
    elif current_severity > 4.0:
        return "YELLOW_WARNING"
    else:
        return "GREEN_GOOD"
```

**动画性能预算 (Animation Performance Budget):**
- **目标 (Target)**: 所有动画 <16.7ms 每帧 (60 FPS)
- **Material Design 时机**: 移动端动画对于较大动作 300-400ms,较小动作 150-200ms ([Material Design Motion](https://m2.material.io/design/motion/understanding-motion.html))

### 3.3 过渡平滑度 (Transition Smoothness) - 避免突兀变化 (Avoiding Jarring Changes)

**缓动函数参考 (Easing Functions Reference):**
```javascript
// Import from Material Design easing curves
const EASE_OUT = 'cubic-bezier(0.25, 0.1, 0.25, 1)';      // Exit animations
const EASE_IN = 'cubic-bezier(0.42, 0, 0.58, 1)';         // Enter animations
const EASE_IN_OUT = 'cubic-bezier(0.4, 0, 0.2, 1)';       // State changes
const LINEAR = 'linear';                                   // Continuous motion
```

**示例实现 (Example Implementation) - Flutter:**
```dart
AnimatedOpacity(
  opacity: errorDetected ? 1.0 : 0.0,
  duration: Duration(milliseconds: 200),
  curve: Curves.easeOut,
  child: CorrectionArrow(
    direction: errorVector,
    color: errorColor,
  ),
);
```

**防止晕动症 (Preventing Motion Sickness):**
- **避免 (Avoid)**: 快速缩放、旋转动画
- **使用 (Use)**: 仅淡入淡出、滑动、微妙缩放
- **最大旋转 (Max Rotation)**: 方向箭头 ±15° (无连续旋转)
- **最大缩放变化 (Max Scale Change)**: 0.8x 到 1.2x (避免突兀的大小跳跃)

---

## 4. 移动端特定考虑 (Mobile-Specific Considerations)

### 4.1 屏幕尺寸约束 (Screen Size Constraints)

**响应式缩放规则 (Responsive Scaling Rules):**

| 屏幕尺寸 Screen Size | 骨架笔画 Skeleton Stroke | 箭头粗细 Arrow Thickness | 最小触摸目标 Min Touch Target | 字体大小 Font Size (错误标签 Error Labels) |
|-------------|----------------|-----------------|------------------|--------------------------|
| **小型 Small (<5.5")** | 3px | 5px | 44×44px (Apple) | 14pt |
| **中型 Medium (5.5-6.5")** | 4px | 6px | 44×44px | 16pt |
| **大型 Large (>6.5")** | 5px | 8px | 48×48px | 18pt |

**动态视口适配 (Dynamic Viewport Adaptation):**
```javascript
const getScaleFactor = (screenDiagonal) => {
  // Base design: 6.1" iPhone 14
  const BASE_DIAGONAL = 6.1;
  return Math.min(screenDiagonal / BASE_DIAGONAL, 1.3); // Cap at 1.3x
};

const arrowThickness = 6 * getScaleFactor(deviceDiagonal);
```

**横向与纵向模式 (Landscape vs. Portrait Mode):**
- **高尔夫 (Golf)**: 横向优先 (挥杆平面更宽视野)
- **健身 (Workout)**: 纵向优先 (全身垂直取景)
- **自动旋转 (Auto-Rotation)**: 在主动运动期间禁用 (防止迷失方向的翻转)

### 4.2 实时渲染性能优化 (Performance Optimization for Real-Time Rendering)

**电池影响缓解 (Battery Impact Mitigation)** - 目标: <15% 电量消耗/小时:

1. **帧率自适应 (Frame Rate Adaptation):**
   ```
   Battery Level > 50%: 60 FPS rendering
   Battery 20-50%: 45 FPS rendering
   Battery < 20%: 30 FPS + warning prompt
   ```

2. **热节流 (Thermal Throttling):**
   ```
   Device Temp < 40°C: Full rendering
   Device Temp 40-45°C: Reduce shadow effects, simplify overlays
   Device Temp > 45°C: Show warning, reduce to 30 FPS
   ```

3. **内存管理 (Memory Management):**
   - **预分配缓冲区 (Pre-allocate buffers)**: 重用相机帧缓冲区 (避免 GC 暂停)
   - **纹理图集 (Texture atlases)**: 将箭头精灵组合到单个纹理中 (减少绘制调用)
   - **目标 (Target)**: 峰值渲染期间 <500MB RAM 使用

**Flutter 特定优化 (Flutter-Specific Optimizations)** (参见 [ADR-0003](../../design/decisions/0003-flutter-mobile.md)):
```dart
// Use RepaintBoundary to isolate animated layers
RepaintBoundary(
  child: CustomPaint(
    painter: SkeletonOverlayPainter(),
    child: OverlayArrows(),
  ),
);

// Run heavy computations on isolate
final errorAnalysis = await compute(analyzeMovement, sensorData);
```

### 4.3 触摸友好的反馈模式切换控件 (Touch-Friendly Controls for Toggling Feedback Modes)

**控制面板设计 (Control Panel Design):**
```
┌─────────────────────────────────┐
│  [Live Camera Feed]             │
│                                 │
│  Floating Controls (Bottom):    │
│  ┌────────────────────────────┐ │
│  │ [👁️ Overlay] [🎯 Arrows]    │ │
│  │ [📊 Metrics] [⚙️ Settings]   │ │
│  └────────────────────────────┘ │
└─────────────────────────────────┘
```

**按钮规范 (Button Specifications):**
- **尺寸 (Size)**: 56×56px (Material FAB 标准)
- **间距 (Spacing)**: 按钮间 16px
- **反馈 (Feedback)**: 点击时触觉点击 (Android HapticFeedbackConstants.CONTEXT_CLICK)
- **状态指示器 (State Indicator)**: 活动时图标颜色变化 + 2px 轮廓

**快速切换手势 (Quick Toggle Gestures):**
- **双击屏幕 (Double-tap screen)**: 切换所有叠加层开/关
- **从顶部向下滑动 (Swipe down from top)**: 显示/隐藏指标栏
- **长按相机视图 (Long-press camera view)**: 冻结帧以便更仔细检查 (仅动作后)

**无障碍 (Accessibility):**
- **语音控制 (Voice Control)**: "隐藏箭头", "显示骨架"
- **开关访问 (Switch Access)**: 所有切换可通过键盘导航
- **最小触摸目标 (Minimum Touch Target)**: 44×44px (Apple HIG) / 48×48px (Material)

---

## 5. 色彩方案与无障碍 (Color Palettes & Accessibility)

### 5.1 色盲友好色彩方案 (Color-Blind Friendly Palettes)

**研究基础 (Research Foundation)**: 红/绿是最常见的色觉缺陷,影响约 8% 的男性 ([Coloring for Colorblindness](https://davidmathlogic.com/colorblind/))。

**主要色彩方案 (Primary Palette) - 替代红-黄-绿交通灯 (Replaces Red-Yellow-Green Traffic Light):**

| 状态 State | 颜色名称 Color Name | 十六进制代码 Hex Code | RGB | 使用场景 Use Case | 色盲安全? Color-Blind Safe? |
|-------|-----------|----------|-----|----------|-------------------|
| **关键错误 Critical Error** | 深红 Dark Red | `#C62828` | (198, 40, 40) | 高优先级错误 High-priority errors | ⚠️ 否 No (需配合图标 use with icon) |
| **警告 Warning** | 琥珀 Amber | `#F9A825` | (249, 168, 37) | 中优先级错误 Medium-priority errors | ✓ 是 Yes (高亮度 high lightness) |
| **良好/正确 Good/Correct** | 蓝绿 Blue-Green | `#00897B` | (0, 137, 123) | 正面反馈 Positive feedback | ✓ 是 Yes |
| **中性 Neutral** | 浅灰 Light Gray | `#BDBDBD` | (189, 189, 189) | 信息性 Informational | ✓ 是 Yes |

**替代色彩方案 (Alternative Palette) - 蓝-橙最大无障碍 (Blue-Orange for Maximum Accessibility):**

| 状态 State | 颜色名称 Color Name | 十六进制代码 Hex Code | RGB | 使用场景 Use Case |
|-------|-----------|----------|-----|----------|
| **错误 Error** | 深橙 Deep Orange | `#E64A19` | (230, 74, 25) | 错误 Errors (对红盲者呈现橄榄色 appears olive to red-blind) |
| **正确 Correct** | 蓝色 Blue | `#1976D2` | (25, 118, 210) | 正面反馈 Positive feedback |
| **警告 Warning** | 琥珀 Amber | `#FFA726` | (255, 167, 38) | 中等问题 Moderate issues |

**对比度要求 (Contrast Requirements)** - WCAG 2.1 Level AA:
- **叠加层上的文本 (Text on overlay)**: 最小 4.5:1 对比度
- **图形元素 (Graphical elements)** (箭头、骨架): 与背景最小 3:1 对比度
- **测试工具 (Testing Tool)**: [Accessible Color Palette Generator](https://venngage.com/tools/accessible-color-palette-generator)

### 5.2 补充视觉指示器 (Supplementary Visual Indicators) - 颜色之外 (Beyond Color)

**研究洞察 (Research Insight)**: "颜色不应该是交互元素的唯一指示器" ([OSU ETS Guidelines](https://ets.osu.edu/color-guidelines-digital-accessibility))。

**基于图标的错误指示器 (Icon-Based Error Indicators):**

| 错误类型 Error Type | 图标 Icon | 颜色 Color | 形状 Shape |
|------------|------|-------|-------|
| **关键错误 Critical Error** | ⚠️ 警告三角形 Warning Triangle | 红色 Red `#C62828` | 带感叹号的三角形 Triangle with exclamation |
| **警告 Warning** | ⚡ 闪电 Lightning Bolt | 琥珀 Amber `#F9A825` | 之字形 Zigzag shape |
| **已纠正 Corrected** | ✓ 对勾 Checkmark | 蓝绿 Blue-Green `#00897B` | 带勾的圆圈 Circle with check |
| **信息 Information** | ℹ️ 信息圆圈 Info Circle | 灰色 Gray `#757575` | 带 'i' 的圆圈 Circle with 'i' |

**图案叠加层 (Pattern Overlays) - 为色盲用户 (for Color-Blind Users):**
```
Critical: Diagonal stripes (45° angle, 2px lines)
Warning: Dotted border (4px dots, 2px spacing)
Correct: Solid fill with subtle glow
```

**实现示例 (Implementation Example):**
```dart
// Combine color + icon + pattern
Container(
  decoration: BoxDecoration(
    color: errorColor.withOpacity(0.2),
    border: Border.all(
      color: errorColor,
      width: 2,
      style: severity > 7 ? BorderStyle.solid : BorderStyle.none,
    ),
  ),
  child: Row(
    children: [
      Icon(getErrorIcon(errorType), color: errorColor),
      Text(errorMessage, style: TextStyle(color: errorColor)),
    ],
  ),
);
```

### 5.3 肤色与背景适配 (Skin Tone & Background Adaptation)

**挑战 (Challenge)**: 白色骨架叠加层在浅肤色上可能不可见;深色叠加层与深色背景冲突。

**动态颜色调整 (Dynamic Color Adjustment):**
```python
def adapt_overlay_color(camera_frame, user_bbox):
    # Sample average brightness in user's bounding box
    user_region = camera_frame[bbox.y:bbox.y+bbox.h, bbox.x:bbox.x+bbox.w]
    avg_luminance = cv2.cvtColor(user_region, cv2.COLOR_BGR2GRAY).mean()

    if avg_luminance > 180:  # Light background/skin
        skeleton_color = (0, 100, 200)  # Dark blue
        arrow_color = (200, 50, 50)     # Dark red
    elif avg_luminance < 80:  # Dark background
        skeleton_color = (255, 255, 255)  # White
        arrow_color = (255, 150, 0)       # Orange
    else:  # Medium
        skeleton_color = (200, 230, 255)  # Light blue
        arrow_color = (255, 80, 80)       # Red

    return skeleton_color, arrow_color
```

**高对比度模式 (High-Contrast Mode) - 用户设置 (User Setting):**
- **启用 (Enabled)**: 将所有笔画宽度增加 50%,仅使用纯黑/白
- **使用场景 (Use Case)**: 明亮户外照明 (高尔夫练习场)

---

## 6. 触觉反馈模式 (Haptic Feedback Patterns)

### 6.1 不同错误类型的振动模式 (Vibration Patterns for Different Error Types)

**研究基础 (Research Foundation)**: 最佳 UX 同步视觉、音频和触觉反馈,同时触发所有三者 ([Saropa Contacts 2025 Guide](https://saropa-contacts.medium.com/2025-guide-to-haptics-enhancing-mobile-ux-with-tactile-feedback-676dd5937774))。

**标准触觉库 (Standard Haptic Library)** - iOS CoreHaptics / Android HapticFeedbackConstants:

| 错误类型 Error Type | 触觉模式 Haptic Pattern | 持续时间 Duration | 强度 Intensity | 平台 API Platform API |
|------------|---------------|----------|-----------|--------------|
| **关键错误 Critical Error** | 双击 Double Tap | 80ms (40ms + gap + 40ms) | 1.0 (最大 max) | `UINotificationFeedbackType.error` (iOS) |
| **警告 Warning** | 单击 Single Tap | 50ms | 0.7 (中等 moderate) | `UIImpactFeedbackStyle.medium` (iOS) |
| **已纠正 Corrected** | 成功脉冲 Success Pulse | 30ms | 0.5 (轻微 light) | `UINotificationFeedbackType.success` (iOS) |
| **实时提示 Real-Time Cue** | 轻柔推动 Gentle Nudge | 20ms | 0.4 (微妙 subtle) | `UIImpactFeedbackStyle.light` (iOS) |

**Android 实现 (Android Implementation):**
```kotlin
// Use HapticFeedbackConstants for consistency
view.performHapticFeedback(
    HapticFeedbackConstants.CONTEXT_CLICK,  // For warnings
    HapticFeedbackConstants.FLAG_IGNORE_GLOBAL_SETTING  // Override user mute
)

// For critical errors
view.performHapticFeedback(HapticFeedbackConstants.REJECT)
```

**自定义波形 (Custom Waveform)** - ESP32-S3 可穿戴传感器:
```cpp
// DRV2605L haptic driver commands
void triggerCriticalErrorHaptic() {
    drv.setWaveform(0, 47);  // Strong Click 100%
    drv.setWaveform(1, 0);   // End sequence (gap)
    drv.go();
    delay(50);
    drv.setWaveform(0, 47);  // Repeat for double-tap
    drv.go();
}

void triggerWarningHaptic() {
    drv.setWaveform(0, 10);  // Soft Bump 70%
    drv.setWaveform(1, 0);
    drv.go();
}
```

### 6.2 与视觉反馈的时序同步 (Timing Synchronization with Visual Feedback)

**同步要求 (Synchronization Requirements):**
```
Visual Error Appears (t=0ms)
  ↓
Haptic Trigger (t=0-10ms)  ← Must be within 10ms of visual
  ↓
Audio Cue (optional, t=0-15ms)
```

**实现 (Implementation)** - Flutter with BLE Wearable:
```dart
void triggerErrorFeedback(ErrorType error) async {
  final startTime = DateTime.now();

  // 1. Update visual state (synchronous)
  setState(() {
    activeErrors.add(error);
  });

  // 2. Trigger haptic (asynchronous but fast)
  unawaited(HapticFeedback.heavyImpact());  // Phone haptic
  unawaited(bleManager.sendHapticCommand(error.hapticPattern));  // Wearable

  // 3. Optional audio cue
  if (settings.audioEnabled) {
    unawaited(audioPlayer.play(error.soundEffect));
  }

  // Log sync timing for debugging
  final syncDelay = DateTime.now().difference(startTime).inMilliseconds;
  if (syncDelay > 15) {
    logger.warning('Haptic sync delayed: ${syncDelay}ms');
  }
}
```

### 6.3 用户控制与无障碍 (User Control & Accessibility)

**触觉设置 UI (Haptic Settings UI):**
```
┌─────────────────────────────────┐
│  Haptic Feedback Settings       │
│                                  │
│  Enable Haptics:  [✓]           │
│                                  │
│  Intensity:                      │
│  [━━━━━●━━━━] 70%               │
│  (Subtle)  (Strong)              │
│                                  │
│  Trigger Threshold:              │
│  ○ All Errors                    │
│  ● Medium+ Priority              │
│  ○ Critical Only                 │
│                                  │
│  Phone Haptics:    [✓]           │
│  Wearable Haptics: [✓]           │
└─────────────────────────────────┘
```

**无障碍考虑 (Accessibility Considerations)** ([Boréas Technologies Guidelines](https://pages.boreas.ca/blog/piezo-haptics/guidelines-of-haptic-ux-design)):
- **选择退出 (Opt-out)**: 允许用户禁用触觉 (感觉处理差异)
- **强度控制 (Intensity Control)**: 0-100% 滑块 (默认 70%)
- **频率限制 (Frequency Limits)**: 每 500ms 最多 1 次触觉事件 (防止过载反馈)
- **省电模式 (Battery Saver)**: 电量 <15% 时自动禁用触觉

---

## 7. 基于研究的最佳实践 (Research-Backed Best Practices)

### 7.1 动作学习研究洞察 (Motor Learning Research Insights)

**多模态反馈优势 (Multimodal Feedback Superiority):**
> "多模态增强反馈似乎是在健康和患病人群以及运动员的动作学习中给予反馈的最有效和最合适的方式,因为与单模态刺激相比,其刺激被感知得更快且倾向于保留更长时间。" ([PMC Motor Learning Review](https://pmc.ncbi.nlm.nih.gov/articles/PMC8681883/))
>
> "Multimodal augmented feedback seems to be the most effective and appropriate way to give feedback during motor learning in healthy and diseased populations and athletes as its stimuli are perceived faster and tend to be retained longer compared with unimodal stimuli."

**实现 (Implementation):**
- 结合视觉 (箭头 + 颜色) + 触觉 (振动) + 音频 (可选蜂鸣)
- 默认: 视觉 + 触觉 (音频选择加入)
- 高级用户可以禁用各个模式

**视觉反馈作为主要模式 (Visual Feedback as Primary Modality):**
> "视觉反馈被认为是所有增强反馈类型的基石,因为它在学习复杂技能方面具有优势。" ([Motor Learning Systematic Review](https://www.researchgate.net/publication/356372598_The_Role_of_Augmented_Feedback_on_Motor_Learning_A_Systematic_Review))
>
> "Visual feedback is considered the cornerstone of all augmented feedback types by citing its superiority in learning complex skills."

**实现 (Implementation):**
- 优先考虑视觉清晰度而非触觉强度
- 使用触觉来强化而非替代视觉提示

### 7.2 AR 健身应用案例研究 (AR Fitness Application Case Studies)

**Kemtai (动作纠正功能 Motion Correction Features):**
- 通过设备相机进行实时动作跟踪
- 与标准化动作进行比较
- 即时纠正反馈显示
- **启示 (Lesson)**: 用户对并排比较反应良好

**Nike Training Club (视觉设计 Visual Design):**
- 简洁、高对比度界面 (白色背景 + 霓虹强调色)
- 极简设计减少健身期间的干扰
- **启示 (Lesson)**: 实时反馈少即是多
- [Source: Stormotion Fitness App UX](https://stormotion.io/blog/fitness-app-ux/)

**Strava (进度可视化 Progress Visualization):**
- 统计卡片在加载时轻柔脉动
- 成就以品牌橙色发光
- **启示 (Lesson)**: 微妙动画增强参与度而不分散注意力
- [Source: DesignRush Best Fitness Apps](https://www.designrush.com/best-designs/apps/trends/fitness-app-design-examples)

### 7.3 关于增强反馈的学术发现 (Academic Findings on Augmented Feedback)

**反馈频率 (Feedback Frequency):**
> "与 100% 反馈相比,降低频率的反馈计划 (例如,每 3 次重复) 增强长期保留。" ([ScienceDirect Study](https://www.sciencedirect.com/science/article/abs/pii/S1469029222001455))
>
> "Reduced frequency feedback schedules (e.g., every 3rd rep) enhance long-term retention compared to 100% feedback."

**实现 (Implementation):**
- **初学者模式 (Beginner Mode)**: 每次重复反馈 (100%)
- **中级模式 (Intermediate Mode)**: 每 2 次重复反馈 (50%)
- **高级模式 (Advanced Mode)**: 每 3 次重复反馈 + 总结 (33%)

**渐减反馈协议 (Faded Feedback Protocol):**
```python
def calculate_feedback_frequency(session_number):
    # Start with 100% feedback, gradually reduce
    if session_number <= 3:
        return 1.0  # 100% (every rep)
    elif session_number <= 7:
        return 0.5  # 50% (every 2nd rep)
    else:
        return 0.33  # 33% (every 3rd rep)
```

**视觉提示有效性 (Visual Cue Effectiveness):**
> "在大多数情况下,[混合现实反馈] 涉及视觉提示以帮助用户理解纠正反馈。" ([IEEE Visualization Survey](https://dl.acm.org/doi/10.1109/TVCG.2022.3227999))
>
> "In most cases, [mixed reality feedback] involves visual cues to help the user understand the corrective feedback."

**实现 (Implementation):**
- 箭头 > 仅颜色 > 仅文本
- 结合所有三者以获得最大清晰度

---

## 8. 实现指南 (Implementation Guidelines)

### 8.1 组件架构 (Component Architecture) - Flutter

**模块化小部件结构 (Modular Widget Structure):**
```dart
// lib/presentation/widgets/feedback_overlay/
├── feedback_overlay.dart          // Main container
├── skeleton_renderer.dart         // Live + ghost skeletons
├── correction_arrows.dart         // Directional error indicators
├── quality_badge.dart             // Score display
├── error_annotations.dart         // Text labels
└── haptic_controller.dart         // Haptic coordination
```

**示例小部件 (Example Widget):**
```dart
class FeedbackOverlay extends StatelessWidget {
  final PoseData livePose;
  final PoseData? idealPose;
  final List<ErrorReport> errors;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Layer 1: Camera feed (bottom)
        CameraPreview(),

        // Layer 2: Ghost skeleton (if available)
        if (idealPose != null)
          SkeletonRenderer(
            pose: idealPose,
            color: Colors.green,
            opacity: 0.5,  // 50% transparency
          ),

        // Layer 3: Live skeleton
        SkeletonRenderer(
          pose: livePose,
          color: Colors.white,
          opacity: 1.0,
        ),

        // Layer 4: Error arrows (top)
        ...errors.map((e) => CorrectionArrow(
          position: livePose.getJoint(e.jointId),
          direction: e.correctionVector,
          severity: e.severity,
        )),

        // Layer 5: Quality score (overlay UI)
        Positioned(
          top: 20,
          right: 20,
          child: QualityBadge(score: livePose.qualityScore),
        ),
      ],
    );
  }
}
```

### 8.2 性能分析清单 (Performance Profiling Checklist)

**发布前基准 (Pre-Launch Benchmarks):**
- [ ] 渲染管线维持 60 FPS (P95 >55 FPS)
- [ ] 透明度叠加层每帧增加 <5ms
- [ ] 峰值渲染期间内存使用 <500MB
- [ ] 电池消耗 <15% 每小时 (屏幕开启时间)
- [ ] BLE 触觉延迟 <10ms (视觉到触觉)
- [ ] 箭头动画流畅 (无丢帧)

**分析工具 (Profiling Tools):**
- **Flutter DevTools**: 帧渲染时间线、内存分配
- **Xcode Instruments**: iOS GPU 使用、电池影响
- **Android Profiler**: CPU、内存、网络 (BLE) 监控

### 8.3 A/B 测试框架 (A/B Testing Framework)

**可测试变体 (Testable Variations):**

| 功能 Feature | 变体 A Variant A | 变体 B Variant B | 指标 Metric |
|---------|-----------|-----------|--------|
| **幽灵不透明度 Ghost Opacity** | 50% | 40% | 用户偏好调查 User preference survey |
| **箭头动画 Arrow Animation** | 脉动 Pulsing (1 Hz) | 静态 Static | 错误纠正速度 Error correction speed |
| **触觉强度 Haptic Intensity** | 70% | 50% | 用户舒适度评分 User comfort rating |
| **色彩方案 Color Palette** | 红-黄-绿 Red-Yellow-Green | 蓝-橙 Blue-Orange | 色盲用户反馈 Color-blind user feedback |
| **反馈频率 Feedback Frequency** | 100% (每次重复 every rep) | 50% (每 2 次 every 2nd rep) | 7 天保留 7-day retention |

**实现 (Implementation):**
```dart
// Feature flag system
class FeedbackConfig {
  static double getGhostOpacity() {
    return RemoteConfig.instance.getDouble('ghost_opacity') ?? 0.5;
  }

  static bool useBlueOrangePalette() {
    return RemoteConfig.instance.getBool('blue_orange_palette') ?? false;
  }
}
```

---

## 9. 关键设计决策摘要 (Key Design Decisions Summary)

### 9.1 推荐的默认设置 (Recommended Default Settings)

| 功能 Feature | 默认值 Default Value | 理由 Rationale |
|---------|--------------|-----------|
| **幽灵形象不透明度 Ghost Avatar Opacity** | 50% | 平衡可见性与不遮挡 Balance visibility & non-obstruction |
| **最大同时箭头 Max Simultaneous Arrows** | 2 | 防止视觉过载 Prevent visual overload |
| **箭头动画 Arrow Animation** | 仅优先级 1 脉动 Pulsing (1 Hz) for Priority 1 only | 引起注意而不分散 Draw attention without distraction |
| **色彩方案 Color Palette** | 蓝-橙 Blue-Orange (无障碍模式 accessibility mode) | 对 8% 男性人群色盲安全 8% male population color-blind safe |
| **触觉强度 Haptic Intensity** | 70% | 明显但不不舒服 Noticeable but not uncomfortable |
| **反馈频率 Feedback Frequency** | 100% (初学者 beginners), 渐减到 33% fades to 33% | 遵循动作学习研究 Follow motor learning research |

### 9.2 用户自定义选项 (User Customization Options)

**基本设置 (Essential Settings):**
- ✓ 幽灵形象开/关 Ghost avatar on/off
- ✓ 箭头密度 Arrow density (最小化 minimal / 适中 moderate / 详细 detailed)
- ✓ 触觉强度滑块 Haptic intensity slider
- ✓ 色彩方案 Color palette (标准 standard / 高对比度 high-contrast / 色盲 color-blind)

**高级设置 (Advanced Settings):**
- ✓ 按错误类型切换 Per-error-type toggles
- ✓ 反馈频率 Feedback frequency (100% / 50% / 33%)
- ✓ 音频提示开/关 Audio cues on/off
- ✓ 自定义颜色选择器 Custom color picker (高级用户 power users)

### 9.3 平台特定适配 (Platform-Specific Adaptations)

**iOS:**
- 使用 CoreHaptics 实现丰富的触觉模式
- 遵循 Apple HIG 反馈时序 ([Feedback Patterns](https://developer.apple.com/design/human-interface-guidelines/patterns/feedback/))
- 启用 Dynamic Type 以实现无障碍

**Android:**
- 使用 HapticFeedbackConstants 实现标准模式
- 遵循 Material Design 动作原则
- 支持 TalkBack 屏幕阅读器用户

---

## 10. 参考文献 (References)

### 行业指南 (Industry Guidelines)
- [Apple Human Interface Guidelines - Feedback Patterns](https://developer.apple.com/design/human-interface-guidelines/patterns/feedback/)
- [Material Design - Motion Principles](https://m3.material.io/styles/motion/overview/how-it-works)
- [Android Haptics Design Principles](https://developer.android.com/develop/ui/views/haptics/haptics-principles)

### 学术研究 (Academic Research)
- [The Role of Augmented Feedback on Motor Learning - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8681883/)
- [Augmented Visual, Auditory, Haptic, and Multimodal Feedback in Motor Learning](https://link.springer.com/article/10.3758/s13423-012-0333-8)
- [Visual Cue Based Corrective Feedback for Motor Skill Training - IEEE](https://dl.acm.org/doi/10.1109/TVCG.2022.3227999)

### 无障碍标准 (Accessibility Standards)
- [WCAG 2.1 Color Contrast Guidelines](https://ets.osu.edu/color-guidelines-digital-accessibility)
- [Coloring for Colorblindness - David MathLogic](https://davidmathlogic.com/colorblind/)
- [Accessible Color Palette Generator](https://venngage.com/tools/accessible-color-palette-generator)

### UX 案例研究 (UX Case Studies)
- [Nike Training Club UX Case Study](https://medium.com/@eunice.choi/ux-case-study-nike-training-club-371c2b79e6dc)
- [Fitness App UI Design Best Practices - Stormotion](https://stormotion.io/blog/fitness-app-ux/)
- [Strava UI/UX Case Study](https://medium.com/@wjun8815/ui-ux-case-study-strava-fitness-app-0fc2ff1884ba)

### AR/VR 性能 (AR/VR Performance)
- [Unity Best Practices for VR/AR Graphics](https://unity.com/how-to/best-practices-vr-and-mobile-ar-graphics)
- [Multi-Resolution 3D Rendering for High-Performance Web AR - NCBI](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10422453/)

### 触觉设计 (Haptic Design)
- [2025 Guide to Haptics - Saropa Contacts](https://saropa-contacts.medium.com/2025-guide-to-haptics-enhancing-mobile-ux-with-tactile-feedback-676dd5937774)
- [Guidelines of Haptic UX Design - Boréas Technologies](https://pages.boreas.ca/blog/piezo-haptics/guidelines-of-haptic-ux-design)
- [Haptics UX Design - Android Open Source Project](https://source.android.com/docs/core/interaction/haptics/haptics-ux-design)

### Movement Chain AI 内部文档 (Movement Chain AI Internal Docs)
- [ADR-0003: Flutter Mobile Development](../decisions/0003-flutter-mobile.md)
- [ADR-0004: 4模块架构](../decisions/0004-simplified-4-module-architecture.md)

---

## 文档变更日志 (Document Change Log)

| 版本 Version | 日期 Date | 作者 Author | 变更 Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-01 | Research Compilation | 基于行业研究和学术研究的初始指南 Initial guidelines based on industry research & academic studies |

---

**文档状态 (Document Status):** 研究完成 - 准备设计实现 (Research Complete - Ready for Design Implementation)

**下一步 (Next Steps):**
1. 根据这些规范创建视觉模型
2. 构建带有幽灵形象 + 箭头叠加层的 Flutter 原型
3. 进行用户测试 (N=10-20) 以了解不透明度/颜色偏好
4. 根据反馈迭代,测量错误纠正速度

**反馈 (Feedback):** 为设计问题或其他研究需求开启 GitHub issues
