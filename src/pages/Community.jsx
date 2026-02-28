import React from "react";

export default function Community() {
  return (
    <div style={{ minHeight: "100vh", background: "#050608", color: "#f5f5f5", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "#0FD980", fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>Community</h1>
        <p style={{ fontSize: "1.2rem", lineHeight: 1.6 }}>
          Join the Tech Kage community to connect with fellow PC builders, share builds, and get help.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ color: "#0FD980", fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>Forums</h2>
          <p>Discuss builds, troubleshooting, and more.</p>
          <h2 style={{ color: "#0FD980", fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>Discord</h2>
          <p>Join our Discord server for real-time chat.</p>
          <p>Community features coming soon...</p>
        </div>
      </div>
    </div>
  );
}
