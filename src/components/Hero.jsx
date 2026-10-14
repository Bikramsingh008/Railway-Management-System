import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import trainLogoLight from "../assets/trainLogoLight.jpg";
import trainLogoDark from "../assets/trainLogoDark.jpg";

// ─────────────────────────────────────────────────────────────
// TRAIN MASTER DATA
// ─────────────────────────────────────────────────────────────
export const TRAIN_DATA = [
  {
    id: 1, trainName: "RailConnect Express", trainNumber: "RC101",
    source: "Delhi", destination: "Mumbai",
    departureTime: "06:00", arrivalTime: "22:00",
    days: ["Mon", "Wed", "Fri", "Sun"],
    ticketPrices: { SL: 800, AC3: 1500, AC2: 2200, AC1: 3500 },
    defaultSeats: { SL: 120, AC3: 72, AC2: 48, AC1: 24 },
  },
  {
    id: 2, trainName: "Himalayan Swift", trainNumber: "RC102",
    source: "Delhi", destination: "Dehradun",
    departureTime: "08:00", arrivalTime: "14:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    ticketPrices: { SL: 350, AC3: 700, AC2: 1100, AC1: 1800 },
    defaultSeats: { SL: 150, AC3: 80, AC2: 52, AC1: 20 },
  },
  {
    id: 3, trainName: "Coastal Queen", trainNumber: "RC103",
    source: "Mumbai", destination: "Goa",
    departureTime: "07:30", arrivalTime: "15:30",
    days: ["Tue", "Thu", "Sat"],
    ticketPrices: { SL: 450, AC3: 900, AC2: 1400, AC1: 2200 },
    defaultSeats: { SL: 130, AC3: 70, AC2: 44, AC1: 18 },
  },
  {
    id: 4, trainName: "Southern Star", trainNumber: "RC104",
    source: "Chennai", destination: "Bangalore",
    departureTime: "10:00", arrivalTime: "15:30",
    days: ["Mon", "Wed", "Fri", "Sat"],
    ticketPrices: { SL: 300, AC3: 600, AC2: 950, AC1: 1500 },
    defaultSeats: { SL: 140, AC3: 76, AC2: 50, AC1: 22 },
  },
  {
    id: 5, trainName: "Gateway Superfast", trainNumber: "RC105",
    source: "Ahmedabad", destination: "Mumbai",
    departureTime: "05:30", arrivalTime: "12:30",
    days: ["Mon", "Tue", "Thu", "Fri", "Sun"],
    ticketPrices: { SL: 420, AC3: 850, AC2: 1250, AC1: 2000 },
    defaultSeats: { SL: 135, AC3: 74, AC2: 46, AC1: 20 },
  },
  {
    id: 6, trainName: "Eastern Arrow", trainNumber: "RC106",
    source: "Kolkata", destination: "Patna",
    departureTime: "09:15", arrivalTime: "16:00",
    days: ["Mon", "Wed", "Fri"],
    ticketPrices: { SL: 380, AC3: 750, AC2: 1150, AC1: 1900 },
    defaultSeats: { SL: 120, AC3: 68, AC2: 42, AC1: 16 },
  },
  {
    id: 7, trainName: "Desert Wind", trainNumber: "RC107",
    source: "Jaipur", destination: "Delhi",
    departureTime: "14:00", arrivalTime: "18:30",
    days: ["Tue", "Thu", "Sat", "Sun"],
    ticketPrices: { SL: 250, AC3: 500, AC2: 800, AC1: 1300 },
    defaultSeats: { SL: 160, AC3: 84, AC2: 56, AC1: 24 },
  },
  {
    id: 8, trainName: "Deccan Pride", trainNumber: "RC108",
    source: "Pune", destination: "Hyderabad",
    departureTime: "18:00", arrivalTime: "06:30",
    days: ["Mon", "Wed", "Fri", "Sun"],
    ticketPrices: { SL: 550, AC3: 1000, AC2: 1600, AC1: 2500 },
    defaultSeats: { SL: 125, AC3: 70, AC2: 44, AC1: 18 },
  },
  {
    id: 9, trainName: "Haldwani Janshatabdi", trainNumber: "RC109",
    source: "Haldwani", destination: "Dehradun",
    departureTime: "14:00", arrivalTime: "20:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    ticketPrices: { SL: 200, AC3: 450, AC2: 700, AC1: 1100 },
    defaultSeats: { SL: 180, AC3: 90, AC2: 60, AC1: 28 },
  },
  {
    id: 10, trainName: "Nilgiri Mountain Express", trainNumber: "RC110",
    source: "Coimbatore", destination: "Ooty",
    departureTime: "07:10", arrivalTime: "12:10",
    days: ["Tue", "Thu", "Sat", "Sun"],
    ticketPrices: { SL: 180, AC3: 380, AC2: 600, AC1: 950 },
    defaultSeats: { SL: 100, AC3: 60, AC2: 36, AC1: 12 },
  },
];

const POPULAR_ROUTES = [
  { from: "Delhi", to: "Mumbai" },
  { from: "Mumbai", to: "Goa" },
  { from: "Chennai", to: "Bangalore" },
  { from: "Ahmedabad", to: "Mumbai" },
  { from: "Kolkata", to: "Patna" },
  { from: "Jaipur", to: "Delhi" },
];

const STATIONS_LIST = [
  "Delhi", "Mumbai", "Goa", "Chennai", "Bangalore",
  "Ahmedabad", "Kolkata", "Patna", "Jaipur", "Pune",
  "Hyderabad", "Dehradun", "Haldwani", "Coimbatore", "Ooty"
];

const MidComponent = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [quota, setQuota] = useState("GENERAL");
  const [trainClass, setTrainClass] = useState("ALL");
  const [swapRotating, setSwapRotating] = useState(false);
  const navigate = useNavigate();

  // Today in YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  const handleSwap = () => {
    setSwapRotating(true);
    const temp = source;
    setSource(destination);
    setDestination(temp);
    setTimeout(() => setSwapRotating(false), 300);
  };

  const handleQuickRoute = (from, to) => {
    setSource(from);
    setDestination(to);
    if (!date) {
      setDate(today);
    }
  };

  const setQuickDate = (offsetDays) => {
    const target = new Date();
    target.setDate(target.getDate() + offsetDays);
    setDate(target.toISOString().split("T")[0]);
  };

  const handleSearch = () => {
    if (!source || !destination || !date) {
      alert("Please enter Source, Destination, and Journey Date!");
      return;
    }
    navigate("/search-results", {
      state: { source, destination, date, allTrains: TRAIN_DATA, quota, trainClass },
    });
  };

  return (
    <div className="bg-gradient-to-b from-teal-50 via-sky-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-10 sm:py-16 px-4 sm:px-6 min-h-[90vh] transition-colors duration-500">
      
      {/* ── Main Hero Container ── */}
      <div className="max-w-7xl mx-auto">

        {/* Top Tagline */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100/80 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-700 text-teal-800 dark:text-teal-300 text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-3 shadow-sm">
            <span>⚡</span> Indian Railways Next-Gen Booking Engine
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
            Book Train Tickets <span className="text-teal-600 dark:text-teal-400">At Speed</span>
          </h1>
        </div>

        {/* Split Layout: Interactive Train Showcase + Booking Terminal Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">

          {/* LEFT COLUMN: Modern Locomotive Showcase & Live Route Board */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Visual Train Card with Glowing Aura */}
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-gradient-to-br from-white/90 to-teal-50/70 dark:from-slate-900/90 dark:to-slate-800/80 backdrop-blur-xl border-2 border-teal-500/20 dark:border-teal-500/30 p-6 shadow-2xl group transition-all">
              
              {/* Status Header */}
              <div className="flex justify-between items-center mb-3">
                <span className="flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  High-Speed Fleet Active
                </span>
                <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Vande Bharat Class
                </span>
              </div>

              {/* Train Image Showcase with Cropping/Frame that looks clean in both themes */}
              <div className="relative overflow-hidden rounded-2xl flex items-center justify-center p-2 bg-gradient-to-b from-teal-500/5 to-teal-500/10 dark:bg-slate-950/60">
                {/* Light Mode Train with neat rounded presentation */}
                <div className="block dark:hidden overflow-hidden rounded-xl">
                  <img
                    src={trainLogoLight}
                    alt="High-Speed Indian Railways Train"
                    className="w-full max-h-[260px] object-cover rounded-xl animate-float"
                    style={{
                      objectPosition: "center 20%",
                    }}
                  />
                </div>

                {/* Dark Mode Train */}
                <div className="hidden dark:block overflow-hidden rounded-xl">
                  <img
                    src={trainLogoDark}
                    alt="High-Speed Indian Railways Train"
                    className="w-full max-h-[260px] object-cover rounded-xl animate-float drop-shadow-[0_15px_25px_rgba(20,184,166,0.35)]"
                  />
                </div>
              </div>

              {/* Live Route Telemetry Grid */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs">
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase">Speed</span>
                  <span className="font-black text-teal-600 dark:text-teal-400 text-sm">160 km/h</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase">Punctuality</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">99.8%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-bold uppercase">Traction</span>
                  <span className="font-black text-sky-600 dark:text-sky-400 text-sm">100% Electric</span>
                </div>
              </div>

              {/* Scrolling Live Train Departure Board Ticker */}
              <div className="mt-4 p-2.5 rounded-xl bg-slate-900 text-teal-300 font-mono text-xs overflow-hidden border border-teal-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-red-400 animate-pulse font-bold">● LIVE:</span>
                  <marquee className="font-semibold text-[11px] text-teal-200">
                    RC101 RailConnect Exp [Delhi ➔ Mumbai] • ON TIME (Plat 1) &nbsp;||&nbsp;
                    RC102 Himalayan Swift [Delhi ➔ Dehradun] • BOARDING (Plat 4) &nbsp;||&nbsp;
                    RC103 Coastal Queen [Mumbai ➔ Goa] • ON TIME (Plat 2) &nbsp;||&nbsp;
                    RC104 Southern Star [Chennai ➔ Bangalore] • ON TIME (Plat 5)
                  </marquee>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Next-Gen Railway Booking Terminal Form */}
          <div className="lg:col-span-6 flex justify-center">
            
            <div className="w-full max-w-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-teal-500/20 dark:border-teal-500/40 relative">
              
              {/* Form Title & Indicator */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🚆</span> Search Trains
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select stations, date, and reserve your seat instantly
                  </p>
                </div>
                <span className="bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-bold px-3 py-1 rounded-full">
                  IRCTC Core
                </span>
              </div>


              {/* Station Inputs with Swap Button */}
              <div className="space-y-4">
                
                {/* Source & Destination Row */}
                <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  
                  {/* Source Station */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide block mb-1">
                      From Station
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-base">🟢</span>
                      <input
                        type="text"
                        placeholder="e.g. Delhi"
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                        list="source-stations"
                        className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
                      />
                      <datalist id="source-stations">
                        {STATIONS_LIST.map((st) => (
                          <option key={st} value={st} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* Station Swap Button (Floating between inputs on sm screens) */}
                  <div className="hidden sm:flex absolute left-1/2 top-7 -translate-x-1/2 z-10">
                    <button
                      type="button"
                      onClick={handleSwap}
                      className={`p-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg border-2 border-white dark:border-slate-900 transition-all ${
                        swapRotating ? "rotate-180" : ""
                      }`}
                      title="Swap Source and Destination"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </button>
                  </div>

                  {/* Destination Station */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide block mb-1">
                      To Station
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-base">🔴</span>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        list="dest-stations"
                        className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
                      />
                      <datalist id="dest-stations">
                        {STATIONS_LIST.map((st) => (
                          <option key={st} value={st} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                </div>

                {/* Journey Date & Quick Date Chips */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                      Journey Date
                    </label>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setQuickDate(0)}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-100 dark:hover:bg-teal-950 font-bold"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickDate(1)}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-100 dark:hover:bg-teal-950 font-bold"
                      >
                        Tomorrow
                      </button>
                    </div>
                  </div>
                  <input
                    type="date"
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>

                {/* Class & Quota Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide block mb-1">
                      Travel Class
                    </label>
                    <select
                      value={trainClass}
                      onChange={(e) => setTrainClass(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="ALL">All Travel Classes</option>
                      <option value="SL">Sleeper (SL)</option>
                      <option value="AC3">AC 3 Tier (3A)</option>
                      <option value="AC2">AC 2 Tier (2A)</option>
                      <option value="AC1">AC 1st Class (1A)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide block mb-1">
                      Quota
                    </label>
                    <select
                      value={quota}
                      onChange={(e) => setQuota(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="GENERAL">General (GN)</option>
                      <option value="TATKAL">Tatkal (TQ)</option>
                      <option value="LADIES">Ladies (LD)</option>
                      <option value="SENIOR">Senior Citizen (SS)</option>
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full py-4 text-lg font-black rounded-2xl
                             bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600
                             hover:from-teal-700 hover:via-teal-800 hover:to-emerald-700
                             text-white shadow-xl shadow-teal-700/30 transition-all duration-300
                             hover:scale-[1.02] flex items-center justify-center gap-2 mt-2"
                >
                  <span>🔍</span> Search Available Trains
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* ── Feature Trust Strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur shadow-sm">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white">Instant ERS Ticket</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">PDF &amp; Print Ready</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur shadow-sm">
            <span className="text-2xl">🛡️</span>
            <div>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white">Zero Convenience Fee</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">On UPI &amp; NetBanking</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur shadow-sm">
            <span className="text-2xl">🟢</span>
            <div>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white">Live Availability</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Direct Seat Decrement</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur shadow-sm">
            <span className="text-2xl">📞</span>
            <div>
              <p className="font-extrabold text-sm text-slate-900 dark:text-white">RailMadad 139</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">24x7 Railway Help</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default MidComponent;
