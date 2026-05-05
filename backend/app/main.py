from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import ai_routes, triage_routes, sarvam_routes

app = FastAPI(
    title="MedField OS API",
    description="AI-assisted rural healthcare workflow platform",
    version="1.0.0",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health Check
@app.get("/")
async def root():
    return {
        "message": "MedField OS API",
        "version": "1.0.0",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENV,
    }


# Include Routers
app.include_router(ai_routes.router, prefix="/api/ai", tags=["AI Services"])
app.include_router(triage_routes.router, prefix="/api/triage", tags=["Triage"])
app.include_router(sarvam_routes.router, prefix="/api/sarvam", tags=["Sarvam"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=settings.DEBUG)
