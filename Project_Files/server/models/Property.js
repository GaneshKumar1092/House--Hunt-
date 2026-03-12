const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['apartment', 'house', 'villa', 'studio', 'condo', 'townhouse']
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
  },
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  area: { type: Number },
  amenities: [{ type: String }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

// Index for search optimization
propertySchema.index({ location: 'text', title: 'text' });
propertySchema.index({ price: 1 });
propertySchema.index({ status: 1 });

module.exports = mongoose.model('Property', propertySchema);
