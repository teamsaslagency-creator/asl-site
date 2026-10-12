# ASL production SEO implementation plan

Goal: retain ASL's approved premium experience while adding accurate, crawlable service content and maintainable technical SEO. Execute in the current clean checkout as authorized by the complete user brief; no external publication. The supplied brief is the specification.

Architecture: shared typed SEO and service configuration, explicit route metadata, server-rendered service routes, small existing client islands, supported Next.js metadata routes and a generated raster social card. Native execution, no new runtime packages.

## Tasks and checks

- [x] Establish production and initial HTML evidence; consult the **installed** Next.js metadata, robots, sitemap, server/client, ImageResponse, lazy loading and not-found documentation before code changes.
- [x] Add `scripts/check-seo.mjs`; exercise missing canonicals/service routes against the baseline before implementation. Assert unique titles/descriptions, one H1, canonical/OG/robots, JSON-LD references, sitemap agreement, real 404, image/link destinations and no preview indexing.
- [x] Add `lib/seo.ts`, `lib/services.ts`, `components/JsonLd.tsx`, metadata routes, root metadata and server homepage boundary. Test production and preview modes separately; reject malformed canonical origins.
- [x] Add `/services` and six service routes with distinct scopes, use cases, constraints, process, enquiry and relevant showcase links. Preserve palette/fonts and verify 360, 390, 430, 768, 1280, 1440 widths and no-JavaScript content.
- [x] Add permanent homepage/footer service links, country identity, truthful project classification, custom 404. Preserve carousel, gallery, modal, form and transitions.
- [x] Compare local production baseline and updated output; defer expensive robot code/texture work without removing scenes. Preserve reduced motion, visibility and cleanup. Do not infer field CWV from lab checks.
- [x] Typecheck, production build, HTTP regressions, responsive/interaction checks and Lighthouse. Investigate failures before declaring success.
- [x] Complete all six requested SEO documents with actual evidence, source links and owner-dependent limits. Review diff; leave uncommitted and undeployed.

## Review focus

Preview/staging must be noindex but crawlable; nested metadata must not lose canonical social URLs; unknown service slugs must return 404; native/no-JS links and content must remain usable; failed contact submissions must never count as leads. Check deep-link contact navigation, mobile nav and footer back-to-top anchors on every route.

Execution notes: all local tasks completed. Production and preview suites passed; publication and owner account setup remain outside authorization. Subsequent title and accessibility corrections were verified through red/green HTTP checks and Lighthouse. No commits or deployment performed.
