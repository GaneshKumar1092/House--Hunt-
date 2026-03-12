import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AddProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', price: '', location: '',
    type: 'apartment', image: '', bedrooms: 1, bathrooms: 1,
    area: '', amenities: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const data = {
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area: form.area ? Number(form.area) : undefined,
        amenities: form.amenities ? form.amenities.split(',').map(s => s.trim()).filter(Boolean) : []
      };
      await createProperty(data);
      setSuccess(user.role === 'admin'
        ? '✅ Property listed and approved!'
        : '✅ Property submitted for admin review. It will be live once approved.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '3rem' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '40px 0' }}>
        <div className="container text-white">
          <h2 className="fw-bold mb-1">📋 List Your Property</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Fill in the details below to list your property on HouseHunt</p>
        </div>
      </div>

      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-bold">Property Title *</label>
                      <input type="text" className="form-control" style={{ borderRadius: '10px' }}
                        placeholder="e.g. Modern 2BHK Apartment in Koramangala"
                        value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Location *</label>
                      <input type="text" className="form-control" style={{ borderRadius: '10px' }}
                        placeholder="e.g. Koramangala, Bangalore"
                        value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Property Type *</label>
                      <select className="form-select" style={{ borderRadius: '10px' }}
                        value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="villa">Villa</option>
                        <option value="studio">Studio</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Monthly Rent (₹) *</label>
                      <input type="number" className="form-control" style={{ borderRadius: '10px' }}
                        placeholder="e.g. 15000" min="0"
                        value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Bedrooms</label>
                      <input type="number" className="form-control" style={{ borderRadius: '10px' }}
                        min="0" max="20" value={form.bedrooms}
                        onChange={e => setForm({ ...form, bedrooms: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">Bathrooms</label>
                      <input type="number" className="form-control" style={{ borderRadius: '10px' }}
                        min="0" max="20" value={form.bathrooms}
                        onChange={e => setForm({ ...form, bathrooms: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Area (sq ft)</label>
                      <input type="number" className="form-control" style={{ borderRadius: '10px' }}
                        placeholder="e.g. 1200" min="0"
                        value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Image URL</label>
                      <input type="url" className="form-control" style={{ borderRadius: '10px' }}
                        placeholder="https://... (leave blank for default)"
                        value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold">Amenities</label>
                      <input type="text" className="form-control" style={{ borderRadius: '10px' }}
                        placeholder="e.g. WiFi, Parking, Gym, Swimming Pool (comma separated)"
                        value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold">Description *</label>
                      <textarea className="form-control" rows="4" style={{ borderRadius: '10px' }}
                        placeholder="Describe your property in detail..."
                        value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-3 small" style={{ background: '#fff3cd' }}>
                    ⚠️ <strong>Note:</strong> Your listing will be reviewed by our admin team before going live. This usually takes 24-48 hours.
                  </div>

                  <div className="d-flex gap-3 mt-4">
                    <button type="submit" className="btn px-5 py-2 fw-bold" disabled={loading}
                      style={{ background: 'linear-gradient(135deg, #e94560, #c73652)', color: 'white', borderRadius: '10px' }}>
                      {loading ? 'Submitting...' : 'Submit Listing'}
                    </button>
                    <button type="button" className="btn btn-outline-secondary py-2" style={{ borderRadius: '10px' }}
                      onClick={() => navigate('/dashboard')}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
