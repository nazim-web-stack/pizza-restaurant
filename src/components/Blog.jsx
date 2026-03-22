import React from 'react'



export default function Blog({props}) {
  return (
    <>

    <section style={{ padding: '100px 0', background: '#f9f9f9' }}>
      <div className="container">
        <div className="text-center mb-5">
          <span style={{ color: '#f5a623', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Recent from Blog</span>
          <h2 style={{ fontFamily: 'Georgia', fontSize: '3rem', color: '#1a1a2e', display: 'block', marginTop: '10px' }}>Latest News</h2>
        </div>
        <div className="row g-4">
          {props.map((b, i) => (
            <div key={i} className="col-lg-4 col-md-6">
              <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 25px rgba(0,0,0,0.07)', transition: 'transform 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img src={b.img} alt={b.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                <div style={{ padding: '25px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '12px' }}>
                    <i className="fas fa-calendar-alt me-1" style={{ color: '#f5a623' }}></i>{b.date}
                    <i className="fas fa-user ms-3 me-1" style={{ color: '#f5a623' }}></i>Admin
                  </div>
                  <h4 style={{ fontSize: '1.1rem', color: '#1a1a2e', marginBottom: '10px', fontWeight: 700 }}>{b.title}</h4>
                  <p style={{ fontSize: '0.88rem', color: '#888', lineHeight: 1.7, marginBottom: '15px' }}>{b.desc}</p>
                  <a href="#" style={{ color: '#f5a623', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>Read More →</a>
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
