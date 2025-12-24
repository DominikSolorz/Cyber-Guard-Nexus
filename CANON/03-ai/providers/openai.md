# OpenAI Integration Guide

Neutral integration guide for OpenAI API. No branding, security-focused, production-ready patterns.

## Overview

OpenAI provides access to large language models via REST API. This guide covers secure integration patterns.

## Security Considerations

### API Key Management
- **NEVER** hardcode API keys in source code
- Use environment variables: `OPENAI_API_KEY`
- Rotate keys regularly
- Use separate keys for dev/staging/prod
- Implement key access logging

### Rate Limiting
- Implement client-side rate limiting
- Handle 429 (rate limit) responses gracefully
- Use exponential backoff for retries
- Monitor usage to avoid unexpected costs

### Input Sanitization
- Validate and sanitize all user inputs
- Implement content filtering
- Set maximum input lengths
- Prevent prompt injection attacks

### Output Validation
- Validate API responses
- Implement content moderation
- Filter sensitive information
- Log outputs for audit

## Basic Integration Pattern

### Environment Setup
```bash
# .env file
OPENAI_API_KEY=your_key_here
OPENAI_ORG_ID=your_org_id  # Optional
OPENAI_MAX_TOKENS=1000
OPENAI_TIMEOUT=30000
```

### JavaScript/Node.js Example
```javascript
// Secure OpenAI client wrapper
class SecureOpenAIClient {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
        this.baseUrl = 'https://api.openai.com/v1';
        this.timeout = parseInt(process.env.OPENAI_TIMEOUT) || 30000;
        
        if (!this.apiKey) {
            throw new Error('OPENAI_API_KEY not configured');
        }
    }

    async chat(messages, options = {}) {
        // Input validation
        if (!Array.isArray(messages) || messages.length === 0) {
            throw new Error('Invalid messages array');
        }

        // Sanitize inputs
        const sanitizedMessages = this.sanitizeMessages(messages);

        const payload = {
            model: options.model || 'gpt-3.5-turbo',
            messages: sanitizedMessages,
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature || 0.7,
        };

        try {
            const response = await this.makeRequest('/chat/completions', payload);
            return this.validateResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    sanitizeMessages(messages) {
        return messages.map(msg => ({
            role: this.validateRole(msg.role),
            content: this.sanitizeContent(msg.content)
        }));
    }

    validateRole(role) {
        const validRoles = ['system', 'user', 'assistant'];
        if (!validRoles.includes(role)) {
            throw new Error(`Invalid role: ${role}`);
        }
        return role;
    }

    sanitizeContent(content) {
        // Remove control characters
        let sanitized = content.replace(/[\x00-\x1F\x7F]/g, '');
        
        // Limit length
        const maxLength = 10000;
        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }
        
        return sanitized;
    }

    async makeRequest(endpoint, payload) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    validateResponse(response) {
        if (!response.choices || response.choices.length === 0) {
            throw new Error('Invalid API response');
        }

        return {
            content: response.choices[0].message.content,
            usage: response.usage,
            model: response.model
        };
    }

    handleError(error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        
        // Log error (implement logging)
        console.error('OpenAI API Error:', error);
        
        throw error;
    }
}

// Usage example
async function example() {
    const client = new SecureOpenAIClient();
    
    try {
        const result = await client.chat([
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'Hello!' }
        ]);
        
        console.log(result.content);
    } catch (error) {
        console.error('Error:', error.message);
    }
}
```

### Python Example
```python
import os
import requests
from typing import List, Dict

class SecureOpenAIClient:
    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY')
        self.base_url = 'https://api.openai.com/v1'
        self.timeout = int(os.getenv('OPENAI_TIMEOUT', 30))
        
        if not self.api_key:
            raise ValueError('OPENAI_API_KEY not configured')
    
    def chat(self, messages: List[Dict], **options) -> Dict:
        # Input validation
        if not isinstance(messages, list) or len(messages) == 0:
            raise ValueError('Invalid messages array')
        
        # Sanitize inputs
        sanitized_messages = self.sanitize_messages(messages)
        
        payload = {
            'model': options.get('model', 'gpt-3.5-turbo'),
            'messages': sanitized_messages,
            'max_tokens': options.get('max_tokens', 1000),
            'temperature': options.get('temperature', 0.7),
        }
        
        try:
            response = self.make_request('/chat/completions', payload)
            return self.validate_response(response)
        except Exception as e:
            return self.handle_error(e)
    
    def sanitize_messages(self, messages: List[Dict]) -> List[Dict]:
        return [
            {
                'role': self.validate_role(msg['role']),
                'content': self.sanitize_content(msg['content'])
            }
            for msg in messages
        ]
    
    def validate_role(self, role: str) -> str:
        valid_roles = ['system', 'user', 'assistant']
        if role not in valid_roles:
            raise ValueError(f'Invalid role: {role}')
        return role
    
    def sanitize_content(self, content: str) -> str:
        # Remove control characters
        sanitized = ''.join(char for char in content if ord(char) >= 32 or char == '\n')
        
        # Limit length
        max_length = 10000
        if len(sanitized) > max_length:
            sanitized = sanitized[:max_length]
        
        return sanitized
    
    def make_request(self, endpoint: str, payload: Dict) -> Dict:
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}'
        }
        
        response = requests.post(
            f'{self.base_url}{endpoint}',
            json=payload,
            headers=headers,
            timeout=self.timeout
        )
        
        response.raise_for_status()
        return response.json()
    
    def validate_response(self, response: Dict) -> Dict:
        if 'choices' not in response or len(response['choices']) == 0:
            raise ValueError('Invalid API response')
        
        return {
            'content': response['choices'][0]['message']['content'],
            'usage': response.get('usage'),
            'model': response.get('model')
        }
    
    def handle_error(self, error: Exception):
        # Log error (implement logging)
        print(f'OpenAI API Error: {error}')
        raise error

# Usage
if __name__ == '__main__':
    client = SecureOpenAIClient()
    
    try:
        result = client.chat([
            {'role': 'system', 'content': 'You are a helpful assistant.'},
            {'role': 'user', 'content': 'Hello!'}
        ])
        print(result['content'])
    except Exception as e:
        print(f'Error: {e}')
```

## Best Practices

### Cost Management
- Set budget alerts in OpenAI dashboard
- Implement usage tracking
- Cache responses when appropriate
- Use appropriate models (not always the largest)
- Set reasonable max_tokens limits

### Error Handling
- Handle network errors gracefully
- Implement retry logic with backoff
- Provide user-friendly error messages
- Log errors for debugging
- Have fallback behavior

### Monitoring
- Track API usage and costs
- Monitor response times
- Log errors and failures
- Alert on unusual patterns
- Review outputs regularly

### Privacy
- Don't send PII unless necessary
- Implement data minimization
- Review OpenAI's data retention policy
- Consider using Azure OpenAI for more control
- Document data processing

## Testing

### Unit Tests
```javascript
// Example unit test
describe('SecureOpenAIClient', () => {
    it('should sanitize messages', () => {
        const client = new SecureOpenAIClient();
        const messages = [
            { role: 'user', content: 'Test\x00message' }
        ];
        const sanitized = client.sanitizeMessages(messages);
        expect(sanitized[0].content).toBe('Testmessage');
    });
});
```

### Integration Tests
- Test with API in isolated environment
- Use test keys (if available)
- Mock responses for unit tests
- Test error scenarios
- Validate rate limiting

## Resources

- OpenAI API Documentation: https://platform.openai.com/docs
- API Status: https://status.openai.com
- Community Forum: https://community.openai.com
- Pricing: https://openai.com/pricing

## Compliance

- Review OpenAI's usage policies
- Ensure GDPR/CCPA compliance if applicable
- Document AI usage in privacy policy
- Implement user consent mechanisms
- Consider data residency requirements
