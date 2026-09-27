import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    trainName: "",
    trainNumber: "",
    source: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    journeyDate: "",
    seats: { SL: "", AC3: "", AC2: "", AC1: "" },
    prices: { SL: "", AC3: "", AC2: "", AC1: "" },
    days: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false, Sun: false },
  });

  // Load trains from SQLite via API
  const fetchTrains = () => {
    fetch("http://localhost:5000/api/trains")
      .then(res => res.json())
      .then(data => { if (data.success) setTrains(data.trains); });
  };

  useEffect(() => { fetchTrains(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSeatChange = (e) => setFormData({ ...formData, seats: { ...formData.seats, [e.target.name]: e.target.value } });
  const handlePriceChange = (e) => setFormData({ ...formData, prices: { ...formData.prices, [e.target.name]: e.target.value } });
  const handleDayChange = (e) => setFormData({ ...formData, days: { ...formData.days, [e.target.name]: e.target.checked } });
  const handleSelectAllDays = (e) => {
    const checked = e.target.checked;
    const updated = {};
    Object.keys(formData.days).forEach(d => (updated[d] = checked));
    setFormData({ ...formData, days: updated });
  };

  // Save train to SQLite via API
  const handleAddTrain = async (e) => {
    e.preventDefault();
    if (!formData.journeyDate) { alert("Select journey date"); return; }

    const selectedDays = Object.keys(formData.days).filter(d => formData.days[d]);
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/trains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainName:     formData.trainName,
          trainNumber:   formData.trainNumber,
          source:        formData.source,
          destination:   formData.destination,
          departureTime: formData.departureTime,
          arrivalTime:   formData.arrivalTime,
          days:          selectedDays,
          journeyDate:   formData.journeyDate,
          seats:  { SL: formData.seats.SL,  AC3: formData.seats.AC3,  AC2: formData.seats.AC2,  AC1: formData.seats.AC1  },
          prices: { SL: formData.prices.SL, AC3: formData.prices.AC3, AC2: formData.prices.AC2, AC1: formData.prices.AC1 },
        }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (data.success) {
        fetchTrains();
        setFormData({
          trainName:"", trainNumber:"", source:"", destination:"",
          departureTime:"", arrivalTime:"", journeyDate:"",
          seats:{ SL:"", AC3:"", AC2:"", AC1:"" },
          prices:{ SL:"", AC3:"", AC2:"", AC1:"" },
          days:{ Mon:false, Tue:false, Wed:false, Thu:false, Fri:false, Sat:false, Sun:false },
        });
      }
    } catch {
      setMessage("Error connecting to server.");
    }
    setLoading(false);
  };

  // Delete train from SQLite via API
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this train?")) return;
    const res = await fetch(`http://localhost:5000/api/trains/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) fetchTrains();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-8 text-slate-800 dark:text-slate-100 transition-colors duration-500">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-teal-600 dark:text-teal-400">
        🚆 Admin Dashboard
      </h1>

      <form
        onSubmit={handleAddTrain}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 max-w-4xl mx-auto mb-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">➕ Add / Update Train Seats</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input className="input" name="trainName" placeholder="Train Name" value={formData.trainName} onChange={handleChange} />
          <input className="input" name="trainNumber" placeholder="Train Number" value={formData.trainNumber} onChange={handleChange} />
          <input className="input" name="source" placeholder="Source" value={formData.source} onChange={handleChange} />
          <input className="input" name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} />
          <input className="input" type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} />
          <input className="input" type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} />
          <input className="input col-span-2" type="date" name="journeyDate" value={formData.journeyDate} onChange={handleChange} />
        </div>

        <h3 className="font-bold mb-2 text-slate-700 dark:text-slate-300">Seat Availability (For Selected Date)</h3>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {["SL", "AC3", "AC2", "AC1"].map((cls) => (
            <input
              key={cls}
              type="number"
              name={cls}
              placeholder={cls}
              value={formData.seats[cls]}
              onChange={handleSeatChange}
              className="input text-center font-semibold"
            />
          ))}
        </div>

        <h3 className="font-bold mb-2 text-slate-700 dark:text-slate-300">Seat Prices (₹ per seat)</h3>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {["SL", "AC3", "AC2", "AC1"].map((cls) => (
            <input
              key={cls}
              type="number"
              name={cls}
              placeholder={`${cls} Price (₹)`}
              value={formData.prices[cls]}
              onChange={handlePriceChange}
              className="input text-center font-semibold"
            />
          ))}
        </div>

        <h3 className="font-bold mb-2 text-slate-700 dark:text-slate-300">Running Days</h3>
        <div className="flex flex-wrap gap-3 mb-6">
          <label className="day-pill">
            <input type="checkbox" onChange={handleSelectAllDays} />
            All
          </label>

          {Object.keys(formData.days).map((day) => (
            <label
              key={day}
              className={`day-pill ${formData.days[day] && "bg-emerald-600 dark:bg-emerald-500 text-white border-emerald-600"}`}
            >
              <input type="checkbox" name={day} checked={formData.days[day]} onChange={handleDayChange} />
              {day}
            </label>
          ))}
        </div>

        {message && (
          <p className={`mb-4 text-center font-semibold ${message.toLowerCase().includes("error") ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
            {message}
          </p>
        )}

        <button
          className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-teal-600 dark:hover:bg-teal-700 text-white py-3.5 rounded-xl font-bold transition shadow-md disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Train Seats"}
        </button>
      </form>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 max-w-6xl mx-auto overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">📋 Trains Master Data</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <thead className="bg-teal-600 dark:bg-slate-800 text-white">
              <tr>
                <th className="py-3 px-4">Train Name</th>
                <th className="py-3 px-4">Train No.</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Days</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {trains.map((t) => (
                <tr key={t.id} className="border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold">{t.trainName}</td>
                  <td className="py-3 px-4 font-mono">{t.trainNumber}</td>
                  <td className="py-3 px-4">{t.source} → {t.destination}</td>
                  <td className="py-3 px-4 text-sm font-medium">{t.days.join(", ")}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          outline: none;
          transition: all 0.2s;
        }
        .dark .input {
          background-color: #1e293b;
          border-color: #334155;
          color: #f8fafc;
        }
        .day-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid #cbd5e1;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .dark .day-pill {
          border-color: #334155;
          background-color: #1e293b;
          color: #cbd5e1;
        }
        .day-pill input {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

