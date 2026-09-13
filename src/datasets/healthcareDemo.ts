import {
  CompetitorIntelligence,
  DataCleaningReport,
  DemandIntelligence,
  MarketValueAnalysis,
  ProductSuccessScore,
  ReviewIntelligence,
} from '../types';

export const HEALTHCARE_DEMO_RAW_DATA = [
  { Month: 'Jan', Product: 'Himalaya Purifying Neem Face Wash', Retail_Units_K: 480, Revenue: 88800000, Retail_Price: 185, Comp_Price: 215, Pimple_Reduction_Pct: 88 },
  { Month: 'Feb', Product: 'Himalaya Purifying Neem Face Wash', Retail_Units_K: 540, Revenue: 99900000, Retail_Price: 185, Comp_Price: 215, Pimple_Reduction_Pct: 88 },
  { Month: 'Mar', Product: 'Himalaya Purifying Neem Face Wash', Retail_Units_K: 620, Revenue: 114700000, Retail_Price: 185, Comp_Price: 210, Pimple_Reduction_Pct: 89 },
  { Month: 'Apr', Product: 'Himalaya Purifying Neem Face Wash', Retail_Units_K: 710, Revenue: 131350000, Retail_Price: 185, Comp_Price: 210, Pimple_Reduction_Pct: 89 },
];

export const HEALTHCARE_DEMO_CLEANING_REPORT: DataCleaningReport = {
  originalRowCount: 35000,
  cleanedRowCount: 35000,
  totalColumns: 7,
  missingCellsFilled: 22,
  duplicatesRemoved: 140,
  outliersCount: 280,
  dataQualityScore: 97,
  qualityGrade: 'A+',
  penalties: [
    'Removed 140 duplicate Nykaa & Amazon review submissions (-1 pt)',
    'Imputed 22 missing skin-type labels with mode (-1 pt)',
  ],
  columnProfiles: [
    { name: 'Month', detectedType: 'date', missingCount: 0, missingPct: 0, uniqueCount: 4, sampleValues: ['Jan', 'Feb'], outliersCount: 0 },
    { name: 'Product', detectedType: 'category', missingCount: 0, missingPct: 0, uniqueCount: 1, sampleValues: ['Himalaya Purifying Neem Face Wash'], outliersCount: 0 },
    { name: 'Retail_Units_K', detectedType: 'numeric', missingCount: 0, missingPct: 0, uniqueCount: 4, sampleValues: [480, 540], min: 480, max: 710, mean: 587.5, outliersCount: 0 },
    { name: 'Retail_Price', detectedType: 'currency', missingCount: 0, missingPct: 0, uniqueCount: 1, sampleValues: [185], min: 185, max: 185, mean: 185, outliersCount: 0 },
    { name: 'Comp_Price', detectedType: 'currency', missingCount: 0, missingPct: 0, uniqueCount: 2, sampleValues: [215, 210], min: 210, max: 215, mean: 212.5, outliersCount: 0 },
    { name: 'Pimple_Reduction_Pct', detectedType: 'percentage', missingCount: 0, missingPct: 0, uniqueCount: 2, sampleValues: [88, 89], min: 88, max: 89, mean: 88.5, outliersCount: 0 },
  ],
};

export const HEALTHCARE_DEMO_REVIEWS: ReviewIntelligence = {
  metrics: {
    totalReviews: 35000,
    averageRating: 4.6,
    ratingDistribution: {
      star1: 1050, // 3%
      star2: 700,  // 2%
      star3: 1400, // 4%
      star4: 9450, // 27%
      star5: 22400,// 64%
    },
    starPercentages: {
      star1: 3.0,
      star2: 2.0,
      star3: 4.0,
      star4: 27.0,
      star5: 64.0,
    },
    positivePct: 91.0,
    negativePct: 5.0,
    neutralPct: 4.0,
    mixedPct: 0.0,
    overallSentimentLabel: 'Overall Customer Sentiment: 91% Positive',
  },
  likedFeatures: [
    {
      name: 'Natural Pimple & Acne Prevention',
      category: 'positive',
      positiveMentions: 24500,
      negativeMentions: 480,
      sentimentScore: 98,
      sampleQuotes: [
        'Holy grail face wash for Indian oily skin! Cleared my stubborn college acne within 2 weeks of twice-daily use.',
        'Neem and Turmeric natural formula cleanses deep pores without harsh chemicals.',
      ],
    },
    {
      name: 'Gentle Soap-Free Herbal Formula',
      category: 'positive',
      positiveMentions: 21200,
      negativeMentions: 540,
      sentimentScore: 97,
      sampleQuotes: [
        'Soap-free gel texture does not burn sensitive skin or sting the eyes.',
      ],
    },
    {
      name: 'Affordable Pocket-Friendly Price (₹185)',
      category: 'positive',
      positiveMentions: 18900,
      negativeMentions: 320,
      sentimentScore: 98,
      sampleQuotes: [
        'Lasts easily for 2 months, ₹185 for 150ml tube is incredible value compared to western brands.',
      ],
    },
  ],
  dislikedFeatures: [
    {
      name: 'Dryness in Harsh North Indian Winters',
      category: 'negative',
      positiveMentions: 890,
      negativeMentions: 2450,
      sentimentScore: 26,
      sampleQuotes: [
        'Can make dry skin feel slightly stretchy during chilly December-January months in Delhi; definitely need moisturizer afterwards.',
      ],
    },
    {
      name: 'Tube Flip-Cap Leakage in Bags',
      category: 'negative',
      positiveMentions: 610,
      negativeMentions: 1720,
      sentimentScore: 26,
      sampleQuotes: [
        'Cap popped open inside my college gym bag and leaked gel onto my notebook.',
      ],
    },
  ],
  aiExecutiveSummary:
    'Indian consumers on Amazon, Flipkart, and Nykaa revere Himalaya Purifying Neem Face Wash for its proven Ayurvedic acne defense and democratic ₹185 pricing (91% positive sentiment), with winter dryness and tube cap tightness being the sole recurrent customer criticisms.',
  frequentKeywords: [
    { word: 'acne', count: 26400, sentiment: 'pos' },
    { word: 'pimple', count: 24100, sentiment: 'pos' },
    { word: 'neem', count: 21500, sentiment: 'pos' },
    { word: 'clean', count: 18200, sentiment: 'pos' },
    { word: 'fresh', count: 16400, sentiment: 'pos' },
    { word: 'dryness', count: 3200, sentiment: 'neg' },
  ],
};

export const HEALTHCARE_DEMO_DEMAND: DemandIntelligence = {
  score: 94,
  classification: 'HIGH DEMAND',
  isProxy: false,
  demandProxyLabel: 'Verified Market Demand',
  proxySignalsUsed: [
    'Pan-India Chemist & Pharmacy Over-The-Counter Sell-Through',
    'E-Commerce & Quick Commerce (Nykaa, Amazon, Blinkit) Re-orders',
    'Dermatologist Recommendation Frequency Across Tier-1/2 Cities',
  ],
  confidencePct: 96,
  currentDemand: 94,
  demandTrend: 'increasing',
  growthRatePct: 24.5,
  seasonalFactor: 'Monsoon & Summer Humidity Oiliness Surge (+30% peak demand)',
  historicalPoints: [
    { period: 'Jan', demand: 78, sales: 480, price: 185, competitorPrice: 215 },
    { period: 'Feb', demand: 84, sales: 540, price: 185, competitorPrice: 215 },
    { period: 'Mar', demand: 89, sales: 620, price: 185, competitorPrice: 210 },
    { period: 'Apr', demand: 94, sales: 710, price: 185, competitorPrice: 210 },
  ],
  projectedPoints: [
    { period: 'May (Est)', demand: 96, sales: 790, price: 185, competitorPrice: 210, projected: true },
    { period: 'Jun (Est)', demand: 98, sales: 870, price: 185, competitorPrice: 210, projected: true },
    { period: 'Jul (Est)', demand: 99, sales: 950, price: 185, competitorPrice: 210, projected: true },
  ],
  aiDemandInterpretation:
    'Monthly retail dispatches climbed 47.9% from 4,80,000 to 7,10,000 tubes across Indian pharmacies and beauty platforms, cementing Himalaya’s position as India’s #1 anti-acne face wash.',
};

export const HEALTHCARE_DEMO_MARKET_VALUE: MarketValueAnalysis = {
  productPrice: 185,
  averageMarketPrice: 215,
  minPrice: 165,
  maxPrice: 299,
  pricePositionPct: -14.0,
  pricePositionLabel: 'Competitive',
  currencySymbol: '₹',
  elasticityAssessment:
    'Priced at ₹185 for 150ml, Himalaya sits 14% below competing face washes like Clean & Clear and Garnier (₹215 benchmark), securing mass volume conversion among Indian students and young adults.',
  historicalPrices: [
    { period: 'Jan', price: 185, competitorAvg: 215 },
    { period: 'Feb', price: 185, competitorAvg: 215 },
    { period: 'Mar', price: 185, competitorAvg: 210 },
    { period: 'Apr', price: 185, competitorAvg: 210 },
  ],
};

export const HEALTHCARE_DEMO_COMPETITORS: CompetitorIntelligence = {
  marketLeader: 'Himalaya Purifying Neem Face Wash (Our Product)',
  aiCompetitorSummary:
    'Himalaya Purifying Neem holds over 38% market volume share in India’s face wash category, beating Clean & Clear and Garnier in customer sentiment (91% vs 81%) and offering a decisive ₹30 price advantage.',
  opportunityNiche: 'Neem-Turmeric winter moisturizing foaming pump variant with added Aloe Vera.',
  competitors: [
    {
      name: 'Himalaya Purifying Neem (Our Product)',
      price: 185,
      rating: 4.6,
      reviewsCount: 35000,
      demandScore: 94,
      sentimentScore: 91,
      marketPosition: 'National Market Leader (38% Share)',
      strengths: 'Ayurvedic neem trust, sub-₹200 price, dermatologist recommended, soap-free',
      weaknesses: 'Winter skin tightness on already dry skin',
      isMainProduct: true,
    },
    {
      name: 'Clean & Clear Foaming Face Wash',
      price: 215,
      rating: 4.3,
      reviewsCount: 22000,
      demandScore: 86,
      sentimentScore: 81,
      marketPosition: 'Legacy Western Challenger (J&J)',
      strengths: 'High brand recognition among teenage girls',
      weaknesses: 'Synthetic chemical surfactants, higher price tag',
    },
    {
      name: 'Garnier Skin Naturals Pure Neem',
      price: 199,
      rating: 4.2,
      reviewsCount: 16500,
      demandScore: 82,
      sentimentScore: 78,
      marketPosition: 'Multinational FMCG Peer',
      strengths: 'Deep modern trade and television ad visibility',
      weaknesses: 'Perceived as more artificial than Himalaya herbal roots',
    },
    {
      name: 'Mamaearth Tea Tree Face Wash',
      price: 249,
      rating: 4.4,
      reviewsCount: 18200,
      demandScore: 84,
      sentimentScore: 83,
      marketPosition: 'D2C Premium Natural Tier',
      strengths: 'Toxin-free certified, active online marketing',
      weaknesses: '35% price premium over Himalaya',
    },
  ],
};

export const HEALTHCARE_DEMO_SUCCESS_SCORE: ProductSuccessScore = {
  overallScore: 93,
  classification: 'High Potential',
  confidenceScore: 96,
  breakdown: {
    customerSentiment: 91,
    demand: 94,
    competition: 82,
    pricing: 95,
    marketGrowth: 93,
    productQuality: 94,
  },
  aiVerdict:
    'Himalaya Purifying Neem Face Wash represents an iconic Indian FMCG success story (93/100). Stellar customer sentiment (91% positive across 35k reviews) and resilient demand volume (+24.5% growth) confirm unmatched household loyalty. Introducing an Aloe-infused moisturizing winter variant will neutralize winter dryness feedback.',
  keyDrivers: [
    'Commands ~38% volume share of India’s booming anti-acne skincare segment',
    'Massively affordable ₹185 price point fits pocket-money and family budgets',
    'Ayurvedic herbal positioning aligns with Indian cultural preference for natural remedies',
    'Dermatologist endorsement network across Indian pharmacies ensures recurring prescription off-take',
  ],
  keyRisks: [
    'Rising competition from new-age D2C skincare startups (The Derma Co, Mamaearth, Dot & Key)',
    'Seasonal dry skin feedback in Northern and Western Indian winters',
    'Packaging flip-cap durability in student travel backpacks',
  ],
  recommendedAction:
    'Upgrade tube packaging with a screw-lock spill-proof cap and cross-sell the Himalaya Neem Pack combo during peak summer humidity season.',
  uncertaintyDisclaimer:
    'Based on synthetic beauty and personal care market audit modeled after Indian skincare consumption patterns.',
};
