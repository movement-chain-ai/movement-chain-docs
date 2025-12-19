# MVP 原型代码示例

> **文档目的**: 提供完整的 MVP 原型代码，可直接运行验证
>
> **阅读对象**: 算法工程师、后端开发
>
> **相关文档**: [挥杆对比策略](../design/specs/swing-comparison.md) - 全身数据采集设计与四种对比方法

---

## 依赖安装

```bash
# 核心依赖
pip install mediapipe opencv-python numpy

# EMG 处理
pip install neurokit2

# 可视化 (可选)
pip install matplotlib plotly

# 交互式 Demo (可选)
pip install streamlit
```

---

## 完整 MVP 代码

### 1. 数据采集模块

```python
"""
数据采集模块: Vision + IMU (Mock) + EMG (Mock)
"""

import cv2
import mediapipe as mp
import numpy as np
import neurokit2 as nk

# ═══════════════════════════════════════════════════════════════════════════
# Vision 数据采集 (MediaPipe)
# ═══════════════════════════════════════════════════════════════════════════

class VisionCapture:
    """使用 MediaPipe Pose 提取骨架"""

    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        self.mp_drawing = mp.solutions.drawing_utils

    def process_frame(self, frame):
        """处理单帧，返回骨架数据"""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(rgb_frame)

        if results.pose_landmarks:
            return {
                'landmarks': results.pose_landmarks.landmark,
                'raw_results': results
            }
        return None

    def process_video(self, video_path):
        """处理整个视频，返回所有帧的骨架数据"""
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        frames_data = []

        frame_idx = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            result = self.process_frame(frame)
            if result:
                frames_data.append({
                    'frame_idx': frame_idx,
                    'timestamp_sec': frame_idx / fps,
                    'landmarks': result['landmarks'],
                    'frame': frame
                })
            frame_idx += 1

        cap.release()
        return frames_data, fps


# ═══════════════════════════════════════════════════════════════════════════
# IMU Mock 数据生成 (支持多位置)
# ═══════════════════════════════════════════════════════════════════════════

class IMUMockGenerator:
    """
    生成模拟的高尔夫挥杆 IMU 数据

    支持多个传感器位置，每个位置有不同的运动特征:
    - wrist: 手腕 - 最高角速度，击球时机精确
    - pelvis: 骨盆 - 髋部旋转，先于手腕启动
    - upper_back: 上背 - 肩膀旋转，X-Factor 来源

    设计依据: docs/zh/design/specs/swing-comparison.md#imu-放置位置-研究验证
    """

    # 传感器位置及其特征参数
    LOCATIONS = {
        'wrist': {
            'peak_angular_velocity': 1500,  # °/s - 最高
            'phase_delay': 0,               # 基准
            'noise_level': 20
        },
        'pelvis': {
            'peak_angular_velocity': 400,   # °/s - 较低
            'phase_delay': -50,             # 领先手腕 50ms
            'noise_level': 15
        },
        'upper_back': {
            'peak_angular_velocity': 600,   # °/s - 中等
            'phase_delay': -30,             # 领先手腕 30ms
            'noise_level': 18
        }
    }

    def __init__(self, sample_rate=100, duration_sec=2.0):
        self.sample_rate = sample_rate
        self.duration = duration_sec
        self.n_samples = int(sample_rate * duration_sec)

    def generate_swing(self, location='wrist'):
        """
        生成指定位置的 IMU 数据

        Args:
            location: 传感器位置 ('wrist', 'pelvis', 'upper_back')

        Returns:
            dict: 包含 6 轴数据和时间戳
        """
        if location not in self.LOCATIONS:
            raise ValueError(f"Unknown location: {location}. Use: {list(self.LOCATIONS.keys())}")

        params = self.LOCATIONS[location]
        t = np.linspace(0, self.duration, self.n_samples)

        # 挥杆阶段划分 (考虑相位延迟)
        phase_shift = int(params['phase_delay'] / 1000 * self.sample_rate)
        backswing_end = int(self.n_samples * 0.4) + phase_shift
        downswing_end = int(self.n_samples * 0.6) + phase_shift

        # 确保索引在有效范围内
        backswing_end = max(1, min(backswing_end, self.n_samples - 2))
        downswing_end = max(backswing_end + 1, min(downswing_end, self.n_samples - 1))

        # 角速度曲线 (根据位置调整峰值)
        peak = params['peak_angular_velocity']
        gyro_z = np.zeros(self.n_samples)
        gyro_z[:backswing_end] = np.linspace(0, -peak * 0.25, backswing_end)
        gyro_z[backswing_end:downswing_end] = np.linspace(-peak * 0.25, peak, downswing_end - backswing_end)
        gyro_z[downswing_end:] = np.linspace(peak, 0, self.n_samples - downswing_end)

        # 添加噪声
        noise = params['noise_level']
        gyro_z += np.random.normal(0, noise, self.n_samples)

        # 加速度 (简化模型)
        accel_x = np.gradient(gyro_z) * 0.1 + np.random.normal(0, 0.5, self.n_samples)

        return {
            'location': location,
            'timestamps': t,
            'gyro_z': gyro_z,
            'gyro_x': np.random.normal(0, noise * 0.5, self.n_samples),
            'gyro_y': np.random.normal(0, noise * 0.5, self.n_samples),
            'accel_x': accel_x,
            'accel_y': np.random.normal(0, 0.5, self.n_samples) - 9.8,
            'accel_z': np.random.normal(0, 0.5, self.n_samples),
            'sample_rate': self.sample_rate
        }

    def generate_full_body(self):
        """生成所有位置的 IMU 数据"""
        return {loc: self.generate_swing(loc) for loc in self.LOCATIONS}


# ═══════════════════════════════════════════════════════════════════════════
# EMG Mock 数据生成 (支持多肌群)
# ═══════════════════════════════════════════════════════════════════════════

class EMGMockGenerator:
    """
    生成模拟的高尔夫挥杆 EMG 数据

    支持 4 个关键肌群，每个有不同的激活时序 (力量链):
    - core_obliques: 腹斜肌 - 下杆启动，最早激活
    - forearm_flexors: 前臂屈肌 - 击球时激活，应晚于核心
    - glutes: 臀大肌 - 重心转移，持续激活
    - lats: 背阔肌 - 上杆-下杆过渡，峰值在顶点

    设计依据: docs/zh/design/specs/swing-comparison.md#emg-肌群-高尔夫力量链
    """

    # 肌群及其激活特征
    MUSCLES = {
        'core_obliques': {
            'burst_start': 0.35,    # 占比: 35% 处开始 (下杆启动)
            'burst_duration': 0.5,   # 持续时间
            'peak_timing': 0.5,      # 峰值位置
            'description': '腹斜肌 - 下杆启动'
        },
        'forearm_flexors': {
            'burst_start': 0.50,    # 占比: 50% 处开始 (击球前)
            'burst_duration': 0.3,
            'peak_timing': 0.6,      # 击球时峰值
            'description': '前臂屈肌 - 击球'
        },
        'glutes': {
            'burst_start': 0.30,    # 占比: 30% 处开始 (重心转移)
            'burst_duration': 0.6,   # 持续较长
            'peak_timing': 0.45,
            'description': '臀大肌 - 重心转移'
        },
        'lats': {
            'burst_start': 0.25,    # 占比: 25% 处开始 (上杆末期)
            'burst_duration': 0.4,
            'peak_timing': 0.4,      # 顶点处峰值
            'description': '背阔肌 - 过渡'
        }
    }

    def __init__(self, sample_rate=200, duration_sec=2.0):
        self.sample_rate = sample_rate
        self.duration = duration_sec
        self.n_samples = int(sample_rate * duration_sec)

    def generate_swing(self, muscle_activations=None):
        """
        生成挥杆 EMG 数据

        Args:
            muscle_activations: dict, 每个肌群的激活水平 (0-1)
                默认: {'core_obliques': 0.6, 'forearm_flexors': 0.6,
                       'glutes': 0.5, 'lats': 0.5}

        Returns:
            dict: 包含所有肌群的 EMG 数据
        """
        # 默认激活水平 (正常挥杆)
        default_activations = {
            'core_obliques': 0.6,
            'forearm_flexors': 0.6,
            'glutes': 0.5,
            'lats': 0.5
        }

        if muscle_activations:
            default_activations.update(muscle_activations)

        t = np.linspace(0, self.duration, self.n_samples)
        result = {'timestamps': t, 'sample_rate': self.sample_rate}

        for muscle, params in self.MUSCLES.items():
            activation_level = default_activations.get(muscle, 0.5)

            # 生成 EMG 信号
            raw_emg = nk.emg_simulate(
                duration=self.duration,
                sampling_rate=self.sample_rate,
                burst_number=1,
                burst_duration=params['burst_duration'],
                noise=0.1
            ) * activation_level * 100

            # 处理信号
            cleaned = nk.emg_clean(raw_emg, sampling_rate=self.sample_rate)
            amplitude = nk.emg_amplitude(cleaned)

            result[muscle] = {
                'raw': raw_emg,
                'cleaned': cleaned,
                'rms_envelope': amplitude,
                'activation_level': activation_level,
                'description': params['description']
            }

        return result

    def generate_problem_scenario(self, scenario='weak_core'):
        """
        生成特定问题场景的 EMG 数据

        Args:
            scenario: 问题类型
                - 'weak_core': 核心不足，手臂代偿
                - 'early_release': 过早释放
                - 'over_tension': 全身紧张
                - 'normal': 正常挥杆

        Returns:
            dict: EMG 数据
        """
        scenarios = {
            'weak_core': {
                'core_obliques': 0.3,
                'forearm_flexors': 0.8,  # 手臂代偿
                'glutes': 0.4,
                'lats': 0.5
            },
            'early_release': {
                'core_obliques': 0.5,
                'forearm_flexors': 0.9,  # 过早过强
                'glutes': 0.4,
                'lats': 0.4
            },
            'over_tension': {
                'core_obliques': 0.9,
                'forearm_flexors': 0.9,
                'glutes': 0.8,
                'lats': 0.8
            },
            'normal': {
                'core_obliques': 0.6,
                'forearm_flexors': 0.6,
                'glutes': 0.5,
                'lats': 0.5
            }
        }

        if scenario not in scenarios:
            raise ValueError(f"Unknown scenario: {scenario}. Use: {list(scenarios.keys())}")

        return self.generate_swing(scenarios[scenario])


# ═══════════════════════════════════════════════════════════════════════════
# Pose Mock 数据生成 (无需摄像头测试)
# ═══════════════════════════════════════════════════════════════════════════

class PoseMockGenerator:
    """
    生成模拟的 MediaPipe 33 关键点数据

    用于在没有摄像头的情况下测试管道，生成合理的高尔夫挥杆姿态序列。

    设计依据: docs/zh/design/specs/swing-comparison.md#mediapipe-33-关键点-按高尔夫相关性
    """

    # MediaPipe 33 关键点名称
    KEYPOINT_NAMES = [
        'nose', 'left_eye_inner', 'left_eye', 'left_eye_outer',
        'right_eye_inner', 'right_eye', 'right_eye_outer',
        'left_ear', 'right_ear', 'mouth_left', 'mouth_right',
        'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
        'left_wrist', 'right_wrist', 'left_pinky', 'right_pinky',
        'left_index', 'right_index', 'left_thumb', 'right_thumb',
        'left_hip', 'right_hip', 'left_knee', 'right_knee',
        'left_ankle', 'right_ankle', 'left_heel', 'right_heel',
        'left_foot_index', 'right_foot_index'
    ]

    # 高尔夫相关关键点分组
    GOLF_KEYPOINTS = {
        'torso': [11, 12, 23, 24],      # 肩膀和髋部 - X-Factor
        'arms': [13, 14, 15, 16],        # 肘和腕 - 挥杆路径
        'legs': [25, 26, 27, 28],        # 膝和踝 - 重心转移
    }

    def __init__(self, fps=30, duration_sec=2.0):
        self.fps = fps
        self.duration = duration_sec
        self.n_frames = int(fps * duration_sec)

    def generate_swing(self, swing_quality='normal'):
        """
        生成挥杆姿态序列

        Args:
            swing_quality: 挥杆质量
                - 'normal': 标准挥杆
                - 'poor_rotation': 转肩不足
                - 'sway': 重心侧移

        Returns:
            np.ndarray: (n_frames, 33, 3) 的关键点数组
        """
        poses = np.zeros((self.n_frames, 33, 3))

        # 基础站姿 (Address)
        base_pose = self._create_address_pose()

        for frame_idx in range(self.n_frames):
            progress = frame_idx / self.n_frames

            # 挥杆阶段
            if progress < 0.4:  # 上杆
                phase_progress = progress / 0.4
                rotation = phase_progress * 90 if swing_quality == 'normal' else phase_progress * 60
            elif progress < 0.6:  # 下杆
                phase_progress = (progress - 0.4) / 0.2
                rotation = 90 - phase_progress * 100  # 快速下杆
            else:  # 送杆
                phase_progress = (progress - 0.6) / 0.4
                rotation = -10 - phase_progress * 80

            # 应用旋转到基础姿态
            poses[frame_idx] = self._apply_rotation(base_pose, rotation, swing_quality)

        return poses

    def _create_address_pose(self):
        """创建准备站姿"""
        pose = np.zeros((33, 3))

        # 简化的关键点位置 (归一化坐标 0-1)
        # 头部
        pose[0] = [0.5, 0.15, 0]  # nose

        # 肩膀
        pose[11] = [0.4, 0.3, 0]   # left_shoulder
        pose[12] = [0.6, 0.3, 0]   # right_shoulder

        # 髋部
        pose[23] = [0.45, 0.55, 0]  # left_hip
        pose[24] = [0.55, 0.55, 0]  # right_hip

        # 手臂
        pose[13] = [0.35, 0.4, 0]   # left_elbow
        pose[14] = [0.65, 0.4, 0]   # right_elbow
        pose[15] = [0.4, 0.5, 0.1]  # left_wrist
        pose[16] = [0.6, 0.5, 0.1]  # right_wrist

        # 腿部
        pose[25] = [0.45, 0.7, 0]   # left_knee
        pose[26] = [0.55, 0.7, 0]   # right_knee
        pose[27] = [0.45, 0.9, 0]   # left_ankle
        pose[28] = [0.55, 0.9, 0]   # right_ankle

        return pose

    def _apply_rotation(self, base_pose, rotation_deg, quality):
        """应用旋转变换"""
        pose = base_pose.copy()
        rad = np.radians(rotation_deg)

        # 旋转肩膀
        center = (pose[11] + pose[12]) / 2
        for idx in [11, 12, 13, 14, 15, 16]:  # 上身
            offset = pose[idx] - center
            pose[idx][0] = center[0] + offset[0] * np.cos(rad) - offset[2] * np.sin(rad)
            pose[idx][2] = offset[0] * np.sin(rad) + offset[2] * np.cos(rad)

        return pose

    def to_landmark_format(self, poses):
        """
        转换为 MediaPipe landmark 格式

        Returns:
            list: 每帧的 landmark 列表，每个 landmark 有 x, y, z, visibility
        """
        frames = []
        for frame_poses in poses:
            landmarks = []
            for i, (x, y, z) in enumerate(frame_poses):
                landmarks.append({
                    'x': x, 'y': y, 'z': z,
                    'visibility': 0.95 if i in sum(self.GOLF_KEYPOINTS.values(), []) else 0.8
                })
            frames.append(landmarks)
        return frames
```

### 2. 时间同步模块

```python
"""
时间同步模块: 将不同采样率的数据对齐到统一时间轴
"""

import numpy as np

def sync_to_vision_timeline(vision_timestamps, imu_data, emg_data):
    """
    将 IMU 和 EMG 数据对齐到 Vision 时间轴 (30fps)

    Args:
        vision_timestamps: Vision 帧的时间戳数组
        imu_data: IMU 数据字典 (100Hz)
        emg_data: EMG 数据字典 (200Hz)

    Returns:
        synced_data: 对齐后的数据字典
    """

    # IMU 线性插值到 Vision 时间点
    imu_synced = {
        'gyro_z': np.interp(vision_timestamps, imu_data['timestamps'], imu_data['gyro_z']),
        'gyro_x': np.interp(vision_timestamps, imu_data['timestamps'], imu_data['gyro_x']),
        'gyro_y': np.interp(vision_timestamps, imu_data['timestamps'], imu_data['gyro_y']),
        'accel_x': np.interp(vision_timestamps, imu_data['timestamps'], imu_data['accel_x']),
        'accel_y': np.interp(vision_timestamps, imu_data['timestamps'], imu_data['accel_y']),
        'accel_z': np.interp(vision_timestamps, imu_data['timestamps'], imu_data['accel_z']),
    }

    # EMG 插值 (使用 RMS 包络)
    emg_synced = {
        'forearm_flexor': np.interp(
            vision_timestamps,
            emg_data['timestamps'],
            emg_data['forearm_flexor']['rms_envelope']
        ),
        'core_rectus': np.interp(
            vision_timestamps,
            emg_data['timestamps'],
            emg_data['core_rectus']['rms_envelope']
        ),
    }

    return {
        'timestamps': vision_timestamps,
        'imu': imu_synced,
        'emg': emg_synced
    }
```

### 3. 特征提取模块

```python
"""
特征提取模块: 从原始数据计算有意义的特征
"""

import math
import numpy as np

def extract_vision_features(landmarks):
    """
    从 MediaPipe 骨架提取高尔夫相关特征

    Args:
        landmarks: MediaPipe Pose 输出的 33 个关节点

    Returns:
        features: 特征字典
    """
    # MediaPipe Pose 关节点索引
    LEFT_SHOULDER, RIGHT_SHOULDER = 11, 12
    LEFT_HIP, RIGHT_HIP = 23, 24
    LEFT_ELBOW, RIGHT_ELBOW = 13, 14
    LEFT_WRIST, RIGHT_WRIST = 15, 16

    # 1. 肩膀旋转角度 (上杆顶点应 >90°)
    shoulder_angle = math.degrees(math.atan2(
        landmarks[RIGHT_SHOULDER].z - landmarks[LEFT_SHOULDER].z,
        landmarks[RIGHT_SHOULDER].x - landmarks[LEFT_SHOULDER].x
    ))

    # 2. 髋部旋转角度 (应比肩膀小，约 45°)
    hip_angle = math.degrees(math.atan2(
        landmarks[RIGHT_HIP].z - landmarks[LEFT_HIP].z,
        landmarks[RIGHT_HIP].x - landmarks[LEFT_HIP].x
    ))

    # 3. X-因子 (肩-髋分离角度，动力来源)
    x_factor = abs(shoulder_angle) - abs(hip_angle)

    # 4. 左肘角度 (保持伸直约 170-180°)
    left_elbow_angle = calculate_angle(
        landmarks[LEFT_SHOULDER],
        landmarks[LEFT_ELBOW],
        landmarks[LEFT_WRIST]
    )

    # 5. 脊柱倾斜 (应保持稳定)
    spine_tilt = math.degrees(math.atan2(
        landmarks[LEFT_SHOULDER].y - landmarks[LEFT_HIP].y,
        landmarks[LEFT_SHOULDER].x - landmarks[LEFT_HIP].x
    ))

    return {
        'shoulder_rotation': abs(shoulder_angle),
        'hip_rotation': abs(hip_angle),
        'x_factor': x_factor,
        'left_elbow_angle': left_elbow_angle,
        'spine_tilt': spine_tilt
    }


def calculate_angle(a, b, c):
    """计算三点形成的角度 (b 为顶点)"""
    ba = np.array([a.x - b.x, a.y - b.y, a.z - b.z])
    bc = np.array([c.x - b.x, c.y - b.y, c.z - b.z])

    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-6)
    angle = np.arccos(np.clip(cosine_angle, -1, 1))

    return np.degrees(angle)


def extract_imu_features(imu_data):
    """
    从 IMU 数据提取挥杆节奏特征

    Args:
        imu_data: 同步后的 IMU 数据

    Returns:
        features: 特征字典
    """
    gyro_z = imu_data['gyro_z']
    timestamps = imu_data.get('timestamps', np.arange(len(gyro_z)))

    # 1. 峰值角速度 (击球力量指标)
    peak_velocity = np.max(np.abs(gyro_z))
    peak_idx = np.argmax(np.abs(gyro_z))

    # 2. 找到上杆顶点 (角速度由负转正)
    zero_crossings = np.where(np.diff(np.sign(gyro_z)))[0]

    if len(zero_crossings) > 0 and peak_idx > zero_crossings[0]:
        top_idx = zero_crossings[0]

        # 3. 节奏比 = 上杆时间 / 下杆时间 (理想 3:1)
        backswing_duration = timestamps[top_idx] - timestamps[0]
        downswing_duration = timestamps[peak_idx] - timestamps[top_idx]

        tempo_ratio = backswing_duration / downswing_duration if downswing_duration > 0 else 0
    else:
        tempo_ratio = 0
        top_idx = 0

    return {
        'peak_angular_velocity': peak_velocity,
        'tempo_ratio': tempo_ratio,
        'top_of_backswing_idx': top_idx,
        'impact_idx': peak_idx
    }


def extract_emg_features(emg_data, swing_phases=None):
    """
    从 EMG 数据提取肌肉激活特征

    Args:
        emg_data: 同步后的 EMG 数据
        swing_phases: 挥杆阶段划分 (可选)

    Returns:
        features: 特征字典
    """
    forearm = emg_data['forearm_flexor']
    core = emg_data['core_rectus']

    n_samples = len(forearm)

    # 如果没有提供阶段划分，使用默认划分
    if swing_phases is None:
        downswing_start = int(n_samples * 0.4)
        impact = int(n_samples * 0.6)
    else:
        downswing_start = swing_phases['downswing_start']
        impact = swing_phases['impact']

    # 1. 下杆阶段平均激活
    forearm_activation = np.mean(forearm[downswing_start:impact])
    core_activation = np.mean(core[downswing_start:impact])

    # 2. 激活时序 (核心应先于前臂)
    forearm_onset = np.argmax(forearm > np.max(forearm) * 0.3)
    core_onset = np.argmax(core > np.max(core) * 0.3)
    activation_sequence_correct = core_onset <= forearm_onset

    # 3. 峰值激活
    forearm_peak = np.max(forearm)
    core_peak = np.max(core)

    return {
        'forearm_activation': forearm_activation,
        'core_activation': core_activation,
        'forearm_peak': forearm_peak,
        'core_peak': core_peak,
        'activation_sequence_correct': activation_sequence_correct,
        'forearm_onset_idx': forearm_onset,
        'core_onset_idx': core_onset
    }
```

### 4. 规则引擎模块

```python
"""
规则引擎模块: 基于生物力学阈值分析挥杆
"""

def analyze_swing(vision_features, imu_features, emg_features):
    """
    综合分析挥杆，返回问题和建议

    这就是"规则引擎"——本质上是 IF-THEN 代码！

    Args:
        vision_features: 视觉特征
        imu_features: IMU 特征
        emg_features: EMG 特征

    Returns:
        analysis: 分析结果
    """
    problems = []
    suggestions = []
    score = 100

    # ═══════════════════════════════════════════════════════════════════════
    # Vision 规则
    # ═══════════════════════════════════════════════════════════════════════

    # 规则 1: 肩膀旋转
    if vision_features['shoulder_rotation'] < 85:
        problems.append(f"转肩不足 ({vision_features['shoulder_rotation']:.0f}°，应 >85°)")
        suggestions.append("上杆时让左肩指向球，感受背部拉伸")
        score -= 15

    # 规则 2: 髋部旋转
    if vision_features['hip_rotation'] < 40:
        problems.append(f"髋部旋转不足 ({vision_features['hip_rotation']:.0f}°，应 >40°)")
        suggestions.append("场下练习：髋部拉伸，增加活动度")
        score -= 10

    # 规则 3: X-因子
    if vision_features['x_factor'] < 35:
        problems.append(f"X-因子过小 ({vision_features['x_factor']:.0f}°，应 >35°)")
        suggestions.append("上杆时保持下盘稳定，让肩膀多转")
        score -= 10

    # 规则 4: 左肘角度 (保持伸直)
    if vision_features['left_elbow_angle'] < 160:
        problems.append(f"左肘弯曲过多 ({vision_features['left_elbow_angle']:.0f}°，应 >160°)")
        suggestions.append("上杆时保持左臂伸直")
        score -= 10

    # ═══════════════════════════════════════════════════════════════════════
    # IMU 规则
    # ═══════════════════════════════════════════════════════════════════════

    # 规则 5: 挥杆节奏
    if imu_features['tempo_ratio'] < 2.5:
        problems.append(f"下杆节奏太快 ({imu_features['tempo_ratio']:.1f}:1，理想 3:1)")
        suggestions.append("上杆数1-2-3，下杆数4，保持节奏")
        score -= 10

    if imu_features['tempo_ratio'] > 4.0:
        problems.append(f"下杆节奏太慢 ({imu_features['tempo_ratio']:.1f}:1)")
        suggestions.append("下杆可以更果断，但保持顺畅")
        score -= 5

    # 规则 6: 峰值角速度 (力量指标)
    if imu_features['peak_angular_velocity'] < 800:
        problems.append(f"挥杆速度偏低 ({imu_features['peak_angular_velocity']:.0f}°/s)")
        suggestions.append("加强核心力量训练，提高挥杆速度")
        score -= 5

    # ═══════════════════════════════════════════════════════════════════════
    # EMG 规则 (核心差异化！)
    # ═══════════════════════════════════════════════════════════════════════

    # 规则 7: 核心激活检查
    if emg_features['core_activation'] < 40 and emg_features['forearm_activation'] > 50:
        problems.append("核心激活不足，手臂代偿")
        suggestions.append("场下训练：平板支撑 3x60秒，俄罗斯转体 3x20")
        score -= 20  # 这是最严重的问题！

    # 规则 8: 发力时序
    if not emg_features['activation_sequence_correct']:
        problems.append("发力时序错误：手臂先于核心")
        suggestions.append("练习从髋部启动下杆的感觉")
        score -= 15

    # ═══════════════════════════════════════════════════════════════════════
    # 生成综合反馈
    # ═══════════════════════════════════════════════════════════════════════

    # 判断等级
    if score >= 90:
        grade = "优秀"
        summary = "挥杆动作非常标准！"
    elif score >= 75:
        grade = "良好"
        summary = "整体不错，有小问题需要改进"
    elif score >= 60:
        grade = "一般"
        summary = "有几个明显问题需要改进"
    else:
        grade = "需改进"
        summary = "建议从基础动作开始重新练习"

    return {
        'score': max(0, score),
        'grade': grade,
        'summary': summary,
        'problems': problems,
        'suggestions': suggestions,
        'features': {
            'vision': vision_features,
            'imu': imu_features,
            'emg': emg_features
        }
    }
```

### 5. 可视化模块

```python
"""
可视化模块: 在视频帧上绘制骨架和分析结果
"""

import cv2
import mediapipe as mp

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

def visualize_analysis(frame, pose_results, analysis, ghost_landmarks=None):
    """
    在视频帧上绘制骨架和分析结果

    Args:
        frame: 原始视频帧
        pose_results: MediaPipe Pose 结果
        analysis: 规则引擎分析结果
        ghost_landmarks: Ghost 理想骨架 (可选)

    Returns:
        annotated_frame: 标注后的帧
    """
    annotated_frame = frame.copy()
    h, w = frame.shape[:2]

    # 1. 绘制用户骨架
    if pose_results and pose_results.pose_landmarks:
        # 根据评分选择颜色
        if analysis['score'] >= 80:
            color = (0, 255, 0)  # 绿色 - 好
        elif analysis['score'] >= 60:
            color = (0, 255, 255)  # 黄色 - 一般
        else:
            color = (0, 0, 255)  # 红色 - 差

        mp_drawing.draw_landmarks(
            annotated_frame,
            pose_results.pose_landmarks,
            mp_pose.POSE_CONNECTIONS,
            landmark_drawing_spec=mp_drawing.DrawingSpec(color=color, thickness=2, circle_radius=3),
            connection_drawing_spec=mp_drawing.DrawingSpec(color=color, thickness=2)
        )

    # 2. 绘制 Ghost 骨架 (如果有)
    if ghost_landmarks:
        overlay = annotated_frame.copy()
        ghost_color = (0, 255, 0)  # 绿色半透明

        # 绘制 Ghost 关节点和连接
        connections = [
            (11, 12), (11, 13), (13, 15),  # 左臂
            (12, 14), (14, 16),             # 右臂
            (11, 23), (12, 24),             # 躯干
            (23, 24), (23, 25), (24, 26),   # 髋部和腿
        ]

        for start_idx, end_idx in connections:
            if start_idx < len(ghost_landmarks) and end_idx < len(ghost_landmarks):
                start_pt = (int(ghost_landmarks[start_idx]['x'] * w),
                           int(ghost_landmarks[start_idx]['y'] * h))
                end_pt = (int(ghost_landmarks[end_idx]['x'] * w),
                         int(ghost_landmarks[end_idx]['y'] * h))
                cv2.line(overlay, start_pt, end_pt, ghost_color, 3)

        # 混合叠加
        cv2.addWeighted(overlay, 0.3, annotated_frame, 0.7, 0, annotated_frame)

    # 3. 绘制评分和问题
    y_offset = 30

    # 评分
    cv2.putText(annotated_frame, f"Score: {analysis['score']} ({analysis['grade']})",
                (10, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    y_offset += 40

    # 问题列表
    for problem in analysis['problems'][:3]:  # 最多显示3个
        cv2.putText(annotated_frame, f"! {problem}",
                    (10, y_offset), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        y_offset += 25

    return annotated_frame
```

### 6. 主流程示例

```python
"""
主流程: 完整的 MVP 演示
"""

def main():
    # ═══════════════════════════════════════════════════════════════════════
    # 初始化
    # ═══════════════════════════════════════════════════════════════════════

    vision_capture = VisionCapture()
    imu_generator = IMUMockGenerator(sample_rate=100, duration_sec=2.0)
    emg_generator = EMGMockGenerator(sample_rate=200, duration_sec=2.0)

    # ═══════════════════════════════════════════════════════════════════════
    # 数据采集 (使用 Mock 数据演示)
    # ═══════════════════════════════════════════════════════════════════════

    # 实际使用时替换为真实视频
    # vision_data, fps = vision_capture.process_video("golf_swing.mp4")

    # Mock Vision 数据 (用于测试)
    # 这里用摄像头实时采集演示
    cap = cv2.VideoCapture(0)  # 或使用视频文件

    # 生成 Mock IMU 和 EMG 数据
    imu_data = imu_generator.generate_swing()

    # 模拟不同问题场景
    # 场景1: 核心激活不足 (常见问题)
    emg_data = emg_generator.generate_swing(
        core_activation_level=0.3,    # 核心弱
        forearm_activation_level=0.8  # 手臂代偿
    )

    print("按 'q' 退出，按 's' 分析当前帧")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # 处理视频帧
        result = vision_capture.process_frame(frame)

        if result:
            # ═══════════════════════════════════════════════════════════════
            # 特征提取
            # ═══════════════════════════════════════════════════════════════

            vision_features = extract_vision_features(result['landmarks'])
            imu_features = extract_imu_features({'gyro_z': imu_data['gyro_z']})
            emg_features = extract_emg_features({
                'forearm_flexor': emg_data['forearm_flexor']['rms_envelope'],
                'core_rectus': emg_data['core_rectus']['rms_envelope']
            })

            # ═══════════════════════════════════════════════════════════════
            # 分析
            # ═══════════════════════════════════════════════════════════════

            analysis = analyze_swing(vision_features, imu_features, emg_features)

            # ═══════════════════════════════════════════════════════════════
            # 可视化
            # ═══════════════════════════════════════════════════════════════

            annotated_frame = visualize_analysis(
                frame,
                result['raw_results'],
                analysis
            )

            cv2.imshow('Golf Swing Analysis', annotated_frame)

        else:
            cv2.imshow('Golf Swing Analysis', frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == ord('s'):
            # 打印详细分析
            print("\n" + "="*60)
            print(f"评分: {analysis['score']} ({analysis['grade']})")
            print(f"总结: {analysis['summary']}")
            print("\n问题:")
            for p in analysis['problems']:
                print(f"  - {p}")
            print("\n建议:")
            for s in analysis['suggestions']:
                print(f"  - {s}")
            print("="*60 + "\n")

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
```

---

## 运行说明

### 快速测试 (使用摄像头)

```bash
python mvp_prototype.py
```

### 测试视频文件

修改 `main()` 中的视频源:

```python
cap = cv2.VideoCapture("your_golf_swing.mp4")
```

### 调整问题场景

修改 EMG Mock 参数测试不同情况:

```python
# 正常挥杆
emg_data = emg_generator.generate_swing(core_activation_level=0.6, forearm_activation_level=0.6)

# 核心不足 (常见问题)
emg_data = emg_generator.generate_swing(core_activation_level=0.3, forearm_activation_level=0.8)

# 发力过猛
emg_data = emg_generator.generate_swing(core_activation_level=0.9, forearm_activation_level=0.9)
```

---

## 下一步

1. **替换 Mock 数据**: 连接真实 IMU/EMG 硬件
2. **优化规则阈值**: 基于实际测试调整
3. **添加 Ghost 功能**: 实现理想挥杆对比
4. **移植到 Flutter**: 构建移动端 App

---

**最后更新**: 2025年12月10日
