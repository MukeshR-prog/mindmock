const FILLERS = [
  "um",
  "uh",
  "like",
  "you know",
  "basically",
  "actually",
  "so",
];

export function detectFillerWords(answer: string) {
  const lower = answer.toLowerCase();
  return FILLERS.filter((word) => lower.includes(word));
}
