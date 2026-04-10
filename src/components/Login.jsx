import { useState, useEffect } from 'react';
import './Login.css';

const LOGIN_API_URL = 'http://localhost:5000/api/auth/login';
const REGISTER_API_URL = 'http://localhost:5000/api/auth/register';

const ACCENT = '#ff6b35';

async function readResponsePayload(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function errorMessageFromPayload(data, res) {
  if (data && typeof data === 'object') {
    if (typeof data.message === 'string' && data.message) return data.message;
    if (typeof data.error === 'string' && data.error) return data.error;
    if (data.errors && typeof data.errors === 'object') {
      const first = Object.values(data.errors)[0];
      if (typeof first === 'string') return first;
      if (first && typeof first.message === 'string') return first.message;
    }
  }
  return res.statusText || `Request failed (${res.status})`;
}

function networkErrorMessage(err) {
  if (err instanceof TypeError) {
    const msg = String(err.message || '');
    if (msg === 'Failed to fetch' || msg.includes('NetworkError') || msg.toLowerCase().includes('fetch')) {
      return (
        `Failed to fetch ${LOGIN_API_URL}. Start the API (cd server && npm start), ensure MongoDB is running ` +
        '(the server only listens after DB connects), and use the app from http://localhost:3000 or http://127.0.0.1:3000 (both are allowed by CORS).'
      );
    }
  }
  return err instanceof Error ? err.message : 'Request failed';
}

function Field({ children }) {
  return <div className="login-input-group">{children}</div>;
}

function IconCell({ children }) {
  return <span className="login-input-icon" aria-hidden>{children}</span>;
}

export default function Login({ onClose, onLoginSuccess, onOpenLogin }) {
  const [activePage, setActivePage] = useState('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    onOpenLogin?.();
    // Clear all form fields when modal opens
    setLoginForm({ username: '', password: '' });
    setSignupForm({ name: '', email: '', phone: '', password: '', confirm: '' });
    setForgotEmail('');
  }, [onOpenLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setApiError('');
    try {
      const res = await fetch(LOGIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.username.trim(),
          password: loginForm.password,
        }),
      });
      const data = await readResponsePayload(res);
      if (!res.ok) {
        setApiError(errorMessageFromPayload(data, res));
        return;
      }

      if (!data.token || !data.customer || typeof data.customer !== 'object') {
        setApiError('Invalid login response from server (missing token or customer).');
        return;
      }

      const { customer } = data;
      console.log('Login response data:', data); // Debug log to verify createdAt
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userCreatedAt', data.createdAt);
      localStorage.setItem('customerId', data.customer?.id || '');

      // Clear all form fields after successful login
      setLoginForm({ username: '', password: '' });
      setSignupForm({ name: '', email: '', phone: '', password: '', confirm: '' });
      setForgotEmail('');

      onLoginSuccess(customer.role);

      if (customer.role === 'admin') {
        window.location.href = '/admin';
      } else if (customer.role === 'user') {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setApiError(networkErrorMessage(err));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setApiError('');
    if (signupForm.password !== signupForm.confirm) {
      setApiError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch(REGISTER_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupForm.name.trim(),
          email: signupForm.email.trim(),
          phone: signupForm.phone.trim(),
          password: signupForm.password,
        }),
      });
      const data = await readResponsePayload(res);
      if (!res.ok) {
        setApiError(errorMessageFromPayload(data, res));
        return;
      }

      if (!data.token || !data.customer || typeof data.customer !== 'object') {
        setApiError('Invalid sign-up response from server (missing token or customer).');
        return;
      }

      const { customer } = data;
      console.log('Register response data:', data); // Debug log to verify createdAt
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('userCreatedAt', data.createdAt);
      localStorage.setItem('customerId', data.customer?.id || '');

      // Clear all form fields after successful register
      setLoginForm({ username: '', password: '' });
      setSignupForm({ name: '', email: '', phone: '', password: '', confirm: '' });
      setForgotEmail('');

      onLoginSuccess(customer.role);

      if (customer.role === 'admin') {
        window.location.href = '/admin';
      } else if (customer.role === 'user') {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setApiError(networkErrorMessage(err));
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    setSuccess('✅ Reset link sent to your email!');
    setTimeout(() => {
      setSuccess('');
      setActivePage('login');
    }, 2000);
  };

  const handleSocial = (provider) => {
    alert(`${provider} sign-in — Coming soon! We’re baking the integration. 🍕`);
  };

  const labelStyle = {
    color: 'rgba(248, 250, 252, 0.55)',
    fontSize: '0.78rem',
    fontWeight: 600,
    marginBottom: '6px',
    display: 'block',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  };

  const linkStyle = {
    color: ACCENT,
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600,
    transition: 'opacity 0.2s ease',
  };

  const socialBlock = (
    <>
      <div className="login-divider">Or continue with</div>
      <div className="login-social-row">
        <button type="button" className="login-social login-social--google" onClick={() => handleSocial('Google')}>
          <i className="bi bi-google" style={{ fontSize: '1.1rem' }} />
          Continue with Google
        </button>
        <button type="button" className="login-social login-social--facebook" onClick={() => handleSocial('Facebook')}>
          <i className="bi bi-facebook" style={{ fontSize: '1.1rem', color: '#1877f2' }} />
          Continue with Facebook
        </button>
      </div>
    </>
  );

  return (
    <div className="login-overlay" onClick={(e) => e.target === e.currentTarget && onClose()} role="presentation">
      <div className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
        <div className="login-modal-glow" aria-hidden />
        <button type="button" className="login-close" onClick={onClose} aria-label="Close">
          <i className="bi bi-x-lg" style={{ fontSize: '0.95rem' }} />
        </button>

        <div style={{ position: 'relative', zIndex: 1, padding: '2rem 1.85rem 1.75rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div
              style={{
                fontSize: '2.75rem',
                lineHeight: 1,
                marginBottom: '0.35rem',
                filter: 'drop-shadow(0 4px 12px rgba(255, 107, 53, 0.35))',
              }}
              aria-hidden
            >
              🍕
            </div>
            <h1
              id="login-modal-title"
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#f8fafc',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Pizza <span style={{ color: ACCENT }}>Delicious</span>
            </h1>
            <p
              style={{
                margin: '0.35rem 0 0',
                fontSize: '0.875rem',
                color: 'rgba(248, 250, 252, 0.45)',
                fontWeight: 500,
              }}
            >
              {activePage === 'login' && 'Welcome back — sign in for hot deals'}
              {activePage === 'signup' && 'Create your account — join the family'}
              {activePage === 'forgot' && 'We’ll help you get back in'}
            </p>
          </div>

          {apiError && <div className="login-alert login-alert--error">{apiError}</div>}
          {success && <div className="login-alert login-alert--success">{success}</div>}

          {activePage === 'login' && (
            <>
              <form onSubmit={handleLogin}>
                <label style={labelStyle}>Email</label>
                <Field>
                  <IconCell>
                    <i className="bi bi-envelope" />
                  </IconCell>
                  <input
                    className="login-input"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    type="email"
                    autoComplete="username"
                    placeholder="you@example.com"
                    required
                  />
                </Field>

                <label style={{ ...labelStyle, marginTop: '14px' }}>Password</label>
                <Field>
                  <IconCell>
                    <i className="bi bi-lock" />
                  </IconCell>
                  <input
                    type="password"
                    className="login-input"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    required
                  />
                </Field>

                <button type="submit" className="login-btn-primary">
                  Sign in
                </button>
              </form>

              {socialBlock}

              <p style={{ textAlign: 'right', marginTop: '1.1rem', marginBottom: 0 }}>
                <span
                  role="button"
                  tabIndex={0}
                  style={linkStyle}
                  onClick={() => {
                    setApiError('');
                    setActivePage('forgot');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setApiError('');
                      setActivePage('forgot');
                    }
                  }}
                >
                  Forgot password?
                </span>
              </p>

              <p style={{ textAlign: 'center', marginTop: '1rem', marginBottom: 0, color: 'rgba(248,250,252,0.5)', fontSize: '0.875rem' }}>
                New here?{' '}
                <span
                  role="button"
                  tabIndex={0}
                  style={linkStyle}
                  onClick={() => {
                    setApiError('');
                    setActivePage('signup');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && (setApiError(''), setActivePage('signup'))}
                >
                  Create an account
                </span>
              </p>
            </>
          )}

          {activePage === 'signup' && (
            <>
              <form onSubmit={handleSignup}>
                <label style={labelStyle}>Name</label>
                <Field>
                  <IconCell>
                    <i className="bi bi-person" />
                  </IconCell>
                  <input
                    placeholder="Your name"
                    className="login-input"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    required
                  />
                </Field>

                <label style={{ ...labelStyle, marginTop: '10px' }}>Email</label>
                <Field>
                  <IconCell>
                    <i className="bi bi-envelope" />
                  </IconCell>
                  <input
                    placeholder="you@example.com"
                    type="email"
                    className="login-input"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                  />
                </Field>

                <label style={{ ...labelStyle, marginTop: '10px' }}>Phone</label>
                <Field>
                  <IconCell>
                    <i className="bi bi-telephone" />
                  </IconCell>
                  <input
                    placeholder="+1 (555) 123-4567"
                    type="tel"
                    className="login-input"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                  />
                </Field>

                <label style={{ ...labelStyle, marginTop: '10px' }}>Password</label>
                <Field>
                  <IconCell>
                    <i className="bi bi-lock" />
                  </IconCell>
                  <input
                    type="password"
                    placeholder="Password"
                    className="login-input"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                  />
                </Field>

                <label style={{ ...labelStyle, marginTop: '10px' }}>Confirm</label>
                <Field>
                  <IconCell>
                    <i className="bi bi-shield-lock" />
                  </IconCell>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="login-input"
                    value={signupForm.confirm}
                    onChange={(e) => setSignupForm({ ...signupForm, confirm: e.target.value })}
                    required
                  />
                </Field>

                <button type="submit" className="login-btn-primary">
                  Create account
                </button>
              </form>

              {socialBlock}

              <p style={{ textAlign: 'center', marginTop: '1.1rem', marginBottom: 0, color: 'rgba(248,250,252,0.5)', fontSize: '0.875rem' }}>
                Already have an account?{' '}
                <span
                  role="button"
                  tabIndex={0}
                  style={linkStyle}
                  onClick={() => {
                    setApiError('');
                    setActivePage('login');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setApiError('');
                      setActivePage('login');
                    }
                  }}
                >
                  Sign in
                </span>
              </p>
            </>
          )}

          {activePage === 'forgot' && (
            <>
              <form onSubmit={handleForgot}>
                <label style={labelStyle}>Email</label>
                <Field>
                  <IconCell>
                    <i className="bi bi-envelope" />
                  </IconCell>
                  <input
                    placeholder="Enter your email"
                    className="login-input"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </Field>
                <button type="submit" className="login-btn-primary">
                  Send reset link
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '1.25rem', marginBottom: 0 }}>
                <span
                  role="button"
                  tabIndex={0}
                  style={linkStyle}
                  onClick={() => {
                    setApiError('');
                    setActivePage('login');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setApiError('');
                      setActivePage('login');
                    }
                  }}
                >
                  ← Back to sign in
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
