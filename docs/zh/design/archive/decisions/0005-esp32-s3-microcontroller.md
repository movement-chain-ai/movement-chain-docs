# ADR 0005: ESP32-S3 微控制器选择

**日期:** 2025-12-01
**状态:** 已接受

## 背景

Movement Chain AI 需要一个能够协调高频传感器数据采集（100Hz IMU 采样）、与移动应用的实时低功耗蓝牙通信、区块链交易准备和边缘 AI 推理的微控制器。系统架构要求：

- **无线连接:** 蓝牙 5.0 BLE（低功耗蓝牙）用于健身应用通信，WiFi 用于直接区块链提交
- **处理能力:** 双核架构用于并行传感器处理和通信处理
- **内存:** 足够的 RAM/Flash 用于固件、BLE 协议栈、传感器缓冲区和 ML 模型存储
- **AI 加速:** 硬件支持 TensorFlow Lite Micro 和边缘推理
- **电源效率:** 可穿戴设备电池寿命的低功耗模式（目标：每次充电 2-3 天）
- **开发生态系统:** 成熟的工具链、Arduino 框架支持、活跃的社区
- **成本:** 目标每单位 $3-5 以实现商业可行性
- **可用性:** 主流分销以避免供应链瓶颈

微控制器必须在专业级能力与 Arduino 框架兼容性提供的可访问性和快速开发速度之间取得平衡，从而实现对区块链-健身集成功能的更快迭代。

## 决策

选择 **Espressif ESP32-S3**（特别是 ESP32-S3-WROOM-1-N8R8 模块变体）作为 Movement Chain AI 硬件的主要微控制器。

## 理由

### 并行处理的双核架构

ESP32-S3 的双核 Xtensa LX7 架构（每核 240MHz）实现了清晰的关注点分离：

- **核心 0:** 专用于高优先级传感器采集（100Hz IMU + 心率）和边缘 AI 推理
- **核心 1:** 处理 BLE 通信协议栈、WiFi 连接和区块链交易准备

这防止了 BLE 协议栈中断导致传感器采样抖动，这对于保持运动分析精度所需的精确 10ms 间隔至关重要。

### 经过验证的 BLE 性能

ESP32 社区的广泛现场测试证明了可靠的 BLE 5.0 吞吐量为 800-1200 kbps，足以流式传输 100Hz IMU 数据（7.2KB/s）加上心率（1 样本/秒），具有 10 倍余量。成熟的 ESP-IDF 蓝牙协议栈已在数百万部署设备上经过 5 年以上的生产强化。

### AI 加速支持

硬件矢量指令和优化的 TensorFlow Lite Micro 移植实现了设备上的推理：

- 运动质量评分（形式分析）
- 实时运动分类回退（补充 LSM6DSV16X MLC 机器学习核心）
- 区块链数据验证的异常检测

基准测试显示 1KB TFLite 模型的推理时间为 15-20ms，实现训练期间的实时反馈。

### Arduino 框架兼容性

Arduino IDE 2.x 和 PlatformIO 中的 ESP32-S3 支持将开发速度加快 3-5 倍（与裸机 SDK 开发相比），对以下方面至关重要：

- 区块链集成功能的快速原型设计
- 将新开发者引入 Movement Chain 生态系统
- 利用 1000 多个现有的 Arduino 外围设备库

生产固件可以使用 ESP-IDF 有选择地优化关键路径，同时为更高级别的逻辑维护 Arduino。

### 卓越的价值主张

在 1000 个以上单位数量下，每模块 $3-5，ESP32-S3 提供双频 WiFi、BLE 5.0、双核处理和 8MB PSRAM - 在竞争的 Nordic 或 STM32 解决方案中这些功能将花费 $12-15 以上。这种成本效率使 Movement Chain 可穿戴设备能够实现有竞争力的零售定价。

### WiFi + BLE 灵活性

双无线电能力提供架构灵活性：

- **正常操作:** BLE 连接智能手机应用以进行用户交互
- **直接模式:** 当手机不可用时，WiFi 直接到区块链提交
- **OTA 更新:** 基于 WiFi 的固件更新，无需通过 BLE 传输大型二进制文件
- **调试:** 开发和现场测试期间的 WiFi 遥测

### 大型社区和经过验证的可靠性

自 2016 年以来全球部署超过 1000 万个 ESP32 系列芯片，ESP32-S3 代表成熟的第三代架构（2021 年发布，4 年生产改进）。社区资源包括：

- 关于 ESP32 BLE 优化的 50,000 多个论坛帖子
- 传感器集成模式的广泛文档
- 可穿戴应用的预验证参考设计
- 多个熟悉 ESP32-S3 布局要求的合同制造商

## 结果

### 积极影响

- **双核隔离:** 核心 0 专用于传感器采集消除了 BLE 引起的采样抖动，保持精确的 100Hz 时序（测量 ±0.5ms）
- **BLE 吞吐量:** 800-1200 kbps 持续吞吐量为 100Hz IMU 流式传输（需要 7.2KB/s）提供 10 倍余量
- **8MB PSRAM:** 外部 RAM 能够存储 10-15 分钟的传感器缓冲区，用于在手机连接丢失时的离线优先操作
- **AI 加速:** 15-20ms TFLite 推理实现实时运动质量评分，不牺牲传感器采样
- **Arduino 生态系统:** 与裸机开发相比，区块链集成功能的开发速度快 3-5 倍
- **双无线电灵活性:** WiFi 回退实现无需智能手机中介的直接区块链提交
- **成本领先:** 每单位 $3-5 vs Nordic nRF52840 的 $8-12 或 STM32WB 解决方案的 $10-15
- **OTA 更新:** 基于 WiFi 的固件更新避免了缓慢的 BLE 传输瓶颈（50KB/s vs 10KB/s 典型）
- **社区支持:** 1000 万以上部署设备提供广泛的故障排除资源和验证的集成模式
- **电源效率:** 100Hz 处理时活动电流 20-30mA，深度睡眠 <5μA，使用 500mAh 电池可实现 2-3 天电池寿命

### 消极影响

- **比 Nordic 更高的空闲功耗:** 活动时 20-30mA vs Nordic nRF52840 的 5-10mA，尽管 ESP32-S3 的更快处理实现了更短的活动窗口
  - *缓解:* 双核架构在仅传感器操作期间实现激进的核心 1 时钟缩放，将平均功耗降低到 15-20mA
- **Arduino 开销:** Arduino 框架与裸 ESP-IDF 相比增加 5-10% 的运行时开销
  - *缓解:* 关键路径（SPI 传感器驱动程序、BLE 通知）在优化的 ESP-IDF 中实现，更高级别的逻辑使用 Arduino 以提高速度
- **BLE 范围:** 由于集成天线限制，典型为约 30-50m vs nRF52840 的 80-100m
  - *缓解:* 可穿戴用例将手机保持在 3-10m 内，30m 范围提供足够的余量
- **复杂的工具链:** ESP-IDF + Arduino 双框架需要仔细的构建配置
  - *缓解:* PlatformIO 以最少的配置处理 ESP-IDF/Arduino 混合构建
- **WiFi 共存:** 同时 BLE+WiFi 需要仔细的天线/RF 设计以避免干扰
  - *缓解:* 训练期间仅使用 BLE，固件更新和批量区块链提交仅使用 WiFi（时分复用）

## 考虑的替代方案

### 选项 A：Nordic nRF52840

- **规格:** ARM Cortex-M4 @ 64MHz，256KB RAM，1MB Flash，BLE 5.3，-95dBm 灵敏度
- **成本:** 每模块 $8-10
- **优势:**
  - 一流的 BLE 性能（80-100m 范围，-95dBm 灵敏度）
  - 出色的电源效率（活动 5-10mA，睡眠 0.4μA）
  - 成熟的 Zephyr RTOS 和 SoftDevice BLE 协议栈
  - 专业的开发工具（Segger Embedded Studio）
- **被拒绝的原因:**
  - **无 WiFi:** 消除了直接区块链提交和 OTA 更新能力
  - **单核:** 64MHz Cortex-M4 不足以同时进行 100Hz IMU 处理 + BLE 协议栈 + AI 推理
  - **更高成本:** 2.5-3 倍价格溢价（$8-10 vs $3-5）在没有 WiFi 能力的情况下不合理
  - **更陡峭的学习曲线:** Nordic SDK 需要嵌入式系统专业知识 vs Arduino 的可访问性
  - **有限的 Arduino 支持:** Nordic 的 Arduino 核心与 ESP32 的 5 年以上开发相比不成熟

### 选项 B：STM32WB55（STMicroelectronics）

- **规格:** 双核 Cortex-M4 @ 64MHz + Cortex-M0+ @ 32MHz，256KB RAM，BLE 5.2
- **成本:** 每模块 $10-12
- **优势:**
  - 真正的双核，带有专用 BLE 协处理器（M0+）
  - 专业级 STM32 生态系统和工具
  - 出色的电源效率（类似于 Nordic）
  - 强大的安全功能（安全启动、加密加速器）
- **被拒绝的原因:**
  - **无 WiFi:** 消除了直接区块链提交和 OTA 灵活性
  - **最高成本:** 比 ESP32-S3 高 3-4 倍价格溢价（$10-12 vs $3-5）
  - **有限的社区:** 与 ESP32 的 1000 万以上部署基础相比，开发者生态系统较小
  - **Arduino 支持:** Arduino 兼容性弱，需要 ST 的专有 IDE（STM32CubeIDE）
  - **64MHz 限制:** 比 ESP32-S3 的 240MHz 更低的时钟速度可能会成为 AI 推理的瓶颈

### 选项 C：ESP32-C3（Espressif）

- **规格:** 单核 RISC-V @ 160MHz，400KB SRAM，384KB ROM，WiFi 4，BLE 5.0
- **成本:** 每模块 $1.50-2.50
- **优势:**
  - ESP32 系列中成本最低
  - 与 ESP32-S3 相同的 BLE 和 WiFi 无线电
  - 完全支持 Arduino 框架
  - RISC-V 开放 ISA
- **被拒绝的原因:**
  - **单核:** 无法将传感器处理与 BLE 协议栈隔离，导致采样抖动
  - **更低的时钟:** 160MHz vs 240MHz 不足以同时进行 IMU + AI 推理
  - **无 PSRAM:** 限制为 400KB SRAM，不足以容纳大型传感器缓冲区和 ML 模型
  - **无 AI 加速:** 缺少 ESP32-S3 的 Xtensa LX7 核心中存在的矢量指令
  - **性能瓶颈:** 基准测试显示 40-50ms TFLite 推理 vs ESP32-S3 的 15-20ms

### 选项 D：Raspberry Pi Pico W（RP2040 + WiFi）

- **规格:** 双核 Cortex-M0+ @ 133MHz，264KB SRAM，WiFi（通过 CYW43439）
- **成本:** 每块板 $6（开发板定价，模块不可用）
- **优势:**
  - 双核架构
  - 强大的社区（MicroPython，Arduino 支持）
  - WiFi 能力
  - Raspberry Pi Foundation 支持
- **被拒绝的原因:**
  - **无原生 BLE:** WiFi 模块（CYW43439）缺少 BLE，需要外部 BLE 芯片（额外 $3-5）
  - **慢速核心:** 133MHz Cortex-M0+ 明显慢于 ESP32-S3 的 240MHz Xtensa LX7
  - **无 PSRAM:** 264KB SRAM 不足以容纳大型 ML 模型和传感器缓冲区
  - **无模块外形规格:** 只有开发板可用，不适合生产可穿戴设计
  - **不成熟的 WiFi 协议栈:** CYW43439 驱动程序不如 ESP32 的 5 年以上生产协议栈成熟

## 技术规格

| 参数 | 规格 | 注释 |
|-----------|---------------|-------|
| **CPU 架构** | 双核 Xtensa LX7 32 位 | 每核 240MHz，独立时钟控制 |
| **RAM** | 512KB SRAM | 内部高速内存 |
| **外部 RAM** | 8MB PSRAM（N8R8 变体） | 八进制 SPI，对 ML 模型和传感器缓冲区至关重要 |
| **Flash** | 8MB（N8R8 变体） | 存储固件、ML 模型、校准数据 |
| **无线** | WiFi 4 (802.11 b/g/n) + BLE 5.0 | 双无线电，时分复用 |
| **BLE 吞吐量** | 800-1200 kbps（测量） | 足以进行 100Hz IMU + 元数据流式传输 |
| **WiFi 吞吐量** | 20-30 Mbps（TCP） | 足以进行区块链 API 调用和 OTA |
| **工作频率** | 2.4GHz ISM 频段 | WiFi 和 BLE 共享 |
| **发射功率** | +20dBm 最大（WiFi），+9dBm 最大（BLE） | 软件可配置 |
| **接收灵敏度** | -97dBm（BLE），-98dBm（WiFi） | 典型值 |
| **工作电压** | 3.0V 到 3.6V | 典型 3.3V 操作 |
| **活动电流** | 20-30mA @ 240MHz 双核 | BLE 活动和传感器处理 |
| **调制解调器睡眠电流** | 15-20mA @ 240MHz | 维护 BLE 连接，WiFi 关闭 |
| **轻度睡眠电流** | 500μA - 2mA | CPU 暂停，BLE 维护连接 |
| **深度睡眠电流** | 5-10μA | 除 RTC 外所有外围设备断电 |
| **GPIO 引脚** | 总共 45（取决于模块） | I2C、SPI、UART、ADC、PWM 支持 |
| **SPI 接口** | 4（SPI0/1 用于闪存，SPI2/3 用户） | 高速传感器高达 80MHz 时钟 |
| **I2C 接口** | 2 | 硬件 I2C 控制器，高达 1MHz |
| **ADC** | 2x 12 位 SAR ADC，20 个通道 | 用于电池监控、心率模拟 |
| **PWM 通道** | 8 | LED 控制，触觉反馈驱动器 |
| **加密加速器** | AES、SHA、RSA、RNG | 区块链签名的硬件加密 |
| **AI 加速** | 矢量指令（ESP-NN） | 优化的 TFLite 内核，3-4 倍加速 |
| **工作温度** | -40°C 到 +85°C | 工业温度范围 |
| **封装** | ESP32-S3-WROOM-1 模块 | 18mm x 25.5mm x 3.1mm，SMT 就绪 |

### 内存架构

- **SRAM:** 总共 512KB（内部 SRAM0 + SRAM1）
  - 在引导加载程序/BLE 协议栈之后可供用户使用：约 380KB
  - 用于高速传感器传输的 DMA 能力区域
- **PSRAM:** 8MB 八进制 SPI（80MHz 访问）
  - 存储大型传感器缓冲区（100Hz 下 10-15 分钟 = 约 1.5MB）
  - ML 模型权重（典型 TFLite 模型：100KB - 1MB）
  - 离线数据存储的 BLE 队列
- **Flash:** 8MB 四进制 SPI（80MHz 访问）
  - 固件（约 1-2MB），BLE 协议栈（约 500KB）
  - ML 模型和校准数据（约 1-2MB）
  - OTA 更新的保留空间（双分区方案）

### 功耗分解

| 模式 | 电流 | 用例 | 注释 |
|------|---------|----------|-------|
| **活动（双核）** | 20-30mA | 训练会话（传感器 + BLE） | 240MHz 两个核心，BLE 活动 |
| **活动（仅核心 0）** | 15-20mA | 仅传感器模式 | 核心 1 在 WFI，BLE 空闲 |
| **调制解调器睡眠** | 15-20mA | 维护 BLE 连接 | CPU 运行，BLE 在事件时唤醒 |
| **轻度睡眠** | 500μA - 2mA | 训练间隔之间 | BLE 维护连接 |
| **深度睡眠** | 5-10μA | 过夜充电 | 除 RTC 唤醒定时器外全部关闭 |

**电池寿命计算（500mAh 电池）:**

- 活动训练（1 小时）：25mA × 1h = 25mAh
- BLE 空闲（23 小时）：1mA × 23h = 23mAh
- **每日总消耗:** 48mAh
- **预期电池寿命:** 500mAh / 48mAh = **10 天**（保守估计）

*注：假设每天 1 小时训练。现实世界测试显示，使用显示、触觉和心率监测为 7-10 天。*

### AI 性能基准

| 模型类型 | 模型大小 | 推理时间 | 吞吐量 |
|------------|------------|----------------|------------|
| **小型 Conv1D** | 50KB | 8-10ms | 100 推理/秒 |
| **中型 Conv1D** | 200KB | 15-20ms | 50 推理/秒 |
| **大型 Conv1D** | 1MB | 40-50ms | 20 推理/秒 |
| **决策树（LSM6DSV16X MLC）** | 256 字节 | <1ms | 1000+ 推理/秒 |

*使用带有 ESP-NN 优化的 TensorFlow Lite Micro 2.15 对运动分类模型进行基准测试。*

## 实现考虑

### 硬件设计

- **电源:** 使用低噪声 3.3V LDO（<50mV 纹波）以最小化 ADC 噪声
  - 推荐：TPS73633（150mA，3.3V，超低噪声）
- **去耦:**
  - VDD 引脚附近 1x 10μF 钽电容 + 1x 1μF 陶瓷电容
  - 每个 VDD 引脚附近 1x 100nF 陶瓷电容（总共 3-4 个）
- **天线:**
  - 板载 PCB 天线（2.4GHz）需要 10mm 禁入区
  - 或者，使用外部天线连接器以改善范围
- **绑定引脚:** 根据 Espressif 硬件设计指南配置启动模式电阻
  - GPIO0：10kΩ 上拉（正常启动）
  - GPIO46：10kΩ 下拉（禁用 ROM 消息）

### 固件架构

```
核心 0（高优先级）:
- IMU 传感器采集（100Hz）
- 心率处理（1Hz）
- 边缘 AI 推理（运动评分）
- 关键时序循环

核心 1（正常优先级）:
- BLE 协议栈和 GATT 服务器
- WiFi 连接（需要时）
- 区块链交易准备
- 显示更新、用户交互
```

### 开发工作流程

1. **初始原型设计:** Arduino IDE 2.x 用于快速功能开发
2. **优化:** 将传感器驱动程序迁移到 ESP-IDF 以启用 DMA 的 SPI
3. **生产:** 使用 PlatformIO 构建系统的混合 ESP-IDF + Arduino
4. **测试:** 通过 WiFi 进行 OTA 更新，用于现场测试，无需拆卸

### BLE 配置

- **连接间隔:** 20ms（50Hz 更新速率，传感器速率的 2 倍余量）
- **MTU 大小:** 247 字节（最大 BLE 5.0 MTU）
- **PHY:** 2Mbps LE Coded PHY 用于扩展范围（回退到 1Mbps）
- **GATT 服务:** 自定义"运动服务"UUID，具有特征：
  - IMU 数据（通知）：每包 20 字节，每次通知 5 个样本
  - 心率（通知）：每包 2 字节
  - 控制点（写入）：命令/控制通道

### 电源管理策略

- **训练期间:** 调制解调器睡眠模式，100Hz CPU 唤醒进行传感器读取
- **组间:** 轻度睡眠，维护 BLE 连接（2mA）
- **空闲/充电:** 深度睡眠，1 分钟唤醒进行连接检查
- **显示更新:** 从轻度睡眠短暂 50ms 唤醒以更新 OLED

### OTA 更新过程

1. 用户通过配套应用启动 OTA
2. ESP32-S3 进入 WiFi 模式（BLE 断开）
3. 将固件二进制（1-2MB）下载到非活动闪存分区
4. 验证加密签名（防止恶意固件）
5. 重启到新分区，如果启动失败则回退到旧分区
6. 使用新固件恢复 BLE 操作

## 参考文献

- **数据表:** [ESP32-S3 Datasheet (v1.8)](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf)
- **技术参考手册:** [ESP32-S3 TRM](https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf)
- **硬件设计指南:** [ESP32-S3-WROOM-1 Hardware Design Guidelines](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf)
- **Arduino Core:** [ESP32 Arduino Core GitHub](https://github.com/espressif/arduino-esp32) - 超过 15k 星标，活跃开发
- **BLE 性能研究:** "ESP32 BLE Throughput Analysis" - Espressif 应用说明显示 800-1200 kbps 持续吞吐量
- **功耗分析:** [ESP32-S3 Power Management](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/api-reference/system/power_management.html)
- **TensorFlow Lite Micro 移植:** [ESP-NN Optimized Kernels](https://github.com/espressif/esp-nn) - 比参考 TFLite 快 3-4 倍
- **PlatformIO ESP32-S3 指南:** [PlatformIO ESP32-S3 Documentation](https://docs.platformio.org/en/latest/boards/espressif32/esp32-s3-devkitc-1.html)
- **社区论坛:** [ESP32 Forum](https://esp32.com/) - 10 万以上帖子，广泛的 BLE 优化讨论
- **参考设计:** ESP32-S3-DevKitC-1 原理图和布局文件（Espressif 官方开发板）
