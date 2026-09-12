import React from 'react';
import { 
  Bot, 
  MessageSquareCode, 
  Dna, 
  BarChart3, 
  AlertTriangle, 
  ShieldCheck, 
  Database,
  Layers
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, health, selectedBrand, setSelectedBrand, brands }) {
  const navItems = [
    { id: 'analysis', label: 'Message Analysis & Copilot', icon: Bot },
    { id: 'evidence', label: 'Historical Evidence', icon: MessageSquareCode },
    { id: 'dna', label: 'SupportDNA Profiles', icon: Dna },
    { id: 'evaluation', label: 'Evaluation & Benchmarks', icon: BarChart3 },
    { id: 'failure', label: 'Failure Analysis & Edge Cases', icon: AlertTriangle },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Dna className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  SupportDNA <span className="text-cyan-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/50 ml-1">AI 2.0</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Explainable AI & Support Governance Engine</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/30 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-indigo-900/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Status Controls & Brand Selector */}
          <div className="flex items-center space-x-3">
            {/* Active Brand Selector */}
            <div className="flex items-center space-x-2 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700/60 shadow-inner">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                {brands.map((b) => (
                  <option key={b.id} value={b.id} className="bg-slate-900 text-slate-200">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Health / Dataset Counter */}
            <div className="hidden sm:flex items-center space-x-2 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md text-[11px] font-mono text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <Database className="h-3 w-3 text-emerald-400" />
              <span>{health?.total_historical_conversations || 1050} Threads</span>
            </div>

          </div>
        </div>
      </div>
      
      {/* Mobile Nav */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 space-x-2 border-t border-slate-800/60 bg-slate-950/90 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap font-medium ${
                isActive ? 'bg-indigo-600/40 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 bg-slate-900/50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
