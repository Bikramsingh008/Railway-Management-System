import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import trainLogo from "../assets/trainLogo.jpg";

const TicketSlip = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/booking/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBooking(data.booking);
        } else {
          alert("Ticket details not found!");
          navigate("/my-bookings");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading) {
    return <div className="text-center py-20 font-semibold text-lg text-gray-500">Loading Electronic Slip...</div>;
  }

  if (!booking) return null;

  const passengers = JSON.parse(booking.passenger_details || "[]");
  const baseFare = booking.total_price || 0;
  const convenienceFee = 11.80; // IRCTC convenience fee mock
  const cateringCharge = 0.00; // Mock
  const totalFarePaid = baseFare + convenienceFee;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date) ? dateStr : date.toLocaleDateString("en-US", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const printTicket = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto bg-white border border-gray-300 p-8 rounded shadow-md print:shadow-none print:border-none">
        
        {/* Actions (Hidden in Print) */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <button onClick={() => navigate("/my-bookings")} className="bg-slate-700 text-white px-6 py-2 rounded font-semibold hover:bg-slate-800 transition">
            ← Back to Bookings
          </button>
          <button onClick={printTicket} className="bg-orange-500 text-white px-6 py-2 rounded font-semibold hover:bg-orange-600 transition flex items-center gap-2">
            🖨️ Print Ticket
          </button>
        </div>

        {/* ERS Header */}
        <div className="border-b-2 border-slate-800 pb-4 mb-6">
          <div className="text-center font-bold tracking-wider mb-2">
            {booking.status?.toUpperCase().startsWith("WL") ? (
              <span className="text-red-600">WL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Electronic Reservation Slip (ERS) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; WL</span>
            ) : (
              <span className="text-blue-800">Electronic Reservation Slip (ERS)</span>
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-3">
              <img src={trainLogo} alt="RailConnect Logo" className="w-16 h-10 object-contain" />
              <span className="text-xl font-bold text-slate-800">RailConnect / IRCTC</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-900 tracking-widest">IRCTC</span>
            </div>
          </div>
        </div>

        {/* Journey Route Block */}
        <div className="flex justify-between items-center bg-sky-50/50 p-4 border border-sky-100 rounded mb-6 text-sm">
          <div className="w-1/3">
            <p className="text-gray-500 uppercase font-semibold">Booked From</p>
            <p className="font-bold text-slate-800 text-base">{booking.source}</p>
            <p className="text-gray-500 mt-1">Start Date* {formatDate(booking.date)}</p>
          </div>
          
          <div className="w-1/3 text-center flex flex-col items-center">
            <span className="text-blue-500 font-bold bg-blue-50 px-3 py-1 rounded-full text-xs">Boarding At</span>
            <div className="flex items-center w-full justify-center text-gray-400 mt-2">
              <span className="w-8 h-px bg-gray-300 mr-2"></span>
              <span className="text-slate-800 font-bold text-sm">Departs {booking.departure_time}</span>
              <span className="w-8 h-px bg-gray-300 ml-2"></span>
            </div>
          </div>

          <div className="w-1/3 text-right">
            <p className="text-gray-500 uppercase font-semibold">To</p>
            <p className="font-bold text-slate-800 text-base">{booking.destination}</p>
            <p className="text-gray-500 mt-1">Arrival* {booking.arrival_time}</p>
          </div>
        </div>

        {/* ERS Key Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2 border border-gray-300 p-4 rounded text-sm mb-6 bg-gray-50/50">
          <div>
            <span className="text-gray-500 block">PNR</span>
            <span className="font-bold text-blue-600 text-base">{booking.pnr}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Train No./Name</span>
            <span className="font-bold text-slate-800 text-base">{booking.train_number} / {booking.train_name}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Class</span>
            <span className="font-bold text-slate-800 text-base">{booking.class_booked || "SL"}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Quota</span>
            <span className="font-bold text-slate-800 text-base">GENERAL (GN)</span>
          </div>
        </div>

        {/* Passenger Table */}
        <div className="mb-6">
          <h3 className="font-bold text-slate-800 border-b pb-2 mb-3 text-lg">Passenger Details</h3>
          <table className="w-full text-left border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-3 border-r border-gray-300"># Name</th>
                <th className="p-3 border-r border-gray-300 text-center">Age</th>
                <th className="p-3 border-r border-gray-300 text-center">Gender</th>
                <th className="p-3 border-r border-gray-300 text-center">Booking Status</th>
                <th className="p-3 text-center">Current Status</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((p, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="p-3 border-r border-gray-300 font-medium">{idx + 1}. {p.name}</td>
                  <td className="p-3 border-r border-gray-300 text-center">{p.age}</td>
                  <td className="p-3 border-r border-gray-300 text-center">{p.gender}</td>
                  <td className="p-3 border-r border-gray-300 text-center font-semibold text-green-700">{booking.status}</td>
                  <td className="p-3 text-center font-semibold text-green-700">{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment & QR Block */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Payment Details */}
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 border-b pb-2 mb-3 text-lg">Payment Details</h3>
            <div className="border border-gray-300 rounded overflow-hidden text-sm">
              <div className="flex justify-between p-3 border-b border-gray-200">
                <span className="text-gray-600">Ticket Fare</span>
                <span className="font-semibold text-slate-800">₹{baseFare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 border-b border-gray-200">
                <span className="text-gray-600">Catering Charges</span>
                <span className="font-semibold text-slate-800">₹{cateringCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 border-b border-gray-200">
                <span className="text-gray-600">IRCTC Convenience Fee (Incl. GST)</span>
                <span className="font-semibold text-slate-800">₹{convenienceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-3 bg-teal-50/50 font-bold text-teal-800 text-base">
                <span>Total Fare (all inclusive)</span>
                <span>₹{totalFarePaid.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Mock QR Code on Right */}
          <div className="w-full md:w-64 border border-gray-300 rounded p-4 flex flex-col items-center justify-center bg-gray-50/30">
            <div className="w-36 h-36 bg-white border border-gray-300 p-2 rounded flex flex-col justify-between items-center">
              {/* QR Pattern Mock */}
              <div className="grid grid-cols-4 gap-1 w-full h-full opacity-80">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className={`w-full h-full ${i % 3 === 0 || i % 5 === 1 ? 'bg-black' : 'bg-transparent'}`}></div>
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-500 mt-3 text-center">Scan QR to verify reservation validity</span>
            <span className="text-xs font-bold text-slate-700 mt-1">Transaction ID: TXN{(booking.pnr / 2).toFixed(0)}</span>
          </div>
        </div>

        {/* Warning Policy Notices */}
        <div className="text-xs text-gray-500 space-y-2 border-t pt-4">
          <p className="font-bold text-slate-700">• Beware of fraudulent customer care numbers. For support, use official numbers only.</p>
          <p>• IRCTC Convenience Fee is charged per e-ticket irrespective of number of passengers on the ticket.</p>
          <p>• The printed Departure and Arrival Times are subject to change. Please check correct times before boarding.</p>
          <p>• This ticket is booked on a personal User ID, resale is an offense under Section 143 of the Railways Act, 1989.</p>
        </div>

      </div>
    </div>
  );
};

export default TicketSlip;
