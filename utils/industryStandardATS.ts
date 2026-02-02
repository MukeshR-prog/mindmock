// Industry-standard ATS scoring system
import { tokenize } from "./textProcessor";
import { COMPREHENSIVE_SKILLS } from "./comprehensiveSkills";
import { detectRole } from "./enhancedRoleDetector";

export interface ATSScoreResult {
  atsScore: number;
  detailedScores: {
    keywordMatch: number;
    skillsMatch: number;
    formatScore: number;
    experienceScore: number;
    educationScore: number;
    contactScore: number;
    sectionScore: number;
    quantifiableScore: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  criticalMissingSkills: string[];
  detectedRole: string;
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  industryBenchmark: {
    percentile: number;
    averageScore: number;
    topTierThreshold: number;
  };
}

export function calculateIndustryStandardATS(
  resumeText: string,
  jobDescription: string,
  targetRole?: string,
  experienceLevel: string = "mid"
): ATSScoreResult {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();
  
  // Detect or use provided role
  const detectedRole = targetRole || detectRole(jobDescription, resumeText);
  const roleSkills = COMPREHENSIVE_SKILLS[detectedRole] || COMPREHENSIVE_SKILLS.general;
  
  // 1. Keyword Matching Score (25%)
  const keywordScore = calculateKeywordScore(resumeText, jobDescription);
  
  // 2. Skills Matching Score (20%)
  const skillsScore = calculateSkillsScore(resumeLower, roleSkills, jdLower);
  
  // 3. Format and Structure Score (15%)
  const formatScore = calculateFormatScore(resumeText);
  
  // 4. Experience Relevance Score (15%)
  const experienceScore = calculateExperienceScore(resumeLower, jdLower, experienceLevel);
  
  // 5. Education and Certifications Score (10%)
  const educationScore = calculateEducationScore(resumeLower, roleSkills.education);
  
  // 6. Contact Information Score (5%)
  const contactScore = calculateContactScore(resumeText);
  
  // 7. Section Organization Score (5%)
  const sectionScore = calculateSectionScore(resumeText);
  
  // 8. Quantifiable Achievements Score (5%)
  const quantifiableScore = calculateQuantifiableScore(resumeText);
  
  // Calculate weighted final score
  const finalScore = Math.round(
    keywordScore.score * 0.25 +
    skillsScore.score * 0.20 +
    formatScore * 0.15 +
    experienceScore * 0.15 +
    educationScore * 0.10 +
    contactScore * 0.05 +
    sectionScore * 0.05 +
    quantifiableScore * 0.05
  );
  
  // Get industry benchmarks
  const benchmark = getIndustryBenchmark(detectedRole, experienceLevel);
  
  // Generate recommendations
  const recommendations = generateRecommendations({
    keywordScore: keywordScore.score,
    skillsScore: skillsScore.score,
    formatScore,
    experienceScore,
    educationScore,
    contactScore,
    sectionScore,
    quantifiableScore,
    missingSkills: skillsScore.missing
  });
  
  const strengths = identifyStrengths({
    keywordScore: keywordScore.score,
    skillsScore: skillsScore.score,
    formatScore,
    experienceScore,
    educationScore
  });
  
  const weaknesses = identifyWeaknesses({
    keywordScore: keywordScore.score,
    skillsScore: skillsScore.score,
    formatScore,
    experienceScore,
    educationScore,
    contactScore,
    sectionScore
  });
  
  return {
    atsScore: Math.min(100, Math.max(0, finalScore)),
    detailedScores: {
      keywordMatch: Math.round(keywordScore.score),
      skillsMatch: Math.round(skillsScore.score),
      formatScore: Math.round(formatScore),
      experienceScore: Math.round(experienceScore),
      educationScore: Math.round(educationScore),
      contactScore: Math.round(contactScore),
      sectionScore: Math.round(sectionScore),
      quantifiableScore: Math.round(quantifiableScore)
    },
    matchedKeywords: keywordScore.matched,
    missingKeywords: keywordScore.missing,
    criticalMissingSkills: skillsScore.missing.slice(0, 10),
    detectedRole,
    recommendations,
    strengths,
    weaknesses,
    industryBenchmark: {
      percentile: calculatePercentile(finalScore, benchmark),
      averageScore: benchmark.average,
      topTierThreshold: benchmark.topTier
    }
  };
}

function calculateKeywordScore(resumeText: string, jobDescription: string) {
  const resumeTokens = new Set(tokenize(resumeText));
  const jdTokens = tokenize(jobDescription);
  
  // Extract important keywords (ignore common words)
  const importantKeywords = jdTokens.filter(word => 
    word.length > 3 && 
    !isCommonWord(word) &&
    (isSkillKeyword(word) || isTechnicalKeyword(word) || isIndustryKeyword(word))
  );
  
  const matched: string[] = [];
  const missing: string[] = [];
  
  importantKeywords.forEach(keyword => {
    if (resumeTokens.has(keyword) || hasVariant(resumeText.toLowerCase(), keyword)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });
  
  const score = importantKeywords.length > 0 ? 
    (matched.length / importantKeywords.length) * 100 : 0;
  
  return { score, matched, missing };
}

function calculateSkillsScore(resumeText: string, roleSkills: any, jobDescription: string) {
  const requiredSkills = [...roleSkills.technical, ...roleSkills.soft, ...roleSkills.tools];
  const jdSkills = extractSkillsFromJD(jobDescription, requiredSkills);
  
  const matched: string[] = [];
  const missing: string[] = [];
  
  jdSkills.forEach(skill => {
    if (hasSkillInResume(resumeText, skill)) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  });
  
  // Bonus for additional relevant skills
  const bonusSkills = requiredSkills.filter(skill => 
    !jdSkills.includes(skill) && hasSkillInResume(resumeText, skill)
  );
  
  const baseScore = jdSkills.length > 0 ? (matched.length / jdSkills.length) * 100 : 0;
  const bonusScore = Math.min(10, bonusSkills.length * 2);
  
  return {
    score: Math.min(100, baseScore + bonusScore),
    matched: [...matched, ...bonusSkills],
    missing
  };
}

function calculateFormatScore(resumeText: string): number {
  let score = 100;
  
  // Check for proper formatting issues
  const lines = resumeText.split('\n');
  
  // Penalty for too short or too long
  if (resumeText.length < 500) score -= 20;
  if (resumeText.length > 8000) score -= 15;
  
  // Check for consistent formatting
  const hasProperSections = checkSections(resumeText);
  if (!hasProperSections) score -= 25;
  
  // Check for bullet points or structured content
  const hasBulletPoints = /[•\-\*]|\d+\./.test(resumeText);
  if (!hasBulletPoints) score -= 10;
  
  // Check for proper spacing and structure
  const hasGoodStructure = lines.filter(line => line.trim().length > 0).length > 10;
  if (!hasGoodStructure) score -= 15;
  
  return Math.max(0, score);
}

function calculateExperienceScore(resumeText: string, jobDescription: string, experienceLevel: string): number {
  const yearMatches = resumeText.match(/\d{4}/g) || [];
  const experienceYears = extractExperienceYears(resumeText);
  
  // Check if experience level matches resume content
  const levelMatch = checkExperienceLevelMatch(resumeText, experienceLevel);
  
  // Check for relevant job titles
  const relevantTitles = extractJobTitles(resumeText);
  const jdTitleKeywords = extractTitleKeywords(jobDescription);
  
  const titleRelevance = calculateTitleRelevance(relevantTitles, jdTitleKeywords);
  
  let score = 0;
  
  // Experience years score (40%)
  if (experienceYears >= 0) score += 40;
  
  // Level consistency score (30%)
  if (levelMatch) score += 30;
  
  // Title relevance score (30%)
  score += titleRelevance * 0.3;
  
  return Math.min(100, score);
}

function calculateEducationScore(resumeText: string, requiredEducation: string[]): number {
  const educationKeywords = [
    'bachelor', 'master', 'phd', 'degree', 'university', 'college',
    'computer science', 'engineering', 'mathematics', 'mba',
    'certification', 'certified', 'diploma'
  ];
  
  let score = 0;
  let foundEducation = 0;
  
  educationKeywords.forEach(keyword => {
    if (resumeText.toLowerCase().includes(keyword)) {
      foundEducation++;
    }
  });
  
  // Base education score
  if (foundEducation > 0) score += 60;
  if (foundEducation > 2) score += 20;
  
  // Check for specific required education
  if (requiredEducation.length > 0) {
    const matchedRequirements = requiredEducation.filter(req =>
      resumeText.toLowerCase().includes(req.toLowerCase())
    );
    score += (matchedRequirements.length / requiredEducation.length) * 20;
  }
  
  return Math.min(100, score);
}

function calculateContactScore(resumeText: string): number {
  let score = 0;
  
  // Email
  if (/@.*\./.test(resumeText)) score += 30;
  
  // Phone
  if (/\(?[\d\s\-\+\(\)]{10,}/.test(resumeText)) score += 25;
  
  // LinkedIn
  if (/linkedin|github/.test(resumeText.toLowerCase())) score += 25;
  
  // Address/Location
  if (/\b[A-Z][a-z]+(,\s*[A-Z]{2}|\s+[A-Z]{2}\b)/.test(resumeText)) score += 20;
  
  return Math.min(100, score);
}

function calculateSectionScore(resumeText: string): number {
  const expectedSections = [
    'experience', 'education', 'skills', 'summary', 'objective',
    'work', 'employment', 'projects', 'certifications'
  ];
  
  let foundSections = 0;
  const resumeLower = resumeText.toLowerCase();
  
  expectedSections.forEach(section => {
    if (resumeLower.includes(section)) {
      foundSections++;
    }
  });
  
  return Math.min(100, (foundSections / 4) * 100);
}

function calculateQuantifiableScore(resumeText: string): number {
  // Look for quantifiable achievements
  const quantifiers = [
    /\d+%/, // percentages
    /\$[\d,]+/, // money
    /\d+\+?\s*(years?|months?|weeks?)/, // time periods
    /\d+[kmb]?\s*(users?|customers?|clients?)/, // numbers of people
    /\d+\s*(projects?|applications?|systems?)/, // countable items
    /increased?.*\d+/, // improvements
    /reduced?.*\d+/, // reductions
    /improved?.*\d+/ // improvements
  ];
  
  let quantifiableCount = 0;
  
  quantifiers.forEach(regex => {
    const matches = resumeText.match(new RegExp(regex, 'gi'));
    if (matches) quantifiableCount += matches.length;
  });
  
  return Math.min(100, quantifiableCount * 15);
}

// Helper functions
function isCommonWord(word: string): boolean {
  const commonWords = new Set([
    'experience', 'work', 'job', 'company', 'team', 'project',
    'develop', 'create', 'manage', 'lead', 'responsible', 'duties'
  ]);
  return commonWords.has(word);
}

function isSkillKeyword(word: string): boolean {
  // Check against comprehensive skills database
  return Object.values(COMPREHENSIVE_SKILLS).some((category: any) =>
    category.technical?.includes(word) ||
    category.tools?.includes(word) ||
    category.frameworks?.includes(word)
  );
}

function isTechnicalKeyword(word: string): boolean {
  const technicalTerms = [
    'api', 'database', 'framework', 'library', 'algorithm',
    'architecture', 'deployment', 'testing', 'debugging'
  ];
  return technicalTerms.includes(word);
}

function isIndustryKeyword(word: string): boolean {
  const industryTerms = [
    'agile', 'scrum', 'devops', 'cloud', 'microservices',
    'analytics', 'optimization', 'automation', 'integration'
  ];
  return industryTerms.includes(word);
}

function hasVariant(text: string, keyword: string): boolean {
  // Check for common variants of keywords
  const variants = [
    keyword + 's',
    keyword + 'ing',
    keyword + 'ed',
    keyword.replace(/s$/, ''),
    keyword.replace(/ing$/, ''),
    keyword.replace(/ed$/, '')
  ];
  
  return variants.some(variant => text.includes(variant));
}

function hasSkillInResume(resumeText: string, skill: string): boolean {
  const skillVariants = [
    skill.toLowerCase(),
    skill.toLowerCase().replace(/\s+/g, ''),
    skill.toLowerCase().replace(/\s+/g, '-'),
    skill.toLowerCase().replace(/\s+/g, '_')
  ];
  
  return skillVariants.some(variant => resumeText.includes(variant));
}

function extractSkillsFromJD(jobDescription: string, allSkills: string[]): string[] {
  const jdLower = jobDescription.toLowerCase();
  return allSkills.filter(skill => 
    jdLower.includes(skill.toLowerCase()) ||
    hasVariant(jdLower, skill.toLowerCase())
  );
}

function checkSections(resumeText: string): boolean {
  const sectionHeaders = [
    'experience', 'education', 'skills', 'summary',
    'work history', 'employment', 'qualifications'
  ];
  
  const foundSections = sectionHeaders.filter(header =>
    resumeText.toLowerCase().includes(header)
  );
  
  return foundSections.length >= 2;
}

function extractExperienceYears(resumeText: string): number {
  const yearMatches = resumeText.match(/\d{4}/g);
  if (!yearMatches || yearMatches.length < 2) return 0;
  
  const years = yearMatches.map(y => parseInt(y)).filter(y => y >= 1990 && y <= new Date().getFullYear());
  if (years.length < 2) return 0;
  
  const currentYear = new Date().getFullYear();
  const earliestYear = Math.min(...years);
  
  return currentYear - earliestYear;
}

function checkExperienceLevelMatch(resumeText: string, experienceLevel: string): boolean {
  const experienceYears = extractExperienceYears(resumeText);
  
  switch (experienceLevel) {
    case 'fresher':
      return experienceYears <= 1;
    case 'junior':
      return experienceYears >= 0 && experienceYears <= 3;
    case 'mid':
      return experienceYears >= 2 && experienceYears <= 7;
    case 'senior':
      return experienceYears >= 5;
    default:
      return true;
  }
}

function extractJobTitles(resumeText: string): string[] {
  // Basic extraction of potential job titles
  const titlePatterns = [
    /(?:^|\n)\s*([A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Specialist|Consultant))/gm,
    /(Software|Senior|Junior|Lead|Principal)\s+[A-Z][a-zA-Z\s]+/gi
  ];
  
  const titles: string[] = [];
  
  titlePatterns.forEach(pattern => {
    const matches = resumeText.match(pattern);
    if (matches) {
      titles.push(...matches.map(match => match.trim()));
    }
  });
  
  return titles;
}

function extractTitleKeywords(jobDescription: string): string[] {
  const titleSection = jobDescription.split('\n')[0]; // Assume first line is title
  return tokenize(titleSection).filter(word => word.length > 3);
}

function calculateTitleRelevance(resumeTitles: string[], jdKeywords: string[]): number {
  if (resumeTitles.length === 0 || jdKeywords.length === 0) return 0;
  
  let relevanceScore = 0;
  
  resumeTitles.forEach(title => {
    const titleWords = tokenize(title);
    const matches = titleWords.filter(word => jdKeywords.includes(word));
    relevanceScore += matches.length / titleWords.length;
  });
  
  return Math.min(100, (relevanceScore / resumeTitles.length) * 100);
}

function getIndustryBenchmark(role: string, experienceLevel: string) {
  const benchmarks: Record<string, Record<string, any>> = {
    'frontend': {
      'fresher': { average: 65, topTier: 85 },
      'junior': { average: 70, topTier: 88 },
      'mid': { average: 75, topTier: 90 },
      'senior': { average: 80, topTier: 95 }
    },
    'backend': {
      'fresher': { average: 68, topTier: 87 },
      'junior': { average: 72, topTier: 89 },
      'mid': { average: 77, topTier: 92 },
      'senior': { average: 82, topTier: 96 }
    },
    'fullstack': {
      'fresher': { average: 63, topTier: 83 },
      'junior': { average: 68, topTier: 86 },
      'mid': { average: 73, topTier: 89 },
      'senior': { average: 78, topTier: 93 }
    },
    'data': {
      'fresher': { average: 70, topTier: 88 },
      'junior': { average: 74, topTier: 90 },
      'mid': { average: 78, topTier: 92 },
      'senior': { average: 83, topTier: 96 }
    }
  };
  
  return benchmarks[role]?.[experienceLevel] || { average: 70, topTier: 88 };
}

function calculatePercentile(score: number, benchmark: any): number {
  if (score >= benchmark.topTier) return 95;
  if (score >= benchmark.average + 10) return 80;
  if (score >= benchmark.average) return 60;
  if (score >= benchmark.average - 10) return 40;
  return 20;
}

function generateRecommendations(scores: any): string[] {
  const recommendations: string[] = [];
  
  if (scores.keywordScore < 70) {
    recommendations.push("Include more relevant keywords from the job description in your resume");
  }
  
  if (scores.skillsScore < 75) {
    recommendations.push(`Add these critical skills to your resume: ${scores.missingSkills.slice(0, 5).join(', ')}`);
  }
  
  if (scores.formatScore < 80) {
    recommendations.push("Improve resume formatting with clear sections, bullet points, and consistent spacing");
  }
  
  if (scores.quantifiableScore < 60) {
    recommendations.push("Add quantifiable achievements with specific numbers, percentages, or metrics");
  }
  
  if (scores.contactScore < 80) {
    recommendations.push("Ensure all contact information is complete (email, phone, LinkedIn profile)");
  }
  
  if (scores.experienceScore < 70) {
    recommendations.push("Better align your experience description with the target role requirements");
  }
  
  return recommendations;
}

function identifyStrengths(scores: any): string[] {
  const strengths: string[] = [];
  
  if (scores.keywordScore >= 80) strengths.push("Strong keyword optimization");
  if (scores.skillsScore >= 85) strengths.push("Excellent skills alignment");
  if (scores.formatScore >= 85) strengths.push("Well-formatted and structured resume");
  if (scores.experienceScore >= 80) strengths.push("Relevant work experience");
  if (scores.educationScore >= 80) strengths.push("Strong educational background");
  
  return strengths;
}

function identifyWeaknesses(scores: any): string[] {
  const weaknesses: string[] = [];
  
  if (scores.keywordScore < 60) weaknesses.push("Low keyword match with job description");
  if (scores.skillsScore < 65) weaknesses.push("Missing critical technical skills");
  if (scores.formatScore < 70) weaknesses.push("Poor resume formatting and structure");
  if (scores.contactScore < 70) weaknesses.push("Incomplete contact information");
  if (scores.sectionScore < 70) weaknesses.push("Missing important resume sections");
  
  return weaknesses;
}