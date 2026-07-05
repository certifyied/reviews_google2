import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LOGO = `${import.meta.env.BASE_URL}image.png`;
const BLUE = '#1a73e8';
const BLUE_LIGHT = '#e8f0fe';
const BLUE_DARK = '#1557b0';

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

export default function BlogPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const goToLogin = () => navigate('/login');

  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState('');

  const openModal = () => {
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

    // Dynamically load the blog embed script
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

  return (
    <div style={{ fontFamily: "'Google Sans', Roboto, 'Helvetica Neue', Arial, sans-serif", background: '#fff', color: '#202124', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.97)', borderBottom: '1px solid #e8eaed', boxShadow: scrolled ? '0 1px 6px rgba(0,0,0,0.08)' : 'none', transition: 'box-shadow 0.2s', padding: '0 32px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
                    <a href={import.meta.env.BASE_URL} style={{ display: 'flex', alignItems: 'center', gap: 0, textDecoration: 'none', flexShrink: 0 }}>
            <img src={LOGO} alt="Logo" style={{ height: 38, objectFit: 'contain' }} />
          </a>
          
          {/* Middle Navigation Links */}
          <div className="rm-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href={import.meta.env.BASE_URL + "#how-it-works"} style={{ fontSize: 14, fontWeight: 500, color: '#5f6368', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = BLUE} onMouseLeave={e => e.currentTarget.style.color = '#5f6368'}>How it works</a>
            <a href={import.meta.env.BASE_URL + "#faq"} style={{ fontSize: 14, fontWeight: 500, color: '#5f6368', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = BLUE} onMouseLeave={e => e.currentTarget.style.color = '#5f6368'}>FAQ</a>
            <a href={import.meta.env.BASE_URL + "#blog"} style={{ fontSize: 14, fontWeight: 500, color: '#5f6368', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = BLUE} onMouseLeave={e => e.currentTarget.style.color = '#5f6368'}>Blog</a>
            <a href="#" onClick={(e) => { e.preventDefault(); openModal(); }} style={{ fontSize: 14, fontWeight: 500, color: '#5f6368', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = BLUE} onMouseLeave={e => e.currentTarget.style.color = '#5f6368'}>Contact</a>
            <a href="#" style={{ fontSize: 14, fontWeight: 500, color: '#5f6368', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = BLUE} onMouseLeave={e => e.currentTarget.style.color = '#5f6368'}>Privacy Policy</a>
            <a href="#" style={{ fontSize: 14, fontWeight: 500, color: '#5f6368', textDecoration: 'none', transition: 'color 0.15s' }} onMouseEnter={e => e.currentTarget.style.color = BLUE} onMouseLeave={e => e.currentTarget.style.color = '#5f6368'}>Terms</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
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
          <div style={{ borderTop: '1px solid #e8eaed', padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <a href={import.meta.env.BASE_URL + "#how-it-works"} onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: '#202124', textDecoration: 'none' }}>How it works</a>
            <a href={import.meta.env.BASE_URL + "#faq"} onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: '#202124', textDecoration: 'none' }}>FAQ</a>
            <a href={import.meta.env.BASE_URL + "#blog"} onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: '#202124', textDecoration: 'none' }}>Blog</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); openModal(); }} style={{ fontSize: 15, fontWeight: 500, color: '#202124', textDecoration: 'none' }}>Contact</a>
            <a href="#" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: '#202124', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" onClick={() => setMenuOpen(false)} style={{ fontSize: 15, fontWeight: 500, color: '#202124', textDecoration: 'none' }}>Terms</a>
            <button onClick={() => { goToLogin(); setMenuOpen(false); }}
              style={{ width: '100%', fontSize: 15, fontWeight: 600, color: '#fff', background: BLUE, border: 'none', cursor: 'pointer', padding: '13px', borderRadius: 100, marginTop: 8 }}>
              Login
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: 100, paddingBottom: 80, paddingLeft: 20, paddingRight: 20, maxWidth: 1080, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div id="certifyied-blog-post" data-project-id="1dffc64c-c703-48bc-adfc-5649f4c317b5"></div>
      </main>

      {/* Footer */}
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
                  const res = await fetch('https://bloggfeature.certifyied.workers.dev/adminApiBlog/api/contact?projectId=1dffc64c-c703-48bc-adfc-5649f4c317b5', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      sender_name: modalName || 'Anonymous',
                      sender_email: modalEmail,
                      phone_number: modalPhone,
                      subject: 'Demo Request (Blog)',
                      message: 'Hello! I would like to book a demo of Review Manager.'
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
                <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.5px' }}>Book a Demo</h3>
                <p style={{ fontSize: 14, color: '#5f6368', margin: '0 0 24px', lineHeight: 1.4 }}>
                  Enter your details below and we will contact you to schedule a demo.
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
                  Submit Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
