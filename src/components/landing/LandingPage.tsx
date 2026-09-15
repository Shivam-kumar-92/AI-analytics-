import React from 'react';
import {
  Activity,
  ArrowRight,
  Sparkles,
  Droplets,
  Headphones,
  Car,
  ShoppingBag,
  HeartPulse,
  CreditCard,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  Globe2,
  Cpu,
  Flame,
  Check,
  Compass,
} from 'lucide-react';
import { DemoConfig } from '../../datasets';
import { MadeInIndia3D } from '../3d/MadeInIndia3D';

interface LandingPageProps {
  onStartAnalysis: () => void;
  demos: DemoConfig[];
  onSelectDemo: (demoId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  demos,
  onSelectDemo,
}) => {
  const getDemoIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="w-5 h-5 text-slate-400" />;
      case 'Headphones': return <Headphones className="w-5 h-5 text-slate-400" />;
      case 'Car': return <Car className="w-5 h-5 text-slate-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-slate-400" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-slate-400" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-slate-400" />;
      default: return <Sparkles className="w-5 h-5 text-slate-400" />;
    }
  };

  const getDemoPricing = (id: string) => {
    switch (id) {
      case 'earbuds': return '₹1,499';
      case 'automotive': return '₹17.49 Lakh';
      case 'fmcg': return '₹140';
      case 'healthcare': return '₹185';
      case 'fintech': return '₹1,000/yr';
      case 'oil_gas': return '₹6,480/bbl';
      default: return '₹999';
    }
  };

  const getDemoMetric = (id: string) => {
    switch (id) {
      case 'earbuds': return { label: 'Sentiment', value: '81% Pos' };
      case 'automotive': return { label: 'Safety Index', value: '5-Star NCAP' };
      case 'fmcg': return { label: 'Repeat Rate', value: '66% Kirana' };
      case 'healthcare': return { label: 'Praise Ratio', value: '83% Pos' };
      case 'fintech': return { label: 'Monthly GMV', value: '₹265.8 Cr' };
      case 'oil_gas': return { label: 'Demand Score', value: '91/100' };
      default: return { label: 'Demand', value: '84/100' };
    }
  };

  return (
    <div className="space-y-24 py-6 md:py-14 relative overflow-hidden">
      {/* Radiant Background Mesh Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 overflow-hidden opacity-40">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-slate-500/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute -top-20 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-white/5 rounded-full blur-[140px]" />
      </div>

      {/* ========================================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================================= */}
      <div className="text-center space-y-7 max-w-5xl mx-auto px-4">
        {/* Animated Pill Badge */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50 text-slate-300 text-xs font-semibold tracking-wide shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500" />
          </span>
          <span>
            YUKTIVYA AI • Sovereign Indian Market Intelligence
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 text-[10px] font-bold uppercase">
            v2.4 Live
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-100 leading-[1.1]">
          Turn Complex Indian Data Into <br className="hidden sm:inline" />
          <span className="text-slate-300">
            High-Conviction Decisions.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          An enterprise AI Data Analyst engineered specifically for Indian products, consumer sentiment, Amazon & Flipkart reviews, FMCG retail sell-through, and demand forecasting.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
          <button
            onClick={onStartAnalysis}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center space-x-2.5 cursor-pointer group border border-slate-700/50"
          >
            <Sparkles className="w-5 h-5 text-slate-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Upload Your Dataset (CSV, Excel)</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <button
            onClick={() => onSelectDemo('earbuds')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600/80 text-slate-300 font-medium text-sm sm:text-base transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
          >
            <Headphones className="w-5 h-5 text-slate-400" />
            <span>boAt Earbuds Demo</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">₹1,499</span>
          </button>

          <button
            onClick={() => onSelectDemo('automotive')}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600/80 text-slate-300 font-medium text-sm sm:text-base transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
          >
            <Car className="w-5 h-5 text-slate-400" />
            <span>Tata Nexon EV Demo</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">EV SUV</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-400">
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero Hallucinations Guarantee</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Automated Data Cleaning (IQR & Deduplication)</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>All File Formats (CSV, XLSX, XLS, JSON, TXT)</span>
          </span>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE LIVE INTELLIGENCE TERMINAL (HERO SHOWPIECE) */}
        {/* ========================================================================= */}
        <div className="pt-6 max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950 border border-orange-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,119,0,0.15)] overflow-hidden text-left backdrop-blur-xl">
            {/* Terminal Window Header Bar */}
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-2 overflow-hidden">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="flex space-x-1.5 flex-shrink-0">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] sm:text-xs font-mono text-slate-400 pl-1 sm:pl-2 truncate max-w-[140px] sm:max-w-none">
                  yuktivya://boAt_Airdopes_141.csv
                </span>
              </div>

              <div className="flex items-center space-x-1.5 flex-shrink-0">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-300 font-mono whitespace-nowrap">
                  96.8% CONF
                </span>
              </div>
            </div>

            {/* Live Analytics Dashboard Preview Body */}
            <div className="p-5 sm:p-7 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Metric 1 */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Consumer Sentiment
                  </span>
                  <div className="text-2xl font-black text-emerald-400 flex items-baseline space-x-1.5">
                    <span>81.4%</span>
                    <span className="text-xs font-normal text-slate-400">Positive</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1.5">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '81.4%' }} />
                  </div>
                  <span className="text-[10px] text-slate-500 block pt-0.5">
                    25,420 Amazon & Flipkart Reviews
                  </span>
                </div>

                {/* Metric 2 */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Verified Demand Score
                  </span>
                  <div className="text-2xl font-black text-orange-400 flex items-baseline space-x-1.5">
                    <span>88/100</span>
                    <span className="text-xs font-semibold text-emerald-400">+14.2% QoQ</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1.5">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                  <span className="text-[10px] text-slate-500 block pt-0.5">
                    High Growth Directional Momentum
                  </span>
                </div>

                {/* Metric 3 */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Price Positioning
                  </span>
                  <div className="text-2xl font-black text-white flex items-baseline space-x-1.5">
                    <span>₹1,499</span>
                    <span className="text-xs font-bold text-emerald-400">11.8% Under Avg</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-1.5">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '68%' }} />
                  </div>
                  <span className="text-[10px] text-slate-500 block pt-0.5">
                    Category Average: ₹1,699
                  </span>
                </div>
              </div>

              {/* AI Strategic Verdict Callout */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-slate-900/80 to-emerald-500/10 border border-orange-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400 flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>Yuktivya Strategic Recommendation</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    <strong className="text-white">Commercial Verdict: High Potential (82/100).</strong> boAt maintains category leadership in bass and pricing. Priority action: improve microphone noise isolation for noisy Indian traffic environments to convert 12% neutral buyers.
                  </p>
                </div>

                <button
                  onClick={() => onSelectDemo('earbuds')}
                  className="shrink-0 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs transition-all flex items-center space-x-1 cursor-pointer shadow-md"
                >
                  <span>Explore Full Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STATISTICAL IMPACT TICKER */}
      {/* ========================================================================= */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-lg">
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              140 Cr+
            </div>
            <p className="text-xs text-slate-400 font-medium">Indian Demographic Scope</p>
          </div>

          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white">
              ₹25,000 Cr+
            </div>
            <p className="text-xs text-slate-400 font-medium">Retail & EV GMV Modeled</p>
          </div>

          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              6 Built-In
            </div>
            <p className="text-xs text-slate-400 font-medium">Iconic Indian Household Demos</p>
          </div>

          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white">
              100%
            </div>
            <p className="text-xs text-slate-400 font-medium">Deterministic Mathematical Grounding</p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE 3D ASHOKA COIN SHOWPIECE */}
      {/* ========================================================================= */}
      <div className="max-w-5xl mx-auto px-4">
        <MadeInIndia3D variant="hero-widget" />
      </div>

      {/* ========================================================================= */}
      {/* 6 BUILT-IN REAL INDIAN PRODUCT DEMOS */}
      {/* ========================================================================= */}
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400">
                Native Indian Enterprise Datasets
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              6 Built-In Household Brand Demos
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm sm:text-right">
            Click any Indian product card to instantly generate deep sentiment, demand, and pricing intelligence reports.
          </p>
        </div>

        <div className="space-y-12">
          {Array.from(new Set(demos.map(d => d.industry))).map(industry => {
            const industryDemos = demos.filter(d => d.industry === industry);
            return (
              <div key={industry} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-300 border-b border-slate-800/80 pb-2 flex items-center space-x-2">
                  <span>{industry} Sector</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {industryDemos.map((d) => {
                    const metric = getDemoMetric(d.id);
                    const price = getDemoPricing(d.id);

                    return (
                      <div
                        key={d.id}
                        onClick={() => onSelectDemo(d.id)}
                        className="glass-card rounded-3xl p-6 cursor-pointer hover:border-slate-500/30 hover:bg-slate-900/90 transition-all group flex flex-col justify-between relative overflow-hidden"
                      >
                        {/* Top Subtle Gradient Accents */}
                        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-slate-500/5 to-transparent rounded-bl-3xl pointer-events-none" />

                        <div className="space-y-4">
                          {/* Category Pill & Real Price Tag */}
                          <div className="flex items-center justify-between">
                            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 group-hover:scale-110 group-hover:border-slate-600/40 transition-all shadow-sm">
                              {getDemoIcon(d.iconName)}
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-slate-900 border border-slate-700/50 text-slate-300">
                                {price}
                              </span>
                              <span className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-800/50 text-slate-400 border border-slate-700/50 uppercase tracking-wider">
                                {d.badge}
                              </span>
                            </div>
                          </div>

                          {/* Brand & Product Name */}
                          <div>
                            <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">
                              {d.name}
                            </h3>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-slate-400/90 leading-relaxed line-clamp-3">
                            {d.description}
                          </p>
                        </div>

                        {/* Bottom Metric & Action Arrow */}
                        <div className="mt-6 pt-4 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-400 font-medium">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] uppercase font-semibold text-slate-500">{metric.label}:</span>
                            <span className="font-medium text-slate-300">{metric.value}</span>
                          </div>

                          <span className="text-slate-300 font-semibold flex items-center space-x-1 group-hover:translate-x-1.5 transition-transform">
                            <span>Launch Report</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COMPREHENSIVE ANALYTICAL CAPABILITIES */}
      {/* ========================================================================= */}
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End Quantitative Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Six Institutional Analytics Engines
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Everything your management team, research analysts, and investment committees need to evaluate market sizing, pricing power, and sentiment risk.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-card rounded-3xl p-6 space-y-3.5 border-t-2 border-t-indigo-500/60">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Review & Sentiment NLP</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes Amazon & Flipkart feedback with granular star distributions, polarity scores, and aspect-based feature extraction (battery, build, sound, customer support).
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-3xl p-6 space-y-3.5 border-t-2 border-t-orange-500/60">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-inner">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Demand Intelligence & Forecasting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates Demand Scores (0–100) with directional growth velocity, +3 period forecasts, and methodological transparency between Verified Sales and Proxy signals.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-3xl p-6 space-y-3.5 border-t-2 border-t-emerald-500/60">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Product Success Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-signal commercial potential evaluation across sentiment, competitive barriers, pricing headroom, and quality metrics with statistical confidence bounds.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-card rounded-3xl p-6 space-y-3.5 border-t-2 border-t-amber-500/60">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Market Value & Pricing (₹)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Benchmark selling prices in Indian Rupee (₹) against minimum, average, and ceiling competitor bands to evaluate price elasticity and margin opportunities.
            </p>
          </div>

          {/* Card 5 */}
          <div className="glass-card rounded-3xl p-6 space-y-3.5 border-t-2 border-t-purple-500/60">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Auto-Cleaning & EDA Stats</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatic missing value imputation, IQR outlier detection, deduplication, Pearson correlation matrices, and 0-100 Data Quality Scoring.
            </p>
          </div>

          {/* Card 6 */}
          <div className="glass-card rounded-3xl p-6 space-y-3.5 border-t-2 border-t-rose-500/60">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Cross-Industry Adaptability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adapts insights across Oil & Gas commodities, E-Commerce, Automotive EV, Healthcare, Retail FMCG, Banking, and Manufacturing seamlessly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
