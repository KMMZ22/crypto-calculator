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
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        subscription_plan: metadata?.plan || 'PRO'
      })
      .eq('id', userId);

    if (profileError) throw profileError;

    // Allocate AI credits based on plan
    const plan = metadata?.plan?.toLowerCase() || 'pro';
    const creditsAmount = plan === 'elite' ? 50 : 20;

    const { error: creditsError } = await supabaseAdmin
      .from('ai_credits')
      .upsert({
        user_id: userId,
        credits_remaining: creditsAmount,
        monthly_limit: creditsAmount
      }, { onConflict: 'user_id' });

    if (creditsError) console.error('Failed to allocate credits:', creditsError);

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

    // Find user by stripe customer ID (In profiles table, does it have stripe_customer_id?)
    // Let's assume we map via subscriptions table or the profiles table directly.
    // For safety, since we might missing stripe_customer_id in profiles, we rely on the subscriptions table.
    const { data: sub } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', stripeCustomerId)
      .single();

    if (!sub) {
      console.error(`No user found for stripe customer: ${stripeCustomerId}`);
      return;
    }
    const userId = sub.user_id;

    // Determine plan from subscription items or metadata
    let plan = 'PRO'; // Default
    const item = items.data[0];
    if (item && item.price && item.price.metadata && item.price.metadata.plan) {
      plan = item.price.metadata.plan.toUpperCase();
    } else if (subscription.metadata && subscription.metadata.plan) {
      plan = subscription.metadata.plan.toUpperCase();
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
      .from('profiles')
      .update({
        subscription_plan: plan.toLowerCase()
      })
      .eq('id', userId);

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