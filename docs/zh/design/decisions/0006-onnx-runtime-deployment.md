# ADR 0006: ONNX Runtime 用于 ML 模型部署

**日期:** 2025-12-01
**状态:** 已接受

## 背景

Movement Chain AI 需要使用 **RTMPose-m** 模型进行设备上的姿态估计，以实现实时人体运动分析。关键部署要求：

- **模型可用性**: RTMPose-m 以 ONNX 格式正式发布（不是 TensorFlow Lite）
- **跨平台推理**: 必须在 iOS 和 Android 上以一致的性能运行
- **模型灵活性**: 需要能够在不重新编译应用的情况下更新/交换模型
- **二进制大小限制**: 移动应用大小预算限制框架开销
- **性能目标**: 中端设备上 30-50ms 推理延迟（60 FPS 摄像头处理）

推理运行时必须在模型格式兼容性、部署灵活性和性能优化之间取得平衡，同时与 Flutter 的生态系统集成。

## 决策

采用 **ONNX Runtime Mobile** 作为主要 ML 推理引擎，**TensorFlow Lite** 作为 ONNX 格式不可用模型的回退。

---

## MVP1 实施说明 (2025-12 更新)

!!! info "阶段性实施策略"
    **发现**: MediaPipe 内置 TFLite 推理引擎，MVP1 阶段 ONNX Runtime 是**冗余的**。

    本 ADR 决策保持有效，但实施时间调整为 **Phase 2+**。

### 技术发现

```text
MediaPipe 内部架构:
MediaPipe Pose
    └── BlazePose Model
        └── TFLite Runtime (内置)  ← 无需额外推理引擎

原计划: MediaPipe → 转换 → ONNX Runtime → 推理
新发现: MediaPipe → TFLite (内置) → 直接推理 ✅
```

### 阶段性实施

| 阶段 | 推理引擎 | 模型 | 原因 |
|------|---------|------|------|
| **MVP1** | TFLite (MediaPipe 内置) | BlazePose | 开箱即用，零配置 |
| **Phase 2** | ONNX Runtime | RTMPose | 更高精度 (AP 75.8% vs 65%) |
| **Phase 3** | ONNX Runtime | 自定义模型 | 高尔夫特化训练 |

### ONNX 仍然需要的场景

本 ADR 在以下场景仍然适用：

- **RTMPose 部署**: PyTorch → ONNX 是官方发布格式
- **自定义高尔夫模型**: 训练后需要跨平台部署
- **跨平台统一推理**: Web/iOS/Android 统一推理管道
- **模型 A/B 测试**: 远程配置动态加载模型

### 依赖影响

```diff
# MVP1 pyproject.toml
- "onnxruntime>=1.19.0",    # 移除 - MediaPipe 自带 TFLite
+ # ONNX Runtime 延迟到 Phase 2 引入
```

**相关决策**: 详见 [2025年12月关键技术决策](key-decisions-2025-12.md) §1.2

---

## 理由

### 模型格式兼容性

- **RTMPose-m 可用性**: ONNX 是 MMPose 的官方发布格式
  - PyTorch → ONNX 导出：MMPose 框架中的原生支持
  - ONNX → TFLite 转换：有损过程，MMPose 团队不正式支持
  - **结果**: 使用 ONNX 避免转换伪影并保持模型完整性

### 框架灵活性

ONNX Runtime 提供框架不可知的部署：

| 模型源 | ONNX Runtime | 仅 TFLite |
|--------------|--------------|-------------|
| PyTorch 模型 | ✅ 直接导出 | ❌ 需要多步转换 |
| TensorFlow 模型 | ✅ 通过 ONNX 导出 | ✅ 原生支持 |
| ONNX 模型 | ✅ 原生支持 | ❌ 需要转换（有损） |
| 未来模型更新 | ✅ 即插即用替换 | ⚠️ 可能需要重新转换 |

**优势**: 团队可以在 PyTorch/TensorFlow 中训练并部署格式相同的模型，而无需维护单独的管道。

### 二进制大小比较

对于单模型移动应用：

| 运行时 | 基础库大小 | RTMPose-m 模型 | 总占用空间 |
|---------|-------------------|-----------------|-----------------|
| **ONNX Runtime Mobile** | 约 5-8 MB | 约 9 MB（float32） | **约 14-17 MB** |
| TensorFlow Lite | 约 1.5-2 MB | N/A（模型不可用） | N/A |
| TFLite + 转换工具 | 约 4-6 MB | 约 12 MB（带有转换伪影） | **约 16-18 MB** |

**注:** TFLite 的基础库更小，但 ONNX Runtime 的优化移动构建（仅带有 ARM NEON 内核）在我们的用例中实现了可比的总大小。

### 模型更新灵活性

ONNX Runtime 启用高级部署策略：

- **A/B 测试**: 为用户群动态加载不同的模型版本
- **渐进式推出**: 通过远程配置更新模型，无需应用商店提交
- **联邦学习**: 训练个性化模型并以标准化 ONNX 格式部署
- **模型量化**: FP32 → INT8 量化，无需重新训练（ONNX 工具链）

### 性能特征

目标硬件上的推理延迟（iPhone 12 Pro / Pixel 6）：

| 操作 | ONNX Runtime | TFLite（估计） |
|-----------|--------------|---------------------|
| RTMPose-m 推理 | 35-45ms（FP32） | 30-40ms（如果转换） |
| 模型加载 | 约 200ms | 约 150ms |
| 内存占用 | 约 180MB | 约 160MB |

**可接受的权衡**: 比 TFLite 慢 5-10ms，但消除了转换风险并启用更广泛的模型生态系统。

### Flutter 集成

- **包**: `onnxruntime_v2`（v1.16.3）- 社区维护，跨平台
  - iOS：CoreML 委托用于硬件加速
  - Android：NNAPI 委托（GPU/DSP 卸载）
- **回退**: `tflite_flutter`（v0.10.4+）- 官方 Google 插件
  - 用于 TFLite 格式原生可用的模型（例如，用于预处理的 MobileNet）

## 结果

### 积极影响

- **模型可用性**: RTMPose-m 可部署，无需有损格式转换
- **框架独立性**: 不锁定到 TensorFlow 生态系统（PyTorch 模型同样支持）
- **部署敏捷性**: 通过远程配置更新模型（30 分钟推出 vs 3 天应用审核）
- **面向未来**: ONNX 是跨行业标准（Microsoft、Facebook、AWS 都有贡献）
- **量化工具链**: ONNX 提供丰富的训练后优化工具
- **二进制大小**: 14-17 MB 总计（对移动 ML 应用可接受）

### 消极影响

- **Flutter 集成成熟度**: `onnxruntime_v2` 是社区维护的（vs 官方 TFLite 插件）
  - 风险：Flutter 引擎中的重大更改可能需要插件更新
  - 缓解：固定插件版本，如果需要向上游贡献修复
- **性能差距**: 在相同模型上比原生 TFLite 慢 5-10ms（当两者都可用时）
  - 影响：对于 60 FPS 目标可忽略不计（16.6ms 帧预算 - 35ms 推理 = 可接受）
- **调试复杂性**: ONNX Runtime 错误消息不如 TFLite 详细
  - 缓解：部署前使用 Netron 工具验证模型
- **iOS 二进制大小**: CoreML 委托在 iOS 上增加约 3MB（仍在预算内）
- **学习曲线**: 团队必须了解 ONNX 格式和优化工具（onnxruntime-tools）

### 缓解策略

1. **双运行时架构**: 保留 TFLite 作为 ONNX 不可用模型的回退
2. **模型验证管道**: 部署前自动测试 ONNX 模型兼容性
3. **插件监控**: 跟踪 `onnxruntime_v2` GitHub 问题，如果维护停滞则准备分支
4. **性能分析**: 每季度在目标设备上对 ONNX vs TFLite 推理进行基准测试

## 考虑的替代方案

### 仅 TensorFlow Lite

- **优点**: 官方 Google 支持，成熟的 Flutter 插件，快 20% 的推理
- **缺点**: RTMPose-m 不可用，需要自定义 PyTorch → TFLite 转换（有损过程）
- **性能**: 30-40ms 推理（估计，如果转换成功）
- **被拒绝的原因**: 无法部署官方 RTMPose-m 模型，转换引入影响姿态估计精度的量化误差

### MediaPipe（Google）

- **优点**: 预构建的姿态估计模型，官方 Flutter 支持
- **缺点**: 限于 MediaPipe 的预定义模型（无法部署自定义 RTMPose-m）
- **定制**: 难以修改模型架构或训练数据
- **被拒绝的原因**: 对于 Movement Chain AI 的领域特定要求（体育运动分析）灵活性不足

### PyTorch Mobile

- **优点**: 原生 PyTorch 模型支持（RTMPose-m 最初在 PyTorch 中训练）
- **缺点**: 二进制大小更大（约 20MB+），有限的 Flutter 集成（无官方插件）
- **性能**: 与 ONNX Runtime 相当
- **被拒绝的原因**: 2 倍二进制大小开销，不成熟的 Flutter 生态系统，ONNX 以更小的占用空间提供相同的 PyTorch 兼容性

### TensorFlow Lite + 手动转换管道

- **方法**: 使用 `tf2onnx` 和量化工具将 RTMPose-m 从 ONNX → TFLite 转换
- **优点**: 使用官方 TFLite 插件，可能更快的推理
- **缺点**:
  - 转换伪影（测试中观察到的层兼容性问题）
  - 维护负担（每次模型更新时重新转换）
  - 精度下降（关键点定位误差增加约 3-5%）
- **被拒绝的原因**: 工程开销和精度损失超过性能提升

### 原生 CoreML（iOS）+ ML Kit（Android）

- **优点**: 每个平台上的最佳性能
- **缺点**: 需要维护两个单独的模型格式和部署管道
- **复杂性**: 2 倍集成工作，平台特定调试
- **被拒绝的原因**: 违反 Flutter 的跨平台理念，增加维护成本

## 验证的包/组件

### 主运行时

**onnxruntime_v2**（v1.16.3）

- **包**: [https://pub.dev/packages/onnxruntime_v2](https://pub.dev/packages/onnxruntime_v2)
- **平台**: iOS（arm64），Android（arm64-v8a，armeabi-v7a）
- **硬件加速**:
  - iOS：CoreML 委托（A12+ 芯片上的神经引擎）
  - Android：NNAPI 委托（Snapdragon/Exynos 上的 GPU/DSP）
- **验证状态**: RTMPose-m（9MB ONNX 模型）在 iPhone 12 Pro 和 Pixel 6 上成功测试
- **推理延迟**: 每帧 35-45ms（float32），18-25ms（int8 量化）

### 回退运行时

**tflite_flutter**（v0.10.4+）

- **包**: [https://pub.dev/packages/tflite_flutter](https://pub.dev/packages/tflite_flutter)
- **用例**: 仅 TFLite 格式可用的模型（例如，图像预处理模型）
- **硬件加速**: GPU 委托（Android），Metal 委托（iOS）
- **官方支持**: Google 维护

### 模型管理

**flutter_cache_manager**（v3.3.1）

- **目的**: 用于 A/B 测试的远程模型下载和缓存
- **功能**: 自动清理，版本管理，离线回退

### 模型检查工具

**Netron**（桌面应用）

- **目的**: 部署前可视化 ONNX 模型架构
- **验证**: 验证输入/输出张量形状，层兼容性

**onnxruntime-tools**（Python 包）

- **目的**: 模型量化（FP32 → INT8）和优化
- **工作流程**: 在打包前在开发机器上预处理模型

## 实现指南

### 模型部署工作流程

1. **训练**: 在 PyTorch 中训练 RTMPose-m（MMPose 框架）
2. **导出**: 使用 `torch.onnx.export` 将 PyTorch → ONNX 转换
3. **优化**: 使用 `onnxruntime-tools` 量化（可选，以实现 2 倍加速）
4. **验证**: 在 Netron 中加载，验证输入形状与摄像头输出匹配（1x3x256x192）
5. **集成**: 在 Flutter 资产中捆绑 ONNX 文件或远程获取
6. **推理**: 通过 `onnxruntime_v2` 加载，在后台隔离上运行

### 代码示例（推理设置）

```dart
import 'package:onnxruntime_v2/onnxruntime_v2.dart';

// 使用硬件加速初始化会话
final session = await OrtSession.fromAsset('assets/rtmpose_m.onnx');
session.setEnv(OrtEnv(logLevel: OrtLoggingLevel.warning));

// 启用 CoreML（iOS）或 NNAPI（Android）委托
if (Platform.isIOS) {
  session.addSessionConfigEntry('session.use_coreml', 'true');
} else if (Platform.isAndroid) {
  session.addSessionConfigEntry('session.use_nnapi', 'true');
}

// 在摄像头帧上运行推理
final inputTensor = OrtValue.createTensorWithDataList(
  preprocessedImage, // YUV420 → RGB，调整大小为 256x192
  [1, 3, 256, 192],
);
final outputs = await session.run([inputTensor]);
final keypoints = outputs[0].asFloatList(); // 17 个关键点 x (x, y, 置信度)
```

### 性能监控

- **延迟跟踪**: 记录每帧推理时间，如果持续 >50ms 则警报
- **内存分析**: 监控 ONNX 会话内存（目标 <200MB）
- **精度验证**: 每季度将关键点预测与真实数据集进行比较

### 回退策略

如果 ONNX Runtime 失败（例如，设备兼容性问题）：

1. 尝试加载模型的 TFLite 版本（预转换，作为备份捆绑）
2. 如果两者都失败，降级到基于云的推理（将帧发送到后端 API）
3. 记录设备型号、操作系统版本和错误代码的遥测

## 迁移路径（未来）

如果 ONNX Runtime 被证明不足：

1. **TFLite 转换**: 投资于具有精度测试的强大 ONNX → TFLite 管道
2. **原生插件**: 为 CoreML（iOS）/ ML Kit（Android）创建自定义平台通道
3. **成本效益**: 如果维护负担超过 40 小时/季度，重新评估

## 参考文献

- **ONNX Runtime Mobile**: [https://onnxruntime.ai/docs/tutorials/mobile/](https://onnxruntime.ai/docs/tutorials/mobile/)
- **RTMPose Model Zoo**: [https://github.com/open-mmlab/mmpose/tree/main/projects/rtmpose](https://github.com/open-mmlab/mmpose/tree/main/projects/rtmpose)
- **onnxruntime_v2 Package**: [https://pub.dev/packages/onnxruntime_v2](https://pub.dev/packages/onnxruntime_v2)
- **ONNX Model Optimization**: [https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html](https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html)
- **性能基准**: 内部测试（2025-11-29），iPhone 12 Pro / Pixel 6
- **二进制大小分析**: 使用 ONNX Runtime vs TFLite 的应用包测量（2025-11-30）

## 审查计划

- **6 周检查点**: 验证 RTMPose-m 推理延迟满足 35-50ms 目标
- **3 个月审查**: 评估 `onnxruntime_v2` 插件稳定性和社区支持
- **6 个月审查**: 比较实际 vs 预计模型更新速度（A/B 测试使用）
- **年度审查**: 重新评估 ONNX vs TFLite 生态系统成熟度和性能差距
