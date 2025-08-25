import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import PropertyCard from './PropertyCard';
import PropertyFilters from './PropertyFilters';
import { propertyService } from '../../services/propertyService';
import { supabase } from '../../util/supabaseClient';
import { Loader2, AlertCircle, Home } from 'lucide-react';

const PropertyGrid = ({ 
  showFilters = true, 
  category = null, 
  limit = null,
  featured = false 
}) => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'active',
    property_type: 'all',
    category: category || 'all',
    city: '',
    min_price: '',
    max_price: '',
    bedrooms: '',
    bathrooms: '',
    furnishing_status: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const [page, setPage] = useState(1);
  const pageSize = limit || 12;

  // Fetch properties using React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['properties', filters, page, pageSize, featured],
    queryFn: async () => {
      if (featured) {
        return await propertyService.getFeaturedProperties(limit);
      }
      
      return await propertyService.getAllProperties({
        ...filters,
        page,
        pageSize
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  });

  const properties = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleFavorite = async (propertyId) => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await propertyService.toggleFavorite(propertyId, user.id);
      refetch();
    } else {
      alert('Please login to save favorites');
    }
  };

  const handleShare = (property) => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.origin + `/property/${property.id}`
      });
    } else {
      // Fallback - copy to clipboard
      const url = window.location.origin + `/property/${property.id}`;
      navigator.clipboard.writeText(url);
      alert('Property link copied to clipboard!');
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Properties</h3>
        <p className="text-gray-600 mb-4">{error.message || 'Something went wrong'}</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      {showFilters && (
        <PropertyFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
          totalCount={totalCount}
        />
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading properties...</span>
        </div>
      ) : (
        <>
          {/* Results Count */}
          {showFilters && (
            <div className="mb-6 text-gray-600">
              Found <span className="font-semibold text-gray-900">{totalCount}</span> properties
            </div>
          )}

          {/* Property Grid */}
          {properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onFavorite={handleFavorite}
                    onShare={handleShare}
                  />
                ))}
              </div>

              {/* Pagination */}
              {!limit && totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 rounded-lg ${
                            page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    {totalPages > 5 && (
                      <>
                        <span className="px-2 py-2">...</span>
                        <button
                          onClick={() => setPage(totalPages)}
                          className={`px-4 py-2 rounded-lg ${
                            page === totalPages
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <Home className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-600">Try adjusting your filters or search criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyGrid;