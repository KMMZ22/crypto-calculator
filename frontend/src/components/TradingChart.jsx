// src/components/TradingChart.jsx
import React, { useEffect, useRef } from 'react';
import {
    createChart,
    CandlestickSeries,
    HistogramSeries,
    LineSeries,
} from 'lightweight-charts';

// Simple EMA calculation
const computeEMA = (values, period = 20) => {
    const k = 2 / (period + 1);
    let ema = values[0];
    return values.map((v, i) => {
        ema = i === 0 ? v : v * k + ema * (1 - k);
        return ema;
    });
};

// Deduplicate and sort an array of {time, ...} objects by ascending time
const cleanSeries = (arr) => {
    const seen = new Set();
    return arr
        .sort((a, b) => a.time - b.time)
        .filter(item => {
            if (seen.has(item.time)) return false;
            seen.add(item.time);
            return true;
        });
};

const TradingChart = ({ data, width, height, showVolume = true, indicator = 'none' }) => {
    const chartContainerRef = useRef();

    useEffect(() => {
        if (!chartContainerRef.current || !data?.length) return;

        const chart = createChart(chartContainerRef.current, {
            autoSize: true,
            height: height || 600,
            layout: {
                background: { type: 'solid', color: '#131517' },
                textColor: '#d1d5db',
            },
            grid: {
                vertLines: { color: '#1E1F23' },
                horzLines: { color: '#1E1F23' },
            },
            crosshair: { mode: 0 },
            rightPriceScale: { borderColor: '#1E1F23' },
            timeScale: {
                borderColor: '#1E1F23',
                timeVisible: true,
                secondsVisible: false,
            },
        });

        // ── Candlestick ──────────────────────────────────────────────────────────
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#10b981',
            downColor: '#ef4444',
            borderDownColor: '#ef4444',
            borderUpColor: '#10b981',
            wickDownColor: '#ef4444',
            wickUpColor: '#10b981',
        });

        // data[i].time is already a Unix timestamp in seconds (from backend)
        const candleData = cleanSeries(
            data.map(d => ({
                time: typeof d.time === 'number' ? d.time : Math.floor(new Date(d.date || d.time).getTime() / 1000),
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close,
            }))
        );
        candlestickSeries.setData(candleData);

        // ── Volume (conditional) ─────────────────────────────────────────────────
        if (showVolume) {
            const volumeSeries = chart.addSeries(HistogramSeries, {
                color: '#26a69a',
                priceFormat: { type: 'volume' },
                priceScaleId: '',
                scaleMargins: { top: 0.8, bottom: 0 },
            });
            volumeSeries.setData(
                cleanSeries(
                    data.map(d => ({
                        time: typeof d.time === 'number' ? d.time : Math.floor(new Date(d.date || d.time).getTime() / 1000),
                        value: d.volume,
                        color: d.close > d.open ? '#10b981aa' : '#ef4444aa',
                    }))
                )
            );
        }

        // ── Indicators (conditional) ─────────────────────────────────────────────
        if (indicator === 'ema') {
            const closes = candleData.map(d => d.close);
            const ema20 = computeEMA(closes, 20);
            const ema50 = computeEMA(closes, 50);

            const ema20Series = chart.addSeries(LineSeries, { color: '#6366F1', lineWidth: 1, title: 'EMA 20' });
            const ema50Series = chart.addSeries(LineSeries, { color: '#f59e0b', lineWidth: 1, title: 'EMA 50' });

            ema20Series.setData(candleData.map((d, i) => ({ time: d.time, value: ema20[i] })));
            ema50Series.setData(candleData.map((d, i) => ({ time: d.time, value: ema50[i] })));
        }

        return () => {
            chart.remove();
        };
    }, [data, height, showVolume, indicator]);

    return <div ref={chartContainerRef} style={{ width: '100%', height: height || 600 }} />;
};

export default TradingChart;