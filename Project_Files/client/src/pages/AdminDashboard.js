import React, { useState, useEffect } from 'react';
import { getPendingProperties, getAllPropertiesAdmin, approveProperty, rejectProperty, getAllBookings, getAllUsers } from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pending, setPending] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    Promise.all([getPendingProperties(), getAllPropertiesAdmin(), getAllBookings(), getAllUsers()])
      .then(([pend, all, book, usr]) => {
        setPending(pend.data);
        setAllProperties(all.data);
        setBookings(book.data);
        setUsers(usr.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveProperty(id);
      setPending(pending.filter(p => p._id !== id));
      setAllProperties(allProperties.map(p => p._id === id ? { ...p, status: 'approved' } : p));
      setAlert({ type: 'success', msg: '✅ Property approved!' });
    } catch {
      setAlert({ type: 'danger', msg: 'Failed to approve' });
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectProperty(id);
      setPending(pending.filter(p => p._id !== id));
      setAllProperties(allProperties.map(p => p._id === id ? { ...p, status: 'rejected' } : p));
      setAlert({ type: 'warning', msg: '❌ Property rejected' });
    } catch {
      setAlert({ type: 'danger', msg: 'Failed to reject' });
    }
  };

  const stats = [
    { icon: '🏠', label: 'Total Properties', value: allProperties.length, color: '#0f3460' },
    { icon: '⏳', label: 'Pending Review', value: pending.length, color: '#f59e0b' },
    { icon: '✅', label: 'Approved', value: allProperties.filter(p => p.status === 'approved').length, color: '#198754' },
    { icon: '👥', label: 'Total Users', value: users.length, color: '#e94560' },
    { icon: '📋', label: 'Total Bookings', value: bookings.length, color: '#6f42c1' },
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
          <h2 className="fw-bold mb-1">🛡️ Admin Dashboard</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Manage all platform activity</p>
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
            <div key={i} className="col-6 col-md">
              <div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: '12px', borderTop: `3px solid ${s.color}` }}>
                <div className="h3 mb-1">{s.icon}</div>
                <div className="h4 fw-bold mb-0" style={{ color: s.color }}>{s.value}</div>
                <div className="text-muted small">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {pending.length > 0 && activeTab !== 'pending' && (
          <div className="alert alert-warning d-flex align-items-center gap-2 mb-4">
            ⚠️ <strong>{pending.length} properties</strong> are waiting for your review.
            <button className="btn btn-sm btn-warning ms-2" onClick={() => setActiveTab('pending')}>Review Now</button>
          </div>
        )}

        {/* Tabs */}
        <ul className="nav nav-pills mb-4 flex-wrap gap-2">
          {[
            { key: 'overview', label: '📊 Overview' },
            { key: 'pending', label: `⏳ Pending (${pending.length})` },
            { key: 'properties', label: '🏠 All Properties' },
            { key: 'bookings', label: '📋 All Bookings' },
            { key: 'users', label: '👥 All Users' },
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

        {/* Pending Review */}
        {activeTab === 'pending' && (
          pending.length === 0 ? (
            <div className="text-center py-5">
              <div className="h1 mb-3">✅</div>
              <h5>All caught up! No pending properties.</h5>
            </div>
          ) : (
            <div className="row g-4">
              {pending.map(p => (
                <div key={p._id} className="col-12">
                  <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
                    <div className="card-body p-3">
                      <div className="row align-items-center">
                        <div className="col-md-1">
                          <img src={p.image} alt={p.title}
                            style={{ width: 70, height: 70, borderRadius: '10px', objectFit: 'cover' }}
                            onError={e => e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100'} />
                        </div>
                        <div className="col-md-4">
                          <div className="fw-bold">{p.title}</div>
                          <div className="text-muted small">📍 {p.location} • {p.type}</div>
                          <div className="text-muted small">Owner: {p.owner?.name} ({p.owner?.email})</div>
                        </div>
                        <div className="col-md-3 text-muted small">
                          <p className="mb-1">{p.description?.slice(0, 100)}...</p>
                          <strong style={{ color: '#e94560' }}>₹{p.price?.toLocaleString()}/mo</strong>
                        </div>
                        <div className="col-md-2 text-muted small">
                          Submitted: {new Date(p.createdAt).toLocaleDateString()}
                        </div>
                        <div className="col-md-2 d-flex gap-2">
                          <button onClick={() => handleApprove(p._id)}
                            className="btn btn-success btn-sm" style={{ borderRadius: '8px' }}>
                            ✅ Approve
                          </button>
                          <button onClick={() => handleReject(p._id)}
                            className="btn btn-danger btn-sm" style={{ borderRadius: '8px' }}>
                            ❌ Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* All Properties */}
        {activeTab === 'properties' && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th className="ps-4">Property</th>
                      <th>Owner</th>
                      <th>Price</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allProperties.map(p => (
                      <tr key={p._id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-2">
                            <img src={p.image} alt={p.title}
                              style={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover' }}
                              onError={e => e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100'} />
                            <div>
                              <div className="fw-bold small">{p.title}</div>
                              <div className="text-muted" style={{ fontSize: '0.72rem' }}>📍 {p.location}</div>
                            </div>
                          </div>
                        </td>
                        <td><small>{p.owner?.name}</small></td>
                        <td><small className="fw-bold" style={{ color: '#e94560' }}>₹{p.price?.toLocaleString()}</small></td>
                        <td><span className="badge" style={{ background: '#e8f4ff', color: '#0f3460' }}>{p.type}</span></td>
                        <td>
                          <span className={`badge bg-${p.status === 'approved' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td><small className="text-muted">{new Date(p.createdAt).toLocaleDateString()}</small></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* All Bookings */}
        {activeTab === 'bookings' && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th className="ps-4">Property</th>
                      <th>Renter</th>
                      <th>Duration</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id}>
                        <td className="ps-4"><small className="fw-bold">{b.propertyId?.title || 'N/A'}</small></td>
                        <td><small>{b.userId?.name}</small></td>
                        <td><small>{b.duration} month(s)</small></td>
                        <td><small className="fw-bold" style={{ color: '#e94560' }}>₹{b.totalAmount?.toLocaleString()}</small></td>
                        <td>
                          <span className={`badge bg-${b.status === 'confirmed' ? 'success' : b.status === 'cancelled' ? 'danger' : 'warning'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td><small className="text-muted">{new Date(b.bookingDate).toLocaleDateString()}</small></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* All Users */}
        {activeTab === 'users' && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th className="ps-4">Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-2">
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: u.role === 'admin' ? '#e94560' : '#0f3460', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
                              {u.name?.[0]?.toUpperCase()}
                            </div>
                            <span className="fw-bold small">{u.name}</span>
                          </div>
                        </td>
                        <td><small>{u.email}</small></td>
                        <td>
                          <span className={`badge bg-${u.role === 'admin' ? 'danger' : 'primary'}`}>{u.role}</span>
                        </td>
                        <td><small className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</small></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <div className="card-header border-0 fw-bold pt-3">Recent Pending</div>
                <div className="card-body pt-0">
                  {pending.slice(0, 4).map(p => (
                    <div key={p._id} className="d-flex align-items-center gap-3 py-2 border-bottom">
                      <div className="flex-grow-1">
                        <div className="fw-bold small">{p.title}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{p.owner?.name} • {p.location}</div>
                      </div>
                      <div className="d-flex gap-1">
                        <button onClick={() => handleApprove(p._id)} className="btn btn-success btn-sm py-0 px-2">✓</button>
                        <button onClick={() => handleReject(p._id)} className="btn btn-danger btn-sm py-0 px-2">✗</button>
                      </div>
                    </div>
                  ))}
                  {pending.length === 0 && <p className="text-muted text-center py-3">No pending listings</p>}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <div className="card-header border-0 fw-bold pt-3">Recent Users</div>
                <div className="card-body pt-0">
                  {users.slice(0, 5).map(u => (
                    <div key={u._id} className="d-flex align-items-center gap-3 py-2 border-bottom">
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: u.role === 'admin' ? '#e94560' : '#0f3460', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold small">{u.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{u.email}</div>
                      </div>
                      <span className={`badge bg-${u.role === 'admin' ? 'danger' : 'primary'}`}>{u.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
