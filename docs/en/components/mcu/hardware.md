# MCU Microcontroller

The Microcontroller Unit (MCU) is the core for sensor data acquisition, processing, and transmission, responsible for integrating all sensor data.

---

## Our Choice: ESP32-S3

!!! success "Project Decision"
    ADR-0005: ESP32-S3 Microcontroller Selection

### Core Specifications

| Parameter | Specification |
|-----|------|
| **CPU** | Xtensa® Dual-core LX7, 240 MHz |
| **Memory** | 512 KB SRAM + 8 MB PSRAM (optional) |
| **Flash** | 4-16 MB |
| **Wireless** | Wi-Fi 802.11 b/g/n + BLE 5.0 |
| **GPIO** | 45 pins |
| **ADC** | 2 × 12-bit SAR ADC, 20 channels |
| **I²C/SPI** | Multiple |
| **Power Consumption** | ~240 mA (Wi-Fi), ~100 mA (BLE) |
| **Price** | $2.50-3.50 |

### Why ESP32-S3

!!! info "Selection Details"
    For detailed selection analysis and comparison, see ADR-0005 ESP32-S3 Microcontroller Selection

**Core Advantages**: BLE 5.0 + WiFi dual-mode, 240MHz dual-core processor, 8MB PSRAM supports edge ML inference.

---

## MCU Product Comparison

### Mainstream Solutions Comparison

| MCU | Core | Wireless | ADC | Price | Use Case |
|-----|------|-----|-----|------|---------|
| **ESP32-S3** | Dual-core 240MHz | Wi-Fi + BLE 5.0 | 12-bit × 20 | $2.50-3.50 | ✅ **First Choice** |
| **nRF52840** | Cortex-M4 64MHz | BLE 5.0 | 12-bit × 8 | $3.50-5.00 | Ultra Low Power |
| **STM32WB55** | Cortex-M4 + M0 | BLE 5.0 | 12-bit × 19 | $4.00-6.00 | High Performance |
| **ESP32-C3** | RISC-V 160MHz | Wi-Fi + BLE 5.0 | 12-bit × 6 | $1.50-2.00 | Cost Sensitive |

### Recommended Development Boards

| Dev Board | MCU | Features | Price | Suitable For |
|-------|-----|-----|------|-----|
| **ESP32-S3-DevKitC-1** | ESP32-S3-WROOM-1 | Official dev board | ¥50-80 | ✅ **MVP Choice** |
| **Seeed XIAO ESP32S3** | ESP32-S3 | Ultra compact | ¥60 | Space Constrained |
| **Adafruit QT Py ESP32-S3** | ESP32-S3 | Stemma QT | $13 | Rapid Prototyping |
| **Nordic nRF52840 DK** | nRF52840 | Professional Dev | $50 | Low Power Projects |

### Module Comparison

| Module | Memory | Flash | Antenna | Price | Notes |
|-----|------|-------|-----|------|-----|
| **ESP32-S3-WROOM-1** | 512KB + 8MB PSRAM | 16MB | PCB | ¥28-35 | ✅ **Recommended** |
| **ESP32-S3-MINI-1** | 512KB | 8MB | PCB | ¥20-25 | Cost Optimized |
| **ESP32-S3-WROOM-2** | 512KB + 8MB | 32MB | PCB | ¥40-50 | Large Storage |

---

## Data Acquisition Architecture

### Multi-Sensor Acquisition

```text
┌─────────────────────────────────────────────────────────────┐
│                    ESP32-S3 Sensor Acquisition Architecture │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                      ┌──────────────┐                       │
│                      │   ESP32-S3   │                       │
│                      │              │                       │
│  ┌────────────┐      │  ┌────────┐  │                       │
│  │ LSM6DSV16X │─I²C──│──│ Core 0 │  │                       │
│  │   (IMU)    │      │  │(Acquire)│  │                       │
│  └────────────┘      │  └────────┘  │                       │
│                      │      │       │                       │
│  ┌────────────┐      │      ▼       │                       │
│  │ EMG × 2    │─ADC──│  ┌────────┐  │      ┌────────────┐  │
│  │ (DFRobot)  │      │  │  Data  │  │      │            │  │
│  └────────────┘      │  │ Buffer │  │─BLE──│   Mobile   │  │
│                      │  └────────┘  │      │  (Flutter) │  │
│  ┌────────────┐      │      │       │      │            │  │
│  │ FSR × 8    │─ADC──│      ▼       │      └────────────┘  │
│  │(Pressure)  │      │  ┌────────┐  │                       │
│  └────────────┘      │  │ Core 1 │  │                       │
│                      │  │(Process)│  │                       │
│                      │  └────────┘  │                       │
│                      │              │                       │
│                      └──────────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Dual-Core Task Allocation

```cpp
// Core 0: Sensor acquisition (high priority)
void sensorTask(void* pvParameters) {
  for (;;) {
    // Read IMU (100 Hz)
    readIMU();

    // Read EMG (1000 Hz - via timer interrupt)
    // Handled in interrupt

    // Read pressure sensors (100 Hz)
    readPressure();

    // Pack data
    packSensorData();

    vTaskDelay(pdMS_TO_TICKS(10));  // 100 Hz
  }
}

// Core 1: Data processing and transmission
void processTask(void* pvParameters) {
  for (;;) {
    // Wait for data
    if (xQueueReceive(dataQueue, &sensorData, portMAX_DELAY)) {
      // Data preprocessing
      preprocess(&sensorData);

      // BLE send
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

## BLE Communication Protocol

### GATT Service Design

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

### ESP32-S3 BLE Implementation

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

## Power Management

### Power Consumption Estimation

| State | Current | Description |
|-----|------|------|
| **Active (BLE Transmission)** | ~100 mA | Continuous acquisition and transmission |
| **Active (Wi-Fi)** | ~240 mA | Wi-Fi data upload |
| **Light Sleep** | ~2 mA | Maintain BLE connection |
| **Deep Sleep** | ~10 μA | Timed wake-up |

### Battery Life Estimation

| Battery Capacity | Active Mode | Intermittent Use |
|---------|---------|---------|
| **500 mAh** | ~5 hours | ~10 hours |
| **1000 mAh** | ~10 hours | ~20 hours |
| **2000 mAh** | ~20 hours | ~40 hours |

### Power Circuit Design

```text
Battery Management Circuit (3.7V LiPo)

       VBAT                           VCC (3.3V)
         │                               │
         │    ┌──────────────────┐       │
         └────┤ TP4056          ├───────┘
              │ (Charge Mgmt)    │
              │                  │
    USB ──────┤                  ├─────── GND
    (5V)      │                  │
              └──────────────────┘
                      │
                      │ BAT
                      │
              ┌───────┴───────┐
              │   LiPo Battery│
              │ (3.7V 1000mAh)│
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

## Supplier Information

### Chip Suppliers

| Supplier | Model | Price | Purchase Channel |
|-------|------|------|---------|
| **Espressif** | ESP32-S3-WROOM-1 | ¥28-35 | LCSC, Mouser |
| **Nordic** | nRF52840 | ¥30-45 | LCSC, DigiKey |
| **ST** | STM32WB55 | ¥35-50 | LCSC, Mouser |

### Development Board Suppliers

| Supplier | Product | Price | Availability |
|-------|------|------|---------|
| **Espressif Official** | ESP32-S3-DevKitC | ¥50-80 | Taobao/Official Site |
| **Seeed Studio** | XIAO ESP32S3 | ¥60 | seeedstudio.com |
| **DFRobot** | FireBeetle 2 | ¥80 | dfrobot.com.cn |

For detailed supplier information, see the [MVP Suppliers Guide](../supply-chain/mvp-suppliers.md)

---

## MVP Bill of Materials (BOM)

| Component | Part Number | Qty | Unit Price | Total |
|-----|-------|-----|------|------|
| **ESP32-S3 Module** | ESP32-S3-WROOM-1-N8R8 | 1 | $3.50 | $3.50 |
| **IMU Sensor** | LSM6DSV16X | 1 | $6.50 | $6.50 |
| **EMG Amplifier** | INA128 | 2 | $3.00 | $6.00 |
| Dry Electrodes | Ag/AgCl Fabric | 4 | $5.00 | $20.00 |
| Haptic Motor | ERM Vibration Motor | 2 | $2.50 | $5.00 |
| LiPo Battery | 500mAh 3.7V | 1 | $4.00 | $4.00 |
| Battery Charger | MCP73831 | 1 | $0.50 | $0.50 |
| LDO Regulator | TPS73633 (3.3V) | 1 | $1.00 | $1.00 |
| Passive Components | Resistors, Capacitors, etc. | - | - | $5.00 |
| PCB | 4-layer 50x70mm | 1 | $15.00 | $15.00 |
| Enclosure | 3D Printed | 1 | $8.00 | $8.00 |
| **Total BOM Cost** | | | | **$74.50** |

---

## Related Resources

- ADR-0005: ESP32-S3 Selection
- [MVP Suppliers Guide](../supply-chain/mvp-suppliers.md)

---

**Last Updated**: December 12, 2025
