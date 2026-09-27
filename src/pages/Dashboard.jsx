import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      window.location.href = "/login";
    }
    setUser(storedUser);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-8 text-slate-800 dark:text-slate-100 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-slate-800 dark:text-slate-100">Welcome, {user?.username} 👋</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Link to="/profile" className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all group">
            <span className="text-4xl mb-4 block">👤</span>
            <h2 className="text-2xl font-bold text-teal-600 dark:text-teal-400 group-hover:underline">My Profile</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">View and update your profile details.</p>
          </Link>

          <Link to="/my-bookings" className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all group">
            <span className="text-4xl mb-4 block">🎟️</span>
            <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">My Bookings</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Track past and upcoming train reservations.</p>
          </Link>

          <Link to="/" className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all group">
            <span className="text-4xl mb-4 block">🚆</span>
            <h2 className="text-2xl font-bold text-amber-500 dark:text-amber-400 group-hover:underline">Search Trains</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Find trains and book seats instantly.</p>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;

