import { supabase } from '../util/supabaseClient';

// Property Service Layer
export const propertyService = {
  // Fetch all properties with optional filters
  async getAllProperties(filters = {}) {
    try {
      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      
      if (filters.property_type && filters.property_type !== 'all') {
        query = query.eq('property_type', filters.property_type);
      }
      
      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      
      if (filters.subcategory && filters.subcategory !== 'all') {
        query = query.eq('subcategory', filters.subcategory);
      }
      
      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      
      if (filters.min_price) {
        query = query.gte('price', filters.min_price);
      }
      
      if (filters.max_price) {
        query = query.lte('price', filters.max_price);
      }
      
      if (filters.bedrooms) {
        query = query.eq('bedrooms', filters.bedrooms);
      }
      
      if (filters.bathrooms) {
        query = query.eq('bathrooms', filters.bathrooms);
      }
      
      if (filters.furnishing_status && filters.furnishing_status !== 'all') {
        query = query.eq('furnishing_status', filters.furnishing_status);
      }
      
      // Search by title or description
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Sorting
      const sortBy = filters.sortBy || 'created_at';
      const sortOrder = filters.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Pagination
      if (filters.page && filters.pageSize) {
        const from = (filters.page - 1) * filters.pageSize;
        const to = from + filters.pageSize - 1;
        query = query.range(from, to);
      } else if (filters.pageSize) {
        // If only pageSize is provided, get first page
        query = query.range(0, filters.pageSize - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return { 
        data: data || [], 
        count,
        error: null 
      };
    } catch (error) {
      console.error('Error fetching properties:', error);
      return { 
        data: [], 
        count: 0,
        error: error.message 
      };
    }
  },

  // Get a single property by ID
  async getPropertyById(id) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Increment view count
      await supabase
        .from('properties')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', id);

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching property:', error);
      return { data: null, error: error.message };
    }
  },

  // Create a new property
  async createProperty(propertyData) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        throw new Error('User not authenticated');
      }

      const propertyToCreate = {
        ...propertyData,
        created_by: userData.user.id,
        owner_id: userData.user.id,
        status: propertyData.status || 'draft',
        listed_date: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('properties')
        .insert(propertyToCreate)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error creating property:', error);
      return { data: null, error: error.message };
    }
  },

  // Update an existing property
  async updateProperty(id, updates) {
    try {
      // Remove computed fields
      const { created_at, updated_at, age_of_property, area_sqm, ...updateData } = updates;

      const { data, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error updating property:', error);
      return { data: null, error: error.message };
    }
  },

  // Delete a property
  async deleteProperty(id) {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting property:', error);
      return { success: false, error: error.message };
    }
  },

  // Upload property images
  async uploadPropertyImage(file, propertyId) {
    try {
      const fileName = `property-${propertyId}-${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { url: null, error: error.message };
    }
  },

  // Delete property image
  async deletePropertyImage(imageUrl) {
    try {
      const fileName = imageUrl.split('/').pop();
      
      const { error } = await supabase.storage
        .from('property-images')
        .remove([fileName]);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting image:', error);
      return { success: false, error: error.message };
    }
  },

  // Get featured properties
  async getFeaturedProperties(limit = 6) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_featured', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      return { data: [], error: error.message };
    }
  },

  // Get recent properties
  async getRecentProperties(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching recent properties:', error);
      return { data: [], error: error.message };
    }
  },

  // Get similar properties
  async getSimilarProperties(property, limit = 4) {
    try {
      // First try to get properties in the same neighborhood
      let { data: neighborhoodData, error: neighborhoodError } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'active')
        .neq('id', property.id)
        .eq('neighborhood', property.neighborhood)
        .eq('city', property.city)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (neighborhoodError) console.log('Neighborhood query error:', neighborhoodError);

      // If not enough properties in neighborhood, get from same city
      if (!neighborhoodData || neighborhoodData.length < limit) {
        const { data: cityData, error: cityError } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'active')
          .neq('id', property.id)
          .eq('city', property.city)
          .eq('property_type', property.property_type)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (cityError) throw cityError;

        // Combine and deduplicate
        const combinedData = [...(neighborhoodData || [])];
        const existingIds = new Set(combinedData.map(p => p.id));
        
        if (cityData) {
          cityData.forEach(p => {
            if (!existingIds.has(p.id) && combinedData.length < limit) {
              combinedData.push(p);
              existingIds.add(p.id);
            }
          });
        }

        return { data: combinedData, error: null };
      }

      return { data: neighborhoodData || [], error: null };
    } catch (error) {
      console.error('Error fetching similar properties:', error);
      return { data: [], error: error.message };
    }
  },

  // Toggle favorite
  async toggleFavorite(propertyId, userId) {
    try {
      // This would require a favorites table
      // For now, just increment the favorites count
      const { data: property } = await this.getPropertyById(propertyId);
      
      if (property) {
        const newCount = (property.favorites_count || 0) + 1;
        await supabase
          .from('properties')
          .update({ favorites_count: newCount })
          .eq('id', propertyId);
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return { success: false, error: error.message };
    }
  },

  // Get property statistics
  async getPropertyStatistics() {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('status, property_type, category, price')
        .eq('status', 'active');

      if (error) throw error;

      // Calculate statistics
      const stats = {
        total: data.length,
        byStatus: {},
        byType: {},
        byCategory: {},
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0
      };

      if (data.length > 0) {
        const prices = data.filter(p => p.price).map(p => p.price);
        stats.avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        stats.minPrice = Math.min(...prices);
        stats.maxPrice = Math.max(...prices);

        data.forEach(property => {
          // Count by status
          stats.byStatus[property.status] = (stats.byStatus[property.status] || 0) + 1;
          // Count by type
          stats.byType[property.property_type] = (stats.byType[property.property_type] || 0) + 1;
          // Count by category
          stats.byCategory[property.category] = (stats.byCategory[property.category] || 0) + 1;
        });
      }

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return { data: null, error: error.message };
    }
  },

  // Get unique cities from properties
  async getUniqueCities() {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('city')
        .eq('status', 'active')
        .not('city', 'is', null);

      if (error) throw error;

      // Get unique cities and filter out empty strings
      const uniqueCities = [...new Set(data.map(p => p.city).filter(city => city && city.trim()))]
        .sort((a, b) => a.localeCompare(b));

      return { data: uniqueCities, error: null };
    } catch (error) {
      console.error('Error fetching unique cities:', error);
      return { data: ['Bengaluru', 'Bangalore'], error: error.message }; // Fallback cities
    }
  },

  // Get unique property types from properties
  async getUniquePropertyTypes() {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('property_type')
        .eq('status', 'active')
        .not('property_type', 'is', null);

      if (error) throw error;

      // Get unique property types and filter out empty strings
      const uniqueTypes = [...new Set(data.map(p => p.property_type).filter(type => type && type.trim()))]
        .sort((a, b) => a.localeCompare(b));

      return { data: uniqueTypes, error: null };
    } catch (error) {
      console.error('Error fetching unique property types:', error);
      return { data: ['Apartment', 'Villa', 'Penthouse', 'Plot', 'Commercial'], error: error.message }; // Fallback types
    }
  }
};

export default propertyService;