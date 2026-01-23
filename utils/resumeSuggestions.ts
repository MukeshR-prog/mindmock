export function generateResumeSuggestions(
  missingKeywords: string[],
  detectedRole: string
) {
  if (!missingKeywords.length) {
    return ["Your resume is well aligned with the target role."];
  }

  return missingKeywords.slice(0, 8).map((skill) => {
    return `Consider adding experience or projects related to "${skill}" for the ${detectedRole} role.`;
  });
}
