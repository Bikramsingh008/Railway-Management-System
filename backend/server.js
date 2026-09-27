const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
// DATABASE SETUP  →  backend/database.sqlite
// ─────────────────────────────────────────────
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database: " + err.message);
    } else {
        console.log("Connected to the SQLite database.");
        db.serialize(() => {

            // ── TABLE: users ──────────────────────────────────
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                username   TEXT UNIQUE NOT NULL,
                password   TEXT NOT NULL,
                email      TEXT,
                first_name TEXT,
                last_name  TEXT
            )`);

            // ── TABLE: trains ─────────────────────────────────
            // Core train master data (admin managed)
            db.run(`CREATE TABLE IF NOT EXISTS trains (
                id             INTEGER PRIMARY KEY AUTOINCREMENT,
                train_name     TEXT NOT NULL,
                train_number   TEXT UNIQUE NOT NULL,
                source         TEXT NOT NULL,
                destination    TEXT NOT NULL,
                departure_time TEXT NOT NULL,
                arrival_time   TEXT NOT NULL,
                days           TEXT NOT NULL,
                price_SL       REAL DEFAULT 0,
                price_AC3      REAL DEFAULT 0,
                price_AC2      REAL DEFAULT 0,
                price_AC1      REAL DEFAULT 0
            )`);

            // ── TABLE: train_seats ────────────────────────────
            // Per-date seat availability for each train
            db.run(`CREATE TABLE IF NOT EXISTS train_seats (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                train_id     INTEGER NOT NULL,
                journey_date TEXT NOT NULL,
                seats_SL     INTEGER DEFAULT 0,
                seats_AC3    INTEGER DEFAULT 0,
                seats_AC2    INTEGER DEFAULT 0,
                seats_AC1    INTEGER DEFAULT 0,
                FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE,
                UNIQUE(train_id, journey_date)
            )`);

            // ── TABLE: bookings ───────────────────────────────
            db.run(`CREATE TABLE IF NOT EXISTS bookings (
                id                INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id           INTEGER NOT NULL,
                train_name        TEXT,
                train_number      TEXT,
                pnr               TEXT UNIQUE,
                date              TEXT,
                source            TEXT,
                destination       TEXT,
                departure_time    TEXT,
                arrival_time      TEXT,
                boarding_station  TEXT,
                status            TEXT DEFAULT 'BOOKED',
                passenger_details TEXT,
                duration          TEXT,
                class_booked      TEXT,
                total_price       REAL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`, () => {
                seedTrains(); // seed after all tables are ready
            });
        });
    }
});

// ─────────────────────────────────────────────
// SEED DATA  (runs once; skips if data exists)
// ─────────────────────────────────────────────
function seedTrains() {
    db.get(`SELECT COUNT(*) as count FROM trains`, [], (err, row) => {
        if (err || row.count > 0) return;

        console.log("Seeding train data...");

        const trains = [
            { train_name:"RailConnect Express",     train_number:"RC101", source:"Delhi",      destination:"Mumbai",    departure_time:"06:00", arrival_time:"22:00", days:["Mon","Wed","Fri","Sun"],                    price_SL:800,  price_AC3:1500, price_AC2:2200, price_AC1:3500 },
            { train_name:"Himalayan Swift",          train_number:"RC102", source:"Delhi",      destination:"Dehradun",  departure_time:"08:00", arrival_time:"14:00", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],  price_SL:350,  price_AC3:700,  price_AC2:1100, price_AC1:1800 },
            { train_name:"Coastal Queen",            train_number:"RC103", source:"Mumbai",     destination:"Goa",       departure_time:"07:30", arrival_time:"15:30", days:["Tue","Thu","Sat"],                          price_SL:450,  price_AC3:900,  price_AC2:1400, price_AC1:2200 },
            { train_name:"Southern Star",            train_number:"RC104", source:"Chennai",    destination:"Bangalore", departure_time:"10:00", arrival_time:"15:30", days:["Mon","Wed","Fri","Sat"],                    price_SL:300,  price_AC3:600,  price_AC2:950,  price_AC1:1500 },
            { train_name:"Gateway Superfast",        train_number:"RC105", source:"Ahmedabad",  destination:"Mumbai",    departure_time:"05:30", arrival_time:"12:30", days:["Mon","Tue","Thu","Fri","Sun"],              price_SL:420,  price_AC3:850,  price_AC2:1250, price_AC1:2000 },
            { train_name:"Eastern Arrow",            train_number:"RC106", source:"Kolkata",    destination:"Patna",     departure_time:"09:15", arrival_time:"16:00", days:["Mon","Wed","Fri"],                          price_SL:380,  price_AC3:750,  price_AC2:1150, price_AC1:1900 },
            { train_name:"Desert Wind",              train_number:"RC107", source:"Jaipur",     destination:"Delhi",     departure_time:"14:00", arrival_time:"18:30", days:["Tue","Thu","Sat","Sun"],                    price_SL:250,  price_AC3:500,  price_AC2:800,  price_AC1:1300 },
            { train_name:"Deccan Pride",             train_number:"RC108", source:"Pune",       destination:"Hyderabad", departure_time:"18:00", arrival_time:"06:30", days:["Mon","Wed","Fri","Sun"],                    price_SL:550,  price_AC3:1000, price_AC2:1600, price_AC1:2500 },
            { train_name:"Haldwani Janshatabdi",     train_number:"RC109", source:"Haldwani",   destination:"Dehradun",  departure_time:"14:00", arrival_time:"20:00", days:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],  price_SL:200,  price_AC3:450,  price_AC2:700,  price_AC1:1100 },
            { train_name:"Nilgiri Mountain Express", train_number:"RC110", source:"Coimbatore", destination:"Ooty",      departure_time:"07:10", arrival_time:"12:10", days:["Tue","Thu","Sat","Sun"],                    price_SL:180,  price_AC3:380,  price_AC2:600,  price_AC1:950  },
        ];

        const insertTrain = db.prepare(`
            INSERT INTO trains (train_name,train_number,source,destination,departure_time,arrival_time,days,price_SL,price_AC3,price_AC2,price_AC1)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
        `);

        // Generate next 8 dates for seat availability
        const today = new Date();
        const dates = Array.from({ length: 8 }, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            return d.toISOString().split('T')[0];
        });

        trains.forEach(t => {
            insertTrain.run(
                t.train_name, t.train_number, t.source, t.destination,
                t.departure_time, t.arrival_time, JSON.stringify(t.days),
                t.price_SL, t.price_AC3, t.price_AC2, t.price_AC1,
                function(err) {
                    if (err) return;
                    const trainId = this.lastID;
                    dates.forEach(date => {
                        db.run(`INSERT OR IGNORE INTO train_seats (train_id,journey_date,seats_SL,seats_AC3,seats_AC2,seats_AC1) VALUES (?,?,?,?,?,?)`,
                            [trainId, date, 120, 72, 48, 24]);
                    });
                }
            );
        });
        insertTrain.finalize();
        console.log("Seed data inserted successfully.");
    });
}

// ─────────────────────────────────────────────
// HELPER — build train object from DB rows
// ─────────────────────────────────────────────
function buildTrainObject(trainRow, seatRows) {
    const seatAvailability = {};
    (seatRows || []).forEach(s => {
        seatAvailability[s.journey_date] = { SL:s.seats_SL, AC3:s.seats_AC3, AC2:s.seats_AC2, AC1:s.seats_AC1 };
    });
    return {
        id:            trainRow.id,
        trainName:     trainRow.train_name,
        trainNumber:   trainRow.train_number,
        source:        trainRow.source,
        destination:   trainRow.destination,
        departureTime: trainRow.departure_time,
        arrivalTime:   trainRow.arrival_time,
        days:          JSON.parse(trainRow.days || '[]'),
        ticketPrices:  { SL:trainRow.price_SL, AC3:trainRow.price_AC3, AC2:trainRow.price_AC2, AC1:trainRow.price_AC1 },
        seatAvailability,
    };
}

// User Registration Route
app.post('/api/register', (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;
    
    // Check if user exists
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (row) return res.status(400).json({ success: false, message: "Username already exists!" });

        // Insert new user
        const sql = `INSERT INTO users (username, password, email, first_name, last_name) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [username, password, email, firstName, lastName], function(err) {
            if (err) {
                res.status(400).json({ success: false, message: err.message });
                return;
            }
            res.json({ success: true, message: "Registration successful! You can now log in." });
        });
    });
});

// User Login Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    db.get(sql, [username, password], (err, row) => {
        if (err) {
            res.status(400).json({ success: false, message: err.message });
            return;
        }
        if (row) {
            const user = { id: row.id, username: row.username, email: row.email, first_name: row.first_name, last_name: row.last_name };
            res.json({ success: true, message: "Login successful!", user });
        } else {
            res.status(401).json({ success: false, message: "Invalid username or password" });
        }
    });
});

// Update User Route
app.put('/api/user/:id', (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const userId = req.params.id;

    if (password) {
        // Update with password
        db.run(
            `UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ? WHERE id = ?`,
            [first_name, last_name, email, password, userId],
            function(err) {
                if (err) return res.status(400).json({ success: false, message: err.message });
                res.json({ success: true, message: "Profile updated successfully!" });
            }
        );
    } else {
        // Update without password
        db.run(
            `UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?`,
            [first_name, last_name, email, userId],
            function(err) {
                if (err) return res.status(400).json({ success: false, message: err.message });
                res.json({ success: true, message: "Profile updated successfully!" });
            }
        );
    }
});

// ═════════════════════════════════════════════
//  API ROUTES
// ═════════════════════════════════════════════

// ── GET /api/trains ───────────────────────────
// Returns all trains with seat availability
app.get('/api/trains', (req, res) => {
    db.all(`SELECT * FROM trains ORDER BY id`, [], (err, trainRows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (trainRows.length === 0) return res.json({ success: true, trains: [] });

        db.all(`SELECT * FROM train_seats`, [], (err2, seatRows) => {
            if (err2) return res.status(500).json({ success: false, message: err2.message });
            const trains = trainRows.map(t => {
                const mySeats = seatRows.filter(s => s.train_id === t.id);
                return buildTrainObject(t, mySeats);
            });
            res.json({ success: true, trains });
        });
    });
});

// ── POST /api/trains ──────────────────────────
// Admin adds new train or updates seats for a date
app.post('/api/trains', (req, res) => {
    const { trainName, trainNumber, source, destination, departureTime, arrivalTime, days, journeyDate, seats, prices } = req.body;
    const daysJson = JSON.stringify(Array.isArray(days) ? days : []);
    const seatSL=Number(seats?.SL||0), seatAC3=Number(seats?.AC3||0), seatAC2=Number(seats?.AC2||0), seatAC1=Number(seats?.AC1||0);
    const pSL=Number(prices?.SL||0), pAC3=Number(prices?.AC3||0), pAC2=Number(prices?.AC2||0), pAC1=Number(prices?.AC1||0);

    db.get(`SELECT id FROM trains WHERE train_number = ?`, [trainNumber], (err, existing) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        if (existing) {
            const trainId = existing.id;
            db.run(`UPDATE trains SET price_SL=?,price_AC3=?,price_AC2=?,price_AC1=? WHERE id=?`, [pSL,pAC3,pAC2,pAC1,trainId]);
            db.run(`INSERT OR REPLACE INTO train_seats (train_id,journey_date,seats_SL,seats_AC3,seats_AC2,seats_AC1) VALUES (?,?,?,?,?,?)`,
                [trainId, journeyDate, seatSL, seatAC3, seatAC2, seatAC1],
                err2 => err2
                    ? res.status(500).json({ success:false, message:err2.message })
                    : res.json({ success:true, message:`Seats updated for ${trainNumber} on ${journeyDate}` })
            );
        } else {
            db.run(`INSERT INTO trains (train_name,train_number,source,destination,departure_time,arrival_time,days,price_SL,price_AC3,price_AC2,price_AC1) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
                [trainName,trainNumber,source,destination,departureTime,arrivalTime,daysJson,pSL,pAC3,pAC2,pAC1],
                function(err2) {
                    if (err2) return res.status(500).json({ success:false, message:err2.message });
                    const trainId = this.lastID;
                    db.run(`INSERT OR REPLACE INTO train_seats (train_id,journey_date,seats_SL,seats_AC3,seats_AC2,seats_AC1) VALUES (?,?,?,?,?,?)`,
                        [trainId, journeyDate, seatSL, seatAC3, seatAC2, seatAC1],
                        err3 => err3
                            ? res.status(500).json({ success:false, message:err3.message })
                            : res.json({ success:true, message:`Train ${trainNumber} added successfully.` })
                    );
                }
            );
        }
    });
});

// ── DELETE /api/trains/:id ────────────────────
// Admin deletes a train
app.delete('/api/trains/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM trains WHERE id=?`, [id], err => {
        if (err) return res.status(500).json({ success:false, message:err.message });
        db.run(`DELETE FROM train_seats WHERE train_id=?`, [id]);
        res.json({ success:true, message:"Train deleted." });
    });
});

// ── POST /api/book ────────────────────────────
// Book a ticket + decrement seat count
app.post('/api/book', (req, res) => {
    const { user_id, train_name, train_number, date, source, destination, departure_time, arrival_time, boarding_station, passenger_details, duration, class_booked, total_price } = req.body;
    const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const passengersStr = JSON.stringify(passenger_details);

    db.run(`INSERT INTO bookings (user_id,train_name,train_number,pnr,date,source,destination,departure_time,arrival_time,boarding_station,status,passenger_details,duration,class_booked,total_price) VALUES (?,?,?,?,?,?,?,?,?,?,'BOOKED',?,?,?,?)`,
        [user_id,train_name,train_number,pnr,date,source,destination,departure_time,arrival_time,boarding_station,passengersStr,duration,class_booked,total_price],
        function(err) {
            if (err) return res.status(400).json({ success:false, message:err.message });

            // Decrement seat count
            const colMap = { SL:'seats_SL', AC3:'seats_AC3', AC2:'seats_AC2', AC1:'seats_AC1' };
            const col = colMap[class_booked];
            if (col) {
                db.get(`SELECT id FROM trains WHERE train_number=?`, [train_number], (e, trow) => {
                    if (!e && trow)
                        db.run(`UPDATE train_seats SET ${col}=MAX(0,${col}-1) WHERE train_id=? AND journey_date=?`, [trow.id, date]);
                });
            }
            res.json({ success:true, message:"Ticket booked successfully!", pnr });
        }
    );
});

// ── GET /api/bookings/:userId ─────────────────
app.get('/api/bookings/:userId', (req, res) => {
    db.all(`SELECT * FROM bookings WHERE user_id=? ORDER BY id DESC`, [req.params.userId], (err, rows) => {
        if (err) return res.status(400).json({ success:false, message:err.message });
        res.json({ success:true, bookings:rows });
    });
});

// ── GET /api/booking/:bookingId ───────────────
app.get('/api/booking/:bookingId', (req, res) => {
    db.get(`SELECT * FROM bookings WHERE id=?`, [req.params.bookingId], (err, row) => {
        if (err) return res.status(400).json({ success:false, message:err.message });
        res.json({ success:true, booking:row });
    });
});

// ── GET /api/admin/users ──────────────────────
// Admin: view all registered users
app.get('/api/admin/users', (req, res) => {
    db.all(`SELECT id,username,email,first_name,last_name FROM users ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ success:false, message:err.message });
        res.json({ success:true, users:rows });
    });
});

// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

