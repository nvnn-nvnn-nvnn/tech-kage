import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { supabase } from "../lib/supabase";
import { createPortal } from "react-dom";

const T = {
  bg: "#050608",
  card: "#0A0C10",
  bgHover: "rgba(255,255,255,0.05)",
  green: "#0FD980",
  blue: "#78A3FF",
  yellow: "#FFD66B",
  border: "rgba(255,255,255,0.08)",
  borderGreen: "rgba(15,217,128,0.25)",
  text: "#f5f5f5",
  textMid: "rgba(255,255,255,0.45)",
  textDim: "rgba(255,255,255,0.2)",
  mono: "'JetBrains Mono', monospace",
  display: "'Orbitron', sans-serif",
};

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=JetBrains+Mono:wght@300;400;500&display=swap');
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 8px rgba(15,217,128,0.4); }
    50%       { box-shadow: 0 0 20px rgba(15,217,128,0.8); }
  }
  .profile-card {
    opacity: 0;
    animation: fadeUp 0.5s ease-out forwards;
  }
  .profile-card:nth-child(1) { animation-delay: 0.05s; }
  .profile-card:nth-child(2) { animation-delay: 0.12s; }
  .profile-card:nth-child(3) { animation-delay: 0.19s; }
  .profile-card:nth-child(4) { animation-delay: 0.26s; }
`;

// ─────────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────────
function Avatar({ email }: { email?: string }) {
  const initials = email ? email.slice(0, 2).toUpperCase() : "??";
  return (
    <div style={{
      width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg, #0FD980, rgba(15,217,128,0.2))",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 24, fontWeight: 900, color: "#050608",
      fontFamily: T.display,
      boxShadow: "0 0 0 3px rgba(15,217,128,0.2), 0 0 24px rgba(15,217,128,0.25)",
      animation: "pulseGlow 3s ease-in-out infinite",
    }}>
      {initials}
    </div>
  );
}

// ─────────────────────────────────────────────
// StatPill
// ─────────────────────────────────────────────
function StatPill({ label, value, accent }: { label: string; value: number | string; accent?: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "14px 20px", borderRadius: 10,
      border: `1px solid ${accent}22`,
      background: `linear-gradient(135deg, ${accent}08, transparent)`,
      gap: 4, minWidth: 80,
    }}>
      <span style={{ fontSize: 20, fontWeight: 900, color: accent, fontFamily: T.display }}>
        {value}
      </span>
      <span style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: T.textMid, fontFamily: T.mono }}>
        {label}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// OrderModal
// ─────────────────────────────────────────────
const OrderModal = ({ order, onClose }: { order: any; onClose: () => void }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatAddress = (address: any) => {
    if (!address) return "No shipping address";
    return `${address.line1 || ''} ${address.line2 || ''}, ${address.city || ''}, ${address.state || ''} ${address.postal_code || ''}, ${address.country || ''}`.replace(/,\s*,/g, ',').trim();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          background: T.card, borderRadius: 14, padding: 28, maxWidth: 600, width: '92%',
          border: '1px solid rgba(255,255,255,0.08)', zIndex: 9999,
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
          maxHeight: '80vh', overflowY: 'auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: T.text, fontFamily: T.display }}>
            Order Details
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: T.textMid, cursor: 'pointer', fontSize: 20, padding: 4 }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          {/* Order ID */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: T.textMid, fontFamily: T.mono }}>Order ID</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: T.text, fontFamily: T.mono }}>{order.id}</span>
              <button
                onClick={() => copyToClipboard(order.id)}
                style={{ background: 'transparent', border: 'none', color: T.green, cursor: 'pointer', fontSize: 12 }}
              >
                📋
              </button>
            </div>
          </div>

          {/* Build Name */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: T.textMid, fontFamily: T.mono }}>Build Name</span>
            <span style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{order.build_data?.build_name || order.build_name || 'Custom Build'}</span>
          </div>

          {/* Total Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: T.textMid, fontFamily: T.mono }}>Total Price</span>
            <span style={{ fontSize: 16, color: T.green, fontWeight: 700 }}>${order.total_price}</span>
          </div>

          {/* Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: T.textMid, fontFamily: T.mono }}>Status</span>
            <span style={{
              fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
              background: order.status === "paid" ? "rgba(15,217,128,0.1)" : "rgba(255,255,255,0.05)",
              color: order.status === "paid" ? "#0FD980" : "rgba(255,255,255,0.4)",
              border: `1px solid ${order.status === "paid" ? "rgba(15,217,128,0.3)" : "rgba(255,255,255,0.1)"}`
            }}>
              {order.status?.toUpperCase() || "PENDING"}
            </span>
          </div>

          {/* Date */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: T.textMid, fontFamily: T.mono }}>Order Date</span>
            <span style={{ fontSize: 13, color: T.text }}>{new Date(order.created_at).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          {/* Stripe Session ID */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: T.textMid, fontFamily: T.mono }}>Stripe Session ID</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: T.text, fontFamily: T.mono }}>{order.stripe_session_id}</span>
              <button
                onClick={() => copyToClipboard(order.stripe_session_id)}
                style={{ background: 'transparent', border: 'none', color: T.green, cursor: 'pointer', fontSize: 12 }}
              >
                📋
              </button>
            </div>
          </div>

          {/* Customer Info */}
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.display }}>
              Customer Information
            </h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: T.textMid, fontFamily: T.mono }}>Name</span>
                <span style={{ fontSize: 13, color: T.text }}>{order.customer_name || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: T.textMid, fontFamily: T.mono }}>Email</span>
                <span style={{ fontSize: 13, color: T.text }}>{order.customer_email || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: T.textMid, fontFamily: T.mono }}>Phone</span>
                <span style={{ fontSize: 13, color: T.text }}>{order.customer_phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: T.text, fontFamily: T.display }}>
                Shipping Address
              </h3>
              <p style={{ fontSize: 13, color: T.text, lineHeight: 1.5, margin: 0 }}>
                {formatAddress(order.shipping_address)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// BuildModal
// ─────────────────────────────────────────────
const BuildModal = ({ build, onClose }: { build: any; onClose: () => void }) => {
  const totalPrice = build.total_price ??
    Object.values(build.build_data || {}).reduce((sum: number, part: any) => {
      const priceStr = String(part?.price ?? part?.priceNumeric ?? 0);
      const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
      return sum + price;
    }, 0);

  const copyToClipboard = () => {
    if (!build?.build_data) return;
    const partsText = Object.entries(build.build_data)
      .map(([category, part]: [string, any]) =>
        `${category.padEnd(14)} ${part?.name || '—'}\n${' '.repeat(14)}${part?.price || '—'}`
      ).join('\n\n');

    const text = `PC BUILD - ${build.build_name || 'CUSTOM'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${partsText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: $${totalPrice.toFixed(2)}

Created: ${new Date(build.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
`;
    navigator.clipboard.writeText(text);
    alert('Build copied to clipboard!');
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', zIndex: 9998 }} />
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)', maxWidth: 620, width: '92%',
          maxHeight: '86vh', overflow: 'hidden', zIndex: 9999,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: T.green, marginBottom: 4, fontWeight: 600 }}>BUILD DETAILS</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>{build.build_name || 'Your Build'}</div>
          </div>
          <div
            onClick={onClose}
            style={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', borderRadius: 8, border: `1px solid ${T.border}`,
              color: T.textDim, fontSize: 20, transition: 'all 0.15s', alignSelf: 'flex-start',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.bgHover; e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.textDim; }}
          >×</div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px', maxHeight: 'calc(86vh - 180px)', overflowY: 'auto' }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, color: T.textMid, marginBottom: 4 }}>Total Price</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: T.text }}>${totalPrice.toFixed(2)}</div>
          </div>
          <div style={{ marginBottom: 16, fontSize: 13, color: T.textDim }}>
            Created: {new Date(build.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
          <h3 style={{ color: T.text, margin: '20px 0 12px', fontSize: 15, letterSpacing: 0.5 }}>Build Parts</h3>
          {Object.entries(build.build_data || {}).map(([key, value]: [string, any]) => (
            <div key={key} style={{ marginBottom: 14, padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`, borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 10, letterSpacing: 1.5, color: T.textDim, fontWeight: 600, textTransform: 'uppercase' }}>
                  {key.replace(/_/g, ' ')}
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: T.green }}>{value?.price || '—'}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 4 }}>
                <a href={value?.link || "#"} target="_blank" rel="noopener noreferrer"
                  style={{ color: T.green, textDecoration: "none" }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                >
                  {value?.name || 'Unnamed part'}
                </a>
              </div>
              {value?.spec && <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.4 }}>{value.spec}</div>}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 2, marginBottom: 2 }}>TOTAL</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.text }}>${totalPrice.toFixed(2)}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={copyToClipboard} style={{ padding: '10px 20px', fontSize: 12, letterSpacing: 1, fontWeight: 600, cursor: 'pointer', borderRadius: 8, border: `1px solid ${T.border}`, color: T.text, background: T.bgHover, transition: 'all 0.15s' }}>
              📋 Copy Build
            </button>
            <button onClick={() => window.print()} style={{ padding: '10px 20px', fontSize: 12, letterSpacing: 1, fontWeight: 700, cursor: 'pointer', borderRadius: 8, background: T.green, color: '#050608', border: 'none', boxShadow: '0 4px 14px rgba(15,217,128,0.28)', transition: 'all 0.15s' }}>
              🖨️ Print
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─────────────────────────────────────────────
// DeleteAccountModal — lives at Profile level
// ─────────────────────────────────────────────
const DeleteAccountModal = ({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) => {

  const [typeDelete, setTypeDelete] = useState('');

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 9998 }} />
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: T.card, borderRadius: 14, padding: 28, maxWidth: 420, width: '92%',
          border: '1px solid rgba(255,100,100,0.25)', zIndex: 9999,
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontSize: 11, letterSpacing: 2, color: '#FF6B6B', fontFamily: T.mono, marginBottom: 10, textTransform: 'uppercase' }}>
          ⚠ Danger Zone
        </div>
        <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: T.text, fontFamily: T.display }}>
          Delete Account
        </h3>
        <p style={{ margin: '0 0 20px', color: T.textMid, fontSize: 13, lineHeight: 1.6 }}>
          Are you sure you want to delete your account? This will permanently remove all your saved builds and cannot be undone.
        </p>

        <div>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: T.textMid, fontFamily: T.mono }}>
            Type "DELETE MY ACCOUNT" to confirm:
          </label>
          <input
            type="text"
            value={typeDelete}
            onChange={(e) => setTypeDelete(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg, color: T.text, fontFamily: T.mono, fontSize: 13 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '20px 0', marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{ padding: '10px 18px', fontSize: 12, borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgHover, color: T.text, cursor: 'pointer', fontFamily: T.mono, transition: 'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = T.bgHover}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={typeDelete !== 'DELETE MY ACCOUNT'}
            style={{ padding: '10px 18px', fontSize: 12, borderRadius: 8, background: '#FF6B6B', color: '#fff', cursor: 'pointer', fontFamily: T.mono, border: 'none', fontWeight: 700, transition: 'all 0.15s', opacity: typeDelete !== 'DELETE MY ACCOUNT' ? 0.5 : 1 }}
            onMouseEnter={e => e.currentTarget.style.background = '#ff4a4a'}
            onMouseLeave={e => e.currentTarget.style.background = '#FF6B6B'}
          >
            Yes, Delete My Account
          </button>
        </div>
      </div>
    </>
  );
};


// Reset Password Modal

const ResetPasswordModal = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  if (!open) return null;

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
        <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24, maxWidth: 420, width: '90%', fontFamily: T.mono }}>
          <h3 className="price-span">Reset Password</h3>
          <p style={{ margin: 0, fontSize: 13, color: T.textMid, marginBottom: 16 }}>
            Are you sure you want to reset your password? This will send a password reset email to your registered email address.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '20px 0', marginTop: 20 }}>
            <button
              onClick={onClose}
              style={{ padding: '10px 18px', fontSize: 12, borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgHover, color: T.text, cursor: 'pointer', fontFamily: T.mono, transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = T.bgHover}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              style={{ padding: '10px 18px', fontSize: 12, borderRadius: 8, background: '#FF6B6B', color: '#fff', cursor: 'pointer', fontFamily: T.mono, border: 'none', fontWeight: 700, transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#ff4a4a'}
              onMouseLeave={e => e.currentTarget.style.background = '#FF6B6B'}
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
};




// ─────────────────────────────────────────────
// BuildCard — only handles build-level actions
// ─────────────────────────────────────────────
function BuildCard({
  build, onDelete, editingId, editingName,
  setEditingId, setEditingName, onRename,
}: {
  build: any;
  onDelete: (id: string) => void;
  editingId: string | null;
  editingName: string;
  setEditingId: (id: string | null) => void;
  setEditingName: (name: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [modalBuild, setModalBuild] = useState<any>(null);

  const date = new Date(build.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const parts = build.build_data ? Object.keys(build.build_data).length : 0;

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: T.card, borderRadius: 10,
          border: `1px solid ${hovered ? "rgba(15,217,128,0.3)" : T.border}`,
          padding: "16px 20px", transition: "all 0.2s ease",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.4)" : "none",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {editingId === build.id ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                value={editingName}
                onChange={e => setEditingName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && onRename(build.id, editingName)}
                autoFocus
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid #0FD980", borderRadius: 6, padding: "4px 10px", color: "#f5f5f5", fontSize: 13, outline: "none" }}
              />
              <span onClick={() => onRename(build.id, editingName)} style={{ color: "#0FD980", cursor: "pointer", fontSize: 12 }}>✓</span>
              <span onClick={() => setEditingId(null)} style={{ color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 12 }}>✕</span>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {build.build_name || "Untitled Build"}
              </span>
              <span onClick={() => { setEditingId(build.id); setEditingName(build.build_name); }} style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", cursor: "pointer", letterSpacing: 1 }}>
                ✎ RENAME
              </span>
            </div>
          )}
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: T.green, fontFamily: T.mono }}>${build.total_price?.toLocaleString() || "—"}</span>
            <span style={{ fontSize: 10, color: T.textMid, fontFamily: T.mono }}>{parts} parts</span>
            <span style={{ fontSize: 10, color: T.textDim, fontFamily: T.mono }}>{date}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setModalBuild(build)}
            style={{ padding: "6px 12px", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", borderRadius: 6, border: `1px solid ${T.borderGreen}`, background: "transparent", color: T.green, cursor: "pointer", fontFamily: T.mono, transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(15,217,128,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            View
          </button>
          <button
            onClick={() => onDelete(build.id)}
            style={{ padding: "6px 10px", fontSize: 10, borderRadius: 6, border: "1px solid rgba(255,100,100,0.2)", background: "transparent", color: "rgba(255,100,100,0.5)", cursor: "pointer", fontFamily: T.mono, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,100,100,0.08)"; e.currentTarget.style.color = "#FF6B6B"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,100,100,0.5)"; }}
          >✕</button>
        </div>
      </div>

      {/* Build detail modal */}
      {modalBuild && createPortal(
        <BuildModal build={modalBuild} onClose={() => setModalBuild(null)} />,
        document.body
      )}
    </>
  );
}

// ─────────────────────────────────────────────
// Profile — owns the DeleteAccountModal
// ─────────────────────────────────────────────
const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [savedBuilds, setSavedBuilds] = useState<any[]>([]);
  const [loadingBuilds, setLoadingBuilds] = useState(true);
  const [activeTab, setActiveTab] = useState("builds");
  const [orders, setOrders] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  // ← Delete account modal lives here
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  // Resend Email
  const [resendEmailModalOpen, setResendEmailModalOpen] = useState(false);

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  useEffect(() => {
    if (!user) return;
    const fetchBuilds = async () => {
      const { data, error } = await supabase
        .from("saved_builds").select("*")
        .eq("user_id", user.id).order("created_at", { ascending: false });
      if (!error) setSavedBuilds(data || []);
      setLoadingBuilds(false);
    };
    fetchBuilds();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders").select("*")
        .eq("user_id", user.id).order("created_at", { ascending: false });
      if (!error) setOrders(data || []);
    };
    fetchOrders();
  }, [user]);

  const handleRenameBuild = async (id: string, newName: string) => {
    if (!editingName.trim()) return;
    const { error } = await supabase
      .from("saved_builds").update({ build_name: newName })
      .eq("id", id).eq("user_id", user.id);
    if (!error) {
      setSavedBuilds(prev => prev.map(b => b.id === id ? { ...b, build_name: newName } : b));
      setEditingId(null);
    }
  };

  const handleDeleteBuild = async (id: string) => {
    await supabase.from("saved_builds").delete().eq("id", id);
    setSavedBuilds(prev => prev.filter(b => b.id !== id));
  };

  // Reset Password Logic:
  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: "https://techkage.com/reset-password", // your reset page URL
    });

    if (error) {
      alert("Failed to send reset email: " + error.message);
    } else {
      alert("Reset email sent! Check your inbox.");
    }
  };

  // ← Actual delete account logic lives here
  const handleDeleteAccount = async () => {
    try {
      // Delete all user data first
      await supabase.from("saved_builds").delete().eq("user_id", user.id);
      await supabase.from("orders").delete().eq("user_id", user.id);
      // Delete the auth user
      const { error } = await supabase.rpc("delete_user"); // or your preferred method
      if (error) throw error;
      await signOut();
      navigate("/");
    } catch (err) {
      console.error("Failed to delete account:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setDeleteAccountModalOpen(false);
    }
  };

  const totalSpent = savedBuilds.reduce((sum, b) => sum + (b.total_price || 0), 0);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: T.textMid, fontFamily: T.mono, fontSize: 13 }}>Not logged in.</p>
      </div>
    );
  }

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ minHeight: "100vh", background: T.bg, color: T.text, padding: "3rem 1.5rem", position: "relative", overflow: "hidden" }}>

        {/* Background glows */}
        <div style={{ position: "absolute", top: "-15%", left: "-5%", width: "45%", height: "45%", borderRadius: "50%", background: "radial-gradient(circle, rgba(15,217,128,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "35%", height: "35%", borderRadius: "50%", background: "radial-gradient(circle, rgba(120,163,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Profile header */}
          <div className="profile-card" style={{ background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
            <div style={{ height: 3, background: "linear-gradient(90deg, #0FD980, rgba(15,217,128,0.2), transparent)" }} />
            <div style={{ padding: "28px 32px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <Avatar email={user.email} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: T.textMid, fontFamily: T.mono, marginBottom: 6 }}>Tech Kage Member</div>
                <div style={{ fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 900, fontFamily: T.display, letterSpacing: -0.5, marginBottom: 4 }}>
                  {user.email?.split("@")[0]}
                </div>
                <div style={{ fontSize: 12, color: T.textMid, fontFamily: T.mono }}>{user.email}</div>
                <div style={{ fontSize: 10, color: T.textDim, fontFamily: T.mono, marginTop: 6 }}>Member since {memberSince}</div>
              </div>
              <button
                onClick={async () => { await signOut(); navigate("/"); }}
                style={{ padding: "8px 16px", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: T.textMid, cursor: "pointer", fontFamily: T.mono, transition: "all 0.2s", alignSelf: "flex-start" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,100,100,0.4)"; e.currentTarget.style.color = "#FF6B6B"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = T.textMid; }}
              >Sign Out</button>
            </div>
          </div>

          {/* Stats */}
          <div className="profile-card" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <StatPill label="Saved Builds" value={savedBuilds.length} accent={T.green} />
            <StatPill label="Total Planned" value={`$${(totalSpent / 1000).toFixed(1)}k`} accent={T.blue} />
            <StatPill label="Avg Build" value={savedBuilds.length ? `$${Math.round(totalSpent / savedBuilds.length).toLocaleString()}` : "—"} accent={T.yellow} />
          </div>

          {/* Tabs */}
          <div className="profile-card" style={{ background: T.card, borderRadius: 14, border: `1px solid ${T.border}`, overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: `1px solid ${T.border}` }}>
              {[
                { id: "builds", label: "Saved Builds" },
                { id: "orders", label: "Orders" },
                { id: "settings", label: "Settings" },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "14px 24px", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", border: "none", background: "transparent", fontFamily: T.mono, color: activeTab === tab.id ? T.green : T.textMid, borderBottom: activeTab === tab.id ? `2px solid ${T.green}` : "2px solid transparent", cursor: "pointer", transition: "all 0.15s", marginBottom: -1 }}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: "24px" }}>

              {activeTab === "builds" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {loadingBuilds ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: T.textMid, fontFamily: T.mono, fontSize: 12 }}>Loading builds...</div>
                  ) : savedBuilds.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px 0" }}>
                      <div style={{ fontSize: 36, marginBottom: 16 }}>🖥️</div>
                      <div style={{ fontSize: 14, color: T.textMid, fontFamily: T.mono, marginBottom: 8 }}>No saved builds yet</div>
                      <div style={{ fontSize: 12, color: T.textDim, fontFamily: T.mono }}>Generate a build and hit "Save Build" to see it here.</div>
                    </div>
                  ) : (
                    savedBuilds.map(build => (
                      <BuildCard key={build.id} build={build} onDelete={handleDeleteBuild}
                        editingId={editingId} editingName={editingName}
                        setEditingId={setEditingId} setEditingName={setEditingName}
                        onRename={handleRenameBuild}
                      />
                    ))
                  )}
                </div>
              )}

              {activeTab === "orders" && (
                <>
                  {orders.length === 0 ? (
                    <div style={{ color: T.textMid, fontSize: 13 }}>No orders yet.</div>
                  ) : (
                    orders.map(order => (
                      <div key={order.id} style={{ padding: "16px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{order.build_name || "Custom Build"}</span>
                          <span style={{ fontSize: 13, color: T.green, fontWeight: 700 }}>${order.total_price}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 11, color: T.textMid }}>{new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span style={{ fontSize: 10, letterSpacing: 1.5, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: order.status === "paid" ? "rgba(15,217,128,0.1)" : "rgba(255,255,255,0.05)", color: order.status === "paid" ? "#0FD980" : "rgba(255,255,255,0.4)", border: `1px solid ${order.status === "paid" ? "rgba(15,217,128,0.3)" : "rgba(255,255,255,0.1)"}` }}>
                            {order.status?.toUpperCase() || "PENDING"}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: T.textMid }}>Order ID: {order.id}</p>
                      </div>
                    ))
                  )}
                </>
              )}

              {activeTab === "settings" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Email */}
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: T.textMid, fontFamily: T.mono, marginBottom: 8 }}>Email Address</div>
                    <div style={{ padding: "10px 14px", borderRadius: 8, fontSize: 13, background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`, color: T.textMid, fontFamily: T.mono, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {user.email}
                      <span style={{ fontSize: 9, letterSpacing: 1.5, color: T.textDim, textTransform: "uppercase" }}>Verified</span>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", color: T.textMid, fontFamily: T.mono, marginBottom: 8 }}>Password</div>
                    <button
                      onClick={() => setResendEmailModalOpen(true)}
                      style={{ padding: "10px 16px", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", borderRadius: 8, border: `1px solid ${T.borderGreen}`, background: "transparent", color: T.green, cursor: "pointer", fontFamily: T.mono, transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(15,217,128,0.08)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      Send Reset Email →
                    </button>
                  </div>

                  {/* Danger zone */}
                  <div style={{ marginTop: 8, padding: "20px", borderRadius: 10, border: "1px solid rgba(255,100,100,0.15)", background: "rgba(255,100,100,0.03)" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#FF6B6B", marginBottom: 6, fontFamily: T.mono, letterSpacing: 1 }}>Danger Zone</div>
                    <div style={{ fontSize: 12, color: T.textMid, fontFamily: T.mono, marginBottom: 14, lineHeight: 1.6 }}>
                      Deleting your account is permanent and removes all saved builds.
                    </div>
                    {/* ← This now opens the modal */}
                    <button
                      onClick={() => setDeleteAccountModalOpen(true)}
                      style={{ padding: "8px 16px", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", borderRadius: 6, border: "1px solid rgba(255,100,100,0.3)", background: "transparent", color: "#FF6B6B", cursor: "pointer", fontFamily: T.mono, transition: "all 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,100,100,0.1)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ← Delete account modal rendered at Profile level via portal */}
      {deleteAccountModalOpen && createPortal(
        <DeleteAccountModal
          onClose={() => setDeleteAccountModalOpen(false)}
          onConfirm={handleDeleteAccount}
        />,
        document.body
      )}

      {resendEmailModalOpen && createPortal(
        <ResetPasswordModal
          open={resendEmailModalOpen}
          onClose={() => setResendEmailModalOpen(false)}
          onConfirm={handlePasswordReset}
        />,
        document.body
      )}
    </>
  );
};

export default Profile;