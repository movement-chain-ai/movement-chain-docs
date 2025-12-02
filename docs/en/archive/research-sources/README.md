# Archived Research Sources

**Archive Date**: December 1, 2025
**Reason**: Documentation reorganization from source-based to topic-based structure

---

## What Happened

These research documents were **consolidated into topic-based comprehensive guides** located in `docs/guides/`.

### Problem with Old Structure
The original research documents were organized by **source type** (research vs commercial vs tools), which caused information fragmentation:
- Working on **pose estimation**? Had to read 7 different documents
- Working on **visual feedback**? Had to read 5 different documents
- Working on **sensors**? Had to read 6 different documents

### New Structure
All information has been reorganized into **topic-based guides** where each guide consolidates ALL related resources (research + commercial + tools + datasets + implementation) for a specific area.

---

## Where to Find Information Now

### Instead of reading scattered research docs, use these consolidated guides:

| Old Research Documents | New Consolidated Guide | Location |
|------------------------|------------------------|----------|
| pose-estimation-tools-2025.md<br>visual-feedback-apis-sdks.md (APIs)<br>commercial-fitness-tech.md (vision)<br>movement-feedback-commercial-research.md (CV)<br>academic-research-datasets.md (datasets)<br>ml-frameworks-comparison.md | **Pose Estimation Guide** | `docs/guides/pose-estimation.md` |
| visual-feedback-research-summary.md<br>movement-correction-feedback-ui-ux-guidelines.md<br>visual-feedback-apis-sdks.md (rendering)<br>commercial-fitness-tech.md (UX)<br>movement-feedback-commercial-research.md (feedback) | **Visual Feedback Design Guide** | `docs/guides/visual-feedback-design.md` |
| hardware-comparison.md<br>academic-research-datasets.md (sensor data)<br>commercial-fitness-tech.md (sensors)<br>project-unique-value.md (EMG)<br>ADR-0002 (IMU)<br>ADR-0005 (MCU) | **Sensor Hardware Guide** | `docs/guides/sensor-hardware.md` |
| mobile-frameworks-comparison.md<br>movement-correction-feedback-ui-ux-guidelines.md (mobile)<br>visual-feedback-apis-sdks.md (mobile SDKs)<br>pose-estimation-tools-2025.md (mobile)<br>ADR-0003 (Flutter) | **Mobile Development Guide** | `docs/guides/mobile-development.md` |
| academic-research-datasets.md<br>pose-estimation-tools-2025.md (benchmarks)<br>commercial-fitness-tech.md (performance) | **Datasets & Benchmarking Guide** | `docs/guides/datasets-benchmarking.md` |
| project-unique-value.md<br>commercial-fitness-tech.md<br>movement-feedback-commercial-research.md | **Competitive Analysis Guide** | `docs/guides/competitive-analysis.md` |

---

## New Guide Structure

📂 **docs/guides/** (Start here!)
- 🤖 **pose-estimation.md** (36KB) - Everything about pose estimation & CV
- 🎨 **visual-feedback-design.md** (72KB) - Research-backed design patterns
- 🔧 **sensor-hardware.md** (59KB) - IMU + EMG + ESP32 architecture
- 📱 **mobile-development.md** (36KB) - Flutter + MediaPipe + BLE
- 📊 **datasets-benchmarking.md** (39KB) - Fit3D, MM-Fit, benchmarks
- 🏆 **competitive-analysis.md** (50KB) - Market strategy & positioning
- 📋 **index.md** - Navigation and reading paths by role

**Total**: 292KB of consolidated, topic-based documentation

---

## Benefits of New Structure

### For Developers
✅ **Single document** per topic - no hunting across 5-7 files
✅ **Complete context** - research + commercial + tools in one place
✅ **Quick reference** - comparison tables still in resources/

### For Researchers
✅ **Research evidence** + **implementation guide** together
✅ **Clear path** from academic papers to code examples

### For New Team Members
✅ **Onboarding path**: Read 6 guides = complete picture
✅ **No confusion** about where to find information

---

## These Files Are Archived, Not Deleted

**Why keep them?**
- Historical reference
- Original source attribution
- Version history
- Academic citations

**Do NOT edit these files.** They are frozen as of December 1, 2025.

**For updates**: Edit the corresponding guide in `docs/guides/` instead.

---

## File Manifest

### Research Documents (Archived)
1. **academic-research-datasets.md** (11KB)
   - Now in: `datasets-benchmarking.md` + `sensor-hardware.md`

2. **commercial-fitness-tech.md** (17KB)
   - Now in: `competitive-analysis.md` + all guides

3. **movement-correction-feedback-ui-ux-guidelines.md** (35KB)
   - Now in: `visual-feedback-design.md` + `mobile-development.md`

4. **movement-feedback-commercial-research.md** (44KB)
   - Now in: `competitive-analysis.md` + `visual-feedback-design.md`

5. **pose-estimation-tools-2025.md** (21KB)
   - Now in: `pose-estimation.md` + `mobile-development.md`

6. **project-unique-value.md** (23KB)
   - Now in: `competitive-analysis.md` + `sensor-hardware.md`

7. **visual-feedback-apis-sdks.md** (54KB)
   - Now in: `visual-feedback-design.md` + `pose-estimation.md`

8. **visual-feedback-research-summary.md** (29KB)
   - Now in: `visual-feedback-design.md`

9. **index.md** (12KB)
   - Replaced by: `docs/guides/index.md` (comprehensive navigation)

**Total archived**: 232KB of original research

---

## Migration Timeline

| Date | Action |
|------|--------|
| Nov 28-30, 2025 | Original research documents created |
| Dec 1, 2025 | Reorganization plan approved |
| Dec 1, 2025 | 6 consolidated guides created (292KB) |
| Dec 1, 2025 | Research documents archived here |

---

## Questions?

**Need historical context?** These archived files are available for reference.

**Need current information?** Use the guides in `docs/guides/`

**Contributing updates?** Edit the relevant guide, not these archived files.

---

**See**: [Consolidated Guides](../../guides/index.md) | [Main Documentation](../../index.md)

**Last Updated**: December 1, 2025
**Archived by**: Movement Chain AI Documentation Team
