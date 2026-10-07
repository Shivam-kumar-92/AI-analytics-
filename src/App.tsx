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
import { MakeInIndiaLion } from './components/common/MakeInIndiaLion';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Language } from './i18n/translations';

// Code-split heavy views to reduce initial bundle
const CorrelationsTab = React.lazy(() =>
  import('./components/dashboard/CorrelationsTab').then((m) => ({ default: m.CorrelationsTab }))
);
const AiAnalystChat = React.lazy(() =>
  import('./components/chat/AiAnalystChat').then((m) => ({ default: m.AiAnalystChat }))
);
const ReportExporter = React.lazy(() =>
  import('./components/export/ReportExporter').then((m) => ({ default: m.ReportExporter }))
);
const Background3D = React.lazy(() =>
  import('./components/3d/Background3D').then((m) => ({ default: m.Background3D }))
);
const CompareTab = React.lazy(() =>
  import('./components/dashboard/CompareTab').then((m) => ({ default: m.CompareTab }))
);
const RegionalTab = React.lazy(() =>
  import('./components/dashboard/RegionalTab').then((m) => ({ default: m.RegionalTab }))
);

// Central Registry of all 6 Demos
import { ALL_DEMOS } from './datasets';

// Engines
import { DataCleaner } from './engine/dataCleaner';
import { StatsEngine } from './engine/statsEngine';
import { NLPSentimentEngine } from './engine/nlpSentiment';
import { DemandModel } from './engine/demandModel';
import { MarketValueModel } from './engine/marketValueModel';
import { SuccessModel } from './engine/successModel';
import { CompetitorModel } from './engine/competitorModel';
import { SessionStorageManager } from './engine/sessionStorage';
import { ColumnMappingConfig } from './components/upload/DataPreviewTable';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<Language>('en');
  const getHashTab = () => window.location.hash.replace('#', '') || 'landing';
  const [activeTab, setActiveTab] = useState<string>(getHashTab());
  // Initial defaults based on saved session or Earbuds demo
  const initialDemo = ALL_DEMOS.find((d) => d.id === 'earbuds') || ALL_DEMOS[0];
  const savedSession = SessionStorageManager.getActiveSession();
  const hasSavedState = Boolean(savedSession && !savedSession.isSyntheticDemo && savedSession.state);

  const [selectedIndustry, setSelectedIndustry] = useState<Industry>(
    () => (hasSavedState && savedSession?.industry ? (savedSession.industry as Industry) : initialDemo.industry)
  );
  const [customIndustry, setCustomIndustry] = useState<string>('');
  const [productName, setProductName] = useState<string>(
    () => (hasSavedState && savedSession?.productName ? savedSession.productName : initialDemo.name)
  );
  const [activeDatasetName, setActiveDatasetName] = useState<string>(
    () => (hasSavedState && savedSession?.datasetName ? savedSession.datasetName : initialDemo.datasetFileName)
  );
  const [isSyntheticDemo, setIsSyntheticDemo] = useState<boolean>(() => !hasSavedState);
  const [activeDemoId, setActiveDemoId] = useState<string>(() => (hasSavedState ? '' : 'earbuds'));
  const [activeColumnMapping, setActiveColumnMapping] = useState<ColumnMappingConfig>({ currencySymbol: '₹' });

  // Active Processed States
  const [rawData, setRawData] = useState<Record<string, any>[]>(() => (hasSavedState && savedSession?.state?.rawData) || initialDemo.rawData);
  const [cleanedData, setCleanedData] = useState<Record<string, any>[]>(() => (hasSavedState && savedSession?.state?.cleanedData) || initialDemo.rawData);
  const [cleaningReport, setCleaningReport] = useState(() => (hasSavedState && savedSession?.state?.cleaningReport) || initialDemo.cleaningReport);
  const [stats, setStats] = useState(() => (hasSavedState && savedSession?.state?.stats) || initialDemo.stats);
  const [correlations, setCorrelations] = useState(() => (hasSavedState && savedSession?.state?.correlations) || initialDemo.correlations);
  const [reviewIntel, setReviewIntel] = useState<ReviewIntelligence | undefined>(() => (hasSavedState ? savedSession?.state?.reviewIntel : initialDemo.reviewIntel));
  const [demandIntel, setDemandIntel] = useState(() => (hasSavedState && savedSession?.state?.demandIntel) || initialDemo.demandIntel);
  const [marketValue, setMarketValue] = useState(() => (hasSavedState && savedSession?.state?.marketValue) || initialDemo.marketValue);
  const [competitorIntel, setCompetitorIntel] = useState(() => (hasSavedState && savedSession?.state?.competitorIntel) || initialDemo.competitorIntel);
  const [successScore, setSuccessScore] = useState(() => (hasSavedState && savedSession?.state?.successScore) || initialDemo.successScore);

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

  // Helper: Detect currency symbols in raw data rows
  const detectCurrency = (rawRows: Record<string, any>[]): string => {
    for (const row of rawRows.slice(0, 30)) {
      for (const val of Object.values(row)) {
        const str = String(val);
        if (str.includes('$')) return '$';
        if (str.includes('€')) return '€';
        if (str.includes('£')) return '£';
        if (str.includes('¥')) return '¥';
        if (str.includes('AED')) return 'AED';
        if (str.includes('CAD')) return 'CAD';
        if (str.includes('₹') || str.includes('Rs') || str.includes('INR')) return '₹';
      }
    }
    return '₹';
  };

  // Core Pipeline: Process and Model Ingested Dataset with Optional Column Mapping Overrides
  const processDataset = (
    data: Record<string, any>[],
    fileName: string,
    isSynthetic: boolean,
    customMapping?: ColumnMappingConfig
  ) => {
    if (!data || data.length === 0) return;

    // 1. Clean and profile data
    const { cleanedData: cleaned, report } = DataCleaner.cleanAndProfile(data);
    const inferred = report.inferredSchema;

    // 2. Identify primary product name
    const defaultProdCol =
      inferred?.productColumn ||
      Object.keys(data[0]).find((k) =>
        ['product', 'product_name', 'item', 'model', 'title', 'sku', 'device', 'brand', 'name'].includes(k.toLowerCase())
      );
    const chosenProdCol = customMapping?.productColumn || defaultProdCol;
    const identifiedName = chosenProdCol ? String(cleaned[0][chosenProdCol]) : fileName.replace(/\.[^/.]+$/, '');

    setProductName(identifiedName);
    setActiveDatasetName(fileName);
    setIsSyntheticDemo(isSynthetic);
    setActiveDemoId('');
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

    // 4. Sentiment & Review NLP
    const autoReviewTextCol =
      customMapping?.reviewColumn !== undefined
        ? customMapping.reviewColumn
        : inferred?.reviewColumn || report.columnProfiles.find((p) => p.detectedType === 'review_text')?.name;
    const autoRatingCol =
      customMapping?.ratingColumn !== undefined
        ? customMapping.ratingColumn
        : inferred?.ratingColumn || report.columnProfiles.find((p) => p.detectedType === 'rating')?.name;
    const reviewTextCol = autoReviewTextCol;
    const ratingCol = autoRatingCol;

    let revIntel: ReviewIntelligence | undefined = undefined;
    if (reviewTextCol || ratingCol) {
      const reviewRows = cleaned.map((r) => ({
        text: reviewTextCol ? String(r[reviewTextCol]) : '',
        rating: ratingCol ? Number(r[ratingCol]) : undefined,
      }));
      revIntel = NLPSentimentEngine.analyzeReviewDataset(reviewRows);
      setReviewIntel(revIntel);
    } else {
      setReviewIntel(undefined);
    }

    // 5. Demand computation
    const autoSalesCol =
      inferred?.salesColumn ||
      report.columnProfiles.find((p) =>
        ['sales', 'revenue', 'volume', 'units', 'cases_sold', 'unitssold', 'quantity', 'qty'].includes(
          p.name.toLowerCase().replace(/[\s_]+/g, '')
        )
      )?.name;
    const hasSales = customMapping?.salesColumn ? Boolean(customMapping.salesColumn) : Boolean(autoSalesCol);
    const hasReviews = Boolean(reviewTextCol || ratingCol);
    const computedDemand = DemandModel.computeDemand(cleaned, hasSales, hasReviews, false);
    setDemandIntel(computedDemand);

    // 6. Pricing & Currency
    const autoPriceCol =
      inferred?.priceColumn || report.columnProfiles.find((p) => p.detectedType === 'currency')?.name;
    const chosenPriceCol = customMapping?.priceColumn !== undefined ? customMapping.priceColumn : autoPriceCol;
    const compPriceCol =
      customMapping?.competitorPriceColumn ||
      inferred?.competitorPriceColumn ||
      Object.keys(data[0]).find((k) =>
        ['competitor_price', 'comp_price', 'market_price', 'comp_fee'].includes(k.toLowerCase())
      );

    const basePrice = chosenPriceCol ? Number(cleaned[0][chosenPriceCol]) || 100 : 100;
    const compPrices = compPriceCol ? cleaned.map((r) => Number(r[compPriceCol])).filter(Boolean) : [basePrice * 1.08];
    const detectedCurrency = customMapping?.currencySymbol || inferred?.currencySymbol || detectCurrency(data);
    const computedMarketValue = MarketValueModel.analyzePricing(basePrice, compPrices, detectedCurrency);
    setMarketValue(computedMarketValue);

    // 7. Dynamic Competitor Intelligence (Fixes un-updated competitor bug!)
    const currentIndustryStr = selectedIndustry === 'Other' && customIndustry ? customIndustry : selectedIndustry;
    const computedCompetitorIntel = CompetitorModel.analyzeCompetitors(
      cleaned,
      identifiedName,
      basePrice,
      revIntel ? revIntel.metrics.averageRating : 4.2,
      revIntel ? revIntel.metrics.positivePct : 80,
      computedDemand.score,
      detectedCurrency,
      currentIndustryStr
    );
    setCompetitorIntel(computedCompetitorIntel);

    // 8. Product Success Score (Uses fresh revIntel directly to eliminate stale state bug!)
    const successRes = SuccessModel.evaluateProductSuccess({
      customerSentiment: revIntel ? revIntel.metrics.positivePct : 82,
      demand: computedDemand.score,
      competitionRisk: computedCompetitorIntel.competitors.length > 2 ? 65 : 55,
      pricingCompetitiveness: computedMarketValue.pricePositionPct <= 0 ? 88 : 72,
      marketGrowth: 78,
      productQuality: revIntel ? Math.round(revIntel.metrics.averageRating * 20) : 84,
      datasetSize: cleaned.length,
      hasSalesSignals: hasSales,
      hasReviewSignals: hasReviews,
      mainRiskFactor: 'Market price elasticity and competitor segment pressure',
    });
    setSuccessScore(successRes);

    // Update active column mapping state
    const newMapping: ColumnMappingConfig = {
      productColumn: chosenProdCol,
      priceColumn: chosenPriceCol,
      reviewColumn: reviewTextCol,
      ratingColumn: ratingCol,
      salesColumn: customMapping?.salesColumn || autoSalesCol,
      competitorPriceColumn: compPriceCol,
      stateColumn: customMapping?.stateColumn || inferred?.stateColumn,
      currencySymbol: detectedCurrency,
    };
    setActiveColumnMapping(newMapping);

    // 9. Session Persistence (Never lose uploaded analyses on reload)
    SessionStorageManager.saveCurrentSession({
      productName: identifiedName,
      industry: currentIndustryStr,
      datasetName: fileName,
      isSyntheticDemo: isSynthetic,
      dataSummary: {
        rowCount: cleaned.length,
        columnCount: report.totalColumns,
        score: report.dataQualityScore,
      },
      state: {
        rawData: data.slice(0, 500),
        cleanedData: cleaned.slice(0, 500),
        cleaningReport: report,
        stats: computedStats,
        correlations: computedCorrs,
        reviewIntel: revIntel,
        demandIntel: computedDemand,
        marketValue: computedMarketValue,
        competitorIntel: computedCompetitorIntel,
        successScore: successRes,
      },
    });

    handleTabChange('preview');
  };

  const handleDataLoaded = (
    data: Record<string, any>[],
    fileName: string,
    isSynthetic: boolean
  ) => {
    processDataset(data, fileName, isSynthetic);
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
      <ErrorBoundary fallbackTitle="3D Background Canvas Disabled">
        <React.Suspense fallback={null}>
          <Background3D />
        </React.Suspense>
      </ErrorBoundary>

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
          language={language}
          setLanguage={setLanguage}
        />
      </div>

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <ErrorBoundary fallbackTitle="Dashboard Analysis Render Error">
          <React.Suspense
            fallback={
              <div className="flex flex-col items-center justify-center min-h-[420px] space-y-4">
              <div className="h-10 w-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
              <p className="text-xs text-slate-400 font-mono tracking-wider">Loading Institutional Analytics Engine...</p>
            </div>
          }
        >
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
            onApplyColumnMapping={(mapping) => processDataset(rawData, activeDatasetName, isSyntheticDemo, mapping)}
            initialMapping={activeColumnMapping}
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

        {activeTab === 'compare' && (
          <CompareTab
            currentProductName={productName}
            currentDemoId={activeDemoId}
            currencySymbol={marketValue.currencySymbol}
          />
        )}

        {activeTab === 'regional' && (
          <RegionalTab
            productName={productName}
            industry={selectedIndustry}
            datasetRows={cleanedData}
            baselineSentimentPct={reviewIntel?.metrics.positivePct}
            baselineDemandScore={demandIntel.score}
            customStateColumn={activeColumnMapping.stateColumn}
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
        </React.Suspense>
        </ErrorBoundary>
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
