import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property, onDelete, showActions = false }) => {
  const statusColors = {
    approved: 'success',
    pending: 'warning',
    rejected: 'danger'
  };

  return (
    <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'pointer' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={property.image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'}
          className="card-img-top"
          alt={property.title}
          style={{ height: '200px', objectFit: 'cover' }}
          onError={e => e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'}
        />
        <span
          className={`badge bg-${statusColors[property.status] || 'secondary'}`}
          style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.75rem' }}
        >
          {property.status}
        </span>
        <span
          className="badge"
          style={{ position: 'absolute', top: '10px', left: '10px', background: '#0f3460', color: 'white', fontSize: '0.7rem' }}
        >
          {property.type}
        </span>
      </div>

      <div className="card-body d-flex flex-column">
        <h6 className="card-title fw-bold mb-1" style={{ color: '#1a1a2e' }}>{property.title}</h6>
        <p className="text-muted small mb-2">
          <i className="bi bi-geo-alt"></i> {property.location}
        </p>
        <p className="card-text small text-muted flex-grow-1" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {property.description}
        </p>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="small text-muted">
            {property.bedrooms && <span className="me-2">🛏 {property.bedrooms}</span>}
            {property.bathrooms && <span>🚿 {property.bathrooms}</span>}
          </div>
          <div className="fw-bold" style={{ color: '#e94560', fontSize: '1.1rem' }}>
            ₹{property.price?.toLocaleString()}<span className="text-muted small fw-normal">/mo</span>
          </div>
        </div>

        <div className="d-flex gap-2">
          <Link to={`/properties/${property._id}`} className="btn btn-sm flex-grow-1" style={{ background: '#0f3460', color: 'white', borderRadius: '8px' }}>
            View Details
          </Link>
          {showActions && onDelete && (
            <button onClick={() => onDelete(property._id)} className="btn btn-sm btn-outline-danger" style={{ borderRadius: '8px' }}>
              🗑
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
