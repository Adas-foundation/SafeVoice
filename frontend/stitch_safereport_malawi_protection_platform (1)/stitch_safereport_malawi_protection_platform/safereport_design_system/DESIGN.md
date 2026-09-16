---
name: SafeReport Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#444651'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#006a63'
  on-secondary: '#ffffff'
  secondary-container: '#99efe5'
  on-secondary-container: '#006f67'
  tertiary: '#382700'
  on-tertiary: '#ffffff'
  tertiary-container: '#533c00'
  on-tertiary-container: '#d8a31b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#9cf2e8'
  secondary-fixed-dim: '#80d5cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#00504a'
  tertiary-fixed: '#ffdfa0'
  tertiary-fixed-dim: '#f6be39'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-lg:
    fontFamily: Poppins
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Poppins
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Poppins
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The brand identity is rooted in the concepts of **Stability, Protection, and Compassion**. As a government initiative for the Adas Foundation, the visual language must command authority while remaining highly accessible to citizens in distress. 

The design style is **Corporate / Modern**, characterized by a refined balance of institutional rigor and human-centric warmth. We utilize generous white space to reduce cognitive load during high-stress reporting scenarios, ensuring the interface feels calm and orderly. The Adas Foundation coat of arms serves as the ultimate anchor of legitimacy, positioned prominently to instill confidence and verify the platform's official status.

## Colors

The palette is designed for institutional trust and clarity. 

- **Primary Royal Blue** is used for critical navigational elements and primary action buttons, representing the strength of the State. 
- **Secondary Teal** provides a softer, more approachable alternative for secondary actions and supportive interface elements.
- **Warm Gold** is used sparingly as an accent for high-importance highlights or heritage-related elements, echoing the sun in the national coat of arms.
- **Protection Green** is specifically reserved for success states and "safe areas," signaling that a user's information is secured.
- **Background & Text:** A very light grey background (#F9FAFB) provides a clean canvas that minimizes glare, while a deep charcoal text (#1F2937) ensures optimal legibility and contrast.

## Typography

The typography strategy pairs **Poppins** for structural headings with **Inter** for functional content. 

- **Poppins** (Headings): Its geometric clarity and friendly curves make it approachable yet professional. Use Bold for Display and Semibold for Headlines to establish a clear hierarchy.
- **Inter** (Body & UI): Selected for its exceptional legibility at small sizes and its neutral, systematic feel. It handles data-heavy reporting forms with precision.
- **Safety first:** Maintain a minimum body size of 16px to ensure accessibility across all age groups and visual abilities. Use increased line-height (1.5x) for long-form guidance text to improve readability.

## Layout & Spacing

This design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile devices. 

- **The 8px Rule:** All spacing and layout dimensions are increments of 8px (8, 16, 24, 32, 48, 64). This ensures visual harmony and a consistent rhythm.
- **Generous Margins:** Content is contained within wide margins to prevent the UI from feeling "cramped," which can increase user anxiety during report filing.
- **Mobile-First Flow:** Forms should occupy the full width on mobile devices, using `stack-md` (16px) vertical spacing between input groups to maintain touch-target integrity.

## Elevation & Depth

To maintain a "Premium Government" feel, depth is conveyed through **Tonal Layers** and **Ambient Shadows** rather than heavy gradients.

1.  **Level 0 (Base):** The #F9FAFB background.
2.  **Level 1 (Cards):** White surfaces (#FFFFFF) with a subtle, highly diffused shadow (Offset: 0, 4px; Blur: 12px; Color: rgba(30, 58, 138, 0.05)).
3.  **Level 2 (Interaction):** Active elements or hovered cards use a slightly more pronounced shadow and a 1px border in a pale Primary Blue tint to indicate focus.

We avoid "floating" elements unless they are critical overlays (e.g., modals or urgent alerts), as the interface should feel grounded and stable.

## Shapes

The shape language is defined by **significant roundedness** to evoke a sense of safety and friendliness. 

- **Base Radius:** 16px (1rem) for primary cards and main input containers.
- **Component Radius:** 12px (0.75rem) for buttons and smaller UI components.
- **Buttons:** Primary action buttons use the standard 12px radius, but may be pill-shaped (3) in specific mobile "Quick Exit" or "Call Help" scenarios to make them stand out as distinct physical objects.

## Components

### Buttons
- **Primary:** Solid Royal Blue (#1E3A8A) with white text. High-contrast, bold, used for "Submit Report" or "Continue."
- **Secondary:** Outline Teal (#0F766E) with 1.5px border. Used for "Save Draft" or "Go Back."
- **Urgent (Quick Exit):** A high-visibility button in Warm Gold or Solid Red, always fixed to the top or bottom right for immediate safety.

### Input Fields
- Fields use a white background with a 1px border (#D1D5DB).
- **Focus State:** 2px solid Royal Blue border with a soft blue outer glow.
- **Labels:** Always placed above the field in Inter Semibold (#1F2937).

### Cards
- White background, 16px rounded corners, and Level 1 elevation.
- Used to group related form sections (e.g., "Incident Details," "Contact Information").

### Status Chips
- **Success/Safe:** Green background (10% opacity) with Green text.
- **Warning/Pending:** Gold background (10% opacity) with Gold text.
- **Danger/Urgent:** Red background (10% opacity) with Red text.

### Ministry Header
- A clean, white top bar containing the Adas Foundation Coat of Arms on the left. The text "Adas Foundation" should be in Poppins Semibold, 14px, next to the crest.