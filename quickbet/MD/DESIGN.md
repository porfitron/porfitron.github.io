# Visual Design Guide: Betsie Lite

This document outlines the design system for the Betsie Lite PWA. The goal is to create a high-energy, social, and intuitive interface that behaves like a backend-less head unit for chat platforms while remaining lightweight for web performance.

## 0. Experience North Star
- Betsie Lite is the control surface; iMessage, SMS, and WhatsApp are the conversation surface.
- Design for "in and out" usage: users should complete key actions in seconds, then return to chat.
- Prioritize one dominant action per screen, usually "Share" or "Accept."
- Preserve implemented progress stage labels in UI: Creator (`Create -> Confirm -> Invite`) and Challenger (`Accept -> Confirm -> Game On`).

## 1. Brand Persona
- **Friendly & Social:** Accessible, welcoming, and built for interaction.
- **Vibrant:** High-energy colors that signal action and excitement.
- **Modern & Clean:** Minimalist layouts with plenty of white space and rounded geometry.
- **Utility-Forward:** Feels fast and purposeful, like a companion tool rather than a full social destination.

## 2. Color Palette
The primary brand identity is built around a signature coral-red that drives action and visibility.

| Role | Color | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Betsie Coral | `#F36D6F` | Primary buttons, active state, accents. |
| **Background** | Canvas White | `#FFFFFF` | Main application background. |
| **Surface** | Light Gray | `#F8F9FA` | Cards, input fields, and subtle sections. |
| **Text (Primary)** | Deep Onyx | `#1A1A1A` | Headlines and body copy. |
| **Text (Secondary)** | Slate | `#6B7280` | Labels, captions, and secondary info. |
| **Success** | Emerald | `#10B981` | Winning predictions and "Yes" positions. |
| **Error/Danger** | Ruby | `#EF4444` | Expired bets or "No" positions. |

## 3. Typography
The typography uses humanist sans-serif typefaces to balance readability with a friendly, modern tone.

- **Primary Font Stack:** `Circular`, `Avenir`, `Gotham`, or `Poppins`.
- **System Fallback:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;`
- **Scale:**
  - **H1 (Hero Title):** 24px-28px, Bold, Tight Letter-spacing.
  - **H2 (Card Headers):** 18px, Semi-Bold.
  - **Body:** 16px, Regular.
  - **Caption/Micro:** 12px, Medium (Uppercase for labels).

## 4. UI Components
### Cards & Containers
- **Border Radius:** `16px` or `24px` for a "soft" mobile feel.
- **Shadows:** Subtle, soft blurs (e.g., `0 4px 12px rgba(0,0,0,0.05)`) to create depth without clutter.
- **Density:** Keep vertical rhythm tight enough that key info and primary CTA fit above the fold on most phones.

### Buttons
- **Primary:** Full width (on mobile), `#F36D6F` background, white text, bold, `12px` padding.
- **Secondary:** Transparent with `#F36D6F` border or light gray background.
- **States:** Hover/Active states should involve a slight scale-down (`transform: scale(0.98)`) to mimic native button haptics.
- **Hierarchy:** Exactly one primary action per view; defer low-priority actions to secondary or text buttons.

### Form Inputs
- Rounded corners (`12px`).
- High-contrast focus states using the Primary Coral.
- Keep labels and helper text concise so content remains scannable when opened from chat links.

## 5. Visual Language & Iconography
- **Icons:** Use Lucide or Feather Icons (2px stroke weight) for a clean, wireframe-style look.
- **Avatars:** Circular placeholders. Since the Lite version doesn't have profiles, use vibrant color-coded initials for the Creator and Challenger.
- **Fanfare:** Use the `canvas-confetti` library for a celebratory burst of `#F36D6F`, `#FFD700`, and `#10B981` particles when a bet is settled.
- **Share Affordance:** Use recognizable send/share metaphors to reinforce that users will continue interaction in chat.

## 6. PWA & Mobile Optimization
- **SafeArea:** Ensure content respects the notch and home bar on iOS devices.
- **Touch Targets:** Minimum `44px x 44px` for all interactive elements.
- **No-Selection:** Use `user-select: none;` on buttons and UI elements to prevent accidental text highlighting during fast interaction.
- **Deep-Link Recovery:** Returning from chat should land users in a stable, familiar state with obvious next action.

## 7. Content Design Rules
- Use direct, conversational microcopy that reads naturally when shared in a message thread.
- Use implemented CTA language for consistency: "Start a quick bet", "Next", "Invite challenger", "Send a reminder", "Confirm and send", "Call the bet early", "Share result", "Start new bet".
- Avoid long explanations in-view; keep explanatory text behind optional disclosure patterns when needed.
- For creator invite copy, prefer statement-first phrasing (claim + optional hook) rather than "YES/NO" framing.
- In challenger choice copy, use implemented labels: "Agree with {Creator}" and "Make a different call."

## 8. Stage and Outcome Language
- **Creator staged journey:** `Create` (input form) -> `Confirm` (review state) -> `Invite` (share handoff).
- **Challenger staged journey:** `Accept` (response form) -> `Confirm` (share confirmation) -> `Game On` (returned-link state).
- **Voting labels in active state:** `{Creator} Won!`, `{Challenger} Won!`, and same-position variants `Both Right!` / `Both Wrong!`.
- **No contest path:** secondary inline action copy: "If no one was right, click here."
- **Receipt language:** use "Bet Receipt" heading and "Share result" as primary settlement CTA.

## 9. Input Limits and Composition
- Enforce strict field lengths to protect message readability in chat apps:
  - Name fields: `20`
  - Claim/position fields: `70`
  - Trash talk fields: `45`
- Show inline character counters on share-critical fields.
- Use one-line inputs for share-critical text (no multiline content).
- Creator invite message should be composed as:
  - Line 1: Creator claim
  - Line 2: Optional creator trash talk (fallback: "Prove me wrong.")
  - Line 3: Share URL