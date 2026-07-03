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

  const handlePostClick = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      const isPositive = rating >= 4;
      const res = await apiFetch(`/api/reviews/public/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          rating,
          reviewer_name: reviewerName.trim() || 'Anonymous',
          reviewer_email: reviewerEmail.trim() || null,
          comment: comment.trim(),
          draft: false
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review.');
      }

      if (isPositive) {
        try {
          if (comment.trim()) {
            await navigator.clipboard.writeText(comment.trim());
          }
        } catch (copyErr) {
          console.warn("Auto-copy failed:", copyErr);
        }
        
        const targetLink = googleLink || clientInfo?.google_review_link;
        if (targetLink) {
          window.open(targetLink, '_blank');
        }
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection error.');
    } finally {
      setLoading(false);
    }
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
      <div className="google-funnel-body" style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f3f4' }}>
        <div className="google-card" style={{ maxWidth: '500px', width: '100%', margin: '0 auto', padding: '3.5rem 2rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#5f6368', fontWeight: 500, margin: 0, fontFamily: 'Roboto, Arial, sans-serif' }}>Loading secure review portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="google-funnel-body" style={{ margin: 0, padding: 0, backgroundColor: '#f1f3f4', fontFamily: 'Roboto, Arial, sans-serif' }}>
      <div className="google-card" style={{ padding: 0, margin: '1.5rem auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #dadce0', position: 'sticky', top: 0, backgroundColor: '#ffffff', zIndex: 10, borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit' }}>
          <button 
            onClick={() => window.history.back()} 
            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '8px', marginRight: '12px', display: 'flex', alignItems: 'center', color: '#5f6368' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="12" x2="6" y2="12"></line><polyline points="12 18 6 12 12 6"></polyline></svg>
          </button>
          <span style={{ fontSize: '18px', fontWeight: 500, color: '#202124', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {clientInfo.name}
          </span>
        </div>

        {/* Content Container */}
        <div style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Profile Section */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ffffff', border: '1px solid #dadce0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: '2px' }}>
              {clientInfo.logo_url ? (
                <img src={clientInfo.logo_url} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#1a73e8' }}>{clientInfo.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#202124' }}>Certifyied</span>
              <span style={{ fontSize: '12px', color: '#5f6368', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Posting publicly across Google 
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#5f6368"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </span>
            </div>
          </div>

          {/* Interactive Stars */}
          {!submitted && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '8px 0' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{ fontSize: '42px', cursor: 'pointer', color: (hoverRating || rating) >= star ? '#fbbc05' : '#e8eaed', transition: 'color 0.15s' }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRatingClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#1a73e8' }}>
              <p>Loading suggestions...</p>
            </div>
          )}

          {/* Expanded Review Form */}
          {!submitted && rating > 0 && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              
              {/* Textarea container */}
              <div style={{ border: '1px solid #dadce0', borderRadius: '8px', padding: '12px', minHeight: '120px', display: 'flex', flexDirection: 'column' }}>
                <textarea
                  style={{ border: 'none', outline: 'none', width: '100%', resize: 'none', fontSize: '15px', fontFamily: 'inherit', color: '#202124', flex: 1, minHeight: '100px' }}
                  placeholder="Share details of your own experience at this place"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
              </div>

              {/* Add Photos Button */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button 
                  type="button" 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#e8f0fe', border: 'none', color: '#1a73e8', padding: '10px 24px', borderRadius: '100px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                  Add photos
                </button>
              </div>

              {/* Suggestions Cards (For 4-5 Stars) */}
              {rating >= 4 && aiSuggestions.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#5f6368', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    💡 Choose another template if you like:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {aiSuggestions.map((example, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setComment(example);
                          navigator.clipboard.writeText(example);
                          setCopiedIndex(idx);
                          setTimeout(() => setCopiedIndex(null), 2000);
                        }}
                        style={{ border: '1px solid #dadce0', borderRadius: '8px', padding: '12px', cursor: 'pointer', backgroundColor: copiedIndex === idx ? '#f1f8e9' : '#ffffff', transition: 'background-color 0.2s', position: 'relative' }}
                      >
                        {copiedIndex === idx && (
                          <span style={{ position: 'absolute', top: '8px', right: '8px', fontSize: '11px', backgroundColor: '#e6f4ea', color: '#137333', padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>
                            Copied!
                          </span>
                        )}
                        <p style={{ fontSize: '13px', color: '#3c4043', margin: 0, paddingRight: '50px', lineHeight: '1.4' }}>
                          "{example}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Fields for Diverted Review (Optional) */}
              {rating <= 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
                    value={reviewerName}
                    onChange={e => setReviewerName(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Your Email (Optional)"
                    style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
                    value={reviewerEmail}
                    onChange={e => setReviewerEmail(e.target.value)}
                  />
                </div>
              )}

              {errorMsg && <p style={{ color: '#ea4335', fontSize: '0.85rem', margin: 0 }}>{errorMsg}</p>}

              {/* Post Button */}
              <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                <button
                  onClick={handlePostClick}
                  style={{ width: '100%', padding: '14px', backgroundColor: '#1a73e8', border: 'none', color: '#ffffff', borderRadius: '100px', fontSize: '16px', fontWeight: 500, cursor: 'pointer', outline: 'none' }}
                >
                  Post
                </button>
              </div>

            </div>
          )}

          {/* Thank You Card */}
          {submitted && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#e6f4ea', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#137333', fontSize: '32px' }}>
                ✓
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 500, color: '#202124', marginBottom: '0.75rem' }}>
                {rating >= 4 ? 'Review template copied!' : 'Thank you for your feedback!'}
              </h3>
              <p style={{ color: '#5f6368', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                {rating >= 4 
                  ? 'We have copied your review text. Simply right-click (or long-press on mobile) and select Paste to write your review on Google.'
                  : 'We appreciate your honesty and will use your input to improve our services immediately.'}
              </p>
              {rating >= 4 && (
                <a
                  href={googleLink || clientInfo.google_review_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', display: 'block', marginTop: '2rem' }}
                >
                  <button style={{ width: '100%', padding: '14px', backgroundColor: '#1a73e8', border: 'none', color: '#ffffff', borderRadius: '100px', fontSize: '16px', fontWeight: 500, cursor: 'pointer' }}>
                    Continue to Google Review
                  </button>
                </a>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
