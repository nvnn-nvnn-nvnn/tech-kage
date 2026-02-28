import React from "react";

export default function Careers() {
  return (
    <div style={{ minHeight: "100vh", background: "#050608", color: "#f5f5f5", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "#0FD980", fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>Careers</h1>
        <p style={{ fontSize: "1.2rem", lineHeight: 1.6 }}>
          Join the Tech Kage team and help shape the future of PC building.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ color: "#0FD980" }}>Open Positions</h2>
          <p>We're always looking for talented individuals in software development, design, and more.</p>
          <h2 style={{ color: "#0FD980" }}>Apply</h2>
          <p>Send us your resume and portfolio.</p>
          <p>Career opportunities coming soon...</p>
        </div>
      </div>
    </div>
  );
}
