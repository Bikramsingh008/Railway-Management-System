import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import trainLogoLight from "../assets/trainLogoLight.jpg";
import trainLogoDark from "../assets/trainLogoDark.jpg";

// ─────────────────────────────────────────────────────────────
// TRAIN DATA — runs based on weekly schedule, all year round
// ─────────────────────────────────────────────────────────────
export const TRAIN_DATA = [
  {
    id: 1, trainName: "RailConnect Express",     trainNumber: "RC101",
    source: "Delhi",      destination: "Mumbai",
    departureTime: "06:00", arrivalTime: "22:00",
    days: ["Mon","Wed","Fri","Sun"],
    ticketPrices: { SL: 800, AC3: 1500, AC2: 2200, AC1: 3500 },
    defaultSeats:  { SL: 120, AC3: 72, AC2: 48, AC1: 24 },
  },
  {
    id: 2, trainName: "Himalayan Swift",          trainNumber: "RC102",
    source: "Delhi",      destination: "Dehradun",
    departureTime: "08:00", arrivalTime: "14:00",
    days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    ticketPrices: { SL: 350, AC3: 700, AC2: 1100, AC1: 1800 },
    defaultSeats:  { SL: 150, AC3: 80, AC2: 52, AC1: 20 },
  },
  {
    id: 3, trainName: "Coastal Queen",            trainNumber: "RC103",
    source: "Mumbai",     destination: "Goa",
    departureTime: "07:30", arrivalTime: "15:30",
    days: ["Tue","Thu","Sat"],
    ticketPrices: { SL: 450, AC3: 900, AC2: 1400, AC1: 2200 },
    defaultSeats:  { SL: 130, AC3: 70, AC2: 44, AC1: 18 },
  },
  {
    id: 4, trainName: "Southern Star",            trainNumber: "RC104",
    source: "Chennai",    destination: "Bangalore",
    departureTime: "10:00", arrivalTime: "15:30",
    days: ["Mon","Wed","Fri","Sat"],
    ticketPrices: { SL: 300, AC3: 600, AC2: 950, AC1: 1500 },
    defaultSeats:  { SL: 140, AC3: 76, AC2: 50, AC1: 22 },
  },
  {
    id: 5, trainName: "Gateway Superfast",        trainNumber: "RC105",
    source: "Ahmedabad",  destination: "Mumbai",
    departureTime: "05:30", arrivalTime: "12:30",
    days: ["Mon","Tue","Thu","Fri","Sun"],
    ticketPrices: { SL: 420, AC3: 850, AC2: 1250, AC1: 2000 },
    defaultSeats:  { SL: 135, AC3: 74, AC2: 46, AC1: 20 },
  },
  {
    id: 6, trainName: "Eastern Arrow",            trainNumber: "RC106",
    source: "Kolkata",    destination: "Patna",
    departureTime: "09:15", arrivalTime: "16:00",
    days: ["Mon","Wed","Fri"],
    ticketPrices: { SL: 380, AC3: 750, AC2: 1150, AC1: 1900 },
    defaultSeats:  { SL: 120, AC3: 68, AC2: 42, AC1: 16 },
  },
  {
    id: 7, trainName: "Desert Wind",              trainNumber: "RC107",
    source: "Jaipur",     destination: "Delhi",
    departureTime: "14:00", arrivalTime: "18:30",
    days: ["Tue","Thu","Sat","Sun"],
    ticketPrices: { SL: 250, AC3: 500, AC2: 800, AC1: 1300 },
    defaultSeats:  { SL: 160, AC3: 84, AC2: 56, AC1: 24 },
  },
  {
    id: 8, trainName: "Deccan Pride",             trainNumber: "RC108",
    source: "Pune",       destination: "Hyderabad",
    departureTime: "18:00", arrivalTime: "06:30",
    days: ["Mon","Wed","Fri","Sun"],
    ticketPrices: { SL: 550, AC3: 1000, AC2: 1600, AC1: 2500 },
    defaultSeats:  { SL: 125, AC3: 70, AC2: 44, AC1: 18 },
  },
  {
    id: 9, trainName: "Haldwani Janshatabdi",     trainNumber: "RC109",
    source: "Haldwani",   destination: "Dehradun",
    departureTime: "14:00", arrivalTime: "20:00",
    days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    ticketPrices: { SL: 200, AC3: 450, AC2: 700, AC1: 1100 },
    defaultSeats:  { SL: 180, AC3: 90, AC2: 60, AC1: 28 },
  },
  {
    id: 10, trainName: "Nilgiri Mountain Express", trainNumber: "RC110",
    source: "Coimbatore", destination: "Ooty",
    departureTime: "07:10", arrivalTime: "12:10",
    days: ["Tue","Thu","Sat","Sun"],
    ticketPrices: { SL: 180, AC3: 380, AC2: 600, AC1: 950 },
    defaultSeats:  { SL: 100, AC3: 60, AC2: 36, AC1: 12 },
  },
];

const MidComponent = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  const handleSearch = () => {
    if (!source || !destination || !date) {
      alert("Please fill all fields!");
      return;
    }
    navigate("/search-results", {
      state: { source, destination, date, allTrains: TRAIN_DATA },
    });
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 via-sky-50 to-emerald-50 dark:from-slate-900 dark:via-teal-900/20 dark:to-slate-900 flex items-start justify-center py-30 px-6 pb-28 min-h-[85vh] transition-colors duration-500">

      <div className="flex flex-col lg:flex-row items-center gap-16 max-w-7xl w-full">

        {/* Train Image */}
        <div className="flex justify-center">
          <img
            src={trainLogoLight}
            alt="Train Light"
            className="w-[620px] drop-shadow-xl animate-float block dark:hidden"
            style={{ mixBlendMode: "multiply" }}
          />
          <img
            src={trainLogoDark}
            alt="Train Dark"
            className="w-[620px] drop-shadow-xl animate-float hidden dark:block dark:drop-shadow-[0_20px_20px_rgba(20,184,166,0.3)] rounded-2xl"
          />
        </div>

        {/* Search Card */}
        <div className="bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl w-full max-w-md border border-white/60 dark:border-slate-700/60 transition-colors duration-500">
          <h2 className="text-4xl font-bold text-slate-700 dark:text-slate-100 mb-10 text-center">
            🚆 Search Trains
          </h2>

          <div className="space-y-7">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Source Station"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />

              <button
                onClick={() => {
                  const temp = source;
                  setSource(destination);
                  setDestination(temp);
                }}
                className="p-3 bg-teal-50 text-teal-600 rounded-full hover:bg-teal-100 transition-colors shadow-sm border border-teal-200 flex-shrink-0"
                title="Swap stations"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                </svg>
              </button>

              <Input
                placeholder="Destination Station"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <input
              type="date"
              className="inputStyle"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
            />

            <button
              onClick={handleSearch}
              className="w-full py-4 text-xl font-semibold rounded-xl
                         bg-gradient-to-r from-teal-600 to-emerald-600
                         hover:from-teal-700 hover:to-emerald-700
                         text-white shadow-lg transition-all duration-300
                         hover:scale-[1.02]"
            >
              Search Trains
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Reusable Input */
const Input = ({ placeholder, value, onChange }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="inputStyle"
  />
);

export default MidComponent;
