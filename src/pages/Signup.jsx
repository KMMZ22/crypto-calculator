import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Shield, Eye, EyeOff, AlertCircle, Check, FileText } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!acceptedTerms) {
      setError("Vous devez accepter les conditions d'utilisation");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            accepted_terms_at: new Date().toISOString(),
            accepted_terms_version: "1.0"
          }
        }
      });

      if (error) throw error;

      // Stocker l'acceptation des termes dans localStorage aussi
      localStorage.setItem('acceptedTerms', 'true');
      localStorage.setItem('acceptedTermsVersion', '1.0');
      localStorage.setItem('acceptedTermsDate', new Date().toISOString());

      // Rediriger vers la page de sélection de plan
      navigate("/select-plan", {
        state: { message: "Inscription réussie ! Choisissez votre plan." }
      });

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const TermsModal = () => (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-cyan-400" />
              <h2 className="text-xl font-bold">Conditions d'utilisation</h2>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-400 mb-2">AVERTISSEMENT IMPORTANT</h3>
                  <p className="text-sm text-slate-300">
                    Le trading comporte des risques de perte totale de capital. 
                    TradeGuard est un outil de calcul, pas un conseiller financier.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">1. Acceptation des conditions</h3>
              <p className="text-slate-300">
                En créant un compte, vous acceptez ces conditions dans leur intégralité. 
                Vous devez avoir au moins 18 ans et être légalement autorisé à trader.
              </p>

              <h3 className="font-bold text-lg">2. Aucun remboursement</h3>
              <p className="text-slate-300">
                Les abonnements payants ne sont pas remboursables. Les annulations prennent effet à la fin de la période de facturation en cours.
              </p>

              <h3 className="font-bold text-lg">3. Responsabilité limitée</h3>
              <p className="text-slate-300">
                TradeGuard fournit uniquement des outils de calcul. Nous déclinons toute responsabilité pour :
              </p>
              <ul className="list-disc pl-5 text-slate-300 space-y-1">
                <li>Pertes financières résultant du trading</li>
                <li>Erreurs dans les calculs dus à des données incorrectes</li>
                <li>Décisions d'investissement prises par l'utilisateur</li>
                <li>Problèmes techniques sur les plateformes d'échange</li>
              </ul>

              <h3 className="font-bold text-lg">4. Variations de marché</h3>
              <p className="text-slate-300">
                Les calculs sont basés sur les données fournies. Les conditions du marché peuvent changer rapidement. 
                Les résultats réels peuvent différer des calculs.
              </p>

              <h3 className="font-bold text-lg">5. Pas de conseil financier</h3>
              <p className="text-slate-300">
                TradeGuard n'est pas un conseiller financier réglementé. Les informations fournies ne constituent pas des conseils d'investissement.
              </p>

              <h3 className="font-bold text-lg">6. Données personnelles</h3>
              <p className="text-slate-300">
                Nous collectons uniquement les données nécessaires au service. Vos données sont chiffrées et protégées conformément au RGPD.
              </p>

              <h3 className="font-bold text-lg">7. Modification des conditions</h3>
              <p className="text-slate-300">
                Nous nous réservons le droit de modifier ces conditions. Les utilisateurs seront notifiés des changements importants.
              </p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Version 1.0 - {new Date().getFullYear()}
            </p>
            <button
              onClick={() => {
                setAcceptedTerms(true);
                setShowTermsModal(false);
              }}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition"
            >
              Accepter et fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showTermsModal && <TermsModal />}
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Déjà un compte ?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-cyan-400 hover:text-cyan-300"
            >
              Connectez-vous
            </button>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-slate-800/50 border border-slate-700/50 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Adresse email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-600 rounded-lg bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="vous@exemple.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Mot de passe
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-600 rounded-lg bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Minimum 6 caractères
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                  Confirmer le mot de passe
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2.5 border border-slate-600 rounded-lg bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms checkbox avec modal */}
              <div className="space-y-4">
                <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="h-4 w-4 text-cyan-500 border-slate-600 rounded bg-slate-800 focus:ring-cyan-500 focus:ring-offset-slate-900"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="terms" className="text-sm text-slate-300 cursor-pointer">
                        J'accepte les{" "}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-cyan-400 hover:text-cyan-300 underline"
                        >
                          conditions d'utilisation
                        </button>
                        {" "}de TradeGuard*
                      </label>
                      <p className="text-xs text-slate-400 mt-1">
                        *Incluant : aucun remboursement, responsabilité limitée, variations de marché, et aucun conseil financier.
                      </p>
                    </div>
                  </div>
                </div>

                {!acceptedTerms && (
                  <div className="flex items-center gap-2 text-amber-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Vous devez accepter les conditions pour continuer</span>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !acceptedTerms}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                    loading || !acceptedTerms
                      ? "bg-slate-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Création du compte...
                    </span>
                  ) : (
                    "Créer mon compte"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800/50 text-slate-400">
                    Sécurisé et chiffré
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-slate-400">
                <p>
                  En vous inscrivant, vous recevrez des emails de notre part. 
                  Vous pouvez vous désabonner à tout moment.
                </p>
                <p className="mt-2">
                  <button
                    onClick={() => navigate("/")}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    ← Retour à l'accueil
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}