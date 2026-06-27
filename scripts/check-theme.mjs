#!/usr/bin/env bun
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const target = args.find((arg) => !arg.startsWith("--")) ?? "theme.css";
const againstIndex = args.indexOf("--against");
const against = againstIndex >= 0 ? args[againstIndex + 1] : null;

if (againstIndex >= 0 && !against) {
  throw new Error("Missing value for --against");
}

const bytes = readFileSync(target);
const text = bytes.toString("utf8");
const sha256 = createHash("sha256").update(bytes).digest("hex");
const lines = text.endsWith("\n") ? text.split("\n").length - 1 : text.split("\n").length;
const important = (text.match(/!important/g) ?? []).length;
const finalByte = bytes.length > 0 ? bytes.at(-1).toString(16).padStart(2, "0") : "none";

console.log(`file: ${target}`);
console.log(`sha256: ${sha256}`);
console.log(`lines: ${lines}`);
console.log(`bytes: ${bytes.length}`);
console.log(`important: ${important}`);
console.log(`final-byte: ${finalByte}`);

if (against) {
  const baseline = readFileSync(against);
  if (Buffer.compare(bytes, baseline) !== 0) {
    console.error(`compare: differs from ${against}`);
    process.exit(1);
  }
  console.log(`compare: identical to ${against}`);
}
