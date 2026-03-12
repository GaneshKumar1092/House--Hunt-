import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="p-2 text-center text-white" style={{ background: 'linear-gradient(135deg, #e94560, #c73652)' }}>
                <h4 className="fw-bold mb-0 py-2">Welcome Back 🏠</h4>
              </div>
              <div className="card-body p-4">
                <h5 className="text-center fw-bold mb-1" style={{ color: '#1a1a2e' }}>Sign In to HouseHunt</h5>
                <p className="text-center text-muted small mb-4">Enter your credentials to continue</p>

                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      required
                      style={{ borderRadius: '10px', padding: '10px 14px' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required
                      style={{ borderRadius: '10px', padding: '10px 14px' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn w-100 py-2 fw-bold"
                    disabled={loading}
                    style={{ background: 'linear-gradient(135deg, #e94560, #c73652)', color: 'white', borderRadius: '10px' }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                <hr className="my-3" />
                <div className="text-center small">
                  <span className="text-muted">Demo: </span>
                  <code>admin@househunt.com / admin123</code>
                </div>
                <p className="text-center mt-3 mb-0 small">
                  Don't have an account? <Link to="/register" style={{ color: '#e94560', fontWeight: 600 }}>Register here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
