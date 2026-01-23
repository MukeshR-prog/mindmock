import { GLOBAL_SKILLS } from "./globalSkills";

export function detectRole(text: string) {
  const lower = text.toLowerCase();

  const roleScores: Record<string, number> = {};

  Object.entries(GLOBAL_SKILLS).forEach(([role, skills]) => {
    roleScores[role] = 0;
    skills.forEach((skill) => {
      if (lower.includes(skill)) roleScores[role]++;
    });
  });

  return Object.entries(roleScores).sort((a, b) => b[1] - a[1])[0][0];
}
