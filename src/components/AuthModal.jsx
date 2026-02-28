import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const T = {
  bg: "#050608",
  green: "#0FD980",
  border: "rgba(15,217,128,0.25)",
  text: "#f5f5f5",
  textMid: "rgba(255,255,255,0.5)",
  font: "'JetBrains Mono', monospace",
};

export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);
  const [visible, setVisible] = useState(false);

  const { signIn, signUp } = useAuth();

  // Trigger entrance animation after mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250); // wait for fade-out to finish
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else { onSuccess?.(); handleClose(); }
    } else {
      const { error } = await signUp(email, password);
      if (error) setError(error.message);
      else setConfirmSent(true);
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(4px)",
          zIndex: 9998,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      />

     

      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        background: T.bg, border: `1px solid ${T.border}`,
        borderRadius: 12, padding: "32px 28px",
        maxWidth: 380, width: "90%",
        zIndex: 9999, fontFamily: T.font,
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -48%) scale(0.96)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}>

        {confirmSent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 16 }}>📬</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 8 }}>
              Check your email
            </div>
            <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.7 }}>
              We sent a confirmation link to <span style={{ color: T.green }}>{email}</span>.
              Click it to activate your account.
            </div>
            <button onClick={handleClose} style={{
              marginTop: 24, padding: "10px 24px", fontSize: 11,
              borderRadius: 8, border: `1px solid ${T.border}`,
              background: "transparent", color: T.textMid,
              cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
            }}>
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Tab toggle */}
            <div style={{ display: "flex", marginBottom: 28, borderBottom: `1px solid ${T.border}` }}>
              {['login', 'signup'].map(m => (
                <button key={m} onClick={() => { setMode(m); setError(null); }}
                  style={{
                    flex: 1, padding: "10px", fontSize: 11, letterSpacing: 2,
                    textTransform: "uppercase", border: "none", background: "transparent",
                    color: mode === m ? T.green : T.textMid,
                    borderBottom: mode === m ? `2px solid ${T.green}` : "2px solid transparent",
                    cursor: "pointer", transition: "all 0.15s", marginBottom: -1,
                  }}
                >
                  {m === 'login' ? 'Log In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {/* Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {['email', 'password'].map(field => (
                <div key={field}>
                  <div style={{ fontSize: 9, letterSpacing: 2, color: T.textMid, marginBottom: 6, textTransform: "uppercase" }}>
                    {field}
                  </div>
                  <input
                    type={field}
                    value={field === 'email' ? email : password}
                    onChange={e => field === 'email' ? setEmail(e.target.value) : setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    style={{
                      width: "100%", padding: "10px 12px", fontSize: 13,
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${T.border}`, borderRadius: 8,
                      color: T.text, outline: "none", fontFamily: T.font,
                      caretColor: T.green, boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginTop: 12, fontSize: 11, color: "#FF6B6B", letterSpacing: 0.5 }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading}
              style={{
                marginTop: 20, width: "100%", padding: "12px",
                fontSize: 12, fontWeight: 700, letterSpacing: 2,
                textTransform: "uppercase", borderRadius: 8,
                border: `1px solid ${T.green}`,
                background: loading ? "transparent" : T.green,
                color: loading ? T.green : "#050608",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s", fontFamily: T.font,
              }}
            >
              {loading ? "..." : mode === 'login' ? 'Log In →' : 'Create Account →'}
            </button>
          </>
        )}
      </div>
    </>
  );
}