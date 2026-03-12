# 📋 Phase 2: Requirement Analysis — HouseHunt

---

## 2.1 Functional Requirements

### Authentication Module
- FR-01: Users shall be able to register with name, email, password, and role
- FR-02: Users shall be able to log in with email and password
- FR-03: Passwords shall be encrypted using bcryptjs
- FR-04: Authenticated sessions shall use JWT tokens
- FR-05: Role-based access control shall support "user" and "admin" roles

### Property Module
- FR-06: Authenticated users shall be able to submit property listings
- FR-07: Listings shall include title, description, price, location, type, image, bedrooms, bathrooms, area, amenities
- FR-08: All submitted properties shall default to "pending" status
- FR-09: Users shall be able to view, edit, and delete their own listings
- FR-10: Public users shall view only "approved" listings
- FR-11: Properties shall be searchable by location, price range, and type

### Booking Module
- FR-12: Authenticated users shall be able to book any approved property
- FR-13: A user cannot book their own property
- FR-14: A user cannot create duplicate bookings for the same property
- FR-15: Users shall be able to cancel pending bookings
- FR-16: Booking shall capture move-in date, duration, and optional message

### Admin Module
- FR-17: Admins shall view all pending property listings
- FR-18: Admins shall approve or reject listings
- FR-19: Admins shall view all registered users
- FR-20: Admins shall view all bookings across the platform

---

## 2.2 Non-Functional Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR-01 | Security | JWT auth, bcrypt hashing, CORS protection |
| NFR-02 | Performance | MongoDB indexes on price, status, location |
| NFR-03 | Scalability | Modular MVC architecture |
| NFR-04 | Usability | Responsive Bootstrap UI for mobile/desktop |
| NFR-05 | Reliability | Error handling middleware on all routes |
| NFR-06 | Maintainability | Separate controllers, routes, models |

---

## 2.3 Database Requirements

### Collections Required
| Collection | Purpose |
|-----------|---------|
| Users | Store registered users with roles |
| Properties | Store all property listings |
| Bookings | Track all rental bookings |

---

## 2.4 API Requirements

| Module | Endpoints Needed |
|--------|-----------------|
| Auth | POST /register, POST /login, GET /me |
| Properties | GET, GET/:id, POST, PUT/:id, DELETE/:id, GET/my |
| Admin Props | GET/pending, GET/all, PUT/approve/:id, PUT/reject/:id |
| Bookings | POST, GET, PUT/:id/cancel |
| Admin Bookings | GET/all, GET/users |

---

## 2.5 Use Case Summary

```
[Guest]      → Browse/Search Properties
[User]       → Register → Login → Book Property → Manage Listings
[Admin]      → Login → Approve/Reject Listings → View Users/Bookings
```

---

## 2.6 Constraints
- Internet connection required
- MongoDB must be running locally or via Atlas
- Node.js v16+ required
- Modern browser required for React frontend
