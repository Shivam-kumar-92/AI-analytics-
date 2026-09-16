import React, { useState } from 'react';
import {
  Activity,
  TrendingUp,
  AlertCircle,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  BarChart2,
  Compass,
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

export const DemandTab: React.FC<DemandTabProps> = ({
  demandIntel,
  productName,
  isOilIndustryDemo = false,
}) => {
  const [timeFilter, setTimeFilter] = useState<'7' | '30' | 'all'>('all');

  const filteredHistoricalPoints = React.useMemo(() => {
    if (timeFilter === 'all') return demandIntel.historicalPoints;
    const count = parseInt(timeFilter, 10);
    return demandIntel.historicalPoints.slice(-count);
  }, [demandIntel.historicalPoints, timeFilter]);

  const combinedPoints = [
    ...filteredHistoricalPoints,
    ...demandIntel.projectedPoints,
  ];

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
            Demand Score: <span className="text-sky-400">{demandIntel.score}/100</span> —{' '}
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
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center space-x-1.5 text-sky-400">
              <span className="w-3 h-0.5 bg-sky-400" />
              <span>Observed History</span>
            </span>
            <span className="flex items-center space-x-1.5 text-indigo-400">
              <span className="w-3 h-0.5 bg-indigo-400 border-dashed" />
              <span>Projected (Est)</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedPoints} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="period" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" domain={[50, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="demand"
                name="Demand Index"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ r: 4, fill: '#38bdf8' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
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
