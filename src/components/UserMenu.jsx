import { useState, useEffect, useRef } from 'react';
import './UserMenu.css';
import { supabase } from '../services/supabase';

export function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

    const userData = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Trader',
    email: user?.email || 'Non connecté',
    subscription: {
      status: 'active',
      plan: 'TradeGuard PRO',
      renewalDate: '23/02/2024'
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) && 
        buttonRef.current && 
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

    const handleLogout = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await supabase.auth.signOut();
      window.location.href = '/';
    }
  };

  return (
    <div className="user-menu-container">
      <button 
        ref={buttonRef}
        className="user-menu-btn" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu utilisateur"
      >
        {/* Icône profil avec style qui correspond à ton dashboard */}
        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </button>
      
      <div 
        ref={menuRef}
        className={`user-dropdown ${isMenuOpen ? 'show' : ''}`}
      >
        <div className="dropdown-header">
          <div className="user-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div className="user-details">
            <h4>{userData.name}</h4>
            <p>{userData.email}</p>
          </div>
        </div>
        
        <div className="dropdown-content">
          <div className="subscription-info">
            <div className="status-item">
              <span className="label">État :</span>
              <span className="status active">Actif ✓</span>
            </div>
            <div className="status-item">
              <span className="label">Plan :</span>
              <span className="plan pro">{userData.subscription.plan}</span>
            </div>
            <div className="status-item">
              <span className="label">Renouvellement :</span>
              <span className="date">{userData.subscription.renewalDate}</span>
            </div>
          </div>
          
          <div className="dropdown-actions">
            <button className="dropdown-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              Modifier le profil
            </button>
            <button className="dropdown-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 9V7a2 2 0 0 0-2-2h-6"></path>
                <path d="M4 15h16"></path>
                <path d="M10 5v14"></path>
                <path d="M4 5h16"></path>
              </svg>
              Gérer l'abonnement
            </button>
            <button className="dropdown-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8v4"></path>
                <path d="M12 16h.01"></path>
              </svg>
              Aide & Support
            </button>
          </div>
          
          <div className="dropdown-footer">
            <button className="logout-btn" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}