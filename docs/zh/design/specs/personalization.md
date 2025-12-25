# 个性化基准规范 Personalization Specification

> **文档目的**: 定义如何根据用户特征调整生物力学基准阈值
>
> **阅读对象**: 算法工程师、产品经理
>
> **阶段规划**: Phase 1 硬编码 → Phase 2 性别/年龄 → Phase 3 体型 → Phase 4 个人学习

---

## 1. Phase 1: MVP 硬编码通用阈值

最小可行产品阶段使用固定的通用阈值，适用于所有用户：

```python
THRESHOLDS_MVP = {
    'shoulder_rotation_min': 85,  # degrees (肩部最小旋转角度)
    'hip_rotation_min': 40,       # degrees (髋部最小旋转角度)
    'x_factor_min': 35,           # degrees (X-Factor 最小值)
    'tempo_ratio_min': 2.5,       # 节奏比率最小值
    'tempo_ratio_max': 4.0,       # 节奏比率最大值
    'peak_velocity_min': 800,     # deg/s (峰值角速度)
    'core_activation_min': 50,    # percent (核心肌群最小激活)
    'forearm_activation_max': 60, # percent (前臂肌群最大激活)
}
```

**适用范围**: 适用于 18-50 岁成年男性，中等体型，无运动损伤。

**局限性**:

- 不考虑性别差异（女性柔韧性更好，力量较弱）
- 不考虑年龄影响（老年人柔韧性下降）
- 不考虑体型差异（高瘦 vs 矮壮）

---

## 2. Phase 2: 性别基础调整

研究显示男女生物力学存在显著差异：

### 2.1 性别差异数据

| 指标 Metric | 男性基准 Male | 女性调整 Female | 调整幅度 | 研究来源 |
|------------|--------------|----------------|---------|----------|
| X-Factor | 42° | 37° | -11% | Systematic Review |
| 肩部旋转 Shoulder Turn | 90° | 85.5° | -5% | Biomechanics Research |
| 髋部旋转 Hip Turn | 45° | 50° | +10% | 女性髋部柔韧性更好 |
| 峰值角速度 Peak Angular Velocity | 477°/s | 405°/s | -15% | Cheetham et al. |
| 下挥杆时长 Downswing Duration | 0.25s | 0.35s | +40% | Timing Research |

### 2.2 性别调整系数实现

```python
GENDER_ADJUSTMENTS = {
    'male': {
        'x_factor_multiplier': 1.0,
        'velocity_multiplier': 1.0,
        'timing_multiplier': 1.0,
    },
    'female': {
        'x_factor_multiplier': 0.89,  # -11%
        'velocity_multiplier': 0.85,  # -15%
        'timing_multiplier': 1.40,    # +40% (更慢的下挥杆是正常的)
    }
}
```

**数据来源**:

- 手动输入（用户注册时选择性别）
- 或视觉估计（基于体型特征，准确率较低）

---

## 3. Phase 3: 体型比例调整（视觉采集）

利用 Vision (MediaPipe) 从站姿中提取体型比例，用于调整阈值。

### 3.1 体型比例提取算法

```python
def extract_body_proportions(landmarks):
    """从站立姿态中提取关键体型比例"""
    # MediaPipe Pose 关键点索引
    LEFT_SHOULDER, RIGHT_SHOULDER = 11, 12
    LEFT_HIP, RIGHT_HIP = 23, 24
    LEFT_ANKLE, RIGHT_ANKLE = 27, 28
    NOSE = 0

    # 计算身体中心点
    shoulder_center = (landmarks[LEFT_SHOULDER] + landmarks[RIGHT_SHOULDER]) / 2
    hip_center = (landmarks[LEFT_HIP] + landmarks[RIGHT_HIP]) / 2
    ankle_center = (landmarks[LEFT_ANKLE] + landmarks[RIGHT_ANKLE]) / 2

    # 计算关键长度
    torso_length = np.linalg.norm(shoulder_center - hip_center)
    leg_length = np.linalg.norm(hip_center - ankle_center)
    arm_span = np.linalg.norm(landmarks[LEFT_SHOULDER] - landmarks[RIGHT_SHOULDER])
    estimated_height = np.linalg.norm(landmarks[NOSE] - ankle_center)

    return {
        'estimated_height_m': estimated_height,
        'torso_to_leg_ratio': torso_length / leg_length,
        'arm_span_to_height_ratio': arm_span / estimated_height,
        'shoulder_width_m': arm_span,
    }
```

### 3.2 体型分类与调整

```python
BODY_TYPE_ADJUSTMENTS = {
    'tall_slim': {  # 长手长腿，躯干短 (比率 < 0.50)
        'x_factor_multiplier': 0.95,  # 长躯干更容易旋转
        'velocity_multiplier': 1.05,  # 更长的手臂 = 更高速度
    },
    'short_stocky': {  # 短手短腿，躯干长 (比率 > 0.60)
        'x_factor_multiplier': 1.05,  # 短躯干旋转难度更大
        'velocity_multiplier': 0.95,  # 手臂较短，速度较低
    },
    'average': {  # 比率 0.50-0.60
        'x_factor_multiplier': 1.0,
        'velocity_multiplier': 1.0,
    }
}
```

**数据采集流程**:

1. 用户首次使用时，引导完成"校准站姿"（双脚并拢，双臂自然下垂）
2. 摄像头采集 30 帧站姿数据，取中位数
3. 提取体型比例，保存至用户档案
4. 后续无需重复校准（除非用户体型显著变化）

---

## 4. Phase 4: 年龄基础调整

随着年龄增长，柔韧性和爆发力会下降：

### 4.1 年龄调整系数

| 年龄组 Age Group | 柔韧性调整 | 速度调整 | 备注 Notes |
|-----------------|-----------|---------|-----------|
| 18-35 | 1.0x | 1.0x | 运动表现峰值期 |
| 36-50 | 0.95x | 0.95x | 轻微下降 |
| 51-65 | 0.85x | 0.85x | 重点转向技术而非力量 |
| 65+ | 0.75x | 0.75x | 优先防止运动损伤 |

### 4.2 实现代码

```python
def get_age_adjustment(age: int) -> dict:
    """根据年龄返回调整系数"""
    if age < 36:
        return {'flexibility': 1.0, 'velocity': 1.0}
    elif age < 51:
        return {'flexibility': 0.95, 'velocity': 0.95}
    elif age < 66:
        return {'flexibility': 0.85, 'velocity': 0.85}
    else:
        return {'flexibility': 0.75, 'velocity': 0.75}
```

**数据来源**: 用户注册时输入出生日期。

---

## 5. Phase 5: 个性化学习（机器学习）

在收集足够用户数据后，学习用户的个人基线和改进轨迹。

### 5.1 个性化阈值类

```python
class PersonalizedThresholds:
    """学习用户的个人基线和改进轨迹"""

    def __init__(self, user_id):
        self.user_id = user_id
        self.swing_history = []
        self.personal_best = None

    def update_from_swing(self, swing_data, score):
        """每次挥杆后更新历史记录"""
        self.swing_history.append({
            'data': swing_data,
            'score': score,
            'timestamp': time.now()
        })
        if not self.personal_best or score > self.personal_best['score']:
            self.personal_best = self.swing_history[-1]

    def get_personal_thresholds(self):
        """基于用户历史生成个性化阈值"""
        if len(self.swing_history) < 10:
            return None  # 数据不足，使用通用阈值

        recent = self.swing_history[-20:]  # 最近 20 次挥杆
        return {
            'x_factor_target': np.mean([s['data']['x_factor'] for s in recent]) * 1.10,
            'x_factor_min': np.mean([s['data']['x_factor'] for s in recent]),
            'x_factor_best': self.personal_best['data']['x_factor'],
        }
```

### 5.2 渐进式目标设定

```python
def get_progressive_targets(user_thresholds):
    """为用户设定渐进式改进目标"""
    return {
        'current_level': user_thresholds['x_factor_min'],
        'next_milestone': user_thresholds['x_factor_min'] * 1.05,  # +5%
        'ultimate_goal': user_thresholds['x_factor_best'] * 1.10,  # 个人最佳 +10%
    }
```

**数据要求**: 至少 10 次有效挥杆记录。

---

## 6. 综合阈值计算器

将所有调整因子组合：

```python
def get_personalized_thresholds(user_profile):
    """综合所有调整因子，返回个性化阈值"""
    base = THRESHOLDS_MVP.copy()

    # 1. 性别调整
    gender_adj = GENDER_ADJUSTMENTS.get(user_profile.get('gender', 'male'))

    # 2. 年龄调整
    age = user_profile.get('age', 30)
    age_adj = get_age_adjustment(age)

    # 3. 体型调整
    body_type = user_profile.get('body_type', 'average')
    body_adj = BODY_TYPE_ADJUSTMENTS.get(body_type, BODY_TYPE_ADJUSTMENTS['average'])

    # 4. 综合计算
    return {
        'x_factor_min': base['x_factor_min']
                       * gender_adj['x_factor_multiplier']
                       * body_adj['x_factor_multiplier']
                       * age_adj['flexibility'],
        'peak_velocity_min': base['peak_velocity_min']
                            * gender_adj['velocity_multiplier']
                            * body_adj['velocity_multiplier']
                            * age_adj['velocity'],
        # ... 其他阈值
    }
```

### 6.1 示例计算

假设用户档案：

- 性别: 女性
- 年龄: 55 岁
- 体型: tall_slim
- 历史挥杆: 不足 10 次

计算结果：

```python
x_factor_min = 35 * 0.89 * 0.95 * 0.85 = 25.2°
peak_velocity_min = 800 * 0.85 * 1.05 * 0.85 = 606 deg/s
```

---

## 7. 实施路线图

| 阶段 Phase | 内容 Content | 数据要求 Data Requirement | 时间线 Timeline |
|-----------|-------------|-------------------------|----------------|
| 1 | 通用硬编码阈值 | 无 | MVP |
| 2 | 性别选择 | 用户输入 | Phase 2 |
| 3 | 体型比例采集 | 摄像头校准姿态 | Phase 2-3 |
| 4 | 年龄基础调整 | 用户输入 | Phase 2 |
| 5 | 个性化学习 | 10+ 次有效挥杆 | Phase 3+ |

### 7.1 降级策略 (Fallback Strategy)

```python
def get_thresholds(user_profile):
    """按优先级返回阈值，支持降级"""
    # 优先级 1: 个性化学习阈值
    personal = PersonalizedThresholds(user_profile['id'])
    if personal.has_enough_data():
        return personal.get_personal_thresholds()

    # 优先级 2: 性别+年龄+体型调整
    if 'gender' in user_profile and 'age' in user_profile:
        return get_personalized_thresholds(user_profile)

    # 优先级 3: 仅性别调整
    if 'gender' in user_profile:
        return apply_gender_adjustment(THRESHOLDS_MVP, user_profile['gender'])

    # 优先级 4: 通用阈值
    return THRESHOLDS_MVP
```

---

## 8. 相关文档

- [系统设计](../architecture/system-design.md) - MVP 核心管道总览
- [ML 基础入门](../../prerequisites/ml-basics.md) - 机器学习基础概念
- [移动开发](../../development/mobile/development.md) - Flutter 开发与测试指南

**待创建文档**（Phase 2 后补充）:

- `biomechanics-benchmarks.md` - 详细的生物力学基准数据库
- `sensor-metric-mapping.md` - 传感器数据到生物力学指标的映射

---

## 9. 研究引用

### 性别差异研究

- Zheng, N., Barrentine, S. W., Fleisig, G. S., & Andrews, J. R. (2008). "Kinematic analysis of swing in pro and amateur golfers." International Journal of Sports Medicine.
- Cheetham, P. J., Martin, P. E., Mottram, R. E., & St Laurent, B. F. (2001). "The importance of stretching the 'X-Factor' in the downswing of golf: The 'X-Factor stretch'." Optimising Performance in Golf, 192-199.

### 年龄影响研究

- Wells, G. D., Elmi, M., & Thomas, S. (2009). "Physiological correlates of golf performance." Journal of Strength and Conditioning Research, 23(3), 741-750.

### 体型影响研究

- Sell, T. C., Tsai, Y. S., Smoliga, J. M., Myers, J. B., & Lephart, S. M. (2007). "Strength, flexibility, and balance characteristics of highly proficient golfers." Journal of Strength and Conditioning Research, 21(4), 1166-1171.

---

**最后更新**: 2025-12-17
**维护者**: Movement Chain AI Team
