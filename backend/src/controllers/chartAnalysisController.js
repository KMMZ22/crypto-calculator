const multer = require('multer');
const { OpenAI } = require('openai');
const { supabaseAdmin } = require('../config/supabase');

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // max 5MB
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Plans et quotas (à ajuster selon votre grille tarifaire)
const PLAN_LIMITS = {
    FREE: 2,   // 2 analyses par mois
    PRO: 50,   // 50 analyses par mois
    ELITE: 200 // 200 analyses par mois
};

const analyzeChart = [
    upload.single('chart'),
    async (req, res) => {
        try {
            const userId = req.user.id;
            // We expect req.user.subscription_plan from authMiddleware
            const userPlan = req.user.subscription_plan || 'FREE';
            const tool = 'chart_analysis';

            // 1. Vérifier le quota mensuel
            const { data: usage, error: usageError } = await supabaseAdmin
                .from('usage_logs')
                .select('count, updated_at')
                .eq('user_id', userId)
                .eq('tool', tool)
                .maybeSingle();

            if (usageError) throw usageError;

            let used = usage?.count || 0;
            const lastUpdate = usage?.updated_at ? new Date(usage.updated_at) : null;
            const now = new Date();

            // Réinitialisation mensuelle automatique
            if (lastUpdate && lastUpdate.getMonth() !== now.getMonth()) {
                // On repart de 0
                used = 0;
            }

            const max = PLAN_LIMITS[userPlan] || 0;
            if (used >= max && userPlan !== 'ADMIN') {
                return res.status(403).json({
                    error: 'Quota dépassé',
                    message: `Vous avez utilisé vos ${max} analyses mensuelles. Passez à un plan supérieur ou attendez le mois prochain.`
                });
            }

            // 2. Vérifier que l'image est présente
            if (!req.file) {
                return res.status(400).json({ error: 'Image requise' });
            }

            // 3. Convertir l'image en base64
            const base64Image = req.file.buffer.toString('base64');

            // 4. Appeler GPT-4 Vision
            const response = await openai.chat.completions.create({
                model: 'gpt-4o', // using gpt-4o as gpt-4-vision-preview is deprecated usually, or gpt-4-turbo
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: `Tu es un expert en analyse technique de cryptomonnaies. Analyse cette image d'un graphique en chandeliers. Identifie :
                - La tendance générale (haussière, baissière, range)
                - Les principaux niveaux de support et résistance (liste de prix approximatifs)
                - Les patterns chartistes visibles (tête-épaules, double sommet, drapeau, etc.)
                - Fournis une suggestion de trade avec un point d'entrée, un stop-loss, un take-profit, et un ratio risque/rendement.
                Retourne la réponse UNIQUEMENT au format JSON avec les clés exactes sans texte avant ou après : {"trend": "", "support_levels": [], "resistance_levels": [], "patterns": [], "trade_suggestion": {"entry": "", "stopLoss": "", "takeProfit": "", "riskReward": ""}}`
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:${req.file.mimetype};base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000,
                temperature: 0.3
            });

            const analysisText = response.choices[0].message.content;
            let analysisJson;
            try {
                const cleanedText = analysisText.replace(/```json/g, '').replace(/```/g, '').trim();
                const jsonMatch = cleanedText.match(/\{.*\}/s);
                if (jsonMatch) {
                    analysisJson = JSON.parse(jsonMatch[0]);
                } else {
                    try {
                        analysisJson = JSON.parse(cleanedText);
                    } catch (e2) {
                        throw new Error('Pas de JSON trouvé');
                    }
                }
            } catch (e) {
                console.error('JSON parsing error:', e, 'Raw context:', analysisText);
                analysisJson = { raw: analysisText };
            }

            // 5. Incrémenter le compteur d'utilisation
            await supabaseAdmin
                .from('usage_logs')
                .upsert(
                    {
                        user_id: userId,
                        tool,
                        count: used + 1,
                        updated_at: new Date().toISOString()
                    },
                    { onConflict: 'user_id, tool' }
                );

            // 6. (Optionnel) Sauvegarder l'analyse dans une table dédiée
            try {
                await supabaseAdmin
                    .from('chart_analyses')
                    .insert({
                        user_id: userId,
                        image_url: '', // pas stockée pour le moment
                        result: analysisJson,
                        created_at: new Date().toISOString()
                    });
            } catch (insertError) {
                console.warn('Could not insert into chart_analyses (table might not exist yet)', insertError.message);
            }

            res.json({ success: true, analysis: analysisJson });
        } catch (error) {
            console.error('❌ Erreur analyse:', error);
            res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
        }
    }
];

module.exports = {
    analyzeChart
};
