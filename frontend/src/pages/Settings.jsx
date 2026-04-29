import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Layout/Header';
import { 
  ArrowLeft, Settings as SettingsIcon, Globe, 
  DollarSign, Calculator, Lock, User, 
  Bell, Save, CheckCircle
} from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  // États locaux (Placeholders)
  const [saved, setSaved] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('FR');
  const [defaultRisk, setDefaultRisk] = useState('2');
  const [defaultFee, setDefaultFee] = useState('0.1');

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D]">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
          >
            <ArrowLeft size={20} />
            Retour au Dashboard
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#6366F1]/10 rounded-xl">
              <SettingsIcon className="text-[#6366F1]" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Paramètres</h1>
              <p className="text-gray-400 mt-1">Gérez vos préférences et votre compte personnel</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section: Affichage & Personnalisation */}
          <div className="bg-[#131517] border border-[#1E1F23] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-[#1E1F23] pb-4">
              <Globe className="text-[#6366F1]" size={20} />
              Préférences d'Affichage
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Langue de l'interface</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#0A0B0D] border border-[#1E1F23] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#6366F1] transition appearance-none"
                >
                  <option value="FR">Français (France)</option>
                  <option value="EN">English (US)</option>
                  <option value="ES">Español (España)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Devise Principale</label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-[#0A0B0D] border border-[#1E1F23] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#6366F1] transition appearance-none"
                >
                  <option value="USD">Dollar Américain (USD $)</option>
                  <option value="EUR">Euro (EUR €)</option>
                  <option value="GBP">Livre Sterling (GBP £)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Calculateurs */}
          <div className="bg-[#131517] border border-[#1E1F23] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-[#1E1F23] pb-4">
              <Calculator className="text-green-500" size={20} />
              Valeurs par Défaut (Calculateurs)
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Risque Standard par Trade (%)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={defaultRisk}
                    onChange={(e) => setDefaultRisk(e.target.value)}
                    className="w-full bg-[#0A0B0D] border border-[#1E1F23] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
                    placeholder="2.0"
                  />
                  <span className="inline-flex items-center px-4 bg-[#1E1F23] text-gray-400 rounded-lg">%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Frais de plateforme (Moyenne)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    step="0.01"
                    value={defaultFee}
                    onChange={(e) => setDefaultFee(e.target.value)}
                    className="w-full bg-[#0A0B0D] border border-[#1E1F23] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition"
                    placeholder="0.1"
                  />
                  <span className="inline-flex items-center px-4 bg-[#1E1F23] text-gray-400 rounded-lg">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Compte & Sécurité */}
          <div className="bg-[#131517] border border-[#1E1F23] rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-[#1E1F23] pb-4">
              <User className="text-blue-500" size={20} />
              Informations du Compte
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Adresse E-mail</label>
                <input 
                  type="email" 
                  disabled
                  value={user?.email || 'Non connecté'}
                  className="w-full bg-[#0A0B0D] border border-[#1E1F23] rounded-lg px-4 py-3 text-gray-500 opacity-70 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-2">L'adresse email ne peut pas être modifiée pour le moment.</p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button 
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 border border-[#1E1F23] text-gray-300 rounded-lg hover:text-white hover:bg-[#1E1F23] transition"
                >
                  <Lock size={16} />
                  Réinitialiser le mot de passe
                </button>
                <button 
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition"
                >
                  Supprimer le compte
                </button>
              </div>
            </div>
          </div>

          {/* Sauvegarde */}
          <div className="flex items-center justify-end gap-4 pt-4">
            {saved && (
              <span className="flex items-center gap-2 text-green-400 font-medium animate-pulse">
                <CheckCircle size={18} />
                Préférences sauvegardées !
              </span>
            )}
            <button
              type="submit"
              className="px-8 py-3 bg-[#6366F1] text-white font-bold rounded-xl hover:bg-[#4F51D8] transition shadow-lg shadow-[#6366F1]/20 flex items-center gap-2"
            >
              <Save size={20} />
              Enregistrer les modifications
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
