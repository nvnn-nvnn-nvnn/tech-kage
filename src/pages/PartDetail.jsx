import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSampleParts } from "../data/partsLoader";
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
        { key: "part_number", label: "Part #" },
        { key: "series", label: "Series" },
        { key: "microarchitecture", label: "Microarchitecture" },
        { key: "core_family", label: "Core Family" },
        { key: "socket", label: "Socket" },
        { key: "core_count", label: "Core Count" },
        { key: "thread_count", label: "Thread Count" },
        { key: "performance_core_clock", label: "Performance Core Clock" },
        { key: "performance_boost_clock", label: "Performance Core Boost Clock" },
        { key: "l2_cache", label: "L2 Cache" },
        { key: "l3_cache", label: "L3 Cache" },
        { key: "tdp", label: "TDP" },
        { key: "integrated_graphics", label: "Integrated Graphics" },
        { key: "max_memory", label: "Maximum Supported Memory" },
        { key: "ecc_support", label: "ECC Support" },
        { key: "includes_cooler", label: "Includes Cooler" },
        { key: "packaging", label: "Packaging" },
        { key: "lithography", label: "Lithography" },
        { key: "smt", label: "Simultaneous Multithreading" },
    ],
    "cpu-cooler": [
        { key: "manufacturer", label: "Manufacturer" },
        { key: "model", label: "Model" },
        { key: "part_number", label: "Part #" },
        { key: "rpm", label: "Fan RPM" },
        { key: "noise_level", label: "Noise Level" },
        { key: "color", label: "Color" },
        { key: "height", label: "Height" },
        { key: "cpu_socket", label: "CPU Socket" },
        { key: "water_cooled", label: "Water Cooled" },
        { key: "fanless", label: "Fanless" },
        { key: "fanCount", label: "Fan Count" },
        { key: "fanSize", label: "Fan Size" },
        { key: "tdp", label: "TDP" },
        { key: "radiatorSize", label: "Radiator Size" },
    ],
    memory: [
        { key: "manufacturer", label: "Manufacturer" },
        { key: "part_number", label: "Part #" },
        { key: "speed", label: "Speed" },
        { key: "form_factor", label: "Form Factor" },
        { key: "modules", label: "Modules" },
        { key: "price_per_gb", label: "Price / GB" },
        { key: "color", label: "Color" },
        { key: "first_word_latency", label: "First Word Latency" },
        { key: "cas_latency", label: "CAS Latency" },
        { key: "voltage", label: "Voltage" },
        { key: "ecc_registered", label: "ECC / Registered" },
        { key: "heat_spreader", label: "Heat Spreader" },
    ],
    motherboard: [
        { key: "manufacturer", label: "Manufacturer" },
        { key: "part_number", label: "Part #" },
        { key: "socket", label: "Socket / CPU" },
        { key: "form_factor", label: "Form Factor" },
        { key: "chipset", label: "Chipset" },
        { key: "max_memory", label: "Memory Max" },
        { key: "memory_type", label: "Memory Type" },
        { key: "memory_slots", label: "Memory Slots" },
        { key: "memory_speed", label: "Memory Speed" },
        { key: "color", label: "Color" },
        { key: "pcie_x16_slots", label: "PCIe x16 Slots" },
        { key: "pcie_x1_slots", label: "PCIe x1 Slots" },
        { key: "m2_slots", label: "M.2 Slots" },
        { key: "sata_6_ports", label: "SATA 6.0 Gb/s Ports" },
        { key: "onboard_ethernet", label: "Onboard Ethernet" },
        { key: "onboard_video", label: "Onboard Video" },
        { key: "usb_20_headers", label: "USB 2.0 Headers" },
        { key: "usb_32_gen1_headers", label: "USB 3.2 Gen 1 Headers" },
        { key: "usb_32_gen2_headers", label: "USB 3.2 Gen 2 Headers" },
        { key: "supports_ecc", label: "Supports ECC" },
        { key: "wireless_networking", label: "Wireless Networking" },
        { key: "raid_support", label: "RAID Support" },
        { key: "back_connect_connectors", label: "Uses Back-Connect Connectors" },
    ],
    storage: [
        { key: "manufacturer", label: "Manufacturer" },
        { key: "part_number", label: "Part #" },
        { key: "capacity", label: "Capacity" },
        { key: "price_per_gb", label: "Price / GB" },
        { key: "type", label: "Type" },
        { key: "form_factor", label: "Form Factor" },
        { key: "interface", label: "Interface" },
        { key: "nvme", label: "NVMe" },
        { key: "read_speed", label: "Read Speed" },
        { key: "write_speed", label: "Write Speed" },
    ],
    "video-card": [
        { key: "manufacturer", label: "Manufacturer" },
        { key: "part_number", label: "Part #" },
        { key: "chipset", label: "Chipset" },
        { key: "memory", label: "Memory" },
        { key: "memory_type", label: "Memory Type" },
        { key: "core_clock", label: "Core Clock" },
        { key: "boost_clock", label: "Boost Clock" },
        { key: "effective_memory_clock", label: "Effective Memory Clock" },
        { key: "interface", label: "Interface" },
        { key: "color", label: "Color" },
        { key: "frame_sync", label: "Frame Sync" },
        { key: "length", label: "Length" },
        { key: "tdp", label: "TDP" },
        { key: "case_expansion_slot_width", label: "Case Expansion Slot Width" },
        { key: "total_slot_width", label: "Total Slot Width" },
        { key: "cooling", label: "Cooling" },
        { key: "external_power", label: "External Power" },
        { key: "displayport_outputs", label: "DisplayPort Outputs" },
        { key: "hdmi_outputs", label: "HDMI Outputs" },
    ],
    powersupply: [
        { key: "manufacturer", label: "Manufacturer" },
        { key: "part_number", label: "Part #" },
        { key: "type", label: "Type" },
        { key: "efficiency", label: "Efficiency Rating" },
        { key: "wattage", label: "Wattage" },
        { key: "length", label: "Length" },
        { key: "modular", label: "Modular" },
        { key: "color", label: "Color" },
        { key: "fanless", label: "Fanless" },
        { key: "fan_size", label: "Fan Size" },
        { key: "atx_4pin_connectors", label: "ATX 4-pin Connectors" },
        { key: "eps_8pin_connectors", label: "EPS 8-pin Connectors" },
        { key: "pcie_16pin_12vhpwr_connectors", label: "PCIe 16-pin 12VHPWR Connectors" },
        { key: "pcie_12pin_connectors", label: "PCIe 12-pin Connectors" },
        { key: "pcie_8pin_connectors", label: "PCIe 8-pin Connectors" },
        { key: "pcie_6plus2pin_connectors", label: "PCIe 6+2-pin Connectors" },
        { key: "pcie_6pin_connectors", label: "PCIe 6-pin Connectors" },
        { key: "sata_connectors", label: "SATA Connectors" },
        { key: "amp_molex_4pin_connectors", label: "AMP/Molex 4-pin Connectors" },
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
    "video-card": "Video Card",
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
    const [part, setPart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        const loadPart = async () => {
            const allParts = await getSampleParts();
            const categoryParts = allParts[category] || [];
            const foundPart = categoryParts.find((p) => p.id === id);
            setPart(foundPart);
            setLoading(false);
        };
        loadPart();
    }, [category, id]);

    if (loading) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: T.textMid, fontFamily: T.mono }}>
                <span style={{ fontSize: "1.5rem" }}>Loading...</span>
            </div>
        );
    }

    if (!part) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", color: T.textMid, fontFamily: T.mono }}>
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
            padding: isMobile ? "1rem 0.75rem" : "2rem 1rem",
        }}>
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>

                {/* ── Breadcrumb ── */}
                <nav style={{
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    marginBottom: isMobile ? "1rem" : "2rem",
                    fontSize: isMobile ? "0.7rem" : "0.78rem",
                    color: T.textDim, flexWrap: "wrap",
                }}>
                    <button onClick={() => navigate(-1)} style={backBtnStyle}>← Back</button>
                    {!isMobile && (
                        <>
                            <span>/</span>
                            <span style={{ color: T.textMid }}>{categoryLabel}</span>
                            <span>/</span>
                            <span style={{ color: T.text, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{part.name}</span>
                        </>
                    )}
                </nav>

                {/* ── Hero card ── */}
                <div style={{
                    background: T.card,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: isMobile ? "1rem" : "2rem 2.5rem",
                    marginBottom: "1.25rem",
                    position: "relative",
                    overflow: "hidden",
                }}>
                    {/* green accent bar */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${T.green}, transparent)` }} />

                    {/* Mobile: stacked layout */}
                    {isMobile ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {/* Image + name row */}
                            <div style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
                                <div style={{ width: 120, height: 120, borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`, flexShrink: 0 }}>
                                    {part.image ? (
                                        <img src={part.image} alt={part.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                    ) : (
                                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: T.textDim, fontSize: "0.65rem" }}>No Image</div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", fontWeight: 700, color: T.green, marginBottom: "0.3rem", textTransform: "uppercase" }}>
                                        {categoryLabel}
                                    </div>
                                    <h1 style={{ fontSize: "0.95rem", fontWeight: 800, margin: "0 0 0.5rem", lineHeight: 1.3 }}>
                                        {part.name}
                                    </h1>
                                    <AvailBadge avail={part.avail} />
                                </div>
                            </div>

                            {/* Price + button */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                                <div>
                                    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: T.green, lineHeight: 1 }}>
                                        {finalPrice > 0 ? `$${finalPrice.toFixed(2)}` : "—"}
                                    </div>
                                    {part.promo > 0 && (
                                        <div style={{ fontSize: "0.68rem", color: T.textDim, marginTop: "0.2rem" }}>
                                            <span style={{ textDecoration: "line-through" }}>${part.base.toFixed(2)}</span>
                                            <span style={{ color: T.green, marginLeft: "0.35rem" }}>−${part.promo.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleAdd}
                                    style={{
                                        padding: "0.6rem 1.25rem",
                                        background: isSelected ? "rgba(15,217,128,0.25)" : (added ? "rgba(15,217,128,0.15)" : T.green),
                                        color: (isSelected || added) ? T.green : "#000",
                                        border: (isSelected || added) ? `1px solid ${T.green}` : "none",
                                        borderRadius: 8, fontSize: "0.8rem", fontWeight: 700,
                                        cursor: "pointer", fontFamily: T.mono, letterSpacing: "0.05em",
                                        transition: "all 0.2s", whiteSpace: "nowrap",
                                    }}
                                >
                                    {isSelected ? "✓ Selected" : (added ? "✓ Added" : "Add to Build")}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Desktop: side by side layout */
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", flexWrap: "wrap" }}>
                            {/* Image */}
                            <div style={{ width: 240, height: 240, borderRadius: 12, overflow: "hidden", background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`, flexShrink: 0 }}>
                                {part.image ? (
                                    <img src={part.image} alt={part.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                ) : (
                                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: T.textDim, fontSize: "0.75rem" }}>No Image</div>
                                )}
                            </div>

                            {/* Name + badges */}
                            <div style={{ flex: "1 1 300px" }}>
                                <div style={{ fontSize: "0.68rem", letterSpacing: "0.15em", fontWeight: 700, color: T.green, marginBottom: "0.5rem", textTransform: "uppercase" }}>
                                    {categoryLabel}
                                </div>
                                <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0 0 1rem", lineHeight: 1.25 }}>
                                    {part.name}
                                </h1>
                                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
                                    <AvailBadge avail={part.avail} />
                                    {part.mpn && (
                                        <span style={{ fontSize: "0.72rem", color: T.textDim }}>MPN: {part.mpn}</span>
                                    )}
                                </div>
                            </div>

                            {/* Price + button */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem", flexShrink: 0 }}>
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
                                        borderRadius: 8, fontSize: "0.9rem", fontWeight: 700,
                                        cursor: "pointer", fontFamily: T.mono, letterSpacing: "0.05em",
                                        transition: "all 0.2s", minWidth: 140,
                                    }}
                                >
                                    {isSelected ? "✓ Selected" : (added ? "✓ Added" : "Add to Build")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Body: specs + sidebar ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 340px",
                    gap: "1.25rem",
                    alignItems: "start",
                }}>

                    {/* ── Specifications ── */}
                    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
                        <div style={{
                            padding: "0.85rem 1.25rem",
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
                                            // Mobile: label above value; Desktop: side by side
                                            gridTemplateColumns: isMobile ? "1fr" : "180px 1fr",
                                            padding: isMobile ? "0.65rem 1rem" : "0.85rem 1.5rem",
                                            borderBottom: i < specs.length - 1 ? `1px solid ${T.border}` : "none",
                                            background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                                            gap: isMobile ? "0.15rem" : 0,
                                        }}
                                    >
                                        <div style={{ fontSize: isMobile ? "0.65rem" : "0.78rem", color: T.textDim, fontWeight: 600, letterSpacing: "0.04em", textTransform: isMobile ? "uppercase" : "none" }}>
                                            {spec.label}
                                        </div>
                                        <div style={{ fontSize: isMobile ? "0.82rem" : "0.88rem", color: val ? T.text : T.textDim }}>
                                            {val || "—"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Sidebar: Price + Where to Buy ── */}
                    {/* On mobile this renders below specs naturally */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                        {/* Price Breakdown */}
                        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
                            <div style={{ padding: "0.85rem 1.25rem", borderBottom: `1px solid ${T.border}`, fontSize: "0.68rem", letterSpacing: "0.12em", fontWeight: 700, color: T.textDim, textTransform: "uppercase" }}>
                                Price Breakdown
                            </div>
                            <div style={{ padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                                {[
                                    { label: "Base Price", value: part.base, always: true },
                                    { label: "Promo / Coupon", value: -part.promo, always: false },
                                    { label: "Shipping", value: part.shipping, always: true },
                                    { label: "Tax", value: part.tax, always: false },
                                ].map(row => {
                                    if (!row.always && row.value === 0) return null;
                                    const isDiscount = row.value < 0;
                                    return (
                                        <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
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

                        {/* Where to Buy */}
                        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
                            <div style={{ padding: "0.85rem 1.25rem", borderBottom: `1px solid ${T.border}`, fontSize: "0.68rem", letterSpacing: "0.12em", fontWeight: 700, color: T.textDim, textTransform: "uppercase" }}>
                                Where to Buy
                            </div>
                            <div style={{ padding: "1rem 1.25rem" }}>
                                <div style={{
                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                    background: retailer.bg, border: `1px solid ${retailer.color}33`,
                                    borderRadius: 8, padding: "0.85rem 1rem", marginBottom: "0.75rem",
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
                                    href={part.asin ? `https://www.amazon.com/dp/${part.asin}` : "#"}
                                    target={part.asin ? "_blank" : "_self"}
                                    rel={part.asin ? "noopener noreferrer" : ""}
                                    style={{
                                        display: "block", textAlign: "center",
                                        padding: "0.65rem", borderRadius: 8,
                                        background: part.asin ? T.greenDim : "rgba(255,255,255,0.05)",
                                        color: part.asin ? T.green : T.textDim,
                                        border: `1px solid ${part.asin ? T.green + "44" : "rgba(255,255,255,0.1)"}`,
                                        fontSize: "0.82rem", fontWeight: 600,
                                        textDecoration: "none", letterSpacing: "0.05em",
                                        transition: "all 0.2s",
                                        cursor: part.asin ? "pointer" : "not-allowed",
                                    }}
                                    onMouseEnter={e => { if (part.asin) { e.currentTarget.style.background = T.greenGlow; e.currentTarget.style.borderColor = T.green; } }}
                                    onMouseLeave={e => { if (part.asin) { e.currentTarget.style.background = T.greenDim; e.currentTarget.style.borderColor = `${T.green}44`; } }}
                                    onClick={e => { if (!part.asin) e.preventDefault(); }}
                                >
                                    {part.asin ? `View on ${part.where} →` : "Link Unavailable"}
                                </a>
                            </div>
                        </div>

                        {/* Note */}
                        <div style={{
                            background: "rgba(15,217,128,0.04)",
                            border: `1px solid ${T.green}22`,
                            borderRadius: 12, padding: "1rem 1.25rem",
                            fontSize: "0.75rem", color: T.textDim, lineHeight: 1.6,
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