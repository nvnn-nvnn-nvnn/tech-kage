import React from "react";

const raspberryPiModels = [
  {
    name: "Raspberry Pi 5",
    price: "$60",
    specs: "2.4GHz quad-core ARM Cortex-A76 CPU, 4GB/8GB RAM, Gigabit Ethernet, WiFi 6, Bluetooth 5.0",
    image: "https://via.placeholder.com/300x200?text=Raspberry+Pi+5",
    highlights: ["Latest flagship model", "Massive performance boost", "PoE+ support", "PCIe interface"]
  },
  {
    name: "Raspberry Pi 4 Model B",
    price: "$35",
    specs: "1.5GHz quad-core ARM Cortex-A72 CPU, 2GB/4GB/8GB RAM, Gigabit Ethernet, WiFi 5, Bluetooth 5.0",
    image: "https://via.placeholder.com/300x200?text=Raspberry+Pi+4",
    highlights: ["Most popular model", "4K video output", "USB 3.0 ports", "Micro-HDMI dual"]
  },
  {
    name: "Raspberry Pi Zero 2 W",
    price: "$15",
    specs: "1GHz quad-core ARM Cortex-A53 CPU, 512MB RAM, Mini-HDMI, Micro-USB, WiFi, Bluetooth",
    image: "https://via.placeholder.com/300x200?text=Raspberry+Pi+Zero+2+W",
    highlights: ["Ultra-compact", "Wireless connectivity", "Perfect for IoT", "Camera interface"]
  },
  {
    name: "Raspberry Pi Pico",
    price: "$4",
    specs: "133MHz dual-core ARM Cortex-M0+ CPU, 264KB RAM, 25 GPIO pins, Micro-USB",
    image: "https://via.placeholder.com/300x200?text=Raspberry+Pi+Pico",
    highlights: ["Microcontroller board", "RP2040 chip", "Programmable in C/C++", "Low power consumption"]
  }
];

const projects = [
  {
    title: "Home Media Server",
    description: "Build a complete media streaming server with Plex, Kodi, or Jellyfin for movies, TV shows, and music.",
    difficulty: "Intermediate",
    time: "4-6 hours",
    image: "https://via.placeholder.com/400x250?text=Media+Server",
    tags: ["Streaming", "NAS", "Docker"]
  },
  {
    title: "Retro Gaming Console",
    description: "Transform your Pi into a retro gaming machine with RetroPie, supporting NES, SNES, Genesis, and more.",
    difficulty: "Beginner",
    time: "2-3 hours",
    image: "https://via.placeholder.com/400x250?text=Retro+Gaming",
    tags: ["Gaming", "Emulation", "Arcade"]
  },
  {
    title: "Smart Home Hub",
    description: "Create a central smart home controller with Home Assistant, MQTT, and various IoT integrations.",
    difficulty: "Advanced",
    time: "6-8 hours",
    image: "https://via.placeholder.com/400x250?text=Smart+Home+Hub",
    tags: ["IoT", "Automation", "MQTT"]
  },
  {
    title: "Network Attached Storage (NAS)",
    description: "Set up a personal cloud storage solution with Samba, RAID, and remote access capabilities.",
    difficulty: "Intermediate",
    time: "3-5 hours",
    image: "https://via.placeholder.com/400x250?text=NAS+Server",
    tags: ["Storage", "Networking", "Cloud"]
  },
  {
    title: "AI-Powered Security Camera",
    description: "Build a smart security system with motion detection, facial recognition, and mobile notifications.",
    difficulty: "Advanced",
    time: "8-10 hours",
    image: "https://via.placeholder.com/400x250?text=AI+Security+Camera",
    tags: ["AI", "Computer Vision", "Security"]
  },
  {
    title: "Portable VPN Router",
    description: "Create a travel router with built-in VPN, ad-blocking, and network monitoring features.",
    difficulty: "Intermediate",
    time: "3-4 hours",
    image: "https://via.placeholder.com/400x250?text=VPN+Router",
    tags: ["Networking", "Privacy", "Travel"]
  }
];

function RaspberryPI() {
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
          Raspberry Pi Hub
        </h1>
        <p style={{ fontSize: 18, opacity: 0.8, marginBottom: 48, lineHeight: 1.6, fontFamily: "'Orbitron', sans-serif" }}>
          Explore projects, tutorials, and resources for the world's most popular single-board computer.
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
          marginBottom: "4rem"
        }}>
          <h2 style={{
            fontSize: 32,
            marginBottom: 24,
            fontWeight: 700,
            color: "#0FD980"
          }}>
            Popular Raspberry Pi Models
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem"
          }}>
            {raspberryPiModels.map((model, index) => (
              <div
                key={index}
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
                  src={model.image}
                  alt={model.name}
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
                    <h3 style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      margin: 0
                    }}>
                      {model.name}
                    </h3>
                    <span style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#0FD980"
                    }}>
                      {model.price}
                    </span>
                  </div>
                  <p style={{
                    fontSize: "14px",
                    opacity: 0.8,
                    lineHeight: 1.4,
                    marginBottom: "16px"
                  }}>
                    {model.specs}
                  </p>
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
                      {model.highlights.map((highlight, idx) => (
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
                    onMouseEnter={(e) => {
                      e.target.style.background = "#0CCF70";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#0FD980";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    View Specs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          marginBottom: "4rem"
        }}>
          <h2 style={{
            fontSize: 32,
            marginBottom: 24,
            fontWeight: 700,
            color: "#0FD980"
          }}>
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
                  src={project.image}
                  alt={project.title}
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
                    marginBottom: "12px"
                  }}>
                    <span style={{
                      background: getDifficultyColor(project.difficulty),
                      color: "#000",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "12px",
                      fontWeight: 600
                    }}>
                      {project.difficulty}
                    </span>
                    <span style={{
                      fontSize: "14px",
                      opacity: 0.7
                    }}>
                      {project.time}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    marginBottom: "12px",
                    lineHeight: 1.3
                  }}>
                    {project.title}
                  </h3>
                  <p style={{
                    fontSize: "16px",
                    opacity: 0.8,
                    lineHeight: 1.5,
                    marginBottom: "16px"
                  }}>
                    {project.description}
                  </p>
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "16px"
                  }}>
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: "rgba(255,255,255,0.1)",
                          color: "#f5f5f5",
                          padding: "4px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: 500
                        }}
                      >
                        {tag}
                      </span>
                    ))}
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
                    onMouseEnter={(e) => {
                      e.target.style.background = "#0CCF70";
                      e.target.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#0FD980";
                      e.target.style.transform = "translateY(0)";
                    }}
                  >
                    Start Tutorial →
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
            Raspberry Pi Resources
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            marginBottom: "24px"
          }}>
            <div style={{
              padding: "1.5rem",
              background: "#0A0C10",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <h4 style={{ margin: 0, fontSize: 16, marginBottom: "8px" }}>📚 Documentation</h4>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>Official guides and API references</p>
            </div>
            <div style={{
              padding: "1.5rem",
              background: "#0A0C10",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <h4 style={{ margin: 0, fontSize: 16, marginBottom: "8px" }}>💬 Community</h4>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>Forums, Discord, and Reddit communities</p>
            </div>
            <div style={{
              padding: "1.5rem",
              background: "#0A0C10",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <h4 style={{ margin: 0, fontSize: 16, marginBottom: "8px" }}>🛠️ Accessories</h4>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>Cases, power supplies, and add-ons</p>
            </div>
            <div style={{
              padding: "1.5rem",
              background: "#0A0C10",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)"
            }}>
              <h4 style={{ margin: 0, fontSize: 16, marginBottom: "8px" }}>🎯 Learning</h4>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>Tutorials, courses, and certifications</p>
            </div>
          </div>
          <p style={{ fontSize: 16, opacity: 0.8 }}>
            Join thousands of makers, educators, and enthusiasts building amazing projects with Raspberry Pi.
          </p>
        </div>
      </div>
    </div>
  );
}

function getDifficultyColor(difficulty) {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return '#4CAF50';
    case 'intermediate':
      return '#FF9800';
    case 'advanced':
      return '#F44336';
    default:
      return '#0FD980';
  }
}

export default RaspberryPI;
