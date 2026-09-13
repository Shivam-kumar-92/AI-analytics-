import React from 'react';

interface GaugeScoreProps {
  score: number;
  max?: number;
  size?: number;
  label?: string;
  sublabel?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'auto';
}

export const GaugeScore: React.FC<GaugeScoreProps> = ({
  score,
  max = 100,
  size = 140,
  label,
  sublabel,
  color = 'auto',
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const normalizedScore = Math.min(max, Math.max(0, score));
  const strokeDashoffset = circumference - (normalizedScore / max) * circumference;

  let strokeColor = '#6366f1';
  let badgeColor = 'text-indigo-400';
  if (color === 'auto') {
    if (normalizedScore >= 75) {
      strokeColor = '#10b981'; // emerald
      badgeColor = 'text-emerald-400';
    } else if (normalizedScore >= 50) {
      strokeColor = '#f59e0b'; // amber
      badgeColor = 'text-amber-400';
    } else {
      strokeColor = '#f43f5e'; // rose
      badgeColor = 'text-rose-400';
    }
  } else if (color === 'emerald') {
    strokeColor = '#10b981';
    badgeColor = 'text-emerald-400';
  } else if (color === 'amber') {
    strokeColor = '#f59e0b';
    badgeColor = 'text-amber-400';
  } else if (color === 'rose') {
    strokeColor = '#f43f5e';
    badgeColor = 'text-rose-400';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800"
            fill="transparent"
          />
          {/* Foreground progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold tracking-tight ${badgeColor}`}>
            {score}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            / {max}
          </span>
        </div>
      </div>
      {label && <p className="mt-2 text-sm font-semibold text-slate-200">{label}</p>}
      {sublabel && <p className="text-xs text-slate-400 text-center max-w-[160px]">{sublabel}</p>}
    </div>
  );
};
