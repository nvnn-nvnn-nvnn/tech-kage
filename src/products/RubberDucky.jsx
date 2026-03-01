import React from "react";
import rubberDuckyImg from '../assets/rubberducky.webp';

const productInfo = {
  name: "USB Rubber Ducky",
  price: "$49.99",
  image: rubberDuckyImg,
  badge: "Hacking Tool",
  description: "The USB Rubber Ducky looks like a normal USB drive, but acts like a keyboard that types out pre-programmed keystroke sequences at superhuman speeds. Perfect for penetration testing, system administration, and automation tasks.",
  specs: {
    compatibility: "Windows, macOS, Linux, Android",
    storage: "MicroSD Card Slot",
    speed: "1000 words per minute typing",
    scripting: "DuckyScript language",
    dimensions: "2.8\" x 0.7\" x 0.35\"",
    weight: "0.7 oz"
  },
  features: [
    "Looks like a normal USB drive",
    "Types 1000 WPM - faster than any human",
    "Runs on any computer with USB port",
    "Programmable with DuckyScript",
    "MicroSD card for payload storage",
    "No drivers or software installation required",
    "Works on locked computers",
    "Bypass security measures"
  ],
  useCases: [
    {
      title: "Penetration Testing",
      description: "Deploy payloads during security assessments to demonstrate vulnerabilities"
    },
    {
      title: "System Administration",
      description: "Automate repetitive tasks, software installations, and system configurations"
    },
    {
      title: "Educational Demonstrations",
      description: "Show how social engineering and physical access can compromise systems"
    },
    {
      title: "Rapid Deployment",
      description: "Quickly set up multiple computers with identical configurations"
    }
  ],
  payloads: [
    "Password hash dumping",
    "Backdoor installation",
    "WiFi credential extraction",
    "System information gathering",
    "Automated login scripts",
    "File exfiltration",
    "Remote access setup"
  ]
};

function RubberDucky() {
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
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          marginBottom: "4rem",
          alignItems: "start"
        }}>
          <div>
            <span style={{
              background: "rgba(15,217,128,0.1)",
              color: "#0FD980",
              padding: "6px 12px",
              borderRadius: "16px",
              fontSize: "14px",
              fontWeight: 600,
              marginBottom: "16px",
              display: "inline-block"
            }}>
              {productInfo.badge}
            </span>
            <h1 style={{ fontSize: 48, marginBottom: 16, fontWeight: 800, letterSpacing: -1, fontFamily: "'Orbitron', sans-serif" }}>
              {productInfo.name}
            </h1>
            <p style={{ fontSize: 18, opacity: 0.8, lineHeight: 1.6, marginBottom: "24px", fontFamily: "'Orbitron', sans-serif" }}>
              {productInfo.description}
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
            <div style={{ marginBottom: "24px" }}>
              <span style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#0FD980",
                marginRight: "16px"
              }}>
                {productInfo.price}
              </span>
              <span style={{
                fontSize: "16px",
                opacity: 0.7,
                textDecoration: "line-through"
              }}>
                $59.99
              </span>
            </div>
            <button style={{
              padding: "16px 32px",
              background: "#0FD980",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              marginRight: "16px"
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
            <button style={{
              padding: "16px 32px",
              background: "transparent",
              color: "#0FD980",
              border: "1px solid #0FD980",
              borderRadius: "8px",
              fontSize: "16px",
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
              Learn More
            </button>
          </div>
          <div>
            <img
              src={productInfo.image}
              alt={productInfo.name}
              style={{
                width: "100%",
                maxWidth: "400px",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
              }}
            />
          </div>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "4rem"
        }}>
          <div style={{
            background: "#0A0C10",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "24px"
          }}>
            <h3 style={{
              fontSize: "24px",
              fontWeight: 700,
              marginBottom: "16px",
              color: "#0FD980"
            }}>
              Technical Specifications
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              fontSize: "14px",
              opacity: 0.8
            }}>
              {Object.entries(productInfo.specs).map(([key, value]) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: "#0A0C10",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "24px"
          }}>
            <h3 style={{
              fontSize: "24px",
              fontWeight: 700,
              marginBottom: "16px",
              color: "#0FD980"
            }}>
              Key Features
            </h3>
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: 0
            }}>
              {productInfo.features.map((feature, index) => (
                <li
                  key={index}
                  style={{
                    padding: "8px 0",
                    borderBottom: index < productInfo.features.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    opacity: 0.8
                  }}
                >
                  <span style={{
                    color: "#0FD980",
                    marginRight: "12px",
                    fontSize: "16px"
                  }}>
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* // Sample Payloads Section */}
        <div style={{ margin: "4rem 0" }}>
          <h2 style={{
            fontSize: 32,
            marginBottom: 24,
            fontWeight: 700,
            color: "#0FD980"
          }}>
            Use Cases
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2rem"
          }}>
            {productInfo.useCases.map((useCase, index) => (
              <div
                key={index}
                style={{
                  background: "#0A0C10",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "24px",
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
                <h4 style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  marginBottom: "12px"
                }}>
                  {useCase.title}
                </h4>
                <p style={{
                  fontSize: "14px",
                  opacity: 0.8,
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* // Sample Payloads Section */}
        <div style={{ margin: "4rem 0" }}>
          <h2 style={{
            fontSize: 32,
            marginBottom: 24,
            fontWeight: 700,
            color: "#0FD980"
          }}>
            Sample Payloads
          </h2>

          <div style={{
            background: "#0A0C10",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "28px 32px",
            fontFamily: "system-ui, sans-serif"
          }}>
            <p style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.8)",
              marginBottom: 24,
              fontWeight: 700
            }}>
              The Rubber Ducky can execute various automated tasks. Here are some common payload examples:
            </p>

            <ul

              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: 15,
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.7
              }}


            >
              {productInfo.payloads.map((payload, index) => (
                <li
                  key={index}
                  style={{
                    position: "relative",
                    paddingLeft: "28px",
                    marginBottom: "14px",
                    transition: "all 0.2s ease"
                  }}
                >
                  {/* Custom bullet */}
                  <span style={{
                    position: "absolute",
                    left: 0,
                    color: "#0FD980",
                    fontWeight: 700,
                    fontSize: 18
                  }}>
                    •
                  </span>

                  {/* Payload text */}
                  <span style={{
                    color: "rgba(255,255,255,0.95)"
                  }}>
                    {payload}
                  </span>

                  {/* Optional subtle hover hint */}
                  <span style={{
                    opacity: 0,
                    transition: "opacity 0.2s",
                    marginLeft: 8,
                    fontSize: 13,
                    color: "rgba(15,217,128,0.6)"
                  }} className="copy-hint">
                    (click to copy)
                  </span>
                </li>
              ))}
            </ul>

            {/* Optional footer note */}
            <p style={{
              marginTop: 28,
              fontSize: 14,
              color: "rgba(255,255,255,0.5)",
              fontStyle: "italic"
            }}>
              Note: These are example payloads only. Always use responsibly and in accordance with applicable laws.
            </p>
          </div>
        </div>
        <div style={{
          textAlign: "center",
          padding: "3rem",
          background: "rgba(15,217,128,0.05)",
          border: "1px solid rgba(15,217,128,0.2)",
          borderRadius: "12px"
        }}>
          <h3 style={{ fontSize: 24, marginBottom: 16, color: "#0FD980", fontWeight: 700, fontFamily: "'Orbitron', sans-serif" }}>
            Ethical Use Only
          </h3>
          <p style={{ fontSize: 20, opacity: 0.8, marginBottom: 24, maxWidth: "600px", margin: "0 auto 24px", fontFamily: "Arial, sans-serif" }}>
            The USB Rubber Ducky is a powerful tool designed for penetration testing and system administration.
            Always obtain explicit permission before using on any system you don't own. Use responsibly and ethically.
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
              View Documentation
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
              Community Scripts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RubberDucky;
