const Property = require('../models/Property');

// @desc    Get all approved properties with filters
// @route   GET /api/properties
const getProperties = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, type, search } = req.query;
    const filter = { status: 'approved' };

    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type) filter.type = type;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const properties = await Property.find(filter)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create property
// @route   POST /api/properties
const createProperty = async (req, res) => {
  try {
    const { title, description, price, location, type, image, bedrooms, bathrooms, area, amenities } = req.body;

    const property = await Property.create({
      title, description, price, location, type,
      image: image || undefined,
      bedrooms, bathrooms, area,
      amenities: amenities || [],
      owner: req.user._id,
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's own properties
// @route   GET /api/properties/my
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Get all pending properties
const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'pending' })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Get all properties
const getAllPropertiesAdmin = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Approve property
const approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Property approved', property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Reject property
const rejectProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Property rejected', property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProperties, getPropertyById, createProperty, updateProperty,
  deleteProperty, getMyProperties, getPendingProperties,
  getAllPropertiesAdmin, approveProperty, rejectProperty
};
