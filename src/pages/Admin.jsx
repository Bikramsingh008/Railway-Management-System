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
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="flex bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-6xl">
        <div className="w-1/2 hidden md:flex justify-center items-center bg-gray-50">
          <img src={adminImg} alt="Admin login" className="w-4/5 h-auto" />
        </div>

        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-4xl font-bold mb-2">Hello 👋, Admin</h2>
          <p className="text-gray-600 mb-8">Sign into your account</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-gray-700 mb-1">UserName</label>
              <input
                type="text"
                name="username"
                value={adminData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={adminData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="bg-black text-white w-full py-2 rounded-md hover:bg-gray-800 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
