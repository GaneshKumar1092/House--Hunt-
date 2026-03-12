import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', display: 'flex', alignItems: 'center', padding: '2rem 0' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="p-2 text-center text-white" style={{ background: 'linear-gradient(135deg, #0f3460, #16213e)' }}>
                <h4 className="fw-bold mb-0 py-2">Join HouseHunt 🏡</h4>
              </div>
              <div className="card-body p-4">
                <h5 className="text-center fw-bold mb-1" style={{ color: '#1a1a2e' }}>Create Your Account</h5>
                <p className="text-center text-muted small mb-4">Start finding or listing properties today</p>

                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-bold">Full Name</label>
                      <input type="text" className="form-control" placeholder="John Doe"
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        required style={{ borderRadius: '10px', padding: '10px 14px' }} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Email Address</label>
                      <input type="email" className="form-control" placeholder="you@example.com"
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        required style={{ borderRadius: '10px', padding: '10px 14px' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Password</label>
                      <input type="password" className="form-control" placeholder="Min 6 chars"
                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                        required style={{ borderRadius: '10px', padding: '10px 14px' }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Confirm Password</label>
                      <input type="password" className="form-control" placeholder="••••••••"
                        value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                        required style={{ borderRadius: '10px', padding: '10px 14px' }} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-bold">Account Type</label>
                      <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ borderRadius: '10px' }}>
                        <option value="user">Regular User (Rent / List Properties)</option>
                        <option value="admin">Admin (Manage Platform)</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn w-100 py-2 fw-bold mt-4"
                    disabled={loading}
                    style={{ background: 'linear-gradient(135deg, #e94560, #c73652)', color: 'white', borderRadius: '10px' }}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>

                <p className="text-center mt-3 mb-0 small">
                  Already have an account? <Link to="/login" style={{ color: '#e94560', fontWeight: 600 }}>Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
