# SEO review evidence

The committed JSON files are concise audit documentation: mobile Lighthouse category/metric summaries, browser interaction results, the cold-cache entrance comparison, initial JavaScript payloads and public redirect responses. They contain no credentials or real form submissions. Measurements record the local review on 12 October 2026; they are not a deployed-site or field Core Web Vitals result.

Raw Lighthouse reports, screenshots, full traces and temporary build/regression logs remain in the original local workspace and are excluded from Git. Historical `evidence/...` filenames in the audit documents refer to those local records; they are not published repository attachments. No captured browser profile or local environment file is included; `.env.example` contains only public configuration defaults.

Reproduce current checks with:

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run start
# In a separate terminal:
npm run test:seo
node scripts/measure-html.mjs
node scripts/check-external-links.mjs
```

To test preview policy, build/start with `VERCEL_ENV=preview`, then run `SEO_TEST_PREVIEW=true npm run test:seo` (set these environment variables using your shell's syntax). Restore a production build afterwards. Preview metadata and headers must be generated from the preview build environment.

The [release report](../RELEASE_READINESS_REPORT.md) contains the full mobile Lighthouse method and remaining owner gates. Its nine-route metric table is also recorded in [release-mobile-summary.json](release-mobile-summary.json). Full Lighthouse tooling is not an application dependency; use a reviewed temporary installation to repeat a mobile performance audit.
