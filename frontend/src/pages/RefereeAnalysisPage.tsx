import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Scale, AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';
import { StatCard } from '../components/StatCard';

export const RefereeAnalysisPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRefereeAnalytics()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400" />
      </div>
    );
  }

  const { overall, strictness_tiers, methodology_note } = data;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Referee Influence & Strictness Index
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Quantitative examination of match officiating, card frequency, and empirical outcome distributions.
        </p>
      </div>

      {/* Disciplinary Overview KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Yellow Cards"
          value={overall.total_yellow_cards.toLocaleString()}
          subtitle={`${overall.avg_yellow_cards_per_match} cards per match`}
          color="amber"
          icon={<ShieldAlert className="w-5 h-5" />}
        />
        <StatCard
          title="Total Red Cards"
          value={overall.total_red_cards.toLocaleString()}
          subtitle={`${overall.avg_red_cards_per_match} expulsions per match`}
          color="slate"
          icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
        />
        <StatCard
          title="Officiating Strictness Index"
          value="0.0 – 1.0"
          subtitle="Normalized disciplinary scale"
          color="cyan"
          icon={<Scale className="w-5 h-5" />}
        />
        <StatCard
          title="Statistical Causality"
          value="Correlative"
          subtitle="Observed association only"
          color="emerald"
          icon={<CheckCircle className="w-5 h-5" />}
        />
      </div>

      {/* Strictness Tiers Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">Disciplinary Tier Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {strictness_tiers.map((tier: any) => (
            <div key={tier.tier} className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-sm font-black text-white">{tier.tier}</span>
                <span className="text-xs text-slate-400 font-mono">{tier.matches} matches</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-xl bg-slate-800/60">
                  <span className="text-slate-400">Avg Yellow Cards:</span>
                  <strong className="text-amber-400 font-mono">{tier.avg_yellows}</strong>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-800/60">
                  <span className="text-slate-400">Avg Red Cards:</span>
                  <strong className="text-red-400 font-mono">{tier.avg_reds}</strong>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-800/60">
                  <span className="text-slate-400">Home Win Association:</span>
                  <strong className="text-emerald-400 font-mono">{tier.home_win_pct}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Integrity Callout */}
      <div className="p-6 rounded-3xl bg-slate-800/40 border border-white/10 text-xs text-slate-300 space-y-2">
        <h4 className="font-bold text-white flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Research Integrity & Methodological Statement</span>
        </h4>
        <p className="leading-relaxed text-slate-400">
          {methodology_note} The referee strictness score is computed directly from official match records.
          In sports analytics, disciplinary frequency reflects fixture intensity, tactical fouls, and derby tension;
          predictions use this index as a match-condition feature without asserting referee bias.
        </p>
      </div>
    </div>
  );
};
