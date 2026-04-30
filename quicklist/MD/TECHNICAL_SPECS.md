# Technical Specifications

## Stack
- **Framework:** Vanilla HTML5, Tailwind CSS, JavaScript.
- **Icons:** Lucide-Icons (via CDN).
- **QR Generation:** `qrcode.js` (via CDN).
- **Hosting:** GitHub Pages.

## State Management
The app should handle the following UI states within `index.html`:
- `STATE_SPLASH`: The introductory modal.
- `STATE_CHOOSER`: Template selection grid.
- `STATE_EDITOR`: The form entry (dynamic fields).
- `STATE_PREVIEW`: The "Confirmation" stage.
- `STATE_VIEWER`: The public-facing listing (rendered from URL data).
- `STATE_SHARE`: The final screen with QR code and shortener link options.

## Persistence & Logic
- **URL Encoding:** Use `btoa()` for Base64 encoding of a JSON object.
- **First Run Logic:** Use `localStorage` to check if `hasSeenSplash` is true. If not, show the modal.
- **Conditional Rendering:** Use a single `form` element but toggle field visibility using `data-template` attributes or JS-driven templates.