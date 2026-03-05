import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import TechKageLogo from '../assets/TechKage.svg';


// ••••••••
const T = {
    bg: "#050608",
    card: "#0A0C10",
    green: "#0FD980",
    greenFaint: "rgba(15,217,128,0.10)",
    border: "rgba(255,255,255,0.10)",
    borderHover: "rgba(255,255,255,0.15)",
    text: "rgba(255,255,255,0.92)",
    textMid: "rgba(255,255,255,0.60)",
    textDim: "rgba(255,255,255,0.38)",
    display: "'Orbitron', sans-serif",
    mono: "'JetBrains Mono', monospace",
};

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If already logged in as admin, redirect to dashboard
        if (user?.email === 'devanlee2nd@gmail.com') {
            navigate('/admin');
        }
    }, [user, navigate]);


    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Edge case: Special email that always shows "can't login" message
            // This happens BEFORE we even try to authenticate with Supabase
            if (email === 'devvdevvdevv@techkage.com') {
                // We don't even check the password - just show the message
                throw new Error("HAH! Dumbass cunt, you seriously think it'd be THAT easy to get in? If you do manage do get in, I left my Supabase api keys exposed in the admin panel - good luck trying to get them!!");
            }

            // Normal authentication flow for other emails
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;

            // Check if the logged-in user is admin
            if (data.user?.email !== 'devanlee2nd@gmail.com') {
                await supabase.auth.signOut();
                throw new Error('Access denied. Admin credentials required.');
            }

            // Redirect to admin dashboard
            navigate('/admin');
        } catch (err) {
            console.error('Admin login error:', err);
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

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
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: '48px 40px',
                maxWidth: 440,
                width: '100%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <div style={{ marginBottom: 20 }}>
                        <img
                            src={TechKageLogo}
                            alt="Tech Kage Logo"
                            style={{
                                width: 75,
                                height: 'auto',
                                filter: 'brightness(1.1)',
                                display: 'block',
                                margin: '0 auto',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        />
                    </div>
                    <div style={{
                        fontSize: 10,
                        letterSpacing: 4,
                        color: T.green,
                        marginBottom: 12,
                        fontWeight: 600,
                    }}>
                        TECH KAGE
                    </div>
                    <h1 style={{
                        fontSize: 28,
                        fontWeight: 900,
                        color: T.text,
                        margin: 0,
                        fontFamily: T.display,
                    }}>
                        Admin Access
                    </h1>
                    <p style={{
                        fontSize: 13,
                        color: T.textMid,
                        marginTop: 8,
                    }}>
                        If you're not supposed to be here, please go away.

                    </p>
                    <p
                        style={{
                            fontSize: 12,
                            color: 'red',
                            fontWeight: 700,
                            marginTop: 8,
                        }}
                    >
                        Redteamers not welcome. You won't able to SQL inject here. Clown.
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Email Input */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: 11,
                            letterSpacing: 1.5,
                            color: T.textDim,
                            marginBottom: 8,
                            fontWeight: 600,
                        }}>
                            EMAIL
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="devvdevvdevv@techkage.com"
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: T.bg,
                                border: `1px solid ${T.border}`,
                                borderRadius: 8,
                                color: T.text,
                                fontSize: 14,
                                fontFamily: T.mono,
                                outline: 'none',
                                transition: 'all 0.2s',
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = T.green}
                            onBlur={(e) => e.currentTarget.style.borderColor = T.border}
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: 11,
                            letterSpacing: 1.5,
                            color: T.textDim,
                            marginBottom: 8,
                            fontWeight: 600,
                        }}>
                            PASSWORD
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password1234"
                            // ••••••••
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: T.bg,
                                border: `1px solid ${T.border}`,
                                borderRadius: 8,
                                color: T.text,
                                fontSize: 14,
                                fontFamily: T.mono,
                                outline: 'none',
                                transition: 'all 0.2s',
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = T.green}
                            onBlur={(e) => e.currentTarget.style.borderColor = T.border}
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            padding: '12px 16px',
                            background: 'rgba(255,85,85,0.1)',
                            border: '1px solid rgba(255,85,85,0.3)',
                            borderRadius: 8,
                            fontSize: 13,
                            color: '#ff5555',
                            fontFamily: T.mono,
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: loading ? T.border : T.green,
                            color: loading ? T.textDim : '#050608',
                            border: 'none',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: 2.5,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: T.mono,
                            boxShadow: loading ? 'none' : '0 4px 20px rgba(15,217,128,0.3)',
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.currentTarget.style.background = '#1BF08E';
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) e.currentTarget.style.background = T.green;
                        }}
                    >
                        {loading ? 'AUTHENTICATING...' : 'SIGN IN →'}
                    </button>
                </form>

                {/* Footer */}
                <div style={{
                    marginTop: 32,
                    paddingTop: 24,
                    borderTop: `1px solid ${T.border}`,
                    textAlign: 'center',
                }}>
                    <p style={{
                        fontSize: 11,
                        color: T.textDim,
                        margin: 0,
                        fontFamily: T.mono,
                    }}>
                        🔒 Authorized personnel only
                    </p>
                </div>
            </div>
        </div>
    );
}
