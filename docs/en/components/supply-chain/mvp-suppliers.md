# China Suppliers Rapid MVP Development Guide - Golf Swing Analysis Wearable Device

## Overview

This document is organized specifically for rapid MVP development of golf swing analysis wearable devices, focusing on Chinese domestic suppliers that support **small-batch orders**, **fast delivery**, and **Chinese technical support**. The user has Chinese communication capabilities and can directly contact suppliers for technical support and samples.

**Goal**: Find the fastest path to obtain evaluation kits and samples for MVP development within 2-4 weeks.

---

## Core Supplier Analysis

### 1. Hanwei Technology Group / Leanstar (Suzhou Nengstar Electronics)

**Website**: [www.hwsensor.com](http://www.hwsensor.com) | [lssensor.com](http://lssensor.com)

#### Company Background

- **Founded**: Hanwei Technology 1998, Suzhou Leanstar 2013 (Hanwei member company)
- **Listed Company**: ChiNext stock code 300007
- **Headquarters**: Zhengzhou (Hanwei), Suzhou (Leanstar)
- **Investment**: Xiaomi Yangtze River Industry Fund invested 10 million RMB

#### Core Products - Flexible Sensors

| Product Type | Technical Specs | Application Scenarios |
|---------|---------|---------|
| **Flexible Pressure Sensor** | Thickness <0.3mm, Sensitivity 0.1kPa | Robot tactile, wearable devices |
| **Flexible Piezoelectric Sensor** | Nano-sensitive material system | Motion monitoring, posture sensing |
| **Flexible Temperature/Humidity Sensor** | Flexible substrate | Health monitoring, environmental sensing |
| **Flexible Strain Sensor** | Bendable, stretchable | Joint motion monitoring |

**Technical Features**:

- ✅ Stick-and-use, flexible material similar to band-aid
- ✅ First Chinese company with mass production capability for flexible tactile sensors
- ✅ Over 100 core patents
- ✅ Already supplying samples/products to BYD, Xiaomi, etc.

#### Potential for Golf Wearables

**Possible Applications**:

- **Glove pressure sensing**: Monitor grip pressure distribution
- **Flexible strain sensing**: Monitor wrist and arm joint motion
- **Flexible temperature/humidity**: Monitor physiological state during exercise

#### Sample Purchasing & MVP Support

**Current Status (2025)**:

- ✅ Already supplying small batches to some robot manufacturers
- ✅ Suzhou Leanstar's annual production line of 10 million units at full capacity, new production line under construction
- ⚠️ Mainly B2B market (robot OEMs, parts manufacturers)
- ⚠️ No clear developer kits for individual developers

**Purchasing Recommendations**:

1. **Sample Acquisition Difficulty**: Medium
   - Company in rapid growth phase, mainly serving large customers
   - May need to explain project background and application scenarios

2. **Minimum Order Quantity (MOQ)**: Possibly 1000-10000 units (need to inquire for confirmation)

3. **Contact Information**:
   - **Hanwei Technology Hotline**: 400-609-3007 / 0371-67169010
   - **Leanstar Email**: <leanstar@leanstar-tech.com>
   - **Website**: <www.hwsensor.com>, lssensor.com

4. **SDK/Documentation**: Not public, need to contact sales

**MVP Evaluation**:

- ✅ If samples can be obtained, technical advancement is high
- ⚠️ May require certain purchase volume or partnership intention
- ⚠️ Not as convenient as ready-made modules for rapid prototyping
- 💡 **Recommendation**: Use ready-made IMU + EMG modules to validate MVP first, consider integrating flexible sensors later for product differentiation

---

### 2. iSmarch (Shenzhen Smartwatch ODM)

**Website**: [ismarch.com](https://ismarch.com) | **Contact**: WhatsApp/WeChat +86 136 8490 7956

#### Company Background

- **Founded**: 2013 (15 years wearable industry experience)
- **Headquarters**: Shenzhen
- **Type**: 100% own factory (not assembly line)
- **Scale**: 150 workers, 10+ assembly lines, monthly capacity 1 million units

#### Smartwatch ODM Customization Capabilities

**Hardware Customization**:

- ✅ Can integrate **high-precision sensors**: IMU, GPS, Heart Rate, SpO₂, ECG, **GSR/EDA (Galvanic Skin Response)**
- ✅ **UWB positioning technology** support
- ✅ **3-axis accelerometer + 3-axis gyroscope**, supports raw data storage (128MB - 32GB)
- ⚠️ **EMG muscle sensors**: Not explicitly listed on website, need to inquire about custom integration

**Software Customization**:

- ✅ Provides **App SDK** (Android + iOS)
- ✅ Provides **Firmware SDK** and Bluetooth protocol documentation
- ✅ Can access **PPG / SpO₂ / ECG / GSR raw data**
- ✅ Can access **accelerometer/gyroscope raw data**

**R&D Support**:

- 40 in-house engineers (15+ years experience)
- Hardware, structural, firmware, Bluetooth gateway engineering teams
- Provides schematics, IO port configuration, display driver files, etc.

#### Minimum Order Quantity (MOQ)

| Order Type | MOQ | Description |
|---------|-----|------|
| **Neutral Products (No Customization)** | **100 units** | ✅ Main products in stock, no MOQ to start business |
| **White Label Service (Logo Customization)** | **100 units** | Low entry barrier, label only |
| **Watch Band Color Customization** | **1000 units** | Minor customization |
| **ODM New Design Project** | **10,000 - 20,000 units** | First batch order |

#### Evaluation for Golf Wearables

**Advantages**:

- ✅ **MOQ 100 units**, very suitable for MVP small-batch testing
- ✅ **Existing products in stock**, possible fast delivery for evaluation
- ✅ **Complete SDK**, can develop custom algorithms
- ✅ **GSR/EDA sensors** can monitor stress/focus
- ✅ **UWB technology** enables high-precision positioning (golf course applications)
- ✅ **Seamless Chinese communication** (Shenzhen factory)

**Disadvantages**:

- ⚠️ **EMG muscle sensors** not explicitly supported (need to confirm customization capability)
- ⚠️ Watch form factor may not be suitable for wrist motion capture (recommend arm/glove form factor)

**Purchasing Recommendations**:

1. **Contact iSmarch to inquire**:
   - Do they have existing solutions supporting **9-axis IMU + EMG** integration?
   - Can they add **EMG module** to existing watch/band?
   - Sample evaluation cost? (Estimated ¥1000-3000 / unit)

2. **Rapid Evaluation Path**:
   - First purchase **100 neutral products** (with IMU + heart rate + GSR)
   - Test SDK and data acquisition capabilities
   - Later customize EMG integration (if feasible)

**MVP Evaluation**:

- ✅ **Best option for rapid MVP** (if not mandating EMG)
- ✅ Can obtain samples within 1-2 weeks
- ⚠️ If EMG is mandatory, need to confirm customization capability

---

### 3. Newdegree Technology (Shenzhen Flexible Pressure Sensor)

**Website**: [www.newdegreetech.com](http://www.newdegreetech.com)

#### Company Background

- **Founded**: 2011
- **Headquarters**: Shenzhen
- **US R&D Center**: Yes
- **Position**: World's first company to commercialize "Flexible MEMS" concept

#### Core Technology

**Flexible MEMS Pressure Sensor**:

- **Flexible Bendable**: Adapts to tight spaces and complex surfaces
- **Stick-and-Use**: FPC material, band-aid-like
- **High Sensitivity**: Minimum working pressure 30g, detects 1μm deformation
- **Output Range**: 0-3.0V analog signal

**Three Core Technologies**:

1. Printable high-precision strain sensing material
2. Stick-and-use easy-integration pressure sensor
3. Customized chip + proprietary algorithm

#### Application Cases

**Mass Production Partner Brands**:

- Google, Huawei, Xiaomi, vivo, OPPO, Black Shark, Lenovo
- vivo TWS 3 Pro, Xiaomi Buds 4 Pro, OnePlus Buds Pro 2 (earphone pressure sensors)

**Cumulative Shipments**: Over 100 million sets
**Global Market Share**: Second largest supplier of new pressure touch technology

#### Wearable Product Applications

**Wearable Solutions**:

- TWS true wireless Bluetooth earphones
- Smartwatches, smart bands
- VR devices

#### Evaluation for Golf Wearables

**Potential Applications**:

- **Glove pressure distribution**: Monitor grip strength and contact points
- **Wrist pressure**: Monitor wrist angle changes
- **Multi-touch**: Finger motion sensing

**Disadvantages**:

- ⚠️ **No motion sensor development kit information** (focuses on pressure sensing)
- ⚠️ Mainly serves large consumer electronics customers (earphone, smartphone manufacturers)
- ⚠️ No developer board or sample purchase process found

**Purchasing Recommendations**:

1. **Sample Acquisition Difficulty**: High
   - Mainly serves top consumer electronics brands
   - May require large order volume or partnership intention

2. **Contact Information**: Website <www.newdegreetech.com> (no public phone found)

**MVP Evaluation**:

- ⚠️ **Not recommended as MVP first choice**
- 💡 Suitable for later product enhancement (if advanced grip analysis needed)
- 💡 Can be a long-term technical partnership direction

---

### 4. Sichiray Technology (Wuxi EMG Professional Module)

**Website**: [www.sichiray.com](https://www.sichiray.com) | **Contact**: Mr. Shu 15821508209

#### Company Background

- **Founded**: 2012 (13 years biosensor R&D experience)
- **Headquarters**: Modern International Building Room 305, 307, 309, Binhu District, Wuxi
- **Team**: Over 75% bachelor's degree, years of Fortune 500 experience
- **Technical Capabilities**: Electronic design, embedded development, supporting APP development, software development

#### Core Products - EMG Muscle Sensors

**6-Lead Muscle Electrical Module**:

| Parameter | Specification |
|-----|------|
| **Channels** | 6-channel synchronous acquisition |
| **Output Mode** | Envelope Mode / RAW Mode |
| **Communication** | Serial communication |
| **Development Kit** | Bundled **Arduino UNO development kit** |
| **Expansion Capability** | Can control stepper motors, gripper hands, LED strips, etc. |

**Dual-Lead Muscle Electrical Module**:

- 2-channel EMG signal acquisition
- OUT1, OUT2 analog output
- Suitable for basic EMG monitoring

**EMG Armband**:

- ✅ Bluetooth module support
- ✅ Can control toy cars, drones, Arduino robots
- ✅ Gesture recognition function

#### Other Biosensor Products

- **EEG sensor**
- **ECG sensor**
- **Pulse sensor**

#### SDK and Technical Support

**Development Kit**:

- ✅ Arduino sample code
- ✅ Users can write custom Arduino code
- ✅ Supports LED control, electrical device control

**Documentation Language**: Chinese

**Technical Support**:

- ✅ Provided technical support to thousands of electronics/software developers
- ✅ Long-term service to domestic universities, research institutions, mental health industry

#### Purchase Channels

**Official Store**: <www.sichiray.com/store>
**Taobao**: Search "Sichiray EMG Sensor" or "思知瑞科技 肌电传感器"

#### Price Estimation

| Product | Estimated Price |
|-----|---------|
| Single-lead EMG module | ¥150 - ¥300 |
| Dual-lead EMG module | ¥300 - ¥500 |
| 6-channel EMG + Arduino kit | ¥800 - ¥1500 |
| EMG armband (Bluetooth) | ¥1000 - ¥2000 |

> Actual prices need to contact customer service or check Taobao

#### Evaluation for Golf Wearables

**Advantages**:

- ✅ **Professional EMG module**, mature technology
- ✅ **6-channel synchronous acquisition**, can monitor multiple muscles
- ✅ **Arduino ecosystem**, easy for rapid development
- ✅ **Bluetooth armband**, wearable form factor
- ✅ **Chinese technical support**, seamless communication
- ✅ **Reasonable price** (compared to foreign professional equipment)

**Disadvantages**:

- ⚠️ **No IMU integration**, needs additional inertial sensor
- ⚠️ Website doesn't list clear pricing, need to inquire
- ⚠️ Taobao shop information unclear

**Purchasing Recommendations**:

1. **Contact Sichiray Technology**:
   - Phone: 15821508209 (Mr. Shu)
   - Email: Via website contact form

2. **Inquiry Content**:
   - 6-channel EMG + Arduino kit price?
   - Can it work with IMU modules (e.g., MPU9250)?
   - Any Bluetooth + EMG + IMU integrated solution?
   - Sample delivery time?
   - SDK documentation quality?

3. **Rapid Validation Path**:
   - Purchase **Dual-lead EMG module** + **WitMotion WT901BLECL IMU**
   - Integrate using Arduino or ESP32
   - Estimated cost: ¥500-800

**MVP Evaluation**:

- ✅ **Cost-effective professional EMG solution**
- ✅ Can obtain samples within **1-2 weeks** (domestic shipping)
- ✅ Suitable for applications requiring **multi-channel EMG monitoring**
- ⚠️ Need to integrate IMU sensor separately

---

### 5. DFRobot (Shanghai Open Source Hardware)

**Website**: [www.dfrobot.com.cn](https://www.dfrobot.com.cn) | **Wiki**: [wiki.dfrobot.com.cn](https://wiki.dfrobot.com.cn)

#### Company Background

- **Company**: Shanghai Intelligence Bit Robot Co., Ltd.
- **Headquarters**: Shanghai
- **Positioning**: Open source hardware platform, maker education

#### Core Product - SEN0240 EMG Sensor

**Co-branded with OYMotion**:

| Parameter | Specification |
|-----|------|
| **Model** | SEN0240 Analog EMG Sensor |
| **Operating Voltage** | 3.3V / 5V |
| **Output Type** | Analog signal (0-3.0V, baseline 1.5V) |
| **Gain** | 1000x |
| **Bandwidth** | 25Hz - 500Hz |
| **Electrodes** | 3 electrodes (supports dry/wet electrodes) |
| **Size** | 25mm × 25mm |
| **Price** | ¥319 (~$44) |

**Technical Features**:

- ✅ Plug-and-play, Arduino/Raspberry Pi compatible
- ✅ Integrated filtering and amplification circuit
- ✅ Differential input, effectively suppresses power line interference
- ✅ Dry electrodes, no conductive gel needed
- ✅ Complete Chinese/English Wiki documentation

#### Other Sensor Modules

**SEN0374 BNO055 - 9-Axis IMU**:

- 9-axis smart sensor (accelerometer + gyroscope + magnetometer)
- Integrated temperature and pressure sensor
- I2C / UART interface
- Price: About ¥150-200

**FireBeetle Board ESP32-E**:

- WiFi + Bluetooth dual-mode main control board
- Ultra-low power, suitable for IoT
- Price: About ¥60-80

#### Purchase Channels

- **DFRobot Maker Store**: <www.dfrobot.com.cn>
- **Taobao Official Store**: Search "DFRobot官方旗舰店"
- **International Distributors**: Digi-Key, Mouser, RobotShop

#### Technical Support

- ✅ **Complete Chinese Wiki**: wiki.dfrobot.com.cn
- ✅ Arduino sample code
- ✅ Calibration guides and tutorials
- ✅ Community forum support

#### Integrated Solution Recommendation

**DFRobot Golf Wearable MVP Kit**:

| Component | Model | Unit Price | Qty | Subtotal |
|-----|------|------|------|------|
| EMG Sensor | SEN0240 | ¥319 | 2 | ¥638 |
| 9-Axis IMU | SEN0374 (BNO055) | ¥180 | 1 | ¥180 |
| Main Control Board | FireBeetle ESP32-E | ¥68 | 1 | ¥68 |
| Lithium Battery | 3.7V 1000mAh | ¥25 | 1 | ¥25 |
| Connecting Wires/Breadboard | - | ¥50 | 1 | ¥50 |
| **Total** | | | | **¥961** |

**Development Time**: 1-2 weeks (including shipping)

#### Evaluation for Golf Wearables

**Advantages**:

- ✅ **Plug-and-play**, fastest to get started
- ✅ **Complete Chinese documentation**, reduces learning cost
- ✅ **Arduino ecosystem**, rich sample code
- ✅ **Taobao direct purchase**, 1-3 days delivery
- ✅ **Open source community**, fast problem resolution

**Disadvantages**:

- ⚠️ **Single-channel EMG** (need multiple modules for multi-channel)
- ⚠️ **Analog output**, requires ADC sampling (ESP32 built-in ADC available)
- ⚠️ Low integration, requires manual wiring

**Purchasing Recommendations**:

1. **Taobao Search**: "DFRobot SEN0240"
2. **Official Website Purchase**: <www.dfrobot.com.cn>
3. **International Purchase**: DigiKey (Stock number SEN0240)

**MVP Evaluation**:

- ✅ **Best for rapid prototype validation** (if accepting single-channel EMG)
- ✅ **Can complete hardware setup within 1 week**
- ✅ **Best community support**
- ⚠️ If multi-channel EMG needed, consider Sichiray Technology

---

### 6. OYMotion (Shanghai Professional EMG Armband)

**Website**: [www.oymotion.com](https://www.oymotion.com) | **GitHub**: [github.com/oymotion](https://github.com/oymotion)

#### Company Background

- **Founded**: 2015
- **Headquarters**: Shanghai Zhangjiang
- **Positioning**: High-tech enterprise, Shanghai "Specialized and Refined" enterprise
- **Core Technology**: 100% proprietary AI EMG/EEG signal analysis technology
- **Patents**: Over 80 core patents authorized

#### Core Product - gForcePro+ EMG Armband

**Hardware Specifications**:

| Parameter | Specification |
|-----|------|
| **EMG Channels** | **8-channel** medical-grade EMG differential dry electrodes |
| **IMU** | **9-axis** motion sensor (accelerometer + gyroscope + magnetometer) |
| **Sampling Rate** | 8bit: 1KHz / 12bit: 500Hz |
| **Output Data** | Gesture actions, raw EMG data, quaternion, Euler angles |
| **Communication** | Bluetooth BLE 4.2 |
| **Battery** | 200mAh lithium-ion battery, USB charging |
| **Supported Platforms** | Windows 7/8/10, Android 4.0+, Arduino/Embedded |

**Software SDK**:

- ✅ **gForceSDKCXX** (C++)
- ✅ **gForceSDKCSharp** (C#)
- ✅ **gForceSDKPython** (Python)
- ✅ **Arduino SDK**
- ✅ **gForceDongle** (Windows USB adapter)

**Gesture Recognition**:

- Supports mobile **gForceAPP gesture training platform**
- Supports up to **16 user-defined gestures**

#### Application Scenarios

- Prosthetic control
- Robot gesture control
- Rehabilitation medicine
- Gesture interaction systems

#### Purchase Channels

- **OYMotion Official Website**: <www.oymotion.com>
- **Alibaba International**: Alibaba.com (search "OYMotion gForcePro+")
- **Taobao**: No official store found (may need to inquire via website)

#### Price Estimation

- **gForcePro+ Armband**: About ¥3000 - ¥5000 (need to inquire for confirmation)
- **DFRobot SEN0240** (OYMotion co-branded single-channel sensor): ¥319

> Note: OYMotion website doesn't publish detailed prices, need to contact directly for quote

#### Evaluation for Golf Wearables

**Advantages**:

- ✅ **8-channel EMG + 9-axis IMU integrated** (Perfect match for requirements!)
- ✅ **Medical-grade precision**, professional EMG signal analysis
- ✅ **Bluetooth wireless**, suitable for wearables
- ✅ **Gesture recognition AI**, can train custom actions
- ✅ **Multi-platform SDK**, Python/C++/Arduino all supported
- ✅ **Open source projects**, GitHub sample code available

**Disadvantages**:

- ⚠️ **Higher price** (estimated ¥3000-5000)
- ⚠️ **Armband form factor**, may not be suitable for wrist/glove wear
- ⚠️ Taobao purchase channel unclear, may need official website direct purchase

**Purchasing Recommendations**:

1. **Contact OYMotion**:
   - Official website contact form: <www.oymotion.com>
   - Alibaba inquiry: Search "OYMotion gForcePro+"

2. **Inquiry Content**:
   - gForcePro+ unit price and MOQ?
   - Does it support individual developer purchases?
   - Sample delivery time?
   - SDK documentation completeness?
   - Can it be customized to glove/band form factor?

3. **Alternative Solution**:
   - If budget is limited, purchase **DFRobot SEN0240** (OYMotion co-branded, ¥319)
   - Add IMU module separately

**MVP Evaluation**:

- ✅ **Technically most perfect integrated solution** (8-channel EMG + 9-axis IMU)
- ⚠️ **Higher price**, not suitable for extremely low-budget MVP
- ✅ Suitable for **professional-grade prototype** or **second-phase optimized MVP**
- 💡 **Recommendation**: If budget allows (¥3000-5000 per unit), this is the most time-saving choice

---

## Taobao/1688 Rapid Procurement Options

### Search Keywords

#### EMG Muscle Modules

- "EMG模块 蓝牙"
- "肌电传感器 Arduino"
- "肌电臂环"
- "gForce 肌电"

#### IMU Inertial Sensors

- "9轴IMU模块 蓝牙"
- "MPU9250 蓝牙"
- "陀螺仪加速度计模块"
- "姿态传感器 BLE"

#### Flexible Sensors

- "柔性传感器 运动"
- "压力传感器 可穿戴"
- "应变传感器"

### 1688 Platform - IMU Sensor Fast Shipping Options

**Shenzhen Supplier Recommendations**:

| Product | Supplier | Price (Wholesale) | MOQ | Shipping Speed |
|-----|--------|------------|--------|---------|
| **GY-BMI160 (6-axis)** | Shenzhen Wankesheng Tech | ¥7.20 / unit | 1 unit | 1-3 days |
| **MPU-6000 (6-axis)** | Shenzhen Hongshengxin Electronics | ¥55.00 / unit | 1 unit | In Stock |
| **ICM-20689 (6-axis)** | Shenzhen Oruit Tech | ¥3.00+ | Inquire | Same Day |
| **MPU9250 (9-axis)** | Shenzhen Multiple Suppliers | ¥6.30 - ¥19.40 | 1 unit | 1-3 days |
| **ICM20948 (9-axis)** | Taobao/Tmall | ¥50.24 - ¥195.00 | 1 unit | Express |

**1688 Search Link**: <www.1688.com> (search above models)

### Taobao - Ready-made Wearable Modules

**High-Precision 9-Axis IMU Modules**:

- **HI229**: 9-axis attitude sensor + inertial navigation, ¥195
- **JY901**: 9-axis accelerometer gyroscope (Kalman filter), ¥124.34
- **GY-BNO055**: 9dof nine-axis attitude sensor, ¥51

**Bluetooth Integrated Solutions**:

- **WT901BLECL** (WitMotion): Bluetooth 9-axis IMU, ¥158

### OpenBCI - Multi-channel Biosensor (Taobao Resale)

**Cyton Board**:

- **Channels**: 8-channel EEG/EMG/ECG
- **Price**: ¥3000 - ¥8000 (depending on configuration)
- **Third-party Alternative**: BCIkit Cyton dev board, about ¥699
- **DIY Cost**: ¥1000+ (compared to official ¥20,000+)

**Purchase Recommendations**:

- Taobao search "OpenBCI"
- Xianyu second-hand market
- ⚠️ Verify seller reputation and product authenticity

---

## Shenzhen ODM Wearable Device Small-Batch Customization

### Smartwatch/Band ODM Manufacturers Top 20 (Partial)

| Company | Location | MOQ | Features |
|-----|------|-----|------|
| **iSmarch** | Shenzhen | 100 units | ✅ Detailed analysis in this doc, recommended |
| **Shenzhen Harper Technology** | Shenzhen | Inquire | OEM smartwatch since 2007 |
| **Shenzhen Aidu Technology** | Shenzhen | Inquire | Smart band/watch ODM |
| **Linkso Smart** | Shenzhen | Inquire | One-stop software and hardware customization |
| **Xingmai Technology** | Shenzhen | Inquire | OEM/ODM diversified service |
| **Easyuse Technology** | Shenzhen | Inquire | Smart ring/wearable ODM |
| **Jiawo Technology** | Shenzhen | Inquire | Smartwatch ODM export |

**Contact Recommendations**:

1. Prepare project specification (Chinese)
2. Clarify requirements: EMG + IMU + Bluetooth + battery life
3. Inquire MOQ and sample price
4. Budget: ¥1000-3000 per sample, batch MOQ 100-1000 units

---

## Rapid MVP Procurement Solutions Comparison

### Solution A: Fastest (Within 1 Week)

**Components**:

- **EMG**: DFRobot SEN0240 × 2 (¥638)
- **IMU**: WitMotion WT901BLECL (¥158)
- **Main Control**: ESP32-S3 dev board (¥45)
- **Accessories**: Battery, wires (¥100)

**Total Cost**: **¥941**
**Advantages**: Taobao direct purchase, 1-3 days delivery, plug-and-play
**Disadvantages**: Requires manual assembly, low integration

---

### Solution B: Most Professional (2-3 Weeks)

**Components**:

- **Integrated**: OYMotion gForcePro+ (¥3000-5000)

**Total Cost**: **¥3000-5000**
**Advantages**: 8-channel EMG + 9-axis IMU integrated, Bluetooth wireless, complete SDK
**Disadvantages**: Higher price, armband form factor may need adjustment

---

### Solution C: Best Value (1-2 Weeks)

**Components**:

- **EMG**: Sichiray 6-channel EMG + Arduino kit (¥800-1500)
- **IMU**: WitMotion WT901BLECL (¥158)
- **Main Control**: Included in kit

**Total Cost**: **¥1000-1700**
**Advantages**: 6-channel EMG, Chinese tech support, Arduino ecosystem
**Disadvantages**: Need to integrate IMU, no Bluetooth (or need additional module)

---

### Solution D: ODM Customization (3-6 Weeks)

**Components**:

- **Custom Watch**: iSmarch neutral products 100 units (with IMU + heart rate + GSR)

**Total Cost**: About **¥30,000 - ¥50,000** (100 units × ¥300-500/unit)
**Advantages**: Complete product, can test market directly
**Disadvantages**: Large upfront investment, may not include EMG (need confirmation)

---

## Recommended Procurement Path (Phased)

### Phase 1: Rapid Core Algorithm Validation (Budget ¥1000, Within 1 Week)

**Goal**: Validate IMU + EMG data acquisition and swing recognition algorithm

**Purchase List**:

1. **DFRobot SEN0240** × 1 (¥319) - Validate single-point EMG signal
2. **WitMotion WT901BLECL** (¥158) - 9-axis IMU Bluetooth module
3. **ESP32-S3 dev board** (¥45)
4. **Accessories** (¥100)

**Total**: ¥622

**Validation Content**:

- IMU data acquisition and swing action recognition
- EMG signal quality and muscle activity monitoring
- Bluetooth data transmission
- Battery life testing

---

### Phase 2: Multi-channel Optimization (Budget ¥2000, Within 2 Weeks)

**Goal**: Implement multi-point EMG monitoring, optimize algorithm

**Purchase List**:

1. **Sichiray 6-channel EMG kit** (¥1000-1500)
2. **WitMotion WT901BLECL** (¥158) - Already have, can reuse
3. **Bluetooth module** (¥50) - If Sichiray kit has no Bluetooth

**Total**: ¥1200-1700

**Validation Content**:

- Multi-muscle synergy analysis
- More precise swing phase recognition
- Force and speed correlation analysis

---

### Phase 3: Integrated Prototype (Budget ¥5000, Within 3-4 Weeks)

**Goal**: Wearable integrated prototype, user testing

#### Option A: Professional Equipment

- **OYMotion gForcePro+** (¥3000-5000)
- Advantages: Professional-grade, 8-channel EMG + 9-axis IMU
- Disadvantages: Armband form factor, may need custom glove solution

#### Option B: ODM Small Batch

- **iSmarch neutral products** 10-20 units (¥3000-6000)
- Advantages: Watch form factor, can wear directly
- Disadvantages: May not have EMG (need to confirm customization)

---

### Phase 4: Market Testing (Budget ¥30,000+, 6-8 Weeks)

**Goal**: 100-unit small-batch market testing

**Purchase List**:

- **iSmarch ODM customization** 100 units (¥30,000-50,000)
- Includes: IMU + EMG (need confirmation) + Bluetooth + App

**Market Validation**:

- User feedback
- Product iteration
- Scale preparation

---

## Supplier Contact Information Summary

| Supplier | Contact | Website | Notes |
|-------|---------|------|------|
| **Hanwei Technology/Leanstar** | 0371-67169010 / 400-609-3007 | hwsensor.com | Flexible sensors, need to inquire developer support |
| **iSmarch** | WhatsApp/WeChat +86 136 8490 7956 | ismarch.com | Smartwatch ODM, MOQ 100 units |
| **Newdegree Technology** | Official website contact form | newdegreetech.com | Flexible pressure sensor, mainly serves large customers |
| **Sichiray Technology** | 15821508209 (Mr. Shu) | sichiray.com | 6-channel EMG, Chinese support |
| **DFRobot** | Taobao official store | dfrobot.com.cn | SEN0240 EMG, plug-and-play |
| **OYMotion** | Official website contact form | oymotion.com | gForcePro+ professional EMG armband |
| **WitMotion** | Taobao "维特智能官方店" | wit-motion.cn | High-precision IMU, starting ¥158 |

---

## Core Recommendations Summary

### Fastest MVP Path (Recommended!)

**Goal**: Complete hardware setup within 2 weeks, start algorithm development

**Procurement Solution**:

1. **DFRobot SEN0240** (¥319) - Single-channel EMG, Taobao 3-day delivery
2. **WitMotion WT901BLECL** (¥158) - 9-axis IMU Bluetooth module
3. **ESP32-S3 dev board** (¥45)

**Total Budget**: ¥522

**Advantages**:

- ✅ Delivery within 1 week
- ✅ Complete Chinese documentation
- ✅ Good community support
- ✅ Plug-and-play

**Upgrade Path**:

- After algorithm validation, upgrade to **Sichiray 6-channel EMG** or **OYMotion gForcePro+**
- Consider **iSmarch ODM customization** 100-unit small batch

---

### If Budget is Sufficient (¥3000+)

**Direct Purchase**:

- **OYMotion gForcePro+** (¥3000-5000)

**Advantages**:

- ✅ 8-channel EMG + 9-axis IMU integrated
- ✅ Bluetooth wireless
- ✅ Professional-grade SDK
- ✅ Saves integration work

---

### If Complete Product Form Factor Needed

**Contact iSmarch**:

- WhatsApp/WeChat: +86 136 8490 7956
- Inquire: EMG customization capability, 100-unit MOQ price, sample evaluation

**Advantages**:

- ✅ MOQ 100 units, suitable for small-batch testing
- ✅ Complete watch/band form factor
- ✅ SDK and App support

---

## Key Q&A

### Q1: Which supplier can provide samples fastest?

**A**: **DFRobot + WitMotion** (Taobao direct purchase, 3-5 days delivery)

### Q2: Which solution has the most advanced technology?

**A**: **OYMotion gForcePro+** (8-channel EMG + 9-axis IMU + AI gesture recognition)

### Q3: Which solution has the best value?

**A**: **Sichiray 6-channel EMG + WitMotion IMU** (¥1000-1700, professional multi-channel)

### Q4: How to quickly validate flexible sensors?

**A**: First use standard IMU + EMG to validate core functionality, later contact **Hanwei Technology/Leanstar** or **Newdegree Technology** to enhance product differentiation

### Q5: Can individual developers purchase directly?

**A**:

- ✅ Yes: DFRobot, WitMotion, Sichiray Technology
- ⚠️ Need to inquire: OYMotion, Hanwei Technology/Leanstar, Newdegree Technology
- ✅ Yes (but need MOQ): iSmarch (100 units)

---

## Next Step Action Recommendations

### This Week Actions (Week 1)

1. **Place Orders**:
   - Taobao purchase **DFRobot SEN0240** (¥319)
   - Taobao purchase **WitMotion WT901BLECL** (¥158)
   - Taobao purchase **ESP32-S3 dev board** (¥45)

2. **Contact Suppliers**:
   - Call: **Sichiray Technology 15821508209** (Inquire 6-channel EMG kit price and SDK)
   - WhatsApp: **iSmarch +86 136 8490 7956** (Inquire EMG customization capability and sample price)

3. **Technical Preparation**:
   - Download DFRobot SEN0240 Wiki documentation
   - Download WitMotion SDK and sample code
   - Install Arduino IDE / ESP-IDF development environment

### Next Week Actions (Week 2)

1. **Hardware Setup**:
   - Connect SEN0240 to ESP32 ADC
   - Connect WT901BLECL Bluetooth to mobile/computer
   - Test data acquisition

2. **Algorithm Validation**:
   - Collect swing action IMU data
   - Collect muscle activity EMG data
   - Initial swing phase recognition

3. **Supplier Evaluation**:
   - Evaluate Sichiray Technology quote and technical support
   - Evaluate iSmarch customization capability
   - Decide next phase procurement plan

---

*Last Updated: 2025-12-07*
*Document Authors: Movement Chain AI Research Team*
