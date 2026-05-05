import json
from app.services.azure_openai_service import call_gpt5_chat_with_json
from app.prompts.symptom_extraction import SYMPTOM_EXTRACTION_SYSTEM_PROMPT


def extract_symptoms_from_transcript(transcript: str):
    """
    Extract structured symptoms from raw transcript using GPT-5
    
    Args:
        transcript: Raw patient complaint transcript
    
    Returns:
        dict with structured symptom data
    """
    user_prompt = f"""
Transcript: {transcript}

Return JSON with:
- chief_complaint (string)
- symptoms (object with boolean/number/string values)
- duration (string, e.g. "3 days")
- severity (string: "mild", "moderate", "severe")
- red_flags_mentioned (array of strings)
- missing_information (array of strings)
- language_detected (string, e.g. "ta-IN", "hi-IN")
"""

    try:
        response_text = call_gpt5_chat_with_json(
            SYMPTOM_EXTRACTION_SYSTEM_PROMPT,
            user_prompt
        )
        
        result = json.loads(response_text)
        return result

    except json.JSONDecodeError as e:
        raise Exception(f"Failed to parse symptom extraction response: {str(e)}")
    except Exception as e:
        raise Exception(f"Symptom extraction failed: {str(e)}")
