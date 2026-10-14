import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LiveTrainTracker from "../components/LiveTrainTracker";

const MyBookings = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL JOURNEYS");
  const [liveTrackerTrain, setLiveTrackerTrain] = useState(null);

  useEffect(() => {
    if (user) {
      const allBookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
      const userBookings = allBookings.filter(
        (b) => !b.user_id || b.user_id === user.id
      );
      setBookings(userBookings.length > 0 ? userBookings : allBookings);
    }
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateStr);
    return isNaN(date) ? dateStr : date.toLocaleDateString('en-IN', options);
  };

  // Helper to determine status and seat details
  const getTicketStatusInfo = (booking) => {
    const isPast = booking.date && booking.date < todayStr;
    const passengers =
      typeof booking.passenger_details === "string"
        ? JSON.parse(booking.passenger_details)
        : booking.passenger_details || [];

    // Assign realistic coach & berth if not present
    const coachPrefix = booking.class_booked === "AC1" ? "H1" : booking.class_booked === "AC2" ? "A1" : booking.class_booked === "AC3" ? "B2" : "S4";
    const seatInfo = passengers.map((p, idx) => ({
      name: p.name || `Passenger ${idx + 1}`,
      coach: coachPrefix,
      berth: 12 + idx * 3,
      type: p.berth || (idx % 2 === 0 ? "Lower Berth" : "Upper Berth"),
    }));

    if (isPast) {
      return {
        status: "COMPLETED",
        badgeBg: "bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900",
        message: "Journey Completed",
        seatInfo,
      };
    } else {
      return {
        status: "CONFIRMED",
        badgeBg: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900",
        message: "Confirmed (Upcoming Trip)",
        seatInfo,
      };
    }
  };

  // Filter based on selected tab
  const filteredBookings = bookings.filter((b) => {
    const isPast = b.date && b.date < todayStr;
    if (activeTab === "UPCOMING") return !isPast;
    if (activeTab === "COMPLETED") return isPast;
    return true; // ALL JOURNEYS
  });

  if (!user) {
    return (
      <div className="p-10 text-center min-h-[80vh] flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-200 dark:border-slate-800">
          <span className="text-5xl block mb-3">🎫</span>
          <h2 className="text-2xl font-bold mb-2">Login Required</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Please log into your passenger account to view your confirmed train bookings and download tickets.
          </p>
          <Link to="/login" className="block w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg transition">
            Login to RailConnect
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 pb-16 text-slate-800 dark:text-slate-100 transition-colors duration-500">
      <div className="max-w-5xl mx-auto pt-8 px-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-teal-600 dark:text-teal-400 tracking-wider">
              <span>● PASSENGER RESERVATION ARCHIVE</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
              My Train Bookings
            </h1>
          </div>

          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2"
          >
            <span>🚆</span> Book New Ticket
          </button>
        </div>
        
        {/* Security Banner */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-900 dark:to-teal-950/40 border border-teal-200 dark:border-teal-900/60 p-4 rounded-2xl mb-6 flex items-start gap-3 shadow-sm">
          <span className="text-2xl flex-shrink-0">🔒</span>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            <strong>Security Reminder:</strong> RailConnect and Indian Railways will never ask for your debit/credit card CVV, PIN, or OTP. Carry a valid photo ID proof while traveling with electronic reservation slips.
          </p>
        </div>

        {/* Journey Tabs */}
        <div className="flex border-b border-slate-300 dark:border-slate-800 mb-8 space-x-8 text-sm">
          {["ALL JOURNEYS", "UPCOMING", "COMPLETED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-bold tracking-wide transition-colors relative ${
                activeTab === tab
                  ? "text-teal-600 dark:text-teal-400 font-extrabold border-b-2 border-teal-500"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tickets List */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
              <span className="text-5xl block mb-3">🎫</span>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
                No {activeTab.toLowerCase()} bookings found
              </p>
              <p className="text-xs max-w-sm mx-auto mb-6">
                You have no tickets under this category. Search routes to reserve a seat!
              </p>
              <Link to="/" className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition text-sm">
                Search Trains
              </Link>
            </div>
          ) : (
            filteredBookings.map((b) => {
              const statusInfo = getTicketStatusInfo(b);

              return (
                <div
                  key={b.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all hover:border-teal-500/50 relative"
                >
                  {/* Clean High-Contrast Card Header (Fixed white-on-white bug!) */}
                  <div className="flex flex-wrap justify-between items-center bg-slate-100 dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🚆</span>
                      <div>
                        {/* High contrast: slate-900 in light mode, white in dark mode */}
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                          {b.train_name}
                        </h3>
                        <p className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">
                          Train #{b.train_number}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">PNR Number</span>
                        <span className="font-mono font-black text-teal-700 dark:text-teal-400 text-sm">
                          {b.pnr}
                        </span>
                      </div>

                      {/* Live Running Status Button */}
                      <button
                        onClick={() => setLiveTrackerTrain(b.train_number || "RC101")}
                        className="px-3.5 py-2 bg-sky-50 dark:bg-sky-950/80 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-xl font-bold text-xs transition flex items-center gap-1.5"
                        title="View Live Station Track Map"
                      >
                        <span>📍</span>
                        <span>Live Status</span>
                      </button>

                      <Link
                        to={`/ticket/${b.id}`}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center gap-1.5"
                      >
                        <span>⬇️</span>
                        <span>Download PDF</span>
                      </Link>
                    </div>
                  </div>

                  {/* Journey Details */}
                  <div className="px-6 py-6 flex flex-col sm:flex-row justify-between items-center text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 gap-4">
                    <div className="w-full sm:w-1/3 text-left">
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{b.departure_time}</p>
                      <p className="font-extrabold text-teal-700 dark:text-teal-400 text-base">{b.source}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">{formatDate(b.date)}</p>
                    </div>

                    <div className="w-full sm:w-1/3 text-center flex flex-col items-center">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-0.5 rounded-full mb-1">
                        {b.duration || "Direct"}
                      </span>
                      <div className="flex items-center w-full justify-center">
                        <div className="flex-1 h-0.5 bg-slate-300 dark:bg-slate-700"/>
                        <span className="mx-2 text-base text-teal-600">🚅</span>
                        <div className="flex-1 h-0.5 bg-slate-300 dark:bg-slate-700"/>
                      </div>
                    </div>

                    <div className="w-full sm:w-1/3 text-left sm:text-right">
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{b.arrivalTime || b.arrival_time}</p>
                      <p className="font-extrabold text-sky-700 dark:text-sky-400 text-base">{b.destination}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">{formatDate(b.date)}</p>
                    </div>
                  </div>

                  {/* Seat Details & Status Strip */}
                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 flex flex-wrap justify-between items-center text-xs gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Dynamic Status: COMPLETED vs CONFIRMED */}
                      <span className={`inline-flex items-center gap-1 font-black px-3 py-1 rounded-lg border text-xs ${statusInfo.badgeBg}`}>
                        <span>{statusInfo.status === "COMPLETED" ? "✔" : "●"}</span>
                        <span>{statusInfo.status}</span>
                      </span>

                      {/* Coach and Seat details */}
                      <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        <span className="text-teal-600 font-extrabold">Seat Details:</span>
                        <span>
                          {statusInfo.seatInfo.map((s) => `${s.coach}-${s.berth} (${s.type})`).join(", ")}
                        </span>
                      </div>

                      {b.class_booked && (
                        <span className="px-2.5 py-1 bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-lg font-bold">
                          Class: {b.class_booked}
                        </span>
                      )}

                      {b.total_price > 0 && (
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          Fare: ₹{b.total_price}
                        </span>
                      )}
                    </div>

                    <div>
                      <Link
                        to={`/ticket/${b.id}`}
                        className="text-teal-600 dark:text-teal-400 font-extrabold hover:underline flex items-center gap-1"
                      >
                        <span>View ERS Ticket</span>
                        <span>➔</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* ── Live Train Route Modal ── */}
      {liveTrackerTrain && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeUp">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <LiveTrainTracker
              initialTrainNumber={liveTrackerTrain}
              onClose={() => setLiveTrackerTrain(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default MyBookings;
