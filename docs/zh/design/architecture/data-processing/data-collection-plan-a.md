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
| 总采集量 | 80次挥杆 |
| 设备 | 1套（串行采集） |
| 目的 | 验证传感器数据采集流程 |

---

## 二、受试者

| ID | 要求 |
|----|------|
| A | 业余球手 |
| B | 业余球手 |

---

## 三、时间安排

> **注意**：只有1套设备，A/B 需要串行采集，每次切换需要重新佩戴传感器（约5分钟）

### 受试者 A（上午）

| 时间 | 内容 | 说明 |
|------|------|------|
| 09:00-09:30 | 设备调试、传感器校准 | |
| 09:30-09:40 | A 佩戴传感器 | IMU×2 + EMG×2 |
| **第1组** | | |
| 09:40-10:00 | A **10次** 正常挥杆 | |
| 10:00-10:05 | 休息 5分钟 | 喝水、放松 |
| **第2组** | | |
| 10:05-10:25 | A **10次** 正常挥杆 | |
| 10:25-10:30 | 休息 5分钟 | |
| **第3组** | | |
| 10:30-10:50 | A **5次** 正常 + **10次** 错误动作 | |
| 10:50-11:00 | 休息 10分钟 | 较长休息，准备换人 |
| **第4组** | | |
| 11:00-11:15 | A **5次** 错误动作 | |
| 11:15-11:25 | A 摘除传感器 | |

### 受试者 B（下午）

| 时间 | 内容 | 说明 |
|------|------|------|
| 11:25-11:35 | B 佩戴传感器 | |
| **第1组** | | |
| 11:35-11:55 | B **10次** 正常挥杆 | |
| 11:55-13:30 | **午休** | 充分休息 |
| **第2组** | | |
| 13:30-13:50 | B **10次** 正常挥杆 | |
| 13:50-13:55 | 休息 5分钟 | |
| **第3组** | | |
| 13:55-14:15 | B **5次** 正常 + **10次** 错误动作 | |
| 14:15-14:25 | 休息 10分钟 | |
| **第4组** | | |
| 14:25-14:40 | B **5次** 错误动作 | |
| 14:40-15:00 | 数据检查、补采 | |

### 休息原则

| 情况 | 休息时长 | 说明 |
|------|---------|------|
| 每10次挥杆后 | 5分钟 | 防止疲劳累积 |
| 每15次挥杆后 | 10分钟 | 较长休息 |
| 换人前 | 10分钟 | 摘除/佩戴传感器 |
| 午休 | 1.5小时 | 充分恢复 |

---

## 四、采集汇总

| 类型 | 计算 | 次数 |
|------|------|------|
| 正常挥杆 | 2人 × 25次 | 50次 |
| 错误动作 | 2人 × 15次 | 30次 |
| **总计** | | **80次** |

### 每人采集明细

| 组别 | 正常挥杆 | 错误动作 | 小计 |
|------|---------|---------|------|
| 第1组 | 10次 | 0次 | 10次 |
| 第2组 | 10次 | 0次 | 10次 |
| 第3组 | 5次 | 10次 | 15次 |
| 第4组 | 0次 | 5次 | 5次 |
| **合计** | **25次** | **15次** | **40次** |

### 错误动作类型（对应6条诊断规则）

| 优先级 | 错误类型 | 触发条件 | 数据源 | 次数/人 | 总次数 | 动作指导 |
|-------|---------|---------|--------|--------|--------|---------|
| P0 | 倒序运动链 | 前臂先于核心激活 (gap < -20ms) | EMG | 3次 | 6次 | 刻意用手臂启动下杆 |
| P0 | 过度手臂挥杆 | Forearm/Core ratio > 1.3 | EMG | 3次 | 6次 | 核心不发力，纯手臂挥 |
| P1 | X-Factor 不足 | X-Factor < 20° | Vision | 2次 | 4次 | 最小化肩髋分离 |
| P1 | 节奏过快 | Downswing < 0.20s | IMU | 3次 | 6次 | 尽可能快地下杆 |
| P1 | 节奏过慢 | Downswing > 0.40s | IMU | 2次 | 4次 | 刻意放慢下杆速度 |
| P1 | 早释放 | Wrist release < 40% downswing | IMU | 2次 | 4次 | 下杆初期就打开手腕 |

### 错误动作参考视频

| 错误类型 | 参考资料 | 链接 |
|---------|---------|------|
| 倒序运动链 | Golf.com - Step Drill (Harrington) | [链接](https://golf.com/instruction/driving/step-drill-sequencing-padraig-harrington/) |
| 倒序运动链 | RotarySwing - Sequencing Drill | [链接](https://rotaryswing.com/golf-instruction/golfbiomechanics/golf-swing-sequencing-drill) |
| 过度手臂挥杆 | Golf Distillery - All Arms Swing | [链接](https://www.golfdistillery.com/swing-errors/all-arms-swing/) |
| 过度手臂挥杆 | HackMotion - Over the Top Fix | [链接](https://hackmotion.com/over-the-top-golf-swing/) |
| X-Factor 不足 | TPI - X-Factor Essentials | [链接](https://www.mytpi.com/articles/fitness/x-factor_essentials_what_it_is_and_how_to_train_it) |
| X-Factor 不足 | SwingStation - Hip Twister Drill | [链接](https://swingstation.com/video/downswing-separation-drill-hip-twister-ll) |
| 节奏过快 | RotarySwing - Stop Rushing Downswing | [链接](https://rotaryswing.com/golf-instruction/stop-rushing-downswing-golf) |
| 节奏过快 | Performance Golf - Rushing Fix | [链接](https://www.performancegolf.com/stop-rushing-downswing) |
| 节奏过慢 | Golf Distillery - Deceleration Fix | [链接](https://www.golfdistillery.com/swing-errors/decel/) |
| 节奏过慢 | Left Rough - Deceleration Cure | [链接](https://theleftrough.com/golf-swing-deceleration/) |
| 早释放 | HackMotion - Stop Early Release | [链接](https://hackmotion.com/stop-early-release-in-golf-swing/) |
| 早释放 | Golf Distillery - Casting Fix | [链接](https://www.golfdistillery.com/swing-errors/casting/) |

---

## 五、验证目标

- [ ] IMU 检测 Impact 时刻
- [ ] EMG 区分核心 vs 手臂激活顺序
- [ ] 时间同步 <1ms
- [ ] 6条诊断规则全部可触发

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

80次挥杆 ≈ **400-500MB** 总数据量

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
