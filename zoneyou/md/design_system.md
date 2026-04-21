# Design System: ZoneYou (Apple Design Language)

## Visual Principles
The app must convey **competency, trust, and clarity**. It should feel like a native iOS/watchOS utility.

## Product Messaging Principles
- Lead with outcome: "Know your Zone 2. Act on it today."
- Keep language coach-like and non-judgmental.
- Explain recommendations in one sentence, then provide one clear action.
- Reinforce that tips are optional ways to improve data quality, not required purchases.

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

## Onboarding UX Pattern
- Use a 4-6 screen progressive onboarding flow with a top progress indicator.
- Keep each screen focused on one decision:
  1. Value proposition.
  2. Input data collection.
  3. Zone2ForYou result reveal.
  4. Next action (exercise + playlist link).
  5. Accountability (save/share).
  6. Optional measurement improvement tip.
- Use plain-language microcopy and avoid dense metric-heavy paragraphs.

## CTA Hierarchy
- **Primary CTA:** "See My Zone2ForYou Result" or "Start Workout Plan".
- **Secondary CTA:** "Save Plan" and "Share Plan".
- **Tertiary CTA:** "Improve Accuracy" (links to heart rate monitor or cadence sensor recommendations).
- Use visual separation so tip links never compete with core fitness actions.

## Accountability Experience Guidelines
- "Save" should feel private and progress-oriented (for later review).
- "Share" should emphasize encouragement and support, not competition.
- Display a lightweight confirmation state after save/share to reinforce commitment.

## Commerce and Trust Guidelines
- Clearly label product links as recommendations.
- Pair each recommendation with a short "why this helps" note.
- Avoid aggressive upsell patterns (popups, countdowns, modal traps).
- Preserve brand trust by keeping commerce moments contextual and optional.

## Layout
- **Mobile First:** Single column, centered, with generous whitespace (padding: 24px).
- **Responsive:** On desktop, the card should stay centered at a max-width of 450px.