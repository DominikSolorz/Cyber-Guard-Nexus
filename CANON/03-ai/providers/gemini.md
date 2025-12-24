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
