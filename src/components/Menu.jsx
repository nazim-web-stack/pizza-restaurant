import { useEffect, useMemo, useState } from 'react';

// Add spinner animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function normalizeItem(raw) {
  const id = raw._id != null ? String(raw._id) : String(raw.id ?? '');
  const img = raw.img || raw.image || '/images/pizza-1.jpg';
  const price = typeof raw.price === 'number' ? raw.price : Number(raw.price) || 0;
  const category = raw.category || 'Other';
  const desc = raw.description || raw.desc || 'Far far away, behind the word mountains';
  return { ...raw, id, name: raw.name || 'Item', img, price, category, desc };
}

function categoryLabel(c) {
  if (!c || typeof c !== 'object') return '';
  return c.name || c.title || c.label || c.category || '';
}

export default function Menu() {
  const [items, setItems] = useState([]);
  const [sectionOrder, setSectionOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [menuRes, catRes] = await Promise.all([
          fetch(`${API}/api/menu`),
          fetch(`${API}/api/menu/categories`),
        ]);
        if (!menuRes.ok) throw new Error('menu');
        const rawItems = await menuRes.json();
        const rawCats = catRes.ok ? await catRes.json() : [];
        if (cancelled) return;
        const normalized = Array.isArray(rawItems) ? rawItems.map(normalizeItem) : [];
        setItems(normalized);

        const fromApi = Array.isArray(rawCats)
          ? rawCats.map(categoryLabel).filter(Boolean)
          : [];
        const fromItems = [...new Set(normalized.map((i) => i.category).filter(Boolean))];
        setSectionOrder(fromApi.length ? fromApi : fromItems);
        setError(null);
      } catch {
        if (!cancelled) {
          setError('Failed to load menu.');
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = {};
    for (const it of items) {
      const k = it.category || 'Other';
      if (!map[k]) map[k] = [];
      map[k].push(it);
    }
    return map;
  }, [items]);

  const keysToShow = useMemo(() => {
    const keys = Object.keys(grouped);
    if (sectionOrder.length) {
      const ordered = sectionOrder.filter((k) => keys.includes(k));
      const rest = keys.filter((k) => !ordered.includes(k));
      return [...ordered, ...rest];
    }
    return keys.sort();
  }, [grouped, sectionOrder]);

  return (
    <section id="menu" style={{ padding: '100px 0', background: '#1a1a2e' }}>
      <div className="container">
        <div className="text-center mb-5">
          <span
            style={{
              color: '#f5a623',
              fontSize: '0.8rem',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            Our Menu
          </span>
          <h2
            style={{
              fontFamily: 'Georgia',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: '#fff',
              display: 'block',
              marginTop: '10px',
            }}
          >
            Pizza Delicious — Fresh from the kitchen
          </h2>
        </div>

        {loading && (
          <div className="text-center" style={{ padding: '60px 0' }}>
            <div 
              style={{
                width: '40px',
                height: '40px',
                border: '4px solid rgba(255,255,255,0.1)',
                borderTop: '4px solid #f5a623',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}
            ></div>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>
              Loading menu…
            </p>
          </div>
        )}
        {error && !loading && (
          <p className="text-center" style={{ color: '#e74c3c' }}>
            {error}
          </p>
        )}

        {!loading &&
          keysToShow.map((sectionKey) => (
            <div key={sectionKey} className="mb-5">
              <h3
                style={{
                  fontFamily: 'Georgia',
                  color: '#f5a623',
                  fontSize: '1.5rem',
                  marginBottom: '24px',
                  borderBottom: '1px solid rgba(245,166,35,0.25)',
                  paddingBottom: '8px',
                }}
              >
                {sectionKey}
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px',
                marginTop: '20px'
              }}>
                {(grouped[sectionKey] || []).map((item) => (
                  <div key={item.id}>
                    <div style={{
                      background: '#16213e',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid #333'
                    }}>
                      <img 
                        src={item.img || item.imageUrl || '/images/pizza-1.jpg'}
                        style={{width: '100%', height: '200px', objectFit: 'cover'}}
                        alt={item.name}
                        onError={(e) => { e.target.src = '/images/pizza-1.jpg'; }}
                      />
                      <div style={{padding: '16px'}}>
                        <h5 style={{color: '#fff', marginBottom: '8px'}}>{item.name}</h5>
                        <p style={{color: '#888', fontSize: '0.9rem'}}>{item.desc || item.description}</p>
                        <p style={{color: '#f5a623', fontWeight: 'bold'}}>Rs {item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        {!loading && items.length === 0 && !error && (
          <p className="text-center" style={{ color: 'rgba(255,255,255,0.45)' }}>
            No menu items found — please check menuItems collection in MongoDB.
          </p>
        )}
      </div>
    </section>
  );
}
