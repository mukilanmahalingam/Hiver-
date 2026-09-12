import React, { useState, useEffect } from 'react';
import { 
  MessageSquareCode, 
  Search, 
  Filter, 
  Layers, 
  Sparkles, 
  Database, 
  ArrowRightLeft,
  FileText,
  Star,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

export default function HistoricalEvidencePage({ selectedBrand, brands }) {
  const [searchQuery, setSearchQuery] = useState("duplicate charge billing refund");
  const [brandFilter, setBrandFilter] = useState(selectedBrand || "");
  const [intentFilter, setIntentFilter] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("");
  const [minSim, setMinSim] = useState(0.3);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    handleSearch();
  }, [brandFilter, intentFilter, emotionFilter]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await api.searchEvidence({
        query: searchQuery,
        brand_id: brandFilter || undefined,
        intent: intentFilter || undefined,
        emotion: emotionFilter || undefined,
        min_similarity: minSim,
        limit: 15
      });
      setResults(res.matches || []);
      if (res.matches?.length > 0) {
        setSelectedTicket(res.matches[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Search Bar Panel */}
      <div className="p-5 rounded-2xl glass-panel space-y-4 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <MessageSquareCode className="h-5 w-5 text-cyan-400" />
            <span>Semantic Vector Evidence Search Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Query top-K semantically similar historical support conversations using cosine distance embeddings.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by issue description, error message, refund amount, or topic..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/30 transition-all cursor-pointer whitespace-nowrap"
          >
            {loading ? 'Searching Vectors...' : 'Execute Vector Search'}
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          
          {/* Brand Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Brand Filter</label>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-200 border border-slate-700/80 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="">All Brands (1,050 Tickets)</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Intent Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Intent Category</label>
            <select
              value={intentFilter}
              onChange={(e) => setIntentFilter(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-200 border border-slate-700/80 rounded-lg px-2.5 py-1.5 focus:outline-none capitalize"
            >
              <option value="">All Intents</option>
              <option value="billing_dispute">Billing Dispute</option>
              <option value="account_lockout">Account Lockout</option>
              <option value="technical_bug">Technical Bug</option>
              <option value="cancellation_request">Cancellation</option>
              <option value="shipping_delay">Shipping Delay</option>
              <option value="refund_inquiry">Refund Inquiry</option>
              <option value="feature_request">Feature Request</option>
            </select>
          </div>

          {/* Emotion Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Emotion State</label>
            <select
              value={emotionFilter}
              onChange={(e) => setEmotionFilter(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-200 border border-slate-700/80 rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="">All Emotions</option>
              <option value="Frustrated">Frustrated</option>
              <option value="Angry">Angry</option>
              <option value="Anxious">Anxious</option>
              <option value="Neutral">Neutral</option>
              <option value="Satisfied">Satisfied</option>
            </select>
          </div>

          {/* Min Similarity Slider */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Min Vector Distance</label>
              <span className="text-[10px] font-mono font-bold text-cyan-400">{Math.round(minSim * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={0.9}
              step={0.05}
              value={minSim}
              onChange={(e) => setMinSim(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

        </div>
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Result Tickets List */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
            <span>Search Results ({results.length} Matches)</span>
            <span>Click ticket to inspect provenance</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {results.map((ticket, idx) => {
              const isSelected = selectedTicket?.ticket_id === ticket.ticket_id;
              const simPct = Math.round((ticket.similarity_score || 0) * 100);
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 rounded-xl glass-panel border transition-all cursor-pointer ${
                    isSelected ? 'border-cyan-500 ring-1 ring-cyan-500/50 bg-slate-900/90' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{ticket.ticket_id}</span>
                      <span className="text-xs text-slate-400 font-medium">{ticket.brand_name || ticket.brand_id}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {simPct}% Similarity
                      </span>
                      <span className="text-amber-400 text-xs font-bold flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-amber-400" />
                        <span>{ticket.csat}</span>
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 line-clamp-2 italic mb-2">"{ticket.customer_query}"</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-850">
                    <span className="capitalize">Intent: {ticket.intent?.replace('_', ' ')}</span>
                    <span className="capitalize text-emerald-400 font-medium">{ticket.outcome}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Comparative Inspector Panel */}
        <div className="lg:col-span-6">
          {selectedTicket ? (
            <div className="p-5 rounded-2xl glass-panel-glow-cyan space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <ArrowRightLeft className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Historical Ticket Comparative Inspector
                  </h3>
                </div>
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                  {selectedTicket.ticket_id}
                </span>
              </div>

              {/* Vector Match Score Bar */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Semantic Cosine Distance Match:</span>
                  <span className="font-mono font-extrabold text-cyan-400 text-sm">
                    {Math.round(selectedTicket.similarity_score * 100)}% Match
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.round(selectedTicket.similarity_score * 100)}%` }}
                  />
                </div>
              </div>

              {/* Customer Query */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Original Customer Query
                </label>
                <div className="p-3.5 rounded-xl bg-slate-950 text-slate-200 text-xs font-sans italic border border-slate-800">
                  "{selectedTicket.customer_query}"
                </div>
              </div>

              {/* Historical Agent Resolution */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  Verified Historical Resolution Thread ({selectedTicket.resolved_by})
                </label>
                <div className="p-3.5 rounded-xl bg-emerald-950/20 text-slate-200 text-xs font-mono border border-emerald-800/40 leading-relaxed">
                  {selectedTicket.historical_resolution}
                </div>
              </div>

              {/* Metadata Badges */}
              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Outcome</span>
                  <span className="text-xs font-extrabold text-emerald-400">{selectedTicket.outcome}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">CSAT Rating</span>
                  <span className="text-xs font-extrabold text-amber-400">{selectedTicket.csat} / 5.0</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Emotion Tag</span>
                  <span className="text-xs font-extrabold text-cyan-300">{selectedTicket.emotion}</span>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 rounded-2xl glass-panel flex flex-col items-center justify-center text-slate-400">
              <FileText className="h-10 w-10 text-slate-600 mb-2" />
              <p className="text-xs font-medium">Select a ticket from search results to inspect details</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
