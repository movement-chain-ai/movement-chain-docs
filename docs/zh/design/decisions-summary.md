# 决策摘要 Decisions Summary

> **关键架构决策的快速参考**
>
> 完整ADR文档见: [decisions/](decisions/index.md)

---

## ADR 概览

| ADR | 决策 | 状态 | 核心理由 |
|-----|------|-----|---------|
| [0001](decisions/0001-multi-repo-structure.md) | 多仓库结构 | 已接受 | 独立部署、团队分工、技术栈隔离 |
| [0002](decisions/0002-lsm6dsv16x-imu.md) | LSM6DSV16X IMU | 已接受 | 45+分钟漂移稳定、内置MLC |
| [0003](decisions/0003-flutter-mobile.md) | Flutter 移动端 | 已接受 | 跨平台、快速迭代、热重载 |
| [0004](decisions/0004-simplified-4-module-architecture.md) | 4模块架构 | 已接受 | MVP精简、3-4个月可交付 |
| [0005](decisions/0005-esp32-s3-microcontroller.md) | ESP32-S3 | 已接受 | BLE5.0、低功耗、成本优势 |
| [0006](decisions/0006-onnx-runtime-deployment.md) | ONNX Runtime | 已接受 | RTMPose兼容、跨平台推理 |

---

## 关键决策详解

### ADR-0002: 为什么选 LSM6DSV16X?

**对比 BNO055 (已停产)**:

| 指标 | LSM6DSV16X | BNO055 |
|-----|-----------|--------|
| 漂移重置时间 | >45分钟 | 15-20分钟 |
| 机器学习核心 | ✅ 内置MLC | ❌ 无 |
| 生产周期 | 10+年保证 | 已停产 |

### ADR-0004: 为什么4模块而非7模块?

学术研究定义7模块，但MVP只需4个:

```text
理论7模块: 评估→诊断→处方→纠正(实时)→纠正(事后)→跟踪→激励

实用4模块: 评估 → 诊断 → 纠正 → 跟踪
                         ↑
                   合并实时+事后
```

**理由**: Hole19 (300万用户) 无训练计划模块仍成功

### ADR-0006: 为什么ONNX而非TFLite?

- RTMPose 官方只提供 ONNX 格式
- ONNX→TFLite 转换有损
- ONNX Runtime Mobile: ~14-17MB 总占用

---

## 决策影响

| 决策 | 影响的文档 |
|-----|----------|
| IMU选型 | [硬件规格](../components/imu/hardware.md) |
| Flutter | [移动开发](../platform/mobile/development.md) |
| 4模块架构 | [系统设计](system-design.md) |
| ONNX | [MVP原型代码](../platform/mvp-prototype-code.md) |

---

## 待定决策

- EMG 传感器选型 (Phase 2)
- 云端 vs 边缘推理策略
- 数据隐私架构

---

**最后更新**: 2025年12月12日
