export const clients = ['claude', 'opencode', 'gemini'];

const roles = {
  'spec-author': 'Clarifies requirements and writes an unambiguous, testable specification. Use for discovery, new specs, and requirement changes.',
  planner: 'Designs an approved specification and writes its plan and tasks. Requires an explicitly confirmed high-reasoning model.',
  developer: 'Implements approved tasks within their declared file ownership and returns evidence or blockers.',
  'qa-engineer': 'Creates and executes requirement-driven tests and reports independent verification evidence and reproducible failures.',
};

export function adapterFiles(selected) {
  const files = new Map();
  for (const client of selected) {
    for (const [role, description] of Object.entries(roles)) {
      const name = `ahfora-${role}`;
      const fields = [`name: ${name}`, `description: ${JSON.stringify(description)}`];
      if (client === 'opencode') {
        fields.push('mode: subagent', 'permission:', '  task: deny');
        if (role === 'spec-author' || role === 'planner') {
          fields.push('  edit:', '    "*": deny', '    "specs/**": allow', '  bash: ask');
        }
      }
      if (client === 'claude') fields.push('disallowedTools: Agent');
      if (client === 'gemini') fields.push('kind: local', 'max_turns: 40');
      files.set(`.${client}/agents/${name}.md`, `---\n${fields.join('\n')}\n---\n\n# AHFORA ${role}\n\nRead these files from the project root before acting:\n\n1. \`AGENTS.md\` and \`docs/constitution.md\`.\n2. \`.ahfora/workflow.md\` and \`.ahfora/agents/${role}.md\`.\n3. The assigned spec artifacts and the skills required by that role.\n\nThe canonical role contract is mandatory. Return blocked if any required file is unavailable. Resolve canonical skill resources relative to their original skill directory, not this adapter.\n\nOnly the main orchestrator delegates other roles or asks the user for approvals. Return questions and handoff requests to it. Do not spawn nested subagents. Do not assume access to the parent's conversation or Engram tools.\n\n${role === 'planner' ? 'MODEL GATE: before planning, require a delegation record confirming the actual model against the project high-reasoning profile. An omitted model field inherits the client default; it does NOT prove the profile is satisfied. Return blocked if confirmation is missing.\n' : ''}`);
    }
    if (client === 'claude') {
      files.set('CLAUDE.md', '<!-- ahfora:begin -->\n# AHFORA entry point\n\nRead and follow `AGENTS.md` in this project root before any project work. It is the canonical orchestration contract. Read referenced files using your file tools.\n<!-- ahfora:end -->\n');
    }
    if (client === 'gemini') {
      files.set('GEMINI.md', '<!-- ahfora:begin -->\n# AHFORA entry point\n\nRead and follow `AGENTS.md` in this project root before any project work. It is the canonical orchestration contract. Read referenced files using your file tools.\n<!-- ahfora:end -->\n');
    }
  }
  return files;
}

export function claudeSkillBridges(coreFiles) {
  const files = new Map();
  for (const [path, content] of coreFiles) {
    const match = /^\.agents\/skills\/([^/]+)\/SKILL\.md$/.exec(path);
    if (!match) continue;
    const name = match[1];
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---\n/);
    if (!frontmatter) throw new Error(`Missing skill metadata: ${path}`);
    files.set(`.claude/skills/${name}/SKILL.md`, `---\n${frontmatter[1]}\n---\n\n# AHFORA skill bridge\n\nRead \`${path}\` from the project root and follow the complete canonical skill before acting. Return blocked if it cannot be read. Resolve all assets and references relative to \`.agents/skills/${name}/\`. This bridge contains no independent workflow rules; approved local improvements belong in the canonical skill.\n`);
  }
  return files;
}
