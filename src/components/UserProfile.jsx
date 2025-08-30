import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEdit2, FiCamera, FiMail, FiPhone, FiMapPin, 
  FiUser, FiSave, FiX, FiCheck, FiHome, FiHeart,
  FiEye, FiCalendar, FiBriefcase, FiGlobe
} from 'react-icons/fi';
import { supabase } from '../util/supabaseClient';
import { userService } from '../services/userService';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    city: '',
    state: '',
    country: '',
    occupation: '',
    website: ''
  });

  const [stats, setStats] = useState({
    propertiesViewed: 0,
    propertiesSaved: 0,
    inquiriesSent: 0,
    memberSince: 'January 2024'
  });

  // Fetch user stats
  const fetchUserStats = async (userId) => {
    try {
      const userStats = await userService.getUserStats(userId);
      setStats({
        propertiesViewed: userStats.propertiesViewed || 0,
        propertiesSaved: userStats.propertiesSaved || 0,
        inquiriesSent: userStats.inquiriesSent || 0,
        memberSince: userStats.memberSince ? new Date(userStats.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Keep default values on error
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }
      
      setUser(user);
      
      // Try to fetch or create user profile with better error handling
      try {
        const profileData = await userService.getUserProfile(user.id);
        setProfile(profileData);
        setFormData({
          full_name: profileData.full_name || '',
          email: profileData.email || user.email || '',
          phone: profileData.phone || '',
          bio: profileData.bio || '',
          location: profileData.location || '',
          city: profileData.city || '',
          state: profileData.state || '',
          country: profileData.country || '',
          occupation: profileData.occupation || '',
          website: profileData.website || ''
        });
        
        // Fetch user statistics
        await fetchUserStats(user.id);
      } catch (profileError) {
        console.error('Error with profile data:', profileError);
        // Create a basic profile object if database fails
        const basicProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          phone: '',
          bio: '',
          location: '',
          city: '',
          state: '',
          country: '',
          occupation: '',
          website: ''
        };
        setProfile(basicProfile);
        setFormData({
          full_name: basicProfile.full_name,
          email: basicProfile.email,
          phone: '',
          bio: '',
          location: '',
          city: '',
          state: '',
          country: '',
          occupation: '',
          website: ''
        });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await userService.updateUserProfile(user.id, formData);
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const avatarUrl = await userService.uploadAvatar(user.id, file);
      setProfile({ ...profile, avatar_url: avatarUrl });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8"
        >
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Profile Info */}
          <div className="relative px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-20 sm:-mt-16 gap-6">
              {/* Avatar */}
              <div className="relative group">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={formData.full_name || 'Profile'} 
                      className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl object-cover bg-white"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
                      <FiUser className="text-white text-4xl" />
                    </div>
                  )}
                  
                  <label className="absolute bottom-2 right-2 bg-white p-2 rounded-lg shadow-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiCamera className={`text-gray-600 ${uploadingAvatar ? 'animate-pulse' : ''}`} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                    />
                  </label>
                </motion.div>
              </div>

              {/* Name and Bio */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900">
                  {formData.full_name || user?.email?.split('@')[0] || 'User'}
                </h1>
                <p className="text-gray-600 mt-1">{formData.bio || 'No bio added yet'}</p>
                <div className="flex flex-wrap gap-4 mt-4 justify-center sm:justify-start">
                  {formData.location && (
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <FiMapPin className="text-gray-400" />
                      {formData.city && `${formData.city}, `}{formData.state}
                    </span>
                  )}
                  {formData.occupation && (
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <FiBriefcase className="text-gray-400" />
                      {formData.occupation}
                    </span>
                  )}
                  {formData.website && (
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <FiGlobe className="text-gray-400" />
                      {formData.website}
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg"
              >
                {isEditing ? (
                  <>
                    <FiX /> Cancel
                  </>
                ) : (
                  <>
                    <FiEdit2 /> Edit Profile
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Properties Viewed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.propertiesViewed}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <FiEye className="text-indigo-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Saved Properties</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.propertiesSaved}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <FiHeart className="text-pink-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Inquiries Sent</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.inquiriesSent}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiMail className="text-purple-600 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Member Since</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stats.memberSince}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FiCalendar className="text-green-600 text-xl" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'profile' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'settings' 
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8"
              >
                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="your@email.com"
                          disabled
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Occupation
                        </label>
                        <input
                          type="text"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="Real Estate Agent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="San Francisco"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="California"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="United States"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FiSave /> Save Changes
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="text-lg font-medium text-gray-900">{formData.full_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-lg font-medium text-gray-900">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-lg font-medium text-gray-900">{formData.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Occupation</p>
                        <p className="text-lg font-medium text-gray-900">{formData.occupation || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="text-lg font-medium text-gray-900">
                          {formData.city || formData.state ? `${formData.city}${formData.city && formData.state ? ', ' : ''}${formData.state}` : 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Country</p>
                        <p className="text-lg font-medium text-gray-900">{formData.country || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Website</p>
                        <p className="text-lg font-medium text-gray-900">{formData.website || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bio</p>
                      <p className="text-lg text-gray-900">{formData.bio || 'No bio added yet'}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-gray-700">Email notifications for new properties</span>
                        <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-gray-700">SMS alerts for price drops</span>
                        <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-gray-700">Newsletter subscription</span>
                        <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" defaultChecked />
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-gray-700">Make profile public</span>
                        <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <span className="text-gray-700">Show contact information</span>
                        <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                    >
                      Delete Account
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;