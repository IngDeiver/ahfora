export const clients = ['claude', 'opencode', 'gemini'];

const roles = {
  'spec-author': 'Announces the assigned SPEC number and title, clarifies requirements, and writes a testable specification. Use for discovery, new specs, and requirement changes.',
  planner: 'Discusses design decisions with the user, waits for needed answers, and writes the approved specification\'s plan and tasks using the confirmed high-reasoning model.',
  developer: 'Implements approved tasks within their declared file ownership and returns evidence or blockers.',
  'qa-engineer': 'Creates and executes requirement-driven tests and reports independent verification evidence and reproducible failures.',
};

const defaultProfiles = {
  'spec-author': 'user-selected',
  planner: 'high-reasoning',
  developer: 'user-selected',
  'qa-engineer': 'user-selected',
};

function selectedModel(project, client, role) {
  const profile = project.roleModelProfiles?.[role] ?? defaultProfiles[role];
  if (typeof profile !== 'string' || !profile.trim()) throw new Error(`Invalid model profile for ${role}.`);
  const model = project.modelProfiles?.[profile]?.[client];
  if (model === null || model === undefined) return null;
  if (typeof model !== 'string' || !model.trim() || model !== model.trim() || /[\x00-\x1f\x7f]/.test(model)) {
    throw new Error(`Invalid model selection for ${client}/${role}; use a model identifier or null.`);
  }
  if (['user-selected', 'high-reasoning', 'inherit'].includes(model)) {
    throw new Error(`Store the actual selected model for ${client}/${role}, not the profile or inheritance label.`);
  }
  return model;
}

export function adapterFiles(selected, project = {}) {
  const files = new Map();
  for (const client of selected) {
    for (const [role, description] of Object.entries(roles)) {
      const name = `ahfora-${role}`;
      const fields = [`name: ${name}`, `description: ${JSON.stringify(description)}`];
      const model = selectedModel(project, client, role);
      if (model) fields.push(`model: ${JSON.stringify(model)}`);
      if (client === 'opencode') {
        fields.push('mode: subagent', 'permission:', '  task: deny', '  edit: allow');
        if (role === 'spec-author' || role === 'planner') {
          fields.push('  bash: ask');
        }
        if (role === 'planner') fields.push('  question: allow');
      }
      if (client === 'claude') fields.push('disallowedTools: Agent', 'permissionMode: acceptEdits');
      if (client === 'gemini') fields.push('kind: local', 'max_turns: 40');
      files.set(`.${client}/agents/${name}.md`, `---
${fields.join('\n')}
---

# AHFORA ${role}

Read these files from the project root before acting:

1. \`AGENTS.md\` and \`docs/constitution.md\`.
2. \`.ahfora/workflow.md\`, \`.ahfora/models.md\` and \`.ahfora/agents/${role}.md\`.
3. The assigned spec artifacts and the skills required by that role.

The canonical role contract is mandatory. Return blocked if any required file is unavailable. Resolve canonical skill resources relative to their original skill directory, not this adapter.

${role === 'planner' ? 'Only the main orchestrator delegates other roles and records user approvals. Ask design questions directly when a supported user-question tool is available; otherwise return needs-input with the exact questions for the orchestrator to relay. Follow `.ahfora/planning-dialogue.md` and wait for the user before continuing.' : 'Only the main orchestrator delegates other roles or asks the user for approvals. Return questions and handoff requests to it.'} Do not spawn nested subagents. Do not assume access to the parent's conversation or Engram tools.

MODEL GATE: before doing this role's work, require a handoff confirming the user's selected model and effective routing for this role. Follow \`.ahfora/models.md\`. An omitted model field or inheritance label is not proof of the user's choice. If confirmation is missing, return needs-input so the orchestrator asks the user before work proceeds. Never silently choose another model.
${role === 'planner' ? '\nThe planner uses the user-confirmed high-reasoning profile, which may be the same model as other roles.\n' : ''}${role === 'qa-engineer' ? '\nFor a reproducible implementation failure, return next_role: developer with a correction request. The orchestrator dispatches developer and then returns the integrated result to you for re-verification.\n' : ''}`);
    }
    if (client === 'claude' || client === 'gemini') {
      const file = client === 'claude' ? 'CLAUDE.md' : 'GEMINI.md';
      const imported = client === 'claude' ? '@AGENTS.md' : '@./AGENTS.md';
      files.set(file, `<!-- ahfora:begin -->\n# AHFORA project instructions\n\n${imported}\n\nApply the imported orchestration contract automatically when the user requests development, a fix or continuation. Do not ask the user to activate AHFORA, name a role, or request that you read instructions. Perform readiness checks and ask only for missing decisions and required approvals. If the import was not resolved, read \`AGENTS.md\` from this project root yourself before acting; stop if it is unavailable.\n<!-- ahfora:end -->\n`);
    }
    if (client === 'gemini') {
      files.set('.gemini/settings.json', `${JSON.stringify({ general: { defaultApprovalMode: 'auto_edit' } }, null, 2)}\n`);
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
