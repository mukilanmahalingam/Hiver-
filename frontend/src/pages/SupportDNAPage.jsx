import React, { useState, useEffect } from 'react';
import { 
  Dna, 
  ShieldCheck, 
  Sliders, 
  BarChart, 
  Sparkles, 
  DollarSign, 
  Clock, 
  UserCheck,
  CheckCircle,
  AlertOctagon
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { api } from '../services/api';

export default function SupportDNAPage({ selectedBrand, setSelectedBrand, brands }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDNA(selectedBrand);
  }, [selectedBrand]);

  const fetchDNA = async (bId) => {
    setLoading(true);
    try {
      const res = await api.getBrandDNA(bId);
      setProfile(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const brandObj = profile?.brand || brands[0];
  const commStyle = brandObj?.communication_style || { empathy: 85, directness: 90, formality: 95, technicality: 60, speed_target: 120 };

  const styleRadarData = [
    { subject: 'Empathy', score: commStyle.empathy },
    { subject: 'Directness', score: commStyle.directness },
    { subject: 'Formality', score: commStyle.formality },
    { subject: 'Technicality', score: commStyle.technicality },
    { subject: 'Speed (SLA)', score: Math.round(100 - (commStyle.speed_target / 3)) }
  ];

  const intentDistData = profile?.metrics?.intent_distribution ? 
    Object.entries(profile.metrics.intent_distribution).map(([k, v]) => ({
      intent: k.replace('_', ' '),
      count: v
    })) : [
      { intent: "billing dispute", count: 85 },
      { intent: "account lockout", count: 62 },
      { intent: "technical bug", count: 44 },
      { intent: "refund inquiry", count: 49 }
    ];

  return (
    <div className="space-y-6">
      
      {/* Brand Selection Bar */}
      <div className="p-5 rounded-2xl glass-panel flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <Dna className="h-5 w-5 text-cyan-400" />
            <span>SupportDNA™ Brand Governance Intelligence</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure risk ceilings, communication personas, and escalation guardrails per brand.
          </p>
        </div>

        {/* Brand Switcher Pills */}
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(b.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedBrand === b.id
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-indigo-900/40 border border-cyan-400/50'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Communication Persona & Key Stats */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Brand DNA Overview Card */}
          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{brandObj.industry}</span>
                <h3 className="text-xl font-extrabold text-white">{brandObj.name}</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                DNA Active
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">{brandObj.description}</p>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Brand Support Tone</span>
              <p className="text-xs font-semibold text-slate-100">{brandObj.tone}</p>
            </div>

            {/* Metrics Badges */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">First Contact Resolution</span>
                <span className="text-2xl font-extrabold text-emerald-400">{profile?.metrics?.first_contact_resolution_rate || 92.4}%</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Average Historical CSAT</span>
                <span className="text-2xl font-extrabold text-amber-400">{profile?.metrics?.average_csat || 4.75} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Communication Persona Radar */}
          <div className="p-5 rounded-2xl glass-panel space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Communication Persona Radar Metrics
            </h3>
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={styleRadarData}>
                  <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
                  <Radar name="Style Score" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column: Governance Guardrails & Intent Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Governance Guardrails List */}
          <div className="p-5 rounded-2xl glass-panel space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Enforced SupportDNA Governance Guardrails</span>
            </h3>

            <div className="space-y-3">
              {profile?.governance_guardrails?.map((g, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-cyan-300">{g.rule}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {g.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{g.description}</p>
                </div>
              ))}

              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-800/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-rose-300 flex items-center space-x-1.5">
                    <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />
                    <span>Mandatory Escalation Trigger Keywords</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    ACTIVE
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {brandObj.escalation_triggers?.map((trig, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-rose-300 border border-rose-900/60">
                      {trig}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Common Intent Distribution Bar Chart */}
          <div className="p-5 rounded-2xl glass-panel space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Historical Ticket Volume by Intent ({brandObj.name})
            </h3>
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={intentDistData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="intent" tick={{ fill: '#94a3b8', fontSize: 9 }} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} 
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
