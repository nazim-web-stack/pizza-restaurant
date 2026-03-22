import React from 'react'

export default function Footer() {
  return (
    <>

    <footer style={{ background: '#111122', padding: '70px 0 0', color: '#888' }}>
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4">
            <span style={{ fontFamily: 'Georgia', fontSize: '1.8rem', color: '#fff', fontWeight: 700, display: 'block', marginBottom: '15px' }}>
              Pizza <span style={{ color: '#f5a623' }}>Delicious</span>
            </span>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              {['fa-twitter', 'fa-facebook-f', 'fa-instagram', 'fa-youtube'].map((icon, i) => (
                <a key={i} href="#" style={{
                  width: '38px', height: '38px', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#888', textDecoration: 'none', transition: 'all 0.3s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f5a623'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#888'; }}
                ><i className={`fab ${icon}`}></i></a>
              ))}
            </div>
          </div>
          <div className="col-lg-2 col-md-4">
            <h5 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '22px', paddingBottom: '12px', borderBottom: '2px solid rgba(255,255,255,0.06)' }}>Services</h5>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {['Cooked', 'Deliver', 'Quality Foods', 'Mixed'].map((s, i) => (
                <li key={i} style={{ marginBottom: '10px' }}>
                  <a href="#" style={{ color: '#888', fontSize: '0.88rem', textDecoration: 'none' }}>{s}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-3 col-md-4">
            <h5 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '22px', paddingBottom: '12px', borderBottom: '2px solid rgba(255,255,255,0.06)' }}>Recent Blog</h5>
            {['Even the all-powerful Pointing has no control about', 'Even the all-powerful Pointing has no control about'].map((t, i) => (
              <div key={i} style={{ marginBottom: '15px' }}>
                <a href="#" style={{ color: '#888', fontSize: '0.88rem', textDecoration: 'none', display: 'block' }}>{t}</a>
                <small style={{ color: '#555' }}>Sept 15, 2018</small>
              </div>
            ))}
          </div>
          <div className="col-lg-3 col-md-4">
            <h5 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '22px', paddingBottom: '12px', borderBottom: '2px solid rgba(255,255,255,0.06)' }}>Have a Questions?</h5>
            {[
              { icon: 'fa-map-marker-alt', text: '203 Fake St. Mountain View, San Francisco, California, USA' },
              { icon: 'fa-phone', text: '+2 392 3929 210' },
              { icon: 'fa-envelope', text: 'info@yourdomain.com' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#888', fontSize: '0.88rem' }}>
                <i className={`fas ${c.icon}`} style={{ color: '#f5a623', marginTop: '3px', flexShrink: 0 }}></i>
                <span>{c.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '50px', padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '0.82rem' }}>
          <p style={{ margin: 0 }}>Copyright © 2026 All rights reserved | Made with ❤️ by <a href="#" style={{ color: '#f5a623' }}>Colorlib</a></p>
        </div>
      </div>
    </footer>
    </>
  )
}
