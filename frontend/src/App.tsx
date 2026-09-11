import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { api } from './services/api';

// Pages
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { MatchPredictorPage } from './pages/MatchPredictorPage';
import { TeamAnalyticsPage } from './pages/TeamAnalyticsPage';
import { PlayerAnalyticsPage } from './pages/PlayerAnalyticsPage';
import { IndianVsForeignPage } from './pages/IndianVsForeignPage';
import { TacticalAnalysisPage } from './pages/TacticalAnalysisPage';
import { HeadToHeadPage } from './pages/HeadToHeadPage';
import { MatchConditionsPage } from './pages/MatchConditionsPage';
import { RefereeAnalysisPage } from './pages/RefereeAnalysisPage';
import { MLModelsPage } from './pages/MLModelsPage';
import { FeatureImportancePage } from './pages/FeatureImportancePage';
import { DataExplorerPage } from './pages/DataExplorerPage';
import { DataQualityPage } from './pages/DataQualityPage';
import { ResearchPage } from './pages/ResearchPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedTeam, setSelectedTeam] = useState<string>('Mumbai City FC');
  const [apiHealthy, setApiHealthy] = useState<boolean>(false);

  useEffect(() => {
    const checkAPI = () => {
      api.checkHealth()
        .then(() => setApiHealthy(true))
        .catch(() => setApiHealthy(false));
    };
    checkAPI();
    const interval = setInterval(checkAPI, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} setSelectedTeam={setSelectedTeam} />;
      case 'predictor':
        return <MatchPredictorPage />;
      case 'teams':
        return <TeamAnalyticsPage initialTeam={selectedTeam} />;
      case 'players':
        return <PlayerAnalyticsPage setActiveTab={setActiveTab} />;
      case 'indian-vs-foreign':
        return <IndianVsForeignPage />;
      case 'tactics':
        return <TacticalAnalysisPage />;
      case 'h2h':
        return <HeadToHeadPage />;
      case 'conditions':
        return <MatchConditionsPage />;
      case 'referees':
        return <RefereeAnalysisPage />;
      case 'models':
        return <MLModelsPage />;
      case 'features':
        return <FeatureImportancePage />;
      case 'explorer':
        return <DataExplorerPage />;
      case 'quality':
        return <DataQualityPage />;
      case 'research':
        return <ResearchPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        apiHealthy={apiHealthy}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main App Layout: Sidebar + Page Container */}
      <div className="flex flex-1 w-full">
        {/* Left Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
