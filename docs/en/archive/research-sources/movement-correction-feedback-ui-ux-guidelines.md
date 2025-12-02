# Movement Correction Feedback UI/UX Design Guidelines

**Document Version:** 1.0
**Date:** 2025-12-01
**Status:** Research Compilation & Design Recommendations

---

## Executive Summary

This document synthesizes UI/UX best practices for displaying real-time movement correction feedback in the Movement Chain AI system. It combines insights from:

- **Platform Guidelines**: Apple HIG, Material Design motion principles
- **Industry Examples**: Nike Training Club, Strava, AR fitness applications
- **Academic Research**: Motor learning studies, augmented feedback effectiveness
- **Accessibility Standards**: WCAG 2.1, color-blind friendly design

**Core Design Philosophy:**
> Provide immediate, actionable feedback that enhances motor learning without overwhelming the user or obscuring their view during movement execution.

---

## 1. Visual Hierarchy & Information Architecture

### 1.1 Priority-Based Information Display

Based on research showing that **multimodal feedback is most effective when perceived quickly and retained longer** ([Sigrist et al., 2013](https://link.springer.com/article/10.3758/s13423-012-0333-8)), establish clear visual priorities:

**Priority Level 1 (Critical Errors - Immediate Attention Required)**
- **When to Show**: Injury-risk errors (e.g., knee valgus, lumbar hyperextension)
- **Visual Treatment**:
  - Large, bold indicators
  - High contrast (see Color Palettes section)
  - Animated pulsing at 1-2 Hz frequency
  - Accompanied by haptic pulse (if enabled)
- **Screen Real Estate**: 15-20% of viewport
- **Example**: Red circular highlight on knee joint with downward correction arrow

**Priority Level 2 (Performance Errors - Important but Non-Urgent)**
- **When to Show**: Technique errors affecting performance (e.g., swing plane deviation)
- **Visual Treatment**:
  - Medium-size indicators
  - Moderate contrast
  - Subtle animation (fade-in only, no pulsing)
  - Optional haptic feedback
- **Screen Real Estate**: 10-15% of viewport
- **Example**: Yellow arc overlay showing ideal vs. actual club path

**Priority Level 3 (Informational - Context Only)**
- **When to Show**: Positive reinforcement, secondary metrics
- **Visual Treatment**:
  - Small, low-contrast indicators
  - Static or very subtle animation
  - No haptic feedback
- **Screen Real Estate**: 5-10% of viewport
- **Example**: Green checkmark on correctly positioned joint

### 1.2 Preventing Visual Overload

**Research Finding**: Studies show that feedback designs that disregard user preferences may cause discomfort and diminish exercise benefits ([MDPI Healthcare Study](https://www.mdpi.com/2227-9032/11/13/1835)).

**Maximum Simultaneous Indicators Rule:**
- **Real-time mode**: Display max 2 error indicators simultaneously
- **Post-action review**: Can show 3-5 error markers (no motion distraction)

**Priority Queue Logic:**
```
IF multiple_errors_detected:
    1. Filter by priority (injury risk > performance > informational)
    2. Show top 2 highest-priority errors
    3. Store remaining errors for post-action review
    4. Display "+N more" subtle badge if errors queued
```

**User Control:**
- Settings toggle: "Real-time feedback density" (Minimal / Moderate / Detailed)
- Per-error-type toggles: Allow users to disable specific error types
- "Focus Mode": Show only Priority 1 errors during movement

### 1.3 When to Use Arrows vs. Color vs. Text

| Feedback Type | Arrow | Color | Text | Use Case |
|---------------|-------|-------|------|----------|
| **Joint Position Error** | ✓ Primary | ✓ Secondary | ✗ | Show direction of correction (e.g., "straighten elbow") |
| **Movement Path Deviation** | ✓ Overlay | ✓ Path color | ✗ | Show ideal vs. actual trajectory (golf swing plane) |
| **Timing Error** | ✗ | ✓ Phase indicator | ✓ Small label | Show "too early/late" with color-coded timeline |
| **Muscle Activation Error** | ✗ | ✓ Heatmap | ✓ Label | EMG signal visualization ("weak core activation") |
| **Positive Reinforcement** | ✗ | ✓ Highlight | ✓ Brief message | "Good form!" with green glow on joints |

**Arrow Design Specifications:**
- **Anchor Point**: Attach to affected joint center, not body segment edges
- **Direction**: Point toward corrected position (3D projection to 2D screen)
- **Length**: Proportional to error magnitude (min: 20px, max: 80px)
- **Thickness**: 6-8px stroke width (visible but not obtrusive)
- **Animation**: Subtle pulse at 1 Hz (see Animation section)

---

## 2. Real-Time Overlay Techniques

### 2.1 Ghost Avatar Transparency Levels

**Research-Backed Recommendations:**

Based on AR fitness app analysis ([AR Fitness Applications](https://riseapps.co/fitness-augmented-reality/)) and transparency design principles ([Marvel Design Blog](https://marvelapp.com/blog/using-transparency-in-visual-design/)):

**User's Live Skeleton (Always 100% Opacity)**
- **Rationale**: Primary reference point, must be fully visible
- **Color**: White or light blue (#E0F7FF)
- **Stroke Width**: 4px for joints, 3px for bones

**Ideal/Expert Ghost Avatar (40-60% Opacity)**
- **Recommended**: 50% opacity (α = 0.5)
- **Rationale**: Clearly visible for comparison, doesn't obscure user's body
- **Color**: Green (#4CAF50) for correct positions
- **Implementation**:
  ```css
  .ghost-skeleton {
    opacity: 0.5;
    stroke: #4CAF50;
    stroke-width: 3px;
    fill: none;
  }
  ```

**Previous Attempt Overlay (25-35% Opacity)**
- **Recommended**: 30% opacity (α = 0.3)
- **Rationale**: Provides context without cluttering view
- **Color**: Light gray (#BDBDBD)
- **Use Case**: Show user's best previous rep for comparison

**Transparency Adjustment:**
- **User Setting**: Slider from 30% to 70% (default 50%)
- **Auto-Dimming**: Reduce opacity by 20% if camera detects low light conditions
- **Collision Detection**: If ghost and live skeleton overlap >80%, increase ghost opacity to 60% for clarity

### 2.2 Placement Strategies for Side-by-Side Comparisons

**Full-Screen Overlay Mode (Default for Real-Time)**
```
┌─────────────────────────────────┐
│  Camera Feed (Live)             │
│                                 │
│      [Live Skeleton]            │
│      [Ghost Overlay 50%]        │
│      [Error Arrows]             │
│                                 │
│  [Quality Score] [Rep Count]    │
└─────────────────────────────────┘
```

**Split-View Mode (Post-Action Review)**
```
┌─────────────────┬───────────────┐
│   Your Rep      │  Ideal Form   │
│                 │               │
│   [Replay]      │  [Template]   │
│                 │               │
│   [Arrows on    │  [Clean       │
│    errors]      │   skeleton]   │
└─────────────────┴───────────────┘
     Score: 72/100
```

**Preventing View Obstruction:**

1. **Safe Zones**: Reserve top 15% and bottom 20% for UI controls
2. **Dynamic Repositioning**: If error arrow overlaps face detection area, shift to adjacent quadrant
3. **Occlusion Handling**:
   ```
   IF joint_confidence < 0.6:  # Camera can't see joint
       Hide error arrow for that joint
       Show text warning: "Reposition camera"
   ```

### 2.3 Rendering Optimization for 60 FPS

Based on mobile AR performance research ([Unity Best Practices](https://unity.com/how-to/best-practices-vr-and-mobile-ar-graphics), [NCBI Multi-Resolution Study](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10422453/)):

**Level of Detail (LOD) Strategy:**
- **Close-up (user <2m from camera)**: Full skeleton (17 keypoints), detailed error arrows
- **Medium (2-4m)**: Reduced skeleton (11 keypoints: shoulders, elbows, wrists, hips, knees, ankles)
- **Far (>4m)**: Simplified overlay (5 keypoints: shoulders, hips, knees only)

**Rendering Pipeline:**
```
Camera Frame (60 FPS)
  → Pose Estimation (30-50ms)
    → Skeleton Rendering (GPU, 5-8ms)
      → Error Overlay (CPU, 3-5ms)
        → Composite (GPU, 2-3ms)
          → Display (16.7ms budget for 60 FPS)
```

**Optimization Techniques:**
1. **Pre-computed Assets**: Cache arrow sprites, don't redraw vectors each frame
2. **Batching**: Render all skeleton lines in single draw call
3. **Early Culling**: Don't render joints with confidence <0.4
4. **Alpha Blending**: Use GPU-accelerated transparency (avoid CPU-based compositing)

**Transparency Performance:**
- **Warning**: Translucent materials have expensive per-pixel cost ([Unity VR/AR Guidelines](https://unity.com/how-to/best-practices-vr-and-mobile-ar-graphics))
- **Mitigation**: Use simple alpha blending, avoid layered transparency effects
- **Target**: Transparency overhead <5ms per frame on mid-range devices

---

## 3. Animation & Transition Specifications

### 3.1 Arrow Animation Patterns

**Research Foundation**: Material Design emphasizes that motion should be informative, focused, and expressive ([Material Design Motion](https://m3.material.io/styles/motion/overview/how-it-works)).

**Correction Arrow States:**

**State 1: Appearance (Error Detected)**
```
Animation: Fade-in + Scale-up
Duration: 200ms
Easing: Ease-out cubic-bezier(0.25, 0.1, 0.25, 1)
From: opacity 0%, scale 0.8
To: opacity 100%, scale 1.0
```

**State 2: Active Error (Pulsing)**
```
Animation: Pulse (opacity variation)
Duration: 1000ms (1 Hz frequency)
Easing: Ease-in-out sine
From: opacity 80%
To: opacity 100%
Loop: Infinite while error persists
```

**State 3: Correction in Progress (Fading)**
```
Animation: Opacity fade
Duration: 400ms
Easing: Ease-out
From: opacity 100%
To: opacity 40%
Trigger: Error severity reduces by >30%
```

**State 4: Corrected (Exit)**
```
Animation: Fade-out + Scale-down + Checkmark
Duration: 300ms
Easing: Ease-in cubic-bezier(0.42, 0, 0.58, 1)
From: opacity 100%, scale 1.0
To: opacity 0%, scale 0.7
Final: Show green checkmark (150ms), then fade
```

**Static vs. Animated Indicators Decision Matrix:**

| Error Type | Real-Time | Post-Action | Animation Type |
|------------|-----------|-------------|----------------|
| **High Priority** | Pulsing (1 Hz) | Static with highlight | Attention-grabbing |
| **Medium Priority** | Fade-in only | Static | Non-distracting |
| **Low Priority** | Static | Static | Minimal cognitive load |

### 3.2 Correct/Incorrect State Transitions

**Color Transition Timing:**
```
Error Detected → Yellow (Warning)
  → 200ms ease-out transition

Yellow (Warning) → Red (Critical)
  → 400ms ease-in transition if error worsens

Red (Critical) → Yellow (Improving)
  → 300ms ease-out transition

Yellow (Improving) → Green (Corrected)
  → 250ms ease-out transition
  → Hold green for 1000ms
  → Fade out over 300ms
```

**State Machine Hysteresis:**
```python
def update_error_state(current_severity, previous_severity):
    # Prevent rapid flickering between states
    HYSTERESIS_THRESHOLD = 1.0  # Severity units

    if abs(current_severity - previous_severity) < HYSTERESIS_THRESHOLD:
        return previous_state  # Don't change state

    if current_severity > 7.0:
        return "RED_CRITICAL"
    elif current_severity > 4.0:
        return "YELLOW_WARNING"
    else:
        return "GREEN_GOOD"
```

**Animation Performance Budget:**
- **Target**: All animations <16.7ms per frame (60 FPS)
- **Material Design Timing**: Mobile animations 300-400ms for larger movements, 150-200ms for smaller ([Material Design Motion](https://m2.material.io/design/motion/understanding-motion.html))

### 3.3 Transition Smoothness (Avoiding Jarring Changes)

**Easing Functions Reference:**
```javascript
// Import from Material Design easing curves
const EASE_OUT = 'cubic-bezier(0.25, 0.1, 0.25, 1)';      // Exit animations
const EASE_IN = 'cubic-bezier(0.42, 0, 0.58, 1)';         // Enter animations
const EASE_IN_OUT = 'cubic-bezier(0.4, 0, 0.2, 1)';       // State changes
const LINEAR = 'linear';                                   // Continuous motion
```

**Example Implementation (Flutter):**
```dart
AnimatedOpacity(
  opacity: errorDetected ? 1.0 : 0.0,
  duration: Duration(milliseconds: 200),
  curve: Curves.easeOut,
  child: CorrectionArrow(
    direction: errorVector,
    color: errorColor,
  ),
);
```

**Preventing Motion Sickness:**
- **Avoid**: Rapid zooming, spinning animations
- **Use**: Fades, slides, subtle scales only
- **Max Rotation**: ±15° for directional arrows (no continuous spins)
- **Max Scale Change**: 0.8x to 1.2x (avoid jarring size jumps)

---

## 4. Mobile-Specific Considerations

### 4.1 Screen Size Constraints

**Responsive Scaling Rules:**

| Screen Size | Skeleton Stroke | Arrow Thickness | Min Touch Target | Font Size (Error Labels) |
|-------------|----------------|-----------------|------------------|--------------------------|
| **Small (<5.5")** | 3px | 5px | 44×44px (Apple) | 14pt |
| **Medium (5.5-6.5")** | 4px | 6px | 44×44px | 16pt |
| **Large (>6.5")** | 5px | 8px | 48×48px | 18pt |

**Dynamic Viewport Adaptation:**
```javascript
const getScaleFactor = (screenDiagonal) => {
  // Base design: 6.1" iPhone 14
  const BASE_DIAGONAL = 6.1;
  return Math.min(screenDiagonal / BASE_DIAGONAL, 1.3); // Cap at 1.3x
};

const arrowThickness = 6 * getScaleFactor(deviceDiagonal);
```

**Landscape vs. Portrait Mode:**
- **Golf**: Landscape preferred (wider field of view for swing plane)
- **Workout**: Portrait preferred (full-body vertical framing)
- **Auto-Rotation**: Disabled during active movement (prevent disorienting flips)

### 4.2 Performance Optimization for Real-Time Rendering

**Battery Impact Mitigation** (Target: <15% battery drain/hour):

1. **Frame Rate Adaptation:**
   ```
   Battery Level > 50%: 60 FPS rendering
   Battery 20-50%: 45 FPS rendering
   Battery < 20%: 30 FPS + warning prompt
   ```

2. **Thermal Throttling:**
   ```
   Device Temp < 40°C: Full rendering
   Device Temp 40-45°C: Reduce shadow effects, simplify overlays
   Device Temp > 45°C: Show warning, reduce to 30 FPS
   ```

3. **Memory Management:**
   - **Pre-allocate buffers**: Reuse camera frame buffers (avoid GC pauses)
   - **Texture atlases**: Combine arrow sprites into single texture (reduce draw calls)
   - **Target**: <500MB RAM usage during peak rendering

**Flutter-Specific Optimizations** (per [ADR-0003](../../decisions/0003-flutter-mobile.md)):
```dart
// Use RepaintBoundary to isolate animated layers
RepaintBoundary(
  child: CustomPaint(
    painter: SkeletonOverlayPainter(),
    child: OverlayArrows(),
  ),
);

// Run heavy computations on isolate
final errorAnalysis = await compute(analyzeMovement, sensorData);
```

### 4.3 Touch-Friendly Controls for Toggling Feedback Modes

**Control Panel Design:**
```
┌─────────────────────────────────┐
│  [Live Camera Feed]             │
│                                 │
│  Floating Controls (Bottom):    │
│  ┌────────────────────────────┐ │
│  │ [👁️ Overlay] [🎯 Arrows]    │ │
│  │ [📊 Metrics] [⚙️ Settings]   │ │
│  └────────────────────────────┘ │
└─────────────────────────────────┘
```

**Button Specifications:**
- **Size**: 56×56px (Material FAB standard)
- **Spacing**: 16px between buttons
- **Feedback**: Haptic click on tap (Android HapticFeedbackConstants.CONTEXT_CLICK)
- **State Indicator**: Icon color change + 2px outline when active

**Quick Toggle Gestures:**
- **Double-tap screen**: Toggle all overlays on/off
- **Swipe down from top**: Show/hide metrics bar
- **Long-press camera view**: Freeze frame for closer inspection (post-action only)

**Accessibility:**
- **Voice Control**: "Hide arrows", "Show skeleton"
- **Switch Access**: All toggles keyboard-navigable
- **Minimum Touch Target**: 44×44px (Apple HIG) / 48×48px (Material)

---

## 5. Color Palettes & Accessibility

### 5.1 Color-Blind Friendly Palettes

**Research Foundation**: Red/green is the most common color vision deficiency, affecting ~8% of men ([Coloring for Colorblindness](https://davidmathlogic.com/colorblind/)).

**Primary Palette (Replaces Red-Yellow-Green Traffic Light):**

| State | Color Name | Hex Code | RGB | Use Case | Color-Blind Safe? |
|-------|-----------|----------|-----|----------|-------------------|
| **Critical Error** | Dark Red | `#C62828` | (198, 40, 40) | High-priority errors | ⚠️ No (use with icon) |
| **Warning** | Amber | `#F9A825` | (249, 168, 37) | Medium-priority errors | ✓ Yes (high lightness) |
| **Good/Correct** | Blue-Green | `#00897B` | (0, 137, 123) | Positive feedback | ✓ Yes |
| **Neutral** | Light Gray | `#BDBDBD` | (189, 189, 189) | Informational | ✓ Yes |

**Alternative Palette (Blue-Orange for Maximum Accessibility):**

| State | Color Name | Hex Code | RGB | Use Case |
|-------|-----------|----------|-----|----------|
| **Error** | Deep Orange | `#E64A19` | (230, 74, 25) | Errors (appears olive to red-blind) |
| **Correct** | Blue | `#1976D2` | (25, 118, 210) | Positive feedback |
| **Warning** | Amber | `#FFA726` | (255, 167, 38) | Moderate issues |

**Contrast Requirements** (WCAG 2.1 Level AA):
- **Text on overlay**: Minimum 4.5:1 contrast ratio
- **Graphical elements** (arrows, skeleton): Minimum 3:1 contrast with background
- **Testing Tool**: [Accessible Color Palette Generator](https://venngage.com/tools/accessible-color-palette-generator)

### 5.2 Supplementary Visual Indicators (Beyond Color)

**Research Insight**: "Color should not be the only indicator for interactive elements" ([OSU ETS Guidelines](https://ets.osu.edu/color-guidelines-digital-accessibility)).

**Icon-Based Error Indicators:**

| Error Type | Icon | Color | Shape |
|------------|------|-------|-------|
| **Critical Error** | ⚠️ Warning Triangle | Red `#C62828` | Triangle with exclamation |
| **Warning** | ⚡ Lightning Bolt | Amber `#F9A825` | Zigzag shape |
| **Corrected** | ✓ Checkmark | Blue-Green `#00897B` | Circle with check |
| **Information** | ℹ️ Info Circle | Gray `#757575` | Circle with 'i' |

**Pattern Overlays (for Color-Blind Users):**
```
Critical: Diagonal stripes (45° angle, 2px lines)
Warning: Dotted border (4px dots, 2px spacing)
Correct: Solid fill with subtle glow
```

**Implementation Example:**
```dart
// Combine color + icon + pattern
Container(
  decoration: BoxDecoration(
    color: errorColor.withOpacity(0.2),
    border: Border.all(
      color: errorColor,
      width: 2,
      style: severity > 7 ? BorderStyle.solid : BorderStyle.none,
    ),
  ),
  child: Row(
    children: [
      Icon(getErrorIcon(errorType), color: errorColor),
      Text(errorMessage, style: TextStyle(color: errorColor)),
    ],
  ),
);
```

### 5.3 Skin Tone & Background Adaptation

**Challenge**: White skeleton overlay may be invisible on light skin tones; dark overlays clash with dark backgrounds.

**Dynamic Color Adjustment:**
```python
def adapt_overlay_color(camera_frame, user_bbox):
    # Sample average brightness in user's bounding box
    user_region = camera_frame[bbox.y:bbox.y+bbox.h, bbox.x:bbox.x+bbox.w]
    avg_luminance = cv2.cvtColor(user_region, cv2.COLOR_BGR2GRAY).mean()

    if avg_luminance > 180:  # Light background/skin
        skeleton_color = (0, 100, 200)  # Dark blue
        arrow_color = (200, 50, 50)     # Dark red
    elif avg_luminance < 80:  # Dark background
        skeleton_color = (255, 255, 255)  # White
        arrow_color = (255, 150, 0)       # Orange
    else:  # Medium
        skeleton_color = (200, 230, 255)  # Light blue
        arrow_color = (255, 80, 80)       # Red

    return skeleton_color, arrow_color
```

**High-Contrast Mode (User Setting):**
- **Enabled**: Increase all stroke widths by 50%, use pure black/white only
- **Use Case**: Bright outdoor lighting (golf driving range)

---

## 6. Haptic Feedback Patterns

### 6.1 Vibration Patterns for Different Error Types

**Research Foundation**: Best UX synchronizes visual, audio, and haptic feedback, triggering all three simultaneously ([Saropa Contacts 2025 Guide](https://saropa-contacts.medium.com/2025-guide-to-haptics-enhancing-mobile-ux-with-tactile-feedback-676dd5937774)).

**Standard Haptic Library (iOS CoreHaptics / Android HapticFeedbackConstants):**

| Error Type | Haptic Pattern | Duration | Intensity | Platform API |
|------------|---------------|----------|-----------|--------------|
| **Critical Error** | Double Tap | 80ms (40ms + gap + 40ms) | 1.0 (max) | `UINotificationFeedbackType.error` (iOS) |
| **Warning** | Single Tap | 50ms | 0.7 (moderate) | `UIImpactFeedbackStyle.medium` (iOS) |
| **Corrected** | Success Pulse | 30ms | 0.5 (light) | `UINotificationFeedbackType.success` (iOS) |
| **Real-Time Cue** | Gentle Nudge | 20ms | 0.4 (subtle) | `UIImpactFeedbackStyle.light` (iOS) |

**Android Implementation:**
```kotlin
// Use HapticFeedbackConstants for consistency
view.performHapticFeedback(
    HapticFeedbackConstants.CONTEXT_CLICK,  // For warnings
    HapticFeedbackConstants.FLAG_IGNORE_GLOBAL_SETTING  // Override user mute
)

// For critical errors
view.performHapticFeedback(HapticFeedbackConstants.REJECT)
```

**Custom Waveform (ESP32-S3 Wearable Sensor):**
```cpp
// DRV2605L haptic driver commands
void triggerCriticalErrorHaptic() {
    drv.setWaveform(0, 47);  // Strong Click 100%
    drv.setWaveform(1, 0);   // End sequence (gap)
    drv.go();
    delay(50);
    drv.setWaveform(0, 47);  // Repeat for double-tap
    drv.go();
}

void triggerWarningHaptic() {
    drv.setWaveform(0, 10);  // Soft Bump 70%
    drv.setWaveform(1, 0);
    drv.go();
}
```

### 6.2 Timing Synchronization with Visual Feedback

**Synchronization Requirements:**
```
Visual Error Appears (t=0ms)
  ↓
Haptic Trigger (t=0-10ms)  ← Must be within 10ms of visual
  ↓
Audio Cue (optional, t=0-15ms)
```

**Implementation (Flutter with BLE Wearable):**
```dart
void triggerErrorFeedback(ErrorType error) async {
  final startTime = DateTime.now();

  // 1. Update visual state (synchronous)
  setState(() {
    activeErrors.add(error);
  });

  // 2. Trigger haptic (asynchronous but fast)
  unawaited(HapticFeedback.heavyImpact());  // Phone haptic
  unawaited(bleManager.sendHapticCommand(error.hapticPattern));  // Wearable

  // 3. Optional audio cue
  if (settings.audioEnabled) {
    unawaited(audioPlayer.play(error.soundEffect));
  }

  // Log sync timing for debugging
  final syncDelay = DateTime.now().difference(startTime).inMilliseconds;
  if (syncDelay > 15) {
    logger.warning('Haptic sync delayed: ${syncDelay}ms');
  }
}
```

### 6.3 User Control & Accessibility

**Haptic Settings UI:**
```
┌─────────────────────────────────┐
│  Haptic Feedback Settings       │
│                                  │
│  Enable Haptics:  [✓]           │
│                                  │
│  Intensity:                      │
│  [━━━━━●━━━━] 70%               │
│  (Subtle)  (Strong)              │
│                                  │
│  Trigger Threshold:              │
│  ○ All Errors                    │
│  ● Medium+ Priority              │
│  ○ Critical Only                 │
│                                  │
│  Phone Haptics:    [✓]           │
│  Wearable Haptics: [✓]           │
└─────────────────────────────────┘
```

**Accessibility Considerations** ([Boréas Technologies Guidelines](https://pages.boreas.ca/blog/piezo-haptics/guidelines-of-haptic-ux-design)):
- **Opt-out**: Allow users to disable haptics (sensory processing differences)
- **Intensity Control**: 0-100% slider (default 70%)
- **Frequency Limits**: Max 1 haptic event per 500ms (prevent overwhelming feedback)
- **Battery Saver**: Auto-disable haptics when battery <15%

---

## 7. Research-Backed Best Practices

### 7.1 Motor Learning Research Insights

**Multimodal Feedback Superiority:**
> "Multimodal augmented feedback seems to be the most effective and appropriate way to give feedback during motor learning in healthy and diseased populations and athletes as its stimuli are perceived faster and tend to be retained longer compared with unimodal stimuli." ([PMC Motor Learning Review](https://pmc.ncbi.nlm.nih.gov/articles/PMC8681883/))

**Implementation:**
- Combine visual (arrows + color) + haptic (vibration) + audio (optional beep)
- Default: Visual + Haptic (audio opt-in)
- Advanced users can disable individual modalities

**Visual Feedback as Primary Modality:**
> "Visual feedback is considered the cornerstone of all augmented feedback types by citing its superiority in learning complex skills." ([Motor Learning Systematic Review](https://www.researchgate.net/publication/356372598_The_Role_of_Augmented_Feedback_on_Motor_Learning_A_Systematic_Review))

**Implementation:**
- Prioritize visual clarity over haptic intensity
- Use haptics to reinforce, not replace, visual cues

### 7.2 AR Fitness Application Case Studies

**Kemtai (Motion Correction Features):**
- Real-time motion tracking via device camera
- Comparison with standardized movements
- Immediate corrective feedback display
- **Lesson**: Users respond well to side-by-side comparisons

**Nike Training Club (Visual Design):**
- Clean, high-contrast interface (white background + neon accents)
- Minimalist design reduces distractions during workouts
- **Lesson**: Less is more for real-time feedback
- [Source: Stormotion Fitness App UX](https://stormotion.io/blog/fitness-app-ux/)

**Strava (Progress Visualization):**
- Stat cards pulse gently when loading
- Achievements glow with brand orange
- **Lesson**: Subtle animations enhance engagement without distraction
- [Source: DesignRush Best Fitness Apps](https://www.designrush.com/best-designs/apps/trends/fitness-app-design-examples)

### 7.3 Academic Findings on Augmented Feedback

**Feedback Frequency:**
> "Reduced frequency feedback schedules (e.g., every 3rd rep) enhance long-term retention compared to 100% feedback." ([ScienceDirect Study](https://www.sciencedirect.com/science/article/abs/pii/S1469029222001455))

**Implementation:**
- **Beginner Mode**: Feedback every rep (100%)
- **Intermediate Mode**: Feedback every 2nd rep (50%)
- **Advanced Mode**: Feedback every 3rd rep + summary (33%)

**Faded Feedback Protocol:**
```python
def calculate_feedback_frequency(session_number):
    # Start with 100% feedback, gradually reduce
    if session_number <= 3:
        return 1.0  # 100% (every rep)
    elif session_number <= 7:
        return 0.5  # 50% (every 2nd rep)
    else:
        return 0.33  # 33% (every 3rd rep)
```

**Visual Cue Effectiveness:**
> "In most cases, [mixed reality feedback] involves visual cues to help the user understand the corrective feedback." ([IEEE Visualization Survey](https://dl.acm.org/doi/10.1109/TVCG.2022.3227999))

**Implementation:**
- Arrows > Color alone > Text alone
- Combine all three for maximum clarity

---

## 8. Implementation Guidelines

### 8.1 Component Architecture (Flutter)

**Modular Widget Structure:**
```dart
// lib/presentation/widgets/feedback_overlay/
├── feedback_overlay.dart          // Main container
├── skeleton_renderer.dart         // Live + ghost skeletons
├── correction_arrows.dart         // Directional error indicators
├── quality_badge.dart             // Score display
├── error_annotations.dart         // Text labels
└── haptic_controller.dart         // Haptic coordination
```

**Example Widget:**
```dart
class FeedbackOverlay extends StatelessWidget {
  final PoseData livePose;
  final PoseData? idealPose;
  final List<ErrorReport> errors;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Layer 1: Camera feed (bottom)
        CameraPreview(),

        // Layer 2: Ghost skeleton (if available)
        if (idealPose != null)
          SkeletonRenderer(
            pose: idealPose,
            color: Colors.green,
            opacity: 0.5,  // 50% transparency
          ),

        // Layer 3: Live skeleton
        SkeletonRenderer(
          pose: livePose,
          color: Colors.white,
          opacity: 1.0,
        ),

        // Layer 4: Error arrows (top)
        ...errors.map((e) => CorrectionArrow(
          position: livePose.getJoint(e.jointId),
          direction: e.correctionVector,
          severity: e.severity,
        )),

        // Layer 5: Quality score (overlay UI)
        Positioned(
          top: 20,
          right: 20,
          child: QualityBadge(score: livePose.qualityScore),
        ),
      ],
    );
  }
}
```

### 8.2 Performance Profiling Checklist

**Pre-Launch Benchmarks:**
- [ ] Render pipeline maintains 60 FPS (P95 >55 FPS)
- [ ] Transparency overlay adds <5ms per frame
- [ ] Memory usage <500MB during peak rendering
- [ ] Battery drain <15% per hour (screen-on time)
- [ ] BLE haptic latency <10ms (visual to tactile)
- [ ] Arrow animations smooth (no dropped frames)

**Profiling Tools:**
- **Flutter DevTools**: Frame rendering timeline, memory allocation
- **Xcode Instruments**: iOS GPU usage, battery impact
- **Android Profiler**: CPU, memory, network (BLE) monitoring

### 8.3 A/B Testing Framework

**Testable Variations:**

| Feature | Variant A | Variant B | Metric |
|---------|-----------|-----------|--------|
| **Ghost Opacity** | 50% | 40% | User preference survey |
| **Arrow Animation** | Pulsing (1 Hz) | Static | Error correction speed |
| **Haptic Intensity** | 70% | 50% | User comfort rating |
| **Color Palette** | Red-Yellow-Green | Blue-Orange | Color-blind user feedback |
| **Feedback Frequency** | 100% (every rep) | 50% (every 2nd rep) | 7-day retention |

**Implementation:**
```dart
// Feature flag system
class FeedbackConfig {
  static double getGhostOpacity() {
    return RemoteConfig.instance.getDouble('ghost_opacity') ?? 0.5;
  }

  static bool useBlueOrangePalette() {
    return RemoteConfig.instance.getBool('blue_orange_palette') ?? false;
  }
}
```

---

## 9. Key Design Decisions Summary

### 9.1 Recommended Default Settings

| Feature | Default Value | Rationale |
|---------|--------------|-----------|
| **Ghost Avatar Opacity** | 50% | Balance visibility & non-obstruction |
| **Max Simultaneous Arrows** | 2 | Prevent visual overload |
| **Arrow Animation** | Pulsing (1 Hz) for Priority 1 only | Draw attention without distraction |
| **Color Palette** | Blue-Orange (accessibility mode) | 8% male population color-blind safe |
| **Haptic Intensity** | 70% | Noticeable but not uncomfortable |
| **Feedback Frequency** | 100% (beginners), fades to 33% | Follow motor learning research |

### 9.2 User Customization Options

**Essential Settings:**
- ✓ Ghost avatar on/off
- ✓ Arrow density (minimal / moderate / detailed)
- ✓ Haptic intensity slider
- ✓ Color palette (standard / high-contrast / color-blind)

**Advanced Settings:**
- ✓ Per-error-type toggles
- ✓ Feedback frequency (100% / 50% / 33%)
- ✓ Audio cues on/off
- ✓ Custom color picker (power users)

### 9.3 Platform-Specific Adaptations

**iOS:**
- Use CoreHaptics for rich haptic patterns
- Follow Apple HIG for feedback timing ([Feedback Patterns](https://developer.apple.com/design/human-interface-guidelines/patterns/feedback/))
- Enable Dynamic Type for accessibility

**Android:**
- Use HapticFeedbackConstants for standard patterns
- Follow Material Design motion principles
- Support TalkBack for screen reader users

---

## 10. References

### Industry Guidelines
- [Apple Human Interface Guidelines - Feedback Patterns](https://developer.apple.com/design/human-interface-guidelines/patterns/feedback/)
- [Material Design - Motion Principles](https://m3.material.io/styles/motion/overview/how-it-works)
- [Android Haptics Design Principles](https://developer.android.com/develop/ui/views/haptics/haptics-principles)

### Academic Research
- [The Role of Augmented Feedback on Motor Learning - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8681883/)
- [Augmented Visual, Auditory, Haptic, and Multimodal Feedback in Motor Learning](https://link.springer.com/article/10.3758/s13423-012-0333-8)
- [Visual Cue Based Corrective Feedback for Motor Skill Training - IEEE](https://dl.acm.org/doi/10.1109/TVCG.2022.3227999)

### Accessibility Standards
- [WCAG 2.1 Color Contrast Guidelines](https://ets.osu.edu/color-guidelines-digital-accessibility)
- [Coloring for Colorblindness - David MathLogic](https://davidmathlogic.com/colorblind/)
- [Accessible Color Palette Generator](https://venngage.com/tools/accessible-color-palette-generator)

### UX Case Studies
- [Nike Training Club UX Case Study](https://medium.com/@eunice.choi/ux-case-study-nike-training-club-371c2b79e6dc)
- [Fitness App UI Design Best Practices - Stormotion](https://stormotion.io/blog/fitness-app-ux/)
- [Strava UI/UX Case Study](https://medium.com/@wjun8815/ui-ux-case-study-strava-fitness-app-0fc2ff1884ba)

### AR/VR Performance
- [Unity Best Practices for VR/AR Graphics](https://unity.com/how-to/best-practices-vr-and-mobile-ar-graphics)
- [Multi-Resolution 3D Rendering for High-Performance Web AR - NCBI](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10422453/)

### Haptic Design
- [2025 Guide to Haptics - Saropa Contacts](https://saropa-contacts.medium.com/2025-guide-to-haptics-enhancing-mobile-ux-with-tactile-feedback-676dd5937774)
- [Guidelines of Haptic UX Design - Boréas Technologies](https://pages.boreas.ca/blog/piezo-haptics/guidelines-of-haptic-ux-design)
- [Haptics UX Design - Android Open Source Project](https://source.android.com/docs/core/interaction/haptics/haptics-ux-design)

### Movement Chain AI Internal Docs
- [ADR-0003: Flutter Mobile Development](../../decisions/0003-flutter-mobile.md)
- [HLD 01: System Overview](../../architecture/hld/01-system-overview.md)

---

## Document Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-12-01 | Research Compilation | Initial guidelines based on industry research & academic studies |

---

**Document Status:** Research Complete - Ready for Design Implementation
**Next Steps:**
1. Create visual mockups based on these specifications
2. Build Flutter prototype with ghost avatar + arrow overlays
3. Conduct user testing (N=10-20) for opacity/color preferences
4. Iterate based on feedback, measure error correction speed

**Feedback:** Open GitHub issues for design questions or additional research needs
