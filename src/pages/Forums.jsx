export default function Forums() {
    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#050608",
            color: "#f0f0f2",
            fontFamily: "'JetBrains Mono', monospace",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
        }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Orbitron:wght@700&display=swap');`}</style>

            <div style={{ fontSize: "0.7rem", letterSpacing: "0.25em", color: "rgba(240,240,242,0.22)" }}>
                COMMUNITY
            </div>

            <h1 style={{
                margin: 0,
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "2.5rem",
                color: "#0FD980",
            }}>
                Forums
            </h1>

            <div style={{
                width: "40px",
                height: "2px",
                background: "#0FD980",
                borderRadius: "2px",
            }} />

            <p style={{ color: "rgba(240,240,242,0.40)", fontSize: "0.85rem", margin: 0 }}>
                Coming soon — share builds, discuss parts, get help.
            </p>
        </div>
    );
}
