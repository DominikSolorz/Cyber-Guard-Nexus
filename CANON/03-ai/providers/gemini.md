# Google Gemini Integration Guide

Neutral integration guide for Google Gemini API. Security-focused, production-ready patterns.

## Overview

Google Gemini provides access to multimodal AI models via REST API. This guide covers secure integration patterns for text and multimodal use cases.

## Security Considerations

### API Key Management
- **NEVER** hardcode API keys
- Use environment variables: `GEMINI_API_KEY`
- Rotate keys regularly
- Use separate keys per environment
- Implement access logging

### Rate Limiting
- Implement client-side rate limiting
- Handle quota exceeded errors (429)
- Use exponential backoff
- Monitor usage quotas

### Input Validation
- Validate all user inputs
- Sanitize content before sending
- Implement file type validation for multimodal
- Set size limits for uploads
- Prevent prompt injection

### Content Safety
- Use built-in safety settings
- Implement additional content filtering
- Log flagged content
- Handle blocked responses gracefully

## Basic Integration Pattern

### Environment Setup
```bash
# .env file
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-pro  # Options: gemini-pro, gemini-pro-vision
GEMINI_TIMEOUT=30000  # Request timeout in milliseconds
GEMINI_MAX_TOKENS=2048  # Max output tokens (gemini-pro supports up to 8192)
```

### JavaScript/Node.js Example
```javascript
// Secure Gemini client wrapper
class SecureGeminiClient {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1';
        this.timeout = parseInt(process.env.GEMINI_TIMEOUT) || 30000;
        this.model = process.env.GEMINI_MODEL || 'gemini-pro';
        
        if (!this.apiKey) {
            throw new Error('GEMINI_API_KEY not configured');
        }
    }

    async generateText(prompt, options = {}) {
        // Input validation
        if (!prompt || typeof prompt !== 'string') {
            throw new Error('Invalid prompt');
        }

        // Sanitize input
        const sanitizedPrompt = this.sanitizeInput(prompt);

        const payload = {
            contents: [{
                parts: [{
                    text: sanitizedPrompt
                }]
            }],
            generationConfig: {
                maxOutputTokens: options.maxTokens || 2048,
                temperature: options.temperature || 0.7,
                topP: options.topP || 0.8,
                topK: options.topK || 40,
            },
            safetySettings: this.getSafetySettings(options.safetyLevel)
        };

        try {
            const response = await this.makeRequest(
                `/models/${this.model}:generateContent`,
                payload
            );
            return this.validateResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    async chat(messages, options = {}) {
        // Validate messages
        if (!Array.isArray(messages) || messages.length === 0) {
            throw new Error('Invalid messages array');
        }

        const contents = messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: this.sanitizeInput(msg.content) }]
        }));

        const payload = {
            contents: contents,
            generationConfig: {
                maxOutputTokens: options.maxTokens || 2048,
                temperature: options.temperature || 0.7,
            },
            safetySettings: this.getSafetySettings(options.safetyLevel)
        };

        try {
            const response = await this.makeRequest(
                `/models/${this.model}:generateContent`,
                payload
            );
            return this.validateResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    sanitizeInput(input) {
        // Remove control characters
        let sanitized = input.replace(/[\x00-\x1F\x7F]/g, '');
        
        // Limit length
        const maxLength = 30000; // Gemini supports longer context
        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }
        
        return sanitized;
    }

    getSafetySettings(level = 'default') {
        const levels = {
            'strict': 'BLOCK_LOW_AND_ABOVE',
            'default': 'BLOCK_MEDIUM_AND_ABOVE',
            'permissive': 'BLOCK_ONLY_HIGH'
        };

        const threshold = levels[level] || levels['default'];

        return [
            {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: threshold
            },
            {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: threshold
            },
            {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: threshold
            },
            {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: threshold
            }
        ];
    }

    async makeRequest(endpoint, payload) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const url = `${this.baseUrl}${endpoint}?key=${this.apiKey}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    validateResponse(response) {
        // Check for blocked content
        if (response.promptFeedback?.blockReason) {
            throw new Error(`Content blocked: ${response.promptFeedback.blockReason}`);
        }

        // Validate candidates
        if (!response.candidates || response.candidates.length === 0) {
            throw new Error('No response candidates');
        }

        const candidate = response.candidates[0];

        // Check if content was filtered
        if (candidate.finishReason === 'SAFETY') {
            throw new Error('Response filtered for safety');
        }

        const text = candidate.content.parts[0].text;

        return {
            content: text,
            safetyRatings: candidate.safetyRatings,
            finishReason: candidate.finishReason
        };
    }

    handleError(error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        
        // Log error (implement proper logging)
        console.error('Gemini API Error:', error);
        
        throw error;
    }
}

// Usage example
async function example() {
    const client = new SecureGeminiClient();
    
    try {
        // Simple text generation
        const result = await client.generateText('Explain quantum computing in simple terms');
        console.log(result.content);

        // Chat example
        const chatResult = await client.chat([
            { role: 'user', content: 'Hello! How are you?' },
            { role: 'assistant', content: 'I am doing well, thank you!' },
            { role: 'user', content: 'What can you help me with?' }
        ]);
        console.log(chatResult.content);
    } catch (error) {
        console.error('Error:', error.message);
    }
}
```

### Python Example
```python
import os
import requests
from typing import List, Dict, Optional

class SecureGeminiClient:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.base_url = 'https://generativelanguage.googleapis.com/v1'
        self.timeout = int(os.getenv('GEMINI_TIMEOUT', 30))
        self.model = os.getenv('GEMINI_MODEL', 'gemini-pro')
        
        if not self.api_key:
            raise ValueError('GEMINI_API_KEY not configured')
    
    def generate_text(self, prompt: str, **options) -> Dict:
        if not prompt or not isinstance(prompt, str):
            raise ValueError('Invalid prompt')
        
        sanitized_prompt = self.sanitize_input(prompt)
        
        payload = {
            'contents': [{
                'parts': [{'text': sanitized_prompt}]
            }],
            'generationConfig': {
                'maxOutputTokens': options.get('max_tokens', 2048),
                'temperature': options.get('temperature', 0.7),
                'topP': options.get('top_p', 0.8),
                'topK': options.get('top_k', 40),
            },
            'safetySettings': self.get_safety_settings(options.get('safety_level'))
        }
        
        try:
            response = self.make_request(
                f'/models/{self.model}:generateContent',
                payload
            )
            return self.validate_response(response)
        except Exception as e:
            return self.handle_error(e)
    
    def chat(self, messages: List[Dict], **options) -> Dict:
        if not isinstance(messages, list) or len(messages) == 0:
            raise ValueError('Invalid messages array')
        
        contents = []
        for msg in messages:
            role = 'model' if msg['role'] == 'assistant' else 'user'
            contents.append({
                'role': role,
                'parts': [{'text': self.sanitize_input(msg['content'])}]
            })
        
        payload = {
            'contents': contents,
            'generationConfig': {
                'maxOutputTokens': options.get('max_tokens', 2048),
                'temperature': options.get('temperature', 0.7),
            },
            'safetySettings': self.get_safety_settings(options.get('safety_level'))
        }
        
        try:
            response = self.make_request(
                f'/models/{self.model}:generateContent',
                payload
            )
            return self.validate_response(response)
        except Exception as e:
            return self.handle_error(e)
    
    def sanitize_input(self, input_text: str) -> str:
        # Remove control characters
        sanitized = ''.join(char for char in input_text if ord(char) >= 32 or char == '\n')
        
        # Limit length
        max_length = 30000
        if len(sanitized) > max_length:
            sanitized = sanitized[:max_length]
        
        return sanitized
    
    def get_safety_settings(self, level: Optional[str] = None) -> List[Dict]:
        levels = {
            'strict': 'BLOCK_LOW_AND_ABOVE',
            'default': 'BLOCK_MEDIUM_AND_ABOVE',
            'permissive': 'BLOCK_ONLY_HIGH'
        }
        
        threshold = levels.get(level, levels['default'])
        
        return [
            {'category': 'HARM_CATEGORY_HARASSMENT', 'threshold': threshold},
            {'category': 'HARM_CATEGORY_HATE_SPEECH', 'threshold': threshold},
            {'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'threshold': threshold},
            {'category': 'HARM_CATEGORY_DANGEROUS_CONTENT', 'threshold': threshold}
        ]
    
    def make_request(self, endpoint: str, payload: Dict) -> Dict:
        url = f'{self.base_url}{endpoint}?key={self.api_key}'
        
        response = requests.post(
            url,
            json=payload,
            timeout=self.timeout
        )
        
        response.raise_for_status()
        return response.json()
    
    def validate_response(self, response: Dict) -> Dict:
        # Check for blocked content
        if response.get('promptFeedback', {}).get('blockReason'):
            raise ValueError(f"Content blocked: {response['promptFeedback']['blockReason']}")
        
        # Validate candidates
        if 'candidates' not in response or len(response['candidates']) == 0:
            raise ValueError('No response candidates')
        
        candidate = response['candidates'][0]
        
        # Check if content was filtered
        if candidate.get('finishReason') == 'SAFETY':
            raise ValueError('Response filtered for safety')
        
        text = candidate['content']['parts'][0]['text']
        
        return {
            'content': text,
            'safety_ratings': candidate.get('safetyRatings'),
            'finish_reason': candidate.get('finishReason')
        }
    
    def handle_error(self, error: Exception):
        print(f'Gemini API Error: {error}')
        raise error

# Usage
if __name__ == '__main__':
    client = SecureGeminiClient()
    
    try:
        result = client.generate_text('Explain quantum computing')
        print(result['content'])
    except Exception as e:
        print(f'Error: {e}')
```

## Best Practices

### Cost Management
- Monitor quota usage in Google Cloud Console
- Implement usage tracking
- Cache responses when appropriate
- Choose appropriate model (gemini-pro vs gemini-pro-vision)
- Set reasonable token limits

### Error Handling
- Handle quota exceeded (429) errors
- Implement retry with exponential backoff
- Gracefully handle safety blocks
- Provide user-friendly messages
- Log errors for monitoring

### Safety Settings
- Use appropriate safety levels for your use case
- Test with various content types
- Have fallback for blocked content
- Document safety policy
- Review flagged content regularly

### Monitoring
- Track API usage and costs
- Monitor response times
- Log safety ratings
- Alert on unusual patterns
- Review blocked content

## Resources

- Gemini API Documentation: https://ai.google.dev/docs
- API Pricing: https://ai.google.dev/pricing
- Safety Settings Guide: https://ai.google.dev/docs/safety_setting_gemini
- Community: https://discuss.ai.google.dev

## Compliance

- Review Google's AI usage policies
- Ensure data privacy compliance
- Document AI usage in privacy policy
- Implement consent mechanisms
- Consider data residency requirements
