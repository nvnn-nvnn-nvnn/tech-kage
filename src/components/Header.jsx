import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';
import techKageLogo from '../assets/TechKage.svg';

function Header() {
  const [hoveredNav, setHoveredNav] = useState(null);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [productsDropdownVisible, setProductsDropdownVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hideTimeoutRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  const navItems = [
    { label: "Home",         path: "/" },
    { label: "Budgeting",    path: "/builder" },
    { label: "Part Picker",  path: "/manual" },
    { label: "Products",     path: null, hasDropdown: true },
    { label: "Raspberry PI", path: "/raspberry" },
    { label: "Drones",       path: "/drones" },
    { label: "3D Printing",  path: "/ThreeDPrinting" },
    { label: "Blog",         path: "/blog" },
    { label: "Contact",      path: "/contact" },
  ];

  const productDropdownItems = [
    { label: "Prebuilt PCs",         path: "/products/prebuilt" },
    { label: "Desktop Accessories",  path: "/products/accessories" },
    { label: "RubberDucky",          path: "/products/rubberducky" },
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

  const navPillStyle = (label, isActive) => ({
    padding: "4px 10px",
    fontSize: 10,
    borderRadius: 7,
    border: `1px solid ${hoveredNav === label || isActive ? "rgba(15,217,128,0.6)" : "rgba(15,217,128,0.4)"}`,
    background: hoveredNav === label || isActive ? "rgba(15,217,128,0.12)" : "rgba(15,217,128,0.03)",
    color: hoveredNav === label || isActive ? "#0FD980" : "#E5FDF3",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontWeight: hoveredNav === label || isActive ? 600 : 400,
  });

  return (
    <header style={{
      background: "#030407",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      position: "relative",
      overflow: "visible",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Top accent line */}
      <div style={{
        height: 2,
        background: "linear-gradient(90deg, transparent 0%, #0FD980 30%, rgba(15,217,128,0.4) 70%, transparent 100%)",
      }} />

      {/* Bottom glow */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%",
        transform: "translateX(-50%)", width: "60%", height: 1,
        background: "linear-gradient(90deg, transparent, rgba(15,217,128,0.4), transparent)",
      }} />

      <div style={{
        padding: isMobile ? "1rem 1.5rem" : "1.5rem 2.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>

        {/* ── LEFT ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          >
            <img src={techKageLogo} alt="Tech Kage Logo" style={{ width: 40, height: 40 }} />
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: isMobile ? 12 : 15, letterSpacing: 6, textTransform: "uppercase", color: "#0FD980", fontWeight: 700, lineHeight: 1 }}>
              TECH KΛGE
            </span>

            {!isMobile && (
              <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: 0.5, color: "rgba(255,255,255,0.35)", lineHeight: 1 }}>
                The Go-To Budget Calculator for Tech Enthusiasts
              </span>
            )}

            {!isMobile && (
              <div style={{ display: "flex", gap: 6, marginTop: 2, flexWrap: "wrap" }}>
                {navItems.map((item) => {
                  const isActive = item.path && location.pathname === item.path;

                  if (!item.hasDropdown) {
                    return (
                      <button key={item.label} type="button" onClick={() => navigate(item.path)}
                        style={navPillStyle(item.label, isActive)}
                        onMouseEnter={() => setHoveredNav(item.label)}
                        onMouseLeave={() => setHoveredNav(null)}
                      >
                        {item.label}
                      </button>
                    );
                  }
                  return (
                    <div key={item.label} style={{ position: "relative", display: "inline-block" }}
                      onMouseEnter={() => { setHoveredNav(item.label); openDropdown(); }}
                      onMouseLeave={() => { setHoveredNav(null); closeDropdown(); }}
                    >
                      <button type="button" style={navPillStyle(item.label, false)}>
                        {item.label} ▾
                      </button>
                      {showProductsDropdown && (
                        <div style={{
                          position: "absolute", top: "130%", left: 0, minWidth: 200,
                          background: "#050608", borderRadius: 8,
                          border: "1px solid rgba(15,217,128,0.35)",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.65)",
                          padding: 6, zIndex: 1000,
                          opacity: productsDropdownVisible ? 1 : 0,
                          transform: productsDropdownVisible ? "translateY(0)" : "translateY(-4px)",
                          transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
                          pointerEvents: productsDropdownVisible ? "auto" : "none",
                        }}>
                          {productDropdownItems.map((d) => (
                            <button key={d.label} type="button"
                              onClick={() => { navigate(d.path); setHoveredNav(null); setProductsDropdownVisible(false); setShowProductsDropdown(false); }}
                              style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 10px", fontSize: 10, borderRadius: 6, border: "none", background: "transparent", color: "#E5FDF3", letterSpacing: 1.2, textTransform: "uppercase", cursor: "pointer", transition: "background 0.15s, color 0.15s" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,217,128,0.16)"; e.currentTarget.style.color = "#0FD980"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#E5FDF3"; }}
                            >
                              {d.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 16, flexShrink: 0 }}>

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0FD980", boxShadow: "0 0 6px #0FD980", display: "inline-block", animation: "pulse 2s infinite" }} />
              New experiments soon
            </div>
          )}

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

              {/* Profile pill */}
              <button
                type="button"
                onClick={() => navigate(`/profile/${user.id}`)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: "rgba(15,217,128,0.06)",
                  border: "1px solid rgba(15,217,128,0.25)",
                  borderRadius: 8, padding: "7px 14px",
                  cursor: "pointer", transition: "all 0.2s ease", flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,217,128,0.12)"; e.currentTarget.style.borderColor = "rgba(15,217,128,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(15,217,128,0.06)"; e.currentTarget.style.borderColor = "rgba(15,217,128,0.25)"; }}
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
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontFamily: "'JetBrains Mono', monospace", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.email?.split("@")[0]}
                  </span>
                )}
              </button>

              {/* View Cart pill */}
              <button
                type="button"
                onClick={() => navigate("/cart")}
                style={{
                  padding: "9px 18px", fontSize: 12, fontWeight: 700,
                  letterSpacing: 1.5, textTransform: "uppercase",
                  borderRadius: 8, border: "1px solid rgba(15,217,128,0.5)",
                  background: "rgba(15,217,128,0.08)", color: "#0FD980",
                  cursor: "pointer", transition: "all 0.2s ease", flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#0FD980"; e.currentTarget.style.color = "#050608"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(15,217,128,0.08)"; e.currentTarget.style.color = "#0FD980"; }}
              >
                🛒 {!isMobile && "Cart"}
              </button>

              {/* Sign out */}
              <button
                type="button"
                onClick={async () => { await signOut(); navigate("/"); setMenuOpen(false); }}
                style={{
                  padding: "9px 15px", fontSize: 12, fontWeight: 700,
                  letterSpacing: 1.5, textTransform: "uppercase",
                  borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent", color: "rgba(255,255,255,0.35)",
                  cursor: "pointer", transition: "all 0.2s ease", flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,100,100,0.4)"; e.currentTarget.style.color = "#FF6B6B"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
              >
                {isMobile ? "OUT" : "Sign Out"}
              </button>

            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAuth(true)}
              style={{
                padding: isMobile ? "9px 18px" : "9px 22px",
                fontSize: isMobile ? 12 : 13, fontWeight: 700,
                letterSpacing: 2, textTransform: "uppercase",
                borderRadius: 8, border: "1px solid rgba(15,217,128,0.9)",
                background: "#0FD980", color: "#050608", cursor: "pointer",
                boxShadow: "0 4px 16px rgba(15,217,128,0.3)", transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1BF08E"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,217,128,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#0FD980"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,217,128,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {isMobile ? "LOGIN" : "Log In"}
            </button>
          )}
          

          {isMobile && (
            <button onClick={() => setMenuOpen(true)} style={{ display: "flex", flexDirection: "column", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 6 }}>
              {[0,1,2].map(i => <span key={i} style={{ width: 20, height: 2, background: "#0FD980", borderRadius: 2 }} />)}
            </button>
          )}
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />}

      {/* ── Mobile Drawer ── */}
      <>
        <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 9998, opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none", transition: "opacity 0.3s ease" }} />

        <div style={{
          position: "fixed", top: 0, left: 0, bottom: 0, width: 280,
          background: "#050608", borderRight: "1px solid rgba(15,217,128,0.25)",
          boxShadow: menuOpen ? "4px 0 32px rgba(0,0,0,0.6)" : "none",
          zIndex: 9999, transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex", flexDirection: "column", overflowY: "auto",
        }}>
          <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, letterSpacing: 4, color: "#0FD980", textTransform: "uppercase", fontWeight: 700 }}>TECH KΛGE</span>
            <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 18, lineHeight: 1, padding: 4, transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#0FD980"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
            >✕</button>
          </div>

          {/* Profile card in drawer */}
          {user && (
            <button
              onClick={() => { navigate(`/profile/${user.id}`); setMenuOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                margin: "12px 12px 0", padding: "12px 14px", borderRadius: 8,
                border: "1px solid rgba(15,217,128,0.2)", background: "rgba(15,217,128,0.05)",
                cursor: "pointer", transition: "all 0.15s",
              }}
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

          <div style={{ padding: "12px 12px 16px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            {navItems.filter(item => item.path).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button key={item.label} onClick={() => { navigate(item.path); setMenuOpen(false); }}
                  style={{ width: "100%", textAlign: "left", padding: "12px 14px", fontSize: 11, borderRadius: 8, border: `1px solid ${isActive ? "rgba(15,217,128,0.5)" : "transparent"}`, background: isActive ? "rgba(15,217,128,0.08)" : "transparent", color: isActive ? "#0FD980" : "#E5FDF3", letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", fontWeight: isActive ? 700 : 400, transition: "all 0.15s" }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "rgba(15,217,128,0.06)"; e.currentTarget.style.color = "#0FD980"; e.currentTarget.style.borderColor = "rgba(15,217,128,0.2)"; }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#E5FDF3"; e.currentTarget.style.borderColor = "transparent"; }}}
                >
                  {item.label}
                </button>
              );
            })}

            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,0.25)", marginBottom: 8, paddingLeft: 14, textTransform: "uppercase" }}>Products</div>
              {productDropdownItems.map((d) => (
                <button key={d.label} onClick={() => { navigate(d.path); setMenuOpen(false); }}
                  style={{ width: "100%", textAlign: "left", padding: "10px 14px 10px 24px", fontSize: 10, borderRadius: 8, border: "1px solid transparent", background: "transparent", color: "rgba(229,253,243,0.55)", letterSpacing: 1.5, textTransform: "uppercase", cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(15,217,128,0.06)"; e.currentTarget.style.color = "#0FD980"; e.currentTarget.style.borderColor = "rgba(15,217,128,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(229,253,243,0.55)"; e.currentTarget.style.borderColor = "transparent"; }}
                >
                  ↳ {d.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={() => { navigate("/builder"); setMenuOpen(false); }}
              style={{ width: "100%", padding: "12px", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", borderRadius: 8, border: "1px solid rgba(15,217,128,0.9)", background: "#0FD980", color: "#050608", cursor: "pointer", boxShadow: "0 4px 16px rgba(15,217,128,0.25)", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#1BF08E"}
              onMouseLeave={e => e.currentTarget.style.background = "#0FD980"}
            >
              Start Building →
            </button>

            <button onClick={() => { navigate("/cart"); setMenuOpen(false); }}
              style={{width: "100%", padding: "12px", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", borderRadius: 8, border: "1px solid rgba(15,217,128,0.9)", background: "#0FD980", color: "#050608", cursor: "pointer", boxShadow: "0 4px 16px rgba(15,217,128,0.25)", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#1BF08E"}
              onMouseLeave={e => e.currentTarget.style.background = "#0FD980"}
            >
              View Cart →
            </button>

            {user && (
              <button onClick={() => {  signOut(); navigate("/"); setMenuOpen(false); } }
                style={{ width: "100%", padding: "10px", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", borderRadius: 8, border: "1px solid rgba(255,100,100,0.2)", background: "transparent", color: "rgba(255,100,100,0.6)", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,100,100,0.08)"; e.currentTarget.style.color = "#FF6B6B"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,100,100,0.6)"; }}
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
    </header>
  );
}

export default Header;