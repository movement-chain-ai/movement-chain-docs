# MCU 微控制器

微控制器 (Microcontroller Unit) 是传感器数据采集、处理和传输的核心，负责整合所有传感器数据。

---

## 我们的选择：ESP32-S3

!!! success "项目决策"
    详见 [ADR-0005: ESP32-S3 微控制器选型](../../design/archive/decisions/0005-esp32-s3-microcontroller.md)

### 核心规格

| 参数 | 规格 |
|-----|------|
| **CPU** | Xtensa® 双核 LX7, 240 MHz |
| **内存** | 512 KB SRAM + 8 MB PSRAM (可选) |
| **Flash** | 4-16 MB |
| **无线** | Wi-Fi 802.11 b/g/n + BLE 5.0 |
| **GPIO** | 45 个 |
| **ADC** | 2 × 12-bit SAR ADC, 20 通道 |
| **I²C/SPI** | 多个 |
| **功耗** | ~240 mA (Wi-Fi), ~100 mA (BLE) |
| **价格** | $2.50-3.50 |

### 为什么选择 ESP32-S3

| 优势 | 说明 |
|-----|------|
| **BLE 5.0** | 高速低功耗蓝牙，适合可穿戴 |
| **双核 CPU** | 一核采集，一核处理 |
| **丰富 ADC** | 可同时采集多路传感器 |
| **AI 加速** | 向量指令，适合边缘 AI |
| **成熟生态** | Arduino + ESP-IDF + PlatformIO |
| **低成本** | $2.50-3.50，量产友好 |

---

## MCU 产品对比

### 主流方案对比

| MCU | 核心 | 无线 | ADC | 价格 | 适用场景 |
|-----|------|-----|-----|------|---------|
| **ESP32-S3** | 双核 240MHz | Wi-Fi + BLE 5.0 | 12-bit × 20 | $2.50-3.50 | ✅ **首选** |
| **nRF52840** | Cortex-M4 64MHz | BLE 5.0 | 12-bit × 8 | $3.50-5.00 | 超低功耗 |
| **STM32WB55** | Cortex-M4 + M0 | BLE 5.0 | 12-bit × 19 | $4.00-6.00 | 高性能 |
| **ESP32-C3** | RISC-V 160MHz | Wi-Fi + BLE 5.0 | 12-bit × 6 | $1.50-2.00 | 成本敏感 |

### 开发板推荐

| 开发板 | MCU | 特性 | 价格 | 适用 |
|-------|-----|-----|------|-----|
| **ESP32-S3-DevKitC-1** | ESP32-S3-WROOM-1 | 官方开发板 | ¥50-80 | ✅ **MVP 首选** |
| **Seeed XIAO ESP32S3** | ESP32-S3 | 超小型 | ¥60 | 空间受限 |
| **Adafruit QT Py ESP32-S3** | ESP32-S3 | Stemma QT | $13 | 快速原型 |
| **Nordic nRF52840 DK** | nRF52840 | 专业开发 | $50 | 低功耗项目 |

### 模组对比

| 模组 | 内存 | Flash | 天线 | 价格 | 备注 |
|-----|------|-------|-----|------|-----|
| **ESP32-S3-WROOM-1** | 512KB + 8MB PSRAM | 16MB | PCB | ¥28-35 | ✅ **推荐** |
| **ESP32-S3-MINI-1** | 512KB | 8MB | PCB | ¥20-25 | 成本优化 |
| **ESP32-S3-WROOM-2** | 512KB + 8MB | 32MB | PCB | ¥40-50 | 大存储 |

---

## 数据采集架构

### 多传感器采集

```text
┌─────────────────────────────────────────────────────────────┐
│                    ESP32-S3 传感器采集架构                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      ┌──────────────┐                       │
│                      │   ESP32-S3   │                       │
│                      │              │                       │
│  ┌────────────┐      │  ┌────────┐  │                       │
│  │ LSM6DSV16X │─I²C──│──│ Core 0 │  │                       │
│  │   (IMU)    │      │  │(采集)  │  │                       │
│  └────────────┘      │  └────────┘  │                       │
│                      │      │       │                       │
│  ┌────────────┐      │      ▼       │                       │
│  │ EMG × 2    │─ADC──│  ┌────────┐  │      ┌────────────┐  │
│  │ (DFRobot)  │      │  │ 数据   │  │      │            │  │
│  └────────────┘      │  │ 缓冲   │  │─BLE──│  移动设备   │  │
│                      │  └────────┘  │      │  (Flutter) │  │
│  ┌────────────┐      │      │       │      │            │  │
│  │ FSR × 8    │─ADC──│      ▼       │      └────────────┘  │
│  │ (压力)     │      │  ┌────────┐  │                       │
│  └────────────┘      │  │ Core 1 │  │                       │
│                      │  │(处理)  │  │                       │
│                      │  └────────┘  │                       │
│                      │              │                       │
│                      └──────────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 双核任务分配

```cpp
// 核心 0: 传感器采集 (高优先级)
void sensorTask(void* pvParameters) {
  for (;;) {
    // 读取 IMU (100 Hz)
    readIMU();

    // 读取 EMG (1000 Hz - 通过定时器中断)
    // 在中断中处理

    // 读取压力传感器 (100 Hz)
    readPressure();

    // 打包数据
    packSensorData();

    vTaskDelay(pdMS_TO_TICKS(10));  // 100 Hz
  }
}

// 核心 1: 数据处理和传输
void processTask(void* pvParameters) {
  for (;;) {
    // 等待数据
    if (xQueueReceive(dataQueue, &sensorData, portMAX_DELAY)) {
      // 数据预处理
      preprocess(&sensorData);

      // BLE 发送
      sendBLE(&sensorData);
    }
  }
}

void setup() {
  xTaskCreatePinnedToCore(sensorTask, "Sensor", 4096, NULL, 2, NULL, 0);
  xTaskCreatePinnedToCore(processTask, "Process", 4096, NULL, 1, NULL, 1);
}
```

---

## BLE 通信协议

### GATT 服务设计

```text
Movement Chain AI - BLE GATT Profile
=====================================

Service: Motion Data Service
UUID: 0000FFE0-0000-1000-8000-00805F9B34FB

├── Characteristic: IMU Data
│   UUID: 0000FFE1-0000-1000-8000-00805F9B34FB
│   Properties: Notify
│   Value: 20 bytes
│   ├── Timestamp (4 bytes, uint32_t, ms)
│   ├── AccX (2 bytes, int16_t, 0.001g)
│   ├── AccY (2 bytes, int16_t, 0.001g)
│   ├── AccZ (2 bytes, int16_t, 0.001g)
│   ├── GyroX (2 bytes, int16_t, 0.01 dps)
│   ├── GyroY (2 bytes, int16_t, 0.01 dps)
│   ├── GyroZ (2 bytes, int16_t, 0.01 dps)
│   └── Reserved (4 bytes)
│
├── Characteristic: EMG Data
│   UUID: 0000FFE2-0000-1000-8000-00805F9B34FB
│   Properties: Notify
│   Value: 12 bytes
│   ├── Timestamp (4 bytes, uint32_t, ms)
│   ├── Channel 1 (2 bytes, uint16_t)
│   ├── Channel 2 (2 bytes, uint16_t)
│   ├── Channel 3 (2 bytes, uint16_t)
│   └── Channel 4 (2 bytes, uint16_t)
│
├── Characteristic: Pressure Data
│   UUID: 0000FFE3-0000-1000-8000-00805F9B34FB
│   Properties: Notify
│   Value: 20 bytes
│   ├── Timestamp (4 bytes, uint32_t, ms)
│   └── Pressure[8] (16 bytes, uint16_t × 8)
│
└── Characteristic: Config
    UUID: 0000FFE4-0000-1000-8000-00805F9B34FB
    Properties: Read, Write
    Value: 8 bytes
    ├── Sample Rate (2 bytes, uint16_t, Hz)
    ├── Active Sensors (1 byte, bitmask)
    └── Reserved (5 bytes)
```

### ESP32-S3 BLE 实现

```cpp
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define SERVICE_UUID        "0000FFE0-0000-1000-8000-00805F9B34FB"
#define IMU_CHAR_UUID       "0000FFE1-0000-1000-8000-00805F9B34FB"
#define EMG_CHAR_UUID       "0000FFE2-0000-1000-8000-00805F9B34FB"
#define PRESSURE_CHAR_UUID  "0000FFE3-0000-1000-8000-00805F9B34FB"

BLECharacteristic* imuCharacteristic;
BLECharacteristic* emgCharacteristic;
BLECharacteristic* pressureCharacteristic;

bool deviceConnected = false;

class ServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
    }
    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      BLEDevice::startAdvertising();
    }
};

void setupBLE() {
  BLEDevice::init("MovementChain-Golf");
  BLEServer* pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  BLEService* pService = pServer->createService(SERVICE_UUID);

  // IMU Characteristic
  imuCharacteristic = pService->createCharacteristic(
    IMU_CHAR_UUID,
    BLECharacteristic::PROPERTY_NOTIFY
  );
  imuCharacteristic->addDescriptor(new BLE2902());

  // EMG Characteristic
  emgCharacteristic = pService->createCharacteristic(
    EMG_CHAR_UUID,
    BLECharacteristic::PROPERTY_NOTIFY
  );
  emgCharacteristic->addDescriptor(new BLE2902());

  // Pressure Characteristic
  pressureCharacteristic = pService->createCharacteristic(
    PRESSURE_CHAR_UUID,
    BLECharacteristic::PROPERTY_NOTIFY
  );
  pressureCharacteristic->addDescriptor(new BLE2902());

  pService->start();

  BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->start();
}

void sendIMUData(float ax, float ay, float az, float gx, float gy, float gz) {
  if (!deviceConnected) return;

  uint8_t data[20];
  uint32_t timestamp = millis();

  memcpy(&data[0], &timestamp, 4);

  int16_t accX = (int16_t)(ax * 1000);  // 0.001g
  int16_t accY = (int16_t)(ay * 1000);
  int16_t accZ = (int16_t)(az * 1000);
  int16_t gyroX = (int16_t)(gx * 100);  // 0.01 dps
  int16_t gyroY = (int16_t)(gy * 100);
  int16_t gyroZ = (int16_t)(gz * 100);

  memcpy(&data[4], &accX, 2);
  memcpy(&data[6], &accY, 2);
  memcpy(&data[8], &accZ, 2);
  memcpy(&data[10], &gyroX, 2);
  memcpy(&data[12], &gyroY, 2);
  memcpy(&data[14], &gyroZ, 2);

  imuCharacteristic->setValue(data, 20);
  imuCharacteristic->notify();
}
```

---

## 电源管理

### 功耗估算

| 状态 | 电流 | 说明 |
|-----|------|------|
| **活跃 (BLE 传输)** | ~100 mA | 持续采集和传输 |
| **活跃 (Wi-Fi)** | ~240 mA | Wi-Fi 数据上传 |
| **轻睡眠** | ~2 mA | 保持 BLE 连接 |
| **深睡眠** | ~10 μA | 定时唤醒 |

### 电池续航估算

| 电池容量 | 活跃模式 | 间歇使用 |
|---------|---------|---------|
| **500 mAh** | ~5 小时 | ~10 小时 |
| **1000 mAh** | ~10 小时 | ~20 小时 |
| **2000 mAh** | ~20 小时 | ~40 小时 |

### 电源电路设计

```text
电池管理电路 (3.7V LiPo)

       VBAT                           VCC (3.3V)
         │                               │
         │    ┌──────────────────┐       │
         └────┤ TP4056          ├───────┘
              │ (充电管理)       │
              │                  │
    USB ──────┤                  ├─────── GND
    (5V)      │                  │
              └──────────────────┘
                      │
                      │ BAT
                      │
              ┌───────┴───────┐
              │   LiPo 电池    │
              │  (3.7V 1000mAh)│
              └───────────────┘
                      │
              ┌───────┴───────┐
              │   RT9013      │
              │ (LDO 3.3V)    │
              └───────┬───────┘
                      │
                    3.3V → ESP32-S3
```

---

## 供应商信息

### 芯片供应商

| 供应商 | 型号 | 价格 | 采购渠道 |
|-------|------|------|---------|
| **乐鑫 (Espressif)** | ESP32-S3-WROOM-1 | ¥28-35 | LCSC, Mouser |
| **Nordic** | nRF52840 | ¥30-45 | LCSC, DigiKey |
| **ST** | STM32WB55 | ¥35-50 | LCSC, Mouser |

### 开发板供应商

| 供应商 | 产品 | 价格 | 获取渠道 |
|-------|------|------|---------|
| **乐鑫官方** | ESP32-S3-DevKitC | ¥50-80 | 淘宝/官网 |
| **Seeed Studio** | XIAO ESP32S3 | ¥60 | seeedstudio.com |
| **DFRobot** | FireBeetle 2 | ¥80 | dfrobot.com.cn |

详细供应商信息请参见 [MCU 供应商](suppliers.md)

---

## 相关资源

- [ADR-0005: ESP32-S3 选型](../../design/archive/decisions/0005-esp32-s3-microcontroller.md)
- [硬件比较](../../research/comparisons/hardware-comparison.md)
- [传感器硬件指南](../sensor-hardware-overview.md)
- [MCU 供应商](suppliers.md)

---

**最后更新**: 2025 年 12 月 7 日
