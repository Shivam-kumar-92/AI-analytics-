import { describe, it, expect } from 'vitest';
import { ALL_DEMOS } from '../../datasets/index';
import { DataCleaner } from '../dataCleaner';
import { StatsEngine } from '../statsEngine';
import { NLPSentimentEngine } from '../nlpSentiment';
import { DemandModel } from '../demandModel';
import { MarketValueModel } from '../marketValueModel';
import { SuccessModel } from '../successModel';
import { AIAnalystEngine, AnalystContext } from '../aiAnalystEngine';
import { DataParser } from '../dataParser';
import { generateSyntheticDataset, SYNTHETIC_SECTORS } from '../syntheticDataGenerator';

describe('Yuktivya AI Analytical Engine Test Suite', () => {
  describe('1. Pre-built Industry Demos', () => {
    it('registers exactly 6 enterprise demos', () => {
      expect(ALL_DEMOS.length).toBe(6);
    });

    for (const demo of ALL_DEMOS) {
      it(`validates ${demo.name} (${demo.industry}) metrics and data integrity`, () => {
        expect(demo.rawData.length).toBeGreaterThan(0);
        expect(demo.cleaningReport.dataQualityScore).toBeGreaterThanOrEqual(0);
        expect(demo.cleaningReport.dataQualityScore).toBeLessThanOrEqual(100);
        expect(demo.demandIntel.score).toBeGreaterThanOrEqual(0);
        expect(demo.demandIntel.score).toBeLessThanOrEqual(100);
        expect(typeof demo.marketValue.productPrice).toBe('number');
        expect(isNaN(demo.marketValue.productPrice)).toBe(false);
        expect(demo.competitorIntel.competitors.length).toBeGreaterThan(0);
        expect(demo.successScore.overallScore).toBeGreaterThanOrEqual(0);
        expect(demo.successScore.overallScore).toBeLessThanOrEqual(100);
        expect(demo.stats.length).toBeGreaterThan(0);
      });
    }
  });

  describe('2. DataCleaner Engine', () => {
    it('deduplicates rows, imputes missing cells, and calculates quality score', () => {
      const messyData = [
        { id: 1, item: 'Test Widget', price: '1200', rating: 4.5, units: 100 },
        { id: 1, item: 'Test Widget', price: '1200', rating: 4.5, units: 100 }, // Duplicate
        { id: 2, item: 'Test Widget 2', price: '', rating: null, units: 50 }, // Missing
        { id: 3, item: 'Test Widget 3', price: '9999999', rating: 1.0, units: 5 }, // Outlier
      ];
      const result = DataCleaner.cleanAndProfile(messyData);
      expect(result.cleanedData.length).toBe(3);
      expect(result.report.duplicatesRemoved).toBe(1);
      expect(result.report.missingCellsFilled).toBeGreaterThan(0);
      expect(result.report.dataQualityScore).toBeGreaterThan(0);
      expect(result.report.dataQualityScore).toBeLessThanOrEqual(100);
    });

    it('gracefully handles empty datasets', () => {
      const result = DataCleaner.cleanAndProfile([]);
      expect(result.cleanedData.length).toBe(0);
      expect(result.report.qualityGrade).toBe('D');
    });
  });

  describe('3. StatsEngine Mathematics & Pearson Correlation', () => {
    it('accurately computes descriptive statistics', () => {
      const stats = StatsEngine.computeDescriptiveStats([10, 20, 30, 40, 50, 60, 70, 80, 90, 100], 'TestMetric');
      expect(stats.count).toBe(10);
      expect(stats.mean).toBe(55);
      expect(stats.median).toBe(55);
      expect(stats.stdDev).toBeGreaterThan(0);
    });

    it('handles empty arrays without divide-by-zero or NaN errors', () => {
      const emptyStats = StatsEngine.computeDescriptiveStats([], 'EmptyMetric');
      expect(emptyStats.count).toBe(0);
      expect(emptyStats.mean).toBe(0);
      expect(emptyStats.stdDev).toBe(0);
    });

    it('computes Pearson correlation matrix accurately', () => {
      const corrData = [
        { x: 1, y: 10, z: 100 },
        { x: 2, y: 20, z: 90 },
        { x: 3, y: 30, z: 80 },
        { x: 4, y: 40, z: 70 },
        { x: 5, y: 50, z: 60 },
      ];
      const correlations = StatsEngine.computeCorrelationMatrix(corrData, ['x', 'y', 'z']);
      const xy = correlations.find((c) => (c.col1 === 'x' && c.col2 === 'y') || (c.col1 === 'y' && c.col2 === 'x'));
      const xz = correlations.find((c) => (c.col1 === 'x' && c.col2 === 'z') || (c.col1 === 'z' && c.col2 === 'x'));
      expect(xy?.correlation).toBe(1);
      expect(xz?.correlation).toBe(-1);
    });
  });

  describe('4. NLPSentimentEngine', () => {
    it('analyzes customer review polarities, star ratings, and aspect features', () => {
      const reviews = [
        { text: 'Superb and fantastic battery life, best quality!', rating: 5 },
        { text: 'Terrible build quality, horrible experience, broke in one day', rating: 1 },
        { text: 'Decent value for money, average sound', rating: 3 },
      ];
      const result = NLPSentimentEngine.analyzeReviewDataset(reviews);
      expect(result.metrics.totalReviews).toBe(3);
      expect(result.metrics.positivePct).toBeGreaterThan(0);
      expect(result.metrics.negativePct).toBeGreaterThan(0);
      expect(result.aiExecutiveSummary.length).toBeGreaterThan(20);
    });
  });

  describe('5. Demand & Pricing Models', () => {
    it('computes demand velocity and projected future points', () => {
      const testData = [{ month: 'Jan', demand: 75 }, { month: 'Feb', demand: 85 }];
      const result = DemandModel.computeDemand(testData, true, false, false);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.historicalPoints.length).toBe(2);
      expect(result.projectedPoints.length).toBe(3);
    });

    it('computes market pricing benchmark and position percentages', () => {
      const result = MarketValueModel.analyzePricing(1299, [1499, 1599, 1399, 1299], '₹');
      expect(result.averageMarketPrice).toBeGreaterThan(0);
      expect(typeof result.pricePositionPct).toBe('number');
      expect(result.pricePositionLabel).toBeDefined();
    });
  });

  describe('6. SuccessModel Scoring', () => {
    it('evaluates weighted product viability', () => {
      const result = SuccessModel.evaluateProductSuccess({
        customerSentiment: 85,
        demand: 82,
        competitionRisk: 45,
        pricingCompetitiveness: 90,
        marketGrowth: 75,
        productQuality: 85,
        datasetSize: 100,
        hasSalesSignals: true,
        hasReviewSignals: true,
      });
      expect(result.overallScore).toBeGreaterThan(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
      expect(result.keyDrivers.length).toBeGreaterThan(0);
      expect(result.aiVerdict.length).toBeGreaterThan(20);
    });
  });

  describe('7. AIAnalystEngine QA', () => {
    const dummyCtx: AnalystContext = {
      productName: 'boAt Airdopes 141',
      industry: 'Electronics',
      cleaningReport: ALL_DEMOS[0].cleaningReport,
      stats: ALL_DEMOS[0].stats,
      sentimentIntel: ALL_DEMOS[0].reviewIntel,
      demandIntel: ALL_DEMOS[0].demandIntel,
      marketValue: ALL_DEMOS[0].marketValue,
      successScore: ALL_DEMOS[0].successScore,
      competitorIntel: ALL_DEMOS[0].competitorIntel,
      isSyntheticDemo: true,
    };

    const questions = [
      'Is this product worth launching?',
      'Why are customers unhappy?',
      'What is the biggest problem with this product?',
      'Which competitor is strongest?',
      'What price should we target?',
      'Is demand increasing?',
      'Summarize this dataset.',
      'Find unusual patterns in this data.',
      'Give me a business recommendation.',
    ];

    for (const q of questions) {
      it(`answers: "${q}"`, () => {
        const answer = AIAnalystEngine.answerQuery(q, dummyCtx);
        expect(answer.text.length).toBeGreaterThan(20);
        expect(answer.sender).toBe('assistant');
      });
    }
  });

  describe('8. Synthetic Data Generator', () => {
    for (const sector of SYNTHETIC_SECTORS) {
      it(`generates dataset for ${sector.name}`, () => {
        const generated = generateSyntheticDataset(sector.id, 50);
        expect(generated.data.length).toBe(50);
        expect(Object.keys(generated.data[0]).length).toBeGreaterThanOrEqual(5);
      });
    }
  });

  describe('9. DataParser', () => {
    it('parses CSV records', () => {
      const csv = `Product,Price,Rating\nWidget A,100,4.5\nWidget B,150,4.0`;
      const parsed = DataParser.parseCSV(csv, 'test.csv');
      expect(parsed.data.length).toBe(2);
      expect(parsed.data[0].Product).toBe('Widget A');
    });

    it('parses JSON arrays', () => {
      const json = JSON.stringify([{ item: 'Phone', cost: 15000 }, { item: 'Laptop', cost: 55000 }]);
      const parsed = DataParser.parseJSON(json, 'test.json');
      expect(parsed.data.length).toBe(2);
    });
  });
});
