import React, { useState } from "react";
import { Link } from "react-router-dom";


import TechKageLogo from "../assets/TechKage.svg";

function Footer() {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const links = {
    Explore: [
      { label: "PC Builder", path: "/builder" },
      // { label: "Budget AI", path: "/" },
      { label: "Part Picker", path: "/manual" },
      // { label: "Benchmarks", path: "/" },
      { label: "Build Gallery", path: "/gallery" },
    ],
    Resources: [
      { label: "Docs", path: "/docs" },
      { label: "Blog", path: "/blog" },
      { label: "Changelog", path: "/changelog" },
      { label: "Community", path: "/community" },
      { label: "Discord", path: "#" },
    ],
    Company: [
      { label: "About", path: "/about" },
      { label: "Careers", path: "/careers" },
      { label: "Press Kit", path: "#" },
      { label: "Contact", path: "/contact" },
      { label: "Terms of Service", path: "/terms-of-service" },
      { label: "Privacy Policy", path: "/privacy-policy" },
      { label: "Affiliate Disclosure", path: "/affiliate-notice" },
    ],
  };

  const socials = [
    {
      label: "X",
      href: "#",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "GitHub",
      href: "#",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      label: "YouTube",
      href: "#",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      label: "Discord",
      href: "#",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      style={{
        background: "#030407",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        color: "#f5f5f5",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .footer-top-row { grid-template-columns: 1fr !important; gap: 32px !important; }
          .footer-links-row { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .footer-bottom-bar { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
          .footer-newsletter-form { flex-direction: column !important; }
          .footer-newsletter-form input { width: 100% !important; }
          .footer-newsletter-form button { width: 100% !important; }
        }
        @media (max-width: 480px) {
          .footer-links-row { grid-template-columns: 1fr !important; }
          .footer-padding { padding: 2.5rem 1.25rem 2rem !important; }
        }
      `}</style>

      {/* Top glow */}
      <div style={{
        position: "absolute", top: 0, left: "50%",
        transform: "translateX(-50%)", width: "60%", height: 1,
        background: "linear-gradient(90deg, transparent, rgba(15,217,128,0.4), transparent)",
      }} />

      <div
        className="footer-padding"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2.5rem 2.5rem" }}
      >
        {/* Top row */}
        <div
          className="footer-top-row"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            marginBottom: "3.5rem",
            paddingBottom: "3rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: "linear-gradient(135deg, #0FD980, rgba(15,217,128,0.3))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 800, color: "#050608",
              }}>T</div> */}
              <img src={TechKageLogo} alt="Tech Kage Logo" style={{ width: 40, height: 40 }} />
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: 1, color: "#fff" }}>
                TECH KΛGE
              </span>
            </div>
            <p style={{
              fontSize: 14, lineHeight: 1.8,
              color: "rgba(255,255,255,0.45)", maxWidth: 320, margin: 0,
            }}>
              The smartest way to plan, build, and optimize your Technology. Powered by Devv. Built for builders.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,0.5)", textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(15,217,128,0.12)";
                    e.currentTarget.style.borderColor = "rgba(15,217,128,0.4)";
                    e.currentTarget.style.color = "#0FD980";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#0FD980" }}>
              Stay in the loop
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.4 }}>
              Build smarter. Get updates.
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: 1.7 }}>
              New features, AI tips, and curated build guides — straight to your inbox.
            </p>

            {subscribed ? (
              <div style={{
                padding: "0.9rem 1.2rem", borderRadius: 8,
                background: "rgba(15,217,128,0.1)", border: "1px solid rgba(15,217,128,0.3)",
                fontSize: 14, color: "#0FD980",
              }}>
                ✓ You're subscribed — welcome to the build.
              </div>
            ) : (
              <form
                className="footer-newsletter-form"
                onSubmit={handleSubscribe}
                style={{ display: "flex", gap: 8 }}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1, padding: "0.75rem 1rem", borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff", fontSize: 14, outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(15,217,128,0.5)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "0.75rem 1.2rem", borderRadius: 8,
                    border: "1px solid rgba(15,217,128,0.8)",
                    background: "#0FD980", color: "#050608",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    letterSpacing: 0.5, transition: "all 0.2s ease", whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1BF08E";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,217,128,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0FD980";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Link columns */}
        <div
          className="footer-links-row"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 32,
            marginBottom: "3rem",
          }}
        >
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <div style={{
                fontSize: 11, letterSpacing: 4, textTransform: "uppercase", color: "#0FD980", marginBottom: 8,
              }}>
                {category}
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {items.map((item, index) => (
                  <li key={index} style={{ marginBottom: 8 }}>
                    <Link
                      to={item.path}
                      style={{
                        fontSize: 14, color: "rgba(255,255,255,0.6)", textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="footer-bottom-bar"
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)",
            flexWrap: "wrap", gap: 12,
          }}
        >
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} Techkage. All rights reserved.
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, color: "rgba(255,255,255,0.2)",
          }}>
            <span>Built for builders</span>
            <span style={{
              width: 4, height: 4, borderRadius: "50%",
              background: "#0FD980", opacity: 0.6, display: "inline-block",
            }} />
            <span>Powered by Devv</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;