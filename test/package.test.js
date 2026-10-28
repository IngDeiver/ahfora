import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const root = fileURLToPath(new URL('../', import.meta.url));

test('published tarball includes hidden templates and runs through offline npm exec', { timeout: 120000, skip: !process.env.npm_execpath && 'Run npm test to exercise actual npm packaging.' }, async t => {
  const temporary = await mkdtemp(join(tmpdir(), 'ahfora-package-'));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const npm = process.env.npm_execpath;
  const cache = join(temporary, 'cache');
  const { stdout } = await exec(process.execPath, [npm, 'pack', '--ignore-scripts', '--json', '--pack-destination', temporary, '--cache', cache], { cwd: root, maxBuffer: 4 * 1024 * 1024 });
  const [pack] = JSON.parse(stdout);
  const paths = pack.files.map(file => file.path);
  for (const required of ['bin/ahfora.js', 'src/scaffold.js', 'templates/core/AGENTS.md', 'templates/core/_gitignore', 'templates/core/.ahfora/workflow.md', 'templates/core/.agents/skills/ahfora-sdd/SKILL.md', 'assets/ahfora-logo.svg', 'LICENSE', 'README.md', 'CONTRIBUTING.md', 'CHANGELOG.md']) {
    assert.ok(paths.includes(required), `Missing package file: ${required}`);
  }
  assert.equal(paths.some(path => path.startsWith('test/')), false);
  assert.equal(paths.some(path => path.startsWith('.github/')), false);
  const destination = join(temporary, 'installed project');
  const result = await exec(process.execPath, [npm, 'exec', '--offline', '--yes', '--ignore-scripts', '--cache', cache, '--package', join(temporary, pack.filename), '--', 'ahfora', 'init', destination, '--clients', 'all'], { cwd: temporary, timeout: 90000, maxBuffer: 1024 * 1024 });
  assert.match(result.stdout, /installed in/);
  assert.match(result.stdout, /no activation prompt is needed/);
  assert.doesNotMatch(result.stdout, /ask it to read|bootstrap AHFORA/);
  assert.match(await readFile(join(destination, 'CLAUDE.md'), 'utf8'), /^@AGENTS\.md$/m);
  assert.match(await readFile(join(destination, 'GEMINI.md'), 'utf8'), /^@\.\/AGENTS\.md$/m);
  assert.match(await readFile(join(destination, 'AGENTS.md'), 'utf8'), /AHFORA orchestration contract/);
  assert.match(await readFile(join(destination, '.claude/agents/ahfora-planner.md'), 'utf8'), /MODEL GATE/);
  assert.match(await readFile(join(destination, '.gitignore'), 'utf8'), /\.ahfora\/state\/local/);
  assert.deepEqual(JSON.parse(await readFile(join(destination, '.ahfora/state/spec-ids.json'), 'utf8')), { schemaVersion: 1, lastIssued: 0, reservations: [] });
  assert.match(await readFile(join(destination, '.ahfora/templates/spec.md'), 'utf8'), /^id: "<four-digit-id>"$/m);
  assert.match(await readFile(join(destination, '.ahfora/spec-identity.md'), 'utf8'), /0001/);
});
