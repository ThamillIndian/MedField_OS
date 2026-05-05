import requests
from app.config import settings

SARVAM_API_KEY = settings.SARVAM_API_KEY
SARVAM_STT_ENDPOINT = "https://api.sarvam.ai/speech-to-text"
SARVAM_TTS_ENDPOINT = "https://api.sarvam.ai/text-to-speech"


def transcribe_audio(audio_bytes: bytes, filename: str):
    """
    Transcribe audio using Sarvam AI STT
    
    Args:
        audio_bytes: Audio file bytes
        filename: Original filename
    
    Returns:
        dict with transcript and language_detected
    """
    try:
        headers = {
            "api-subscription-key": SARVAM_API_KEY,
        }

        files = {
            "file": (filename, audio_bytes, "audio/wav"),
        }

        data = {
            "model": settings.SARVAM_STT_MODEL
        }

        response = requests.post(
            SARVAM_STT_ENDPOINT,
            headers=headers,
            files=files,
            data=data,
            timeout=30
        )
        
        response.raise_for_status()
        result = response.json()

        return {
            "transcript": result.get("transcript", ""),
            "language_detected": result.get("language_code", "en-IN"),
        }

    except requests.exceptions.RequestException as e:
        raise Exception(f"Sarvam STT Error: {str(e)}")
    except Exception as e:
        raise Exception(f"Transcription Error: {str(e)}")


def text_to_speech(text: str, language_code: str = "hi-IN"):
    """
    Convert text to speech using Sarvam AI TTS
    
    Args:
        text: Text to convert
        language_code: Language code (e.g., 'hi-IN', 'ta-IN')
    
    Returns:
        Audio bytes
    """
    try:
        headers = {
            "api-subscription-key": SARVAM_API_KEY,
            "Content-Type": "application/json",
        }

        data = {
            "model": settings.SARVAM_TTS_MODEL,
            "text": text,
            "language_code": language_code,
        }

        response = requests.post(
            SARVAM_TTS_ENDPOINT,
            headers=headers,
            json=data,
            timeout=30
        )
        
        response.raise_for_status()

        return response.content

    except requests.exceptions.RequestException as e:
        raise Exception(f"Sarvam TTS Error: {str(e)}")
    except Exception as e:
        raise Exception(f"Text-to-Speech Error: {str(e)}")
