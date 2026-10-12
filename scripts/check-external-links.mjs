import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile(new URL('../lib/projects.ts', import.meta.url), 'utf8');
const urls = [...source.matchAll(/url: '([^']+)'/g)].map(match => match[1]);
const rows = await Promise.all(urls.map(async url => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
    await response.body?.cancel();
    return { url, status: response.status, final: response.url };
  } catch (error) { return { url, error: error.message }; }
}));
await writeFile(new URL('../docs/seo/evidence/external-links.json', import.meta.url), JSON.stringify(rows, null, 2) + '\n');
console.log(JSON.stringify(rows, null, 2));
if (rows.some(row => row.error || row.status >= 400)) process.exitCode = 1;
