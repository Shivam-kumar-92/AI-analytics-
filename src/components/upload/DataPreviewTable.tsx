import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Hash,
} from 'lucide-react';
import { DataCleaningReport } from '../../types';

interface DataPreviewTableProps {
  data: Record<string, any>[];
  report: DataCleaningReport;
  fileName: string;
  onProceedToAnalysis: () => void;
}

export const DataPreviewTable: React.FC<DataPreviewTableProps> = ({
  data,
  report,
  fileName,
  onProceedToAnalysis,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const totalPages = Math.ceil(data.length / rowsPerPage) || 1;
  const currentRows = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const columns = Object.keys(data[0] || {});

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
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>Auto-Inferred Attribute Profiles & Data Types</span>
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
