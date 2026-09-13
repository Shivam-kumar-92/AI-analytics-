import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  FileSpreadsheet,
  Droplets,
  Headphones,
  Car,
  ShoppingBag,
  HeartPulse,
  CreditCard,
  UploadCloud,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';
import { Industry } from '../../types';
import { DemoConfig } from '../../datasets';
import { MadeInIndia3D } from '../3d/MadeInIndia3D';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedIndustry: Industry;
  setSelectedIndustry: (ind: Industry) => void;
  customIndustry: string;
  setCustomIndustry: (ind: string) => void;
  demos: DemoConfig[];
  activeDemoId?: string;
  onSelectDemo: (demoId: string) => void;
  activeDatasetName: string;
  isSyntheticDemo: boolean;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
}

const INDUSTRIES: Industry[] = [
  'E-commerce',
  'Oil & Gas',
  'Automobile',
  'Electronics',
  'FMCG',
  'Healthcare',
  'Banking',
  'Retail',
  'Manufacturing',
  'Technology',
  'Other',
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedIndustry,
  setSelectedIndustry,
  customIndustry,
  setCustomIndustry,
  demos,
  activeDemoId,
  onSelectDemo,
  activeDatasetName,
  isSyntheticDemo,
  theme,
  setTheme,
}) => {
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const demoMenuRef = useRef<HTMLDivElement>(null);

  // Close demo menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (demoMenuRef.current && !demoMenuRef.current.contains(e.target as Node)) {
        setDemoMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDemoIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="w-3.5 h-3.5 text-amber-400" />;
      case 'Headphones': return <Headphones className="w-3.5 h-3.5 text-sky-400" />;
      case 'Car': return <Car className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />;
      case 'HeartPulse': return <HeartPulse className="w-3.5 h-3.5 text-rose-400" />;
      case 'CreditCard': return <CreditCard className="w-3.5 h-3.5 text-indigo-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      {/* Indian Tricolor Ribbon Bar: Orange, White, Green */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF7700] via-white to-[#138808] shadow-sm shadow-orange-500/20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#FF7700] via-amber-400 to-[#138808] flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Activity className="h-5 w-5 text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">Yuktivya <span className="bg-gradient-to-r from-orange-400 to-emerald-400 bg-clip-text text-transparent">AI</span></span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-gradient-to-r from-orange-500/15 to-emerald-500/15 text-orange-300 border border-orange-500/30">
                  Market Intelligence
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">AI Data Analyst & Market Researcher</p>
            </div>
          </div>

          {/* Center Actions: Industry Selector & Demos Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Industry Selector */}
            <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
              <Layers className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <span className="text-slate-400 mr-1.5">Industry:</span>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value as Industry)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer pr-2"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind} className="bg-slate-900 text-white">
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {selectedIndustry === 'Other' && (
              <input
                type="text"
                placeholder="Specify industry..."
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-36"
              />
            )}

            {/* Demos Dropdown Menu */}
            <div className="relative" ref={demoMenuRef}>
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-slate-900 to-orange-950/40 hover:border-orange-500/50 border border-slate-800 text-white transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>Pre-Built Demos (6)</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${demoMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {demoMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    Select Industry Demo
                  </div>
                  {demos.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        onSelectDemo(d.id);
                        setDemoMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        activeDemoId === d.id
                          ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                          : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                        {getDemoIcon(d.iconName)}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-xs font-bold truncate">{d.name}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                          <span>{d.industry}</span>
                          <span>•</span>
                          <span className="text-indigo-400">{d.badge}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Area: Made in India 3D Badge, Upload Button, Theme Switch */}
          <div className="flex items-center space-x-3">
            {/* 3D Made in India Interactive Badge */}
            <MadeInIndia3D variant="compact-badge" />

            <button
              onClick={() => setActiveTab('upload')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 hover:from-orange-500 hover:to-emerald-500 text-white shadow-md shadow-orange-600/25 transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Data</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="border-t border-slate-800/60 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto py-1 text-xs">
          <div className="flex items-center space-x-1">
            {[
              { id: 'landing', label: 'Home', icon: <Activity className="w-3.5 h-3.5" /> },
              { id: 'overview', label: 'Executive Overview', icon: <BarChart3 className="w-3.5 h-3.5" /> },
              { id: 'sentiment', label: 'Review & Sentiment', icon: <Sparkles className="w-3.5 h-3.5" /> },
              { id: 'demand', label: 'Demand Intelligence', icon: <Activity className="w-3.5 h-3.5" /> },
              { id: 'pricing', label: 'Pricing & Market Value', icon: <Layers className="w-3.5 h-3.5" /> },
              { id: 'competitor', label: 'Competitor Matrix', icon: <ChevronDown className="w-3.5 h-3.5" /> },
              { id: 'correlations', label: 'Statistics & Outliers', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
              { id: 'chat', label: 'AI Analyst Chat', icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> },
              { id: 'export', label: 'Report & Export', icon: <UploadCloud className="w-3.5 h-3.5" /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/20 via-amber-500/15 to-emerald-500/20 text-white border border-orange-500/40 font-bold shadow-sm shadow-orange-500/15'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center space-x-2 pl-4 text-[11px] text-slate-400 font-mono">
            <span>Active:</span>
            <span className="text-slate-200 font-bold max-w-[160px] truncate">{activeDatasetName}</span>
            {isSyntheticDemo && (
              <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
                DEMO
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
