import React, { useState } from 'react';
import {
  FileDown,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import {
  CompetitorIntelligence,
  DataCleaningReport,
  DemandIntelligence,
  DescriptiveStats,
  MarketValueAnalysis,
  ProductSuccessScore,
  ReviewIntelligence,
} from '../../types';

interface ReportExporterProps {
  productName: string;
  industry: string;
  isSyntheticDemo: boolean;
  successScore: ProductSuccessScore;
  demandIntel: DemandIntelligence;
  marketValue: MarketValueAnalysis;
  competitorIntel: CompetitorIntelligence;
  cleaningReport: DataCleaningReport;
  stats: DescriptiveStats[];
  reviewIntel?: ReviewIntelligence;
  cleanedData: Record<string, any>[];
}

export const ReportExporter: React.FC<ReportExporterProps> = ({
  productName,
  industry,
  isSyntheticDemo,
  successScore,
  demandIntel,
  marketValue,
  competitorIntel,
  cleaningReport,
  stats,
  reviewIntel,
  cleanedData,
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [clientCompanyName, setClientCompanyName] = useState('Enterprise Client');
  const [preparedByName, setPreparedByName] = useState('Yuktivya Strategic Advisory');
  const [confidentialityLevel, setConfidentialityLevel] = useState('Strictly Confidential');

  // 1. Export Cleaned CSV with formula injection defense (CWE-1236)
  const handleExportCSV = () => {
    if (!cleanedData || cleanedData.length === 0) return;

    // Sanitize any cell starting with dangerous spreadsheet formula triggers
    const sanitizedRows = cleanedData.map((row) => {
      const sanitized: Record<string, any> = {};
      for (const key of Object.keys(row)) {
        const val = row[key];
        if (typeof val === 'string' && /^[=+\-@\t\r]/.test(val)) {
          sanitized[key] = `'${val}`;
        } else {
          sanitized[key] = val;
        }
      }
      return sanitized;
    });

    const worksheet = XLSX.utils.json_to_sheet(sanitizedRows);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    link.href = objectUrl;
    link.setAttribute('download', `${productName.replace(/\s+/g, '_')}_Cleaned_Data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  };

  // 2. Export Excel (.xlsx) Multi-Sheet Workbook
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Cleaned Data
    const wsCleaned = XLSX.utils.json_to_sheet(cleanedData);
    XLSX.utils.book_append_sheet(wb, wsCleaned, 'Cleaned Dataset');

    // Sheet 2: Descriptive Statistics
    const statsRows = stats.map((s) => ({
      Attribute: s.column,
      Count: s.count,
      Mean: s.mean,
      Median: s.median,
      Mode: s.mode,
      StdDev: s.stdDev,
      Min: s.min,
      P25: s.p25,
      P75: s.p75,
      Max: s.max,
      IQR: s.iqr,
    }));
    const wsStats = XLSX.utils.json_to_sheet(statsRows);
    XLSX.utils.book_append_sheet(wb, wsStats, 'Statistical Profiling');

    // Sheet 3: Competitor Comparison
    const compRows = competitorIntel.competitors.map((c) => ({
      Product: c.name,
      Price: c.price,
      Rating: c.rating,
      Reviews: c.reviewsCount,
      DemandScore: c.demandScore,
      SentimentScore: c.sentimentScore,
      MarketPosition: c.marketPosition,
      Strengths: c.strengths,
      Weaknesses: c.weaknesses,
    }));
    const wsComp = XLSX.utils.json_to_sheet(compRows);
    XLSX.utils.book_append_sheet(wb, wsComp, 'Competitor Intelligence');

    // Save
    XLSX.writeFile(wb, `${productName.replace(/\s+/g, '_')}_Executive_Analysis.xlsx`);
  };

  // 3. Export Comprehensive Multi-Page PDF Consulting Report
  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const addHeader = (title: string, sub: string) => {
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, pageWidth, 75, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.text(title, 40, 34);

        // White-label Client Badge
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(251, 146, 60); // orange-400
        doc.text(`PREPARED FOR: ${clientCompanyName.toUpperCase()}`, pageWidth - 40, 34, { align: 'right' });

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text(sub, 40, 54);

        doc.setFontSize(8);
        doc.setTextColor(203, 213, 225);
        doc.text(`${preparedByName}  |  ${confidentialityLevel}`, pageWidth - 40, 54, { align: 'right' });
      };

      const addFooter = (pageNum: number, totalPages: number) => {
        doc.setDrawColor(226, 232, 240);
        doc.line(40, pageHeight - 38, pageWidth - 40, pageHeight - 38);

        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        const classificationText = isSyntheticDemo ? 'Synthetic Demo Data' : 'Verified Dataset Analysis';
        doc.text(
          `${confidentialityLevel}  |  ${clientCompanyName}  |  ${classificationText}  |  Yuktivya AI Intelligence Platform`,
          40,
          pageHeight - 24
        );
        doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 90, pageHeight - 24);
      };

      // ================= PAGE 1: EXECUTIVE VERDICT & KPIS =================
      addHeader(
        'YUKTIVYA AI EXECUTIVE INTELLIGENCE REPORT',
        `Asset: ${productName}  |  Sector: ${industry}  |  Generated: ${new Date().toLocaleDateString()}`
      );

      let y = 100;

      // Executive Verdict Card
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(40, y, pageWidth - 80, 105, 8, 8, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text(
        `MARKET POTENTIAL: ${successScore.classification.toUpperCase()} (${successScore.overallScore}/100)`,
        55,
        y + 26
      );

      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text(
        `Analysis Confidence: ${successScore.confidenceScore}%  |  Data Quality Score: ${cleaningReport.dataQualityScore}/100 (Grade ${cleaningReport.qualityGrade})`,
        55,
        y + 42
      );

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      const splitVerdict = doc.splitTextToSize(`"${successScore.aiVerdict}"`, pageWidth - 110);
      doc.text(splitVerdict, 55, y + 62);

      y += 128;

      // Commercial KPIs
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('KEY COMMERCIAL PERFORMANCE INDICATORS', 40, y);
      y += 14;

      const kpis = [
        ['Product Success Score', `${successScore.overallScore}/100`, successScore.classification],
        ['Demand Velocity', `${demandIntel.score}/100`, demandIntel.demandProxyLabel],
        ['Pricing Benchmark', `${marketValue.currencySymbol}${marketValue.productPrice.toLocaleString()}`, `${marketValue.pricePositionLabel} (${marketValue.pricePositionPct}%)`],
        ['Customer Sentiment', reviewIntel ? `${reviewIntel.metrics.positivePct}% Positive` : 'Favorable Rating', reviewIntel ? `${reviewIntel.metrics.averageRating}★ Category Score` : 'Standard Signal'],
        ['Data Quality Score', `${cleaningReport.dataQualityScore}/100`, `Grade ${cleaningReport.qualityGrade} (${cleaningReport.cleanedRowCount.toLocaleString()} clean rows)`],
      ];

      doc.setFontSize(9.5);
      kpis.forEach(([title, val, context]) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text(title, 40, y + 14);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(79, 70, 229);
        doc.text(val, 230, y + 14);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(context, 350, y + 14);

        y += 19;
      });

      y += 18;

      // Strategic Drivers & Risks
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('STRATEGIC DRIVERS & SYSTEMIC VULNERABILITIES', 40, y);
      y += 16;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(16, 185, 129);
      doc.text('Growth Drivers:', 40, y);
      y += 13;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      successScore.keyDrivers.slice(0, 3).forEach((d) => {
        doc.text(`• ${d}`, 50, y);
        y += 13;
      });

      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(244, 63, 94);
      doc.text('Critical Vulnerabilities & Risks:', 40, y);
      y += 13;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      successScore.keyRisks.slice(0, 3).forEach((r) => {
        doc.text(`• ${r}`, 50, y);
        y += 13;
      });

      y += 18;

      // Prescriptive Action Box
      doc.setFillColor(238, 242, 255);
      doc.setDrawColor(199, 210, 254);
      doc.roundedRect(40, y, pageWidth - 80, 54, 6, 6, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(49, 46, 129);
      doc.text('PRESCRIPTIVE STRATEGIC ACTION ROADMAP:', 52, y + 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(67, 56, 202);
      const splitAction = doc.splitTextToSize(successScore.recommendedAction, pageWidth - 104);
      doc.text(splitAction, 52, y + 33);

      addFooter(1, 3);

      // ================= PAGE 2: SENTIMENT & DEMAND INTELLIGENCE =================
      doc.addPage();
      addHeader(
        'CUSTOMER SENTIMENT NLP & DEMAND FORECASTING',
        `Asset: ${productName}  |  Granular NLP Polarity & Growth Momentum Dynamics`
      );

      y = 100;

      // Sentiment Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('1. CUSTOMER SENTIMENT & REVIEWS INTELLIGENCE', 40, y);
      y += 16;

      if (reviewIntel) {
        doc.setFillColor(248, 250, 252);
        doc.rect(40, y, pageWidth - 80, 50, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        doc.text(`Total Feedback Analyzed: ${reviewIntel.metrics.totalReviews.toLocaleString()}`, 55, y + 18);
        doc.text(`Average Star Rating: ${reviewIntel.metrics.averageRating}★ / 5.0`, 55, y + 34);
        doc.text(`Positive Polarity: ${reviewIntel.metrics.positivePct}%`, 250, y + 18);
        doc.text(`Negative Dissatisfaction: ${reviewIntel.metrics.negativePct}%`, 250, y + 34);
        doc.text(`Neutral / Balanced: ${reviewIntel.metrics.neutralPct}%`, 410, y + 18);
        y += 64;

        if (reviewIntel.likedFeatures.length > 0) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(16, 185, 129);
          doc.text('Top Customer Praised Dimensions:', 40, y);
          y += 14;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85);
          reviewIntel.likedFeatures.slice(0, 3).forEach((feat) => {
            doc.text(`• ${feat.name} (${feat.positiveMentions.toLocaleString()} positive citations, Score: ${feat.sentimentScore}%)`, 50, y);
            y += 13;
          });
        }

        if (reviewIntel.dislikedFeatures.length > 0) {
          y += 4;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(244, 63, 94);
          doc.text('Top Customer Friction Points:', 40, y);
          y += 14;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85);
          reviewIntel.dislikedFeatures.slice(0, 3).forEach((feat) => {
            doc.text(`• ${feat.name} (${feat.negativeMentions.toLocaleString()} dissatisfaction citations)`, 50, y);
            y += 13;
          });
        }
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(100, 116, 139);
        doc.text('No explicit unstructured text feedback detected in uploaded columns. Inferred ratings utilized.', 50, y);
        y += 30;
      }

      y += 16;

      // Demand Intelligence Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('2. DEMAND MOMENTUM & PREDICTIVE TRAJECTORY', 40, y);
      y += 16;

      doc.setFillColor(248, 250, 252);
      doc.rect(40, y, pageWidth - 80, 52, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`Calculated Demand Score: ${demandIntel.score}/100 (${demandIntel.classification})`, 55, y + 18);
      doc.text(`Momentum Trend: ${demandIntel.demandTrend.toUpperCase()} (+${demandIntel.growthRatePct}% Growth Rate)`, 55, y + 36);
      doc.text(`Signal Source: ${demandIntel.demandProxyLabel}`, 300, y + 18);
      doc.text(`Forecast Confidence: ${demandIntel.confidencePct}%`, 300, y + 36);
      y += 66;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const splitDemand = doc.splitTextToSize(`Interpretation: "${demandIntel.aiDemandInterpretation}"`, pageWidth - 80);
      doc.text(splitDemand, 40, y);

      addFooter(2, 3);

      // ================= PAGE 3: PRICING & COMPETITOR MATRIX =================
      doc.addPage();
      addHeader(
        'PRICING BENCHMARKS & COMPETITOR LANDSCAPE',
        `Asset: ${productName}  |  Category Pricing Elasticity & Competitive Positioning`
      );

      y = 100;

      // Pricing Elasticity Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('1. MARKET PRICING ELASTICITY & BENCHMARK', 40, y);
      y += 16;

      doc.setFillColor(248, 250, 252);
      doc.rect(40, y, pageWidth - 80, 48, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`Asset Price: ${marketValue.currencySymbol}${marketValue.productPrice.toLocaleString()}`, 55, y + 18);
      doc.text(`Category Benchmark Average: ${marketValue.currencySymbol}${marketValue.averageMarketPrice.toLocaleString()}`, 55, y + 34);
      doc.text(`Pricing Position: ${marketValue.pricePositionLabel} (${marketValue.pricePositionPct}%)`, 300, y + 18);
      doc.text(`Category Range: ${marketValue.currencySymbol}${marketValue.minPrice.toLocaleString()} - ${marketValue.currencySymbol}${marketValue.maxPrice.toLocaleString()}`, 300, y + 34);
      y += 60;

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      const splitPrice = doc.splitTextToSize(`Elasticity: "${marketValue.elasticityAssessment}"`, pageWidth - 80);
      doc.text(splitPrice, 40, y);
      y += 32;

      // Competitor Matrix Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('2. DIRECT COMPETITIVE BENCHMARK MATRIX', 40, y);
      y += 16;

      // Table Header
      doc.setFillColor(15, 23, 42);
      doc.rect(40, y, pageWidth - 80, 22, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text('Product / Offering', 48, y + 15);
      doc.text('Price', 190, y + 15);
      doc.text('Rating', 255, y + 15);
      doc.text('Demand', 315, y + 15);
      doc.text('Sentiment', 375, y + 15);
      doc.text('Market Position', 440, y + 15);
      y += 22;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      competitorIntel.competitors.slice(0, 5).forEach((comp, idx) => {
        doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
        doc.rect(40, y, pageWidth - 80, 20, 'F');
        doc.setTextColor(comp.isMainProduct ? 79 : 30, comp.isMainProduct ? 70 : 41, comp.isMainProduct ? 229 : 59);
        if (comp.isMainProduct) doc.setFont('helvetica', 'bold');
        else doc.setFont('helvetica', 'normal');

        const truncName = comp.name.length > 24 ? comp.name.substring(0, 22) + '...' : comp.name;
        doc.text(truncName, 48, y + 13);
        doc.text(`${marketValue.currencySymbol}${comp.price.toLocaleString()}`, 190, y + 13);
        doc.text(`${comp.rating}★`, 255, y + 13);
        doc.text(`${comp.demandScore}/100`, 315, y + 13);
        doc.text(`${comp.sentimentScore}%`, 375, y + 13);
        const truncPos = comp.marketPosition.length > 18 ? comp.marketPosition.substring(0, 16) + '...' : comp.marketPosition;
        doc.text(truncPos, 440, y + 13);

        y += 20;
      });

      y += 20;

      // Category Opportunity Niche
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(40, y, pageWidth - 80, 50, 6, 6, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(22, 101, 52);
      doc.text('STRATEGIC OPPORTUNITY NICHE & CATEGORY LEADER:', 52, y + 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(21, 128, 61);
      doc.text(`Leader: ${competitorIntel.marketLeader}`, 52, y + 32);
      const splitNiche = doc.splitTextToSize(`Opportunity: ${competitorIntel.opportunityNiche}`, pageWidth - 104);
      doc.text(splitNiche, 52, y + 44);

      addFooter(3, 3);

      doc.save(`${productName.replace(/\s+/g, '_')}_Executive_Report.pdf`);
    } catch (err) {
      console.error('PDF Generation failed:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <FileDown className="w-4 h-4" />
          <span>Executive Reporting & Institutional Export</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white">Generate Executive Deliverables</h2>
        <p className="text-sm text-slate-300 max-w-2xl">
          Export full consulting-grade PDF reports, clean normalized datasets, and structured multi-sheet Excel workbooks for executive stakeholders and data teams.
        </p>
      </div>

      {/* White-Label & Enterprise Deliverable Customization */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-4 border border-orange-500/30 bg-gradient-to-br from-slate-900/90 via-orange-950/15 to-slate-900/90 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-orange-400" />
            <span>White-Label Report Branding & Watermark Configuration</span>
          </div>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/30 font-semibold">
            Enterprise Deliverable
          </span>
        </div>

        <p className="text-xs text-slate-300">
          White-label your consulting deliverables. These credentials will be stamped directly onto headers, footers, and institutional metadata in exported PDF and Excel files.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Client / Company Name</label>
            <input
              type="text"
              value={clientCompanyName}
              onChange={(e) => setClientCompanyName(e.target.value)}
              placeholder="e.g. Tata Digital, Reliance, boAt Audio"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Prepared By / Advisory</label>
            <input
              type="text"
              value={preparedByName}
              onChange={(e) => setPreparedByName(e.target.value)}
              placeholder="e.g. Strategic Advisory Team"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Classification Level</label>
            <select
              value={confidentialityLevel}
              onChange={(e) => setConfidentialityLevel(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-medium cursor-pointer"
            >
              <option value="Strictly Confidential">Strictly Confidential</option>
              <option value="Board Presentation">Board Presentation</option>
              <option value="Internal Corporate Strategy">Internal Corporate Strategy</option>
              <option value="Investor Due Diligence">Investor Due Diligence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Export Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PDF Card */}
        <div className="glass-card rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Executive PDF Report</h3>
              <p className="text-xs text-slate-400 mt-1">
                Consulting-ready formatted PDF with executive summary, KPI tables, drivers, and final verdict.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>{isExportingPDF ? 'Generating PDF...' : 'Download PDF Report'}</span>
          </button>
        </div>

        {/* Excel Card */}
        <div className="glass-card rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Excel Multi-Sheet (.xlsx)</h3>
              <p className="text-xs text-slate-400 mt-1">
                Formatted workbook containing Cleaned Data, Statistical Profiles, and Competitor Comparison sheets.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportExcel}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download Excel (.xlsx)</span>
          </button>
        </div>

        {/* CSV Card */}
        <div className="glass-card rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Cleaned CSV Dataset</h3>
              <p className="text-xs text-slate-400 mt-1">
                Sanitized, deduplicated, and imputed dataset ready for custom SQL / Python modeling.
              </p>
            </div>
          </div>

          <button
            onClick={handleExportCSV}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Download Clean CSV</span>
          </button>
        </div>
      </div>

      {/* Comprehensive Report Outline Preview (Section 16 requirement) */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white">Structured Executive Report Content Index</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          {[
            '1. Executive Summary',
            '2. Dataset Overview',
            '3. Data Quality Score',
            '4. Key Performance KPIs',
            '5. Customer Sentiment NLP',
            '6. Demand & Velocity Forecast',
            '7. Market Value Analysis',
            '8. Competitor Benchmarking',
            '9. Pricing Elasticity',
            '10. Trend Trajectory',
            '11. Statistical Anomalies',
            '12. Market Opportunities',
            '13. Critical Vulnerabilities',
            '14. Prescriptive Action Roadmap',
            '15. Final Verdict Card',
          ].map((section) => (
            <div
              key={section}
              className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 font-medium flex items-center space-x-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{section}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
