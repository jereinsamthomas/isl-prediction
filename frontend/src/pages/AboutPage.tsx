import React from 'react';
import { Shield, Award, Users, BookOpen, AlertCircle, Compass, Cpu } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          About the ISL Football Intelligence Project
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Academic background, authors, future-ready architecture roadmap, and research disclaimers.
        </p>
      </div>

      {/* Project Overview Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Research Origin & Affiliation</span>
        </div>

        <h2 className="text-xl font-bold text-white">
          Indian Super League Match Prediction Using Machine Learning
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Developed as an advanced sports analytics and predictive engineering research initiative at{' '}
          <strong>SRM Institute of Science and Technology (SRMIST)</strong>, Kattankulathur, Tamil Nadu, India.
          Published in the <em>International Research Journal of Innovations in Engineering and Technology (IRJIET)</em>,
          Volume 9, Issue 5, March 2026.
        </p>
      </div>

      {/* Authors Profiles */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          <span>Research Authors & Contributors</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
              JT
            </div>
            <h4 className="text-sm font-bold text-white">Jerein Sam Thomas</h4>
            <p className="text-xs text-slate-400">Department of Computer Science & Engineering (MSc. Applied Data Science)</p>
            <span className="text-[10px] font-mono text-emerald-400 block pt-1">SRMIST, Kattankulathur</span>
          </div>

          <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black">
              GR
            </div>
            <h4 className="text-sm font-bold text-white">Gautham Ragunath</h4>
            <p className="text-xs text-slate-400">Department of Computer Applications (MCA – Generative AI)</p>
            <span className="text-[10px] font-mono text-cyan-400 block pt-1">SRMIST, Kattankulathur</span>
          </div>

          <div className="rounded-2xl glass-panel p-5 border border-white/10 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black">
              AN
            </div>
            <h4 className="text-sm font-bold text-white">Adhith NJ</h4>
            <p className="text-xs text-slate-400">Department of Computer Science & Engineering (MSc. Applied Data Science)</p>
            <span className="text-[10px] font-mono text-purple-400 block pt-1">SRMIST, Kattankulathur</span>
          </div>
        </div>
      </div>

      {/* Future-Ready Architecture Roadmap */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <span>Future-Ready Analytical Architecture Roadmap</span>
        </h3>
        <p className="text-xs text-slate-300">
          The platform modular service architecture is designed to support subsequent integrations without system refactoring:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5 space-y-1">
            <strong className="text-white block">• Expected Goals (xG) & Expected Threat (xT):</strong>
            <p className="text-slate-400">Spatial event tracking to evaluate shot quality and dangerous possession chains.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5 space-y-1">
            <strong className="text-white block">• Passing Networks & Event Sequences:</strong>
            <p className="text-slate-400">Graph neural networks modeling ball progression and passing cluster density.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5 space-y-1">
            <strong className="text-white block">• Computer Vision & Optical Player Tracking:</strong>
            <p className="text-slate-400">Automated broadcast camera coordinate extraction for off-ball pressing metrics.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-white/5 space-y-1">
            <strong className="text-white block">• Real-Time In-Play Forecasting:</strong>
            <p className="text-slate-400">Dynamic Bayesian outcome updates as live match events unfold.</p>
          </div>
        </div>
      </div>

      {/* Disclaimers & Ethics */}
      <div className="rounded-3xl p-6 bg-slate-900 border border-white/10 space-y-3 text-xs text-slate-400">
        <h4 className="font-bold text-white flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          <span>Scientific & Predictive Disclaimers</span>
        </h4>
        <p className="leading-relaxed">
          <strong>Statistical Nature of Predictions:</strong> All match predictions generated by this platform are probabilistic estimates calculated from historical machine learning models. They are intended strictly for academic, research, and analytical purposes and must not be interpreted as guaranteed match outcomes or financial/betting advice.
        </p>
        <p className="leading-relaxed">
          <strong>Player Fatigue & Risk Indicators:</strong> The workload and fatigue indices represent football performance metrics derived from fixture frequency and rest schedules. They do not constitute medical, physiological, or clinical diagnoses.
        </p>
      </div>
    </div>
  );
};
