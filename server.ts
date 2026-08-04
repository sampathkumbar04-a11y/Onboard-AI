import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { runFullAnalysis, generateRoadmap } from "./src/utils/engine";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Initialize Gemini Client server-side if API key exists
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } catch (err) {
    console.warn("Failed to initialize GoogleGenAI client:", err);
  }
}

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Full Analysis API Endpoint
app.post("/api/analyze/full", async (req, res) => {
  try {
    const { resume_text = "", jd_text = "" } = req.body;

    if (!resume_text.trim() || !jd_text.trim()) {
      return res.status(400).json({ error: "Both resume_text and jd_text are required." });
    }

    // 1. Core Algorithmic Engine Analysis
    const analysisResult = runFullAnalysis(resume_text, jd_text);

    // 2. Optional Gemini AI Deep Semantic Analysis
    if (aiClient) {
      try {
        const prompt = `You are an expert HR Technology & Technical Onboarding Specialist.
Analyze the candidate resume against the target job description:

Candidate Resume:
${resume_text.slice(0, 3000)}

Job Description:
${jd_text.slice(0, 3000)}

Calculated Algorithmic Score: ${analysisResult.match_score.overall}% (Grade ${analysisResult.match_score.grade})
Missing Skill Gaps Identified: ${analysisResult.skill_gaps.map((g) => g.name).join(", ") || "None"}
Strong Skills Identified: ${analysisResult.strong_skills.map((s) => s.name).join(", ") || "None"}

CRITICAL GROUND-TRUTH RULES FOR INSIGHTS GENERATION:
1. "criticalRisks": MUST ONLY reference real missing skills listed in "Missing Skill Gaps Identified" above or explicit requirements from the Job Description. DO NOT invent or hallucinate unmentioned third-party tools or frameworks (such as Power BI, Tableau, Excel, etc.) if they are NOT in the Job Description or Missing Skill Gaps!
2. If Calculated Algorithmic Score is 100% or there are NO missing skill gaps, "criticalRisks" MUST ONLY contain "No critical technical risks identified; candidate meets 100% of required job skills."
3. "topStrengths": Focus strictly on verified skills present in the candidate resume that match the job description.
4. "interviewQuestions": Generate targeted questions specifically for the identified missing skills or partial skills. If there are no missing skills, focus on architecture or depth questions for top strong skills.

Please generate deep semantic insights in valid JSON format matching this schema:
{
  "summary": "2-3 concise sentences summarizing candidate fit and primary onboarding focus.",
  "topStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "criticalRisks": ["Risk or Gap 1"],
  "interviewQuestions": [
    { "question": "Deep technical question to verify gap or proficiency", "targetSkill": "Skill Name", "purpose": "Validation goal" }
  ],
  "onboardingTips": ["Actionable advice 1 for mentor/manager", "Actionable advice 2"]
}`;

        const geminiResponse = await aiClient.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                topStrengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                criticalRisks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                interviewQuestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      targetSkill: { type: Type.STRING },
                      purpose: { type: Type.STRING },
                    },
                    required: ["question", "targetSkill", "purpose"],
                  },
                },
                onboardingTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["summary", "topStrengths", "criticalRisks", "interviewQuestions", "onboardingTips"],
            },
          },
        });

        if (geminiResponse.text) {
          const insights = JSON.parse(geminiResponse.text);
          analysisResult.gemini_insights = insights;
        }
      } catch (geminiErr) {
        console.warn("Gemini semantic analysis failed, continuing with algorithmic results:", geminiErr);
      }
    }

    return res.json(analysisResult);
  } catch (err: any) {
    console.error("Error in /api/analyze/full:", err);
    return res.status(500).json({ error: err.message || "Failed to analyze skills" });
  }
});

// Roadmap Generation API Endpoint
app.post("/api/roadmap/generate", (req, res) => {
  try {
    const { gaps = [], partial_skills = [], timeline_weeks = 8, learning_style = "balanced" } = req.body;
    const roadmap = generateRoadmap(gaps, partial_skills, Number(timeline_weeks), learning_style);
    return res.json(roadmap);
  } catch (err: any) {
    console.error("Error in /api/roadmap/generate:", err);
    return res.status(500).json({ error: err.message || "Failed to generate roadmap" });
  }
});

// Available Learning Styles Endpoint
app.get("/api/roadmap/styles", (req, res) => {
  res.json([
    { id: "balanced", name: "Balanced Hybrid", description: "Mix of video, documentation, exercises, and projects." },
    { id: "hands-on", name: "Hands-on & Projects", description: "Prioritizes coding labs, repositories, and practical projects." },
    { id: "visual", name: "Visual & Video", description: "Prioritizes tech talks, YouTube video courses, and visual guides." },
    { id: "reading", name: "Reading & Documentation", description: "Prioritizes official docs, books, articles, and whitepapers." },
  ]);
});

// Start Express + Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
