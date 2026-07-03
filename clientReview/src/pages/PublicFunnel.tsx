import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const LOCAL_API_URL = 'http://localhost:8787/adminApiBlog';

const DEFAULT_TEMPLATES = [
  "Excellent service and very friendly staff! Highly recommended.",
  "Great experience overall. Extremely professional and helpful.",
  "Super fast response times and high quality work. Very satisfied!",
  "Great customer support and very professional service.",
  "Outstanding quality and friendly support. Will definitely use again.",
  "Very friendly staff, clean environment, and top-tier service.",
  "Quick, professional, and very easy to work with. Highly recommended!",
  "Top notch support and attention to detail. Extremely pleased.",
  "Very reliable, fast, and high quality support. Great experience!",
  "Excellent communication and professional results. Thank you!",
  "Friendly service, reasonable pricing, and amazing quality.",
  "Exceeded my expectations! Quick, friendly, and very professional.",
  "A wonderful experience from start to finish. Highly recommend them.",
  "Very polite team and superb results. Couldn't be happier!",
  "Great quality, fast support, and very friendly people.",
  "Extremely satisfied with the service. Prompt and professional.",
  "They went above and beyond to help me. Excellent customer care!",
  "Highly professional and efficient team. Great service overall.",
  "Amazing experience! They were fast, helpful, and very friendly.",
  "Consistent high quality work and friendly staff. Highly recommend.",
  "Prompt response, helpful staff, and fantastic service.",
  "Professional support and very neat execution. 5 stars!",
  "So helpful, polite, and quick to resolve my request.",
  "Very professional, reliable, and friendly service every time.",
  "Fast service, friendly team, and excellent results.",
  "Highly recommend this business! Excellent service and support.",
  "Wonderful service, very friendly support, and great quality.",
  "Very fast support, nice staff, and clean work. Thank you!",
  "They made the whole process easy and stress-free. Great team!",
  "Very impressed with the efficiency and friendly service."
];
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

export default function PublicFunnel() {
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get('clientId');
  
  const [clientInfo, setClientInfo] = useState<{ name: string; google_review_link: string; copy_mode?: string; logo_url?: string } | null>(null);
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

    apiFetch(`/api/reviews/public/client?clientId=${clientId}`)
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

    // If rating is 4 or 5, fetch suggestions and respect client's copy_mode setting
    if (selected >= 4) {
      setLoading(true);
      try {
        const res = await apiFetch(`/api/reviews/public/submit`, {
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
        let targetLink = clientInfo?.google_review_link || '';
        let fetchedExamples: string[] = [];
        let activeCopyMode = clientInfo?.copy_mode || 'auto';

        if (res.ok && data.action === 'review_facilitation') {
          fetchedExamples = data.examples || [];
          targetLink = data.google_review_link || targetLink;
          activeCopyMode = data.copy_mode || activeCopyMode;
          setAiSuggestions(fetchedExamples);
          setGoogleLink(targetLink);
        } else {
          // If server fails or columns missing, select a random subset of 3 from 30 templates
          const shuffled = [...DEFAULT_TEMPLATES].sort(() => 0.5 - Math.random());
          fetchedExamples = shuffled.slice(0, 3);
          setAiSuggestions(fetchedExamples);
        }

        // Auto copy & redirect only if copy_mode is 'auto'
        if (activeCopyMode === 'auto') {
          // Randomly pick one template from suggestions
          const candidates = fetchedExamples.length > 0 ? fetchedExamples : DEFAULT_TEMPLATES;
          const randomIndex = Math.floor(Math.random() * candidates.length);
          const selectedTemplate = candidates[randomIndex];

          // Auto copy to clipboard
          try {
            await navigator.clipboard.writeText(selectedTemplate);
            setCopiedIndex(randomIndex);
          } catch (copyErr) {
            console.warn("Failed to auto-copy to clipboard:", copyErr);
          }

          // Auto redirect to Google Reviews in new tab
          if (targetLink) {
            apiFetch(`/api/reviews/public/submit`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                clientId,
                rating: selected,
                reviewer_name: 'Anonymous',
                comment: 'Positive rating facilitation',
                draft: false
              })
            }).catch(err => console.error("Failed to log redirection:", err));

            window.open(targetLink, '_blank');
          }
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
      await apiFetch(`/api/reviews/public/submit`, {
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
      const res = await apiFetch(`/api/reviews/public/submit`, {
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
          <h3>Error</h3>
          <p style={{ marginTop: '1rem', color: '#5f6368' }}>{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (!clientInfo) {
    return (
      <div className="google-funnel-body">
        <div className="google-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <p style={{ color: '#5f6368', fontWeight: 500, margin: 0 }}>Loading secure review portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="google-funnel-body">
      <div className="google-card">
        
        {/* Portal Header */}
        <div className="google-header" style={{ padding: '1.25rem 1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}>
          {clientInfo.logo_url ? (
            <img src={clientInfo.logo_url} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
              {clientInfo.name}
            </span>
          )}
        </div>

        {/* Client Business Context */}
        <div className="google-profile-section">
          <div className="google-avatar">
            {clientInfo.logo_url ? (
              <img src={clientInfo.logo_url} alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              clientInfo.name.charAt(0).toUpperCase()
            )}
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
            {clientInfo?.copy_mode === 'manual' ? (
              <div className="google-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', textAlign: 'left', marginBottom: '1.25rem', color: '#137333', lineHeight: '1.5' }}>
                <svg style={{ width: '20px', height: '20px', fill: 'currentColor', flexShrink: 0 }} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <span>Great! Click any suggestion below to copy it, then click "Continue to Google Review" to leave your feedback:</span>
              </div>
            ) : (
              <div className="google-label" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', textAlign: 'left', marginBottom: '1.25rem', color: '#137333', lineHeight: '1.5' }}>
                <svg style={{ width: '20px', height: '20px', fill: 'currentColor', flexShrink: 0 }} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <span><strong>Review template auto-copied!</strong> We have redirected you to Google Reviews. If the pop-up didn't open, please click "Continue to Google Review" below.</span>
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#5f6368', display: 'block', marginBottom: '0.5rem' }}>
                {clientInfo?.copy_mode === 'manual' ? 'Suggested Templates:' : 'Copied template:'}
              </span>
              {aiSuggestions.map((example, idx) => (
                <div
                  key={idx}
                  className={`suggestion-card ${copiedIndex === idx ? 'copied' : ''}`}
                  onClick={() => copyToClipboard(example, idx)}
                >
                  {copiedIndex === idx ? (
                    <span className="suggestion-copy-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#e6f4ea', color: '#137333' }}>
                      <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      Copied
                    </span>
                  ) : (
                    <span className="suggestion-copy-badge">Click to Copy</span>
                  )}
                  <p style={{ fontSize: '0.85rem', color: '#3c4043', lineHeight: '1.5', paddingRight: '6rem' }}>
                    "{example}"
                  </p>
                </div>
              ))}
            </div>

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
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
