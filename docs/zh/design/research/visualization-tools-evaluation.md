# 可视化工具评估 Visualization Tools Evaluation

> **文档目的**: 评估多模态传感器数据可视化工具，为开发调试选择合适的技术方案
>
> **核心发现**: Rerun 是目前最适合我们 Vision + IMU + EMG 三模态融合调试的工具

---

## Executive Summary

本文档评估了用于机器人/运动分析的多模态数据可视化工具。核心结论：

| 工具 | 推荐度 | 适用场景 |
|------|--------|----------|
| **Rerun** | ⭐⭐⭐⭐⭐ | 开发调试、多模态融合、算法验证 |
| **Foxglove** | ⭐⭐⭐⭐ | ROS 团队、企业协作、云端数据管理 |
| **PlotJuggler** | ⭐⭐⭐ | 时序数据调试、IMU/EMG 波形分析 |
| **RViz2** | ⭐⭐ | ROS2 项目、3D 机器人可视化 |
| **Three.js** | ⭐⭐⭐ | Web 端自定义仪表板 |

---

## 1. Rerun.io 深度分析

### 1.1 核心能力

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                          Rerun 核心特性                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  ✅ 多模态同步 - Vision + IMU + EMG 在同一时间轴上                       │
│  ✅ MediaPipe 原生支持 - 官方 33 关键点人体姿态示例                       │
│  ✅ 时间轴拖动 - 逐帧分析，所有数据同步                                   │
│  ✅ 2D + 3D 视图 - 视频骨架叠加 + 3D 世界坐标                            │
│  ✅ kHz 时序 - 支持 100Hz IMU、200Hz EMG                                 │
│  ✅ Python SDK - 简单 API: rr.init(), rr.log()                          │
│  ✅ 完全开源 - MIT + Apache 2.0 双许可                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 1.2 技术规格

| 属性 | 值 |
|------|-----|
| **许可证** | MIT + Apache 2.0 (完全开源) |
| **SDK** | Python, Rust, C++ |
| **GitHub Stars** | 8,700+ |
| **最新融资** | $17M Seed (2025年3月, Point Nine 领投) |
| **总融资** | $20.4M |
| **性能** | 时序数据 20-30x 提速 (v0.13)，支持百万级数据点 |

### 1.3 与我们项目的匹配度

| 我们的需求 | Rerun 能力 | 匹配度 |
|------------|-----------|--------|
| MediaPipe 33 关键点 | 官方示例支持 | ⭐⭐⭐⭐⭐ |
| IMU 100Hz 角速度 | kHz 时序支持 | ⭐⭐⭐⭐⭐ |
| EMG 200Hz 肌电信号 | Scalar 时序图 | ⭐⭐⭐⭐⭐ |
| 多传感器时间同步 | 原生时间轴对齐 | ⭐⭐⭐⭐⭐ |
| Python 3.10+ | Python SDK | ⭐⭐⭐⭐⭐ |
| Flutter 移动端 | 仅桌面/Web (开发工具) | ⭐⭐ |

### 1.4 集成示例

```python
import rerun as rr
import mediapipe as mp

# 初始化
rr.init("golf_swing_debug", spawn=True)

# 定义骨架连接 (静态，只需执行一次)
rr.log("/", rr.AnnotationContext([
    rr.ClassDescription(
        info=rr.AnnotationInfo(id=0, label="Golfer"),
        keypoint_connections=mp.solutions.pose.POSE_CONNECTIONS
    )
]), static=True)

# 每帧日志
def log_frame(frame_idx, video_frame, landmarks, imu_data, emg_data):
    rr.set_time_sequence("frame", frame_idx)

    # Vision: 视频 + 骨架
    rr.log("video", rr.Image(video_frame))
    rr.log("pose/2d", rr.Points2D(landmarks.xy, class_ids=0,
                                   keypoint_ids=list(range(33))))

    # IMU: 角速度
    rr.log("imu/gyro_z", rr.Scalars(imu_data['gyro_z']))
    rr.log("imu/peak_velocity", rr.Scalars(imu_data['peak']))

    # EMG: 肌肉激活
    rr.log("emg/core_rms", rr.Scalars(emg_data['core']))
    rr.log("emg/forearm_rms", rr.Scalars(emg_data['forearm']))

    # 计算指标
    rr.log("metrics/x_factor", rr.Scalars(compute_x_factor(landmarks)))
```

### 1.5 官方人体姿态示例

**在线体验**: [Human Pose Tracking Demo](https://rerun.io/viewer?url=https%3A%2F%2Fapp.rerun.io%2Fversion%2F0.27.3%2Fexamples%2Fhuman_pose_tracking.rrd)

**功能展示**:

- MediaPipe Pose 33 关键点检测
- 2D (视频叠加) + 3D (世界坐标) 同步显示
- 自动骨架线渲染
- 分割掩码支持

---

## 2. 竞品对比：Foxglove

### 2.1 公司概况

| 属性 | 值 |
|------|-----|
| **成立时间** | 2021 年 |
| **总部** | 旧金山 |
| **创始人** | Adrian Macneil (前 Cruise), Roman Shtylman (前 Cruise) |
| **总融资** | $58.7M |
| **最新融资** | $40M Series B (2025年11月, Bessemer 领投) |
| **客户** | NVIDIA, Amazon, Anduril, Wayve |

### 2.2 许可证变更 (重要)

```text
⚠️ 关键变化 (2024年3月)
───────────────────────────────────────────────────────
Foxglove 2.0 起，可视化器不再开源！

之前: MPL-2.0 开源
现在: 专有闭源

仍然开源的部分:
- MCAP 文件格式 (MIT)
- SDK (C++/Python/Rust) (MIT)
- 消息 Schema
───────────────────────────────────────────────────────
```

### 2.3 定价模型

| 计划 | 价格 | 用户数 | 存储 | 关键功能 |
|------|------|--------|------|----------|
| **Free** | $0 | 3 | 10GB | 本地/云可视化，无限本地回放 |
| **Starter** | $18/user/月 | 20 | 100GB | 团队布局共享 |
| **Team** | $42/user/月 | 无限 | 1TB | SSO, Webhook, 私有扩展 |
| **Enterprise** | $100+/user/月 | 无限 | 自定义 | 自托管, SOC 2, 审计日志 |

### 2.4 Rerun vs Foxglove 对比

| 维度 | Rerun | Foxglove |
|------|-------|----------|
| **许可证** | 完全开源 (MIT/Apache) | 闭源 (2024年起) |
| **商业模式** | 开源核心 + 未来云服务 | 专有 + 免费层 |
| **ROS 集成** | 需要桥接 | 原生深度集成 |
| **MCAP 支持** | 内置 | 原生格式 (ROS2 默认) |
| **团队协作** | 有限 | 实时多人协作, SSO |
| **自托管** | 免费 (开源) | 仅企业版 ($100+/user) |
| **性能** | 非常快 (Rust) | 快 |
| **选择理由** | 完全开源, 代码优先 | ROS 重度用户, 企业合规 |

---

## 3. 其他可视化工具

### 3.1 PlotJuggler

**最佳用途**: 时序数据调试 (IMU/EMG 波形)

| 属性 | 值 |
|------|-----|
| **许可证** | MPL 2.0 (开源) |
| **GitHub Stars** | 5,500+ |
| **核心能力** | 百万级数据点时序图, ROS 集成, Lua 脚本转换 |
| **局限** | 仅 2D 绘图, 无 3D 骨架可视化 |

**适用场景**:

- IMU 角速度曲线调试
- EMG 信号对比分析
- 时间对齐验证

### 3.2 RViz2 (ROS2)

**最佳用途**: ROS2 机器人 3D 可视化

| 属性 | 值 |
|------|-----|
| **许可证** | BSD (开源) |
| **核心能力** | ROS2 原生, TF 坐标系, 插件系统 |
| **局限** | 需要 ROS2 基础设施, 学习曲线陡峭 |

**适用场景**:

- ROS2 机器人项目
- 多传感器 TF 校准

### 3.3 Open3D

**最佳用途**: 3D 点云/网格处理

| 属性 | 值 |
|------|-----|
| **许可证** | MIT (开源) |
| **GitHub Stars** | 12,600+ |
| **核心能力** | 点云处理, 3D 重建, ML 集成 |
| **局限** | 时序支持弱, 需要编程 |

### 3.4 Three.js

**最佳用途**: Web 端自定义仪表板

| 属性 | 值 |
|------|-----|
| **许可证** | MIT (开源) |
| **GitHub Stars** | 103,000+ |
| **核心能力** | 浏览器 3D, WebSocket 实时流, 无需安装 |
| **局限** | 需要从零开发, 无开箱即用功能 |

### 3.5 运动分析专用工具

| 工具 | 类型 | 适用场景 | 价格 |
|------|------|----------|------|
| **Kinovea** | 开源 | 体育视频分析 (奥运训练) | 免费 |
| **Visual3D** | 商业 | 生物力学研究 (步态分析) | $895/席位 |
| **AlphaPose** | 开源 | 多人姿态估计 | 免费 |
| **MMPose** | 开源 | ML 姿态估计工具箱 | 免费 |

---

## 4. VC 投资趋势

### 4.1 融资对比

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     机器人可视化工具融资对比                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Foxglove  ████████████████████████████████████████████████  $58.7M     │
│  Rerun     ██████████████████████                            $20.4M     │
│  Alloy     ████                                               $3M       │
│                                                                          │
│  说明: Foxglove 2025年11月完成 $40M B轮 (Bessemer 领投)                  │
│        Rerun 2025年3月完成 $17M 种子轮 (Point Nine 领投)                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 4.2 主要投资方

| VC 机构 | 投资项目 | 投资主题 |
|---------|----------|----------|
| **Point Nine** (柏林) | Rerun ($17M Seed) | SaaS, AI, B2B |
| **Bessemer Venture Partners** | Foxglove ($40M B轮) | 物理 AI 基础设施 |
| **Eclipse Ventures** | Foxglove ($15M A轮) | 机器人、工业 AI |
| **Costanoa Ventures** | Rerun (Pre-Seed + Seed) | AI 数据基础设施 |
| **Amplify Partners** | Foxglove | 开发者工具 |

### 4.3 市场规模

| 市场 | 2024 | 2030 | CAGR |
|------|------|------|------|
| **AI 赋能机器人** | $12.77B | $124.77B | 38.5% |
| **具身 AI** | $2.5B | $23.06B | 39.0% |
| **机器人整体** | $65B | - | 5.23% |

### 4.4 投资观点

**Bessemer (Foxglove B轮领投)**:
> "物理 AI 代表下一个代际平台转变 — 影响力堪比移动计算或云基础设施"

**Costanoa (Rerun 投资方)**:
> "世界 GDP 的大部分存在于物理世界，当前数据栈不是为物理 AI 构建的"

**关键瓶颈**:

1. 多模态数据管理 (视频、3D、传感器)
2. 可视化调试复杂时空数据
3. 开发者体验优化

---

## 5. 推荐方案

### 5.1 我们的技术选型

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                       推荐工具链                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  开发调试 ────────────────> Rerun                                       │
│    │ (多模态融合、算法验证、时间同步调试)                                │
│    │                                                                     │
│  时序分析 ────────────────> PlotJuggler (可选)                          │
│    │ (深度 IMU/EMG 波形分析)                                            │
│    │                                                                     │
│  生产 App ────────────────> Flutter CustomPaint                         │
│    │ (用户界面骨架渲染)                                                  │
│                                                                          │
│  注意: Rerun 是开发工具，不是用户界面替代品                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 集成步骤

#### Phase 1: 立即 (2-4 小时)

```bash
pip install rerun-sdk
python -m rerun_demos.human_pose_tracking
```

#### Phase 2: MVP 集成

- 在 `mvp-prototype-code.md` 代码中添加 `rr.log()` 调用
- 录制 GolfDB 测试视频 + Mock IMU/EMG 数据
- 验证时间同步是否正确

#### Phase 3: 团队工作流

- 保存 `.rrd` 文件用于问题复现
- 共享标注的挥杆录制
- 用于规则引擎阈值调优

### 5.3 不推荐的方案

| 工具 | 不推荐原因 |
|------|------------|
| **Foxglove** | 已闭源, 需付费, 无体育/生物力学支持 |
| **RViz2** | 需要 ROS2 基础设施, 过度复杂 |
| **Mokka/BTK** | 已停止开发 (9+ 年无更新) |
| **Visual3D** | 商业软件 ($895/席位), 非实时 |

---

## 6. 参考链接

### Rerun

- [官网](https://rerun.io/)
- [GitHub](https://github.com/rerun-io/rerun) (8,700+ stars)
- [人体姿态示例](https://rerun.io/examples/video-image/human_pose_tracking)
- [文档](https://rerun.io/docs)
- [TechCrunch: $17M 融资](https://techcrunch.com/2025/03/20/reruns-open-source-ai-platform-for-robots-drones-and-cars-revs-up-with-17m-seed/)

### Foxglove

- [官网](https://foxglove.dev/)
- [定价](https://foxglove.dev/pricing)
- [Rerun vs Foxglove](https://foxglove.dev/robotics/rerun-vs-foxglove)
- [Robot Report: $40M B轮](https://www.therobotreport.com/foxglove-raises-40m-scale-data-platform-roboticists/)

### 其他工具

- [PlotJuggler](https://plotjuggler.io/)
- [Open3D](https://www.open3d.org/)
- [Kinovea](https://www.kinovea.org/)
- [MMPose](https://mmpose.com/)

### 市场分析

- [Bessemer: 物理 AI 时代](https://www.bvp.com/atlas/intelligent-robotics-the-new-era-of-physical-ai)
- [Crunchbase: 机器人融资趋势](https://news.crunchbase.com/robotics/startup-funding-rises-h1-2025-ai-apptronik-data/)

---

**最后更新**: 2025年12月18日
