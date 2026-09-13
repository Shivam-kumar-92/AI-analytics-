import { MarketValueAnalysis } from '../types';

export class MarketValueModel {
  static analyzePricing(
    productPrice: number,
    competitorPrices: number[],
    currencySymbol = '₹'
  ): MarketValueAnalysis {
    const validPrices = competitorPrices.filter((p) => !isNaN(p) && p > 0);
    const avgMarketPrice =
      validPrices.length > 0
        ? Math.round(validPrices.reduce((a, b) => a + b, 0) / validPrices.length)
        : Math.round(productPrice * 1.08);

    const minPrice = validPrices.length > 0 ? Math.min(...validPrices, productPrice) : productPrice;
    const maxPrice = validPrices.length > 0 ? Math.max(...validPrices, productPrice) : productPrice;

    const diff = productPrice - avgMarketPrice;
    const pricePositionPct = avgMarketPrice > 0 ? Number(((diff / avgMarketPrice) * 100).toFixed(1)) : 0;

    let pricePositionLabel: MarketValueAnalysis['pricePositionLabel'] = 'Competitive';
    if (pricePositionPct <= -15) {
      pricePositionLabel = 'Undervalued';
    } else if (pricePositionPct <= -3) {
      pricePositionLabel = 'Competitive';
    } else if (pricePositionPct <= 5) {
      pricePositionLabel = 'Fairly Priced';
    } else if (pricePositionPct <= 20) {
      pricePositionLabel = 'Premium Priced';
    } else {
      pricePositionLabel = 'Overpriced';
    }

    let elasticityAssessment = '';
    if (pricePositionPct < 0) {
      elasticityAssessment = `Priced ${Math.abs(pricePositionPct)}% below the competitor average (${currencySymbol}${avgMarketPrice.toLocaleString()}). This competitive wedge offers strong consumer conversion elasticity and barrier-to-entry resistance.`;
    } else if (pricePositionPct === 0) {
      elasticityAssessment = `Priced exactly at the industry benchmark (${currencySymbol}${avgMarketPrice.toLocaleString()}). Differentiation relies directly on feature value rather than price incentives.`;
    } else {
      elasticityAssessment = `Priced ${pricePositionPct}% above the market norm (${currencySymbol}${avgMarketPrice.toLocaleString()}). Requires strong brand prestige or superior technical features to justify premium margin.`;
    }

    return {
      productPrice,
      averageMarketPrice: avgMarketPrice,
      minPrice,
      maxPrice,
      pricePositionPct,
      pricePositionLabel,
      currencySymbol,
      elasticityAssessment,
    };
  }
}
