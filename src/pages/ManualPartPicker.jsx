import React from "react";
import PartPicker from "../components/PartPicker";

const T = {
  bg: "#050608",
  card: "#0A0C10",
  green: "#0FD980",
  greenFaint: "rgba(15,217,128,0.10)",
  border: "rgba(255,255,255,0.08)",
  text: "#f5f5f5",
  textMid: "rgba(255,255,255,0.60)",
  textDim: "rgba(255,255,255,0.38)",
  mono: "'JetBrains Mono', monospace",
  display: "'Orbitron', sans-serif",
};

export default function ManualPartPicker() {
  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      backgroundImage: `
        radial-gradient(ellipse at 20% 30%, rgba(15,217,128,0.08) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 70%, rgba(15,217,128,0.05) 0%, transparent 50%)
      `,
      fontFamily: T.mono,
    }}>
      {/* Header Section */}
      <div style={{
        background: `linear-gradient(180deg, ${T.card} 0%, transparent 100%)`,
        borderBottom: `1px solid ${T.border}`,
        padding: "3rem 1.5rem 2rem",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 10,
          letterSpacing: 4,
          color: T.green,
          marginBottom: 12,
          fontWeight: 600,
        }}>
          BUILD YOUR DREAM PC
        </div>
        <h1 style={{
          margin: 0,
          fontSize: 42,
          fontWeight: 900,
          fontFamily: T.display,
          background: "linear-gradient(135deg, #0FD980 0%, #0AA868 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 8,
        }}>
          Manual Part Picker
        </h1>
        <p style={{
          fontSize: 14,
          color: T.textMid,
          margin: "0 auto",
          maxWidth: 600,
          lineHeight: 1.6,
        }}>
          Hand-pick every component for your custom PC build. Compare prices, check availability, and build your perfect system.
        </p>
      </div>

      {/* Content */}
      <div style={{
        width: "100%",
      }}>
        <PartPicker />
      </div>
    </div>
  );
}