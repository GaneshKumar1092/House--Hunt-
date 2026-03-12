# 📄 Phase 6: Project Documentation — HouseHunt

---

## 6.1 Project Overview

**HouseHunt** is a full-stack MERN web application for house rental management. It provides separate experiences for tenants, landlords, and administrators — all within a single responsive platform.

| Attribute | Detail |
|-----------|--------|
| Project Name | HouseHunt |
| Type | Full-Stack Web Application |
| Stack | MongoDB, Express.js, React.js, Node.js |
| Authentication | JWT + bcryptjs |
| UI Framework | Bootstrap 5 |

---

## 6.2 Complete Folder Structure

```
HouseHunt/
│
├── Project_Phases/
│   ├── 1. Ideation Phase/
│   │   └── Ideation.md
│   ├── 2. Requirement Analysis/
│   │   └── Requirements.md
│   ├── 3. Project Design Phase/
│   │   └── Design.md
│   ├── 4. Project Planning Phase/
│   │   └── Planning.md
│   ├── 5. Project Development Phase/
│   │   └── Development.md
│   ├── 6. Project Documentation/
│   │   └── Documentation.md
│   └── 7. Project Demonstration/
│       └── Demonstration.md
│
├── Project_Files/
│   ├── client/                        ← React Frontend
│   │   ├── package.json
│   │   ├── .env
│   │   ├── public/
│   │   │   └── index.html
│   │   └── src/
│   │       ├── App.js
│   │       ├── index.js
│   │       ├── context/
│   │       │   └── AuthContext.js
│   │       ├── services/
│   │       │   └── api.js
│   │       ├── components/
│   │       │   ├── Navbar.js
│   │       │   ├── PropertyCard.js
│   │       │   └── SearchFilter.js
│   │       └── pages/
│   │           ├── Home.js
│   │           ├── Login.js
│   │           ├── Register.js
│   │           ├── PropertyList.js
│   │           ├── PropertyDetail.js
│   │           ├── AddProperty.js
│   │           ├── Dashboard.js
│   │           └── AdminDashboard.js
│   │
│   └── server/                        ← Node.js Backend
│       ├── package.json
│       ├── .env
│       ├── server.js
│       ├── seed.js
│       ├── config/
│       │   └── db.js
│       ├── models/
│       │   ├── User.js
│       │   ├── Property.js
│       │   └── Booking.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── propertyController.js
│       │   └── bookingController.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   └── roleMiddleware.js
│       └── routes/
│           ├── authRoutes.js
│           ├── propertyRoutes.js
│           └── bookingRoutes.js
│
└── README.md
```

---

## 6.3 API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication Headers
```
Authorization: Bearer <jwt_token>
```

### Auth Endpoints
```
POST   /auth/register     → { name, email, password, role }
POST   /auth/login        → { email, password }
GET    /auth/me           → (protected)
```

### Property Endpoints
```
GET    /properties                      → ?location=&type=&minPrice=&maxPrice=&search=
GET    /properties/:id
POST   /properties                      → (protected)
PUT    /properties/:id                  → (owner/admin)
DELETE /properties/:id                  → (owner/admin)
GET    /properties/my                   → (protected)
GET    /properties/admin/pending        → (admin)
GET    /properties/admin/all            → (admin)
PUT    /properties/admin/approve/:id    → (admin)
PUT    /properties/admin/reject/:id     → (admin)
```

### Booking Endpoints
```
POST   /bookings                        → (protected)
GET    /bookings                        → (protected — own bookings)
PUT    /bookings/:id/cancel             → (protected)
GET    /bookings/admin/all              → (admin)
GET    /bookings/admin/users            → (admin)
```

---

## 6.4 Data Models

### User
| Field | Type | Constraints |
|-------|------|-------------|
| name | String | required, min:2 |
| email | String | required, unique, valid format |
| password | String | required, min:6, hashed |
| role | String | enum: user\|admin, default: user |

### Property
| Field | Type | Constraints |
|-------|------|-------------|
| title | String | required |
| description | String | required |
| price | Number | required, min:0 |
| location | String | required |
| type | String | enum: apartment\|house\|villa\|studio\|condo\|townhouse |
| image | String | URL, has default |
| bedrooms | Number | default:1 |
| bathrooms | Number | default:1 |
| area | Number | optional |
| amenities | [String] | optional array |
| owner | ObjectId | ref: User |
| status | String | enum: pending\|approved\|rejected, default: pending |

### Booking
| Field | Type | Constraints |
|-------|------|-------------|
| userId | ObjectId | ref: User, required |
| propertyId | ObjectId | ref: Property, required |
| bookingDate | Date | required |
| moveInDate | Date | optional |
| duration | Number | default:1 (months) |
| totalAmount | Number | price × duration |
| message | String | optional |
| status | String | enum: pending\|confirmed\|cancelled |

---

## 6.5 Error Codes

| HTTP Code | Meaning | When |
|-----------|---------|------|
| 200 | OK | Successful GET/PUT |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation error, duplicate booking |
| 401 | Unauthorized | Missing/invalid JWT token |
| 403 | Forbidden | Role mismatch (non-admin accessing admin route) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected exception |

---

## 6.6 Installation & Setup Guide

```bash
# 1. Clone / unzip project
cd HouseHunt/Project_Files

# 2. Setup backend
cd server
npm install
# Edit .env: set MONGO_URI and JWT_SECRET
node seed.js        # Load sample data
npm run dev         # Start backend :5000

# 3. Setup frontend (new terminal)
cd ../client
npm install
npm start           # Start frontend :3000

# 4. Open browser
# http://localhost:3000
```

---

## 6.7 Security Checklist
- [x] Passwords hashed with bcryptjs (12 rounds)
- [x] JWT tokens signed with secret, expire in 7 days
- [x] All sensitive routes protected with authMiddleware
- [x] Admin routes additionally protected with roleMiddleware
- [x] .env file never committed to version control
- [x] CORS restricted to frontend origin
- [x] Mongoose schema validation on all inputs
- [x] Owner verification before edit/delete operations
