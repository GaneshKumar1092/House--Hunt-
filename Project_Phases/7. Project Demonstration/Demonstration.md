# 🎬 Phase 7: Project Demonstration — HouseHunt

---

## 7.1 Demo Flow (Step-by-Step Walkthrough)

### Step 1: Start the Application
```bash
# Terminal 1
cd Project_Files/server && npm run dev
# ✅ MongoDB Connected: localhost
# 🚀 HouseHunt API running on port 5000

# Terminal 2
cd Project_Files/client && npm start
# ✅ React app running on http://localhost:3000
```

---

### Step 2: Home Page (`/`)
- Landing hero section with gradient background
- "Browse Properties" and "List Your Property" CTA buttons
- Stats bar: 1200+ properties, 800+ renters, 50+ cities
- 6 featured approved properties displayed
- Footer with branding

---

### Step 3: Browse Properties (`/properties`)
- All approved listings shown as cards
- **Demo filter:** Type = "apartment" → shows only apartments
- **Demo filter:** Location = "Bangalore" → filters by city
- **Demo filter:** Max Price = 30000 → shows affordable options
- Active filter badges shown above results

---

### Step 4: Property Detail (`/properties/:id`)
- Full property page with hero image
- Specs panel: bedrooms, bathrooms, area, type
- Description and amenities list
- Owner contact info
- **Booking Panel** (right sidebar):
  - Select move-in date
  - Select duration (1/2/3/6/12 months)
  - Auto-calculated total price
  - Optional message to owner

---

### Step 5: User Registration (`/register`)
- Fill: Name = "Test User", Email = "test@demo.com", Password = "test123"
- Role = "Regular User"
- On success → redirected to `/dashboard`

---

### Step 6: User Login (`/login`)
- Email: `rahul@example.com` / Password: `user123`
- Redirected to `/dashboard`

---

### Step 7: User Dashboard (`/dashboard`)
**Overview Tab:**
- Stats: My Listings (3), Approved (2), Pending (1), Bookings (1)
- Recent properties summary
- Recent bookings summary

**My Properties Tab:**
- Cards with status badges (approved/pending/rejected)
- Delete button for each listing

**My Bookings Tab:**
- Booking rows with property image, location, duration, total
- Status badge: pending/confirmed/cancelled
- Cancel button for pending bookings

---

### Step 8: Add Property (`/add-property`)
- Fill all fields: title, location, type, price, bedrooms, etc.
- Submit → "Submitted for admin review" message
- Property appears as **pending** in user dashboard

---

### Step 9: Admin Login
- Email: `admin@househunt.com` / Password: `admin123`
- Redirected to `/admin`

---

### Step 10: Admin Dashboard (`/admin`)
**Overview Tab:**
- Stats: Total Properties (6), Pending (1), Approved (5), Users (3), Bookings (2)
- Quick approve/reject buttons on pending items
- Recent users list

**Pending Review Tab:**
- Property card with owner info
- ✅ Approve → status changes to "approved", appears on public site
- ❌ Reject → status changes to "rejected"

**All Properties Tab:**
- Full table: image, title, location, owner, price, type, status, date

**All Bookings Tab:**
- Full table: property, renter, duration, total, status, date

**All Users Tab:**
- Table with avatar initials, name, email, role badge, join date

---

## 7.2 API Demonstration (Postman / curl)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","email":"demo@test.com","password":"demo123"}'
```

### Login & Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@househunt.com","password":"admin123"}'
# Save the token from response
```

### Get All Properties (Public)
```bash
curl "http://localhost:5000/api/properties?location=Bangalore&type=apartment"
```

### Create Property (Authenticated)
```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Demo 2BHK",
    "description": "Nice apartment",
    "price": 20000,
    "location": "Delhi",
    "type": "apartment",
    "bedrooms": 2,
    "bathrooms": 1
  }'
```

### Approve Property (Admin)
```bash
curl -X PUT http://localhost:5000/api/properties/admin/approve/PROPERTY_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 7.3 Test Scenarios

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Register new user | POST /register with valid data | 201 + token returned |
| Login with wrong password | POST /login wrong password | 401 Invalid credentials |
| Access admin route as user | GET /admin/pending with user token | 403 Admins only |
| Book own property | POST /bookings with own propertyId | 400 Cannot book own |
| Duplicate booking | Book same property twice | 400 Already booked |
| Filter by price | GET /properties?maxPrice=20000 | Only ≤₹20000 listings |
| Cancel booking | PUT /bookings/:id/cancel | status → cancelled |
| Approve listing | PUT /admin/approve/:id | status → approved |

---

## 7.4 Screenshots Reference

| Screen | URL |
|--------|-----|
| Home Page | http://localhost:3000/ |
| Property Listings | http://localhost:3000/properties |
| Property Detail | http://localhost:3000/properties/:id |
| User Dashboard | http://localhost:3000/dashboard |
| Admin Panel | http://localhost:3000/admin |
| Add Property | http://localhost:3000/add-property |

---

## 7.5 Project Outcomes

✅ Secure JWT authentication with role-based access control
✅ Full CRUD property management with admin approval workflow
✅ Real-time filter search (location, price, type, keyword)
✅ Complete booking lifecycle (create → track → cancel)
✅ Responsive Bootstrap UI with modern dark-theme design
✅ Modular MVC backend structure for easy scalability
✅ MongoDB indexes for optimized query performance
✅ Seed data for instant demo without manual setup
