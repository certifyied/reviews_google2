import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicFunnel from './pages/PublicFunnel';
import LandingPage from './pages/LandingPage';
import AuthPortal from './pages/AuthPortal';
import ClientDashboard from './pages/ClientDashboard';
import SmartRoot from './SmartRoot';
import BlogPage from './pages/BlogPage';

const basename = window.location.pathname.startsWith('/clientReview') ? '/clientReview' : '';

function App() {
  return (
    <Router basename={basename}>
      <Routes>
        {/* Root: landing page, or redirect to /feedback if clientId/magic_token present */}
        <Route path="/" element={<SmartRoot />} />
        <Route path="/index.html" element={<SmartRoot />} />

        {/* Landing page */}
        <Route path="/home" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={<AuthPortal />} />

        {/* Client dashboard */}
        <Route path="/dashboard" element={<ClientDashboard />} />

        {/* Public Google-style review funnel */}
        <Route path="/feedback" element={<PublicFunnel />} />
        <Route path="/blog" element={<BlogPage />} />

        {/* Fallback to landing */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
