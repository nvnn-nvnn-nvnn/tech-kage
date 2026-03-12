import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';
import techKageLogo from '../assets/TechKage.svg';

// ─────────────────────────────────────────────────────────────────────────────
// HEADER — OathNet-inspired slim layout (h-16 / 64px)
// To revert to the original taller header, restore from git or the backup below:
//
//   ORIGINAL STYLE KEY DIFFERENCES:
//   - background: "#030407" (solid dark, no gradient)
//   - padding: "1.5rem 2.5rem" (taller)
//   - Top accent line (2px green gradient bar at very top)
//   - Bottom glow div (absolute positioned)
//   - Nav pills had green border styling
//   - Subtitle text: "The Go-To Budget Calculator for Tech Enthusiasts"
// ─────────────────────────────────────────────────────────────────────────────

function Header() {
  const [hoveredNav, setHoveredNav] = useState(null);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [productsDropdownVisible, setProductsDropdownVisible] = useState(false);
  const [showTechnologyDropdown, setShowTechnologyDropdown] = useState(false);
  const [technologyDropdownVisible, setTechnologyDropdownVisible] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hideTimeoutRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "AI Builder", path: "/builder" },
    { label: "Manual Builder", path: "/manual" },
    { label: "Products", path: null, hasDropdown: true },
    { label: "Technology", path: null, hasDropdown: true },
    { label: "Forums", path: "/forums" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ];

  const productDropdownItems = [
    { label: "Prebuilt PCs", path: "/products/prebuilt" },
    { label: "Desktop Accessories", path: "/products/accessories" },
    { label: "RubberDucky", path: "/products/rubberducky" },
  ];

  const technologyDropdownItems = [
    { label: "Raspberry PI", path: "/raspberry" },
    { label: "Drones", path: "/drones" },
    { label: "3D Printing", path: "/ThreeDPrinting" },
  ];

  useEffect(() => {
    return () => { if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current); };
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleOpenAuth = () => setShowAuth(true);
    window.addEventListener('open-auth-modal', handleOpenAuth);
    return () => window.removeEventListener('open-auth-modal', handleOpenAuth);
  }, []);

  // Products dropdown
  const openDropdown = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setShowProductsDropdown(true);
    requestAnimationFrame(() => setProductsDropdownVisible(true));
  };
  const closeDropdown = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setProductsDropdownVisible(false);
      setTimeout(() => setShowProductsDropdown(false), 220);
    }, 180);
  };

  // Technology dropdown
  const openTechnologyDropdown = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setShowTechnologyDropdown(true);
    requestAnimationFrame(() => setTechnologyDropdownVisible(true));
  };
  const closeTechnologyDropdown = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setTechnologyDropdownVisible(false);
      setTimeout(() => setShowTechnologyDropdown(false), 220);
    }, 180);
  };

  // ── Nav link style (OathNet-inspired: plain text, subtle hover) ──
  const navLinkStyle = (label, isActive) => ({
    fontSize: 13,
    fontWeight: isActive ? 600 : 500,
    color: isActive ? "#0FD980" : hoveredNav === label ? "#fff" : "rgba(255,255,255,0.55)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px 2px",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    transition: "color 0.15s ease",
    letterSpacing: 0.2,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  });

  // ── Dropdown panel shared style ──
  const dropdownPanelStyle = (visible) => ({
    position: "absolute",
    top: "calc(100% + 10px)",
    left: 0,
    minWidth: 190,
    background: "rgba(5,6,8,0.96)",
    borderRadius: 10,
    border: "1px solid rgba(15,217,128,0.2)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(15,217,128,0.05)",
    padding: "6px",
    zIndex: 9999,
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(-6px)",
    transition: "opacity 0.18s ease-out, transform 0.18s ease-out",
    pointerEvents: visible ? "auto" : "none",
    backdropFilter: "blur(12px)",
  });

  return (
    <>
      <header style={{
        // OathNet-inspired: frosted glass, gradient background — tall on desktop, slim on mobile
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        height: isMobile ? 88 : 88,
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(90deg, #020305 0%, rgba(5,15,10,0.95) 50%, #020305 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        <div style={{
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: isMobile ? "0 1.25rem" : "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}>

          {/* ── LEFT: Logo + Brand ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Logo icon container — OathNet style gradient box */}
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                // background: "linear-gradient(135deg, #0FD980, rgba(15,217,128,0.4))",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                width: 45,
                height: 45,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // boxShadow: "0 4px 14px rgba(15,217,128,0.25)",
                flexShrink: 0,
              }}
            >
              <img src={techKageLogo} alt="Tech Kage Logo" style={{ width: 50, height: 50 }} />
            </button>

            {/* Brand name */}
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontSize: isMobile ? 13 : 16,
                letterSpacing: 5,
                textTransform: "uppercase",
                color: "#fff",
                fontWeight: 700,
                lineHeight: 1,
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              TECH <span style={{ color: "#0FD980" }}>KΛGE</span>
            </button>
          </div>

          {/* ── CENTER: Nav links (OathNet style) ── */}
          {!isMobile && (
            <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
              {navItems.map((item) => {
                const isActive = item.path && location.pathname === item.path;

                if (!item.hasDropdown) {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => navigate(item.path)}
                      style={navLinkStyle(item.label, isActive)}
                      onMouseEnter={() => setHoveredNav(item.label)}
                      onMouseLeave={() => setHoveredNav(null)}
                    >
                      {item.label}
                    </button>
                  );
                }

                const openFunc = item.label === "Products" ? openDropdown : openTechnologyDropdown;
                const closeFunc = item.label === "Products" ? closeDropdown : closeTechnologyDropdown;

                return (
                  <div
                    key={item.label}
                    style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
                    onMouseEnter={() => { setHoveredNav(item.label); openFunc(); }}
                    onMouseLeave={() => { setHoveredNav(null); closeFunc(); }}
                  >
                    <button type="button" style={navLinkStyle(item.label, false)}>
                      {item.label}
                      <span style={{ fontSize: 9, opacity: 0.6, marginLeft: 2 }}>▾</span>
                    </button>

                    {/* Products Dropdown */}
                    {item.label === "Products" && showProductsDropdown && (
                      <div style={dropdownPanelStyle(productsDropdownVisible)}>
                        {productDropdownItems.map((d) => (
                          <button
                            key={d.label}
                            type="button"
                            onClick={() => { navigate(d.path); setHoveredNav(null); setProductsDropdownVisible(false); setShowProductsDropdown(false); }}
                            style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", fontSize: 12, borderRadius: 7, border: "none", background: "transparent", color: "rgba(255,255,255,0.65)", letterSpacing: 0.3, cursor: "pointer", transition: "background 0.12s, color 0.12s", fontFamily: "inherit" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,217,128,0.12)"; e.currentTarget.style.color = "#0FD980"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Technology Dropdown */}
                    {item.label === "Technology" && showTechnologyDropdown && (
                      <div style={dropdownPanelStyle(technologyDropdownVisible)}>
                        {technologyDropdownItems.map((d) => (
                          <button
                            key={d.label}
                            type="button"
                            onClick={() => { navigate(d.path); setHoveredNav(null); setTechnologyDropdownVisible(false); setShowTechnologyDropdown(false); }}
                            style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", fontSize: 12, borderRadius: 7, border: "none", background: "transparent", color: "rgba(255,255,255,0.65)", letterSpacing: 0.3, cursor: "pointer", transition: "background 0.12s, color 0.12s", fontFamily: "inherit" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,217,128,0.12)"; e.currentTarget.style.color = "#0FD980"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          )}

          {/* ── RIGHT: Auth ── */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, flexShrink: 0 }}>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

                {/* Profile pill */}
                <button
                  type="button"
                  onClick={() => navigate(`/profile/${user.id}`)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: "rgba(15,217,128,0.07)",
                    border: "1px solid rgba(15,217,128,0.2)",
                    borderRadius: 8, padding: "6px 12px",
                    cursor: "pointer", transition: "all 0.18s ease", flexShrink: 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,217,128,0.13)"; e.currentTarget.style.borderColor = "rgba(15,217,128,0.45)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(15,217,128,0.07)"; e.currentTarget.style.borderColor = "rgba(15,217,128,0.2)"; }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #0FD980, rgba(15,217,128,0.3))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 900, color: "#050608",
                  }}>
                    {user.email?.slice(0, 2).toUpperCase()}
                  </div>
                  {!isMobile && (
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "'JetBrains Mono', monospace", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.email?.split("@")[0]}
                    </span>
                  )}
                </button>

                {/* Cart */}
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  style={{
                    padding: "7px 14px", fontSize: 12, fontWeight: 600,
                    letterSpacing: 0.5,
                    borderRadius: 8, border: "1px solid rgba(15,217,128,0.35)",
                    background: "rgba(15,217,128,0.07)", color: "#0FD980",
                    cursor: "pointer", transition: "all 0.18s ease", flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#0FD980"; e.currentTarget.style.color = "#050608"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(15,217,128,0.07)"; e.currentTarget.style.color = "#0FD980"; }}
                >
                  🛒 {!isMobile && "Cart"}
                </button>

                {/* Sign out — OathNet plain text style */}
                <button
                  type="button"
                  onClick={async () => { await signOut(); navigate("/"); setMenuOpen(false); }}
                  style={{
                    padding: "7px 12px", fontSize: 12, fontWeight: 500,
                    borderRadius: 8, border: "none",
                    background: "transparent", color: "rgba(255,255,255,0.3)",
                    cursor: "pointer", transition: "color 0.15s ease", flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#ff6b6b"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; }}
                >
                  {isMobile ? "Out" : "Sign Out"}
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Login — OathNet plain style */}
                <button
                  type="button"
                  onClick={() => setShowAuth(true)}
                  style={{
                    padding: "7px 14px", fontSize: 13, fontWeight: 500,
                    borderRadius: 8, border: "none",
                    background: "transparent", color: "rgba(255,255,255,0.55)",
                    cursor: "pointer", transition: "color 0.15s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                >
                  Login
                </button>

                {/* Sign Up — OathNet gradient button style, Tech Kage green */}
                <button
                  type="button"
                  onClick={() => setShowAuth(true)}
                  style={{
                    padding: isMobile ? "7px 16px" : "8px 20px",
                    fontSize: 13, fontWeight: 700,
                    borderRadius: 8,
                    border: "none",
                    background: "linear-gradient(135deg, #0FD980, #0ab868)",
                    color: "#050608",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(15,217,128,0.3)",
                    transition: "filter 0.15s, box-shadow 0.15s",
                    fontFamily: "inherit",
                    letterSpacing: 0.3,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.1)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,217,128,0.45)"; }}
                  onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(15,217,128,0.3)"; }}
                >
                  {isMobile ? "Join" : "Get Started"}
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            {isMobile && (
              <button
                onClick={() => setMenuOpen(true)}
                style={{ display: "flex", flexDirection: "column", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 6 }}
              >
                {[0, 1, 2].map(i => <span key={i} style={{ width: 20, height: 2, background: "#0FD980", borderRadius: 2 }} />)}
              </button>
            )}
          </div>
        </div>

      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}

      {/* ── Mobile Drawer ── */}
      <>
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 9998, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none", transition: "opacity 0.3s ease" }}
        />
        <div style={{
          position: "fixed", top: 0, left: 0, bottom: 0, width: 280,
          background: "rgba(3,4,7,0.98)", borderRight: "1px solid rgba(15,217,128,0.15)",
          boxShadow: menuOpen ? "4px 0 32px rgba(0,0,0,0.6)" : "none",
          zIndex: 9999, transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex", flexDirection: "column", overflowY: "auto",
          backdropFilter: "blur(16px)",
        }}>
          <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, letterSpacing: 4, color: "#0FD980", textTransform: "uppercase", fontWeight: 700 }}>TECH KΛGE</span>
            <button
              onClick={() => setMenuOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 18, lineHeight: 1, padding: 4, transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#0FD980"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
            >✕</button>
          </div>

          {user && (
            <button
              onClick={() => { navigate(`/profile/${user.id}`); setMenuOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 12, margin: "12px 12px 0", padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(15,217,128,0.2)", background: "rgba(15,217,128,0.05)", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,217,128,0.1)"; e.currentTarget.style.borderColor = "rgba(15,217,128,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(15,217,128,0.05)"; e.currentTarget.style.borderColor = "rgba(15,217,128,0.2)"; }}
            >
              <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #0FD980, rgba(15,217,128,0.3))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#050608" }}>
                {user.email?.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#f5f5f5" }}>{user.email?.split("@")[0]}</div>
                <div style={{ fontSize: 9, letterSpacing: 1.5, color: "#0FD980", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>View Profile →</div>
              </div>
            </button>
          )}

          <div style={{ padding: "12px 12px 16px", display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
            {navItems.filter(item => item.path).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => { navigate(item.path); setMenuOpen(false); }}
                  style={{ width: "100%", textAlign: "left", padding: "11px 14px", fontSize: 13, borderRadius: 8, border: `1px solid ${isActive ? "rgba(15,217,128,0.4)" : "transparent"}`, background: isActive ? "rgba(15,217,128,0.07)" : "transparent", color: isActive ? "#0FD980" : "rgba(255,255,255,0.6)", letterSpacing: 0.3, cursor: "pointer", fontWeight: isActive ? 600 : 400, transition: "all 0.15s", fontFamily: "inherit" }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(15,217,128,0.05)"; e.currentTarget.style.color = "#fff"; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; } }}
                >
                  {item.label}
                </button>
              );
            })}

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.2)", marginBottom: 6, paddingLeft: 14, textTransform: "uppercase" }}>Products</div>
              {productDropdownItems.map((d) => (
                <button key={d.label} onClick={() => { navigate(d.path); setMenuOpen(false); }}
                  style={{ width: "100%", textAlign: "left", padding: "9px 14px 9px 24px", fontSize: 12, borderRadius: 8, border: "1px solid transparent", background: "transparent", color: "rgba(255,255,255,0.4)", letterSpacing: 0.3, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,217,128,0.06)"; e.currentTarget.style.color = "#0FD980"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                >
                  ↳ {d.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.2)", marginBottom: 6, paddingLeft: 14, textTransform: "uppercase" }}>Technology</div>
              {technologyDropdownItems.map((d) => (
                <button key={d.label} onClick={() => { navigate(d.path); setMenuOpen(false); }}
                  style={{ width: "100%", textAlign: "left", padding: "9px 14px 9px 24px", fontSize: 12, borderRadius: 8, border: "1px solid transparent", background: "transparent", color: "rgba(255,255,255,0.4)", letterSpacing: 0.3, cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,217,128,0.06)"; e.currentTarget.style.color = "#0FD980"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                >
                  ↳ {d.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={() => { navigate("/builder"); setMenuOpen(false); }}
              style={{ width: "100%", padding: "11px", fontSize: 13, fontWeight: 700, letterSpacing: 0.5, borderRadius: 8, border: "none", background: "linear-gradient(135deg, #0FD980, #0ab868)", color: "#050608", cursor: "pointer", boxShadow: "0 4px 14px rgba(15,217,128,0.25)", transition: "filter 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
              onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
            >
              Start Building →
            </button>
            <button
              onClick={() => { navigate("/cart"); setMenuOpen(false); }}
              style={{ width: "100%", padding: "11px", fontSize: 13, fontWeight: 600, letterSpacing: 0.5, borderRadius: 8, border: "1px solid rgba(15,217,128,0.3)", background: "transparent", color: "#0FD980", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,217,128,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              View Cart
            </button>
            {user && (
              <button
                onClick={() => { signOut(); navigate("/"); setMenuOpen(false); }}
                style={{ width: "100%", padding: "9px", fontSize: 12, letterSpacing: 0.3, borderRadius: 8, border: "1px solid rgba(255,100,100,0.15)", background: "transparent", color: "rgba(255,100,100,0.5)", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,100,100,0.07)"; e.currentTarget.style.color = "#FF6B6B"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,100,100,0.5)"; }}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}

export default Header;