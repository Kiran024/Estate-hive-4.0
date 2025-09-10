// Property Types and Enums
export const PropertyType = {
  RESIDENTIAL: 'Residential',
  COMMERCIAL: 'commercial',
  LAND: 'Land',
  INDUSTRIAL: 'industrial',
  AGRICULTURAL: 'agricultural',
  MIXED_USE: 'mixed_use'
};

export const PropertyStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PENDING: 'pending',
  UNDER_CONTRACT: 'under_contract',
  SOLD: 'sold',
  RENTED: 'rented',
  INACTIVE: 'inactive',
  EXPIRED: 'expired'
};

export const PropertyCategory = {
  SALE: 'sale',
  RENT: 'rent',
  LEASE: 'lease',
  RENT_TO_OWN: 'rent_to_own'
};

export const FurnishingStatus = {
  FURNISHED: 'furnished',
  SEMI_FURNISHED: 'semi_furnished',
  UNFURNISHED: 'unfurnished'
};

// Property Interface (JavaScript version)
export const createProperty = (data = {}) => ({
  id: data.id || null,
  created_at: data.created_at || new Date().toISOString(),
  updated_at: data.updated_at || new Date().toISOString(),
  created_by: data.created_by || null,
  agent_id: data.agent_id || null,
  owner_id: data.owner_id || null,
  title: data.title || '',
  description: data.description || null,
  property_code: data.property_code || null,
  property_type: data.property_type || PropertyType.RESIDENTIAL,
  property_subtype: data.property_subtype || null,
  category: data.category || PropertyCategory.SALE,
  status: data.status || PropertyStatus.DRAFT,
  
  // Location
  address: data.address || null,
  unit_number: data.unit_number || null,
  city: data.city || null,
  state: data.state || null,
  country: data.country || 'India',
  postal_code: data.postal_code || null,
  neighborhood: data.neighborhood || null,
  latitude: data.latitude || null,
  longitude: data.longitude || null,
  
  // Pricing
  price: data.price || null,
  original_price: data.original_price || null,
  price_per_sqft: data.price_per_sqft || null,
  currency: data.currency || 'INR',
  price_negotiable: data.price_negotiable || false,
  rent_amount: data.rent_amount || null,
  rent_frequency: data.rent_frequency || null,
  security_deposit: data.security_deposit || null,
  maintenance_fee: data.maintenance_fee || null,
  
  // Specifications
  area_sqft: data.area_sqft || null,
  area_sqm: data.area_sqm || null,
  plot_area: data.plot_area || null,
  built_up_area: data.built_up_area || null,
  carpet_area: data.carpet_area || null,
  bedrooms: data.bedrooms || null,
  bathrooms: data.bathrooms || null,
  balconies: data.balconies || 0,
  total_rooms: data.total_rooms || null,
  parking_spaces: data.parking_spaces || 0,
  covered_parking: data.covered_parking || 0,
  floor_number: data.floor_number || null,
  total_floors: data.total_floors || null,
  
  // Property Details
  year_built: data.year_built || null,
  possession_date: data.possession_date || null,
  age_of_property: data.age_of_property || null,
  furnishing_status: data.furnishing_status || null,
  facing_direction: data.facing_direction || null,
  property_condition: data.property_condition || null,
  
  // Media
  image_urls: data.image_urls || [],
  video_urls: data.video_urls || [],
  virtual_tour_url: data.virtual_tour_url || null,
  floor_plan_urls: data.floor_plan_urls || [],
  document_urls: data.document_urls || [],
  featured_image: data.featured_image || null,
  
  // Features
  amenities: data.amenities || [],
  nearby_facilities: data.nearby_facilities || {},
  
  // Meta
  is_verified: data.is_verified || false,
  verified_at: data.verified_at || null,
  verified_by: data.verified_by || null,
  is_featured: data.is_featured || false,
  featured_until: data.featured_until || null,
  slug: data.slug || null,
  meta_title: data.meta_title || null,
  meta_description: data.meta_description || null,
  keywords: data.keywords || [],
  
  // Analytics
  views_count: data.views_count || 0,
  inquiries_count: data.inquiries_count || 0,
  favorites_count: data.favorites_count || 0,
  shares_count: data.shares_count || 0,
  
  // Dates
  listed_date: data.listed_date || new Date().toISOString(),
  expiry_date: data.expiry_date || null,
  last_price_update: data.last_price_update || null,
  
  metadata: data.metadata || {}
});

// Helper functions
export const formatPrice = (price, currency = 'INR') => {
  if (!price) return 'Price on Request';
  
  if (currency === 'INR') {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  }
  
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency 
  }).format(price);
};

export const getStatusBadgeConfig = (status) => {
  const configs = {
    [PropertyStatus.DRAFT]: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
    [PropertyStatus.ACTIVE]: { label: 'Active', className: 'bg-green-100 text-green-700' },
    [PropertyStatus.PENDING]: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
    [PropertyStatus.UNDER_CONTRACT]: { label: 'Under Contract', className: 'bg-orange-100 text-orange-700' },
    [PropertyStatus.SOLD]: { label: 'Sold', className: 'bg-blue-100 text-blue-700' },
    [PropertyStatus.RENTED]: { label: 'Rented', className: 'bg-purple-100 text-purple-700' },
    [PropertyStatus.INACTIVE]: { label: 'Inactive', className: 'bg-gray-100 text-gray-500' },
    [PropertyStatus.EXPIRED]: { label: 'Expired', className: 'bg-red-100 text-red-700' }
  };
  
  return configs[status] || configs[PropertyStatus.ACTIVE];
};

export const getCategoryBadgeConfig = (category) => {
  const configs = {
    [PropertyCategory.SALE]: { label: 'For Sale', className: 'bg-blue-50 text-blue-600' },
    [PropertyCategory.RENT]: { label: 'For Rent', className: 'bg-purple-50 text-purple-600' },
    [PropertyCategory.LEASE]: { label: 'For Lease', className: 'bg-orange-50 text-orange-600' },
    [PropertyCategory.RENT_TO_OWN]: { label: 'Rent to Own', className: 'bg-green-50 text-green-600' }
  };
  
  return configs[category] || configs[PropertyCategory.SALE];
};