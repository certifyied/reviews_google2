const fs = require('fs');

const files = [
  '/Users/abhiram/Documents/certifyied/reviews_google/clientReview/src/pages/LandingPage.tsx',
  '/Users/abhiram/Documents/certifyied/reviews_google/reviewdash/src/pages/LandingPage.tsx',
];

// Color map: green → blue
const colorMap = [
  ['#467222', '#1a73e8'],   // primary green → primary blue
  ['#3a5f1d', '#1557b0'],   // dark hover green → dark hover blue
  ['#2d5a16', '#174ea6'],   // deep dark green → deep blue
  ['#f0f4ef', '#e8f0fe'],   // light green bg → light blue bg
  ['#f8faf5', '#f8faff'],   // very light green → very light blue
  ['#e8f5e0', '#e8f0fe'],   // light green badge → light blue badge
  ['#e0ecd6', '#c5d8fd'],   // green border → blue border
  ['#c8dfc0', '#a8c7fa'],   // green hover border → blue
  ['#f0f7ea', '#e8f0fe'],   // icon bg green → icon bg blue
  ['#4db6ac', '#1a73e8'],   // any teal leftover
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');

  // Apply color replacements
  for (const [from, to] of colorMap) {
    c = c.replaceAll(from, to);
    // Also replace uppercase hex if any
    c = c.replaceAll(from.toUpperCase(), to);
  }

  // ── Center alignment ──
  // Section text divs: replace left-aligned text blocks
  // Hero: already left (two-column), keep as-is for hero
  // All h2 headings in sections: add textAlign center
  // All section label <p> tags: center
  // All section description <p>: center
  // The two-column feature sections: change to single-column centered

  // Make all section inner text containers center-aligned
  // Pattern: sections that have maxWidth: 540 with marginBottom → center them
  c = c.replaceAll(
    "style={{ maxWidth: 540, marginBottom: 64 }}",
    "style={{ maxWidth: 640, marginBottom: 64, textAlign: 'center', margin: '0 auto 64px' }}"
  );

  // For the two-col feature sections (sections 1, 2, 4) — make them single column centered
  // Section 1: "For your customers" — change grid to stacked centered
  c = c.replaceAll(
    "style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>",
    "style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>"
  );

  // Section 3 left column: center the text
  c = c.replaceAll(
    "style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>",
    "style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>"
  );

  fs.writeFileSync(f, c, 'utf8');
  console.log('Patched colors:', f);
}

console.log('Done.');
