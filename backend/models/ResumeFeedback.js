const mongoose = require("mongoose");

const resumeFeedbackSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeFile: { type: String, required: true },
    jobRole: { type: String, required: true },
    atsScore: { type: Number },
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeFeedback", resumeFeedbackSchema);
