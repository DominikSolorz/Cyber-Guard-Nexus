import React, { useEffect, useState } from 'react';

interface DashboardProps {
  currentView: string;
  onViewChange: (view: 'dashboard' | 'terminal' | 'network') => void;
  selectedTarget: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ currentView, onViewChange, selectedTarget }) => {
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState({
    completedHacks: 0,
    activeConnections: 0,
    detectionRate: 0
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-header">
      <div className="dashboard-brand">
        <h1 className="brand-title">
          <span className="cyber-icon">⚡</span>
          CYBER GUARD NEXUS
        </h1>
        <div className="brand-subtitle">Advanced Hacking Simulator</div>
      </div>

      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => onViewChange('dashboard')}
        >
          <span className="nav-icon">🎯</span>
          Targets
        </button>
        <button 
          className={`nav-btn ${currentView === 'terminal' ? 'active' : ''}`}
          onClick={() => onViewChange('terminal')}
          disabled={!selectedTarget}
        >
          <span className="nav-icon">💻</span>
          Terminal
        </button>
        <button 
          className={`nav-btn ${currentView === 'network' ? 'active' : ''}`}
          onClick={() => onViewChange('network')}
        >
          <span className="nav-icon">🌐</span>
          Network Map
        </button>
      </nav>

      <div className="dashboard-stats">
        <div className="stat-item">
          <span className="stat-label">System Time:</span>
          <span className="stat-value">{time.toLocaleTimeString()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed:</span>
          <span className="stat-value">{stats.completedHacks}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active:</span>
          <span className="stat-value">{stats.activeConnections}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Detection:</span>
          <span className="stat-value">{stats.detectionRate}%</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
