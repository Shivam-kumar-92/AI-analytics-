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
  Menu,
  X,
  Home,
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
  'E-commerce', 'Oil & Gas', 'Automobile', 'Electronics', 'FMCG',
  'Healthcare', 'Banking', 'Retail', 'Manufacturing', 'Technology', 'Other',
];

const NAV_TABS = [
  { id: 'landing', label: 'Home', icon: <Home className="w-4 h-4" /> },
  { id: 'overview', label: 'Executive Overview', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'sentiment', label: 'Review & Sentiment', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'demand', label: 'Demand Intelligence', icon: <Activity className="w-4 h-4" /> },
  { id: 'pricing', label: 'Pricing & Market Value', icon: <Layers className="w-4 h-4" /> },
  { id: 'competitor', label: 'Competitor Matrix', icon: <ChevronDown className="w-4 h-4" /> },
  { id: 'correlations', label: 'Statistics & Outliers', icon: <FileSpreadsheet className="w-4 h-4" /> },
  { id: 'chat', label: 'AI Analyst Chat', icon: <Sparkles className="w-4 h-4 text-indigo-400" /> },
  { id: 'export', label: 'Report & Export', icon: <UploadCloud className="w-4 h-4" /> },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const demoMenuRef = useRef<HTMLDivElement>(null);

  // Close demo menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (demoMenuRef.current && !demoMenuRef.current.contains(e.target as Node)) {
        setDemoMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const getDemoIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="w-4 h-4 text-amber-400" />;
      case 'Headphones': return <Headphones className="w-4 h-4 text-sky-400" />;
      case 'Car': return <Car className="w-4 h-4 text-emerald-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4 text-amber-300" />;
      case 'HeartPulse': return <HeartPulse className="w-4 h-4 text-rose-400" />;
      case 'CreditCard': return <CreditCard className="w-4 h-4 text-indigo-400" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      {/* Indian Tricolor Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF7700] via-white to-[#138808]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer flex-shrink-0"
            onClick={() => setActiveTab('landing')}
          >
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-[#FF7700] via-amber-400 to-[#138808] flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
              <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                  Yuktivya <span className="bg-gradient-to-r from-orange-400 to-emerald-400 bg-clip-text text-transparent">AI</span>
                </span>
                <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-gradient-to-r from-orange-500/15 to-emerald-500/15 text-orange-300 border border-orange-500/30">
                  Market Intelligence
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden md:block">AI Data Analyst &amp; Market Researcher</p>
            </div>
          </div>

          {/* Desktop Center Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
              <Layers className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <span className="text-slate-400 mr-1.5">Industry:</span>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value as Industry)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer pr-2"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind} className="bg-slate-900 text-white">{ind}</option>
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

            {/* Demos Dropdown */}
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
                      onClick={() => { onSelectDemo(d.id); setDemoMenuOpen(false); }}
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
                        <div className="text-xs font-bold truncate">{d.name}</div>
                        <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                          <span>{d.industry}</span><span>•</span>
                          <span className="text-indigo-400">{d.badge}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Area */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Made in India badge – hide on tiny screens */}
            <div className="hidden sm:flex">
              <MadeInIndia3D variant="compact-badge" />
            </div>

            {/* Upload button */}
            <button
              onClick={() => setActiveTab('upload')}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 hover:from-orange-500 hover:to-emerald-500 text-white shadow-md shadow-orange-600/25 transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Data</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* Hamburger - mobile only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-orange-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Tab Row */}
      <div className="border-t border-slate-800/60 bg-slate-950/50 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto py-1 text-xs">
          <div className="flex items-center space-x-1">
            {NAV_TABS.map((tab) => {
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
          <div className="hidden xl:flex items-center space-x-2 pl-4 text-[11px] text-slate-400 font-mono">
            <span>Active:</span>
            <span className="text-slate-200 font-bold max-w-[160px] truncate">{activeDatasetName}</span>
            {isSyntheticDemo && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">DEMO</span>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* MOBILE FULL-SCREEN SLIDE-IN DRAWER */}
      {/* ================================================================ */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] lg:hidden"
          style={{ top: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-slate-950 border-l border-slate-800 flex flex-col overflow-y-auto shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
              <div>
                <span className="font-extrabold text-lg text-white">Yuktivya <span className="text-orange-400">AI</span></span>
                <p className="text-[11px] text-slate-400">Market Intelligence Platform</p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tricolor stripe */}
            <div className="h-0.5 w-full bg-gradient-to-r from-[#FF7700] via-white to-[#138808]" />

            {/* Navigation Tabs */}
            <div className="px-4 py-4 space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 px-3 pb-2">Navigation</p>
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl font-medium transition-all cursor-pointer text-sm ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-emerald-500/20 text-white border border-orange-500/40 font-bold'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-white active:bg-slate-800'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="border-t border-slate-800 mx-4" />

            {/* Industry Selector in Drawer */}
            <div className="px-4 py-4 space-y-3">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 px-3">Industry Filter</p>
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm">
                <Layers className="w-4 h-4 text-slate-400 mr-3 flex-shrink-0" />
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value as Industry)}
                  className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer w-full"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind} className="bg-slate-900 text-white">{ind}</option>
                  ))}
                </select>
              </div>
              {selectedIndustry === 'Other' && (
                <input
                  type="text"
                  placeholder="Specify industry..."
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              )}
            </div>

            <div className="border-t border-slate-800 mx-4" />

            {/* Demos in Drawer */}
            <div className="px-4 py-4 space-y-2">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 px-3">Pre-Built Demos</p>
              {demos.map((d) => (
                <button
                  key={d.id}
                  onClick={() => { onSelectDemo(d.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer text-sm ${
                    activeDemoId === d.id
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                      : 'text-slate-300 hover:bg-slate-900 active:bg-slate-800'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                    {getDemoIcon(d.iconName)}
                  </div>
                  <div>
                    <div className="font-bold">{d.name}</div>
                    <div className="text-[11px] text-slate-400">{d.industry} · <span className="text-indigo-400">{d.badge}</span></div>
                  </div>
                </button>
              ))}
            </div>

            <div className="border-t border-slate-800 mx-4" />

            {/* Upload + Theme in Drawer */}
            <div className="px-4 py-4 space-y-3 pb-8">
              <button
                onClick={() => { setActiveTab('upload'); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 text-white shadow-md shadow-orange-600/25 cursor-pointer"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Upload Your Dataset</span>
              </button>

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium bg-slate-900 border border-slate-800 text-slate-300 cursor-pointer"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
                <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
              </button>

              {/* Made in India badge at drawer bottom */}
              <div className="flex justify-center pt-2">
                <MadeInIndia3D variant="compact-badge" />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
