import React from 'react';

interface PitchProps {
  formation?: string;
  teamName?: string;
  isHome?: boolean;
  color?: string; // 'emerald' | 'cyan'
}

// Tactical coordinates on a 400x560 pitch (y=500 is GK, y=80 is ST)
const FORMATION_COORDS: Record<string, Array<{ role: string; x: number; y: number }>> = {
  '4-3-3': [
    { role: 'GK', x: 200, y: 500 },
    { role: 'RB', x: 330, y: 420 },
    { role: 'RCB', x: 250, y: 430 },
    { role: 'LCB', x: 150, y: 430 },
    { role: 'LB', x: 70, y: 420 },
    { role: 'RCM', x: 280, y: 290 },
    { role: 'CDM', x: 200, y: 330 },
    { role: 'LCM', x: 120, y: 290 },
    { role: 'RW', x: 330, y: 160 },
    { role: 'ST', x: 200, y: 120 },
    { role: 'LW', x: 70, y: 160 },
  ],
  '4-2-3-1': [
    { role: 'GK', x: 200, y: 500 },
    { role: 'RB', x: 330, y: 420 },
    { role: 'RCB', x: 250, y: 430 },
    { role: 'LCB', x: 150, y: 430 },
    { role: 'LB', x: 70, y: 420 },
    { role: 'RDM', x: 260, y: 340 },
    { role: 'LDM', x: 140, y: 340 },
    { role: 'RAM', x: 320, y: 220 },
    { role: 'CAM', x: 200, y: 210 },
    { role: 'LAM', x: 80, y: 220 },
    { role: 'ST', x: 200, y: 110 },
  ],
  '4-4-2': [
    { role: 'GK', x: 200, y: 500 },
    { role: 'RB', x: 330, y: 420 },
    { role: 'RCB', x: 250, y: 430 },
    { role: 'LCB', x: 150, y: 430 },
    { role: 'LB', x: 70, y: 420 },
    { role: 'RM', x: 340, y: 280 },
    { role: 'RCM', x: 250, y: 290 },
    { role: 'LCM', x: 150, y: 290 },
    { role: 'LM', x: 60, y: 280 },
    { role: 'RS', x: 260, y: 130 },
    { role: 'LS', x: 140, y: 130 },
  ],
  '3-5-2': [
    { role: 'GK', x: 200, y: 500 },
    { role: 'RCB', x: 290, y: 420 },
    { role: 'CB', x: 200, y: 430 },
    { role: 'LCB', x: 110, y: 420 },
    { role: 'RWB', x: 350, y: 300 },
    { role: 'RCM', x: 260, y: 290 },
    { role: 'CDM', x: 200, y: 340 },
    { role: 'LCM', x: 140, y: 290 },
    { role: 'LWB', x: 50, y: 300 },
    { role: 'RS', x: 260, y: 130 },
    { role: 'LS', x: 140, y: 130 },
  ],
  '3-4-3': [
    { role: 'GK', x: 200, y: 500 },
    { role: 'RCB', x: 290, y: 420 },
    { role: 'CB', x: 200, y: 430 },
    { role: 'LCB', x: 110, y: 420 },
    { role: 'RM', x: 340, y: 290 },
    { role: 'RCM', x: 250, y: 300 },
    { role: 'LCM', x: 150, y: 300 },
    { role: 'LM', x: 60, y: 290 },
    { role: 'RW', x: 320, y: 160 },
    { role: 'ST', x: 200, y: 120 },
    { role: 'LW', x: 80, y: 160 },
  ],
  '5-3-2': [
    { role: 'GK', x: 200, y: 500 },
    { role: 'RWB', x: 360, y: 380 },
    { role: 'RCB', x: 280, y: 430 },
    { role: 'CB', x: 200, y: 440 },
    { role: 'LCB', x: 120, y: 430 },
    { role: 'LWB', x: 40, y: 380 },
    { role: 'RCM', x: 280, y: 280 },
    { role: 'CM', x: 200, y: 290 },
    { role: 'LCM', x: 120, y: 280 },
    { role: 'RS', x: 260, y: 140 },
    { role: 'LS', x: 140, y: 140 },
  ],
};

export const FootballPitch: React.FC<PitchProps> = ({
  formation = '4-3-3',
  teamName = 'Team',
  isHome = true,
  color = 'emerald',
}) => {
  const players = FORMATION_COORDS[formation] || FORMATION_COORDS['4-3-3'];
  const isEmerald = color === 'emerald';

  const nodeColor = isEmerald ? 'fill-emerald-500 stroke-emerald-300' : 'fill-cyan-500 stroke-cyan-300';
  const glowFilter = isEmerald ? 'rgba(16, 185, 129, 0.4)' : 'rgba(6, 182, 212, 0.4)';

  return (
    <div className="relative w-full max-w-[380px] mx-auto rounded-2xl overflow-hidden glass-panel p-3 border border-white/10 shadow-2xl">
      {/* Header Overlay */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isEmerald ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'}`}>
            {isHome ? 'HOME' : 'AWAY'}
          </span>
          <span className="ml-2 text-sm font-bold text-white tracking-wide">{teamName}</span>
        </div>
        <div className="text-xs font-mono font-bold bg-slate-800/80 px-2.5 py-1 rounded-md text-emerald-400 border border-slate-700">
          {formation}
        </div>
      </div>

      {/* SVG Football Pitch */}
      <svg
        viewBox="0 0 400 560"
        className="w-full h-auto rounded-xl bg-gradient-to-b from-[#0e2a1b] via-[#091b12] to-[#0a1f14] shadow-inner select-none"
      >
        <defs>
          <pattern id="pitchGrass" width="400" height="70" patternUnits="userSpaceOnUse">
            <rect width="400" height="35" fill="#0d2618" opacity="0.4" />
            <rect y="35" width="400" height="35" fill="#081d12" opacity="0.4" />
          </pattern>
        </defs>

        {/* Grass Texture */}
        <rect width="400" height="560" fill="url(#pitchGrass)" />

        {/* Pitch Boundary Lines */}
        <rect x="20" y="20" width="360" height="520" fill="none" stroke="#22c55e" strokeWidth="2" strokeOpacity="0.5" rx="4" />

        {/* Halfway Line */}
        <line x1="20" y1="280" x2="380" y2="280" stroke="#22c55e" strokeWidth="2" strokeOpacity="0.5" />

        {/* Center Circle & Spot */}
        <circle cx="200" cy="280" r="55" fill="none" stroke="#22c55e" strokeWidth="2" strokeOpacity="0.5" />
        <circle cx="200" cy="280" r="3.5" fill="#22c55e" fillOpacity="0.8" />

        {/* Attacking Half (Top) Penalty Box */}
        <rect x="110" y="20" width="180" height="85" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.5" />
        <rect x="150" y="20" width="100" height="35" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.4" />
        <circle cx="200" cy="65" r="2.5" fill="#22c55e" fillOpacity="0.7" />
        <path d="M 160 105 A 40 40 0 0 0 240 105" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.5" />

        {/* Defending Half (Bottom) Penalty Box */}
        <rect x="110" y="455" width="180" height="85" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.5" />
        <rect x="150" y="505" width="100" height="35" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.4" />
        <circle cx="200" cy="495" r="2.5" fill="#22c55e" fillOpacity="0.7" />
        <path d="M 160 455 A 40 40 0 0 1 240 455" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.5" />

        {/* Corner Arcs */}
        <path d="M 20 35 A 15 15 0 0 0 35 20" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.4" />
        <path d="M 365 20 A 15 15 0 0 0 380 35" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.4" />
        <path d="M 20 525 A 15 15 0 0 1 35 540" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.4" />
        <path d="M 365 540 A 15 15 0 0 1 380 525" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Tactical Nodes / Players */}
        {players.map((p, idx) => (
          <g key={idx} className="cursor-pointer transition-transform hover:scale-110">
            {/* Glow outer ring */}
            <circle
              cx={p.x}
              cy={p.y}
              r="17"
              fill={glowFilter}
              opacity="0.6"
            />
            {/* Player Node */}
            <circle
              cx={p.x}
              cy={p.y}
              r="13"
              className={nodeColor}
              strokeWidth="2.5"
            />
            {/* Role Label */}
            <text
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="9"
              fontWeight="bold"
              fontFamily="sans-serif"
            >
              {p.role}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
