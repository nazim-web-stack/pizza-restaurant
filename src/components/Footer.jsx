import React from 'react'

export default function Footer() {

  const socialLinks = [
    { icon: 'fa-twitter', link: 'https://twitter.com' },
    { icon: 'fa-facebook-f', link: 'https://facebook.com' },
    { icon: 'fa-instagram', link: 'https://instagram.com' },
    { icon: 'fa-youtube', link: 'https://youtube.com' }
  ];

  return (
    <>
    <footer style={{ background: '#111122', padding: '70px 0 0', color: '#888' }}>
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4">
            <span style={{ fontFamily: 'Georgia', fontSize: '1.8rem', color: '#fff', fontWeight: 700, display: 'block', marginBottom: '15px' }}>
              Pizza <span style={{ color: '#f5a623' }}>Delicious</span>
            </span>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.8 }}>
              Authentic Pakistani & Italian cuisine served fresh daily. Order online or visit us in Stoke-on-Trent, UK.
            </p>

            {/*working  SOCIAL ICONS */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '38px',
                    height: '38px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#888',
                    textDecoration: 'none',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#f5a623';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#888';
                  }}
                >
                  <i className={`fab ${item.icon}`}></i>
                </a>
              ))}
            </div>

          </div>
          <div className="col-lg-2 col-md-4">
            <h5 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '22px', paddingBottom: '12px', borderBottom: '2px solid rgba(255,255,255,0.06)' }}>Services</h5>
           <ul style={{ listStyle: 'none', padding: 0 }}>
  {[
    { name: 'Healthy Foods', link: '/services' },
    { name: 'Fastest Delivery', link: '/services' },
    { name: 'Original Recipes', link: 'services' }
  ].map((s, i) => (
    <li key={i} style={{ marginBottom: '10px' }}>
      <a 
        href={s.link} 
        style={{ color: '#888', fontSize: '0.88rem', textDecoration: 'none' }}
      >
        {s.name}
      </a>
    </li>
  ))}
</ul>
          </div>

          {/* Baaki code same  */}
           <div className="col-lg-3 col-md-4">
            <h5 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '22px', paddingBottom: '12px', borderBottom: '2px solid rgba(255,255,255,0.06)' }}>Recent Blog</h5>
            {[
  { text: 'Introducing Our New Spicy Chicken Pizza', link: '#' },
  { text: 'Weekend Special: Buy 1 Get 1 Free', link: '#' }
].map((t, i) => (
  <div key={i} style={{ marginBottom: '15px' }}>
    <a 
      href={t.link}
      style={{ color: '#888', fontSize: '0.88rem', textDecoration: 'none', display: 'block' }}
    >
      {t.text}
    </a>
    <small style={{ color: '#555' }}>March 2026</small>
  </div>
))}
          </div>
          <div className="col-lg-3 col-md-4">
            <h5 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '22px', paddingBottom: '12px', borderBottom: '2px solid rgba(255,255,255,0.06)' }}>Have a Questions?</h5>
          {[
  { 
    icon: 'fa-map-marker-alt', 
    text: '94/9-L Sahiwal, Pakistan', 
    link: 'https://www.google.com/maps?q=94/9-L+Sahiwal+Pakistan',
    isLocation: true
  },
  { 
    icon: 'fa-phone', 
    text: '+2 3198634894', 
    link: 'tel:+23198634894' 
  },
  { 
    icon: 'fa-envelope', 
    text: 'info@pizzadelicious.com', 
    link: 'mailto:info@yourdomain.com' 
  },
].map((c, i) => (
  <a 
    key={i}
    href={c.link}
    target="_blank"
    rel="noopener noreferrer"
    style={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: '12px', 
      padding: '10px 12px', 
      marginBottom: '8px',
      borderRadius: '8px',
      background: c.isLocation ? 'rgba(245,166,35,0.1)' : 'transparent',
      border: c.isLocation ? '1px solid rgba(245,166,35,0.4)' : 'none',
      color: '#888', 
      fontSize: '0.88rem',
      textDecoration: 'none',
      transition: '0.3s'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = '#f5a623';
      e.currentTarget.style.color = '#fff';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = c.isLocation ? 'rgba(245,166,35,0.1)' : 'transparent';
      e.currentTarget.style.color = '#888';
    }}
  >
    <i className={`fas ${c.icon}`} style={{ color: '#f5a623' }}></i>
    
    <span style={{ flex: 1 }}>{c.text}</span>

    {/* 🔥 SMALL BUTTON */}
    {c.isLocation && (
      <span style={{
        fontSize: '0.75rem',
        padding: '4px 8px',
        borderRadius: '12px',
        background: '#f5a623',
        color: '#fff',
        fontWeight: '600'
      }}>
        View Map
      </span>
    )}
  </a>
))}
          </div>
        </div>
        <div style={{ marginTop: '50px', padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '0.82rem' }}>
          <p style={{ margin: 0 }}>Copyright © 2026 Pizza Delicious. All rights reserved.</p>
          
        </div>
      </div>
    </footer>
    </>
  )
}