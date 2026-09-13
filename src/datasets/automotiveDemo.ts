import {
  CompetitorIntelligence,
  DataCleaningReport,
  DemandIntelligence,
  MarketValueAnalysis,
  ProductSuccessScore,
  ReviewIntelligence,
} from '../types';

export const AUTOMOTIVE_DEMO_RAW_DATA = [
  { Quarter: 'Q1', Model: 'Tata Nexon EV Empowered', Units_Sold: 3800, Price: 1449000, Competitor_Price: 1699000, ARAI_Range_KM: 465, Customer_Rating: 4.4 },
  { Quarter: 'Q2', Model: 'Tata Nexon EV Empowered', Units_Sold: 4900, Price: 1449000, Competitor_Price: 1649000, ARAI_Range_KM: 465, Customer_Rating: 4.5 },
  { Quarter: 'Q3', Model: 'Tata Nexon EV Empowered', Units_Sold: 6200, Price: 1429000, Competitor_Price: 1599000, ARAI_Range_KM: 465, Customer_Rating: 4.5 },
  { Quarter: 'Q4', Model: 'Tata Nexon EV Empowered', Units_Sold: 7800, Price: 1429000, Competitor_Price: 1599000, ARAI_Range_KM: 465, Customer_Rating: 4.6 },
];

export const AUTOMOTIVE_DEMO_CLEANING_REPORT: DataCleaningReport = {
  originalRowCount: 14500,
  cleanedRowCount: 14500,
  totalColumns: 6,
  missingCellsFilled: 24,
  duplicatesRemoved: 82,
  outliersCount: 180,
  dataQualityScore: 96,
  qualityGrade: 'A+',
  penalties: [
    'Cleaned 82 duplicate Vahan portal registration entries (-1 pt)',
    'Imputed 24 missing charging telemetry logs with median values (-1 pt)',
  ],
  columnProfiles: [
    { name: 'Quarter', detectedType: 'date', missingCount: 0, missingPct: 0, uniqueCount: 4, sampleValues: ['Q1', 'Q2', 'Q3'], outliersCount: 0 },
    { name: 'Model', detectedType: 'category', missingCount: 0, missingPct: 0, uniqueCount: 1, sampleValues: ['Tata Nexon EV Empowered'], outliersCount: 0 },
    { name: 'Units_Sold', detectedType: 'numeric', missingCount: 0, missingPct: 0, uniqueCount: 4, sampleValues: [3800, 4900], min: 3800, max: 7800, mean: 5675, outliersCount: 0 },
    { name: 'Price', detectedType: 'currency', missingCount: 0, missingPct: 0, uniqueCount: 2, sampleValues: [1449000, 1429000], min: 1429000, max: 1449000, mean: 1439000, outliersCount: 0 },
    { name: 'Competitor_Price', detectedType: 'currency', missingCount: 0, missingPct: 0, uniqueCount: 3, sampleValues: [1699000, 1649000], min: 1599000, max: 1699000, mean: 1636500, outliersCount: 0 },
    { name: 'Customer_Rating', detectedType: 'rating', missingCount: 0, missingPct: 0, uniqueCount: 3, sampleValues: [4.4, 4.5, 4.6], min: 4.4, max: 4.6, mean: 4.5, outliersCount: 0 },
  ],
};

export const AUTOMOTIVE_DEMO_REVIEWS: ReviewIntelligence = {
  metrics: {
    totalReviews: 14500,
    averageRating: 4.5,
    ratingDistribution: {
      star1: 580,  // 4%
      star2: 435,  // 3%
      star3: 725,  // 5%
      star4: 4060, // 28%
      star5: 8700, // 60%
    },
    starPercentages: {
      star1: 4.0,
      star2: 3.0,
      star3: 5.0,
      star4: 28.0,
      star5: 60.0,
    },
    positivePct: 88.0,
    negativePct: 7.0,
    neutralPct: 5.0,
    mixedPct: 0.0,
    overallSentimentLabel: 'Overall Customer Sentiment: 88% Positive',
  },
  likedFeatures: [
    {
      name: '5-Star Bharat NCAP Safety & Build',
      category: 'positive',
      positiveMentions: 10400,
      negativeMentions: 180,
      sentimentScore: 98,
      sampleQuotes: [
        'Solid Indian tank build quality. Gives unmatched peace of mind with family on Indian highways.',
        '5-star safety rating and 6 airbags standard across variants is commendable from Tata.',
      ],
    },
    {
      name: 'Running Cost (₹1.10/km vs Petrol ₹9/km)',
      category: 'positive',
      positiveMentions: 9200,
      negativeMentions: 140,
      sentimentScore: 98,
      sampleQuotes: [
        'Monthly fuel expense dropped from ₹12,000 to ₹1,400 with home charging in Bangalore.',
      ],
    },
    {
      name: 'Instant City Torque & Silent Cabin',
      category: 'positive',
      positiveMentions: 8100,
      negativeMentions: 310,
      sentimentScore: 96,
      sampleQuotes: [
        'Zip mode acceleration in city traffic is addictive. Zero engine vibration and pin-drop silent cabin.',
      ],
    },
    {
      name: 'Tata Power Fast Charging Network',
      category: 'positive',
      positiveMentions: 6900,
      negativeMentions: 420,
      sentimentScore: 94,
      sampleQuotes: [
        'Easy highway road trips between Mumbai-Pune and Delhi-Jaipur thanks to ubiquitous Tata Power chargers.',
      ],
    },
  ],
  dislikedFeatures: [
    {
      name: 'Real-World Summer AC Range (290 km vs 465 km ARAI)',
      category: 'negative',
      positiveMentions: 940,
      negativeMentions: 2650,
      sentimentScore: 26,
      sampleQuotes: [
        'ARAI claims 465 km, but with 4 passengers and AC set to 22°C on Delhi-Agra expressway, real range is around 295 km.',
      ],
    },
    {
      name: 'Authorized Service Center Wait Times',
      category: 'negative',
      positiveMentions: 620,
      negativeMentions: 1840,
      sentimentScore: 25,
      sampleQuotes: [
        'Software updates and minor suspension noise checkup took 3 days at the local authorized service center.',
      ],
    },
  ],
  aiExecutiveSummary:
    'Indian car buyers strongly celebrate Tata Nexon EV for patriotic pride, 5-Star Bharat NCAP crash safety, and unbelievable running cost savings (₹1.10/km), while the gap between ARAI claims and real-world highway range with AC on along with dealership service turnaround remain the most discussed owner concerns.',
  frequentKeywords: [
    { word: 'safety', count: 11200, sentiment: 'pos' },
    { word: 'cost', count: 9400, sentiment: 'pos' },
    { word: 'range', count: 8800, sentiment: 'neu' },
    { word: 'torque', count: 7900, sentiment: 'pos' },
    { word: 'silent', count: 6800, sentiment: 'pos' },
    { word: 'service', count: 2800, sentiment: 'neg' },
  ],
};

export const AUTOMOTIVE_DEMO_DEMAND: DemandIntelligence = {
  score: 93,
  classification: 'HIGH DEMAND',
  isProxy: false,
  demandProxyLabel: 'Verified Market Demand',
  proxySignalsUsed: [
    'Official Vahan National Vehicle Portal Registrations',
    'Tata Motors Official Quarterly Production Logs',
    'Dealership Booking Waitlist (4-6 weeks across Metros)',
  ],
  confidencePct: 94,
  currentDemand: 93,
  demandTrend: 'increasing',
  growthRatePct: 26.0,
  seasonalFactor: 'Diwali & Navratri Festive Delivery Rush (+35% Q4 spike)',
  historicalPoints: [
    { period: 'Q1', demand: 76, sales: 3800, price: 1449000, competitorPrice: 1699000 },
    { period: 'Q2', demand: 82, sales: 4900, price: 1449000, competitorPrice: 1649000 },
    { period: 'Q3', demand: 88, sales: 6200, price: 1429000, competitorPrice: 1599000 },
    { period: 'Q4', demand: 93, sales: 7800, price: 1429000, competitorPrice: 1599000 },
  ],
  projectedPoints: [
    { period: 'Q1 (Est)', demand: 95, sales: 8900, price: 1429000, competitorPrice: 1580000, projected: true },
    { period: 'Q2 (Est)', demand: 97, sales: 10100, price: 1429000, competitorPrice: 1560000, projected: true },
    { period: 'Q3 (Est)', demand: 99, sales: 11400, price: 1429000, competitorPrice: 1550000, projected: true },
  ],
  aiDemandInterpretation:
    'Tata Nexon EV commands over 68% market share in India’s passenger electric vehicle category. Quarterly deliveries climbed 105% annualized from 3,800 to 7,800 units, demonstrating undisputed segment leadership.',
};

export const AUTOMOTIVE_DEMO_MARKET_VALUE: MarketValueAnalysis = {
  productPrice: 1449000,
  averageMarketPrice: 1649000,
  minPrice: 1399000,
  maxPrice: 1999000,
  pricePositionPct: -12.1,
  pricePositionLabel: 'Competitive',
  currencySymbol: '₹',
  elasticityAssessment:
    'Tata Nexon EV is priced ₹2,00,000 (12.1%) below rival electric SUVs (₹14.49 Lakh vs ₹16.49 Lakh benchmark), capturing mass consumer affordability while maintaining positive operating margins.',
  historicalPrices: [
    { period: 'Q1', price: 1449000, competitorAvg: 1699000 },
    { period: 'Q2', price: 1449000, competitorAvg: 1649000 },
    { period: 'Q3', price: 1429000, competitorAvg: 1599000 },
    { period: 'Q4', price: 1429000, competitorAvg: 1599000 },
  ],
};

export const AUTOMOTIVE_DEMO_COMPETITORS: CompetitorIntelligence = {
  marketLeader: 'Tata Nexon EV (Our Vehicle)',
  aiCompetitorSummary:
    'Tata Nexon EV dominates Indian roads with over 68% EV market share and ₹2.5 Lakh lower price than Mahindra XUV400, supported by Tata Power’s extensive fast-charging network across Indian national highways.',
  opportunityNiche: 'All-wheel drive dual-motor flagship and fleet subscription leasing packages.',
  competitors: [
    {
      name: 'Tata Nexon EV (Our Vehicle)',
      price: 1449000,
      rating: 4.5,
      reviewsCount: 14500,
      demandScore: 93,
      sentimentScore: 88,
      marketPosition: 'Undisputed Market Leader (68% Share)',
      strengths: '5-Star Bharat NCAP safety, ₹14.49L entry price, Tata Power charging ecosystem',
      weaknesses: 'Service center appointment delays in tier-2 cities',
      isMainProduct: true,
    },
    {
      name: 'Mahindra XUV400 Pro',
      price: 1699000,
      rating: 4.3,
      reviewsCount: 8500,
      demandScore: 81,
      sentimentScore: 78,
      marketPosition: 'Direct Domestic Competitor',
      strengths: 'Longer wheelbase, spacious rear legroom',
      weaknesses: '₹2.5L price premium, dated interior dashboard layout',
    },
    {
      name: 'MG ZS EV Executive',
      price: 1899000,
      rating: 4.5,
      reviewsCount: 9200,
      demandScore: 83,
      sentimentScore: 82,
      marketPosition: 'Premium Segment Challenger',
      strengths: 'Panoramic sunroof, plush interior materials',
      weaknesses: '31% price premium over Nexon EV',
    },
    {
      name: 'Citroen eC3 Live',
      price: 1199000,
      rating: 3.9,
      reviewsCount: 6100,
      demandScore: 71,
      sentimentScore: 68,
      marketPosition: 'Budget Fleet Entry',
      strengths: 'Cheapest electric crossover in India',
      weaknesses: 'No fast DC charging as standard, basic cabin finish',
    },
  ],
};

export const AUTOMOTIVE_DEMO_SUCCESS_SCORE: ProductSuccessScore = {
  overallScore: 91,
  classification: 'High Potential',
  confidenceScore: 94,
  breakdown: {
    customerSentiment: 88,
    demand: 93,
    competition: 76,
    pricing: 94,
    marketGrowth: 96,
    productQuality: 90,
  },
  aiVerdict:
    'Tata Nexon EV represents India’s gold standard in commercial EV transition (91/100). Verified Vahan registration data confirms persistent delivery growth (+26% QoQ) and unmatched customer advocacy (88% positive sentiment). Prioritizing dedicated EV service bays at dealerships will safeguard Tata’s formidable market moat against upcoming EV launches.',
  keyDrivers: [
    'Holds ~68% share of India’s electric passenger car market',
    'Aggressive ₹14,49,000 price point hits the aspirational Indian family budget',
    'Running cost of ₹1.10/km delivers immediate monthly household budget relief',
    'Bharat NCAP 5-Star crash safety rating builds deep generational trust in India',
  ],
  keyRisks: [
    'Real-world highway range disparity during harsh Indian summers (45°C+ heat)',
    'Dealership service technician bandwidth in high-volume cities like Pune, Bangalore, and Delhi',
    'Upcoming electric SUV launches from Hyundai, Maruti Suzuki, and Mahindra',
  ],
  recommendedAction:
    'Roll out software updates with refined real-world highway range prediction algorithms and launch dedicated "Express EV Service" bays across major metro dealerships.',
  uncertaintyDisclaimer:
    'Based on synthetic demonstration data modeled on Indian automotive Vahan registrations and owner reviews.',
};
