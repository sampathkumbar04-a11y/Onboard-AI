import { SKILLS_CATALOG } from '../data/skills_catalog';
import { getResourcesForSkill } from '../data/learning_resources';
import {
  AnalysisResult,
  ExtractedSkill,
  GapSeverity,
  LearningStyle,
  MatchScore,
  PersonalizedRoadmap,
  ReasoningStep,
  ReasoningTrace,
  RoadmapPhase,
  SkillCategory,
  SkillGap,
  SkillLevel
} from '../types';

/**
 * Normalizes text for robust regex matching
 */
export function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^\w\s+#.-]/g, ' ');
}

/**
 * Contextual booster words indicating high proficiency
 */
const PROFICIENCY_BOOSTERS = [
  'proficient', 'expert', 'master', 'advanced', 'lead', 'architected', 'spearheaded',
  '5+ years', '3+ years', 'experienced', 'strong knowledge', 'competency', 'senior', 'deep understanding'
];

/**
 * Extracts skills from text using word-boundary regex & alias catalog
 */
export function extractSkills(rawText: string): ExtractedSkill[] {
  if (!rawText || !rawText.trim()) return [];

  const normalized = normalizeText(rawText);
  const extracted: ExtractedSkill[] = [];

  for (const skill of SKILLS_CATALOG) {
    let bestMatchTerm = '';
    let totalOccurrences = 0;
    let hasProficiencyBoost = false;

    for (const alias of skill.aliases) {
      // Escape special regex chars like c++, .net
      const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Create word boundary regex
      const regex = new RegExp(`(?:^|\\s|[.,;()/-])${escapedAlias}(?:$|\\s|[.,;()/-])`, 'gi');
      const matches = normalized.match(regex);

      if (matches && matches.length > 0) {
        if (!bestMatchTerm) bestMatchTerm = alias;
        totalOccurrences += matches.length;

        // Check proximity to booster words
        for (const booster of PROFICIENCY_BOOSTERS) {
          if (normalized.includes(booster) && normalized.indexOf(booster) < normalized.indexOf(alias) + 100) {
            hasProficiencyBoost = true;
            break;
          }
        }
      }
    }

    if (totalOccurrences > 0) {
      // Base confidence formula: 0.5 + 0.1 * frequency, capped at 1.0
      let confidence = Math.min(1.0, 0.5 + totalOccurrences * 0.1);
      if (hasProficiencyBoost) {
        confidence = Math.min(1.0, confidence + 0.15);
      }
      confidence = Math.round(confidence * 100) / 100;

      extracted.push({
        name: skill.name,
        category: skill.category,
        level: skill.level,
        confidence,
        matched_term: bestMatchTerm,
        frequency: totalOccurrences,
        description: skill.description
      });
    }
  }

  return extracted;
}

/**
 * Conducts fine-grained Gap Analysis between Resume and JD skills
 */
export function analyzeGaps(
  resumeSkills: ExtractedSkill[],
  jdSkills: ExtractedSkill[]
): {
  strong_skills: ExtractedSkill[];
  partial_skills: ExtractedSkill[];
  skill_gaps: SkillGap[];
} {
  const resumeSkillMap = new Map<string, ExtractedSkill>();
  resumeSkills.forEach(s => resumeSkillMap.set(s.name.toLowerCase(), s));

  const strong_skills: ExtractedSkill[] = [];
  const partial_skills: ExtractedSkill[] = [];
  const skill_gaps: SkillGap[] = [];

  // Categorize JD required skills
  for (const jdSkill of jdSkills) {
    const key = jdSkill.name.toLowerCase();
    const resumeSkill = resumeSkillMap.get(key);

    if (resumeSkill) {
      if (resumeSkill.confidence >= 0.6) {
        strong_skills.push(resumeSkill);
      } else {
        partial_skills.push(resumeSkill);
      }
    } else {
      // Missing skill gap
      let gap_severity: GapSeverity = 'medium';
      let priority = 2;

      if (jdSkill.level === 'expert') {
        gap_severity = 'high';
        priority = 1;
      } else if (jdSkill.level === 'beginner') {
        gap_severity = 'low';
        priority = 3;
      }

      skill_gaps.push({
        name: jdSkill.name,
        category: jdSkill.category,
        level: jdSkill.level,
        confidence: jdSkill.confidence,
        matched_term: jdSkill.matched_term,
        gap_severity,
        priority,
        missing_in: 'resume',
        description: jdSkill.description
      });
    }
  }

  // Sort gaps by priority (1 is highest)
  skill_gaps.sort((a, b) => a.priority - b.priority);

  return { strong_skills, partial_skills, skill_gaps };
}

/**
 * Calculates weighted match score and maps to letter grade
 */
export function calculateScore(
  strongSkills: ExtractedSkill[],
  partialSkills: ExtractedSkill[],
  jdSkills: ExtractedSkill[]
): MatchScore {
  const totalRequired = jdSkills.length;
  if (totalRequired === 0) {
    return {
      overall: 0,
      grade: 'F',
      breakdown: {
        programming_languages: 0,
        web_frameworks: 0,
        databases: 0,
        cloud_devops: 0,
        data_engineering: 0,
        machine_learning_ai: 0,
        soft_skills: 0
      },
      matched_skills: 0,
      partial_skills: 0,
      total_required: 0,
      grade_label: 'Low Alignment',
      grade_color: 'bg-red-500/10 text-red-400 border-red-500/20'
    };
  }

  const strongCount = strongSkills.length;
  const partialCount = partialSkills.length;

  // Weighted score formula: (Strong + 0.5 * Partial) / Total * 100
  const rawScore = ((strongCount + 0.5 * partialCount) / totalRequired) * 100;
  const overall = Math.min(100, Math.round(rawScore * 10) / 10);

  // Category breakdown
  const categoryTotals: Record<SkillCategory, number> = {
    programming_languages: 0,
    web_frameworks: 0,
    databases: 0,
    cloud_devops: 0,
    data_engineering: 0,
    machine_learning_ai: 0,
    soft_skills: 0
  };
  const categoryMatched: Record<SkillCategory, number> = { ...categoryTotals };

  for (const s of jdSkills) {
    categoryTotals[s.category] = (categoryTotals[s.category] || 0) + 1;
  }

  for (const s of strongSkills) {
    categoryMatched[s.category] = (categoryMatched[s.category] || 0) + 1;
  }
  for (const s of partialSkills) {
    categoryMatched[s.category] = (categoryMatched[s.category] || 0) + 0.5;
  }

  const breakdown: Record<SkillCategory, number> = { ...categoryTotals };
  for (const cat in categoryTotals) {
    const key = cat as SkillCategory;
    if (categoryTotals[key] > 0) {
      breakdown[key] = Math.round((categoryMatched[key] / categoryTotals[key]) * 100);
    } else {
      breakdown[key] = 100; // Not required in JD
    }
  }

  // Grade mapping
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let grade_label = 'Low Alignment';
  let grade_color = 'bg-red-500/10 text-red-400 border-red-500/20';

  if (overall >= 90) {
    grade = 'A+';
    grade_label = 'Outstanding Alignment';
    grade_color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (overall >= 80) {
    grade = 'A';
    grade_label = 'Excellent Match';
    grade_color = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (overall >= 70) {
    grade = 'B';
    grade_label = 'Strong Candidate';
    grade_color = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  } else if (overall >= 55) {
    grade = 'C';
    grade_label = 'Moderate Match (Focused Upskilling)';
    grade_color = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if (overall >= 40) {
    grade = 'D';
    grade_label = 'Significant Skill Gaps';
    grade_color = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
  }

  return {
    overall,
    grade,
    breakdown,
    matched_skills: strongCount,
    partial_skills: partialCount,
    total_required: totalRequired,
    grade_label,
    grade_color
  };
}

/**
 * Generates an explainable Chain-of-Thought (CoT) reasoning audit trace
 */
export function generateReasoningTrace(
  resumeSkills: ExtractedSkill[],
  jdSkills: ExtractedSkill[],
  gaps: SkillGap[],
  score: MatchScore
): ReasoningTrace {
  const steps: ReasoningStep[] = [
    {
      step: 1,
      title: 'Resume & Job Description Skill Extraction',
      reasoning: `Scanned text against 60+ industry skills taxonomy with word-boundary regex patterns.`,
      details: [
        `Identified ${resumeSkills.length} total skill mentions in Candidate Resume.`,
        `Identified ${jdSkills.length} required skills in target Job Description.`,
        `Extracted domains: ${Array.from(new Set(jdSkills.map(s => s.category))).join(', ')}.`
      ]
    },
    {
      step: 2,
      title: 'Context Confidence & Qualification Scoring',
      reasoning: `Evaluated skill occurrences and contextual boosters (e.g. 'proficient', '5+ years', 'architected').`,
      details: [
        `Assigned base confidence formula: 0.5 + 0.1 * frequency + proficiency boost (up to 1.0).`,
        `Skills with confidence >= 0.6 classified as Strong.`,
        `Skills with confidence < 0.6 classified as Partial context mentions.`
      ]
    },
    {
      step: 3,
      title: 'Skill Gap Prioritization',
      reasoning: `Contrasted candidate profile against required JD skills to isolate critical gaps.`,
      details: [
        `Detected ${gaps.length} missing required skills.`,
        `High Priority (Expert JD requirements): ${gaps.filter(g => g.gap_severity === 'high').map(g => g.name).join(', ') || 'None'}.`,
        `Medium Priority (Intermediate requirements): ${gaps.filter(g => g.gap_severity === 'medium').map(g => g.name).join(', ') || 'None'}.`
      ]
    },
    {
      step: 4,
      title: 'Weighted Alignment Scoring',
      reasoning: `Calculated total match score using weighted formula: (Strong + 0.5 * Partial) / Total Required.`,
      details: [
        `Strong Matches (${score.matched_skills}) + Partial Matches (${score.partial_skills} * 0.5) = ${score.matched_skills + score.partial_skills * 0.5} credit points.`,
        `Total Required Skills: ${score.total_required}.`,
        `Overall Calculated Fit Score: ${score.overall}% -> Letter Grade ${score.grade} (${score.grade_label}).`
      ]
    },
    {
      step: 5,
      title: 'Onboarding Pipeline Decision',
      reasoning: `Mapped findings to actionable onboarding recommendation.`,
      details: [
        score.overall >= 70
          ? `Candidate possesses strong core competencies. Fast-track onboarding focusing on specific gap items.`
          : `Candidate requires structured week-by-week upskilling plan to bridge target technical gaps.`
      ]
    }
  ];

  return {
    total_steps: steps.length,
    steps,
    conclusion: `Analysis complete. Calculated ${score.overall}% match (Grade ${score.grade}). ${gaps.length} gap items identified for adaptive onboarding plan.`
  };
}

/**
 * Generates dynamic week-by-week personalized onboarding roadmap
 */
export function generateRoadmap(
  gaps: SkillGap[],
  partialSkills: ExtractedSkill[],
  timelineWeeks: number = 8,
  learningStyle: LearningStyle = 'balanced'
): PersonalizedRoadmap {
  const allGapItems = [
    ...gaps.map(g => ({ name: g.name, category: g.category, severity: g.gap_severity, level: g.level })),
    ...partialSkills.map(p => ({ name: p.name, category: p.category, severity: 'low' as GapSeverity, level: p.level }))
  ];

  if (allGapItems.length === 0) {
    return {
      roadmap: [],
      total_weeks: timelineWeeks,
      learning_style: learningStyle,
      skill_gaps_addressed: [],
      partial_skills_improved: []
    };
  }

  // Sort high severity gaps first
  allGapItems.sort((a, b) => (a.severity === 'high' ? -1 : 1));

  const totalItems = allGapItems.length;
  const weeksPerSkill = Math.max(1, Math.floor(timelineWeeks / totalItems));

  const roadmap: RoadmapPhase[] = [];
  let currentWeek = 1;

  allGapItems.forEach((item, index) => {
    const isLast = index === allGapItems.length - 1;
    const duration = isLast ? Math.max(1, timelineWeeks - currentWeek + 1) : (item.severity === 'high' ? Math.max(2, weeksPerSkill) : weeksPerSkill);
    const week_start = currentWeek;
    const week_end = Math.min(timelineWeeks, currentWeek + duration - 1);

    const resources = getResourcesForSkill(item.name, learningStyle);

    const learning_objectives = [
      `Understand fundamental concepts and architecture of ${item.name}`,
      `Complete hands-on exercises and practical tutorials for ${item.name}`,
      `Build a miniproject or functional integration incorporating ${item.name}`,
      `Review best practices and validate competency with a code evaluation`
    ];

    const milestones = [
      {
        id: `m-${index}-1`,
        week: week_start,
        milestone: `Complete core study modules & setup environment for ${item.name}`,
        completed: false
      },
      {
        id: `m-${index}-2`,
        week: week_end,
        milestone: `Deliver functional sample project or code submission for ${item.name}`,
        completed: false
      }
    ];

    roadmap.push({
      phase: index + 1,
      skill: item.name,
      category: item.category,
      week_start,
      week_end,
      gap_severity: item.severity,
      learning_objectives,
      resources,
      milestones
    });

    currentWeek = week_end + 1;
  });

  return {
    roadmap,
    total_weeks: timelineWeeks,
    learning_style: learningStyle,
    skill_gaps_addressed: gaps.map(g => g.name),
    partial_skills_improved: partialSkills.map(p => p.name)
  };
}

/**
 * Main full analysis entry point
 */
export function runFullAnalysis(
  resumeText: string,
  jdText: string
): AnalysisResult {
  const resume_skills = extractSkills(resumeText);
  const jd_skills = extractSkills(jdText);

  const { strong_skills, partial_skills, skill_gaps } = analyzeGaps(resume_skills, jd_skills);
  const match_score = calculateScore(strong_skills, partial_skills, jd_skills);
  const reasoning_trace = generateReasoningTrace(resume_skills, jd_skills, skill_gaps, match_score);

  // Grounded local insights generated strictly from extracted data
  const gemini_insights = {
    summary: match_score.overall === 100
      ? `Candidate demonstrates outstanding 100% fit across all required skills identified in the target job description.`
      : `Candidate achieves a ${match_score.overall}% alignment score (Grade ${match_score.grade}) with ${skill_gaps.length} missing skill gap(s) identified for targeted onboarding.`,
    topStrengths: strong_skills.length > 0
      ? strong_skills.slice(0, 4).map(s => `Strong verified proficiency in ${s.name}`)
      : ['General technical background'],
    criticalRisks: skill_gaps.length > 0
      ? skill_gaps.map(g => `Missing requirement: ${g.name} (${g.gap_severity} priority gap)`)
      : ['No critical technical risks identified; candidate meets 100% of required job skills.'],
    interviewQuestions: skill_gaps.length > 0
      ? skill_gaps.slice(0, 3).map(g => ({
          question: `Can you explain your experience or conceptual understanding of ${g.name}?`,
          targetSkill: g.name,
          purpose: `Verify practical experience and readiness to learn ${g.name}`
        }))
      : strong_skills.slice(0, 2).map(s => ({
          question: `How have you applied ${s.name} in complex production architectures?`,
          targetSkill: s.name,
          purpose: `Validate senior-level depth and technical leadership in ${s.name}`
        })),
    onboardingTips: skill_gaps.length > 0
      ? [`Prioritize learning module for ${skill_gaps[0].name} in initial onboarding weeks.`]
      : ['Fast-track onboarding with standard team orientation and project assignments.']
  };

  return {
    resume_skills,
    jd_skills,
    skill_gaps,
    partial_skills,
    strong_skills,
    match_score,
    reasoning_trace,
    gemini_insights
  };
}
