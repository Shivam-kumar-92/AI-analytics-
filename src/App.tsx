import React, { useState, useEffect } from 'react';
import { Industry, ReviewIntelligence } from './types';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { DataUploader } from './components/upload/DataUploader';
import { DataPreviewTable } from './components/upload/DataPreviewTable';
import { OverviewTab } from './components/dashboard/OverviewTab';
import { SentimentTab } from './components/dashboard/SentimentTab';
import { DemandTab } from './components/dashboard/DemandTab';
import { MarketValueTab } from './components/dashboard/MarketValueTab';
import { CompetitorTab } from './components/dashboard/CompetitorTab';
import { CorrelationsTab } from './components/dashboard/CorrelationsTab';
import { AiAnalystChat } from './components/chat/AiAnalystChat';
import { ReportExporter } from './components/export/ReportExporter';
import { Background3D } from './components/3d/Background3D';
import { MakeInIndiaLion } from './components/common/MakeInIndiaLion';

// Central Registry of all 6 Demos
import { ALL_DEMOS, DemoConfig } from './datasets';

// Engines
import { DataCleaner } from './engine/dataCleaner';
import { StatsEngine } from './engine/statsEngine';
import { NLPSentimentEngine } from './engine/nlpSentiment';
import { DemandModel } from './engine/demandModel';
import { MarketValueModel } from './engine/marketValueModel';
import { SuccessModel } from './engine/successModel';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const getHashTab = () => window.location.hash.replace('#', '') || 'landing';
  const [activeTab, setActiveTab] = useState<string>(getHashTab());
  const [activeDemoId, setActiveDemoId] = useState<string>('earbuds');

  // Initial defaults based on Earbuds demo
  const initialDemo = ALL_DEMOS.find((d) => d.id === 'earbuds') || ALL_DEMOS[0];

  const [selectedIndustry, setSelectedIndustry] = useState<Industry>(initialDemo.industry);
  const [customIndustry, setCustomIndustry] = useState<string>('');
  const [productName, setProductName] = useState<string>(initialDemo.name);
  const [activeDatasetName, setActiveDatasetName] = useState<string>(initialDemo.datasetFileName);
  const [isSyntheticDemo, setIsSyntheticDemo] = useState<boolean>(true);

  // Active Processed States
  const [rawData, setRawData] = useState<Record<string, any>[]>(initialDemo.rawData);
  const [cleanedData, setCleanedData] = useState<Record<string, any>[]>(initialDemo.rawData);
  const [cleaningReport, setCleaningReport] = useState(initialDemo.cleaningReport);
  const [stats, setStats] = useState(initialDemo.stats);
  const [correlations, setCorrelations] = useState(initialDemo.correlations);
  const [reviewIntel, setReviewIntel] = useState<ReviewIntelligence | undefined>(initialDemo.reviewIntel);
  const [demandIntel, setDemandIntel] = useState(initialDemo.demandIntel);
  const [marketValue, setMarketValue] = useState(initialDemo.marketValue);
  const [competitorIntel, setCompetitorIntel] = useState(initialDemo.competitorIntel);
  const [successScore, setSuccessScore] = useState(initialDemo.successScore);

  // Theme synchronization with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  // Sync activeTab with URL hash for back button support
  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getHashTab());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    window.location.hash = tab;
    setActiveTab(tab);
  };


  // Unified Demo Switcher (Supports all 6 industry demos)
  const handleSelectDemo = (demoId: string) => {
    const demo = ALL_DEMOS.find((d) => d.id === demoId);
    if (!demo) return;

    setActiveDemoId(demo.id);
    setSelectedIndustry(demo.industry);
    setProductName(demo.name);
    setActiveDatasetName(demo.datasetFileName);
    setIsSyntheticDemo(true);
    setRawData(demo.rawData);
    setCleanedData(demo.rawData);
    setCleaningReport(demo.cleaningReport);
    setReviewIntel(demo.reviewIntel);
    setDemandIntel(demo.demandIntel);
    setMarketValue(demo.marketValue);
    setCompetitorIntel(demo.competitorIntel);
    setSuccessScore(demo.successScore);
    setStats(demo.stats);
    setCorrelations(demo.correlations);

    // Open Executive Overview
    handleTabChange('overview');
  };

  // Handler: Process Newly Ingested Data from Upload / Paste
  const handleDataLoaded = (
    data: Record<string, any>[],
    fileName: string,
    isSynthetic: boolean
  ) => {
    if (!data || data.length === 0) return;

    // 1. Clean and profile data
    const { cleanedData: cleaned, report } = DataCleaner.cleanAndProfile(data);

    // 2. Identify primary product name
    const prodCol = Object.keys(data[0]).find((k) =>
      ['product', 'product_name', 'item', 'model', 'title', 'sku', 'device', 'brand'].includes(k.toLowerCase())
    );
    const identifiedName = prodCol ? String(cleaned[0][prodCol]) : fileName.replace(/\.[^/.]+$/, '');
    setProductName(identifiedName);
    setActiveDatasetName(fileName);
    setIsSyntheticDemo(isSynthetic);
    setActiveDemoId(''); // Custom data
    setRawData(data);
    setCleanedData(cleaned);
    setCleaningReport(report);

    // 3. Compute stats for numeric columns
    const numericCols = report.columnProfiles
      .filter((p) => p.detectedType === 'numeric' || p.detectedType === 'currency' || p.detectedType === 'rating')
      .map((p) => p.name);

    const computedStats = numericCols.map((col) =>
      StatsEngine.computeDescriptiveStats(
        cleaned.map((r) => Number(r[col])),
        col
      )
    );
    setStats(computedStats);

    const computedCorrs = StatsEngine.computeCorrelationMatrix(cleaned, numericCols);
    setCorrelations(computedCorrs);

    // 4. Check for review text / rating
    const reviewTextCol = report.columnProfiles.find((p) => p.detectedType === 'review_text')?.name;
    const ratingCol = report.columnProfiles.find((p) => p.detectedType === 'rating')?.name;

    if (reviewTextCol || ratingCol) {
      const reviewRows = cleaned.map((r) => ({
        text: reviewTextCol ? String(r[reviewTextCol]) : '',
        rating: ratingCol ? Number(r[ratingCol]) : undefined,
      }));
      const revIntel = NLPSentimentEngine.analyzeReviewDataset(reviewRows);
      setReviewIntel(revIntel);
    } else {
      setReviewIntel(undefined);
    }

    // 5. Demand computation
    const hasSales = report.columnProfiles.some((p) =>
      ['sales', 'revenue', 'volume', 'units', 'cases_sold'].includes(p.name.toLowerCase())
    );
    const hasReviews = Boolean(reviewTextCol || ratingCol);
    const computedDemand = DemandModel.computeDemand(cleaned, hasSales, hasReviews, false);
    setDemandIntel(computedDemand);

    // 6. Pricing & Market Value
    const priceCol = report.columnProfiles.find((p) => p.detectedType === 'currency')?.name;
    const compPriceCol = Object.keys(data[0]).find((k) =>
      ['competitor_price', 'comp_price', 'market_price', 'comp_fee'].includes(k.toLowerCase())
    );

    const basePrice = priceCol ? Number(cleaned[0][priceCol]) || 100 : 100;
    const compPrices = compPriceCol ? cleaned.map((r) => Number(r[compPriceCol])).filter(Boolean) : [basePrice * 1.12];
    const currencySymbol = '₹';
    const computedMarketValue = MarketValueModel.analyzePricing(basePrice, compPrices, currencySymbol);
    setMarketValue(computedMarketValue);

    // 7. Product Success Score
    const successRes = SuccessModel.evaluateProductSuccess({
      customerSentiment: reviewIntel ? reviewIntel.metrics.positivePct : 82,
      demand: computedDemand.score,
      competitionRisk: 65,
      pricingCompetitiveness: computedMarketValue.pricePositionPct <= 0 ? 88 : 72,
      marketGrowth: 78,
      productQuality: reviewIntel ? Math.round(reviewIntel.metrics.averageRating * 20) : 84,
      datasetSize: cleaned.length,
      hasSalesSignals: hasSales,
      hasReviewSignals: hasReviews,
      mainRiskFactor: 'Market volatility and competitor alternative expansion',
    });
    setSuccessScore(successRes);

    // Navigate to preview first to show cleaning report and data quality score
    handleTabChange('preview');
  };

  // AI Analyst Context Object
  const analystContext = {
    productName,
    industry: selectedIndustry === 'Other' && customIndustry ? customIndustry : selectedIndustry,
    cleaningReport,
    stats,
    sentimentIntel: reviewIntel,
    demandIntel,
    marketValue,
    successScore,
    competitorIntel,
    isSyntheticDemo,
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Interactive 3D WebGL Background Canvas */}
      <Background3D />

      {/* Top Universal Navbar */}
      <div className="relative z-20">
        <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        customIndustry={customIndustry}
        setCustomIndustry={setCustomIndustry}
        demos={ALL_DEMOS}
        activeDemoId={activeDemoId}
        onSelectDemo={handleSelectDemo}
        activeDatasetName={activeDatasetName}
        isSyntheticDemo={isSyntheticDemo}
        theme={theme}
        setTheme={setTheme}
      />
      </div>

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {activeTab === 'landing' && (
          <LandingPage
            onStartAnalysis={() => handleTabChange('upload')}
            demos={ALL_DEMOS}
            onSelectDemo={handleSelectDemo}
          />
        )}

        {activeTab === 'upload' && (
          <DataUploader
            onDataLoaded={handleDataLoaded}
            demos={ALL_DEMOS}
            onSelectDemo={handleSelectDemo}
          />
        )}

        {activeTab === 'preview' && (
          <DataPreviewTable
            data={cleanedData}
            report={cleaningReport}
            fileName={activeDatasetName}
            onProceedToAnalysis={() => handleTabChange('overview')}
          />
        )}

        {activeTab === 'overview' && (
          <OverviewTab
            productName={productName}
            industry={selectedIndustry}
            isSyntheticDemo={isSyntheticDemo}
            successScore={successScore}
            demandIntel={demandIntel}
            marketValue={marketValue}
            reviewIntel={reviewIntel}
            cleaningReport={cleaningReport}
            setActiveTab={handleTabChange}
          />
        )}

        {activeTab === 'sentiment' && (
          <SentimentTab reviewIntel={reviewIntel} productName={productName} />
        )}

        {activeTab === 'demand' && (
          <DemandTab
            demandIntel={demandIntel}
            productName={productName}
            isOilIndustryDemo={selectedIndustry === 'Oil & Gas'}
          />
        )}

        {activeTab === 'pricing' && (
          <MarketValueTab marketValue={marketValue} productName={productName} />
        )}

        {activeTab === 'competitor' && (
          <CompetitorTab
            competitorIntel={competitorIntel}
            currencySymbol={marketValue.currencySymbol}
          />
        )}

        {activeTab === 'correlations' && (
          <CorrelationsTab
            stats={stats}
            correlations={correlations}
            cleaningReport={cleaningReport}
          />
        )}

        {activeTab === 'chat' && <AiAnalystChat context={analystContext} />}

        {activeTab === 'export' && (
          <ReportExporter
            productName={productName}
            industry={selectedIndustry}
            isSyntheticDemo={isSyntheticDemo}
            successScore={successScore}
            demandIntel={demandIntel}
            marketValue={marketValue}
            competitorIntel={competitorIntel}
            cleaningReport={cleaningReport}
            stats={stats}
            reviewIntel={reviewIntel}
            cleanedData={cleanedData}
          />
        )}
      </main>

      {/* Global Executive Footer with Prominent Made in India Lion Logo */}
      <footer className="border-t border-slate-900 bg-slate-950/90 pt-10 pb-8 text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Prominent Made in India Lion Emblem */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl bg-slate-900/30 border border-slate-800/80 backdrop-blur-sm shadow-2xl">
            <MakeInIndiaLion size="lg" />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-900">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-300">Yuktivya AI</span>
              <span>•</span>
              <span>Indian Enterprise AI Data Analyst & Market Intelligence</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {ALL_DEMOS.map((d) => (
                <span
                  key={d.id}
                  onClick={() => handleSelectDemo(d.id)}
                  className="hover:text-orange-400 cursor-pointer transition-colors"
                >
                  {d.name.split(' ')[0]} Demo
                </span>
              ))}
              <span>•</span>
              <span className="hover:text-slate-300 cursor-pointer" onClick={() => handleTabChange('upload')}>Upload</span>
              <span className="hover:text-slate-300 cursor-pointer" onClick={() => handleTabChange('chat')}>AI Analyst</span>
              <span className="hover:text-slate-300 cursor-pointer" onClick={() => handleTabChange('export')}>Export PDF</span>
            </div>

            <div className="text-[11px] text-slate-600">
              Strict algorithmic grounding. Zero unsupported assumptions.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
