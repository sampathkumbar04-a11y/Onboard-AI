export type SkillCategory =
  | 'programming_languages'
  | 'web_frameworks'
  | 'databases'
  | 'cloud_devops'
  | 'data_engineering'
  | 'machine_learning_ai'
  | 'soft_skills';

export type SkillLevel = 'beginner' | 'intermediate' | 'expert';

export type GapSeverity = 'high' | 'medium' | 'low' | 'none';

export type LearningStyle = 'balanced' | 'hands-on' | 'visual' | 'reading';

export interface CatalogSkill {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  aliases: string[];
  description: string;
}

export interface ExtractedSkill {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  confidence: number;
  matched_term: string;
  frequency: number;
  description?: string;
}

export interface SkillGap {
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  confidence: number;
  matched_term: string;
  gap_severity: GapSeverity;
  priority: number;
  missing_in: 'resume' | 'underqualified';
  description?: string;
}

export interface MatchScore {
  overall: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: Record<SkillCategory, number>;
  matched_skills: number;
  partial_skills: number;
  total_required: number;
  grade_label: string;
  grade_color: string;
}

export interface ReasoningStep {
  step: number;
  title: string;
  reasoning: string;
  details: string[];
}

export interface ReasoningTrace {
  total_steps: number;
  steps: ReasoningStep[];
  conclusion: string;
}

export interface LearningResource {
  name: string;
  url: string;
  type: 'course' | 'video' | 'documentation' | 'article' | 'project' | 'lab' | 'book';
  provider?: string;
  difficulty?: string;
}

export interface RoadmapMilestone {
  id: string;
  week: number;
  milestone: string;
  completed: boolean;
}

export interface RoadmapPhase {
  phase: number;
  skill: string;
  category: SkillCategory;
  week_start: number;
  week_end: number;
  gap_severity: GapSeverity;
  learning_objectives: string[];
  resources: LearningResource[];
  milestones: RoadmapMilestone[];
}

export interface PersonalizedRoadmap {
  roadmap: RoadmapPhase[];
  total_weeks: number;
  learning_style: LearningStyle;
  skill_gaps_addressed: string[];
  partial_skills_improved: string[];
}

export interface GeminiInsights {
  summary: string;
  topStrengths: string[];
  criticalRisks: string[];
  interviewQuestions: { question: string; targetSkill: string; purpose: string }[];
  onboardingTips: string[];
}

export interface AnalysisResult {
  resume_skills: ExtractedSkill[];
  jd_skills: ExtractedSkill[];
  skill_gaps: SkillGap[];
  partial_skills: ExtractedSkill[];
  strong_skills: ExtractedSkill[];
  match_score: MatchScore;
  reasoning_trace: ReasoningTrace;
  gemini_insights?: GeminiInsights;
}

export interface SampleDataset {
  id: string;
  title: string;
  role: string;
  description: string;
  resume: string;
  jd: string;
}
