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

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    const { jobRole, jobDescription } = req.body;
    const resumeText = await extractText(req.file.path);
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
    res.status(500).json({ message: 'Error analyzing resume', error: err.message });
  }
});

router.get('/history', auth, async (req, res) => {
  const feedbacks = await ResumeFeedback.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ feedbacks });
});

module.exports = router;
