# 柔性/E-Skin 传感器

柔性传感器和电子皮肤 (E-Skin) 技术用于检测形变、弯曲和压力分布，适用于智能服装和贴片形态。

---

## 技术概述

### 柔性传感器类型

| 类型 | 原理 | 测量参数 | 典型应用 |
|-----|------|---------|---------|
| **应变计** | 电阻变化 | 拉伸/压缩 | 关节角度、呼吸 |
| **压阻式** | 压力→电阻 | 压力分布 | 足底、握力 |
| **电容式** | 形变→电容 | 接近、触摸 | 触控界面 |
| **压电式** | 应力→电压 | 动态压力 | 振动、冲击 |

### E-Skin 产品形态

```text
┌─────────────────────────────────────────────────────────────┐
│                    E-Skin 产品形态                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  皮肤贴片 (Skin Patch)                                      │
│  └── 最贴合、最灵敏、一次性/可复用                          │
│                                                             │
│  智能服装 (Smart Clothing)                                  │
│  ├── 智能衣/运动bra - 心率、呼吸、姿态                     │
│  ├── 智能裤 - 腿部运动、跑步分析                           │
│  └── 智能袜 - 足部压力、跑步姿态                           │
│                                                             │
│  可穿戴配件 (Wearable Accessories)                          │
│  ├── 智能手套 - 手势识别、握力                             │
│  ├── 智能鞋垫 - 足底压力、重心                             │
│  └── 运动臂带 - 肌肉监测                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 产品对比

### 国际供应商

| 供应商 | 产品 | 特性 | 价格 | SDK |
|-------|------|-----|------|-----|
| **StretchSense** | MoCap Pro | 10 通道弯曲 | $500+ | ✅ Unity/C# |
| **Bebop Sensors** | Forte Glove | 力+弯曲 | $1,000+ | ✅ SDK |
| **BendLabs** | 2-Axis Sensor | 高精度弯曲 | $100+ | ✅ Arduino |
| **Pressure Profile** | TactArray | 压力阵列 | $300+ | ✅ SDK |

### 国内供应商

| 供应商 | 产品 | 特性 | 价格 | SDK |
|-------|------|-----|------|-----|
| **能斯达 (Nengstar)** | 柔性压力传感器 | 小米供应链 | ¥10-50/片 | ❌ 需定制 |
| **纽迪瑞 (NDT)** | 压力传感器矩阵 | 华为供应链 | ¥20-100 | ❌ 需定制 |
| **汉威科技** | 柔性传感器 | 上市公司 | 询价 | ❌ 需定制 |
| **途见科技** | 智能跑鞋方案 | 整体方案 | 询价 | 部分开放 |

!!! warning "数据访问挑战"
    国内柔性传感器供应商通常**不提供 SDK**，需要：

    1. 自行设计 MCU 采集电路
    2. 与供应商定制开发
    3. 或选择国际供应商方案

---

## 数据访问

### SDK 可用性对比

| 供应商 | SDK | 数据格式 | 开放程度 | 适合场景 |
|-------|-----|---------|---------|---------|
| **StretchSense** | ✅ Unity/C#/Python | 弯曲角度 | ⭐⭐⭐⭐ | 动捕、VR |
| **Bebop Sensors** | ✅ SDK | 力+弯曲 | ⭐⭐⭐⭐ | 手势、机器人 |
| **能斯达/纽迪瑞** | ❌ | 模拟电压 | ⭐ | 需自行开发 |

### StretchSense 示例

```csharp
// Unity C# 示例
using StretchSense;

public class GloveController : MonoBehaviour {
    private StretchSenseDevice device;

    void Start() {
        device = StretchSenseManager.GetDevice("MoCapPro");
        device.OnDataReceived += HandleData;
        device.StartStreaming();
    }

    void HandleData(SensorData data) {
        // 10 个弯曲传感器数据
        float[] bendAngles = data.GetBendAngles();

        // 手指弯曲角度 (0-90°)
        float thumb = bendAngles[0];
        float index = bendAngles[1];
        float middle = bendAngles[2];
        // ...
    }
}
```

### 自行采集 (能斯达/纽迪瑞)

```cpp
// ESP32 采集柔性压力传感器
#define FLEX_PIN_1 34
#define FLEX_PIN_2 35
#define FLEX_PIN_3 36
#define FLEX_PIN_4 39

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);  // 0-3.3V 范围
}

void loop() {
  // 读取 4 个柔性传感器
  int flex1 = analogRead(FLEX_PIN_1);  // 0-4095
  int flex2 = analogRead(FLEX_PIN_2);
  int flex3 = analogRead(FLEX_PIN_3);
  int flex4 = analogRead(FLEX_PIN_4);

  // 转换为压力值 (需要校准)
  float pressure1 = mapToPressure(flex1);  // kPa

  Serial.printf("%d,%d,%d,%d\n", flex1, flex2, flex3, flex4);
  delay(10);  // 100 Hz
}

float mapToPressure(int adcValue) {
  // 根据供应商提供的特性曲线校准
  // 典型: 0-100 kPa
  return (adcValue / 4095.0) * 100.0;
}
```

---

## 高尔夫应用场景

### 智能手套

| 功能 | 传感器 | 位置 | 数据 |
|-----|-------|------|------|
| **握力监测** | 压力阵列 | 手掌 | 握杆压力分布 |
| **手指弯曲** | 弯曲传感器 | 手背 | 握杆姿势 |
| **腕部角度** | IMU | 手腕 | 挥杆路径 |

### 智能鞋垫

| 功能 | 传感器 | 位置 | 数据 |
|-----|-------|------|------|
| **重心转移** | FSR 阵列 | 足底 | 8-16 点压力 |
| **站姿平衡** | 压力传感器 | 前掌/后跟 | 压力比例 |
| **动态分析** | 高速 FSR | 全足底 | 挥杆过程压力变化 |

### 数据融合示例

```text
                          高尔夫挥杆 - 多传感器数据流

时间 →    Address      Backswing     Top        Downswing      Impact
         ─────────────────────────────────────────────────────────────

手套压力   ████████     ████░░░░     ░░░░░░     ████████████   █████████
(握杆)    均匀握持      左手减压      放松       加速握紧        释放

鞋垫压力   ████████     后跟加重      右脚       左脚           左脚
(重心)    平衡         →→→→→→       集中       →→→→→→        承重

手指弯曲   ████████     ████████     ████████   ████████████   ░░░░░░░░
(释放)    握紧         保持         保持       保持           释放
```

---

## 技术规格

### 柔性压力传感器

| 参数 | 典型值 | 说明 |
|-----|-------|------|
| **量程** | 0-100 kPa | 手掌压力 |
| **灵敏度** | 0.1 kPa | 最小检测 |
| **响应时间** | <10 ms | 快速响应 |
| **工作温度** | -20~60°C | 户外使用 |
| **弯曲半径** | >5 mm | 柔韧性 |
| **寿命** | >100 万次 | 耐久性 |

### 弯曲传感器

| 参数 | 典型值 | 说明 |
|-----|-------|------|
| **量程** | 0-180° | 关节角度 |
| **分辨率** | <1° | 高精度 |
| **响应时间** | <5 ms | 快速响应 |
| **回弹性** | >99% | 恢复原状 |

---

## 供应商信息

### 国内供应商联系方式

| 供应商 | 产品类型 | 联系方式 | 备注 |
|-------|---------|---------|-----|
| **能斯达 (汉威子公司)** | 柔性压力传感器 | 0371-67169010 | 小米供应链 |
| **纽迪瑞 (NDT)** | 压力传感器 | ndt-global.com | 华为/OPPO |
| **途见科技** | 智能鞋垫方案 | 询价 | 整体方案 |
| **赛感科技** | E-Skin | 询价 | 上海 |

### 国际供应商

| 供应商 | 产品 | 网站 | 备注 |
|-------|------|-----|-----|
| **StretchSense** | MoCap 手套 | stretchsense.com | 新西兰 |
| **Bebop Sensors** | Forte 手套 | bebopsensors.com | 美国 |
| **BendLabs** | 弯曲传感器 | bendlabs.com | 美国 |

详细供应商信息请参见 [柔性传感器供应商](suppliers.md)

---

## 市场数据

!!! info "E-Skin 市场规模"
    - 2023 年: $8.3 亿
    - 2028 年预测: $60+ 亿
    - CAGR: ~35%

    主要应用: 医疗健康、运动监测、VR/AR

---

## 相关资源

- [柔性传感器供应商](suppliers.md)
- [E-Skin ODM 厂商研究](../../research/suppliers-china/e-skin-odm-manufacturers.md)
- [压力传感器](../pressure-sensors/hardware.md)
- [中国智能可穿戴供应商](../../research/suppliers-china/chinese-smart-wearable-suppliers.md)

---

**最后更新**: 2025 年 12 月 7 日
