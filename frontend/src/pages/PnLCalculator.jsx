// src/pages/PnLCalculator.jsx - VERSION CORRIGÉE
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, BarChart3, ArrowLeft, Calculator,
  TrendingUp, AlertTriangle
} from 'lucide-react';
import Header from '../components/Layout/Header';

export default function PnLCalculator() {
  const navigate = useNavigate();

  const [position, setPosition] = useState('long');
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [size, setSize] = useState('');
  const [leverage, setLeverage] = useState('1');
  const [fees, setFees] = useState('0.1');
  const [result, setResult] = useState(null);

  const handleNumberInput = (setter) => (e) => {
    const value = e.target.value;
    if (value === '') {
      setter('');
      return;
    }
    const numericValue = value.replace(/[^0-9.]/g, '');
    if ((numericValue.match(/\./g) || []).length > 1) return;
    setter(numericValue);
  };

  const calculatePnL = () => {
    const entry = parseFloat(entryPrice) || 0;
    const exit = parseFloat(exitPrice) || 0;
    const positionSize = parseFloat(size) || 0;
    const lev = parseFloat(leverage) || 1;
    const feeRate = parseFloat(fees) || 0;

    if (!entry || !exit || !positionSize) return;

    const priceDiff = position === 'long' ? exit - entry : entry - exit;
    const pnlBrut = priceDiff * positionSize * lev;
    const feeAmount = (entry * positionSize * lev * feeRate / 100) + 
                      (exit * positionSize * lev * feeRate / 100);
    const pnlNet = pnlBrut - feeAmount;
    const roi = (pnlNet / (entry * positionSize)) * 100;

    setResult({
      pnlBrut,
      pnlNet,
      roi,
      feeAmount,
      isWin: pnlNet > 0
    });
  };

  const loadExample = () => {
    setPosition('long');
    setEntryPrice('50000');
    setExitPrice('55000');
    setSize('0.5');
    setLeverage('1');
    setFees('0.1');
    calculatePnL();
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Bouton retour */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={20} />
          Retour au dashboard
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Panneau gauche - Formulaire */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="text-green-500" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-white">Profit & Loss</h1>
                <p className="text-gray-400">Calculez vos gains/pertes</p>
              </div>
            </div>

            {/* Type de position */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-medium">Position</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setPosition('long')}
                  className={`flex-1 py-3 rounded-lg font-medium transition ${
                    position === 'long'
                      ? 'bg-green-500/20 border border-green-500 text-green-400'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  LONG (Achat)
                </button>
                <button
                  onClick={() => setPosition('short')}
                  className={`flex-1 py-3 rounded-lg font-medium transition ${
                    position === 'short'
                      ? 'bg-red-500/20 border border-red-500 text-red-400'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  SHORT (Vente)
                </button>
              </div>
            </div>

            {/* Prix d'entrée */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-medium">Prix d'entrée ($)</label>
              <input
                type="text"
                value={entryPrice}
                onChange={handleNumberInput(setEntryPrice)}
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                placeholder="50000"
              />
            </div>

            {/* Prix de sortie */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-medium">Prix de sortie ($)</label>
              <input
                type="text"
                value={exitPrice}
                onChange={handleNumberInput(setExitPrice)}
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                placeholder="55000"
              />
            </div>

            {/* Taille */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-medium">Taille (unités)</label>
              <input
                type="text"
                value={size}
                onChange={handleNumberInput(setSize)}
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                placeholder="0.5"
              />
            </div>

            {/* Leverage */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-medium">Leverage (x)</label>
              <input
                type="text"
                value={leverage}
                onChange={handleNumberInput(setLeverage)}
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                placeholder="1"
              />
            </div>

            {/* Frais */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-medium">Frais (%)</label>
              <input
                type="text"
                value={fees}
                onChange={handleNumberInput(setFees)}
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                placeholder="0.1"
              />
            </div>

            {/* Bouton Calculer */}
            <button
              onClick={calculatePnL}
              className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition mb-4"
            >
              Calculer le P&L
            </button>

            {/* Bouton Exemple */}
            <button
              onClick={loadExample}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition text-sm mb-4"
            >
              📋 Charger un exemple
            </button>

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/Calculator')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <Calculator size={16} />
                Position
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <BarChart3 size={16} />
                Dashboard
              </button>
            </div>
          </div>

          {/* Panneau droit - Résultats */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Résultats</h2>

            {result ? (
              <div className="space-y-6">
                {/* P&L Net */}
                <div className={`p-6 rounded-xl border ${
                  result.isWin 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : 'bg-red-900/20 border-red-500/30'
                }`}>
                  <p className="text-sm text-gray-400 mb-1">P&L Net</p>
                  <p className={`text-4xl font-bold ${result.isWin ? 'text-green-400' : 'text-red-400'}`}>
                    {result.isWin ? '+' : ''}{result.pnlNet.toFixed(2)} $
                  </p>
                  <p className="text-sm text-gray-400 mt-2">ROI: {result.roi.toFixed(2)}%</p>
                </div>

                {/* Détails */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">P&L Brut</p>
                    <p className={`text-lg font-bold ${result.pnlBrut > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {result.pnlBrut > 0 ? '+' : ''}{result.pnlBrut.toFixed(2)} $
                    </p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Frais</p>
                    <p className="text-lg font-bold text-orange-400">
                      -{result.feeAmount.toFixed(2)} $
                    </p>
                  </div>
                </div>

                {/* Prix d'entrée/sortie */}
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Entrée:</span>
                    <span className="text-white">${parseFloat(entryPrice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Sortie:</span>
                    <span className="text-white">${parseFloat(exitPrice).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Variation:</span>
                    <span className={result.isWin ? 'text-green-400' : 'text-red-400'}>
                      {((parseFloat(exitPrice) - parseFloat(entryPrice)) / parseFloat(entryPrice) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="text-gray-600 mx-auto mb-4" size={48} />
                <p className="text-gray-400">Remplissez les champs</p>
                <p className="text-sm text-gray-500 mt-2">pour voir les résultats</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}