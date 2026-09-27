import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import trainLogoLight from "../assets/trainLogoLight.jpg";
import trainLogoDark from "../assets/trainLogoDark.jpg";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const checkUser = () => {
    const saved = localStorage.getItem("user");
    if (saved && saved !== "null") {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.username) {
          setUser(parsed);
          return;
        }
      } catch (e) {}
    }
    setUser(null);
  };

  useEffect(() => {
    checkUser();
    
    // Apply dark mode on mount
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    window.addEventListener("auth-change", checkUser);
    window.addEventListener("storage", checkUser);
    
    return () => {
      window.removeEventListener("auth-change", checkUser);
      window.removeEventListener("storage", checkUser);
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

  return (
    <div className="sticky top-4 z-50 flex justify-center">
      <nav
        className="
          w-[95%] max-w-7xl
          bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
          rounded-full
          px-8 py-3
          shadow-lg dark:shadow-teal-900/20
          border border-slate-200 dark:border-slate-700
          animate-navbarDown
        "
      >
        <div className="flex items-center justify-between">

          {/* Left */}
          <div className="flex items-center gap-3">
            <img
              src={trainLogoLight}
              alt="RailConnect"
              className="w-16 h-10 object-contain rounded-full block dark:hidden"
              style={{ mixBlendMode: "multiply" }}
            />
            <img
              src={trainLogoDark}
              alt="RailConnect"
              className="w-16 h-10 object-contain rounded-full hidden dark:block"
            />
            <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-100">
              <span className="text-teal-600 dark:text-teal-400">Rail</span>Connect
            </h1>
          </div>

          {/* Center */}
          <div className="hidden md:flex gap-6 text-base font-medium text-slate-600 dark:text-slate-300">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/faqs">FAQs</NavItem>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Toggle Theme"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
              )}
            </button>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold hover:text-teal-600 dark:hover:text-teal-400 transition"
                >
                  <span className="text-xl">👋</span> {user.username}
                </Link>

                <button
                  onClick={handleLogout}
                  className="
                    px-5 py-1.5 rounded-full
                    bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400
                    hover:bg-rose-200 dark:hover:bg-rose-800
                    transition
                    font-semibold
                    ml-2
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
                    px-5 py-1.5 rounded-full
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
                    px-5 py-1.5 rounded-full
                    border border-teal-500
                    text-teal-600 dark:text-teal-400 dark:border-teal-400
                    hover:bg-teal-50 dark:hover:bg-teal-900/30
                    transition font-semibold
                  "
                >
                  Register
                </Link>
                
                <Link
                  to="/admin"
                  className="
                    px-5 py-1.5 rounded-full
                    bg-slate-800 text-white dark:bg-slate-700
                    hover:bg-slate-900 dark:hover:bg-slate-600
                    transition font-semibold
                    ml-1
                  "
                >
                  Admin
                </Link>
              </>
            )}
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
      hover:text-teal-600 dark:hover:text-teal-400
      transition
      after:absolute after:left-0 after:-bottom-1
      after:h-[2px] after:w-0
      after:bg-teal-500 dark:after:bg-teal-400
      after:transition-all
      hover:after:w-full
    "
  >
    {children}
  </Link>
);

export default Navbar;

