import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL JOURNEYS");

  useEffect(() => {
    if (user) {
      const allBookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
      const userBookings = allBookings.filter((b) => b.user_id === user.id);
      setBookings(userBookings);
    }
  }, []);

  const formatDate = (dateStr) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const date = new Date(dateStr);
    return isNaN(date) ? dateStr : date.toLocaleDateString('en-US', options);
  };

  if (!user) {
    return (
      <div className="p-10 text-center min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <h2 className="text-2xl font-bold mb-4">You need to log in to view your bookings</h2>
        <Link to="/login" className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold">Log In</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 pb-10 text-slate-800 dark:text-slate-100 transition-colors duration-500">
      <div className="max-w-5xl mx-auto pt-8 px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 uppercase tracking-tight text-slate-800 dark:text-slate-100">Booked Ticket History</h1>
        
        <p className="text-teal-600 dark:text-teal-400 font-medium mb-8 leading-relaxed max-w-4xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 p-4 rounded-2xl">
          🔒 RailConnect or its employees will never ask for your personal banking information,
          Debit/Credit Card number, OTP, ATM PIN, CVV number, PAN number or date of birth.
          Stay safe and book securely with RailConnect.
        </p>

        {/* Tabs */}
        <div className="flex border-b border-slate-300 dark:border-slate-800 mb-8 space-x-8">
          {["ALL JOURNEYS", "UPCOMING", "PAST JOURNEYS"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-bold text-sm tracking-wide transition-colors ${
                activeTab === tab
                  ? "border-b-4 border-orange-500 text-slate-900 dark:text-white font-extrabold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tickets List */}
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              No bookings found.
            </div>
          ) : (
            bookings.map((b) => (
              <div key={b.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/60 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                    {b.train_name} ({b.train_number})
                  </h3>
                  <Link to={`/ticket/${b.id}`} className="flex items-center text-orange-500 dark:text-orange-400 font-extrabold text-sm hover:underline cursor-pointer">
                    <span>PNR: {b.pnr}</span>
                    <svg className="w-5 h-5 ml-2 text-slate-700 dark:text-slate-200 hover:text-orange-500 transition" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      <path d="M12 2v5h5" />
                    </svg>
                  </Link>
                </div>

                {/* Journey Details */}
                <div className="px-6 py-6 flex justify-between items-center text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-1/3">
                    <p className="font-extrabold text-xl text-slate-800 dark:text-slate-100">{b.departure_time} | {b.source}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{formatDate(b.date)}</p>
                  </div>

                  <div className="w-1/3 text-center flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm font-semibold">
                    <span className="w-12 h-0.5 bg-slate-300 dark:bg-slate-700 inline-block mr-2"></span>
                    {b.duration || "N/A"}
                    <span className="w-12 h-0.5 bg-slate-300 dark:bg-slate-700 inline-block ml-2"></span>
                  </div>

                  <div className="w-1/3 text-right">
                    <p className="font-extrabold text-xl text-slate-800 dark:text-slate-100">{b.arrivalTime || b.arrival_time} | {b.destination}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{formatDate(b.date)}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/40 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 mr-1 font-semibold">STATUS:</span>
                      <span className="text-green-600 dark:text-green-400 font-extrabold">{b.status || "CONFIRMED"}</span>
                    </div>
                    {b.class_booked && (
                      <span className="px-2.5 py-0.5 bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-md text-xs font-bold">
                        {b.class_booked}
                      </span>
                    )}
                    {b.total_price > 0 && (
                      <span className="font-extrabold text-slate-800 dark:text-slate-100">
                        ₹{b.total_price}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-semibold">
                    Boarding Station: {b.boarding_station || b.source}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;

