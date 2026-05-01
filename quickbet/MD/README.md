# Betsie Lite (PWA)

Betsie Lite is a lightweight, backend-less head unit for the messaging app people already use, whether that is iMessage, SMS, or WhatsApp. It helps users compose, share, and settle quick 1-on-1 bets through URL-based state management, without creating an account.

## Technical Philosophy
- **Backend-less by Design:** Bet data is stored in URL query parameters; no backend database or user accounts for the Lite experience.
- **Chat-Native Head Unit:** The web app is the control panel, while the user's preferred chat app is the transport and context layer.
- **PWA First:** Built with vanilla HTML, CSS, and JS, installable to the home screen with offline-ready properties.
- **Share Loop:** Optimize the implemented loop: `Create -> Confirm -> Invite -> Accept -> Confirm -> Game On -> Vote/Settle -> Share result`.
- **Stage-First UX:** Preserve visible breadcrumb labels exactly as implemented (`Create/Confirm/Invite` for Creator and `Accept/Confirm/Game On` for Challenger).

## Docs

- **[MEASUREMENT.md](MEASUREMENT.md)** — GA4 events, milestone definitions, and how to build segments and funnels in Google Analytics 4.

## Tech Stack
- HTML5 / CSS3 (Modern Flexbox/Grid)
- Vanilla JavaScript (ES6+)
- Web Manifest & Service Workers for PWA functionality
- Lucide-style SVG icons for a native feel