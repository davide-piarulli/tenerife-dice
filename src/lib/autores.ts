// Author profiles. Articles reference an author by display name in frontmatter (`author`).
// To sign articles with a real person, add a profile here and set that name in the n8n
// "Construir Markdown" node (workflow "Tenerife Dice - Aprobacion Telegram").

export type Autor = {
  slug: string;
  nombre: string;
  tipo: "Person" | "Organization";
  cargo: string;
  bio: string[];
  sameAs?: string[];
};

export const AUTORES: Autor[] = [
  {
    slug: "redaccion",
    nombre: "Redacción Tenerife Dice",
    tipo: "Organization",
    cargo: "Equipo editorial",
    bio: [
      "La redacción de Tenerife Dice sigue cada día la actualidad de Tenerife y del resto de Canarias a partir de medios locales, instituciones y fuentes oficiales como AEMET o el Cabildo.",
      "Cada artículo cita y enlaza su fuente original. Usamos herramientas de inteligencia artificial como apoyo a la redacción, y todo el contenido pasa por revisión editorial humana antes de publicarse.",
    ],
  },
];

const ALIAS: Record<string, string> = {
  "redaccion tenerife dice": "redaccion",
  "redacción tenerife dice": "redaccion",
};

export function getAutor(nombre: string | undefined): Autor {
  const clave = (nombre ?? "").trim().toLowerCase();
  const slug = ALIAS[clave] ?? AUTORES.find((a) => a.nombre.toLowerCase() === clave)?.slug ?? "redaccion";
  return AUTORES.find((a) => a.slug === slug) ?? AUTORES[0];
}

export function getAutorPorSlug(slug: string) {
  return AUTORES.find((a) => a.slug === slug);
}
