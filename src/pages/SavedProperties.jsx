import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Home, MapPin, Bed, Bath, Car, Square, 
  IndianRupee, Trash2, ExternalLink, Filter,
  Search, SortDesc, Grid, List, Eye, Calendar, RefreshCw,
  Camera, Share2, Maximize2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { wishlistService } from '../services/wishlistService';
import { propertyService } from '../services/propertyService';
import WishlistButton from '../components/common/WishlistButton';
// Format price function
const formatPrice = (price) => {
  if (!price) return '0';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (numPrice >= 10000000) {
    return `${(numPrice / 10000000).toFixed(2)} Cr`;
  } else if (numPrice >= 100000) {
    return `${(numPrice / 100000).toFixed(2)} L`;
  }
  return numPrice.toLocaleString('en-IN');
};

const SavedProperties = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('saved_date');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchSavedProperties();
  }, [user]);
  
  // Refresh when the page gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        fetchSavedProperties();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);
      const saved = await wishlistService.getSavedProperties(user.id);
      console.log('Fetched saved properties:', saved);
      setSavedProperties(saved || []);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      setSavedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProperty = async (propertyId) => {
    try {
      await wishlistService.removeFromWishlist(user.id, propertyId);
      setSavedProperties(prev => prev.filter(item => item.property.id !== propertyId));
    } catch (error) {
      console.error('Error removing property:', error);
    }
  };

  const handleViewProperty = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  const filteredProperties = savedProperties
    .filter(item => {
      if (!item || !item.property) return false;
      const property = item.property;
      const matchesSearch = (property.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                           (property.location?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || property.property_type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.property.price - b.property.price;
        case 'price_high':
          return b.property.price - a.property.price;
        case 'saved_date':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'title':
          return a.property.title.localeCompare(b.property.title);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your saved properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Saved Properties</h1>
              <p className="text-gray-600 mt-1">
                {savedProperties.length} {savedProperties.length === 1 ? 'property' : 'properties'} in your wishlist
              </p>
            </div>
            
            {/* Refresh Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchSavedProperties}
              className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Filters and Search */}
        {savedProperties.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="saved_date">Recently Saved</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="title">Title A-Z</option>
              </select>

              {/* Clear All */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                  setSortBy('saved_date');
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Properties Grid/List */}
        {filteredProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-white rounded-2xl shadow-sm p-12 max-w-lg mx-auto">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {searchQuery || filterType !== 'all' ? 'No matching properties' : 'No saved properties yet'}
              </h3>
              <p className="text-gray-600 mb-8">
                {searchQuery || filterType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start exploring properties and save your favorites to see them here'
                }
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/properties')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                <Home className="w-4 h-4" />
                Browse Properties
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredProperties.map((item, index) => {
                const property = item.property;
                return (
                  <motion.div
                    key={item.id || `saved-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col"
                  >
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
                          {property.status?.toUpperCase() || 'ACTIVE'}
                        </span>
                      </div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          property.category === 'sale' ? 'bg-blue-100 text-blue-700' :
                          property.category === 'rent' ? 'bg-purple-100 text-purple-700' :
                          property.category === 'lease' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          For {property.category?.charAt(0).toUpperCase() + property.category?.slice(1) || 'Sale'}
                        </span>
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
                            // Share functionality
                            if (navigator.share) {
                              navigator.share({
                                title: property.title,
                                text: property.description,
                                url: `${window.location.origin}/property/${property.id}`,
                              });
                            } else {
                              navigator.clipboard.writeText(`${window.location.origin}/property/${property.id}`);
                              alert('Property link copied to clipboard!');
                            }
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
                          ₹{formatPrice(property.price || property.rent_amount)}
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
                            .join(', ') || property.location || 'Location not specified'}
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
                          
                          {property.parking_spaces > 0 && (
                            <div className="flex items-center">
                              <Car className="w-4 h-4 mr-1" />
                              <span className="text-sm">{property.parking_spaces}</span>
                            </div>
                          )}
                          
                          {property.area > 0 && (
                            <div className="flex items-center">
                              <Maximize2 className="w-4 h-4 mr-1" />
                              <span className="text-sm">{property.area} sqft</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Saved Date */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Saved {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => handleRemoveProperty(property.id)}
                          className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Quick Actions */}
        {savedProperties.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to take the next step?</h3>
            <p className="text-white/90 mb-6">
              Contact our experts to schedule property visits or get detailed information
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/contact-us')}
                className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Contact Expert
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/properties')}
                className="px-6 py-3 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Browse More Properties
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SavedProperties;