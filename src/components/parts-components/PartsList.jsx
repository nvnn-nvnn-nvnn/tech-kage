import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Searchbar from "../Searchbar";
import PartsFilter from "./PartsFilter";
import { getSampleParts } from "../../data/partsLoader";
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
        { key: "cooling_type", label: "COOLING TYPE", align: "center" },
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

export default function PartsList({ partType }) {
    const navigate = useNavigate();
    const { selectPart, selections } = useBuilder();
    const [parts, setParts] = useState([]);
    const [filteredParts, setFilteredParts] = useState([]);
    const [addedParts, setAddedParts] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState({
        manufacturers: [], speeds: [], modules: [], colors: [],
        cores: [], series: [], microarchitecture: [], socket: [],
        integrated_graphics: [], smt: [], ecc_support: [], includes_cooler: [],
        form_factor: [], memory_type: [], wireless_networking: [],
        chipset: [], type: [], capacity: [],
        wattage: [], efficiency: [], modular: [],
        cooling_type: [], size: [], color: [], side_panel: [],
    });
    const [searchQuery, setSearchQuery] = useState("");

    // Low to high 
    const [sortOrder, setSortOrder] = useState("desc");



    // const descendingOrder = () => {
    //     setSortOrder("desc");
    // };

    // const ascendingOrder = () => {
    //     setSortOrder("asc");
    // };


    const getFinalPrice = (part) => {
        return part.base - part.promo + part.shipping + part.tax;
    };

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        const loadParts = async () => {
            const allParts = await getSampleParts();
            const categoryParts = allParts[partType] || [];
            setParts(categoryParts);
            setFilteredParts(categoryParts);
        };
        loadParts();
    }, [partType]);

    const applyFilters = (filters, query) => {
        let filtered = [...parts];

        if (query) {
            filtered = filtered.filter(part =>
                part.name.toLowerCase().includes(query.toLowerCase())
            );
        }
        if (filters.manufacturers?.length > 0) {
            filtered = filtered.filter(part => {
                const partManufacturer = part.name.split(' ')[0].toLowerCase();
                return filters.manufacturers.some(m => partManufacturer.includes(m));
            });
        }
        if (filters.speeds?.length > 0) {
            filtered = filtered.filter(part => {
                const partSpeed = Array.isArray(part.speed) ? part.speed[1] : part.speed;
                return filters.speeds.some(s => {
                    const filterSpeed = s.replace('ddr5-', '').replace('+', '');
                    return partSpeed?.toString().includes(filterSpeed);
                });
            });
        }
        if (filters.modules?.length > 0) {
            filtered = filtered.filter(part => {
                if (Array.isArray(part.modules)) {
                    const partModulesStr = `${part.modules[0]}x${part.modules[1]}gb`;
                    return filters.modules.some(m => {
                        const filterModules = m.toLowerCase().replace(/\s+/g, '').replace('×', 'x');
                        return partModulesStr === filterModules;
                    });
                }
                return false;
            });
        }
        if (filters.cores?.length > 0) {
            filtered = filtered.filter(part =>
                filters.cores.some(c => part.cores?.toString() === c)
            );
        }
        if (filters.colors?.length > 0) {
            filtered = filtered.filter(part => {
                if (!part.color) return false;
                const partColor = part.color.toLowerCase().replace(/\s+/g, '').replace(/\//g, '');
                return filters.colors.some(c => {
                    const filterColor = c.toLowerCase().replace(/-/g, '').replace(/\//g, '');
                    return partColor.includes(filterColor) || filterColor.includes(partColor);
                });
            });
        }
        if (filters.series?.length > 0) {
            filtered = filtered.filter(part => {
                const ser = (part.series || part.cpu_series || '').toLowerCase();
                return filters.series.some(s => ser.includes(s.toLowerCase()));
            });
        }
        if (filters.microarchitecture?.length > 0) {
            filtered = filtered.filter(part => {
                const arch = (part.microarchitecture || part.architecture || '').toLowerCase();
                return filters.microarchitecture.some(a => arch.includes(a.toLowerCase()));
            });
        }
        if (filters.socket?.length > 0) {
            filtered = filtered.filter(part => {
                const sock = (part.socket || '').toLowerCase();
                return filters.socket.some(s => sock === s.toLowerCase() || sock.includes(s.toLowerCase()));
            });
        }
        if (filters.chipset?.length > 0) {
            filtered = filtered.filter(part => {
                const chip = (part.chipset || part.gpu_chipset || part.gpu || part.name || '').toLowerCase();
                return filters.chipset.some(c => chip.includes(c.toLowerCase()));
            });
        }
        if (filters.type?.length > 0) {
            filtered = filtered.filter(part => {
                const t = (part.type || part.drive_type || '').toLowerCase();
                return filters.type.some(ty => t.includes(ty.toLowerCase()));
            });
        }
        if (filters.capacity?.length > 0) {
            filtered = filtered.filter(part => {
                const cap = String(part.capacity || '').toLowerCase().replace(/\s+/g, '');
                return filters.capacity.some(c => cap.includes(c.toLowerCase().replace(/\s+/g, '')));
            });
        }
        if (filters.wattage?.length > 0) {
            filtered = filtered.filter(part => {
                const w = String(part.wattage || '').toLowerCase().replace(/\s+/g, '');
                return filters.wattage.some(wa => w.includes(wa.toLowerCase().replace(/\s+/g, '')));
            });
        }
        if (filters.efficiency?.length > 0) {
            filtered = filtered.filter(part => {
                const eff = (part.efficiency || part.certification || '').toLowerCase();
                return filters.efficiency.some(e => eff.includes(e.toLowerCase()));
            });
        }
        if (filters.modular?.length > 0) {
            filtered = filtered.filter(part => {
                const mod = (part.modular || '').toLowerCase();
                return filters.modular.some(m => mod.includes(m.toLowerCase()));
            });
        }
        if (filters.side_panel?.length > 0) {
            filtered = filtered.filter(part => {
                const panel = (part.side_panel || part.sidePanel || '').toLowerCase();
                return filters.side_panel.some(sp => panel.includes(sp.toLowerCase()));
            });
        }
        if (filters.color?.length > 0) {
            filtered = filtered.filter(part => {
                const partColor = (part.color || '').toLowerCase();
                return filters.color.some(c => partColor.includes(c.toLowerCase()));
            });
        }
        if (filters.cooling_type?.length > 0) {
            filtered = filtered.filter(part => {
                const coolingType = (part.cooling_type || part.coolingType || part.type || '').toLowerCase();
                return filters.cooling_type.some(ct => coolingType.includes(ct.toLowerCase()));
            });
        }
        if (filters.size?.length > 0) {
            filtered = filtered.filter(part => {
                const size = (part.radiatorSize || part.radiator_size || part.size || '').toLowerCase();
                return filters.size.some(s => size.includes(s.toLowerCase()));
            });
        }

        setFilteredParts(filtered);
    };

    const handleFilterChange = (filters) => {
        setActiveFilters(filters);
        applyFilters(filters, searchQuery);
    };

    // Sort by price
    const sortedParts = [...filteredParts].sort((a, b) => {
        if (sortOrder === "asc") return getFinalPrice(a) - getFinalPrice(b);
        return getFinalPrice(b) - getFinalPrice(a);
    });



    const handleSearchChange = (query) => {
        setSearchQuery(query);
        applyFilters(activeFilters, query);
    };

    if (parts.length === 0) {
        return (
            <div style={{ padding: "3rem", textAlign: "center", color: T.textMid }}>
                <p>No parts available for this category yet.</p>
            </div>
        );
    }

    const cols = COLUMNS[partType] || [];

    return (
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: isMobile ? "0.75rem" : "1rem" }}>

            {/* ── Header ── */}
            <div style={{ marginBottom: "1rem" }}>
                <h2 style={{ fontSize: isMobile ? "1rem" : "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>
                    {filteredParts.length} Compatible Products
                </h2>
                <Searchbar partType={partType} searchQuery={searchQuery} setSearchQuery={handleSearchChange} />
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.65)", marginBottom: "1rem", marginTop: "1rem" }} />
            </div>

            {/* ── Mobile: Filter toggle button ── */}
            {isMobile && (
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={{
                        width: "100%",
                        padding: "0.65rem 1rem",
                        marginBottom: "0.75rem",
                        background: showFilters ? "rgba(15,217,128,0.12)" : T.card,
                        border: `1px solid ${showFilters ? T.green : T.border}`,
                        borderRadius: "8px",
                        color: showFilters ? T.green : T.textMid,
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        fontFamily: T.mono,
                        letterSpacing: "0.08em",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "all 0.2s",
                    }}
                >
                    <span>⚙ FILTERS</span>
                    <span>{showFilters ? "▲ Hide" : "▼ Show"}</span>
                </button>
            )}

            {/* ── Layout ── */}
            <div style={{
                display: isMobile ? "block" : "grid",
                gridTemplateColumns: isMobile ? undefined : "280px 1fr",
                gap: "1.5rem",
            }}>
                {/* Filters — always visible on desktop, toggleable on mobile */}
                <div style={{
                    display: isMobile && !showFilters ? "none" : "block",
                    marginBottom: isMobile ? "1rem" : 0,
                }}>
                    <PartsFilter partType={partType} onFilterChange={handleFilterChange} sortOrder={sortOrder} onSortChange={setSortOrder} />
                </div>

                {/* ── Products ── */}
                <div style={{ overflowX: isMobile ? "hidden" : "auto" }}>

                    {/* Desktop table header */}
                    {!isMobile && (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: `50px 1fr ${cols.map(() => "100px").join(" ")} 90px 110px`,
                            padding: "0.7rem 1.25rem",
                            background: "rgba(15,217,128,0.06)",
                            borderBottom: `1px solid ${T.border}`,
                            fontSize: "0.68rem",
                            letterSpacing: "0.12em",
                            color: "#fff",
                            fontWeight: 600,
                        }}>
                            <div></div>
                            <div>NAME</div>
                            {cols.map(col => (
                                <div key={col.key} style={{ textAlign: col.align }}>{col.label}</div>
                            ))}
                            {/* Price column with sort indicator */}
                            <div style={{ textAlign: "right", cursor: "pointer" }}
                                onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}

                            > PRICE {sortOrder === "desc" ? "↓" : "↑"}
                            </div>
                            <div style={{ textAlign: "right" }}>ACTION</div>
                        </div>
                    )}

                    {/* Rows */}
                    <div style={{ display: "grid", gap: "0.5rem", marginTop: isMobile ? 0 : "0.5rem" }}>
                        {sortedParts.map(part => {
                            const finalPrice = part.base - part.promo + part.shipping + part.tax;
                            const isSelected = selections[partType]?.id === part.id;
                            const isAdded = addedParts[part.id];

                            // ── Mobile card ──
                            if (isMobile) {
                                return (
                                    <div
                                        key={part.id}
                                        style={{
                                            background: T.card,
                                            border: `1px solid ${isSelected ? T.green : T.border}`,
                                            borderRadius: "10px",
                                            padding: "0.85rem 1rem",
                                            cursor: "pointer",
                                            transition: "border-color 0.2s",
                                        }}
                                        onClick={() => navigate(`/parts/${partType}/${part.id}`)}
                                    >
                                        {/* Image + Name + price row */}
                                        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
                                            {/* Product Image */}
                                            <div style={{ width: 50, height: 50, borderRadius: "6px", overflow: "hidden", background: "rgba(255,255,255,0.05)", flexShrink: 0 }}>
                                                {part.image ? (
                                                    <img src={part.image} alt={part.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                ) : (
                                                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: T.textDim, fontSize: "0.55rem" }}>N/A</div>
                                                )}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.25rem" }}>{part.name}</div>
                                                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: T.green }}>${finalPrice.toFixed(2)}</div>
                                            </div>
                                        </div>

                                        {/* Spec pills — show first 3 cols only on mobile */}
                                        {cols.length > 0 && (
                                            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.6rem" }}>
                                                {cols.slice(0, 3).map(col => (
                                                    part[col.key] != null && (
                                                        <span key={col.key} style={{
                                                            fontSize: "0.65rem", color: T.textDim,
                                                            background: "rgba(255,255,255,0.04)",
                                                            border: `1px solid ${T.border}`,
                                                            borderRadius: "4px", padding: "2px 6px",
                                                        }}>
                                                            {col.label}: {part[col.key]}
                                                        </span>
                                                    )
                                                ))}
                                            </div>
                                        )}

                                        {/* Add button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                selectPart(partType, part);
                                                setAddedParts(prev => ({ ...prev, [part.id]: true }));
                                                setTimeout(() => navigate('/manual'), 800);
                                            }}
                                            style={{
                                                width: "100%",
                                                padding: "0.5rem",
                                                background: isSelected ? "rgba(15,217,128,0.25)" : (isAdded ? "rgba(15,217,128,0.15)" : T.green),
                                                color: (isSelected || isAdded) ? T.green : "#000",
                                                border: (isSelected || isAdded) ? `1px solid ${T.green}` : "none",
                                                borderRadius: "6px",
                                                fontSize: "0.8rem",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                fontFamily: T.mono,
                                                transition: "all 0.2s",
                                            }}
                                        >
                                            {isSelected ? "✓ Selected" : (isAdded ? "✓ Added" : "Add to Build")}
                                        </button>
                                    </div>
                                );
                            }

                            // ── Desktop row ──
                            return (
                                <div
                                    key={part.id}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: `50px 1fr ${cols.map(() => "100px").join(" ")} 90px 110px`,
                                        alignItems: "center",
                                        background: T.card,
                                        border: `1px solid ${T.border}`,
                                        borderRadius: "8px",
                                        padding: "1rem 1.25rem",
                                        transition: "all 0.2s",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => navigate(`/parts/${partType}/${part.id}`)}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.green; e.currentTarget.style.transform = "translateY(-2px)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "translateY(0)"; }}
                                >
                                    {/* Product Image */}
                                    <div style={{ width: 40, height: 40, borderRadius: "6px", overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
                                        {part.image ? (
                                            <img src={part.image} alt={part.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: T.textDim, fontSize: "0.6rem" }}>N/A</div>
                                        )}
                                    </div>
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
                                                setTimeout(() => navigate('/manual'), 800);
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
                </div>
            </div>
        </div>
    );
}