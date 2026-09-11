import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AlertCircle, CheckCircle2, Flag, ArrowRight, ShieldCheck, Database } from 'lucide-react';

interface PlayerAnalyticsPageProps {
  setActiveTab: (tab: string) => void;
}

export const PlayerAnalyticsPage: React.FC<PlayerAnalyticsPageProps> = ({ setActiveTab }) => {
  const [coverage, setCoverage] = useState<{
    individual_player_roster_data: string;
    aggregate_player_group_data: string;
    tracked_dimensions: string[];
    message: string;
  } | null>(null);

  const [impactData, setImpactData] = useState<any>(null);

  useEffect(() => {
    Promise.all([api.getPlayerCoverage(), api.getKeyPlayerImpact()])
      .then(([cov, impact]) => {
        setCoverage(cov);
        setImpactData(impact);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Player Analytics & Data Integrity Audit
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Rigorous distinction between individual roster statistics and verified aggregate player group indicators.
        </p>
      </div>

      {/* Prominent Data Integrity Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-amber-500/10 border border-amber-500/30 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                Individual Player Roster Data: Not Available in Current Dataset
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Zero Fabrication Policy
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              In accordance with strict scientific data integrity rules, this platform <strong>never fabricates fake individual player names or mock statistics</strong>.
              The uploaded ISL dataset tracks <strong>match-level aggregate Indian vs. Foreign player metrics</strong> across all 1,100 fixtures (ratings, market valuations, clearances, tackles, interceptions, and big chances).
            </p>

            <div className="pt-3">
              <button
                onClick={() => setActiveTab('indian-vs-foreign')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-900 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md"
              >
                <Flag className="w-4 h-4" />
                <span>Go to Indian vs Foreign Player Analytics Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Available vs Unavailable Feature Coverage Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Dimensions */}
        <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 pb-3 border-b border-white/10">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Verified Available Player Metrics (1,100 Matches)</h3>
          </div>
          <ul className="space-y-2.5">
            {coverage?.tracked_dimensions.map((dim, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-center gap-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/15">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>{dim}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Individual Player Roster Matrix */}
        <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-slate-400 pb-3 border-b border-white/10">
            <Database className="w-5 h-5" />
            <h3 className="text-base font-bold text-white">Unavailable Individual Modules (Marked Transparently)</h3>
          </div>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5 space-y-1">
              <strong className="text-white block">Individual Player Search:</strong>
              <p className="text-slate-400">Requires line-by-line player roster records. Marked as "Data not available in current dataset".</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5 space-y-1">
              <strong className="text-white block">Individual Player Injury Risk:</strong>
              <p className="text-slate-400">Matches track team-level <code>Home_Injury_Count</code> and <code>Away_Injury_Count</code>. Individual player medical charts are not provided.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5 space-y-1">
              <strong className="text-white block">Individual Fatigue Diagnosis:</strong>
              <p className="text-slate-400">Tracked as team-level <code>Fatigue_Index</code> (0-10) and schedule density. Not clinical diagnosis.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Player Absence Impact Analysis */}
      {impactData && (
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Key Player Absence Impact on Match Win Rates</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Dataset Variable: Key_Player_Missing_Side</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Both Full Squads</span>
              <span className="text-2xl font-black text-white mt-1">
                {impactData.impact_summary.home_win_rate_normal}%
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Home team win rate when no key player missing</p>
            </div>

            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
              <span className="text-xs font-semibold text-red-400 uppercase tracking-wider block">Home Key Player Missing</span>
              <span className="text-2xl font-black text-white mt-1">
                {impactData.impact_summary.home_win_rate_when_home_key_missing}%
              </span>
              <p className="text-[11px] text-red-300 mt-1">
                {impactData.impact_summary.impact_drop_pct}% drop in home win rate
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">Away Key Player Missing</span>
              <span className="text-2xl font-black text-white mt-1">
                {impactData.impact_summary.home_win_rate_when_away_key_missing}%
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Home win rate increases when opponent missing key player</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
