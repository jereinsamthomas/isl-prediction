import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PredictionResult } from '../types';
import { PredictionCard } from '../components/PredictionCard';
import { InfluencingFactors } from '../components/InfluencingFactors';
import { FootballPitch } from '../components/FootballPitch';
import { Sparkles, Sliders, Shield, RefreshCw } from 'lucide-react';

export const MatchPredictorPage: React.FC = () => {
  const [options, setOptions] = useState<{
    teams: string[];
    formations: string[];
    weather_conditions: string[];
    pitch_conditions: string[];
    available_models: string[];
  } | null>(null);

  const [homeTeam, setHomeTeam] = useState<string>('Mumbai City FC');
  const [awayTeam, setAwayTeam] = useState<string>('Kerala Blasters');
  const [selectedModel, setSelectedModel] = useState<string>('Random Forest');

  // Advanced Optional Settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [homeFormation, setHomeFormation] = useState<string>('4-3-3');
  const [awayFormation, setAwayFormation] = useState<string>('3-5-2');
  const [weather, setWeather] = useState<string>('Clear');
  const [pitch, setPitch] = useState<string>('Good');
  const [matchCondition, setMatchCondition] = useState<string>('Night');
  const [keyMissing, setKeyMissing] = useState<string>('None');
  const [refStrictness, setRefStrictness] = useState<number>(0.50);

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getPredictionOptions()
      .then((opts) => {
        setOptions(opts);
        if (opts.teams.length >= 2) {
          setHomeTeam(opts.teams[0]);
          setAwayTeam(opts.teams[1]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handlePredict = async () => {
    if (homeTeam === awayTeam) {
      setError('Home and Away teams must be different.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await api.predictMatch({
        home_team: homeTeam,
        away_team: awayTeam,
        model: selectedModel,
        home_formation: homeFormation,
        away_formation: awayFormation,
        weather: weather,
        pitch_condition: pitch,
        match_condition: matchCondition,
        key_player_missing_side: keyMissing,
        referee_strictness_index: refStrictness,
      });
      setPrediction(res);
    } catch (err: any) {
      setError(err.message || 'Prediction failed.');
    } finally {
      setLoading(false);
    }
  };

  // Run initial prediction once options load
  useEffect(() => {
    if (options && !prediction) {
      handlePredict();
    }
  }, [options]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          ISL Match Predictor Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Predict match outcomes using pre-match statistics, ratings, formations, and market values without outcome data leakage.
        </p>
      </div>

      {/* Match Setup Controls Box */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Home Team Select */}
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Home Team
            </label>
            <select
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-emerald-500"
            >
              {options?.teams.map((t) => (
                <option key={t} value={t} disabled={t === awayTeam}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* VS Divider & Model Selector */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">VERSUS</span>
            <div className="w-full">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Algorithm
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 text-center"
              >
                {options?.available_models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Away Team Select */}
          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Away Team
            </label>
            <select
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white font-semibold text-sm focus:outline-none focus:border-cyan-500"
            >
              {options?.teams.map((t) => (
                <option key={t} value={t} disabled={t === homeTeam}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Toggle Advanced Match Conditions */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>{showAdvanced ? 'Hide Tactical & Match Conditions' : 'Customize Formations, Weather & Pitch Factors'}</span>
          </button>

          {/* Predict Action Button */}
          <button
            type="button"
            onClick={handlePredict}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing Probabilities...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>PREDICT MATCH</span>
              </>
            )}
          </button>
        </div>

        {/* Advanced Options Accordion */}
        {showAdvanced && (
          <div className="mt-4 p-5 rounded-2xl bg-slate-900/60 border border-white/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Home Formation</label>
              <select
                value={homeFormation}
                onChange={(e) => setHomeFormation(e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                {options?.formations.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Away Formation</label>
              <select
                value={awayFormation}
                onChange={(e) => setAwayFormation(e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                {options?.formations.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Weather</label>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                {options?.weather_conditions.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Pitch Condition</label>
              <select
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                {options?.pitch_conditions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Key Player Missing</label>
              <select
                value={keyMissing}
                onChange={(e) => setKeyMissing(e.target.value)}
                className="w-full p-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                <option value="None">None</option>
                <option value="Home">Home Side</option>
                <option value="Away">Away Side</option>
                <option value="Both">Both Sides</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Ref Strictness ({refStrictness})
              </label>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={refStrictness}
                onChange={(e) => setRefStrictness(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 mt-2"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}
      </div>

      {/* Main Prediction Output */}
      {prediction && (
        <div className="space-y-6">
          <PredictionCard prediction={prediction} />

          {/* Tactical Formation Comparison on Pitch */}
          <div className="rounded-3xl glass-panel p-6 border border-white/10">
            <h3 className="text-base font-bold text-white mb-4 text-center">
              Tactical Setups on Pitch
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <FootballPitch
                formation={homeFormation}
                teamName={homeTeam}
                isHome={true}
                color="emerald"
              />
              <FootballPitch
                formation={awayFormation}
                teamName={awayTeam}
                isHome={false}
                color="cyan"
              />
            </div>
          </div>

          {/* Qualitative Factors & Top Model Feature Importance */}
          <InfluencingFactors
            factors={prediction.key_influencing_factors}
            topFeatures={prediction.top_features}
          />
        </div>
      )}
    </div>
  );
};
