import { ColumnProfile, DataCleaningReport, DetectedColumnType } from '../types';

export class DataCleaner {
  static cleanAndProfile(rawData: Record<string, any>[]): {
    cleanedData: Record<string, any>[];
    report: DataCleaningReport;
  } {
    if (!rawData || rawData.length === 0) {
      return {
        cleanedData: [],
        report: {
          originalRowCount: 0,
          cleanedRowCount: 0,
          totalColumns: 0,
          missingCellsFilled: 0,
          duplicatesRemoved: 0,
          outliersCount: 0,
          dataQualityScore: 0,
          qualityGrade: 'D',
          penalties: ['Empty dataset provided'],
          columnProfiles: [],
        },
      };
    }

    const originalRowCount = rawData.length;
    const columns = Object.keys(rawData[0] || {});
    let duplicatesRemoved = 0;
    let missingCellsFilled = 0;
    let outliersCount = 0;
    const penalties: string[] = [];

    // 1. Deduplication
    const seenRowSignatures = new Set<string>();
    const deduplicatedRows: Record<string, any>[] = [];

    for (const row of rawData) {
      const signature = JSON.stringify(row);
      if (seenRowSignatures.has(signature)) {
        duplicatesRemoved++;
      } else {
        seenRowSignatures.add(signature);
        deduplicatedRows.push({ ...row });
      }
    }

    if (duplicatesRemoved > 0) {
      penalties.push(`Detected & removed ${duplicatesRemoved} duplicate records (-${Math.min(10, duplicatesRemoved * 2)} pts)`);
    }

    // 2. Initial Column Profiling & Type Detection
    const columnProfiles: ColumnProfile[] = columns.map((colName) => {
      const values = deduplicatedRows.map((r) => r[colName]);
      const nonNullValues = values.filter((v) => v !== '' && v !== null && v !== undefined);
      const missingCount = values.length - nonNullValues.length;
      const missingPct = values.length > 0 ? (missingCount / values.length) * 100 : 0;
      const uniqueCount = new Set(nonNullValues).size;
      const detectedType = this.detectColumnType(colName, nonNullValues);

      const numValues = nonNullValues.map(Number).filter((n) => !isNaN(n));
      const min = numValues.length > 0 ? Math.min(...numValues) : undefined;
      const max = numValues.length > 0 ? Math.max(...numValues) : undefined;
      const mean =
        numValues.length > 0
          ? Number((numValues.reduce((a, b) => a + b, 0) / numValues.length).toFixed(2))
          : undefined;

      return {
        name: colName,
        detectedType,
        missingCount,
        missingPct,
        uniqueCount,
        sampleValues: nonNullValues.slice(0, 3),
        min,
        max,
        mean,
        outliersCount: 0,
      };
    });

    // 3. Imputation of Missing Values & Outlier Detection
    const cleanedRows: Record<string, any>[] = [];

    // Calculate column medians / modes for imputation
    const columnImputationValues: Record<string, any> = {};
    for (const profile of columnProfiles) {
      const col = profile.name;
      const nonNull = deduplicatedRows.map((r) => r[col]).filter((v) => v !== '' && v !== null && v !== undefined);

      if (profile.detectedType === 'numeric' || profile.detectedType === 'currency' || profile.detectedType === 'rating') {
        const sorted = nonNull.map(Number).filter((n) => !isNaN(n)).sort((a, b) => a - b);
        if (sorted.length > 0) {
          const mid = Math.floor(sorted.length / 2);
          const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
          columnImputationValues[col] = median;

          // Outlier detection using IQR
          const q1 = sorted[Math.floor(sorted.length * 0.25)];
          const q3 = sorted[Math.floor(sorted.length * 0.75)];
          const iqr = q3 - q1;
          const lowerBound = q1 - 1.5 * iqr;
          const upperBound = q3 + 1.5 * iqr;

          let colOutliers = 0;
          for (const val of sorted) {
            if (val < lowerBound || val > upperBound) {
              colOutliers++;
              outliersCount++;
            }
          }
          profile.outliersCount = colOutliers;
        } else {
          columnImputationValues[col] = 0;
        }
      } else {
        // Mode for categorical / text
        const freq: Record<string, number> = {};
        for (const val of nonNull) {
          const s = String(val);
          freq[s] = (freq[s] || 0) + 1;
        }
        let maxFreq = 0;
        let modeVal = 'Unknown';
        for (const [k, v] of Object.entries(freq)) {
          if (v > maxFreq) {
            maxFreq = v;
            modeVal = k;
          }
        }
        columnImputationValues[col] = modeVal;
      }
    }

    // Apply imputation and clean rows
    for (const row of deduplicatedRows) {
      const cleanedRow: Record<string, any> = {};
      for (const col of columns) {
        let val = row[col];
        if (val === '' || val === null || val === undefined) {
          missingCellsFilled++;
          val = columnImputationValues[col];
        } else {
          const profile = columnProfiles.find((p) => p.name === col);
          if (profile?.detectedType === 'currency' || profile?.detectedType === 'numeric' || profile?.detectedType === 'rating') {
            const parsedNum = Number(String(val).replace(/^[₹$€£\s]+/, '').replace(/,/g, ''));
            if (!isNaN(parsedNum)) {
              val = parsedNum;
            }
          }
        }
        cleanedRow[col] = val;
      }
      cleanedRows.push(cleanedRow);
    }

    if (missingCellsFilled > 0) {
      penalties.push(`Imputed ${missingCellsFilled} missing data points with medians/modes (-${Math.min(15, missingCellsFilled)} pts)`);
    }

    if (outliersCount > 0) {
      penalties.push(`Identified ${outliersCount} statistical outliers using IQR bounds (-${Math.min(10, outliersCount * 2)} pts)`);
    }

    // Calculate Data Quality Score (0 - 100)
    let score = 100;
    const totalCells = originalRowCount * columns.length;
    const missingRatio = totalCells > 0 ? missingCellsFilled / totalCells : 0;
    const duplicateRatio = originalRowCount > 0 ? duplicatesRemoved / originalRowCount : 0;

    score -= Math.round(missingRatio * 40);
    score -= Math.round(duplicateRatio * 20);
    if (outliersCount > originalRowCount * 0.1) score -= 10;
    if (originalRowCount < 10) score -= 15;
    score = Math.max(15, Math.min(100, score));

    let qualityGrade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'A';
    if (score >= 95) qualityGrade = 'A+';
    else if (score >= 85) qualityGrade = 'A';
    else if (score >= 70) qualityGrade = 'B';
    else if (score >= 50) qualityGrade = 'C';
    else qualityGrade = 'D';

    const report: DataCleaningReport = {
      originalRowCount,
      cleanedRowCount: cleanedRows.length,
      totalColumns: columns.length,
      missingCellsFilled,
      duplicatesRemoved,
      outliersCount,
      dataQualityScore: score,
      qualityGrade,
      penalties,
      columnProfiles,
    };

    return { cleanedData: cleanedRows, report };
  }

  private static detectColumnType(colName: string, nonNullValues: any[]): DetectedColumnType {
    const lowerName = colName.toLowerCase();

    // Check header keywords
    if (lowerName.includes('rating') || lowerName.includes('stars') || lowerName.includes('score')) {
      const allBetween1And5 = nonNullValues.every((v) => {
        const n = Number(v);
        return !isNaN(n) && n >= 0 && n <= 10;
      });
      if (allBetween1And5) return 'rating';
    }

    if (
      lowerName.includes('price') ||
      lowerName.includes('cost') ||
      lowerName.includes('mrp') ||
      lowerName.includes('revenue') ||
      lowerName.includes('sales_amount')
    ) {
      return 'currency';
    }

    if (
      lowerName.includes('review') ||
      lowerName.includes('comment') ||
      lowerName.includes('feedback') ||
      lowerName.includes('text') ||
      lowerName.includes('description')
    ) {
      return 'review_text';
    }

    if (
      lowerName.includes('date') ||
      lowerName.includes('month') ||
      lowerName.includes('year') ||
      lowerName.includes('timestamp') ||
      lowerName.includes('period')
    ) {
      return 'date';
    }

    if (lowerName.includes('id') || lowerName.includes('uuid') || lowerName.includes('sku') || lowerName.includes('code')) {
      return 'id';
    }

    // Check value inspection
    if (nonNullValues.length === 0) return 'category';

    const sample = nonNullValues.slice(0, 10);
    const numericCount = sample.filter((v) => !isNaN(Number(v))).length;
    if (numericCount >= sample.length * 0.8) {
      return 'numeric';
    }

    // Check average word length for review text
    const avgWordCount =
      sample.reduce((acc, v) => acc + String(v).split(/\s+/).length, 0) / sample.length;
    if (avgWordCount >= 4) {
      return 'review_text';
    }

    return 'category';
  }
}
