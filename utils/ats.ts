export function extractKeywords(text: string): string[] {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-zA-Z ]/g, "")
        .split(" ")
        .filter((word) => word.length > 2)
    )
  );
}

export function calculateATS(
  resumeText: string,
  jobDescription: string
) {
  const resumeWords = extractKeywords(resumeText);
  const jdWords = extractKeywords(jobDescription);

  const matched = jdWords.filter((word) =>
    resumeWords.includes(word)
  );

  const missing = jdWords.filter(
    (word) => !resumeWords.includes(word)
  );

  const score = Math.round(
    (matched.length / jdWords.length) * 100
  );

  return {
    score,
    matchedKeywords: matched,
    missingKeywords: missing,
  };
}
