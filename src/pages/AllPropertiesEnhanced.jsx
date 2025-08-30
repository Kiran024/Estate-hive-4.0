import React, { useState, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import { formatPrice, PropertyType, PropertyStatus, PropertyCategory, FurnishingStatus } from '../types/property.types';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { 
  Search, Filter, X, ChevronDown, ChevronUp, MapPin, Bed, Bath, 
  Car, Home, Heart, Share2, Square, IndianRupee, Camera,
  Loader2, AlertCircle, SlidersHorizontal, Building2, MapPinIcon,
  DollarSign, BedDouble, Sofa, Sparkles, TrendingUp, CheckCircle, Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginPromptOverlay from '../components/auth/LoginPromptOverlay';
import WishlistButton from '../components/common/WishlistButton';

export default function AllPropertiesEnhanced() {
  const { user } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Dynamic location data
  const [availableLocations, setAvailableLocations] = useState(['Bengaluru', 'Bangalore']);
  const [availablePropertyTypes, setAvailablePropertyTypes] = useState(['Apartment', 'Villa', 'Penthouse']);
  const [searchInput, setSearchInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [debouncedLocation, setDebouncedLocation] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    ehCategory: false,
    propertyType: true,
    price: true,
    bedrooms: true,
    location: true,
    amenities: false,
    furnishing: false
  });

  const [filters, setFilters] = useState({
    search: '',
    status: 'active',
    property_type: 'all',
    category: 'all',
    subcategory: 'all',
    city: '',
    min_price: '',
    max_price: '',
    bedrooms: '',
    bathrooms: '',
    furnishing_status: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc',
    page: 1,
    pageSize: 12
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Debounce location input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocation(locationInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [locationInput]);

  // Handle URL search parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Update filters with URL parameters
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      let hasChanges = false;
    
    if (params.get('city')) {
      newFilters.city = params.get('city');
      setLocationInput(params.get('city'));
      hasChanges = true;
    }
    
    if (params.get('property_type')) {
      newFilters.property_type = params.get('property_type');
      hasChanges = true;
    }
    
    if (params.get('category')) {
      newFilters.category = params.get('category');
      hasChanges = true;
    }
    
    if (params.get('min_price')) {
      newFilters.min_price = params.get('min_price');
      hasChanges = true;
    }
    
    if (params.get('max_price')) {
      newFilters.max_price = params.get('max_price');
      hasChanges = true;
    }
    
      if (hasChanges) {
        return newFilters;
      }
      return prevFilters;
    });
  }, [location.search]); // Only run when URL search params change

  // Fetch dynamic location and property type data
  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        // Fetch unique cities
        const citiesResponse = await propertyService.getUniqueCities();
        if (citiesResponse.data && citiesResponse.data.length > 0) {
          setAvailableLocations(citiesResponse.data);
        }

        // Fetch unique property types
        const typesResponse = await propertyService.getUniquePropertyTypes();
        if (typesResponse.data && typesResponse.data.length > 0) {
          setAvailablePropertyTypes(typesResponse.data);
        }
      } catch (error) {
        console.error('Error fetching dynamic data:', error);
        // Keep fallback data if fetch fails
      }
    };

    fetchDynamicData();
  }, []); // Only run once on mount

  // Note: We now use stableFilters instead of updating filters state directly
  // This prevents unnecessary re-renders and query refetches

  // Create stable query filters (only change when debounced values change)
  const stableFilters = useMemo(() => ({
    ...filters,
    search: debouncedSearch,
    city: debouncedLocation
  }), [
    filters.status, filters.property_type, filters.category, filters.subcategory,
    filters.min_price, filters.max_price, filters.bedrooms, 
    filters.bathrooms, filters.furnishing_status, filters.sortBy, 
    filters.sortOrder, filters.page, filters.pageSize,
    debouncedSearch, debouncedLocation
  ]);

  // Fetch properties
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['all-properties', stableFilters],
    queryFn: () => propertyService.getAllProperties(stableFilters),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true // Keep previous data while loading new data
  });

  const properties = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / stableFilters.pageSize);
  
  // Debug logging
  useEffect(() => {
    console.log('Pagination Debug:', {
      currentPage: stableFilters.page,
      pageSize: stableFilters.pageSize,
      totalCount,
      totalPages,
      propertiesOnPage: properties.length,
      isLoading
    });
  }, [stableFilters.page, stableFilters.pageSize, totalCount, totalPages, properties.length, isLoading]);

  // add these
const [navHeight, setNavHeight] = useState(64);

useLayoutEffect(() => {
  const read = () =>
    setNavHeight(document.getElementById('site-nav')?.offsetHeight ?? 64);
  read();
  window.addEventListener('resize', read);
  return () => window.removeEventListener('resize', read);
}, []);
  
  // Use custom scroll to top hook
  const scrollToTop = useScrollToTop({ behavior: 'instant' });
  
  // Scroll to top when page changes
  useEffect(() => {
    scrollToTop();
  }, [stableFilters.page, scrollToTop]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    if (key === 'page') {
      // Don't reset page when changing page
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    } else {
      // Reset to first page when changing other filters
      setFilters(prev => ({
        ...prev,
        [key]: value,
        page: 1
      }));
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
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
      sortOrder: 'desc',
      page: 1,
      pageSize: 12
    });
    setSearchInput('');
    setLocationInput('');
  };

  // Toggle sections
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Favorites are now handled by WishlistButton component

  // Handle share
  const handleShare = async (property) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
 url: `${window.location.origin}/property/${property.id}`
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying link
      navigator.clipboard.writeText(`${window.location.origin}/property/${property.id}`);
      alert('Property link copied to clipboard!');
    }
  };

  // Property Card Component
  const PropertyCard = ({ property }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-gray-200">
        <Link to={`/property/${property.id}`}>
          <img
            src={property.image_urls?.[0] || property.featured_image || '/h01@300x-100.jpg'}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = '/h01@300x-100.jpg';
            }}
          />
        </Link>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            property.status === 'active' ? 'bg-green-100 text-green-700' :
            property.status === 'sold' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {property.status?.toUpperCase()}
          </span>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            property.category === 'sale' ? 'bg-blue-100 text-blue-700' :
            property.category === 'rent' ? 'bg-purple-100 text-purple-700' :
            property.category === 'lease' ? 'bg-orange-100 text-orange-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            For {property.category?.charAt(0).toUpperCase() + property.category?.slice(1)}
          </span>
          
          {/* EH Category Badge */}
          {property.subcategory && (
            <span className={`px-2 py-1 rounded text-xs font-bold shadow-lg ${
              property.subcategory === 'eh_commercial' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
              property.subcategory === 'eh_verified' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
              property.subcategory === 'eh_signature' ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white' :
              property.subcategory === 'eh_dubai' ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' :
              'bg-gray-100 text-gray-700'
            }`}>
              {property.subcategory === 'eh_commercial' ? 'EH Commercial' :
               property.subcategory === 'eh_verified' ? 'EH Verified' :
               property.subcategory === 'eh_signature' ? 'EH Signature™' :
               property.subcategory === 'eh_dubai' ? 'EH Dubai' :
               property.subcategory}
            </span>
          )}
        </div>
        
        {/* Image Count */}
        {property.image_urls?.length > 0 && (
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Camera className="w-3 h-3" />
            <span>{property.image_urls.length}</span>
          </div>
        )}
        
        {/* Actions */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <WishlistButton 
            propertyId={property.id} 
            variant="floating"
            size="sm"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              handleShare(property);
            }}
            className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
          >
            <Share2 className="w-4 h-4 text-gray-700 hover:text-blue-500" />
          </button>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Price */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800">
            {formatPrice(property.price || property.rent_amount)}
          </h3>
          {property.price_negotiable && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              Negotiable
            </span>
          )}
        </div>
        
        {/* Title */}
        <Link to={`/property/${property.id}`}>
          <h4 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600">
            {property.title || 'Untitled Property'}
          </h4>
        </Link>
        
        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm line-clamp-1">
            {[property.neighborhood, property.city, property.state]
              .filter(Boolean)
              .join(', ') || 'Location not specified'}
          </span>
        </div>
        
        {/* Property Type */}
        {property.property_type && (
          <div className="flex items-center text-gray-600 mb-3">
            <Home className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm capitalize">
              {property.property_type.replace('_', ' ')}
              {property.property_subtype && ` - ${property.property_subtype}`}
            </span>
          </div>
        )}
        
        {/* Features */}
        <div className="flex items-center justify-between text-gray-600 pt-3 border-t border-gray-200 mt-auto">
          <div className="flex items-center gap-3">
            {property.bedrooms !== null && property.bedrooms !== undefined && (
              <div className="flex items-center">
                <Bed className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.bedrooms}</span>
              </div>
            )}
            
            {property.bathrooms !== null && property.bathrooms !== undefined && (
              <div className="flex items-center">
                <Bath className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.bathrooms}</span>
              </div>
            )}
            
            {property.area_sqft && (
              <div className="flex items-center">
                <Square className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.area_sqft} sqft</span>
              </div>
            )}
            
            {property.parking_spaces > 0 && (
              <div className="flex items-center">
                <Car className="w-4 h-4 mr-1" />
                <span className="text-sm">{property.parking_spaces}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Featured Badge */}
        {property.is_featured && (
          <div className="mt-2">
            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              Featured
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // Filter Sidebar Component  
  const FilterSidebar = ({ className = "" }) => (
    <div className={`${className}`}>
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              Smart Filters
            </h2>
            <p className="text-blue-100 text-sm mt-1">Find your perfect property</p>
          </div>
          <button
            onClick={resetFilters}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Filter Cards */}
      <div className="space-y-4">
        {/* Search Card */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Quick Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by property name, type..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-sm"
              />
              {/* Loading indicator for search */}
              {searchInput !== debouncedSearch && searchInput && (
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Card */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full text-left mb-4 group"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-700">Category</span>
            </div>
            <div className="p-1 rounded-lg group-hover:bg-gray-100 transition-colors">
              {expandedSections.category ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </div>
          </button>
          {expandedSections.category && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleFilterChange('category', 'all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
   filters.category === 'sale'
     ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
     : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
 }`}
              >
                All Types
              </button>
              <button
                onClick={() => handleFilterChange('category', 'sale')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.category === 'sale' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                For Sale
              </button>
              <button
                onClick={() => handleFilterChange('category', 'rent')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.category === 'rent' 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                For Rent
              </button>
              <button
                onClick={() => handleFilterChange('category', 'lease')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.category === 'lease' 
                    ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-md' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                For Lease
              </button>
            </div>
          )}
        </div>

        {/* EH Category Card */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <button
            onClick={() => toggleSection('ehCategory')}
            className="flex items-center justify-between w-full text-left mb-4 group"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <span className="font-semibold text-gray-700">EH Premium Categories</span>
            </div>
            <div className="p-1 rounded-lg group-hover:bg-gray-100 transition-colors">
              {expandedSections.ehCategory ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </div>
          </button>
          {expandedSections.ehCategory && (
            <div className="space-y-2">
              <button
                onClick={() => handleFilterChange('subcategory', 'all')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                  filters.subcategory === 'all'
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                All Properties
              </button>
              <button
                onClick={() => handleFilterChange('subcategory', 'eh_commercial')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                  filters.subcategory === 'eh_commercial'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  EH Commercial
                </div>
              </button>
              <button
                onClick={() => handleFilterChange('subcategory', 'eh_verified')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                  filters.subcategory === 'eh_verified'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  EH Verified
                </div>
              </button>
              <button
                onClick={() => handleFilterChange('subcategory', 'eh_signature')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                  filters.subcategory === 'eh_signature'
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-700 text-white shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  EH Signature™
                </div>
              </button>
              <button
                onClick={() => handleFilterChange('subcategory', 'eh_dubai')}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                  filters.subcategory === 'eh_dubai'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-700 text-white shadow-md'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  EH Dubai
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Property Type Card */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <button
            onClick={() => toggleSection('propertyType')}
            className="flex items-center justify-between w-full text-left mb-4 group"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Building2 className="w-4 h-4 text-purple-600" />
              </div>
              <span className="font-semibold text-gray-700">Property Type</span>
            </div>
            <div className="p-1 rounded-lg group-hover:bg-gray-100 transition-colors">
              {expandedSections.propertyType ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </div>
          </button>
          {expandedSections.propertyType && (
            <div className="space-y-2">
              <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="propertyType"
                  value="all"
                  checked={filters.property_type === 'all'}
                  onChange={(e) => handleFilterChange('property_type', e.target.value)}
                  className="mr-3 text-blue-600"
                />
                <span className="text-sm font-medium">All Types</span>
              </label>
              {availablePropertyTypes.map((type) => (
                <label key={type} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="propertyType"
                    value={type}
                    checked={filters.property_type === type}
                    onChange={(e) => handleFilterChange('property_type', e.target.value)}
                    className="mr-3 text-blue-600"
                  />
                  <span className="text-sm capitalize font-medium">{type.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range Card */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left mb-4 group"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <IndianRupee className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-semibold text-gray-700">Price Range</span>
            </div>
            <div className="p-1 rounded-lg group-hover:bg-gray-100 transition-colors">
              {expandedSections.price ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </div>
          </button>
          {expandedSections.price && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Min Price (₹)</label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.min_price}
                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Max Price (₹)</label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.max_price}
                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                  />
                </div>
              </div>
              {/* Quick price ranges */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleFilterChange('min_price', '0');
                    handleFilterChange('max_price', '5000000');
                  }}
                  className="text-xs px-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  Under 50L
                </button>
                <button
                  onClick={() => {
                    handleFilterChange('min_price', '5000000');
                    handleFilterChange('max_price', '10000000');
                  }}
                  className="text-xs px-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  50L - 1Cr
                </button>
                <button
                  onClick={() => {
                    handleFilterChange('min_price', '10000000');
                    handleFilterChange('max_price', '20000000');
                  }}
                  className="text-xs px-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  1Cr - 2Cr
                </button>
                <button
                  onClick={() => {
                    handleFilterChange('min_price', '20000000');
                    handleFilterChange('max_price', '');
                  }}
                  className="text-xs px-2 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  Above 2Cr
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bedrooms Card */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <button
            onClick={() => toggleSection('bedrooms')}
            className="flex items-center justify-between w-full text-left mb-4 group"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-50 rounded-lg">
                <BedDouble className="w-4 h-4 text-orange-600" />
              </div>
              <span className="font-semibold text-gray-700">Bedrooms</span>
            </div>
            <div className="p-1 rounded-lg group-hover:bg-gray-100 transition-colors">
              {expandedSections.bedrooms ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </div>
          </button>
          {expandedSections.bedrooms && (
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleFilterChange('bedrooms', '')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.bedrooms === '' 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md' 
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                Any
              </button>

              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => handleFilterChange('bedrooms', num.toString())}
                   className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${+   filters.bedrooms === num.toString()
     ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'     : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
 }`}
                >
                  {num} {num === 5 ? '+' : ''}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Location Card */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <button
            onClick={() => toggleSection('location')}
            className="flex items-center justify-between w-full text-left mb-4 group"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-50 rounded-lg">
                <MapPin className="w-4 h-4 text-red-600" />
              </div>
              <span className="font-semibold text-gray-700">Location</span>
            </div>
            <div className="p-1 rounded-lg group-hover:bg-gray-100 transition-colors">
              {expandedSections.location ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </div>
          </button>
          {expandedSections.location && (
            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Type city, neighborhood or area..."
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-sm"
                />
                {/* Loading indicator for location search */}
                {locationInput !== debouncedLocation && locationInput && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {locationInput && (
                  <button
                    onClick={() => setLocationInput('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {/* Popular locations */}
              <div className="mt-3 flex flex-wrap gap-2">
                {availableLocations.slice(0, 6).map(city => (
                  <button
                    key={city}
                    onClick={() => setLocationInput(city)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Furnishing Card */}
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <button
            onClick={() => toggleSection('furnishing')}
            className="flex items-center justify-between w-full text-left mb-4 group"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Sofa className="w-4 h-4 text-yellow-600" />
              </div>
              <span className="font-semibold text-gray-700">Furnishing</span>
            </div>
            <div className="p-1 rounded-lg group-hover:bg-gray-100 transition-colors">
              {expandedSections.furnishing ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </div>
          </button>
          {expandedSections.furnishing && (
            <div className="space-y-2">
              <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="furnishing"
                  value="all"
                  checked={filters.furnishing_status === 'all'}
                  onChange={(e) => handleFilterChange('furnishing_status', e.target.value)}
                  className="mr-3 text-blue-600"
                />
                <span className="text-sm font-medium">All</span>
              </label>
              {Object.entries(FurnishingStatus).map(([key, value]) => (
                <label key={key} className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="furnishing"
                    value={value}
                    checked={filters.furnishing_status === value}
                    onChange={(e) => handleFilterChange('furnishing_status', e.target.value)}
                    className="mr-3 text-blue-600"
                  />
                  <span className="text-sm capitalize font-medium">{value.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Check authentication and show login overlay if not authenticated
  if (!user) {
    return (
      <LoginPromptOverlay 
        showOverlay={true}
        title="Unlock Premium Properties"
        subtitle="Sign in to browse our exclusive collection of verified properties"
      >
        <div className="min-h-screen bg-gray-50">
          {/* Show a blurred version of the page */}
          <div className="container mx-auto px-4 py-8">
            <div className="h-20 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </LoginPromptOverlay>
    );
  }

  // Main return for authenticated users
  return (
    <div className="min-h-screen bg-gray-50 pb-8 px-4 -mt-10"
         style={{ paddingTop: navHeight + 12 }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Properties</h1>
          <p className="text-gray-600">
            Showing {totalCount} properties {stableFilters.city && `in ${stableFilters.city}`}
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {Object.values(filters).filter(v => v && v !== 'all' && v !== 'active' && v !== 'created_at' && v !== 'desc' && v !== 1 && v !== 12).length > 0 && (
              <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                {Object.values(filters).filter(v => v && v !== 'all' && v !== 'active' && v !== 'created_at' && v !== 'desc' && v !== 1 && v !== 12).length}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar />
          </aside>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-40 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <FilterSidebar />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and View Options */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Found</span>
                  <span className="font-semibold text-gray-900">{totalCount} properties</span>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Items per page */}
                  <select
                    value={stableFilters.pageSize}
                    onChange={(e) => handleFilterChange('pageSize', parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="12">12 per page</option>
                    <option value="24">24 per page</option>
                    <option value="48">48 per page</option>
                    <option value="96">96 per page</option>
                  </select>
                  
                  {/* Sort Options */}
                  <select
                    value={`${stableFilters.sortBy}-${stableFilters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      handleFilterChange('sortBy', sortBy);
                      handleFilterChange('sortOrder', sortOrder);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="created_at-desc">Newest First</option>
                    <option value="created_at-asc">Oldest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="area_sqft-desc">Largest First</option>
                    <option value="area_sqft-asc">Smallest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading properties...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Error loading properties</p>
                  <p className="text-red-600 text-sm">{error.message}</p>
                </div>
              </div>
            )}

            {/* Properties Grid */}
            {!isLoading && !error && (
              <>
                {properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
                    <p className="text-gray-600">Try adjusting your filters or search criteria</p>
                    <button
                      onClick={resetFilters}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleFilterChange('page', Math.max(1, stableFilters.page - 1))}
                      disabled={stableFilters.page === 1}
                      className={`px-3 py-2 rounded-lg ${
                        stableFilters.page === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = idx + 1;
                        } else if (stableFilters.page <= 3) {
                          pageNum = idx + 1;
                        } else if (stableFilters.page >= totalPages - 2) {
                          pageNum = totalPages - 4 + idx;
                        } else {
                          pageNum = stableFilters.page - 2 + idx;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handleFilterChange('page', pageNum)}
                            className={`px-3 py-2 rounded-lg ${
                              stableFilters.page === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handleFilterChange('page', Math.min(totalPages, stableFilters.page + 1))}
                      disabled={stableFilters.page === totalPages}
                      className={`px-3 py-2 rounded-lg ${
                        stableFilters.page === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}