import { useState, useEffect } from 'react';



export default function Navbar({links}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e, path) => {
    e.preventDefault();
     const navMenu = document.getElementById('navMenu');
    if (navMenu.classList.contains('show')) {
      navMenu.classList.remove('show');
    } 
    if (path === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const section = document.getElementById(path);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top"
      style={{
        background: scrolled ? 'rgba(10,10,30,0.98)' : 'rgba(20,20,40,0.95)',
        padding: '18px 0',
        transition: 'all 0.3s',
      }}
    >
      <div className="container">

        <a
          className="navbar-brand fw-bold"
          href="/"
          style={{ fontFamily: 'Georgia', fontSize: '1.6rem', color: '#fff', textDecoration: 'none' }}
        >
          Pizza <span style={{ color: '#f5a623' }}>Delicious</span>
        </a>

        <button
          className="navbar-toggler border-secondary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-center">

            {links.map(link => (
              <li className="nav-item" key={link.name}>
                <a
                  href={`#${link.path}`}
                  className="nav-link"
                  onClick={(e) => handleClick(e, link.path)}
                  style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  {link.name}
                </a>
              </li>
            ))}

            <li className="nav-item ms-3">
              <a
                href="/login"
                style={{
                  background: '#f5a623',
                  color: '#fff',
                  padding: '8px 22px',
                  borderRadius: '25px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                🔐 Login
              </a>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}