# ASL SEO baseline audit

Recorded 12 October 2026, before implementation. Repository commit: `478f1e3cde3ee752ff6882f88338bf1410efade8`. `git status --short` was empty; no existing changes were overwritten. Inspected all tracked source, CSS, assets, configuration and scripts. Dependencies were initially absent.

## Verified production identity

Chrome opened `https://aslagency.dev` and resolved to **https://www.aslagency.dev/** with the ASL homepage. Browser fetches confirmed `/` and `/projects` return 200 and `/projects/` redirects to `/projects`. The supplied bare domain is not the final host. Web's reader could not access either host; Chrome could. Connected Vercel project search returned only `asl-laptop-studio`, no accessible `asl-site`; project-domain lookup returned 404. Domain ownership, all host redirects, deployment environment settings and source/deployment parity remain owner checks. The visible live homepage and portfolio match the inspected source content.

## Confirmed findings

| Severity | Finding and evidence | Source | Intended action |
| --- | --- | --- | --- |
| High | No canonical or social metadata in either initial live HTML response | `app/layout.tsx`, `app/projects/page.tsx` | Central typed metadata; explicit canonical and complete nested OG objects on every route |
| High | `/robots.txt` and `/sitemap.xml` return 404 on production | `app/` lacks metadata routes | Add supported metadata routes, indexable URLs only, preview noindex |
| High | Four carousel disciplines have no permanent service destinations; inactive slides are inert/aria-hidden | `components/Services.tsx` | Preserve carousel; add visible permanent service directory and six distinct service pages |
| Medium | Homepage title is brand-only; copy omits Sri Lanka and custom software | `app/page.tsx` | Server route metadata boundary; retain “Digital. Alive.” and improve nearby visible copy |
| Medium | No JSON-LD, stable business entity IDs or route breadcrumbs | `app/layout.tsx` | Organization, WebSite, Service, BreadcrumbList; no invented local address or ratings |
| Medium | Portfolio does not distinguish showcases from confirmed client engagements | `lib/projects.ts`, `components/ProjectsGrid.tsx` | Explicit showcase labels; no client results or thin case-study pages |
| Medium | Full-screen entrance blocks the page, makes main inert after hydration, and delays robot mounting; video 2,278,761 bytes | `LoadingEntrance.tsx`, `LoadingEntrance.css`, `app/page.tsx` | Measure before changing; retain film, add session/reduced-motion/save-data safeguards and progressive enhancement |
| Medium | Three.js statically imported through hero and workflow components, although workflow texture initialization already waits near viewport | `RobotArtwork.tsx`, `IntelligenceLab.tsx`, `WorkflowRobot.tsx` | Separate expensive rendering into deferred chunks; preserve renderer behavior |
| Low | Social buttons are documented placeholders | `HomeFooter.tsx`, `README.md` | Do not invent `sameAs`; retain accurate coming-soon behavior pending official URLs |
| Low | No project test runner or SEO regression coverage | `package.json` | Add dependency-free HTTP/initial HTML checks |

## Existing strengths and verified limits

- Client Components are **not missing from initial HTML**. Live `/` has 49,057 bytes, one H1 and full section text. `/projects` has 27,924 bytes, one H1 and project cards. These are response bytes, not transfer-compressed sizes.
- Unknown `/seo-missing-check` already returns HTTP 404. Improve its experience, retain correct status and noindex.
- Formspree form has native POST fallback, trimmed required fields, disabled sending state, abort/timeout, error recovery and accepted-response success handling. Preserve it; never send a real test enquiry without authorization.
- Font loading uses `next/font` with swap; image dimensions are generally provided; most below-fold raster images are lazy. Existing scene loops stop offscreen/hidden and dispose GPU resources. Existing service carousel includes keyboard, touch, focus and pause behavior.
- Three.js assets include unused alternatives/source PNGs; do not remove these without verifying future authoring requirements.
- Business country/service families are supported by the user's brief and existing site. No office address, Colombo location, official social URLs, registration name, reviews or client outcomes are verified.

## Actual live lab measurements

Chrome DevTools Lighthouse navigation, mobile: accessibility **100**, best practices **100**, SEO **91**. Failed SEO audit: robots.txt. Separate agentic score 67/llms.txt failure is not a Google SEO requirement and does not justify extra files.

Chrome navigation trace, CPU 1x, network unthrottled: LCP **8,607 ms**, TTFB **7,522 ms**, CLS **0.01**. No CrUX field data was returned. Remote document latency dominates this trace; this does not isolate the entrance cost or prove a field CWV failure/pass. Controlled local comparisons are recorded separately.

## Scope

Implement locally, run checks, and document owner tasks. No pushes, deployment, DNS changes, accounts, purchases or active analytics. No ranking, volume, difficulty or traffic claims.
