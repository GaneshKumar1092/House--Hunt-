import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <span style={{ color: '#e94560' }}>🏠</span> HouseHunt
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/properties">Properties</Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/add-property">List Property</Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#!" role="button" data-bs-toggle="dropdown">
                    👤 {user.name}
                    {user.role === 'admin' && <span className="badge bg-danger ms-1">Admin</span>}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/dashboard">My Dashboard</Link></li>
                    {user.role === 'admin' && (
                      <li><Link className="dropdown-item" to="/admin">Admin Panel</Link></li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-sm ms-2" style={{ background: '#e94560', color: 'white', borderRadius: '20px', padding: '6px 16px' }} to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
