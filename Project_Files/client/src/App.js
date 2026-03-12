import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import AddProperty from './pages/AddProperty';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

// Protected Route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <div className="spinner-border" style={{ color: '#e94560' }} />
  </div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

const AppLayout = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/properties" element={<PropertyList />} />
      <Route path="/properties/:id" element={<PropertyDetail />} />
      <Route path="/add-property" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    <footer className="py-4 text-center text-white" style={{ background: '#1a1a2e' }}>
      <p className="mb-0 small">© 2024 <strong style={{ color: '#e94560' }}>HouseHunt</strong> — Find Your Perfect Home</p>
    </footer>
  </>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
