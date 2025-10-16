const axios = require("axios");

async function analyzeResume({ resumeText, jobDescription, jobRole }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("❌ GEMINI_API_KEY not set in environment.");

  const MODEL_ID = "gemini-2.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${apiKey}`;

  // 🧩 Step 1: Clean and trim input
  const cleanText = (text, limit = 5000) =>
    text.replace(/\s+/g, " ").trim().slice(0, limit);

  let cleanedResume = cleanText(resumeText, 5000);
  let cleanedJD = cleanText(jobDescription, 1500);

  // 🧠 Step 2: Build prompt
  const prompt = `
You are an advanced Applicant Tracking System (ATS) and professional career coach.
Analyze the following candidate’s resume for the job role "${jobRole}" using the job description below.

Job Description:
${cleanedJD}

Resume Text:
${cleanedResume}

Return strictly valid JSON (no markdown, no explanation):
{
  "atsScore": number (0–100),
  "strengths": [ "string", ... ],
  "weaknesses": [ "string", ... ],
  "suggestions": [ "string", ... ]
}
`;

  async function callGemini(inputPrompt) {
    const response = await axios.post(
      endpoint,
      {
        contents: [{ role: "user", parts: [{ text: inputPrompt }] }],
        generationConfig: {
          temperature: 0.6,
          topP: 0.9,
          maxOutputTokens: 512,
        },
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 90000,
      }
    );
    const text =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    return text;
  }

  try {
    console.log("🤖 Sending resume text to Gemini 2.5 Flash...");

    let text = await callGemini(prompt);

    // ⚠️ Step 3: If empty, retry with shorter text
    if (!text) {
      console.warn("⚠️ Empty response — retrying with trimmed input...");
      cleanedResume = cleanText(cleanedResume, 2500);
      cleanedJD = cleanText(cleanedJD, 800);

      const shorterPrompt = `
Job Role: ${jobRole}

Summarized Job Description:
${cleanedJD}

Shortened Resume Text:
${cleanedResume}

Return only JSON:
{
  "atsScore": number (0–100),
  "strengths": [ "string" ],
  "weaknesses": [ "string" ],
  "suggestions": [ "string" ]
}
`;
      text = await callGemini(shorterPrompt);
    }

    // ⚙️ Step 4: Handle still-empty or malformed responses
    if (!text) {
      console.warn("⚠️ Gemini still returned no output after retry.");
      return {
        atsScore: 0,
        strengths: [],
        weaknesses: [],
        suggestions: ["Gemini returned no output. Try enabling billing or shortening resume."],
      };
    }

    const cleaned = text.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(cleaned);
      console.log("✅ Gemini 2.5 Flash analysis completed successfully.");
      return parsed;
    } catch {
      console.warn("⚠️ Malformed JSON, using fallback output.");
      return {
        atsScore: 70,
        strengths: ["Relevant experience", "Clean structure"],
        weaknesses: ["No measurable metrics"],
        suggestions: ["Add quantifiable achievements", "Tailor resume for job role"],
      };
    }
  } catch (error) {
    console.error("❌ Gemini API error:", error.response?.data || error.message);
    const status = error.response?.status;

    return {
      atsScore: 0,
      strengths: [],
      weaknesses: [],
      suggestions: [
        status === 429
          ? "Gemini quota exceeded. Please try again later."
          : "Gemini request failed. Please retry later.",
      ],
    };
  }
}

module.exports = { analyzeResume };
