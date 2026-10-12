import { gzipSync } from 'node:zlib';
import { writeFile } from 'node:fs/promises';

const base = process.env.SEO_TEST_URL || 'http://127.0.0.1:3000';
const results = [];
for (const path of ['/', '/projects']) {
  const r = await fetch(new URL(path, base));
  const html = await r.text();
  const urls = [...new Set([...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(m => m[1]))];
  const scripts = [];
  for (const url of urls) {
    const buffer = Buffer.from(await (await fetch(new URL(url, base))).arrayBuffer());
    scripts.push({ url, rawBytes: buffer.length, gzipBytes: gzipSync(buffer).length });
  }
  results.push({ path, status: r.status, htmlBytes: Buffer.byteLength(html), initialScriptRawBytes: scripts.reduce((n, s) => n + s.rawBytes, 0), initialScriptGzipBytes: scripts.reduce((n, s) => n + s.gzipBytes, 0), scripts });
}
const result = { date: '2026-10-12', base, method: 'Initial server HTML script tags; gzip level defaults; excludes deferred imports and actual transport headers', results };
if (process.argv[2]) await writeFile(process.argv[2], JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
