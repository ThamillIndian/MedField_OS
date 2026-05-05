import os
from openai import AzureOpenAI
from app.config import settings

# Initialize Azure OpenAI client
client = AzureOpenAI(
    api_key=settings.AZURE_OPENAI_KEY,
    api_version=settings.AZURE_OPENAI_API_VERSION,
    azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
)

DEPLOYMENT_NAME = settings.AZURE_OPENAI_DEPLOYMENT_NAME


def call_gpt5_chat(system_prompt: str, user_prompt: str, temperature: float = 0.7):
    """
    Call Azure OpenAI GPT-5-chat deployment
    
    Args:
        system_prompt: System instruction for the model
        user_prompt: User's prompt/question
        temperature: Response creativity (0.0-1.0)
    
    Returns:
        Response text from the model
    """
    try:
        response = client.chat.completions.create(
            model=DEPLOYMENT_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=temperature,
        )

        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Azure OpenAI Error: {str(e)}")


def call_gpt5_chat_with_json(system_prompt: str, user_prompt: str):
    """
    Call Azure OpenAI with JSON response format
    
    Args:
        system_prompt: System instruction for the model
        user_prompt: User's prompt/question
    
    Returns:
        Response text (should be valid JSON)
    """
    try:
        response = client.chat.completions.create(
            model=DEPLOYMENT_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,  # Lower temperature for structured output
            response_format={"type": "json_object"},
        )

        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"Azure OpenAI Error: {str(e)}")
