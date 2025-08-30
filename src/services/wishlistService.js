import { supabase } from '../util/supabaseClient';

export const wishlistService = {
  // Get all saved properties for a user
  async getSavedProperties(userId) {
    try {
      const { data: savedData, error } = await supabase
        .from('saved_properties')
        .select('id, property_id, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          console.warn('saved_properties table does not exist');
          return [];
        }
        throw error;
      }

      if (!savedData || savedData.length === 0) {
        return [];
      }

      // Get the property details from propertyService
      const { propertyService } = await import('./propertyService');
      const { data: allProperties } = await propertyService.getAllProperties();
      
      // Map saved properties with their details
      const savedPropertiesWithDetails = savedData
        .map(saved => {
          const property = allProperties?.find(p => p.id === saved.property_id);
          if (property) {
            return {
              id: saved.id,
              created_at: saved.created_at,
              property: property
            };
          }
          return null;
        })
        .filter(item => item !== null);

      return savedPropertiesWithDetails;
    } catch (error) {
      console.error('Error getting saved properties:', error);
      return [];
    }
  },

  // Add property to wishlist
  async addToWishlist(userId, propertyId) {
    try {
      // Check if already saved
      const { data: existing, error: checkError } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('user_id', userId)
        .eq('property_id', propertyId)
        .single();

      if (checkError && checkError.code !== 'PGRST116' && checkError.code !== '42P01') {
        throw checkError;
      }

      if (existing) {
        throw new Error('Property already saved');
      }

      const { data, error } = await supabase
        .from('saved_properties')
        .insert([{
          user_id: userId,
          property_id: propertyId
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '42P01') {
          console.error('saved_properties table does not exist. Please run database setup.');
          throw new Error('Database not configured. Please contact support.');
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  },

  // Remove property from wishlist
  async removeFromWishlist(userId, propertyId) {
    const { error } = await supabase
      .from('saved_properties')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);

    if (error) throw error;
    return true;
  },

  // Check if property is saved by user
  async isPropertySaved(userId, propertyId) {
    if (!userId || !propertyId) return false;

    try {
      const { data, error } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('user_id', userId)
        .eq('property_id', propertyId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found - property not saved
          return false;
        }
        if (error.code === '42P01') {
          // Table doesn't exist
          console.warn('saved_properties table does not exist');
          return false;
        }
        console.error('Error checking saved property:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in isPropertySaved:', error);
      return false;
    }
  },

  // Get saved properties count for user
  async getSavedCount(userId) {
    try {
      const { count, error } = await supabase
        .from('saved_properties')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) {
        if (error.code === '42P01') {
          console.warn('saved_properties table does not exist');
          return 0;
        }
        console.error('Error getting saved count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getSavedCount:', error);
      return 0;
    }
  },

  // Toggle property saved status
  async toggleWishlist(userId, propertyId) {
    const isSaved = await this.isPropertySaved(userId, propertyId);
    
    if (isSaved) {
      await this.removeFromWishlist(userId, propertyId);
      return false;
    } else {
      await this.addToWishlist(userId, propertyId);
      return true;
    }
  },

  // Get wishlist statistics
  async getWishlistStats(userId) {
    const { data, error } = await supabase
      .from('saved_properties')
      .select(`
        id,
        created_at,
        property:properties(property_type, category, price)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error getting wishlist stats:', error);
      return {
        total: 0,
        byType: {},
        byCategory: {},
        averagePrice: 0
      };
    }

    const properties = data || [];
    const stats = {
      total: properties.length,
      byType: {},
      byCategory: {},
      averagePrice: 0
    };

    let totalPrice = 0;
    let priceCount = 0;

    properties.forEach(item => {
      if (item.property) {
        const { property_type, category, price } = item.property;
        
        // Count by type
        stats.byType[property_type] = (stats.byType[property_type] || 0) + 1;
        
        // Count by category
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
        
        // Calculate average price
        if (price && !isNaN(price)) {
          totalPrice += parseFloat(price);
          priceCount++;
        }
      }
    });

    if (priceCount > 0) {
      stats.averagePrice = totalPrice / priceCount;
    }

    return stats;
  },

  // Get recent saved properties
  async getRecentSaved(userId, limit = 5) {
    const { data, error } = await supabase
      .from('saved_properties')
      .select(`
        id,
        created_at,
        property:properties(
          id,
          title,
          price,
          location,
          images,
          property_type
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
};