# 🏠 HouseHunt — MERN Stack House Rent Management System

> A full-stack rental platform for tenants, landlords, and administrators.

---

## 📁 Project Structure

```
HouseHunt/
├── Project_Phases/
│   ├── 1. Ideation Phase/         → Problem statement, objectives, feasibility
│   ├── 2. Requirement Analysis/   → Functional & non-functional requirements
│   ├── 3. Project Design Phase/   → Architecture, DB schema, API & UI design
│   ├── 4. Project Planning Phase/ → Timeline, tasks, risks, dependencies
│   ├── 5. Project Development Phase/ → Dev log, patterns, setup guide
│   ├── 6. Project Documentation/  → Full API reference, data models, error codes
│   └── 7. Project Demonstration/  → Demo walkthrough, test scenarios, outcomes
│
├── Project_Files/
│   ├── client/    → React.js Frontend (Bootstrap, Axios, React Router)
│   └── server/    → Node.js + Express Backend (MongoDB, JWT, bcrypt)
│
└── README.md
```

---

## 🚀 Quick Start

```bash
# 1. Backend
cd Project_Files/server
npm install
node seed.js        # seed sample data
npm run dev         # → http://localhost:5000

# 2. Frontend (new terminal)
cd Project_Files/client
npm install
npm start           # → http://localhost:3000
```

---

## 🔑 Demo Credentials

| Role  | Email                   | Password |
|-------|-------------------------|----------|
| Admin | admin@househunt.com     | admin123 |
| User  | rahul@example.com       | user123  |
| User  | priya@example.com       | user123  |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Bootstrap 5, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| Dev Tools | nodemon, morgan, dotenv, concurrently |

---

## ✨ Features

- 🔐 JWT Authentication + Role-Based Access (User / Admin)
- 🏠 Property listing, search & filter (location, price, type)
- 📋 Booking system with status tracking
- 👤 User dashboard (my listings + my bookings)
- 🛡️ Admin panel (approve/reject listings, view all users & bookings)
- 📱 Fully responsive Bootstrap UI
