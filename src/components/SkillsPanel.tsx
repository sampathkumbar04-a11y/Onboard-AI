import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/skills_catalog';
import { ExtractedSkill, SkillCategory } from '../types';
import { Search, Filter, Code, Globe, Database, Cloud, Layers, Cpu, Users, ArrowRight, Sparkles } from 'lucide-react';

interface SkillsPanelProps {
  resumeSkills: ExtractedSkill[];
  jdSkills: ExtractedSkill[];
  onContinue: () => void;
}

export const SkillsPanel: React.FC<SkillsPanelProps> = ({
  resumeSkills,
  jdSkills,
  onContinue
}) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'jd'>('resume');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentSkills = activeTab === 'resume' ? resumeSkills : jdSkills;

  const filteredSkills = currentSkills.filter(skill => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          skill.matched_term.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (catId: SkillCategory) => {
    switch (catId) {
      case 'programming_languages': return <Code className="w-3.5 h-3.5" />;
      case 'web_frameworks': return <Globe className="w-3.5 h-3.5" />;
      case 'databases': return <Database className="w-3.5 h-3.5" />;
      case 'cloud_devops': return <Cloud className="w-3.5 h-3.5" />;
      case 'data_engineering': return <Layers className="w-3.5 h-3.5" />;
      case 'machine_learning_ai': return <Cpu className="w-3.5 h-3.5" />;
      case 'soft_skills': return <Users className="w-3.5 h-3.5" />;
      default: return <Code className="w-3.5 h-3.5" />;
    }
  };

  const getCategoryColor = (catId: SkillCategory) => {
    const found = SKILL_CATEGORIES.find(c => c.id === catId);
    return found ? found.color : 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <span>Extracted Skill Inventory</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Domain Skill Catalog
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review skills extracted from candidate resume vs target job description across 7 industry domains.
          </p>
        </div>
        <button
          onClick={onContinue}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center space-x-2 transition shadow-sm"
        >
          <span>View Gap Report & Score</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Controls: Resume vs JD Tabs + Search + Category Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Active Source Toggle */}
        <div className="flex p-1 bg-slate-200/70 border border-slate-200 rounded-xl max-w-md">
          <button
            onClick={() => setActiveTab('resume')}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-2 ${
              activeTab === 'resume'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Candidate Resume ({resumeSkills.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('jd')}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-2 ${
              activeTab === 'jd'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Job Description ({jdSkills.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search extracted skills by name or term..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm"
          />
        </div>
      </div>

      {/* Domain Category Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          All Domains ({currentSkills.length})
        </button>
        {SKILL_CATEGORIES.map(cat => {
          const count = currentSkills.filter(s => s.category === cat.id).length;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                isActive
                  ? 'bg-indigo-50 text-indigo-800 border-indigo-300 font-semibold shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Extracted Skill Cards Grid */}
      {filteredSkills.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <Filter className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm text-slate-800 font-medium">No extracted skills match your filters.</p>
          <p className="text-xs text-slate-500">Try clearing the search query or selecting a different domain category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill, idx) => (
            <div
              key={`${skill.name}-${idx}`}
              className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-3 hover:border-indigo-200 shadow-sm transition"
            >
              {/* Header: Skill Name & Category Badge */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{skill.name}</h3>
                  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium border mt-1 ${getCategoryColor(skill.category)}`}>
                    {getCategoryIcon(skill.category)}
                    <span>{SKILL_CATEGORIES.find(c => c.id === skill.category)?.label}</span>
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {skill.level}
                </span>
              </div>

              {/* Confidence Meter Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Context Confidence</span>
                  <span className="font-mono font-semibold text-indigo-600">
                    {Math.round(skill.confidence * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all"
                    style={{ width: `${Math.round(skill.confidence * 100)}%` }}
                  />
                </div>
              </div>

              {/* Matched term & frequency info */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span>Matched: <code className="text-slate-800 font-mono font-medium">{skill.matched_term}</code></span>
                <span>Mentions: <span className="font-semibold text-slate-800">{skill.frequency}x</span></span>
              </div>

              {skill.description && (
                <p className="text-[11px] text-slate-500 line-clamp-2 italic pt-1">
                  "{skill.description}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
