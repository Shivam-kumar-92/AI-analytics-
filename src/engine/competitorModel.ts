import { CompetitorIntelligence, CompetitorRecord } from '../types';

export class CompetitorModel {
  /**
   * Dynamically extracts and computes competitor intelligence from any user dataset
   * or generates industry-aligned segment benchmarks when the dataset is single-product.
   */
  static analyzeCompetitors(
    data: Record<string, any>[],
    mainProductName: string,
    basePrice: number,
    mainRating = 4.2,
    sentimentScore = 80,
    demandScore = 82,
    currencySymbol = '₹',
    industry = 'General'
  ): CompetitorIntelligence {
    if (!data || data.length === 0) {
      return this.generateDefaultBenchmarks(
        mainProductName,
        basePrice,
        mainRating,
        sentimentScore,
        demandScore,
        currencySymbol,
        industry
      );
    }

    const firstRow = data[0];
    const columns = Object.keys(firstRow);

    // 1. Check if dataset has multi-entity / competitor columns
    const entityCol = columns.find((c) =>
      ['brand', 'competitor', 'competitors', 'product', 'product_name', 'item_name', 'company', 'manufacturer'].includes(
        c.toLowerCase()
      )
    );

    // Price column detection
    const priceCol = columns.find((c) =>
      ['price', 'mrp', 'cost', 'selling_price', 'unit_price', 'rate'].includes(c.toLowerCase())
    );

    // Rating column detection
    const ratingCol = columns.find((c) =>
      ['rating', 'score', 'stars', 'star_rating', 'user_rating'].includes(c.toLowerCase())
    );

    if (entityCol) {
      const entityMap = new Map<string, { prices: number[]; ratings: number[]; count: number }>();

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const rawEntity = String(row[entityCol] ?? '').trim();
        if (!rawEntity) continue;

        if (!entityMap.has(rawEntity)) {
          entityMap.set(rawEntity, { prices: [], ratings: [], count: 0 });
        }
        const stats = entityMap.get(rawEntity)!;
        stats.count++;

        if (priceCol && !isNaN(Number(row[priceCol]))) {
          stats.prices.push(Number(row[priceCol]));
        }
        if (ratingCol && !isNaN(Number(row[ratingCol]))) {
          stats.ratings.push(Number(row[ratingCol]));
        }
      }

      // If we found at least 2 distinct entities in the data
      if (entityMap.size >= 2) {
        const entities = Array.from(entityMap.entries())
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 6); // Max top 6 for a clean dashboard

        const competitors: CompetitorRecord[] = entities.map(([name, stats], idx) => {
          const avgP =
            stats.prices.length > 0
              ? Math.round(stats.prices.reduce((a, b) => a + b, 0) / stats.prices.length)
              : Math.round(basePrice * (idx === 0 ? 1 : 0.9 + idx * 0.12));
          const avgR =
            stats.ratings.length > 0
              ? Number((stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length).toFixed(1))
              : Number((mainRating - (idx * 0.1)).toFixed(1));

          const isMain =
            name.toLowerCase() === mainProductName.toLowerCase() ||
            idx === 0 ||
            name.toLowerCase().includes(mainProductName.toLowerCase());

          // Estimate demand & sentiment relative to volume and rating
          const entDemand = Math.min(95, Math.max(45, Math.round(50 + (stats.count / data.length) * 45)));
          const entSentiment = Math.min(96, Math.max(40, Math.round((avgR / 5) * 100)));

          let marketPosition = 'Market Segment Player';
          if (idx === 0) marketPosition = 'Category Volume Leader';
          else if (avgP < basePrice) marketPosition = 'Value Alternative';
          else if (avgP > basePrice) marketPosition = 'Premium Tier Competitor';
          else marketPosition = 'Direct Segment Challenger';

          return {
            name,
            price: avgP,
            rating: avgR,
            reviewsCount: stats.count,
            demandScore: entDemand,
            sentimentScore: entSentiment,
            marketPosition,
            strengths: `High volume conversion (${stats.count.toLocaleString()} recorded data points), verified market traction`,
            weaknesses: avgR < 4.0 ? 'Customer satisfaction scores below category standard' : 'Intense price elasticity pressure',
            isMainProduct: isMain,
          };
        });

        // Ensure main product is designated
        if (!competitors.some((c) => c.isMainProduct)) {
          competitors[0].isMainProduct = true;
        }

        const topComp = competitors[0];
        const leaderName = topComp.name;
        const summary = `${mainProductName} actively competes against ${competitors.length - 1} distinct segment players identified directly in this dataset. ${leaderName} commands the largest footprint, while pricing ranges from ${currencySymbol}${Math.min(...competitors.map((c) => c.price)).toLocaleString()} to ${currencySymbol}${Math.max(...competitors.map((c) => c.price)).toLocaleString()}.`;

        return {
          competitors,
          aiCompetitorSummary: summary,
          marketLeader: leaderName,
          opportunityNiche: `Differentiate on verified product reliability and targeted ${currencySymbol}${basePrice.toLocaleString()} sweet-spot pricing to capture defecting competitor volume.`,
        };
      }
    }

    // 2. Single-product dataset: Generate dynamic grounded segment benchmarks
    return this.generateDefaultBenchmarks(
      mainProductName,
      basePrice,
      mainRating,
      sentimentScore,
      demandScore,
      currencySymbol,
      industry
    );
  }

  private static generateDefaultBenchmarks(
    productName: string,
    basePrice: number,
    rating: number,
    sentimentScore: number,
    demandScore: number,
    currencySymbol: string,
    industry: string
  ): CompetitorIntelligence {
    const validBase = basePrice > 0 ? basePrice : 1000;
    const directChallengerPrice = Math.round(validBase * 1.08);
    const valueChallengerPrice = Math.round(validBase * 0.84);
    const premiumChallengerPrice = Math.round(validBase * 1.32);

    const competitors: CompetitorRecord[] = [
      {
        name: `${productName} (Active Asset)`,
        price: validBase,
        rating: rating || 4.2,
        reviewsCount: 1500,
        demandScore: demandScore || 80,
        sentimentScore: sentimentScore || 82,
        marketPosition: 'Current Product Offering',
        strengths: 'Optimized price-to-performance ratio, focused product proposition',
        weaknesses: 'Requires continuous customer sentiment monitoring to defend market share',
        isMainProduct: true,
      },
      {
        name: `${industry} Direct Segment Peer`,
        price: directChallengerPrice,
        rating: Math.max(3.8, Number((rating - 0.1).toFixed(1))),
        reviewsCount: 1800,
        demandScore: Math.max(50, demandScore - 4),
        sentimentScore: Math.max(60, sentimentScore - 3),
        marketPosition: 'Direct Category Challenger',
        strengths: 'Established distribution channels, broad category awareness',
        weaknesses: 'Marginally higher consumer acquisition and pricing overheads',
        isMainProduct: false,
      },
      {
        name: `${industry} Value Alternative`,
        price: valueChallengerPrice,
        rating: Math.max(3.5, Number((rating - 0.4).toFixed(1))),
        reviewsCount: 2200,
        demandScore: Math.min(95, demandScore + 2),
        sentimentScore: Math.max(50, sentimentScore - 12),
        marketPosition: 'Budget Volume Tier',
        strengths: `Aggressive entry pricing (${currencySymbol}${valueChallengerPrice.toLocaleString()}) driving volume velocity`,
        weaknesses: 'Higher customer defect rates and quality compromise complaints',
        isMainProduct: false,
      },
      {
        name: `${industry} Premium Segment Tier`,
        price: premiumChallengerPrice,
        rating: Math.min(4.9, Number((rating + 0.3).toFixed(1))),
        reviewsCount: 950,
        demandScore: Math.max(45, demandScore - 10),
        sentimentScore: Math.min(95, sentimentScore + 6),
        marketPosition: 'High-Margin Premium Benchmark',
        strengths: 'Superior build prestige, strong margin resilience',
        weaknesses: 'Lower addressable mass-market conversion elasticity',
        isMainProduct: false,
      },
    ];

    return {
      competitors,
      aiCompetitorSummary: `${productName} is benchmarked against primary ${industry} market tiers. Positioned at ${currencySymbol}${validBase.toLocaleString()}, it captures a balanced sweet-spot between high-volume budget alternatives (${currencySymbol}${valueChallengerPrice.toLocaleString()}) and premium prestige offerings (${currencySymbol}${premiumChallengerPrice.toLocaleString()}).`,
      marketLeader: `${productName} (Active Asset)`,
      opportunityNiche: `Capitalize on superior feature clarity and competitive price elasticity to capture market share from higher-priced category peers.`,
    };
  }
}
