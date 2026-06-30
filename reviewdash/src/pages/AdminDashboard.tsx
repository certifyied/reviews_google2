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
  created_at: string;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form States
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [aiKeywords, setAiKeywords] = useState('');
  const [suggestionType, setSuggestionType] = useState('ai');
  const [customSuggestionsText, setCustomSuggestionsText] = useState('');
  const [projectId, setProjectId] = useState('');
  const [showForm, setShowForm] = useState(false);

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

    if (suggestionType === 'custom' && !customSuggestionsText.trim()) {
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
        ? customSuggestionsText.split('\n').map(s => s.trim()).filter(Boolean)
        : []
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
    setCustomSuggestionsText(Array.isArray(client.custom_suggestions) ? client.custom_suggestions.join('\n') : '');
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

  const resetForm = () => {
    setEditingClient(null);
    setName('');
    setEmail('');
    setGoogleReviewLink('');
    setAiKeywords('');
    setSuggestionType('ai');
    setCustomSuggestionsText('');
    setProjectId('');
    setShowForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('review_auth_token');
    document.cookie = "review_auth_token=; path=/; max-age=0; SameSite=Lax";
    navigate('/login');
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
          <img src={`${import.meta.env.BASE_URL}image.png`} alt="Certifyied Logo" style={{ height: '32px', objectFit: 'contain' }} />
          Certifyied <span style={{ color: '#467222' }}>Reviews</span> <span style={{ fontSize: '0.75rem', backgroundColor: '#e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#475569', fontWeight: 600 }}>Admin</span>
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
          
          {!showForm && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Add Client Profile
            </button>
          )}
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
        {showForm && (
          <div className="dash-card">
            <h3 className="dash-card-title">
              {editingClient ? `✏️ Edit Client: ${editingClient.name}` : '💼 Register New Client Profile'}
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

                {!editingClient && (
                  <div className="form-group">
                    <label>Assign to parent Project</label>
                    <select
                      className="form-control"
                      style={{ height: '47px' }}
                      required
                      value={projectId}
                      onChange={e => setProjectId(e.target.value)}
                    >
                      <option value="">-- Choose Project --</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
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
                    <option value="ai">🤖 Dynamic AI (Gemini Generated)</option>
                    <option value="custom">✍️ Predefined Custom Templates</option>
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
                  <label>Custom Suggestions (One review template per line)</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    style={{ fontFamily: 'inherit', resize: 'vertical', padding: '0.75rem' }}
                    placeholder="Example 1: Had an amazing experience! Extremely clean and professional.&#10;Example 2: Best service in town, highly recommended!"
                    value={customSuggestionsText}
                    onChange={e => setCustomSuggestionsText(e.target.value)}
                  />
                  <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    Enter one or more positive reviews template variations (one per line). These will be displayed for customers to copy.
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
        <div className="dash-card">
          <h3 className="dash-card-title">💼 Active Client Profiles</h3>

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
                              style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 500 }}
                            >
                              ✍️ Custom ({customSuggestions.length} templates)
                            </span>
                          ) : (
                            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 500, marginRight: '0.25rem' }}>🤖 AI:</span>
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
                              📊 Stats
                            </button>
                            <button 
                              className="btn btn-secondary btn-small"
                              onClick={() => handleEditClick(client)}
                            >
                              ✏️ Edit
                            </button>
                            <button 
                              className="btn btn-danger btn-small"
                              onClick={() => handleDeleteClient(client.id)}
                            >
                              🗑️ Delete
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
      </main>
    </div>
  );
}
