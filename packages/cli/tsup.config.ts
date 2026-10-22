import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  dts: true,
  clean: true,
  noExternal: ["@agentlint/core", "commander", "fast-glob"],
  outExtension: () => ({ js: ".cjs" }),
});
