# OpenAI Integration Guide

Source: Legal-Buddy-AI (adapted, secrets replaced with placeholders)

## Overview

This guide covers integration with OpenAI's API for AI-powered features.

---

## Setup

### 1. API Key Configuration

```bash
# Environment variable
export OPENAI_API_KEY="YOUR_API_KEY_HERE"
```

Or in `.env` file:
```env
OPENAI_API_KEY=YOUR_API_KEY_HERE
OPENAI_ORG_ID=YOUR_ORG_ID_HERE  # Optional
```

### 2. Installation

```bash
# Python
pip install openai

# Node.js
npm install openai

# Or using yarn
yarn add openai
```

---

## Basic Usage

### Python Example

```python
import os
from openai import OpenAI

# Initialize client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Chat completion
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello, how are you?"}
    ],
    temperature=0.7,
    max_tokens=150
)

print(response.choices[0].message.content)
```

### Node.js Example

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello, how are you?' }
    ],
    temperature: 0.7,
    max_tokens: 150
  });

  console.log(completion.choices[0].message.content);
}

main();
```

---

## Common Models

| Model | Description | Best For |
|-------|-------------|----------|
| `gpt-4` | Most capable | Complex tasks, reasoning |
| `gpt-4-turbo` | Faster, cost-effective | General use, high volume |
| `gpt-3.5-turbo` | Fast and efficient | Simple tasks, chat |
| `text-embedding-ada-002` | Embeddings | Semantic search, clustering |

---

## Advanced Features

### Streaming Responses

```python
stream = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Tell me a story"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

### Function Calling

```python
functions = [
    {
        "name": "get_weather",
        "description": "Get current weather for a location",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "City name"
                }
            },
            "required": ["location"]
        }
    }
]

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "What's the weather in Paris?"}],
    functions=functions
)
```

### Image Generation (DALL-E)

```python
response = client.images.generate(
    model="dall-e-3",
    prompt="A futuristic city at sunset",
    size="1024x1024",
    quality="standard",
    n=1
)

image_url = response.data[0].url
```

---

## Best Practices

### 1. Error Handling

```python
from openai import OpenAIError

try:
    response = client.chat.completions.create(...)
except OpenAIError as e:
    print(f"Error: {e}")
```

### 2. Rate Limiting

- Implement exponential backoff
- Monitor rate limit headers
- Use batch processing when possible

### 3. Cost Optimization

- Choose appropriate model for task
- Set reasonable `max_tokens` limits
- Cache responses when applicable
- Use prompt compression techniques

### 4. Security

- Never hardcode API keys
- Use environment variables
- Implement API key rotation
- Monitor usage and set spending limits

---

## Token Management

```python
import tiktoken

def count_tokens(text, model="gpt-4"):
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))

# Example
prompt = "Hello, how are you?"
token_count = count_tokens(prompt)
print(f"Token count: {token_count}")
```

---

## Configuration Examples

### Production Config

```env
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
OPENAI_MODEL=gpt-4-turbo
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7
OPENAI_TIMEOUT=30
```

### Development Config

```env
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.5
OPENAI_TIMEOUT=60
```

---

## Monitoring and Logging

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def call_openai(prompt):
    logger.info(f"Calling OpenAI with prompt: {prompt[:50]}...")
    try:
        response = client.chat.completions.create(...)
        logger.info(f"Response received: {response.id}")
        return response
    except Exception as e:
        logger.error(f"OpenAI error: {e}")
        raise
```

---

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Pricing Information](https://openai.com/pricing)
- [API Status](https://status.openai.com)
- [Community Forum](https://community.openai.com)

---

## Notes

- **API Key Security**: Never commit API keys to version control
- **Cost Monitoring**: Set up billing alerts in OpenAI dashboard
- **Model Selection**: Test different models to balance cost and performance
- **Prompt Engineering**: Invest time in optimizing prompts for better results
- **Regular Updates**: OpenAI frequently updates models and features
