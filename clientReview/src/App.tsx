import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicFunnel from './pages/PublicFunnel';
import LandingPage from './pages/LandingPage';
import AuthPortal from './pages/AuthPortal';
import ClientDashboard from './pages/ClientDashboard';
import SmartRoot from './SmartRoot';
import BlogPage from './pages/BlogPage';
import IndustryPage from './pages/IndustryPage';
import ShortLinkRedirect from './pages/ShortLinkRedirect';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

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
        <Route path="/industry/:industryId" element={<IndustryPage />} />
        <Route path="/s/:slug" element={<ShortLinkRedirect />} />

        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Fallback to landing */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
