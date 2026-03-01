import React from "react";

function Placeholder() {
  return (
    <div style={{
      padding: "3rem 2.5rem",
      background: "#050608",
      color: "#f5f5f5",
      textAlign: "center",
      minHeight: "50vh"
    }}>
      <h2 style={{
        fontSize: 32,
        marginBottom: 16,
        fontWeight: 700,
        color: "#0FD980",
        fontFamily: "'Orbitron', sans-serif"
      }}>
        Coming Soon
      </h2>
      <p style={{
        fontSize: 18,
        opacity: 0.8,
        maxWidth: "600px",
        margin: "0 auto",
        lineHeight: 1.6
      }}>
        This section is under development. Check back soon for exciting new content!
      </p>
    </div>
  );
}

export default Placeholder;
