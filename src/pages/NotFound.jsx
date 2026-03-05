import { useNavigate } from 'react-router-dom';

const T = {
    bg: "#050608",
    card: "#0A0C10",
    green: "#0FD980",
    greenFaint: "rgba(15,217,128,0.10)",
    border: "rgba(255,255,255,0.10)",
    text: "rgba(255,255,255,0.92)",
    textMid: "rgba(255,255,255,0.60)",
    textDim: "rgba(255,255,255,0.38)",
    display: "'Orbitron', sans-serif",
    mono: "'JetBrains Mono', monospace",
};

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            background: T.bg,
            backgroundImage: `
                radial-gradient(ellipse at 20% 30%, rgba(15,217,128,0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, rgba(15,217,128,0.05) 0%, transparent 50%)
            `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: 'sans-serif',
        }}>
            <div style={{
                textAlign: 'center',
                maxWidth: 600,
            }}>
                {/* 404 Number */}
                <div style={{
                    fontSize: 120,
                    fontWeight: 900,
                    fontFamily: T.display,
                    background: `linear-gradient(135deg, ${T.green} 0%, #0AA868 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: 20,
                    lineHeight: 1,
                }}>
                    404
                </div>

                {/* Error Message */}
                <h1 style={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: T.text,
                    margin: '0 0 16px 0',
                    fontFamily: T.display,
                }}>
                    Page Not Found
                </h1>

                <p style={{
                    fontSize: 16,
                    color: T.textMid,
                    lineHeight: 1.7,
                    marginBottom: 40,
                }}>
                    The page you're looking for doesn't exist or has been moved.
                    <br />
                    Maybe you mistyped the URL? Or maybe we broke something...
                </p>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    gap: 16,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '14px 32px',
                            background: T.green,
                            color: '#050608',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: 2,
                            cursor: 'pointer',
                            fontFamily: T.mono,
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 20px rgba(15,217,128,0.3)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#1BF08E';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = T.green;
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        GO HOME →
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            padding: '14px 32px',
                            background: T.card,
                            color: T.text,
                            border: `1px solid ${T.border}`,
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: 2,
                            cursor: 'pointer',
                            fontFamily: T.mono,
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = T.green;
                            e.currentTarget.style.background = T.greenFaint;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = T.border;
                            e.currentTarget.style.background = T.card;
                        }}
                    >
                        ← GO BACK
                    </button>
                </div>

                {/* Fun Error Code */}
                <div style={{
                    marginTop: 60,
                    padding: '16px 24px',
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    fontFamily: T.mono,
                    fontSize: 11,
                    color: T.textDim,
                }}>
                    <div style={{ marginBottom: 4 }}>
                        <span style={{ color: T.green }}>ERROR_CODE:</span> PAGE_NOT_FOUND
                    </div>
                    <div>
                        <span style={{ color: T.green }}>STATUS:</span> 404
                    </div>
                </div>
            </div>
        </div>
    );
}
