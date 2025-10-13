import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import ProgressCircle from "../components/ProgressCircle";
import FeedbackCard from "../components/FeedbackCard";

export default function FeedbackPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get(`/resume/${id}`).then(res => setData(res.data.item));
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-xl font-semibold mb-2">{data.jobRole}</h2>
      <ProgressCircle value={data.atsScore} />
      <FeedbackCard title="Strengths" list={data.strengths} emoji="✅" />
      <FeedbackCard title="Weaknesses" list={data.weaknesses} emoji="⚠️" />
      <FeedbackCard title="Suggestions" list={data.suggestions} emoji="💡" />
    </div>
  );
}
