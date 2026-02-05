import React from 'react';

const RiskScoreGauge = ({ score }) => {
  const getColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-lime-400';
    if (score >= 40) return 'text-yellow-400';
    if (score >= 20) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRingColor = (score) => {
    if (score >= 80) return 'stroke-green-500';
    if (score >= 60) return 'stroke-lime-500';
    if (score >= 40) return 'stroke-yellow-500';
    if (score >= 20) return 'stroke-orange-500';
    return 'stroke-red-500';
  };

  const getLabel = (score) => {
    if (score >= 80) return 'Très élevée';
    if (score >= 60) return 'Élevée';
    if (score >= 40) return 'Modérée';
    if (score >= 20) return 'Faible';
    return 'Très faible';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="transform -rotate-90" width="160" height="160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r="45"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${getRingColor(score)} transition-all duration-1000`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold ${getColor(score)}`}>
            {score}
          </span>
          <span className="text-sm text-gray-400 mt-1">/100</span>
          <span className={`text-sm font-medium mt-2 ${getColor(score)}`}>
            {getLabel(score)}
          </span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-5 gap-1 w-full max-w-xs">
        {[0, 25, 50, 75, 100].map((point, i) => (
          <div key={i} className="text-center">
            <div className={`h-1 w-full ${score >= point ? 'bg-gray-400' : 'bg-gray-700'}`}></div>
            <span className="text-xs text-gray-500 mt-1">{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskScoreGauge;