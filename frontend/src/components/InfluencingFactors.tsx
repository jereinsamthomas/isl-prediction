import React from 'react';
import { CheckCircle2, AlertCircle, BarChart3, HelpCircle } from 'lucide-react';

interface InfluencingFactorsProps {
  factors: {
    positive: string[];
    negative: string[];
  };
  topFeatures?: Array<{
    feature: string;
    importance: number;
    percentage: number;
  }>;
}

export const InfluencingFactors: React.FC<InfluencingFactorsProps> = ({ factors, topFeatures = [] }) => {
  const formatFeatureName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .replace(/Pct/g, '%')
      .replace(/Pts/g, 'Points')
      .replace(/Diff/g, 'Differential');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Qualitative Influencing Factors Card */}
      <div className="rounded-3xl glass-panel p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h4 className="text-base font-bold text-white tracking-wide">Key Influencing Pre-Match Factors</h4>
        </div>

        <div className="space-y-4">
          {/* Positive Factors */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Positive Home Indicators
            </h5>
            {factors.positive.length > 0 ? (
              <ul className="space-y-2">
                {factors.positive.map((f, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/15">
                    <span className="text-emerald-400 font-bold">+</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">No significant positive home differentials found.</p>
            )}
          </div>

          {/* Negative Factors */}
          <div className="pt-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Opposition Strengths / Tactical Challenges
            </h5>
            {factors.negative.length > 0 ? (
              <ul className="space-y-2">
                {factors.negative.map((f, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2 bg-amber-500/5 p-2 rounded-lg border border-amber-500/15">
                    <span className="text-amber-400 font-bold">-</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">No major adverse tactical challenges detected.</p>
            )}
          </div>
        </div>
      </div>

      {/* Model Feature Importance Card */}
      <div className="rounded-3xl glass-panel p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h4 className="text-base font-bold text-white tracking-wide">Top Model Feature Weights</h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">Random Forest RFE</span>
        </div>

        <div className="space-y-3">
          {topFeatures.slice(0, 7).map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-slate-300 truncate max-w-[220px]" title={item.feature}>
                  {formatFeatureName(item.feature)}
                </span>
                <span className="text-cyan-400 font-mono">{item.percentage}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(item.percentage * 15, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
