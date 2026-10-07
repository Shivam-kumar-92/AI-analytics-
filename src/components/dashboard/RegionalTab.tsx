import React, { useState } from 'react';
import {
  MapPin,
  TrendingUp,
  AlertTriangle,
  Award,
  Compass,
  Star,
  Quote,
  CheckCircle2,
  Filter,
  BarChart3,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  PanIndiaIntelligence,
  RegionalIntelligenceModel,
  StateIntelligence,
} from '../../engine/regionalModel';

interface RegionalTabProps {
  productName: string;
  industry: string;
  datasetRows: Record<string, any>[];
  baselineSentimentPct?: number;
  baselineDemandScore?: number;
}

export const RegionalTab: React.FC<RegionalTabProps> = ({
  productName,
  industry,
  datasetRows,
  baselineSentimentPct = 82,
  baselineDemandScore = 78,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<StateIntelligence | null>(null);

  const intelligence: PanIndiaIntelligence = React.useMemo(() => {
    return RegionalIntelligenceModel.computeRegionalIntelligence(
      productName,
      industry,
      datasetRows,
      baselineSentimentPct,
      baselineDemandScore
    );
  }, [productName, industry, datasetRows, baselineSentimentPct, baselineDemandScore]);

  const filteredStates = intelligence.states.filter((st) => {
    if (selectedZone === 'All') return true;
    return st.zone === selectedZone;
  });

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Pan-India Geographic & Territory Intelligence</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              State-by-State Regional Sentiment & Demand Radar
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Granular geographic performance breakdown for <strong className="text-white">{productName}</strong> across India's key commercial zones, state demand clusters, return risks, and localized customer feedback.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>{intelligence.totalStatesCovered} Key States Mapped</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-300">
              National Avg Return: {intelligence.nationalAvgReturnRatePct}%
            </span>
          </div>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border-emerald-500/20 space-y-1">
          <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Highest Customer Satisfaction</span>
          </span>
          <div className="text-xl font-black text-white">{intelligence.topPerformingState}</div>
          <span className="text-[11px] text-emerald-400 font-semibold">Highest sentiment approval & repeat adoption</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border-amber-500/20 space-y-1">
          <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Highest Delivery / Return Friction</span>
          </span>
          <div className="text-xl font-black text-amber-300">{intelligence.highestFrictionState}</div>
          <span className="text-[11px] text-slate-400">Higher RTO risk in interior pin codes</span>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-1">
          <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Metro vs Tier-2/3 Ratio</span>
          </span>
          <div className="text-xl font-black text-white">{intelligence.metroVsTier2Ratio}</div>
          <span className="text-[11px] text-slate-400">Expansion velocity tilting toward Tier-2 cities</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border-orange-500/20 space-y-1">
          <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
            <span>Fastest Growing Zone</span>
          </span>
          <div className="text-xl font-black text-orange-300">Southern Corridor (+22.1%)</div>
          <span className="text-[11px] text-slate-400">Bengaluru & Hyderabad driving surge</span>
        </div>
      </div>

      {/* Interactive Zone Filter & Macro Summary Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span>Filter by Geographical Zone</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['All', 'West', 'South', 'North', 'East'].map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedZone === zone
                    ? 'bg-gradient-to-r from-orange-500 to-emerald-600 text-white shadow-md shadow-orange-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {zone === 'All' ? 'Pan-India (All)' : `${zone} Zone`}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Regional Zones Micro Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {intelligence.zones.map((zn) => (
            <div
              key={zn.zone}
              onClick={() => setSelectedZone(zn.zone)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedZone === zn.zone
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white uppercase">{zn.zone} India</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 font-mono">
                  {zn.growthVelocity}
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-white font-mono">{zn.demandSharePct}%</span>
                <span className="text-[11px] text-slate-400 font-semibold">of national orders</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {zn.keyCharacteristic}
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>Anchor: <strong className="text-slate-300">{zn.leadingState}</strong></span>
                <span className="text-emerald-400 font-mono font-bold">{zn.averageSentiment}% Pos</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* State Detail Inspection Modal / Drawer (if selected) */}
      {selectedState && (
        <div className="p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500 shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span>{selectedState.stateName}</span>
                  <span className="text-xs font-normal text-slate-400 font-mono">({selectedState.stateCode})</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {selectedState.zone} Zone • {selectedState.capital}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedState.tierDistribution}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedState(null)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Close State Detail ✕
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block font-sans">Market Share</span>
              <span className="text-xl font-bold text-white mt-1 block">{selectedState.demandSharePct}%</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block font-sans">Customer Rating</span>
              <span className="text-xl font-bold text-emerald-400 mt-1 block">{selectedState.averageRating} ★ ({selectedState.sentimentScore}%)</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block font-sans">Return / Defect Rate</span>
              <span className={`text-xl font-bold mt-1 block ${selectedState.returnRatePct > 3 ? 'text-amber-400' : 'text-slate-200'}`}>
                {selectedState.returnRatePct}%
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block font-sans">Demand Intensity</span>
              <span className="text-xl font-bold text-indigo-400 mt-1 block">{selectedState.demandIntensity}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/20 space-y-1.5">
              <span className="text-emerald-400 font-bold uppercase text-[11px] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Primary Regional Advantage</span>
              </span>
              <p className="text-slate-200 leading-relaxed">{selectedState.topStrength}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/20 space-y-1.5">
              <span className="text-rose-400 font-bold uppercase text-[11px] flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Regional Friction / Constraint</span>
              </span>
              <p className="text-slate-200 leading-relaxed">{selectedState.localFrictionPoint}</p>
            </div>
          </div>

          {selectedState.sampleQuote && (
            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs italic text-slate-300 flex items-start space-x-2.5">
              <Quote className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Verbatim Local Voice: "{selectedState.sampleQuote}"</span>
            </div>
          )}
        </div>
      )}

      {/* State Intelligence Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>State Scorecard ({filteredStates.length} Regions Listed)</span>
          </div>
          <span className="text-xs text-slate-400">Click any card to inspect full localized analytics</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStates.map((st) => (
            <div
              key={st.stateCode}
              onClick={() => setSelectedState(st)}
              className={`glass-card rounded-2xl p-5 cursor-pointer transition-all space-y-3 hover:border-emerald-500/50 hover:bg-slate-900/90 ${
                selectedState?.stateCode === st.stateCode ? 'border-emerald-500 bg-slate-900 shadow-lg shadow-emerald-500/10' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="h-8 w-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-xs text-emerald-400 font-mono">
                    {st.stateCode}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-sm hover:text-emerald-300 transition-colors">{st.stateName}</h4>
                    <span className="text-[10px] text-slate-400">{st.zone} Zone • {st.capital}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-white font-mono block">{st.demandSharePct}% Vol</span>
                  <span className="text-[10px] text-emerald-400 font-bold">{st.averageRating} ★</span>
                </div>
              </div>

              {/* Progress bar for demand share */}
              <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, st.demandSharePct * 4)}%` }}
                />
              </div>

              <div className="text-xs text-slate-300 space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Return Rate:</span>
                  <span className={`font-mono font-bold ${st.returnRatePct > 3 ? 'text-amber-400' : 'text-slate-300'}`}>
                    {st.returnRatePct}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                  "{st.topStrength}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">{st.demandIntensity} Demand</span>
                <span className="text-emerald-400 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <span>Inspect</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sovereign Strategic Regional Directives */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-4 border border-orange-500/20 bg-gradient-to-br from-slate-900/90 via-orange-950/10 to-slate-900/90">
        <div className="flex items-center space-x-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4 text-orange-400" />
          <span>Sovereign Strategic Recommendations by Territory</span>
        </div>
        <h3 className="text-lg font-black text-white">Geographic Market Optimization Directives</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {intelligence.strategicRegionalAdvice.map((advice, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start space-x-3">
              <span className="h-5 w-5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{advice}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
