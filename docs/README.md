# Hierarchical Clustering — Simple, Visual, Friendly

## Project Overview

This project provides an interactive, animated explainer for Hierarchical Clustering designed to teach the concept to anyone — from non-technical users to family members. The implementation includes:

1. **Animated Video Explainer** - Scene-by-scene animated visualization
2. **Interactive Card Deck** - 5 interactive cards with micro-animations
3. **Documentation** - Scripts, branding guide, and export specifications

## Components

### 1. VideoExplainer Component
Located at: `app/components/VideoExplainer.tsx`

A scene-based video player that displays 7 animated scenes:
- Scene 0: Hook - Messy pile of socks
- Scene 1: Grouping by similarity
- Scene 2: Hierarchical idea (groups inside groups)
- Scene 3: What hierarchical clustering does
- Scene 4: Dendrogram explained
- Scene 5: Real-world examples
- Scene 6: Summary & call to action

**Features:**
- Play/Pause controls
- Scene navigation (Previous/Next)
- Caption toggle
- Audio toggle
- Progress bar
- Scene indicators

### 2. InteractiveCardDeck Component
Located at: `app/components/InteractiveCardDeck.tsx`

A 5-card interactive deck:
- **Card 1:** "What is Clustering?" - Socks analogy with animation
- **Card 2:** "Start with Each Item Alone" - Dots separating animation
- **Card 3:** "Join the Closest" - Merging animation
- **Card 4:** "Build the Tree" - Interactive dendrogram with slider
- **Card 5:** "Real World Examples" - Icons and examples

**Features:**
- Card navigation (Previous/Next)
- Play/Pause audio for each card
- Audio toggle
- Interactive slider on Card 4 to adjust cluster count
- Step indicators
- Smooth animations with framer-motion

### 3. HierarchicalClusteringStory Component
Located at: `app/components/HierarchicalClusteringStory.tsx`

Animated visual stories with relatable examples (party, fruits, books).

## Documentation Files

### Voiceover Script
`docs/voiceover-script.md`
- Complete voiceover script for all scenes
- Simplified caption versions
- Notes for voice actors

### SRT Template
`docs/srt-template.srt`
- Subtitle file template in SRT format
- Timed captions for video export

### Branding Guide
`docs/branding-guide.md`
- Color palette (Deep Teal, Warm Orange, Soft Cream, Dark Charcoal)
- Typography guidelines
- Icon style
- Animation principles
- Accessibility requirements
- Export specifications

## Usage

### Running the Application

```bash
npm run dev
```

Navigate to the home page to see:
1. Hierarchical Clustering Story (animated examples)
2. Video Explainer (scene-based player)
3. Interactive Card Deck (5 cards)

### Customization

#### Colors
Update the color palette in `tailwind.config.js` or use CSS variables:
- Primary (Deep Teal): `#0F6B6B`
- Accent (Warm Orange): `#FF9F43`
- Background (Soft Cream): `#FFF7ED`
- Text (Dark Charcoal): `#222222`

#### Animations
All animations use `framer-motion`. Adjust timing and easing in component files:
- Scene transitions: 0.5s - 1s
- Element animations: 0.3s - 0.8s
- Use spring physics for natural movement

#### Content
Edit scene content in:
- `VideoExplainer.tsx` - Scene data array
- `InteractiveCardDeck.tsx` - Card data array
- `voiceover-script.md` - Voiceover text

## Export & Production

### For Video Production

1. **Record Voiceover**
   - Use the script in `docs/voiceover-script.md`
   - Follow the tone and pace guidelines
   - Export as MP3 (128 kbps)

2. **Create Visuals**
   - Use the scene descriptions in `VideoExplainer.tsx`
   - Follow branding guidelines in `docs/branding-guide.md`
   - Export at 1080p (1920x1080), 24-30 fps

3. **Add Subtitles**
   - Use `docs/srt-template.srt` as a base
   - Adjust timing to match final video
   - Ensure captions are simple (under 10 words per line)

4. **Export Formats**
   - MP4 (H.264) - Primary format
   - WebM - Web-optimized
   - MP3 - Separate audio file
   - SRT - Subtitles

### For Interactive Cards

The `InteractiveCardDeck` component is ready for web deployment. To export as standalone:

1. Build the Next.js application
2. Extract the component and its dependencies
3. Deploy to a static hosting service
4. Or embed as an iframe

## Accessibility Features

- ✅ Large tap targets (minimum 44x44px)
- ✅ High contrast colors
- ✅ Minimum 16px font size
- ✅ Closed captions support
- ✅ Keyboard navigation
- ✅ Screen reader friendly
- ✅ Audio controls
- ✅ Caption toggle

## Localization

### Current Language
- English (simple, plain language)

### Adding New Languages

1. Translate the voiceover script in `docs/voiceover-script.md`
2. Update card content in `InteractiveCardDeck.tsx`
3. Update scene captions in `VideoExplainer.tsx`
4. Record new voiceover with native speaker
5. Update SRT file with translated captions

## Quality Checklist

Before final export, ensure:

- [ ] Captions match audio timing
- [ ] Text is readable on mobile (>=16px)
- [ ] Color contrast passes accessibility (WCAG AA)
- [ ] Interactive slider updates cluster colors correctly
- [ ] All animations are smooth (no jank)
- [ ] Audio controls work properly
- [ ] Navigation is intuitive
- [ ] Content is simple and jargon-free

## Technical Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **UI Components:** Radix UI
- **TypeScript:** Full type safety

## File Structure

```
app/
├── components/
│   ├── VideoExplainer.tsx          # Scene-based video player
│   ├── InteractiveCardDeck.tsx     # 5-card interactive deck
│   ├── HierarchicalClusteringStory.tsx  # Animated stories
│   └── ui/                          # Reusable UI components
├── page.tsx                         # Main landing page
└── ...

docs/
├── README.md                        # This file
├── voiceover-script.md              # Complete voiceover script
├── srt-template.srt                 # Subtitle template
└── branding-guide.md                # Branding & style guide
```

## Support & Feedback

For questions or improvements, refer to the project documentation or create an issue in the [repository](https://github.com/Dharmikgalla/DHV-final).

---

**Note:** The video export functionality requires external tools (e.g., After Effects, Premiere Pro, or similar). The components provided serve as interactive references and can be used to create the final video assets.

