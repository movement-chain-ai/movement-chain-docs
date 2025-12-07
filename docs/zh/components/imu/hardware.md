# IMU 惯性测量单元

惯性测量单元 (Inertial Measurement Unit) 是高尔夫挥杆分析的核心传感器，用于追踪运动轨迹、角速度和加速度。

---

## 我们的选择：LSM6DSV16X

!!! success "项目决策"
    详见 [ADR-0002: LSM6DSV16X IMU 选型](../../design/decisions/0002-lsm6dsv16x-imu.md)

### 核心规格

| 参数 | 规格 |
|-----|------|
| **加速度计** | ±2/±4/±8/±16g |
| **陀螺仪** | ±125/±250/±500/±1000/±2000 dps |
| **采样率** | 最高 6.6 kHz |
| **功耗** | 0.55 mA |
| **接口** | I²C / SPI |
| **温漂** | 45+ 分钟低漂移 |
| **特性** | MLC (机器学习核心) |
| **封装** | 2.5 × 3 × 0.83 mm |
| **价格** | ¥45-55 (LCSC) |

### 为什么选择 LSM6DSV16X

1. **超低功耗** - 0.55mA，适合可穿戴
2. **内置 MLC** - 硬件级运动识别
3. **极低温漂** - 45+ 分钟无需校准
4. **高精度** - 满足高尔夫挥杆 500+ dps 需求
5. **成熟生态** - ST 官方库 + Arduino 支持

---

## IMU 产品对比

### 高端选项

| 产品 | 加速度计 | 陀螺仪 | 特性 | 价格 | 适用场景 |
|-----|---------|--------|-----|------|---------|
| **LSM6DSV16X** | ±16g | ±2000 dps | MLC, 低温漂 | ¥45-55 | ✅ **生产首选** |
| **ICM-42688-P** | ±16g | ±2000 dps | 高采样率 | ¥30-40 | 成本敏感 |
| **BMI270** | ±16g | ±2000 dps | 可穿戴优化 | ¥25-35 | 低功耗场景 |

### 开发板选项

| 产品 | 传感器 | 接口 | 价格 | 适用场景 |
|-----|--------|-----|------|---------|
| **WitMotion WT901BLECL** | 9轴 | BLE 5.0 | ¥158 | ✅ **MVP 首选** |
| **WitMotion BWT901CL** | 9轴 | BLE 5.0 | ¥358 | 高精度需求 |
| **DFRobot SEN0386** | LSM6DSV16X | I²C | ¥89 | Arduino 开发 |
| **Adafruit LSM6DSV16X** | LSM6DSV16X | I²C/SPI | $12.50 | 快速原型 |

### 专业级方案

| 产品 | 特性 | 价格 | 适用场景 |
|-----|------|------|---------|
| **Shimmer3 IMU** | 研究级 | $600+ | 学术研究 |
| **Movella Xsens DOT** | 专业动捕 | $300+ | 专业运动分析 |
| **APDM Opal** | 临床级 | $1000+ | 医疗康复 |

---

## 数据访问

### SDK/API 可用性

| 供应商 | SDK | 语言支持 | 数据格式 | 开放程度 |
|-------|-----|---------|---------|---------|
| **WitMotion** | ✅ 开源 | Arduino, Python, C++ | 原始 + 四元数 | ⭐⭐⭐⭐⭐ |
| **ST (LSM6DSV16X)** | ✅ 官方 | C, Arduino | 原始 | ⭐⭐⭐⭐⭐ |
| **InvenSense** | ✅ 官方 | C | 原始 + DMP | ⭐⭐⭐⭐ |
| **Bosch (BMI270)** | ✅ 官方 | C | 原始 | ⭐⭐⭐⭐ |

### WitMotion 数据访问示例

```python
# Python SDK 示例
from witmotion import IMU

imu = IMU(port='/dev/ttyUSB0', baudrate=115200)

# 获取原始数据
acc = imu.get_acceleration()  # [ax, ay, az] in g
gyro = imu.get_gyroscope()    # [gx, gy, gz] in deg/s
angle = imu.get_angle()       # [roll, pitch, yaw] in degrees
quat = imu.get_quaternion()   # [w, x, y, z]

# 设置采样率
imu.set_output_rate(100)  # 100 Hz
```

```cpp
// Arduino 示例
#include <WitMotion.h>

WitMotion imu;

void setup() {
  imu.begin();
  imu.setOutputRate(100);  // 100 Hz
}

void loop() {
  if (imu.available()) {
    float ax = imu.getAccX();
    float ay = imu.getAccY();
    float az = imu.getAccZ();

    float gx = imu.getGyroX();
    float gy = imu.getGyroY();
    float gz = imu.getGyroZ();
  }
}
```

### BLE GATT 数据格式

```text
Service UUID: 0000FFE0-0000-1000-8000-00805F9B34FB
Characteristic UUID: 0000FFE4-0000-1000-8000-00805F9B34FB

数据包格式 (20 bytes):
┌────────┬────────┬────────┬────────┬────────┬────────┬────────┐
│ Header │  AccX  │  AccY  │  AccZ  │ GyroX  │ GyroY  │ GyroZ  │
│ (2B)   │ (3B)   │ (3B)   │ (3B)   │ (3B)   │ (3B)   │ (3B)   │
└────────┴────────┴────────┴────────┴────────┴────────┴────────┘
```

---

## 高尔夫挥杆应用

### 关键测量参数

| 参数 | 典型值 | 用途 |
|-----|-------|------|
| **挥杆速度** | 80-120 mph | 力量评估 |
| **杆头角速度** | 1500-2500 dps | 挥杆分析 |
| **上杆角度** | 270-300° | 动作一致性 |
| **下杆加速度** | 20-30g | 爆发力分析 |
| **撞击振动** | 特征频率 | 击球检测 |

### 传感器放置位置

```text
┌─────────────────────────────────────┐
│           高尔夫挥杆 IMU 放置        │
├─────────────────────────────────────┤
│                                     │
│  1. 手背 (Back of Hand)             │
│     - 测量: 手腕角度、挥杆路径       │
│     - 推荐: WT901BLECL              │
│                                     │
│  2. 前臂 (Forearm)                  │
│     - 测量: 手臂旋转、力量传递       │
│     - 推荐: LSM6DSV16X              │
│                                     │
│  3. 上臂 (Upper Arm)                │
│     - 测量: 肩部运动、挥杆平面       │
│     - 可选: 多传感器系统             │
│                                     │
│  4. 杆身 (Club Shaft)               │
│     - 测量: 杆头速度、撞击检测       │
│     - 推荐: 微型 IMU 贴片            │
│                                     │
└─────────────────────────────────────┘
```

---

## 供应商信息

### 芯片供应商

| 供应商 | 型号 | 价格 | 采购渠道 |
|-------|------|------|---------|
| **ST** | LSM6DSV16X | ¥45-55 | LCSC, Mouser, DigiKey |
| **TDK InvenSense** | ICM-42688-P | ¥30-40 | LCSC, Mouser |
| **Bosch** | BMI270 | ¥25-35 | LCSC, Mouser |
| **QST** | QMI8658C | ¥8-12 | LCSC |
| **MEMSIC** | MXC4005XC | ¥5-8 | LCSC |

### 模块供应商

| 供应商 | 产品 | 价格 | 联系方式 |
|-------|------|------|---------|
| **WitMotion** | WT901BLECL | ¥158 | wit-motion.cn |
| **DFRobot** | 多款 IMU 模块 | ¥50-200 | dfrobot.com.cn |
| **Seeed Studio** | Grove IMU | ¥60-120 | seeedstudio.com |

详细供应商信息请参见 [IMU 供应商大全](suppliers.md)

---

## 相关资源

- [ADR-0002: LSM6DSV16X 选型决策](../../design/decisions/0002-lsm6dsv16x-imu.md)
- [硬件比较](../../research/comparisons/hardware-comparison.md)
- [传感器硬件指南](../sensor-hardware-overview.md)
- [IMU 供应商](suppliers.md)
- [IMU 方案竞品](../../../research/competitors/imu-based.md)

---

**最后更新**: 2025 年 12 月 7 日
