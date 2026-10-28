import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, rm, readdir, symlink, link } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { scaffold, planInstallation } from '../src/scaffold.js';

async function workspace(t) {
  const root = await mkdtemp(join(tmpdir(), 'ahfora-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test('generates a generic framework without application or CLI source files', async t => {
  const parent = await workspace(t);
  const root = join(parent, 'project with spaces');
  const result = await scaffold(root);
  assert.ok(result.entries.length >= 35);
  assert.ok(result.entries.every(entry => entry.action === 'create'));
  assert.match(await readFile(join(root, 'AGENTS.md'), 'utf8'), /Engram must actually be available/);
  assert.match(await readFile(join(root, '.ahfora/LICENSE'), 'utf8'), /Copyright \(c\) 2026 Deiver/);
  assert.deepEqual(JSON.parse(await readFile(join(root, '.ahfora/manifest.json'))).requestedAdapters, []);
  assert.equal(result.entries.some(entry => /\.(js|mjs|ts)$/.test(entry.path)), false);
  assert.equal(result.entries.some(entry => entry.path === 'package.json'), false);
  assert.equal(result.entries.some(entry => entry.path.startsWith('.claude/')), false);
  await assert.rejects(readFile(join(root, '.ahfora-install.lock')), { code: 'ENOENT' });
});

test('dry run creates neither destination nor lock nor files', async t => {
  const parent = await workspace(t);
  const root = join(parent, 'not-created');
  const plan = await scaffold(root, ['claude'], { dryRun: true });
  assert.ok(plan.entries.some(entry => entry.path === 'CLAUDE.md'));
  assert.deepEqual(await readdir(parent), []);
});

test('repeated installation is idempotent and preserves customized artifacts', async t => {
  const root = await workspace(t);
  await scaffold(root, ['opencode']);
  const original = await readFile(join(root, 'AGENTS.md'), 'utf8');
  const second = await scaffold(root, ['opencode']);
  assert.ok(second.entries.every(entry => entry.action === 'unchanged'));
  const custom = '# Custom architecture\nDo not replace.\n';
  await writeFile(join(root, 'docs/constitution.md'), custom);
  await writeFile(join(root, '.agents/skills/ahfora-solid/SKILL.md'), 'Approved local improvement\n');
  const third = await scaffold(root, ['opencode']);
  assert.equal(third.entries.find(entry => entry.path === 'docs/constitution.md').action, 'preserve');
  assert.equal(await readFile(join(root, 'docs/constitution.md'), 'utf8'), custom);
  assert.equal(await readFile(join(root, '.agents/skills/ahfora-solid/SKILL.md'), 'utf8'), 'Approved local improvement\n');
  assert.equal(await readFile(join(root, 'AGENTS.md'), 'utf8'), original);
});

test('merges instruction entry points once and preserves original CRLF content', async t => {
  const root = await workspace(t);
  const originals = { 'AGENTS.md': '# Team rules\r\nKeep this.\r\n', 'CLAUDE.md': '# Personal project instructions\n', 'GEMINI.md': '# Gemini rules\n' };
  for (const [path, content] of Object.entries(originals)) await writeFile(join(root, path), content);
  await writeFile(join(root, '.gitignore'), 'secrets/\n');
  await scaffold(root, ['claude', 'gemini']);
  await scaffold(root, ['claude', 'gemini']);
  for (const [path, content] of Object.entries(originals)) {
    const installed = await readFile(join(root, path), 'utf8');
    assert.ok(installed.startsWith(content));
    assert.equal(installed.split('<!-- ahfora:begin -->').length - 1, 1);
  }
  const ignore = await readFile(join(root, '.gitignore'), 'utf8');
  assert.ok(ignore.startsWith('secrets/\n'));
  assert.equal(ignore.split('/.ahfora/state/local/').length - 1, 1);
});

test('all native adapters reference canonical contracts and guard planner routing', async t => {
  const root = await workspace(t);
  await scaffold(root, ['claude', 'opencode', 'gemini']);
  for (const client of ['claude', 'opencode', 'gemini']) {
    for (const role of ['spec-author', 'planner', 'developer', 'qa-engineer']) {
      const adapter = await readFile(join(root, `.${client}/agents/ahfora-${role}.md`), 'utf8');
      assert.match(adapter, new RegExp(`\\.ahfora/agents/${role}\\.md`));
      assert.match(adapter, /Do not spawn nested subagents/);
      assert.doesNotMatch(adapter, /^model: /m);
      if (role === 'planner') assert.match(adapter, /MODEL GATE/);
    }
  }
  const bridge = await readFile(join(root, '.claude/skills/ahfora-sdd/SKILL.md'), 'utf8');
  assert.match(bridge, /\.agents\/skills\/ahfora-sdd\/SKILL\.md/);
  assert.match(bridge, /Return blocked if it cannot be read/);
  assert.match(await readFile(join(root, '.opencode/agents/ahfora-spec-author.md'), 'utf8'), /"specs\/\*\*": allow/);
});

test('adding an adapter preserves existing choices and project configuration', async t => {
  const root = await workspace(t);
  await scaffold(root, ['opencode']);
  const projectPath = join(root, '.ahfora/project.json');
  const project = JSON.parse(await readFile(projectPath, 'utf8'));
  project.modelProfiles['high-reasoning'].opencode = 'provider/user-chosen-model';
  await writeFile(projectPath, JSON.stringify(project));
  await scaffold(root, ['claude']);
  assert.deepEqual(JSON.parse(await readFile(join(root, '.ahfora/manifest.json'))).requestedAdapters, ['claude', 'opencode']);
  assert.equal(JSON.parse(await readFile(projectPath)).modelProfiles['high-reasoning'].opencode, 'provider/user-chosen-model');
});

test('preflights conflicting file types before writing any framework files', async t => {
  const root = await workspace(t);
  await mkdir(join(root, 'docs'));
  await mkdir(join(root, 'docs/constitution.md'));
  await assert.rejects(scaffold(root), /Expected a regular file/);
  assert.deepEqual((await readdir(root)).sort(), ['docs']);
});

test('refuses symlinked generated paths without touching the linked directory', async t => {
  const parent = await workspace(t);
  const root = join(parent, 'project');
  const outside = join(parent, 'external');
  await mkdir(root);
  await mkdir(outside);
  await symlink(outside, join(root, '.ahfora'), 'junction');
  await assert.rejects(scaffold(root), /Refusing symbolic link/);
  assert.deepEqual(await readdir(outside), []);
  assert.deepEqual(await readdir(root), ['.ahfora']);
});

test('refuses shared hard-linked entry points that would modify another file', async t => {
  const root = await workspace(t);
  await writeFile(join(root, 'original.md'), '# User instructions\n');
  await link(join(root, 'original.md'), join(root, 'AGENTS.md'));
  await assert.rejects(scaffold(root), /hard-linked file/);
  assert.equal(await readFile(join(root, 'original.md'), 'utf8'), '# User instructions\n');
});

test('invalid managed markers fail before changing user files', async t => {
  const root = await workspace(t);
  const original = '# User\n<!-- ahfora:begin -->\nMissing end';
  await writeFile(join(root, 'AGENTS.md'), original);
  await assert.rejects(scaffold(root), /Malformed AHFORA markers/);
  assert.equal(await readFile(join(root, 'AGENTS.md'), 'utf8'), original);
  assert.deepEqual(await readdir(root), ['AGENTS.md']);
});

test('incompatible and corrupt manifests are not overwritten', async t => {
  const root = await workspace(t);
  await mkdir(join(root, '.ahfora'));
  const path = join(root, '.ahfora/manifest.json');
  await writeFile(path, '{bad');
  await assert.rejects(scaffold(root), /Invalid .ahfora\/manifest/);
  assert.equal(await readFile(path, 'utf8'), '{bad');
  await writeFile(path, JSON.stringify({ framework: 'ahfora', version: '99.0.0' }));
  await assert.rejects(scaffold(root), /Incompatible AHFORA manifest/);
  assert.deepEqual(await readdir(root), ['.ahfora']);
});

test('an existing installer lock prevents writes and is not removed', async t => {
  const root = await workspace(t);
  await mkdir(join(root, '.ahfora-install.lock'));
  await writeFile(join(root, '.ahfora-install.lock/owner'), 'other installer');
  await assert.rejects(scaffold(root), /installation lock exists/);
  assert.equal(await readFile(join(root, '.ahfora-install.lock/owner'), 'utf8'), 'other installer');
  assert.deepEqual(await readdir(root), ['.ahfora-install.lock']);
});

test('parallel initializers do not produce duplicated instruction blocks', async t => {
  const root = await workspace(t);
  const results = await Promise.allSettled([scaffold(root, ['claude']), scaffold(root, ['claude'])]);
  assert.ok(results.some(result => result.status === 'fulfilled'));
  for (const result of results) if (result.status === 'rejected') assert.match(result.reason.message, /installation lock/);
  const instructions = await readFile(join(root, 'AGENTS.md'), 'utf8');
  assert.equal(instructions.split('<!-- ahfora:begin -->').length - 1, 1);
  assert.equal((await planInstallation(root, ['claude'])).entries.some(entry => entry.action === 'create'), false);
});
