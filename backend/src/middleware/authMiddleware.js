import authService from '../services/authService.js';

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const token = authHeader.split(' ')[1];
        
        // Vérifier le token avec Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            error: 'Authentication failed'
        });
    }
};

export const requireElite = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        // Vérifier si l'utilisateur a le plan ELITE
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('subscription_plan, subscription_expires_at')
            .eq('id', req.user.id)
            .single();

        if (!profile || profile.subscription_plan !== 'ELITE') {
            return res.status(403).json({
                success: false,
                error: 'ELITE subscription required',
                required_plan: 'ELITE',
                current_plan: profile?.subscription_plan || 'none'
            });
        }

        // Vérifier si l'abonnement est toujours valide
        if (profile.subscription_expires_at && new Date(profile.subscription_expires_at) < new Date()) {
            return res.status(403).json({
                success: false,
                error: 'ELITE subscription has expired',
                expired_at: profile.subscription_expires_at
            });
        }

        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Authorization check failed'
        });
    }
};