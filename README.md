# ASL interactive homepage concept

Next.js, React, TypeScript, and Three.js. Run `npm install`, then `npm run dev` and open http://127.0.0.1:3000.

## SEO implementation (12 October 2026)

Public content now includes `/services` and six service pages: website-development, ecommerce-development, mobile-app-development, ai-automation, custom-software and seo-performance. Existing robot, entrance film, carousel, portfolio filters/previews and brief form remain in place. Portfolio examples are labelled studio showcases until client status is verified.

`lib/seo.ts` defaults to the verified final live host `https://www.aslagency.dev`. Optional configuration is documented in `.env.example`. Canonical and social URLs never use `VERCEL_URL`. Vercel previews/development and `SEO_NOINDEX=true` builds are noindex; robots permits crawling, preview sitemap is empty, and vercel.app aliases get a noindex header. Rebuild after changing these environment values. Root canonical metadata is explicit only on the homepage, never inherited by other routes.

Run `npm test` for configuration/security regressions, `npm run typecheck`, and `npm run build`. Start the production build, then run `npm run test:seo` against `http://127.0.0.1:3000` (or set `SEO_TEST_URL`). For an independently built preview use `SEO_TEST_PREVIEW=true`. `scripts/measure-html.mjs` measures initial HTML JavaScript and `scripts/check-external-links.mjs` checks the five portfolio destinations. No runtime dependency was added.

`asl:measurement` is a local CustomEvent integration hook; it sends nothing to an analytics provider. An owner-approved consent-aware adapter can later map accepted form submissions to lead events. See `docs/seo/OWNER_SETUP_CHECKLIST.md` before activating measurement or publishing changes. All requested audit, strategy, measurement, implementation and roadmap documents are in `docs/seo/`.

## Deploy to Vercel

Read [the independent release review](docs/seo/RELEASE_READINESS_REPORT.md) before publishing. It includes full mobile Lighthouse performance results, final production/preview checks and the remaining mailbox/Formspree owner gate. The public address remains `contact@aslagency.dev`; `hello@aslagency.dev` has not replaced it.

Import this GitHub repository into Vercel and select the Next.js framework preset. Keep the root directory at the repository root and use the default build and output settings. No environment variables are required for the current site.

The contact form sends project briefs through Formspree; email links use contact@aslagency.dev and social buttons remain placeholders until the real social channels are configured. The `concepts` directory contains local design previews and is excluded from Git. All website assets are in `public`.

Internal page links use a short burgundy shutter transition. Links within the current page, external links, and new-tab gestures retain native behavior. Returning to Home uses this transition instead of repeating the full particle intro; the robot entrance starts once the shutters clear. Reduced-motion preferences skip the shutters, and a timeout prevents navigation failures from trapping visitors behind the overlay.

The live hero has a reconstructed 3D head, independent eyes, both hands open, frame-rate-independent cursor tracking, a string descent/release sequence, and replay/pause controls. Pointer movement works across the page; touch users can move a finger without disabling page scrolling. Reduced-motion preferences start the robot in a static pose. Rendering stops while hidden or offscreen.

The default homepage uses the approved body artwork with its background removed, integrated into a charcoal/burgundy hero. `RobotArtwork.tsx` renders it behind a real, geometrically reconstructed head made by `lib/robot-head.ts`. The ceramic shell, dark glass visor, luminous eye rings and ear assemblies are meshes; there is no stretched head photograph. This is a hybrid: 3D head and 2D body. The head is an approximation of the concept, not an exact replica of an original model.

Cursor position sets yaw/pitch around the neck pivot. Gaze persists when the cursor stops; there is no idle head oscillation or browser-focus reset. Eyes lead and the head follows using frame-independent damping. Limits are approximately ±35° yaw and ±18° pitch. The body stays steady after the entrance.

`npm run export:head` exports the same geometry to `public/robot/asl-head.glb`. This head-only GLB is in meters with its neck pivot at the origin and can be imported into Blender for refinement.

Place the matching model at `public/robot/asl-robot.glb`. It must include pivots named `Head`, `Eyes`, `LeftArm`, `RightArm`, plus `LeftWristAnchor`, `LeftShoulderAnchor`, `RightWristAnchor`, and `RightShoulderAnchor`. The loader preserves the authored pivot rotations. Model axes: Y up, face forward along +Z, approximately 4.5 units wide across the open hands, head center around Y=2.55, hip around Y=-0.9. Author the open-hands resting pose and apply mesh transforms before export.

For a fully 3D body and exact appearance, a matching full model is still required. Preserve the ceramic and titanium surfaces, glass face contour, eye rings, joint construction, chest panel layout, and hand proportions from the video. `RobotScene.tsx` retains the full GLB interaction implementation for that upgrade.

Validation: `npm run typecheck` and `npm run build`. Browser checks cover pointer tracking, bounded head rotation, replay, motion pause, video dialog, and mobile layout. Reduced-motion support is implemented with the system media query.

Background removal used the built-in image generation tool. Full prompt and asset paths are recorded in `concepts/robot-cutout-prompt.txt`.

## Complete homepage and portfolio

The homepage now includes the preserved robot hero, interactive services, a cover-flow gallery of three supplied projects, a studio statement, an interactive process, an orbital technology scene, a project-brief form, and a large ASL footer.

The /projects page lists all five supplied websites, with category filters, in-page live previews, and external website links. Project metadata and the contact email and Formspree endpoint are centralized in lib/projects.ts. Preview images are screenshots captured from the live websites.

The contact address is contact@aslagency.dev, shared by the contact section and footer. The form submits name, email, service, and project idea to https://formspree.io/f/mljglvqy without leaving the page. It keeps the approved “Prepare my project brief” button, disables fields during sending, confirms accepted submissions, and retains details on failure. Formspree handles storage and email notifications; confirm its owner-approved target mailbox and receipt of a controlled brief. The public contact address has not been changed. A hidden _gotcha field provides basic honeypot filtering. No API key or additional package is required.

New scene loops pause off-screen and follow the hero motion toggle. Reduced-motion preferences are respected. Motion direction was informed by the publicly visible Animos showcase stream, depth stack, and cover-flow templates; the site animations are implemented directly in CSS/SVG and React.

See concepts/homepage-verification.md for checks.

## Homepage art direction v2

The homepage uses the black-lacquer and oxblood visual layer in app/direction.css, self-hosted Syne/Manrope fonts, and the custom material background public/asl-burgundy-material-v1.webp. Robot geometry and renderer code remain unchanged. Portfolio framing and carousel motion are preserved. See concepts/art-direction-v2.md for palette, generated asset provenance, and verification.
