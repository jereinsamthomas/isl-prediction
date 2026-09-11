import React from 'react';
import { Shield, Activity, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  apiHealthy: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ apiHealthy, activeTab, setActiveTab }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-[#0a0e17]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo and Branding */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                ISL <span className="text-emerald-400">Football Intelligence</span>
              </span>
              <span className="hidden md:inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                v1.0 ML
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Machine Learning Match Prediction & Advanced Analytics • SRMIST
            </p>
          </div>
        </div>

        {/* Right Actions & Status Badges */}
        <div className="flex items-center gap-3">
          {/* API Health Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-white/10 text-xs">
            <span className="relative flex h-2 w-2">
              {apiHealthy ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              )}
            </span>
            <span className="text-slate-300 font-medium hidden sm:inline">
              {apiHealthy ? 'API Active • 1,100 Matches' : 'Connecting API...'}
            </span>
          </div>

          {/* Quick CTA: Predict */}
          <button
            onClick={() => setActiveTab('predictor')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              activeTab === 'predictor'
                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Predict Match</span>
          </button>

          {/* Research Page Quick Link */}
          <button
            onClick={() => setActiveTab('research')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="View Research Paper & Architecture"
          >
            <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
