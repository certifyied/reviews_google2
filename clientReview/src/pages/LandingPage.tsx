import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Login is inside clientReview — same app, same port
  const goToLogin = () => navigate('/login');

  const industries = ['Restaurants.', 'Clinics.', 'Hotels.', 'Salons.', 'Retail.', 'Automotive.', 'Local businesses.'];

  return (
    <div style={{ fontFamily: "'Google Sans', Roboto, 'Helvetica Neue', Arial, sans-serif", background: '#fff', color: '#202124', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
        borderBottom: '1px solid #e8eaed',
        transition: 'box-shadow 0.2s',
        boxShadow: scrolled ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
        padding: '0 32px',
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <a href="./" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="./image.png" alt="Review Manager" style={{ height: 28, objectFit: 'contain' }} />
            <span style={{ fontSize: 16, fontWeight: 600, color: '#202124', letterSpacing: '-0.2px' }}>Review Manager</span>
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={goToLogin}
              style={{ fontSize: 14, fontWeight: 500, color: '#467222', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 18px', borderRadius: 100, transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f4ef')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
              Sign in
            </button>
            <button onClick={goToLogin}
              style={{ fontSize: 14, fontWeight: 500, color: '#fff', background: '#467222', border: 'none', cursor: 'pointer', padding: '9px 22px', borderRadius: 100, transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#3a5f1d')}
              onMouseLeave={e => (e.currentTarget.style.background = '#467222')}>
              Get started
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="rm-hamburger"
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, marginLeft: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2">
                {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ borderTop: '1px solid #e8eaed', padding: '16px 32px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => { goToLogin(); setMenuOpen(false); }} style={{ fontSize: 15, fontWeight: 600, color: '#fff', background: '#467222', border: 'none', cursor: 'pointer', padding: '12px', borderRadius: 100 }}>
              Sign in / Get started
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 120, paddingBottom: 100, paddingLeft: 32, paddingRight: 32, textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-2px', color: '#202124', margin: '0 0 24px' }}>
            Your reputation.<br />
            <span style={{ color: '#467222' }}>Managed.</span>
          </h1>
          <p style={{ fontSize: 'clamp(17px, 2.2vw, 20px)', color: '#5f6368', lineHeight: 1.65, maxWidth: 520, margin: '0 auto 44px', fontWeight: 400 }}>
            Collect customer feedback, understand every experience and build a stronger online reputation.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button onClick={goToLogin}
              style={{ fontSize: 16, fontWeight: 500, color: '#fff', background: '#467222', border: 'none', cursor: 'pointer', padding: '13px 30px', borderRadius: 100, boxShadow: '0 1px 4px rgba(70,114,34,0.3)', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#3a5f1d'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#467222'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Get started
            </button>
            <a href="mailto:contact@certifyied.com?subject=Demo%20Request"
              style={{ fontSize: 16, fontWeight: 500, color: '#467222', background: '#fff', border: '1px solid #dadce0', cursor: 'pointer', padding: '12px 28px', borderRadius: 100, textDecoration: 'none', transition: 'all 0.18s', display: 'inline-block' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#467222'; e.currentTarget.style.background = '#f0f4ef'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#dadce0'; e.currentTarget.style.background = '#fff'; }}>
              Book a Demo
            </a>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#e8eaed', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── SECTION 1: Make reviewing easier ── */}
      <section style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#467222', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>For your customers</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 20px', lineHeight: 1.2 }}>
              Make reviewing easier.
            </h2>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#3c4043', margin: '0 0 16px', lineHeight: 1.5 }}>
              A little help finding the right words.
            </p>
            <p style={{ fontSize: 17, color: '#5f6368', lineHeight: 1.75, margin: '0 0 16px' }}>
              Your customers know how they feel. Sometimes, they just don't know what to write.
            </p>
            <p style={{ fontSize: 17, color: '#5f6368', lineHeight: 1.75, margin: '0 0 24px' }}>
              Review Manager helps customers express their genuine experience clearly and naturally.
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#202124', margin: 0 }}>
              Simple. Helpful. Human.
            </p>
          </div>

          <div style={{ background: '#f8faf5', borderRadius: 20, padding: '40px 36px', border: '1px solid #e0ecd6' }}>
            <p style={{ fontSize: 13, color: '#9aa0a6', margin: '0 0 20px', fontWeight: 500 }}>AI-suggested review draft</p>
            <div style={{ background: '#fff', borderRadius: 12, padding: '20px', border: '1px solid #e8eaed', marginBottom: 16 }}>
              <p style={{ fontSize: 14, color: '#3c4043', lineHeight: 1.7, margin: 0 }}>
                "Excellent service from start to finish. The team was professional, friendly and went above and beyond to help me. Highly recommend to anyone looking for quality and care."
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Use this', 'Try another', 'Edit'].map((label, i) => (
                <div key={i} style={{ padding: '7px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500, background: i === 0 ? '#467222' : '#f1f3f4', color: i === 0 ? '#fff' : '#5f6368', cursor: 'default' }}>
                  {label}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28, display: 'flex', gap: 6 }}>
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="32" height="32" viewBox="0 0 24 24" fill="#fbbc05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#e8eaed', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── SECTION 2: Feedback that helps you improve ── */}
      <section style={{ padding: '96px 32px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px', border: '1px solid #e8eaed', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 13, color: '#9aa0a6', margin: '0 0 20px', fontWeight: 500 }}>Private feedback dashboard</p>
            {[
              { initials: 'AM', note: 'Waiting time was a bit long but overall great experience.', stars: 3, time: '2h ago' },
              { initials: 'PK', note: 'Loved the service! Will definitely come back.', stars: 5, time: '5h ago' },
              { initials: 'RS', note: 'Good quality but the reception could be friendlier.', stars: 3, time: 'Yesterday' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: i < 2 ? '1px solid #f1f3f4' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 18, background: '#e8f5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#467222', flexShrink: 0 }}>{item.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: '#fbbc05', letterSpacing: 1 }}>{'★'.repeat(item.stars)}{'☆'.repeat(5 - item.stars)}</span>
                    <span style={{ fontSize: 12, color: '#bdc1c6' }}>{item.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#5f6368', lineHeight: 1.5 }}>{item.note}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#467222', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>For your team</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 20px', lineHeight: 1.2 }}>
              Feedback that helps you improve.
            </h2>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#3c4043', margin: '0 0 16px', lineHeight: 1.5 }}>
              Understand what your customers love—and where you can do better.
            </p>
            <p style={{ fontSize: 17, color: '#5f6368', lineHeight: 1.75, margin: '0 0 28px' }}>
              Private feedback is organised in one simple dashboard, so your team can listen, act and improve.
            </p>
            <a href="#everything" style={{ fontSize: 15, fontWeight: 500, color: '#467222', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'gap 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.gap = '10px')}
              onMouseLeave={e => (e.currentTarget.style.gap = '6px')}>
              See what customers are saying →
            </a>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#e8eaed', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── SECTION 3: Everything in one place ── */}
      <section id="everything" style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ maxWidth: 540, marginBottom: 64 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#467222', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>Dashboard</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px', lineHeight: 1.2 }}>
              Everything in one place.
            </h2>
            <p style={{ fontSize: 18, fontWeight: 500, color: '#3c4043', margin: 0, lineHeight: 1.5 }}>
              One dashboard. Every customer experience.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 2 }}>
            {[
              { label: 'Feedback', desc: 'See customer feedback as it arrives.', icon: '💬' },
              { label: 'Ratings', desc: 'Understand customer sentiment.', icon: '⭐' },
              { label: 'Reviews', desc: 'Track review activity.', icon: '📋' },
              { label: 'Insights', desc: 'Spot patterns that matter.', icon: '📊' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '40px 32px', border: '1px solid #e8eaed', background: '#fff', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f8faf5')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                <div style={{ fontSize: 28, marginBottom: 20 }}>{item.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#202124', margin: '0 0 10px', letterSpacing: '-0.3px' }}>{item.label}</h3>
                <p style={{ fontSize: 15, color: '#5f6368', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#e8eaed', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── SECTION 4: Built for every business ── */}
      <section style={{ padding: '96px 32px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#467222', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>Every industry</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 32px', lineHeight: 1.2 }}>
              Built for every business.
            </h2>
            <p style={{ fontSize: 17, color: '#5f6368', lineHeight: 1.75, margin: 0 }}>
              If customers have an experience, Review Manager can help you understand it.
            </p>
          </div>

          <div>
            {industries.map((name, i) => (
              <div key={i} style={{ padding: '18px 0', borderBottom: i < industries.length - 1 ? '1px solid #e8eaed' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'clamp(20px, 2.8vw, 26px)', fontWeight: 700, color: '#202124', letterSpacing: '-0.5px' }}>{name}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bdc1c6" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 32px', background: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ width: 40, height: 2, background: '#e0ecd6', margin: '0 auto 48px' }} />
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px', lineHeight: 1.2 }}>
            Listen better. Improve faster.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 500, color: '#3c4043', margin: '0 0 16px', lineHeight: 1.5 }}>
            Customer feedback shouldn't sit unread.
          </p>
          <p style={{ fontSize: 17, color: '#5f6368', lineHeight: 1.75, margin: '0 0 44px' }}>
            Turn every experience into an opportunity to improve your business.
          </p>
          <button onClick={goToLogin}
            style={{ fontSize: 16, fontWeight: 500, color: '#fff', background: '#467222', border: 'none', cursor: 'pointer', padding: '14px 36px', borderRadius: 100, boxShadow: '0 2px 8px rgba(70,114,34,0.3)', transition: 'all 0.18s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#3a5f1d'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(70,114,34,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#467222'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(70,114,34,0.3)'; }}>
            Get started with Review Manager
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #e8eaed', padding: '28px 32px', background: '#fff' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="./image.png" alt="Review Manager" style={{ height: 22, objectFit: 'contain', opacity: 0.6 }} />
            <span style={{ fontSize: 13, color: '#9aa0a6', fontWeight: 500 }}>Review Manager by Certifyied</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: '#9aa0a6', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#5f6368')}
                onMouseLeave={e => (e.currentTarget.style.color = '#9aa0a6')}>
                {l}
              </a>
            ))}
          </div>
          <span style={{ fontSize: 13, color: '#bdc1c6' }}>© 2026 Certifyied</span>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .rm-hamburger { display: flex !important; }
          section > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>
    </div>
  );
}
