// src/components/TradingChart.jsx
import React, { useEffect, useRef, memo } from 'react';

const TradingChart = ({ symbol = 'BTCUSDT', height = 600, theme = 'dark' }) => {
    const containerRef = useRef(null);
    // On garde un ID statique par instance pour éviter qu'il change à chaque re-render
    const idRef = useRef(`tv_${Math.random().toString(36).substring(7)}`);

    useEffect(() => {
        let tvWidget = null;

        const initWidget = () => {
            if (typeof window.TradingView !== 'undefined' && containerRef.current) {
                containerRef.current.innerHTML = ''; // Nettoyage de l'iframe précédent
                tvWidget = new window.TradingView.widget({
                    autosize: true,
                    symbol: `BINANCE:${symbol}`,
                    interval: 'D', // Timeframe par défaut (1 Jour)
                    timezone: 'Etc/UTC',
                    theme: theme,
                    style: '1', // 1 = Bougies japonaises (Candles)
                    locale: 'fr',
                    enable_publishing: false,
                    backgroundColor: '#131517', // S'accorde avec le thème Tailwind de l'app
                    gridColor: '#1E1F23',
                    hide_top_toolbar: false,
                    hide_legend: false,
                    save_image: true,
                    container_id: idRef.current,
                    toolbar_bg: '#131517',
                    allow_symbol_change: true,
                    hide_side_toolbar: false, // TRÈS IMPORTANT: Affiche les outils de dessin
                    studies: [],
                });
            }
        };

        // Injecter le script dans le head s'il n'existe pas encore globalement
        if (typeof window.TradingView === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/tv.js';
            script.type = 'text/javascript';
            script.async = true;
            script.onload = initWidget;
            document.head.appendChild(script);
        } else {
            // S'il existe déjà (ex: navigation inter-onglets), instancier directement
            initWidget();
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [symbol, theme]);

    return (
        <div style={{ height, width: '100%' }}>
            <div id={idRef.current} ref={containerRef} style={{ height: '100%', width: '100%' }} />
        </div>
    );
};

export default memo(TradingChart);