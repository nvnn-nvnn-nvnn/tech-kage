// Data loader that transforms JSON parts data into the format expected by components

// Transform function to convert JSON format to component format
function transformPart(part, index, category) {
    const id = part.id || `${category[0]}${index + 1}`;
    const specs = part.specs || part;
    const currentPrice = part.current_price?.[0];

    // Use ASIN as the ID for URL routing
    // const id = part.asin || part.id || `${category[0]}${index + 1}`;

    // Extract manufacturer from name (first word)
    const manufacturer = part.manufacturer || (part.name ? part.name.split(' ')[0] : null);

    // Return all specs fields directly (snake_case) plus essential display fields
    return {
        id,
        name: part.name || "Unknown",
        // Use new price field from database, fallback to current_price or specs
        base: part.price || currentPrice?.price || specs.price || 0,
        promo: 0,
        shipping: 0,
        tax: 0,
        avail: currentPrice?.availability || "In Stock",
        where: currentPrice?.retailer || "Amazon",
        asin: part.asin || "",

        // New fields from relevantParts.json
        image: part.thumbnail_image || null,
        description: part.description || null,
        reviews_count: part.reviews_count || 0,
        amazon_url: part.amazon_url || null,

        // Pass through all specs fields directly (they're already in snake_case)
        ...specs,

        // Ensure manufacturer is set
        manufacturer: manufacturer,

        // Legacy fields for list view compatibility
        cores: specs.core_count,
        baseClock: specs.core_clock ? `${specs.core_clock} GHz` : null,
        boostClock: specs.boost_clock ? `${specs.boost_clock} GHz` : null,
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
