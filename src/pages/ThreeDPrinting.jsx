import React from 'react';

const printingCategories = [
  {
    name: "FDM Printing",
    subtitle: "Fused Deposition Modeling",
    price: "From $200",
    specs: "Layer resolution 0.1–0.3mm, build volumes up to 300×300×400mm, supports PLA, ABS, PETG, TPU",
    highlights: ["Most affordable", "Wide material support", "Easy to maintain", "Large community"]
  },
  {
    name: "Resin (MSLA)",
    subtitle: "Masked Stereolithography",
    price: "From $250",
    specs: "Layer resolution 0.01–0.05mm, mono LCD screens, UV photopolymer resin, ultra-fine detail",
    highlights: ["Exceptional detail", "Smooth surfaces", "Dental & jewelry use", "Fast print speeds"]
  },
  {
    name: "SLS / Industrial",
    subtitle: "Selective Laser Sintering",
    price: "From $5,000",
    specs: "Nylon, TPU, and metal powders, no support structures needed, production-grade tolerances",
    highlights: ["No supports needed", "Functional parts", "Metal capable", "High throughput"]
  },
  {
    name: "Multi-Material",
    subtitle: "AMS / Tool-changer Systems",
    price: "From $800",
    specs: "Up to 16 materials per print, automatic filament switching, soluble supports, full-color capable",
    highlights: ["Multiple colors", "Soluble supports", "Complex geometry", "Pro results"]
  }
];

const projects = [
  {
    title: "Custom PC Case Mods",
    description: "Design and print custom cable combs, fan grills, GPU brackets, and decorative panels to personalize your build.",
    difficulty: "Beginner",
    time: "2–4 hours",
    tags: ["PC Building", "Aesthetics", "FDM"]
  },
  {
    title: "Functional Enclosures",
    description: "Print precise enclosures for Raspberry Pi, Arduino, and custom electronics with cutouts for ports and displays.",
    difficulty: "Intermediate",
    time: "4–6 hours",
    tags: ["Electronics", "Raspberry Pi", "Engineering"]
  },
  {
    title: "Drone Frame & Parts",
    description: "Prototype and print lightweight drone frames, motor mounts, and camera gimbals with PETG or carbon-filled filaments.",
    difficulty: "Advanced",
    time: "8–12 hours",
    tags: ["Drones", "Aerospace", "PETG"]
  },
  {
    title: "Miniatures & Models",
    description: "Use resin printing to produce ultra-detailed miniatures, figurines, and display models with museum-quality resolution.",
    difficulty: "Intermediate",
    time: "3–5 hours",
    tags: ["Resin", "Art", "Detail"]
  },
  {
    title: "Replacement Parts",
    description: "Reverse-engineer and reprint broken household or machine parts instead of buying expensive replacements.",
    difficulty: "Intermediate",
    time: "2–6 hours",
    tags: ["Repair", "Engineering", "Practical"]
  },
  {
    title: "Wearables & Cosplay",
    description: "Build costume armor, props, and wearable tech housings with flexible TPU and rigid PLA combinations.",
    difficulty: "Advanced",
    time: "10–20 hours",
    tags: ["Cosplay", "TPU", "Design"]
  }
];

function getDifficultyColor(difficulty) {
  switch (difficulty.toLowerCase()) {
    case 'beginner': return '#4CAF50';
    case 'intermediate': return '#FF9800';
    case 'advanced': return '#F44336';
    default: return '#0FD980';
  }
}

export default function ThreeDPrinting() {
  return (
    <div style={{
      minHeight: "100vh",
      padding: "3rem 2.5rem",
      background: "#050608",
      color: "#f5f5f5",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Hero */}
        <h1 style={{ fontSize: 48, marginBottom: 16, fontWeight: 800, letterSpacing: -1, fontFamily: "'Orbitron', sans-serif" }}>
          3D Printing Hub
        </h1>
        <p style={{ fontSize: 18, opacity: 0.8, marginBottom: 48, lineHeight: 1.6, fontFamily: "'Orbitron', sans-serif" }}>
          From desktop FDM machines to industrial resin systems — explore technologies, projects, and guides
          for makers at every level.
        </p>

        <div style={{
          background: "rgba(255,193,7,0.1)",
          border: "1px solid rgba(255,193,7,0.3)",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "32px",
          color: "#FFC107"
        }}>
          <strong>Note:</strong> Purchasing functionality is currently not implemented. This page is for demonstration purposes only.
        </div>

        {/* Printer Types */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: 32, marginBottom: 24, fontWeight: 700, color: "#0FD980" }}>
            Printer Technologies
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "2rem"
          }}>
            {printingCategories.map((printer, index) => (
              <div
                key={index}
                style={{
                  background: "#0A0C10",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
                  e.currentTarget.style.borderColor = "rgba(15,217,128,0.3)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                {/* Color band instead of placeholder image */}
                <div style={{
                  height: 8,
                  background: `linear-gradient(90deg, #0FD980, rgba(15,217,128,0.3))`,
                }} />

                <div style={{ padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{printer.name}</h3>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0FD980", whiteSpace: "nowrap", marginLeft: 8 }}>
                      {printer.price}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 12, letterSpacing: 0.5 }}>
                    {printer.subtitle}
                  </p>
                  <p style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.4, marginBottom: 16 }}>
                    {printer.specs}
                  </p>
                  <div style={{ marginBottom: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "#0FD980" }}>
                      Key Features
                    </h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {printer.highlights.map((h, idx) => (
                        <span key={idx} style={{
                          background: "rgba(15,217,128,0.1)", color: "#0FD980",
                          padding: "4px 8px", borderRadius: 12, fontSize: 12, fontWeight: 500
                        }}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    style={{ width: "100%", padding: 10, background: "#0FD980", color: "#000", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.target.style.background = "#0CCF70"; e.target.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.target.style.background = "#0FD980"; e.target.style.transform = "translateY(0)"; }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontSize: 32, marginBottom: 24, fontWeight: 700, color: "#0FD980" }}>
            Featured Projects
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "2rem"
          }}>
            {projects.map((project, index) => (
              <div
                key={index}
                style={{
                  background: "#0A0C10",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
                  e.currentTarget.style.borderColor = "rgba(15,217,128,0.3)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                {/* Accent bar */}
                <div style={{
                  height: 6,
                  background: `linear-gradient(90deg, ${getDifficultyColor(project.difficulty)}, transparent)`,
                }} />

                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{
                      background: getDifficultyColor(project.difficulty),
                      color: "#000", padding: "4px 12px", borderRadius: 16,
                      fontSize: 12, fontWeight: 600
                    }}>
                      {project.difficulty}
                    </span>
                    <span style={{ fontSize: 14, opacity: 0.7 }}>{project.time}</span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, lineHeight: 1.3 }}>
                    {project.title}
                  </h3>
                  <p style={{ fontSize: 16, opacity: 0.8, lineHeight: 1.5, marginBottom: 16 }}>
                    {project.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                    {project.tags.map((tag, idx) => (
                      <span key={idx} style={{
                        background: "rgba(255,255,255,0.1)", color: "#f5f5f5",
                        padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 500
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    style={{ width: "100%", padding: 12, background: "#0FD980", color: "#000", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.target.style.background = "#0CCF70"; e.target.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.target.style.background = "#0FD980"; e.target.style.transform = "translateY(0)"; }}
                  >
                    Start Tutorial →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div style={{
          textAlign: "center", padding: "3rem",
          background: "rgba(15,217,128,0.05)",
          border: "1px solid rgba(15,217,128,0.2)",
          borderRadius: 12
        }}>
          <h3 style={{ fontSize: 24, marginBottom: 16, color: "#0FD980" }}>
            3D Printing Resources
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem", marginBottom: 24
          }}>
            {[
              { icon: "", title: "Model Libraries", desc: "Thingiverse, Printables, Makerworld" },
              { icon: "", title: "Slicer Software", desc: "Bambu Studio, Orca, Cura, PrusaSlicer" },
              { icon: "", title: "Materials Guide", desc: "PLA, ABS, PETG, TPU, Resin comparison" },
              { icon: "", title: "Community", desc: "Reddit, Discord, and local makerspaces" },
            ].map((r, i) => (
              <div key={i} style={{
                padding: "1.5rem", background: "#0A0C10",
                borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)"
              }}>
                <h4 style={{ margin: 0, fontSize: 16 }}>{r.icon} {r.title}</h4>
                <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>{r.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 16, opacity: 0.8 }}>
            Join a global community of makers pushing the boundaries of what's possible with additive manufacturing.
          </p>
        </div>

      </div>
    </div>
  );
}