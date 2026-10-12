# ASL SEO implementation report

Completed locally on 12 October 2026. The original tree was clean at `478f1e3cde3ee752ff6882f88338bf1410efade8`. Changes are **uncommitted and undeployed**. No push, publication, DNS update, accounts, purchases or active analytics integration occurred.

**Independent release review:** [RELEASE_READINESS_REPORT.md](RELEASE_READINESS_REPORT.md) supersedes this implementation-pass verification summary. It records fresh nine-route checks, full mobile Lighthouse performance, 16 passing regression tests and narrow fixes for ambiguous form acceptance, failed-JavaScript blocking and late/slow entrance playback. The existing public email remains unchanged; real Formspree delivery is still an owner gate.

## Initial findings and domain

Meaningful initial HTML and one H1 already existed on both public routes, including the client homepage. Main gaps: no canonicals/social metadata, robots/sitemap routes or JSON-LD; service details concentrated in inactive carousel states; weak service/country identity; unclear portfolio provenance; Three.js included in initial JavaScript. Full severity/evidence is in `SEO_BASELINE_AUDIT.md`.

A real Chrome visit to the proposed bare domain resolved to **https://www.aslagency.dev/** and displayed ASL. That verified final host is the canonical default. The connected Vercel account did not expose this project, so deployment/domain ownership settings remain owner checks.

## Implemented technical architecture

- `lib/seo.ts`: typed production origin, visible ASL name, description, logo, social card, English/Sri Lanka locale and published contact email. Optional overrides reject malformed/non-HTTPS/preview origins. Canonicals never use request hosts or VERCEL_URL.
- `pageMetadata()`: unique per-route title/description, explicit canonical, complete Open Graph and Twitter objects, environment-aware robots. Complete nested objects avoid Next.js shallow-merge losses. Root layout has a title template **without a canonical**. Homepage uses an explicit absolute branded title because its same-segment template does not augment it.
- `app/page.tsx`: Server Component exporting metadata and rendering the existing interaction in `HomeExperience`. `ServiceDirectory` is passed through a server-rendered slot, keeping its full editorial data outside the client import graph.
- `app/robots.ts` and `app/sitemap.ts`: public assets/content remain crawlable; sitemap contains exactly nine canonical content pages with the actual editorial update date, not changing build timestamps. No private route was found.
- Preview/development and explicit staging builds: noindex in both HTML and headers, crawlable robots, empty sitemap. Vercel deployment aliases get a noindex header, including production aliases. Bare host gets a 308 preserving path/query; slash normalization remains. HTTPS/platform rules still need live owner verification.
- `app/not-found.tsx`: ASL-styled recovery; unknown URLs/slugs retain actual HTTP 404 and noindex. Curated service slugs are pre-generated; no thin city/case-study routes.
- `app/opengraph-image.tsx`: cached build-generated 1200 × 630 PNG using supported next/og, actual logo/headline and approved palette. Added 180 × 180 raster touch icon; existing SVG favicon remains.

Before product changes, consulted installed **Next.js 16.3.8** guides for server/client rendering, metadata/templates/shallow merging, robots, sitemap, ImageResponse/social images, lazy loading, not-found/status behavior and headers/redirects. Installed React is 19.3.0. Lockfile and dependencies were preserved.

## New routes and useful content

| Route | Distinct coverage |
| --- | --- |
| `/services` | Choosing a practical starting point among the six actual offerings |
| `/services/website-development` | Business sites, content/enquiries, responsive design, interactive visuals, truthful website examples |
| `/services/ecommerce-development` | Catalogue, checkout, operations/integration dependencies; concept cart distinguished from live payments |
| `/services/mobile-app-development` | Flutter, recurring tasks, prototypes, APIs/platform/release requirements |
| `/services/ai-automation` | One practical task, approved information, integration boundaries, human review; scripted demo identified |
| `/services/custom-software` | Business processes/platforms, data/access/integration questions, useful first releases |
| `/services/seo-performance` | Crawl/rendering/metadata fixes, performance diagnosis and evidence; lab/field distinction |

Every service has a unique problem, capabilities, use cases, approach, preparation, process, enquiry CTA and related links. Website/commerce pages use appropriate studio showcases. Other services do not invent project proof. No pricing, deadlines, reviews, awards, customer counts or outcomes were invented. No repeated city pages or fabricated localization/hreflang.

Homepage preserves **“Digital. Alive.”**, one H1, robot and carousel. Nearby visible copy now identifies the country and services; a permanent directory and footer links expose all six services regardless of carousel state. Portfolio cards/introduction explicitly label studio showcases and concept experiences. Image descriptions are clearer; no paid-client relationships/results are claimed. Existing palette, fonts, CSS system and motion are retained.

## Structured data and trust

Organization/WebSite have stable canonical IDs. Service pages add Service and genuine BreadcrumbList definitions; projects/hub have breadcrumbs. Serialization escapes `<` to prevent script breakouts. No unverified sameAs, office address/hours, LocalBusiness, reviews/ratings or FAQ/HowTo markup.

Schema.org validated the exact generated website-development JSON-LD sample with **zero errors/warnings**. Detected top-level BreadcrumbList, WebSite and Service, with Organization resolved through stable publisher/provider graph references. All nine route graphs were also parsed and checked by the HTTP suite. This is representative external schema validation, not a claim that every URL was submitted to Google. Organization can help business understanding, WebSite supports site-name signals, breadcrumbs may support presentation; generic Service has no dedicated Google rich-result feature. Appearance is not guaranteed. [Organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization), [site names](https://developers.google.com/search/docs/appearance/site-names), [breadcrumbs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb).

## Performance and conversion

Hero Three.js now loads through a client-only dynamic import after the entrance. Workflow code is deferred until near viewport with a stable existing-artwork fallback. GPU cleanup/visibility logic and interactions are retained. Mobile hero pixel ratio caps at 1.25; desktop retains its prior cap.

Lossless WebP reduces the body texture 1,610,807 → 598,648 bytes, preserving dimensions with zero different visible pixels; source remains. Initial homepage JS falls 1,156,087 → 628,796 raw bytes (45.6%); gzip falls 40.3%. Portfolio gzip adds only 1,494 bytes for navigation/measurement support. Detailed methods and variable traces: `BEFORE_AFTER_METRICS.md`.

First-visit film, robot, carousel/gallery, previews, workflow study and transitions remain. Intro bypasses repeat session visits, deep links, reduced-motion and save-data before assigning its video source. Skip/Escape and timeout remain. No-JavaScript styles expose hero/mobile links; service content is ordinary visible HTML. First-visit film still intentionally delays main interaction; recorded video-frame LCP does not represent complete hero readiness.

`MeasurementBridge` exposes local asl:measurement events only: no tracker, ID, cookies, analytics endpoint or personal data. Accepted Formspree responses emit contact_submit_success; failures do not. Native POST fallback/endpoint/recovery remain. Form now visibly identifies Formspree. Owner-approved consent-aware analytics can consume the hook later.

Lighthouse detected existing project-button visible-label mismatches and article/group carousel semantics. Preview names now include “Explore live”, gallery names reference visible labels, and slide groups use div with the same styling/behavior. Final home/projects audits have zero failed audits.

## Validation results

| Check | Result/evidence |
| --- | --- |
| Unit/config tests | Six passed: canonical/env policy, complete metadata, safe serialization, service/navigation consistency |
| TypeScript / production build | Passed; final build statically generates nine content pages plus metadata routes/custom 404 |
| Production HTTP/initial HTML | All nine routes pass titles/descriptions/H1/canonical/social/robots/schema/labels; sitemap, anchors, images/icons, host rules and real 404s pass |
| Preview build/HTTP suite | All nine routes noindex in meta/headers, robots crawlable, sitemap empty; tested before final label-only refinements |
| Host rules | Native HTTP confirms bare-host 308 and alias noindex. Node fetch ignores Host overrides; tests use native HTTP |
| Responsive | 54 route/width checks at 360/390/430/768/1280/1440; no horizontal overflow/broken loaded images; tablet/desktop error listeners returned no script errors |
| No JavaScript | Script-disabled browser frames: homepage visible with nav/service links/native form; AI service readable; no 360px overflow |
| Form | Intercepted synthetic rejection retains data and emits zero leads; acceptance resets and emits exactly one lead. No real enquiry sent |
| Existing interactions | Mobile menu/nav Escape/focus return; carousel click/keyboard; Beauty filter; dialog open/Escape/iframe removal; transitions release inert; robot tracking/pause; deferred workflow canvas ready |
| External links / social image | All five portfolio GETs 200; social card 1200 × 630 image/png visually inspected; icon requests pass |
| Lighthouse mobile | Home, projects, representative service: accessibility/SEO/best practices 100. Local baseline also 100; no claimed live score gain |
| Lab performance | LCP 488/505/886ms, CLS 0.01–0.02; carousel INP 180ms. No field pass/statistical speedup claimed |
| Review | Independent architecture/code review found no actionable regressions; subsequent title/label corrections have red/green and browser evidence |

Evidence files retain initial failures, title-brand/label failures, final green suite, preview suite, raw Lighthouse reports, responsive records and trace summaries. There was no original test runner beyond build/typecheck. No new runtime dependencies or trackers.

## Exact file inventory

Created configuration/data: `lib/seo.ts`, `lib/services.ts`, `lib/service-links.ts`, `lib/measurement.ts`, `next.config.ts`, `.env.example`.

Created components: `HomeExperience.tsx`, `ServiceDirectory.tsx`, `InnerHeader.tsx`, `JsonLd.tsx`, `MeasurementBridge.tsx`, `DeferredWorkflowRobot.tsx`.

Created routes/styles/assets: `app/services/page.tsx`, `app/services/[slug]/page.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx`, `app/not-found.tsx`, `app/apple-icon.png`, `app/service-pages.css`, `public/robot-cutout.webp`.

Modified: root layout/page, projects page, site.css; HomeSections/HomeFooter/Services/IntelligenceLab/LoadingEntrance/ProjectBriefForm/ProjectsGrid/RobotArtwork; lib/projects.ts; package.json; README.md. Existing source imagery, videos, geometry, brand SVG, lockfile and repository instructions retained.

Created scripts: `scripts/check-seo-config.mjs`, `scripts/check-seo.mjs`, `scripts/measure-html.mjs`, `scripts/check-external-links.mjs`. All six requested docs, an implementation plan and evidence are in docs/seo.

## Remaining owner actions and limits

1. **Separate approval required to publish.** Production still has old output. Owner Vercel team/domain settings, DNS/HTTPS, live parity and post-deployment social/Google tests remain unverified.
2. Search Console, GA4, Bing and Business Profile not configured. `OWNER_SETUP_CHECKLIST.md` covers verification, sitemap, inspection, query/page monitoring, consent and success-only lead mapping.
3. Owner must verify actual inbox delivery/spam handling, official socials, company facts/Colombo relevance and client case-study claims. Mock acceptance does not prove email delivery.
4. Field CWV/CrUX unavailable; lab observations do not establish a 75th-percentile pass. Remote baseline latency and intentional intro need ongoing measurement.
5. Viewport/representative interaction checks are not an exhaustive physical-device gesture suite. Reduced-motion/save-data/session logic exists; not every preference combination was simulated.
6. Next.js 16.3.8 logs internal NoFallbackError diagnostics for deliberately probed unknown statically restricted service slugs while returning correct HTTP 404. No browser exceptions observed. Monitor deployment logs if operationally noisy; preserve correct 404 behavior.

Follow the owner checklist before publishing and `CONTENT_ROADMAP.md` afterwards: verify website work first, publish useful decision guides and genuine case studies, then review actual query/enquiry evidence. No ranking guarantees or invented demand figures.
