import React from 'react';
import { Star, FileText, CheckCircle, RefreshCw, UserCheck, Sparkles } from 'lucide-react';

export default function HistoricalTicketCard({ ticket }) {
  if (!ticket) return null;

  const simPct = Math.round((ticket.similarity_score || 0) * 100);

  return (
    <div className="p-4 rounded-xl glass-panel border border-slate-800 hover:border-slate-700 transition-all duration-200 group">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
            {ticket.ticket_id}
          </span>
          <span className="text-xs text-slate-400 font-medium">{ticket.brand_name || ticket.brand_id}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded text-[11px] font-mono text-emerald-300">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            <span>{simPct}% Match</span>
          </div>
          <span className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{ticket.csat}</span>
          </span>
        </div>
      </div>

      {/* Query */}
      <div className="mb-2.5">
        <p className="text-xs text-slate-200 line-clamp-2 font-sans italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
          "{ticket.customer_query}"
        </p>
      </div>

      {/* Resolution */}
      <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-800/30 text-xs text-slate-300">
        <div className="flex items-center justify-between text-[11px] text-indigo-300 font-semibold mb-1">
          <span className="uppercase tracking-wider">Historical Agent Resolution</span>
          <span className="text-[10px] text-slate-400 font-mono">{ticket.resolved_by}</span>
        </div>
        <p className="line-clamp-3 text-slate-300 leading-relaxed font-sans">
          {ticket.historical_resolution}
        </p>
      </div>
    </div>
  );
}
