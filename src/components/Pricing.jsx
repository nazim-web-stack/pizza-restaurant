import React, { useState, useEffect } from 'react'

export default function Pricing() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/menu');
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      setItems(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div className="container">
          <div className="text-center">
            <p style={{ color: '#666' }}>Loading menu items...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ padding: '100px 0', background: '#fff' }}>
        <div className="container">
          <div className="text-center">
            <p style={{ color: '#e74c3c' }}>Error loading menu: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
    <section style={{ padding: '100px 0', background: '#fff' }}>
      <div className="container">
        <div className="text-center mb-5">
          <span style={{ color: '#f5a623', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Our Menu Pricing</span>
          <h2 style={{ fontFamily: 'Georgia', fontSize: '3rem', color: '#1a1a2e', display: 'block', marginTop: '10px' }}>Choose Your Meal</h2>
        </div>
        <div className="row g-4">
          {items.map((item, i) => (
            <div key={i} className="col-lg-3 col-md-6">
              <div style={{
                background: '#fff', border: '2px solid #f0f0f0', borderRadius: '12px',
                padding: '30px', transition: 'all 0.3s', height: '100%'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#f5a623'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <h4 style={{ fontSize: '1.1rem', color: '#1a1a2e', marginBottom: '10px', fontWeight: 700 }}>{item.name}</h4>
                <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '15px', lineHeight: 1.6 }}>{item.desc || item.description}</p>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f5a623' }}>
                  Rs {item.price}<span style={{ fontSize: '1rem', color: '#aaa', fontWeight: 400 }}>/plate</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    </>
  )
}
