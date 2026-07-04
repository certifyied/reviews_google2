import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LOGO = `${import.meta.env.BASE_URL}image.png`;
const BLUE = '#1a73e8';
const BLUE_DARK = '#1557b0';
const BLUE_LIGHT = '#e8f0fe';
const BLUE_XLIGHT = '#f8faff';

const Btn = ({ onClick, children, outline = false, large = false }: { onClick?: () => void; children: React.ReactNode; outline?: boolean; large?: boolean }) => (
  <button
    onClick={onClick}
    style={{
      fontSize: large ? 16 : 15,
      fontWeight: 500,
      color: outline ? BLUE : '#fff',
      background: outline ? '#fff' : BLUE,
      border: outline ? `1px solid #dadce0` : 'none',
      cursor: 'pointer',
      padding: large ? '14px 36px' : '12px 26px',
      borderRadius: 100,
      boxShadow: outline ? 'none' : '0 1px 4px rgba(26,115,232,0.3)',
      transition: 'all 0.18s',
      display: 'inline-block',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = outline ? BLUE_LIGHT : BLUE_DARK;
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.boxShadow = outline ? 'none' : '0 4px 14px rgba(26,115,232,0.35)';
      if (outline) e.currentTarget.style.borderColor = BLUE;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = outline ? '#fff' : BLUE;
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = outline ? 'none' : '0 1px 4px rgba(26,115,232,0.3)';
      if (outline) e.currentTarget.style.borderColor = '#dadce0';
    }}
  >
    {children}
  </button>
);

const Label = ({ children }: { children: string }) => (
  <p style={{ fontSize: 13, fontWeight: 600, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, margin: '0 0 16px' }}>
    {children}
  </p>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px', lineHeight: 1.2 }}>
    {children}
  </h2>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  

  const goToLogin = () => navigate('/login');

  const industries = ['Restaurants.', 'Clinics.', 'Hotels.', 'Salons.', 'Retail.', 'Automotive.', 'Local businesses.'];

  return (
    <div style={{ fontFamily: "'Google Sans', Roboto, 'Helvetica Neue', Arial, sans-serif", background: '#fff', color: '#202124', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)',
        borderBottom: '1px solid #e8eaed',
        boxShadow: scrolled ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
        transition: 'box-shadow 0.2s',
        padding: '0 32px',
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <a href={import.meta.env.BASE_URL} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src={LOGO} alt="Review Manager" style={{ height: 28, objectFit: 'contain' }} />
            <span style={{ fontSize: 16, fontWeight: 600, color: '#202124', letterSpacing: '-0.2px' }}>Review Manager</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => navigate('/login')} 
              style={{ fontSize: 14, fontWeight: 500, color: BLUE, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 18px', borderRadius: 100, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = BLUE_LIGHT}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              Sign in
            </button>
            <Btn onClick={() => navigate('/login')} >Get started</Btn>
            <button onClick={() => setMenuOpen(!menuOpen)} className="rm-hamburger"
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2">
                {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ borderTop: '1px solid #e8eaed', padding: '16px 32px 24px' }}>
            <button onClick={() => { goToLogin(); setMenuOpen(false); }}
              style={{ width: '100%', fontSize: 15, fontWeight: 600, color: '#fff', background: BLUE, border: 'none', cursor: 'pointer', padding: '12px', borderRadius: 100 }}>
              Sign in / Get started
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 100, paddingBottom: 80, paddingLeft: 32, paddingRight: 32, overflow: 'hidden' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="rm-hero-grid">

          {/* Left */}
          <div className="rm-fade-up">
            <h1 style={{ fontSize: 'clamp(38px, 5vw, 64px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-2px', color: '#202124', margin: '0 0 24px' }}>
              Your reputation.<br />
              <span style={{ color: BLUE }}>Managed.</span>
            </h1>
            <p style={{ fontSize: 'clamp(16px, 1.8vw, 19px)', color: '#5f6368', lineHeight: 1.7, maxWidth: 460, margin: '0 0 40px' }}>
              Collect customer feedback, understand every experience and build a stronger online reputation.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <Btn onClick={() => navigate('/login')} >Get started</Btn>
              <a href="mailto:contact@certifyied.com?subject=Demo%20Request"
                style={{ fontSize: 15, fontWeight: 500, color: BLUE, background: '#fff', border: '1px solid #dadce0', padding: '11px 24px', borderRadius: 100, textDecoration: 'none', transition: 'all 0.18s', display: 'inline-block' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.background = BLUE_LIGHT; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#dadce0'; e.currentTarget.style.background = '#fff'; }}>
                Book a Demo
              </a>
            </div>
          </div>

          {/* Right: dashboard illustration */}
          <div style={{ position: 'relative' }} className="rm-fade-in-right">
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8eaed', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ background: '#f8f9fa', borderBottom: '1px solid #e8eaed', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: 5, background: c }} />)}
                </div>
                <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: '4px 12px', fontSize: 11, color: '#9aa0a6', border: '1px solid #e8eaed', maxWidth: 220, margin: '0 auto', textAlign: 'center' }}>
                  Review Manager · Dashboard
                </div>
              </div>
              <div style={{ padding: '18px 20px 12px', borderBottom: '1px solid #f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#202124' }}>Good morning, Abhiram</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9aa0a6' }}>Here's what's happening today</p>
                </div>
                <div style={{ width: 32, height: 32, borderRadius: 16, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>A</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 1, background: '#f1f3f4' }}>
                {[
                  { label: 'Overall Rating', value: '4.8', unit: '★', color: '#fbbc05' },
                  { label: 'Total Reviews', value: '1,284', unit: '', color: BLUE },
                  { label: 'To Google', value: '81%', unit: '', color: '#34a853' },
                  { label: 'Private', value: '243', unit: '', color: '#ea4335' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#fff', padding: '14px 18px' }}>
                    <p style={{ margin: '0 0 3px', fontSize: 11, color: '#9aa0a6', fontWeight: 500 }}>{s.label}</p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: s.color, letterSpacing: '-0.5px' }}>{s.value}<span style={{ fontSize: 13 }}>{s.unit}</span></p>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px 20px' }}>
                <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 600, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: 1 }}>Recent Feedback</p>
                {[
                  { init: 'PK', text: 'Loved the service! Will come back.', stars: 5, tag: 'Google', tagColor: BLUE },
                  { init: 'AM', text: 'Waiting time was a bit long overall.', stars: 3, tag: 'Private', tagColor: '#ea4335' },
                  { init: 'RS', text: 'Very professional team, great work!', stars: 5, tag: 'Google', tagColor: BLUE },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '9px 0', borderBottom: i < 2 ? '1px solid #f1f3f4' : 'none', alignItems: 'flex-start' }}>
                    <div style={{ width: 26, height: 26, borderRadius: 13, background: BLUE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: BLUE, flexShrink: 0 }}>{f.init}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ fontSize: 11, color: '#fbbc05' }}>{'★'.repeat(f.stars)}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: f.tagColor, background: f.tagColor + '15', padding: '2px 7px', borderRadius: 100 }}>{f.tag}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 11, color: '#5f6368', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Floating badges */}
            <div style={{ position: 'absolute', bottom: -16, left: -20, background: '#fff', borderRadius: 12, padding: '10px 14px', border: '1px solid #e8eaed', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 10 }} className="rm-float">
              <div style={{ width: 32, height: 32, borderRadius: 16, background: BLUE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={BLUE}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#202124' }}>4.8 avg rating</p>
                <p style={{ margin: 0, fontSize: 10, color: '#9aa0a6' }}>+0.4 this month</p>
              </div>
            </div>
            <div style={{ position: 'absolute', top: -14, right: -16, background: '#fff', borderRadius: 10, padding: '9px 13px', border: '1px solid #e8eaed', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: '#34a853', animation: 'rm-pulse 2s infinite' }} />
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#202124' }}>New review on Google</p>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#e8eaed', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── SECTION 1: Make reviewing easier ── */}
      <section style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <Label>For your customers</Label>
          <H2>Make reviewing easier.</H2>
          <p style={{ fontSize: 18, fontWeight: 600, color: '#3c4043', margin: '0 0 16px', lineHeight: 1.5 }}>A little help finding the right words.</p>
          <p style={{ fontSize: 17, color: '#5f6368', lineHeight: 1.75, margin: '0 0 16px' }}>Your customers know how they feel. Sometimes, they just don't know what to write.</p>
          <p style={{ fontSize: 17, color: '#5f6368', lineHeight: 1.75, margin: '0 0 12px' }}>Review Manager helps customers express their genuine experience clearly and naturally.</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#202124', margin: '0 0 36px' }}>Simple. Helpful. Human.</p>
          <Btn onClick={() => navigate('/login')} >Get started</Btn>

          {/* AI draft card */}
          <div style={{ background: BLUE_XLIGHT, borderRadius: 20, padding: '36px', border: `1px solid #c5d8fd`, marginTop: 56, textAlign: 'left' }}>
            <p style={{ fontSize: 12, color: '#9aa0a6', margin: '0 0 16px', fontWeight: 500 }}>AI-suggested review draft</p>
            <div style={{ background: '#fff', borderRadius: 12, padding: '20px', border: '1px solid #e8eaed', marginBottom: 16 }}>
              <p style={{ fontSize: 14, color: '#3c4043', lineHeight: 1.7, margin: 0 }}>
                "Excellent service from start to finish. The team was professional, friendly and went above and beyond to help me. Highly recommend to anyone looking for quality and care."
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['Use this', 'Try another', 'Edit'].map((label, i) => (
                <div key={i} style={{ padding: '7px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500, background: i === 0 ? BLUE : '#f1f3f4', color: i === 0 ? '#fff' : '#5f6368' }}>{label}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1,2,3,4,5].map(s => <svg key={s} width="28" height="28" viewBox="0 0 24 24" fill="#fbbc05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#e8eaed', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── SECTION 2: Feedback that helps you improve ── */}
      <section style={{ padding: '96px 32px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <Label>For your team</Label>
          <H2>Feedback that helps you improve.</H2>
          <p style={{ fontSize: 18, fontWeight: 600, color: '#3c4043', margin: '0 0 16px', lineHeight: 1.5 }}>Understand what your customers love—and where you can do better.</p>
          <p style={{ fontSize: 17, color: '#5f6368', lineHeight: 1.75, margin: '0 0 36px' }}>Private feedback is organised in one simple dashboard, so your team can listen, act and improve.</p>
          <Btn onClick={() => navigate('/login')} >Get started</Btn>

          {/* Feedback mockup */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px', border: '1px solid #e8eaed', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginTop: 56, textAlign: 'left' }}>
            <p style={{ fontSize: 12, color: '#9aa0a6', margin: '0 0 18px', fontWeight: 500 }}>Private feedback dashboard</p>
            {[
              { initials: 'AM', note: 'Waiting time was a bit long but overall great experience.', stars: 3, time: '2h ago' },
              { initials: 'PK', note: 'Loved the service! Will definitely come back.', stars: 5, time: '5h ago' },
              { initials: 'RS', note: 'Good quality but the reception could be friendlier.', stars: 3, time: 'Yesterday' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: i < 2 ? '1px solid #f1f3f4' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 18, background: BLUE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: BLUE, flexShrink: 0 }}>{item.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: '#fbbc05' }}>{'★'.repeat(item.stars)}{'☆'.repeat(5 - item.stars)}</span>
                    <span style={{ fontSize: 12, color: '#bdc1c6' }}>{item.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#5f6368', lineHeight: 1.5 }}>{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#e8eaed', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── SECTION 3: Everything in one place ── */}
      <section id="everything" style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Label>Dashboard</Label>
            <H2>Everything in one place.</H2>
            <p style={{ fontSize: 18, fontWeight: 500, color: '#3c4043', margin: '0 0 36px', lineHeight: 1.5 }}>One dashboard. Every customer experience.</p>
            <Btn onClick={() => navigate('/login')} >Get started</Btn>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' }}>
            {/* Feature tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              {[
                { label: 'Feedback', desc: 'See customer feedback as it arrives.', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
                { label: 'Ratings', desc: 'Understand customer sentiment.', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
                { label: 'Reviews', desc: 'Track review activity over time.', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
                { label: 'Insights', desc: 'Spot patterns that matter.', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
              ].map((item, i) => (
                <div key={i} style={{ padding: '28px 24px', border: '1px solid #e8eaed', background: '#fff', transition: 'background 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = BLUE_XLIGHT; e.currentTarget.style.borderColor = '#a8c7fa'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e8eaed'; }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: BLUE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>{item.icon}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#202124', margin: '0 0 5px' }}>{item.label}</h3>
                  <p style={{ fontSize: 12, color: '#5f6368', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Review funnel illustration */}
            <div style={{ background: '#f8f9fa', borderRadius: 20, padding: '28px', border: '1px solid #e8eaed' }}>
              <p style={{ fontSize: 11, color: '#9aa0a6', margin: '0 0 20px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>How bad reviews never go public</p>
              <div style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #e8eaed', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 13, background: BLUE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#202124' }}>Customer rates their experience</p>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5].map(s => <svg key={s} width="20" height="20" viewBox="0 0 24 24" fill={s <= 4 ? '#fbbc05' : '#e8eaed'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <svg width="12" height="18" viewBox="0 0 12 18" fill="none" stroke="#bdc1c6" strokeWidth="1.5" strokeLinecap="round"><line x1="6" y1="0" x2="6" y2="14"/><polyline points="1 9 6 14 11 9"/></svg>
              </div>
              <div style={{ background: '#fff', borderRadius: 10, padding: '12px 14px', border: '1px solid #e8eaed', marginBottom: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: BLUE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#202124' }}>Review Manager routes the experience</p>
                  <p style={{ margin: '1px 0 0', fontSize: 10, color: '#9aa0a6' }}>Intelligently based on rating score</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                <div style={{ background: '#fff', borderRadius: 10, padding: '12px', border: '2px solid #34a853', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)', background: '#34a853', borderRadius: 100, padding: '2px 8px', fontSize: 9, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>4–5 ★</div>
                  <p style={{ margin: '10px 0 4px', fontSize: 10, fontWeight: 700, color: '#34a853' }}>→ Google Review</p>
                  <p style={{ margin: 0, fontSize: 10, color: '#5f6368', lineHeight: 1.4 }}>Guided to post their review publicly.</p>
                </div>
                <div style={{ background: '#fff', borderRadius: 10, padding: '12px', border: '2px solid #ea4335', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)', background: '#ea4335', borderRadius: 100, padding: '2px 8px', fontSize: 9, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>1–3 ★</div>
                  <p style={{ margin: '10px 0 4px', fontSize: 10, fontWeight: 700, color: '#ea4335' }}>→ Private Only</p>
                  <p style={{ margin: 0, fontSize: 10, color: '#5f6368', lineHeight: 1.4 }}>Captured for your team. Never public.</p>
                </div>
              </div>
              <div style={{ background: '#e8f0fe', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: BLUE_DARK }}>Your Google rating stays high. Bad reviews never go public.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#e8eaed', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── SECTION 4: Built for every business ── */}
      <section style={{ padding: '96px 32px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <Label>Every industry</Label>
          <H2>Built for every business.</H2>
          <p style={{ fontSize: 17, color: '#5f6368', lineHeight: 1.75, margin: '0 0 36px' }}>If customers have an experience, Review Manager can help you understand it.</p>
          <Btn onClick={() => navigate('/login')} >Get started</Btn>
          <div style={{ marginTop: 56 }}>
            {industries.map((name, i) => (
              <div key={i} style={{ padding: '18px 0', borderBottom: i < industries.length - 1 ? '1px solid #e8eaed' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <span style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#202124', letterSpacing: '-0.5px' }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 32px', background: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ width: 40, height: 2, background: '#c5d8fd', margin: '0 auto 48px' }} />
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px', lineHeight: 1.2 }}>
            Listen better. Improve faster.
          </h2>
          <p style={{ fontSize: 18, fontWeight: 500, color: '#3c4043', margin: '0 0 16px', lineHeight: 1.5 }}>Customer feedback shouldn't sit unread.</p>
          <p style={{ fontSize: 17, color: '#5f6368', lineHeight: 1.75, margin: '0 0 44px' }}>Turn every experience into an opportunity to improve your business.</p>
          <Btn onClick={() => navigate('/login')}  large>Get started with Review Manager</Btn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #e8eaed', padding: '28px 32px', background: '#fff' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={LOGO} alt="Review Manager" style={{ height: 22, objectFit: 'contain', opacity: 0.5 }} />
            <span style={{ fontSize: 13, color: '#9aa0a6', fontWeight: 500 }}>Review Manager by Certifyied</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: '#9aa0a6', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#5f6368'}
                onMouseLeave={e => e.currentTarget.style.color = '#9aa0a6'}>
                {l}
              </a>
            ))}
          </div>
          <span style={{ fontSize: 13, color: '#bdc1c6' }}>© 2026 Certifyied</span>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap');
        @media (max-width: 768px) {
          .rm-hamburger { display: flex !important; }
          .rm-hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          section > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @keyframes rm-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
        @keyframes rm-fade-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rm-fade-right { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
        @keyframes rm-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .rm-fade-up { animation: rm-fade-up 0.7s cubic-bezier(.22,.68,0,1.2) both; }
        .rm-fade-in-right { animation: rm-fade-right 0.8s 0.2s cubic-bezier(.22,.68,0,1.2) both; }
        .rm-float { animation: rm-float 3.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
