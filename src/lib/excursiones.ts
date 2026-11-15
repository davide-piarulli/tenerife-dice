// Excursions from our partner Nabila Experience (local agency, Registro General Turístico de Canarias).
// Affiliate attribution: the `coupon` query param sets their referral cookie (30 days).
// Descriptions are our own; prices are not shown because they change — the partner site is the reference.

export const AFILIADO = {
  nombre: "Nabila Experience",
  web: "https://nabilaexperience.com/es/",
  cupon: "DAVIDE10",
};

export function enlaceAfiliado(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}coupon=${AFILIADO.cupon}`;
}

export type CategoriaExcursion = "teide" | "mar" | "parques" | "aventura" | "movilidad";

export type Excursion = {
  id: string;
  titulo: string;
  categoria: CategoriaExcursion;
  descripcion: string;
  url: string;
  /** Required attribution for free-licence photos (Wikimedia Commons). */
  credito?: string;
};

const E = "https://nabilaexperience.com/es/experiencias/";

export const CATEGORIAS: { id: CategoriaExcursion; titulo: string }[] = [
  { id: "teide", titulo: "Teide y volcanes" },
  { id: "mar", titulo: "Mar, barcos y cetáceos" },
  { id: "parques", titulo: "Parques temáticos" },
  { id: "aventura", titulo: "Aventura y experiencias" },
  { id: "movilidad", titulo: "Coche y traslados" },
];

export const EXCURSIONES: Excursion[] = [
  { id: "teide-tour", categoria: "teide", titulo: "Excursión al Teide", descripcion: "Recorrido por el Parque Nacional del Teide para conocer el volcán y Las Cañadas sin preocuparte del coche ni del aparcamiento.", url: `${E}teide-tour/` },
  { id: "teide-teleferico", categoria: "teide", titulo: "Subida al Teide en teleférico", descripcion: "Excursión con subida en teleférico hasta La Rambleta, a más de 3.500 metros de altura.", url: `${E}subida-al-teleferico-del-pico-teide/` },
  { id: "teide-quad", categoria: "teide", titulo: "Quad por el Teide, de día o al atardecer", descripcion: "Ruta en quad por los paisajes volcánicos del Teide, con opción de hacerla a la puesta de sol.", url: `${E}tenerife-teide-quad-tour-dia-atardecer/` },
  { id: "teide-buggy", categoria: "teide", titulo: "Buggy por el Teide", descripcion: "La misma aventura volcánica en buggy, de día o al atardecer.", url: `${E}tenerife-teide-buggy-tour-dia-atardecer/` },
  { id: "jeep", categoria: "teide", titulo: "Safari en jeep 4x4", descripcion: "Excursión en 4x4 por pistas y miradores de la isla.", url: `${E}tour-jeep-tenerife/` },
  { id: "estrellas", categoria: "teide", titulo: "Observación de estrellas en el Teide", descripcion: "Tour privado nocturno para disfrutar de uno de los mejores cielos del mundo para ver estrellas.", url: `${E}observacion-estrellas-tenerife-tour-privado-teide/` },
  { id: "teide-masca", categoria: "teide", titulo: "Teide y Masca", descripcion: "Excursión de un día que combina el volcán con el caserío de Masca y sus barrancos.", url: `${E}teide-masca-tour-tenerife/` },
  { id: "ballenas", categoria: "mar", titulo: "Velero con avistamiento de cetáceos", descripcion: "Salida en velero para avistar cetáceos en libertad frente a la costa de Tenerife.", url: `${E}excursion-en-velero-avistamiento-ballenas-tenerife/` },
  { id: "catamaran", categoria: "mar", titulo: "Catamarán ecológico", descripcion: "Paseo en catamarán con observación de cetáceos.", url: `${E}excursion-en-catamaran-ecologico-en-tenerife/` },
  { id: "fiat500", categoria: "mar", titulo: "Barco Fiat 500", descripcion: "Una barca con forma de Fiat 500 que puedes conducir tú mismo, sin licencia.", url: `${E}barco-fiat-500-en-tenerife/` },
  { id: "moto-agua", categoria: "mar", titulo: "Moto de agua", descripcion: "Ruta guiada en moto de agua por la costa.", url: `${E}moto-de-agua-tenerife/` },
  { id: "kayak", categoria: "mar", titulo: "Kayak con snorkel", descripcion: "Ruta en kayak con parada para hacer snorkel.", url: `${E}tour-kayak-tenerife-con-snorkel/` },
  { id: "submarino", categoria: "mar", titulo: "Submarino", descripcion: "Inmersión en submarino para ver el fondo marino sin mojarte.", url: `${E}tour-en-submarino-en-tenerife/` },
  { id: "siam", categoria: "parques", titulo: "Siam Park", descripcion: "Entradas para el parque acuático de Costa Adeje.", url: `${E}siam-park-tenerife/`, credito: "Foto: stephen jones / Wikimedia Commons (CC BY 2.0)" },
  { id: "loro", categoria: "parques", titulo: "Loro Parque", descripcion: "Entradas para el zoológico y parque de Puerto de la Cruz.", url: `${E}loro-parque-tenerife/`, credito: "Foto: H. Zell / Wikimedia Commons (CC BY-SA 3.0)" },
  { id: "twin", categoria: "parques", titulo: "Entrada doble Siam Park + Loro Parque", descripcion: "Una sola entrada para los dos parques.", url: `${E}entrada-doble-siam-park-loro-parque/`, credito: "Foto: Tuxyso / Wikimedia Commons (CC BY-SA 4.0)" },
  { id: "parapente", categoria: "aventura", titulo: "Parapente desde el Teide", descripcion: "Vuelo biplaza en parapente con un piloto profesional.", url: `${E}parapente-en-tenerife-teide/` },
  { id: "caballo", categoria: "aventura", titulo: "Paseo a caballo", descripcion: "Ruta a caballo por el campo tinerfeño.", url: `${E}paseo-a-caballo-en-tenerife/` },
  { id: "helicoptero", categoria: "aventura", titulo: "Vuelo en helicóptero", descripcion: "Ver la isla, el Teide y la costa desde el aire.", url: `${E}tour-en-helicoptero-en-tenerife/` },
  { id: "coche", categoria: "movilidad", titulo: "Alquiler de coches", descripcion: "Coche de alquiler para moverte por la isla a tu ritmo.", url: "https://nabilaexperience.com/es/alquiler-de-coches-tenerife/" },
  { id: "traslado", categoria: "movilidad", titulo: "Traslados desde el aeropuerto", descripcion: "Traslado privado o compartido del aeropuerto a tu alojamiento.", url: "https://nabilaexperience.com/es/traslado-tenerife/" },
];

export function imagenExcursion(e: Excursion): string {
  return `/images/excursiones/${e.id}.webp`;
}

export function getExcursiones(ids: string[]): Excursion[] {
  return ids.map((id) => EXCURSIONES.find((e) => e.id === id)).filter((e): e is Excursion => !!e);
}
