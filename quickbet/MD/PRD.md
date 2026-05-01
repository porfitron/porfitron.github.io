# Product Requirements: Betsie Lite

## 1. Goal
Position Betsie Lite as a backend-less head unit for a user's preferred chat platform (iMessage, SMS, or WhatsApp), providing a friction-free way to create and settle 1-on-1 social bets through a single link. Encourage users to upgrade to the full iOS app for persistent history and global leaderboards.

## 2. Product Positioning
- **What Betsie Lite is:** A share-first, no-account, no-backend control surface for social bets.
- **What chat apps do:** Handle identity, delivery, thread context, notifications, and re-engagement.
- **What Betsie Lite does:** Handle bet composition, link state, challenge acceptance, countdown, and settlement UI.
- **What this means for UX:** Every screen should optimize for "send this into chat now" and "re-open from chat later."

## 3. Core User Flows
### Flow A: The Creator
1. User opens the PWA.
2. User enters: Creator Name, Bet (claim), End Date, and optional Creator Trash Talk.
3. App generates a "Challenge Link" (e.g., `betsie.app/?t=Marathon+Goal&p1=Yes&d=2026-05-01`).
4. Creator follows staged flow labels: **Create -> Confirm -> Invite**.
5. App presents channel-aware share copy that works in iMessage, SMS, or WhatsApp.
6. Primary creator CTAs move from **Next** to **Invite challenger** (or **Send a reminder** after first invite).
7. User shares the link into an existing chat thread.

### Flow B: The Challenger
1. Friend opens the link.
2. Challenger follows staged flow labels: **Accept -> Confirm -> Game On**.
3. Friend sees the bet details and chooses either **Agree with {Creator}** or **Make a different call**.
4. Friend enters Challenger Name, Challenger Position (if custom), and optional Challenger Trash Talk.
5. The URL updates to include the Challenger's state (e.g., `&p2=No` or a custom challenger stance).
6. Primary challenger CTA moves from **Next** to **Confirm and send**, then optionally **Re-share the link to this bet**.
7. Friend shares the updated link back into chat with one tap.

### Flow C: Bet Active and Reminder
1. When the Creator opens the returned link, both positions are locked and the bet is officially "on."
2. App shows a live countdown timer to the End Date.
3. Either player can add the bet to their calendar for reminder coverage.

### Flow D: Settlement and Receipt
1. At End Date (or if called early), either player enters settlement mode.
2. Result is selected via vote outcome:
   - **{Creator} Won!** (or **Both Right!** when both chose the same position)
   - **{Challenger} Won!** (or **Both Wrong!** when both chose the same position)
   - **No contest** via "If no one was right, click here."
3. App generates a shareable online receipt with bet details and outcome.
4. Receipt stage uses **Share result** as the primary outbound CTA.
5. Players share receipt back into chat and may optionally post to social media.

## 4. Key Features
- **URL-Encoded State:** All bet details (title, positions, dates) are parsed from and written to the URL.
- **Channel-Aware Share Copy:** Prebuilt, concise share text that reads naturally in iMessage, SMS, and WhatsApp.
- **Re-open Resilience:** Opening the same link later should restore context with no confusion and no required login.
- **Two-Step Challenge Handshake:** Creator sends invite link, Challenger returns accepted/customized link, then bet becomes active.
- **Countdown Clock:** A real-time visual timer showing hours/minutes/seconds until the bet deadline once both sides have joined.
- **Add to Calendar:** A button to generate an .ics file or Google Calendar link for the bet deadline.
- **Early Call Option:** Either player can call the bet early and move directly into settlement mode.
- **Outcome Voting:** Settlement supports Creator right, Challenger right, Both right, Both wrong, or No contest.
- **Online Receipt:** Settlement generates a shareable receipt page for chat sharing and optional social posting.
- **Results Page:** After deadline or early call, the UI transitions to a settlement flow and receipt state.
- **Implemented Stage Labels:** Creator uses Create/Confirm/Invite; Challenger uses Accept/Confirm/Game On.
- **iOS Upsell:** Persistent banners and "locked" features (History, Profile, Win/Loss Record) that link to the App Store.

## 5. UI/UX Requirements
- **Mobile-First:** Styled to look like a native iOS/Android app.
- **The "Vibe":** Energetic, social, and clean. Use high-contrast buttons and playful typography.
- **Head-Unit Mental Model:** The app should feel like a quick control panel, not a destination social feed.
- **Fast-to-Share:** Primary CTA on all pre-settlement screens should be sharing back into chat.
- **Cross-Channel Clarity:** Copy must avoid platform-specific jargon and still feel native in iMessage/SMS/WhatsApp contexts.
- **Public Visibility:** Bets are public by URL design; no "Discover" feed helps preserve pseudo-privacy.

## 6. Content Guidelines
- Keep microcopy short enough to survive message previews and link unfurls.
- Default to implemented action language where possible: "Next", "Invite challenger", "Confirm and send", "Call the bet early", "Share result".
- Avoid internal product terms (for example, "stateful URL") in user-facing text.
- When possible, generate share text with a clear challenge + deadline + call-to-action pattern.
- Reinforce product loop language in onboarding and end states: "Create, Bet, Repeat."

## 7. Messaging Constraints (Chat-First)
- **Creator invite share format:** `creator claim` + optional `trash talk hook` + link.
- **Default hook when blank:** "Prove me wrong."
- **Do not expose "YES/NO" language in outbound creator invite text.**
- **Character limits (hard):**
  - Creator name: 20
  - Challenger name: 20
  - Claim/position text: 70
  - Trash talk (creator/challenger): 45
  - Challenger custom position text: 70
- **Share copy budget target:** Keep pre-link message text concise (generally <=160 chars) for readability in iMessage/SMS/WhatsApp threads.