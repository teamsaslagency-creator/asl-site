import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the actual form submit handler without a browser or a real submission.
// Only React rendering, browser APIs and the remote response are substituted.
const source = ts.transpileModule(readFileSync('components/ProjectBriefForm.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

async function submitWith(response) {
  const values = new Map([['name', ' Review User '], ['email', 'review@example.test'], ['idea', ' A project idea '], ['service', 'Website / E-commerce']]);
  const initialValues = new Map(values);
  const statuses = [], errors = [], measurements = [], requests = [];
  let stateIndex = 0, resets = 0;
  const form = {
    elements: { namedItem: () => ({ setCustomValidity() {}, reportValidity() { return true; } }) },
    reset() { resets++; values.clear(); },
  };
  class FormData {
    constructor() { this.values = new Map(values); }
    get(name) { return this.values.get(name); }
    set(name, value) { this.values.set(name, value); }
  }
  const jsx = (type, props) => ({ type, props });
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module, exports: module.exports, FormData, AbortController,
    window: { setTimeout, clearTimeout },
    fetch: async (endpoint, options) => {
      requests.push({ endpoint, options });
      if (response instanceof Error) throw response;
      return response;
    },
    require: name => {
      if (name === 'react') return {
        useState: initial => [initial, stateIndex++ === 0 ? value => statuses.push(value) : value => errors.push(value)],
        useRef: current => ({ current }), useEffect() {},
      };
      if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'fragment' };
      if (name.includes('projects')) return { projectBriefEndpoint: 'https://formspree.io/f/mljglvqy', contactEmail: 'contact@aslagency.dev' };
      if (name.includes('measurement')) return { emitMeasurement: name => measurements.push(name) };
      if (name.includes('ArrowIcon')) return { default: () => null };
      throw new Error(`Unexpected form dependency: ${name}`);
    },
  });
  const tree = module.exports.default();
  await tree.props.children[0].props.onSubmit({ preventDefault() {}, currentTarget: form });
  return { values, initialValues, statuses, errors, measurements, requests, resets };
}

function jsonResponse(body, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

function assertRetained(result) {
  assert.equal(result.resets, 0, 'uncertain or failed submissions retain the brief');
  assert.deepEqual(result.values, result.initialValues);
  assert.equal(result.statuses.at(-1), 'error');
  assert.deepEqual(result.measurements, [], 'failures never emit a lead conversion');
}

test('Formspree success confirms acceptance and resets exactly once', async () => {
  const result = await submitWith(jsonResponse({ next: 'https://formspree.io/thanks' }));
  assert.equal(result.statuses.at(-1), 'success');
  assert.equal(result.resets, 1);
  assert.deepEqual(result.measurements, ['contact_submit_success']);
  assert.equal(result.requests.length, 1);
  const { endpoint, options } = result.requests[0];
  assert.equal(endpoint, 'https://formspree.io/f/mljglvqy');
  assert.equal(options.method, 'POST');
  assert.equal(options.headers.Accept, 'application/json');
  assert.equal(options.body.get('name'), 'Review User');
  assert.equal(options.body.get('idea'), 'A project idea');
});

test('an explicit Formspree error in a 2xx response retains the brief', async () => {
  assertRetained(await submitWith(jsonResponse({ errors: [{ message: 'Not accepted' }] })));
  assertRetained(await submitWith(jsonResponse({ next: '/thanks', error: 'Not accepted' })));
});

test('unexpected JSON or malformed response bodies never confirm receipt', async () => {
  for (const body of [{}, { ok: true }, { next: 42 }, [], null]) assertRetained(await submitWith(jsonResponse(body)));
  assertRetained(await submitWith({ ok: true, status: 200, json: async () => { throw new SyntaxError('HTML is not JSON'); } }));
});

test('network failure retains inputs and offers recovery without a conversion', async () => {
  const result = await submitWith(new TypeError('Network unavailable'));
  assertRetained(result);
  assert.match(result.errors.at(-1), /could not confirm/);
});

test('rate limiting retains inputs and explains when to retry', async () => {
  const result = await submitWith(jsonResponse({ errors: [{ message: 'Rate limited' }] }, 429));
  assertRetained(result);
  assert.match(result.errors.at(-1), /little while/);
});
