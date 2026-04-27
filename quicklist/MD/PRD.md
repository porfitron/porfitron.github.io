# Project: Quick List
**Vision:** A high-utility, mobile-first web app for generating instant, stateless landing pages via QR codes. Perfect for temporary listings like "For Sale," "For Rent," or "Lost & Found."

## User Journey
1.  **First-Run Splash:** A clean, centered modal explaining the app's value (Create, Encode, Share) with a primary "Create a Listing" CTA.
2.  **Template Selection:** A visual grid of listing types (For Sale, For Rent, Lost, Take Action).
3.  **Dynamic Listing Form:** A form where fields change based on the chosen template (e.g., "Price" for Sale, "Reward" for Lost).
4.  **Preview & Confirm:** A "What others will see" view to verify details before generating the final link.
5.  **Success/Share State:** Displays the final URL, a "Copy Link" button, and a generated QR code for download/scanning.

## Core Features
- **Stateless Architecture:** All data is stored in the URL (Base64). No database required.
- **Dynamic UX:** The UI morphs based on the user's progress and selected template.
- **Mobile-First Design:** Optimized for thumb-navigation and quick entry on the go.