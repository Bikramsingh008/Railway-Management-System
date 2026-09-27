import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TicketSlip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage instead of backend
    const allBookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
    const found = allBookings.find((b) => String(b.id) === String(id));
    if (found) {
      setBooking(found);
    } else {
      alert("Ticket not found!");
      navigate("/my-bookings");
    }
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="text-center py-20 font-semibold text-lg text-slate-500 dark:text-slate-400">
        Loading Electronic Slip...
      </div>
    );
  }

  if (!booking) return null;

  const passengers =
    typeof booking.passenger_details === "string"
      ? JSON.parse(booking.passenger_details)
      : booking.passenger_details || [];

  const baseFare        = booking.total_price || 0;
  const convenienceFee  = 11.80;
  const cateringCharge  = 0.00;
  const totalFarePaid   = baseFare + convenienceFee;
  const status          = booking.status || "CONFIRMED";

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });
  };

  const handlePrint = () => window.print();

  const handleDownloadPDF = () => {
    // Trigger browser print dialog → user can "Save as PDF"
    const style = document.createElement("style");
    style.id = "pdf-print-style";
    style.innerHTML = `
      @media print {
        body > * { display: none !important; }
        #ticket-slip-root { display: block !important; }
        #ticket-actions { display: none !important; }
        @page { margin: 10mm; size: A4; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => {
      const s = document.getElementById("pdf-print-style");
      if (s) s.remove();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-10 px-4 transition-colors duration-500 print:bg-white print:py-0">
      <div
        id="ticket-slip-root"
        className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-8 rounded-2xl shadow-xl print:shadow-none print:border-none print:rounded-none print:bg-white text-slate-800 dark:text-slate-100"
      >

        {/* ── Action Buttons (hidden in print) ── */}
        <div id="ticket-actions" className="flex justify-between items-center mb-6 print:hidden gap-3">
          <button
            onClick={() => navigate("/my-bookings")}
            className="bg-slate-700 dark:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-md"
          >
            ← Back to Bookings
          </button>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="bg-slate-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-700 transition flex items-center gap-2 shadow-md"
            >
              🖨️ Print
            </button>
            <button
              onClick={handleDownloadPDF}
              className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition flex items-center gap-2 shadow-md"
            >
              ⬇️ Download PDF
            </button>
          </div>
        </div>

        {/* ── ERS Header ── */}
        <div className="border-b-2 border-slate-800 dark:border-slate-700 pb-4 mb-6">
          <div className="text-center font-extrabold tracking-wider mb-3 text-sm uppercase">
            {status.startsWith("WL") ? (
              <span className="text-red-600 dark:text-red-400">WL &nbsp; Electronic Reservation Slip (ERS) &nbsp; WL</span>
            ) : (
              <span className="text-blue-800 dark:text-teal-400">Electronic Reservation Slip (ERS)</span>
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white text-xl font-black">
                🚆
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">RailConnect</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Powered by IRCTC</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-blue-900 dark:text-teal-400 tracking-widest">IRCTC</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Indian Railway Catering &amp; Tourism Corporation</p>
            </div>
          </div>
        </div>

        {/* ── Journey Route ── */}
        <div className="flex justify-between items-center bg-sky-50/70 dark:bg-slate-800/60 p-5 border border-sky-100 dark:border-slate-700 rounded-xl mb-6">
          <div className="w-1/3">
            <p className="text-slate-500 dark:text-slate-400 uppercase font-bold text-xs mb-1">From</p>
            <p className="font-extrabold text-slate-800 dark:text-slate-100 text-xl">{booking.source}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{formatDate(booking.date)}</p>
            <p className="text-teal-700 dark:text-teal-400 font-bold mt-1 text-sm">Dep: {booking.departure_time}</p>
          </div>

          <div className="w-1/3 text-center flex flex-col items-center gap-1">
            <div className="flex items-center w-full justify-center text-slate-400 dark:text-slate-500">
              <div className="flex-1 h-px bg-slate-300 dark:bg-slate-600"/>
              <span className="text-2xl mx-2">🚄</span>
              <div className="flex-1 h-px bg-slate-300 dark:bg-slate-600"/>
            </div>
            <span className="text-teal-700 dark:text-teal-300 font-semibold bg-teal-100 dark:bg-teal-950/80 px-3 py-1 rounded-full text-xs border border-teal-200 dark:border-teal-800">
              {booking.duration || "—"}
            </span>
          </div>

          <div className="w-1/3 text-right">
            <p className="text-slate-500 dark:text-slate-400 uppercase font-bold text-xs mb-1">To</p>
            <p className="font-extrabold text-slate-800 dark:text-slate-100 text-xl">{booking.destination}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{formatDate(booking.date)}</p>
            <p className="text-teal-700 dark:text-teal-400 font-bold mt-1 text-sm">Arr: {booking.arrivalTime || booking.arrival_time}</p>
          </div>
        </div>

        {/* ── Key Details Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border border-slate-300 dark:border-slate-800 p-4 rounded-xl text-sm mb-6 bg-slate-50/50 dark:bg-slate-800/40">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase font-semibold mb-1">PNR</span>
            <span className="font-extrabold text-teal-600 dark:text-teal-400 text-base">{booking.pnr}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase font-semibold mb-1">Train</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{booking.train_number} / {booking.train_name}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase font-semibold mb-1">Class</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{booking.class_booked || "SL"}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase font-semibold mb-1">Quota</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">GENERAL (GN)</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase font-semibold mb-1">Boarding At</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{booking.boarding_station || booking.source}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase font-semibold mb-1">Date of Journey</span>
            <span className="font-bold text-slate-800 dark:text-slate-100">{booking.date}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase font-semibold mb-1">Status</span>
            <span className={`font-extrabold text-base ${status === "CONFIRMED" ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
              {status}
            </span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-xs uppercase font-semibold mb-1">Booked On</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">
              {booking.booked_at ? new Date(booking.booked_at).toLocaleDateString("en-IN") : "—"}
            </span>
          </div>
        </div>

        {/* ── Passenger Table ── */}
        <div className="mb-6">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mb-3 text-lg">
            Passenger Details
          </h3>
          <table className="w-full text-left border-collapse border border-slate-300 dark:border-slate-800 text-sm rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                <th className="p-3 border-r border-slate-300 dark:border-slate-800">#&nbsp;Name</th>
                <th className="p-3 border-r border-slate-300 dark:border-slate-800 text-center">Age</th>
                <th className="p-3 border-r border-slate-300 dark:border-slate-800 text-center">Gender</th>
                <th className="p-3 border-r border-slate-300 dark:border-slate-800 text-center">Berth Pref.</th>
                <th className="p-3 border-r border-slate-300 dark:border-slate-800 text-center">Booking Status</th>
                <th className="p-3 text-center">Current Status</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((p, idx) => (
                <tr key={idx} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                  <td className="p-3 border-r border-slate-300 dark:border-slate-800 font-medium">{idx + 1}. {p.name}</td>
                  <td className="p-3 border-r border-slate-300 dark:border-slate-800 text-center">{p.age}</td>
                  <td className="p-3 border-r border-slate-300 dark:border-slate-800 text-center">{p.gender}</td>
                  <td className="p-3 border-r border-slate-300 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">{p.berth || "No Preference"}</td>
                  <td className="p-3 border-r border-slate-300 dark:border-slate-800 text-center font-bold text-green-600 dark:text-green-400">{status}</td>
                  <td className="p-3 text-center font-bold text-green-600 dark:text-green-400">{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Payment & QR ── */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Payment */}
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2 mb-3 text-lg">
              Payment Details
            </h3>
            <div className="border border-slate-300 dark:border-slate-800 rounded-xl overflow-hidden text-sm">
              <div className="flex justify-between p-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Ticket Fare ({passengers.length} pax)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">₹{baseFare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Catering Charges</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">₹{cateringCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">IRCTC Convenience Fee (Incl. GST)</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">₹{convenienceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 bg-teal-50/70 dark:bg-teal-950/40 font-extrabold text-teal-800 dark:text-teal-200 text-base">
                <span>Total Fare (all inclusive)</span>
                <span>₹{totalFarePaid.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="w-full md:w-56 border border-slate-300 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/30 text-center">
            {/* Visual QR Mock */}
            <div className="w-32 h-32 bg-white dark:bg-slate-100 p-2 rounded-xl border border-slate-300 grid grid-cols-7 gap-px">
              {Array.from({ length: 49 }).map((_, i) => {
                const corners = [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,47,48];
                const isDark = corners.includes(i) || (i % 7 === 3) || (Math.floor(i / 7) === 3) || i % 11 === 0;
                return <div key={i} className={`${isDark ? "bg-slate-900" : "bg-white"} w-full h-full`}/>;
              })}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Scan to verify ticket</p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 break-all">
              TXN{booking.pnr?.replace(/[^A-Z0-9]/g, "").slice(-8)}
            </p>
          </div>
        </div>

        {/* ── Notices ── */}
        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 border-t border-slate-200 dark:border-slate-800 pt-4">
          <p className="font-bold text-slate-700 dark:text-slate-300">• Beware of fraudulent customer care numbers. Use official numbers only.</p>
          <p>• IRCTC Convenience Fee is charged per e-ticket irrespective of number of passengers on the ticket.</p>
          <p>• Departure and Arrival Times are subject to change. Please check correct times before boarding.</p>
          <p>• This ticket is booked on a personal User ID. Resale is an offense under Section 143 of the Railways Act, 1989.</p>
          <p>• Passengers are required to carry a valid photo ID proof during travel.</p>
        </div>

      </div>
    </div>
  );
};

export default TicketSlip;
