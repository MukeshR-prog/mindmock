// Enhanced resume suggestions based on comprehensive ATS analysis
import type { ATSScoreResult } from "./industryStandardATS";

export function generateEnhancedResumeSuggestions(atsResult: ATSScoreResult): string[] {
  const suggestions: string[] = [];
  const { detailedScores, criticalMissingSkills, weaknesses, industryBenchmark } = atsResult;

  // Priority-based suggestions
  
  // Critical Issues (Score < 50)
  if (atsResult.atsScore < 50) {
    suggestions.push("🚨 Critical: Your resume needs immediate attention. Consider professional resume review.");
  }

  // Keyword Optimization
  if (detailedScores.keywordMatch < 60) {
    suggestions.push(`📝 Add these high-impact keywords: ${criticalMissingSkills.slice(0, 5).join(', ')}`);
    suggestions.push("💡 Mirror the job description language more closely in your experience descriptions");
  } else if (detailedScores.keywordMatch < 80) {
    suggestions.push("🔍 Fine-tune keyword usage by incorporating more specific technical terms");
  }

  // Skills Enhancement
  if (detailedScores.skillsMatch < 70) {
    suggestions.push(`🛠️ Highlight these missing critical skills: ${criticalMissingSkills.slice(0, 3).join(', ')}`);
    suggestions.push("📚 Consider adding a dedicated 'Technical Skills' section with categorized skills");
  }

  // Format and Structure
  if (detailedScores.formatScore < 75) {
    suggestions.push("📄 Improve formatting with clear sections: Summary, Experience, Skills, Education");
    suggestions.push("✨ Use consistent bullet points and professional formatting throughout");
    suggestions.push("📏 Ensure proper spacing and readable font (10-12pt, standard fonts)");
  }

  // Experience Relevance
  if (detailedScores.experienceScore < 70) {
    suggestions.push("💼 Better align your work experience with the target role requirements");
    suggestions.push("🎯 Tailor each job description to highlight relevant responsibilities and achievements");
  }

  // Quantifiable Achievements
  if (detailedScores.quantifiableScore < 60) {
    suggestions.push("📊 Add specific metrics: percentages, dollar amounts, team sizes, project timelines");
    suggestions.push("📈 Transform responsibilities into quantifiable achievements (e.g., 'Improved performance by 25%')");
  }

  // Contact Information
  if (detailedScores.contactScore < 80) {
    suggestions.push("📞 Ensure complete contact info: professional email, phone, LinkedIn profile, location");
    suggestions.push("🔗 Add relevant portfolio links or GitHub profile for technical roles");
  }

  // Section Organization
  if (detailedScores.sectionScore < 70) {
    suggestions.push("📋 Include standard sections: Professional Summary, Work Experience, Skills, Education");
    suggestions.push("🏷️ Consider adding: Projects, Certifications, or Volunteer Experience if relevant");
  }

  // Education Enhancement
  if (detailedScores.educationScore < 70) {
    suggestions.push("🎓 Enhance education section with relevant coursework, projects, or GPA (if 3.5+)");
    suggestions.push("📜 List relevant certifications, training, or professional development");
  }

  // Role-specific suggestions
  const roleSpecificSuggestions = generateRoleSpecificSuggestions(atsResult.detectedRole, detailedScores);
  suggestions.push(...roleSpecificSuggestions);

  // Industry benchmark comparisons
  if (atsResult.atsScore < industryBenchmark.averageScore) {
    const gap = industryBenchmark.averageScore - atsResult.atsScore;
    suggestions.push(`📊 Your score is ${gap} points below industry average (${industryBenchmark.averageScore})`);
  }

  if (atsResult.atsScore < industryBenchmark.topTierThreshold) {
    suggestions.push(`🎯 Target score: ${industryBenchmark.topTierThreshold}+ to reach top-tier candidates`);
  }

  // Strengths reinforcement
  if (atsResult.strengths.length > 0) {
    suggestions.push(`💪 Strengths to maintain: ${atsResult.strengths.slice(0, 3).join(', ')}`);
  }

  // Advanced optimization tips
  if (atsResult.atsScore >= 70) {
    suggestions.push("🚀 Advanced tip: Use action verbs (managed, developed, implemented, optimized)");
    suggestions.push("🎨 Consider a subtle design element or professional template to stand out");
    suggestions.push("📝 Proofread for grammar and typos - use tools like Grammarly");
  }

  // ATS-specific recommendations
  suggestions.push("🤖 ATS-friendly tip: Avoid headers, footers, tables, and complex formatting");
  suggestions.push("📄 Save as both .docx and .pdf formats for different application systems");

  return suggestions.slice(0, 12); // Return top 12 most relevant suggestions
}

function generateRoleSpecificSuggestions(role: string, scores: any): string[] {
  const suggestions: string[] = [];

  switch (role) {
    case 'frontend':
    case 'Frontend Developer':
      if (scores.skillsMatch < 80) {
        suggestions.push("💻 Highlight modern frontend frameworks: React, Vue, Angular");
        suggestions.push("🎨 Mention responsive design, CSS preprocessors, and build tools");
        suggestions.push("📱 Include mobile-first design and accessibility experience");
      }
      suggestions.push("🔗 Include links to live projects or portfolio website");
      break;

    case 'backend':
    case 'Backend Developer':
      if (scores.skillsMatch < 80) {
        suggestions.push("⚙️ Emphasize server-side technologies, APIs, and database management");
        suggestions.push("☁️ Include cloud services experience (AWS, Azure, GCP)");
        suggestions.push("🔐 Mention security practices and performance optimization");
      }
      suggestions.push("📊 Highlight system architecture and scalability achievements");
      break;

    case 'fullstack':
    case 'Full Stack Developer':
      suggestions.push("🔄 Balance frontend and backend technologies equally");
      suggestions.push("🏗️ Emphasize end-to-end project ownership and full system understanding");
      break;

    case 'data':
    case 'Data Scientist':
      if (scores.skillsMatch < 80) {
        suggestions.push("📈 Highlight Python/R, SQL, and machine learning frameworks");
        suggestions.push("📊 Include data visualization tools and statistical analysis");
      }
      suggestions.push("🧮 Quantify impact of data-driven decisions and model performance");
      suggestions.push("🔬 Include research publications or data science competition results");
      break;

    case 'devops':
    case 'DevOps Engineer':
      if (scores.skillsMatch < 80) {
        suggestions.push("🐳 Emphasize containerization, orchestration, and CI/CD pipelines");
        suggestions.push("☁️ Highlight infrastructure as code and cloud platform expertise");
      }
      suggestions.push("⚡ Include system reliability and performance improvement metrics");
      break;

    case 'mobile':
    case 'Mobile Developer':
      suggestions.push("📱 Specify platform expertise: iOS (Swift), Android (Kotlin), or Cross-platform");
      suggestions.push("🏪 Mention App Store/Play Store publication experience");
      suggestions.push("🔄 Include offline capabilities, performance optimization experience");
      break;

    case 'ai-ml':
    case 'AI/ML Engineer':
      if (scores.skillsMatch < 80) {
        suggestions.push("🤖 Highlight deep learning frameworks: TensorFlow, PyTorch, Keras");
        suggestions.push("📚 Include NLP, computer vision, or specific AI domain expertise");
      }
      suggestions.push("📄 List research papers, patents, or open-source contributions");
      suggestions.push("🎯 Quantify model performance improvements and business impact");
      break;

    case 'cybersecurity':
      suggestions.push("🔒 Emphasize security frameworks, compliance standards, and threat analysis");
      suggestions.push("🏆 Include relevant certifications: CISSP, CEH, CISM");
      suggestions.push("🚨 Highlight incident response and vulnerability assessment experience");
      break;

    case 'product':
    case 'Product Manager':
      suggestions.push("📊 Include user research, A/B testing, and analytics experience");
      suggestions.push("🎯 Quantify product success metrics: user growth, revenue impact");
      suggestions.push("🤝 Emphasize cross-functional team leadership and stakeholder management");
      break;

    case 'design':
    case 'UI/UX Designer':
      suggestions.push("🎨 Include design tools expertise and portfolio link");
      suggestions.push("👥 Highlight user research and usability testing experience");
      suggestions.push("📐 Mention design systems and accessibility compliance");
      break;

    case 'qa':
    case 'QA Engineer':
      suggestions.push("🔍 Include both manual and automated testing experience");
      suggestions.push("🛠️ Highlight testing frameworks and CI/CD integration");
      suggestions.push("🐛 Quantify bug detection rates and quality improvements");
      break;
  }

  return suggestions;
}