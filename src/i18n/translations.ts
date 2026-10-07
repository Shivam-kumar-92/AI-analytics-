export type Language = 'en' | 'hi';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  sovereignBadge: string;
  madeInIndia: string;
  themeDark: string;
  themeLight: string;
  // Nav tabs
  navHome: string;
  navOverview: string;
  navSentiment: string;
  navDemand: string;
  navPricing: string;
  navCompetitor: string;
  navCompare: string;
  navRegional: string;
  navCorrelations: string;
  navChat: string;
  navExport: string;
  navUpload: string;
  // Common terms & KPIs
  successScore: string;
  demandIndex: string;
  pricePosition: string;
  sentimentRating: string;
  dataQuality: string;
  cleanedRows: string;
  confidenceScore: string;
  marketPotential: string;
  // Actions
  downloadPdf: string;
  downloadExcel: string;
  downloadCsv: string;
  generateSynthetic: string;
  compareHeadToHead: string;
  searchPlaceholder: string;
  filterAll: string;
  filterRows: string;
  footerNotice: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'Yuktivya AI',
    tagline: 'Indian Sovereign Enterprise Intelligence Platform',
    sovereignBadge: 'Atmanirbhar Bharat AI Engine',
    madeInIndia: 'Made in India',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    navHome: 'Home',
    navOverview: 'Executive Overview',
    navSentiment: 'Review & Sentiment',
    navDemand: 'Demand Intelligence',
    navPricing: 'Pricing & Market Value',
    navCompetitor: 'Competitor Matrix',
    navCompare: 'Compare Products',
    navRegional: 'Regional & State Radar',
    navCorrelations: 'Statistics & Outliers',
    navChat: 'AI Analyst Chat',
    navExport: 'Report & Export',
    navUpload: 'Upload Data',
    successScore: 'Product Success Score',
    demandIndex: 'Demand Velocity Index',
    pricePosition: 'Market Value Benchmark',
    sentimentRating: 'Customer Sentiment Score',
    dataQuality: 'Data Integrity Grade',
    cleanedRows: 'Cleaned Dataset Records',
    confidenceScore: 'Model Confidence',
    marketPotential: 'Commercial Viability Verdict',
    downloadPdf: 'Export Executive PDF Report',
    downloadExcel: 'Download Multi-Sheet Excel',
    downloadCsv: 'Export Cleaned CSV Data',
    generateSynthetic: 'Generate Synthetic Test Data',
    compareHeadToHead: 'Delta Scorecard & Win/Loss Matrix',
    searchPlaceholder: 'Search any keyword, review, category...',
    filterAll: 'All Records',
    filterRows: 'Filtered Rows',
    footerNotice: 'Strict algorithmic grounding. Zero unsupported assumptions. Certified for Indian Enterprise.',
  },
  hi: {
    appName: 'युक्तिव्य एआई',
    tagline: 'भारतीय सार्वभौम उद्यम बुद्धिमत्ता मंच',
    sovereignBadge: 'आत्मनिर्भर भारत एआई इंजन',
    madeInIndia: 'मेक इन इंडिया',
    themeDark: 'डार्क मोड',
    themeLight: 'लाइट मोड',
    navHome: 'होम',
    navOverview: 'कार्यकारी अवलोकन',
    navSentiment: 'समीक्षा एवं भावना',
    navDemand: 'मांग विश्लेषण',
    navPricing: 'मूल्य निर्धारण एवं बाजार मूल्य',
    navCompetitor: 'प्रतिस्पर्धी मैट्रिक्स',
    navCompare: 'उत्पाद तुलना',
    navRegional: 'क्षेत्रीय व राज्य विश्लेषण',
    navCorrelations: 'सांख्यिकी एवं अपवाद',
    navChat: 'एआई विश्लेषक चैट',
    navExport: 'रिपोर्ट एवं निर्यात',
    navUpload: 'डेटा अपलोड',
    successScore: 'उत्पाद सफलता स्कोर',
    demandIndex: 'बाजार मांग सूचकांक',
    pricePosition: 'मूल्य स्थिति मानक',
    sentimentRating: 'ग्राहक संतुष्टि रेटिंग',
    dataQuality: 'डेटा गुणवत्ता ग्रेड',
    cleanedRows: 'सत्यापित डेटा पंक्तियां',
    confidenceScore: 'मॉडल विश्वास स्तर',
    marketPotential: 'व्यावसायिक व्यवहार्यता निर्णय',
    downloadPdf: 'कार्यकारी पीडीएफ डाउनलोड करें',
    downloadExcel: 'एक्सेल शीट डाउनलोड करें',
    downloadCsv: 'सत्यापित सीएसवी निर्यात',
    generateSynthetic: 'परीक्षण डेटा तैयार करें',
    compareHeadToHead: 'तुलनात्मक स्कोरकार्ड व विश्लेषण',
    searchPlaceholder: 'कोई भी कीवर्ड, समीक्षा या श्रेणी खोजें...',
    filterAll: 'सभी रिकॉर्ड',
    filterRows: 'फ़िल्टर किए गए रिकॉर्ड',
    footerNotice: 'कठोर एल्गोरिथम आधार। शून्य अवांछित धारणाएं। भारतीय उद्यम हेतु प्रमाणित।',
  },
};
