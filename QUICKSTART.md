# MedField OS - Quick Start Guide

## Prerequisites

- Node.js 18+ 
- Python 3.10+
- Git

## Step 1: Clone and Setup

```bash
# Navigate to project
cd project

# Setup Frontend
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your Firebase credentials

# Setup Backend
cd ../backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
```

## Step 2: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Get your config from Project Settings
6. Add config to `frontend/.env.local`

### Set Custom Claims (for roles)

In Firebase Console > Authentication > Users, set custom claims:

```javascript
{
  "role": "worker"  // or "doctor" or "patient"
}
```

Or use Firebase Admin SDK in backend.

## Step 3: API Keys

### Azure OpenAI
1. Go to Azure Portal
2. Create OpenAI resource
3. Deploy GPT-5-chat model
4. Copy key and endpoint
5. Add to `backend/.env`

### Sarvam AI
1. Sign up at Sarvam AI
2. Get API key
3. Add to `backend/.env`

## Step 4: Run Development Servers

### Terminal 1 - Frontend
```bash
cd project/frontend
npm run dev
```
Access: http://localhost:3000

### Terminal 2 - Backend
```bash
cd project/backend
# Activate venv first
uvicorn app.main:app --reload
```
Access: http://localhost:8000

API Docs: http://localhost:8000/docs

## Step 5: Test the Application

1. Open http://localhost:3000
2. Click on "Field Worker"
3. You'll see the worker dashboard

## Project Structure

```
project/
├── frontend/          # Next.js app on port 3000
├── backend/           # FastAPI app on port 8000
├── README.md
└── PROJECT_STATUS.md  # Current progress
```

## Common Issues

### Frontend won't start
- Check Node version: `node --version` (need 18+)
- Delete `node_modules` and run `npm install` again
- Check `.env.local` file exists

### Backend won't start
- Check Python version: `python --version` (need 3.10+)
- Activate virtual environment first
- Check `.env` file exists
- Install dependencies: `pip install -r requirements.txt`

### Firebase errors
- Check Firebase credentials in `.env.local`
- Enable Authentication in Firebase Console
- Enable Firestore in Firebase Console

### API errors
- Check backend is running on port 8000
- Check CORS settings in `backend/app/main.py`
- Check API keys in `backend/.env`

## Next Steps

1. **Create Test User:**
   - Use Firebase Console to create a test user
   - Set custom claim: `{"role": "worker"}`

2. **Test API Endpoints:**
   - Go to http://localhost:8000/docs
   - Try the `/health` endpoint

3. **Start Building Features:**
   - Implement Worker New Visit flow
   - Connect frontend to backend APIs
   - Test voice recording

## Environment Variables Summary

### Frontend (.env.local)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```env
AZURE_OPENAI_KEY=
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-5-chat
AZURE_OPENAI_API_VERSION=2024-12-01-preview

SARVAM_API_KEY=
SARVAM_STT_MODEL=saaras:v3
SARVAM_TTS_MODEL=bulbul:v2

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

ENV=development
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000
```

## Support

Check `PROJECT_STATUS.md` for current progress and pending features.

---

**Happy Coding!** 🚀
