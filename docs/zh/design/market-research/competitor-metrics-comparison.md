# OnForm 和 Sportsbox AI

> **文档目的**: 全面对比 OnForm、Sportsbox AI 与我们系统的挥杆分析指标
>
> **价值**: 确保 MVP 覆盖关键指标，明确差异化优势
>
> **最后更新**: 2025-12-18

---

## 概述

本文档对比市场上两大纯视觉高尔夫分析 App (OnForm 和 Sportsbox AI) 与我们三模态系统 (Vision + IMU + EMG) 的指标覆盖范围。

### 竞品定位

| 产品 | 传感器 | 定价 | 目标用户 |
|------|--------|------|----------|
| **OnForm** | 纯视觉 (手机摄像头) | $14.99/月 | 教练为主，业余球手 |
| **Sportsbox AI** | 纯视觉 (手机摄像头) | $24.99/月 | 严肃球手、教练 |
| **我们 (Movement Chain)** | Vision + IMU + EMG | TBD | 追求科学训练的球手 |

### 技术架构对比

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         技术架构对比                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  OnForm/Sportsbox:                                                      │
│  ┌──────────┐                                                           │
│  │ 摄像头   │ → 姿态估计 → 3D 重建 → 角度/位移计算 → 分析结果                  │
│  └──────────┘                                                           │
│       │                                                                 │
│       └─ 单模态 (纯视觉)                                                  │
│                                                                         │
│  Movement Chain:                                                        │
│  ┌──────────┐                                                           │
│  │ 摄像头   │ ─┐                                                         │
│  └──────────┘  │                                                        │
│  ┌──────────┐  ├→ 时间同步 → 传感器融合 → 多维度分析 → 分析结果               │
│  │ IMU      │ ─┤                                                        │
│  └──────────┘  │      ↑                                                 │
│  ┌──────────┐  │      │                                                 │
│  │ EMG      │ ─┘      └─ 独特: 肌肉激活 + 力量链验证                        │
│  └──────────┘                                                           │
│       │                                                                 │
│       └─ 三模态融合                                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 1. OnForm 3D Body Metrics (13 个指标)

OnForm 在 2024 年推出 3D Body Metrics 功能，使用机器学习从单目视频估算 3D 姿态。

### 1.1 指标清单

| # | 指标名称 (英文) | 中文 | 定义 |
|---|----------------|------|------|
| 1 | **Torso Turn** | 躯干旋转 | 躯干相对目标线的旋转角度 |
| 2 | **Pelvis Turn** | 骨盆旋转 | 骨盆相对目标线的旋转角度 |
| 3 | **X-Factor** | X 因子 | 躯干与骨盆旋转差 (Torso - Pelvis) |
| 4 | **Forward Bend** | 前屈角 | 躯干相对垂直面的前倾角度 |
| 5 | **Side Bend** | 侧屈角 | 躯干相对目标线的侧向倾斜 |
| 6 | **Sway** | 横移 | 骨盆沿目标线的水平位移 |
| 7 | **Thrust** | 前冲 | 骨盆垂直目标线的前后位移 |
| 8 | **Lift** | 升降 | 骨盆的垂直位移 |
| 9 | **Hand Depth** | 手深度 | 双手相对骨盆的前后位置 |
| 10 | **Hand Width** | 手宽度 | 双手相对骨盆的左右位置 |
| 11 | **Hand Height** | 手高度 | 双手相对骨盆的垂直位置 |
| 12 | **Backswing Tempo** | 上杆节拍 | Address → Top 的时间 |
| 13 | **Downswing Tempo** | 下杆节拍 | Top → Impact 的时间 |

### 1.2 验证方法

OnForm 使用 Polhemus 磁场追踪系统和 Qualisys 光学动捕系统进行验证:

- **Polhemus 对比**: 旋转角度平均误差 2-3°
- **Qualisys 对比**: 位移误差 1-2cm

> **参考**: [OnForm 3D Visualization Support](https://support.onform.com/article/168-using-3d-data-and-visualization)

---

## 2. Sportsbox AI 3D Trackers (~30 个指标)

Sportsbox AI 提供更丰富的指标集，包括所有 OnForm 指标，并扩展了膝盖、头部、运动链等维度。

### 2.1 指标分类清单

#### 旋转类 (7 个)

| # | 指标名称 | 中文 | 定义 |
|---|----------|------|------|
| 1 | **Chest Turn** | 胸部旋转 | 同 Torso Turn |
| 2 | **Pelvis Turn** | 骨盆旋转 | 骨盆相对目标线旋转 |
| 3 | **X-Factor** | X 因子 | Chest - Pelvis |
| 4 | **X-Factor Stretch** | X 因子拉伸 | 下杆初期 X-Factor 增量 |
| 5 | **Chest Open at Impact** | 击球时胸部开放度 | Impact 时胸部相对目标线角度 |
| 6 | **Pelvis Open at Impact** | 击球时骨盆开放度 | Impact 时骨盆相对目标线角度 |
| 7 | **Gain (Chest-Pelvis)** | 胸骨盆增益 | 从 Top → Impact 的旋转差变化 |

#### 弯曲类 (4 个)

| # | 指标名称 | 中文 | 定义 |
|---|----------|------|------|
| 8 | **Forward Bend (Chest)** | 胸部前屈 | 胸椎前倾角度 |
| 9 | **Forward Bend (Pelvis)** | 骨盆前屈 | 骨盆前倾角度 |
| 10 | **Side Bend (Chest)** | 胸部侧屈 | 胸椎侧向倾斜 |
| 11 | **Side Bend (Pelvis)** | 骨盆侧屈 | 骨盆侧向倾斜 |

#### 位移类 (3 个)

| # | 指标名称 | 中文 | 定义 |
|---|----------|------|------|
| 12 | **Sway** | 横移 | 骨盆水平位移 |
| 13 | **Thrust** | 前冲 | 骨盆前后位移 |
| 14 | **Lift** | 升降 | 骨盆垂直位移 |

#### 手部类 (3 个)

| # | 指标名称 | 中文 | 定义 |
|---|----------|------|------|
| 15 | **Hand Depth** | 手深度 | 双手前后位置 |
| 16 | **Hand Width** | 手宽度 | 双手左右位置 |
| 17 | **Hand Height** | 手高度 | 双手垂直位置 |

#### 中手位置 (3 个) - Sportsbox 独有

| # | 指标名称 | 中文 | 定义 |
|---|----------|------|------|
| 18 | **Mid-Hands Forward** | 中手前向位移 | 双手中点的前后位置 |
| 19 | **Mid-Hands Side** | 中手侧向位移 | 双手中点的左右位置 |
| 20 | **Mid-Hands Vertical** | 中手垂直位移 | 双手中点的上下位置 |

#### 头部/膝盖类 (4 个) - Sportsbox 独有

| # | 指标名称 | 中文 | 定义 |
|---|----------|------|------|
| 21 | **Head Sway** | 头部横移 | 头部水平位移 |
| 22 | **Head Lift** | 头部升降 | 头部垂直位移 |
| 23 | **Lead Knee Flex** | 前膝弯曲 | 前侧膝盖弯曲角度 |
| 24 | **Trail Knee Flex** | 后膝弯曲 | 后侧膝盖弯曲角度 |

#### 节拍/速度类 (4 个)

| # | 指标名称 | 中文 | 定义 |
|---|----------|------|------|
| 25 | **Backswing Time** | 上杆时间 | Address → Top 时长 |
| 26 | **Downswing Time** | 下杆时间 | Top → Impact 时长 |
| 27 | **Tempo Ratio** | 节奏比 | 上杆时间 / 下杆时间 |
| 28 | **Transition Time** | 过渡时间 | Top 的停顿时长 |

#### 运动链类 (2 个) - Sportsbox 独有

| # | 指标名称 | 中文 | 定义 |
|---|----------|------|------|
| 29 | **Kinematic Sequence Graph** | 运动链图 | 骨盆/胸部/手臂/球杆角速度曲线 |
| 30 | **Peak Velocity Order** | 峰值速度顺序 | 各段达峰顺序 (理想: 骨盆→胸→臂→杆) |

### 2.2 研究支撑

Sportsbox 的运动链分析基于 TPI 和 Cheetham 研究:

| 身体段 | 业余峰值角速度 | 职业峰值角速度 | 数据来源 |
|--------|---------------|---------------|----------|
| **Pelvis** | ~400°/s | 480-550°/s | TPI Research |
| **Thorax** | ~450°/s | 605-685°/s | Cheetham 2008 |
| **Lead Arm** | ~900°/s | 1200-1500°/s | Meister 2011 |
| **Club** | ~2000°/s | 2500-3200°/s | TrackMan |

> **参考**: Sportsbox AI 3D Golf - App Store / Google Play

---

## 3. 完整对比矩阵

### 3.1 按类别对比

#### 旋转指标 (Rotation)

| 指标 | OnForm | Sportsbox | 我们 MVP | 我们 Phase 2+ | 备注 |
|------|:------:|:---------:|:--------:|:-------------:|------|
| Torso/Chest Turn | ✅ | ✅ | ✅ | ✅ | 基础指标 |
| Pelvis Turn | ✅ | ✅ | ✅ | ✅ | 基础指标 |
| X-Factor | ✅ | ✅ | ✅ | ✅ | 核心指标 |
| X-Factor Stretch | ❌ | ✅ | ❌ | ✅ | 下杆增益 |
| Chest Open @ Impact | ❌ | ✅ | ❌ | ✅ | 击球时刻 |
| Pelvis Open @ Impact | ❌ | ✅ | ❌ | ✅ | 击球时刻 |
| Gain (Chest-Pelvis) | ❌ | ✅ | ❌ | ✅ | 旋转增益 |

#### 弯曲指标 (Bend)

| 指标 | OnForm | Sportsbox | 我们 MVP | 我们 Phase 2+ | 备注 |
|------|:------:|:---------:|:--------:|:-------------:|------|
| Forward Bend (Chest) | ✅ | ✅ | ✅ | ✅ | 脊柱倾斜 |
| Forward Bend (Pelvis) | ❌ | ✅ | ❌ | ✅ | 骨盆前屈 |
| Side Bend (Chest) | ✅ | ✅ | ✅ | ✅ | 侧屈 |
| Side Bend (Pelvis) | ❌ | ✅ | ❌ | ✅ | 骨盆侧屈 |

#### 位移指标 (Translation)

| 指标 | OnForm | Sportsbox | 我们 MVP | 我们 Phase 2+ | 备注 |
|------|:------:|:---------:|:--------:|:-------------:|------|
| Sway | ✅ | ✅ | ❌ | ✅ | 重心横移 |
| Thrust | ✅ | ✅ | ❌ | ✅ | 重心前冲 |
| Lift | ✅ | ✅ | ❌ | ✅ | 重心升降 |

#### 手部指标 (Hands/Arms)

| 指标 | OnForm | Sportsbox | 我们 MVP | 我们 Phase 2+ | 备注 |
|------|:------:|:---------:|:--------:|:-------------:|------|
| Hand Depth | ✅ | ✅ | ❌ | ✅ | 手深度 |
| Hand Width | ✅ | ✅ | ❌ | ✅ | 手宽度 |
| Hand Height | ✅ | ✅ | ❌ | ✅ | 手高度 |
| Mid-Hands Forward | ❌ | ✅ | ❌ | ✅ | 中手前向 |
| Mid-Hands Side | ❌ | ✅ | ❌ | ✅ | 中手侧向 |
| Mid-Hands Vertical | ❌ | ✅ | ❌ | ✅ | 中手垂直 |
| Left Elbow Angle | ❌ | ❌ | ✅ | ✅ | 前臂伸直度 |

#### 头部/膝盖指标 (Head/Knee)

| 指标 | OnForm | Sportsbox | 我们 MVP | 我们 Phase 2+ | 备注 |
|------|:------:|:---------:|:--------:|:-------------:|------|
| Head Sway | ❌ | ✅ | ❌ | ✅ | 头部稳定性 |
| Head Lift | ❌ | ✅ | ❌ | ✅ | 抬头检测 |
| Lead Knee Flex | ❌ | ✅ | ❌ | ✅ | 前膝弯曲 |
| Trail Knee Flex | ❌ | ✅ | ❌ | ✅ | 后膝弯曲 |

#### 节拍/速度指标 (Timing/Speed)

| 指标 | OnForm | Sportsbox | 我们 MVP | 我们 Phase 2+ | 备注 |
|------|:------:|:---------:|:--------:|:-------------:|------|
| Backswing Time | ✅ | ✅ | ✅ | ✅ | Vision + IMU |
| Downswing Time | ✅ | ✅ | ✅ | ✅ | Vision + IMU |
| Tempo Ratio | ✅ | ✅ | ✅ | ✅ | 关键指标 |
| Transition Time | ❌ | ✅ | ❌ | ✅ | 顶点停顿 |
| Peak Angular Velocity | ❌ | ❌ | ✅ | ✅ | IMU 独有 |

#### 运动链指标 (Kinematic Sequence)

| 指标 | OnForm | Sportsbox | 我们 MVP | 我们 Phase 2+ | 备注 |
|------|:------:|:---------:|:--------:|:-------------:|------|
| Kinematic Sequence Graph | ❌ | ✅ | ❌ | ✅ | 角速度曲线 |
| Peak Velocity Order | ❌ | ✅ | ❌ | ✅ | 达峰顺序 |
| Pelvis Peak Velocity | ❌ | ✅ | ❌ | ✅ | ~480°/s 职业 |
| Thorax Peak Velocity | ❌ | ✅ | ❌ | ✅ | ~605°/s 职业 |
| Lead Arm Peak Velocity | ❌ | ✅ | ❌ | ✅ | ~1310°/s 职业 |

#### EMG 指标 (肌肉激活) - 我们独有 🌟

| 指标 | OnForm | Sportsbox | 我们 MVP | 我们 Phase 2+ | 备注 |
|------|:------:|:---------:|:--------:|:-------------:|------|
| Core Activation | ❌ | ❌ | ✅ | ✅ | 核心发力检测 |
| Forearm Activation | ❌ | ❌ | ✅ | ✅ | 前臂代偿检测 |
| Muscle Activation Sequence | ❌ | ❌ | ✅ | ✅ | 发力时序验证 |
| Arm Compensation Detection | ❌ | ❌ | ✅ | ✅ | 手臂代偿预警 |
| Gluteus Activation | ❌ | ❌ | ❌ | ✅ | 臀肌 (Phase 2) |
| Adductor Activation | ❌ | ❌ | ❌ | ✅ | 大腿内侧 (Phase 2) |
| Lats Activation | ❌ | ❌ | ❌ | ✅ | 背阔肌 (Phase 3) |
| Deltoid Activation | ❌ | ❌ | ❌ | ✅ | 三角肌 (Phase 3) |
| Fatigue Detection | ❌ | ❌ | ❌ | ✅ | 疲劳指数 |
| Power Chain Validation | ❌ | ❌ | ✅ | ✅ | 力量链完整性 |

---

## 4. 覆盖率统计

### 4.1 指标数量对比

| 类别 | OnForm | Sportsbox | 我们 MVP | 我们 Phase 2+ |
|------|:------:|:---------:|:--------:|:-------------:|
| 旋转 | 3 | 7 | 3 | 7 |
| 弯曲 | 2 | 4 | 2 | 4 |
| 位移 | 3 | 3 | 0 | 3 |
| 手部 | 3 | 6 | 1 | 7 |
| 头/膝 | 0 | 4 | 0 | 4 |
| 节拍/速度 | 2 | 4 | 4 | 5 |
| 运动链 | 0 | 5 | 0 | 5 |
| **EMG** | 0 | 0 | **4** | **10** |
| **总计** | **13** | **33** | **14** | **45** |

### 4.2 覆盖率分析

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                       指标覆盖率分析                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  OnForm (13 指标) ████████████████████████████████████████ 100%        │
│                                                                         │
│  我们 MVP 覆盖 OnForm:                                                  │
│  ██████████████████████████████████░░░░░░ 69% (9/13)                   │
│                                                                         │
│  Sportsbox (33 指标) ████████████████████████████████████████ 100%     │
│                                                                         │
│  我们 MVP 覆盖 Sportsbox:                                               │
│  ██████████████░░░░░░░░░░░░░░░░░░░░░░░░░░ 30% (10/33)                  │
│                                                                         │
│  我们 Phase 2+ (45 指标) ████████████████████████████████████████ 100% │
│                                                                         │
│  Phase 2+ 覆盖 Sportsbox:                                               │
│  ████████████████████████████████████████ 100% (33/33)                 │
│                                                                         │
│  + 12 个 EMG 独有指标 🌟                                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.3 MVP 缺失分析

我们 MVP 相比 OnForm 缺失:

| 缺失指标 | 重要性 | 加入计划 | 理由 |
|----------|:------:|:--------:|------|
| Sway | ⭐⭐ | Phase 2 | 需要精确骨盆追踪 |
| Thrust | ⭐⭐ | Phase 2 | 需要精确骨盆追踪 |
| Lift | ⭐ | Phase 2 | 需要精确骨盆追踪 |
| Hand Depth/Width/Height | ⭐ | Phase 2 | 需要双手追踪 |

**MVP 策略**: 优先实现核心旋转指标 + EMG，位移和手部指标留到 Phase 2。

---

## 5. 差异化分析

### 5.1 我们的独特优势

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                      差异化优势矩阵                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  功能维度          OnForm    Sportsbox    我们                          │
│  ────────────────────────────────────────────────────────────           │
│  姿态分析          ✅ 强      ✅ 很强      ✅ 相当                       │
│  运动链可视化      ❌         ✅           ✅ Phase 2                    │
│  节奏分析          ✅         ✅           ✅ IMU 更精确                 │
│  肌肉激活检测      ❌         ❌           ✅✅ 独有                     │
│  力量链验证        ❌         ❌           ✅✅ 独有                     │
│  代偿模式检测      ❌         ❌           ✅✅ 独有                     │
│  疲劳检测          ❌         ❌           ✅✅ 独有                     │
│                                                                         │
│  💡 关键洞察:                                                           │
│  OnForm/Sportsbox 只能告诉你 "什么" 动作有问题                          │
│  我们可以告诉你 "为什么" 出问题 (哪块肌肉没发力/发力顺序错误)          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 核心差异化功能

#### 功能 1: 手臂代偿检测 (Arm Compensation Detection)

**问题**: 很多业余球手用手臂发力而非核心，导致力量不足和受伤风险。

**竞品能力**: OnForm/Sportsbox 只能看到手臂动作异常，但无法判断是否代偿。

**我们的方案**:

```text
EMG 信号分析:
- 核心激活 < 40% + 前臂激活 > 50% → 检测到手臂代偿
- 触发反馈: "核心发力不足，手臂代偿。专注激活核心肌群"
```

#### 功能 2: 发力时序验证 (Activation Sequence)

**问题**: 即使动作看起来正确，发力顺序错误也会损失距离。

**竞品能力**: Sportsbox 可以看运动链角速度，但无法验证肌肉激活时序。

**我们的方案**:

```text
正确时序: Core (0ms) → Forearm (50-100ms)
错误时序: Forearm (0ms) → Core (50ms+) ← 检测为 "发力时序错误"
```

#### 功能 3: 疲劳检测 (Fatigue Detection)

**问题**: 疲劳时技术动作会退化，但球手往往不自知。

**竞品能力**: 无。

**我们的方案**:

```text
EMG 疲劳指标:
- 中位频率 (MDF) 下降 >15%
- 信号幅值 (RMS) 下降 >20%
→ 触发反馈: "检测到疲劳，建议休息"
```

---

## 6. 结论与建议

### 6.1 MVP 策略总结

| 维度 | 策略 | 理由 |
|------|------|------|
| **核心旋转** | ✅ 完整覆盖 | 最重要的挥杆指标 |
| **弯曲角度** | ✅ 基础覆盖 | 姿势检测必备 |
| **位移指标** | ⏸️ Phase 2 | 需要更精确骨盆追踪 |
| **手部追踪** | ⏸️ Phase 2 | 左肘角度已覆盖关键点 |
| **运动链** | ⏸️ Phase 2 | 需要分段角速度计算 |
| **EMG** | ✅ 核心功能 | 差异化竞争优势 |

### 6.2 指标优先级

```text
┌─────────────────────────────────────────────────────────────────────────┐
│  MVP 指标优先级 (P1 = 必须有, P2 = 应该有, P3 = 可以有)                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  P1 (MVP 核心):                                                         │
│  ├── X-Factor                    ← 最重要的挥杆指标                    │
│  ├── Torso/Pelvis Turn           ← 旋转基础                            │
│  ├── Tempo Ratio                 ← 节奏控制                            │
│  ├── Core Activation             ← EMG 核心 (差异化)                   │
│  ├── Forearm Activation          ← EMG 前臂 (代偿检测)                 │
│  └── Activation Sequence         ← EMG 时序 (差异化)                   │
│                                                                         │
│  P2 (Phase 2):                                                          │
│  ├── Sway/Thrust/Lift            ← 重心控制                            │
│  ├── X-Factor Stretch            ← 下杆增益                            │
│  ├── Kinematic Sequence          ← 运动链图                            │
│  ├── Gluteus/Adductor EMG        ← 下盘肌肉                            │
│  └── Head Sway/Lift              ← 头部稳定                            │
│                                                                         │
│  P3 (Phase 3):                                                          │
│  ├── Mid-Hands Tracking          ← 精细手部追踪                        │
│  ├── Knee Flex                   ← 膝盖弯曲                            │
│  ├── Lats/Deltoid EMG            ← 上肢肌肉                            │
│  └── Fatigue Detection           ← 疲劳预警                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.3 竞争定位

| 定位 | OnForm | Sportsbox | Movement Chain |
|------|--------|-----------|----------------|
| **核心价值** | 简单易用 | 指标全面 | 深度洞察 |
| **目标用户** | 休闲球手、教练 | 严肃球手 | 追求科学训练者 |
| **价格定位** | $14.99/月 | $24.99/月 | TBD (预计 $29.99+) |
| **技术壁垒** | 低 (纯视觉) | 中 (视觉+算法) | 高 (三模态+EMG) |

---

## 参考资料

### 产品文档

- [OnForm 3D Visualization Support](https://support.onform.com/article/168-using-3d-data-and-visualization)

### 学术研究

- [Meister et al. (2011)](https://pubmed.ncbi.nlm.nih.gov/21844613/) - Golf Performance with X-Factor
- [Cheetham et al. (2008)](https://pmc.ncbi.nlm.nih.gov/articles/PMC3362989/) - Kinematic Sequence
- [TPI Research](https://www.mytpi.com/articles/fitness/the_kinematic_sequence) - Kinematic Sequence Norms
- [PMC Swing Performance Index](https://pmc.ncbi.nlm.nih.gov/articles/PMC9227529/) - Peak Angular Velocities

### 内部文档

- [数据处理与指标计算](../architecture/metrics-calculation.md) - 三模态系统能力
- [生物力学基准值](../../prerequisites/foundations/biomechanics-benchmarks.md) - 职业/业余对比数据
- [系统架构](../architecture/system-design.md) - MVP 范围定义

---

**最后更新**: 2025-12-18
**维护者**: Movement Chain AI Team
