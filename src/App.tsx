import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Terminal from './components/Terminal';
import NetworkMap from './components/NetworkMap';
import SystemSelector from './components/SystemSelector';
import DisclaimerModal from './components/DisclaimerModal';

const App: React.FC = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'terminal' | 'network'>('dashboard');
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const handleAcceptDisclaimer = () => {
    setShowDisclaimer(false);
  };

  return (
    <div className="app">
      {showDisclaimer && <DisclaimerModal onAccept={handleAcceptDisclaimer} />}
      
      <div className="app-container">
        <Dashboard 
          currentView={currentView}
          onViewChange={setCurrentView}
          selectedTarget={selectedTarget}
        />
        
        <div className="main-content">
          {currentView === 'dashboard' && (
            <SystemSelector onSelectTarget={setSelectedTarget} />
          )}
          
          {currentView === 'terminal' && (
            <Terminal target={selectedTarget} />
          )}
          
          {currentView === 'network' && (
            <NetworkMap />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
