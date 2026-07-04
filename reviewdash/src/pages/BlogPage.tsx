import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LOGO = `${import.meta.env.BASE_URL}image.png`;
const BLUE = '#1a73e8';
const BLUE_LIGHT = '#e8f0fe';

export default function BlogPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const goToLogin = () => navigate('/login');

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
          <a href={import.meta.env.BASE_URL} style={{ display: 'flex', alignItems: 'center', gap: 0, textDecoration: 'none' }}>
            <img src={LOGO} alt="Logo" style={{ height: 38, objectFit: 'contain' }} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={goToLogin}
              style={{ fontSize: 14, fontWeight: 500, color: BLUE, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: 100, transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = BLUE_LIGHT}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              Sign in
            </button>
            <button onClick={goToLogin}
              style={{ fontSize: 14, fontWeight: 500, color: '#fff', background: BLUE, border: 'none', cursor: 'pointer', padding: '10px 20px', borderRadius: 100 }}>
              Get started
            </button>
          </div>
        </div>
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
    </div>
  );
}
