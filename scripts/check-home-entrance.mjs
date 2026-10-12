import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
const source = ts.transpileModule(readFileSync('components/HomeExperience.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

test('server-rendered homepage never depends on JavaScript to dismiss the entrance', () => {
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module, exports: module.exports,
    require: name => {
      if (name === 'react' || name === 'react/jsx-runtime' || name === 'react-dom') return require(name);
      if (name === 'next/dynamic') return { default: () => () => null };
      if (name.includes('PageTransition')) return { usePageTransition: () => ({ hasNavigated: false, isTransitioning: false }) };
      if (name.includes('LoadingEntrance')) return { default: () => createElement('div', { className: 'asl-loading-entrance' }) };
      return { default: () => null };
    },
  });
  const html = renderToStaticMarkup(createElement(module.exports.default, { serviceDirectory: null }));
  assert.ok(!html.includes('asl-loading-entrance'), 'no blocker before the skip handler can run');
  assert.match(html, /data-loading="false"/, 'hero copy can animate in without hydration');
  assert.match(html, /Explore services/);
  assert.match(html, /href="#capabilities"/);
  assert.match(html, /<link[^>]+rel="preload"[^>]+href="\/asl-intelligence-chamber-v1\.webp"[^>]+fetchPriority="high"/i, 'CSS hero artwork is discoverable in initial HTML');
});
