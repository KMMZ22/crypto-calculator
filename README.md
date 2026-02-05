# 🛡️ TradeGuard : L’Architecture de la Maîtrise du Risque Trading

> **"Arrêtez de perdre de l'argent par mauvaise gestion de risque."**

**TradeGuard** est une plateforme SaaS de gestion du risque et d'analyse de trades conçue pour les traders de crypto-monnaies, forex et indices. Contrairement aux calculateurs classiques, TradeGuard automatise la précision technique en 10 secondes pour éliminer les décisions émotionnelles et protéger votre capital.

---

## 🚀 Fonctionnalités Clés

### 1. Suite de Calculateurs Avancés (Hybride)
*   **Position Sizing Calculator :** Détermine la taille de position optimale en fonction de votre capital et du risque accepté (ex: 1-2%) pour garantir la survie du compte.
*   **P&L Calculator :** Planifiez vos rendements nets en incluant les frais d'échange (fees) et l'effet de levier pour visualiser le ROI réel avant d'entrer en position.
*   **Calculateurs Bonus :** Modules dédiés au **DCA** (moyenne à la baisse), aux prix de liquidation, au Critère de Kelly et au Break-even.

### 2. IA Trade Advisor (Plan ELITE)
Un mentor virtuel disponible 24/7 qui analyse vos setups :
*   Génère un **score de confiance (0-100)**.
*   Fournit des recommandations basées sur le ratio **Risk/Reward (R:R)** (ex: "Excellent setup" si R:R ≥ 2).

### 3. Gestion & Monitoring
*   **Multi-Position Management :** Gérez jusqu'à 10 positions simultanées (PRO) ou illimitées (ELITE) avec une vue d'ensemble du risque global.
*   **Journal de Trading Automatisé :** Sauvegardez vos calculs et exportez votre historique (PDF/CSV) pour un suivi de performance rigoureux.
*   **Données Live API :** Prix en temps réel via Binance, Bybit et CoinGecko pour éviter la saisie manuelle.

---

## 🛠️ Stack Technique

*   **Frontend :** React + Vite + Tailwind CSS.
*   **Backend :** Node.js + Express avec API REST.
*   **Base de données :** PostgreSQL via **Supabase**.
*   **Authentification :** Supabase Auth (JWT & OAuth).
*   **Hébergement :** Vercel / Netlify.

---

## 📦 Installation (Développement)

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/tradeguard-saas.git

# Installer les dépendances
npm install

# Configurer les variables d'environnement (.env)
VITE_SUPABASE_URL= 
VITE_SUPABASE_ANON_KEY=
VITE_BINANCE_API_KEY=

# Lancer l'application
npm run dev
```


---

## 🔒 Sécurité & Confidentialité
*   **Non-custodial :** TradeGuard ne se connecte jamais directement à vos fonds. Vos clés API restent chez vous.
*   **RGPD :** Hébergement sécurisé avec chiffrement de bout en bout.
*   **Validation :** Règles métiers strictes pour éviter les erreurs de saisie (ex: Stop Loss trop proche).

---

## 🗺️ Roadmap
- [ ] Intégration complète des webhooks Stripe (Q2 2024).
- [ ] Application mobile React Native (Q2 2024).
- [ ] Module de Backtesting avancé (Q3 2024).
- [ ] Solution White-label pour les communautés (Q4 2024).

---

