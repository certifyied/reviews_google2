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

interface Project {
  id: string;
  name: string;
}

interface Client {
  id: string;
  project_id: string;
  name: string;
  email: string;
  google_review_link: string;
  ai_keywords: string;
  suggestion_type?: string;
  custom_suggestions?: string[];
  copy_mode?: string;
  logo_url?: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<'clients' | 'monitoring'>('clients');
  const [monitoringData, setMonitoringData] = useState<{
    recentLogs: any[];
    aiCallsCount: number;
    cronRunsCount: number;
  } | null>(null);
  const [monitoringLoading, setMonitoringLoading] = useState(false);

  // Form States
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [aiKeywords, setAiKeywords] = useState('');
  const [suggestionType, setSuggestionType] = useState('ai');
  const [customSuggestions, setCustomSuggestions] = useState<string[]>(['']);
  const [copyMode, setCopyMode] = useState('auto');
  const [logoUrl, setLogoUrl] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [showForm, setShowForm] = useState(false);

  // New Project modal states
  const [projModalOpen, setProjModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjUrl, setNewProjUrl] = useState('');
  const [newProjEmail, setNewProjEmail] = useState('');
  const [projLoading, setProjLoading] = useState(false);
  const [projError, setProjError] = useState('');

  const navigate = useNavigate();
  
  const getCookie = (cname: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cname}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };
  
  const token = localStorage.getItem('review_auth_token') || getCookie('review_auth_token');

  // Load projects and clients
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Security: decode token and block client-role users from admin console
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      ));
      if (payload.role === 'client') {
        // review_clients users must never access the admin console
        navigate('/dashboard', { replace: true });
        return;
      }
    } catch {
      // If token is malformed, kick to login
      navigate('/login', { replace: true });
      return;
    }

    const loadData = async () => {
      try {
        // Fetch Projects
        const projRes = await apiFetch('/api/projects', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (projRes.status === 401 || projRes.status === 403) {
          throw new Error('session_expired');
        }
        const projData = await projRes.json();
        setProjects(projData.projects || []);

        // Fetch Clients
        const clientRes = await apiFetch('/api/reviews/clients', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!clientRes.ok) throw new Error('Failed to load clients.');
        const clientData = await clientRes.json();
        setClients(clientData || []);

        // Also fetch monitoring logs for AI Credits
        try {
          const res = await apiFetch('/api/reviews/admin/monitoring', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setMonitoringData(data);
          }
        } catch (monErr) {
          console.warn("Failed to load monitoring logs:", monErr);
        }

      } catch (err: any) {
        if (err.message === 'session_expired') {
          localStorage.removeItem('review_auth_token');
          navigate('/login');
        } else {
          setErrorMsg(err.message || 'Error loading dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, navigate]);

  const loadMonitoringData = async () => {
    setMonitoringLoading(true);
    console.log("[Monitoring] Fetching system statistics...");
    try {
      const res = await apiFetch('/api/reviews/admin/monitoring', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log("[Monitoring] Response status:", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("[Monitoring] Data received successfully:", data);
        setMonitoringData(data);
      } else {
        const errText = await res.text();
        console.error("[Monitoring] Failed to load monitoring data:", res.status, errText);
      }
    } catch (e) {
      console.error("[Monitoring] Fetch error:", e);
    } finally {
      setMonitoringLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'monitoring' && token) {
      loadMonitoringData();
    }
  }, [activeTab, token]);

  const handleCreateProjectDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjError('');
    setProjLoading(true);

    if (!newProjName.trim()) {
      setProjError('Project name is required.');
      setProjLoading(false);
      return;
    }

    try {
      const res = await apiFetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newProjName.trim(),
          url: newProjUrl.trim(),
          contact_email: newProjEmail.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create project.');

      // Reload Projects
      const projRes = await apiFetch('/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const projData = await projRes.json();
      const updatedList = projData.projects || [];
      setProjects(updatedList);

      // Auto-select newly created project
      setProjectId(data.id);

      // Reset & Close Modal
      setNewProjName('');
      setNewProjUrl('');
      setNewProjEmail('');
      setProjModalOpen(false);
    } catch (err: any) {
      setProjError(err.message || 'Failed to create project.');
    } finally {
      setProjLoading(false);
    }
  };

  const handleCreateOrUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name || !email || !googleReviewLink || (!editingClient && !projectId)) {
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
      id: editingClient?.id,
      project_id: projectId,
      name,
      email: email.trim(),
      google_review_link: googleReviewLink.trim(),
      ai_keywords: suggestionType === 'ai' ? aiKeywords.trim() : '',
      suggestion_type: suggestionType,
      custom_suggestions: suggestionType === 'custom'
        ? customSuggestions.map(s => s.trim()).filter(Boolean)
        : [],
      copy_mode: copyMode,
      logo_url: logoUrl || null
    };

    const method = editingClient ? 'PUT' : 'POST';

    try {
      const res = await apiFetch('/api/reviews/clients', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed.');

      setSuccessMsg(editingClient ? 'Client updated successfully.' : 'Client registered successfully.');
      
      // Reload Clients list
      const clientRes = await apiFetch('/api/reviews/clients', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const clientData = await clientRes.json();
      setClients(clientData || []);
      
      // Reset form
      resetForm();
    } catch (err: any) {
      setErrorMsg(err.message || 'Action failed.');
    }
  };

  const handleEditClick = (client: Client) => {
    setEditingClient(client);
    setName(client.name);
    setEmail(client.email);
    setGoogleReviewLink(client.google_review_link);
    setAiKeywords(client.ai_keywords || '');
    setSuggestionType(client.suggestion_type || 'ai');
    setCustomSuggestions(Array.isArray(client.custom_suggestions) && client.custom_suggestions.length > 0 
      ? client.custom_suggestions 
      : ['']
    );
    setCopyMode(client.copy_mode || 'auto');
    setLogoUrl(client.logo_url || '');
    setProjectId(client.project_id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClient = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this client? All reviews will be permanently deleted.')) return;

    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await apiFetch(`/api/reviews/clients?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete client.');
      }

      setSuccessMsg('Client deleted successfully.');
      setClients(clients.filter(c => c.id !== id));
    } catch (err: any) {
      setErrorMsg(err.message || 'Delete operation failed.');
    }
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

  const resetForm = () => {
    setEditingClient(null);
    setName('');
    setEmail('');
    setGoogleReviewLink('');
    setAiKeywords('');
    setSuggestionType('ai');
    setCustomSuggestions(['']);
    setCopyMode('auto');
    setLogoUrl('');
    setProjectId('');
    setShowForm(false);
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

  const handleLogout = () => {
    localStorage.removeItem('review_auth_token');
    document.cookie = "review_auth_token=; path=/; max-age=0; SameSite=Lax";
    if (window.location.hostname.endsWith('certifyied.com')) {
      window.location.href = 'https://www.certifyied.com/certlogin';
    } else {
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <p style={{ color: '#475569' }}>Loading admin console...</p>
      </div>
    );
  }

  return (
    <div className="dash-container">
      <nav className="dash-nav">
        <div className="dash-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={`${import.meta.env.BASE_URL}image.png`} alt="Logo" style={{ height: '32px', objectFit: 'contain' }} />
        </div>
        <div className="dash-nav-actions">
          <button className="btn btn-danger btn-small" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="dash-main">
        <div className="dash-title-section">
          <div>
            <h1>Admin Console</h1>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Manage business clients and customize prompter keywords
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1d4ed8',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              userSelect: 'none'
            }}>
              <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
              <span>AI Credits: {Math.max(0, 10000 - (monitoringData?.aiCallsCount || 0))} / 10,000</span>
            </div>
            {activeTab === 'clients' && !showForm && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                + Add Client Profile
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
          <button 
            type="button"
            style={{ padding: '0.75rem 1rem', border: 'none', borderBottom: activeTab === 'clients' ? '2px solid #2563eb' : '2px solid transparent', background: 'none', fontWeight: activeTab === 'clients' ? 600 : 500, color: activeTab === 'clients' ? '#2563eb' : '#64748b', cursor: 'pointer' }}
            onClick={() => { setActiveTab('clients'); resetForm(); }}
          >
            Clients Management
          </button>
          <button 
            type="button"
            style={{ padding: '0.75rem 1rem', border: 'none', borderBottom: activeTab === 'monitoring' ? '2px solid #2563eb' : '2px solid transparent', background: 'none', fontWeight: activeTab === 'monitoring' ? 600 : 500, color: activeTab === 'monitoring' ? '#2563eb' : '#64748b', cursor: 'pointer' }}
            onClick={() => setActiveTab('monitoring')}
          >
            System Monitoring
          </button>
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

        {/* Add/Edit Form Card */}
        {activeTab === 'clients' && showForm && (
          <div className="dash-card">
            <h3 className="dash-card-title">
              {editingClient ? `Edit Client: ${editingClient.name}` : 'Register New Client Profile'}
            </h3>
            
            <form onSubmit={handleCreateOrUpdateClient}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                
                <div className="form-group">
                  <label>Business Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Acme Auto Repair"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Client Login Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="client@acme.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Google Business Review URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://g.page/r/..."
                    required
                    value={googleReviewLink}
                    onChange={e => setGoogleReviewLink(e.target.value)}
                  />
                </div>

                 <div className="form-group">
                  <label>Business Logo (Supabase Storage)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo Preview" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                    ) : (
                      <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1', fontSize: '0.7rem', color: '#94a3b8' }}>
                        No Logo
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="logo-upload-input"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                    />
                    <label htmlFor="logo-upload-input" className="btn btn-secondary btn-small" style={{ cursor: 'pointer', margin: 0, height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {uploadingLogo ? 'Uploading...' : 'Choose File'}
                    </label>
                    {logoUrl && (
                      <button type="button" className="btn btn-danger btn-small" onClick={() => setLogoUrl('')} style={{ height: '42px', padding: '0 0.75rem' }}>
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {!editingClient && (
                  <div className="form-group">
                    <label>Assign to parent Project</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        className="form-control"
                        style={{ height: '47px', flex: 1 }}
                        required
                        value={projectId}
                        onChange={e => setProjectId(e.target.value)}
                      >
                        <option value="">-- Choose Project --</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setProjModalOpen(true)}
                        style={{ height: '47px', padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}
                      >
                        + Create Project
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.25rem' }}>
                <div className="form-group">
                  <label>Review Suggestions Type</label>
                  <select
                    className="form-control"
                    style={{ height: '47px' }}
                    value={suggestionType}
                    onChange={e => setSuggestionType(e.target.value)}
                  >
                    <option value="ai">Dynamic AI (Gemini Generated)</option>
                    <option value="custom">Predefined Custom Templates</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Review Funnel Copy Mode</label>
                  <select
                    className="form-control"
                    style={{ height: '47px' }}
                    value={copyMode}
                    onChange={e => setCopyMode(e.target.value)}
                  >
                    <option value="auto">Auto Copy & Redirect (Fastest conversion)</option>
                    <option value="manual">Manual Copy & Redirection (User picks suggestion)</option>
                  </select>
                </div>
              </div>

              {suggestionType === 'ai' ? (
                <div className="form-group" style={{ marginTop: '1.25rem' }}>
                  <label>AI Suggestion keywords (Comma-separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. friendly staff, clean workshop, fast delivery, cheap pricing"
                    value={aiKeywords}
                    onChange={e => setAiKeywords(e.target.value)}
                  />
                  <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    The AI review generator will weave these keywords into customer reviews when they select 4 or 5 stars.
                  </p>
                </div>
              ) : (
                <div className="form-group" style={{ marginTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ margin: 0 }}>Custom Review Templates</label>
                    <button
                      type="button"
                      className="btn btn-secondary btn-small"
                      onClick={addCustomSuggestion}
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <svg style={{ width: '10px', height: '10px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg> Add Suggestion
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {customSuggestions.map((suggestion, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder={`e.g. Great experience and super fast support at ${name || 'our shop'}! (Suggestion #${idx + 1})`}
                          value={suggestion}
                          onChange={e => handleCustomSuggestionChange(idx, e.target.value)}
                        />
                        {customSuggestions.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger btn-small"
                            onClick={() => removeCustomSuggestion(idx)}
                            style={{ height: '42px', padding: '0 0.75rem', fontSize: '0.85rem' }}
                            title="Delete template"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                    Add one or more positive reviews template variations. These will be displayed for customers to copy during the review process.
                  </p>
                </div>
              )}

              <div className="google-btn-container" style={{ marginTop: '1.5rem', justifyContent: 'flex-start' }}>
                <button type="submit" className="btn btn-primary">
                  {editingClient ? 'Update Profile' : 'Register Profile'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Registered Clients List */}
        {activeTab === 'clients' && (
          <div className="dash-card">
          <h3 className="dash-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg> Active Client Profiles
          </h3>

          {clients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#475569' }}>
              No clients found. Click "+ Add Client Profile" to register one.
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Business Name</th>
                    <th>Email</th>
                    <th>Associated Project</th>
                    <th>Review Suggestions</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map(client => {
                    const matchedProj = projects.find(p => p.id === client.project_id);
                    const suggestionType = client.suggestion_type || 'ai';
                    const customSuggestions = Array.isArray(client.custom_suggestions) ? client.custom_suggestions : [];
                    return (
                      <tr key={client.id}>
                        <td style={{ fontWeight: 600 }}>{client.name}</td>
                        <td>{client.email}</td>
                        <td style={{ color: '#467222', fontSize: '0.85rem', fontWeight: 500 }}>
                          {matchedProj ? matchedProj.name : 'Unknown Project'}
                        </td>
                        <td>
                          {suggestionType === 'custom' ? (
                            <span 
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 500 }}
                            >
                              <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg> Custom ({customSuggestions.length} templates)
                            </span>
                          ) : (
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 500, marginRight: '0.25rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M19 8h-1.18c-.4-.48-.89-.9-1.44-1.24L18.15 4.5l-1.41-1.41-2.4 2.4C13.56 5.17 12.8 5 12 5s-1.56.17-2.34.49l-2.4-2.4L5.85 4.5l1.77 2.26c-.55.34-1.04.76-1.44 1.24H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zM9 16c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm6 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg> AI:
                              </span>
                              {(client.ai_keywords || '').split(',').map((kw, i) => (
                                kw.trim() && (
                                  <span 
                                    key={i} 
                                    style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', fontSize: '0.7rem', padding: '0.1rem 0.3rem', borderRadius: '4px' }}
                                  >
                                    {kw.trim()}
                                  </span>
                                )
                              ))}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button 
                              className="btn btn-secondary btn-small"
                              onClick={() => navigate(`/dashboard?clientId=${client.id}`)}
                            >
                              Stats
                            </button>
                            <button 
                              className="btn btn-secondary btn-small"
                              onClick={() => handleEditClick(client)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg> Edit
                            </button>
                            <button 
                              className="btn btn-danger btn-small"
                              onClick={() => handleDeleteClient(client.id)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {/* System Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="dash-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '4px solid #10b981' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>AI API Calls (Last 30 Days)</span>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>{monitoringData?.aiCallsCount ?? 0}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Logs of Nvidia / OpenRouter requests</span>
              </div>
              <div className="dash-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '4px solid #3b82f6' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Cron Cache Runs (Last 30 Days)</span>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a' }}>{monitoringData?.cronRunsCount ?? 0}</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Automated background refreshes</span>
              </div>
              <div className="dash-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '4px solid #8b5cf6' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Active Provider Mode</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', textTransform: 'capitalize', marginTop: '0.5rem' }}>NVIDIA Direct</span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Serving with 20-item cache queue</span>
              </div>
            </div>

            {/* Refresh Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-small"
                onClick={loadMonitoringData}
                disabled={monitoringLoading}
              >
                {monitoringLoading ? 'Refreshing...' : 'Refresh Logs'}
              </button>
            </div>

            {/* Recent Audit Logs Table */}
            <div className="dash-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#0f172a' }}>Recent Activity Logs</h3>
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Action</th>
                      <th>Identity / Email</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!monitoringData || monitoringData.recentLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
                          No recent system activity logs found.
                        </td>
                      </tr>
                    ) : (
                      monitoringData.recentLogs.map((log: any) => (
                        <tr key={log.id}>
                          <td style={{ fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              backgroundColor: log.action === 'ai_call' ? '#e0f2fe' : '#ecfdf5',
                              color: log.action === 'ai_call' ? '#0369a1' : '#047857'
                            }}>
                              {log.action === 'ai_call' ? 'AI Call' : 'Cron Run'}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                            {log.email}
                          </td>
                          <td style={{ fontSize: '0.8rem', color: '#334155' }}>
                            {log.action === 'ai_call' ? (
                              <div>
                                <strong>Client:</strong> {log.details?.client_name} <br/>
                                <strong>Model:</strong> {log.details?.model} ({log.details?.provider}) <br/>
                                <strong>Count:</strong> Generated {log.details?.count} suggestions
                              </div>
                            ) : (
                              <div>
                                <strong>Type:</strong> {log.details?.type} <br/>
                                <strong>Checked:</strong> {log.details?.clients_checked} AI profiles processed
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
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

      {/* Create Project Modal Popup */}
      {projModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '28px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>Provision New Client Project</h3>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }} 
                onClick={() => setProjModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {projError && (
              <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '15px', border: '1px solid #fca5a5' }}>
                {projError}
              </div>
            )}

            <form onSubmit={handleCreateProjectDirect}>
              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px', color: '#475569' }}>Project Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Acme Corporation" 
                  required 
                  value={newProjName}
                  onChange={e => setNewProjName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px', color: '#475569' }}>Website URL</label>
                <input 
                  type="url" 
                  className="form-control" 
                  placeholder="e.g. https://acme.com" 
                  value={newProjUrl}
                  onChange={e => setNewProjUrl(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px', color: '#475569' }}>Contact Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="e.g. contact@acme.com" 
                  value={newProjEmail}
                  onChange={e => setNewProjEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setProjModalOpen(false)}
                  disabled={projLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={projLoading}
                >
                  {projLoading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
