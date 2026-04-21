# Technical Stack & Constraints

## Frontend
- **Framework:** React with Vite (Fast, lightweight, perfect for GitHub Pages).
- **Styling:** Tailwind CSS (Optimized for rapid UI development in Cursor).
- **Icons:** Lucide-React (Clean, Apple-like line icons).

## Backend & Data
- **Hosting:** GitHub Pages (Static Site).
- **Authentication:** Strava OAuth 2.0 (Client-side flow).
- **Persistence:** - **Strava API:** Fetching live gear and activity data.
  - **LocalStorage:** Storing user-defined service intervals and component "install dates" (since these aren't in the Strava API).

## Technical Hurdles to Solve
- **CORS/Proxy:** Since GitHub Pages is static, use a lightweight serverless function (e.g., Vercel or Netlify) or a dedicated OAuth relay if needed for the Strava Client Secret.
- **Distance Conversion:** API returns meters; the app must convert to Miles (or Kilometers based on user preference).

## File Structure
- `/src/components`: UI components (Cards, HealthBars, Buttons).
- `/src/hooks`: Custom hooks for `useStravaData` and `useMaintenanceLogic`.
- `/src/store`: Context or State management for gear status.