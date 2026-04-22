import React, { useState } from 'react';
import { BookOpen, DollarSign, Calculator, LineChart, Calendar, Bot, PlayCircle } from 'lucide-react';

const GUIDE_SECTIONS = [
  {
    id: 'pnl',
    title: 'Calculateur PnL',
    icon: <DollarSign size={20} />,
    description: 'Estimez rapidement vos gains et pertes potentiels avant de prendre position. Cet outil gère les positions Long / Short et inclut les leviers marginaux.',
    videoPlaceholder: 'Emplacement vidéo : Présentation du Calculateur PnL (Tutoriel de 2_3 min)'
  },
  {
    id: 'position',
    title: 'Position Sizing',
    icon: <Calculator size={20} />,
    description: 'Protégez votre capital en déterminant la taille exacte de votre position en fonction de votre niveau de risque (Risk Management) et de la distance de votre Stop Loss.',
    videoPlaceholder: 'Emplacement vidéo : Comment protéger son Capital avec le Position Sizing'
  },
  {
    id: 'chart',
    title: 'Graphique & Analyse',
    icon: <LineChart size={20} />,
    description: 'Naviguez sur notre intégration TradingView. Tracez vos lignes de tendance, utilisez Fibonacci et analysez le flux en direct du marché crypto.',
    videoPlaceholder: 'Emplacement vidéo : Guide complet du Graphique Pro et des Outils de Dessins'
  },
  {
    id: 'calendar',
    title: 'Calendrier Économique',
    icon: <Calendar size={20} />,
    description: 'Gardez un œil sur les annonces majeures (NFP, taux de la FED, IPC). Ce widget affiche en temps réel les données de la finance mondiale impactant vos trades.',
    videoPlaceholder: 'Emplacement vidéo : Comment anticiper la Volatilité avec le Calendrier Économique'
  },
  {
    id: 'ai',
    title: 'IA Advisor (Pro+)',
    icon: <Bot size={20} />,
    description: 'Bénéficiez d\'une analyse mathématique de marché propulsée par Intelligence Artificielle. Notre IA décrypte le comportement des prix pour vous.',
    videoPlaceholder: 'Emplacement vidéo : Démonstration de l\'Assistant IA sur vos trades'
  }
];

export default function UserGuide() {
  const [activeSection, setActiveSection] = useState(GUIDE_SECTIONS[0].id);

  const currentSection = GUIDE_SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Menu latéral */}
      <div className="lg:w-1/4">
        <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-4 sticky top-24">
          <div className="flex items-center gap-2 mb-6 px-2">
            <BookOpen className="text-[#6366F1]" size={24} />
            <h2 className="text-white font-bold text-lg">Académie</h2>
          </div>
          <nav className="flex flex-col gap-2">
            {GUIDE_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-left text-sm rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-[#6366F1]/10 text-white border border-[#6366F1]/30'
                    : 'text-gray-400 hover:bg-[#1E1F23] hover:text-gray-200 border border-transparent'
                }`}
              >
                <div className={activeSection === section.id ? "text-[#6366F1]" : "text-gray-500"}>
                  {section.icon}
                </div>
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu principal (Vidéo + Texte) */}
      <div className="lg:w-3/4">
        <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6 min-h-[600px]">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">{currentSection.title}</h1>
            <p className="text-gray-400 leading-relaxed">{currentSection.description}</p>
          </div>

          {/* Espace Vidéo */}
          <div className="relative w-full aspect-video bg-[#0A0B0D] border border-dashed border-[#2C2D33] rounded-xl overflow-hidden group flex flex-col items-center justify-center">
            
            {/* 
              TODO: POUR REMPLACER L'IMAGE DE FOND PAR VOTRE VIDEO,
              utilisez une balise <video> ou une iframe YouTube ici 
            */}
            <PlayCircle className="text-[#6366F1] w-16 h-16 mb-4 opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer" />
            <p className="text-gray-500 text-sm font-medium px-4 text-center">
              {currentSection.videoPlaceholder}
            </p>
            <p className="text-gray-600 text-xs mt-2 max-w-xs text-center border border-gray-800 bg-[#131517] p-2 rounded">
              Ajoutez simplement la balise <code>&lt;video src="..." /&gt;</code> ou <code>&lt;iframe&gt;</code> dans le code !
            </p>

            {/* Vraie balise cachée en exemple */}
            {/* <video src="/videos/tuto_pnl.mp4" controls className="absolute inset-0 w-full h-full object-cover" /> */}
          </div>
          
          <div className="mt-8 p-4 bg-[#6366F1]/5 border border-[#6366F1]/20 rounded-lg">
            <h3 className="text-white font-medium mb-2 text-sm flex items-center gap-2">
              💡 Astuce d'utilisation
            </h3>
            <p className="text-gray-400 text-sm">
              Prenez le temps de regarder ces vidéos de 2 minutes pour maîtriser pleinement {currentSection.title.toLowerCase()}. L'entraînement est la clé de la réussite en trading !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
