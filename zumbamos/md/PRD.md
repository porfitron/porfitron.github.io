# Product Requirements: Single-File Video Gallery

## Project Overview
A lightweight, mobile-responsive video gallery contained entirely within a single `index.html` file. The site displays a grid of video thumbnails that open a YouTube embed in a modal overlay when clicked.

## Core Requirements
- **Single File:** All HTML, CSS (via CDN), and JavaScript must reside in `index.html`.
- **Video Hosting:** All videos are hosted on YouTube.
- **Responsive Grid:** - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
- **Modal Behavior:**
  - Clicking a thumbnail opens the modal.
  - The modal must contain a responsive YouTube iFrame.
  - Closing the modal must stop the video playback (clear the iFrame source).
  - Modal should close via an 'X' button or by clicking the background overlay.

## UI/UX Goals
- Clean, modern aesthetic using Tailwind CSS.
- Hover effects on thumbnails to indicate playability.
- Smooth transitions for opening/closing the modal.