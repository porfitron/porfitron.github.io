# Technical Architecture

## Tech Stack
- **Framework:** HTML5
- **Styling:** Tailwind CSS (Play CDN)
- **Interactivity:** Alpine.js (for lightweight state management of the modal)

## Component Structure
1. **Navigation/Header:** Simple sticky header.
2. **Video Grid:** A CSS Grid container using `gap-6` and responsive column spans.
3. **Video Card:** - Image wrapper for the YouTube thumbnail.
   - Play icon overlay on hover.
   - Title and description text below the image.
4. **Modal Component:**
   - Fixed position, full-screen overlay.
   - Aspect-ratio container (16:9) for the iFrame to ensure responsiveness.

## State Logic
- `isOpen`: Boolean to toggle modal visibility.
- `activeVideoId`: String to store the currently playing YouTube ID.
- `closeModal()`: Function that sets `isOpen` to false and `activeVideoId` to an empty string.