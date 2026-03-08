import { color } from "framer-motion";
import React from "react";

const T = {
    bg: "#050608",
    card: "#0D0F14",
    border: "rgba(255,255,255,0.08)",
    text: "#f0f0f2",
    textMid: "rgba(240,240,242,0.50)",
    mono: "'JetBrains Mono', monospace",
};

export default function DevelopmentBanner() {
    return (
        <div
            style={{
                background: "linear-gradient(90deg, rgba(255,165,0,0.15) 0%, rgba(255,69,0,0.15) 100%)",
                borderBottom: "2px solid rgba(255,165,0,0.3)",
                padding: "1rem 1.5rem",
                textAlign: "center",
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backdropFilter: "blur(10px)",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                }}
            >
                <span
                    style={{
                        fontSize: "1.25rem",
                        color: "#FFA500",
                    }}
                >
                    ⚠️
                </span>
                <p
                    style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        color: T.text,
                        fontFamily: T.mono,
                        letterSpacing: "0.02em",
                    }}
                >
                    <strong style={{ color: "#FFA500" }}>Site Under Development:</strong> <span style={{ color: "#0FD980" }}> TechKage</span> is currently undergoing renovations and may display inaccurate information.
                    The AI Builder is semi-functional, but the Manual Part Builder is still under development.
                    Please do not make purchases at this time as features are still being implemented and tested.
                </p>
            </div>
        </div>
    );
}
