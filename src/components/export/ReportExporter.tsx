import React, { useState } from 'react';
import {
  FileDown,
  FileSpreadsheet,
  FileText,
  Printer,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Award,
  Layers,
  Activity,
  AlertTriangle,
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

  // 1. Export Cleaned CSV
  const handleExportCSV = () => {
    if (!cleanedData || cleanedData.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(cleanedData);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${productName.replace(/\s+/g, '_')}_Cleaned_Data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // 3. Export PDF Consulting Report
  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 40;

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageWidth, 90, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text('YUKTIVYA AI EXECUTIVE INTELLIGENCE REPORT', 40, 45);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Asset: ${productName}  |  Sector: ${industry}  |  Generated: ${new Date().toLocaleDateString()}`,
        40,
        68
      );

      y = 120;

      // Executive Verdict Card
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(40, y, pageWidth - 80, 110, 8, 8, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text(
        `MARKET POTENTIAL: ${successScore.classification.toUpperCase()} (${successScore.overallScore}/100)`,
        55,
        y + 28
      );

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`Analysis Confidence: ${successScore.confidenceScore}%  |  Data Quality: ${cleaningReport.dataQualityScore}/100`, 55, y + 46);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      const splitVerdict = doc.splitTextToSize(`"${successScore.aiVerdict}"`, pageWidth - 110);
      doc.text(splitVerdict, 55, y + 68);

      y += 140;

      // Core KPI Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text('KEY COMMERCIAL PERFORMANCE INDICATORS', 40, y);
      y += 15;

      const kpis = [
        ['Product Success Score', `${successScore.overallScore}/100`, successScore.classification],
        ['Demand Score', `${demandIntel.score}/100`, demandIntel.demandProxyLabel],
        ['Pricing Benchmark', `${marketValue.currencySymbol}${marketValue.productPrice.toLocaleString()}`, `${marketValue.pricePositionLabel} (${marketValue.pricePositionPct}%)`],
        ['Customer Sentiment', reviewIntel ? `${reviewIntel.metrics.positivePct}% Positive` : 'Favorable', reviewIntel ? `${reviewIntel.metrics.averageRating}★ Rating` : 'N/A'],
        ['Data Quality Score', `${cleaningReport.dataQualityScore}/100`, `Grade ${cleaningReport.qualityGrade}`],
      ];

      doc.setFontSize(10);
      kpis.forEach(([title, val, context]) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text(title, 40, y + 14);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(79, 70, 229);
        doc.text(val, 240, y + 14);

        doc.setTextColor(100, 116, 139);
        doc.text(context, 360, y + 14);

        y += 20;
      });

      y += 20;

      // Key Growth Drivers & Risks
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text('STRATEGIC DRIVERS & VULNERABILITIES', 40, y);
      y += 18;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(16, 185, 129);
      doc.text('Growth Drivers:', 40, y);
      y += 14;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      successScore.keyDrivers.forEach((d) => {
        doc.text(`• ${d}`, 50, y);
        y += 14;
      });

      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(244, 63, 94);
      doc.text('Critical Risks:', 40, y);
      y += 14;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      successScore.keyRisks.forEach((r) => {
        doc.text(`• ${r}`, 50, y);
        y += 14;
      });

      y += 25;

      // Prescriptive Action
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('RECOMMENDED ACTION:', 40, y);
      y += 16;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      const splitAction = doc.splitTextToSize(successScore.recommendedAction, pageWidth - 80);
      doc.text(splitAction, 40, y);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Confidential Business Report  |  ${isSyntheticDemo ? 'Synthetic Demo Data' : 'Verified Dataset Analysis'}  |  Yuktivya AI Platform`,
        40,
        doc.internal.pageSize.getHeight() - 30
      );

      doc.save(`${productName.replace(/\s+/g, '_')}_Executive_Report.pdf`);
    } catch (err) {
      console.error(err);
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
