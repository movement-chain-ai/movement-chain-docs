# 快速开始 Getting Started

> **5分钟运行原型，无需硬件**

---

## 1. 安装依赖

```bash
pip install mediapipe opencv-python numpy neurokit2
```

## 2. 运行原型

```bash
# 下载或创建 mvp_prototype.py (见下方链接)
python mvp_prototype.py

# 按 's' 查看详细分析
# 按 'q' 退出
```

## 3. 测试不同场景

原型内置 Mock 数据生成器，可模拟各种问题场景：

| 场景 | 参数设置 | 预期结果 |
|------|---------|---------|
| 正常挥杆 | `core=0.6, forearm=0.6` | 评分 80+ |
| 核心不足 | `core=0.3, forearm=0.8` | 检测到手臂代偿 |
| 发力过猛 | `core=0.9, forearm=0.9` | 建议放松 |

详细代码和参数说明见: [MVP原型代码](../platform/mvp-prototype-code.md)

---

## 文档导航

| 想了解... | 去看... |
|----------|--------|
| 完整可运行代码 | [MVP原型代码](../platform/mvp-prototype-code.md) |
| Mock 数据如何设计 | [挥杆对比策略 - 全身数据采集](swing-comparison.md#全身数据采集-full-body-data-collection) |
| 四种对比方法 | [挥杆对比策略 - 四种方法](swing-comparison.md#四种对比方法-four-comparison-approaches) |
| SDK/库选型理由 | [SDK选型指南](sdk-selection.md) |
| 系统整体架构 | [系统设计](system-design.md) |

---

## 下一步

1. **理解架构**: 阅读 [系统设计](system-design.md) 了解 MVP 管道
2. **深入对比算法**: 阅读 [挥杆对比策略](swing-comparison.md) 了解参考模型
3. **连接真实硬件**: 替换 Mock 为 BLE IMU 数据
4. **移植 Flutter**: 构建移动端 App ([开发指南](../platform/mobile/development.md))

---

**最后更新**: 2025年12月12日
