import React from 'react';
import {
  FileSpreadsheet,
  Activity,
  Zap,
  TrendingUp,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { CorrelationPair, DescriptiveStats, DataCleaningReport } from '../../types';

interface CorrelationsTabProps {
  stats: DescriptiveStats[];
  correlations: CorrelationPair[];
  cleaningReport: DataCleaningReport;
}

export const CorrelationsTab: React.FC<CorrelationsTabProps> = ({
  stats,
  correlations,
  cleaningReport,
}) => {
  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Automated Exploratory Data Analysis & Statistical Profiling</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white">Descriptive Statistics & Correlation Matrix</h2>
        <p className="text-sm text-slate-300 max-w-2xl">
          Programmatic computation of central tendencies, dispersion, interquartile ranges, and Pearson correlation coefficients across all numerical attributes.
        </p>
      </div>

      {/* Descriptive Statistics Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950/60 overflow-hidden shadow-2xl space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Descriptive Statistics Table</h3>
            <p className="text-xs text-slate-400">Calculated across verified non-null rows</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Total Variables: {stats.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-bold text-white">Attribute</th>
                <th className="py-3 px-3 font-bold text-white">Count</th>
                <th className="py-3 px-3 font-bold text-white">Mean</th>
                <th className="py-3 px-3 font-bold text-white">Median</th>
                <th className="py-3 px-3 font-bold text-white">Std Dev</th>
                <th className="py-3 px-3 font-bold text-white">Min</th>
                <th className="py-3 px-3 font-bold text-white">P25</th>
                <th className="py-3 px-3 font-bold text-white">P75</th>
                <th className="py-3 px-3 font-bold text-white">Max</th>
                <th className="py-3 px-3 font-bold text-white">IQR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {stats.map((s) => (
                <tr key={s.column} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-200">
                    {s.column}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400">{s.count}</td>
                  <td className="py-3.5 px-3 text-sky-400 font-bold">{s.mean}</td>
                  <td className="py-3.5 px-3 text-emerald-400 font-bold">{s.median}</td>
                  <td className="py-3.5 px-3 text-slate-300">{s.stdDev}</td>
                  <td className="py-3.5 px-3 text-slate-400">{s.min}</td>
                  <td className="py-3.5 px-3 text-slate-400">{s.p25}</td>
                  <td className="py-3.5 px-3 text-slate-400">{s.p75}</td>
                  <td className="py-3.5 px-3 text-slate-400">{s.max}</td>
                  <td className="py-3.5 px-3 text-indigo-400 font-bold">{s.iqr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pearson Correlation Matrix */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Pearson Correlation Pairs (r)</h3>
            <p className="text-xs text-slate-400">Direction and strength of linear associations between numeric dimensions</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Pairs Analyzed: {correlations.length}</span>
        </div>

        {correlations.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4">
            Insufficient numeric variables to compute pairwise Pearson correlation.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {correlations.map((pair, idx) => {
              const isPositive = pair.correlation > 0;
              const isStrong = Math.abs(pair.correlation) >= 0.7;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[180px]">
                      {pair.col1} ↔ {pair.col2}
                    </span>
                    <span
                      className={`font-mono font-black text-sm ${
                        pair.correlation >= 0.5
                          ? 'text-emerald-400'
                          : pair.correlation <= -0.5
                          ? 'text-rose-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {pair.correlation > 0 ? `+${pair.correlation}` : pair.correlation}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Strength:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isStrong
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {pair.strength}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
