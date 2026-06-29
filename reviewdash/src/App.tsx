import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicFunnel from './pages/PublicFunnel';
import AuthPortal from './pages/AuthPortal';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';

const basename = window.location.pathname.startsWith('/reviewdash') ? '/reviewdash' : '';

function App() {
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<AuthPortal />} />
        <Route path="/index.html" element={<AuthPortal />} />
        <Route path="/feedback" element={<PublicFunnel />} />
        <Route path="/login" element={<AuthPortal />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
