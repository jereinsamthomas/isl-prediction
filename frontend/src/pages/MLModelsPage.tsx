import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ModelComparisonData } from '../types';
import { BrainCircuit, Trophy, RefreshCw, CheckCircle, HelpCircle, Layers } from 'lucide-react';

export const MLModelsPage: React.FC = () => {
  const [data, setData] = useState<ModelComparisonData | null>(null);
  const [splitTab, setSplitTab] = useState<'random' | 'temporal' | 'paper'>('random');
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [retrainSuccess, setRetrainSuccess] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true);
    api.getModelComparison()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRetrain = async () => {
    setRetraining(true);
    setRetrainSuccess(null);
    try {
      const res = await api.retrainModels();
      setRetrainSuccess(`Retraining completed! Best Model: ${res.best_model.name} (${res.best_model.accuracy}%)`);
      loadData();
    } catch (err: any) {
      alert(`Retraining failed: ${err.message}`);
    } finally {
      setRetraining(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-400" />
      </div>
    );
  }

  const { random_split, temporal_split, paper_benchmarks, best_model, target_classes } = data;
  const activeModels = splitTab === 'temporal' ? temporal_split : random_split;

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Machine Learning Models & Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Empirical benchmarking of 6 algorithms on the 1,100 ISL match pre-match dataset with zero outcome leakage.
          </p>
        </div>

        {/* Retrain Action Button */}
        <button
          onClick={handleRetrain}
          disabled={retraining}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${retraining ? 'animate-spin' : ''}`} />
          <span>{retraining ? 'Retraining All 6 Models...' : 'Retrain Models On-Demand'}</span>
        </button>
      </div>

      {retrainSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{retrainSuccess}</span>
        </div>
      )}

      {/* Best Performing Model Banner */}
      <div className="rounded-3xl glass-panel p-6 border border-emerald-500/30 bg-emerald-500/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              Top Production Model (Multi-Class Pre-Match)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">{best_model.name}</h2>
            <p className="text-xs text-slate-400 mt-1">
              Evaluated on 3-class target: Home Win ({target_classes.join(', ')})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center p-3 rounded-2xl bg-slate-800/80 border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Accuracy</span>
            <span className="text-2xl font-black text-emerald-400">{best_model.accuracy}%</span>
          </div>
          <div className="text-center p-3 rounded-2xl bg-slate-800/80 border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">F1 Macro</span>
            <span className="text-2xl font-black text-cyan-400">{best_model.f1_score}%</span>
          </div>
        </div>
      </div>

      {/* Split Configuration Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl glass-panel border border-white/10 w-fit">
        <button
          onClick={() => setSplitTab('random')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            splitTab === 'random'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Stratified Random Split (80:20)</span>
        </button>

        <button
          onClick={() => setSplitTab('temporal')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            splitTab === 'temporal'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Temporal Time Split (2015-22 vs 2023-25)</span>
        </button>

        <button
          onClick={() => setSplitTab('paper')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            splitTab === 'paper'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>SRMIST Research Paper Benchmarks</span>
        </button>
      </div>

      {/* Table Display for Random & Temporal Splits */}
      {splitTab !== 'paper' && (
        <div className="rounded-3xl glass-panel p-6 border border-white/10 overflow-hidden space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white">
              {splitTab === 'random' ? 'Stratified Random Split (80:20) Performance' : 'Temporal Split (Chronological Seasons) Performance'}
            </h3>
            <span className="text-xs text-slate-400 font-mono">Multi-class: Win / Draw / Loss</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Algorithm</th>
                  <th className="py-3 px-3 text-center">Accuracy</th>
                  <th className="py-3 px-3 text-center">Precision (Macro)</th>
                  <th className="py-3 px-3 text-center">Recall (Macro)</th>
                  <th className="py-3 px-3 text-center">F1 Score (Macro)</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {Object.entries(activeModels).map(([name, metrics]) => {
                  const isTop = name === best_model.name;
                  return (
                    <tr key={name} className={`hover:bg-slate-800/40 transition-colors ${isTop ? 'bg-emerald-500/5' : ''}`}>
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                        {isTop && <Trophy className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{name}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-black text-emerald-400 text-sm">
                        {metrics.accuracy}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300">
                        {metrics.precision}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300">
                        {metrics.recall}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-cyan-400">
                        {metrics.f1_score}%
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isTop ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isTop ? 'Top Performer' : 'Production Validated'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Paper Benchmarks */}
      {splitTab === 'paper' && (
        <div className="space-y-6">
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white">SRMIST Research Paper Reported Results</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The research publication titled <em>"Indian Super League Match Prediction Using Machine Learning"</em> (Thomas, Ragunath, Adhith - SRMIST) reported:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/10 text-center">
                <span className="text-xs font-semibold text-slate-400 block">Logistic Regression</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">{paper_benchmarks['Logistic Regression']}%</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Paper Reported Benchmark</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/10 text-center">
                <span className="text-xs font-semibold text-slate-400 block">Random Forest</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">{paper_benchmarks['Random Forest']}%</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Paper Reported Benchmark</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/10 text-center">
                <span className="text-xs font-semibold text-slate-400 block">Decision Tree</span>
                <span className="text-2xl font-black text-slate-200 mt-1 block">{paper_benchmarks['Decision Tree']}%</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Paper Reported Benchmark</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/10 text-center">
                <span className="text-xs font-semibold text-slate-400 block">K-Nearest Neighbors</span>
                <span className="text-2xl font-black text-slate-200 mt-1 block">{paper_benchmarks['K-Nearest Neighbors']}%</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Paper Reported Benchmark</span>
              </div>
            </div>

            {/* In-depth Academic Methodological Analysis */}
            <div className="mt-6 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <HelpCircle className="w-4 h-4" />
                <span>Why do the production pre-match models show 40-44% vs. 82.4% in early experiments?</span>
              </div>
              <p className="leading-relaxed">
                <strong>1. Elimination of Outcome Data Leakage:</strong> In the paper's retrospective phase, features recorded <em>during</em> the match (e.g. final match goals, possession percentage, in-game shots on target, red cards) produce high retrospective correlation (~80%). However, an operational prediction engine cannot know in-game statistics before kickoff.
              </p>
              <p className="leading-relaxed">
                <strong>2. Multi-Class Reality vs Random Guess:</strong> When predicting 3 discrete outcomes (Home Win, Draw, Away Win), random guessing yields <strong>33.3%</strong>. A strictly pre-match accuracy of <strong>40%–44%</strong> represents strong predictive alpha in professional sports forecasting.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confusion Matrix Inspection */}
      {splitTab !== 'paper' && (
        <div className="rounded-3xl glass-panel p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-base font-bold text-white">Confusion Matrix (Actual vs. Predicted)</h3>
            <span className="text-xs text-slate-400 font-mono">Target: {target_classes.join(' / ')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {['Random Forest', 'Logistic Regression'].map((mName) => {
              const cm = activeModels[mName]?.confusion_matrix || [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
              return (
                <div key={mName} className="p-4 rounded-2xl bg-slate-800/40 border border-white/5 space-y-3">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">{mName}</span>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    {cm.map((row, rIdx) =>
                      row.map((val, cIdx) => (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={`p-3 rounded-xl border ${
                            rIdx === cIdx
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-black'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="text-[10px] text-slate-400 block mb-0.5">
                            {target_classes[rIdx]?.slice(0, 4)} → {target_classes[cIdx]?.slice(0, 4)}
                          </span>
                          <span className="text-sm font-bold text-white">{val}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
