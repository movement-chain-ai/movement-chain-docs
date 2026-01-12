# UI 设计规范

> **文档目的**: 定义 Movement Chain AI 高尔夫挥杆分析应用的用户界面设计规范
>
> **目标读者**: UI/UX 设计师、前端开发工程师、产品经理
>
> **技术栈**: React + TypeScript + Tailwind CSS v4 + Recharts

---

## 设计理念

### 金稻绿野 (Golden Harvest)

Movement Chain AI 采用"金稻绿野"配色方案，融合高尔夫球场的自然元素：

- **深草地绿** `#2C5F2D` - 主品牌色，象征专业与自然
- **金稻色** `#C5A572` - 辅助色，代表丰收与成就
- **米黄背景** `#F9F5ED` - 清爽舒适的阅读体验

### 设计风格

- **极简清爽**: 减少视觉噪音，突出核心信息
- **自然色调**: 融入田野、森林、稻穗等自然元素
- **移动优先**: 专为移动端优化的交互体验

---

## 文档概览

### [设计系统](design-system.md)

**阅读时间**: ~15 分钟 | **视觉规范**

完整的视觉设计基础规范：

- **色彩系统**: 金稻绿野调色板（18+ 颜色变量）
- **字体系统**: SF Pro 字体层级（10 级）
- **间距系统**: 4px 基础网格
- **圆角系统**: 6 级圆角规范
- **阴影系统**: 4 级阴影效果
- **组件库**: 按钮、卡片、输入框、导航栏等

### [屏幕列表](screens.md)

**阅读时间**: ~10 分钟 | **信息架构**

应用的完整屏幕结构（15+ 页面）：

- **主导航**: 首页、分析、待定、我的
- **四种模式**: 评估、练习、引导、实战
- **功能页面**: 历史记录、传感器、设置
- **组件页面**: 评估报告、练习详情、训练计划

### [用户流程](user-flows.md)

**阅读时间**: ~15 分钟 | **交互设计**

核心用户场景的完整流程：

- **认证流程**: 登录 → 注册 → 首页
- **评估流程**: 选择类型 → 传感器检查 → 录制 → 报告
- **练习流程**: 练习库/训练计划 → 执行 → 视频对比
- **引导流程**: 选择类型 → 实时引导 → 完成

### [数据可视化](data-visualization.md)

**阅读时间**: ~10 分钟 | **图表规范**

运动数据的可视化规范：

- **时序图表**: 挥杆速度、角度曲线
- **肌肉激活**: sEMG 热力图、激活强度
- **挥杆阶段**: 8 阶段时间线
- **评分系统**: 环形进度、雷达图

---

## 技术实现

### 技术栈

| 技术 | 版本 | 用途 |
|-----|-----|-----|
| React | 18+ | 组件框架 |
| TypeScript | 5+ | 类型安全 |
| Tailwind CSS | v4 | 样式系统 |
| Recharts | 最新 | 图表库 |
| Lucide React | 最新 | 图标库 |

### 项目结构

```text
src/
├── App.tsx                    # 主应用入口
├── pages/                     # 页面组件
│   ├── HomePage.tsx           # 首页
│   ├── AssessmentMode.tsx     # 评估模式
│   ├── DrillMode.tsx          # 练习模式
│   ├── GuideMode.tsx          # 引导模式
│   ├── RealPlayMode.tsx       # 实战模式
│   ├── HistoryPage.tsx        # 历史记录
│   ├── SettingsPage.tsx       # 设置页面
│   └── ...
├── components/                # 可复用组件
│   ├── BottomNavBar.tsx       # 底部导航栏
│   ├── NavigationBar.tsx      # 顶部导航栏
│   ├── ModeCard.tsx           # 模式卡片
│   ├── DrillDetail.tsx        # 练习详情
│   ├── AssessmentReport.tsx   # 评估报告
│   ├── SwingPhaseTimeline.tsx # 挥杆阶段时间线
│   ├── MuscleActivation.tsx   # 肌肉激活显示
│   └── ui/                    # 基础 UI 组件
└── styles/
    └── globals.css            # 全局样式和主题
```

---

## 四种功能模式

### 1. 评估模式 (Assessment Mode)

**入口**: 首页 → 评估模式卡片

**流程**: 准备开始 → 选择类型 → 传感器检查 → 录制 → 生成报告

**评估类型**:

- 上杆评估 (Backswing)
- 下杆评估 (Downswing)
- 全挥杆评估 (Full Swing)

### 2. 练习模式 (Drill Mode)

**入口**: 首页 → 练习模式卡片

**两种入口**:

- **练习库**: 直接进入 DrillDetail（无传感器检查）
- **训练计划**: PlanExecutor 传感器检查 → AllDrillsMode 执行

**DrillDetail 功能**:

- 视图模式：上下分屏、画中画、叠加对比
- 肌肉部位：核心、前臂、三角肌、臀部
- 实时肌肉激活数据
- 倍速播放、录制功能

### 3. 引导模式 (Guide Mode)

**入口**: 首页 → 引导模式卡片

**引导类型**:

- 站姿引导
- 慢动作引导
- 整体引导

### 4. 实战模式 (Real Play Mode)

**入口**: 首页 → 实战模式卡片

**状态**: 即将推出

---

## 主题系统

支持 6 种配色方案：

| 主题 | 说明 |
|-----|-----|
| 经典绿野 | 默认主题，深草地绿 + 金稻色 |
| 深夜球场 | 暗色模式 |
| 晨曦高尔夫 | 清晨色调 |
| 海岸球场 | 蓝绿色调 |
| 秋日球场 | 暖色调 |
| 日落球场 | 橙红色调 |

---

## 与其他文档的关系

| 相关文档 | 内容 | UI 设计使用 |
|---------|------|------------|
| [评估模式](../modes/assessment-mode.md) | 评估流程和报告结构 | 报告界面设计 |
| [三个反馈通道](../three-feedback-channels.md) | 反馈类型和时机 | 反馈 UI 组件 |
| [八个挥杆阶段](../eight-swing-phases.md) | 阶段检测点 | 进度条、阶段标记 |
| [六条诊断规则](../six-diagnosis-rules.md) | 错误检测逻辑 | 错误提示 UI |

---

## Figma 源文件

UI 设计源文件位于：`Movement-chain-mobile-figma` 仓库

- GitHub: [VivianDongChen/Movement-chain-mobile-figma](https://github.com/VivianDongChen/Movement-chain-mobile-figma)

---

**最后更新**: 2026-01-12
**维护者**: Movement Chain AI Team
