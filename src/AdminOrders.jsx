import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';


const T = {
    bg: "#050608", green: "#0FD980", greenFaint: "rgba(15,217,128,0.10)",
    border: "rgba(255,255,255,0.10)", text: "rgba(255,255,255,0.92)",
    textMid: "rgba(255,255,255,0.60)", textDim: "rgba(255,255,255,0.38)",
};

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .then(({ data }) => { setOrders(data || []); setLoading(false); });
    }, []);

    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    const updateStatus = async (id, status) => {
        await supabase.from('orders').update({ status }).eq('id', id);
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    };

    const statusColor = (s) => ({
        paid: '#0FD980', pending: '#ffaa44', cancelled: '#ff5555', fulfilled: '#4488ff'
    }[s] || '#888');

    if (loading) return <div style={{ color: T.text, padding: 40 }}>Loading orders...</div>;

    return (
        <div style={{ background: T.bg, minHeight: '100vh', padding: '32px 24px', fontFamily: 'sans-serif' }}>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 10, letterSpacing: 4, color: T.green, marginBottom: 6 }}>ADMIN</div>
                <h1 style={{ color: T.text, fontSize: 28, fontWeight: 900, margin: 0 }}>ORDER MANAGEMENT</h1>
                <p style={{ color: T.textMid, marginTop: 6 }}>{orders.length} total orders</p>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {['all', 'paid', 'fulfilled', 'pending', 'cancelled'].map(f => (
                    <div key={f} onClick={() => setFilter(f)} style={{
                        padding: '6px 16px', cursor: 'pointer', borderRadius: 6, fontSize: 11,
                        fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
                        border: `1px solid ${filter === f ? T.green : T.border}`,
                        background: filter === f ? T.greenFaint : 'transparent',
                        color: filter === f ? T.green : T.textDim,
                    }}>{f}</div>
                ))}
            </div>

            {/* Orders list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map(order => {
                    const parts = order.build_data?.parts;
                    const isOpen = expanded === order.id;

                    return (
                        <div key={order.id} style={{
                            border: `1px solid ${isOpen ? T.green : T.border}`,
                            borderRadius: 10, background: 'rgba(255,255,255,0.02)',
                            overflow: 'hidden', transition: 'border-color 0.15s',
                        }}>
                            {/* Row summary */}
                            <div
                                onClick={() => setExpanded(isOpen ? null : order.id)}
                                style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
                            >
                                <div style={{ flex: 1, minWidth: 180 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{order.customer_name || 'Unknown'}</div>
                                    <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>{order.customer_email}</div>
                                </div>
                                <div style={{ minWidth: 140 }}>
                                    <div style={{ fontSize: 11, color: T.textDim, letterSpacing: 1 }}>BUILD</div>
                                    <div style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>{order.build_data?.build_name || '—'}</div>
                                </div>
                                <div style={{ minWidth: 80 }}>
                                    <div style={{ fontSize: 11, color: T.textDim, letterSpacing: 1 }}>TOTAL</div>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: T.green }}>${order.total_price}</div>
                                </div>
                                <div style={{ minWidth: 100 }}>
                                    <div style={{ fontSize: 11, color: T.textDim, letterSpacing: 1, marginBottom: 4 }}>STATUS</div>
                                    <select
                                        value={order.status}
                                        onClick={e => e.stopPropagation()}
                                        onChange={e => updateStatus(order.id, e.target.value)}
                                        style={{
                                            background: '#0a0c10', border: `1px solid ${statusColor(order.status)}`,
                                            color: statusColor(order.status), borderRadius: 6, padding: '4px 8px',
                                            fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: 1,
                                        }}
                                    >
                                        {['paid', 'fulfilled', 'pending', 'cancelled'].map(s => (
                                            <option key={s} value={s}>{s.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ color: T.textDim, fontSize: 11 }}>
                                    {new Date(order.created_at).toLocaleDateString()}
                                </div>
                                <div style={{ color: T.textDim }}>{isOpen ? '▲' : '▼'}</div>
                            </div>

                            {/* Expanded detail */}
                            {isOpen && (
                                <div style={{ borderTop: `1px solid ${T.border}`, padding: '20px', background: 'rgba(0,0,0,0.3)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

                                        {/* Parts list */}
                                        <div>
                                            <div style={{ fontSize: 10, letterSpacing: 3, color: T.textDim, marginBottom: 12 }}>PARTS TO ORDER</div>
                                            {parts ? Object.entries(parts).map(([cat, part]) => (
                                                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${T.border}` }}>
                                                    <div>
                                                        <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 1 }}>{cat}</div>
                                                        <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{part.name}</div>
                                                    </div>
                                                    <div style={{ fontSize: 13, color: T.green, fontWeight: 700 }}>{part.price}</div>
                                                </div>
                                            )) : <div style={{ color: T.textDim, fontSize: 13 }}>No parts data — legacy order</div>}
                                        </div>

                                        {/* Customer + shipping */}
                                        <div>
                                            <div style={{ fontSize: 10, letterSpacing: 3, color: T.textDim, marginBottom: 12 }}>CUSTOMER INFO</div>
                                            <div style={{ fontSize: 13, color: T.text, marginBottom: 4 }}>{order.customer_name}</div>
                                            <div style={{ fontSize: 13, color: T.textMid, marginBottom: 4 }}>{order.customer_email}</div>
                                            <div style={{ fontSize: 13, color: T.textMid, marginBottom: 16 }}>{order.customer_phone}</div>

                                            <div style={{ fontSize: 10, letterSpacing: 3, color: T.textDim, marginBottom: 8 }}>SHIP TO</div>
                                            {order.shipping_address ? Object.values(order.shipping_address).filter(Boolean).map((line, i) => (
                                                <div key={i} style={{ fontSize: 13, color: T.textMid }}>{line}</div>
                                            )) : <div style={{ fontSize: 13, color: T.textDim }}>No address</div>}

                                            <div style={{ marginTop: 16, fontSize: 10, letterSpacing: 3, color: T.textDim, marginBottom: 6 }}>STRIPE SESSION</div>
                                            <div style={{ fontSize: 11, color: T.textDim, wordBreak: 'break-all' }}>{order.stripe_session_id}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}