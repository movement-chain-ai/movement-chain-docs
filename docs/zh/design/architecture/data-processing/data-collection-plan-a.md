# 数据采集计划 A

> **文档状态**: 草稿 v1.0
> **最后更新**: 2026-01-08
> **关联文档**: [数据管道架构](data-pipeline.md) | [指标计算](metrics-calculation.md) | [信号处理](signal-processing.md)

---

## 一、实验概览

| 项目 | 内容 |
|------|------|
| 受试者 | 2人（A、B） |
| 时长 | 1天 |
| 总采集量 | 60次挥杆 |
| 目的 | 验证传感器数据采集流程 |

---

## 二、受试者

| ID | 要求 |
|----|------|
| A | 业余球手 |
| B | 业余球手 |

---

## 三、时间安排

| 时间 | 内容 |
|------|------|
| 09:00-10:00 | 设备调试、传感器校准 |
| 10:00-11:00 | A **20次** Full Swing |
| 11:00-12:00 | B **20次** Full Swing |
| 午休 | |
| 14:00-14:30 | A **10次** 错误动作 |
| 14:30-15:00 | B **10次** 错误动作 |

---

## 四、采集汇总

| 类型 | 次数 |
|------|------|
| 正常挥杆 | 40次 |
| 错误动作 | 20次 |
| **总计** | **60次** |

### 错误动作类型

| 错误类型 | 次数/人 | 触发规则 |
|---------|--------|---------|
| 手臂先启动 | 3-4次 | `ARMS_BEFORE_CORE` |
| 早释放 | 3-4次 | `EARLY_RELEASE` |
| 节奏过快 | 3-4次 | `FAST_TEMPO` |

---

## 五、验证目标

- [ ] IMU 检测 Impact 时刻
- [ ] EMG 区分核心 vs 手臂激活顺序
- [ ] 时间同步 <1ms

---

## 六、原始数据格式

### 6.1 IMU 数据（1666Hz）

```csv
timestamp_ms, acc_x, acc_y, acc_z, gyro_x, gyro_y, gyro_z
0.0,    0.12,  9.78,  0.34,   2.1,   -1.3,    5.2
0.6,    0.15,  9.81,  0.31,   3.4,   -2.1,   12.8
1.2,    0.21,  9.75,  0.29,  15.2,   -8.4,   85.3
...
600.0,  2.34,  8.12,  3.21, 180.5, -120.3, 1850.2  ← Impact 附近
```

- **acc**: 加速度 (g)
- **gyro**: 角速度 (°/s)

### 6.2 EMG 数据（1000Hz）

```csv
timestamp_ms, forearm_raw, forearm_rms, core_raw, core_rms
0.0,    12,   0.02,    8,   0.01
1.0,    15,   0.02,   11,   0.01
2.0,    18,   0.03,   45,   0.08  ← 核心先激活
...
350.0, 180,   0.42,  120,   0.35  ← 前臂后激活
```

- **raw**: 原始 ADC 值
- **rms**: 平滑后的激活强度 (0-1)

### 6.3 Vision 数据（30fps）

```csv
timestamp_ms, shoulder_x, shoulder_y, hip_x, hip_y, wrist_x, wrist_y, ...
0,     320, 180, 325, 350, 280, 420
33,    318, 178, 326, 352, 275, 415
66,    312, 172, 330, 355, 260, 400
...
```

- 33个 MediaPipe 关键点的 x, y 坐标

### 6.4 计算后的指标（每次挥杆1条）

```json
{
  "swing_id": "A_001",
  "timestamp": "2026-01-08T10:23:45",
  "subject": "A",

  "phases": {
    "address_ms": 0,
    "top_ms": 720,
    "impact_ms": 980
  },

  "metrics": {
    "x_factor": 48.2,
    "shoulder_rotation": 92.5,
    "hip_rotation": 47.1,
    "peak_angular_velocity": 1820,
    "tempo_ratio": 2.8,
    "backswing_duration_ms": 720,
    "downswing_duration_ms": 260,
    "core_activation_pct": 0.72,
    "core_forearm_delay_ms": 45
  },

  "diagnosis": {
    "triggered_rules": [],
    "score": 85
  }
}
```

---

## 七、文件结构

```text
data/
├── raw/
│   ├── A_001/
│   │   ├── imu.csv       (~100KB)
│   │   ├── emg.csv       (~60KB)
│   │   ├── vision.csv    (~30KB)
│   │   └── video.mp4     (~5MB)
│   ├── A_002/
│   └── ...
├── processed/
│   └── swings.json       (所有挥杆的计算指标)
└── labels/
    └── annotations.csv   (人工标注)
```

60次挥杆 ≈ **300-400MB** 总数据量

---

## 八、设备清单

| 设备 | 数量 | 用途 |
|------|------|------|
| iPhone | 1 | 视频采集 + MediaPipe |
| IMU (LSM6DSV16X) | 2 | 手背 + 前臂 |
| EMG (MyoWare 2.0) | 2 | 前臂 + 核心 |
| ESP32-S3 | 1 | 数据汇聚 |
| 三脚架 | 1 | 固定手机 |
| 高尔夫球杆 | 1 | Driver |
| 练习球 | 若干 | |
