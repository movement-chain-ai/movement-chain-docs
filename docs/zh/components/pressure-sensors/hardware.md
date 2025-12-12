# 压力传感器

压力传感器用于测量足底压力分布、握力和重心转移，是高尔夫挥杆分析的重要补充。

---

## 技术概述

### 压力传感器类型

| 类型 | 原理 | 优点 | 缺点 | 价格 |
|-----|------|-----|------|-----|
| **FSR (Force Sensing Resistor)** | 压力→电阻减小 | 低成本、薄 | 精度一般 | ¥5-20/个 |
| **压电式** | 压力→电压 | 动态响应好 | 静态漂移 | ¥20-50/个 |
| **电容式** | 压力→电容变化 | 高精度 | 成本高 | ¥50-100/个 |
| **应变片** | 形变→电阻 | 高精度 | 需要桥路 | ¥10-30/个 |

### FSR 工作原理

```text
┌─────────────────────────────────────────────────────────────┐
│                    FSR 传感器结构                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│      无压力时                    有压力时                    │
│    ┌─────────────┐            ┌─────────────┐              │
│    │  顶层电极    │            │  顶层电极    │              │
│    ├─────────────┤            ├─────────────┤              │
│    │             │ ← 间隙 →   │█████████████│ ← 接触      │
│    ├─────────────┤            ├─────────────┤              │
│    │ 压敏材料    │            │ 压敏材料    │              │
│    ├─────────────┤            ├─────────────┤              │
│    │  底层电极    │            │  底层电极    │              │
│    └─────────────┘            └─────────────┘              │
│                                                             │
│    电阻: >1MΩ (断开)          电阻: 1kΩ-100kΩ (导通)       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 产品对比

### 智能鞋垫产品

| 产品 | 传感器数 | 特性 | 价格 | SDK |
|-----|---------|-----|------|-----|
| **BAL.ON Golf** | 16+ | 高尔夫专用 | $599 | ✅ App API |
| **Sennotech** | 8 | 运动分析 | $200-300 | ✅ SDK |
| **Digitsole** | 8 | 智能加热 | $200 | 有限 |
| **Nurvv Run** | 32 | 跑步专用 | $300 | ✅ SDK |

### 压力传感器模块

| 产品 | 类型 | 规格 | 价格 | 获取渠道 |
|-----|------|-----|------|---------|
| **Interlink FSR 402** | FSR | 圆形 18mm | ¥30-50 | 淘宝/DigiKey |
| **Interlink FSR 406** | FSR | 方形 44mm | ¥50-80 | 淘宝/DigiKey |
| **FlexiForce A201** | 压阻 | 高精度 | $20-30 | DigiKey |
| **DFRobot 压力传感器** | FSR | 多款 | ¥20-60 | DFRobot |

### 压力传感器阵列

| 产品 | 分辨率 | 面积 | 价格 | 适用 |
|-----|-------|------|------|-----|
| **Pressure Profile TactArray** | 高 | 可定制 | $500+ | 研究 |
| **Tekscan F-Scan** | 高 | 鞋垫 | $2000+ | 专业 |
| **国产 FSR 阵列** | 中 | 8-16 点 | ¥100-300 | MVP |

---

## 数据访问

### FSR 采集电路

```text
                FSR 分压电路

    VCC (3.3V)
        │
        │
       ┌┴┐
       │ │ R1 (10kΩ 参考电阻)
       │ │
       └┬┘
        │
        ├──────────→ ADC (GPIO34)
        │
       ┌┴┐
       │ │ FSR (可变电阻)
       │ │
       └┬┘
        │
       GND


    Vout = VCC × R1 / (R1 + R_FSR)

    无压力: R_FSR → ∞, Vout → 0V
    有压力: R_FSR → 0, Vout → VCC
```

### ESP32 采集代码

```cpp
// 8 点压力阵列采集
#define NUM_SENSORS 8
const int sensorPins[NUM_SENSORS] = {34, 35, 36, 39, 32, 33, 25, 26};

struct PressureData {
  uint16_t values[NUM_SENSORS];
  uint32_t timestamp;
  float centerX;  // 重心 X
  float centerY;  // 重心 Y
};

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);
}

void loop() {
  PressureData data;
  data.timestamp = millis();

  // 读取所有传感器
  for (int i = 0; i < NUM_SENSORS; i++) {
    data.values[i] = analogRead(sensorPins[i]);
  }

  // 计算重心
  calculateCenterOfPressure(&data);

  // 发送数据
  sendBLE(&data);

  delay(10);  // 100 Hz
}

void calculateCenterOfPressure(PressureData* data) {
  // 传感器位置 (相对坐标)
  const float posX[8] = {0.2, 0.5, 0.8, 0.2, 0.5, 0.8, 0.3, 0.7};
  const float posY[8] = {0.9, 0.9, 0.9, 0.5, 0.5, 0.5, 0.1, 0.1};

  float sumX = 0, sumY = 0, sumP = 0;

  for (int i = 0; i < NUM_SENSORS; i++) {
    float p = data->values[i];
    sumX += p * posX[i];
    sumY += p * posY[i];
    sumP += p;
  }

  if (sumP > 0) {
    data->centerX = sumX / sumP;
    data->centerY = sumY / sumP;
  }
}
```

### 压力数据可视化

```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Circle

def visualize_pressure(pressure_data, center):
    """可视化足底压力分布"""
    fig, ax = plt.subplots(figsize=(6, 10))

    # 绘制足底轮廓
    foot_outline = plt.Polygon([
        (0.1, 0.1), (0.3, 0), (0.7, 0), (0.9, 0.1),
        (0.95, 0.4), (0.9, 0.7), (0.8, 0.95), (0.5, 1.0),
        (0.2, 0.95), (0.1, 0.7), (0.05, 0.4)
    ], fill=False, edgecolor='black')
    ax.add_patch(foot_outline)

    # 传感器位置
    sensor_pos = [
        (0.2, 0.9), (0.5, 0.9), (0.8, 0.9),  # 前掌
        (0.2, 0.5), (0.5, 0.5), (0.8, 0.5),  # 中部
        (0.3, 0.1), (0.7, 0.1)               # 后跟
    ]

    # 绘制压力点
    max_p = max(pressure_data)
    for i, (x, y) in enumerate(sensor_pos):
        size = (pressure_data[i] / max_p) * 0.15
        color = plt.cm.Reds(pressure_data[i] / max_p)
        circle = Circle((x, y), size, color=color, alpha=0.7)
        ax.add_patch(circle)

    # 绘制重心
    ax.plot(center[0], center[1], 'b*', markersize=20, label='CoP')

    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1.1)
    ax.set_aspect('equal')
    ax.legend()
    plt.title('Foot Pressure Distribution')
    plt.show()
```

---

## 高尔夫应用

### 足底压力分析

| 挥杆阶段 | 前脚压力 | 后脚压力 | 重心位置 |
|---------|---------|---------|---------|
| **Address** | 50% | 50% | 中心 |
| **Backswing** | 30% | 70% | 后移 |
| **Top** | 20% | 80% | 后脚 |
| **Transition** | 40% | 60% | 开始前移 |
| **Downswing** | 70% | 30% | 前移 |
| **Impact** | 80% | 20% | 前脚 |
| **Follow** | 90% | 10% | 前脚 |

### 重心轨迹

```text
                高尔夫挥杆重心轨迹 (俯视图)

    左脚                                右脚
    ┌────┐                            ┌────┐
    │    │                            │    │
    │ ←6 │                            │ 2→ │
    │    │                            │    │
    │ ←5 │                            │ 3→ │
    │    │                            │    │
    │ 7↙ │                            │ 1  │
    │    │                            │    │
    └────┘                            └────┘
         ↖                          ↗
          ↖        4              ↗
            ↖←←←←←←←←←←←←←←←←↗

    1: Address (中心)
    2: Backswing (右移)
    3: Top (右脚)
    4: Transition (开始左移)
    5: Downswing (快速左移)
    6: Impact (左脚)
    7: Follow-through (左前)
```

### 握力监测

| 应用 | 传感器位置 | 测量参数 | 意义 |
|-----|-----------|---------|------|
| **握杆压力** | 手套掌心 | 压力分布 | 过紧影响释放 |
| **手指力量** | 手套指尖 | 各指力量 | 控制稳定性 |
| **释放时机** | 拇指/食指 | 压力变化 | 击球前释放 |

---

## 技术规格

### FSR 传感器规格

| 参数 | 典型值 | 说明 |
|-----|-------|------|
| **量程** | 0-100 N | 足部应用 |
| **分辨率** | ~0.1 N | 取决于 ADC |
| **响应时间** | <5 ms | 快速响应 |
| **迟滞** | <5% | 重复性 |
| **厚度** | <0.5 mm | 超薄 |
| **工作温度** | -30~70°C | 户外使用 |

### 采集参数建议

| 参数 | 推荐值 | 说明 |
|-----|-------|------|
| **采样率** | 100 Hz | 足够捕捉运动 |
| **ADC 分辨率** | 12-bit | ESP32 原生 |
| **传感器数量** | 8-16 点 | 足底分布 |
| **参考电阻** | 10kΩ | 分压电路 |

---

## 供应商信息

### 传感器供应商

| 供应商 | 产品 | 价格 | 获取渠道 |
|-------|------|------|---------|
| **Interlink** | FSR 系列 | ¥30-80 | DigiKey/淘宝 |
| **Tekscan** | FlexiForce | $20-50 | DigiKey |
| **DFRobot** | 压力传感器 | ¥20-60 | dfrobot.com.cn |
| **淘宝卖家** | FSR 国产 | ¥5-15 | 淘宝 |

### 智能鞋垫供应商

| 供应商 | 产品 | 价格 | 网站 |
|-------|------|------|-----|
| **BAL.ON** | Golf 鞋垫 | $599 | balon.eu |
| **Sennotech** | 运动分析 | $200+ | sennotech.com |
| **途见科技** | 智能跑鞋 | 询价 | 国内 |

详细供应商信息请参见 [压力传感器供应商](suppliers.md)

---

## 相关资源

- [压力传感器供应商](suppliers.md)
- [柔性传感器](../flexible-sensors/hardware.md)
- [运动科技生态](../../design/research/sports-tech-ecosystem.md)

---

**最后更新**: 2025 年 12 月 7 日
