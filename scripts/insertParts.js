import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// Load relevantParts.json
const relevantParts = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../public/top100/relevantParts.json'), 'utf8')
);

// ─── CATEGORY DETECTION ─────────────────────────────────────────

function getCategoryFromBreadcrumbs(breadCrumbs) {
    if (!breadCrumbs) return null;
    const bc = breadCrumbs.toLowerCase();

    if (bc.includes('cpu processors')) return 'cpu';
    if (bc.includes('cpu cooling')) return 'cpu-cooler';
    if (bc.includes('water cooling systems')) return 'cpu-cooler';
    if (bc.includes('graphics cards')) return 'video-card';
    if (bc.includes('motherboards')) return 'motherboard';
    if (bc.includes('memory') && !bc.includes('flash')) return 'memory';
    if (bc.includes('internal hard drives') || bc.includes('solid state drives')) return 'internal-hard-drive';
    if (bc.includes('power supplies')) return 'powersupply';
    if (bc.includes('computer cases')) return 'case';

    return null;
}

function getCategoryFromTitle(title) {
    if (!title) return null;
    const t = title.toLowerCase();

    if (t.includes('ryzen') || t.includes('core i') || t.includes('processor') || t.includes('cpu')) return 'cpu';
    if (t.includes('geforce') || t.includes('radeon rx') || t.includes('graphics card') || t.includes('rtx') || t.includes('video card')) return 'video-card';
    if (t.includes('motherboard')) return 'motherboard';
    if (t.includes('ddr4') || t.includes('ddr5') || t.includes('ram ')) return 'memory';
    if (t.includes('ssd') || t.includes('hard drive') || t.includes('nvme')) return 'internal-hard-drive';
    if (t.includes('power supply') || t.includes('psu') || t.includes(' watt')) return 'powersupply';
    if (t.includes('pc case') || t.includes('mid-tower') || t.includes('atx case') || t.includes('computer case')) return 'case';
    if (t.includes('cooler') || t.includes('aio') || t.includes('cooling')) return 'cpu-cooler';

    return null;
}

// ─── SPECS EXTRACTION ───────────────────────────────────────────

function extractCpuSpecs(title, desc) {
    const text = `${title} ${desc}`.toLowerCase();
    const specs = {};

    // Core count: "6-Core", "14 cores", "4 (4P-0E) Cores"
    const coreMatch = text.match(/(\d+)[\s-]*core/i) || text.match(/(\d+)\s*\(\d+P/i);
    if (coreMatch) specs.core_count = parseInt(coreMatch[1]);

    // Thread count: "12-Thread"
    const threadMatch = text.match(/(\d+)[\s-]*thread/i);
    if (threadMatch) specs.smt = true;

    // Boost clock: "up to 4.3 GHz", "5.1 GHz", "4.6 GHz Max Boost"
    const boostMatch = text.match(/(?:up to|max boost|turbo)[^\d]*(\d+\.?\d*)\s*ghz/i)
        || text.match(/(\d+\.?\d*)\s*ghz\s*(?:max|turbo|boost)/i);
    if (boostMatch) specs.boost_clock = parseFloat(boostMatch[1]);

    // Base clock: "2.5GHz", "3.7GHz" (usually first GHz mention in desc)
    const baseMatch = desc.match(/(\d+\.?\d*)\s*ghz/i);
    if (baseMatch) {
        const val = parseFloat(baseMatch[1]);
        if (!specs.boost_clock || val < specs.boost_clock) specs.core_clock = val;
    }

    // TDP: "58W", "65W", "120W", "170W TDP"
    const tdpMatch = text.match(/(\d+)\s*w(?:\s*(?:tdp|processor base power|base power))?/i);
    if (tdpMatch) specs.tdp = parseInt(tdpMatch[1]) + 'W';

    // Socket: "LGA1700", "AM5", "AM4"
    if (text.includes('lga1700') || text.includes('lga 1700')) specs.socket = 'LGA1700';
    else if (text.includes('lga1851') || text.includes('lga 1851')) specs.socket = 'LGA1851';
    else if (text.includes('am5') || text.includes('socket am5')) specs.socket = 'AM5';
    else if (text.includes('am4') || text.includes('socket am4')) specs.socket = 'AM4';

    // Microarchitecture
    if (text.includes('zen 5') || text.includes('ryzen 9000')) specs.microarchitecture = 'Zen 5';
    else if (text.includes('zen 4') || text.includes('ryzen 7000') || text.includes('7600') || text.includes('7700') || text.includes('7900') || text.includes('7950')) specs.microarchitecture = 'Zen 4';
    else if (text.includes('zen 3') || text.includes('ryzen 5000') || text.includes('5600') || text.includes('5500') || text.includes('5900') || text.includes('5950')) specs.microarchitecture = 'Zen 3';
    else if (text.includes('raptor lake') || text.includes('13th gen') || text.includes('13600') || text.includes('13700') || text.includes('13900')) specs.microarchitecture = 'Raptor Lake';
    else if (text.includes('alder lake') || text.includes('12th gen') || text.includes('12100') || text.includes('12400') || text.includes('12600') || text.includes('12700') || text.includes('12900')) specs.microarchitecture = 'Alder Lake';
    else if (text.includes('14th gen') || text.includes('14900') || text.includes('14700') || text.includes('14600')) specs.microarchitecture = 'Raptor Lake Refresh';

    // Integrated graphics
    if (text.includes('integrated') || text.includes('radeon graphics') || text.includes('uhd graphics') || text.includes('igpu')) {
        specs.integrated_graphics = true;
    } else {
        specs.integrated_graphics = false;
    }
    if (title.toLowerCase().includes('f ') || title.toLowerCase().endsWith('f')) {
        specs.integrated_graphics = false;
    }

    return specs;
}

function extractGpuSpecs(title, desc) {
    const text = `${title} ${desc}`.toLowerCase();
    const specs = {};

    // VRAM: "12GB", "16GB", "24GB"
    const vramMatch = text.match(/(\d+)\s*gb\s*(?:gddr|vram|memory)/i) || title.match(/(\d+)\s*gb/i);
    if (vramMatch) specs.memory = parseInt(vramMatch[1]) + 'GB';

    // Chipset from title
    const chipsetPatterns = [
        /rtx\s*\d{4}\s*(?:ti|super)?/i,
        /rx\s*\d{4}\s*(?:xt|xtx)?/i,
        /arc\s*[ab]\d{3}/i,
        /gtx\s*\d{4}\s*(?:ti|super)?/i,
    ];
    for (const pat of chipsetPatterns) {
        const match = title.match(pat);
        if (match) { specs.chipset = match[0].trim(); break; }
    }

    // TDP
    const tdpMatch = text.match(/(\d+)\s*w\s*(?:tdp|power)/i);
    if (tdpMatch) specs.tdp = parseInt(tdpMatch[1]) + 'W';

    return specs;
}

function extractMemorySpecs(title, desc) {
    const text = `${title} ${desc}`.toLowerCase();
    const specs = {};

    // Speed: "DDR5-6000", "DDR5 6400MHz", "DDR4-3200"
    const speedMatch = text.match(/ddr[45][\s-]*(\d{4})/i);
    if (speedMatch) specs.speed = `DDR${text.includes('ddr5') ? '5' : '4'}-${speedMatch[1]}`;

    // Modules: "2x16GB", "2x8GB", "32GB (2x16GB)"
    const modMatch = text.match(/(\d+)\s*x\s*(\d+)\s*gb/i) || text.match(/\((\d+)x(\d+)gb\)/i);
    if (modMatch) specs.modules = `${modMatch[1]}x${modMatch[2]}GB`;

    // CAS Latency: "CL36", "CL32", "CL40"
    const clMatch = text.match(/cl[\s-]?(\d+)/i) || text.match(/cas[\s-]*latency[\s:]*(\d+)/i);
    if (clMatch) specs.cas_latency = parseInt(clMatch[1]);

    return specs;
}

function extractStorageSpecs(title, desc) {
    const text = `${title} ${desc}`.toLowerCase();
    const specs = {};

    // Capacity: "2TB", "1TB", "500GB"
    const capMatch = text.match(/(\d+)\s*tb/i);
    if (capMatch) specs.capacity = capMatch[1] + 'TB';
    else {
        const gbMatch = text.match(/(\d+)\s*gb/i);
        if (gbMatch) specs.capacity = gbMatch[1] + 'GB';
    }

    // Type
    if (text.includes('nvme')) specs.type = 'NVMe';
    else if (text.includes('ssd')) specs.type = 'SSD';
    else if (text.includes('hdd') || text.includes('hard drive')) specs.type = 'HDD';

    // Interface
    if (text.includes('pcie 5.0') || text.includes('pcie gen 5')) specs.interface = 'PCIe 5.0';
    else if (text.includes('pcie 4.0') || text.includes('pcie gen 4')) specs.interface = 'PCIe 4.0';
    else if (text.includes('pcie 3.0') || text.includes('pcie gen 3')) specs.interface = 'PCIe 3.0';
    else if (text.includes('sata')) specs.interface = 'SATA';

    // Read speed
    const readMatch = text.match(/([\d,]+)\s*mb\/s\s*read/i);
    if (readMatch) specs.read_speed = readMatch[1].replace(',', '') + ' MB/s';

    return specs;
}

function extractPsuSpecs(title, desc) {
    const text = `${title} ${desc}`.toLowerCase();
    const specs = {};

    // Wattage: "850W", "1000W"
    const wattMatch = text.match(/(\d+)\s*w(?:att)?/i);
    if (wattMatch) specs.wattage = parseInt(wattMatch[1]);

    // Efficiency: "80 Plus Gold", "80+ Platinum"
    if (text.includes('platinum')) specs.efficiency_rating = '80+ Platinum';
    else if (text.includes('gold')) specs.efficiency_rating = '80+ Gold';
    else if (text.includes('bronze')) specs.efficiency_rating = '80+ Bronze';
    else if (text.includes('titanium')) specs.efficiency_rating = '80+ Titanium';

    // Modular
    if (text.includes('fully modular') || text.includes('full modular')) specs.modular = 'Full';
    else if (text.includes('semi-modular') || text.includes('semi modular')) specs.modular = 'Semi';

    return specs;
}

function extractCaseSpecs(title, desc) {
    const text = `${title} ${desc}`.toLowerCase();
    const specs = {};

    // Tower type
    if (text.includes('full-tower') || text.includes('full tower')) specs.type = 'Full Tower';
    else if (text.includes('mid-tower') || text.includes('mid tower')) specs.type = 'Mid Tower';
    else if (text.includes('mini-itx') || text.includes('mini itx')) specs.type = 'Mini ITX';
    else if (text.includes('micro-atx') || text.includes('micro atx') || text.includes('matx')) specs.type = 'Micro ATX';

    // Side panel
    if (text.includes('tempered glass')) specs.side_panel = 'Tempered Glass';
    else if (text.includes('mesh')) specs.side_panel = 'Mesh';

    // Color
    if (text.includes('white')) specs.color = 'White';
    else if (text.includes('black')) specs.color = 'Black';

    return specs;
}

function extractCoolerSpecs(title, desc) {
    const text = `${title} ${desc}`.toLowerCase();
    const specs = {};

    // Cooling type
    if (text.includes('aio') || text.includes('liquid') || text.includes('water cooling')) specs.cooling_type = 'Liquid';
    else if (text.includes('air cool') || text.includes('tower cool') || text.includes('fan')) specs.cooling_type = 'Air';

    // Radiator size: "360mm", "280mm", "240mm"
    const radMatch = text.match(/(\d{2,3})\s*mm/i);
    if (radMatch && ['120', '140', '240', '280', '360'].includes(radMatch[1])) {
        specs.radiator_size = radMatch[1] + 'mm';
    }

    return specs;
}

function extractMotherboardSpecs(title, desc) {
    const text = `${title} ${desc}`.toLowerCase();
    const specs = {};

    // Socket
    if (text.includes('lga1700') || text.includes('lga 1700')) specs.socket = 'LGA1700';
    else if (text.includes('lga1851') || text.includes('lga 1851')) specs.socket = 'LGA1851';
    else if (text.includes('am5')) specs.socket = 'AM5';
    else if (text.includes('am4')) specs.socket = 'AM4';

    // Form factor
    if (text.includes('mini-itx') || text.includes('mini itx')) specs.form_factor = 'Mini ITX';
    else if (text.includes('micro-atx') || text.includes('micro atx') || text.includes('matx')) specs.form_factor = 'Micro ATX';
    else if (text.includes('e-atx') || text.includes('eatx')) specs.form_factor = 'E-ATX';
    else if (text.includes('atx')) specs.form_factor = 'ATX';

    // Chipset
    const chipsetPatterns = ['x670e', 'x670', 'b650e', 'b650', 'x870e', 'x870', 'z790', 'b760', 'z690', 'b660', 'b550', 'x570'];
    for (const chip of chipsetPatterns) {
        if (text.includes(chip)) { specs.chipset = chip.toUpperCase(); break; }
    }

    // Memory type
    if (text.includes('ddr5')) specs.memory_type = 'DDR5';
    else if (text.includes('ddr4')) specs.memory_type = 'DDR4';

    // WiFi
    if (text.includes('wifi 7') || text.includes('wi-fi 7')) specs.wireless_networking = 'WiFi 7';
    else if (text.includes('wifi 6e') || text.includes('wi-fi 6e')) specs.wireless_networking = 'WiFi 6E';
    else if (text.includes('wifi 6') || text.includes('wi-fi 6')) specs.wireless_networking = 'WiFi 6';
    else if (text.includes('wifi') || text.includes('wi-fi')) specs.wireless_networking = 'WiFi';

    return specs;
}

// Get specs based on category
function extractSpecs(category, title, desc) {
    const t = title || '';
    const d = desc || '';
    switch (category) {
        case 'cpu': return extractCpuSpecs(t, d);
        case 'video-card': return extractGpuSpecs(t, d);
        case 'memory': return extractMemorySpecs(t, d);
        case 'internal-hard-drive': return extractStorageSpecs(t, d);
        case 'powersupply': return extractPsuSpecs(t, d);
        case 'case': return extractCaseSpecs(t, d);
        case 'cpu-cooler': return extractCoolerSpecs(t, d);
        case 'motherboard': return extractMotherboardSpecs(t, d);
        default: return {};
    }
}

// Find richer specs from category JSON files (cpu.json, gpu.json, etc.)
function findSpecsFromCategoryJson(category, title, asin) {
    const categoryMap = {
        'cpu': 'cpu.json',
        'video-card': 'gpu.json',
        'memory': 'memory.json',
        'internal-hard-drive': 'internal-hard-drive.json',
        'powersupply': 'powersupply.json',
        'case': 'case.json',
        'cpu-cooler': 'cpu-cooler.json',
        'motherboard': 'motherboard.json',
    };

    const filename = categoryMap[category];
    if (!filename) return {};

    try {
        const jsonPath = path.join(__dirname, '../public/top100', filename);
        if (!fs.existsSync(jsonPath)) return {};

        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

        // Match by ASIN first (most reliable)
        let match = data.find(p => p.asin && p.asin === asin);

        // Fallback: fuzzy match by name
        if (!match && title) {
            const titleLower = title.toLowerCase();
            match = data.find(p => {
                if (!p.name) return false;
                const pName = p.name.toLowerCase();
                // Check if names overlap significantly
                return pName.includes(titleLower) || titleLower.includes(pName) ||
                    (p.title && (p.title.toLowerCase().includes(titleLower) || titleLower.includes(p.title.toLowerCase())));
            });
        }

        if (match) {
            // Extract only spec fields (exclude metadata like name, price, asin, url, etc.)
            const excludeKeys = ['name', 'price', 'asin', 'url', 'title', 'brand', 'thumbnailImage',
                'price_raw', 'price.value', 'price_currency', 'stars', 'reviewsCount',
                'description', 'breadCrumbs', 'offers', '_comment'];

            const specFields = {};
            for (const [key, value] of Object.entries(match)) {
                // Include all values except null and empty string (but keep false booleans)
                if (!excludeKeys.includes(key) && value !== null && value !== '') {
                    specFields[key] = value;
                } else if (!excludeKeys.includes(key) && typeof value === 'boolean') {
                    specFields[key] = value;
                }
            }
            return specFields;
        }
    } catch (err) {
        // File doesn't exist or parse error, skip silently
    }

    return {};
}

// ─── MAIN ───────────────────────────────────────────────────────

async function insertParts() {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;

    // Deduplicate: only process first occurrence of each ASIN
    const seenAsins = new Set();

    for (const part of relevantParts) {
        if (!part.asin) { skipped++; continue; }
        if (seenAsins.has(part.asin)) { continue; }
        seenAsins.add(part.asin);

        let category = getCategoryFromBreadcrumbs(part.breadCrumbs);
        if (!category) {
            category = getCategoryFromTitle(part.title);
            if (category) {
                console.log(`🔍 Detected ${part.asin} as "${category}" from title`);
            } else {
                console.log(`⚠️  Skipped ${part.asin} - Unknown category from: ${part.breadCrumbs}`);
                skipped++;
                continue;
            }
        }

        // Extract specs from title/description (fallback)
        const extractedSpecs = extractSpecs(category, part.title, part.description);

        // Try to find richer specs from category JSON files (cpu.json, etc.)
        const jsonSpecs = findSpecsFromCategoryJson(category, part.title, part.asin);

        // Merge: jsonSpecs takes priority over extractedSpecs
        const specs = { ...extractedSpecs, ...jsonSpecs };

        const partData = {
            asin: part.asin,
            name: part.title || 'Unknown',
            category: category,
            price: part['price.value'] || null,
            thumbnail_image: part.thumbnailImage || null,
            specs: Object.keys(specs).length > 0 ? specs : null,
        };

        // Check if part already exists
        const { data: existing } = await supabase
            .from('parts')
            .select('id, specs')
            .eq('asin', part.asin)
            .maybeSingle();

        if (existing) {
            // Update: price, thumbnail, and merge specs (don't overwrite existing specs with empty)
            const mergedSpecs = { ...(existing.specs || {}), ...specs };

            // Debug: show what's being merged for new CPUs
            if (Object.keys(jsonSpecs).length > 0) {
                console.log(`📝 Updating ${part.asin} with JSON specs:`, JSON.stringify(jsonSpecs).slice(0, 100));
            }

            const { error } = await supabase
                .from('parts')
                .update({
                    name: partData.name,
                    price: partData.price,
                    thumbnail_image: partData.thumbnail_image,
                    specs: Object.keys(mergedSpecs).length > 0 ? mergedSpecs : existing.specs,
                })
                .eq('id', existing.id);

            if (error) {
                console.error(`❌ Failed update ${part.asin}:`, error.message);
                failed++;
            } else {
                updated++;
            }
        } else {
            // Insert new
            const { error } = await supabase
                .from('parts')
                .insert(partData);

            if (error) {
                console.error(`❌ Failed insert ${part.asin}:`, error.message);
                failed++;
            } else {
                inserted++;
                console.log(`✅ Inserted: ${part.asin} → ${category} → ${partData.name.slice(0, 50)}...`);
                if (Object.keys(specs).length > 0) {
                    console.log(`   specs: ${JSON.stringify(specs)}`);
                }
            }
        }
    }

    console.log(`\n✅ Inserted: ${inserted} new parts`);
    console.log(`🔄 Updated: ${updated} existing parts (price + thumbnail + specs merged)`);
    console.log(`⏭️  Skipped: ${skipped} parts (no ASIN or unknown category)`);
    if (failed > 0) console.log(`❌ Failed: ${failed}`);
}

insertParts();
