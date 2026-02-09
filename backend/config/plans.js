// config/plans.js
export const PLANS = {
    FREE: {
        name: 'Gratuit',
        price_monthly: 0,
        price_yearly: 0,
        stripe_price_id_monthly: null,
        stripe_price_id_yearly: null,
        features: {
            basic_calculator: true,
            price_data: true,
            calculations_per_day: 10,
            basic_support: false
        }
    },
    PRO: {
        name: 'Pro Trader',
        price_monthly: 19.00,
        price_yearly: 170.00,
        stripe_price_id_monthly: 'prod_TsQZQprLYEJIN6', // REMPLACE
        stripe_price_id_yearly: 'prod_Tw4nKnZwhGDXiK',  // REMPLACE
        features: {
            basic_calculator: true,
            price_data: true,
            calculations_per_day: 100,
            basic_support: true,
            economic_calendar: true,
            save_calculations: true,
            advanced_metrics: true
        }
    },
    ELITE: {
        name: 'Elite Institution',
        price_monthly: 49.00,
        price_yearly: 470.00,
        stripe_price_id_monthly: 'prod_TsQaoxNKwICKYd', // REMPLACE
        stripe_price_id_yearly: 'prod_Tw4mRDMdooQesI',  // REMPLACE
        features: {
            all_calculators: true,
            unlimited_calculations: true,
            economic_calendar: true,
            save_calculations: true,
            advanced_metrics: true,
            ai_predictions: true,
            custom_strategies: true,
            api_access: true,
            priority_support: true
        }
    }
};