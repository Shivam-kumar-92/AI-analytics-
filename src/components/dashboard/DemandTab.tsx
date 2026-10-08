import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Compass,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { DemandIntelligence } from '../../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';

interface DemandTabProps {
  demandIntel: DemandIntelligence;
  productName: string;
  isOilIndustryDemo?: boolean;
}

const triggerHaptic = (ms = 10) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {
      // ignore
    }
  }
};

export const DemandTab: React.FC<DemandTabProps> = ({
  demandIntel,
  productName,
  isOilIndustryDemo = false,
}) => {
  const [timeFilter, setTimeFilter] = useState<'7' | '30' | 'all'>('all');

  // Interactive What-If Scenario Simulator State
  const [supplyShockPct, setSupplyShockPct] = useState<number>(0);
  const [tariffShiftPct, setTariffShiftPct] = useState<number>(0);
  const [inflationShiftPct, setInflationShiftPct] = useState<number>(0);

  const isSimActive = supplyShockPct !== 0 || tariffShiftPct !== 0 || inflationShiftPct !== 0;

  // Elasticity response: tariffs decrease foreign demand, inflation reduces volume, supply shock drives scarcity/displacement
  const netDemandShiftPct = useMemo(() => {
    return Math.round(((-0.45 * supplyShockPct) + (-0.55 * tariffShiftPct) + (-0.4 * inflationShiftPct)) * 10) / 10;
  }, [supplyShockPct, tariffShiftPct, inflationShiftPct]);

  const riskRating = useMemo(() => {
    const abs = Math.abs(netDemandShiftPct);
    if (abs < 4) return { label: 'Low Volatility', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (abs < 12) return { label: 'Elevated Risk', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'Critical Shock', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  }, [netDemandShiftPct]);

  const handleResetSimulation = () => {
    triggerHaptic(15);
    setSupplyShockPct(0);
    setTariffShiftPct(0);
    setInflationShiftPct(0);
  };

  const filteredHistoricalPoints = useMemo(() => {
    if (timeFilter === 'all') return demandIntel.historicalPoints;
    const count = parseInt(timeFilter, 10);
    return demandIntel.historicalPoints.slice(-count);
  }, [demandIntel.historicalPoints, timeFilter]);

  const combinedPoints = useMemo(() => {
    return [
      ...filteredHistoricalPoints.map((p) => ({
        ...p,
        simulatedDemand: undefined,
      })),
      ...demandIntel.projectedPoints.map((p) => {
        const baseDemand = p.demand ?? demandIntel.score;
        const simDemand = Math.max(15, Math.min(100, Math.round(baseDemand * (1 + netDemandShiftPct / 100))));
        return {
          ...p,
          simulatedDemand: isSimActive ? simDemand : undefined,
        };
      }),
    ];
  }, [filteredHistoricalPoints, demandIntel.projectedPoints, netDemandShiftPct, isSimActive, demandIntel.score]);

  // Scatter plot data for Price vs Demand
  const priceVsDemandData = filteredHistoricalPoints
    .filter((p) => p.price !== undefined && p.demand !== undefined)
    .map((p) => ({
      price: p.price,
      demand: p.demand,
      period: p.period,
    }));

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner: Score & Proxy / Verified Badge */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950/30 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                demandIntel.isProxy
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {demandIntel.demandProxyLabel}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Confidence: <strong>{demandIntel.confidencePct}%</strong>
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white">
            Demand Score for {productName}: <span className="text-sky-400">{demandIntel.score}/100</span> —{' '}
            <span className="text-slate-200">{demandIntel.classification}</span>
          </h2>

          <p className="text-xs md:text-sm text-slate-300 max-w-2xl font-medium">
            "{demandIntel.aiDemandInterpretation}"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Directional Trend</span>
            <span className="text-lg font-bold text-emerald-400 uppercase flex items-center justify-center space-x-1 mt-0.5">
              <TrendingUp className="w-4 h-4" />
              <span>+{demandIntel.growthRatePct}%</span>
            </span>
            <span className="text-[10px] text-slate-500 capitalize">{demandIntel.demandTrend} momentum</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Seasonality</span>
            <span className="text-sm font-bold text-indigo-300 mt-1 block">Q3/Q4 Elevated</span>
            <span className="text-[10px] text-slate-500">Cyclical boost</span>
          </div>
        </div>
      </div>

      {/* Signals Used Explanatory Strip */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-300 font-semibold">
          <Compass className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Underlying Calculation Signals:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {demandIntel.proxySignalsUsed.map((signal, i) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px]"
            >
              • {signal}
            </span>
          ))}
        </div>
      </div>

      {/* Main Charts: Historical & Projected Demand Line Chart */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-bold text-white">Demand Trajectory & 3-Period Forecasting</h3>
              <select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="bg-slate-800 text-slate-200 text-xs font-semibold px-2 py-1 rounded border border-slate-700 outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <p className="text-xs text-slate-400 mt-1">Historical velocity tracking with linear trend extrapolation</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="flex items-center space-x-1.5 text-sky-400">
              <span className="w-3 h-0.5 bg-sky-400" />
              <span>Observed</span>
            </span>
            <span className="flex items-center space-x-1.5 text-indigo-400">
              <span className="w-3 h-0.5 bg-indigo-400" />
              <span>Projected</span>
            </span>
            {isSimActive && (
              <span className="flex items-center space-x-1.5 text-amber-400">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-400" />
                <span>What-If Simulated</span>
              </span>
            )}
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedPoints} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="period" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" domain={[40, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="demand"
                name="Baseline Demand"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ r: 4, fill: '#38bdf8' }}
                activeDot={{ r: 7 }}
              />
              {isSimActive && (
                <Line
                  type="monotone"
                  dataKey="simulatedDemand"
                  name="What-If Simulated"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ r: 5, fill: '#f59e0b' }}
                  activeDot={{ r: 7 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive What-If Scenario Simulator Panel */}
      <div className="glass-card rounded-3xl p-6 space-y-6 border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-slate-950">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white">Interactive Scenario Simulator</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  Quantitative What-If
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Stress-test demand projections against macro shocks, monsoon shifts, and tariff policies in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-xl text-xs font-bold border ${riskRating.color}`}>
              {riskRating.label}
            </div>

            <div className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono font-bold">
              Net Shift: <span className={netDemandShiftPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {netDemandShiftPct >= 0 ? `+${netDemandShiftPct}%` : `${netDemandShiftPct}%`}
              </span>
            </div>

            {isSimActive && (
              <button
                onClick={handleResetSimulation}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                title="Reset scenario sliders to baseline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Interactive Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Supply Shock / Climate Volatility */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Supply / Climate Shock</span>
              <span className="font-mono font-bold text-amber-400">
                {supplyShockPct > 0 ? `+${supplyShockPct}%` : `${supplyShockPct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              step="5"
              value={supplyShockPct}
              onChange={(e) => {
                triggerHaptic(5);
                setSupplyShockPct(parseInt(e.target.value, 10));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-30% Deficit</span>
              <span>Baseline</span>
              <span>+30% Surplus</span>
            </div>
          </div>

          {/* Slider 2: Export Tariffs & Trade Barriers */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Export Tariffs & Duties</span>
              <span className="font-mono font-bold text-sky-400">
                {tariffShiftPct > 0 ? `+${tariffShiftPct}%` : `${tariffShiftPct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              step="2"
              value={tariffShiftPct}
              onChange={(e) => {
                triggerHaptic(5);
                setTariffShiftPct(parseInt(e.target.value, 10));
              }}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-20% Subsidized</span>
              <span>Neutral</span>
              <span>+20% Tariff</span>
            </div>
          </div>

          {/* Slider 3: Macro Inflation / Cost of Living */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Inflation / Price Squeeze</span>
              <span className="font-mono font-bold text-rose-400">
                {inflationShiftPct > 0 ? `+${inflationShiftPct}%` : `${inflationShiftPct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-25"
              max="25"
              step="5"
              value={inflationShiftPct}
              onChange={(e) => {
                triggerHaptic(5);
                setInflationShiftPct(parseInt(e.target.value, 10));
              }}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-25% Deflation</span>
              <span>Moderate</span>
              <span>+25% Surge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Multi-Series Charts: Sales vs Demand / Production vs Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production / Sales Comparison */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              {isOilIndustryDemo ? 'Production Volume vs Market Demand' : 'Sales Volume vs Demand Momentum'}
            </h3>
            <p className="text-xs text-slate-400">Evaluating supply capacity vs consumption appetite</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredHistoricalPoints} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                {isOilIndustryDemo ? (
                  <>
                    <Bar dataKey="sales" name="Sales (bbl/d)" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="production" name="Production (bbl/d)" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </>
                ) : (
                  <>
                    <Bar dataKey="reviews" name="Review Count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="demand" name="Demand Index" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price vs Demand Scatter Plot */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">Price vs Demand Relationship</h3>
            <p className="text-xs text-slate-400">Scatter correlation between price points and demand absorption</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  type="number"
                  dataKey="price"
                  name="Price"
                  unit=" ₹"
                  stroke="#94a3b8"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <YAxis
                  type="number"
                  dataKey="demand"
                  name="Demand"
                  domain={[60, 100]}
                  stroke="#94a3b8"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <ZAxis dataKey="period" name="Period" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Scatter name="Observation" data={priceVsDemandData} fill="#f59e0b" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
