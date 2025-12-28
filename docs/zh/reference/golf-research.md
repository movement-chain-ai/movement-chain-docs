# 高尔夫生物力学研究 (Golf Biomechanics Research)

> 高尔夫挥杆分析相关的学术论文、数据集和研究资源

---

## 概述 (Overview)

本文档收录高尔夫挥杆分析领域的关键研究，包括：

- **IMU 相位检测** - 使用惯性传感器分割挥杆阶段
- **视觉分析** - 基于视频的挥杆检测
- **运动相似度** - DTW 和模板匹配方法
- **开源数据集** - GolfDB 等公开数据

---

## 优先级 1：核心研究 (Priority 1: Core Research)

### 1. GolfDB - 8 相位挥杆数据集

**高尔夫挥杆分析的标准基准数据集。**

#### 发表详情 (Publication Details)

- **Title**: GolfDB: A Video Database for Golf Swing Sequencing
- **Authors**: McNally et al.
- **Venue**: CVPR 2019 Workshop
- **Paper**: [arXiv:1903.06528](https://arxiv.org/abs/1903.06528)
- **GitHub**: [wmcnally/GolfDB](https://github.com/wmcnally/GolfDB)

#### 数据集内容 (Dataset Contents)

| 项目 | 数值 |
|------|------|
| 视频数量 | 1,400+ |
| 挥杆类型 | Driver, Iron, Wood |
| 视角 | Face-on, Down-the-line |
| 标注 | 8 个挥杆阶段时间戳 |

#### 8 相位定义 (8-Phase Definition)

```text
1. Address (站位)        - 准备姿势
2. Toe-Up (杆头上抬)     - 启动上杆
3. Mid-Backswing (上杆中) - 手臂平行地面
4. Top (顶点)           - 最大后摆
5. Mid-Downswing (下杆中) - 手臂再次平行
6. Impact (击球)        - 触球瞬间
7. Mid-Follow-Through   - 随挥中段
8. Finish (收杆)        - 完成姿势
```

#### Movement Chain AI 使用方式

- 训练视觉相位检测模型
- 验证 IMU 相位分割精度
- 建立挥杆质量评估基线

---

### 2. SwingNet - 视频相位检测网络

**GolfDB 上最佳的挥杆相位检测模型。**

#### 发表详情 (Publication Details)

- **Paper**: 同 GolfDB 论文
- **GitHub**: [wmcnally/golfdb](https://github.com/wmcnally/golfdb)
- **Model**: 3D CNN + Temporal Attention

#### 性能指标 (Performance)

| 指标 | 数值 |
|------|------|
| 8 相位准确率 | 71.5% (Split1 test) |
| 帧误差 | ±3-5 帧 (@30fps) |
| 模型大小 | ~100MB |

#### 代码使用示例

```python
# 使用 SwingNet 检测挥杆阶段
from swingnet import SwingNet

model = SwingNet()
model.load_weights('swingnet_1800.pth.tar')

# 输入: 视频帧序列 [T, H, W, 3]
# 输出: 8 个相位的帧索引
phases = model.predict(video_frames)
# phases = [0, 15, 32, 48, 55, 60, 72, 90]
```

---

### 3. IMU 高尔夫挥杆相位分割

**证明 IMU 可达到与视觉相当的相位检测精度。**

#### 论文 A: Golf Swing Segmentation from IMU (2020)

- **Title**: Validation of Inertial Measurement Unit for Golf Swing Analysis
- **Venue**: PMC
- **Link**: [PMC7472298](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7472298/)

**关键发现**：

- 使用陀螺仪 Z 轴零交叉检测 Top of Backswing
- 检测精度：±9-15ms
- 单 IMU 位置：手腕或杆身

#### 论文 B: IMU Validation for Golf (2023)

- **Title**: Validation and Reliability of Inertial Measurement Unit...
- **Venue**: MDPI Sensors / PMC
- **Link**: [PMC10611231](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10611231/)

**关键发现**：

- 多位置 IMU 对比研究
- 手腕位置最佳（r=0.95 与动捕系统）
- 采样率要求：≥200Hz

#### 论文 C: Wrist IMU Swing Tracking (2024)

- **Title**: Golf Swing Analysis Using Wrist-Worn IMU
- **Venue**: Nature Scientific Reports
- **Link**: [搜索 "golf IMU wrist Nature Scientific Reports 2024"](https://www.nature.com/srep/)

**关键发现**：

- 单手腕 IMU 可检测 5 个关键事件
- Address → Top → Impact 检测可靠
- 适合消费级设备

---

### 4. 动态运动相似度 (Dynamic Motion Similarity)

**基于 DTW 的高尔夫挥杆比较方法。**

#### 论文: Dynamic Motion Similarity for Golf (2024)

- **Title**: Dynamic Motion Similarity Analysis for Golf Swing
- **Venue**: MDPI Sensors
- **Link**: 搜索 "golf DTW motion similarity MDPI Sensors 2024"

**方法论**：

```python
# DTW 距离计算
from dtw import accelerated_dtw

def compare_swings(swing_a, swing_b):
    """
    比较两个挥杆的 IMU 序列相似度

    Args:
        swing_a: [T1, 6] - gyro_xyz + acc_xyz
        swing_b: [T2, 6]

    Returns:
        distance: 归一化 DTW 距离 (0=相同, 1=完全不同)
    """
    distance, _, _, _ = accelerated_dtw(
        swing_a, swing_b,
        dist='euclidean'
    )
    return distance / (len(swing_a) + len(swing_b))
```

**应用场景**：

- 将用户挥杆与教练模板比较
- 检测用户挥杆的一致性
- 评估改进进度

---

## 优先级 2：支持性研究 (Priority 2: Supporting Research)

### Kinematic Sequence 研究

- **Title**: The Kinematic Sequence in Golf
- **Author**: Phil Cheetham (TPI)
- **Link**: [Titleist Performance Institute](https://www.mytpi.com/)
- **贡献**: 定义了专业挥杆的动力链顺序（髋→躯干→手臂→球杆）

### 生物力学基准值来源

- **OpenSim Golf Models**: [simtk.org](https://simtk.org/)
- **TPI 3D 研究**: 专业球员的角度/速度基准

---

## 数据集对比表 (Dataset Comparison)

| 数据集 | 类型 | 规模 | 标注 | 访问 |
|--------|------|------|------|------|
| **GolfDB** | 视频 | 1,400+ | 8相位时间戳 | 公开 |
| **GolfSwingHD** | 视频 | 300 | 挥杆边界 | 研究申请 |
| **IMU Golf Dataset** | IMU | ~100 挥杆 | 相位+参数 | 论文附录 |

---

## Movement Chain AI 集成路线图

### Phase 1: 验证 (Week 1-2)

- [ ] 下载 GolfDB 数据集
- [ ] 在 GolfDB 上测试 SwingNet
- [ ] 复现 IMU 相位检测论文结果

### Phase 2: 适配 (Week 3-4)

- [ ] 将 8 相位检测集成到系统
- [ ] 实现 DTW 挥杆比较
- [ ] 用 GolfDB 验证检测精度

### Phase 3: 扩展 (Month 2)

- [ ] 收集自有 IMU+视频同步数据
- [ ] 训练定制化相位检测模型
- [ ] 建立 EMG + IMU 融合数据集

---

## 引用格式 (Citation)

**GolfDB / SwingNet**:

```bibtex
@inproceedings{mcnally2019golfdb,
  title={GolfDB: A Video Database for Golf Swing Sequencing},
  author={McNally, William and Vats, Kanav and Pinto, Tyler and
          Dulhanty, Chris and McPhee, John and Wong, Alexander},
  booktitle={CVPR Workshops},
  year={2019}
}
```

---

## 相关文档

- [8 相位挥杆分解](../design/specs/swing-phases.md) - 系统实现
- [实时反馈规范](../design/specs/real-time-feedback.md) - 反馈模式
- [传感器指标映射](../design/architecture/sensor-data-processing.md) - IMU/EMG 指标
- [学术数据集](academic-datasets.md) - 通用运动数据集

---

**Last Updated**: December 2025
**Maintainer**: Movement Chain AI Team
