// Future English edition convention (not yet built): Spanish stays unprefixed
// at "/" as the default locale (keeps every current URL and indexed backlink
// intact); English would live under "/en/..." mirroring the same route
// structure, added only once real translated content and hreflang tags for
// both versions ship together. See project memory for the full note.
export const SITE = {
  name: "Tenerife Dice",
  tagline: "Lo que la isla cuenta",
  description:
    "Noticias de Tenerife al minuto: actualidad, sucesos, turismo, cultura y deportes de la isla, con un ojo puesto en el resto de Canarias. Lo que pasa en Tenerife, contado por Tenerife Dice.",
  url: "https://tenerifedice.com",
  locale: "es_ES",
  language: "es",
  twitter: "@tenerifedice",
  email: "redaccion@tenerifedice.com",
} as const;

export type Category = {
  slug: string;
  label: string;
  description: string;
  color: string;
};

export const CATEGORIES: Category[] = [
  {
    slug: "actualidad",
    label: "Actualidad",
    description: "La actualidad de Tenerife: política, sociedad e instituciones.",
    color: "ocean",
  },
  {
    slug: "sucesos",
    label: "Sucesos",
    description: "Sucesos y emergencias en la isla de Tenerife.",
    color: "sunset",
  },
  {
    slug: "turismo",
    label: "Turismo",
    description: "Turismo, playas, ocio y novedades para visitantes de Tenerife.",
    color: "gold",
  },
  {
    slug: "cultura",
    label: "Cultura",
    description: "Cultura, tradiciones, fiestas y agenda de Tenerife.",
    color: "ocean",
  },
  {
    slug: "deportes",
    label: "Deportes",
    description: "Deporte tinerfeño: CD Tenerife y toda la actualidad deportiva de la isla.",
    color: "sunset",
  },
  {
    slug: "economia",
    label: "Economía",
    description: "Economía, empleo y empresas en Tenerife.",
    color: "gold",
  },
  {
    slug: "canarias",
    label: "Canarias",
    description:
      "Actualidad del resto del archipiélago: Gran Canaria, Lanzarote, Fuerteventura, La Palma, La Gomera y El Hierro.",
    color: "ocean",
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
