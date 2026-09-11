import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Database,
  BrainCircuit,
  Award,
  Shield,
  Activity,
  Layers
} from 'lucide-react';
import { FootballPitch } from '../components/FootballPitch';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  const stats = [
    { label: 'Matches Analyzed', value: '1,100', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
    { label: 'Seasons Covered', value: '2015–2025', icon: <TrendingUp className="w-4 h-4 text-cyan-400" /> },
    { label: 'ISL Clubs', value: '12 Teams', icon: <Shield className="w-4 h-4 text-amber-400" /> },
    { label: 'Feature Variables', value: '70 Dimensions', icon: <Database className="w-4 h-4 text-purple-400" /> },
    { label: 'Production ML Models', value: '6 Algorithms', icon: <BrainCircuit className="w-4 h-4 text-emerald-400" /> },
    { label: 'Target Outcome', value: 'Win / Draw / Loss', icon: <Award className="w-4 h-4 text-cyan-400" /> },
  ];

  const features = [
    {
      id: 'predictor',
      title: 'Match Prediction Engine',
      desc: 'Predict upcoming Indian Super League fixtures using pre-match form, market values, and tactical setups with real probabilistic confidence.',
      icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
      tag: 'Machine Learning',
    },
    {
      id: 'indian-vs-foreign',
      title: 'Indian vs Foreign Player Analytics',
      desc: 'Groundbreaking comparative analysis on goals, big chances, clearances/tackles, and market valuation contributions.',
      icon: <Layers className="w-6 h-6 text-cyan-400" />,
      tag: 'MSc Core Research',
    },
    {
      id: 'tactics',
      title: 'Tactical Formations on Pitch',
      desc: 'Evaluate 4-3-3, 4-2-3-1, 4-4-2, 3-5-2, and 3-4-3 formations with an interactive SVG football pitch and win-rate statistics.',
      icon: <TrendingUp className="w-6 h-6 text-amber-400" />,
      tag: 'Tactical Analysis',
    },
    {
      id: 'models',
      title: 'ML Model Evaluation & Benchmarks',
      desc: 'Inspect Logistic Regression, Random Forest, Decision Tree, KNN, Gradient Boosting, and XGBoost across temporal and random splits.',
      icon: <BrainCircuit className="w-6 h-6 text-purple-400" />,
      tag: 'Evaluation',
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-12 border border-white/10 pitch-gradient">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MSc Applied Data Science Research • SRMIST</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              ISL Football <span className="text-emerald-400">Intelligence</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              An advanced machine-learning match prediction and football analytics platform.
              Built on 1,100 Indian Super League matches from 2015 to 2025 with strict zero-leakage
              pre-match feature engineering, probabilistic outcome forecasting, and tactical intelligence.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setActiveTab('predictor')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
              >
                <Sparkles className="w-4 h-4" />
                <span>Predict Match</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800/80 text-slate-200 font-bold text-sm hover:bg-slate-700 transition-all border border-white/10"
              >
                <span>Explore League Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('models')}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl text-emerald-400 text-sm font-semibold hover:underline"
              >
                <span>View ML Models & Paper</span>
              </button>
            </div>

            {/* Academic Author Badge */}
            <div className="pt-4 text-xs text-slate-400 border-t border-white/10">
              <p>
                <strong>Research Authors:</strong> Jerein Sam Thomas, Gautham Ragunath, Adhith NJ
              </p>
              <p className="text-slate-400">
                Department of Computer Science & Engineering • SRM Institute of Science and Technology
              </p>
            </div>
          </div>

          {/* Hero Right Pitch Component */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm">
              <FootballPitch
                formation="4-3-3"
                teamName="Mumbai City FC"
                isHome={true}
                color="emerald"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Ticker Bar */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-2xl border border-white/5 text-center">
            <div className="flex justify-center mb-1.5">{s.icon}</div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">{s.label}</p>
            <p className="text-lg font-black text-white mt-0.5">{s.value}</p>
          </div>
        ))}
      </section>

      {/* Platform Pillars / Feature Cards */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Platform Capabilities</h2>
          <p className="text-xs text-slate-400">
            Explore deep football analytics backed by genuine historical dataset calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f) => (
            <div
              key={f.id}
              onClick={() => setActiveTab(f.id)}
              className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-emerald-500/40 transition-all cursor-pointer group hover:shadow-xl relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/5 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/5">
                  {f.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                {f.desc}
              </p>
              <div className="mt-4 flex items-center text-xs font-bold text-emerald-400 gap-1">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
