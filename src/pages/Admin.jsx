import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import adminImg from "../assets/adminLogin.png";

const Admin = () => {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    username: "admin",
    password: "admin123",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (adminData.username === "admin" && adminData.password === "admin123") {
      alert("Login Successful ✅");
      navigate("/admin-dashboard");
    } else {
      alert("Invalid username or password ❌");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6 transition-colors duration-500 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <div className="flex flex-col md:flex-row bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl overflow-hidden w-full max-w-5xl transition-colors duration-300">
        <div className="w-full md:w-1/2 flex justify-center items-center bg-slate-50 dark:bg-slate-800/50 p-8">
          <img src={adminImg} alt="Admin login" className="w-4/5 h-auto drop-shadow-md" />
        </div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold mb-2 text-slate-800 dark:text-slate-100">Hello 👋, Admin</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Sign into your management console</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="labelStyle">Username</label>
              <input
                type="text"
                name="username"
                value={adminData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="inputStyle"
              />
            </div>

            <div>
              <label className="labelStyle">Password</label>
              <input
                type="password"
                name="password"
                value={adminData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="inputStyle"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition shadow-lg"
            >
              Login to Admin Panel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;

