import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Compile the actual TS modules with the repository's TypeScript; no new runner dependency.
function load(file, env = {}) {
  const filename = resolve(file);
  const source = ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, { module, exports: module.exports, process: { env }, URL, require: name => load(resolve(dirname(filename), `${name}.ts`), env) }, { filename });
  return module.exports;
}

test('default is verified www HTTPS origin; preview URL cannot influence it', () => {
  const config = load('lib/seo.ts', { VERCEL_URL: 'random.vercel.app' });
  assert.equal(config.seo.url, 'https://www.aslagency.dev');
  assert.equal(config.absoluteUrl('/services/ai-automation'), 'https://www.aslagency.dev/services/ai-automation');
});
test('production indexes; preview, development and explicitly disabled deployments do not', () => {
  for (const [env, expected] of [[{}, true], [{ VERCEL_ENV: 'production' }, true], [{ VERCEL_ENV: 'preview' }, false], [{ VERCEL_ENV: 'development' }, false], [{ SEO_NOINDEX: 'true' }, false]]) {
    const config = load('lib/seo.ts', env); assert.equal(config.isIndexable, expected);
    assert.equal(config.pageMetadata('A service', 'Useful description', '/services').robots.index, expected);
  }
});
test('rejects unsafe canonical origins rather than silently using a preview or malformed URL', () => {
  for (const ASL_SITE_URL of ['http://aslagency.dev', 'https://foo.vercel.app', 'https://localhost', 'https://127.0.0.1', 'https://www.aslagency.dev/path', 'https://www.aslagency.dev?x=y', 'https://www.aslagency.dev#anchor', 'https://user:secret@aslagency.dev', 'https://www.aslagency.dev:3000', 'broken']) assert.throws(() => load('lib/seo.ts', { ASL_SITE_URL }));
  assert.equal(load('lib/seo.ts', { ASL_SITE_URL: 'https://www.aslagency.dev/' }).seo.url, 'https://www.aslagency.dev');
});
test('each metadata object carries complete social and canonical fields', () => {
  const config = load('lib/seo.ts');
  const meta = config.pageMetadata('Useful service', 'A distinct description', '/services/ai-automation');
  assert.equal(meta.alternates.canonical, meta.openGraph.url);
  assert.equal(meta.openGraph.description, meta.description);
  assert.equal(meta.openGraph.siteName, 'ASL');
  assert.equal(meta.openGraph.images[0].width, 1200);
  assert.equal(meta.twitter.card, 'summary_large_image');
  assert.equal(meta.twitter.images[0].url, meta.openGraph.images[0].url);
});

test('ASL stays the primary brand with one approved secondary alias and stable entity references', () => {
  const { seo, businessGraph, organizationId, websiteId } = load('lib/seo.ts');
  const entities = JSON.parse(JSON.stringify(businessGraph))['@graph'];
  assert.equal(seo.name, 'ASL');
  assert.equal(organizationId, 'https://www.aslagency.dev/#organization');
  assert.equal(websiteId, 'https://www.aslagency.dev/#website');
  for (const type of ['Organization', 'WebSite']) {
    const matches = entities.filter(entity => entity['@type'] === type);
    assert.equal(matches.length, 1, `one ${type} entity`);
    assert.equal(matches[0].name, 'ASL');
    assert.equal(matches[0].alternateName, 'ASL Agency');
    assert.equal(matches[0].url, 'https://www.aslagency.dev/');
  }
  const organization = entities.find(entity => entity['@type'] === 'Organization');
  const website = entities.find(entity => entity['@type'] === 'WebSite');
  assert.equal(organization['@id'], organizationId);
  assert.equal(organization.logo, 'https://www.aslagency.dev/asl-logo.svg');
  assert.equal(organization.email, 'contact@aslagency.dev');
  assert.equal(website['@id'], websiteId);
  assert.equal(website.publisher['@id'], organizationId);
  for (const entity of entities) {
    for (const inventedField of ['address', 'telephone', 'sameAs', 'foundingDate', 'aggregateRating', 'review']) assert.ok(!Object.hasOwn(entity, inventedField));
  }
});
test('JSON-LD cannot break out of its script and preserves data', () => {
  const { serializeJsonLd } = load('lib/seo.ts');
  const input = { name: '</script><script>alert(1)</script>' };
  const output = serializeJsonLd(input); assert.ok(!output.includes('<')); assert.deepEqual(JSON.parse(output), input);
});
test('service content and small client navigation map agree; unknown slugs are absent', () => {
  const { services, findService, contentUpdated } = load('lib/services.ts');
  const { serviceLinks } = load('lib/service-links.ts');
  assert.equal(services.length, 6);
  assert.equal(findService('unknown-service'), undefined);
  assert.match(contentUpdated, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(new Set(services.map(s => s.description)).size, 6);
  assert.equal(new Set(services.map(s => s.approach)).size, 6);
  for (const service of services) {
    assert.ok(serviceLinks.some(link => link.href === `/services/${service.slug}` && link.name === service.name));
    for (const slug of service.related) assert.ok(findService(slug));
  }
});
