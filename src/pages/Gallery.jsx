import React from "react";

export default function Gallery() {
  return (
    <div style={{ minHeight: "100vh", background: "#050608", color: "#f5f5f5", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "#0FD980", fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>Gallery</h1>
        <p style={{ fontSize: "1.2rem", lineHeight: 1.6 }}>
          Showcase of amazing PC builds created by the Tech Kage community.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <p>Featured builds and user submissions coming soon...</p>
        </div>
      </div>
    </div>
  );
}
