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
            At Tech Kage, we are committed to transparency and honesty in all our business practices.
            This Affiliate Disclosure page outlines our affiliate marketing relationships and how they work.
          </p>

          <h2 style={{
            fontSize: "24px",
            fontWeight: 700,
            color: T.green,
            marginBottom: "1rem",
            marginTop: "2rem"
          }}>
            What is Affiliate Marketing?
          </h2>

          <p style={{ marginBottom: "1.5rem" }}>
            Affiliate marketing is a type of performance-based marketing where we earn a commission by promoting
            other companies' products. When you click on an affiliate link and make a purchase, we may receive a
            small percentage of the sale at no extra cost to you.
          </p>

          <h2 style={{
            fontSize: "24px",
            fontWeight: 700,
            color: T.green,
            marginBottom: "1rem",
            marginTop: "2rem"
          }}>
            How It Works on This Site
          </h2>

          <p style={{ marginBottom: "1.5rem" }}>
            Some of the links on this website are affiliate links. This means that if you click on the link and
            purchase the item, we will receive an affiliate commission. The price will be the same whether you
            use the affiliate link or go directly to the merchant's website.
          </p>

          <p style={{ marginBottom: "1.5rem" }}>
            We only recommend products that we believe in and that align with our mission of providing quality
            PC building experiences. Our recommendations are not influenced by affiliate commissions.
          </p>

          <h2 style={{
            fontSize: "24px",
            fontWeight: 700,
            color: T.green,
            marginBottom: "1rem",
            marginTop: "2rem"
          }}>
            Transparency
          </h2>

          <p style={{ marginBottom: "1.5rem" }}>
            We will always clearly mark affiliate links when possible. However, some affiliate links may not be
            explicitly marked if they are integrated into our content naturally.
          </p>

          <p style={{ marginBottom: "1.5rem" }}>
            If you have any questions about our affiliate relationships or this disclosure, please contact us
            at <a href="mailto:TechKage@Proton.me" style={{ color: T.green }}>TechKage@Proton.me</a>.
          </p>

          <p style={{ marginBottom: "1.5rem", fontSize: "14px", color: T.textDim }}>
            Last updated: February 26, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
