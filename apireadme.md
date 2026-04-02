# MindMock API Documentation

> **Base URL:** `http://mindmock.vercel.app/api`  
> **Authentication:** All protected routes require the `firebaseUid` header.  
> **Content-Type:** `application/json` (unless stated otherwise)

---

## Table of Contents

| # | Endpoint | Method | Description |
|---|----------|--------|-------------|
| 1 | [`/api/users`](#1-post-apiusers) | POST | Create or fetch a user |
| 2 | [`/api/dashboard`](#2-get-apidashboard) | GET | Get dashboard analytics data |
| 3 | [`/api/interviews/list`](#3-get-apiinterviewslist) | GET | List all interviews for a user |
| 4 | [`/api/interviews/create`](#4-post-apiinterviewscreate) | POST | Create a new interview session |
| 5 | [`/api/interviews/[id]`](#5-get-apiinterviewsid) | GET | Get a single interview by ID |
| 6 | [`/api/interviews/generate-question`](#6-post-apiinterviewsgenerate-question) | POST | Generate AI interview question |
| 7 | [`/api/interviews/evaluate-answer`](#7-post-apiinterviewsevaluate-answer) | POST | Evaluate a candidate's answer |
| 8 | [`/api/interviews/update-transcript`](#8-post-apiinterviewsupdate-transcript) | POST | Update live interview transcript |
| 9 | [`/api/interviews/end`](#9-post-apiinterviewsend) | POST | End interview & compute final score |
| 10 | [`/api/resume/analyze`](#10-post-apiresumesanalyze) | POST | Upload & analyze a resume (ATS) |
| 11 | [`/api/resume/list`](#11-get-apiresumelists) | GET | List all resumes for a user |
| 12 | [`/api/resume/[id]`](#12-get-apiresumeid) | GET | Get a single resume by ID |

---

## Common Headers

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `firebaseUid` | `string` | Conditional | Firebase UID of the authenticated user. Required on all GET endpoints. |
| `Content-Type` | `string` | For POST/PUT | `application/json` or `multipart/form-data` (for file uploads) |

---

## Common Error Responses

| Status Code | Meaning |
|-------------|---------|
| `400` | Bad Request – missing or invalid fields |
| `401` | Unauthorized – missing `firebaseUid` header |
| `404` | Not Found – user, interview, or resume not found |
| `500` | Internal Server Error |

---

## Endpoints

---

### 1. POST `/api/users`

**Description:** Creates a new user if they don't exist, or returns the existing user object. Called after Firebase authentication to sync user to MongoDB.

#### Request

**Headers:**

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |

**Body:**

```json
{
  "firebaseUid": "abc123xyz",
  "email": "user@example.com",
  "name": "John Doe",
  "provider": "google"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firebaseUid` | `string` | ✅ Yes | Unique Firebase user ID |
| `email` | `string` | ✅ Yes | User's email address |
| `name` | `string` | ✅ Yes | User's display name |
| `provider` | `string` | ✅ Yes | Auth provider (`google`, `email`) |

#### Responses

**`200 OK` – User found or created:**

```json
{
  "_id": "64abc...",
  "firebaseUid": "abc123xyz",
  "email": "user@example.com",
  "name": "John Doe",
  "provider": "google",
  "totalInterviews": 0,
  "avgScore": 0,
  "bestScore": 0,
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

**`500 Internal Server Error`:**

```json
{
  "error": "User creation failed"
}
```

---

### 2. GET `/api/dashboard`

**Description:** Returns aggregated analytics data for the authenticated user's dashboard — stats, performance trends, skill radar, filler word analysis, and comparisons against peers.

#### Request

**Headers:**

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `firebaseUid` | `string` | ✅ Yes | Firebase UID of the authenticated user |

#### Responses

**`200 OK` – Dashboard data:**

```json
{
  "totalInterviews": 5,
  "avgScore": 74,
  "bestScore": 92,
  "improvementRate": 15,
  "avgAtsScore": 68,
  "totalResumes": 3,
  "trendData": [
    { "name": "I1", "score": 60 },
    { "name": "I2", "score": 75 },
    { "name": "I3", "score": 92 }
  ],
  "radarData": [
    { "skill": "Relevance", "score": 80 },
    { "skill": "Confidence", "score": 70 },
    { "skill": "STAR", "score": 65 }
  ],
  "fillerData": [
    { "name": "um", "value": 12, "color": "#8b5cf6" },
    { "name": "like", "value": 8, "color": "#ec4899" }
  ],
  "comparisonData": [
    { "skill": "Relevance", "you": 80, "average": 72 },
    { "skill": "Confidence", "you": 70, "average": 68 },
    { "skill": "STAR Method", "you": 65, "average": 60 }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `totalInterviews` | `number` | Total completed interviews |
| `avgScore` | `number` | Average overall score (0–100) |
| `bestScore` | `number` | Highest achieved score (0–100) |
| `improvementRate` | `number` | % improvement from first to last interview |
| `avgAtsScore` | `number` | Average ATS score across all resumes |
| `totalResumes` | `number` | Total resumes analyzed |
| `trendData` | `array` | Score over each interview session |
| `radarData` | `array` | Skill scores: Relevance, Confidence, STAR |
| `fillerData` | `array` | Top filler words with frequency and color |
| `comparisonData` | `array` | User vs peer average skill comparison |

**`401 Unauthorized` – Missing `firebaseUid`:**

```json
{
  "totalInterviews": 0,
  "avgScore": 0,
  "trendData": [],
  "radarData": [],
  "fillerData": [],
  "comparisonData": []
}
```

**`500 Internal Server Error`:**

```json
{
  "totalInterviews": 0,
  "error": "Failed to fetch dashboard data"
}
```

---

### 3. GET `/api/interviews/list`

**Description:** Returns all interviews for the authenticated user, sorted by newest first.

#### Request

**Headers:**

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `firebaseUid` | `string` | ✅ Yes | Firebase UID of the authenticated user |

#### Responses

**`200 OK`:**

```json
{
  "interviews": [
    {
      "_id": "64abc...",
      "createdAt": "2025-03-10T10:00:00.000Z",
      "status": "completed",
      "targetRole": "Frontend Developer",
      "overallScore": 82,
      "interviewType": "behavioral",
      "difficulty": "mid"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `string` | MongoDB ObjectId of the interview |
| `createdAt` | `ISO date` | Timestamp of interview creation |
| `status` | `string` | `created`, `in-progress`, or `completed` |
| `targetRole` | `string` | Target job role |
| `overallScore` | `number \| null` | Score (0–100), `null` if not yet evaluated |
| `interviewType` | `string` | `behavioral`, `technical`, or `mixed` |
| `difficulty` | `string` | `junior`, `mid`, `senior`, or `stress` |

**`401 Unauthorized`:**

```json
{ "interviews": [] }
```

**`500 Internal Server Error`:**

```json
{ "interviews": [], "error": "Failed to fetch interviews" }
```

---

### 4. POST `/api/interviews/create`

**Description:** Creates a new interview session. Supports two modes: **resume-based** (uses an uploaded resume + job description) and **concept-based** (uses selected technology concepts).

#### Request

**Headers:**

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |

**Body:**

```json
{
  "firebaseUid": "abc123xyz",
  "interviewMode": "resume-based",
  "resumeId": "64xyz...",
  "jobDescription": "We are looking for a React developer...",
  "interviewType": "behavioral",
  "difficulty": "mid",
  "targetRole": "Frontend Developer",
  "voiceType": "professional-female",
  "cameraEnabled": false
}
```

**For concept-based mode:**

```json
{
  "firebaseUid": "abc123xyz",
  "interviewMode": "concept-based",
  "selectedConcepts": ["React", "TypeScript", "Node.js"],
  "conceptFocus": "deep-dive",
  "targetRole": "Full Stack Developer",
  "interviewType": "technical",
  "difficulty": "senior",
  "voiceType": "professional-male",
  "cameraEnabled": true
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `firebaseUid` | `string` | ✅ Yes | Firebase UID |
| `interviewMode` | `string` | ✅ Yes | `resume-based` or `concept-based` |
| `resumeId` | `string` | Resume-based only | MongoDB ObjectId of the uploaded resume |
| `jobDescription` | `string` | Resume-based only | Target job description text |
| `selectedConcepts` | `string[]` | Concept-based only | List of technology concepts |
| `conceptFocus` | `string` | Concept-based only | Focus style (e.g., `deep-dive`) |
| `targetRole` | `string` | ❌ Optional | Target job role (defaults to `Software Engineer`) |
| `interviewType` | `string` | ❌ Optional | `behavioral`, `technical`, or `mixed` |
| `difficulty` | `string` | ❌ Optional | `junior`, `mid`, `senior`, `stress` |
| `voiceType` | `string` | ❌ Optional | `professional-female` (default) or `professional-male` |
| `cameraEnabled` | `boolean` | ❌ Optional | `false` by default |

#### Responses

**`200 OK` – Interview created:**

```json
{
  "_id": "64abc...",
  "userId": "64usr...",
  "interviewMode": "resume-based",
  "resumeId": "64xyz...",
  "jobDescription": "We are looking for a React developer...",
  "interviewType": "behavioral",
  "difficulty": "mid",
  "voiceType": "professional-female",
  "cameraEnabled": false,
  "answers": [],
  "status": "created",
  "createdAt": "2025-03-10T10:00:00.000Z"
}
```

**`400 Bad Request`:**

```json
{ "error": "Missing user ID" }
{ "error": "Resume and job description required for resume-based interview" }
{ "error": "Please select at least one concept for concept-based interview" }
```

**`404 Not Found`:**

```json
{ "error": "User not found" }
```

**`500 Internal Server Error`:**

```json
{ "error": "Interview creation failed" }
```

---

### 5. GET `/api/interviews/[id]`

**Description:** Fetches a single complete interview record by its MongoDB ID, including all answers, scores, and transcript.

#### Request

**URL Params:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ Yes | MongoDB ObjectId of the interview |

**Headers:** None required (public fetch by ID).

#### Responses

**`200 OK`:**

```json
{
  "_id": "64abc...",
  "userId": "64usr...",
  "interviewMode": "resume-based",
  "resumeId": "64xyz...",
  "jobDescription": "...",
  "interviewType": "behavioral",
  "difficulty": "mid",
  "status": "completed",
  "overallScore": 82,
  "transcript": "Q: Tell me about yourself...\nA: I am a developer...",
  "answers": [
    {
      "question": "Tell me about yourself",
      "answer": "I am a developer with 3 years...",
      "relevanceScore": 8,
      "confidenceScore": 7,
      "starScore": 6,
      "fillerWords": ["um", "like"],
      "feedback": "Good answer. STAR: Situation was clear."
    }
  ],
  "createdAt": "2025-03-10T10:00:00.000Z"
}
```

**`404 Not Found`:**

```json
{ "error": "Interview not found" }
```

**`500 Internal Server Error`:**

```json
{ "error": "Failed to fetch interview" }
```

---

### 6. POST `/api/interviews/generate-question`

**Description:** Uses Groq AI (LLaMA 3.1) to generate the next interview question dynamically. For resume-based interviews, the resume text is used as context. For concept-based interviews, selected concepts drive question generation.

#### Request

**Headers:**

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |

**Body:**

```json
{
  "interviewId": "64abc...",
  "previousAnswer": "I have worked with React for 3 years..."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `interviewId` | `string` | ✅ Yes | MongoDB ObjectId of the interview |
| `previousAnswer` | `string` | ❌ Optional | The candidate's last answer for context-aware follow-up |

#### Responses

**`200 OK`:**

```json
{
  "question": "Can you walk me through a challenging project where you used React hooks to manage complex state?"
}
```

**`400 Bad Request`:**

```json
{ "error": "Interview ID is required" }
{ "error": "No concepts selected for this interview" }
```

**`404 Not Found`:**

```json
{ "error": "Interview not found" }
{ "error": "Resume not found" }
```

**`500 Internal Server Error`:**

```json
{ "error": "Failed to generate question" }
{ "error": "AI returned empty response", "question": null }
```

---

### 7. POST `/api/interviews/evaluate-answer`

**Description:** Evaluates a candidate's answer using two separate AI calls:
1. **Relevance & Confidence** analysis via `answerEvaluationPrompt`
2. **STAR method scoring** via `starEvaluationPrompt`

Also performs local filler word detection. Saves the result to the interview document.

#### Request

**Headers:**

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |

**Body:**

```json
{
  "interviewId": "64abc...",
  "question": "Tell me about a time you resolved a conflict.",
  "answer": "I once worked on a team where there was a disagreement..."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `interviewId` | `string` | ✅ Yes | MongoDB ObjectId of the interview |
| `question` | `string` | ✅ Yes | The interview question that was asked |
| `answer` | `string` | ✅ Yes | The candidate's spoken/typed answer |

#### Responses

**`200 OK` – Evaluation result:**

```json
{
  "question": "Tell me about a time you resolved a conflict.",
  "answer": "I once worked on a team where there was a disagreement...",
  "relevanceScore": 8,
  "confidenceScore": 7,
  "starScore": 6,
  "fillerWords": ["um", "like"],
  "feedback": "Your answer was relevant and well-structured.\nSTAR: The situation was clearly described but the result was vague."
}
```

| Field | Type | Description |
|-------|------|-------------|
| `relevanceScore` | `number` | 1–10 relevance of the answer to the question |
| `confidenceScore` | `number` | 1–10 confidence perceived from the answer |
| `starScore` | `number` | 1–10 STAR methodology score |
| `fillerWords` | `string[]` | Detected filler words (e.g., `["um", "like"]`) |
| `feedback` | `string` | Combined AI feedback string |

**`404 Not Found`:**

```json
{ "error": "Interview not found" }
{ "error": "Resume not found" }
```

**`500 Internal Server Error`:**

```json
{ "error": "Evaluation failed" }
```

---

### 8. POST `/api/interviews/update-transcript`

**Description:** Incrementally updates the live transcript of an ongoing interview session. Marks the interview as `in-progress`.

#### Request

**Headers:**

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |

**Body:**

```json
{
  "interviewId": "64abc...",
  "transcript": [
    "AI: Tell me about yourself.",
    "User: I am a software engineer with 3 years of experience."
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `interviewId` | `string` | ✅ Yes | MongoDB ObjectId of the interview |
| `transcript` | `string[]` | ✅ Yes | Array of conversation lines (joined with `\n` before saving) |

#### Responses

**`200 OK`:**

```json
{ "success": true }
```

**`400 Bad Request`:**

```json
{ "error": "Missing data" }
```

**`500 Internal Server Error`:**

```json
{ "error": "Failed to update transcript" }
```

---

### 9. POST `/api/interviews/end`

**Description:** Ends an interview session. Calculates the final `overallScore` from all evaluated answers, saves the final transcript, marks status as `completed`, and recalculates all user stats (avgScore, bestScore, improvementRate, skill averages).

#### Request

**Headers:**

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |

**Body:**

```json
{
  "interviewId": "64abc...",
  "transcript": [
    "AI: Tell me about yourself.",
    "User: I am a software engineer with 3 years of experience.",
    "AI: What was your biggest challenge?",
    "User: Scaling a Node.js API to handle 10k RPS..."
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `interviewId` | `string` | ✅ Yes | MongoDB ObjectId of the interview to end |
| `transcript` | `string[]` | ❌ Optional | Final conversation lines (joined and saved) |

#### Responses

**`200 OK`:**

```json
{ "success": true }
```

> After this call, the interview's `status` becomes `"completed"`, `overallScore` is set, and the user's dashboard stats are recalculated.

**Side Effects on User document:**

| Field Updated | Description |
|---------------|-------------|
| `totalInterviews` | Incremented count of completed interviews |
| `avgScore` | Recalculated average across all completed interviews |
| `bestScore` | Updated if new score is higher |
| `improvementRate` | % change from first to latest score |
| `avgRelevance` | Recalculated average relevance score |
| `avgConfidence` | Recalculated average confidence score |
| `avgStarScore` | Recalculated average STAR method score |

**`404 Not Found`:**

```json
{ "error": "Interview not found" }
```

**`500 Internal Server Error`:**

```json
{ "error": "Failed to end interview" }
```

---

### 10. POST `/api/resume/analyze`

**Description:** Accepts a resume file (PDF or DOCX), extracts text, runs an industry-standard ATS analysis against a job description, saves the result to MongoDB, and updates the user's ATS stats. Uses `pdf2json` for PDFs and `mammoth` for DOCX.

#### Request

**Headers:**

| Header | Value |
|--------|-------|
| `Content-Type` | `multipart/form-data` |

**Form Data:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `resume` | `File` | ✅ Yes | Resume file (`.pdf` or `.docx` only) |
| `jobDescription` | `string` | ✅ Yes | Target job description text |
| `firebaseUid` | `string` | ✅ Yes | Firebase UID of the authenticated user |
| `targetRole` | `string` | ✅ Yes | Target job role (e.g., `"Frontend Developer"`) |
| `experienceLevel` | `string` | ✅ Yes | Experience level (`"fresher"`, `"junior"`, `"mid"`, `"senior"`) |

#### Responses

**`200 OK` – ATS Analysis Result:**

```json
{
  "_id": "64xyz...",
  "atsScore": 74,
  "detectedRole": "Frontend Developer",
  "detailedScores": {
    "keywordMatch": 72,
    "skillsMatch": 80,
    "experienceMatch": 70,
    "formattingScore": 85
  },
  "matchedKeywords": ["React", "TypeScript", "Node.js", "REST API"],
  "missingKeywords": ["GraphQL", "Docker", "CI/CD"],
  "criticalMissingSkills": ["Docker", "CI/CD"],
  "recommendations": [
    "Add Docker experience to your resume",
    "Mention CI/CD pipelines used in past projects"
  ],
  "strengths": ["Strong React ecosystem experience", "Good formatting"],
  "weaknesses": ["Missing DevOps tools", "No mention of testing frameworks"],
  "industryBenchmark": {
    "averageScore": 68,
    "topPercentile": 90
  },
  "suggestions": [
    "Quantify your achievements with metrics",
    "Add a skills section at the top"
  ],
  "keywordScore": 72,
  "roleSkillScore": 80
}
```

| Field | Type | Description |
|-------|------|-------------|
| `atsScore` | `number` | Overall ATS score (0–100) |
| `detectedRole` | `string` | Role detected from resume content |
| `detailedScores` | `object` | Breakdown scores for keyword, skills, experience, formatting |
| `matchedKeywords` | `string[]` | Keywords found in both resume and JD |
| `missingKeywords` | `string[]` | Keywords in JD but absent from resume |
| `criticalMissingSkills` | `string[]` | High-priority missing skills |
| `recommendations` | `string[]` | Actionable improvement tips |
| `strengths` | `string[]` | Resume strengths |
| `weaknesses` | `string[]` | Resume weaknesses |
| `industryBenchmark` | `object` | Average and top percentile ATS scores for the role |
| `suggestions` | `string[]` | Enhanced AI-generated suggestions |
| `keywordScore` | `number` | Legacy: same as `detailedScores.keywordMatch` |
| `roleSkillScore` | `number` | Legacy: same as `detailedScores.skillsMatch` |

**`400 Bad Request`:**

```json
{ "error": "Missing fields" }
{ "error": "Missing role or experience" }
{ "error": "Only PDF and DOCX files are supported" }
{ "error": "Failed to extract text from resume. The file may be empty or contain only images." }
{ "error": "Failed to parse PDF file", "details": "..." }
```

**`404 Not Found`:**

```json
{ "error": "User not found" }
```

**`500 Internal Server Error`:**

```json
{ "error": "Resume analysis failed", "details": "..." }
```

---

### 11. GET `/api/resume/list`

**Description:** Returns all resumes uploaded and analyzed by the authenticated user, sorted newest first.

#### Request

**Headers:**

| Header | Type | Required | Description |
|--------|------|----------|-------------|
| `firebaseUid` | `string` | ✅ Yes | Firebase UID of the authenticated user |

#### Responses

**`200 OK`:**

```json
{
  "resumes": [
    {
      "_id": "64xyz...",
      "fileName": "john_doe_resume.pdf",
      "targetRole": "Frontend Developer",
      "experienceLevel": "mid",
      "atsScore": 74,
      "matchedKeywords": ["React", "TypeScript", "Node.js"],
      "missingKeywords": ["GraphQL", "Docker"],
      "createdAt": "2025-03-10T10:00:00.000Z"
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `string` | MongoDB ObjectId of the resume |
| `fileName` | `string` | Original uploaded file name |
| `targetRole` | `string` | Target role at time of upload |
| `experienceLevel` | `string` | `fresher`, `junior`, `mid`, or `senior` |
| `atsScore` | `number` | ATS score (0–100) |
| `matchedKeywords` | `string[]` | Keywords matched with the JD |
| `missingKeywords` | `string[]` | Keywords missing from the resume |
| `createdAt` | `ISO date` | Upload timestamp |

**`401 Unauthorized`:**

```json
{ "resumes": [], "error": "Unauthorized" }
```

**`404 Not Found`:**

```json
{ "resumes": [], "error": "User not found" }
```

**`500 Internal Server Error`:**

```json
{ "resumes": [], "error": "Failed to fetch resumes" }
```

---

### 12. GET `/api/resume/[id]`

**Description:** Fetches a single resume document by its MongoDB ObjectId. Used by the interview setup page to restore a resume reference from a URL param (`?resumeId=`) without downloading the full list.

#### Request

**URL Params:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | ✅ Yes | MongoDB ObjectId of the resume |

**Headers:** None required.

#### Responses

**`200 OK`:**

```json
{
  "_id": "64xyz...",
  "fileName": "john_doe_resume.pdf",
  "targetRole": "Frontend Developer",
  "experienceLevel": "mid",
  "atsScore": 74,
  "matchedKeywords": ["React", "TypeScript", "Node.js"],
  "missingKeywords": ["GraphQL", "Docker"],
  "createdAt": "2025-03-10T10:00:00.000Z"
}
```

**`404 Not Found`:**

```json
{ "error": "Resume not found" }
```

**`500 Internal Server Error`:**

```json
{ "error": "Failed to fetch resume" }
```

---

## Interview Flow (End-to-End)

```
1. POST /api/users                     → Sync Firebase user to MongoDB
         ↓
2. POST /api/resume/analyze            → Upload resume, get ATS score + resumeId
         ↓
3. POST /api/interviews/create         → Create interview with resumeId + jobDescription
         ↓
4. POST /api/interviews/generate-question  → Get first AI question
         ↓
5. POST /api/interviews/evaluate-answer   → Submit answer, get scores + feedback
         ↓
6. POST /api/interviews/update-transcript → Save live transcript (optional)
         ↓
7. Repeat steps 4–6 for each question
         ↓
8. POST /api/interviews/end            → Finalize interview, compute overall score
         ↓
9. GET  /api/dashboard                 → View updated analytics & charts
```

---

## Data Models Reference

### Interview Object

| Field | Type | Values |
|-------|------|--------|
| `_id` | `ObjectId` | MongoDB ID |
| `userId` | `ObjectId` | Ref → User |
| `resumeId` | `ObjectId` | Ref → Resume (resume-based only) |
| `interviewMode` | `string` | `resume-based`, `concept-based` |
| `interviewType` | `string` | `behavioral`, `technical`, `mixed` |
| `difficulty` | `string` | `junior`, `mid`, `senior`, `stress` |
| `status` | `string` | `created`, `in-progress`, `completed` |
| `overallScore` | `number` | 0–100 |
| `targetRole` | `string` | e.g., `Frontend Developer` |
| `selectedConcepts` | `string[]` | e.g., `["React", "Node.js"]` |
| `transcript` | `string` | Full conversation |
| `answers` | `Answer[]` | Array of evaluated answers |
| `voiceType` | `string` | `professional-female`, `professional-male` |
| `cameraEnabled` | `boolean` | True/false |
| `createdAt` | `Date` | Auto-generated |

### Answer Object (inside Interview.answers)

| Field | Type | Description |
|-------|------|-------------|
| `question` | `string` | The question asked |
| `answer` | `string` | The candidate's response |
| `relevanceScore` | `number` | 1–10 |
| `confidenceScore` | `number` | 1–10 |
| `starScore` | `number` | 1–10 |
| `fillerWords` | `string[]` | Detected filler words |
| `feedback` | `string` | AI-generated combined feedback |

### Resume Object

| Field | Type | Description |
|-------|------|-------------|
| `_id` | `ObjectId` | MongoDB ID |
| `userId` | `ObjectId` | Ref → User |
| `fileName` | `string` | Uploaded file name |
| `resumeText` | `string` | Extracted plain text |
| `targetRole` | `string` | Role at time of upload |
| `experienceLevel` | `string` | `fresher`, `junior`, `mid`, `senior` |
| `atsScore` | `number` | 0–100 |
| `matchedKeywords` | `string[]` | Keywords matched |
| `missingKeywords` | `string[]` | Keywords missing |
| `detailedScores` | `object` | Keyword, skills, experience, formatting |
| `strengths` | `string[]` | ATS strengths |
| `weaknesses` | `string[]` | ATS weaknesses |
| `industryBenchmark` | `object` | Benchmark comparison data |
| `createdAt` | `Date` | Auto-generated |

---

*Generated for MindMock — AI Interview Preparation Platform*  
*Last updated: April 2026*
