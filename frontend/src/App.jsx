import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MessageAnalysisPage from './pages/MessageAnalysisPage';
import HistoricalEvidencePage from './pages/HistoricalEvidencePage';
import SupportDNAPage from './pages/SupportDNAPage';
import EvaluationPage from './pages/EvaluationPage';
import FailureAnalysisPage from './pages/FailureAnalysisPage';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [selectedBrand, setSelectedBrand] = useState('payvault');
  const [brands, setBrands] = useState([
    { id: "payvault", name: "PayVault Financial", industry: "Fintech & Banking" },
    { id: "techpulse", name: "TechPulse Enterprise", industry: "SaaS & Cloud Software" },
    { id: "skywings", name: "SkyWings Airlines", industry: "Travel & Aviation" },
    { id: "streamflix", name: "StreamFlix Media", industry: "Consumer Streaming" },
    { id: "retailpro", name: "RetailPro Commerce", industry: "E-Commerce" }
  ]);
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const h = await api.getHealth();
      setHealth(h);
      const b = await api.getBrands();
      if (b && b.length > 0) setBrands(b);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Top Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        health={health}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        brands={brands}
      />

      {/* Primary Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'analysis' && (
          <MessageAnalysisPage selectedBrand={selectedBrand} brands={brands} />
        )}
        {activeTab === 'evidence' && (
          <HistoricalEvidencePage selectedBrand={selectedBrand} brands={brands} />
        )}
        {activeTab === 'dna' && (
          <SupportDNAPage selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} brands={brands} />
        )}
        {activeTab === 'evaluation' && (
          <EvaluationPage />
        )}
        {activeTab === 'failure' && (
          <FailureAnalysisPage />
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-4 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">SupportDNA AI Framework</span>
            <span>•</span>
            <span>Multi-Brand Explainable AI Decision Engine</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-mono text-cyan-400">FAISS / TF-IDF Vector Retrieval</span>
            <span>•</span>
            <span className="font-mono text-emerald-400">Scikit-learn Intent Pipelines</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
