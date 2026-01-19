export function answerEvaluationPrompt({
  question,
  answer,
  role,
  experience,
}: {
  question: string;
  answer: string;
  role: string;
  experience: string;
}) {
  return `
You are an interview evaluator.

Candidate role: ${role}
Experience level: ${experience}

Question:
"${question}"

Answer:
"${answer}"

Evaluate:
1. Relevance (0–10)
2. Confidence (0–10)
3. Clarity and depth

Respond ONLY in JSON:
{
  "relevanceScore": number,
  "confidenceScore": number,
  "feedback": string
}
`;
}
