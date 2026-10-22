import { basename, dirname } from "./path.js";
import { defaultConfig, mergeConfig, parseRepositoryConfig, resolveRuleSetting } from "./config.js";
import {
  detectInstructionKind,
  instructionLabel,
  instructionScope,
  normalizeRepositoryPath,
  sortRepositoryFiles,
} from "./discovery.js";
import {
  estimateTokens,
  extractInstructionLines,
  extractPathReferences,
  jaccardSimilarity,
  parseFrontmatter,
  repositoryPathExists,
} from "./text.js";
import type {
  AgentLintConfig,
  AnalysisReport,
  AnalyzeOptions,
  Finding,
  FindingCategory,
  FindingSeverity,
  InstructionLine,
  Locale,
  RepositoryFile,
  ScopeGraph,
  ScoreMetrics,
} from "./types.js";

const managerLockfiles: Record<string, string[]> = {
  npm: ["package-lock.json", "npm-shrinkwrap.json"],
  pnpm: ["pnpm-lock.yaml"],
  yarn: ["yarn.lock"],
  bun: ["bun.lock", "bun.lockb"],
};

interface DangerousRule {
  ruleId: string;
  pattern: RegExp;
  subject: RegExp;
  title: string;
  message: string;
  suggestion: string;
  severity: FindingSeverity;
}

const dangerousRules: DangerousRule[] = [
  {
    ruleId: "security/force-push",
    pattern: /git\s+push\s+(?:[^\n]*\s)?(?:--force(?!-with-lease)|-f\b)/i,
    subject: /git\s+push.{0,30}(?:--force|-f\b)/i,
    title: "Dangerous force-push instruction",
    message: "The instruction permits rewriting remote Git history with an unconditional force push.",
    suggestion: "Require explicit user confirmation and prefer --force-with-lease on a non-protected branch.",
    severity: "error",
  },
  {
    ruleId: "security/force-with-lease",
    pattern: /git\s+push\s+(?:[^\n]*\s)?--force-with-lease/i,
    subject: /git\s+push.{0,30}--force-with-lease/i,
    title: "History rewrite should require confirmation",
    message: "Even --force-with-lease rewrites remote history and should not be performed silently.",
    suggestion: "State that the agent must ask before rewriting a remote branch.",
    severity: "warning",
  },
  {
    ruleId: "security/destructive-shell",
    pattern: /\brm\s+-rf\s+(?:\/|~|\.\.?\/?(?:\s|$))|\bdel\s+\/s\s+\/q\b/i,
    subject: /(?:rm\s+-rf|del\s+\/s\s+\/q)/i,
    title: "Destructive shell instruction",
    message: "The instruction contains a broad recursive-delete command.",
    suggestion: "Limit deletion to a named temporary directory and require confirmation.",
    severity: "error",
  },
  {
    ruleId: "security/pipe-to-shell",
    pattern: /(?:curl|wget)\b[^\n|]{0,200}\|\s*(?:sudo\s+)?(?:bash|sh|zsh)\b/i,
    subject: /(?:curl|wget).{0,200}\|.{0,20}(?:bash|sh|zsh)/i,
    title: "Remote script is piped directly to a shell",
    message: "Executing downloaded content without review creates a supply-chain risk.",
    suggestion: "Download to a file, verify its source or checksum, inspect it, and then execute explicitly.",
    severity: "error",
  },
  {
    ruleId: "security/hard-reset",
    pattern: /git\s+reset\s+--hard/i,
    subject: /git\s+reset\s+--hard/i,
    title: "Hard reset can discard work",
    message: "The instruction may permanently discard uncommitted changes.",
    suggestion: "Create a backup branch or stash changes and ask the user before resetting.",
    severity: "warning",
  },
  {
    ruleId: "security/no-verify",
    pattern: /(?:git\s+(?:commit|push)[^\n]*|npm\s+publish[^\n]*)--no-verify/i,
    subject: /--no-verify/i,
    title: "Verification hooks are bypassed",
    message: "The instruction bypasses repository safety and quality hooks.",
    suggestion: "Fix the hook failure instead of disabling verification, or document a narrow emergency exception.",
    severity: "warning",
  },
  {
    ruleId: "security/chmod-777",
    pattern: /chmod\s+(?:-R\s+)?777\b/i,
    subject: /chmod.{0,20}777/i,
    title: "World-writable permissions requested",
    message: "chmod 777 grants write access to every local user and process.",
    suggestion: "Use the minimum required owner/group permissions, such as 755 or 750.",
    severity: "warning",
  },
  {
    ruleId: "security/tls-disabled",
    pattern: /NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*0|(?:curl|wget)\b[^\n]*(?:--insecure|-k\b)/i,
    subject: /(?:NODE_TLS_REJECT_UNAUTHORIZED|--insecure|-k\b)/i,
    title: "TLS verification is disabled",
    message: "Disabling certificate verification exposes downloads and API traffic to interception.",
    suggestion: "Install the correct CA certificate or configure a trusted development proxy.",
    severity: "warning",
  },
  {
    ruleId: "security/broad-sudo",
    pattern: /(?:always|may|可以|允许).{0,20}\bsudo\b|\bsudo\s+(?:rm|chmod|chown|sh|bash)\b/i,
    subject: /\bsudo\b/i,
    title: "Broad privileged execution instruction",
    message: "The rule encourages commands with elevated operating-system privileges.",
    suggestion: "Name the exact privileged operation, explain why it is required, and require confirmation.",
    severity: "warning",
  },
  {
    ruleId: "security/no-confirmation",
    pattern: /(?:do not|never|don't)\s+(?:ask|request)\s+(?:for\s+)?confirmation|无需确认|不要.{0,4}确认/i,
    subject: /(?:confirmation|确认)/i,
    title: "Instruction suppresses user confirmation",
    message: "Autonomous execution without confirmation is risky for destructive or external actions.",
    suggestion: "Allow silent operation only for reversible local changes; require confirmation otherwise.",
    severity: "warning",
  },
  {
    ruleId: "security/production-data",
    pattern: /(?:modify|delete|drop|truncate|write).{0,30}(?:production|prod).{0,15}(?:database|db)|(?:生产|线上).{0,12}(?:数据库|数据).{0,12}(?:删除|修改|写入)/i,
    subject: /(?:production|prod|生产|线上).{0,30}(?:database|db|数据库|数据)/i,
    title: "Production-data modification instruction",
    message: "The instruction appears to authorize changes to production data.",
    suggestion: "Disallow production writes by default and require a separate audited workflow.",
    severity: "error",
  },
  {
    ruleId: "security/secret-exposure",
    pattern: /(?:print|echo|log|commit|upload|send).{0,30}(?:api[_ -]?keys?|secrets?|tokens?|\.env)|(?:输出|打印|提交|上传).{0,16}(?:密钥|令牌|\.env)/i,
    subject: /(?:api[_ -]?keys?|secrets?|tokens?|\.env|密钥|令牌)/i,
    title: "Instruction may expose secrets",
    message: "The rule appears to permit printing, committing or transmitting secret material.",
    suggestion: "Keep secrets out of logs and version control; use redaction and a secret manager.",
    severity: "error",
  },
  {
    ruleId: "security/skip-validation",
    pattern: /(?:skip|disable|ignore).{0,20}(?:tests?|type\s*check|lint)|(?:忽略|跳过|禁用).{0,12}(?:测试|类型检查|lint)/i,
    subject: /(?:tests?|type\s*check|lint|测试|类型检查)/i,
    title: "Validation is explicitly bypassed",
    message: "Skipping tests, linting or type checks can hide regressions.",
    suggestion: "Describe the fastest relevant validation command instead of disabling validation.",
    severity: "warning",
  },
];

const contradictionSubjects = [
  "prettier", "biome", "eslint", "typescript", "javascript", "jest", "vitest", "pytest",
  "tailwind", "react", "vue", "semicolons", "tabs", "spaces", "class components", "functional components",
];

export function analyzeRepository(inputFiles: RepositoryFile[], options: AnalyzeOptions = {}): AnalysisReport {
  const files = sortRepositoryFiles(
    inputFiles.map((file) => ({ ...file, path: normalizeRepositoryPath(file.path) })),
  );
  const fileByPath = new Map(files.map((file) => [file.path, file]));
  const allPaths = new Set(files.map((file) => file.path));
  const instructionSources = files.filter((file) => detectInstructionKind(file.path));
  const instructionLines = instructionSources.flatMap(extractInstructionLines);
  const repositoryConfig = parseRepositoryConfig(files);
  const config = mergeConfig(repositoryConfig.config, options.config);
  const locale: Locale = options.locale ?? config.locale ?? "en-US";
  const maxInstructionTokens = validNumber(config.maxInstructionTokens, 200, 100_000)
    ? config.maxInstructionTokens as number
    : defaultConfig.maxInstructionTokens;
  const duplicateSimilarity = validNumber(config.duplicateSimilarity, 0.5, 1)
    ? config.duplicateSimilarity as number
    : defaultConfig.duplicateSimilarity;
  const findings: Finding[] = [...repositoryConfig.findings];

  if (instructionSources.length === 0) {
    findings.push(makeFinding("coverage/no-instruction-files", "warning", "coverage", {
      title: "No agent instruction files found",
      message: "The repository does not contain a recognized AI coding-agent instruction file.",
      suggestion: "Add an AGENTS.md file with build, test, architecture and safety guidance.",
    }));
  }

  findings.push(...findInstructionFileProblems(instructionSources, maxInstructionTokens));
  findings.push(...findGuidanceGaps(files, instructionLines));
  findings.push(...findDuplicateInstructions(instructionLines));
  findings.push(...findNearDuplicateInstructions(instructionLines, duplicateSimilarity));
  findings.push(...findContradictions(instructionLines));
  findings.push(...findPackageManagerProblems(files, instructionLines));
  findings.push(...findMissingScripts(files, instructionLines));
  findings.push(...findMissingTaskTargets(files, instructionLines));
  findings.push(...findMissingPaths(allPaths, instructionLines));
  findings.push(...findDangerousInstructions(instructionLines));

  const uniqueFindings = findings.filter((finding, index, array) => array.findIndex((item) => item.id === finding.id) === index);
  const { active, suppressed } = applyConfigurationAndSuppressions(uniqueFindings, fileByPath, config);
  const orderedFindings = active.sort(compareFindings).map((finding) => localizeFinding(finding, locale));

  const instructionFiles = instructionSources.map((file) => {
    const kind = detectInstructionKind(file.path) ?? "unknown";
    return {
      path: file.path,
      kind,
      label: instructionLabel(kind, locale),
      estimatedTokens: estimateTokens(file.content),
      instructionCount: extractInstructionLines(file).length,
      lineCount: file.content ? file.content.split(/\r?\n/).length : 0,
      scope: describeScope(file, locale) ?? instructionScope(file.path, locale),
    };
  });

  const duplicateInstructions = countDuplicateLines(instructionLines);
  const estimatedTokens = instructionFiles.reduce((sum, file) => sum + file.estimatedTokens, 0);
  const avoidableTokens = estimateAvoidableTokens(instructionLines);
  const metrics = calculateMetrics(orderedFindings, instructionSources.length);
  const score = Math.round(
    metrics.coverage * 0.15 +
      metrics.consistency * 0.2 +
      metrics.validity * 0.25 +
      metrics.security * 0.25 +
      metrics.efficiency * 0.15,
  );

  const gradeKey = score >= 90 ? "excellent" : score >= 75 ? "good" : score >= 50 ? "needs-work" : "critical";
  const scopeGraph = buildScopeGraph(instructionFiles);

  return {
    schemaVersion: "1.2",
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    repositoryName: options.repositoryName,
    locale,
    score,
    gradeKey,
    grade: gradeLabel(gradeKey, locale),
    metrics,
    summary: {
      filesScanned: files.length,
      instructionFiles: instructionSources.length,
      instructions: instructionLines.length,
      errors: orderedFindings.filter((finding) => finding.severity === "error").length,
      warnings: orderedFindings.filter((finding) => finding.severity === "warning").length,
      suggestions: orderedFindings.filter((finding) => finding.severity === "info").length,
      estimatedTokens,
      duplicateInstructions,
      avoidableTokens,
      fixable: orderedFindings.filter((finding) => finding.fix?.safe && finding.fix.edits.length).length,
      suppressed,
    },
    instructionFiles,
    scopeGraph,
    findings: orderedFindings,
    config: { maxInstructionTokens, duplicateSimilarity },
  };
}

function findInstructionFileProblems(files: RepositoryFile[], maxTokens: number): Finding[] {
  const findings: Finding[] = [];
  for (const file of files) {
    const kind = detectInstructionKind(file.path);
    const lines = extractInstructionLines(file);
    const frontmatter = parseFrontmatter(file.content);
    const tokens = estimateTokens(file.content);

    if (!file.content.trim() || lines.length === 0) {
      findings.push(makeFinding("coverage/empty-instruction-file", "warning", "coverage", {
        title: "Instruction file contains no usable guidance",
        message: "The file is empty or contains only headings, comments and frontmatter.",
        file: file.path,
        suggestion: "Add concise, verifiable project instructions or remove the unused file.",
      }));
    }

    if (tokens > maxTokens) {
      findings.push(makeFinding("efficiency/file-too-large", "warning", "efficiency", {
        title: "Instruction file consumes a large context budget",
        message: `This file is estimated at ${tokens} tokens, above the configured ${maxTokens}-token limit.`,
        file: file.path,
        suggestion: "Move task-specific material into scoped rules, skills or referenced documentation.",
      }));
    }

    if (kind === "claude" && file.content.split(/\r?\n/).length > 200) {
      findings.push(makeFinding("efficiency/claude-line-count", "info", "efficiency", {
        title: "CLAUDE.md is longer than the recommended working size",
        message: "Long always-loaded instruction files consume context and may reduce instruction adherence.",
        file: file.path,
        suggestion: "Aim for fewer than 200 lines and move topic-specific guidance into .claude/rules/.",
        docs: "https://code.claude.com/docs/en/memory",
      }));
    }

    if (frontmatter.hasFrontmatter && !frontmatter.closed) {
      findings.push(makeFinding("validity/frontmatter-unclosed", "error", "validity", {
        title: "YAML frontmatter is not closed",
        message: "The file starts with --- but does not contain a closing --- delimiter.",
        file: file.path,
        line: 1,
        suggestion: "Add a closing --- line before the Markdown instructions.",
      }));
      continue;
    }

    if (/\.cursorrules$/i.test(file.path)) {
      findings.push(makeFinding("coverage/cursor-legacy-format", "info", "coverage", {
        title: "Legacy .cursorrules format detected",
        message: "Cursor still supports this file, but project rules in .cursor/rules provide scoping and metadata.",
        file: file.path,
        suggestion: "Migrate the content into one or more .cursor/rules/*.mdc files.",
        docs: "https://docs.cursor.com/context/rules",
      }));
    }

    if (/\.windsurfrules$/i.test(file.path)) {
      findings.push(makeFinding("coverage/windsurf-legacy-format", "info", "coverage", {
        title: "Legacy Windsurf rules file detected",
        message: "Workspace rules in .windsurf/rules/ are easier to scope and maintain.",
        file: file.path,
        suggestion: "Move the content into focused .windsurf/rules/*.md files.",
      }));
    }

    if (/\.cursor\/rules\/.+\.mdc$/i.test(file.path)) {
      if (!frontmatter.hasFrontmatter) {
        findings.push(makeFinding("validity/cursor-frontmatter", "warning", "validity", {
          title: "Cursor MDC rule has no frontmatter",
          message: "Cursor project rules use YAML frontmatter to control description, globs and activation.",
          file: file.path,
          line: 1,
          suggestion: "Add a frontmatter block with description, globs and alwaysApply as appropriate.",
        }));
      } else {
        const alwaysApply = scalar(frontmatter.data.alwaysApply);
        if (alwaysApply && !/^(?:true|false)$/i.test(alwaysApply)) {
          findings.push(makeFinding("validity/cursor-always-apply", "error", "validity", {
            title: "Cursor alwaysApply must be true or false",
            message: `The current value is “${alwaysApply}”.`,
            file: file.path,
            line: 1,
            suggestion: "Set alwaysApply to true or false.",
          }));
        }
        if (!scalar(frontmatter.data.description) && !scalar(frontmatter.data.globs) && alwaysApply !== "true") {
          findings.push(makeFinding("coverage/cursor-activation", "warning", "coverage", {
            title: "Cursor rule has no clear activation mode",
            message: "The rule has no description, globs or alwaysApply: true metadata.",
            file: file.path,
            line: 1,
            suggestion: "Define when the rule should be attached so it is not silently ignored.",
          }));
        }
      }
    }

    if (/\.github\/instructions\/.+\.instructions\.md$/i.test(file.path)) {
      if (!frontmatter.hasFrontmatter || !scalar(frontmatter.data.applyTo)) {
        findings.push(makeFinding("validity/copilot-apply-to", "error", "validity", {
          title: "Path-specific Copilot instructions are missing applyTo",
          message: "GitHub path-specific instruction files require an applyTo glob in YAML frontmatter.",
          file: file.path,
          line: 1,
          suggestion: "Add frontmatter such as applyTo: \"src/**/*.ts\".",
          docs: "https://docs.github.com/en/copilot/how-tos/custom-instructions/adding-repository-custom-instructions-for-github-copilot",
        }));
      }
    }

    if (/\.github\/agents\/.+\.md$/i.test(file.path)) {
      if (!frontmatter.hasFrontmatter || !scalar(frontmatter.data.description)) {
        findings.push(makeFinding("validity/copilot-agent-description", "error", "validity", {
          title: "Copilot custom agent is missing a description",
          message: "Custom agent profiles use YAML frontmatter and require a description of the agent's purpose.",
          file: file.path,
          line: 1,
          suggestion: "Add a concise description field to the frontmatter.",
          docs: "https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-custom-agents",
        }));
      }
    }
  }
  return findings;
}

function findGuidanceGaps(files: RepositoryFile[], lines: InstructionLine[]): Finding[] {
  if (lines.length === 0) return [];
  const scriptNames = collectPackageScripts(files);
  const normalized = lines.map((line) => line.normalized).join("\n");
  const checks: Array<{ ruleId: string; terms: RegExp; scripts: RegExp; title: string; suggestion: string }> = [
    {
      ruleId: "coverage/no-test-guidance",
      terms: /\b(?:test|tests|testing|pytest|vitest|jest)\b|测试/i,
      scripts: /(?:^|:)(?:test|check)(?::|$)/i,
      title: "No test guidance found",
      suggestion: "Document the fastest relevant test command and when a full test suite is required.",
    },
    {
      ruleId: "coverage/no-build-guidance",
      terms: /\b(?:build|compile|typecheck|type-check|tsc)\b|构建|编译|类型检查/i,
      scripts: /(?:^|:)(?:build|compile|typecheck|type-check)(?::|$)/i,
      title: "No build or type-check guidance found",
      suggestion: "Tell agents how to verify that the project builds or type-checks successfully.",
    },
    {
      ruleId: "coverage/no-lint-guidance",
      terms: /\b(?:lint|format|prettier|biome|eslint)\b|格式化/i,
      scripts: /(?:^|:)(?:lint|format)(?::|$)/i,
      title: "No lint or formatting guidance found",
      suggestion: "Document the project's lint or formatting command so generated changes match repository standards.",
    },
  ];

  return checks.flatMap((check) => {
    const relevantScript = [...scriptNames].some((script) => check.scripts.test(script));
    if (!relevantScript || check.terms.test(normalized)) return [];
    return [makeFinding(check.ruleId, "info", "coverage", {
      title: check.title,
      message: "The repository exposes a matching package script, but its agent instructions do not mention it.",
      suggestion: check.suggestion,
    })];
  });
}

function findDuplicateInstructions(lines: InstructionLine[]): Finding[] {
  const groups = new Map<string, InstructionLine[]>();
  for (const line of lines) {
    if (line.normalized.length < 16) continue;
    groups.set(line.normalized, [...(groups.get(line.normalized) ?? []), line]);
  }

  const findings: Finding[] = [];
  for (const [normalized, group] of groups) {
    if (group.length < 2 || new Set(group.map((line) => line.file)).size < 2) continue;
    const first = group[0];
    if (!first) continue;
    const locations = group.map((line) => `${line.file}:${line.line}`).join(", ");
    findings.push(makeFinding("efficiency/duplicate-instruction", "warning", "efficiency", {
      discriminator: normalized,
      title: "Duplicate instruction across agent files",
      message: `The same instruction appears ${group.length} times: ${locations}.`,
      file: first.file,
      line: first.line,
      evidence: first.text,
      suggestion: "Keep one canonical rule and import or generate tool-specific variants where supported.",
    }));
  }
  return findings.slice(0, 20);
}

function findNearDuplicateInstructions(lines: InstructionLine[], threshold: number): Finding[] {
  const candidates = lines.filter((line) => line.normalized.length >= 35);
  const findings: Finding[] = [];
  for (let leftIndex = 0; leftIndex < candidates.length; leftIndex += 1) {
    const left = candidates[leftIndex];
    if (!left) continue;
    for (let rightIndex = leftIndex + 1; rightIndex < candidates.length; rightIndex += 1) {
      const right = candidates[rightIndex];
      if (!right || left.file === right.file || left.normalized === right.normalized) continue;
      const similarity = jaccardSimilarity(left.text, right.text);
      if (similarity < threshold) continue;
      findings.push(makeFinding("efficiency/near-duplicate-instruction", "info", "efficiency", {
        discriminator: `${left.file}:${left.line}:${right.file}:${right.line}`,
        title: "Very similar instructions may waste context",
        message: `These rules are ${Math.round(similarity * 100)}% similar: ${left.file}:${left.line} and ${right.file}:${right.line}.`,
        file: left.file,
        line: left.line,
        evidence: left.text,
        suggestion: "Consolidate the shared part and keep only tool- or scope-specific differences.",
      }));
      if (findings.length >= 12) return findings;
    }
  }
  return findings;
}

function findContradictions(lines: InstructionLine[]): Finding[] {
  const findings: Finding[] = [];
  for (const subject of contradictionSubjects) {
    const positive = lines.filter((line) => instructionPolarity(line.text, subject) === "positive");
    const negative = lines.filter((line) => instructionPolarity(line.text, subject) === "negative");
    if (!positive.length || !negative.length) continue;
    const firstPositive = positive[0];
    const firstNegative = negative[0];
    if (!firstPositive || !firstNegative) continue;
    findings.push(makeFinding("consistency/contradictory-instructions", "warning", "consistency", {
      discriminator: subject,
      title: `Conflicting guidance about ${subject}`,
      message: `One instruction requires or prefers ${subject}, while another tells the agent to avoid it.`,
      file: firstNegative.file,
      line: firstNegative.line,
      evidence: `${firstPositive.file}:${firstPositive.line} — ${firstPositive.text}\n${firstNegative.file}:${firstNegative.line} — ${firstNegative.text}`,
      suggestion: "Choose one repository-wide policy or scope each rule to the directories where it applies.",
    }));
  }
  return findings;
}

function findPackageManagerProblems(files: RepositoryFile[], lines: InstructionLine[]): Finding[] {
  const findings: Finding[] = [];
  const sources = collectManagerSources(files);
  const byDirectory = new Map<string, Set<string>>();
  for (const source of sources) {
    const managers = byDirectory.get(source.directory) ?? new Set<string>();
    managers.add(source.manager);
    byDirectory.set(source.directory, managers);
  }

  for (const [directory, managers] of byDirectory) {
    if (managers.size <= 1) continue;
    findings.push(makeFinding("consistency/multiple-package-managers", "warning", "consistency", {
      discriminator: directory,
      title: "Multiple package managers detected in one scope",
      message: `${directory === "." ? "The repository root" : directory} declares artifacts for ${[...managers].join(", ")}.`,
      suggestion: "Keep one authoritative packageManager field and lockfile, or document an intentional nested workspace exception.",
    }));
  }

  for (const line of lines) {
    const mentioned = detectManagerCommand(line.text);
    if (!mentioned) continue;
    const authoritative = nearestManagerForFile(line.file, sources);
    if (!authoritative || mentioned === authoritative) continue;
    const replacement = replaceManager(line.raw, mentioned, authoritative);
    findings.push(makeFinding("consistency/package-manager", "warning", "consistency", {
      discriminator: `${line.file}:${line.line}:${mentioned}`,
      title: "Package-manager instruction conflicts with repository metadata",
      message: `This instruction uses ${mentioned}, but the nearest lockfile or packageManager field indicates ${authoritative}.`,
      file: line.file,
      line: line.line,
      evidence: line.text,
      suggestion: `Replace the command with the ${authoritative} equivalent, or explain why this scope is different.`,
      fix: replacement === line.raw ? undefined : {
        description: `Replace ${mentioned} with ${authoritative} on this instruction line.`,
        safe: true,
        edits: [{ file: line.file, line: line.line, replacement }],
      },
    }));
  }
  return findings;
}

function findMissingScripts(files: RepositoryFile[], lines: InstructionLine[]): Finding[] {
  const manifests = collectPackageManifests(files);
  if (manifests.length === 0) return [];
  const allScripts = new Set(manifests.flatMap((manifest) => [...manifest.scripts]));
  const findings: Finding[] = [];

  for (const line of lines) {
    for (const command of extractScriptCommands(line.text)) {
      const nearest = nearestPackageManifest(line.file, manifests);
      if (nearest?.scripts.has(command)) continue;
      if (allScripts.has(command)) {
        findings.push(makeFinding("validity/script-out-of-scope", "warning", "validity", {
          discriminator: `${line.file}:${line.line}:${command}`,
          title: `Script “${command}” exists only in another package`,
          message: "The command is not defined in the nearest package.json for this instruction file.",
          file: line.file,
          line: line.line,
          evidence: line.text,
          suggestion: "Name the workspace/package directory explicitly or use the correct workspace command.",
        }));
        continue;
      }
      findings.push(makeFinding("validity/missing-script", "error", "validity", {
        discriminator: `${line.file}:${line.line}:${command}`,
        title: `Script “${command}” does not exist`,
        message: "The instruction tells the agent to run a package script that is absent from every package.json scanned.",
        file: line.file,
        line: line.line,
        evidence: line.text,
        suggestion: `Add a “${command}” script or update the instruction to an existing command.`,
      }));
    }
  }
  return findings;
}

function findMissingTaskTargets(files: RepositoryFile[], lines: InstructionLine[]): Finding[] {
  const makeTargets = new Set<string>();
  const justTargets = new Set<string>();
  for (const file of files) {
    if (/(^|\/)Makefile$/i.test(file.path)) {
      for (const match of file.content.matchAll(/^([A-Za-z0-9_.-]+)\s*:(?![=])/gm)) if (match[1]) makeTargets.add(match[1]);
    }
    if (/(^|\/)Justfile$/i.test(file.path)) {
      for (const match of file.content.matchAll(/^([A-Za-z0-9_.-]+)(?:\s+[^:=]+)?\s*:(?![=])/gm)) if (match[1]) justTargets.add(match[1]);
    }
  }

  const findings: Finding[] = [];
  for (const line of lines) {
    for (const target of extractTaskTargets(line.text, "make")) {
      if (!makeTargets.size || makeTargets.has(target)) continue;
      findings.push(missingTaskFinding("make", target, line));
    }
    for (const target of extractTaskTargets(line.text, "just")) {
      if (!justTargets.size || justTargets.has(target)) continue;
      findings.push(missingTaskFinding("just", target, line));
    }
  }
  return findings;
}

function findMissingPaths(allPaths: Set<string>, lines: InstructionLine[]): Finding[] {
  const findings: Finding[] = [];
  for (const line of lines) {
    for (const reference of extractPathReferences(line.text)) {
      if (repositoryPathExists(allPaths, reference, line.file)) continue;
      findings.push(makeFinding("validity/missing-path", "warning", "validity", {
        discriminator: `${line.file}:${line.line}:${reference}`,
        title: `Referenced path “${reference}” was not found`,
        message: "The instruction references a file or directory that is not present in the repository tree.",
        file: line.file,
        line: line.line,
        evidence: line.text,
        suggestion: "Update the path, restore the referenced file, or remove the stale instruction.",
      }));
    }
  }
  return findings.slice(0, 50);
}

function findDangerousInstructions(lines: InstructionLine[]): Finding[] {
  const findings: Finding[] = [];
  for (const line of lines) {
    for (const rule of dangerousRules) {
      if (!rule.pattern.test(line.text)) continue;
      if (rule.ruleId !== "security/no-confirmation" && isExplicitProhibition(line.text, rule.subject)) continue;
      findings.push(makeFinding(rule.ruleId, rule.severity, "security", {
        discriminator: `${line.file}:${line.line}`,
        title: rule.title,
        message: rule.message,
        file: line.file,
        line: line.line,
        evidence: line.text,
        suggestion: rule.suggestion,
      }));
    }
  }
  return findings;
}

function applyConfigurationAndSuppressions(
  findings: Finding[],
  fileByPath: Map<string, RepositoryFile>,
  config: AgentLintConfig,
): { active: Finding[]; suppressed: number } {
  const active: Finding[] = [];
  let suppressed = 0;

  for (const finding of findings) {
    const setting = resolveRuleSetting(config, finding.ruleId, finding.severity);
    if (setting === "off" || isInlineSuppressed(finding, fileByPath.get(finding.file ?? "")?.content)) {
      suppressed += 1;
      continue;
    }
    active.push(setting === finding.severity ? finding : { ...finding, severity: setting });
  }
  return { active, suppressed };
}

function isInlineSuppressed(finding: Finding, content: string | undefined): boolean {
  if (!content || !finding.file) return false;
  const wholeFileDirectives = [...content.matchAll(/<!--\s*agentlint-disable(?!-next-line)\s+([^>]+?)\s*-->/gi)];
  if (wholeFileDirectives.some((match) => directiveMatches(match[1] ?? "", finding.ruleId))) return true;
  if (!finding.line || finding.line <= 1) return false;
  const previousLine = content.split(/\r?\n/)[finding.line - 2] ?? "";
  const nextLineDirective = previousLine.match(/<!--\s*agentlint-disable-next-line\s+([^>]+?)\s*-->/i);
  return Boolean(nextLineDirective && directiveMatches(nextLineDirective[1] ?? "", finding.ruleId));
}

function directiveMatches(value: string, ruleId: string): boolean {
  const patterns = value.split(/[\s,]+/).filter(Boolean);
  return patterns.some((pattern) => pattern === "*" || pattern === ruleId || (pattern.endsWith("/*") && ruleId.startsWith(pattern.slice(0, -1))));
}

interface FindingInput extends Omit<Partial<Finding>, "id" | "ruleId" | "severity" | "category" | "translations"> {
  title: string;
  message: string;
  discriminator?: string;
}

function makeFinding(
  ruleId: string,
  severity: FindingSeverity,
  category: FindingCategory,
  input: FindingInput,
): Finding {
  const { discriminator, ...rest } = input;
  const translations = translateFinding(ruleId, input);
  const fix = input.fix ? {
    ...input.fix,
    translations: input.fix.translations ?? {
      "en-US": input.fix.description,
      "zh-CN": translateFixDescription(ruleId, input.fix.description),
    },
  } : undefined;
  return {
    id: `${ruleId}/${stableHash(discriminator ?? `${input.file ?? "repo"}:${input.line ?? 0}:${input.title}`)}`,
    ruleId,
    severity,
    category,
    ...rest,
    fix,
    translations,
  };
}


function localizeFinding(finding: Finding, locale: Locale): Finding {
  const translated = finding.translations?.[locale];
  const fix = finding.fix ? {
    ...finding.fix,
    description: finding.fix.translations?.[locale] ?? finding.fix.description,
  } : undefined;
  return translated ? {
    ...finding,
    title: translated.title,
    message: translated.message,
    suggestion: translated.suggestion,
    fix,
  } : { ...finding, fix };
}

function gradeLabel(key: "excellent" | "good" | "needs-work" | "critical", locale: Locale): string {
  const labels = {
    excellent: ["Excellent", "优秀"],
    good: ["Good", "良好"],
    "needs-work": ["Needs work", "需要改进"],
    critical: ["Critical", "问题严重"],
  } as const;
  return labels[key][locale === "zh-CN" ? 1 : 0];
}

function buildScopeGraph(files: Array<{ path: string; kind: any; label: string; scope: string; estimatedTokens: number }>): ScopeGraph {
  const nodes = files.map((file, index) => ({
    id: `scope-${index}`,
    path: file.path,
    label: file.label,
    scope: file.scope,
    kind: file.kind,
    tokens: file.estimatedTokens,
  }));
  const edges: ScopeGraph["edges"] = [];
  for (let left = 0; left < nodes.length; left += 1) {
    for (let right = left + 1; right < nodes.length; right += 1) {
      const a = nodes[left];
      const b = nodes[right];
      if (!a || !b) continue;
      const aDir = dirname(a.path);
      const bDir = dirname(b.path);
      if ((aDir === "." && (a.scope === "repository" || a.scope === "整个仓库") && bDir !== ".") ||
          (aDir !== "." && (b.path.startsWith(`${aDir}/`) || b.scope.startsWith(`${aDir}/`)))) {
        edges.push({ from: a.id, to: b.id, relation: "inherits" });
      } else if ((bDir === "." && (b.scope === "repository" || b.scope === "整个仓库") && aDir !== ".") ||
                 (bDir !== "." && (a.path.startsWith(`${bDir}/`) || a.scope.startsWith(`${bDir}/`)))) {
        edges.push({ from: b.id, to: a.id, relation: "inherits" });
      } else if (a.scope === b.scope) {
        edges.push({ from: a.id, to: b.id, relation: a.kind === b.kind ? "overlaps" : "tool-variant" });
      }
    }
  }
  return { nodes, edges: edges.slice(0, 100) };
}

function translateFixDescription(ruleId: string, description: string): string {
  if (ruleId === "consistency/package-manager") {
    const match = description.match(/^Replace (\w+) with (\w+) on this instruction line\.$/);
    if (match) return `将该指令行中的 ${match[1]} 替换为 ${match[2]}。`;
  }
  return description;
}

function translateFinding(ruleId: string, input: FindingInput): Finding["translations"] {
  const en = { title: input.title, message: input.message, suggestion: input.suggestion };
  let zh = { title: input.title, message: input.message, suggestion: input.suggestion };
  const quoted = (value: string) => value.match(/[“\"]([^”\"]+)[”\"]/)?.[1] ?? "";
  switch (ruleId) {
    case "coverage/no-instruction-files": zh = { title: "未发现编程助手指令文件", message: "仓库中没有可识别的 AI 编程助手指令文件。", suggestion: "添加 AGENTS.md，并写明构建、测试、架构和安全要求。" }; break;
    case "coverage/empty-instruction-file": zh = { title: "指令文件没有可用内容", message: "该文件为空，或仅包含标题、注释和文件头元数据。", suggestion: "添加简洁且可验证的项目指令，或删除这个未使用的文件。" }; break;
    case "efficiency/file-too-large": {
      const nums = input.message.match(/(\d+).+?(\d+)-token/);
      zh = { title: "指令文件占用过多上下文", message: `该文件估算约 ${nums?.[1] ?? "较多"} 个令牌，超过配置的 ${nums?.[2] ?? ""} 个令牌上限。`, suggestion: "将任务相关内容拆到作用域规则、技能文件或引用文档中。" }; break;
    }
    case "efficiency/claude-line-count": zh = { title: "CLAUDE.md 超出建议工作长度", message: "始终加载的指令文件过长会占用上下文，并可能降低规则遵循率。", suggestion: "尽量控制在 200 行以内，并将专题内容移入 .claude/rules/。" }; break;
    case "validity/frontmatter-unclosed": zh = { title: "YAML 文件头元数据未闭合", message: "文件以 --- 开始，但没有找到对应的结束 ---。", suggestion: "在 Markdown 指令前添加结束的 --- 行。" }; break;
    case "coverage/cursor-legacy-format": zh = { title: "检测到旧版 .cursorrules 格式", message: "Cursor 仍兼容该文件，但 .cursor/rules 中的项目规则支持更好的作用域和元数据。", suggestion: "将内容迁移为一个或多个 .cursor/rules/*.mdc 文件。" }; break;
    case "coverage/windsurf-legacy-format": zh = { title: "检测到旧版 Windsurf 规则文件", message: ".windsurf/rules/ 中的工作区规则更容易设置作用域和维护。", suggestion: "将内容拆分到 .windsurf/rules/*.md 文件。" }; break;
    case "validity/cursor-frontmatter": zh = { title: "Cursor MDC 规则缺少文件头元数据", message: "Cursor 项目规则使用 YAML 文件头元数据控制描述、路径匹配范围和激活方式。", suggestion: "根据需要添加 description、globs 和 alwaysApply 字段。" }; break;
    case "validity/cursor-always-apply": zh = { title: "Cursor alwaysApply 必须为 true 或 false", message: `当前值为“${quoted(input.message)}”。`, suggestion: "将 alwaysApply 设置为 true 或 false。" }; break;
    case "coverage/cursor-activation": zh = { title: "Cursor 规则没有明确激活方式", message: "该规则没有 description、globs，也没有 alwaysApply: true。", suggestion: "定义规则何时附加，避免它被静默忽略。" }; break;
    case "validity/copilot-apply-to": zh = { title: "Copilot 路径指令缺少 applyTo", message: "GitHub 路径级指令文件需要在 YAML 文件头元数据中设置 applyTo 路径匹配范围。", suggestion: "添加例如 applyTo: \"src/**/*.ts\" 的文件头元数据。" }; break;
    case "validity/copilot-agent-description": zh = { title: "Copilot 自定义助手缺少描述", message: "自定义助手配置使用 YAML 文件头元数据，并需要通过 description 说明用途。", suggestion: "在文件头元数据中添加简洁的 description。" }; break;
    case "coverage/no-test-guidance": zh = { title: "缺少测试说明", message: "仓库提供了测试相关脚本，但编程助手指令中没有说明。", suggestion: "写明最快的相关测试命令，以及何时必须运行完整测试。" }; break;
    case "coverage/no-build-guidance": zh = { title: "缺少构建或类型检查说明", message: "仓库提供了构建或类型检查脚本，但 Agent 指令中没有说明。", suggestion: "告诉编程助手如何验证项目能够成功构建或通过类型检查。" }; break;
    case "coverage/no-lint-guidance": zh = { title: "缺少代码检查或格式化说明", message: "仓库提供了 lint 或格式化脚本，但 Agent 指令中没有说明。", suggestion: "写明项目的代码检查或格式化命令，保证生成的改动符合仓库规范。" }; break;
    case "efficiency/duplicate-instruction": {
      const count = input.message.match(/appears (\d+) times/)?.[1] ?? "多";
      const locations = input.message.split(": ").slice(1).join(": ");
      zh = { title: "多个编程助手文件中存在完全重复的指令", message: `同一条指令出现了 ${count} 次：${locations}`, suggestion: "保留一份权威规则，并在支持时导入或生成不同工具的版本。" }; break;
    }
    case "efficiency/near-duplicate-instruction": {
      const pct = input.message.match(/(\d+)%/)?.[1] ?? "高度";
      const locations = input.message.split(": ").slice(1).join(": ");
      zh = { title: "高度相似的指令可能浪费上下文", message: `这些规则相似度为 ${pct}%：${locations}`, suggestion: "合并公共部分，只保留工具或作用域特有的差异。" }; break;
    }
    case "consistency/contradictory-instructions": {
      const subject = input.title.replace(/^Conflicting guidance about /, "");
      zh = { title: `关于 ${subject} 的规则互相冲突`, message: `一条指令要求或推荐 ${subject}，另一条却要求编程助手避免它。`, suggestion: "选择统一的仓库策略，或将规则限制到各自适用的目录。" }; break;
    }
    case "consistency/multiple-package-managers": {
      const managers = input.message.match(/artifacts for (.+)\.$/)?.[1] ?? "多个包管理器";
      const root = input.message.startsWith("The repository root") ? "仓库根目录" : input.message.split(" declares")[0];
      zh = { title: "同一作用域检测到多个包管理器", message: `${root} 同时存在 ${managers} 的相关文件或声明。`, suggestion: "只保留一个权威 packageManager 字段和锁文件，或明确说明嵌套工作区例外。" }; break;
    }
    case "consistency/package-manager": {
      const match = input.message.match(/uses (\w+).+indicates (\w+)/);
      zh = { title: "包管理器指令与仓库元数据冲突", message: `该指令使用 ${match?.[1] ?? "另一种包管理器"}，但最近的锁文件或 packageManager 字段表明应使用 ${match?.[2] ?? "仓库指定的包管理器"}。`, suggestion: `改用 ${match?.[2] ?? "正确包管理器"} 的等价命令，或说明该作用域为何不同。` }; break;
    }
    case "validity/script-out-of-scope": {
      const command = quoted(input.title);
      zh = { title: `脚本“${command}”只存在于其他包`, message: "最近的 package.json 中没有定义该命令。", suggestion: "明确写出工作区或包目录，或者使用正确的 workspace 命令。" }; break;
    }
    case "validity/missing-script": {
      const command = quoted(input.title);
      zh = { title: `脚本“${command}”不存在`, message: "指令要求编程助手运行一个在所有已扫描 package.json 中都不存在的脚本。", suggestion: `添加“${command}”脚本，或将指令改为现有命令。` }; break;
    }
    case "validity/missing-task-target": {
      const target = quoted(input.title);
      zh = { title: `任务目标“${target}”不存在`, message: "指令引用了一个在对应任务文件中没有定义的目标。", suggestion: "添加该目标，或把指令改成现有任务。" }; break;
    }
    case "validity/missing-path": {
      const ref = quoted(input.title);
      zh = { title: `引用的路径“${ref}”不存在`, message: "指令引用的文件或目录没有出现在仓库树中。", suggestion: "更新路径、恢复被引用的文件，或删除过期指令。" }; break;
    }
    case "validity/config-invalid": zh = { title: "AgentLint 配置无效", message: translateConfigDetails(input.message), suggestion: "修复 .agentlint.json，或删除无效配置项。" }; break;
    case "security/force-push": zh = { title: "危险的强制推送指令", message: "该指令允许使用无条件强推改写远程 Git 历史。", suggestion: "要求用户明确确认，并优先在非保护分支使用 --force-with-lease。" }; break;
    case "security/force-with-lease": zh = { title: "改写远程历史前应要求确认", message: "即使使用 --force-with-lease，也会改写远程历史，不应静默执行。", suggestion: "明确规定改写远程分支前必须询问用户。" }; break;
    case "security/destructive-shell": zh = { title: "危险的递归删除指令", message: "该指令包含范围过大的递归删除命令。", suggestion: "仅删除明确命名的临时目录，并要求用户确认。" }; break;
    case "security/pipe-to-shell": zh = { title: "远程脚本被直接传给 Shell 执行", message: "未经审查就执行下载内容会带来供应链风险。", suggestion: "先下载到文件，验证来源或校验值并检查内容，再明确执行。" }; break;
    case "security/hard-reset": zh = { title: "硬重置可能丢失工作内容", message: "该指令可能永久丢弃尚未提交的修改。", suggestion: "先创建备份分支或 stash，并在重置前询问用户。" }; break;
    case "security/no-verify": zh = { title: "绕过了验证钩子", message: "该指令会跳过仓库的安全或质量钩子。", suggestion: "修复钩子失败原因，不要关闭验证；紧急例外必须限制范围并记录原因。" }; break;
    case "security/chmod-777": zh = { title: "请求了所有人可写权限", message: "chmod 777 会向本机所有用户和进程授予写权限。", suggestion: "使用满足需求的最小属主/用户组权限，例如 755 或 750。" }; break;
    case "security/tls-disabled": zh = { title: "TLS 证书验证被关闭", message: "关闭证书验证会使下载和接口流量容易被中间人拦截。", suggestion: "安装正确的 CA 证书，或配置受信任的开发代理。" }; break;
    case "security/broad-sudo": zh = { title: "过于宽泛的提权执行指令", message: "该规则鼓励使用操作系统高权限执行命令。", suggestion: "写明准确的提权操作和原因，并要求用户确认。" }; break;
    case "security/no-confirmation": zh = { title: "指令禁止询问用户确认", message: "对于破坏性操作或外部操作，无确认的自主执行风险很高。", suggestion: "仅允许可逆的本地操作静默执行，其他情况必须确认。" }; break;
    case "security/production-data": zh = { title: "允许修改生产数据", message: "该指令似乎授权修改生产环境数据。", suggestion: "默认禁止生产写入，并要求使用独立、可审计的流程。" }; break;
    case "security/secret-exposure": zh = { title: "指令可能泄露密钥", message: "该规则似乎允许打印、提交或传输密钥等敏感内容。", suggestion: "不要把密钥写入日志或版本库，使用脱敏和密钥管理服务。" }; break;
    case "security/skip-validation": zh = { title: "明确跳过了质量验证", message: "跳过测试、lint 或类型检查可能隐藏回归问题。", suggestion: "写明最快的相关验证命令，而不是关闭验证。" }; break;
  }
  return { "en-US": en, "zh-CN": zh };
}

function translateConfigDetails(details: string): string {
  if (details.includes("maxInstructionTokens")) return "maxInstructionTokens 必须是一个不小于 200 的数字。";
  if (details.includes("duplicateSimilarity")) return "duplicateSimilarity 必须位于 0.5 到 1 之间。";
  if (details.includes("rules must")) return "rules 必须是将规则 ID 映射到 error、warning、info 或 off 的对象。";
  return `配置 JSON 无效：${details}`;
}

function describeScope(file: RepositoryFile, locale: Locale): string | null {
  const kind = detectInstructionKind(file.path);
  const frontmatter = parseFrontmatter(file.content);
  if (!frontmatter.hasFrontmatter || !frontmatter.closed) return null;
  if (kind === "copilot") return scalar(frontmatter.data.applyTo) ?? null;
  if (kind === "claude-rule") {
    const paths = frontmatter.data.paths;
    return Array.isArray(paths) ? paths.join(", ") : scalar(paths) ?? (locale === "zh-CN" ? "整个仓库" : "repository");
  }
  if (kind === "cursor") {
    const globs = scalar(frontmatter.data.globs);
    if (globs) return globs;
    if (scalar(frontmatter.data.alwaysApply) === "true") return locale === "zh-CN" ? "始终生效" : "always";
    return scalar(frontmatter.data.description) ? (locale === "zh-CN" ? "由编程助手按描述选择" : "agent-selected") : null;
  }
  if (kind === "cline" || kind === "windsurf") {
    return scalar(frontmatter.data.globs) ?? scalar(frontmatter.data.trigger) ?? null;
  }
  return null;
}

function scalar(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value.join(", ") || null;
  return value?.trim() || null;
}

function collectPackageScripts(files: RepositoryFile[]): Set<string> {
  return new Set(collectPackageManifests(files).flatMap((manifest) => [...manifest.scripts]));
}

interface PackageManifest {
  directory: string;
  scripts: Set<string>;
}

function collectPackageManifests(files: RepositoryFile[]): PackageManifest[] {
  const manifests: PackageManifest[] = [];
  for (const file of files.filter((item) => /(^|\/)package\.json$/i.test(item.path))) {
    try {
      const parsed = JSON.parse(file.content) as { scripts?: Record<string, string> };
      manifests.push({ directory: directoryOf(file.path), scripts: new Set(Object.keys(parsed.scripts ?? {})) });
    } catch {
      // Invalid package.json is reported by build tools; AgentLint only validates referenced scripts.
    }
  }
  return manifests;
}

function nearestPackageManifest(file: string, manifests: PackageManifest[]): PackageManifest | undefined {
  return manifests
    .filter((manifest) => isAncestor(manifest.directory, directoryOf(file)))
    .sort((a, b) => b.directory.length - a.directory.length)[0];
}

interface ManagerSource {
  directory: string;
  manager: string;
}

function collectManagerSources(files: RepositoryFile[]): ManagerSource[] {
  const output: ManagerSource[] = [];
  for (const file of files) {
    const base = basename(file.path);
    for (const [manager, lockfiles] of Object.entries(managerLockfiles)) {
      if (lockfiles.includes(base)) output.push({ directory: directoryOf(file.path), manager });
    }
    if (base !== "package.json" || !file.content) continue;
    try {
      const parsed = JSON.parse(file.content) as { packageManager?: string };
      const manager = parsed.packageManager?.match(/^(npm|pnpm|yarn|bun)@/i)?.[1]?.toLowerCase();
      if (manager) output.push({ directory: directoryOf(file.path), manager });
    } catch {
      // Ignore malformed package metadata for this rule.
    }
  }
  return output;
}

function nearestManagerForFile(file: string, sources: ManagerSource[]): string | null {
  const directory = directoryOf(file);
  const candidates = sources.filter((source) => isAncestor(source.directory, directory));
  if (!candidates.length) return null;
  const nearestLength = Math.max(...candidates.map((source) => source.directory.length));
  const managers = new Set(candidates.filter((source) => source.directory.length === nearestLength).map((source) => source.manager));
  return managers.size === 1 ? [...managers][0] ?? null : null;
}

function detectManagerCommand(text: string): string | null {
  const match = text.match(/(?:^|[`\s;&|])(npm|pnpm|yarn|bun)(?=\s|`|$)/i);
  return match?.[1]?.toLowerCase() ?? null;
}

function replaceManager(raw: string, from: string, to: string): string {
  return raw.replace(new RegExp(`\\b${escapeRegExp(from)}\\b`, "gi"), to);
}

function extractScriptCommands(text: string): string[] {
  const commands = new Set<string>();
  const builtins = new Set(["add", "install", "remove", "uninstall", "update", "upgrade", "exec", "dlx", "x", "run", "init", "create", "publish", "pack"]);

  const inspect = (candidate: string, allowShorthand: boolean) => {
    for (const match of candidate.matchAll(/\bnpm\s+run\s+([\w:-]+)/gi)) if (match[1]) commands.add(match[1]);
    for (const match of candidate.matchAll(/\bnpm\s+(test|start|stop|restart)\b/gi)) if (match[1]) commands.add(match[1].toLowerCase());
    if (!allowShorthand) return;
    for (const match of candidate.matchAll(/\b(pnpm|yarn|bun)\s+(?:run\s+)?([\w:-]+)/gi)) {
      const command = match[2]?.toLowerCase();
      if (command && !builtins.has(command)) commands.add(command);
    }
  };

  for (const match of text.matchAll(/`([^`]+)`/g)) if (match[1]) inspect(match[1], true);
  inspect(text.replace(/`[^`]+`/g, ""), false);
  for (const match of text.matchAll(/\b(?:run|execute|运行|执行)\s+((?:pnpm|yarn|bun)\s+(?:run\s+)?[\w:-]+)/gi)) {
    if (match[1]) inspect(match[1], true);
  }
  return [...commands];
}

function extractTaskTargets(text: string, command: "make" | "just"): string[] {
  const targets = new Set<string>();
  for (const match of text.matchAll(new RegExp(`(?:^|[\\s\u0060])${command}\\s+([A-Za-z0-9_.-]+)`, "gi"))) {
    if (match[1] && !["-f", "--file", "--help"].includes(match[1])) targets.add(match[1]);
  }
  return [...targets];
}

function missingTaskFinding(command: string, target: string, line: InstructionLine): Finding {
  return makeFinding("validity/missing-task-target", "error", "validity", {
    discriminator: `${line.file}:${line.line}:${command}:${target}`,
    title: `${command} target “${target}” does not exist`,
    message: `The instruction references a ${command} target that was not found in the repository's task file.`,
    file: line.file,
    line: line.line,
    evidence: line.text,
    suggestion: `Add the target or update the instruction to a valid ${command} command.`,
  });
}

function instructionPolarity(text: string, subject: string): "positive" | "negative" | null {
  const escaped = escapeRegExp(subject);
  const negative = new RegExp(`(?:do not|don't|never|must not|avoid|禁止|不要|不得|避免).{0,35}${escaped}|${escaped}.{0,20}(?:is forbidden|禁止使用)`, "i");
  if (negative.test(text)) return "negative";
  const positive = new RegExp(`(?:use|prefer|must use|always use|adopt|使用|采用|优先).{0,35}${escaped}|${escaped}.{0,20}(?:is required|必需|必须)`, "i");
  return positive.test(text) ? "positive" : null;
}

function isExplicitProhibition(text: string, subject: RegExp): boolean {
  const match = subject.exec(text);
  if (!match || match.index < 0) return false;
  const prefix = text.slice(Math.max(0, match.index - 60), match.index);
  return /(?:do not|don't|never|must not|forbid|prohibit|禁止|不要|不得|严禁|不可)\s*$/i.test(prefix) ||
    /(?:do not|don't|never|must not|forbid|prohibit|禁止|不要|不得|严禁|不可).{0,45}$/i.test(prefix);
}

function calculateMetrics(findings: Finding[], instructionFileCount: number): ScoreMetrics {
  const categories: FindingCategory[] = ["coverage", "consistency", "validity", "security", "efficiency"];
  const metrics = {} as ScoreMetrics;
  for (const category of categories) {
    const base = category === "coverage" && instructionFileCount === 0 ? 35 : 100;
    const categoryFindings = findings.filter((finding) => finding.category === category);
    const penalty = categoryFindings.reduce((sum, finding) => sum + (finding.severity === "error" ? 22 : finding.severity === "warning" ? 10 : 4), 0);
    metrics[category] = Math.max(0, Math.min(100, base - penalty));
  }
  return metrics;
}

function countDuplicateLines(lines: InstructionLine[]): number {
  const counts = new Map<string, number>();
  for (const line of lines) {
    if (line.normalized.length < 16) continue;
    counts.set(line.normalized, (counts.get(line.normalized) ?? 0) + 1);
  }
  return [...counts.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
}

function estimateAvoidableTokens(lines: InstructionLine[]): number {
  const seen = new Set<string>();
  let characters = 0;
  for (const line of lines) {
    if (line.normalized.length < 16) continue;
    if (seen.has(line.normalized)) characters += line.text.length;
    seen.add(line.normalized);
  }
  return Math.ceil(characters / 4);
}

function compareFindings(a: Finding, b: Finding): number {
  const rank: Record<FindingSeverity, number> = { error: 0, warning: 1, info: 2 };
  return rank[a.severity] - rank[b.severity] || a.category.localeCompare(b.category) || (a.file ?? "").localeCompare(b.file ?? "") || (a.line ?? 0) - (b.line ?? 0);
}

function directoryOf(file: string): string {
  const directory = dirname(file);
  return directory === "." ? "." : directory;
}

function isAncestor(ancestor: string, directory: string): boolean {
  return ancestor === "." || directory === ancestor || directory.startsWith(`${ancestor}/`);
}

function validNumber(value: unknown, minimum: number, maximum: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= minimum && value <= maximum;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}
