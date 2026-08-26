import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-10 px-4 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-4xl font-bold uppercase shadow-sm">
            {user.username.charAt(0)}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-800">{user.first_name} {user.last_name}</h2>
            <p className="text-lg text-gray-500 mt-1">@{user.username}</p>
            <p className="text-gray-600 mt-2">{user.email}</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/my-bookings" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow group">
            <div>
              <h4 className="text-xl font-bold text-teal-700">Booked Ticket History</h4>
              <p className="text-gray-500 mt-1">View all your upcoming and past journeys.</p>
            </div>
            <span className="text-2xl transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          
          <Link to="/" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between hover:shadow-md transition-shadow group">
            <div>
              <h4 className="text-xl font-bold text-orange-600">Search New Train</h4>
              <p className="text-gray-500 mt-1">Book a new ticket for your next trip.</p>
            </div>
            <span className="text-2xl transform group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
