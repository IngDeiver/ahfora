import { lstat, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { adapterFiles, claudeSkillBridges, clients } from './adapters.js';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
export const packageInfo = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
const begin = '<!-- ahfora:begin -->';
const end = '<!-- ahfora:end -->';
const sharedFiles = new Set(['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', '.gitignore']);

async function statIfExists(path) {
  try { return await lstat(path); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function readTemplates(directory, prefix = '', result = new Map()) {
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name === '_gitignore' ? '.gitignore' : entry.name;
    if (entry.isDirectory()) await readTemplates(join(directory, entry.name), relative, result);
    else if (entry.isFile()) result.set(relative, await readFile(join(directory, entry.name), 'utf8'));
    else throw new Error(`Unsupported template entry: ${relative}`);
  }
  return result;
}

async function assertSafePath(root, relative) {
  const rootStat = await statIfExists(root);
  if (rootStat && (!rootStat.isDirectory() || rootStat.isSymbolicLink())) {
    throw new Error(`Destination must be a real directory: ${root}`);
  }
  const parts = relative.split('/');
  let path = root;
  for (let i = 0; i < parts.length; i++) {
    path = join(path, parts[i]);
    const stat = await statIfExists(path);
    if (!stat) continue;
    if (stat.isSymbolicLink()) throw new Error(`Refusing symbolic link: ${path}`);
    if (i < parts.length - 1 && !stat.isDirectory()) throw new Error(`Expected a directory: ${path}`);
    if (i === parts.length - 1 && !stat.isFile()) throw new Error(`Expected a regular file: ${path}`);
  }
}

function normalize(text) { return text.replaceAll('\r\n', '\n'); }

function mergeShared(path, current, generated) {
  if (path === '.gitignore') {
    const rules = normalize(current).split('\n').map(line => line.trim());
    if (rules.includes('/.ahfora/state/local/') && rules.includes('/.ahfora-install.lock/')) return current;
    return `${current}${current.endsWith('\n') ? '' : '\n'}\n${generated}`;
  }
  const normalized = normalize(current);
  const block = generated.slice(generated.indexOf(begin), generated.indexOf(end) + end.length);
  const starts = normalized.split(begin).length - 1;
  const ends = normalized.split(end).length - 1;
  if (starts === 0 && ends === 0) return `${current}${current.endsWith('\n') ? '' : '\n'}\n${block}\n`;
  if (starts !== 1 || ends !== 1 || normalized.indexOf(end) < normalized.indexOf(begin)) {
    throw new Error(`Malformed AHFORA markers in ${path}; repair them before installing.`);
  }
  // Local improvements and user content are deliberately preserved, including managed blocks.
  return current;
}

export async function planInstallation(destination, selected = []) {
  const root = resolve(destination);
  if (selected.some(client => !clients.includes(client))) throw new Error('Unknown client adapter.');
  const core = await readTemplates(join(packageRoot, 'templates', 'core'));
  const projectPath = '.ahfora/project.json';
  await assertSafePath(root, projectPath);
  let project = JSON.parse(core.get(projectPath));
  if (await statIfExists(join(root, projectPath))) {
    try { project = JSON.parse(await readFile(join(root, projectPath), 'utf8')); }
    catch { throw new Error('Invalid .ahfora/project.json; repair it before installing.'); }
    if (!project || typeof project !== 'object' || Array.isArray(project)) throw new Error('Project settings must be a JSON object.');
  }
  const files = new Map([...core, ...adapterFiles(selected, project)]);
  files.set('.ahfora/LICENSE', await readFile(join(packageRoot, 'LICENSE'), 'utf8'));
  if (selected.includes('claude')) for (const entry of claudeSkillBridges(core)) files.set(...entry);
  const manifestPath = '.ahfora/manifest.json';
  await assertSafePath(root, manifestPath);
  const existingManifest = await statIfExists(join(root, manifestPath));
  let manifest = { framework: 'ahfora', version: packageInfo.version, schemaVersion: 1, requestedAdapters: [] };
  if (existingManifest) {
    try { manifest = JSON.parse(await readFile(join(root, manifestPath), 'utf8')); }
    catch { throw new Error('Invalid .ahfora/manifest.json; repair it before installing.'); }
    if (!manifest || manifest.framework !== 'ahfora' || manifest.version !== packageInfo.version || manifest.schemaVersion !== 1 || !Array.isArray(manifest.requestedAdapters) || manifest.requestedAdapters.some(client => !clients.includes(client))) {
      throw new Error('Incompatible AHFORA manifest. Review the migration guide instead of overwriting it.');
    }
  }
  manifest.requestedAdapters = [...new Set([...manifest.requestedAdapters, ...selected])].sort();
  files.set(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  const entries = [];
  for (const [path, generated] of files) {
    await assertSafePath(root, path);
    const stat = await statIfExists(join(root, path));
    if (!stat) {
      entries.push({ path, action: 'create', content: generated, before: null });
      continue;
    }
    const before = await readFile(join(root, path), 'utf8');
    let content = before;
    if (sharedFiles.has(path)) content = mergeShared(path, before, generated);
    if (path === manifestPath) content = generated;
    const action = content !== before ? 'merge' : normalize(before) === normalize(generated) ? 'unchanged' : 'preserve';
    if (action === 'merge' && stat.nlink > 1) throw new Error(`Refusing to modify a hard-linked file: ${path}`);
    entries.push({ path, action, content, before, mode: stat.mode });
  }
  return { root, entries };
}

async function atomicReplace(path, content, mode) {
  const temporary = `${path}.ahfora-${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, content, { flag: 'wx', mode });
    await rename(temporary, path);
  } finally { await rm(temporary, { force: true }); }
}

export async function scaffold(destination, selected = [], { dryRun = false } = {}) {
  const preview = await planInstallation(destination, selected);
  if (dryRun) return preview;
  await mkdir(preview.root, { recursive: true });
  const lock = join(preview.root, '.ahfora-install.lock');
  try { await mkdir(lock); } catch (error) {
    if (error.code === 'EEXIST') throw new Error('An AHFORA installation lock exists. Wait for the other installer; remove a stale lock only after confirming no installer is running.');
    throw error;
  }
  try {
    const plan = await planInstallation(destination, selected);
    for (const entry of plan.entries) {
      if (!['create', 'merge'].includes(entry.action)) continue;
      await assertSafePath(plan.root, entry.path);
      const path = join(plan.root, entry.path);
      await mkdir(dirname(path), { recursive: true });
      if (entry.action === 'create') await writeFile(path, entry.content, { flag: 'wx' });
      else {
        if (await readFile(path, 'utf8') !== entry.before) throw new Error(`File changed during installation: ${entry.path}. Rerun after coordinating edits.`);
        await atomicReplace(path, entry.content, entry.mode);
      }
    }
    return plan;
  } finally { await rm(lock, { recursive: true, force: true }); }
}
