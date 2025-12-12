# 系统设计 System Design

> **文档目的**: 定义 MVP 核心管道的完整数据流
>
> **阅读对象**: 算法工程师、产品经理、技术投资人

---

## MVP 核心管道

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                           MVP 端到端数据流                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   │
│  │ 数据采集  │ → │ 骨架提取  │ → │ 时间同步  │ → │ 特征分析  │ → │ 反馈输出  │   │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘   │
│       │              │              │              │              │          │
│       ▼              ▼              ▼              ▼              ▼          │
│   Vision         MediaPipe       线性插值       规则引擎       骨架叠加       │
│   IMU            Pose            降采样         IF-THEN        语音提示       │
│   EMG                            对齐           9条规则        评分显示       │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 第一层: 数据采集

### 为什么需要三种传感器?

| 模态 | 测量内容 | 采样率 | 优势 | 劣势 |
|-----|---------|-------|-----|-----|
| **Vision** | 全身姿态、33关节点 | 30 fps | 全身可见、用户无感 | 遮挡问题、帧率限制 |
| **IMU** | 手腕角速度、加速度 | 100 Hz | 高时间精度、不受光照 | 单点数据、累积漂移 |
| **EMG** | 肌肉激活、发力时序 | 200 Hz | 内部状态可见、**差异化** | 需要接触皮肤 |

**关键洞察**: 单模态准确率 ~70-85%，三模态融合后可达 95%+

### 技术选型

| 模态 | 硬件/SDK | 状态 | 决策文档 |
|-----|---------|------|---------|
| Vision | 手机摄像头 + MediaPipe | ✅ 可用 | - |
| IMU | LSM6DSV16X | ✅ 选型完成 | [ADR-0002](decisions/0002-lsm6dsv16x-imu.md) |
| EMG | NeuroKit2 处理 | 🔧 Phase 2 | - |

---

## 第二层: 骨架提取

MediaPipe Pose 输出 33 个关节点:

```python
# 3行代码完成骨架提取
import mediapipe as mp
pose = mp.solutions.pose.Pose()
results = pose.process(rgb_frame)
landmarks = results.pose_landmarks.landmark  # 33个点
```

**输出格式**:

```json
{
  "frame_id": 1,
  "timestamp_ms": 33.3,
  "landmarks": [
    {"id": 11, "name": "left_shoulder", "x": 0.421, "y": 0.412, "z": -0.052}
  ]
}
```

---

## 第三层: 时间同步

### 问题

三种传感器采样率不同，必须对齐才能正确分析:

```text
原始数据流:
Vision:  |---F1---F2---F3---F4---F5---|  (30 fps, 每33ms)
IMU:     |*-*-*-*-*-*-*-*-*-*-*-*-*-*|  (100 Hz, 每10ms)
EMG:     |********************...*****|  (200 Hz, 每5ms)

同步后 (对齐到 Vision 时间轴):
Vision:     F1    F2    F3    F4    F5   (原生帧)
IMU:        I1    I2    I3    I4    I5   (线性插值)
EMG:        E1    E2    E3    E4    E5   (降采样+RMS包络)
```

### 实现

```python
import numpy as np

def sync_to_vision(vision_timestamps, imu_data, emg_data):
    imu_synced = np.interp(vision_timestamps, imu_data['t'], imu_data['gyro_z'])
    emg_synced = np.interp(vision_timestamps, emg_data['t'], emg_data['rms'])
    return imu_synced, emg_synced
```

---

## 第四层: 特征提取

### Vision 特征

| 特征 | 计算方法 | 阈值 |
|-----|---------|-----|
| 肩膀旋转 | atan2(右肩z - 左肩z, 右肩x - 左肩x) | >85° |
| 髋部旋转 | atan2(右髋z - 左髋z, 右髋x - 左髋x) | >40° |
| X-因子 | 肩膀旋转 - 髋部旋转 | >35° |
| 左肘角度 | 三点夹角(肩-肘-腕) | >160° |

### IMU 特征

| 特征 | 计算方法 | 理想值 |
|-----|---------|-------|
| 峰值角速度 | max(abs(gyro_z)) | >1200°/s |
| 节奏比 | 上杆时间 / 下杆时间 | 3:1 |
| 上杆顶点 | gyro_z 由负转正的点 | - |

### EMG 特征 (差异化)

| 特征 | 计算方法 | 阈值 |
|-----|---------|-----|
| 核心激活 | 下杆阶段平均RMS | >50% |
| 前臂激活 | 下杆阶段平均RMS | <60% |
| 激活时序 | 核心onset < 前臂onset | 正确 |

---

## 第五层: 规则引擎

### 9 条核心规则

| # | 规则 | 条件 | 扣分 | 来源 |
|---|-----|------|-----|------|
| 1 | 转肩不足 | shoulder < 85° | -15 | Vision |
| 2 | 髋部受限 | hip < 40° | -10 | Vision |
| 3 | X因子过小 | x_factor < 35° | -10 | Vision |
| 4 | 左肘弯曲 | elbow < 160° | -10 | Vision |
| 5 | 节奏过快 | tempo < 2.5 | -10 | IMU |
| 6 | 节奏过慢 | tempo > 4.0 | -5 | IMU |
| 7 | 速度不足 | peak < 800°/s | -5 | IMU |
| **8** | **核心代偿** | core<50% AND forearm>60% | **-20** | **EMG** |
| **9** | **时序错误** | forearm先于core | **-15** | **EMG** |

> **规则 8、9 是 EMG 独特价值，竞品无法提供**

### 实现

```python
def analyze_swing(vision, imu, emg):
    score = 100
    problems = []

    if vision['shoulder'] < 85:
        score -= 15
        problems.append("转肩不足")

    if emg['core'] < 50 and emg['forearm'] > 60:
        score -= 20
        problems.append("核心代偿，手臂发力过多")

    return {'score': score, 'problems': problems}
```

---

## 第六层: 反馈输出

### MVP 输出模式

| 模式 | 描述 | 延迟要求 | 阶段 |
|-----|------|---------|-----|
| 骨架叠加 | 第三人称视角，骨架线条叠加视频 | <100ms | MVP |
| 评分显示 | 0-100分 + 问题列表 | <500ms | MVP |
| 语音反馈 | TTS 播报主要问题 | <500ms | MVP |
| Ghost对比 | 理想挥杆半透明叠加 | - | Phase 2 |

### 语音触发时机

| 场景 | 示例 | 延迟 |
|-----|------|-----|
| 挥杆完成 | "82分，节奏很好" | <500ms |
| 检测到问题 | "注意从内侧下杆" | <300ms |
| EMG异常 | "核心发力不足" | <500ms |

---

## SDK 可用性总览

| 组件 | 工具 | 代码量 | 状态 |
|-----|------|-------|-----|
| 姿态估计 | `pip install mediapipe` | 3行 | ✅ 开箱即用 |
| EMG处理 | `pip install neurokit2` | 1行 | ✅ 开箱即用 |
| 时间同步 | `numpy.interp()` | 5行 | ✅ 标准库 |
| 特征提取 | math, numpy | ~100行 | 🛠️ 自己写 |
| 规则引擎 | 纯Python IF-THEN | ~200行 | 🛠️ 自己写 |
| 可视化 | OpenCV, MediaPipe | ~30行 | ✅ 现成 |
| 语音反馈 | flutter_tts | - | ✅ 现成 |

---

## 相关文档

- [快速开始](getting-started.md) - 无需硬件即可测试
- [决策摘要](decisions-summary.md) - 关键ADR概览
- [术语表](00-glossary.md) - IMU、EMG 等术语定义
- [MVP原型代码](../platform/mvp-prototype-code.md) - 完整可运行代码

---

**最后更新**: 2025年12月12日
