# Google Gemini Integration Guide

Source: Legal-Buddy-AI (adapted, secrets replaced with placeholders)

## Overview

This guide covers integration with Google's Gemini AI API for AI-powered features.

---

## Setup

### 1. API Key Configuration

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

```bash
# Environment variable
export GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

Or in `.env` file:
```env
GEMINI_API_KEY=YOUR_API_KEY_HERE
```

### 2. Installation

```bash
# Python
pip install google-generativeai

# Node.js
npm install @google/generative-ai
```

---

## Basic Usage

### Python Example

```python
import os
import google.generativeai as genai

# Configure API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize model
model = genai.GenerativeModel('gemini-pro')

# Generate content
response = model.generate_content("Hello, how are you?")
print(response.text)
```

### Node.js Example

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = "Hello, how are you?";
  const result = await model.generateContent(prompt);
  const response = await result.response;
  
  console.log(response.text());
}

run();
```

---

## Available Models

| Model | Description | Best For |
|-------|-------------|----------|
| `gemini-pro` | Text generation | General text tasks |
| `gemini-pro-vision` | Multimodal (text + image) | Image understanding, analysis |
| `gemini-ultra` | Most capable | Complex reasoning tasks |

---

## Advanced Features

### Chat Conversation

```python
model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat(history=[])

# Send messages
response = chat.send_message("What's the weather like?")
print(response.text)

response = chat.send_message("And tomorrow?")
print(response.text)

# View chat history
for message in chat.history:
    print(f"{message.role}: {message.parts[0].text}")
```

### Streaming Responses

```python
model = genai.GenerativeModel('gemini-pro')

response = model.generate_content(
    "Write a story about a robot",
    stream=True
)

for chunk in response:
    print(chunk.text, end="")
```

### Vision Model (Image Analysis)

```python
import PIL.Image

model = genai.GenerativeModel('gemini-pro-vision')

# Load image
img = PIL.Image.open('image.jpg')

# Generate content with image
response = model.generate_content([
    "What's in this image?",
    img
])

print(response.text)
```

### Safety Settings

```python
from google.generativeai.types import HarmCategory, HarmBlockThreshold

safety_settings = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}

model = genai.GenerativeModel('gemini-pro')
response = model.generate_content(
    "Your prompt here",
    safety_settings=safety_settings
)
```

---

## Configuration Parameters

### Generation Config

```python
generation_config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

model = genai.GenerativeModel(
    'gemini-pro',
    generation_config=generation_config
)
```

**Parameters Explained:**
- `temperature`: Controls randomness (0.0 - 1.0)
- `top_p`: Nucleus sampling threshold
- `top_k`: Top-k sampling
- `max_output_tokens`: Maximum response length

---

## Error Handling

```python
from google.api_core import exceptions

try:
    response = model.generate_content("Your prompt")
    print(response.text)
except exceptions.InvalidArgument as e:
    print(f"Invalid argument: {e}")
except exceptions.ResourceExhausted as e:
    print(f"Quota exceeded: {e}")
except Exception as e:
    print(f"Error: {e}")
```

---

## Best Practices

### 1. Prompt Engineering

```python
# Good: Clear and specific
prompt = """
Analyze the following text and provide:
1. Main topics
2. Sentiment analysis
3. Key takeaways

Text: [Your text here]
"""

# Less optimal: Vague
prompt = "Analyze this text"
```

### 2. Response Validation

```python
response = model.generate_content(prompt)

# Check if response was blocked
if response.prompt_feedback.block_reason:
    print("Response blocked:", response.prompt_feedback.block_reason)
else:
    print(response.text)
```

### 3. Cost Optimization

- Use appropriate model for task
- Set reasonable token limits
- Cache common responses
- Batch similar requests

### 4. Security

```python
# Use environment variables
import os
api_key = os.getenv("GEMINI_API_KEY")

# Never do this:
# api_key = "AIzaSy..."  # Hardcoded key
```

---

## Example Use Cases

### Document Summarization

```python
def summarize_document(text):
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""
    Summarize the following document in 3-5 bullet points:
    
    {text}
    """
    
    response = model.generate_content(prompt)
    return response.text
```

### Code Generation

```python
def generate_code(description):
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""
    Generate Python code for the following task:
    {description}
    
    Include comments and error handling.
    """
    
    response = model.generate_content(prompt)
    return response.text
```

### Data Extraction

```python
def extract_data(text):
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""
    Extract structured data from the following text.
    Return as JSON format.
    
    Text: {text}
    """
    
    response = model.generate_content(prompt)
    return response.text
```

---

## Monitoring and Logging

```python
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def call_gemini(prompt):
    start_time = datetime.now()
    
    try:
        logger.info(f"Calling Gemini with prompt: {prompt[:50]}...")
        response = model.generate_content(prompt)
        
        duration = (datetime.now() - start_time).total_seconds()
        logger.info(f"Response received in {duration}s")
        
        return response.text
    except Exception as e:
        logger.error(f"Gemini error: {e}")
        raise
```

---

## Configuration Examples

### Production Config

```env
GEMINI_API_KEY=AIzaSy_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GEMINI_MODEL=gemini-pro
GEMINI_MAX_TOKENS=2048
GEMINI_TEMPERATURE=0.7
```

### Development Config

```env
GEMINI_API_KEY=AIzaSy_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
GEMINI_MODEL=gemini-pro
GEMINI_MAX_TOKENS=1024
GEMINI_TEMPERATURE=0.9
```

---

## Rate Limits

Free tier limits (as of current version):
- 60 requests per minute
- Adjust based on your quota

Implement rate limiting:

```python
import time
from functools import wraps

def rate_limit(max_per_minute):
    min_interval = 60.0 / max_per_minute
    last_called = [0.0]
    
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            elapsed = time.time() - last_called[0]
            wait_time = min_interval - elapsed
            
            if wait_time > 0:
                time.sleep(wait_time)
            
            last_called[0] = time.time()
            return func(*args, **kwargs)
        return wrapper
    return decorator

@rate_limit(60)
def call_gemini_api(prompt):
    return model.generate_content(prompt)
```

---

## Resources

- [Google AI Studio](https://makersuite.google.com)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [API Reference](https://ai.google.dev/api)
- [Pricing Information](https://ai.google.dev/pricing)

---

## Notes

- **API Key Security**: Never commit API keys to version control
- **Free Tier**: Gemini offers generous free tier for development
- **Model Updates**: Google regularly updates and improves models
- **Multimodal**: Gemini Pro Vision supports both text and images
- **Safety Filters**: Built-in content safety features
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
