# Product Requirements Document: ZoneYou

## Vision
ZoneYou is a premium, minimalist web application designed for aspiring runners and cyclists to calculate their physiological Zone 2 training range with precision. It replaces generic "220-age" formulas with the Karvonen Method, establishing immediate trust through scientific accuracy and a "pro" user experience.

## Target Audience
- Aspiring athletes and "weekend warriors" (gravel cyclists, marathon trainers).
- Users who value data accuracy and professional-grade fitness tools.
- Fans of the Apple Health/Fitness ecosystem who expect a "native" feel.

## Core Features
1. **The Precision Calculator:** A tiered input system.
   - **Tier 1 (Resting Heart Rate):** Users input their waking RHR.
   - **Tier 2 (Max Heart Rate):** Users can either input a known MHR (from a stress test) or use an advanced age-based estimate (HUNT Formula).
2. **Dynamic Results:** Real-time calculation of the 60%–70% Karvonen range.
3. **The "Talk Test" Validator:** A contextual UI element explaining how the numbers should feel (e.g., "You should be able to speak in full sentences").
4. **Export/Save:** Ability to save the result as a clean image or copy to clipboard for use in training apps (Strava, Garmin, TrainingPeaks).

## Logic & Formulas (Gold Standard)
- **Heart Rate Reserve (HRR):** `MHR - RHR`
- **Zone 2 Floor (60%):** `(HRR * 0.60) + RHR`
- **Zone 2 Ceiling (70%):** `(HRR * 0.70) + RHR`
- **HUNT Formula (Default MHR):** `211 - (0.64 * Age)`