from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class Vitals(BaseModel):
    temperature: Optional[float] = None
    bpSystolic: Optional[int] = None
    bpDiastolic: Optional[int] = None
    pulse: Optional[int] = None
    spo2: Optional[int] = None
    bloodSugar: Optional[float] = None
    weight: Optional[float] = None


class RunTriageRequest(BaseModel):
    visitId: str
    patientId: str
    workerId: str
    structuredSymptoms: Dict = Field(..., description="Structured symptoms extracted from transcript")
    vitals: Vitals


class TriageResultResponse(BaseModel):
    success: bool
    data: Optional[Dict] = None
    error: Optional[str] = None
