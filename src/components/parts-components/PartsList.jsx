import React, { useState, useEffect } from "react";
import Searchbar from "../Searchbar";

const T = {
    bg: "#050608",
    card: "#0D0F14",
    green: "#0FD980",
    border: "rgba(255,255,255,0.08)",
    text: "#f0f0f2",
    textMid: "rgba(240,240,242,0.50)",
    textDim: "rgba(240,240,242,0.22)",
    mono: "'JetBrains Mono', monospace",
};

const COLUMNS = {
    cpu: [
        { key: "cores", label: "CORES", align: "center" },
        { key: "baseClock", label: "BASE CLOCK", align: "center" },
        { key: "boostClock", label: "BOOST CLOCK", align: "center" },
        { key: "microarchitecture", label: "ARCHITECTURE", align: "center" },
        { key: "tdp", label: "TDP", align: "center" },
    ],
    "cpu-cooler": [
        { key: "rpm", label: "FAN RPM", align: "center" },
        { key: "noiseLevel", label: "NOISE LEVEL", align: "center" },
        { key: "radiatorSize", label: "RADIATOR SIZE", align: "center" },
        { key: "color", label: "COLOR", align: "center" },
    ],
    motherboard: [
        { key: "socket", label: "SOCKET / CPU", align: "center" },
        { key: "formFactor", label: "FORM FACTOR", align: "center" },
        { key: "memoryMax", label: "MEMORY MAX", align: "center" },
        { key: "memorySlots", label: "MEMORY SLOTS", align: "center" },
        { key: "color", label: "COLOR", align: "center" },
    ],
    memory: [
        { key: "speed", label: "SPEED", align: "center" },
        { key: "modules", label: "MODULES", align: "center" },
        { key: "pricePerGb", label: "PRICE / GB", align: "center" },
        { key: "casLatency", label: "CAS LATENCY", align: "center" },
        { key: "color", label: "COLOR", align: "center" },
    ],
    storage: [
        { key: "capacity", label: "CAPACITY", align: "center" },
        { key: "pricePerGb", label: "PRICE / GB", align: "center" },
        { key: "type", label: "TYPE", align: "center" },
        { key: "cache", label: "CACHE", align: "center" },
        { key: "formFactor", label: "FORM FACTOR", align: "center" },
        { key: "interface", label: "INTERFACE", align: "center" },
    ],
    videocard: [
        { key: "chipset", label: "CHIPSET", align: "center" },
        { key: "memory", label: "MEMORY", align: "center" },
        { key: "coreClock", label: "CORE CLOCK", align: "center" },
        { key: "boostClock", label: "BOOST CLOCK", align: "center" },
        { key: "length", label: "LENGTH", align: "center" },
        { key: "color", label: "COLOR", align: "center" },
    ],
    powersupply: [
        { key: "type", label: "TYPE", align: "center" },
        { key: "efficiencyRating", label: "EFFICIENCY", align: "center" },
        { key: "wattage", label: "WATTAGE", align: "center" },
        { key: "modular", label: "MODULAR", align: "center" },
        { key: "color", label: "COLOR", align: "center" },
    ],
    case: [
        { key: "towerType", label: "TOWER TYPE", align: "center" },
        { key: "color", label: "COLOR", align: "center" },
        { key: "sidePanel", label: "SIDE PANEL", align: "center" },
        { key: "external525Bays", label: "EXT 3.5 BAYS", align: "center" },
    ],
};

// Sample parts data - you can replace this with API calls later
const sampleParts = {
    cpu: [
        { id: "c1", name: "AMD Ryzen 7 7800X3D", base: 449, promo: 30, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon", cores: 8, baseClock: "4.5 GHz", boostClock: "5.0 GHz", microarchitecture: "Zen 4", tdp: "120W" },
        { id: "c2", name: "Intel Core i7-14700K", base: 409, promo: 0, shipping: 8, tax: 0, avail: "In Stock", where: "Newegg", cores: 20, baseClock: "3.4 GHz", boostClock: "5.6 GHz", microarchitecture: "Raptor Lake", tdp: "125W" },
        { id: "c3", name: "AMD Ryzen 5 7600X", base: 249, promo: 20, shipping: 0, tax: 0, avail: "In Stock", where: "B&H", cores: 6, baseClock: "4.7 GHz", boostClock: "5.3 GHz", microarchitecture: "Zen 4", tdp: "105W" },
    ],
    "cpu-cooler": [
        { id: "cc1", name: "Noctua NH-D15 chromax.black", base: 109, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon", rpm: "300-1500", noiseLevel: "24.6 dB", radiatorSize: "N/A", color: "Black" },
        { id: "cc2", name: "Corsair iCUE H150i Elite", base: 189, promo: 15, shipping: 0, tax: 0, avail: "In Stock", where: "Best Buy", rpm: "400-2400", noiseLevel: "37 dB", radiatorSize: "360mm", color: "Black" },
    ],
    motherboard: [
        { id: "m1", name: "ASUS ROG Strix X670E-F", base: 379, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "Newegg", socket: "AM5", formFactor: "ATX", memoryMax: "128GB", memorySlots: 4, color: "Black" },
        { id: "m2", name: "MSI MAG B650 Tomahawk", base: 199, promo: 10, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon", socket: "AM5", formFactor: "ATX", memoryMax: "128GB", memorySlots: 4, color: "Black" },
    ],
    memory: [
        { id: "r1", name: "G.Skill Trident Z5 32GB DDR5-6000", base: 119, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon", speed: "DDR5-6000", modules: "2x16GB", pricePerGb: "$3.72", casLatency: "CL36", color: "Silver" },
        { id: "r2", name: "Corsair Vengeance 32GB DDR5-5200", base: 99, promo: 5, shipping: 0, tax: 0, avail: "In Stock", where: "Newegg", speed: "DDR5-5200", modules: "2x16GB", pricePerGb: "$3.09", casLatency: "CL40", color: "Black" },
    ],
    storage: [
        { id: "s1", name: "Samsung 990 Pro 2TB NVMe", base: 159, promo: 20, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon", capacity: "2TB", pricePerGb: "$0.07", type: "SSD", cache: "2GB LPDDR4", formFactor: "M.2 2280", interface: "PCIe 4.0 x4" },
        { id: "s2", name: "WD Black SN850X 1TB", base: 99, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "B&H", capacity: "1TB", pricePerGb: "$0.10", type: "SSD", cache: "1GB LPDDR4", formFactor: "M.2 2280", interface: "PCIe 4.0 x4" },
    ],
    videocard: [
        { id: "g1", name: "GeForce RTX 5080 16GB", base: 1199, promo: 50, shipping: 0, tax: 0, avail: "Pre-order", where: "Best Buy", chipset: "RTX 5080", memory: "16GB GDDR7", coreClock: "2295 MHz", boostClock: "2900 MHz", length: "336mm", color: "Black" },
        { id: "g2", name: "Radeon RX 7900 XTX 24GB", base: 949, promo: 100, shipping: 0, tax: 0, avail: "In Stock", where: "Newegg", chipset: "RX 7900 XTX", memory: "24GB GDDR6", coreClock: "1855 MHz", boostClock: "2500 MHz", length: "287mm", color: "Black" },
        { id: "g3", name: "GeForce RTX 4070 Ti Super", base: 799, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon", chipset: "RTX 4070 Ti Super", memory: "16GB GDDR6X", coreClock: "2340 MHz", boostClock: "2610 MHz", length: "305mm", color: "Black" },
    ],
    powersupply: [
        { id: "p1", name: "Seasonic Prime TX-1000 80+ Titanium", base: 249, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon", type: "ATX", efficiencyRating: "80+ Titanium", wattage: "1000W", modular: "Full", color: "Black" },
        { id: "p2", name: "Corsair RM1000x 80+ Gold", base: 179, promo: 20, shipping: 0, tax: 0, avail: "In Stock", where: "Best Buy", type: "ATX", efficiencyRating: "80+ Gold", wattage: "1000W", modular: "Full", color: "Black" },
    ],
    case: [
        { id: "ca1", name: "Fractal Design Torrent", base: 189, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "Amazon", towerType: "Mid Tower", color: "Black", sidePanel: "Tempered Glass", external525Bays: 2 },
        { id: "ca2", name: "Lian Li PC-O11 Dynamic EVO", base: 149, promo: 0, shipping: 0, tax: 0, avail: "In Stock", where: "Newegg", towerType: "Mid Tower", color: "Black", sidePanel: "Tempered Glass", external525Bays: 0 },
    ],
};

export default function PartsList({ partType }) {
    const [parts, setParts] = useState([]);

    useEffect(() => {
        // Load parts for this category
        const categoryParts = sampleParts[partType] || [];
        setParts(categoryParts);
    }, [partType]);

    if (parts.length === 0) {
        return (
            <div style={{ padding: "3rem", textAlign: "center", color: T.textMid }}>
                <p>No parts available for this category yet.</p>
            </div>
        );
    }

    return (
        <div style={{

            maxWidth: "1200px",
            margin: "0 auto",
            padding: "1rem 1rem",
            overflow: "hidden",
        }}>


            <div
                style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    marginBottom: "1rem"
                }}>
                <h2
                    style={{
                        marginBottom: "0.5rem"
                    }}
                >{parts.length} Compatible Products</h2>

                {/* Search Bar */}
                <Searchbar partType={partType} />


                <div style={{
                    borderBottom: "1px solid rgba(255,255,255,0.65)",
                    marginBottom: "1rem",
                    marginTop: "1rem"
                }} />
            </div>

            <div
                style={{
                    overflow: "hidden"
                }}

            >
                {(() => {
                    const cols = COLUMNS[partType] || [];
                    const templateColumns = `1fr ${cols.map(() => "140px").join(" ")} 100px 120px`;

                    return (
                        <>
                            {/* Header */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: templateColumns,
                                padding: "0.7rem 1.25rem",
                                background: "rgba(15,217,128,0.06)",
                                borderBottom: `1px solid ${T.border}`,
                                fontSize: "0.68rem",
                                letterSpacing: "0.12em",
                                color: T.textDim,
                                fontWeight: 600,
                            }}>
                                <div>NAME</div>
                                {cols.map(col => (
                                    <div key={col.key} style={{ textAlign: col.align }}>{col.label}</div>
                                ))}
                                <div style={{ textAlign: "right" }}>PRICE</div>
                                <div style={{ textAlign: "right" }}>ACTION</div>
                            </div>


                            {/* Rows */}
                            <div style={{ display: "grid", gap: "0.5rem" }}>
                                {parts.map(part => {
                                    const finalPrice = part.base - part.promo + part.shipping + part.tax;

                                    return (
                                        <div
                                            key={part.id}
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: templateColumns,
                                                alignItems: "center",
                                                background: T.card,
                                                border: `1px solid ${T.border}`,
                                                borderRadius: "8px",
                                                padding: "1rem 1.25rem",
                                                transition: "all 0.2s",
                                                cursor: "pointer",
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.borderColor = T.green;
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = T.border;
                                                e.currentTarget.style.transform = "translateY(0)";
                                            }}
                                        >
                                            <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{part.name}</div>

                                            {cols.map(col => (
                                                <div key={col.key} style={{ textAlign: col.align, fontSize: "0.9rem", color: T.textMid }}>
                                                    {part[col.key] ?? "—"}
                                                </div>
                                            ))}

                                            <div style={{ textAlign: "right", fontSize: "1rem", fontWeight: 700, color: T.green }}>
                                                ${finalPrice.toFixed(2)}
                                            </div>

                                            <div style={{ textAlign: "right" }}>
                                                <button
                                                    style={{
                                                        padding: "0.5rem 1rem",
                                                        background: T.green,
                                                        color: "#000",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        fontSize: "0.8rem",
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    );
                })()}
            </div>
        </div>
    );
}
