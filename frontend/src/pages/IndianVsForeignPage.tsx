import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { IndianVsForeignData } from '../types';
import { StatCard } from '../components/StatCard';
import { Swords, Shield, Sparkles, DollarSign, Flag } from 'lucide-react';

export const IndianVsForeignPage: React.FC = () => {
  const [data, setData] = useState<IndianVsForeignData | null>(null);
  const [activeTab, setActiveTab] = useState<'attack' | 'defence' | 'creativity' | 'market'>('attack');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getIndianVsForeign()
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

  const { attack, defence, ratings_creativity, market_value } = data;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
          <Flag className="w-4 h-4" />
          <span>Core ISL Research Module</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Indian vs. Foreign Player Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Multi-dimensional comparative analysis of domestic and international squad contributions across 1,100 matches.
        </p>
      </div>

      {/* 4 Tabs Selector */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-panel border border-white/10 w-fit">
        <button
          onClick={() => setActiveTab('attack')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'attack'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>Attack</span>
        </button>

        <button
          onClick={() => setActiveTab('defence')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'defence'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Defence</span>
        </button>

        <button
          onClick={() => setActiveTab('creativity')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'creativity'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Ratings & Creativity</span>
        </button>

        <button
          onClick={() => setActiveTab('market')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'market'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Market Value</span>
        </button>
      </div>

      {/* Tab 1: Attack */}
      {activeTab === 'attack' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Foreign Goal Contributions"
              value={attack.foreign_goals.toLocaleString()}
              subtitle={`${attack.foreign_goal_pct}% of total goals`}
              color="emerald"
            />
            <StatCard
              title="Indian Goal Contributions"
              value={attack.indian_goals.toLocaleString()}
              subtitle={`${attack.indian_goal_pct}% of total goals`}
              color="cyan"
            />
            <StatCard
              title="Foreign Big Chance Conversion"
              value={`${attack.foreign_conversion_rate}%`}
              subtitle={`${attack.foreign_big_chances_created} chances created`}
              color="amber"
            />
            <StatCard
              title="Indian Big Chance Conversion"
              value={`${attack.indian_conversion_rate}%`}
              subtitle={`${attack.indian_big_chances_created} chances created`}
              color="purple"
            />
          </div>

          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-6">
            <h3 className="text-base font-bold text-white">Goal Contribution Share Breakdown</h3>
            
            {/* Split Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-emerald-400 font-bold">Foreign Players ({attack.foreign_goal_pct}%)</span>
                <span className="text-cyan-400 font-bold">Indian Players ({attack.indian_goal_pct}%)</span>
              </div>
              <div className="h-6 rounded-full bg-slate-800 overflow-hidden flex p-1 gap-1 border border-white/10">
                <div
                  style={{ width: `${attack.foreign_goal_pct}%` }}
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-l-full flex items-center justify-center text-[10px] font-bold text-white"
                >
                  {attack.foreign_goals} Goals
                </div>
                <div
                  style={{ width: `${attack.indian_goal_pct}%` }}
                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-r-full flex items-center justify-center text-[10px] font-bold text-white"
                >
                  {attack.indian_goals} Goals
                </div>
              </div>
            </div>

            {/* Big Chances Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/5 space-y-2">
                <span className="text-xs font-bold uppercase text-emerald-400 block">Foreign Players Creativity</span>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Big Chances Created:</span>
                  <strong className="text-white font-mono">{attack.foreign_big_chances_created}</strong>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Big Chances Missed:</span>
                  <strong className="text-white font-mono">{attack.foreign_big_chances_missed}</strong>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/5 space-y-2">
                <span className="text-xs font-bold uppercase text-cyan-400 block">Indian Players Creativity</span>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Big Chances Created:</span>
                  <strong className="text-white font-mono">{attack.indian_big_chances_created}</strong>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Big Chances Missed:</span>
                  <strong className="text-white font-mono">{attack.indian_big_chances_missed}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Defence */}
      {activeTab === 'defence' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Indian Clearances & Tackles"
              value={defence.indian_clearances_tackles.toLocaleString()}
              subtitle={`${defence.indian_clearances_tackles_pct}% of total defensive work`}
              color="cyan"
            />
            <StatCard
              title="Foreign Clearances & Tackles"
              value={defence.foreign_clearances_tackles.toLocaleString()}
              subtitle={`${defence.foreign_clearances_tackles_pct}% of total defensive work`}
              color="emerald"
            />
            <StatCard
              title="Indian Avg Interception Rate"
              value={`${defence.indian_avg_interception_rate}%`}
              subtitle="Interception success rate"
              color="purple"
            />
            <StatCard
              title="Foreign Avg Interception Rate"
              value={`${defence.foreign_avg_interception_rate}%`}
              subtitle="Interception success rate"
              color="amber"
            />
          </div>

          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white">Defensive Workload Distribution</h3>
            <p className="text-xs text-slate-400">
              Analysis confirms Indian players handle over <strong>{defence.indian_clearances_tackles_pct}% of all clearances and tackles</strong> in the league, acting as the foundational defensive engine of ISL clubs.
            </p>

            <div className="h-6 rounded-full bg-slate-800 overflow-hidden flex p-1 gap-1 border border-white/10">
              <div
                style={{ width: `${defence.indian_clearances_tackles_pct}%` }}
                className="h-full bg-cyan-500 rounded-l-full flex items-center justify-center text-[10px] font-bold text-white"
              >
                Indian ({defence.indian_clearances_tackles_pct}%)
              </div>
              <div
                style={{ width: `${defence.foreign_clearances_tackles_pct}%` }}
                className="h-full bg-emerald-500 rounded-r-full flex items-center justify-center text-[10px] font-bold text-white"
              >
                Foreign ({defence.foreign_clearances_tackles_pct}%)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Ratings & Creativity */}
      {activeTab === 'creativity' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Foreign Player Rating Average"
              value={`${ratings_creativity.foreign_avg_rating} / 10`}
              subtitle="Historical match rating average"
              color="emerald"
            />
            <StatCard
              title="Indian Player Rating Average"
              value={`${ratings_creativity.indian_avg_rating} / 10`}
              subtitle="Historical match rating average"
              color="cyan"
            />
            <StatCard
              title="Technical Rating Gap"
              value={`+${ratings_creativity.rating_gap}`}
              subtitle="Rating differential in favor of foreign recruits"
              color="amber"
            />
          </div>

          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-4 text-xs text-slate-300">
            <h3 className="text-base font-bold text-white">Methodological Finding</h3>
            <p className="leading-relaxed">
              Foreign recruits average a rating of <strong>{ratings_creativity.foreign_avg_rating}</strong>, primarily due to offensive set-piece duties, key passes, and conversion efficiency in the final third.
              However, Indian players (averaging <strong>{ratings_creativity.indian_avg_rating}</strong>) demonstrate rapid convergence over successive seasons (2015-16 to 2024-25), with defensive discipline scores continually narrowing the gap.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Market Value */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Average Squad Market Value"
              value={`₹${market_value.avg_squad_market_value_cr} Cr`}
              subtitle="Total club valuation index"
              color="purple"
            />
            <StatCard
              title="Foreign Player Valuation Share"
              value={`₹${market_value.foreign_market_value_cr} Cr`}
              subtitle={`${market_value.foreign_market_share_pct}% of total club payroll`}
              color="emerald"
            />
            <StatCard
              title="Indian Player Valuation Share"
              value={`₹${market_value.indian_market_value_cr} Cr`}
              subtitle={`${market_value.indian_market_share_pct}% of total club payroll`}
              color="cyan"
            />
          </div>

          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white">Payroll vs. Contribution Insight</h3>
            <p className="text-xs text-slate-400">
              Foreign players account for <strong>{market_value.foreign_market_share_pct}%</strong> of the squad market valuation and deliver <strong>{attack.foreign_goal_pct}%</strong> of goals scored, highlighting high return on investment in offensive recruitment.
            </p>

            <div className="h-6 rounded-full bg-slate-800 overflow-hidden flex p-1 gap-1 border border-white/10">
              <div
                style={{ width: `${market_value.foreign_market_share_pct}%` }}
                className="h-full bg-emerald-500 rounded-l-full flex items-center justify-center text-[10px] font-bold text-white"
              >
                Foreign Valuation ({market_value.foreign_market_share_pct}%)
              </div>
              <div
                style={{ width: `${market_value.indian_market_share_pct}%` }}
                className="h-full bg-cyan-500 rounded-r-full flex items-center justify-center text-[10px] font-bold text-white"
              >
                Indian Valuation ({market_value.indian_market_share_pct}%)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
