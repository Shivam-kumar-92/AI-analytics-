import {
  CompetitorIntelligence,
  DataCleaningReport,
  DemandIntelligence,
  MarketValueAnalysis,
  ProductSuccessScore,
  ReviewIntelligence,
} from '../types';

export const FMCG_DEMO_RAW_DATA = [
  { Week: 'W01', SKU: 'Tata Tea Premium Desh Ki Chai', Kirana_Cases_Sold: 14200, Revenue: 6816000, Retail_Price: 480, Comp_Price: 520, Repeat_Purchase_Pct: 58 },
  { Week: 'W02', SKU: 'Tata Tea Premium Desh Ki Chai', Kirana_Cases_Sold: 16500, Revenue: 7920000, Retail_Price: 480, Comp_Price: 520, Repeat_Purchase_Pct: 61 },
  { Week: 'W03', SKU: 'Tata Tea Premium Desh Ki Chai', Kirana_Cases_Sold: 19100, Revenue: 9168000, Retail_Price: 480, Comp_Price: 510, Repeat_Purchase_Pct: 63 },
  { Week: 'W04', SKU: 'Tata Tea Premium Desh Ki Chai', Kirana_Cases_Sold: 22400, Revenue: 10752000, Retail_Price: 480, Comp_Price: 510, Repeat_Purchase_Pct: 66 },
];

export const FMCG_DEMO_CLEANING_REPORT: DataCleaningReport = {
  originalRowCount: 8200,
  cleanedRowCount: 8200,
  totalColumns: 7,
  missingCellsFilled: 14,
  duplicatesRemoved: 38,
  outliersCount: 65,
  dataQualityScore: 97,
  qualityGrade: 'A+',
  penalties: [
    'Filtered 38 redundant wholesale distributor invoice scans (-1 pt)',
    'Imputed 14 missing Kirana store postal codes (-1 pt)',
  ],
  columnProfiles: [
    { name: 'Week', detectedType: 'date', missingCount: 0, missingPct: 0, uniqueCount: 4, sampleValues: ['W01', 'W02'], outliersCount: 0 },
    { name: 'SKU', detectedType: 'category', missingCount: 0, missingPct: 0, uniqueCount: 1, sampleValues: ['Tata Tea Premium Desh Ki Chai'], outliersCount: 0 },
    { name: 'Kirana_Cases_Sold', detectedType: 'numeric', missingCount: 0, missingPct: 0, uniqueCount: 4, sampleValues: [14200, 16500], min: 14200, max: 22400, mean: 18050, outliersCount: 0 },
    { name: 'Retail_Price', detectedType: 'currency', missingCount: 0, missingPct: 0, uniqueCount: 1, sampleValues: [480], min: 480, max: 480, mean: 480, outliersCount: 0 },
    { name: 'Comp_Price', detectedType: 'currency', missingCount: 0, missingPct: 0, uniqueCount: 2, sampleValues: [520, 510], min: 510, max: 520, mean: 515, outliersCount: 0 },
    { name: 'Repeat_Purchase_Pct', detectedType: 'percentage', missingCount: 0, missingPct: 0, uniqueCount: 4, sampleValues: [58, 61, 63, 66], min: 58, max: 66, mean: 62, outliersCount: 0 },
  ],
};

export const FMCG_DEMO_REVIEWS: ReviewIntelligence = {
  metrics: {
    totalReviews: 8200,
    averageRating: 4.6,
    ratingDistribution: {
      star1: 246,  // 3%
      star2: 164,  // 2%
      star3: 328,  // 4%
      star4: 2296, // 28%
      star5: 5166, // 63%
    },
    starPercentages: {
      star1: 3.0,
      star2: 2.0,
      star3: 4.0,
      star4: 28.0,
      star5: 63.0,
    },
    positivePct: 91.0,
    negativePct: 5.0,
    neutralPct: 4.0,
    mixedPct: 0.0,
    overallSentimentLabel: 'Overall Customer Sentiment: 91% Positive',
  },
  likedFeatures: [
    {
      name: 'Kadak Swad & Strong Morning Aroma',
      category: 'positive',
      positiveMentions: 5900,
      negativeMentions: 120,
      sentimentScore: 98,
      sampleQuotes: [
        'Desh ki chai lives up to its name. Perfectly balanced blend of big tea leaves for aroma and small grains for strong kadak taste.',
        'Essential for my morning chai with ginger and cardamom. Color and aroma are unbeatable.',
      ],
    },
    {
      name: 'Consistent Blend & Golden Color',
      category: 'positive',
      positiveMentions: 5100,
      negativeMentions: 160,
      sentimentScore: 97,
      sampleQuotes: [
        'Boils into a rich golden reddish shade without needing excess sugar or milk.',
      ],
    },
    {
      name: 'Affordable Family Pack (₹480/kg)',
      category: 'positive',
      positiveMentions: 4600,
      negativeMentions: 190,
      sentimentScore: 96,
      sampleQuotes: [
        'Priced ₹40 cheaper per kg than Red Label, saves our joint family household budget every month.',
      ],
    },
  ],
  dislikedFeatures: [
    {
      name: 'Monsoon Packaging Moisture Sensitivity',
      category: 'negative',
      positiveMentions: 340,
      negativeMentions: 890,
      sentimentScore: 28,
      sampleQuotes: [
        'During Mumbai monsoon rains, the cardboard outer carton gets slightly damp unless transferred to air-tight steel dabba immediately.',
      ],
    },
    {
      name: 'Quick Commerce Flash Stockouts',
      category: 'negative',
      positiveMentions: 280,
      negativeMentions: 640,
      sentimentScore: 30,
      sampleQuotes: [
        'Frequently out of stock for the 1kg pouch on Blinkit during Sunday morning grocery runs.',
      ],
    },
  ],
  aiExecutiveSummary:
    'Indian households exhibit fierce loyalty towards Tata Tea Premium driven by its signature kadak CTC taste and dependable family pricing (66% repeat purchase rate), while outer packaging moisture resistance during Indian monsoon season is the primary customer suggestion.',
  frequentKeywords: [
    { word: 'kadak', count: 6100, sentiment: 'pos' },
    { word: 'aroma', count: 5400, sentiment: 'pos' },
    { word: 'taste', count: 4800, sentiment: 'pos' },
    { word: 'family', count: 3900, sentiment: 'pos' },
    { word: 'morning', count: 3500, sentiment: 'pos' },
    { word: 'dabba', count: 1200, sentiment: 'neu' },
  ],
};

export const FMCG_DEMO_DEMAND: DemandIntelligence = {
  score: 91,
  classification: 'HIGH DEMAND',
  isProxy: false,
  demandProxyLabel: 'Verified Market Demand',
  proxySignalsUsed: [
    'Verified Traditional Kirana & Wholesale Off-take Volumes',
    'Quick Commerce (Blinkit, Zepto, Instamart) Daily Dispatches',
    'Modern Trade (D-Mart, Reliance Smart Bazaar) Sell-Through Logs',
  ],
  confidencePct: 95,
  currentDemand: 91,
  demandTrend: 'increasing',
  growthRatePct: 21.0,
  seasonalFactor: 'Winter Morning Chai Surge & Monsoon Rains (+25% Q3/Q4 peak)',
  historicalPoints: [
    { period: 'Week 1', demand: 75, sales: 14200, price: 480, competitorPrice: 520 },
    { period: 'Week 2', demand: 81, sales: 16500, price: 480, competitorPrice: 520 },
    { period: 'Week 3', demand: 86, sales: 19100, price: 480, competitorPrice: 510 },
    { period: 'Week 4', demand: 91, sales: 22400, price: 480, competitorPrice: 510 },
  ],
  projectedPoints: [
    { period: 'Week 5 (Est)', demand: 94, sales: 24800, price: 480, competitorPrice: 510, projected: true },
    { period: 'Week 6 (Est)', demand: 96, sales: 27100, price: 480, competitorPrice: 510, projected: true },
    { period: 'Week 7 (Est)', demand: 98, sales: 29500, price: 480, competitorPrice: 510, projected: true },
  ],
  aiDemandInterpretation:
    'Weekly cases dispatched grew 57.7% from 14,200 to 22,400 cases across Kirana, D-Mart, and quick-commerce channels, reflecting ubiquitous Indian household kitchen penetration.',
};

export const FMCG_DEMO_MARKET_VALUE: MarketValueAnalysis = {
  productPrice: 480,
  averageMarketPrice: 515,
  minPrice: 450,
  maxPrice: 580,
  pricePositionPct: -6.8,
  pricePositionLabel: 'Competitive',
  currencySymbol: '₹',
  elasticityAssessment:
    'Tata Tea Premium is strategically priced ₹35 (6.8%) below Red Label (₹480/kg vs ₹515 benchmark), defending mass Indian market leadership without degrading premium perception.',
  historicalPrices: [
    { period: 'W1', price: 480, competitorAvg: 520 },
    { period: 'W2', price: 480, competitorAvg: 520 },
    { period: 'W3', price: 480, competitorAvg: 510 },
    { period: 'W4', price: 480, competitorAvg: 510 },
  ],
};

export const FMCG_DEMO_COMPETITORS: CompetitorIntelligence = {
  marketLeader: 'Tata Tea Premium (Our Brand)',
  aiCompetitorSummary:
    'Tata Tea Premium holds the largest household share across North and East India, maintaining an unbeatable repeat rate (66%) and ₹35/kg price advantage over Brooke Bond Red Label and Wagh Bakri.',
  opportunityNiche: 'Ayurvedic Elaichi & Tulsi infused regional premium pouch variants.',
  competitors: [
    {
      name: 'Tata Tea Premium ("Desh Ki Chai")',
      price: 480,
      rating: 4.6,
      reviewsCount: 8200,
      demandScore: 91,
      sentimentScore: 91,
      marketPosition: 'Market Leader (Desh Ki Chai)',
      strengths: 'Signature kadak blend, high trust Tata brand heritage, ₹480 family price',
      weaknesses: 'Occasional quick commerce stockouts during morning peaks',
      isMainProduct: true,
    },
    {
      name: 'Brooke Bond Red Label',
      price: 520,
      rating: 4.5,
      reviewsCount: 12400,
      demandScore: 89,
      sentimentScore: 86,
      marketPosition: 'Primary National Challenger (HUL)',
      strengths: 'Deep nationwide Kirana distribution, emotional advertising',
      weaknesses: '8.3% price premium over Tata Tea Premium',
    },
    {
      name: 'Wagh Bakri Premium Tea',
      price: 510,
      rating: 4.4,
      reviewsCount: 7800,
      demandScore: 82,
      sentimentScore: 84,
      marketPosition: 'Western India Stronghold',
      strengths: 'Fierce loyalty in Gujarat, Maharashtra, and MP',
      weaknesses: 'Lower penetration in South Indian and Eastern markets',
    },
    {
      name: 'Taaza Tea (HUL)',
      price: 440,
      rating: 4.1,
      reviewsCount: 6500,
      demandScore: 78,
      sentimentScore: 72,
      marketPosition: 'Economy CTC Tier',
      strengths: 'Budget pricing for rural kiosks',
      weaknesses: 'Lacks richness of aroma and leaf quality',
    },
  ],
};

export const FMCG_DEMO_SUCCESS_SCORE: ProductSuccessScore = {
  overallScore: 92,
  classification: 'High Potential',
  confidenceScore: 95,
  breakdown: {
    customerSentiment: 91,
    demand: 91,
    competition: 80,
    pricing: 94,
    marketGrowth: 92,
    productQuality: 94,
  },
  aiVerdict:
    'Tata Tea Premium represents the peak of Indian FMCG brand defensibility (92/100). Phenomenal repeat purchase rates (66%) and 91% positive consumer sentiment confirm unshakeable morning chai routine integration. Expanding localized quick-commerce inventory buffers will effortlessly convert unmet weekend demand spikes.',
  keyDrivers: [
    'Repeat purchase rate reaches 66% among Indian families',
    'Competitively priced at ₹480/kg offering immediate daily grocery savings',
    'Tata trust and "Desh Ki Chai" cultural equity is unmatched across Indian households',
    'Packaged branded tea conversion from unbranded loose tea is growing at 15% annually in India',
  ],
  keyRisks: [
    'Raw tea leaf auction price fluctuations in Assam and Dooars gardens',
    'Intense competitive trade discounting from HUL and regional players',
    'Quick commerce delivery partner stock-outs during peak morning rush',
  ],
  recommendedAction:
    'Deploy specialized zipper zip-lock moisture barrier pouches for coastal Indian markets and expand 10-minute dark-store stocking agreements with Blinkit and Zepto.',
  uncertaintyDisclaimer:
    'Based on synthetic FMCG retail audit modeled after Indian packaged tea consumption patterns.',
};
