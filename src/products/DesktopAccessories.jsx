import React from "react";

const accessories = [
  {
    id: 1,
    name: "Mechanical Gaming Keyboard",
    price: "$149",
    image: "https://via.placeholder.com/300x200?text=Mechanical+Keyboard",
    category: "Keyboard",
    badge: "RGB Gaming",
    specs: {
      switches: "Cherry MX Red",
      layout: "Full-size",
      connectivity: "USB-C Wired",
      features: "RGB Backlighting, Aluminum Frame"
    },
    highlights: ["Tactile switches", "Anti-ghosting", "USB-C passthrough"]
  },
  {
    id: 2,
    name: "Wireless Gaming Mouse",
    price: "$89",
    image: "https://via.placeholder.com/300x200?text=Wireless+Gaming+Mouse",
    category: "Mouse",
    badge: "Wireless",
    specs: {
      sensor: "PixArt 3335",
      dpi: "16,000 DPI",
      connectivity: "2.4GHz Wireless + Bluetooth",
      features: "RGB Lighting, 100-hour battery"
    },
    highlights: ["Zero latency", "Ergonomic design", "Customizable buttons"]
  },
  {
    id: 3,
    name: "UltraWide 34\" Curved Monitor",
    price: "$599",
    image: "https://via.placeholder.com/300x200?text=34+UltraWide+Monitor",
    category: "Monitor",
    badge: "4K UltraWide",
    specs: {
      resolution: "3440x1440",
      refreshRate: "144Hz",
      panel: "VA Curved",
      features: "HDR400, USB-C, Built-in Speakers"
    },
    highlights: ["Immersive gaming", "Productivity boost", "Color accurate"]
  },
  {
    id: 4,
    name: "Gaming Headset with Mic",
    price: "$129",
    image: "https://via.placeholder.com/300x200?text=Gaming+Headset",
    category: "Audio",
    badge: "7.1 Surround",
    specs: {
      drivers: "50mm",
      connectivity: "USB Wireless",
      features: "Active Noise Cancellation, RGB",
      battery: "30 hours"
    },
    highlights: ["Crystal clear audio", "Noise-canceling mic", "Comfortable for long sessions"]
  },
  {
    id: 5,
    name: "Streaming Webcam 4K",
    price: "$199",
    image: "https://via.placeholder.com/300x200?text=4K+Webcam",
    category: "Camera",
    badge: "4K Streaming",
    specs: {
      resolution: "4K/30fps, 1080p/60fps",
      sensor: "1/2.5\" CMOS",
      features: "Auto-focus, Stereo Mic, Privacy Shutter",
      connectivity: "USB-C"
    },
    highlights: ["Professional streaming", "Low-light performance", "Wide-angle lens"]
  },
  {
    id: 6,
    name: "RGB LED Strip Kit",
    price: "$49",
    image: "https://via.placeholder.com/300x200?text=RGB+LED+Strip",
    category: "Lighting",
    badge: "Smart RGB",
    specs: {
      length: "2m",
      leds: "60 LEDs/m",
      features: "App Control, Music Sync, Multiple Effects",
      connectivity: "USB"
    },
    highlights: ["Customizable colors", "Sync with games", "Easy installation"]
  },
  {
    id: 7,
    name: "Vertical Mouse Pad",
    price: "$39",
    image: "https://via.placeholder.com/300x200?text=Vertical+Mouse+Pad",
    category: "Mouse Pad",
    badge: "Ergonomic",
    specs: {
      size: "11.8\" x 9.4\"",
      material: "Microfiber Cloth",
      features: "Non-slip Base, Wrist Support",
      thickness: "3mm"
    },
    highlights: ["Reduces wrist strain", "Large tracking area", "Premium fabric"]
  },
  {
    id: 8,
    name: "USB Hub with Card Readers",
    price: "$79",
    image: "https://via.placeholder.com/300x200?text=USB+Hub",
    category: "Hub",
    badge: "7-in-1",
    specs: {
      ports: "4x USB-A, 1x USB-C, HDMI, SD, microSD",
      features: "100W Power Delivery, Aluminum Body",
      connectivity: "USB-C to Host"
    },
    highlights: ["Expand connectivity", "Fast charging", "Compact design"]
  }
];

function DesktopAccessories() {
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
        <h1 style={{ fontSize: 48, marginBottom: 16, fontWeight: 800, letterSpacing: -1, fontFamily: "'Orbitron', sans-serif" }}>
          Desktop Accessories
        </h1>
        <p style={{ fontSize: 18, opacity: 0.8, marginBottom: 48, lineHeight: 1.6, fontFamily: "'Orbitron', sans-serif" }}>
          Elevate your setup with premium keyboards, mice, monitors, and peripherals designed for gamers and creators.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem"
        }}>
          {accessories.map(accessory => (
            <div
              key={accessory.id}
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
                src={accessory.image}
                alt={accessory.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover"
                }}
              />
              <div style={{ padding: "20px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px"
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
                      {accessory.badge}
                    </span>
                    <h3 style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.3
                    }}>
                      {accessory.name}
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
                      {accessory.category}
                    </span>
                  </div>
                  <span style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#0FD980"
                  }}>
                    {accessory.price}
                  </span>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "8px",
                    color: "#0FD980"
                  }}>
                    Specifications
                  </h4>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "4px",
                    fontSize: "13px",
                    opacity: 0.8
                  }}>
                    {Object.entries(accessory.specs).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "8px",
                    color: "#0FD980"
                  }}>
                    Key Features
                  </h4>
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px"
                  }}>
                    {accessory.highlights.map((highlight, idx) => (
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
                onClick={() => {
                  if (accessory.id === 1) {
                    window.open("https://axiomforge.us/products/magegee-mini-60-gaming-keyboard-rgb-backlit-61-key-ultra-compact-keyboard-ts91-ergonomic-waterproof-mechanical-feeling-office?variant=48160974307547", "_blank");
                  } else if (accessory.id === 2) {
                    window.open("https://axiomforge.us/products/e-yooso-x-41pro-wired-mouse-large-gaming-mouse-rgb-backlit-11-programmable-side-buttons-support-for-computer-pc-laptop-mac?variant=48160817643739", "_blank");
                  } else if (accessory.id === 7) {
                    window.open("https://axiomforge.us/products/wireless-charging-rgb-luminous-mouse-pad-charger-phone-gaming-mousepad-keyboard-game-table-pad-laptop-mouse-mat-deskpad-mausepad?variant=48155129839835", "_blank");
                  }
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
          textAlign: "center"
        }}>
          <h3 style={{ fontSize: 24, marginBottom: 16, color: "#0FD980", fontWeight: 700, fontFamily: "'Orbitron', sans-serif"}}>
            Complete Your Setup
          </h3>
          <p style={{ fontSize: 16, opacity: 0.8, marginBottom: 24 }}>
            Bundle accessories with your PC build for the ultimate gaming experience. Get 10% off bundles!
          </p>
          <div style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <button style={{
              padding: "12px 24px",
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
              View Bundles
            </button>
            <button style={{
              padding: "12px 24px",
              background: "transparent",
              color: "#0FD980",
              border: "1px solid #0FD980",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(15,217,128,0.1)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.transform = "translateY(0)";
            }}
            >
              Compare Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesktopAccessories;
