import axios from 'axios';

class EconomicCalendarService {
    async getCalendar(from, to, country = 'US') {
        try {
            const response = await axios.get('https://financialmodelingprep.com/api/v3/economic_calendar', {
                params: {
                    from,
                    to,
                    apikey: process.env.FMP_API_KEY || 'demo'
                }
            });
            
            const events = response.data.filter(event => 
                event.country === country
            );
            
            return {
                success: true,
                events,
                count: events.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new EconomicCalendarService();