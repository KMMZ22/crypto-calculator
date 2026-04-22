import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, DollarSign, LineChart, Camera, ChevronRight } from 'lucide-react';

export default function DashboardShortcuts() {
  const navigate = useNavigate();

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <button onClick={() => navigate('/Calculator')} className="bg-[#131517] border border-[#1E1F23] hover:border-[#6366F1]/50 rounded-xl p-6 text-left transition group">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-[#6366F1]/10 rounded-lg group-hover:bg-[#6366F1]/20 transition">
            <Calculator className="text-[#6366F1]" size={24} />
          </div>
          <ChevronRight className="text-gray-500 group-hover:text-[#6366F1] group-hover:translate-x-1 transition" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Position Sizing</h3>
        <p className="text-sm text-gray-400">Taille idéale (capital & risque)</p>
      </button>

      <button onClick={() => navigate('/PnLCalculator')} className="bg-[#131517] border border-[#1E1F23] hover:border-[#6366F1]/50 rounded-xl p-6 text-left transition group">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-[#6366F1]/10 rounded-lg group-hover:bg-[#6366F1]/20 transition">
            <DollarSign className="text-[#6366F1]" size={24} />
          </div>
          <ChevronRight className="text-gray-500 group-hover:text-[#6366F1] group-hover:translate-x-1 transition" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Profit & Loss</h3>
        <p className="text-sm text-gray-400">Calcul du P&L sur trade ouvert</p>
      </button>

      <button onClick={() => navigate('/chart')} className="bg-[#131517] border border-[#1E1F23] hover:border-[#6366F1]/50 rounded-xl p-6 text-left transition group">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-[#6366F1]/10 rounded-lg group-hover:bg-[#6366F1]/20 transition">
            <LineChart className="text-[#6366F1]" size={24} />
          </div>
          <ChevronRight className="text-gray-500 group-hover:text-[#6366F1] group-hover:translate-x-1 transition" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Analyse Tech.</h3>
        <p className="text-sm text-gray-400">Graphique live & indicateurs</p>
      </button>

      <button onClick={() => navigate('/chart-analysis')} className="bg-[#131517] border border-[#1E1F23] hover:border-[#6366F1]/50 rounded-xl p-6 text-left transition group relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-2 py-1 rounded text-[10px] font-bold text-white tracking-wider">
          PRO+
        </div>
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-[#6366F1]/10 rounded-lg group-hover:bg-[#6366F1]/20 transition">
            <Camera className="text-[#6366F1]" size={24} />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Analyse IA</h3>
        <p className="text-sm text-gray-400">Uploadez et recevez un plan de trade IA.</p>
      </button>
    </div>
  );
}
