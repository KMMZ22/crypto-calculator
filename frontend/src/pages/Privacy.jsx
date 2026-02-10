import React from 'react';
import { Shield, Lock, Eye, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation identique à Terms */}
      <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                TradeGuard
              </span>
            </Link>
            <Link 
              to="/"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Lock className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold">Politique de confidentialité</h1>
          </div>
          <p className="text-slate-400">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Collecte des données</h2>
            <p className="text-slate-300 mb-3">
              Nous collectons le minimum nécessaire pour fournir nos services :
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-6 h-6 text-cyan-400" />
                  <h3 className="font-bold">Données collectées</h3>
                </div>
                <ul className="list-disc pl-5 text-slate-300 space-y-1 text-sm">
                  <li>Adresse email (authentification)</li>
                  <li>Date d'inscription</li>
                  <li>Type d'abonnement</li>
                  <li>Données d'utilisation anonymisées</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Eye className="w-6 h-6 text-red-400" />
                  <h3 className="font-bold">Données NON collectées</h3>
                </div>
                <ul className="list-disc pl-5 text-slate-300 space-y-1 text-sm">
                  <li>Clés API d'exchange</li>
                  <li>Informations bancaires</li>
                  <li>Documents d'identité</li>
                  <li>Historique de trading détaillé</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Utilisation des données</h2>
            <p className="text-slate-300 mb-3">
              Vos données sont utilisées uniquement pour :
            </p>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
              <li>Fournir et améliorer nos services</li>
              <li>Gérer votre compte et abonnement</li>
              <li>Vous envoyer des notifications importantes</li>
              <li>Améliorer la sécurité de la plateforme</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Protection des données</h2>
            <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 mb-3">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="font-bold text-green-400">Sécurité maximale</h3>
                  <p className="text-slate-300 text-sm">
                    Vos données sont chiffrées en transit (SSL/TLS) et au repos. Conforme RGPD.
                  </p>
                </div>
              </div>
            </div>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
              <li>Chiffrement AES-256 pour les données sensibles</li>
              <li>Authentification à deux facteurs disponible</li>
              <li>Audits de sécurité réguliers</li>
              <li>Hébergement en Union Européenne</li>
              <li>Accès restreint au personnel autorisé</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Partage des données</h2>
            <p className="text-slate-300 mb-3">
              Nous ne vendons ni ne louons vos données à des tiers. Partage uniquement avec :
            </p>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
              <li>Stripe (traitement des paiements)</li>
              <li>Supabase (hébergement base de données)</li>
              <li>Fournisseurs de support technique</li>
              <li>Autorités légales si requis par la loi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Vos droits RGPD</h2>
            <p className="text-slate-300 mb-3">
              Conformément au RGPD, vous avez le droit de :
            </p>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
              <li>Accéder à vos données personnelles</li>
              <li>Corriger des données inexactes</li>
              <li>Supprimer votre compte et vos données</li>
              <li>Vous opposer au traitement de vos données</li>
              <li>Exporter vos données dans un format lisible</li>
            </ul>
            <p className="text-slate-300 mt-3">
              Pour exercer ces droits : privacy@tradeguard.app
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
            <p className="text-slate-300">
              Nous utilisons uniquement des cookies essentiels pour le fonctionnement du service. 
              Aucun cookie de suivi publicitaire n'est utilisé.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Contact</h2>
            <p className="text-slate-300">
              Délégué à la protection des données :<br/>
              Email : dpo@tradeguard.app<br/>
              Adresse : TradeGuard SAS, 123 Avenue du Trading, 75008 Paris, France
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700">
          <p className="text-center text-slate-400">
            Version 1.0 • {new Date().getFullYear()} TradeGuard • Conforme RGPD
          </p>
        </div>
      </main>
    </div>
  );
}