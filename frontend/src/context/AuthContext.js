import React, { createContext, useState, useEffect } from "react";
import API from "../api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch current logged-in user on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await API.get("/auth/me", { withCredentials: true }); // ✅ include cookies
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // 🚪 Logout function
  const logout = async () => {
    try {
      await API.post("/auth/logout", {}, { withCredentials: true }); // ✅ send cookie for logout
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
