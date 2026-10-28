import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, rm, readdir, symlink, link } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
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
      assert.match(adapter, /MODEL GATE/);
      if (client === 'opencode') {
        assert.match(adapter, /^  edit: allow$/m);
        assert.doesNotMatch(adapter, /edit:\s+deny|"\*": deny|"specs\/\*\*": allow/);
        if (role === 'planner') assert.match(adapter, /^  question: allow$/m);
      }
      if (role === 'planner') assert.match(adapter, /\.ahfora\/planning-dialogue\.md/);
      if (client === 'claude') assert.match(adapter, /^permissionMode: acceptEdits$/m);
    }
  }
  const bridge = await readFile(join(root, '.claude/skills/ahfora-sdd/SKILL.md'), 'utf8');
  assert.match(bridge, /\.agents\/skills\/ahfora-sdd\/SKILL\.md/);
  assert.match(bridge, /Return blocked if it cannot be read/);
  assert.equal(JSON.parse(await readFile(join(root, '.gemini/settings.json'), 'utf8')).general.defaultApprovalMode, 'auto_edit');
});

test('existing Gemini configuration is preserved rather than granting broader permissions silently', async t => {
  const root = await workspace(t);
  await mkdir(join(root, '.gemini'));
  const settings = '{"general":{"defaultApprovalMode":"default"},"ui":{"vimMode":true}}\n';
  await writeFile(join(root, '.gemini/settings.json'), settings);
  const result = await scaffold(root, ['gemini']);
  assert.equal(result.entries.find(entry => entry.path === '.gemini/settings.json').action, 'preserve');
  assert.equal(await readFile(join(root, '.gemini/settings.json'), 'utf8'), settings);
});

test('native context imports resolve the canonical contract while preserving user instructions', async t => {
  const root = await workspace(t);
  for (const file of ['CLAUDE.md', 'GEMINI.md']) await writeFile(join(root, file), '# Existing project rules\n');
  await scaffold(root, ['claude', 'opencode', 'gemini']);
  await scaffold(root, ['claude', 'opencode', 'gemini']);
  for (const file of ['CLAUDE.md', 'GEMINI.md']) {
    const entryPoint = await readFile(join(root, file), 'utf8');
    assert.ok(entryPoint.startsWith('# Existing project rules\n'));
    const imports = [...entryPoint.matchAll(/^@([^\s]+)$/gm)];
    assert.equal(imports.length, 1, `${file} must import the contract exactly once`);
    const importedPath = resolve(dirname(join(root, file)), imports[0][1]);
    assert.equal(importedPath, join(root, 'AGENTS.md'));
    const contract = await readFile(importedPath, 'utf8');
    assert.match(contract, /## Automatic activation/);
    assert.match(contract, /## Start here/);
  }
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

test('reinstall preserves issued spec numbers, legacy aliases and user-authored specs', async t => {
  const root = await workspace(t);
  await scaffold(root);
  const registryPath = join(root, '.ahfora/state/spec-ids.json');
  assert.deepEqual(JSON.parse(await readFile(registryPath, 'utf8')), { schemaVersion: 1, lastIssued: 0, reservations: [] });
  const registry = {
    schemaVersion: 1,
    lastIssued: 3,
    reservations: [
      { id: '0001', specPath: 'specs/0001-task-manager', reservedAt: '2026-10-28T00:00:00Z', reservedBy: 'test owner', legacyIds: ['previous-long-spec-id'] },
      { id: '0003', specPath: 'specs/0003-retired-change', reservedAt: '2026-10-28T00:00:01Z', reservedBy: 'test owner', legacyIds: [] },
    ],
  };
  const serialized = `${JSON.stringify(registry, null, 2)}\n`;
  await writeFile(registryPath, serialized);
  await mkdir(join(root, 'specs/0001-task-manager'));
  const spec = '---\nid: "0001"\n---\n# User-authored requirements\n';
  await writeFile(join(root, 'specs/0001-task-manager/spec.md'), spec);
  const result = await scaffold(root, ['claude']);
  assert.equal(result.entries.find(entry => entry.path === '.ahfora/state/spec-ids.json').action, 'preserve');
  assert.equal(await readFile(registryPath, 'utf8'), serialized);
  assert.equal(await readFile(join(root, 'specs/0001-task-manager/spec.md'), 'utf8'), spec);
  assert.deepEqual((await readdir(join(root, 'specs'))).sort(), ['0001-task-manager', 'README.md']);
});

test('new native roles use user-selected per-client models and preserve later overrides', async t => {
  const root = await workspace(t);
  await mkdir(join(root, '.ahfora'));
  const selected = { claude: 'claude-user-choice', opencode: 'provider/user-choice', gemini: 'gemini-user-choice' };
  const project = { modelProfiles: { 'user-selected': selected, 'high-reasoning': { ...selected, opencode: 'provider/user-planner-choice' } } };
  const configPath = join(root, '.ahfora/project.json');
  await writeFile(configPath, JSON.stringify(project));
  await scaffold(root, ['claude', 'opencode', 'gemini']);
  for (const client of Object.keys(selected)) {
    for (const role of ['spec-author', 'planner', 'developer', 'qa-engineer']) {
      const content = await readFile(join(root, `.${client}/agents/ahfora-${role}.md`), 'utf8');
      const actual = JSON.parse(content.match(/^model: (.+)$/m)[1]);
      assert.equal(actual, client === 'opencode' && role === 'planner' ? 'provider/user-planner-choice' : selected[client]);
    }
  }
  const path = join(root, '.opencode/agents/ahfora-developer.md');
  const before = await readFile(path, 'utf8');
  project.modelProfiles['user-selected'].opencode = 'provider/new-user-choice';
  await writeFile(configPath, JSON.stringify(project));
  const repeated = await scaffold(root, ['opencode']);
  assert.equal(repeated.entries.find(entry => entry.path === '.opencode/agents/ahfora-developer.md').action, 'preserve');
  assert.equal(await readFile(path, 'utf8'), before);
});

test('invalid model configuration fails before any framework files are generated', async t => {
  const root = await workspace(t);
  await mkdir(join(root, '.ahfora'));
  for (const model of [123, 'bad\nmodel', 'inherit', 'high-reasoning']) {
    await writeFile(join(root, '.ahfora/project.json'), JSON.stringify({ modelProfiles: { 'user-selected': { opencode: model } } }));
    await assert.rejects(scaffold(root, ['opencode']), /model/i);
    assert.deepEqual(await readdir(root), ['.ahfora']);
  }
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
