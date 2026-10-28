import { resolve } from 'node:path';
import { clients } from './adapters.js';
import { packageInfo, scaffold } from './scaffold.js';

const help = `AHFORA — Agnostic Harness for Agents

Usage:
  ahfora [init] [directory] [--clients <list>] [--dry-run]
  ahfora --help
  ahfora --version

Options:
  --clients <list>  generic (default), all, or comma-separated claude,opencode,gemini
  --dry-run        Preview installation without changing files
  -h, --help       Show this help
  -v, --version    Show the package version

Examples:
  npx ahfora@latest init . --clients all
  npx ahfora@latest init my-project --clients opencode
  npx ahfora@latest init . --dry-run

Creates instructions, skills, templates, and optional client adapters.
Your AI manages specs and tasks. Engram is required before the SDD workflow starts.
Existing customized files are preserved. Review reported preserved files.
`;

export function parseArgs(args) {
  const tokens = args[0] === 'init' ? args.slice(1) : [...args];
  if (tokens.length === 1 && ['-h', '--help'].includes(tokens[0])) return { help: true };
  if (tokens.length === 1 && ['-v', '--version'].includes(tokens[0])) return { version: true };
  let target;
  let rawClients = 'generic';
  let dryRun = false;
  let seenClients = false;
  for (let i = 0; i < tokens.length; i++) {
    const arg = tokens[i];
    if (arg === '--dry-run') dryRun = true;
    else if (arg === '--clients' || arg.startsWith('--clients=')) {
      if (seenClients) throw new Error('Use --clients once, with a comma-separated list.');
      seenClients = true;
      rawClients = arg === '--clients' ? tokens[++i] : arg.slice('--clients='.length);
      if (!rawClients || rawClients.startsWith('-')) throw new Error('--clients requires a value.');
    } else if (arg.startsWith('-')) throw new Error(`Unknown option: ${arg}. Use --help.`);
    else if (target !== undefined) throw new Error('Provide only one destination directory.');
    else target = arg;
  }
  let selected;
  if (rawClients === 'all') selected = [...clients];
  else if (rawClients === 'generic') selected = [];
  else {
    selected = [...new Set(rawClients.split(',').map(value => value.trim()))];
    if (selected.some(value => !clients.includes(value))) throw new Error('Unknown client. Choose generic, all, or claude,opencode,gemini.');
  }
  return { target: target ?? '.', selected, dryRun };
}

export async function run(args, { cwd = process.cwd(), stdout = process.stdout, stderr = process.stderr } = {}) {
  let options;
  try { options = parseArgs(args); }
  catch (error) { stderr.write(`AHFORA: ${error.message}\n`); return 2; }
  if (options.help) { stdout.write(help); return 0; }
  if (options.version) { stdout.write(`${packageInfo.version}\n`); return 0; }
  try {
    const result = await scaffold(resolve(cwd, options.target), options.selected, { dryRun: options.dryRun });
    stdout.write(`AHFORA ${packageInfo.version} — ${options.dryRun ? 'preview' : 'installed'} in ${result.root}\n`);
    const counts = {};
    for (const entry of result.entries) {
      counts[entry.action] = (counts[entry.action] ?? 0) + 1;
      if (options.dryRun || entry.action === 'preserve') stdout.write(`  ${entry.action}: ${entry.path}\n`);
    }
    stdout.write(`${Object.entries(counts).map(([action, count]) => `${count} ${action}`).join(', ')}\n`);
    if (!options.dryRun) stdout.write('Next: open or restart your AI client and ask it to read AGENTS.md and bootstrap AHFORA. It must verify Engram and confirm project settings before starting a spec.\n');
    return 0;
  } catch (error) { stderr.write(`AHFORA: ${error.message}\n`); return 1; }
}
