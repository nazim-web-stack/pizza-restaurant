import React from 'react'

export default function Services({services}) {
  return (
    
    <>
     <section style={{ padding: '100px 0', background: '#f9f9f9' }}>
      <div className="container">
        <div className="text-center mb-5">
          <span style={{ color: '#f5a623', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Our Services</span>
          <h2 style={{ fontFamily: 'Georgia', fontSize: '3rem', color: '#1a1a2e', display: 'block', marginTop: '10px' }}>What We Offer</h2>
        </div>
        <div className="row g-4">
          {services.map((s, i) => (
            <div key={i} className="col-lg-4 col-md-6">
              <div style={{
                textAlign: 'center', padding: '45px 30px', background: '#fff',
                borderRadius: '12px', boxShadow: '0 5px 25px rgba(0,0,0,0.06)',
                transition: 'transform 0.3s', height: '100%'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  width: '80px', height: '80px',
                  background: 'linear-gradient(135deg,#f5a623,#f0c040)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 22px', fontSize: '2rem'
                }}>{s.icon}</div>
                <h4 style={{ fontSize: '1.2rem', color: '#1a1a2e', marginBottom: '12px', fontWeight: 700 }}>{s.title}</h4>
                <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.8 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  )
}
