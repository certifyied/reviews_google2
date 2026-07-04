import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicFunnel from './pages/PublicFunnel';
import LandingPage from './pages/LandingPage';
import SmartRoot from './SmartRoot';

const basename = window.location.pathname.startsWith('/clientReview') ? '/clientReview' : '';

function App() {
  return (
    <Router basename={basename}>
      <Routes>
        {/* Root: show landing page OR redirect to /feedback if clientId/magic_token present */}
        <Route path="/" element={<SmartRoot />} />
        <Route path="/index.html" element={<SmartRoot />} />

        {/* The actual public Google-style review funnel */}
        <Route path="/feedback" element={<PublicFunnel />} />

        {/* Landing page explicit route */}
        <Route path="/home" element={<LandingPage />} />

        {/* Fallback to landing */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
