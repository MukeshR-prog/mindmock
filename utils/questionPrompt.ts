export function buildQuestionPrompt({
  resumeText,
  role,
  experience,
  interviewType,
}: {
  resumeText: string;
  role: string;
  experience: string;
  interviewType: string;
}) {
  return `
You are an interviewer.

Candidate details:
- Role: ${role}
- Experience Level: ${experience}
- Interview Type: ${interviewType}

Resume:
${resumeText}

Rules:
- Ask ONE question at a time
- Difficulty must match experience
- Ask real interview questions
- Avoid generic questions

Ask the first interview question.
`;
}
