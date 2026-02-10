// src/pages/Auth.jsx - VERSION REDIRECT
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';

  useEffect(() => {
    // Redirige vers la bonne page Clerk
    if (mode === 'login') {
      navigate('/login');
    } else {
      navigate('/signup');
    }
  }, [mode, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Redirection vers l'authentification...</p>
      </div>
    </div>
  );
}