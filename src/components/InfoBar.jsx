import React from 'react'

export default function InfoBar() {
  return (
    <>
     <div style={{ background: '#1a1a2e', padding: '35px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <div className="row">
          {[
            { icon: 'fa-phone-alt', title: '000 (123) 456 7890', desc: 'A small river named Duden flows' },
            { icon: 'fa-map-marker-alt', title: '198 West 21th Street', desc: 'Suite 721 New York NY 10016' },
            { icon: 'fa-clock', title: 'Open Monday–Friday', desc: '8:00am – 9:00pm' },
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
