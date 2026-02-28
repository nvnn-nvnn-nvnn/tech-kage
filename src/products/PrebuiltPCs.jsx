import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const prebuiltPCs = [
  {
    id: 1,
    name: "Ultimate Gaming Beast",
    price: "$2,499",
    image: "https://via.placeholder.com/400x300?text=Ultimate+Gaming+Beast",
    category: "Gaming",
    badge: "Best Seller",
    specs: {
      cpu: "AMD Ryzen 9 7950X",
      gpu: "RTX 4090 24GB",
      ram: "32GB DDR5-6000",
      storage: "2TB NVMe SSD",
      psu: "1000W Gold Modular"
    },
    highlights: ["4K gaming ready", "Ray tracing enabled", "Future-proof components"]
  },
  {
    id: 2,
    name: "Mid-Range Gaming PC",
    price: "$1,299",
    image: "https://via.placeholder.com/400x300?text=Mid-Range+Gaming+PC",
    category: "Gaming",
    badge: "Popular",
    specs: {
      cpu: "AMD Ryzen 7 7800X3D",
      gpu: "RTX 4070 Ti 12GB",
      ram: "32GB DDR5-5600",
      storage: "1TB NVMe SSD",
      psu: "750W Gold Modular"
    },
    highlights: ["1440p high refresh", "Excellent value", "Upgrade-friendly"]
  },
  {
    id: 3,
    name: "Content Creator Workstation",
    price: "$2,799",
    image: "https://via.placeholder.com/400x300?text=Content+Creator+Workstation",
    category: "Workstation",
    badge: "Pro Choice",
    specs: {
      cpu: "Intel Core i9-14900K",
      gpu: "RTX 4080 Super 16GB",
      ram: "64GB DDR5-6400",
      storage: "4TB NVMe SSD + 2TB HDD",
      psu: "1200W Platinum"
    },
    highlights: ["Video editing powerhouse", "Multi-threaded performance", "Professional cooling"]
  },
  {
    id: 4,
    name: "Budget Gaming Starter",
    price: "$799",
    image: "https://via.placeholder.com/400x300?text=Budget+Gaming+Starter",
    category: "Gaming",
    badge: "Entry Level",
    specs: {
      cpu: "AMD Ryzen 5 7600",
      gpu: "RTX 4060 Ti 8GB",
      ram: "16GB DDR5-5200",
      storage: "512GB NVMe SSD",
      psu: "650W Bronze"
    },
    highlights: ["1080p gaming", "Easy to upgrade", "Silent operation"]
  },
  {
    id: 5,
    name: "Compact Mini-ITX Build",
    price: "$1,499",
    image: "https://via.placeholder.com/400x300?text=Mini-ITX+Gaming+PC",
    category: "Gaming",
    badge: "Compact",
    specs: {
      cpu: "AMD Ryzen 7 7700X",
      gpu: "RTX 4070 12GB",
      ram: "32GB DDR5-5600",
      storage: "1TB NVMe SSD",
      psu: "750W SFX Gold"
    },
    highlights: ["Small footprint", "High performance", "Cable management"]
  },
  {
    id: 6,
    name: "Streaming & Gaming Hybrid",
    price: "$1,899",
    image: "https://via.placeholder.com/400x300?text=Streaming+Gaming+Hybrid",
    category: "Streaming",
    badge: "Streamer Favorite",
    specs: {
      cpu: "AMD Ryzen 7 7800X3D",
      gpu: "RTX 4070 Ti 12GB",
      ram: "32GB DDR5-5600",
      storage: "1TB NVMe SSD + 500GB SSD",
      psu: "850W Gold Modular"
    },
    highlights: ["Dual PC streaming ready", "Great for content creation", "RGB lighting"]
  }
];

function PrebuiltPCs() {
  const navigate = useNavigate();
  const { addPrebuild } = useCart();

  const handleAddToCart = (pc) => {
    addPrebuild({
      name: pc.name,
      price: parseFloat(pc.price.replace(/[^0-9.]/g, "")),
      imageUrl: pc.image,
      specs: `${pc.specs.cpu}, ${pc.specs.gpu}, ${pc.specs.ram}, ${pc.specs.storage}`,
      sku: `prebuilt-${pc.id}`
    });
    navigate("/cart");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "3rem 2.5rem",
        background: "#050608",
        color: "#f5f5f5",
        fontFamily: "system-ui, -apple-system, sans-serif"
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontSize: 48, marginBottom: 16, fontWeight: 800, letterSpacing: -1,fontFamily: "'Orbitron', sans-serif" }}>
          Prebuilt PCs
        </h1>
        <p style={{ fontSize: 18, opacity: 0.8, marginBottom: 48, lineHeight: 1.6 , fontFamily: "'Orbitron', sans-serif"}}>
          Ready-to-use gaming rigs and workstations. Skip the assembly and get gaming faster with our curated builds.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "2rem"
        }}>
          {prebuiltPCs.map(pc => (
            <div
              key={pc.id}
              onClick={() => navigate(`/products/prebuilt/${pc.id}`)}
              style={{
                background: "#0A0C10",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                overflow: "hidden",
                transition: "all 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
                e.currentTarget.style.borderColor = "rgba(15,217,128,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              <img
                src={pc.image}
                alt={pc.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover"
                }}
              />
              <div style={{ padding: "24px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px"
                }}>
                  <div>
                    <span style={{
                      background: "rgba(15,217,128,0.1)",
                      color: "#0FD980",
                      padding: "4px 10px",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: 600,
                      marginBottom: "8px",
                      display: "inline-block"
                    }}>
                      {pc.badge}
                    </span>
                    <h3 style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.3
                    }}>
                      {pc.name}
                    </h3>
                    <span style={{
                      fontSize: "14px",
                      opacity: 0.7,
                      background: "rgba(255,255,255,0.1)",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      marginTop: "8px",
                      display: "inline-block"
                    }}>
                      {pc.category}
                    </span>
                  </div>
                  <span style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: "#0FD980"
                  }}>
                    {pc.price}
                  </span>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "8px",
                    color: "#0FD980"
                  }}>
                    Key Components
                  </h4>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                    fontSize: "13px",
                    opacity: 0.8
                  }}>
                    <div><strong>CPU:</strong> {pc.specs.cpu}</div>
                    <div><strong>GPU:</strong> {pc.specs.gpu}</div>
                    <div><strong>RAM:</strong> {pc.specs.ram}</div>
                    <div><strong>Storage:</strong> {pc.specs.storage}</div>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "8px",
                    color: "#0FD980"
                  }}>
                    Highlights
                  </h4>
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px"
                  }}>
                    {pc.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: "rgba(15,217,128,0.1)",
                          color: "#0FD980",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: 500
                        }}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <button style={{
                  width: "100%",
                  padding: "12px",
                  background: "#0FD980",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  handleAddToCart(pc);
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#0CCF70";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#0FD980";
                  e.target.style.transform = "translateY(0)";
                }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: "4rem",
          padding: "3rem",
          background: "rgba(15,217,128,0.05)",
          border: "1px solid rgba(15,217,128,0.2)",
          borderRadius: "12px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, #04050A 0%, #071A10 25%, #050B18 50%, #100710 75%, #04050A 100%)", backgroundSize: "300% 300%", animation: "aurora 12s ease infinite", zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <h3 style={{ fontSize: 24, marginBottom: 16, color: "#0FD980", fontFamily: "'Orbitron', sans-serif"}}>
              Custom Build Service
            </h3>
            <p style={{ fontSize: 16, opacity: 0.8, marginBottom: 24 }}>
              Not finding what you need? Let us  <span className="price-span">build a custom PC </span> tailored to your exact specifications and budget.
            </p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
            >
              <motion.button type="button" onClick={() => navigate("/builder")}
                whileHover={{ scale: 1.04, boxShadow: "0 12px 36px rgba(15,217,128,0.55)" }}
                whileTap={{ scale: 0.96 }}
                className="shimmer-btn"
                style={{ padding: "0.9rem 2.2rem", fontSize: 13, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", borderRadius: 8, border: "1px solid rgba(15,217,128,0.9)", background: "#0FD980", color: "#040608", cursor: "pointer", fontFamily: "'Orbitron', sans-serif", animation: "pulseGlow 3s ease-in-out infinite" }}
              >
                Start Budgeting →
              </motion.button>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>
                No account needed
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrebuiltPCs;
