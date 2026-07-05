import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LOGO = `${import.meta.env.BASE_URL}image.png`;
const BLUE = '#1a73e8';
const BLUE_DARK = '#1557b0';
const BLUE_LIGHT = '#e8f0fe';
const BLUE_XLIGHT = '#f8faff';

const Btn = ({
  onClick, children, outline = false, large = false, href,
}: {
  onClick?: () => void; children: React.ReactNode; outline?: boolean; large?: boolean; href?: string;
}) => {
  const style: React.CSSProperties = {
    fontSize: large ? 16 : 15, fontWeight: 500,
    color: outline ? BLUE : '#fff',
    background: outline ? '#fff' : BLUE,
    border: outline ? '1px solid #dadce0' : 'none',
    cursor: 'pointer',
    padding: large ? '14px 36px' : '12px 26px',
    borderRadius: 100,
    boxShadow: outline ? 'none' : '0 1px 4px rgba(26,115,232,0.3)',
    transition: 'all 0.18s', display: 'inline-block', textDecoration: 'none',
  };
  const enter = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = outline ? BLUE_LIGHT : BLUE_DARK;
    e.currentTarget.style.transform = 'translateY(-1px)';
    e.currentTarget.style.boxShadow = outline ? 'none' : '0 4px 14px rgba(26,115,232,0.35)';
    if (outline) e.currentTarget.style.borderColor = BLUE;
  };
  const leave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.background = outline ? '#fff' : BLUE;
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = outline ? 'none' : '0 1px 4px rgba(26,115,232,0.3)';
    if (outline) e.currentTarget.style.borderColor = '#dadce0';
  };
  if (href) return <a href={href} style={style} onMouseEnter={enter} onMouseLeave={leave}>{children}</a>;
  return <button onClick={onClick} style={style} onMouseEnter={enter} onMouseLeave={leave}>{children}</button>;
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const goToLogin = () => navigate('/login');

  const [modalOpen, setModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Auto rotate steps every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(timer);
  }, []);
  const [modalType, setModalType] = useState<'demo' | 'started'>('demo');
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState('');

  const openModal = (type: 'demo' | 'started') => {
    setModalType(type);
    setModalOpen(true);
    setModalName('');
    setModalEmail('');
    setModalPhone('');
    setModalSuccess(false);
    setModalError('');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);

    // Load Blog CDN script
    const script = document.createElement('script');
    script.src = 'https://bloggfeature.certifyied.workers.dev/adminApiBlog/api/embed';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      window.removeEventListener('scroll', onScroll);
      const existingScript = document.querySelector(`script[src="https://bloggfeature.certifyied.workers.dev/adminApiBlog/api/embed"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const industries = ['Restaurants.', 'Clinics.', 'Hotels.', 'Salons.', 'Retail.', 'Automotive.', 'Local businesses.'];



  return (
    <div style={{ fontFamily: "'Google Sans', Roboto, 'Helvetica Neue', Arial, sans-serif", background: '#fff', color: '#202124', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.97)', borderBottom: '1px solid #e8eaed', boxShadow: scrolled ? '0 1px 6px rgba(0,0,0,0.08)' : 'none', transition: 'box-shadow 0.2s', padding: '0 32px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
                    <a href={import.meta.env.BASE_URL} style={{ display: 'flex', alignItems: 'center', gap: 0, textDecoration: 'none', flexShrink: 0 }}>
            <img src={LOGO} alt="Logo" style={{ height: 38, objectFit: 'contain' }} />
          </a>
          
          {/* Middle Navigation Links */}
          <div className="rm-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="#how-it-works" style={{ fontSize: 14, fontWeight: 500, color: '#5f6368', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = BLUE} onMouseLeave={e => e.currentTarget.style.color = '#5f6368'}>How it works</a>
            <a href="#faq" style={{ fontSize: 14, fontWeight: 500, color: '#5f6368', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = BLUE} onMouseLeave={e => e.currentTarget.style.color = '#5f6368'}>FAQ</a>
            <a href="#blog" style={{ fontSize: 14, fontWeight: 500, color: '#5f6368', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = BLUE} onMouseLeave={e => e.currentTarget.style.color = '#5f6368'}>Blog</a>
            <a href="#" onClick={(e) => { e.preventDefault(); openModal('demo'); }} style={{ fontSize: 14, fontWeight: 500, color: '#5f6368', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = BLUE} onMouseLeave={e => e.currentTarget.style.color = '#5f6368'}>Contact</a>
            <a href="#" style={{ fontSize: 14, fontWeight: 500, color: '#5f6368', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = BLUE} onMouseLeave={e => e.currentTarget.style.color = '#5f6368'}>Privacy Policy</a>
            <a href="#" style={{ fontSize: 14, fontWeight: 500, color: '#5f6368', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = BLUE} onMouseLeave={e => e.currentTarget.style.color = '#5f6368'}>Terms</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Btn onClick={goToLogin}>Login</Btn>
            <button onClick={() => setMenuOpen(!menuOpen)} className="rm-hamburger"
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2">
                {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
              </svg>
            </button>
          </div>
        </div>
                {menuOpen && (
          <div style={{ borderTop: '1px solid #e8eaed', padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: '#202124', textDecoration: 'none' }}>How it works</a>
            <a href="#faq" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: '#202124', textDecoration: 'none' }}>FAQ</a>
            <a href="#blog" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: '#202124', textDecoration: 'none' }}>Blog</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); openModal('demo'); }} style={{ fontSize: 15, fontWeight: 500, color: '#202124', textDecoration: 'none' }}>Contact</a>
            <a href="#" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: '#202124', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: '#202124', textDecoration: 'none' }}>Terms</a>
            <button onClick={() => { goToLogin(); setMenuOpen(false); }}
              style={{ width: '100%', fontSize: 15, fontWeight: 600, color: '#fff', background: BLUE, border: 'none', cursor: 'pointer', padding: '13px', borderRadius: 100, marginTop: 8 }}>
              Login
            </button>
          </div>
        )}
      </nav>

                  {/* ── HERO ── */}
      <section style={{ paddingTop: 100, paddingBottom: 80, paddingLeft: 32, paddingRight: 32 }}>
        <div className="rm-hero-grid" style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'row', gap: 56, alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Left: text */}
          <div className="rm-hero-text rm-fade-up" style={{ flex: 1.1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', minWidth: 280 }}>
            <h1 style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-2px', color: '#202124', margin: '0 0 22px' }}>
              Your reputation.<br /><span style={{ color: BLUE }}>Managed.</span>
            </h1>
            <p style={{ fontSize: 'clamp(16px, 1.6vw, 18px)', color: '#5f6368', lineHeight: 1.75, maxWidth: 420, margin: '0 0 36px' }}>
              Collect customer feedback, understand every experience and build a stronger online reputation.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-start' }} className="rm-hero-buttons">
              <Btn onClick={() => openModal('started')} large>Get started</Btn>
              <Btn onClick={() => openModal('demo')} outline large>Book a Demo</Btn>
            </div>
          </div>

          {/* Right: dashboard */}
          <div className="rm-fade-in-right" style={{ flex: 0.9, position: 'relative', width: '100%', minWidth: 280 }}>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8eaed', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', overflow: 'hidden', textAlign: 'left' }}>
              <div style={{ background: '#f8f9fa', borderBottom: '1px solid #e8eaed', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['#ff5f57', '#ffbd2e', '#28c840'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: 5, background: c }} />)}
                </div>
                <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: '3px 12px', fontSize: 11, color: '#9aa0a6', border: '1px solid #e8eaed', maxWidth: 200, margin: '0 auto', textAlign: 'center' }}>Review Manager · Dashboard</div>
              </div>
              <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid #f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#202124' }}>Good morning, Abhiram</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9aa0a6' }}>Here's what's happening today</p>
                </div>
                <div style={{ width: 30, height: 30, borderRadius: 15, background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>A</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 1, background: '#f1f3f4' }}>
                {[{ label: 'Overall Rating', value: '4.8', unit: '★', color: '#fbbc05' }, { label: 'Total Reviews', value: '1,284', unit: '', color: BLUE }, { label: 'To Google', value: '81%', unit: '', color: '#34a853' }, { label: 'Private', value: '243', unit: '', color: '#ea4335' }].map((s, i) => (
                  <div key={i} style={{ background: '#fff', padding: '13px 16px' }}>
                    <p style={{ margin: '0 0 3px', fontSize: 11, color: '#9aa0a6', fontWeight: 500 }}>{s.label}</p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: s.color, letterSpacing: '-0.5px' }}>{s.value}<span style={{ fontSize: 13 }}>{s.unit}</span></p>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 18px' }}>
                <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 600, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: 1 }}>Recent Feedback</p>
                {[{ init: 'PK', text: 'Loved the service! Will come back.', stars: 5, tag: 'Google', tc: BLUE }, { init: 'AM', text: 'Wait time was a bit long overall.', stars: 3, tag: 'Private', tc: '#ea4335' }, { init: 'RS', text: 'Very professional team, great work!', stars: 5, tag: 'Google', tc: BLUE }].map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 9, padding: '8px 0', borderBottom: i < 2 ? '1px solid #f1f3f4' : 'none', alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: 12, background: BLUE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: BLUE, flexShrink: 0 }}>{f.init}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: 10, color: '#fbbc05' }}>{'★'.repeat(f.stars)}</span>
                        <span style={{ fontSize: 9, fontWeight: 600, color: f.tc, background: f.tc + '15', padding: '1px 6px', borderRadius: 100 }}>{f.tag}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 11, color: '#5f6368', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Floating badges — safely positioned inside the layout boundary */}
            <div className="rm-badge rm-float" style={{ position: 'absolute', bottom: 12, left: 12, background: '#fff', borderRadius: 8, padding: '6px 10px', border: '1px solid #e8eaed', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 8, zIndex: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: 12, background: BLUE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill={BLUE}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#202124', lineHeight: 1.1 }}>4.8 Rating</p>
                <p style={{ margin: 0, fontSize: 9, color: '#9aa0a6' }}>+0.4 this month</p>
              </div>
            </div>
            <div className="rm-badge" style={{ position: 'absolute', top: 8, right: 12, background: '#fff', borderRadius: 9, padding: '4px 10px', border: '1px solid #e8eaed', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 6, zIndex: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: '#34a853', animation: 'rm-pulse 2s infinite' }} />
              <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: '#202124' }}>New Google review</p>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#e8eaed', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── HOW IT WORKS (Everything in one place) — Interactive Step Flow ── */}
      <section id="how-it-works" style={{ padding: '96px 32px', background: '#f8faff' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 14px' }}>Platform Flow</p>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px', lineHeight: 1.2 }}>Everything in one place.</h2>
            <p style={{ fontSize: 17, color: '#5f6368', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 36px' }}>
              One integrated platform. Multiple smart touchpoints. Experience a unified reputation management flow.
            </p>
            <Btn onClick={() => openModal('started')}>Get started</Btn>
          </div>

          {/* Interactive Steps Layout */}
          <div className="rm-interactive-flow" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center' }}>
            
            {/* Left: Step Cards Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                {
                  n: '01',
                  label: 'Capture Feedback',
                  desc: 'Customers rate their experience via a simple, branded link or QR code — no downloads required.',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeStep === 0 ? BLUE : '#9aa0a6'} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                },
                {
                  n: '02',
                  label: 'Intelligent Routing',
                  desc: '4 & 5-star ratings are routed to Google Reviews. 1 to 3-star ratings are directed to a private feedback form.',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeStep === 1 ? BLUE : '#9aa0a6'} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                },
                {
                  n: '03',
                  label: 'Private Resolution',
                  desc: 'Unhappy customers leave feedback privately. You resolve the issue directly; bad reviews never hit Google.',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeStep === 2 ? BLUE : '#9aa0a6'} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                },
                {
                  n: '04',
                  label: 'Unified Analytics',
                  desc: 'All ratings, public reviews, private feedback, and business insights are compiled in your dashboard.',
                  icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={activeStep === 3 ? BLUE : '#9aa0a6'} strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                }
              ].map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    style={{
                      padding: '24px',
                      borderRadius: 16,
                      background: '#fff',
                      border: `2px solid ${isActive ? BLUE : '#e8eaed'}`,
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      boxShadow: isActive ? '0 8px 24px rgba(26,115,232,0.06)' : 'none',
                      textAlign: 'left'
                    }}
                    onMouseEnter={e => {
                      if (!isActive) e.currentTarget.style.borderColor = '#c5d8fd';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) e.currentTarget.style.borderColor = '#e8eaed';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: isActive ? BLUE_LIGHT : '#f1f3f4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.25s'
                      }}>
                        {step.icon}
                      </div>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? BLUE : '#9aa0a6', letterSpacing: 1.5 }}>STEP {step.n}</span>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '2px 0 0', color: '#202124' }}>{step.label}</h3>
                      </div>
                    </div>
                    {/* Expandable description */}
                    <p style={{
                      margin: 0,
                      fontSize: 13,
                      color: '#5f6368',
                      lineHeight: 1.6,
                      display: 'block'
                    }}>
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right: Live Interactive Mockup Card Preview Panel */}
            <div style={{
              background: '#fff',
              border: '1px solid #e8eaed',
              borderRadius: 24,
              padding: '40px 32px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.05)',
              minHeight: 280,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden'
            }} className="rm-fade-up">
              
              {/* Step 1 Visual */}
              {activeStep === 0 && (
                <div style={{ width: '100%', textAlign: 'center' }} className="rm-fade-up">
                  <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: 1 }}>Scan QR Code / Click Link</p>
                  <div style={{ width: 110, height: 110, background: '#f8faff', border: `2px dashed ${BLUE}`, borderRadius: 12, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><line x1="7" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="17" y2="17"/><line x1="17" y1="7" x2="17" y2="7"/></svg>
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: '#202124' }}>Rate your experience</p>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="28" height="28" viewBox="0 0 24 24" fill={s <= 4 ? '#fbbc05' : '#e8eaed'} style={{ transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2 Visual */}
              {activeStep === 1 && (
                <div style={{ width: '100%', textAlign: 'center' }} className="rm-fade-up">
                  <p style={{ margin: '0 0 20px', fontSize: 12, fontWeight: 700, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: 1 }}>Intelligent Routing</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ border: '2px solid #34a853', background: '#f6fbf7', borderRadius: 12, padding: 20 }}>
                      <span style={{ fontSize: 11, background: '#34a853', color: '#fff', padding: '3px 8px', borderRadius: 100, fontWeight: 700 }}>4–5 ★ rating</span>
                      <h4 style={{ margin: '14px 0 6px', fontSize: 14, fontWeight: 700, color: '#1b5e20' }}>Google Review</h4>
                      <p style={{ margin: 0, fontSize: 11, color: '#5f6368', lineHeight: 1.4 }}>Guided publicly to build your global score.</p>
                    </div>
                    <div style={{ border: '2px solid #ea4335', background: '#fdf7f7', borderRadius: 12, padding: 20 }}>
                      <span style={{ fontSize: 11, background: '#ea4335', color: '#fff', padding: '3px 8px', borderRadius: 100, fontWeight: 700 }}>1–3 ★ rating</span>
                      <h4 style={{ margin: '14px 0 6px', fontSize: 14, fontWeight: 700, color: '#b71c1c' }}>Private Form</h4>
                      <p style={{ margin: 0, fontSize: 11, color: '#5f6368', lineHeight: 1.4 }}>Sent directly to your team's inbox.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 Visual */}
              {activeStep === 2 && (
                <div style={{ width: '100%' }} className="rm-fade-up">
                  <p style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 700, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>Captured Customer Form</p>
                  <div style={{ background: '#f8fafc', borderRadius: 12, padding: 20, border: '1px solid #cbd5e1' }}>
                    <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#202124' }}>How can we make things right?</p>
                    <div style={{ height: 48, background: '#fff', border: '1px solid #dadce0', borderRadius: 6, padding: '8px 12px', fontSize: 12, color: '#9aa0a6', boxSizing: 'border-box', marginBottom: 12 }}>
                      "The service was slow today..."
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#9aa0a6' }}>🔒 Captured privately</span>
                      <div style={{ background: BLUE, color: '#fff', fontSize: 12, fontWeight: 600, padding: '8px 16px', borderRadius: 100, display: 'inline-block' }}>Submit Response</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 Visual */}
              {activeStep === 3 && (
                <div style={{ width: '100%' }} className="rm-fade-up">
                  <p style={{ margin: '0 0 16px', fontSize: 12, fontWeight: 700, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>Real-time Dashboard Metrics</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div style={{ background: BLUE_LIGHT, borderRadius: 10, padding: 14 }}>
                      <span style={{ fontSize: 11, color: '#5f6368' }}>Overall Score</span>
                      <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 700, color: BLUE }}>4.8 ★</p>
                    </div>
                    <div style={{ background: '#e8f5e0', borderRadius: 10, padding: 14 }}>
                      <span style={{ fontSize: 11, color: '#5f6368' }}>Protection Rate</span>
                      <p style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 700, color: '#34a853' }}>100%</p>
                    </div>
                  </div>
                  <div style={{ background: '#f1f3f4', borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#202124' }}>Recent Negative Review</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#ea4335', background: '#ea433515', padding: '2px 8px', borderRadius: 100 }}>Diverted</span>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>


      {/* ── SECTION: Make reviewing easier ── */}
      <section style={{ padding: '88px 32px' }}>
        <div className="rm-split-grid" style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'row', gap: 72, alignItems: 'center' }}>
          {/* Left: Text */}
          <div className="rm-split-text" style={{ flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 280 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 14px' }}>For your customers</p>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px', lineHeight: 1.2 }}>Make reviewing easier.</h2>
            <p style={{ fontSize: 17, fontWeight: 600, color: '#3c4043', margin: '0 0 14px', lineHeight: 1.5 }}>A little help finding the right words.</p>
            <p style={{ fontSize: 16, color: '#5f6368', lineHeight: 1.75, margin: '0 0 14px' }}>Your customers know how they feel. Sometimes, they just don't know what to write.</p>
            <p style={{ fontSize: 16, color: '#5f6368', lineHeight: 1.75, margin: '0 0 10px' }}>Review Manager helps customers express their genuine experience clearly and naturally.</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#202124', margin: '0 0 32px' }}>Simple. Helpful. Human.</p>
            <Btn onClick={() => openModal('started')}>Get started</Btn>
          </div>
          {/* Right: Visual */}
          <div className="rm-split-visual" style={{ flex: 1, width: '100%', minWidth: 280 }}>
            <div style={{ background: BLUE_XLIGHT, borderRadius: 20, padding: '32px', border: '1px solid #c5d8fd', textAlign: 'left' }}>
              <p style={{ fontSize: 12, color: '#9aa0a6', margin: '0 0 14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>AI-suggested review draft</p>
              <div style={{ background: '#fff', borderRadius: 12, padding: '18px', border: '1px solid #e8eaed', marginBottom: 14 }}>
                <p style={{ fontSize: 14, color: '#3c4043', lineHeight: 1.7, margin: 0 }}>"Excellent service from start to finish. The team was professional, friendly and went above and beyond to help me. Highly recommend to anyone looking for quality and care."</p>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
                {['Use this', 'Try another', 'Edit'].map((label, i) => (
                  <div key={i} style={{ padding: '7px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500, background: i === 0 ? BLUE : '#f1f3f4', color: i === 0 ? '#fff' : '#5f6368' }}>{label}</div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {[1, 2, 3, 4, 5].map(s => <svg key={s} width="26" height="26" viewBox="0 0 24 24" fill="#fbbc05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>)}
              </div>
            </div>
          </div>
        </div>
      </section><div style={{ height: 1, background: '#e8eaed', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── SECTION: Feedback that helps you improve ── */}
      <section style={{ padding: '88px 32px', background: '#f8f9fa' }}>
        <div className="rm-split-grid" style={{ maxWidth: 1080, margin: '0 auto' }}>
          {/* Left: Private Dashboard Visual */}
          <div className="rm-split-visual rm-split-left" style={{ flex: 1, width: '100%', minWidth: 280 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid #e8eaed', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', textAlign: 'left' }}>
              <p style={{ fontSize: 12, color: '#9aa0a6', margin: '0 0 16px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Private feedback dashboard</p>
              {[{ initials: 'AM', note: 'Waiting time was a bit long but overall great experience.', stars: 3, time: '2h ago' }, { initials: 'PK', note: 'Loved the service! Will definitely come back.', stars: 5, time: '5h ago' }, { initials: 'RS', note: 'Good quality but reception could be friendlier.', stars: 3, time: 'Yesterday' }].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < 2 ? '1px solid #f1f3f4' : 'none' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 17, background: BLUE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: BLUE, flexShrink: 0 }}>{item.initials}</div>
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
          {/* Right: Text */}
          <div className="rm-split-text rm-split-right" style={{ flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 280 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 14px' }}>For your team</p>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px', lineHeight: 1.2 }}>Feedback that helps you improve.</h2>
            <p style={{ fontSize: 17, fontWeight: 600, color: '#3c4043', margin: '0 0 14px', lineHeight: 1.5 }}>Understand what your customers love—and where you can do better.</p>
            <p style={{ fontSize: 16, color: '#5f6368', lineHeight: 1.75, margin: '0 0 32px' }}>Private feedback is organised in one simple dashboard, so your team can listen, act and improve.</p>
            <Btn onClick={() => openModal('started')}>Get started</Btn>
          </div>
        </div>
      </section><div style={{ height: 1, background: '#e8eaed', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── SECTION: Built for every business ── */}
      <section style={{ padding: '88px 32px' }}>
        <div className="rm-biz-grid" style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

          {/* Left: text */}
          <div className="rm-biz-text" style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 14px' }}>Every industry</p>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 20px', lineHeight: 1.2 }}>Built for every business.</h2>
            <p style={{ fontSize: 16, color: '#5f6368', lineHeight: 1.75, margin: '0 0 36px' }}>If customers have an experience, Review Manager can help you understand it — whatever your industry.</p>
            <Btn onClick={() => openModal('started')}>Get started</Btn>
          </div>

          {/* Right: industry list */}
          <div className="rm-biz-list">
            {industries.map((name, i) => {
              const id = name.toLowerCase().replace('.', '').trim().replace(/\s+/g, '-');
              return (
                <div 
                  key={i} 
                  onClick={() => navigate('/industry/' + id)}
                  style={{ padding: '16px 0', borderBottom: i < industries.length - 1 ? '1px solid #e8eaed' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'padding-left 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.paddingLeft = '8px'}
                  onMouseLeave={e => e.currentTarget.style.paddingLeft = '0'}
                >
                  <span style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700, color: '#202124', letterSpacing: '-0.5px' }}>{name}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* ── FAQ SECTION ── */}
      <section id="faq" style={{ padding: '88px 32px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 14px' }}>FAQ</p>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px', lineHeight: 1.2 }}>Frequently Asked Questions</h2>
            <p style={{ fontSize: 16, color: '#5f6368', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>Have questions? We have answers. Find out how Review Manager helps you protect your online reputation.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                q: 'How does the smart routing logic work?',
                a: 'Review Manager prompts customers to rate their experience. Ratings of 4 or 5 stars are guided to public platforms like Google. Ratings of 1 to 3 stars are routed to a private feedback form so your team can resolve the issue directly.'
              },
              {
                q: "Is this compliant with Google's review policies?",
                a: "Yes. Review Manager helps facilitate customer experience collection. We encourage positive feedback organically while offering a private channel for customer service recovery, ensuring you listen to all customers."
              },
              {
                q: 'Can I customize the branding and QR code?',
                a: 'Absolutely. You can customize the logos, colors, background styles, and feedback questions to match your brand look and feel.'
              },
              {
                q: 'How do email alerts work?',
                a: "Whenever a customer leaves a private negative review, your team receives an instant email notification containing their comments and contact details, enabling rapid resolution."
              }
            ].map((item, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', transition: 'all 0.2s', textAlign: 'left' }}>
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    style={{ width: '100%', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', outline: 'none' }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 600, color: '#202124' }}>{item.q}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  <div style={{ maxHeight: isOpen ? 200 : 0, transition: 'max-height 0.25s ease-out', overflow: 'hidden' }}>
                    <p style={{ margin: 0, padding: '0 24px 24px', fontSize: 14, color: '#5f6368', lineHeight: 1.6 }}>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ── BLOG SECTION ── */}
      <section id="blog" style={{ padding: '88px 32px', background: '#fff' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 14px' }}>Blog & News</p>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px', lineHeight: 1.2 }}>Latest insights & updates.</h2>
            <p style={{ fontSize: 16, color: '#5f6368', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>Read our articles on reputation management, customer experience design, and growth strategy.</p>
          </div>
          <div
            id="certifyied-blog-container"
            data-project-id="1dffc64c-c703-48bc-adfc-5649f4c317b5"
            data-limit="9"
            data-redirect-url={window.location.origin + import.meta.env.BASE_URL.replace(/\/$/, '') + '/blog'}
          ></div>
        </div>
      </section>


      {/* ── FINAL CTA ── */}
      <section style={{ padding: '96px 32px', background: BLUE_XLIGHT, textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ width: 40, height: 2, background: '#a8c7fa', margin: '0 auto 44px' }} />
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 14px', lineHeight: 1.2 }}>Listen better. Improve faster.</h2>
          <p style={{ fontSize: 17, fontWeight: 500, color: '#3c4043', margin: '0 0 14px', lineHeight: 1.5 }}>Customer feedback shouldn't sit unread.</p>
          <p style={{ fontSize: 16, color: '#5f6368', lineHeight: 1.75, margin: '0 0 40px' }}>Turn every experience into an opportunity to improve your business.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Btn onClick={() => openModal('started')} large>Get started</Btn>
            <Btn onClick={() => openModal('demo')} outline large>Book a Demo</Btn>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #e8eaed', padding: '28px 32px', background: '#fff' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={LOGO} alt="Review Manager" style={{ height: 32, objectFit: 'contain', opacity: 1 }} />
            <span style={{ fontSize: 13, color: '#9aa0a6', fontWeight: 500 }}>Review Manager</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: '#9aa0a6', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#5f6368'}
                onMouseLeave={e => e.currentTarget.style.color = '#9aa0a6'}>{l}</a>
            ))}
          </div>
          <span style={{ fontSize: 13, color: '#bdc1c6' }}>© 2026 Review Manager</span>
        </div>
      </footer>


      {/* Modal Dialog */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, maxWidth: 440, width: '100%', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.25)', position: 'relative', boxSizing: 'border-box' }} className="rm-fade-up">
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#9aa0a6', lineHeight: 1 }}>&times;</button>
            
            {modalSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: BLUE, fontSize: 24, fontWeight: 'bold' }}>✓</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 10px' }}>Thank you!</h3>
                <p style={{ fontSize: 14, color: '#5f6368', lineHeight: 1.5, margin: 0 }}>We have received your request and will get back to you shortly.</p>
                <button onClick={() => setModalOpen(false)} style={{ marginTop: 24, fontSize: 15, fontWeight: 500, color: '#fff', background: BLUE, border: 'none', cursor: 'pointer', padding: '10px 24px', borderRadius: 100 }}>Close</button>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!modalEmail) return;
                const cleanPhone = modalPhone.replace(/\s+/g, '').replace(/[-\(\)]/g, '');
                const indianPhoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
                if (!indianPhoneRegex.test(cleanPhone)) {
                  setModalError('Please enter a valid 10-digit Indian phone number (e.g. +91 98765 43210).');
                  return;
                }
                setModalSubmitting(true);
                setModalError('');
                try {
                  const subject = modalType === 'demo' ? 'Demo Request' : 'Get Started Request';
                  const message = modalType === 'demo'
                    ? 'Hello! I would like to book a demo of Review Manager.'
                    : 'Hello! I would like to get started with Review Manager.';
                  
                  const res = await fetch('https://bloggfeature.certifyied.workers.dev/adminApiBlog/api/contact?projectId=1dffc64c-c703-48bc-adfc-5649f4c317b5', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      sender_name: modalName || 'Anonymous',
                      sender_email: modalEmail,
                      phone_number: modalPhone || '',
                      subject,
                      message
                    })
                  });
                  if (res.ok) {
                    setModalSuccess(true);
                  } else {
                    const data = await res.json();
                    setModalError(data.error || 'Failed to submit request.');
                  }
                } catch (err) {
                  setModalError('Connection error. Please try again.');
                } finally {
                  setModalSubmitting(false);
                }
              }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
                  Book a Demo
                </h3>
                <p style={{ fontSize: 14, color: '#5f6368', margin: '0 0 24px', lineHeight: 1.4 }}>
                  {modalType === 'demo' 
                    ? 'Enter your details below and we will contact you to schedule a demo.'
                    : 'Enter your details below to create your account and get started.'}
                </p>

                {modalError && (
                  <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', border: '1px solid #fca5a5' }}>
                    {modalError}
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#202124', marginBottom: 6, textAlign: 'left' }}>Name</label>
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={modalName}
                    onChange={e => setModalName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#202124', marginBottom: 6, textAlign: 'left' }}>Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={modalEmail}
                    onChange={e => setModalEmail(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#202124', marginBottom: 6, textAlign: 'left' }}>Phone number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={modalPhone}
                    onChange={e => setModalPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #dadce0', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }}
                  />
                </div>

                <button type="submit" disabled={modalSubmitting} style={{ width: '100%', padding: '12px', background: BLUE, color: '#fff', border: 'none', borderRadius: 100, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' }}>
                  {modalSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}


      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap');

        /* ─── Hero Desktop Grid Styles ─── */
        /* Desktop grid styles overridden by inline flex */

        @keyframes rm-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
        @keyframes rm-fade-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rm-fade-right { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
        @keyframes rm-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .rm-fade-up { animation: rm-fade-up 0.7s cubic-bezier(.22,.68,0,1.2) both; }
        .rm-fade-in-right { animation: rm-fade-right 0.8s 0.2s cubic-bezier(.22,.68,0,1.2) both; }
        .rm-float { animation: rm-float 3.5s ease-in-out infinite; }

        /* ─── Split Sections Styles ─── */
        /* Split grid styles overridden by inline flex */
        @media (max-width: 860px) {
          .rm-split-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .rm-split-text {
            text-align: center !important;
            align-items: center !important;
          }
          .rm-split-right {
            order: -1 !important;
          }
        }

        /* ─── Interactive Flow Mobile Stacking ─── */
        @media (max-width: 860px) {
          .rm-interactive-flow {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }

        @media (max-width: 860px) {
          .rm-nav-links { display: none !important; }
        }

        /* ─── Tablet / Mobile ─── */
        @media (max-width: 860px) {
          /* Hero: stack, center text */
          .rm-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            text-align: center !important;
          }
          .rm-hero-grid > div:first-child { order: 1; padding-bottom: 36px; }
          .rm-hero-grid > div:first-child > div { justify-content: center !important; }
          .rm-hero-grid > div:first-child p { margin-left: auto; margin-right: auto; }
          .rm-hero-grid > div:last-child { order: 2; }
          .rm-badge { display: none !important; }

          /* Steps: 2-col then 1-col */
          .rm-steps-grid { grid-template-columns: 1fr 1fr !important; gap: 40px !important; }
          .rm-steps-line { display: none !important; }
          .rm-step-card { text-align: center !important; }
          .rm-step-arrow { display: flex !important; }

          /* Built for every business: stack + center */
          .rm-biz-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .rm-biz-text { text-align: center !important; }
          .rm-biz-text > div { justify-content: center !important; }
          .rm-biz-list { max-width: 400px; margin: 0 auto; width: 100%; }

          /* Reduce section horizontal padding */
          section { padding-left: 20px !important; padding-right: 20px !important; }
        }

        @media (max-width: 540px) {
          /* Steps: single column on small phones */
          .rm-steps-grid { grid-template-columns: 1fr !important; }
          .rm-step-arrow { display: flex !important; }

          /* Hamburger */
          .rm-hamburger { display: flex !important; }
          .rm-nav-signin { display: none !important; }

          /* Hero buttons: stack full width */
          .rm-hero-grid > div:first-child > div[style] {
            flex-direction: column !important;
            align-items: center !important;
          }
          .rm-hero-grid > div:first-child > div > * {
            width: 100%;
            max-width: 280px;
            text-align: center;
          }

          /* CTA buttons: stack */
          section > div > div[style*="justify-content: center"] {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
