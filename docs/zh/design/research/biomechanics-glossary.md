# 高尔夫生物力学术语表 Golf Biomechanics Glossary

> **文档目的**: 定义项目中所有高尔夫生物力学专业术语
> **来源**: TPI, Meister et al. (2011), Cheetham et al., 系统性文献综述 (2022)
> **适用范围**: Movement Chain AI 项目的传感器数据解读、算法开发、用户反馈界面

---

## 1. 身体部位与解剖学 Body Segments & Anatomy

| 术语 Term | 中文 | 定义 Definition | 备注 Notes |
|-----------|------|----------------|-----------|
| **Thorax** | 胸腔/上躯干 | Upper torso segment from shoulders to mid-spine; primary rotation unit in golf swing | Rotation measured relative to pelvis coordinate system |
| **Pelvis** | 骨盆 | Hip bone structure; foundational segment that initiates downswing rotation | Ground contact through feet; first mover in kinematic sequence |
| **Core** | 核心肌群 | Midsection muscle groups including abdominals, obliques, lower back stabilizers | Critical for X-Factor generation and energy transfer |
| **Obliques** | 腹斜肌 | Side abdominal muscles (internal & external); drive rotational power | External: backswing; Internal: downswing rotation |
| **Kinetic Chain** | 动力链 | Linked sequence of body segments transferring energy proximally to distally | Pelvis → Thorax → Arm → Club |
| **Lead Side** | 引导侧 | Left side for right-handed golfers; target-facing side during swing | Receives majority of impact forces |
| **Trail Side** | 后侧 | Right side for right-handed golfers; power generation side | Drives rotation in downswing |
| **Humerus** | 肱骨 | Upper arm bone from shoulder to elbow | Arm segment in kinematic sequence |
| **Forearm** | 前臂 | Lower arm from elbow to wrist (radius and ulna bones) | Critical for clubface control |
| **Lumbar Spine** | 腰椎 | Lower back vertebrae (L1-L5); primary site of golf-related injuries | Must balance mobility vs. stability |

---

## 2. 旋转指标 Rotation Metrics

| 术语 Term | 中文 | 定义 Definition | 职业标准 Pro Benchmark |
|-----------|------|----------------|---------------------|
| **Torso Turn / Shoulder Turn** | 肩部旋转 | Rotation of thorax segment about vertical axis during backswing | Backswing: 90-100° <br> Top: 90-110° |
| **Pelvis Turn / Hip Turn** | 髋部旋转 | Rotation of pelvis segment about vertical axis | Backswing: 45-55° <br> Top: 45-60° |
| **X-Factor** | X因子 | Differential rotation between shoulders and pelvis at top of backswing:<br>X-Factor = Shoulder Turn - Pelvis Turn | 42-55° (optimal) <br> <40° = restricted <br> >60° = overly flexible |
| **X-Factor Stretch** | X因子伸展 | **INCREASE** in X-Factor during transition as pelvis rotates forward while shoulders remain coiled:<br>ΔX-Factor = X-Factor(transition) - X-Factor(top) | +15-25% increase <br> (e.g., 45° → 56° = +24%) |
| **S-Factor** | S因子/肩倾斜 | Shoulder tilt angle relative to horizontal plane (side bend) | Backswing: 30-40° right tilt <br> Impact: 25-35° left tilt |
| **O-Factor** | O因子/髋倾斜 | Pelvis tilt angle relative to horizontal plane | Stable 5-10° throughout swing |
| **Forearm Rotation** | 前臂旋转 | Pronation/supination of forearm for clubface control | 60-90° total rotation through impact |
| **Wrist Cock** | 腕关节屈曲 | Radial deviation of wrist storing energy in backswing | 90-110° at top; released <30° before impact |

---

## 3. 线性运动指标 Linear Motion Metrics

| 术语 Term | 中文 | 定义 Definition | 职业标准 Pro Benchmark |
|-----------|------|----------------|---------------------|
| **Sway** | 侧移 | Lateral side-to-side movement along target line (X-axis) | <3 inches backswing <br> 4-6 inches downswing (toward target) |
| **Thrust** | 前后移动 | Front-to-back movement perpendicular to target line (Y-axis) | <2 inches total swing |
| **Lift** | 垂直位移 | Up-down vertical movement (Z-axis) | 2-4 inches (squat then extend) |
| **Torso Sway** | 上躯干侧移 | Lateral translation of thorax center of mass | Minimal; rotation dominant |
| **Pelvis Sway** | 骨盆侧移 | Lateral translation of pelvis; weight shift indicator | 3-5 inches toward target in downswing |
| **Center of Mass (COM)** | 质心 | Weighted average position of body mass | Stays within base of support (feet) |
| **Weight Shift** | 重心转移 | Redistribution of ground reaction forces between feet | 60% trail → 80% lead at impact |

---

## 4. 速度与时机指标 Velocity & Timing Metrics

| 术语 Term | 中文 | 定义 Definition | 职业标准 Pro Benchmark |
|-----------|------|----------------|---------------------|
| **Angular Velocity** | 角速度 | Rate of rotation in degrees per second (°/s) | See segment-specific values below |
| **Pelvis Rotation Velocity** | 骨盆旋转速度 | Peak rotational speed of pelvis during downswing | 477-550°/s (mean: 477°/s) |
| **Thorax Rotation Velocity** | 胸腔旋转速度 | Peak rotational speed of thorax during downswing | 550-650°/s (mean: 550°/s) |
| **Arm Rotation Velocity** | 手臂旋转速度 | Peak rotational speed of lead arm segment | 900-1200°/s |
| **Wrist Angular Velocity** | 腕关节角速度 | Peak rotational speed of wrist release | 1500-2500°/s (highest in chain) |
| **Clubhead Speed** | 杆头速度 | Linear velocity of clubhead at impact | 110-125 mph (pros) <br> 85-95 mph (scratch) <br> 65-75 mph (15 hdcp) |
| **Peak Angular Velocity** | 峰值角速度 | Maximum rotational speed during downswing for any segment | Occurs sequentially: Pelvis → Thorax → Arm → Wrist |
| **Rate of Velocity Development** | 速度增长率 | Acceleration slope (°/s²); how fast segment reaches peak speed | Higher = more explosive power |

---

## 5. 节奏与时机 Tempo & Timing

| 术语 Term | 中文 | 定义 Definition | 职业标准 Pro Benchmark |
|-----------|------|----------------|---------------------|
| **Tempo** | 节奏 | Rhythmic pattern and timing characteristics of swing | Individual preference; consistency key |
| **Tempo Ratio** | 节奏比 | Ratio of backswing duration to downswing duration:<br>Ratio = Backswing Time / Downswing Time | 3:1 (most common) <br> Range: 2:1 to 4:1 |
| **Backswing Duration** | 上杆时间 | Time from takeaway to top of backswing | 0.70-0.80s (driver) |
| **Downswing Duration** | 下杆时间 | Time from transition to impact | 0.23-0.28s (driver) |
| **Transition** | 转换期 | Critical 50-100ms window where pelvis initiates forward rotation while shoulders complete backswing; **X-Factor Stretch** occurs here | 0.05-0.10s duration |
| **Time to Peak Velocity** | 达峰时间 | Time from downswing start to peak angular velocity for each segment | Pelvis: ~0.10s <br> Thorax: ~0.15s <br> Arm: ~0.20s <br> Wrist: ~0.23s |
| **Time Between Peaks (TBP)** | 峰值间隔 | Temporal gap between segment peak velocities | Optimal: 20-50ms between segments |

---

## 6. 运动链顺序 Kinematic Sequence

| 术语 Term | 中文 | 定义 Definition | 备注 Notes |
|-----------|------|----------------|-----------|
| **Kinematic Sequence** | 运动链顺序 | Ordered sequence of segment acceleration and deceleration:<br>1️⃣ Pelvis accelerates<br>2️⃣ Thorax accelerates (pelvis decelerates)<br>3️⃣ Arms accelerate (thorax decelerates)<br>4️⃣ Club accelerates (arms decelerate) | Signature of efficient power transfer |
| **Proximal-to-Distal Sequencing** | 近端到远端顺序 | Fundamental biomechanical principle: energy flows from body center (proximal) to extremities (distal) | Pelvis (proximal) → Wrist (distal) |
| **Peak Timing** | 峰值时机 | Temporal location of each segment's peak angular velocity | Must occur in sequence; no overlaps |
| **Deceleration** | 减速 | Slowing of proximal segment to transfer energy distally | Each segment decelerates as next accelerates |
| **Transfer Ratio** | 传递比率 | Velocity ratio between adjacent segments:<br>Ratio = Distal Peak / Proximal Peak | Ideal: ~1.5x gain per segment <br> (e.g., Thorax/Pelvis = 1.3-1.5) |
| **Sequence Reversal** | 顺序颠倒 | Inefficient pattern where distal segment peaks before proximal | Common fault: Arms peak before thorax |
| **Simultaneous Peaks** | 同步达峰 | Inefficient pattern where two segments peak together | Loss of energy transfer efficiency |
| **Double Peak** | 双峰 | Segment velocity graph shows two peaks instead of one | Indicates energy leak or re-acceleration |

---

## 7. 肌电与肌肉术语 EMG & Muscle Terms

| 术语 Term | 中文 | 定义 Definition | 备注 Notes |
|-----------|------|----------------|-----------|
| **EMG (Electromyography)** | 肌电图 | Measurement of electrical activity produced by skeletal muscles | Surface EMG: non-invasive skin electrodes |
| **Muscle Activation** | 肌肉激活 | Timing and intensity of muscle contraction; when/how hard muscle works | Measured as % of Maximum Voluntary Contraction (MVC) |
| **RMS Envelope** | 均方根包络 | Root Mean Square smoothing of raw EMG signal to show activation trend | Typical window: 50-100ms |
| **Onset Time** | 激活起始时间 | Moment when muscle begins contracting (exceeds baseline threshold) | Typically >2 SD above baseline |
| **Peak Time** | 峰值时间 | Moment of maximum muscle activation during swing phase | Varies by muscle and swing phase |
| **Activation Sequence** | 激活顺序 | Order in which muscles activate during swing | **Correct**: Core → Obliques → Forearm <br> **Faulty**: Forearm activates first |
| **Compensation** | 代偿 | Incorrect muscle recruitment pattern where wrong muscles compensate for weak/inactive target muscles | Example: Forearm working when core should |
| **MVC (Maximum Voluntary Contraction)** | 最大自主收缩 | Reference measurement: maximum force muscle can produce | Used to normalize EMG data (% MVC) |
| **Co-contraction** | 协同收缩 | Simultaneous activation of agonist and antagonist muscles | Stabilizes joints but can reduce power |
| **Lead Oblique** | 引导侧腹斜肌 | External oblique on lead side; active in backswing rotation | Left external oblique (RH golfer) |
| **Trail Oblique** | 后侧腹斜肌 | Internal oblique on trail side; drives downswing rotation | Right internal oblique (RH golfer) |

---

## 8. 性能相关术语 Performance Correlation Terms

| 术语 Term | 中文 | 定义 Definition | 应用 Application |
|-----------|------|----------------|-----------------|
| **Coefficient of Variation (CV)** | 变异系数 | Measure of consistency: CV = (Standard Deviation / Mean) × 100% | Lower CV = more consistent <br> Good: <5% for tempo metrics |
| **Correlation Coefficient (r)** | 相关系数 | Statistical measure of linear relationship strength between two variables | r > 0.7 = strong positive <br> r < -0.7 = strong negative |
| **Clubhead Speed at Impact (CSI)** | 击球时杆头速度 | Primary outcome variable; determines ball distance | Driver: 110-125 mph (pros) |
| **Free Moment** | 自由力矩 | Vertical torque component measured by force plate; rotation around vertical axis | Higher = more rotational power from ground |
| **Ground Reaction Force (GRF)** | 地面反作用力 | Forces exerted by ground on golfer's feet | Vertical: 0.8-1.2× body weight <br> Lateral: drives weight shift |
| **Smash Factor** | 撞击因子 | Ball speed divided by clubhead speed; measures strike quality | Optimal: 1.48-1.50 (driver) |
| **Ball Speed** | 球速 | Initial velocity of golf ball after impact | 1.48-1.50× clubhead speed (optimal) |
| **Launch Angle** | 发射角 | Vertical angle of ball trajectory at launch | Driver: 10-15° (optimal) |
| **Spin Rate** | 旋转率 | Backspin of ball in RPM | Driver: 2200-2800 RPM (optimal) |

---

## 9. 挥杆阶段 Swing Phases

| 术语 Term | 中文 | 定义 Definition | 时长 Duration |
|-----------|------|----------------|--------------|
| **Address / Setup** | 准备站姿 | Initial stationary position before swing begins | Static position |
| **Takeaway** | 起杆 | First 12-18 inches of backswing; club moves away from ball | 0.10-0.15s |
| **Backswing** | 上杆 | Full rotation phase from takeaway to top | 0.70-0.80s total |
| **Top of Backswing** | 上杆顶点 | Moment of maximum shoulder rotation; club reaches highest point | Instantaneous (velocity = 0) |
| **Transition** | 转换 | Critical reversal phase where pelvis starts forward while shoulders complete backswing; **X-Factor Stretch happens here** | 0.05-0.10s |
| **Early Downswing** | 下杆前期 | Pelvis and thorax accelerate; arms passive | 0.10-0.15s |
| **Late Downswing** | 下杆后期 | Arms and club accelerate toward impact | 0.10-0.15s |
| **Impact** | 击球 | Clubface contacts ball; maximum clubhead speed | ~5ms contact time |
| **Follow-through** | 收杆 | Deceleration phase after impact; energy dissipation | 0.30-0.50s |
| **Finish** | 完成姿势 | Final balanced position after swing | Static position |

---

## 10. 传感器测量术语 Sensor Measurement Terms

| 术语 Term | 中文 | 定义 Definition | 传感器类型 Sensor Type |
|-----------|------|----------------|---------------------|
| **IMU (Inertial Measurement Unit)** | 惯性测量单元 | Sensor combining accelerometer + gyroscope + (optional) magnetometer | LSM6DSV16X (6-axis) |
| **Accelerometer** | 加速度计 | Measures linear acceleration in 3 axes (X, Y, Z) | Captures sway, thrust, lift |
| **Gyroscope** | 陀螺仪 | Measures angular velocity in 3 axes (pitch, roll, yaw) | Captures rotation rates |
| **Magnetometer** | 磁力计 | Measures magnetic field for absolute heading reference | Optional; helps with drift correction |
| **Drift** | 漂移 | Gradual accumulation of integration error in calculated angles | LSM6DSV16X: <1° per 45 min |
| **Sensor Fusion** | 传感器融合 | Algorithmic combination of accelerometer + gyroscope data to calculate orientation | Madgwick, Mahony, EKF algorithms |
| **Quaternion** | 四元数 | Mathematical representation of 3D rotation (4 values: w, x, y, z) | Avoids gimbal lock vs. Euler angles |
| **Euler Angles** | 欧拉角 | 3D rotation as yaw-pitch-roll angles | Intuitive but has gimbal lock issue |
| **Sampling Rate** | 采样率 | Frequency of sensor measurements (Hz) | Golf: 100-200 Hz minimum <br> LSM6DSV16X: up to 7.68 kHz |
| **EMG Electrode** | 肌电电极 | Surface sensor measuring muscle electrical activity | Adhesive Ag/AgCl wet gel electrodes |
| **Baseline Noise** | 基线噪声 | Electrical noise in EMG signal when muscle is relaxed | Must filter before onset detection |

---

## 11. 训练与反馈术语 Training & Feedback Terms

| 术语 Term | 中文 | 定义 Definition | 应用场景 Use Case |
|-----------|------|----------------|-----------------|
| **Real-Time Feedback** | 实时反馈 | Immediate auditory/visual/haptic cues during swing | Must occur <300ms for effective learning |
| **Post-Swing Analysis** | 挥杆后分析 | Detailed review of swing metrics after completion | Mobile app visualization, coaching |
| **Benchmark Comparison** | 基准对比 | User's metrics vs. professional/ideal standards | Shows deviation from optimal ranges |
| **Progression Tracking** | 进度追踪 | Longitudinal monitoring of metric improvements over time | Session-by-session trend analysis |
| **Drill** | 练习动作 | Targeted exercise to improve specific swing component | Example: "Pelvis-first" transition drill |
| **Constraint-Based Training** | 约束训练 | Using physical/informational constraints to guide motor learning | Example: Limit backswing to 70° to feel X-Factor |
| **Transfer of Learning** | 学习迁移 | Application of practiced skill to actual golf performance | Practice range → course performance |
| **Variability** | 变异性 | Natural fluctuation in swing metrics across repetitions | Some variability is healthy; CV indicates consistency |

---

## 12. 常见挥杆问题术语 Common Swing Fault Terms

| 术语 Term | 中文 | 定义 Definition | 生物力学特征 Biomechanical Signature |
|-----------|------|----------------|----------------------------------|
| **Early Extension** | 早起 | Premature straightening of hips in downswing; pelvis moves toward ball | Thrust >3 inches; loss of spine angle |
| **Sway** | 过度侧移 | Excessive lateral movement of pelvis away from target in backswing | Pelvis sway >5 inches; weight stuck on trail side |
| **Reverse Pivot** | 反向转移 | Weight shifts toward target in backswing (opposite of correct) | Weight >55% lead side at top |
| **Over-the-Top** | 外侧下杆 | Shoulders initiate downswing before pelvis; club comes outside-in | Sequence reversal: Thorax peaks before pelvis |
| **Casting** | 早释放 | Premature release of wrist angle in downswing; power loss | Wrist uncocks before pelvis reaches peak velocity |
| **Chicken Wing** | 鸡翼 | Lead elbow bends and lifts through impact | Compensation for early extension or poor sequencing |
| **Hanging Back** | 后撤 | Weight remains on trail side at impact | Weight <60% lead side at impact |
| **Slide** | 滑动 | Pelvis translates laterally without rotation | High sway, low pelvis rotation velocity |

---

## 术语使用规范 Terminology Usage Guidelines

### 1️⃣ 数据标注 Data Annotation

- 使用英文术语作为 **变量名** (代码/数据库): `x_factor`, `pelvis_rotation_velocity`
- 使用中文术语作为 **用户界面** (App): "X因子", "骨盆旋转速度"

### 2️⃣ 单位标准 Units Standard

- **角度 Angles**: 度 (°) - degrees
- **角速度 Angular Velocity**: 度/秒 (°/s) - degrees per second
- **线速度 Linear Velocity**: 米/秒 (m/s) or 英里/时 (mph) for clubhead
- **时间 Time**: 秒 (s) or 毫秒 (ms)
- **距离 Distance**: 英寸 (inches) or 厘米 (cm)

### 3️⃣ 缩写使用 Abbreviations

- **EMG**: Electromyography (always capitalized)
- **IMU**: Inertial Measurement Unit
- **COM**: Center of Mass
- **GRF**: Ground Reaction Force
- **RMS**: Root Mean Square
- **CV**: Coefficient of Variation
- **TBP**: Time Between Peaks

---

## 13. 视觉与姿态估计 Vision & Pose Estimation

| 术语 Term | 中文 | 定义 Definition | 备注 Notes |
|-----------|------|----------------|-----------|
| **Pose Estimation** | 姿态估计 | Detecting human body keypoints from images/video | Top-Down vs Bottom-Up approaches |
| **Keypoint** | 关键点 | Body skeleton joint node (e.g., shoulder, elbow, wrist) | COCO 17-point format standard |
| **RTMPose** | RTMPose | Real-time pose estimation model from OpenMMLab | RTMPose-m: 75.8% AP, 70+ FPS mobile |
| **AP (Average Precision)** | 平均精度 | Standard pose estimation accuracy metric; precision averaged across IoU thresholds | `AP@0.5`, `AP@0.75`, mAP |
| **COCO Format** | COCO格式 | 17-keypoint body format: nose, eyes, ears, shoulders, elbows, wrists, hips, knees, ankles | Industry standard annotation format |

**我们选择 Our Choice**: RTMPose-m (13.6MB model, optimal accuracy/speed trade-off)

详见 See: [视觉软件](../../components/vision/software.md)

---

## 14. 柔性传感器 Flexible Sensors

### FSR (Force Sensing Resistor) 力敏电阻

| 属性 Property | 描述 Description |
|--------------|-----------------|
| **原理 Principle** | Pressure increases → Resistance decreases |
| **厚度 Thickness** | <0.5mm (ultra-thin) |
| **应用 Applications** | Foot pressure, grip force, touch detection |
| **常见产品 Products** | Interlink FSR 402/406, FlexiForce A201 |

详见 See: [压力传感器硬件](../../components/pressure-sensors/hardware.md)

### E-Skin (Electronic Skin) 电子皮肤

Flexible sensor arrays conforming to skin or curved surfaces.

| 类型 Type | 原理 Principle | 测量内容 Measures | 特点 Characteristics |
|-----------|---------------|------------------|---------------------|
| **应变式 Strain** | Deformation → Resistance change | Bending/stretching | Good linearity |
| **压阻式 Piezoresistive** | Pressure → Resistance change | Pressure distribution | High sensitivity |
| **电容式 Capacitive** | Deformation → Capacitance change | Deformation | High precision |
| **压电式 Piezoelectric** | Deformation → Voltage | Dynamic changes | Fast response |

**我们研究的产品 Products Researched**: StretchSense (capacitive), BendLabs (resistive), Bebop Sensors, 国产: 能斯达、纽迪瑞

详见 See: [柔性传感器硬件](../../components/flexible-sensors/hardware.md)

---

## 15. 数据融合与部署 Data Fusion & Deployment

| 术语 Term | 中文 | 定义 Definition | 备注 Notes |
|-----------|------|----------------|-----------|
| **Multi-Modal Fusion** | 多模态融合 | Combining multiple data sources for joint analysis | Vision + Pressure + EMG + E-Skin + IMU |
| **Time Synchronization** | 时间同步 | Aligning sensor data to unified timeline | Software (~10ms), Hardware (<1ms), Event-based |
| **Feature Engineering** | 特征工程 | Extracting meaningful features from raw sensor data | Joint angles, CoP trajectory, activation timing |
| **ONNX** | 开放神经网络交换格式 | Universal ML model format for cross-platform deployment | Train: PyTorch → Export: ONNX → Infer: ONNX Runtime Mobile |

**我们的架构 Our Architecture**: PyTorch training → ONNX export → ONNX Runtime Mobile inference

详见 See: [ONNX Runtime 部署 ADR](../decisions/0006-onnx-runtime-deployment.md)

---

## 参考文献 References

### 核心研究 Core Studies

1. **Cheetham, P.J., Martin, P.E., Mottram, R.E., & St Laurent, B.F.** (2001). The importance of stretching the "X-Factor" in the downswing of golf: The "X-Factor Stretch". In *Optimising Performance in Golf* (pp. 192-199). Brisbane: Australian Academic Press.

2. **Meister, D.W., Ladd, A.L., Butler, E.E., Zhao, B., Rogers, A.P., Ray, C.J., & Rose, J.** (2011). Rotational biomechanics of the elite golf swing: Benchmarks for amateurs. *Journal of Applied Biomechanics*, 27(3), 242-251.

3. **Chu, Y., Sell, T.C., & Lephart, S.M.** (2010). The relationship between biomechanical variables and driving performance during the golf swing. *Journal of Sports Sciences*, 28(11), 1251-1259.

4. **Cole, M.H., & Grimshaw, P.N.** (2016). The X-Factor and its relationship to golfing performance. *Journal of Quantitative Analysis in Sports*, 12(4), 207-216.

### 系统综述 Systematic Reviews

1. **Joyce, C., Burnett, A., & Ball, K.** (2010). Methodological considerations for the 3D measurement of the X-factor and lower trunk movement in golf. *Sports Biomechanics*, 9(3), 206-221.

2. **Kwon, Y.H., Han, K.H., Como, C., Lee, S., & Singhal, K.** (2013). Validity of the X-Factor computation methods and relationship between the X-Factor parameters and clubhead velocity in skilled golfers. *Sports Biomechanics*, 12(3), 231-246.

### 技术资源 Technical Resources

- **TPI (Titleist Performance Institute)** - Body-Swing Connection framework: [mytpi.com](https://www.mytpi.com)
- **3D Golf Biodynamics** - Cheetham, P.J.: Kinematic sequence analysis
- **STRI (Sports Turf Research Institute)** - Biomechanics research database

---

## 版本历史 Version History

| 版本 | 日期 | 修改内容 |
|------|------|---------|
| 1.0 | 2025-12-17 | 初始版本: 覆盖12个类别、140+术语 |
| 1.1 | 2025-12-17 | 合并 00-glossary.md: 新增 §13 视觉/姿态估计, §14 柔性传感器, §15 数据融合 |

---

**维护者 Maintainer**: Movement Chain AI Team
**最后更新 Last Updated**: 2025-12-17
