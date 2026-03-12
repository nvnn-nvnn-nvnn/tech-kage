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

// const sampleParts = {
//     cpu: [
//         { id: "c1", name: "AMD Ryzen 7 7800X3D", base: 449, promo: 30, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon" },
//         { id: "c2", name: "Intel Core i7-14700K", base: 409, promo: 0, shipping: 8, tax: 0, avail: "In Stock", where: "Newegg" },
//         { id: "c3", name: "AMD Ryzen 5 7600X", base: 249, promo: 20, shipping: 0, tax: 0, avail: "In Stock", where: "B&H" },
//     ],
//     "cpu-cooler": [
//         { id: "cc1", name: "Noctua NH-D15 chromax.black", base: 109, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon" },
//         { id: "cc2", name: "Corsair iCUE H150i Elite", base: 189, promo: 15, shipping: 0, tax: 0, avail: "In Stock", where: "Best Buy" },
//     ],
//     motherboard: [
//         { id: "m1", name: "ASUS ROG Strix X670E-F", base: 379, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "Newegg" },
//         { id: "m2", name: "MSI MAG B650 Tomahawk", base: 199, promo: 10, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon" },
//     ],
//     memory: [
//         { id: "r1", name: "G.Skill Trident Z5 32GB DDR5-6000", base: 119, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon" },
//         { id: "r2", name: "Corsair Vengeance 32GB DDR5-5200", base: 99, promo: 5, shipping: 0, tax: 0, avail: "In Stock", where: "Newegg" },
//     ],
//     storage: [
//         { id: "s1", name: "Samsung 990 Pro 2TB NVMe", base: 159, promo: 20, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon" },
//         { id: "s2", name: "WD Black SN850X 1TB", base: 99, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "B&H" },
//     ],
//     videocard: [
//         { id: "g1", name: "GeForce RTX 5080 16GB", base: 1199, promo: 50, shipping: 0, tax: 0, avail: "Pre-order", where: "Best Buy" },
//         { id: "g2", name: "Radeon RX 7900 XTX 24GB", base: 949, promo: 100, shipping: 0, tax: 0, avail: "In Stock", where: "Newegg" },
//         { id: "g3", name: "GeForce RTX 4070 Ti Super", base: 799, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon" },
//     ],
//     case: [
//         { id: "ca1", name: "Fractal Design Torrent", base: 189, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon" },
//         { id: "ca2", name: "Lian Li PC-O11 Dynamic EVO", base: 149, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "Newegg" },
//     ],
//     powersupply: [
//         { id: "p1", name: "Seasonic Prime TX-1000 80+ Titanium", base: 249, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon" },
//         { id: "p2", name: "Corsair RM1000x 80+ Gold", base: 179, promo: 20, shipping: 0, tax: 0, avail: "In Stock", where: "Best Buy" },
//     ],
//     os: [
//         { id: "o1", name: "Microsoft Windows 11 Home", base: 139, promo: 0, shipping: 0, tax: 0, avail: "Digital", where: "Microsoft" },
//         { id: "o2", name: "Microsoft Windows 11 Pro", base: 199, promo: 0, shipping: 0, tax: 0, avail: "Digital", where: "Microsoft" },
//     ],
//     monitor: [
//         { id: "mo1", name: 'LG 27GP950-B 4K 144Hz 27"', base: 799, promo: 100, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon" },
//         { id: "mo2", name: 'Samsung Odyssey G7 32" QHD 240Hz', base: 649, promo: 50, shipping: 0, tax: 0, avail: "In Stock", where: "Best Buy" },
//     ],
// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PartPicker() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { selections, removePart, total, selectedCount, saveBuild } = useBuilder();
    const [partsData, setPartsData] = useState({});
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [buildName, setBuildName] = useState("");
    const [buildDescription, setBuildDescription] = useState("");
    const [saveStatus, setSaveStatus] = useState("");

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
        <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: T.mono, padding: "2.5rem 1.25rem" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Orbitron:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; background: #080a0d; }
        ::-webkit-scrollbar-thumb { background: rgba(15,217,128,0.3); border-radius: 3px; }
      `}</style>

            <div style={{ maxWidth: "75%", margin: "0 auto" }}>

                {/* ── Header ── */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                    <div>
                        <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: T.textDim, marginBottom: "4px" }}>
                            SYSTEM CONFIGURATOR
                        </div>
                        <h1 style={{ margin: 0, fontFamily: T.display, fontSize: "1.6rem", color: T.green, lineHeight: 1 }}>
                            Custom PC Build
                        </h1>
                    </div>
                    <div style={{
                        background: T.greenDim,
                        border: `1px solid ${T.green}`,
                        borderRadius: "10px",
                        padding: "0.75rem 1.25rem",
                        textAlign: "right",
                    }}>
                        <div style={{ fontSize: "0.7rem", color: T.textDim, marginBottom: "2px" }}>
                            {selectedCount} / {initialCategories.length} components
                        </div>
                        <div style={{ fontFamily: T.display, fontSize: "1.4rem", color: T.green }}>
                            ${total.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* ── Table ── */}
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

                    {/* Rows */}
                    {initialCategories.map((cat, i) => {
                        const part = selections[cat.id];
                        const finalPrice = part ? (part.base - part.promo + part.shipping + part.tax) : null;
                        const hasParts = !!(partsData[cat.id]?.length);

                        return (
                            <div
                                key={cat.id}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "160px 1fr 90px 100px 120px 100px",
                                    alignItems: "center",
                                    padding: "0.9rem 1.25rem",
                                    borderBottom: i < initialCategories.length - 1 ? `1px solid ${T.border}` : "none",
                                    background: part ? "rgba(15,217,128,0.03)" : "transparent",
                                    transition: "background 0.15s",
                                }}
                            >
                                {/* Component label */}
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span style={{ fontSize: "1rem" }}>{cat.icon}</span>
                                    <button
                                        onClick={() => navigate(`/parts/${cat.id}`)}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            padding: 0,
                                            cursor: "pointer",
                                            fontSize: "0.82rem",
                                            color: part ? T.green : T.textMid,
                                            fontWeight: 500,
                                            fontFamily: "inherit",
                                            transition: "opacity 0.15s",
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                                    >
                                        {cat.name}
                                    </button>
                                </div>

                                {/* Selection */}
                                <div>
                                    {part ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                                            <button
                                                onClick={() => navigate(`/parts/${cat.id}/${part.id}`)}
                                                style={{
                                                    background: "transparent",
                                                    border: "none",
                                                    padding: 0,
                                                    cursor: "pointer",
                                                    fontSize: "0.9rem",
                                                    fontWeight: 500,
                                                    color: T.text,
                                                    fontFamily: "inherit",
                                                    transition: "color 0.15s",
                                                }}
                                                onMouseEnter={e => (e.currentTarget.style.color = T.green)}
                                                onMouseLeave={e => (e.currentTarget.style.color = T.text)}
                                            >
                                                {part.name}
                                            </button>
                                            <span style={{
                                                fontSize: "0.7rem", color: T.textDim,
                                                background: "rgba(255,255,255,0.05)", borderRadius: "4px", padding: "1px 6px",
                                            }}>
                                                {part.where}
                                            </span>
                                            <span style={{
                                                fontSize: "0.7rem",
                                                color: part.avail.includes("Stock") || part.avail === "Digital" ? T.green : "#f0a500",
                                            }}>
                                                {part.avail}
                                            </span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => hasParts && navigate(`/parts/${cat.id}`)}
                                            style={{
                                                background: "transparent", border: "none",
                                                color: hasParts ? T.blue : T.textDim,
                                                fontSize: "0.88rem", cursor: hasParts ? "pointer" : "default",
                                                padding: 0, fontFamily: "inherit",
                                                opacity: hasParts ? 1 : 0.5,
                                            }}
                                        >
                                            {hasParts ? `+ Choose a ${cat.name}` : `No ${cat.name} options yet`}
                                        </button>
                                    )}
                                </div>

                                {/* Base price */}
                                <div style={{ textAlign: "right", fontSize: "0.88rem", color: T.textMid }}>
                                    {part ? `$${part.base}` : "—"}
                                </div>

                                {/* Savings */}
                                <div style={{ textAlign: "right", fontSize: "0.88rem", color: part?.promo > 0 ? T.green : T.textDim }}>
                                    {part?.promo > 0 ? `−$${part.promo}` : "—"}
                                </div>

                                {/* Final price */}
                                <div style={{ textAlign: "right" }}>
                                    {finalPrice !== null ? (
                                        <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>${finalPrice.toFixed(2)}</span>
                                    ) : "—"}

                                </div>

                                {/* Action */}
                                <div style={{ textAlign: "right" }}>
                                    {part && (
                                        <button onClick={() => removePart(cat.id)} style={btnStyle(T.red, "rgba(255,107,107,0.3)")}>
                                            × Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Total row */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "160px 1fr 90px 100px 120px 100px",
                        alignItems: "center",
                        padding: "1rem 1.25rem",
                        background: "rgba(15,217,128,0.06)",
                        borderTop: `1px solid ${T.border}`,
                    }}>
                        <div style={{ gridColumn: "1 / 4", fontSize: "0.75rem", letterSpacing: "0.1em", color: T.textDim }}>
                            ESTIMATED TOTAL
                        </div>
                        <div style={{ textAlign: "right", fontSize: "0.82rem", color: T.green }}>
                            {Object.values(selections).reduce((s, p) => s + p.promo, 0) > 0
                                ? `−$${Object.values(selections).reduce((s, p) => s + p.promo, 0)}`
                                : "—"}
                        </div>
                        <div style={{ textAlign: "right", fontFamily: T.display, fontSize: "1.1rem", color: T.green }}>
                            ${total.toFixed(2)}
                        </div>
                        <div style={{ textAlign: "right" }}>
                            {selectedCount > 0 && (
                                <button
                                    onClick={() => setShowSaveModal(true)}
                                    style={{
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
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#1BF08E"}
                                    onMouseLeave={e => e.currentTarget.style.background = T.green}
                                >
                                    SAVE BUILD 💾
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Footer note ── */}
                <div style={{ marginTop: "1rem", fontSize: "0.72rem", color: T.textDim, textAlign: "right" }}>
                    * Prices and availability are illustrative. Always verify before purchasing.
                </div>
            </div>

            {/* Save Build Modal */}
            {showSaveModal && (
                <div style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 9999, backdropFilter: "blur(4px)",
                }} onClick={() => setShowSaveModal(false)}>
                    <div style={{
                        background: T.card, borderRadius: "12px",
                        border: `1px solid ${T.border}`,
                        padding: "2rem", maxWidth: "500px", width: "90%",
                        boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
                    }} onClick={e => e.stopPropagation()}>
                        <h2 style={{
                            margin: "0 0 1.5rem", fontSize: "1.5rem",
                            color: T.green, fontFamily: T.display,
                        }}>Save Your Build</h2>

                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{
                                display: "block", marginBottom: "0.5rem",
                                fontSize: "0.85rem", color: T.textMid,
                            }}>Build Name *</label>
                            <input
                                type="text"
                                value={buildName}
                                onChange={e => setBuildName(e.target.value)}
                                placeholder="e.g., Gaming Beast 2026"
                                style={{
                                    width: "100%", padding: "0.75rem",
                                    background: T.bg, border: `1px solid ${T.border}`,
                                    borderRadius: "6px", color: T.text,
                                    fontSize: "0.9rem", fontFamily: T.mono,
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{
                                display: "block", marginBottom: "0.5rem",
                                fontSize: "0.85rem", color: T.textMid,
                            }}>Description (optional)</label>
                            <textarea
                                value={buildDescription}
                                onChange={e => setBuildDescription(e.target.value)}
                                placeholder="Add notes about your build..."
                                rows={3}
                                style={{
                                    width: "100%", padding: "0.75rem",
                                    background: T.bg, border: `1px solid ${T.border}`,
                                    borderRadius: "6px", color: T.text,
                                    fontSize: "0.9rem", fontFamily: T.mono,
                                    resize: "vertical",
                                }}
                            />
                        </div>

                        {saveStatus && (
                            <div style={{
                                padding: "0.75rem", marginBottom: "1rem",
                                background: saveStatus.includes("success") ? "rgba(15,217,128,0.1)" : "rgba(255,107,107,0.1)",
                                border: `1px solid ${saveStatus.includes("success") ? T.green : T.red}`,
                                borderRadius: "6px", fontSize: "0.85rem",
                                color: saveStatus.includes("success") ? T.green : T.red,
                            }}>
                                {saveStatus}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                            <button
                                onClick={() => {
                                    setShowSaveModal(false);
                                    setBuildName("");
                                    setBuildDescription("");
                                    setSaveStatus("");
                                }}
                                style={{
                                    padding: "0.65rem 1.25rem", fontSize: "0.85rem",
                                    background: "transparent", border: `1px solid ${T.border}`,
                                    color: T.textMid, borderRadius: "6px",
                                    cursor: "pointer", fontFamily: T.mono,
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveBuild}
                                disabled={saveStatus === "Saving..."}
                                style={{
                                    padding: "0.65rem 1.25rem", fontSize: "0.85rem",
                                    background: T.green, border: "none",
                                    color: "#050608", borderRadius: "6px",
                                    cursor: saveStatus === "Saving..." ? "not-allowed" : "pointer",
                                    fontFamily: T.mono, fontWeight: 700,
                                    opacity: saveStatus === "Saving..." ? 0.6 : 1,
                                }}
                            >
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