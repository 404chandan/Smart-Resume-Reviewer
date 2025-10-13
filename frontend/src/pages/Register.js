import React, { useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { setUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", { name, email, password });
      setUser(res.data.user);
      nav("/upload");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input className="p-2 border rounded" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="p-2 border rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="p-2 border rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="bg-green-600 text-white p-2 rounded">Register</button>
        <p className="text-center text-sm mt-2">Already have an account? <Link className="text-blue-600" to="/login">Login</Link></p>
      </form>
    </div>
  );
}
