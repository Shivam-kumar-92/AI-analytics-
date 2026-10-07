/**
 * Synthetic Dataset Generator for Yuktivya AI
 * Empowers users to instantly generate 100 - 1000 rows of industry-realistic Indian market data.
 */

export interface SyntheticDatasetOption {
  id: string;
  name: string;
  sector: string;
  defaultPrice: number;
  competitorPrice: number;
  sampleKeywordsPos: string[];
  sampleKeywordsNeg: string[];
  reviewsPos: string[];
  reviewsNeg: string[];
}

export const SYNTHETIC_SECTORS: SyntheticDatasetOption[] = [
  {
    id: 'd2c_cosmetics',
    name: 'D2C Organic Skincare & Sunscreen Serum',
    sector: 'E-commerce',
    defaultPrice: 699,
    competitorPrice: 749,
    sampleKeywordsPos: ['natural ingredients', 'non greasy', 'fast absorption', 'glowing texture', 'fragrance free'],
    sampleKeywordsNeg: ['sticky feel', 'leaking pump', 'mild breakout', 'small bottle', 'pricey for 30ml'],
    reviewsPos: [
      'Amazing formulation, absorbs instantly into Indian humid skin without white cast.',
      'Noticeable skin hydration after 2 weeks of regular morning use. Loved the gentle texture.',
      'Non-comedogenic and light. Easily rivals high-end French luxury serums at 1/3rd the price.',
      'Clean packaging, recyclable amber bottle, and genuine Ayurvedic actives.',
    ],
    reviewsNeg: [
      'The pump dispenser stopped working after two weeks, had to unscrew the cap.',
      'A bit too viscous for oily acne-prone skin during monsoon humidity.',
      'Slightly expensive for only 30ml volume compared to mass-market brands.',
      'Received with partial leakage in transit due to loose outer seal.',
    ],
  },
  {
    id: 'ev_two_wheelers',
    name: 'Smart Electric Scooter & Connected IoT Battery',
    sector: 'Automobile',
    defaultPrice: 119999,
    competitorPrice: 124999,
    sampleKeywordsPos: ['instant torque', 'hyper charging', 'touchscreen navigation', 'regenerative braking', 'spacious boot'],
    sampleKeywordsNeg: ['range anxiety', 'software lag', 'charger heating', 'panel gaps', 'suspension stiffness'],
    reviewsPos: [
      'Outstanding acceleration in warp mode, easily overtakes in Bangalore traffic.',
      'True 125km range achieved in eco mode. Fast charger installed smoothly at home.',
      'Digital dashboard with Google Maps mirror works flawlessly without phone holder.',
      'Saves over ₹4,500 every month on petrol commute. Build feels solid and modern.',
    ],
    reviewsNeg: [
      'OTA software update caused minor touchscreen freeze on reboot.',
      'Portable charger brick gets warm when fast charging under direct sunlight.',
      'Pillion footpeg design could be wider for saree-clad passengers.',
      'Service booking appointment wait times are slightly long in Tier 2 cities.',
    ],
  },
  {
    id: 'fmcg_packaged_goods',
    name: 'Organic Cold-Pressed Mustard & Sesame Oil',
    sector: 'FMCG',
    defaultPrice: 385,
    competitorPrice: 420,
    sampleKeywordsPos: ['traditional kachi ghani', 'pungent aroma', 'glass bottle', 'zero additives', 'authentic taste'],
    sampleKeywordsNeg: ['heavy packaging', 'sediment particles', 'cap leakage', 'short shelf life', 'delivery delay'],
    reviewsPos: [
      'Authentic pungent mustard aroma identical to ancestral village expeller oil.',
      'Makes Bengali fish curry and pickle preparation taste exceptionally rich.',
      'Glass bottle packaging preserves aroma far better than plastic pouch.',
      'Unrefined purity is evident from the deep golden clarity and unadulterated viscosity.',
    ],
    reviewsNeg: [
      'Glass bottle packaging is heavy and poses breakage risk in quick courier delivery.',
      'Natural seed sediment noticed at bottom, though normal for unclarified cold-press.',
      'Cap seal was slightly oily upon unboxing, need better tamper seal.',
    ],
  },
  {
    id: 'fintech_pos_soundbox',
    name: 'UPI Smart Audio Soundbox & Merchant QR Terminal',
    sector: 'Banking',
    defaultPrice: 1299,
    competitorPrice: 1450,
    sampleKeywordsPos: ['loud clear voice', 'multi language prompts', 'long battery backup', 'zero payment drop', '4g esim'],
    sampleKeywordsNeg: ['sim network fluctuation', 'speaker crackle', 'monthly subscription', 'charging pin loose'],
    reviewsPos: [
      'Announces payment confirmations in clear Hindi and Tamil within 1.5 seconds.',
      'Battery lasts 4 full business days on a single Type-C charge at our retail store.',
      'Completely eliminated payment fraud and fake screenshot scams during peak rush.',
      'Sturdy rubberized casing survives dusty market stall conditions easily.',
    ],
    reviewsNeg: [
      'Network connectivity drops occasionally in basement shops with weak cellular signal.',
      'Monthly cloud rental fee could be slightly lower for ultra-small kirana vendors.',
      'Volume dial could have a tactile physical button instead of single cycle toggle.',
    ],
  },
  {
    id: 'solar_rooftop',
    name: 'Grid-Tied Monocrystalline Solar Inverter Kit',
    sector: 'Energy',
    defaultPrice: 78500,
    competitorPrice: 84000,
    sampleKeywordsPos: ['high generation efficiency', 'subsidy portal approved', 'wifi app monitoring', 'ip65 weather proof'],
    sampleKeywordsNeg: ['net metering approval delay', 'complex wiring manual', 'heavy panel weight', 'inverter fan noise'],
    reviewsPos: [
      'Generated 18 units per day under clear Gujarat summer sunshine. Electricity bill dropped to zero.',
      'Mobile app gives minute-by-minute solar yield and grid export telemetry.',
      'BIS and MNRE certified, qualified for direct DBT rooftop subsidy without hassle.',
    ],
    reviewsNeg: [
      'Local state electricity board took 6 weeks to replace bidirectional net-meter.',
      'Mounting structure required custom masonry drilling for sloped RCC roof.',
      'Cooling fan hum is audible if inverter is mounted near bedroom balcony.',
    ],
  },
];

const STATES = [
  'Maharashtra', 'Karnataka', 'Delhi NCR', 'Tamil Nadu', 'Uttar Pradesh',
  'Gujarat', 'West Bengal', 'Telangana', 'Rajasthan', 'Kerala',
];

const CUSTOMER_SEGMENTS = ['Tier 1 Metro Professional', 'Tier 2 Emerging Urban', 'SMB / Retail Merchant', 'Gen Z Digital Native', 'Enterprise Buyer'];

export function generateSyntheticDataset(sectorId: string, rowCount: number): {
  data: Record<string, any>[];
  datasetName: string;
  sectorName: string;
} {
  const config = SYNTHETIC_SECTORS.find((s) => s.id === sectorId) || SYNTHETIC_SECTORS[0];
  const rows: Record<string, any>[] = [];

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - rowCount);

  for (let i = 0; i < rowCount; i++) {
    const curDate = new Date(baseDate);
    curDate.setDate(curDate.getDate() + i);
    const dateStr = curDate.toISOString().split('T')[0];

    // Rating distribution: 68% 4-5 stars, 18% 3 stars, 14% 1-2 stars
    const roll = Math.random();
    let rating = 5;
    let isPositive = true;

    if (roll < 0.10) {
      rating = 1;
      isPositive = false;
    } else if (roll < 0.22) {
      rating = 2;
      isPositive = false;
    } else if (roll < 0.40) {
      rating = 3;
      isPositive = Math.random() > 0.5;
    } else if (roll < 0.72) {
      rating = 4;
      isPositive = true;
    } else {
      rating = 5;
      isPositive = true;
    }

    // Choose review text
    const reviewPool = isPositive ? config.reviewsPos : config.reviewsNeg;
    const baseReview = reviewPool[Math.floor(Math.random() * reviewPool.length)];
    const kwPool = isPositive ? config.sampleKeywordsPos : config.sampleKeywordsNeg;
    const keyword = kwPool[Math.floor(Math.random() * kwPool.length)];

    // Price variation +/- 6%
    const priceVariance = 1 + (Math.random() * 0.12 - 0.06);
    const price = Math.round(config.defaultPrice * priceVariance);

    // Units ordered: higher for lower priced FMCG/D2C, lower for EV/Solar
    let baseUnits = 1;
    if (config.defaultPrice < 1000) baseUnits = Math.floor(Math.random() * 5) + 1;
    else if (config.defaultPrice < 5000) baseUnits = Math.floor(Math.random() * 3) + 1;

    // Demand / views proxy
    const productViews = Math.floor(Math.random() * 120) + 15;

    rows.push({
      Record_ID: `SYN-${10000 + i}`,
      Date: dateStr,
      Product_Name: config.name,
      Category: config.sector,
      Customer_Segment: CUSTOMER_SEGMENTS[Math.floor(Math.random() * CUSTOMER_SEGMENTS.length)],
      Region_State: STATES[Math.floor(Math.random() * STATES.length)],
      Rating: rating,
      Review_Headline: isPositive ? `Great quality & ${keyword}` : `Issues regarding ${keyword}`,
      Review_Text: `${baseReview} [Mention: ${keyword}]`,
      Price_INR: price,
      Competitor_Price_INR: config.competitorPrice,
      Units_Ordered: baseUnits,
      Views_Impressions: productViews,
      Customer_Satisfaction_Pct: rating * 20,
      Return_Status: rating <= 2 && Math.random() > 0.4 ? 'Returned Defective' : 'Delivered & Kept',
    });
  }

  const cleanSectorTag = config.id.replace(/_/g, '-');
  return {
    data: rows,
    datasetName: `Synthetic_${cleanSectorTag}_${rowCount}Rows.csv`,
    sectorName: config.sector,
  };
}
