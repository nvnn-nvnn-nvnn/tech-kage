import React from "react";

export default function About() {
  return (
    <div style={{ minHeight: "100vh", background: "#050608", color: "#f5f5f5", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "#0FD980", fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>About Tech Kage</h1>
        <p style={{ fontSize: "1.2rem", lineHeight: 1.6 }}>
          Tech Kage is your ultimate companion for building custom PCs. Powered by AI, we simplify the process of selecting the perfect components, ensuring you get the best performance for your needs.
        </p>
        <p style={{ fontSize: "1.2rem", lineHeight: 1.6 }}>
          Our mission is to democratize PC building, making it accessible and fun for everyone, from beginners to enthusiasts.
        </p>
        <p>More details coming soon...</p>
      </div>
    </div>
  );
}
