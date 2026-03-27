import { useEffect } from 'react';
import { useNavigate } from 'react-router';

// Dashboard just redirects to workspace — the workspace IS the main experience
export function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/workspace', { replace: true }); }, [navigate]);
  return null;
}
