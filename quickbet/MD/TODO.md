# Implementation Roadmap: Betsie Lite

## Phase 1: Core Architecture 🏗️
- [ ] Create `index.html` structure with views for: Creator, Challenger, and Active Bet.
- [ ] Implement `app.js` to parse URL query parameters on load.
- [ ] Create a utility to generate new URLs based on form inputs.
- [ ] Define a canonical "head unit" information architecture: Compose, Review, Share, Accept, Settle.

## Phase 2: The Bet Experience ⏱️
- [ ] Build the "Create Bet" form (Title, Deadline Picker, Position).
- [ ] Build the "Active Bet" dashboard with the Countdown Timer logic.
- [ ] Implement "Add to Calendar" functionality.
- [ ] Add the "Share" API integration to trigger native mobile sharing sheets.
- [ ] Add channel-aware default share copy variants for iMessage, SMS, and WhatsApp tones/length.
- [ ] Implement re-open handling so links restore user context clearly after returning from chat.
- [ ] Enforce chat-first field character limits (name 20, claim 70, trash talk 45).
- [ ] Add creator invite message composition logic: claim + optional hook + URL.
- [ ] Add live character counters on share-critical fields.

## Phase 3: Results & Fanfare 🎊
- [ ] Create a "Deadline Expired" state logic.
- [ ] Add a basic confetti animation (using a lightweight JS library or CSS particles).
- [ ] Implement the "Declare Winner" UI for the settlement phase.
- [ ] Ensure settlement copy is concise and easy to repost into existing threads.

## Phase 4: PWA & Polish ✨
- [ ] Add `manifest.json` for "Add to Home Screen" support.
- [ ] Register a simple Service Worker for offline caching of assets.
- [ ] Style the "Upsell" components for the iOS app.
- [ ] Final CSS pass for responsive mobile layouts and "app-like" feel.
- [ ] Run UX/content audit specifically against the "backend-less chat head unit" positioning.