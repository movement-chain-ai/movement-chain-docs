# 国内传感器供应商清单 (China Domestic Sensor Suppliers)

## 概述 (Overview)

本文档整理了适用于 Movement Chain AI 项目的国内传感器供应商信息，包括 IMU 惯性测量单元、EMG 肌电传感器、以及电子皮肤相关产品。这些供应商的产品可通过淘宝、1688 等平台直接采购，适合快速原型验证和小批量生产。

---

## IMU 传感器供应商 (IMU Sensor Suppliers)

### 1. WitMotion (维特智能)

| 属性 Attribute | 详情 Details |
|-----------|---------|
| **公司全称 Full Name** | 深圳市维特智能科技有限公司 Shenzhen WitMotion Intelligent Technology Co., Ltd. |
| **位置 Location** | 深圳 Shenzhen |
| **主营产品 Main Products** | 高精度 IMU 模组、姿态传感器、倾角仪 High-precision IMU modules, attitude sensors, inclinometers |
| **价格范围 Price Range** | ¥150 - ¥800 (~$20-110 USD) |
| **购买渠道 Purchase Channels** | 淘宝官方店、1688、官网 Taobao official store, 1688, official website |
| **官网 Website** | [wit-motion.cn](https://wit-motion.cn) |

**推荐产品 (Recommended Products):**

| 型号 Model | 传感器 Sensor | 精度 Accuracy | 价格 Price | 适用场景 Use Case |
|-------|--------|----------|-------|----------|
| WT901BLECL | MPU9250 | ±0.05° | ¥158 | 基础原型验证 Basic prototype validation |
| WT901SDCL | ICM20948 | ±0.05° | ¥198 | SD 卡数据记录 SD card data logging |
| BWT901CL | 9轴 + 气压计 9-axis + Barometer | ±0.01° | ¥358 | 高精度应用 High-precision applications |
| HWT901B-485 | 高精度 High-precision | ±0.005° | ¥698 | 工业级应用 Industrial applications |

**评估 (Assessment):**

- ✅ 国内最成熟的 IMU 模组供应商 Most mature IMU module supplier in China
- ✅ 完善的 SDK 和技术文档 Complete SDK and technical documentation
- ✅ 淘宝直购，发货快 Direct Taobao purchase, fast shipping
- ⚠️ 集成度较低，需要额外开发 Lower integration, requires additional development
- ⚠️ 不支持 LSM6DSV16X 芯片 Does not support LSM6DSV16X chip

**采购建议 (Procurement Suggestion):**
适合快速原型验证，但最终产品建议使用 LSM6DSV16X 自研方案以获得更好的漂移性能。Suitable for rapid prototype validation, but final product should use LSM6DSV16X custom design for better drift performance.

---

### 2. LCSC / JLC (立创商城 / 嘉立创)

| 属性 Attribute | 详情 Details |
|-----------|---------|
| **位置 Location** | 深圳 Shenzhen |
| **主营产品 Main Products** | 电子元器件一站式采购 One-stop electronic component procurement |
| **价格范围 Price Range** | 芯片原价 Chip original price |
| **购买渠道 Purchase Channels** | [lcsc.com](https://lcsc.com) |

**可采购芯片 (Available Chips):**

| 芯片 Chip | 单价 Price | 库存状态 Stock Status |
|------|-------|--------------|
| LSM6DSV16X | ¥45-55 (~$6-8) | 有货 In Stock |
| ICM-42688-P | ¥25-35 (~$3-5) | 有货 In Stock |
| BMI270 | ¥18-25 (~$2-3) | 有货 In Stock |
| ESP32-S3-WROOM-1 | ¥28-35 (~$4-5) | 有货 In Stock |

**评估 (Assessment):**

- ✅ 官方渠道，芯片质量有保证 Official channel, chip quality guaranteed
- ✅ 可配合嘉立创 PCB 打样服务 Can be combined with JLC PCB prototyping service
- ✅ 支持小批量和大批量采购 Supports small batch and large batch procurement
- ⚠️ 需要自行设计电路和 PCB Requires custom circuit and PCB design

---

### 3. 淘宝/1688 通用卖家 (Taobao/1688 Generic Sellers)

**搜索关键词 (Search Keywords):**

- "9轴IMU模块" (9-axis IMU module)
- "MPU9250模块" (MPU9250 module)
- "LSM6DSV16X模块" (LSM6DSV16X module)
- "ESP32 IMU"

**注意事项 (Cautions):**

- 验证芯片真伪（假货风险）Verify chip authenticity (counterfeit risk)
- 确认技术支持能力 Confirm technical support capability
- 索要原理图和 SDK Request schematics and SDK

---

## EMG 肌电传感器供应商 (EMG Sensor Suppliers)

### 1. DFRobot

| 属性 Attribute | 详情 Details |
|-----------|---------|
| **公司全称 Full Name** | 上海智位机器人股份有限公司 Shanghai Zhiwei Robot Co., Ltd. |
| **位置 Location** | 上海 Shanghai |
| **主营产品 Main Products** | 开源硬件、传感器模块、教育套件 Open source hardware, sensor modules, education kits |
| **购买渠道 Purchase Channels** | 官网、淘宝 Official website, Taobao |
| **官网 Website** | [dfrobot.com](https://www.dfrobot.com) |

**推荐产品 (Recommended Products):**

| 型号 Model | 描述 Description | 价格 Price | 链接 Link |
|-------|-------------|-------|------|
| SEN0240 | 模拟 EMG 传感器 Analog EMG Sensor | ¥319 (~$44) | [Product Page](https://www.dfrobot.com/product-1661.html) |
| SEN0344 | Gravity 心率/EMG 模块 Gravity Heart Rate/EMG Module | ¥169 (~$23) | [Product Page](https://www.dfrobot.com/product-2011.html) |

**SEN0240 详细规格 (Specifications):**

| 参数 Parameter | 值 Value |
|-----------|-------|
| 工作电压 Operating Voltage | 3.3V / 5V |
| 输出类型 Output Type | 模拟信号 Analog signal |
| 增益 Gain | 1000x |
| 带宽 Bandwidth | 25Hz - 500Hz |
| 电极 Electrodes | 3电极（干/湿电极）3-electrode (dry/wet electrode) |
| 尺寸 Size | 25mm × 25mm |

**评估 (Assessment):**

- ✅ 即插即用，适合快速验证 Plug and play, suitable for quick validation
- ✅ 中英文文档和示例代码 English documentation and example code
- ✅ 社区支持良好 Good community support
- ⚠️ 单通道，需多个模块实现多通道 Single channel, needs multiple modules for multi-channel
- ⚠️ 模拟输出需要 ADC 采集 Analog output requires ADC acquisition

---

### 2. Sichiray (思知瑞科技)

| 属性 Attribute | 详情 Details |
|-----------|---------|
| **位置 Location** | 深圳 Shenzhen |
| **主营产品 Main Products** | 生物电信号采集模块 Bioelectrical signal acquisition modules |
| **购买渠道 Purchase Channels** | 淘宝店铺 Taobao store |

**产品特点 (Product Features):**

- 专业级 EMG 模块 Professional-grade EMG modules
- 多通道同步采集 Multi-channel synchronous acquisition
- 支持 Bluetooth/Serial 输出 Bluetooth/Serial output support

**评估 (Assessment):**

- ✅ 专注生物电信号，专业性强 Focused on bioelectrical signals, highly professional
- ✅ 可定制多通道方案 Can customize multi-channel solutions
- ⚠️ 价格相对较高 Relatively higher price
- ⚠️ 技术文档需联系客服 Technical documentation requires contacting customer service

---

### 3. OpenBCI (国内代理 China Distributors)

| 属性 Attribute | 详情 Details |
|-----------|---------|
| **原厂 Original** | OpenBCI (USA) |
| **国内代理 China Distributors** | 淘宝多个代理商 Multiple distributors on Taobao |
| **价格 Price** | ¥800 - ¥3000+ (~$110-400+) |

**产品线 (Product Line):**

- Cyton Board (8通道 8 channels)
- Ganglion Board (4通道 4 channels)
- 配套干电极 Matching dry electrodes

**评估 (Assessment):**

- ✅ 开源硬件，文档完善 Open source hardware, complete documentation
- ✅ 研究级精度 Research-grade accuracy
- ⚠️ 价格较高 Higher price
- ⚠️ 体积较大，不适合可穿戴 Larger size, not suitable for wearables

---

## 电子皮肤相关供应商 (E-Skin Related Suppliers)

### 1. 柔性传感器厂商 (Flexible Sensor Manufacturers)

#### 能斯达电子 (Nanosensor)

| 属性 Attribute | 详情 Details |
|-----------|---------|
| **位置 Location** | 苏州 Suzhou |
| **主营产品 Main Products** | 柔性压力传感器、薄膜传感器 Flexible pressure sensors, thin film sensors |
| **应用领域 Applications** | 机器人、医疗、汽车 Robotics, medical, automotive |
| **联系方式 Contact** | 官网询价 Website inquiry |

#### 华威科技 (Huawei Technology)

| 属性 Attribute | 详情 Details |
|-----------|---------|
| **位置 Location** | 深圳 Shenzhen |
| **主营产品 Main Products** | 柔性电子、可拉伸电路 Flexible electronics, stretchable circuits |
| **技术能力 Capabilities** | 柔性 PCB 定制 Custom flexible PCB |

### 2. 动作捕捉系统 (Motion Capture Systems)

#### Noitom (诺亦腾)

| 属性 Attribute | 详情 Details |
|-----------|---------|
| **位置 Location** | 北京 Beijing |
| **主营产品 Main Products** | 惯性动作捕捉系统 Inertial motion capture systems |
| **代表产品 Representative Product** | Perception Neuron |
| **价格范围 Price Range** | ¥10,000 - ¥50,000+ (~$1,400-7,000+) |
| **官网 Website** | [noitom.com](https://noitom.com) |

**评估 (Assessment):**

- ✅ 国内动捕领域领导者 Leader in domestic motion capture field
- ✅ 全身多节点追踪 Full-body multi-node tracking
- ⚠️ 价格超出消费级预算 Price exceeds consumer-grade budget
- ⚠️ 面向影视/游戏专业市场 Targets film/game professional market

---

## 推荐采购方案 (Recommended Procurement Plan)

### MVP 原型阶段 (MVP Prototype Phase)

| 组件 Component | 供应商 Supplier | 型号 Model | 单价 Unit Price | 数量 Qty | 小计 Subtotal |
|-----------|----------|-------|------------|-----|----------|
| MCU 模组 MCU Module | LCSC | ESP32-S3-WROOM-1 | ¥32 (~$4.50) | 2 | ¥64 |
| IMU 传感器 IMU Sensor | LCSC | LSM6DSV16X | ¥50 (~$7) | 2 | ¥100 |
| EMG 模块 EMG Module | DFRobot | SEN0240 | ¥319 (~$44) | 2 | ¥638 |
| PCB 打样 PCB Prototype | JLC | 5片 5 pieces | ¥50 (~$7) | 1 | ¥50 |
| 连接器/被动元件 Connectors/Passives | LCSC | - | ¥100 (~$14) | 1 | ¥100 |
| 锂电池 Li-Po Battery | 淘宝 Taobao | 3.7V 500mAh | ¥15 (~$2) | 2 | ¥30 |
| 外壳（3D打印）Enclosure (3D Print) | JLC | - | ¥50 (~$7) | 2 | ¥100 |
| **总计 Total** | | | | | **¥1,082 (~$150)** |

### 快速验证方案 (Quick Validation Plan)

如果需要更快速的原型验证，可使用现成模组：For faster prototype validation, use ready-made modules:

| 组件 Component | 供应商 Supplier | 型号 Model | 价格 Price |
|-----------|----------|-------|-------|
| IMU 模组 IMU Module | WitMotion | WT901BLECL | ¥158 (~$22) |
| EMG 模块 EMG Module | DFRobot | SEN0240 | ¥319 (~$44) |
| 开发板 Dev Board | 淘宝 Taobao | ESP32-S3-DevKitC | ¥45 (~$6) |
| **总计 Total** | | | **¥522 (~$72)** |

**优势 (Advantages):**

- 无需 PCB 设计，即买即用 No PCB design needed, ready to use
- 1-2 周内可完成硬件搭建 Hardware setup can be completed within 1-2 weeks
- 适合算法验证和用户测试 Suitable for algorithm validation and user testing

---

## 采购注意事项 (Procurement Notes)

### 芯片真伪验证 (Chip Authenticity Verification)

1. **优先官方渠道 Prioritize Official Channels**: LCSC, Digi-Key, Mouser
2. **验证方式 Verification Methods**:
   - 检查芯片丝印清晰度 Check chip silkscreen clarity
   - 验证 WHO 寄存器返回值 Verify WHO register return values
   - 测试关键性能参数 Test key performance parameters
3. **避免风险 Risk Avoidance**: 不从不明来源采购核心芯片 Do not purchase core chips from unknown sources

### 技术支持评估 (Technical Support Assessment)

| 等级 Level | 描述 Description | 供应商示例 Supplier Examples |
|-------|-------------|-------------------|
| 优秀 Excellent | 完整文档 + 示例代码 + 技术支持 Complete documentation + sample code + tech support | DFRobot, WitMotion |
| 良好 Good | 数据手册 + 基础示例 Datasheet + basic examples | LCSC |
| 一般 Average | 仅数据手册 Datasheet only | 淘宝通用卖家 Generic Taobao sellers |
| 差 Poor | 无文档 No documentation | 避免采购 Avoid purchasing |

### 批量采购策略 (Bulk Procurement Strategy)

| 阶段 Phase | 数量 Quantity | 渠道 Channel | 折扣预期 Expected Discount |
|-------|----------|---------|-------------------|
| 原型 Prototype | 1-10 | 淘宝/LCSC Taobao/LCSC | 无 None |
| 小批量 Small Batch | 10-100 | 1688/厂家 1688/Factory | 5-15% |
| 量产 Mass Production | 1000+ | 厂家直接 Factory Direct | 20-40% |

---

## 供应商联系方式汇总 (Supplier Contact Summary)

| 供应商 Supplier | 平台 Platform | 链接/搜索关键词 Link/Search Keywords |
|----------|----------|---------------------|
| WitMotion | 淘宝 Taobao | 搜索"维特智能官方店" Search "维特智能官方店" |
| DFRobot | 官网/淘宝 Website/Taobao | dfrobot.com |
| LCSC | 官网 Website | lcsc.com |
| Sichiray | 淘宝 Taobao | 搜索"思知瑞EMG" Search "思知瑞EMG" |
| JLC | 官网 Website | jlc.com |
| Noitom | 官网 Website | noitom.com |

---

## 结论 (Conclusions)

1. **IMU 采购 IMU Procurement**: 原型阶段使用 WitMotion 模组，量产使用 LSM6DSV16X 自研方案 Use WitMotion modules for prototyping, use LSM6DSV16X custom design for production
2. **EMG 采购 EMG Procurement**: DFRobot SEN0240 是性价比最高的入门选择 DFRobot SEN0240 is the best value entry choice
3. **整体成本 Overall Cost**: MVP 原型约 ¥500-1000 ($70-140)，远低于海外开发板方案 MVP prototype ~¥500-1000 ($70-140), much lower than overseas development board solutions
4. **供应链优势 Supply Chain Advantage**: 国内供应商发货快、沟通方便、可定制 Domestic suppliers ship fast, communicate easily, and can customize

---

**最后更新**: 2025 年 12 月 12 日
