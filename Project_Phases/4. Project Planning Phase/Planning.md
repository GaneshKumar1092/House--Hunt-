# 📅 Phase 4: Project Planning Phase — HouseHunt

---

## 4.1 Project Timeline (4 Weeks)

| Week | Phase | Tasks |
|------|-------|-------|
| Week 1 | Setup & Backend Core | Project scaffold, DB models, Auth API |
| Week 2 | Backend Complete | Property & Booking APIs, Admin routes, Middleware |
| Week 3 | Frontend Core | React setup, Pages, Auth flows, Property CRUD UI |
| Week 4 | Integration & Polish | API wiring, Dashboards, Testing, README |

---

## 4.2 Detailed Task Breakdown

### Week 1 — Backend Foundation
- [x] Initialize Node.js project, install dependencies
- [x] Connect MongoDB with Mongoose
- [x] Create User model with bcrypt hashing
- [x] Build Auth controller (register, login, getMe)
- [x] Implement JWT token generation
- [x] Set up authMiddleware and roleMiddleware
- [x] Test auth routes with Postman

### Week 2 — Backend Features
- [x] Create Property model with indexes
- [x] Build Property controller (CRUD + filters)
- [x] Build Admin property routes (approve/reject)
- [x] Create Booking model
- [x] Build Booking controller
- [x] Add error handling middleware
- [x] Write seed.js for sample data

### Week 3 — Frontend Development
- [x] Bootstrap React app with react-router-dom
- [x] Create AuthContext for global auth state
- [x] Build Navbar, PropertyCard, SearchFilter components
- [x] Build Home, Login, Register pages
- [x] Build PropertyList with filter support
- [x] Build PropertyDetail with booking panel
- [x] Build AddProperty form

### Week 4 — Dashboards & Finalization
- [x] Build User Dashboard (listings + bookings tabs)
- [x] Build Admin Dashboard (pending, all props, users, bookings)
- [x] Wire all Axios API calls in services/api.js
- [x] Protected routes (ProtectedRoute component)
- [x] End-to-end testing
- [x] Write README.md

---

## 4.3 Tech Stack & Dependencies

### Backend Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework |
| mongoose | ^7.3.1 | MongoDB ODM |
| jsonwebtoken | ^9.0.0 | JWT auth |
| bcryptjs | ^2.4.3 | Password hashing |
| cors | ^2.8.5 | Cross-origin requests |
| dotenv | ^16.0.3 | Environment variables |
| morgan | ^1.10.0 | HTTP request logging |
| nodemon | ^3.0.1 | Dev auto-restart |

### Frontend Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UI framework |
| react-router-dom | ^6.14.0 | Client-side routing |
| axios | ^1.4.0 | HTTP client |
| bootstrap | ^5.3.0 | CSS framework |

---

## 4.4 Environment Configuration

### backend/.env
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/househunt
JWT_SECRET=househunt_super_secret_jwt_key_2024
NODE_ENV=development
```

### frontend/.env
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 4.5 Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| MongoDB connection failure | Low | High | Use Atlas as fallback |
| JWT secret exposure | Low | High | Use .env, add to .gitignore |
| Scope creep | Medium | Medium | Stick to defined FR list |
| CORS issues | Medium | Low | Pre-configured in server.js |
| Image loading failures | Medium | Low | Fallback URLs in components |

---

## 4.6 Team Roles (Solo Project)
| Role | Responsibility |
|------|---------------|
| Backend Developer | Models, Controllers, Routes, Middleware |
| Frontend Developer | Pages, Components, Context, API wiring |
| Database Admin | Schema design, indexes, seeding |
| QA Tester | Manual testing of all endpoints and UI flows |
