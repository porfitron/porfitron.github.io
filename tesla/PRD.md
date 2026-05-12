# Product Requirements Document: Tesla Browser Start Page

**Document:** `PRD.md`  
**Product:** Custom home / start page for the in-car Tesla web browser  
**Primary artifact:** `index.html` (static site, deployable via GitHub Pages or similar)  
**Owner:** @porfitron  

---

## 1. Summary

This product is a **start page** (home screen) optimized for the Tesla vehicle web browser. It gives the **driver** and **passenger** fast, low-friction access to curated web apps and information—whether the vehicle is **in motion** (passenger use or brief glance-friendly utilities) or **stationary** (e.g. Supercharging, waiting in the car).

The page should feel native to the in-car context: large touch targets, readable typography on a wide dashboard display, and a layout that works without relying on hover or fine pointer precision.

---

## 2. Problem Statement

The default browser experience in a car is not tuned for:

- **Touch-first** interaction at arm’s length on a large screen  
- **Short sessions**: open one bookmark, search, or app and go  
- **Mixed intent**: entertainment while parked vs. quick reference while moving  

This start page addresses that gap by aggregating **search**, **high-value tiles** (games, media, news, weather), **optional weather location** (saved in the browser), and **clear branding** in one screen the user can set as their browser home URL.

---

## 3. Goals

| Goal | Description |
|------|-------------|
| **G1 — Fast access** | User reaches common web destinations in one tap from the home screen. |
| **G2 — Discoverability** | New or occasional users immediately understand: search at top, apps below. |
| **G3 — In-car fit** | Layout and controls work on Tesla’s browser viewport and input model (touch, no hover dependency). |
| **G4 — Context flexibility** | Experience remains useful when **driving** (passenger / quick utility) and when **charging or parked** (longer engagement). |

### Non-goals (current scope)

- Replacing Tesla’s native UI or navigation apps  
- Hosting third-party content inline (tiles deep-link to external sites)  
- User accounts, sync across devices, or personalized tile layouts (unless added in a future phase)  

---

## 4. Target Users & Scenarios

### 4.1 Primary users

- **Driver** — May set home URL; may use browser when safe and legal; often prefers minimal distraction.  
- **Front passenger** — Primary consumer of browser entertainment and reading while the vehicle is moving.  
- **Anyone in the vehicle while charging** — Longer sessions; games, video-capable sites, news, weather.

### 4.2 Key scenarios

1. **Parked / charging:** Open theater or game tile, browse news, check weather for destination.  
2. **Moving:** Passenger opens a tile; driver might use voice-first systems for nav—browser used sparingly; page should still be readable at a glance.  
3. **First visit:** User sees Tesla-affiliated branding, search, and tiles; may be prompted to **set weather location** or choose default weather; understands how to reach the wider web via search.

---

## 5. Functional Requirements

### 5.1 Global layout

| ID | Requirement | Priority |
|----|-------------|----------|
| **F1** | Page MUST render as a single-column primary content area with optional fixed **header** (brand / home link) and **footer** (fixed **byline** / attribution only). | P0 |
| **F2** | Content MUST be usable at typical Tesla browser widths (fluid layout with sensible `max-width`). | P0 |
| **F3** | Primary actions (search submit, tile taps) MUST meet comfortable **touch target** sizing. | P0 |

### 5.2 Search

| ID | Requirement | Priority |
|----|-------------|----------|
| **F4** | Provide a **web search** entry point (e.g. query submitted to a major search provider) so users are not limited to bookmarked tiles. | P0 |
| **F5** | Search field SHOULD use placeholder or default text that clears on focus to avoid accidental submission of placeholder text as the query. | P1 |

### 5.3 App & information tiles

| ID | Requirement | Priority |
|----|-------------|----------|
| **F6** | Present a **grid of outbound links** represented by recognizable **images** (tiles) to external web apps or sites (games, media, news, weather, etc.). | P0 |
| **F7** | Each tile MUST navigate to the target URL in the same tab/window behavior consistent with in-car browser defaults (typically full navigation away from start page). | P0 |
| **F7b** | Tile grid MUST use **four equal-width columns** that **fill the content width** with **even gutters** between columns. Tile **images** SHOULD render at roughly **half** the column width (centered); the tile link SHOULD still occupy the full column width so **touch targets** stay large. | P1 |
| **F8** | Curated set SHOULD balance **entertainment**, **information**, and **Tesla-adjacent** content where appropriate. | P1 |
| **F9** | External links MAY append **UTM (or similar) query parameters** for campaign attribution without breaking destination functionality. | P2 |

### 5.4 Weather location

Weather uses **client-side resolution** only (no backend). Resolution order: **start-page URL** → **localStorage** → **saved “generic weather” preference** → otherwise prompt. When **no** location id applies, the weather tile MUST use a **generic** Weather.com landing URL.

| ID | Requirement | Priority |
|----|-------------|----------|
| **F10** | Start page URL MAY include a **`zip` query parameter** (or compatible **location id**) with a safe allowed character set. When present and valid, it MUST drive the weather tile destination and SHOULD be **written to localStorage** so later visits work without the query string. | P1 |
| **F11** | When a **saved location** exists in **localStorage**, the weather tile MUST use the corresponding Weather.com “today” URL for that id; the UI SHOULD offer a way to **change** the saved location later. | P1 |
| **F12** | When there is **no** URL override, **no** saved location, and **no** persisted “use default weather” choice: a **modal** SHOULD prompt for ZIP or Weather.com location id, with **Save** persisting to localStorage. | P1 |
| **F13** | Modal SHOULD offer **“Use default weather”**, persisting a preference so the modal does not appear on every visit for users who decline a specific location. | P1 |
| **F14** | If the user **dismisses** the modal without choosing (e.g. backdrop), the implementation MAY use **sessionStorage** so the modal does not immediately reappear on refresh in the same browser session. | P2 |

### 5.5 Branding & trust

| ID | Requirement | Priority |
|----|-------------|----------|
| **F15** | Header SHOULD include a clear link to **official Tesla** (or approved brand asset) so users recognize context and trust the page as a “Tesla browser” companion, not a third-party phishing surface. | P1 |
| **F16** | Footer MUST be a **short byline** only (no third-party product calls to action). Current copy: **“Tesla start page by @porfitron © 2026 Porfirio Landeros”** (copyright year updated as needed). | P0 |

### 5.6 Analytics (optional)

| ID | Requirement | Priority |
|----|-------------|----------|
| **F17** | If analytics are included, they MUST respect user privacy expectations and applicable regulations; loading SHOULD NOT block first paint. | P2 |

---

## 6. Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| **N1** | **Performance:** Page SHOULD be lightweight (minimal blocking scripts, optimized images) so it loads quickly on cellular/Wi‑Fi as used by the vehicle. | P0 |
| **N2** | **Resilience:** Page SHOULD degrade gracefully if external scripts (e.g. analytics) fail to load. | P1 |
| **N3** | **Accessibility:** Semantic HTML where possible; meaningful `alt` text on tile images; sufficient color contrast for text on background. | P1 |
| **N4** | **Security:** All outbound links to sensitive flows SHOULD use **HTTPS** where the destination supports it. | P0 |
| **N5** | **Maintenance:** Tile targets and images SHOULD be easy to update without restructuring the entire page. | P1 |

---

## 7. Safety, Compliance, and Responsibility

- This product is a **link hub**; it does not control what happens on destination sites.  
- **Drivers** must comply with local laws and Tesla’s own guidance on browser use while operating the vehicle.  
- Destinations that are **video-heavy or game-focused** may be restricted or unsafe while driving; the PRD assumes **passenger or parked** use for those categories.  
- Future iterations MAY add **visual grouping** (e.g. “Parked only”) or disclaimers if product direction requires clearer risk communication.  

---

## 8. Success Metrics (suggested)

| Metric | Rationale |
|--------|-----------|
| Time from page load to first outbound navigation | Validates “fast access” (G1). |
| Bounce back to start page vs. deep engagement on destination | Indicates tile relevance (indirect). |
| Error reports / broken tiles | Operational health of curated links. |

(Exact instrumentation depends on analytics choices and privacy policy.)

---

## 9. Technical Constraints

- **Static hosting** friendly (single `index.html` or small static set).  
- **No server-side requirement** for core experience (search and tiles work client-side + standard HTTP).  
- Compatible with **WebKit-class** browsers typical of embedded automotive browsers (avoid bleeding-edge APIs unless polyfilled or progressive).  
- **Query strings** SHOULD be parsed with robust APIs (e.g. `URLSearchParams`) so malformed or missing `?` does not break script execution.  

---

## 10. Open Questions / Future Phases

1. **Personalization:** User-configurable **tiles** (layout or links), separate from weather location storage.  
2. **i18n:** Multi-language labels and alt text.  
3. **Dark/light mode:** Match Tesla UI theme automatically (`prefers-color-scheme`).  
4. **PWA / offline:** Cached shell with offline message when network unavailable.  
5. **HTTPS-only search:** Migrate search form action to HTTPS endpoints.  

---

## 11. Revision History

| Version | Date | Notes |
|---------|------|-------|
| 0.1 | 2026-05-12 | Initial PRD from product intent and current `index.html` behavior. |
| 0.2 | 2026-05-12 | Weather modal + localStorage/session behavior; tile column layout and ~50% icon size; footer byline only (`@porfitron`, ©); renumbered requirements (F7b, F10–F17, F15–F16 branding). |
