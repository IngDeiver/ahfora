import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { parseArgs, run } from '../src/cli.js';

test('parses defaults, destination spaces, client selections and dry run', () => {
  assert.deepEqual(parseArgs([]), { target: '.', selected: [], dryRun: false });
  assert.deepEqual(parseArgs(['init', 'my project', '--clients', 'opencode,claude,opencode', '--dry-run']), {
    target: 'my project', selected: ['opencode', 'claude'], dryRun: true,
  });
  assert.equal(parseArgs(['--clients=all']).selected.length, 3);
  assert.deepEqual(parseArgs(['--clients=generic']).selected, []);
  assert.deepEqual(parseArgs(['init', '--help']), { help: true });
});

test('rejects malformed or ambiguous CLI options', () => {
  for (const args of [ ['--clients'], ['--clients', '--dry-run'], ['--clients='], ['--clients=claude,'], ['--clients=unknown'], ['--clients=generic,claude'], ['--clients=all', '--clients=claude'], ['a', 'b'], ['--force'], ['--help', 'directory'] ]) {
    assert.throws(() => parseArgs(args), undefined, JSON.stringify(args));
  }
});

test('help, version, usage errors and dry run do not write to the project', async t => {
  const cwd = await mkdtemp(join(tmpdir(), 'ahfora-cli-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  let out = '';
  let err = '';
  const io = { cwd, stdout: { write: text => { out += text; } }, stderr: { write: text => { err += text; } } };
  assert.equal(await run(['--help'], io), 0);
  assert.match(out, /Usage:/);
  out = '';
  assert.equal(await run(['--version'], io), 0);
  assert.match(out, /^0\.1\.0\n$/);
  assert.equal(await run(['--unknown'], io), 2);
  assert.match(err, /Unknown option/);
  out = '';
  assert.equal(await run(['init', '--dry-run'], io), 0);
  assert.match(out, /preview/);
  assert.deepEqual(await readdir(cwd), []);
});
