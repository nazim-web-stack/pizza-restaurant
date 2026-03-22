import React from 'react'

export default function Pricing({items}) {
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
                <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '15px', lineHeight: 1.6 }}>{item.desc}</p>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f5a623' }}>
                  {item.price}<span style={{ fontSize: '1rem', color: '#aaa', fontWeight: 400 }}>/plate</span>
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
