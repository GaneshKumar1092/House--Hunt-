# 💻 Phase 5: Project Development Phase — HouseHunt

---

## 5.1 Development Environment Setup

```bash
# Prerequisites
node --version   # v16+
npm --version    # v8+
mongod --version # v6+

# Project setup
cd HouseHunt/Project_Files

# Install backend
cd server
npm install

# Install frontend
cd ../client
npm install
```

---

## 5.2 Backend Development Log

### Step 1: Project Initialization
```bash
cd server
npm init -y
npm install express mongoose jsonwebtoken bcryptjs cors dotenv morgan
npm install --save-dev nodemon
```

### Step 2: Server Entry Point (`server.js`)
- Express app created with JSON body parser
- CORS configured for React frontend (port 3000)
- Morgan logging enabled
- Routes mounted: `/api/auth`, `/api/properties`, `/api/bookings`
- 404 and global error handlers added

### Step 3: MongoDB Connection (`config/db.js`)
- Mongoose `connect()` using `MONGO_URI` from `.env`
- Process exits on connection failure

### Step 4: Models Created
| Model | Key Validators |
|-------|---------------|
| User | email unique, password min:6, role enum |
| Property | price min:0, type enum (6 values), status enum |
| Booking | userId & propertyId as ObjectId refs, status enum |

### Step 5: Middleware
- `authMiddleware.js` — Extracts Bearer token, verifies JWT, attaches `req.user`
- `roleMiddleware.js` — Checks `req.user.role === 'admin'`

### Step 6: Controllers
- **authController** — register (hash + save), login (compare + JWT), getMe
- **propertyController** — Full CRUD, filter query builder, admin approve/reject
- **bookingController** — Create (with duplicate check), list mine, cancel, admin views

### Step 7: Seeding
```bash
node seed.js
# Creates: 3 users, 6 properties (5 approved, 1 pending), 2 bookings
```

---

## 5.3 Frontend Development Log

### Step 1: React App Setup
```bash
cd client
npx create-react-app .
npm install react-router-dom axios bootstrap
```

### Step 2: Authentication Context
- `AuthContext.js` persists user to `localStorage` as `househunt_user`
- Exposes: `user`, `login()`, `register()`, `logout()`
- Consumed via `useAuth()` hook throughout the app

### Step 3: Axios Service Layer (`services/api.js`)
- Single Axios instance with `baseURL` from `.env`
- Request interceptor: attaches `Authorization: Bearer <token>`
- Response interceptor: redirects to `/login` on 401

### Step 4: Components Built
| Component | Description |
|-----------|-------------|
| Navbar | Responsive, shows user dropdown + admin badge |
| PropertyCard | Image, type badge, status badge, price, quick actions |
| SearchFilter | 5-field filter form (search, location, type, min/max price) |

### Step 5: Pages Built
| Page | Key Implementation Details |
|------|---------------------------|
| Home | Hero section, stats bar, featured 6 properties, CTA |
| Login | JWT login, redirects admin → /admin, user → /dashboard |
| Register | Role selection, confirm password validation |
| PropertyList | Calls `getProperties(filters)`, shows active filter badges |
| PropertyDetail | Full details, owner info, booking form with price calculator |
| AddProperty | Full form with amenities (comma-separated), 24hr approval notice |
| Dashboard | 4 stat cards, 3 tabs: overview / my properties / my bookings |
| AdminDashboard | 5 stat cards, 5 tabs: overview / pending / all props / bookings / users |

### Step 6: Protected Routes
```jsx
<ProtectedRoute>         // requires login
<ProtectedRoute adminOnly> // requires admin role
```

---

## 5.4 Key Code Patterns Used

### Filter Query Builder (Backend)
```js
const filter = { status: 'approved' };
if (location) filter.location = { $regex: location, $options: 'i' };
if (type) filter.type = type;
if (minPrice || maxPrice) {
  filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
}
```

### Duplicate Booking Prevention
```js
const existing = await Booking.findOne({
  userId: req.user._id,
  propertyId,
  status: { $ne: 'cancelled' }
});
if (existing) return res.status(400).json({ message: 'Already booked' });
```

### Owner-Only Property Guard
```js
if (property.owner.toString() !== req.user._id.toString()
    && req.user.role !== 'admin') {
  return res.status(403).json({ message: 'Not authorized' });
}
```

---

## 5.5 Running the Project

```bash
# Terminal 1 - Backend
cd Project_Files/server
npm run dev          # nodemon server.js → :5000

# Terminal 2 - Frontend
cd Project_Files/client
npm start            # React dev server → :3000

# Or from root (both together)
npm install          # installs concurrently
npm run dev          # runs both simultaneously
```

---

## 5.6 Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@househunt.com | admin123 |
| User | rahul@example.com | user123 |
| User | priya@example.com | user123 |
