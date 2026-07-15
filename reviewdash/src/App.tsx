import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicFunnel from './pages/PublicFunnel';
import AuthPortal from './pages/AuthPortal';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BlogPage from './pages/BlogPage';
import IndustryPage from './pages/IndustryPage';
import ShortLinkRedirect from './pages/ShortLinkRedirect';
import SmartRoot from './SmartRoot';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const basename = window.location.pathname.startsWith('/reviewdash') ? '/reviewdash' : '';

/** True when running on the certifyied.com admin domain or localhost dev */
const isAdminDomain =
  window.location.hostname === 'www.certifyied.com' ||
  window.location.hostname === 'certifyied.com' ||
  window.location.hostname === 'localhost';

/**
 * AdminGuard: Only allows access to AdminDashboard on certifyied.com.
 * On reviewmanager.in redirects to /dashboard.
 */
function AdminGuard() {
  return isAdminDomain ? <AdminDashboard /> : <Navigate to="/dashboard" replace />;
}

/**
 * CertifyiedOnlyRoute: Blocks a route on reviewmanager.in entirely.
 * On reviewmanager.in users are redirected straight to /dashboard.
 * Used for /feedback, /blog, /industry/* etc.
 */
function CertifyiedOnlyRoute({ element }: { element: React.ReactElement }) {
  return isAdminDomain ? element : <Navigate to="/dashboard" replace />;
}

function App() {
  return (
    <Router basename={basename}>
      <Routes>
        {/* Root — SmartRoot handles magic_token & clientId params */}
        <Route path="/" element={<SmartRoot />} />
        <Route path="/index.html" element={<SmartRoot />} />

        {/* Auth — always needed so magic-link emails work on all domains */}
        <Route path="/login" element={<AuthPortal />} />
        <Route path="/certlogin" element={<AuthPortal />} />

        {/* Short-link redirector — always needed so /s/slug works on reviewmanager.in */}
        <Route path="/s/:slug" element={<ShortLinkRedirect />} />

        {/* Client stats dashboard — the ONLY page exposed on reviewmanager.in */}
        <Route path="/dashboard" element={<ClientDashboard />} />

        {/* Admin console — certifyied.com only */}
        <Route path="/admin" element={<AdminGuard />} />

        {/* Public review funnel — accessible on all domains */}
        <Route path="/feedback" element={<PublicFunnel />} />

        {/* Blog & industry pages — certifyied.com only */}
        <Route path="/blog" element={<CertifyiedOnlyRoute element={<BlogPage />} />} />
        <Route path="/industry/:industryId" element={<CertifyiedOnlyRoute element={<IndustryPage />} />} />

        {/* Privacy Policy & Terms of Service — publicly accessible on all domains */}
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
