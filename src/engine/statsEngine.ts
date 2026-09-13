import { CorrelationPair, DescriptiveStats } from '../types';

export class StatsEngine {
  static computeDescriptiveStats(values: number[], colName: string): DescriptiveStats {
    const valid = values.filter((v) => !isNaN(v) && v !== null && v !== undefined);
    if (valid.length === 0) {
      return {
        column: colName,
        count: 0,
        mean: 0,
        median: 0,
        mode: 0,
        min: 0,
        max: 0,
        stdDev: 0,
        variance: 0,
        p25: 0,
        p50: 0,
        p75: 0,
        p90: 0,
        iqr: 0,
      };
    }

    const n = valid.length;
    const sorted = [...valid].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, v) => acc + v, 0);
    const mean = Number((sum / n).toFixed(2));

    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? sorted[mid] : Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2));

    // Mode
    const freq: Record<number, number> = {};
    let maxFreq = 0;
    let mode = sorted[0];
    for (const v of sorted) {
      freq[v] = (freq[v] || 0) + 1;
      if (freq[v] > maxFreq) {
        maxFreq = freq[v];
        mode = v;
      }
    }

    const min = sorted[0];
    const max = sorted[n - 1];

    // Variance & StdDev
    const sqDiffSum = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
    const variance = Number((sqDiffSum / (n > 1 ? n - 1 : 1)).toFixed(2));
    const stdDev = Number(Math.sqrt(variance).toFixed(2));

    // Percentiles
    const getPercentile = (p: number) => {
      const idx = (p / 100) * (n - 1);
      const lower = Math.floor(idx);
      const upper = Math.ceil(idx);
      const weight = idx - lower;
      return Number((sorted[lower] * (1 - weight) + sorted[upper] * weight).toFixed(2));
    };

    const p25 = getPercentile(25);
    const p50 = median;
    const p75 = getPercentile(75);
    const p90 = getPercentile(90);
    const iqr = Number((p75 - p25).toFixed(2));

    return {
      column: colName,
      count: n,
      mean,
      median,
      mode,
      min,
      max,
      stdDev,
      variance,
      p25,
      p50,
      p75,
      p90,
      iqr,
    };
  }

  static computeCorrelationMatrix(data: Record<string, any>[], numericCols: string[]): CorrelationPair[] {
    const pairs: CorrelationPair[] = [];
    if (numericCols.length < 2 || data.length < 2) return pairs;

    for (let i = 0; i < numericCols.length; i++) {
      for (let j = i + 1; j < numericCols.length; j++) {
        const col1 = numericCols[i];
        const col2 = numericCols[j];
        const r = this.calculatePearson(data, col1, col2);
        if (!isNaN(r)) {
          let strength: CorrelationPair['strength'] = 'Weak / None';
          if (r >= 0.7) strength = 'Strong Positive';
          else if (r >= 0.35) strength = 'Moderate Positive';
          else if (r <= -0.7) strength = 'Strong Negative';
          else if (r <= -0.35) strength = 'Moderate Negative';

          pairs.push({
            col1,
            col2,
            correlation: Number(r.toFixed(3)),
            strength,
          });
        }
      }
    }

    return pairs.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  }

  private static calculatePearson(data: Record<string, any>[], col1: string, col2: string): number {
    const xVals: number[] = [];
    const yVals: number[] = [];

    for (const row of data) {
      const x = Number(row[col1]);
      const y = Number(row[col2]);
      if (!isNaN(x) && !isNaN(y)) {
        xVals.push(x);
        yVals.push(y);
      }
    }

    const n = xVals.length;
    if (n < 2) return 0;

    const sumX = xVals.reduce((a, b) => a + b, 0);
    const sumY = yVals.reduce((a, b) => a + b, 0);
    const sumXY = xVals.reduce((acc, x, idx) => acc + x * yVals[idx], 0);
    const sumX2 = xVals.reduce((acc, x) => acc + x * x, 0);
    const sumY2 = yVals.reduce((acc, y) => acc + y * y, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) return 0;
    return numerator / denominator;
  }

  static calculateLinearSlope(yVals: number[]): { slope: number; trend: 'increasing' | 'stable' | 'declining' } {
    const n = yVals.length;
    if (n < 2) return { slope: 0, trend: 'stable' };
    const xVals = Array.from({ length: n }, (_, i) => i);
    const meanX = (n - 1) / 2;
    const meanY = yVals.reduce((a, b) => a + b, 0) / n;

    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
      num += (xVals[i] - meanX) * (yVals[i] - meanY);
      den += Math.pow(xVals[i] - meanX, 2);
    }
    const slope = den !== 0 ? num / den : 0;
    let trend: 'increasing' | 'stable' | 'declining' = 'stable';
    if (slope > 0.5) trend = 'increasing';
    else if (slope < -0.5) trend = 'declining';
    return { slope: Number(slope.toFixed(2)), trend };
  }
}
