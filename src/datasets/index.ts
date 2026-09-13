import { Industry } from '../types';

export interface DemoConfig {
  id: string;
  name: string;
  industry: Industry;
  badge: string;
  badgeColor: 'amber' | 'sky' | 'emerald' | 'indigo' | 'rose' | 'purple';
  description: string;
  iconName: 'Droplets' | 'Headphones' | 'Car' | 'ShoppingBag' | 'HeartPulse' | 'CreditCard';
  datasetFileName: string;
  rawData: Record<string, any>[];
  cleaningReport: any;
  demandIntel: any;
  marketValue: any;
  competitorIntel: any;
  successScore: any;
  reviewIntel?: any;
  stats: any[];
  correlations: any[];
}

import {
  OIL_DEMO_RAW_DATA,
  OIL_DEMO_CLEANING_REPORT,
  OIL_DEMO_DEMAND,
  OIL_DEMO_MARKET_VALUE,
  OIL_DEMO_COMPETITORS,
  OIL_DEMO_SUCCESS_SCORE,
} from './oilIndustryDemo';

import {
  EARBUDS_DEMO_RAW_DATA,
  EARBUDS_DEMO_CLEANING_REPORT,
  EARBUDS_DEMO_REVIEWS,
  EARBUDS_DEMO_DEMAND,
  EARBUDS_DEMO_MARKET_VALUE,
  EARBUDS_DEMO_COMPETITORS,
  EARBUDS_DEMO_SUCCESS_SCORE,
} from './earbudsDemo';

import {
  AUTOMOTIVE_DEMO_RAW_DATA,
  AUTOMOTIVE_DEMO_CLEANING_REPORT,
  AUTOMOTIVE_DEMO_REVIEWS,
  AUTOMOTIVE_DEMO_DEMAND,
  AUTOMOTIVE_DEMO_MARKET_VALUE,
  AUTOMOTIVE_DEMO_COMPETITORS,
  AUTOMOTIVE_DEMO_SUCCESS_SCORE,
} from './automotiveDemo';

import {
  FMCG_DEMO_RAW_DATA,
  FMCG_DEMO_CLEANING_REPORT,
  FMCG_DEMO_REVIEWS,
  FMCG_DEMO_DEMAND,
  FMCG_DEMO_MARKET_VALUE,
  FMCG_DEMO_COMPETITORS,
  FMCG_DEMO_SUCCESS_SCORE,
} from './fmcgDemo';

import {
  HEALTHCARE_DEMO_RAW_DATA,
  HEALTHCARE_DEMO_CLEANING_REPORT,
  HEALTHCARE_DEMO_REVIEWS,
  HEALTHCARE_DEMO_DEMAND,
  HEALTHCARE_DEMO_MARKET_VALUE,
  HEALTHCARE_DEMO_COMPETITORS,
  HEALTHCARE_DEMO_SUCCESS_SCORE,
} from './healthcareDemo';

import {
  FINTECH_DEMO_RAW_DATA,
  FINTECH_DEMO_CLEANING_REPORT,
  FINTECH_DEMO_REVIEWS,
  FINTECH_DEMO_DEMAND,
  FINTECH_DEMO_MARKET_VALUE,
  FINTECH_DEMO_COMPETITORS,
  FINTECH_DEMO_SUCCESS_SCORE,
} from './fintechDemo';

import { StatsEngine } from '../engine/statsEngine';

export const ALL_DEMOS: DemoConfig[] = [
  {
    id: 'earbuds',
    name: 'boAt Airdopes 141 True Wireless',
    industry: 'Electronics',
    badge: 'Indian Consumer Tech',
    badgeColor: 'sky',
    description: '25,000 Amazon & Flipkart customer reviews, signature deep bass vs street traffic call microphone complaints, and ₹1,299 price disruption.',
    iconName: 'Headphones',
    datasetFileName: 'boAt_Airdopes_141_Amazon_Flipkart.csv',
    rawData: EARBUDS_DEMO_RAW_DATA,
    cleaningReport: EARBUDS_DEMO_CLEANING_REPORT,
    demandIntel: EARBUDS_DEMO_DEMAND,
    marketValue: EARBUDS_DEMO_MARKET_VALUE,
    competitorIntel: EARBUDS_DEMO_COMPETITORS,
    successScore: EARBUDS_DEMO_SUCCESS_SCORE,
    reviewIntel: EARBUDS_DEMO_REVIEWS,
    stats: [
      StatsEngine.computeDescriptiveStats([1299, 1349, 1399, 1299, 1299, 1299], 'Price'),
      StatsEngine.computeDescriptiveStats([68, 74, 80, 84, 86, 88], 'Demand'),
      StatsEngine.computeDescriptiveStats([4.2, 4.1, 4.3, 4.2, 4.4, 4.2], 'Rating'),
    ],
    correlations: StatsEngine.computeCorrelationMatrix(EARBUDS_DEMO_DEMAND.historicalPoints, ['demand', 'reviews', 'price']),
  },
  {
    id: 'automotive',
    name: 'Tata Nexon EV (Empowered Plus)',
    industry: 'Automobile',
    badge: 'India’s #1 Electric SUV',
    badgeColor: 'emerald',
    description: 'Official Vahan registrations scaling from 3,800 to 7,800 units/Qtr, 5-Star Bharat NCAP safety, ₹1.10/km running cost vs summer AC highway range.',
    iconName: 'Car',
    datasetFileName: 'Tata_Nexon_EV_Vahan_Sales.csv',
    rawData: AUTOMOTIVE_DEMO_RAW_DATA,
    cleaningReport: AUTOMOTIVE_DEMO_CLEANING_REPORT,
    demandIntel: AUTOMOTIVE_DEMO_DEMAND,
    marketValue: AUTOMOTIVE_DEMO_MARKET_VALUE,
    competitorIntel: AUTOMOTIVE_DEMO_COMPETITORS,
    successScore: AUTOMOTIVE_DEMO_SUCCESS_SCORE,
    reviewIntel: AUTOMOTIVE_DEMO_REVIEWS,
    stats: [
      StatsEngine.computeDescriptiveStats(AUTOMOTIVE_DEMO_RAW_DATA.map((r) => r.Price), 'Price'),
      StatsEngine.computeDescriptiveStats(AUTOMOTIVE_DEMO_RAW_DATA.map((r) => r.Units_Sold), 'Units_Sold'),
      StatsEngine.computeDescriptiveStats(AUTOMOTIVE_DEMO_RAW_DATA.map((r) => r.Customer_Rating), 'Customer_Rating'),
    ],
    correlations: StatsEngine.computeCorrelationMatrix(AUTOMOTIVE_DEMO_RAW_DATA, ['Units_Sold', 'Price', 'Competitor_Price', 'Customer_Rating']),
  },
  {
    id: 'fmcg',
    name: 'Tata Tea Premium ("Desh Ki Chai")',
    industry: 'FMCG',
    badge: 'Indian Household Chai',
    badgeColor: 'amber',
    description: 'Weekly Kirana and quick-commerce (Blinkit/Zepto) sales growing to 22,400 cases, 66% repeat rate, signature kadak aroma vs monsoon packaging moisture.',
    iconName: 'ShoppingBag',
    datasetFileName: 'Tata_Tea_Premium_DeshKiChai.csv',
    rawData: FMCG_DEMO_RAW_DATA,
    cleaningReport: FMCG_DEMO_CLEANING_REPORT,
    demandIntel: FMCG_DEMO_DEMAND,
    marketValue: FMCG_DEMO_MARKET_VALUE,
    competitorIntel: FMCG_DEMO_COMPETITORS,
    successScore: FMCG_DEMO_SUCCESS_SCORE,
    reviewIntel: FMCG_DEMO_REVIEWS,
    stats: [
      StatsEngine.computeDescriptiveStats(FMCG_DEMO_RAW_DATA.map((r) => r.Kirana_Cases_Sold), 'Kirana_Cases_Sold'),
      StatsEngine.computeDescriptiveStats(FMCG_DEMO_RAW_DATA.map((r) => r.Retail_Price), 'Retail_Price'),
      StatsEngine.computeDescriptiveStats(FMCG_DEMO_RAW_DATA.map((r) => r.Repeat_Purchase_Pct), 'Repeat_Purchase_Pct'),
    ],
    correlations: StatsEngine.computeCorrelationMatrix(FMCG_DEMO_RAW_DATA, ['Kirana_Cases_Sold', 'Revenue', 'Retail_Price', 'Repeat_Purchase_Pct']),
  },
  {
    id: 'healthcare',
    name: 'Himalaya Purifying Neem Face Wash',
    industry: 'Healthcare',
    badge: 'Ayurvedic Skincare',
    badgeColor: 'rose',
    description: '35,000 Amazon, Flipkart & Nykaa reviews, Ayurvedic pimple prevention and ₹185 price vs North Indian winter skin dryness feedback.',
    iconName: 'HeartPulse',
    datasetFileName: 'Himalaya_Neem_FaceWash_Nykaa_Amazon.csv',
    rawData: HEALTHCARE_DEMO_RAW_DATA,
    cleaningReport: HEALTHCARE_DEMO_CLEANING_REPORT,
    demandIntel: HEALTHCARE_DEMO_DEMAND,
    marketValue: HEALTHCARE_DEMO_MARKET_VALUE,
    competitorIntel: HEALTHCARE_DEMO_COMPETITORS,
    successScore: HEALTHCARE_DEMO_SUCCESS_SCORE,
    reviewIntel: HEALTHCARE_DEMO_REVIEWS,
    stats: [
      StatsEngine.computeDescriptiveStats(HEALTHCARE_DEMO_RAW_DATA.map((r) => r.Retail_Units_K), 'Retail_Units_K'),
      StatsEngine.computeDescriptiveStats(HEALTHCARE_DEMO_RAW_DATA.map((r) => r.Retail_Price), 'Retail_Price'),
      StatsEngine.computeDescriptiveStats(HEALTHCARE_DEMO_RAW_DATA.map((r) => r.Pimple_Reduction_Pct), 'Pimple_Reduction_Pct'),
    ],
    correlations: StatsEngine.computeCorrelationMatrix(HEALTHCARE_DEMO_RAW_DATA, ['Retail_Units_K', 'Revenue', 'Retail_Price', 'Comp_Price']),
  },
  {
    id: 'fintech',
    name: 'HDFC Bank Millennia Credit Card',
    industry: 'Banking',
    badge: 'India’s #1 Cashback Card',
    badgeColor: 'indigo',
    description: '₹265.8 Cr monthly swipe volume, 5% direct cashback on Amazon, Flipkart, Swiggy, Zomato vs ₹1,000 monthly cashback capping critique.',
    iconName: 'CreditCard',
    datasetFileName: 'HDFC_Millennia_Card_Swipes.csv',
    rawData: FINTECH_DEMO_RAW_DATA,
    cleaningReport: FINTECH_DEMO_CLEANING_REPORT,
    demandIntel: FINTECH_DEMO_DEMAND,
    marketValue: FINTECH_DEMO_MARKET_VALUE,
    competitorIntel: FINTECH_DEMO_COMPETITORS,
    successScore: FINTECH_DEMO_SUCCESS_SCORE,
    reviewIntel: FINTECH_DEMO_REVIEWS,
    stats: [
      StatsEngine.computeDescriptiveStats(FINTECH_DEMO_RAW_DATA.map((r) => r.Active_Cardholders_K), 'Active_Cardholders_K'),
      StatsEngine.computeDescriptiveStats(FINTECH_DEMO_RAW_DATA.map((r) => r.GMV_Crores), 'GMV_Crores'),
      StatsEngine.computeDescriptiveStats(FINTECH_DEMO_RAW_DATA.map((r) => r.Default_Rate_Pct), 'Default_Rate_Pct'),
    ],
    correlations: StatsEngine.computeCorrelationMatrix(FINTECH_DEMO_RAW_DATA, ['Active_Cardholders_K', 'GMV_Crores', 'Annual_Fee', 'Default_Rate_Pct']),
  },
  {
    id: 'oil',
    name: 'Indian Oil Corporation (IOCL) Crude Basket',
    industry: 'Oil & Gas',
    badge: 'National Energy PSU',
    badgeColor: 'amber',
    description: 'Indian domestic crude basket pricing (₹6,480/bbl), Panipat/Mathura refinery throughput, national highway diesel & petrol demand tracking.',
    iconName: 'Droplets',
    datasetFileName: 'IOCL_Domestic_Crude_PPAC.csv',
    rawData: OIL_DEMO_RAW_DATA,
    cleaningReport: OIL_DEMO_CLEANING_REPORT,
    demandIntel: OIL_DEMO_DEMAND,
    marketValue: OIL_DEMO_MARKET_VALUE,
    competitorIntel: OIL_DEMO_COMPETITORS,
    successScore: OIL_DEMO_SUCCESS_SCORE,
    reviewIntel: undefined,
    stats: [
      StatsEngine.computeDescriptiveStats(OIL_DEMO_RAW_DATA.map((r) => r.Price), 'Price'),
      StatsEngine.computeDescriptiveStats(OIL_DEMO_RAW_DATA.map((r) => r.Demand), 'Demand'),
      StatsEngine.computeDescriptiveStats(OIL_DEMO_RAW_DATA.map((r) => r.Sales), 'Sales'),
      StatsEngine.computeDescriptiveStats(OIL_DEMO_RAW_DATA.map((r) => r.Production), 'Production'),
    ],
    correlations: StatsEngine.computeCorrelationMatrix(OIL_DEMO_RAW_DATA, ['Price', 'Demand', 'Sales', 'Production']),
  },
];
