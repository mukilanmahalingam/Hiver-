import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

export default function RiskRadarChart({ riskRadar }) {
  if (!riskRadar) return null;

  const data = [
    { subject: 'Financial', risk: Math.round((riskRadar.financial_risk || 0) * 100) },
    { subject: 'Reputation', risk: Math.round((riskRadar.reputational_risk || 0) * 100) },
    { subject: 'Legal/Compliance', risk: Math.round((riskRadar.legal_compliance_risk || 0) * 100) },
    { subject: 'Churn Impact', risk: Math.round((riskRadar.churn_risk || 0) * 100) },
    { subject: 'SLA Urgency', risk: Math.round((riskRadar.sentiment_urgency_risk || 0) * 100) },
  ];

  return (
    <div className="w-full h-56 flex flex-col justify-center items-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
          <Radar 
            name="Risk Score" 
            dataKey="risk" 
            stroke="#f43f5e" 
            fill="#f43f5e" 
            fillOpacity={0.35} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
