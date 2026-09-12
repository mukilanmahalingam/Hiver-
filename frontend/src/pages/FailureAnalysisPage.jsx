import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Lock, 
  FileCode, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Sparkles,
  Search
} from 'lucide-react';
import { api } from '../services/api';

export default function FailureAnalysisPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFailures();
  }, []);

  const fetchFailures = async () => {
    setLoading(true);
    try {
      const res = await api.getFailureAnalysis();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const logs = data?.failure_logs || [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-2xl glass-panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <span>Failure Analysis & Safety Edge Case Studio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit low-evidence escalations, prompt injection attempts, and model boundary edge cases.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
            {logs.length} Flagged Audit Cases
          </span>
        </div>
      </div>

      {/* Safety Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-panel space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Prompt Injection</span>
          <span className="text-2xl font-extrabold text-rose-400">1 Blocked</span>
          <p className="text-[11px] text-slate-400">Zero data leak / zero auto-handle</p>
        </div>

        <div className="p-4 rounded-xl glass-panel space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Financial Risk Triggers</span>
          <span className="text-2xl font-extrabold text-amber-400">1 Escalated</span>
          <p className="text-[11px] text-slate-400">Exceeded brand auto-refund limit</p>
        </div>

        <div className="p-4 rounded-xl glass-panel space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ambiguous Multi-Intent</span>
          <span className="text-2xl font-extrabold text-cyan-300">1 Escalated</span>
          <p className="text-[11px] text-slate-400">Human specialist intervention</p>
        </div>

        <div className="p-4 rounded-xl glass-panel space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Low Vector Evidence</span>
          <span className="text-2xl font-extrabold text-indigo-300">1 Escalated</span>
          <p className="text-[11px] text-slate-400">Sparse historical ticket match</p>
        </div>
      </div>

      {/* Flagged Cases Detailed List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2 px-1">
          <ShieldAlert className="h-4 w-4 text-rose-400" />
          <span>Audit Logged Edge Cases & Safety Interventions</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {logs.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl glass-panel-glow-rose space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-rose-400">{item.case_id}</span>
                  <span className="text-xs text-slate-400 uppercase font-semibold">[{item.brand_id}]</span>
                </div>

                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 text-slate-200 border border-slate-700">
                  {item.flag_type}
                </span>
              </div>

              {/* Customer Message */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Inbound Customer Message
                </span>
                <p className="text-xs text-slate-200 font-sans italic p-2.5 rounded-lg bg-slate-950/80 border border-slate-850">
                  "{item.customer_message}"
                </p>
              </div>

              {/* Root Cause Analysis */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Root Cause Analysis
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {item.root_cause}
                </p>
              </div>

              {/* Status Footer */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center space-x-1.5 text-slate-400">
                  <span>Evidence Score:</span>
                  <span className="font-mono font-bold text-amber-400">{item.evidence_score}%</span>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center space-x-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  <span>{item.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
