const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { extractText } = require('../utils/pdfExtractor');
const { analyzeResume } = require('../utils/geminiClient');
const ResumeFeedback = require('../models/ResumeFeedback');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

/**
 * ✅ 1️⃣ Upload Resume + Analyze using Gemini
 */
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    const { jobRole, jobDescription } = req.body;

    console.log('📄 Extracting text locally using pdf-parse...');
    const resumeText = await extractText(req.file.path);
    console.log('✅ Resume text extracted successfully.');

    console.log('🤖 Sending resume text to Gemini...');
    const analysis = await analyzeResume({ resumeText, jobDescription, jobRole });

    const feedback = await ResumeFeedback.create({
      userId: req.user._id,
      resumeFile: `/uploads/${req.file.filename}`,
      jobRole,
      jobDescription,
      atsScore: analysis.atsScore,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.suggestions
    });

    res.json({ feedback });
  } catch (err) {
    console.error('❌ Error analyzing resume:', err);
    res.status(500).json({ message: 'Error analyzing resume', error: err.message });
  }
});

/**
 * ✅ 2️⃣ Fetch All Feedbacks (User History)
 */
router.get('/history', auth, async (req, res) => {
  try {
    const feedbacks = await ResumeFeedback.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ feedbacks });
  } catch (err) {
    console.error('❌ Error fetching history:', err);
    res.status(500).json({ message: 'Failed to load history', error: err.message });
  }
});

/**
 * ✅ 3️⃣ Fetch Single Feedback by ID (Fixes 404 error)
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const feedback = await ResumeFeedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    // Prevent unauthorized access
    if (feedback.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json({ item: feedback });
  } catch (err) {
    console.error('❌ Error fetching feedback by ID:', err);
    res.status(500).json({ message: 'Error fetching feedback', error: err.message });
  }
});

module.exports = router;
