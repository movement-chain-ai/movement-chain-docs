# 功能设计规格

> **阅读时间**: 按需查阅 | **前置知识**: [核心架构](../architecture/index.md) | **目标**: 理解各功能模块详细规格

---

## 本节定位

功能设计规格定义了 Movement Chain AI 各功能模块的详细行为 — 从挥杆阶段检测到实时反馈输出。

---

## 文档概览

### [八个挥杆阶段](eight-swing-phases.md)

**阅读时间**: ~15 分钟 | **核心算法**

8 阶段挥杆检测：

- **阶段定义**: Address → Backswing → Top → Transition → Downswing → Impact → Follow-through → Finish
- **检测算法**: Vision + IMU 融合阶段识别
- **触发条件**: 各阶段进入/退出判定规则
- **代码实现**: Python 示例

### [三个训练场景](three-training-scenarios.md)

**阅读时间**: ~15 分钟 | **用户体验**

三个训练场景 × 三种反馈通道：

- **训练场景**: 站姿检查、慢动作训练、全速分析
- **反馈通道**: 语音、视觉、触觉
- **反馈时机**: 挥杆后 <500ms 延迟目标

### [四种对比方法](four-comparison-methods.md)

**阅读时间**: ~20 分钟 | **分析功能**

4 种对比方法：

- **Pro 对比**: 与职业选手基准值对比
- **Personal Best**: 与个人最佳对比
- **Statistical**: 统计异常检测
- **Learned**: ML 模型个性化建议
- **DTW 算法**: 动态时间规整用于时序对齐

### [五种阈值调整](five-threshold-adjustments.md)

**阅读时间**: ~10 分钟 | **Post-MVP 规划**

用户适配系统：

- **通用阈值**: MVP 默认固定值
- **性别调整**: 男/女力量曲线调整
- **体型调整**: 身高、臂展、体型比例
- **年龄调整**: 柔韧性、力量衰减补偿
- **个人学习**: 基于历史数据的动态调整

---

## 阅读顺序建议

```text
┌─────────────────────────────────────────────────────────────────────┐
│  1. eight-swing-phases.md ─── 核心算法                              │
│     └── 挥杆如何被分解为 8 个阶段                                    │
│                                                                     │
│  2. three-training-scenarios.md ─── 用户体验                        │
│     └── 分析结果如何变成用户感知的反馈                                │
│                                                                     │
│  3. four-comparison-methods.md ─── 分析方法                         │
│     └── 如何评估挥杆质量、与谁对比                                   │
│                                                                     │
│  4. five-threshold-adjustments.md ─── 进阶功能 (Post-MVP)           │
│     └── 如何根据用户特征调整阈值                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 相关文档

- [核心架构](../architecture/index.md) - 系统整体设计
- [技术决策](../decisions/index.md) - 选型和权衡记录
- [传感器映射](../architecture/sensor-data-processing.md) - 算法实现代码
