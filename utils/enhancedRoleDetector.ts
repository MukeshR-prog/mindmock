// Enhanced role detection with better accuracy
import { COMPREHENSIVE_SKILLS } from "./comprehensiveSkills";

export function detectRole(jobDescription: string, resumeText?: string): string {
  const combinedText = jobDescription + (resumeText ? ' ' + resumeText : '');
  const text = combinedText.toLowerCase();
  
  // Role-specific keywords and patterns
  const rolePatterns: Record<string, { keywords: string[], patterns: RegExp[], weight: number }> = {
    'frontend': {
      keywords: ['frontend', 'front-end', 'react', 'vue', 'angular', 'javascript', 'html', 'css', 'ui developer'],
      patterns: [/front.?end/gi, /ui.?developer/gi, /javascript.?developer/gi],
      weight: 1
    },
    'backend': {
      keywords: ['backend', 'back-end', 'server', 'api', 'database', 'node', 'python', 'java', 'backend developer'],
      patterns: [/back.?end/gi, /server.?side/gi, /api.?development/gi],
      weight: 1
    },
    'fullstack': {
      keywords: ['fullstack', 'full-stack', 'full stack', 'frontend', 'backend', 'end to end'],
      patterns: [/full.?stack/gi, /end.?to.?end/gi],
      weight: 1.2
    },
    'devops': {
      keywords: ['devops', 'infrastructure', 'deployment', 'ci/cd', 'kubernetes', 'docker', 'aws', 'cloud'],
      patterns: [/devops/gi, /cloud.?engineer/gi, /infrastructure/gi, /site.?reliability/gi],
      weight: 1
    },
    'data': {
      keywords: ['data scientist', 'data analyst', 'machine learning', 'ai', 'analytics', 'python', 'r', 'sql'],
      patterns: [/data.?scientist/gi, /machine.?learning/gi, /data.?analyst/gi, /ai.?engineer/gi],
      weight: 1
    },
    'mobile': {
      keywords: ['mobile', 'ios', 'android', 'react native', 'flutter', 'swift', 'kotlin', 'app developer'],
      patterns: [/mobile.?developer/gi, /ios.?developer/gi, /android.?developer/gi],
      weight: 1
    },
    'ai-ml': {
      keywords: ['machine learning', 'artificial intelligence', 'deep learning', 'nlp', 'computer vision', 'ai engineer'],
      patterns: [/machine.?learning/gi, /artificial.?intelligence/gi, /deep.?learning/gi, /ai.?engineer/gi],
      weight: 1
    },
    'cybersecurity': {
      keywords: ['cybersecurity', 'information security', 'penetration testing', 'security analyst', 'infosec'],
      patterns: [/cyber.?security/gi, /information.?security/gi, /security.?analyst/gi],
      weight: 1
    },
    'product': {
      keywords: ['product manager', 'product owner', 'product strategy', 'roadmap', 'stakeholder'],
      patterns: [/product.?manager/gi, /product.?owner/gi, /product.?strategy/gi],
      weight: 1
    },
    'design': {
      keywords: ['ui designer', 'ux designer', 'graphic designer', 'visual designer', 'user experience'],
      patterns: [/ui.?designer/gi, /ux.?designer/gi, /user.?experience/gi, /graphic.?designer/gi],
      weight: 1
    },
    'qa': {
      keywords: ['qa engineer', 'quality assurance', 'test engineer', 'automation tester', 'manual testing'],
      patterns: [/qa.?engineer/gi, /quality.?assurance/gi, /test.?engineer/gi],
      weight: 1
    }
  };

  const roleScores: Record<string, number> = {};
  
  // Initialize scores
  Object.keys(rolePatterns).forEach(role => {
    roleScores[role] = 0;
  });

  // Calculate scores based on keywords and patterns
  Object.entries(rolePatterns).forEach(([role, config]) => {
    // Keyword matching
    config.keywords.forEach(keyword => {
      const regex = new RegExp(keyword.replace(/\s+/g, '\\s*'), 'gi');
      const matches = text.match(regex);
      if (matches) {
        roleScores[role] += matches.length * config.weight;
      }
    });

    // Pattern matching
    config.patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        roleScores[role] += matches.length * config.weight * 1.5; // Higher weight for patterns
      }
    });

    // Skill matching from comprehensive skills database
    const roleSkills = COMPREHENSIVE_SKILLS[role];
    if (roleSkills) {
      // Technical skills
      if (roleSkills.technical) {
        roleSkills.technical.forEach((skill: string) => {
          if (text.includes(skill.toLowerCase())) {
            roleScores[role] += 0.5;
          }
        });
      }

      // Tools
      if (roleSkills.tools) {
        roleSkills.tools.forEach((tool: string) => {
          if (text.includes(tool.toLowerCase())) {
            roleScores[role] += 0.3;
          }
        });
      }

      // Frameworks
      if (roleSkills.frameworks) {
        roleSkills.frameworks.forEach((framework: string) => {
          if (text.includes(framework.toLowerCase())) {
            roleScores[role] += 0.4;
          }
        });
      }
    }
  });

  // Special handling for common ambiguous cases
  if (roleScores.frontend > 0 && roleScores.backend > 0) {
    // If both frontend and backend are detected, check for fullstack indicators
    const fullstackIndicators = ['full stack', 'fullstack', 'end to end', 'frontend and backend'];
    const hasFullstackIndicator = fullstackIndicators.some(indicator => 
      text.includes(indicator.toLowerCase())
    );
    
    if (hasFullstackIndicator || (roleScores.frontend > 2 && roleScores.backend > 2)) {
      roleScores.fullstack += roleScores.frontend + roleScores.backend;
    }
  }

  // Boost AI/ML if data science terms are found
  if (roleScores.data > 0) {
    const aiTerms = ['machine learning', 'artificial intelligence', 'deep learning', 'neural network'];
    const hasAiTerms = aiTerms.some(term => text.includes(term));
    if (hasAiTerms) {
      roleScores['ai-ml'] += roleScores.data * 1.5;
    }
  }

  // Find the role with the highest score
  const sortedRoles = Object.entries(roleScores)
    .filter(([_, score]) => score > 0)
    .sort(([, a], [, b]) => b - a);

  if (sortedRoles.length === 0) {
    return 'general'; // Default fallback
  }

  const [topRole, topScore] = sortedRoles[0];
  const [secondRole, secondScore] = sortedRoles[1] || ['', 0];

  // If the top two roles are very close, choose the more specific one
  if (secondScore > 0 && (topScore - secondScore) < 1) {
    const specificityOrder = ['ai-ml', 'cybersecurity', 'devops', 'mobile', 'fullstack', 'frontend', 'backend', 'data', 'design', 'qa', 'product'];
    const topIndex = specificityOrder.indexOf(topRole);
    const secondIndex = specificityOrder.indexOf(secondRole);
    
    if (topIndex !== -1 && secondIndex !== -1 && secondIndex < topIndex) {
      return secondRole;
    }
  }

  return topRole;
}

// Helper function to normalize role names for consistency
export function normalizeRoleName(role: string): string {
  const roleMapping: Record<string, string> = {
    'frontend': 'Frontend Developer',
    'backend': 'Backend Developer', 
    'fullstack': 'Full Stack Developer',
    'devops': 'DevOps Engineer',
    'data': 'Data Scientist',
    'mobile': 'Mobile Developer',
    'ai-ml': 'AI/ML Engineer',
    'cybersecurity': 'Cybersecurity Specialist',
    'product': 'Product Manager',
    'design': 'UI/UX Designer',
    'qa': 'QA Engineer',
    'general': 'Software Developer'
  };
  
  return roleMapping[role] || role;
}

// Function to get role-specific weight adjustments
export function getRoleWeights(role: string): Record<string, number> {
  const weights: Record<string, Record<string, number>> = {
    'frontend': {
      'keywordMatch': 1.2,
      'skillsMatch': 1.3,
      'formatScore': 1.0,
      'experienceScore': 1.0
    },
    'backend': {
      'keywordMatch': 1.1,
      'skillsMatch': 1.4,
      'formatScore': 1.0,
      'experienceScore': 1.1
    },
    'fullstack': {
      'keywordMatch': 1.0,
      'skillsMatch': 1.2,
      'formatScore': 1.0,
      'experienceScore': 1.2
    },
    'data': {
      'keywordMatch': 1.0,
      'skillsMatch': 1.5,
      'formatScore': 0.9,
      'experienceScore': 1.1,
      'educationScore': 1.3
    },
    'ai-ml': {
      'keywordMatch': 1.0,
      'skillsMatch': 1.6,
      'formatScore': 0.9,
      'experienceScore': 1.0,
      'educationScore': 1.4
    }
  };
  
  return weights[role] || {
    'keywordMatch': 1.0,
    'skillsMatch': 1.0,
    'formatScore': 1.0,
    'experienceScore': 1.0,
    'educationScore': 1.0
  };
}