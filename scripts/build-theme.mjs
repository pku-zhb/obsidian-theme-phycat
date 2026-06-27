#!/usr/bin/env bun
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const args = process.argv.slice(2);
let manifestArg = "src/manifest.txt";
let outPath = "dist/theme.css";

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];

  if (arg === "--out") {
    outPath = args[index + 1];
    index += 1;
    continue;
  }

  if (arg.startsWith("--")) {
    throw new Error(`Unknown option: ${arg}`);
  }

  manifestArg = arg;
}

if (!outPath) {
  throw new Error("Missing value for --out");
}

const manifestPath = resolve(manifestArg);
const manifestDir = dirname(manifestPath);
const sectionPaths = readFileSync(manifestPath, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"));

let output = "";
for (const sectionPath of sectionPaths) {
  output += readFileSync(resolve(manifestDir, sectionPath), "utf8");
}

mkdirSync(dirname(resolve(outPath)), { recursive: true });
writeFileSync(outPath, output);

console.log(`Built ${outPath} from ${sectionPaths.length} sections`);
