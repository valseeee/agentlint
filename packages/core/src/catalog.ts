import type { FindingCategory, FindingSeverity, Locale } from "./types.js";

export interface RuleCatalogEntry {
  id: string;
  category: FindingCategory;
  defaultSeverity: FindingSeverity;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
}

const entries: Array<[string, FindingCategory, FindingSeverity, string, string, string, string]> = [
  ["coverage/no-instruction-files", "coverage", "warning", "未发现规则文件", "No instruction files found", "仓库中没有受支持的 AI 编程助手规则文件。", "No supported AI coding-agent instruction file was found."],
  ["coverage/empty-instruction-file", "coverage", "warning", "规则文件为空", "Empty instruction file", "规则文件存在，但没有提取到有效指令。", "An instruction file exists but contains no usable instructions."],
  ["coverage/no-test-guidance", "coverage", "info", "缺少测试说明", "Missing test guidance", "仓库有测试命令，但规则没有说明何时运行测试。", "The repository has tests, but instructions do not explain when to run them."],
  ["coverage/no-build-guidance", "coverage", "info", "缺少构建说明", "Missing build guidance", "仓库有构建或类型检查命令，但规则没有相应说明。", "The repository has build or type-check commands without matching guidance."],
  ["coverage/no-lint-guidance", "coverage", "info", "缺少代码检查说明", "Missing lint guidance", "仓库有 lint 或格式化命令，但规则没有相应说明。", "The repository has lint or format commands without matching guidance."],
  ["coverage/cursor-legacy-format", "coverage", "info", "使用旧版 Cursor 规则格式", "Legacy Cursor rule format", "建议从 .cursorrules 迁移到 .cursor/rules/*.mdc。", "Consider migrating .cursorrules to .cursor/rules/*.mdc."],
  ["coverage/windsurf-legacy-format", "coverage", "info", "使用旧版 Windsurf 规则格式", "Legacy Windsurf rule format", "建议迁移到 Windsurf 的目录化规则格式。", "Consider migrating to Windsurf's directory-based rule format."],
  ["coverage/cursor-activation", "coverage", "warning", "Cursor 规则缺少激活方式", "Cursor rule lacks activation", "Cursor 规则没有清晰的 alwaysApply 或 glob 作用域。", "The Cursor rule has no clear alwaysApply or glob activation scope."],
  ["consistency/multiple-package-managers", "consistency", "warning", "检测到多个包管理器", "Multiple package managers detected", "同一作用域存在多个包管理器锁文件。", "Multiple package-manager lockfiles exist in the same scope."],
  ["consistency/package-manager", "consistency", "warning", "包管理器说明与仓库不一致", "Package manager mismatch", "规则中的包管理器与锁文件或 packageManager 字段不一致。", "The instructed package manager conflicts with lockfiles or packageManager metadata."],
  ["consistency/contradictory-instructions", "consistency", "warning", "规则相互矛盾", "Contradictory instructions", "相同作用域中出现了明确相反的要求。", "Clearly opposing requirements exist in the same effective scope."],
  ["validity/config-invalid", "validity", "error", "AgentLint 配置无效", "Invalid AgentLint configuration", ".agentlint.json 无法解析或字段无效。", ".agentlint.json cannot be parsed or contains invalid fields."],
  ["validity/frontmatter-unclosed", "validity", "error", "Frontmatter 未闭合", "Unclosed frontmatter", "规则文件的 YAML frontmatter 缺少结束分隔符。", "The instruction file's YAML frontmatter has no closing delimiter."],
  ["validity/cursor-frontmatter", "validity", "warning", "Cursor 规则缺少 Frontmatter", "Cursor rule lacks frontmatter", "MDC 规则缺少推荐的元数据区。", "The MDC rule is missing recommended metadata."],
  ["validity/cursor-always-apply", "validity", "error", "Cursor alwaysApply 值无效", "Invalid Cursor alwaysApply value", "alwaysApply 必须是 true 或 false。", "alwaysApply must be true or false."],
  ["validity/copilot-apply-to", "validity", "warning", "Copilot applyTo 无效或缺失", "Invalid or missing Copilot applyTo", "路径级 Copilot 指令需要有效的 applyTo glob。", "Path-specific Copilot instructions need a valid applyTo glob."],
  ["validity/copilot-agent-description", "validity", "warning", "Copilot 自定义助手缺少说明", "Copilot custom agent lacks description", "自定义助手建议提供清晰 description。", "A custom agent should provide a clear description."],
  ["validity/missing-script", "validity", "error", "规则引用的脚本不存在", "Referenced script does not exist", "规则要求运行 package.json 中不存在的脚本。", "The instructions require a package.json script that does not exist."],
  ["validity/script-out-of-scope", "validity", "warning", "脚本不在当前工作区", "Script is outside the current workspace", "脚本只存在于其他工作区，当前作用域无法直接运行。", "The script exists only in another workspace and is not directly runnable here."],
  ["validity/missing-task-target", "validity", "error", "任务目标不存在", "Task target does not exist", "规则引用了不存在的 Makefile 或 Justfile 目标。", "The instructions reference a missing Makefile or Justfile target."],
  ["validity/missing-path", "validity", "warning", "规则引用的路径不存在", "Referenced path does not exist", "规则中的仓库文件或目录路径已经失效。", "A repository file or directory referenced by the instructions is missing."],
  ["security/force-push", "security", "error", "危险的强制推送说明", "Dangerous force-push instruction", "规则允许无条件改写远程 Git 历史。", "The instructions allow unconditional rewriting of remote Git history."],
  ["security/force-with-lease", "security", "warning", "改写历史应要求确认", "History rewrite should require confirmation", "即使使用 --force-with-lease，也应先获得用户确认。", "Even --force-with-lease should require user confirmation."],
  ["security/destructive-shell", "security", "error", "危险的递归删除命令", "Destructive shell instruction", "规则包含范围过大的递归删除操作。", "The instructions contain a broad recursive-delete operation."],
  ["security/pipe-to-shell", "security", "error", "远程脚本直接交给 Shell 执行", "Remote script piped directly to a shell", "未经检查直接执行下载内容存在供应链风险。", "Executing downloaded content without review creates supply-chain risk."],
  ["security/hard-reset", "security", "warning", "硬重置可能丢失工作", "Hard reset can discard work", "git reset --hard 可能永久丢弃未提交修改。", "git reset --hard may permanently discard uncommitted changes."],
  ["security/no-verify", "security", "warning", "绕过验证钩子", "Verification hooks are bypassed", "规则允许跳过仓库安全与质量检查。", "The instructions allow repository safety and quality hooks to be skipped."],
  ["security/chmod-777", "security", "warning", "请求全员可写权限", "World-writable permissions requested", "chmod 777 给予所有本地用户和进程写权限。", "chmod 777 grants write access to every local user and process."],
  ["security/tls-disabled", "security", "warning", "关闭 TLS 证书校验", "TLS verification is disabled", "关闭证书校验会增加网络劫持风险。", "Disabling certificate verification increases interception risk."],
  ["security/broad-sudo", "security", "warning", "过宽的管理员权限说明", "Broad privileged execution instruction", "规则鼓励使用未限定范围的 sudo。", "The instructions encourage insufficiently scoped sudo usage."],
  ["security/no-confirmation", "security", "warning", "规则禁止用户确认", "Instruction suppresses user confirmation", "破坏性或外部操作不应默认静默执行。", "Destructive or external actions should not run silently by default."],
  ["security/production-data", "security", "error", "允许修改生产数据", "Production-data modification instruction", "规则看起来授权直接修改生产环境数据。", "The instructions appear to authorize direct production-data changes."],
  ["security/secret-exposure", "security", "error", "规则可能导致密钥泄露", "Instruction may expose secrets", "规则可能允许打印、提交或传输密钥。", "The instructions may allow secrets to be printed, committed or transmitted."],
  ["security/skip-validation", "security", "warning", "允许跳过测试或类型检查", "Validation may be skipped", "规则允许忽略测试、类型检查或 lint 失败。", "The instructions allow test, type-check or lint failures to be ignored."],
  ["efficiency/duplicate-instruction", "efficiency", "warning", "存在完全重复的规则", "Duplicate instruction", "相同规则在多个位置重复加载。", "The same instruction is loaded from multiple locations."],
  ["efficiency/near-duplicate-instruction", "efficiency", "info", "存在近似重复的规则", "Near-duplicate instruction", "语义高度相似的规则可能浪费上下文。", "Highly similar instructions may waste context."],
  ["efficiency/file-too-large", "efficiency", "warning", "规则文件过大", "Instruction file is too large", "规则文件超过配置的上下文预算。", "The instruction file exceeds the configured context budget."],
  ["efficiency/claude-line-count", "efficiency", "info", "CLAUDE.md 行数过多", "CLAUDE.md is very long", "建议把目录专用说明拆分到 .claude/rules。", "Consider splitting directory-specific guidance into .claude/rules."],
];

export const RULE_CATALOG: RuleCatalogEntry[] = entries.map(([id, category, defaultSeverity, zhTitle, enTitle, zhDescription, enDescription]) => ({
  id,
  category,
  defaultSeverity,
  title: { "zh-CN": zhTitle, "en-US": enTitle },
  description: { "zh-CN": zhDescription, "en-US": enDescription },
}));

export function getRuleCatalog(locale: Locale = "en-US") {
  return RULE_CATALOG.map((entry) => ({
    id: entry.id,
    category: entry.category,
    defaultSeverity: entry.defaultSeverity,
    title: entry.title[locale],
    description: entry.description[locale],
  }));
}

export function getRuleDetails(ruleId: string, locale: Locale = "en-US") {
  const entry = RULE_CATALOG.find((item) => item.id === ruleId);
  if (!entry) return null;
  return {
    id: entry.id,
    category: entry.category,
    defaultSeverity: entry.defaultSeverity,
    title: entry.title[locale],
    description: entry.description[locale],
  };
}
