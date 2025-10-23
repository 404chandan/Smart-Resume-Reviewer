
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Adjust path if needed
import API from "../api"; // ✅ Make sure API is imported from your API setup file

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      alert("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed, please try again.");
    }
  };

  return (
    <nav className="p-4 bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="font-bold text-2xl text-blue-600 tracking-tight"
        >
          Smart Resume Reviewer
        </Link>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                to="/upload"
                className="hover:text-blue-600 transition font-medium"
              >
                Upload
              </Link>
              <Link
                to="/history"
                className="hover:text-blue-600 transition font-medium"
              >
                History
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-600 transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-blue-600 transition font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
