# Alex Shepherd portfolio

## Direction
A monochrome, contemporary personal portfolio. The previous space theme is replaced by graphite surfaces, silver typography, and a restrained collection of objects drawn from Alex's interests.

Design variance: 8/10. Motion: 5/10. Density: 3/10.
Custom CSS on the existing React 19 / Vite / Tailwind 3 foundation.

## Palette and type
Semantic CSS variables in src/index.css are the source of truth.
Dark: surface #141414, raised #1d1d1d, primary #e8e8e6, secondary #a0a09c.
Light: surface #e8e8e4, raised #dcdcd7, primary #222222, secondary #60605b.
Respect system preference at startup; offer a manual theme control.
Manrope Variable for display and body; IBM Plex Mono for occasional metadata. Fonts are self-hosted.

## Composition
The hero name has two planes: Alex behind the object and Shepherd in front. Foreground type uses difference blending to remain distinct where it overlaps the object.
Only one 3D object is visible at a time: baseball, dumbbell, vinyl record, or football. Buttons choose the object; pointer movement gently changes its angle.
The hero has a pause control, reduced-motion support, a CSS fallback, and a separately loaded Three.js bundle. Scene geometry and textures are generated locally and disposed on unmount. Rendering skips hidden and offscreen content, and paused scenes render only when needed.

Selected work uses offset columns, real existing cover assets, source/live links, and expandable problem/role information. All six projects are retained; two are in the expandable archive. Images are monochrome until interaction.
About, grouped tools, and a plain-language contact form complete the page.
Keep all existing section IDs and the resume download.

## Interaction and accessibility
Native links, buttons, labels and details elements. Visible focus, a skip link, and polite form feedback.
Contact uses the existing /api/contact endpoint and preserves name/email/message fields. Required fields and email validation, a request timeout, retry, and direct email fallback.
No scroll hijacking, custom cursor, particle field, or external model dependency.
Mobile columns collapse; test at 320px, 390px, 768px, and desktop.
Sharp 2px corners on rectangular controls and imagery; circular theme control only.

## Verification
npm run build
npm run test:browser (uses locally installed Chrome)
Browser tests cover responsive overflow, scene availability, selector states, theme switching, keyboard navigation, resume delivery, project images, archive expansion, and mocked contact success/failure. These tests never send real email.
Repository-wide lint currently also scans an existing nested .claude worktree and encounters pre-existing contact API any types and a typewriter hook warning. Changed application components have been checked separately.
