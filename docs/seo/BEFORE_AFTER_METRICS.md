# ASL measured before / after results

Measured 12 October 2026. Baseline: clean repository at `478f1e3cde3ee752ff6882f88338bf1410efade8`. Same lockfile/runtime: Next.js 16.3.8, React 19.3.0, Node 24.13.1. Local measurements use optimized production builds, not next dev. No dependencies were changed.

**Independent release review:** The measurements below record the original implementation pass. [RELEASE_READINESS_REPORT.md](RELEASE_READINESS_REPORT.md) supersedes its final values with full mobile Lighthouse performance audits and the later form/entrance reliability fixes. Final homepage initial JS is 629,217 B raw / 192,946 B gzip; homepage HTML is 63,551 B. Projects remain 579,351 B raw / 178,533 B gzip. The Chrome DevTools tool still excludes performance; a separately obtained full Lighthouse 13.4.0 Node module supplied the release performance results. No field CWV pass is established.

## Initial HTML and JavaScript

Method: `node scripts/measure-html.mjs <output-file>` against `http://127.0.0.1:3000`. Fetch initial HTML, identify unique script src tags, fetch those assets and count raw/gzip bytes. Gzip uses Node zlib defaults. This measures initial script delivery candidates, **not** full-session downloads, Brotli transfer sizes, execution time or all deferred imports. Robot interaction still downloads Three.js later. Exact asset lists are retained in the JSON evidence files.

| Measurement | Before | Final after | Interpretation |
| --- | ---: | ---: | --- |
| Homepage initial JS, raw | 1,156,087 B | 628,796 B | **45.6% less** in initial script tags |
| Homepage initial JS, gzip | 322,611 B | 192,761 B | **40.3% less** using the same compression |
| Projects initial JS, raw | 576,212 B | 579,351 B | +3,139 B / 0.5%; navigation/measurement support |
| Projects initial JS, gzip | 177,039 B | 178,533 B | +1,494 B / 0.8%; no corresponding measured interaction regression established |
| Homepage HTML | 48,627 B | 64,182 B | More useful visible service links, metadata and JSON-LD |
| Projects HTML | 27,514 B | 37,252 B | Metadata, schema, links and truthful labels |
| Hero body texture | PNG 1,610,807 B | WebP 598,648 B | **62.8% smaller**, 1536 × 1024 RGBA preserved |
| Raster social card | Absent | 1200 × 630 PNG | Generated and cached at build; not a normal homepage visual download |

Sharp decoded the PNG and lossless WebP and compared alpha and visible RGB pixels: equal dimensions and **zero differing visible pixels**. The source PNG remains. First-visit film stays 2,278,761 B; no size reduction is claimed. A fresh `/#contact` browser context requested **zero intro videos**, with main usable and contact approximately 30px from the viewport top. Session/reduced-motion/save-data bypasses are implemented; not all preference/device combinations were independently simulated.

Evidence: `evidence/baseline-local-html.json`, `evidence/after-local-html.json`, `evidence/interaction-checks.json`.

## Lighthouse

Chrome DevTools Lighthouse **13.4.1**, navigation mode, mobile profile: 412 × 823, DPR 1.75, simulated throttling settings. The tool audits accessibility, SEO, best practices and agentic browsing; it **does not supply a performance category score**.

| URL/build | Accessibility | Best practices | SEO | Notes |
| --- | ---: | ---: | ---: | --- |
| Live baseline `https://www.aslagency.dev/` | 100 | 100 | 91 | Missing robots.txt; deployment/network differs from local |
| Local baseline `/` | 100 | 100 | 100 | Localhost crawler audits differ; HTTP checks still failed missing canonicals/robots/sitemap |
| Final local `/` | 100 | 100 | 100 | 61 passed, zero failed audits after label/role corrections |
| Final local `/projects` | 100 | 100 | 100 | 54 passed, zero failed audits |
| Local `/services/website-development` | 100 | 100 | 100 | 54 passed, zero failed audits; representative shared template |

**Do not call this a verified live SEO improvement from 91 to 100.** No deployment occurred, and the local baseline already scored 100. Explicit initial-HTML/HTTP assertions establish the fixes. Agentic scores/llms.txt audits are separate from Google SEO; no llms.txt was added just to chase a score. Raw final and pre-accessibility reports are in `evidence/*lighthouse.json`.

## Browser performance traces

Chrome DevTools traces: CPU 1x, no network throttling. Comparable local navigation profile: **510 × 732, DPR 1.25**, warmed local assets, first-visit film enabled by clearing its session flag before each reload. Baseline had one navigation; the final performance pass had three. This is a small desktop-browser lab sample at a narrow viewport, **not** slow-mobile simulation or a field percentile.

| Observation | LCP | TTFB | CLS | INP |
| --- | ---: | ---: | ---: | ---: |
| Live baseline | 8,607 ms | 7,522 ms | 0.01 | Not collected |
| Local baseline navigation | 521 ms | 6 ms | 0.01 | Not collected |
| Updated navigation 1 | 488 ms | 5 ms | 0.02 | Not collected |
| Updated navigation 2 | 505 ms | 6 ms | 0.01 | Not collected |
| Updated navigation 3 | 886 ms | 4 ms | 0.01 | Not collected |
| Updated carousel interaction trace | Not applicable | Not applicable | 0.00 | 180 ms |

After-navigation median LCP is **505 ms**, range 488–886 ms; the single baseline was 521 ms. Variability and unequal sample sizes do not establish a statistically reliable speedup. Supplementary after traces measured 871 ms at 1440 × 900 and 942 ms at the narrow viewport while other browser operations were running; these are excluded from the final comparable median. The traces preceded the last accessibility-only label/element adjustments, which changed initial JS by tens of bytes. No field or long-term regression guarantee follows.

The entrance video can be an LCP candidate. A fast recorded LCP does **not** prove immediate usability of the hero behind it. The approved first-visit film remains interruptible through Skip/Escape with a safety timeout; direct enquiries and repeat visits bypass it. Avoid equating a decorative-frame LCP with the complete visitor experience.

INP covered three keyboard carousel operations locally, not every interaction or mobile hardware. No pre-change INP was recorded; no invented before/after INP comparison is supplied.

Trace summaries: `evidence/after-navigation-traces.txt` and `evidence/after-interaction-trace.txt`. Baseline summaries were returned by the tool and recorded above; no raw baseline trace was exported. No CrUX/real-user data was returned. Google's good 75th-percentile thresholds (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1) require field assessment; no field pass is claimed. [Web Vitals guidance](https://web.dev/articles/vitals).

## Technical outcomes

| Check | Before | After |
| --- | --- | --- |
| Public content routes | 2 | 9: home, projects, hub, six services |
| Canonical/social metadata | Missing | Explicit on all nine routes using verified www host |
| Robots / sitemap | 404 / 404 | 200 / 200, exactly nine production content URLs |
| Preview indexing policy | Absent from repository | Actual preview build passed noindex meta/header and empty sitemap checks |
| Unknown URLs | 404 | 404 retained, custom recovery and noindex |
| Structured data | None | Representative Schema.org validation: zero errors/warnings; all route graphs parsed/checked |
| Portfolio links | No task baseline requests | All five public GET responses 200 |
| Responsive initial viewport | No task baseline measurements | 54 checks: no horizontal overflow/broken loaded images |

Post-deployment measurements, actual form delivery, field CWV and account-level search data remain owner tasks. No traffic, rankings, leads, keyword volumes or score forecasts were invented.
