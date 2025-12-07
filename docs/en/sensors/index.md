# Sensors Technology Center

Sensor technology documentation for the Movement Chain AI golf swing analysis system.

---

## Core Sensor Types

Our multi-sensor fusion architecture combines the following sensor types:

| Sensor Type | Primary Purpose | Recommended | Data Access |
|-------------|----------------|-------------|-------------|
| [IMU](imu.md) | Motion trajectory, angular velocity | LSM6DSV16X | Easy |
| [EMG](emg.md) | Muscle activation timing, force output | DFRobot SEN0240 | Medium |
| [Flexible/E-Skin](flexible-sensors.md) | Deformation, bending, pressure | Nengstar/StretchSense | Hard |
| [Pressure Sensors](pressure-sensors.md) | Foot pressure, grip force | FSR Array | Medium |
| [Vision/Camera](vision-camera.md) | Pose estimation, skeleton tracking | RTMPose-m | Easy |
| [MCU](mcu.md) | Data collection, fusion, transmission | ESP32-S3 | Easy |

---

## Our Technical Advantage

!!! success "Unique Differentiation"
    **EMG + Vision + IMU tri-modal fusion is our core competitive advantage**

    Market research shows: **ZERO competitors** offer this combination

    - SwingMotion, HackMotion, K-Motion = IMU only
    - Sportsbox AI = Vision only
    - We = EMG + Vision + IMU = **Unique**

---

## Quick Navigation

### By Sensor Type
- [IMU Inertial Measurement Unit](imu.md)
- [EMG Electromyography](emg.md)
- [Flexible Sensors](flexible-sensors.md)
- [Pressure Sensors](pressure-sensors.md)
- [Vision/Camera](vision-camera.md)
- [MCU Microcontroller](mcu.md)

### Related Resources
- [Suppliers Directory](../suppliers/index.md)
- [Competitor Analysis](../competitors/index.md)
- [Hardware Decisions](../decisions/0002-lsm6dsv16x-imu.md)

---

**Last Updated**: December 7, 2025
