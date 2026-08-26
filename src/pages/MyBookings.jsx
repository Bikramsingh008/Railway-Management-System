import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL JOURNEYS");

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/bookings/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setBookings(data.bookings);
          }
        })
        .catch(err => console.error("Error fetching bookings:", err));
    }
  }, []);

  const formatDate = (dateStr) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const date = new Date(dateStr);
    return isNaN(date) ? dateStr : date.toLocaleDateString('en-US', options);
  };

  if (!user) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">You need to log in to view your bookings</h2>
        <Link to="/login" className="bg-teal-600 text-white px-6 py-2 rounded-md">Log In</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="max-w-5xl mx-auto pt-8 px-4">
        <h1 className="text-3xl md:text-4xl font-black mb-4 uppercase">Booked Ticket History</h1>
        
        <p className="text-blue-600 font-medium mb-8 leading-relaxed max-w-4xl">
          RailConnect or its employees will never ask for your personal banking information,
          Debit/Credit Card number, OTP, ATM PIN, CVV number, PAN number or date of birth.
          Stay safe and book securely with RailConnect.
        </p>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-8 space-x-8">
          {["ALL JOURNEYS", "UPCOMING", "PAST JOURNEYS"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-bold text-sm tracking-wide transition-colors ${
                activeTab === tab
                  ? "border-b-4 border-orange-500 text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tickets List */}
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="text-center py-10 text-gray-500">No bookings found.</div>
          ) : (
            bookings.map((b) => (
              <div key={b.id} className="bg-white rounded shadow-md border border-gray-200">
                {/* Header */}
                <div className="flex justify-between items-center bg-gray-50 px-6 py-3 border-b border-gray-200 rounded-t">
                  <h3 className="font-bold text-gray-800">
                    {b.train_name} ({b.train_number})
                  </h3>
                  <Link to={`/ticket/${b.id}`} className="flex items-center text-orange-500 font-bold text-sm hover:underline cursor-pointer">
                    <span>PNR: {b.pnr}</span>
                    <svg className="w-5 h-5 ml-3 text-black hover:text-orange-500 transition" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      <path d="M12 2v5h5" />
                    </svg>
                  </Link>
                </div>

                {/* Journey Details */}
                <div className="px-6 py-5 flex justify-between items-center text-gray-800 border-b border-gray-100">
                  <div className="w-1/3">
                    <p className="font-bold text-lg">{b.departure_time} | {b.source}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(b.date)}</p>
                  </div>

                  <div className="w-1/3 text-center flex items-center justify-center text-gray-400 text-sm">
                    <span className="w-12 h-px bg-gray-300 inline-block mr-2"></span>
                    {b.duration || "N/A"}
                    <span className="w-12 h-px bg-gray-300 inline-block ml-2"></span>
                  </div>

                  <div className="w-1/3 text-right">
                    <p className="font-bold text-lg">{b.arrival_time} | {b.destination}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(b.date)}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50 rounded-b flex justify-between items-center text-sm">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-gray-500 mr-1">STATUS:</span>
                      <span className="text-green-700 font-bold">{b.status}</span>
                    </div>
                    {b.class_booked && (
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs font-bold">
                        {b.class_booked}
                      </span>
                    )}
                    {b.total_price > 0 && (
                      <span className="font-bold text-slate-800">
                        ₹{b.total_price}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-700 font-medium">
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
