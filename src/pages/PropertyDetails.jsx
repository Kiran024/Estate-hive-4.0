import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '../services/propertyService';
import { Loader2, AlertCircle, MapPin, Bed, Bath, Car, Home, Heart, Share2, Calendar, Ruler } from 'lucide-react';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

export default function PropertyDetails() {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const mapContainer = useRef(null);
  const mapSectionRef = useRef(null);

  // Fetch property data from Supabase
  const { data: propertyResponse, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getPropertyById(id),
    enabled: !!id
  });
  
  const property = propertyResponse?.data;

  // Initialize map when property data is loaded
  useEffect(() => {
    if (!property?.latitude || !property?.longitude || !mapContainer.current) return;

    // Only initialize map if mapbox token is available
    if (mapboxgl.accessToken && mapboxgl.accessToken !== '') {
      try {
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [property.longitude, property.latitude],
          zoom: 13,
        });

        map.scrollZoom.disable();
        map.dragPan.disable();
        map.dragRotate.disable();
        map.touchZoomRotate.disable();

        const popupContent = document.createElement("div");
        popupContent.className = "p-2";
        const button = document.createElement("button");
        button.className =
          "bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-md hover:bg-blue-700";
        button.innerText = "Open in Google Maps";
        button.onclick = () => {
          const url = `https://www.google.com/maps?q=${property.latitude},${property.longitude}`;
          window.open(url, "_blank");
        };
        popupContent.appendChild(button);

        const popup = new mapboxgl.Popup({ offset: 40 }).setDOMContent(
          popupContent
        );

        const markerEl = document.createElement("div");
        markerEl.innerHTML = `
          <svg viewBox="0 0 24 24" width="32" height="32" fill="#ff0000" style="cursor: pointer;">
            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"/>
          </svg>
        `;

        new mapboxgl.Marker({ element: markerEl, anchor: "bottom" })
          .setLngLat([property.longitude, property.latitude])
          .setPopup(popup)
          .addTo(map);

        return () => map.remove();
      } catch (err) {
        console.error('Error initializing map:', err);
      }
    }
  }, [property]);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite functionality with Supabase
  };

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

  // Format price
  const formatPrice = (price) => {
    if (!price) return 'Price on Request';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading property details...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Property</h3>
          <p className="text-gray-600">{error.message || 'Something went wrong'}</p>
          <Link to="/properties" className="text-blue-600 hover:underline mt-4 inline-block">
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  // Not found state  
  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Not Found</h3>
          <p className="text-gray-600">The property you're looking for doesn't exist.</p>
          <Link to="/properties" className="text-blue-600 hover:underline mt-4 inline-block">
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  // Prepare image gallery
  const images = property.image_urls?.length > 0 
    ? property.image_urls 
    : property.featured_image 
    ? [property.featured_image]
    : ['/h01@300x-100.jpg'];
  
  const mainImage = images[0];
  const thumbnails = images.slice(1, 4);

  return (
    <div
  className="bg-gray-50 min-h-screen"
  style={{ paddingTop: `calc(var(--nav-height) + 0.25rem)` }}
>
      <div className="max-w-6xl mx-auto px-4">
        {/* Property Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{property.address}, {property.city}, {property.state}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleFavorite}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div>
              <img
                src={mainImage}
                alt={property.title}
                className="w-full h-[400px] object-cover rounded-xl shadow-lg"
                onError={(e) => {
                  e.target.src = '/h01@300x-100.jpg';
                }}
              />
              {thumbnails.length > 0 && (
                <div className="flex gap-4 mt-4">
                  {thumbnails.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${property.title}-${i + 1}`}
                      className="flex-1 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onError={(e) => {
                        e.target.src = '/h01@300x-100.jpg';
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Property Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description || 'No description available.'}
              </p>
            </div>

            {/* Property Features */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Bed className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="font-semibold">{property.bedrooms || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="font-semibold">{property.bathrooms || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Parking</p>
                    <p className="font-semibold">{property.parking_spaces || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="font-semibold">{property.area_sqft || 0} sq.ft</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-semibold capitalize">{property.property_type?.replace('_', ' ') || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Listed</p>
                    <p className="font-semibold">{formatDate(property.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Additional Features */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Property Details */}
              {(property.furnishing_status || property.facing_direction || property.year_built) && (
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Additional Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {property.furnishing_status && (
                      <div>
                        <p className="text-sm text-gray-500">Furnishing</p>
                        <p className="font-medium capitalize">{property.furnishing_status.replace('_', ' ')}</p>
                      </div>
                    )}
                    {property.facing_direction && (
                      <div>
                        <p className="text-sm text-gray-500">Facing</p>
                        <p className="font-medium">{property.facing_direction}</p>
                      </div>
                    )}
                    {property.year_built && (
                      <div>
                        <p className="text-sm text-gray-500">Year Built</p>
                        <p className="font-medium">{property.year_built}</p>
                      </div>
                    )}
                    {property.balconies > 0 && (
                      <div>
                        <p className="text-sm text-gray-500">Balconies</p>
                        <p className="font-medium">{property.balconies}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Price and Contact */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="mb-4">
                <p className="text-gray-500 text-sm">Price</p>
                <p className="text-3xl font-bold text-gray-900">{formatPrice(property.price)}</p>
                {property.price_per_sqft && (
                  <p className="text-sm text-gray-600 mt-1">
                    ₹{property.price_per_sqft}/sq.ft
                  </p>
                )}
              </div>

              {/* Property Status */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  property.status === 'active' ? 'bg-green-100 text-green-700' :
                  property.status === 'sold' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {property.status?.toUpperCase() || 'DRAFT'}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {property.category?.toUpperCase() || 'SALE'}
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
                    {property.subcategory === 'eh_commercial' ? 'EH COMMERCIAL' :
                     property.subcategory === 'eh_verified' ? 'EH VERIFIED' :
                     property.subcategory === 'eh_signature' ? 'EH SIGNATURE™' :
                     property.subcategory === 'eh_dubai' ? 'EH DUBAI' :
                     property.subcategory?.toUpperCase()}
                  </span>
                )}
                
                {property.is_verified && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    VERIFIED
                  </span>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Contact Agent
                </button>
                <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Schedule Visit
                </button>
              </div>

              {/* Property ID and Views */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Property ID</span>
                  <span className="font-medium">{property.property_code || `EH-${property.id}`}</span>
                </div>
                {property.views_count !== undefined && (
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Views</span>
                    <span className="font-medium">{property.views_count}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Location Map */}
        {(property.latitude && property.longitude) && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            {mapboxgl.accessToken && mapboxgl.accessToken !== '' ? (
              <div
                ref={mapContainer}
                className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg"
              />
            ) : (
              <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
                <iframe
                  title="Property Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_KEY&q=${property.latitude},${property.longitude}`}
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}