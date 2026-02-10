const { supabaseAdmin } = require('../config/supabase');
const { logActivity } = require('./activityService');

/**
 * Save a calculation to the database
 */
async function saveCalculation(userId, calculationType, inputData, resultData) {
  try {
    const { data, error } = await supabaseAdmin
      .from('calculations')
      .insert({
        user_id: userId,
        calculation_type: calculationType,
        input_data: inputData,
        result_data: resultData,
        credits_used: 1
      })
      .select()
      .single();
    
    if (error) {
      console.error('Calculation save error:', error);
      throw error;
    }
    
    // Log activity
    await logActivity(userId, 'calculation_saved', {
      calculation_type: calculationType,
      calculation_id: data.id
    });
    
    return data;
  } catch (error) {
    console.error('Error saving calculation:', error);
    throw new Error(`Failed to save calculation: ${error.message}`);
  }
}

/**
 * Get calculation history for a user
 */
async function getCalculationHistory(userId, limit = 20, offset = 0) {
  try {
    const { data, error } = await supabaseAdmin
      .from('calculations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching calculation history:', error);
    throw new Error(`Failed to fetch calculation history: ${error.message}`);
  }
}

/**
 * Get calculation statistics
 */
async function getCalculationStats(userId) {
  try {
    // Total calculations
    const { count: totalCount, error: countError } = await supabaseAdmin
      .from('calculations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (countError) throw countError;
    
    // Calculations by type
    const { data: byType, error: typeError } = await supabaseAdmin
      .from('calculations')
      .select('calculation_type')
      .eq('user_id', userId);
    
    if (typeError) throw typeError;
    
    const typeCounts = {};
    (byType || []).forEach(calc => {
      typeCounts[calc.calculation_type] = (typeCounts[calc.calculation_type] || 0) + 1;
    });
    
    // Today's calculations
    const today = new Date().toISOString().split('T')[0];
    const { count: todayCount, error: todayError } = await supabaseAdmin
      .from('calculations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lte('created_at', `${today}T23:59:59.999Z`);
    
    if (todayError) throw todayError;
    
    return {
      total: totalCount || 0,
      byType: typeCounts,
      today: todayCount || 0,
      averagePerDay: totalCount ? Math.round((totalCount / 30) * 10) / 10 : 0
    };
  } catch (error) {
    console.error('Error getting calculation stats:', error);
    throw error;
  }
}

/**
 * Delete a calculation
 */
async function deleteCalculation(userId, calculationId) {
  try {
    const { error } = await supabaseAdmin
      .from('calculations')
      .delete()
      .eq('id', calculationId)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    await logActivity(userId, 'calculation_deleted', {
      calculation_id: calculationId
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting calculation:', error);
    throw error;
  }
}

module.exports = {
  saveCalculation,
  getCalculationHistory,
  getCalculationStats,
  deleteCalculation
};