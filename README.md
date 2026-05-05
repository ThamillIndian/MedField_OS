# MedField OS

**AI-Assisted Rural Healthcare Workflow Platform**

MedField OS is a role-based healthcare platform that helps frontline health workers collect patient cases, run AI-assisted triage, monitor follow-ups, and connect risky cases to doctors before conditions become critical.

## 🎯 Target Users

- **Field Workers**: ASHA workers, nurses, rural health volunteers
- **Doctors**: Review and validate AI triage, provide prescriptions
- **Patients**: Receive reports, reminders, and care instructions

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Auth**: Firebase Authentication
- **Database**: Cloud Firestore (realtime)
- **Deployment**: Vercel

### Backend
- **Framework**: FastAPI (Python)
- **AI Voice**: Sarvam AI (Indian language speech-to-text)
- **AI Reasoning**: Azure OpenAI GPT-5-chat
- **Triage**: Rule-based Python engine
- **Deployment**: Railway / Render

## 📁 Project Structure

```
project/
├── frontend/          # Next.js application
└── backend/           # FastAPI application
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- Python 3.10+
- Firebase project
- Azure OpenAI API key
- Sarvam AI API key

### Frontend Setup

```bash
cd frontend
npm install
# Add .env.local with Firebase credentials
npm run dev
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
# Add .env with API keys
uvicorn app.main:app --reload
```

## 🌟 Key Features

- 🎤 Voice-based patient intake in Indian languages
- 🤖 AI-powered symptom extraction
- 🏥 Rule-based medical triage (Green/Amber/Red)
- 👨‍⚕️ Doctor referral workflow
- 📊 Real-time patient monitoring
- 📱 Mobile-first PWA design

## 🔒 Security

- Role-based access control (Worker/Doctor/Patient)
- Firebase Security Rules
- HIPAA-compliant data handling
- Medical disclaimer included

## 📝 Medical Disclaimer

MedField OS provides decision support for frontline health workers. It does not replace a licensed doctor. Urgent symptoms must be referred to qualified medical professionals.

## 🚀 Development Phases

- [x] Phase 1: Foundation & Setup
- [ ] Phase 2: Field Worker Flow
- [ ] Phase 3: Doctor Flow
- [ ] Phase 4: Patient Flow
- [ ] Phase 5: Demo & Polish

## 📄 License

Built for rural healthcare in India 🇮🇳
