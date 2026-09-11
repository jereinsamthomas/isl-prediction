import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FootballPitch } from '../components/FootballPitch';
import { Crosshair, Award, Shield, ArrowRight } from 'lucide-react';

export const TacticalAnalysisPage: React.FC = () => {
  const [formations, setFormations] = useState<Array<{
    formation: string;
    matches_used: number;
    wins: number;
    draws: number;
    losses: number;
    win_rate: number;
    draw_rate: number;
    loss_rate: number;
    goals_scored: number;
    goals_conceded: number;
    avg_goals_scored: number;
    avg_goals_conceded: number;
  }>>([]);

  const [selectedFormation, setSelectedFormation] = useState<string>('4-3-3');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTacticalAnalytics()
      .then((data) => {
        setFormations(data);
        if (data.length > 0) setSelectedFormation(data[0].formation);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400" />
      </div>
    );
  }

  const activeStat = formations.find((f) => f.formation === selectedFormation);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Tactical Formations & Pitch Dynamics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Empirical evaluation of tactical systems across 1,100 ISL fixtures with interactive pitch rendering.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Formations Performance Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl glass-panel p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">System Win Rates & Goal Efficiencies</h3>
              <span className="text-xs text-slate-400 font-mono">Click to inspect on pitch</span>
            </div>

            <div className="space-y-3">
              {formations.map((f) => {
                const isSelected = selectedFormation === f.formation;
                return (
                  <div
                    key={f.formation}
                    onClick={() => setSelectedFormation(f.formation)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-800/40 border-white/5 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-black text-white font-mono">{f.formation}</span>
                        <span className="text-[11px] text-slate-400">({f.matches_used} matches)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {f.win_rate}% Win Rate
                        </span>
                        <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                      </div>
                    </div>

                    {/* Progress distribution bar */}
                    <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-white/5">
                      <div
                        style={{ width: `${f.win_rate}%` }}
                        className="h-full bg-emerald-500 rounded-l-full"
                        title={`Win: ${f.win_rate}%`}
                      />
                      <div
                        style={{ width: `${f.draw_rate}%` }}
                        className="h-full bg-amber-500"
                        title={`Draw: ${f.draw_rate}%`}
                      />
                      <div
                        style={{ width: `${f.loss_rate}%` }}
                        className="h-full bg-red-500 rounded-r-full"
                        title={`Loss: ${f.loss_rate}%`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                      <span>W: {f.wins} | D: {f.draws} | L: {f.losses}</span>
                      <span>Avg: {f.avg_goals_scored} GF / {f.avg_goals_conceded} GA</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Pitch Visualizer */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl glass-panel p-6 border border-white/10 text-center space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Interactive Pitch Render
              </span>
              <h3 className="text-xl font-black text-white mt-2 font-mono">{selectedFormation} Shape</h3>
              {activeStat && (
                <p className="text-xs text-slate-400 mt-1">
                  Empirical win rate: <strong className="text-emerald-400 font-mono">{activeStat.win_rate}%</strong> across {activeStat.matches_used} matches.
                </p>
              )}
            </div>

            <FootballPitch
              formation={selectedFormation}
              teamName={`${selectedFormation} Formation`}
              isHome={true}
              color="emerald"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
