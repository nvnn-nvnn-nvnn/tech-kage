// Data loader that transforms JSON parts data into the format expected by components
import cpuData from '../json/cpu.json';
import cpuCoolerData from '../json/cpu-cooler.json';
import motherboardData from '../json/motherboard.json';
import memoryData from '../json/memory.json';
import storageData from '../json/internal-hard-drive.json';
import videoCardData from '../json/video-card.json';
import caseData from '../json/case.json';
import powerSupplyData from '../json/power-supply.json';

// Transform function to convert JSON format to component format
function transformPart(part, index, category) {
    const id = `${category[0]}${index + 1}`;

    // Extract manufacturer from name (first word)
    const manufacturer = part.name ? part.name.split(' ')[0] : null;

    return {
        id,
        name: part.name || "Unknown",
        base: part.price || 0,
        promo: 0,
        shipping: 0,
        tax: 0,
        avail: "In Stock",
        where: "Amazon",

        // PartsList fields (for list view)
        cores: part.core_count,
        baseClock: part.core_clock ? `${part.core_clock} GHz` : null,
        boostClock: part.boost_clock ? `${part.boost_clock} GHz` : null,

        // PartDetail fields (for detail view) - CPU
        manufacturer: manufacturer,
        partNumber: part.part_number,
        series: part.series,
        microarchitecture: part.microarchitecture,
        coreFamily: part.core_family,
        socket: part.socket,
        coreCount: part.core_count,
        threadCount: part.thread_count,
        performanceCoreClock: part.core_clock ? `${part.core_clock} GHz` : null,
        performanceCoreBoostClock: part.boost_clock ? `${part.boost_clock} GHz` : null,
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
        coreClock: part.core_clock ? `${part.core_clock} MHz` : null,
        length: part.length,
        color: part.color,

        // Power supply specific
        wattage: part.wattage ? `${part.wattage}W` : null,
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

// Limit to first 50 parts per category for performance
const LIMIT = 75;

export const sampleParts = {
    cpu: cpuData.slice(0, LIMIT).map((p, i) => transformPart(p, i, 'cpu')),
    "cpu-cooler": cpuCoolerData.slice(0, LIMIT).map((p, i) => transformPart(p, i, 'cpu-cooler')),
    motherboard: motherboardData.slice(0, LIMIT).map((p, i) => transformPart(p, i, 'motherboard')),
    memory: memoryData.slice(0, LIMIT).map((p, i) => transformPart(p, i, 'memory')),
    storage: storageData.slice(0, LIMIT).map((p, i) => transformPart(p, i, 'storage')),
    "video-card": videoCardData.slice(0, LIMIT).map((p, i) => transformPart(p, i, 'video-card')),
    case: caseData.slice(0, LIMIT).map((p, i) => transformPart(p, i, 'case')),
    powersupply: powerSupplyData.slice(0, LIMIT).map((p, i) => transformPart(p, i, 'powersupply')),
};
