import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/LoginImage.png";

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 pt-0
      bg-gradient-to-br from-emerald-100 via-sky-100 to-slate-100"
    >
      <div
        className="
  flex flex-col md:flex-row
  w-full max-w-6xl
  -mt-30
  rounded-2xl
  bg-white/70 backdrop-blur-lg
  border border-white/60
  shadow-2xl
  overflow-hidden
  animate-fadeUp
  "
      >
        {/* Image Section */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-white/40">
          <img
            src={loginImage}
            alt="Login Illustration"
            className="w-130 drop-shadow-md"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-10 text-slate-800">
          <h2 className="text-5xl font-bold mb-2 text-slate-700">
            Welcome Back
          </h2>
          <p className="text-slate-500 mb-8">Sign in to continue</p>

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
                required
              />
            </div>

            <button type="submit" className="btnPrimary w-full">
              Sign In
            </button>
          </form>

          <footer className="mt-10 text-center text-slate-500 text-sm">
            © 2026 Railway Management System
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
