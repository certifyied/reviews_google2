const fs = require('fs');

const NEW_SECTION = `      {/* ── SECTION 3: Everything in one place ── */}
      <section id="everything" style={{ padding: '96px 32px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>

          {/* Left: text + feature grid */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#467222', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>Dashboard</p>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 700, letterSpacing: '-1px', color: '#202124', margin: '0 0 16px', lineHeight: 1.2 }}>
              Everything in one place.
            </h2>
            <p style={{ fontSize: 18, fontWeight: 500, color: '#3c4043', margin: '0 0 40px', lineHeight: 1.5 }}>
              One dashboard. Every customer experience.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, marginBottom: 40 }}>
              {[
                {
                  label: 'Feedback',
                  desc: 'See customer feedback as it arrives.',
                  icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#467222" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>),
                },
                {
                  label: 'Ratings',
                  desc: 'Understand customer sentiment.',
                  icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#467222" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
                },
                {
                  label: 'Reviews',
                  desc: 'Track review activity over time.',
                  icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#467222" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>),
                },
                {
                  label: 'Insights',
                  desc: 'Spot patterns that matter.',
                  icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#467222" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
                },
              ].map((item, i) => (
                <div key={i} style={{ padding: '24px 20px', border: '1px solid #e8eaed', background: '#fff', transition: 'background 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f8faf5'; e.currentTarget.style.borderColor = '#c8dfc0'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e8eaed'; }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: '#f0f7ea', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    {item.icon}
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#202124', margin: '0 0 5px' }}>{item.label}</h3>
                  <p style={{ fontSize: 12, color: '#5f6368', margin: 0, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            GETSTARTED_BUTTON
          </div>

          {/* Right: smart review funnel illustration */}
          <div style={{ background: '#f8f9fa', borderRadius: 20, padding: '32px 28px', border: '1px solid #e8eaed' }}>
            <p style={{ fontSize: 12, color: '#9aa0a6', margin: '0 0 24px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>How bad reviews never go public</p>

            {/* Step 1 */}
            <div style={{ background: '#fff', borderRadius: 12, padding: '16px 18px', border: '1px solid #e8eaed', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: '#f0f7ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#467222" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#202124' }}>Customer rates their experience</p>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {[1,2,3,4,5].map(s => (
                  <svg key={s} width="22" height="22" viewBox="0 0 24 24" fill={s <= 4 ? '#fbbc05' : '#e8eaed'}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <svg width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="#bdc1c6" strokeWidth="1.5" strokeLinecap="round">
                <line x1="7" y1="0" x2="7" y2="16"/><polyline points="1 10 7 16 13 10"/>
              </svg>
            </div>

            {/* Step 2 — Router */}
            <div style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', border: '1px solid #e8eaed', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: '#e8f5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#467222" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#202124' }}>Review Manager routes the experience</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9aa0a6' }}>Intelligently based on rating score</p>
              </div>
            </div>

            {/* Two paths */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              <div style={{ background: '#fff', borderRadius: 10, padding: '14px 12px', border: '2px solid #34a853', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)', background: '#34a853', borderRadius: 100, padding: '2px 8px', fontSize: 9, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>4–5 ★</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, marginTop: 6 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34a853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#34a853' }}>Public → Google</span>
                </div>
                <p style={{ margin: 0, fontSize: 10, color: '#5f6368', lineHeight: 1.5 }}>Customer guided to post their 5-star review publicly.</p>
              </div>

              <div style={{ background: '#fff', borderRadius: 10, padding: '14px 12px', border: '2px solid #ea4335', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)', background: '#ea4335', borderRadius: 100, padding: '2px 8px', fontSize: 9, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>1–3 ★</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, marginTop: 6 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ea4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#ea4335' }}>Private Only</span>
                </div>
                <p style={{ margin: 0, fontSize: 10, color: '#5f6368', lineHeight: 1.5 }}>Never reaches Google. Captured for your team only.</p>
              </div>
            </div>

            {/* Result badge */}
            <div style={{ background: '#e8f5e0', borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#467222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#2d5a16' }}>
                Your Google rating stays high. Bad reviews never go public.
              </p>
            </div>
          </div>

        </div>
      </section>
`;

function patch(filePath, loginFn) {
  let content = fs.readFileSync(filePath, 'utf8');
  const btn = loginFn === 'navigate'
    ? `<button onClick={() => navigate('/login')}
              style={{ fontSize: 15, fontWeight: 500, color: '#fff', background: '#467222', border: 'none', cursor: 'pointer', padding: '13px 28px', borderRadius: 100, boxShadow: '0 1px 4px rgba(70,114,34,0.3)', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#3a5f1d'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#467222'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Get started
            </button>`
    : `<button onClick={goToLogin}
              style={{ fontSize: 15, fontWeight: 500, color: '#fff', background: '#467222', border: 'none', cursor: 'pointer', padding: '13px 28px', borderRadius: 100, boxShadow: '0 1px 4px rgba(70,114,34,0.3)', transition: 'all 0.18s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#3a5f1d'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#467222'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Get started
            </button>`;

  const section = NEW_SECTION.replace('GETSTARTED_BUTTON', btn);

  const START_MARKER = '      {/* ── SECTION 3: Everything in one place ── */}';
  const END_MARKER = '\n      <div style={{ height: 1, background:';

  const start = content.indexOf(START_MARKER);
  const end = content.indexOf(END_MARKER, start);

  if (start === -1 || end === -1) {
    console.error('Markers not found in', filePath);
    process.exit(1);
  }

  const newContent = content.slice(0, start) + section + '\n' + content.slice(end + 1);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('Patched', filePath);
}

patch(
  '/Users/abhiram/Documents/certifyied/reviews_google/clientReview/src/pages/LandingPage.tsx',
  'goToLogin'
);
patch(
  '/Users/abhiram/Documents/certifyied/reviews_google/reviewdash/src/pages/LandingPage.tsx',
  'navigate'
);
console.log('Done.');
