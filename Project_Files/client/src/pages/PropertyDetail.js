import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, createBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ moveInDate: '', duration: 1, message: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    getPropertyById(id)
      .then(({ data }) => setProperty(data))
      .catch(() => navigate('/properties'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setBookingLoading(true);
    try {
      await createBooking({ propertyId: id, bookingDate: new Date(), ...booking });
      setAlert({ type: 'success', msg: '🎉 Booking submitted! Check your dashboard for updates.' });
    } catch (err) {
      setAlert({ type: 'danger', msg: err.response?.data?.message || 'Booking failed' });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="spinner-border" style={{ color: '#e94560' }} />
    </div>
  );

  if (!property) return null;

  const totalPrice = property.price * booking.duration;

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', paddingBottom: '3rem' }}>
      {/* Hero Image */}
      <div style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
        <img
          src={property.image}
          alt={property.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
        <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '900px' }}>
          <span className="badge mb-2" style={{ background: '#e94560', fontSize: '0.8rem' }}>{property.type}</span>
          <h2 className="text-white fw-bold mb-1">{property.title}</h2>
          <p className="text-white mb-0">📍 {property.location}</p>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row g-4">
          <div className="col-lg-8">
            {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h3 className="fw-bold mb-0" style={{ color: '#e94560' }}>
                      ₹{property.price?.toLocaleString()}<span className="text-muted fs-6 fw-normal">/month</span>
                    </h3>
                  </div>
                  <span className={`badge bg-${property.status === 'approved' ? 'success' : 'warning'}`}>
                    {property.status}
                  </span>
                </div>

                <div className="row g-3 mb-4">
                  {[
                    { label: 'Bedrooms', val: property.bedrooms, icon: '🛏' },
                    { label: 'Bathrooms', val: property.bathrooms, icon: '🚿' },
                    { label: 'Area', val: property.area ? `${property.area} sqft` : 'N/A', icon: '📐' },
                    { label: 'Type', val: property.type, icon: '🏠' },
                  ].map((item, i) => (
                    <div key={i} className="col-6 col-md-3">
                      <div className="text-center p-3 rounded-3" style={{ background: '#f8f9fa' }}>
                        <div className="h4 mb-1">{item.icon}</div>
                        <div className="fw-bold small">{item.val}</div>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{item.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <h5 className="fw-bold mb-2">Description</h5>
                <p className="text-muted">{property.description}</p>

                {property.amenities?.length > 0 && (
                  <>
                    <h5 className="fw-bold mb-2">Amenities</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {property.amenities.map((a, i) => (
                        <span key={i} className="badge" style={{ background: '#e8f4ff', color: '#0f3460', padding: '6px 12px', borderRadius: '20px' }}>
                          ✓ {a}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-1">Listed by</h5>
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#0f3460', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>
                    {property.owner?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="fw-bold">{property.owner?.name}</div>
                    <div className="text-muted small">{property.owner?.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Panel */}
          <div className="col-lg-4">
            <div className="card border-0 shadow" style={{ borderRadius: '16px', position: 'sticky', top: '80px' }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Book This Property</h5>
                {property.status !== 'approved' ? (
                  <div className="alert alert-warning small">This property is not available for booking yet.</div>
                ) : (
                  <form onSubmit={handleBook}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Move-in Date</label>
                      <input type="date" className="form-control" style={{ borderRadius: '10px' }}
                        value={booking.moveInDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setBooking({ ...booking, moveInDate: e.target.value })}
                        required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Duration (months)</label>
                      <select className="form-select" style={{ borderRadius: '10px' }}
                        value={booking.duration}
                        onChange={e => setBooking({ ...booking, duration: parseInt(e.target.value) })}>
                        {[1, 2, 3, 6, 12].map(n => <option key={n} value={n}>{n} month{n > 1 ? 's' : ''}</option>)}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Message (optional)</label>
                      <textarea className="form-control" rows="3" style={{ borderRadius: '10px' }}
                        placeholder="Introduce yourself to the owner..."
                        value={booking.message}
                        onChange={e => setBooking({ ...booking, message: e.target.value })} />
                    </div>

                    <div className="p-3 rounded-3 mb-3" style={{ background: '#f8f9fa' }}>
                      <div className="d-flex justify-content-between small mb-1">
                        <span>₹{property.price?.toLocaleString()} × {booking.duration} month(s)</span>
                        <span className="fw-bold" style={{ color: '#e94560' }}>₹{totalPrice?.toLocaleString()}</span>
                      </div>
                    </div>

                    <button type="submit" className="btn w-100 py-2 fw-bold"
                      disabled={bookingLoading || !user}
                      style={{ background: 'linear-gradient(135deg, #e94560, #c73652)', color: 'white', borderRadius: '10px' }}>
                      {bookingLoading ? 'Processing...' : user ? 'Request Booking' : 'Login to Book'}
                    </button>
                    {!user && (
                      <p className="text-center small mt-2 text-muted">
                        <a href="/login" style={{ color: '#e94560' }}>Login</a> to book this property
                      </p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
