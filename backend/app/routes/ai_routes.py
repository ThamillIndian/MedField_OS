from fastapi import APIRouter, HTTPException, UploadFile, File
from app.schemas.ai_schema import (
    ExtractSymptomsRequest,
    ExtractSymptomsResponse,
    GenerateQuestionsRequest,
    GenerateQuestionsResponse,
)
from app.services.sarvam_service import transcribe_audio
from app.services.symptom_extraction_service import extract_symptoms_from_transcript
from app.services.question_generation_service import generate_followup_questions

router = APIRouter()


@router.post("/transcribe")
async def transcribe_audio_endpoint(file: UploadFile = File(...)):
    """
    Transcribe audio file using Sarvam AI
    
    Upload audio file and get transcript + detected language
    """
    try:
        # Read file content
        audio_bytes = await file.read()
        
        # Transcribe using Sarvam
        result = transcribe_audio(audio_bytes, file.filename or "audio.wav")
        
        return {
            "success": True,
            "data": result,
            "message": "Audio transcribed successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract-symptoms", response_model=ExtractSymptomsResponse)
async def extract_symptoms(request: ExtractSymptomsRequest):
    """
    Extract structured symptoms from transcript using GPT-5
    
    Converts raw text into structured medical data
    """
    try:
        result = extract_symptoms_from_transcript(request.transcript)
        
        return {
            "success": True,
            "data": result,
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-questions", response_model=GenerateQuestionsResponse)
async def generate_questions(request: GenerateQuestionsRequest):
    """
    Generate adaptive follow-up questions based on symptoms
    
    Uses GPT-5 to create contextual questions
    """
    try:
        questions = generate_followup_questions(request.structuredSymptoms)
        
        return {
            "success": True,
            "data": {"questions": questions},
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-doctor-summary")
async def generate_doctor_summary(request: dict):
    """
    Generate doctor-ready referral summary
    
    Creates structured handoff summary for doctors
    """
    try:
        # TODO: Implement doctor summary generation
        return {
            "success": True,
            "data": {"summary": "Doctor summary generation - coming soon"},
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-patient-advice")
async def generate_patient_advice(request: dict):
    """
    Generate patient-friendly care instructions
    
    Creates simple language advice for patients
    """
    try:
        # TODO: Implement patient advice generation
        return {
            "success": True,
            "data": {"advice": "Patient advice generation - coming soon"},
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
