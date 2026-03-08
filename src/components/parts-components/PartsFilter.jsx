import React, { useState } from "react";

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

const FILTER_DATA = {
    memory: {
        manufacturers: [
            { name: 'Corsair', id: 'corsair', popular: true },
            { name: 'Crucial', id: 'crucial', popular: true },
            { name: 'G.Skill', id: 'gskill', popular: true },
            { name: 'Kingston', id: 'kingston', popular: true },
            { name: 'Patriot', id: 'patriot', popular: true },
            { name: 'TEAMGROUP', id: 'teamgroup', popular: false },
            { name: 'Mushkin', id: 'mushkin', popular: false },
            { name: 'ADATA', id: 'adata', popular: false },
            { name: 'Samsung', id: 'samsung', popular: false },
            { name: 'PNY', id: 'pny', popular: false },
        ],
        speeds: [
            { name: 'DDR5-4800', id: 'ddr5-4800', popular: true },
            { name: 'DDR5-5200', id: 'ddr5-5200', popular: true },
            { name: 'DDR5-5600', id: 'ddr5-5600', popular: true },
            { name: 'DDR5-6000', id: 'ddr5-6000', popular: true },
            { name: 'DDR5-6200', id: 'ddr5-6200', popular: true },
            { name: 'DDR5-6400', id: 'ddr5-6400', popular: true },
            { name: 'DDR5-6600', id: 'ddr5-6600', popular: false },
            { name: 'DDR5-6800', id: 'ddr5-6800', popular: false },
            { name: 'DDR5-7000', id: 'ddr5-7000', popular: false },
            { name: 'DDR5-7200', id: 'ddr5-7200', popular: false },
            { name: 'DDR5-7600', id: 'ddr5-7600', popular: false },
            { name: 'DDR5-8000', id: 'ddr5-8000', popular: false },
            { name: 'DDR4-3200', id: 'ddr4-3200', popular: false },
            { name: 'DDR4-3600', id: 'ddr4-3600', popular: false },
        ],
        modules: [
            { name: '2 x 8GB', id: '2x8gb', popular: true },
            { name: '2 x 16GB', id: '2x16gb', popular: true },
            { name: '2 x 24GB', id: '2x24gb', popular: true },
            { name: '2 x 32GB', id: '2x32gb', popular: true },
            { name: '2 x 48GB', id: '2x48gb', popular: true },
            { name: '4 x 16GB', id: '4x16gb', popular: false },
            { name: '4 x 24GB', id: '4x24gb', popular: false },
            { name: '4 x 32GB', id: '4x32gb', popular: false },
            { name: '4 x 48GB', id: '4x48gb', popular: false },
            { name: '2 x 64GB', id: '2x64gb', popular: false },
        ],
        colors: [
            { name: 'Black', id: 'black', popular: true },
            { name: 'White', id: 'white', popular: true },
            { name: 'Gray', id: 'gray', popular: true },
            { name: 'Black / Gray', id: 'blackgray', popular: true },
            { name: 'Black / Silver', id: 'blacksilver', popular: true },
            { name: 'White / Silver', id: 'whitesilver', popular: true },
            { name: 'White / Gray', id: 'whitegray', popular: false },
            { name: 'White / Black', id: 'whiteblack', popular: false },
            { name: 'Black / Pink', id: 'blackpink', popular: false },
            { name: 'White / Pink', id: 'whitepink', popular: false },
        ],
    },
    cpu: {
        manufacturers: [
            { name: 'AMD', id: 'amd', popular: true },
            { name: 'Intel', id: 'intel', popular: true },
        ],
        cores: [
            { name: '6 Cores', id: '6', popular: true },
            { name: '8 Cores', id: '8', popular: true },
            { name: '12 Cores', id: '12', popular: true },
            { name: '16 Cores', id: '16', popular: true },
            { name: '20+ Cores', id: '20', popular: false },
        ],
    },
};

export default function PartsFilter({ partType, onFilterChange }) {
    const [selectedFilters, setSelectedFilters] = useState({
        manufacturers: [],
        speeds: [],
        modules: [],
        cores: [],
        colors: [],
    });
    const [showAll, setShowAll] = useState({
        manufacturers: false,
        speeds: false,
        modules: false,
        cores: false,
        colors: false,
    });

    const filterConfig = FILTER_DATA[partType] || {};

    const handleFilterToggle = (category, id) => {
        setSelectedFilters(prev => {
            const current = prev[category] || [];
            const updated = current.includes(id)
                ? current.filter(item => item !== id)
                : [...current, id];

            const newFilters = { ...prev, [category]: updated };

            if (onFilterChange) {
                onFilterChange(newFilters);
            }

            return newFilters;
        });
    };

    const clearFilters = () => {
        const cleared = {
            manufacturers: [],
            speeds: [],
            modules: [],
            cores: [],
            colors: [],
        };
        setSelectedFilters(cleared);
        if (onFilterChange) {
            onFilterChange(cleared);
        }
    };

    const toggleShowAll = (category) => {
        setShowAll(prev => ({ ...prev, [category]: !prev[category] }));
    };

    const renderFilterSection = (title, category, items) => {
        if (!items || items.length === 0) return null;

        const hasUnpopular = items.some(item => item.popular === false);
        const displayItems = showAll[category]
            ? items
            : items.filter(item => item.popular !== false);

        return (
            <div style={{
                marginBottom: "1.5rem",
                paddingBottom: "1.5rem",
                borderBottom: `1px solid ${T.border}`,
            }}>
                <h3 style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    color: T.textDim,
                    marginBottom: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                }}>
                    {title}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {displayItems.map(item => (
                        <label
                            key={item.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                color: T.textMid,
                                transition: "color 0.15s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = T.text}
                            onMouseLeave={e => e.currentTarget.style.color = T.textMid}
                        >
                            <input
                                type="checkbox"
                                checked={selectedFilters[category]?.includes(item.id) || false}
                                onChange={() => handleFilterToggle(category, item.id)}
                                style={{
                                    width: "16px",
                                    height: "16px",
                                    cursor: "pointer",
                                    accentColor: T.green,
                                }}
                            />
                            {item.name}
                        </label>
                    ))}
                    {hasUnpopular && (
                        <button
                            onClick={() => toggleShowAll(category)}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: T.green,
                                fontSize: "0.75rem",
                                cursor: "pointer",
                                padding: "0.25rem 0",
                                textAlign: "left",
                                marginTop: "0.25rem",
                                transition: "opacity 0.15s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                        >
                            {showAll[category] ? "▲ Show Less" : "▼ Show More"}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div style={{
            background: T.card,
            border: `1px solid ${T.border}`,
            borderRadius: "8px",
            padding: "1.25rem",
            fontFamily: T.mono,
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
            }}>
                <h2 style={{
                    fontSize: "1rem",
                    color: T.green,
                    fontWeight: 700,
                    margin: 0,
                }}>
                    Filters
                </h2>
                <button
                    onClick={clearFilters}
                    style={{
                        background: "transparent",
                        border: `1px solid ${T.border}`,
                        borderRadius: "4px",
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.7rem",
                        color: T.textMid,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = T.green;
                        e.currentTarget.style.color = T.green;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = T.border;
                        e.currentTarget.style.color = T.textMid;
                    }}
                >
                    Clear All
                </button>
            </div>

            {renderFilterSection("Manufacturer", "manufacturers", filterConfig.manufacturers)}
            {renderFilterSection("Speed", "speeds", filterConfig.speeds)}
            {renderFilterSection("Modules", "modules", filterConfig.modules)}
            {renderFilterSection("Color", "colors", filterConfig.colors)}
            {renderFilterSection("Cores", "cores", filterConfig.cores)}
        </div>
    );
}
