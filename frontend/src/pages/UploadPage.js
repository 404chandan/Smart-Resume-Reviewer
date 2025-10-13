import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return alert("Please upload a resume file!");
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobRole", jobRole);
    formData.append("jobDescription", jobDescription);

    try {
      const res = await API.post("/resume/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      nav(`/feedback/${res.data.feedback._id}`);
    } catch (err) {
      alert("Upload failed: " + err.response?.data?.message);
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow mt-10">
      <h2 className="text-lg font-semibold mb-4">Upload Resume</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} />
        <input className="p-2 border rounded" placeholder="Job Role" value={jobRole} onChange={e => setJobRole(e.target.value)} />
        <textarea className="p-2 border rounded h-32" placeholder="Job Description" value={jobDescription} onChange={e => setJobDescription(e.target.value)} />
        <button className="bg-blue-600 text-white p-2 rounded">Analyze Resume</button>
      </form>
    </div>
  );
}
