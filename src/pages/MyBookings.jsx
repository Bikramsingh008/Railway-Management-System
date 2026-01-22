import { useState, useEffect } from "react";

const MyBookings = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/bookings/${user.id}`)
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">My Bookings</h2>

      <ul className="mt-4 space-y-3">
        {bookings.map((b) => (
          <li key={b.id} className="border p-3 rounded">
            <strong>Train:</strong> {b.train_name}  <br/>
            <strong>Date:</strong> {b.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyBookings;
