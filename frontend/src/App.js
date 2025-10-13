import React from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUpload, FaRobot, FaHistory } from "react-icons/fa";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadPage from "./pages/UploadPage";
import FeedbackPage from "./pages/FeedbackPage";
import HistoryPage from "./pages/HistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50 animate-gradient"></div>

      <div className="relative container mx-auto flex flex-col md:flex-row items-center justify-between py-20 px-6">
        {/* Left section */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center md:text-left max-w-xl z-10"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
            Smarter <span className="text-blue-600">Resume Reviews</span>
            <br /> Powered by <span className="text-purple-600">Gemini AI</span>
          </h1>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            Get instant, AI-powered feedback on your resume with ATS score, strengths, weaknesses, and improvement suggestions.  
            Optimize your resume for your dream job in seconds 🚀
          </p>

          <div className="flex justify-center md:justify-start gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/upload")}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:bg-blue-700 transition"
            >
              <FaUpload className="inline mr-2" />
              Try it Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              className="bg-white border border-blue-500 text-blue-600 px-6 py-3 rounded-full font-medium shadow hover:bg-blue-50 transition"
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>

        {/* Right image / animation */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="mt-10 md:mt-0"
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
            alt="Resume analysis animation"
            className="w-[420px] md:w-[500px] drop-shadow-2xl rounded-3xl"
          />
        </motion.div>
      </div>

      {/* ✨ Features section - Always visible (no scroll trigger) */}
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
  className="container mx-auto py-20 px-6 relative z-10"
>
  <h2 className="text-center text-4xl font-extrabold text-gray-800 mb-12">
    What Makes <span className="text-blue-600">Smart Resume Reviewer</span> Different?
  </h2>

  <div className="grid md:grid-cols-3 gap-10 text-center">
    {/* Feature 1 */}
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:border-blue-100 transition"
    >
      <FaRobot className="text-blue-600 text-5xl mx-auto mb-5 drop-shadow-md" />
      <h3 className="text-2xl font-semibold mb-3 text-gray-800">AI-Powered Analysis</h3>
      <p className="text-gray-600 leading-relaxed">
        Gemini AI evaluates your resume like a recruiter — pinpointing strengths, weaknesses, and improvements.
      </p>
    </motion.div>

    {/* Feature 2 */}
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:border-purple-100 transition"
    >
      <FaUpload className="text-purple-600 text-5xl mx-auto mb-5 drop-shadow-md" />
      <h3 className="text-2xl font-semibold mb-3 text-gray-800">Instant ATS Score</h3>
      <p className="text-gray-600 leading-relaxed">
        Get a detailed ATS compatibility score and insights on how to boost your resume’s recruiter visibility.
      </p>
    </motion.div>

    {/* Feature 3 */}
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="p-8 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:border-pink-100 transition"
    >
      <FaHistory className="text-pink-600 text-5xl mx-auto mb-5 drop-shadow-md" />
      <h3 className="text-2xl font-semibold mb-3 text-gray-800">Your Feedback History</h3>
      <p className="text-gray-600 leading-relaxed">
        Track your resume improvements, compare versions, and download feedback reports anytime.
      </p>
    </motion.div>
  </div>
</motion.div>


      {/* Footer */}
      <footer className="bg-gray-100 text-center py-6 text-gray-600">
        Built with ❤️ by <span className="font-semibold text-gray-800">Smart Resume Reviewer</span> © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="p-4 bg-white shadow sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="font-bold text-2xl text-blue-600 tracking-tight">
              Smart Resume Reviewer
            </Link>
            <div className="flex gap-4">
              <Link to="/upload" className="hover:text-blue-600 transition">Upload</Link>
              <Link to="/history" className="hover:text-blue-600 transition">History</Link>
              <Link to="/login" className="hover:text-blue-600 transition">Login</Link>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
            <Route path="/feedback/:id" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

/* 🪄 Optional animation keyframes (add this in your index.css or tailwind.css)
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 8s ease infinite;
}
*/
