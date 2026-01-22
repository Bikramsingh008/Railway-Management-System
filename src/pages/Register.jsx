import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthdate: "",
    gender: "",
    mobile: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    country: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => alert(data.message))
      .catch((err) => console.log(err));
  };

  const handleClear = () => {
    setFormData({
      firstName: "",
      lastName: "",
      birthdate: "",
      gender: "",
      mobile: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      country: "",
      state: "",
      zip: "",
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-start pt-8 p-6
      bg-gradient-to-br from-emerald-100 via-sky-100 to-slate-100">

      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-5xl p-5 rounded-2xl
          bg-white/70 backdrop-blur-lg
          border border-white/60
          shadow-xl
          text-slate-800
          animate-fadeUp
        "
      >
        <h2 className="text-4xl font-bold mb-8 text-center text-slate-700">
          Create Your Account
        </h2>

        {/* First & Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="labelStyle">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="inputStyle"
            />
          </div>

          <div>
            <label className="labelStyle">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="inputStyle"
            />
          </div>
        </div>

        {/* Birthdate, Gender, Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label className="labelStyle">Birthdate</label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="inputStyle"
            />
          </div>

          <div>
            <label className="labelStyle">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="inputStyle"
            >
              <option value="">Choose...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="labelStyle">Mobile No.</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="inputStyle"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="labelStyle">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="inputStyle"
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="labelStyle">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="inputStyle"
          />
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="labelStyle">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="inputStyle"
            />
          </div>

          <div>
            <label className="labelStyle">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="inputStyle"
            />
          </div>
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="labelStyle">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="inputStyle"
            />
          </div>

          <div>
            <label className="labelStyle">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="inputStyle"
            />
          </div>

          <div>
            <label className="labelStyle">Zip</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="inputStyle"
            />
          </div>
        </div>

        <hr className="border-slate-300 mb-6" />

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button type="submit" className="btnPrimary">
            Register
          </button>

          <button type="button" onClick={handleClear} className="btnDanger">
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
