import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getWeekDay = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return DAY_NAMES[new Date(year, month - 1, day).getDay()];
};

const getDuration = (start, end) => {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let startMin = sh * 60 + sm;
  let endMin   = eh * 60 + em;
  if (endMin < startMin) endMin += 24 * 60;
  const diff = endMin - startMin;
  return `${Math.floor(diff / 60)}h ${diff % 60}m`;
};

const weekMap = [
  { key: "Mon", label: "M" },
  { key: "Tue", label: "T" },
  { key: "Wed", label: "W" },
  { key: "Thu", label: "T" },
  { key: "Fri", label: "F" },
  { key: "Sat", label: "S" },
  { key: "Sun", label: "S" },
];

const getAvailableSeats = (train, date) => {
  const defaults = train.defaultSeats || { SL: 120, AC3: 72, AC2: 48, AC1: 24 };
  const seats = { ...defaults };

  const allBookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
  const relevantBookings = allBookings.filter(
    (b) => b.train_number === train.trainNumber && b.date === date
  );

  relevantBookings.forEach((b) => {
    const cls = b.class_booked;
    const count = b.passenger_details?.length || 1;
    if (seats[cls] !== undefined) {
      seats[cls] = Math.max(0, seats[cls] - count);
    }
  });

  return seats;
};

const SearchResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedClasses, setSelectedClasses] = useState({});

  if (!state) {
    navigate("/");
    return null;
  }

  const { source, destination, date, allTrains } = state;
  const selectedDay = getWeekDay(date);

  // Filter: matching route AND train runs on that day of the week
  const filteredTrains = allTrains.filter(
    (t) =>
      t.source.toLowerCase() === source.toLowerCase() &&
      t.destination.toLowerCase() === destination.toLowerCase() &&
      t.days.includes(selectedDay)
  );

  const handleBook = (train) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }
    const classBooked = selectedClasses[train.id] || "SL";
    const seats = getAvailableSeats(train, date);
    navigate("/booking", {
      state: { train, date, seats, selectedClass: classBooked },
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-8 text-slate-800 dark:text-slate-100 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">

        {/* Header Breadcrumb & Route Summary */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1">
              <span>● IRCTC TIMETABLE</span>
              <span>·</span>
              <span>DIRECT SERVICES</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{source}</span>
              <span className="text-teal-600 dark:text-teal-400">➔</span>
              <span>{destination}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-semibold">
              Journey Date: <span className="text-teal-700 dark:text-teal-300 font-bold">{selectedDay}, {date}</span>
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
          >
            <span>✏️</span> Modify Search
          </button>
        </div>

        {/* Trains List */}
        {filteredTrains.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-lg">
            <span className="text-6xl mb-4 block animate-bounce">🚆</span>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">No Trains Operating On This Day</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6 text-sm">
              We did not find active services from <strong>{source}</strong> to <strong>{destination}</strong> on <strong>{selectedDay}</strong>. Try choosing another date or neighboring station.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg hover:bg-teal-700 transition"
            >
              Choose Another Date
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Found {filteredTrains.length} Express Train{filteredTrains.length > 1 ? "s" : ""} Available
            </div>

            {filteredTrains.map((t) => {
              const seats = getAvailableSeats(t, date);
              const currentSelection = selectedClasses[t.id] || "SL";

              return (
                <div
                  key={t.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-7 transition-all hover:border-teal-500/40 group relative overflow-hidden"
                >
                  {/* Train Header Strip */}
                  <div className="flex flex-wrap justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 mb-5 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-2xl shadow-md">
                        🚆
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition">
                          {t.trainName}
                        </h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                            #{t.trainNumber}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">
                            Electric Superfast
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Running Days Badges */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">Operating Days:</span>
                      {weekMap.map((d) => (
                        <span
                          key={d.key}
                          title={d.key}
                          className={`w-7 h-7 flex items-center justify-center text-xs font-extrabold rounded-lg border transition ${
                            t.days.includes(d.key)
                              ? d.key === selectedDay
                                ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                                : "bg-emerald-600 text-white border-emerald-600"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {d.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Route & Timing Schedule */}
                  <div className="flex justify-between items-center mb-6 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t.departureTime}</p>
                      <p className="text-sm font-bold text-teal-700 dark:text-teal-400">{t.source}</p>
                      <p className="text-[11px] text-slate-400">Scheduled Departure</p>
                    </div>

                    <div className="text-center flex flex-col items-center px-4">
                      <span className="text-xs font-black text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-3 py-0.5 rounded-full mb-1">
                        {getDuration(t.departureTime, t.arrivalTime)}
                      </span>
                      <div className="flex items-center gap-1 w-24 sm:w-36 my-1">
                        <div className="flex-1 h-0.5 bg-slate-300 dark:bg-slate-700"/>
                        <span className="text-base text-teal-600 dark:text-teal-400">🚅</span>
                        <div className="flex-1 h-0.5 bg-slate-300 dark:bg-slate-700"/>
                      </div>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">● Running On Time</p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{t.arrivalTime}</p>
                      <p className="text-sm font-bold text-sky-700 dark:text-sky-400">{t.destination}</p>
                      <p className="text-[11px] text-slate-400">Scheduled Arrival</p>
                    </div>
                  </div>

                  {/* Coach Class Selectors */}
                  <div className="mb-5">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-2">
                      Select Travel Class &amp; Fare:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(t.ticketPrices || {}).map(([cls, price]) => (
                        <SeatCard
                          key={cls}
                          cls={cls}
                          price={price}
                          available={seats[cls] ?? 0}
                          active={currentSelection === cls}
                          onClick={() => setSelectedClasses((prev) => ({ ...prev, [t.id]: cls }))}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Footer Action Strip */}
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800 gap-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>🛡️ Free cancellation available before chart prep</span>
                    </div>

                    <button
                      onClick={() => handleBook(t)}
                      className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-black shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.03] flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Book ({currentSelection})</span>
                      <span>➔</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

const CLASS_LABELS = {
  SL:  "Sleeper (SL)",
  AC3: "AC 3 Tier (3A)",
  AC2: "AC 2 Tier (2A)",
  AC1: "AC 1st Class (1A)",
};

const SeatCard = ({ cls, price, available, active, onClick }) => (
  <div
    onClick={onClick}
    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all select-none relative ${
      active
        ? "border-teal-500 bg-teal-50/90 dark:bg-teal-950/60 shadow-md shadow-teal-500/10"
        : "border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 bg-white dark:bg-slate-800/60"
    }`}
  >
    <div className="flex justify-between items-start mb-1">
      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
        {CLASS_LABELS[cls] || cls}
      </span>
      {active && (
        <span className="w-2 h-2 rounded-full bg-teal-500"></span>
      )}
    </div>
    <div className="text-lg font-black text-teal-700 dark:text-teal-400">
      ₹{price}
    </div>
    <div className="mt-1 flex items-center gap-1 text-xs font-bold">
      <span className={`w-2 h-2 rounded-full ${available > 0 ? "bg-emerald-500" : "bg-red-500"}`}></span>
      <span className={available > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}>
        {available > 0 ? `AVL ${available}` : "WAITLIST (WL)"}
      </span>
    </div>
  </div>
);

export default SearchResults;
