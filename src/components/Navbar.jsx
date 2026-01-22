import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import trainLogo from "../assets/trainLogo.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved && saved !== "null") {
      const parsed = JSON.parse(saved);
      if (parsed?.username) setUser(parsed);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="sticky top-4 z-50 flex justify-center">
      <nav
        className="
          w-[95%] max-w-7xl
          bg-white/80 backdrop-blur-xl
          rounded-full
          px-10 py-4
          shadow-lg
          border border-slate-200
          animate-navbarDown
        "
      >
        <div className="flex items-center justify-between">

          {/* Left */}
          <div className="flex items-center gap-4">
            <img
              src={trainLogo}
              alt="RailConnect"
              className="w-20 h-12 object-contain"
            />
            <h1 className="text-3xl font-bold text-slate-700">
              <span className="text-teal-600">Rail</span>Connect
            </h1>
          </div>

          {/* Center */}
          <div className="hidden md:flex gap-8 text-lg font-medium text-slate-600">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/faqs">FAQs</NavItem>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:block text-slate-600 font-medium">
                  👋 {user.username}
                </span>

                <button
                  onClick={handleLogout}
                  className="
                    px-6 py-2 rounded-full
                    bg-rose-100 text-rose-600
                    hover:bg-rose-200
                    transition
                    font-semibold
                  "
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="
                    px-6 py-2 rounded-full
                    bg-teal-500 text-white
                    hover:bg-teal-600
                    transition font-semibold
                  "
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="
                    px-6 py-2 rounded-full
                    border border-teal-500
                    text-teal-600
                    hover:bg-teal-50
                    transition font-semibold
                  "
                >
                  Register
                </Link>
              </>
            )}

            <Link
              to="/admin"
              className="
                px-6 py-2 rounded-full
                bg-slate-800 text-white
                hover:bg-slate-900
                transition font-semibold
              "
            >
              Admin
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

/* Nav Item */
const NavItem = ({ to, children }) => (
  <Link
    to={to}
    className="
      relative px-1
      hover:text-teal-600
      transition
      after:absolute after:left-0 after:-bottom-1
      after:h-[2px] after:w-0
      after:bg-teal-500
      after:transition-all
      hover:after:w-full
    "
  >
    {children}
  </Link>
);

export default Navbar;
