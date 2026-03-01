import React from "react";

const productCategories = [
  {
    id: 1,
    name: "Prebuilt PCs",
    description: "Ready-to-use gaming and workstation computers",
    icon: "🖥️",
    itemCount: 24,
    featured: "Gaming rigs, workstations, and creator PCs"
  },
  {
    id: 2,
    name: "Desktop Accessories",
    description: "Monitors, keyboards, mice, and peripherals",
    icon: "⌨️",
    itemCount: 156,
    featured: "Gaming monitors, mechanical keyboards, RGB peripherals"
  },
  {
    id: 3,
    name: "PC Components",
    description: "Individual parts for custom builds",
    icon: "⚙️",
    itemCount: 89,
    featured: "CPUs, GPUs, motherboards, RAM, storage"
  },
  {
    id: 4,
    name: "Cooling Solutions",
    description: "Air and liquid cooling for optimal performance",
    icon: "❄️",
    itemCount: 67,
    featured: "AIO coolers, air coolers, case fans, thermal paste"
  },
  {
    id: 5,
    name: "Cases & Power Supplies",
    description: "Cases and PSUs for your build",
    icon: "🔌",
    itemCount: 45,
    featured: "Mid-tower cases, full-tower cases, modular PSUs"
  },
  {
    id: 6,
    name: "Networking & Audio",
    description: "Routers, sound cards, and audio equipment",
    icon: "📡",
    itemCount: 38,
    featured: "WiFi routers, sound cards, gaming headsets"
  }
];

const featuredProducts = [
  {
    id: 1,
    name: "RTX 4080 Super Gaming PC",
    price: "$2,499",
    image: "https://via.placeholder.com/300x200?text=RTX+4080+Gaming+PC",
    category: "Prebuilt PCs",
    badge: "Bestseller",
    specs: "RTX 4080 Super • Ryzen 7 7800X3D • 32GB DDR5 • 1TB SSD"
  },
  {
    id: 2,
    name: "UltraWide 34\" 144Hz Monitor",
    price: "$599",
    image: "https://via.placeholder.com/300x200?text=34+UltraWide+Monitor",
    category: "Desktop Accessories",
    badge: "Editor's Pick",
    specs: "3440x1440 • 144Hz • VA Panel • HDR400 • USB-C"
  },
  {
    id: 3,
    name: "Mechanical Gaming Keyboard",
    price: "$149",
    image: "https://via.placeholder.com/300x200?text=Mechanical+Keyboard",
    category: "Desktop Accessories",
    badge: "Hot Deal",
    specs: "Cherry MX Red • RGB Backlighting • Aluminum Frame • USB-C"
  },
  {
    id: 4,
    name: "AMD Ryzen 9 7950X",
    price: "$549",
    image: "https://via.placeholder.com/300x200?text=AMD+Ryzen+9+7950X",
    category: "PC Components",
    badge: "Top Rated",
    specs: "16-Core • 32-Thread • 4.5GHz Boost • AM5 Socket"
  }
];

function ProductsRoot() {
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
        <h1 style={{ fontSize: 48, marginBottom: 16, fontWeight: 800, letterSpacing: -1 }}>
          Products
        </h1>
        <p style={{ fontSize: 18, opacity: 0.8, marginBottom: 48, lineHeight: 1.6 }}>
          Discover our curated selection of PC components, prebuilt systems, and accessories for every build and budget.
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

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "4rem"
        }}>
          {productCategories.map(category => (
            <div
              key={category.id}
              style={{
                background: "#0A0C10",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "24px",
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
              <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px"
              }}>
                <span style={{ fontSize: 32, marginRight: "12px" }}>{category.icon}</span>
                <div>
                  <h3 style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    margin: 0,
                    marginBottom: "4px"
                  }}>
                    {category.name}
                  </h3>
                  <span style={{
                    fontSize: "14px",
                    color: "#0FD980",
                    background: "rgba(15,217,128,0.1)",
                    padding: "2px 8px",
                    borderRadius: "12px"
                  }}>
                    {category.itemCount} items
                  </span>
                </div>
              </div>
              <p style={{
                fontSize: "16px",
                opacity: 0.8,
                lineHeight: 1.5,
                marginBottom: "12px"
              }}>
                {category.description}
              </p>
              <p style={{
                fontSize: "14px",
                opacity: 0.6,
                margin: 0
              }}>
                {category.featured}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          marginBottom: "4rem"
        }}>
          <h2 style={{
            fontSize: 32,
            marginBottom: 16,
            fontWeight: 700,
            color: "#0FD980"
          }}>
            Featured Products
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem"
          }}>
            {featuredProducts.map(product => (
              <div
                key={product.id}
                style={{
                  background: "#0A0C10",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "all 0.3s ease"
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
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover"
                  }}
                />
                <div style={{ padding: "20px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "8px"
                  }}>
                    <span style={{
                      background: "rgba(15,217,128,0.1)",
                      color: "#0FD980",
                      padding: "4px 10px",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: 600
                    }}>
                      {product.badge}
                    </span>
                    <span style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#0FD980"
                    }}>
                      {product.price}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: "18px",
                    fontWeight: 600,
                    marginBottom: "8px",
                    lineHeight: 1.3
                  }}>
                    {product.name}
                  </h3>
                  <p style={{
                    fontSize: "14px",
                    opacity: 0.7,
                    marginBottom: "12px"
                  }}>
                    {product.category}
                  </p>
                  <p style={{
                    fontSize: "13px",
                    opacity: 0.8,
                    lineHeight: 1.4,
                    marginBottom: "16px"
                  }}>
                    {product.specs}
                  </p>
                  <button style={{
                    width: "100%",
                    padding: "10px",
                    background: "#0FD980",
                    color: "#000",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
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
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          textAlign: "center",
          padding: "3rem",
          background: "rgba(15,217,128,0.05)",
          border: "1px solid rgba(15,217,128,0.2)",
          borderRadius: "12px"
        }}>
          <h3 style={{ fontSize: 24, marginBottom: 16, color: "#0FD980" }}>
            Custom PC Builder
          </h3>
          <p style={{ fontSize: 16, opacity: 0.8, marginBottom: 24 }}>
            Can't find what you're looking for? Use our interactive PC builder to create your perfect custom system.
          </p>
          <button style={{
            padding: "14px 32px",
            background: "#0FD980",
            color: "#000",
            border: "none",
            borderRadius: "8px",
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
            Start Building →
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductsRoot;
