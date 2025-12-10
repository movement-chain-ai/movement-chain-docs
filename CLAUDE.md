# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Movement Chain AI documentation site - MkDocs Material site for a golf swing analyzer project combining IMU sensors, EMG, and computer vision.

**Multi-repo structure** (see ADR-0001): This is the docs repo. Related repos: `movement-chain-firmware` (ESP32), `movement-chain-ml` (Python), `movement-chain-mobile` (Flutter), `movement-chain-hardware` (KiCad).

## Commands

```bash
# Serve documentation locally (Chinese default at :8000)
mkdocs serve

# Build with strict mode (catches broken links/refs)
mkdocs build --strict

# Lint markdown files
npm run lint:md

# Check links in documentation
npm run lint:links

# Test build (strict mode, used by pre-push hook)
# IMPORTANT: Run this before pushing to catch broken links
npm run test:build
```

## Git Hooks

The repository uses husky with strict commit standards:

- **pre-commit**: Runs `lint-staged` (markdownlint + markdown-link-check on staged .md files)
- **commit-msg**: Enforces Conventional Commits format
- **pre-push**: Runs `mkdocs build --strict` and full link check

**Commit format**: `<type>(<scope>): <subject>`
Types: `docs`, `feat`, `fix`, `chore`, `style`, `refactor`, `test`, `ci`, `perf`, `revert`

**Bypassing hooks** (use sparingly):

- `git commit --no-verify` - skip pre-commit/commit-msg
- `git push --no-verify` - skip pre-push

## Documentation Structure

```text
docs/zh/                    # Chinese (default locale)
├── product/                # Product strategy, MVP spec, roadmap
├── design/                 # System design, ADRs in decisions/
├── components/             # Hardware specs (IMU, EMG, Vision, MCU)
├── platform/               # Mobile dev, ML training
├── research/               # Market research, competitor analysis
│   ├── competitors/        # IMU/Vision/Multi-sensor competitor analysis
│   └── suppliers-china/    # Chinese supplier research
└── archive/                # Historical/raw research materials
```

## i18n Configuration

- Uses `mkdocs-i18n` plugin with folder structure
- Chinese (`zh`) is the only locale - all content lives in `docs/zh/`
- No English (`docs/en/`) content exists; intentionally Chinese-only for now
- Navigation translations defined in `mkdocs.yml` for future use

## Markdown Requirements

- Code blocks require language specifier (MD040): use ` ```text ` for ASCII diagrams
- Blank line required before/after fenced code blocks (MD031)
- Blank line required around lists in blockquotes (MD032)
- No trailing spaces (MD009)
- HTML is allowed (MD033 disabled)
- Line length unlimited (MD013 disabled)

## Key Technical Decisions (ADRs)

Located in `docs/zh/design/decisions/`:

- **ADR-0002**: LSM6DSV16X IMU (45+ min drift stability)
- **ADR-0003**: Flutter for cross-platform mobile
- **ADR-0004**: 4-module architecture (Assessment → Diagnosis → Correction → Tracking)
- **ADR-0005**: ESP32-S3 microcontroller
- **ADR-0006**: ONNX Runtime for on-device ML

## Known Issues

- ST.com documentation links (datasheets, MEMS Studio) return Status 0 in automated link checks but are valid - they block automated requests
- Some pre-existing research files in `archive/` and `suppliers-china/` have dead external links; use `--no-verify` when pushing if unrelated to your changes
