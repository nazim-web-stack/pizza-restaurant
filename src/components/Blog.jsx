import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Blog({ blogs }) {
  const [selectedPost, setSelectedPost] = useState(null);

  const handleReadMore = (post) => {
    setSelectedPost(post);
  };

  const handleBack = () => {
    setSelectedPost(null);
  };

  if (selectedPost) {
    return (
      <section style={{ padding: '100px 0', background: '#f9f9f9' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button 
              onClick={handleBack}
              style={{
                marginBottom: '30px',
                padding: '10px 20px',
                background: '#f5a623',
                color: '#fff',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            >
              ← Back to Blog List
            </button>
            
            <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 5px 25px rgba(0,0,0,0.07)' }}>
              <img src={selectedPost.img} alt={selectedPost.title} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
              <div style={{ padding: '40px' }}>
                <div style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '20px' }}>
                  <i className="fas fa-calendar-alt me-2" style={{ color: '#f5a623' }}></i>{selectedPost.date}
                  <i className="fas fa-user ms-4 me-2" style={{ color: '#f5a623' }}></i>Admin
                </div>
                <h1 style={{ fontSize: '2.5rem', color: '#1a1a2e', marginBottom: '20px', fontWeight: 700, lineHeight: 1.2 }}>
                  {selectedPost.title}
                </h1>
                <div style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.8, marginBottom: '30px' }}>
                  {selectedPost.desc}
                </div>
                <div style={{ fontSize: '1.1rem', color: '#333', lineHeight: 1.8, fontStyle: 'italic' }}>
                  {selectedPost.fullContent}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
    <section style={{ padding: '100px 0', background: '#f9f9f9' }}>
      <div className="container">
        <div className="text-center mb-5">
          <span style={{ color: '#f5a623', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Recent from Blog</span>
          <h2 style={{ fontFamily: 'Georgia', fontSize: '3rem', color: '#1a1a2e', display: 'block', marginTop: '10px' }}>Latest News</h2>
        </div>
        <div className="row g-4">
          {blogs?.map((b) => (
            <div key={b.id} className="col-lg-4 col-md-6">
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
                  <button 
                    onClick={() => handleReadMore(b)}
                    style={{ 
                      color: '#f5a623', 
                      fontSize: '0.85rem', 
                      fontWeight: 700, 
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      padding: 0
                    }}
                  >
                    Read More →
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