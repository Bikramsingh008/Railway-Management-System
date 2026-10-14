import React, { useState } from "react";
import { TRAIN_DATA } from "./Hero";

// Station schedules with distance, stations, and realistic timetable data for each train
const TRAIN_ROUTE_TIMETABLES = {
  RC101: {
    trainNumber: "RC101",
    trainName: "RailConnect Express",
    source: "Delhi",
    destination: "Mumbai",
    currentStationIndex: 2, // currently between station 2 and 3
    delayMinutes: 18,
    lastUpdate: "2 mins ago",
    currentStatusText: "Departed from Mathura Jn (MTJ)",
    stations: [
      { name: "New Delhi", code: "NDLS", km: 0, schArr: "--:--", schDep: "06:00", actArr: "--:--", actDep: "06:00", pf: "PF 1", status: "passed" },
      { name: "Faridabad", code: "FDB", km: 28, schArr: "06:30", schDep: "06:32", actArr: "06:30", actDep: "06:32", pf: "PF 3", status: "passed" },
      { name: "Mathura Jn", code: "MTJ", km: 141, schArr: "07:55", schDep: "08:00", actArr: "08:12", actDep: "08:18", pf: "PF 2", status: "current" },
      { name: "Kota Jn", code: "KOTA", km: 465, schArr: "11:50", schDep: "12:00", actArr: "12:08", actDep: "12:18", pf: "PF 1", status: "upcoming" },
      { name: "Ratlam Jn", code: "RTM", km: 732, schArr: "15:40", schDep: "15:45", actArr: "15:58", actDep: "16:03", pf: "PF 4", status: "upcoming" },
      { name: "Vadodara Jn", code: "BRC", km: 993, schArr: "19:15", schDep: "19:25", actArr: "19:33", actDep: "19:43", pf: "PF 2", status: "upcoming" },
      { name: "Surat", code: "ST", km: 1122, schArr: "20:45", schDep: "20:50", actArr: "21:03", actDep: "21:08", pf: "PF 1", status: "upcoming" },
      { name: "Mumbai Central", code: "MMCT", km: 1385, schArr: "22:00", schDep: "--:--", actArr: "22:18", actDep: "--:--", pf: "PF 5", status: "upcoming" },
    ]
  },
  RC102: {
    trainNumber: "RC102",
    trainName: "Himalayan Swift",
    source: "Delhi",
    destination: "Dehradun",
    currentStationIndex: 1,
    delayMinutes: 0,
    lastUpdate: "Just now",
    currentStatusText: "Running On Time - Approaching Meerut City (MTC)",
    stations: [
      { name: "New Delhi", code: "NDLS", km: 0, schArr: "--:--", schDep: "08:00", actArr: "--:--", actDep: "08:00", pf: "PF 4", status: "passed" },
      { name: "Ghaziabad Jn", code: "GZB", km: 24, schArr: "08:35", schDep: "08:37", actArr: "08:35", actDep: "08:37", pf: "PF 2", status: "passed" },
      { name: "Meerut City", code: "MTC", km: 71, schArr: "09:20", schDep: "09:25", actArr: "09:20", actDep: "09:25", pf: "PF 1", status: "current" },
      { name: "Muzaffarnagar", code: "MOZ", km: 126, schArr: "10:10", schDep: "10:12", actArr: "10:10", actDep: "10:12", pf: "PF 2", status: "upcoming" },
      { name: "Saharanpur Jn", code: "SRE", km: 184, schArr: "11:15", schDep: "11:25", actArr: "11:15", actDep: "11:25", pf: "PF 3", status: "upcoming" },
      { name: "Haridwar Jn", code: "HW", km: 259, schArr: "12:45", schDep: "12:55", actArr: "12:45", actDep: "12:55", pf: "PF 1", status: "upcoming" },
      { name: "Dehradun", code: "DDN", km: 311, schArr: "14:00", schDep: "--:--", actArr: "14:00", actDep: "--:--", pf: "PF 2", status: "upcoming" },
    ]
  },
  RC103: {
    trainNumber: "RC103",
    trainName: "Coastal Queen",
    source: "Mumbai",
    destination: "Goa",
    currentStationIndex: 2,
    delayMinutes: 12,
    lastUpdate: "3 mins ago",
    currentStatusText: "Crossed Roha Jn (ROHA)",
    stations: [
      { name: "Mumbai CSMT", code: "CSMT", km: 0, schArr: "--:--", schDep: "07:30", actArr: "--:--", actDep: "07:30", pf: "PF 7", status: "passed" },
      { name: "Panvel Jn", code: "PNVL", km: 68, schArr: "08:25", schDep: "08:28", actArr: "08:25", actDep: "08:28", pf: "PF 5", status: "passed" },
      { name: "Roha Jn", code: "ROHA", km: 143, schArr: "09:35", schDep: "09:40", actArr: "09:47", actDep: "09:52", pf: "PF 2", status: "current" },
      { name: "Khed", code: "KHED", km: 242, schArr: "11:00", schDep: "11:02", actArr: "11:12", actDep: "11:14", pf: "PF 1", status: "upcoming" },
      { name: "Ratnagiri", code: "RN", km: 347, schArr: "12:35", schDep: "12:40", actArr: "12:47", actDep: "12:52", pf: "PF 2", status: "upcoming" },
      { name: "Kankavali", code: "KKW", km: 459, schArr: "14:15", schDep: "14:17", actArr: "14:27", actDep: "14:29", pf: "PF 1", status: "upcoming" },
      { name: "Madgaon Goa", code: "MAO", km: 579, schArr: "15:30", schDep: "--:--", actArr: "15:42", actDep: "--:--", pf: "PF 3", status: "upcoming" },
    ]
  },
  RC104: {
    trainNumber: "RC104",
    trainName: "Southern Star",
    source: "Chennai",
    destination: "Bangalore",
    currentStationIndex: 1,
    delayMinutes: 0,
    lastUpdate: "Just now",
    currentStatusText: "On Time - Departed Arakkonam Jn (AJJ)",
    stations: [
      { name: "Chennai Central", code: "MAS", km: 0, schArr: "--:--", schDep: "10:00", actArr: "--:--", actDep: "10:00", pf: "PF 2", status: "passed" },
      { name: "Arakkonam Jn", code: "AJJ", km: 69, schArr: "10:55", schDep: "10:57", actArr: "10:55", actDep: "10:57", pf: "PF 1", status: "current" },
      { name: "Katpadi Jn", code: "KPD", km: 130, schArr: "11:45", schDep: "11:50", actArr: "11:45", actDep: "11:50", pf: "PF 1", status: "upcoming" },
      { name: "Jolarpettai Jn", code: "JTJ", km: 214, schArr: "13:00", schDep: "13:05", actArr: "13:00", actDep: "13:05", pf: "PF 2", status: "upcoming" },
      { name: "Bangarapet", code: "BWT", km: 289, schArr: "14:10", schDep: "14:12", actArr: "14:10", actDep: "14:12", pf: "PF 3", status: "upcoming" },
      { name: "Bengaluru Cant", code: "BNC", km: 355, schArr: "15:15", schDep: "15:17", actArr: "15:15", actDep: "15:17", pf: "PF 2", status: "upcoming" },
      { name: "KSR Bengaluru", code: "SBC", km: 362, schArr: "15:30", schDep: "--:--", actArr: "15:30", actDep: "--:--", pf: "PF 1", status: "upcoming" },
    ]
  }
};

const LiveTrainTracker = ({ initialTrainNumber = "RC101", onClose }) => {
  const [selectedTrainNum, setSelectedTrainNum] = useState(initialTrainNumber);
  const routeData = TRAIN_ROUTE_TIMETABLES[selectedTrainNum] || TRAIN_ROUTE_TIMETABLES["RC101"];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden max-w-2xl w-full mx-auto text-slate-800 dark:text-slate-100 transition-all">
      
      {/* ── Header: Train Selector Bar ── */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 p-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-teal-300 block mb-1">
            ● GPS SATELLITE LIVE TRACKING
          </span>
          <div className="flex items-center gap-3">
            <select
              value={selectedTrainNum}
              onChange={(e) => setSelectedTrainNum(e.target.value)}
              className="bg-teal-900/90 text-white font-black text-base px-3 py-1.5 rounded-xl border border-teal-400/40 focus:outline-none cursor-pointer"
            >
              {Object.keys(TRAIN_ROUTE_TIMETABLES).map((tNum) => (
                <option key={tNum} value={tNum} className="text-slate-900">
                  {tNum} - {TRAIN_ROUTE_TIMETABLES[tNum].trainName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="self-end sm:self-auto p-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-lg font-bold transition"
            title="Close tracker"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Status Banner (Just like Screenshot 4) ── */}
      <div className="bg-slate-50 dark:bg-slate-800/90 p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-teal-600 text-white text-xl shadow">
            📍
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Current Status:
            </p>
            <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">
              {routeData.currentStatusText}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Delay: </span>
                {routeData.delayMinutes > 0 ? (
                  <span className="font-black text-red-500 bg-red-50 dark:bg-red-950/80 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900">
                    Delayed by {routeData.delayMinutes} mins
                  </span>
                ) : (
                  <span className="font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900">
                    Right Time (0 min)
                  </span>
                )}
              </div>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 dark:text-slate-400 font-semibold">
                Updated: {routeData.lastUpdate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Table Header Strip ── */}
      <div className="grid grid-cols-12 bg-slate-100 dark:bg-slate-800/60 px-6 py-2.5 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
        <div className="col-span-5">Station / Dist.</div>
        <div className="col-span-2 text-center">Arrival</div>
        <div className="col-span-2 text-center">Departure</div>
        <div className="col-span-3 text-right">Platform</div>
      </div>

      {/* ── Vertical Railway Route Line (Exact replica of Screenshot 4) ── */}
      <div className="p-4 sm:p-6 max-h-[500px] overflow-y-auto">
        <div className="relative pl-6">
          
          {/* Vertical Railway Track Track Line */}
          <div className="absolute left-[33px] top-4 bottom-6 w-[3px] bg-teal-500/30 dark:bg-teal-500/40"></div>

          <div className="space-y-6">
            {routeData.stations.map((st, index) => {
              const isCurrent = st.status === "current";
              const isPassed = st.status === "passed";

              return (
                <div key={st.code} className="relative flex items-center">
                  
                  {/* Station Node / Train Pin */}
                  <div className="absolute -left-[35px] flex items-center justify-center">
                    {isCurrent ? (
                      /* Active Moving Train Marker */
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center text-lg shadow-lg ring-4 ring-teal-400/50 animate-bounce">
                          🚆
                        </div>
                        <div className="absolute inset-0 rounded-full bg-teal-500 animate-ping opacity-40"></div>
                      </div>
                    ) : isPassed ? (
                      /* Passed Station Node */
                      <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold shadow">
                        ✓
                      </div>
                    ) : (
                      /* Upcoming Station Node */
                      <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-400 dark:border-slate-600"></div>
                    )}
                  </div>

                  {/* Station Row Information */}
                  <div
                    className={`grid grid-cols-12 w-full pl-5 py-2 rounded-xl transition-colors ${
                      isCurrent
                        ? "bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Station Name & Code & Distance */}
                    <div className="col-span-5 pr-2">
                      <p
                        className={`text-sm leading-tight ${
                          isCurrent
                            ? "font-black text-teal-800 dark:text-teal-300"
                            : isPassed
                            ? "font-bold text-slate-800 dark:text-slate-200"
                            : "font-semibold text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {st.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {st.code} · {st.km} KM
                      </p>
                    </div>

                    {/* Arrival Time (Sch & Act) */}
                    <div className="col-span-2 text-center">
                      <p className={`text-xs font-black ${routeData.delayMinutes > 0 && isCurrent ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {st.actArr}
                      </p>
                      {st.schArr !== st.actArr && (
                        <p className="text-[10px] text-slate-400 line-through">
                          {st.schArr}
                        </p>
                      )}
                    </div>

                    {/* Departure Time */}
                    <div className="col-span-2 text-center">
                      <p className={`text-xs font-black ${routeData.delayMinutes > 0 && isCurrent ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {st.actDep}
                      </p>
                      {st.schDep !== st.actDep && (
                        <p className="text-[10px] text-slate-400 line-through">
                          {st.schDep}
                        </p>
                      )}
                    </div>

                    {/* Platform Number */}
                    <div className="col-span-3 text-right">
                      <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {st.pf}
                      </span>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ── Footer Info ── */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
        <span>IRCTC / NTES Real-Time Train GPS</span>
        <span className="font-semibold text-teal-600 dark:text-teal-400">
          Route: {routeData.source} ➔ {routeData.destination}
        </span>
      </div>

    </div>
  );
};

export default LiveTrainTracker;
