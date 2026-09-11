import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CloudSun, CloudRain, Sun, Cloud, Moon, Gauge } from 'lucide-react';
import { StatCard } from '../components/StatCard';

export const MatchConditionsPage: React.FC = () => {
  const [data, setData] = useState<{
    weather_impact: Array<{ weather: string; matches: number; home_win_pct: number; draw_pct: number; away_win_pct: number; avg_goals: number }>;
    pitch_impact: Array<{ pitch_condition: string; matches: number; home_win_pct: number; draw_pct: number; away_win_pct: number; avg_goals: number }>;
    kickoff_condition_impact: Array<{ condition: string; matches: number; home_win_pct: number; draw_pct: number; away_win_pct: number; avg_goals: number }>;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getWeatherPitchAnalytics()
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

  const getWeatherIcon = (w: string) => {
    switch (w.toLowerCase()) {
      case 'clear':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'rainy':
        return <CloudRain className="w-5 h-5 text-cyan-400" />;
      case 'humid':
        return <CloudSun className="w-5 h-5 text-emerald-400" />;
      case 'overcast':
        return <Cloud className="w-5 h-5 text-slate-400" />;
      default:
        return <CloudSun className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Match Conditions & Environmental Factors
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Empirical impact of weather types, turf conditions, and kickoff timing on ISL match results and goal scoring.
        </p>
      </div>

      {/* Weather Impact Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-emerald-400" />
          <span>Weather Condition vs. Outcomes (1,100 Matches)</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.weather_impact.map((w) => (
            <div key={w.weather} className="rounded-3xl glass-panel p-5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{w.weather}</span>
                {getWeatherIcon(w.weather)}
              </div>

              <div>
                <p className="text-2xl font-black text-white">{w.avg_goals} <span className="text-xs font-normal text-slate-400">goals/m</span></p>
                <p className="text-[11px] text-slate-400">{w.matches} historical fixtures</p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 pt-2 border-t border-white/5 text-[11px]">
                <div className="flex justify-between font-mono">
                  <span className="text-emerald-400">Home: {w.home_win_pct}%</span>
                  <span className="text-amber-400">Draw: {w.draw_pct}%</span>
                  <span className="text-cyan-400">Away: {w.away_win_pct}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${w.home_win_pct}%` }} className="bg-emerald-500 h-full" />
                  <div style={{ width: `${w.draw_pct}%` }} className="bg-amber-500 h-full" />
                  <div style={{ width: `${w.away_win_pct}%` }} className="bg-cyan-500 h-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pitch Quality Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Gauge className="w-5 h-5 text-cyan-400" />
          <span>Pitch Quality Impact (Good / Average / Poor)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.pitch_impact.map((p) => (
            <div key={p.pitch_condition} className="rounded-3xl glass-panel p-6 border border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">{p.pitch_condition} Pitch Quality</span>
              <p className="text-3xl font-black text-white">{p.avg_goals} <span className="text-xs font-normal text-slate-400">avg goals</span></p>
              <p className="text-xs text-slate-400">{p.matches} total matches recorded</p>

              <div className="pt-3 border-t border-white/5 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Home Win Rate:</span>
                  <strong className="text-emerald-400 font-mono">{p.home_win_pct}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Draw Frequency:</span>
                  <strong className="text-amber-400 font-mono">{p.draw_pct}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Away Win Rate:</span>
                  <strong className="text-cyan-400 font-mono">{p.away_win_pct}%</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kickoff Timing: Day vs Night */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Moon className="w-5 h-5 text-purple-400" />
          <span>Day vs. Night Kickoff Dynamics</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.kickoff_condition_impact.map((mc) => (
            <div key={mc.condition} className="rounded-3xl glass-panel p-6 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">{mc.condition} Match</span>
                <p className="text-2xl font-black text-white mt-1">{mc.avg_goals} Goals / Game</p>
                <p className="text-xs text-slate-400 mt-0.5">{mc.matches} matches ({mc.home_win_pct}% Home Wins, {mc.draw_pct}% Draws)</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                {mc.condition === 'Night' ? <Moon className="w-7 h-7" /> : <Sun className="w-7 h-7" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
