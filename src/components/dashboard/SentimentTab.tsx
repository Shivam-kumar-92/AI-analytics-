import React from 'react';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  MessageSquare,
  Smile,
  Frown,
  Meh,
  Tag,
  Quote,
} from 'lucide-react';
import { ReviewIntelligence } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

interface SentimentTabProps {
  reviewIntel?: ReviewIntelligence;
  productName: string;
}

export const SentimentTab: React.FC<SentimentTabProps> = ({
  reviewIntel,
  productName,
}) => {
  if (!reviewIntel) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center space-y-4 my-6">
        <MessageSquare className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-xl font-bold text-white">No Review Text Attached to Current Dataset</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          The current dataset does not contain textual customer reviews or star ratings. Switch to the <strong>Smart Wireless Earbuds X1 Demo</strong> or upload an Amazon/Flipkart review export to view complete sentiment intelligence.
        </p>
      </div>
    );
  }

  const { metrics, likedFeatures, dislikedFeatures, aiExecutiveSummary, frequentKeywords } = reviewIntel;

  const ratingBarData = [
    { star: '5 Stars', count: metrics.ratingDistribution.star5, pct: metrics.starPercentages.star5, color: '#10b981' },
    { star: '4 Stars', count: metrics.ratingDistribution.star4, pct: metrics.starPercentages.star4, color: '#34d399' },
    { star: '3 Stars', count: metrics.ratingDistribution.star3, pct: metrics.starPercentages.star3, color: '#f59e0b' },
    { star: '2 Stars', count: metrics.ratingDistribution.star2, pct: metrics.starPercentages.star2, color: '#fb923c' },
    { star: '1 Star', count: metrics.ratingDistribution.star1, pct: metrics.starPercentages.star1, color: '#f43f5e' },
  ];

  const sentimentPieData = [
    { name: 'Positive', value: metrics.positivePct, color: '#10b981' },
    { name: 'Neutral', value: metrics.neutralPct, color: '#64748b' },
    { name: 'Negative', value: metrics.negativePct, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner: Overall Customer Sentiment */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Product Review Intelligence (Amazon / Flipkart NLP Engine)</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Overall Customer Sentiment: <span className="text-emerald-400">{metrics.positivePct}% Positive</span>
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl font-medium">
            "{aiExecutiveSummary}"
          </p>
        </div>

        {/* Rating Summary Box */}
        <div className="flex items-center space-x-4 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl shrink-0">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-amber-400 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(metrics.averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-3xl font-black text-white">{metrics.averageRating}</span>
            <span className="text-xs text-slate-400 block mt-0.5">out of 5 stars</span>
          </div>
          <div className="h-12 w-[1px] bg-slate-800" />
          <div className="text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Verified Reviews
            </span>
            <span className="text-xl font-bold text-slate-200">
              {metrics.totalReviews.toLocaleString()}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium block">
              {metrics.positivePct}% Favorable
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Rating Distribution & Sentiment Polarity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rating Distribution Bar Breakdown */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Star Rating Distribution</h3>
              <p className="text-xs text-slate-400">Granular 1-star to 5-star review frequencies</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Total: {metrics.totalReviews.toLocaleString()}</span>
          </div>

          <div className="space-y-3 pt-2">
            {ratingBarData.map((item) => (
              <div key={item.star} className="flex items-center space-x-3 text-xs">
                <span className="w-16 font-semibold text-slate-300 shrink-0">{item.star}</span>
                <div className="flex-1 h-3 rounded-full bg-slate-800 overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                  />
                </div>
                <span className="w-12 text-right font-mono font-bold text-slate-200">{item.pct}%</span>
                <span className="w-16 text-right font-mono text-slate-500">
                  ({item.count.toLocaleString()})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Polarity Donut Chart */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Sentiment Polarity Split</h3>
            <p className="text-xs text-slate-400">NLP classified polarity percentage</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {sentimentPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-900">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block flex items-center justify-center space-x-1">
                <Smile className="w-3 h-3" />
                <span>Pos</span>
              </span>
              <span className="font-bold text-white text-sm">{metrics.positivePct}%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900">
              <span className="text-[10px] text-slate-400 font-bold uppercase block flex items-center justify-center space-x-1">
                <Meh className="w-3 h-3" />
                <span>Neu</span>
              </span>
              <span className="font-bold text-white text-sm">{metrics.neutralPct}%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900">
              <span className="text-[10px] text-rose-400 font-bold uppercase block flex items-center justify-center space-x-1">
                <Frown className="w-3 h-3" />
                <span>Neg</span>
              </span>
              <span className="font-bold text-white text-sm">{metrics.negativePct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Most Liked Features vs Most Disliked Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Liked */}
        <div className="glass-card rounded-3xl p-6 space-y-4 border-emerald-500/20">
          <div className="flex items-center space-x-2 text-emerald-400">
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Most Liked Features & Strengths</h3>
              <p className="text-xs text-slate-400">Aspects generating the highest customer advocacy</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {likedFeatures.map((feat) => (
              <div key={feat.name} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{feat.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                    {feat.sentimentScore}% Approval
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center space-x-3">
                  <span>Mentions: <strong className="text-slate-200 font-mono">{feat.positiveMentions.toLocaleString()}</strong></span>
                </div>
                {feat.sampleQuotes[0] && (
                  <div className="text-xs text-slate-300 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-start space-x-2">
                    <Quote className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>"{feat.sampleQuotes[0]}"</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Most Disliked / Complaints */}
        <div className="glass-card rounded-3xl p-6 space-y-4 border-rose-500/20">
          <div className="flex items-center space-x-2 text-rose-400">
            <div className="p-2 rounded-xl bg-rose-500/10">
              <ThumbsDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Most Disliked Features & Complaints</h3>
              <p className="text-xs text-slate-400">Recurring friction points & negative reviews</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {dislikedFeatures.map((feat) => (
              <div key={feat.name} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{feat.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono">
                    {100 - feat.sentimentScore}% Disapproval
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center space-x-3">
                  <span>Negative Citations: <strong className="text-rose-300 font-mono">{feat.negativeMentions.toLocaleString()}</strong></span>
                </div>
                {feat.sampleQuotes[0] && (
                  <div className="text-xs text-slate-300 italic bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex items-start space-x-2">
                    <Quote className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>"{feat.sampleQuotes[0]}"</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frequent Keywords Cloud / Tags */}
      {frequentKeywords && frequentKeywords.length > 0 && (
        <div className="glass-card rounded-3xl p-6 space-y-3">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-indigo-400" />
            <span>High Frequency NLP Keyword Clusters & Sentiment Polarities</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {frequentKeywords.map((kw) => (
              <span
                key={kw.word}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${
                  kw.sentiment === 'pos'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                    : kw.sentiment === 'neg'
                    ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <span className="font-bold">{kw.word}</span>
                <span className="text-[10px] opacity-70 font-mono">({kw.count.toLocaleString()})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
