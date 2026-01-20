export function calculateOverallScore(answers: any[]) {
  if (!answers.length) return 0;

  let total = 0;

  answers.forEach((a) => {
    total +=
      a.relevanceScore * 0.4 +
      a.confidenceScore * 0.3 +
      a.starScore * 0.3;
  });

  return Math.round(total / answers.length);
}
