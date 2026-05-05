from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class TranscribeRequest(BaseModel):
    """Request for audio transcription"""
    pass  # File will be handled via UploadFile


class TranscribeResponse(BaseModel):
    success: bool
    data: Optional[Dict] = None
    error: Optional[str] = None
    message: Optional[str] = None


class ExtractSymptomsRequest(BaseModel):
    transcript: str = Field(..., description="Raw transcript from voice input")


class ExtractSymptomsResponse(BaseModel):
    success: bool
    data: Optional[Dict] = None
    error: Optional[str] = None


class GenerateQuestionsRequest(BaseModel):
    structuredSymptoms: Dict = Field(..., description="Structured symptom data")


class GenerateQuestionsResponse(BaseModel):
    success: bool
    data: Optional[Dict] = None
    error: Optional[str] = None
