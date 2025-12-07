# MCU 供应商大全

微控制器 (MCU) 芯片、模组和开发板供应商资源。

---

## 芯片供应商

### 乐鑫 (Espressif) ⭐⭐⭐⭐⭐

!!! success "项目首选"
    ESP32-S3 - 性价比最高的 BLE 5.0 方案

| 型号 | 核心 | 无线 | 价格 | 备注 |
|-----|------|-----|------|-----|
| **ESP32-S3** | 双核 240MHz | Wi-Fi + BLE 5.0 | ¥15-25 | ✅ 推荐 |
| ESP32-C3 | RISC-V 160MHz | Wi-Fi + BLE 5.0 | ¥8-12 | 成本优化 |
| ESP32-C6 | RISC-V 160MHz | Wi-Fi 6 + BLE 5.0 | ¥12-18 | Wi-Fi 6 |
| ESP32 (原版) | 双核 240MHz | Wi-Fi + BLE 4.2 | ¥10-15 | 经典款 |

**联系方式**:
- 官网: [espressif.com](https://espressif.com)
- 中文: [espressif.com/zh-hans](https://espressif.com/zh-hans)
- 开发框架: ESP-IDF, Arduino

---

### Nordic Semiconductor ⭐⭐⭐⭐

!!! info "超低功耗首选"

| 型号 | 核心 | 无线 | 价格 | 备注 |
|-----|------|-----|------|-----|
| **nRF52840** | Cortex-M4 64MHz | BLE 5.0 | ¥25-35 | 低功耗首选 |
| nRF52833 | Cortex-M4 64MHz | BLE 5.0 | ¥20-28 | 成本优化 |
| nRF5340 | 双核 | BLE 5.2 | ¥35-50 | 高性能 |

**联系方式**:
- 官网: [nordicsemi.com](https://nordicsemi.com)
- SDK: nRF Connect SDK

---

### ST Microelectronics ⭐⭐⭐⭐

| 型号 | 核心 | 无线 | 价格 | 备注 |
|-----|------|-----|------|-----|
| **STM32WB55** | M4 + M0 | BLE 5.0 | ¥30-45 | 双核架构 |
| STM32WB15 | M0+ | BLE 5.0 | ¥15-25 | 入门 |
| STM32WBA52 | M33 | BLE 5.3 | ¥40-55 | 最新 |

**联系方式**:
- 官网: [st.com](https://st.com)
- 开发: STM32CubeIDE

---

## 模组供应商

### ESP32-S3 模组

| 模组 | 内存 | Flash | 天线 | 价格 |
|-----|------|-------|-----|------|
| **ESP32-S3-WROOM-1** | 512KB + 8MB | 16MB | PCB | ¥28-35 |
| ESP32-S3-WROOM-1-N16R8 | 512KB + 8MB | 16MB | PCB | ¥32-40 |
| ESP32-S3-MINI-1 | 512KB | 8MB | PCB | ¥20-25 |

**采购渠道**:
- LCSC: [lcsc.com](https://lcsc.com)
- 淘宝: 乐鑫官方店
- Mouser: [mouser.cn](https://mouser.cn)

---

### nRF 模组

| 模组 | 芯片 | 天线 | 价格 | 供应商 |
|-----|------|-----|------|-------|
| MDBT50Q | nRF52840 | 板载 | ¥40-55 | Raytac |
| E73-2G4M08S1C | nRF52840 | IPEX | ¥25-35 | 亿佰特 |
| BL654 | nRF52840 | 板载 | ¥50-70 | Laird |

**采购渠道**:
- LCSC
- DigiKey
- 淘宝 (亿佰特店)

---

## 开发板供应商

### 官方开发板

| 开发板 | MCU | 特性 | 价格 | 供应商 |
|-------|-----|-----|------|-------|
| **ESP32-S3-DevKitC-1** | ESP32-S3 | USB OTG | ¥50-80 | 乐鑫 |
| **nRF52840 DK** | nRF52840 | 调试器 | ¥350 | Nordic |
| NUCLEO-WB55RG | STM32WB55 | ST-Link | ¥180 | ST |

### 第三方开发板

| 开发板 | MCU | 特性 | 价格 | 供应商 |
|-------|-----|-----|------|-------|
| **Seeed XIAO ESP32S3** | ESP32-S3 | 超小型 | ¥60 | Seeed |
| Adafruit QT Py ESP32-S3 | ESP32-S3 | Stemma QT | $13 | Adafruit |
| SparkFun Thing Plus | nRF52840 | Qwiic | $25 | SparkFun |
| DFRobot FireBeetle 2 | ESP32-S3 | 低功耗 | ¥80 | DFRobot |

---

## 供应商详情

### Seeed Studio ⭐⭐⭐⭐

| 产品 | 特性 | 价格 | 备注 |
|-----|------|------|-----|
| **XIAO ESP32S3** | 21×17.8mm | ¥60 | 超小型 |
| XIAO ESP32S3 Sense | 带摄像头 | ¥85 | AI 视觉 |
| XIAO nRF52840 | 低功耗 | ¥65 | BLE |

**联系方式**:
- 官网: [seeedstudio.com](https://seeedstudio.com)
- 淘宝: Seeed 官方店

---

### DFRobot ⭐⭐⭐⭐

| 产品 | 特性 | 价格 | 备注 |
|-----|------|------|-----|
| **FireBeetle 2 ESP32-S3** | 低功耗设计 | ¥80 | 推荐 |
| Beetle ESP32-C3 | 超小型 | ¥35 | 成本优化 |
| Romeo BLE | Arduino + BLE | ¥150 | 机器人 |

**联系方式**:
- 官网: [dfrobot.com.cn](https://dfrobot.com.cn)
- QQ 群: 技术支持

---

### Adafruit ⭐⭐⭐⭐

| 产品 | 特性 | 价格 | 备注 |
|-----|------|------|-----|
| **QT Py ESP32-S3** | Stemma QT | $13 | 快速原型 |
| Feather ESP32-S3 | 大尺寸 | $18 | 完整功能 |
| ItsyBitsy nRF52840 | 低功耗 | $18 | BLE 专用 |

**联系方式**:
- 官网: [adafruit.com](https://adafruit.com)
- 学习: [learn.adafruit.com](https://learn.adafruit.com)

---

### SparkFun ⭐⭐⭐⭐

| 产品 | 特性 | 价格 | 备注 |
|-----|------|------|-----|
| **Thing Plus ESP32-S3** | Qwiic | $25 | 生态丰富 |
| Pro nRF52840 Mini | 低功耗 | $25 | 可穿戴 |
| MicroMod ESP32 | 模块化 | $17 | 灵活 |

**联系方式**:
- 官网: [sparkfun.com](https://sparkfun.com)
- Hookup Guide: 详细教程

---

## 价格对比

### 芯片价格

| 芯片 | LCSC | Mouser | DigiKey |
|-----|------|--------|---------|
| ESP32-S3-WROOM-1 | ¥28 | $3.50 | $3.50 |
| nRF52840 | ¥30 | $4.00 | $4.00 |
| STM32WB55CGU6 | ¥35 | $5.00 | $5.00 |

### 开发板价格

| 开发板 | 官方价 | 淘宝价 |
|-------|-------|-------|
| ESP32-S3-DevKitC | ¥65 | ¥50 |
| Seeed XIAO ESP32S3 | ¥60 | ¥55 |
| nRF52840 DK | ¥350 | ¥320 |

---

## 采购渠道

### 芯片采购

| 渠道 | 优势 | 适用 | 网址 |
|-----|------|-----|-----|
| **LCSC** | 价格最低 | 量产 | lcsc.com |
| **Mouser** | 正品保证 | 原型 | mouser.cn |
| **DigiKey** | 技术支持 | 开发 | digikey.cn |
| **淘宝** | 方便 | 小批量 | taobao.com |

### 开发板采购

| 渠道 | 优势 | 网址 |
|-----|------|-----|
| **乐鑫淘宝店** | 官方 | 搜索 "乐鑫官方" |
| **Seeed 官方店** | 正品 | seeedstudio.com |
| **DFRobot** | 教程丰富 | dfrobot.com.cn |

---

## MVP 采购建议

### 方案 A: 最低成本 (¥50)

| 组件 | 产品 | 价格 |
|-----|------|------|
| 开发板 | ESP32-S3-DevKitC | ¥50 |

### 方案 B: 超小型 (¥60)

| 组件 | 产品 | 价格 |
|-----|------|------|
| 开发板 | Seeed XIAO ESP32S3 | ¥60 |

### 方案 C: 低功耗 (¥350)

| 组件 | 产品 | 价格 |
|-----|------|------|
| 开发板 | nRF52840 DK | ¥350 |

---

## 量产采购

### 芯片选型

| 场景 | 推荐芯片 | 单价 (1K+) |
|-----|---------|-----------|
| 高性能 + Wi-Fi | ESP32-S3-WROOM-1 | ¥20-25 |
| 超低功耗 | nRF52840 | ¥22-28 |
| 成本敏感 | ESP32-C3 | ¥6-8 |

### 供应商建议

| 数量 | 推荐渠道 |
|-----|---------|
| 1-100 | 淘宝/LCSC |
| 100-1K | LCSC 询价 |
| 1K+ | 原厂/代理 |

---

## 相关资源

- [MCU 技术详解](../sensors/mcu.md)
- [硬件比较](../resources/hardware-comparison.md)
- [ADR-0005: ESP32-S3 选型](../decisions/0005-esp32-s3-microcontroller.md)

---

**最后更新**: 2025 年 12 月 7 日
