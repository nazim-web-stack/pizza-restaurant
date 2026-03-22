import React from 'react'
import { useState } from 'react';


export default function Menu({menuData}) {
    const [activeTab, setActiveTab] = useState('pizza');
  return (
    <>
     <section style={{ padding: '100px 0', background: '#111122' }}>
      <div className="container">
        <div className="text-center mb-5">
          <span style={{ color: '#f5a623', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Hot Meals</span>
          <h2 style={{ color: '#fff', fontFamily: 'Georgia', fontSize: '3rem', display: 'block', marginTop: '10px' }}>Our Menu</h2>
        </div>

        {/* Tabs */}
        <div className="d-flex justify-content-center gap-2 flex-wrap mb-5">
          {Object.keys(menuData).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 28px', borderRadius: '25px', border: '1px solid',
              borderColor: activeTab === tab ? '#f5a623' : 'rgba(255,255,255,0.1)',
              background: activeTab === tab ? '#f5a623' : 'rgba(255,255,255,0.05)',
              color: activeTab === tab ? '#fff' : '#aaa',
              fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase',
              fontSize: '0.85rem', letterSpacing: '1px', transition: 'all 0.3s'
            }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Items */}
        <div className="row g-4">
          {menuData[activeTab].map((item, i) => (
            <div key={i} className="col-lg-4 col-md-6">
              <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <img src={item.img} alt={item.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '18px 20px' }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h4 style={{ color: '#fff', fontSize: '1rem', margin: 0, fontWeight: 700 }}>{item.name}</h4>
                    <span style={{ color: '#f5a623', fontWeight: 800, fontSize: '1.1rem' }}>{item.price}</span>
                  </div>
                  <p style={{ color: '#888', fontSize: '0.82rem', margin: '0 0 15px' }}>{item.desc}</p>
                  <button style={{ background: '#f5a623', color: '#fff', border: 'none', padding: '8px 22px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
                    Add to Order
                  </button>
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
