import React, { useState } from 'react';
import { AnalysisResult, GapSeverity, SkillCategory } from '../types';
import { SKILL_CATEGORIES } from '../data/skills_catalog';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Brain,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  BarChart3,
  ShieldAlert,
  ListChecks,
  UserCheck
} from 'lucide-react';

interface GapScoreViewProps {
  analysis: AnalysisResult;
  onGenerateRoadmap: () => void;
}

export const GapScoreView: React.FC<GapScoreViewProps> = ({
  analysis,
  onGenerateRoadmap
}) => {
  const [activeGapTab, setActiveGapTab] = useState<'missing' | 'partial' | 'strong'>('missing');
  const [showReasoningTrace, setShowReasoningTrace] = useState<boolean>(true);
  const [expandedTraceStep, setExpandedTraceStep] = useState<number | null>(1);

  const { match_score, skill_gaps, partial_skills, strong_skills, reasoning_trace, gemini_insights } = analysis;

  const getSeverityBadge = (severity: GapSeverity) => {
    switch (severity) {
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase">High Priority Gap</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">Medium Gap</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">Minor Polish</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Step Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <span>Match Scoring & Gap Analysis Report</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              Audit Ready
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Transparent grading breakdown, fine-grained skill gaps, and explainable decision steps.
          </p>
        </div>
        <button
          onClick={onGenerateRoadmap}
          className="px-6 py-3 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center space-x-2 shadow-sm transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Generate Adaptive Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Top Cards Grid: Score Gauge & Grade Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Match Score Gauge Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between items-center text-center space-y-4 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-700 text-xs font-semibold">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Overall Skill Alignment Score</span>
          </div>

          <div className="relative flex items-center justify-center">
            {/* Circle Progress Gauge */}
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-100"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="currentColor"
                strokeWidth="10"
                className="text-indigo-600 transition-all duration-1000"
                fill="transparent"
                strokeDasharray="377"
                strokeDashoffset={377 - (377 * match_score.overall) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{match_score.overall}%</span>
              <span className="text-[10px] text-slate-500">Match Fit</span>
            </div>
          </div>

          <div className="px-4 py-1.5 rounded-full text-xs font-bold border bg-slate-100 text-slate-800 border-slate-200">
            Grade {match_score.grade} — {match_score.grade_label}
          </div>
        </div>

        {/* Stats & Domain Category Breakdown */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 md:col-span-2 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span>Domain Alignment Breakdown</span>
            </h3>
            <div className="flex items-center space-x-4 text-xs text-slate-500">
              <span>Strong: <strong className="text-emerald-700">{match_score.matched_skills}</strong></span>
              <span>Partial: <strong className="text-amber-700">{match_score.partial_skills}</strong></span>
              <span>Missing: <strong className="text-rose-700">{skill_gaps.length}</strong></span>
            </div>
          </div>

          {/* Domain Progress Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SKILL_CATEGORIES.map(cat => {
              const val = match_score.breakdown[cat.id] ?? 100;
              return (
                <div key={cat.id} className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium truncate">{cat.label}</span>
                    <span className="font-mono text-slate-600 text-[11px] font-semibold">{val}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        val >= 80 ? 'bg-emerald-600' : val >= 55 ? 'bg-amber-600' : 'bg-rose-600'
                      }`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gemini AI Deep Semantic Analysis (If Available) */}
      {gemini_insights && (
        <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Gemini Deep Semantic Insights</h3>
              <p className="text-xs text-slate-600">AI-generated onboarding strategy, interview questions, and risks assessment</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 bg-white p-4 rounded-xl border border-indigo-200/80 leading-relaxed font-sans shadow-sm">
            "{gemini_insights.summary}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Candidate Key Strengths */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 shadow-sm">
              <h4 className="text-xs font-bold text-emerald-700 flex items-center space-x-1.5 uppercase tracking-wider">
                <UserCheck className="w-4 h-4" />
                <span>Core Strengths</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {gemini_insights.topStrengths.map((str, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Critical Risks & Onboarding Tips */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 shadow-sm">
              {skill_gaps.length === 0 ? (
                <>
                  <h4 className="text-xs font-bold text-emerald-700 flex items-center space-x-1.5 uppercase tracking-wider">
                    <UserCheck className="w-4 h-4" />
                    <span>Critical Onboarding Risks</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>No critical technical risks identified; candidate meets 100% of required job skills.</span>
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <h4 className="text-xs font-bold text-rose-700 flex items-center space-x-1.5 uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Critical Onboarding Risks</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {gemini_insights.criticalRisks.map((risk, i) => {
                      const isNoRisk = risk.toLowerCase().includes('no critical') || risk.toLowerCase().includes('meets 100%');
                      return (
                        <li key={i} className="flex items-start space-x-2">
                          {isNoRisk ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          )}
                          <span className={isNoRisk ? 'text-emerald-800' : ''}>{risk}</span>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Recommended Technical Interview Questions */}
          {gemini_insights.interviewQuestions?.length > 0 && (
            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-purple-700 flex items-center space-x-1.5 uppercase tracking-wider">
                <ListChecks className="w-4 h-4" />
                <span>Recommended Technical Interview & Verification Questions</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gemini_insights.interviewQuestions.map((iq, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-1 text-xs">
                    <div className="flex items-center justify-between text-indigo-700 font-semibold text-[11px]">
                      <span>Target Skill: {iq.targetSkill}</span>
                    </div>
                    <p className="text-slate-800 font-medium">"{iq.question}"</p>
                    <p className="text-[11px] text-slate-500 italic">Goal: {iq.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabbed Skill Gap Classifier */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <h3 className="text-sm font-semibold text-slate-900">Classified Skill Fit & Gap Breakdown</h3>
          <div className="flex p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs">
            <button
              onClick={() => setActiveGapTab('missing')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
                activeGapTab === 'missing' ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Missing Gaps ({skill_gaps.length})</span>
            </button>
            <button
              onClick={() => setActiveGapTab('partial')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
                activeGapTab === 'partial' ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Partial Skills ({partial_skills.length})</span>
            </button>
            <button
              onClick={() => setActiveGapTab('strong')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1.5 ${
                activeGapTab === 'strong' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Strong Skills ({strong_skills.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeGapTab === 'missing' && (
          <div className="space-y-3">
            {skill_gaps.length === 0 ? (
              <p className="text-xs text-slate-500 p-4 text-center">No critical skill gaps detected! Candidate meets all required job criteria.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skill_gaps.map((gap, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{gap.name}</h4>
                        <span className="text-[11px] text-slate-500">
                          Domain: {SKILL_CATEGORIES.find(c => c.id === gap.category)?.label}
                        </span>
                      </div>
                      {getSeverityBadge(gap.gap_severity)}
                    </div>
                    {gap.description && <p className="text-[11px] text-slate-600 line-clamp-2">{gap.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeGapTab === 'partial' && (
          <div className="space-y-3">
            {partial_skills.length === 0 ? (
              <p className="text-xs text-slate-500 p-4 text-center">No partial skill mentions detected.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {partial_skills.map((skill, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{skill.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Confidence {Math.round(skill.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">Needs polish or deeper context mention in resume.</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeGapTab === 'strong' && (
          <div className="space-y-3">
            {strong_skills.length === 0 ? (
              <p className="text-xs text-slate-500 p-4 text-center">No strong skill matches found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {strong_skills.map((skill, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{skill.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {Math.round(skill.confidence * 100)}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">High confidence qualification confirmed in resume.</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Explainable AI Reasoning Trace Collapsible Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
        <button
          onClick={() => setShowReasoningTrace(!showReasoningTrace)}
          className="w-full flex items-center justify-between text-left text-sm font-semibold text-slate-900"
        >
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-indigo-600" />
            <span>Explainable AI Reasoning Trace (Chain-of-Thought Audit Log)</span>
          </div>
          {showReasoningTrace ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {showReasoningTrace && (
          <div className="space-y-3 pt-2">
            <p className="text-xs text-slate-500 mb-2">
              Transparent, non-black-box decision log documenting each execution phase:
            </p>
            {reasoning_trace.steps.map((step) => {
              const isExpanded = expandedTraceStep === step.step;
              return (
                <div key={step.step} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <button
                    onClick={() => setExpandedTraceStep(isExpanded ? null : step.step)}
                    className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                        {step.step}
                      </span>
                      <span className="font-semibold text-slate-900">{step.title}</span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                  </button>

                  {isExpanded && (
                    <div className="p-3 pt-0 border-t border-slate-200 space-y-2 bg-white">
                      <p className="text-slate-700 italic pt-2">"{step.reasoning}"</p>
                      <ul className="space-y-1 list-disc list-inside text-slate-600 text-[11px]">
                        {step.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 font-mono">
              <strong>Audit Conclusion:</strong> {reasoning_trace.conclusion}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
