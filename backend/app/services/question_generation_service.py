import json
from app.services.azure_openai_service import call_gpt5_chat_with_json
from app.prompts.question_generation import QUESTION_GENERATION_SYSTEM_PROMPT


def generate_followup_questions(structured_symptoms: dict):
    """
    Generate adaptive follow-up questions based on symptoms
    
    Args:
        structured_symptoms: Structured symptom data
    
    Returns:
        list of follow-up questions
    """
    user_prompt = f"""
Structured symptoms:
{json.dumps(structured_symptoms, indent=2)}

Generate 5 to 7 short, simple follow-up questions.
Questions must be suitable for a non-doctor health worker to ask.
Return JSON array only.

Example format:
["Question 1?", "Question 2?", "Question 3?"]
"""

    try:
        response_text = call_gpt5_chat_with_json(
            QUESTION_GENERATION_SYSTEM_PROMPT,
            user_prompt
        )
        
        result = json.loads(response_text)
        
        # Handle both {"questions": [...]} and direct array
        if isinstance(result, dict) and "questions" in result:
            return result["questions"]
        elif isinstance(result, list):
            return result
        else:
            raise Exception("Unexpected response format")

    except json.JSONDecodeError as e:
        raise Exception(f"Failed to parse questions response: {str(e)}")
    except Exception as e:
        raise Exception(f"Question generation failed: {str(e)}")
