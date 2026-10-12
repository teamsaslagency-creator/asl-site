# ASL owner setup checklist

Nothing in this checklist has been performed on an external account. No push, deployment, DNS update, business listing, analytics installation or real form submission was made. Repository implementation is local and awaiting publication approval.

## Before deployment

- [ ] Confirm that `https://www.aslagency.dev` is the intended permanent host. The live bare-domain visit resolved there. The connected Vercel account cannot see `asl-site`; use the account/team that owns the production project.
- [ ] Check Vercel Domains: verified www host serves production; bare domain redirects permanently; HTTP redirects to HTTPS; domain certificate is valid. The repository adds a bare-host 308 and slash normalization, but platform rules may run first.
- [ ] Confirm `VERCEL_ENV=production` on production and `preview` on previews. For independently hosted staging set `SEO_NOINDEX=true` **at build time**. Metadata, robots, sitemap and headers are generated from the build environment; rebuild after changing it. Never set `ASL_SITE_URL` to a deployment URL.
- [ ] Keep default `ASL_SITE_URL=https://www.aslagency.dev`, or change only after a different canonical host is verified. Overrides reject malformed/preview origins. `VERCEL_URL` is deliberately unused.
- [ ] Review service scopes and showcase labels. Confirm any paid client relationships before adding them. No physical address, hours, phone, reviews, awards, pricing or delivery commitments have been invented. Colombo-specific copy remains withheld.
- [ ] Supply official social profile URLs and confirm ownership. Replace the accurately labelled coming-soon buttons and add `sameAs` only after verification.
- [ ] Confirm `contact@aslagency.dev` works. In Formspree, verify form `mljglvqy`, target email, allowed domains, retention/spam settings and your desired response process. The existing endpoint was preserved. Submit one controlled brief yourself and confirm actual email delivery.
- [ ] Approve privacy information for Formspree and any future measurement. The visible form now identifies its processor and asks visitors not to include sensitive information.
- [ ] Run `npm ci`, `npm test`, `npm run typecheck`, `npm run build`; serve with `npm run start` and run `npm run test:seo`. On this Windows host, Turbopack and loopback tools needed sandbox escalation; that is a tooling constraint, not a reason to change the application architecture.
- [ ] Obtain explicit approval to deploy; this request prohibited automatic publication.

## Immediately after approved deployment

Inspect the **live** homepage, projects, services hub and six service routes. Confirm titles, descriptions, canonical www URLs, index/follow, social card and one H1 in View Source. Check `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, `/apple-icon.png` and unknown routes. Confirm new content is present without JavaScript and retained animation/navigation/form behavior.

Check public `vercel.app` aliases for `X-Robots-Tag: noindex, follow`. Previews should be noindex in both meta and headers, remain crawlable, and have an empty sitemap. Do not use robots Disallow to conceal noindex. Platform auth/protection may provide additional preview safeguards; no project settings were changed.

Re-test metadata at shared URLs with relevant social debuggers. Refresh cached previews when needed. Validate deployed JSON-LD in [Schema Markup Validator](https://validator.schema.org/) and [Google Rich Results Test](https://search.google.com/test/rich-results). Valid Organization, WebSite, Service and BreadcrumbList data does not guarantee a rich result; generic Service has no dedicated Google rich-result feature. Do not add fabricated ratings or unsupported FAQ markup.

## Google Search Console

1. Use the actual owner's Google account and add a **Domain property** for `aslagency.dev`. Use the DNS verification record provided by Google and leave that token in place. Only the owner should approve and perform the DNS change. Domain properties cover host/protocol variants. Alternatively add a URL-prefix property for `https://www.aslagency.dev/` using an available verification method. [Google ownership instructions](https://support.google.com/webmasters/answer/9008080).
2. After deployment, submit `https://www.aslagency.dev/sitemap.xml` in Sitemaps. Check successful fetch and discovered URL count. Submission is a discovery signal, not an indexing guarantee. [Sitemaps report](https://support.google.com/webmasters/answer/7451001).
3. Inspect `/`, `/projects`, `/services` and each service URL with URL Inspection. Check response, allowed indexing, rendered content, declared canonical and Google's selected canonical. Request indexing for important new pages where appropriate.
4. Review Page indexing exclusions, crawl errors and Core Web Vitals. Distinguish deliberate preview noindex from production errors.
5. In Performance, filter Sri Lanka and compare query groups with their mapped landing pages. Monitor impressions, clicks, CTR and position alongside qualified enquiries. Compare comparable periods and note limited samples; do not turn average position into a first-place promise.

## GA4 and lead measurement — optional, requires approval

No tracker, analytics ID, data layer, cookies or analytics network endpoint is installed. A local `asl:measurement` CustomEvent exposes a future integration point. Its payload contains only an event name and, where relevant, an allowlisted service slug or project ID. It never includes names, emails, messages, full page URLs or form values.

| Local event | Trigger | Suggested future mapping |
| --- | --- | --- |
| `contact_submit_success` | Formspree returned 2xx plus its expected success JSON (`next` string, no error payload) | GA4 recommended `generate_lead`; mark this as a key event |
| `email_contact_click` | Email link clicked | Intent signal; not a confirmed lead |
| `project_enquiry_click` | Contact CTA clicked | Intent signal; not a confirmed lead |
| `service_enquiry` | Contact CTA on service page clicked | Intent signal with service slug |
| `portfolio_open` | Project preview or external project link clicked | Portfolio engagement with project ID |

Choose a measurement provider and approve consent/privacy handling first. For GA4, create or select the property, add a Web data stream for the www production URL, and use the real Measurement ID from that account. Install one approved adapter; don't install multiple trackers for the same event. Listen for `asl:measurement` only after the user's applicable consent. Keep preview/staging and internal QA out of production reports. [GA4 setup](https://support.google.com/analytics/answer/9304153), [recommended events](https://support.google.com/analytics/answer/9267735), [key events](https://support.google.com/analytics/answer/9267568).

Send `generate_lead` only for `contact_submit_success`; disable automatic form-submit tracking if it would also count failed attempts or duplicate this event. Use DebugView or the provider's equivalent to test an owner-authorized success and a failure. The site confirms provider acceptance, not guaranteed inbox delivery. Configure a funnel from landing page to service enquiry to accepted brief, and review qualified leads separately. Do not send form contents or email addresses to analytics.

## Bing Webmaster Tools

Add the canonical site under the owner's account. Import the verified Search Console property if available, or follow Bing's current verification instructions. Submit the same canonical sitemap and review URL inspection, crawl/indexing reports and search data. Leave verification tokens in place. [Bing ownership verification](https://www.bing.com/webmasters/help/how-to-verify-ownership-of-your-site-afcfefc6).

## Google Business Profile eligibility

Do not create a profile just because the agency has a website. Verify that ASL has genuine in-person customer contact through an eligible staffed customer-facing location or travel to customers. Online-only businesses are not automatically eligible; virtual offices and unstaffed coworking addresses must not be used to manufacture a listing. Confirm accurate real-world name, contact, service area and permitted address display before proceeding. No LocalBusiness schema was added because location details are missing. [Google's business representation guidelines](https://support.google.com/business/answer/3038177).

## Ongoing maintenance

- Change `contentUpdated` in `lib/services.ts` only when public editorial content materially changes. No build-time current timestamps or unsupported changeFrequency/priority claims are used.
- Keep route metadata in `pageMetadata()` and add real public pages to the sitemap explicitly. Don't inherit a root canonical on new pages.
- Re-run SEO checks and mobile QA after navigation, image, content or transition changes. Re-measure lab performance consistently; use field evidence for a 75th-percentile CWV assessment.
- Review the 90-day roadmap with actual Search Console and enquiry data after launch.
