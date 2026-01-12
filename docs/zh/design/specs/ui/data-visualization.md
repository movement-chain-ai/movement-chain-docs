# 数据可视化

> **文档目的**: 定义运动数据的可视化规范
>
> **目标读者**: UI/UX 设计师、前端开发工程师、数据可视化工程师
>
> **设计主题**: 金稻绿野 (Golden Harvest)

---

## 1. 技术栈

### 1.1 图表库

| 库 | 版本 | 用途 |
|---|------|------|
| **Recharts** | 2.15.2 | 主要图表库，折线图、柱状图 |
| **SVG 原生** | - | 自定义实时数据图表 |

### 1.2 图表组件

| 组件 | 文件 | 说明 |
|-----|------|------|
| `SensorDataChart` | `components/SensorDataChart.tsx` | 传感器实时数据图表 |
| `ChartContainer` | `components/ui/chart.tsx` | Recharts 容器封装 |
| `ChartTooltip` | `components/ui/chart.tsx` | 图表悬浮提示 |
| `ChartLegend` | `components/ui/chart.tsx` | 图表图例 |

---

## 2. 可视化原则

### 2.1 设计原则

| 原则 | 说明 | 体现 |
|-----|------|------|
| **清晰** | 数据一目了然 | 合理的数据范围、清晰的标注 |
| **对比** | 突出差异 | 用户 vs 基准、历史对比 |
| **可操作** | 指导改进 | 问题区域高亮、关联练习建议 |
| **一致性** | 统一视觉语言 | 相同数据类型使用相同颜色 |

### 2.2 颜色规范

使用设计系统定义的 CSS 变量：

```css
/* 主要颜色 */
--color-primary: #2C5F2D;      /* 深草地绿 */
--color-secondary: #C5A572;    /* 金稻色 */

/* 功能颜色 */
--color-success: #2E7D32;      /* 成功/正常 */
--color-warning: #F57C00;      /* 警告 */
--color-error: #D32F2F;        /* 错误/问题 */
--color-info: #0277BD;         /* 信息 */

/* 优先级颜色 */
--color-priority-high: #D32F2F;
--color-priority-medium: #F57C00;
--color-priority-low: #2E7D32;
```

### 2.3 传感器数据颜色

```typescript
// EMG (肌电信号)
const EMG_COLOR = '#BF5AF2';  // 紫色

// IMU (惯性测量单元)
const IMU_COLOR = '#0A84FF';  // 蓝色
```

---

## 3. 评估分数可视化

### 3.1 进度条

在 `AnalyticsPage.tsx` 中使用的进度条样式：

```tsx
// 进度条组件
<div className="h-2 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
  <div
    className="h-full bg-[var(--color-primary)] rounded-full"
    style={{ width: '87%' }}
  />
</div>
```

**设计规范**:
- 高度: 8px (`h-2`)
- 圆角: 全圆角 (`rounded-full`)
- 背景: `var(--color-surface-elevated)`
- 填充: 根据类型变色

### 3.2 各项指标对比

```typescript
// 指标数据结构
interface ScoreMetric {
  label: string;      // 指标名称
  value: number;      // 分数 0-100
  color: string;      // 进度条颜色
}

// 示例数据
const metrics = [
  { label: '站姿检查', value: 87, color: 'var(--color-primary)' },
  { label: '慢动作检查', value: 84, color: 'var(--color-info)' },
  { label: '全速检查', value: 84, color: 'var(--color-success)' }
];
```

### 3.3 进步概览卡片

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   本周进步                                    [本周] [本月] [全部]           │
│                                                                             │
│   ┌──────────────┬──────────────┬──────────────┐                           │
│   │    +10       │     17       │      5       │                           │
│   │   总分提升    │   练习次数    │   评估次数    │                           │
│   │   (绿色)      │   (蓝色)      │   (橙色)     │                           │
│   └──────────────┴──────────────┴──────────────┘                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. 趋势图表

### 4.1 评估分数趋势 (折线图)

使用 Recharts `LineChart` 组件：

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 数据结构
interface AssessmentHistory {
  date: string;       // 日期 (如 '01/10')
  score: number;      // 综合分数
  stance: number;     // 站姿分数
  slowMotion: number; // 慢动作分数
  fullSpeed: number;  // 全速分数
}

// 图表实现
<ResponsiveContainer width="100%" height={192}>
  <LineChart data={assessmentHistory}>
    <CartesianGrid
      strokeDasharray="3 3"
      stroke="var(--color-border)"
    />
    <XAxis
      dataKey="date"
      tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
    />
    <YAxis
      domain={[60, 100]}
      tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
    />
    <Tooltip
      contentStyle={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-small)',
      }}
    />
    <Line
      type="monotone"
      dataKey="score"
      stroke="var(--color-primary)"
      strokeWidth={2}
      dot={{ fill: 'var(--color-primary)', r: 4 }}
    />
  </LineChart>
</ResponsiveContainer>
```

**设计规范**:
- 容器高度: 192px
- 网格线: 虚线，3px 间隔
- Y轴范围: 60-100 (评估分数)
- 曲线类型: `monotone` (平滑)
- 曲线粗细: 2px
- 数据点半径: 4px

### 4.2 练习频率 (柱状图)

使用 Recharts `BarChart` 组件：

```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 数据结构
interface PracticeStats {
  day: string;      // 星期几 (如 '周一')
  sessions: number; // 练习次数
}

// 图表实现
<ResponsiveContainer width="100%" height={160}>
  <BarChart data={practiceStats}>
    <CartesianGrid
      strokeDasharray="3 3"
      stroke="var(--color-border)"
    />
    <XAxis
      dataKey="day"
      tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
    />
    <YAxis
      tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
    />
    <Tooltip
      contentStyle={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-small)',
      }}
    />
    <Bar
      dataKey="sessions"
      fill="var(--color-primary)"
      radius={[4, 4, 0, 0]}
    />
  </BarChart>
</ResponsiveContainer>
```

**设计规范**:
- 容器高度: 160px
- 柱子圆角: 顶部 4px
- 填充颜色: Primary 色

---

## 5. 实时传感器图表

### 5.1 SensorDataChart 组件

自定义 SVG 实时数据图表，显示 EMG 和 IMU 传感器数据：

```tsx
interface SensorDataChartProps {
  type: 'EMG' | 'IMU';
  sensorName: string;
}
```

### 5.2 数据更新

```typescript
// 更新频率: 100ms (10Hz)
const interval = setInterval(() => {
  setData((prevData) => {
    const newData = [...prevData];
    const newValue = type === 'EMG'
      ? Math.random() * 100    // EMG: 0-100% 肌肉激活
      : Math.random() * 360;   // IMU: 0-360度角度

    newData.push(newValue);

    // 保持最多50个数据点
    if (newData.length > 50) {
      newData.shift();
    }

    return newData;
  });
}, 100);
```

### 5.3 图表布局

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   EMG 主传感器                                          56                  │
│   肌肉电信号                                            %                   │
│                                                                             │
│   100 ─┬────────────────────────────────────────────────────────            │
│        │     ╱╲    ╱╲      ╱╲                                               │
│    50 ─┤   ╱  ╲╱╲╱  ╲╱╲──╱  ╲╱╲                                            │
│        │ ╱                    ╲╱╲___                                        │
│     0 ─┴────────────────────────────────────────────────────────            │
│                                                                             │
│   ┌──────────────┬──────────────┬──────────────┐                           │
│   │    45        │     78       │     23       │                           │
│   │   平均值      │   最大值      │   最小值      │                           │
│   └──────────────┴──────────────┴──────────────┘                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.4 颜色编码

```typescript
// 传感器类型颜色
const sensorColors = {
  EMG: '#BF5AF2',  // 紫色 - 肌肉电信号
  IMU: '#0A84FF'   // 蓝色 - 姿态角度
};
```

### 5.5 渐变填充

```tsx
<defs>
  <linearGradient id="gradient-EMG" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" style={{ stopColor: '#BF5AF2', stopOpacity: 0.3 }} />
    <stop offset="100%" style={{ stopColor: '#BF5AF2', stopOpacity: 0 }} />
  </linearGradient>
</defs>
```

---

## 6. 肌肉激活可视化

### 6.1 激活等级

```typescript
interface MuscleGroup {
  id: string;
  nameZh: string;       // 中文名称
  nameEn: string;       // 英文名称
  icon: string;         // 图标
  activation: number;   // 激活百分比 0-100
  level: string;        // 等级描述
  color: string;        // 显示颜色
}

// 示例数据
const muscleGroups = [
  { id: 'core', nameZh: '核心肌群', activation: 56, level: '中等', color: '#f59e0b' },
  { id: 'back', nameZh: '背部', activation: 42, level: '中等', color: '#f59e0b' },
  { id: 'shoulder', nameZh: '肩部', activation: 38, level: '放松', color: '#ef4444' },
  { id: 'deltoid', nameZh: '三角肌', activation: 61, level: '中等', color: '#f59e0b' }
];
```

### 6.2 激活等级颜色

| 激活程度 | 百分比范围 | 等级 | 颜色 |
|---------|----------|------|------|
| 低 | 0-39% | 放松 | `#ef4444` (红色) |
| 中 | 40-69% | 中等 | `#f59e0b` (橙色) |
| 高 | 70-100% | 高强度 | `#10b981` (绿色) |

### 6.3 动态更新

```typescript
// 肌肉激活数据动态变化 (400ms 更新)
useEffect(() => {
  if (!isGuiding) return;

  const interval = setInterval(() => {
    setMuscleGroups(prevGroups =>
      prevGroups.map(muscle => {
        const change = (Math.random() - 0.5) * 15;
        const newActivation = Math.max(20, Math.min(100, muscle.activation + change));
        let level = '放松';
        let color = '#ef4444';

        if (newActivation >= 40 && newActivation < 70) {
          level = '中等';
          color = '#f59e0b';
        } else if (newActivation >= 70) {
          level = '高强度';
          color = '#10b981';
        }

        return { ...muscle, activation: Math.round(newActivation), level, color };
      })
    );
  }, 400);

  return () => clearInterval(interval);
}, [isGuiding]);
```

---

## 7. 历史记录可视化

### 7.1 记录卡片

```typescript
interface RecordItem {
  id: number;
  type: '评估' | '练习';
  mode: string;           // 模式名称
  score?: number;         // 评估分数
  duration?: string;      // 练习时长
  date: string;           // 日期时间
  improvement?: string;   // 进步指标 (如 '+3')
}
```

### 7.2 卡片布局

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ┌────┐  三段式评估                    +3         85                       │
│   │ 📊 │  2025-01-10 14:30                                                  │
│   └────┘                                                                    │
│                                                                             │
│   ┌────┐  引导模式                                 15分钟                    │
│   │ 🎯 │  2025-01-09 10:20                                                  │
│   └────┘                                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 类型图标

| 类型 | 图标 | 背景色 |
|-----|------|--------|
| 评估 | 📊 | `var(--color-primary)` + 10% 透明度 |
| 练习 | 🎯 | `var(--color-info)` + 10% 透明度 |

---

## 8. Tooltip 样式

### 8.1 Recharts Tooltip

```tsx
<Tooltip
  contentStyle={{
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-small)',
  }}
/>
```

### 8.2 ChartTooltipContent

使用 `components/ui/chart.tsx` 中定义的 Tooltip 组件：

```tsx
<ChartTooltipContent
  indicator="dot"      // 'dot' | 'line' | 'dashed'
  hideLabel={false}
  hideIndicator={false}
/>
```

**样式规范**:
- 背景: `var(--color-surface)` / `bg-background`
- 边框: `1px solid var(--color-border)`
- 圆角: `var(--radius-small)` / `rounded-lg`
- 阴影: `shadow-xl`
- 内边距: `px-2.5 py-1.5`

---

## 9. 图表容器

### 9.1 ChartContainer 配置

```typescript
type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
    theme?: Record<'light' | 'dark', string>;
  };
};

// 使用示例
const chartConfig: ChartConfig = {
  score: {
    label: '综合得分',
    color: 'var(--color-primary)'
  },
  stance: {
    label: '站姿检查',
    color: 'var(--color-info)'
  }
};
```

### 9.2 响应式容器

```tsx
<ResponsiveContainer width="100%" height={192}>
  {/* 图表内容 */}
</ResponsiveContainer>
```

**推荐高度**:
- 折线图: 192px
- 柱状图: 160px
- 实时图表: 150px

---

## 10. 设计规范汇总

### 10.1 尺寸规范

| 元素 | 尺寸 |
|-----|------|
| 进度条高度 | 8px |
| 曲线粗细 | 2px |
| 数据点半径 | 4px |
| 柱子圆角 | 顶部 4px |
| 网格线间隔 | 3px 虚线 |

### 10.2 动画规范

| 动画 | 时长 | 用途 |
|-----|------|------|
| 数据更新 | 100ms | 实时传感器数据 |
| 肌肉激活 | 400ms | 肌肉数据变化 |
| 视频进度 | 100ms | 播放进度更新 |

### 10.3 交互规范

| 交互 | 行为 | 反馈 |
|-----|------|------|
| 点击数据点 | 显示详细数值 | Tooltip 弹出 |
| 滑动时间轴 | 查看历史数据 | 平滑滚动 |
| 切换周期 | 更新数据范围 | 按钮高亮切换 |

---

## 11. 相关文档

| 相关文档 | 内容 | 本文档使用 |
|---------|------|-----------|
| [设计系统](design-system.md) | 色彩规范 | 图表颜色定义 |
| [屏幕列表](screens.md) | 报告界面 | 图表布局位置 |
| [用户流程](user-flows.md) | 数据流转 | 数据展示时机 |

---

**最后更新**: 2026-01-12
**维护者**: Movement Chain AI Team
**基于**: Movement-chain-mobile-figma 项目代码
