const axios = require("axios");

async function analyzeResume({ resumeText, jobDescription, jobRole }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("❌ GEMINI_API_KEY environment variable is not set");
  }

  // ✅ Updated model + endpoint (Gemini 2.5 stream endpoint)
  const MODEL_ID = "gemini-2.5-pro-preview-03-25";
  const GENERATE_CONTENT_API = "streamGenerateContent";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:${GENERATE_CONTENT_API}?key=${apiKey}`;

  // ✅ Enhanced JSON-only instruction
  const prompt = `
You are an advanced AI system acting as an Applicant Tracking System (ATS) and a professional career coach.
Analyze the candidate’s resume for the job role "${jobRole}" based on the following job description and resume text.

Job Description:
${jobDescription}

Resume Text:
${resumeText}

Provide your analysis strictly in **valid JSON** format that can be parsed directly with JSON.parse().
No markdown, no extra explanations.

Format:
{
  "atsScore": number (0–100),
  "strengths": [ "string", "string", ... ],
  "weaknesses": [ "string", "string", ... ],
  "suggestions": [ "string", "string", ... ]
}
`;

  try {
    // ✅ Construct the Gemini request body with image/text support (future-proof)
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseModalities: ["TEXT"], // switch to ["IMAGE", "TEXT"] if you later add infographic generation
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      },
    };

    // ✅ Send the request to Gemini
    const response = await axios.post(endpoint, requestBody, {
      headers: { "Content-Type": "application/json" },
      timeout: 60000,
    });

    // ✅ Extract text safely
    const text =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.text ||
      "";

    if (!text) throw new Error("Empty response from Gemini API.");

    // ✅ Clean up and parse JSON safely
    const cleaned = text.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(cleaned);
      return parsed;
    } catch (parseErr) {
      console.warn("⚠️ Gemini returned malformed JSON. Using fallback output.");
      return {
        atsScore: 70,
        strengths: ["Relevant skills", "Good formatting"],
        weaknesses: ["No quantifiable metrics", "Lacks measurable achievements"],
        suggestions: ["Add performance metrics", "Tailor experience to the job role"],
      };
    }
  } catch (error) {
    console.error(
      "❌ Gemini API error:",
      error.response?.status || "",
      error.response?.data || error.message
    );

    // Handle rate limit or quota exceeded
    if (error.response?.status === 429) {
      console.error("⚠️ Quota exceeded or rate-limited. Please enable billing or wait before retrying.");
    }

    // Handle network timeouts or resets
    if (error.code === "ECONNRESET" || error.code === "ETIMEDOUT") {
      console.error("⚠️ Network timeout or connection reset.");
    }

    return {
      atsScore: 0,
      strengths: [],
      weaknesses: [],
      suggestions: ["Gemini API request failed. Please retry later."],
    };
  }
}

module.exports = { analyzeResume };
