# ASL branded search update

Reviewed 13 October 2026 (Asia/Colombo), from master `137253c48702d57d76ad92f58b474107132b7211`.
Feature branch: `feature/asl-brand-search-seo`.

## Audit and changes

The existing implementation already uses ASL in Organization.name, WebSite.name,
Open Graph site_name, applicationName, visible branding and the logo. The homepage
title, “Website Development & Creative Technology in Sri Lanka | ASL”, already
identifies the brand, offering and location naturally, so it is retained. The six
service pages retain their distinct commercial titles, descriptions and copy.

Added the owner-approved secondary variation “ASL Agency” as alternateName on the
existing Organization and WebSite nodes. ASL remains their primary name. Their
canonical URLs, stable IDs and publisher/provider references are unchanged; no
additional business entities were introduced. No keyword-variant alias list,
meta-keywords, invented address, social profile, review or legal identity was added.

The shared agency description now explicitly connects creative technology with
software development in Sri Lanka. The existing visible homepage studio paragraph
introduces ASL Agency once in natural secondary copy. It remains server-rendered,
with the same elements, classes, CTA and layout. Navigation, logo, footer, Digital.
Alive., robot, cinematic entrance, animations, carousel and responsive CSS are unchanged.
The public contact remains contact@aslagency.dev; Formspree routing is unchanged.

## Verified before publication

- `npm test`: 17 passed, including the new primary/alternate-name regression. The
  new test first failed on the original missing alias and passed after the change.
- `npm run typecheck`: passed.
- `npm run build`: passed in production mode, preview mode (`VERCEL_ENV=preview`),
  and again in production mode after preview validation.
- `npm run test:seo`: passed against both built modes using SEO_TEST_URL and,
  for preview, SEO_TEST_PREVIEW=true. All nine routes, unique metadata, canonical
  URLs, primary/alternate schema names, stable references, social site name,
  initial visible copy, internal links/anchors, images, social card, robots,
  sitemap, noindex 404s and deployment-alias protection were checked.
- Production build: indexable metadata and nine canonical sitemap URLs. Bare-host
  308 redirect preserves path/query. Preview: noindex metadata and HTTP headers,
  empty sitemap, production canonicals and crawl access retained.
- Schema.org Markup Validator: the actual emitted business JSON-LD snippet showed
  WebSite with its referenced Organization, zero errors and zero warnings.
- Chrome browser: updated copy inspected at 390×844 and 1440×1000. No horizontal
  overflow. At 390px, the studio introduction retains its prior 292px height;
  robot artwork, typography and CTA remain consistent with the live baseline.
- Full focused diff reviewed. No dependencies, runtime integrations, credentials,
  environment files, binaries or infrastructure changes are part of this update.

## Guidance and limits

[Google site-name guidance](https://developers.google.com/search/docs/appearance/site-names)
supports alternateName on the existing WebSite entity and uses multiple signals
to choose the displayed name. [Google Organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization)
recommends consistent names and alternate names.
[Schema.org alternateName](https://schema.org/alternateName) accepts a text alias.
The validator result proves markup validity, not rankings or Google's selected
site name; site names are not supported in Google's Rich Results Test.

The owner reports Search Console verification, successful sitemap submission with
nine discovered URLs, and an accepted homepage indexing request. Account status
has not been independently inspected here. Their supporting canonical, robots,
sitemap and indexability behavior is preserved. After publication, inspect the
live homepage in Search Console, request recrawling if useful, and monitor branded
queries and indexed routes. Google processing takes time; neither alternateName
nor generic Service schema guarantees visibility or a rich result. “ASL” alone
remains ambiguous and competitive. No rankings or field Core Web Vitals pass are promised.

Prior post-release issues remain: homepage mobile Lighthouse median performance
54 (previous lab evidence; not remeasured for this text-only change), actual
Formspree recipient/inbox delivery unverified, and authenticated Vercel deployment
access unavailable under the connected account. GitHub deployment records and
public-domain checks can establish deployment outcomes where accessible.

The owner authorizes PR creation and normal merge into master, including automatic
Vercel production deployment. No manual Vercel deploy, DNS change, force-push,
history rewrite or protection bypass is authorized or required. Final PR/merge
identifiers and actual deployment outcome are reported separately after release.
