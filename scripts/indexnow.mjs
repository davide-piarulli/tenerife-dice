// Notifies IndexNow (Bing, Yandex, Seznam...; Bing also feeds Copilot and ChatGPT search)
// about articles and service pages added or changed between two commits.
// Usage: node scripts/indexnow.mjs <beforeSha> <afterSha>
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const HOST = "tenerifedice.com";
const SITE = `https://${HOST}`;
const keyFile = readdirSync("public").find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) {
  console.log("IndexNow: no key file in public/, skipping.");
  process.exit(0);
}
const KEY = keyFile.replace(".txt", "");

const [before, after = "HEAD"] = process.argv.slice(2);
if (!before || /^0+$/.test(before)) {
  console.log("IndexNow: no previous commit to compare, skipping.");
  process.exit(0);
}

let changed = [];
try {
  changed = execFileSync("git", ["diff", "--name-only", "--diff-filter=AM", before, after, "--", "content/articles", "src/app/servicios"], {
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
} catch (e) {
  console.log("IndexNow: git diff failed, skipping.", e.message);
  process.exit(0);
}

const urls = new Set();
for (const f of changed) {
  if (f.startsWith("content/articles/") && /\.mdx?$/.test(f)) {
    let slug = path.basename(f).replace(/\.mdx?$/, "");
    try {
      const m = readFileSync(f, "utf8").match(/^slug:\s*["']?([^"'\n]+)["']?\s*$/m);
      if (m) slug = m[1].trim();
    } catch {}
    urls.add(`${SITE}/noticias/${slug}/`);
  } else if (f.startsWith("src/app/servicios/")) {
    const seg = f.split("/")[3];
    urls.add(seg && !seg.includes(".") ? `${SITE}/servicios/${seg}/` : `${SITE}/servicios/`);
  }
}

if (urls.size === 0) {
  console.log("IndexNow: nothing new to submit.");
  process.exit(0);
}
urls.add(`${SITE}/`);

const body = { host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: [...urls].slice(0, 10000) };
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});
console.log(`IndexNow: ${res.status} for ${body.urlList.length} URL(s):\n${body.urlList.join("\n")}`);
