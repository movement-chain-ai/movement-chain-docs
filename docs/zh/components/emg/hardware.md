# EMG 肌电传感器

肌电图 (Electromyography) 传感器测量肌肉电活动，是我们**独特的技术差异化**核心。

---

## 我们的核心优势

!!! success "市场唯一"
    **零竞争对手使用 EMG 进行高尔夫挥杆分析**

    - SwingMotion = 仅 IMU
    - HackMotion = 仅 IMU
    - Sportsbox AI = 仅 Vision
    - K-Motion = 仅 IMU
    - **Movement Chain AI = EMG + IMU + Vision** ✅

### EMG 能提供什么

| 指标 | 说明 | 价值 |
|-----|------|-----|
| **肌肉激活时序** | 哪块肌肉何时激活 | 优化发力顺序 |
| **力量输出** | 肌肉收缩强度 | 评估爆发力 |
| **肌肉疲劳** | 频率变化检测 | 预防伤病 |
| **协同模式** | 多肌肉配合 | 动作协调性 |
| **预激活** | 动作前肌肉准备 | 提前预判 |

---

## EMG 产品对比

### 消费级方案 (MVP 推荐)

| 产品 | 通道数 | 接口 | 价格 | 适用场景 |
|-----|-------|-----|------|---------|
| **DFRobot SEN0240** | 1 | 模拟 | ¥319 | ✅ **MVP 首选** |
| **uMyo** | 1 | BLE | ~$50 | 开源方案 |
| **MyoWare 2.0** | 1 | 模拟 | $40 | Arduino 开发 |
| **Muscle BioAmp** | 1 | 模拟 | $20 | 超低成本 |

### 专业级方案

| 产品 | 通道数 | 接口 | 价格 | 适用场景 |
|-----|-------|-----|------|---------|
| **OYMotion gForcePro+** | 8 | BLE/USB | ¥3,000-5,000 | ✅ **专业首选** |
| **Sichiray 6-channel** | 6 | 有线 | ¥800-1,500 | 多通道需求 |
| **Delsys Trigno** | 16+ | WiFi | $15,000+ | 研究级 |
| **Shimmer3 EMG** | 2-8 | BLE | $2,500+ | 学术研究 |

### 开发套件

| 产品 | 特性 | 价格 | 获取方式 |
|-----|------|------|---------|
| **E3K Platform** | EMG + IMU + 电极 | $159 | Kickstarter |
| **OpenBCI Cyton** | 8 通道 | $500 | openbci.com |
| **BITalino** | 多模态 | €149 | bitalino.com |

---

## 数据访问

### SDK/API 可用性

| 产品 | SDK | 数据格式 | 开放程度 | 备注 |
|-----|-----|---------|---------|-----|
| **DFRobot SEN0240** | Arduino | 模拟电压 | ⭐⭐⭐⭐⭐ | 最开放 |
| **OYMotion gForce** | ✅ | 原始 EMG + 手势 | ⭐⭐⭐⭐ | Android/iOS/Unity |
| **uMyo** | BLE GATT | 原始 EMG | ⭐⭐⭐⭐⭐ | OSHWA 开源 |
| **Myo Armband** | ❌ 停产 | - | - | 不推荐 |
| **Delsys** | 商业 | EMGworks | ⭐⭐ | 需授权 |

### DFRobot SEN0240 代码示例

```cpp
// Arduino 示例
#define EMG_PIN A0
#define SAMPLE_RATE 1000  // 1 kHz

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);  // ESP32: 12-bit ADC
}

void loop() {
  int emgValue = analogRead(EMG_PIN);

  // 原始值范围: 0-4095 (12-bit)
  // 典型肌肉收缩: 500-2000
  // 放松状态: 100-300

  Serial.println(emgValue);
  delayMicroseconds(1000);  // 1 kHz 采样
}
```

```python
# Python 处理示例
import numpy as np
from scipy import signal

def process_emg(raw_signal, fs=1000):
    """EMG 信号处理流程"""

    # 1. 带通滤波 (20-450 Hz)
    b, a = signal.butter(4, [20, 450], btype='band', fs=fs)
    filtered = signal.filtfilt(b, a, raw_signal)

    # 2. 全波整流
    rectified = np.abs(filtered)

    # 3. 包络提取 (RMS)
    window_size = int(0.05 * fs)  # 50ms 窗口
    envelope = np.sqrt(np.convolve(rectified**2,
                       np.ones(window_size)/window_size, mode='same'))

    return envelope

def detect_activation(envelope, threshold_factor=3):
    """检测肌肉激活"""
    baseline = np.percentile(envelope, 10)
    threshold = baseline * threshold_factor
    return envelope > threshold
```

### OYMotion gForce SDK

```java
// Android SDK 示例
GForceDevice device = new GForceDevice();

device.setDataNotifyCallback(new DataNotifyCallback() {
    @Override
    public void onEMGData(int[] emgData, int channelCount) {
        // emgData: 8 通道原始 EMG 数据
        // 采样率: 500 Hz
        for (int i = 0; i < channelCount; i++) {
            processChannel(i, emgData[i]);
        }
    }

    @Override
    public void onGestureData(Gesture gesture) {
        // 内置手势识别
        // Gesture: FIST, WAVE_IN, WAVE_OUT, etc.
    }
});

device.startStreaming(StreamType.EMG | StreamType.GESTURE);
```

---

## 高尔夫挥杆应用

### 关键肌群监测

```text
┌─────────────────────────────────────────────────────────────┐
│              高尔夫挥杆关键肌群 EMG 监测                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  前臂 (Forearm) - 最重要 ✅                                  │
│  ├── 桡侧腕屈肌 (FCR) - 腕部控制                            │
│  ├── 尺侧腕屈肌 (FCU) - 握力                                │
│  └── 指伸肌 (ED) - 释放时机                                 │
│                                                             │
│  上臂 (Upper Arm)                                           │
│  ├── 肱二头肌 (Biceps) - 拉杆                              │
│  └── 肱三头肌 (Triceps) - 推杆                             │
│                                                             │
│  肩部 (Shoulder)                                            │
│  ├── 三角肌 (Deltoid) - 上杆                               │
│  └── 胸大肌 (Pectoralis) - 下杆                            │
│                                                             │
│  核心 (Core)                                                │
│  ├── 腹外斜肌 (EO) - 旋转                                  │
│  └── 竖脊肌 (ES) - 稳定                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### MVP 最小配置

| 位置 | 传感器 | 监测肌群 | 优先级 |
|-----|-------|---------|-------|
| **前臂** | DFRobot × 2 | FCR + FCU | ⭐⭐⭐ 必须 |
| **上臂** | DFRobot × 1 | Biceps | ⭐⭐ 推荐 |
| **肩部** | 可选 | Deltoid | ⭐ 可选 |

### 挥杆阶段肌肉激活模式

```text
时间线 →
                Address    Backswing    Transition    Downswing    Impact    Follow
                ────────────────────────────────────────────────────────────────────
FCR (腕屈)      ░░░░░░░░   ████░░░░░░   ░░████████   ████████████  ████████  ░░░░░░
FCU (腕屈)      ░░░░░░░░   ██████░░░░   ░░██████░░   ██████████░░  ████████  ░░░░░░
Biceps (二头)   ░░░░░░░░   ████████░░   ░░░░████░░   ░░░░░░░░░░░░  ░░░░░░░░  ████░░
Triceps (三头)  ░░░░░░░░   ░░░░░░░░░░   ████████░░   ████████████  ████████  ░░░░░░
Deltoid (三角)  ████░░░░   ██████████   ██████░░░░   ░░░░████████  ████░░░░  ░░░░░░

激活强度: ████ = 高强度, ░░░░ = 低/无活动
```

---

## 技术规格

### 电极配置

| 参数 | 推荐值 | 说明 |
|-----|-------|------|
| **电极类型** | Ag/AgCl 干电极 | 可穿戴场景 |
| **电极间距** | 20mm | 标准配置 |
| **电极直径** | 10mm | 前臂适用 |
| **皮肤准备** | 轻微打磨 | 降低阻抗 |

### 信号处理参数

| 参数 | 值 | 说明 |
|-----|---|------|
| **采样率** | 1000 Hz | 最低要求 |
| **带通滤波** | 20-450 Hz | EMG 频段 |
| **陷波滤波** | 50/60 Hz | 工频干扰 |
| **增益** | 1000x | 典型放大 |
| **ADC 分辨率** | 12-16 bit | ESP32: 12-bit |

### 硬件设计

```text
EMG 信号链路:
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐
│ 电极对   │ → │仪表放大器│ → │ 带通滤波 │ → │ 陷波滤波 │ → │   ADC   │
│ (Ag/AgCl)│   │ (INA128) │   │(20-450Hz)│   │ (50Hz)  │   │(12-bit) │
└─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘
                  │
                  │ 增益: 1000x
                  │ CMRR: >100 dB
                  v

推荐芯片:
- 仪表放大器: INA128, AD620
- 运算放大器: OPA2134, TL072
- ADC: ESP32 内置 12-bit SAR ADC
```

---

## 供应商信息

### 模块供应商

| 供应商 | 产品 | 价格 | 联系方式 |
|-------|------|------|---------|
| **DFRobot** | SEN0240 | ¥319 | dfrobot.com.cn |
| **OYMotion** | gForcePro+ | ¥3,000-5,000 | oymotion.com |
| **Sichiray** | 6-channel EMG | ¥800-1,500 | 15821508209 |
| **SparkFun** | MyoWare 2.0 | $40 | sparkfun.com |

### 电极供应商

| 供应商 | 产品 | 价格 | 备注 |
|-------|------|------|-----|
| **3M** | Red Dot 电极 | ¥0.5/片 | 一次性凝胶 |
| **Florida Probe** | 干电极 | ¥50/对 | 可重复使用 |
| **淘宝/1688** | 国产干电极 | ¥10-30/对 | 性价比高 |

详细供应商信息请参见 [EMG 供应商大全](suppliers.md)

---

## 相关资源

- [EMG 供应商](suppliers.md)
- [竞品分析](../../product/competitive/index.md) - 无 EMG 竞品
- [运动科技生态](../../design/research/sports-tech-ecosystem.md)

---

**最后更新**: 2025 年 12 月 7 日
