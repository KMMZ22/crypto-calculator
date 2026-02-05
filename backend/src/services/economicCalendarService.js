import NodeCache from 'node-cache';
import axios from 'axios';

const cache = new NodeCache({ stdTTL: 3600 }); // 1 heure de cache

class EconomicCalendarService {
    constructor() {
        // Plusieurs sources d'API pour le calendrier économique
        this.sources = {
            fcsApi: {
                url: 'https://fcsapi.com/api-v3/forex/economic_calendar',
                params: {
                    country: 'all',
                    access_key: process.env.FCS_API_KEY || 'demo'
                }
            },
            tradingEconomics: {
                url: 'https://api.tradingeconomics.com/calendar',
                params: {
                    c: process.env.TRADING_ECONOMICS_KEY || 'demo'
                }
            },
            alphaVantage: {
                url: 'https://www.alphavantage.co/query',
                params: {
                    function: 'ECONOMIC_CALENDAR',
                    apikey: process.env.ALPHA_VANTAGE_KEY || 'demo'
                }
            }
        };
    }

    /**
     * Récupère les événements économiques
     */
    async getEvents(fromDate = null, toDate = null, country = null, importance = null) {
        const cacheKey = `events:${fromDate}:${toDate}:${country}:${importance}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            let events = [];
            
            // Essayer FCS API d'abord
            events = await this.fetchFromFCS(fromDate, toDate, country, importance);
            
            // Si échec, essayer Trading Economics
            if (events.length === 0) {
                events = await this.fetchFromTradingEconomics(fromDate, toDate, country);
            }
            
            // Si toujours échec, utiliser des données mockées
            if (events.length === 0) {
                events = this.getMockEvents();
            }

            // Filtrer par importance si spécifié
            if (importance) {
                events = events.filter(event => 
                    this.mapImportanceLevel(event.importance) === importance
                );
            }

            // Trier par date
            events.sort((a, b) => new Date(a.date) - new Date(b.date));

            const result = {
                events,
                count: events.length,
                fromDate: fromDate || new Date().toISOString().split('T')[0],
                toDate: toDate || this.getNextWeekDate(),
                timestamp: new Date().toISOString()
            };

            cache.set(cacheKey, result);
            return result;

        } catch (error) {
            console.error('Economic calendar error:', error.message);
            
            // Fallback to mock data
            return {
                events: this.getMockEvents(),
                count: 10,
                fromDate: fromDate || new Date().toISOString().split('T')[0],
                toDate: toDate || this.getNextWeekDate(),
                timestamp: new Date().toISOString(),
                isMock: true
            };
        }
    }

    /**
     * FCS API (gratuit jusqu'à 100 requêtes/mois)
     */
    async fetchFromFCS(fromDate, toDate, country, importance) {
        try {
            const params = {
                ...this.sources.fcsApi.params,
                from: fromDate || new Date().toISOString().split('T')[0],
                to: toDate || this.getNextWeekDate()
            };

            if (country && country !== 'all') {
                params.country = country;
            }

            const response = await axios.get(this.sources.fcsApi.url, {
                params,
                timeout: 10000
            });

            if (response.data && response.data.response) {
                return response.data.response.map(event => ({
                    id: event.id,
                    title: event.title,
                    country: event.country,
                    date: event.date,
                    time: event.time,
                    importance: this.mapImportance(event.impact),
                    actual: event.actual,
                    forecast: event.forecast,
                    previous: event.previous,
                    currency: event.currency,
                    description: event.description,
                    source: 'fcs'
                }));
            }
        } catch (error) {
            console.log('FCS API failed:', error.message);
        }
        return [];
    }

    /**
     * Trading Economics API
     */
    async fetchFromTradingEconomics(fromDate, toDate, country) {
        try {
            const params = {
                ...this.sources.tradingEconomics.params,
                from: fromDate || new Date().toISOString().split('T')[0],
                to: toDate || this.getNextWeekDate()
            };

            if (country && country !== 'all') {
                params.country = country;
            }

            const response = await axios.get(this.sources.tradingEconomics.url, {
                params,
                timeout: 10000
            });

            if (Array.isArray(response.data)) {
                return response.data.map(event => ({
                    id: event.CalendarId,
                    title: event.Event,
                    country: event.Country,
                    date: event.Date.split('T')[0],
                    time: event.Date.split('T')[1]?.split(':')[0] + ':00',
                    importance: this.mapImportance(event.Importance),
                    actual: event.Actual,
                    forecast: event.Forecast,
                    previous: event.Previous,
                    currency: event.Currency,
                    description: event.Description,
                    source: 'tradingeconomics'
                }));
            }
        } catch (error) {
            console.log('Trading Economics API failed:', error.message);
        }
        return [];
    }

    /**
     * Mapper l'importance
     */
    mapImportance(impact) {
        const impactMap = {
            'high': 3,
            'medium': 2,
            'low': 1,
            '3': 3,
            '2': 2,
            '1': 1
        };
        return impactMap[impact?.toString().toLowerCase()] || 2;
    }

    mapImportanceLevel(level) {
        const levelMap = {
            3: 'high',
            2: 'medium',
            1: 'low'
        };
        return levelMap[level] || 'medium';
    }

    /**
     * Données mockées pour développement
     */
    getMockEvents() {
        const countries = ['US', 'EU', 'GB', 'JP', 'CN', 'CA', 'AU'];
        const eventsList = [
            'GDP Growth Rate',
            'Inflation Rate',
            'Unemployment Rate',
            'Interest Rate Decision',
            'Consumer Confidence',
            'Manufacturing PMI',
            'Services PMI',
            'Retail Sales',
            'Trade Balance',
            'CPI (Consumer Price Index)'
        ];

        const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD'];
        
        const mockEvents = [];
        const today = new Date();
        
        for (let i = 0; i < 15; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            
            const country = countries[Math.floor(Math.random() * countries.length)];
            const event = eventsList[Math.floor(Math.random() * eventsList.length)];
            const importance = Math.floor(Math.random() * 3) + 1;
            
            mockEvents.push({
                id: `mock_${i}`,
                title: `${country} ${event}`,
                country,
                date: date.toISOString().split('T')[0],
                time: `${Math.floor(Math.random() * 12) + 9}:00`, // Entre 9h et 20h
                importance,
                actual: importance === 3 ? (Math.random() * 5 + 1).toFixed(1) : null,
                forecast: (Math.random() * 5 + 1).toFixed(1),
                previous: (Math.random() * 5).toFixed(1),
                currency: currencies[countries.indexOf(country)] || 'USD',
                description: `Economic indicator showing ${event.toLowerCase()} for ${country}`,
                source: 'mock'
            });
        }
        
        return mockEvents;
    }

    /**
     * Date de la semaine prochaine
     */
    getNextWeekDate() {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toISOString().split('T')[0];
    }

    /**
     * Événements par importance
     */
    async getEventsByImportance(importance) {
        const events = await this.getEvents();
        return events.events.filter(event => event.importance === importance);
    }

    /**
     * Événements par pays
     */
    async getEventsByCountry(country) {
        const events = await this.getEvents();
        return events.events.filter(event => event.country === country.toUpperCase());
    }

    /**
     * Événements à venir (aujourd'hui et demain)
     */
    async getUpcomingEvents(days = 2) {
        const today = new Date().toISOString().split('T')[0];
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + days);
        const toDate = endDate.toISOString().split('T')[0];
        
        return await this.getEvents(today, toDate);
    }
}

export default new EconomicCalendarService();