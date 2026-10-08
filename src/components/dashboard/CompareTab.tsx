import React, { useState } from 'react';
import {
  Scale,
  Award,
  Tag,
  Star,
  Activity,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ALL_DEMOS, DemoConfig } from '../../datasets';

interface CompareTabProps {
  currentProductName?: string;
  currentDemoId?: string;
  currencySymbol?: string;
  activeAssetConfig?: DemoConfig;
}

export const CompareTab: React.FC<CompareTabProps> = ({
  currentProductName: _currentProductName,
  currentDemoId = 'earbuds',
  currencySymbol = '₹',
  activeAssetConfig,
}) => {
  const comparisonList: DemoConfig[] = activeAssetConfig
    ? [activeAssetConfig, ...ALL_DEMOS.filter((d) => d.id !== activeAssetConfig.id)]
    : ALL_DEMOS;

  const [productAId, setProductAId] = useState<string>(
    activeAssetConfig ? activeAssetConfig.id : currentDemoId || 'earbuds'
  );
  const [productBId, setProductBId] = useState<string>(
    activeAssetConfig && productAId === activeAssetConfig.id ? 'earbuds' : 'automotive'
  );

  const demoA = comparisonList.find((d) => d.id === productAId) || comparisonList[0];
  const demoB = comparisonList.find((d) => d.id === productBId) || comparisonList[1];

  // Key metric comparisons
  const scoreA = demoA.successScore.overallScore;
  const scoreB = demoB.successScore.overallScore;
  const scoreDelta = scoreA - scoreB;

  const demandA = demoA.demandIntel.score;
  const demandB = demoB.demandIntel.score;
  const demandDelta = demandA - demandB;

  const priceA = demoA.marketValue.productPrice;
  const priceB = demoB.marketValue.productPrice;

  const sentimentA = demoA.reviewIntel ? demoA.reviewIntel.metrics.positivePct : 82;
  const sentimentB = demoB.reviewIntel ? demoB.reviewIntel.metrics.positivePct : 80;
  const sentimentDelta = sentimentA - sentimentB;

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Scale className="w-4 h-4" />
              <span>Multi-Asset Benchmarking & Head-to-Head Comparison</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Side-by-Side Product Comparison</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Evaluate commercial performance, demand momentum, customer sentiment polarity, and pricing delta across category benchmarks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Asset A (Primary)</span>
              <select
                value={productAId}
                onChange={(e) => setProductAId(e.target.value)}
                className="bg-slate-950 border border-indigo-500/40 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none"
              >
                {comparisonList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.id === activeAssetConfig?.id ? `★ ${d.name} (Active Dataset)` : `${d.name} (${d.industry})`}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-slate-500 font-bold text-sm self-end pb-1.5">VS</span>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Asset B (Benchmark)</span>
              <select
                value={productBId}
                onChange={(e) => setProductBId(e.target.value)}
                className="bg-slate-950 border border-indigo-500/40 rounded-xl px-3 py-1.5 text-xs text-white font-bold focus:outline-none"
              >
                {comparisonList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.id === activeAssetConfig?.id ? `★ ${d.name} (Active Dataset)` : `${d.name} (${d.industry})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Head-to-Head Delta Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Success Score Delta */}
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Success Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-black text-indigo-400 font-mono">{scoreA}</span>
              <span className="text-xs text-slate-500"> vs </span>
              <span className="text-xl font-black text-slate-300 font-mono">{scoreB}</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scoreDelta >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {scoreDelta >= 0 ? `+${scoreDelta} pts` : `${scoreDelta} pts`}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block truncate">
            {scoreDelta >= 0 ? `${demoA.name.split(' ')[0]} leads overall potential` : `${demoB.name.split(' ')[0]} leads overall potential`}
          </span>
        </div>

        {/* 2. Demand Velocity Delta */}
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Demand Velocity</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-black text-indigo-400 font-mono">{demandA}</span>
              <span className="text-xs text-slate-500"> vs </span>
              <span className="text-xl font-black text-slate-300 font-mono">{demandB}</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${demandDelta >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {demandDelta >= 0 ? `+${demandDelta} pts` : `${demandDelta} pts`}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block truncate">
            {demandDelta >= 0 ? `${demoA.name.split(' ')[0]} has faster momentum` : `${demoB.name.split(' ')[0]} has faster momentum`}
          </span>
        </div>

        {/* 3. Customer Sentiment Delta */}
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Positive Sentiment</span>
            <Star className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xl font-black text-indigo-400 font-mono">{sentimentA}%</span>
              <span className="text-xs text-slate-500"> vs </span>
              <span className="text-xl font-black text-slate-300 font-mono">{sentimentB}%</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sentimentDelta >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {sentimentDelta >= 0 ? `+${sentimentDelta}%` : `${sentimentDelta}%`}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block truncate">
            {sentimentDelta >= 0 ? `${demoA.name.split(' ')[0]} has higher satisfaction` : `${demoB.name.split(' ')[0]} has higher satisfaction`}
          </span>
        </div>

        {/* 4. Pricing Benchmark Comparison */}
        <div className="glass-card rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase">Unit Pricing</span>
            <Tag className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-sm font-bold text-indigo-300 font-mono">{(demoA.marketValue?.currencySymbol || currencySymbol)}{priceA.toLocaleString()}</span>
              <span className="text-xs text-slate-500"> vs </span>
              <span className="text-sm font-bold text-slate-300 font-mono">{(demoB.marketValue?.currencySymbol || currencySymbol)}{priceB.toLocaleString()}</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 block truncate">
            {demoA.industry} vs {demoB.industry}
          </span>
        </div>
      </div>

      {/* Direct Side-by-Side Detail Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Asset A Profile */}
        <div className="glass-card rounded-3xl p-6 space-y-5 border-indigo-500/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                Asset A
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{demoA.name}</h3>
              <span className="text-xs text-slate-400">{demoA.industry}</span>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-black text-xl">
              {scoreA}/100
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">AI Strategic Verdict</span>
              <p className="text-slate-200 italic leading-relaxed">"{demoA.successScore.aiVerdict}"</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-emerald-400 font-bold uppercase text-[10px]">Primary Core Drivers</span>
              {demoA.successScore.keyDrivers.slice(0, 3).map((d: string, i: number) => (
                <div key={i} className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{d}</span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-rose-400 font-bold uppercase text-[10px]">Critical Vulnerabilities</span>
              {demoA.successScore.keyRisks.slice(0, 2).map((r: string, i: number) => (
                <div key={i} className="flex items-center space-x-2 text-slate-300">
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Asset B Profile */}
        <div className="glass-card rounded-3xl p-6 space-y-5 border-slate-700">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                Asset B
              </span>
              <h3 className="text-xl font-bold text-white mt-1">{demoB.name}</h3>
              <span className="text-xs text-slate-400">{demoB.industry}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-800 text-slate-300 border border-slate-700 font-black text-xl">
              {scoreB}/100
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-semibold uppercase text-[10px]">AI Strategic Verdict</span>
              <p className="text-slate-200 italic leading-relaxed">"{demoB.successScore.aiVerdict}"</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-emerald-400 font-bold uppercase text-[10px]">Primary Core Drivers</span>
              {demoB.successScore.keyDrivers.slice(0, 3).map((d: string, i: number) => (
                <div key={i} className="flex items-center space-x-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{d}</span>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-rose-400 font-bold uppercase text-[10px]">Critical Vulnerabilities</span>
              {demoB.successScore.keyRisks.slice(0, 2).map((r: string, i: number) => (
                <div key={i} className="flex items-center space-x-2 text-slate-300">
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
