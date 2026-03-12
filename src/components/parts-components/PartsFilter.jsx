import React, { useState, useEffect } from "react";

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
    cpu: {

        rating: [
            { name: "5 Stars", id: "5", popular: true },
            { name: "4 Stars & up", id: "4", popular: true },
            { name: "3 Stars & up", id: "3", popular: false },
            { name: "Unrated", id: "0", popular: false }
        ],
        cores: [
            { name: "6 Cores", id: "6", popular: true },
            { name: "8 Cores", id: "8", popular: true },
            { name: "12 Cores", id: "12", popular: true },
            { name: "16 Cores", id: "16", popular: true },
            { name: "24 Cores", id: "24", popular: false },
            { name: "32+ Cores", id: "32", popular: false }
        ],
        threads: { type: "range", unit: "", popular_values: [8, 12, 16, 24, 32] },
        performance_core_clock: { type: "range", unit: "GHz", popular_values: ["4.0", "4.5", "5.0", "5.2+"] },
        tdp: {
            type: "range",
            unit: "W",
            popular_values: [65, 105, 120, 170],
            common_options: [
                { name: "65 W", id: "65", popular: true },
                { name: "105–120 W", id: "105-120", popular: true },
                { name: "170 W+", id: "170", popular: false }
            ]
        },
        series: [
            { name: "AMD Ryzen 5", id: "ryzen 5", popular: true },
            { name: "AMD Ryzen 7", id: "ryzen 7", popular: true },
            { name: "AMD Ryzen 9", id: "ryzen 9", popular: true },
            { name: "Intel Core Ultra 7", id: "ultra 7", popular: true },
            { name: "Intel Core Ultra 9", id: "ultra 9", popular: true },
            { name: "Intel Core Ultra 5", id: "ultra 5", popular: false },
            { name: "Intel Core i5", id: "i5", popular: true },
            { name: "Intel Core i7", id: "i7", popular: true },
            { name: "Intel Core i9", id: "i9", popular: false },
            { name: "Intel Core i3", id: "i3", popular: false }
        ],
        microarchitecture: [
            { name: "Zen 5", id: "zen 5", popular: true },
            { name: "Zen 4", id: "zen 4", popular: true },
            { name: "Arrow Lake", id: "arrow lake", popular: true },
            { name: "Raptor Lake Refresh", id: "raptor lake", popular: false }
        ],
        socket: [
            { name: "AM5", id: "am5", popular: true },
            { name: "LGA 1851", id: "lga1851", popular: true },
            { name: "LGA 1700", id: "lga1700", popular: false }
        ],
        integrated_graphics: [
            { name: "None", id: "0", popular: true },
            { name: "Radeon 780M / 890M class", id: "high", popular: true },
            { name: "Intel Xe / Arc", id: "intel", popular: false }
        ],
        smt: [
            { name: "Yes", id: "1", popular: true },
            { name: "No", id: "0", popular: false }
        ],
        includes_cooler: [
            { name: "Yes", id: "1", popular: true },
            { name: "No", id: "0", popular: true }
        ]
    },

    memory: {

        manufacturers: [
            { name: 'Corsair', id: 'corsair', popular: true },
            { name: 'G.Skill', id: 'gskill', popular: true },
            { name: 'Kingston', id: 'kingston', popular: true },
            { name: 'Crucial', id: 'crucial', popular: true },
            { name: 'TEAMGROUP', id: 'teamgroup', popular: true },
            { name: 'ADATA', id: 'adata', popular: false }
        ],
        speeds: [
            { name: 'DDR5-6000', id: 'ddr5-6000', popular: true },
            { name: 'DDR5-6400', id: 'ddr5-6400', popular: true },
            { name: 'DDR5-5600', id: 'ddr5-5600', popular: true },
            { name: 'DDR5-7200+', id: 'ddr5-7200', popular: false },
            { name: 'DDR5-8000+', id: 'ddr5-8000', popular: false }
        ],
        modules: [
            { name: '2 × 16GB', id: '2x16gb', popular: true },
            { name: '2 × 32GB', id: '2x32gb', popular: true },
            { name: '2 × 24GB', id: '2x24gb', popular: true },
            { name: '2 × 48GB', id: '2x48gb', popular: false },
            { name: '4 × 16GB', id: '4x16gb', popular: false }
        ],
        colors: [
            { name: 'Black', id: 'black', popular: true },
            { name: 'White', id: 'white', popular: true },
            { name: 'RGB / Multicolor', id: 'rgb', popular: true },
            { name: 'Gray / Silver', id: 'gray', popular: false }
        ]
    },

    motherboard: {
        manufacturers: [
            { name: 'ASUS', id: 'asus', popular: true },
            { name: 'MSI', id: 'msi', popular: true },
            { name: 'Gigabyte', id: 'gigabyte', popular: true },
            { name: 'ASRock', id: 'asrock', popular: true }
        ],
        socket: [
            { name: 'AM5', id: 'am5', popular: true },
            { name: 'LGA 1851', id: 'lga1851', popular: true },
            { name: 'LGA 1700', id: 'lga1700', popular: false }
        ],
        form_factor: [
            { name: 'ATX', id: 'atx', popular: true },
            { name: 'Micro ATX', id: 'microatx', popular: true },
            { name: 'Mini ITX', id: 'miniitx', popular: false }
        ],
        memory_type: [
            { name: 'DDR5', id: 'ddr5', popular: true },
            { name: 'DDR4', id: 'ddr4', popular: false }
        ],
        memory_speed_support: { type: "range", unit: "MT/s", popular_values: [6000, 6400, 7200, 8000] },
        m2_slots: { type: "range", popular_values: [3, 4, 5] },
        pcie_x16_slots: { type: "range", popular_values: [2, 3] },
        wireless_networking: [
            { name: "Wi-Fi 7", id: "wi-fi 7", popular: true },
            { name: "Wi-Fi 6E", id: "wi-fi 6e", popular: true },
            { name: "Wi-Fi 6", id: "wi-fi 6", popular: true },
            { name: "None", id: "none", popular: false }
        ]
    },

    "video-card": {
        manufacturers: [
            { name: 'NVIDIA', id: 'nvidia', popular: true },
            { name: 'AMD', id: 'amd', popular: true },
            { name: 'MSI', id: 'msi', popular: true },
            { name: 'Sapphire', id: 'sapphire', popular: false }
        ],
        chipset: [
            { name: 'GeForce RTX 3060', id: 'rtx 3060', popular: true },
            { name: 'GeForce RTX 4060', id: 'rtx 4060', popular: true },
            { name: 'GeForce RTX 4070', id: 'rtx 4070', popular: true },
            { name: 'Radeon RX 9060 XT', id: 'rx 9060 xt', popular: true },
            { name: 'Radeon RX 9070 XT', id: 'rx 9070 xt', popular: true }
        ],
        memory: { type: "range", unit: "GB", popular_values: [12, 16, 24, 32] },
        tdp: { type: "range", unit: "W", popular_values: [250, 300, 400, "500+"] },
        length: { type: "range", unit: "mm", popular_values: [300, 320, 340, "360+"] }
    },

    storage: {
        type: [
            { name: 'SSD', id: 'ssd', popular: true },
            { name: 'HDD', id: 'hdd', popular: false }
        ],
        capacity: [
            { name: '1 TB', id: '1000', popular: true },
            { name: '2 TB', id: '2000', popular: true },
            { name: '4 TB', id: '4000', popular: true },
            { name: '8 TB+', id: '8000', popular: false }
        ],
        form_factor: [
            { name: 'M.2-2280', id: 'm2-2280', popular: true },
            { name: '2.5"', id: '2.5inch', popular: false },
            { name: '3.5"', id: '3.5inch', popular: false }
        ]
    },

    powersupply: {
        wattage: [
            { name: '650 W', id: '650', popular: true },
            { name: '750 W', id: '750', popular: true },
            { name: '850 W', id: '850', popular: true },
            { name: '1000 W', id: '1000', popular: false }
        ],
        efficiency: [
            { name: '80+ Gold', id: 'gold', popular: true },
            { name: '80+ Platinum', id: 'platinum', popular: true },
            { name: '80+ Titanium', id: 'titanium', popular: false }
        ],
        modular: [
            { name: 'Fully Modular', id: 'full', popular: true },
            { name: 'Semi-Modular', id: 'semi', popular: false },
            { name: 'Non-Modular', id: 'false', popular: false }
        ]
    },

    "cpu-cooler": {
        cooling_type: [
            { name: 'Air', id: 'air', popular: true },
            { name: 'Liquid (All)', id: 'liquid', popular: true }
        ],
        size: [
            { name: '240mm Radiator', id: '240', popular: true },
            { name: '360mm Radiator', id: '360', popular: true },
            { name: '280mm Radiator', id: '280', popular: false },
            { name: '420mm Radiator', id: '420', popular: false }
        ],
        tdp: { type: "range", unit: "W", popular_values: [200, 250, "300+"] },
        color: [
            { name: 'Black', id: 'black', popular: true },
            { name: 'White', id: 'white', popular: true },
            { name: 'RGB', id: 'rgb', popular: true }
        ]
    },

    case: {
        type: [
            { name: 'Mid Tower', id: 'mid tower', popular: true },
            { name: 'Full Tower', id: 'full tower', popular: false },
            { name: 'Mini ITX', id: 'mini', popular: false }
        ],
        color: [
            { name: 'Black', id: 'black', popular: true },
            { name: 'White', id: 'white', popular: true }
        ],
        side_panel: [
            { name: 'Tempered Glass', id: 'tempered glass', popular: true },
            { name: 'Solid', id: 'solid', popular: false }
        ]
    }
};



// Legacy

// const FILTER_DATA = {
//     memory: {
//         manufacturers: [
//             { name: 'Corsair', id: 'corsair', popular: true },
//             { name: 'Crucial', id: 'crucial', popular: true },
//             { name: 'G.Skill', id: 'gskill', popular: true },
//             { name: 'Kingston', id: 'kingston', popular: true },
//             { name: 'Patriot', id: 'patriot', popular: true },
//             { name: 'TEAMGROUP', id: 'teamgroup', popular: false },
//             { name: 'Mushkin', id: 'mushkin', popular: false },
//             { name: 'ADATA', id: 'adata', popular: false },
//             { name: 'Samsung', id: 'samsung', popular: false },
//             { name: 'PNY', id: 'pny', popular: false },
//         ],
//         speeds: [
//             { name: 'DDR5-4800', id: 'ddr5-4800', popular: true },
//             { name: 'DDR5-5200', id: 'ddr5-5200', popular: true },
//             { name: 'DDR5-5600', id: 'ddr5-5600', popular: true },
//             { name: 'DDR5-6000', id: 'ddr5-6000', popular: true },
//             { name: 'DDR5-6200', id: 'ddr5-6200', popular: true },
//             { name: 'DDR5-6400', id: 'ddr5-6400', popular: true },
//             { name: 'DDR5-6600', id: 'ddr5-6600', popular: false },
//             { name: 'DDR5-6800', id: 'ddr5-6800', popular: false },
//             { name: 'DDR5-7000', id: 'ddr5-7000', popular: false },
//             { name: 'DDR5-7200', id: 'ddr5-7200', popular: false },
//             { name: 'DDR5-7600', id: 'ddr5-7600', popular: false },
//             { name: 'DDR5-8000', id: 'ddr5-8000', popular: false },
//             { name: 'DDR4-3200', id: 'ddr4-3200', popular: false },
//             { name: 'DDR4-3600', id: 'ddr4-3600', popular: false },
//         ],
//         modules: [
//             { name: '2 x 8GB', id: '2x8gb', popular: true },
//             { name: '2 x 16GB', id: '2x16gb', popular: true },
//             { name: '2 x 24GB', id: '2x24gb', popular: true },
//             { name: '2 x 32GB', id: '2x32gb', popular: true },
//             { name: '2 x 48GB', id: '2x48gb', popular: true },
//             { name: '4 x 16GB', id: '4x16gb', popular: false },
//             { name: '4 x 24GB', id: '4x24gb', popular: false },
//             { name: '4 x 32GB', id: '4x32gb', popular: false },
//             { name: '4 x 48GB', id: '4x48gb', popular: false },
//             { name: '2 x 64GB', id: '2x64gb', popular: false },
//         ],
//         colors: [
//             { name: 'Black', id: 'black', popular: true },
//             { name: 'White', id: 'white', popular: true },
//             { name: 'Gray', id: 'gray', popular: true },
//             { name: 'Black / Gray', id: 'blackgray', popular: true },
//             { name: 'Black / Silver', id: 'blacksilver', popular: true },
//             { name: 'White / Silver', id: 'whitesilver', popular: true },
//             { name: 'White / Gray', id: 'whitegray', popular: false },
//             { name: 'White / Black', id: 'whiteblack', popular: false },
//             { name: 'Black / Pink', id: 'blackpink', popular: false },
//             { name: 'White / Pink', id: 'whitepink', popular: false },
//         ],
//     },

//     "cpu": {
//         "rating": [
//             { "name": "5 Stars", "id": "5", "popular": true },
//             { "name": "4 Stars & up", "id": "4", "popular": true },
//             { "name": "3 Stars & up", "id": "3", "popular": false },
//             { "name": "2 Stars & up", "id": "2", "popular": false },
//             { "name": "1 Star & up", "id": "1", "popular": false },
//             { "name": "Unrated", "id": "0", "popular": false }
//         ],
//         "cores": [
//             { "name": "4 Cores", "id": "4", "popular": true },
//             { "name": "6 Cores", "id": "6", "popular": true },
//             { "name": "8 Cores", "id": "8", "popular": true },
//             { "name": "12 Cores", "id": "12", "popular": true },
//             { "name": "16 Cores", "id": "16", "popular": true },
//             { "name": "24 Cores", "id": "24", "popular": false },
//             { "name": "32+ Cores", "id": "32", "popular": false }
//         ],
//         "threads": {
//             "type": "range",
//             "unit": "",
//             "popular_values": [4, 8, 12, 16, 24, 32]
//         },
//         "base_clock": {
//             "type": "range",
//             "unit": "GHz",
//             "popular_values": ["3.0", "3.5", "4.0", "4.5", "5.0+"]
//         },
//         "tdp": {
//             "type": "range",
//             "unit": "W",
//             "popular_values": [65, 105, 125, 170],
//             "common_options": [
//                 { "name": "65 W", "id": "65", "popular": true },
//                 { "name": "105 W", "id": "105", "popular": true },
//                 { "name": "125 W", "id": "125", "popular": true },
//                 { "name": "170 W", "id": "170", "popular": false }
//             ]
//         },
//         "series": [
//             { "name": "AMD Ryzen 5", "id": "60", "popular": true },
//             { "name": "AMD Ryzen 7", "id": "59", "popular": true },
//             { "name": "AMD Ryzen 9", "id": "69", "popular": true },
//             { "name": "AMD Ryzen 3", "id": "62", "popular": true },
//             { "name": "Intel Core i5", "id": "12", "popular": true },
//             { "name": "Intel Core i7", "id": "13", "popular": true },
//             { "name": "Intel Core i9", "id": "61", "popular": true },
//             { "name": "Intel Core Ultra 7", "id": "77", "popular": true },
//             { "name": "Intel Core Ultra 9", "id": "78", "popular": false }
//         ],
//         "microarchitecture": [
//             { "name": "Zen 4", "id": "99", "popular": true },
//             { "name": "Zen 5", "id": "103", "popular": true },
//             { "name": "Zen 3", "id": "96", "popular": true },
//             { "name": "Raptor Lake", "id": "101", "popular": true },
//             { "name": "Alder Lake", "id": "98", "popular": true },
//             { "name": "Arrow Lake", "id": "104", "popular": false }
//         ],
//         "socket": [
//             { "name": "AM5", "id": "41", "popular": true },
//             { "name": "AM4", "id": "33", "popular": true },
//             { "name": "LGA 1700", "id": "40", "popular": true },
//             { "name": "LGA 1851", "id": "42", "popular": false }
//         ],
//         "integrated_graphics": [
//             { "name": "None", "id": "0", "popular": true },
//             { "name": "Radeon 780M", "id": "568", "popular": true },
//             { "name": "Radeon 760M", "id": "569", "popular": false },
//             { "name": "Intel UHD Graphics 770", "id": "512", "popular": true },
//             { "name": "Intel Xe", "id": "579", "popular": false }
//         ],
//         "smt": [
//             { "name": "Yes", "id": "1", "popular": true },
//             { "name": "No", "id": "0", "popular": false }
//         ],
//         "ecc_support": [
//             { "name": "Yes", "id": "1", "popular": false },
//             { "name": "No", "id": "0", "popular": true }
//         ],
//         "includes_cooler": [
//             { "name": "Yes", "id": "1", "popular": true },
//             { "name": "No", "id": "0", "popular": true }
//         ]
//     }
// };

export default function PartsFilter({ partType, onFilterChange }) {
    const [selectedFilters, setSelectedFilters] = useState({});

    const [showAll, setShowAll] = useState({});

    const filterConfig = FILTER_DATA[partType] || {};

    useEffect(() => {
        if (onFilterChange) {
            onFilterChange(selectedFilters);
        }
    }, [selectedFilters]);

    const handleFilterToggle = (category, id) => {
        setSelectedFilters(prev => {
            const current = prev[category] || [];
            const updated = current.includes(id)
                ? current.filter(item => item !== id)
                : [...current, id];

            return { ...prev, [category]: updated };
        });
    };

    const clearFilters = () => {
        setSelectedFilters({});
        if (onFilterChange) {
            onFilterChange({});
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

            {/* {renderFilterSection("Manufacturer", "manufacturers", filterConfig.manufacturers)}
            {renderFilterSection("Speed", "speeds", filterConfig.speeds)}
            {renderFilterSection("Modules", "modules", filterConfig.modules)}
            {renderFilterSection("Color", "colors", filterConfig.colors)}
            {renderFilterSection("Cores", "cores", filterConfig.cores)} */}

            {Object.entries(filterConfig).map(([key, items]) => {
                // Skip if items is not an array (e.g., range filters)
                if (!Array.isArray(items)) return null;
                if (items.length === 0) return null;

                // Convert key to title case (e.g., "integrated_graphics" -> "Integrated Graphics")
                const title = key
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');

                return <div key={key}>{renderFilterSection(title, key, items)}</div>;
            })}
        </div>
    );
}
