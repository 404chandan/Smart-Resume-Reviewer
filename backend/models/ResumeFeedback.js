const mongoose = require('mongoose');

const resumeFeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeFile: { type: String, required: true },
  jobRole: String,
  jobDescription: String,
  atsScore: Number,
  strengths: [String],
  weaknesses: [String],
  suggestions: [String]
}, { timestamps: true });

module.exports = mongoose.model('ResumeFeedback', resumeFeedbackSchema);
