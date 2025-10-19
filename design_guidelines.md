# Design Guidelines: Interactive Hierarchical Clustering Visualization

## Design Approach: Reference-Based (Educational Data Visualization)

**Primary Inspiration**: Observable notebooks (interactive data viz) + Linear (clean, modern UI) + Figma (professional data tools)

**Core Philosophy**: Create an engaging, story-driven educational experience that transforms complex ML algorithms into visual narratives. Each dataset theme tells its own story through contextual design elements.

---

## Color Palettes (HSL Format - Space Separated)

### Base Theme (Dark Mode Primary)
- **Background**: 222 47% 11% (deep charcoal)
- **Surface**: 222 47% 15% (elevated panels)
- **Text Primary**: 0 0% 98%
- **Text Secondary**: 0 0% 70%
- **Border**: 222 20% 25%

### Medical Dataset Theme
- **Primary**: 350 80% 55% (warm red for health)
- **Cluster Colors**: 
  - Viral: 350 75% 60% (warm red)
  - Cardiac: 220 75% 60% (clinical blue)
  - Metabolic: 160 70% 55% (healthy teal)
  - Normal: 140 60% 55% (reassuring green)
- **Accent**: 45 95% 60% (caution yellow for alerts)

### Crime Sites Theme
- **Primary**: 355 85% 50% (emergency red)
- **Cluster Colors**:
  - High Severity (5): 355 85% 50% (deep red)
  - Medium Severity (3-4): 30 85% 55% (orange)
  - Low Severity (1-2): 55 75% 60% (yellow)
- **Accent**: 210 85% 55% (police blue)

### Customer Segmentation Theme
- **Primary**: 265 85% 60% (premium purple)
- **Cluster Colors**:
  - Luxury: 280 80% 65% (royal purple)
  - High Spenders: 200 75% 60% (affluent blue)
  - Fashion Forward: 330 75% 65% (trendy pink)
  - Value Seekers: 160 70% 55% (smart green)
- **Accent**: 45 90% 60% (gold for premium)

---

## Typography

**Font Stack**: 'Inter' for UI, 'JetBrains Mono' for data labels/tooltips

- **Hero/Section Titles**: text-4xl font-bold tracking-tight (40px)
- **Step Headers**: text-2xl font-semibold (24px)
- **Body Text**: text-base font-normal (16px)
- **Data Labels**: text-sm font-mono (14px, monospace)
- **Tooltips**: text-xs font-medium (12px)
- **Cluster Insights**: text-sm font-medium italic (14px)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20 for consistency

**Main Layout Structure**:
- **Control Panel** (top): Full-width, h-20, fixed position with backdrop blur
- **Visualization Area** (below): Two-panel split
  - Left Panel: Scatter plot (60% width on lg screens)
  - Right Panel: Dendrogram (40% width on lg screens)
  - Mobile: Stack vertically
- **Step Progress Bar**: Fixed bottom, h-16, showing current animation step

**Container Constraints**:
- Max width: max-w-screen-2xl (1536px)
- Content padding: px-6 md:px-12
- Panel gaps: gap-6 md:gap-8

---

## Component Library

### Control Panel
- **Dataset Dropdown**: Custom select with dataset-specific icons (patient/pin/bag) and theme color accent on selection
- **Algorithm Dropdown**: Clean toggle-style with visual indicator (Bottom-Up arrow vs Top-Down arrow)
- **Play/Pause/Reset Controls**: Circular buttons with icon, size-12, with glow effect on hover
- **Step Counter**: "Step 3 of 12" with progress bar, subtle pulse animation

### Scatter Plot Canvas
- **Background**: Dark grid with subtle lines (opacity-10)
- **Axes**: Clean lines with labeled ticks, font-mono text-xs
- **Data Point Icons**:
  - Medical: User icon with pulse outline (size-8)
  - Crime: Map pin with severity color fill (size-7)
  - Customer: Shopping bag outline (size-8)
- **Hover State**: Icon scales to 1.2x, tooltip appears with 200ms delay
- **Active Point**: Glowing ring around icon (ring-4 ring-primary/50)

### Connection Lines
- **Similarity Lines**: Dashed stroke (stroke-dasharray: 4,4), 2px width, animated drawing effect
- **Duration**: 800ms ease-in-out
- **Color**: Matches primary theme color at 60% opacity

### Cluster Circles
- **Visual Treatment**: 
  - Border: 3px solid cluster color
  - Fill: Cluster color at 8% opacity
  - Border radius: Organic, rounded shape (not perfect circle)
- **Formation Animation**: Scale from 0 with spring physics (600ms)
- **Hover State**: 
  - Fill opacity increases to 15%
  - Border glows (filter: drop-shadow)
  - Tooltip shows aggregate stats (large card, top-right corner)

### Dendrogram Panel
- **Background**: Surface color with subtle left border
- **Tree Lines**: 2px stroke, rounded corners at branches
- **Branch Animation**: Grows from bottom-up, 500ms per merge
- **Cut Line**: Interactive dashed line (red), draggable with cursor grab
- **Node Markers**: Small circles (size-3) at branch points
- **Labels**: Rotated -45deg at leaf nodes, horizontal at cluster level

### Tooltips
- **Data Point Tooltip**:
  - Background: Surface color with backdrop blur
  - Border: 1px border with theme color accent
  - Padding: p-3
  - Shadow: Large soft shadow (shadow-xl)
  - Content: Icon + Label + 3 metrics in grid

- **Cluster Tooltip**:
  - Larger card (min-w-64)
  - Header with cluster name and color badge
  - Stats grid: Average values for all metrics
  - Diagnosis/Insight: Italic text with icon
  - Animation: Fade in from scale-95 (200ms)

### Add Data Point Interface
- **Click-to-Add**: Crosshair cursor on scatter plot
- **Preview Ghost**: Semi-transparent icon follows cursor
- **Placement Confirmation**: Icon solidifies with brief scale pulse
- **New Point Highlight**: Glowing ring for 2 seconds, then integrates

### Step-by-Step Animation Controls
- **Timeline**: Horizontal step indicators with connecting line
- **Active Step**: Larger dot with pulse animation
- **Completed Steps**: Checkmark in circle
- **Upcoming Steps**: Empty circle, muted color

---

## Animation Specifications

**Critical - This Project Requires Rich Animations**:

1. **Initial Load**: Stagger-in data points (50ms delay each)
2. **Line Connection**: Draw animation using stroke-dashoffset (800ms)
3. **Cluster Formation**: 
   - Circle scales from 0 to 1 (600ms, spring easing)
   - Background color fades in (400ms)
4. **Dendrogram Growth**:
   - Each branch draws upward (500ms)
   - Synchronized with scatter plot merges
5. **Cluster Merges**: 
   - Two circles move toward center point
   - Merge into larger circle (1000ms total)
   - Color blends during transition
6. **Data Point Addition**:
   - New point appears with scale pulse (300ms)
   - Similarity calculations show as radiating rings (500ms)
   - Integration animation (800ms)

**Easing Functions**:
- Default: ease-in-out
- Organic movements: spring physics
- Data reveals: ease-out
- UI interactions: ease-in-out

---

## Interaction States

- **Idle**: Subtle breathing animation on cluster circles (2% opacity variation)
- **Hover**: Immediate feedback (100ms transition)
- **Active/Dragging**: Cursor changes, visual feedback (grabbing hand)
- **Loading/Calculating**: Spinner with theme color, 16px
- **Error State**: Red border flash on invalid action

---

## Responsive Behavior

- **Desktop (lg+)**: Side-by-side panels, full animation suite
- **Tablet (md)**: Stacked panels, simplified animations
- **Mobile**: Single column, tap interactions, reduced particle effects

---

## Accessibility Considerations

- **Color Vision**: Patterns + colors for cluster differentiation
- **Keyboard Navigation**: All controls accessible via Tab
- **Screen Readers**: ARIA labels on all interactive elements
- **Motion Sensitivity**: Respect prefers-reduced-motion (show final states instantly)

---

## Images

**No hero images required** - this is a tool/application focused on interactive data visualization. The scatter plot and dendrogram ARE the visual heroes of this experience.