# Cursor Implementation Instructions

Please build **Quick List** following these specific UI/UX requirements:

### UI Aesthetics
- Use a "Modern Utility" aesthetic: Soft shadows, large touch targets (min 44px), and a clean `sans-serif` stack.
- Primary Action Color: A vibrant Indigo or Electric Blue.
- Mobile-first: Ensure all containers have consistent horizontal padding (e.g., `px-6`).

### Workflow Logic
1.  **On Load:** - Check if the URL has a `?data=` param. If yes, immediately render the **Viewer Mode**.
    - If no data, check `localStorage` for `quickList_visited`. If null, show the **Instructional Modal**.
2.  **Template Chooser:** - Display four cards: "For Sale" (Tag icon), "For Rent" (Key icon), "Lost" (Search icon), "Take Action" (Megaphone icon).
3.  **Dynamic Form:**
    - If "For Sale": Show Title, Price, Description, Phone.
    - If "Lost": Show Title, Last Seen, Reward, Contact.
    - If "Take Action": Show Title, Description, Button Text, URL.
4.  **Confirmation Step:** - Before generating the QR code, show a "Live Preview." The user must click "Looks Good, Generate Link" to proceed.
5.  **QR Code Generation:** - Generate a high-resolution QR code using the full encoded URL. 

### Implementation Note
- Keep the logic in `app.js`.
- Use Tailwind's `hidden` class to swap between states without page reloads.
- Ensure the "Copy Link" button provides visual feedback (e.g., text changes to "Copied!").