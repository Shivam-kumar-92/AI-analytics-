import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  FileDown,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
} from 'lucide-react';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

const triggerHaptic = (ms = 10) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(ms);
    } catch {
      // ignore
    }
  }
};

const TOUR_STEPS = [
  {
    step: 1,
    badge: 'Step 1 of 3: Ingestion & Hygiene',
    title: 'Automated Ingestion & Data Quality Scoring',
    icon: Sparkles,
    iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    description:
      'Upload messy Excel spreadsheets or CSVs from any industry. Yuktivya AI automatically cleans missing records, caps statistical outliers, infers semantic columns, and grades data quality before running analytics.',
    highlights: [
      'Automatic outlier normalization (Z-score & IQR)',
      'Deterministic type inference for pricing & volumes',
      'Downloadable sample datasets for instant 1-click testing',
    ],
    targetTab: 'upload',
  },
  {
    step: 2,
    badge: 'Step 2 of 3: Quantitative Modeling',
    title: 'Econometric Forecasting & What-If Stress Testing',
    icon: Sliders,
    iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    description:
      'Gain strategic foresight with ARIMA demand modeling, price elasticity curves, and Monte Carlo stochastic spreads. Use the Interactive Scenario Simulator to stress-test demand against climate, tariff, and inflation shocks in real time.',
    highlights: [
      'Multi-period demand trajectory extrapolation',
      'Interactive What-If sliders for supply, tariffs & inflation',
      'Competitor price positioning & market share elasticity',
    ],
    targetTab: 'demand',
  },
  {
    step: 3,
    badge: 'Step 3 of 3: Strategic Delivery',
    title: 'Neural AI Analyst & Board-Ready PDF Reports',
    icon: FileDown,
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    description:
      'Consult with the conversational AI Analyst in English or Hindi using speech recognition and audio briefings. Export complete, multi-page executive PDF and Excel packages branded with custom enterprise watermarks.',
    highlights: [
      '100% client-side privacy architecture (DPDP Act aligned)',
      'Real-time token streaming with Bring-Your-Own-Key Gemini AI',
      'Watermarked PDF dossiers tailored for executive boards',
    ],
    targetTab: 'chat',
  },
];

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const current = TOUR_STEPS[currentStep];
  const IconComponent = current.icon;

  const handleNext = () => {
    triggerHaptic(10);
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    triggerHaptic(10);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleJumpToFeature = () => {
    triggerHaptic(15);
    if (onNavigateToTab && current.targetTab) {
      onNavigateToTab(current.targetTab);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700/80 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Background ambient gradient glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              {current.badge}
            </span>
          </div>

          <button
            onClick={() => {
              triggerHaptic(10);
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="space-y-4 relative z-10">
          <div className="flex items-start space-x-4">
            <div className={`p-3.5 rounded-2xl border shrink-0 ${current.iconColor}`}>
              <IconComponent className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {current.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {current.description}
              </p>
            </div>
          </div>

          {/* Highlights checklist */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            {current.highlights.map((h, i) => (
              <div key={i} className="flex items-center space-x-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Dots & Navigation Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800 relative z-10">
          {/* Step indicators */}
          <div className="flex items-center space-x-2">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  triggerHaptic(10);
                  setCurrentStep(idx);
                }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx
                    ? 'w-8 bg-indigo-500 shadow-md shadow-indigo-500/40'
                    : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleJumpToFeature}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Explore This Tab
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>{currentStep === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
