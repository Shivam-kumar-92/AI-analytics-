import { ProductSuccessScore } from '../types';

export interface SuccessInputSignals {
  customerSentiment?: number; // 0-100
  demand?: number; // 0-100
  competitionRisk?: number; // 0-100 (higher = worse competition)
  pricingCompetitiveness?: number; // 0-100
  marketGrowth?: number; // 0-100
  productQuality?: number; // 0-100
  datasetSize: number;
  hasSalesSignals: boolean;
  hasReviewSignals: boolean;
  mainRiskFactor?: string;
}

export class SuccessModel {
  static evaluateProductSuccess(input: SuccessInputSignals): ProductSuccessScore {
    const {
      customerSentiment = 80,
      demand = 78,
      competitionRisk = 65,
      pricingCompetitiveness = 85,
      marketGrowth = 75,
      productQuality = 82,
      datasetSize,
      hasSalesSignals,
      hasReviewSignals,
      mainRiskFactor = 'Competitive saturation and component longevity',
    } = input;

    // Check if data is too sparse
    if (datasetSize < 3 && !hasSalesSignals && !hasReviewSignals) {
      return {
        overallScore: 0,
        classification: 'Insufficient Data',
        confidenceScore: 20,
        breakdown: {
          customerSentiment: 0,
          demand: 0,
          competition: 0,
          pricing: 0,
          marketGrowth: 0,
          productQuality: 0,
        },
        aiVerdict: 'Insufficient data points were provided to formulate a reliable market success prediction. Please upload a dataset containing at least sales records, pricing logs, or customer review samples.',
        keyDrivers: ['Awaiting statistical inputs'],
        keyRisks: ['Data sparsity barrier'],
        recommendedAction: 'Ingest expanded data records to enable predictive modeling.',
        uncertaintyDisclaimer: 'Predictions require minimum verifiable observations to establish statistical significance.',
      };
    }

    // Weighted formula:
    // Sentiment: 25%, Demand: 25%, Pricing: 15%, Market Growth: 15%, Quality: 10%, Competition Inverse: 10%
    const compScore = Math.max(10, 100 - competitionRisk * 0.5); // lower competition risk = higher contribution

    const overallScore = Math.round(
      customerSentiment * 0.25 +
        demand * 0.25 +
        pricingCompetitiveness * 0.15 +
        marketGrowth * 0.15 +
        productQuality * 0.1 +
        compScore * 0.1
    );

    // Confidence Calculation
    let confidenceScore = 75;
    if (hasSalesSignals && hasReviewSignals) confidenceScore += 12;
    else if (!hasSalesSignals) confidenceScore -= 8;
    if (datasetSize > 100) confidenceScore += 7;
    else if (datasetSize < 10) confidenceScore -= 12;
    confidenceScore = Math.min(94, Math.max(45, confidenceScore));

    // Classification
    let classification: ProductSuccessScore['classification'] = 'High Potential';
    if (overallScore >= 78) classification = 'High Potential';
    else if (overallScore >= 58) classification = 'Moderate Potential';
    else classification = 'Low Potential';

    // Formulate AI Verdict
    let aiVerdict = '';
    if (classification === 'High Potential') {
      aiVerdict = `Based on the available data, this product shows strong market potential (${overallScore}/100). Customer sentiment is positive and pricing remains competitive. However, market competition is active and ${mainRiskFactor.toLowerCase()} may affect long-term customer retention.`;
    } else if (classification === 'Moderate Potential') {
      aiVerdict = `The asset exhibits moderate commercial viability (${overallScore}/100). While core demand interest is detectable, margin pressure from competing alternatives and customer feedback friction require operational adjustments before aggressive scaling.`;
    } else {
      aiVerdict = `Data indicators point to cautious or low commercial upside (${overallScore}/100) in its current configuration. Critical hurdles in product quality, unfavorable pricing relative to category leaders, or negative sentiment trends dominate.`;
    }

    // Drivers
    const keyDrivers: string[] = [];
    if (demand >= 75) keyDrivers.push(`High consumer demand and search velocity (Score: ${demand}/100)`);
    if (customerSentiment >= 75) keyDrivers.push(`Favorable customer satisfaction and positive review ratio (${customerSentiment}/100)`);
    if (pricingCompetitiveness >= 75) keyDrivers.push(`Strong price positioning relative to category benchmarks (${pricingCompetitiveness}/100)`);
    if (marketGrowth >= 70) keyDrivers.push(`Expanding overall sector macro momentum (${marketGrowth}/100)`);

    // Risks
    const keyRisks: string[] = [
      `Aggressive competitive encroachment (Risk Index: ${competitionRisk}/100)`,
      `${mainRiskFactor}`,
      `Price elasticity sensitivity under inflationary shifts`,
    ];

    const recommendedAction =
      overallScore >= 75
        ? 'Proceed with phased market rollout while establishing customer feedback loops to address highlighted complaints.'
        : 'Conduct pilot optimization and refine product/pricing balance before broader capital allocation.';

    return {
      overallScore,
      classification,
      confidenceScore,
      breakdown: {
        customerSentiment,
        demand,
        competition: competitionRisk,
        pricing: pricingCompetitiveness,
        marketGrowth,
        productQuality,
      },
      aiVerdict,
      keyDrivers,
      keyRisks,
      recommendedAction,
      uncertaintyDisclaimer:
        'This verdict represents an algorithmic evaluation based strictly on user-supplied and proxy data points. It does not constitute an absolute guarantee of commercial outcome.',
    };
  }
}
