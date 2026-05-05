from fastapi import APIRouter, HTTPException, UploadFile, File
from app.services.sarvam_service import transcribe_audio, text_to_speech

router = APIRouter()


@router.post("/transcribe")
async def sarvam_transcribe(file: UploadFile = File(...)):
    """
    Direct Sarvam AI transcription endpoint
    
    Alternative to /api/ai/transcribe
    """
    try:
        audio_bytes = await file.read()
        result = transcribe_audio(audio_bytes, file.filename or "audio.wav")
        
        return {
            "success": True,
            "data": result,
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/text-to-speech")
async def sarvam_tts(text: str, language_code: str = "hi-IN"):
    """
    Convert text to speech using Sarvam AI
    
    Returns audio bytes
    """
    try:
        audio_bytes = text_to_speech(text, language_code)
        
        return {
            "success": True,
            "message": "TTS generated",
            "data": {
                "audio_size": len(audio_bytes),
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
