import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getWeekDay = (dateString) => {
  // Use local date parsing to avoid timezone offset issues
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

// ─────────────────────────────────────────────────────────────
// Get available seats for a train on a specific date.
// Uses booked tickets from localStorage to subtract from defaults.
// ─────────────────────────────────────────────────────────────
const getAvailableSeats = (train, date) => {
  const defaults = train.defaultSeats || { SL: 120, AC3: 72, AC2: 48, AC1: 24 };
  const seats = { ...defaults };

  // Subtract already-booked seats for this train + date
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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-6 text-slate-800 dark:text-slate-100 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
            Available Trains
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {source} → {destination} &nbsp;·&nbsp;
            <span className="font-semibold text-teal-600 dark:text-teal-400">{selectedDay}, {date}</span>
          </p>
        </div>

        {filteredTrains.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
            <p className="text-5xl mb-4">🚫</p>
            <p className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No trains found</p>
            <p className="text-slate-500 dark:text-slate-400">
              No trains run on <strong>{selectedDay}</strong> from <strong>{source}</strong> to <strong>{destination}</strong>.
            </p>
          </div>
        ) : (
          filteredTrains.map((t) => {
            const seats = getAvailableSeats(t, date);
            const currentSelection = selectedClasses[t.id] || "SL";

            return (
              <div key={t.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 mb-6 transition-all hover:shadow-xl">

                {/* Train Header */}
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      {t.trainName}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">#{t.trainNumber}</p>
                  </div>

                  {/* Days row */}
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mr-1">Runs:</p>
                    {weekMap.map((d) => (
                      <span
                        key={d.key}
                        title={d.key}
                        className={`w-7 h-7 flex items-center justify-center text-xs font-semibold rounded-md border
                          ${t.days.includes(d.key)
                            ? d.key === selectedDay
                              ? "bg-orange-500 text-white border-orange-500"
                              : "bg-emerald-600 text-white border-emerald-600"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700"
                          }`}
                      >
                        {d.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Time Row */}
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{t.departureTime}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t.source}</p>
                  </div>

                  <div className="text-center flex flex-col items-center">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {getDuration(t.departureTime, t.arrivalTime)}
                    </p>
                    <div className="flex items-center gap-1 my-1">
                      <div className="w-16 h-0.5 bg-slate-300 dark:bg-slate-700"/>
                      <span className="text-slate-400">✈</span>
                      <div className="w-16 h-0.5 bg-slate-300 dark:bg-slate-700"/>
                    </div>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">{selectedDay}, {date}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{t.arrivalTime}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t.destination}</p>
                  </div>
                </div>

                {/* Seat Class Selector */}
                <div className="flex gap-3 mb-4 flex-wrap">
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

                {/* Book Button */}
                <div className="flex justify-end border-t border-slate-200 dark:border-slate-800 pt-4">
                  <button
                    onClick={() => handleBook(t)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:scale-[1.02]"
                  >
                    Book Now →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const CLASS_LABELS = {
  SL:  "Sleeper (SL)",
  AC3: "AC 3 Tier (3A)",
  AC2: "AC 2 Tier (2A)",
  AC1: "AC First Class (1A)",
};

const SeatCard = ({ cls, price, available, active, onClick }) => (
  <div
    onClick={onClick}
    className={`border rounded-xl px-5 py-3 cursor-pointer transition-all select-none flex-1 min-w-[130px]
      ${active
        ? "border-teal-500 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 font-bold shadow-sm"
        : "border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300"
      }`}
  >
    <p className="font-bold text-sm">{CLASS_LABELS[cls] || cls}</p>
    <p className={`text-xs mt-0.5 font-semibold ${active ? "text-teal-600 dark:text-teal-400" : "text-slate-500 dark:text-slate-400"}`}>
      ₹{price}
    </p>
    <p className={`text-xs mt-0.5 ${available > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"} font-semibold`}>
      {available > 0 ? `${available} seats avail.` : "Waitlisted"}
    </p>
  </div>
);

export default SearchResults;
