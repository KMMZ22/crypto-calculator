const Stripe = require('stripe');

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Price IDs mapping
const STRIPE_PRICE_IDS = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  PRO_YEARLY: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
  ELITE_MONTHLY: process.env.STRIPE_ELITE_MONTHLY_PRICE_ID,
  ELITE_YEARLY: process.env.STRIPE_ELITE_YEARLY_PRICE_ID
};

// Plan to price mapping
const PLAN_TO_PRICE_ID = {
  PRO: {
    monthly: STRIPE_PRICE_IDS.PRO_MONTHLY,
    yearly: STRIPE_PRICE_IDS.PRO_YEARLY
  },
  ELITE: {
    monthly: STRIPE_PRICE_IDS.ELITE_MONTHLY,
    yearly: STRIPE_PRICE_IDS.ELITE_YEARLY
  }
};

module.exports = {
  stripe,
  STRIPE_PRICE_IDS,
  PLAN_TO_PRICE_ID
};