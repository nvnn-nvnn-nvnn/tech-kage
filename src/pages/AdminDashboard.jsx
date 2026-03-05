import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

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

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        totalUsers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin
        if (!user || user.email !== 'devanlee2nd@gmail.com') {
            navigate('/');
            return;
        }

        fetchStats();
    }, [user, navigate]);

    const fetchStats = async () => {
        try {
            // Fetch orders
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('*');

            if (ordersError) throw ordersError;

            // Fetch users count
            const { count: usersCount, error: usersError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (usersError) throw usersError;

            // Calculate stats
            const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;
            const pendingOrders = orders?.filter(o => o.status === 'pending' || o.status === 'paid').length || 0;

            setStats({
                totalOrders: orders?.length || 0,
                totalRevenue: totalRevenue,
                pendingOrders: pendingOrders,
                totalUsers: usersCount || 0,
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ 
                background: T.bg, 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: T.text 
            }}>
                Loading admin dashboard...
            </div>
        );
    }

    return (
        <div style={{ 
            background: T.bg, 
            minHeight: '100vh', 
            padding: '40px 24px',
            fontFamily: 'sans-serif' 
        }}>
            {/* Header */}
            <div style={{ maxWidth: 1200, margin: '0 auto', marginBottom: 40 }}>
                <div style={{ 
                    fontSize: 10, 
                    letterSpacing: 4, 
                    color: T.green, 
                    marginBottom: 8,
                    fontWeight: 600 
                }}>
                    ADMIN DASHBOARD
                </div>
                <h1 style={{ 
                    color: T.text, 
                    fontSize: 36, 
                    fontWeight: 900, 
                    margin: 0,
                    fontFamily: T.display 
                }}>
                    Tech Kage Control Panel
                </h1>
                <p style={{ color: T.textMid, marginTop: 8, fontSize: 14 }}>
                    Welcome back, {user?.email}
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{ 
                maxWidth: 1200, 
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 20,
                marginBottom: 40
            }}>
                {/* Total Orders */}
                <div style={{
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: 24,
                    transition: 'all 0.2s',
                }}>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: T.textDim, marginBottom: 8 }}>
                        TOTAL ORDERS
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: T.text, marginBottom: 4 }}>
                        {stats.totalOrders}
                    </div>
                    <div style={{ fontSize: 12, color: T.textMid }}>
                        All time orders
                    </div>
                </div>

                {/* Total Revenue */}
                <div style={{
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: 24,
                    transition: 'all 0.2s',
                }}>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: T.textDim, marginBottom: 8 }}>
                        TOTAL REVENUE
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: T.green, marginBottom: 4 }}>
                        ${stats.totalRevenue.toFixed(2)}
                    </div>
                    <div style={{ fontSize: 12, color: T.textMid }}>
                        Lifetime earnings
                    </div>
                </div>

                {/* Pending Orders */}
                <div style={{
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: 24,
                    transition: 'all 0.2s',
                }}>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: T.textDim, marginBottom: 8 }}>
                        PENDING ORDERS
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#ffaa44', marginBottom: 4 }}>
                        {stats.pendingOrders}
                    </div>
                    <div style={{ fontSize: 12, color: T.textMid }}>
                        Needs attention
                    </div>
                </div>

                {/* Total Users */}
                <div style={{
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: 24,
                    transition: 'all 0.2s',
                }}>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: T.textDim, marginBottom: 8 }}>
                        TOTAL USERS
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: '#4488ff', marginBottom: 4 }}>
                        {stats.totalUsers}
                    </div>
                    <div style={{ fontSize: 12, color: T.textMid }}>
                        Registered accounts
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <h2 style={{ 
                    color: T.text, 
                    fontSize: 20, 
                    fontWeight: 700, 
                    marginBottom: 20,
                    fontFamily: T.display 
                }}>
                    Quick Actions
                </h2>
                <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 16
                }}>
                    <button
                        onClick={() => navigate('/admin/orders')}
                        style={{
                            background: T.card,
                            border: `1px solid ${T.border}`,
                            borderRadius: 10,
                            padding: '20px 24px',
                            color: T.text,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'left',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = T.green;
                            e.currentTarget.style.background = T.greenFaint;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = T.border;
                            e.currentTarget.style.background = T.card;
                        }}
                    >
                        <div style={{ fontSize: 24, marginBottom: 8 }}>📦</div>
                        <div style={{ marginBottom: 4 }}>Manage Orders</div>
                        <div style={{ fontSize: 11, color: T.textDim }}>
                            View and update order status
                        </div>
                    </button>

                    <button
                        onClick={() => window.open('https://dashboard.stripe.com', '_blank')}
                        style={{
                            background: T.card,
                            border: `1px solid ${T.border}`,
                            borderRadius: 10,
                            padding: '20px 24px',
                            color: T.text,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'left',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = T.green;
                            e.currentTarget.style.background = T.greenFaint;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = T.border;
                            e.currentTarget.style.background = T.card;
                        }}
                    >
                        <div style={{ fontSize: 24, marginBottom: 8 }}>💳</div>
                        <div style={{ marginBottom: 4 }}>Stripe Dashboard</div>
                        <div style={{ fontSize: 11, color: T.textDim }}>
                            View payments and refunds
                        </div>
                    </button>

                    <button
                        onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                        style={{
                            background: T.card,
                            border: `1px solid ${T.border}`,
                            borderRadius: 10,
                            padding: '20px 24px',
                            color: T.text,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'left',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = T.green;
                            e.currentTarget.style.background = T.greenFaint;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = T.border;
                            e.currentTarget.style.background = T.card;
                        }}
                    >
                        <div style={{ fontSize: 24, marginBottom: 8 }}>🗄️</div>
                        <div style={{ marginBottom: 4 }}>Supabase Console</div>
                        <div style={{ fontSize: 11, color: T.textDim }}>
                            Manage database and users
                        </div>
                    </button>

                    <button
                        onClick={() => window.open('https://railway.app', '_blank')}
                        style={{
                            background: T.card,
                            border: `1px solid ${T.border}`,
                            borderRadius: 10,
                            padding: '20px 24px',
                            color: T.text,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'left',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = T.green;
                            e.currentTarget.style.background = T.greenFaint;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = T.border;
                            e.currentTarget.style.background = T.card;
                        }}
                    >
                        <div style={{ fontSize: 24, marginBottom: 8 }}>🚂</div>
                        <div style={{ marginBottom: 4 }}>Railway Deployment</div>
                        <div style={{ fontSize: 11, color: T.textDim }}>
                            Monitor backend status
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
