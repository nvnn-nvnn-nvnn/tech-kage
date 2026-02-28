import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const prebuiltPCs = [
  {
    id: 2,
    name: "Mid-Range Gaming PC",
    price: 1299,
    image: "https://via.placeholder.com/600x400?text=Mid-Range+Gaming+PC",
    category: "Gaming",
    badge: "Popular",
    specs: {
      cpu: "AMD Ryzen 7 7800X3D",
      gpu: "RTX 4070 Ti 12GB",
      ram: "32GB DDR5-5600",
      storage: "1TB NVMe SSD",
      psu: "750W Gold Modular"
    },
    highlights: ["1440p high refresh", "Excellent value", "Upgrade-friendly"],
    description: "Perfect balance of performance and affordability. This mid-range build delivers smooth gaming at 1440p with room for future upgrades as your needs grow."
  },
  {
    id: 3,
    name: "Content Creator Workstation",
    price: 2799,
    image: "https://via.placeholder.com/600x400?text=Content+Creator+Workstation",
    category: "Workstation",
    badge: "Pro Choice",
    specs: {
      cpu: "Intel Core i9-14900K",
      gpu: "RTX 4080 Super 16GB",
      ram: "64GB DDR5-6400",
      storage: "4TB NVMe SSD + 2TB HDD",
      psu: "1200W Platinum"
    },
    highlights: ["Video editing powerhouse", "Multi-threaded performance", "Professional cooling"],
    description: "Designed for content creators, video editors, and professionals who need workstation-grade performance. Handles demanding workloads with ease."
  },
  {
    id: 4,
    name: "Budget Gaming Starter",
    price: 799,
    image: "https://via.placeholder.com/600x400?text=Budget+Gaming+Starter",
    category: "Gaming",
    badge: "Entry Level",
    specs: {
      cpu: "AMD Ryzen 5 7600",
      gpu: "RTX 4060 Ti 8GB",
      ram: "16GB DDR5-5200",
      storage: "512GB NVMe SSD",
      psu: "650W Bronze"
    },
    highlights: ["1080p gaming", "Easy to upgrade", "Silent operation"],
    description: "Entry-level gaming PC that's perfect for newcomers. Reliable components at an affordable price, with plenty of room for upgrades as you progress."
  }
];

function PrebuiltPCDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addPrebuild } = useCart();

  const pc = prebuiltPCs.find(p => p.id === parseInt(id));

  if (!pc) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#050608",
        color: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
      }}>
        <h1>PC Not Found</h1>
        <button onClick={() => navigate("/products/prebuilt")} style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#0FD980",
          color: "#000",
          border: "none",
          borderRadius: 8,
          cursor: "pointer"
        }}>Back to Prebuilt PCs</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addPrebuild({
      name: pc.name,
      price: pc.price,
      imageUrl: pc.image,
      specs: `${pc.specs.cpu}, ${pc.specs.gpu}, ${pc.specs.ram}, ${pc.specs.storage}`,
      sku: `prebuilt-${pc.id}`
    });
    navigate("/cart");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050608",
      color: "#f5f5f5",
      padding: "3rem 2.5rem",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <button onClick={() => navigate("/products/prebuilt")} style={{
          marginBottom: 32,
          padding: "8px 16px",
          background: "transparent",
          color: "#0FD980",
          border: "1px solid #0FD980",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 14
        }}>← Back to Prebuilt PCs</button>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          marginBottom: 48
        }}>
          <div>
            <img src={pc.image} alt={pc.name} style={{
              width: "100%",
              height: "400px",
              objectFit: "cover",
              borderRadius: 12
            }} />
          </div>

          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16
            }}>
              <span style={{
                background: "rgba(15,217,128,0.1)",
                color: "#0FD980",
                padding: "4px 10px",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: 600
              }}>{pc.badge}</span>
              <span style={{
                fontSize: "14px",
                opacity: 0.7,
                background: "rgba(255,255,255,0.1)",
                padding: "2px 8px",
                borderRadius: "12px"
              }}>{pc.category}</span>
            </div>

            <h1 style={{
              fontSize: "48px",
              fontWeight: 800,
              margin: 0,
              marginBottom: 16,
              fontFamily: "'Orbitron', sans-serif"
            }}>{pc.name}</h1>

            <p style={{
              fontSize: 18,
              opacity: 0.8,
              marginBottom: 24,
              lineHeight: 1.6
            }}>{pc.description}</p>

            <div style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#0FD980",
              marginBottom: 24
            }}>${pc.price}</div>

            <button onClick={handleAddToCart} style={{
              width: "100%",
              padding: "16px",
              background: "#0FD980",
              color: "#000",
              border: "none",
              borderRadius: 8,
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
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
              Add to Cart - ${pc.price}
            </button>
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem"
        }}>
          <div>
            <h3 style={{
              fontSize: "24px",
              fontWeight: 700,
              marginBottom: 16,
              color: "#0FD980"
            }}>Specifications</h3>
            <div style={{ display: "grid", gap: 12 }}>
              {Object.entries(pc.specs).map(([key, value]) => (
                <div key={key} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: 8
                }}>
                  <span style={{ textTransform: "uppercase", fontSize: 12, fontWeight: 600 }}>{key}</span>
                  <span style={{ color: "#f5f5f5" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{
              fontSize: "24px",
              fontWeight: 700,
              marginBottom: 16,
              color: "#0FD980"
            }}>Highlights</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pc.highlights.map((highlight, idx) => (
                <div key={idx} style={{
                  padding: "12px",
                  background: "rgba(15,217,128,0.05)",
                  border: "1px solid rgba(15,217,128,0.1)",
                  borderRadius: 8,
                  color: "#0FD980"
                }}>
                  ✓ {highlight}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrebuiltPCDetail;
