// seed.js - Run with: node seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/househunt';

const userSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String }, { timestamps: true });
const propertySchema = new mongoose.Schema({ title: String, description: String, price: Number, location: String, type: String, image: String, bedrooms: Number, bathrooms: Number, area: Number, amenities: [String], owner: mongoose.Schema.Types.ObjectId, status: String }, { timestamps: true });
const bookingSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, propertyId: mongoose.Schema.Types.ObjectId, bookingDate: Date, duration: Number, totalAmount: Number, status: String }, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Property = mongoose.model('Property', propertySchema);
const Booking = mongoose.model('Booking', bookingSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Property.deleteMany({});
  await Booking.deleteMany({});

  // Create users
  const adminPass = await bcrypt.hash('admin123', 12);
  const userPass = await bcrypt.hash('user123', 12);

  const admin = await User.create({ name: 'Admin User', email: 'admin@househunt.com', password: adminPass, role: 'admin' });
  const user1 = await User.create({ name: 'Rahul Sharma', email: 'rahul@example.com', password: userPass, role: 'user' });
  const user2 = await User.create({ name: 'Priya Patel', email: 'priya@example.com', password: userPass, role: 'user' });

  console.log('✅ Users created');

  // Create properties
  const properties = await Property.insertMany([
    {
      title: 'Modern 2BHK Apartment in Koramangala',
      description: 'Spacious and well-furnished 2BHK apartment in the heart of Koramangala. Close to IT parks, restaurants, and metro station. Features modular kitchen, covered parking.',
      price: 25000, location: 'Koramangala, Bangalore', type: 'apartment',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      bedrooms: 2, bathrooms: 2, area: 1100,
      amenities: ['WiFi', 'Parking', 'Security', 'Power Backup'],
      owner: user1._id, status: 'approved'
    },
    {
      title: 'Cozy Studio Near Cyber Hub',
      description: 'Perfectly located studio apartment near Cyber Hub, Gurugram. Ideal for working professionals. Fully furnished with all modern amenities.',
      price: 18000, location: 'Sector 29, Gurugram', type: 'studio',
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
      bedrooms: 1, bathrooms: 1, area: 450,
      amenities: ['WiFi', 'AC', 'Gym', 'Elevator'],
      owner: user1._id, status: 'approved'
    },
    {
      title: 'Luxury 3BHK Villa in Banjara Hills',
      description: 'Premium 3BHK villa with private garden and swimming pool in Banjara Hills. Perfect for families. 24/7 security, club house access.',
      price: 65000, location: 'Banjara Hills, Hyderabad', type: 'villa',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      bedrooms: 3, bathrooms: 3, area: 2400,
      amenities: ['Swimming Pool', 'Gym', 'Parking', 'Garden', 'Security'],
      owner: user2._id, status: 'approved'
    },
    {
      title: 'Affordable 1BHK in Andheri West',
      description: 'Clean and well-maintained 1BHK apartment near Andheri metro station. Easy access to Western Line. Semi-furnished.',
      price: 22000, location: 'Andheri West, Mumbai', type: 'apartment',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      bedrooms: 1, bathrooms: 1, area: 580,
      amenities: ['Parking', 'Security'],
      owner: user2._id, status: 'approved'
    },
    {
      title: 'Spacious 4BHK House in Adyar',
      description: 'Independent house with large garden in Adyar, Chennai. Ideal for large families. Separate servant quarter. Peaceful locality.',
      price: 45000, location: 'Adyar, Chennai', type: 'house',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      bedrooms: 4, bathrooms: 3, area: 3000,
      amenities: ['Parking', 'Garden', 'Security', 'Power Backup'],
      owner: admin._id, status: 'approved'
    },
    {
      title: 'Modern Condo in Salt Lake',
      description: 'Stylish 2BHK condo in Salt Lake City, Kolkata. Premium amenities, centrally air-conditioned. Near IT Sector V.',
      price: 28000, location: 'Salt Lake, Kolkata', type: 'condo',
      image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      bedrooms: 2, bathrooms: 2, area: 1200,
      amenities: ['AC', 'Gym', 'Swimming Pool', 'Elevator', 'Parking'],
      owner: user1._id, status: 'pending'
    },
  ]);

  console.log('✅ Properties created');

  // Create bookings
  await Booking.insertMany([
    { userId: user1._id, propertyId: properties[2]._id, bookingDate: new Date(), duration: 6, totalAmount: 390000, status: 'confirmed' },
    { userId: user2._id, propertyId: properties[0]._id, bookingDate: new Date(), duration: 12, totalAmount: 300000, status: 'pending' },
  ]);

  console.log('✅ Bookings created');
  console.log('\n🎉 Database seeded successfully!');
  console.log('\nDemo Accounts:');
  console.log('  Admin: admin@househunt.com / admin123');
  console.log('  User:  rahul@example.com / user123');
  console.log('  User:  priya@example.com / user123');

  mongoose.disconnect();
}

seed().catch(err => { console.error(err); mongoose.disconnect(); });
