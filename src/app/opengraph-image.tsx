import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "GoluPDFs — The Modern PDF Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background:
            "linear-gradient(135deg, #0a0f1c 0%, #1e1b4b 50%, #4c1d95 100%)",
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* mesh blobs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(219,39,119,0.5) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #2563eb, #7c3aed, #db2777)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            G
          </div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>
            GoluPDFs
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          <div style={{ display: "flex" }}>The modern</div>
          <div
            style={{
              display: "flex",
              backgroundImage: "linear-gradient(90deg, #60a5fa, #c084fc, #f472b6)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            PDF Studio.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 28,
            color: "rgba(255,255,255,0.75)",
            maxWidth: 900,
          }}
        >
          30+ premium PDF tools — compress, merge, sign, convert. Privately, in your browser.
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 60,
            left: 80,
            right: 80,
            justifyContent: "space-between",
            fontSize: 18,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <div style={{ display: "flex", gap: 24 }}>
            <span>🔒 Browser-side</span>
            <span>⚡ Sub-second</span>
            <span>★ 4.9 / 5</span>
          </div>
          <div style={{ display: "flex" }}>golupdfs.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
