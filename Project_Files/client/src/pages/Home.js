import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProperties } from '../services/api';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getProperties().then(({ data }) => setFeatured(data.slice(0, 6))).catch(console.error);
  }, []);

  const stats = [
    { icon: '🏠', label: 'Properties Listed', value: '1,200+' },
    { icon: '👥', label: 'Happy Renters', value: '800+' },
    { icon: '📍', label: 'Cities Covered', value: '50+' },
    { icon: '⭐', label: 'Satisfaction Rate', value: '98%' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(233,69,96,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(15,52,96,0.3) 0%, transparent 50%)'
        }} />
        <div className="container position-relative">
          <div className="row align-items-center">
            <div className="col-lg-6 text-white">
              <span className="badge mb-3" style={{ background: 'rgba(233,69,96,0.2)', color: '#e94560', border: '1px solid rgba(233,69,96,0.3)', padding: '8px 16px', borderRadius: '20px' }}>
                🏡 India's Trusted Rental Platform
              </span>
              <h1 className="display-4 fw-bold mb-4" style={{ lineHeight: 1.2 }}>
                Find Your Perfect
                <span style={{ color: '#e94560' }}> Dream Home</span>
              </h1>
              <p className="lead mb-4" style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '480px' }}>
                Browse thousands of verified rental properties. From cozy studios to luxury villas — find the home that fits your life.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/properties" className="btn btn-lg px-4 py-2" style={{ background: '#e94560', color: 'white', borderRadius: '12px', fontWeight: 600 }}>
                  Browse Properties
                </Link>
                <Link to="/register" className="btn btn-lg px-4 py-2" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '12px' }}>
                  List Your Property
                </Link>
              </div>
            </div>
            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="row g-3">
                {[
                  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300',
                  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300',
                  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300',
                  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300',
                ].map((img, i) => (
                  <div key={i} className={`col-6 ${i % 2 === 1 ? 'mt-4' : ''}`}>
                    <img src={img} alt="property" className="w-100 rounded-3 shadow" style={{ height: '160px', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-4" style={{ background: '#0f3460' }}>
        <div className="container">
          <div className="row text-center">
            {stats.map((s, i) => (
              <div key={i} className="col-6 col-md-3 py-3">
                <div className="h3 mb-1">{s.icon}</div>
                <div className="h4 fw-bold text-white mb-0">{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-5" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>Featured Properties</h2>
              <p className="text-muted mb-0">Explore our latest and most popular listings</p>
            </div>
            <Link to="/properties" className="btn" style={{ background: '#e94560', color: 'white', borderRadius: '10px' }}>View All</Link>
          </div>

          {featured.length === 0 ? (
            <div className="text-center py-5">
              <div className="h1 mb-3">🏠</div>
              <p className="text-muted">No properties yet. Be the first to list one!</p>
              <Link to="/add-property" className="btn" style={{ background: '#e94560', color: 'white', borderRadius: '10px' }}>Add Property</Link>
            </div>
          ) : (
            <div className="row g-4">
              {featured.map(p => (
                <div key={p._id} className="col-sm-6 col-lg-4">
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 text-white text-center" style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}>
        <div className="container">
          <h2 className="fw-bold mb-3">Ready to Find Your New Home?</h2>
          <p className="mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>Join thousands of renters who found their perfect home on HouseHunt</p>
          <Link to="/register" className="btn btn-lg px-5" style={{ background: '#e94560', color: 'white', borderRadius: '12px' }}>
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
