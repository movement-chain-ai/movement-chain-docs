# Movement Chain AI - System Documentation

Comprehensive architecture documentation for the Movement Chain AI multimodal movement training system.

## Overview

Movement Chain AI is an intelligent movement analysis system that combines wearable IMU sensors with multimodal AI to provide real-time feedback for golf swings and workout movements. This repository contains the complete system architecture documentation, including high-level design, architectural decision records (ADRs), and technical resources.

## System Architecture

The system follows a 4-module architecture:

- **Wearable Device Module**: ESP32-S3 based IMU sensor (LSM6DSV16X) for motion capture
- **Mobile Application Module**: Flutter-based cross-platform app for user interaction
- **Cloud Backend Module**: AWS serverless infrastructure for data processing and ML training
- **ML/AI Module**: ONNX Runtime-based inference engine for on-device movement analysis

## Project Repositories

The Movement Chain AI project is organized into multiple specialized repositories:

1. **[system-documentation](https://github.com/movement-chain-ai/system-documentation)** - Architecture documentation, high-level design (HLD), and architectural decision records (ADRs) _(this repository)_
2. **[movement-chain-firmware](https://github.com/movement-chain-ai/movement-chain-firmware)** - ESP32-S3 embedded firmware for wearable IMU sensor device
3. **[movement-chain-ml](https://github.com/movement-chain-ai/movement-chain-ml)** - Machine learning models, training pipelines, and ONNX model conversion
4. **[movement-chain-hardware](https://github.com/movement-chain-ai/movement-chain-hardware)** - PCB designs, schematics, and hardware specifications
5. **[movement-chain-mobile](https://github.com/movement-chain-ai/movement-chain-mobile)** - Flutter-based cross-platform mobile application

See [ADR-0001: Multi-Repository Structure](https://movement-chain-ai.github.io/system-documentation/decisions/0001-multi-repo-structure/) for the rationale behind this organizational approach.

## Quick Start

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Building the Documentation Locally

1. Install MkDocs Material theme:
   ```bash
   pip install mkdocs-material mkdocs-mermaid2-plugin
   ```

2. Clone this repository:
   ```bash
   git clone https://github.com/movement-chain-ai/system-documentation.git
   cd system-documentation
   ```

3. Serve the documentation locally:
   ```bash
   mkdocs serve
   ```

4. Open your browser to `http://127.0.0.1:8000`

### Building Static Site

```bash
mkdocs build
```

The static site will be generated in the `site/` directory.

## Repository Structure

```
movement-chain-ai-docs/
├── README.md                     # This file
├── mkdocs.yml                    # MkDocs configuration
├── docs/                         # Documentation source files
│   ├── index.md                  # Landing page
│   ├── architecture/             # Architecture documentation
│   │   └── hld/                  # High-Level Design documents
│   │       ├── 01-system-overview.md
│   │       ├── 02-data-flow.md
│   │       ├── 03-integration-patterns.md
│   │       └── 04-performance-targets.md
│   ├── decisions/                # Architectural Decision Records
│   │   ├── 0001-multi-repo-structure.md
│   │   ├── 0002-lsm6dsv16x-imu.md
│   │   ├── 0003-flutter-mobile.md
│   │   ├── 0004-simplified-4-module-architecture.md
│   │   ├── 0005-esp32-s3-microcontroller.md
│   │   └── 0006-onnx-runtime-deployment.md
│   └── resources/                # Technical comparison resources
│       ├── hardware-comparison.md
│       ├── ml-frameworks-comparison.md
│       └── mobile-frameworks-comparison.md
└── site/                         # Generated static site (not tracked in git)
```

## Documentation Sections

### Architecture Documentation

High-level design documents covering:
- System architecture and component interactions
- Data flow and processing pipelines
- Integration patterns between modules
- Performance targets and scalability considerations

### Architectural Decision Records (ADRs)

Chronological record of key architectural decisions including:
- Multi-repository structure rationale
- Hardware selection (ESP32-S3, LSM6DSV16X)
- Framework choices (Flutter, ONNX Runtime)
- Architecture simplification to 4-module design

### Resources

Comparative analysis and research:
- Hardware platform comparisons
- ML framework evaluations
- Mobile development framework assessments

## GitHub Pages Deployment

The documentation is automatically deployed to GitHub Pages at:

**https://movement-chain-ai.github.io/system-documentation/** (once deployed)

The deployment is triggered automatically on every push to the `main` branch using GitHub Actions.

## Contributing

We welcome contributions to improve the documentation. Please follow these guidelines:

### Documentation Style Guide

- Use clear, concise language
- Include diagrams (Mermaid format preferred) for complex concepts
- Follow the existing document structure and formatting
- Add relevant code examples where applicable
- Keep ADRs immutable - create new ADRs instead of modifying existing ones

### Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improve-docs`)
3. Make your changes
4. Test locally using `mkdocs serve`
5. Commit your changes with descriptive messages
6. Push to your fork and submit a pull request

### ADR Guidelines

When adding new ADRs:
- Use the next sequential number (e.g., ADR-0007)
- Follow the standard ADR template
- Include context, decision, consequences, and alternatives
- Link to related ADRs where applicable

## License

MIT License (or TBD - to be finalized with legal review)

## Contact

For questions or feedback about this documentation:
- Create an issue in this repository
- Contact the Movement Chain AI team

## Additional Resources

- [Movement Chain AI Main Repository](https://github.com/movement-chain-ai) (placeholder)
- [API Documentation](https://api.movement-chain-ai.com) (placeholder)
- [Development Guidelines](https://github.com/movement-chain-ai/development-guidelines) (placeholder)

---

**Note**: This is a living document. As the system evolves, this documentation will be updated to reflect current architecture and decisions.
