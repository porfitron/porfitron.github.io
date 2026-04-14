# Product Requirements Document: BorkBox

## Project Overview
**BorkBox** is a mobile-first web application designed for dog owners and trainers. It serves as a high-performance soundboard to assist in dog training through positive reinforcement (commands) and desensitization (distractions).

## Core Objectives
1. **Low Latency:** Sound must play instantly upon tap to ensure effective behavior marking.
2. **One-Handed Utility:** Designed for "Thumb Zone" ergonomics while the user holds a leash or treats.
3. **No-Friction Access:** No accounts required. Settings are saved locally.
4. **Resilience:** Must work reliably on mobile Safari (iOS) and handle "Silent Switch" constraints.

## Target Features
- **Splash Screen:** A required "unlock" screen to initialize audio and screen wake lock.
- **Acclimation Zone:** Looping background sounds (Doorbell, Barks, Fireworks) for desensitization.
- **Command Zone:** High-contrast, large buttons for instant sounds (Clicker, Whistle, Buzzer).
- **Persistence:** User settings (theme, last used pack) saved via `localStorage`.
- **Monetization:** Standard IAB 320x50 banner at the footer.
- **Information:** "About BorkBox" slide-over panel for credits and legal.