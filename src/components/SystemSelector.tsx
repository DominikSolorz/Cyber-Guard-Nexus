import React from 'react';
import { Target } from '../types';

interface SystemSelectorProps {
  onSelectTarget: (targetId: string) => void;
}

const TARGETS: Target[] = [
  {
    id: 'bank-01',
    name: 'SwissGold Banking Corp',
    type: 'bank',
    difficulty: 'hard',
    ip: '192.168.100.15',
    description: 'Major financial institution with advanced security systems',
    ports: [21, 22, 80, 443, 3306, 8080],
    vulnerabilities: ['SQL Injection', 'XSS', 'Outdated SSL']
  },
  {
    id: 'personal-01',
    name: 'Home PC - John Doe',
    type: 'personal',
    difficulty: 'easy',
    ip: '192.168.1.105',
    description: 'Residential computer with basic firewall protection',
    ports: [80, 135, 139, 445, 3389],
    vulnerabilities: ['Weak Password', 'Open SMB', 'RDP Enabled']
  },
  {
    id: 'corp-01',
    name: 'TechCorp Industries',
    type: 'corporate',
    difficulty: 'medium',
    ip: '10.50.20.88',
    description: 'Corporate network with moderate security measures',
    ports: [22, 80, 443, 3389, 5432, 8443],
    vulnerabilities: ['Unpatched Services', 'Weak Encryption', 'Default Credentials']
  },
  {
    id: 'bank-02',
    name: 'CyberVault National',
    type: 'bank',
    difficulty: 'expert',
    ip: '172.16.254.10',
    description: 'State-of-the-art banking system with AI-powered defense',
    ports: [22, 443, 8443, 9443],
    vulnerabilities: ['Zero-day Exploit', 'Race Condition', 'Advanced Firewall']
  },
  {
    id: 'personal-02',
    name: 'Smart Home System',
    type: 'personal',
    difficulty: 'easy',
    ip: '192.168.1.200',
    description: 'IoT-based smart home control system',
    ports: [80, 443, 1883, 8080],
    vulnerabilities: ['Default Credentials', 'Unsecured API', 'No Encryption']
  },
  {
    id: 'corp-02',
    name: 'Global Logistics Inc',
    type: 'corporate',
    difficulty: 'hard',
    ip: '10.100.50.75',
    description: 'International shipping company with distributed systems',
    ports: [21, 22, 80, 443, 1433, 3306],
    vulnerabilities: ['Legacy Systems', 'Misconfigured Firewall', 'SQL Injection']
  }
];

const SystemSelector: React.FC<SystemSelectorProps> = ({ onSelectTarget }) => {
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return '#00ff00';
      case 'medium': return '#ffaa00';
      case 'hard': return '#ff6600';
      case 'expert': return '#ff0000';
      default: return '#ffffff';
    }
  };

  const getSystemIcon = (type: string): string => {
    switch (type) {
      case 'bank': return '🏦';
      case 'personal': return '🏠';
      case 'corporate': return '🏢';
      default: return '💻';
    }
  };

  return (
    <div className="system-selector">
      <div className="selector-header">
        <h2>Select Target System</h2>
        <p className="selector-subtitle">Choose a system to begin your penetration test</p>
      </div>

      <div className="targets-grid">
        {TARGETS.map((target) => (
          <div 
            key={target.id} 
            className="target-card"
            onClick={() => onSelectTarget(target.id)}
          >
            <div className="target-header">
              <span className="target-icon">{getSystemIcon(target.type)}</span>
              <div className="target-info">
                <h3>{target.name}</h3>
                <span className="target-ip">{target.ip}</span>
              </div>
            </div>

            <div className="target-body">
              <p className="target-description">{target.description}</p>
              
              <div className="target-meta">
                <div className="meta-item">
                  <span className="meta-label">Type:</span>
                  <span className="meta-value">{target.type.toUpperCase()}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Difficulty:</span>
                  <span 
                    className="meta-value difficulty-badge"
                    style={{ color: getDifficultyColor(target.difficulty) }}
                  >
                    {target.difficulty.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="target-ports">
                <span className="ports-label">Open Ports:</span>
                <div className="ports-list">
                  {target.ports.slice(0, 4).map(port => (
                    <span key={port} className="port-badge">{port}</span>
                  ))}
                  {target.ports.length > 4 && (
                    <span className="port-badge">+{target.ports.length - 4}</span>
                  )}
                </div>
              </div>

              <div className="target-vulns">
                <span className="vulns-label">Known Vulnerabilities:</span>
                <ul className="vulns-list">
                  {target.vulnerabilities.slice(0, 2).map((vuln, idx) => (
                    <li key={idx}>{vuln}</li>
                  ))}
                  {target.vulnerabilities.length > 2 && (
                    <li>+{target.vulnerabilities.length - 2} more...</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="target-footer">
              <button className="btn-select">
                SELECT TARGET →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemSelector;
