# Design System: ZoneYou (Apple Design Language)

## Visual Principles
The app must convey **competency, trust, and clarity**. It should feel like a native iOS/watchOS utility.

## Typography & Color
- **Font:** San Francisco (system-ui), fallback to Inter.
- **Primary Palette:** - Background: System Gray 6 (`#F2F2F7`) or pure white for a clean look.
  - Accent (Zone 2): A vibrant "Apple Green" (`#34C759`) or "Activity Ring Green".
  - Text: High-contrast System Black (`#000000`) and System Gray (`#8E8E93`).
- **Icons:** Use SF Symbols (or Lucide-react equivalent).

## UI Components
- **The "Glass" Card:** Use subtle backdrops with a 1px border (`rgba(255, 255, 255, 0.3)`) and heavy blur for a glassmorphism effect.
- **Squircles:** All containers and buttons must use a high border-radius (at least 20px) to mimic Apple’s hardware and software corners.
- **Input Fields:** Large, centered numeric inputs with a focus on "Fat Finger" accessibility for athletes who might be checking this mid-ride or post-run.
- **Haptic Feedback (Simulated):** Subtle CSS transitions and scale transforms (e.g., `scale(0.98)`) on button clicks.

## Layout
- **Mobile First:** Single column, centered, with generous whitespace (padding: 24px).
- **Responsive:** On desktop, the card should stay centered at a max-width of 450px.