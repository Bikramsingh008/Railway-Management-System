import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import trainLogo from "../assets/trainLogo.png";

const MidComponent = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [allTrains, setAllTrains] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedTrains = JSON.parse(localStorage.getItem("trainData")) || [];
    setAllTrains(storedTrains);
  }, []);

  const handleSearch = () => {
    if (!source || !destination || !date) {
      alert("Please fill all fields!");
      return;
    }

    navigate("/search-results", {
      state: { source, destination, date, allTrains },
    });
  };

-  return (
    <div className="bg-gradient-to-br from-teal-50 via-sky-50 to-emerald-50 flex items-start justify-center py-30 px-6 pb-28">

      <div className="flex flex-col lg:flex-row items-center gap-16 max-w-7xl w-full">

        {/* Train Image */}
        <div className="flex justify-center">
          <img
            src={trainLogo}
            alt="Train"
            className="w-[620px] drop-shadow-xl animate-float"
          />
        </div>

        {/* Search Card */}
        <div className="bg-white/70 backdrop-blur-xl p-12 rounded-3xl shadow-2xl w-full max-w-md border border-white/60">
          <h2 className="text-4xl font-bold text-slate-700 mb-10 text-center">
            🚆 Search Trains
          </h2>

          <div className="space-y-7">
            <Input
              placeholder="Source Station"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />

            <Input
              placeholder="Destination Station"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />

            <input
              type="date"
              className="inputStyle"
              value={date}
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
