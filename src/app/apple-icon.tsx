import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b5e73",
          borderRadius: 40,
        }}
      >
        <div style={{ display: "flex", position: "relative", width: 150, height: 150 }}>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: 150,
              height: 60,
              background: "#faf4e9",
              opacity: 0.9,
              borderRadius: "60px 60px 24px 24px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 30,
              left: 66,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#f0a83a",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 66,
              left: 30,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#faf4e9",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 66,
              left: 100,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "#faf4e9",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
