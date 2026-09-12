import React from 'react';
import { 
  CheckCircle2, 
  UserCheck, 
  ShieldAlert, 
  Zap, 
  Check, 
  X, 
  ListChecks, 
  AlertTriangle 
} from 'lucide-react';

export default function DecisionCard({ decision, brandName }) {
  if (!decision) return null;

  const isAuto = decision.action === 'AUTO_HANDLE';

  return (
    <div className={`p-5 rounded-2xl transition-all duration-300 ${
      isAuto ? 'glass-panel-glow-emerald' : 'glass-panel-glow-rose'
    }`}>
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl font-bold ${
            isAuto ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40' : 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40'
          }`}>
            {isAuto ? <Zap className="h-6 w-6" /> : <UserCheck className="h-6 w-6" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-white tracking-wide uppercase">
                {isAuto ? 'AUTO-HANDLE APPROVED' : 'HUMAN AGENT ESCALATION'}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                isAuto ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}>
                Risk: {decision.risk_level}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">
              {decision.primary_reason}
            </p>
          </div>
        </div>
      </div>

      {/* Governance Guardrails Checklist */}
      <div className="mt-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-cyan-400" />
          <span>SupportDNA Guardrail Verification</span>
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {decision.governance_checks?.map((check, idx) => (
            <div 
              key={idx} 
              className="flex items-start justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs"
            >
              <div className="flex items-center space-x-2">
                {check.passed ? (
                  <div className="p-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                ) : (
                  <div className="p-0.5 rounded bg-rose-500/20 text-rose-400">
                    <X className="h-3.5 w-3.5" />
                  </div>
                )}
                <span className="font-medium text-slate-200">{check.check}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono text-right pl-2">{check.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Human Agent Checklist (If Escalated) */}
      {!isAuto && decision.human_agent_checklist && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40">
          <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <ListChecks className="h-4 w-4 text-rose-400" />
            <span>Human Agent Action Checklist</span>
          </h4>
          <ul className="space-y-1.5">
            {decision.human_agent_checklist.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                <span className="text-rose-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
