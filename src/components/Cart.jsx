import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const T = {
  bg:          "#050608",
  card:        "#0A0C10",
  green:       "#0FD980",
  border:      "rgba(255,255,255,0.08)",
  borderGreen: "rgba(15,217,128,0.25)",
  text:        "#f5f5f5",
  textMid:     "rgba(255,255,255,0.45)",
  textDim:     "rgba(255,255,255,0.2)",
  mono:        "'JetBrains Mono', monospace",
  display:     "'Orbitron', sans-serif",
};

const PART_ORDER = ["CPU", "GPU", "MOTHERBOARD", "RAM", "STORAGE", "PSU", "CASE", "COOLING"];

// ─── PART LINE ───────────────────────────────────────────────────
function PartLine({ category, part }) {
  const price = parseFloat(
    String(part?.price ?? part?.priceNumeric ?? 0).replace(/[^0-9.]/g, "")
  ) || 0;

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "11px 0", borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <span style={{ fontSize: 8, letterSpacing: 2, fontFamily: T.mono, color: T.textDim, minWidth: 90, textTransform: "uppercase" }}>
          {category}
        </span>
        <span style={{ fontSize: 13, color: T.text, fontFamily: T.mono }}>
          {part?.name || "—"}
        </span>
      </div>
      <span style={{ fontSize: 13, color: T.green, fontFamily: T.mono, fontWeight: 700 }}>
        ${price.toFixed(2)}
      </span>
    </div>
  );
}

// ─── EMPTY CART ──────────────────────────────────────────────────
function EmptyCart({ navigate }) {
  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 20, fontFamily: T.mono,
    }}>
      <div style={{ fontSize: 48 }}>🛒</div>
      <div style={{ fontSize: 16, color: T.text, fontWeight: 700, fontFamily: T.display }}>Your cart is empty</div>
      <div style={{ fontSize: 13, color: T.textMid }}>Generate a build first, then add it to your cart.</div>
      <button
        onClick={() => navigate("/builder")}
        style={{ marginTop: 8, padding: "11px 28px", fontSize: 11, letterSpacing: 2, fontWeight: 700, textTransform: "uppercase", borderRadius: 8, border: `1px solid ${T.green}`, background: T.green, color: "#050608", cursor: "pointer", fontFamily: T.mono }}
      >
        Build a PC →
      </button>
    </div>
  );
}

// ─── AUTH MODAL ──────────────────────────────────────────────────
function DeniedModal({ onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
  const handleClose = () => { setVisible(false); setTimeout(onClose, 250); };

  return (
    <>
      <div onClick={handleClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", zIndex: 9998, opacity: visible ? 1 : 0, transition: "opacity 0.25s ease" }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 12, padding: "32px 28px", maxWidth: 380, width: "90%",
        zIndex: 9999, fontFamily: T.mono, opacity: visible ? 1 : 0,
        transform: visible ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -48%) scale(0.96)",
        transition: "opacity 0.25s ease, transform 0.25s ease", textAlign: "center",
      }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>🔒</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>Account Required</div>
        <div style={{ fontSize: 13, color: T.textMid, marginBottom: 24, lineHeight: 1.6 }}>You need to be logged in to checkout.</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button onClick={handleClose} style={{ padding: "10px 20px", fontSize: 11, letterSpacing: 2, fontWeight: 600, cursor: "pointer", borderRadius: 8, border: `1px solid ${T.border}`, color: T.textMid, background: "transparent", fontFamily: T.mono }}>CANCEL</button>
          <button onClick={() => { handleClose(); window.dispatchEvent(new CustomEvent('open-auth-modal')); }} style={{ padding: "10px 20px", fontSize: 11, letterSpacing: 2, fontWeight: 700, cursor: "pointer", borderRadius: 8, background: T.green, color: "#050608", border: "none", fontFamily: T.mono }}>LOG IN →</button>
        </div>
      </div>
    </>
  );
}

// ─── RECENTLY VIEWED ─────────────────────────────────────────────
// Only renders when history has more than 1 build.
// Clicking a card sets it as the active build shown in the summary above.
// Clicking the active card again deselects it (back to latest).
function RecentlyViewed({ history, activeBuildId, onSelect }) {
  if (!history || history.length <= 1) return null;

  return (
    <div style={{
      background: T.card, borderRadius: 14,
      border: `1px solid ${T.border}`, overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 24px", borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 9, letterSpacing: 3, color: T.textDim, fontFamily: T.mono, textTransform: "uppercase" }}>
            Recently Viewed
          </span>
          <span style={{
            fontSize: 9, padding: "2px 8px", borderRadius: 20,
            background: "rgba(15,217,128,0.08)", border: "1px solid rgba(15,217,128,0.15)",
            color: T.green, fontFamily: T.mono, letterSpacing: 1,
          }}>
            {history.length}
          </span>
        </div>
        <span style={{ fontSize: 10, color: T.textDim, fontFamily: T.mono, letterSpacing: 1 }}>
          LAST {history.length} BUILDS
        </span>
      </div>

      {/* Cards */}
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {[...history].reverse().map((build) => {
          const isActive = activeBuildId === build.id;
          const parts = build.build ? Object.keys(build.build).length : 0;
          const date = new Date(build.addedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

          return (
            <div
              key={build.addedAt}
              onClick={() => onSelect(build.addedAt)}
              style={{
                padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                border: `1px solid ${isActive ? "rgba(15,217,128,0.35)" : T.border}`,
                background: isActive ? "rgba(15,217,128,0.05)" : "rgba(255,255,255,0.01)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 12, transition: "all 0.18s ease",
                position: "relative", overflow: "hidden",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.background = "rgba(255,255,255,0.01)";
                }
              }}
            >
              {/* Active green side bar */}
              {isActive && (
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
                  background: T.green, borderRadius: "10px 0 0 10px",
                }} />
              )}

              <div style={{ flex: 1, minWidth: 0, paddingLeft: isActive ? 8 : 0, transition: "padding 0.18s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: T.mono }}>
                    {build.name || "Custom Build"}
                  </span>
                  {isActive && (
                    <span style={{
                      fontSize: 8, letterSpacing: 2, padding: "2px 7px", borderRadius: 3,
                      background: "rgba(15,217,128,0.12)", border: "1px solid rgba(15,217,128,0.25)",
                      color: T.green, fontFamily: T.mono, flexShrink: 0,
                    }}>
                      VIEWING
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: T.green, fontFamily: T.mono, fontWeight: 700 }}>${build.price?.toLocaleString() || "—"}</span>
                  <span style={{ fontSize: 9, color: T.textDim, fontFamily: T.mono }}>·</span>
                  <span style={{ fontSize: 10, color: T.textDim, fontFamily: T.mono }}>{parts} parts</span>
                  <span style={{ fontSize: 9, color: T.textDim, fontFamily: T.mono }}>·</span>
                  <span style={{ fontSize: 10, color: T.textDim, fontFamily: T.mono }}>{date}</span>
                </div>
              </div>

              <div style={{ fontSize: 14, color: isActive ? T.green : T.textDim, transition: "all 0.18s", flexShrink: 0 }}>
                {isActive ? "◈" : "→"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div style={{
        padding: "10px 24px", borderTop: `1px solid ${T.border}`,
        fontSize: 10, color: T.textDim, fontFamily: T.mono,
        letterSpacing: 0.5, textAlign: "center",
      }}>
        Click any build to preview it above
      </div>
    </div>
  );
}

// ─── MAIN CART PAGE ──────────────────────────────────────────────
export default function Cart() {
  const { items, history, clearCart, clearHistory } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [checkoutStatus, setCheckoutStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [authModal, setAuthModal] = useState(false);

  // null = show latest cart item
  // string (addedAt) = show that specific history build
  const [activeBuildId, setActiveBuildId] = useState(null);

  if (!items || items.length === 0) return <EmptyCart navigate={navigate} />;

  // ── Single source of truth for which build is displayed ───────
  const buildItem = activeBuildId
    ? history.find(b => b.addedAt === activeBuildId)
    : [...items].reverse().find(i => i.type === "custom_build" && i.build);

  if (!buildItem) return <EmptyCart navigate={navigate} />;

  const buildEntries = PART_ORDER
    .filter(cat => buildItem.build?.[cat])
    .map(cat => ({ category: cat, part: buildItem.build[cat] }));

  const partsTotal = buildEntries.reduce((sum, { part }) => {
    return sum + (parseFloat(String(part?.price ?? 0).replace(/[^0-9.]/g, "")) || 0);
  }, 0);

  const LABOUR_FEE = 150;
  const orderTotal = partsTotal + LABOUR_FEE;

  const handleCheckout = async () => {
    if (!user) { setAuthModal(true); return; }
    setCheckoutStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:3001/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buildName:  buildItem.name,
          totalPrice: orderTotal,
          userId:     user.id,
          buildData:  buildItem.build,
          config:     buildItem.config,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Failed to create checkout session");
      window.location.href = data.url;

    } catch (err) {
      setCheckoutStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=JetBrains+Mono:wght@300;400;500&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.bg, padding: "3rem 1.5rem", color: T.text, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "40%", height: "40%", borderRadius: "50%", background: "radial-gradient(circle, rgba(15,217,128,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 680, margin: "0 auto", animation: "fadeUp 0.5s ease-out" }}>

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: T.green, fontFamily: T.mono, marginBottom: 8, textTransform: "uppercase" }}>Review Order</div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, fontFamily: T.display, margin: 0, letterSpacing: -0.5 }}>Your Cart</h1>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* ── Build summary card ── */}
            <div style={{ background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
              <div style={{ height: 3, background: "linear-gradient(90deg, #0FD980, rgba(15,217,128,0.2), transparent)" }} />
              <div style={{ padding: "24px 28px" }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, fontFamily: T.display, marginBottom: 4 }}>{buildItem.name}</div>
                    <div style={{ fontSize: 10, color: T.textDim, fontFamily: T.mono, letterSpacing: 1 }}>
                      Added {new Date(buildItem.addedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {/* Show "← LATEST" only when previewing a history build */}
                    {activeBuildId && (
                      <button
                        onClick={() => setActiveBuildId(null)}
                        style={{
                          fontSize: 10, letterSpacing: 1.5, color: T.green,
                          background: "transparent", border: "1px solid rgba(15,217,128,0.25)",
                          borderRadius: 6, padding: "5px 10px", cursor: "pointer",
                          fontFamily: T.mono, transition: "all 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(15,217,128,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        ← LATEST
                      </button>
                    )}
                    <button
                      onClick={clearCart}
                      style={{
                        fontSize: 10, letterSpacing: 1.5, color: "rgba(255,100,100,0.5)",
                        background: "transparent", border: "1px solid rgba(255,100,100,0.15)",
                        borderRadius: 6, padding: "5px 10px", cursor: "pointer",
                        fontFamily: T.mono, transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = "#FF6B6B"; e.currentTarget.style.borderColor = "rgba(255,100,100,0.4)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,100,100,0.5)"; e.currentTarget.style.borderColor = "rgba(255,100,100,0.15)"; }}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>

                <div>
                  {buildEntries.map(({ category, part }) => (
                    <PartLine key={category} category={category} part={part} />
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 16, borderTop: `1px solid rgba(15,217,128,0.2)` }}>
                  <span style={{ fontSize: 10, letterSpacing: 2, color: T.textMid, fontFamily: T.mono, textTransform: "uppercase" }}>Parts Subtotal</span>
                  <span style={{ fontSize: 20, fontWeight: 900, color: T.text, fontFamily: T.display }}>${partsTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* ── Recently Viewed ── */}
            <RecentlyViewed
              history={history}
              activeBuildId={activeBuildId}
              onSelect={(addedAt) => setActiveBuildId(prev => prev === addedAt ? null : addedAt)}
            />

            {/* ── Order summary ── */}
            <div style={{ background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, padding: "24px 28px" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: T.textMid, fontFamily: T.mono, marginBottom: 16, textTransform: "uppercase" }}>Order Summary</div>

              {[
                { label: "Parts",      value: `$${partsTotal.toFixed(2)}` },
                { label: "Labour Fee", value: `$${LABOUR_FEE.toFixed(2)}` },
                { label: "Shipping",   value: "TBD" },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: T.textMid, fontFamily: T.mono }}>{row.label}</span>
                  <span style={{ color: T.text, fontFamily: T.mono }}>{row.value}</span>
                </div>
              ))}

              <div style={{ height: 1, background: T.border, margin: "16px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, letterSpacing: 2, color: T.textMid, fontFamily: T.mono, textTransform: "uppercase" }}>Total</span>
                <span style={{ fontSize: 26, fontWeight: 900, color: T.green, fontFamily: T.display }}>${orderTotal.toFixed(2)}</span>
              </div>

              {checkoutStatus === "error" && (
                <div style={{ marginTop: 14, fontSize: 12, color: "#FF6B6B", fontFamily: T.mono, lineHeight: 1.6 }}>⚠ {errorMsg}</div>
              )}

              <button
                onClick={handleCheckout}
                disabled={checkoutStatus === "loading"}
                style={{
                  marginTop: 20, width: "100%", padding: "14px",
                  fontSize: 12, fontWeight: 700, letterSpacing: 2.5,
                  textTransform: "uppercase", borderRadius: 8,
                  border: `1px solid ${T.green}`,
                  background: checkoutStatus === "loading" ? "transparent" : T.green,
                  color: checkoutStatus === "loading" ? T.green : "#050608",
                  cursor: checkoutStatus === "loading" ? "not-allowed" : "pointer",
                  fontFamily: T.mono, transition: "all 0.2s",
                  boxShadow: checkoutStatus === "loading" ? "none" : "0 4px 20px rgba(15,217,128,0.3)",
                }}
                onMouseEnter={e => { if (checkoutStatus !== "loading") e.currentTarget.style.background = "#1BF08E"; }}
                onMouseLeave={e => { if (checkoutStatus !== "loading") e.currentTarget.style.background = T.green; }}
              >
                {checkoutStatus === "loading" ? "Redirecting to Stripe..." : "Checkout with Stripe →"}
              </button>

              <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
                {["🔒 Secure Payment", "⚡ Powered by Stripe", "↩ Cancel Anytime"].map(badge => (
                  <span key={badge} style={{ fontSize: 10, color: T.textDim, fontFamily: T.mono }}>{badge}</span>
                ))}
              </div>
            </div>

            <button
              onClick={() => navigate("/builder")}
              style={{ background: "transparent", border: "none", color: T.textDim, fontSize: 11, letterSpacing: 2, fontFamily: T.mono, cursor: "pointer", textTransform: "uppercase", textAlign: "center", padding: "8px" }}
              onMouseEnter={e => e.currentTarget.style.color = T.text}
              onMouseLeave={e => e.currentTarget.style.color = T.textDim}
            >
              ← Back to Builder
            </button>

          </div>

          {authModal && <DeniedModal onClose={() => setAuthModal(false)} />}

        </div>
      </div>
    </>
  );
}