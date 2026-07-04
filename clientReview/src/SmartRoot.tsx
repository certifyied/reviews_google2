import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

/**
 * SmartRoot: sits at "/" of clientReview.
 * - If URL has ?clientId=... or ?magic_token=..., redirect to /feedback with those params.
 * - Otherwise show the landing page.
 */
export default function SmartRoot() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const clientId = searchParams.get('clientId');
  const magicToken = searchParams.get('magic_token');

  useEffect(() => {
    if (clientId || magicToken) {
      // Forward all query params to /feedback
      navigate(`/feedback?${searchParams.toString()}`, { replace: true });
    }
  }, [clientId, magicToken, navigate, searchParams]);

  // If there's a token/clientId, show nothing while redirecting
  if (clientId || magicToken) return null;

  // No params — show the landing page
  return <LandingPage />;
}
