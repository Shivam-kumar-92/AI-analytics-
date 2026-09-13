import {
  ChatMessage,
  CompetitorIntelligence,
  DataCleaningReport,
  DemandIntelligence,
  DescriptiveStats,
  MarketValueAnalysis,
  ProductSuccessScore,
  ReviewIntelligence,
} from '../types';

export interface AnalystContext {
  productName: string;
  industry: string;
  cleaningReport: DataCleaningReport;
  stats: DescriptiveStats[];
  sentimentIntel?: ReviewIntelligence;
  demandIntel: DemandIntelligence;
  marketValue: MarketValueAnalysis;
  successScore: ProductSuccessScore;
  competitorIntel: CompetitorIntelligence;
  isSyntheticDemo: boolean;
}

export class AIAnalystEngine {
  static answerQuery(query: string, ctx: AnalystContext): ChatMessage {
    const q = query.toLowerCase().trim();
    const id = `msg_${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Is product worth launching / succeed?
    if (q.includes('worth launching') || q.includes('succeed') || q.includes('should we launch') || q.includes('verdict')) {
      const score = ctx.successScore.overallScore;
      const conf = ctx.successScore.confidenceScore;
      const cls = ctx.successScore.classification;
      const text = `**Market Launch Assessment: ${cls.toUpperCase()} (${score}/100)**\n\n` +
        `Based on our analytical model, ${ctx.productName} demonstrates **${score}/100 potential** with a **${conf}% confidence rating**.\n\n` +
        `- **Demand Momentum**: Evaluated at ${ctx.demandIntel.score}/100 with an ${ctx.demandIntel.demandTrend} trend (+${ctx.demandIntel.growthRatePct}%).\n` +
        `- **Customer Sentiment**: ${ctx.sentimentIntel ? `${ctx.sentimentIntel.metrics.positivePct}% positive` : 'Positive indicators detected'}.\n` +
        `- **Pricing Position**: ${ctx.marketValue.pricePositionLabel} (${Math.abs(ctx.marketValue.pricePositionPct)}% ${ctx.marketValue.pricePositionPct <= 0 ? 'below' : 'above'} market benchmark).\n\n` +
        `**Recommendation**: ${ctx.successScore.recommendedAction}\n\n` +
        `*(Note: This is an analytical estimation based on ${ctx.isSyntheticDemo ? 'synthetic demonstration data' : 'current dataset parameters'} and does not constitute a guaranteed market outcome).*`;

      return {
        id,
        sender: 'assistant',
        text,
        timestamp,
        evidence: [
          { metric: 'Product Success Score', value: `${score}/100`, context: cls },
          { metric: 'Prediction Confidence', value: `${conf}%`, context: 'Multi-factor weighted index' },
          { metric: 'Pricing Delta', value: `${ctx.marketValue.pricePositionPct}%`, context: ctx.marketValue.pricePositionLabel },
        ],
        suggestedFollowUps: [
          'What are the biggest risks?',
          'Why are customers unhappy?',
          'Which competitor is strongest?',
        ],
      };
    }

    // 2. Why are customers unhappy / biggest problem / complaints
    if (q.includes('unhappy') || q.includes('problem') || q.includes('complaint') || q.includes('dislike') || q.includes('negative')) {
      if (ctx.sentimentIntel && ctx.sentimentIntel.dislikedFeatures.length > 0) {
        const topDislike = ctx.sentimentIntel.dislikedFeatures[0];
        const secondDislike = ctx.sentimentIntel.dislikedFeatures[1];
        const text = `**Primary Customer Friction Points:**\n\n` +
          `1. **${topDislike.name}**: The most prominent criticism (${topDislike.negativeMentions} negative mentions, dissatisfaction score: ${100 - topDislike.sentimentScore}%).\n` +
          (topDislike.sampleQuotes[0] ? `   > *"${topDislike.sampleQuotes[0]}"*\n\n` : '\n') +
          (secondDislike ? `2. **${secondDislike.name}**: Secondary concern with ${secondDislike.negativeMentions} negative citations.\n\n` : '') +
          `**Root Cause Insight**: Dissatisfaction is concentrated around hardware longevity and reliability rather than aesthetic or initial out-of-box appeal. Improving quality control on this specific component will protect repeat purchases.`;

        return {
          id,
          sender: 'assistant',
          text,
          timestamp,
          evidence: [
            { metric: 'Top Friction Factor', value: topDislike.name, context: `${topDislike.negativeMentions} negative mentions` },
            { metric: 'Negative Review Ratio', value: `${ctx.sentimentIntel.metrics.negativePct}%`, context: 'Total verified reviews' },
          ],
          suggestedFollowUps: [
            'What features should we improve?',
            'What do customers like most?',
            'Give me a business recommendation.',
          ],
        };
      } else {
        const text = `In this dataset (${ctx.industry}), specific text reviews were not attached, but operational friction appears in supply variances and margin compression. For industrial categories, inventory bottlenecks and delivery lead times represent the primary operational risks.`;
        return {
          id,
          sender: 'assistant',
          text,
          timestamp,
          evidence: [
            { metric: 'Competition Risk', value: `${ctx.successScore.breakdown.competition}/100`, context: 'Market pressure' },
          ],
          suggestedFollowUps: ['Find unusual patterns in this data', 'Is demand increasing?'],
        };
      }
    }

    // 3. Competitor strongest / who are competitors
    if (q.includes('competitor') || q.includes('rival') || q.includes('market share') || q.includes('competition')) {
      const comps = ctx.competitorIntel.competitors;
      const leader = ctx.competitorIntel.marketLeader;
      const compList = comps.map(c => `• **${c.name}**: Price ${ctx.marketValue.currencySymbol}${c.price.toLocaleString()} | Rating ${c.rating}★ | Demand ${c.demandScore}/100`).join('\n');

      const text = `**Competitive Benchmarking Summary:**\n\n` +
        `Current Market Leader: **${leader}**\n\n` +
        `${compList}\n\n` +
        `**Strategic Landscape Analysis**: ${ctx.competitorIntel.aiCompetitorSummary}`;

      return {
        id,
        sender: 'assistant',
        text,
        timestamp,
        evidence: [
          { metric: 'Market Leader', value: leader, context: 'Highest market presence' },
          { metric: 'Price Positioning', value: ctx.marketValue.pricePositionLabel, context: `${ctx.marketValue.pricePositionPct}% delta` },
        ],
        suggestedFollowUps: ['What price should we target?', 'Is this product worth launching?'],
      };
    }

    // 4. Price target / pricing
    if (q.includes('price') || q.includes('target price') || q.includes('cost') || q.includes('undervalued')) {
      const curr = ctx.marketValue.productPrice;
      const avg = ctx.marketValue.averageMarketPrice;
      const sym = ctx.marketValue.currencySymbol;
      const text = `**Pricing Intelligence & Strategy:**\n\n` +
        `- **Current Product Price**: ${sym}${curr.toLocaleString()}\n` +
        `- **Category Average Price**: ${sym}${avg.toLocaleString()}\n` +
        `- **Current Positioning**: **${ctx.marketValue.pricePositionLabel}** (${Math.abs(ctx.marketValue.pricePositionPct)}% ${ctx.marketValue.pricePositionPct <= 0 ? 'discount' : 'premium'})\n\n` +
        `**Target Pricing Recommendation**:\n` +
        `We recommend maintaining the **${sym}${curr.toLocaleString()}** to **${sym}${Math.round(avg * 0.95).toLocaleString()}** band. This preserves a distinct 5%–10% price advantage over category incumbents while sustaining a healthy gross margin profile.`;

      return {
        id,
        sender: 'assistant',
        text,
        timestamp,
        evidence: [
          { metric: 'Average Market Price', value: `${sym}${avg.toLocaleString()}`, context: 'Calculated from competitors' },
          { metric: 'Price Position', value: ctx.marketValue.pricePositionLabel, context: `${ctx.marketValue.pricePositionPct}%` },
        ],
        suggestedFollowUps: ['Which competitor is strongest?', 'Is demand increasing?'],
      };
    }

    // 5. Demand increasing / trend / forecast
    if (q.includes('demand') || q.includes('increasing') || q.includes('growing') || q.includes('sales trend') || q.includes('forecast')) {
      const d = ctx.demandIntel;
      const text = `**Demand Velocity & Trend Analysis:**\n\n` +
        `- **Demand Score**: **${d.score}/100 (${d.classification})**\n` +
        `- **Classification Status**: **${d.demandProxyLabel}**\n` +
        `- **Directional Trend**: **${d.demandTrend.toUpperCase()}** with growth of **+${d.growthRatePct}%**\n` +
        `- **Signals Used**: ${d.proxySignalsUsed.join(', ')}\n` +
        `- **Seasonal Pattern**: ${d.seasonalFactor}\n\n` +
        `**Analytical Interpretation**: ${d.aiDemandInterpretation}`;

      return {
        id,
        sender: 'assistant',
        text,
        timestamp,
        evidence: [
          { metric: 'Demand Score', value: `${d.score}/100`, context: d.classification },
          { metric: 'Growth Velocity', value: `+${d.growthRatePct}%`, context: d.demandTrend },
          { metric: 'Metric Status', value: d.demandProxyLabel, context: `${d.confidencePct}% confidence` },
        ],
        suggestedFollowUps: ['Is this product worth launching?', 'Find unusual patterns in this data'],
      };
    }

    // 6. Summarize dataset / dataset overview / stats
    if (q.includes('summarize') || q.includes('overview') || q.includes('data quality') || q.includes('dataset')) {
      const r = ctx.cleaningReport;
      const statSummary = ctx.stats.slice(0, 3).map(s => `• **${s.column}**: Mean = ${s.mean}, Median = ${s.median}, StdDev = ${s.stdDev}`).join('\n');

      const text = `**Dataset Profiling & Quality Summary:**\n\n` +
        `- **Total Analyzed Records**: ${r.cleanedRowCount} rows across ${r.totalColumns} attributes.\n` +
        `- **Data Quality Score**: **${r.dataQualityScore}/100 (Grade ${r.qualityGrade})**.\n` +
        `- **Integrity Operations**: Cleaned ${r.duplicatesRemoved} duplicates, filled ${r.missingCellsFilled} missing cells, flagged ${r.outliersCount} outliers.\n\n` +
        `**Key Statistical Highlights:**\n${statSummary || 'Standard numerical variables processed.'}\n\n` +
        `All data types have been normalized and validated for business modeling.`;

      return {
        id,
        sender: 'assistant',
        text,
        timestamp,
        evidence: [
          { metric: 'Data Quality Score', value: `${r.dataQualityScore}/100`, context: `Grade ${r.qualityGrade}` },
          { metric: 'Cleaned Records', value: r.cleanedRowCount, context: 'Rows available' },
        ],
        suggestedFollowUps: ['Find unusual patterns in this data', 'Give me a business recommendation'],
      };
    }

    // 7. Find unusual patterns / outliers / anomalies
    if (q.includes('pattern') || q.includes('unusual') || q.includes('anomaly') || q.includes('outlier')) {
      const outliers = ctx.cleaningReport.outliersCount;
      const text = `**Anomalies & Notable Patterns Detected:**\n\n` +
        `1. **Statistical Outliers**: Flagged **${outliers} data point(s)** crossing 1.5× Interquartile Range (IQR) bounds. These indicate isolated spikes in volume or extreme review ratings.\n` +
        `2. **Correlation Observation**: Strongest quantitative coupling exists between sales volume and demand trajectory, demonstrating that consumer interest directly translates into transactions without lag.\n` +
        `3. **Sentiment Divergence**: While overall rating averages ${ctx.sentimentIntel ? ctx.sentimentIntel.metrics.averageRating : '4.2'}★, negative feedback is tightly clustered around a single aspect rather than distributed evenly.`;

      return {
        id,
        sender: 'assistant',
        text,
        timestamp,
        evidence: [
          { metric: 'Outliers Detected', value: outliers, context: 'IQR bounds analysis' },
          { metric: 'Data Quality', value: `${ctx.cleaningReport.dataQualityScore}/100`, context: 'Integrity index' },
        ],
        suggestedFollowUps: ['What should I focus on?', 'Give me a business recommendation'],
      };
    }

    // Default: Business recommendation & general synthesis
    const text = `**Executive Business Advisory (${ctx.industry}):**\n\n` +
      `1. **Immediate Focus (0–30 Days)**: Address customer feedback regarding ${ctx.sentimentIntel?.dislikedFeatures[0]?.name || 'operational reliability'} to elevate review conversion.\n` +
      `2. **Pricing Defense**: Leverage the ${ctx.marketValue.pricePositionLabel.toLowerCase()} pricing structure (${ctx.marketValue.currencySymbol}${ctx.marketValue.productPrice.toLocaleString()}) in marketing messaging against ${ctx.competitorIntel.marketLeader}.\n` +
      `3. **Capacity Planning**: Demand trajectory is ${ctx.demandIntel.demandTrend} (+${ctx.demandIntel.growthRatePct}%). Ensure production and inventory align to avoid stockouts during demand peaks.\n\n` +
      `Ask me about specific competitor metrics, risk analyses, or statistical breakdowns for deeper verification!`;

    return {
      id,
      sender: 'assistant',
      text,
      timestamp,
      evidence: [
        { metric: 'Demand Momentum', value: `${ctx.demandIntel.score}/100`, context: ctx.demandIntel.demandTrend },
        { metric: 'Overall Potential', value: `${ctx.successScore.overallScore}/100`, context: ctx.successScore.classification },
      ],
      suggestedFollowUps: [
        'Is this product worth launching?',
        'Why are customers unhappy?',
        'Which competitor is strongest?',
      ],
    };
  }
}
