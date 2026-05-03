import { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/reviews`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(r => r.json())
    .then(data => { 
      console.log('Reviews data:', data);
      setReviews(Array.isArray(data) ? data : []); 
      setLoading(false); 
    })
    .catch(err => { 
      console.error(err); 
      setLoading(false); 
    });
  }, []);

  const stars = (rating) => '★'.repeat(rating || 0) + '☆'.repeat(5 - (rating || 0));

  if (loading) return <div style={{padding: '40px', textAlign: 'center'}}>Loading reviews...</div>;

  return (
    <div style={{padding: '24px'}}>
      <h2>Customer Reviews</h2>
      <p style={{color: '#666'}}>Total Reviews: {reviews.length}</p>
      {reviews.map(review => (
        <div key={review._id} style={{
          background: '#fff', border: '1px solid #eee', borderRadius: '12px',
          padding: '16px', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <strong>{review.customerName || 'Anonymous'}</strong>
            <span style={{color: '#888', fontSize: '0.85rem'}}>
              {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
            </span>
          </div>
          <div style={{color: '#f5a623', fontSize: '1.2rem', margin: '8px 0'}}>
            {stars(review.rating)} {review.rating}/5
          </div>
          <p style={{color: '#444', margin: 0}}>{review.comment}</p>
        </div>
      ))}
      {reviews.length === 0 && (
        <p style={{textAlign: 'center', color: '#888', marginTop: '40px'}}>No reviews found</p>
      )}
    </div>
  );
}