import React from 'react';

interface DisclaimerModalProps {
  onAccept: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content disclaimer-modal">
        <div className="modal-header">
          <h1>⚠️ LEGAL DISCLAIMER ⚠️</h1>
        </div>
        
        <div className="modal-body">
          <div className="disclaimer-text">
            <h2>Educational & Entertainment Purpose Only</h2>
            
            <p>
              <strong>Cyber Guard Nexus</strong> is a <em>simulated hacking environment</em> 
              designed exclusively for educational and entertainment purposes.
            </p>
            
            <div className="warning-box">
              <h3>⚠️ IMPORTANT WARNINGS:</h3>
              <ul>
                <li>This simulator does NOT perform any real hacking or intrusion activities</li>
                <li>All targets, networks, and systems are FICTIONAL and SIMULATED</li>
                <li>No actual computer systems are accessed, modified, or harmed</li>
                <li>Using real hacking tools against systems without permission is ILLEGAL</li>
                <li>This tool should ONLY be used for learning cybersecurity concepts</li>
              </ul>
            </div>
            
            <div className="info-box">
              <h3>ℹ️ What This Tool Does:</h3>
              <ul>
                <li>Simulates various cybersecurity scenarios and tools</li>
                <li>Provides AI-powered responses to simulate realistic interactions</li>
                <li>Teaches basic concepts of network security and ethical hacking</li>
                <li>Offers a safe environment to explore cybersecurity without risks</li>
              </ul>
            </div>
            
            <p className="legal-notice">
              By clicking "I Understand & Accept," you acknowledge that:
            </p>
            <ul className="legal-list">
              <li>You will use this tool only for educational and entertainment purposes</li>
              <li>You understand this is a simulation and not a real hacking tool</li>
              <li>You will not attempt to use knowledge gained here for illegal activities</li>
              <li>The developers are not responsible for any misuse of information</li>
            </ul>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn-accept" onClick={onAccept}>
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal;
