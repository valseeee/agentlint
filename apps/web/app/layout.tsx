import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentLint — AI 编程规则体检",
  description: "检查 AI 编程助手规则中的冲突、失效命令、安全风险和上下文浪费，支持中英文与本地分析。",
  keywords: ["AGENTS.md", "CLAUDE.md", "Cursor 规则", "GitHub Copilot", "AI 编程助手", "静态检查"],
  openGraph: {
    title: "AgentLint — 让 AI 编程规则真正可靠",
    description: "支持中英文、本地优先的 AI 编程助手指令文件体检工具。",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" suppressHydrationWarning><body suppressHydrationWarning>{children}</body></html>;
}
