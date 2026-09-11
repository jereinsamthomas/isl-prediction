import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TeamOverview, TeamDetail } from '../types';
import { FormBadgeStreak } from '../components/FormBadgeStreak';
import { StatCard } from '../components/StatCard';
import { Shield, Home, Plane, Award, Target, Activity } from 'lucide-react';

interface TeamAnalyticsPageProps {
  initialTeam?: string;
}

export const TeamAnalyticsPage: React.FC<TeamAnalyticsPageProps> = ({ initialTeam }) => {
  const [teams, setTeams] = useState<TeamOverview[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>(initialTeam || 'Mumbai City FC');
  const [teamDetail, setTeamDetail] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTeams().then((data) => {
      setTeams(data);
      if (!initialTeam && data.length > 0) {
        setSelectedTeam(data[0].team);
      }
    });
  }, [initialTeam]);

  useEffect(() => {
    if (selectedTeam) {
      setLoading(true);
      api.getTeamDetail(selectedTeam)
        .then((detail) => setTeamDetail(detail))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [selectedTeam]);

  if (!teamDetail && loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400" />
      </div>
    );
  }

  const { overview, averages, radar_profile, tactical_formations, recent_matches } = teamDetail || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Team Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Club Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Historical club profile, tactical shapes, home/away differential, and performance radar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Club:</label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
          >
            {teams.map((t) => (
              <option key={t.team} value={t.team}>
                {t.team}
              </option>
            ))}
          </select>
        </div>
      </div>

      {overview && (
        <>
          {/* Main Team Profile Banner */}
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Shield className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">{overview.team}</h2>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs font-semibold text-slate-400">
                      Recent Form (Last 5):
                    </span>
                    <FormBadgeStreak streak={overview.form_streak} size="md" />
                  </div>
                </div>
              </div>

              {/* Total Points & Win Rate Badges */}
              <div className="flex items-center gap-4">
                <div className="text-center p-3 rounded-2xl bg-slate-800/60 border border-white/5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Win Rate</span>
                  <span className="text-xl font-black text-emerald-400">{overview.win_rate}%</span>
                </div>
                <div className="text-center p-3 rounded-2xl bg-slate-800/60 border border-white/5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Points</span>
                  <span className="text-xl font-black text-white">{overview.points}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard title="Matches" value={overview.matches} subtitle="Total played" color="slate" />
            <StatCard title="Wins" value={overview.wins} subtitle={`${overview.win_rate}% win rate`} color="emerald" />
            <StatCard title="Draws" value={overview.draws} subtitle={`${Math.round(overview.draws / overview.matches * 100)}% draw rate`} color="amber" />
            <StatCard title="Goals For" value={overview.goals_scored} subtitle={`${(overview.goals_scored / overview.matches).toFixed(1)} / game`} color="cyan" />
            <StatCard title="Goals Against" value={overview.goals_conceded} subtitle={`${(overview.goals_conceded / overview.matches).toFixed(1)} / game`} color="slate" />
            <StatCard title="Goal Diff" value={overview.goal_diff > 0 ? `+${overview.goal_diff}` : overview.goal_diff} subtitle={`${overview.clean_sheets} clean sheets`} color="purple" />
          </div>

          {/* Home vs Away Analysis & Performance Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Home vs Away Card */}
            <div className="lg:col-span-6 rounded-3xl glass-panel p-6 border border-white/10 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white">Home vs. Away Performance</h3>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Differential: {overview.home_away_diff > 0 ? `+${overview.home_away_diff}%` : `${overview.home_away_diff}%`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-bold uppercase mb-1">
                    <Home className="w-4 h-4" />
                    <span>Home Record</span>
                  </div>
                  <p className="text-2xl font-black text-white">{overview.home_win_rate}%</p>
                  <p className="text-[11px] text-slate-400 mt-1">Home match win rate</p>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-cyan-400 text-xs font-bold uppercase mb-1">
                    <Plane className="w-4 h-4" />
                    <span>Away Record</span>
                  </div>
                  <p className="text-2xl font-black text-white">{overview.away_win_rate}%</p>
                  <p className="text-[11px] text-slate-400 mt-1">Away match win rate</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Match-Level Averages</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 flex justify-between">
                    <span className="text-slate-400">Possession:</span>
                    <strong className="text-white font-mono">{averages?.possession_pct}%</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 flex justify-between">
                    <span className="text-slate-400">Shots on Target:</span>
                    <strong className="text-white font-mono">{averages?.shots_on_target}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 flex justify-between">
                    <span className="text-slate-400">Corners:</span>
                    <strong className="text-white font-mono">{averages?.corners}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 flex justify-between">
                    <span className="text-slate-400">Discipline:</span>
                    <strong className="text-white font-mono">{averages?.yellow_cards} YC / {averages?.red_cards} RC</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Radar Breakdown */}
            <div className="lg:col-span-6 rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white mb-2">Team Attribute Rating (0-100)</h3>
              <div className="space-y-3.5">
                {radar_profile?.map((item) => (
                  <div key={item.metric}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-300">{item.metric}</span>
                      <span className="text-emerald-400 font-mono">{item.value} / 100</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-700"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent 10 Matches List */}
          <div className="rounded-3xl glass-panel p-6 border border-white/10 overflow-hidden">
            <h3 className="text-base font-bold text-white mb-4">Last 10 Fixtures History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Season</th>
                    <th className="py-3 px-3">Venue</th>
                    <th className="py-3 px-3">Opponent</th>
                    <th className="py-3 px-3 text-center">Score</th>
                    <th className="py-3 px-3 text-center">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recent_matches?.map((m) => (
                    <tr key={m.match_id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{m.date}</td>
                      <td className="py-2.5 px-3 text-slate-400">{m.season}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${m.is_home ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                          {m.is_home ? 'HOME' : 'AWAY'}
                        </span>
                        <span className="ml-1.5 text-slate-300">{m.venue}</span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-white">{m.opponent}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-200">{m.score}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          m.outcome === 'Win' ? 'bg-emerald-500 text-white' : m.outcome === 'Draw' ? 'bg-amber-500 text-slate-900' : 'bg-red-500 text-white'
                        }`}>
                          {m.outcome}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
