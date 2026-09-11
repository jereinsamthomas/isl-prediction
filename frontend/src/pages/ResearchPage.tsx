import React, { useState } from 'react';
import { BookOpen, CheckCircle, ArrowDown, Cpu, Database, BrainCircuit, Activity, BarChart3, HelpCircle } from 'lucide-react';

interface ArchNode {
  id: string;
  title: string;
  desc: string;
  details: string;
  category: 'data' | 'prep' | 'ml' | 'output';
}

export const ResearchPage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('ml');

  const nodes: ArchNode[] = [
    {
      id: 'primary_data',
      title: '1. Primary ISL Dataset',
      desc: '1,100 match records (2015–2025) spanning 10 seasons across 12 clubs with 70 feature variables.',
      details: 'Historical match records sourced from official ISL databases, comprising match-level statistics, team ratings, and environmental variables.',
      category: 'data'
    },
    {
      id: 'modules',
      title: '2. Four Analysis Pillars',
      desc: 'Opponent Analysis, Player Group Analysis (Indian vs Foreign), Tactical Formations, and Match Conditions.',
      details: 'Features are organized into 15 analytical sub-modules including referee strictness, player fatigue, team chemistry, and set-piece efficiency.',
      category: 'data'
    },
    {
      id: 'preprocessing',
      title: '3. Data Preprocessing & Leakage Protection',
      desc: 'Missing value handling, categorical label encoding, and Min-Max numerical feature normalization (0–1).',
      details: 'In-match statistics (in-game goals, shots, fouls, corner kicks) are strictly quarantined. Only variables available prior to kickoff enter predictors.',
      category: 'prep'
    },
    {
      id: 'feature_eng',
      title: '4. Differential Feature Engineering',
      desc: 'Calculation of Home - Away differentials, market value ratios, and rolling pre-match form (last 5 and 10 matches).',
      details: 'Generates relative strength indicators: Market Value Difference, Foreign Player Goal Ratio, Rating Gap, and Rest Days Differential.',
      category: 'prep'
    },
    {
      id: 'ml',
      title: '5. Machine Learning Algorithms',
      desc: 'Logistic Regression, Random Forest, Decision Tree, K-Nearest Neighbors, Gradient Boosting, and XGBoost.',
      details: 'Trained using GridSearchCV hyperparameter optimization with 3-class target outcome: Home Win, Draw, Away Win.',
      category: 'ml'
    },
    {
      id: 'eval',
      title: '6. Model Evaluation & Dual Splits',
      desc: 'Stratified Random 80:20 Split alongside Chronological Temporal Time Split (2015–2022 vs 2023–2025).',
      details: 'Evaluated using Macro Precision, Recall, F1-Score, and Confusion Matrices to verify real-world generalization.',
      category: 'ml'
    },
    {
      id: 'prediction_engine',
      title: '7. Probabilistic Prediction Engine',
      desc: 'Generates discrete outcome probabilities (Home Win %, Draw %, Away Win %) and confidence metrics.',
      details: 'Converts feature vector into normalized class probabilities via softmax / calibrated predict_proba inference.',
      category: 'output'
    },
    {
      id: 'explanation',
      title: '8. Factor Explanations & Analytics',
      desc: 'Identifies key positive and negative drivers behind the forecast with feature importance weights.',
      details: 'Deconstructs prediction into actionable insights for coaching staff, analysts, and fans.',
      category: 'output'
    }
  ];

  const activeNode = nodes.find((n) => n.id === selectedNode) || nodes[4];

  return (
    <div className="space-y-10 pb-12">
      {/* Research Paper Overview Banner */}
      <div className="rounded-3xl glass-panel p-8 sm:p-10 border border-white/10 relative overflow-hidden space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <BookOpen className="w-4 h-4" />
          <span>Academic Research Publication • IRJIET Volume 9, Issue 5</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Indian Super League Match Prediction Using Machine Learning
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-300">
          <span><strong>Authors:</strong> Jerein Sam Thomas, Gautham Ragunath, Adhith NJ</span>
          <span><strong>Institution:</strong> SRM Institute of Science and Technology (SRMIST)</span>
          <span><strong>Department:</strong> Computer Science & Engineering (MSc Applied Data Science)</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2 text-xs text-slate-300">
          <strong className="text-white text-sm block">Abstract</strong>
          <p className="leading-relaxed text-slate-300">
            Predicting football match outcomes has traditionally challenged sports analysts due to the high degree of dynamic uncertainty in competitive sports.
            This research develops a multi-dimensional football analytics and predictive modeling platform for the Indian Super League (ISL).
            Leveraging 1,100 matches across 10 seasons with 70 feature variables, the system demonstrates that multi-faceted pre-match variables—including
            player market valuations, foreign vs. Indian squad contributions, rolling recent form, tactical formations, and referee strictness—provide
            robust discriminative capability to forecast match winners while eliminating outcome data leakage.
          </p>
        </div>
      </div>

      {/* Interactive System Architecture */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Interactive System Architecture Flow
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Click on any module in the pipeline to examine its technical specifications and algorithmic role.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Architecture Pipeline Flow Diagram */}
          <div className="lg:col-span-7 space-y-3">
            {nodes.map((node, index) => {
              const isSelected = selectedNode === node.id;
              return (
                <React.Fragment key={node.id}>
                  <div
                    onClick={() => setSelectedNode(node.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-800/40 border-white/5 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-emerald-400 ring-4 ring-emerald-400/20' : 'bg-slate-600'}`} />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{node.title}</h4>
                        <p className="text-[11px] text-slate-400 truncate max-w-md">{node.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">
                      {node.category}
                    </span>
                  </div>

                  {index < nodes.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <ArrowDown className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Detailed Module Inspector */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="rounded-3xl glass-panel p-6 border border-emerald-500/30 bg-emerald-500/5 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Module Inspector
              </span>

              <h3 className="text-lg font-black text-white">{activeNode.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">{activeNode.desc}</p>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 text-xs text-slate-300 space-y-2">
                <strong className="text-emerald-400 block font-bold">Technical Implementation:</strong>
                <p className="leading-relaxed text-slate-400">{activeNode.details}</p>
              </div>

              <div className="text-[11px] text-slate-400 border-t border-white/10 pt-3">
                Status: <strong className="text-emerald-400">Validated & Operational</strong> in Production
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
