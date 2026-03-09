import { useState, useEffect } from 'react';

// Theme constants
const T = {
  bg: "#050608",
  card: "rgba(255,255,255,0.03)",
  bgHover: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.10)",
  borderHover: "rgba(255,255,255,0.16)",
  green: "#0FD980",
  greenDim: "rgba(15,217,128,0.55)",
  greenFaint: "rgba(15,217,128,0.10)",
  greenGlow: "rgba(15,217,128,0.18)",
  text: "rgba(255,255,255,0.92)",
  textMid: "rgba(255,255,255,0.72)",
  textDim: "rgba(255,255,255,0.55)",
  textFaint: "rgba(255,255,255,0.38)",
  sans: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
  mono: "'Courier New', Courier, monospace",
};

const CATEGORIES = [
  { id: 'cpu', name: 'CPU' },
  { id: 'cpu-cooler', name: 'CPU Cooler' },
  { id: 'motherboard', name: 'Motherboard' },
  { id: 'memory', name: 'Memory' },
  { id: 'internal-hard-drive', name: 'Storage' },
  { id: 'video-card', name: 'Video Card' },
  { id: 'case', name: 'Case' },
  { id: 'power-supply', name: 'Power Supply' }
];

export default function AmazonManager() {
  const [selectedCategory, setSelectedCategory] = useState('cpu');
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCategory(selectedCategory);
  }, [selectedCategory]);

  const loadCategory = async (category) => {
    setLoading(true);
    try {
      const response = await fetch(`/top100/${category}.json`);
      const data = await response.json();
      setParts(data);
    } catch (error) {
      console.error('Failed to load parts:', error);
      setParts([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(parts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `top100-${selectedCategory}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredParts = parts.filter(part =>
    part.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const partsWithAsin = parts.filter(p => p.asin && p.asin.trim() !== '').length;
  const progress = parts.length > 0 ? ((partsWithAsin / parts.length) * 100).toFixed(1) : 0;

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.text, fontFamily: T.sans }}>

      {/* Header */}
      <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, padding: '24px 32px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: T.green, marginBottom: 8, fontWeight: 600 }}>
            AMAZON ASIN MANAGER
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
            Top 100 Parts - Add Amazon Links
          </h1>
          <p style={{ fontSize: 14, color: T.textMid, marginTop: 12, marginBottom: 0 }}>
            Add ASIN codes to enable direct Amazon affiliate links for the most popular parts
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px' }}>

        {/* Category Tabs */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          overflowX: 'auto',
          borderBottom: `1px solid ${T.border}`,
          paddingBottom: 0
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '12px 20px',
                fontSize: 11,
                letterSpacing: 2,
                fontWeight: 600,
                cursor: 'pointer',
                background: selectedCategory === cat.id ? T.greenFaint : 'transparent',
                color: selectedCategory === cat.id ? T.green : T.textMid,
                border: 'none',
                borderBottom: `2px solid ${selectedCategory === cat.id ? T.green : 'transparent'}`,
                transition: 'all 0.15s',
                fontFamily: T.sans,
                whiteSpace: 'nowrap'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Stats & Actions Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          padding: '20px 24px',
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 12
        }}>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 2, marginBottom: 4 }}>
                TOTAL PARTS
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: T.text }}>
                {parts.length}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 2, marginBottom: 4 }}>
                WITH ASIN
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: T.green }}>
                {partsWithAsin}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: T.textDim, letterSpacing: 2, marginBottom: 4 }}>
                PROGRESS
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: T.text }}>
                {progress}%
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              placeholder="Search parts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 16px',
                fontSize: 13,
                background: T.bg,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                color: T.text,
                width: 240,
                fontFamily: T.sans
              }}
            />
            <button
              onClick={downloadJSON}
              style={{
                padding: '10px 20px',
                fontSize: 11,
                letterSpacing: 2,
                fontWeight: 700,
                cursor: 'pointer',
                borderRadius: 8,
                background: T.green,
                color: '#050608',
                border: 'none',
                fontFamily: T.sans,
                boxShadow: '0 4px 14px rgba(15,217,128,0.28)'
              }}
            >
              📥 DOWNLOAD JSON
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          marginBottom: 24,
          background: T.card,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          padding: 16,
          overflow: 'hidden'
        }}>
          <div style={{
            height: 8,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: T.green,
              transition: 'width 0.3s ease',
              borderRadius: 4
            }} />
          </div>
        </div>

        {/* Instructions */}
        <div style={{
          marginBottom: 24,
          padding: '20px 24px',
          background: 'rgba(15,217,128,0.05)',
          border: `1px solid rgba(15,217,128,0.2)`,
          borderRadius: 12
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.green, marginBottom: 8 }}>
            📝 How to Add ASINs:
          </div>
          <ol style={{ fontSize: 13, color: T.textMid, margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Download the JSON file using the button above</li>
            <li>Find each product on Amazon and copy its ASIN (10-character code in the URL or product details)</li>
            <li>Add the ASIN to the corresponding product in the JSON file</li>
            <li>Save the file back to <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>/public/top100/{selectedCategory}.json</code></li>
          </ol>
        </div>

        {/* Parts List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: T.textDim }}>
            Loading parts...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredParts.map((part, index) => (
              <PartRow key={index} part={part} index={index} />
            ))}
            {filteredParts.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: T.textDim }}>
                No parts found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function PartRow({ part, index }) {
  const [hover, setHover] = useState(false);
  const hasAsin = part.asin && part.asin.trim() !== '';
  const amazonLink = hasAsin
    ? `https://www.amazon.com/dp/${part.asin}?tag=techkage-20`
    : `https://www.amazon.com/s?k=${encodeURIComponent(part.name)}&tag=techkage-20`;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '20px 24px',
        background: T.card,
        border: `1px solid ${hover ? 'rgba(15,217,128,0.18)' : T.border}`,
        borderRadius: 12,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 24,
        transition: 'all 0.2s ease',
        boxShadow: hover ? '0 4px 20px rgba(0,0,0,0.3)' : 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
        <div style={{
          fontSize: 11,
          color: T.textDim,
          fontWeight: 600,
          minWidth: 40
        }}>
          #{index + 1}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 4 }}>
            {part.name}
          </div>
          <div style={{ fontSize: 12, color: T.textMid }}>
            Price: ${part.price || 'N/A'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {hasAsin ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            background: 'rgba(15,217,128,0.1)',
            border: `1px solid rgba(15,217,128,0.3)`,
            borderRadius: 8
          }}>
            <span style={{ fontSize: 11, color: T.green, fontWeight: 600 }}>✓ ASIN:</span>
            <code style={{
              fontSize: 13,
              color: T.text,
              fontFamily: T.mono,
              fontWeight: 600
            }}>
              {part.asin}
            </code>
          </div>
        ) : (
          <div style={{
            padding: '8px 16px',
            background: 'rgba(255,170,0,0.1)',
            border: `1px solid rgba(255,170,0,0.3)`,
            borderRadius: 8,
            fontSize: 11,
            color: '#ffaa00',
            fontWeight: 600
          }}>
            ⚠ NO ASIN
          </div>
        )}

        <a
          href={amazonLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '8px 16px',
            fontSize: 11,
            letterSpacing: 1,
            fontWeight: 600,
            color: hover ? T.green : T.textMid,
            background: hover ? 'rgba(15,217,128,0.12)' : 'transparent',
            border: `1px solid ${hover ? 'rgba(15,217,128,0.3)' : T.border}`,
            borderRadius: 8,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          {hasAsin ? 'VIEW ON AMAZON →' : 'SEARCH ON AMAZON →'}
        </a>
      </div>
    </div>
  );
}
