# MindMock

AI-powered mock interview platform with voice-to-voice interviews and ATS resume analysis. Practice real interviews, get instant feedback, and land your dream job.

## Features

### Resume Analysis
- **ATS Resume Scoring** - Industry-standard ATS algorithms to score and optimize your resume
- **AI Role Detector** - Automatically detects your target role from resume content
- **Skill Gap Analysis** - Identifies missing skills compared to job requirements
- **Actionable Suggestions** - Get personalized recommendations to improve your resume

### AI Mock Interviews
- **Voice-to-Voice Interviews** - Practice with realistic AI interviewer using Web Speech API
- **Two Interview Modes:**
  - **Resume-Based** - Questions generated from your resume and job description
  - **Concept-Based** - Focus on specific topics (OS, DBMS, DSA, System Design, etc.)
- **Adaptive Difficulty** - Questions adjust based on your experience level (Junior/Mid/Senior)
- **Interview Types** - Technical, Behavioral, or Mixed interviews

### Detailed Feedback
- **STAR Analysis** - Evaluate answers using Situation, Task, Action, Result framework
- **Confidence Scoring** - AI-analyzed confidence levels in your responses
- **Filler Words Detection** - Track verbal fillers (um, uh, like, etc.)
- **Per-Answer Feedback** - Detailed improvement suggestions for each response

### Dashboard & Analytics
- **Career Readiness Score** - Comprehensive score based on resume + interview performance
- **Performance Charts** - Track your progress over time
- **Skills Radar Chart** - Visualize your strengths across different competencies
- **Recent Activity** - Quick access to interview and resume history

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router with Turbopack)
- **UI Components:** [HeroUI v2](https://heroui.com/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Authentication:** [Firebase Auth](https://firebase.google.com/docs/auth)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **AI/LLM:** [Groq SDK](https://groq.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Charts:** [Recharts](https://recharts.org/)
- **Voice:** Web Speech API (Speech Recognition & Synthesis)

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB instance (local or Atlas)
- Firebase project (for authentication)
- Groq API key

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Groq AI
GROQ_API_KEY=your_groq_api_key
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── dashboard/     # Dashboard stats
│   │   ├── interviews/    # Interview CRUD & AI generation
│   │   ├── resume/        # Resume analysis
│   │   └── users/         # User management
│   ├── dashboard/         # User dashboard
│   ├── interviews/        # Interview pages
│   │   ├── [id]/live/     # Live interview session
│   │   ├── [id]/feedback/ # Interview feedback
│   │   ├── setup/         # Interview configuration
│   │   └── history/       # Past interviews
│   ├── resume-analyzer/   # Resume upload & analysis
│   ├── login/             # Authentication
│   └── signup/
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── icons/             # Icon components
│   └── ui/                # Reusable UI components
├── config/                # Firebase & MongoDB config
├── models/                # Mongoose schemas
├── store/                 # Zustand state stores
├── utils/                 # AI prompts & helpers
└── styles/                # Global styles
```

## Usage

1. **Sign Up/Login** - Create an account using email or Google
2. **Upload Resume** - Go to Resume Analyzer and upload your PDF/DOCX
3. **Review ATS Score** - Get detailed feedback on your resume
4. **Start Interview** - Choose resume-based or concept-based mode
5. **Practice Speaking** - Answer questions using your microphone
6. **Get Feedback** - Review detailed analysis of each answer
7. **Track Progress** - Monitor improvement on your dashboard

## License

Licensed under the [MIT License](LICENSE).
