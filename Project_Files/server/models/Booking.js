const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  moveInDate: {
    type: Date
  },
  duration: {
    type: Number,
    default: 1,
    min: 1
  },
  totalAmount: {
    type: Number
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
