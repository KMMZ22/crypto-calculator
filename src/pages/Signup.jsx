// src/pages/Signup.jsx - VERSION CLERK
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, FileText } from "lucide-react";
import { SignUp } from "@clerk/clerk-react";

export default function Signup() {
  const navigate = useNavigate();
  const [showTermsModal, setShowTermsModal] = useState(false);

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
          {/* Contenu identique... */}
          {/* Garde le même contenu que ta version originale */}
        </div>

        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Version 1.0 - {new Date().getFullYear()}
            </p>
            <button
              onClick={() => setShowTermsModal(false)}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition"
            >
              Fermer
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
            
            {/* 🔥 LE COMPOSANT CLERK REMPLACE TOUT LE FORMULAIRE */}
            <div className="flex justify-center">
              <SignUp
                routing="path"
                path="/signup"
                signInUrl="/login"
                afterSignUpUrl="/dashboard"
                appearance={{
                  elements: {
                    formButtonPrimary: {
                      background: "linear-gradient(to right, #06b6d4, #3b82f6)",
                      "&:hover": {
                        background: "linear-gradient(to right, #0891b2, #2563eb)"
                      }
                    },
                    footerActionLink: {
                      color: "#22d3ee",
                      "&:hover": {
                        color: "#67e8f9"
                      }
                    },
                    card: {
                      background: "transparent",
                      boxShadow: "none",
                      border: "none",
                      width: "100%"
                    }
                  }
                }}
              />
            </div>

            {/* Terms link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowTermsModal(true)}
                className="text-sm text-slate-400 hover:text-slate-300 transition"
              >
                📄 Lire les conditions d'utilisation
              </button>
            </div>

            {/* Security badge */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800/50 text-slate-400">
                    🔒 Sécurisé par Clerk
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}