import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/");
    return null;
  }

  const { source, destination, date, allTrains } = state;

  const getWeekDay = (dateString) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[new Date(dateString).getDay()];
  };

  const selectedDay = getWeekDay(date);

  const getDuration = (start, end) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    let startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;
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

  // ✅ IMPORTANT FIX HERE
  const filteredTrains = allTrains.filter((t) =>
    t.source.toLowerCase() === source.toLowerCase() &&
    t.destination.toLowerCase() === destination.toLowerCase() &&
    t.days.includes(selectedDay) &&
    t.seatAvailability?.[date] // ✅ date-wise seat check
  );

  const handleBook = (train) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    navigate("/booking", {
      state: {
        train,
        date,
        seats: train.seatAvailability[date],
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        🚆 Available Trains
      </h2>

      {filteredTrains.length === 0 ? (
        <p className="text-center text-gray-500">
          No trains found for selected date.
        </p>
      ) : (
        filteredTrains.map((t) => {
          const seats = t.seatAvailability[date];

          return (
            <div key={t.id} className="bg-white rounded-xl shadow-md p-6 mb-6">
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h3 className="text-lg font-bold">
                  {t.trainName} ({t.trainNumber})
                </h3>

                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-600">
                    Runs On :
                  </p>
                  {weekMap.map((d) => (
                    <span
                      key={d.key}
                      className={`w-7 h-7 flex items-center justify-center text-xs font-semibold rounded-md border
                        ${
                          t.days.includes(d.key)
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-gray-400 border-gray-300"
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
                  <p className="text-2xl font-bold">{t.departureTime}</p>
                  <p className="text-sm text-gray-600">
                    {t.source} | {selectedDay}, {date}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    {getDuration(t.departureTime, t.arrivalTime)}
                  </p>
                  <div className="w-32 h-px bg-gray-400 my-1 mx-auto"></div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold">{t.arrivalTime}</p>
                  <p className="text-sm text-gray-600">
                    {t.destination} | {selectedDay}, {date}
                  </p>
                </div>
              </div>

              {/* Seats */}
              <div className="flex gap-4 mb-4 flex-wrap">
                <SeatCard label="Sleeper (SL)" value={seats.SL} />
                <SeatCard label="AC 3 Tier (3A)" value={seats.AC3} />
                <SeatCard label="AC 2 Tier (2A)" value={seats.AC2} />
                <SeatCard label="AC First Class (1A)" value={seats.AC1} />
              </div>

              {/* Footer */}
              <div className="flex justify-end border-t pt-4">
                <button
                  onClick={() => handleBook(t)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md"
                >
                  Book Now
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

const SeatCard = ({ label, value }) => (
  <div className="border rounded-lg px-4 py-2">
    <p className="font-semibold">{label}</p>
    <p className="text-sm text-gray-600">Available: {value}</p>
  </div>
);

export default SearchResults;
