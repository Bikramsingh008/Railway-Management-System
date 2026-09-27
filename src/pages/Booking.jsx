import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Booking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Step state: "details" | "confirm" | "payment" | "success"
  const [step, setStep] = useState("details");

  // Selection & Passengers state
  const [selectedClass, setSelectedClass] = useState(
    (state && state.selectedClass) || "SL"
  );
  const [passengers, setPassengers] = useState([
    { name: "", age: "", gender: "", berth: "" }
  ]);

  // Confirmation Checkbox State
  const [confirmedCheck, setConfirmedCheck] = useState(false);

  // Payment state (Razorpay online modes)
  const [paymentMethod, setPaymentMethod] = useState("upi"); // "upi" | "card" | "netbanking"
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("SBI");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  if (!state || !state.train) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 text-center max-w-md">
          <p className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">No train selected!</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { train, date } = state;

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
  const baseFare = currentPrice * passengers.length;
  const irctcFee = 15; // IRCTC Convenience Charge
  const gstRate = 0.05; // 5% Govt. GST Passenger Tax
  const gstAmount = Math.round(baseFare * gstRate);
  const totalPrice = baseFare + irctcFee + gstAmount;

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

  // Step 1 Validation -> Move to Confirm
  const handleProceedToConfirm = () => {
    for (let p of passengers) {
      if (!p.name || !p.age || !p.gender) {
        alert("Please fill all passenger details (Name, Age, and Gender).");
        return;
      }
    }
    setStep("confirm");
  };

  // Process Final Razorpay Payment -> Save & Success
  const handleFinalPayment = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    if (paymentMethod === "upi" && !upiId.includes("@") && upiId.length < 5) {
      alert("Please enter a valid UPI ID (e.g. name@upi) or select a UPI app.");
      return;
    }

    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        alert("Please complete all card payment fields.");
        return;
      }
    }

    setIsProcessingPayment(true);

    // Simulate Razorpay payment gateway delay
    setTimeout(() => {
      const pnr = "PNR" + Math.random().toString(36).substring(2, 10).toUpperCase();
      const transactionId = "RZP_" + Math.random().toString(36).substring(2, 12).toUpperCase();

      const bookingData = {
        id: Date.now(),
        pnr,
        user_id: user.id,
        train_name: train.trainName,
        train_number: train.trainNumber,
        date: date,
        source: train.source,
        destination: train.destination,
        departure_time: train.departureTime,
        arrivalTime: train.arrivalTime,
        boarding_station: train.source,
        passenger_details: passengers,
        duration: getDuration(train.departureTime, train.arrivalTime),
        class_booked: selectedClass,
        base_fare: baseFare,
        service_fee: irctcFee,
        gst_tax: gstAmount,
        total_price: totalPrice,
        booked_at: new Date().toISOString(),
        payment_status: "SUCCESS",
        payment_mode: paymentMethod.toUpperCase(),
        transaction_id: transactionId,
      };

      // Save to localStorage
      const existingBookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
      existingBookings.push(bookingData);
      localStorage.setItem("myBookings", JSON.stringify(existingBookings));

      // Update seats
      const allTrains = JSON.parse(localStorage.getItem("trainData")) || [];
      const updatedTrains = allTrains.map(t => {
        if (t.trainNumber === train.trainNumber) {
          const dateSeats = t.seatAvailability?.[date];
          if (dateSeats) {
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

      setIsProcessingPayment(false);
      setCreatedBooking(bookingData);
      setStep("success");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 md:p-8 text-slate-800 dark:text-slate-100 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        
        {/* Progress Stepper Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
            <div className={`flex flex-col items-center ${step === "details" ? "text-teal-600 dark:text-teal-400 font-bold" : "text-slate-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-1 border-2 ${step === "details" ? "bg-teal-600 text-white border-teal-600" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"}`}>
                1
              </div>
              <span className="text-xs">Passenger Info</span>
            </div>

            <div className={`flex-1 h-1 mx-2 ${step === "confirm" || step === "payment" || step === "success" ? "bg-teal-600" : "bg-slate-200 dark:bg-slate-800"}`} />

            <div className={`flex flex-col items-center ${step === "confirm" ? "text-teal-600 dark:text-teal-400 font-bold" : "text-slate-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-1 border-2 ${step === "confirm" ? "bg-teal-600 text-white border-teal-600" : (step === "payment" || step === "success" ? "bg-teal-600 text-white border-teal-600" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700")}`}>
                2
              </div>
              <span className="text-xs">Confirmation</span>
            </div>

            <div className={`flex-1 h-1 mx-2 ${step === "payment" || step === "success" ? "bg-teal-600" : "bg-slate-200 dark:bg-slate-800"}`} />

            <div className={`flex flex-col items-center ${step === "payment" ? "text-teal-600 dark:text-teal-400 font-bold" : "text-slate-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-1 border-2 ${step === "payment" ? "bg-teal-600 text-white border-teal-600" : (step === "success" ? "bg-teal-600 text-white border-teal-600" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700")}`}>
                3
              </div>
              <span className="text-xs">Payment</span>
            </div>

            <div className={`flex-1 h-1 mx-2 ${step === "success" ? "bg-emerald-600" : "bg-slate-200 dark:bg-slate-800"}`} />

            <div className={`flex flex-col items-center ${step === "success" ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-1 border-2 ${step === "success" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"}`}>
                ✓
              </div>
              <span className="text-xs">Success</span>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            STEP 1: PASSENGER & CLASS DETAILS
           ───────────────────────────────────────────────────────────── */}
        {step === "details" && (
          <div>
            <h2 className="text-3xl font-extrabold mb-6 text-slate-800 dark:text-slate-100">1. Passenger & Travel Details</h2>
            
            {/* Journey Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-slate-200 dark:border-slate-800 pb-4 gap-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{train.trainName} ({train.trainNumber})</h3>
                  <p className="text-slate-500 dark:text-slate-400">Date of Journey: <span className="font-semibold text-teal-600 dark:text-teal-400">{date}</span></p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-bold text-slate-800 dark:text-slate-200">{train.source} → {train.destination}</p>
                  <p className="text-slate-500 dark:text-slate-400">{train.departureTime} - {train.arrivalTime}</p>
                </div>
              </div>

              {/* Select Travel Class & Show Prices */}
              <div className="mt-4">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Select Travel Class</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(prices).map((cls) => (
                    <button
                      key={cls}
                      onClick={() => setSelectedClass(cls)}
                      className={`p-4 border rounded-xl flex flex-col items-center justify-center transition-all ${
                        selectedClass === cls
                          ? "border-teal-500 bg-teal-50 dark:bg-teal-950/40 shadow-sm ring-2 ring-teal-500"
                          : "border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 bg-white dark:bg-slate-800/80"
                      }`}
                    >
                      <span className="font-bold text-slate-800 dark:text-slate-100">{cls}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{classNames[cls]}</span>
                      <span className="text-teal-600 dark:text-teal-400 font-extrabold mt-2">₹{prices[cls]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Passenger List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-6 mb-6">
              <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">Passenger Information</h3>
              
              {passengers.map((p, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-end border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-sm text-slate-600 dark:text-slate-300 font-semibold mb-1">Full Name *</label>
                    <input type="text" value={p.name} onChange={(e) => handlePassengerChange(index, "name", e.target.value)} className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 outline-none focus:border-teal-500" placeholder="Passenger Name" />
                  </div>
                  <div className="col-span-6 md:col-span-2">
                    <label className="block text-sm text-slate-600 dark:text-slate-300 font-semibold mb-1">Age *</label>
                    <input type="number" value={p.age} onChange={(e) => handlePassengerChange(index, "age", e.target.value)} className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 outline-none focus:border-teal-500" placeholder="Age" />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <label className="block text-sm text-slate-600 dark:text-slate-300 font-semibold mb-1">Gender *</label>
                    <select value={p.gender} onChange={(e) => handlePassengerChange(index, "gender", e.target.value)} className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 outline-none focus:border-teal-500">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-span-9 md:col-span-2">
                    <label className="block text-sm text-slate-600 dark:text-slate-300 font-semibold mb-1">Berth Pref.</label>
                    <select value={p.berth} onChange={(e) => handlePassengerChange(index, "berth", e.target.value)} className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 outline-none focus:border-teal-500">
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
                      <button onClick={() => removePassenger(index)} className="text-red-500 font-bold hover:text-red-700 p-2">✕</button>
                    )}
                  </div>
                </div>
              ))}
              
              <button onClick={addPassenger} className="text-teal-600 dark:text-teal-400 font-bold hover:text-teal-700 mt-2 flex items-center gap-1">
                <span>+</span> Add Another Passenger
              </button>
            </div>

            {/* Price Breakdowns & Action */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Class: <span className="font-bold text-slate-800 dark:text-slate-100">{classNames[selectedClass]}</span></p>
                <p className="text-slate-500 dark:text-slate-400">Base Fare: <span className="font-bold text-slate-800 dark:text-slate-100">₹{baseFare}</span> + Taxes/Fees (<span className="text-amber-600 dark:text-amber-400 font-semibold">₹{irctcFee + gstAmount}</span>)</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Total Payable</p>
                  <p className="text-3xl font-black text-teal-600 dark:text-teal-400">₹{totalPrice}</p>
                </div>
                <button onClick={handleProceedToConfirm} className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-all hover:scale-[1.02]">
                  Proceed to Confirmation →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            STEP 2: JOURNEY CONFIRMATION & DECLARATION
           ───────────────────────────────────────────────────────────── */}
        {step === "confirm" && (
          <div>
            <h2 className="text-3xl font-extrabold mb-6 text-slate-800 dark:text-slate-100">2. Review & Confirm Journey Details</h2>

            {/* Train & Journey Detail Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center text-2xl font-bold">
                  🚆
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">{train.trainName} ({train.trainNumber})</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Scheduled Express Service</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block">From</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-lg">{train.source}</span>
                  <span className="text-xs text-slate-500 block">{train.departureTime}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block">To</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-lg">{train.destination}</span>
                  <span className="text-xs text-slate-500 block">{train.arrivalTime}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block">Date of Journey</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400 text-lg">{date}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block">Travel Class</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-lg">{selectedClass}</span>
                </div>
              </div>
            </div>

            {/* Passenger List Summary Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-6 mb-6">
              <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-100">Passenger List ({passengers.length})</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                      <th className="p-3 rounded-l-xl">#</th>
                      <th className="p-3">Passenger Name</th>
                      <th className="p-3">Age</th>
                      <th className="p-3">Gender</th>
                      <th className="p-3 rounded-r-xl">Berth Preference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {passengers.map((p, idx) => (
                      <tr key={idx} className="text-slate-800 dark:text-slate-200">
                        <td className="p-3 font-bold">{idx + 1}</td>
                        <td className="p-3 font-semibold">{p.name}</td>
                        <td className="p-3">{p.age} yrs</td>
                        <td className="p-3">{p.gender}</td>
                        <td className="p-3 text-teal-600 dark:text-teal-400">{p.berth || "No Preference"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fare Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-6 mb-6">
              <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100">Fare & Tax Summary</h3>
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex justify-between">
                  <span>Base Ticket Fare ({classNames[selectedClass]} x {passengers.length})</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">₹{baseFare}</span>
                </div>
                <div className="flex justify-between">
                  <span>IRCTC Convenience / Service Charge</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">₹{irctcFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Govt. GST (5% Rail Passenger Tax)</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">₹{gstAmount}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 text-lg font-bold text-slate-800 dark:text-slate-100">
                <div>
                  <span>Final Amount Payable</span>
                  <span className="text-xs text-slate-400 block font-normal">(Inclusive of all Taxes & IRCTC Charges)</span>
                </div>
                <span className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">₹{totalPrice}</span>
              </div>
            </div>

            {/* Mandatory Confirmation Checkbox */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 rounded-2xl p-5 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedCheck}
                  onChange={(e) => setConfirmedCheck(e.target.checked)}
                  className="w-6 h-6 mt-0.5 accent-teal-600 rounded cursor-pointer flex-shrink-0"
                />
                <span className="text-sm font-semibold text-amber-900 dark:text-amber-200 leading-relaxed">
                  I confirm that all journey details, passenger names, ages, and travel dates are accurate. I agree to proceed forward to online payment via Razorpay.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setStep("details")}
                className="px-6 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
              >
                ← Edit Details
              </button>

              <button
                disabled={!confirmedCheck}
                onClick={() => setStep("payment")}
                className={`py-3.5 px-8 rounded-xl font-bold text-white shadow-lg transition-all ${
                  confirmedCheck
                    ? "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 hover:scale-[1.02] cursor-pointer"
                    : "bg-slate-400 cursor-not-allowed opacity-60"
                }`}
              >
                Proceed to Online Payment (₹{totalPrice}) 💳
              </button>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            STEP 3: RAZORPAY ONLINE PAYMENT GATEWAY
           ───────────────────────────────────────────────────────────── */}
        {step === "payment" && (
          <div>
            <h2 className="text-3xl font-extrabold mb-6 text-slate-800 dark:text-slate-100">3. Online Payment Gateway</h2>

            {/* Razorpay Gateway Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-6">
              
              {/* Razorpay Header Bar */}
              <div className="bg-[#0c2340] text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white font-black px-3 py-1 rounded text-xl italic tracking-wider">
                    Razorpay
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">Secure Payment Checkout</h3>
                    <p className="text-xs text-blue-200">256-bit SSL Encryption Guaranteed</p>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <span className="text-xs text-blue-200 block uppercase font-semibold">Amount to Pay</span>
                  <span className="text-3xl font-extrabold text-teal-400">₹{totalPrice}</span>
                </div>
              </div>

              {/* Online Modes Selector */}
              <div className="grid grid-cols-1 md:grid-cols-4 min-h-[380px]">
                
                {/* Left Tabs */}
                <div className="bg-slate-50 dark:bg-slate-800/60 p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex md:flex-col gap-2">
                  <button
                    onClick={() => setPaymentMethod("upi")}
                    className={`w-full p-4 rounded-xl text-left font-bold text-sm flex items-center gap-3 transition-all ${
                      paymentMethod === "upi"
                        ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-md border-l-4 border-teal-500"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="text-xl">📱</span>
                    <span>UPI / QR Code</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`w-full p-4 rounded-xl text-left font-bold text-sm flex items-center gap-3 transition-all ${
                      paymentMethod === "card"
                        ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-md border-l-4 border-teal-500"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="text-xl">💳</span>
                    <span>Credit / Debit Card</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("netbanking")}
                    className={`w-full p-4 rounded-xl text-left font-bold text-sm flex items-center gap-3 transition-all ${
                      paymentMethod === "netbanking"
                        ? "bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-md border-l-4 border-teal-500"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="text-xl">🏦</span>
                    <span>Net Banking</span>
                  </button>
                </div>

                {/* Right Form Body */}
                <div className="md:col-span-3 p-6 md:p-8">
                  
                  {/* UPI MODE */}
                  {paymentMethod === "upi" && (
                    <div className="space-y-6">
                      <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span>Pay Instant via UPI or QR Code</span>
                      </h4>

                      {/* Quick Apps */}
                      <div className="grid grid-cols-4 gap-3">
                        {["Google Pay", "PhonePe", "Paytm", "BHIM UPI"].map((app) => (
                          <div key={app} className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-center bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:border-teal-500 cursor-pointer">
                            {app}
                          </div>
                        ))}
                      </div>

                      {/* QR Code Mockup */}
                      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-teal-50/50 dark:bg-teal-950/20 rounded-2xl border border-teal-200 dark:border-teal-900">
                        <div className="w-28 h-28 bg-white p-2 rounded-xl shadow border border-slate-200 flex items-center justify-center">
                          {/* Mock QR SVG */}
                          <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                            <rect x="0" y="0" width="30" height="30"/>
                            <rect x="5" y="5" width="20" height="20" fill="white"/>
                            <rect x="10" y="10" width="10" height="10"/>
                            <rect x="70" y="0" width="30" height="30"/>
                            <rect x="75" y="5" width="20" height="20" fill="white"/>
                            <rect x="80" y="10" width="10" height="10"/>
                            <rect x="0" y="70" width="30" height="30"/>
                            <rect x="5" y="75" width="20" height="20" fill="white"/>
                            <rect x="10" y="80" width="10" height="10"/>
                            <rect x="40" y="10" width="20" height="10"/>
                            <rect x="40" y="40" width="20" height="20"/>
                            <rect x="70" y="50" width="20" height="20"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">Scan QR Code with any UPI App</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Open GPay, PhonePe, or Paytm app and scan to pay ₹{totalPrice} directly.</p>
                        </div>
                      </div>

                      {/* Enter VPA */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Or Enter UPI VPA ID
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. username@upi or mobile@paytm"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="flex-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CARD MODE */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                        Pay via Credit / Debit Card
                      </h4>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="Name on Card"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Card Number</label>
                        <input
                          type="text"
                          maxLength="19"
                          placeholder="4532 •••• •••• 8892"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-teal-500 font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            maxLength="5"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-teal-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">CVV / CVC</label>
                          <input
                            type="password"
                            placeholder="•••"
                            maxLength="4"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-teal-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NET BANKING MODE */}
                  {paymentMethod === "netbanking" && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                        Select Your Bank
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Bank", "PNB"].map((bank) => (
                          <button
                            key={bank}
                            onClick={() => setSelectedBank(bank)}
                            className={`p-3 border rounded-xl font-bold text-xs text-center transition-all ${
                              selectedBank === bank
                                ? "border-teal-500 bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Pay Action Bar */}
              <div className="bg-slate-100 dark:bg-slate-800/80 p-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => setStep("confirm")}
                  className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-semibold"
                >
                  ← Back to Review
                </button>

                <button
                  onClick={handleFinalPayment}
                  disabled={isProcessingPayment}
                  className="w-full sm:w-auto py-4 px-10 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg rounded-xl shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay ₹{totalPrice} via Razorpay 🔒</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            STEP 4: GREEN SUCCESS SCREEN WITH WHITE CHECKMARK
           ───────────────────────────────────────────────────────────── */}
        {step === "success" && createdBooking && (
          <div className="py-8 flex flex-col items-center justify-center">
            
            {/* Green Hero Card */}
            <div className="w-full max-w-2xl bg-gradient-to-b from-emerald-500 via-teal-600 to-emerald-700 text-white rounded-3xl shadow-2xl p-8 md:p-10 text-center relative overflow-hidden animate-fadeIn">
              
              {/* Animated White Checkmark Badge */}
              <div className="mx-auto w-24 h-24 bg-white/20 rounded-full border-4 border-white flex items-center justify-center mb-6 shadow-2xl animate-bounce">
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
                Ticket Booked Successfully! 🎉
              </h2>
              <p className="text-emerald-100 text-base mb-6 font-medium">
                Payment Received via Razorpay ({createdBooking.payment_mode}). Your booking is confirmed.
              </p>

              {/* Ticket Key Info Details Box */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-left space-y-3 mb-8">
                <div className="flex justify-between items-center border-b border-white/20 pb-3">
                  <span className="text-xs text-emerald-100 uppercase font-semibold">PNR Number</span>
                  <span className="text-2xl font-black tracking-widest text-amber-300">{createdBooking.pnr}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm pt-1">
                  <div>
                    <span className="text-xs text-emerald-200 block">Train</span>
                    <span className="font-bold">{createdBooking.train_name} ({createdBooking.train_number})</span>
                  </div>
                  <div>
                    <span className="text-xs text-emerald-200 block">Journey Date</span>
                    <span className="font-bold">{createdBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-xs text-emerald-200 block">Route</span>
                    <span className="font-bold">{createdBooking.source} → {createdBooking.destination}</span>
                  </div>
                  <div>
                    <span className="text-xs text-emerald-200 block">Total Paid</span>
                    <span className="font-bold text-amber-300">₹{createdBooking.total_price}</span>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-3 flex justify-between text-xs text-emerald-100">
                  <span>Transaction ID: <strong className="text-white">{createdBooking.transaction_id}</strong></span>
                  <span>Passengers: <strong className="text-white">{createdBooking.passenger_details.length}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate(`/ticket/${createdBooking.id}`)}
                  className="py-4 px-8 bg-white text-emerald-800 hover:bg-emerald-50 font-extrabold rounded-2xl shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2 text-lg"
                >
                  <span>⬇️</span> View & Download Ticket
                </button>

                <button
                  onClick={() => navigate("/my-bookings")}
                  className="py-4 px-8 bg-emerald-900/60 hover:bg-emerald-900/80 text-white font-bold rounded-2xl border border-white/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>📋</span> Go to My Bookings
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Booking;
