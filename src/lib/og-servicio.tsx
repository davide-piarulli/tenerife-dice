import { ImageResponse } from "next/og";
import { getServicio } from "@/lib/servicios";

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph card for service pages (Facebook, WhatsApp, X previews). */
export function ogServicio(slug: string) {
  const s = getServicio(slug);
  const titulo = s?.short ?? "Tenerife Dice";
  const util = s?.util ?? "";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px 140px",
          background: "linear-gradient(160deg, #0b5e73 0%, #063a48 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", width: 22, height: 22, borderRadius: 11, background: "#f0a83a" }} />
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#faf4e9" }}>Tenerife Dice</div>
          <div style={{ display: "flex", fontSize: 26, color: "#f0a83a", marginLeft: 8 }}>· Servicios útiles</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: titulo.length > 24 ? 72 : 86, fontWeight: 800, color: "#ffffff", lineHeight: 1.05 }}>
            {titulo}
          </div>
          <div style={{ display: "flex", fontSize: 36, color: "#faf4e9", opacity: 0.9, maxWidth: 1000 }}>{util}</div>
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 70,
            background: "#faf4e9",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 72,
            fontSize: 28,
            fontWeight: 700,
            color: "#0b5e73",
          }}
        >
          tenerifedice.com
        </div>
      </div>
    ),
    ogSize,
  );
}
