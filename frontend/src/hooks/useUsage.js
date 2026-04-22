// src/hooks/useUsage.js
// Gestion du quota d'utilisation pour les guests et les utilisateurs gratuits
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const GUEST_LIMIT = 10;
const free_LIMIT = 10;

function getStorageKey(feature) {
    return `tg_usage_${feature}`;
}

function getUsageData(feature) {
    try {
        const raw = localStorage.getItem(getStorageKey(feature));
        if (!raw) return { count: 0, date: new Date().toDateString() };
        const data = JSON.parse(raw);
        if (data.date !== new Date().toDateString()) {
            return { count: 0, date: new Date().toDateString() };
        }
        return data;
    } catch {
        return { count: 0, date: new Date().toDateString() };
    }
}

function saveUsageData(feature, data) {
    localStorage.setItem(getStorageKey(feature), JSON.stringify(data));
}

/**
 * @param {string} feature  identifiant de la fonctionnalité ('chart', 'calc', etc.)
 * @returns {{ remaining: number|null, loading: boolean, isGuest: boolean, incrementUsage: () => void }}
 */
export function useUsage(feature) {
    const { user, profile, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const [remaining, setRemaining] = useState(null);

    useEffect(() => {
        // On attend que l'AuthContext ait fini de charger la session
        if (authLoading) {
            setLoading(true);
            return;
        }

        try {
            if (!user) {
                // Visiteur non-connecté
                setIsGuest(true);
                const data = getUsageData(feature);
                setRemaining(Math.max(0, GUEST_LIMIT - data.count));
            } else {
                // Si l'utilisateur est connecté, on considère l'accès illimité (ou selon le plan)
                setRemaining(Infinity);
                setIsGuest(false);
            }
        } catch (err) {
            console.error('useUsage error:', err);
            // En cas d'erreur de traitement, traiter comme guest par précaution
            setIsGuest(true);
            setRemaining(GUEST_LIMIT);
        } finally {
            setLoading(false);
        }
    }, [feature, user, authLoading, profile]);

    const incrementUsage = async () => {
        if (remaining === Infinity) return; // illimité, pas de comptage

        try {
            const key = user ? `${feature}_${user.id}` : feature;
            const data = getUsageData(key);
            const next = { count: data.count + 1, date: new Date().toDateString() };
            saveUsageData(key, next);

            setRemaining(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('incrementUsage error:', err);
        }
    };

    return { remaining, loading, isGuest, incrementUsage };
}
