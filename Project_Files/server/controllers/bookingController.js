const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create a booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { propertyId, bookingDate, moveInDate, duration, message } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    if (property.status !== 'approved') {
      return res.status(400).json({ message: 'Property is not available for booking' });
    }
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot book your own property' });
    }

    // Check for duplicate booking
    const existingBooking = await Booking.findOne({
      userId: req.user._id,
      propertyId,
      status: { $ne: 'cancelled' }
    });
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this property' });
    }

    const totalAmount = property.price * (duration || 1);

    const booking = await Booking.create({
      userId: req.user._id,
      propertyId,
      bookingDate: bookingDate || new Date(),
      moveInDate,
      duration: duration || 1,
      totalAmount,
      message,
      status: 'pending'
    });

    const populated = await Booking.findById(booking._id)
      .populate('propertyId', 'title location price image')
      .populate('userId', 'name email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('propertyId', 'title location price image type')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('propertyId', 'title location price')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Get all users
const getAllUsers = async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking, getAllBookings, getAllUsers };
