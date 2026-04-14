# Technical Specification: BorkBox

## Stack (shipped)
- **App shell:** Static `index.html` + vanilla `app.js` (no bundler).
- **Styling:** Tailwind CSS via CDN (`index.html`).
- **Audio:** `Howler.js` from `vendor/howler.min.js` (Web Audio / mobile unlock).
- **Icons:** Inline SVG in `index.html`.

## Critical APIs & Implementation Rules
1. **Web Audio API (via Howler):** Must use `html5: false` to force Web Audio for sub-millisecond precision.
2. **Screen Wake Lock API:** Prevent the phone from sleeping during active training sessions.
3. **localStorage:** Store a `settings` object: `{ theme: 'light' | 'dark', volume: number, completedOnboarding: boolean }`.
4. **Haptic Feedback:** Use `navigator.vibrate(50)` on Command Zone taps.
5. **Safe Area CSS:** Use `env(safe-area-inset-bottom)` to ensure the IAB banner and buttons aren't cut off by notches or home bars.

## Mobile Safari Workarounds
- Audio context must be resumed on the first user interaction (The Splash Screen).
- Include a UI reminder about the physical "Silent/Mute" switch on iPhones.