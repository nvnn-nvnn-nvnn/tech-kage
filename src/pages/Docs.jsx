import React from "react";

export default function Docs() {
  return (
    <div style={{ minHeight: "100vh", background: "#050608", color: "#f5f5f5", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "#0FD980", fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }} > Documentation</h1>
        <p style={{ fontSize: "1.2rem", lineHeight: 1.6 }}>
          Comprehensive guides and API documentation for developers and users.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ color: "#0FD980" }}>Getting Started</h2>
          <p>How to use the PC builder, customize builds, and more.</p>
          <h2 style={{ color: "#0FD980" }}>API Reference</h2>
          <p>Technical documentation for integrations.</p>
          <p>Full documentation coming soon...</p>
        </div>
      </div>
    </div >
  );
}
