# MedField OS Backend

FastAPI backend for MedField OS - AI-assisted rural healthcare platform.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Run the development server:
```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

### AI Services
- `POST /api/ai/transcribe` - Transcribe audio to text
- `POST /api/ai/extract-symptoms` - Extract structured symptoms
- `POST /api/ai/generate-questions` - Generate follow-up questions
- `POST /api/ai/generate-doctor-summary` - Generate doctor summary
- `POST /api/ai/generate-patient-advice` - Generate patient advice

### Triage
- `POST /api/triage/run` - Run triage engine
- `GET /api/triage/{triageId}` - Get triage result

### Monitoring
- `POST /api/monitoring/evaluate` - Evaluate monitoring alerts
- `GET /api/monitoring/worker/{workerId}` - Get worker monitoring data

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration settings
│   ├── routes/                 # API route handlers
│   ├── services/               # Business logic services
│   ├── engines/                # Triage rule engines
│   ├── schemas/                # Pydantic schemas
│   ├── utils/                  # Utility functions
│   └── prompts/                # LLM prompt templates
└── tests/                      # Test files
```

## Medical Triage Flows

1. **Fever Triage** - Acute febrile illness screening
2. **Maternal Risk** - Pregnancy complication detection
3. **Chronic Follow-up** - Diabetes and hypertension monitoring
