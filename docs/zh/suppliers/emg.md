# EMG 供应商大全

肌电图 (EMG) 传感器模块、电极和专业设备供应商资源。

---

## 消费级模块供应商

### DFRobot ⭐⭐⭐⭐⭐

!!! success "MVP 首选"
    性价比高、文档齐全、社区活跃

| 产品 | 通道 | 接口 | 价格 | 评级 |
|-----|------|-----|------|-----|
| **SEN0240** | 1 | 模拟 | ¥319 | ✅ 推荐 |
| SEN0241 | 1 | I²C | ¥359 | 数字输出 |

**产品规格 (SEN0240)**:
- 输入阻抗: >10 MΩ
- 带宽: 20-500 Hz
- 增益: 1000x
- 电源: 3.3V-5V
- 输出: 0-3V 模拟

**联系方式**:
- 官网: [dfrobot.com.cn](https://www.dfrobot.com.cn/goods-1599.html)
- QQ 群: 技术交流群
- Wiki: [wiki.dfrobot.com.cn/SEN0240](https://wiki.dfrobot.com.cn/SEN0240)

**示例代码**:
```cpp
#define EMG_PIN A0

void setup() {
  Serial.begin(115200);
}

void loop() {
  int emgValue = analogRead(EMG_PIN);
  Serial.println(emgValue);
  delay(1);  // 1 kHz
}
```

---

### SparkFun / MyoWare ⭐⭐⭐⭐

| 产品 | 特性 | 价格 | 备注 |
|-----|------|------|-----|
| **MyoWare 2.0** | 新版本 | $40 | 推荐 |
| MyoWare Cable Shield | 屏蔽线缆 | $5 | 减少干扰 |
| MyoWare Power Shield | 电源滤波 | $15 | 可选 |

**联系方式**:
- 官网: [sparkfun.com/myoware](https://www.sparkfun.com/myoware)
- Hookup Guide: [learn.sparkfun.com](https://learn.sparkfun.com/tutorials/myoware-2.0-muscle-sensor)

---

### uMyo (开源硬件) ⭐⭐⭐⭐⭐

!!! info "OSHWA 认证开源项目"
    完全开源、可自行制作

| 产品 | 特性 | 价格 | 备注 |
|-----|------|------|-----|
| **uMyo** | BLE, 开源 | ~$50 | 推荐 |

**特性**:
- OSHWA 认证开源硬件
- BLE GATT 数据访问
- 原始 EMG 数据
- 完整设计文件

**联系方式**:
- 项目: [ultimaterobotics.github.io/umyo](https://ultimaterobotics.github.io/umyo/)
- GitHub: 开源设计文件

---

### Muscle BioAmp (印度) ⭐⭐⭐

| 产品 | 特性 | 价格 | 备注 |
|-----|------|------|-----|
| BioAmp EXG Pill | 超小型 | $20 | 性价比 |
| Muscle BioAmp Shield | Arduino 扩展 | $30 | 入门 |

**联系方式**:
- 官网: [upsidedownlabs.tech](https://upsidedownlabs.tech)

---

## 专业级供应商

### OYMotion (傲意科技) ⭐⭐⭐⭐

!!! success "专业首选"
    8 通道、BLE 连接、SDK 完善

| 产品 | 通道 | 接口 | 价格 | 评级 |
|-----|------|-----|------|-----|
| **gForcePro+** | 8 | BLE/USB | ¥3,000-5,000 | ✅ 推荐 |
| gForce 100 | 8 | BLE | ¥2,000+ | 入门 |

**SDK 支持**:
- Android SDK
- iOS SDK
- Unity SDK
- Windows SDK

**联系方式**:
- 官网: [oymotion.com](https://oymotion.com)
- 邮箱: support@oymotion.com
- 开发者: [developer.oymotion.com](https://developer.oymotion.com)

---

### Sichiray (思奇科技) ⭐⭐⭐

| 产品 | 通道 | 接口 | 价格 | 备注 |
|-----|------|-----|------|-----|
| **6-channel EMG** | 6 | 有线 | ¥800-1,500 | 多通道 |
| **EMG PRO** | 8 | 臂带式 | ¥1,500+ | 可穿戴 |

**联系方式**:
- 电话/微信: 15821508209
- 淘宝: 搜索 "Sichiray"

---

### E3K Platform ⭐⭐⭐⭐

!!! info "众筹项目"
    EMG + IMU + 电极套件

| 产品 | 特性 | 价格 | 备注 |
|-----|------|------|-----|
| **E3K Kit** | EMG + IMU | $159 | 完整套件 |

**包含**:
- EMG 传感器
- IMU (LSM6DSx)
- 电极贴片
- 开发板

**联系方式**:
- 官网: [e3k.live](https://e3k.live)
- Kickstarter: E3K Project

---

## 研究级供应商

### Delsys ⭐⭐⭐

| 产品 | 通道 | 特性 | 价格 | 备注 |
|-----|------|-----|------|-----|
| **Trigno** | 16+ | 无线 | $15,000+ | 研究金标准 |
| **Bagnoli** | 8-16 | 有线 | $8,000+ | 经典方案 |

**联系方式**:
- 官网: [delsys.com](https://delsys.com)
- 软件: EMGworks

---

### Shimmer Research ⭐⭐⭐⭐

| 产品 | 特性 | 价格 | 备注 |
|-----|------|------|-----|
| **Shimmer3 EMG** | 2-8 通道 | $2,500+ | 研究级 |
| **Shimmer3 ExG** | EMG/ECG/EEG | $800+ | 多用途 |

**联系方式**:
- 官网: [shimmersensing.com](https://shimmersensing.com)
- 软件: ConsensysPRO

---

### OpenBCI ⭐⭐⭐

| 产品 | 通道 | 特性 | 价格 | 备注 |
|-----|------|-----|------|-----|
| **Cyton** | 8 | 开源 | $500 | 可扩展 |
| **Ganglion** | 4 | 入门 | $200 | 低成本 |

**联系方式**:
- 官网: [openbci.com](https://openbci.com)
- 软件: OpenBCI GUI (开源)

---

### BITalino ⭐⭐⭐

| 产品 | 特性 | 价格 | 备注 |
|-----|------|------|-----|
| **BITalino (r)evolution** | 多模态 | €149 | 研究入门 |

**联系方式**:
- 官网: [bitalino.com](https://bitalino.com)

---

## 电极供应商

### 一次性凝胶电极

| 供应商 | 产品 | 价格 | 备注 |
|-------|------|------|-----|
| **3M** | Red Dot 2228 | ¥0.5/片 | 医用级 |
| **泰科** | Arbo H124SG | ¥0.3/片 | 经济 |
| **淘宝卖家** | 国产贴片 | ¥0.1/片 | 批量 |

### 干电极 (可重复使用)

| 供应商 | 产品 | 价格 | 备注 |
|-------|------|------|-----|
| **Florida Probe** | 干电极 | ¥50/对 | 专业级 |
| **OpenBCI** | 干电极 | $15/对 | 配套 |
| **淘宝卖家** | 国产干电极 | ¥10-30/对 | 性价比 |

### 导电织物电极

| 供应商 | 产品 | 价格 | 备注 |
|-------|------|------|-----|
| **棉捷科技** | 导电银纤维 | 询价 | 智能服装 |
| **淘宝卖家** | 导电布 | ¥20-50/片 | 原型验证 |

---

## 价格对比

### 消费级

| 产品 | 通道 | 价格 | 性价比 |
|-----|------|------|-------|
| DFRobot SEN0240 | 1 | ¥319 | ⭐⭐⭐⭐⭐ |
| MyoWare 2.0 | 1 | ¥280 | ⭐⭐⭐⭐ |
| uMyo | 1 | ¥350 | ⭐⭐⭐⭐ |
| Muscle BioAmp | 1 | ¥140 | ⭐⭐⭐⭐⭐ |

### 专业级

| 产品 | 通道 | 价格 | 性价比 |
|-----|------|------|-------|
| OYMotion gForcePro+ | 8 | ¥3,000-5,000 | ⭐⭐⭐⭐ |
| Sichiray 6-ch | 6 | ¥800-1,500 | ⭐⭐⭐⭐⭐ |
| E3K Kit | 1 | ¥1,100 | ⭐⭐⭐⭐ |

### 研究级

| 产品 | 通道 | 价格 | 备注 |
|-----|------|------|-----|
| Shimmer3 EMG | 2-8 | ¥17,500+ | 研究 |
| OpenBCI Cyton | 8 | ¥3,500 | 开源 |
| Delsys Trigno | 16 | ¥105,000+ | 金标准 |

---

## MVP 采购建议

### 方案 A: 最低成本 (¥638)

| 组件 | 产品 | 数量 | 单价 | 小计 |
|-----|------|-----|------|-----|
| EMG 传感器 | DFRobot SEN0240 | 2 | ¥319 | ¥638 |

### 方案 B: 专业方案 (¥3,000-5,000)

| 组件 | 产品 | 数量 | 单价 | 小计 |
|-----|------|-----|------|-----|
| EMG 臂带 | OYMotion gForcePro+ | 1 | ¥3,000-5,000 | ¥3,000-5,000 |

### 方案 C: 多通道 (¥800-1,500)

| 组件 | 产品 | 数量 | 单价 | 小计 |
|-----|------|-----|------|-----|
| EMG 系统 | Sichiray 6-ch | 1 | ¥800-1,500 | ¥800-1,500 |

---

## 相关资源

- [EMG 技术详解](../sensors/emg.md)
- [传感器硬件指南](../guides/sensor-hardware.md)
- [高尔夫可穿戴技术研究](../research/golf-wearable-technology-research.md)

---

**最后更新**: 2025 年 12 月 7 日
