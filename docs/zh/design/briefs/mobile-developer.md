# 移动开发者 Brief

> **目标读者**: Flutter 开发者
>
> **预计阅读时间**: 30 分钟
>
> **项目**: Movement Chain AI - 高尔夫挥杆分析移动应用
>
> **最后更新**: 2025-12-18

---

## 项目概述

Movement Chain AI 是一个基于计算机视觉和传感器融合的高尔夫挥杆分析系统。作为移动开发者，你将负责实现 **实时姿态追踪** + **语音反馈** + **BLE 传感器连接** 的 Flutter 应用。

**核心目标**: 60 FPS 实时骨架叠加 + <100ms 端到端延迟 + 流畅用户体验

---

## 你需要做什么

### Phase 1: 相机与姿态追踪 (2周)

1. **实时相机预览**
   - 60 FPS 相机流式捕获
   - YUV420/NV21 格式处理
   - 支持前后摄像头切换

2. **MediaPipe 姿态叠加**
   - 使用 ThinkSys MediaPipe Plugin (iOS) 或 google_mlkit_pose_detection (Android)
   - 33 个关键点实时检测
   - 骨架线条 + 关节点绘制
   - 50% 透明度幽灵头像对比 (理想姿态 vs 实际姿态)

3. **性能优化**
   - Isolates 后台推理（防止 UI 卡顿）
   - 内存缓冲区重用（避免 GC 暂停）
   - RepaintBoundary 隔离动画层

**验收标准**:

- ✅ iPhone 12+ 持续 60 FPS
- ✅ 峰值内存 <500MB
- ✅ 骨架叠加延迟 <50ms

---

### Phase 2: 用户界面实现 (1周)

1. **实时反馈显示**
   - 评分显示 (0-100分，大字体)
   - 问题列表 (优先级排序)
   - 纠正箭头叠加 (颜色编码：红色/琥珀色/绿色)
   - 历史记录列表

2. **3 种反馈模式切换**
   - **Mode 1: Setup Check** (站姿检查) - 静态姿态分析
   - **Mode 2: Slow Motion Training** (慢动作训练) - 阶段性引导
   - **Mode 3: Full Speed Analysis** (全速分析) - 挥杆后反馈

3. **触控友好设计**
   - FAB 最小 56×56px 触控目标
   - 安全区域布局（避免刘海屏遮挡）
   - Haptic 反馈（按钮点击）

**验收标准**:

- ✅ Material Design 规范合规
- ✅ 黑暗模式支持
- ✅ 横竖屏适配

---

### Phase 3: BLE 框架 (1周)

1. **设备扫描与连接**
   - 使用 flutter_reactive_ble
   - 扫描 ESP32-S3 IMU 设备 (6个传感器)
   - 自动重连机制（指数退避）

2. **数据流处理**
   - GATT 特征订阅 (100 Hz 数据流)
   - 12 字节数据包解析 (时间戳 + 加速度 + 陀螺仪)
   - 丢包缓冲与监控

3. **连接状态管理**
   - 连接/断开状态提示
   - 电池优化 (低电量降低连接频率)

**验收标准**:

- ✅ 扫描到 mock BLE 设备
- ✅ 连接稳定性 >95%
- ✅ 数据流延迟 <12ms

**注意**: Phase 3 为 **将来硬件准备**，MVP 阶段仅需完成框架搭建，可使用 mock 设备测试。

---

### Phase 4: 语音反馈 (集成到各 Phase)

1. **TTS 语音播报**
   - 使用 flutter_tts
   - 预缓存常用语音 (50+ 条)
   - 动态生成带数据反馈 (如 "X因子 32 度，不够")

2. **反馈优先级**
   - P0 (立即说): 严重问题 ("从核心启动")
   - P1 (其次): 重要问题 ("肩膀再多转一点")
   - P2 (最后): 优化建议 ("这一杆不错")

**验收标准**:

- ✅ TTS 延迟 <100ms
- ✅ 语音播放无卡顿
- ✅ 支持中文/英文切换

---

## 技术栈

### 核心框架

- **Flutter 3.x** (Dart 语言)
- **Material Design 3** (UI 规范)

### 关键依赖包

| 包名 | 用途 | 版本 |
|------|------|------|
| **camera** | 相机访问 | ^0.10.5+2 |
| **google_mlkit_pose_detection** | MediaPipe 姿态检测 (Android) | ^0.10.0 |
| **flutter_reactive_ble** | BLE 通信 | ^5.2.0 |
| **flutter_tts** | 文字转语音 | ^3.8.3 |
| **flutter_riverpod** | 状态管理 | ^2.4.9 |
| **sensors_plus** | 设备传感器 (加速度计/陀螺仪) | ^3.0.3 |

### iOS 专用

- **ThinkSys MediaPipe Plugin**: <https://github.com/Thinksys/mediapipe-flutter>
- 验证状态: 2024年8月可用，60 FPS GPU 加速

---

## 关键文档 (必读)

### ⭐ 核心必读

1. [移动应用开发指南](../../development/mobile/development.md)
   - Flutter 框架选择理由
   - 性能优化策略
   - BLE 集成完整代码
   - 商业 App 对标分析 (Peloton, Nike Training Club)

2. [实时反馈规范](../specs/real-time-feedback.md)
   - 3 种反馈模式详细设计
   - 延迟预算分解 (170ms 总延迟)
   - 语音反馈库规范
   - 触觉反馈设计 (Phase 2+)

### 架构决策

1. [ADR-0003: Flutter 框架选择](../decisions/0003-flutter-mobile.md)
   - 为什么选 Flutter 而非 React Native / 原生
   - 性能基准测试数据
   - 成本效益分析 (节省 40%)

### 系统设计

1. [系统设计](../architecture/system-design.md)
   - MVP 管道架构
   - 传感器融合策略
   - 规则引擎阈值

2. [挥杆 8 阶段定义](../specs/swing-phases.md)
   - 阶段检测算法
   - 时间窗口与触发条件

---

## 性能目标

### 关键指标 (ADR-0003)

| 指标 | 目标值 | 测试设备 |
|------|--------|---------|
| **帧率** | 60 FPS 持续 | iPhone 11, Pixel 5 |
| **内存占用** | <500MB 峰值 | 全负载 (Camera + ML + BLE) |
| **端到端延迟** | <100ms | 相机 → 姿态 → 显示 |
| **TTS 延迟** | <100ms | 触发 → 语音播放 |
| **BLE 延迟** | <12ms | 传感器 → 应用接收 |
| **电池消耗** | <15%/小时 | 亮屏连续使用 |

### 优化策略

1. **Isolates 后台推理**

   ```dart
   // 在独立 CPU 核心上运行 ML 推理
   final keypoints = await compute(_runInference, cameraFrame);
   ```

2. **内存缓冲区重用**

   ```dart
   // 预分配缓冲区避免 GC 暂停
   class FrameProcessor {
     late Uint8List _frameBuffer;
     void initialize(int bufferSize) {
       _frameBuffer = Uint8List(bufferSize);
     }
   }
   ```

3. **Widget 重建优化**

   ```dart
   RepaintBoundary(
     child: CustomPaint(
       painter: SkeletonOverlayPainter(keypoints),
     ),
   );
   ```

---

## 预估工作量

| 阶段 | 任务 | 预估时间 | 优先级 |
|------|------|---------|--------|
| **Phase 1** | 相机 + MediaPipe 姿态叠加 | 2 周 | 🔴 P0 |
| **Phase 2** | UI 实现 (3 种模式切换) | 1 周 | 🔴 P0 |
| **Phase 3** | BLE 框架搭建 (mock 设备) | 1 周 | 🟡 P1 |
| **Phase 4** | 语音反馈集成 | 分散在各 Phase | 🔴 P0 |
| **集成测试** | 端到端性能验证 | 3 天 | 🔴 P0 |

**总计**: 约 4.5 周完成 MVP 移动端

---

## 已验证的技术选型

### MediaPipe Flutter 可行性 ✅

- **ThinkSys 插件** (iOS): 2024年8月验证可用
- **google_mlkit_pose_detection** (Android): 官方插件，生产就绪
- **GPU 加速**: iPhone 12+ 可达 60 FPS
- **33 关键点**: 足够高尔夫挥杆分析

### BLE 生产级别 ✅

- **flutter_reactive_ble**: Philips Hue 使用此包 (200万+ 下载)
- **吞吐量**: 1.35 Mbps (需求 57.6 kbps，余量 95.7%)
- **连接稳定性**: 自动重连 + 指数退避

### Flutter 性能验证 ✅

- **帧率**: 60-120 FPS (中端设备)
- **内存**: 450MB 平均 (比 React Native 低 15%)
- **掉帧率**: 比 React Native 少 70% (关键优势)

---

## 常见问题 FAQ

### Q1: 为什么不用 React Native?

**A**: 在 ML 工作负载下，Flutter 掉帧率比 RN 少 70%，这对实时姿态追踪至关重要。详见 [ADR-0003](../decisions/0003-flutter-mobile.md)。

### Q2: MediaPipe 还是 RTMPose?

**A**: MVP 用 MediaPipe (快速上线)，后续优化阶段迁移到 RTMPose (2-3倍更快)。详见 [移动开发指南 2.1节](../../development/mobile/development.md#21-model-selection-mediapipe-vs-rtmpose)。

### Q3: BLE 硬件什么时候准备好?

**A**: 硬件在并行开发中，预计 Phase 2 末期提供。Phase 1 使用 mock 设备测试框架。

### Q4: 如何处理不同屏幕尺寸?

**A**: 使用动态缩放因子，基准设计为 iPhone 14 宽度 (390px)。详见 [移动开发指南 3.1节](../../development/mobile/development.md#31-screen-size-constraints-and-responsive-design)。

### Q5: 语音反馈支持哪些语言?

**A**: MVP 阶段支持中文，flutter_tts 支持 40+ 语言，后续可扩展。

---

## 联系方式

- **技术问题**: 查阅 [移动开发指南](../../development/mobile/development.md) 或联系 Tech Lead
- **设计问题**: 查阅 [实时反馈规范](../specs/real-time-feedback.md)
- **架构决策**: 查阅 [ADR 列表](../decisions/index.md)

---

## 下一步行动

1. **Day 1**: 阅读 [移动开发指南](../../development/mobile/development.md) 全文 (90分钟)
2. **Day 1-2**: 搭建 Flutter 项目，集成 camera + google_mlkit_pose_detection
3. **Week 1**: 实现实时骨架叠加 + 性能优化
4. **Week 2**: UI 实现 + 3 种模式切换
5. **Week 3**: BLE 框架 + 语音反馈集成
6. **Week 4**: 集成测试 + 性能验证

**准备好了？** 从 [移动开发指南](../../development/mobile/development.md) 开始吧！

---

**文档版本**: 1.0
**维护者**: Movement Chain AI Mobile Team
**下次审查**: Q2 2025
