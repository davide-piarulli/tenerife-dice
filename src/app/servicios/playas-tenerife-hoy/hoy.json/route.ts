import { getPlayas, resumir } from "@/lib/playas";

export const dynamic = "force-static";

// Daily summary consumed by the n8n workflow that posts "Playas de Tenerife hoy" to Instagram.
export async function GET() {
  const resumen = resumir(await getPlayas());
  return Response.json({ generado: new Date().toISOString(), resumen });
}
