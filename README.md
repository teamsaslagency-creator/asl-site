# ASL interactive homepage concept

Next.js, React, TypeScript, and Three.js. Run `npm install`, then `npm run dev` and open http://127.0.0.1:3000.

## Deploy to Vercel

Import this GitHub repository into Vercel and select the Next.js framework preset. Keep the root directory at the repository root and use the default build and output settings. No environment variables are required for the current site.

The contact form prepares a brief locally; email and social buttons are placeholders until the real contact channels are configured. The `concepts` directory contains local design previews and is excluded from Git. All website assets are in `public`.

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

The homepage now includes the preserved robot hero, interactive services, a cover-flow gallery of three supplied projects, a studio statement, an interactive process, an orbital technology scene, a local project-brief form, and a large ASL footer.

The /projects page lists all five supplied websites, with category filters, in-page live previews, and external website links. Project metadata and the temporary contact email are centralized in lib/projects.ts. Preview images are screenshots captured from the live websites.

The contact address is hello@asl.example, a reserved placeholder requested while the real mailbox is created. The form validates and prepares a local brief for copying/downloading; it does not send messages. Configure a real email and delivery service before using it for incoming enquiries.

New scene loops pause off-screen and follow the hero motion toggle. Reduced-motion preferences are respected. Motion direction was informed by the publicly visible Animos showcase stream, depth stack, and cover-flow templates; the site animations are implemented directly in CSS/SVG and React.

See concepts/homepage-verification.md for checks.

## Homepage art direction v2

The homepage uses the black-lacquer and oxblood visual layer in app/direction.css, self-hosted Syne/Manrope fonts, and the custom material background public/asl-burgundy-material-v1.webp. Robot geometry and renderer code remain unchanged. Portfolio framing and carousel motion are preserved. See concepts/art-direction-v2.md for palette, generated asset provenance, and verification.
