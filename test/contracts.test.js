import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../templates/core/', import.meta.url));
async function filesIn(path) {
  const result = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const file = join(path, entry.name);
    if (entry.isDirectory()) result.push(...await filesIn(file));
    else result.push(file);
  }
  return result;
}

test('all canonical skill metadata is portable and each skill is registered', async () => {
  const registry = await readFile(join(root, 'AGENTS.md'), 'utf8');
  const skills = await readdir(join(root, '.agents/skills'));
  assert.equal(skills.length, 7);
  for (const name of skills) {
    const content = await readFile(join(root, `.agents/skills/${name}/SKILL.md`), 'utf8');
    assert.match(content, new RegExp(`^---\\nname: ${name}\\n`));
    assert.match(content, /^description: ".+"$/m);
    assert.match(content, /^license: MIT$/m);
    assert.match(content, /^  author: Deiver$/m);
    assert.ok(registry.includes(`\`${name}\``));
    assert.ok(content.split('\n').length < 500);
    assert.match(content, /## Commands/);
  }
});

test('all local Markdown resource links resolve in the generated layout', async () => {
  for (const file of await filesIn(root)) {
    if (!file.endsWith('.md')) continue;
    const content = await readFile(file, 'utf8');
    for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1];
      if (/^(https?:|#)/.test(target)) continue;
      await assert.doesNotReject(access(resolve(dirname(file), target.split('#')[0])), `${file}: ${target}`);
    }
  }
});

test('project defaults and artifact templates preserve pending decisions', async () => {
  const config = JSON.parse(await readFile(join(root, '.ahfora/project.json')));
  assert.equal(config.memory.required, true);
  assert.equal(config.memory.provider, 'engram');
  assert.equal(config.testing.maxCorrectionRounds, 3);
  assert.equal(config.testing.e2e, 'ask-per-spec');
  assert.ok(Object.values(config.modelProfiles['high-reasoning']).every(value => value === null));
  const state = JSON.parse(await readFile(join(root, '.ahfora/templates/spec-state.json')));
  assert.equal(state.phase, 'specifying');
  assert.ok(Object.values(state.approvals).every(value => value === null));
  const plan = await readFile(join(root, '.ahfora/templates/plan.md'), 'utf8');
  assert.match(plan, /pending user answer/);
  const verification = await readFile(join(root, '.ahfora/templates/verification.md'), 'utf8');
  assert.match(verification, /Result: not-run/);
  assert.match(verification, /\*\*pending\*\*/);
});

test('repository documentation references shipped documentation and assets', async () => {
  const repository = fileURLToPath(new URL('../', import.meta.url));
  const documents = [join(repository, 'README.md'), join(repository, 'CONTRIBUTING.md'), ...(await filesIn(join(repository, 'docs'))).filter(file => file.endsWith('.md'))];
  for (const file of documents) {
    const content = await readFile(file, 'utf8');
    const targets = [...content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map(match => match[1]);
    targets.push(...[...content.matchAll(/<img[^>]+src="([^"]+)"/g)].map(match => match[1]));
    for (const target of targets) {
      if (/^(https?:|#)/.test(target)) continue;
      await assert.doesNotReject(access(resolve(dirname(file), target.split('#')[0])), `${file}: ${target}`);
    }
  }
});
