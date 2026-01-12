# 设计系统

> **文档目的**: 定义 Movement Chain AI 应用的视觉设计规范和组件库
>
> **目标读者**: UI/UX 设计师、前端开发工程师
>
> **设计主题**: 金稻绿野 (Golden Harvest)

---

## 1. 设计原则

### 1.1 核心原则

| 原则 | 说明 | 体现 |
|-----|------|------|
| **自然** | 融入高尔夫球场的自然元素 | 草地绿、金稻色、田野渐变 |
| **清爽** | 极简设计，减少视觉噪音 | 米黄背景、充足留白 |
| **专业** | 体现运动科学的专业性 | 数据可视化精确、术语规范 |
| **高效** | 减少操作步骤 | 快速入口、智能默认值 |

### 1.2 设计语言

- **风格**: 金稻绿野 - 清爽简洁的极简设计
- **氛围**: 自然、专业、亲和
- **灵感**: 高尔夫球场的草地、阳光下的稻穗、清晨的田野

---

## 2. 色彩系统

### 2.1 品牌色

| 颜色名称 | Hex | 用途 |
|---------|-----|------|
| **深草地绿** (Primary) | `#2C5F2D` | 主品牌色、主按钮、强调 |
| **极深草绿** (Primary Dark) | `#1F4620` | 按钮按压态 |
| **浅草绿** (Primary Light) | `#3D7A3E` | 悬停状态 |
| **金稻色** (Gold) | `#C5A572` | 辅助强调、警告 |
| **深金色** (Gold Dark) | `#D4B574` | 金色亮部 |
| **丰收金** (Harvest) | `#B89456` | 金色暗部 |

### 2.2 背景系统

| 颜色名称 | Hex | 用途 |
|---------|-----|------|
| **米黄背景** (Background) | `#F9F5ED` | 主背景 |
| **纯白** (Surface) | `#FFFFFF` | 卡片背景 |
| **淡米黄** (Surface Elevated) | `#FFF9F0` | 提升表面 |
| **浅米色** (Surface Hover) | `#F5EFE3` | 悬停状态 |

### 2.3 边框与分割线

| 颜色名称 | Hex | 用途 |
|---------|-----|------|
| **边框** (Border) | `#D8E5D3` | 标准边框 |
| **浅边框** (Border Light) | `#E5F0E0` | 轻量边框 |

### 2.4 文本颜色

| 颜色名称 | Hex | 用途 |
|---------|-----|------|
| **深墨绿** (Text Primary) | `#1A2E1A` | 主文字 |
| **中绿灰** (Text Secondary) | `#4A5F4A` | 次要文字 |
| **浅绿灰** (Text Tertiary) | `#8A9D8A` | 辅助文字 |

### 2.5 语义色

| 颜色名称 | Hex | 用途 |
|---------|-----|------|
| **成功** (Success) | `#2C5F2D` | 深草绿 - 正确、完成 |
| **警告** (Warning) | `#C5A572` | 金稻色 - 中等问题 |
| **错误** (Error) | `#8B6F4F` | 深褐色 - 严重问题 |
| **信息** (Info) | `#5D8C3E` | 翠绿色 - 提示信息 |

### 2.6 问题优先级色彩

| 级别 | 颜色 | Hex | 应用场景 |
|-----|------|-----|---------|
| **高优先级 (P0)** | 深褐色 | `#8B6F4F` | 发力顺序错误等核心问题 |
| **中优先级 (P1)** | 金稻色 | `#C5A572` | X-Factor 不足等改进项 |
| **低优先级 (P2)** | 浅米色 | `#E8DCC8` | 站距偏窄等小问题 |
| **正面反馈** | 深草绿 | `#2C5F2D` | 表现良好的方面 |

### 2.7 辅助色 - 金稻绿野调色板

| 颜色名称 | Hex | 描述 |
|---------|-----|------|
| **草地深绿** (Meadow) | `#2C5F2D` | 主品牌色 |
| **森林深绿** (Forest) | `#1A3D1A` | 最深绿色 |
| **翠绿** (Leaf) | `#5D8C3E` | 叶子绿 |
| **鼠尾草绿** (Sage) | `#7A8F5C` | 中性绿 |
| **苔藓绿** (Moss) | `#97A87B` | 浅绿 |
| **麦色** (Wheat) | `#E8DCC8` | 浅米色 |
| **树皮褐** (Bark) | `#8B6F4F` | 茎秆色 |

### 2.8 渐变色

| 名称 | 渐变 | 用途 |
|-----|------|------|
| **田野** (Field) | `#2C5F2D → #5D8C3E → #C5A572` | 特殊强调 |
| **草地** (Meadow) | `#2C5F2D → #3D7A3E` | 主按钮 |
| **丰收** (Harvest) | `#D4B574 → #C5A572` | 金色强调 |
| **森林** (Forest) | `#1F4620 → #2C5F2D` | 深色区域 |

---

## 3. 字体系统

### 3.1 字体选择

| 平台 | 字体 | 备注 |
|-----|------|------|
| **系统** | SF Pro Display / SF Pro | Apple 系统字体 |
| **备选** | -apple-system, BlinkMacSystemFont, Segoe UI | 跨平台 |

### 3.2 字体层级

| 层级 | 名称 | 大小 | 字重 | 行高 | 用途 |
|-----|------|------|------|------|------|
| **Display** | 大标题 | 34px | Bold (700) | 1.2 | 评分数字、大标题 |
| **Title 1** | 标题 1 | 28px | Bold (700) | 1.25 | 页面标题 |
| **Title 2** | 标题 2 | 22px | Bold (700) | 1.3 | 卡片标题 |
| **Title 3** | 标题 3 | 20px | Semibold (600) | 1.3 | 列表标题 |
| **Headline** | 小标题 | 17px | Semibold (600) | 1.35 | 列表项标题 |
| **Body** | 正文 | 17px | Regular (400) | 1.5 | 段落正文 |
| **Callout** | 标注 | 16px | Regular (400) | 1.4 | 表单标签 |
| **Subhead** | 副标题 | 15px | Regular (400) | 1.4 | 辅助说明 |
| **Footnote** | 脚注 | 13px | Regular (400) | 1.45 | 次要信息 |
| **Caption 1** | 小字 1 | 12px | Regular (400) | 1.4 | 时间戳 |
| **Caption 2** | 小字 2 | 11px | Regular (400) | 1.35 | 标签 |

### 3.3 CSS 变量

```css
:root {
  --font-size-display: 34px;
  --font-size-title1: 28px;
  --font-size-title2: 22px;
  --font-size-title3: 20px;
  --font-size-headline: 17px;
  --font-size-body: 17px;
  --font-size-callout: 16px;
  --font-size-subhead: 15px;
  --font-size-footnote: 13px;
  --font-size-caption1: 12px;
  --font-size-caption2: 11px;

  --font-weight-bold: 700;
  --font-weight-semibold: 600;
  --font-weight-medium: 500;
  --font-weight-regular: 400;
}
```

---

## 4. 间距系统

### 4.1 基础单位

- **基础单位**: 4px
- **常用倍数**: 4, 8, 12, 16, 20, 24, 32, 48

### 4.2 间距规范

| 名称 | 大小 | CSS 变量 | 用途 |
|-----|------|---------|------|
| **xs** | 4px | `--spacing-xs` | 紧凑元素间距 |
| **s** | 8px | `--spacing-s` | 相关元素间距 |
| **m** | 16px | `--spacing-m` | 标准间距 |
| **l** | 24px | `--spacing-l` | 卡片内边距 |
| **xl** | 32px | `--spacing-xl` | 区块间距 |
| **xxl** | 48px | `--spacing-xxl` | 页面边距 (顶部) |

### 4.3 布局边距

| 位置 | 间距 | CSS 变量 | 说明 |
|-----|------|---------|------|
| **页面水平边距** | 20px | `--page-horizontal-padding` | 内容与屏幕边缘 |
| **卡片内边距** | 16px | `--card-padding` | 卡片内容与边框 |
| **卡片间距** | 12px | `--card-gap` | 卡片之间的间距 |

---

## 5. 圆角系统

### 5.1 圆角规范

| 名称 | 大小 | CSS 变量 | 用途 |
|-----|------|---------|------|
| **xs** | 4px | `--radius-xs` | 小标签 |
| **sm** | 8px | `--radius-sm` | 输入框、小卡片 |
| **md** | 12px | `--radius-md` | 中等卡片 |
| **lg** | 16px | `--radius-lg` | 大卡片、模式卡片 |
| **xl** | 20px | `--radius-xl` | 底部弹窗 |
| **2xl** | 24px | `--radius-2xl` | 特大圆角 |
| **full** | 9999px | `--radius-full` | 胶囊按钮 |

---

## 6. 阴影系统

### 6.1 阴影规范

| 名称 | 参数 | CSS 变量 | 用途 |
|-----|------|---------|------|
| **轻阴影** | `0 1px 3px rgba(26,46,26,0.08)` | `--shadow-sm` | 轻微提升 |
| **中阴影** | `0 2px 8px rgba(26,46,26,0.1)` | `--shadow-md` | 卡片悬浮 |
| **重阴影** | `0 4px 16px rgba(26,46,26,0.12)` | `--shadow-lg` | 弹窗 |
| **草地阴影** | `0 4px 16px rgba(44,95,45,0.25)` | `--shadow-meadow` | 绿色强调 |
| **金色阴影** | `0 4px 16px rgba(197,165,114,0.3)` | `--shadow-gold` | 金色强调 |

---

## 7. 组件库

### 7.1 按钮

#### 主按钮 (Primary)

```text
┌───────────────────────────────────────────────────────────────────┐
│                         开始评估                                   │
└───────────────────────────────────────────────────────────────────┘

样式: 背景 var(--color-primary)，文字白色
圆角: var(--radius-md) = 12px
高度: 50px (--button-height)
状态: Default / Pressed (Primary Dark) / Disabled (30% 透明度)
```

#### 次要按钮 (Secondary)

```text
┌───────────────────────────────────────────────────────────────────┐
│                          查看详情                                  │
└───────────────────────────────────────────────────────────────────┘

样式: 背景透明，边框 var(--color-primary)，文字 var(--color-primary)
```

### 7.2 模式卡片 (ModeCard)

```text
┌─────────────────────────────────────┐
│  ┌────────┐                         │
│  │  图标  │                         │
│  └────────┘                         │
│  [推荐开始]                          │
│                                     │
│  评估模式                            │
│  三段式挥杆评估，生成详细诊断报告     │
└─────────────────────────────────────┘

样式:
- 背景: var(--color-surface)
- 边框: var(--color-border)
- 圆角: var(--radius-lg) = 16px
- 比例: 1:1 (aspect-square)
- 图标区: 48x48px，圆角 12px
- Badge: 麦色背景，丰收金文字
```

### 7.3 底部导航栏 (BottomNavBar)

```text
┌─────────────────────────────────────────────────────────────────────┐
│    首页        分析        待定        我的                         │
│    [●]        [○]        [○]        [○]                           │
└─────────────────────────────────────────────────────────────────────┘

样式:
- 背景: var(--color-surface)
- 边框顶部: var(--color-border)
- 高度: 80px
- 图标: 24x24px
- 文字: Caption 2 (11px)
- 激活态: var(--color-primary)
- 非激活: var(--color-text-tertiary)
```

### 7.4 顶部导航栏 (NavigationBar)

```text
┌─────────────────────────────────────────────────────────────────────┐
│  [←]     页面标题                                            [⚙]   │
└─────────────────────────────────────────────────────────────────────┘

样式:
- 高度: 64px (h-16)
- 背景: var(--color-background)
- 边框底部: var(--color-border)
- 标题: Title 2 (22px Bold)
```

### 7.5 卡片 (Card)

```text
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│   卡片标题                                               [操作]   │
│                                                                   │
│   卡片内容区域                                                    │
│   可以包含文字、图片、列表等                                       │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘

样式:
- 背景: var(--color-surface)
- 圆角: var(--radius-lg) = 16px
- 内边距: 16px
- 阴影: var(--shadow-sm)
```

### 7.6 列表项 (ListItem)

```text
┌───────────────────────────────────────────────────────────────────┐
│ [图标]   标题文字                                           [→]   │
│          描述文字                                                 │
└───────────────────────────────────────────────────────────────────┘

样式:
- 高度: 60-72px
- 分割线: 距左 56px
- 悬停: var(--color-surface-hover)
```

### 7.7 标签 (Tag)

```text
┌──────────┐  ┌──────────┐  ┌──────────┐
│  站姿良好 │  │  待改善   │  │  已完成   │
└──────────┘  └──────────┘  └──────────┘
  (绿底)        (金底)        (绿底)

样式:
- 圆角: var(--radius-xs) = 4px
- 内边距: 4px 8px
- 字号: Caption 1 (12px)
- 成功: 绿色背景 + 深绿文字
- 警告: 麦色背景 + 丰收金文字
- 错误: 深褐背景 + 白色文字
```

### 7.8 输入框 (Input)

```text
标签
┌───────────────────────────────────────────────────────────────────┐
│  占位文字                                                    [×]  │
└───────────────────────────────────────────────────────────────────┘
辅助说明文字

样式:
- 背景: var(--color-surface)
- 圆角: var(--radius-sm) = 8px
- 高度: 48px (--input-height)
- 边框: var(--color-border)
- 聚焦: 边框 var(--color-primary)
```

---

## 8. 动画

### 8.1 过渡时长

| 类型 | 时长 | CSS 变量 | 用途 |
|-----|------|---------|------|
| **快速** | 150ms | `--transition-fast` | 按钮点击反馈 |
| **标准** | 250ms | `--transition-normal` | 页面转场、卡片展开 |

### 8.2 缓动曲线

```css
:root {
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 8.3 常用动画

| 场景 | 动画类型 | 说明 |
|-----|---------|------|
| 按钮点击 | scale(0.95) | 缩小反馈 |
| 卡片悬停 | scale(1.02) + translateY(-2px) | 轻微上浮 |
| 页面转场 | Push/Pop | 从右侧进入/退出 |
| 模态弹出 | Slide Up | 从底部滑入 |

---

## 9. 图标

### 9.1 图标来源

- **主图标库**: Lucide React
- **自定义图标**: 高尔夫剪影、火柴人

### 9.2 图标尺寸

| 场景 | 尺寸 | 用途 |
|-----|------|------|
| **底部导航** | 24px | Tab Bar 图标 |
| **顶部导航** | 20px | 导航栏按钮 |
| **列表前缀** | 24px | 列表项图标 |
| **内联** | 16px | 文字内图标 |
| **大图标** | 48px | 模式卡片图标 |

### 9.3 自定义图标

| 图标 | 文件 | 用途 |
|-----|------|------|
| 高尔夫剪影 | `GolfSilhouetteIcons.tsx` | 挥杆阶段展示 |
| 高尔夫火柴人 | `GolfStickmanIcons.tsx` | 动作指导 |

---

## 10. CSS 变量完整列表

```css
:root {
  /* 品牌色 */
  --color-primary: #2C5F2D;
  --color-primary-dark: #1F4620;
  --color-primary-light: #3D7A3E;

  /* 背景系统 */
  --color-background: #F9F5ED;
  --color-surface: #FFFFFF;
  --color-surface-elevated: #FFF9F0;
  --color-surface-hover: #F5EFE3;

  /* 边框 */
  --color-border: #D8E5D3;
  --color-border-light: #E5F0E0;

  /* 文本 */
  --color-text-primary: #1A2E1A;
  --color-text-secondary: #4A5F4A;
  --color-text-tertiary: #8A9D8A;

  /* 语义色 */
  --color-success: #2C5F2D;
  --color-warning: #C5A572;
  --color-error: #8B6F4F;
  --color-info: #5D8C3E;

  /* 辅助色 */
  --color-meadow: #2C5F2D;
  --color-gold: #D4B574;
  --color-gold-dark: #C5A572;
  --color-harvest: #B89456;
  --color-wheat: #E8DCC8;
  --color-bark: #8B6F4F;

  /* 渐变 */
  --gradient-field: linear-gradient(135deg, #2C5F2D 0%, #5D8C3E 50%, #C5A572 100%);
  --gradient-meadow: linear-gradient(135deg, #2C5F2D 0%, #3D7A3E 100%);

  /* 阴影 */
  --shadow-sm: 0 1px 3px rgba(26, 46, 26, 0.08);
  --shadow-md: 0 2px 8px rgba(26, 46, 26, 0.1);
  --shadow-lg: 0 4px 16px rgba(26, 46, 26, 0.12);

  /* 间距 */
  --spacing-xs: 4px;
  --spacing-s: 8px;
  --spacing-m: 16px;
  --spacing-l: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 48px;

  /* 圆角 */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-2xl: 24px;
  --radius-full: 9999px;

  /* 组件尺寸 */
  --button-height: 50px;
  --button-height-sm: 44px;
  --input-height: 48px;
  --page-horizontal-padding: 20px;
  --card-padding: 16px;
  --card-gap: 12px;

  /* 过渡 */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 11. 相关文档

| 相关文档 | 内容 | 本文档使用 |
|---------|------|-----------|
| [屏幕列表](screens.md) | 屏幕布局 | 组件应用示例 |
| [数据可视化](data-visualization.md) | 图表规范 | 图表色彩 |
| [用户流程](user-flows.md) | 交互流程 | 组件状态变化 |

---

**最后更新**: 2026-01-12
**维护者**: Movement Chain AI Team
