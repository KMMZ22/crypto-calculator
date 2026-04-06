// src/components/Layout/Header.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronRight, Settings, LogOut, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import CalculatorsMenu from '../CalculatorsMenu';

const Header = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const isPro = profile?.subscription_plan === 'pro';
  const isElite = profile?.subscription_plan === 'elite';

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      try {
        const { error } = await supabase.auth.admin.deleteUser(user.id);
        if (!error) navigate('/');
      } catch (error) {
        console.error('Erreur suppression compte:', error);
      }
    }
  };

  return (
    <div className="border-b border-[#1E1F23] bg-[#0A0B0D] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Navigation */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="p-1.5 bg-[#6366F1]/10 rounded-lg border border-[#6366F1]/20">
                <Shield className="text-[#6366F1]" size={24} />
              </div>
              <span className="text-xl font-bold text-white">TradeGuard</span>
            </div>

            {/* Dashboard button - CORRIGÉ */}
            <button
              onClick={() => {
                if (setActiveTab) {
                  setActiveTab('resume');
                }
                navigate('/dashboard');
              }}
              className="px-3 py-2 rounded-lg transition text-gray-400 hover:text-white"
            >
              Dashboard
            </button>

            {/* Menu Calculateurs */}
            <CalculatorsMenu />

            {/* Calendrier */}
            <button
              onClick={() => navigate('/dashboard?tab=calendar')}
              className="px-3 py-2 rounded-lg transition text-gray-400 hover:text-white"
            >
              Calendrier
            </button>
          </div>

          {/* Petit bonhomme - Menu profil */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1E1F23] transition group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {profile?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">{profile?.username || 'Utilisateur'}</p>
                <p className="text-xs text-gray-400">{profile?.subscription_plan?.toUpperCase() || 'FREE'}</p>
              </div>
              <ChevronRight size={16} className={`text-gray-400 transition ${isProfileMenuOpen ? 'rotate-90' : ''}`} />
            </button>

            {isProfileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-[#131517] border border-[#1E1F23] rounded-xl shadow-2xl z-50">
                  <div className="p-4 border-b border-[#1E1F23]">
                    <p className="font-medium text-white">{profile?.username || 'Utilisateur'}</p>
                    <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${isElite ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        isPro ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          'bg-[#1E1F23] text-gray-400 border border-gray-700'
                        }`}>
                        {profile?.subscription_plan?.toUpperCase() || 'FREE'}
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => navigate('/settings')}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-[#1E1F23] rounded-lg transition flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Paramètres
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Déconnexion
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="w-full px-3 py-2 text-left text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition flex items-center gap-2"
                    >
                      <AlertCircle size={16} />
                      Supprimer le compte
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;