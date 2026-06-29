import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicFunnel from './pages/PublicFunnel';
import AuthPortal from './pages/AuthPortal';
import ClientDashboard from './pages/ClientDashboard';

const basename = window.location.pathname.startsWith('/clientReview') ? '/clientReview' : '';

function App() {
  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/" element={<AuthPortal />} />
        <Route path="/index.html" element={<AuthPortal />} />
        <Route path="/feedback" element={<PublicFunnel />} />
        <Route path="/login" element={<AuthPortal />} />
        <Route path="/dashboard" element={<ClientDashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
