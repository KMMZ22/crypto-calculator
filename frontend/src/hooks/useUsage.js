// src/hooks/useUsage.js
// Gestion du quota d'utilisation pour les guests et les utilisateurs gratuits
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const [remaining, setRemaining] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    // Visiteur non-connecté
                    setIsGuest(true);
                    const data = getUsageData(feature);
                    setRemaining(Math.max(0, GUEST_LIMIT - data.count));
                } else {
                    // Vérifier plan depuis profil
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('subscription_plan')
                        .eq('id', user.id)
                        .maybeSingle();

                    // Tout utilisateur connecté → accès illimité
                    setRemaining(Infinity);
                    setIsGuest(false);

                }
            } catch (err) {
                console.error('useUsage error:', err);
                // En cas d'erreur, traiter comme guest
                setIsGuest(true);
                setRemaining(GUEST_LIMIT);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [feature]);

    const incrementUsage = async () => {
        if (remaining === Infinity) return; // illimité, pas de comptage

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const key = user ? `${feature}_${user.id}` : feature;
            const data = getUsageData(key);
            const next = { count: data.count + 1, date: new Date().toDateString() };
            saveUsageData(key, next);

            const limit = isGuest ? GUEST_LIMIT : free_LIMIT;
            setRemaining(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('incrementUsage error:', err);
        }
    };

    return { remaining, loading, isGuest, incrementUsage };
}
