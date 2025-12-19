# IMU 供应商大全

惯性测量单元 (IMU) 芯片、模块和开发板供应商资源。

---

## 芯片供应商

### 推荐芯片

| 供应商 | 型号 | 规格 | 价格 | 评级 |
|-------|------|-----|------|-----|
| **ST Microelectronics** | LSM6DSV16X | 6轴, MLC, 0.55mA | ¥45-55 | ⭐⭐⭐⭐⭐ |
| **TDK InvenSense** | ICM-42688-P | 6轴, 6.6kHz | ¥30-40 | ⭐⭐⭐⭐ |
| **Bosch** | BMI270 | 6轴, 可穿戴优化 | ¥25-35 | ⭐⭐⭐⭐ |
| **ST** | LSM6DSO | 6轴, 入门级 | ¥20-30 | ⭐⭐⭐⭐ |

### 国产替代

| 供应商 | 型号 | 规格 | 价格 | 评级 |
|-------|------|-----|------|-----|
| **QST** | QMI8658C | 6轴 | ¥8-12 | ⭐⭐⭐ |
| **MEMSIC** | MXC4005XC | 3轴加速度 | ¥5-8 | ⭐⭐⭐ |
| **Senodia** | SH3001 | 6轴 | ¥6-10 | ⭐⭐⭐ |

### 采购渠道

| 芯片 | LCSC | Mouser | DigiKey |
|-----|------|--------|---------|
| LSM6DSV16X | ✅ ¥45 | ✅ $5.50 | ✅ $5.50 |
| ICM-42688-P | ✅ ¥30 | ✅ $4.00 | ✅ $4.00 |
| BMI270 | ✅ ¥25 | ✅ $3.50 | ✅ $3.50 |
| QMI8658C | ✅ ¥8 | ❌ | ❌ |

---

## 模块供应商

### WitMotion (维特智能) ⭐⭐⭐⭐⭐

!!! success "MVP 首选"
    开源 SDK、BLE 5.0、性价比高

| 产品 | 传感器 | 接口 | 价格 | 适用场景 |
|-----|-------|-----|------|---------|
| **WT901BLECL** | 9轴 | BLE 5.0 | ¥158 | ✅ MVP 首选 |
| **BWT901CL** | 9轴 | BLE 5.0 | ¥358 | 高精度 |
| **WT901C-485** | 9轴 | RS485 | ¥298 | 工业应用 |
| **WT901C-TTL** | 9轴 | TTL | ¥198 | 嵌入式 |

**联系方式**:

- 官网: [wit-motion.cn](https://wit-motion.cn)
- 淘宝店: 搜索 "WitMotion 官方店"
- SDK: [GitHub - WitMotion](https://github.com/witmotion)

**SDK 支持**:

```python
# Python SDK 安装
pip install witmotion

# 示例代码
from witmotion import IMU
imu = IMU(port='/dev/ttyUSB0')
acc = imu.get_acceleration()
```

---

### DFRobot ⭐⭐⭐⭐

| 产品 | 传感器 | 接口 | 价格 | 备注 |
|-----|-------|-----|------|-----|
| SEN0386 | LSM6DSV16X | I²C | ¥89 | 推荐 |
| SEN0250 | BMI160 | I²C | ¥69 | 入门 |
| SEN0364 | ICM-42688-P | SPI | ¥79 | 高速 |

**联系方式**:

- 官网: [dfrobot.com.cn](https://www.dfrobot.com.cn)
- QQ 群: 技术交流群
- Wiki: [wiki.dfrobot.com.cn](https://wiki.dfrobot.com.cn)

---

### Adafruit ⭐⭐⭐⭐

| 产品 | 传感器 | 接口 | 价格 | 备注 |
|-----|-------|-----|------|-----|
| 4438 | LSM6DSV16X | Stemma QT | $12.50 | 推荐 |
| 4502 | ICM-20948 | Stemma QT | $14.95 | 9轴 |
| 4517 | BNO085 | Stemma QT | $19.95 | 融合算法 |

**联系方式**:

- 官网: [adafruit.com](https://adafruit.com)
- 文档: [learn.adafruit.com](https://learn.adafruit.com)

---

### SparkFun ⭐⭐⭐⭐

| 产品 | 传感器 | 接口 | 价格 | 备注 |
|-----|-------|-----|------|-----|
| SEN-22395 | LSM6DSO | Qwiic | $10.95 | 入门 |
| SEN-18020 | ICM-20948 | Qwiic | $16.95 | 9轴 |
| SEN-15335 | BNO080 | Qwiic | $24.95 | VR 级 |

**联系方式**:

- 官网: [sparkfun.com](https://sparkfun.com)
- Hookup Guide: 每款产品都有详细教程

---

## 专业级供应商

### Shimmer Research ⭐⭐⭐⭐

!!! info "研究级方案"
    适合学术研究、临床试验

| 产品 | 特性 | 价格 | 适用 |
|-----|------|------|-----|
| **Shimmer3 IMU** | 9轴 + 压力 + 温度 | $600+ | 研究级 |
| **Shimmer3 GSR+** | IMU + 皮电 | $800+ | 情绪研究 |
| **Consensys** | 多传感器同步 | $2,500+ | 多人同步 |

**联系方式**:

- 官网: [shimmersensing.com](https://shimmersensing.com)
- 邮箱: <info@shimmersensing.com>
- SDK: ConsensysPRO

---

### Movella (Xsens) ⭐⭐⭐⭐

| 产品 | 特性 | 价格 | 适用 |
|-----|------|------|-----|
| **Xsens DOT** | 5 传感器套件 | $1,500+ | 专业动捕 |
| **MTi-630** | 工业级 IMU | $1,000+ | 高精度 |
| **MVN** | 全身动捕套装 | $5,000+ | 影视/游戏 |

**联系方式**:

- 官网: [movella.com](https://movella.com)
- SDK: Xsens SDK

---

### APDM/Clario (临床级) ⭐⭐⭐

| 产品 | 特性 | 价格 | 适用 |
|-----|------|------|-----|
| **Opal** | 6 传感器 + 无线 | $5,000+ | 临床步态分析 |
| **Emerald** | 2 传感器 | $1,500+ | 帕金森评估 |

**联系方式**:

- 官网: [apdm.com](https://apdm.com)

---

## 国产芯片供应商

### QST (矽睿科技) ⭐⭐⭐

| 型号 | 规格 | 价格 | 备注 |
|-----|------|------|-----|
| QMI8658C | 6轴, 可穿戴 | ¥8-12 | 低成本方案 |
| QMC5883L | 3轴磁力计 | ¥3-5 | 配合使用 |

**联系方式**:

- 官网: [qstcorp.com](https://www.qstcorp.com)
- 代理: LCSC

---

### MEMSIC (美新半导体) ⭐⭐⭐

| 型号 | 规格 | 价格 | 备注 |
|-----|------|------|-----|
| MXC4005XC | 3轴加速度 | ¥5-8 | 超低成本 |
| MMC5983MA | 3轴磁力计 | ¥5-8 | 高精度磁力计 |

**联系方式**:

- 官网: [memsic.com](https://www.memsic.com)

---

## 价格对比表

### 芯片级别

| 型号 | LCSC | Mouser | 国内淘宝 |
|-----|------|--------|---------|
| LSM6DSV16X | ¥45 | $5.50 | ¥50 |
| ICM-42688-P | ¥30 | $4.00 | ¥35 |
| BMI270 | ¥25 | $3.50 | ¥30 |
| QMI8658C | ¥8 | - | ¥10 |

### 模块级别

| 产品 | 官方价 | 淘宝价 | 备注 |
|-----|-------|-------|-----|
| WitMotion WT901BLECL | ¥158 | ¥150 | BLE 模块 |
| DFRobot SEN0386 | ¥89 | ¥85 | 开发板 |
| Adafruit LSM6DSV16X | $12.50 | ¥100+ | 进口 |

---

## 批量采购

### 小批量 (1-100 片)

| 渠道 | 优势 | MOQ | 交期 |
|-----|------|-----|------|
| **淘宝** | 方便 | 1 | 3-5天 |
| **LCSC** | 价格 | 1 | 3-7天 |
| **Mouser** | 正品 | 1 | 7-14天 |

### 量产 (1000+ 片)

| 渠道 | 优势 | 备注 |
|-----|------|-----|
| **LCSC** | 价格最优 | 联系客服询价 |
| **芯片代理** | 技术支持 | Arrow, Avnet |
| **原厂** | 定制支持 | ST, TDK 中国区 |

---

## 相关资源

- [IMU 技术详解](hardware.md)
- [ADR-0002: LSM6DSV16X 选型](../../design/decisions/0002-lsm6dsv16x-imu.md)
- [IMU 方案竞品](../../business-plan/competitors/imu-based.md)

---

**最后更新**: 2025 年 12 月 12 日
