import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Show success message
    setShowSuccess(true);
    
    // Clear form fields
    setFormData({ name: '', email: '', message: '' });
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <>
      <section style={{ padding: '100px 0 0', background: '#fff', minHeight: '80vh', paddingBottom: '0', marginBottom: '0' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <span style={{ color: '#f5a623', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Contact Us</span>
                <h2 style={{ fontFamily: 'Georgia', fontSize: '3rem', color: '#1a1a2e', display: 'block', marginTop: '10px' }}>Get in Touch</h2>
                <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto 30px' }}>
                  Have questions about our menu or want to place a custom order? We'd love to hear from you!
                </p>
              </div>

              <div style={{ 
                background: 'linear-gradient(135deg, #1a1a2e, #16213e)', 
                borderRadius: '15px', 
                padding: '40px', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#fff', 
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '1rem',
                        transition: 'all 0.3s'
                      }}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#fff', 
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '1rem',
                        transition: 'all 0.3s'
                      }}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" style={{ 
                      display: 'block', 
                      marginBottom: '8px', 
                      color: '#fff', 
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}>
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        fontSize: '1rem',
                        transition: 'all 0.3s',
                        resize: 'vertical',
                        minHeight: '120px'
                      }}
                      placeholder="Tell us about your order or ask questions..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={showSuccess}
                    style={{
                      width: '100%',
                      padding: '14px 20px',
                      background: showSuccess ? '#28a745' : '#f5a623',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 700,
                      cursor: showSuccess ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    {showSuccess ? 'Sending...' : 'Send Message'}
                  </button>
                </form>

                {showSuccess && (
                  <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: 'rgba(40, 167, 69, 0.1)',
                    border: '1px solid rgba(40, 167, 69, 0.3)',
                    borderRadius: '8px',
                    color: '#28a745',
                    textAlign: 'center',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}>
                    Thank you! We will contact you soon.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Restaurant Info Section */}
          <div style={{ marginTop: '60px', marginBottom: '0' }}>
            <div className="row">
              <div className="col-lg-4">
                <div style={{ 
                  background: '#fff8f0', 
                  borderRadius: '12px', 
                  padding: '30px', 
                  textAlign: 'center',
                  marginBottom: '20px',
                  minHeight: '200px'
                }}>
                  <i className="fas fa-map-marker-alt" style={{ color: '#f5a623', fontSize: '2rem', marginBottom: '15px' }}></i>
                  <h4 style={{ color: '#1a1a2e', fontSize: '1.2rem', marginBottom: '15px', lineHeight: 1.3, fontWeight: 'bold' }}>Restaurant Address</h4>
                  <p style={{ color: '#333333', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, wordWrap: 'break-word' }}>
                    94/9-L Sahiwal, Pakistan<br />
                    Stoke-on-Trent, UK
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div style={{ 
                  background: '#fff8f0', 
                  borderRadius: '12px', 
                  padding: '30px', 
                  textAlign: 'center',
                  marginBottom: '20px',
                  minHeight: '200px'
                }}>
                  <i className="fas fa-phone" style={{ color: '#f5a623', fontSize: '2rem', marginBottom: '15px' }}></i>
                  <h4 style={{ color: '#1a1a2e', fontSize: '1.2rem', marginBottom: '15px', lineHeight: 1.3, fontWeight: 'bold' }}>Phone Number</h4>
                  <p style={{ color: '#333333', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, wordWrap: 'break-word' }}>
                    +92 319 8634894
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div style={{ 
                  background: '#fff8f0', 
                  borderRadius: '12px', 
                  padding: '30px', 
                  textAlign: 'center',
                  marginBottom: '20px',
                  minHeight: '200px'
                }}>
                  <i className="fas fa-envelope" style={{ color: '#f5a623', fontSize: '2rem', marginBottom: '15px' }}></i>
                  <h4 style={{ color: '#1a1a2e', fontSize: '1.2rem', marginBottom: '15px', lineHeight: 1.3, fontWeight: 'bold' }}>Email Address</h4>
                  <p style={{ color: '#333333', fontSize: '0.95rem', lineHeight: 1.6, margin: 0, wordWrap: 'break-word' }}>
                    info@pizzadelicious.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
