# Technical Specification

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
2. `CalculatorForm.tsx`: Step-by-step or single-page input for Age, RHR, and MHR.
3. `ResultsDisplay.tsx`: Large, bold display of the calculated range (e.g., "128 – 142 BPM").
4. `ActionButtons.tsx`: "Recalculate" and "Share" buttons.

## Precision Implementation Note
When calculating, ensure the numbers are rounded to the nearest integer. Add a disclaimer: *"This is a physiological estimate. Consult a professional for clinical stress testing."*