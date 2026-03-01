import React from "react";

const featuredDrones = [
  {
    id: 1,
    name: "DJI Mavic 3 Pro",
    price: "$2,199",
    image: "https://via.placeholder.com/300x200?text=DJI+Mavic+3+Pro",
    specs: {
      camera: "4/3 CMOS Hasselblad",
      video: "5.1K/50fps, 4K/120fps",
      flightTime: "46 minutes",
      range: "15 km",
      maxSpeed: "23 m/s"
    },
    highlights: ["Professional 4/3 camera", "Dual camera system", "Advanced AI features"],
    rating: 4.8
  },
  {
    id: 2,
    name: "DJI Mini 3 Pro",
    price: "$669",
    image: "https://via.placeholder.com/300x200?text=DJI+Mini+3+Pro",
    specs: {
      camera: "1/1.3\" CMOS",
      video: "4K/60fps, 2.7K/60fps",
      flightTime: "34 minutes",
      range: "10 km",
      maxSpeed: "16 m/s"
    },
    highlights: ["Under 250g weight", "4K video at 60fps", "Foldable design"],
    rating: 4.7
  },
  {
    id: 3,
    name: "DJI Air 2S",
    price: "$999",
    image: "https://via.placeholder.com/300x200?text=DJI+Air+2S",
    specs: {
      camera: "1\" CMOS",
      video: "5.4K/30fps, 4K/60fps",
      flightTime: "31 minutes",
      range: "12 km",
      maxSpeed: "19 m/s"
    },
    highlights: ["1-inch sensor", "MasterShots AI", "FocusTrack subject tracking"],
    rating: 4.6
  },
  {
    id: 4,
    name: "Parrot Anafi USA",
    price: "$699",
    image: "https://via.placeholder.com/300x200?text=Parrot+Anafi+USA",
    specs: {
      camera: "1/2.4\" CMOS",
      video: "4K/30fps, 1080p/120fps",
      flightTime: "25 minutes",
      range: "4 km",
      maxSpeed: "15 m/s"
    },
    highlights: ["Foldable & waterproof", "Thermal imaging option", "Cellular connectivity"],
    rating: 4.3
  },
  {
    id: 5,
    name: "Skydio 2+",
    price: "$1,099",
    image: "https://via.placeholder.com/300x200?text=Skydio+2+Plus",
    specs: {
      camera: "1/2.3\" CMOS",
      video: "4K/30fps, 1080p/60fps",
      flightTime: "27 minutes",
      range: "3.5 km",
      maxSpeed: "14 m/s"
    },
    highlights: ["Autonomous flight", "6-directional sensing", "Cinematic modes"],
    rating: 4.5
  },
  {
    id: 6,
    name: "Autel Robotics EVO II Pro",
    price: "$1,499",
    image: "https://via.placeholder.com/300x200?text=Autel+EVO+II+Pro",
    specs: {
      camera: "1\" CMOS",
      video: "6K/30fps, 4K/60fps",
      flightTime: "40 minutes",
      range: "9 km",
      maxSpeed: "20 m/s"
    },
    highlights: ["6K video recording", "40-minute flight time", "9km transmission"],
    rating: 4.4
  }
];

function Drones() {
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
          Drone Hub
        </h1>
        <p style={{ fontSize: 18, opacity: 0.8, marginBottom: 48, lineHeight: 1.6, fontFamily: "'Orbitron', sans-serif" }}>
          Explore the latest in drone technology, from aerial photography to industrial applications.
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
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "2rem"
        }}>
          {featuredDrones.map(drone => (
            <div
              key={drone.id}
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
                src={drone.image}
                alt={drone.name}
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
                  alignItems: "center",
                  marginBottom: "16px"
                }}>
                  <h3 style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    margin: 0
                  }}>
                    {drone.name}
                  </h3>
                  <span style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#0FD980"
                  }}>
                    {drone.price}
                  </span>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px"
                  }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        style={{
                          color: star <= drone.rating ? "#FFD700" : "rgba(255,255,255,0.2)",
                          fontSize: "16px"
                        }}
                      >
                        ★
                      </span>
                    ))}
                    <span style={{
                      fontSize: "14px",
                      opacity: 0.7,
                      marginLeft: "4px"
                    }}>
                      {drone.rating}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    marginBottom: "8px",
                    color: "#0FD980"
                  }}>
                    Key Specs
                  </h4>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "8px",
                    fontSize: "14px",
                    opacity: 0.8
                  }}>
                    <div><strong>Camera:</strong> {drone.specs.camera}</div>
                    <div><strong>Video:</strong> {drone.specs.video}</div>
                    <div><strong>Flight Time:</strong> {drone.specs.flightTime}</div>
                    <div><strong>Range:</strong> {drone.specs.range}</div>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <h4 style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    marginBottom: "8px",
                    color: "#0FD980"
                  }}>
                    Highlights
                  </h4>
                  <ul style={{
                    paddingLeft: "20px",
                    margin: 0,
                    fontSize: "14px",
                    opacity: 0.8
                  }}>
                    {drone.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>

                <button style={{
                  width: "100%",
                  padding: "12px",
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
                  Learn More
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
          <h3 style={{ fontSize: 24, marginBottom: 16, color: "#0FD980" }}>
            Drone Categories
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "24px"
          }}>
            <div style={{
              padding: "1rem",
              background: "#0A0C10",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <h4 style={{ margin: 0, fontSize: 16 }}>Consumer Drones</h4>
              <p style={{ margin: "8px 0 0", fontSize: 14, opacity: 0.7 }}>Photography & videography</p>
            </div>
            <div style={{
              padding: "1rem",
              background: "#0A0C10",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <h4 style={{ margin: 0, fontSize: 16 }}>Professional</h4>
              <p style={{ margin: "8px 0 0", fontSize: 14, opacity: 0.7 }}>Industrial & commercial</p>
            </div>
            <div style={{
              padding: "1rem",
              background: "#0A0C10",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <h4 style={{ margin: 0, fontSize: 16 }}>Racing Drones</h4>
              <p style={{ margin: "8px 0 0", fontSize: 14, opacity: 0.7 }}>High-speed competition</p>
            </div>
            <div style={{
              padding: "1rem",
              background: "#0A0C10",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <h4 style={{ margin: 0, fontSize: 16 }}>DIY Kits</h4>
              <p style={{ margin: "8px 0 0", fontSize: 14, opacity: 0.7 }}>Build your own drone</p>
            </div>
          </div>
          <p style={{ fontSize: 16, opacity: 0.8 }}>
            Explore our comprehensive drone guides, reviews, and tutorials.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Drones;
