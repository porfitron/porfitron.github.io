# Product Requirements Document: GearCheck (Working Title)

## Overview
GearCheck is a mobile-first web application for cyclists and runners who use Strava. It solves the "hidden gear" problem in the Strava mobile app by surfacing bikes and shoes in a "Garage" and "Closet" interface, providing proactive maintenance recommendations based on real-time mileage.

## Target Audience
- **Cyclists:** High-performance riders (e.g., gravel/road) who need to track drivetrain and tire wear.
- **Runners:** Athletes tracking shoe midsole compression and replacement cycles.

## Core Features
### 1. The Garage (Bikes)
- List all bikes synced from Strava Gear API.
- Surface `brand_name`, `model_name`, and total `distance`.
- **Logic:** Visual "health bars" for components (Tires, Chain, Bottom Bracket) based on distance thresholds.

### 2. The Closet (Shoes)
- List all running shoes synced from Strava Gear API.
- **Logic:** 300-mile "Mid-life" check and 500-mile "Replacement" alert.
- High-contrast cards showing "Miles Remaining" before recommended retirement.

### 3. Smart Recommendations
- Dynamic text based on mileage:
  - *Example (Bike @ 2,000mi):* "Time to inspect your bottom bracket and bleed your brakes."
  - *Example (Shoe @ 400mi):* "Midsole compression detected. Consider rotating in a new pair."

## User Flow
1. **OAuth:** User authenticates via Strava.
2. **Dashboard:** Unified view of the "Primary" bike and "Primary" shoes.
3. **Detail View:** Deep dive into specific gear with a "Service Log" (local storage) for components like tires.

## Future Portability
- The app must be built with a "Native Feel" (Apple HIG) to allow for easy wrapping in Capacitor or Cordva for an iOS App Store release.