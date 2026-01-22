import React, { useEffect, useState } from "react";

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
    <div className="p-6">
      <h1 className="text-3xl font-bold">Welcome {user?.username}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

        <a href="/profile" className="p-6 bg-blue-100 rounded shadow">
          <h2 className="text-xl font-semibold">My Profile</h2>
        </a>

        <a href="/my-bookings" className="p-6 bg-green-100 rounded shadow">
          <h2 className="text-xl font-semibold">My Bookings</h2>
        </a>

        <a href="/trains" className="p-6 bg-yellow-100 rounded shadow">
          <h2 className="text-xl font-semibold">Search Trains</h2>
        </a>

      </div>
    </div>
  );
};

export default Dashboard;
