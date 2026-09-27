import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "", // Optional password change
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
        password: "", // Keep password blank initially
      });
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
        // Update local state and localStorage
        const updatedUser = { ...user, first_name: formData.first_name, last_name: formData.last_name, email: formData.email };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setMessage(data.message || "Failed to update profile.");
      }
    } catch (error) {
      setMessage("Server error. Try again later.");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 pt-10 px-4 pb-20 text-slate-800 dark:text-slate-100 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-8">My Profile Dashboard</h1>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-8 mb-8 flex flex-col items-center gap-8 md:flex-row relative transition-all">
          
          <div className="w-24 h-24 bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center text-4xl font-black uppercase shadow-sm border border-teal-200 dark:border-teal-800">
            {user.username.charAt(0)}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            {!isEditing ? (
              <>
                <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{user.first_name} {user.last_name}</h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 mt-1 font-medium">@{user.username}</p>
                <p className="text-slate-600 dark:text-slate-300 mt-2">{user.email}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-5 px-6 py-2.5 bg-teal-600 dark:bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-700 dark:hover:bg-teal-600 transition shadow-md"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleUpdate} className="flex flex-col gap-4 max-w-md w-full">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-300 font-semibold block mb-1">First Name</label>
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
                    <label className="text-sm text-slate-600 dark:text-slate-300 font-semibold block mb-1">Last Name</label>
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
                  <label className="text-sm text-slate-600 dark:text-slate-300 font-semibold block mb-1">Email</label>
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
                  <label className="text-sm text-slate-600 dark:text-slate-300 font-semibold block mb-1">New Password (optional)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="inputStyle"
                    placeholder="Leave blank to keep same"
                  />
                </div>
                <div className="flex gap-4 mt-2">
                  <button type="submit" className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-bold shadow-md">
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            )}
            
            {message && <p className="mt-4 text-emerald-600 dark:text-emerald-400 font-semibold">{message}</p>}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/my-bookings" className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between hover:shadow-xl transition-all group">
            <div>
              <h4 className="text-xl font-bold text-teal-600 dark:text-teal-400">Booked Ticket History</h4>
              <p className="text-slate-500 dark:text-slate-400 mt-1">View all your upcoming and past journeys.</p>
            </div>
            <span className="text-2xl text-slate-400 dark:text-slate-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transform group-hover:translate-x-1 transition-all">→</span>
          </Link>
          
          <Link to="/" className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between hover:shadow-xl transition-all group">
            <div>
              <h4 className="text-xl font-bold text-orange-500 dark:text-orange-400">Search New Train</h4>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Book a new ticket for your next trip.</p>
            </div>
            <span className="text-2xl text-slate-400 dark:text-slate-500 group-hover:text-orange-500 dark:group-hover:text-orange-400 transform group-hover:translate-x-1 transition-all">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;

