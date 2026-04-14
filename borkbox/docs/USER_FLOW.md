# User Flow: BorkBox

## 1. Entry Point
- User lands on `/`.
- Check `localStorage` for `completedOnboarding`.
- If false, show **Splash Screen Overlay**.

## 2. The Unlock (Splash Screen)
- "Start Training" Button.
- **On Click:** 1. Initialize `Howl` / `AudioContext`.
  2. Request `wakeLock`.
  3. Hide Splash Screen.
  4. Play "Calibration Chime" at 10% volume.

## 3. Training Mode
- User selects a sound.
- If it's a **Command**: Play once, trigger vibration.
- If it's a **Distraction**: Toggle loop on/off, show visual progress ring.

## 4. Settings/About
- User taps `(i)` icon.
- Slide-over panel displays.
- Options to toggle Dark/Light mode and clear `localStorage`.