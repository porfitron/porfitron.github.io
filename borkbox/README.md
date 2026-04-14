# BorkBox™

Static web app for dog training: ambient acclimation loops and instant command cues. **No build step** — open `index.html` in a browser or host the folder on any static file host.

## Runtime files

- `index.html` — markup and inline styles
- `app.js` — behavior and synthesized audio (Howler)
- `vendor/howler.min.js` — [Howler.js](https://howlerjs.com/) (bundled copy)
- `favicon.svg` — primary favicon (`index.html` also references `favicon.ico` and `apple-touch-icon.png`; add those if you want full icon coverage)

Tailwind CSS is loaded from the CDN (see `index.html`).

## Documentation

Product and UX notes live in [`docs/`](docs/).
