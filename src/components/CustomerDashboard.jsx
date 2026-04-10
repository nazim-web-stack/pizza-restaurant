import React, { useState, useEffect } from 'react';

// Get logged in user info from localStorage
const userName = localStorage.getItem('userName');
const userEmail = localStorage.getItem('userEmail');
const customerId = localStorage.getItem('customerId');
const userAvatar = localStorage.getItem('userAvatar');
const userCreatedAt = localStorage.getItem('userCreatedAt');

// Format member since date
const memberSince = userCreatedAt && userCreatedAt !== 'undefined' && userCreatedAt !== 'null' 
  ? new Date(userCreatedAt).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
  : 'Recently joined';

const customerData = {
  name: userName || 'Customer',
  email: userEmail || 'customer@email.com',
  phone: '',
  joinDate: memberSince,
  avatar: userAvatar || '👤',
  loyaltyPoints: 0,
  totalOrders: 0,
  totalSpent: 0,
};

const ordersData = [
  { id: '#ORD-001', date: 'Mar 20, 2026', items: ['Italian Pizza', 'Lemonade'], total: 16.98, status: 'Delivered' },
  { id: '#ORD-002', date: 'Mar 18, 2026', items: ['Cheese Burger', 'Orange Juice'], total: 13.98, status: 'Delivered' },
  { id: '#ORD-003', date: 'Mar 15, 2026', items: ['Pasta Carbonara', 'Greek Pizza'], total: 24.98, status: 'Delivered' },
  { id: '#ORD-004', date: 'Mar 25, 2026', items: ['Margherita', 'Classic Burger'], total: 19.98, status: 'On the Way' },
  { id: '#ORD-005', date: 'Mar 25, 2026', items: ['Italian Pizza x2'], total: 25.98, status: 'Preparing' },
];

const menuItemsList = ['Italian Pizza', 'Greek Pizza', 'Margherita', 'American Pizza', 'Cheese Burger', 'Classic Burger', 'Pasta Carbonara', 'Pasta Bolognese', 'Lemonade Juice', 'Orange Juice'];

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(customerData);

  // ✅ Addresses state
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({ label: '', address: '' });

  // ✅ Reviews state
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ item: '', rating: 5, comment: '' });
  const [hoverRating, setHoverRating] = useState(0);

  // ✅ Real orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // ✅ Profile picture state
  const [profilePicture, setProfilePicture] = useState(userAvatar || null);

  // Profile picture upload handler
  const handleProfilePictureUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result;
        setProfilePicture(base64Image);
        localStorage.setItem('userAvatar', base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get first letter of user's name for Google-style avatar
  const getInitial = (name) => {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return words[0][0].toUpperCase() + words[1][0].toUpperCase();
    }
    return words[0][0].toUpperCase();
  };

  // Generate avatar color based on name
  const getAvatarColor = (name) => {
    const colors = ['#f5a623', '#e74c3c', '#3498db', '#27ae60', '#9b59b6', '#1abc9c'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Fetch real orders from API
  useEffect(() => {
    if (!customerId || customerId === 'admin') return;
    
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError(null);
        const response = await fetch(`http://localhost:5000/api/orders/customer/${customerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setOrdersError('Failed to load orders');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'orders', label: '🛒 My Orders' },
    { id: 'addresses', label: '📍 Addresses' },
    { id: 'reviews', label: '⭐ My Reviews' },
    { id: 'profile', label: '👤 Profile' },
  ];

  const statusColor = (status) => {
    if (status === 'Delivered') return '#27ae60';
    if (status === 'On the Way') return '#f5a623';
    if (status === 'Preparing') return '#3498db';
    return '#888';
  };

  // ✅ Address functions
  const handleAddAddress = () => {
    if (!addressForm.label || !addressForm.address) {
      alert('Please fill both Label and Address!');
      return;
    }
    if (editAddressId) {
      setAddresses(prev => prev.map(a => a.id === editAddressId ? { ...a, ...addressForm } : a));
      setEditAddressId(null);
    } else {
      setAddresses(prev => [...prev, { id: Date.now(), ...addressForm, default: false }]);
    }
    setAddressForm({ label: '', address: '' });
    setShowAddressForm(false);
  };

  const handleEditAddress = (addr) => {
    setAddressForm({ label: addr.label, address: addr.address });
    setEditAddressId(addr.id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const handleSetDefault = (id) => {
    setAddresses(prev => prev.map(a => ({ ...a, default: a.id === id })));
  };

  // ✅ Review functions
  const handleSubmitReview = () => {
    if (!reviewForm.item || !reviewForm.comment) {
      alert('Please fill both Item and comment!');
      return;
    }
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setReviews(prev => [...prev, { id: Date.now(), ...reviewForm, date: today }]);
    setReviewForm({ item: '', rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const handleDeleteReview = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const styles = {
    page: { minHeight: '100vh', background: '#0d0d0d', paddingTop: '90px', fontFamily: "'Nunito', sans-serif", color: '#fff' },
    container: { maxWidth: '1100px', margin: '0 auto', padding: '30px 20px 60px' },
    header: { display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.08)' },
    avatar: { width: '70px', height: '70px', background: 'rgba(245,166,35,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '2px solid #f5a623' },
    name: { fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 900, margin: 0 },
    meta: { color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '4px' },
    tabs: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' },
    tab: (active) => ({ padding: '9px 18px', borderRadius: '25px', border: active ? 'none' : '1px solid rgba(255,255,255,0.15)', background: active ? '#f5a623' : 'transparent', color: active ? '#000' : 'rgba(255,255,255,0.7)', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' }),
    card: { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' },
    stat: { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' },
    statValue: { fontSize: '2rem', fontWeight: 900, color: '#f5a623' },
    statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '4px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '12px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)' },
    td: { padding: '14px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' },
    badge: (status) => ({ background: statusColor(status) + '22', color: statusColor(status), padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, border: `1px solid ${statusColor(status)}44` }),
    input: { width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box', marginBottom: '12px' },
    label: { display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '5px' },
    btn: { padding: '10px 24px', background: '#f5a623', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' },
    btnOutline: { padding: '7px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' },
    btnDanger: { padding: '7px 16px', background: 'transparent', border: '1px solid rgba(231,76,60,0.4)', borderRadius: '8px', color: '#e74c3c', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' },
    formBox: { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(245,166,35,0.3)', marginBottom: '20px' },
    select: { width: '100%', background: 'rgba(30,30,30,1)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box', marginBottom: '12px' },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{
            ...styles.avatar,
            background: profilePicture 
              ? `url(${profilePicture}) center/cover` 
              : getAvatarColor(profile.name),
            fontSize: profilePicture ? '0' : '1.8rem',
            color: profilePicture ? 'transparent' : '#fff',
            fontWeight: profilePicture ? 'normal' : 'bold',
            border: profilePicture ? '3px solid #f5a623' : '2px solid #f5a623'
          }}>
            {!profilePicture && getInitial(profile.name)}
          </div>
          <div>
            <h2 style={styles.name}>{profile.name}</h2>
            <p style={styles.meta}>{profile.email} · Member since {profile.joinDate}</p>
            <p style={{ ...styles.meta, color: '#f5a623', fontWeight: 700 }}>⭐ {customerData.loyaltyPoints} Loyalty Points</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {tabs.map(t => (
            <button key={t.id} style={styles.tab(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* ===== OVERVIEW ===== */}
        {activeTab === 'overview' && (
          <React.Fragment>
            <div style={styles.statsGrid}>
              <div style={styles.stat}><div style={styles.statValue}>{orders.length}</div><div style={styles.statLabel}>Total Orders</div></div>
              <div style={styles.stat}><div style={styles.statValue}>${orders.reduce((sum, order) => sum + (order.totalAmount || order.total || 0), 0).toFixed(2)}</div><div style={styles.statLabel}>Total Spent</div></div>
              <div style={styles.stat}><div style={styles.statValue}>{profile.loyaltyPoints}</div><div style={styles.statLabel}>Loyalty Points</div></div>
              <div style={styles.stat}><div style={styles.statValue}>{reviews.length}</div><div style={styles.statLabel}>Reviews Given</div></div>
            </div>
            <div style={styles.card}>
              <p style={{ fontWeight: 800, marginBottom: '16px', fontSize: '1.05rem' }}>🕐 Recent Orders</p>
              {ordersLoading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                  Loading orders...
                </div>
              ) : ordersError ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#e74c3c' }}>
                  {ordersError}
                </div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                  No orders yet
                </div>
              ) : (
                orders.slice(0, 3).map(order => (
                  <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <p style={{ fontWeight: 700, margin: 0 }}>{order._id ? `#${order._id.slice(-6)}` : order.id}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: 0 }}>
                        {Array.isArray(order.items) ? order.items.map(item => item.name || item.menuItem?.name || 'Item').join(', ') : 'Items'}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={styles.badge(order.status)}>{order.status}</span>
                      <p style={{ color: '#f5a623', fontWeight: 700, margin: '4px 0 0', fontSize: '0.9rem' }}>
                        Rs {(order.totalAmount || order.total || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </React.Fragment>
        )}

        {/* ===== ORDERS ===== */}
        {activeTab === 'orders' && (
          <div style={styles.card}>
            <p style={{ fontWeight: 800, marginBottom: '16px', fontSize: '1.05rem' }}>🛒 All Orders</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Order ID</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Items</th>
                    <th style={styles.th}>Total</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                        Loading orders...
                      </td>
                    </tr>
                  ) : ordersError ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#e74c3c' }}>
                        {ordersError}
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
                        No orders yet. Place your first order!
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order._id}>
                        <td style={{ ...styles.td, fontWeight: 700, color: '#f5a623' }}>#{order._id ? order._id.slice(-6) : order.id}</td>
                        <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td style={{ ...styles.td, color: 'rgba(255,255,255,0.6)' }}>
                          {(order.items || []).map(i => i.name || i.menuItem?.name || 'Item').join(', ')}
                        </td>
                        <td style={{ ...styles.td, fontWeight: 700 }}>Rs {(order.totalAmount || order.total || 0).toFixed(2)}</td>
                        <td style={styles.td}><span style={styles.badge(order.status)}>{order.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===== ADDRESSES ===== */}
        {activeTab === 'addresses' && (
          <React.Fragment>
            {showAddressForm && (
              <div style={styles.formBox}>
                <p style={{ fontWeight: 800, marginBottom: '14px' }}>{editAddressId ? '✏️ Edit Address' : '➕ New Address'}</p>
                <label style={styles.label}>Label (e.g. Home, Office)</label>
                <input style={styles.input} placeholder="e.g. Home" value={addressForm.label} onChange={e => setAddressForm({ ...addressForm, label: e.target.value })} />
                <label style={styles.label}>Full Address</label>
                <input style={styles.input} placeholder="Street, Block, City" value={addressForm.address} onChange={e => setAddressForm({ ...addressForm, address: e.target.value })} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={styles.btn} onClick={handleAddAddress}>💾 Save</button>
                  <button style={styles.btnOutline} onClick={() => { setShowAddressForm(false); setEditAddressId(null); setAddressForm({ label: '', address: '' }); }}>Cancel</button>
                </div>
              </div>
            )}
            <div style={{ display: 'grid', gap: '14px', marginBottom: '20px' }}>
              {addresses.map(addr => (
                <div key={addr.id} style={{ ...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800 }}>📍 {addr.label}</span>
                      {addr.default && <span style={{ background: 'rgba(245,166,35,0.2)', color: '#f5a623', padding: '2px 8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700 }}>Default</span>}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: 0 }}>{addr.address}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {!addr.default && <button style={styles.btnOutline} onClick={() => handleSetDefault(addr.id)}>Set Default</button>}
                    <button style={styles.btnOutline} onClick={() => handleEditAddress(addr)}>✏️ Edit</button>
                    <button style={styles.btnDanger} onClick={() => handleDeleteAddress(addr.id)}>🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
            {!showAddressForm && (
              <button style={styles.btn} onClick={() => { setShowAddressForm(true); setEditAddressId(null); setAddressForm({ label: '', address: '' }); }}>
                + Add New Address
              </button>
            )}
          </React.Fragment>
        )}

        {/* ===== REVIEWS ===== */}
        {activeTab === 'reviews' && (
          <React.Fragment>
            {showReviewForm && (
              <div style={styles.formBox}>
                <p style={{ fontWeight: 800, marginBottom: '14px' }}>✍️ Write a Review</p>
                <label style={styles.label}>Select Item</label>
                <select style={styles.select} value={reviewForm.item} onChange={e => setReviewForm({ ...reviewForm, item: e.target.value })}>
                  <option value="">-- Select item --</option>
                  {menuItemsList.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
                <label style={styles.label}>Rating</label>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      style={{ fontSize: '1.8rem', cursor: 'pointer', color: star <= (hoverRating || reviewForm.rating) ? '#f5a623' : 'rgba(255,255,255,0.2)', transition: 'color 0.1s' }}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >★</span>
                  ))}
                </div>
                <label style={styles.label}>Comment</label>
                <textarea style={{ ...styles.input, minHeight: '80px', resize: 'vertical' }} placeholder="Share your experience..." value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={styles.btn} onClick={handleSubmitReview}>Submit Review</button>
                  <button style={styles.btnOutline} onClick={() => setShowReviewForm(false)}>Cancel</button>
                </div>
              </div>
            )}
            <div style={{ display: 'grid', gap: '14px', marginBottom: '20px' }}>
              {reviews.length === 0 && (
                <div style={{ ...styles.card, textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '40px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>⭐</div>
                  <p>No reviews yet — be the first to write one!</p>
                </div>
              )}
              {reviews.map(review => (
                <div key={review.id} style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <p style={{ fontWeight: 800, margin: 0 }}>{review.item}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>{review.date}</span>
                      <button style={styles.btnDanger} onClick={() => handleDeleteReview(review.id)}>🗑️</button>
                    </div>
                  </div>
                  <div style={{ color: '#f5a623', marginBottom: '8px', fontSize: '1.1rem' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0, fontSize: '0.9rem' }}>{review.comment}</p>
                </div>
              ))}
            </div>
            {!showReviewForm && (
              <button style={styles.btn} onClick={() => setShowReviewForm(true)}>+ Write a Review</button>
            )}
          </React.Fragment>
        )}

        {/* ===== PROFILE ===== */}
        {activeTab === 'profile' && (
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <p style={{ fontWeight: 800, fontSize: '1.05rem', margin: 0 }}>👤 My Profile</p>
              <button style={styles.btn} onClick={() => setEditMode(!editMode)}>{editMode ? 'Cancel' : '✏️ Edit'}</button>
            </div>
            
            {/* Profile Picture Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: profilePicture 
                  ? `url(${profilePicture}) center/cover` 
                  : getAvatarColor(profile.name),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: profilePicture ? '0' : '1.8rem',
                color: profilePicture ? 'transparent' : '#fff',
                fontWeight: 'bold',
                border: profilePicture ? '3px solid #f5a623' : '2px solid #f5a623',
                flexShrink: 0
              }}>
                {!profilePicture && getInitial(profile.name)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, margin: '0 0 8px 0', color: '#fff' }}>Profile Picture</p>
                <input
                  type="file"
                  id="profilePictureInput"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleProfilePictureUpload}
                />
                <button
                  style={styles.btnOutline}
                  onClick={() => document.getElementById('profilePictureInput').click()}
                >
                  📷 Upload Photo
                </button>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '8px 0 0 0' }}>
                  JPG, PNG, GIF up to 5MB
                </p>
              </div>
            </div>

            <label style={styles.label}>Full Name</label>
            <input style={styles.input} value={profile.name} disabled={!editMode} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            <label style={styles.label}>Email</label>
            <input style={styles.input} value={profile.email} disabled={!editMode} onChange={e => setProfile({ ...profile, email: e.target.value })} />
            <label style={styles.label}>Phone</label>
            <input style={styles.input} value={profile.phone} disabled={!editMode} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
            {editMode && <button style={styles.btn} onClick={() => setEditMode(false)}>💾 Save Changes</button>}
          </div>
        )}
      </div>
    </div>
  );
}