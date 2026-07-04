const fs = require('fs');

// Fix all img src="./image.png" → src={`${import.meta.env.BASE_URL}image.png`}
// And href="./" → href={import.meta.env.BASE_URL}

const files = [
  '/Users/abhiram/Documents/certifyied/reviews_google/clientReview/src/pages/LandingPage.tsx',
  '/Users/abhiram/Documents/certifyied/reviews_google/reviewdash/src/pages/LandingPage.tsx',
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');

  // Fix image src
  c = c.replaceAll('src="./image.png"', 'src={`${import.meta.env.BASE_URL}image.png`}');

  // Fix logo href
  c = c.replaceAll('href="./"', 'href={import.meta.env.BASE_URL}');

  fs.writeFileSync(f, c, 'utf8');
  console.log('Fixed:', f);
}
console.log('Done.');
