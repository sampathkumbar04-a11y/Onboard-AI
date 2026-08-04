import React, { useState } from 'react';
import { SAMPLE_DATASETS } from '../data/sample_datasets';
import { Upload, FileText, Sparkles, ArrowRight, CheckCircle, Zap, RefreshCw, FileCode, Check, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker for PDF parsing using jsdelivr CDN for pdfjs-dist v6 mjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version || '6.2.108'}/build/pdf.worker.min.mjs`;

interface UploadFormProps {
  resumeText: string;
  setResumeText: (val: string) => void;
  jdText: string;
  setJdText: (val: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const UploadForm: React.FC<UploadFormProps> = ({
  resumeText,
  setResumeText,
  jdText,
  setJdText,
  onAnalyze,
  isLoading
}) => {
  const [activeSampleId, setActiveSampleId] = useState<string>('');
  const [uploadingTarget, setUploadingTarget] = useState<'resume' | 'jd' | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [jdFileName, setJdFileName] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_DATASETS.find(s => s.id === sampleId);
    if (sample) {
      setResumeText(sample.resume);
      setJdText(sample.jd);
      setActiveSampleId(sample.id);
      setResumeFileName('');
      setJdFileName('');
    }
  };

  const processFile = async (file: File, target: 'resume' | 'jd') => {
    setUploadingTarget(target);
    setUploadError(null);

    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        let pdf;
        try {
          pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        } catch (workerErr) {
          console.warn('Primary jsdelivr worker failed, attempting unpkg fallback worker...', workerErr);
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '6.2.108'}/build/pdf.worker.min.mjs`;
          pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        }

        let extractedText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageStrings = textContent.items.map((item: any) => item.str);
          extractedText += pageStrings.join(' ') + '\n\n';
        }

        const cleanText = extractedText.trim();
        if (cleanText.length < 10) {
          throw new Error('PDF appears to be empty or scanned image. Please paste plain text or upload a text-based PDF.');
        }

        if (target === 'resume') {
          setResumeText(cleanText);
          setResumeFileName(file.name);
        } else {
          setJdText(cleanText);
          setJdFileName(file.name);
        }
      } else {
        // Plain text, markdown, docx or code files
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          if (text) {
            if (target === 'resume') {
              setResumeText(text);
              setResumeFileName(file.name);
            } else {
              setJdText(text);
              setJdFileName(file.name);
            }
          }
        };
        reader.readAsText(file);
      }
      setActiveSampleId('');
    } catch (err: any) {
      console.error('File parsing error:', err);
      setUploadError(err.message || 'Failed to parse file. Please copy and paste the text directly.');
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'resume' | 'jd') => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file, target);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, target: 'resume' | 'jd') => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file, target);
    }
  };

  const isFormValid = resumeText.trim().length > 20 && jdText.trim().length > 20;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Banner Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <Zap className="w-3.5 h-3.5 text-indigo-600" />
          <span>Explainable Skill Extraction & Onboarding Planner</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Analyze Skills Gaps & Build <span className="text-indigo-600">Adaptive Roadmaps</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Upload candidate PDF resumes and job descriptions, drag & drop files, or test 1-click sample presets. Our engine extracts technical skills, pinpoints gaps, computes letter grades, and generates a personalized learning path.
        </p>
      </div>

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
          <button onClick={() => setUploadError(null)} className="text-rose-600 hover:text-rose-900 font-bold text-sm">
            ×
          </button>
        </div>
      )}

      {/* 1-Click Sample Preset Pickers */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-900">1-Click Test Drive Datasets</h3>
          </div>
          <span className="text-xs text-slate-500">Select a preset to populate inputs instantly</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_DATASETS.map((sample) => {
            const isSelected = activeSampleId === sample.id;
            return (
              <button
                key={sample.id}
                onClick={() => handleSelectSample(sample.id)}
                className={`text-left p-3 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-950 shadow-sm font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">{sample.title}</span>
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{sample.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dual Input Panels: Resume vs Job Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Candidate Resume Input */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'resume')}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-sm hover:border-indigo-300 transition"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-slate-900">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Candidate Resume (PDF or Text)</span>
              </label>
              <label className="cursor-pointer inline-flex items-center space-x-1.5 text-xs text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition font-semibold">
                {uploadingTarget === 'resume' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-indigo-600" />
                )}
                <span>{uploadingTarget === 'resume' ? 'Parsing PDF...' : 'Upload PDF / File'}</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx,.md"
                  onChange={(e) => handleFileUpload(e, 'resume')}
                  className="hidden"
                />
              </label>
            </div>
            {resumeFileName && (
              <div className="mb-2 flex items-center space-x-2 text-xs text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                <span>Uploaded: <strong>{resumeFileName}</strong></span>
              </div>
            )}
            <p className="text-xs text-slate-500 mb-3">
              Upload PDF resume, drag & drop file, or paste text below.
            </p>
            <textarea
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                setActiveSampleId('');
                setResumeFileName('');
              }}
              placeholder="Paste candidate resume text or drag and drop PDF file here..."
              className="w-full h-72 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-mono resize-none leading-relaxed transition"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Character count: {resumeText.length}</span>
            {resumeText && (
              <button
                onClick={() => {
                  setResumeText('');
                  setResumeFileName('');
                }}
                className="text-slate-400 hover:text-rose-600 transition"
              >
                Clear text
              </button>
            )}
          </div>
        </div>

        {/* Target Job Description Input */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, 'jd')}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-sm hover:border-purple-300 transition"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-slate-900">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Target Job Description (PDF or Text)</span>
              </label>
              <label className="cursor-pointer inline-flex items-center space-x-1.5 text-xs text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition font-semibold">
                {uploadingTarget === 'jd' ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-purple-600" />
                )}
                <span>{uploadingTarget === 'jd' ? 'Parsing PDF...' : 'Upload PDF / File'}</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx,.md"
                  onChange={(e) => handleFileUpload(e, 'jd')}
                  className="hidden"
                />
              </label>
            </div>
            {jdFileName && (
              <div className="mb-2 flex items-center space-x-2 text-xs text-purple-800 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                <FileCode className="w-3.5 h-3.5 text-purple-600" />
                <span>Uploaded: <strong>{jdFileName}</strong></span>
              </div>
            )}
            <p className="text-xs text-slate-500 mb-3">
              Upload PDF job description, drag & drop file, or paste text below.
            </p>
            <textarea
              value={jdText}
              onChange={(e) => {
                setJdText(e.target.value);
                setActiveSampleId('');
                setJdFileName('');
              }}
              placeholder="Paste target job description requirements or drag and drop PDF file here..."
              className="w-full h-72 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-mono resize-none leading-relaxed transition"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Character count: {jdText.length}</span>
            {jdText && (
              <button
                onClick={() => {
                  setJdText('');
                  setJdFileName('');
                }}
                className="text-slate-400 hover:text-rose-600 transition"
              >
                Clear text
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="flex flex-col items-center justify-center space-y-3 pt-2">
        <button
          onClick={onAnalyze}
          disabled={!isFormValid || isLoading}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center space-x-3 transition-all shadow-sm ${
            isFormValid && !isLoading
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10 hover:shadow cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing Skills & Running Pipeline...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Analyze Skills, Gap Report & Match Score</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
        {!isFormValid && (
          <p className="text-xs text-slate-500">
            Please enter or upload both candidate resume and job description text to begin analysis.
          </p>
        )}
      </div>
    </div>
  );
};
