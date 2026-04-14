# UI/UX Specification: BorkBox

## Layout Structure
1. **Header:** - Logo ("BorkBox") 
   - Info Icon (Opens "About" Drawer)
2. **Main Content (The Soundboard):**
   - **Top Section (Acclimation):** Horizontal scrolling or small grid of tiles. Subtle colors. Loop toggle functionality.
   - **Bottom Section (Command Grid):** Large 2x2 or 2x3 grid. High-contrast colors (Green for Rewards, Red for Interrupters).
3. **Footer:**
   - IAB 320x50 Banner (Fixed position).

## Design System (Tailwind Classes)
- **Primary Reward:** `bg-green-500 active:bg-green-700`
- **Correction/Interrupter:** `bg-red-500 active:bg-red-700`
- **Attention/Whistle:** `bg-yellow-400 active:bg-yellow-600`
- **Backgrounds:** Dark Mode (`bg-slate-900`), Light Mode (`bg-slate-50`).

## Interactive States
- **Scale Effect:** Buttons should `active:scale-95` to give physical feedback.
- **Visual Pulse:** A CSS animation that "glows" when a sound is currently playing.