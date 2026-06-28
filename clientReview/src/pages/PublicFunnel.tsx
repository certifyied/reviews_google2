import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:8787/adminApiBlog' 
  : 'https://bloggfeature.certifyied.workers.dev/adminApiBlog';

export default function PublicFunnel() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('clientId');
  
  const [clientInfo, setClientInfo] = useState<{ name: string; google_review_link: string } | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [comment, setComment] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [googleLink, setGoogleLink] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!clientId) {
      setErrorMsg('Invalid URL: clientId is missing.');
      return;
    }

    fetch(`${API_BASE_URL}/api/reviews/public/client?clientId=${clientId}`)
      .then(res => {
        if (!res.ok) throw new Error('Client profile not found.');
        return res.json();
      })
      .then(data => {
        setClientInfo(data);
      })
      .catch(err => {
        setErrorMsg(err.message || 'Error loading page.');
      });
  }, [clientId]);

  const handleRatingClick = async (selected: number) => {
    setRating(selected);
    setErrorMsg('');

    if (selected >= 4) {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/public/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId,
            rating: selected,
            reviewer_name: 'Anonymous',
            comment: 'Positive rating facilitation',
            draft: true
          })
        });

        const data = await res.json();
        if (res.ok && data.action === 'review_facilitation') {
          setAiSuggestions(data.examples || []);
          setGoogleLink(data.google_review_link || '');
        } else {
          throw new Error(data.error || 'Failed to initialize Google redirection.');
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Connection error.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Submit actual facilitated redirection action
  const handleGoogleClick = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/reviews/public/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          rating,
          reviewer_name: 'Anonymous',
          comment: 'Positive rating facilitation',
          draft: false
        })
      });
    } catch (err) {
      console.error("Failed to log Google redirection click:", err);
    }
  };

  const handleDivertedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Please tell us how we can improve.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/public/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          rating,
          reviewer_name: reviewerName || 'Anonymous',
          reviewer_email: reviewerEmail || null,
          comment
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        throw new Error(data.error || 'Feedback submission failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection error.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 3000);
  };

  if (errorMsg && !clientInfo) {
    return (
      <div className="google-funnel-body">
        <div className="google-card" style={{ textAlign: 'center', color: '#ea4335', padding: '3rem' }}>
          <h3>⚠️ Error</h3>
          <p style={{ marginTop: '1rem', color: '#5f6368' }}>{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (!clientInfo) {
    return (
      <div className="google-funnel-body">
        <div className="google-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="google-logo" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
            <span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span>
          </div>
          <p style={{ color: '#5f6368' }}>Loading secure review portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="google-funnel-body">
      <div className="google-card">
        
        <div className="google-header">
          <div className="google-logo-wrapper">
            <div className="google-logo">
              <span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span>
            </div>
            <span className="google-logo-sub">Reviews Portal</span>
          </div>
        </div>

        <div className="google-profile-section">
          <div className="google-avatar">
            {clientInfo.name.charAt(0).toUpperCase()}
          </div>
          <div className="google-profile-info">
            <span className="google-profile-name">{clientInfo.name}</span>
            <span className="google-profile-postingtext">Posting publicly to help others</span>
          </div>
        </div>

        {!submitted && rating === 0 && (
          <div style={{ margin: '1rem 0' }}>
            <div className="google-label">How would you rate your experience?</div>
            <div className="google-stars-container">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`google-star ${(hoverRating || rating) >= star ? 'active' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRatingClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: '#1a73e8' }}>
            <p>Processing rating...</p>
          </div>
        )}

        {!submitted && rating > 0 && rating <= 3 && !loading && (
          <form onSubmit={handleDivertedSubmit}>
            <div className="google-label" style={{ textAlign: 'left', marginBottom: '1rem' }}>
              We are sorry to hear that. Please let us know how we can improve:
            </div>
            
            <div className="google-textarea-wrapper">
              <textarea
                className="google-textarea"
                placeholder="Describe your experience or issues..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Your Name (Optional)"
                style={{ backgroundColor: '#fff', color: '#000', border: '1px solid #dadce0' }}
                value={reviewerName}
                onChange={e => setReviewerName(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <input
                type="email"
                className="form-control"
                placeholder="Your Email (Optional)"
                style={{ backgroundColor: '#fff', color: '#000', border: '1px solid #dadce0' }}
                value={reviewerEmail}
                onChange={e => setReviewerEmail(e.target.value)}
              />
            </div>

            {errorMsg && <p style={{ color: '#ea4335', fontSize: '0.85rem', marginBottom: '1rem' }}>{errorMsg}</p>}

            <div className="google-btn-container">
              <button
                type="button"
                className="google-btn google-btn-text"
                onClick={() => setRating(0)}
              >
                Back
              </button>
              <button
                type="submit"
                className="google-btn google-btn-primary"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        )}

        {submitted && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem', color: '#34a853', marginBottom: '1rem' }}>✓</div>
            <h3>Thank you for your feedback!</h3>
            <p style={{ color: '#5f6368', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              We appreciate your honesty and will use your input to improve our services immediately.
            </p>
          </div>
        )}

        {!submitted && rating >= 4 && !loading && (
          <div>
            <div className="google-label" style={{ textAlign: 'left', marginBottom: '1.25rem', color: '#137333' }}>
              🎉 Great! Choose one of the suggestions below to copy and paste to help others find us on Google:
            </div>

            {aiSuggestions.map((example, idx) => (
              <div
                key={idx}
                className={`suggestion-card ${copiedIndex === idx ? 'copied' : ''}`}
                onClick={() => copyToClipboard(example, idx)}
              >
                {copiedIndex === idx && <span className="suggestion-copy-badge">Copied!</span>}
                <p style={{ fontSize: '0.85rem', color: '#3c4043', lineHeight: '1.5', paddingRight: '2rem' }}>
                  "{example}"
                </p>
              </div>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <a
                href={googleLink || clientInfo.google_review_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
                onClick={handleGoogleClick}
              >
                <button
                  className="google-btn google-btn-primary"
                  style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}
                >
                  Continue to Google Review
                </button>
              </a>

              <button
                type="button"
                className="google-btn google-btn-text"
                style={{ alignSelf: 'center' }}
                onClick={() => setRating(0)}
              >
                Change Rating
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
