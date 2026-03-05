import React, { useState } from "react";

const T = {
    bg: "#050608",
    card: "#0A0C10",
    green: "#0FD980",
    border: "rgba(255,255,255,0.08)",
    text: "#f5f5f5",
    textMid: "rgba(255,255,255,0.45)",
    textDim: "rgba(255,255,255,0.2)",
    mono: "'JetBrains Mono', monospace",
    display: "'Orbitron', sans-serif",
};

const initialCategories = [
    { id: "cpu", name: "CPU", icon: "⚡" },
    { id: "cpu-cooler", name: "CPU Cooler", icon: "❄️" },
    { id: "motherboard", name: "Motherboard", icon: "🔌" },
    { id: "gpu", name: "Graphics Card", icon: "🔌" },
    { id: "ram", name: "Memory", icon: "🔌" },
    { id: "ssd", name: "Storage", icon: "🔌" },
    { id: "case", name: "Case", icon: "🔌" },
];

export default function Test() {
    const [parts] = useState([]);
    const [query, setQuery] = useState("");
    const [count, setCount] = useState(0);
    const [openId, setOpenId] = useState(null);



    const filteredParts = parts.filter(part =>
        part.name.toLowerCase().includes(query.toLowerCase()));

    return (

        <>





            <h1 style={{
                fontFamily: T.display,
                marginBottom: "2rem"
            }}>Test</h1>



            <div style={{
                minHeight: "100vh",
                background: T.bg,
                color: T.text,
                padding: "2rem",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontFamily: T.mono,
                alignContent: "center",
                justifyContent: "center",
            }}>


                <div style={{
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: "12px",
                    padding: "2rem",
                    width: "100%",
                    maxWidth: "1000px",
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        alignContent: "start",
                        alignItems: "center",
                        margin: "1rem",
                        flexWrap: "wrap",
                        justifyContent: "center",

                    }}>
                        {/* Column Headers */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "160px 1fr 80px 80px 90px 60px 110px 80px 100px",
                            padding: "0.6rem 1rem",
                            borderBottom: `1px solid ${T.border}`,
                            background: "rgba(15,217,128,0.06)",
                            borderRadius: "8px 8px 0 0",
                        }}>
                            {["Component", "Selection", "Base", "Promo", "Shipping", "Tax", "Availability", "Price", "Where"].map(label => (
                                <div key={label} style={{
                                    fontSize: "0.7rem",
                                    letterSpacing: "0.1em",
                                    color: T.textDim,
                                    fontWeight: 600,
                                }}>
                                    {label}
                                </div>
                            ))}
                        </div>
                        {
                            initialCategories.map((cat, index) => (
                                <div key={cat.id} style={{
                                    display: "grid",
                                    gridTemplateColumns: "160px 1fr 80px 80px 90px 60px 110px 80px 100px",
                                    alignItems: "start",
                                    padding: "0.75rem 1rem",
                                    borderBottom: index < initialCategories.length - 1
                                        ? `1px solid ${T.border}`
                                        : "none",
                                }}>
                                    <h2 style={{ margin: 0, fontSize: "1rem", color: T.green, minWidth: "140px" }}>
                                        {cat.name}
                                    </h2>
                                    <p style={{ margin: 0, fontSize: "1rem" }}>{cat.icon}</p>

                                    <button
                                        onClick={() => setOpenId(prev => prev === cat.id ? null : cat.id)}
                                        style={{
                                            background: "transparent",
                                            border: `1px solid ${T.border}`,
                                            color: T.green,
                                            fontFamily: T.mono,
                                            padding: "0.2rem 0.4rem",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            marginLeft: "auto",
                                        }}
                                    >
                                        {openId === cat.id ? "✕ Close" : "+ Choose"}
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>


        </>

    );
}