# 🎨 Phase 3: Project Design Phase — HouseHunt

---

## 3.1 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React.js)                     │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────────┐ │
│  │  Pages   │  │ Components │  │  Context / Services  │ │
│  └──────────┘  └────────────┘  └──────────────────────┘ │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP/REST (Axios)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  SERVER (Node + Express)                 │
│  ┌──────────┐  ┌─────────────┐  ┌────────────────────┐  │
│  │  Routes  │  │ Controllers │  │    Middleware       │  │
│  └──────────┘  └─────────────┘  └────────────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │ Mongoose ODM
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB)                     │
│        Users │ Properties │ Bookings                    │
└─────────────────────────────────────────────────────────┘
```

---

## 3.2 Database Schema Design

### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "String (required, min:2)",
  "email": "String (required, unique)",
  "password": "String (hashed, min:6)",
  "role": "String (enum: user|admin, default: user)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Properties Collection
```json
{
  "_id": "ObjectId",
  "title": "String (required)",
  "description": "String (required)",
  "price": "Number (required, min:0)",
  "location": "String (required)",
  "type": "String (enum: apartment|house|villa|studio|condo|townhouse)",
  "image": "String (URL)",
  "bedrooms": "Number",
  "bathrooms": "Number",
  "area": "Number",
  "amenities": "[String]",
  "owner": "ObjectId → Users",
  "status": "String (enum: pending|approved|rejected, default: pending)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Bookings Collection
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId → Users",
  "propertyId": "ObjectId → Properties",
  "bookingDate": "Date (required)",
  "moveInDate": "Date",
  "duration": "Number (months)",
  "totalAmount": "Number",
  "message": "String",
  "status": "String (enum: pending|confirmed|cancelled, default: pending)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 3.3 API Design

### Auth Routes
| Method | Endpoint | Body | Auth | Response |
|--------|----------|------|------|----------|
| POST | /api/auth/register | name, email, password, role | ❌ | user + token |
| POST | /api/auth/login | email, password | ❌ | user + token |
| GET | /api/auth/me | — | ✅ | user object |

### Property Routes
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| GET | /api/properties | ❌ | Query: location, type, minPrice, maxPrice, search |
| GET | /api/properties/:id | ❌ | Populates owner |
| POST | /api/properties | ✅ User | status → pending |
| PUT | /api/properties/:id | ✅ Owner/Admin | |
| DELETE | /api/properties/:id | ✅ Owner/Admin | |
| GET | /api/properties/my | ✅ User | Own listings only |
| GET | /api/properties/admin/pending | ✅ Admin | |
| PUT | /api/properties/admin/approve/:id | ✅ Admin | |
| PUT | /api/properties/admin/reject/:id | ✅ Admin | |

### Booking Routes
| Method | Endpoint | Auth | Notes |
|--------|----------|------|-------|
| POST | /api/bookings | ✅ User | Cannot book own property |
| GET | /api/bookings | ✅ User | Own bookings only |
| PUT | /api/bookings/:id/cancel | ✅ User | Own bookings only |
| GET | /api/bookings/admin/all | ✅ Admin | All bookings |
| GET | /api/bookings/admin/users | ✅ Admin | All users |

---

## 3.4 Frontend Page Structure

| Page | Route | Access | Description |
|------|-------|--------|-------------|
| Home | / | Public | Hero, featured listings, stats |
| Property List | /properties | Public | Search, filter, browse |
| Property Detail | /properties/:id | Public | Full detail + booking panel |
| Add Property | /add-property | User | Submit new listing |
| Dashboard | /dashboard | User | My listings + bookings |
| Admin Panel | /admin | Admin | Pending approvals, all data |
| Login | /login | Guest | JWT login |
| Register | /register | Guest | Create account |

---

## 3.5 Component Tree

```
App
├── Navbar
├── Routes
│   ├── Home
│   │   ├── PropertyCard (×6)
│   ├── PropertyList
│   │   ├── SearchFilter
│   │   └── PropertyCard (×n)
│   ├── PropertyDetail
│   │   └── Booking Form
│   ├── AddProperty
│   ├── Dashboard
│   │   └── PropertyCard (×n)
│   ├── AdminDashboard
│   ├── Login
│   └── Register
└── Footer
```

---

## 3.6 Security Design

| Layer | Mechanism |
|-------|-----------|
| Password Storage | bcryptjs with 12 salt rounds |
| Session | JWT (7-day expiry, signed with secret) |
| Route Protection | authMiddleware verifies Bearer token |
| Role Guard | roleMiddleware checks req.user.role === 'admin' |
| CORS | Configured for localhost:3000 only |
| Input Validation | Mongoose schema validators |
