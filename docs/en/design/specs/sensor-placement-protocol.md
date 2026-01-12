# Sensor Placement Protocol for Kinetic Chain Validation

> Research-based protocol for validating golf swing biomechanics

## Overview

This protocol uses **3 IMUs + 3 EMG sensors** to validate the biomechanical kinetic chain in the golf swing.

All placement decisions are based on peer-reviewed academic research.

---

## Sensor Configuration Summary

### Right-handed Golfer

| Sensor | Location | Side | Validation Target | Academic Source |
|--------|----------|:----:|-------------------|-----------------|
| **IMU-1** | L4 vertebra | Center | Pelvic rotation (chain origin) | Stanford 2023, ICC=0.91-1.00 |
| **IMU-2** | T1 vertebra | Center | Thorax rotation (chain middle) | Stanford 2023, ICC=1.00 |
| **IMU-3** | Hand dorsum | **Right** | Hand velocity (chain endpoint) | Nature 2024 |
| **EMG-1** | Erector Spinae | **Right** | Trunk activation (83-106% MVC) | EMG Literature Review |
| **EMG-2** | Flexor Carpi Radialis | **Right forearm** | Forearm activation (>100% MVC) | MDPI 2016 |
| **EMG-3** | Gluteus Maximus | **Right** | Hip power initiation | Research Driven Golf |

### Left-handed Golfer

| Sensor | Location | Side | Validation Target |
|--------|----------|:----:|-------------------|
| **IMU-1** | L4 vertebra | Center | Pelvic rotation |
| **IMU-2** | T1 vertebra | Center | Thorax rotation |
| **IMU-3** | Hand dorsum | **Left** | Hand velocity |
| **EMG-1** | Erector Spinae | **Left** | Trunk activation |
| **EMG-2** | Flexor Carpi Radialis | **Left forearm** | Forearm activation |
| **EMG-3** | Gluteus Maximus | **Left** | Hip power initiation |

---

## Trail vs Lead Side Explained

```text
Right-handed golfer stance (facing target):

        Target direction →

    ┌─────────────────────┐
    │                     │
    │   Left      Right   │
    │   foot      foot    │
    │   LEAD      TRAIL   │
    │   (front)   (back)  │
    │                     │
    └─────────────────────┘

Trail side = Side farther from target = Power initiation side
Lead side = Side closer to target = Power receiving side
```

**Why Trail side for EMG?**

- Research shows Trail leg gluteus maximus activation is significantly correlated with handicap
- Lower handicap golfers show significantly higher Trail side glute activation
- Kinetic chain initiates from Trail hip, transfers to Lead side

---

## Kinetic Chain Validation Targets

### Correct Kinetic Chain Sequence

```text
Proximal → Distal

Pelvis → Thorax → Arms → Club
  ↓        ↓        ↓       ↓
477°/s   552°/s   1200°/s  2500°/s
(1st)    (2nd)    (3rd)    (last)
```

### IMU Validation Criteria

| Metric | Correct Pattern | Incorrect Pattern |
|--------|-----------------|-------------------|
| Peak velocity order | Pelvis → Thorax → Hand | Reversed sequence |
| Pelvis-Thorax timing gap | 20-50ms | <10ms or >100ms |
| X-Factor at top | 35-55° | <25° |

### EMG Validation Criteria

| Metric | Correct Pattern | Incorrect Pattern |
|--------|-----------------|-------------------|
| Activation order | Glutes → Erector Spinae → FCR | FCR activates first ("arm swing") |
| Glute-to-FCR timing | Glutes lead by 30-60ms | Simultaneous or reversed |
| Signal quality | Activation RMS > 3× baseline | Weak or noisy signal |

---

## Anatomical Placement Details

### IMU Attachment Locations

```text
Posterior View (Back)
┌───────────────────────────────┐
│                               │
│         ┌─────┐               │
│         │ T1  │ ← Base of neck│
│         │ IMU │   (C7/T1      │
│         └─────┘    junction)  │
│                               │
│            │                  │
│            │  Spine           │
│            │                  │
│         ┌─────┐               │
│         │ L4  │ ← Belt line   │
│         │ IMU │   (above      │
│         └─────┘    sacrum)    │
│                               │
└───────────────────────────────┘

Hand Dorsum View
┌───────────────────────────────┐
│                               │
│      ┌─────────────┐          │
│      │   Hand IMU  │          │
│      │  (center of │          │
│      │   dorsum)   │          │
│      └─────────────┘          │
│           │││││               │
│         fingers               │
└───────────────────────────────┘
```

### EMG Electrode Placement

```text
Posterior View (Right-handed)
┌───────────────────────────────┐
│                               │
│      L        R               │
│      ○    ┌───●───┐           │
│           │Erector│ ← 2-3cm   │
│           │Spinae │   lateral │
│           └───────┘   to L3   │
│                               │
│      ○        ●               │
│              Gluteus ← Upper  │
│              Maximus   outer  │
│                        quadrant│
└───────────────────────────────┘

● = Electrode placement (Right/Trail side)
○ = Not used

Anterior Forearm (Right-handed)
┌───────────────────────────────┐
│     Elbow                     │
│        │                      │
│    ┌───●───┐                  │
│    │  FCR  │ ← Mid-forearm,   │
│    │       │   medial side,   │
│    └───────┘   muscle belly   │
│        │                      │
│      Wrist                    │
└───────────────────────────────┘
```

---

## Scientific Basis for Muscle Selection

### Why These 3 Muscles?

| Selection | Rationale | Why NOT Others |
|-----------|-----------|----------------|
| **Erector Spinae** | Highest trunk activation (83-106% MVC) | ❌ External Oblique: "moderate to LOW activation" per research |
| **Flexor Carpi Radialis** | >100% MVC, directly correlates with shot effectiveness | ✅ Best forearm choice |
| **Gluteus Maximus** | Primary hip rotation driver | ❌ Hamstrings: highest activation but mainly knee stabilization |

### Thigh vs Glutes Comparison

| Muscle | Location | Activation Level | Kinetic Chain Role |
|--------|----------|-----------------|-------------------|
| **Gluteus Maximus** | Buttocks | ⭐⭐ Medium-High | **Primary driver** - Hip rotation engine |
| Hamstrings | Posterior thigh | ⭐⭐⭐ 70-76% (highest) | Knee stabilization + assist hip extension |
| Quadriceps | Anterior thigh | ⭐⭐ Medium | Weight transfer, support |

**Conclusion**: Hamstrings show highest activation but mainly for **stabilization**; Glutes are the **rotation drivers**.

---

## Expected Data Patterns

### Correct Kinetic Chain (Good Swing)

```text
Angular Velocity Timeline:

Pelvis (L4)  ───────╱╲─────────────────
                   ↑ Peak 1st

Thorax (T1)  ────────────╱╲────────────
                        ↑ Peak 2nd (20-50ms later)

Hand         ──────────────────╱╲──────
                              ↑ Peak 3rd (latest)

             ├────────────────────────→ Time
            Top                    Impact
```

### Incorrect Pattern (Arm Swing)

```text
Angular Velocity Timeline:

Hand         ──────╱╲──────────────────
                  ↑ Peaks TOO EARLY

Thorax (T1)  ────────╱╲────────────────

Pelvis (L4)  ──────────╱╲──────────────
                      ↑ Peaks LATE (should be first)

             ├────────────────────────→ Time
```

---

## References

1. [Stanford IMU Validation (T1+L4)](https://www.mdpi.com/1424-8220/23/20/8433) - 2023
2. [Nature Wrist IMU Study](https://www.nature.com/articles/s41598-024-59949-w) - 2024
3. [EMG Activation Sequence & Shot Effectiveness](https://www.mdpi.com/1424-8220/16/4/592) - MDPI 2016
4. [EMG Variables During Golf Swing: Literature Review](https://pubmed.ncbi.nlm.nih.gov/22542769/) - 2012
5. [Muscles That Power the Swing](https://www.researchdrivengolf.com/rdg-articles/emg-muscles-that-power-the-swing) - Research Driven Golf
6. [TPI Kinematic Sequence Basics](https://www.mytpi.com/articles/biomechanics/kinematic-sequence-basics) - Titleist Performance Institute
7. [Stanford Golf Biomechanics Device](https://techfinder.stanford.edu/technology/golfing-science-wearable-device-measuring-golf-swing-biomechanics-0)
