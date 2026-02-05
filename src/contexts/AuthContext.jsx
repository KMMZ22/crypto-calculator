// /src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
// ⚠️ CORRECTION : Importe depuis le bon fichier
import { authService } from '../services/authService' // si authService.js existe dans /src/services
// OU
// import { authService } from './authService' // si dans le même dossier
// OU si tu n'as pas encore créé authService, utilise directement supabase :
import { supabase } from '../lib/supabase'

// Version simplifiée sans authService
const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier l'utilisateur au chargement
    checkUser()
    
    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth event:', event, session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
          await fetchProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('👤 Current user:', user?.email)
      setUser(user)
      if (user) {
        await fetchProfile(user.id)
      }
    } catch (error) {
      console.error('❌ Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Error fetching profile:', error)
        // Peut-être le profil n'existe pas encore
        if (error.code === 'PGRST116') {
          console.log('Profile not found, will create later')
        }
      } else {
        setProfile(data)
        console.log('📋 Profile loaded:', data.email)
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    }
  }

  const signUp = async (email, password, userData = {}) => {
    setLoading(true)
    try {
      console.log('📝 Signing up:', email)
      
      // 1. Créer l'utilisateur dans auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) throw error
      
      // 2. Créer le profil dans public.profiles
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            email: email,
            username: userData.username || email.split('@')[0],
            full_name: userData.full_name || '',
            subscription_plan: 'free',
            credits: 10
          }])
        
        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Continue quand même - le profil peut être créé plus tard
        }
        
        // 3. Créer les crédits IA
        await supabase
          .from('ai_credits')
          .insert([{
            user_id: data.user.id,
            remaining_credits: 50
          }])
        
        setUser(data.user)
        await fetchProfile(data.user.id)
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('❌ Sign up error:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    setLoading(true)
    try {
      console.log('🔑 Signing in:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      setUser(data.user)
      await fetchProfile(data.user.id)
      
      return { data, error: null }
    } catch (error) {
      console.error('❌ Sign in error:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      console.log('👋 User signed out')
    } catch (error) {
      console.error('❌ Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: 'No user' }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
      
      if (error) throw error
      
      // Mettre à jour l'état local
      setProfile(prev => ({ ...prev, ...updates }))
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile: () => user && fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}