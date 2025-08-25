import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { PropertyType, PropertyStatus, PropertyCategory, FurnishingStatus } from '../../types/property.types';

const PropertyFilters = ({ filters, onFilterChange, totalCount }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    
    // Debounce search input
    if (field === 'search') {
      const timer = setTimeout(() => {
        onFilterChange(newFilters);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      onFilterChange(newFilters);
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      search: '',
      status: 'active',
      property_type: 'all',
      category: 'all',
      city: '',
      min_price: '',
      max_price: '',
      bedrooms: '',
      bathrooms: '',
      furnishing_status: 'all',
      sortBy: 'created_at',
      sortOrder: 'desc'
    };
    setLocalFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search properties by title or description..."
          value={localFilters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Main Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Category */}
        <select
          value={localFilters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {Object.entries(PropertyCategory).map(([key, value]) => (
            <option key={key} value={value}>
              {key.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        {/* Property Type */}
        <select
          value={localFilters.property_type}
          onChange={(e) => handleChange('property_type', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          {Object.entries(PropertyType).map(([key, value]) => (
            <option key={key} value={value}>
              {key.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        {/* City */}
        <input
          type="text"
          placeholder="City"
          value={localFilters.city}
          onChange={(e) => handleChange('city', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        {/* Sort By */}
        <select
          value={`${localFilters.sortBy}-${localFilters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            handleChange('sortBy', sortBy);
            handleChange('sortOrder', sortOrder);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="created_at-desc">Newest First</option>
          <option value="created_at-asc">Oldest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="area_sqft-desc">Largest First</option>
          <option value="area_sqft-asc">Smallest First</option>
        </select>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
      >
        <Filter className="w-4 h-4" />
        <span>Advanced Filters</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (₹)</label>
            <input
              type="number"
              placeholder="Min Price"
              value={localFilters.min_price}
              onChange={(e) => handleChange('min_price', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹)</label>
            <input
              type="number"
              placeholder="Max Price"
              value={localFilters.max_price}
              onChange={(e) => handleChange('max_price', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <select
              value={localFilters.bedrooms}
              onChange={(e) => handleChange('bedrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <select
              value={localFilters.bathrooms}
              onChange={(e) => handleChange('bathrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4+</option>
            </select>
          </div>

          {/* Furnishing Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Furnishing</label>
            <select
              value={localFilters.furnishing_status}
              onChange={(e) => handleChange('furnishing_status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              {Object.entries(FurnishingStatus).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={localFilters.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              {Object.entries(PropertyStatus).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={resetFilters}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <X className="w-4 h-4" />
          Reset Filters
        </button>
        
        {totalCount !== undefined && (
          <span className="text-sm text-gray-600">
            {totalCount} properties found
          </span>
        )}
      </div>
    </div>
  );
};

export default PropertyFilters;