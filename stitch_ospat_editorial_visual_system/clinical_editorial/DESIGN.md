---
name: Clinical Editorial
colors:
  surface: '#f9f9f6'
  surface-dim: '#dadad7'
  surface-bright: '#f9f9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f1'
  surface-container: '#eeeeeb'
  surface-container-high: '#e8e8e5'
  surface-container-highest: '#e2e3e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#3d4947'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f1f1ee'
  outline: '#6d7a77'
  outline-variant: '#bcc9c7'
  surface-tint: '#006a63'
  primary: '#006861'
  on-primary: '#ffffff'
  primary-container: '#00837a'
  on-primary-container: '#f3fffc'
  inverse-primary: '#65d9cd'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e1'
  on-secondary-container: '#656464'
  tertiary: '#934624'
  on-tertiary: '#ffffff'
  tertiary-container: '#b25d3a'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#83f5ea'
  primary-fixed-dim: '#65d9cd'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504a'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb599'
  on-tertiary-fixed: '#370e00'
  on-tertiary-fixed-variant: '#783111'
  background: '#f9f9f6'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e0'
  mint-surface: '#DDF5F0'
  blue-surface: '#EAF3FF'
  lavender-surface: '#F1EEFF'
  amber-accent: '#F4B740'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 96px
    fontWeight: '700'
    lineHeight: 104px
    letterSpacing: -0.04em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-section:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-section-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  body-xl:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '400'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  margin-page: 64px
  margin-mobile: 24px
  gutter: 32px
  section-gap: 128px
---

## Brand & Style
The design system is built for high-level healthcare decision-makers, emphasizing intelligence through an "Editorial Healthcare Storytelling" aesthetic. The goal is to transform complex clinical data into a calm, authoritative narrative.

The style is **Premium Minimalism**, characterized by:
- **Generous Whitespace:** Prioritizing focus and mental clarity over data density.
- **Typographic Hierarchy:** Using scale and weight rather than containers to define structure.
- **Asymmetric Layouts:** Creating a sophisticated, non-templated feel inspired by modern editorial design.
- **Calm Authority:** A professional yet approachable tone that feels like a high-end medical journal rather than a cluttered software dashboard.

## Colors
The palette is grounded in a warm, off-white base (#F8F8F5) to reduce eye strain and provide a more "paper-like" editorial feel compared to stark digital white. 

- **Primary Teal:** Used for core actions, success states, and key data highlights.
- **Primary Text:** A near-black (#111111) used for high-contrast legibility.
- **Supporting Pastels:** These are intended for large-surface subtle background washes or categorized data indicators (e.g., lavender for policy, blue for treatment, amber for warnings).
- **Chrome:** Minimize the use of grey; instead, use transparency or darker shades of the background color for borders.

## Typography
Inter is used with tight letter-spacing for large headlines to create a customized, premium appearance. 

- **Scale:** Use dramatic scale shifts (e.g., a massive Hero vs. a small Label) to create hierarchy without needing borders or boxes.
- **Treatment:** Display and Headline styles should be set with negative letter-spacing. Labels should be uppercase with generous tracking to provide a technical, metadata-driven feel.
- **Readability:** Body text is oversized (18-22px) to ensure a comfortable, long-form reading experience for complex policy documents.

## Layout & Spacing
This design system utilizes a **Fixed Grid** for desktop (1440px max-width) and a **Fluid Grid** for smaller devices. 

- **Asymmetry:** Group content into 12-column layouts where visual assets or "Hero" stats span 7-8 columns, and supporting narrative spans 4 columns.
- **Whitespace:** Use "Section Gaps" (128px+) to separate distinct clinical concepts, preventing the UI from feeling like a dashboard.
- **Padding:** Elements should never feel "contained." Use generous internal padding within functional groups to maintain the breathable, editorial aesthetic.

## Elevation & Depth
In alignment with the "No Card" philosophy, depth is achieved through **Tonal Layers** and **Backdrop Blurs**.

- **Surfaces:** Use the Supporting Pastel colors to create full-bleed background sections that distinguish content areas.
- **Glassmorphism:** For navigation bars or floating action panels, use a high-saturation backdrop blur (60px+) with the background color at 80% opacity.
- **Outlines:** Use very thin (1px) low-contrast outlines (#000000 at 5-10% opacity) for input fields or interactive zones. Avoid heavy drop shadows.

## Shapes
Shapes are "Rounded" (0.5rem) to maintain a soft, human-centric feel while remaining professional.

- **Interaction Zones:** Buttons and inputs should follow the standard roundedness.
- **Large Imagery:** Visual moments or data visualizations should use `rounded-xl` (1.5rem) to feel like modern, integrated components rather than sharp-edged photos.

## Components
- **Buttons:** Large, pill-like forms. Primary buttons use #079B91 with white text. Secondary buttons are "Ghost" style with an outline and no fill.
- **Cards (The "Non-Card"):** Instead of traditional boxed cards, use vertical dividers or subtle background color shifts to group data.
- **Input Fields:** Minimalist. Only a bottom border (2px) that transforms into a full subtle outline on focus.
- **Lists:** Use wide spacing between rows with thin horizontal dividers. No vertical borders.
- **Data Visualizations:** Use the secondary pastel colors for charts. Lines should be thick (3px+) and smooth.
- **Motion:** All transitions should use a `cubic-bezier(0.2, 0.8, 0.2, 1)` curve for a "slow-to-start, smooth-to-finish" feel. Count-up animations for clinical metrics should be subtle and staggered.