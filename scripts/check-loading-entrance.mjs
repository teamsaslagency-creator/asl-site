import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Run the actual entrance effect with deterministic browser timing and media.
// No video downloads, real storage changes or browser navigation occur.
const source = ts.transpileModule(readFileSync('components/LoadingEntrance.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

async function mountEntrance({ now = 500, effectiveType = '4g', reducedMotion = false, hash = '', seen = false, saveData = false } = {}) {
  const effects = [], timers = [], leaving = [], writes = [];
  let plays = 0, completions = 0;
  const media = { pause() {}, play() { plays++; return Promise.resolve(); }, addEventListener() {}, removeEventListener() {} };
  const content = { inert: false };
  const body = { style: { overflow: '' } };
  const preference = { matches: reducedMotion, addEventListener() {}, removeEventListener() {} };
  const jsx = (type, props) => {
    if (type === 'video') props.ref.current = media;
    return { type, props };
  };
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module, exports: module.exports,
    document: { body, querySelector: () => content },
    navigator: { connection: { effectiveType, saveData } },
    performance: { now: () => now },
    location: { hash },
    sessionStorage: { getItem: () => seen ? 'true' : null, setItem: (key, value) => writes.push([key, value]) },
    setTimeout: (callback, delay) => { const timer = { callback, delay }; timers.push(timer); return timer; },
    clearTimeout() {},
    window: { matchMedia: () => preference, addEventListener() {}, removeEventListener() {} },
    require: name => {
      if (name === 'react') return { useEffect: callback => effects.push(callback), useRef: current => ({ current }), useState: initial => [initial, value => leaving.push(value)] };
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (name.includes('ArrowIcon')) return { default: () => null };
      throw new Error(`Unexpected entrance dependency: ${name}`);
    },
  });
  module.exports.default({ onComplete: () => completions++ });
  const cleanup = effects[0]();
  await Promise.resolve();
  return { media, content, body, timers, leaving, writes, cleanup, get plays() { return plays; }, get completions() { return completions; } };
}

function assertBypassed(entrance) {
  assert.equal(entrance.plays, 0, 'a bypass never starts playback');
  assert.equal(entrance.media.src, undefined, 'a bypass never requests the film');
  assert.deepEqual(entrance.leaving, [true]);
  const completion = entrance.timers.find(timer => timer.delay === 0);
  assert.ok(completion, 'bypass schedules immediate completion');
  completion.callback();
  assert.equal(entrance.completions, 1);
  entrance.cleanup();
  assert.equal(entrance.content.inert, false, 'cleanup restores usable content');
  assert.equal(entrance.body.style.overflow, '');
}

test('fast first visits retain the approved film and its existing safety timer', async () => {
  const entrance = await mountEntrance();
  assert.equal(entrance.media.src, '/asl-loading-burgundy-refined.mp4');
  assert.equal(entrance.plays, 1);
  assert.deepEqual(entrance.leaving, []);
  assert.ok(entrance.timers.some(timer => timer.delay === 12000));
  entrance.cleanup();
});

test('late hydration bypasses the film before assigning its source', async () => {
  assertBypassed(await mountEntrance({ now: 3001 }));
  const boundary = await mountEntrance({ now: 3000 });
  assert.equal(boundary.plays, 1, 'the cutoff is strictly later than three seconds');
  boundary.cleanup();
});

test('slow reported connection types bypass without a film download', async () => {
  for (const effectiveType of ['slow-2g', '2g', '3g']) assertBypassed(await mountEntrance({ effectiveType }));
});

test('existing reduced-motion, deep-link, repeat-visit and data-saving bypasses remain', async () => {
  for (const options of [{ reducedMotion: true }, { hash: '#contact' }, { seen: true }, { saveData: true }]) assertBypassed(await mountEntrance(options));
});
