import React from 'react';
import { PredictionResult } from '../types';
import { Shield, Trophy, Activity, Sparkles } from 'lucide-react';

interface PredictionCardProps {
  prediction: PredictionResult;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction }) => {
  const {
    home_team,
    away_team,
    prediction: outcome,
    home_win_probability,
    draw_probability,
    away_win_probability,
    confidence,
    model_used,
    prematch_summary,
  } = prediction;

  const getOutcomeColor = () => {
    if (outcome === 'Home Win') return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (outcome === 'Away Win') return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  };

  return (
    <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/15 relative overflow-hidden shadow-2xl">
      {/* Background Accent Gradient */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner: Model & Confidence */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            ML Match Prediction Engine
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            Model: <strong className="text-white">{model_used}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Activity className="w-3.5 h-3.5" />
            {confidence}% Confidence
          </span>
        </div>
      </div>

      {/* Matchup Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center my-8 text-center">
        {/* Home Team */}
        <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-800/40 border border-white/5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold uppercase text-emerald-400 tracking-wider">Home Team</span>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">{home_team}</h3>
          <span className="text-xs text-slate-400 mt-2 font-mono">
            {prematch_summary?.home_formation || '4-3-3'} • Form: {prematch_summary?.home_recent_form_pts ?? '-'} pts
          </span>
        </div>

        {/* VS / Predicted Result */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Predicted Outcome</span>
          <div className={`px-6 py-3 rounded-2xl border-2 font-black text-2xl sm:text-3xl tracking-wide uppercase shadow-lg ${getOutcomeColor()}`}>
            {outcome}
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs text-slate-400">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Highest Probability Choice</span>
          </div>
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-800/40 border border-white/5">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <span className="text-xs font-semibold uppercase text-cyan-400 tracking-wider">Away Team</span>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">{away_team}</h3>
          <span className="text-xs text-slate-400 mt-2 font-mono">
            {prematch_summary?.away_formation || '4-2-3-1'} • Form: {prematch_summary?.away_recent_form_pts ?? '-'} pts
          </span>
        </div>
      </div>

      {/* Probability Breakdown Distribution */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-slate-200">Outcome Probability Distribution</span>
          <span className="text-xs text-slate-400 font-mono">Sum: 100%</span>
        </div>

        {/* Multi-segmented probability bar */}
        <div className="h-6 w-full rounded-full bg-slate-800/80 overflow-hidden flex p-1 gap-1 border border-white/10 shadow-inner">
          <div
            style={{ width: `${Math.max(home_win_probability, 8)}%` }}
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-l-full transition-all duration-700 flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
          >
            {home_win_probability}%
          </div>
          <div
            style={{ width: `${Math.max(draw_probability, 8)}%` }}
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700 flex items-center justify-center text-[10px] font-bold text-slate-900 shadow-sm"
          >
            {draw_probability}%
          </div>
          <div
            style={{ width: `${Math.max(away_win_probability, 8)}%` }}
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-r-full transition-all duration-700 flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
          >
            {away_win_probability}%
          </div>
        </div>

        {/* Legend / Stats row */}
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-xs font-semibold text-emerald-400 block">Home Win</span>
            <span className="text-lg font-black text-white">{home_win_probability}%</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-xs font-semibold text-amber-400 block">Draw</span>
            <span className="text-lg font-black text-white">{draw_probability}%</span>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <span className="text-xs font-semibold text-cyan-400 block">Away Win</span>
            <span className="text-lg font-black text-white">{away_win_probability}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
