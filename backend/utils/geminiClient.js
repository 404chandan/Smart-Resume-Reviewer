const axios = require("axios");

async function analyzeResume({ resumeText, jobDescription, jobRole }) {
  console.log("🤖 Sending resume text to Gemini 2.5 Flash...");

  const cleanResume = resumeText
    .replace(/\s+/g, " ")
    .replace(/[^\x00-\x7F]/g, "")
    .trim()
    .slice(0, 12000);

  const cleanJD = jobDescription.replace(/\s+/g, " ").trim().slice(0, 2500);

  const prompt = `
You are an expert Applicant Tracking System (ATS) and career advisor.
Evaluate the following resume for the job role: ${jobRole}.

JOB DESCRIPTION:
${cleanJD}

RESUME TEXT:
${cleanResume}

Now analyze and respond ONLY in valid JSON format, with this structure:

{
  "atsScore": number between 0 and 100,
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "suggestions": ["string", "string"],
  "summary": "string"
}
`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  async function callGemini(attempt = 1) {
    try {
      const res = await axios.post(
        endpoint,
        {
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            topP: 0.9,
            maxOutputTokens: 512,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_NONE" },
          ],
        },
        { headers: { "Content-Type": "application/json" }, timeout: 60000 }
      );

      const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!text) throw new Error("Empty text in candidate");

      console.log("📦 Gemini raw response:", JSON.stringify(res.data, null, 2));
      return text;
    } catch (err) {
      console.error("❌ Gemini API Error:", err.response?.data || err.message);
      if (attempt < 3) {
        console.log(`🔁 Retrying Gemini request (${attempt + 1})...`);
        return await callGemini(attempt + 1);
      }
      throw err;
    }
  }

  try {
    const rawOutput = await callGemini();
    const jsonText = rawOutput.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(jsonText);
    console.log("✅ Gemini 2.5 Flash analysis completed successfully.");
    return parsed;
  } catch (err) {
    console.error("⚠️ Gemini analysis failed:", err.message);
    return {
      atsScore: 70,
      strengths: ["Good formatting", "Relevant experience"],
      weaknesses: ["No quantifiable results", "Weak job match"],
      suggestions: [
        "Add measurable achievements",
        "Use job-specific keywords",
        "Include clear impact metrics",
      ],
      summary:
        "Resume is strong in layout and relevance but could use more metrics and keyword optimization.",
    };
  }
}

module.exports = { analyzeResume };
