# Technical Specification

## Product Vision
Zone2ForYou helps users discover their personal Zone 2 overlap and immediately convert insight into action. The experience should feel precise, motivating, and low-friction from first visit through repeated weekly use.

## Core Objectives
1. **Calculate Zone2ForYou results:** Determine each user's overlapping Zone 2 heart rate range with confidence-building explanations.
2. **Recommend next actions:** Turn the personalized range into an immediate workout choice by linking to BPM-matched playlists and exercise suggestions.
3. **Create accountability loops:** Let users save or share their results and plan with a friend, coach, or accountability partner.

## Business Model (Trust-First Tips)
- Monetization is based on optional improvement tips, not paywalls.
- Present contextual tips on better measurement quality:
  - Heart rate monitor recommendation (Amazon affiliate link).
  - Cadence sensor recommendation (Amazon affiliate link).
- Tip placements should feel advisory and relevant to user intent (after results and before share/save), never intrusive.

## Onboarding Flow (V1)
1. **Welcome + Value Proposition**
   - Message: "Find your personal Zone 2 range in under 60 seconds."
2. **Data Input**
   - Collect Age, Resting Heart Rate (RHR), and optional Max Heart Rate (MHR).
3. **Zone2ForYou Result**
   - Display overlap range prominently with plain-language interpretation.
4. **Next Best Action**
   - Provide one-click route to a recommended exercise option and BPM-matched workout playlist link.
5. **Accountability Step**
   - Offer "Save Plan" and "Share Plan" actions.
6. **Measurement Improvement Tips**
   - Present optional monitor/sensor suggestions with concise rationale.

## Stack Recommendation
- **Framework:** Next.js (App Router) or Vite + React.
- **Styling:** Tailwind CSS.
- **Icons:** Lucide-React.
- **Animation:** Framer Motion (for smooth layout transitions between steps).

## State Management
Use `useState` for:
- `age` (number)
- `rhr` (number)
- `mhr` (number | null)
- `calculationMethod` ('karvonen' | 'hunt')

## Component Structure
1. `Header.tsx`: Minimalist logo (ZoneYou) and an info icon that opens a "Why Zone 2?" modal.
2. `OnboardingFlow.tsx`: Lightweight, swipe-friendly onboarding sequence with progress indicator.
3. `CalculatorForm.tsx`: Step-by-step or single-page input for Age, RHR, and MHR.
4. `ResultsDisplay.tsx`: Large, bold display of the Zone2ForYou overlap range (e.g., "128 – 142 BPM").
5. `NextActionPanel.tsx`: Exercise recommendation and BPM-matched playlist CTA.
6. `AccountabilityPanel.tsx`: "Save Plan" and "Share Plan" actions.
7. `TipsPanel.tsx`: Contextual product recommendations (heart rate monitor and cadence sensor links).
8. `ActionButtons.tsx`: "Recalculate", "Save", and "Share" buttons.

## Data Model (MVP)
- `userInputs`: `{ age, rhr, mhr, calculationMethod }`
- `zone2Result`: `{ lowerBpm, upperBpm, confidenceNote }`
- `recommendedAction`: `{ activityType, durationMin, playlistUrl, bpmBand }`
- `accountability`: `{ savedAt, sharedWith, shareChannel }`
- `tipsEngagement`: `{ tipType, clickedAt, destinationUrl }`

## Success Metrics
- **Activation:** % of users who complete onboarding and calculate Zone2ForYou result.
- **Action Adoption:** % of result viewers who open a recommended workout playlist.
- **Accountability Adoption:** % of users who save or share a plan.
- **Tip CTR:** % of users engaging with monitor/sensor recommendations.

## Precision Implementation Note
When calculating, ensure the numbers are rounded to the nearest integer. Add a disclaimer: *"This is a physiological estimate. Consult a professional for clinical stress testing."*