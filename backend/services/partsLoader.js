// Backend parts loader - transforms JSON data into AI builder format
// const cpuData = require('../data/parts/cpu.json');
// const videoCardData = require('../data/parts/video-card.json');
// const motherboardData = require('../data/parts/motherboard.json');
// const memoryData = require('../data/parts/memory.json');
// const storageData = require('../data/parts/internal-hard-drive.json');
// const powerSupplyData = require('../data/parts/power-supply.json');
// const caseData = require('../data/parts/case.json');
// const cpuCoolerData = require('../data/parts/cpu-cooler.json');

const cpuData = require('../json/top100/cpu.json');
const videoCardData = require('../json/top100/video-card.json');
const motherboardData = require('../json/top100/motherboard.json');
const memoryData = require('../json/top100/memory.json');
const storageData = require('../json/top100/internal-hard-drive.json');
const powerSupplyData = require('../json/top100/power-supply.json');
const caseData = require('../json/top100/case.json');
const cpuCoolerData = require('../json/top100/cpu-cooler.json');







// Transform JSON part to AI builder catalog format
function transformToCatalogFormat(part, category) {
    // Extract manufacturer from name
    const manufacturer = part.name ? part.name.split(' ')[0] : '';

    // Build spec string based on category
    let spec = '';
    switch (category) {
        case 'CPU':
            spec = `${part.core_count || '?'}-Core · ${part.boost_clock || part.core_clock || '?'}GHz · ${part.microarchitecture || 'Unknown'}`;
            break;
        case 'GPU':
            spec = `${part.memory || 'Unknown Memory'} · ${part.chipset || 'Unknown Chipset'}`;
            break;
        case 'MOTHERBOARD':
            spec = `${part.form_factor || 'ATX'} · ${part.socket || 'Unknown Socket'}`;
            break;
        case 'RAM':
            spec = `${part.speed || 'Unknown Speed'} · ${part.modules || 'Unknown Config'}`;
            break;
        case 'STORAGE':
            spec = `${part.capacity || 'Unknown'} · ${part.type || 'SSD'} · ${part.interface || 'Unknown Interface'}`;
            break;
        case 'PSU':
            spec = `${part.wattage || 'Unknown'}W · ${part.efficiency_rating || '80+ Gold'} · ${part.modular || 'Modular'}`;
            break;
        case 'CASE':
            spec = `${part.type || 'Mid Tower'} · ${part.side_panel || 'Tempered Glass'}`;
            break;
        case 'COOLING':
            spec = `${part.radiator_size || part.fan_rpm || 'Cooling Solution'}`;
            break;
    }

    return {
        name: part.name || "Unknown Part",
        price: `$${(part.price || 0).toFixed(2)}`,
        priceNumeric: part.price || 0,
        badge: manufacturer.toUpperCase(),
        spec: spec,
        rating: 4.5, // Default rating
        asin: part.asin || "UNKNOWN",
        reason: `${manufacturer} ${category.toLowerCase()} option with solid performance and value.`
    };
}

// Select top parts per category (sorted by price, pick variety)
function selectTopParts(data, category, count = 6) {
    if (!data || data.length === 0) return [];

    // Filter out parts with null or 0 price AND parts without valid ASINs
    const validParts = data.filter(part =>
        part.price &&
        part.price > 0 &&
        part.asin &&
        part.asin.trim() !== ""
    );

    if (validParts.length === 0) return [];

    // Sort by price
    const sorted = [...validParts].sort((a, b) => (a.price || 0) - (b.price || 0));

    // Pick spread across price ranges
    const result = [];
    const step = Math.max(1, Math.floor(sorted.length / count));

    for (let i = 0; i < count && i * step < sorted.length; i++) {
        const part = sorted[i * step];
        result.push(transformToCatalogFormat(part, category));
    }

    return result;
}

// Build the parts catalog from JSON data
const PARTS_CATALOG = {
    CPU: selectTopParts(cpuData, 'CPU', 6),
    GPU: selectTopParts(videoCardData, 'GPU', 8),
    MOTHERBOARD: selectTopParts(motherboardData, 'MOTHERBOARD', 6),
    RAM: selectTopParts(memoryData, 'RAM', 6),
    STORAGE: selectTopParts(storageData, 'STORAGE', 6),
    PSU: selectTopParts(powerSupplyData, 'PSU', 6),
    CASE: selectTopParts(caseData, 'CASE', 6),
    COOLING: selectTopParts(cpuCoolerData, 'COOLING', 6),
};

// Helper functions
function getPartNamesForCategory(category) {
    return (PARTS_CATALOG[category] || []).map(p => p.name);
}

function getPartByName(category, name) {
    const parts = PARTS_CATALOG[category] || [];
    const exact = parts.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (exact) return exact;
    return parts.find(p =>
        p.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(p.name.toLowerCase())
    ) || null;
}

function getDefaultPart(category) {
    return PARTS_CATALOG[category]?.[0] || null;
}

module.exports = { PARTS_CATALOG, getPartNamesForCategory, getPartByName, getDefaultPart };
