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
import Dashboard from "./pages/Dashboard";  // ⬅ ADD THIS IMPORT
import SearchResults from "./components/SearchResults";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search-results" element={<SearchResults />} />
          <Route path="/about" element={<div className="p-10 text-center">About Us Page</div>} />
          <Route path="/faqs" element={<Faqs />} />

          {/* USER ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />   {/* ⬅ FIXED */}

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
