export type SystemType = 'bank' | 'personal' | 'corporate';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export interface Target {
  id: string;
  name: string;
  type: SystemType;
  difficulty: DifficultyLevel;
  ip: string;
  description: string;
  ports: number[];
  vulnerabilities: string[];
}

export interface TerminalCommand {
  command: string;
  args: string[];
  timestamp: Date;
}

export interface TerminalOutput {
  text: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'system';
  timestamp: Date;
}

export interface ScanResult {
  port: number;
  status: 'open' | 'closed' | 'filtered';
  service?: string;
}

export interface HackProgress {
  stage: string;
  progress: number;
  status: 'running' | 'success' | 'failed' | 'detected';
}
