import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Faqs from "./components/Faqs";
import AdminDashboard from "./components/AdminDashboard";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";  // ⬅ ADD THIS IMPORT
import SearchResults from "./components/SearchResults";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";
import TicketSlip from "./pages/TicketSlip";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/booking" element={<Booking />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<Faqs />} />

          {/* USER ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/ticket/:id" element={<TicketSlip />} />

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
