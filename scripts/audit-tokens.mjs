// Checks that styling comes from the tokens in src/styles/base.css.
// Run with `npm run audit`. Exits non-zero when it finds a problem.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src", import.meta.url));
const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(astro|css|ts)$/.test(name)) files.push(path);
  }
};
walk(root);

const base = readFileSync(join(root, "styles/base.css"), "utf8");
const defined = new Set(
  [...base.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((m) => m[1]),
);
const BASE = join(root, "styles/base.css");
/* The notification email is not site CSS: email clients need literal inline styles. */
const EXEMPT = join(root, "pages/api");

const problems = [];
const add = (file, line, kind, text) =>
  problems.push(
    `${relative(root, file)}:${line}  ${kind}  ${text.trim().slice(0, 90)}`,
  );

for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  const isBase = file === BASE || file.startsWith(EXEMPT);
  lines.forEach((raw, index) => {
    const line = raw.replace(/\/\*.*?\*\//g, "");
    const n = index + 1;
    if (!isBase) {
      if (
        /#[0-9a-fA-F]{3,8}\b/.test(line) &&
        !/(&#|href="#|id="#|\/#|"#[a-z-]+"|\{\/\*|#sent|#standards|#season|#enquiry|#main)/.test(
          line,
        )
      )
        add(file, n, "hex colour", line);
      if (/\b(rgba?|hsla?)\(/.test(line)) add(file, n, "literal colour", line);
      const hidden = /(width|height):\s*1px;/.test(line);
      if (/\b\d*\.?\d+px\b/.test(line) && !hidden)
        add(file, n, "px length", line);
      const family = line.match(/font-family:\s*([^;\s].*)/);
      if (family && !family[1].startsWith("var("))
        add(file, n, "literal font", line);
    }
    for (const m of line.matchAll(/var\((--[a-z0-9-]+)/gi)) {
      const name = m[1];
      if (name.startsWith("--_") || name.startsWith("--font-")) continue;
      if (file.startsWith(EXEMPT)) continue;
      if (!defined.has(name)) add(file, n, "undefined token", name);
    }
  });
}

if (problems.length) {
  console.log(problems.join("\n"));
  console.log(`\n${problems.length} problem(s).`);
  process.exit(1);
}
console.log(
  `Checked ${files.length} files: every colour, length and font comes from a token in base.css.`,
);
