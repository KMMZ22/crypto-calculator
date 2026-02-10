// /src/lib/supabase.js (garder celui-ci)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔧 Supabase Config:')
console.log('URL:', supabaseUrl || '❌ MANQUANT')
console.log('Key:', supabaseAnonKey ? '✅ PRÉSENT' : '❌ MANQUANT')

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: localStorage
    }
  }
)