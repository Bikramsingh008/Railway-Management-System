import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import loginImage from "../assets/LoginImage.png";

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");

    const matchedUser = registeredUsers.find(
      (u) =>
        u.username.toLowerCase() === loginData.username.toLowerCase() &&
        u.password === loginData.password
    );

    if (matchedUser) {
      // Store session (without password)
      const sessionUser = { ...matchedUser };
      delete sessionUser.password;
      localStorage.setItem("user", JSON.stringify(sessionUser));
      window.dispatchEvent(new Event("auth-change"));
      setLoading(false);
      navigate("/dashboard");
    } else {
      setLoading(false);
      setError("❌ Invalid username or password. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 pt-0 transition-colors duration-500
      bg-gradient-to-br from-emerald-100 via-sky-100 to-slate-100
      dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
    >
      <div
        className="
          flex flex-col md:flex-row
          w-full max-w-6xl
          -mt-20
          rounded-3xl
          bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl
          border border-white/60 dark:border-slate-800
          shadow-2xl dark:shadow-teal-950/40
          overflow-hidden
          animate-fadeUp transition-colors duration-300
        "
      >
        {/* Image Section */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-teal-50/50 dark:bg-slate-800/40 p-8">
          <img
            src={loginImage}
            alt="Login Illustration"
            className="w-130 drop-shadow-md"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-10 text-slate-800 dark:text-slate-100">
          <h2 className="text-5xl font-extrabold mb-2 text-slate-800 dark:text-slate-100 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">Sign in to continue</p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-semibold text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="labelStyle">Username</label>
              <input
                type="text"
                name="username"
                value={loginData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="inputStyle"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="labelStyle">Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="inputStyle"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btnPrimary w-full text-lg py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
                Register →
              </Link>
            </p>
          </form>

          <footer className="mt-10 text-center text-slate-500 dark:text-slate-400 text-sm">
            © 2026 Railway Management System
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
