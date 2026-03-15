import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBuilder } from "../context/BuilderContext";
import { useAuth } from "../hooks/useAuth";
import { getSampleParts } from "../data/partsLoader";

const T = {
    bg: "#050608",
    card: "#0D0F14",
    cardHover: "#111318",
    green: "#0FD980",
    greenDim: "rgba(15,217,128,0.12)",
    greenGlow: "rgba(15,217,128,0.25)",
    blue: "#4dabf7",
    red: "#ff6b6b",
    border: "rgba(255,255,255,0.07)",
    borderHover: "rgba(255,255,255,0.14)",
    text: "#f0f0f2",
    textMid: "rgba(240,240,242,0.50)",
    textDim: "rgba(240,240,242,0.22)",
    mono: "'JetBrains Mono', monospace",
    display: "'Orbitron', sans-serif",
};

const initialCategories = [
    { id: "cpu", name: "CPU", icon: "" },
    { id: "cpu-cooler", name: "CPU Cooler", icon: "" },
    { id: "motherboard", name: "Motherboard", icon: "" },
    { id: "memory", name: "Memory", icon: "" },
    { id: "storage", name: "Storage", icon: "" },
    { id: "video-card", name: "Video Card", icon: "" },
    { id: "case", name: "Case", icon: "" },
    { id: "powersupply", name: "Power Supply", icon: "" },
    { id: "os", name: "Operating System", icon: "" },
    { id: "monitor", name: "Monitor", icon: "" },
    { id: "accessories", name: "Accessories", icon: "" },
];

export default function PartPicker() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { selections, removePart, total, selectedCount, saveBuild } = useBuilder();
    const [partsData, setPartsData] = useState({});
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [buildName, setBuildName] = useState("");
    const [buildDescription, setBuildDescription] = useState("");
    const [saveStatus, setSaveStatus] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        const loadParts = async () => {
            const allParts = await getSampleParts();
            setPartsData(allParts);
        };
        loadParts();
    }, []);

    const handleSaveBuild = async () => {
        if (!user) {
            setSaveStatus("Please log in to save builds");
            return;
        }
        if (!buildName.trim()) {
            setSaveStatus("Build name is required");
            return;
        }
        try {
            setSaveStatus("Saving...");
            await saveBuild(buildName, buildDescription);
            setSaveStatus("Build saved successfully!");
            setTimeout(() => {
                setShowSaveModal(false);
                setBuildName("");
                setBuildDescription("");
                setSaveStatus("");
            }, 1500);
        } catch (error) {
            setSaveStatus(error.message || "Failed to save build");
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.mono, padding: isMobile ? "1.25rem 0.75rem" : "2.5rem 1.25rem" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Orbitron:wght@600;700&display=swap');
                * { box-sizing: border-box; }
                ::-webkit-scrollbar { width: 6px; background: #080a0d; }
                ::-webkit-scrollbar-thumb { background: rgba(15,217,128,0.3); border-radius: 3px; }
            `}</style>

            <div style={{ maxWidth: isMobile ? "100%" : "75%", margin: "0 auto" }}>

                {/* ── Header ── */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", gap: "1rem" }}>
                    <div>
                        <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: T.textDim, marginBottom: "4px" }}>
                            SYSTEM CONFIGURATOR
                        </div>
                        <h1 style={{ margin: 0, fontFamily: T.display, fontSize: isMobile ? "1.1rem" : "1.6rem", color: T.green, lineHeight: 1 }}>
                            Custom PC Build
                        </h1>
                    </div>
                    <div style={{
                        background: T.greenDim,
                        border: `1px solid ${T.green}`,
                        borderRadius: "10px",
                        padding: isMobile ? "0.5rem 0.75rem" : "0.75rem 1.25rem",
                        textAlign: "right",
                        flexShrink: 0,
                    }}>
                        <div style={{ fontSize: "0.65rem", color: T.textDim, marginBottom: "2px" }}>
                            {selectedCount} / {initialCategories.length}
                        </div>
                        <div style={{ fontFamily: T.display, fontSize: isMobile ? "1rem" : "1.4rem", color: T.green }}>
                            ${total.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* ── Table — desktop ── */}
                {!isMobile && (
                    <div style={{
                        background: T.card,
                        border: `1px solid ${T.border}`,
                        borderRadius: "12px",
                        overflow: "hidden",
                    }}>
                        {/* Column headers */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "160px 1fr 90px 100px 120px 100px",
                            padding: "0.7rem 1.25rem",
                            background: "rgba(15,217,128,0.06)",
                            borderBottom: `1px solid ${T.border}`,
                            fontSize: "0.68rem",
                            letterSpacing: "0.12em",
                            color: T.textDim,
                            fontWeight: 600,
                        }}>
                            <div>COMPONENT</div>
                            <div>SELECTION</div>
                            <div style={{ textAlign: "right" }}>BASE</div>
                            <div style={{ textAlign: "right" }}>SAVINGS</div>
                            <div style={{ textAlign: "right" }}>FINAL PRICE</div>
                            <div style={{ textAlign: "right" }}>ACTION</div>
                        </div>

                        {/* Desktop rows */}
                        {initialCategories.map((cat, i) => {
                            const part = selections[cat.id];
                            const finalPrice = part ? (part.base - part.promo + part.shipping + part.tax) : null;
                            const hasParts = !!(partsData[cat.id]?.length);

                            return (
                                <div key={cat.id} style={{
                                    display: "grid",
                                    gridTemplateColumns: "160px 1fr 90px 100px 120px 100px",
                                    alignItems: "center",
                                    padding: "0.9rem 1.25rem",
                                    borderBottom: i < initialCategories.length - 1 ? `1px solid ${T.border}` : "none",
                                    background: part ? "rgba(15,217,128,0.03)" : "transparent",
                                    transition: "background 0.15s",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <span style={{ fontSize: "1rem" }}>{cat.icon}</span>
                                        <button onClick={() => navigate(`/parts/${cat.id}`)} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", fontSize: "0.82rem", color: part ? T.green : T.textMid, fontWeight: 500, fontFamily: "inherit", transition: "opacity 0.15s" }}
                                            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                                        >{cat.name}</button>
                                    </div>

                                    <div>
                                        {part ? (
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                                                {/* Product Image */}
                                                <div style={{ width: 36, height: 36, borderRadius: "6px", overflow: "hidden", background: "rgba(255,255,255,0.05)", flexShrink: 0 }}>
                                                    {part.image ? (
                                                        <img src={part.image} alt={part.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                    ) : (
                                                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: T.textDim, fontSize: "0.5rem" }}>N/A</div>
                                                    )}
                                                </div>
                                                <button onClick={() => navigate(`/parts/${cat.id}/${part.id}`)} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", fontSize: "0.9rem", fontWeight: 500, color: T.text, fontFamily: "inherit", transition: "color 0.15s" }}
                                                    onMouseEnter={e => e.currentTarget.style.color = T.green}
                                                    onMouseLeave={e => e.currentTarget.style.color = T.text}
                                                >{part.name}</button>
                                                <span style={{ fontSize: "0.7rem", color: T.textDim, background: "rgba(255,255,255,0.05)", borderRadius: "4px", padding: "1px 6px" }}>{part.where}</span>
                                                <span style={{ fontSize: "0.7rem", color: part.avail.includes("Stock") || part.avail === "Digital" ? T.green : "#f0a500" }}>{part.avail}</span>
                                            </div>
                                        ) : (
                                            <button onClick={() => hasParts && navigate(`/parts/${cat.id}`)} style={{ background: "transparent", border: "none", color: hasParts ? T.blue : T.textDim, fontSize: "0.88rem", cursor: hasParts ? "pointer" : "default", padding: 0, fontFamily: "inherit", opacity: hasParts ? 1 : 0.5 }}>
                                                {hasParts ? `+ Choose a ${cat.name}` : `No ${cat.name} options yet`}
                                            </button>
                                        )}
                                    </div>

                                    <div style={{ textAlign: "right", fontSize: "0.88rem", color: T.textMid }}>{part ? `$${part.base}` : "—"}</div>
                                    <div style={{ textAlign: "right", fontSize: "0.88rem", color: part?.promo > 0 ? T.green : T.textDim }}>{part?.promo > 0 ? `−$${part.promo}` : "—"}</div>
                                    <div style={{ textAlign: "right" }}>
                                        {finalPrice !== null ? <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>${finalPrice.toFixed(2)}</span> : "—"}
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        {part && <button onClick={() => removePart(cat.id)} style={btnStyle(T.red, "rgba(255,107,107,0.3)")}>× Remove</button>}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Total row */}
                        <div style={{
                            padding: "1rem 1.25rem",
                            background: "rgba(15,217,128,0.06)",
                            borderTop: `1px solid ${T.border}`,
                        }}>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "160px 1fr 90px 100px 120px",
                                alignItems: "center",
                                marginBottom: "1rem"
                            }}>
                                <div style={{ gridColumn: "1 / 4", fontSize: "0.75rem", letterSpacing: "0.1em", color: T.textDim }}>ESTIMATED TOTAL</div>
                                <div style={{ textAlign: "right", fontSize: "0.82rem", color: T.green }}>
                                    {Object.values(selections).reduce((s, p) => s + p.promo, 0) > 0
                                        ? `−$${Object.values(selections).reduce((s, p) => s + p.promo, 0)}`
                                        : "—"}
                                </div>
                                <div style={{ textAlign: "right", fontFamily: T.display, fontSize: "1.1rem", color: T.green }}>${total.toFixed(2)}</div>
                            </div>

                            {selectedCount > 0 && (
                                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                                    <button onClick={() => {
                                        const asins = Object.values(selections)
                                            .filter(part => part.asin)
                                            .map(part => part.asin)
                                            .join(',');
                                        if (asins) {
                                            window.open(`https://www.amazon.com/gp/aws/cart/add.html?AssociateTag=techkage-20&ASIN.1=${asins.split(',')[0]}&Quantity.1=1${asins.split(',').slice(1).map((asin, i) => `&ASIN.${i + 2}=${asin}&Quantity.${i + 2}=1`).join('')}`, "_blank");
                                        } else {
                                            alert("No products with Amazon links in your build");
                                        }
                                    }} style={{
                                        background: "#FF9900",
                                        border: "none",
                                        color: "#000",
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        padding: "0.5rem 1rem",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontFamily: T.mono,
                                        letterSpacing: "0.05em",
                                        transition: "all 0.2s",
                                        whiteSpace: "nowrap"
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#FFB84D"}
                                        onMouseLeave={e => e.currentTarget.style.background = "#FF9900"}
                                    >🛒 BUY ON AMAZON</button>

                                    <button onClick={() => setShowSaveModal(true)} style={{
                                        background: T.green,
                                        border: "none",
                                        color: "#050608",
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        padding: "0.5rem 1rem",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontFamily: T.mono,
                                        letterSpacing: "0.05em",
                                        transition: "all 0.2s",
                                        whiteSpace: "nowrap"
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#1BF08E"}
                                        onMouseLeave={e => e.currentTarget.style.background = T.green}
                                    >SAVE BUILD 💾</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Card list — mobile ── */}
                {isMobile && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        {initialCategories.map((cat) => {
                            const part = selections[cat.id];
                            const finalPrice = part ? (part.base - part.promo + part.shipping + part.tax) : null;
                            const hasParts = !!(partsData[cat.id]?.length);

                            return (
                                <div key={cat.id} style={{
                                    background: T.card,
                                    border: `1px solid ${part ? "rgba(15,217,128,0.2)" : T.border}`,
                                    borderRadius: "10px",
                                    padding: "0.85rem 1rem",
                                    transition: "border-color 0.15s",
                                }}>
                                    {/* Top row: category name + price */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: part ? "0.5rem" : 0 }}>
                                        <button
                                            onClick={() => navigate(`/parts/${cat.id}`)}
                                            style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", fontSize: "0.75rem", color: part ? T.green : T.textMid, fontWeight: 600, fontFamily: "inherit", letterSpacing: "0.06em", textTransform: "uppercase" }}
                                        >
                                            {cat.icon} {cat.name}
                                        </button>
                                        {finalPrice !== null && (
                                            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: T.green }}>${finalPrice.toFixed(2)}</span>
                                        )}
                                    </div>

                                    {/* Part name or choose button */}
                                    {part ? (
                                        <>
                                            <button
                                                onClick={() => navigate(`/parts/${cat.id}/${part.id}`)}
                                                style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", fontSize: "0.88rem", fontWeight: 500, color: T.text, fontFamily: "inherit", textAlign: "left", width: "100%", marginBottom: "0.5rem" }}
                                                onMouseEnter={e => e.currentTarget.style.color = T.green}
                                                onMouseLeave={e => e.currentTarget.style.color = T.text}
                                            >
                                                {part.name}
                                            </button>

                                            {/* Meta row: retailer + availability + remove */}
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                                                <span style={{ fontSize: "0.68rem", color: T.textDim, background: "rgba(255,255,255,0.05)", borderRadius: "4px", padding: "1px 6px" }}>{part.where}</span>
                                                <span style={{ fontSize: "0.68rem", color: part.avail.includes("Stock") || part.avail === "Digital" ? T.green : "#f0a500" }}>{part.avail}</span>
                                                {part.promo > 0 && (
                                                    <span style={{ fontSize: "0.68rem", color: T.green }}>−${part.promo} savings</span>
                                                )}
                                                <button
                                                    onClick={() => removePart(cat.id)}
                                                    style={{ marginLeft: "auto", ...btnStyle(T.red, "rgba(255,107,107,0.3)") }}
                                                >
                                                    × Remove
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => hasParts && navigate(`/parts/${cat.id}`)}
                                            style={{ background: "transparent", border: "none", color: hasParts ? T.blue : T.textDim, fontSize: "0.82rem", cursor: hasParts ? "pointer" : "default", padding: 0, fontFamily: "inherit", opacity: hasParts ? 1 : 0.5, marginTop: "0.35rem" }}
                                        >
                                            {hasParts ? `+ Choose a ${cat.name}` : `No options yet`}
                                        </button>
                                    )}
                                </div>
                            );
                        })}

                        {/* Mobile total + save */}
                        <div style={{
                            background: "rgba(15,217,128,0.06)",
                            border: `1px solid rgba(15,217,128,0.2)`,
                            borderRadius: "10px",
                            padding: "1rem",
                            marginTop: "0.4rem",
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", color: T.textDim }}>ESTIMATED TOTAL</span>
                                {Object.values(selections).reduce((s, p) => s + p.promo, 0) > 0 && (
                                    <span style={{ fontSize: "0.78rem", color: T.green }}>
                                        −${Object.values(selections).reduce((s, p) => s + p.promo, 0)} saved
                                    </span>
                                )}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontFamily: T.display, fontSize: "1.4rem", color: T.green }}>${total.toFixed(2)}</span>
                                {selectedCount > 0 && (
                                    <button
                                        onClick={() => setShowSaveModal(true)}
                                        style={{ background: T.green, border: "none", color: "#050608", fontSize: "0.78rem", fontWeight: 700, padding: "0.55rem 1.1rem", borderRadius: "6px", cursor: "pointer", fontFamily: T.mono, letterSpacing: "0.05em", transition: "all 0.2s" }}
                                        onMouseEnter={e => e.currentTarget.style.background = "#1BF08E"}
                                        onMouseLeave={e => e.currentTarget.style.background = T.green}
                                    >
                                        SAVE BUILD 💾
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Footer notes ── */}
                <div style={{ marginTop: "1rem", fontSize: "0.68rem", color: T.textDim, textAlign: isMobile ? "left" : "right" }}>
                    * Prices and availability are illustrative. Always verify before purchasing.
                </div>
                <div style={{ marginTop: "0.5rem", fontSize: "0.68rem", color: T.textDim, textAlign: isMobile ? "left" : "right" }}>
                    💡 Affiliate Disclosure: As an Amazon Associate, we earn from qualifying purchases.
                </div>
            </div>

            {/* ── Save Build Modal ── */}
            {showSaveModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, backdropFilter: "blur(4px)", padding: "1rem" }}
                    onClick={() => setShowSaveModal(false)}>
                    <div style={{ background: T.card, borderRadius: "12px", border: `1px solid ${T.border}`, padding: "1.75rem", maxWidth: "500px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                        onClick={e => e.stopPropagation()}>
                        <h2 style={{ margin: "0 0 1.5rem", fontSize: isMobile ? "1.2rem" : "1.5rem", color: T.green, fontFamily: T.display }}>Save Your Build</h2>

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: T.textMid }}>Build Name *</label>
                            <input type="text" value={buildName} onChange={e => setBuildName(e.target.value)} placeholder="e.g., Gaming Beast 2026"
                                style={{ width: "100%", padding: "0.75rem", background: T.bg, border: `1px solid ${T.border}`, borderRadius: "6px", color: T.text, fontSize: "0.9rem", fontFamily: T.mono }} />
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", color: T.textMid }}>Description (optional)</label>
                            <textarea value={buildDescription} onChange={e => setBuildDescription(e.target.value)} placeholder="Add notes about your build..." rows={3}
                                style={{ width: "100%", padding: "0.75rem", background: T.bg, border: `1px solid ${T.border}`, borderRadius: "6px", color: T.text, fontSize: "0.9rem", fontFamily: T.mono, resize: "vertical" }} />
                        </div>

                        {saveStatus && (
                            <div style={{ padding: "0.75rem", marginBottom: "1rem", background: saveStatus.includes("success") ? "rgba(15,217,128,0.1)" : "rgba(255,107,107,0.1)", border: `1px solid ${saveStatus.includes("success") ? T.green : T.red}`, borderRadius: "6px", fontSize: "0.85rem", color: saveStatus.includes("success") ? T.green : T.red }}>
                                {saveStatus}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                            <button onClick={() => { setShowSaveModal(false); setBuildName(""); setBuildDescription(""); setSaveStatus(""); }}
                                style={{ padding: "0.65rem 1.25rem", fontSize: "0.85rem", background: "transparent", border: `1px solid ${T.border}`, color: T.textMid, borderRadius: "6px", cursor: "pointer", fontFamily: T.mono }}>
                                Cancel
                            </button>
                            <button onClick={handleSaveBuild} disabled={saveStatus === "Saving..."}
                                style={{ padding: "0.65rem 1.25rem", fontSize: "0.85rem", background: T.green, border: "none", color: "#050608", borderRadius: "6px", cursor: saveStatus === "Saving..." ? "not-allowed" : "pointer", fontFamily: T.mono, fontWeight: 700, opacity: saveStatus === "Saving..." ? 0.6 : 1 }}>
                                {saveStatus === "Saving..." ? "Saving..." : "Save Build"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function btnStyle(color, borderColor) {
    return {
        background: "transparent",
        border: `1px solid ${borderColor}`,
        color,
        fontSize: "0.72rem",
        padding: "0.18rem 0.55rem",
        borderRadius: "4px",
        cursor: "pointer",
        fontFamily: "'JetBrains Mono', monospace",
    };
}
