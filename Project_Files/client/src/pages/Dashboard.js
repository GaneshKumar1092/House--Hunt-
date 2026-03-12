import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProperties, getMyBookings, deleteProperty, cancelBooking } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    Promise.all([getMyProperties(), getMyBookings()])
      .then(([pRes, bRes]) => { setProperties(pRes.data); setBookings(bRes.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await deleteProperty(id);
      setProperties(properties.filter(p => p._id !== id));
      setAlert({ type: 'success', msg: 'Property deleted' });
    } catch (err) {
      setAlert({ type: 'danger', msg: 'Failed to delete property' });
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id);
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      setAlert({ type: 'success', msg: 'Booking cancelled' });
    } catch (err) {
      setAlert({ type: 'danger', msg: 'Failed to cancel booking' });
    }
  };

  const stats = [
    { icon: '🏠', label: 'My Listings', value: properties.length, color: '#0f3460' },
    { icon: '✅', label: 'Approved', value: properties.filter(p => p.status === 'approved').length, color: '#198754' },
    { icon: '⏳', label: 'Pending', value: properties.filter(p => p.status === 'pending').length, color: '#f59e0b' },
    { icon: '📋', label: 'Bookings', value: bookings.length, color: '#e94560' },
  ];

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="spinner-border" style={{ color: '#e94560' }} />
    </div>
  );

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '40px 0' }}>
        <div className="container text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-1">👋 Welcome, {user?.name}</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Manage your properties and bookings</p>
            </div>
            <Link to="/add-property" className="btn" style={{ background: '#e94560', color: 'white', borderRadius: '10px' }}>
              + Add Property
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {alert && <div className={`alert alert-${alert.type} alert-dismissible`}>
          {alert.msg}
          <button className="btn-close" onClick={() => setAlert(null)} />
        </div>}

        {/* Stats */}
        <div className="row g-3 mb-4">
          {stats.map((s, i) => (
            <div key={i} className="col-6 col-md-3">
              <div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: '12px', borderTop: `3px solid ${s.color}` }}>
                <div className="h3 mb-1">{s.icon}</div>
                <div className="h4 fw-bold mb-0" style={{ color: s.color }}>{s.value}</div>
                <div className="text-muted small">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <ul className="nav nav-pills mb-4">
          {[
            { key: 'overview', label: '📊 Overview' },
            { key: 'properties', label: '🏠 My Properties' },
            { key: 'bookings', label: '📋 My Bookings' }
          ].map(t => (
            <li key={t.key} className="nav-item">
              <button className={`nav-link ${activeTab === t.key ? 'active' : ''}`}
                style={activeTab === t.key ? { background: '#0f3460' } : { color: '#666' }}
                onClick={() => setActiveTab(t.key)}>
                {t.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <div className="card-header border-0 fw-bold" style={{ background: 'transparent', paddingTop: '1rem' }}>
                  Recent Properties
                </div>
                <div className="card-body pt-0">
                  {properties.slice(0, 3).map(p => (
                    <div key={p._id} className="d-flex align-items-center gap-3 py-2 border-bottom">
                      <img src={p.image} alt={p.title} style={{ width: 50, height: 50, borderRadius: '8px', objectFit: 'cover' }}
                        onError={e => e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100'} />
                      <div className="flex-grow-1">
                        <div className="fw-bold small">{p.title}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>₹{p.price?.toLocaleString()}/mo</div>
                      </div>
                      <span className={`badge bg-${p.status === 'approved' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'}`}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                  {properties.length === 0 && <p className="text-muted text-center py-3">No properties yet</p>}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <div className="card-header border-0 fw-bold" style={{ background: 'transparent', paddingTop: '1rem' }}>
                  Recent Bookings
                </div>
                <div className="card-body pt-0">
                  {bookings.slice(0, 3).map(b => (
                    <div key={b._id} className="d-flex align-items-center gap-3 py-2 border-bottom">
                      <div className="flex-grow-1">
                        <div className="fw-bold small">{b.propertyId?.title || 'Property'}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{b.propertyId?.location}</div>
                      </div>
                      <span className={`badge bg-${b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'}`}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                  {bookings.length === 0 && <p className="text-muted text-center py-3">No bookings yet</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties tab */}
        {activeTab === 'properties' && (
          properties.length === 0 ? (
            <div className="text-center py-5">
              <div className="h1 mb-3">🏠</div>
              <h5>No properties listed yet</h5>
              <Link to="/add-property" className="btn mt-2" style={{ background: '#e94560', color: 'white', borderRadius: '10px' }}>
                Add Your First Property
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {properties.map(p => (
                <div key={p._id} className="col-sm-6 col-lg-4">
                  <PropertyCard property={p} showActions onDelete={handleDelete} />
                </div>
              ))}
            </div>
          )
        )}

        {/* Bookings tab */}
        {activeTab === 'bookings' && (
          bookings.length === 0 ? (
            <div className="text-center py-5">
              <div className="h1 mb-3">📋</div>
              <h5>No bookings yet</h5>
              <Link to="/properties" className="btn mt-2" style={{ background: '#e94560', color: 'white', borderRadius: '10px' }}>
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="row g-3">
              {bookings.map(b => (
                <div key={b._id} className="col-12">
                  <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
                    <div className="card-body p-3">
                      <div className="row align-items-center">
                        <div className="col-md-1">
                          <img src={b.propertyId?.image}
                            alt="prop" style={{ width: 60, height: 60, borderRadius: '10px', objectFit: 'cover' }}
                            onError={e => e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100'} />
                        </div>
                        <div className="col-md-4">
                          <div className="fw-bold">{b.propertyId?.title}</div>
                          <div className="text-muted small">📍 {b.propertyId?.location}</div>
                        </div>
                        <div className="col-md-3 text-muted small">
                          <div>Booked: {new Date(b.bookingDate).toLocaleDateString()}</div>
                          <div>Duration: {b.duration} month(s)</div>
                          {b.totalAmount && <div className="fw-bold" style={{ color: '#e94560' }}>₹{b.totalAmount?.toLocaleString()} total</div>}
                        </div>
                        <div className="col-md-2 text-center">
                          <span className={`badge bg-${b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'}`}>
                            {b.status}
                          </span>
                        </div>
                        <div className="col-md-2 text-end">
                          {b.status === 'pending' && (
                            <button onClick={() => handleCancelBooking(b._id)}
                              className="btn btn-sm btn-outline-danger" style={{ borderRadius: '8px' }}>
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
