import { ColumnProfile, DataCleaningReport, DetectedColumnType, InferredSchemaMapping } from '../types';

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
      let min: number | undefined = undefined;
      let max: number | undefined = undefined;
      let sum = 0;
      if (numValues.length > 0) {
        min = numValues[0];
        max = numValues[0];
        for (let idx = 0; idx < numValues.length; idx++) {
          const val = numValues[idx];
          if (val < min) min = val;
          if (val > max) max = val;
          sum += val;
        }
      }
      const mean =
        numValues.length > 0
          ? Number((sum / numValues.length).toFixed(2))
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

    // 4. Schema & Header Role Inference (Fuzzy Matching for Amazon, Shopify, Zoho, Tally, Meesho)
    const inferredSchema = this.inferSchemaAndColumns(columns, deduplicatedRows);

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
      inferredSchema,
    };

    return { cleanedData: cleanedRows, report };
  }

  public static inferSchemaAndColumns(
    columns: string[],
    rows: Record<string, any>[]
  ): InferredSchemaMapping {
    const norm = (s: string) => s.toLowerCase().replace(/[\s_\-.]+/g, '');
    const colNorms = columns.map((col) => ({ raw: col, norm: norm(col) }));

    // 1. Detect Source Platform / Format
    let platform: InferredSchemaMapping['platform'] = 'Standard / Generic';
    const allNorms = colNorms.map((c) => c.norm);

    if (allNorms.some((n) => ['asin', 'sellerorderid', 'orderitemid', 'buyersname'].includes(n))) {
      platform = 'Amazon Seller';
    } else if (allNorms.some((n) => ['fsn', 'listingid', 'orderitemid'].includes(n))) {
      platform = 'Flipkart';
    } else if (allNorms.some((n) => ['variantid', 'lineitemquantity', 'shippingprovince', 'fulfillmentstatus'].includes(n))) {
      platform = 'Shopify';
    } else if (allNorms.some((n) => ['catalogid', 'suppliersku', 'suborderno'].includes(n))) {
      platform = 'Meesho';
    } else if (allNorms.some((n) => ['placeofsupply', 'taxablevalue', 'gstrate', 'voucherno', 'ledger'].includes(n))) {
      platform = 'Zoho Books / Tally';
    }

    // Helper for ranked match
    const findBestMatch = (
      exactCandidates: string[],
      substringCandidates: string[]
    ): { col?: string; confidence: 'high' | 'medium' | 'none' } => {
      // Priority 1: Exact normalized match
      for (const target of exactCandidates) {
        const found = colNorms.find((c) => c.norm === target);
        if (found) return { col: found.raw, confidence: 'high' };
      }
      // Priority 2: Substring match
      for (const sub of substringCandidates) {
        const found = colNorms.find((c) => c.norm.includes(sub));
        if (found) return { col: found.raw, confidence: 'medium' };
      }
      return { col: undefined, confidence: 'none' };
    };

    // Product Column
    const prodMatch = findBestMatch(
      ['productname', 'product', 'itemname', 'title', 'producttitle', 'stockitem', 'particulars', 'descriptionofgoods', 'listingtitle', 'item', 'sku', 'model'],
      ['product', 'item', 'title', 'brand', 'model']
    );

    // Price Column
    const priceMatch = findBestMatch(
      ['sellingprice', 'price', 'mrp', 'itemprice', 'unitprice', 'rate', 'listprice', 'taxablevalue', 'amount', 'saleprice', 'finalprice', 'grossamount'],
      ['price', 'rate', 'mrp', 'amount', 'cost']
    );

    // Review Column
    let reviewMatch = findBestMatch(
      ['review', 'reviewtext', 'feedback', 'customerfeedback', 'buyerfeedback', 'comment', 'comments', 'customerremarks', 'reviewbody', 'reviewcontent', 'opinion'],
      ['review', 'feedback', 'comment', 'remark', 'opinion']
    );
    // Value inspection fallback for reviews
    if (!reviewMatch.col && rows.length > 0) {
      for (const col of columns) {
        const sampleStrings = rows.slice(0, 10).map((r) => String(r[col] || '')).filter(Boolean);
        const avgLen = sampleStrings.reduce((acc, s) => acc + s.length, 0) / (sampleStrings.length || 1);
        if (avgLen > 35) {
          reviewMatch = { col, confidence: 'medium' };
          break;
        }
      }
    }

    // Rating Column
    let ratingMatch = findBestMatch(
      ['rating', 'starrating', 'stars', 'score', 'custrating', 'reviewrating', 'overallrating'],
      ['rating', 'stars']
    );
    // Value inspection fallback for ratings
    if (!ratingMatch.col && rows.length > 0) {
      for (const col of columns) {
        const nums = rows.slice(0, 15).map((r) => Number(r[col])).filter((n) => !isNaN(n));
        if (nums.length >= 5 && nums.every((n) => n >= 0 && n <= 5)) {
          ratingMatch = { col, confidence: 'medium' };
          break;
        }
      }
    }

    // Sales Column
    const salesMatch = findBestMatch(
      ['unitssold', 'sales', 'quantity', 'qty', 'orderquantity', 'unitsordered', 'shippedunits', 'billedqty', 'netquantity', 'casessold', 'volume', 'salescount'],
      ['unit', 'quantity', 'qty', 'sales', 'volume']
    );

    // Competitor Price Column
    const compMatch = findBestMatch(
      ['competitorprice', 'compprice', 'marketprice', 'benchmarkprice', 'buyboxprice', 'lowestprice', 'compfee'],
      ['competitor', 'benchmark', 'buybox', 'comp']
    );

    // Regional State Column
    const stateMatch = findBestMatch(
      ['state', 'regionstate', 'customerstate', 'buyerstate', 'placeofsupply', 'shippingstate', 'destinationstate', 'region', 'destination'],
      ['state', 'region', 'supply', 'zone']
    );

    // Currency Detection
    let detectedCurrency = '₹';
    outer: for (const row of rows.slice(0, 25)) {
      for (const val of Object.values(row)) {
        const s = String(val);
        if (s.includes('$')) { detectedCurrency = '$'; break outer; }
        if (s.includes('€')) { detectedCurrency = '€'; break outer; }
        if (s.includes('£')) { detectedCurrency = '£'; break outer; }
        if (s.includes('¥')) { detectedCurrency = '¥'; break outer; }
        if (s.includes('AED')) { detectedCurrency = 'AED'; break outer; }
        if (s.includes('CAD')) { detectedCurrency = 'CAD'; break outer; }
        if (s.includes('₹') || s.includes('Rs') || s.includes('INR')) { detectedCurrency = '₹'; break outer; }
      }
    }

    return {
      platform,
      productColumn: prodMatch.col,
      priceColumn: priceMatch.col,
      reviewColumn: reviewMatch.col,
      ratingColumn: ratingMatch.col,
      salesColumn: salesMatch.col,
      competitorPriceColumn: compMatch.col,
      stateColumn: stateMatch.col,
      currencySymbol: detectedCurrency,
      confidence: {
        product: prodMatch.confidence,
        price: priceMatch.confidence,
        review: reviewMatch.confidence,
        rating: ratingMatch.confidence,
        sales: salesMatch.confidence,
      },
    };
  }

  private static detectColumnType(colName: string, nonNullValues: any[]): DetectedColumnType {
    const lowerName = colName.toLowerCase().replace(/[\s_-]+/g, '');

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
      lowerName.includes('rate') ||
      lowerName.includes('salesamount') ||
      lowerName.includes('taxablevalue') ||
      lowerName.includes('grossamount')
    ) {
      return 'currency';
    }

    if (
      lowerName.includes('review') ||
      lowerName.includes('comment') ||
      lowerName.includes('feedback') ||
      lowerName.includes('text') ||
      lowerName.includes('description') ||
      lowerName.includes('remarks')
    ) {
      return 'review_text';
    }

    if (
      lowerName.includes('date') ||
      lowerName.includes('month') ||
      lowerName.includes('year') ||
      lowerName.includes('timestamp') ||
      lowerName.includes('period') ||
      lowerName.includes('createdat')
    ) {
      return 'date';
    }

    if (
      lowerName.includes('id') ||
      lowerName.includes('uuid') ||
      lowerName.includes('sku') ||
      lowerName.includes('code') ||
      lowerName.includes('asin') ||
      lowerName.includes('fsn')
    ) {
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
