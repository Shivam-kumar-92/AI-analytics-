import {
  CompetitorIntelligence,
  DataCleaningReport,
  DemandIntelligence,
  MarketValueAnalysis,
  ProductSuccessScore,
  ReviewIntelligence,
} from '../types';

export const EARBUDS_DEMO_RAW_DATA = [
  { ReviewID: 'AMZ-IN-001', Product: 'boAt Airdopes 141 True Wireless', Rating: 5, Price: 1299, Aspect: 'Sound Quality & Bass', Text: 'Mind-blowing boAt signature bass! Perfect for Punjabi beats and Bollywood music on Spotify. Worth every rupee on Amazon Great Indian Festival sale.' },
  { ReviewID: 'AMZ-IN-002', Product: 'boAt Airdopes 141 True Wireless', Rating: 2, Price: 1299, Aspect: 'Microphone & Calls', Text: 'Microphone picks up too much traffic noise on Delhi metro and auto rickshaw rides. The person on the other end complains constantly.' },
  { ReviewID: 'FLP-IN-003', Product: 'boAt Airdopes 141 True Wireless', Rating: 5, Price: 1299, Aspect: 'Price & Value', Text: 'Unbeatable VFM at ₹1,299. Rivals like Noise and Boult are priced at ₹1,599 with inferior bass.' },
  { ReviewID: 'FLP-IN-004', Product: 'boAt Airdopes 141 True Wireless', Rating: 4, Price: 1299, Aspect: 'Battery & Fast Charge', Text: 'ASAP charge is lifesaver for college - 5 mins charge gives 1 hour playback. Case battery lasts nearly 4 days.' },
  { ReviewID: 'AMZ-IN-005', Product: 'boAt Airdopes 141 True Wireless', Rating: 1, Price: 1299, Aspect: 'Left Earbud Charging', Text: 'Left earbud stopped charging in case after 45 days. Had to visit boAt service center in Nehru Place.' },
  { ReviewID: 'FLP-IN-006', Product: 'boAt Airdopes 141 True Wireless', Rating: 5, Price: 1299, Aspect: 'Ergonomic Fit', Text: 'Fits snug inside ear during gym workouts and morning jogging, does not fall off even when sweating.' },
  { ReviewID: 'AMZ-IN-007', Product: 'boAt Airdopes 141 True Wireless', Rating: 4, Price: 1299, Aspect: 'Gaming Latency', Text: 'BEAST mode low latency works great for BGMI and Free Fire gaming on OnePlus phone.' },
  { ReviewID: 'FLP-IN-008', Product: 'boAt Airdopes 141 True Wireless', Rating: 3, Price: 1299, Aspect: 'Case Durability', Text: 'Plastic lid hinge feels a bit delicate, scratches easily if kept in pocket with bike keys.' },
];

export const EARBUDS_DEMO_CLEANING_REPORT: DataCleaningReport = {
  originalRowCount: 25000,
  cleanedRowCount: 25000,
  totalColumns: 6,
  missingCellsFilled: 42,
  duplicatesRemoved: 118,
  outliersCount: 310,
  dataQualityScore: 94,
  qualityGrade: 'A',
  penalties: [
    'Removed 118 duplicate review submissions from Flipkart & Amazon sales (-2 pts)',
    'Imputed 42 missing rating fields with dataset median (-2 pts)',
    'Flagged 310 statistical outliers in review text length (-2 pts)',
  ],
  columnProfiles: [
    { name: 'ReviewID', detectedType: 'id', missingCount: 0, missingPct: 0, uniqueCount: 25000, sampleValues: ['AMZ-IN-001', 'AMZ-IN-002'], outliersCount: 0 },
    { name: 'Product', detectedType: 'category', missingCount: 0, missingPct: 0, uniqueCount: 1, sampleValues: ['boAt Airdopes 141 True Wireless'], outliersCount: 0 },
    { name: 'Rating', detectedType: 'rating', missingCount: 42, missingPct: 0.16, uniqueCount: 5, sampleValues: [5, 4, 2], min: 1, max: 5, mean: 4.2, outliersCount: 0 },
    { name: 'Price', detectedType: 'currency', missingCount: 0, missingPct: 0, uniqueCount: 1, sampleValues: [1299], min: 1299, max: 1299, mean: 1299, outliersCount: 0 },
    { name: 'Aspect', detectedType: 'category', missingCount: 0, missingPct: 0, uniqueCount: 6, sampleValues: ['Sound Quality & Bass', 'Battery & Fast Charge'], outliersCount: 0 },
    { name: 'Text', detectedType: 'review_text', missingCount: 0, missingPct: 0, uniqueCount: 24882, sampleValues: ['Mind-blowing boAt bass...', 'Microphone picks up...'], outliersCount: 310 },
  ],
};

export const EARBUDS_DEMO_REVIEWS: ReviewIntelligence = {
  metrics: {
    totalReviews: 25000,
    averageRating: 4.2,
    ratingDistribution: {
      star1: 2000, // 8%
      star2: 1000, // 4%
      star3: 1750, // 7%
      star4: 6750, // 27%
      star5: 13500, // 54%
    },
    starPercentages: {
      star1: 8.0,
      star2: 4.0,
      star3: 7.0,
      star4: 27.0,
      star5: 54.0,
    },
    positivePct: 81.0,
    negativePct: 12.0,
    neutralPct: 7.0,
    mixedPct: 0.0,
    overallSentimentLabel: 'Overall Customer Sentiment: 81% Positive',
  },
  likedFeatures: [
    {
      name: 'Signature Bass & Punchy Sound',
      category: 'positive',
      positiveMentions: 13800,
      negativeMentions: 920,
      sentimentScore: 94,
      sampleQuotes: [
        'Mind-blowing boAt signature bass! Perfect for Bollywood and Punjabi music beats on Spotify.',
        'Bass is deep and punchy without distorting at 80% volume.',
      ],
    },
    {
      name: 'Value for Money Price (₹1,299)',
      category: 'positive',
      positiveMentions: 12400,
      negativeMentions: 480,
      sentimentScore: 96,
      sampleQuotes: [
        'Best true wireless earbuds in India under ₹1,500 budget.',
        'Unbeatable VFM at ₹1,299 during Amazon Great Indian Festival sale.',
      ],
    },
    {
      name: 'ASAP Fast Charge & Playback',
      category: 'positive',
      positiveMentions: 9800,
      negativeMentions: 740,
      sentimentScore: 93,
      sampleQuotes: [
        'ASAP charge is lifesaver for college - 5 mins charge gives 1 hour playback.',
        'Case battery easily lasts 4 full days of regular listening.',
      ],
    },
    {
      name: 'Snug Gym Fit & Splash Proof',
      category: 'positive',
      positiveMentions: 7800,
      negativeMentions: 620,
      sentimentScore: 92,
      sampleQuotes: [
        'Fits snug inside ear during gym workouts and does not fall off while running.',
      ],
    },
  ],
  dislikedFeatures: [
    {
      name: 'Microphone Clarity in Traffic',
      category: 'negative',
      positiveMentions: 1800,
      negativeMentions: 4100,
      sentimentScore: 30,
      sampleQuotes: [
        'Microphone picks up too much traffic noise on Delhi metro and auto rickshaw commutes.',
        'Call receiver says my voice sounds distant and muffled outdoors.',
      ],
    },
    {
      name: 'Left Earbud Charging Pin Connection',
      category: 'negative',
      positiveMentions: 920,
      negativeMentions: 2150,
      sentimentScore: 30,
      sampleQuotes: [
        'Left earbud stopped charging in cradle after 45 days, had to clean brass pins with cloth.',
      ],
    },
  ],
  aiExecutiveSummary:
    'Indian consumers on Amazon & Flipkart overwhelmingly celebrate boAt Airdopes 141 for signature heavy bass tuning and aggressive ₹1,299 value pricing, while call microphone performance in chaotic street traffic and one-side charging contact issues represent the primary service grievances.',
  frequentKeywords: [
    { word: 'bass', count: 14800, sentiment: 'pos' },
    { word: 'sound', count: 13200, sentiment: 'pos' },
    { word: 'price', count: 11900, sentiment: 'pos' },
    { word: 'battery', count: 9100, sentiment: 'pos' },
    { word: 'mic', count: 4800, sentiment: 'neg' },
    { word: 'call', count: 3900, sentiment: 'neg' },
    { word: 'gym', count: 3400, sentiment: 'pos' },
  ],
};

export const EARBUDS_DEMO_DEMAND: DemandIntelligence = {
  score: 88,
  classification: 'HIGH DEMAND',
  isProxy: true,
  demandProxyLabel: 'Estimated Demand / Demand Proxy',
  proxySignalsUsed: [
    'Amazon Great Indian Festival & Flipkart BBD Cart Velocity',
    'Review Volume Accumulation (+22% MoM across E-commerce)',
    'Search Index Frequency on "budget tws under 1500"',
    'Tier-2 & Tier-3 City Youth Order Expansion',
  ],
  confidencePct: 82,
  currentDemand: 88,
  demandTrend: 'increasing',
  growthRatePct: 22.0,
  seasonalFactor: 'Diwali Festive & New Year Electronics Sale Surge (+30% Q4 lift)',
  historicalPoints: [
    { period: 'Month 1', demand: 68, reviews: 3400, price: 1399, competitorPrice: 1599 },
    { period: 'Month 2', demand: 74, reviews: 7800, price: 1349, competitorPrice: 1599 },
    { period: 'Month 3', demand: 80, reviews: 13200, price: 1299, competitorPrice: 1549 },
    { period: 'Month 4', demand: 84, reviews: 17900, price: 1299, competitorPrice: 1549 },
    { period: 'Month 5', demand: 86, reviews: 21500, price: 1299, competitorPrice: 1499 },
    { period: 'Month 6', demand: 88, reviews: 25000, price: 1299, competitorPrice: 1499 },
  ],
  projectedPoints: [
    { period: 'Month 7 (Est)', demand: 91, projected: true },
    { period: 'Month 8 (Est)', demand: 93, projected: true },
    { period: 'Month 9 (Est)', demand: 95, projected: true },
  ],
  aiDemandInterpretation:
    'Estimated Demand Score is 88/100 (HIGH DEMAND). Calculated using Amazon/Flipkart review trajectory (+22%), high search intent volume for budget audio in India, and disruptive sub-₹1,300 pricing leverage.',
};

export const EARBUDS_DEMO_MARKET_VALUE: MarketValueAnalysis = {
  productPrice: 1299,
  averageMarketPrice: 1549,
  minPrice: 1099,
  maxPrice: 1999,
  pricePositionPct: -16.1,
  pricePositionLabel: 'Competitive',
  currencySymbol: '₹',
  elasticityAssessment:
    'Average Market Price: ₹1,549 | boAt Price: ₹1,299. Price Position: 16.1% below market average. Pricing Position: Competitive. Sitting under the psychological ₹1,500 threshold guarantees dominant conversion on Indian e-commerce marketplaces.',
  historicalPrices: [
    { period: 'M1', price: 1399, competitorAvg: 1599 },
    { period: 'M2', price: 1349, competitorAvg: 1599 },
    { period: 'M3', price: 1299, competitorAvg: 1549 },
    { period: 'M4', price: 1299, competitorAvg: 1549 },
    { period: 'M5', price: 1299, competitorAvg: 1499 },
    { period: 'M6', price: 1299, competitorAvg: 1499 },
  ],
};

export const EARBUDS_DEMO_COMPETITORS: CompetitorIntelligence = {
  marketLeader: 'boAt Airdopes 141 (Our Product)',
  aiCompetitorSummary:
    'boAt Airdopes 141 holds the #1 market volume position in India with stronger consumer brand loyalty (81% positive sentiment) and ₹250 lower price than Noise Buds VS102, although Boult Audio Z40 competes fiercely on battery capacity.',
  opportunityNiche: 'Quad-mic environmental noise cancellation (ENx) upgrade to eliminate Indian outdoor traffic complaints.',
  competitors: [
    {
      name: 'boAt Airdopes 141 (Our Product)',
      price: 1299,
      rating: 4.2,
      reviewsCount: 25000,
      demandScore: 88,
      sentimentScore: 81,
      marketPosition: 'Market Leader & Volume King',
      strengths: 'Signature deep bass, sub-₹1,300 price, 42-hour total playback, massive brand recall',
      weaknesses: 'Outdoor traffic call microphone clarity, case scratches',
      isMainProduct: true,
    },
    {
      name: 'Noise Buds VS102',
      price: 1499,
      rating: 4.1,
      reviewsCount: 18500,
      demandScore: 82,
      sentimentScore: 78,
      marketPosition: 'Direct Indian Challenger',
      strengths: 'Minimalist clean aesthetic, clear vocals',
      weaknesses: 'Softer bass response compared to boAt tuning',
    },
    {
      name: 'Boult Audio Z40',
      price: 1399,
      rating: 4.2,
      reviewsCount: 16200,
      demandScore: 84,
      sentimentScore: 79,
      marketPosition: 'Feature Challenger',
      strengths: '60-hour massive battery case backup',
      weaknesses: 'Bulkier charging case in pant pockets',
    },
    {
      name: 'Realme Buds T300',
      price: 1999,
      rating: 4.4,
      reviewsCount: 14000,
      demandScore: 80,
      sentimentScore: 84,
      marketPosition: 'Premium Budget Tier',
      strengths: 'Active noise cancellation (ANC 30dB)',
      weaknesses: '53% higher price tag than boAt Airdopes 141',
    },
  ],
};

export const EARBUDS_DEMO_SUCCESS_SCORE: ProductSuccessScore = {
  overallScore: 86,
  classification: 'High Potential',
  confidenceScore: 82,
  breakdown: {
    customerSentiment: 88,
    demand: 88,
    competition: 70,
    pricing: 94,
    marketGrowth: 85,
    productQuality: 86,
  },
  aiVerdict:
    'boAt Airdopes 141 demonstrates dominant commercial market strength (86/100) in the Indian consumer audio sector. Customer sentiment is predominantly positive (81%), the product is priced 16.1% below the category average at ₹1,299, and review volume on Amazon and Flipkart is expanding rapidly (+22%). The key area for product improvement is upgrading to dual-mic noise cancellation to resolve outdoor traffic call complaints.',
  keyDrivers: [
    'Customer sentiment is predominantly positive (81% favorable ratio across 25k reviews)',
    'Price point (₹1,299) hits the highest volume buying sweet spot on Amazon & Flipkart',
    'boAt brand recall in India remains exceptionally high among Gen-Z and college students',
    'TWS earbud adoption in tier-2/3 Indian cities is growing at >35% annually',
  ],
  keyRisks: [
    'Outdoor ambient traffic noise during phone calls triggering negative reviews',
    'Intense price wars from Noise and Boult in the sub-₹1,500 segment',
    'Service center turnaround expectations across non-metro Indian cities',
  ],
  recommendedAction:
    'Introduce AI-ENx dual-mic algorithm in the next hardware revision while bundling festive combo deals on quick-commerce apps (Blinkit, Zepto).',
  uncertaintyDisclaimer:
    'Evaluated based on synthetic demonstration dataset modeling Indian e-commerce review patterns. Sales figures are proxy estimates.',
};
