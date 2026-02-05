import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Globe, AlertCircle } from 'lucide-react';

const EconomicCalendar = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, high, medium, low
    const [country, setCountry] = useState('all');

    const countries = [
        { code: 'all', name: 'Tous les pays' },
        { code: 'US', name: 'États-Unis' },
        { code: 'EU', name: 'Union Européenne' },
        { code: 'GB', name: 'Royaume-Uni' },
        { code: 'JP', name: 'Japon' },
        { code: 'CN', name: 'Chine' },
        { code: 'CA', name: 'Canada' },
        { code: 'AU', name: 'Australie' }
    ];

    const fetchEvents = async () => {
        try {
            setLoading(true);
            let url = '/api/economic-calendar';
            const params = new URLSearchParams();
            
            if (country !== 'all') params.append('country', country);
            if (filter !== 'all') params.append('importance', filter);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                setEvents(data.events);
            }
        } catch (error) {
            console.error('Error fetching economic calendar:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
        // Rafraîchir toutes les heures
        const interval = setInterval(fetchEvents, 3600000);
        return () => clearInterval(interval);
    }, [filter, country]);

    const getImportanceColor = (level) => {
        switch(level) {
            case 3: return 'bg-red-100 text-red-800 border-red-200';
            case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 1: return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getImportanceText = (level) => {
        switch(level) {
            case 3: return 'Haute';
            case 2: return 'Moyenne';
            case 1: return 'Basse';
            default: return 'Inconnue';
        }
    };

    const formatTime = (dateStr, timeStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(`${dateStr}T${timeStr || '00:00'}`);
        return date.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'Europe/Paris'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-800">
                        Calendrier Économique
                    </h2>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>Actualisé toutes les heures</span>
                </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        {countries.map(c => (
                            <option key={c.code} value={c.code}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Tous
                    </button>
                    <button
                        onClick={() => setFilter('high')}
                        className={`px-4 py-2 rounded-lg ${filter === 'high' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Haute Importance
                    </button>
                    <button
                        onClick={() => setFilter('medium')}
                        className={`px-4 py-2 rounded-lg ${filter === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                        Moyenne
                    </button>
                </div>
            </div>

            {/* Liste des événements */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des événements...</p>
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun événement économique à afficher</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.slice(0, 10).map((event) => (
                        <div 
                            key={event.id} 
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getImportanceColor(event.importance)}`}>
                                            {getImportanceText(event.importance)}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {event.country} • {event.date}
                                        </span>
                                        <span className="text-sm font-medium text-blue-600">
                                            {formatTime(event.date, event.time)}
                                        </span>
                                    </div>
                                    
                                    <h3 className="font-semibold text-gray-800 mb-1">
                                        {event.title}
                                    </h3>
                                    
                                    {event.description && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            {event.description}
                                        </p>
                                    )}

                                    {/* Données économiques */}
                                    <div className="flex flex-wrap gap-4 mt-3">
                                        {event.forecast && (
                                            <div className="text-sm">
                                                <span className="text-gray-500">Prévision: </span>
                                                <span className="font-medium">{event.forecast}</span>
                                                {event.currency && ` ${event.currency}`}
                                            </div>
                                        )}
                                        
                                        {event.previous && (
                                            <div className="text-sm">
                                                <span className="text-gray-500">Précédent: </span>
                                                <span className="font-medium">{event.previous}</span>
                                            </div>
                                        )}
                                        
                                        {event.actual && (
                                            <div className="text-sm">
                                                <span className="text-gray-500">Actuel: </span>
                                                <span className={`font-medium ${parseFloat(event.actual) > parseFloat(event.forecast || 0) ? 'text-green-600' : 'text-red-600'}`}>
                                                    {event.actual}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="ml-4">
                                    <TrendingUp className="w-5 h-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                        <span className="font-medium">{events.length}</span> événements trouvés
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span>Haute importance</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span>Moyenne</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EconomicCalendar;