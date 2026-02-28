import React from "react";

const T = {
  bg: "#050608",
  card: "#0A0C10",
  green: "#0FD980",
  border: "rgba(255,255,255,0.08)",
  text: "#f5f5f5",
  textMid: "rgba(255,255,255,0.45)",
  textDim: "rgba(255,255,255,0.2)",
  mono: "'JetBrains Mono', monospace",
  display: "'Orbitron', sans-serif",
};

export default function ManualPartPicker() {
  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      padding: "3rem 1.5rem",
      color: T.text,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 20,
      fontFamily: T.mono,
    }}>
      <div style={{ fontSize: 48 }}>🔧</div>
      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: T.display }}>Manual Part Picker</div>
      <div style={{ fontSize: 16, color: T.textMid, textAlign: "center" }}>
        Select and customize your PC parts manually.<br />
        Coming Soon...
      </div>
    </div>
  );
}
