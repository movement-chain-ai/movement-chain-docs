# ADR 0001: 多仓库结构

**日期:** 2025-12-01
**状态:** 已接受

## 背景

Movement Chain AI 系统包含多个不同的技术领域：ESP32-S3 设备的嵌入式固件、基于 Python 的机器学习模型、Flutter 移动应用程序、硬件设计文件和文档。我们需要在单仓库方法（monorepo，使用多个工作空间的单一仓库）和多仓库方法（multi-repo，为每个主要组件使用独立仓库）之间做出选择。

影响此决策的关键因素：

- 不同的构建系统和工具链（固件用 PlatformIO，ML 用 Python/Poetry，移动端用 Flutter）
- 不同的发布周期（固件可能独立于移动应用进行更新）
- 学生团队协作，各自具有不同专业领域
- 异构代码库的 CI/CD 复杂性
- 跨不同生态系统的依赖管理

## 决策

我们将采用**多仓库结构 (multi-repository structure)**，包含以下仓库：

1. `movement-chain-firmware` - ESP32-S3 嵌入式固件 (PlatformIO/C++)
2. `movement-chain-ml` - 机器学习模型和训练流程 (Python)
3. `movement-chain-mobile` - Flutter 移动应用 (Dart/Flutter)
4. `movement-chain-hardware` - 硬件原理图、PCB 设计、BOM (KiCad)
5. `movement-chain-ai-docs` - 架构文档、ADR、研究笔记

## 理由

### 独立的构建系统

每个组件需要根本不同的构建工具：

- 固件: PlatformIO 配合 ESP-IDF 依赖
- ML: Python 3.10+、TensorFlow Lite、scikit-learn
- 移动端: Flutter SDK、Dart 包
- 硬件: KiCad、制造文件

在单仓库中统一这些工具将需要复杂的工作空间配置，并在不同目录中使用哪些工具方面造成混淆。

### 独立的发布周期

- 固件更新可以通过 OTA 部署，无需更改移动应用
- ML 模型更新可能需要固件更改，但不需要移动 UI 更新
- 移动应用发布遵循应用商店审批周期，独立于固件
- 硬件修订有较长的交付周期，与软件周期无关

### 团队协作优势

- 学生可以专注于自己的领域，无需浏览无关代码
- 仓库权限可以根据专业领域划分
- 较小的仓库大小减少克隆时间和认知负担
- 为每个子系统明确所有权边界

### CI/CD 简单性

- 每个仓库都有专注的 CI 流程（例如 PlatformIO 测试 vs Flutter 测试）
- 部署构件范围限定于单个领域
- 构建失败不会阻塞不相关的组件
- GitHub Actions 工作流保持简单和可维护

## 后果

### 积极影响

- **明确的关注点分离** - 每个仓库都有单一、明确定义的目的
- **独立版本控制** - 可以按组件应用语义化版本控制（固件 v1.2.0、移动端 v2.0.1）
- **更快的 CI/CD** - 流程仅测试相关更改，而不是整个代码库
- **更容易上手** - 新贡献者只需克隆他们需要的仓库
- **工具独立性** - 每个仓库使用其领域的最佳工具，无需妥协
- **并行开发** - 团队可以在不同组件上工作，避免 Git 冲突

### 消极影响

- **跨仓库协调开销** - 固件 API 的破坏性更改需要在移动仓库中协调更新
  - *缓解措施:* 维护 API 兼容性契约，使用功能标志进行渐进式发布
- **依赖版本不匹配** - ML 模型格式更改需要固件和移动端更新
  - *缓解措施:* 为所有数据格式（TFLite 模型、BLE 消息模式）版本化，保持向后兼容性
- **更多仓库需要管理** - 5 个仓库 vs 1 个增加了管理开销
  - *缓解措施:* 使用一致的仓库模板、共享 GitHub Actions 工作流、在 `movement-chain-ai-docs` 中统一文档
- **代码重复风险** - 共享工具（例如数据解析）可能被重复
  - *缓解措施:* 在必要时创建共享库（例如用于 BLE 消息定义的 `movement-chain-protocol`）

## 考虑的替代方案

### 方案 A: 带工作空间的单仓库 (Monorepo)

**描述:** 单一仓库，顶级目录（`firmware/`、`ml/`、`mobile/` 等）由 Nx 或 Turborepo 等单仓库工具管理。

**被拒绝的原因:**

- 在已经复杂的构建系统之上增加了复杂性层（单仓库工具）
- PlatformIO、Flutter 和 Python 对工作空间有不同的期望
- CI/CD 会在每次提交时运行所有检查，减慢开发速度
- 仓库大小会随着硬件二进制文件和 ML 数据集快速增长
- 学生贡献者需要学习单仓库工具以及领域工具

### 方案 B: 带子模块的单仓库

**描述:** 主仓库使用 Git 子模块指向独立的组件仓库。

**被拒绝的原因:**

- 结合了两种方法的最坏情况：协调开销 + 子模块复杂性
- Git 子模块对初学者来说非常难以管理
- 需要了解父仓库和子仓库的工作流程
- 分离的 HEAD 状态和忘记的子模块更新造成混淆
- 与直接多仓库方法相比没有显著优势

### 方案 C: 每个功能一个微仓库

**描述:** 更细粒度的拆分（例如 `gyroscope-driver`、`swing-detection-model`、`profile-screen-ui`）。

**被拒绝的原因:**

- 对于有 3-4 名活跃贡献者的学生项目来说过度工程化
- 功能依赖性需要持续的跨仓库协调
- 会创建 15+ 个仓库，难以导航
- 集成测试变得极其困难
- 仅在大型组织规模（100+ 开发者）下才有意义

## 参考资料

- **PlatformIO 文档** - <https://docs.platformio.org/> (固件构建系统)
- **Flutter 架构** - <https://docs.flutter.dev/resources/architectural-overview> (移动开发)
- **TensorFlow Lite for Microcontrollers** - <https://www.tensorflow.org/lite/microcontrollers> (ML 部署)
- **Monorepo vs Multi-repo 分析** - <https://github.com/joelparkerhenderson/monorepo-vs-polyrepo>
- **学生项目最佳实践** - IEEE Software Engineering Education (2024)
