import React, { useState } from 'react';
import {
  Tag,
  Percent,
  CheckCircle2,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  Store,
  ShoppingBag,
  Coins,
  AlertTriangle,
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
                <XAxis dataKey="label" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12, fill: '#94a3b8' }} />
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

      {/* Interactive "What-If" Pricing & Revenue Simulator */}
      <PricingSimulator marketValue={marketValue} productName={productName} />

      {/* Indian Trade Channel & GST Margin Simulator */}
      <UnitEconomicsSimulator marketValue={marketValue} productName={productName} />
    </div>
  );
};

interface PricingSimulatorProps {
  marketValue: MarketValueAnalysis;
  productName: string;
}

const PricingSimulator: React.FC<PricingSimulatorProps> = ({ marketValue, productName }) => {
  const basePrice = marketValue.productPrice || 100;
  const [simPrice, setSimPrice] = React.useState<number>(basePrice);
  const [elasticityCoeff, setElasticityCoeff] = React.useState<number>(-1.35);

  const minSlider = Math.max(1, Math.round(basePrice * 0.5));
  const maxSlider = Math.round(basePrice * 1.8);

  // Price delta ratio
  const priceDeltaRatio = basePrice > 0 ? (simPrice - basePrice) / basePrice : 0;
  const priceDeltaPct = Number((priceDeltaRatio * 100).toFixed(1));

  // Projected Demand Change = Elasticity * Delta P
  const demandDeltaRatio = priceDeltaRatio * elasticityCoeff;
  const demandDeltaPct = Number((demandDeltaRatio * 100).toFixed(1));

  // Projected Revenue Multiplier = (1 + Delta P) * (1 + Delta Q) - 1
  const revDeltaRatio = (1 + priceDeltaRatio) * (1 + demandDeltaRatio) - 1;
  const revDeltaPct = Number((revDeltaRatio * 100).toFixed(1));

  // Simulated position vs market average
  const simDiffFromAvg = marketValue.averageMarketPrice > 0 ? (simPrice - marketValue.averageMarketPrice) / marketValue.averageMarketPrice : 0;
  const simDiffFromAvgPct = Number((simDiffFromAvg * 100).toFixed(1));

  let simPositionLabel = 'Competitive';
  if (simDiffFromAvgPct <= -15) simPositionLabel = 'Undervalued';
  else if (simDiffFromAvgPct <= -3) simPositionLabel = 'Competitive';
  else if (simDiffFromAvgPct <= 5) simPositionLabel = 'Fairly Priced';
  else if (simDiffFromAvgPct <= 20) simPositionLabel = 'Premium Priced';
  else simPositionLabel = 'Overpriced';

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Percent className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Interactive "What-If" Pricing & Revenue Simulator</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Live Elasticity Model
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Simulate the commercial impact of pricing adjustments for {productName} on demand velocity and total revenue before execution.
          </p>
        </div>

        <button
          onClick={() => setSimPrice(basePrice)}
          className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer w-fit self-start md:self-auto"
        >
          Reset to Baseline ({marketValue.currencySymbol}{basePrice.toLocaleString()})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Slider & Input Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Simulated Price Target
              </label>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-bold text-indigo-400 font-mono">{marketValue.currencySymbol}</span>
                <input
                  type="number"
                  value={simPrice}
                  onChange={(e) => setSimPrice(Math.max(1, Number(e.target.value) || 1))}
                  className="w-28 bg-slate-950 border border-indigo-500/40 rounded-xl px-2.5 py-1 text-sm font-bold text-white font-mono focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

            <input
              type="range"
              min={minSlider}
              max={maxSlider}
              step={Math.max(1, Math.round(basePrice * 0.01))}
              value={simPrice}
              onChange={(e) => setSimPrice(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />

            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Min: {marketValue.currencySymbol}{minSlider.toLocaleString()}</span>
              <span className="text-indigo-400 font-semibold">Current: {marketValue.currencySymbol}{basePrice.toLocaleString()}</span>
              <span>Max: {marketValue.currencySymbol}{maxSlider.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Assumed Elasticity Sensitivity:</span>
              <select
                value={elasticityCoeff}
                onChange={(e) => setElasticityCoeff(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none"
              >
                <option value={-0.8}>Inelastic (-0.8x) — Strong Brand Loyalty</option>
                <option value={-1.35}>Moderate (-1.35x) — Standard Consumer D2C</option>
                <option value={-2.1}>Highly Elastic (-2.1x) — Commodity / Price Sensitive</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500">
              Higher elasticity means customers defect more quickly when price increases.
            </p>
          </div>
        </div>

        {/* Projected Impact Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Price Shift Delta */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Price Shift
            </span>
            <div className={`text-2xl font-black ${priceDeltaPct > 0 ? 'text-amber-400' : priceDeltaPct < 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
              {priceDeltaPct > 0 ? `+${priceDeltaPct}%` : `${priceDeltaPct}%`}
            </div>
            <span className="text-[11px] text-slate-400 block">
              Position: <strong className="text-white">{simPositionLabel}</strong>
            </span>
          </div>

          {/* 2. Projected Demand Shift */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Projected Demand
            </span>
            <div className={`text-2xl font-black ${demandDeltaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {demandDeltaPct >= 0 ? `+${demandDeltaPct}%` : `${demandDeltaPct}%`}
            </div>
            <span className="text-[11px] text-slate-400 block">
              {demandDeltaPct >= 0 ? 'Volume expansion' : 'Customer volume contraction'}
            </span>
          </div>

          {/* 3. Estimated Revenue Impact */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Estimated Net Revenue
            </span>
            <div className={`text-2xl font-black ${revDeltaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {revDeltaPct >= 0 ? `+${revDeltaPct}%` : `${revDeltaPct}%`}
            </div>
            <span className="text-[11px] text-slate-400 block">
              {revDeltaPct >= 0 ? 'Net revenue accretive' : 'Net revenue dilutive'}
            </span>
          </div>

          {/* Summary Prescriptive Callout */}
          <div className="sm:col-span-3 p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/20 text-xs text-slate-300 flex items-start space-x-3">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="leading-relaxed">
              {priceDeltaPct === 0 ? (
                `Currently at baseline price of ${marketValue.currencySymbol}${basePrice.toLocaleString()}. Use the slider above to evaluate price optimization margins.`
              ) : revDeltaPct > 0 ? (
                <span>
                  <strong>Favorable pricing opportunity:</strong> Pricing at <strong>{marketValue.currencySymbol}{simPrice.toLocaleString()}</strong> ({priceDeltaPct > 0 ? `+${priceDeltaPct}%` : `${priceDeltaPct}%`}) is projected to yield an estimated <strong>+{revDeltaPct}% net revenue increase</strong> despite a {demandDeltaPct}% demand volume shift, leveraging pricing power headroom.
                </span>
              ) : (
                <span>
                  <strong>Margin caution advised:</strong> Shifting price to <strong>{marketValue.currencySymbol}{simPrice.toLocaleString()}</strong> is projected to reduce net revenue by <strong>{Math.abs(revDeltaPct)}%</strong> because volume defect rate ({Math.abs(demandDeltaPct)}%) outweighs price gains.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Indian Trade Channel & GST Margin Simulator Component
// -------------------------------------------------------------

interface ChannelPreset {
  id: string;
  name: string;
  platformExamples: string;
  commissionPct: number;
  fixedFee: number;
  courierCost: number;
  description: string;
  icon: any;
}

const TRADE_CHANNELS: ChannelPreset[] = [
  {
    id: 'quick_commerce',
    name: 'Quick Commerce (10-Min)',
    platformExamples: 'Blinkit, Zepto, Instamart',
    commissionPct: 22,
    fixedFee: 15,
    courierCost: 20,
    description: 'Dark-store slotting + rapid delivery platform take rate (~20–25%)',
    icon: ShoppingBag,
  },
  {
    id: 'marketplace',
    name: 'Online Marketplaces',
    platformExamples: 'Amazon India, Flipkart, Meesho',
    commissionPct: 15,
    fixedFee: 25,
    courierCost: 55,
    description: 'Referral commission + FBA/FBF closing & weight handling',
    icon: Store,
  },
  {
    id: 'd2c',
    name: 'Direct D2C Brand',
    platformExamples: 'Brand Website (Shopify/Shiprocket)',
    commissionPct: 2.5,
    fixedFee: 0,
    courierCost: 65,
    description: 'Payment gateway (2.5%) + performance marketing CAC (~15%)',
    icon: Coins,
  },
  {
    id: 'general_trade',
    name: 'General Trade / Kirana',
    platformExamples: 'Distributor & Traditional Retail',
    commissionPct: 22,
    fixedFee: 0,
    courierCost: 15,
    description: 'Wholesale super-stockist (12%) + Kirana retailer margin (10%)',
    icon: Store,
  },
];

const GST_SLABS = [
  { rate: 0, label: '0% Exempt', hint: 'Unpackaged staples, fresh agro' },
  { rate: 5, label: '5% Basic', hint: 'Packaged tea, spices, EV batteries' },
  { rate: 12, label: '12% Std I', hint: 'Processed foods, pharma, apparel' },
  { rate: 18, label: '18% Std II', hint: 'Audio, personal care, electronics' },
  { rate: 28, label: '28% Luxury', hint: 'Automobiles, premium lifestyle' },
];

interface UnitEconomicsProps {
  marketValue: MarketValueAnalysis;
  productName: string;
}

const UnitEconomicsSimulator: React.FC<UnitEconomicsProps> = ({ marketValue, productName }) => {
  const baseSp = marketValue.productPrice || 1000;
  const [sellingPrice, setSellingPrice] = useState<number>(baseSp);
  const [cogs, setCogs] = useState<number>(Math.max(10, Math.round(baseSp * 0.38)));
  const [selectedChannelId, setSelectedChannelId] = useState<string>('quick_commerce');
  const [gstRate, setGstRate] = useState<number>(18);
  const [marketingCacPct, setMarketingCacPct] = useState<number>(15);

  const channel = TRADE_CHANNELS.find((c) => c.id === selectedChannelId) || TRADE_CHANNELS[0];

  // GST Calculation (Price inclusive of GST)
  const taxableBasePrice = sellingPrice / (1 + gstRate / 100);
  const gstAmount = Math.round(sellingPrice - taxableBasePrice);

  // Channel fees & Logistics
  const channelCommission = Math.round(sellingPrice * (channel.commissionPct / 100)) + channel.fixedFee;
  const marketingCost = channel.id === 'd2c' ? Math.round(sellingPrice * (marketingCacPct / 100)) : 0;
  const logisticsCost = channel.courierCost;

  // Total deductions & Net Margin
  const totalDeductions = cogs + gstAmount + channelCommission + logisticsCost + marketingCost;
  const netMargin = sellingPrice - totalDeductions;
  const netMarginPct = Number(((netMargin / sellingPrice) * 100).toFixed(1));

  // Break-even units for ₹1,50,000 monthly fixed operational overhead
  const fixedOverheadMonthly = 150000;
  const breakEvenUnits = netMargin > 0 ? Math.ceil(fixedOverheadMonthly / netMargin) : null;

  const isHealthy = netMarginPct >= 20;
  const isModerate = netMarginPct >= 8 && netMarginPct < 20;

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Receipt className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">Indian Trade Channel & GST Margin Simulator</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Unit Economics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Model net contribution margin for <strong>{productName}</strong> across quick-commerce, e-commerce marketplaces, D2C, and Kirana distribution with live GST deduction.
          </p>
        </div>

        <button
          onClick={() => {
            setSellingPrice(baseSp);
            setCogs(Math.max(10, Math.round(baseSp * 0.38)));
          }}
          className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer w-fit self-start md:self-auto"
        >
          Reset to Baseline
        </button>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 space-y-5">
          {/* Channel Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Sales Channel & Distribution Model</span>
              <span className="text-[11px] text-slate-500 font-mono">{channel.platformExamples}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TRADE_CHANNELS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannelId(ch.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedChannelId === ch.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <ch.icon className={`w-4 h-4 mb-1 ${selectedChannelId === ch.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <div className="text-[11px] font-bold truncate">{ch.name.split(' ')[0]}</div>
                  <div className="text-[9px] text-slate-400 truncate">{ch.commissionPct}% fee</div>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 italic pt-0.5">{channel.description}</p>
          </div>

          {/* Pricing & Cost Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">Selling Price (MRP / Listing ₹)</label>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 font-bold">{marketValue.currencySymbol}</span>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Math.max(1, Number(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono font-bold text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">COGS (Manufacturing / Procurement ₹)</label>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 font-bold">{marketValue.currencySymbol}</span>
                <input
                  type="number"
                  value={cogs}
                  onChange={(e) => setCogs(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono font-bold text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* GST Slab Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Indian GST Slab Category</span>
              <span className="text-[11px] text-emerald-400 font-mono">Deduction: {marketValue.currencySymbol}{gstAmount.toLocaleString()}</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {GST_SLABS.map((slab) => (
                <button
                  key={slab.rate}
                  onClick={() => setGstRate(slab.rate)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    gstRate === slab.rate
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs">{slab.rate}%</div>
                  <div className="text-[9px] text-slate-500 truncate">{slab.label.split(' ')[1] || 'Slab'}</div>
                </button>
              ))}
            </div>
          </div>

          {/* D2C Marketing CAC Slider (only for D2C channel) */}
          {channel.id === 'd2c' && (
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-indigo-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-300">Target Performance Marketing CAC (% of GMV)</span>
                <span className="font-mono font-bold text-white">{marketingCacPct}% ({marketValue.currencySymbol}{marketingCost.toLocaleString()})</span>
              </div>
              <input
                type="range"
                min="5"
                max="35"
                step="1"
                value={marketingCacPct}
                onChange={(e) => setMarketingCacPct(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Right Panel: Output KPI Cards & Waterfall */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* 1. Net Profit per Unit */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Net Margin / Unit
              </span>
              <div className={`text-2xl font-black ${isHealthy ? 'text-emerald-400' : isModerate ? 'text-amber-400' : 'text-rose-400'}`}>
                {marketValue.currencySymbol}{netMargin.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-400 block font-semibold">
                {netMarginPct}% Net Margin
              </span>
            </div>

            {/* 2. Break-Even Volume */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Break-Even Volume
              </span>
              <div className="text-2xl font-black text-white font-mono">
                {breakEvenUnits ? `${breakEvenUnits.toLocaleString()}` : 'N/A'}
              </div>
              <span className="text-[11px] text-slate-400 block">
                Units/month (@ ₹1.5L overhead)
              </span>
            </div>
          </div>

          {/* Unit Economics Waterfall Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
            <span className="font-bold text-white block pb-1 border-b border-slate-800">
              Unit Deduction Breakdown (₹)
            </span>

            <div className="flex justify-between items-center text-slate-400">
              <span>Gross Selling Price</span>
              <span className="font-mono font-bold text-white">{marketValue.currencySymbol}{sellingPrice.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-rose-300/80">
              <span>(-) COGS / Production</span>
              <span className="font-mono">-{marketValue.currencySymbol}{cogs.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-amber-300/80">
              <span>(-) GST ({gstRate}%)</span>
              <span className="font-mono">-{marketValue.currencySymbol}{gstAmount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-sky-300/80">
              <span>(-) Platform Commission ({channel.commissionPct}%)</span>
              <span className="font-mono">-{marketValue.currencySymbol}{channelCommission.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-indigo-300/80">
              <span>(-) Logistics & Packing</span>
              <span className="font-mono">-{marketValue.currencySymbol}{logisticsCost.toLocaleString()}</span>
            </div>

            {marketingCost > 0 && (
              <div className="flex justify-between items-center text-purple-300/80">
                <span>(-) Digital Marketing CAC</span>
                <span className="font-mono">-{marketValue.currencySymbol}{marketingCost.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-slate-800 font-bold">
              <span className="text-white">Net Contribution Margin</span>
              <span className={`font-mono ${isHealthy ? 'text-emerald-400' : isModerate ? 'text-amber-400' : 'text-rose-400'}`}>
                {marketValue.currencySymbol}{netMargin.toLocaleString()} ({netMarginPct}%)
              </span>
            </div>
          </div>

          {/* Status Verdict */}
          <div className={`p-3.5 rounded-2xl border text-xs flex items-start space-x-2.5 ${
            isHealthy
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : isModerate
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-snug">
              {isHealthy ? (
                <span><strong>Strong Channel Viability:</strong> At a {netMarginPct}% net margin, this product has sufficient commercial buffer to withstand seasonal discounting and advertising fluctuations in {channel.name}.</span>
              ) : isModerate ? (
                <span><strong>Tight Commercial Buffer:</strong> A {netMarginPct}% margin provides modest profitability. Consider bundling or negotiating platform slotting fees to expand gross spread above 20%.</span>
              ) : (
                <span><strong>Loss Risk / Unviable Spread:</strong> Negative or low net margin ({netMarginPct}%). To launch successfully on {channel.name}, either optimize procurement costs or increase price point by ₹{Math.abs(netMargin) + 50}.</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
