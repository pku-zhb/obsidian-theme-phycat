#!/usr/bin/env bun
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const input = process.argv[2] ?? "theme.css";
const outDir = process.argv[3] ?? "src/sections";

const sections = [
  ["00-settings.css", 1, 659],
  ["01-root-base-vars.css", 660, 774],
  ["02-presets-code-tokens.css", 775, 1226],
  ["03-derived-bridge.css", 1227, 1419],
  ["10-reading-editor-base.css", 1420, 1495],
  ["11-headings.css", 1496, 2490],
  ["12-editor-heading-hover.css", 2491, 2634],
  ["20-lists-images-tasks.css", 2635, 2984],
  ["21-quotes-links-inline-hr.css", 2985, 3609],
  ["22-tables-code-callouts.css", 3610, 4606],
  ["30-ui-layout-bases-scrollbars.css", 4607, 5356],
  ["31-file-explorer.css", 5357, 5730],
  ["40-source-mode-reset.css", 5731, 5822],
  ["90-focused-tab.css", 5823, 5884],
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
