import React from 'react';
import { ShieldCheck, AlertTriangle, ArrowRightCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProductSuccessScore } from '../../types';

interface VerdictCardProps {
  scoreData: ProductSuccessScore;
  productName?: string;
  isSyntheticDemo?: boolean;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({
  scoreData,
  productName = 'Product / Asset',
  isSyntheticDemo = false,
}) => {
  const isHigh = scoreData.classification === 'High Potential';
  const isModerate = scoreData.classification === 'Moderate Potential';

  const badgeBg = isHigh
    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    : isModerate
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    : 'bg-rose-500/10 text-rose-400 border-rose-500/30';

  const glowBorder = isHigh ? 'glow-emerald' : isModerate ? 'glow-amber' : 'glow-indigo';

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-700/60 p-6 md:p-8 ${glowBorder} shadow-2xl transition-all duration-300`}>
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Executive Strategic Evaluation
            </span>
            {isSyntheticDemo && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                Synthetic Demo Data
              </span>
            )}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1 tracking-tight">
            Market Potential: <span className={isHigh ? 'text-emerald-400' : isModerate ? 'text-amber-400' : 'text-rose-400'}>{scoreData.classification.toUpperCase()}</span>
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Algorithmic appraisal for <strong className="text-slate-200">{productName}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Score Box */}
          <div className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center min-w-[110px]">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Potential Score</span>
            <span className="text-3xl font-black text-white tracking-tight">
              {scoreData.overallScore}<span className="text-sm text-slate-400 font-normal">/100</span>
            </span>
          </div>

          {/* Confidence Box */}
          <div className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center min-w-[110px]">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Confidence</span>
            <span className="text-3xl font-black text-indigo-400 tracking-tight">
              {scoreData.confidenceScore}<span className="text-sm text-slate-400 font-normal">%</span>
            </span>
          </div>
        </div>
      </div>

      {/* AI Verdict Paragraph */}
      <div className="mt-6 p-4 md:p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 relative">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              AI Data Analyst Synthesis
            </h4>
            <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium">
              "{scoreData.aiVerdict}"
            </p>
          </div>
        </div>
      </div>

      {/* Why Drivers vs Risks Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why / Positive Drivers */}
        <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800/80 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span className="uppercase tracking-wider text-xs">Why? Key Growth Drivers</span>
          </div>
          <ul className="space-y-2.5">
            {scoreData.keyDrivers.map((driver, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs md:text-sm text-slate-300">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks & Vulnerabilities */}
        <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800/80 space-y-3">
          <div className="flex items-center space-x-2 text-rose-400 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span className="uppercase tracking-wider text-xs">Critical Vulnerabilities & Risks</span>
          </div>
          <ul className="space-y-2.5">
            {scoreData.keyRisks.map((risk, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs md:text-sm text-slate-300">
                <span className="text-rose-400 font-bold shrink-0 mt-0.5">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Action Footer */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <ArrowRightCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Recommended Next Action
            </span>
            <p className="text-sm font-bold text-white mt-0.5">
              {scoreData.recommendedAction}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 max-w-sm italic">
          {scoreData.uncertaintyDisclaimer}
        </div>
      </div>
    </div>
  );
};
