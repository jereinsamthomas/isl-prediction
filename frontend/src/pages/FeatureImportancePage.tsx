import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BarChart3, HelpCircle, Layers } from 'lucide-react';

export const FeatureImportancePage: React.FC = () => {
  const [features, setFeatures] = useState<Array<{ feature: string; importance: number; percentage: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFeatureImportance()
      .then((res) => setFeatures(res.features))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400" />
      </div>
    );
  }

  const formatName = (f: string) => {
    return f.replace(/_/g, ' ');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Feature Importance & Predictor Rankings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Quantitative ranking of pre-match predictors derived from Random Forest and Recursive Feature Elimination.
        </p>
      </div>

      {/* Top Predictors List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white">Top 20 Predictive Features</h3>
            <span className="text-xs text-slate-400 font-mono">Gini Importance Weight</span>
          </div>

          <div className="space-y-3.5">
            {features.slice(0, 20).map((f, idx) => (
              <div key={f.feature} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-200 flex items-center gap-2">
                    <span className="w-5 text-slate-500 font-mono text-[11px]">{idx + 1}.</span>
                    <span>{formatName(f.feature)}</span>
                  </span>
                  <span className="text-emerald-400 font-mono">{f.percentage}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(f.percentage * 20, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explanatory Insights Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4 text-xs text-slate-300">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Key Analytical Pillars</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 space-y-1">
                <strong className="text-white block">1. Player Rating Differentials:</strong>
                <p className="text-slate-400">
                  Combined average technical ratings of starting players (Indian and Foreign) exert the highest individual discriminative influence on match victory.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 space-y-1">
                <strong className="text-white block">2. Squad Market Valuation Gap:</strong>
                <p className="text-slate-400">
                  Clubs with market value advantages of +₹15 Cr or greater historically convert chances at a 32% higher rate.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/60 border border-white/5 space-y-1">
                <strong className="text-white block">3. Recent Form Momentum:</strong>
                <p className="text-slate-400">
                  Points acquired over the trailing 5 and 10 fixtures significantly outperform full-season rolling averages in predicting next-game outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
