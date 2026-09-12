import React from 'react';
import { ShieldCheck, AlertCircle, Award } from 'lucide-react';

export default function EvidenceScoreBadge({ score }) {
  const rounded = Math.round(score || 0);

  let badgeColor = 'from-emerald-500 to-teal-400 text-emerald-300 border-emerald-500/40 shadow-emerald-950/50';
  let levelText = 'HIGH EVIDENCE CONFIDENCE';
  let Icon = ShieldCheck;

  if (rounded < 60) {
    badgeColor = 'from-rose-600 to-amber-500 text-rose-300 border-rose-500/40 shadow-rose-950/50';
    levelText = 'LOW EVIDENCE / ESCALATE';
    Icon = AlertCircle;
  } else if (rounded < 80) {
    badgeColor = 'from-amber-500 to-yellow-400 text-amber-300 border-amber-500/40 shadow-amber-950/50';
    levelText = 'MODERATE EVIDENCE';
    Icon = Award;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl glass-panel relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      
      <div className="flex items-center space-x-1.5 mb-1.5">
        <Icon className="h-4 w-4 text-slate-300" />
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Evidence Score</span>
      </div>

      <div className="relative flex items-center justify-center my-1">
        {/* Number Badge */}
        <div className="flex items-baseline space-x-1">
          <span className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
            {rounded}
          </span>
          <span className="text-lg font-bold text-slate-400">%</span>
        </div>
      </div>

      <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border bg-slate-900/80 ${badgeColor}`}>
        {levelText}
      </div>

      <p className="text-[11px] text-slate-400 text-center mt-2 font-medium leading-tight">
        Grounded against 1,000+ historical vector tickets
      </p>
    </div>
  );
}
