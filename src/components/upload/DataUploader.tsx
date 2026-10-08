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
  Zap,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { DataParser } from '../../engine/dataParser';
import { DemoConfig } from '../../datasets';
import { generateSyntheticDataset, SYNTHETIC_SECTORS } from '../../engine/syntheticDataGenerator';

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
  const [syntheticSector, setSyntheticSector] = useState(SYNTHETIC_SECTORS[0].id);
  const [syntheticRowCount, setSyntheticRowCount] = useState<number>(250);
  const [isGeneratingSynthetic, setIsGeneratingSynthetic] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateSynthetic = () => {
    setIsGeneratingSynthetic(true);
    try {
      const generated = generateSyntheticDataset(syntheticSector, syntheticRowCount);
      onDataLoaded(generated.data, generated.datasetName, true);
    } catch (err: any) {
      setError(err.message || 'Failed to generate synthetic dataset.');
    } finally {
      setIsGeneratingSynthetic(false);
    }
  };

  const handleDownloadSampleAgri = () => {
    const csvContent = [
      'Date,Commodity,Mandi_Market,Arrival_Bags,Modal_Price_Quintal,Moisture_Pct,Rating,Competitor_Benchmark_Price,Review_Feedback',
      '2026-09-01,Salem Turmeric,Erode APMC,1240,14850,11.2,4.6,15200,"High curcumin content, excellent export grade standard."',
      '2026-09-02,Salem Turmeric,Nizamabad Mandi,1580,14600,11.8,4.4,14950,"Steady demand from spice extractors and bulk traders."',
      '2026-09-03,Salem Turmeric,Sangli Market,920,15100,10.9,4.8,15400,"Premium organic polish with zero pesticide residue."',
      '2026-09-04,Salem Turmeric,Duggirala APMC,1350,14720,11.5,4.3,14900,"Good yellow pigmentation, slight rain moisture noted."',
      '2026-09-05,Salem Turmeric,Kesamudram Mandi,890,14980,11.1,4.7,15350,"Surging spot demand due to festive season procurement."',
      '2026-09-06,Salem Turmeric,Nanded Yard,1100,14650,11.4,4.5,15000,"Consistent bulk trade, steady inquiries from Middle East exporters."',
      '2026-09-07,Salem Turmeric,Warangal Mandi,1420,14790,11.3,4.6,15120,"High finger density, strong buyer turnout across sessions."'
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Indian_Agri_Commodities_Sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSampleRetail = () => {
    const csvContent = [
      'Order_Date,Product_Name,Category,Units_Sold,Unit_Price,Customer_Rating,Competitor_Price,Customer_Review',
      '2026-09-01,Aura Pro Earbuds,Audio Electronics,450,2499,4.7,2999,"Outstanding active noise cancellation and crisp bass quality."',
      '2026-09-02,Aura Pro Earbuds,Audio Electronics,520,2499,4.8,2999,"Battery lasts over 30 hours, mic clarity on calls is top notch."',
      '2026-09-03,Aura Pro Earbuds,Audio Electronics,380,2499,4.2,2850,"Great build quality, ear tips could be slightly softer for long wear."',
      '2026-09-04,Aura Pro Earbuds,Audio Electronics,610,2499,4.9,2999,"Unbeatable value for money compared to leading foreign brands."',
      '2026-09-05,Aura Pro Earbuds,Audio Electronics,490,2499,4.6,2899,"Fast Bluetooth pairing and seamless multi-device connection."',
      '2026-09-06,Aura Pro Earbuds,Audio Electronics,540,2499,4.7,2999,"Impressive low latency mode for gaming and streaming movies."',
      '2026-09-07,Aura Pro Earbuds,Audio Electronics,580,2499,4.8,2999,"Sleek pocket-sized case and fast USB-C charge delivery."'
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Consumer_Retail_FMCG_Sample.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Enforce 50MB file size limit before reading into memory
    const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the maximum allowed limit of 50MB.`);
      return;
    }

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

    const MAX_PASTE_CHARS = 25 * 1024 * 1024;
    if (pasteText.length > MAX_PASTE_CHARS) {
      setError('Pasted content exceeds the maximum size limit (25MB). Please upload as a file instead.');
      return;
    }

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

      {/* 1-Click Sample Dataset Downloads & DPDP Act Data Privacy Guarantee */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sample Datasets Card */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Download Formatted Sample CSVs</h4>
              <p className="text-[11px] text-slate-400">Test ingestion, column mapping, and AI forecasting in seconds</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              onClick={handleDownloadSampleAgri}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Agri-Commodity Sample CSV</span>
            </button>
            <button
              onClick={handleDownloadSampleRetail}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 hover:text-white transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
              <span>FMCG Retail Sample CSV</span>
            </button>
          </div>
        </div>

        {/* DPDP Privacy & Sovereignty Card */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Sovereign Data Privacy & DPDP Compliance</h4>
              <p className="text-[11px] text-slate-400">Digital Personal Data Protection Act (2023) architecture</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            All spreadsheet cleaning, ARIMA projections, and Monte Carlo models run <strong className="text-emerald-400 font-semibold">100% inside your client device's browser memory</strong>. Your proprietary datasets never touch foreign cloud servers.
          </p>
        </div>
      </div>

      {/* One-Click Synthetic Test Data Generator (Roadmap Feature 3.B) */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-5 border border-indigo-500/30 bg-gradient-to-br from-slate-900/90 via-indigo-950/20 to-slate-900/90 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400/20 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>One-Click Synthetic Test Data Generator</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                  Live Simulation
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Instantly synthesize hundreds of realistic Indian market rows across key sectors without needing your own CSV.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Industry Sector Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Industry & Product Domain</label>
            <select
              value={syntheticSector}
              onChange={(e) => setSyntheticSector(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {SYNTHETIC_SECTORS.map((sec) => (
                <option key={sec.id} value={sec.id} className="bg-slate-900 text-white">
                  {sec.name} ({sec.sector})
                </option>
              ))}
            </select>
          </div>

          {/* Row Count Pills */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Dataset Volume (Rows)</label>
            <div className="grid grid-cols-4 gap-2">
              {[100, 250, 500, 1000].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setSyntheticRowCount(count)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    syntheticRowCount === count
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {count} rows
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400">
            Synthesizes reviews, star ratings, dynamic prices, units ordered, and geographic segments.
          </span>
          <button
            onClick={handleGenerateSynthetic}
            disabled={isGeneratingSynthetic}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white shadow-lg shadow-indigo-600/25 transition-all cursor-pointer flex items-center justify-center space-x-2 shrink-0"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Generate & Analyze {syntheticRowCount} Rows</span>
          </button>
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
