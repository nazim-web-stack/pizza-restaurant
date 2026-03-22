import React from 'react'

export default function About() {
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
              We cooked your desired Pizza Recipe
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#777', marginBottom: '18px' }}>
              On her way she met a copy. The copy warned the Little Blind Text, that where it came from it would have been rewritten a thousand times.
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.9, color: '#777', marginBottom: '25px' }}>
              Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.
            </p>
            <a href="#" style={{ background: '#f5a623', color: '#fff', padding: '13px 35px', borderRadius: '30px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>Read More</a>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
