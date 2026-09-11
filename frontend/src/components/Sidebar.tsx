import React from 'react';
import {
  Home,
  LayoutDashboard,
  Sparkles,
  Shield,
  Users,
  Flag,
  Crosshair,
  Swords,
  CloudSun,
  Scale,
  BrainCircuit,
  BarChart3,
  Database,
  CheckCircle,
  FileText,
  Info,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  category?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: NavItem[] = [
    // Core
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" />, category: 'Core' },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, category: 'Core' },
    { id: 'predictor', label: 'Match Predictor', icon: <Sparkles className="w-4 h-4" />, badge: 'ML', category: 'Core' },

    // Analytics
    { id: 'teams', label: 'Team Analytics', icon: <Shield className="w-4 h-4" />, category: 'Analytics' },
    { id: 'players', label: 'Player Analytics', icon: <Users className="w-4 h-4" />, category: 'Analytics' },
    { id: 'indian-vs-foreign', label: 'Indian vs Foreign', icon: <Flag className="w-4 h-4" />, badge: 'Research', category: 'Analytics' },
    { id: 'tactics', label: 'Tactical Formations', icon: <Crosshair className="w-4 h-4" />, category: 'Analytics' },
    { id: 'h2h', label: 'Head-to-Head', icon: <Swords className="w-4 h-4" />, category: 'Analytics' },
    { id: 'conditions', label: 'Match Conditions', icon: <CloudSun className="w-4 h-4" />, category: 'Analytics' },
    { id: 'referees', label: 'Referee Analysis', icon: <Scale className="w-4 h-4" />, category: 'Analytics' },

    // Machine Learning & Data
    { id: 'models', label: 'ML Models Comparison', icon: <BrainCircuit className="w-4 h-4" />, badge: '6 Models', category: 'ML & Data' },
    { id: 'features', label: 'Feature Importance', icon: <BarChart3 className="w-4 h-4" />, category: 'ML & Data' },
    { id: 'explorer', label: 'Data Explorer', icon: <Database className="w-4 h-4" />, badge: '1.1k', category: 'ML & Data' },
    { id: 'quality', label: 'Data Quality & Dict', icon: <CheckCircle className="w-4 h-4" />, category: 'ML & Data' },

    // Research
    { id: 'research', label: 'Research & System', icon: <FileText className="w-4 h-4" />, category: 'Research' },
    { id: 'about', label: 'About Project', icon: <Info className="w-4 h-4" />, category: 'Research' },
  ];

  const categories = ['Core', 'Analytics', 'ML & Data', 'Research'];

  return (
    <aside className="w-64 glass-panel border-r border-white/10 flex flex-col h-[calc(100vh-4rem)] sticky top-16 shrink-0 overflow-y-auto p-3">
      <div className="space-y-6">
        {categories.map((category) => {
          const items = navItems.filter((i) => i.category === category);
          return (
            <div key={category}>
              <h3 className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {category}
              </h3>
              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                            isActive
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Badge */}
      <div className="mt-auto pt-4 border-t border-white/10 px-2 text-[11px] text-slate-400">
        <p className="font-semibold text-slate-300">SRMIST Research</p>
        <p>ISL 2015-2025 Dataset</p>
      </div>
    </aside>
  );
};
