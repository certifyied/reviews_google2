import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const LOGO = `${import.meta.env.BASE_URL}image.png`;
const BLUE = '#1a73e8';
const BLUE_DARK = '#1557b0';
const BLUE_LIGHT = '#e8f0fe';

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

const industryData: Record<string, {
  name: string;
  headline: string;
  subline: string;
  benefits: string[];
  ctaText: string;
}> = {
  restaurants: {
    name: 'Restaurants',
    headline: 'Boost bookings and protect your dining reputation.',
    subline: 'Collect immediate guest reviews on service and food quality. Catch bad dining experiences privately before they hit TripAdvisor or Google.',
    benefits: [
      'QR code table stands for instant dining feedback.',
      'Auto-copy reviews so customers post positive drafts in seconds.',
      'Send kitchen alerts when negative food reviews are captured privately.'
    ],
    ctaText: 'Get Started for Restaurants'
  },
  clinics: {
    name: 'Clinics & Healthcare',
    headline: 'Build trust with patients through secure feedback.',
    subline: 'Listen to patient satisfaction securely. Improve clinic operations and doctor ratings while maintaining secure communication.',
    benefits: [
      'Patient feedback collection via SMS/Email post-visit.',
      'Divert private complaints directly to clinical directors.',
      'Improve local search ranking to attract more patients.'
    ],
    ctaText: 'Get Started for Clinics'
  },
  hotels: {
    name: 'Hotels & Hospitality',
    headline: 'Increase guest occupancy with exceptional scores.',
    subline: 'Guide guests to leave positive Google and Booking.com ratings. Handle guest service issues privately during their stay.',
    benefits: [
      'Front desk QR codes for checkout satisfaction capture.',
      'Real-time staff alerts to resolve guest issues before checkout.',
      'Analyze seasonal experience patterns across departments.'
    ],
    ctaText: 'Get Started for Hotels'
  },
  salons: {
    name: 'Salons & Spas',
    headline: 'Fill your appointment calendar with client trust.',
    subline: 'Make sure your highly-rated stylings stand out. Capture feedback right at the counter to build local business authority.',
    benefits: [
      'Instant post-treatment review requests.',
      'Highlight top stylist ratings on your social feeds.',
      'Understand service quality patterns dynamically.'
    ],
    ctaText: 'Get Started for Salons'
  },
  retail: {
    name: 'Retail Stores',
    headline: 'Turn shoppers into promoters in-store and online.',
    subline: 'Engage customers as they complete checkout. Build local organic search rankings for your brick-and-mortar storefronts.',
    benefits: [
      'Receipt-linked feedback prompts.',
      'Monitor store-by-store manager performance.',
      'Improve product selection based on direct feedback.'
    ],
    ctaText: 'Get Started for Retail'
  },
  automotive: {
    name: 'Automotive Services',
    headline: 'Drive service bay bookings with high-trust ratings.',
    subline: 'Mechanic and service center reviews. Collect transparent customer service feedback to build long-term local trust.',
    benefits: [
      'Vehicle collection SMS review triggers.',
      'Private complaint management for service advisor resolution.',
      'Boost Google Map rankings for local tow and repair queries.'
    ],
    ctaText: 'Get Started for Auto Centers'
  },
  'local-businesses': {
    name: 'Local Businesses',
    headline: 'Dominate local search rankings by getting consistent reviews.',
    subline: 'Grow your plumbing, electrical, or law firm reviews. Collect feedback in the field immediately upon job completion.',
    benefits: [
      'Field service app integrations for instant review prompts.',
      'Protect your hard-earned local service reputation.',
      'Analyze job feedback to optimize team performance.'
    ],
    ctaText: 'Get Started for Local Business'
  }
};

export default function IndustryPage() {
  const { industryId } = useParams<{ industryId: string }>();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goToLogin = () => navigate('/login');

  const openModal = () => {
    setModalOpen(true);
    setModalName('');
    setModalEmail('');
    setModalPhone('');
    setModalSuccess(false);
    setModalError('');
  };

  const data = industryData[industryId || ''] || industryData['local-businesses'];

  return (
    <div style={{ fontFamily: "'Google Sans', Roboto, 'Helvetica Neue', Arial, sans-serif", background: '#fff', color: '#202124', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.97)', borderBottom: '1px solid #e8eaed', boxShadow: scrolled ? '0 1px 6px rgba(0,0,0,0.08)' : 'none', transition: 'box-shadow 0.2s', padding: '0 32px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <a href={import.meta.env.BASE_URL} style={{ display: 'flex', alignItems: 'center', gap: 0, textDecoration: 'none' }}>
            <img src={LOGO} alt="Logo" style={{ height: 38, objectFit: 'contain' }} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Btn onClick={goToLogin}>Login</Btn>
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
              Login
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 130, paddingBottom: 80, paddingLeft: 32, paddingRight: 32 }}>
        <div className="rm-hero-grid" style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 64, alignItems: 'center' }}>
          
          <div className="rm-fade-up">
            <span style={{ fontSize: 13, fontWeight: 600, color: BLUE, textTransform: 'uppercase', letterSpacing: 2, display: 'block', marginBottom: 16 }}>
              Review Manager for {data.name}
            </span>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-1.5px', color: '#202124', margin: '0 0 20px' }}>
              {data.headline}
            </h1>
            <p style={{ fontSize: 'clamp(16px, 1.5vw, 18px)', color: '#5f6368', lineHeight: 1.7, margin: '0 0 36px' }}>
              {data.subline}
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Btn onClick={openModal} large>{data.ctaText}</Btn>
              <Btn onClick={() => navigate('/')} outline large>Explore All Features</Btn>
            </div>
          </div>

          <div className="rm-fade-in-right">
            <img 
              src={`${import.meta.env.BASE_URL}review_dashboard_mockup.png`} 
              alt="Dashboard Mockup" 
              style={{ width: '100%', height: 'auto', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.1)', border: '1px solid #e8eaed' }} 
            />
          </div>

        </div>
      </section>

      {/* ── BENEFITS SECTION ── */}
      <section style={{ padding: '80px 32px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 12px' }}>
              Industry Benefits
            </h2>
            <p style={{ fontSize: 16, color: '#5f6368', margin: 0 }}>
              Tailored experience management solutions specifically engineered for {data.name.toLowerCase()}.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {data.benefits.map((b, idx) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 32, textAlign: 'left' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: BLUE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p style={{ margin: 0, fontSize: 15, color: '#202124', fontWeight: 500, lineHeight: 1.6 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #e8eaed', padding: '28px 32px', background: '#fff', marginTop: 'auto' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={LOGO} alt="Logo" style={{ height: 32, objectFit: 'contain', opacity: 1 }} />
            <span style={{ fontSize: 13, color: '#9aa0a6', fontWeight: 500 }}>Review Manager</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy','Terms','Contact'].map(l => (
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
          <div style={{ background: '#fff', borderRadius: 16, maxWidth: 440, width: '100%', padding: '32px', boxShadow: '0 10px 40px rgba(0,0,0,0.25)', position: 'relative', boxSizing: 'border-box' }}>
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
                  const subject = `Demo Request (${data.name})`;
                  const message = `Hello! I would like to book a demo of Review Manager for the ${data.name} industry.`;
                  
                  const res = await fetch('https://bloggfeature.certifyied.workers.dev/adminApiBlog/api/contact?projectId=1dffc64c-c703-48bc-adfc-5649f4c317b5', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      sender_name: modalName || 'Anonymous',
                      sender_email: modalEmail,
                      phone_number: modalPhone,
                      subject,
                      message
                    })
                  });
                  if (res.ok) {
                    setModalSuccess(true);
                  } else {
                    const resData = await res.json();
                    setModalError(resData.error || 'Failed to submit request.');
                  }
                } catch (err) {
                  setModalError('Connection error. Please try again.');
                } finally {
                  setModalSubmitting(false);
                }
              }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.5px' }}>Book a Demo</h3>
                <p style={{ fontSize: 14, color: '#5f6368', margin: '0 0 24px', lineHeight: 1.4 }}>
                  Enter your details below and we will contact you to schedule an industry-specific demo.
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

                <button type="submit" disabled={modalSubmitting} style={{ width: '100%', padding: '12px', background: BLUE, color: '#fff', border: 'none', borderRadius: 100, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  {modalSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes rm-fade-up { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes rm-fade-right { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
        .rm-fade-up { animation: rm-fade-up 0.7s cubic-bezier(.22,.68,0,1.2) both; }
        .rm-fade-in-right { animation: rm-fade-right 0.8s 0.2s cubic-bezier(.22,.68,0,1.2) both; }
        @media (max-width: 860px) {
          .rm-hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; text-align: center !important; }
          .rm-hero-grid > div:first-child > div { justify-content: center !important; }
          .rm-hamburger { display: flex !important; }
        }
      `}</style>

    </div>
  );
}
