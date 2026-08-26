import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Booking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(
    (state && state.selectedClass) || "SL"
  );
  const [passengers, setPassengers] = useState([
    { name: "", age: "", gender: "", berth: "" }
  ]);

  if (!state || !state.train) {
    navigate("/");
    return null;
  }

  const { train, date } = state;

  // Retrieve ticket prices with default fallbacks
  const prices = train.ticketPrices || {
    SL: 350,
    AC3: 750,
    AC2: 1100,
    AC1: 1800
  };

  const classNames = {
    SL: "Sleeper Class (SL)",
    AC3: "AC 3 Tier (3A)",
    AC2: "AC 2 Tier (2A)",
    AC1: "AC First Class (1A)"
  };

  const currentPrice = prices[selectedClass] || 0;
  const totalPrice = currentPrice * passengers.length;

  const handlePassengerChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const addPassenger = () => {
    if (passengers.length >= 6) {
      alert("Maximum 6 passengers allowed per booking.");
      return;
    }
    setPassengers([...passengers, { name: "", age: "", gender: "", berth: "" }]);
  };

  const removePassenger = (index) => {
    const newPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(newPassengers);
  };

  const getDuration = (start, end) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    let startMin = sh * 60 + sm, endMin = eh * 60 + em;
    if (endMin < startMin) endMin += 24 * 60;
    const diff = endMin - startMin;
    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  const handleConfirmBooking = async () => {
    // Validate passengers
    for (let p of passengers) {
      if (!p.name || !p.age || !p.gender) {
        alert("Please fill all passenger details correctly.");
        return;
      }
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    const bookingData = {
      user_id: user.id,
      train_name: train.trainName,
      train_number: train.trainNumber,
      date: date,
      source: train.source,
      destination: train.destination,
      departure_time: train.departureTime,
      arrivalTime: train.arrivalTime, // fallback or direct
      boarding_station: train.source,
      passenger_details: passengers,
      duration: getDuration(train.departureTime, train.arrivalTime),
      class_booked: selectedClass,
      total_price: totalPrice
    };

    try {
      const res = await fetch("http://localhost:5000/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();
      
      if (data.success) {
        // Decrease seat count in localStorage
        const allTrains = JSON.parse(localStorage.getItem("trainData")) || [];
        const updatedTrains = allTrains.map(t => {
          if (t.trainNumber === train.trainNumber) {
            const dateSeats = t.seatAvailability?.[date];
            if (dateSeats) {
              // Support both new (AC3) and old (3AC) keys
              const keyToUpdate = dateSeats[selectedClass] !== undefined ? selectedClass : 
                                  (selectedClass === "AC3" ? "3AC" : 
                                   (selectedClass === "AC2" ? "2AC" : 
                                    (selectedClass === "AC1" ? "1AC" : selectedClass)));
              
              if (dateSeats[keyToUpdate] !== undefined) {
                dateSeats[keyToUpdate] = Math.max(0, dateSeats[keyToUpdate] - passengers.length);
              }
            }
          }
          return t;
        });
        localStorage.setItem("trainData", JSON.stringify(updatedTrains));

        alert(`Ticket booked successfully! PNR: ${data.pnr}\nTotal Paid: ₹${totalPrice}`);
        navigate("/my-bookings");
      } else {
        alert("Booking failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while booking.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-slate-800">Passenger & Class Details</h2>
        
        {/* Journey Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">{train.trainName} ({train.trainNumber})</h3>
              <p className="text-gray-500">Journey Date: {date}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-700">{train.source} → {train.destination}</p>
              <p className="text-gray-500">{train.departureTime} - {train.arrivalTime}</p>
            </div>
          </div>

          {/* Select Travel Class & Show Prices */}
          <div className="mt-4">
            <h4 className="font-semibold text-slate-700 mb-3">Select Class</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.keys(prices).map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`p-4 border rounded-xl flex flex-col items-center justify-center transition-all ${
                    selectedClass === cls
                      ? "border-teal-500 bg-teal-50/50 shadow-sm"
                      : "border-gray-200 hover:border-teal-200"
                  }`}
                >
                  <span className="font-bold text-slate-800">{cls}</span>
                  <span className="text-xs text-gray-500 mt-1">{classNames[cls]}</span>
                  <span className="text-teal-600 font-bold mt-2">₹{prices[cls]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Passenger List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Add Passengers</h3>
          
          {passengers.map((p, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-end border-b border-gray-100 pb-4">
              <div className="col-span-12 md:col-span-4">
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input type="text" value={p.name} onChange={(e) => handlePassengerChange(index, "name", e.target.value)} className="w-full border rounded-md px-3 py-2 outline-none focus:border-teal-500" placeholder="Passenger Name" />
              </div>
              <div className="col-span-6 md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Age</label>
                <input type="number" value={p.age} onChange={(e) => handlePassengerChange(index, "age", e.target.value)} className="w-full border rounded-md px-3 py-2 outline-none focus:border-teal-500" placeholder="Age" />
              </div>
              <div className="col-span-6 md:col-span-3">
                <label className="block text-sm text-gray-600 mb-1">Gender</label>
                <select value={p.gender} onChange={(e) => handlePassengerChange(index, "gender", e.target.value)} className="w-full border rounded-md px-3 py-2 outline-none focus:border-teal-500">
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-span-9 md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Preference</label>
                <select value={p.berth} onChange={(e) => handlePassengerChange(index, "berth", e.target.value)} className="w-full border rounded-md px-3 py-2 outline-none focus:border-teal-500">
                  <option value="">No Preference</option>
                  <option value="Lower">Lower</option>
                  <option value="Middle">Middle</option>
                  <option value="Upper">Upper</option>
                  <option value="Side Lower">Side Lower</option>
                  <option value="Side Upper">Side Upper</option>
                </select>
              </div>
              <div className="col-span-3 md:col-span-1 flex justify-center">
                {passengers.length > 1 && (
                  <button onClick={() => removePassenger(index)} className="text-red-500 font-bold hover:text-red-700">X</button>
                )}
              </div>
            </div>
          ))}
          
          <button onClick={addPassenger} className="text-teal-600 font-semibold hover:text-teal-700">+ Add Passenger</button>
        </div>

        {/* Price Breakdowns & Confirm */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <div>
            <p className="text-gray-500">Selected Class: <span className="font-bold text-slate-800">{classNames[selectedClass]}</span></p>
            <p className="text-gray-500">Passenger(s): <span className="font-bold text-slate-800">{passengers.length}</span></p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-500 text-sm">Total Fare</p>
            <p className="text-3xl font-black text-teal-600">₹{totalPrice}</p>
          </div>
        </div>

        {/* Action */}
        <div className="flex justify-end">
          <button onClick={handleConfirmBooking} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
