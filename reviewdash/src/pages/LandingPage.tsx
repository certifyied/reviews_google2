import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(f => (f + 1) % features.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 28, height: 28 }}>
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Capture Every Experience',
      desc: 'A frictionless Google-replica funnel that intercepts every customer interaction — turning service moments into review opportunities.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 28, height: 28 }}>
          <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Real-Time Analytics',
      desc: 'Understand your reputation at a glance. Track ratings, submission trends, and diverted feedback from a single clean dashboard.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 28, height: 28 }}>
          <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'AI-Powered Suggestions',
      desc: 'Our AI generates contextual review templates based on your business keywords — making it effortless for happy customers to leave detailed reviews.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 28, height: 28 }}>
          <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Negative Feedback Shield',
      desc: 'Smart diversion routes unhappy customers to a private internal form — protecting your public reputation while you resolve issues privately.',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Share Your Link',
      desc: 'Generate a branded review funnel link and share it via WhatsApp, QR code, email, or any channel.',
    },
    {
      step: '02',
      title: 'Customer Rates You',
      desc: 'Customers see a clean Google-style interface and tap their star rating — no app download needed.',
    },
    {
      step: '03',
      title: 'Smart Routing',
      desc: '4+ stars go straight to Google with an AI-generated draft ready to paste. 3 and below stay private.',
    },
    {
      step: '04',
      title: 'Track Everything',
      desc: 'Monitor all feedback, analyse trends, and manage your configuration from the dashboard in real time.',
    },
  ];

  const testimonials = [
    {
      name: 'Ravi Sharma',
      role: 'Restaurant Owner, Bengaluru',
      quote: 'Within 3 weeks we went from 4.1 to 4.7 stars on Google. The diversion feature alone saved us from several bad reviews going public.',
      avatar: 'RS',
    },
    {
      name: 'Priya Nair',
      role: 'Salon Manager, Kochi',
      quote: 'Extremely easy to use. We share the QR code at checkout and customers love the smooth experience. Our review count tripled.',
      avatar: 'PN',
    },
    {
      name: 'Arun Menon',
      role: 'Clinic Director, Chennai',
      quote: 'The AI suggestions are brilliant. Patients who would normally not know what to write now leave detailed, genuine reviews.',
      avatar: 'AM',
    },
  ];

  return (
    <div style={{ fontFamily: "'Google Sans', Roboto, Arial, sans-serif", background: '#fff', color: '#202124', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        borderBottom: scrolled ? '1px solid #e8eaed' : '1px solid transparent',
        transition: 'all 0.25s ease',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="./image.png" alt="Certifyied" style={{ height: 32, objectFit: 'contain' }} />
            <span style={{ fontSize: 17, fontWeight: 600, color: '#202124', letterSpacing: '-0.3px' }}>
              Certifyied <span style={{ color: '#467222' }}>Reviews</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="nav-links">
            {['Features', 'How it works', 'Pricing'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/ /g, '-')}`} style={{ fontSize: 14, color: '#5f6368', textDecoration: 'none', fontWeight: 500, transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#202124')}
                onMouseLeave={e => (e.currentTarget.style.color = '#5f6368')}>
                {label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/login')}
              style={{ fontSize: 14, fontWeight: 500, color: '#467222', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: 100 }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f0f4ef')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{ fontSize: 14, fontWeight: 500, color: '#fff', background: '#467222', border: 'none', cursor: 'pointer', padding: '9px 22px', borderRadius: 100, boxShadow: '0 1px 3px rgba(70,114,34,0.3)', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#3a5f1d')}
              onMouseLeave={e => (e.currentTarget.style.background = '#467222')}
            >
              Get started
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-hamburger"
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2">
                {menuOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: '#fff', borderTop: '1px solid #e8eaed', padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['Features', 'How it works', 'Pricing'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/ /g, '-')}`}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: 15, color: '#202124', textDecoration: 'none', fontWeight: 500 }}>
                {label}
              </a>
            ))}
            <button onClick={() => { navigate('/login'); setMenuOpen(false); }} style={{ fontSize: 15, fontWeight: 600, color: '#fff', background: '#467222', border: 'none', cursor: 'pointer', padding: '12px', borderRadius: 100, marginTop: 8 }}>
              Sign in / Get started
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle gradient blob */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse at center, rgba(70,114,34,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          {/* Product badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0f4ef', border: '1px solid #d0e0c8', borderRadius: 100, padding: '6px 16px', marginBottom: 32, fontSize: 13, fontWeight: 500, color: '#467222' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#467222"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
            Now with AI-powered review suggestions
          </div>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 28 }}>
            <img src="./image.png" alt="Certifyied Reviews" style={{ height: 48, objectFit: 'contain' }} />
            <span style={{ fontSize: 22, fontWeight: 600, color: '#202124', letterSpacing: '-0.5px' }}>Certifyied Reviews</span>
          </div>

          {/* Main headline */}
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 700, lineHeight: 1.12, letterSpacing: '-1.5px', color: '#202124', margin: '0 0 24px' }}>
            Your reputation.{' '}
            <span style={{ color: '#467222' }}>Managed.</span>
          </h1>

          {/* Subline */}
          <p style={{ fontSize: 'clamp(17px, 2.5vw, 20px)', color: '#5f6368', lineHeight: 1.6, maxWidth: 540, margin: '0 auto 40px', fontWeight: 400 }}>
            Collect customer feedback, understand every experience and build a stronger online reputation — on autopilot.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/login')}
              style={{ fontSize: 16, fontWeight: 600, color: '#fff', background: '#467222', border: 'none', cursor: 'pointer', padding: '14px 32px', borderRadius: 100, boxShadow: '0 2px 8px rgba(70,114,34,0.35)', transition: 'all 0.18s', letterSpacing: '-0.2px' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#3a5f1d'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(70,114,34,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#467222'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(70,114,34,0.35)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Get started — free
            </button>
            <a
              href="mailto:contact@certifyied.com?subject=Demo%20Request"
              style={{ fontSize: 16, fontWeight: 500, color: '#467222', background: 'none', border: '1.5px solid #c5d9b5', cursor: 'pointer', padding: '13px 28px', borderRadius: 100, textDecoration: 'none', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f0f4ef'; e.currentTarget.style.borderColor = '#467222'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = '#c5d9b5'; }}
            >
              Book a Demo
            </a>
          </div>

          {/* Social proof */}
          <p style={{ fontSize: 13, color: '#9aa0a6', marginTop: 28 }}>
            Trusted by 500+ businesses across India &nbsp;·&nbsp; No credit card required
          </p>
        </div>

        {/* Hero product screenshot mockup */}
        <div style={{ marginTop: 72, maxWidth: 860, width: '100%', position: 'relative' }}>
          {/* Browser chrome mock */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8eaed', boxShadow: '0 24px 64px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            {/* Browser bar */}
            <div style={{ background: '#f8f9fa', padding: '12px 16px', borderBottom: '1px solid #e8eaed', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, background: '#ff5f57' }} />
                <div style={{ width: 12, height: 12, borderRadius: 6, background: '#ffbd2e' }} />
                <div style={{ width: 12, height: 12, borderRadius: 6, background: '#28c840' }} />
              </div>
              <div style={{ flex: 1, background: '#fff', borderRadius: 6, padding: '4px 12px', fontSize: 12, color: '#9aa0a6', border: '1px solid #e8eaed', maxWidth: 300, margin: '0 auto' }}>
                reviews-google-eta.vercel.app
              </div>
            </div>
            {/* Fake dashboard content */}
            <div style={{ padding: '32px 28px', background: '#f8fafc', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {[
                { label: 'Overall Rating', value: '4.8 ★', color: '#fbbc05', sub: 'avg across all reviews' },
                { label: 'Total Submissions', value: '1,284', color: '#467222', sub: 'this month +12%' },
                { label: 'Redirected to Google', value: '1,041', color: '#34d399', sub: '81% conversion rate' },
                { label: 'Diverted Privately', value: '243', color: '#f87171', sub: 'resolved internally' },
              ].map((card, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e8eaed', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <p style={{ fontSize: 12, color: '#9aa0a6', margin: '0 0 6px', fontWeight: 500 }}>{card.label}</p>
                  <p style={{ fontSize: 26, fontWeight: 700, color: card.color, margin: '0 0 4px', letterSpacing: '-0.5px' }}>{card.value}</p>
                  <p style={{ fontSize: 11, color: '#bdc1c6', margin: 0 }}>{card.sub}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Floating review card */}
          <div style={{ position: 'absolute', bottom: -20, right: -20, background: '#fff', borderRadius: 14, padding: '14px 18px', border: '1px solid #e8eaed', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', width: 210, display: 'none' }} className="floating-card">
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: '#f0f4ef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#467222', flexShrink: 0 }}>RS</div>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#202124' }}>Ravi Sharma</p>
                <p style={{ margin: '2px 0 6px', fontSize: 11, color: '#fbbc05' }}>★★★★★</p>
                <p style={{ margin: 0, fontSize: 11, color: '#5f6368', lineHeight: 1.5 }}>"Excellent service! Highly recommended."</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#9aa0a6' }}>
          <span style={{ fontSize: 13 }}>Explore features</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '96px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#467222', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Everything you need</p>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px' }}>
              Built for real reputation growth
            </h2>
            <p style={{ fontSize: 18, color: '#5f6368', maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
              Every feature designed to maximise positive reviews while keeping your brand protected.
            </p>
          </div>

          {/* Feature tabs */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            {features.map((f, i) => (
              <button key={i} onClick={() => setActiveFeature(i)} style={{
                padding: '10px 20px', borderRadius: 100, fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                background: activeFeature === i ? '#467222' : '#f1f3f4',
                color: activeFeature === i ? '#fff' : '#5f6368',
                boxShadow: activeFeature === i ? '0 2px 8px rgba(70,114,34,0.3)' : 'none',
              }}>
                {f.title}
              </button>
            ))}
          </div>

          {/* Active feature panel */}
          <div style={{ background: '#f8faf5', borderRadius: 20, padding: '48px', border: '1px solid #e0ecd6', display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 280px' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: '#e8f5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#467222', marginBottom: 24 }}>
                {features[activeFeature].icon}
              </div>
              <h3 style={{ fontSize: 26, fontWeight: 700, color: '#202124', margin: '0 0 16px', letterSpacing: '-0.5px' }}>
                {features[activeFeature].title}
              </h3>
              <p style={{ fontSize: 17, color: '#5f6368', lineHeight: 1.7, margin: '0 0 28px' }}>
                {features[activeFeature].desc}
              </p>
              <button onClick={() => navigate('/login')} style={{ fontSize: 14, fontWeight: 600, color: '#467222', background: 'none', border: '1.5px solid #467222', cursor: 'pointer', padding: '10px 24px', borderRadius: 100, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#467222'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#467222'; }}>
                Try it free →
              </button>
            </div>
            {/* Visual illustration */}
            <div style={{ flex: '1 1 280px', background: '#fff', borderRadius: 16, padding: '32px', border: '1px solid #e0ecd6', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', color: '#c5d9b5' }}>
                <div style={{ fontSize: 72, marginBottom: 16, color: '#467222', opacity: 0.15 }}>
                  {features[activeFeature].icon}
                </div>
                {/* Google review style stars */}
                <div style={{ fontSize: 40, letterSpacing: 4, color: '#fbbc05', marginBottom: 12 }}>★★★★★</div>
                <p style={{ fontSize: 14, color: '#9aa0a6', maxWidth: 220, margin: '0 auto', lineHeight: 1.5 }}>
                  "Excellent service! The team was super professional and efficient."
                </p>
                <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1a73e8', color: '#fff', borderRadius: 100, padding: '8px 16px', fontSize: 13, fontWeight: 500 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                  Continue to Google Review
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '96px 24px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#467222', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Simple process</p>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px' }}>
              Up and running in minutes
            </h2>
            <p style={{ fontSize: 18, color: '#5f6368', maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
              No technical setup. No app install. Just a link that works.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 28 }}>
            {howItWorks.map((step, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '32px 24px', border: '1px solid #e8eaed', position: 'relative', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#467222', marginBottom: 16, letterSpacing: 1 }}>{step.step}</div>
                <div style={{ width: 4, height: 32, background: '#e0ecd6', borderRadius: 2, marginBottom: 16 }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#202124', margin: '0 0 10px', letterSpacing: '-0.3px' }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: '#5f6368', margin: 0, lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '96px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#467222', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Customer stories</p>
            <h2 style={{ fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: 0 }}>
              Businesses that grew their reputation
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: '#f8faf5', borderRadius: 16, padding: '32px', border: '1px solid #e0ecd6', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ fontSize: 22, color: '#fbbc05', letterSpacing: 3 }}>★★★★★</div>
                <p style={{ fontSize: 15, color: '#3c4043', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                  {t.quote}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 20, background: '#467222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#202124' }}>{t.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#9aa0a6' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '96px 24px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#467222', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>Pricing</p>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px' }}>
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: 18, color: '#5f6368', marginBottom: 56, lineHeight: 1.6 }}>
            No hidden fees. Start free and scale as you grow.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              { name: 'Starter', price: 'Free', desc: 'Perfect for small businesses getting started.', features: ['1 business location', 'Up to 100 reviews/mo', 'Basic analytics', 'Google redirect funnel'], cta: 'Get started free', primary: false },
              { name: 'Pro', price: '₹2,499/mo', desc: 'For growing businesses that need more power.', features: ['Up to 5 locations', 'Unlimited reviews', 'AI suggestions', 'Advanced analytics', 'Priority support'], cta: 'Start free trial', primary: true },
              { name: 'Enterprise', price: 'Custom', desc: 'For agencies and large multi-location groups.', features: ['Unlimited locations', 'White-label portal', 'API access', 'Dedicated manager', 'SLA guarantee'], cta: 'Contact sales', primary: false },
            ].map((plan, i) => (
              <div key={i} style={{
                background: plan.primary ? '#467222' : '#fff',
                borderRadius: 20, padding: '36px 28px',
                border: plan.primary ? 'none' : '1px solid #e8eaed',
                boxShadow: plan.primary ? '0 8px 32px rgba(70,114,34,0.3)' : '0 1px 4px rgba(0,0,0,0.04)',
                textAlign: 'left',
                position: 'relative',
              }}>
                {plan.primary && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#fbbc05', color: '#202124', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100, letterSpacing: 1 }}>MOST POPULAR</div>}
                <p style={{ fontSize: 14, fontWeight: 600, color: plan.primary ? 'rgba(255,255,255,0.8)' : '#467222', margin: '0 0 8px', letterSpacing: 0.5 }}>{plan.name}</p>
                <p style={{ fontSize: 32, fontWeight: 700, color: plan.primary ? '#fff' : '#202124', margin: '0 0 8px', letterSpacing: '-1px' }}>{plan.price}</p>
                <p style={{ fontSize: 14, color: plan.primary ? 'rgba(255,255,255,0.7)' : '#9aa0a6', margin: '0 0 28px', lineHeight: 1.5 }}>{plan.desc}</p>
                <ul style={{ listStyle: 'none', margin: '0 0 28px', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map((f, fi) => (
                    <li key={fi} style={{ fontSize: 14, color: plan.primary ? 'rgba(255,255,255,0.9)' : '#3c4043', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={plan.primary ? 'rgba(255,255,255,0.8)' : '#467222'} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/login')} style={{
                  width: '100%', padding: '12px', borderRadius: 100, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'all 0.18s',
                  background: plan.primary ? '#fff' : '#f0f4ef',
                  color: plan.primary ? '#467222' : '#467222',
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '80px 24px', background: '#467222' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#fff', margin: '0 0 16px', letterSpacing: '-0.8px', lineHeight: 1.2 }}>
            Start building a stronger reputation today
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', margin: '0 0 40px', lineHeight: 1.6 }}>
            Join hundreds of businesses turning every customer interaction into a 5-star review.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/login')} style={{ fontSize: 16, fontWeight: 600, color: '#467222', background: '#fff', border: 'none', cursor: 'pointer', padding: '14px 32px', borderRadius: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.15)', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)'; }}>
              Get started — free
            </button>
            <a href="mailto:contact@certifyied.com?subject=Demo%20Request" style={{ fontSize: 16, fontWeight: 500, color: '#fff', border: '1.5px solid rgba(255,255,255,0.5)', cursor: 'pointer', padding: '13px 28px', borderRadius: 100, textDecoration: 'none', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}>
              Book a Demo
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '40px 24px', background: '#202124', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="./image.png" alt="Certifyied" style={{ height: 24, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Certifyied Reviews</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
                {l}
              </a>
            ))}
          </div>
          <p style={{ margin: 0 }}>© 2026 Certifyied. All rights reserved.</p>
        </div>
      </footer>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .floating-card { display: block !important; }
        }
      `}</style>
    </div>
  );
}
