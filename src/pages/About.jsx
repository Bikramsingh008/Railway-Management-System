import React from "react";

const features = [
  {
    icon: "🔍",
    title: "Smart Train Search",
    desc: "Search trains between any two stations instantly. Filter by date, class, and availability to find the perfect journey.",
  },
  {
    icon: "🎟️",
    title: "Easy Ticket Booking",
    desc: "Book tickets in just a few clicks. Choose your preferred class — Sleeper, AC 3 Tier, AC 2 Tier, or AC First Class.",
  },
  {
    icon: "🛡️",
    title: "Secure Authentication",
    desc: "Your data is safe with us. Register and login securely to manage all your bookings in one place.",
  },
  {
    icon: "🛠️",
    title: "Admin Control Panel",
    desc: "Admins can add, update, and remove trains and manage seat availability for any date with ease.",
  },
  {
    icon: "📅",
    title: "Date-wise Availability",
    desc: "Check real-time seat availability for specific travel dates across all train classes.",
  },
  {
    icon: "📋",
    title: "My Bookings",
    desc: "Track all your past and upcoming journeys in one place. Never miss a travel update.",
  },
];

const techStack = [
  { name: "React", icon: "⚛️", color: "bg-sky-100 text-sky-700" },
  { name: "Vite", icon: "⚡", color: "bg-purple-100 text-purple-700" },
  { name: "Tailwind CSS", icon: "🎨", color: "bg-teal-100 text-teal-700" },
  { name: "React Router", icon: "🔗", color: "bg-orange-100 text-orange-700" },
  { name: "Node.js", icon: "🟢", color: "bg-green-100 text-green-700" },
  { name: "SQL Database", icon: "🗄️", color: "bg-blue-100 text-blue-700" },
];

const team = [
  { name: "Bikram Singh", role: "Full Stack Developer", emoji: "👨‍💻" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-sky-50 to-white">

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <span className="text-6xl">🚆</span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 mt-4 mb-4">
          About <span className="text-teal-600">RailConnect</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
          A modern Railway Management System designed to make train travel
          simpler, smarter, and more accessible for everyone — passengers and
          administrators alike.
        </p>
        <div className="mt-6 w-20 h-1 bg-teal-500 mx-auto rounded-full"></div>
      </section>

      {/* About the Project */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-10 border border-white/60">
          <h2 className="text-3xl font-bold text-slate-700 mb-5">
            📌 What is RailConnect?
          </h2>
          <p className="text-slate-600 text-lg leading-8 mb-4">
            <strong>RailConnect</strong> is a full-featured Railway Management
            System built as a student project to demonstrate real-world web
            development skills. It allows users to search for trains, check seat
            availability, and book tickets, while giving administrators complete
            control over the train network.
          </p>
          <p className="text-slate-600 text-lg leading-8 mb-4">
            The project is inspired by the Indian Railway reservation system and
            aims to replicate its core functionalities in a clean, modern, and
            responsive interface. It covers everything from user authentication
            to admin dashboards.
          </p>
          <p className="text-slate-600 text-lg leading-8">
            Built using <strong>React</strong> on the frontend and designed to
            connect with a <strong>Node.js + SQL</strong> backend, this project
            is a complete end-to-end solution for managing railway operations
            digitally.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <h2 className="text-3xl font-bold text-center text-slate-700 mb-10">
          ✨ Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md p-7 border border-slate-100
                         hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <span className="text-4xl">{f.icon}</span>
              <h3 className="text-xl font-bold text-slate-700 mt-3 mb-2">
                {f.title}
              </h3>
              <p className="text-slate-500 leading-6">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-white/60 backdrop-blur py-14 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-700 mb-10">
            🛠️ Tech Stack
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((t, i) => (
              <span
                key={i}
                className={`px-6 py-3 rounded-full text-lg font-semibold shadow-sm ${t.color}`}
              >
                {t.icon} {t.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-slate-700 mb-10">
          🚀 How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          {[
            { step: "1", label: "Register / Login", icon: "👤" },
            { step: "2", label: "Search a Train", icon: "🔍" },
            { step: "3", label: "Choose a Class", icon: "🎫" },
            { step: "4", label: "Book Your Seat", icon: "✅" },
          ].map((s) => (
            <div
              key={s.step}
              className="bg-gradient-to-b from-teal-500 to-emerald-600
                         text-white rounded-2xl p-6 shadow-lg"
            >
              <div className="text-4xl mb-3">{s.icon}</div>
              <div className="text-4xl font-black opacity-30 absolute">{s.step}</div>
              <p className="font-bold text-lg">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Developer Section */}
      <section className="bg-white/60 backdrop-blur py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-700 mb-10">
            👨‍💻 Meet the Developer
          </h2>
          {team.map((member, i) => (
            <div
              key={i}
              className="inline-flex flex-col items-center bg-white rounded-3xl
                         shadow-xl px-14 py-10 border border-slate-100"
            >
              <span className="text-7xl mb-4">{member.emoji}</span>
              <h3 className="text-2xl font-bold text-slate-700">
                {member.name}
              </h3>
              <p className="text-teal-600 font-semibold mt-1">{member.role}</p>
              <p className="text-slate-500 mt-4 max-w-md text-sm leading-6">
                Passionate about building real-world applications using modern
                web technologies. This project is part of my learning journey in
                full-stack development.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Note */}
      <section className="text-center py-12 text-slate-400 text-sm">
        <p>© 2026 RailConnect — Railway Management System. Built with ❤️ as a student project.</p>
      </section>
    </div>
  );
};

export default About;
