import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function HistoryPage() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    API.get("/resume/history").then(res => setFeedbacks(res.data.feedbacks));
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Your Past Analyses</h2>
      {feedbacks.map((f) => (
        <Link to={`/feedback/${f._id}`} key={f._id}>
          <div className="bg-white p-4 mb-3 rounded shadow hover:bg-gray-50 transition">
            <p className="font-medium">{f.jobRole}</p>
            <p className="text-sm text-gray-500">ATS Score: {f.atsScore}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
