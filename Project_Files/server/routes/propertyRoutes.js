const express = require('express');
const router = express.Router();
const {
  getProperties, getPropertyById, createProperty,
  updateProperty, deleteProperty, getMyProperties,
  getPendingProperties, getAllPropertiesAdmin, approveProperty, rejectProperty
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

// Public routes
router.get('/', getProperties);
router.get('/my', protect, getMyProperties);
router.get('/:id', getPropertyById);

// Protected routes
router.post('/', protect, createProperty);
router.put('/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllPropertiesAdmin);
router.get('/admin/pending', protect, adminOnly, getPendingProperties);
router.put('/admin/approve/:id', protect, adminOnly, approveProperty);
router.put('/admin/reject/:id', protect, adminOnly, rejectProperty);

module.exports = router;
