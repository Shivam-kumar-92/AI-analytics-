import React from 'react';
import {
  Tag,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Percent,
  CheckCircle2,
  Compass,
  ArrowDownRight,
  ArrowUpRight,
  Layers,
} from 'lucide-react';
import { MarketValueAnalysis } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

interface MarketValueTabProps {
  marketValue: MarketValueAnalysis;
  productName: string;
}

export const MarketValueTab: React.FC<MarketValueTabProps> = ({
  marketValue,
  productName,
}) => {
  const isDiscount = marketValue.pricePositionPct <= 0;

  const comparisonData = [
    { label: 'Min Market', price: marketValue.minPrice, fill: '#64748b' },
    { label: `${productName} (Our Price)`, price: marketValue.productPrice, fill: '#6366f1' },
    { label: 'Market Average', price: marketValue.averageMarketPrice, fill: '#38bdf8' },
    { label: 'Max Market', price: marketValue.maxPrice, fill: '#f43f5e' },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Tag className="w-4 h-4" />
            <span>Market Value & Pricing Intelligence</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white">
            Pricing Position:{' '}
            <span
              className={
                marketValue.pricePositionLabel === 'Competitive' || marketValue.pricePositionLabel === 'Undervalued'
                  ? 'text-emerald-400'
                  : marketValue.pricePositionLabel === 'Fairly Priced'
                  ? 'text-sky-400'
                  : 'text-amber-400'
              }
            >
              {marketValue.pricePositionLabel}
            </span>
          </h2>

          <p className="text-sm text-slate-300 max-w-2xl font-medium">
            "{marketValue.elasticityAssessment}"
          </p>
        </div>

        {/* Price Difference KPI Card */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center space-x-5 shrink-0">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Product Price
            </span>
            <span className="text-2xl font-black text-white">
              {marketValue.currencySymbol}
              {marketValue.productPrice.toLocaleString()}
            </span>
          </div>
          <div className="h-10 w-[1px] bg-slate-800" />
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Market Benchmark
            </span>
            <span className="text-2xl font-black text-slate-300">
              {marketValue.currencySymbol}
              {marketValue.averageMarketPrice.toLocaleString()}
            </span>
          </div>
          <div className="h-10 w-[1px] bg-slate-800" />
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Position Delta
            </span>
            <span
              className={`text-xl font-bold flex items-center ${
                isDiscount ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isDiscount ? <ArrowDownRight className="w-4 h-4 mr-0.5" /> : <ArrowUpRight className="w-4 h-4 mr-0.5" />}
              {Math.abs(marketValue.pricePositionPct)}%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Comparison Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-white">Market Price Spectrum</h3>
            <p className="text-xs text-slate-400">Positioning product against minimum, benchmark, and ceiling values</p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${marketValue.currencySymbol}${Number(val).toLocaleString()}`, 'Price']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="price" radius={[8, 8, 0, 0]}>
                  {comparisonData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pricing Strategy & Elasticity Card */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Price Elasticity Assessment</h3>
            <p className="text-xs text-slate-400">Consumer sensitivity & pricing headroom</p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                Disruption Advantage
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                By maintaining a {Math.abs(marketValue.pricePositionPct)}% price advantage, the product lowers consumer adoption hesitation and accelerates new customer acquisition.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block">
                Margin Headroom Recommendation
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Current price leaves approximately {marketValue.currencySymbol}{Math.round(marketValue.averageMarketPrice - marketValue.productPrice).toLocaleString()} of upward pricing room before reaching parity with the category mean.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between font-mono">
            <span>Min: {marketValue.currencySymbol}{marketValue.minPrice.toLocaleString()}</span>
            <span>Avg: {marketValue.currencySymbol}{marketValue.averageMarketPrice.toLocaleString()}</span>
            <span>Max: {marketValue.currencySymbol}{marketValue.maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
