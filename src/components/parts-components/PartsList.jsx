import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Searchbar from "../Searchbar";
import PartsFilter from "./PartsFilter";
import { sampleParts } from "../../data/partsLoader";
import { useBuilder } from "../../context/BuilderContext";

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
        { key: "socket", label: "Socket / CPU" },
        { key: "formFactor", label: "Form Factor" },
        { key: "memoryMax", label: "Memory Max" },
        { key: "memorySlots", label: "Memory Slots" },
        { key: "color", label: "Color" },
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

// Sample parts data moved to src/data/partsData.js and imported at the top of this file

export default function PartsList({ partType }) {
    const navigate = useNavigate();
    const { selectPart, selections } = useBuilder();
    const [parts, setParts] = useState([]);
    const [filteredParts, setFilteredParts] = useState([]);
    const [addedParts, setAddedParts] = useState({});
    const [activeFilters, setActiveFilters] = useState({
        manufacturers: [],
        speeds: [],
        modules: [],
        cores: [],
        colors: [],
    });

    useEffect(() => {
        // Load parts for this category
        console.log('PartsList - partType:', partType);
        console.log('PartsList - sampleParts keys:', Object.keys(sampleParts));
        console.log('PartsList - sampleParts[partType]:', sampleParts[partType]);
        const categoryParts = sampleParts[partType] || [];
        console.log('PartsList - categoryParts length:', categoryParts.length);
        setParts(categoryParts);
        setFilteredParts(categoryParts);
    }, [partType]);

    const handleFilterChange = (filters) => {
        setActiveFilters(filters);

        // Apply filters
        let filtered = [...parts];

        // Filter by manufacturer (if any selected)
        if (filters.manufacturers.length > 0) {
            filtered = filtered.filter(part => {
                const partManufacturer = part.name.split(' ')[0].toLowerCase();
                return filters.manufacturers.some(m => partManufacturer.includes(m));
            });
        }

        // Filter by speed (if any selected)
        if (filters.speeds.length > 0) {
            filtered = filtered.filter(part => {
                return filters.speeds.some(s => part.speed?.toLowerCase().includes(s.replace('ddr5-', '')));
            });
        }

        // Filter by modules (if any selected)
        if (filters.modules.length > 0) {
            filtered = filtered.filter(part => {
                const partModules = part.modules?.toLowerCase().replace(/\s+/g, '');
                return filters.modules.some(m => {
                    const filterModules = m.toLowerCase().replace(/\s+/g, '').replace('x', '');
                    const partModulesNorm = partModules?.replace('x', '');
                    return partModulesNorm === filterModules;
                });
            });
        }

        // Filter by cores (if any selected)
        if (filters.cores.length > 0) {
            filtered = filtered.filter(part => {
                return filters.cores.some(c => part.cores?.toString() === c);
            });
        }

        // Filter by color (if any selected)
        if (filters.colors.length > 0) {
            filtered = filtered.filter(part => {
                if (!part.color) return false;
                const partColor = part.color.toLowerCase().replace(/\s+/g, '').replace(/\//g, '');
                return filters.colors.some(c => {
                    const filterColor = c.toLowerCase().replace(/-/g, '').replace(/\//g, '');
                    return partColor.includes(filterColor) || filterColor.includes(partColor);
                });
            });
        }

        setFilteredParts(filtered);
    };

    if (parts.length === 0) {
        return (
            <div style={{ padding: "3rem", textAlign: "center", color: T.textMid }}>
                <p>No parts available for this category yet.</p>
            </div>
        );
    }

    return (
        <div style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "1rem 1rem",
        }}>
            {/* Header */}
            <div style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "1rem"
            }}>
                <h2 style={{ marginBottom: "0.5rem" }}>
                    {filteredParts.length} Compatible Products
                </h2>
                <Searchbar partType={partType} />
                <div style={{
                    borderBottom: "1px solid rgba(255,255,255,0.65)",
                    marginBottom: "1rem",
                    marginTop: "1rem"
                }} />
            </div>

            {/* Two-column layout: Filters + Products */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "280px 1fr",
                gap: "1.5rem",
            }}>
                {/* Left: Filters */}
                <div>
                    <PartsFilter partType={partType} onFilterChange={handleFilterChange} />
                </div>

                {/* Right: Products */}
                <div style={{ overflowX: "auto" }}>
                    {(() => {
                        const cols = COLUMNS[partType] || [];
                        const templateColumns = `1fr ${cols.map(() => "100px").join(" ")} 90px 110px`;

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
                                    color: "#fff",
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
                                    {filteredParts.map(part => {
                                        const finalPrice = part.base - part.promo + part.shipping + part.tax;
                                        const isSelected = selections[partType]?.id === part.id;
                                        const isAdded = addedParts[part.id];

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
                                                onClick={() => navigate(`/parts/${partType}/${part.id}`)}
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
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            selectPart(partType, part);
                                                            setAddedParts(prev => ({ ...prev, [part.id]: true }));
                                                            setTimeout(() => {
                                                                navigate('/manual');
                                                            }, 800);
                                                        }}
                                                        style={{
                                                            padding: "0.5rem 1rem",
                                                            background: isSelected ? "rgba(15,217,128,0.25)" : (isAdded ? "rgba(15,217,128,0.15)" : T.green),
                                                            color: (isSelected || isAdded) ? T.green : "#000",
                                                            border: (isSelected || isAdded) ? `1px solid ${T.green}` : "none",
                                                            borderRadius: "6px",
                                                            fontSize: "0.8rem",
                                                            fontWeight: 600,
                                                            cursor: "pointer",
                                                            whiteSpace: "nowrap",
                                                            transition: "all 0.2s",
                                                        }}
                                                    >
                                                        {isSelected ? "✓ Selected" : (isAdded ? "✓ Added" : "Add")}
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
        </div>
    );
}
