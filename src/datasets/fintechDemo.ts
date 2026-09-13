import {
  CompetitorIntelligence,
  DataCleaningReport,
  DemandIntelligence,
  MarketValueAnalysis,
  ProductSuccessScore,
  ReviewIntelligence,
} from '../types';

export const FINTECH_DEMO_RAW_DATA = [
  { Month: 'Jan', Card: 'HDFC Bank Millennia Credit Card', Active_Cardholders_K: 120, GMV_Crores: 145.5, Annual_Fee: 1000, Comp_Fee: 1499, Default_Rate_Pct: 1.1 },
  { Month: 'Feb', Card: 'HDFC Bank Millennia Credit Card', Active_Cardholders_K: 145, GMV_Crores: 178.2, Annual_Fee: 1000, Comp_Fee: 1499, Default_Rate_Pct: 1.2 },
  { Month: 'Mar', Card: 'HDFC Bank Millennia Credit Card', Active_Cardholders_K: 175, GMV_Crores: 218.4, Annual_Fee: 1000, Comp_Fee: 1499, Default_Rate_Pct: 1.1 },
  { Month: 'Apr', Card: 'HDFC Bank Millennia Credit Card', Active_Cardholders_K: 210, GMV_Crores: 265.8, Annual_Fee: 1000, Comp_Fee: 1499, Default_Rate_Pct: 1.2 },
];

export const FINTECH_DEMO_CLEANING_REPORT: DataCleaningReport = {
  originalRowCount: 12000,
  cleanedRowCount: 12000,
  totalColumns: 7,
  missingCellsFilled: 16,
  duplicatesRemoved: 42,
  outliersCount: 94,
  dataQualityScore: 97,
  qualityGrade: 'A+',
  penalties: [
    'Cleaned 42 redundant card application webhook logs (-1 pt)',
    'Imputed 16 missing merchant category codes (-1 pt)',
  ],
  columnProfiles: [
    { name: 'Month', detectedType: 'date', missingCount: 0, missingPct: 0, uniqueCount: 4, sampleValues: ['Jan', 'Feb'], outliersCount: 0 },
    { name: 'Card', detectedType: 'category', missingCount: 0, missingPct: 0, uniqueCount: 1, sampleValues: ['HDFC Bank Millennia Credit Card'], outliersCount: 0 },
    { name: 'Active_Cardholders_K', detectedType: 'numeric', missingCount: 0, missingPct: 0, uniqueCount: 4, sampleValues: [120, 145], min: 120, max: 210, mean: 162.5, outliersCount: 0 },
    { name: 'GMV_Crores', detectedType: 'numeric', missingCount: 0, missingPct: 0, uniqueCount: 4, sampleValues: [145.5, 178.2], min: 145.5, max: 265.8, mean: 201.98, outliersCount: 0 },
    { name: 'Annual_Fee', detectedType: 'currency', missingCount: 0, missingPct: 0, uniqueCount: 1, sampleValues: [1000], min: 1000, max: 1000, mean: 1000, outliersCount: 0 },
    { name: 'Default_Rate_Pct', detectedType: 'percentage', missingCount: 0, missingPct: 0, uniqueCount: 2, sampleValues: [1.1, 1.2], min: 1.1, max: 1.2, mean: 1.15, outliersCount: 0 },
  ],
};

export const FINTECH_DEMO_REVIEWS: ReviewIntelligence = {
  metrics: {
    totalReviews: 12000,
    averageRating: 4.6,
    ratingDistribution: {
      star1: 480,  // 4%
      star2: 240,  // 2%
      star3: 600,  // 5%
      star4: 3480, // 29%
      star5: 7200, // 60%
    },
    starPercentages: {
      star1: 4.0,
      star2: 2.0,
      star3: 5.0,
      star4: 29.0,
      star5: 60.0,
    },
    positivePct: 89.0,
    negativePct: 6.0,
    neutralPct: 5.0,
    mixedPct: 0.0,
    overallSentimentLabel: 'Overall Customer Sentiment: 89% Positive',
  },
  likedFeatures: [
    {
      name: '5% Direct Cashback on Amazon, Swiggy & Zomato',
      category: 'positive',
      positiveMentions: 9200,
      negativeMentions: 140,
      sentimentScore: 98,
      sampleQuotes: [
        'Best credit card in India for young salaried professionals! 5% cashback on Swiggy food orders, Zomato, Amazon, and Flipkart adds up to ₹1,000 every single month.',
        'CashPoints directly settle against monthly statement credit without complex voucher redemption.',
      ],
    },
    {
      name: 'Complimentary Domestic Airport Lounge Access',
      category: 'positive',
      positiveMentions: 7400,
      negativeMentions: 210,
      sentimentScore: 97,
      sampleQuotes: [
        '1 free domestic airport lounge visit per calendar quarter at Mumbai T2 and Delhi T3.',
      ],
    },
    {
      name: 'Annual Fee Waiver on ₹1 Lakh Spends',
      category: 'positive',
      positiveMentions: 6800,
      negativeMentions: 180,
      sentimentScore: 97,
      sampleQuotes: [
        '₹1,000 joining fee gets waived easily with basic annual grocery and utility payments.',
      ],
    },
  ],
  dislikedFeatures: [
    {
      name: '₹1,000 Monthly Cashback Capping',
      category: 'negative',
      positiveMentions: 410,
      negativeMentions: 1420,
      sentimentScore: 22,
      sampleQuotes: [
        'Cashback is capped at ₹1,000 per calendar month; wished it was uncapped for festive electronics purchases.',
      ],
    },
    {
      name: '3.5% International Forex Markup Fee',
      category: 'negative',
      positiveMentions: 320,
      negativeMentions: 1180,
      sentimentScore: 21,
      sampleQuotes: [
        'High 3.5% forex markup fee when traveling abroad to Thailand or Dubai or paying for US software tools.',
      ],
    },
  ],
  aiExecutiveSummary:
    'Indian millennial and Gen-Z salaried cardholders praise HDFC Bank Millennia for its unbeatable 5% cashback across daily apps (Amazon, Flipkart, Swiggy, Zomato) and effortless fee waiver (89% positive sentiment), while the ₹1,000 monthly cashback ceiling and 3.5% foreign currency transaction markup represent the chief user complaints.',
  frequentKeywords: [
    { word: 'cashback', count: 9600, sentiment: 'pos' },
    { word: 'swiggy', count: 8100, sentiment: 'pos' },
    { word: 'amazon', count: 7800, sentiment: 'pos' },
    { word: 'zomato', count: 7200, sentiment: 'pos' },
    { word: 'lounge', count: 5400, sentiment: 'pos' },
    { word: 'capping', count: 1800, sentiment: 'neg' },
  ],
};

export const FINTECH_DEMO_DEMAND: DemandIntelligence = {
  score: 93,
  classification: 'HIGH DEMAND',
  isProxy: false,
  demandProxyLabel: 'Verified Market Demand',
  proxySignalsUsed: [
    'HDFC Bank Official Retail Card Issuance Dispatches',
    'Monthly Transacted Swipes & Gross Volume (GMV) Logs',
    'NetBanking & Mobile Banking Pre-Approved Application Volume',
  ],
  confidencePct: 95,
  currentDemand: 93,
  demandTrend: 'increasing',
  growthRatePct: 29.0,
  seasonalFactor: 'Diwali Big Billion Days & Festive E-Commerce Sales (+40% Q4 surge)',
  historicalPoints: [
    { period: 'Jan', demand: 76, sales: 1455, price: 1000, competitorPrice: 1499 },
    { period: 'Feb', demand: 82, sales: 1782, price: 1000, competitorPrice: 1499 },
    { period: 'Mar', demand: 88, sales: 2184, price: 1000, competitorPrice: 1499 },
    { period: 'Apr', demand: 93, sales: 2658, price: 1000, competitorPrice: 1499 },
  ],
  projectedPoints: [
    { period: 'May (Est)', demand: 96, sales: 3120, price: 1000, competitorPrice: 1499, projected: true },
    { period: 'Jun (Est)', demand: 98, sales: 3640, price: 1000, competitorPrice: 1499, projected: true },
    { period: 'Jul (Est)', demand: 99, sales: 4180, price: 1000, competitorPrice: 1499, projected: true },
  ],
  aiDemandInterpretation:
    'Monthly transacted credit volume expanded 82.6% from ₹145.5 Cr to ₹265.8 Cr, fueled by rapid digital card activations among corporate salary account holders.',
};

export const FINTECH_DEMO_MARKET_VALUE: MarketValueAnalysis = {
  productPrice: 1000,
  averageMarketPrice: 1499,
  minPrice: 500,
  maxPrice: 3000,
  pricePositionPct: -33.3,
  pricePositionLabel: 'Undervalued',
  currencySymbol: '₹',
  elasticityAssessment:
    'HDFC Millennia’s ₹1,000 annual fee is 33.3% lower than legacy lifestyle cards (₹1,499 average), while delivering unmatched 5% reward rates on top Indian merchant apps.',
  historicalPrices: [
    { period: 'Jan', price: 1000, competitorAvg: 1499 },
    { period: 'Feb', price: 1000, competitorAvg: 1499 },
    { period: 'Mar', price: 1000, competitorAvg: 1499 },
    { period: 'Apr', price: 1000, competitorAvg: 1499 },
  ],
};

export const FINTECH_DEMO_COMPETITORS: CompetitorIntelligence = {
  marketLeader: 'HDFC Bank Millennia Credit Card (Our Product)',
  aiCompetitorSummary:
    'HDFC Bank Millennia is India’s flagship entry-luxury lifestyle credit card, offering higher merchant cashback versatility (Swiggy, Zomato, Amazon, Flipkart) than ICICI Amazon Pay and SBI SimplyCLICK, backed by HDFC Bank’s premier payment network.',
  opportunityNiche: 'Zero forex markup add-on packs for Indian youth vacationing in Southeast Asia.',
  competitors: [
    {
      name: 'HDFC Bank Millennia (Our Product)',
      price: 1000,
      rating: 4.6,
      reviewsCount: 12000,
      demandScore: 93,
      sentimentScore: 89,
      marketPosition: 'Premier Lifestyle Category Leader',
      strengths: '5% cashback on Amazon, Flipkart, Swiggy, Zomato, Uber; airport lounge access; ₹1,000 fee',
      weaknesses: '₹1,000 monthly cashback capping ceiling, 3.5% foreign markup',
      isMainProduct: true,
    },
    {
      name: 'ICICI Amazon Pay Credit Card',
      price: 0,
      rating: 4.5,
      reviewsCount: 42000,
      demandScore: 92,
      sentimentScore: 86,
      marketPosition: 'Lifetime Free Co-Brand Standard',
      strengths: 'Lifetime free with no annual fee, 5% uncapped Amazon cashback',
      weaknesses: 'Restricted mostly to Amazon ecosystem; lower cashback on Swiggy and Zomato',
    },
    {
      name: 'SBI SimplyCLICK Card',
      price: 499,
      rating: 4.1,
      reviewsCount: 26000,
      demandScore: 83,
      sentimentScore: 76,
      marketPosition: 'Mass Banking Competitor',
      strengths: 'Sub-₹500 annual fee, 10x reward points on partner apps',
      weaknesses: 'Complex reward point redemption process and voucher expiration dates',
    },
    {
      name: 'Axis Bank Ace Credit Card',
      price: 499,
      rating: 4.4,
      reviewsCount: 19000,
      demandScore: 85,
      sentimentScore: 82,
      marketPosition: 'Cashback Challenger',
      strengths: '5% cashback on Google Pay utility bill payments',
      weaknesses: 'Reduced offline cashback rates and stricter approval criteria',
    },
  ],
};

export const FINTECH_DEMO_SUCCESS_SCORE: ProductSuccessScore = {
  overallScore: 90,
  classification: 'High Potential',
  confidenceScore: 95,
  breakdown: {
    customerSentiment: 89,
    demand: 93,
    competition: 80,
    pricing: 95,
    marketGrowth: 94,
    productQuality: 92,
  },
  aiVerdict:
    'HDFC Bank Millennia Credit Card represents India’s premier retail fintech card benchmark (90/100). Phenomenal transaction growth (+29% QoQ), ₹265.8 Cr monthly volume throughput, and 89% positive cardholder sentiment validate its status as the default card for urban Indian digital commerce. Raising the festive season cashback cap to ₹2,000 would solidify absolute wallet dominance.',
  keyDrivers: [
    'Transacted GMV climbed from ₹145.5 Cr to ₹265.8 Cr across top merchant apps in India',
    '5% direct cashback on Swiggy, Zomato, Amazon, and Flipkart matches modern Indian lifestyle habits',
    'Complimentary airport lounge access provides high aspirational luxury appeal',
    'Credit card spend volumes in India are compounding at >28% annually',
  ],
  keyRisks: [
    'Competition from lifetime-free credit cards (ICICI Amazon Pay, OneCard, Scapia)',
    'Cardholder frustration with the ₹1,000 monthly cashback ceiling during big sale events',
    '3.5% foreign currency markup driving cardholders to international travel cards',
  ],
  recommendedAction:
    'Increase monthly cashback cap to ₹2,000 during Amazon Great Indian Festival and Flipkart Big Billion Days to capture high-ticket festive electronics spending.',
  uncertaintyDisclaimer:
    'Based on synthetic banking ledger demonstration data modeled on Indian retail credit card spending patterns.',
};
