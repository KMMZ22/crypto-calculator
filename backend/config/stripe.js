// backend/src/config/supabase.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Client pour les opérations côté serveur (admin)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Client pour les opérations côté client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Test de connexion
async function testConnection() {
  try {
    const { data, error } = await supabase.from('user_profiles').select('count');
    if (error) throw error;
    console.log('✅ Connexion Supabase réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur connexion Supabase:', error.message);
    return false;
  }
}

module.exports = {
  supabase,
  supabaseAdmin,
  testConnection
};