import { tokenize } from "./textProcessor";
import { GLOBAL_SKILLS } from "./globalSkills";
import { detectRole } from "./roleDetector";

export function calculateUniversalATS(
  resumeText: string,
  jdText: string
) {
  const resumeTokens = tokenize(resumeText);
  const jdTokens = tokenize(jdText);

  const resumeSet = new Set(resumeTokens);
  const jdSet = new Set(jdTokens);

  // ✅ Detect role automatically
  const detectedRole = detectRole(jdText);
  const roleSkills = GLOBAL_SKILLS[detectedRole as keyof typeof GLOBAL_SKILLS] || [];

  // ✅ Keyword match
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  jdSet.forEach((word) => {
    if (resumeSet.has(word)) matchedKeywords.push(word);
    else missingKeywords.push(word);
  });

  const keywordScore =
    jdSet.size === 0
      ? 0
      : (matchedKeywords.length / jdSet.size) * 100;

  // ✅ Role-based skill score
  let skillMatch = 0;
  let totalSkills = roleSkills.length;

  roleSkills.forEach((skill) => {
    if (resumeText.toLowerCase().includes(skill)) skillMatch++;
  });

  const roleSkillScore =
    totalSkills === 0
      ? 0
      : (skillMatch / totalSkills) * 100;

  // ✅ Cross-domain skill bonus (real ATS logic)
  let crossDomainBonus = 0;
  Object.values(GLOBAL_SKILLS).forEach((skills) => {
    skills.forEach((skill) => {
      if (resumeText.toLowerCase().includes(skill))
        crossDomainBonus++;
    });
  });

  crossDomainBonus = Math.min(crossDomainBonus, 10);

  // ✅ Final weighted score
  const finalScore = Math.min(
    100,
    Math.round(
      keywordScore * 0.45 +
        roleSkillScore * 0.45 +
        crossDomainBonus
    )
  );

  return {
    detectedRole,
    atsScore: finalScore,
    keywordScore: Math.round(keywordScore),
    roleSkillScore: Math.round(roleSkillScore),
    matchedKeywords,
    missingKeywords,
  };
}
