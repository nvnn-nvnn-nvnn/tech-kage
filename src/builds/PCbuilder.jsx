import { useState, useRef, useEffect } from "react";
import { BuildAnalytics } from "../build-components/BuildAnalytics";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import TechKageLogo from '../assets/TechKage.svg';

// ─── THEME ───────────────────────────────────────────────────────
const T = {
  bg: "#050608",
  bgCard: "rgba(255,255,255,0.03)",
  bgHover: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.10)",
  borderHover: "rgba(255,255,255,0.16)",
  green: "#0FD980",
  greenDim: "rgba(15,217,128,0.55)",
  greenFaint: "rgba(15,217,128,0.10)",
  greenGlow: "rgba(15,217,128,0.18)",
  text: "rgba(255,255,255,0.92)",
  textMid: "rgba(255,255,255,0.72)",
  textDim: "rgba(255,255,255,0.55)",
  textFaint: "rgba(255,255,255,0.38)",
  font: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
};

// ─── STEPS ───────────────────────────────────────────────────────
const BUILD_STEPS = [
  "MODE",
  "BUDGET",
  "USE CASE",
  "PERFORMANCE",
  "COOLING",
  "GRAPHICS",
  "DETAILS",
];

const UPGRADE_STEPS = [
  "MODE",
  "CURRENT PC",
  "USE CASE",
  "PERFORMANCE",
  "COOLING",
  "GRAPHICS",
  "DETAILS",
];

const USAGE_OPTIONS = [
  { label: "Gaming", value: "gaming" },
  { label: "Video Editing", value: "video_editing" },
  { label: "Motion Graphics", value: "motion_graphics" },
  { label: "3D Rendering", value: "3d_rendering" },
  { label: "Streaming", value: "streaming" },
  { label: "Programming", value: "programming" },
  { label: "Music Production", value: "music" },
  { label: "General Use", value: "general" },
];

const EXISTING_PARTS = ["CPU", "GPU", "MOTHERBOARD", "RAM", "STORAGE", "PSU", "CASE", "CPU COOLER", "MONITOR", "OS"];
const PART_CATEGORIES = ["CPU", "GPU", "MOTHERBOARD", "RAM", "STORAGE", "PSU", "CASE", "COOLING"];

const MOCK_PARTS = {
  CPU: [
    {
      name: "AMD Ryzen 7 7800X3D",
      price: "$379",
      rating: 4.9,
      badge: "BEST PICK",
      spec: "8-Core · 5.0GHz · AM5 · 3D V-Cache · DDR5",
      imageUrl: "https://via.placeholder.com/300x200?text=Ryzen+7+7800X3D",
      reason: "The undisputed gaming king in 2026. 3D V-Cache delivers massive L3 bandwidth — the single biggest fps uplift per dollar at 1440p and 4K.",
    },
    {
      name: "AMD Ryzen 9 7950X3D",
      price: "$649",
      rating: 4.9,
      badge: "CREATOR + GAMING",
      spec: "16-Core · 5.7GHz · AM5 · 3D V-Cache · 120W Base TDP",
      imageUrl: "https://via.placeholder.com/300x200?text=Ryzen+9+7950X3D",
      reason: "The only chip that tops both gaming and heavy workloads simultaneously. Dual CCD design with a 3D cache die — overkill for most, perfect for pros.",
    },
    {
      name: "Intel Core i9-14900K",
      price: "$529",
      rating: 4.7,
      badge: "RUNNER UP",
      spec: "24-Core · 6.0GHz · LGA1700 · High IPC · Overclockable",
      imageUrl: "https://via.placeholder.com/300x200?text=Intel+i9-14900K",
      reason: "Intel's fastest consumer chip. Trades blows with AMD at 4K, dominates in single-threaded workloads. Runs hot — pair with a 360mm AIO.",
    },
  ],
  GPU: [
    {
      name: "NVIDIA RTX 4070 Super",
      price: "$599",
      rating: 4.9,
      badge: "BEST PICK",
      spec: "12GB GDDR6X · 220W TDP · DLSS 3.5 · Frame Gen",
      imageUrl: "https://via.placeholder.com/300x200?text=RTX+4070+Super",
      reason: "The best GPU value in 2026 at 1440p. Efficient, quiet, and DLSS 3.5 Frame Generation pushes well past 144fps at high settings.",
    },
    {
      name: "NVIDIA RTX 4080 Super",
      price: "$999",
      rating: 4.8,
      badge: "4K PICK",
      spec: "16GB GDDR6X · 320W TDP · DLSS 3.5 · AV1 Encode",
      imageUrl: "https://via.placeholder.com/300x200?text=RTX+4080+Super",
      reason: "Handles 4K at 144fps in most titles with DLSS Quality mode. Large 16GB VRAM buffer is future-proof for high-res textures and creative work.",
    },
    {
      name: "AMD RX 7900 XTX",
      price: "$879",
      rating: 4.7,
      badge: "AMD FLAGSHIP",
      spec: "24GB GDDR6 · 355W TDP · FSR 3 · DisplayPort 2.1",
      imageUrl: "https://via.placeholder.com/300x200?text=RX+7900+XTX",
      reason: "AMD's best. The 24GB VRAM is a genuine advantage for 3D rendering, AI workloads, and future games. Best for open-source and Linux setups.",
    },
  ],
  MOTHERBOARD: [
    {
      name: "ASUS TUF Gaming X670E-Plus WiFi",
      price: "$239",
      rating: 4.7,
      badge: "BEST PICK",
      spec: "ATX · X670E · DDR5 · WiFi 6E · PCIe 5.0 · AM5",
      imageUrl: "https://via.placeholder.com/300x200?text=TUF+X670E+Plus",
      reason: "Solid VRM, full PCIe 5.0 support, and WiFi 6E at a sane price. Best all-rounder for AM5 builds — compatible with all Ryzen 7000 series CPUs.",
    },
    {
      name: "MSI MAG Z790 Tomahawk WiFi",
      price: "$249",
      rating: 4.8,
      badge: "INTEL PICK",
      spec: "ATX · Z790 · DDR5 · WiFi 6E · PCIe 5.0 · LGA1700",
      imageUrl: "https://via.placeholder.com/300x200?text=Z790+Tomahawk",
      reason: "Best value Z790 board. Excellent VRM for overclocking, clean BIOS, and great build quality. Pairs perfectly with i7/i9 13th & 14th Gen chips.",
    },
    {
      name: "Gigabyte X670 AORUS Elite AX",
      price: "$259",
      rating: 4.6,
      badge: "PREMIUM AM5",
      spec: "ATX · X670 · DDR5 · WiFi 6E · Dual M.2 Thermal Guard",
      imageUrl: "https://via.placeholder.com/300x200?text=AORUS+X670+Elite",
      reason: "Strong power delivery and excellent thermal management for M.2 drives. Great for overclockers and content creators on the AM5 platform.",
    },
  ],
  RAM: [
    {
      name: "G.Skill Trident Z5 RGB 32GB",
      price: "$109",
      rating: 4.9,
      badge: "BEST PICK",
      spec: "DDR5-6000 · CL36 · 2x16GB · RGB · XMP 3.0",
      imageUrl: "https://via.placeholder.com/300x200?text=Trident+Z5+RGB",
      reason: "DDR5-6000 is the sweet spot for Ryzen AM5 — perfect for the Infinity Fabric. Tight CL36 timings and G.Skill's best-in-class reliability.",
    },
    {
      name: "Corsair Dominator Titanium 32GB",
      price: "$129",
      rating: 4.8,
      badge: "PREMIUM",
      spec: "DDR5-6000 · CL30 · 2x16GB · DHX Cooling · iCUE",
      imageUrl: "https://via.placeholder.com/300x200?text=Dominator+Titanium",
      reason: "Tighter CL30 timings give a measurable edge in CPU-bound workloads. Stunning aesthetics and deep Corsair iCUE software integration.",
    },
    {
      name: "Corsair Vengeance DDR5 32GB",
      price: "$79",
      rating: 4.6,
      badge: "VALUE PICK",
      spec: "DDR5-5200 · CL40 · 2x16GB · Low Profile · Plug & Play",
      imageUrl: "https://via.placeholder.com/300x200?text=Vengeance+DDR5",
      reason: "No-fuss DDR5 entry point. Slightly slower timings but works out of the box on any DDR5 board with no BIOS tuning required.",
    },
  ],
  STORAGE: [
    {
      name: "Samsung 990 Pro 2TB",
      price: "$149",
      rating: 4.9,
      badge: "BEST PICK",
      spec: "7,450 MB/s Read · 6,900 MB/s Write · PCIe 4.0 · V-NAND",
      imageUrl: "https://via.placeholder.com/300x200?text=Samsung+990+Pro",
      reason: "Samsung's fastest consumer NVMe. Consistent performance under sustained load — critical for video editing and large file transfers.",
    },
    {
      name: "WD Black SN850X 2TB",
      price: "$139",
      rating: 4.8,
      badge: "GAMING OPTIMIZED",
      spec: "7,300 MB/s Read · PCIe 4.0 · Game Mode 2.0 · Heatsink Option",
      imageUrl: "https://via.placeholder.com/300x200?text=WD+Black+SN850X",
      reason: "WD's Game Mode 2.0 pre-emptively loads game assets. Marginally behind Samsung in benchmarks but often cheaper and equally reliable.",
    },
    {
      name: "Seagate FireCuda 530 2TB",
      price: "$139",
      rating: 4.7,
      badge: "RUNNER UP",
      spec: "7,300 MB/s Read · PCIe 4.0 · Heatsink Included · 5yr Warranty",
      imageUrl: "https://via.placeholder.com/300x200?text=FireCuda+530",
      reason: "Top-tier endurance rating and a 5-year warranty. Includes a heatsink — great for builds without M.2 thermal pads on the motherboard.",
    },
  ],
  PSU: [
    {
      name: "Corsair RM850x 850W",
      price: "$129",
      rating: 4.9,
      badge: "BEST PICK",
      spec: "80+ Gold · Fully Modular · Zero RPM Fan Mode · 10yr Warranty",
      imageUrl: "https://via.placeholder.com/300x200?text=Corsair+RM850x",
      reason: "Industry benchmark for reliability. Zero-RPM mode keeps it silent at low loads. 850W headroom is perfect for high-end GPU + CPU combos.",
    },
    {
      name: "Seasonic Focus GX-850 850W",
      price: "$139",
      rating: 4.8,
      badge: "PREMIUM",
      spec: "80+ Gold · Fully Modular · Fluid Bearing Fan · 10yr Warranty",
      imageUrl: "https://via.placeholder.com/300x200?text=Seasonic+Focus+GX",
      reason: "Seasonic makes OEM units for half the industry. This is as good as PSUs get — Japanese capacitors and an exceptional 10-year warranty.",
    },
    {
      name: "Corsair RM1000x 1000W",
      price: "$179",
      rating: 4.9,
      badge: "HIGH-END BUILDS",
      spec: "80+ Gold · Fully Modular · PCIe 5.0 Ready · 1000W",
      imageUrl: "https://via.placeholder.com/300x200?text=Corsair+RM1000x",
      reason: "Necessary for RTX 4090 or dual-GPU workstation builds. PCIe 5.0 native connector eliminates the infamous 16-pin melt risk.",
    },
  ],
  CASE: [
    {
      name: "Lian Li O11 Dynamic EVO",
      price: "$149",
      rating: 4.9,
      badge: "BEST PICK",
      spec: "Mid Tower · Dual Chamber · Tool-Free · Excellent Cable Management",
      imageUrl: "https://via.placeholder.com/300x200?text=O11+Dynamic+EVO",
      reason: "The most popular enthusiast case for a reason. Dual chamber design keeps cables invisible and airflow unobstructed. Fits up to 9x 120mm fans.",
    },
    {
      name: "Fractal Torrent RGB",
      price: "$179",
      rating: 4.8,
      badge: "AIRFLOW KING",
      spec: "Mid Tower · 3x180mm Front Fans Included · High Airflow Mesh",
      imageUrl: "https://via.placeholder.com/300x200?text=Fractal+Torrent+RGB",
      reason: "Ships with three massive 180mm fans — serious airflow out of the box. Best choice for air-cooled high-performance builds.",
    },
    {
      name: "Corsair 4000D Airflow",
      price: "$89",
      rating: 4.8,
      badge: "BEST VALUE",
      spec: "Mid Tower · Mesh Front · 2 Pre-Installed Fans · Clean Interior",
      imageUrl: "https://via.placeholder.com/300x200?text=4000D+Airflow",
      reason: "Best budget case on the market. Clean internal layout, great airflow, and tool-free installation. Corsair's most popular case by a wide margin.",
    },
  ],
  COOLING: [
    {
      name: "NZXT Kraken 360 RGB",
      price: "$149",
      rating: 4.8,
      badge: "BEST PICK",
      spec: "360mm AIO · LCD Display · Quiet Asetek Pump · CAM Software",
      imageUrl: "https://via.placeholder.com/300x200?text=Kraken+360+RGB",
      reason: "360mm radiator keeps even a 14900K or 7950X3D cool under full load. The LCD screen is genuinely useful for monitoring temps at a glance.",
    },
    {
      name: "Arctic Liquid Freezer III 360",
      price: "$99",
      rating: 4.8,
      badge: "VALUE AIO",
      spec: "360mm AIO · 40mm VRM Fan · High Static Pressure · No RGB",
      imageUrl: "https://via.placeholder.com/300x200?text=Arctic+LF3+360",
      reason: "Outperforms AIOs twice its price in thermal benchmarks. The built-in VRM fan is a clever touch. Best-performing AIO under $100.",
    },
    {
      name: "Noctua NH-D15",
      price: "$99",
      rating: 4.9,
      badge: "ULTIMATE AIR",
      spec: "Dual Tower · 250W TDP · 2x NF-A15 Fans · SSO2 Bearing",
      imageUrl: "https://via.placeholder.com/300x200?text=Noctua+NH-D15",
      reason: "The best air cooler ever made. Competes with 240mm AIOs, whisper quiet, and will outlast the build. The brown colour is iconic at this point.",
    },
  ],
};

// ─── HELPERS ─────────────────────────────────────────────────────

function Badge({ text, green }) {
  return (
    <span style={{
      fontSize: 9, letterSpacing: 2, fontWeight: 600,
      color: green ? T.green : T.textDim,
      border: `1px solid ${green ? "rgba(15,217,128,0.3)" : T.border}`,
      background: green ? T.greenFaint : "rgba(255,255,255,0.03)",
      padding: "2px 8px", display: "inline-block", borderRadius: 3,
    }}>{text}</span>
  );
}

function Divider() {
  return (
    <div style={{
      height: 1,
      background: "linear-gradient(90deg, rgba(15,217,128,0.2), rgba(255,255,255,0.06), transparent)",
      margin: "22px 0",
    }} />
  );
}

function StepHeader({ stepNum, totalSteps, title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 10, letterSpacing: 5, color: T.green, marginBottom: 6, fontWeight: 600 }}>
        STEP {stepNum} OF {totalSteps}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: 0.5, marginBottom: 5 }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 13, color: T.textMid }}>{subtitle}</div>
      )}
      <Divider />
    </div>
  );
}

// ─── STEP INDICATOR ──────────────────────────────────────────────

function StepIndicator({ steps, currentStep }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 0, marginBottom: 36, flexWrap: "wrap",
    }}>
      {steps.map((step, i) => {
        const isActive = i === currentStep;
        const isDone = i < currentStep;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                border: `2px solid ${isActive ? T.green : isDone ? T.greenDim : T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isActive ? T.greenFaint : "rgba(255,255,255,0.02)",
                color: isActive ? T.green : isDone ? T.greenDim : T.textFaint,
                fontSize: 10, fontWeight: 700,
                boxShadow: isActive ? `0 0 14px ${T.greenGlow}` : "none",
                transition: "all 0.3s ease",
              }}>
                {isDone ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: 7, letterSpacing: 1.5, fontWeight: 600,
                color: isActive ? T.green : isDone ? T.greenDim : T.textFaint,
                transition: "all 0.3s ease",
              }}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 22, height: 1, marginBottom: 16,
                background: isDone ? T.greenDim : T.border,
                transition: "all 0.3s",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CardShell({ children }) {
  return (
    <div style={{
      width: "min(820px, 92vw)",
      background: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: 14,
      padding: 26,
      boxShadow: "0 18px 70px rgba(0,0,0,0.55)",
      backdropFilter: "blur(6px)",
    }}>
      {children}
    </div>
  );
}

// ─── SELECT CARD ─────────────────────────────────────────────────

function SelectCard({ selected, onClick, children, style = {} }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: "18px 20px", cursor: "pointer",
        border: `1px solid ${selected ? T.green : hover ? T.borderHover : T.border}`,
        background: selected ? T.greenFaint : hover ? T.bgHover : "rgba(255,255,255,0.02)",
        borderRadius: 8,
        boxShadow: selected ? `0 0 0 3px ${T.greenGlow}, inset 0 0 20px rgba(15,217,128,0.03)` : "none",
        transition: "all 0.15s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── STEP 0: MODE ────────────────────────────────────────────────

function ModeStep({ onSelect }) {
  const [hover, setHover] = useState(null);
  const options = [
    { value: "build", label: "NEW BUILD", desc: "Starting from scratch. We'll recommend every part from CPU to case.", icon: "◈", badge: "FRESH START" },
    { value: "upgrade", label: "UPGRADE", desc: "Already have a PC. We'll identify bottlenecks and recommend what to replace.", icon: "◇", badge: "KEEP WHAT WORKS" },
  ];

  return (
    <div style={{ animation: "fadeUp 0.35s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: T.green, marginBottom: 6, fontWeight: 600 }}>LET'S START</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: 0.5, marginBottom: 5 }}>WHAT ARE WE DOING?</div>
        <Divider />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {options.map((opt) => (
          <div
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            onMouseEnter={() => setHover(opt.value)}
            onMouseLeave={() => setHover(null)}
            style={{
              padding: "22px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 20,
              border: `1px solid ${hover === opt.value ? T.green : T.border}`,
              background: hover === opt.value ? T.greenFaint : "rgba(255,255,255,0.02)",
              borderRadius: 8,
              boxShadow: hover === opt.value ? `0 0 0 3px ${T.greenGlow}` : "none",
              transition: "all 0.15s ease",
            }}
          >
            <div style={{
              width: 52, height: 52, flexShrink: 0, borderRadius: 10,
              border: `1px solid ${hover === opt.value ? T.green : T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, color: hover === opt.value ? T.green : T.textDim,
              background: hover === opt.value ? T.greenFaint : "rgba(255,255,255,0.03)",
              transition: "all 0.15s ease",
            }}>{opt.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: T.text, letterSpacing: 0.5 }}>{opt.label}</span>
                <Badge text={opt.badge} green={hover === opt.value} />
              </div>
              <div style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6 }}>{opt.desc}</div>
            </div>
            <div style={{ fontSize: 18, color: hover === opt.value ? T.green : T.textFaint, transition: "all 0.15s" }}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STEP: CURRENT PC (UPGRADE) ──────────────────────────────────

function CurrentPCStep({ config, setConfig }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setConfig((c) => ({ ...c, systemScreenshot: e.target.result, screenshotName: file.name }));
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const togglePart = (part) => {
    setConfig((c) => ({
      ...c,
      existingParts: c.existingParts.includes(part)
        ? c.existingParts.filter((p) => p !== part)
        : [...c.existingParts, part],
    }));
  };

  return (
    <div style={{ animation: "fadeUp 0.35s ease" }}>
      <StepHeader stepNum="02" totalSteps="07" title="YOUR CURRENT PC" subtitle="Help us understand what you're working with" />

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: T.textDim, marginBottom: 10, fontWeight: 600 }}>
          OPTION 1 — UPLOAD SYSTEM INFO SCREENSHOT
        </div>
        <div style={{
          fontSize: 12, color: T.textMid, background: "rgba(255,255,255,0.03)",
          border: `1px solid ${T.border}`, padding: "10px 14px", marginBottom: 12,
          lineHeight: 1.7, borderRadius: 6,
        }}>
          Press <span style={{ background: "rgba(255,255,255,0.08)", padding: "2px 7px", borderRadius: 4, color: T.text, fontWeight: 600 }}>Win + R</span>{" "}
          → type <span style={{ background: "rgba(255,255,255,0.08)", padding: "2px 7px", borderRadius: 4, color: T.text, fontWeight: 600 }}>msinfo32</span>{" "}
          → screenshot the System Summary
        </div>

        {config.systemScreenshot ? (
          <div style={{
            border: `1px solid ${T.green}`, background: T.greenFaint,
            padding: "14px 16px", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: T.green, fontSize: 16 }}>✓</span>
              <span style={{ fontSize: 13, color: T.textMid }}>{config.screenshotName}</span>
            </div>
            <span
              onClick={() => setConfig((c) => ({ ...c, systemScreenshot: null, screenshotName: null }))}
              style={{ fontSize: 10, color: T.textDim, cursor: "pointer", letterSpacing: 1 }}
            >✕ REMOVE</span>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `1.5px dashed ${dragOver ? T.green : T.border}`,
              background: dragOver ? T.greenFaint : "rgba(255,255,255,0.02)",
              padding: "32px", textAlign: "center", cursor: "pointer",
              borderRadius: 8, transition: "all 0.15s ease",
            }}
          >
            <div style={{ fontSize: 28, color: T.textDim, marginBottom: 10 }}>⊕</div>
            <div style={{ fontSize: 12, color: T.textMid, letterSpacing: 1 }}>DROP SCREENSHOT HERE OR CLICK TO BROWSE</div>
            <div style={{ fontSize: 11, color: T.textDim, marginTop: 4 }}>PNG, JPG, WEBP supported</div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
          </div>
        )}
      </div>

      <Divider />

      <div>
        <div
          onClick={() => setManualMode(!manualMode)}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: manualMode ? 14 : 0 }}
        >
          <div style={{ fontSize: 10, letterSpacing: 3, color: T.textDim, fontWeight: 600 }}>OPTION 2 — SELECT PARTS YOU ALREADY OWN</div>
          <span style={{ fontSize: 12, color: T.textDim, transition: "transform 0.2s", display: "inline-block", transform: manualMode ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
        </div>

        {manualMode && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 14, animation: "fadeUp 0.2s ease" }}>
            {EXISTING_PARTS.map((part) => {
              const owned = config.existingParts.includes(part);
              return (
                <div
                  key={part}
                  onClick={() => togglePart(part)}
                  style={{
                    padding: "11px 14px", cursor: "pointer", borderRadius: 6,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    border: `1px solid ${owned ? T.green : T.border}`,
                    background: owned ? T.greenFaint : "rgba(255,255,255,0.02)",
                    transition: "all 0.12s",
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: owned ? 600 : 400, color: owned ? T.text : T.textMid, letterSpacing: 1 }}>{part}</span>
                  <div style={{
                    width: 16, height: 16, borderRadius: 4,
                    border: `1.5px solid ${owned ? T.green : T.border}`,
                    background: owned ? T.green : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, color: "#000", transition: "all 0.12s",
                  }}>{owned ? "✓" : ""}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STEP: USE CASE ──────────────────────────────────────────────

function UseCaseStep({ config, setConfig, stepNum, totalSteps }) {
  const toggleUsage = (val) => {
    setConfig((c) => ({
      ...c,
      usage: c.usage.includes(val) ? c.usage.filter((v) => v !== val) : [...c.usage, val],
    }));
  };

  return (
    <div style={{ animation: "fadeUp 0.35s ease" }}>
      <StepHeader stepNum={stepNum} totalSteps={totalSteps} title="USE CASE" subtitle="Select everything that applies — multiple OK" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {USAGE_OPTIONS.map((opt) => (
          <CheckRow key={opt.value} label={opt.label} selected={config.usage.includes(opt.value)} onClick={() => toggleUsage(opt.value)} />
        ))}
      </div>
    </div>
  );
}

// ─── STEP: PERFORMANCE ───────────────────────────────────────────

function PerformanceStep({ config, setConfig, stepNum, totalSteps }) {
  const options = [
    { value: "casual", label: "CASUAL", desc: "1080p gaming, light editing, everyday tasks. No need to go overboard.", specs: ["1080p / 60fps", "Light workloads", "Budget-friendly"], icon: "◇" },
    { value: "enthusiast", label: "ENTHUSIAST", desc: "1440p gaming, regular video editing, streaming simultaneously.", specs: ["1440p / 144fps", "Medium workloads", "Best value tier"], icon: "◈" },
    { value: "pro", label: "PRO", desc: "4K gaming, heavy 3D/video work, no compromises. Max performance.", specs: ["4K / 144fps+", "Heavy workloads", "Top-end parts"], icon: "◈◈" },
  ];

  return (
    <div style={{ animation: "fadeUp 0.35s ease" }}>
      <StepHeader stepNum={stepNum} totalSteps={totalSteps} title="PERFORMANCE TARGET" subtitle="How demanding are your workloads?" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {options.map((opt) => {
          const sel = config.performance === opt.value;
          return (
            <SelectCard key={opt.value} selected={sel} onClick={() => setConfig((c) => ({ ...c, performance: opt.value }))}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{
                  width: 42, height: 42, flexShrink: 0, borderRadius: 8,
                  border: `1px solid ${sel ? T.green : T.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, color: sel ? T.green : T.textDim,
                  background: sel ? T.greenFaint : "rgba(255,255,255,0.03)",
                  transition: "all 0.15s",
                }}>{opt.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: T.text, letterSpacing: 0.5, marginBottom: 5 }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.6, marginBottom: 9 }}>{opt.desc}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {opt.specs.map((s) => <Badge key={s} text={s} green={sel} />)}
                  </div>
                </div>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                  border: `2px solid ${sel ? T.green : T.border}`,
                  background: sel ? T.green : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, color: "#000", transition: "all 0.15s",
                }}>{sel ? "✓" : ""}</div>
              </div>
            </SelectCard>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP: COOLING ───────────────────────────────────────────────

function CoolingStep({ config, setConfig, stepNum, totalSteps }) {
  const options = [
    { value: "water", label: "LIQUID COOLED", desc: "AIO or custom loop. Best thermals, clean look, visual impact.", badge: "BEST THERMALS", icon: "〇" },
    { value: "air", label: "AIR COOLED", desc: "Tower cooler. Dead reliable, no leak risk, often quieter.", badge: "RELIABLE", icon: "◻" },
  ];
  return (
    <div style={{ animation: "fadeUp 0.35s ease" }}>
      <StepHeader stepNum={stepNum} totalSteps={totalSteps} title="COOLING" subtitle="How do you want to manage thermals?" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {options.map((opt) => {
          const sel = config.cooling === opt.value;
          return (
            <SelectCard key={opt.value} selected={sel} onClick={() => setConfig((c) => ({ ...c, cooling: opt.value }))}>
              <div style={{ fontSize: 26, color: sel ? T.green : T.textDim, marginBottom: 14, letterSpacing: 3 }}>{opt.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.text, letterSpacing: 0.5, marginBottom: 8 }}>{opt.label}</div>
              <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.6, marginBottom: 12 }}>{opt.desc}</div>
              <Badge text={opt.badge} green={sel} />
            </SelectCard>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP: GRAPHICS ──────────────────────────────────────────────

function GraphicsStep({ config, setConfig, stepNum, totalSteps }) {
  const options = [
    { value: "yes", label: "GRAPHICS HEAVY", desc: "Maximize GPU budget. Best for 4K gaming, 3D, video, VR.", badge: "GPU FOCUSED", icon: "◈◈◈" },
    { value: "no", label: "BALANCED", desc: "Even allocation across all components for all-round performance.", badge: "WELL ROUNDED", icon: "◈◈" },
  ];
  return (
    <div style={{ animation: "fadeUp 0.35s ease" }}>
      <StepHeader stepNum={stepNum} totalSteps={totalSteps} title="GRAPHICS PRIORITY" subtitle="Should we go heavy on the GPU?" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {options.map((opt) => {
          const sel = config.graphics === opt.value;
          return (
            <SelectCard key={opt.value} selected={sel} onClick={() => setConfig((c) => ({ ...c, graphics: opt.value }))}>
              <div style={{ fontSize: 22, color: sel ? T.green : T.textDim, marginBottom: 14, letterSpacing: 3 }}>{opt.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: T.text, letterSpacing: 0.5, marginBottom: 8 }}>{opt.label}</div>
              <div style={{ fontSize: 12, color: T.textMid, lineHeight: 1.6, marginBottom: 12 }}>{opt.desc}</div>
              <Badge text={opt.badge} green={sel} />
            </SelectCard>
          );
        })}
      </div>
    </div>
  );
}

// ─── STEP: DETAILS ───────────────────────────────────────────────

function DetailsStep({ config, setConfig, stepNum, totalSteps }) {
  const toggle = (key, val) => setConfig((c) => ({ ...c, [key]: c[key] === val ? null : val }));

  const ToggleGroup = ({ label, configKey, options }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, letterSpacing: 3, color: T.textDim, marginBottom: 10, fontWeight: 600 }}>{label}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.map((opt) => {
          const sel = config[configKey] === opt.value;
          return (
            <div
              key={opt.value}
              onClick={() => toggle(configKey, opt.value)}
              style={{
                padding: "8px 16px", cursor: "pointer", fontSize: 12, fontWeight: sel ? 600 : 400,
                borderRadius: 6, letterSpacing: 0.5,
                border: `1px solid ${sel ? T.green : T.border}`,
                color: sel ? T.text : T.textMid,
                background: sel ? T.greenFaint : "rgba(255,255,255,0.02)",
                transition: "all 0.12s ease",
              }}
            >
              {sel && <span style={{ color: T.green, marginRight: 6, fontSize: 9 }}>✓</span>}
              {opt.label}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ animation: "fadeUp 0.35s ease" }}>
      <StepHeader stepNum={stepNum} totalSteps={totalSteps} title="FINAL DETAILS" subtitle="Optional but helps us fine-tune your build" />

      <ToggleGroup label="FORM FACTOR" configKey="formFactor" options={[
        { value: "full", label: "Full Tower" }, { value: "mid", label: "Mid Tower" },
        { value: "itx", label: "Mini-ITX" }, { value: "any", label: "No Preference" },
      ]} />
      <ToggleGroup label="NOISE SENSITIVITY" configKey="noise" options={[
        { value: "silent", label: "Silent Priority" }, { value: "balanced", label: "Balanced" }, { value: "performance", label: "Performance First" },
      ]} />
      <ToggleGroup label="RGB / AESTHETICS" configKey="rgb" options={[
        { value: "yes", label: "Love RGB" }, { value: "subtle", label: "Subtle Only" }, { value: "no", label: "No RGB" },
      ]} />
      <ToggleGroup label="FUTURE PROOFING" configKey="futureProof" options={[
        { value: "yes", label: "Plan to Upgrade in 1-2yr" }, { value: "no", label: "Set & Forget" },
      ]} />

      <Divider />

      <div>
        <div style={{ fontSize: 10, letterSpacing: 3, color: T.textDim, marginBottom: 10, fontWeight: 600 }}>ANYTHING ELSE? (OPTIONAL)</div>
        <textarea
          value={config.extras}
          onChange={(e) => setConfig((c) => ({ ...c, extras: e.target.value }))}
          placeholder="Brand preferences, specific parts, colour scheme, hard requirements..."
          style={{
            width: "100%", height: 90, background: "rgba(255,255,255,0.03)",
            border: `1px solid ${T.border}`, color: T.text, fontSize: 13,
            fontFamily: T.font, padding: "12px 14px", resize: "none",
            outline: "none", lineHeight: 1.7, boxSizing: "border-box",
            borderRadius: 8, transition: "border-color 0.15s",
          }}
          onFocus={(e) => e.target.style.borderColor = T.green}
          onBlur={(e) => e.target.style.borderColor = T.border}
        />
      </div>
    </div>
  );
}

// ─── LOADING ─────────────────────────────────────────────────────

function LoadingScreen({ isUpgrade }) {
  const [progress, setProgress] = useState(0);
  const [taskIdx, setTaskIdx] = useState(0);

  const tasks = isUpgrade
    ? ["READING SYSTEM SPECS...", "IDENTIFYING BOTTLENECKS...", "CHECKING COMPATIBILITY...", "PRICING UPGRADES...", "RANKING BY IMPACT...", "BUILDING YOUR LIST..."]
    : ["ANALYZING REQUIREMENTS...", "QUERYING PART DATABASE...", "CHECKING COMPATIBILITY...", "OPTIMIZING FOR BUDGET...", "BENCHMARKING OPTIONS...", "CURATING YOUR BUILD..."];

  useEffect(() => {
    const p = setInterval(() => setProgress((v) => v >= 100 ? 100 : v + 1.5), 42);
    const t = setInterval(() => setTaskIdx((v) => v < tasks.length - 1 ? v + 1 : v), 440);
    return () => { clearInterval(p); clearInterval(t); };
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "28px 0", animation: "fadeUp 0.4s ease" }}>
      <div style={{ fontSize: 12, letterSpacing: 6, color: T.green, marginBottom: 32, fontWeight: 600 }}>
        {isUpgrade ? "UPGRADE ENGINE" : "BUILD ENGINE"}
      </div>
      <img
        src={TechKageLogo}
        alt="Loading..."
        style={{
          width: 75,
          height: 75,
          animation: "spin 1s linear infinite reverse",
          display: "block",
          margin: "0 auto 28px",
        }}
      />
      <div style={{ maxWidth: 340, margin: "0 auto 10px", height: 3, background: T.border, borderRadius: 999, position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: `${progress}%`,
          background: T.green, boxShadow: `0 0 12px ${T.greenDim}`,
          transition: "width 0.05s linear", borderRadius: 999,
        }} />
      </div>
      <div style={{ fontSize: 12, color: T.textMid, marginBottom: 20 }}>{Math.floor(progress)}%</div>
      <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 3 }}>{tasks[taskIdx]}</div>
    </div>
  );
}

// ─── RESULTS ─────────────────────────────────────────────────────

function ResultsStep({ config }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const cat = PART_CATEGORIES[activeTab];

  const [localBuild, setLocalBuild] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);
  const [lastSavedBuildName, setLastSavedBuildName] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { addBuild } = useCart();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalPrice = Object.values({ ...config.generatedBuild, ...localBuild }).reduce((sum, part) => {
    const price = parseFloat(String(part.price ?? part.priceNumeric ?? 0).replace(/[^0-9.]/g, '')) || 0;
    return sum + price;
  }, 0);

  const handlePartSwap = (category, newPart) => {
    setLocalBuild(prev => ({ ...prev, [category]: newPart }));
  };

  const buildData = config.generatedBuild;
  const parts = localBuild[cat]
    ? [localBuild[cat]]
    : (buildData && buildData[cat] ? [buildData[cat]] : (MOCK_PARTS[cat] || []));

  const isUpgrade = config.mode === "upgrade";

  const handleSaveBuild = async () => {
    if (!user) { setShowAuthModal(true); return; }
    setSaveStatus("saving");

    const finalBuild = { ...config.generatedBuild, ...localBuild };
    const buildName = [
      config.performance ? config.performance.charAt(0).toUpperCase() + config.performance.slice(1) : null,
      config.usage?.length ? config.usage[0].replace('_', ' ') : null,
      "Build",
    ].filter(Boolean).join(" ");

    setLastSavedBuildName(buildName);

    const { data: existing, error: existingError } = await supabase
      .from("saved_builds")
      .select("id")
      .eq("user_id", user.id)
      .eq("build_name", buildName)
      .maybeSingle();

    if (existingError) { setSaveStatus("error"); return; }
    if (existing) { setSaveStatus("duplicate"); return; }

    const savePromise = supabase.from("saved_builds").insert({
      user_id: user.id, build_name: buildName,
      build_data: finalBuild, total_price: totalPrice, config,
    });

    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 8000));
    const { error } = await Promise.race([savePromise, timeoutPromise]);

    if (error) { setSaveStatus("error"); } else { setSaveStatus("saved"); }
  };

  return (
    <div style={{ animation: "fadeUp 0.35s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: T.green, marginBottom: 5, fontWeight: 600 }}>
          {isUpgrade ? "UPGRADE COMPLETE" : "BUILD COMPLETE"}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: 0.5, marginBottom: 12 }}>
          {isUpgrade ? "YOUR RECOMMENDED UPGRADES" : "YOUR CURATED PARTS LIST"}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            config.budget && `$${config.budget}`,
            config.performance?.toUpperCase(),
            config.cooling === "water" ? "LIQUID" : config.cooling === "air" ? "AIR COOLED" : null,
            config.graphics === "yes" ? "GPU HEAVY" : config.graphics === "no" ? "BALANCED" : null,
            config.retailer?.toUpperCase(),
          ].filter(Boolean).map((t) => <Badge key={t} text={t} green />)}
        </div>
        <Divider />

        {/* Total + actions */}
        <div style={{
          marginTop: 16, padding: "18px 20px",
          background: "rgba(255,255,255,0.02)", border: `1px solid ${T.border}`,
          borderRadius: 8, display: "flex", flexDirection: "column", gap: 16,
        }}>
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: isMobile ? "flex-start" : "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            flexWrap: "wrap", gap: isMobile ? 12 : 16,
          }}>
            <div>
              <div style={{ fontSize: 9, color: T.textDim, letterSpacing: 3, marginBottom: 4 }}>ESTIMATED TOTAL</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: T.text }}>${totalPrice || "---"}</div>
            </div>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 6 : 8 }}>
              <div onClick={() => setShowExportModal(true)}><OutlineBtn label="EXPORT" /></div>
              <div
                onClick={() => {
                  const buildData = { ...config.generatedBuild, ...localBuild };
                  const buildName = [config.performance, config.usage?.[0], "Build"].filter(Boolean).join(" ");
                  addBuild(buildData, totalPrice, config, buildName);
                  navigate("/cart");
                }}
              >
                <SolidBtn label="ADD TO CART →" />
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, lineHeight: 1.55, color: T.textMid, paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
            <div style={{ color: "#ffaa44", fontWeight: 600, marginBottom: 8, letterSpacing: 0.3 }}>Important notes:</div>
            <div style={{ marginBottom: 6 }}>• <strong style={{ color: T.text }}>Adding to cart / purchasing</strong> is currently only for <strong>pre-built systems</strong>.</div>
            <div style={{ marginBottom: 6 }}>• This list represents a custom configuration — it is <strong>not</strong> a direct parts shopping cart.</div>
            <div style={{ color: T.green, fontWeight: 500, margin: "12px 0 4px 0" }}>We can build this exact configuration for you</div>
            <div style={{ fontSize: 12.5, color: T.textFaint, marginTop: 4 }}>Bulk part orders (individual components) will be available soon.</div>
          </div>
        </div>

        {/* Save button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          <button
            onClick={handleSaveBuild}
            disabled={saveStatus === "saving"}
            onMouseEnter={e => {
              if (saveStatus !== "saving") {
                e.currentTarget.style.background = "rgba(15,217,128,0.12)";
                e.currentTarget.style.borderColor = T.green;
                e.currentTarget.style.color = T.green;
                e.currentTarget.style.boxShadow = "0 0 20px rgba(15,217,128,0.2)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(15,217,128,0.3)";
              e.currentTarget.style.color = "rgba(15,217,128,0.7)";
              e.currentTarget.style.boxShadow = "none";
            }}
            style={{
              padding: "9px 20px", fontSize: 11, fontWeight: 700, letterSpacing: 2,
              cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
              borderRadius: 8, border: "1px solid rgba(15,217,128,0.3)",
              background: "transparent", color: "rgba(15,217,128,0.7)",
              fontFamily: T.font, transition: "all 0.2s ease", boxShadow: "none",
            }}
          >
            {saveStatus === "saving" ? "SAVING..." : "↓ SAVE BUILD"}
          </button>
        </div>

        {/* Modals */}
        {showAuthModal && (
          <>
            <div onClick={() => setShowAuthModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", zIndex: 9998 }} />
            <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: "32px 28px", zIndex: 9999, textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>🔒</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 8 }}>Account Required</div>
              <div style={{ fontSize: 13, color: T.textMid, marginBottom: 24, lineHeight: 1.6 }}>You need to be logged in to save builds to your profile.</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <div onClick={() => setShowAuthModal(false)} style={{ padding: "10px 20px", fontSize: 11, letterSpacing: 2, fontWeight: 600, cursor: "pointer", borderRadius: 8, border: `1px solid ${T.border}`, color: T.textMid, background: "transparent" }}>CANCEL</div>
                <div onClick={() => { setShowAuthModal(false); window.dispatchEvent(new CustomEvent('open-auth-modal')); }} style={{ padding: "10px 20px", fontSize: 11, letterSpacing: 2, fontWeight: 700, cursor: "pointer", borderRadius: 8, background: T.green, color: "#050608", boxShadow: "0 4px 14px rgba(15,217,128,0.28)" }}>LOG IN →</div>
              </div>
            </div>
          </>
        )}

        {saveStatus === "error" && (
          <div onClick={() => setSaveStatus(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: T.bgCard, border: "1px solid rgba(255,100,100,0.3)", borderRadius: 16, padding: "48px 40px", maxWidth: 420, width: "90%", textAlign: "center", boxShadow: "0 25px 80px rgba(0,0,0,0.6)" }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>⚠️</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 12, letterSpacing: 0.5 }}>Save Failed</div>
              <div style={{ fontSize: 14, color: T.textMid, marginBottom: 32, lineHeight: 1.7 }}>Something went wrong. Please try again.</div>
              <div onClick={() => setSaveStatus(null)} style={{ padding: "12px 24px", fontSize: 12, letterSpacing: 2, fontWeight: 700, cursor: "pointer", borderRadius: 10, background: T.green, color: "#050608", display: "inline-block" }}>CLOSE</div>
            </div>
          </div>
        )}

        {saveStatus === "saved" && (
          <div onClick={() => setSaveStatus(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: T.bgCard, border: "1px solid rgba(15,217,128,0.3)", borderRadius: 16, padding: "48px 40px", maxWidth: 420, width: "90%", textAlign: "center", boxShadow: "0 25px 80px rgba(0,0,0,0.6)" }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>✅</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: T.green, marginBottom: 12, letterSpacing: 0.5 }}>Build Saved!</div>
              <div style={{ fontSize: 14, color: T.textMid, marginBottom: 32, lineHeight: 1.7 }}>Your build has been saved to your profile.</div>
              <div onClick={() => setSaveStatus(null)} style={{ padding: "12px 24px", fontSize: 12, letterSpacing: 2, fontWeight: 700, cursor: "pointer", borderRadius: 10, background: T.green, color: "#050608", display: "inline-block" }}>DONE</div>
            </div>
          </div>
        )}

        {saveStatus === "duplicate" && (
          <div onClick={() => setSaveStatus(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: T.bgCard, border: "1px solid rgba(255,170,0,0.3)", borderRadius: 16, padding: "48px 40px", maxWidth: 420, width: "90%", textAlign: "center", boxShadow: "0 25px 80px rgba(0,0,0,0.6)" }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>⚠️</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#ffaa00", marginBottom: 12, letterSpacing: 0.5 }}>Already Saved</div>
              <div style={{ fontSize: 14, color: T.textMid, marginBottom: 32, lineHeight: 1.7 }}>A build named <strong style={{ color: T.text }}>"{lastSavedBuildName || "This build"}"</strong> is already in your profile.</div>
              <div onClick={() => setSaveStatus(null)} style={{ padding: "12px 24px", fontSize: 12, letterSpacing: 2, fontWeight: 700, cursor: "pointer", borderRadius: 10, background: "#ffaa00", color: "#050608", display: "inline-block" }}>GOT IT</div>
            </div>
          </div>
        )}

        {showExportModal && (
          <ExportModal
            config={config}
            currentBuild={{ ...config.generatedBuild, ...localBuild }}
            onClose={() => setShowExportModal(false)}
          />
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, marginBottom: 14, overflowX: "auto" }}>
        {PART_CATEGORIES.map((c, i) => (
          <div key={c} onClick={() => setActiveTab(i)} style={{ padding: "8px 14px", cursor: "pointer", whiteSpace: "nowrap", fontSize: 10, letterSpacing: 2, fontWeight: 600, color: activeTab === i ? T.text : T.textDim, borderBottom: `2px solid ${activeTab === i ? T.green : "transparent"}`, transition: "all 0.15s" }}>{c}</div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {parts.map((part, i) => (
          <PartRow key={i} part={part} isTop={i === 0} category={cat} buildConfig={config} onPartSwap={handlePartSwap} isMobile={isMobile} />
        ))}
      </div>

      <BuildAnalytics config={config} generatedBuild={{ ...config.generatedBuild, ...localBuild }} />

      <div style={{ marginTop: 28, padding: "12px 16px", background: T.greenFaint, border: `1px solid rgba(15,217,128,0.2)`, borderRadius: 8, display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ color: T.green, fontSize: 14, marginTop: 1 }}>✓</span>
        <div>
          <div style={{ fontSize: 10, color: T.green, letterSpacing: 2, marginBottom: 4, fontWeight: 600 }}>COMPATIBILITY VERIFIED</div>
          <div style={{ fontSize: 12, color: T.textMid }}>All parts are socket, chipset, and DDR generation compatible with each other.</div>
        </div>
      </div>
    </div>
  );
}

// ─── PART ROW ────────────────────────────────────────────────────

function PartRow({ part, isTop, category, buildConfig, onPartSwap, isMobile }) {
  const [hover, setHover] = useState(false);
  const [currentPart, setCurrentPart] = useState(part);
  const [loadingAlt, setLoadingAlt] = useState(false);

  useEffect(() => { setCurrentPart(part); }, [part]);

  const fetchAlternative = async (type) => {
    setLoadingAlt(true);
    try {
      const res = await fetch('http://localhost:3001/api/alternative-part', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, currentPart, type, config: buildConfig }),
      });
      const data = await res.json();
      if (data.success) { setCurrentPart(data.part); onPartSwap(category, data.part); }
      else console.error('Alternative part failed:', data.error);
    } catch (err) {
      console.error('Network error:', err);
    } finally {
      setLoadingAlt(false);
    }
  };

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: isMobile ? "20px 16px" : "32px 28px",
        display: "flex", flexDirection: "column",
        border: `1px solid ${hover ? "rgba(15,217,128,0.18)" : T.border}`,
        background: hover ? "rgba(15,217,128,0.04)" : "rgba(15,217,128,0.015)",
        borderRadius: 12, transition: "all 0.22s ease",
        boxShadow: hover ? "0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(15,217,128,0.08)" : "none",
        position: "relative", overflow: "hidden",
      }}
    >
      {isTop && (
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: T.green, opacity: 0.8, borderRadius: "12px 0 0 12px" }} />
      )}

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: isMobile ? 16 : 32 }}>
        <div style={{ display: "flex", gap: isMobile ? 12 : 24, flex: 1 }}>
          {part.imageUrl && (
            <div style={{ width: isMobile ? 80 : 100, height: isMobile ? 80 : 100, flexShrink: 0, borderRadius: 10, background: "rgba(255,255,255,0.02)", padding: 8, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}` }}>
              <img src={currentPart.imageUrl} alt={currentPart.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
              <h3 style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: T.text, margin: 0, letterSpacing: -0.2 }}>{currentPart.name}</h3>
              <Badge text={currentPart.badge} green={isTop} />
            </div>
            <div style={{ fontSize: 15, color: T.textMid, marginBottom: 12, letterSpacing: 0.1 }}>{currentPart.spec}</div>
            {currentPart.reason && (
              <p style={{ fontSize: 13.5, color: T.textDim, lineHeight: 1.5, marginBottom: 16, fontStyle: "italic", opacity: 0.92 }}>{currentPart.reason}</p>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ fontSize: 16, color: s <= Math.round(currentPart.rating || 0) ? T.green : "rgba(255,255,255,0.12)" }}>★</span>
                ))}
              </div>
              <span style={{ fontSize: 13, color: T.textMid, fontWeight: 500 }}>{part.rating || "—"}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16, minWidth: 140 }}>
          <span style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: T.text }}>{currentPart.price}</span>
          <button style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, color: hover ? T.green : T.textMid, background: hover ? "rgba(15,217,128,0.12)" : "transparent", border: `1px solid ${hover ? "rgba(15,217,128,0.3)" : T.border}`, borderRadius: 8, cursor: "pointer", transition: "all 0.2s ease", letterSpacing: 0.4 }}>
            View Details →
          </button>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-start", gap: 16, marginTop: 24, paddingTop: 16, borderTop: `1px solid ${T.border}`, fontSize: 13, color: T.textMid }}>
        <button onClick={() => fetchAlternative('better')} disabled={loadingAlt} style={{ background: "none", border: "none", color: T.green, fontWeight: 500, cursor: "pointer", padding: "4px 8px", borderRadius: 6, transition: "all 0.18s ease", fontFamily: "'Orbitron', sans-serif" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#ffffff"; }} onMouseLeave={(e) => { e.currentTarget.style.color = T.green; }}>
          {loadingAlt ? 'Finding...' : 'Find Better Alternative'}
        </button>
        <button onClick={() => fetchAlternative('cheaper')} disabled={loadingAlt} style={{ background: "none", border: "none", color: "#ffaa44", fontWeight: 500, cursor: "pointer", padding: "4px 8px", borderRadius: 6, transition: "all 0.18s ease", fontFamily: "'Orbitron', sans-serif" }} onMouseEnter={(e) => { e.currentTarget.style.color = "#ffd399"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#ffaa44"; }}>
          {loadingAlt ? 'Finding...' : 'Find More Budget Friendly Alternative'}
        </button>
      </div>
    </div>
  );
}

// ─── SMALL COMPONENTS ────────────────────────────────────────────

function CheckRow({ label, selected, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ padding: "12px 14px", cursor: "pointer", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${selected ? T.green : hover ? T.borderHover : T.border}`, background: selected ? T.greenFaint : hover ? T.bgHover : "rgba(255,255,255,0.02)", transition: "all 0.12s" }}>
      <span style={{ fontSize: 12, fontWeight: selected ? 600 : 400, color: selected ? T.text : T.textMid, letterSpacing: 0.5 }}>{label.toUpperCase()}</span>
      <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${selected ? T.green : T.border}`, background: selected ? T.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#000", transition: "all 0.12s" }}>{selected ? "✓" : ""}</div>
    </div>
  );
}

function OutlineBtn({ label }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ padding: "10px 20px", fontSize: 11, letterSpacing: 2, fontWeight: 600, cursor: "pointer", borderRadius: 8, border: `1px solid ${h ? T.borderHover : T.border}`, color: h ? T.text : T.textMid, background: h ? T.bgHover : "transparent", transition: "all 0.15s" }}>{label}</div>
  );
}

function SolidBtn({ label }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ padding: "10px 20px", fontSize: 11, letterSpacing: 2, fontWeight: 700, cursor: "pointer", borderRadius: 8, background: h ? "#1BF08E" : T.green, color: "#050608", boxShadow: h ? "0 6px 20px rgba(15,217,128,0.5)" : "0 4px 14px rgba(15,217,128,0.28)", transition: "all 0.15s", transform: h ? "translateY(-1px)" : "translateY(0)" }}>{label}</div>
  );
}

// ─── EXPORT MODAL ────────────────────────────────────────────────

function ExportModal({ config, currentBuild, onClose }) {
  const buildData = currentBuild || {};
  const totalPrice = Object.values(currentBuild).reduce((sum, part) => {
    const price = parseFloat(String(part.price ?? part.priceNumeric ?? 0).replace(/[^0-9.]/g, '')) || 0;
    return sum + price;
  }, 0);

  const copyToClipboard = () => {
    const text = `PC BUILD - ${config.performance?.toUpperCase() || 'CUSTOM'} ($${totalPrice})\n${'━'.repeat(40)}\n\n${Object.entries(buildData).map(([category, part]) => `${category.padEnd(12)} ${part.name}\n${' '.repeat(12)} ${part.price}`).join('\n\n')}\n\n${'━'.repeat(40)}\nTOTAL: $${totalPrice}\n\nBudget: $${config.budget} · Use Case: ${config.usage?.join(', ') || 'General'} · Performance: ${config.performance || 'N/A'}`;
    navigator.clipboard.writeText(text);
    alert('Build copied to clipboard!');
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', zIndex: 9998 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: '0 20px 60px rgba(0,0,0,0.8)', maxWidth: 600, width: '90%', maxHeight: '80vh', overflow: 'hidden', zIndex: 9999 }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: T.green, marginBottom: 4, fontWeight: 600 }}>EXPORT BUILD</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.text }}>Your Parts List</div>
          </div>
          <div onClick={onClose} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 6, border: `1px solid ${T.border}`, color: T.textDim, fontSize: 18 }}>×</div>
        </div>
        <div style={{ padding: '20px 24px', maxHeight: 'calc(80vh - 180px)', overflowY: 'auto' }}>
          {Object.entries(buildData).map(([category, part]) => (
            <div key={category} style={{ marginBottom: 16, padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${T.border}`, borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 9, letterSpacing: 2, color: T.textDim, fontWeight: 600 }}>{category}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: T.green }}>{part.price}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 4 }}>{part.name || 'Unnamed part'}</div>
              <div style={{ fontSize: 11, color: T.textMid, lineHeight: 1.5 }}>Optimized choice for your build</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 9, color: T.textDim, letterSpacing: 2, marginBottom: 2 }}>TOTAL</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.text }}>${totalPrice}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div onClick={copyToClipboard} style={{ padding: '10px 20px', fontSize: 11, letterSpacing: 2, fontWeight: 600, cursor: 'pointer', borderRadius: 8, border: `1px solid ${T.border}`, color: T.text, background: T.bgHover }}>📋 COPY</div>
            <div onClick={() => window.print()} style={{ padding: '10px 20px', fontSize: 11, letterSpacing: 2, fontWeight: 700, cursor: 'pointer', borderRadius: 8, background: T.green, color: '#050608', boxShadow: '0 4px 14px rgba(15,217,128,0.28)' }}>🖨️ PRINT</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────

const EMPTY_CONFIG = {
  mode: null, budget: null, usage: [], performance: null,
  cooling: null, graphics: null, formFactor: null, noise: null,
  rgb: null, futureProof: null, retailer: "any", extras: "",
  systemScreenshot: null, screenshotName: null, existingParts: [],
};

const STORAGE_KEY = "pcbuilder_progress_v1";

function loadSavedProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function PCBuilder() {
  const [step, setStep] = useState(() => {
    const saved = loadSavedProgress();
    return typeof saved?.step === "number" ? saved.step : 0;
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(() => {
    const saved = loadSavedProgress();
    return typeof saved?.done === "boolean" ? saved.done : false;
  });
  const [config, setConfig] = useState(() => {
    const saved = loadSavedProgress();
    return saved?.config ? { ...EMPTY_CONFIG, ...saved.config } : { ...EMPTY_CONFIG };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, done, config }));
    } catch { }
  }, [step, done, config]);

  useEffect(() => {
    const hasProgress = step > 0 || done || config.mode !== null || config.budget !== null ||
      (config.usage && config.usage.length > 0) || config.performance !== null ||
      config.cooling !== null || config.graphics !== null ||
      (config.extras && config.extras.trim().length > 0);

    const handleBeforeUnload = (e) => {
      if (!hasProgress) return;
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [step, done, config]);

  const isUpgrade = config.mode === "upgrade";
  const steps = isUpgrade ? UPGRADE_STEPS : BUILD_STEPS;
  const lastContentStep = 6;

  const canAdvance = () => {
    if (step === 0) return false;
    if (isUpgrade) {
      if (step === 1) return config.systemScreenshot || config.existingParts.length > 0;
      if (step === 2) return config.usage.length > 0;
      if (step === 3) return config.performance !== null;
      if (step === 4) return config.cooling !== null;
      if (step === 5) return config.graphics !== null;
      return true;
    } else {
      if (step === 1) return config.budget !== null;
      if (step === 2) return config.usage.length > 0;
      if (step === 3) return config.performance !== null;
      if (step === 4) return config.cooling !== null;
      if (step === 5) return config.graphics !== null;
      return true;
    }
  };

  const handleModeSelect = (mode) => {
    if (mode === "upgrade") {
      alert("Upgrade functionality is work in progress. Only the 'New Build' option is fully functional at this time.");
      return;
    }
    setConfig((c) => ({ ...c, mode }));
    setStep(1);
  };

  const handleNext = async () => {
    if (step === lastContentStep) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/generate-build', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });
        const data = await response.json();
        if (data.success) {
          setConfig((c) => ({ ...c, generatedBuild: data.build, totalPrice: data.totalPrice }));
          setDone(true);
        } else {
          alert('Failed to generate build. Check console for details.');
        }
      } catch (error) {
        alert("Could not connect to backend. Make sure it's running on port 3001.");
      } finally {
        setLoading(false);
      }
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));
  const reset = () => {
    setStep(0); setLoading(false); setDone(false); setConfig(EMPTY_CONFIG);
    try { localStorage.removeItem(STORAGE_KEY); } catch { }
  };

  const renderStep = () => {
    if (step === 0) return <ModeStep onSelect={handleModeSelect} />;
    if (isUpgrade) {
      if (step === 1) return <CurrentPCStep config={config} setConfig={setConfig} />;
      if (step === 2) return <UseCaseStep config={config} setConfig={setConfig} stepNum="03" totalSteps="07" />;
      if (step === 3) return <PerformanceStep config={config} setConfig={setConfig} stepNum="04" totalSteps="07" />;
      if (step === 4) return <CoolingStep config={config} setConfig={setConfig} stepNum="05" totalSteps="07" />;
      if (step === 5) return <GraphicsStep config={config} setConfig={setConfig} stepNum="06" totalSteps="07" />;
      if (step === 6) return <DetailsStep config={config} setConfig={setConfig} stepNum="07" totalSteps="07" />;
    } else {
      if (step === 1) return (
        <div style={{ animation: "fadeUp 0.35s ease" }}>
          <StepHeader stepNum="01" totalSteps="06" title="SET YOUR BUDGET" subtitle="How much are you investing in this build?" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Under $600", sublabel: "ENTRY LEVEL", value: 600 },
              { label: "Under $1,000", sublabel: "MID RANGE", value: 1000 },
              { label: "$1,500+", sublabel: "HIGH END", value: 1500 },
              { label: "$2,500+", sublabel: "ULTIMATE", value: 2500 },
            ].map((opt, i) => {
              const sel = config.budget === opt.value;
              return (
                <SelectCard key={opt.value} selected={sel} onClick={() => setConfig((c) => ({ ...c, budget: opt.value }))}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${sel ? T.green : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: sel ? T.green : T.textDim, background: sel ? T.greenFaint : "rgba(255,255,255,0.03)", transition: "all 0.15s" }}>
                        {sel ? "✓" : `0${i + 1}`}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{opt.label}</div>
                        <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 2, marginTop: 2 }}>{opt.sublabel}</div>
                      </div>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: sel ? T.green : T.border, boxShadow: sel ? `0 0 8px ${T.greenDim}` : "none", transition: "all 0.2s" }} />
                  </div>
                </SelectCard>
              );
            })}
          </div>
        </div>
      );
      if (step === 2) return <UseCaseStep config={config} setConfig={setConfig} stepNum="02" totalSteps="06" />;
      if (step === 3) return <PerformanceStep config={config} setConfig={setConfig} stepNum="03" totalSteps="06" />;
      if (step === 4) return <CoolingStep config={config} setConfig={setConfig} stepNum="04" totalSteps="06" />;
      if (step === 5) return <GraphicsStep config={config} setConfig={setConfig} stepNum="05" totalSteps="06" />;
      if (step === 6) return <DetailsStep config={config} setConfig={setConfig} stepNum="06" totalSteps="06" />;
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin   { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
      `}</style>

      <div style={{
        background: "#050608",
        backgroundImage: `
          radial-gradient(ellipse at 15% 50%, rgba(15,217,128,0.04) 0%, transparent 55%),
          radial-gradient(ellipse at 85% 15%, rgba(15,217,128,0.025) 0%, transparent 45%)
        `,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "28px 20px 80px",
        fontFamily: T.font, color: T.text, minHeight: "100vh",
      }}>
        {config.mode && !loading && !done && (
          <StepIndicator steps={steps} currentStep={step} />
        )}

        <CardShell>
          {loading ? (
            <LoadingScreen isUpgrade={isUpgrade} />
          ) : done ? (
            <>
              <ResultsStep config={config} />
              <div style={{ textAlign: "center", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
                <div onClick={reset} style={{ fontSize: 11, color: T.textDim, cursor: "pointer", letterSpacing: 3, fontWeight: 600 }}>↺ START NEW BUILD</div>
              </div>
            </>
          ) : (
            <>
              {renderStep()}
              {step > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, paddingTop: 18, borderTop: `1px solid ${T.border}` }}>
                  <div
                    onClick={step === 1 ? () => { setStep(0); setConfig((c) => ({ ...c, mode: null })); } : handleBack}
                    style={{ fontSize: 12, letterSpacing: 2, color: T.textDim, cursor: "pointer", fontWeight: 600 }}
                  >← BACK</div>
                  <div
                    onClick={canAdvance() ? handleNext : undefined}
                    style={{
                      padding: "11px 28px", fontSize: 12, letterSpacing: 3, fontWeight: 700, borderRadius: 8,
                      cursor: canAdvance() ? "pointer" : "not-allowed",
                      background: canAdvance() ? T.green : "rgba(255,255,255,0.05)",
                      color: canAdvance() ? "#050608" : T.textFaint,
                      boxShadow: canAdvance() ? "0 4px 20px rgba(15,217,128,0.35)" : "none",
                      border: `1px solid ${canAdvance() ? T.green : T.border}`,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {step === lastContentStep ? "GENERATE BUILD →" : "NEXT →"}
                  </div>
                </div>
              )}
            </>
          )}
        </CardShell>

        <div style={{ marginTop: 28, fontSize: 10, color: T.textFaint, letterSpacing: 4 }}>
          PRICES SOURCED DAILY · COMPATIBILITY AI-VERIFIED
        </div>
      </div>
    </>
  );
}