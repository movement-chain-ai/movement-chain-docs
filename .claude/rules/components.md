---
paths: "docs/zh/components/**/*.md"
---

# Components Section Rules

## Purpose

Hardware specifications for the Movement Chain golf analyzer. Target audience: **Hardware Engineers, Electronics Design, Supply Chain**.

This section answers: "What components do we use and where can we source them?"

## Section Structure

```text
components/
├── imu/              # LSM6DSV16X inertial measurement unit
├── emg/              # ADS1299 EMG sensor
├── vision/           # OV2640 camera module
├── mcu/              # ESP32-S3 microcontroller
├── flexible-sensors/ # Flexible sensors (future)
├── pressure-sensors/ # Pressure sensors (future)
└── supply-chain/     # China suppliers, ODM/OEM, MVP sourcing
```

## Component Documentation Pattern

Each component folder follows this structure:

- **hardware.md** - Technical specifications, datasheets, pinouts
- **suppliers.md** - Vendor information, part numbers, pricing

## Content Rules

### ✅ DO Include

- Component specifications (electrical, mechanical, performance)
- Datasheet links and key parameters
- Pinout diagrams and connection requirements
- Supplier part numbers and vendor contacts
- Supply chain information (lead times, MOQ, pricing)
- Form factor and packaging details

### ❌ DO NOT Include

- Software implementation details → move to `development/`
- System integration logic → move to `design/system-design.md`
- Algorithm explanations → move to `design/research/`
- Decision rationale → link to ADRs instead

## Cross-References

- **Why this component?** → Link to ADRs in `design/decisions/`
- **How to use it?** → Link to `development/` for software integration
- **System context?** → Link to `design/system-design.md`

## Key ADRs

- ADR-0002: LSM6DSV16X IMU selection
- ADR-0005: ESP32-S3 microcontroller selection

## Maintenance Notes

- Update supplier links when vendors change
- Add new component folders using the hardware.md + suppliers.md pattern
- Keep datasheets current (check manufacturer sites quarterly)
- Supply chain info should reflect latest quotes and lead times
