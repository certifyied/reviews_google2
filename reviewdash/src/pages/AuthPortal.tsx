import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LOCAL_API_URL = 'http://localhost:8787/adminApiBlog';
const LIVE_API_URL = 'https://bloggfeature.certifyied.workers.dev/adminApiBlog';

async function apiFetch(path: string, options: RequestInit = {}) {
  if (import.meta.env.DEV) {
    try {
      const res = await fetch(`${LOCAL_API_URL}${path}`, options);
      return res;
    } catch (err) {
      console.warn('⚠️ Local worker connection failed, falling back to live worker.');
    }
  }
  return await fetch(`${LIVE_API_URL}${path}`, options);
}

// Helper to decode JWT on client side
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

export default function AuthPortal() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const navigate = useNavigate();

  // Handle URL Magic Token Login & Auto-login checks on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const magicToken = params.get('magic_token');

    if (magicToken) {
      setLoading(true);
      setErrorMsg('');
      setSuccessMsg('Verifying secure link...');

      apiFetch('/auth/verify-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: magicToken })
      })
        .then(res => {
          if (!res.ok) throw new Error('Invalid or expired login link.');
          return res.json();
        })
        .then(data => {
          if (data.token) {
            localStorage.setItem('review_auth_token', data.token);
            document.cookie = `review_auth_token=${data.token}; path=/; max-age=31536000; SameSite=Lax`;
            
            const payload = parseJwt(data.token);
            if (payload) {
              if (payload.role === 'admin' || payload.role === 'global' || payload.role === 'blogger') {
                navigate('/admin');
              } else if (payload.role === 'client') {
                navigate('/dashboard');
              } else {
                throw new Error('Unauthorized account role.');
              }
            } else {
              throw new Error('Failed to process session.');
            }
          } else {
            throw new Error('Failed to retrieve login session.');
          }
        })
        .catch(err => {
          setErrorMsg(err.message || 'Error occurred.');
          setSuccessMsg('');
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    // Auto-login fallback
    const token = localStorage.getItem('review_auth_token') || getCookie('review_auth_token');
    if (token) {
      localStorage.setItem('review_auth_token', token);
      document.cookie = `review_auth_token=${token}; path=/; max-age=31536000; SameSite=Lax`;
      
      const payload = parseJwt(token);
      if (payload) {
        if (payload.role === 'admin' || payload.role === 'global' || payload.role === 'blogger') {
          navigate('/admin');
        } else if (payload.role === 'client') {
          navigate('/dashboard');
        }
      }
    }
  }, [navigate]);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const redirectUrl = window.location.origin + window.location.pathname;
      const res = await apiFetch('/auth/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), redirectUrl })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || 'We sent a secure login link to your email. Click it to log in!');
      } else {
        setErrorMsg(data.error || 'Failed to send login link. Make sure your email is registered.');
      }
    } catch (err: any) {
      setErrorMsg('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={`${import.meta.env.BASE_URL}image.png`} alt="Certifyied Logo" style={{ height: '48px', objectFit: 'contain' }} />
          <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: '0.85rem' }}>
            Passwordless portal for clients and administrators
          </p>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem', border: '1px solid #fca5a5' }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ backgroundColor: '#f0fdf4', color: '#15803d', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem', border: '1px solid #bbf7d0' }}>
            {successMsg}
          </div>
        )}

        {!loading && !window.location.search.includes('magic_token') && (
          <form onSubmit={handleSendMagicLink}>
            <div className="form-group">
              <label style={{ color: '#0f172a' }}>Enter Registered Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="name@business.com"
                style={{ backgroundColor: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1' }}
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem', backgroundColor: '#467222', color: '#ffffff' }}
              disabled={loading}
            >
              Get Secure Access Link
            </button>
          </form>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '1rem 0', color: '#467222' }}>
            <p style={{ fontWeight: 500 }}>Please wait...</p>
          </div>
        )}

      </div>
    </div>
  );
}
