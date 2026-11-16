// Post-build smoke check. Critical problems fail the job (the live site stays as it was);
// soft problems (external data unavailable) only emit GitHub warnings.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const OUT = "out";
const errores = [];
const avisos = [];
const existe = (p) => fs.existsSync(path.join(OUT, p));

for (const p of [
  "index.html",
  "sitemap.xml",
  "news-sitemap.xml",
  "rss.xml",
  "robots.txt",
  "servicios/index.html",
  "servicios/avisos-aemet-tenerife/index.html",
  "servicios/estado-carreteras-tenerife/index.html",
  "servicios/playas-tenerife-hoy/index.html",
  "servicios/permiso-subir-teide/index.html",
  "servicios/que-hacer-fin-de-semana-tenerife/index.html",
  "servicios/navidad-tenerife-2026/index.html",
  "servicios/empleo-publico-ayudas-tenerife/index.html",
  "servicios/farmacias-de-guardia-tenerife/index.html",
]) {
  if (!existe(p)) errores.push(`Falta ${p}`);
}

// Every published article must have its page.
const dir = "content/articles";
const publicados = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".md"))
  .filter((f) => {
    const { data } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
    return !data.draft && new Date(data.date).getTime() <= Date.now();
  })
  .map((f) => f.replace(/\.md$/, ""));
const sinPagina = publicados.filter((s) => !existe(`noticias/${s}/index.html`));
if (sinPagina.length) errores.push(`${sinPagina.length} artículos sin página: ${sinPagina.slice(0, 5).join(", ")}`);
if (publicados.length < 50) errores.push(`Solo ${publicados.length} artículos publicados: ¿falta contenido?`);

// Soft: beach data comes from AEMET at build time.
try {
  const hoy = JSON.parse(fs.readFileSync(path.join(OUT, "servicios/playas-tenerife-hoy/hoy.json"), "utf8"));
  if (!hoy.resumen) avisos.push("Sin datos de playas de AEMET en este build");
} catch {
  avisos.push("No se pudo leer hoy.json de playas");
}

// Soft: pharmacy rotas come from the COF PDFs (scripts/guardias.py) before the build.
try {
  const g = JSON.parse(fs.readFileSync("src/data/guardias.json", "utf8"));
  const conTurnos = Object.values(g.zonas).filter((z) => Object.keys(z.turnos).length || z.fija).length;
  if (conTurnos < 5) avisos.push(`Farmacias de guardia: solo ${conTurnos} zonas con turnos`);
} catch {
  avisos.push("Sin datos de farmacias de guardia (src/data/guardias.json)");
}

for (const a of avisos) console.log(`::warning::${a}`);
for (const e of errores) console.log(`::error::${e}`);
console.log(`Comprobación: ${publicados.length} artículos, ${errores.length} errores, ${avisos.length} avisos.`);
process.exit(errores.length ? 1 : 0);
