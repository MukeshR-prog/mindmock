export function starEvaluationPrompt(answer: string) {
  return `
Evaluate the following interview answer using the STAR method.

Answer:
"${answer}"

Instructions:
- Score STAR usage from 0 to 10
- Respond ONLY in JSON:
{
  "starScore": number,
  "feedback": string
}
`;
}
