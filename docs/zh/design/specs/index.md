# 产品设计

> **阅读时间**: 按需查阅 | **前置知识**: [核心架构](../architecture/index.md) | **目标**: 理解各功能模块详细规格

---

## 本节定位

产品设计规格定义了 Movement Chain AI 各功能模块的详细行为 — 从产品版本划分、挥杆阶段检测到实时反馈输出。

---

## 文档概览

### [三种产品版本](three-product-versions.md)

**阅读时间**: ~10 分钟 | **产品定位**

3 种产品版本划分：

- **Movement Lite**: 入门版，手机视觉分析
- **Movement Core**: 核心版，IMU 传感器 + 视觉融合
- **Movement Pro**: 专业版，多传感器全套方案

### [八个挥杆阶段](eight-swing-phases.md)

**阅读时间**: ~15 分钟 | **核心算法**

8 阶段挥杆检测：

- **阶段定义**: Address → Backswing → Top → Transition → Downswing → Impact → Follow-through → Finish
- **检测算法**: Vision + IMU 融合阶段识别
- **触发条件**: 各阶段进入/退出判定规则
- **代码实现**: Python 示例

### [四种对比基准](four-comparison-methods.md)

**阅读时间**: ~20 分钟 | **分析功能**

4 种对比基准：

- **Pro 对比**: 与职业选手基准值对比
- **Personal Best**: 与个人最佳对比
- **Statistical**: 统计异常检测
- **Learned**: ML 模型个性化建议
- **DTW 算法**: 动态时间规整用于时序对齐

### [四种使用模式](modes/assessment-mode.md)

**阅读时间**: ~20 分钟 | **用户体验**

4 种使用模式：

- **[评估模式](modes/assessment-mode.md)**: 站姿检查、全挥杆分析、综合诊断
- **[练习模式](modes/drill-mode.md)**: 针对性练习、单一指标专注
- **[引导模式](modes/guide-mode.md)**: 教练辅助、步骤分解引导
- **[实战模式](modes/game-mode.md)**: 球场实战、最小干扰

### [三个反馈通道](three-feedback-channels.md)

**阅读时间**: ~15 分钟 | **反馈系统**

3 种反馈通道：

- **语音反馈**: 挥杆后语音播报分析结果
- **视觉反馈**: 屏幕图表、动画、叠加显示
- **触觉反馈**: 振动提示实时纠错（可选）

### [用户信息和阈值调整](user-profile-thresholds.md)

**阅读时间**: ~10 分钟 | **Post-MVP 规划**

用户适配系统：

- **通用阈值**: MVP 默认固定值
- **性别调整**: 男/女力量曲线调整
- **体型调整**: 身高、臂展、体型比例
- **年龄调整**: 柔韧性、力量衰减补偿
- **个人学习**: 基于历史数据的动态调整

### [UI 设计](ui/index.md)

**阅读时间**: ~30 分钟 | **界面设计**

用户界面设计规范：

- **[屏幕列表](ui/screens.md)**: 应用完整屏幕结构和导航架构
- **[用户流程](ui/user-flows.md)**: 核心场景的交互流程
- **[设计系统](ui/design-system.md)**: 色彩、字体、间距、组件
- **[数据可视化](ui/data-visualization.md)**: 运动数据图表规范

---

## 阅读顺序建议

```text
┌─────────────────────────────────────────────────────────────────────┐
│  1. three-product-versions.md ─── 产品定位                          │
│     └── 三种版本的功能边界和目标用户                                  │
│                                                                     │
│  2. eight-swing-phases.md ─── 核心算法                              │
│     └── 挥杆如何被分解为 8 个阶段                                    │
│                                                                     │
│  3. four-comparison-methods.md ─── 分析方法                         │
│     └── 如何评估挥杆质量、与谁对比                                   │
│                                                                     │
│  4. modes/*.md ─── 四种使用模式                                     │
│     └── 评估、练习、引导、实战四种场景                                │
│                                                                     │
│  5. three-feedback-channels.md ─── 反馈系统                         │
│     └── 语音、视觉、触觉三种反馈通道                                  │
│                                                                     │
│  6. user-profile-thresholds.md ─── 进阶功能 (Post-MVP)              │
│     └── 如何根据用户特征调整阈值                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 相关文档

- [核心架构](../architecture/index.md) - 系统整体设计
- [技术决策](../decisions/index.md) - 选型和权衡记录
- [传感器映射](../architecture/sensor-data-processing.md) - 算法实现代码
