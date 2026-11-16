import { ogServicio, ogSize } from "@/lib/og-servicio";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Tenerife Dice · Servicios útiles";

export default function Image() {
  return ogServicio("guaguas-aeropuertos-tenerife");
}
