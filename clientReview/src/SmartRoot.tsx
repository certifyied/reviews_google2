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

/**
 * SmartRoot: sits at "/" and "/index.html" of clientReview.
 *
 * Routing logic for incoming magic_token / clientId:
 *  - magic_token with isClientPortal=true  → /login?magic_token=...  (AuthPortal verifies & goes to dashboard)
 *  - magic_token with isClientPortal=false → /feedback?magic_token=... (public review funnel)
 *  - plain clientId                        → /feedback?clientId=...   (public review funnel)
 *  - no params                             → LandingPage
 */
export default function SmartRoot() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const clientId   = searchParams.get('clientId');
  const magicToken = searchParams.get('magic_token');

  useEffect(() => {
    if (magicToken) {
      const payload = decodeJwtPayload(magicToken);
      const isClientPortal = payload?.isClientPortal === true;

      if (isClientPortal) {
        // This is a dashboard login link — send to AuthPortal which will verify & redirect to /dashboard
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
