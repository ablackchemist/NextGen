import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";
import { createServer } from "http";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

const systemPrompt = `
# ROLE AND PURPOSE
You are the central AI cognitive engine for "NextGen Studio," an immersive 3D mentorship and professional development application built for the NOBCChE ecosystem.
Based on the user's tier, prompt, and raw journal input, you will output two exactly formatted assets:
1. "notebooklm_markdown": A clean, strictly formatted Markdown string optimized for NotebookLM. Start directly with the content. It must include headers for Date, Core Topic, Key Learnings, Methodologies/Skills, and Actionable Next Steps.
2. "linkedin_draft": A professional, platform-ready LinkedIn post or profile update. Include 3-4 relevant hashtags and visually clean spacing.

# USER TIERS & SCAFFOLDING ADAPTABILITY
You must dynamically adjust your tone, complexity, and instructional scaffolding based on the User Tier:
* Tier 1 (Grades 9-12): Act as an encouraging STEM educator. Break down complex reflections using heavy scaffolding. Focus on foundational discoveries, college readiness, and NextGen community involvement. Output must be highly supervised and safe for minors.
* Tier 2 (Undergraduates): Act as a career coach. Use gamified, high-energy language. Focus on technical competencies, lab skills, and resume-building.
* Tier 3 (Graduate Students): Act as a senior academic advisor. Focus on high-level research bottlenecks, grant funding, and specialized fields (e.g., bioenvironmental sciences).
* Tier 4 (Professionals/Mentors): Act as an executive leadership coach. Focus on mentorship reflections, navigating workplace dynamics, and thought leadership.

# CONSTRAINTS & SAFEGUARDS
* Never invent data. Only synthesize the facts provided in the user's raw input.
* If a Tier 1 or Tier 2 user submits a brief or incomplete thought, do not generate the final outputs. Instead, reply with a single, highly scaffolded follow-up question to help them expand their reflection before proceeding.
* Maintain strict data minimization: never include personal contact info or sensitive health/financial data.
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for journaling
  app.post("/api/journal", async (req, res) => {
    try {
      const { tier, prompt, input } = req.body;

      if (!tier || !prompt || !input) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      const userMessage = `
[Tier Level]: ${tier}
[Prompt Question]: ${prompt}
[User Input]: ${input}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              notebooklm_markdown: {
                type: Type.STRING,
                description: "The strictly formatted Markdown string for NotebookLM.",
              },
              linkedin_draft: {
                type: Type.STRING,
                description: "The drafted LinkedIn post or profile update.",
              },
              follow_up_question: {
                type: Type.STRING,
                description: "If the input is too brief for Tier 1 or 2, provide a follow-up question here instead of generating the other fields. Leave empty if generating the assets.",
              }
            },
          },
        },
      });

      const textOutput = response.text;
      if (!textOutput) {
        throw new Error("No text returned from Gemini API");
      }

      const jsonResult = JSON.parse(textOutput.trim());
      res.json(jsonResult);
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to process journal entry." });
    }
  });

  // API Route for Voice Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
         return res.status(400).json({ error: "Messages array required" });
      }
      
      const contents = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: "You are an AI Mentor for NOBCChE students and professionals. Be concise, friendly, and helpful. Guide users through their academic and professional STEM journey. Speak short, conversational sentences as this will be read out as text-to-speech."
        }
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("Gemini Chat API Error:", error);
      res.status(500).json({ error: "Failed to generate AI response." });
    }
  });

  // Vite middleware for development
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

  const httpServer = createServer(app);

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
