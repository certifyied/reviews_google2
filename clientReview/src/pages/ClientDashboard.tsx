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
  copy_mode?: string;
  logo_url?: string;
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
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'diverted' | 'facilitated'>('diverted');

  // Edit fields configuration
  const [isEditing, setIsEditing] = useState(false);
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [suggestionType, setSuggestionType] = useState('ai');
  const [aiKeywords, setAiKeywords] = useState('');
  const [customSuggestions, setCustomSuggestions] = useState<string[]>(['']);
  const [copyMode, setCopyMode] = useState('auto');
  const [logoUrl, setLogoUrl] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
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
        if (dashData.client) {
          setGoogleReviewLink(dashData.client.google_review_link || '');
          setAiKeywords(dashData.client.ai_keywords || '');
          setSuggestionType(dashData.client.suggestion_type || 'ai');
          setCustomSuggestions(Array.isArray(dashData.client.custom_suggestions) && dashData.client.custom_suggestions.length > 0 
            ? dashData.client.custom_suggestions 
            : ['']
          );
          setCopyMode(dashData.client.copy_mode || 'auto');
          setLogoUrl(dashData.client.logo_url || '');
        }
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
    if (window.location.hostname.endsWith('certifyied.com')) {
      window.location.href = 'https://www.certifyied.com/certlogin';
    } else {
      navigate('/login');
    }
  };

  const copyFunnelLink = (clientId: string) => {
    const params = new URLSearchParams(window.location.search);
    const parentOrigin = params.get('parent_origin');
    
    const customDomain = import.meta.env.VITE_FEEDBACK_DOMAIN;
    const baseDomain = parentOrigin 
      ? parentOrigin.replace(/\/$/, '') 
      : (customDomain ? customDomain.replace(/\/$/, '') : window.location.origin);
    
    let linkPath = '/feedback';
    if (window.location.pathname.includes('/clientReview')) {
      linkPath = '/clientReview/feedback';
    } else if (window.location.pathname.includes('/reviewdash')) {
      linkPath = '/reviewdash/feedback';
    }
    
    const link = `${baseDomain}${linkPath}?clientId=${clientId}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const res = await apiFetch('/api/reviews/clients/upload-logo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload logo.');

      setLogoUrl(data.logoUrl);
      setSuccessMsg('Logo uploaded successfully.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Logo upload failed.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!googleReviewLink || !activeClientId) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (suggestionType === 'ai' && !aiKeywords.trim()) {
      setErrorMsg('Please provide AI suggestion keywords.');
      return;
    }

    if (suggestionType === 'custom' && (!customSuggestions || customSuggestions.filter(s => s.trim()).length === 0)) {
      setErrorMsg('Please provide at least one custom suggestion.');
      return;
    }

    const payload = {
      id: activeClientId,
      google_review_link: googleReviewLink.trim(),
      ai_keywords: suggestionType === 'ai' ? aiKeywords.trim() : '',
      suggestion_type: suggestionType,
      custom_suggestions: suggestionType === 'custom'
        ? customSuggestions.map(s => s.trim()).filter(Boolean)
        : [],
      copy_mode: copyMode,
      logo_url: logoUrl || null
    };

    try {
      const res = await apiFetch('/api/reviews/clients', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to save configuration.');

      // Update local state data
      if (data) {
        setData({
          ...data,
          client: {
            ...data.client,
            google_review_link: payload.google_review_link,
            ai_keywords: payload.ai_keywords,
            suggestion_type: payload.suggestion_type,
            custom_suggestions: payload.custom_suggestions,
            copy_mode: payload.copy_mode,
            logo_url: payload.logo_url || undefined
          }
        });
      }

      setSuccessMsg('Configuration saved successfully.');
      setIsEditing(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Action failed.');
    }
  };

  const addCustomSuggestion = () => {
    setCustomSuggestions([...customSuggestions, '']);
  };

  const removeCustomSuggestion = (index: number) => {
    const updated = customSuggestions.filter((_, i) => i !== index);
    setCustomSuggestions(updated.length > 0 ? updated : ['']);
  };

  const handleCustomSuggestionChange = (index: number, value: string) => {
    const updated = [...customSuggestions];
    updated[index] = value;
    setCustomSuggestions(updated);
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
          <img src={`${import.meta.env.BASE_URL}image.png`} alt="Logo" style={{ height: '32px', objectFit: 'contain' }} />
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
        
        <div className="dash-title-section" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {client.logo_url && (
            <img src={client.logo_url} alt="Logo" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }} />
          )}
          <div>
            <h1 style={{ margin: 0 }}>{client.name} Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Real-time analytics for your feedback funnel
            </p>
          </div>
          {activeClientId && (
            <button 
              className={`btn ${copiedLink ? 'btn-secondary' : 'btn-primary'}`} 
              onClick={() => copyFunnelLink(activeClientId as string)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {copiedLink ? (
                <>
                  <svg style={{ width: '14px', height: '14px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                  Copied Link!
                </>
              ) : (
                <>
                  <svg style={{ width: '14px', height: '14px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                  Copy Feedback Page Link
                </>
              )}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 className="dash-card-title" style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg> Funnel Configuration
            </h3>
            {!isEditing && (
              <button className="btn btn-secondary btn-small" onClick={() => setIsEditing(true)}>
                Edit Settings
              </button>
            )}
          </div>

          {errorMsg && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>{errorMsg}</p>}
          {successMsg && <p style={{ color: '#166534', fontSize: '0.85rem', marginBottom: '1rem' }}>{successMsg}</p>}

          {isEditing ? (
            <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}>Google Business Review URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://g.page/r/..."
                    required
                    value={googleReviewLink}
                    onChange={e => setGoogleReviewLink(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}>Business Logo (Supabase Storage)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1', fontSize: '0.7rem', color: '#94a3b8' }}>
                        No Logo
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="client-logo-upload-input"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                    />
                    <label htmlFor="client-logo-upload-input" className="btn btn-secondary btn-small" style={{ cursor: 'pointer', margin: 0, height: '38px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      {uploadingLogo ? 'Uploading...' : 'Choose File'}
                    </label>
                    {logoUrl && (
                      <button type="button" className="btn btn-danger btn-small" onClick={() => setLogoUrl('')} style={{ height: '38px', padding: '0 0.5rem' }}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}>Review Suggestions Type</label>
                  <select
                    className="form-control"
                    style={{ height: '42px', width: '100%', padding: '0 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    value={suggestionType}
                    onChange={e => setSuggestionType(e.target.value)}
                  >
                    <option value="ai">AI Auto Suggestions (based on keywords)</option>
                    <option value="custom">Predefined Custom Templates</option>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}>Review Funnel Copy Mode</label>
                  <select
                    className="form-control"
                    style={{ height: '42px', width: '100%', padding: '0 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    value={copyMode}
                    onChange={e => setCopyMode(e.target.value)}
                  >
                    <option value="auto">Auto Copy review text & Redirect</option>
                    <option value="manual">Manual Copy cards & manual redirection button</option>
                  </select>
                </div>
              </div>

              {suggestionType === 'ai' ? (
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}>AI Keywords (comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. friendly service, neat rooms, fast response"
                    value={aiKeywords}
                    onChange={e => setAiKeywords(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                  <small style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>Keywords used by AI to generate customized templates dynamically.</small>
                </div>
              ) : (
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.5rem', color: '#475569' }}>Predefined Custom Templates (one template per line)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {customSuggestions.map((suggestion, index) => (
                      <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Template #${index + 1}`}
                          value={suggestion}
                          onChange={e => handleCustomSuggestionChange(index, e.target.value)}
                          style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ padding: '0.5rem 0.75rem', height: '42px' }}
                          onClick={() => removeCustomSuggestion(index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-secondary btn-small"
                      onClick={addCustomSuggestion}
                      style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      + Add New Template
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
                  Save Settings
                </button>
                <button type="button" className="btn btn-secondary" style={{ padding: '0.6rem 1.5rem' }} onClick={() => {
                  setIsEditing(false);
                  // Restore initial values
                  setGoogleReviewLink(client.google_review_link || '');
                  setAiKeywords(client.ai_keywords || '');
                  setSuggestionType(client.suggestion_type || 'ai');
                  setCustomSuggestions(Array.isArray(client.custom_suggestions) ? client.custom_suggestions : ['']);
                  setCopyMode(client.copy_mode || 'auto');
                  setLogoUrl(client.logo_url || '');
                }}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
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
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 500 }}>
                      <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg> Predefined Custom Templates
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
                      <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#475569', alignSelf: 'center', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M19 8h-1.18c-.4-.48-.89-.9-1.44-1.24L18.15 4.5l-1.41-1.41-2.4 2.4C13.56 5.17 12.8 5 12 5s-1.56.17-2.34.49l-2.4-2.4L5.85 4.5l1.77 2.26c-.55.34-1.04.76-1.44 1.24H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zM9 16c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg> AI:
                      </span>
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
              <div>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Review Funnel Copy Mode</p>
                <div style={{ marginTop: '0.5rem' }}>
                  <span style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: client.copy_mode === 'manual' ? '#eff6ff' : '#fef3c7', 
                    border: client.copy_mode === 'manual' ? '1px solid #bfdbfe' : '1px solid #fde68a', 
                    color: client.copy_mode === 'manual' ? '#1e40af' : '#92400e', 
                    fontSize: '0.75rem', 
                    padding: '0.2rem 0.5rem', 
                    borderRadius: '6px', 
                    fontWeight: 500 
                  }}>
                    {client.copy_mode === 'manual' ? (
                      <>
                        <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                        Manual Copy & Redirection
                      </>
                    ) : (
                      <>
                        <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
                        Auto Copy & Redirect
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dash-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 className="dash-card-title" style={{ marginBottom: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> Customer Submissions Log
            </h3>
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

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e8eaed', padding: '24px 32px', background: '#fff', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={`${import.meta.env.BASE_URL}image.png`} alt="Logo" style={{ height: 28, objectFit: 'contain' }} />
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
