import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import PCTower from '../assets/PCTower.jpg';
import Ram from '../assets/Ram.jpg';
import RTX4090 from '../assets/RTX4090.JPG';

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800;900&family=JetBrains+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes aurora {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes grain {
    0%, 100% { transform: translate(0, 0); }
    10%       { transform: translate(-2%, -3%); }
    20%       { transform: translate(3%, 1%); }
    30%       { transform: translate(-1%, 4%); }
    40%       { transform: translate(4%, -2%); }
    50%       { transform: translate(-3%, 3%); }
    60%       { transform: translate(2%, -4%); }
    70%       { transform: translate(-4%, 1%); }
    80%       { transform: translate(1%, 3%); }
    90%       { transform: translate(3%, -1%); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 12px rgba(15,217,128,0.4); }
    50%       { box-shadow: 0 0 28px rgba(15,217,128,0.9); }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100vh); }
    100% { transform: translateY(100vh); }
  }
  .shimmer-btn {
    position: relative;
    overflow: hidden;
  }
  .shimmer-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%);
    background-size: 200% 100%;
    animation: shimmer 2.4s linear infinite;
  }

  /* ── Responsive layout ── */
  .hero-grid {
    display: grid;
    grid-template-columns: 55fr 45fr;
    flex: 1;
    overflow: hidden;
    padding-bottom: 36px;
  }
  .hero-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4rem 3.5rem 4rem 4rem;
    gap: 26px;
    border-right: 1px solid rgba(255,255,255,0.06);
    overflow-y: auto;
  }
  .hero-right {
    display: flex;
    flex-direction: column;
    padding: 3rem 3rem 3rem 2.5rem;
    gap: 16px;
    overflow: hidden;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .feature-chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  @media (max-width: 900px) {
    .hero-grid {
      grid-template-columns: 1fr;
      overflow-y: auto;
      padding-bottom: 36px;
    }
    .hero-left {
      border-right: none;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      padding: 2.5rem 1.75rem;
      justify-content: flex-start;
      overflow-y: visible;
    }
    .hero-right {
      padding: 2rem 1.75rem 1.5rem;
    }
  }

  @media (max-width: 480px) {
    .hero-left {
      padding: 2rem 1.25rem;
      gap: 20px;
    }
    .hero-right {
      padding: 1.5rem 1.25rem;
    }
    .stats-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }
  }
`;

/* ─── CountUp ─── */
function CountUp({ target, prefix = "", suffix = "", duration = 1800 }) {
  const [val, setVal] = useState(0);
  const numericTarget = parseFloat(String(target).replace(/[^0-9.]/g, ""));
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * numericTarget));
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [numericTarget, duration]);
  return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

/* ─── MiniChart ─── */
function MiniChart({ accent }) {
  const bars = [42, 68, 55, 80, 63, 90, 74];
  return (
    <div style={{
      position: "absolute", bottom: 48, right: 12,
      background: "rgba(5,6,10,0.55)", backdropFilter: "blur(14px)",
      border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10,
      padding: "10px 12px", display: "flex", flexDirection: "column",
      gap: 6, zIndex: 2, minWidth: 100,
    }}>
      <div style={{ fontSize: 9, letterSpacing: 2, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>
        Budget split
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 36 }}>
        {bars.map((h, i) => (
          <motion.div key={i}
            initial={{ height: 0 }} animate={{ height: `${h}%` }}
            transition={{ delay: 0.6 + i * 0.06, duration: 0.5, ease: "easeOut" }}
            style={{ flex: 1, background: i === bars.length - 1 ? accent : `${accent}55`, borderRadius: "2px 2px 0 0", alignSelf: "flex-end" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Marquee ─── */
const TICKER_ITEMS = [
  "RTX 4090 · $1,599", "Ryzen 9 7950X · $699", "DDR5 64GB · $189",
  "Samsung 990 Pro 2TB · $149", "ASUS ROG STRIX X670E · $499",
  "Be Quiet! Dark Power 13 · $189", "Noctua NH-D15 · $99",
  "Corsair iCUE 5000X · $179", "Intel Core i9-14900K · $549",
  "RX 7900 XTX · $899",
];

function Marquee() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0, height: 36,
      overflow: "hidden", borderTop: "1px solid rgba(15,217,128,0.15)",
      background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", zIndex: 10,
    }}>
      <div style={{ display: "flex", whiteSpace: "nowrap", animation: "marquee 28s linear infinite" }}>
        {items.map((item, i) => (
          <span key={i} style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: i % 2 === 0 ? "rgba(255,255,255,0.5)" : "#0FD980",
            paddingRight: 48, letterSpacing: 1,
          }}>
            {i % 2 === 0 ? "▸ " : ""}{item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── TerminalInput ─── */
function TerminalInput({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      borderRadius: 8, background: "rgba(0,0,0,0.7)",
      border: `1px solid ${focused ? "#0FD980" : "rgba(255,255,255,0.1)"}`,
      transition: "border-color 0.2s, box-shadow 0.2s", overflow: "hidden",
      boxShadow: focused ? "0 0 20px rgba(15,217,128,0.15)" : "none",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.04)", padding: "6px 12px",
        display: "flex", alignItems: "center", gap: 6,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {["#FF5F57", "#FFBD2E", "#28CA41"].map((c, i) => (
          <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.8 }} />
        ))}
        <span style={{ marginLeft: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>
          buildconfig.ai ~
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", padding: "12px 14px", gap: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#0FD980", marginTop: 1, userSelect: "none", flexShrink: 0 }}>
          $&gt;
        </span>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            placeholder='describe your build... e.g. "$1200, gaming + light editing"'
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: "100%", background: "transparent", border: "none", outline: "none",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              color: "#f5f5f5", lineHeight: 1.6, caretColor: "#0FD980",
            }}
          />
          {!value && !focused && (
            <span style={{
              position: "absolute", left: 0, top: 0, width: 8, height: "1.1em",
              background: "#0FD980", opacity: 0.8, animation: "blink 1s step-end infinite", display: "inline-block",
            }} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── StatsBar ─── */
function StatsBar() {
  const stats = [
    { label: "Avg. Saved",    raw: "214",   prefix: "$", suffix: "",  accent: "#0FD980" },
    { label: "Parts Indexed", raw: "18400", prefix: "",  suffix: "+", accent: "#78A3FF" },
    { label: "Builds Done",   raw: "3200",  prefix: "",  suffix: "+", accent: "#FFD66B" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.7 }}
      className="stats-grid"
    >
      {stats.map((s, i) => (
        <motion.div key={s.label}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          style={{
            borderRadius: 10, border: `1px solid ${s.accent}30`,
            background: `linear-gradient(135deg, ${s.accent}0A, rgba(0,0,0,0.3))`,
            padding: "0.75rem 0.5rem", display: "flex", flexDirection: "column",
            gap: 5, textAlign: "center", cursor: "default",
          }}
        >
          <div style={{
            fontSize: "clamp(14px, 2vw, 22px)", fontWeight: 900, color: s.accent,
            letterSpacing: 0.5, fontFamily: "'Orbitron', sans-serif",
            textShadow: `0 0 20px ${s.accent}66`,
          }}>
            <CountUp target={s.raw} prefix={s.prefix} suffix={s.suffix} />
          </div>
          <div style={{
            fontSize: "clamp(7px, 1vw, 9px)", color: "rgba(255,255,255,0.45)",
            textTransform: "uppercase", letterSpacing: 1.5,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {s.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─── BudgetSlideshow ─── */
function BudgetSlideshow() {
  const slides = [
    { label: "Budget overview",  accent: "#0FD980", image: PCTower },
    { label: "GPU vs CPU spend", accent: "#78A3FF", image: Ram     },
    { label: "Upgrade paths",    accent: "#FFD66B", image: RTX4090 },
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((p) => (p + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, [slides.length]);
  const active = slides[index];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9 }}
      style={{
        borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(2,4,8,0.95)", padding: "1.2rem",
        display: "flex", flexDirection: "column", gap: 12,
        overflow: "hidden", flex: 1, minHeight: 200,
      }}
    >
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 4, color: "rgba(255,255,255,0.4)", fontFamily: "'JetBrains Mono', monospace" }}>
        ◈ Live Preview
      </div>
      <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", flex: 1, minHeight: 180 }}>
        <AnimatePresence mode="wait">
          <motion.img key={index} src={active.image} alt={active.label}
            initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.7 }}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }}
          />
        </AnimatePresence>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)", borderRadius: 10, zIndex: 1 }} />
        <MiniChart accent={active.accent} />
        <div style={{ position: "absolute", bottom: 12, left: 12, zIndex: 3, fontSize: 11, fontWeight: 600, color: "#fff", background: "rgba(0,0,0,0.5)", padding: "5px 12px", borderRadius: 6, letterSpacing: 2, backdropFilter: "blur(8px)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase" }}>
          {active.label}
        </div>
        <div style={{ position: "absolute", top: 12, right: 12, width: 10, height: 10, borderRadius: "50%", background: active.accent, zIndex: 3, animation: "pulseGlow 2s ease-in-out infinite" }} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {slides.map((s, i) => (
          <motion.div key={s.label} onClick={() => setIndex(i)}
            animate={{ width: i === index ? 24 : 8, background: i === index ? s.accent : "rgba(255,255,255,0.15)" }}
            transition={{ duration: 0.3 }}
            style={{ height: 3, borderRadius: 999, cursor: "pointer" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main ─── */
function PCBuilder() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{
        width: "100vw", minHeight: "100vh", height: "100vh",
        display: "flex", flexDirection: "column", overflow: "hidden",
        fontFamily: "'Orbitron', system-ui, sans-serif",
        color: "#f5f5f5", position: "relative", background: "#04050A",
    
      }}>

        {/* Aurora bg */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, #04050A 0%, #071A10 25%, #050B18 50%, #100710 75%, #04050A 100%)", backgroundSize: "300% 300%", animation: "aurora 12s ease infinite", zIndex: 0 }} />

        {/* Glows */}
        <div style={{ position: "absolute", top: "-15%", left: "-10%", width: "55%", height: "55%", borderRadius: "50%", background: "radial-gradient(circle, rgba(15,217,128,0.18) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "40%", height: "40%", borderRadius: "50%", background: "radial-gradient(circle, rgba(120,163,255,0.14) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

        {/* Grain */}
        <div style={{ position: "absolute", inset: "-50%", width: "200%", height: "200%", opacity: 0.045, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px", animation: "grain 0.4s steps(1) infinite", zIndex: 1, pointerEvents: "none" }} />

        {/* Scanline */}
        <div style={{ position: "absolute", left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, rgba(15,217,128,0.06), transparent)", animation: "scanline 8s linear infinite", zIndex: 2, pointerEvents: "none" }} />

        {/* ── Main grid ── */}
        <main className="hero-grid" style={{ position: "relative", zIndex: 3 }}>

          {/* LEFT */}
          <div className="hero-left">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, width: "fit-content", padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(15,217,128,0.4)", background: "rgba(15,217,128,0.08)", fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "#0FD980", fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0FD980", animation: "pulseGlow 2s ease-in-out infinite", flexShrink: 0 }} />
              AI-Powered Build Planner
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              style={{ fontSize: "clamp(28px, 4.5vw, 64px)", fontWeight: 900, lineHeight: 1.08, letterSpacing: -0.5 }}
            >
              Plan your next{" "}
              <span style={{ display: "inline-block", background: "linear-gradient(90deg, #0FD980 0%, #78A3FF 60%, #0FD980 100%)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 3s linear infinite" }}>
                PC Build
              </span>
              <br />
              <span style={{ color: "rgba(255,255,255,0.85)" }}>in plain English.</span>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
              style={{ fontSize: "clamp(12px, 1.4vw, 14px)", lineHeight: 1.85, color: "rgba(255,255,255,0.55)", maxWidth: 440, fontFamily: "'JetBrains Mono', monospace", fontWeight: 300 }}
            >
              Describe your budget, use-cases, and parts you already own. Our AI engine suggests smart part lists, tradeoffs, and upgrade paths — instantly.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
              <TerminalInput value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
              style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}
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

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}
              className="feature-chips"
            >
              {["Budget breakdown", "Part suggestions", "Upgrade vs new build"].map((label) => (
                <span key={label} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "3px 10px", letterSpacing: 1, textTransform: "uppercase" }}>
                  {label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="hero-right">
            <BudgetSlideshow />
            <StatsBar />
          </div>
        </main>

        <Marquee />
      </div>
    </>
  );
}

export default PCBuilder;