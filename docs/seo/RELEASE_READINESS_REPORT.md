# ASL independent release review

12 October 2026. **PASS: ready for a Vercel preview. Production release gate: FAIL / not cleared until the owner checks below are completed.** No commit, push, deployment, DNS change or real enquiry was made. Existing SEO improvements, service design and 3D hero are preserved.

| Finding | Status | Verified result / remaining requirement |
| --- | --- | --- |
| Build, TypeScript, regression tests | PASS | Final optimized production build and `tsc --noEmit` pass; **16/16 tests** pass. Final production HTTP/SEO suite passes all nine routes, internal links, images, schema, robots, sitemap and 404 checks. |
| Metadata and production indexability | PASS | Nine distinct branded titles/descriptions; one H1 and www canonical per route; matching OG URLs, Twitter cards, index/follow. Content/service links exist in initial HTML. |
| Preview indexing policy | PASS | Actual preview build: all nine routes noindex in meta and headers, crawlable robots, empty sitemap, production canonicals. Final policy tests pass. Preview HTTP test preceded only the last entrance bypass change; SEO policy/routes were unchanged. Recheck the deployed preview. |
| Canonical redirect | PASS | Local bare-host **308** preserves path/query. Existing live HTTP→HTTPS and bare→www return 308; www homepage returned 200. Vercel project/domain settings and new deployed output still require owner verification. |
| Structured data and social images | PASS | All nine JSON-LD graphs parse and pass entity/reference assertions; Organization/WebSite, breadcrumbs and six Services use stable www IDs. No fabricated location, reviews, phone or client outcomes. Served PNG is **1200×630**, visually checked; Apple icon **180×180**. Existing external Schema.org validation of the unchanged graph was not repeated. |
| Design/mobile rendering | PASS | Independently inspected all nine routes at **390×844 and 1280×900**, including all six service pages. **18 fresh route/width checks: no overflow or broken loaded images.** Representative scrolled detail/CTA inspection confirms lower headings and links render correctly. |
| Existing interactions | PASS | Fresh browser checks: intro skip, hero canvas/tracking/pause, reduced motion, menu Escape/focus, service carousel, process click/keyboard, gallery selection, workflow canvas, Beauty filter, modal Escape/iframe removal, and service→contact transition releasing inert. |
| Contact address and form routing | WARNING — owner gate | Public address stays **contact@aslagency.dev** throughout links/schema. **hello@aslagency.dev was not substituted.** Source consistency does not verify either mailbox or Formspree delivery. Endpoint `mljglvqy` is retained; recipient, allowed domains, account status/spam handling and real inbox receipt remain unverified. |
| Mobile performance | WARNING | Genuine full mobile Lighthouse results below. Cold-cache entrance trap fixed, but fast first visits retain a 2.28 MB film. Homepage LCP/TBT and total payload remain material launch risks. No field/CrUX/INP percentile result is available. |
| Editorial quality | WARNING | Service bodies describe different scopes and do not duplicate entire pages or stuff keywords. Six shared section headings and the same capabilities/process structure feel repetitive. App/AI/software/SEO pages lack verified project proof; do not invent it. The app sentence “Flutter is represented in our existing service offering” sounds internal. CTAs are clear and work, but share generic wording and do not preselect the originating service in the brief. |
| Operational logs | WARNING | Next 16.3.8 logs internal `NoFallbackError` on deliberately probed unknown static service slugs, while returning the correct **404/noindex**, not 500. All nine supported routes pass. Inspect Vercel preview logs before promotion. |
| Unconditional production approval | FAIL — not cleared | Confirm delivery and owner-approved mailbox routing, validate actual preview/production settings and URLs, and resolve or explicitly accept the mobile performance warning before approving production. |

## Route review and full mobile Lighthouse

Full **Lighthouse 13.4.0 Node module**, Chrome 155 headless, local optimized production build; mobile **412×823, DPR1.75**, simulated **150 ms RTT / 1638.4 kbps / CPU4**. The built-in DevTools audit omits performance, so separate temporary tooling was used in the ignored cache; no runtime dependency was added. All nine routes scored **100 accessibility / 100 best practices / 100 SEO**, and **CLS 0** in these runs. Scores do not guarantee exhaustive accessibility or deployed SEO.

| Route | Content / visual review | Performance | LCP | TBT |
| --- | --- | ---: | ---: | ---: |
| `/` | Brand/service identity clear; mobile CTA readable; fast intro remains a delay | **54 median** | **5.43 s** | **1381 ms** |
| `/projects` | Five truthful studio showcases; filters, previews and external links work | 88 | 3.78 s | 119 ms |
| `/services` | Six direct service links; consistent typography, spacing and CTA | 91 | 3.12 s | 177 ms |
| `/services/website-development` | Specific design/enquiry scope; three labelled concepts; longest showcase section | 90 | 3.47 s | 118 ms |
| `/services/ecommerce-development` | Catalogue/order/integration scope; concept checkout caveat retained | 92 | 3.20 s | 127 ms |
| `/services/mobile-app-development` | Flutter/platform scope distinct; internal-sounding sentence noted above | 88 | 3.19 s | 250 ms |
| `/services/ai-automation` | Concrete workflow examples and human review; demo accurately identified | 94 | 3.03 s | 103 ms |
| `/services/custom-software` | Internal tools/APIs/access boundaries distinct; limited supporting proof | 89 | 3.19 s | 243 ms |
| `/services/seo-performance` | Clear technical scope; lab/field distinction and no ranking promises | 93 | 3.06 s | 130 ms |

Homepage final runs: **66 / 54 / 48**, LCP **5.43–5.51 s**, TBT **520–3009 ms**. Host benchmark index varied **1135–1718.5**; no statistically established speedup or regression is claimed. Other routes had one run each; their code was unchanged by the final entrance safeguard. Desktop service whitespace is mostly the intentional two-column layout alongside longer lists/showcases; mobile collapses cleanly. Further layout redesign is not required for preview.

## Narrow fixes and performance evidence

1. **False form confirmation fixed.** An unexpected 2xx JSON error or HTML body previously cleared the brief and recorded success. The form now requires Formspree's expected success JSON and retains inputs on ambiguity. Browser fixtures confirm an error retains details/emits zero leads; acceptance resets once/emits one lead. No real submission was sent. Contract checked against [Formspree’s official client](https://github.com/formspree/formspree-js/blob/main/packages/formspree-core/src/submission.ts).
2. **Failed-JavaScript entrance trap fixed.** Before: SSR overlay remained and hero opacity stayed 0 when chunks failed. The blocking entrance now mounts after hydration. Browser confirmation with chunks blocked: no overlay, hero opacity 1, main not inert.
3. **Late/slow entrance fixed.** Bypass before video source assignment if hydration arrives after three seconds or the connection reports 2G/3G; existing reduced-motion, repeat, hash and save-data bypasses remain. Fast first visits retain the full film. With a fresh Chrome profile/cache disabled, 390×844, DevTools 150 ms / 1638.4 kbps / CPU4: entrance previously disappeared at **19.78 s** after navigation; now **6.68 s**, with **zero video requests**. This is a single controlled browser observation, not a field percentile or Lighthouse LCP. Slow hydration still has a cost.
4. **Hero resource discovery fixed.** Existing background preloads from initial HTML at high priority. Lighthouse discovery warning disappeared; LCP did not show a meaningful improvement, so none is claimed.

Final initial script-tag payloads: homepage **629,217 B raw / 192,946 B gzip**, projects **579,351 / 178,533**, hub/services **576,661 / 177,730**. Homepage grew only **185 B gzip** from the previously completed SEO implementation; the other routes are unchanged. Three.js/renderer code remains deferred, and server SEO configuration/full service copy remain outside initial client chunks. These counts exclude deferred/full-session downloads. Against the original task baseline, homepage initial gzip remains approximately **40% smaller**.

Remaining performance opportunities: Lighthouse estimated about **51–53 KiB unused JavaScript**, **13–41 KiB unused CSS**, and **441 KiB oversized homepage image savings**. Most initial script weight is shared Next/React runtime; no analytics tracker or new third-party runtime library was added. The fast-intro audit transferred approximately **3.16 MiB** including the film. Lazy loading does not guarantee all below-fold images remain outside the browser's preload distance. Further asset sizing and performance work can be scoped after preview; no large redesign was introduced here.

## Owner-dependent release steps

1. Confirm which mailbox is public. Keep `contact@` unless explicitly approved otherwise. Inspect Formspree `mljglvqy` in the owning account, confirm its desired recipient (which may differ from the public address), domain allowlist and delivery/spam behavior. Send one owner-controlled brief and verify inbox receipt, including from the preview if that domain is intended to submit. Mock acceptance proves client behavior only.
2. In the correct Vercel project/team, verify automatic `VERCEL_ENV=preview`, build-time noindex policy, canonical www origin and preview protections. Deploy preview only through the owner's separate workflow. Check all nine routes, noindex headers, empty sitemap, social card, 404 responses and logs there.
3. Review mobile performance on the real preview and representative devices; improve or explicitly accept the remaining first-visit delay and lab warning. No field CWV pass can be approved from localhost scores.
4. Approve production separately, confirm `VERCEL_ENV=production`, and recheck live metadata/indexability, nine-URL sitemap, redirects/TLS, schema/social previews and actual contact delivery. Official social URLs and verified case studies remain editorial owner tasks.

Committed evidence: [scope and reproduction commands](evidence/README.md), [mobile metrics](evidence/release-mobile-summary.json), [interactions](evidence/release-interactions.json), [additional browser checks](evidence/release-additional-browser.json), [cold before](evidence/release-entrance-cold-before.json), [cold after](evidence/release-entrance-cold.json), [bundles](evidence/release-production-bundles.json), and [live redirects](evidence/release-live-hosts.json). Raw Lighthouse reports, screenshots and temporary build/regression logs remain in the local review workspace and are excluded from Git for publication. The commands above can reproduce current build, TypeScript and regression results.
