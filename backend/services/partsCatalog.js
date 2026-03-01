// services/partsCatalog.js
// Predetermined parts list — 3 per category.
// Replace prices/ASINs when Amazon PA API is approved.

const PARTS_CATALOG = {
  CPU: [
    {
      name: "AMD Ryzen 7 7800X3D",
      price: "$379",
      priceNumeric: 379,
      badge: "BEST PICK",
      spec: "8-Core · 5.0GHz · AM5 · 3D V-Cache · DDR5",
      rating: 4.9,
      asin: "B0BTZB7F88",
      reason: "The undisputed gaming king in 2026. 3D V-Cache delivers massive L3 bandwidth — the single biggest fps uplift per dollar at 1440p and 4K.",
    },
    {
      name: "AMD Ryzen 9 7950X3D",
      price: "$649",
      priceNumeric: 649,
      badge: "CREATOR + GAMING",
      spec: "16-Core · 5.7GHz · AM5 · 3D V-Cache · 120W Base TDP",
      rating: 4.9,
      asin: "B0BTRH9MX5",
      reason: "The only chip that tops both gaming and heavy workloads simultaneously. Dual CCD design — overkill for most, perfect for pros.",
    },
    {
      name: "Intel Core i9-14900K",
      price: "$529",
      priceNumeric: 529,
      badge: "INTEL PICK",
      spec: "24-Core · 6.0GHz · LGA1700 · High IPC · Overclockable",
      rating: 4.7,
      asin: "B0CGJ41N5M",
      reason: "Intel's fastest consumer chip. Dominates single-threaded workloads. Runs hot — pair with a 360mm AIO.",
    },
  ],

 GPU: [
    {
        name: "NVIDIA RTX 4070 Super",
        price: "$599",
        priceNumeric: 599,
        badge: "BEST PICK",
        spec: "12GB GDDR6X · 220W TDP · DLSS 3.5 · Frame Gen",
        rating: 4.9,
        asin: "B0CS4BNFYV",
        reason: "The best GPU value in 2026 at 1440p. DLSS 3.5 Frame Generation pushes well past 144fps at high settings."
    },
    {
        name: "NVIDIA RTX 4080 Super",
        price: "$999",
        priceNumeric: 999,
        badge: "4K PICK",
        spec: "16GB GDDR6X · 320W TDP · DLSS 3.5 · AV1 Encode",
        rating: 4.8,
        asin: "B0CS3KXKJ1",
        reason: "Handles 4K at 144fps in most titles with DLSS Quality mode. 16GB VRAM is future-proof for high-res textures."
    },
        {
        name: "AMD RX 7900 XTX",
        price: "$879",
        priceNumeric: 879,
        badge: "AMD FLAGSHIP",
        spec: "24GB GDDR6 · 355W TDP · FSR 3 · DisplayPort 2.1",
        rating: 4.7,
        asin: "B0BL6GXBXS",
        reason: "AMD's best. 24GB VRAM is a genuine advantage for 3D rendering and AI workloads. Best for Linux setups."
    },
    {
        name: "AMD Radeon RX 9060 XT 16GB",
        price: "$459",
        priceNumeric: 459,
        badge: "BEST VALUE",
        spec: "16GB GDDR6 · 160W TDP · FSR 3 · Great rasterization",
        rating: 4.8,
        asin: "example-asin-9060xt",  // Check current listings for exact
        reason: "Excellent mid-range value in 2026. 16GB VRAM handles modern games at 1440p with high textures and future-proofs better than 8GB options. Strong raster performance and efficiency."
    },
    {
        name: "NVIDIA GeForce RTX 5060 Ti 16GB",
        price: "$520",
        priceNumeric: 520,
        badge: "1440P SOLID",
        spec: "16GB GDDR7 · ~180W TDP · DLSS 4 · Frame Gen",
        rating: 4.7,
        asin: "example-asin-5060ti",
        reason: "Newer gen card with DLSS advantages and more VRAM for demanding titles. Great for 1440p high-refresh gaming, edges out older cards in ray tracing and upscaling."
    },
    {
        name: "Intel Arc B580",
        price: "$249",
        priceNumeric: 249,
        badge: "ULTIMATE BUDGET",
        spec: "12GB GDDR6 · Low TDP · XeSS upscaling · AV1 Encode",
        rating: 4.6,
        asin: "example-asin-b580",
        reason: "Insane value under $300 with 12GB VRAM. Dominates budget gaming at 1080p/1440p, beats older cards like RTX 4060 in many scenarios, especially with driver improvements in 2026."
    },
    {
        name: "NVIDIA GeForce RTX 4060",
        price: "$299",
        priceNumeric: 299,
        badge: "ENTRY LEVEL",
        spec: "8GB GDDR6 · 115W TDP · DLSS 3 · Efficient",
        rating: 4.5,
        asin: "example-asin-4060",
        reason: "Still a strong entry point for 1080p/1440p with DLSS 3 Frame Generation. Very power-efficient and cheap now—perfect if you're on a tight budget but want Nvidia features."
    }
],

  MOTHERBOARD: [
    {
      name: "ASUS TUF Gaming X670E-Plus WiFi",
      price: "$239",
      priceNumeric: 239,
      badge: "BEST PICK",
      spec: "ATX · X670E · DDR5 · WiFi 6E · PCIe 5.0 · AM5",
      rating: 4.7,
      asin: "B0BHR894VN",
      reason: "Solid VRM, full PCIe 5.0 support, and WiFi 6E at a sane price. Best all-rounder for AM5 builds.",
    },
    {
      name: "MSI MAG Z790 Tomahawk WiFi",
      price: "$249",
      priceNumeric: 249,
      badge: "INTEL PICK",
      spec: "ATX · Z790 · DDR5 · WiFi 6E · PCIe 5.0 · LGA1700",
      rating: 4.8,
      asin: "B0BJ9BPBRD",
      reason: "Best value Z790 board. Excellent VRM for overclocking and great build quality. Pairs perfectly with i7/i9 chips.",
    },
    {
      name: "Gigabyte X670 AORUS Elite AX",
      price: "$259",
      priceNumeric: 259,
      badge: "PREMIUM AM5",
      spec: "ATX · X670 · DDR5 · WiFi 6E · Dual M.2 Thermal Guard",
      rating: 4.6,
      asin: "B0BHR7MHD6",
      reason: "Strong power delivery and excellent M.2 thermal management. Great for overclockers on the AM5 platform.",
    },
  ],

  RAM: [
    {
      name: "G.Skill Trident Z5 RGB 32GB",
      price: "$109",
      priceNumeric: 109,
      badge: "BEST PICK",
      spec: "DDR5-6000 · CL36 · 2x16GB · RGB · XMP 3.0",
      rating: 4.9,
      asin: "B09NMNML4V",
      reason: "DDR5-6000 is the sweet spot for Ryzen AM5. Tight CL36 timings and G.Skill's best-in-class reliability.",
    },
    {
      name: "Corsair Dominator Titanium 32GB",
      price: "$129",
      priceNumeric: 129,
      badge: "PREMIUM",
      spec: "DDR5-6000 · CL30 · 2x16GB · DHX Cooling · iCUE",
      rating: 4.8,
      asin: "B0BZPB818Y",
      reason: "Tighter CL30 timings give a measurable edge in CPU-bound workloads. Stunning aesthetics and deep iCUE integration.",
    },
    {
      name: "Corsair Vengeance DDR5 32GB",
      price: "$79",
      priceNumeric: 79,
      badge: "VALUE PICK",
      spec: "DDR5-5200 · CL40 · 2x16GB · Low Profile · Plug & Play",
      rating: 4.6,
      asin: "B09Z4QXNTQ",
      reason: "No-fuss DDR5 entry point. Works out of the box on any DDR5 board with no BIOS tuning required.",
    },
  ],

  STORAGE: [
    {
      name: "Samsung 990 Pro 2TB",
      price: "$149",
      priceNumeric: 149,
      badge: "BEST PICK",
      spec: "7,450 MB/s Read · 6,900 MB/s Write · PCIe 4.0 · V-NAND",
      rating: 4.9,
      asin: "B0BHJJ9Y77",
      reason: "Samsung's fastest consumer NVMe. Consistent under sustained load — critical for video editing and large transfers.",
    },
    {
      name: "WD Black SN850X 2TB",
      price: "$139",
      priceNumeric: 139,
      badge: "GAMING PICK",
      spec: "7,300 MB/s Read · PCIe 4.0 · Game Mode 2.0 · Heatsink Option",
      rating: 4.8,
      asin: "B0B7CKVCCV",
      reason: "Game Mode 2.0 pre-emptively loads assets. Marginally behind Samsung in benchmarks but equally reliable.",
    },
    {
      name: "Seagate FireCuda 530 2TB",
      price: "$139",
      priceNumeric: 139,
      badge: "RUNNER UP",
      spec: "7,300 MB/s Read · PCIe 4.0 · Heatsink Included · 5yr Warranty",
      rating: 4.7,
      asin: "B08XTXMDPV",
      reason: "Top-tier endurance and a 5-year warranty. Heatsink included — great for boards without M.2 thermal pads.",
    },
  ],

  PSU: [
    {
      name: "Corsair RM850x 850W",
      price: "$129",
      priceNumeric: 129,
      badge: "BEST PICK",
      spec: "80+ Gold · Fully Modular · Zero RPM Mode · 10yr Warranty",
      rating: 4.9,
      asin: "B079H6131J",
      reason: "Industry benchmark for reliability. Silent at low loads. 850W headroom is perfect for high-end GPU + CPU combos.",
    },
    {
      name: "Seasonic Focus GX-850 850W",
      price: "$139",
      priceNumeric: 139,
      badge: "PREMIUM",
      spec: "80+ Gold · Fully Modular · Fluid Bearing Fan · 10yr Warranty",
      rating: 4.8,
      asin: "B08R791WKR",
      reason: "Seasonic makes OEM units for half the industry. Japanese capacitors and an exceptional 10-year warranty.",
    },
    {
      name: "Corsair RM1000x 1000W",
      price: "$179",
      priceNumeric: 179,
      badge: "HIGH-END",
      spec: "80+ Gold · Fully Modular · PCIe 5.0 Ready · 1000W",
      rating: 4.9,
      asin: "B079H5XVTJ",
      reason: "Necessary for RTX 4090 builds. PCIe 5.0 native connector eliminates the infamous 16-pin melt risk.",
    },
  ],

  CASE: [
    {
      name: "Lian Li O11 Dynamic EVO",
      price: "$149",
      priceNumeric: 149,
      badge: "BEST PICK",
      spec: "Mid Tower · Dual Chamber · Tool-Free · Great Cable Management",
      rating: 4.9,
      asin: "B09GXDHKP6",
      reason: "The most popular enthusiast case for a reason. Dual chamber keeps cables hidden and airflow unobstructed.",
    },
    {
      name: "Fractal Torrent RGB",
      price: "$179",
      priceNumeric: 179,
      badge: "AIRFLOW KING",
      spec: "Mid Tower · 3x180mm Front Fans Included · High Airflow Mesh",
      rating: 4.8,
      asin: "B09NMPVQJJ",
      reason: "Ships with three massive 180mm fans. Best choice for air-cooled high-performance builds.",
    },
    {
      name: "Corsair 4000D Airflow",
      price: "$89",
      priceNumeric: 89,
      badge: "BEST VALUE",
      spec: "Mid Tower · Mesh Front · 2 Pre-Installed Fans · Clean Interior",
      rating: 4.8,
      asin: "B08C7BGV3D",
      reason: "Best budget case on the market. Great airflow and tool-free installation. Corsair's most popular case.",
    },
  ],

  COOLING: [
    {
      name: "NZXT Kraken 360 RGB",
      price: "$149",
      priceNumeric: 149,
      badge: "BEST PICK",
      spec: "360mm AIO · LCD Display · Quiet Asetek Pump · CAM Software",
      rating: 4.8,
      asin: "B0BGWXFJWK",
      reason: "360mm radiator keeps even a 14900K cool under full load. LCD screen is genuinely useful for temp monitoring.",
    },
    {
      name: "Arctic Liquid Freezer III 360",
      price: "$99",
      priceNumeric: 99,
      badge: "VALUE AIO",
      spec: "360mm AIO · 40mm VRM Fan · High Static Pressure · No RGB",
      rating: 4.8,
      asin: "B0BJYMDP96",
      reason: "Outperforms AIOs twice its price. Built-in VRM fan is a clever touch. Best-performing AIO under $100.",
    },
    {
      name: "Noctua NH-D15",
      price: "$99",
      priceNumeric: 99,
      badge: "ULTIMATE AIR",
      spec: "Dual Tower · 250W TDP · 2x NF-A15 Fans · SSO2 Bearing",
      rating: 4.9,
      asin: "B00L7UZMAK",
      reason: "The best air cooler ever made. Competes with 240mm AIOs, whisper quiet, and will outlast the build.",
    },
  ],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

// Get all part names for a category (used in prompt builder)
function getPartNamesForCategory(category) {
  return (PARTS_CATALOG[category] || []).map(p => p.name);
}

// Get a part by name (used in enrichBuild to match Claude's pick)
function getPartByName(category, name) {
  const parts = PARTS_CATALOG[category] || [];
  // Exact match first
  const exact = parts.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (exact) return exact;
  // Fuzzy match — Claude sometimes shortens names
  return parts.find(p =>
    p.name.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(p.name.toLowerCase())
  ) || null;
}

// Get the best/default part for a category (first item = BEST PICK)
function getDefaultPart(category) {
  return PARTS_CATALOG[category]?.[0] || null;
}

module.exports = { PARTS_CATALOG, getPartNamesForCategory, getPartByName, getDefaultPart };