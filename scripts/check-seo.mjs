import assert from 'node:assert/strict';
import http from 'node:http';
import https from 'node:https';

const base = process.env.SEO_TEST_URL || 'http://127.0.0.1:3000';
const canonical = process.env.ASL_SITE_URL || 'https://www.aslagency.dev';
const preview = process.env.SEO_TEST_PREVIEW === 'true';
const paths = ['/', '/projects', '/services', ...['website-development', 'ecommerce-development', 'mobile-app-development', 'ai-automation', 'custom-software', 'seo-performance'].map(slug => `/services/${slug}`)];
const titles = new Set(), descriptions = new Set(), internal = new Set(), images = new Set();
const failures = [], results = [];
function hostRequest(path, host) {
  const url = new URL(path, base);
  return new Promise((resolve, reject) => {
    const request = (url.protocol === 'https:' ? https : http).get(url, { headers: { Host: host } }, response => {
      response.resume(); resolve({ status: response.statusCode, headers: response.headers });
    });
    request.on('error', reject);
  });
}
const decode = value => value?.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#x27;', "'");
function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map(match => Object.fromEntries([...match[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(a => [a[1], decode(a[2])])));
}
async function check(name, run) {
  try { await run(); console.log(`PASS ${name}`); }
  catch (error) { failures.push({ name, error: error.message }); console.error(`FAIL ${name}: ${error.message}`); }
}
for (const path of paths) await check(path, async () => {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200);
  if (preview) assert.match(response.headers.get('x-robots-tag') || '', /noindex/);
  const html = await response.text();
  const metas = tags(html, 'meta');
  const meta = name => metas.find(m => m.name === name || m.property === name)?.content;
  const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1]);
  assert.ok(title && !titles.has(title), 'unique title'); titles.add(title);
  assert.match(title, /ASL/, 'brand in page title');
  const description = meta('description');
  assert.ok(description && !descriptions.has(description), 'unique description'); descriptions.add(description);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, 'one initial HTML H1');
  for (const match of html.matchAll(/<button\b([^>]*)>(.*?)<\/button>/gs)) {
    const label = decode(match[1].match(/aria-label="([^"]*)"/)?.[1]);
    const visible = decode(match[2].replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
    if (label && /[\p{L}\p{N}]/u.test(visible)) assert.ok(label.toLowerCase().includes(visible.toLowerCase()), `accessible button name includes visible text: ${visible}`);
  }
  assert.ok(!tags(html, 'article').some(a => a.role === 'group'), 'carousel group uses a valid element');
  for (const button of tags(html, 'button')) if (button['aria-labelledby']) for (const id of button['aria-labelledby'].split(/\s+/)) assert.ok(html.includes(`id="${id}"`), `existing visible button label ${id}`);
  const links = tags(html, 'link');
  assert.equal(links.filter(l => l.rel === 'canonical').length, 1, 'one canonical');
  // Next.js normalizes the origin-only canonical without its optional root slash.
  assert.equal(new URL(links.find(l => l.rel === 'canonical')?.href).href, new URL(`${canonical}${path}`).href);
  assert.equal(new URL(meta('og:url')).href, new URL(`${canonical}${path}`).href);
  assert.ok(meta('og:image')?.startsWith(canonical), 'canonical social image');
  assert.equal(meta('twitter:card'), 'summary_large_image');
  assert.match(meta('robots') || '', preview ? /noindex/ : /(?:^|,\s*)index(?:,|$)/);
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(s => JSON.parse(s[1]));
  const entities = schemas.flatMap(s => s['@graph'] || [s]);
  assert.ok(entities.some(s => s['@type'] === 'Organization'), 'organization schema');
  assert.ok(entities.some(s => s['@type'] === 'WebSite'), 'website schema');
  if (path !== '/') assert.ok(entities.some(s => s['@type'] === 'BreadcrumbList'), 'breadcrumbs');
  if (path.startsWith('/services/')) {
    const service = entities.find(s => s['@type'] === 'Service');
    assert.ok(service, 'service schema');
    assert.equal(service.url, `${canonical}${path}`);
    assert.equal(service.provider['@id'], `${canonical}/#organization`);
  }
  for (const entity of entities) {
    assert.ok(!entity.aggregateRating && !entity.review, 'no invented ratings');
    if (entity['@id']) assert.ok(entity['@id'].startsWith(canonical));
  }
  for (const anchor of tags(html, 'a')) {
    if (anchor.href?.startsWith('/')) internal.add(anchor.href);
    if (anchor.href?.startsWith('#')) assert.ok(html.includes(`id="${anchor.href.slice(1)}"`), `existing page anchor ${anchor.href}`);
  }
  for (const img of tags(html, 'img')) {
    assert.ok(Object.hasOwn(img, 'alt'), 'image alt attribute');
    assert.ok(img.width && img.height, 'image dimensions');
    if (img.src?.startsWith('/')) images.add(img.src);
  }
  if (path === '/') for (const servicePath of paths.filter(p => p.startsWith('/services/'))) assert.ok(tags(html, 'a').some(a => a.href === servicePath), `permanent homepage link ${servicePath}`);
  results.push({ path, status: response.status, htmlBytes: Buffer.byteLength(html), title, description, canonical: links.find(l => l.rel === 'canonical')?.href });
});
await check('sitemap', async () => {
  const r = await fetch(new URL('/sitemap.xml', base)); assert.equal(r.status, 200);
  const xml = await r.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => decode(m[1]));
  assert.deepEqual(urls.sort(), preview ? [] : paths.map(p => `${canonical}${p}`).sort());
  assert.equal(new Set(urls).size, urls.length);
});
await check('robots', async () => {
  const r = await fetch(new URL('/robots.txt', base)); assert.equal(r.status, 200);
  const txt = await r.text(); assert.match(txt, /User-Agent: \*/i); assert.match(txt, /Allow: \//i);
  assert.ok(!/Disallow: \/\s*(?:\n|$)/i.test(txt), 'no crawl block hiding noindex');
  if (!preview) assert.ok(txt.includes(`Sitemap: ${canonical}/sitemap.xml`));
});
for (const path of ['/seo-missing-check', '/services/unknown-service']) await check(`404 ${path}`, async () => {
  const r = await fetch(new URL(path, base)); assert.equal(r.status, 404);
  const html = await r.text(); assert.match(html, /noindex/);
});
for (const href of internal) await check(`link ${href}`, async () => {
  const url = new URL(href, base); const r = await fetch(url); assert.equal(r.status, 200);
  if (url.hash) { const html = await r.text(); assert.ok(html.includes(`id="${url.hash.slice(1)}"`), 'existing anchor'); }
});
for (const src of images) await check(`image ${src}`, async () => { const r = await fetch(new URL(src, base)); assert.equal(r.status, 200); assert.match(r.headers.get('content-type') || '', /image\//); });
await check('social card', async () => { const r = await fetch(new URL('/opengraph-image', base)); assert.equal(r.status, 200); assert.match(r.headers.get('content-type') || '', /image\//); });
await check('apple icon', async () => { const r = await fetch(new URL('/apple-icon.png', base)); assert.equal(r.status, 200); assert.match(r.headers.get('content-type') || '', /image\//); });
await check('vercel.app alias is noindex', async () => { const r = await hostRequest('/', 'asl-test.vercel.app'); assert.match(r.headers['x-robots-tag'] || '', /noindex/); });
if (!preview) await check('bare host redirects permanently to verified www host', async () => { const r = await hostRequest('/services/ai-automation?source=test', 'aslagency.dev'); assert.equal(r.status, 308); assert.equal(r.headers.location, 'https://www.aslagency.dev/services/ai-automation?source=test'); });
console.log(JSON.stringify({ base, preview, results, failures }, null, 2));
if (failures.length) process.exitCode = 1;
