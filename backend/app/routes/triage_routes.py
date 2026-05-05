from fastapi import APIRouter, HTTPException
from app.schemas.triage_schema import RunTriageRequest, TriageResultResponse
from app.services.triage_service import run_triage

router = APIRouter()


@router.post("/run", response_model=TriageResultResponse)
async def run_triage_endpoint(request: RunTriageRequest):
    """
    Run triage engine on patient symptoms and vitals
    
    Returns risk level (green/amber/red), possible conditions, 
    reasons, and next steps
    """
    try:
        # Convert Pydantic model to dict
        vitals_dict = request.vitals.model_dump(exclude_none=True)
        
        # Run triage
        triage_result = run_triage(
            structured_symptoms=request.structuredSymptoms,
            vitals=vitals_dict,
        )
        
        # Add visit/patient IDs
        triage_result["visitId"] = request.visitId
        triage_result["patientId"] = request.patientId
        triage_result["workerId"] = request.workerId
        
        return {
            "success": True,
            "data": triage_result,
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{triage_id}")
async def get_triage_result(triage_id: str):
    """
    Get triage result by ID
    
    Retrieves stored triage result from database
    """
    try:
        # TODO: Implement Firestore retrieval
        return {
            "success": True,
            "data": {"message": "Triage retrieval - coming soon"},
        }
    
    except Exception as e:
        raise HTTPException(status_code=404, detail="Triage result not found")
