# ADR 0001: Multi-Repository Structure

**Date:** 2025-12-01
**Status:** Accepted

## Context

The Movement Chain AI system comprises multiple distinct technical domains: embedded firmware for ESP32-C6 devices, Python-based machine learning models, Flutter mobile applications, hardware design files, and documentation. We needed to decide between a monorepo approach (single repository with multiple workspaces) versus a multi-repo approach (separate repositories for each major component).

Key factors influencing this decision:
- Different build systems and toolchains (PlatformIO for firmware, Python/Poetry for ML, Flutter for mobile)
- Distinct release cycles (firmware may update independently of mobile app)
- Student team collaboration with varying expertise areas
- CI/CD complexity for heterogeneous codebases
- Dependency management across different ecosystems

## Decision

We will adopt a **multi-repository structure** with the following repositories:

1. `movement-chain-firmware` - ESP32-C6 embedded firmware (PlatformIO/C++)
2. `movement-chain-ml` - Machine learning models and training pipelines (Python)
3. `movement-chain-mobile` - Flutter mobile application (Dart/Flutter)
4. `movement-chain-hardware` - Hardware schematics, PCB designs, BOM (KiCad)
5. `movement-chain-ai-docs` - Architecture documentation, ADRs, research notes

## Rationale

### Independent Build Systems
Each component requires fundamentally different build tooling:
- Firmware: PlatformIO with ESP-IDF dependencies
- ML: Python 3.10+, TensorFlow Lite, scikit-learn
- Mobile: Flutter SDK, Dart packages
- Hardware: KiCad, manufacturing files

Unifying these in a monorepo would require complex workspace configuration and create confusion about which tools to use in which directory.

### Independent Release Cycles
- Firmware updates can be deployed via OTA without mobile app changes
- ML model updates may require firmware changes but not mobile UI updates
- Mobile app releases follow app store approval cycles independent of firmware
- Hardware revisions have long lead times unrelated to software cycles

### Team Collaboration Benefits
- Students can focus on their domain without navigating unrelated code
- Repository permissions can be scoped to expertise areas
- Smaller repository sizes reduce clone time and cognitive overhead
- Clear ownership boundaries for each subsystem

### CI/CD Simplicity
- Each repository has a focused CI pipeline (e.g., PlatformIO tests vs Flutter tests)
- Deployment artifacts are scoped to single domains
- Build failures don't block unrelated components
- GitHub Actions workflows remain simple and maintainable

## Consequences

### Positive
- **Clear separation of concerns** - Each repository has a single, well-defined purpose
- **Independent versioning** - Semantic versioning can be applied per component (firmware v1.2.0, mobile v2.0.1)
- **Faster CI/CD** - Pipeline runs only test relevant changes, not entire codebase
- **Easier onboarding** - New contributors clone only the repository they need
- **Tooling independence** - Each repo uses best-in-class tools for its domain without compromise
- **Parallel development** - Teams can work on different components without Git conflicts

### Negative
- **Cross-repository coordination overhead** - Breaking changes in firmware API require coordinated updates in mobile repo
  - *Mitigation:* Maintain API compatibility contracts, use feature flags for gradual rollouts
- **Dependency version mismatches** - ML model format changes require firmware and mobile updates
  - *Mitigation:* Version all data formats (TFLite models, BLE message schemas), maintain backward compatibility
- **More repositories to manage** - 5 repositories vs 1 increases administrative overhead
  - *Mitigation:* Use consistent repository templates, shared GitHub Actions workflows, unified documentation in `movement-chain-ai-docs`
- **Code duplication risk** - Shared utilities (e.g., data parsing) might be duplicated
  - *Mitigation:* Create shared libraries where necessary (e.g., `movement-chain-protocol` for BLE message definitions)

## Alternatives Considered

### Option A: Monorepo with Workspaces
**Description:** Single repository with top-level directories (`firmware/`, `ml/`, `mobile/`, etc.) managed by a monorepo tool like Nx or Turborepo.

**Rejected because:**
- Adds complexity layer (monorepo tooling) on top of already complex build systems
- PlatformIO, Flutter, and Python have different workspace expectations
- CI/CD would run all checks on every commit, slowing down development
- Repository size would grow rapidly with hardware binaries and ML datasets
- Student contributors would need to learn monorepo tooling in addition to domain tools

### Option B: Single Repository with Submodules
**Description:** Main repository with Git submodules pointing to separate component repositories.

**Rejected because:**
- Combines worst of both approaches: coordination overhead + submodule complexity
- Git submodules are notoriously difficult for beginners to manage
- Requires understanding of both parent and child repository workflows
- Detached HEAD states and forgotten submodule updates create confusion
- No significant benefit over direct multi-repo approach

### Option C: Microrepo per Feature
**Description:** Even more granular split (e.g., `gyroscope-driver`, `swing-detection-model`, `profile-screen-ui`).

**Rejected because:**
- Over-engineering for a student project with 3-4 active contributors
- Feature dependencies would require constant cross-repo coordination
- Would create 15+ repositories, overwhelming to navigate
- Integration testing becomes extremely difficult
- Only makes sense at large organization scale (100+ developers)

## References

- **PlatformIO Documentation** - https://docs.platformio.org/ (firmware build system)
- **Flutter Architecture** - https://docs.flutter.dev/resources/architectural-overview (mobile development)
- **TensorFlow Lite for Microcontrollers** - https://www.tensorflow.org/lite/microcontrollers (ML deployment)
- **Monorepo vs Multi-repo Analysis** - https://github.com/joelparkerhenderson/monorepo-vs-polyrepo
- **Student Project Best Practices** - IEEE Software Engineering Education (2024)
