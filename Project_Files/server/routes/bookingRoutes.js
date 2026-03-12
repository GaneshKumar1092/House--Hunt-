const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking, getAllBookings, getAllUsers } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.post('/', protect, createBooking);
router.get('/', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllBookings);
router.get('/admin/users', protect, adminOnly, getAllUsers);

module.exports = router;
