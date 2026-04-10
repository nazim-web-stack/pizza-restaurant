import React from 'react'

export default function InfoBar() {
  return (
    <>
     <div style={{ background: '#1a1a2e', padding: '35px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <div className="row">
          {[
            { icon: 'fa-phone-alt', title: '+92 319 8634894', desc: 'Call us for reservations' },
            { icon: 'fa-map-marker-alt', title: '94/9-L Sahiwal, Stoke-on-Trent, UK', desc: 'Visit our restaurant' },
            { icon: 'fa-clock', title: 'Open Daily', desc: '11:00am - 11:00pm' },
          ].map((item, i) => (
            <div key={i} className="col-md-4 text-center" style={{ padding: '10px' }}>
              <i className={`fas ${item.icon}`} style={{ fontSize: '2rem', color: '#f5a623', marginBottom: '12px', display: 'block' }}></i>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontFamily: 'sans-serif', fontWeight: 700, marginBottom: '5px' }}>{item.title}</h4>
              <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}
