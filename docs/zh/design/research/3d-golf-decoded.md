# 3D Golf Decoded 研究

> **研究日期**: 2025-01-07 | **类型**: 竞品/案例研究

---

## 基本信息

| 项目 | 内容 |
|------|------|
| **名称** | 3D Golf Decoded |
| **网站** | [3dgolfdecoded.com](https://3dgolfdecoded.com/) |
| **Instagram** | [@3dgolfdecoded](https://www.instagram.com/3dgolfdecoded/) |
| **关联机构** | DB Golf Center (新加坡) |
| **官网** | [dbgolfcenter.com](https://dbgolfcenter.com/) |
| **地址** | 6 Tampines Street 92, #01-03, Singapore 528893 |
| **创始人** | Davide Bertoli (@db.golfcoach / @dbprogolf) |

---

## 1. 定位分析

### 业务类型

**高尔夫培训机构 + 教练认证课程**（非软件公司）

- DB Golf Center: 新加坡室内高尔夫培训中心
- 3D Golf Decoded: 面向教练的 3D 生物力学认证课程
- 理念: "We don't guess, we measure"（我们不猜测，我们测量）

### 创始人背景

**Davide Bertoli (Coach Davide)**

- Elite Golf Coach
- Swing Catalyst Ambassador
- Cobra & Puma Ambassador
- 提供青少年发展项目和 1 对 1 教练服务

---

## 2. 技术设备

DB Golf Center 使用的专业设备：

| 设备 | 用途 | 备注 |
|------|------|------|
| **Swing Catalyst** | 挥杆分析 + 压力板 | Davide 是品牌大使 |
| **Foresight** | 发球监测器 | 测量球速、发射角等 |
| **3D PuttView** | 推杆绿分析 | AR 投影推杆线 |
| **Capto System** | 推杆动作分析 | 3D 推杆数据 |

他们是这些工具的**使用者**，而非开发者。

---

## 3. Instagram 3D 动画制作

### 使用的工具：Sportsbox AI

Instagram 上的 3D 骨骼动画是用 **[Sportsbox AI](https://www.sportsbox.ai/)** 生成的。

| 项目 | 说明 |
|------|------|
| **输入** | 单个 2D 慢动作视频（手机拍摄） |
| **技术** | Kinematic AI（深度学习姿态估计 + 3D 重建） |
| **关键点** | 30+ 身体、球杆、球的关键点 |
| **输出视角** | 6 个：Face-on, Down-the-Line, Behind, From Target, Above, Below |
| **无需硬件** | 不需要动捕服、传感器或标记点 |

### 工作流程

```text
┌─────────────────────────────────────────────────────────────────┐
│  1. 拍摄                                                        │
│     └── 用手机拍摄一段慢动作视频（单视角即可）                    │
│                                                                 │
│  2. AI 处理（Sportsbox Kinematic AI）                           │
│     ├── 2D 视频 → 姿态估计（检测 30+ 关键点）                    │
│     ├── 2D 关键点 → 3D 骨骼重建                                 │
│     └── 生成可旋转的 3D 人体模型                                 │
│                                                                 │
│  3. 输出                                                        │
│     ├── 6 个视角的 3D 动画（正面、后方、上方、下方等）            │
│     ├── 生物力学数据（角度、距离、速度）                         │
│     └── 可导出视频用于社交媒体                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 可测量的指标

- 髋部旋转 (Hip Turn)
- 肩部旋转 (Shoulder Turn)
- 侧弯 (Side Bend)
- 前倾 (Bend/Flexion)
- 侧移 (Sway)
- 上升/下沉 (Lift)
- X-Factor（肩髋分离角）

### Sportsbox AI 定价

| 方案 | 价格 | 适用人群 |
|------|------|----------|
| Free | 免费 | 5 次分析/月 |
| 3D Player | $110/年 | 个人球员 |
| 3D Pro | $799/年 | 教练 |
| Enterprise | 联系定价 | 培训机构 |

### 为什么不是 Gears Golf 或 K-Motion？

| 工具 | 不适合的原因 |
|------|-------------|
| **Gears Golf** | 专业光学动捕，$15,000+，需固定场地安装，不便携 |
| **K-Motion** | 输出是数据曲线图，**不是 3D 骨骼动画** |

**结论**: Sportsbox AI 成本低（$799/年）、便携（手机拍摄）、出片快，最适合做 Instagram 内容营销。

---

## 4. 课程体系

### 3D Golf Decoded 认证课程

| 级别 | 名称 | 形式 |
|------|------|------|
| 基础 | Foundation | 线上 + 线下 |
| 高级 | Master | 线上 + 线下 |

**课程内容**（推断）：

- 高级生物力学知识
- 动作捕捉技术使用
- 数据驱动的教学方法
- 成为认证的 3D Golf 专家

**价格**: 未公开（需直接联系）

### 对比：TPI 认证课程

| 项目 | TPI | 3D Golf Decoded |
|------|-----|-----------------|
| Level 1 | $1,095 | 未公开 |
| Level 2 | $1,095 | 未公开 |
| 年费 | $149 | 未知 |
| 继续教育 | 12小时/年 | 未知 |

---

## 5. 服务与定价

### DB Golf Center 服务

| 服务 | 说明 |
|------|------|
| 室内模拟器 | Foresight Range |
| 视频挥杆分析 | Video Swing Analysis |
| 3D 推杆绿 | 免费使用 |
| 9/18 洞模拟 | 虚拟球场 |
| 大师班 | 推杆等专题 |
| 1对1教练 | Coach Davide |

### 定价

| 项目 | 价格 |
|------|------|
| 室内模拟器 | SGD 15 起 |
| 90分钟挥杆评估 | 未公开 |
| 教练课程 | 未公开 |

---

## 6. 商业模式分析

### 收入来源

```text
┌─────────────────────────────────────────────────────────┐
│                    3D Golf Decoded                      │
├─────────────────────────────────────────────────────────┤
│  1. 培训中心收入 (DB Golf Center)                        │
│     ├── 场地租赁 (模拟器/推杆绿)                         │
│     ├── 1对1 教练课程                                   │
│     └── 大师班/工作坊                                   │
│                                                         │
│  2. 认证课程收入 (3D Golf Decoded)                       │
│     ├── Foundation 课程                                 │
│     └── Master 课程                                     │
│                                                         │
│  3. 品牌合作                                            │
│     ├── Swing Catalyst Ambassador                       │
│     └── Cobra & Puma Ambassador                         │
└─────────────────────────────────────────────────────────┘
```

### 目标客户

| 客户类型 | 服务 |
|----------|------|
| 普通球员 | DB Golf Center 场地 + 教练 |
| 高尔夫教练 | 3D Golf Decoded 认证课程 |
| 青少年 | 青少年发展项目 |

### 竞争优势

1. **技术驱动**: 多种专业设备集成
2. **视觉营销**: Instagram 3D 动画内容
3. **认证体系**: 面向教练的 B2B 课程
4. **品牌背书**: 设备厂商大使身份

---

## 7. 对 Movement Chain AI 的启示

### 可借鉴

| 方面 | 启示 |
|------|------|
| **营销** | 3D 可视化内容在社交媒体有很强传播力 |
| **定位** | 可同时服务 B2C（球员）和 B2B（教练） |
| **生态** | 与设备厂商合作可增加可信度 |
| **内容** | 教育内容可作为付费产品 |

### 差异化机会

| 他们 | 我们 |
|------|------|
| 使用现成工具 | **自研软件** |
| 需要专业设备 | **手机 + 可穿戴** |
| 固定场地 | **随时随地** |
| 需要教练解读 | **AI 自动分析** |
| 高价专业服务 | **大众化定价** |

### 关键洞察

1. **市场验证**: 3D 生物力学分析在高尔夫教练市场有真实需求
2. **价格空间**: 专业服务定价较高，存在降维打击空间
3. **内容策略**: 3D 动画是极佳的营销素材
4. **认证模式**: B2B 教练认证是可行的商业模式

---

## 参考资料

- [3D Golf Decoded 官网](https://3dgolfdecoded.com/)
- [DB Golf Center 官网](https://dbgolfcenter.com/)
- [Swing Catalyst](https://swingcatalyst.com/)
- [Foresight Sports](https://www.foresightsports.com/)
- [3D PuttView](https://puttview.com/)
- [Capto Putting](https://capto.golf/)
- [TPI Certification](https://www.mytpi.com/certification)
- [Sportsbox AI](https://www.sportsbox.ai/)
- [Gears Golf Biomechanics](https://www.gearssports.com/golf-swing-biomechanics/)
- [K-Motion 3D Golf Swing Analysis](https://www.k-motion.com/)
