import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

interface ClientProfile {
  name: string;
  email: string;
  google_review_link: string;
  ai_keywords: string;
  suggestion_type?: string;
  custom_suggestions?: string[];
}

interface Review {
  rating: number;
  reviewer_name: string;
  reviewer_email: string;
  comment: string;
  status: 'diverted' | 'facilitated';
  created_at: string;
}

interface DashboardStats {
  total_submissions: number;
  diverted_count: number;
  facilitated_count: number;
  average_rating: string;
}

interface DashboardData {
  client: ClientProfile;
  stats: DashboardStats;
  reviews: Review[];
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

export default function ClientDashboard() {
  const [searchParams] = useSearchParams();
  const queryClientId = searchParams.get('clientId');

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'diverted' | 'facilitated'>('diverted');
  
  const navigate = useNavigate();
  const token = localStorage.getItem('review_auth_token') || getCookie('review_auth_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const path = queryClientId 
      ? `/api/reviews/client/dashboard?clientId=${queryClientId}`
      : `/api/reviews/client/dashboard`;

    apiFetch(path, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('review_auth_token');
          document.cookie = "review_auth_token=; path=/; max-age=0; SameSite=Lax";
          navigate('/login');
          throw new Error('Session expired.');
        }
        if (!res.ok) throw new Error('Failed to load dashboard data.');
        return res.json();
      })
      .then((dashData: DashboardData) => {
        setData(dashData);
      })
      .catch(err => {
        setErrorMsg(err.message || 'Error occurred.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, queryClientId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('review_auth_token');
    document.cookie = "review_auth_token=; path=/; max-age=0; SameSite=Lax";
    navigate('/login');
  };

  const copyFunnelLink = (clientId: string) => {
    const linkPath = window.location.pathname.includes('/reviewdash') ? '/reviewdash/feedback' : '/feedback';
    const link = `${window.location.origin}${linkPath}?clientId=${clientId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const renderStars = (rating: number) => {
    return (
      <span style={{ color: '#fbbc05', fontSize: '1.1rem', letterSpacing: '2px' }}>
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </span>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <p style={{ color: '#475569' }}>Loading your dashboard...</p>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', padding: '2rem' }}>
        <div className="dash-card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#ef4444', marginBottom: '1.5rem' }}>{errorMsg || 'Failed to load profile.'}</p>
          <button className="btn btn-secondary" onClick={handleLogout}>Back to Login</button>
        </div>
      </div>
    );
  }

  const { client, stats, reviews } = data;

  // Filter reviews
  const filteredReviews = reviews.filter(rev => {
    if (filterType === 'all') return true;
    return rev.status === filterType;
  });

  let activeClientId = queryClientId;
  if (!activeClientId && token) {
    try {
      const payload = JSON.parse(window.atob(token.split('.')[1]));
      activeClientId = payload.clientId;
    } catch (e) {}
  }

  return (
    <div className="dash-container">
      <nav className="dash-nav">
        <div className="dash-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={`${import.meta.env.BASE_URL}image.png`} alt="Certifyied Logo" style={{ height: '32px', objectFit: 'contain' }} />
          Certifyied <span style={{ color: '#467222' }}>Reviews</span>
        </div>
        <div className="dash-nav-actions">
          {queryClientId && (
            <button className="btn btn-secondary btn-small" onClick={() => navigate('/admin')}>
              ← Back to Admin
            </button>
          )}
          <span className="dash-user-email">{client.email}</span>
          <button className="btn btn-danger btn-small" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="dash-main">
        
        <div className="dash-title-section">
          <div>
            <h1>{client.name} Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Real-time analytics for your feedback funnel
            </p>
          </div>
          {activeClientId && (
            <button 
              className={`btn ${copiedLink ? 'btn-secondary' : 'btn-primary'}`} 
              onClick={() => copyFunnelLink(activeClientId as string)}
            >
              {copiedLink ? '✓ Copied Link!' : '🔗 Copy Feedback Page Link'}
            </button>
          )}
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-title">Overall Rating</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="metric-value">{stats.average_rating}</span>
              <span style={{ fontSize: '1.5rem', color: '#fbbc05', marginTop: '0.25rem' }}>★</span>
            </div>
            <span className="metric-desc">Average across all ratings</span>
          </div>

          <div className="metric-card">
            <span className="metric-title">Total Submissions</span>
            <span className="metric-value">{stats.total_submissions}</span>
            <span className="metric-desc">Submissions received via funnel</span>
          </div>

          <div className="metric-card">
            <span className="metric-title">Diverted Feedback</span>
            <span className="metric-value" style={{ color: '#f87171' }}>{stats.diverted_count}</span>
            <span className="metric-desc">Negative ratings (&lt;= 3 stars) saved internally</span>
          </div>

          <div className="metric-card">
            <span className="metric-title">Redirected to Google</span>
            <span className="metric-value" style={{ color: '#34d399' }}>{stats.facilitated_count}</span>
            <span className="metric-desc">Positive ratings (&gt;= 4 stars) sent to Google</span>
          </div>
        </div>

        <div className="dash-card">
          <h3 className="dash-card-title">💡 Funnel Configuration</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Google Business Review URL</p>
              <a 
                href={client.google_review_link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#467222', textDecoration: 'none', display: 'block', wordBreak: 'break-all', marginTop: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}
              >
                {client.google_review_link} ↗
              </a>
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Review Suggestions Style</p>
              {client.suggestion_type === 'custom' ? (
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 500 }}>
                    ✍️ Predefined Custom Templates
                  </span>
                  <div style={{ marginTop: '0.5rem', color: '#475569', fontSize: '0.8rem', lineHeight: '1.4' }}>
                    {Array.isArray(client.custom_suggestions) ? client.custom_suggestions.map((s, idx) => (
                      <div key={idx} style={{ padding: '0.25rem 0', borderBottom: idx < (client.custom_suggestions || []).length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                        "{s}"
                      </div>
                    )) : 'No custom suggestions configured.'}
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#475569', alignSelf: 'center' }}>🤖 AI:</span>
                    {(client.ai_keywords || '').split(',').map((kw, i) => (
                      kw.trim() && (
                        <span 
                          key={i} 
                          style={{ backgroundColor: '#e2e8f0', color: '#475569', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 500, border: '1px solid #cbd5e1' }}
                        >
                          {kw.trim()}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dash-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="dash-card-title" style={{ marginBottom: 0 }}>📋 Customer Submissions Log</h3>
            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.25rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <button 
                className={`btn btn-small ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', boxShadow: 'none' }}
                onClick={() => setFilterType('all')}
              >
                All
              </button>
              <button 
                className={`btn btn-small ${filterType === 'diverted' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', boxShadow: 'none' }}
                onClick={() => setFilterType('diverted')}
              >
                Diverted
              </button>
              <button 
                className={`btn btn-small ${filterType === 'facilitated' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', boxShadow: 'none' }}
                onClick={() => setFilterType('facilitated')}
              >
                Redirected
              </button>
            </div>
          </div>

          {filteredReviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#475569' }}>
              No reviews match this filter.
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th style={{ width: '40%' }}>Comments / Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.map((rev, idx) => (
                    <tr key={idx}>
                      <td>
                        {new Date(rev.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{rev.reviewer_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#475569' }}>{rev.reviewer_email || 'N/A'}</div>
                      </td>
                      <td>{renderStars(rev.rating)}</td>
                      <td>
                        <span className={`badge ${rev.status === 'diverted' ? 'badge-diverted' : 'badge-facilitated'}`}>
                          {rev.status === 'diverted' ? 'Diverted (Internal)' : 'Redirected (Google)'}
                        </span>
                      </td>
                      <td>
                        <p style={{ color: rev.comment ? 'var(--text-primary)' : 'var(--text-secondary)', fontStyle: rev.comment ? 'normal' : 'italic' }}>
                          {rev.comment || 'No comments left.'}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
