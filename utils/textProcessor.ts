export function cleanText(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ") // remove symbols
    .replace(/\s+/g, " ") // remove extra spaces
    .trim();
}

export function tokenize(text: string) {
  const stopWords = new Set([
    "and", "or", "the", "a", "an", "to", "of", "for", "with",
    "in", "on", "at", "by", "is", "are", "was", "were",
    "job", "role", "skills", "required", "must", "have"
  ]);

  return cleanText(text)
    .split(" ")
    .filter((word) => word.length > 2 && !stopWords.has(word));
}
