import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSlider({slides}) {
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <div id="heroSlider" className="carousel slide" data-bs-ride="carousel" data-bs-interval="4000">
        <div className="carousel-inner">

          {/* Slide 1 */}
          <div className="carousel-item active" style={{
            minHeight: '100vh',
            background: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url('/images/bg_1.jpg') center/cover`,
            display: 'flex', alignItems: 'center'
          }}>
            <div className="container" style={{ paddingTop: '100px' }}>
              <div className="row"><div className="col-lg-7">
                <span style={{ color: '#f5a623', fontSize: '0.85rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Delicious</span>
                <h1 style={{ fontSize: 'clamp(3rem,7vw,6rem)', color: '#fff', fontFamily: 'Georgia', fontWeight: 900, lineHeight: 1.1, margin: '15px 0 20px' }}>Italian<br/>Cuizine</h1>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', maxWidth: '500px', lineHeight: 1.8, marginBottom: '35px' }}>
                  Fresh, hot & delicious food delivered to your door. Order now and taste the difference!
                </p>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Order Now button clicked - attempting navigation');
                    window.location.href = '/order';
                  }}
                  style={{ background: '#f5a623', color: '#fff', padding: '14px 35px', borderRadius: '30px', fontWeight: 700, marginRight: '12px', textDecoration: 'none', border: 'none', cursor: 'pointer', zIndex: 10, position: 'relative' }}
                >
                  Order Now
                </button>
                <button 
                  onClick={() => navigate('/menu')}
                  style={{ border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '12px 30px', borderRadius: '30px', fontWeight: 700, textDecoration: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  View Menu
                </button>
              </div></div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="carousel-item" style={{
            minHeight: '100vh',
            background: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url('/images/bg_2.jpg') center/cover`,
            display: 'flex', alignItems: 'center'
          }}>
            <div className="container" style={{ paddingTop: '100px' }}>
              <div className="row"><div className="col-lg-7">
                <span style={{ color: '#f5a623', fontSize: '0.85rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Crunchy</span>
                <h1 style={{ fontSize: 'clamp(3rem,7vw,6rem)', color: '#fff', fontFamily: 'Georgia', fontWeight: 900, lineHeight: 1.1, margin: '15px 0 20px' }}>Italian<br/>Pizza</h1>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', maxWidth: '500px', lineHeight: 1.8, marginBottom: '35px' }}>
                  Fresh, hot & delicious food delivered to your door. Order now and taste the difference!
                </p>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Order Now button clicked - attempting navigation');
                    window.location.href = '/order';
                  }}
                  style={{ background: '#f5a623', color: '#fff', padding: '14px 35px', borderRadius: '30px', fontWeight: 700, marginRight: '12px', textDecoration: 'none', border: 'none', cursor: 'pointer', zIndex: 10, position: 'relative' }}
                >
                  Order Now
                </button>
                <button 
                  onClick={() => navigate('/menu')}
                  style={{ border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '12px 30px', borderRadius: '30px', fontWeight: 700, textDecoration: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  View Menu
                </button>
              </div></div>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="carousel-item" style={{
            minHeight: '100vh',
            background: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url('/images/bg_3.jpg') center/cover`,
            display: 'flex', alignItems: 'center'
          }}>
            <div className="container" style={{ paddingTop: '100px' }}>
              <div className="row"><div className="col-lg-7">
                <span style={{ color: '#f5a623', fontSize: '0.85rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Welcome</span>
                <h1 style={{ fontSize: 'clamp(3rem,7vw,6rem)', color: '#fff', fontFamily: 'Georgia', fontWeight: 900, lineHeight: 1.1, margin: '15px 0 20px' }}>Best Pizza<br/>Recipe</h1>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', maxWidth: '500px', lineHeight: 1.8, marginBottom: '35px' }}>
                  Fresh, hot & delicious food delivered to your door. Order now and taste the difference!
                </p>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Order Now button clicked - attempting navigation');
                    window.location.href = '/order';
                  }}
                  style={{ background: '#f5a623', color: '#fff', padding: '14px 35px', borderRadius: '30px', fontWeight: 700, marginRight: '12px', textDecoration: 'none', border: 'none', cursor: 'pointer', zIndex: 10, position: 'relative' }}
                >
                  Order Now
                </button>
                <button 
                  onClick={() => navigate('/menu')}
                  style={{ border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '12px 30px', borderRadius: '30px', fontWeight: 700, textDecoration: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  View Menu
                </button>
              </div></div>
            </div>
          </div>

        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#heroSlider" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroSlider" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </>
  )
}