import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function SmartRoot() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const clientId   = searchParams.get('clientId');
  const magicToken = searchParams.get('magic_token');

  useEffect(() => {
    if (magicToken) {
      const payload = decodeJwtPayload(magicToken);
      const isClientPortal = payload?.isClientPortal === true;
      const role = payload?.role;
      const isAdmin = role === 'admin' || role === 'global' || role === 'blogger';

      if (isClientPortal || isAdmin || role === 'client') {
        // This is a dashboard login link — send to AuthPortal which will verify & redirect
        navigate(`/login?magic_token=${encodeURIComponent(magicToken)}`, { replace: true });
      } else {
        // This is a public review funnel link
        navigate(`/feedback?${searchParams.toString()}`, { replace: true });
      }
      return;
    }

    if (clientId) {
      // Plain clientId — public review funnel
      navigate(`/feedback?${searchParams.toString()}`, { replace: true });
    }
  }, [magicToken, clientId, navigate, searchParams]);

  // While redirecting, render nothing
  if (magicToken || clientId) return null;

  // No params — show the landing page
  return <LandingPage />;
}
