import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Match } from '../types';
import { Download, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export const DataExplorerPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [total, setTotal] = useState(0);
  const [season, setSeason] = useState('');
  const [team, setTeam] = useState('');
  const [result, setResult] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize] = useState(25);
  const [loading, setLoading] = useState(true);

  const seasonsList = [
    '2015-16', '2016-17', '2017-18', '2018-19', '2019-20',
    '2020-21', '2021-22', '2022-23', '2023-24', '2024-25'
  ];

  const teamsList = [
    'ATK Mohun Bagan', 'Bengaluru FC', 'Chennaiyin FC', 'East Bengal FC',
    'FC Goa', 'Hyderabad FC', 'Jamshedpur FC', 'Kerala Blasters',
    'Mumbai City FC', 'NorthEast United FC', 'Odisha FC', 'Punjab FC'
  ];

  const loadMatches = () => {
    setLoading(true);
    api.getMatches({
      season: season || undefined,
      team: team || undefined,
      result: result || undefined,
      limit: pageSize,
      offset: page * pageSize
    })
      .then((res) => {
        setMatches(res.matches);
        setTotal(res.total);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMatches();
  }, [season, team, result, page]);

  const filteredMatches = searchTerm
    ? matches.filter((m) =>
        m.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.away_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.venue_city.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : matches;

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Historical ISL Data Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse, filter, and inspect match records from the complete 1,100 match dataset.
          </p>
        </div>

        {/* CSV Export Button */}
        <a
          href="/api/dataset/export"
          download="ISL_Match_Dataset_Export.csv"
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Export Complete CSV</span>
        </a>
      </div>

      {/* Filter Controls Bar */}
      <div className="rounded-3xl glass-panel p-5 border border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search teams or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Season Filter */}
        <div>
          <select
            value={season}
            onChange={(e) => { setSeason(e.target.value); setPage(0); }}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          >
            <option value="">All Seasons (10)</option>
            {seasonsList.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Team Filter */}
        <div>
          <select
            value={team}
            onChange={(e) => { setTeam(e.target.value); setPage(0); }}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          >
            <option value="">All Clubs (12)</option>
            {teamsList.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Result Filter */}
        <div>
          <select
            value={result}
            onChange={(e) => { setResult(e.target.value); setPage(0); }}
            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
          >
            <option value="">All Results</option>
            <option value="Home_Win">Home Win</option>
            <option value="Draw">Draw</option>
            <option value="Away_Win">Away Win</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold bg-slate-900/40">
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Season</th>
                <th className="py-3 px-3">Home Club</th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-3">Away Club</th>
                <th className="py-3 px-3 text-center">Outcome</th>
                <th className="py-3 px-3">Venue</th>
                <th className="py-3 px-3 text-center">Weather</th>
                <th className="py-3 px-3 text-center">Pitch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto" />
                  </td>
                </tr>
              ) : filteredMatches.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 italic">
                    No matches found matching the specified filters.
                  </td>
                </tr>
              ) : (
                filteredMatches.map((m) => (
                  <tr key={m.match_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{m.match_id}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">{m.date}</td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{m.season}</td>
                    <td className="py-2.5 px-3 font-bold text-white">{m.home_team}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-black text-emerald-400 bg-slate-800/30 rounded-md">
                      {m.home_goals} - {m.away_goals}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white">{m.away_team}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.result === 'Home_Win' ? 'bg-emerald-500/20 text-emerald-300' : m.result === 'Away_Win' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {m.result.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{m.venue_city}</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">{m.weather}</td>
                    <td className="py-2.5 px-3 text-center text-slate-400">{m.pitch}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{page * pageSize + 1}</strong> to{' '}
            <strong className="text-white">{Math.min((page + 1) * pageSize, total)}</strong> of{' '}
            <strong className="text-white">{total.toLocaleString()}</strong> matches
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(page - 1, 0))}
              disabled={page === 0}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-300 px-2">
              Page {page + 1} of {Math.max(totalPages, 1)}
            </span>
            <button
              onClick={() => setPage(Math.min(page + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
