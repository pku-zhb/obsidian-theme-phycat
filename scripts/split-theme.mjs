#!/usr/bin/env bun
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const input = process.argv[2] ?? "theme.css";
const outDir = process.argv[3] ?? "src/sections";

const sections = [
  ["00-settings.css", 1, 738],
  ["01-root-base-vars.css", 739, 855],
  ["02-presets-code-tokens.css", 856, 1307],
  ["03-derived-bridge.css", 1308, 1497],
  ["10-reading-editor-base.css", 1498, 1578],
  ["11-headings.css", 1579, 2572],
  ["12-editor-heading-hover.css", 2573, 2715],
  ["20-lists-images-tasks.css", 2716, 3067],
  ["21-quotes-links-inline-hr.css", 3068, 3875],
  ["22-tables-code-callouts.css", 3876, 4905],
  ["30-ui-layout-bases-scrollbars.css", 4906, 5654],
  ["31-file-explorer.css", 5655, 6027],
  ["32-user-integrated.css", 6028, 6070],
  ["40-source-mode-reset.css", 6071, 6161],
  ["90-focused-tab.css", 6162, 6223],
];

const source = readFileSync(input, "utf8");
const lines = source.match(/[^\n]*\n|[^\n]+$/g) ?? [];
const expectedEnd = sections.at(-1)?.[2] ?? 0;

if (lines.length !== expectedEnd) {
  throw new Error(`Expected ${expectedEnd} lines, found ${lines.length}`);
}

mkdirSync(outDir, { recursive: true });

for (const [file, start, end] of sections) {
  writeFileSync(join(outDir, file), lines.slice(start - 1, end).join(""));
}

console.log(`Split ${input} into ${sections.length} sections under ${outDir}`);
