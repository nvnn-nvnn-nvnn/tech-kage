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

export default function AffiliateNotice() {
  return (
    <div style={{
      minHeight: "100vh",
      background: T.bg,
      padding: "3rem 1.5rem",
      color: T.text,
      fontFamily: T.mono,
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{
          fontSize: "48px",
          fontWeight: 800,
          fontFamily: T.display,
          marginBottom: "2rem",
          color: T.green
        }}>
          Affiliate Disclosure
        </h1>

        <div style={{
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          padding: "2rem",
          lineHeight: 1.6,
        }}>
          <p style={{ marginBottom: "1.5rem" }}>
            Tech Kage is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
          </p>

          <p style={{ marginBottom: "1.5rem" }}>
            When you click on links to Amazon.com on this site and make a purchase, we may earn a small commission at no additional cost to you.
          </p>

          <p style={{ marginBottom: "1.5rem" }}>
            Our Associate ID is: techkage-20
          </p>

          <p style={{ marginBottom: "1.5rem", fontSize: "14px", color: T.textDim }}>
            Last updated: February 26, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
