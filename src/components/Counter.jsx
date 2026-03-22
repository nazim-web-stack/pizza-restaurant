import React from 'react'
import { useEffect, useRef, useState } from 'react';


export default function Counter({count}) {
    const [counts, setCounts] = useState(count.map(() => 0));
  const ref = useRef();
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        count.forEach((c, i) => {
          const step = c.target / 100;
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= c.target) { current = c.target; clearInterval(timer); }
            setCounts(prev => { const n = [...prev]; n[i] = Math.floor(current); return n; });
          }, 20);
        });
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
     <section ref={ref} style={{ padding: '80px 0', background: 'linear-gradient(135deg,#1a1a2e,#16213e)' }}>
      <div className="container">
        <div className="row">
          {count.map((c, i) => (
            <div key={i} className="col-6 col-md-3 text-center" style={{ padding: '20px' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: '#f5a623', lineHeight: 1 }}>
                {counts[i].toLocaleString()}
              </div>
              <p style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '8px', letterSpacing: '2px', textTransform: 'uppercase' }}>{c.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    </>
  )
}
