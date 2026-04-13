# Technical Specification: BorkBox

## Stack
- **Framework:** Next.js (App Router) or Vite + React.
- **Styling:** Tailwind CSS (for rapid utility-first UI).
- **Audio Engine:** `Howler.js` (Wraps Web Audio API for low-latency and mobile "unlock" handling).
- **Icons:** Lucide React (for UI elements).

## Critical APIs & Implementation Rules
1. **Web Audio API (via Howler):** Must use `html5: false` to force Web Audio for sub-millisecond precision.
2. **Screen Wake Lock API:** Prevent the phone from sleeping during active training sessions.
3. **localStorage:** Store a `settings` object: `{ theme: 'light' | 'dark', volume: number, completedOnboarding: boolean }`.
4. **Haptic Feedback:** Use `navigator.vibrate(50)` on Command Zone taps.
5. **Safe Area CSS:** Use `env(safe-area-inset-bottom)` to ensure the IAB banner and buttons aren't cut off by notches or home bars.

## Mobile Safari Workarounds
- Audio context must be resumed on the first user interaction (The Splash Screen).
- Include a UI reminder about the physical "Silent/Mute" switch on iPhones.