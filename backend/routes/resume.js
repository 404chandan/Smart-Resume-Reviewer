const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { analyzeResume } = require("../utils/geminiClient");
const { extractText } = require("../utils/pdfExtractor");
const { authMiddleware } = require("../middleware/authMiddleware");
const ResumeFeedback = require("../models/ResumeFeedback");

const router = express.Router();

// 🗂️ Setup Multer for PDF Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
});

// 📤 Upload + Analyze Route
router.post("/upload", authMiddleware, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No resume uploaded" });

    const { jobDescription, jobRole } = req.body;
    const text = await extractText(req.file.path);
    const feedback = await analyzeResume({ resumeText: text, jobDescription, jobRole });

    const newFeedback = await ResumeFeedback.create({
      userId: req.user._id,
      resumeFile: req.file.filename,
      jobRole,
      atsScore: feedback.atsScore,
      strengths: feedback.strengths,
      weaknesses: feedback.weaknesses,
      suggestions: feedback.suggestions,
    });

    res.json({ message: "Analysis complete", feedback: newFeedback });
  } catch (err) {
    console.error("❌ Error analyzing resume:", err.message);
    res.status(500).json({ message: "Failed to analyze resume", error: err.message });
  }
});

// 🕓 Get User's History
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const history = await ResumeFeedback.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

// 🧾 Get Resume Feedback by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const feedback = await ResumeFeedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Resume not found" });
    res.json({ item: feedback });
  } catch (err) {
    console.error("Error fetching resume:", err);
    res.status(500).json({ message: "Failed to fetch resume", error: err.message });
  }
});

module.exports = router;
