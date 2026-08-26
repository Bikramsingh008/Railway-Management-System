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
    fetch("http://localhost:5000/api/trains")
      .then(res => res.json())
      .then(data => { if (data.success) setAllTrains(data.trains); })
      .catch(() => setAllTrains([]));
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

  return (
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
