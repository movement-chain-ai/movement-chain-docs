# 软件工程师 Brief

> **目标受众**: Python/ML 背景的软件工程师
>
> **阅读时长**: 30 分钟
>
> **文档目的**: 快速上手 Movement Chain AI 核心算法实现

---

## 项目概述

Movement Chain AI 是一个高尔夫挥杆分析系统，融合 **Vision (MediaPipe) + IMU (LSM6DSV16X) + EMG (肌电传感器)** 三模态数据，提供实时技术反馈。

你的任务是实现核心算法管道，将传感器原始数据转化为可执行的技术建议。

---

## 你需要做什么

### Phase 1: Vision Pipeline (1-2 周)

**核心任务**:

1. **MediaPipe 姿态提取**: 从视频中提取 33 个关键点 (30fps)
2. **特征计算**: 计算高尔夫相关指标
   - X-Factor (肩髋分离角)
   - 肩部旋转 (>85°)
   - 髋部旋转 (40-50°)
   - 左肘角度 (>160°)
   - 脊柱倾斜
3. **8 阶段检测**: 从 Address → Toe-Up → Mid-Backswing → Top → Mid-Downswing → Impact → Mid-Follow-Through → Finish
4. **骨架可视化**: 在视频帧上绘制实时骨架

**输入**: 视频文件 (MP4, 60fps 推荐) 或摄像头实时流

**输出**: 时间序列特征 (T, 33, 3) + 阶段时间戳

### Phase 2: Mock Sensor Integration (1 周)

**核心任务**:

1. **时间同步**: 将 IMU (100Hz) 和 EMG (200Hz) 数据对齐到 Vision (30fps) 时间轴
2. **IMU 特征提取**:
   - 峰值角速度 (挥杆力量指标)
   - 节奏比 Tempo Ratio (理想 3:1)
   - 上杆顶点检测 (角速度过零点)
   - 击球时刻检测 (峰值速度)
3. **EMG 特征提取**:
   - 肌肉激活时序 (核心 vs 前臂)
   - 激活强度 (mV 信号幅值)
   - 力链验证 (核心 → 前臂的顺序)
4. **传感器融合**: 组合三模态数据为统一特征向量

**输入**: Mock IMU/EMG 数据 (Phase 1 先用模拟数据)

**输出**: 同步的多模态特征字典

### Phase 3: Rule Engine (1 周)

**核心任务**:

1. **实现 6 条规则**:
   - 规则 1: 肩膀旋转 < 85° → "转肩不足"
   - 规则 2: 髋部旋转 < 40° → "髋部旋转不足"
   - 规则 3: X-Factor < 35° → "X-因子过小"
   - 规则 4: 节奏比 < 2.5 or > 4.0 → "节奏异常"
   - 规则 5: 核心激活 < 40% + 前臂激活 > 50% → "核心不足，手臂代偿"
   - 规则 6: 前臂先于核心激活 → "发力时序错误"
2. **问题列表生成**: 检测到的所有问题
3. **建议生成**: 针对性改进建议
4. **评分系统**: 0-100 分挥杆质量评估

**输入**: 多模态特征字典

**输出**: 分析结果 (评分 + 问题 + 建议)

---

## 技术栈

### 核心依赖

```bash
# 必选
pip install mediapipe opencv-python numpy

# EMG 处理
pip install neurokit2

# 可视化
pip install matplotlib plotly

# 交互式 Demo
pip install streamlit
```

### 推荐工具

- **Python**: 3.10+
- **IDE**: VS Code + Python extension
- **测试数据**: GolfDB 数据集 (1400 个标注视频)

---

## 关键文档 (必读)

### 核心算法 ⭐

- [**8 阶段挥杆检测**](../swing-phases.md) (20 分钟)
  - 定义 8 个标准阶段及其检测方法
  - 包含完整检测代码和精度对比
  - **这是你的主要参考文档**

### 对比策略

- [**挥杆对比方法**](../swing-comparison.md) (15 分钟)
  - 4 种对比方法: 职业参考、个人最佳、统计参考、学习嵌入
  - DTW (Dynamic Time Warping) 实现
  - MVP 推荐: 规则引擎 + 个人最佳

### 基准数据

- [**生物力学基准值**](../research/biomechanics-benchmarks.md) (10 分钟)
  - 职业 vs 业余球手数据对比
  - 规则引擎阈值来源
  - X-Factor, 节奏比, 峰值角速度等指标

### 传感器能力

- [**传感器指标映射**](../research/sensor-metric-mapping.md) (10 分钟)
  - Vision/IMU/EMG 各能检测什么
  - 竞品能力对比
  - **EMG 是我们的独特优势**

### 参考代码

- [**MVP 原型代码**](../../platform/mvp-prototype-code.md) (30 分钟)
  - 完整可运行的 Python 代码
  - 数据采集、特征提取、规则引擎、可视化
  - **直接复制粘贴即可开始**

---

## 验收标准

### Phase 1 完成标志

- MediaPipe 在 GolfDB 视频上成功提取 33 关键点
- X-Factor 计算准确率 >90%
- 8 阶段检测误差 <100ms (对比人工标注)
- 骨架可视化流畅 (>20fps)

### Phase 2 完成标志

- IMU/EMG Mock 数据生成合理 (峰值速度、激活时序符合研究数据)
- 时间同步误差 <10ms
- 传感器融合特征向量维度正确

### Phase 3 完成标志

- 规则引擎能识别 6 条常见问题
- 评分系统与人工评估相关性 >0.7
- 端到端延迟 <500ms (视频 → 分析结果)

---

## 预估工作量

| 阶段 | 任务 | 工作量 | 关键里程碑 |
|-----|------|-------|-----------|
| **Phase 1** | Vision Pipeline | 1-2 周 | MediaPipe 成功提取骨架 |
| **Phase 2** | Mock Sensor Integration | 1 周 | 时间同步完成 |
| **Phase 3** | Rule Engine | 1 周 | 规则引擎输出问题列表 |
| **总计** | | 3-4 周 | 端到端 Demo 可运行 |

---

## 我们已有的资源

### 数据集

- **GolfDB**: 1400 个标注视频，包含 8 阶段时间戳
  - [GitHub](https://github.com/wmcnally/golfdb)
  - [Paper (arXiv)](https://arxiv.org/abs/1903.06128)

### 研究论文

- **PMC7472298**: Golf Swing Segmentation from IMU (2020)
  - IMU 检测精度验证: Top of Backswing ±9-15ms
  - [链接](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7472298/)

- **Meister et al. (2011)**: X-Factor 与杆头速度相关性 (r = 0.943)
  - [PubMed](https://pubmed.ncbi.nlm.nih.gov/21844613/)

- **Cheetham et al. (2008)**: 运动链时序研究
  - 骨盆 → 胸椎 → 手臂 → 球杆的时序模式
  - [PMC3362989](https://pmc.ncbi.nlm.nih.gov/articles/PMC3362989/)

### 参考代码

- **MediaPipe Pose**: [官方示例](https://github.com/google/mediapipe/blob/master/docs/solutions/pose.md)
- **NeuroKit2**: [EMG 处理文档](https://neuropsychology.github.io/NeuroKit/functions/emg.html)
- **DTW Python**: [动态时间规整](https://dynamictimewarping.github.io/python/)

---

## 开发流程建议

### 第 1 天: 环境搭建

```bash
# 安装依赖
pip install mediapipe opencv-python numpy neurokit2 matplotlib

# 下载 GolfDB 数据集
git clone https://github.com/wmcnally/golfdb.git

# 测试 MediaPipe
python -c "import mediapipe as mp; print(mp.__version__)"
```

### 第 2-7 天: Vision Pipeline

1. 读取 GolfDB 视频，提取骨架
2. 实现 X-Factor 计算
3. 实现 8 阶段检测 (先做 Top 和 Impact)
4. 可视化验证

### 第 8-12 天: Mock Sensor

1. 参考 `mvp-prototype-code.md` 中的 `IMUMockGenerator`
2. 实现时间同步函数 `sync_to_vision_timeline()`
3. 生成合理的 Mock EMG 数据
4. 验证同步误差 <10ms

### 第 13-17 天: Rule Engine

1. 实现 6 条规则检测函数
2. 编写评分算法
3. 生成问题列表和建议
4. 端到端测试

### 第 18-20 天: 优化和测试

1. 在 GolfDB 10+ 视频上测试
2. 调整规则阈值
3. 优化性能 (目标 <500ms)
4. 编写单元测试

---

## 常见问题 FAQ

### Q1: MediaPipe 检测不到关键点怎么办?

**A**: 确保:

- 视频光线充足
- 全身在画面内
- 无遮挡
- 尝试调整 `min_detection_confidence` 参数 (默认 0.5)

### Q2: 8 阶段检测精度不够怎么办?

**A**: 优先实现 3 个关键阶段:

1. **Top of Backswing**: IMU 角速度过零点 (精度 ±9-15ms)
2. **Impact**: IMU 峰值角速度 (精度 ±9-15ms)
3. **Finish**: IMU 角速度再次低于阈值

其他阶段可以通过时间插值估算。

### Q3: 如何验证规则引擎是否正确?

**A**: 使用极端场景测试:

- **正常挥杆**: 所有指标在正常范围 → 评分 >80
- **转肩不足**: 肩部旋转 <70° → 检测到问题
- **核心不足**: EMG 核心激活 <30% + 前臂 >70% → 检测到代偿

### Q4: GolfDB 数据集太大怎么办?

**A**: 先用 10 个视频测试，验证流程后再扩展:

```python
test_videos = golfdb_dataset[:10]
```

---

## 联系方式

- **技术问题**: [Tech Lead Email/Slack]
- **产品需求**: [Product Lead Email/Slack]
- **硬件对接**: [Hardware Team]
- **文档更新**: 提 PR 到 `docs/zh/design/`

---

## 下一步

完成 MVP 后，Phase 2 的任务:

1. **真实硬件对接**: 连接 ESP32-S3 + LSM6DSV16X IMU
2. **DTW 对比**: 实现与职业挥杆的对比功能
3. **Flutter 移植**: 将算法移植到移动端 App
4. **实时反馈**: 优化延迟至 <200ms，支持实时语音反馈

---

**最后更新**: 2025-12-18
**维护者**: Movement Chain AI Team
