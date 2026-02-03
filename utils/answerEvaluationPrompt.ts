export function answerEvaluationPrompt({
  question,
  answer,
  role,
  experience,
  interviewMode,
  selectedConcepts,
}: {
  question: string;
  answer: string;
  role: string;
  experience: string;
  interviewMode?: string;
  selectedConcepts?: string[];
}) {
  const conceptContext = interviewMode === "concept-based" && selectedConcepts?.length
    ? `\nFocus areas: ${selectedConcepts.join(", ")}\nThis is a concept-based interview testing theoretical knowledge and practical understanding.`
    : "";

  return `
You are an interview evaluator.

Candidate role: ${role}
Experience level: ${experience}${conceptContext}

Question:
"${question}"

Answer:
"${answer}"

Evaluate based on:
1. Relevance (0–10) - How well the answer addresses the question
2. Confidence (0–10) - How confidently and completely the answer was given
3. Clarity and depth - Technical accuracy and depth of explanation
${interviewMode === "concept-based" ? "4. Conceptual Understanding - How well they understand the underlying concepts" : ""}

Respond ONLY in JSON:
{
  "relevanceScore": number,
  "confidenceScore": number,
  "feedback": string
}
`;
}
