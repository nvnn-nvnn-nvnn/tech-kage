import React from "react";

export default function Changelog() {
  return (
    <div style={{ minHeight: "100vh", background: "#050608", color: "#f5f5f5", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "#0FD980" }}>Changelog</h1>
        <p style={{ fontSize: "1.2rem", lineHeight: 1.6 }}>
          Stay updated with the latest changes and improvements to Tech Kage.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ color: "#0FD980" }}>Version 0.1.0 - Beta Release (February 26, 2026)</h2>
          <ul>
            <li>Launched blog with clickable posts and detailed views</li>
            <li>Added affiliate links for gaming accessories</li>
            <li>Introduced careers, terms of service, and updated privacy policy pages</li>
            <li>Fixed various UI bugs and errors</li>
          </ul>
          
          <h2 style={{ color: "#0FD980" }}>Version 1.0.0 - Initial Release</h2>
          <ul>
            <li>Launched PC builder with AI recommendations</li>
            <li>Added cart and checkout functionality</li>
            <li>Introduced user profiles and saved builds</li>
          </ul>
          <p>More updates coming soon...</p>
        </div>
      </div>
    </div>
  );
}
