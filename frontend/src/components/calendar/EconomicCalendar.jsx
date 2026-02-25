// src/components/calendar/EconomicCalendar.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Globe, AlertCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const EconomicCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [country, setCountry] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);
  const [isMock, setIsMock] = useState(true); // Indique si on utilise les données mockées

  const countries = [
    { code: 'all', name: 'Tous les pays', flag: '🌍' },
    { code: 'US', name: 'États-Unis', flag: '🇺🇸' },
    { code: 'EU', name: 'Union Européenne', flag: '🇪🇺' },
    { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧' },
    { code: 'JP', name: 'Japon', flag: '🇯🇵' },
    { code: 'CN', name: 'Chine', flag: '🇨🇳' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australie', flag: '🇦🇺' },
    { code: 'CH', name: 'Suisse', flag: '🇨🇭' }
  ];

  // Données mockées (simulent des événements réels)
  const getMockEvents = () => {
    const baseDate = selectedDate.toISOString().split('T')[0];
    return [
      {
        id: 1,
        country: 'US',
        date: baseDate,
        time: '14:30',
        title: 'IPC (inflation)',
        importance: 3,
        forecast: '0.3%',
        previous: '0.2%',
        actual: '0.4%',
        currency: 'USD'
      },
      {
        id: 2,
        country: 'EU',
        date: baseDate,
        time: '11:00',
        title: 'Décision taux ECB',
        importance: 3,
        forecast: '4.25%',
        previous: '4.50%',
        actual: '-',
        currency: 'EUR'
      },
      {
        id: 3,
        country: 'GB',
        date: baseDate,
        time: '09:30',
        title: 'Ventes au détail',
        importance: 2,
        forecast: '0.5%',
        previous: '0.3%',
        actual: '-',
        currency: 'GBP'
      },
      {
        id: 4,
        country: 'JP',
        date: baseDate,
        time: '01:50',
        title: 'PIB (trimestriel)',
        importance: 3,
        forecast: '0.2%',
        previous: '0.1%',
        actual: '-',
        currency: 'JPY'
      },
      {
        id: 5,
        country: 'CA',
        date: baseDate,
        time: '15:30',
        title: 'Taux de chômage',
        importance: 3,
        forecast: '5.2%',
        previous: '5.3%',
        actual: '-',
        currency: 'CAD'
      }
    ];
  };

  // Simulation de chargement des données (sans appel API)
  const loadMockData = () => {
    setLoading(true);
    setTimeout(() => {
      setEvents(getMockEvents());
      setLoading(false);
      setError(null);
    }, 500); // petit délai pour simuler un chargement
  };

  // Chargement initial et lors des changements de date/pays/filtre
  useEffect(() => {
    loadMockData();
  }, [selectedDate, country, filter]); // on recharge les mockées à chaque changement

  const getImportanceColor = (level) => {
    switch(level) {
      case 3: return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 2: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 1: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getImportanceText = (level) => {
    switch(level) {
      case 3: return '🔴 HAUTE';
      case 2: return '🟡 MOYENNE';
      case 1: return '🔵 BASSE';
      default: return '⚪ INCONNUE';
    }
  };

  const getCountryFlag = (code) => {
    const c = countries.find(c => c.code === code);
    return c ? c.flag : '🌍';
  };

  // Filtrage par importance
  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'high' && event.importance === 3) return true;
    if (filter === 'medium' && event.importance === 2) return true;
    if (filter === 'low' && event.importance === 1) return true;
    return false;
  });

  return (
    <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#6366F1]/10 rounded-lg">
            <Calendar className="text-[#6366F1]" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Calendrier Économique</h2>
            <p className="text-sm text-gray-400">Événements mondiaux</p>
          </div>
        </div>
        
        {/* Badge "Démo" */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-medium">
            ⚡ DÉMO
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AlertCircle size={14} />
            <span>Données simulées</span>
          </div>
        </div>
      </div>

      {/* Bandeau d'information (disclaimer) */}
      <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-sm flex items-center gap-2">
        <AlertCircle size={16} />
        <span>
          📅 Calendrier en cours d'intégration – Les données affichées sont des exemples non réels.
          La version complète sera disponible prochainement.
        </span>
      </div>

      {/* Navigation date */}
      <div className="flex items-center justify-between mb-6 bg-[#1A1C20] rounded-lg p-2">
        <button
          onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
          className="p-1 hover:bg-[#1E1F23] rounded transition"
        >
          <ChevronLeft size={20} className="text-gray-400" />
        </button>
        
        <span className="text-white font-medium">
          {selectedDate.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
        </span>
        
        <button
          onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
          className="p-1 hover:bg-[#1E1F23] rounded transition"
        >
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Filtres */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Filtre pays */}
        <div className="flex items-center gap-2 bg-[#1A1C20] rounded-lg px-3 py-2 border border-[#1E1F23]">
          <Globe size={16} className="text-gray-400" />
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="flex-1 bg-transparent text-white focus:outline-none text-sm"
          >
            {countries.map(c => (
              <option key={c.code} value={c.code} className="bg-[#131517]">
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre importance */}
        <div className="flex items-center gap-2 bg-[#1A1C20] rounded-lg px-3 py-2 border border-[#1E1F23]">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 bg-transparent text-white focus:outline-none text-sm"
          >
            <option value="all" className="bg-[#131517]">⚪ Tous les impacts</option>
            <option value="high" className="bg-[#131517]">🔴 Impact haut</option>
            <option value="medium" className="bg-[#131517]">🟡 Impact moyen</option>
            <option value="low" className="bg-[#131517]">🔵 Impact bas</option>
          </select>
        </div>
      </div>

      {/* Liste des événements */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366F1] mx-auto"></div>
          <p className="mt-4 text-gray-400">Chargement des événements...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-[#1A1C20] rounded-lg">
          <Calendar className="text-gray-600 mx-auto mb-4" size={48} />
          <p className="text-gray-400">Aucun événement pour cette date</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-[#1A1C20] border border-[#1E1F23] rounded-lg p-4 hover:border-[#6366F1]/50 transition group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* En-tête avec pays et importance */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{getCountryFlag(event.country)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImportanceColor(event.importance)}`}>
                      {getImportanceText(event.importance)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {event.time}
                    </span>
                  </div>
                  
                  {/* Titre de l'événement */}
                  <h3 className="text-white font-medium mb-2 group-hover:text-[#6366F1] transition">
                    {event.title}
                  </h3>
                  
                  {/* Données économiques */}
                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Prévision</p>
                      <p className="text-white font-medium">
                        {event.forecast} {event.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Précédent</p>
                      <p className="text-gray-300">{event.previous} {event.currency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Actuel</p>
                      <p className={`font-medium ${
                        event.actual && event.actual !== '-' ? 
                        (parseFloat(event.actual) > parseFloat(event.forecast || 0) ? 'text-green-400' : 'text-red-400')
                        : 'text-gray-500'
                      }`}>
                        {event.actual} {event.currency}
                      </p>
                    </div>
                  </div>
                </div>
                
                <TrendingUp className="text-gray-500 group-hover:text-[#6366F1] transition" size={20} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Légende */}
      <div className="mt-6 pt-4 border-t border-[#1E1F23]">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-gray-400">Haut impact</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-gray-400">Moyen impact</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-gray-400">Bas impact</span>
            </div>
          </div>
          <span className="text-gray-500">
            {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EconomicCalendar;