import React, { useState } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Layers,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RefreshCw,
  Coins,
  Search,
} from 'lucide-react';
import { DataCleaningReport } from '../../types';

export interface ColumnMappingConfig {
  productColumn?: string;
  priceColumn?: string;
  reviewColumn?: string;
  ratingColumn?: string;
  salesColumn?: string;
  competitorPriceColumn?: string;
  currencySymbol?: string;
}

interface DataPreviewTableProps {
  data: Record<string, any>[];
  report: DataCleaningReport;
  fileName: string;
  onProceedToAnalysis: () => void;
  onApplyColumnMapping?: (mapping: ColumnMappingConfig) => void;
  initialMapping?: ColumnMappingConfig;
}

export const DataPreviewTable: React.FC<DataPreviewTableProps> = ({
  data,
  report,
  fileName,
  onProceedToAnalysis,
  onApplyColumnMapping,
  initialMapping,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterColumn, setFilterColumn] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const columns = Object.keys(data[0] || {});

  const filteredRows = React.useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase().trim();
    return data.filter((row) => {
      if (filterColumn !== 'ALL') {
        return String(row[filterColumn] ?? '').toLowerCase().includes(q);
      }
      return Object.values(row).some((val) => String(val ?? '').toLowerCase().includes(q));
    });
  }, [data, searchQuery, filterColumn]);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const currentRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterColumn]);

  // Column Mapping Local State
  const [showMappingPanel, setShowMappingPanel] = useState(false);
  const [productCol, setProductCol] = useState(initialMapping?.productColumn || '');
  const [priceCol, setPriceCol] = useState(initialMapping?.priceColumn || '');
  const [reviewCol, setReviewCol] = useState(initialMapping?.reviewColumn || '');
  const [ratingCol, setRatingCol] = useState(initialMapping?.ratingColumn || '');
  const [salesCol, setSalesCol] = useState(initialMapping?.salesColumn || '');
  const [competitorCol, setCompetitorCol] = useState(initialMapping?.competitorPriceColumn || '');
  const [currencySymbol, setCurrencySymbol] = useState(initialMapping?.currencySymbol || '₹');
  const [mappingAppliedNotice, setMappingAppliedNotice] = useState(false);

  const handleApplyMapping = () => {
    if (!onApplyColumnMapping) return;
    onApplyColumnMapping({
      productColumn: productCol,
      priceColumn: priceCol,
      reviewColumn: reviewCol,
      ratingColumn: ratingCol,
      salesColumn: salesCol,
      competitorPriceColumn: competitorCol,
      currencySymbol,
    });
    setMappingAppliedNotice(true);
    setTimeout(() => setMappingAppliedNotice(false), 3000);
  };

  const typeColorMap: Record<string, string> = {
    numeric: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    currency: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    rating: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    date: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    review_text: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    category: 'bg-slate-800 text-slate-300 border-slate-700',
    id: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-4">
      {/* Header Diagnostic Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Data Ingestion & Integrity Check
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400 font-mono">{fileName}</span>
          </div>
          <h2 className="text-2xl font-black text-white">Dataset Normalized & Cleaned</h2>
          <p className="text-xs text-slate-400">
            Detected {report.cleanedRowCount.toLocaleString()} rows and {report.totalColumns} attributes. Missing values imputed, duplicates purged, and types verified.
          </p>
        </div>

        {/* Quality Score Badge */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 p-3 px-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Data Quality Score
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-emerald-400">{report.dataQualityScore}</span>
                <span className="text-xs text-slate-500">/ 100</span>
                <span className="ml-2 text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Grade {report.qualityGrade}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onProceedToAnalysis}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all cursor-pointer group"
          >
            <span>Run Market Intelligence</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Metric summary boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Cleaned Records
          </span>
          <span className="text-xl font-bold text-white mt-1 block">
            {report.cleanedRowCount.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500">From {report.originalRowCount} raw inputs</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Duplicates Purged
          </span>
          <span className="text-xl font-bold text-indigo-400 mt-1 block">
            {report.duplicatesRemoved}
          </span>
          <span className="text-[10px] text-slate-500">Identified via row fingerprint</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Missing Cells Filled
          </span>
          <span className="text-xl font-bold text-amber-400 mt-1 block">
            {report.missingCellsFilled}
          </span>
          <span className="text-[10px] text-slate-500">Imputed with median/mode</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            IQR Outliers Flagged
          </span>
          <span className="text-xl font-bold text-rose-400 mt-1 block">
            {report.outliersCount}
          </span>
          <span className="text-[10px] text-slate-500">Crossing 1.5× IQR threshold</span>
        </div>
      </div>

      {/* Attribute Type Profiling Badges */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Auto-Inferred Attribute Profiles & Data Types</span>
          </div>

          <button
            onClick={() => setShowMappingPanel(!showMappingPanel)}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 transition-colors cursor-pointer w-fit"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>{showMappingPanel ? 'Hide Column Mapping' : 'Customize Column Roles & Currency'}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {report.columnProfiles.map((col) => (
            <div
              key={col.name}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
            >
              <span className="font-bold text-white">{col.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                  typeColorMap[col.detectedType] || 'bg-slate-800 text-slate-300'
                }`}
              >
                {col.detectedType}
              </span>
              {col.mean !== undefined && (
                <span className="text-[10px] text-slate-500 font-mono">avg: {col.mean}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Column Mapping & Currency Configuration Drawer/Card */}
      {showMappingPanel && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 shadow-2xl space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Custom Schema & Column Role Mapping</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Precision Override
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Override automated column detection to ensure custom column headers (e.g. "MRP", "Customer_Feedback", "Units_Sold") are mapped accurately.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {mappingAppliedNotice && (
                <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1 animate-pulse">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mapping applied!</span>
                </span>
              )}
              <button
                onClick={handleApplyMapping}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-run Analysis</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. Product Name */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <label className="text-slate-300 font-semibold block">Product / Offering Name</label>
              <select
                value={productCol}
                onChange={(e) => setProductCol(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="">Auto-Detect ({initialMapping?.productColumn || 'Default'})</option>
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            {/* 2. Price Column */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <label className="text-slate-300 font-semibold block">Selling Price / Cost</label>
              <select
                value={priceCol}
                onChange={(e) => setPriceCol(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="">Auto-Detect ({initialMapping?.priceColumn || 'None'})</option>
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            {/* 3. Currency Symbol */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <label className="text-slate-300 font-semibold block flex items-center space-x-1">
                <Coins className="w-3 h-3 text-amber-400" />
                <span>Currency Symbol</span>
              </label>
              <select
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="₹">₹ (INR - Indian Rupee)</option>
                <option value="$">$ (USD - US Dollar)</option>
                <option value="€">€ (EUR - Euro)</option>
                <option value="£">£ (GBP - British Pound)</option>
                <option value="¥">¥ (JPY / CNY)</option>
                <option value="AED">AED (UAE Dirham)</option>
                <option value="CAD">CAD (Canadian Dollar)</option>
              </select>
            </div>

            {/* 4. Customer Review Text */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <label className="text-slate-300 font-semibold block">Customer Feedback / Reviews</label>
              <select
                value={reviewCol}
                onChange={(e) => setReviewCol(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="">Auto-Detect ({initialMapping?.reviewColumn || 'None'})</option>
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            {/* 5. Rating Column */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <label className="text-slate-300 font-semibold block">Rating (1 - 5 Stars)</label>
              <select
                value={ratingCol}
                onChange={(e) => setRatingCol(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="">Auto-Detect ({initialMapping?.ratingColumn || 'None'})</option>
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            {/* 6. Sales / Volume Column */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <label className="text-slate-300 font-semibold block">Sales / Orders / Volume</label>
              <select
                value={salesCol}
                onChange={(e) => setSalesCol(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="">Auto-Detect ({initialMapping?.salesColumn || 'None'})</option>
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            {/* 7. Competitor Benchmark Column */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <label className="text-slate-300 font-semibold block">Competitor / Benchmark Price</label>
              <select
                value={competitorCol}
                onChange={(e) => setCompetitorCol(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="">Auto-Detect ({initialMapping?.competitorPriceColumn || 'None'})</option>
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Live Data Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search values, keywords, feedback, or prices..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Search in:</span>
            <select
              value={filterColumn}
              onChange={(e) => setFilterColumn(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="ALL">All Columns</option>
              {columns.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap">
            Showing <strong>{filteredRows.length.toLocaleString()}</strong> of {data.length.toLocaleString()} rows
          </span>
        </div>
      </div>

      {/* Data Table Grid */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-900/90 text-slate-300 uppercase tracking-wider sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-12 text-slate-500 font-mono">#</th>
                {columns.map((col) => (
                  <th key={col} className="py-3 px-4 font-bold text-white">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {currentRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 px-4 text-slate-500 font-mono">
                    {(currentPage - 1) * rowsPerPage + idx + 1}
                  </td>
                  {columns.map((col) => {
                    const val = row[col];
                    const isReviewText = String(val).length > 40;
                    return (
                      <td
                        key={col}
                        className={`py-2.5 px-4 text-slate-200 ${
                          isReviewText ? 'max-w-md truncate' : 'whitespace-nowrap'
                        }`}
                        title={String(val)}
                      >
                        {String(val ?? '')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-t border-slate-800 text-xs">
          <span className="text-slate-400">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
            {Math.min(currentPage * rowsPerPage, data.length)} of {data.length} records
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-300 font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
