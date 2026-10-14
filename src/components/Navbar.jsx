import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LiveTrainTracker from "./LiveTrainTracker";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [pnrModalOpen, setPnrModalOpen] = useState(false);
  const [liveTrackerOpen, setLiveTrackerOpen] = useState(false);
  const [pnrInput, setPnrInput] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const checkUserAndBookings = () => {
    const saved = localStorage.getItem("user");
    if (saved && saved !== "null") {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.username) {
          setUser(parsed);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }

    try {
      const allBookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
      setBookingsCount(allBookings.length);
    } catch (e) {
      setBookingsCount(0);
    }
  };

  useEffect(() => {
    checkUserAndBookings();

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    window.addEventListener("auth-change", checkUserAndBookings);
    window.addEventListener("storage", checkUserAndBookings);

    return () => {
      window.removeEventListener("auth-change", checkUserAndBookings);
      window.removeEventListener("storage", checkUserAndBookings);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  };

  const toggleDarkMode = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handlePnrSearch = (e) => {
    e.preventDefault();
    if (!pnrInput.trim()) return;
    
    const allBookings = JSON.parse(localStorage.getItem("myBookings") || "[]");
    const found = allBookings.find(
      (b) => String(b.pnr).toLowerCase() === pnrInput.trim().toLowerCase()
    );

    setPnrModalOpen(false);
    if (found) {
      navigate(`/ticket/${found.id}`);
    } else {
      navigate(`/ticket/${pnrInput.trim()}`);
    }
    setPnrInput("");
  };

  return (
    <>
      {/* Top Station Live Ticker Bar */}
      <div className="bg-teal-900/95 dark:bg-slate-950 text-white text-xs py-1.5 px-4 border-b border-teal-800 dark:border-slate-800 transition-colors hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
              IRCTC NETWORK ONLINE
            </span>
            <span className="text-teal-400/50 dark:text-slate-600">|</span>
            <span className="text-teal-200 dark:text-slate-400 font-medium">
              National Rail Booking Terminal
            </span>
          </div>
          <div className="flex items-center gap-4 text-teal-200 dark:text-slate-400 font-medium">
            <span>Rail Helpline: <strong className="text-white">139</strong></span>
            <span className="text-teal-400/50 dark:text-slate-600">|</span>
            <button
              onClick={() => setLiveTrackerOpen(true)}
              className="text-teal-300 hover:text-white font-bold flex items-center gap-1 transition"
            >
              <span>📍</span> Live Train Status
            </button>
            <span className="text-teal-400/50 dark:text-slate-600">|</span>
            <button
              onClick={() => setPnrModalOpen(true)}
              className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 transition"
            >
              <span>🔍</span> PNR Inquiry
            </button>
          </div>
        </div>
      </div>

      {/* Main Beautiful, Balanced, Floating Navbar */}
      <header className="sticky top-2 sm:top-3 z-50 flex justify-center px-3 sm:px-6 w-full">
        <nav
          className="
            w-full max-w-7xl
            bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl
            rounded-2xl sm:rounded-full
            px-4 sm:px-6 py-2.5
            shadow-xl dark:shadow-teal-950/30
            border border-slate-200/80 dark:border-slate-800
            relative overflow-hidden
            animate-navbarDown
            transition-all duration-300
          "
        >
          {/* Subtle Top Rail Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-75"></div>

          <div className="flex items-center justify-between gap-3">

            {/* Left: Brand Logo & Title */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center text-white text-lg shadow-sm group-hover:scale-105 transition-transform">
                🚆
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    <span className="text-teal-600 dark:text-teal-400">Rail</span>Connect
                  </span>
                  <span className="bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-teal-300 dark:border-teal-800">
                    IRCTC
                  </span>
                </div>
              </div>
            </Link>

            {/* Center: Balanced, Clean Nav Items (Evenly Spaced, Proper Font Size) */}
            <div className="hidden lg:flex items-center gap-1 font-semibold text-sm">
              <NavLink to="/" active={location.pathname === "/"}>
                <span>🚆</span> Book Trains
              </NavLink>

              <NavLink to="/my-bookings" active={location.pathname === "/my-bookings"}>
                <span>🎫</span> My Bookings
                {bookingsCount > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 text-[10px] font-black bg-orange-500 text-white rounded-full">
                    {bookingsCount}
                  </span>
                )}
              </NavLink>

              {/* Live Status Button */}
              <button
                onClick={() => setLiveTrackerOpen(true)}
                className="px-3.5 py-1.5 rounded-full text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 font-semibold text-sm"
              >
                <span>📍</span> Live Status
              </button>

              {/* PNR Status Button */}
              <button
                onClick={() => setPnrModalOpen(true)}
                className="px-3.5 py-1.5 rounded-full text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 font-semibold text-sm"
              >
                <span>🔍</span> PNR Status
              </button>

              <NavLink to="/about" active={location.pathname === "/about"}>
                <span>ℹ️</span> About
              </NavLink>

              <NavLink to="/faqs" active={location.pathname === "/faqs"}>
                <span>❓</span> FAQs
              </NavLink>
            </div>

            {/* Right: Actions, Theme Toggle & User Account */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">

              {/* Compact Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                title={darkMode ? "Switch to Day Express" : "Switch to Night Express"}
                aria-label="Toggle Theme"
              >
                {darkMode ? "💡" : "☀️"}
              </button>

              {/* User State */}
              {user ? (
                <div className="flex items-center gap-2">
                  {/* Clean Profile Badge */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 transition"
                    title="View Profile"
                  >
                    <div className="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center text-xs">
                      {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                      {user.username}
                    </span>
                  </Link>

                  {/* Compact Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 transition font-bold text-xs"
                    title="Logout"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/login"
                    className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition font-bold text-xs shadow-sm"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="hidden sm:inline-block px-3.5 py-1.5 rounded-xl border border-teal-500 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition font-bold text-xs"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition"
                aria-label="Open Mobile Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

            </div>

          </div>

          {/* Mobile Menu Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-1.5 pb-2 text-sm font-semibold">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <span>🚆</span> Book Trains
              </Link>
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <span>🎫</span> My Bookings
                </span>
                {bookingsCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-orange-500 text-white rounded-full">
                    {bookingsCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLiveTrackerOpen(true);
                }}
                className="p-2.5 rounded-xl flex items-center gap-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <span>📍</span> Live Train Status
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setPnrModalOpen(true);
                }}
                className="p-2.5 rounded-xl flex items-center gap-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <span>🔍</span> Check PNR Status
              </button>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <span>ℹ️</span> About System
              </Link>
              <Link
                to="/faqs"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <span>❓</span> FAQs &amp; Help
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* ── Live Train Route Modal ── */}
      {liveTrackerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeUp">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <LiveTrainTracker onClose={() => setLiveTrackerOpen(false)} />
          </div>
        </div>
      )}

      {/* ── PNR Status Modal ── */}
      {pnrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeUp">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-[95%] max-w-md p-6 shadow-2xl relative text-slate-800 dark:text-slate-100">
            <button
              onClick={() => setPnrModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xl shadow">
                🔍
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  PNR Status Inquiry
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter 10-digit PNR for instant ticket details
                </p>
              </div>
            </div>

            <form onSubmit={handlePnrSearch} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="e.g. PNRHVTH8KPS or 10-digit number"
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
                  autoFocus
                />
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setPnrModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow transition text-xs"
                >
                  Track E-Ticket ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

/* Clean NavLink */
const NavLink = ({ to, active, children }) => (
  <Link
    to={to}
    className={`
      px-3.5 py-1.5 rounded-full font-semibold transition-all
      ${
        active
          ? "bg-teal-600 text-white shadow-sm"
          : "text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      }
    `}
  >
    {children}
  </Link>
);

export default Navbar;
