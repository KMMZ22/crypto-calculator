// src/components/calendar/EconomicCalendar.jsx
import React, { useEffect, useRef, memo } from 'react';

const EconomicCalendar = () => {
  const containerRef = useRef();

  useEffect(() => {
    // Nettoyage au cas où le composant est re-monté
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "isTransparent": true,
      "width": "100%",
      "height": "100%",
      "locale": "fr",
      "importanceFilter": "-1,0,1", // Toutes les importances
      "currencyFilter": "USD,EUR,GBP,JPY,CAD,AUD,CHF,NZD,CNY" // Principales devises mondiales
    });

    if (containerRef.current) {
        containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6 h-[800px] w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#6366F1]/10 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6366F1]">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <line x1="16" x2="16" y1="2" y2="6"/>
              <line x1="8" x2="8" y1="2" y2="6"/>
              <line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Calendrier Économique</h2>
            <p className="text-sm text-gray-400">Événements macroéconomiques mondiaux par TradingView</p>
          </div>
        </div>
        
        {/* Badge "LIVE" qui remplace le badge "DÉMO" mocké */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-semibold tracking-wide flex items-center gap-2 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            EN DIRECT
          </span>
        </div>
      </div>

      {/* Widget Container */}
      <div className="flex-1 w-full relative min-h-0 bg-[#0A0B0D] rounded-lg border border-[#1E1F23] overflow-hidden">
        <div className="tradingview-widget-container absolute inset-0" ref={containerRef}>
          <div className="tradingview-widget-container__widget h-full w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default memo(EconomicCalendar);