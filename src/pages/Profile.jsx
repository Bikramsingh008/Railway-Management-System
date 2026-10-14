import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LiveTrainTracker from "../components/LiveTrainTracker";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [latestPnr, setLatestPnr] = useState(null);
  const [quickPnrQuery, setQuickPnrQuery] = useState("");
  const [showLiveTracker, setShowLiveTracker] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
      setFormData({
        first_name: storedUser.first_name || "",
        last_name: storedUser.last_name || "",
        email: storedUser.email || "",
        password: "",
      });

      // Find latest booked PNR if available
      try {
        const bookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
        if (bookings.length > 0) {
          setLatestPnr(bookings[bookings.length - 1]);
        }
      } catch (e) {}
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`http://localhost:5000/api/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Profile updated successfully!");
        setIsEditing(false);
        const updatedUser = {
          ...user,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("auth-change"));
      } else {
        setMessage(data.message || "Failed to update profile.");
      }
    } catch (error) {
      // Local storage fallback if server not reachable
      const updatedUser = {
        ...user,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("auth-change"));
      setMessage("Profile saved locally! ✅");
      setIsEditing(false);
    }
  };

  const handleTrackPnr = (e) => {
    e.preventDefault();
    if (!quickPnrQuery.trim()) {
      if (latestPnr) {
        navigate(`/ticket/${latestPnr.id || latestPnr.pnr}`);
      }
      return;
    }
    navigate(`/ticket/${quickPnrQuery.trim()}`);
  };

  if (!user) return null;

  const userInitial = user.first_name
    ? user.first_name.charAt(0).toUpperCase()
    : user.username
    ? user.username.charAt(0).toUpperCase()
    : "P";

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 pt-8 sm:pt-12 px-4 sm:px-6 pb-28 text-slate-800 dark:text-slate-100 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-teal-600 dark:text-teal-400 tracking-wider mb-1">
            <span>● PASSENGER PROFILE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Account
          </h1>
        </div>

        {/* Clean, Elegant Profile Card (No bulky emojis or avatar drawer) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 mb-10 relative transition-all">
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            
            {/* Clean Monogram Profile Initial */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white flex items-center justify-center text-4xl sm:text-5xl font-black shadow-lg shadow-teal-700/20">
                {userInitial}
              </div>
              <span className="mt-3 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-800">
                Passenger Account
              </span>
            </div>

            {/* User Details or Edit Form */}
            <div className="flex-1 text-center md:text-left w-full">
              {!isEditing ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                        {user.first_name || user.username} {user.last_name || ""}
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        @{user.username}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold self-center sm:self-auto">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                      Verified Passenger
                    </span>
                  </div>

                  {/* Clean Dark Mode Styled Email Box (High contrast, no white blob) */}
                  <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 inline-block w-full max-w-md text-left">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                      Registered Email
                    </span>
                    <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 break-all mt-0.5">
                      {user.email || "No email registered"}
                    </p>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow-md text-sm"
                    >
                      Edit Profile
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleUpdate} className="flex flex-col gap-4 max-w-md w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="inputStyle"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="inputStyle"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="inputStyle"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">New Password (optional)</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="inputStyle"
                      placeholder="Leave blank to keep same"
                    />
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button type="submit" className="flex-1 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-md text-sm">
                      Save Changes
                    </button>
                    <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              
              {message && <p className="mt-4 text-emerald-600 dark:text-emerald-400 font-bold text-sm">{message}</p>}
            </div>

          </div>

        </div>

        {/* ── Quick Links ── */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>⚡</span> Quick Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* 1. Booked Ticket History */}
            <Link
              to="/my-bookings"
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-teal-500 transition-all hover:shadow-xl group"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xl mb-3 shadow-sm">
                  🎫
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                  Booked Ticket History
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Review all your upcoming, active, and completed journeys.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                <span>View Bookings</span>
                <span className="text-base group-hover:translate-x-1 transition-transform">➔</span>
              </div>
            </Link>

            {/* 2. My Booking PNR Status */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-teal-500 transition-all hover:shadow-xl group">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xl shadow-sm">
                    🔍
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    PNR Inquiry
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition">
                  My Booking PNR Status
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Track confirmation status and view electronic ticket slip.
                </p>

                {latestPnr ? (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Latest PNR</span>
                    <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300">
                      {latestPnr.pnr} ({latestPnr.train_number})
                    </span>
                  </div>
                ) : null}
              </div>

              <form onSubmit={handleTrackPnr} className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter PNR..."
                  value={quickPnrQuery}
                  onChange={(e) => setQuickPnrQuery(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white rounded-xl text-xs font-bold shadow transition"
                >
                  Track
                </button>
              </form>
            </div>

            {/* 3. Live Train Location Status (Requested by user) */}
            <div
              onClick={() => setShowLiveTracker(true)}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-md border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-teal-500 transition-all hover:shadow-xl cursor-pointer group"
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300 flex items-center justify-center text-xl mb-3 shadow-sm">
                  📍
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition">
                  Live Train Running Status
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">
                  View vertical route map, live station delay, and platform track info.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
                <span>View Route Map</span>
                <span className="text-base group-hover:translate-x-1 transition-transform">➔</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ── Live Train Route Modal ── */}
      {showLiveTracker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeUp">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <LiveTrainTracker
              initialTrainNumber={latestPnr?.train_number || "RC101"}
              onClose={() => setShowLiveTracker(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
