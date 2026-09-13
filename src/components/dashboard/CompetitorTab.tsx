import React from 'react';
import {
  Users,
  Shield,
  Star,
  Activity,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
} from 'lucide-react';
import { CompetitorIntelligence } from '../../types';

interface CompetitorTabProps {
  competitorIntel: CompetitorIntelligence;
  currencySymbol?: string;
}

export const CompetitorTab: React.FC<CompetitorTabProps> = ({
  competitorIntel,
  currencySymbol = '₹',
}) => {
  const { competitors, aiCompetitorSummary, marketLeader, opportunityNiche } = competitorIntel;

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Competitive Landscape & Strategic Benchmarking</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Competitor Intelligence Matrix</h2>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400 block font-semibold">Category Leader:</span>
              <span className="text-white font-bold">{marketLeader}</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-sm text-slate-200 leading-relaxed font-medium">
          <Sparkles className="w-4 h-4 text-indigo-400 inline mr-2" />
          "{aiCompetitorSummary}"
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950/60 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Direct Competitive Metric Comparison</h3>
          <span className="text-xs text-slate-400 font-mono">Benchmarked Assets: {competitors.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5 font-bold text-white">Product / Offering</th>
                <th className="py-3.5 px-4 font-bold text-white">Price</th>
                <th className="py-3.5 px-4 font-bold text-white">Rating</th>
                <th className="py-3.5 px-4 font-bold text-white">Reviews / Volume</th>
                <th className="py-3.5 px-4 font-bold text-white">Demand Index</th>
                <th className="py-3.5 px-4 font-bold text-white">Sentiment</th>
                <th className="py-3.5 px-5 font-bold text-white">Strategic Market Position</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {competitors.map((comp, idx) => (
                <tr
                  key={comp.name}
                  className={`transition-colors ${
                    comp.isMainProduct
                      ? 'bg-indigo-950/20 hover:bg-indigo-950/30 font-semibold'
                      : 'hover:bg-slate-900/40'
                  }`}
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center space-x-2">
                      {comp.isMainProduct && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500 text-white uppercase">
                          OURS
                        </span>
                      )}
                      <span className="text-white font-bold text-sm">{comp.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-slate-200 text-sm">
                    {currencySymbol}{comp.price.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{comp.rating}★</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-300">
                    {comp.reviewsCount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono font-bold">
                      {comp.demandScore}/100
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                      {comp.sentimentScore}%
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                      {comp.marketPosition}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Competitor Strengths & Weaknesses Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {competitors.map((comp) => (
          <div
            key={comp.name}
            className={`glass-card rounded-3xl p-5 space-y-3 ${
              comp.isMainProduct ? 'border-indigo-500/40 bg-indigo-950/10' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm truncate">{comp.name}</h4>
              <span className="text-xs font-mono text-slate-400">{currencySymbol}{comp.price.toLocaleString()}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Key Strengths</span>
                </span>
                <p className="text-slate-300">{comp.strengths}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-rose-400 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>Key Weaknesses / Gaps</span>
                </span>
                <p className="text-slate-300">{comp.weaknesses}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
