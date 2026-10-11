# Responsive production review — 9 October 2026

## Evidence and cause

The three images in `attachments.zip` show a process description overlapping the tool strip, a workflow rendered in a different order, and northeast arrows displayed as emoji on iPhone Safari.

The overlap was reproduced in the local **production build**, not just inferred from the screenshots. At 440px wide, the process description extended into the tool strip. Computed styles showed `position: absolute; top: 343px` for the description and `display: flex` for the workflow. Older styles were overriding the responsive sheet after Next.js production CSS chunking. The previous development-only review did not catch this.

All global styles now enter through `app/site.css`, imported once by the root layout, with responsive rules last. Production now computes `position: relative` for the process description and `display: grid` for the mobile workflow. Northeast/southeast arrows use SVGs instead of platform-dependent text glyphs. Hidden paragraph line breaks retain word spacing. Contact inputs use 16px text through the tablet breakpoint.

## Sequential section reviews

Each section received a visual/layout review followed by a responsive/interaction review before moving to the next section. The final rebuilt production version also received the full viewport sweep and navigation regression check.

| Section | Review 1 | Review 2 |
| --- | --- | --- |
| Header and hero | Phone composition, logo, robot placement | 320–1440px bounds; menu open/close and motion toggle |
| Studio introduction | Phone heading, robot, copy spacing | 320/440/768/1024px bounds and tablet composition |
| Services | Phone artwork, hierarchy, controls | All four scenes at 320px; stable 648px stage; tap targets ≥44px; tablet scene |
| Homepage project gallery | Active card and surrounding spacing | Previous/next selection and active-card fit at 320/440/768/1024px |
| Workflow | Reproduced wrong ordering, verified restored robot-first composition | Three modes at 320px; workflow start feedback; tablet composition |
| Why ASL | Art and text hierarchy on phone | All card paragraphs contained at 320/440/768/1024px |
| Process book | Reproduced production overlap, compared corrected layout | All four chapters; description before controls and controls before strip at 320–1024px |
| Tool strip | Height and separation from process content | Moving transform verified independently of text; no process overlap in final sweep |
| Contact | Form layout and background readability | Phone/tablet fit; local brief prepared; final inputs 16px at all tested widths ≤1024px |
| Footer | Logo, link grid, email and social controls | 320/440/768/1024px bounds and WhatsApp placeholder feedback; SVG arrows checked in final build |
| Projects | Opening/backdrop, category filters, project card | Six widths through 1440px; Beauty/Food filtering; preview open/close |

## Final production sweep

Viewports: 320×568, 360×640, 375×812, 390×844, 430×932, 440×956, 600×960, 768×1024, 820×1180, 1024×768, 844×390, 1280×720, 1440×900.

- No horizontal document overflow or clipped visible headings/body/form fields was detected in these checks. Decorative gallery and book overflow is intentional.
- No process-description/tool-strip overlap occurred at any tested mobile/tablet size.
- Production build and its TypeScript check passed.
- Hero renderer and head geometry files retain their original SHA-256 hashes; no robot geometry, cursor tracking, or entrance animation edits were made.
- No new packages were installed.

## Limits

Browser checks use the in-app Chromium browser with explicit viewport sizes. They do not constitute physical iPhone Safari/Android testing. The uploaded Safari screenshots supplied real-device evidence; SVG arrows eliminate the glyph dependency, but the updated deployment still needs a real Safari check. Embedded live previews depend on external websites allowing framing/loading. These changes are local until pushed and deployed.
