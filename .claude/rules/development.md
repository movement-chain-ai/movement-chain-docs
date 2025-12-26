---
paths: "docs/zh/development/**/*.md"
---

# Development Section Rules

## Purpose

The `docs/zh/development/` section focuses on **HOW to implement** the Movement Chain AI platform. It provides implementation guides for software engineers, ML engineers, and mobile developers.

## Target Audience

- **Software Engineers**: Implementing Swift iOS mobile app
- **ML Engineers**: Training models, dataset preparation
- **Mobile Developers**: iOS native development, UI/UX

## Tech Stack Covered

- **Mobile**: Swift iOS native (ADR-0007)
- **ML Framework**: PyTorch (training), TFLite via MediaPipe (on-device inference)
- **Languages**: Swift (iOS), Python (ML training)
- **Visualization**: Skeleton overlays, visual feedback UI

## Content Guidelines

### What Belongs Here

- Implementation guides and tutorials
- Development environment setup
- Code architecture patterns (not raw code dumps)
- Integration instructions (ML model → mobile app)
- Dataset preparation workflows
- Visual feedback UI design patterns
- Testing strategies

### What Does NOT Belong Here

- Raw prototype code (belongs in `movement-chain-ml` repo)
- System architecture (see `design/system-design.md`)
- Hardware specifications (see `components/`)
- Business requirements (see `business-plan/`)

## Cross-References

- **Architecture Context**: `design/system-design.md` - Core MVP pipeline
- **Key Decisions**:
  - `design/decisions/ADR-0007.md` - Swift iOS native选择
- **Getting Started**: `design/getting-started.md` - Test without hardware

## File Organization

```text
development/
├── index.md                          # Development overview
├── mobile/
│   └── development.md                # Flutter implementation guide
└── ml-training/
    ├── datasets.md                   # GolfDB, OpenPose datasets
    └── visual-feedback.md            # Skeleton overlay, feedback UI
```

## Markdown Standards

- Use code blocks with language specifiers (Dart for Flutter, Python for ML)
- Link to external repos using relative paths in `reference/`
- Cross-link to `design/` for architectural context
- Use admonitions for important setup notes

## Common Tasks

- Adding new ML training guides → `ml-training/`
- Adding mobile dev workflows → `mobile/`
- Document integration patterns with clear examples
- Keep code snippets focused (10-20 lines max)
