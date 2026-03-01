import React from "react";

export default function PrivacyPolicy() {
  return (
    <div style={{ minHeight: "100vh", background: "#050608", color: "#f5f5f5", padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem", color: "#0FD980", fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>Privacy Policy</h1>
        <p style={{ fontSize: "1.2rem", lineHeight: 1.6 }}>
          Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ color: "#0FD980" }}>Information We Collect</h2>
          <p>We collect information you provide when using our services, such as account details, build data, and contact information. We may also collect usage data to improve our platform.</p>

          <h2 style={{ color: "#0FD980" }}>How We Use Information</h2>
          <p>To provide our services, improve our platform, communicate with you about updates, and ensure a secure experience. We do not sell your personal information to third parties.</p>

          <h2 style={{ color: "#0FD980" }}>Data Security</h2>
          <p>We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.</p>

          <h2 style={{ color: "#0FD980" }}>Cookies and Tracking</h2>
          <p>We use cookies to enhance your experience on our site. You can manage cookie preferences through your browser settings.</p>

          <h2 style={{ color: "#0FD980" }}>Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>

          <h2 style={{ color: "#0FD980" }}>Contact Us</h2>
          <p>For questions about this policy, please contact us at privacy@techkage.com.</p>
          <p>This privacy policy is subject to updates. Last updated: February 26, 2026.</p>
        </div>
      </div>
    </div>
  );
}
