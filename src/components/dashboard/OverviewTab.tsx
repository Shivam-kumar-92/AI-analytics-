import React from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Tag,
  ThumbsUp,
  Activity,
  Award,
  Layers,
  Sparkles,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import {
  DemandIntelligence,
  MarketValueAnalysis,
  ProductSuccessScore,
  ReviewIntelligence,
  DataCleaningReport,
} from '../../types';
import { MetricCard } from '../common/MetricCard';
import { VerdictCard } from '../common/VerdictCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from 'recharts';

interface OverviewTabProps {
  productName: string;
  industry: string;
  isSyntheticDemo: boolean;
  successScore: ProductSuccessScore;
  demandIntel: DemandIntelligence;
  marketValue: MarketValueAnalysis;
  reviewIntel?: ReviewIntelligence;
  cleaningReport: DataCleaningReport;
  setActiveTab: (tab: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  productName,
  industry,
  isSyntheticDemo,
  successScore,
  demandIntel,
  marketValue,
  reviewIntel,
  cleaningReport,
  setActiveTab,
}) => {
  const radarData = [
    { subject: 'Customer Sentiment', value: successScore.breakdown.customerSentiment, fullMark: 100 },
    { subject: 'Demand Momentum', value: successScore.breakdown.demand, fullMark: 100 },
    { subject: 'Pricing Advantage', value: successScore.breakdown.pricing, fullMark: 100 },
    { subject: 'Market Growth', value: successScore.breakdown.marketGrowth, fullMark: 100 },
    { subject: 'Product Quality', value: successScore.breakdown.productQuality, fullMark: 100 },
    { subject: 'Competitive Edge', value: Math.max(15, 100 - successScore.breakdown.competition * 0.5), fullMark: 100 },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Top Telemetry KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Product Success Potential"
          value={`${successScore.overallScore}/100`}
          trend="up"
          trendValue={successScore.classification}
          badge={successScore.classification}
          badgeColor={successScore.classification === 'High Potential' ? 'emerald' : 'amber'}
          icon={<Award className="w-5 h-5 text-indigo-400" />}
          confidence={successScore.confidenceScore}
          infoTooltip="Composite index based on sentiment, demand velocity, price competitiveness, and category quality."
        />

        <MetricCard
          title="Demand Score"
          value={`${demandIntel.score}/100`}
          trend="up"
          trendValue={`+${demandIntel.growthRatePct}%`}
          badge={demandIntel.demandProxyLabel === 'Verified Market Demand' ? 'VERIFIED' : 'PROXY'}
          badgeColor={demandIntel.demandProxyLabel === 'Verified Market Demand' ? 'emerald' : 'amber'}
          icon={<Activity className="w-5 h-5 text-sky-400" />}
          confidence={demandIntel.confidencePct}
          infoTooltip={demandIntel.aiDemandInterpretation}
        />

        <MetricCard
          title="Price Competitiveness"
          value={`${marketValue.currencySymbol}${marketValue.productPrice.toLocaleString()}`}
          subtitle={`Avg: ${marketValue.currencySymbol}${marketValue.averageMarketPrice.toLocaleString()}`}
          trend={marketValue.pricePositionPct <= 0 ? 'up' : 'down'}
          trendValue={`${Math.abs(marketValue.pricePositionPct)}% ${marketValue.pricePositionPct <= 0 ? 'under' : 'above'}`}
          badge={marketValue.pricePositionLabel}
          badgeColor="indigo"
          icon={<Tag className="w-5 h-5 text-indigo-400" />}
          infoTooltip="Evaluated against competing market alternatives and benchmark averages."
        />

        <MetricCard
          title="Customer Sentiment"
          value={reviewIntel ? `${reviewIntel.metrics.positivePct}%` : '86%'}
          subtitle={reviewIntel ? `${reviewIntel.metrics.totalReviews.toLocaleString()} reviews` : 'Industry benchmark'}
          trend="up"
          trendValue="Favorable"
          badge="POSITIVE"
          badgeColor="emerald"
          icon={<ThumbsUp className="w-5 h-5 text-emerald-400" />}
          confidence={cleaningReport.dataQualityScore}
          infoTooltip="Natural language sentiment classification of customer reviews and feedback."
        />
      </div>

      {/* Prominent Market Potential Verdict Card */}
      <VerdictCard
        scoreData={successScore}
        productName={productName}
        isSyntheticDemo={isSyntheticDemo}
      />

      {/* Strategic Deep-Dive Grid: Multi-Signal Radar & Actionable Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar & Sub-Score Decomposition */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Multi-Signal Intelligence Hexagon</h3>
              <p className="text-xs text-slate-400">Algorithmic weight decomposition across 6 key pillars</p>
            </div>
            <button
              onClick={() => setActiveTab('correlations')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-300 flex items-center space-x-1 cursor-pointer"
            >
              <span>View Stats</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 12, fill: '#cbd5e1' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#818cf8"
                  fill="#818cf8"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
            <div className="p-2 rounded-xl bg-slate-900/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Sentiment</span>
              <span className="text-sm font-bold text-emerald-400">{successScore.breakdown.customerSentiment}/100</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Demand</span>
              <span className="text-sm font-bold text-sky-400">{successScore.breakdown.demand}/100</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pricing</span>
              <span className="text-sm font-bold text-indigo-400">{successScore.breakdown.pricing}/100</span>
            </div>
          </div>
        </div>

        {/* Actionable Strategic Roadmap */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">AI Actionable Strategy Roadmap</h3>
              <p className="text-xs text-slate-400">Prescriptive interventions based on data signals</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
              AI Prescriptive
            </span>
          </div>

          <div className="space-y-3">
            {/* Step 1: Immediate */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Immediate (0–30 Days)</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400">High Impact</span>
              </div>
              <p className="text-sm font-medium text-white">
                {reviewIntel
                  ? `Address ${reviewIntel.dislikedFeatures[0]?.name || 'hardware quality'} grievances in supply chain QC.`
                  : 'Optimize production schedules to meet surging contract demand index.'}
              </p>
              <p className="text-xs text-slate-400">
                Expected Impact: Prevents negative customer word-of-mouth and protects 4.2+ rating trajectory.
              </p>
            </div>

            {/* Step 2: Medium Term */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Medium Term (1–3 Months)</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Conversion Wedge</span>
              </div>
              <p className="text-sm font-medium text-white">
                Leverage the {Math.abs(marketValue.pricePositionPct)}% pricing wedge against category incumbents in promotional ad copy.
              </p>
              <p className="text-xs text-slate-400">
                Expected Impact: Accelerates market share capture among price-sensitive conversion cohorts.
              </p>
            </div>

            {/* Step 3: Long Term */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Long Term (3–6 Months)</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Moat Expansion</span>
              </div>
              <p className="text-sm font-medium text-white">
                Expand product tiering or next-generation model incorporating verified top liked features.
              </p>
              <p className="text-xs text-slate-400">
                Expected Impact: Builds sustained customer brand loyalty and increases repeat lifetime value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
