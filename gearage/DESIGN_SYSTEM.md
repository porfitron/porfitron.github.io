# Design System: Apple Human Interface Guidelines (HIG)

## Visual Language
- **Typography:** Use `San Francisco` (system-ui) as the primary font.
- **Corner Radius:** 12px to 16px for cards and containers (Apple-standard rounded corners).
- **Colors:**
  - Background: `#F2F2F7` (iOS Light Gray System Background).
  - Secondary Background: `#FFFFFF` (White cards).
  - Accents: Strava Orange (`#FC4C02`) for branding; iOS System Blue (`#007AFF`) for actions.
  - Status: Green (Safe), Yellow (Warning), Red (Critical Service).

## UI Components
- **The "Glass" Look:** Use `backdrop-filter: blur()` for navigation headers.
- **Cards:** Subtle borders (`1px solid rgba(0,0,0,0.05)`) and soft shadows rather than heavy outlines.
- **Haptics:** Ensure buttons look "tappable" with a clear active/pressed state.

## Mobile Layout
- Bottom navigation bar (Tab Bar) for "Dashboard", "Garage", "Closet", and "Settings".
- "Safe Area" padding to account for iPhone notches and home indicators.