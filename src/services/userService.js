import { supabase } from '../util/supabaseClient';

export const userService = {
  // Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        return this.createUserProfile(userId);
      }
      
      if (error && error.code === '42P01') {
        // Table doesn't exist - return basic profile
        console.warn('Users table does not exist. Please run database setup.');
        const { data: { user } } = await supabase.auth.getUser();
        return {
          id: userId,
          email: user?.email || '',
          full_name: user?.user_metadata?.full_name || '',
          avatar_url: user?.user_metadata?.avatar_url || '',
          created_at: new Date().toISOString()
        };
      }
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      // Return basic profile on any error
      const { data: { user } } = await supabase.auth.getUser();
      return {
        id: userId,
        email: user?.email || '',
        full_name: user?.user_metadata?.full_name || '',
        avatar_url: user?.user_metadata?.avatar_url || '',
        created_at: new Date().toISOString()
      };
    }
  },

  // Create user profile
  async createUserProfile(userId) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('No authenticated user');
    
    const profile = {
      id: userId,
      email: user.email,
      full_name: user.user_metadata?.full_name || '',
      avatar_url: user.user_metadata?.avatar_url || '',
      phone: '',
      bio: '',
      location: '',
      city: '',
      state: '',
      country: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('users')
      .insert([profile])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Upload avatar
  async uploadAvatar(userId, file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    await this.updateUserProfile(userId, {
      avatar_url: data.publicUrl
    });

    return data.publicUrl;
  },

  // Get user stats
  async getUserStats(userId) {
    try {
      // Get saved properties count
      const { count: savedCount } = await supabase
        .from('saved_properties')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get property views count
      const { count: viewsCount } = await supabase
        .from('property_views')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get inquiries count
      const { count: inquiriesCount } = await supabase
        .from('property_inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get user creation date
      const { data: userData } = await supabase
        .from('users')
        .select('created_at')
        .eq('id', userId)
        .single();

      return {
        propertiesViewed: viewsCount || 0,
        propertiesSaved: savedCount || 0,
        inquiriesSent: inquiriesCount || 0,
        memberSince: userData?.created_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        propertiesViewed: 0,
        propertiesSaved: 0,
        inquiriesSent: 0,
        memberSince: new Date().toISOString()
      };
    }
  },

  // Record property view
  async recordPropertyView(userId, propertyId) {
    try {
      await supabase
        .from('property_views')
        .insert([{
          user_id: userId,
          property_id: propertyId,
          viewed_at: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Error recording property view:', error);
    }
  },

  // Create property inquiry
  async createInquiry(userId, propertyId, inquiryData) {
    const { data, error } = await supabase
      .from('property_inquiries')
      .insert([{
        user_id: userId,
        property_id: propertyId,
        message: inquiryData.message,
        contact_phone: inquiryData.phone,
        inquiry_type: inquiryData.type || 'general'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};