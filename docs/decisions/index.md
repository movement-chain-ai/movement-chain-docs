# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) documenting key technical decisions made during the Movement Chain AI project development.

## What are ADRs?

Architecture Decision Records capture important architectural decisions along with their context and consequences. Each ADR describes:

- **Context**: The situation that requires a decision
- **Decision**: The change or choice being proposed
- **Status**: Whether the decision is proposed, accepted, deprecated, or superseded
- **Consequences**: The resulting context after applying the decision

## Current Decisions

### System Architecture

- [ADR-0001: Multi-Repository Structure](0001-multi-repo-structure.md) - Organizational structure for the codebase
- [ADR-0004: Simplified 4-Module Architecture](0004-simplified-4-module-architecture.md) - Core system design with Assessment → Diagnosis → Correction → Tracking modules

### Hardware Stack

- [ADR-0002: LSM6DSV16X IMU Selection](0002-lsm6dsv16x-imu.md) - Motion sensor choice replacing discontinued BNO055
- [ADR-0005: ESP32-S3 Microcontroller](0005-esp32-s3-microcontroller.md) - MCU platform for embedded firmware

### Software Stack

- [ADR-0003: Flutter Mobile Framework](0003-flutter-mobile.md) - Cross-platform mobile development framework
- [ADR-0006: ONNX Runtime for ML Deployment](0006-onnx-runtime-deployment.md) - Machine learning inference runtime

## Decision Status Legend

- ✅ **Accepted**: Decision is approved and being implemented
- 🔄 **Proposed**: Decision is under review
- ⚠️ **Deprecated**: Decision is no longer recommended
- ❌ **Superseded**: Decision has been replaced by another ADR

## Contributing

When making significant architectural decisions:

1. Create a new ADR using the next sequential number (e.g., `0007-decision-title.md`)
2. Follow the ADR template structure
3. Link to related ADRs if applicable
4. Update this index page with the new decision
