export function interviewQuestionPrompt({
  resumeText,
  role,
  experience,
  previousAnswer,
}: {
  resumeText: string;
  role: string;
  experience: string;
  previousAnswer?: string;
}) {
  return `
You are a professional technical interviewer.

Candidate details:
- Target role: ${role}
- Experience level: ${experience}

Candidate resume:
${resumeText}

${previousAnswer ? `Candidate's previous answer:\n${previousAnswer}` : ""}

Instructions:
- Ask ONE interview question only
- Base the question strictly on resume content
- Adjust difficulty to experience level
- Ask realistic interview questions
- Do NOT mention the resume explicitly
- Do NOT ask generic questions
- Output only the question text
`;
}
