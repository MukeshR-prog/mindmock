function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

// Some legacy interviews may store overall scores as 0-10.
// This helper normalizes any score into a 0-100 percentage.
export function normalizeOverallScore(score?: number | null) {
  if (score === null || score === undefined || Number.isNaN(score)) return 0;

  const normalized = score <= 10 ? score * 10 : score;
  return clampPercentage(normalized);
}

export function calculateOverallScore(answers: any[]) {
  if (!answers.length) return 0;

  let total = 0;

  answers.forEach((a) => {
    total +=
      a.relevanceScore * 0.4 +
      a.confidenceScore * 0.3 +
      a.starScore * 0.3;
  });

  // Relevance, confidence and STAR are scored on a 0-10 scale.
  // Convert weighted average to percentage (0-100).
  return clampPercentage((total / answers.length) * 10);
}
