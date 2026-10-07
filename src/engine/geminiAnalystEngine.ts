import { ChatMessage } from '../types';
import { AnalystContext } from './aiAnalystEngine';

export class GeminiAnalystEngine {
  private static STORAGE_KEY = 'yuktivya_gemini_api_key';

  public static getApiKey(): string {
    try {
      return sessionStorage.getItem(this.STORAGE_KEY) || '';
    } catch {
      return '';
    }
  }

  public static setApiKey(key: string): void {
    try {
      if (!key.trim()) {
        sessionStorage.removeItem(this.STORAGE_KEY);
      } else {
        sessionStorage.setItem(this.STORAGE_KEY, key.trim());
      }
    } catch {
      // Storage unavailable
    }
  }

  public static hasApiKey(): boolean {
    return Boolean(this.getApiKey());
  }

  /**
   * Queries Google Gemini Generative AI grounded with structured analytical context
   */
  public static async answerQueryWithGemini(
    query: string,
    ctx: AnalystContext,
    conversationHistory: ChatMessage[] = []
  ): Promise<ChatMessage> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key not found. Please provide an API key in settings.');
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const id = `gemini_${Date.now()}`;

    // System prompt grounding Gemini in Indian business context & computed numbers
    const systemInstruction = `You are Yuktivya AI, an elite Indian Market Intelligence Analyst & Commercial Strategy Advisor.
You are analyzing the following product and verified statistical data:
- Product: ${ctx.productName}
- Industry / Sector: ${ctx.industry}
- Success Viability Score: ${ctx.successScore.overallScore}/100 (${ctx.successScore.classification}, confidence: ${ctx.successScore.confidenceScore}%)
- Demand Velocity Score: ${ctx.demandIntel.score}/100 (${ctx.demandIntel.demandTrend} trend, +${ctx.demandIntel.growthRatePct}%)
- Pricing: ${ctx.marketValue.currencySymbol}${ctx.marketValue.productPrice.toLocaleString()} (Position: ${ctx.marketValue.pricePositionLabel}, ${Math.abs(ctx.marketValue.pricePositionPct)}% ${ctx.marketValue.pricePositionPct <= 0 ? 'below' : 'above'} market benchmark of ${ctx.marketValue.currencySymbol}${ctx.marketValue.averageMarketPrice.toLocaleString()})
- Customer Sentiment: ${ctx.sentimentIntel ? `${ctx.sentimentIntel.metrics.positivePct}% Positive, avg rating ${ctx.sentimentIntel.metrics.averageRating}/5` : 'No direct review signals'}
- Data Quality Score: ${ctx.cleaningReport.dataQualityScore}/100 (Grade ${ctx.cleaningReport.qualityGrade}, ${ctx.cleaningReport.cleanedRowCount} records)
- Top Competitor: ${ctx.competitorIntel.marketLeader}

Guidelines:
1. Always ground your strategic advice directly in the numbers provided above.
2. Provide actionable, concise, high-conviction insights tailored to Indian market realities (Tier-1 vs Tier-2/3, quick commerce e.g. Blinkit/Zepto, INR rupee dynamics, GST considerations).
3. Use formatted markdown with bullet points and bold highlights for readability.
4. Keep tone professional, authoritative, yet entrepreneurial.`;

    // Map recent history (last 4 turns) to Gemini content format
    const contents: any[] = [];

    const recentHistory = conversationHistory.slice(-4);
    for (const msg of recentHistory) {
      if (msg.id === 'welcome') continue;
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: query }],
    });

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemInstruction }],
          },
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1000,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMessage = errorData.error?.message || `HTTP ${response.status} ${response.statusText}`;
        throw new Error(`Gemini API Error: ${errMessage}`);
      }

      const result = await response.json();
      const candidateText =
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No direct response returned from Gemini. Please try again.';

      return {
        id,
        sender: 'assistant',
        text: candidateText,
        timestamp,
        evidence: [
          { metric: 'Engine', value: 'Gemini 2.5 Flash', context: 'Live Neural Generative Analysis' },
          { metric: 'Grounded Signals', value: `${ctx.productName}`, context: `${ctx.industry}` },
        ],
        suggestedFollowUps: [
          'What are the highest risk factors for this launch?',
          'How can we increase operating margin in Tier-2 cities?',
          'What pricing adjustment creates maximum revenue elasticity?',
        ],
      };
    } catch (err: any) {
      throw new Error(err.message || 'Failed to communicate with Gemini API');
    }
  }
}
