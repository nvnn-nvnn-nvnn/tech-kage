import React from "react";
import gamingKeyboardImage from "../assets/gamingkb.webp";
import wirelessMouseImage from "../assets/wirelessms.webp";
import mousePadImage from "../assets/mspd.webp";
// import ultraWideMonitorImage from "../assets/ultra-wide-monitor.jpg";
// import gamingHeadsetImage from "../assets/gaming-headset.jpg";
// import streamingWebcamImage from "../assets/streaming-webcam.jpg";

const accessories = [
  {
    id: 1,
    name: "Mechanical Gaming Keyboard",
    price: "$149",
    image: gamingKeyboardImage,
    link: "https://axiomforge.us/products/magegee-mini-60-gaming-keyboard-rgb-backlit-61-key-ultra-compact-keyboard-ts91-ergonomic-waterproof-mechanical-feeling-office?variant=48160974307547",
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
    image: wirelessMouseImage,
    link: "https://axiomforge.us/products/e-yooso-x-41pro-wired-mouse-large-gaming-mouse-rgb-backlit-11-programmable-side-buttons-support-for-computer-pc-laptop-mac?variant=48160817643739",
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
  // {
  //   id: 3,
  //   name: "UltraWide 34\" Curved Monitor",
  //   price: "$599",
  //   image: "https://via.placeholder.com/300x200?text=34+UltraWide+Monitor",
  //   category: "Monitor",
  //   badge: "4K UltraWide",
  //   specs: {
  //     resolution: "3440x1440",
  //     refreshRate: "144Hz",
  //     panel: "VA Curved",
  //     features: "HDR400, USB-C, Built-in Speakers"
  //   },
  //   highlights: ["Immersive gaming", "Productivity boost", "Color accurate"]
  // },
  // {
  //   id: 4,
  //   name: "Gaming Headset with Mic",
  //   price: "$129",
  //   image: "https://via.placeholder.com/300x200?text=Gaming+Headset",
  //   category: "Audio",
  //   badge: "7.1 Surround",
  //   specs: {
  //     drivers: "50mm",
  //     connectivity: "USB Wireless",
  //     features: "Active Noise Cancellation, RGB",
  //     battery: "30 hours"
  //   },
  //   highlights: ["Crystal clear audio", "Noise-canceling mic", "Comfortable for long sessions"]
  // },
  // {
  //   id: 5,
  //   name: "Streaming Webcam 4K",
  //   price: "$199",
  //   image: "https://via.placeholder.com/300x200?text=4K+Webcam",
  //   category: "Camera",
  //   badge: "4K Streaming",
  //   specs: {
  //     resolution: "4K/30fps, 1080p/60fps",
  //     sensor: "1/2.5\" CMOS",
  //     features: "Auto-focus, Stereo Mic, Privacy Shutter",
  //     connectivity: "USB-C"
  //   },
  //   highlights: ["Professional streaming", "Low-light performance", "Wide-angle lens"]
  // },
  // {
  //   id: 6,
  //   name: "RGB LED Strip Kit",
  //   price: "$49",
  //   image: "https://via.placeholder.com/300x200?text=RGB+LED+Strip",
  //   category: "Lighting",
  //   badge: "Smart RGB",
  //   specs: {
  //     length: "2m",
  //     leds: "60 LEDs/m",
  //     features: "App Control, Music Sync, Multiple Effects",
  //     connectivity: "USB"
  //   },
  //   highlights: ["Customizable colors", "Sync with games", "Easy installation"]
  // },
  {
    id: 7,
    name: "Vertical Mouse Pad",
    price: "$39",
    image: mousePadImage,
    link: "https://axiomforge.us/products/wireless-charging-rgb-luminous-mouse-pad-charger-phone-gaming-mousepad-keyboard-game-table-pad-laptop-mouse-mat-deskpad-mausepad?variant=48155129839835",
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
  // {
  //   id: 8,
  //   name: "USB Hub with Card Readers",
  //   price: "$79",
  //   image: "https://via.placeholder.com/300x200?text=USB+Hub",
  //   category: "Hub",
  //   badge: "7-in-1",
  //   specs: {
  //     ports: "4x USB-A, 1x USB-C, HDMI, SD, microSD",
  //     features: "100W Power Delivery, Aluminum Body",
  //     connectivity: "USB-C to Host"
  //   },
  //   highlights: ["Expand connectivity", "Fast charging", "Compact design"]
  // }
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

        {/* <div style={{
          background: "rgba(255,193,7,0.1)",
          border: "1px solid rgba(255,193,7,0.3)",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "32px",
          color: "#FFC107"
        }}>
          <strong>Note:</strong> Purchasing functionality is currently not implemented. This page is for demonstration purposes only.
        </div> */}

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

                <a href={accessory.link} target="_blank" rel="noopener noreferrer" style={{
                  width: "100%",
                  padding: "10px",
                  background: "#0FD980",
                  color: "#000",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textDecoration: "none",
                  display: "inline-block",
                  textAlign: "center"
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
                  Buy Now
                </a>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: "5rem",
          padding: "3.5rem 2rem",
          background: "linear-gradient(135deg, rgba(15,217,128,0.08) 0%, rgba(15,217,128,0.03) 100%)",
          border: "1px solid rgba(15,217,128,0.25)",
          borderRadius: "16px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 0 40px rgba(15,217,128,0.15), inset 0 0 20px rgba(15,217,128,0.08)",
          backdropFilter: "blur(8px)",
        }}>
          {/* Optional subtle animated background glow */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "radial-gradient(circle at 30% 20%, rgba(15,217,128,0.12) 0%, transparent 60%)",
            pointerEvents: "none",
            animation: "pulseGlow 8s infinite alternate ease-in-out",
          }} />

          <h3 style={{
            fontSize: "2.2rem",
            marginBottom: "1rem",
            color: "#0FD980",
            fontWeight: 900,
            fontFamily: "'Orbitron', sans-serif",
            textShadow: "0 0 10px #0FD980, 0 0 20px rgba(15,217,128,0.6), 0 0 40px rgba(15,217,128,0.3)",
            letterSpacing: "2px",
            animation: "neonFlicker 4s infinite alternate",
          }}>
            COMPLETE YOUR SETUP
          </h3>

          <p style={{
            fontSize: "1.1rem",
            maxWidth: "600px",
            margin: "0 auto 2rem",
            color: "#e0ffe0",
            opacity: 0.9,
            lineHeight: 1.6,
            textShadow: "0 0 8px rgba(15,217,128,0.4)",
          }}>
            Level up your rig with elite accessories. Bundle now and score <strong style={{ color: "#0FD980", fontWeight: 700 }}>10% OFF</strong> — because a beast deserves the full arsenal.
          </p>

          <div style={{
            display: "flex",
            gap: "1.5rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "1.5rem",
          }}>
            {/* Primary Button - Filled with stronger glow */}
            <button
              style={{
                padding: "14px 32px",
                background: "linear-gradient(90deg, #0FD980, #0CCF70)",
                color: "#000",
                border: "none",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 0 20px rgba(15,217,128,0.5), 0 4px 15px rgba(0,0,0,0.3)",
                textShadow: "0 1px 3px rgba(0,0,0,0.4)",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px) scale(1.05)";
                e.target.style.boxShadow = "0 0 35px rgba(15,217,128,0.8), 0 8px 25px rgba(0,0,0,0.4)";
                e.target.style.background = "linear-gradient(90deg, #0CCF70, #0FD980)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 0 20px rgba(15,217,128,0.5), 0 4px 15px rgba(0,0,0,0.3)";
                e.target.style.background = "linear-gradient(90deg, #0FD980, #0CCF70)";
              }}
            >
              VIEW BUNDLES
            </button>

            {/* Secondary Button - Outline with glitch hover */}
            <button
              style={{
                padding: "14px 32px",
                background: "transparent",
                color: "#0FD980",
                border: "2px solid #0FD980",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 0 15px rgba(15,217,128,0.3)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 0 30px rgba(15,217,128,0.7)";
                e.target.style.background = "rgba(15,217,128,0.12)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 0 15px rgba(15,217,128,0.3)";
                e.target.style.background = "transparent";
              }}
            >
              COMPARE PRODUCTS
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default DesktopAccessories;
