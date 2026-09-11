import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #073d4a 0%, #0b5e73 55%, #b93f18 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ display: "flex", position: "relative", width: 120, height: 120 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#0b5e73",
                borderRadius: 28,
                border: "4px solid rgba(250,244,233,0.35)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 4,
                left: 6,
                width: 108,
                height: 46,
                background: "#faf4e9",
                opacity: 0.9,
                borderRadius: "50px 50px 18px 18px",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 26,
                left: 50,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#f0a83a",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 54,
                left: 22,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#faf4e9",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 54,
                left: 78,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#faf4e9",
              }}
            />
          </div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, color: "#faf4e9" }}>
            Tenerife<span style={{ color: "#f0a83a", fontStyle: "italic" }}>&nbsp;Dice</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 32,
            color: "rgba(250,244,233,0.85)",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Lo que la isla cuenta
        </div>
      </div>
    ),
    { ...size },
  );
}
