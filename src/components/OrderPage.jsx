import { useState, useEffect } from 'react';

// Add spinner animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function normalizeItem(raw) {
  const id = raw._id != null ? String(raw._id) : String(raw.id ?? '');
  const img = raw.img || raw.image || '/images/pizza-1.jpg';
  const price = typeof raw.price === 'number' ? raw.price : Number(raw.price) || 0;
  const category = raw.category || 'Other';
  return { ...raw, id, name: raw.name || 'Item', img, price, category };
}

function categoryLabel(c) {
  if (!c || typeof c !== 'object') return '';
  return c.name || c.title || c.label || c.category || '';
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
  padding: '10px 14px',
  color: '#fff',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
  outline: 'none',
};

export default function OrderPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState(null);

  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [menuRes, catRes] = await Promise.all([
          fetch(`${API}/api/menu`),
          fetch(`${API}/api/menu/categories`),
        ]);
        if (!menuRes.ok) throw new Error('Menu failed');
        const rawItems = await menuRes.json();
        const rawCats = catRes.ok ? await catRes.json() : [];
        if (cancelled) return;
        const normalized = Array.isArray(rawItems) ? rawItems.map(normalizeItem) : [];
        setMenuItems(normalized);

        const catNames = Array.isArray(rawCats)
          ? rawCats.map(categoryLabel).filter(Boolean)
          : [];
        const uniqueFromItems = [...new Set(normalized.map((i) => i.category).filter(Boolean))];
        const tabs = ['All', ...(catNames.length ? catNames : uniqueFromItems)];
        setCategories(tabs);
        setMenuError(null);
      } catch {
        if (!cancelled) {
          setMenuError('Failed to load menu - please check server (port 5000).');
          setMenuItems([]);
        }
      } finally {
        if (!cancelled) setMenuLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => String(i.id) === String(item.id));
      if (existing) {
        return prev.map((i) =>
          String(i.id) === String(item.id) ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const existing = prev.find((i) => String(i.id) === String(id));
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((i) => String(i.id) !== String(id));
      return prev.map((i) =>
        String(i.id) === String(id) ? { ...i, qty: i.qty - 1 } : i
      );
    });
  };

  const getQty = (id) => cart.find((i) => String(i.id) === String(id))?.qty || 0;
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const filteredItems =
    activeCategory === 'All'
      ? menuItems
      : menuItems.filter((i) => i.category === activeCategory);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.address.trim()) e.address = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Please add items to cart first!');
      return;
    }
    if (!validate()) return;

    const customerId = localStorage.getItem('customerId');
    const payload = {
      customerId: customerId && customerId !== 'admin' ? customerId : undefined,
      items: cart.map((i) => ({
        menuItemId: i.id,
        name: i.name,
        qty: i.qty,
        price: i.price,
      })),
      customerName: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      specialNote: form.note.trim(),
      totalAmount: totalPrice,
    };

    setOrderSubmitting(true);
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.message || 'Failed to save order.');
        return;
      }
      if (data.success) {
        console.log('Order placed successfully:', data.orderId);
        setStep(3);
      } else {
        alert(data.message || 'Failed to save order.');
      }
    } catch {
      alert('Network error — is the backend running? (npm start in /server)');
    } finally {
      setOrderSubmitting(false);
    }
  };

  const pageStyle = {
    minHeight: '100vh',
    background: '#0d0d0d',
    paddingTop: '90px',
    fontFamily: "'Nunito', sans-serif",
    color: '#fff',
  };

  if (step === 3) {
    return (
      <div style={pageStyle}>
        <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🍕</div>
          <h2
            style={{
              fontFamily: 'Georgia',
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#f5a623',
              marginBottom: '16px',
            }}
          >
            Order Placed!
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', marginBottom: '30px' }}>
            Thank you <strong style={{ color: '#fff' }}>{form.name || 'Customer'}</strong>! Your order is being prepared. 🎉
          </p>

          <div
            style={{
              background: 'rgba(245,166,35,0.08)',
              border: '1px solid rgba(245,166,35,0.25)',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '30px',
              textAlign: 'left',
            }}
          >
            <p style={{ color: '#f5a623', fontWeight: 700, marginBottom: '12px', fontSize: '0.95rem' }}>
              Order Summary:
            </p>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.88rem',
                  marginBottom: '8px',
                }}
              >
                <span>
                  {item.name} x{item.qty}
                </span>
                <span>Rs {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                marginTop: '12px',
                paddingTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
              }}
            >
              <span>Total</span>
              <span style={{ color: '#f5a623' }}>Rs {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setCart([]);
              setStep(1);
              setForm({ name: '', phone: '', address: '', note: '' });
              setErrors({});
            }}
            style={{
              padding: '12px 32px',
              background: '#f5a623',
              border: 'none',
              borderRadius: '30px',
              color: '#000',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div style={pageStyle}>
        <div style={{ maxWidth: '620px', margin: '0 auto', padding: '40px 20px 60px' }}>
          <button
            type="button"
            onClick={() => setStep(1)}
            style={{
              background: 'none',
              border: 'none',
              color: '#f5a623',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 700,
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            ← Back to Menu
          </button>

          <h2 style={{ fontFamily: 'Georgia', fontSize: '2rem', fontWeight: 900, marginBottom: '24px' }}>
            Checkout 🛒
          </h2>

          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '18px',
              marginBottom: '28px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p style={{ color: '#f5a623', fontWeight: 700, marginBottom: '12px' }}>Your Order:</p>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                }}
              >
                <span>
                  {item.name} x{item.qty}
                </span>
                <span>Rs {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                marginTop: '10px',
                paddingTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: '1.05rem',
              }}
            >
              <span>Total</span>
              <span style={{ color: '#f5a623' }}>Rs {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.85rem',
                  marginBottom: '6px',
                }}
              >
                Full Name *
              </label>
              <input
                style={{
                  ...inputStyle,
                  borderColor: errors.name ? '#e74c3c' : 'rgba(255,255,255,0.12)',
                }}
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  setErrors((prev) => ({ ...prev, name: '' }));
                }}
              />
              {errors.name && (
                <p style={{ color: '#e74c3c', fontSize: '0.78rem', marginTop: '4px' }}>{errors.name}</p>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.85rem',
                  marginBottom: '6px',
                }}
              >
                Phone Number *
              </label>
              <input
                style={{
                  ...inputStyle,
                  borderColor: errors.phone ? '#e74c3c' : 'rgba(255,255,255,0.12)',
                }}
                type="tel"
                placeholder="Your phone number"
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  setErrors((prev) => ({ ...prev, phone: '' }));
                }}
              />
              {errors.phone && (
                <p style={{ color: '#e74c3c', fontSize: '0.78rem', marginTop: '4px' }}>{errors.phone}</p>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.85rem',
                  marginBottom: '6px',
                }}
              >
                Delivery Address *
              </label>
              <input
                style={{
                  ...inputStyle,
                  borderColor: errors.address ? '#e74c3c' : 'rgba(255,255,255,0.12)',
                }}
                type="text"
                placeholder="Enter delivery address"
                value={form.address}
                onChange={(e) => {
                  setForm({ ...form, address: e.target.value });
                  setErrors((prev) => ({ ...prev, address: '' }));
                }}
              />
              {errors.address && (
                <p style={{ color: '#e74c3c', fontSize: '0.78rem', marginTop: '4px' }}>{errors.address}</p>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.85rem',
                  marginBottom: '6px',
                }}
              >
                Special Note (Optional)
              </label>
              <textarea
                style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                placeholder="Any special instructions? (e.g. extra cheese, less spicy)"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>

            <button
              type="button"
              disabled={orderSubmitting}
              onClick={handlePlaceOrder}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #f5a623, #e8941a)',
                border: 'none',
                borderRadius: '12px',
                color: '#000',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: orderSubmitting ? 'wait' : 'pointer',
                opacity: orderSubmitting ? 0.85 : 1,
                boxShadow: '0 6px 20px rgba(245,166,35,0.3)',
                letterSpacing: '0.3px',
              }}
            >
              {orderSubmitting ? 'Saving…' : `Place Order — Rs ${totalPrice.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={{ textAlign: 'center', padding: '40px 20px 20px' }}>
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            fontFamily: 'Georgia, serif',
            color: '#fff',
            margin: 0,
          }}
        >
          Place Your <span style={{ color: '#f5a623' }}>Order</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', marginTop: '8px' }}>
          Fresh, hot & delivered to your door 🍕
        </p>
      </div>

      {menuError && (
        <p style={{ textAlign: 'center', color: '#e74c3c', padding: '0 20px' }}>{menuError}</p>
      )}
      {menuLoading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(255,255,255,0.1)',
              borderTop: '4px solid #f5a623',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}
          ></div>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading menu…</p>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          padding: '20px',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 22px',
              borderRadius: '25px',
              border: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.2)',
              background: activeCategory === cat ? '#f5a623' : 'transparent',
              color: activeCategory === cat ? '#000' : 'rgba(255,255,255,0.7)',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px 60px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {!menuLoading && filteredItems.length === 0 && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'rgba(255,255,255,0.45)' }}>
              No items found — please check menuItems collection in database.
            </p>
          )}
          {filteredItems.map((item) => {
            const qty = getQty(item.id);
            return (
              <div
                key={item.id}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: `1px solid ${qty > 0 ? 'rgba(245,166,35,0.45)' : 'rgba(255,255,255,0.08)'}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {qty > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#f5a623',
                      color: '#000',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '20px',
                      zIndex: 1,
                    }}
                  >
                    {qty} in cart
                  </div>
                )}

                <img
                  src={item.img}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    background: '#1a1a1a',
                    display: 'block',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />

                <div style={{ padding: '14px' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px', margin: '0 0 4px' }}>
                    {item.name}
                  </p>
                  <p style={{ color: '#f5a623', fontWeight: 800, fontSize: '1rem', margin: '0 0 12px' }}>
                    Rs {item.price.toLocaleString()}
                  </p>

                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      style={{
                        padding: '7px 18px',
                        background: '#f5a623',
                        border: 'none',
                        borderRadius: '20px',
                        color: '#000',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        width: '100%',
                      }}
                    >
                      + Add
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          border: 'none',
                          background: 'rgba(255,255,255,0.1)',
                          color: '#fff',
                          fontWeight: 900,
                          cursor: 'pointer',
                          fontSize: '1.1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        −
                      </button>
                      <span style={{ fontWeight: 700, flex: 1, textAlign: 'center', fontSize: '0.95rem' }}>
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          border: 'none',
                          background: '#f5a623',
                          color: '#000',
                          fontWeight: 900,
                          cursor: 'pointer',
                          fontSize: '1.1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '20px',
            position: 'sticky',
            top: '100px',
            maxHeight: '80vh',
            overflowY: 'auto',
            alignSelf: 'start',
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: '1.15rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🛒 Cart
            {totalItems > 0 && (
              <span
                style={{
                  background: '#f5a623',
                  color: '#000',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 900,
                }}
              >
                {totalItems}
              </span>
            )}
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '30px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🍽️</div>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>Your cart is empty</p>
              <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>Add items to continue!</p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        margin: '0 0 2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.name}
                    </p>
                    <p style={{ color: '#f5a623', fontSize: '0.82rem', margin: 0 }}>
                      Rs {item.price.toLocaleString()} x {item.qty}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '10px', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                      }}
                    >
                      −
                    </button>
                    <span style={{ fontWeight: 700, minWidth: '16px', textAlign: 'center', fontSize: '0.9rem' }}>
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#f5a623',
                        color: '#000',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '14px 0 0',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                }}
              >
                <span>Total</span>
                <span style={{ color: '#f5a623' }}>Rs {totalPrice.toLocaleString()}</span>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  width: '100%',
                  padding: '13px',
                  background: 'linear-gradient(135deg, #f5a623, #e8941a)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginTop: '14px',
                  boxShadow: '0 4px 16px rgba(245,166,35,0.3)',
                }}
              >
                Proceed to Checkout →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
