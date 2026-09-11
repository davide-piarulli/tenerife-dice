export const SITE = {
  name: "Tenerife Dice",
  tagline: "Lo que la isla cuenta",
  description:
    "Noticias de Tenerife al minuto: actualidad, sucesos, turismo, cultura y deportes de la isla. Lo que pasa en Tenerife, contado por Tenerife Dice.",
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
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
