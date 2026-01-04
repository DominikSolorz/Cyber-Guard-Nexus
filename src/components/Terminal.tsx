import React, { useState, useEffect, useRef } from 'react';
import { TerminalOutput } from '../types';
import { executeCommand } from '../services/commandService';
import { playSound } from '../utils/soundManager';

interface TerminalProps {
  target: string | null;
}

const Terminal: React.FC<TerminalProps> = ({ target }) => {
  const [history, setHistory] = useState<TerminalOutput[]>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Welcome message
    addOutput({
      text: '╔════════════════════════════════════════════════════════════╗',
      type: 'system',
      timestamp: new Date()
    });
    addOutput({
      text: '║     CYBER GUARD NEXUS - Advanced Hacking Simulator v1.0   ║',
      type: 'system',
      timestamp: new Date()
    });
    addOutput({
      text: '╚════════════════════════════════════════════════════════════╝',
      type: 'system',
      timestamp: new Date()
    });
    addOutput({
      text: '',
      type: 'info',
      timestamp: new Date()
    });
    addOutput({
      text: 'Type "help" for available commands.',
      type: 'info',
      timestamp: new Date()
    });
    addOutput({
      text: 'WARNING: All actions are simulated for educational purposes only.',
      type: 'warning',
      timestamp: new Date()
    });
    addOutput({
      text: '',
      type: 'info',
      timestamp: new Date()
    });

    if (target) {
      addOutput({
        text: `Target system selected: ${target}`,
        type: 'success',
        timestamp: new Date()
      });
    }
  }, [target]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const addOutput = (output: TerminalOutput) => {
    setHistory(prev => [...prev, output]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add user input to history
    addOutput({
      text: `$ ${input}`,
      type: 'info',
      timestamp: new Date()
    });

    playSound('keypress');

    // Execute command
    const outputs = await executeCommand(input.trim(), target);
    outputs.forEach(output => addOutput(output));

    // Update command history
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const getOutputClass = (type: string): string => {
    switch (type) {
      case 'success': return 'output-success';
      case 'error': return 'output-error';
      case 'warning': return 'output-warning';
      case 'system': return 'output-system';
      default: return 'output-info';
    }
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-controls">
          <span className="control-dot red"></span>
          <span className="control-dot yellow"></span>
          <span className="control-dot green"></span>
        </div>
        <div className="terminal-title">
          root@cyberguard:~# {target ? `[${target}]` : '[No Target]'}
        </div>
        <div className="terminal-actions">
          <button onClick={() => setHistory([])}>Clear</button>
        </div>
      </div>

      <div className="terminal-body" ref={terminalRef}>
        <div className="terminal-output">
          {history.map((output, index) => (
            <div key={index} className={`output-line ${getOutputClass(output.type)}`}>
              {output.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="terminal-input-form">
          <span className="terminal-prompt">$</span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command..."
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;
