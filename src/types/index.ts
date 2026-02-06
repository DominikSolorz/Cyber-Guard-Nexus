export interface SecurityScan {
  id: string
  target: string
  scan_type: string
  status: 'running' | 'completed' | 'failed'
  findings: number
  created_at: string
}

export interface Vulnerability {
  id: string
  title: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  cve_id: string
  affected_system: string
  description: string
  remediation: string
  discovered_at: string
}

export interface Threat {
  id: string
  type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  source_ip: string
  target: string
  description: string
  detected_at: string
  status: 'active' | 'mitigated' | 'investigating'
}

export interface SystemMetrics {
  cpu_usage: number
  memory_usage: number
  network_traffic: {
    incoming: number
    outgoing: number
  }
  active_connections: number
  timestamp: string
}

export interface SecurityEvent {
  id: string
  event_type: string
  severity: 'critical' | 'warning' | 'info'
  message: string
  timestamp: string
}
