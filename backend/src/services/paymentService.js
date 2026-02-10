const { stripe } = require('../config/stripe');
const { supabaseAdmin } = require('../config/supabase');
const { logActivity } = require('./activityService');

/**
 * Handle successful checkout
 */
async function handleCheckoutCompleted(session) {
  try {
    const { client_reference_id: userId, customer: stripeCustomerId, metadata } = session;
    
    if (!userId) {
      console.error('No user ID in checkout session');
      return;
    }
    
    console.log(`Checkout completed for user: ${userId}`);
    
    // Update user profile
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({
        stripe_customer_id: stripeCustomerId,
        subscription_plan: metadata?.plan || 'PRO',
        credits: null // Unlimited for paid plans
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    // Log activity
    await logActivity(userId, 'subscription_created', {
      plan: metadata?.plan,
      billing_interval: metadata?.billing_interval,
      stripe_session_id: session.id
    });
    
    console.log(`User ${userId} upgraded to ${metadata?.plan} plan`);
    
  } catch (error) {
    console.error('Error handling checkout completed:', error);
  }
}

/**
 * Handle subscription changes
 */
async function handleSubscriptionChange(subscription) {
  try {
    const { customer: stripeCustomerId, status, items, current_period_end } = subscription;
    
    // Find user by stripe customer ID
    const { data: user, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('stripe_customer_id', stripeCustomerId)
      .single();
    
    if (!user) {
      console.error(`No user found for stripe customer: ${stripeCustomerId}`);
      return;
    }
    
    // Determine plan from subscription items
    let plan = 'PRO'; // Default
    const item = items.data[0];
    if (item && item.plan) {
      // This would need to be adjusted based on your actual Stripe product setup
      plan = item.plan.product === 'prod_ELITE' ? 'ELITE' : 'PRO';
    }
    
    // Update subscription in database
    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        plan: plan,
        status: status,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: stripeCustomerId,
        current_period_end: new Date(current_period_end * 1000).toISOString()
      }, {
        onConflict: 'stripe_subscription_id'
      });
    
    if (subError) throw subError;
    
    // Update user plan
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({ 
        subscription_plan: plan
      })
      .eq('id', user.id);
    
    if (updateError) throw updateError;
    
    await logActivity(user.id, 'subscription_updated', {
      plan: plan,
      status: status,
      period_end: new Date(current_period_end * 1000).toISOString()
    });
    
    console.log(`Subscription updated for user ${user.id}: ${plan} (${status})`);
    
  } catch (error) {
    console.error('Error handling subscription change:', error);
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDeleted(subscription) {
  try {
    const { customer: stripeCustomerId } = subscription;
    
    const { data: user, error: userError } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('stripe_customer_id', stripeCustomerId)
      .single();
    
    if (!user) return;
    
    // Downgrade user to FREE
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({ 
        subscription_plan: 'FREE',
        credits: 10
      })
      .eq('id', user.id);
    
    if (updateError) throw updateError;
    
    // Mark subscription as canceled
    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .update({ 
        status: 'canceled',
        cancel_at_period_end: true
      })
      .eq('stripe_subscription_id', subscription.id);
    
    if (subError) throw subError;
    
    await logActivity(user.id, 'subscription_canceled', {
      stripe_subscription_id: subscription.id
    });
    
    console.log(`User ${user.id} downgraded to FREE plan`);
    
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

module.exports = {
  handleCheckoutCompleted,
  handleSubscriptionChange,
  handleSubscriptionDeleted
};