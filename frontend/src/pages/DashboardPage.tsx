import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { KPIOverview, TeamOverview } from '../types';
import { StatCard } from '../components/StatCard';
import { Activity, Trophy, Shield, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
  setSelectedTeam?: (team: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab, setSelectedTeam }) => {
  const [kpis, setKpis] = useState<KPIOverview | null>(null);
  const [teams, setTeams] = useState<TeamOverview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getOverviewKPIs(), api.getTeams()])
      .then(([kpiData, teamsData]) => {
        setKpis(kpiData);
        setTeams(teamsData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !kpis) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          ISL League Overview & Analytics Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Historical analysis across 10 seasons (2015-16 through 2024-25) and 1,100 matches.
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Matches"
          value={kpis.total_matches.toLocaleString()}
          subtitle="Across 10 seasons"
          icon={<Activity className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Total Goals Scored"
          value={kpis.total_goals.toLocaleString()}
          subtitle={`${kpis.avg_goals_per_match} goals / match`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="cyan"
        />
        <StatCard
          title="Home Win Rate"
          value={`${kpis.home_win_pct}%`}
          subtitle={`+${kpis.home_advantage_differential}% home advantage differential`}
          icon={<Trophy className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Active Clubs"
          value={`${kpis.total_teams} Teams`}
          subtitle="Full historical tracking"
          icon={<Shield className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Outcome Distribution & Home vs Away Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Outcome Breakdown */}
        <div className="lg:col-span-5 rounded-3xl glass-panel p-6 border border-white/10">
          <h3 className="text-base font-bold text-white mb-4">Historical Match Outcome Distribution</h3>
          
          <div className="space-y-4">
            {kpis.result_distribution.map((res) => (
              <div key={res.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{res.name}</span>
                  <span className="text-white font-mono">
                    {res.value} matches ({res.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${res.percentage}%`,
                      backgroundColor: res.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 space-y-1">
            <p>
              • <strong>Home Dominance:</strong> Home teams have won {kpis.home_win_pct}% of matches.
            </p>
            <p>
              • <strong>Draw Frequency:</strong> Draws represent {kpis.draw_pct}% of encounters.
            </p>
            <p>
              • <strong>Away Efficiency:</strong> Away teams succeed in {kpis.away_win_pct}% of fixtures.
            </p>
          </div>
        </div>

        {/* Goals Per Season Trend Bar Chart */}
        <div className="lg:col-span-7 rounded-3xl glass-panel p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Season-by-Season Goal Scored Trend</h3>
            <span className="text-xs text-slate-400 font-mono">10 Seasons</span>
          </div>

          <div className="space-y-3">
            {kpis.seasons_trend.map((s) => (
              <div key={s.season} className="flex items-center gap-3">
                <span className="w-16 text-xs font-mono font-medium text-slate-400 shrink-0">
                  {s.season}
                </span>
                <div className="flex-1 bg-slate-800/80 rounded-full h-4 overflow-hidden flex border border-white/5">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(s.total_goals / 400) * 100}%` }}
                    title={`${s.total_goals} goals (${s.avg_goals} / match)`}
                  />
                </div>
                <span className="w-24 text-right text-xs font-mono text-slate-300 shrink-0">
                  {s.total_goals}g ({s.avg_goals}/m)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* League Table / All-Time Rankings */}
      <div className="rounded-3xl glass-panel p-6 border border-white/10 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-white">All-Time Indian Super League Standings</h3>
            <p className="text-xs text-slate-400">Aggregated match records from the 1,100 match dataset</p>
          </div>
          <button
            onClick={() => setActiveTab('teams')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-emerald-400 hover:bg-slate-700 transition-colors"
          >
            <span>Deep Team Analytics</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Club</th>
                <th className="py-3 px-3 text-center">MP</th>
                <th className="py-3 px-3 text-center">W</th>
                <th className="py-3 px-3 text-center">D</th>
                <th className="py-3 px-3 text-center">L</th>
                <th className="py-3 px-3 text-center">GF</th>
                <th className="py-3 px-3 text-center">GA</th>
                <th className="py-3 px-3 text-center">GD</th>
                <th className="py-3 px-3 text-center">Win %</th>
                <th className="py-3 px-3 text-center">Clean Sheets</th>
                <th className="py-3 px-3 text-right">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {teams.map((t, idx) => (
                <tr
                  key={t.team}
                  onClick={() => {
                    if (setSelectedTeam) setSelectedTeam(t.team);
                    setActiveTab('teams');
                  }}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-500 group-hover:text-emerald-400">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                    <span>{t.team}</span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">{t.matches}</td>
                  <td className="py-3 px-3 text-center font-mono text-emerald-400 font-bold">{t.wins}</td>
                  <td className="py-3 px-3 text-center font-mono text-amber-400">{t.draws}</td>
                  <td className="py-3 px-3 text-center font-mono text-red-400">{t.losses}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">{t.goals_scored}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-400">{t.goals_conceded}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-200">
                    {t.goal_diff > 0 ? `+${t.goal_diff}` : t.goal_diff}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-emerald-400">
                    {t.win_rate}%
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-slate-300">
                    {t.clean_sheets} ({t.clean_sheet_pct}%)
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-extrabold text-white text-sm">
                    {t.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
