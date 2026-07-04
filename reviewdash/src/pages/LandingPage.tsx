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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const industries = ['Restaurants.', 'Clinics.', 'Hotels.', 'Salons.', 'Retail.', 'Automotive.', 'Local businesses.'];

  const steps = [
    {
      n: '01', title: 'Customer shares their experience',
      desc: 'They rate their visit through a simple, branded link or QR code — no app needed.',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
    {
      n: '02', title: 'Review Manager routes it intelligently',
      desc: 'High ratings are guided to Google. Lower ratings are captured privately for your team.',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
    },
    {
      n: '03', title: 'Bad reviews never go public',
      desc: 'Unhappy customers share privately. You get the feedback. Google never sees a bad review.',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    },
    {
      n: '04', title: 'Track everything in one dashboard',
      desc: 'Ratings, reviews, feedback and insights — organised so your team can act fast.',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    },
  ];

  return (
    <div style={{ fontFamily: "'Google Sans', Roboto, 'Helvetica Neue', Arial, sans-serif", background: '#fff', color: '#202124', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.97)', borderBottom: '1px solid #e8eaed', boxShadow: scrolled ? '0 1px 6px rgba(0,0,0,0.08)' : 'none', transition: 'box-shadow 0.2s', padding: '0 32px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <a href={import.meta.env.BASE_URL} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src={LOGO} alt="Review Manager" style={{ height: 28, objectFit: 'contain' }} />
            <span style={{ fontSize: 16, fontWeight: 600, color: '#202124', letterSpacing: '-0.2px' }}>Review Manager</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={goToLogin} className="rm-nav-signin"
              style={{ fontSize: 14, fontWeight: 500, color: BLUE, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: 100, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = BLUE_LIGHT}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              Sign in
            </button>
            <Btn onClick={goToLogin}>Get started</Btn>
            <button onClick={() => setMenuOpen(!menuOpen)} className="rm-hamburger"
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2">
                {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ borderTop: '1px solid #e8eaed', padding: '16px 20px 24px' }}>
            <button onClick={() => { goToLogin(); setMenuOpen(false); }}
              style={{ width: '100%', fontSize: 15, fontWeight: 600, color: '#fff', background: BLUE, border: 'none', cursor: 'pointer', padding: '13px', borderRadius: 100 }}>
              Sign in / Get started
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 100, paddingBottom: 80, paddingLeft: 32, paddingRight: 32 }}>
        <div className="rm-hero-grid" style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>

          {/* Left: text */}
          <div className="rm-fade-up" style={{ textAlign: 'left' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: BLUE_LIGHT, borderRadius: 100, padding: '6px 14px', marginBottom: 24 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: '#34a853', animation: 'rm-pulse 2s infinite' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: BLUE }}>Now live for UK businesses</span>
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-2px', color: '#202124', margin: '0 0 22px' }}>
              Your reputation.<br /><span style={{ color: BLUE }}>Managed.</span>
            </h1>
            <p style={{ fontSize: 'clamp(16px, 1.6vw, 18px)', color: '#5f6368', lineHeight: 1.75, maxWidth: 420, margin: '0 0 36px' }}>
              Collect customer feedback, understand every experience and build a stronger online reputation.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Btn onClick={goToLogin} large>Get started</Btn>
              <Btn href="mailto:contact@certifyied.com?subject=Demo%20Request" outline large>Book a Demo</Btn>
            </div>
          </div>

          {/* Right: dashboard */}
          <div className="rm-fade-in-right" style={{ position: 'relative' }}>
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8eaed', boxShadow: '0 8px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ background: '#f8f9fa', borderBottom: '1px solid #e8eaed', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  {['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: 5, background: c }} />)}
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
                {[{ label:'Overall Rating', value:'4.8', unit:'★', color:'#fbbc05' }, { label:'Total Reviews', value:'1,284', unit:'', color:BLUE }, { label:'To Google', value:'81%', unit:'', color:'#34a853' }, { label:'Private', value:'243', unit:'', color:'#ea4335' }].map((s,i) => (
                  <div key={i} style={{ background: '#fff', padding: '13px 16px' }}>
                    <p style={{ margin: '0 0 3px', fontSize: 11, color: '#9aa0a6', fontWeight: 500 }}>{s.label}</p>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: s.color, letterSpacing: '-0.5px' }}>{s.value}<span style={{ fontSize: 13 }}>{s.unit}</span></p>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 18px' }}>
                <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 600, color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: 1 }}>Recent Feedback</p>
                {[{ init:'PK', text:'Loved the service! Will come back.', stars:5, tag:'Google', tc:BLUE }, { init:'AM', text:'Wait time was a bit long overall.', stars:3, tag:'Private', tc:'#ea4335' }, { init:'RS', text:'Very professional team, great work!', stars:5, tag:'Google', tc:BLUE }].map((f,i) => (
                  <div key={i} style={{ display: 'flex', gap: 9, padding: '8px 0', borderBottom: i<2?'1px solid #f1f3f4':'none', alignItems: 'flex-start' }}>
                    <div style={{ width: 24, height: 24, borderRadius: 12, background: BLUE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: BLUE, flexShrink: 0 }}>{f.init}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: 10, color: '#fbbc05' }}>{'★'.repeat(f.stars)}</span>
                        <span style={{ fontSize: 9, fontWeight: 600, color: f.tc, background: f.tc+'15', padding: '1px 6px', borderRadius: 100 }}>{f.tag}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 11, color: '#5f6368', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Floating badges — hidden on mobile via CSS */}
            <div className="rm-badge rm-float" style={{ position: 'absolute', bottom: -14, left: -18, background: '#fff', borderRadius: 10, padding: '9px 13px', border: '1px solid #e8eaed', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: 15, background: BLUE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill={BLUE}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <div><p style={{ margin:0, fontSize:12, fontWeight:700, color:'#202124' }}>4.8 avg rating</p><p style={{ margin:0, fontSize:10, color:'#9aa0a6' }}>+0.4 this month</p></div>
            </div>
            <div className="rm-badge" style={{ position: 'absolute', top: -13, right: -14, background: '#fff', borderRadius: 9, padding: '8px 12px', border: '1px solid #e8eaed', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 7, height: 7, borderRadius: 4, background: '#34a853', animation: 'rm-pulse 2s infinite' }} />
              <p style={{ margin:0, fontSize:11, fontWeight:600, color:'#202124' }}>New review on Google</p>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#e8eaed', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── HOW IT WORKS (Everything in one place) — stepped flow ── */}
      <section id="how-it-works" style={{ padding: '88px 32px', background: '#f8faff' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 14px' }}>How it works</p>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px', lineHeight: 1.2 }}>Everything in one place.</h2>
            <p style={{ fontSize: 17, color: '#5f6368', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 36px' }}>One platform. Every customer experience. From the moment they rate to the moment you act.</p>
            <Btn onClick={goToLogin}>Get started</Btn>
          </div>

          {/* Steps grid */}
          <div className="rm-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, position: 'relative' }}>
            {/* Connector line — desktop only */}
            <div className="rm-steps-line" style={{ position: 'absolute', top: 28, left: '12.5%', right: '12.5%', height: 2, background: `linear-gradient(90deg, ${BLUE}, #34a853)`, zIndex: 0 }} />

            {steps.map((step, i) => (
              <div key={i} className="rm-step-card" style={{ padding: '0 16px 0', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                {/* Number circle */}
                <div style={{ width: 56, height: 56, borderRadius: 28, background: i === steps.length - 1 ? '#34a853' : BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 4px 16px ${i === steps.length-1 ? 'rgba(52,168,83,0.3)' : 'rgba(26,115,232,0.3)'}`, border: '4px solid #f8faff' }}>
                  {step.icon}
                </div>
                {/* Connector dot for mobile */}
                {i < steps.length - 1 && (
                  <div className="rm-step-arrow" style={{ display: 'none', justifyContent: 'center', margin: '8px 0' }}>
                    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="#bdc1c6" strokeWidth="1.5" strokeLinecap="round"><line x1="6" y1="0" x2="6" y2="16"/><polyline points="1 11 6 16 11 11"/></svg>
                  </div>
                )}
                <p style={{ fontSize: 11, fontWeight: 700, color: BLUE, margin: '0 0 8px', letterSpacing: 1.5, textTransform: 'uppercase' }}>Step {step.n}</p>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#202124', margin: '0 0 10px', lineHeight: 1.3 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: '#5f6368', lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#e8eaed', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── SECTION: Make reviewing easier ── */}
      <section style={{ padding: '88px 32px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 14px' }}>For your customers</p>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px', lineHeight: 1.2 }}>Make reviewing easier.</h2>
          <p style={{ fontSize: 17, fontWeight: 600, color: '#3c4043', margin: '0 0 14px', lineHeight: 1.5 }}>A little help finding the right words.</p>
          <p style={{ fontSize: 16, color: '#5f6368', lineHeight: 1.75, margin: '0 0 14px' }}>Your customers know how they feel. Sometimes, they just don't know what to write.</p>
          <p style={{ fontSize: 16, color: '#5f6368', lineHeight: 1.75, margin: '0 0 10px' }}>Review Manager helps customers express their genuine experience clearly and naturally.</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#202124', margin: '0 0 32px' }}>Simple. Helpful. Human.</p>
          <Btn onClick={goToLogin}>Get started</Btn>
          <div style={{ background: BLUE_XLIGHT, borderRadius: 20, padding: '32px', border: '1px solid #c5d8fd', marginTop: 52, textAlign: 'left' }}>
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
              {[1,2,3,4,5].map(s => <svg key={s} width="26" height="26" viewBox="0 0 24 24" fill="#fbbc05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#e8eaed', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── SECTION: Feedback that helps you improve ── */}
      <section style={{ padding: '88px 32px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 14px' }}>For your team</p>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px', lineHeight: 1.2 }}>Feedback that helps you improve.</h2>
          <p style={{ fontSize: 17, fontWeight: 600, color: '#3c4043', margin: '0 0 14px', lineHeight: 1.5 }}>Understand what your customers love—and where you can do better.</p>
          <p style={{ fontSize: 16, color: '#5f6368', lineHeight: 1.75, margin: '0 0 32px' }}>Private feedback is organised in one simple dashboard, so your team can listen, act and improve.</p>
          <Btn onClick={goToLogin}>Get started</Btn>
          <div style={{ background: '#fff', borderRadius: 20, padding: '24px', border: '1px solid #e8eaed', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginTop: 52, textAlign: 'left' }}>
            <p style={{ fontSize: 12, color: '#9aa0a6', margin: '0 0 16px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Private feedback dashboard</p>
            {[{ initials:'AM', note:'Waiting time was a bit long but overall great experience.', stars:3, time:'2h ago' }, { initials:'PK', note:'Loved the service! Will definitely come back.', stars:5, time:'5h ago' }, { initials:'RS', note:'Good quality but reception could be friendlier.', stars:3, time:'Yesterday' }].map((item,i) => (
              <div key={i} style={{ display:'flex', gap:12, padding:'12px 0', borderBottom:i<2?'1px solid #f1f3f4':'none' }}>
                <div style={{ width:34, height:34, borderRadius:17, background:BLUE_LIGHT, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:BLUE, flexShrink:0 }}>{item.initials}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:13, color:'#fbbc05' }}>{'★'.repeat(item.stars)}{'☆'.repeat(5-item.stars)}</span>
                    <span style={{ fontSize:12, color:'#bdc1c6' }}>{item.time}</span>
                  </div>
                  <p style={{ margin:0, fontSize:13, color:'#5f6368', lineHeight:1.5 }}>{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: '#e8eaed', maxWidth: 1080, margin: '0 auto' }} />

      {/* ── SECTION: Built for every business ── */}
      <section style={{ padding: '88px 32px' }}>
        <div className="rm-biz-grid" style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

          {/* Left: text */}
          <div className="rm-biz-text" style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 14px' }}>Every industry</p>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 20px', lineHeight: 1.2 }}>Built for every business.</h2>
            <p style={{ fontSize: 16, color: '#5f6368', lineHeight: 1.75, margin: '0 0 36px' }}>If customers have an experience, Review Manager can help you understand it — whatever your industry.</p>
            <Btn onClick={goToLogin}>Get started</Btn>
          </div>

          {/* Right: industry list */}
          <div className="rm-biz-list">
            {industries.map((name, i) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: i < industries.length - 1 ? '1px solid #e8eaed' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'padding-left 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.paddingLeft = '8px'}
                onMouseLeave={e => e.currentTarget.style.paddingLeft = '0'}>
                <span style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700, color: '#202124', letterSpacing: '-0.5px' }}>{name}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#bdc1c6" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            ))}
          </div>
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
            <Btn onClick={goToLogin} large>Get started</Btn>
            <Btn href="mailto:contact@certifyied.com?subject=Demo%20Request" outline large>Book a Demo</Btn>
          </div>
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
            {['Privacy','Terms','Contact'].map(l => (
              <a key={l} href="#" style={{ fontSize: 13, color: '#9aa0a6', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#5f6368'}
                onMouseLeave={e => e.currentTarget.style.color = '#9aa0a6'}>{l}</a>
            ))}
          </div>
          <span style={{ fontSize: 13, color: '#bdc1c6' }}>© 2026 Certifyied</span>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap');

        @keyframes rm-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.3)} }
        @keyframes rm-fade-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rm-fade-right { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
        @keyframes rm-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .rm-fade-up { animation: rm-fade-up 0.7s cubic-bezier(.22,.68,0,1.2) both; }
        .rm-fade-in-right { animation: rm-fade-right 0.8s 0.2s cubic-bezier(.22,.68,0,1.2) both; }
        .rm-float { animation: rm-float 3.5s ease-in-out infinite; }

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
