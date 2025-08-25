import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Heart, 
  Share2,
  Camera,
  IndianRupee,
  Home,
  Car
} from 'lucide-react';
import { formatPrice, getStatusBadgeConfig, getCategoryBadgeConfig } from '../../types/property.types';

const PropertyCard = ({ property, onFavorite, onShare }) => {
  if (!property) return null;

  const statusConfig = getStatusBadgeConfig(property.status);
  const categoryConfig = getCategoryBadgeConfig(property.category);
  
  // Get the first image or use placeholder
  const mainImage = property.image_urls?.[0] || 
                    property.featured_image || 
                    '/h01@300x-100.jpg';
  
  const imageCount = property.image_urls?.length || 0;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavorite) onFavorite(property.id);
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) onShare(property);
  };

  return (
    <Link to={`/property/${property.id}`} className="block">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden bg-gray-200">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = '/h01@300x-100.jpg';
            }}
          />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.className}`}>
              {statusConfig.label}
            </span>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryConfig.className}`}>
              {categoryConfig.label}
            </span>
          </div>
          
          {/* Image Count */}
          {imageCount > 0 && (
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-2 py-1 rounded-lg flex items-center gap-1">
              <Camera className="w-4 h-4" />
              <span className="text-sm">{imageCount}</span>
            </div>
          )}
          
          {/* Actions */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={handleFavoriteClick}
              className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
              aria-label="Add to favorites"
            >
              <Heart className="w-4 h-4 text-gray-700 hover:text-red-500 transition-colors" />
            </button>
            <button
              onClick={handleShareClick}
              className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
              aria-label="Share property"
            >
              <Share2 className="w-4 h-4 text-gray-700 hover:text-blue-500 transition-colors" />
            </button>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-5">
          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-bold text-gray-800">
              {formatPrice(property.price || property.rent_amount)}
            </h3>
            {property.price_negotiable && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                Negotiable
              </span>
            )}
          </div>
          
          {/* Title */}
          <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
            {property.title || 'Untitled Property'}
          </h4>
          
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
          <div className="flex items-center text-gray-600 mb-3">
            <Home className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm capitalize">
              {property.property_type?.replace('_', ' ')} 
              {property.property_subtype && ` - ${property.property_subtype}`}
            </span>
          </div>
          
          {/* Features */}
          <div className="flex items-center justify-between text-gray-600 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-3">
              {property.bedrooms !== null && (
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.bedrooms}</span>
                </div>
              )}
              
              {property.bathrooms !== null && (
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
          
          {/* Additional Info */}
          {property.is_featured && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                Featured Property
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;