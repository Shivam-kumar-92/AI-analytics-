import { AspectFeature, ReviewIntelligence, SentimentMetrics } from '../types';

interface LexiconWord {
  score: number;
}

const SENTIMENT_LEXICON: Record<string, number> = {
  // Strong positive
  superb: 3,
  excellent: 3,
  amazing: 3,
  outstanding: 3,
  fantastic: 3,
  perfect: 3,
  love: 2.5,
  great: 2,
  good: 1.5,
  best: 2.5,
  awesome: 2.5,
  impressed: 2,
  recommend: 2,
  reliable: 2,
  durable: 2,
  value: 1.5,
  affordable: 1.5,
  smooth: 1.5,
  clear: 1.5,
  premium: 2,
  satisfaction: 2,
  flawless: 3,
  stunning: 2.5,
  crisp: 2,

  // Strong negative
  terrible: -3,
  horrible: -3,
  awful: -3,
  abysmal: -3,
  useless: -3,
  worst: -3,
  broken: -2.5,
  failed: -2.5,
  defective: -2.5,
  bad: -1.5,
  poor: -2,
  disappointed: -2,
  disappointing: -2,
  waste: -2.5,
  overpriced: -2,
  lag: -1.5,
  drained: -2,
  draining: -2,
  complaint: -1.5,
  uncomfortable: -2,
  cheap: -1.5,
  stopped: -2,
  slow: -1.5,
  noisy: -1.5,
  unreliable: -2.5,
  regret: -2.5,
};

const ASPECT_KEYWORDS: Record<string, string[]> = {
  'Battery Life': ['battery', 'charge', 'charging', 'backup', 'drain', 'mah', 'power', 'standby'],
  'Price & Value': ['price', 'value', 'worth', 'cost', 'money', 'affordable', 'expensive', 'cheap', 'budget', 'deal'],
  'Build & Durability': ['build', 'durability', 'plastic', 'metal', 'sturdy', 'fragile', 'broken', 'hinge', 'material', 'solid'],
  'Performance & Sound': ['performance', 'sound', 'audio', 'bass', 'clarity', 'speed', 'fast', 'slow', 'loud', 'treble', 'latency'],
  'Design & Ergonomics': ['design', 'fit', 'comfort', 'comfortable', 'ear', 'look', 'looks', 'compact', 'aesthetic', 'weight', 'size'],
  'Delivery & Packaging': ['delivery', 'package', 'packaging', 'box', 'shipping', 'courier', 'arrived', 'seal'],
  'Customer Support': ['support', 'service', 'warranty', 'replacement', 'refund', 'agent', 'response', 'care'],
};

export class NLPSentimentEngine {
  static analyzeText(text: string): { score: number; label: 'Positive' | 'Negative' | 'Neutral' | 'Mixed' } {
    if (!text || typeof text !== 'string') return { score: 0, label: 'Neutral' };

    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    let totalScore = 0;
    let posCount = 0;
    let negCount = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      let multiplier = 1;

      // Negation check (e.g. "not good", "never works")
      if (i > 0 && ['not', 'never', 'no', 'hardly', 'barely', 'scarcely'].includes(words[i - 1])) {
        multiplier = -1;
      }
      // Intensifier check (e.g. "very good", "extremely slow")
      if (i > 0 && ['very', 'extremely', 'really', 'super', 'highly', 'deeply'].includes(words[i - 1])) {
        multiplier *= 1.5;
      }

      if (SENTIMENT_LEXICON[word] !== undefined) {
        const val = SENTIMENT_LEXICON[word] * multiplier;
        totalScore += val;
        if (val > 0) posCount++;
        if (val < 0) negCount++;
      }
    }

    let label: 'Positive' | 'Negative' | 'Neutral' | 'Mixed' = 'Neutral';
    if (posCount > 0 && negCount > 0 && Math.abs(posCount - negCount) <= 1) {
      label = 'Mixed';
    } else if (totalScore > 0.8) {
      label = 'Positive';
    } else if (totalScore < -0.8) {
      label = 'Negative';
    }

    return { score: totalScore, label };
  }

  static analyzeReviewDataset(
    reviews: { text?: string; rating?: number; summary?: string }[]
  ): ReviewIntelligence {
    const totalReviews = reviews.length;
    let ratingSum = 0;
    let ratingCount = 0;

    const distribution = { star1: 0, star2: 0, star3: 0, star4: 0, star5: 0 };
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    let mixedCount = 0;

    const aspectTallies: Record<
      string,
      { pos: number; neg: number; total: number; sampleQuotes: string[] }
    > = {};

    for (const aspect of Object.keys(ASPECT_KEYWORDS)) {
      aspectTallies[aspect] = { pos: 0, neg: 0, total: 0, sampleQuotes: [] };
    }

    const wordFreq: Record<string, { count: number; sentimentVal: number }> = {};

    for (const r of reviews) {
      const content = (r.text || r.summary || '').toString();
      const rating = Number(r.rating);

      if (!isNaN(rating) && rating >= 1 && rating <= 5) {
        const rounded = Math.min(5, Math.max(1, Math.round(rating)));
        if (rounded === 1) distribution.star1++;
        else if (rounded === 2) distribution.star2++;
        else if (rounded === 3) distribution.star3++;
        else if (rounded === 4) distribution.star4++;
        else if (rounded === 5) distribution.star5++;
        ratingSum += rating;
        ratingCount++;
      }

      const sentiment = this.analyzeText(content);
      // Combine with rating if rating is explicit
      let effectiveLabel = sentiment.label;
      if (!isNaN(rating)) {
        if (rating >= 4) effectiveLabel = 'Positive';
        else if (rating <= 2) effectiveLabel = 'Negative';
        else if (rating === 3) effectiveLabel = sentiment.label === 'Neutral' ? 'Neutral' : sentiment.label;
      }

      if (effectiveLabel === 'Positive') positiveCount++;
      else if (effectiveLabel === 'Negative') negativeCount++;
      else if (effectiveLabel === 'Mixed') mixedCount++;
      else neutralCount++;

      // Check aspects
      const lowerContent = content.toLowerCase();
      for (const [aspect, keywords] of Object.entries(ASPECT_KEYWORDS)) {
        const matches = keywords.some((kw) => lowerContent.includes(kw));
        if (matches) {
          aspectTallies[aspect].total++;
          if (effectiveLabel === 'Positive' || sentiment.score > 0) {
            aspectTallies[aspect].pos++;
          } else if (effectiveLabel === 'Negative' || sentiment.score < 0) {
            aspectTallies[aspect].neg++;
          }
          if (content.length > 20 && aspectTallies[aspect].sampleQuotes.length < 2) {
            aspectTallies[aspect].sampleQuotes.push(content.slice(0, 120) + (content.length > 120 ? '...' : ''));
          }
        }
      }

      // Word frequency
      const words = lowerContent.replace(/[^a-z\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
      for (const w of words) {
        if (!['this', 'that', 'with', 'from', 'have', 'been', 'will', 'product', 'item'].includes(w)) {
          if (!wordFreq[w]) wordFreq[w] = { count: 0, sentimentVal: SENTIMENT_LEXICON[w] || 0 };
          wordFreq[w].count++;
        }
      }
    }

    const avgRating = ratingCount > 0 ? Number((ratingSum / ratingCount).toFixed(2)) : 4.0;
    const baseTotal = totalReviews || 1;

    const starPercentages = {
      star1: Number(((distribution.star1 / baseTotal) * 100).toFixed(1)),
      star2: Number(((distribution.star2 / baseTotal) * 100).toFixed(1)),
      star3: Number(((distribution.star3 / baseTotal) * 100).toFixed(1)),
      star4: Number(((distribution.star4 / baseTotal) * 100).toFixed(1)),
      star5: Number(((distribution.star5 / baseTotal) * 100).toFixed(1)),
    };

    const positivePct = Number(((positiveCount / baseTotal) * 100).toFixed(1));
    const negativePct = Number(((negativeCount / baseTotal) * 100).toFixed(1));
    const neutralPct = Number(((neutralCount / baseTotal) * 100).toFixed(1));
    const mixedPct = Number(((mixedCount / baseTotal) * 100).toFixed(1));

    let overallSentimentLabel = 'Predominantly Positive';
    if (positivePct >= 75) overallSentimentLabel = `${positivePct}% Positive (Very Favorable)`;
    else if (positivePct >= 55) overallSentimentLabel = `${positivePct}% Positive (Favorable)`;
    else if (negativePct >= 40) overallSentimentLabel = `${negativePct}% Negative (Unfavorable)`;
    else overallSentimentLabel = `Mixed / Neutral Sentiment`;

    const metrics: SentimentMetrics = {
      totalReviews,
      averageRating: avgRating,
      ratingDistribution: distribution,
      starPercentages,
      positivePct,
      negativePct,
      neutralPct,
      mixedPct,
      overallSentimentLabel,
    };

    // Calculate aspect features
    const allAspects: AspectFeature[] = Object.entries(aspectTallies)
      .filter(([_, data]) => data.total > 0)
      .map(([name, data]) => {
        const score = data.total > 0 ? Math.round((data.pos / (data.pos + data.neg || 1)) * 100) : 50;
        let category: 'positive' | 'negative' | 'mixed' = 'mixed';
        if (score >= 65) category = 'positive';
        else if (score <= 40) category = 'negative';

        return {
          name,
          category,
          positiveMentions: data.pos,
          negativeMentions: data.neg,
          sentimentScore: score,
          sampleQuotes: data.sampleQuotes,
        };
      });

    const likedFeatures = allAspects
      .filter((a) => a.category === 'positive')
      .sort((a, b) => b.sentimentScore - a.sentimentScore);

    const dislikedFeatures = allAspects
      .filter((a) => a.category === 'negative' || a.category === 'mixed')
      .sort((a, b) => a.sentimentScore - b.sentimentScore);

    // Frequent keywords
    const frequentKeywords = Object.entries(wordFreq)
      .map(([word, data]) => ({
        word,
        count: data.count,
        sentiment: (data.sentimentVal > 0 ? 'pos' : data.sentimentVal < 0 ? 'neg' : 'neu') as 'pos' | 'neg' | 'neu',
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    // AI Executive Summary
    const topLike = likedFeatures[0]?.name || 'overall pricing';
    const topDislike = dislikedFeatures[0]?.name || 'occasional quality variations';
    const aiExecutiveSummary =
      `Based on natural language analysis of ${totalReviews.toLocaleString()} customer feedback records, customers predominantly praise ${topLike.toLowerCase()} (${positivePct}% positive sentiment), while ${topDislike.toLowerCase()} represents the most recurring friction point affecting repeat conversion.`;

    return {
      metrics,
      likedFeatures,
      dislikedFeatures,
      aiExecutiveSummary,
      frequentKeywords,
    };
  }
}
