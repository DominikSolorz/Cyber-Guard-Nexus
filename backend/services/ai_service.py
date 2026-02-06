"""
OpenAI GPT-4 integration service
"""
from openai import OpenAI
from config import get_settings
from typing import List, Dict

settings = get_settings()
client = OpenAI(api_key=settings.openai_api_key)


async def chat_with_ai(messages: List[Dict[str, str]], model: str = "gpt-4") -> str:
    """
    Send messages to OpenAI and get response
    
    Args:
        messages: List of message dicts with 'role' and 'content'
        model: Model to use (default: gpt-4)
    
    Returns:
        AI response text
    """
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.7,
            max_tokens=2000
        )
        
        return response.choices[0].message.content
    
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")


async def generate_chat_title(first_message: str) -> str:
    """Generate a short title for chat based on first message"""
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Generate a short 3-5 word title for this conversation. Return only the title, nothing else."},
                {"role": "user", "content": first_message}
            ],
            temperature=0.7,
            max_tokens=20
        )
        
        return response.choices[0].message.content.strip()
    
    except Exception:
        return "New Chat"
