// src/build-components/BuildAnalytics.jsx
import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
} from 'recharts';

const T = {
  bg:         "#050608",
  bgCard:     "#0A0C10",
  bgHover:    "#0E1117",
  border:     "rgba(255,255,255,0.08)",
  borderHover:"rgba(255,255,255,0.16)",
  green:      "#0FD980",
  greenDim:   "rgba(15,217,128,0.35)",
  greenFaint: "rgba(15,217,128,0.06)",
  greenGlow:  "rgba(15,217,128,0.18)",
  text:       "#F0F0F0",
  textMid:    "rgba(255,255,255,0.55)",
  textDim:    "rgba(255,255,255,0.3)",
  textFaint:  "rgba(255,255,255,0.15)",
  font:       "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

export function BuildAnalytics({ config, generatedBuild }) {
  // ─── PRICE PARSER ──────────────────────────────────────────────
  // Handles "$149", 149, "149", null — whatever the API returns
  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    return parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;
  };

  // ─── RADAR DATA ────────────────────────────────────────────────
  const radarData = [
    {
      subject: 'Gaming',
      A: Math.min(10, (config.usage?.includes('gaming') ? 8 : 4) + (config.performance === 'high' ? 2 : config.performance === 'medium' ? 1 : 0)),
      fullMark: 10,
    },
    {
      subject: 'Workstation',
      A: Math.min(10, (config.usage?.includes('workstation') ? 8 : 4) + (config.performance === 'high' ? 2 : config.performance === 'medium' ? 1 : 0)),
      fullMark: 10,
    },
    {
      subject: 'Value',
      A: Math.min(10, 8 - (config.budget / 200)),
      fullMark: 10,
    },
    {
      subject: 'Aesthetics',
      A: Math.min(10, (config.extras ? 6 : 4) + (config.cooling === 'high' ? 2 : 0)),
      fullMark: 10,
    },
    {
      subject: 'Future-Proof',
      A: Math.min(10, (config.performance === 'high' ? 8 : config.performance === 'medium' ? 6 : 4) + (config.cooling === 'high' ? 1 : 0)),
      fullMark: 10,
    },
  ];

  // ─── BOTTLENECK ────────────────────────────────────────────────
  const getPerformanceTier = (partName) => {
    const name = (partName || '').toLowerCase();
    if (name.includes('i9') || name.includes('ryzen 9') || name.includes('4090') || name.includes('4080') || name.includes('7900')) return 'high';
    if (name.includes('i7') || name.includes('ryzen 7') || name.includes('4070') || name.includes('4060') || name.includes('7800')) return 'medium';
    return 'low';
  };

  const cpuTier = getPerformanceTier(generatedBuild?.CPU?.name);
  const gpuTier = getPerformanceTier(generatedBuild?.GPU?.name);
  const tierMultipliers = { low: 0.6, medium: 0.8, high: 1.0 };

  const predictedBenchmarks = {
    cinebench: Math.round(20000 * tierMultipliers[cpuTier]),
    timeSpy:   Math.round(15000 * tierMultipliers[gpuTier]),
  };

  const predictedFPS = {
    cyberpunk4k:   Math.round(45  * tierMultipliers[gpuTier]),
    fortnite1440p: Math.round(180 * tierMultipliers[gpuTier]),
    valorant1080p: Math.round(300 * tierMultipliers[gpuTier]),
  };

  let bottleneckScore = 30;
  if (cpuTier === gpuTier)                          bottleneckScore -= 15;
  if (cpuTier === 'high' && gpuTier === 'high')     bottleneckScore -= 10;
  if (cpuTier === 'low'  && gpuTier === 'high')     bottleneckScore += 10;
  if (cpuTier === 'high' && gpuTier === 'low')      bottleneckScore -= 5;
  bottleneckScore = Math.max(0, Math.min(100, bottleneckScore));

  const bottleneckColor =
    bottleneckScore <= 10 ? '#22c55e' :
    bottleneckScore <= 20 ? '#eab308' : '#ef4444';
  const bottleneckLabel =
    bottleneckScore <= 10 ? 'Low' :
    bottleneckScore <= 20 ? 'Moderate' : 'High';

  // ─── BUDGET ALLOCATION ─────────────────────────────────────────
  // Covers both uppercase keys (CPU, GPU, MOTHERBOARD) and title-case (Motherboard)
  const categoryColors = {
    CPU:         '#8b5cf6',
    GPU:         '#3b82f6',
    MOTHERBOARD: '#a78bfa',
    Motherboard: '#a78bfa',
    RAM:         '#fbbf24',
    STORAGE:     '#f87171',
    Storage:     '#f87171',
    PSU:         '#ec4899',
    CASE:        '#60a5fa',
    Case:        '#60a5fa',
    COOLING:     '#06b6d4',
    Cooling:     '#06b6d4',
    Other:       '#64748b',
  };

  const buildParts = Object.entries(generatedBuild || {});

  const budgetData = buildParts
    .map(([category, part]) => ({
      name: category,
      // Try both price and priceNumeric — handle "$149", 149, "149"
      value: parsePrice(part.price ?? part.priceNumeric),
      color: categoryColors[category] || '#64748b',
    }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const totalBuildPrice = budgetData.reduce((sum, item) => sum + item.value, 0);

  // Custom label: only show if slice is big enough to avoid overlap
  const renderLabel = ({ name, percent }) => {
    if (percent < 0.06) return null;
    return `${name} ${Math.round(percent * 100)}%`;
  };

  return (
    <div style={{ marginTop: 50, marginBottom: 50, background: T.bg, borderRadius: 12, padding: 24 }}>
      <div style={{
        fontSize: 20, fontWeight: 700, color: T.text,
        textAlign: 'center', marginBottom: 24, letterSpacing: 0.5,
      }}>
        Build Analytics
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>

        {/* ── 1. Build DNA ── */}
        <div style={{ background: T.bgCard, borderRadius: 12, border: `1px solid ${T.border}`, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, textAlign: 'center', color: T.green, marginBottom: 8 }}>Build DNA</div>
          <div style={{ fontSize: 12, color: T.textMid, textAlign: 'center', marginBottom: 16 }}>Performance profile across categories</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke={T.border} />
              <PolarAngleAxis dataKey="subject" stroke={T.textDim} fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} stroke={T.border} tick={false} />
              <Radar name="Score" dataKey="A" stroke={T.green} fill={T.green} fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* ── 2. Bottleneck ── */}
       <div style={{ background: T.bgCard, borderRadius: 12, border: `1px solid ${T.border}`, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: T.green, marginBottom: 8 }}>Bottleneck Analysis</div>
      <div style={{ fontSize: 12, color: T.textMid, marginBottom: 16, textAlign: 'center' }}>CPU/GPU balance at 1440p</div>

      {/* Chart only — no label inside */}
      <ResponsiveContainer width="100%" height={120}>
        <PieChart>
          <Pie
            data={[{ value: bottleneckScore }, { value: 100 - bottleneckScore }]}
            dataKey="value" cx="50%" cy="100%"
            startAngle={180} endAngle={0}
            innerRadius="60%" outerRadius="90%"
            paddingAngle={4}
          >
            <Cell fill={bottleneckColor} />
            <Cell fill={T.bgHover} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Label sits naturally below with breathing room */}
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: bottleneckColor, lineHeight: 1 }}>
          {bottleneckScore}%
        </div>
        <div style={{ fontSize: 13, color: T.textMid, marginTop: 6 }}>
          {bottleneckLabel}
        </div>
      </div>

      <p style={{ fontSize: 12, color: T.textDim, textAlign: 'center', marginTop: 12, maxWidth: 280 }}>
        At 1440p resolution, {bottleneckLabel === 'Low' ? 'your CPU and GPU are well matched.' : 'there may be a slight imbalance between CPU and GPU performance.'}
      </p>
    </div>

        {/* ── 3. Budget Allocation ── */}
        <div style={{ background: T.bgCard, borderRadius: 12, border: `1px solid ${T.border}`, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, textAlign: 'center', color: T.green, marginBottom: 8 }}>Budget Allocation</div>
          <div style={{ fontSize: 12, color: T.textMid, textAlign: 'center', marginBottom: 4 }}>Where your money goes</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, textAlign: 'center', marginBottom: 16 }}>
            Total: ${totalBuildPrice.toLocaleString()}
          </div>

          {budgetData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={budgetData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    label={renderLabel}
                    labelLine={false}
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${value}`, '']}
                    contentStyle={{ background: T.bgHover, border: `1px solid ${T.border}`, borderRadius: 8, padding: '8px 12px' }}
                    labelStyle={{ color: T.text }}
                    itemStyle={{ color: T.textMid }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
                {budgetData.map((item) => (
                  <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: T.textMid }}>{item.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ fontSize: 12, color: T.text, fontWeight: 600 }}>${item.value}</span>
                      <span style={{ fontSize: 11, color: T.textDim, width: 36, textAlign: 'right' }}>
                        {totalBuildPrice > 0 ? Math.round((item.value / totalBuildPrice) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: T.textDim, fontSize: 13, paddingTop: 40 }}>
              No pricing data available yet.
            </div>
          )}
        </div>

        {/* ── 4. Performance Predictor ── */}
        <div style={{ background: T.bgCard, borderRadius: 12, border: `1px solid ${T.border}`, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: 14, fontWeight: 600, textAlign: 'center', color: T.green, marginBottom: 8 }}>Performance Predictor</div>
          <div style={{ fontSize: 12, color: T.textMid, textAlign: 'center', marginBottom: 16 }}>Estimated scores based on your build</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: T.textDim, marginBottom: 8, fontWeight: 600 }}>BENCHMARKS</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: T.textMid }}>Cinebench R23 Multi</span>
                <span style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{predictedBenchmarks.cinebench.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: T.textMid }}>3DMark Time Spy</span>
                <span style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>{predictedBenchmarks.timeSpy.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: T.textDim, marginBottom: 8, fontWeight: 600 }}>GAME PERFORMANCE</div>
              {[
                { label: 'Cyberpunk 2077 (4K High)', fps: predictedFPS.cyberpunk4k },
                { label: 'Fortnite (1440p Epic)',    fps: predictedFPS.fortnite1440p },
                { label: 'Valorant (1080p)',          fps: predictedFPS.valorant1080p },
              ].map(({ label, fps }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: T.textMid }}>{label}</span>
                    <span style={{ fontSize: 13, color: T.green, fontWeight: 600 }}>{fps} FPS</span>
                  </div>
                  <div style={{ height: 3, background: T.border, borderRadius: 999 }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(100, (fps / 300) * 100)}%`,
                      background: T.green,
                      borderRadius: 999,
                      opacity: 0.7,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: 11, color: T.textFaint, marginTop: 16, textAlign: 'center' }}>
            Estimates based on component tiers
          </div>
        </div>

      </div>
    </div>
  );
}