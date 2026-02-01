import { TerminalOutput } from '../types';

// Simulated AI responses for educational purposes
// In production, this would integrate with OpenAI API or similar

const AI_RESPONSES = {
  'access denied': [
    'Authentication failed. Access denied.',
    'Invalid credentials. Connection terminated.',
    'Security breach detected. Lockdown initiated.',
    'Firewall blocked connection attempt.'
  ],
  'access granted': [
    'Authentication successful. Access granted.',
    'Welcome back, administrator.',
    'Connection established. Full access enabled.',
    'Credentials verified. System unlocked.'
  ],
  'intrusion detected': [
    'WARNING: Intrusion Detection System activated!',
    'Alert: Unauthorized access attempt logged.',
    'Security protocols engaged. Tracing connection...',
    'IDS Alert: Suspicious activity detected on port 443.'
  ],
  'trace initiated': [
    'Initiating trace on incoming connection...',
    'Backtrace started. Estimated time: 45 seconds.',
    'WARNING: Your IP is being traced!',
    'Counter-intrusion measures activated. Trace in progress...'
  ]
};

const CONTEXTUAL_RESPONSES = {
  firewall: [
    'Firewall detected: Cisco ASA 5500 Series',
    'Active firewall rules: 247',
    'Attempting to bypass firewall...',
    'Firewall has advanced DPI enabled'
  ],
  database: [
    'Database type: MySQL 5.7.33',
    'Attempting SQL injection...',
    'Database contains 15,000+ records',
    'Encryption: AES-256 detected'
  ],
  network: [
    'Network topology mapped',
    'Detected 12 active nodes',
    'Bandwidth: 1Gbps fiber',
    'Router type: Cisco C9300'
  ]
};

export const getAIResponse = async (
  context: string,
  userInput?: string
): Promise<TerminalOutput> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

  // Simple context-based response selection
  const lowerContext = context.toLowerCase();
  
  if (lowerContext.includes('access') && lowerContext.includes('denied')) {
    const responses = AI_RESPONSES['access denied'];
    const text = responses[Math.floor(Math.random() * responses.length)];
    return { text, type: 'error', timestamp: new Date() };
  }
  
  if (lowerContext.includes('access') && lowerContext.includes('granted')) {
    const responses = AI_RESPONSES['access granted'];
    const text = responses[Math.floor(Math.random() * responses.length)];
    return { text, type: 'success', timestamp: new Date() };
  }
  
  if (lowerContext.includes('intrusion') || lowerContext.includes('detect')) {
    const responses = AI_RESPONSES['intrusion detected'];
    const text = responses[Math.floor(Math.random() * responses.length)];
    return { text, type: 'warning', timestamp: new Date() };
  }
  
  if (lowerContext.includes('trace')) {
    const responses = AI_RESPONSES['trace initiated'];
    const text = responses[Math.floor(Math.random() * responses.length)];
    return { text, type: 'warning', timestamp: new Date() };
  }

  // Contextual responses based on keywords
  for (const [key, responses] of Object.entries(CONTEXTUAL_RESPONSES)) {
    if (lowerContext.includes(key)) {
      const text = responses[Math.floor(Math.random() * responses.length)];
      return { text, type: 'info', timestamp: new Date() };
    }
  }

  // Default response
  return {
    text: 'Processing request...',
    type: 'info',
    timestamp: new Date()
  };
};

export const generateScenarioResponse = async (
  scenario: string,
  difficulty: string
): Promise<string[]> => {
  // Simulate scenario-based responses
  const responses: string[] = [];

  switch (scenario) {
    case 'port_scan':
      responses.push('Initializing port scanner...');
      responses.push('Scanning target network range...');
      if (difficulty === 'hard' || difficulty === 'expert') {
        responses.push('WARNING: Target has active IDS');
      }
      responses.push('Scan complete. Open ports discovered.');
      break;

    case 'exploit':
      responses.push('Loading exploit module...');
      responses.push('Analyzing target vulnerability...');
      if (difficulty === 'expert') {
        responses.push('Target employs advanced security measures');
        responses.push('Adjusting exploit parameters...');
      }
      responses.push('Exploit payload prepared');
      break;

    case 'social_engineering':
      responses.push('Crafting phishing email...');
      responses.push('Email sent to target user');
      responses.push('Waiting for user interaction...');
      if (Math.random() > 0.5) {
        responses.push('User clicked malicious link!');
        responses.push('Credentials captured');
      } else {
        responses.push('User did not interact with email');
      }
      break;

    default:
      responses.push('Executing operation...');
      responses.push('Operation complete');
  }

  return responses;
};

// Function to integrate with real OpenAI API (placeholder)
export const getOpenAIResponse = async (
  prompt: string,
  apiKey?: string
): Promise<string> => {
  // In production, this would call the actual OpenAI API
  // For now, return a simulated response
  
  if (!apiKey) {
    console.warn('OpenAI API key not configured. Using simulated responses.');
    return 'Simulated AI response: Operation processing...';
  }

  // Placeholder for actual API call
  // const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${apiKey}`
  //   },
  //   body: JSON.stringify({
  //     model: 'gpt-3.5-turbo',
  //     messages: [{ role: 'user', content: prompt }]
  //   })
  // });

  return 'AI response placeholder';
};
