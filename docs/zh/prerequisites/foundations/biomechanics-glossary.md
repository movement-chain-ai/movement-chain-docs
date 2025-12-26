# 高尔夫生物力学术语表 Golf Biomechanics Glossary

> **文档目的**: 定义项目中所有高尔夫生物力学专业术语
> **来源**: TPI, Meister et al. (2011), Cheetham et al., 系统性文献综述 (2022)
> **适用范围**: Movement Chain AI 项目的传感器数据解读、算法开发、用户反馈界面

---

## 1. 身体部位与解剖学 Body Segments & Anatomy

| 术语 Term | 中文 | 定义 Definition | 备注 Notes |
|-----------|------|----------------|-----------|
| **Thorax** | 胸腔/上躯干 | Upper torso segment from shoulders to mid-spine; primary rotation unit in golf swing<br>从肩部到脊椎中部的上躯干部分；高尔夫挥杆中的主要旋转单元 | Rotation measured relative to pelvis coordinate system<br>相对于骨盆坐标系测量旋转 |
| **Pelvis** | 骨盆 | Hip bone structure; foundational segment that initiates downswing rotation<br>髋骨结构；启动下杆旋转的基础部位 | Ground contact through feet; first mover in kinematic sequence<br>通过双脚接触地面；运动链中的第一推动者 |
| **Core** | 核心肌群 | Midsection muscle groups including abdominals, obliques, lower back stabilizers<br>躯干中段肌群，包括腹肌、腹斜肌、下背部稳定肌 | Critical for X-Factor generation and energy transfer<br>对X因子生成和能量传递至关重要 |
| **Obliques** | 腹斜肌 | Side abdominal muscles (internal & external); drive rotational power<br>腹部侧面肌肉（内外斜肌）；驱动旋转力量 | External: backswing; Internal: downswing rotation<br>外斜肌：上杆；内斜肌：下杆旋转 |
| **Kinetic Chain** | 动力链 | Linked sequence of body segments transferring energy proximally to distally<br>身体各部位按顺序连接，将能量从近端传递到远端 | Pelvis → Thorax → Arm → Club<br>骨盆 → 胸腔 → 手臂 → 球杆 |
| **Lead Side** | 引导侧 | Left side for right-handed golfers; target-facing side during swing<br>右手球员的左侧；挥杆时面向目标的一侧 | Receives majority of impact forces<br>承受大部分击球冲击力 |
| **Trail Side** | 后侧 | Right side for right-handed golfers; power generation side<br>右手球员的右侧；力量产生的一侧 | Drives rotation in downswing<br>驱动下杆旋转 |
| **Humerus** | 肱骨 | Upper arm bone from shoulder to elbow<br>从肩部到肘部的上臂骨 | Arm segment in kinematic sequence<br>运动链中的手臂部分 |
| **Forearm** | 前臂 | Lower arm from elbow to wrist (radius and ulna bones)<br>从肘部到手腕的下臂（桡骨和尺骨） | Critical for clubface control<br>对杆面控制至关重要 |
| **Lumbar Spine** | 腰椎 | Lower back vertebrae (L1-L5); primary site of golf-related injuries<br>下背部椎骨（L1-L5）；高尔夫相关损伤的主要部位 | Must balance mobility vs. stability<br>需要平衡灵活性与稳定性 |

---

## 2. 旋转指标 Rotation Metrics

| 术语 Term | 中文 | 定义 Definition | 职业标准 Pro Benchmark |
|-----------|------|----------------|---------------------|
| **Torso Turn / Shoulder Turn** | 肩部旋转 | Rotation of thorax segment about vertical axis during backswing<br>上杆过程中胸腔绕垂直轴的旋转 | Backswing: 90-100° <br> Top: 90-110°<br>上杆：90-100° / 顶点：90-110° |
| **Pelvis Turn / Hip Turn** | 髋部旋转 | Rotation of pelvis segment about vertical axis<br>骨盆绕垂直轴的旋转 | Backswing: 45-55° <br> Top: 45-60°<br>上杆：45-55° / 顶点：45-60° |
| **X-Factor** | X因子 | Differential rotation between shoulders and pelvis at top of backswing:<br>X-Factor = Shoulder Turn - Pelvis Turn<br>上杆顶点时肩部与骨盆旋转的角度差：X因子 = 肩部旋转 - 骨盆旋转 | 42-55° (optimal 最佳) <br> <40° = restricted 受限 <br> >60° = overly flexible 过度柔韧 |
| **X-Factor Stretch** | X因子伸展 | **INCREASE** in X-Factor during transition as pelvis rotates forward while shoulders remain coiled:<br>ΔX-Factor = X-Factor(transition) - X-Factor(top)<br>转换期X因子的**增加**——骨盆向前旋转而肩部保持蓄力 | +15-25% increase 增加 <br> (e.g., 45° → 56° = +24%) |
| **S-Factor** | S因子/肩倾斜 | Shoulder tilt angle relative to horizontal plane (side bend)<br>肩部相对于水平面的倾斜角度（侧弯） | Backswing: 30-40° right tilt 右倾 <br> Impact: 25-35° left tilt 左倾 |
| **O-Factor** | O因子/髋倾斜 | Pelvis tilt angle relative to horizontal plane<br>骨盆相对于水平面的倾斜角度 | Stable 5-10° throughout swing<br>全程稳定在5-10° |
| **Forearm Rotation** | 前臂旋转 | Pronation/supination of forearm for clubface control<br>前臂内旋/外旋，用于控制杆面 | 60-90° total rotation through impact<br>击球时总旋转60-90° |
| **Wrist Cock** | 腕关节屈曲 | Radial deviation of wrist storing energy in backswing<br>上杆时手腕桡偏以储存能量 | 90-110° at top; released <30° before impact<br>顶点90-110°；击球前30°内释放 |

---

## 3. 线性运动指标 Linear Motion Metrics

| 术语 Term | 中文 | 定义 Definition | 职业标准 Pro Benchmark |
|-----------|------|----------------|---------------------|
| **Sway** | 侧移 | Lateral side-to-side movement along target line (X-axis)<br>沿目标线方向的左右横向移动（X轴） | <3 inches backswing 上杆<3英寸 <br> 4-6 inches downswing (toward target) 下杆4-6英寸（朝向目标） |
| **Thrust** | 前后移动 | Front-to-back movement perpendicular to target line (Y-axis)<br>垂直于目标线的前后移动（Y轴） | <2 inches total swing<br>全程<2英寸 |
| **Lift** | 垂直位移 | Up-down vertical movement (Z-axis)<br>上下垂直移动（Z轴） | 2-4 inches (squat then extend)<br>2-4英寸（先下蹲后伸展） |
| **Torso Sway** | 上躯干侧移 | Lateral translation of thorax center of mass<br>胸腔质心的横向平移 | Minimal; rotation dominant<br>最小化；以旋转为主 |
| **Pelvis Sway** | 骨盆侧移 | Lateral translation of pelvis; weight shift indicator<br>骨盆的横向平移；重心转移指标 | 3-5 inches toward target in downswing<br>下杆时朝向目标3-5英寸 |
| **Center of Mass (COM)** | 质心 | Weighted average position of body mass<br>身体质量的加权平均位置 | Stays within base of support (feet)<br>保持在支撑底面（双脚）内 |
| **Weight Shift** | 重心转移 | Redistribution of ground reaction forces between feet<br>双脚间地面反作用力的重新分配 | 60% trail → 80% lead at impact<br>击球时：60%后侧 → 80%引导侧 |

---

## 4. 速度与时机指标 Velocity & Timing Metrics

| 术语 Term | 中文 | 定义 Definition | 职业标准 Pro Benchmark |
|-----------|------|----------------|---------------------|
| **Angular Velocity** | 角速度 | Rate of rotation in degrees per second (°/s)<br>每秒旋转的度数（°/s） | See segment-specific values below<br>见下方各部位具体数值 |
| **Pelvis Rotation Velocity** | 骨盆旋转速度 | Peak rotational speed of pelvis during downswing<br>下杆过程中骨盆的峰值旋转速度 | 477-550°/s (mean 平均: 477°/s) |
| **Thorax Rotation Velocity** | 胸腔旋转速度 | Peak rotational speed of thorax during downswing<br>下杆过程中胸腔的峰值旋转速度 | 550-650°/s (mean 平均: 550°/s) |
| **Arm Rotation Velocity** | 手臂旋转速度 | Peak rotational speed of lead arm segment<br>引导侧手臂的峰值旋转速度 | 900-1200°/s |
| **Wrist Angular Velocity** | 腕关节角速度 | Peak rotational speed of wrist release<br>手腕释放时的峰值旋转速度 | 1500-2500°/s (highest in chain 链条中最高) |
| **Clubhead Speed** | 杆头速度 | Linear velocity of clubhead at impact<br>击球瞬间杆头的线速度 | 110-125 mph (pros 职业) <br> 85-95 mph (scratch 单差点) <br> 65-75 mph (15 hdcp 15差点) |
| **Peak Angular Velocity** | 峰值角速度 | Maximum rotational speed during downswing for any segment<br>下杆过程中任意部位的最大旋转速度 | Occurs sequentially 依次出现: Pelvis 骨盆 → Thorax 胸腔 → Arm 手臂 → Wrist 手腕 |
| **Rate of Velocity Development** | 速度增长率 | Acceleration slope (°/s²); how fast segment reaches peak speed<br>加速度斜率（°/s²）；部位达到峰值速度的快慢 | Higher = more explosive power<br>越高 = 爆发力越强 |

---

## 5. 节奏与时机 Tempo & Timing

| 术语 Term | 中文 | 定义 Definition | 职业标准 Pro Benchmark |
|-----------|------|----------------|---------------------|
| **Tempo** | 节奏 | Rhythmic pattern and timing characteristics of swing<br>挥杆的节律模式和时机特征 | Individual preference; consistency key<br>因人而异；一致性是关键 |
| **Tempo Ratio** | 节奏比 | Ratio of backswing duration to downswing duration:<br>Ratio = Backswing Time / Downswing Time<br>上杆时间与下杆时间的比值：节奏比 = 上杆时间 / 下杆时间 | 3:1 (most common 最常见) <br> Range 范围: 2:1 to 4:1 |
| **Backswing Duration** | 上杆时间 | Time from takeaway to top of backswing<br>从起杆到上杆顶点的时间 | 0.70-0.80s (driver 一号木) |
| **Downswing Duration** | 下杆时间 | Time from transition to impact<br>从转换期到击球的时间 | 0.23-0.28s (driver 一号木) |
| **Transition** | 转换期 | Critical 50-100ms window where pelvis initiates forward rotation while shoulders complete backswing; **X-Factor Stretch** occurs here<br>关键的50-100毫秒窗口，骨盆开始向前旋转而肩部完成上杆；**X因子伸展**在此发生 | 0.05-0.10s duration 持续时间 |
| **Time to Peak Velocity** | 达峰时间 | Time from downswing start to peak angular velocity for each segment<br>从下杆开始到各部位达到峰值角速度的时间 | Pelvis 骨盆: ~0.10s <br> Thorax 胸腔: ~0.15s <br> Arm 手臂: ~0.20s <br> Wrist 手腕: ~0.23s |
| **Time Between Peaks (TBP)** | 峰值间隔 | Temporal gap between segment peak velocities<br>各部位峰值速度之间的时间间隔 | Optimal 最佳: 20-50ms between segments 部位间 |

---

## 6. 运动链顺序 Kinematic Sequence

| 术语 Term | 中文 | 定义 Definition | 备注 Notes |
|-----------|------|----------------|-----------|
| **Kinematic Sequence** | 运动链顺序 | Ordered sequence of segment acceleration and deceleration:<br>1️⃣ Pelvis accelerates<br>2️⃣ Thorax accelerates (pelvis decelerates)<br>3️⃣ Arms accelerate (thorax decelerates)<br>4️⃣ Club accelerates (arms decelerate)<br>各部位加速与减速的有序序列：1️⃣骨盆加速 2️⃣胸腔加速（骨盆减速） 3️⃣手臂加速（胸腔减速） 4️⃣球杆加速（手臂减速） | Signature of efficient power transfer<br>高效能量传递的标志 |
| **Proximal-to-Distal Sequencing** | 近端到远端顺序 | Fundamental biomechanical principle: energy flows from body center (proximal) to extremities (distal)<br>基本生物力学原理：能量从身体中心（近端）流向四肢（远端） | Pelvis (proximal) → Wrist (distal)<br>骨盆（近端）→ 手腕（远端） |
| **Peak Timing** | 峰值时机 | Temporal location of each segment's peak angular velocity<br>各部位峰值角速度出现的时间点 | Must occur in sequence; no overlaps<br>必须按顺序出现；不能重叠 |
| **Deceleration** | 减速 | Slowing of proximal segment to transfer energy distally<br>近端部位减慢以将能量传递到远端 | Each segment decelerates as next accelerates<br>每个部位在下一个部位加速时减速 |
| **Transfer Ratio** | 传递比率 | Velocity ratio between adjacent segments:<br>Ratio = Distal Peak / Proximal Peak<br>相邻部位间的速度比：传递比率 = 远端峰值 / 近端峰值 | Ideal 理想: ~1.5x gain per segment 每个部位增加约1.5倍 <br> (e.g., Thorax/Pelvis = 1.3-1.5) |
| **Sequence Reversal** | 顺序颠倒 | Inefficient pattern where distal segment peaks before proximal<br>低效模式：远端部位在近端之前达到峰值 | Common fault 常见错误: Arms peak before thorax 手臂在胸腔之前达峰 |
| **Simultaneous Peaks** | 同步达峰 | Inefficient pattern where two segments peak together<br>低效模式：两个部位同时达到峰值 | Loss of energy transfer efficiency<br>能量传递效率损失 |
| **Double Peak** | 双峰 | Segment velocity graph shows two peaks instead of one<br>部位速度曲线显示两个峰值而非一个 | Indicates energy leak or re-acceleration<br>表明能量泄漏或重新加速 |

---

## 7. 肌电与肌肉术语 EMG & Muscle Terms

| 术语 Term | 中文 | 定义 Definition | 备注 Notes |
|-----------|------|----------------|-----------|
| **EMG (Electromyography)** | 肌电图 | Measurement of electrical activity produced by skeletal muscles<br>测量骨骼肌产生的电活动 | Surface EMG: non-invasive skin electrodes<br>表面肌电：非侵入性皮肤电极 |
| **Muscle Activation** | 肌肉激活 | Timing and intensity of muscle contraction; when/how hard muscle works<br>肌肉收缩的时机和强度；肌肉何时/多用力工作 | Measured as % of Maximum Voluntary Contraction (MVC)<br>以最大自主收缩百分比（%MVC）衡量 |
| **RMS Envelope** | 均方根包络 | Root Mean Square smoothing of raw EMG signal to show activation trend<br>对原始肌电信号进行均方根平滑以显示激活趋势 | Typical window 典型窗口: 50-100ms |
| **Onset Time** | 激活起始时间 | Moment when muscle begins contracting (exceeds baseline threshold)<br>肌肉开始收缩的时刻（超过基线阈值） | Typically 通常 >2 SD above baseline 高于基线2个标准差 |
| **Peak Time** | 峰值时间 | Moment of maximum muscle activation during swing phase<br>挥杆阶段肌肉激活达到最大值的时刻 | Varies by muscle and swing phase<br>因肌肉和挥杆阶段而异 |
| **Activation Sequence** | 激活顺序 | Order in which muscles activate during swing<br>挥杆过程中肌肉激活的顺序 | **Correct 正确**: Core 核心 → Obliques 腹斜肌 → Forearm 前臂 <br> **Faulty 错误**: Forearm activates first 前臂先激活 |
| **Compensation** | 代偿 | Incorrect muscle recruitment pattern where wrong muscles compensate for weak/inactive target muscles<br>错误的肌肉募集模式：错误的肌肉代替虚弱/未激活的目标肌肉工作 | Example 示例: Forearm working when core should 核心应工作时前臂代偿 |
| **MVC (Maximum Voluntary Contraction)** | 最大自主收缩 | Reference measurement: maximum force muscle can produce<br>参考测量：肌肉能产生的最大力量 | Used to normalize EMG data (% MVC)<br>用于归一化肌电数据（%MVC） |
| **Co-contraction** | 协同收缩 | Simultaneous activation of agonist and antagonist muscles<br>主动肌和拮抗肌同时激活 | Stabilizes joints but can reduce power<br>稳定关节但可能降低力量 |
| **Lead Oblique** | 引导侧腹斜肌 | External oblique on lead side; active in backswing rotation<br>引导侧外斜肌；在上杆旋转中活跃 | Left external oblique (RH golfer)<br>左侧外斜肌（右手球员） |
| **Trail Oblique** | 后侧腹斜肌 | Internal oblique on trail side; drives downswing rotation<br>后侧内斜肌；驱动下杆旋转 | Right internal oblique (RH golfer)<br>右侧内斜肌（右手球员） |

---

## 8. 性能相关术语 Performance Correlation Terms

| 术语 Term | 中文 | 定义 Definition | 应用 Application |
|-----------|------|----------------|-----------------|
| **Coefficient of Variation (CV)** | 变异系数 | Measure of consistency: CV = (Standard Deviation / Mean) × 100%<br>一致性测量：变异系数 = （标准差 / 平均值）× 100% | Lower CV = more consistent<br>越低 = 越稳定 <br> Good 良好: <5% for tempo metrics 节奏指标<5% |
| **Correlation Coefficient (r)** | 相关系数 | Statistical measure of linear relationship strength between two variables<br>两个变量间线性关系强度的统计量度 | r > 0.7 = strong positive 强正相关 <br> r < -0.7 = strong negative 强负相关 |
| **Clubhead Speed at Impact (CSI)** | 击球时杆头速度 | Primary outcome variable; determines ball distance<br>主要结果变量；决定球的飞行距离 | Driver 一号木: 110-125 mph (pros 职业) |
| **Free Moment** | 自由力矩 | Vertical torque component measured by force plate; rotation around vertical axis<br>测力板测量的垂直扭矩分量；绕垂直轴旋转 | Higher = more rotational power from ground<br>越高 = 从地面获得的旋转力量越大 |
| **Ground Reaction Force (GRF)** | 地面反作用力 | Forces exerted by ground on golfer's feet<br>地面施加在球员双脚上的力 | Vertical 垂直: 0.8-1.2× body weight 体重 <br> Lateral 横向: drives weight shift 驱动重心转移 |
| **Smash Factor** | 撞击因子 | Ball speed divided by clubhead speed; measures strike quality<br>球速除以杆头速度；衡量击球质量 | Optimal 最佳: 1.48-1.50 (driver 一号木) |
| **Ball Speed** | 球速 | Initial velocity of golf ball after impact<br>击球后高尔夫球的初始速度 | 1.48-1.50× clubhead speed (optimal 最佳) |
| **Launch Angle** | 发射角 | Vertical angle of ball trajectory at launch<br>发球时球轨迹的垂直角度 | Driver 一号木: 10-15° (optimal 最佳) |
| **Spin Rate** | 旋转率 | Backspin of ball in RPM<br>球的倒旋转速（每分钟转数） | Driver 一号木: 2200-2800 RPM (optimal 最佳) |

---

## 9. 挥杆阶段 Swing Phases

| 术语 Term | 中文 | 定义 Definition | 时长 Duration |
|-----------|------|----------------|--------------|
| **Address / Setup** | 准备站姿 | Initial stationary position before swing begins<br>挥杆开始前的初始静止姿势 | Static position<br>静态姿势 |
| **Takeaway** | 起杆 | First 12-18 inches of backswing; club moves away from ball<br>上杆的前12-18英寸；球杆远离球 | 0.10-0.15s |
| **Backswing** | 上杆 | Full rotation phase from takeaway to top<br>从起杆到顶点的完整旋转阶段 | 0.70-0.80s total 总计 |
| **Top of Backswing** | 上杆顶点 | Moment of maximum shoulder rotation; club reaches highest point<br>肩部旋转最大的时刻；球杆达到最高点 | Instantaneous (velocity = 0)<br>瞬时（速度 = 0） |
| **Transition** | 转换 | Critical reversal phase where pelvis starts forward while shoulders complete backswing; **X-Factor Stretch happens here**<br>关键反转阶段：骨盆开始向前而肩部完成上杆；**X因子伸展在此发生** | 0.05-0.10s |
| **Early Downswing** | 下杆前期 | Pelvis and thorax accelerate; arms passive<br>骨盆和胸腔加速；手臂被动 | 0.10-0.15s |
| **Late Downswing** | 下杆后期 | Arms and club accelerate toward impact<br>手臂和球杆朝击球方向加速 | 0.10-0.15s |
| **Impact** | 击球 | Clubface contacts ball; maximum clubhead speed<br>杆面接触球；杆头速度最大 | ~5ms contact time 接触时间 |
| **Follow-through** | 收杆 | Deceleration phase after impact; energy dissipation<br>击球后的减速阶段；能量消散 | 0.30-0.50s |
| **Finish** | 完成姿势 | Final balanced position after swing<br>挥杆后的最终平衡姿势 | Static position<br>静态姿势 |

---

## 10. 传感器测量术语 Sensor Measurement Terms

| 术语 Term | 中文 | 定义 Definition | 传感器类型 Sensor Type |
|-----------|------|----------------|---------------------|
| **IMU (Inertial Measurement Unit)** | 惯性测量单元 | Sensor combining accelerometer + gyroscope + (optional) magnetometer<br>结合加速度计 + 陀螺仪 +（可选）磁力计的传感器 | LSM6DSV16X (6-axis 六轴) |
| **Accelerometer** | 加速度计 | Measures linear acceleration in 3 axes (X, Y, Z)<br>测量三轴（X、Y、Z）的线性加速度 | Captures sway, thrust, lift<br>捕捉侧移、前后移动、垂直位移 |
| **Gyroscope** | 陀螺仪 | Measures angular velocity in 3 axes (pitch, roll, yaw)<br>测量三轴（俯仰、滚转、偏航）的角速度 | Captures rotation rates<br>捕捉旋转速率 |
| **Magnetometer** | 磁力计 | Measures magnetic field for absolute heading reference<br>测量磁场以获取绝对航向参考 | Optional; helps with drift correction<br>可选；帮助漂移校正 |
| **Drift** | 漂移 | Gradual accumulation of integration error in calculated angles<br>计算角度时积分误差的逐渐累积 | LSM6DSV16X: <1° per 45 min<br><1°/45分钟 |
| **Sensor Fusion** | 传感器融合 | Algorithmic combination of accelerometer + gyroscope data to calculate orientation<br>算法结合加速度计 + 陀螺仪数据计算方向 | Madgwick, Mahony, EKF algorithms<br>Madgwick、Mahony、EKF 算法 |
| **Quaternion** | 四元数 | Mathematical representation of 3D rotation (4 values: w, x, y, z)<br>3D旋转的数学表示（4个值：w、x、y、z） | Avoids gimbal lock vs. Euler angles<br>相比欧拉角避免万向锁 |
| **Euler Angles** | 欧拉角 | 3D rotation as yaw-pitch-roll angles<br>用偏航-俯仰-滚转角表示的3D旋转 | Intuitive but has gimbal lock issue<br>直观但有万向锁问题 |
| **Sampling Rate** | 采样率 | Frequency of sensor measurements (Hz)<br>传感器测量的频率（赫兹） | Golf 高尔夫: 100-200 Hz minimum 最低 <br> LSM6DSV16X: up to 最高 7.68 kHz |
| **EMG Electrode** | 肌电电极 | Surface sensor measuring muscle electrical activity<br>测量肌肉电活动的表面传感器 | Adhesive Ag/AgCl wet gel electrodes<br>粘性银/氯化银湿凝胶电极 |
| **Baseline Noise** | 基线噪声 | Electrical noise in EMG signal when muscle is relaxed<br>肌肉放松时肌电信号中的电噪声 | Must filter before onset detection<br>检测激活起始前必须滤除 |

---

## 11. 训练与反馈术语 Training & Feedback Terms

| 术语 Term | 中文 | 定义 Definition | 应用场景 Use Case |
|-----------|------|----------------|-----------------|
| **Real-Time Feedback** | 实时反馈 | Immediate auditory/visual/haptic cues during swing<br>挥杆过程中的即时听觉/视觉/触觉提示 | Must occur <300ms for effective learning<br>需在300毫秒内发生才能有效学习 |
| **Post-Swing Analysis** | 挥杆后分析 | Detailed review of swing metrics after completion<br>完成后对挥杆指标的详细回顾 | Mobile app visualization, coaching<br>移动应用可视化、教学 |
| **Benchmark Comparison** | 基准对比 | User's metrics vs. professional/ideal standards<br>用户指标与职业/理想标准的对比 | Shows deviation from optimal ranges<br>显示与最佳范围的偏差 |
| **Progression Tracking** | 进度追踪 | Longitudinal monitoring of metric improvements over time<br>随时间纵向监测指标改善 | Session-by-session trend analysis<br>逐次练习的趋势分析 |
| **Drill** | 练习动作 | Targeted exercise to improve specific swing component<br>针对特定挥杆环节改善的专项练习 | Example 示例: "Pelvis-first" transition drill 骨盆先行转换练习 |
| **Constraint-Based Training** | 约束训练 | Using physical/informational constraints to guide motor learning<br>使用物理/信息约束引导运动学习 | Example 示例: Limit backswing to 70° to feel X-Factor 限制上杆70°以感受X因子 |
| **Transfer of Learning** | 学习迁移 | Application of practiced skill to actual golf performance<br>将练习的技能应用到实际高尔夫表现 | Practice range → course performance<br>练习场 → 球场表现 |
| **Variability** | 变异性 | Natural fluctuation in swing metrics across repetitions<br>重复挥杆时指标的自然波动 | Some variability is healthy; CV indicates consistency<br>一定变异是健康的；变异系数指示一致性 |

---

## 12. 常见挥杆问题术语 Common Swing Fault Terms

| 术语 Term | 中文 | 定义 Definition | 生物力学特征 Biomechanical Signature |
|-----------|------|----------------|----------------------------------|
| **Early Extension** | 早起 | Premature straightening of hips in downswing; pelvis moves toward ball<br>下杆时髋部过早伸直；骨盆向球移动 | Thrust >3 inches 前后移动>3英寸; loss of spine angle 脊柱角度丢失 |
| **Sway** | 过度侧移 | Excessive lateral movement of pelvis away from target in backswing<br>上杆时骨盆过度远离目标横向移动 | Pelvis sway >5 inches 骨盆侧移>5英寸; weight stuck on trail side 重心滞留后侧 |
| **Reverse Pivot** | 反向转移 | Weight shifts toward target in backswing (opposite of correct)<br>上杆时重心向目标移动（与正确相反） | Weight >55% lead side at top<br>顶点时引导侧重心>55% |
| **Over-the-Top** | 外侧下杆 | Shoulders initiate downswing before pelvis; club comes outside-in<br>肩部在骨盆之前启动下杆；球杆由外向内 | Sequence reversal 顺序颠倒: Thorax peaks before pelvis 胸腔在骨盆之前达峰 |
| **Casting** | 早释放 | Premature release of wrist angle in downswing; power loss<br>下杆时过早释放手腕角度；力量损失 | Wrist uncocks before pelvis reaches peak velocity<br>手腕在骨盆达到峰值速度前释放 |
| **Chicken Wing** | 鸡翼 | Lead elbow bends and lifts through impact<br>击球时引导侧肘部弯曲上抬 | Compensation for early extension or poor sequencing<br>早起或顺序错误的代偿 |
| **Hanging Back** | 后撤 | Weight remains on trail side at impact<br>击球时重心停留在后侧 | Weight <60% lead side at impact<br>击球时引导侧重心<60% |
| **Slide** | 滑动 | Pelvis translates laterally without rotation<br>骨盆横向平移而无旋转 | High sway 高侧移, low pelvis rotation velocity 低骨盆旋转速度 |

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
| **Pose Estimation** | 姿态估计 | Detecting human body keypoints from images/video<br>从图像/视频中检测人体关键点 | Top-Down vs Bottom-Up approaches<br>自顶向下 vs 自底向上方法 |
| **Keypoint** | 关键点 | Body skeleton joint node (e.g., shoulder, elbow, wrist)<br>人体骨架关节节点（如肩、肘、腕） | COCO 17-point format standard<br>COCO 17点格式标准 |
| **RTMPose** | RTMPose | Real-time pose estimation model from OpenMMLab<br>OpenMMLab的实时姿态估计模型 | RTMPose-m: 75.8% AP, 70+ FPS mobile 移动端 |
| **AP (Average Precision)** | 平均精度 | Standard pose estimation accuracy metric; precision averaged across IoU thresholds<br>标准姿态估计精度指标；在各IoU阈值上取平均的精度 | `AP@0.5`, `AP@0.75`, mAP |
| **COCO Format** | COCO格式 | 17-keypoint body format: nose, eyes, ears, shoulders, elbows, wrists, hips, knees, ankles<br>17关键点身体格式：鼻、眼、耳、肩、肘、腕、髋、膝、踝 | Industry standard annotation format<br>行业标准标注格式 |

**我们选择 Our Choice**: RTMPose-m (13.6MB model 模型, optimal accuracy/speed trade-off 最佳精度/速度平衡)

详见 See: [视觉软件](../../components/vision/software.md)

---

## 14. 柔性传感器 Flexible Sensors

### FSR (Force Sensing Resistor) 力敏电阻

| 属性 Property | 描述 Description |
|--------------|-----------------|
| **原理 Principle** | Pressure increases → Resistance decreases<br>压力增加 → 电阻减小 |
| **厚度 Thickness** | <0.5mm (ultra-thin 超薄) |
| **应用 Applications** | Foot pressure, grip force, touch detection<br>足底压力、握力、触摸检测 |
| **常见产品 Products** | Interlink FSR 402/406, FlexiForce A201 |

详见 See: [压力传感器硬件](../../components/pressure-sensors/hardware.md)

### E-Skin (Electronic Skin) 电子皮肤

Flexible sensor arrays conforming to skin or curved surfaces.<br>贴合皮肤或曲面的柔性传感器阵列。

| 类型 Type | 原理 Principle | 测量内容 Measures | 特点 Characteristics |
|-----------|---------------|------------------|---------------------|
| **应变式 Strain** | Deformation → Resistance change<br>形变 → 电阻变化 | Bending/stretching<br>弯曲/拉伸 | Good linearity<br>线性度好 |
| **压阻式 Piezoresistive** | Pressure → Resistance change<br>压力 → 电阻变化 | Pressure distribution<br>压力分布 | High sensitivity<br>灵敏度高 |
| **电容式 Capacitive** | Deformation → Capacitance change<br>形变 → 电容变化 | Deformation<br>形变 | High precision<br>精度高 |
| **压电式 Piezoelectric** | Deformation → Voltage<br>形变 → 电压 | Dynamic changes<br>动态变化 | Fast response<br>响应快 |

**我们研究的产品 Products Researched**: StretchSense (capacitive 电容式), BendLabs (resistive 电阻式), Bebop Sensors, 国产: 能斯达、纽迪瑞

详见 See: [柔性传感器硬件](../../components/flexible-sensors/hardware.md)

---

## 15. 数据融合与部署 Data Fusion & Deployment

| 术语 Term | 中文 | 定义 Definition | 备注 Notes |
|-----------|------|----------------|-----------|
| **Multi-Modal Fusion** | 多模态融合 | Combining multiple data sources for joint analysis<br>组合多种数据源进行联合分析 | Vision + Pressure + EMG + E-Skin + IMU<br>视觉 + 压力 + 肌电 + 电子皮肤 + 惯性 |
| **Time Synchronization** | 时间同步 | Aligning sensor data to unified timeline<br>将传感器数据对齐到统一时间线 | Software 软件 (~10ms), Hardware 硬件 (<1ms), Event-based 基于事件 |
| **Feature Engineering** | 特征工程 | Extracting meaningful features from raw sensor data<br>从原始传感器数据中提取有意义的特征 | Joint angles 关节角度, CoP trajectory 压力中心轨迹, activation timing 激活时机 |
| **ONNX** | 开放神经网络交换格式 | Universal ML model format for cross-platform deployment<br>跨平台部署的通用机器学习模型格式 | Train 训练: PyTorch → Export 导出: ONNX → Infer 推理: ONNX Runtime Mobile |

**MVP1 架构**: MediaPipe iOS SDK (内置 TFLite 推理引擎)

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
| 1.2 | 2025-12-18 | 双语化: 所有定义添加中文翻译 |

---

**维护者 Maintainer**: Movement Chain AI Team
**最后更新 Last Updated**: 2025-12-18
