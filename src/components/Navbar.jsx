import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({
  links,
  onLoginClick,
  isLoggedIn,
  onLogout,
  userRole
}) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    const navMenu = document.getElementById('navMenu');
    if (navMenu && navMenu.classList.contains('show')) {
      navMenu.classList.remove('show');
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top"
      style={{
        background: scrolled
          ? 'rgba(10,10,30,0.98)'
          : 'rgba(20,20,40,0.95)',
        padding: '18px 0',
        transition: 'all 0.3s',
      }}
    >
      <div className="container">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="navbar-brand fw-bold"
          style={{
            fontFamily: 'Georgia',
            fontSize: '1.6rem',
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          Pizza <span style={{ color: '#f5a623' }}>Delicious</span>
        </Link>

        {/* Mobile hamburger */}
        <button
          className="navbar-toggler border-secondary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-center">
            {links.map((link) => (
              <li className="nav-item" key={link.name}>
                <Link
                  to={link.path}
                  onClick={closeMenu}
                  className="nav-link"
                  style={{
                    color: location.pathname === link.path ? '#f5a623' : 'rgba(255,255,255,0.8)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    borderBottom: location.pathname === link.path ? '2px solid #f5a623' : 'none',
                    paddingBottom: location.pathname === link.path ? '2px' : '0',
                  }}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            <li className="nav-item ms-3">
              {isLoggedIn ? (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {userRole === 'user' && (
                    <Link
                      to="/dashboard"
                      onClick={closeMenu}
                      style={{
                        background: '#f5a623',
                        color: '#fff',
                        padding: '8px 22px',
                        borderRadius: '25px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                      }}
                    >
                      Dashboard
                    </Link>
                  )}

                  {userRole === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={closeMenu}
                      style={{
                        background: '#28a745',
                        color: '#fff',
                        padding: '8px 22px',
                        borderRadius: '25px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                      }}
                    >
                      Admin
                    </Link>
                  )}

                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onLogout();
                      closeMenu();
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                      padding: '8px 22px',
                      borderRadius: '25px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                    }}
                  >
                    Logout
                  </a>
                </div>
              ) : (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onLoginClick();
                    closeMenu();
                  }}
                  style={{
                    background: '#f5a623',
                    color: '#fff',
                    padding: '8px 22px',
                    borderRadius: '25px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                  }}
                >
                  🔐 Login
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}