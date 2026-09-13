import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  FileCode,
  Sparkles,
  ClipboardPaste,
  Droplets,
  Headphones,
  Car,
  ShoppingBag,
  HeartPulse,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { DataParser } from '../../engine/dataParser';
import { DemoConfig } from '../../datasets';

interface DataUploaderProps {
  onDataLoaded: (data: Record<string, any>[], fileName: string, isSynthetic: boolean) => void;
  demos: DemoConfig[];
  onSelectDemo: (demoId: string) => void;
}

export const DataUploader: React.FC<DataUploaderProps> = ({
  onDataLoaded,
  demos,
  onSelectDemo,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsProcessing(true);
    setError(null);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'xlsx' || ext === 'xls') {
        const res = await DataParser.parseExcel(file);
        if (res.error) throw new Error(res.error);
        onDataLoaded(res.data, file.name, false);
      } else if (ext === 'json') {
        const text = await file.text();
        const res = DataParser.parseJSON(text, file.name);
        if (res.error) throw new Error(res.error);
        onDataLoaded(res.data, file.name, false);
      } else {
        // CSV or TXT
        const text = await file.text();
        const res = DataParser.parseCSV(text, file.name);
        if (res.error) throw new Error(res.error);
        onDataLoaded(res.data, file.name, false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to parse the uploaded file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasteSubmit = () => {
    if (!pasteText.trim()) return;
    setIsProcessing(true);
    setError(null);

    try {
      const res = DataParser.parseText(pasteText, 'Pasted_Data.csv');
      if (res.error || res.data.length === 0) {
        throw new Error(res.error || 'Could not parse tabular data from clipboard.');
      }
      onDataLoaded(res.data, 'Pasted_Dataset', false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getDemoIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="w-5 h-5 text-amber-400" />;
      case 'Headphones': return <Headphones className="w-5 h-5 text-sky-400" />;
      case 'Car': return <Car className="w-5 h-5 text-emerald-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-amber-300" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-rose-400" />;
      case 'CreditCard': return <CreditCard className="w-5 h-5 text-indigo-400" />;
      default: return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Universal Data Ingestion & Analytics Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Upload Any Product, Review or Market Dataset
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Ingest raw data across E-commerce, Energy, Automotive, MedTech, FMCG, or Banking. Our automated pipeline handles data cleaning, type inference, sentiment NLP, demand forecasting, and competitor benchmarking.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
          dragActive
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-700/80 bg-slate-900/50 hover:border-indigo-500/50 hover:bg-slate-900/80'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.json,.txt"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <UploadCloud className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              {isProcessing ? 'Cleaning & Normalizing Dataset...' : 'Drag & Drop your dataset here, or Browse Files'}
            </h3>
            <p className="text-xs text-slate-400">
              Supports CSV, Excel (.xlsx, .xls), JSON, TXT tabular reports (Max 50MB)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV & Excel</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
              <FileCode className="w-3.5 h-3.5 text-sky-400" />
              <span>JSON Structured</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Text & Delimited</span>
            </span>
          </div>
        </div>
      </div>

      {/* Manual Paste Section */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <ClipboardPaste className="w-4 h-4 text-indigo-400" />
            <span>Or Copy & Paste Data (CSV, TSV, or JSON)</span>
          </div>
          <span className="text-xs text-slate-400">Direct clipboard ingestion</span>
        </div>

        <textarea
          rows={3}
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder={`Product,Price,Demand,Sales,Rating\nWireless Earbuds,1499,84,12000,4.2\nCompetitor Alpha,1699,78,9800,4.0`}
          className="w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 placeholder-slate-600 resize-none"
        />

        <div className="flex justify-end">
          <button
            onClick={handlePasteSubmit}
            disabled={!pasteText.trim()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Parse Pasted Data
          </button>
        </div>
      </div>

      {/* Quick Launch Pre-Built Demos (6 Industry Examples) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Explore 6 Ready-To-Run Industry Demonstration Datasets</span>
          </div>
          <span className="text-xs text-indigo-400 font-medium">Click any card to instantly load</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {demos.map((d) => (
            <div
              key={d.id}
              onClick={() => onSelectDemo(d.id)}
              className="glass-card rounded-2xl p-5 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-900/90 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform">
                    {getDemoIcon(d.iconName)}
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider">
                    {d.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {d.name}
                </h4>
                <span className="text-[11px] text-slate-400 font-semibold block mb-2">
                  {d.industry}
                </span>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {d.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>{d.datasetFileName}</span>
                <span className="text-indigo-400 font-bold group-hover:translate-x-1 transition-transform">
                  Load →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
