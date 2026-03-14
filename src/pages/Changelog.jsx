import React from "react";
import techKageLogo from "../assets/TechKage.svg";

export default function Changelog() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050608",
        color: "#f5f5f5",
        padding: "4rem 1.5rem",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <img src={techKageLogo} alt="Tech Kage Logo" style={{ width: "85px", height: "auto", marginBottom: "2.5rem", alignItems: "center", display: "block", margin: "0 auto", flexDirection: "column", }} />
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: "3.2rem",
            marginBottom: "1.5rem",
            color: "#0FD980",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          Changelog
        </h1>

        <p
          style={{
            fontSize: "1.25rem",
            lineHeight: 1.7,
            color: "#d1d5db",
            marginBottom: "3.5rem",
          }}
        >
          Real-time development log for <strong>Tech Kage</strong>.
          We're building fast — check back often.
        </p>

        {/* Most recent first */}
        <section style={{ marginBottom: "4rem" }}>
          <h2
            style={{
              color: "#0FD980",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "2rem",
              marginBottom: "1.25rem",
              borderBottom: "2px solid #0FD98022",
              paddingBottom: "0.5rem",
            }}
          >
            March 14, 2026 — Parts & UI Polish
          </h2>
          <ul style={{ listStyleType: "none", paddingLeft: 0, fontSize: "1.0rem", lineHeight: 1.8 }}>
            <li>• Added detailed parts data to Supabase (specs, images, pricing)</li>
            <li>• Integrated part images + export branding</li>
            <li>• Improved responsive design for parts detail views</li>
            <li>• Added header highlights to the website</li>
            <li>• Updated Changelog information</li>
          </ul>
        </section>

        <section style={{ marginBottom: "4rem" }}>
          <h2
            style={{
              color: "#0FD980",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "2rem",
              marginBottom: "1.25rem",
              borderBottom: "2px solid #0FD98022",
              paddingBottom: "0.5rem",
            }}
          >
            March 12, 2026 — Contact + Backend Stability
          </h2>
          <ul style={{ listStyleType: "none", paddingLeft: 0, fontSize: "1.0rem", lineHeight: 1.8 }}>
            <li>• Fixed and fully initialized contact & email forms</li>
            <li>• Multiple backend routing, initialization, and Claude prompt fixes</li>
            <li>• Improved product pages rendering</li>
            <li>• Fixed AI Builder category filter error</li>
            <li>• Pricing + products display fixes + added build saving</li>
            <li style={{ color: "#0FD980", fontWeight: 600 }}>→ Site reported ~90% complete</li>
          </ul>
        </section>

        <section style={{ marginBottom: "4rem" }}>
          <h2
            style={{
              color: "#0FD980",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "2rem",
              marginBottom: "1.25rem",
              borderBottom: "2px solid #0FD98022",
              paddingBottom: "0.5rem",
            }}
          >
            March 11–10, 2026 — Data Accuracy & Connectivity
          </h2>
          <ul style={{ listStyleType: "none", paddingLeft: 0, fontSize: "1.0rem", lineHeight: 1.8 }}>
            <li>• Added accurate parts pricing, Amazon ASINs, and JSON relevance to Supabase</li>
            <li>• Connected backend → frontend for AI Builder</li>
            <li>• Fixed CORS, middleware, Railway deployment issues</li>
            <li>• Improved Claude catalog & response quality</li>
            <li>• Working backend with accurate API calls achieved</li>
          </ul>
        </section>

        <section style={{ marginBottom: "4rem" }}>
          <h2
            style={{
              color: "#0FD980",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "2rem",
              marginBottom: "1.25rem",
              borderBottom: "2px solid #0FD98022",
              paddingBottom: "0.5rem",
            }}
          >
            March 9–7, 2026 — Parts Foundation & Deployment Fixes
          </h2>
          <ul style={{ listStyleType: "none", paddingLeft: 0, fontSize: "1.0rem", lineHeight: 1.8 }}>
            <li>• Implemented PCPartPicker JSON parts data</li>
            <li>• Added/enriched parts specifications & pricing</li>
            <li>• Vercel Linux case-sensitivity + SPA routing fixes (vercel.json)</li>
            <li>• Added budgeting page layout & placeholders</li>
            <li>• Manual part picker design enhancements</li>
          </ul>
        </section>

        <section>
          <h2
            style={{
              color: "#0FD980",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "2rem",
              marginBottom: "1.25rem",
              borderBottom: "2px solid #0FD98022",
              paddingBottom: "0.5rem",
            }}
          >
            Earlier (Feb–Mar 1, 2026)
          </h2>
          <ul style={{ listStyleType: "none", paddingLeft: 0, fontSize: "1.0rem", lineHeight: 1.8, color: "#9ca3af" }}>
            <li>• Initial product & GPU data additions</li>
            <li>• Backend restructuring & Google verification</li>
            <li>• Blog, affiliate links, legal pages (careers, ToS, privacy)</li>
            <li>• Launched AI PC builder, cart, user profiles (v1.0 groundwork)</li>
          </ul>
          <p style={{ marginTop: "2rem", fontStyle: "italic", color: "#0FD98088" }}>
            Rapid iteration in progress — full v1.0 release and public launch coming soon.
          </p>
        </section>
      </div>
    </div>
  );
}