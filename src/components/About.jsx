import React from 'react'

export default function About() {
  const scrollToMenu = () => {
    const menuElement = document.getElementById('menu');
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If menu element not found, navigate to menu page
      window.location.href = '/menu';
    }
  };

  return (
    <>
     <section style={{ padding: '100px 0', background: '#fff' }}>
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <img src="/images/about.jpg" alt="About Us"
              style={{ width: '100%', borderRadius: '10px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
          </div>
          <div className="col-lg-6">
            <span style={{ color: '#f5a623', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Welcome</span>
            <h2 style={{ fontFamily: 'Georgia', fontSize: '2.5rem', color: '#1a1a2e', margin: '12px 0 25px' }}>
              Authentic Pakistani & Italian Cuisine
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#777', marginBottom: '18px' }}>
              Pak Fried Food is a family restaurant located in Stoke-on-Trent, UK. We serve authentic Pakistani and Italian cuisine made with the freshest ingredients.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#777', marginBottom: '25px' }}>
              From crispy fried chicken to wood-fired pizzas, our menu offers something for everyone. Visit us today and experience the taste of tradition.
            </p>
            <button 
              onClick={scrollToMenu}
              style={{ 
                background: '#f5a623', 
                color: '#fff', 
                padding: '13px 35px', 
                borderRadius: '30px', 
                fontWeight: 700, 
                textDecoration: 'none', 
                display: 'inline-block',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              View Our Menu
            </button>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
