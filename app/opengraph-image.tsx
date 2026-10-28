import { ImageResponse } from "next/og";

export const alt =
  "Kemal Talha Ekici — ICT Systems, Cybersecurity, Artificial Intelligence";
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
          justifyContent: "space-between",
          backgroundColor: "#06080a",
          backgroundImage:
            "linear-gradient(115deg, rgba(95,227,255,0.10) 0%, rgba(6,8,10,0) 52%, rgba(198,242,110,0.06) 100%)",
          color: "#e9edf0",
          padding: "56px 64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(233,237,240,0.18)",
            paddingBottom: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                border: "1px solid rgba(233,237,240,0.3)",
                fontSize: 13,
                letterSpacing: 1,
                color: "#06080a",
                backgroundColor: "#e9edf0",
                fontWeight: 700,
              }}
            >
              KTE
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 12,
                letterSpacing: 4,
                color: "rgba(233,237,240,0.55)",
              }}
            >
              <span>ICT ENGINEERING</span>
              <span style={{ fontSize: 10, color: "rgba(233,237,240,0.32)" }}>
                PORTFOLIO / 2026
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 11,
              letterSpacing: 3,
              color: "#5fe3ff",
            }}
          >
            <div style={{ width: 7, height: 7, backgroundColor: "#5fe3ff" }} />
            SYSTEM VIEW
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 0.9,
            }}
          >
            <span>KEMAL TALHA</span>
            <span style={{ color: "#5fe3ff" }}>EKİCİ</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 1,
              color: "rgba(233,237,240,0.66)",
            }}
          >
            Systems are complex. I make them work together.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(233,237,240,0.18)",
            paddingTop: 20,
            fontSize: 12,
            letterSpacing: 4,
            color: "rgba(233,237,240,0.5)",
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            <span>CYBERSECURITY</span>
            <span>NETWORK</span>
            <span>INFRASTRUCTURE</span>
            <span>AI</span>
            <span>WEB</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 7, height: 7, backgroundColor: "#c6f26e" }} />
            <span style={{ color: "rgba(233,237,240,0.7)" }}>TR / EN</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
