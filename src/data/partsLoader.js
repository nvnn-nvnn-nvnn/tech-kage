// Data loader that transforms JSON parts data into the format expected by components

// Transform function to convert JSON format to component format
function transformPart(part, index, category) {
    const id = part.id || `${category[0]}${index + 1}`;
    const specs = part.specs || part;
    const currentPrice = part.current_price?.[0];

    // Extract manufacturer from name (first word)
    const manufacturer = part.name ? part.name.split(' ')[0] : null;

    return {
        id,
        name: part.name || "Unknown",
        base: currentPrice || specs.price || 0,
        promo: 0,
        shipping: 0,
        tax: 0,
        avail: "In Stock",
        where: "Amazon",
        asin: part.asin || "",

        // PartsList fields (for list view)
        cores: specs.core_count,
        baseClock: specs.core_clock ? `${specs.core_clock} GHz` : null,
        boostClock: specs.boost_clock ? `${specs.boost_clock} GHz` : null,

        // PartDetail fields (for detail view) - CPU
        manufacturer: manufacturer,
        partNumber: part.part_number,
        series: part.series,
        microarchitecture: part.microarchitecture,
        coreFamily: part.core_family,
        socket: part.socket,
        coreCount: part.core_count,
        threadCount: part.thread_count,
        performanceCoreClock: specs.core_clock ? `${specs.core_clock} GHz` : null,
        performanceCoreBoostClock: specs.boost_clock ? `${specs.boost_clock} GHz` : null,
        l2Cache: part.l2_cache,
        l3Cache: part.l3_cache,
        tdp: part.tdp ? `${part.tdp}W` : null,
        integratedGraphics: part.graphics,
        maxSupportedMemory: part.max_memory,
        eccSupport: part.ecc_support,
        includesCooler: part.includes_cooler,
        packaging: part.packaging,
        lithography: part.lithography,
        simultaneousMultithreading: part.smt,

        // Memory specific
        speed: part.speed,
        modules: part.modules,
        pricePerGb: part.price_per_gb,
        casLatency: part.cas_latency,

        // Storage specific
        capacity: part.capacity,
        type: part.type,
        cache: part.cache,
        formFactor: part.form_factor,
        interface: part.interface,

        // Video card specific
        chipset: part.chipset,
        memory: part.memory,
        coreClock: specs.core_clock ? `${specs.core_clock} MHz` : null,
        length: part.length,
        color: part.color,

        // Power supply specific
        wattage: specs.wattage ? `${specs.wattage}W` : null,
        efficiencyRating: part.efficiency_rating,
        modular: part.modular,

        // Case specific
        towerType: part.type,
        sidePanel: part.side_panel,
        external525Bays: part.external_525_bays,

        // Motherboard specific
        maxMemory: part.max_memory,
        memorySlots: part.memory_slots,

        // CPU Cooler specific
        rpm: part.rpm,
        noiseLevel: part.noise_level,
        radiatorSize: part.radiator_size,
        model: part.model,
    };
}

// Filter function to only include parts with valid ASINs
function filterPartsWithAsin(parts) {
    return parts.filter(part => part.asin && part.asin.trim() !== "");
}

// Limit to first 175 parts per category for performance
const LIMIT = 175;

// Async loader for parts data
async function loadPartsData() {
    const categories = [
        { key: 'cpu', api: 'cpu' },
        { key: 'cpu-cooler', api: 'cpu-cooler' },
        { key: 'motherboard', api: 'motherboard' },
        { key: 'memory', api: 'memory' },
        { key: 'storage', api: 'storage' },
        { key: 'video-card', api: 'video-card' },
        { key: 'case', api: 'case' },
        { key: 'powersupply', api: 'powersupply' },
    ];

    const parts = {};

    for (const category of categories) {
        try {
            // const res = await fetch(`/top100/${category.file}`);

            const API_URL = import.meta.env.VITE_API_URL;
            const res = await fetch(`${API_URL}/api/parts/${category.api}`);

            const data = await res.json();
            parts[category.key] = filterPartsWithAsin(data)
                .slice(0, LIMIT)
                .map((p, i) => transformPart(p, i, category.key));
        } catch (error) {
            console.error(`Error loading ${category.key}:`, error);
            parts[category.key] = [];
        }
    }

    return parts;
}

// Cache for loaded parts
let cachedParts = null;

// Export async function to get parts
export async function getSampleParts() {
    if (!cachedParts) {
        cachedParts = await loadPartsData();
    }
    return cachedParts;
}

// Export empty object for backwards compatibility (will be populated by components)
export const sampleParts = {};
