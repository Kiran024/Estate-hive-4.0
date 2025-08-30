import React, { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import { formatPrice, getStatusBadgeConfig, getCategoryBadgeConfig } from '../types/property.types';
import { 
  Loader2, AlertCircle, MapPin, Bed, Bath, Car, Home, Heart, Share2, 
  Calendar, Ruler, Phone, Mail, Building, IndianRupee, Eye,
  CheckCircle, XCircle, Star, Users, Trees, Shield, Wifi,
  ChevronLeft, ChevronRight, X, Maximize2, ArrowRight
} from 'lucide-react';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAuth } from '../contexts/AuthContext';
import LoginPromptOverlay from '../components/auth/LoginPromptOverlay';
import WishlistButton from '../components/common/WishlistButton';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

export default function PropertyDetailsEnhanced() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const mapContainer = useRef(null);

  // Fetch property data
  const { data: propertyResponse, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getPropertyById(id),
    enabled: !!id,
    retry: 2
  });

  const property = propertyResponse?.data;

  // Fetch similar properties - get more for carousel
  const { data: similarPropertiesResponse } = useQuery({
    queryKey: ['similar-properties', property?.id, property?.city],
    queryFn: () => propertyService.getSimilarProperties(property, 12), // Get more properties for carousel
    enabled: !!property
  });

  const similarProperties = similarPropertiesResponse?.data || [];
  
  // Carousel state
  const [carouselIndex, setCarouselIndex] = useState(0);
  const itemsPerView = 3; // Number of items visible at once
  const maxIndex = Math.max(0, Math.ceil(similarProperties.length / itemsPerView) - 1);

  // Initialize map
  useEffect(() => {
    if (!property?.latitude || !property?.longitude || !mapContainer.current) return;

    if (mapboxgl.accessToken && mapboxgl.accessToken !== '') {
      try {
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [property.longitude, property.latitude],
          zoom: 14,
        });

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

        new mapboxgl.Marker({ color: '#FF0000' })
          .setLngLat([property.longitude, property.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-bold">${property.title}</h3>
                  <p class="text-sm">${property.address}</p>
                  <a href="https://www.google.com/maps?q=${property.latitude},${property.longitude}" 
                     target="_blank" 
                     class="text-blue-600 text-sm hover:underline">
                    Open in Google Maps
                  </a>
                </div>
              `)
          )
          .addTo(map);

        return () => map.remove();
      } catch (err) {
        console.error('Error initializing map:', err);
      }
    }
  }, [property]);

  // Removed handleFavorite - now handled by WishlistButton

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: `Check out this property: ${property?.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Property link copied to clipboard!');
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Prepare images
  const images = property?.image_urls?.length > 0 
    ? property.image_urls 
    : ['/h01@300x-100.jpg'];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show login overlay
  if (!user) {
    return (
      <LoginPromptOverlay 
        showOverlay={true}
        title="Sign In to View Property Details"
        subtitle="Get access to complete property information, photos, and direct owner contact"
      >
        <div className="min-h-screen bg-gray-50">
          {/* Show blurred property preview */}
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Blurred header image */}
              <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
              
              {/* Blurred content sections */}
              <div className="p-8 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                
                <div className="space-y-3 mt-8">
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LoginPromptOverlay>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error?.message || `We couldn't find property with ID ${id}`}
          </p>
          <button 
            onClick={() => navigate('/properties')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Properties
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusBadgeConfig(property.status);
  const categoryConfig = getCategoryBadgeConfig(property.category);

  return (
   <div className="bg-gray-50 min-h-screen"
      style={{ paddingTop: `calc(var(--nav-height) + -3.5rem)` }}>
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/properties" className="text-gray-500 hover:text-gray-700">Properties</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{property.title}</span>
          </nav>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="w-8 h-8" />
          </button>
          
          <button
            onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
            className="absolute left-4 text-white hover:text-gray-300"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <img
            src={images[selectedImageIndex]}
            alt={property.title}
            className="max-w-full max-h-[90vh] object-contain"
            onError={(e) => { e.target.src = '/h01@300x-100.jpg'; }}
          />
          
          <button
            onClick={() => setSelectedImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
            className="absolute right-4 text-white hover:text-gray-300"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Property Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.className}`}>
                  {statusConfig.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryConfig.className}`}>
                  {categoryConfig.label}
                </span>
                
                {/* EH Category Badge */}
                {property.subcategory && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                    property.subcategory === 'eh_commercial' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                    property.subcategory === 'eh_verified' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                    property.subcategory === 'eh_signature' ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white' :
                    property.subcategory === 'eh_dubai' ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {property.subcategory === 'eh_commercial' ? '🏢 EH Commercial' :
                     property.subcategory === 'eh_verified' ? '✓ EH Verified' :
                     property.subcategory === 'eh_signature' ? '⭐ EH Signature™' :
                     property.subcategory === 'eh_dubai' ? '🌍 EH Dubai' :
                     property.subcategory}
                  </span>
                )}
                
                {property.is_verified && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
                {property.is_featured && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{[property.address, property.neighborhood, property.city, property.state]
                    .filter(Boolean).join(', ')}</span>
                </div>
                {property.views_count !== undefined && (
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{property.views_count} views</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <WishlistButton 
                propertyId={parseInt(id)} 
                variant="default"
                size="lg"
              />
              <button
                onClick={handleShare}
                className="p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src={images[selectedImageIndex]}
                  alt={property.title}
                  className="w-full h-[500px] object-cover cursor-pointer"
                  onClick={() => setShowImageModal(true)}
                  onError={(e) => { e.target.src = '/h01@300x-100.jpg'; }}
                />
                <button
                  onClick={() => setShowImageModal(true)}
                  className="absolute top-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-black/70"
                >
                  <Maximize2 className="w-4 h-4" />
                  View Gallery ({images.length})
                </button>
              </div>
              
              {images.length > 1 && (
                <div className="p-4 grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative cursor-pointer rounded-lg overflow-hidden ${
                        idx === selectedImageIndex ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${property.title} ${idx + 1}`}
                        className="w-full h-24 object-cover hover:scale-110 transition-transform"
                        onError={(e) => { e.target.src = '/h01@300x-100.jpg'; }}
                      />
                      {idx === 3 && images.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold">
                          +{images.length - 4}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.bedrooms !== null && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bed className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{property.bedrooms}</p>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms !== null && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bath className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{property.bathrooms}</p>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                  </div>
                )}
                {property.parking_spaces !== null && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Car className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{property.parking_spaces}</p>
                    <p className="text-sm text-gray-600">Parking</p>
                  </div>
                )}
                {property.area_sqft && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Ruler className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{property.area_sqft}</p>
                    <p className="text-sm text-gray-600">Sq.ft</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {property.description || `Welcome to ${property.title}. This exceptional ${property.property_type} property is available for ${property.category} in ${property.city}. 

Located in the prime area of ${property.neighborhood || property.city}, this property offers excellent connectivity and modern amenities. ${property.bedrooms ? `With ${property.bedrooms} spacious bedrooms and ${property.bathrooms} well-appointed bathrooms, ` : ''}this property is perfect for ${property.category === 'sale' ? 'families looking for their dream home' : 'those seeking a comfortable living space'}.

${property.area_sqft ? `Spanning ${property.area_sqft} square feet, the property provides ample space for comfortable living. ` : ''}${property.amenities?.length > 0 ? `Key amenities include ${property.amenities.slice(0, 3).join(', ')} and more.` : ''}

Don't miss this opportunity to ${property.category === 'sale' ? 'own' : 'rent'} this beautiful property in one of the most sought-after locations.`}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium capitalize">{property.property_type?.replace('_', ' ')}</span>
                  </div>
                  {property.property_subtype && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Sub Type</span>
                      <span className="font-medium">{property.property_subtype}</span>
                    </div>
                  )}
                  {property.furnishing_status && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Furnishing</span>
                      <span className="font-medium capitalize">{property.furnishing_status.replace('_', ' ')}</span>
                    </div>
                  )}
                  {property.floor_number !== null && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Floor</span>
                      <span className="font-medium">{property.floor_number} of {property.total_floors || 'N/A'}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {property.year_built && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Year Built</span>
                      <span className="font-medium">{property.year_built}</span>
                    </div>
                  )}
                  {property.facing_direction && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Facing</span>
                      <span className="font-medium">{property.facing_direction}</span>
                    </div>
                  )}
                  {property.balconies > 0 && (
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Balconies</span>
                      <span className="font-medium">{property.balconies}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Listed On</span>
                    <span className="font-medium">{formatDate(property.listed_date || property.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Map */}
            {(property.latitude && property.longitude) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                <div className="mb-4">
                  <p className="text-gray-600">
                    {[property.address, property.neighborhood, property.city, property.state, property.country]
                      .filter(Boolean).join(', ')}
                  </p>
                </div>
                <div
                  ref={mapContainer}
                  className="w-full h-[400px] rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Right Column - Price and Contact */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Price</span>
                  {property.price_negotiable && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Negotiable
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {formatPrice(property.price || property.rent_amount)}
                </p>
                {property.rent_frequency && (
                  <p className="text-sm text-gray-600">per {property.rent_frequency}</p>
                )}
                {property.price_per_sqft && (
                  <p className="text-sm text-gray-600 mt-1">
                    ₹{property.price_per_sqft.toLocaleString()}/sq.ft
                  </p>
                )}
              </div>

              {/* EMI Calculator (for sale properties) */}
              {property.category === 'sale' && property.price && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">Estimated EMI</p>
                  <p className="text-xl font-bold text-blue-900">
                    ₹{Math.round(property.price * 0.007).toLocaleString()}/month
                  </p>
                  <p className="text-xs text-blue-700 mt-1">@ 8.5% for 20 years</p>
                </div>
              )}

              {/* Contact Actions */}
              <div className="space-y-3">
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Owner
                </button>
                <button className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Send Inquiry
                </button>
                <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Schedule Site Visit
                </button>
              </div>

              {/* Property ID */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Property ID</span>
                  <span className="font-medium font-mono">
                    {property.property_code || `EH${String(property.id).padStart(5, '0')}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Posted by</span>
                  <span className="font-medium">{property.created_by || 'Owner'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Similar Properties in {property.city || 'this area'}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCarouselIndex(Math.max(0, carouselIndex - itemsPerView))}
                  disabled={carouselIndex === 0}
                  className={`p-2 rounded-lg transition-colors ${
                    carouselIndex === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCarouselIndex(Math.min(maxIndex, carouselIndex + itemsPerView))}
                  disabled={carouselIndex >= maxIndex}
                  className={`p-2 rounded-lg transition-colors ${
                    carouselIndex >= maxIndex 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="relative overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out gap-6"
                style={{ transform: `translateX(-${carouselIndex * (100 / itemsPerView + 2)}%)` }}
              >
                {similarProperties.map((similar) => (
                  <Link 
                    key={similar.id} 
                    to={`/property/${similar.id}`}
                    className="flex-shrink-0 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                    style={{ width: `calc(${100 / itemsPerView}% - 1rem)` }}
                  >
                    <img
                      src={similar.image_urls?.[0] || '/h01@300x-100.jpg'}
                      alt={similar.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => { e.target.src = '/h01@300x-100.jpg'; }}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{similar.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {similar.neighborhood || similar.city}
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatPrice(similar.price || similar.rent_amount)}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-gray-600 text-sm">
                        {similar.bedrooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" /> {similar.bedrooms}
                          </span>
                        )}
                        {similar.bathrooms && (
                          <span className="flex items-center gap-1">
                            <Bath className="w-4 h-4" /> {similar.bathrooms}
                          </span>
                        )}
                        {similar.area_sqft && (
                          <span className="flex items-center gap-1">
                            <Ruler className="w-4 h-4" /> {similar.area_sqft} sqft
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Carousel indicators */}
            <div className="flex justify-center gap-1 mt-4">
              {Array.from({ length: Math.ceil(similarProperties.length / itemsPerView) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index * itemsPerView)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    Math.floor(carouselIndex / itemsPerView) === index 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}