import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est connecté au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('tradeguard_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Inscription
  const signup = async (username, email, password) => {
    // Validation simple
    if (password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
    }

    // Simuler une requête API
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: Date.now(),
          username,
          email,
          plan: 'FREE', // Par défaut FREE
          createdAt: new Date().toISOString()
        };
        
        setUser(newUser);
        localStorage.setItem('tradeguard_user', JSON.stringify(newUser));
        resolve(newUser);
      }, 500);
    });
  };

  // Connexion
  const login = async (email, password) => {
    // Simuler une vérification
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const savedUser = localStorage.getItem('tradeguard_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          if (userData.email === email) {
            setUser(userData);
            resolve(userData);
          } else {
            reject(new Error('Email ou mot de passe incorrect'));
          }
        } else {
          reject(new Error('Utilisateur non trouvé'));
        }
      }, 500);
    });
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem('tradeguard_user');
  };

  // Mettre à jour le plan
  const upgradePlan = (newPlan) => {
    if (!user) return;
    
    const updatedUser = { ...user, plan: newPlan };
    setUser(updatedUser);
    localStorage.setItem('tradeguard_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    upgradePlan
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};