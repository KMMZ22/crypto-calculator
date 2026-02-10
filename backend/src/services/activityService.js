const { supabaseAdmin } = require('../config/supabase');

/**
 * Log user activity
 */
async function logActivity(userId, action, metadata = {}, request = null) {
  try {
    const activityData = {
      user_id: userId,
      action: action,
      metadata: metadata
    };
    
    // Add request info if available
    if (request) {
      activityData.endpoint = request.originalUrl || request.url;
      activityData.ip_address = request.ip || 
        request.headers['x-forwarded-for'] || 
        request.connection.remoteAddress;
      activityData.user_agent = request.headers['user-agent'];
    }
    
    const { data, error } = await supabaseAdmin
      .from('activity_logs')
      .insert(activityData);
    
    if (error) {
      console.warn('Failed to log activity:', error.message);
    }
    
    return data;
  } catch (error) {
    console.warn('Error logging activity:', error.message);
    // Don't throw to avoid interrupting main flow
  }
}

/**
 * Get user activities
 */
async function getUserActivities(userId, limit = 50) {
  try {
    const { data, error } = await supabaseAdmin
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user activities:', error);
    throw error;
  }
}

module.exports = {
  logActivity,
  getUserActivities
};