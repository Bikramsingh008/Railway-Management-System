import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// ✅ Field MUST be outside Register so it doesn't get re-created on every keystroke
const Field = ({ label, name, type = "text", required = false, placeholder = "", formData, errors, onChange, children }) => (
  <div>
    <label className="block mb-1 font-semibold text-sm text-slate-600 dark:text-slate-300">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children || (
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={onChange}
        placeholder={placeholder || label}
        autoComplete="new-password"
        className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200
          bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
          ${errors[name]
            ? "border-rose-400 dark:border-rose-500 focus:ring-2 focus:ring-rose-300"
            : "border-slate-200 dark:border-slate-700 focus:border-teal-400 dark:focus:border-teal-500 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900"
          }`}
      />
    )}
    {errors[name] && (
      <p className="mt-1 text-xs text-rose-500 font-medium">{errors[name]}</p>
    )}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
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

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.username.trim()) newErrors.username = "Username is required.";
    if (formData.username.trim().length < 3) newErrors.username = "Username must be at least 3 characters.";
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Enter a valid email address.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerMessage({ type: "", text: "" });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const usernameExists = existingUsers.find(
      (u) => u.username.toLowerCase() === formData.username.toLowerCase()
    );
    const emailExists = existingUsers.find(
      (u) => u.email.toLowerCase() === formData.email.toLowerCase()
    );

    if (usernameExists) {
      setErrors({ username: "This username is already taken." });
      setLoading(false);
      return;
    }
    if (emailExists) {
      setErrors({ email: "An account with this email already exists." });
      setLoading(false);
      return;
    }

    const newUser = {
      id: Date.now(),
      username: formData.username,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
      birthdate: formData.birthdate,
      gender: formData.gender,
      mobile: formData.mobile,
      country: formData.country,
      state: formData.state,
      zip: formData.zip,
    };

    existingUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

    const sessionUser = { ...newUser };
    delete sessionUser.password;
    localStorage.setItem("user", JSON.stringify(sessionUser));
    window.dispatchEvent(new Event("auth-change"));

    setServerMessage({ type: "success", text: "✅ Account created! Redirecting to your dashboard..." });

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  const handleClear = () => {
    setFormData({
      firstName: "", lastName: "", birthdate: "", gender: "",
      mobile: "", email: "", username: "", password: "",
      confirmPassword: "", country: "", state: "", zip: "",
    });
    setErrors({});
    setServerMessage({ type: "", text: "" });
  };

  // Shared props passed down to Field
  const fieldProps = { formData, errors, onChange: handleChange };

  return (
    <div className="min-h-screen flex justify-center items-start py-10 px-4 transition-colors duration-500
      bg-gradient-to-br from-emerald-50 via-sky-50 to-slate-100
      dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-4xl rounded-3xl shadow-2xl dark:shadow-teal-950/30
          bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
          border border-white/60 dark:border-slate-800
          text-slate-800 dark:text-slate-100
          animate-fadeUp transition-colors duration-300 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-10 py-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            🚆 Create Your Account
          </h2>
          <p className="text-teal-100 mt-1 text-sm">
            Join RailConnect — book train tickets instantly
          </p>
        </div>

        <div className="p-8 space-y-6">

          {/* Server Message */}
          {serverMessage.text && (
            <div className={`px-5 py-4 rounded-xl font-semibold text-sm border animate-fadeUp ${
              serverMessage.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
            }`}>
              {serverMessage.text}
            </div>
          )}

          {/* Section: Personal Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="First Name" name="firstName" required placeholder="e.g. Bikram" {...fieldProps} />
              <Field label="Last Name" name="lastName" placeholder="e.g. Singh" {...fieldProps} />
              <Field label="Birthdate" name="birthdate" type="date" {...fieldProps} />
              <div>
                <label className="block mb-1 font-semibold text-sm text-slate-600 dark:text-slate-300">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200
                    bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
                    border-slate-200 dark:border-slate-700 focus:border-teal-400 dark:focus:border-teal-500
                    focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-900"
                >
                  <option value="">Select gender...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Field label="Mobile No." name="mobile" type="tel" placeholder="e.g. +91 9876543210" {...fieldProps} />
              <Field label="Email Address" name="email" type="email" required placeholder="e.g. bikram@email.com" {...fieldProps} />
            </div>
          </div>

          {/* Section: Account Credentials */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
              Account Credentials
            </h3>
            <div className="grid grid-cols-1 gap-5">
              <Field label="Username" name="username" required placeholder="Choose a unique username (min 3 chars)" {...fieldProps} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Password" name="password" type="password" required placeholder="Min. 6 characters" {...fieldProps} />
                <Field label="Confirm Password" name="confirmPassword" type="password" required placeholder="Re-enter your password" {...fieldProps} />
              </div>
            </div>
          </div>

          {/* Section: Address */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
              Address (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Country" name="country" placeholder="e.g. India" {...fieldProps} />
              <Field label="State" name="state" placeholder="e.g. Uttarakhand" {...fieldProps} />
              <Field label="ZIP / Pincode" name="zip" placeholder="e.g. 263139" {...fieldProps} />
            </div>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none px-10 py-3 rounded-xl font-bold text-white text-base
                bg-gradient-to-r from-teal-600 to-emerald-600
                hover:from-teal-700 hover:to-emerald-700
                transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating Account...
                </span>
              ) : "✅ Register"}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="flex-1 sm:flex-none px-8 py-3 rounded-xl font-bold text-base
                bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
                hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              🗑️ Clear
            </button>

            <p className="text-sm text-slate-500 dark:text-slate-400 sm:ml-auto">
              Already have an account?{" "}
              <Link to="/login" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
                Login →
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
