// src/components/CalculatorsMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, DollarSign, ChevronDown, LineChart } from 'lucide-react';

const CalculatorsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 text-gray-400 hover:text-white transition rounded-lg hover:bg-[#1E1F23]"
      >
        <span>Calculateurs</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-[#131517] border border-[#1E1F23] rounded-lg shadow-xl z-50">
          <button
            onClick={() => {
              navigate('/Calculator');
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:text-white hover:bg-[#1E1F23] first:rounded-t-lg flex items-center gap-3"
          >
            <Calculator size={16} className="text-[#6366F1]" />
            <div>
              <p className="font-medium">Position Sizing</p>
              <p className="text-xs text-gray-500">Calculez la taille idéale</p>
            </div>
          </button>
          <button
            onClick={() => {
              navigate('/PnLCalculator');
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:text-white hover:bg-[#1E1F23] flex items-center gap-3"
          >
            <DollarSign size={16} className="text-[#6366F1]" />
            <div>
              <p className="font-medium">Profit & Loss</p>
              <p className="text-xs text-gray-500">Calculez vos gains/pertes</p>
            </div>
          </button>
          <button
            onClick={() => {
              navigate('/chart');
              setIsOpen(false);
            }}
            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:text-white hover:bg-[#1E1F23] last:rounded-b-lg flex items-center gap-3"
          >
            <LineChart size={16} className="text-[#6366F1]" />
            <div>
              <p className="font-medium">Analyse Technique</p>
              <p className="text-xs text-gray-500">Graphique live Binance</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default CalculatorsMenu;