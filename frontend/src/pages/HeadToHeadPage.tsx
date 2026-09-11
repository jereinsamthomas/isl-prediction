import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Swords, Shield, Trophy } from 'lucide-react';

export const HeadToHeadPage: React.FC = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [team1, setTeam1] = useState<string>('Mumbai City FC');
  const [team2, setTeam2] = useState<string>('Kerala Blasters');
  const [h2h, setH2h] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getPredictionOptions().then((opts) => {
      setTeams(opts.teams);
      if (opts.teams.length >= 2) {
        setTeam1(opts.teams[0]);
        setTeam2(opts.teams[1]);
      }
    });
  }, []);

  useEffect(() => {
    if (team1 && team2 && team1 !== team2) {
      setLoading(true);
      api.getH2H(team1, team2)
        .then((res) => setH2h(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [team1, team2]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Head-to-Head Historical Analysis
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Historical rivalry records, goal tallies, and past meetings between any two ISL clubs.
        </p>
      </div>

      {/* Selectors Card */}
      <div className="rounded-3xl glass-panel p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400">Club 1</label>
            <select
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white font-bold text-sm"
            >
              {teams.map((t) => (
                <option key={t} value={t} disabled={t === team2}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex justify-center py-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-black text-xs">
              VS
            </div>
          </div>

          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">Club 2</label>
            <select
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white font-bold text-sm"
            >
              {teams.map((t) => (
                <option key={t} value={t} disabled={t === team1}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400" />
        </div>
      )}

      {h2h && !loading && (
        <div className="space-y-6">
          {/* Main Rivalry Summary Card */}
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
              {/* Team 1 */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">{h2h.team1}</span>
                <span className="text-3xl font-black text-white mt-1 block">{h2h.team1_wins} Wins</span>
                <span className="text-xs text-slate-400 mt-1 block font-mono">{h2h.team1_goals} Goals ({h2h.team1_win_pct}%)</span>
              </div>

              {/* Draws & Meetings */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Total Encounters</span>
                <span className="text-3xl font-black text-white mt-1 block">{h2h.total_meetings} Matches</span>
                <span className="text-xs text-slate-400 mt-1 block font-mono">{h2h.draws} Draws ({h2h.draw_pct}%)</span>
              </div>

              {/* Team 2 */}
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">{h2h.team2}</span>
                <span className="text-3xl font-black text-white mt-1 block">{h2h.team2_wins} Wins</span>
                <span className="text-xs text-slate-400 mt-1 block font-mono">{h2h.team2_goals} Goals ({h2h.team2_win_pct}%)</span>
              </div>
            </div>

            {/* Proportion Bar */}
            {h2h.total_meetings > 0 && (
              <div className="space-y-2">
                <div className="h-6 w-full rounded-full bg-slate-800 overflow-hidden flex p-1 gap-1 border border-white/10">
                  <div
                    style={{ width: `${Math.max(h2h.team1_win_pct, 5)}%` }}
                    className="h-full bg-emerald-500 rounded-l-full flex items-center justify-center text-[10px] font-bold text-white"
                  >
                    {h2h.team1_wins}
                  </div>
                  <div
                    style={{ width: `${Math.max(h2h.draw_pct, 5)}%` }}
                    className="h-full bg-amber-500 flex items-center justify-center text-[10px] font-bold text-slate-900"
                  >
                    {h2h.draws}
                  </div>
                  <div
                    style={{ width: `${Math.max(h2h.team2_win_pct, 5)}%` }}
                    className="h-full bg-cyan-500 rounded-r-full flex items-center justify-center text-[10px] font-bold text-white"
                  >
                    {h2h.team2_wins}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Past Encounters Table */}
          <div className="rounded-3xl glass-panel p-6 border border-white/10 overflow-hidden">
            <h3 className="text-base font-bold text-white mb-4">Past Meetings Record</h3>
            {h2h.recent_meetings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Season</th>
                      <th className="py-3 px-3">Home Side</th>
                      <th className="py-3 px-3 text-center">Score</th>
                      <th className="py-3 px-3">Away Side</th>
                      <th className="py-3 px-3 text-center">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {h2h.recent_meetings.map((m: any) => (
                      <tr key={m.match_id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-slate-400">{m.date}</td>
                        <td className="py-2.5 px-3 text-slate-400">{m.season}</td>
                        <td className="py-2.5 px-3 font-bold text-white">{m.home_team}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-black text-emerald-400 bg-slate-800/40 rounded-lg">
                          {m.score}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-white">{m.away_team}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            m.result === 'Home_Win' ? 'bg-emerald-500 text-white' : m.result === 'Away_Win' ? 'bg-cyan-500 text-white' : 'bg-amber-500 text-slate-900'
                          }`}>
                            {m.result.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No previous fixtures found between these clubs.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
