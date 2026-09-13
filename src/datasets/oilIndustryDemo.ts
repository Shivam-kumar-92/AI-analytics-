import { CompetitorIntelligence, DataCleaningReport, DemandIntelligence, MarketValueAnalysis, ProductSuccessScore } from '../types';

export const OIL_DEMO_RAW_DATA = [
  { Month: 'Jan', Product: 'IOCL Domestic Crude Basket', Price: 6480, Demand: 82, Sales: 12000, Production: 11500, 'Competitor Price': 6650 },
  { Month: 'Feb', Product: 'IOCL Domestic Crude Basket', Price: 6720, Demand: 85, Sales: 12400, Production: 11800, 'Competitor Price': 6810 },
  { Month: 'Mar', Product: 'IOCL Domestic Crude Basket', Price: 6560, Demand: 88, Sales: 13100, Production: 12100, 'Competitor Price': 6720 },
  { Month: 'Apr', Product: 'IOCL Domestic Crude Basket', Price: 6890, Demand: 91, Sales: 13800, Production: 12700, 'Competitor Price': 6970 },
  { Month: 'May', Product: 'IOCL Domestic Crude Basket', Price: 7140, Demand: 94, Sales: 14500, Production: 13200, 'Competitor Price': 7220 },
  { Month: 'Jun', Product: 'IOCL Domestic Crude Basket', Price: 6970, Demand: 92, Sales: 14200, Production: 13000, 'Competitor Price': 7050 },
];

export const OIL_DEMO_CLEANING_REPORT: DataCleaningReport = {
  originalRowCount: 6,
  cleanedRowCount: 6,
  totalColumns: 7,
  missingCellsFilled: 0,
  duplicatesRemoved: 0,
  outliersCount: 0,
  dataQualityScore: 98,
  qualityGrade: 'A+',
  penalties: [],
  columnProfiles: [
    { name: 'Month', detectedType: 'date', missingCount: 0, missingPct: 0, uniqueCount: 6, sampleValues: ['Jan', 'Feb', 'Mar'], outliersCount: 0 },
    { name: 'Product', detectedType: 'category', missingCount: 0, missingPct: 0, uniqueCount: 1, sampleValues: ['IOCL Domestic Crude Basket'], outliersCount: 0 },
    { name: 'Price', detectedType: 'currency', missingCount: 0, missingPct: 0, uniqueCount: 6, sampleValues: [6480, 6720, 6560], min: 6480, max: 7140, mean: 6793, outliersCount: 0 },
    { name: 'Demand', detectedType: 'numeric', missingCount: 0, missingPct: 0, uniqueCount: 6, sampleValues: [82, 85, 88], min: 82, max: 94, mean: 88.67, outliersCount: 0 },
    { name: 'Sales', detectedType: 'numeric', missingCount: 0, missingPct: 0, uniqueCount: 6, sampleValues: [12000, 12400, 13100], min: 12000, max: 14500, mean: 13333, outliersCount: 0 },
    { name: 'Production', detectedType: 'numeric', missingCount: 0, missingPct: 0, uniqueCount: 6, sampleValues: [11500, 11800, 12100], min: 11500, max: 13200, mean: 12383, outliersCount: 0 },
    { name: 'Competitor Price', detectedType: 'currency', missingCount: 0, missingPct: 0, uniqueCount: 6, sampleValues: [6650, 6810, 6720], min: 6650, max: 7220, mean: 6903, outliersCount: 0 },
  ],
};

export const OIL_DEMO_DEMAND: DemandIntelligence = {
  score: 91,
  classification: 'HIGH DEMAND',
  isProxy: false,
  demandProxyLabel: 'Verified Market Demand',
  proxySignalsUsed: [
    'Petroleum Planning & Analysis Cell (PPAC) Fuel Consumption Reports',
    'Panipat, Mathura & Koyali Refinery Output Throughput',
    'Indian National Highway Diesel Freight Movement Index',
  ],
  confidencePct: 91,
  currentDemand: 92,
  demandTrend: 'increasing',
  growthRatePct: 12.2,
  seasonalFactor: 'Harvesting & Festive Highway Freight Peak (+10% domestic fuel demand lift)',
  historicalPoints: [
    { period: 'Jan', demand: 82, sales: 12000, production: 11500, price: 6480, competitorPrice: 6650 },
    { period: 'Feb', demand: 85, sales: 12400, production: 11800, price: 6720, competitorPrice: 6810 },
    { period: 'Mar', demand: 88, sales: 13100, production: 12100, price: 6560, competitorPrice: 6720 },
    { period: 'Apr', demand: 91, sales: 13800, production: 12700, price: 6890, competitorPrice: 6970 },
    { period: 'May', demand: 94, sales: 14500, production: 13200, price: 7140, competitorPrice: 7220 },
    { period: 'Jun', demand: 92, sales: 14200, production: 13000, price: 6970, competitorPrice: 7050 },
  ],
  projectedPoints: [
    { period: 'Jul (Est)', demand: 95, sales: 14700, production: 13400, price: 7050, competitorPrice: 7140, projected: true },
    { period: 'Aug (Est)', demand: 96, sales: 15000, production: 13600, price: 7220, competitorPrice: 7310, projected: true },
    { period: 'Sep (Est)', demand: 93, sales: 14600, production: 13500, price: 6970, competitorPrice: 7140, projected: true },
  ],
  aiDemandInterpretation:
    'Based on the Indian Oil Corporation (IOCL) synthetic dataset, domestic energy demand increases consistently over the six-month period from 82 to 94 while refinery sales rise in tandem from 12,000 to 14,500 TMT. The relationship between demand and sales highlights robust industrial transport activity across India.',
};

export const OIL_DEMO_MARKET_VALUE: MarketValueAnalysis = {
  productPrice: 6970,
  averageMarketPrice: 7050,
  minPrice: 6480,
  maxPrice: 7220,
  pricePositionPct: -1.1,
  pricePositionLabel: 'Competitive',
  currencySymbol: '₹',
  elasticityAssessment:
    'IOCL crude refining cost is positioned ₹80/bbl (1.1%) below private commercial refinery benchmarks (₹6,970 vs ₹7,050/bbl), shielding state transport undertakings while preserving downstream retail fuel margins.',
  historicalPrices: [
    { period: 'Jan', price: 6480, competitorAvg: 6650 },
    { period: 'Feb', price: 6720, competitorAvg: 6810 },
    { period: 'Mar', price: 6560, competitorAvg: 6720 },
    { period: 'Apr', price: 6890, competitorAvg: 6970 },
    { period: 'May', price: 7140, competitorAvg: 7220 },
    { period: 'Jun', price: 6970, competitorAvg: 7050 },
  ],
};

export const OIL_DEMO_COMPETITORS: CompetitorIntelligence = {
  marketLeader: 'Indian Oil Corporation (IOCL - Our Asset)',
  aiCompetitorSummary:
    'Indian Oil Corporation (IOCL) controls nearly 48% of India’s petroleum retail outlet network and downstream pipeline infrastructure, offering a slight cost edge over BPCL and HPCL, and insulating consumers from extreme international Brent spikes.',
  opportunityNiche: 'XP95 high-octane premium petrol and green hydrogen mobility fueling stations.',
  competitors: [
    {
      name: 'Indian Oil Corporation (IOCL - Our Asset)',
      price: 6970,
      rating: 4.6,
      reviewsCount: 14200,
      demandScore: 91,
      sentimentScore: 88,
      marketPosition: 'National Maharatna PSU Leader (48% Market Share)',
      strengths: '34,000+ fuel stations across India, nationwide pipeline network, Indane LPG reach',
      weaknesses: 'Subject to administrative price stabilization buffers during elections',
      isMainProduct: true,
    },
    {
      name: 'Bharat Petroleum (BPCL)',
      price: 7050,
      rating: 4.5,
      reviewsCount: 11500,
      demandScore: 86,
      sentimentScore: 84,
      marketPosition: 'Key Maharatna Challenger',
      strengths: 'High Kochi and Mumbai refinery complexity indices',
      weaknesses: 'Smaller retail footprint in Northern & Eastern rural belts',
    },
    {
      name: 'Hindustan Petroleum (HPCL)',
      price: 7020,
      rating: 4.4,
      reviewsCount: 9800,
      demandScore: 84,
      sentimentScore: 82,
      marketPosition: 'Major PSU Peer',
      strengths: 'HP Pay digital integration and highway Club HP loyalty network',
      weaknesses: 'Visakh refinery capacity maintenance cycles',
    },
    {
      name: 'Reliance Industries (Jamnagar)',
      price: 7220,
      rating: 4.7,
      reviewsCount: 8100,
      demandScore: 89,
      sentimentScore: 89,
      marketPosition: 'Private Export Super-Refiner',
      strengths: 'World largest single-site refinery complexity (Jamnagar)',
      weaknesses: 'Higher focus on export markets rather than domestic rural retail outlets',
    },
  ],
};

export const OIL_DEMO_SUCCESS_SCORE: ProductSuccessScore = {
  overallScore: 89,
  classification: 'High Potential',
  confidenceScore: 91,
  breakdown: {
    customerSentiment: 86,
    demand: 91,
    competition: 74,
    pricing: 92,
    marketGrowth: 90,
    productQuality: 92,
  },
  aiVerdict:
    'Based on the Indian Oil Corporation (IOCL) demonstration dataset, this vital national energy asset demonstrates high commercial strength. Domestic demand exhibits consistent expansion (82 → 94) alongside production growth from Panipat and Mathura refineries. Refining output has steadily minimized the domestic supply gap for diesel, petrol, and aviation turbine fuel.',
  keyDrivers: [
    'Domestic fuel demand shows consistent upward momentum across India (82 → 94)',
    'Sales volumes climb alongside demand, reflecting rapid industrial and logistics off-take',
    'Prices remain competitive at ₹6,970/barrel compared to private and imported alternatives',
    'Refinery throughput increases to 13,200 TMT, ensuring energy security across Indian states',
  ],
  keyRisks: [
    'International geopolitical crude shipping disruptions via Red Sea and Hormuz straits',
    'Foreign exchange sensitivity due to USD/INR currency exchange movements',
    'Gradual commercial EV adoption reducing long-term city petrol demand',
  ],
  recommendedAction:
    'Accelerate petrochemical conversion and expand XP95 premium fuel dispensing pumps across high-traffic Indian expressway corridors.',
  uncertaintyDisclaimer:
    'This report is generated strictly from synthetic demonstration data modeled on Indian petroleum consumption benchmarks. It does not constitute financial commodity trading advice.',
};
