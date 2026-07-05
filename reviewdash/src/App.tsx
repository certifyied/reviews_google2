import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicFunnel from './pages/PublicFunnel';
import AuthPortal from './pages/AuthPortal';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BlogPage from './pages/BlogPage';
import IndustryPage from './pages/IndustryPage';
import ShortLinkRedirect from './pages/ShortLinkRedirect';
import SmartRoot from './SmartRoot';

const basename = window.location.pathname.startsWith('/reviewdash') ? '/reviewdash' : '';

function App() {
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<SmartRoot />} />
        <Route path="/index.html" element={<SmartRoot />} />
        <Route path="/login" element={<AuthPortal />} />
        <Route path="/feedback" element={<PublicFunnel />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/industry/:industryId" element={<IndustryPage />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/s/:slug" element={<ShortLinkRedirect />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
