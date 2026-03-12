import React, { useState } from 'react';

const SearchFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Remove empty values
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    onFilter(activeFilters);
  };

  const handleReset = () => {
    setFilters({ search: '', location: '', type: '', minPrice: '', maxPrice: '' });
    onFilter({});
  };

  return (
    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
      <div className="card-body p-4">
        <h5 className="mb-3 fw-bold" style={{ color: '#1a1a2e' }}>🔍 Find Your Perfect Home</h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search properties..."
                name="search"
                value={filters.search}
                onChange={handleChange}
                style={{ borderRadius: '10px', border: '1px solid #dee2e6' }}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Location"
                name="location"
                value={filters.location}
                onChange={handleChange}
                style={{ borderRadius: '10px' }}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                name="type"
                value={filters.type}
                onChange={handleChange}
                style={{ borderRadius: '10px' }}
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="studio">Studio</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>
            <div className="col-md-1">
              <input
                type="number"
                className="form-control"
                placeholder="Min ₹"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleChange}
                style={{ borderRadius: '10px' }}
              />
            </div>
            <div className="col-md-1">
              <input
                type="number"
                className="form-control"
                placeholder="Max ₹"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleChange}
                style={{ borderRadius: '10px' }}
              />
            </div>
            <div className="col-md-1 d-flex gap-1">
              <button type="submit" className="btn w-100" style={{ background: '#e94560', color: 'white', borderRadius: '10px' }}>
                Go
              </button>
            </div>
          </div>
          <div className="mt-2 text-end">
            <button type="button" onClick={handleReset} className="btn btn-sm btn-outline-secondary" style={{ borderRadius: '8px' }}>
              Reset Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchFilter;
