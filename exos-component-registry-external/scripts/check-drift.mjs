#!/usr/bin/env node
// Drift check for the Exos component catalog (exos-theme-external variant).
//
// Verifies every class a catalog file references still exists in the installed
// design system, so the catalog cannot silently rot when the theme or bootstrap
// is upgraded.
//
//   origin "exos"      -> class must appear as a literal `.class` selector in
//                         the theme or bootstrap SCSS source.
//   origin "bootstrap" -> class is GENERATED (by a Bootstrap loop or an exos
//                         @each builder mixin) from the theme color map, so it
//                         never appears literally. We instead verify each
//                         {color} is a known theme color from tokens.json.
//
// This variant validates against `@exos/exos-theme-external` installed in a
// (possibly external) SPA. The SPA root defaults to the VendorOnBoardingSpa
// path below and can be overridden with EXOS_SPA_ROOT or --spa-root=PATH.
//
// Usage:  node check-drift.mjs [file.json ...] [--spa-root=/abs/path]
// Exit 1 if any class can no longer be resolved.

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_DIR = resolve(__dirname, "..");

const THEME_PKG = "@exos/exos-theme-external";
const DEFAULT_SPA_ROOT = "/Users/sameerkotecha/Desktop/SPAs/VendorOnBoardingSpa";

const args = process.argv.slice(2);
const spaArg = args.find((a) => a.startsWith("--spa-root="));
const SPA_ROOT =
  (spaArg && spaArg.split("=")[1]) || process.env.EXOS_SPA_ROOT || DEFAULT_SPA_ROOT;
const files = args.filter((a) => !a.startsWith("--"));

const SCSS_ROOTS = [
  join(SPA_ROOT, "node_modules", THEME_PKG, "src"),
  join(SPA_ROOT, "node_modules/bootstrap/scss"),
];

// ---- build a corpus of all SCSS source text -------------------------------
function collectScss(dir, out) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) collectScss(full, out);
    else if (name.endsWith(".scss")) out.push(readFileSync(full, "utf8"));
  }
  return out;
}

const CORPUS = SCSS_ROOTS.flatMap((r) => collectScss(r, [])).join("\n");
if (!CORPUS.trim()) {
  console.error(
    `ERROR: no SCSS source found under ${SPA_ROOT}. Check the path / run npm install in the SPA.`,
  );
  process.exit(2);
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function classExists(cls) {
  const re = new RegExp(`(^|[^A-Za-z0-9_-])\\.${escapeRe(cls)}([^A-Za-z0-9_-]|$)`, "m");
  return re.test(CORPUS);
}

// ---- theme colors (for generated/bootstrap classes) -----------------------
const tokens = JSON.parse(readFileSync(join(REGISTRY_DIR, "tokens.json"), "utf8"));
const THEME_COLORS = new Set([
  ...Object.keys(tokens.themeColors || {}),
  ...Object.keys(tokens.tints || {}),
  ...Object.keys(tokens.grays || {}),
  ...Object.keys(tokens.diagramColors || {}),
]);

// ---- expand an axis option's pattern into concrete class names ------------
function expandPattern(pattern, opt) {
  let combos = [pattern];
  for (const dim of ["colors", "tones", "sizes"]) {
    const values = opt[dim];
    if (!values) continue;
    const key = dim.slice(0, -1);
    const next = [];
    for (const c of combos)
      for (const v of values) next.push(c.replaceAll(`{${key}}`, v));
    combos = next;
  }
  return combos.flatMap((c) => c.split(/\s+/).filter(Boolean));
}

// ---- gather (class, origin) pairs from one catalog entry ------------------
function collectChecks(entry) {
  const checks = [];
  const pushClasses = (classes, origin, where) => {
    for (const c of classes) {
      if (c.includes("{")) continue;
      checks.push({ cls: c, origin, where });
    }
  };

  if (entry.baseClass)
    pushClasses(entry.baseClass.split(/\s+/), "exos", "baseClass");

  for (const [axisName, axis] of Object.entries(entry.axes || {})) {
    if (axis.type === "attribute") continue;
    for (const [optName, opt] of Object.entries(axis.options || {})) {
      const where = `axes.${axisName}.${optName}`;
      if (opt == null) continue;
      if (typeof opt === "string") {
        pushClasses([opt], "exos", where);
        continue;
      }
      const origin = opt.origin || "exos";
      if (origin === "bootstrap") {
        for (const color of opt.colors || [])
          checks.push({ color, origin, where });
        continue;
      }
      const classes = opt.pattern
        ? expandPattern(opt.pattern, opt)
        : opt.class
          ? [opt.class]
          : [];
      pushClasses(classes, "exos", where);
    }
  }

  const walk = (node, where) => {
    if (node && node.class) pushClasses(node.class.split(/\s+/), "exos", where);
  };
  if (entry.structure) {
    walk(entry.structure.root, "structure.root");
    (entry.structure.children || []).forEach((c, i) =>
      walk(c, `structure.children[${i}]`),
    );
  }
  return checks;
}

// ---- run ------------------------------------------------------------------
let targets = files;
if (targets.length === 0) {
  targets = readdirSync(REGISTRY_DIR)
    .filter((f) => f.endsWith(".json") && f !== "tokens.json")
    .map((f) => join(REGISTRY_DIR, f));
}

let failures = 0;
for (const file of targets) {
  const name = basename(file);
  let entry;
  try {
    entry = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    console.log(`FAIL  ${name}  (invalid JSON: ${e.message})`);
    failures++;
    continue;
  }
  const problems = [];
  for (const chk of collectChecks(entry)) {
    if (chk.color != null) {
      if (!THEME_COLORS.has(chk.color))
        problems.push(`unknown theme color "${chk.color}" at ${chk.where}`);
    } else if (!classExists(chk.cls)) {
      problems.push(`class ".${chk.cls}" not found in SCSS at ${chk.where}`);
    }
  }
  if (problems.length) {
    failures++;
    console.log(`FAIL  ${name}`);
    for (const p of problems) console.log(`        - ${p}`);
  } else {
    console.log(`PASS  ${name}`);
  }
}

console.log(
  `\n${failures ? "✗" : "✓"} ${targets.length - failures}/${targets.length} catalog files clean  (theme: ${THEME_PKG} @ ${SPA_ROOT})`,
);
process.exit(failures ? 1 : 0);
