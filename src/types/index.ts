export type Industry =
  | 'E-commerce'
  | 'Oil & Gas'
  | 'Automobile'
  | 'Electronics'
  | 'FMCG'
  | 'Healthcare'
  | 'Banking'
  | 'Retail'
  | 'Manufacturing'
  | 'Technology'
  | 'Other';

export type DetectedColumnType =
  | 'numeric'
  | 'currency'
  | 'percentage'
  | 'date'
  | 'review_text'
  | 'rating'
  | 'category'
  | 'id';

export interface ColumnProfile {
  name: string;
  detectedType: DetectedColumnType;
  missingCount: number;
  missingPct: number;
  uniqueCount: number;
  sampleValues: any[];
  min?: number;
  max?: number;
  mean?: number;
  outliersCount: number;
}

export interface DataCleaningReport {
  originalRowCount: number;
  cleanedRowCount: number;
  totalColumns: number;
  missingCellsFilled: number;
  duplicatesRemoved: number;
  outliersCount: number;
  dataQualityScore: number; // 0 - 100
  qualityGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
  penalties: string[];
  columnProfiles: ColumnProfile[];
}

export interface DescriptiveStats {
  column: string;
  count: number;
  mean: number;
  median: number;
  mode: number;
  min: number;
  max: number;
  stdDev: number;
  variance: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  iqr: number;
}

export interface CorrelationPair {
  col1: string;
  col2: string;
  correlation: number;
  strength: 'Strong Positive' | 'Moderate Positive' | 'Weak / None' | 'Moderate Negative' | 'Strong Negative';
}

export interface SentimentMetrics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    star1: number;
    star2: number;
    star3: number;
    star4: number;
    star5: number;
  };
  starPercentages: {
    star1: number;
    star2: number;
    star3: number;
    star4: number;
    star5: number;
  };
  positivePct: number;
  negativePct: number;
  neutralPct: number;
  mixedPct: number;
  overallSentimentLabel: string;
}

export interface AspectFeature {
  name: string;
  category: 'positive' | 'negative' | 'mixed';
  positiveMentions: number;
  negativeMentions: number;
  sentimentScore: number; // 0-100
  sampleQuotes: string[];
}

export interface ReviewIntelligence {
  metrics: SentimentMetrics;
  likedFeatures: AspectFeature[];
  dislikedFeatures: AspectFeature[];
  aiExecutiveSummary: string;
  frequentKeywords: { word: string; count: number; sentiment: 'pos' | 'neg' | 'neu' }[];
}

export interface TimeSeriesPoint {
  period: string;
  demand?: number;
  sales?: number;
  production?: number;
  reviews?: number;
  price?: number;
  competitorPrice?: number;
  projected?: boolean;
}

export interface DemandIntelligence {
  score: number; // 0-100
  classification: 'HIGH DEMAND' | 'MODERATE DEMAND' | 'LOW DEMAND' | 'EMERGING';
  isProxy: boolean;
  demandProxyLabel: 'Verified Market Demand' | 'Estimated Demand / Demand Proxy';
  proxySignalsUsed: string[];
  confidencePct: number;
  currentDemand: number;
  demandTrend: 'increasing' | 'stable' | 'declining';
  growthRatePct: number;
  seasonalFactor: string;
  historicalPoints: TimeSeriesPoint[];
  projectedPoints: TimeSeriesPoint[];
  aiDemandInterpretation: string;
}

export interface MarketValueAnalysis {
  productPrice: number;
  averageMarketPrice: number;
  minPrice: number;
  maxPrice: number;
  pricePositionPct: number; // e.g. -6.7%
  pricePositionLabel: 'Undervalued' | 'Competitive' | 'Fairly Priced' | 'Premium Priced' | 'Overpriced';
  currencySymbol: string;
  elasticityAssessment: string;
  historicalPrices?: { period: string; price: number; competitorAvg: number }[];
}

export interface CompetitorRecord {
  name: string;
  price: number;
  rating: number;
  reviewsCount: number;
  demandScore: number;
  sentimentScore: number;
  marketPosition: string;
  strengths: string;
  weaknesses: string;
  isMainProduct?: boolean;
}

export interface CompetitorIntelligence {
  competitors: CompetitorRecord[];
  aiCompetitorSummary: string;
  marketLeader: string;
  opportunityNiche: string;
}

export interface ProductSuccessScore {
  overallScore: number; // 0-100
  classification: 'High Potential' | 'Moderate Potential' | 'Low Potential' | 'Insufficient Data';
  confidenceScore: number; // 0-100
  breakdown: {
    customerSentiment: number;
    demand: number;
    competition: number;
    pricing: number;
    marketGrowth: number;
    productQuality: number;
  };
  aiVerdict: string;
  keyDrivers: string[];
  keyRisks: string[];
  recommendedAction: string;
  uncertaintyDisclaimer: string;
}

export interface ExecutiveReport {
  id: string;
  title: string;
  industry: Industry;
  createdAt: string;
  datasetName: string;
  isSyntheticDemo: boolean;
  executiveSummary: string;
  dataQualityScore: number;
  analysisConfidence: number;
  confidenceExplanation: string;
  successScore: ProductSuccessScore;
  demandIntel: DemandIntelligence;
  marketValue: MarketValueAnalysis;
  reviewIntel?: ReviewIntelligence;
  competitorIntel: CompetitorIntelligence;
  correlations: CorrelationPair[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  actionableRoadmap: {
    timeframe: 'Immediate (0-30 Days)' | 'Medium Term (1-3 Months)' | 'Long Term (3-6 Months)';
    action: string;
    expectedImpact: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  evidence?: {
    metric: string;
    value: string | number;
    context: string;
  }[];
  suggestedFollowUps?: string[];
}
