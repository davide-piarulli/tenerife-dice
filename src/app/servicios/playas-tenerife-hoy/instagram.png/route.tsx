import { ImageResponse } from "next/og";
import { getPlayas, resumir } from "@/lib/playas";

export const dynamic = "force-static";

// 1080x1350 card for the daily Instagram post. n8n converts it to JPEG before publishing.
const fmtDia = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

export async function GET() {
  const r = resumir(await getPlayas());
  const fecha = r ? fmtDia.format(new Date(`${r.fecha}T12:00:00Z`)) : "";
  const mejores = r?.mejores.slice(0, 5) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px 56px",
          background: "linear-gradient(160deg, #073d4a 0%, #0b5e73 60%, #e0501f 130%)",
          color: "#faf4e9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, letterSpacing: 4, textTransform: "uppercase", color: "#f0a83a" }}>
          Tenerife Dice
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, lineHeight: 1.05, marginTop: 24 }}>
          Playas de Tenerife hoy
        </div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 16, opacity: 0.9 }}>{fecha}</div>

        <div style={{ display: "flex", fontSize: 36, marginTop: 44, color: "#f0a83a" }}>
          {mejores.length > 0 ? "Las mejores para ir hoy" : "Hoy, mar o viento en buena parte de la isla"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 24, gap: 18 }}>
          {mejores.map((p) => (
            <div
              key={p.nombre}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(250,244,233,0.12)",
                borderRadius: 24,
                padding: "18px 32px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>{p.nombre}</div>
                <div style={{ display: "flex", fontSize: 28, opacity: 0.8 }}>{p.municipio}</div>
              </div>
              <div style={{ display: "flex", fontSize: 44, fontWeight: 700 }}>
                {p.tMax !== undefined ? `${p.tMax}°` : ""}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexGrow: 1, minHeight: 32 }} />
        <div style={{ display: "flex", fontSize: 30, opacity: 0.85 }}>
          Mar, viento y webcams de {r?.total ?? 0} playas en tenerifedice.com
        </div>
        <div style={{ display: "flex", fontSize: 24, opacity: 0.6, marginTop: 8 }}>Previsión: AEMET</div>
      </div>
    ),
    { width: 1080, height: 1350 },
  );
}
