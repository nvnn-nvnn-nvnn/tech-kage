import React from "react";
import PartPicker from "../components/PartPicker";
import Test from "../components/Test";

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
      display: "flex",
      flexDirection: "column",
      alignItems: "center",          // centers children horizontally
      justifyContent: "flex-start",   // stacks children from the top
      fontFamily: T.mono,
    }}>
      {/* Header – full width, no margins/padding from parent */}
      <div style={{
        background: "#212121",
        width: "100%",
        textAlign: "center",
        padding: "2rem 0",            // vertical padding inside header
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 32,
          fontWeight: 700,
          fontFamily: T.display,
          background: "linear-gradient(135deg, #0FD980 0%, #0A8F5A 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Manual Part Picker
        </h3>
      </div>

      {/* Content wrapper – adds padding only where needed */}
      <div style={{
        width: "100%",
        padding: "1rem 1.5rem",       // restore spacing for main content
      }}>
        {/* Place your part picker UI here */}
        <div style={{ color: T.textMid, textAlign: "center" }}>
          <PartPicker />
          {/* <Test /> */}

        </div>
      </div>
    </div>
  );
}