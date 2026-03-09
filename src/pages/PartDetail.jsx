import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sampleParts } from "../data/partsLoader";
import { useBuilder } from "../context/BuilderContext";

const T = {
    bg: "#050608",
    card: "#0D0F14",
    cardAlt: "#111318",
    green: "#0FD980",
    greenDim: "rgba(15,217,128,0.12)",
    greenGlow: "rgba(15,217,128,0.25)",
    border: "rgba(255,255,255,0.08)",
    borderHover: "rgba(15,217,128,0.4)",
    text: "#f0f0f2",
    textMid: "rgba(240,240,242,0.50)",
    textDim: "rgba(240,240,242,0.22)",
    mono: "'JetBrains Mono', monospace",
};

const COLUMNS = {
    cpu: [
        { key: "manufacturer", label: "Manufacturer" },
        { key: "partNumber", label: "Part #" },
        { key: "series", label: "Series" },
        { key: "microarchitecture", label: "Microarchitecture" },
        { key: "coreFamily", label: "Core Family" },
        { key: "socket", label: "Socket" },
        { key: "coreCount", label: "Core Count" },
        { key: "threadCount", label: "Thread Count" },
        { key: "performanceCoreClock", label: "Performance Core Clock" },
        { key: "performanceCoreBoostClock", label: "Performance Core Boost Clock" },
        { key: "l2Cache", label: "L2 Cache" },
        { key: "l3Cache", label: "L3 Cache" },
        { key: "tdp", label: "TDP" },
        { key: "integratedGraphics", label: "Integrated Graphics" },
        { key: "maxSupportedMemory", label: "Maximum Supported Memory" },
        { key: "eccSupport", label: "ECC Support" },
        { key: "includesCooler", label: "Includes Cooler" },
        { key: "packaging", label: "Packaging" },
        { key: "lithography", label: "Lithography" },
        { key: "simultaneousMultithreading", label: "Simultaneous Multithreading" },
    ],
    "cpu-cooler": [
        { key: "manufacturer", label: "Manufacturer" },
        { key: "model", label: "Model" },
        { key: "partNumber", label: "Part #" },
        { key: "rpm", label: "Fan RPM" },
        { key: "noiseLevel", label: "Noise Level" },
        { key: "color", label: "Color" },
        { key: "height", label: "Height" },
        { key: "cpuSocket", label: "CPU Socket" },
        { key: "waterCooled", label: "Water Cooled" },
        { key: "fanless", label: "Fanless" },
    ],

    memory: [
        { key: "manufacturer", label: "Manufacturer" },
        { key: "partNumber", label: "Part #" },
        { key: "speed", label: "Speed" },
        { key: "formFactor", label: "Form Factor" },
        { key: "modules", label: "Modules" },
        { key: "pricePerGb", label: "Price / GB" },
        { key: "color", label: "Color" },
        { key: "firstWordLatency", label: "First Word Latency" },
        { key: "casLatency", label: "CAS Latency" },
        { key: "voltage", label: "Voltage" },
        { key: "eccRegistered", label: "ECC / Registered" },
        { key: "heatSpreader", label: "Heat Spreader" },
    ],

    motherboard: [
        { key: "manufacturer", label: "MANUFACTURER", align: "center" },
        { key: "partNumber", label: "PART #", align: "center" },
        { key: "socket", label: "SOCKET / CPU", align: "center" },
        { key: "formFactor", label: "FORM FACTOR", align: "center" },
        { key: "chipset", label: "CHIPSET", align: "center" },
        { key: "memoryMax", label: "MEMORY MAX", align: "center" },
        { key: "memoryType", label: "MEMORY TYPE", align: "center" },
        { key: "memorySlots", label: "MEMORY SLOTS", align: "center" },
        { key: "memorySpeed", label: "MEMORY SPEED", align: "center" },
        { key: "color", label: "COLOR", align: "center" },
        { key: "pcieX16Slots", label: "PCIE X16 SLOTS", align: "center" },
        { key: "pcieX1Slots", label: "PCIE X1 SLOTS", align: "center" },
        { key: "m2Slots", label: "M.2 SLOTS", align: "center" },
        { key: "sata6Ports", label: "SATA 6.0 GB/S PORTS", align: "center" },
        { key: "onboardEthernet", label: "ONBOARD ETHERNET", align: "center" },
        { key: "onboardVideo", label: "ONBOARD VIDEO", align: "center" },
        { key: "usb20Headers", label: "USB 2.0 HEADERS", align: "center" },
        { key: "usb32Gen1Headers", label: "USB 3.2 GEN 1 HEADERS", align: "center" },
        { key: "usb32Gen2Headers", label: "USB 3.2 GEN 2 HEADERS", align: "center" },
        { key: "supportsECC", label: "SUPPORTS ECC", align: "center" },
        { key: "wirelessNetworking", label: "WIRELESS NETWORKING", align: "center" },
        { key: "raidSupport", label: "RAID SUPPORT", align: "center" },
        { key: "backConnectConnectors", label: "USES BACK-CONNECT CONNECTORS", align: "center" },
    ],

    storage: [
        { key: "manufacturer", label: "Manufacturer" },
        { key: "partNumber", label: "Part #" },
        { key: "capacity", label: "Capacity" },
        { key: "pricePerGb", label: "Price / GB" },
        { key: "type", label: "Type" },
        { key: "formFactor", label: "Form Factor" },
        { key: "interface", label: "Interface" },
        { key: "nvme", label: "NVMe" },
    ],

    videocard: [
        { key: "manufacturer", label: "Manufacturer" },
        { key: "partNumber", label: "Part #" },
        { key: "chipset", label: "Chipset" },
        { key: "memory", label: "Memory" },
        { key: "memoryType", label: "Memory Type" },
        { key: "coreClock", label: "Core Clock" },
        { key: "boostClock", label: "Boost Clock" },
        { key: "effectiveMemoryClock", label: "Effective Memory Clock" },
        { key: "interface", label: "Interface" },
        { key: "color", label: "Color" },
        { key: "frameSync", label: "Frame Sync" },
        { key: "length", label: "Length" },
        { key: "tdp", label: "TDP" },
        { key: "caseExpansionSlotWidth", label: "Case Expansion Slot Width" },
        { key: "totalSlotWidth", label: "Total Slot Width" },
        { key: "cooling", label: "Cooling" },
        { key: "externalPower", label: "External Power" },
        { key: "displayPort21bOutputs", label: "DisplayPort 2.1b Outputs" },
        { key: "hdmi21bOutputs", label: "HDMI 2.1b Outputs" },
    ],

    powersupply: [
        { key: "manufacturer", label: "Manufacturer" },
        { key: "partNumber", label: "Part #" },
        { key: "type", label: "Type" },
        { key: "efficiencyRating", label: "Efficiency Rating" },
        { key: "wattage", label: "Wattage" },
        { key: "length", label: "Length" },
        { key: "modular", label: "Modular" },
        { key: "color", label: "Color" },
        { key: "fanless", label: "Fanless" },
        { key: "atx4pinConnectors", label: "ATX 4-pin Connectors" },
        { key: "eps8pinConnectors", label: "EPS 8-pin Connectors" },
        { key: "pcie16pin12vhpwrConnectors", label: "PCIe 16-pin 12VHPWR/12V-2x6 Connectors" },
        { key: "pcie12pinConnectors", label: "PCIe 12-pin Connectors" },
        { key: "pcie8pinConnectors", label: "PCIe 8-pin Connectors" },
        { key: "pcie6plus2pinConnectors", label: "PCIe 6+2-pin Connectors" },
        { key: "pcie6pinConnectors", label: "PCIe 6-pin Connectors" },
        { key: "sataConnectors", label: "SATA Connectors" },
        { key: "ampMolex4pinConnectors", label: "AMP/Molex 4-pin Connectors" },
    ],
    case: [
        { key: "manufacturer", label: "Manufacturer" },
        { key: "partNumber", label: "Part #" },
        { key: "type", label: "Type" },
        { key: "color", label: "Color" },
        { key: "powerSupply", label: "Power Supply" },
        { key: "sidePanel", label: "Side Panel" },
        { key: "powerSupplyShroud", label: "Power Supply Shroud" },
        { key: "frontPanelUsb", label: "Front Panel USB" },
        { key: "motherboardFormFactor", label: "Motherboard Form Factor" },
        { key: "maxVideoCardLength", label: "Maximum Video Card Length" },
        { key: "driveBays", label: "Drive Bays" },
        { key: "expansionSlots", label: "Expansion Slots" },
        { key: "fanSupport", label: "Fan Support" },
        { key: "includedFans", label: "Included Fans" },
        { key: "radiatorSupport", label: "Radiator Support" },
        { key: "dimensions", label: "Dimensions" },
        { key: "volume", label: "Volume" },
    ],
};

const RETAILER_META = {
    Amazon: { color: "#FF9900", bg: "rgba(255,153,0,0.10)" },
    Newegg: { color: "#F96300", bg: "rgba(249,99,0,0.10)" },
    "B&H": { color: "#CC0000", bg: "rgba(204,0,0,0.10)" },
    "Best Buy": { color: "#0046BE", bg: "rgba(0,70,190,0.10)" },
};

const CATEGORY_LABELS = {
    cpu: "CPU",
    "cpu-cooler": "CPU Cooler",
    motherboard: "Motherboard",
    memory: "Memory",
    storage: "Storage",
    videocard: "Video Card",
    powersupply: "Power Supply",
    case: "Case",
};

function AvailBadge({ avail }) {
    const isStock = avail === "In Stock";
    const isPreorder = avail === "Pre-order";
    const color = isStock ? T.green : isPreorder ? "#F9A825" : T.textMid;
    const bg = isStock ? "rgba(15,217,128,0.1)" : isPreorder ? "rgba(249,168,37,0.1)" : "rgba(255,255,255,0.05)";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.35rem",
            padding: "0.25rem 0.7rem", borderRadius: "999px",
            fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.05em",
            color, background: bg, border: `1px solid ${color}33`,
        }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
            {avail}
        </span>
    );
}

export default function PartDetail() {
    const { category, id } = useParams();
    const navigate = useNavigate();
    const { selectPart, selections } = useBuilder();
    const [added, setAdded] = useState(false);

    const categoryParts = sampleParts[category] || [];
    const part = categoryParts.find((p) => p.id === id);

    if (!part) {
        return (
            <div style={{
                minHeight: "60vh", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: "1rem",
                color: T.textMid, fontFamily: T.mono,
            }}>
                <span style={{ fontSize: "3rem" }}>404</span>
                <p>Part not found.</p>
                <button onClick={() => navigate(-1)} style={backBtnStyle}>← Go back</button>
            </div>
        );
    }

    const specs = COLUMNS[category] || [];
    const finalPrice = part.base - part.promo + part.shipping + part.tax;
    const retailer = RETAILER_META[part.where] || { color: T.textMid, bg: "rgba(255,255,255,0.05)" };
    const categoryLabel = CATEGORY_LABELS[category] || category;
    const isSelected = selections[category]?.id === part.id;

    const handleAdd = () => {
        selectPart(category, part);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: T.bg,
            color: T.text,
            fontFamily: T.mono,
            padding: "2rem 1rem",
        }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>

                <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem", fontSize: "0.78rem", color: T.textDim }}>
                    <button onClick={() => navigate(-1)} style={backBtnStyle}>
                        ← Back
                    </button>
                    <span>/</span>
                    <span style={{ color: T.textMid }}>{categoryLabel}</span>
                    <span>/</span>
                    <span style={{ color: T.text }}>{part.name}</span>
                </nav>

                <div style={{
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: "2rem 2.5rem",
                    marginBottom: "1.5rem",
                    position: "relative",
                    overflow: "hidden",
                }}>
                    <div style={{
                        position: "absolute", top: 0, left: 0, right: 0,
                        height: 2, background: `linear-gradient(90deg, ${T.green}, transparent)`,
                    }} />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 300px" }}>
                            <div style={{
                                fontSize: "0.68rem", letterSpacing: "0.15em", fontWeight: 700,
                                color: T.green, marginBottom: "0.5rem", textTransform: "uppercase",
                            }}>
                                {categoryLabel}
                            </div>
                            <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0 0 1rem", lineHeight: 1.25 }}>
                                {part.name}
                            </h1>
                            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                                <AvailBadge avail={part.avail} />
                                {part.mpn && (
                                    <span style={{ fontSize: "0.72rem", color: T.textDim, fontFamily: T.mono }}>
                                        MPN: {part.mpn}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div style={{
                            display: "flex", flexDirection: "column", alignItems: "flex-end",
                            gap: "0.75rem", flex: "0 0 auto",
                        }}>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "2.25rem", fontWeight: 800, color: T.green, lineHeight: 1 }}>
                                    {finalPrice > 0 ? `$${finalPrice.toFixed(2)}` : "—"}
                                </div>
                                {part.promo > 0 && (
                                    <div style={{ fontSize: "0.78rem", color: T.textDim, marginTop: "0.25rem" }}>
                                        <span style={{ textDecoration: "line-through" }}>${part.base.toFixed(2)}</span>
                                        <span style={{ color: T.green, marginLeft: "0.4rem" }}>−${part.promo.toFixed(2)} promo</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleAdd}
                                style={{
                                    padding: "0.7rem 2rem",
                                    background: isSelected ? "rgba(15,217,128,0.25)" : (added ? "rgba(15,217,128,0.15)" : T.green),
                                    color: (isSelected || added) ? T.green : "#000",
                                    border: (isSelected || added) ? `1px solid ${T.green}` : "none",
                                    borderRadius: 8,
                                    fontSize: "0.9rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontFamily: T.mono,
                                    letterSpacing: "0.05em",
                                    transition: "all 0.2s",
                                    minWidth: 140,
                                }}
                            >
                                {isSelected ? "✓ Selected" : (added ? "✓ Added" : "Add to Build")}
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}>

                    <div style={{
                        background: T.card, border: `1px solid ${T.border}`,
                        borderRadius: 12, overflow: "hidden",
                    }}>
                        <div style={{
                            padding: "1rem 1.5rem",
                            borderBottom: `1px solid ${T.border}`,
                            fontSize: "0.68rem", letterSpacing: "0.12em",
                            fontWeight: 700, color: T.textDim, textTransform: "uppercase",
                        }}>
                            Specifications
                        </div>
                        <div>
                            {specs.map((spec, i) => {
                                const val = part[spec.key];
                                return (
                                    <div
                                        key={spec.key}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "180px 1fr",
                                            padding: "0.85rem 1.5rem",
                                            borderBottom: i < specs.length - 1 ? `1px solid ${T.border}` : "none",
                                            background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                                        }}
                                    >
                                        <div style={{ fontSize: "0.78rem", color: T.textDim, fontWeight: 600, letterSpacing: "0.04em" }}>
                                            {spec.label}
                                        </div>
                                        <div style={{ fontSize: "0.88rem", color: val ? T.text : T.textDim }}>
                                            {val || "—"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                        <div style={{
                            background: T.card, border: `1px solid ${T.border}`,
                            borderRadius: 12, overflow: "hidden",
                        }}>
                            <div style={{
                                padding: "1rem 1.5rem",
                                borderBottom: `1px solid ${T.border}`,
                                fontSize: "0.68rem", letterSpacing: "0.12em",
                                fontWeight: 700, color: T.textDim, textTransform: "uppercase",
                            }}>
                                Price Breakdown
                            </div>
                            <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                {[
                                    { label: "Base Price", value: part.base, always: true },
                                    { label: "Promo / Coupon", value: -part.promo, always: false },
                                    { label: "Shipping", value: part.shipping, always: true },
                                    { label: "Tax", value: part.tax, always: false },
                                ].map(row => {
                                    if (!row.always && row.value === 0) return null;
                                    const isDiscount = row.value < 0;
                                    return (
                                        <div key={row.label} style={{
                                            display: "flex", justifyContent: "space-between",
                                            fontSize: "0.85rem",
                                        }}>
                                            <span style={{ color: T.textMid }}>{row.label}</span>
                                            <span style={{ color: isDiscount ? T.green : row.value === 0 ? T.textDim : T.text, fontWeight: isDiscount ? 600 : 400 }}>
                                                {row.value === 0
                                                    ? (row.label === "Shipping" ? "Free" : "—")
                                                    : `${isDiscount ? "−" : "+"}$${Math.abs(row.value).toFixed(2)}`}
                                            </span>
                                        </div>
                                    );
                                })}
                                <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "0.6rem", marginTop: "0.2rem", display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Total</span>
                                    <span style={{ fontWeight: 800, fontSize: "1.05rem", color: T.green }}>
                                        {finalPrice > 0 ? `$${finalPrice.toFixed(2)}` : "—"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: T.card, border: `1px solid ${T.border}`,
                            borderRadius: 12, overflow: "hidden",
                        }}>
                            <div style={{
                                padding: "1rem 1.5rem",
                                borderBottom: `1px solid ${T.border}`,
                                fontSize: "0.68rem", letterSpacing: "0.12em",
                                fontWeight: 700, color: T.textDim, textTransform: "uppercase",
                            }}>
                                Where to Buy | Merchants
                            </div>
                            <div style={{ padding: "1rem 1.5rem" }}>
                                <div style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    background: retailer.bg,
                                    border: `1px solid ${retailer.color}33`,
                                    borderRadius: 8, padding: "0.85rem 1rem",
                                    marginBottom: "0.75rem",
                                }}>
                                    <div>
                                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: retailer.color }}>{part.where}</div>
                                        <div style={{ fontSize: "0.75rem", color: T.textDim, marginTop: "0.15rem" }}>Best available price</div>
                                    </div>
                                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: T.green }}>
                                        {finalPrice > 0 ? `$${finalPrice.toFixed(2)}` : "—"}
                                    </div>
                                </div>

                                <a
                                    href="#"
                                    style={{
                                        display: "block", textAlign: "center",
                                        padding: "0.65rem", borderRadius: 8,
                                        background: T.greenDim, color: T.green,
                                        border: `1px solid ${T.green}44`,
                                        fontSize: "0.82rem", fontWeight: 600,
                                        textDecoration: "none", letterSpacing: "0.05em",
                                        transition: "all 0.2s",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = T.greenGlow;
                                        e.currentTarget.style.borderColor = T.green;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = T.greenDim;
                                        e.currentTarget.style.borderColor = `${T.green}44`;
                                    }}
                                >
                                    View on {part.where} →
                                </a>
                            </div>
                        </div>

                        <div style={{
                            background: "rgba(15,217,128,0.04)",
                            border: `1px solid ${T.green}22`,
                            borderRadius: 12, padding: "1rem 1.25rem",
                            fontSize: "0.78rem", color: T.textDim, lineHeight: 1.6,
                        }}>
                            <span style={{ color: T.green, fontWeight: 700 }}>ℹ Note: </span>
                            Prices and availability are updated periodically and may vary. Always confirm final price at checkout.
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

const backBtnStyle = {
    background: "transparent",
    border: "none",
    color: "rgba(240,240,242,0.5)",
    cursor: "pointer",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.78rem",
    padding: 0,
    transition: "color 0.15s",
};
