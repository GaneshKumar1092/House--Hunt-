import React, { useState, useEffect } from 'react';
import { getProperties } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import SearchFilter from '../components/SearchFilter';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  const fetchProperties = async (filters = {}) => {
    setLoading(true);
    try {
      const { data } = await getProperties(filters);
      setProperties(data);
    } catch (err) {
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProperties(); }, []);

  const handleFilter = (filters) => {
    setActiveFilters(filters);
    fetchProperties(filters);
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', padding: '40px 0' }}>
        <div className="container text-white">
          <h2 className="fw-bold mb-1">Browse Properties</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>
            {properties.length} properties available
          </p>
        </div>
      </div>

      <div className="container py-4">
        <SearchFilter onFilter={handleFilter} />

        {Object.keys(activeFilters).length > 0 && (
          <div className="mb-3 d-flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([k, v]) => (
              <span key={k} className="badge" style={{ background: '#e94560', padding: '6px 12px', borderRadius: '20px' }}>
                {k}: {v}
              </span>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#e94560' }} />
            <p className="mt-3 text-muted">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-5">
            <div className="h1 mb-3">🏠</div>
            <h4>No properties found</h4>
            <p className="text-muted">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="row g-4">
            {properties.map(p => (
              <div key={p._id} className="col-sm-6 col-lg-4">
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
