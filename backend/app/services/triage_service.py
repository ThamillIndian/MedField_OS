from app.engines.fever_triage import FeverTriageEngine
from app.services.azure_openai_service import call_gpt5_chat


def run_triage(structured_symptoms: dict, vitals: dict, complaint_type: str = "fever") -> dict:
    """
    Run rule-based triage and generate LLM explanation
    
    Args:
        structured_symptoms: Structured symptom dict
        vitals: Vitals dict
        complaint_type: Type of complaint (fever, maternal, chronic)
    
    Returns:
        Complete triage result with LLM explanation
    """
    
    # Select appropriate engine based on complaint
    # For MVP, we'll use Fever engine by default
    engine = FeverTriageEngine()
    
    # Run rule-based triage
    triage_result = engine.evaluate(structured_symptoms, vitals)
    
    # Generate LLM explanation
    try:
        llm_explanation = generate_triage_explanation(
            structured_symptoms,
            vitals,
            triage_result
        )
        triage_result["llmExplanation"] = llm_explanation
    except Exception as e:
        triage_result["llmExplanation"] = "Triage completed. Unable to generate detailed explanation."
    
    return triage_result


def generate_triage_explanation(symptoms: dict, vitals: dict, triage_result: dict) -> str:
    """
    Generate patient-friendly explanation of triage result using LLM
    """
    system_prompt = """You are a medical assistant explaining triage results to healthcare workers.
    
Generate a brief, clear explanation of why the patient received this risk level.
Focus on the key concerning symptoms and what they mean.
Use simple language suitable for frontline health workers.
Keep it 2-3 sentences."""

    user_prompt = f"""
Patient Symptoms: {symptoms}
Vitals: {vitals}
Risk Level: {triage_result['riskLevel']}
Reasons: {', '.join(triage_result['reasons'])}

Explain why this patient received this risk assessment.
"""

    try:
        explanation = call_gpt5_chat(system_prompt, user_prompt, temperature=0.5)
        return explanation
    except Exception as e:
        return "Patient assessment completed based on symptoms and vitals."


def determine_complaint_type(symptoms: dict) -> str:
    """
    Determine which triage engine to use based on symptoms
    
    For MVP: defaults to fever
    Future: maternal, chronic, etc.
    """
    # Check for fever-related symptoms
    if symptoms.get("fever") or symptoms.get("temperature"):
        return "fever"
    
    # Check for maternal symptoms
    if symptoms.get("pregnant") or symptoms.get("pregnancy"):
        return "maternal"
    
    # Check for chronic disease follow-up
    if symptoms.get("diabetes") or symptoms.get("hypertension"):
        return "chronic"
    
    # Default to fever
    return "fever"
