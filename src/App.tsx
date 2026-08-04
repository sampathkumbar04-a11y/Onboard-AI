import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { UploadForm } from './components/UploadForm';
import { SkillsPanel } from './components/SkillsPanel';
import { GapScoreView } from './components/GapScoreView';
import { RoadmapView } from './components/RoadmapView';
import { AnalysisResult } from './types';
import { SAMPLE_DATASETS } from './data/sample_datasets';
import { runFullAnalysis } from './utils/engine';
import { AlertCircle, Cpu } from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [resumeText, setResumeText] = useState<string>(SAMPLE_DATASETS[0].resume);
  const [jdText, setJdText] = useState<string>(SAMPLE_DATASETS[0].jd);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jdText.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze/full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          jd_text: jdText,
        }),
      });

      if (response.ok) {
        const data: AnalysisResult = await response.json();
        setAnalysisResult(data);
        setCurrentStep(3);
      } else {
        // Fallback to client-side engine if server route failed
        console.warn('Backend API endpoint returned status', response.status, 'falling back to client engine');
        const localData = runFullAnalysis(resumeText, jdText);
        setAnalysisResult(localData);
        setCurrentStep(3);
      }
    } catch (err: any) {
      console.warn('Network or server error during fetch, using fallback client engine:', err);
      const localData = runFullAnalysis(resumeText, jdText);
      setAnalysisResult(localData);
      setCurrentStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResumeText(SAMPLE_DATASETS[0].resume);
    setJdText(SAMPLE_DATASETS[0].jd);
    setAnalysisResult(null);
    setCurrentStep(1);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <div>
        <Navbar
          currentStep={currentStep}
          onSelectStep={(step) => setCurrentStep(step)}
          canNavigate={!!analysisResult}
          onReset={handleReset}
        />

        <main className="py-6">
          {errorMessage && (
            <div className="max-w-7xl mx-auto px-4 mb-6">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <UploadForm
              resumeText={resumeText}
              setResumeText={setResumeText}
              jdText={jdText}
              setJdText={setJdText}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          )}

          {currentStep === 2 && analysisResult && (
            <SkillsPanel
              resumeSkills={analysisResult.resume_skills}
              jdSkills={analysisResult.jd_skills}
              onContinue={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && analysisResult && (
            <GapScoreView
              analysis={analysisResult}
              onGenerateRoadmap={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 4 && analysisResult && (
            <RoadmapView analysis={analysisResult} />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">AI Adaptive Onboarding Engine</span>
            <span>•</span>
            <span>Built with React, Vite & Tailwind CSS</span>
          </div>
          <p className="text-slate-400">Explainable AI Skill Assessment & Adaptive Onboarding Planner</p>
        </div>
      </footer>
    </div>
  );
}
