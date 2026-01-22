import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [trains, setTrains] = useState([]);

  const [formData, setFormData] = useState({
    trainName: "",
    trainNumber: "",
    source: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    journeyDate: "",
    seats: { SL: "", AC3: "", AC2: "", AC1: "" },
    days: {
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false,
      Sat: false,
      Sun: false,
    },
  });

  useEffect(() => {
    setTrains(JSON.parse(localStorage.getItem("trainData")) || []);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSeatChange = (e) =>
    setFormData({
      ...formData,
      seats: { ...formData.seats, [e.target.name]: e.target.value },
    });

  const handleDayChange = (e) =>
    setFormData({
      ...formData,
      days: { ...formData.days, [e.target.name]: e.target.checked },
    });

  const handleSelectAllDays = (e) => {
    const checked = e.target.checked;
    const updated = {};
    Object.keys(formData.days).forEach((d) => (updated[d] = checked));
    setFormData({ ...formData, days: updated });
  };

  const handleAddTrain = (e) => {
    e.preventDefault();

    if (!formData.journeyDate) {
      alert("Select journey date");
      return;
    }

    const selectedDays = Object.keys(formData.days).filter(
      (d) => formData.days[d]
    );

    const seatData = {
      SL: Number(formData.seats.SL),
      AC3: Number(formData.seats.AC3),
      AC2: Number(formData.seats.AC2),
      AC1: Number(formData.seats.AC1),
    };

    let updatedTrains = [...trains];

    const existingTrainIndex = updatedTrains.findIndex(
      (t) => t.trainNumber === formData.trainNumber
    );

    if (existingTrainIndex !== -1) {
      // TRAIN EXISTS → ADD DATE-WISE SEATS
      updatedTrains[existingTrainIndex].seatAvailability[
        formData.journeyDate
      ] = seatData;
    } else {
      // NEW TRAIN
      updatedTrains.push({
        id: Date.now(),
        trainName: formData.trainName,
        trainNumber: formData.trainNumber,
        source: formData.source,
        destination: formData.destination,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
        days: selectedDays,
        seatAvailability: {
          [formData.journeyDate]: seatData,
        },
      });
    }

    setTrains(updatedTrains);
    localStorage.setItem("trainData", JSON.stringify(updatedTrains));

    setFormData({
      trainName: "",
      trainNumber: "",
      source: "",
      destination: "",
      departureTime: "",
      arrivalTime: "",
      journeyDate: "",
      seats: { SL: "", AC3: "", AC2: "", AC1: "" },
      days: {
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        Sun: false,
      },
    });
  };

  const handleDelete = (id) => {
    const updated = trains.filter((t) => t.id !== id);
    setTrains(updated);
    localStorage.setItem("trainData", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-600">
        🚆 Admin Dashboard
      </h1>

      <form
        onSubmit={handleAddTrain}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto mb-12"
      >
        <h2 className="text-2xl font-bold mb-6">➕ Add / Update Train Seats</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input className="input" name="trainName" placeholder="Train Name" value={formData.trainName} onChange={handleChange} />
          <input className="input" name="trainNumber" placeholder="Train Number" value={formData.trainNumber} onChange={handleChange} />
          <input className="input" name="source" placeholder="Source" value={formData.source} onChange={handleChange} />
          <input className="input" name="destination" placeholder="Destination" value={formData.destination} onChange={handleChange} />
          <input className="input" type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} />
          <input className="input" type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} />
          <input className="input col-span-2" type="date" name="journeyDate" value={formData.journeyDate} onChange={handleChange} />
        </div>

        <h3 className="font-semibold mb-2">Seat Availability (For Selected Date)</h3>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {["SL", "3AC", "2AC", "1AC"].map((cls) => (
            <input
              key={cls}
              type="number"
              name={cls}
              placeholder={cls}
              value={formData.seats[cls]}
              onChange={handleSeatChange}
              className="input text-center"
            />
          ))}
        </div>

        <h3 className="font-semibold mb-2">Running Days</h3>
        <div className="flex flex-wrap gap-3 mb-6">
          <label className="day-pill">
            <input type="checkbox" onChange={handleSelectAllDays} />
            All
          </label>

          {Object.keys(formData.days).map((day) => (
            <label
              key={day}
              className={`day-pill ${formData.days[day] && "bg-emerald-600 text-white"}`}
            >
              <input type="checkbox" name={day} checked={formData.days[day]} onChange={handleDayChange} />
              {day}
            </label>
          ))}
        </div>

        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold">
          Save Train Seats
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">📋 Trains</h2>

        <table className="w-full text-center border">
          <thead className="bg-emerald-600 text-white">
            <tr>
              <th>TRAIN Name</th>
              <th>TRAIN No.</th>
              <th>Route</th>
              <th>Days</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trains.map((t) => (
              <tr key={t.id} className="border-t">
                <td>{t.trainName}</td>
                <td>{t.trainNumber}</td>
                <td>{t.source} → {t.destination}</td>
                <td className="text-sm">{t.days.join(", ")}</td>
                <td>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-sm text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ddd;
        }
        .day-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid #ccc;
          cursor: pointer;
        }
        .day-pill input {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
