import React, { useState, useEffect } from 'react';
import { AnalysisResult, LearningStyle, PersonalizedRoadmap } from '../types';
import { generateRoadmap } from '../utils/engine';
import { SKILL_CATEGORIES } from '../data/skills_catalog';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import {
  Calendar,
  BookOpen,
  Code,
  Video,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  Sparkles,
  Layers,
  Award,
  Filter,
  Zap,
  FileDown
} from 'lucide-react';

interface RoadmapViewProps {
  analysis: AnalysisResult;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ analysis }) => {
  const [timelineWeeks, setTimelineWeeks] = useState<number>(8);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('balanced');
  const [roadmapData, setRoadmapData] = useState<PersonalizedRoadmap | null>(null);

  // Track completed milestone IDs
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const generated = generateRoadmap(
      analysis.skill_gaps,
      analysis.partial_skills,
      timelineWeeks,
      learningStyle
    );
    setRoadmapData(generated);
  }, [analysis, timelineWeeks, learningStyle]);

  const toggleMilestone = (id: string) => {
    setCompletedMilestones(prev => {
      const next = { ...prev, [id]: !prev[id] };
      // Check total completion for celebration
      if (roadmapData) {
        const allMilestoneIds = roadmapData.roadmap.flatMap(p => p.milestones.map(m => m.id));
        const completedCount = allMilestoneIds.filter(mid => next[mid]).length;
        if (completedCount === allMilestoneIds.length && allMilestoneIds.length > 0) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
      return next;
    });
  };

  const getStyleIcon = (style: LearningStyle) => {
    switch (style) {
      case 'visual': return <Video className="w-4 h-4 text-pink-400" />;
      case 'reading': return <FileText className="w-4 h-4 text-emerald-400" />;
      case 'hands-on': return <Code className="w-4 h-4 text-indigo-400" />;
      default: return <BookOpen className="w-4 h-4 text-amber-400" />;
    }
  };

  const exportPDF = () => {
    if (!roadmapData) return;
    const doc = new jsPDF();
    let y = 15;

    const checkPage = (heightNeeded: number) => {
      if (y + heightNeeded > 275) {
        doc.addPage();
        y = 15;
      }
    };

    // Header Banner
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(14, y, 182, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ADAPTIVE ONBOARDING ROADMAP REPORT', 20, y + 10);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const candidateName = analysis.candidate_name || 'Candidate';
    const targetRole = analysis.target_role || 'Target Role';
    doc.text(`Candidate: ${candidateName}  |  Role: ${targetRole}  |  Match Fit: ${analysis.match_score.overall}%`, 20, y + 17);

    y += 30;

    // Summary Box
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Roadmap Configuration Overview:', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Timeline Duration: ${timelineWeeks} Weeks   |   Learning Mode: ${learningStyle.toUpperCase()}   |   Total Skill Phases: ${roadmapData.roadmap.length}`, 14, y + 5);

    y += 15;

    // Phases
    roadmapData.roadmap.forEach((phase) => {
      checkPage(40);

      // Phase Header Box
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(14, y, 182, 10, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(`Phase ${phase.phase}: ${phase.skill} (Weeks ${phase.week_start} - ${phase.week_end})`, 18, y + 7);

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      const catLabel = SKILL_CATEGORIES.find(c => c.id === phase.category)?.label || phase.category;
      doc.text(`Domain: ${catLabel} | Priority: ${phase.gap_severity.toUpperCase()}`, 125, y + 7);

      y += 15;

      // Objectives
      checkPage(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(67, 56, 202);
      doc.text('Learning Objectives:', 16, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      phase.learning_objectives.forEach(obj => {
        checkPage(8);
        const lines = doc.splitTextToSize(`• ${obj}`, 175);
        doc.text(lines, 18, y);
        y += lines.length * 4.5;
      });

      y += 3;

      // Milestones
      checkPage(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(4, 120, 87);
      doc.text('Weekly Check-in Milestones:', 16, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      phase.milestones.forEach(m => {
        checkPage(8);
        const isChecked = completedMilestones[m.id];
        const statusStr = isChecked ? '[DONE]' : '[PENDING]';
        const lines = doc.splitTextToSize(`${statusStr} Week ${m.week}: ${m.milestone}`, 18);
        doc.text(lines, 18, y);
        y += lines.length * 4.5;
      });

      y += 3;

      // Resources
      checkPage(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(126, 34, 206);
      doc.text('Recommended Resources:', 16, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      phase.resources.forEach(r => {
        checkPage(8);
        const lines = doc.splitTextToSize(`- ${r.name} (${r.type}): ${r.url}`, 175);
        doc.text(lines, 18, y);
        y += lines.length * 4.5;
      });

      y += 10;
    });

    // Download PDF
    doc.save(`onboarding-roadmap-${timelineWeeks}weeks.pdf`);
  };

  const exportText = () => {
    if (!roadmapData) return;
    let text = `🎯 PERSONALIZED ONBOARDING ROADMAP (${roadmapData.total_weeks} WEEKS)\n`;
    text += `Learning Style: ${roadmapData.learning_style.toUpperCase()}\n`;
    text += `========================================================\n\n`;

    roadmapData.roadmap.forEach((phase) => {
      text += `PHASE ${phase.phase}: ${phase.skill.toUpperCase()} (Weeks ${phase.week_start}-${phase.week_end})\n`;
      text += `Objectives:\n`;
      phase.learning_objectives.forEach(obj => text += `  • ${obj}\n`);
      text += `Milestones:\n`;
      phase.milestones.forEach(m => text += `  [ ] Week ${m.week}: ${m.milestone}\n`);
      text += `Resources:\n`;
      phase.resources.forEach(r => text += `  - ${r.name} (${r.type}): ${r.url}\n`);
      text += `\n--------------------------------------------------------\n\n`;
    });

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onboarding-roadmap-${timelineWeeks}weeks.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!roadmapData) return null;

  const allMilestones = roadmapData.roadmap.flatMap(p => p.milestones);
  const completedCount = allMilestones.filter(m => completedMilestones[m.id]).length;
  const progressPercent = allMilestones.length > 0 ? Math.round((completedCount / allMilestones.length) * 100) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <span>Adaptive Week-by-Week Learning Roadmap</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Personalized Plan
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic timeline mapping, resource filtering by learning style, and milestone progress tracker.
          </p>
        </div>

        {/* Download & Export Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={exportPDF}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm flex items-center space-x-1.5 transition"
          >
            <FileDown className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={exportText}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-1.5 transition shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Export Summary</span>
          </button>
        </div>
      </div>

      {/* Control Toolbar: Timeline Duration & Learning Style Picker */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm">
        {/* Duration Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-800 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Target Onboarding Timeline Duration</span>
            </label>
            <span className="text-xs font-bold text-indigo-700 font-mono bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {timelineWeeks} Weeks
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={16}
            step={2}
            value={timelineWeeks}
            onChange={(e) => setTimelineWeeks(Number(e.target.value))}
            className="w-full accent-indigo-600 bg-slate-200 rounded-lg cursor-pointer h-2"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>4 Weeks (Sprint)</span>
            <span>8 Weeks (Standard)</span>
            <span>12 Weeks (Deep)</span>
            <span>16 Weeks (Mastery)</span>
          </div>
        </div>

        {/* Learning Style Picker */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 flex items-center space-x-1.5">
            <Filter className="w-4 h-4 text-purple-600" />
            <span>Preferred Learning Style & Resource Filter</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'balanced', label: 'Balanced' },
              { id: 'hands-on', label: 'Hands-on' },
              { id: 'visual', label: 'Visual' },
              { id: 'reading', label: 'Reading' },
            ].map((style) => {
              const isActive = learningStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => setLearningStyle(style.id as LearningStyle)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition border flex items-center justify-center space-x-1.5 ${
                    isActive
                      ? 'bg-purple-50 border-purple-300 text-purple-800 shadow-sm font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {getStyleIcon(style.id as LearningStyle)}
                  <span>{style.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress Tracker Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Onboarding Milestone Progress</h3>
            <p className="text-xs text-slate-500">
              Completed {completedCount} of {allMilestones.length} weekly check-ins
            </p>
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-1">
          <div className="flex justify-between text-xs font-mono font-semibold">
            <span className="text-slate-500">Completion</span>
            <span className="text-emerald-700">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timeline Phases List */}
      <div className="space-y-6">
        {roadmapData.roadmap.length === 0 ? (
          <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center text-slate-500 text-xs shadow-sm">
            No gaps detected to populate roadmap.
          </div>
        ) : (
          roadmapData.roadmap.map((phase) => (
            <div
              key={phase.phase}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 hover:border-indigo-200 transition shadow-sm"
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-extrabold text-sm shadow-sm">
                    P{phase.phase}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-slate-900">{phase.skill}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {SKILL_CATEGORIES.find(c => c.id === phase.category)?.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center space-x-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Weeks {phase.week_start} to {phase.week_end} ({phase.week_end - phase.week_start + 1} Week Focus)</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold border uppercase ${
                    phase.gap_severity === 'high'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {phase.gap_severity} Priority Gap
                  </span>
                </div>
              </div>

              {/* Learning Objectives & Milestones Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Core Objectives */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Learning Objectives</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {phase.learning_objectives.map((obj, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Milestone Checklists */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Weekly Milestones</span>
                  </h4>
                  <div className="space-y-2">
                    {phase.milestones.map((m) => {
                      const isChecked = !!completedMilestones[m.id];
                      return (
                        <label
                          key={m.id}
                          className={`flex items-start space-x-2.5 p-2 rounded-lg text-xs cursor-pointer transition border ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleMilestone(m.id)}
                            className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-0"
                          />
                          <span className={isChecked ? 'line-through text-slate-400' : ''}>
                            Week {m.week}: {m.milestone}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recommended Resources List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 uppercase tracking-wider">
                    {getStyleIcon(learningStyle)}
                    <span>Filtered Learning Resources ({learningStyle.toUpperCase()} Mode)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Showing {phase.resources.length} {learningStyle === 'visual' ? 'video courses' : learningStyle === 'reading' ? 'documentation & guides' : learningStyle === 'hands-on' ? 'GitHub projects & labs' : 'curated resources'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {phase.resources.map((res, i) => {
                    const isGitHub = res.url.includes('github.com') || res.type === 'project' || res.type === 'lab';
                    const isVideo = res.type === 'video';
                    const isDoc = res.type === 'documentation' || res.type === 'article' || res.type === 'book';

                    return (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`bg-white border p-3.5 rounded-xl transition flex flex-col justify-between space-y-2.5 text-xs group shadow-sm ${
                          isVideo
                            ? 'border-pink-200 hover:border-pink-300 hover:bg-pink-50/20'
                            : isGitHub
                            ? 'border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50/20'
                            : 'border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/20'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border flex items-center space-x-1 ${
                              isVideo
                                ? 'bg-pink-50 text-pink-700 border-pink-200'
                                : isGitHub
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {isVideo && <Video className="w-2.5 h-2.5 mr-0.5" />}
                              {isGitHub && <Code className="w-2.5 h-2.5 mr-0.5" />}
                              {isDoc && <FileText className="w-2.5 h-2.5 mr-0.5" />}
                              <span>{isGitHub ? 'GitHub Project' : res.type}</span>
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition" />
                          </div>
                          <h5 className="font-semibold text-slate-800 group-hover:text-indigo-700 transition line-clamp-2 leading-snug">
                            {res.name}
                          </h5>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100 pt-2">
                          <span className="font-medium">{res.provider || (isGitHub ? 'GitHub Repository' : 'Web Reference')}</span>
                          {isGitHub && <span className="text-indigo-600 font-mono text-[9px] font-bold">git clone</span>}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
